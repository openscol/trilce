"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon, FileTextIcon, HistoryIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sheetCode, timeOfDay, type ConductCategory, type ConductEntry } from "@/lib/conduct";
import { deleteConductRecord, deleteSheet, registerConduct } from "../actions";
import { KIND_BADGE, KIND_SHORT } from "../conduct-history";
import { SheetDialog, type Signer } from "./sheet-dialog";

type Student = { id: string; name: string };

// Se registra en dos toques: primero los alumnos, luego la norma.
export function RegisterBoard({
  students,
  categories,
  faltasPerSheet,
  entries,
  sheets,
  teachers,
  assistants,
  defaultTeacherId,
}: {
  students: Student[];
  categories: ConductCategory[];
  faltasPerSheet: number;
  entries: ConductEntry[];
  sheets: { id: string; number: number; date: string; student_id: string }[];
  teachers: Signer[];
  assistants: Signer[];
  defaultTeacherId: string | null;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sheetFor, setSheetFor] = useState<{ ids: string[]; reachedLimit: boolean } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const nameOf = new Map(students.map((s) => [s.id, s.name]));
  const pendingFaltas = (studentId: string) => entries.filter((e) => e.student_id === studentId && e.kind === "falta" && !e.sheet_id).length;

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function register(normId: string) {
    setError(null);
    start(async () => {
      const result = await registerConduct([...selected], normId, note);
      if ("error" in result) setError(result.error);
      else {
        setSelected(new Set());
        setNote("");
      }
      router.refresh();
      // Al llegar al límite de faltas del día, se sugiere generar la ficha.
      if (result.reached?.length) setSheetFor({ ids: result.reached, reachedLimit: true });
    });
  }

  function remove(action: () => Promise<{ error: string } | undefined>) {
    setError(null);
    start(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
      router.refresh();
    });
  }

  if (students.length === 0) {
    return <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Esta sección no tiene alumnos vinculados. Asígnales la sección desde la ficha del alumno.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">1.</span> Toca a los alumnos · <span className="font-medium text-foreground">2.</span> Toca la norma. Con {faltasPerSheet} faltas de convivencia en el día se sugiere la ficha de reflexión.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {students.map((s) => {
            const isSelected = selected.has(s.id);
            const faltas = pendingFaltas(s.id);
            const mine = entries.filter((e) => e.student_id === s.id);
            const others = mine.filter((e) => e.kind !== "falta");
            return (
              <div key={s.id} className={cn("flex flex-col rounded-xl border transition-colors", isSelected ? "border-brand-green bg-brand-green/10" : "border-border")}>
                <button type="button" onClick={() => toggle(s.id)} aria-pressed={isSelected} className="flex items-start gap-2 p-3 text-left">
                  <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border", isSelected ? "border-brand-green bg-brand-green text-black" : "border-border-prominent")}>
                    {isSelected && <CheckIcon className="size-3" />}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">{s.name}</span>
                  {faltas > 0 && (
                    <span className={cn("rounded-md px-2 font-mono text-xs", faltas >= faltasPerSheet ? "bg-badge-vencido/15 text-badge-vencido" : "bg-muted text-muted-foreground")} title="Faltas de hoy sin ficha">
                      {faltas}/{faltasPerSheet}
                    </span>
                  )}
                </button>
                {(others.length > 0 || faltas > 0) && (
                  <div className="flex flex-wrap items-center gap-1 border-t border-border px-3 py-2">
                    {others.map((e) => (
                      <Badge key={e.id} variant="outline" className={cn(KIND_BADGE[e.kind], "max-w-full")} title={e.norm}>
                        <span className="truncate">{e.norm}</span>
                      </Badge>
                    ))}
                    {faltas > 0 && (
                      <button type="button" onClick={() => setSheetFor({ ids: [s.id], reachedLimit: false })} className="ml-auto flex items-center gap-1 text-xs text-brand-green-text hover:underline">
                        <FileTextIcon className="size-3" />
                        Generar ficha
                      </button>
                    )}
                  </div>
                )}
                <Link href={`/faltas/alumno/${s.id}`} className="flex items-center gap-1 border-t border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
                  <HistoryIcon className="size-3" />
                  Historial
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
        <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{selected.size === 0 ? "Elige a los alumnos" : selected.size === 1 ? "1 alumno elegido" : `${selected.size} alumnos elegidos`}</span>
            {selected.size > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground hover:text-foreground">
                Quitar selección
              </button>
            )}
          </div>
          <Input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Observación (opcional)" aria-label="Observación" />
          {categories.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase">
                {c.name}
                <Badge variant="outline" className={cn(KIND_BADGE[c.kind], "normal-case")}>
                  {KIND_SHORT[c.kind]}
                </Badge>
              </span>
              <div className="flex flex-col gap-1">
                {c.norms.map((n) => (
                  <Button key={n.id} variant="outline" size="sm" disabled={pending || selected.size === 0} onClick={() => register(n.id)} className="h-auto justify-start py-2 text-left whitespace-normal">
                    {n.description}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-muted-foreground">No hay normas. La administración las crea en Normas y configuración.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {(entries.length > 0 || sheets.length > 0) && (
          <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
            <span className="text-xs text-muted-foreground uppercase">Hoy en la sección</span>
            <ul className="flex flex-col divide-y divide-border">
              {[...entries].reverse().map((e) => (
                <li key={e.id} className="flex items-start gap-2 py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{timeOfDay(e.created_at)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{nameOf.get(e.student_id) ?? "Alumno"}</span>
                    <span className="block text-muted-foreground">
                      {KIND_SHORT[e.kind]}: {e.norm}
                      {e.note && ` — ${e.note}`}
                    </span>
                  </span>
                  <button type="button" disabled={pending} onClick={() => remove(() => deleteConductRecord(e.id))} aria-label="Borrar registro" title="Borrar registro" className="text-muted-foreground hover:text-destructive">
                    <XIcon className="size-4" />
                  </button>
                </li>
              ))}
              {sheets.map((s) => (
                <li key={s.id} className="flex items-center gap-2 py-2 text-sm">
                  <FileTextIcon className="size-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    Acta y ficha {sheetCode(s.number, s.date)} · {nameOf.get(s.student_id) ?? "Alumno"}
                  </span>
                  <Link href={`/faltas/fichas?ids=${s.id}`} className="text-xs text-brand-green-text hover:underline">
                    Imprimir
                  </Link>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("¿Eliminar esta acta y su ficha? Sus faltas vuelven al conteo de hoy.")) remove(() => deleteSheet(s.id));
                    }}
                    aria-label="Eliminar ficha"
                    title="Eliminar ficha"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <XIcon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {sheetFor && (
        <SheetDialog
          students={sheetFor.ids.map((id) => ({ id, name: nameOf.get(id) ?? "Alumno" }))}
          reachedLimit={sheetFor.reachedLimit ? faltasPerSheet : null}
          teachers={teachers}
          assistants={assistants}
          defaultTeacherId={defaultTeacherId}
          onClose={() => setSheetFor(null)}
        />
      )}
    </div>
  );
}
