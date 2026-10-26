import { getSkill } from "./catalog";
import { correctAnswerString } from "./check";
import { makeRng, newSeed } from "./rng";
import type { Question, Skill } from "./types";

// Fichas de trabajo (tabla worksheets, migración A03): cada ítem es un juego y
// las semillas de sus ejercicios. Con las mismas semillas el generador da
// siempre las mismas preguntas, así la ficha y su PDF no cambian.

export type WorksheetItem = { skill: string; count: number; seeds: number[] };
export type WorksheetItemInput = { skill: string; count: number };

export const MIN_EXERCISES = 1;
export const MAX_EXERCISES = 20;
export const DEFAULT_EXERCISES = 4;

export const CATEGORY_LABEL: Record<string, string> = { matematicas: "Matemáticas", comunicacion: "Comunicación" };

// Lee el jsonb de la base sin confiar en su forma.
export function parseItems(json: unknown): WorksheetItem[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((x) => {
    if (!x || typeof x !== "object") return [];
    const { skill, count, seeds } = x as Record<string, unknown>;
    if (typeof skill !== "string" || typeof count !== "number" || !Array.isArray(seeds)) return [];
    return [{ skill, count, seeds: seeds.filter((n): n is number => typeof n === "number") }];
  });
}

// Lo que el alumno percibe como «la misma pregunta».
const questionKey = (q: Question) => JSON.stringify([q.prompt, q.visual ?? null, correctAnswerString(q)]);

// Preguntas que solo se responden escuchando el audio (🔊). La ficha se hace
// en casa, sin nadie que lea en voz alta: esas preguntas no van en papel.
export function needsListening(q: Question): boolean {
  return !!q.speak && /🔊|escuch/i.test(q.prompt);
}

const nextSeed = (seed: number) => (seed * 2654435761 + 1) >>> 0;

// La pregunta impresa para una semilla. Si la semilla da una pregunta de audio
// (fichas guardadas antes de esta regla), se usa la siguiente que no lo sea.
export function paperQuestion(skill: Pick<Skill, "generate">, seed: number): Question {
  let q = skill.generate(makeRng(seed));
  for (let i = 0; i < 50 && needsListening(q); i++) {
    seed = nextSeed(seed);
    q = skill.generate(makeRng(seed));
  }
  return q;
}

// Juegos que solo tienen preguntas de audio: no se ofrecen para fichas.
export function printable(skill: Pick<Skill, "generate">): boolean {
  for (let seed = 1; seed <= 40; seed++) if (!needsListening(skill.generate(makeRng(seed)))) return true;
  return false;
}

// Semillas de `count` ejercicios distintos entre sí (si el juego tiene tantas
// variantes) y sin audio. `keep`: semillas ya elegidas que se conservan (al editar).
export function pickSeeds(skillUid: string, count: number, keep: number[] = []): number[] {
  const skill = getSkill(skillUid);
  if (!skill) return [];
  const seeds = keep.filter((s) => !needsListening(skill.generate(makeRng(s)))).slice(0, count);
  const seen = new Set(seeds.map((s) => questionKey(skill.generate(makeRng(s)))));
  for (let tries = 0; seeds.length < count && tries < 400; tries++) {
    const seed = newSeed();
    const q = skill.generate(makeRng(seed));
    if (needsListening(q)) continue;
    const key = questionKey(q);
    if (!seen.has(key) || tries > 300) {
      seen.add(key);
      seeds.push(seed);
    }
  }
  return seeds;
}

// Semilla del ejemplo resuelto: distinta de las de los ejercicios.
export const exampleSeed = (item: WorksheetItem) => ((item.seeds[0] ?? 1) * 2654435761 + 97) >>> 0;

// La respuesta de una pregunta, escrita para leerla (ejemplos y clave de respuestas).
export function answerText(q: Question): string {
  switch (q.kind) {
    case "choice":
      return q.answer;
    case "multi":
      return q.answers.join(", ");
    case "sequence":
      return q.answer.join(q.mono ? "\n" : " → ");
    case "shade":
      return `pintar ${q.answer} de ${q.parts} partes`;
    default:
      return String(q.answer);
  }
}

// «Patrones que se repiten (4 ejercicios) · Problemas de igualar (4 ejercicios)».
export function itemsSummary(items: WorksheetItem[]) {
  return items.map((it) => ({ title: getSkill(it.skill)?.title ?? "Juego no disponible", count: it.count }));
}
