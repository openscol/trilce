import { cn } from "@/lib/utils";

// Respuestas de una ficha, una casilla por pregunta; verde/rojo si ya hay clave.
export function AnswerStrip({ answers, marks }: { answers: string; marks: string | null }) {
  return (
    <span className="flex flex-wrap gap-0.5 font-mono text-xs">
      {[...answers].map((a, i) => (
        <span
          key={i}
          title={`Pregunta ${i + 1}`}
          className={cn(
            "flex size-6 items-center justify-center rounded border border-border [print-color-adjust:exact]",
            marks?.[i] === "1" && "border-emerald-600/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 print:text-emerald-800",
            marks?.[i] === "0" && "border-red-600/40 bg-red-500/15 text-red-700 dark:text-red-300 print:text-red-800"
          )}
        >
          {a === "-" ? "·" : a === "*" ? "✱" : a}
        </span>
      ))}
    </span>
  );
}
