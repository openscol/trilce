import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES } from "./common";

// Repartir una matriz en filas iguales.
export function divArrays(r: Rng): Question {
  const rows = r.int(2, 5);
  const cols = r.int(2, 6);
  const total = rows * cols;
  return {
    kind: "number",
    prompt: `Hay ${total} repartidos en ${rows} filas iguales. ¿Cuántos hay en cada fila?`,
    visual: { kind: "array", emoji: r.pick(COUNTABLES), rows, cols },
    answer: cols,
    explanation: `${total} ÷ ${rows} = ${cols}, porque ${rows} × ${cols} = ${total}.`,
  };
}

// El divisor sale de `divisors`; el cociente va de 1 a 10.
export function divFacts(r: Rng, divisors: number[]): Question {
  const d = r.pick(divisors);
  const q = r.int(1, 10);
  return {
    kind: "number",
    prompt: "Resuelve la división.",
    visual: { kind: "text", text: `${d * q} ÷ ${d} = ?` },
    answer: q,
    explanation: `${d * q} ÷ ${d} = ${q}, porque ${d} × ${q} = ${d * q}.`,
    tag: `entre-${d}`,
  };
}
