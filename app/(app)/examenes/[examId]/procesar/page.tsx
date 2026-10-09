import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { studentName, type StudentBrief } from "@/lib/exams/shared";
import { Scanner } from "./scanner";

export default async function ProcesarFichasPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/examenes");
  const supabase = await createClient();

  const { data: exam } = await supabase.from("exams").select("*").eq("id", examId).maybeSingle();
  if (!exam) notFound();

  const [{ data: keys }, { data: groups }, { data: students }, { data: classGroups }, { data: results }] = await Promise.all([
    supabase.from("exam_answer_keys").select("theme, answers").eq("exam_id", examId),
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId),
    supabase.from("students").select("id, code, document_number, paternal_surname, maternal_surname, first_names, class_group_id").eq("status", "activo"),
    supabase.from("class_groups").select("id, academic_year, level, grade, section"),
    supabase.from("exam_results").select("student_id").eq("exam_id", examId),
  ]);

  const groupIds = new Set((groups ?? []).map((g) => g.class_group_id));
  const labelOf = new Map((classGroups ?? []).map((g) => [g.id, classGroupLabel(g)]));
  const list: StudentBrief[] = (students ?? [])
    .map((s) => ({
      id: s.id,
      code: s.code,
      document_number: s.document_number,
      name: studentName(s),
      group: s.class_group_id ? (labelOf.get(s.class_group_id) ?? "") : "",
      class_group_id: s.class_group_id,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/examenes/${examId}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        {exam.title}
      </Link>
      <div>
        <h1 className="text-lg font-medium">Procesar fichas de respuestas</h1>
        <p className="text-sm text-muted-foreground">
          Sube las fotos de las fichas (puedes elegir todas a la vez). Cada foto debe mostrar la hoja completa, con sus cuatro cuadrados negros, de frente y sin sombras fuertes.
        </p>
      </div>
      <Scanner
        exam={{ id: exam.id, school_id: exam.school_id, question_count: exam.question_count, max_score: exam.max_score, sheet_layout: exam.sheet_layout }}
        keys={Object.fromEntries((keys ?? []).map((k) => [k.theme, k.answers]))}
        students={list}
        examGroupIds={[...groupIds]}
        alreadySaved={(results ?? []).map((r) => r.student_id)}
      />
    </div>
  );
}
