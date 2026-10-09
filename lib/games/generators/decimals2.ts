import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, SYMBOLS, choiceQ, d2, distinct, fixedQ, mixed, multiQ, nearCents, numQ, orderQ, soles, sym, table, words } from "./kit";

// Decimales de 4.° en adelante. Todo se calcula en centésimos (enteros) y se
// escribe con coma decimal; las respuestas decimales van como opción múltiple.

const dq = (r: Rng, prompt: string, answer: number, explanation: string, visual?: Visual | string, tag?: string, extra: number[] = []) => choiceQ(r, prompt, d2(answer), nearCents(r, answer, d2, extra), explanation, visual, tag);

// Centésimos con (o sin) parte entera; `tenths`: solo décimos.
function decimal(r: Rng, maxWhole: number, tenths = false) {
  const whole = r.int(0, maxWhole) * 100;
  return whole + (tenths ? r.int(1, 9) * 10 : r.int(1, 99));
}

// 4.° BB.2: ¿qué número decimal se muestra?
export function decimalIllustrated(r: Rng): Question {
  const h = r.chance(0.4) ? r.int(1, 9) * 10 : r.int(1, 99);
  return dq(r, "El cuadrado grande es 1 entero. ¿Qué decimal está sombreado?", h, `Hay ${h} casillas sombreadas de 100: ${h}/100 = ${d2(h)}.`, { kind: "decimalGrid", hundredths: h }, h % 10 === 0 ? "decimos" : "centesimos", [h * 10, h % 10 === 0 ? h / 10 : (h % 10) * 10 + Math.floor(h / 10)]);
}

// 4.° BB.5: rectas numéricas con centésimos.
export function hundredthsLine(r: Rng): Question {
  const base = r.int(0, 9) * 100 + r.int(0, 9) * 10;
  const k = r.int(1, 9);
  return dq(r, "¿Qué número decimal marca el punto?", base + k, `Entre ${d2(base)} y ${d2(base + 10)} hay 10 partes de 1 centésimo: el punto está en ${d2(base + k)}.`, { kind: "fractionLine", parts: 10, marked: k, labels: [d2(base) + (base % 100 === 0 ? ",0" : ""), d2(base + 10) + ((base + 10) % 100 === 0 ? ",0" : "")] }, undefined, [base + k * 10, base + 10 - k]);
}

const DEN_HUNDREDTHS: Record<number, number> = { 2: 50, 4: 25, 5: 20, 10: 10, 20: 5, 25: 4, 50: 2, 100: 1 };

// 4.° BB.6 / BB.8: fracciones y números mixtos → decimales.
export function fractionToDecimal(r: Rng, dens: number[]): Question {
  const d = r.pick(dens);
  const w = r.chance(0.4) ? r.int(1, 9) : 0;
  const n = r.int(1, d - 1);
  const h = w * 100 + n * DEN_HUNDREDTHS[d];
  const text = mixed(w * d + n, d);
  const why = d === 10 || d === 100 ? `${n}/${d} son ${n} ${d === 10 ? "décimos" : "centésimos"}: ${text} = ${d2(h)}.` : `${n}/${d} = ${n * DEN_HUNDREDTHS[d]}/100, así que ${text} = ${d2(h)}.`;
  return dq(r, `Escribe ${text} como número decimal.`, h, why, undefined, `sobre-${d}`, [w * 100 + n, w * 100 + n * 10, w * 100 + (n % 10) * 10, n * 100 + w]);
}

// 4.° BB.7: decimales → fracciones y números mixtos.
export function decimalToFraction(r: Rng): Question {
  const tenths = r.chance(0.4);
  const h = decimal(r, r.chance(0.4) ? 9 : 0, tenths);
  const w = Math.floor(h / 100);
  const rest = h % 100;
  const [n, d] = rest % 10 === 0 ? [rest / 10, 10] : [rest, 100];
  const show = (ww: number, nn: number, dd: number) => (ww ? `${ww} ${nn}/${dd}` : `${nn}/${dd}`);
  const answer = show(w, n, d);
  const wrong = [show(w, n, d === 10 ? 100 : 10), show(w, n + 1, d), show(w + 1, n, d), show(n, w || 1, d), show(w, n, 1000)].filter((x) => x !== answer);
  return choiceQ(r, `Escribe ${d2(h)} como fracción o número mixto.`, answer, wrong, `${d2(h)} tiene ${w ? `${w} ${w === 1 ? "entero" : "enteros"} y ` : ""}${n} ${d === 10 ? "décimos" : "centésimos"}: ${answer}.`, undefined, d === 10 ? "decimos" : "centesimos");
}

// 4.° CC.1: modelos de valor posicional para decimales.
export function decimalPlaceModel(r: Rng): Question {
  const u = r.int(0, 9);
  const t = r.int(0, 9);
  const c = r.int(1, 9);
  const h = u * 100 + t * 10 + c;
  return dq(r, "¿Qué número decimal muestra la tabla de valor posicional?", h, `${u} unidades, ${t} décimos y ${c} centésimos: ${d2(h)}.`, table(["Unidades", "Décimos", "Centésimos"], [[String(u), String(t), String(c)]]), undefined, [c * 100 + t * 10 + u, u * 100 + c * 10 + t, t * 100 + u * 10 + c]);
}

// 4.° CC.3: relacionar decimales y dinero.
export function decimalsAndMoney(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const k = r.int(1, 9);
    const coin = r.pick([10, 1]);
    return dq(r, coin === 10 ? `${k} monedas de 10 céntimos, ¿cuántos soles son? (1 sol = 100 céntimos)` : `${k} céntimos, ¿qué parte de un sol son? (1 sol = 100 céntimos)`, k * coin, coin === 10 ? `10 céntimos = 0,1 sol; ${k} × 0,1 = ${d2(k * 10)}.` : `1 céntimo = 0,01 sol; ${k} céntimos = ${d2(k)}.`, undefined, coin === 10 ? "decimos" : "centesimos", [k * (coin === 10 ? 1 : 10), k * 100]);
  }
  const h = r.int(1, 20) * 100 + r.int(1, 99);
  if (form === 1) return numQ(h % 100, `${soles(h)} son ${Math.floor(h / 100)} soles y ¿cuántos céntimos?`, undefined, `La parte decimal son los céntimos: ${h % 100}.`, "centimos");
  return numQ(h, `¿Cuántos céntimos son ${soles(h)}?`, undefined, `1 sol = 100 céntimos: ${Math.floor(h / 100)} × 100 + ${h % 100} = ${h} céntimos.`, "a-centimos");
}

function decimalWords(h: number) {
  const w = Math.floor(h / 100);
  const rest = h % 100;
  const [n, unit] = rest % 10 === 0 ? [rest / 10, "décimo"] : [rest, "centésimo"];
  const frac = `${words(n).replace(/uno$/, "un")} ${unit}${n === 1 ? "" : "s"}`;
  return w ? `${words(w).replace(/uno$/, "un")} ${w === 1 ? "entero" : "enteros"} y ${frac}` : frac;
}

// 4.° CC.5: decimales escritos con palabras.
export function decimalInWords(r: Rng): Question {
  const h = decimal(r, r.chance(0.5) ? 9 : 0, r.chance(0.35));
  const rest = h % 100;
  const w = Math.floor(h / 100) * 100;
  if (r.chance(0.5)) return dq(r, `¿Qué número decimal es «${decimalWords(h)}»?`, h, `«${decimalWords(h)}» se escribe ${d2(h)}.`, undefined, "a-cifras", rest % 10 === 0 ? [w + rest / 10, w * 10 + rest] : [w + rest * 10, w + (rest % 10) * 10 + Math.floor(rest / 10), w * 10 + rest]);
  const wrongValues = [rest % 10 === 0 ? w + rest / 10 : w + (rest % 10) * 10 + Math.floor(rest / 10), w + 100 + rest, rest >= 10 && rest % 10 !== 0 ? w + Math.floor(rest / 10) * 10 : w + ((rest + 10) % 100 || 10), w + ((rest + 1) % 100 || 2)].filter((x) => x !== h && x > 0);
  return choiceQ(r, `¿Cómo se lee ${d2(h)}?`, decimalWords(h), [...new Set(wrongValues)].map(decimalWords), `${d2(h)} se lee «${decimalWords(h)}».`, undefined, "a-palabras");
}

// Dos decimales parecidos (pueden tener distinta cantidad de cifras decimales).
function closeDecimals(r: Rng, tenthsOnly = false): [number, number] {
  const a = decimal(r, 9, tenthsOnly);
  if (r.chance(0.12)) return [a, a];
  const b = tenthsOnly ? Math.floor(a / 100) * 100 + r.int(1, 9) * 10 : r.pick([a + r.pick([-1, 1]) * r.int(1, 9), a + r.pick([-1, 1]) * 10 * r.int(1, 9), Math.floor(a / 100) * 100 + r.int(1, 9) * 10]);
  return [a, b > 0 ? b : a + 3];
}

// 4.° CC.6: comparar decimales con modelos (barras de décimos).
export function compareDecimalModels(r: Rng): Question {
  const a = r.int(1, 9);
  const b = r.chance(0.15) ? a : r.int(1, 9);
  const s = sym(a, b);
  return fixedQ(`Cada barra es 1 entero dividido en 10 décimos. Elige el símbolo: 0,${a} ? 0,${b}`, SYMBOLS, s, `0,${a} son ${a} décimos y 0,${b} son ${b} décimos: 0,${a} ${s} 0,${b}.`, { kind: "fractionPair", hideLabels: true, items: [{ parts: 10, shaded: a }, { parts: 10, shaded: b }] }, s);
}

// 4.° CC.8: comparar números decimales.
export function compareDecimals(r: Rng): Question {
  const [a, b] = closeDecimals(r);
  const s = sym(a, b);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, s === "=" ? "Los dos números son iguales." : `Comparamos enteros, luego décimos y luego centésimos: ${d2(a)} ${s} ${d2(b)}.`, `${d2(a)}  ?  ${d2(b)}`, s);
}

// 4.° CC.10 / CC.11: ordenar decimales (`level` 1: décimos; 2: décimos y centésimos mezclados).
export function orderDecimals2(r: Rng, level: 1 | 2): Question {
  const whole = r.int(0, 9) * 100;
  const values = level === 1 ? distinct(r, 3, 1, 29).map((t) => whole + t * 10) : distinct(r, 4, 1, 99).map((x) => whole + (x % 3 === 0 ? Math.floor(x / 10) * 10 || 10 : x));
  const unique = [...new Set(values)];
  if (unique.length < 3) return orderDecimals2(r, level);
  const ascending = r.chance(0.6);
  const sorted = [...unique].sort((a, b) => (ascending ? a - b : b - a));
  return orderQ(r, `Ordena los decimales de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`, sorted.map(d2), `El orden correcto es ${sorted.map(d2).join(" ; ")}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
}

// 4.° DD.1: un décimo o un centésimo más o menos.
export function tenthHundredthMoreLess(r: Rng): Question {
  const h = r.int(1, 9) * 100 + r.int(11, 89);
  const step = r.pick([10, 1]);
  const more = r.chance(0.5);
  const answer = more ? h + step : h - step;
  return dq(r, `¿Qué número es un ${step === 10 ? "décimo" : "centésimo"} ${more ? "más" : "menos"} que ${d2(h)}?`, answer, `${d2(h)} ${more ? "+" : "−"} ${step === 10 ? "0,1" : "0,01"} = ${d2(answer)}.`, undefined, step === 10 ? "decimo" : "centesimo", [more ? h - step : h + step, more ? h + (step === 10 ? 1 : 10) : h - (step === 10 ? 1 : 10), more ? h + 100 : h - 100]);
}

// 4.° DD.2 / DD.4: sumar y restar decimales con bloques (cuadrícula de centésimos).
export function addSubDecimalBlocks(r: Rng, op: "+" | "−"): Question {
  if (op === "+") {
    const a = r.int(5, 80);
    const b = r.int(5, 95 - a);
    return dq(r, `El cuadrado grande es 1 entero. Usa el modelo para sumar: ${d2(a)} + ${d2(b)}`, a + b, `${a} centésimos + ${b} centésimos = ${a + b} centésimos = ${d2(a + b)}.`, { kind: "decimalGrid", hundredths: a, extra: b }, "suma", [a + b * 10, Math.abs(a - b) || 1]);
  }
  const a = r.int(20, 99);
  const b = r.int(5, a - 5);
  return dq(r, `El cuadrado grande es 1 entero. Usa el modelo para restar: ${d2(a)} − ${d2(b)}`, a - b, `${a} centésimos − ${b} centésimos = ${a - b} centésimos = ${d2(a - b)}.`, { kind: "decimalGrid", hundredths: a, crossed: b }, "resta", [a + b, b]);
}

// Dos sumandos (o minuendo y sustraendo) en centésimos.
function operands(r: Rng, op: "+" | "−", maxWhole = 20): [number, number] {
  const a = r.int(1, maxWhole) * 100 + r.int(0, 99);
  const b = r.int(0, maxWhole - 1) * 100 + r.int(1, 99);
  return op === "−" && a <= b ? [b + r.int(50, 300), b] : [a, b];
}

// 4.° DD.7 / DD.10: problemas de suma y resta con decimales.
export function decimalProblem(r: Rng, several: boolean): Question {
  const name = r.pick(NAMES);
  if (several) {
    const xs = Array.from({ length: 3 }, () => r.int(1, 12) * 100 + r.int(1, 99));
    const total = xs.reduce((a, b) => a + b, 0);
    const [a, b, c] = xs.map(d2);
    return dq(r, r.pick([`${name} corrió ${a} km el lunes, ${b} km el miércoles y ${c} km el viernes. ¿Cuántos kilómetros corrió en total?`, `Tres paquetes pesan ${a} kg, ${b} kg y ${c} kg. ¿Cuánto pesan juntos?`, `${name} usó ${a} m, ${b} m y ${c} m de cinta en tres regalos. ¿Cuántos metros usó en total?`]), total, `${a} + ${b} + ${c} = ${d2(total)}.`);
  }
  const op = r.pick(["+", "−"] as const);
  const [x, y] = operands(r, op, 12);
  const [a, b] = [d2(x), d2(y)];
  const answer = op === "+" ? x + y : x - y;
  const text = op === "+" ? r.pick([`${name} caminó ${a} km en la mañana y ${b} km en la tarde. ¿Cuántos kilómetros caminó?`, `Una sandía pesa ${a} kg y un melón pesa ${b} kg. ¿Cuánto pesan juntos?`]) : r.pick([`Una cuerda mide ${a} m y se cortan ${b} m. ¿Cuántos metros quedan?`, `Un bidón tenía ${a} litros y se usaron ${b} litros. ¿Cuántos litros quedan?`]);
  return dq(r, text, answer, `${a} ${op} ${b} = ${d2(answer)}.`, undefined, op === "+" ? "suma" : "resta", [op === "+" ? Math.abs(x - y) || 1 : x + y]);
}

// 4.° DD.6: sumar y restar decimales con distinta cantidad de cifras decimales.
export function addSubDecimals2(r: Rng, op: "+" | "−" | "mixed"): Question {
  const o = op === "mixed" ? r.pick(["+", "−"] as const) : op;
  const [x, y0] = operands(r, o);
  const y = r.chance(0.4) ? Math.max(10, Math.round(y0 / 10) * 10) : y0;
  const [a, b] = o === "−" && x <= y ? [y + 150, y] : [x, y];
  const answer = o === "+" ? a + b : a - b;
  return dq(r, "Resuelve. Alinea las comas antes de operar.", answer, `${d2(a)} ${o} ${d2(b)} = ${d2(answer)}.`, `${d2(a)} ${o} ${d2(b)} = ?`, o === "+" ? "suma" : "resta", [o === "+" ? a + b / 10 : a - b / 10].filter(Number.isInteger));
}

// 4.° DD.8: elegir decimales con una suma o diferencia dada.
export function chooseDecimals(r: Rng): Question {
  for (;;) {
    const add = r.chance(0.5);
    const all = distinct(r, 5, 5, 95).map((x) => x * 10);
    const [a, b] = all;
    const target = add ? a + b : Math.abs(a - b);
    let pairs = 0;
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if ((add ? all[i] + all[j] : Math.abs(all[i] - all[j])) === target) pairs++;
    if (pairs !== 1 || all.length < 5) continue;
    return multiQ(`Selecciona los dos números cuya ${add ? "suma" : "diferencia"} es ${d2(target)}.`, r.shuffle(all).map(d2), [d2(a), d2(b)], `${d2(Math.max(a, b))} ${add ? "+" : "−"} ${d2(Math.min(a, b))} = ${d2(target)}.`, undefined, add ? "suma" : "diferencia");
  }
}

// 4.° DD.9: sumar tres o más decimales.
export function addSeveralDecimals(r: Rng): Question {
  const xs = Array.from({ length: r.int(3, 4) }, () => (r.chance(0.5) ? r.int(1, 99) * 10 : r.int(101, 999)));
  const total = xs.reduce((a, b) => a + b, 0);
  return dq(r, "Resuelve la suma.", total, `${xs.map(d2).join(" + ")} = ${d2(total)}.`, `${xs.map(d2).join(" + ")} = ?`, `${xs.length}-sumandos`);
}

// 4.° DD.11: completar la suma o la resta.
export function completeDecimalSentence(r: Rng): Question {
  const op = r.pick(["+", "−"] as const);
  const [a, b] = operands(r, op, 9);
  const c = op === "+" ? a + b : a - b;
  const hideFirst = r.chance(0.5);
  return dq(r, "¿Qué número falta?", hideFirst ? a : b, `${d2(a)} ${op} ${d2(b)} = ${d2(c)}.`, hideFirst ? `? ${op} ${d2(b)} = ${d2(c)}` : `${d2(a)} ${op} ? = ${d2(c)}`, op === "+" ? "suma" : "resta", [op === "+" ? c + (hideFirst ? b : a) : hideFirst ? Math.abs(c - b) || 5 : a + c]);
}

// 4.° DD.12: inecuaciones con sumas y restas de decimales.
export function decimalInequality(r: Rng): Question {
  const op = r.pick(["+", "−"] as const);
  const [a, b] = operands(r, op, 9);
  const v = op === "+" ? a + b : a - b;
  const other = r.chance(0.2) ? v : Math.max(1, v + r.pick([-1, 1]) * r.pick([1, 10, 20, 100]));
  const s = sym(v, other);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${d2(a)} ${op} ${d2(b)} = ${d2(v)}, y ${d2(v)} ${s} ${d2(other)}.`, `${d2(a)} ${op} ${d2(b)}  ?  ${d2(other)}`, s);
}

// 4.° DD.13: resolver problemas de decimales con diagramas de tiras.
export function decimalDiagram(r: Rng): Question {
  const a = r.int(1, 9) * 100 + r.int(1, 9) * 10;
  const b = r.int(1, 9) * 100 + r.int(1, 9) * 10;
  const total = a + b;
  const hideTotal = r.chance(0.4);
  const visual: Visual = { kind: "strip", total: hideTotal ? "?" : d2(total), bars: [{ parts: [{ text: d2(a), w: Math.max(2, Math.round(a / 100)) }, { text: hideTotal ? d2(b) : "?", w: Math.max(2, Math.round(b / 100)) }] }] };
  return hideTotal ? dq(r, "Mira el diagrama. ¿Cuál es el total?", total, `${d2(a)} + ${d2(b)} = ${d2(total)}.`, visual, "total", [Math.abs(a - b) || 10]) : dq(r, "Mira el diagrama. ¿Qué número falta?", b, `${d2(total)} − ${d2(a)} = ${d2(b)}.`, visual, "parte", [total + a]);
}

// 4.° DD.14: secuencias numéricas con decimales.
export function decimalSequence(r: Rng): Question {
  const step = r.pick([10, 20, 50, 5, 25, 30, 15]);
  const up = r.chance(0.6);
  const start = up ? r.int(1, 60) * 10 : step * 5 + r.int(1, 60) * 10;
  const terms = Array.from({ length: 5 }, (_, i) => start + (up ? i : -i) * step);
  return dq(r, "¿Qué número sigue en la secuencia?", terms[4], `Cada número ${up ? "aumenta" : "disminuye"} ${d2(step)}: sigue ${d2(terms[4])}.`, `${terms.slice(0, 4).map(d2).join("   ")}   ?`, up ? "creciente" : "decreciente", [terms[3] + (up ? 1 : -1) * step * 10, terms[3] + (up ? -1 : 1) * step]);
}
