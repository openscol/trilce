import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { monthDays, studentName, tally, type AttendanceStatus, type Tally } from "@/lib/attendance";

export type MonthlyRow = {
  id: string;
  code: string;
  documentNumber: string | null;
  name: string;
  // Estado por fecha ISO; sin clave = ese día no tiene marca.
  marks: Record<string, AttendanceStatus>;
  totals: Tally;
};

export type MonthlyReport = {
  days: ReturnType<typeof monthDays>;
  // Fechas en las que sí se pasó lista.
  takenDates: Set<string>;
  rows: MonthlyRow[];
};

// Asistencia de una sección en un mes. Devuelve null si el usuario no puede
// ver la lista de esa sección (lo decide attendance_roster / RLS).
export async function loadMonthlyReport(supabase: SupabaseClient<Database>, classGroupId: string, month: string): Promise<MonthlyReport | null> {
  const days = monthDays(month);
  const [{ data: roster, error }, { data: sessions }] = await Promise.all([
    supabase.rpc("attendance_roster", { p_class_group_id: classGroupId }),
    supabase
      .from("attendance_sessions")
      .select("date, attendance_records(student_id, status)")
      .eq("class_group_id", classGroupId)
      .gte("date", days[0].iso)
      .lte("date", days[days.length - 1].iso),
  ]);
  if (error) return null;

  const marksByStudent = new Map<string, Record<string, AttendanceStatus>>();
  for (const s of sessions ?? []) {
    for (const r of s.attendance_records) {
      const marks = marksByStudent.get(r.student_id) ?? {};
      marks[s.date] = r.status;
      marksByStudent.set(r.student_id, marks);
    }
  }

  const rows = (roster ?? [])
    .filter((s) => s.status === "activo" || marksByStudent.has(s.id))
    .map((s) => {
      const marks = marksByStudent.get(s.id) ?? {};
      return { id: s.id, code: s.code, documentNumber: s.document_number, name: studentName(s), marks, totals: tally(Object.values(marks)) };
    });

  return { days, takenDates: new Set((sessions ?? []).map((s) => s.date)), rows };
}
