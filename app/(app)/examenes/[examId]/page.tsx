import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { DEFAULT_LAYOUT, SHEET_LAYOUTS, formatScore, studentName } from "@/lib/exams/shared";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnswerStrip } from "./answer-strip";
import { ExamHeader } from "./exam-header";
import { ExamMaterials } from "./exam-materials";
import { DeleteResultButton } from "./delete-result-button";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

export default async function ExamPage({ params, searchParams }: { params: Promise<{ examId: string }>; searchParams: Promise<{ r?: string }> }) {
  const { examId } = await params;
  const { r: resultId } = await searchParams;
  const ctx = await requireAppContext();
  const supabase = await createClient();

  const { data: exam } = await supabase.from("exams").select("*").eq("id", examId).maybeSingle();
  if (!exam) notFound();

  const back = (
    <Link href="/examenes" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ChevronLeftIcon className="size-4" />
      Exámenes
    </Link>
  );

  if (!STAFF_ROLES.includes(ctx.role ?? "")) {
    // Alumno o apoderado: su ficha (RLS solo devuelve las suyas y si el examen está publicado).
    let query = supabase.from("exam_results").select("*, students(paternal_surname, maternal_surname, first_names)").eq("exam_id", examId);
    if (resultId) query = query.eq("id", resultId);
    const { data: results } = await query.limit(1);
    const result = results?.[0];
    if (!result) notFound();

    // Material de su tipo de examen (RLS solo devuelve el de su tipo): cuadernillo y ficha de respuestas.
    const [{ data: files }, { data: graded }] = await Promise.all([
      supabase.from("exam_files").select("id, kind, path, position").eq("exam_id", examId).eq("theme", result.theme).order("position"),
      // Su examen calificado (registro manual); RLS solo devuelve el suyo.
      supabase.from("exam_result_files").select("path, position").eq("exam_id", examId).eq("student_id", result.student_id).order("position"),
    ]);
    const paths = [...(files ?? []).map((f) => f.path), ...(graded ?? []).map((f) => f.path), ...(result.image_path ? [result.image_path] : [])];
    const { data: signed } = paths.length ? await supabase.storage.from("exam-sheets").createSignedUrls(paths, 3600) : { data: [] };
    const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
    const images = (kind: "exam" | "answer_sheet") => (files ?? []).filter((f) => f.kind === kind && urlOf.get(f.path)).map((f) => ({ url: urlOf.get(f.path)!, pdf: isPdf(f.path) }));
    const examImages = images("exam");
    const sheetImages = images("answer_sheet");
    const ownSheet = result.image_path ? urlOf.get(result.image_path) : null;
    const gradedFiles = (graded ?? []).filter((f) => urlOf.get(f.path)).map((f) => ({ url: urlOf.get(f.path)!, pdf: isPdf(f.path) }));

    return (
      <div className="flex flex-col gap-4">
        {back}
        <div>
          <h1 className="text-lg font-medium">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">
            {exam.subject ? `${exam.subject} · ` : ""}
            {exam.exam_date}
            {result.students ? ` · ${studentName(result.students)}` : ""}
          </p>
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
            <div className="flex items-end gap-2">
              <span className="font-mono text-4xl">{formatScore(result.score)}</span>
              <span className="pb-1 text-sm text-muted-foreground">/ {formatScore(exam.max_score)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.correct_count ?? "—"} de {exam.question_count} respuestas correctas · Tipo {result.theme}
            </p>
            <div className="flex flex-col gap-2">
              {[...result.answers].map((answer, i) => {
                const ok = result.marks?.[i] === "1";
                // Solo en las falladas se muestra cuál era la correcta.
                const correct = !ok ? result.corrections?.[i] : undefined;
                return (
                  <div key={i} className="flex items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-b-0">
                    <span className="text-muted-foreground">Pregunta {i + 1}</span>
                    <span className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                      <span className="font-mono">{answer === "-" ? "En blanco" : answer === "*" ? "Anulada (más de una marca)" : answer}</span>
                      {result.marks && <span className={ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>{ok ? "✓ Correcta" : "✗ Incorrecta"}</span>}
                      {correct && correct !== "." && (
                        <span className="text-muted-foreground">
                          Correcta: <span className="font-mono text-emerald-600 dark:text-emerald-400">{correct}</span>
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {exam.entry_mode === "manual" ? (
              <>
                <Images title="Examen calificado" files={gradedFiles} empty="El colegio todavía no subió el examen calificado." />
                {examImages.length > 0 && <Images title={`Examen · Tipo ${result.theme}`} files={examImages} empty="" />}
                {sheetImages.length > 0 && <Images title="Ficha de respuestas" files={sheetImages} empty="" />}
              </>
            ) : (
              <>
                <Images title={`Examen · Tipo ${result.theme}`} files={examImages} empty="El colegio todavía no subió el examen." />
                <Images title="Ficha de respuestas" files={sheetImages} empty="El colegio todavía no subió la ficha de respuestas." />
                {gradedFiles.length > 0 && <Images title="Examen calificado" files={gradedFiles} empty="" />}
              </>
            )}
            {ownSheet && <Images title="Ficha marcada por el alumno" files={[{ url: ownSheet, pdf: false }]} empty="" />}
          </div>
        </div>
      </div>
    );
  }

  const [{ data: groups }, { data: keys }, { data: results }, { data: allGroups }, { data: files }, { data: graded }] = await Promise.all([
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId),
    supabase.from("exam_answer_keys").select("theme, answers").eq("exam_id", examId).order("theme"),
    supabase.from("exam_results").select("*, students(id, code, paternal_surname, maternal_surname, first_names, class_group_id)").eq("exam_id", examId),
    supabase.from("class_groups").select("id, academic_year, level, grade, section").order("academic_year", { ascending: false }).order("level").order("grade").order("section"),
    supabase.from("exam_files").select("id, theme, kind, path, position").eq("exam_id", examId).order("position"),
    supabase.from("exam_result_files").select("student_id, path, position").eq("exam_id", examId).order("position"),
  ]);
  const groupIds = (groups ?? []).map((g) => g.class_group_id);
  const groupLabel = new Map((allGroups ?? []).map((g) => [g.id, classGroupLabel(g)]));

  const { data: roster } = groupIds.length
    ? await supabase.from("students").select("id, code, paternal_surname, maternal_surname, first_names, class_group_id").in("class_group_id", groupIds).eq("status", "activo")
    : { data: [] };

  const paths = [...(results ?? []).map((r) => r.image_path).filter((p): p is string => !!p), ...(files ?? []).map((f) => f.path), ...(graded ?? []).map((f) => f.path)];
  const { data: signed } = paths.length ? await supabase.storage.from("exam-sheets").createSignedUrls(paths, 3600) : { data: [] };
  const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const gradedOf = new Map<string, string[]>();
  for (const f of graded ?? []) gradedOf.set(f.student_id, [...(gradedOf.get(f.student_id) ?? []), f.path]);

  const resultOf = new Map((results ?? []).map((r) => [r.student_id, r]));
  const rows = [
    ...(roster ?? []).map((s) => ({ student: s, result: resultOf.get(s.id) ?? null })),
    ...(results ?? []).filter((r) => r.students && !(roster ?? []).some((s) => s.id === r.student_id)).map((r) => ({ student: r.students!, result: r })),
  ].sort((a, b) => studentName(a.student).localeCompare(studentName(b.student), "es"));

  const scored = (results ?? []).filter((r) => r.score !== null);
  const average = scored.length ? scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length : null;

  return (
    <div className="flex flex-col gap-4">
      {back}
      <ExamHeader
        item={{ exam, classGroupIds: groupIds, keys: Object.fromEntries((keys ?? []).map((k) => [k.theme, k.answers])), resultCount: results?.length ?? 0 }}
        classGroups={(allGroups ?? []).map((g) => ({ id: g.id, label: classGroupLabel(g) }))}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={exam.entry_mode === "manual" ? "Alumnos registrados" : "Fichas procesadas"} value={`${results?.length ?? 0}${roster?.length ? ` de ${roster.length}` : ""}`} />
        <Stat label="Promedio" value={average === null ? "—" : `${formatScore(Math.round(average * 100) / 100)} / ${formatScore(exam.max_score)}`} />
        <Stat label="Clave" value={(keys ?? []).length ? (keys ?? []).map((k) => `${k.theme}: ${k.answers}`).join("  ·  ") : "Sin clave"} mono />
      </div>

      <ExamMaterials
        examId={examId}
        schoolId={exam.school_id}
        themes={(SHEET_LAYOUTS[exam.sheet_layout] ?? SHEET_LAYOUTS[DEFAULT_LAYOUT]).layout.themes}
        files={(files ?? []).map((f) => ({ id: f.id, theme: f.theme, kind: f.kind, url: urlOf.get(f.path) ?? null, pdf: isPdf(f.path) }))}
      />

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Sección</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Respuestas</TableHead>
              <TableHead>Correctas</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>{exam.entry_mode === "manual" ? "Examen" : "Ficha"}</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  {exam.entry_mode === "manual" ? "Todavía no hay respuestas. Elige las secciones del examen y usa «Registrar respuestas»." : "Todavía no hay fichas. Elige las secciones del examen y usa «Procesar fichas»."}
                </TableCell>
              </TableRow>
            )}
            {rows.map(({ student, result }) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{studentName(student)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{student.code}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{student.class_group_id ? (groupLabel.get(student.class_group_id) ?? "—") : "—"}</TableCell>
                {result ? (
                  <>
                    <TableCell className="font-mono">{result.theme}</TableCell>
                    <TableCell>
                      <AnswerStrip answers={result.answers} marks={result.marks} />
                    </TableCell>
                    <TableCell className="font-mono">{result.correct_count ?? "—"}</TableCell>
                    <TableCell className="font-mono">{formatScore(result.score)}</TableCell>
                    <TableCell>
                      <span className="flex flex-wrap gap-2">
                        {result.image_path && urlOf.get(result.image_path) && (
                          <a href={urlOf.get(result.image_path)!} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-2">
                            Ver foto
                          </a>
                        )}
                        {(gradedOf.get(student.id) ?? []).map((path, i) =>
                          urlOf.get(path) ? (
                            <a key={path} href={urlOf.get(path)!} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-2">
                              {isPdf(path) ? "PDF" : `Pág. ${i + 1}`}
                            </a>
                          ) : null
                        )}
                        {!result.image_path && !gradedOf.get(student.id)?.length && "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DeleteResultButton examId={examId} resultId={result.id} />
                    </TableCell>
                  </>
                ) : (
                  <TableCell colSpan={6} className="text-sm text-muted-foreground">
                    Sin ficha
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const isPdf = (path: string) => path.toLowerCase().endsWith(".pdf");

// Imágenes una debajo de otra; los PDF, embebidos con el visor del navegador.
function Images({ title, files, empty }: { title: string; files: { url: string; pdf: boolean }[]; empty: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      {files.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      {files.map((file, i) =>
        file.pdf ? (
          <div key={file.url} className="flex flex-col gap-2">
            <iframe src={file.url} title={title} className="h-[80vh] w-full rounded-lg border border-border" />
            {/* En muchos celulares el navegador no muestra PDF embebidos: queda el enlace. */}
            <a href={file.url} target="_blank" rel="noreferrer" className="w-fit text-sm underline underline-offset-2">
              Abrir el PDF en otra pestaña
            </a>
          </div>
        ) : (
          <a key={file.url} href={file.url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.url} alt={`${title}${files.length > 1 ? `, página ${i + 1}` : ""}`} className="w-full rounded-lg border border-border" />
          </a>
        )
      )}
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border p-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm break-all" : "text-lg"}>{value}</span>
    </div>
  );
}
