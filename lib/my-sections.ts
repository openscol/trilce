import "server-only";
import type { createClient } from "@/lib/supabase/server";
import type { AppContext } from "@/lib/auth/context";

// Secciones del año con las que trabaja el usuario: la administración, todas;
// el docente, donde dicta un curso o las que tiene asignadas. Es un filtro de
// pantalla; el permiso real está en RLS (can_take_attendance, 97_asistencia.sql),
// con la misma regla.
export async function loadMySections(supabase: Awaited<ReturnType<typeof createClient>>, ctx: AppContext, year: number) {
  const { data: allGroups } = await supabase
    .from("class_groups")
    .select("id, level, grade, section")
    .eq("school_id", ctx.schoolId!)
    .eq("academic_year", year)
    .order("level", { ascending: true })
    .order("grade", { ascending: true })
    .order("section", { ascending: true });

  const groups = allGroups ?? [];
  if (ctx.role === "admin" || ctx.role === "administrativo") return groups;

  const [{ data: offerings }, { data: assigned }] = await Promise.all([
    supabase.from("course_offerings").select("class_group_id").eq("teacher_id", ctx.targetId ?? ""),
    supabase.from("staff_assigned_sections").select("level, grade, section").eq("staff_id", ctx.targetId ?? ""),
  ]);
  const taught = new Set((offerings ?? []).map((o) => o.class_group_id));
  return groups.filter(
    (g) =>
      taught.has(g.id) ||
      (assigned ?? []).some((a) => a.level === g.level && a.grade === g.grade && (a.section === null || a.section === g.section))
  );
}
