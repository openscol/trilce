"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircle2Icon, Volume2Icon, XCircleIcon } from "lucide-react";
import { FractionCells, VisualView } from "@/components/games/visuals";
import { ScratchBlocks } from "@/components/games/scratch-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSkill } from "@/lib/games/catalog";
import { useFreeMode } from "@/components/games/free-mode";
import { checkAnswer, correctAnswerString, nextScore } from "@/lib/games/check";
import { makeRng, newSeed } from "@/lib/games/rng";
import type { Question } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { recordAttempt } from "../../../actions";
import { StudentPanel } from "./student-panel";

export type Roster = {
  groups: { id: string; label: string }[];
  students: { id: string; groupId: string; name: string; code: string }[];
};

type Status = "answering" | "correct" | "wrong";

// Lee en voz alta con la voz del navegador (sin servicios externos). Prefiere
// una voz en castellano; si el navegador no tiene ninguna, usa la por defecto.
function speakText(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE";
  utterance.rate = 0.85;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("es"));
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

// Lo que el alumno percibe como "la misma pregunta": enunciado, dibujo y
// respuesta (sin importar el orden de las opciones).
function questionKey(q: Question) {
  return JSON.stringify([q.prompt, q.visual ?? null, correctAnswerString(q)]);
}

// Cuántas preguntas recientes se evitan repetir al pasar a la siguiente.
const RECENT = 12;

// Texto de una opción, o el bloque de Scratch dibujado si la pregunta es de bloques.
function OptionLabel({ text, blocks, mono }: { text: string; blocks?: boolean; mono?: boolean }) {
  if (blocks) return <ScratchBlocks code={text} scale={0.9} />;
  return mono ? <span className="whitespace-pre text-left font-mono text-sm">{text}</span> : <>{text}</>;
}

// Fichas largas (palabras, frases) no caben en casillas cuadradas.
function isLongTile(tile: string) {
  return [...tile].length > 2;
}

export function SkillPlayer({
  skillUid,
  skillId,
  title,
  sectionName,
  gradeLabel,
  backHref,
  sessionLength,
  initialSeed,
  isStudent,
  roster,
}: {
  skillUid: string;
  skillId: string;
  title: string;
  sectionName: string;
  gradeLabel: string;
  backHref: string;
  sessionLength?: number;
  initialSeed: number;
  isStudent: boolean;
  roster?: Roster;
}) {
  const [seed, setSeed] = useState(initialSeed);
  const skill = getSkill(skillUid);
  const question = useMemo(() => skill?.generate(makeRng(seed)), [skill, seed]);

  const [status, setStatus] = useState<Status>("answering");
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [seq, setSeq] = useState<string[]>([]);
  const [shadedCells, setShadedCells] = useState<number[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [player, setPlayer] = useState<{ id: string; name: string } | null>(null);
  // Partida con número fijo de preguntas (sessionLength): al terminar se
  // muestra el resumen en vez de la siguiente pregunta.
  const [finished, setFinished] = useState(false);
  const lastQuestion = !!sessionLength && answered >= sessionLength;

  // Modo sin puntaje (switch en /juegos): el personal juega sin elegir alumno,
  // sin puntaje y sin guardar. Nunca aplica a un alumno con su propia cuenta.
  const freeMode = useFreeMode() && !isStudent;
  // Modo un solo dispositivo: el docente elige al alumno; sin elegir no se juega.
  const teacherMode = roster !== undefined && !freeMode;
  const needsStudent = teacherMode && !player;
  const canSave = isStudent || (teacherMode && !!player);

  const sessionRef = useRef<string | null>(null);
  const recentRef = useRef<string[]>([]);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const locked = status !== "answering";
  const mastered = score >= 100;

  function submit(answer: string) {
    if (!question || locked || answer.trim() === "") return;
    const isCorrect = checkAnswer(question, answer);
    setChosen(answer);
    setStatus(isCorrect ? "correct" : "wrong");
    setScore((s) => nextScore(s, isCorrect));
    setAnswered((n) => n + 1);
    if (isCorrect) setCorrectCount((n) => n + 1);

    if (canSave) {
      const attemptSeed = seed;
      const studentId = player?.id;
      queueRef.current = queueRef.current.then(async () => {
        try {
          const res = await recordAttempt({ sessionId: sessionRef.current, skillId: skillUid, seed: attemptSeed, answer, studentId });
          if (res.ok) sessionRef.current = res.sessionId;
          else setSaveError(true);
        } catch {
          setSaveError(true);
        }
      });
    }
  }

  // Busca una semilla cuya pregunta no se haya mostrado hace poco. Si el juego
  // tiene pocas variantes y todas son recientes, usa la que salió hace más
  // tiempo: así se recorren todas antes de repetir.
  function nextSeed() {
    if (!skill || !question) return newSeed();
    recentRef.current = [...recentRef.current, questionKey(question)].slice(-RECENT);
    let best = newSeed();
    let bestAge = Infinity;
    for (let i = 0; i < 40; i++) {
      const candidate = newSeed();
      const age = recentRef.current.lastIndexOf(questionKey(skill.generate(makeRng(candidate))));
      if (age === -1) return candidate;
      if (age < bestAge) {
        best = candidate;
        bestAge = age;
      }
    }
    return best;
  }

  function next() {
    if (lastQuestion) {
      setFinished(true);
      return;
    }
    setSeed(nextSeed());
    setStatus("answering");
    setTyped("");
    setPicked([]);
    setSeq([]);
    setShadedCells([]);
    setChosen(null);
  }

  // Nueva partida: puntaje y contadores en cero, y una sesión nueva en la base.
  function playAgain() {
    sessionRef.current = null;
    setScore(0);
    setAnswered(0);
    setCorrectCount(0);
    setSaveError(false);
    setFinished(false);
    setSeed(nextSeed());
    setStatus("answering");
    setTyped("");
    setPicked([]);
    setSeq([]);
    setShadedCells([]);
    setChosen(null);
  }

  function pickStudent(id: string, name: string) {
    sessionRef.current = null;
    setPlayer({ id, name });
    setScore(0);
    setAnswered(0);
    setCorrectCount(0);
    setSaveError(false);
    next();
  }

  // El servidor encontró el juego pero el código del navegador es anterior
  // (p. ej. tras publicar juegos nuevos con la pestaña abierta).
  if (!question) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border p-6 text-center text-sm">
        <p>Este juego es nuevo y tu navegador tiene una versión anterior de la página.</p>
        <Button onClick={() => window.location.reload()}>Recargar</Button>
      </div>
    );
  }

  const correctString = correctAnswerString(question);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link href={backHref} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          {gradeLabel}
        </Link>
        <p className="text-xs text-muted-foreground">
          {skillId} · {sectionName}
        </p>
        <h1 className="text-lg font-medium">{title}</h1>
      </div>

      {freeMode ? (
        <p className="w-fit rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
          Modo práctica · sin puntaje, no se guardan respuestas
        </p>
      ) : (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Puntaje</span>
          <span className="font-medium tabular-nums">{score} / 100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          {sessionLength
            ? `Pregunta ${Math.min(answered + (locked ? 0 : 1), sessionLength)} de ${sessionLength} · ${correctCount} correctas`
            : `${answered} contestadas · ${correctCount} correctas`}
        </p>
        {!canSave && !teacherMode && (
          <p className="text-xs text-muted-foreground">Modo práctica: solo los alumnos guardan sus resultados.</p>
        )}
        {teacherMode && player && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border-brand px-3 py-2 text-sm">
            <span>
              Jugando: <span className="font-medium">{player.name}</span>
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => setPlayer(null)}>
              Cambiar alumno
            </Button>
          </div>
        )}
        {saveError && <p className="text-xs text-destructive">No se pudo guardar alguna respuesta.</p>}
      </div>
      )}

      {mastered && !freeMode && (
        <div className="rounded-2xl border border-border-brand p-4 text-sm">
          <span className="font-medium text-brand-green-text">¡Dominaste esta habilidad!</span> Puedes seguir practicando o
          elegir otro juego.
        </div>
      )}

      {needsStudent && roster && <StudentPanel roster={roster} onPick={pickStudent} />}

      {!needsStudent && finished && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border p-6 text-center">
          <p className="text-4xl">{correctCount >= (sessionLength ?? 0) * 0.8 ? "🏆" : correctCount >= (sessionLength ?? 0) * 0.5 ? "👏" : "💪"}</p>
          <p className="text-lg font-medium">¡Terminaste las {sessionLength} preguntas!</p>
          <p className="text-sm">
            <span className="text-2xl font-medium tabular-nums">{correctCount}</span> de {sessionLength} correctas
            {!freeMode && <> · puntaje {score} / 100</>}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={playAgain}>Jugar de nuevo</Button>
            <Button variant="outline" nativeButton={false} render={<Link href={backHref} />}>
              Elegir otro juego
            </Button>
          </div>
        </div>
      )}

      {!needsStudent && !finished && (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border p-6">
        <div className="flex items-start justify-center gap-2">
          <p className="whitespace-pre-line text-center text-base font-medium">{question.prompt}</p>
          {question.speak && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => speakText(question.speak!)}
              aria-label="Escuchar"
            >
              <Volume2Icon />
            </Button>
          )}
        </div>
        {question.visual && <VisualView visual={question.visual} />}

        {question.kind === "choice" && (
          <div className={cn("grid w-full gap-3", question.blocks || question.mono ? "max-w-2xl grid-cols-1 sm:grid-cols-2" : "max-w-md grid-cols-2")}>
            {question.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                disabled={locked}
                onClick={() => submit(option)}
                className={cn(
                  "h-auto min-h-12 whitespace-normal py-2 text-base",
                  locked && option === question.answer && "border-brand-green bg-brand-green/15",
                  locked && option === chosen && option !== question.answer && "border-destructive bg-destructive/10"
                )}
              >
                <OptionLabel text={option} blocks={question.blocks} mono={question.mono} />
              </Button>
            ))}
          </div>
        )}

        {question.kind === "number" && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit(typed);
            }}
          >
            <Input
              type="number"
              inputMode="numeric"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              disabled={locked}
              className="h-12 w-32 text-center text-base"
              autoFocus
            />
            <Button type="submit" size="lg" disabled={locked || typed === ""}>
              Comprobar
            </Button>
          </form>
        )}

        {question.kind === "text" && (
          <form
            className="flex w-full max-w-md flex-col items-center gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              submit(typed);
            }}
          >
            <Input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              disabled={locked}
              className="h-12 text-center text-base"
              autoFocus
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Escribe aquí"
            />
            <Button type="submit" size="lg" disabled={locked || typed.trim() === ""}>
              Comprobar
            </Button>
          </form>
        )}

        {question.kind === "multi" && (
          <div className="flex w-full max-w-md flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {question.options.map((option) => {
                const on = picked.includes(option);
                const isAnswer = question.answers.includes(option);
                return (
                  <Button
                    key={option}
                    type="button"
                    variant="outline"
                    disabled={locked}
                    onClick={() => setPicked((p) => (on ? p.filter((x) => x !== option) : [...p, option]))}
                    className={cn(
                      "h-auto min-h-12 min-w-16 whitespace-normal text-base",
                      on && !locked && "border-brand-green bg-brand-green/20",
                      locked && isAnswer && "border-brand-green bg-brand-green/15",
                      locked && on && !isAnswer && "border-destructive bg-destructive/10"
                    )}
                  >
                    <OptionLabel text={option} blocks={question.blocks} mono={question.mono} />
                  </Button>
                );
              })}
            </div>
            <Button size="lg" disabled={locked || picked.length === 0} onClick={() => submit(JSON.stringify(picked))}>
              Comprobar
            </Button>
          </div>
        )}

        {question.kind === "sequence" && (
          <div className="flex w-full max-w-xl flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: question.length }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-14 items-center justify-center rounded-lg border-2 border-dashed border-foreground",
                    "text-base", question.tiles.some(isLongTile) ? "min-w-24 px-2" : "size-12"
                  )}
                >
                  {seq[i] ? <OptionLabel text={seq[i]} blocks={question.blocks} mono={question.mono} /> : ""}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {question.tiles.map((tile, i) => {
                const used = !question.reuse && seq.includes(tile);
                return (
                  <Button
                    key={`${tile}-${i}`}
                    type="button"
                    variant="outline"
                    disabled={locked || used || seq.length >= question.length}
                    onClick={() => setSeq((s) => [...s, tile])}
                    className="h-auto min-h-12 min-w-12 whitespace-normal text-base"
                  >
                    <OptionLabel text={tile} blocks={question.blocks} mono={question.mono} />
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" disabled={locked || seq.length === 0} onClick={() => setSeq((s) => s.slice(0, -1))}>
                Borrar
              </Button>
              <Button size="lg" disabled={locked || seq.length < question.length} onClick={() => submit(JSON.stringify(seq))}>
                Comprobar
              </Button>
            </div>
          </div>
        )}

        {question.kind === "shade" && (
          <div className="flex flex-col items-center gap-4">
            <FractionCells
              parts={question.parts}
              shape={question.shape}
              shaded={(i) => shadedCells.includes(i)}
              onToggle={locked ? undefined : (i) => setShadedCells((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
            />
            <Button size="lg" disabled={locked || shadedCells.length === 0} onClick={() => submit(String(shadedCells.length))}>
              Comprobar
            </Button>
          </div>
        )}

        {locked && (
          <div className="flex w-full flex-col items-center gap-3">
            <p className={cn("flex items-center gap-2 text-sm font-medium", status === "correct" ? "text-brand-green-text" : "text-destructive")}>
              {status === "correct" ? <CheckCircle2Icon className="size-4" /> : <XCircleIcon className="size-4" />}
              {status === "correct" ? "¡Muy bien!" : "Casi. Inténtalo con la siguiente."}
            </p>
            {status === "wrong" && question.kind !== "choice" && question.kind !== "multi" && (
              <p className="text-sm">
                Respuesta correcta:{" "}
                {question.kind === "sequence" && question.blocks ? (
                  <span className="mt-2 flex flex-col items-center gap-1">
                    {(JSON.parse(correctString) as string[]).map((b, i) => (
                      <OptionLabel key={i} text={b} blocks />
                    ))}
                  </span>
                ) : (
                  <span className={cn("font-medium", question.mono && "whitespace-pre-wrap font-mono")}>
                    {question.kind === "sequence" ? (JSON.parse(correctString) as string[]).join(question.mono ? "\n" : " ") : correctString}
                  </span>
                )}
              </p>
            )}
            <p className="text-center text-sm text-muted-foreground">{question.explanation}</p>
            <Button onClick={next} autoFocus>
              {lastQuestion ? "Ver resultados" : "Siguiente"}
            </Button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
