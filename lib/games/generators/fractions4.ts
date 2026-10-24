import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, SYMBOLS, choiceQ, fadd, fcmp, fixedQ, fmul, fr, fracQ, fshow, fsub, gcd, lcm, mixed, numQ, sym } from "./kit";

// Fracciones de 5.° en adelante: denominadores distintos, números mixtos,
// multiplicar fracciones, escalar y dividir con fracciones unitarias. Las
// respuestas van simplificadas (como número mixto si pasan de 1) y en opción múltiple.

const DENS = [2, 3, 4, 5, 6, 8, 10, 12];
const m = ([n, d]: Frac) => mixed(n, d);
const proper = (r: Rng, dens = DENS): Frac => {
  const d = r.pick(dens);
  return d === 2 ? [1, 2] : [r.int(1, d - 1), d];
};
// Número mixto (como fracción impropia sin simplificar).
const mixedNum = (r: Rng, dens = [2, 3, 4, 5, 6, 8], maxWhole = 5): Frac => {
  const d = r.pick(dens);
  return [r.int(1, maxWhole) * d + r.int(1, d - 1), d];
};
const common = (a: Frac, b: Frac) => lcm(a[1], b[1]);
const over = (f: Frac, den: number) => `${f[0] * (den / f[1])}/${den}`;

// Opción múltiple con fracciones sin simplificar (para leer un modelo tal cual).
function rawQ(r: Rng, prompt: string, answer: Frac, explanation: string, visual?: Visual | string, tag?: string, extra: Frac[] = []): Question {
  const [n, d] = answer;
  const pool: Frac[] = [...extra, [n + 1, d], [n, d + 1], [n + 1, d + 1], [n * 2, d], [d, n], [n, d * 2]];
  const wrong = pool.filter((f) => f[0] > 0 && f[1] > 1 && f[0] * d !== n * f[1]).map(fr);
  return choiceQ(r, prompt, fr(answer), wrong, explanation, visual, tag);
}

// Mínimo común denominador.
export function leastCommonDenominator(r: Rng): Question {
  for (;;) {
    const a = proper(r);
    const b = proper(r);
    if (a[1] === b[1]) continue;
    const den = common(a, b);
    return numQ(den, `¿Cuál es el mínimo común denominador de ${fr(a)} y ${fr(b)}?`, undefined, `Es el menor múltiplo común de ${a[1]} y ${b[1]}: ${den}. Así, ${fr(a)} = ${over(a, den)} y ${fr(b)} = ${over(b, den)}.`, den === a[1] * b[1] ? "producto" : "menor");
  }
}

// Redondear números mixtos al entero más cercano.
export function roundMixed(r: Rng): Question {
  for (;;) {
    const f = mixedNum(r, [3, 4, 5, 6, 8, 10, 12], 9);
    const rest = f[0] % f[1];
    if (rest * 2 === f[1]) continue;
    const w = Math.floor(f[0] / f[1]);
    const up = rest * 2 > f[1];
    return numQ(up ? w + 1 : w, `Redondea ${m(f)} al número natural más cercano.`, undefined, `${rest}/${f[1]} es ${up ? "más" : "menos"} que 1/2, así que se redondea hacia ${up ? "arriba" : "abajo"}: ${up ? w + 1 : w}.`, up ? "arriba" : "abajo");
  }
}

// Recíprocos (inversos multiplicativos).
export function reciprocal(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const k = r.int(2, 12);
    return choiceQ(r, `¿Cuál es el recíproco de ${k}?`, `1/${k}`, [`${k}/1`, `1/${k + 1}`, `${k}/${k}`, `1/${k * 2}`], `${k} = ${k}/1; al invertirlo queda 1/${k}. ${k} × 1/${k} = 1.`, undefined, "natural");
  }
  if (form === 1) {
    const k = r.int(2, 12);
    return numQ(k, `¿Cuál es el recíproco de 1/${k}?`, undefined, `Al invertir 1/${k} queda ${k}/1 = ${k}. 1/${k} × ${k} = 1.`, "unitaria");
  }
  for (;;) {
    const [n, d] = proper(r, [3, 4, 5, 7, 8, 9]);
    if (n === 1 || gcd(n, d) !== 1) continue;
    return choiceQ(r, `¿Cuál es el recíproco de ${n}/${d}?`, `${d}/${n}`, [`${n}/${d}`, `${d}/${n + 1}`, `${d - n}/${d}`, `${n}/${d + 1}`, `1/${d}`], `Se intercambian el numerador y el denominador: ${d}/${n}. ${n}/${d} × ${d}/${n} = 1.`, undefined, "fraccion");
  }
}

// Comparar fracciones y números mixtos.
export function compareFracMixed(r: Rng): Question {
  const a = r.chance(0.5) ? mixedNum(r) : proper(r);
  const b: Frac = r.chance(0.2) ? [a[0] * 2, a[1] * 2] : a[0] > a[1] ? (r.chance(0.6) ? [Math.floor(a[0] / a[1]) * r.pick([2, 3, 4, 5, 6]) + 1, 1] : mixedNum(r)) : proper(r);
  // Un entero se escribe sin denominador; el resto, como fracción o mixto.
  const fix = (f: Frac): Frac => (f[1] === 1 ? [Math.floor(a[0] / a[1]) * 3 + 1, 3] : f);
  const bb = fix(b);
  const s = sym(fcmp(a, bb), 0);
  const den = common(a, bb);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, s === "=" ? `Son equivalentes: las dos valen ${fshow(a)}.` : `Con denominador ${den}: ${over(a, den)} ${s} ${over(bb, den)}.`, `${m(a)}  ?  ${m(bb)}`, s);
}

const BENCH: [string, number][] = [["0", 0], ["1/2", 1], ["1", 2]];
// Fracción claramente cerca de 0, 1/2 o 1 (distancias en mitades).
function nearBenchmark(r: Rng): { f: Frac; half: number } {
  for (;;) {
    const d = r.pick([7, 8, 9, 10, 11, 12, 15, 16, 20]);
    const n = r.int(1, d - 1);
    const dist = [2 * n, Math.abs(2 * n - d), 2 * (d - n)];
    const best = Math.min(...dist);
    if (dist.filter((x) => x === best).length > 1 || best * 5 > d * 2) continue;
    return { f: [n, d], half: dist.indexOf(best) };
  }
}
const HALVES = ["0", "1/2", "1", "1 1/2", "2"];

// Estimar sumas y restas de fracciones usando referencias.
export function estimateFractions(r: Rng): Question {
  for (;;) {
    const a = nearBenchmark(r);
    const b = nearBenchmark(r);
    const add = r.chance(0.5);
    const result = add ? a.half + b.half : a.half - b.half;
    if (result < 0 || (!add && fcmp(a.f, b.f) <= 0)) continue;
    return fixedQ(`Redondea cada fracción a 0, 1/2 o 1 y estima: ${fr(a.f)} ${add ? "+" : "−"} ${fr(b.f)}`, HALVES, HALVES[result], `${fr(a.f)} ≈ ${BENCH[a.half][0]} y ${fr(b.f)} ≈ ${BENCH[b.half][0]}; ${BENCH[a.half][0]} ${add ? "+" : "−"} ${BENCH[b.half][0]} = ${HALVES[result]}.`, undefined, add ? "suma" : "resta");
  }
}

// Dos fracciones propias con denominadores distintos.
function unlikePair(r: Rng, op: "+" | "−"): [Frac, Frac] {
  for (;;) {
    const a = proper(r);
    const b = proper(r);
    if (a[1] === b[1] || common(a, b) > 40) continue;
    if (op === "−" && fcmp(a, b) <= 0) continue;
    return [a, b];
  }
}
const pickOp = (r: Rng, op: "+" | "−" | "mixed") => (op === "mixed" ? r.pick(["+", "−"] as const) : op);
const stepsFor = (a: Frac, b: Frac, op: "+" | "−", c: Frac) => {
  const den = common(a, b);
  const raw = op === "+" ? a[0] * (den / a[1]) + b[0] * (den / b[1]) : a[0] * (den / a[1]) - b[0] * (den / b[1]);
  return `Con denominador ${den}: ${over(a, den)} ${op} ${over(b, den)} = ${raw}/${den}${fshow(c) !== `${raw}/${den}` ? ` = ${fshow(c)}` : ""}.`;
};
// Errores típicos: operar numeradores y denominadores por separado.
const naive = (a: Frac, b: Frac, op: "+" | "−"): Frac[] => [[op === "+" ? a[0] + b[0] : Math.abs(a[0] - b[0]) || 1, op === "+" ? a[1] + b[1] : Math.abs(a[1] - b[1]) || a[1]], [op === "+" ? a[0] + b[0] : Math.abs(a[0] - b[0]) || 1, common(a, b)]];

type Ctx = "plain" | "word" | "recipe";
const RECIPE = ["harina", "azúcar", "leche", "avena", "arroz"];
const cups = (x: string) => (x.includes(" ") || !x.includes("/") ? `${x} tazas` : `${x} de taza`);

function story(r: Rng, op: "+" | "−", a: string, b: string, ctx: Ctx): string {
  const name = r.pick(NAMES);
  if (ctx === "recipe") {
    const item = r.pick(RECIPE);
    return op === "+" ? `Una receta lleva ${cups(a)} de ${item} para la masa y ${cups(b)} para la cubierta. ¿Qué cantidad de ${item} lleva en total?` : `${name} tenía ${cups(a)} de ${item} y usó ${cups(b)} en una receta. ¿Qué cantidad le queda?`;
  }
  return op === "+"
    ? r.pick([`${name} caminó ${a} km por la mañana y ${b} km por la tarde. ¿Cuántos kilómetros caminó en total?`, `Una jarra tenía ${a} litros de jugo y se le agregaron ${b} litros. ¿Cuántos litros tiene ahora?`, `${name} compró ${a} kg de fresas y ${b} kg de uvas. ¿Cuántos kilos de fruta compró?`])
    : r.pick([`${name} tenía ${a} m de cinta y usó ${b} m. ¿Cuántos metros le quedan?`, `Un bidón tenía ${a} litros de agua y se usaron ${b} litros. ¿Cuántos litros quedan?`, `${name} debe recorrer ${a} km y ya recorrió ${b} km. ¿Cuántos kilómetros le faltan?`]);
}

// Sumar y restar fracciones con denominadores distintos.
export function unlikeFractions(r: Rng, op: "+" | "−" | "mixed", ctx: Ctx = "plain"): Question {
  const o = pickOp(r, op);
  const [a, b] = unlikePair(r, o);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  const tag = o === "+" ? "suma" : "resta";
  if (ctx !== "plain") return fracQ(r, story(r, o, fr(a), fr(b), ctx), c, stepsFor(a, b, o, c), undefined, tag, naive(a, b, o));
  return fracQ(r, "Resuelve. Escribe el resultado en su mínima expresión.", c, stepsFor(a, b, o, c), `${fr(a)} ${o} ${fr(b)} = ?`, tag, naive(a, b, o));
}

// Sumar tres o más fracciones con denominadores distintos.
export function addThreeFractions(r: Rng, word: boolean): Question {
  for (;;) {
    const fs = [proper(r, [2, 3, 4, 6]), proper(r, [2, 3, 4, 6, 12]), proper(r, [3, 4, 6, 12])];
    if (new Set(fs.map((f) => f[1])).size < 2) continue;
    const den = fs.reduce((x, f) => lcm(x, f[1]), 1);
    const total = fs.reduce((x, f) => fadd(x, f), [0, 1] as Frac);
    const why = `Con denominador ${den}: ${fs.map((f) => over(f, den)).join(" + ")} = ${(total[0] * den) / total[1]}/${den}${fshow(total) !== `${(total[0] * den) / total[1]}/${den}` ? ` = ${fshow(total)}` : ""}.`;
    const [a, b, c] = fs.map(fr);
    if (word) return fracQ(r, r.pick([`${r.pick(NAMES)} corrió ${a} km el lunes, ${b} km el miércoles y ${c} km el viernes. ¿Cuántos kilómetros corrió en total?`, `Para un jugo se mezclan ${a} de litro de naranja, ${b} de litro de piña y ${c} de litro de agua. ¿Cuántos litros de jugo salen?`, `Tres bolsas pesan ${a} kg, ${b} kg y ${c} kg. ¿Cuánto pesan juntas?`]), total, why);
    return fracQ(r, "Resuelve. Escribe el resultado en su mínima expresión.", total, why, `${a} + ${b} + ${c} = ?`);
  }
}

// Completar sumas y restas con fracciones.
export function completeFractionSentence(r: Rng): Question {
  const o = r.pick(["+", "−"] as const);
  const [a, b] = unlikePair(r, o);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  const text = `${fr(a)} ${o} ? = ${fshow(c)}`;
  return fracQ(r, "¿Qué fracción falta?", b, `${fr(a)} ${o} ${fr(b)} = ${fshow(c)}. ${stepsFor(a, b, o, c)}`, text, o === "+" ? "suma" : "resta", [c, o === "+" ? fadd(a, c) : a]);
}

// Comparar sumas y restas de fracciones.
export function compareFractionSums(r: Rng): Question {
  const o = r.pick(["+", "−"] as const);
  const [a, b] = unlikePair(r, o);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  const other: Frac = r.chance(0.25) ? c : r.pick<Frac>([[1, 2], [1, 1], [1, 4], [3, 4], proper(r)]);
  const s = sym(fcmp(c, other), 0);
  const show = (f: Frac) => (f[1] === 1 ? String(f[0]) : fshow(f));
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${fr(a)} ${o} ${fr(b)} = ${fshow(c)}, y ${fshow(c)} ${s} ${show(other)}.`, `${fr(a)} ${o} ${fr(b)}  ?  ${show(other)}`, s);
}

// ---------------------------------------------------------------------------
// Números mixtos con denominadores distintos

// Estimar sumas y restas de números mixtos.
export function estimateMixedSums(r: Rng): Question {
  for (;;) {
    const a = mixedNum(r, [3, 4, 5, 6, 8, 10], 9);
    const b = mixedNum(r, [3, 4, 5, 6, 8, 10], 9);
    const round = (f: Frac) => Math.round(f[0] / f[1]);
    if ((a[0] % a[1]) * 2 === a[1] || (b[0] % b[1]) * 2 === b[1]) continue;
    const add = r.chance(0.5);
    if (!add && round(a) <= round(b)) continue;
    const answer = add ? round(a) + round(b) : round(a) - round(b);
    return numQ(answer, "Redondea cada número mixto al natural más cercano y estima.", `${m(a)} ${add ? "+" : "−"} ${m(b)} ≈ ?`, `${m(a)} ≈ ${round(a)} y ${m(b)} ≈ ${round(b)}; ${round(a)} ${add ? "+" : "−"} ${round(b)} = ${answer}.`, add ? "suma" : "resta");
  }
}

// Dos números mixtos con denominadores distintos. `regroup` false: no hace falta reagrupar.
function mixedPair(r: Rng, op: "+" | "−", regroup: boolean): [Frac, Frac] {
  for (;;) {
    const a = mixedNum(r, [2, 3, 4, 5, 6, 8], 6);
    const b = mixedNum(r, [2, 3, 4, 5, 6, 8], 5);
    if (a[1] === b[1] || common(a, b) > 24) continue;
    const fa: Frac = [a[0] % a[1], a[1]];
    const fb: Frac = [b[0] % b[1], b[1]];
    if (op === "−" && fcmp(a, b) <= 0) continue;
    const carries = op === "+" ? fcmp(fadd(fa, fb), [1, 1]) >= 0 : fcmp(fa, fb) < 0;
    if (!regroup && carries) continue;
    return [a, b];
  }
}

// Sumar y restar números mixtos con denominadores distintos.
export function mixedUnlike(r: Rng, op: "+" | "−" | "mixed", regroup: boolean, ctx: Ctx = "plain"): Question {
  const o = pickOp(r, op);
  const [a, b] = mixedPair(r, o, regroup);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  const den = common(a, b);
  const why = `Con denominador ${den}: ${mixed(a[0] * (den / a[1]), den)} ${o} ${mixed(b[0] * (den / b[1]), den)} = ${fshow(c)}.`;
  const wa = Math.floor(a[0] / a[1]);
  const wb = Math.floor(b[0] / b[1]);
  const whole = Math.max(1, o === "+" ? wa + wb : wa - wb);
  const extra: Frac[] = [[whole * (a[1] + b[1]) + (a[0] % a[1]) + (b[0] % b[1]), a[1] + b[1]], fadd(c, [1, 1]), fadd(c, [1, den])];
  const tag = o === "+" ? "suma" : "resta";
  if (ctx !== "plain") return fracQ(r, story(r, o, m(a), m(b), ctx), c, why, undefined, tag, extra);
  return fracQ(r, "Resuelve. Escribe el resultado en su mínima expresión.", c, why, `${m(a)} ${o} ${m(b)} = ?`, tag, extra);
}

// Problemas de varios pasos con fracciones y números mixtos.
export function mixedUnlikeMultiStep(r: Rng): Question {
  for (;;) {
    const a = mixedNum(r, [2, 4], 3);
    const b = mixedNum(r, [2, 4, 8], 2);
    const used = proper(r, [2, 4, 8]);
    const total = fadd(a, b);
    if (fcmp(total, used) <= 0) continue;
    const left = fsub(total, used);
    const name = r.pick(NAMES);
    return fracQ(r, `${name} compró ${m(a)} kg de manzanas y ${m(b)} kg de peras. Usó ${fr(used)} kg en una ensalada. ¿Cuántos kilos de fruta le quedan?`, left, `${m(a)} + ${m(b)} = ${fshow(total)}; ${fshow(total)} − ${fr(used)} = ${fshow(left)}.`, undefined, undefined, [total, fadd(total, used)]);
  }
}

// Completar sumas y restas con números mixtos.
export function completeMixedSentence(r: Rng): Question {
  const o = r.pick(["+", "−"] as const);
  const [a, b] = mixedPair(r, o, true);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  return fracQ(r, "¿Qué número falta?", b, `${m(a)} ${o} ${m(b)} = ${fshow(c)}.`, `${m(a)} ${o} ? = ${fshow(c)}`, o === "+" ? "suma" : "resta", [c, fadd(b, [1, 1])]);
}

// Comparar sumas y restas de números mixtos.
export function compareMixedSums(r: Rng): Question {
  const o = r.pick(["+", "−"] as const);
  const [a, b] = mixedPair(r, o, true);
  const c = o === "+" ? fadd(a, b) : fsub(a, b);
  const whole = Math.round(c[0] / c[1]) || 1;
  const other: Frac = r.chance(0.2) ? c : [whole * 2 + r.pick([-1, 0, 1]), 2];
  const s = sym(fcmp(c, other), 0);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${m(a)} ${o} ${m(b)} = ${fshow(c)}, y ${fshow(c)} ${s} ${fshow(other)}.`, `${m(a)} ${o} ${m(b)}  ?  ${fshow(other)}`, s);
}

// ---------------------------------------------------------------------------
// Multiplicar fracciones

// Multiplicar fracciones por números naturales usando matrices.
export function fractionOfArray(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const n = r.int(1, d - 1);
  const each = r.int(2, 8);
  return numQ(n * each, `La matriz tiene ${d * each} fichas en ${d} filas iguales. ¿Cuánto es ${n}/${d} de ${d * each}? (${n}/${d} × ${d * each})`, { kind: "array", emoji: "🟡", rows: d, cols: each }, `Cada fila es 1/${d} del total y tiene ${each} fichas; ${n} ${n === 1 ? "fila" : "filas"}: ${n} × ${each} = ${n * each}.`);
}

// Multiplicar dos fracciones usando modelos (cuadrícula).
export function multiplyModel(r: Rng, unit: boolean, area = false): Question {
  const c = r.int(2, 5);
  const d = r.int(2, 5);
  const a = unit ? 1 : r.int(1, c - 1);
  const b = unit ? 1 : r.int(1, d - 1);
  const visual: Visual = { kind: "fracGrid", rows: d, cols: c, a, b };
  const why = `El rectángulo quedó dividido en ${c} × ${d} = ${c * d} partes iguales y la zona donde se cruzan los dos colores tiene ${a} × ${b} = ${a * b}: ${a * b}/${c * d}.`;
  const prompt = area ? `Un rectángulo mide ${a}/${c} m de largo y ${b}/${d} m de ancho (el cuadrado completo mide 1 m por 1 m). ¿Cuál es su área, en m²?` : `El modelo muestra ${a}/${c} × ${b}/${d}. ¿Cuál es el producto? (Mira la zona donde se cruzan los dos colores.)`;
  return rawQ(r, prompt, [a * b, c * d], why, visual, unit ? "unitarias" : "fracciones", [[a + b, c + d], [a * b, c + d], [a + b, c * d]]);
}

const fracLabel = (f: Frac) => (f[1] === 1 ? String(f[0]) : fr(f));

// Multiplicar con modelos de área (número mixto partido en entero + fracción).
export function mixedAreaModel(r: Rng, other: "whole" | "fraction" | "mixed"): Question {
  const d = r.pick([2, 3, 4]);
  const w = r.int(1, 4);
  const top: Frac[] = [[w, 1], [r.int(1, d - 1), d]];
  const d2 = r.pick([2, 3, 4]);
  const side: Frac[] = other === "whole" ? [[r.int(2, 6), 1]] : other === "fraction" ? [[r.int(1, d2 - 1), d2]] : [[r.int(1, 3), 1], [1, d2]];
  const cells = side.map((s) => top.map((t) => fmul(s, t)));
  const total = cells.flat().reduce((x, f) => fadd(x, f), [0, 1] as Frac);
  const a = fadd(top[0], top[1]);
  const b = side.reduce((x, f) => fadd(x, f), [0, 1] as Frac);
  const visual: Visual = { kind: "areaModel", top: top.map(fracLabel), side: side.map(fracLabel), cells: cells.map((row) => row.map(fshow)) };
  return fracQ(r, `Usa el modelo de área para hallar ${fshow(b)} × ${fshow(a)}.`, total, `Sumamos las partes: ${cells.flat().map(fshow).join(" + ")} = ${fshow(total)}.`, visual, other, [fmul(b, top[0]), fadd(fmul(b, top[0]), top[1])]);
}

// Multiplicar un número mixto por un natural con un modelo de tiras.
export function mixedTimesWholeStrip(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const f: Frac = [r.int(1, 3) * d + r.int(1, d - 1), d];
  const k = r.int(2, 5);
  const total = fmul(f, [k, 1]);
  return fracQ(r, `La tira muestra ${k} veces ${m(f)}. ¿Cuánto es ${k} × ${m(f)}?`, total, `${k} × ${Math.floor(f[0] / d)} = ${k * Math.floor(f[0] / d)} y ${k} × ${f[0] % d}/${d} = ${fshow([k * (f[0] % d), d])}; en total ${fshow(total)}.`, { kind: "strip", total: "?", bars: [{ parts: Array.from({ length: k }, () => ({ text: m(f), w: 1 })) }] }, undefined, [[k * Math.floor(f[0] / d) * d + (f[0] % d), d]]);
}

// Multiplicar fracciones por números naturales (resultado simplificado).
export function fractionTimesWhole(r: Rng, word = false): Question {
  const f = proper(r, [3, 4, 5, 6, 8, 10, 12]);
  const k = r.int(2, 12);
  const p = fmul(f, [k, 1]);
  const why = `${k} × ${f[0]} = ${k * f[0]}; ${k * f[0]}/${f[1]}${fshow(p) !== `${k * f[0]}/${f[1]}` ? ` = ${fshow(p)}` : ""}.`;
  const extra: Frac[] = [[f[0], f[1] * k], [k * f[0], k * f[1]], [k + f[0], f[1]]];
  if (word) {
    const name = r.pick(NAMES);
    return fracQ(r, r.pick([`${name} corre ${fr(f)} de kilómetro cada día. ¿Cuántos kilómetros corre en ${k} días?`, `Cada vaso tiene ${fr(f)} de litro de jugo. ¿Cuántos litros hay en ${k} vasos?`, `Cada cinta mide ${fr(f)} de metro. ¿Cuántos metros miden ${k} cintas?`, `${name} estudia ${fr(f)} de hora cada día. ¿Cuántas horas estudia en ${k} días?`]), p, why, undefined, undefined, extra);
  }
  return fracQ(r, "Multiplica. Escribe el resultado en su mínima expresión.", p, why, `${k} × ${fr(f)} = ?`, undefined, extra);
}

// Fracción de un número cuando el resultado no es un número natural.
export function fractionOfNumber2(r: Rng): Question {
  for (;;) {
    const f = proper(r, [3, 4, 5, 6, 8]);
    const n = r.int(2, 30);
    if (n % f[1] === 0) continue;
    const p = fmul(f, [n, 1]);
    return fracQ(r, "Calcula. Escribe el resultado en su mínima expresión.", p, `${f[0]} × ${n} = ${f[0] * n}; ${f[0] * n}/${f[1]} = ${fshow(p)}.`, `${fr(f)} de ${n} = ?`, undefined, [[n, f[1]], [f[0] * n, f[1] * n]]);
  }
}

// Dos fracciones propias para multiplicar.
const factors = (r: Rng): [Frac, Frac] => [proper(r, [2, 3, 4, 5, 6, 8]), proper(r, [2, 3, 4, 5, 6, 7, 9, 10])];
const multWhy = (a: Frac, b: Frac, p: Frac) => `Numerador: ${a[0]} × ${b[0]} = ${a[0] * b[0]}; denominador: ${a[1]} × ${b[1]} = ${a[1] * b[1]}. ${a[0] * b[0]}/${a[1] * b[1]}${fshow(p) !== `${a[0] * b[0]}/${a[1] * b[1]}` ? ` = ${fshow(p)}` : ""}.`;

// Multiplicar dos fracciones.
export function multiplyFractions(r: Rng, word = false): Question {
  const [a, b] = factors(r);
  const p = fmul(a, b);
  const extra: Frac[] = [[a[0] + b[0], a[1] + b[1]], [a[0] * b[1], a[1] * b[0]], [a[0] * b[0], a[1] + b[1]]];
  if (word) {
    const name = r.pick(NAMES);
    return fracQ(r, r.pick([`A ${name} le queda ${fr(a)} de una pizza y come ${fr(b)} de lo que queda. ¿Qué fracción de la pizza entera comió?`, `Un terreno ocupa ${fr(a)} de hectárea y ${fr(b)} del terreno está sembrado. ¿Qué fracción de hectárea está sembrada?`, `Una botella tiene ${fr(a)} de litro de agua y ${name} toma ${fr(b)} de esa agua. ¿Cuántos litros toma?`, `${name} tiene ${fr(a)} de metro de cinta y usa ${fr(b)} de ese trozo. ¿Cuántos metros usa?`]), p, multWhy(a, b, p), undefined, undefined, extra);
  }
  return fracQ(r, "Multiplica. Escribe el resultado en su mínima expresión.", p, multWhy(a, b, p), `${fr(a)} × ${fr(b)} = ?`, undefined, extra);
}

// Multiplicar tres fracciones y números naturales.
export function multiplyThree(r: Rng): Question {
  const [a, b] = factors(r);
  const k = r.int(2, 6);
  const third: Frac = r.chance(0.5) ? [k, 1] : proper(r, [2, 3, 4, 5]);
  const p = fmul(fmul(a, b), third);
  return fracQ(r, "Multiplica. Escribe el resultado en su mínima expresión.", p, `Multiplicamos los numeradores (${a[0]} × ${b[0]} × ${third[0]} = ${a[0] * b[0] * third[0]}) y los denominadores (${a[1]} × ${b[1]} × ${third[1]} = ${a[1] * b[1] * third[1]}): ${fshow(p)}.`, `${fr(a)} × ${fr(b)} × ${fracLabel(third)} = ?`, undefined, [fmul(a, b), fadd(fmul(a, b), third)]);
}

// Completar la multiplicación de fracciones (`whole`: uno de los datos es un natural).
export function completeMultiplication(r: Rng, whole: boolean): Question {
  for (;;) {
    const a = proper(r, [2, 3, 4, 5, 6]);
    const b: Frac = whole ? [r.int(2, 9), 1] : proper(r, [2, 3, 4, 5, 7]);
    const p = fmul(a, b);
    if (whole) return numQ(b[0], "¿Qué número natural falta?", `${fr(a)} × ? = ${fshow(p)}`, `${fr(a)} × ${b[0]} = ${a[0] * b[0]}/${a[1]}${fshow(p) !== `${a[0] * b[0]}/${a[1]}` ? ` = ${fshow(p)}` : ""}.`, "natural");
    if (gcd(a[0] * b[0], a[1] * b[1]) !== 1) continue;
    return fracQ(r, "¿Qué fracción falta?", b, multWhy(a, b, p), `${fr(a)} × ? = ${fr(p)}`, "fraccion", [[b[1], b[0]], p, [a[0] + b[0], a[1] + b[1]]]);
  }
}

// Multiplicar fracciones para hallar un área.
export function fractionArea(r: Rng, kinds: ("fraction" | "whole" | "mixed")[] = ["fraction"]): Question {
  const side = (): Frac => {
    const k = r.pick(kinds);
    return k === "whole" ? [r.int(2, 9), 1] : k === "mixed" ? mixedNum(r, [2, 3, 4], 4) : proper(r, [2, 3, 4, 5, 8]);
  };
  const a = side();
  const b = kinds.length > 1 && a[1] === 1 ? proper(r, [2, 3, 4, 5]) : side();
  const p = fmul(a, b);
  const unit = r.pick(["m", "km", "cm"]);
  return fracQ(r, `Un rectángulo mide ${fshow(a)} ${unit} de largo y ${fshow(b)} ${unit} de ancho. ¿Cuál es su área, en ${unit}²?`, p, `Área = largo × ancho = ${fshow(a)} × ${fshow(b)} = ${fshow(p)} ${unit}².`, undefined, undefined, [fadd(a, b), fmul(fadd(a, b), [2, 1])]);
}

// Estimar productos de números mixtos.
export function estimateMixedProduct(r: Rng): Question {
  for (;;) {
    const a = mixedNum(r, [3, 4, 5, 6, 8], 8);
    const b = mixedNum(r, [3, 4, 5, 6, 8], 8);
    if ((a[0] % a[1]) * 2 === a[1] || (b[0] % b[1]) * 2 === b[1]) continue;
    const ra = Math.round(a[0] / a[1]);
    const rb = Math.round(b[0] / b[1]);
    return numQ(ra * rb, "Redondea cada número mixto al natural más cercano y estima el producto.", `${m(a)} × ${m(b)} ≈ ?`, `${m(a)} ≈ ${ra} y ${m(b)} ≈ ${rb}; ${ra} × ${rb} = ${ra * rb}.`);
  }
}

export type Operand = "whole" | "fraction" | "mixed";
function operand(r: Rng, kind: Operand): Frac {
  return kind === "whole" ? [r.int(2, 8), 1] : kind === "mixed" ? mixedNum(r, [2, 3, 4, 5], 4) : proper(r, [2, 3, 4, 5, 6]);
}
const improper = (f: Frac) => (f[0] > f[1] && f[1] !== 1 ? `${m(f)} = ${f[0]}/${f[1]}` : "");

// Multiplicar números mixtos, fracciones y naturales.
export function multiplyMixed(r: Rng, kinds: Operand[][], ctx: "plain" | "word" | "recipe" | "multiStep" = "plain"): Question {
  const fs = r.pick(kinds).map((k) => operand(r, k));
  const p = fs.reduce((x, f) => fmul(x, f), [1, 1] as Frac);
  const conv = fs.map(improper).filter(Boolean).join("; ");
  const why = `${conv ? `${conv}. ` : ""}${fs.map((f) => (f[1] === 1 ? String(f[0]) : fr(f))).join(" × ")} = ${fshow(p)}.`;
  const [a, b] = fs;
  const extra: Frac[] = [fadd(a, b), fmul([Math.floor(a[0] / a[1]) || 1, 1], [Math.floor(b[0] / b[1]) || 1, 1]), fadd(p, [1, 1])];
  const name = r.pick(NAMES);
  if (ctx === "recipe") return fracQ(r, `Una receta lleva ${cups(fshow(a))} de ${r.pick(RECIPE)}. ¿Cuántas tazas se necesitan para preparar ${b[1] === 1 ? `${b[0]} veces` : `${fshow(b)} de`} la receta?`, p, why, undefined, undefined, extra);
  if (ctx === "word") return fracQ(r, r.pick([`${name} camina ${fshow(a)} km cada hora. ¿Cuántos kilómetros camina en ${fshow(b)} ${fcmp(b, [1, 1]) === 0 ? "hora" : "horas"}?`, `Cada bolsa pesa ${fshow(a)} kg. ¿Cuánto pesan ${fshow(b)} bolsas?`, `Un caño llena ${fshow(a)} litros por minuto. ¿Cuántos litros llena en ${fshow(b)} minutos?`]), p, why, undefined, undefined, extra);
  if (ctx === "multiStep") {
    const used = proper(r, [2, 4]);
    if (fcmp(p, used) <= 0) return multiplyMixed(r, kinds, ctx);
    const left = fsub(p, used);
    return fracQ(r, `${name} compró ${fshow(b)} bolsas de ${fshow(a)} kg de arroz y ya usó ${fr(used)} kg. ¿Cuántos kilos le quedan?`, left, `${fshow(b)} × ${fshow(a)} = ${fshow(p)}; ${fshow(p)} − ${fr(used)} = ${fshow(left)}.`, undefined, undefined, [p, fadd(p, used)]);
  }
  return fracQ(r, "Multiplica. Escribe el resultado en su mínima expresión.", p, why, `${fs.map(fshow).join(" × ")} = ?`, undefined, extra);
}

// ---------------------------------------------------------------------------
// Escalar

const SCALE = ["Menor que", "Igual a", "Mayor que"];

// Al multiplicar por una fracción, ¿el resultado es mayor, menor o igual?
export function scaling(r: Rng, base: Operand, justify = false): Question {
  const b = operand(r, base);
  const want = r.int(0, 2);
  const d = r.pick([2, 3, 4, 5, 6, 8]);
  const factor: Frac = want === 0 ? [r.int(1, d - 1), d] : want === 1 ? [d, d] : r.chance(0.5) ? [d + r.int(1, d - 1), d] : [d * r.int(1, 2) + r.int(1, d - 1), d];
  const fText = want === 2 && r.chance(0.5) ? m(factor) : fr(factor);
  const bText = fshow(b);
  if (justify) {
    const reasons = [`Menor que ${bText}, porque ${fText} es menor que 1`, `Igual a ${bText}, porque ${fText} es igual a 1`, `Mayor que ${bText}, porque ${fText} es mayor que 1`];
    return fixedQ(`Sin calcular: ¿cómo es ${fText} × ${bText} comparado con ${bText}?`, reasons, reasons[want], `Multiplicar por un número menor que 1 achica; por 1, deja igual; por un número mayor que 1, agranda.`, undefined, SCALE[want]);
  }
  return fixedQ(`Sin calcular: ${fText} × ${bText} es...`, SCALE.map((s) => `${s} ${bText}`), `${SCALE[want]} ${bText}`, `${fText} es ${want === 0 ? "menor que" : want === 1 ? "igual a" : "mayor que"} 1, así que el producto es ${SCALE[want].toLowerCase()} ${bText}.`, undefined, SCALE[want]);
}

// ---------------------------------------------------------------------------
// Dividir

// La fracción como división.
export function fractionAsDivision(r: Rng, word: boolean): Question {
  for (;;) {
    const a = r.int(1, 12);
    const b = r.int(2, 9);
    if (a % b === 0) continue;
    const f: Frac = [a, b];
    const why = `${a} ÷ ${b} = ${a}/${b}${fshow(f) !== `${a}/${b}` ? ` = ${fshow(f)}` : ""}.`;
    if (word) {
      const [things, ask] = r.pick([["pizzas", "¿Qué cantidad de pizza le toca a cada uno?"], ["litros de jugo", "¿Cuántos litros le tocan a cada uno?"], ["metros de cinta", "¿Cuántos metros le tocan a cada uno?"], ["kilos de arroz", "¿Cuántos kilos le tocan a cada uno?"], ["barras de chocolate", "¿Qué cantidad de chocolate le toca a cada uno?"]]);
      return fracQ(r, `Se reparten ${a} ${things} por igual entre ${b} ${r.pick(["amigos", "vecinos", "equipos"])}. ${ask}`, f, why, undefined, a > b ? "mayor-que-1" : "menor-que-1", [[b, a], [1, b]]);
    }
    if (r.chance(0.4)) return choiceQ(r, `¿Qué división es igual a ${a}/${b}?`, `${a} ÷ ${b}`, [`${b} ÷ ${a}`, `${a} × ${b}`, `${a} − ${b}`, `${a + b} ÷ ${b}`].filter((x) => !x.includes("−") || a > b), `Una fracción es una división: el numerador entre el denominador.`, undefined, "a-division");
    return fracQ(r, "Escribe la división como fracción o número mixto.", f, why, `${a} ÷ ${b} = ?`, a > b ? "mayor-que-1" : "menor-que-1", [[b, a], [1, b]]);
  }
}

export type DivShow = "model" | "area" | "line" | "plain" | "word";

// U: dividir fracciones unitarias y números naturales.
// `dir`: "unit" = 1/d ÷ k; "whole" = k ÷ 1/d.
export function divideUnit(r: Rng, dir: "unit" | "whole" | "both", show: DivShow = "plain"): Question {
  const direction = dir === "both" ? r.pick(["unit", "whole"] as const) : dir;
  const d = r.int(2, show === "plain" || show === "word" ? 9 : 5);
  const k = r.int(2, show === "plain" || show === "word" ? 9 : 4);
  const name = r.pick(NAMES);
  if (direction === "unit") {
    const answer: Frac = [1, d * k];
    const why = `Cada 1/${d} se parte en ${k} partes iguales: 1/${d} ÷ ${k} = 1/${d} × 1/${k} = 1/${d * k}.`;
    const extra: Frac[] = [[k, d], [1, d + k], [d, k]];
    const visual: Visual | undefined = show === "model" || show === "area" ? { kind: "fracGrid", rows: k, cols: d, a: 1, b: 1 } : show === "line" ? { kind: "fractionLine", parts: d * k, marked: 1, title: `1/${d} partido en ${k}` } : undefined;
    if (show === "word") return rawQ(r, r.pick([`${name} tiene 1/${d} de kilo de queso y lo reparte por igual en ${k} platos. ¿Qué fracción de kilo va en cada plato?`, `Quedó 1/${d} de una torta y se reparte por igual entre ${k} personas. ¿Qué fracción de la torta entera recibe cada una?`, `Un trozo de 1/${d} de metro de cinta se corta en ${k} partes iguales. ¿Cuánto mide cada parte (en metros)?`]), answer, why, undefined, "unitaria-entre-natural", extra);
    return rawQ(r, visual ? `El modelo muestra 1/${d} dividido en ${k} partes iguales. ¿Cuánto es 1/${d} ÷ ${k}?` : "Divide.", answer, why, visual ?? `1/${d} ÷ ${k} = ?`, "unitaria-entre-natural", extra);
  }
  const why = `En cada entero caben ${d} partes de 1/${d}; en ${k} enteros: ${k} × ${d} = ${k * d}.`;
  const visual: Visual | undefined = show === "model" || show === "area" ? { kind: "fractionPair", hideLabels: true, items: Array.from({ length: k }, () => ({ parts: d, shaded: d })) } : show === "line" ? { kind: "fractionLine", parts: d, wholes: k } : undefined;
  if (show === "word") return numQ(k * d, r.pick([`${name} tiene ${k} kilos de arroz y arma bolsitas de 1/${d} de kilo. ¿Cuántas bolsitas arma?`, `Hay ${k} litros de jugo y cada vaso lleva 1/${d} de litro. ¿Cuántos vasos se llenan?`, `Una cinta de ${k} metros se corta en trozos de 1/${d} de metro. ¿Cuántos trozos salen?`]), undefined, why, "natural-entre-unitaria");
  return numQ(k * d, visual ? `Cada ${show === "line" ? "unidad de la recta" : "barra"} es un entero dividido en partes de 1/${d}. ¿Cuántas veces cabe 1/${d} en ${k}? (${k} ÷ 1/${d})` : "Divide.", visual ?? `${k} ÷ 1/${d} = ?`, why, "natural-entre-unitaria");
}

// Las cuatro operaciones con fracciones y números mixtos.
export function mixedOperations(r: Rng, word = false): Question {
  return r.pick([
    () => unlikeFractions(r, "mixed", word ? "word" : "plain"),
    () => mixedUnlike(r, "mixed", true, word ? "word" : "plain"),
    () => (word ? multiplyFractions(r, true) : multiplyFractions(r)),
    () => multiplyMixed(r, [["mixed", "whole"], ["mixed", "fraction"]], word ? "word" : "plain"),
    () => divideUnit(r, "both", word ? "word" : "plain"),
  ])();
}

// Problemas de varios pasos con fracciones y números mixtos.
export function fractionMultiStep(r: Rng): Question {
  return r.pick([() => mixedUnlikeMultiStep(r), () => multiplyMixed(r, [["mixed", "whole"]], "multiStep"), () => {
    const d = r.pick([2, 3, 4, 5]);
    const n = r.int(1, d - 1);
    const each = r.int(3, 12);
    const total = d * each;
    const spent = n * each;
    const more = r.int(1, each - 1);
    return numQ(total - spent - more, `${r.pick(NAMES)} tenía ${total} soles. Gastó ${n}/${d} de su dinero en un libro y luego ${more} soles en un helado. ¿Cuántos soles le quedan?`, undefined, `${n}/${d} de ${total} = ${spent}; ${total} − ${spent} − ${more} = ${total - spent - more}.`);
  }])();
}

