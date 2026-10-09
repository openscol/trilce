"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, CheckIcon, FileTextIcon, LoaderIcon, PaperclipIcon, Trash2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { BLANK, formatScore, grade } from "@/lib/exams/shared";
import { prepareUpload } from "@/lib/exams/upload";
import { addGradedFile, deleteExamResult, deleteGradedFile, saveManualResult } from "../../actions";

export type EntryStudent = {
  id: string;
  name: string;
  code: string;
  group: string;
  saved: { resultId: string; theme: string; answers: string } | null;
};
export type GradedFile = { id: string; url: string | null; pdf: boolean };

type ExamBrief = { id: string; school_id: string; question_count: number; max_score: number };
type RowState = {
  theme: string;
  answers: string[]; // "" = sin escribir todavía, "-" = en blanco
  savedAs: string | null; // tipo + respuestas tal como están guardadas
  resultId: string | null;
  status: "idle" | "saving" | "error";
  error: string | null;
};

const SAVE_DELAY = 700;
const signature = (theme: string, answers: string[]) => `${theme}:${answers.join("")}`;

export function ManualEntry({
  exam,
  keys,
  themes,
  options,
  students,
  files,
}: {
  exam: ExamBrief;
  keys: Record<string, string>;
  themes: string[];
  options: string[];
  students: EntryStudent[];
  files: Record<string, GradedFile[]>;
}) {
  const n = exam.question_count;
  const [rows, setRowsState] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      students.map((s) => {
        const answers = s.saved ? [...s.saved.answers] : Array<string>(n).fill("");
        const theme = s.saved?.theme ?? themes[0];
        return [s.id, { theme, answers, savedAs: s.saved ? signature(theme, answers) : null, resultId: s.saved?.resultId ?? null, status: "idle", error: null }];
      })
    )
  );
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Copia al día del estado, para leerla desde los temporizadores y entre teclas seguidas.
  const latest = useRef(rows);
  const setRows = (update: (prev: Record<string, RowState>) => Record<string, RowState>) => {
    latest.current = update(latest.current);
    setRowsState(latest.current);
  };

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  const focus = (r: number, q: number) => {
    const cell = cells.current[r * n + q];
    if (cell) {
      cell.focus();
      cell.select();
    }
  };

  async function save(studentId: string) {
    const row = latest.current[studentId];
    if (!row || row.answers.some((a) => a === "")) return;
    const sig = signature(row.theme, row.answers);
    if (sig === row.savedAs) return;
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], status: "saving", error: null } }));
    const result = await saveManualResult(exam.id, studentId, row.theme, row.answers.join(""));
    setRows((prev) => ({
      ...prev,
      [studentId]:
        "error" in result
          ? { ...prev[studentId], status: "error", error: result.error }
          : { ...prev[studentId], status: "idle", error: null, savedAs: sig, resultId: result.resultId },
    }));
  }

  // Cada cambio reprograma el guardado de la fila; solo se guarda si está completa.
  function change(studentId: string, patch: Partial<Pick<RowState, "theme" | "answers">>) {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], ...patch } }));
    clearTimeout(timers.current[studentId]);
    timers.current[studentId] = setTimeout(() => save(studentId), SAVE_DELAY);
  }

  function setAnswer(r: number, q: number, value: string) {
    const id = students[r].id;
    const answers = [...latest.current[id].answers];
    answers[q] = value;
    change(id, { answers });
  }

  function type(r: number, q: number, raw: string) {
    const c = raw.toUpperCase();
    let value: string | null = null;
    if (options.includes(c)) value = c;
    else if (c === " " || c === "-" || c === ".") value = BLANK;
    if (value === null) return;
    setAnswer(r, q, value);
    if (q < n - 1) focus(r, q + 1);
    else if (r < students.length - 1) focus(r + 1, 0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>, r: number, q: number) {
    const id = students[r].id;
    if (e.key === "Backspace") {
      e.preventDefault();
      if (latest.current[id].answers[q] !== "") setAnswer(r, q, "");
      else if (q > 0) {
        setAnswer(r, q - 1, "");
        focus(r, q - 1);
      }
    } else if (e.key === "ArrowRight" && q < n - 1) {
      e.preventDefault();
      focus(r, q + 1);
    } else if (e.key === "ArrowLeft" && q > 0) {
      e.preventDefault();
      focus(r, q - 1);
    } else if ((e.key === "ArrowDown" || e.key === "Enter") && r < students.length - 1) {
      e.preventDefault();
      focus(r + 1, e.key === "Enter" ? 0 : q);
    } else if (e.key === "ArrowUp" && r > 0) {
      e.preventDefault();
      focus(r - 1, q);
    } else if (e.key === " ") {
      e.preventDefault();
      type(r, q, " ");
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Letras con teclado físico; en el celular llegan por onChange.
      e.preventDefault();
      type(r, q, e.key);
    }
  }

  async function clearRow(studentId: string) {
    const row = latest.current[studentId];
    if (!row.resultId) {
      change(studentId, { answers: Array<string>(n).fill("") });
      return;
    }
    if (!window.confirm("¿Borrar las respuestas guardadas de este alumno?")) return;
    clearTimeout(timers.current[studentId]);
    const result = await deleteExamResult(exam.id, row.resultId);
    if (result?.error) {
      window.alert(result.error);
      return;
    }
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], answers: Array<string>(n).fill(""), savedAs: null, resultId: null, status: "idle", error: null } }));
  }

  const complete = students.filter((s) => rows[s.id].savedAs !== null).length;
  const hasKeys = Object.keys(keys).length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          {complete} de {students.length} alumnos registrados
        </span>
        {!hasKeys && (
          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
            <AlertTriangleIcon className="size-4" />
            Sin clave de respuestas: se guarda lo marcado y la nota se calcula cuando registres la clave.
          </span>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="sticky left-0 z-10 bg-background p-2 pl-4 font-normal">Alumno</th>
              <th className="p-2 font-normal">Examen calificado</th>
              {themes.length > 1 && <th className="p-2 font-normal">Tipo</th>}
              {Array.from({ length: n }, (_, q) => (
                <th key={q} className="w-9 p-1 text-center font-normal">
                  {q + 1}
                </th>
              ))}
              <th className="p-2 font-normal">Nota</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {students.map((student, r) => {
              const row = rows[student.id];
              const result = grade(row.answers.join(""), keys[row.theme], exam.max_score);
              const filled = row.answers.every((a) => a !== "");
              return (
                <tr key={student.id} className="border-b border-border last:border-b-0">
                  <td className="sticky left-0 z-10 bg-background p-2 pl-4">
                    <div className="flex min-w-48 flex-col">
                      <span className="whitespace-nowrap">{student.name}</span>
                      <span className="text-xs text-muted-foreground">
                        <span className="font-mono">{student.code}</span>
                        {student.group ? ` · ${student.group}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <GradedFiles examId={exam.id} schoolId={exam.school_id} studentId={student.id} files={files[student.id] ?? []} />
                  </td>
                  {themes.length > 1 && (
                    <td className="p-2">
                      <select
                        value={row.theme}
                        onChange={(e) => change(student.id, { theme: e.target.value })}
                        className="h-9 rounded-md border border-border bg-background px-2 font-mono text-sm text-foreground"
                      >
                        {themes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  {row.answers.map((answer, q) => {
                    const key = keys[row.theme];
                    const mark = key && answer !== "" ? (answer === key[q] ? "1" : "0") : null;
                    return (
                      <td key={q} className="p-0.5">
                        <input
                          ref={(el) => {
                            cells.current[r * n + q] = el;
                          }}
                          value={answer === BLANK ? "·" : answer}
                          onChange={(e) => type(r, q, e.target.value.replace(/[·]/g, "").slice(-1))}
                          onKeyDown={(e) => onKeyDown(e, r, q)}
                          onFocus={(e) => e.target.select()}
                          inputMode="text"
                          autoCapitalize="characters"
                          autoComplete="off"
                          aria-label={`${student.name}, pregunta ${q + 1}`}
                          className={cn(
                            "size-9 rounded-md border border-border bg-surface-elevated text-center font-mono text-sm uppercase outline-none focus:border-primary",
                            mark === "1" && "border-emerald-600/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                            mark === "0" && "border-red-600/40 bg-red-500/15 text-red-700 dark:text-red-300"
                          )}
                        />
                      </td>
                    );
                  })}
                  <td className="p-2 font-mono whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      {filled && result ? formatScore(result.score) : "—"}
                      {row.status === "saving" && <LoaderIcon className="size-3 animate-spin text-muted-foreground" />}
                      {row.status === "idle" && row.savedAs !== null && row.savedAs === signature(row.theme, row.answers) && <CheckIcon className="size-3 text-emerald-600" />}
                      {row.status === "error" && (
                        <span title={row.error ?? ""}>
                          <AlertTriangleIcon className="size-3 text-destructive" />
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="p-2">
                    <Button type="button" variant="ghost" size="icon-sm" title="Borrar respuestas" onClick={() => clearRow(student.id)} tabIndex={-1}>
                      <Trash2Icon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {students.some((s) => rows[s.id].status === "error") && (
        <p className="text-sm text-destructive">Algunas filas no se guardaron (ícono rojo). Pasa el cursor sobre el ícono para ver el motivo y vuelve a editar la fila.</p>
      )}
    </div>
  );
}

// Fotos o PDF del examen ya calificado de un alumno.
function GradedFiles({ examId, schoolId, studentId, files }: { examId: string; schoolId: string; studentId: string; files: GradedFile[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const picked = [...list].sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));
    for (const file of picked) {
      const prepared = await prepareUpload(file);
      if ("error" in prepared) {
        setError(prepared.error);
        continue;
      }
      const path = `${schoolId}/${examId}/graded/${studentId}-${crypto.randomUUID()}.${prepared.ext}`;
      const { error: uploadError } = await supabase.storage.from("exam-sheets").upload(path, prepared.blob, { contentType: prepared.contentType });
      if (uploadError) {
        setError(`No se pudo subir ${file.name}.`);
        continue;
      }
      const result = await addGradedFile(examId, studentId, path);
      if ("error" in result) setError(result.error);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function remove(fileId: string) {
    if (!window.confirm("¿Eliminar este archivo?")) return;
    const result = await deleteGradedFile(examId, fileId);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {files.map((f, i) => (
          <span key={f.id} className="flex items-center rounded-md border border-border text-xs">
            <a href={f.url ?? "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 hover:underline">
              {f.pdf ? <FileTextIcon className="size-3" /> : null}
              {f.pdf ? "PDF" : `Pág. ${i + 1}`}
            </a>
            <button type="button" tabIndex={-1} onClick={() => remove(f.id)} className="px-1 text-muted-foreground hover:text-destructive" title="Eliminar">
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
        <Button type="button" variant="outline" size="sm" tabIndex={-1} disabled={busy} onClick={() => inputRef.current?.click()}>
          <PaperclipIcon />
          {busy ? "Subiendo…" : files.length ? "Agregar" : "Subir"}
        </Button>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
