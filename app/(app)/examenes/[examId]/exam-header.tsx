"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DownloadIcon, EyeIcon, EyeOffIcon, KeyboardIcon, PencilIcon, ScanLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExamSheet, type ExamFormData } from "../exam-sheet";
import { setExamPublished } from "../actions";

export function ExamHeader({ item, classGroups }: { item: ExamFormData; classGroups: { id: string; label: string }[] }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { exam } = item;

  function toggle() {
    start(async () => {
      const result = await setExamPublished(exam.id, !exam.published);
      setError(result?.error ?? null);
    });
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 text-lg font-medium">
          {exam.title}
          <Badge variant={exam.published ? "default" : "secondary"}>{exam.published ? "Publicado" : "Borrador"}</Badge>
        </h1>
        <p className="text-sm text-muted-foreground">
          {exam.subject ? `${exam.subject} · ` : ""}
          {exam.exam_date} · {exam.question_count} preguntas · nota sobre {exam.max_score}
          {exam.entry_mode === "manual" ? " · registro manual" : ""}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <PencilIcon />
          Editar
        </Button>
        <Button variant="outline" size="sm" onClick={toggle} disabled={pending} title="Los alumnos y apoderados solo ven el examen cuando está publicado">
          {exam.published ? <EyeOffIcon /> : <EyeIcon />}
          {exam.published ? "Ocultar a las familias" : "Publicar resultados"}
        </Button>
        {exam.published && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/examenes/${exam.id}/ranking`} />}>
            <DownloadIcon />
            Descargar ranking de resultados
          </Button>
        )}
        {exam.entry_mode === "manual" ? (
          <Button size="sm" nativeButton={false} render={<Link href={`/examenes/${exam.id}/registrar`} />}>
            <KeyboardIcon />
            Registrar respuestas
          </Button>
        ) : (
          <Button size="sm" nativeButton={false} render={<Link href={`/examenes/${exam.id}/procesar`} />}>
            <ScanLineIcon />
            Procesar fichas
          </Button>
        )}
      </div>
      <ExamSheet item={item} classGroups={classGroups} open={editing} onOpenChange={setEditing} />
    </div>
  );
}
