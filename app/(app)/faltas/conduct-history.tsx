import Link from "next/link";
import { FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sheetCode, shortDate, timeOfDay, type ConductEntry, type ConductKind } from "@/lib/conduct";

export const KIND_BADGE: Record<ConductKind, string> = {
  falta: "border-transparent bg-badge-vencido/15 text-badge-vencido",
  registro: "border-transparent bg-badge-pendiente/15 text-badge-pendiente",
  permiso: "border-transparent bg-badge-parcial/15 text-badge-parcial",
};

export const KIND_SHORT: Record<ConductKind, string> = { falta: "Falta", registro: "Registro", permiso: "Permiso" };

type Sheet = { id: string; number: number; date: string };

// Historial de un alumno agrupado por día: faltas, registros, permisos y fichas.
export function ConductHistory({ entries, sheets, canPrint }: { entries: ConductEntry[]; sheets: Sheet[]; canPrint: boolean }) {
  const days = [...new Set([...entries.map((e) => e.date), ...sheets.map((s) => s.date)])].sort().reverse();
  if (days.length === 0) return <p className="text-sm text-muted-foreground">Sin faltas ni permisos registrados.</p>;

  return (
    <div className="flex flex-col gap-4">
      {days.map((day) => (
        <section key={day} className="flex flex-col gap-2">
          <h3 className="text-xs text-muted-foreground uppercase first-letter:uppercase">{shortDate(day)}</h3>
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
            {entries
              .filter((e) => e.date === day)
              .map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-2 px-4 py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{timeOfDay(e.created_at)}</span>
                  <Badge variant="outline" className={cn(KIND_BADGE[e.kind])}>
                    {KIND_SHORT[e.kind]}
                  </Badge>
                  <span className="min-w-0 flex-1">
                    {e.norm}
                    {e.note && <span className="text-muted-foreground"> — {e.note}</span>}
                  </span>
                  {e.recorded_by && <span className="text-xs text-muted-foreground">{e.recorded_by}</span>}
                </li>
              ))}
            {sheets
              .filter((s) => s.date === day)
              .map((s) => (
                <li key={s.id} className="flex items-center gap-2 px-4 py-2 text-sm">
                  <FileTextIcon className="size-4 text-muted-foreground" />
                  <span className="flex-1">Acta y ficha de reflexión N.° {sheetCode(s.number, s.date)}</span>
                  {canPrint && (
                    <Link href={`/faltas/fichas?ids=${s.id}`} className="text-sm text-brand-green-text hover:underline">
                      Ver e imprimir
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
