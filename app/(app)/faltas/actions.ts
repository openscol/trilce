"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { todayInLima } from "@/lib/attendance";
import { CONDUCT_KINDS, DEFAULT_FALTAS_PER_SHEET, type ConductKind } from "@/lib/conduct";

type Result = { error: string } | undefined;

const STAFF_ROLES = ["admin", "administrativo", "docente"];
const ADMIN_ROLES = ["admin", "administrativo"];

// Los mensajes que lanza la base de datos (permiso ya usado, norma desactivada...)
// ya están escritos para el usuario; los técnicos no se muestran.
const dbMessage = (error: { message: string } | null, fallback: string) => (error?.message && !/violates|permission|row-level|syntax|JSON|function/i.test(error.message) ? error.message : fallback);

async function session(roles: string[]) {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !roles.includes(ctx.role ?? "")) return null;
  return { ctx, supabase: await createClient() };
}

// Registra la norma para cada alumno elegido. Devuelve los alumnos que con esto
// llegaron al número de faltas del día que pide ficha de reflexión.
export async function registerConduct(
  studentIds: string[],
  normId: string,
  note: string
): Promise<{ error: string; reached?: string[] } | { reached: string[] }> {
  const s = await session(STAFF_ROLES);
  if (!s) return { error: "No tienes permiso para registrar faltas." };
  if (studentIds.length === 0) return { error: "Elige al menos un alumno." };
  const { ctx, supabase } = s;

  // Uno por uno: si a un alumno no se le puede registrar (por ejemplo, ya usó
  // su permiso de hoy), los demás sí quedan registrados.
  const errors: string[] = [];
  for (const studentId of studentIds) {
    const { error } = await supabase.from("conduct_records").insert({ student_id: studentId, norm_id: normId, note: note.trim() || null });
    if (error) errors.push(dbMessage(error, "No se pudo registrar."));
  }

  const reached = await studentsAtLimit(supabase, ctx.schoolId!, studentIds);
  revalidatePath("/faltas");
  if (errors.length) {
    const unique = [...new Set(errors)];
    return { error: errors.length === studentIds.length && unique.length === 1 ? unique[0] : `${errors.length} de ${studentIds.length} no se registraron: ${unique.join(" ")}`, reached };
  }
  return { reached };
}

// Alumnos con N o más faltas hoy que aún no están en una ficha.
async function studentsAtLimit(supabase: Awaited<ReturnType<typeof createClient>>, schoolId: string, studentIds: string[]) {
  const [{ data: settings }, { data: rows }] = await Promise.all([
    supabase.from("conduct_settings").select("faltas_per_sheet").eq("school_id", schoolId).maybeSingle(),
    supabase
      .from("conduct_records")
      .select("student_id, conduct_norms!inner(conduct_categories!inner(kind))")
      .in("student_id", studentIds)
      .eq("date", todayInLima())
      .is("sheet_id", null)
      .eq("conduct_norms.conduct_categories.kind", "falta"),
  ]);
  const limit = settings?.faltas_per_sheet ?? DEFAULT_FALTAS_PER_SHEET;
  const count = new Map<string, number>();
  for (const r of rows ?? []) count.set(r.student_id, (count.get(r.student_id) ?? 0) + 1);
  return studentIds.filter((id) => (count.get(id) ?? 0) >= limit);
}

export async function deleteConductRecord(recordId: string): Promise<Result> {
  const s = await session(STAFF_ROLES);
  if (!s) return { error: "No tienes permiso." };
  const { data, error } = await s.supabase.from("conduct_records").delete().eq("id", recordId).select("id");
  if (error || !data?.length) {
    return { error: s.ctx.role === "docente" ? "Solo puedes borrar registros del día de hoy. Para otra fecha, pide el cambio en la administración." : "No se pudo borrar el registro." };
  }
  revalidatePath("/faltas");
  return undefined;
}

// Una ficha (con su acta) por alumno, con sus faltas de hoy. Devuelve los ids para imprimirlas.
export async function generateSheets(studentIds: string[], teacherId: string | null, assistantId: string | null, place: string): Promise<{ error: string } | { sheetIds: string[] }> {
  const s = await session(STAFF_ROLES);
  if (!s) return { error: "No tienes permiso para generar fichas." };
  const sheetIds: string[] = [];
  for (const studentId of studentIds) {
    const { data, error } = await s.supabase.rpc("create_reflection_sheet", {
      p_student_id: studentId,
      ...(teacherId ? { p_teacher_id: teacherId } : {}),
      ...(assistantId ? { p_assistant_id: assistantId } : {}),
    });
    if (error || !data) return { error: dbMessage(error, "No se pudo generar la ficha.") };
    sheetIds.push(data);
    // El lugar va en el acta; si no se guarda, el acta sale con el renglón en blanco.
    if (place.trim()) await s.supabase.from("conduct_reflection_sheets").update({ place: place.trim().slice(0, 80) }).eq("id", data);
  }
  revalidatePath("/faltas");
  return { sheetIds };
}

// Las faltas de la ficha vuelven al conteo del día.
export async function deleteSheet(sheetId: string): Promise<Result> {
  const s = await session(STAFF_ROLES);
  if (!s) return { error: "No tienes permiso." };
  const { data, error } = await s.supabase.from("conduct_reflection_sheets").delete().eq("id", sheetId).select("id");
  if (error || !data?.length) return { error: "No se pudo eliminar la ficha." };
  revalidatePath("/faltas");
  return undefined;
}

// --- Normas (solo la administración) ----------------------------------------

export async function saveCategory(input: { id?: string; name: string; kind: ConductKind }): Promise<Result> {
  const s = await session(ADMIN_ROLES);
  if (!s) return { error: "Solo la administración edita las normas." };
  const name = input.name.trim();
  if (!name) return { error: "Escribe el nombre del tipo." };
  if (!CONDUCT_KINDS.includes(input.kind)) return { error: "Elige qué es este tipo." };

  let error;
  if (input.id) {
    ({ error } = await s.supabase.from("conduct_categories").update({ name, kind: input.kind }).eq("id", input.id));
  } else {
    const { count } = await s.supabase.from("conduct_categories").select("id", { count: "exact", head: true }).eq("school_id", s.ctx.schoolId!);
    ({ error } = await s.supabase.from("conduct_categories").insert({ school_id: s.ctx.schoolId!, name, kind: input.kind, position: (count ?? 0) + 1 }));
  }
  if (error) return { error: error.code === "23505" ? "Ya existe un tipo con ese nombre." : "No se pudo guardar el tipo." };
  revalidatePath("/faltas");
  return undefined;
}

export async function deleteCategory(categoryId: string): Promise<Result> {
  const s = await session(ADMIN_ROLES);
  if (!s) return { error: "Solo la administración edita las normas." };
  const { error } = await s.supabase.from("conduct_categories").delete().eq("id", categoryId);
  if (error) return { error: error.code === "23503" ? "Este tipo todavía tiene normas. Elimínalas o muévelas a otro tipo primero." : "No se pudo eliminar el tipo." };
  revalidatePath("/faltas");
  return undefined;
}

export async function saveNorm(input: { id?: string; categoryId: string; description: string; active: boolean }): Promise<Result> {
  const s = await session(ADMIN_ROLES);
  if (!s) return { error: "Solo la administración edita las normas." };
  const description = input.description.trim();
  if (!description) return { error: "Escribe la norma." };

  let error;
  if (input.id) {
    ({ error } = await s.supabase.from("conduct_norms").update({ category_id: input.categoryId, description, active: input.active }).eq("id", input.id));
  } else {
    const { count } = await s.supabase.from("conduct_norms").select("id", { count: "exact", head: true }).eq("category_id", input.categoryId);
    ({ error } = await s.supabase.from("conduct_norms").insert({ school_id: s.ctx.schoolId!, category_id: input.categoryId, description, active: input.active, position: (count ?? 0) + 1 }));
  }
  if (error) return { error: "No se pudo guardar la norma." };
  revalidatePath("/faltas");
  return undefined;
}

// Una norma con registros es parte del historial de los alumnos: no se borra, se desactiva.
export async function deleteNorm(normId: string): Promise<{ error: string } | { deactivated: boolean }> {
  const s = await session(ADMIN_ROLES);
  if (!s) return { error: "Solo la administración edita las normas." };
  const { error } = await s.supabase.from("conduct_norms").delete().eq("id", normId);
  if (error?.code === "23503") {
    const { error: updateError } = await s.supabase.from("conduct_norms").update({ active: false }).eq("id", normId);
    if (updateError) return { error: "No se pudo desactivar la norma." };
    revalidatePath("/faltas");
    return { deactivated: true };
  }
  if (error) return { error: "No se pudo eliminar la norma." };
  revalidatePath("/faltas");
  return { deactivated: false };
}

export async function saveFaltasPerSheet(value: number): Promise<Result> {
  const s = await session(ADMIN_ROLES);
  if (!s) return { error: "Solo la administración cambia esta configuración." };
  if (!Number.isInteger(value) || value < 1 || value > 20) return { error: "Debe ser un número entre 1 y 20." };
  const { error } = await s.supabase.from("conduct_settings").upsert({ school_id: s.ctx.schoolId!, faltas_per_sheet: value });
  if (error) return { error: "No se pudo guardar." };
  revalidatePath("/faltas");
  return undefined;
}
