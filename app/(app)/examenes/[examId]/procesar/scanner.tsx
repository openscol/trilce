"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, CheckIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { readSheet } from "@/lib/exams/omr";
import { BLANK, DEFAULT_LAYOUT, MULTIPLE, SHEET_LAYOUTS, codeBelongsTo, formatScore, grade, resolveSheetCode, type StudentBrief } from "@/lib/exams/shared";
import { saveExamResults, type ResultInput } from "../../actions";

type ExamBrief = { id: string; school_id: string; question_count: number; max_score: number; sheet_layout: string };

type Row = {
  id: string;
  fileName: string;
  preview: string | null; // foto con los círculos leídos dibujados encima
  blob: Blob | null; // foto reducida, la que se guarda
  error: string | null;
  warnings: string[];
  code: string;
  studentId: string;
  theme: string;
  answers: string[]; // "A".."D", "-" o "*"
  replace: boolean; // confirmado: reemplaza la ficha que el alumno ya tenía guardada
};

const MAX_SIDE = 1600;

// Decodifica la foto, la reduce y la lee. Todo ocurre en el navegador.
async function scanFile(file: File, exam: ExamBrief): Promise<Omit<Row, "id" | "studentId" | "replace">> {
  const base = { fileName: file.name, preview: null, blob: null, warnings: [], code: "", theme: "", answers: Array<string>(exam.question_count).fill(BLANK) };
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { ...base, error: "No se pudo abrir la imagen." };
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const gray = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) gray[i] = (pixels[p] * 299 + pixels[p + 1] * 587 + pixels[p + 2] * 114) / 1000;

  const layout = (SHEET_LAYOUTS[exam.sheet_layout] ?? SHEET_LAYOUTS[DEFAULT_LAYOUT]).layout;
  try {
    const reading = readSheet({ data: gray, width: canvas.width, height: canvas.height }, layout);
    // Dibuja lo que se leyó: verde = relleno, azul = vacío.
    const r = layout.radius * Math.hypot(reading.corners[1].x - reading.corners[0].x, reading.corners[1].y - reading.corners[0].y);
    ctx.lineWidth = Math.max(2, r * 0.22);
    for (const mark of reading.marks) {
      ctx.strokeStyle = mark.filled ? "#16a34a" : "rgba(37, 99, 235, 0.55)";
      ctx.beginPath();
      ctx.arc(mark.center.x, mark.center.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    return {
      ...base,
      blob,
      preview: canvas.toDataURL("image/jpeg", 0.7),
      error: null,
      warnings: reading.warnings.filter((w) => !/^Pregunta (\d+)/.test(w) || Number(w.match(/\d+/)![0]) <= exam.question_count),
      code: reading.code,
      theme: reading.theme ?? "",
      answers: reading.answers.slice(0, exam.question_count).map((a) => (a === "" ? BLANK : a)),
    };
  } catch (e) {
    return { ...base, blob, preview: canvas.toDataURL("image/jpeg", 0.7), error: e instanceof Error ? e.message : "No se pudo leer la ficha." };
  }
}

export function Scanner({
  exam,
  keys,
  students,
  examGroupIds,
  alreadySaved,
}: {
  exam: ExamBrief;
  keys: Record<string, string>;
  students: StudentBrief[];
  examGroupIds: string[];
  alreadySaved: string[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(alreadySaved);
  const [zoom, setZoom] = useState<string | null>(null);

  const layout = (SHEET_LAYOUTS[exam.sheet_layout] ?? SHEET_LAYOUTS[DEFAULT_LAYOUT]).layout;
  // Una ficha solo puede ser de un alumno de las secciones del examen. Si el
  // examen no tiene secciones no hay con qué verificarlo y vale todo el colegio.
  const hasGroups = examGroupIds.length > 0;
  const candidates = useMemo(
    () => (hasGroups ? students.filter((s) => s.class_group_id && examGroupIds.includes(s.class_group_id)) : students),
    [students, examGroupIds, hasGroups]
  );
  const byId = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);
  const resolve = (code: string) => resolveSheetCode(code, candidates, students, layout.codeColumns.length);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);
    const list = [...files];
    setProgress({ done: 0, total: list.length });
    for (let i = 0; i < list.length; i++) {
      const scanned = await scanFile(list[i], exam);
      // Solo se asigna sola si el código es de un alumno que rinde este examen.
      const match = resolve(scanned.code).student;
      setRows((prev) => [...prev, { ...scanned, id: `${Date.now()}-${i}-${list[i].name}`, studentId: match?.id ?? "", replace: false }]);
      setProgress({ done: i + 1, total: list.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const update = (id: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const counts = new Map<string, number>();
  for (const r of rows) if (r.studentId) counts.set(r.studentId, (counts.get(r.studentId) ?? 0) + 1);
  const problemOf = (r: Row) => {
    if (r.error) return r.error;
    if (!r.studentId) return "Falta elegir al alumno.";
    if ((counts.get(r.studentId) ?? 0) > 1) return "Hay otra ficha asignada a este mismo alumno.";
    if (!r.theme) return "Falta elegir el tipo de examen.";
    if (savedIds.includes(r.studentId) && !r.replace) return "Este alumno ya tiene una ficha guardada: confirma el reemplazo o elige a otro alumno.";
    return null;
  };
  const ready = rows.filter((r) => !problemOf(r));

  async function save() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const payload: ResultInput[] = [];
    for (const r of ready) {
      let image_path: string | null = null;
      if (r.blob) {
        const path = `${exam.school_id}/${exam.id}/${r.studentId}.jpg`;
        const { error } = await supabase.storage.from("exam-sheets").upload(path, r.blob, { contentType: "image/jpeg", upsert: true });
        if (!error) image_path = path;
      }
      payload.push({ student_id: r.studentId, theme: r.theme, answers: r.answers.join(""), sheet_code: r.code || null, image_path, replace: r.replace });
    }
    const result = await saveExamResults(exam.id, payload);
    setSaving(false);
    if ("error" in result) {
      setMessage({ ok: false, text: result.error });
      return;
    }
    const withoutPhoto = payload.filter((p) => !p.image_path).length;
    const done = new Set(ready.map((r) => r.id));
    setSavedIds((prev) => [...prev, ...ready.map((r) => r.studentId)]);
    setRows((prev) => prev.filter((r) => !done.has(r.id)));
    setMessage({ ok: true, text: `Se guardaron ${result.saved} fichas.${withoutPhoto ? ` ${withoutPhoto} quedaron sin foto (no se pudo subir la imagen).` : ""}` });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4">
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Button onClick={() => inputRef.current?.click()} disabled={!!progress || saving}>
          <UploadIcon />
          Subir fotos de fichas
        </Button>
        {progress && (
          <span className="text-sm text-muted-foreground">
            Leyendo {progress.done} de {progress.total}…
          </span>
        )}
        {rows.length > 0 && !progress && (
          <span className="text-sm text-muted-foreground">
            {rows.length} por revisar · {ready.length} listas para guardar
          </span>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{savedIds.length} fichas ya guardadas en este examen</span>
      </div>

      {Object.keys(keys).length === 0 && (
        <p className="flex items-center gap-2 rounded-2xl border border-border p-3 text-sm text-muted-foreground">
          <AlertTriangleIcon className="size-4" />
          Este examen todavía no tiene clave de respuestas: las fichas se guardarán sin nota y se calificarán solas cuando registres la clave.
        </p>
      )}
      {!hasGroups && (
        <p className="flex items-center gap-2 rounded-2xl border border-border p-3 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangleIcon className="size-4 shrink-0" />
          Este examen no tiene secciones: no se puede verificar que cada código sea de un alumno que lo rinde. Edita el examen y elige sus secciones antes de procesar las fichas.
        </p>
      )}
      {message && <p className={cn("rounded-2xl border border-border p-3 text-sm", message.ok ? "text-emerald-700 dark:text-emerald-300" : "text-destructive")}>{message.text}</p>}

      {rows.map((row) => {
        const problem = problemOf(row);
        const result = grade(row.answers.join(""), keys[row.theme], exam.max_score);
        const match = resolve(row.code);
        const chosen = row.studentId ? byId.get(row.studentId) : undefined;
        const codeComplete = !!row.code && !row.code.includes("?");
        return (
          <div key={row.id} className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="flex flex-col gap-2">
              {row.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.preview} alt={row.fileName} className="w-full cursor-zoom-in rounded-lg border border-border" onClick={() => setZoom(row.preview)} />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-border text-sm text-muted-foreground">Sin vista previa</div>
              )}
              <span className="truncate text-xs text-muted-foreground" title={row.fileName}>
                {row.fileName}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {row.error ? (
                <p className="text-sm text-destructive">{row.error}</p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)_100px]">
                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                      Código leído
                      <Input
                        value={row.code}
                        maxLength={layout.codeColumns.length}
                        className="font-mono"
                        onChange={(e) => {
                          const code = e.target.value.replace(/[^\d?]/g, "");
                          const found = resolve(code).student;
                          update(row.id, { code, studentId: found?.id ?? row.studentId, replace: false });
                        }}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                      Alumno
                      <select
                        value={row.studentId}
                        onChange={(e) => update(row.id, { studentId: e.target.value, replace: false })}
                        className={cn("h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground", !row.studentId && "border-destructive")}
                      >
                        <option value="">— Elegir alumno —</option>
                        {candidates.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} · {s.code}
                            {s.group ? ` · ${s.group}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                      Tipo
                      <select
                        value={row.theme}
                        onChange={(e) => update(row.id, { theme: e.target.value })}
                        className={cn("h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground", !row.theme && "border-destructive")}
                      >
                        <option value="">—</option>
                        {layout.themes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {!row.studentId && match.outsider && (
                    <p className="flex items-start gap-2 text-sm text-destructive">
                      <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                      <span>
                        El código <span className="font-mono">{row.code}</span> es de {match.outsider.name}
                        {match.outsider.group ? ` (${match.outsider.group})` : ""}, que no rinde este examen. La ficha no se asignó: revisa el nombre escrito en ella y elige al alumno correcto.
                      </span>
                    </p>
                  )}
                  {!row.studentId && !match.outsider && row.code && hasGroups && (
                    <p className="flex items-start gap-2 text-sm text-destructive">
                      <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                      <span>
                        El código <span className="font-mono">{row.code}</span> no es de ningún alumno de este examen. Revisa el nombre escrito en la ficha y elige al alumno.
                      </span>
                    </p>
                  )}
                  {!row.studentId && match.suggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Códigos parecidos en este examen:</span>
                      {match.suggestions.slice(0, 4).map((s) => (
                        <Button key={s.id} type="button" variant="outline" size="sm" onClick={() => update(row.id, { studentId: s.id, replace: false })}>
                          <span className="font-mono">{s.code}</span> · {s.name}
                        </Button>
                      ))}
                    </div>
                  )}
                  {chosen && codeComplete && !codeBelongsTo(row.code, chosen) && (
                    <p className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                      <span>
                        El código marcado en la ficha (<span className="font-mono">{row.code}</span>) no es el de {chosen.name} (<span className="font-mono">{chosen.code}</span>). Confirma con el nombre escrito en la ficha que es su examen.
                      </span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {row.answers.map((answer, i) => {
                      const mark = result?.marks[i];
                      return (
                        <label key={i} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                          {i + 1}
                          <select
                            value={answer}
                            onChange={(e) => update(row.id, { answers: row.answers.map((a, k) => (k === i ? e.target.value : a)) })}
                            className={cn(
                              "h-9 w-12 rounded-md border border-border bg-background text-center font-mono text-sm text-foreground",
                              mark === "1" && "border-emerald-600/50 bg-emerald-500/15",
                              mark === "0" && "border-red-600/50 bg-red-500/15"
                            )}
                          >
                            {layout.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                            <option value={BLANK}>·</option>
                            <option value={MULTIPLE}>✱</option>
                          </select>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">· = en blanco, ✱ = más de una marca (anulada). Compara con la foto: verde es lo que se leyó como relleno.</p>

                  {row.warnings.map((w) => (
                    <p key={w} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <AlertTriangleIcon className="size-4 shrink-0" />
                      {w}
                    </p>
                  ))}
                  {row.studentId && savedIds.includes(row.studentId) && (
                    <label className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <input type="checkbox" checked={row.replace} onChange={(e) => update(row.id, { replace: e.target.checked })} className="size-4 accent-primary" />
                      {chosen?.name ?? "Este alumno"} ya tiene una ficha guardada en este examen. Reemplazarla por esta.
                    </label>
                  )}
                </>
              )}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm">
                  {problem ? (
                    <span className="text-destructive">{problem}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                      <CheckIcon className="size-4" />
                      Lista
                      {result && (
                        <span className="text-foreground">
                          {" "}
                          · {result.correct} de {exam.question_count} · nota <span className="font-mono">{formatScore(result.score)}</span>
                        </span>
                      )}
                    </span>
                  )}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}>
                  <Trash2Icon />
                  Quitar
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {rows.length > 0 && (
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-border bg-background p-3">
          <span className="text-sm text-muted-foreground">
            {ready.length} de {rows.length} listas
          </span>
          <Button onClick={save} disabled={saving || !!progress || ready.length === 0}>
            {saving ? "Guardando…" : `Guardar ${ready.length} fichas`}
          </Button>
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4" onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Ficha ampliada" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
