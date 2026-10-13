"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DownloadIcon, EyeIcon, EyeOffIcon, ListChecksIcon, LockIcon, LockOpenIcon, PencilIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WINDOW_LABEL, formatDuration, type OnlineWindow } from "@/lib/exams/online";
import { ExamSheet, type ExamFormData } from "../exam-sheet";
import { setExamPublished } from "../actions";
import { reopenAttempt, setExamOpen } from "../online-actions";

export function OnlineExamHeader({ item, classGroups, status, ready }: { item: ExamFormData; classGroups: { id: string; label: string }[]; status: OnlineWindow; ready: boolean }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { exam } = item;

  const run = (action: () => Promise<{ error: string } | undefined>) => start(async () => setError((await action())?.error ?? null));

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="flex flex-wrap items-center gap-2 text-lg font-medium">
          {exam.title}
          <Badge variant={status === "open" ? "default" : "secondary"}>{WINDOW_LABEL[status]}</Badge>
          {exam.published && <Badge variant="outline">Respuestas liberadas</Badge>}
        </h1>
        <p className="text-sm text-muted-foreground">
          {exam.subject ? `${exam.subject} · ` : ""}
          {exam.exam_date} · examen en línea · {exam.question_count} preguntas · nota sobre {exam.max_score}
          {exam.time_limit_seconds ? ` · ${formatDuration(exam.time_limit_seconds)} ${exam.time_mode === "total" ? "en total" : "por pregunta"}` : ""}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <PencilIcon />
          Editar
        </Button>
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/examenes/${exam.id}/preguntas`} />}>
          <ListChecksIcon />
          Preguntas
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => run(() => setExamPublished(exam.id, !exam.published))}
          disabled={pending}
          title="Antes de liberar, los alumnos y apoderados solo ven la nota. Al liberar ven las preguntas, lo que marcaron y las respuestas correctas."
        >
          {exam.published ? <EyeOffIcon /> : <EyeIcon />}
          {exam.published ? "Ocultar preguntas y respuestas" : "Liberar preguntas y respuestas"}
        </Button>
        {exam.published && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/examenes/${exam.id}/ranking`} />}>
            <DownloadIcon />
            Descargar ranking de resultados
          </Button>
        )}
        {status === "open" ? (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => {
              if (window.confirm("¿Cerrar el examen ahora? Los alumnos que lo estén rindiendo terminan con lo que tengan respondido.")) run(() => setExamOpen(exam.id, false));
            }}
          >
            <LockIcon />
            Cerrar ahora
          </Button>
        ) : (
          <Button size="sm" disabled={pending || !ready} title={ready ? undefined : "Primero escribe las preguntas y define el tiempo"} onClick={() => run(() => setExamOpen(exam.id, true))}>
            <LockOpenIcon />
            Abrir ahora
          </Button>
        )}
      </div>
      <ExamSheet item={item} classGroups={classGroups} open={editing} onOpenChange={setEditing} />
    </div>
  );
}

export function ReopenButton({ examId, studentId }: { examId: string; studentId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      title="Reabrir el examen para este alumno"
      onClick={() => {
        if (!window.confirm("¿Reabrir el examen para este alumno? Se borran sus respuestas y su nota, y podrá rendirlo de nuevo desde el inicio mientras el examen esté abierto.")) return;
        start(async () => {
          const result = await reopenAttempt(examId, studentId);
          if (result?.error) window.alert(result.error);
        });
      }}
    >
      <RotateCcwIcon />
    </Button>
  );
}
