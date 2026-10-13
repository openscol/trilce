"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ATTENDANCE_LABELS, ATTENDANCE_STATUSES, SIAGIE_CODES, type AttendanceStatus } from "@/lib/attendance";
import { saveMarks, type MarkChange } from "../actions";

type Day = { iso: string; day: number; weekend: boolean };
type Student = { id: string; name: string; marks: Record<string, AttendanceStatus> };

// Orden en que cambia una casilla con cada clic: vacía → A → F → T → J → U → vacía.
const CYCLE: (AttendanceStatus | null)[] = ["presente", "falta", "tardanza", "falta_justificada", "tardanza_justificada", null];
const next = (current: AttendanceStatus | undefined) => CYCLE[(CYCLE.indexOf(current ?? null) + 1) % CYCLE.length];

const CELL: Record<AttendanceStatus, string> = {
  presente: "bg-brand-green/25 text-foreground",
  falta: "bg-red-500/80 text-white",
  tardanza: "bg-amber-400/80 text-black",
  falta_justificada: "bg-blue-500/60 text-white",
  tardanza_justificada: "bg-amber-400/30 text-foreground",
};

const key = (studentId: string, date: string) => `${studentId}|${date}`;

export function AttendanceGrid({
  classGroupId,
  today,
  days,
  editableDates,
  isTeacher,
  students,
}: {
  classGroupId: string;
  today: string;
  days: Day[];
  editableDates: string[];
  isTeacher: boolean;
  students: Student[];
}) {
  const [marks, setMarks] = useState(() => {
    const initial = new Map<string, AttendanceStatus>();
    for (const s of students) for (const [date, status] of Object.entries(s.marks)) initial.set(key(s.id, date), status);
    return initial;
  });
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const editable = useMemo(() => new Set(editableDates), [editableDates]);
  const hasToday = days.some((d) => d.iso === today);

  // Los clics se juntan y se guardan solos poco después del último, para no
  // enviar un pedido por cada paso mientras se recorre el ciclo de una casilla.
  const pending = useRef(new Map<string, MarkChange>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const todayRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, []);

  async function flush() {
    const changes = [...pending.current.values()];
    if (changes.length === 0) return;
    pending.current.clear();
    setState("saving");
    const result = await saveMarks(classGroupId, changes);
    if (result?.error) {
      setError(`${result.error} Recarga la página para ver lo que quedó guardado.`);
      setState("idle");
    } else if (pending.current.size === 0) {
      setState("saved");
    }
  }

  function queue(changes: MarkChange[]) {
    setError(null);
    setState("saving");
    setMarks((current) => {
      const copy = new Map(current);
      for (const c of changes) {
        if (c.status) copy.set(key(c.studentId, c.date), c.status);
        else copy.delete(key(c.studentId, c.date));
      }
      return copy;
    });
    for (const c of changes) pending.current.set(key(c.studentId, c.date), c);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  }

  // Si se sale de la página con cambios en cola, se envían antes.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      void flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function markAllPresent(date: string) {
    queue(students.filter((s) => !marks.has(key(s.id, date))).map((s) => ({ studentId: s.id, date, status: "presente" as const })));
  }

  const todayMissing = hasToday && editable.has(today) ? students.filter((s) => !marks.has(key(s.id, today))).length : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Haz clic en una casilla para marcar; cada clic cambia al siguiente estado.
          {isTeacher ? " Puedes marcar solo la columna de hoy." : " Puedes marcar cualquier día hasta hoy."}
        </p>
        <div className="flex items-center gap-3">
          <span className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")} aria-live="polite">
            {error ?? (state === "saving" ? "Guardando…" : state === "saved" ? "Guardado" : "")}
          </span>
          {todayMissing > 0 && (
            <Button size="sm" onClick={() => markAllPresent(today)}>
              Marcar asistió a los {todayMissing} que faltan hoy
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="border-collapse text-sm tabular-nums">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="sticky left-0 z-10 min-w-48 border-b border-border bg-background px-3 py-2 text-left font-normal uppercase">Alumno</th>
              {days.map((d) => {
                const isToday = d.iso === today;
                return (
                  <th
                    key={d.iso}
                    ref={isToday ? todayRef : undefined}
                    className={cn("border-b border-border px-0 py-2 font-normal", d.weekend && "bg-muted/60", isToday && "bg-brand-green text-black font-medium")}
                    title={isToday ? "Hoy" : undefined}
                  >
                    {d.day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td className="sticky left-0 z-10 border-b border-border bg-background px-3 py-1 whitespace-nowrap">
                  <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                  {student.name}
                </td>
                {days.map((d) => {
                  const status = marks.get(key(student.id, d.iso));
                  const canEdit = editable.has(d.iso);
                  const isToday = d.iso === today;
                  return (
                    <td key={d.iso} className={cn("border-b border-border p-0.5", d.weekend && "bg-muted/60", isToday && "bg-brand-green/15")}>
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => queue([{ studentId: student.id, date: d.iso, status: next(status) }])}
                        title={`${student.name} · día ${d.day}: ${status ? ATTENDANCE_LABELS[status] : "sin marcar"}`}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-md font-medium",
                          status ? CELL[status] : "text-muted-foreground",
                          canEdit ? "cursor-pointer hover:ring-2 hover:ring-border-prominent" : "cursor-default",
                          canEdit && !status && isToday && "border border-dashed border-brand-green"
                        )}
                      >
                        {status ? SIAGIE_CODES[status] : canEdit ? "–" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {ATTENDANCE_STATUSES.map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={cn("flex size-6 items-center justify-center rounded-md font-medium", CELL[s])}>{SIAGIE_CODES[s]}</span>
            {s === "presente" ? "Asistió" : ATTENDANCE_LABELS[s]}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-brand-green font-medium text-black">{Number(today.slice(8))}</span>
          Columna de hoy
        </span>
      </div>
    </div>
  );
}
