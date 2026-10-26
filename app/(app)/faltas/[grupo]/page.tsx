import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { longDate, todayInLima } from "@/lib/attendance";
import { studentName } from "@/lib/exams/shared";
import { loadConductCatalog, loadGroupDay } from "@/lib/conduct-server";
import { RegisterBoard } from "./register-board";

export default async function FaltasSeccionPage(props: PageProps<"/faltas/[grupo]">) {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo" && ctx.role !== "docente") notFound();
  const { grupo } = await props.params;
  const today = todayInLima();
  const supabase = await createClient();

  const { data: group } = await supabase.from("class_groups").select("id, level, grade, section").eq("id", grupo).eq("school_id", ctx.schoolId!).maybeSingle();
  if (!group) notFound();
  const title = `${LEVEL_LABELS[group.level]} ${group.grade}${group.section}`;

  // La lista sale de attendance_roster: misma regla de acceso que la asistencia.
  const { data: roster, error } = await supabase.rpc("attendance_roster", { p_class_group_id: grupo });
  if (error) return <p className="text-sm text-muted-foreground">No tienes permiso para registrar faltas en {title}.</p>;

  const [catalog, entries, { data: sheets }, { data: staff }] = await Promise.all([
    loadConductCatalog(supabase, ctx.schoolId!),
    loadGroupDay(supabase, grupo, today),
    supabase.from("conduct_reflection_sheets").select("id, number, date, student_id").eq("class_group_id", grupo).eq("date", today).order("number"),
    supabase.from("staff_members").select("id, full_name, staff_type").eq("school_id", ctx.schoolId!).eq("active", true).in("staff_type", ["docente", "auxiliar"]).order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/faltas" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        Registro de faltas
      </Link>
      <div>
        <h1 className="text-lg font-medium">Faltas de {title}</h1>
        <p className="text-sm text-muted-foreground first-letter:uppercase">{longDate(today)} · hoy</p>
      </div>

      <RegisterBoard
        students={(roster ?? []).filter((s) => s.status === "activo").map((s) => ({ id: s.id, name: studentName(s) }))}
        categories={catalog.categories}
        faltasPerSheet={catalog.faltasPerSheet}
        entries={entries}
        sheets={sheets ?? []}
        teachers={(staff ?? []).filter((s) => s.staff_type === "docente")}
        assistants={(staff ?? []).filter((s) => s.staff_type === "auxiliar")}
        defaultTeacherId={ctx.role === "docente" ? ctx.targetId : null}
      />
    </div>
  );
}
