"use client";

import { useMemo, useState } from "react";
import { CheckCircle2Icon, LightbulbIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { FractionCells, VisualView } from "@/components/games/visuals";
import { Button } from "@/components/ui/button";
import { makeRng, newSeed } from "@/lib/games/rng";
import type { Question, Skill } from "@/lib/games/types";
import { answerText } from "@/lib/games/worksheets";
import { cn } from "@/lib/utils";
import { OptionLabel } from "./option-label";

// «Aprender con un ejemplo»: una pregunta del mismo juego, la idea clave para
// resolverla y la solución paso a paso. Es solo para mirar: no cuenta para el
// puntaje ni se guarda.

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <span className="flex size-6 items-center justify-center rounded-full border border-border-prominent text-xs tabular-nums">{n}</span>
        {title}
      </h3>
      <div className="pl-8">{children}</div>
    </section>
  );
}

// Cómo se ve la pregunta, sin poder contestarla.
export function QuestionPreview({ q }: { q: Question }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-elevated p-4">
      <p className="whitespace-pre-line text-center text-base">{q.prompt}</p>
      {q.visual && <VisualView visual={q.visual} />}
      {(q.kind === "choice" || q.kind === "multi") && (
        <div className={cn("grid w-full gap-2", q.blocks || q.mono ? "grid-cols-1 sm:grid-cols-2" : "max-w-md grid-cols-2")}>
          {q.options.map((o) => (
            <div key={o} className="flex min-h-10 items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-center text-sm">
              <OptionLabel text={o} blocks={q.blocks} mono={q.mono} />
            </div>
          ))}
        </div>
      )}
      {q.kind === "sequence" && (
        <div className="flex flex-wrap justify-center gap-2">
          {q.tiles.map((t, i) => (
            <div key={`${t}-${i}`} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm">
              <OptionLabel text={t} blocks={q.blocks} mono={q.mono} />
            </div>
          ))}
        </div>
      )}
      {q.kind === "shade" && <FractionCells parts={q.parts} shape={q.shape} shaded={() => false} />}
      {(q.kind === "number" || q.kind === "text") && (
        <div className="h-10 w-32 rounded-lg border border-dashed border-border-prominent" aria-hidden />
      )}
    </div>
  );
}

export function ExamplePanel({ skill, onClose }: { skill: Pick<Skill, "generate" | "idea">; onClose: () => void }) {
  const [seed, setSeed] = useState(newSeed);
  const q = useMemo(() => skill.generate(makeRng(seed)), [skill, seed]);
  // Una explicación que solo repite la respuesta no se muestra como paso.
  const steps = (q.solution?.length ? q.solution : [q.explanation]).filter((s) => !/^(La respuesta (correcta )?es|Esa es la respuesta correcta)/.test(s));

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-medium">
          <LightbulbIcon className="size-4 text-brand-green-text" />
          Aprender con un ejemplo
        </h2>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setSeed(newSeed())}>
            <RefreshCwIcon />
            Otro ejemplo
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar el ejemplo">
            <XIcon />
          </Button>
        </div>
      </div>

      <Step n={1} title="Pregunta">
        <QuestionPreview q={q} />
      </Step>

      {skill.idea && (
        <Step n={2} title="Idea clave">
          <p className="rounded-xl border border-border-brand bg-brand-green/5 p-4 text-sm leading-relaxed">{skill.idea}</p>
        </Step>
      )}

      <Step n={skill.idea ? 3 : 2} title="Solución">
        {steps.length > 0 && (
          <ol className="flex flex-col gap-2 text-sm leading-relaxed">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        )}
        <p className={cn("flex items-center gap-2 text-sm", steps.length > 0 && "mt-4")}>
          <CheckCircle2Icon className="size-4 shrink-0 text-brand-green-text" />
          <span>
            La respuesta es{" "}
            <span className={cn("font-medium", q.mono && "whitespace-pre-wrap font-mono")}>
              {q.kind === "choice" && q.blocks ? <OptionLabel text={q.answer} blocks /> : answerText(q)}
            </span>
            .
          </span>
        </p>
      </Step>
    </div>
  );
}
