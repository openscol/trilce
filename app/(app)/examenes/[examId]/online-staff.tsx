import { createClient } from "@/lib/supabase/server";
import { classGroupLabel } from "@/lib/class-group";
import { formatScore, studentName } from "@/lib/exams/shared";
import { formatLima, windowStatus } from "@/lib/exams/online";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Exam } from "../actions";
import { AnswerStrip } from "./answer-strip";
import { OnlineExamHeader, ReopenButton } from "./online-controls";

// Vista del personal para un examen en línea: estado, quién lo rindió y sus notas.
export async function OnlineExamStaff({ exam }: { exam: Exam }) {
  const supabase = await createClient();
  // Primero se aplica el reloj: los alumnos que se quedaron sin tiempo pasan a «entregado».
  await supabase.rpc("close_due_exam_attempts", { p_exam_id: exam.id });

  const [{ data: groups }, { data: results }, { data: attempts }, { data: allGroups }, { count: questionCount }] = await Promise.all([
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", exam.id),
    supabase.from("exam_results").select("*, students(id, code, paternal_surname, maternal_surname, first_names, class_group_id)").eq("exam_id", exam.id),
    supabase.from("exam_attempts").select("student_id, started_at, submitted_at").eq("exam_id", exam.id),
    supabase.from("class_groups").select("id, academic_year, level, grade, section").order("academic_year", { ascending: false }).order("level").order("grade").order("section"),
    supabase.from("exam_questions").select("id", { count: "exact", head: true }).eq("exam_id", exam.id),
  ]);
  const groupIds = (groups ?? []).map((g) => g.class_group_id);
  const groupLabel = new Map((allGroups ?? []).map((g) => [g.id, classGroupLabel(g)]));

  const { data: roster } = groupIds.length
    ? await supabase.from("students").select("id, code, paternal_surname, maternal_surname, first_names, class_group_id").in("class_group_id", groupIds).eq("status", "activo")
    : { data: [] };

  const resultOf = new Map((results ?? []).map((r) => [r.student_id, r]));
  const attemptOf = new Map((attempts ?? []).map((a) => [a.student_id, a]));
  const rows = [
    ...(roster ?? []).map((s) => ({ student: s, result: resultOf.get(s.id) ?? null })),
    ...(results ?? []).filter((r) => r.students && !(roster ?? []).some((s) => s.id === r.student_id)).map((r) => ({ student: r.students!, result: r })),
  ].sort((a, b) => studentName(a.student).localeCompare(studentName(b.student), "es"));

  const scored = (results ?? []).filter((r) => r.score !== null);
  const average = scored.length ? scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length : null;
  const inProgress = (attempts ?? []).filter((a) => !a.submitted_at).length;
  const status = windowStatus(exam.opens_at, exam.closes_at);
  const ready = !!exam.time_limit_seconds && !!questionCount && questionCount === exam.question_count;

  return (
    <>
      <OnlineExamHeader
        item={{ exam, classGroupIds: groupIds, keys: {}, resultCount: results?.length ?? 0 }}
        classGroups={(allGroups ?? []).map((g) => ({ id: g.id, label: classGroupLabel(g) }))}
        status={status}
        ready={ready}
      />

      {!ready && <p className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">Este examen todavía no tiene sus preguntas guardadas. Entra a «Preguntas» para escribirlas; después podrás abrirlo.</p>}
      {ready && groupIds.length === 0 && <p className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">Elige en «Editar» las secciones que rinden el examen: solo esos alumnos lo verán.</p>}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Entregados" value={`${results?.length ?? 0}${roster?.length ? ` de ${roster.length}` : ""}${inProgress ? ` · ${inProgress} en curso` : ""}`} />
        <Stat label="Promedio" value={average === null ? "—" : `${formatScore(Math.round(average * 100) / 100)} / ${formatScore(exam.max_score)}`} />
        <Stat label="Disponible" value={exam.opens_at ? `${formatLima(exam.opens_at)} → ${exam.closes_at ? formatLima(exam.closes_at) : "sin cierre"}` : "Sin abrir"} />
      </div>

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Sección</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Respuestas</TableHead>
              <TableHead>Correctas</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Todavía no hay alumnos. Elige las secciones que rinden el examen.
                </TableCell>
              </TableRow>
            )}
            {rows.map(({ student, result }) => {
              const attempt = attemptOf.get(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{studentName(student)}</span>
                      <span className="font-mono text-xs text-muted-foreground">{student.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.class_group_id ? (groupLabel.get(student.class_group_id) ?? "—") : "—"}</TableCell>
                  <TableCell>
                    {result ? (
                      <div className="flex flex-col">
                        <Badge variant="default" className="w-fit">
                          Entregado
                        </Badge>
                        {attempt?.submitted_at && <span className="text-xs text-muted-foreground">{formatLima(attempt.submitted_at)}</span>}
                      </div>
                    ) : attempt ? (
                      <Badge variant="secondary">En curso</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin rendir</span>
                    )}
                  </TableCell>
                  <TableCell>{result ? <AnswerStrip answers={result.answers} marks={result.marks} /> : "—"}</TableCell>
                  <TableCell className="font-mono">{result?.correct_count ?? "—"}</TableCell>
                  <TableCell className="font-mono">{result ? formatScore(result.score) : "—"}</TableCell>
                  <TableCell>{(result || attempt) && <ReopenButton examId={exam.id} studentId={student.id} />}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border p-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-lg">{value}</span>
    </div>
  );
}
