import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { studentName } from "@/lib/exams/shared";
import { loadStudentHistory } from "@/lib/conduct-server";
import { ConductHistory } from "../../conduct-history";

export default async function FaltasAlumnoPage(props: PageProps<"/faltas/alumno/[studentId]">) {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo" && ctx.role !== "docente") notFound();
  const { studentId } = await props.params;
  const supabase = await createClient();

  const { data: student } = await supabase.from("students").select("id, paternal_surname, maternal_surname, first_names, class_group_id").eq("id", studentId).eq("school_id", ctx.schoolId!).maybeSingle();
  if (!student) notFound();
  const { entries, sheets } = await loadStudentHistory(supabase, [studentId]);
  const count = (kind: string) => entries.filter((e) => e.kind === kind).length;

  return (
    <div className="flex flex-col gap-4">
      <Link href={student.class_group_id ? `/faltas/${student.class_group_id}` : "/faltas"} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        Volver a la sección
      </Link>
      <div>
        <h1 className="text-lg font-medium">{studentName(student)}</h1>
        <p className="text-sm text-muted-foreground">
          {count("falta")} faltas · {count("registro")} registros · {count("permiso")} permisos · {sheets.length} fichas de reflexión
        </p>
      </div>
      <ConductHistory entries={entries} sheets={sheets} canPrint />
    </div>
  );
}
