import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { formatScore, studentName } from "@/lib/exams/shared";
import { ExamList } from "./exam-list";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

export default async function ExamenesPage() {
  const ctx = await requireAppContext();
  const supabase = await createClient();

  if (!STAFF_ROLES.includes(ctx.role ?? "")) {
    // Alumno o apoderado: sus resultados publicados (RLS ya filtra los suyos).
    const { data: results } = await supabase
      .from("exam_results")
      .select("id, score, correct_count, exams(id, title, subject, exam_date, max_score, question_count), students(paternal_surname, maternal_surname, first_names)")
      .order("created_at", { ascending: false });

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-medium">Exámenes</h1>
          <p className="text-sm text-muted-foreground">Resultados de los exámenes rendidos con ficha de respuestas.</p>
        </div>
        {(results ?? []).length === 0 && <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Todavía no hay resultados publicados.</p>}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(results ?? []).map((r) =>
            r.exams ? (
              <Link key={r.id} href={`/examenes/${r.exams.id}?r=${r.id}`} className="flex flex-col gap-2 rounded-2xl border border-border p-4 transition-colors hover:bg-accent">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{r.exams.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.exams.subject ? `${r.exams.subject} · ` : ""}
                      {r.exams.exam_date}
                    </span>
                  </div>
                  <span className="font-mono text-lg">
                    {formatScore(r.score)}
                    <span className="text-xs text-muted-foreground"> / {formatScore(r.exams.max_score)}</span>
                  </span>
                </div>
                {ctx.role === "padre" && r.students && <span className="text-sm text-muted-foreground">{studentName(r.students)}</span>}
                <span className="text-xs text-muted-foreground">
                  {r.correct_count ?? "—"} de {r.exams.question_count} correctas
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    );
  }

  const [{ data: exams }, { data: classGroups }] = await Promise.all([
    supabase
      .from("exams")
      .select("*, exam_class_groups(class_group_id), exam_answer_keys(theme, answers), exam_results(id)")
      .order("exam_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("class_groups").select("id, academic_year, level, grade, section").order("academic_year", { ascending: false }).order("level").order("grade").order("section"),
  ]);

  const groups = (classGroups ?? []).map((g) => ({ id: g.id, label: classGroupLabel(g) }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium">Exámenes</h1>
        <p className="text-sm text-muted-foreground">Exámenes en papel con ficha de respuestas: registra la clave, fotografía las fichas y el sistema las califica.</p>
      </div>
      <ExamList
        exams={(exams ?? []).map((e) => ({
          exam: e,
          classGroupIds: e.exam_class_groups.map((g) => g.class_group_id),
          keys: Object.fromEntries(e.exam_answer_keys.map((k) => [k.theme, k.answers])),
          resultCount: e.exam_results.length,
        }))}
        classGroups={groups}
      />
    </div>
  );
}
