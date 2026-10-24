import type { Rng } from "../rng";
import type { Question } from "../types";

// Números grandes (3.° en adelante): conteo a saltos, primos, ordenar,
// secuencias y sumas/restas de cuatro o más cifras. Los rangos son
// parámetros para reutilizarlos en grados superiores.

// 12345 → "12 345" (los de cuatro cifras van sin separar).
export function fmt(n: number) {
  return n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(n);
}

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

// Contar de tanto en tanto hasta `max`.
export function skipCountTo(r: Rng, max: number): Question {
  const step = r.pick([2, 5, 10, 20, 25, 50, 100]);
  const start = step * r.int(0, Math.floor((max - step * 5) / step));
  const items = Array.from({ length: 6 }, (_, i) => start + i * step);
  const hidden = r.int(1, 5);
  return num(
    items[hidden],
    `Cuenta de ${step} en ${step}. ¿Qué número falta?`,
    items.map((n, i) => (i === hidden ? "?" : String(n))).join("  "),
    `Sumamos ${step} cada vez: falta el ${items[hidden]}.`,
    `de-${step}`
  );
}

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

// Números primos y compuestos.
export function primeComposite(r: Rng, max = 50): Question {
  if (r.chance(0.5)) {
    const n = r.int(2, max);
    const prime = isPrime(n);
    const divisors = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
    return {
      kind: "choice",
      prompt: `¿El número ${n} es primo o compuesto?`,
      options: ["Primo", "Compuesto"],
      answer: prime ? "Primo" : "Compuesto",
      explanation: prime ? `${n} solo se puede dividir entre 1 y ${n}: es primo.` : `${n} tiene más de dos divisores (${divisors.join(", ")}): es compuesto.`,
      tag: prime ? "primo" : "compuesto",
    };
  }
  const wantPrime = r.chance(0.5);
  const nums = new Set<number>();
  while (nums.size < 8) nums.add(r.int(2, max));
  const options = [...nums].sort((a, b) => a - b).map(String);
  const answers = options.filter((n) => isPrime(Number(n)) === wantPrime);
  if (answers.length === 0 || answers.length === options.length) return primeComposite(r, max);
  return {
    kind: "multi",
    prompt: `Selecciona todos los números ${wantPrime ? "primos" : "compuestos"}.`,
    options,
    answers,
    explanation: "Un número primo solo tiene dos divisores: 1 y él mismo. Un compuesto tiene más.",
    tag: wantPrime ? "primos" : "compuestos",
  };
}

// Ordenar números entre `min` y `max`.
export function orderBig(r: Rng, min: number, max: number, count: number): Question {
  const set = new Set<number>();
  while (set.size < count) set.add(r.int(min, max));
  const nums = [...set];
  const ascending = r.chance(0.6);
  const sorted = [...nums].sort((x, y) => (ascending ? x - y : y - x));
  return {
    kind: "sequence",
    prompt: `Ordena los números de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`,
    tiles: r.shuffle(nums.map(fmt)),
    reuse: false,
    length: count,
    answer: sorted.map(fmt),
    explanation: `El orden correcto es ${sorted.map(fmt).join(", ")}.`,
    tag: ascending ? "menor-a-mayor" : "mayor-a-menor",
  };
}

// Secuencias con números hasta `max`.
export function numberSequenceTo(r: Rng, increasing: boolean, max: number): Question {
  const d = r.pick([2, 3, 4, 5, 10, 20, 25, 50, 100]);
  const span = d * 4;
  const start = increasing ? r.int(0, max - span) : r.int(span, max);
  const all = [0, 1, 2, 3, 4].map((i) => start + (increasing ? i : -i) * d);
  const hiddenAt = r.pick([1, 2, 3, 4]);
  return num(
    all[hiddenAt],
    `Completa la secuencia ${increasing ? "creciente" : "decreciente"}.`,
    all.map((n, i) => (i === hiddenAt ? "?" : String(n))).join("  "),
    `Cada número ${increasing ? "aumenta" : "disminuye"} ${d}: falta el ${all[hiddenAt]}.`,
    `de-${d}`
  );
}

// Sumar dos números de `minDigits` a `maxDigits` cifras.
export function addLarge(r: Rng, minDigits = 4, maxDigits = 5): Question {
  const pick = () => {
    const digits = r.int(minDigits, maxDigits);
    return r.int(10 ** (digits - 1), 10 ** digits - 1);
  };
  const a = pick();
  const b = pick();
  return num(a + b, "Resuelve la suma.", `${fmt(a)} + ${fmt(b)} = ?`, `Sumamos columna por columna, de derecha a izquierda: ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}.`, `${String(Math.max(a, b)).length}-cifras`);
}

// Restar números de hasta `maxDigits` cifras.
export function subLarge(r: Rng, maxDigits = 4): Question {
  const a = r.int(10 ** (maxDigits - 1), 10 ** maxDigits - 1);
  const b = r.int(10 ** (maxDigits - 2), a - 1);
  return num(a - b, "Resuelve la resta.", `${fmt(a)} − ${fmt(b)} = ?`, `Restamos columna por columna, de derecha a izquierda: ${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}.`, `${String(b).length}-cifras`);
}
