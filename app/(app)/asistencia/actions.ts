"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ATTENDANCE_STATUSES, type AttendanceStatus } from "@/lib/attendance";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

// Un cambio en la cuadrícula: `status` null borra la marca de ese día.
export type MarkChange = { studentId: string; date: string; status: AttendanceStatus | null };

export async function saveMarks(
  classGroupId: string,
  changes: MarkChange[]
): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para pasar lista." };
  }
  if (changes.length === 0) return undefined;
  if (changes.some((c) => !/^\d{4}-\d{2}-\d{2}$/.test(c.date) || (c.status !== null && !ATTENDANCE_STATUSES.includes(c.status)))) {
    return { error: "Hay una marca de asistencia que no es válida." };
  }

  const supabase = await createClient();
  const dates = [...new Set(changes.map((c) => c.date))];

  for (const date of dates) {
    // Quién puede editar qué fecha lo decide RLS (can_edit_attendance); se
    // consulta antes solo para dar un mensaje claro en vez de un error genérico.
    const { data: canEdit } = await supabase.rpc("can_edit_attendance", {
      target_class_group_id: classGroupId,
      target_date: date,
    });
    if (!canEdit) {
      return {
        error:
          ctx.role === "docente"
            ? "Solo puedes marcar la asistencia del día de hoy. Para otra fecha, pide el cambio en la administración."
            : "No tienes permiso para pasar lista en esta sección.",
      };
    }

    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .upsert({ class_group_id: classGroupId, date, taken_by: ctx.targetId }, { onConflict: "class_group_id,date" })
      .select("id")
      .single();
    if (sessionError || !session) return { error: "No se pudo guardar la asistencia." };

    const ofDate = changes.filter((c) => c.date === date);
    const marked = ofDate.filter((c) => c.status !== null);
    const cleared = ofDate.filter((c) => c.status === null).map((c) => c.studentId);

    if (marked.length > 0) {
      const { error } = await supabase.from("attendance_records").upsert(
        marked.map((c) => ({ session_id: session.id, student_id: c.studentId, status: c.status! })),
        { onConflict: "session_id,student_id" }
      );
      if (error) return { error: "No se pudieron guardar las marcas de asistencia." };
    }
    if (cleared.length > 0) {
      const { error } = await supabase.from("attendance_records").delete().eq("session_id", session.id).in("student_id", cleared);
      if (error) return { error: "No se pudieron borrar las marcas de asistencia." };
    }
  }

  revalidatePath("/asistencia");
  return undefined;
}

// Vincula a su sección real a los alumnos que solo tienen nivel/grado/sección
// como texto (ver link_students_to_class_groups en 97_asistencia.sql).
export async function linkStudentsToSections(
  academicYear: number
): Promise<{ error: string } | { linked: number }> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !["admin", "administrativo"].includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para vincular alumnos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("link_students_to_class_groups", {
    p_school_id: ctx.schoolId,
    p_academic_year: academicYear,
  });
  if (error) return { error: "No se pudo vincular a los alumnos." };

  revalidatePath("/asistencia");
  return { linked: data ?? 0 };
}
