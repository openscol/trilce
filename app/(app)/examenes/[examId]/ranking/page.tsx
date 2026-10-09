import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { formatScore, studentName } from "@/lib/exams/shared";
import { RankingTable, type RankingRow } from "./ranking-table";

// Ranking del examen, de la mayor a la menor nota, con el mismo formato de
// respuestas que la pantalla del examen. Pensado para guardarse como PDF.
export default async function RankingPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/examenes");
  const supabase = await createClient();

  const { data: exam } = await supabase.from("exams").select("*").eq("id", examId).maybeSingle();
  if (!exam) notFound();
  // El ranking se descarga una vez publicados los resultados.
  if (!exam.published) redirect(`/examenes/${examId}`);

  const [{ data: results }, { data: classGroups }] = await Promise.all([
    supabase.from("exam_results").select("*, students(code, paternal_surname, maternal_surname, first_names, class_group_id)").eq("exam_id", examId),
    supabase.from("class_groups").select("id, academic_year, level, grade, section"),
  ]);
  const groupLabel = new Map((classGroups ?? []).map((g) => [g.id, classGroupLabel(g)]));

  const rows: RankingRow[] = (results ?? [])
    .filter((r) => r.students)
    .map((r) => ({
      id: r.id,
      name: studentName(r.students!),
      code: r.students!.code,
      group: r.students!.class_group_id ? (groupLabel.get(r.students!.class_group_id) ?? "—") : "—",
      theme: r.theme,
      answers: r.answers,
      marks: r.marks,
      correct_count: r.correct_count,
      score: r.score,
    }));

  const scored = rows.filter((r) => r.score !== null);
  const average = scored.length ? scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length : null;

  return (
    <div className="flex flex-col gap-4 print:gap-2 print:bg-white print:p-6 print:text-black">
      {/* La hoja se guarda en A4 horizontal. */}
      <style>{"@page { size: A4 landscape; margin: 10mm; }"}</style>
      <Link href={`/examenes/${examId}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground print:hidden">
        <ChevronLeftIcon className="size-4" />
        {exam.title}
      </Link>
      <p className="text-sm text-muted-foreground print:hidden">Elige el orden y qué datos mostrar; al descargar se abrirá el diálogo de impresión: elige «Guardar como PDF» como destino para descargar el archivo.</p>

      <div className="rounded-2xl border border-border print:rounded-none print:border-none">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border p-4 print:border-black print:px-0">
          <div>
            <h1 className="text-lg font-medium">Resultados · {exam.title}</h1>
            <p className="text-sm text-muted-foreground print:text-black">
              {exam.subject ? `${exam.subject} · ` : ""}
              {exam.exam_date} · {exam.question_count} preguntas · nota sobre {formatScore(exam.max_score)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground print:text-black">
            {rows.length} alumnos · promedio {average === null ? "—" : formatScore(Math.round(average * 100) / 100)}
          </p>
        </div>
        <RankingTable rows={rows} questionCount={exam.question_count} fileName={`Ranking - ${exam.title}`} />
      </div>
    </div>
  );
}
