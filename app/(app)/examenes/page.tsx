import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { formatScore, studentName } from "@/lib/exams/shared";
import { formatDuration, formatLima } from "@/lib/exams/online";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamList } from "./exam-list";
import { RefreshCountdown } from "./countdown";

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

    // Exámenes en línea: por rendir, en curso y rendidos sin liberar (de esos solo se ve la nota).
    // Los ya liberados aparecen abajo, con el resto de resultados publicados.
    const { data: onlineExams } = await supabase.rpc("my_online_exams");
    const online = (onlineExams ?? []).filter((e) => !(e.status === "submitted" && e.published));
    // Hora del servidor al generar la página: con ella el navegador lleva la cuenta regresiva.
    const serverNow = new Date().toISOString();

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-medium">Exámenes</h1>
          <p className="text-sm text-muted-foreground">Exámenes en línea por rendir y resultados de los exámenes ya calificados.</p>
        </div>
        {online.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {online.map((e) => (
              <div key={`${e.exam_id}-${e.student_id}`} className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{e.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {e.subject ? `${e.subject} · ` : ""}
                      {e.exam_date}
                    </span>
                  </div>
                  {e.status === "submitted" ? (
                    <span className="font-mono text-lg">
                      {formatScore(e.score)}
                      <span className="text-xs text-muted-foreground"> / {formatScore(e.max_score)}</span>
                    </span>
                  ) : (
                    <Badge variant={e.status === "open" || e.status === "in_progress" ? "default" : "secondary"}>
                      {e.status === "open" ? "Disponible" : e.status === "in_progress" ? "En curso" : e.status === "scheduled" ? "Programado" : "No rendido"}
                    </Badge>
                  )}
                </div>
                {!e.is_own && <span className="text-sm text-muted-foreground">{e.student_name}</span>}
                <span className="text-xs text-muted-foreground">
                  {e.question_count} preguntas
                  {e.time_limit_seconds ? ` · ${formatDuration(e.time_limit_seconds)} ${e.time_mode === "total" ? "en total" : "por pregunta"}` : ""}
                </span>
                {e.status === "scheduled" && e.opens_at && (
                  <span className="flex flex-col gap-1 text-xs text-muted-foreground">
                    Abre el {formatLima(e.opens_at)}
                    {/* Al llegar la hora la página se actualiza sola y aparece el botón. */}
                    <span>
                      Empieza en <RefreshCountdown target={e.opens_at} serverNow={serverNow} className="font-mono text-sm text-foreground" />
                    </span>
                  </span>
                )}
                {(e.status === "open" || e.status === "in_progress") && e.closes_at && <span className="text-xs text-muted-foreground">Cierra el {formatLima(e.closes_at)}</span>}
                {e.status === "missed" && <span className="text-xs text-muted-foreground">El examen ya cerró.</span>}
                {e.status === "submitted" && <span className="text-xs text-muted-foreground">Examen entregado. Las preguntas y respuestas se verán cuando el colegio las libere.</span>}
                {e.is_own && (e.status === "open" || e.status === "in_progress") && (
                  <Button size="sm" className="w-fit" nativeButton={false} render={<Link href={`/examenes/${e.exam_id}/rendir`} />}>
                    {e.status === "open" ? "Empezar examen" : "Continuar examen"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {(results ?? []).length === 0 && online.length === 0 && <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Todavía no hay resultados publicados.</p>}
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
        <p className="text-sm text-muted-foreground">Exámenes en papel (con ficha de respuestas o registro manual) y exámenes en línea que los alumnos rinden desde su cuenta.</p>
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
