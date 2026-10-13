"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatClock, formatDuration, formatLima, type ExamState, type TakingQuestion } from "@/lib/exams/online";
import { formatScore } from "@/lib/exams/shared";
import { answerQuestion, finishExam, loadExamState, startExam } from "../../online-actions";
import { Countdown } from "../../countdown";

type InProgress = Extract<ExamState, { status: "in_progress" }>;

// El examen visto por el alumno. El reloj y las respuestas viven en el
// servidor: esta pantalla solo muestra el tiempo que queda y envía cada
// respuesta al marcarla, así que recargar o perder la conexión no la borra.
export function TakeExam({ initial }: { initial: ExamState }) {
  const [state, setState] = useState(initial);
  // Diferencia entre el reloj del servidor y el de este equipo.
  const [offset, setOffset] = useState(() => Date.parse(initial.server_now) - Date.now());
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function apply(result: { state: ExamState } | { error: string }) {
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    setOffset(Date.parse(result.state.server_now) - Date.now());
    setState(result.state);
  }

  if (state.status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Examen entregado</p>
        <h1 className="text-lg font-medium">{state.title}</h1>
        <div className="flex items-end gap-2">
          <span className="font-mono text-5xl">{formatScore(state.score)}</span>
          <span className="pb-1 text-sm text-muted-foreground">/ {formatScore(state.max_score)}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {state.correct_count ?? "—"} de {state.total} respuestas correctas
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {state.published ? "Ya puedes revisar las preguntas y las respuestas correctas desde la lista de exámenes." : "Podrás ver las preguntas y las respuestas correctas cuando el colegio las libere."}
        </p>
        <Button variant="outline" nativeButton={false} render={<Link href="/examenes" />}>
          Volver a Exámenes
        </Button>
      </div>
    );
  }

  if (state.status === "not_started") {
    const limit = state.time_limit_seconds ?? 0;
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <div>
          <h1 className="text-lg font-medium">{state.title}</h1>
          {state.subject && <p className="text-sm text-muted-foreground">{state.subject}</p>}
        </div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          <li>
            {state.total} preguntas. Nota sobre {formatScore(state.max_score)}.
          </li>
          {state.time_mode === "total" ? (
            <li>Tienes {formatDuration(limit)} para todo el examen. Puedes avanzar, volver y cambiar tus respuestas mientras quede tiempo.</li>
          ) : (
            <li>Tienes {formatDuration(limit)} para cada pregunta. Al pasar a la siguiente (o si se acaba el tiempo) ya no puedes volver.</li>
          )}
          <li>El tiempo empieza cuando presionas «Empezar examen» y sigue corriendo aunque cierres la página.</li>
          <li>Solo tienes un intento. Tus respuestas se guardan solas al marcarlas.</li>
          {state.closes_at && <li>El examen se cierra para todos el {formatLima(state.closes_at)}.</li>}
        </ul>
        {!state.open &&
          (state.opens_at && Date.parse(state.opens_at) > Date.parse(state.server_now) ? (
            <p className="text-sm text-muted-foreground">
              El examen abre el {formatLima(state.opens_at)}. Empieza en{" "}
              {/* Al cumplirse la hora se vuelve a consultar y el botón se habilita solo. */}
              <Countdown key={state.server_now} target={state.opens_at} serverNow={state.server_now} onDone={() => loadExamState(state.exam_id).then(apply)} className="font-mono text-base text-foreground" />
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">El examen no está abierto en este momento.</p>
          ))}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button className="w-fit" disabled={pending || !state.open} onClick={() => start(async () => apply(await startExam(state.exam_id)))}>
          {pending ? "Empezando..." : "Empezar examen"}
        </Button>
      </div>
    );
  }

  return state.time_mode === "total" ? (
    <TotalExam key={state.exam_id} state={state} offset={offset} error={error} setError={setError} apply={apply} />
  ) : (
    // Cada pregunta es una pantalla nueva: se reinicia lo marcado al cambiar de pregunta.
    <PerQuestionExam key={state.position} state={state} offset={offset} error={error} setError={setError} apply={apply} />
  );
}

type ExamProps = {
  state: InProgress;
  offset: number;
  error: string | null;
  setError: (error: string | null) => void;
  apply: (result: { state: ExamState } | { error: string }) => void;
};

// Segundos que faltan para la hora límite, según el reloj del servidor.
function useRemaining(deadline: string, offset: number) {
  const compute = () => (Date.parse(deadline) - (Date.now() + offset)) / 1000;
  const [remaining, setRemaining] = useState(compute);
  useEffect(() => {
    const id = window.setInterval(() => setRemaining(compute()), 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline, offset]);
  return remaining;
}

function Clock({ remaining, label }: { remaining: number; label: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-mono text-lg", remaining <= 30 && "text-destructive")} role="timer" aria-label={label}>
      <ClockIcon className="size-4" />
      {formatClock(remaining)}
    </span>
  );
}

function QuestionCard({ question, selected, onSelect, disabled }: { question: TakingQuestion; selected: string | null; onSelect: (key: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
      <p className="whitespace-pre-wrap">{question.title}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {question.image_url && <img src={question.image_url} alt="Imagen de la pregunta" className="max-h-80 w-fit max-w-full rounded-lg border border-border" />}
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => (
          <button
            key={option.key}
            type="button"
            disabled={disabled}
            aria-pressed={selected === option.key}
            onClick={() => onSelect(option.key)}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
              selected === option.key ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
            )}
          >
            {/* La letra es la posición en pantalla: con las alternativas mezcladas no coincide con la original. */}
            <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs", selected === option.key ? "border-primary" : "border-border")}>{"ABCDEFGH"[i]}</span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// Tiempo general: un reloj para todo el examen; se puede ir y volver entre preguntas.
function TotalExam({ state, offset, error, setError, apply }: ExamProps) {
  const remaining = useRemaining(state.deadline, offset);
  const [answers, setAnswers] = useState<Record<number, string | null>>(() => Object.fromEntries(state.questions.map((q) => [q.number, q.answer])));
  const [index, setIndex] = useState(0);
  const [pending, start] = useTransition();
  const closing = useRef(false);

  const question = state.questions[index];
  const answered = state.questions.filter((q) => answers[q.number]).length;

  // Se acabó el tiempo: el servidor cierra el examen con lo guardado.
  useEffect(() => {
    if (remaining > 0 || closing.current) return;
    closing.current = true;
    start(async () => apply(await finishExam(state.exam_id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  function select(key: string) {
    // Tocar la alternativa ya marcada la desmarca.
    const value = answers[question.number] === key ? null : key;
    const previous = answers[question.number] ?? null;
    setAnswers((a) => ({ ...a, [question.number]: value }));
    setError(null);
    answerQuestion(state.exam_id, question.number, value).then((result) => {
      if ("error" in result) {
        setAnswers((a) => ({ ...a, [question.number]: previous }));
        setError(`${result.error} Vuelve a marcar tu respuesta.`);
      } else if (result.state.status !== "in_progress") {
        apply(result);
      }
    });
  }

  function finish() {
    const blank = state.total - answered;
    if (!window.confirm(blank ? `Te ${blank === 1 ? "falta 1 pregunta" : `faltan ${blank} preguntas`} por responder. ¿Entregar el examen de todos modos? Ya no podrás cambiar nada.` : "¿Entregar el examen? Ya no podrás cambiar tus respuestas.")) return;
    closing.current = true;
    start(async () => {
      const result = await finishExam(state.exam_id);
      if ("error" in result) closing.current = false;
      apply(result);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background py-3">
        <div className="flex flex-col">
          <span className="font-medium">{state.title}</span>
          <span className="text-xs text-muted-foreground">
            Pregunta {index + 1} de {state.total} · {answered} respondidas
          </span>
        </div>
        <Clock remaining={remaining} label="Tiempo que queda del examen" />
      </div>

      <QuestionCard question={question} selected={answers[question.number] ?? null} onSelect={select} disabled={pending || remaining <= 0} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Anterior
        </Button>
        {index < state.questions.length - 1 ? (
          <Button onClick={() => setIndex(index + 1)}>Siguiente</Button>
        ) : (
          <Button disabled={pending} onClick={finish}>
            {pending ? "Entregando..." : "Entregar examen"}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
        <span className="text-xs text-muted-foreground">Ir a una pregunta</span>
        <div className="flex flex-wrap gap-1">
          {state.questions.map((q, i) => (
            <button
              key={q.number}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Pregunta ${i + 1}${answers[q.number] ? ", respondida" : ", sin responder"}`}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border font-mono text-xs",
                answers[q.number] ? "border-primary bg-primary/10" : "border-border",
                i === index && "ring-2 ring-ring"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {index < state.questions.length - 1 && (
          <Button variant="ghost" size="sm" className="w-fit" disabled={pending} onClick={finish}>
            Entregar examen
          </Button>
        )}
      </div>
    </div>
  );
}

// Tiempo por pregunta: se ve una sola pregunta con su reloj y no se puede volver.
function PerQuestionExam({ state, offset, error, setError, apply }: ExamProps) {
  const remaining = useRemaining(state.deadline, offset);
  const question = state.questions[0];
  const [selected, setSelected] = useState<string | null>(question?.answer ?? null);
  const [pending, start] = useTransition();
  const moving = useRef(false);
  const last = state.position >= state.total;

  // Se acabó el tiempo de esta pregunta: el servidor ya pasó a la siguiente (o cerró el examen).
  useEffect(() => {
    // Medio segundo de margen: el reloj de este equipo puede ir apenas adelantado al del servidor.
    if (remaining > -0.5 || moving.current) return;
    moving.current = true;
    start(async () => {
      const result = await loadExamState(state.exam_id);
      // Si el servidor aún no cambió de pregunta, se vuelve a consultar en el siguiente tic.
      moving.current = false;
      apply(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  if (!question) return null;

  function select(key: string) {
    const value = selected === key ? null : key;
    setSelected(value);
    setError(null);
    // Se guarda de inmediato para que cuente aunque se acabe el tiempo antes de presionar «Siguiente».
    answerQuestion(state.exam_id, question.number, value).then((result) => {
      if ("error" in result) setError(`${result.error} Vuelve a marcar tu respuesta.`);
      else if (result.state.status !== "in_progress") apply(result);
    });
  }

  function next() {
    if (!selected && !window.confirm("No marcaste ninguna alternativa. ¿Pasar a la siguiente pregunta? No podrás volver.")) return;
    moving.current = true;
    start(async () => {
      const result = await answerQuestion(state.exam_id, question.number, selected, true);
      if ("error" in result) moving.current = false;
      apply(result);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background py-3">
        <div className="flex flex-col">
          <span className="font-medium">{state.title}</span>
          <span className="text-xs text-muted-foreground">
            Pregunta {state.position} de {state.total}
          </span>
        </div>
        <Clock remaining={remaining} label="Tiempo que queda para esta pregunta" />
      </div>

      <QuestionCard question={question} selected={selected} onSelect={select} disabled={pending || remaining <= 0} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">No podrás volver a esta pregunta.</span>
        <Button disabled={pending} onClick={next}>
          {pending ? "Guardando..." : last ? "Terminar examen" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
}
