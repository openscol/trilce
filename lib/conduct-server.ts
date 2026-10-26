import "server-only";
import type { createClient } from "@/lib/supabase/server";
import { DEFAULT_FALTAS_PER_SHEET, type ConductCategory, type ConductEntry, type ConductKind } from "@/lib/conduct";

type Supabase = Awaited<ReturnType<typeof createClient>>;

// Tipos con sus normas, en orden. Sin includeInactive, solo las normas activas.
export async function loadConductCatalog(supabase: Supabase, schoolId: string, includeInactive = false) {
  const [{ data: categories }, { data: norms }, { data: settings }] = await Promise.all([
    supabase.from("conduct_categories").select("id, name, kind, position").eq("school_id", schoolId).order("position").order("name"),
    supabase.from("conduct_norms").select("id, category_id, description, active, position").eq("school_id", schoolId).order("position").order("description"),
    supabase.from("conduct_settings").select("faltas_per_sheet").eq("school_id", schoolId).maybeSingle(),
  ]);
  const catalog: ConductCategory[] = (categories ?? []).map((c) => ({
    ...c,
    norms: (norms ?? []).filter((n) => n.category_id === c.id && (includeInactive || n.active)).map((n) => ({ id: n.id, description: n.description, active: n.active, position: n.position })),
  }));
  return { categories: catalog, faltasPerSheet: settings?.faltas_per_sheet ?? DEFAULT_FALTAS_PER_SHEET };
}

const ENTRY_SELECT = "id, student_id, date, created_at, note, sheet_id, conduct_norms(description, conduct_categories(name, kind)), staff_members(full_name)";

type EntryRow = {
  id: string;
  student_id: string;
  date: string;
  created_at: string;
  note: string | null;
  sheet_id: string | null;
  conduct_norms: { description: string; conduct_categories: { name: string; kind: ConductKind } | null } | null;
  staff_members: { full_name: string } | null;
};

const toEntry = (r: EntryRow): ConductEntry => ({
  id: r.id,
  student_id: r.student_id,
  date: r.date,
  created_at: r.created_at,
  note: r.note,
  sheet_id: r.sheet_id,
  norm: r.conduct_norms?.description ?? "",
  category: r.conduct_norms?.conduct_categories?.name ?? "",
  kind: r.conduct_norms?.conduct_categories?.kind ?? "registro",
  recorded_by: r.staff_members?.full_name ?? null,
});

// Registros de una sección en un día (RLS decide si el usuario puede verlos).
export async function loadGroupDay(supabase: Supabase, classGroupId: string, date: string) {
  const { data } = await supabase.from("conduct_records").select(ENTRY_SELECT).eq("class_group_id", classGroupId).eq("date", date).order("created_at");
  return ((data ?? []) as EntryRow[]).map(toEntry);
}

// Historial de uno o varios alumnos, lo más reciente primero.
export async function loadStudentHistory(supabase: Supabase, studentIds: string[]) {
  if (studentIds.length === 0) return { entries: [], sheets: [] };
  const [{ data: records }, { data: sheets }] = await Promise.all([
    supabase.from("conduct_records").select(ENTRY_SELECT).in("student_id", studentIds).order("date", { ascending: false }).order("created_at", { ascending: false }).limit(500),
    supabase.from("conduct_reflection_sheets").select("id, number, student_id, date").in("student_id", studentIds).order("date", { ascending: false }),
  ]);
  return { entries: ((records ?? []) as EntryRow[]).map(toEntry), sheets: sheets ?? [] };
}
