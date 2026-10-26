"use client";

import { FileDownIcon } from "lucide-react";
import { FractionCells, VisualView } from "@/components/games/visuals";
import { Button } from "@/components/ui/button";
import { getSkill } from "@/lib/games/catalog";
import type { Question } from "@/lib/games/types";
import { answerText, exampleSeed, paperQuestion, type WorksheetItem } from "@/lib/games/worksheets";
import { cn } from "@/lib/utils";
import { OptionLabel } from "../../juegos/[categoria]/[grado]/[skillId]/option-label";

// La ficha se ve como una hoja A4 blanca aunque la app esté en modo oscuro, y
// se imprime igual (Imprimir → Guardar como PDF).
const PAPER_CSS = `
.worksheet-paper {
  --background-base: #ffffff; --surface-card: #ffffff; --surface-elevated: #fafafa;
  --border-subtle: #dfdfdf; --border-prominent: #cfcfcf; --border-brand: rgba(36, 180, 126, 0.35);
  --brand-green-text: #24b47e; --text-primary: #171717; --text-secondary: #525252; --text-muted: #6b6b6b;
  --background: #ffffff; --foreground: #171717; --card: #ffffff; --card-foreground: #171717;
  --muted: #fafafa; --muted-foreground: #6b6b6b; --border: #dfdfdf; --input: #dfdfdf;
  color-scheme: light; background: #ffffff; color: #171717;
}
@media print {
  @page { size: A4; margin: 14mm; }
  html, body { background: #ffffff !important; }
}
`;

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

// Las consignas de los juegos hablan de tocar la pantalla; en papel se marca.
function paperPrompt(prompt: string) {
  return prompt
    .replace(/\s*Toca las letras en orden\.?/g, "")
    .replace(/Tócalos en orden\.?/g, "Escríbelos en orden.")
    .replace(/Toca las partes\.?/g, "Pinta las partes.")
    .replace(/\b(Toca|Selecciona)\b/g, "Marca")
    .replace(/\btoca\b/g, "marca");
}

function AnswerArea({ q }: { q: Question }) {
  switch (q.kind) {
    case "choice":
      return (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
          {q.options.map((o) => (
            <span key={o} className="flex items-center gap-2">
              <span className="size-3.5 shrink-0 rounded-full border border-border-prominent" aria-hidden />
              <OptionLabel text={o} blocks={q.blocks} mono={q.mono} />
            </span>
          ))}
        </div>
      );
    case "multi":
      return (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
          {q.options.map((o) => (
            <span key={o} className="flex items-center gap-2">
              <span className="size-3.5 shrink-0 rounded-sm border border-border-prominent" aria-hidden />
              <OptionLabel text={o} blocks={q.blocks} mono={q.mono} />
            </span>
          ))}
        </div>
      );
    case "sequence":
      return (
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Fichas: {q.tiles.join(" · ")}</span>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: q.length }, (_, i) => (
              <span key={i} className="h-8 min-w-12 rounded-md border border-dashed border-border-prominent" aria-hidden />
            ))}
          </div>
        </div>
      );
    case "shade":
      return <FractionCells parts={q.parts} shape={q.shape} shaded={() => false} />;
    default:
      return (
        <p className="flex items-end gap-2 text-sm">
          Respuesta:
          <span className="inline-block h-6 w-40 border-b border-foreground" aria-hidden />
        </p>
      );
  }
}

// El texto de lectura de una pregunta, si tiene uno.
const passageOf = (q: Question) => (q.visual?.kind === "passage" ? q.visual.text : null);

// Las preguntas sobre un mismo texto van seguidas, para imprimirlo una sola vez.
function groupByPassage(questions: Question[]) {
  const first = new Map<string, number>();
  questions.forEach((q, i) => {
    const text = passageOf(q);
    if (text !== null && !first.has(text)) first.set(text, i);
  });
  return questions
    .map((q, i) => ({ q, at: first.get(passageOf(q) ?? "") ?? i, i }))
    .sort((a, b) => a.at - b.at || a.i - b.i)
    .map(({ q }) => q);
}

function Exercise({ q, label, passageAbove }: { q: Question; label: string; passageAbove?: boolean }) {
  return (
    <li className="flex break-inside-avoid gap-3">
      <span className="font-medium tabular-nums">{label})</span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {q.visual?.kind === "passage" ? (
          // Primero el texto y luego la pregunta; si ya se imprimió, solo la pregunta.
          <>
            {!passageAbove && (
              <div className="flex justify-start">
                <VisualView visual={q.visual} />
              </div>
            )}
            <p className="whitespace-pre-line">{paperPrompt(q.prompt)}</p>
          </>
        ) : (
          <>
            <p className="whitespace-pre-line">{paperPrompt(q.prompt)}</p>
            {q.visual && (
              <div className="flex justify-start">
                <VisualView visual={q.visual} />
              </div>
            )}
          </>
        )}
        <AnswerArea q={q} />
      </div>
    </li>
  );
}

function Explanation({ item }: { item: WorksheetItem }) {
  const skill = getSkill(item.skill);
  if (!skill) return null;
  const q = paperQuestion(skill, exampleSeed(item));
  // Una explicación que solo repite la respuesta no se muestra como paso.
  const steps = (q.solution?.length ? q.solution : [q.explanation]).filter((s) => !/^(La respuesta (correcta )?es|Esa es la respuesta correcta)/.test(s));
  return (
    <div className="flex break-inside-avoid flex-col gap-3 rounded-xl border border-border-brand p-4 text-sm">
      {skill.idea && (
        <p>
          <span className="font-medium">Idea clave. </span>
          {skill.idea}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <p className="font-medium">Ejemplo resuelto</p>
        <p className="whitespace-pre-line">{paperPrompt(q.prompt)}</p>
        {q.visual && (
          <div className="flex justify-start">
            <VisualView visual={q.visual} />
          </div>
        )}
        {steps.length > 0 && (
          <ol className="flex list-decimal flex-col gap-1 pl-5">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}
        <p>
          <span className="font-medium">Respuesta: </span>
          <span className={cn(q.mono && "whitespace-pre-wrap font-mono")}>{answerText(q)}</span>
        </p>
      </div>
    </div>
  );
}

export function DownloadPdfButton({ title }: { title: string }) {
  return (
    <Button
      size="sm"
      onClick={() => {
        // El nombre del archivo PDF sale del título de la página.
        const previous = document.title;
        document.title = title;
        window.print();
        document.title = previous;
      }}
    >
      <FileDownIcon />
      Descargar PDF
    </Button>
  );
}

export function WorksheetDocument({
  title,
  schoolName,
  items,
  includeExplanation,
  includeAnswers,
}: {
  title: string;
  schoolName: string | null;
  items: WorksheetItem[];
  includeExplanation: boolean;
  includeAnswers: boolean;
}) {
  const blocks = items.map((item) => {
    const skill = getSkill(item.skill);
    return { item, skill, questions: skill ? groupByPassage(item.seeds.map((s) => paperQuestion(skill, s))) : [] };
  });

  return (
    <>
      <style>{PAPER_CSS}</style>
      <article className="worksheet-paper mx-auto w-full max-w-[210mm] rounded-2xl border border-border p-[14mm] text-[15px] leading-relaxed print:max-w-none print:rounded-none print:border-0 print:p-0">
        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6">
          {schoolName && <p className="text-xs uppercase tracking-wide text-muted-foreground">{schoolName}</p>}
          <h1 className="text-xl font-medium">{title}</h1>
          <div className="grid grid-cols-[auto_1fr] items-end gap-x-2 gap-y-3 text-sm sm:grid-cols-[auto_1fr_auto_8rem]">
            <span>Nombre:</span>
            <span className="h-6 border-b border-foreground" aria-hidden />
            <span>Fecha:</span>
            <span className="h-6 border-b border-foreground" aria-hidden />
          </div>
        </header>

        <div className="flex flex-col gap-10">
          {blocks.map(({ item, skill, questions }, i) => (
            <section key={item.skill} className="flex flex-col gap-4">
              <div className="break-after-avoid">
                <h2 className="text-base font-medium">
                  {i + 1}. {skill?.title ?? "Juego no disponible"}
                </h2>
                {skill && <p className="text-xs text-muted-foreground">{skill.sectionName}</p>}
              </div>
              {includeExplanation && skill && <Explanation item={item} />}
              <ol className="flex flex-col gap-6">
                {questions.map((q, k) => (
                  <Exercise
                    key={k}
                    q={q}
                    label={LETTERS[k] ?? String(k + 1)}
                    passageAbove={k > 0 && passageOf(q) !== null && passageOf(q) === passageOf(questions[k - 1])}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>

        {includeAnswers && (
          <section className="mt-12 flex break-before-page flex-col gap-4 border-t border-border pt-6 print:mt-0 print:border-0 print:pt-0">
            <h2 className="text-base font-medium">Respuestas</h2>
            {blocks.map(({ item, skill, questions }, i) => (
              <div key={item.skill} className="flex break-inside-avoid flex-col gap-1 text-sm">
                <p className="font-medium">
                  {i + 1}. {skill?.title ?? "Juego no disponible"}
                </p>
                <p className="flex flex-wrap gap-x-5 gap-y-1">
                  {questions.map((q, k) => (
                    <span key={k} className={cn(q.mono && "whitespace-pre-wrap font-mono")}>
                      {LETTERS[k] ?? k + 1}) {answerText(q)}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </section>
        )}
      </article>
    </>
  );
}
