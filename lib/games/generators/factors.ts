import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, distinct, factorsOf, fixedQ, multiQ, numQ, yesNo } from "./kit";

// Divisibilidad, factores y múltiplos (4.° en adelante).

const RULE: Record<number, string> = {
  2: "termina en cifra par",
  3: "la suma de sus cifras es múltiplo de 3",
  4: "sus dos últimas cifras forman un múltiplo de 4",
  5: "termina en 0 o en 5",
  6: "es divisible entre 2 y entre 3",
  9: "la suma de sus cifras es múltiplo de 9",
  10: "termina en 0",
};
const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

// Número entre min y max que es (o no es) divisible entre d.
function withDivisibility(r: Rng, d: number, yes: boolean, min: number, max: number) {
  for (;;) {
    const n = yes ? d * r.int(Math.ceil(min / d), Math.floor(max / d)) : r.int(min, max);
    if ((n % d === 0) === yes) return n;
  }
}

function why(n: number, d: number) {
  const ok = n % d === 0;
  const detail = d === 3 || d === 9 ? ` (sus cifras suman ${digitSum(n)})` : "";
  return `Un número es divisible entre ${d} si ${RULE[d]}. ${n}${detail} ${ok ? "sí" : "no"} lo cumple.`;
}

// 4.° F.1: criterios de divisibilidad.
export function divisibilityRules(r: Rng, divisors: number[] = [2, 3, 5, 9, 10], max = 999): Question {
  if (r.chance(0.5)) {
    const d = r.pick(divisors);
    const yes = r.chance(0.5);
    const n = withDivisibility(r, d, yes, 30, max);
    return yesNo(`¿${n} es divisible entre ${d}?`, yes, why(n, d), undefined, `entre-${d}`);
  }
  for (;;) {
    const n = r.int(30, max);
    const answers = divisors.filter((d) => n % d === 0);
    if (answers.length === 0 || answers.length === divisors.length) continue;
    return multiQ(`¿Entre cuáles de estos números es divisible ${n}? Selecciona todos.`, divisors.map(String), answers.map(String), divisors.map((d) => `Entre ${d}: ${n % d === 0 ? "sí" : "no"}`).join(". ") + ".", String(n), "varios");
  }
}

// 4.° F.2: problemas de divisibilidad.
export function divisibilityProblem(r: Rng, divisors: number[] = [2, 3, 5, 9, 10]): Question {
  const d = r.pick(divisors);
  const yes = r.chance(0.5);
  const n = withDivisibility(r, d, yes, 40, 600);
  const name = r.pick(NAMES);
  const thing = r.pick(["stickers", "canicas", "caramelos", "lápices", "plantas"]);
  const text = r.pick([
    `${name} tiene ${n} ${thing}. ¿Puede repartirlos en ${d} grupos iguales sin que sobre ninguno?`,
    `Hay ${n} ${thing} para guardar en cajas de ${d}. ¿Se pueden guardar todos sin que sobre ninguno?`,
    `${n} personas van a formar filas de ${d}. ¿Quedarán todas las filas completas?`,
  ]);
  return yesNo(text, yes, `${why(n, d)}${yes ? "" : ` ${n % d === 1 ? "Sobra" : "Sobran"} ${n % d}.`}`, undefined, `entre-${d}`);
}

// 4.° F.3: comprender los factores y los pares de factores.
export function understandFactors(r: Rng): Question {
  const rows = r.int(2, 6);
  const cols = r.int(rows === 2 ? 3 : rows, 9);
  const n = rows * cols;
  if (r.chance(0.5)) {
    const answer = `${rows} y ${cols}`;
    const wrong = [`${rows} y ${n}`, `${rows + 1} y ${cols}`, `${rows} y ${cols + 1}`, `${rows + cols} y ${n}`];
    return choiceQ(r, `La matriz tiene ${n} fichas. ¿Qué par de factores de ${n} muestra?`, answer, wrong, `Hay ${rows} filas de ${cols}: ${rows} × ${cols} = ${n}.`, { kind: "array", emoji: "🟢", rows, cols }, "matriz");
  }
  const yes = r.chance(0.5);
  const candidate = yes ? r.pick([rows, cols]) : r.pick(distinct(r, 3, 2, 12, (x) => n % x !== 0));
  if (candidate === undefined) return understandFactors(r);
  return yesNo(`¿${candidate} es un factor de ${n}?`, yes, yes ? `Sí: ${candidate} × ${n / candidate} = ${n}.` : `No: ${n} ÷ ${candidate} no es exacta (sobran ${n % candidate}).`, undefined, "es-factor");
}

// 4.° F.4: identificar factores.
export function identifyFactors(r: Rng, max = 60): Question {
  for (;;) {
    const n = r.int(8, max);
    const fs = factorsOf(n).filter((f) => f > 1);
    if (fs.length < 3) continue;
    const good = r.shuffle(fs).slice(0, r.int(2, Math.min(3, fs.length)));
    const bad = distinct(r, 6 - good.length, 2, n, (x) => n % x !== 0);
    if (bad.length < 2) continue;
    const options = [...good, ...bad].sort((a, b) => a - b).map(String);
    return multiQ(`Selecciona todos los factores de ${n}.`, options, good.map(String), `${good.map((g) => `${g} × ${n / g} = ${n}`).join("; ")}.`, undefined, `${fs.length + 1}-factores`);
  }
}

// 4.° F.5: hallar todos los pares de factores.
export function factorPairs(r: Rng, max = 72): Question {
  for (;;) {
    const n = r.int(12, max);
    const pairs = factorsOf(n).filter((f) => f * f <= n).map((f) => [f, n / f]);
    if (pairs.length < 3) continue;
    const form = r.int(0, 2);
    if (form === 0) {
      const [a, b] = r.pick(pairs.slice(1));
      return numQ(b, `Completa el par de factores de ${n}.`, `${a} × ? = ${n}`, `${a} × ${b} = ${n}.`, "completar");
    }
    if (form === 1) return numQ(pairs.length, `¿Cuántos pares de factores tiene el ${n}? (Cuenta 1 × ${n}; no cuentes dos veces el mismo par.)`, undefined, `Los pares son ${pairs.map(([a, b]) => `${a} × ${b}`).join(", ")}: ${pairs.length} pares.`, "contar");
    const good = r.shuffle(pairs).slice(0, r.int(2, 3));
    const bad: string[] = [];
    for (const [a, b] of r.shuffle(pairs)) {
      const text = `${a + 1} × ${b}`;
      if ((a + 1) * b !== n && bad.length < 5 - good.length) bad.push(text);
    }
    if (bad.length < 2) continue;
    return multiQ(`Selecciona todos los pares de factores de ${n}.`, r.shuffle([...good.map(([a, b]) => `${a} × ${b}`), ...bad]), good.map(([a, b]) => `${a} × ${b}`), `Los pares de factores de ${n} son ${pairs.map(([a, b]) => `${a} × ${b}`).join(", ")}.`, undefined, "elegir-pares");
  }
}

// 4.° F.6 / F.7: elegir los múltiplos de un número hasta `maxK`.
export function chooseMultiples(r: Rng, maxK: number): Question {
  const k = r.int(2, maxK);
  const good = distinct(r, r.int(2, 4), 1, 12).map((m) => m * k);
  const bad = distinct(r, 6 - good.length, k + 1, k * 12, (x) => x % k !== 0);
  const options = [...good, ...bad].sort((a, b) => a - b).map(String);
  return multiQ(`Selecciona todos los múltiplos de ${k}.`, options, good.map(String), `Los múltiplos de ${k} se obtienen multiplicando por ${k}: ${good.sort((a, b) => a - b).map((g) => `${k} × ${g / k} = ${g}`).join("; ")}.`, undefined, `de-${k}`);
}

// 4.° F.8: clasificar múltiplos en un diagrama de Venn.
export function vennMultiples(r: Rng): Question {
  const [a, b] = r.pick([[2, 3], [2, 5], [3, 4], [3, 5], [2, 7], [4, 5], [4, 6], [3, 10], [6, 9]]);
  const zones = ["solo-a", "ambos", "solo-b", "ninguno"] as const;
  const zoneOf = (n: number) => (n % a === 0 && n % b === 0 ? "ambos" : n % a === 0 ? "solo-a" : n % b === 0 ? "solo-b" : "ninguno");
  const pool = (zone: string) => Array.from({ length: 59 }, (_, i) => i + 2).filter((n) => zoneOf(n) === zone);
  const target = r.pick(zones);
  const n = r.pick(pool(target));
  const placed = (zone: string) => r.shuffle(pool(zone).filter((x) => x !== n)).slice(0, 2).map(String);
  const labels = { "solo-a": `Solo en «múltiplos de ${a}»`, ambos: "En el centro (los dos)", "solo-b": `Solo en «múltiplos de ${b}»`, ninguno: "Fuera de los dos círculos" };
  const reason = { "solo-a": `es múltiplo de ${a}, pero no de ${b}`, ambos: `es múltiplo de ${a} y de ${b}`, "solo-b": `es múltiplo de ${b}, pero no de ${a}`, ninguno: `no es múltiplo de ${a} ni de ${b}` };
  return fixedQ(`¿Dónde va el número ${n} en el diagrama?`, zones.map((z) => labels[z]), labels[target], `${n} ${reason[target]}.`, { kind: "venn", left: placed("solo-a"), both: placed("ambos"), right: placed("solo-b"), leftLabel: `Múltiplos de ${a}`, rightLabel: `Múltiplos de ${b}` }, target);
}
