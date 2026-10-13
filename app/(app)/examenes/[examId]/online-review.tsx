import { cn } from "@/lib/utils";
import { OPTION_LETTERS } from "@/lib/exams/online";

export type ReviewQuestion = { number: number; title: string; imageUrl: string | null; options: string[]; points: number };

// Revisión de un examen en línea ya rendido: cada pregunta con lo que marcó
// el alumno y la alternativa correcta. Solo se muestra con el examen publicado.
export function OnlineReview({ questions, answers, marks, corrections }: { questions: ReviewQuestion[]; answers: string; marks: string | null; corrections: string | null }) {
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => {
        const i = q.number - 1;
        const chosen = answers[i];
        const ok = marks?.[i] === "1";
        // corrections trae la letra correcta solo en las falladas; en las acertadas es la que marcó.
        const correct = ok ? chosen : corrections?.[i];
        return (
          <div key={q.number} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">
                <span className="font-mono text-muted-foreground">{q.number}. </span>
                {q.title}
              </p>
              {marks && <span className={cn("shrink-0 text-sm", ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{ok ? "✓ Correcta" : chosen === "-" ? "Sin responder" : "✗ Incorrecta"}</span>}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {q.imageUrl && <img src={q.imageUrl} alt={`Imagen de la pregunta ${q.number}`} className="max-h-72 w-fit rounded-lg border border-border" />}
            <div className="flex flex-col gap-1">
              {q.options.map((text, o) => {
                const letter = OPTION_LETTERS[o];
                const isCorrect = correct === letter;
                const isChosen = chosen === letter;
                return (
                  <div
                    key={letter}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm",
                      isCorrect && "border-emerald-600/40 bg-emerald-500/10",
                      isChosen && !isCorrect && "border-red-600/40 bg-red-500/10"
                    )}
                  >
                    <span>
                      <span className="font-mono text-muted-foreground">{letter}. </span>
                      {text}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{[isChosen ? "Tu respuesta" : "", isCorrect ? "Correcta" : ""].filter(Boolean).join(" · ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
