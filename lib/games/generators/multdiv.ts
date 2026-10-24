import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES, uniqueOptions } from "./common";
import { fmt } from "./bignumbers";

// Multiplicación y división de 3.° en adelante: factor que falta, ceros,
// varias cifras, propiedades, relación entre × y ÷, y divisiones largas.

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

// Hallar el factor que falta. Un factor sale de `factors`.
export function multMissing(r: Rng, factors: number[], otherMax = 10): Question {
  const a = r.pick(factors.filter((f) => f > 0));
  const b = r.int(1, otherMax);
  const text = r.chance(0.5) ? `${a} × ? = ${a * b}` : `? × ${a} = ${a * b}`;
  return num(b, "¿Qué número falta?", text, `${a} × ${b} = ${a * b}, así que falta el ${b}.`, `tabla-${a}`);
}

// Una cifra por un múltiplo de diez.
export function multByTens(r: Rng): Question {
  const a = r.int(2, 9);
  const m = r.int(1, 9);
  const [x, y] = r.chance(0.5) ? [a, m * 10] : [m * 10, a];
  return num(a * m * 10, "Resuelve la multiplicación.", `${x} × ${y} = ?`, `${a} × ${m} = ${a * m}; agregamos un cero: ${a * m * 10}.`);
}

// Factores que terminan en ceros.
export function multZeros(r: Rng): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const i = r.int(0, 2);
  const j = r.int(i === 0 ? 1 : 0, 3 - i);
  const x = a * 10 ** i;
  const y = b * 10 ** j;
  return num(x * y, "Resuelve la multiplicación.", `${fmt(x)} × ${fmt(y)} = ?`, `${a} × ${b} = ${a * b}; luego agregamos ${i + j} ${i + j === 1 ? "cero" : "ceros"}: ${fmt(x * y)}.`, `${i + j}-ceros`);
}

// Una cifra por un número de `digits` cifras.
export function multDigits(r: Rng, digits: 2 | 3): Question {
  const a = r.int(2, 9);
  const b = r.int(10 ** (digits - 1) + 1, 10 ** digits - 1);
  const parts = [...String(b)].map((d, i) => Number(d) * 10 ** (digits - 1 - i)).filter(Boolean);
  return num(a * b, "Resuelve la multiplicación.", `${b} × ${a} = ?`, `Multiplicamos por partes: ${parts.map((p) => `${p} × ${a} = ${p * a}`).join("; ")}. Total: ${a * b}.`);
}

// Conmutativa, asociativa, neutro, cero y distributiva.
export function multProperties(r: Rng): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const form = r.int(0, 5);
  if (form === 0) return num(a, "¿Qué número falta?", `${a} × ${b} = ${b} × ?`, `Cambiar el orden de los factores no cambia el producto (propiedad conmutativa).`, "conmutativa");
  if (form === 1) return num(b, "¿Qué número falta?", `(${a} × ${b}) × ${c} = ${a} × (? × ${c})`, `Agrupar los factores de otra forma no cambia el producto (propiedad asociativa).`, "asociativa");
  if (form === 2) return num(a, "¿Qué número falta?", `${a} × 1 = ?`, `Multiplicar por 1 no cambia el número (elemento neutro).`, "neutro");
  if (form === 3) return num(0, "¿Qué número falta?", `${a} × 0 = ?`, `Cualquier número multiplicado por 0 da 0.`, "cero");
  if (form === 4) return num(c, "¿Qué número falta?", `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ?`, `El factor se reparte entre los sumandos (propiedad distributiva).`, "distributiva");
  const examples: [string, string][] = [
    [`${a} × ${b} = ${b} × ${a}`, "Conmutativa"],
    [`(${a} × ${b}) × ${c} = ${a} × (${b} × ${c})`, "Asociativa"],
    [`${a} × 1 = ${a}`, "Elemento neutro"],
    [`${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`, "Distributiva"],
  ];
  const [text, name] = r.pick(examples);
  return {
    kind: "choice",
    prompt: "¿Qué propiedad de la multiplicación muestra esta igualdad?",
    visual: { kind: "text", text },
    options: r.shuffle(examples.map(([, n]) => n)),
    answer: name,
    explanation: `Es la propiedad ${name.toLowerCase()}.`,
    tag: name.toLowerCase(),
  };
}

// Repartir en grupos iguales.
export function divGroups(r: Rng): Question {
  const groups = r.int(2, 5);
  const each = r.int(2, 5);
  const total = groups * each;
  const visual = { kind: "equalGroups" as const, emoji: r.pick(COUNTABLES), groups, each };
  return r.chance(0.5)
    ? { kind: "number", prompt: `Se reparten ${total} en ${groups} grupos iguales. ¿Cuántos hay en cada grupo?`, visual, answer: each, explanation: `${total} ÷ ${groups} = ${each}.`, tag: "repartir" }
    : { kind: "number", prompt: `Hay ${total} en grupos de ${each}. ¿Cuántos grupos hay?`, visual, answer: groups, explanation: `${total} ÷ ${each} = ${groups}.`, tag: "agrupar" };
}

// Relacionar × y ÷ con grupos iguales o matrices.
export function relateMultDivPicture(r: Rng, kind: "groups" | "array"): Question {
  const a = r.int(2, 5);
  let b = r.int(2, 6);
  if (b === a) b = a + 1;
  const total = a * b;
  const emoji = r.pick(COUNTABLES);
  const visual = kind === "groups" ? { kind: "equalGroups" as const, emoji, groups: a, each: b } : { kind: "array" as const, emoji, rows: a, cols: b };
  const noun = kind === "groups" ? ["grupos", "en cada grupo"] : ["filas", "en cada fila"];
  if (r.chance(0.5)) {
    const answer = `${total} ÷ ${a} = ${b}`;
    return {
      kind: "choice",
      prompt: `Hay ${a} ${noun[0]}. ¿Qué división muestra cuántos hay ${noun[1]}?`,
      visual,
      options: uniqueOptions(r, answer, [`${total} ÷ ${b} = ${a}`, `${total} ÷ ${a} = ${b + 1}`, `${a + b} ÷ ${a} = ${b}`, `${total + a} ÷ ${a} = ${b}`]),
      answer,
      explanation: `${a} × ${b} = ${total}, así que ${total} ÷ ${a} = ${b}.`,
      tag: "elegir-division",
    };
  }
  return {
    kind: "number",
    prompt: `${a} × ${b} = ${total}. Entonces, ¿cuánto es ${total} ÷ ${a}?`,
    visual,
    answer: b,
    explanation: `La división deshace la multiplicación: ${total} ÷ ${a} = ${b}.`,
    tag: "completar",
  };
}

// Usar una multiplicación para resolver una división (y al revés).
export function relateMultDiv(r: Rng): Question {
  const a = r.int(2, 10);
  const b = r.int(2, 10);
  const p = a * b;
  return r.chance(0.5)
    ? num(b, "Usa la primera operación para resolver la segunda.", `${a} × ${b} = ${p}\n${p} ÷ ${a} = ?`, `Si ${a} × ${b} = ${p}, entonces ${p} ÷ ${a} = ${b}.`, "mult-a-div")
    : num(p, "Usa la primera operación para resolver la segunda.", `${p} ÷ ${a} = ${b}\n${a} × ${b} = ?`, `Si ${p} ÷ ${a} = ${b}, entonces ${a} × ${b} = ${p}.`, "div-a-mult");
}

// Completar una división. El divisor sale de `divisors`.
export function divMissing(r: Rng, divisors: number[]): Question {
  const d = r.pick(divisors);
  const q = r.int(1, 10);
  const form = d === q ? 1 : r.int(0, 1);
  return form === 0
    ? num(d, "¿Qué número falta?", `${d * q} ÷ ? = ${q}`, `${d * q} ÷ ${d} = ${q}, porque ${d} × ${q} = ${d * q}.`, `entre-${d}`)
    : num(d * q, "¿Qué número falta?", `? ÷ ${d} = ${q}`, `${d} × ${q} = ${d * q}, así que ${d * q} ÷ ${d} = ${q}.`, `entre-${d}`);
}

// Divisiones exactas con números más grandes.
export type LongDivision = "twoDigitDivisor" | "largeByTwoDigit" | "threeDigitDivisor" | "largeByOneDigit";

export function divLong(r: Rng, kind: LongDivision): Question {
  const [d, q] =
    kind === "twoDigitDivisor"
      ? [r.int(11, 25), r.int(2, 9)]
      : kind === "largeByTwoDigit"
        ? [r.int(11, 40), r.int(10, 99)]
        : kind === "threeDigitDivisor"
          ? [r.int(1, 5) * 100 + r.pick([0, 0, 10, 20, 25, 50]), r.int(2, 12)]
          : [r.int(2, 9), r.int(101, 999)];
  return num(q, "Resuelve la división.", `${fmt(d * q)} ÷ ${d} = ?`, `${fmt(d * q)} ÷ ${d} = ${q}, porque ${d} × ${q} = ${fmt(d * q)}.`);
}

// Operaciones básicas de las cuatro operaciones.
export function mixedFourFacts(r: Rng): Question {
  const op = r.pick(["+", "−", "×", "÷"]);
  if (op === "+") {
    const a = r.int(2, 18);
    const b = r.int(1, 20 - a);
    return num(a + b, "Resuelve.", `${a} + ${b} = ?`, `${a} + ${b} = ${a + b}.`, "suma");
  }
  if (op === "−") {
    const a = r.int(4, 20);
    const b = r.int(1, a);
    return num(a - b, "Resuelve.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, "resta");
  }
  const a = r.int(2, 10);
  const b = r.int(1, 10);
  return op === "×"
    ? num(a * b, "Resuelve.", `${a} × ${b} = ?`, `${a} × ${b} = ${a * b}.`, "multiplicacion")
    : num(b, "Resuelve.", `${a * b} ÷ ${a} = ?`, `${a * b} ÷ ${a} = ${b}.`, "division");
}

// Las cuatro operaciones con números más grandes.
export function mixedFour(r: Rng): Question {
  const op = r.pick(["+", "−", "×", "÷"]);
  if (op === "+") {
    const a = r.int(100, 899);
    const b = r.int(10, 999 - a);
    return num(a + b, "Resuelve.", `${a} + ${b} = ?`, `${a} + ${b} = ${a + b}.`, "suma");
  }
  if (op === "−") {
    const a = r.int(200, 999);
    const b = r.int(10, a - 1);
    return num(a - b, "Resuelve.", `${a} − ${b} = ?`, `${a} − ${b} = ${a - b}.`, "resta");
  }
  if (op === "×") {
    const a = r.int(2, 9);
    const b = r.int(11, 99);
    return num(a * b, "Resuelve.", `${b} × ${a} = ?`, `${b} × ${a} = ${a * b}.`, "multiplicacion");
  }
  const d = r.int(2, 9);
  const q = r.int(11, 99);
  return num(q, "Resuelve.", `${d * q} ÷ ${d} = ?`, `${d * q} ÷ ${d} = ${q}.`, "division");
}
