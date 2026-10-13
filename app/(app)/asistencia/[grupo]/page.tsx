import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, DownloadIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { monthLabel, parseMonthParam, todayInLima } from "@/lib/attendance";
import { loadMonthlyReport } from "@/lib/attendance-report";
import { DatePicker } from "../date-picker";
import { AttendanceGrid } from "./attendance-grid";

export default async function AsistenciaSeccionPage(props: PageProps<"/asistencia/[grupo]">) {
  const ctx = await requireAppContext();
  const { grupo } = await props.params;
  const today = todayInLima();
  const month = parseMonthParam((await props.searchParams).mes);
  const supabase = await createClient();

  const { data: group } = await supabase.from("class_groups").select("id, level, grade, section").eq("id", grupo).eq("school_id", ctx.schoolId!).maybeSingle();
  if (!group) notFound();
  const title = `${LEVEL_LABELS[group.level]} ${group.grade}${group.section}`;

  const report = await loadMonthlyReport(supabase, grupo, month);
  if (!report) return <p className="text-sm text-muted-foreground">No tienes permiso para ver la asistencia de {title}.</p>;

  // Qué días se pueden marcar (lo mismo que can_edit_attendance en la base):
  // la administración, cualquier día hasta hoy; el docente, solo hoy.
  const isAdmin = ctx.role === "admin" || ctx.role === "administrativo";
  const editableDates = report.days.filter((d) => (isAdmin ? d.iso <= today : d.iso === today)).map((d) => d.iso);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/asistencia" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        Asistencia
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Asistencia de {title}</h1>
          <p className="text-sm text-muted-foreground first-letter:uppercase">{monthLabel(month)}</p>
        </div>
        <div className="flex items-end gap-2">
          <DatePicker date={month} max={today.slice(0, 7)} month />
          <a href={`/asistencia/${grupo}/exportar?mes=${month}`} className={cn(buttonVariants({ variant: "outline" }))}>
            <DownloadIcon />
            Exportar Excel
          </a>
        </div>
      </div>

      {report.rows.length === 0 ? (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
          Esta sección no tiene alumnos vinculados. Asígnales la sección desde la ficha del alumno o usa «Vincular automáticamente» en la pantalla de Asistencia.
        </p>
      ) : (
        <AttendanceGrid
          key={`${grupo}-${month}`}
          classGroupId={grupo}
          today={today}
          days={report.days}
          editableDates={editableDates}
          isTeacher={ctx.role === "docente"}
          students={report.rows.map((r) => ({ id: r.id, name: r.name, marks: r.marks }))}
        />
      )}
    </div>
  );
}
