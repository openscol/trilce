import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES, uniqueOptions } from "./common";

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

// Grupos iguales → multiplicación.
export function multEqualGroups(r: Rng): Question {
  const groups = r.int(2, 5);
  const each = r.int(2, 5);
  const visual = { kind: "equalGroups" as const, emoji: r.pick(COUNTABLES), groups, each };
  if (r.chance(0.5)) {
    return {
      kind: "number",
      prompt: `Hay ${groups} grupos de ${each}. ¿Cuántos hay en total?`,
      visual,
      answer: groups * each,
      explanation: `${groups} grupos de ${each}: ${groups} × ${each} = ${groups * each}.`,
      tag: "total",
    };
  }
  const answer = `${groups} × ${each}`;
  return {
    kind: "choice",
    prompt: "¿Qué multiplicación muestra el dibujo?",
    visual,
    options: uniqueOptions(r, answer, [`${groups} + ${each}`, `${groups} × ${each + 1}`, `${groups + 1} × ${each}`, `${Math.max(1, groups - 1)} × ${each}`]),
    answer,
    explanation: `Hay ${groups} grupos y en cada uno hay ${each}: ${answer}.`,
    tag: "expresion",
  };
}

// Matrices (filas × columnas).
export function multArrays(r: Rng): Question {
  const rows = r.int(2, 5);
  const cols = r.int(2, 6);
  const visual = { kind: "array" as const, emoji: r.pick(COUNTABLES), rows, cols };
  if (r.chance(0.5)) {
    return {
      kind: "number",
      prompt: `Hay ${rows} filas de ${cols}. ¿Cuántos hay en total?`,
      visual,
      answer: rows * cols,
      explanation: `${rows} × ${cols} = ${rows * cols}.`,
      tag: "total",
    };
  }
  const answer = `${rows} × ${cols}`;
  const swapped = `${cols} × ${rows}`;
  return {
    kind: "choice",
    prompt: `Hay ${rows} filas. ¿Qué multiplicación muestra la matriz?`,
    visual,
    options: uniqueOptions(r, answer, [`${rows} + ${cols}`, `${rows} × ${cols + 1}`, `${rows + 1} × ${cols}`, `${rows} × ${Math.max(1, cols - 1)}`].filter((d) => d !== swapped)),
    answer,
    explanation: `${rows} filas de ${cols}: ${answer} = ${rows * cols}.`,
    tag: "expresion",
  };
}

// Tablas. Un factor sale de `factors`, el otro va de 0 a `otherMax`.
export function multFacts(r: Rng, factors: number[], otherMax = 10): Question {
  const a = r.pick(factors);
  const b = r.int(0, otherMax);
  const [x, y] = r.chance(0.5) ? [a, b] : [b, a];
  return num(a * b, "Resuelve la multiplicación.", `${x} × ${y} = ?`, `${x} × ${y} = ${a * b}.`, `tabla-${a}`);
}
