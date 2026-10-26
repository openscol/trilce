import type { Rng } from "../rng";
import type { Question } from "../types";

// Agrega los pasos de la solución (para «Aprender con un ejemplo»).
export const solved = (q: Question, solution: string[]): Question => ({ ...q, solution });

// Pasos de una suma de dos números de hasta dos cifras, por columnas.
export function columnAddSteps(a: number, b: number): string[] {
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const units = ua + ub;
  const carry = units >= 10 ? 1 : 0;
  const tens = ta + tb + carry;
  return [
    "Escribe un número debajo del otro: unidades con unidades y decenas con decenas.",
    carry
      ? `Suma las unidades: ${ua} + ${ub} = ${units}. Como pasa de 9, escribe ${units % 10} y canjea 10 unidades por 1 decena, que llevas a las decenas.`
      : `Suma las unidades: ${ua} + ${ub} = ${units}.`,
    carry ? `Suma las decenas, sin olvidar la que llevas: ${ta} + ${tb} + 1 = ${tens}.` : `Suma las decenas: ${ta} + ${tb} = ${tens}.`,
    `Junta decenas y unidades: ${a} + ${b} = ${a + b}.`,
  ];
}

// Pasos de una resta de números de hasta dos cifras, por columnas.
export function columnSubSteps(a: number, b: number): string[] {
  const [ta, ua, tb, ub] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const borrow = ua < ub;
  return [
    "Escribe el número menor debajo del mayor: unidades con unidades y decenas con decenas.",
    borrow
      ? `En las unidades, ${ua} es menor que ${ub} y no alcanza. Canjea 1 decena por 10 unidades: ahora tienes ${ta - 1} decenas y ${ua + 10} unidades. Resta: ${ua + 10} − ${ub} = ${ua + 10 - ub}.`
      : `Resta las unidades: ${ua} − ${ub} = ${ua - ub}.`,
    borrow ? `Resta las decenas que quedan: ${ta - 1} − ${tb} = ${ta - 1 - tb}.` : `Resta las decenas: ${ta} − ${tb} = ${ta - tb}.`,
    `Junta decenas y unidades: ${a} − ${b} = ${a - b}.`,
  ];
}

export const COUNTABLES = ["🍎", "⭐", "🐟", "🚗", "🎈", "🐥", "🌸", "⚽", "🍪", "🦋"];

export function numberOptions(
  r: Rng,
  answer: number,
  min: number,
  max: number,
  count = 4,
  step = 1
) {
  const options = new Set<number>([answer]);
  let guard = 0;
  while (options.size < count && guard++ < 80) {
    const candidate = answer + r.int(-3, 3) * step;
    if (candidate >= min && candidate <= max) options.add(candidate);
  }
  return r.shuffle([...options]).map(String);
}

export function uniqueOptions(r: Rng, answer: string, distractors: string[], count = 4) {
  const set = new Set<string>([answer]);
  for (const d of r.shuffle(distractors)) {
    if (set.size >= count) break;
    set.add(d);
  }
  return r.shuffle([...set]);
}

