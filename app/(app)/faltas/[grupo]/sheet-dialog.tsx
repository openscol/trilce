"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSheets } from "../actions";

export type Signer = { id: string; full_name: string };

// El auxiliar y el lugar se recuerdan en este navegador: suelen ser los mismos todo el año.
const ASSISTANT_KEY = "trilce.faltas.auxiliar";
const PLACE_KEY = "trilce.faltas.lugar";
const DEFAULT_PLACE = "Sala de cómputo";

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function SheetDialog({
  students,
  reachedLimit,
  teachers,
  assistants,
  defaultTeacherId,
  onClose,
}: {
  students: { id: string; name: string }[];
  // Número de faltas al que llegaron, si la ficha se sugiere por el límite.
  reachedLimit: number | null;
  teachers: Signer[];
  assistants: Signer[];
  defaultTeacherId: string | null;
  onClose: () => void;
}) {
  const [teacherId, setTeacherId] = useState(defaultTeacherId && teachers.some((t) => t.id === defaultTeacherId) ? defaultTeacherId : "");
  const [assistantId, setAssistantId] = useState(() => {
    const stored = readStored(ASSISTANT_KEY);
    return stored && assistants.some((a) => a.id === stored) ? stored : "";
  });
  const [place, setPlace] = useState(() => readStored(PLACE_KEY) ?? DEFAULT_PLACE);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const names = students.map((s) => s.name).join(", ");

  function generate() {
    setError(null);
    start(async () => {
      const result = await generateSheets(
        students.map((s) => s.id),
        teacherId || null,
        assistantId || null,
        place
      );
      if ("error" in result) {
        setError(result.error);
        return;
      }
      try {
        window.localStorage.setItem(ASSISTANT_KEY, assistantId);
        window.localStorage.setItem(PLACE_KEY, place);
      } catch {
        // Sin almacenamiento local solo se pierde el recordatorio.
      }
      router.push(`/faltas/fichas?ids=${result.sheetIds.join(",")}`);
    });
  }

  const select = "h-9 w-full rounded-lg border border-border bg-surface-elevated px-2 text-sm focus:border-border-brand focus:outline-none";

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="data-[size=default]:sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{students.length > 1 ? "¿Generar actas y fichas de reflexión?" : "¿Generar acta y ficha de reflexión?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {reachedLimit
              ? `${names} ${students.length > 1 ? "llegaron" : "llegó"} a ${reachedLimit} faltas de convivencia hoy.`
              : `Se generará la ficha de ${names} con sus faltas de hoy.`}{" "}
            Se registran el acta de faltas y la ficha de reflexión, y se abren para imprimir.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <label className="flex flex-col gap-1 text-sm">
          Docente que firma
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={select}>
            <option value="">— Sin docente —</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Auxiliar que firma
          <select value={assistantId} onChange={(e) => setAssistantId(e.target.value)} className={select}>
            <option value="">— Sin auxiliar —</option>
            {assistants.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name}
              </option>
            ))}
          </select>
          {assistants.length === 0 && <span className="text-xs text-muted-foreground">No hay auxiliares registrados. Se agregan en Personal, con el tipo «Auxiliar».</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Lugar
          <Input value={place} onChange={(e) => setPlace(e.target.value)} maxLength={80} placeholder="Sala de cómputo, aula..." />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <Button variant="outline" disabled={pending} onClick={onClose}>
            Ahora no
          </Button>
          <Button disabled={pending} onClick={generate}>
            {pending ? "Generando..." : "Generar e imprimir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
