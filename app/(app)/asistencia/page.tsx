import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { longDate, parseDateParam, tally, todayInLima, type AttendanceStatus } from "@/lib/attendance";
import { DatePicker } from "./date-picker";
import { LinkStudentsButton } from "./link-students-button";

export default async function AsistenciaPage(props: PageProps<"/asistencia">) {
  const ctx = await requireAppContext();
  const searchParams = await props.searchParams;
  const date = parseDateParam(searchParams.fecha);
  const year = Number(date.slice(0, 4));
  const isAdmin = ctx.role === "admin" || ctx.role === "administrativo";

  if (!isAdmin && ctx.role !== "docente") {
    return <p className="text-sm text-muted-foreground">La asistencia la registran los docentes y la administración del colegio.</p>;
  }

  const supabase = await createClient();
  const { data: allGroups } = await supabase
    .from("class_groups")
    .select("id, level, grade, section")
    .eq("school_id", ctx.schoolId!)
    .eq("academic_year", year)
    .order("level", { ascending: true })
    .order("grade", { ascending: true })
    .order("section", { ascending: true });

  // El docente solo ve sus secciones: donde dicta un curso o las que tiene
  // asignadas. Es un filtro de pantalla; el permiso real está en RLS
  // (can_take_attendance, 97_asistencia.sql), con la misma regla.
  let groups = allGroups ?? [];
  if (!isAdmin) {
    const [{ data: offerings }, { data: assigned }] = await Promise.all([
      supabase.from("course_offerings").select("class_group_id").eq("teacher_id", ctx.targetId ?? ""),
      supabase.from("staff_assigned_sections").select("level, grade, section").eq("staff_id", ctx.targetId ?? ""),
    ]);
    const taught = new Set((offerings ?? []).map((o) => o.class_group_id));
    groups = groups.filter(
      (g) =>
        taught.has(g.id) ||
        (assigned ?? []).some((a) => a.level === g.level && a.grade === g.grade && (a.section === null || a.section === g.section))
    );
  }

  // Con una sola sección no hay nada que elegir: se va directo a la cuadrícula.
  if (!isAdmin && groups.length === 1 && !searchParams.fecha) redirect(`/asistencia/${groups[0].id}`);

  const groupIds = groups.map((g) => g.id);
  const { data: sessions } = groupIds.length
    ? await supabase.from("attendance_sessions").select("class_group_id, attendance_records(status)").eq("date", date).in("class_group_id", groupIds)
    : { data: [] };
  const byGroup = new Map((sessions ?? []).map((s) => [s.class_group_id, tally(s.attendance_records.map((r) => r.status as AttendanceStatus))]));

  let unlinked = 0;
  if (isAdmin) {
    const { count } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("school_id", ctx.schoolId!)
      .eq("status", "activo")
      .is("class_group_id", null);
    unlinked = count ?? 0;
  }

  const month = date.slice(0, 7);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Asistencia</h1>
          <p className="text-sm text-muted-foreground first-letter:uppercase">
            {longDate(date)}
            {date === todayInLima() ? " · hoy" : ""}
          </p>
        </div>
        <DatePicker date={date} max={todayInLima()} />
      </div>

      {isAdmin && unlinked > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border p-4">
          <p className="text-sm">
            Hay {unlinked} alumno(s) activos sin sección asignada: no aparecen en ninguna lista. Se pueden vincular automáticamente cuando su nivel, grado y sección coinciden
            con una sección de {year}; el resto se asigna desde la ficha del alumno.
          </p>
          <LinkStudentsButton year={year} />
        </div>
      )}

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sección</TableHead>
              <TableHead>Lista del día</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  {isAdmin ? `No hay secciones creadas para ${year}. Créalas en Configuración → Secciones.` : `No tienes secciones asignadas en ${year}.`}
                </TableCell>
              </TableRow>
            )}
            {groups.map((g) => {
              const t = byGroup.get(g.id);
              const absent = t ? t.falta + t.falta_justificada : 0;
              const late = t ? t.tardanza + t.tardanza_justificada : 0;
              return (
                <TableRow key={g.id}>
                  <TableCell>
                    <Link href={`/asistencia/${g.id}?mes=${month}`} className="font-medium hover:underline">
                      {LEVEL_LABELS[g.level]} {g.grade}
                      {g.section}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {t ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <Badge>Tomada</Badge>
                        <span className="text-sm text-muted-foreground">
                          {t.presente} asistieron · {late} tardanzas · {absent} faltas
                        </span>
                      </span>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/asistencia/${g.id}?mes=${month}`} className="text-sm text-brand-green-text hover:underline">
                      Pasar lista
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
