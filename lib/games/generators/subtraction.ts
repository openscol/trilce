import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES, uniqueOptions } from "./common";

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

export function takeawayPictureEquation(r: Rng): Question {
  const total = r.int(3, 10);
  const removed = r.int(1, total - 1);
  const answer = `${total} − ${removed}`;
  const distractors = [`${total} − ${removed + 1}`, `${total + 1} − ${removed}`, `${total} − ${Math.max(1, removed - 1)}`, `${total} + ${removed}`];
  return {
    kind: "choice",
    prompt: "¿Qué resta coincide con el dibujo?",
    visual: { kind: "takeaway", emoji: r.pick(COUNTABLES), total, removed },
    options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)),
    answer,
    explanation: `Había ${total} y se quitaron ${removed}: ${total} − ${removed}.`,
  };
}

export function subFacts(r: Rng, max: number): Question {
  const big = max > 10 && r.chance(0.75);
  const a = big ? r.int(11, max) : r.int(2, Math.min(max, 10));
  const b = r.int(0, a);
  return num(a - b, "Resuelve la resta.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, big ? "pasa-de-10" : "hasta-10");
}

export function subMissing(r: Rng, max: number): Question {
  const a = r.int(3, max);
  const c = r.int(0, a - 1);
  const b = a - c;
  return r.chance(0.5)
    ? num(b, "¿Qué número falta?", `${a} − ? = ${c}`, `${a} − ${b} = ${c}.`)
    : num(a, "¿Qué número falta?", `? − ${b} = ${c}`, `${a} − ${b} = ${c}.`);
}

export function relatedSub(r: Rng, max: number): Question {
  const a = r.int(4, max);
  const b = r.int(1, a - 1);
  const c = a - b;
  return num(
    b,
    "Usa la primera resta para resolver la segunda.",
    `${a} − ${b} = ${c}\n${a} − ${c} = ?`,
    `Si ${a} − ${b} = ${c}, entonces ${a} − ${c} = ${b}.`
  );
}

export function subTwoDigitOne(r: Rng, borrow: boolean): Question {
  for (;;) {
    const a = r.int(11, 99);
    const b = r.int(1, 9);
    const ones = a % 10;
    if (borrow ? b > ones : b <= ones) {
      return num(a - b, "Resuelve la resta.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, borrow ? "con-llevadas" : "sin-llevadas");
    }
  }
}

export function subTwoTwo(r: Rng, borrow: boolean): Question {
  for (;;) {
    const a = r.int(20, 99);
    const b = r.int(10, a - 1);
    const needs = a % 10 < b % 10;
    if (needs === borrow) {
      return num(a - b, "Resuelve la resta.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, borrow ? "con-llevadas" : "sin-llevadas");
    }
  }
}

export function subDoubles(r: Rng): Question {
  const a = r.int(1, 9);
  return num(a, "Resta los dobles.", `${a * 2} − ${a} = ?`, `${a} + ${a} = ${a * 2}, así que ${a * 2} − ${a} = ${a}.`);
}

export function subTens(r: Rng): Question {
  const a = r.int(2, 10) * 10;
  const b = r.int(1, a / 10) * 10;
  return num(a - b, "Resta los múltiplos de 10.", `${a} − ${b} = ?`, `${a / 10} decenas − ${b / 10} decenas = ${(a - b) / 10} decenas: ${a - b}.`);
}

export function subMultipleOfTen(r: Rng): Question {
  for (;;) {
    const n = r.int(21, 99);
    if (n % 10 === 0) continue;
    const m = r.int(1, Math.floor(n / 10)) * 10;
    return num(n - m, "Resta un múltiplo de 10.", `${n} − ${m} = ?`, `Solo cambian las decenas: ${n} − ${m} = ${n - m}.`);
  }
}

export function subK(r: Rng, k: number): Question {
  const n = r.int(k, Math.min(18, k + 10));
  return num(n - k, `Resta ${k}.`, `${n} − ${k} = ?`, `${n} − ${k} = ${n - k}.`);
}

// Restar un número de una cifra a uno de 10 a 18.
export function subOneDigitFromTeen(r: Rng): Question {
  const a = r.int(10, 18);
  const b = r.int(1, 9);
  return num(a - b, "Resuelve la resta.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, a - b < 10 ? "pasa-de-10" : "sin-pasar-de-10");
}

// Completar una resta de dos cifras.
export function subMissingTwoDigit(r: Rng): Question {
  const a = r.int(30, 99);
  const b = r.int(10, a - 10);
  const c = a - b;
  return r.chance(0.5)
    ? num(b, "¿Qué número falta?", `${a} − ? = ${c}`, `${a} − ${c} = ${b}.`)
    : num(a, "¿Qué número falta?", `? − ${b} = ${c}`, `${c} + ${b} = ${a}.`);
}

export function subHundreds(r: Rng): Question {
  const a = r.int(2, 10) * 100;
  const b = r.int(1, a / 100) * 100;
  return num(a - b, "Resta los múltiplos de 100.", `${a} − ${b} = ?`, `${a / 100} centenas − ${b / 100} centenas = ${(a - b) / 100} centenas: ${a - b}.`);
}

export function subThreeDigit(r: Rng): Question {
  const a = r.int(200, 999);
  const b = r.chance(0.5) ? r.int(10, 99) : r.int(100, a - 1);
  const borrow = a % 10 < b % 10 || Math.floor(a / 10) % 10 < Math.floor(b / 10) % 10;
  return num(a - b, "Resuelve la resta.", `${a} − ${b} = ?`, `Restamos unidades, decenas y centenas: ${a} − ${b} = ${a - b}.`, borrow ? "con-llevadas" : "sin-llevadas");
}
