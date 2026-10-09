"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { MAX_PDF_BYTES, toJpeg } from "@/lib/exams/upload";
import { addExamFile, deleteExamFile, type ExamFileKind } from "../actions";

export type ExamFileView = { id: string; theme: string; kind: ExamFileKind; url: string | null; pdf: boolean };

// Archivos que verán el alumno y sus apoderados junto a su resultado: por cada
// tipo de examen, las páginas del cuadernillo y la ficha de respuestas.
export function ExamMaterials({ examId, schoolId, themes, files }: { examId: string; schoolId: string; themes: string[]; files: ExamFileView[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
      <div>
        <h2 className="font-medium">Archivos del examen</h2>
        <p className="text-sm text-muted-foreground">
          Lo que subas aquí es el mismo para todos los alumnos de cada tipo: el examen en blanco y la ficha de respuestas. No subas aquí exámenes calificados de un alumno: esos van en «Registrar respuestas», en la fila de cada alumno. Se aceptan imágenes y PDF.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {themes.map((theme) => (
          <div key={theme} className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <span className="text-sm font-medium">Tipo {theme}</span>
            <Slot examId={examId} schoolId={schoolId} theme={theme} kind="exam" label="Examen en blanco" hint="Un PDF, o una imagen por página en orden." files={files.filter((f) => f.theme === theme && f.kind === "exam")} />
            <Slot
              examId={examId}
              schoolId={schoolId}
              theme={theme}
              kind="answer_sheet"
              label="Ficha de respuestas"
              hint="Un solo archivo: imagen o PDF."
              files={files.filter((f) => f.theme === theme && f.kind === "answer_sheet")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Slot({ examId, schoolId, theme, kind, label, hint, files }: { examId: string; schoolId: string; theme: string; kind: ExamFileKind; label: string; hint: string; files: ExamFileView[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();
  const single = kind === "answer_sheet";

  async function handleFiles(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    // Las páginas se guardan en el orden del nombre de archivo.
    const picked = [...list].sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true })).slice(0, single ? 1 : undefined);
    for (const file of picked) {
      // El PDF se sube tal cual; las imágenes se reducen antes.
      const pdf = file.type === "application/pdf";
      if (pdf && file.size > MAX_PDF_BYTES) {
        setError(`${file.name} pesa más de 20 MB.`);
        continue;
      }
      const blob = pdf ? file : await toJpeg(file);
      if (!blob) {
        setError(`No se pudo abrir ${file.name}: debe ser una imagen o un PDF.`);
        continue;
      }
      const path = `${schoolId}/${examId}/material/${theme}-${kind}-${crypto.randomUUID()}.${pdf ? "pdf" : "jpg"}`;
      const { error: uploadError } = await supabase.storage.from("exam-sheets").upload(path, blob, { contentType: pdf ? "application/pdf" : "image/jpeg" });
      if (uploadError) {
        setError(`No se pudo subir ${file.name}.`);
        continue;
      }
      const result = await addExamFile(examId, theme, kind, path);
      if (result?.error) setError(result.error);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  function remove(fileId: string) {
    if (!window.confirm("¿Eliminar este archivo?")) return;
    startDelete(async () => {
      const result = await deleteExamFile(examId, fileId);
      setError(result?.error ?? null);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple={!single} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Button type="button" variant="outline" size="sm" disabled={busy || deleting} onClick={() => inputRef.current?.click()}>
          <UploadIcon />
          {busy ? "Subiendo…" : single && files.length ? "Reemplazar" : single ? "Subir archivo" : "Agregar archivos"}
        </Button>
      </div>
      {files.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Sin archivos.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={f.id} className="relative w-24">
              <a href={f.url ?? "#"} target="_blank" rel="noreferrer">
                {f.pdf ? (
                  <span className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 rounded-lg border border-border bg-muted text-xs text-muted-foreground">
                    <FileTextIcon className="size-6" />
                    PDF
                  </span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url ?? ""} alt={`${label} ${i + 1}`} className="aspect-[3/4] w-full rounded-lg border border-border object-cover" />
                )}
              </a>
              <Button type="button" variant="outline" size="icon-sm" className="absolute top-1 right-1 bg-background" disabled={deleting} title="Eliminar archivo" onClick={() => remove(f.id)}>
                <Trash2Icon />
              </Button>
              {!single && <span className="mt-1 block text-center text-xs text-muted-foreground">{f.pdf ? "PDF" : `Pág. ${i + 1}`}</span>}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
