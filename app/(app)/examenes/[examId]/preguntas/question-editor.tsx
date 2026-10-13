"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlusIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toJpeg } from "@/lib/exams/upload";
import { MAX_ONLINE_QUESTIONS, MAX_OPTIONS, MIN_OPTIONS, OPTION_LETTERS, blankQuestion, type QuestionDraft } from "@/lib/exams/online";
import { formatScore } from "@/lib/exams/shared";
import { saveOnlineQuestions } from "../../online-actions";

export function QuestionEditor({
  examId,
  schoolId,
  maxScore,
  initial,
  imageUrls,
  locked,
}: {
  examId: string;
  schoolId: string;
  maxScore: number;
  initial: QuestionDraft[];
  imageUrls: Record<string, string>;
  // Ya hay alumnos que empezaron: no se puede cambiar cuántas preguntas o alternativas hay.
  locked: boolean;
}) {
  const [questions, setQuestions] = useState(initial);
  const [urls, setUrls] = useState(imageUrls);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const totalPoints = questions.reduce((sum, q) => sum + (q.points > 0 ? q.points : 0), 0);

  function update(index: number, patch: Partial<QuestionDraft>) {
    setMessage(null);
    setQuestions((list) => list.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function removeOption(index: number, option: number) {
    const q = questions[index];
    const correct = q.correct === null ? null : q.correct === option ? null : q.correct > option ? q.correct - 1 : q.correct;
    update(index, { options: q.options.filter((_, i) => i !== option), correct });
  }

  async function uploadImage(index: number, file: File) {
    setUploading(index);
    setMessage(null);
    const blob = await toJpeg(file);
    if (!blob) {
      setMessage({ ok: false, text: `No se pudo abrir ${file.name}: debe ser una imagen.` });
      setUploading(null);
      return;
    }
    const path = `${schoolId}/${examId}/questions/${crypto.randomUUID()}.jpg`;
    const { error } = await createClient().storage.from("exam-sheets").upload(path, blob, { contentType: "image/jpeg" });
    setUploading(null);
    if (error) {
      setMessage({ ok: false, text: "No se pudo subir la imagen." });
      return;
    }
    setUrls((u) => ({ ...u, [path]: URL.createObjectURL(blob) }));
    update(index, { image_path: path });
  }

  function save() {
    start(async () => {
      const result = await saveOnlineQuestions(examId, questions);
      if (result?.error) {
        setMessage({ ok: false, text: result.error });
      } else {
        setMessage({ ok: true, text: "Preguntas guardadas." });
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {locked && (
        <p className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
          Ya hay alumnos que empezaron este examen. Puedes corregir textos, puntajes o la alternativa correcta (las notas se recalculan), pero no agregar ni quitar preguntas o alternativas.
        </p>
      )}

      {questions.map((q, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm text-muted-foreground">Pregunta {index + 1}</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Puntaje
                <Input type="number" min={0.25} step={0.25} value={q.points} onChange={(e) => update(index, { points: Number(e.target.value) })} className="w-20" />
              </label>
              {!locked && questions.length > 1 && (
                <Button type="button" variant="ghost" size="icon-sm" title="Eliminar pregunta" onClick={() => setQuestions((list) => list.filter((_, i) => i !== index))}>
                  <TrashIcon />
                </Button>
              )}
            </div>
          </div>

          <Textarea value={q.title} onChange={(e) => update(index, { title: e.target.value })} placeholder="Enunciado de la pregunta" rows={2} />

          {q.image_path ? (
            <div className="flex items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {urls[q.image_path] && <img src={urls[q.image_path]} alt={`Imagen de la pregunta ${index + 1}`} className="max-h-48 rounded-lg border border-border" />}
              <Button type="button" variant="ghost" size="icon-sm" title="Quitar imagen" onClick={() => update(index, { image_path: null })}>
                <XIcon />
              </Button>
            </div>
          ) : (
            <ImageButton busy={uploading === index} onFile={(file) => uploadImage(index, file)} />
          )}

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Alternativas (marca la correcta)</span>
            {q.options.map((option, o) => (
              <div key={o} className="flex items-center gap-2">
                <input type="radio" name={`correct_${index}`} checked={q.correct === o} onChange={() => update(index, { correct: o })} className="size-4 accent-primary" aria-label={`La alternativa ${OPTION_LETTERS[o]} es la correcta`} />
                <span className="w-4 font-mono text-sm text-muted-foreground">{OPTION_LETTERS[o]}</span>
                <Input value={option} onChange={(e) => update(index, { options: q.options.map((x, i) => (i === o ? e.target.value : x)) })} placeholder={`Alternativa ${OPTION_LETTERS[o]}`} className={q.correct === o ? "border-primary" : ""} />
                {!locked && q.options.length > MIN_OPTIONS && (
                  <Button type="button" variant="ghost" size="icon-sm" title="Quitar alternativa" onClick={() => removeOption(index, o)}>
                    <XIcon />
                  </Button>
                )}
              </div>
            ))}
            {!locked && q.options.length < MAX_OPTIONS && (
              <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => update(index, { options: [...q.options, ""] })}>
                <PlusIcon />
                Agregar alternativa
              </Button>
            )}
          </div>
        </div>
      ))}

      {!locked && questions.length < MAX_ONLINE_QUESTIONS && (
        <Button type="button" variant="outline" className="w-fit" onClick={() => setQuestions((list) => [...list, blankQuestion()])}>
          <PlusIcon />
          Agregar pregunta
        </Button>
      )}

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background py-3">
        <div className="flex flex-col text-sm">
          <span>
            {questions.length} {questions.length === 1 ? "pregunta" : "preguntas"} · {formatScore(Math.round(totalPoints * 100) / 100)} puntos en total
          </span>
          <span className="text-xs text-muted-foreground">Quien acierta todo obtiene {formatScore(maxScore)}; el resto, en proporción a los puntos ganados.</span>
          {message && <span className={message.ok ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>{message.text}</span>}
        </div>
        <Button onClick={save} disabled={pending || uploading !== null}>
          {pending ? "Guardando..." : "Guardar preguntas"}
        </Button>
      </div>
    </div>
  );
}

function ImageButton({ busy, onFile }: { busy: boolean; onFile: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <Button type="button" variant="ghost" size="sm" className="w-fit" disabled={busy} onClick={() => ref.current?.click()}>
        <ImagePlusIcon />
        {busy ? "Subiendo..." : "Agregar imagen (opcional)"}
      </Button>
    </>
  );
}
