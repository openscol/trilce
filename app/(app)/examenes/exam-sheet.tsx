"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DEFAULT_LAYOUT, MAX_MANUAL_QUESTIONS, MAX_QUESTIONS, SHEET_LAYOUTS, layoutForQuestions } from "@/lib/exams/shared";
import { createExam, deleteExam, updateExam, type Exam, type ExamEntryMode, type FormState } from "./actions";

export type ExamFormData = { exam: Exam; classGroupIds: string[]; keys: Record<string, string>; resultCount: number };

export function ExamSheet({
  item,
  classGroups,
  open,
  onOpenChange,
}: {
  item: ExamFormData | null;
  classGroups: { id: string; label: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {open && <ExamSheetBody key={item?.exam.id ?? "new"} item={item} classGroups={classGroups} onSaved={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function ExamSheetBody({ item, classGroups, onSaved }: { item: ExamFormData | null; classGroups: { id: string; label: string }[]; onSaved: () => void }) {
  const exam = item?.exam ?? null;
  const action = exam ? updateExam.bind(null, exam.id) : createExam;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [questions, setQuestions] = useState(exam?.question_count ?? 10);
  const [mode, setMode] = useState<ExamEntryMode>(exam?.entry_mode ?? "sheet");
  // La ficha depende del número de preguntas: hasta 10, la de 10; de 11 a 20, la de 20.
  const sheet = SHEET_LAYOUTS[layoutForQuestions(questions) ?? DEFAULT_LAYOUT];
  const layout = sheet.layout;

  const submittedRef = useRef(false);
  useEffect(() => {
    if (pending) {
      submittedRef.current = true;
    } else if (submittedRef.current && !state?.error && exam) {
      onSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function handleDelete() {
    if (!exam) return;
    startDelete(async () => {
      const result = await deleteExam(exam.id);
      if (result?.error) setDeleteError(result.error);
    });
  }

  return (
    <form action={formAction} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>{exam ? "Editar examen" : "Nuevo examen"}</SheetTitle>
        <SheetDescription>Datos del examen y clave de respuestas de cada tipo.</SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" defaultValue={exam?.title ?? ""} placeholder="Examen bimestral de Computación" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Curso</Label>
          <Input id="subject" name="subject" defaultValue={exam?.subject ?? ""} placeholder="Computación" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Registro de respuestas</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["sheet", "Ficha de respuestas", "El alumno rellena la ficha y se leen sus fotos."],
                ["manual", "Registro manual", "Sin ficha: escribes lo que marcó cada alumno y subes su examen calificado."],
              ] as const
            ).map(([value, title, hint]) => (
              <label key={value} className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm ${mode === value ? "border-primary" : "border-border"}`}>
                <span className="flex items-center gap-2">
                  <input type="radio" name="entry_mode" value={value} checked={mode === value} onChange={() => setMode(value)} className="size-4 accent-primary" />
                  {title}
                </span>
                <span className="text-xs text-muted-foreground">{hint}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="exam_date">Fecha</Label>
            <Input id="exam_date" name="exam_date" type="date" defaultValue={exam?.exam_date ?? new Date().toISOString().slice(0, 10)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="question_count">Preguntas</Label>
            <Input
              id="question_count"
              name="question_count"
              type="number"
              min={1}
              max={mode === "manual" ? MAX_MANUAL_QUESTIONS : MAX_QUESTIONS}
              value={questions}
              onChange={(e) => setQuestions(Number(e.target.value))}
              readOnly={!!item && item.resultCount > 0}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="max_score">Nota máxima</Label>
            <Input id="max_score" name="max_score" type="number" min={1} step="0.5" defaultValue={exam?.max_score ?? 20} required />
          </div>
        </div>

        {mode === "sheet" && <p className="text-xs text-muted-foreground">{sheet.name}.</p>}

        <div className="flex flex-col gap-2">
          <Label>Clave de respuestas</Label>
          <p className="text-xs text-muted-foreground">
            Una letra por pregunta, en orden ({layout.options.join(", ")}). Ejemplo para {questions} preguntas: {"BBCCBCBBCB".repeat(5).slice(0, questions)}. Deja vacío el tipo que no uses.
          </p>
          {layout.themes.map((theme) => (
            <div key={theme} className="flex items-center gap-2">
              <span className="w-16 text-sm text-muted-foreground">Tipo {theme}</span>
              <Input name={`key_${theme}`} defaultValue={item?.keys[theme] ?? ""} maxLength={questions * 2} className="font-mono uppercase tracking-widest" autoComplete="off" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Secciones que rinden el examen</Label>
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-2">
            {classGroups.length === 0 && <span className="text-sm text-muted-foreground">No hay secciones registradas (se crean en Horario).</span>}
            {classGroups.map((g) => (
              <label key={g.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="class_group_ids" value={g.id} defaultChecked={item?.classGroupIds.includes(g.id)} className="size-4 accent-primary" />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
      </div>

      <SheetFooter className="flex-row justify-between">
        {exam ? (
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={isDeleting} />}>
              <TrashIcon />
              Eliminar
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar el examen?</AlertDialogTitle>
                <AlertDialogDescription>Se borrarán también las {item?.resultCount ?? 0} fichas guardadas y sus fotos. No se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar"}
        </Button>
      </SheetFooter>
    </form>
  );
}
