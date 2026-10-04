import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { COUNTABLES, uniqueOptions } from "./common";

// Matemáticas de Inicial (5 años), según la lista de IXL Kindergarten. Los
// niños de esta edad todavía no leen con soltura: las respuestas se eligen
// tocando (no se escribe, salvo en los juegos de "escribir el número"), y el
// currículo agrega el botón 🔊 a cada pregunta. Los rangos son parámetros.

const UNITS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
const TENS = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien"];
const TWENTIES = ["veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];

export function numberWord(n: number): string {
  if (n <= 20) return UNITS[n];
  if (n < 30) return TWENTIES[n - 20];
  if (n === 100) return "cien";
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? TENS[t] : `${TENS[t]} y ${UNITS[u]}`;
}

const SHAPES = ["🔵", "🟥", "🔺", "⭐", "🟢", "🟨", "🟣", "🟧"];
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

// Opciones numéricas cercanas a la respuesta, de menor a mayor.
function nopts(r: Rng, answer: number, lo: number, hi: number, count = 4): string[] {
  const set = new Set<number>([answer]);
  const near = r.shuffle([-3, -2, -1, 1, 2, 3].map((d) => answer + d).filter((x) => x >= lo && x <= hi));
  for (const x of near) if (set.size < count) set.add(x);
  for (let x = lo; x <= hi && set.size < count; x++) set.add(x);
  return [...set].sort((a, b) => a - b).map(String);
}

function numQ(r: Rng, prompt: string, answer: number, lo: number, hi: number, visual: Visual | undefined, explanation: string, tag?: string): Question {
  return { kind: "choice", prompt, visual, options: nopts(r, answer, lo, hi), answer: String(answer), explanation, tag };
}

function pickQ(r: Rng, prompt: string, answer: string, distractors: string[], explanation: string, visual?: Visual, tag?: string): Question {
  return { kind: "choice", prompt, visual, options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)), answer, explanation, tag };
}

const yesNo = (prompt: string, yes: boolean, explanation: string, visual?: Visual): Question => ({ kind: "choice", prompt, visual, options: ["Sí", "No"], answer: yes ? "Sí" : "No", explanation });

// Posiciones sin encimarse: celdas de una cuadrícula de 5 × 5, con algo de desorden.
function scatterAt(r: Rng, emojis: string[]): { emoji: string; x: number; y: number }[] {
  const cells = r.shuffle(Array.from({ length: 25 }, (_, i) => i)).slice(0, emojis.length);
  return emojis.map((emoji, i) => ({ emoji, x: (cells[i] % 5) * 22 + r.int(2, 10), y: Math.floor(cells[i] / 5) * 22 + r.int(2, 10) }));
}

function ringAt(emojis: string[]): { emoji: string; x: number; y: number }[] {
  return emojis.map((emoji, i) => {
    const a = (i / emojis.length) * 2 * Math.PI - Math.PI / 2;
    return { emoji, x: 50 + 42 * Math.cos(a), y: 50 + 42 * Math.sin(a) };
  });
}

const frameOf = (n: number, five: boolean): Visual => ({ kind: "frame", size: five ? 5 : 10, counts: five ? [n] : n <= 10 ? [n] : [...Array(Math.floor(n / 10)).fill(10), ...(n % 10 ? [n % 10] : [])] });

// ---------------------------------------------------------------------------
// Números: reconocer, nombrar y escribir
// ---------------------------------------------------------------------------

export function idNumber(r: Rng, lo: number, hi: number, heard: boolean): Question {
  const n = r.int(lo, hi);
  return {
    kind: "choice",
    prompt: heard ? "Toca 🔊 y elige el número que escuchas." : `¿Cuál es el número ${numberWord(n)}?`,
    options: nopts(r, n, lo, hi),
    answer: String(n),
    explanation: `El número ${numberWord(n)} se escribe ${n}.`,
    speak: heard ? numberWord(n) : `¿Cuál es el número ${numberWord(n)}?`,
    tag: String(n),
  };
}

export function numberName(r: Rng, hi: number): Question {
  const n = r.int(hi > 10 ? 11 : 0, hi);
  const lo = hi > 10 ? 11 : 0;
  if (r.chance(0.5)) {
    return pickQ(r, "¿Cómo se llama este número?", numberWord(n), nopts(r, n, lo, hi).map((x) => numberWord(Number(x))), `${n} se lee «${numberWord(n)}».`, { kind: "text", text: String(n) });
  }
  return { kind: "choice", prompt: `¿Qué número es «${numberWord(n)}»?`, options: nopts(r, n, lo, hi), answer: String(n), explanation: `«${numberWord(n)}» se escribe ${n}.` };
}

export function writeHeard(r: Rng, hi: number): Question {
  const n = r.int(hi > 20 ? 21 : 0, hi);
  return { kind: "number", prompt: "Toca 🔊 y escribe el número que escuchas.", answer: n, explanation: `Era el ${n}: «${numberWord(n)}».`, speak: numberWord(n) };
}

// ---------------------------------------------------------------------------
// Contar
// ---------------------------------------------------------------------------

export type CountStyle = "pictures" | "learn" | "shapes" | "cubes" | "frame" | "dots" | "scatter" | "scatterShapes" | "ring" | "blocks" | "array" | "tens";

export function count(r: Rng, lo: number, hi: number, style: CountStyle): Question {
  if (style === "tens") {
    const g = r.int(Math.max(1, Math.ceil(lo / 10)), Math.floor(hi / 10));
    return { kind: "choice", prompt: "Cada grupo tiene 10. ¿Cuántos hay en total?", visual: { kind: "equalGroups", emoji: r.pick(COUNTABLES), groups: g, each: 10 }, options: nopts(r, g, 1, 10).map((x) => String(Number(x) * 10)), answer: String(g * 10), explanation: `${g} grupos de 10 son ${g * 10}.` };
  }
  const n = r.int(lo, hi);
  const emoji = style === "shapes" || style === "scatterShapes" || style === "ring" ? r.pick(SHAPES) : style === "dots" ? "⚫" : r.pick(COUNTABLES);
  let visual: Visual;
  if (style === "cubes") visual = { kind: "cubes", groups: [n] };
  else if (style === "frame") visual = frameOf(n, hi <= 5);
  else if (style === "dots" || style === "scatter" || style === "scatterShapes") visual = { kind: "scatter", items: scatterAt(r, Array(n).fill(emoji)) };
  else if (style === "ring") visual = { kind: "scatter", items: ringAt(Array(n).fill(emoji)) };
  else if (style === "blocks") visual = { kind: "placeValue", tens: Math.floor(n / 10), ones: n % 10 };
  else if (style === "array") visual = { kind: "rows", rows: [...Array(Math.floor(n / 5)).fill(5), ...(n % 5 ? [n % 5] : [])].map((c) => ({ emoji, count: c })) };
  else visual = { kind: "objects", emoji, count: n, numbered: style === "learn" };
  const what = style === "cubes" ? "¿Cuántos cubos hay?" : style === "dots" ? "¿Cuántos puntos hay?" : style === "frame" ? "¿Cuántas fichas hay?" : style === "blocks" ? "¿Cuántos cubitos hay?" : "¿Cuántos hay?";
  return numQ(r, what, n, lo, hi, visual, n === 0 ? "No hay ninguno: cero." : `Contamos uno por uno: hay ${n}.`, String(n));
}

export type ShowStyle = "cubes" | "frame" | "stickers";

// Mostrar una cantidad tocando casillas.
export function show(r: Rng, lo: number, hi: number, style: ShowStyle): Question {
  const n = r.int(Math.max(1, lo), hi);
  const parts = hi <= 5 ? 5 : hi <= 10 ? 10 : 20;
  const shape = style === "frame" || parts > 10 || (style === "stickers" && parts === 10) ? "area" : "bar";
  const prompt = style === "cubes" ? `Arma un tren de ${n} cubos. Toca ${n} casillas.` : style === "frame" ? `Muestra el número ${n} en el marco. Toca ${n} casillas.` : `Pon ${n} stickers. Toca ${n} casillas.`;
  return { kind: "shade", prompt, shape, parts, answer: n, explanation: `Hay que marcar ${n} casillas.`, tag: String(n) };
}

// ¿Qué dibujo muestra el número?
export function represent(r: Rng, lo: number, hi: number, style: "pictures" | "shapes"): Question {
  const n = r.int(lo, hi);
  const emoji = style === "shapes" ? r.pick(SHAPES) : r.pick(COUNTABLES);
  const draw = (k: number) => (k === 0 ? "ninguno" : k > 10 ? `${emoji.repeat(10)} ${emoji.repeat(k - 10)}` : emoji.repeat(k));
  return { kind: "choice", prompt: `¿Qué dibujo muestra el número ${n}?`, options: r.shuffle(nopts(r, n, lo, hi).map((x) => draw(Number(x)))), answer: draw(n), explanation: `El dibujo correcto tiene ${n}.`, tag: String(n) };
}

// ---------------------------------------------------------------------------
// Orden y secuencia
// ---------------------------------------------------------------------------

export type NextMode = "next" | "countUp" | "upDown" | "forward" | "backward" | "both";

export function nextNumber(r: Rng, hi: number, mode: NextMode): Question {
  const down = mode === "backward" || ((mode === "upDown" || mode === "both") && r.chance(0.5));
  const len = mode === "next" ? 1 : mode === "countUp" || mode === "upDown" ? 2 : Math.min(4, hi - 1);
  const start = down ? r.int(len + 1, hi) : r.int(hi > 10 ? Math.max(0, hi - 30) : 0, hi - len);
  const shown = Array.from({ length: len }, (_, i) => start + (down ? -i : i));
  const answer = start + (down ? -len : len);
  return numQ(r, down ? "Cuenta hacia atrás. ¿Qué número sigue?" : "¿Qué número sigue?", answer, Math.max(0, answer - 3), Math.min(hi + 1, answer + 3), { kind: "text", text: `${shown.join("  ")}  ?` }, down ? `Hacia atrás, después de ${shown[len - 1]} viene ${answer}.` : `Después de ${shown[len - 1]} viene ${answer}.`, down ? "atras" : "adelante");
}

export function orderK(r: Rng, lo: number, hi: number, count: number): Question {
  const nums = r.shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, count);
  const sorted = [...nums].sort((a, b) => a - b);
  let tiles = nums.map(String);
  if (tiles.every((t, i) => t === String(sorted[i]))) tiles = [...tiles.slice(1), tiles[0]];
  return { kind: "sequence", prompt: "Ordena los números de menor a mayor. Tócalos en orden.", tiles, reuse: false, length: count, answer: sorted.map(String), explanation: `El orden es ${sorted.join(", ")}.` };
}

const ORDINALS = ["primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno", "décimo"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐸", "🐷", "🐮", "🐵", "🐔", "🦊", "🐢"];

export function ordinal(r: Rng, max: number): Question {
  const n = Math.min(max, r.int(4, max <= 5 ? 5 : 7));
  const row = r.shuffle(ANIMALS).slice(0, n);
  const i = r.int(0, Math.min(max, n) - 1);
  return pickQ(r, `La fila empieza en la 🏁. ¿Quién está ${ORDINALS[i]}?`, row[i], row, `Contando desde la bandera, el ${ORDINALS[i]} es ${row[i]}.`, { kind: "pattern", items: ["🏁", ...row] }, ORDINALS[i]);
}

export type MoreLessStyle = "pictures" | "frame" | "numbers";

export function oneMoreLess(r: Rng, hi: number, delta: 1 | -1 | 0, style: MoreLessStyle): Question {
  const d = delta === 0 ? r.pick([1, -1] as const) : delta;
  const n = d === 1 ? r.int(hi > 10 ? 10 : 0, hi - 1) : r.int(hi > 10 ? 11 : 1, hi);
  const visual: Visual = style === "pictures" ? { kind: "objects", emoji: r.pick(COUNTABLES), count: n } : style === "frame" ? frameOf(n, hi <= 5) : { kind: "text", text: String(n) };
  const prompt = style === "numbers" ? `¿Qué número es uno ${d === 1 ? "más" : "menos"} que ${n}?` : `Cuenta. ¿Cuánto es uno ${d === 1 ? "más" : "menos"}?`;
  return numQ(r, prompt, n + d, Math.max(0, n - 3), n + 3, visual, `Uno ${d === 1 ? "más" : "menos"} que ${n} es ${n + d}.`, d === 1 ? "uno-mas" : "uno-menos");
}

export function beforeAfterBetween(r: Rng, hi: number): Question {
  const form = r.int(0, 2);
  const n = r.int(hi > 10 ? 11 : 1, hi - 1);
  if (form === 0) return numQ(r, `¿Qué número va justo antes de ${n}?`, n - 1, Math.max(0, n - 4), n + 2, { kind: "text", text: `?  ${n}` }, `Antes de ${n} va ${n - 1}.`, "antes");
  if (form === 1) return numQ(r, `¿Qué número va justo después de ${n}?`, n + 1, Math.max(0, n - 2), n + 4, { kind: "text", text: `${n}  ?` }, `Después de ${n} va ${n + 1}.`, "despues");
  return numQ(r, `¿Qué número va entre ${n - 1} y ${n + 1}?`, n, Math.max(0, n - 3), n + 3, { kind: "text", text: `${n - 1}  ?  ${n + 1}` }, `Entre ${n - 1} y ${n + 1} va ${n}.`, "entre");
}

export function numberLineK(r: Rng, max: number): Question {
  const min = max <= 10 ? 0 : max - 20 < 0 ? 0 : max - 20;
  const n = r.int(min + 1, max - 1);
  return { kind: "choice", prompt: "¿Qué número marca el punto?", visual: { kind: "numberLine", min, max, step: 1, labelEvery: max <= 10 ? 10 : 5, marked: n }, options: nopts(r, n, min, max), answer: String(n), explanation: `El punto está en el ${n}.` };
}

export function chartCount(r: Rng, max: number, next: boolean): Question {
  const n = r.int(2, max - 1);
  const blank = next ? Array.from({ length: max - n + 1 }, (_, i) => n + i) : [n];
  return { kind: "choice", prompt: next ? "Sigue contando. ¿Qué número va en la casilla verde?" : "¿Qué número falta en la tabla?", visual: { kind: "hundredsChart", blank, highlight: n, max }, options: nopts(r, n, 1, max), answer: String(n), explanation: `Después de ${n - 1} viene ${n}.` };
}

export function fillFrame(r: Rng): Question {
  const n = r.int(1, 9);
  return numQ(r, "¿Cuántas fichas faltan para llenar el marco de diez?", 10 - n, 0, 10, { kind: "frame", size: 10, counts: [n] }, `Hay ${n} fichas; faltan ${10 - n} para llegar a 10.`);
}

export function sequenceK(r: Rng, max: number, step: 1 | 10, increasingOnly: boolean): Question {
  const up = increasingOnly || r.chance(0.5);
  const len = 5;
  const lo = step === 10 ? 10 : max > 10 ? Math.max(0, max - 30) : 0;
  const first = step === 10 ? r.int(1, Math.max(1, max / 10 - len + 1)) * 10 : r.int(lo, max - len + 1);
  const seq = Array.from({ length: len }, (_, i) => first + i * step);
  if (!up) seq.reverse();
  const hidden = r.int(1, len - 1);
  const text = seq.map((x, i) => (i === hidden ? "?" : String(x))).join("  ");
  const k = seq[hidden] / step;
  const options = nopts(r, k, Math.max(step === 10 ? 1 : 0, k - 3), k + 3).map((x) => String(Number(x) * step));
  return { kind: "choice", prompt: "Completa la secuencia. ¿Qué número falta?", visual: { kind: "text", text }, options, answer: String(seq[hidden]), explanation: `La secuencia va de ${step} en ${step}: falta el ${seq[hidden]}.`, tag: up ? "creciente" : "decreciente" };
}

export function tens(r: Rng, mode: "learn" | "skip" | "groups" | "forward"): Question {
  if (mode === "groups") {
    const g = r.int(1, 10);
    return { kind: "choice", prompt: "Cada barra tiene 10 cubitos. ¿Cuántos cubitos hay?", visual: { kind: "placeValue", tens: g, ones: 0 }, options: nopts(r, g, 1, 10).map((x) => String(Number(x) * 10)), answer: String(g * 10), explanation: `${g} barras de 10 son ${g * 10}.` };
  }
  if (mode === "learn") {
    const g = r.int(2, 9);
    const seq = Array.from({ length: g }, (_, i) => (i + 1) * 10);
    return { kind: "choice", prompt: "Cada barra tiene 10. Cuenta de 10 en 10: 10, 20, 30… ¿Qué número dices al llegar a la última barra?", visual: { kind: "placeValue", tens: g, ones: 0 }, options: nopts(r, g, 1, 10).map((x) => String(Number(x) * 10)), answer: String(g * 10), explanation: `${seq.join(", ")}.` };
  }
  if (mode === "forward") {
    const g = r.int(1, 7);
    return { kind: "choice", prompt: "Cuenta de 10 en 10. ¿Qué número sigue?", visual: { kind: "text", text: `${g * 10}  ${g * 10 + 10}  ${g * 10 + 20}  ?` }, options: nopts(r, g + 3, 1, 10).map((x) => String(Number(x) * 10)), answer: String(g * 10 + 30), explanation: `Después de ${g * 10 + 20} viene ${g * 10 + 30}.` };
  }
  return sequenceK(r, 100, 10, true);
}

// ---------------------------------------------------------------------------
// Comparar
// ---------------------------------------------------------------------------

function twoGroups(r: Rng, max: number, pEqual: number) {
  const [e1, e2] = r.shuffle(COUNTABLES).slice(0, 2);
  const a = r.int(1, max);
  const equal = r.chance(pEqual);
  let b = r.int(1, max);
  while (b === a) b = r.int(1, max);
  if (equal) b = a;
  return { e1, e2, a, b, visual: { kind: "rows", rows: [{ emoji: e1, count: a }, { emoji: e2, count: b }] } as Visual };
}

export function sameNumber(r: Rng, max: number): Question {
  const g = twoGroups(r, max, 0.5);
  return yesNo("¿Hay la misma cantidad en las dos filas?", g.a === g.b, g.a === g.b ? `Sí: hay ${g.a} y ${g.b}.` : `No: hay ${g.a} y ${g.b}.`, g.visual);
}

export function showEqual(r: Rng, max: number): Question {
  const n = r.int(1, max);
  return { kind: "shade", prompt: `Cuenta: ${r.pick(COUNTABLES).repeat(n)}. Toca la misma cantidad de casillas.`, shape: max <= 5 ? "bar" : "area", parts: max <= 5 ? 5 : 10, answer: n, explanation: `Hay ${n}: se marcan ${n} casillas.` };
}

export type CompareAsk = "more" | "fewer" | "both" | "same";

export function matchCompare(r: Rng, max: number, ask: CompareAsk, layout: "match" | "count" | "mixed" = "match"): Question {
  const g = twoGroups(r, max, ask === "same" ? 0.3 : 0);
  const wantMore = ask === "more" || ((ask === "both" || ask === "same") && r.chance(0.5));
  const visual: Visual = layout === "mixed" ? { kind: "scatter", items: scatterAt(r, r.shuffle([...Array(g.a).fill(g.e1), ...Array(g.b).fill(g.e2)])) } : layout === "count" ? { kind: "box", inside: Array(g.a).fill(g.e1), outside: Array(g.b).fill(g.e2) } : g.visual;
  const same = "Hay igual";
  const answer = g.a === g.b ? same : (wantMore ? g.a > g.b : g.a < g.b) ? g.e1 : g.e2;
  return { kind: "choice", prompt: wantMore ? "¿De cuál hay más?" : "¿De cuál hay menos?", visual, options: ask === "same" ? [g.e1, g.e2, same] : [g.e1, g.e2], answer, explanation: `Hay ${g.a} ${g.e1} y ${g.b} ${g.e2}.`, tag: wantMore ? "mas" : "menos" };
}

export function matchNumbers(r: Rng, max: number, ask: "greater" | "less" | "both"): Question {
  const a = r.int(1, max);
  let b = r.int(1, max);
  while (b === a) b = r.int(1, max);
  const greater = ask === "greater" || (ask === "both" && r.chance(0.5));
  const emoji = r.pick(SHAPES);
  const answer = greater ? Math.max(a, b) : Math.min(a, b);
  return { kind: "choice", prompt: greater ? "¿Qué número es mayor?" : "¿Qué número es menor?", visual: { kind: "rows", rows: [{ emoji, count: a, label: String(a) }, { emoji, count: b, label: String(b) }] }, options: [String(a), String(b)], answer: String(answer), explanation: `${Math.max(a, b)} es mayor que ${Math.min(a, b)}.`, tag: greater ? "mayor" : "menor" };
}

const PAIRS: [string, string, string, string][] = [["🥣", "🥄", "platos", "cucharas"], ["🐶", "🦴", "perros", "huesos"], ["🧒", "🎈", "niños", "globos"], ["🐰", "🥕", "conejos", "zanahorias"], ["🌸", "🐝", "flores", "abejas"]];

export function enough(r: Rng, max: number): Question {
  const [e1, e2, n1, n2] = r.pick(PAIRS);
  const a = r.int(1, max);
  const b = Math.max(1, Math.min(max, a + r.pick([-2, -1, 0, 1])));
  return yesNo(`¿Hay suficientes ${n2} para todos los ${n1}?`, b >= a, b >= a ? `Sí: hay ${a} ${n1} y ${b} ${n2}.` : `No: hay ${a} ${n1} y solo ${b} ${n2}.`, { kind: "rows", rows: [{ emoji: e1, count: a }, { emoji: e2, count: b }] });
}

const GLE = ["es mayor que", "es menor que", "es igual a"];

export function gleCount(r: Rng, max: number): Question {
  const g = twoGroups(r, max, 0.3);
  const answer = g.a > g.b ? GLE[0] : g.a < g.b ? GLE[1] : GLE[2];
  return { kind: "choice", prompt: `Cuenta. ${g.a} ___ ${g.b}`, visual: g.visual, options: GLE, answer, explanation: `${g.a} ${answer} ${g.b}.` };
}

export function compareTwo(r: Rng, max: number): Question {
  const lo = max > 10 ? max - 10 : 0;
  const a = r.int(lo, max);
  const b = r.chance(0.25) ? a : r.int(lo, max);
  const answer = a > b ? GLE[0] : a < b ? GLE[1] : GLE[2];
  return { kind: "choice", prompt: `${a} ___ ${b}`, options: GLE, answer, explanation: `${a} ${answer} ${b}.` };
}

// Elegir un número mayor, menor o igual que otro (con o sin dibujos).
export function showGLE(r: Rng, max: number, pictures: boolean): Question {
  const n = r.int(2, max - 1);
  const rel = r.pick(["mayor", "menor", "igual"] as const);
  const answer = rel === "igual" ? n : rel === "mayor" ? r.int(n + 1, max) : r.int(max > 10 ? Math.max(0, n - 6) : 0, n - 1);
  const wrong = Array.from({ length: max + 1 }, (_, i) => i).filter((x) => (rel === "igual" ? x !== n : rel === "mayor" ? x <= n : x >= n) && Math.abs(x - n) <= 4);
  const emoji = r.pick(COUNTABLES);
  const what = pictures ? "la cantidad del dibujo" : String(n);
  return {
    kind: "choice",
    prompt: rel === "igual" ? `¿Qué número es igual a ${what}?` : `¿Qué número es ${rel} que ${what}?`,
    visual: pictures ? (n <= 10 ? { kind: "objects", emoji, count: n } : { kind: "rows", rows: [{ emoji, count: 10 }, { emoji, count: n - 10 }] }) : { kind: "text", text: String(n) },
    options: [...new Set([answer, ...r.shuffle(wrong).slice(0, 3)])].sort((a, b) => a - b).map(String),
    answer: String(answer),
    explanation: rel === "igual" ? `Hay ${n}.` : `${answer} es ${rel} que ${n}.`,
    tag: rel,
  };
}

export function compareNumbers(r: Rng, max: number, howMany: 2 | 3, ask: "greater" | "both", line = false): Question {
  const lo = max > 10 ? max - 10 : 0;
  const nums = r.shuffle(Array.from({ length: max - lo + 1 }, (_, i) => lo + i)).slice(0, howMany);
  const greater = ask === "greater" || r.chance(0.5);
  const answer = greater ? Math.max(...nums) : Math.min(...nums);
  return {
    kind: "choice",
    prompt: greater ? "¿Qué número es mayor?" : "¿Qué número es menor?",
    visual: line ? { kind: "numberLine", min: lo, max, step: 1, labelEvery: 1 } : undefined,
    options: nums.map(String),
    answer: String(answer),
    explanation: `${answer} es el ${greater ? "mayor" : "menor"}.`,
    tag: greater ? "mayor" : "menor",
  };
}

// ---------------------------------------------------------------------------
// Sumar y restar con modelos
// ---------------------------------------------------------------------------

type Op = "+" | "−";

// Dos partes cuya suma no pasa de `max` (o minuendo y sustraendo).
function parts(r: Rng, max: number, op: Op) {
  // El resultado se elige primero para que todos los resultados salgan por igual.
  if (op === "+") {
    const c = r.int(2, max);
    const a = r.int(1, c - 1);
    return { a, b: c - a, c };
  }
  const a = r.int(1, max - 1);
  const b = r.int(1, max - a);
  return { a, b, c: a + b };
}

const sentence = (op: Op, x: number, y: number, z: number) => `${x} ${op} ${y} = ${z}`;
const cubeString = (a: number, b: number, op: Op) => (op === "+" ? `${"🟩".repeat(a)} ${"🟦".repeat(b)}` : `${"🟩".repeat(a)}${"❎".repeat(b)}`);
const cubeVisual = (p: { a: number; b: number; c: number }, op: Op): Visual => (op === "+" ? { kind: "cubes", groups: [p.a, p.b] } : { kind: "cubes", groups: [p.c], crossed: p.b });
const pictureVisual = (r: Rng, p: { a: number; b: number; c: number }, op: Op): Visual => (op === "+" ? { kind: "groups", emoji: r.pick(COUNTABLES), a: p.a, b: p.b } : { kind: "takeaway", emoji: r.pick(COUNTABLES), total: p.c, removed: p.b });

function sentenceOptions(r: Rng, op: Op, p: { a: number; b: number; c: number }, max: number): { answer: string; options: string[] } {
  const [x, y, z] = op === "+" ? [p.a, p.b, p.c] : [p.c, p.b, p.a];
  const answer = sentence(op, x, y, z);
  const wrong = [sentence(op, x, y, z + 1), sentence(op, x, y, Math.max(0, z - 1)), op === "+" ? sentence("+", x, y + 1, z + 1) : sentence("−", x, Math.max(1, y - 1), z + 1), sentence(op === "+" ? "−" : "+", op === "+" ? p.c : p.a, p.b, op === "+" ? p.a : p.c)].filter((s) => s !== answer && !s.includes(String(max + 3)));
  return { answer, options: uniqueOptions(r, answer, wrong) };
}

// ¿Qué modelo corresponde a la operación?
export function whichModel(r: Rng, max: number, op: Op): Question {
  const p = parts(r, max, op);
  const [x, y] = op === "+" ? [p.a, p.b] : [p.c, p.b];
  const model = (m: number, n: number) => cubeString(op === "+" ? m : m - n, n, op);
  const answer = model(x, y);
  const wrong = [model(x + 1, y), model(x, y + 1 <= (op === "+" ? max : x) ? y + 1 : Math.max(1, y - 1)), model(Math.max(op === "+" ? 1 : y + 1, x - 1), y)];
  return { kind: "choice", prompt: `¿Qué modelo muestra ${op === "+" ? sentence("+", p.a, p.b, p.c) : sentence("−", p.c, p.b, p.a)}?`, options: uniqueOptions(r, answer, wrong.filter((w) => w !== answer)), answer, explanation: op === "+" ? `${p.a} verdes y ${p.b} azules.` : `${p.c} cubos y ${p.b} tachados.` };
}

// ¿Qué operación muestra el modelo? (cubos o dibujos)
export function modelToSentence(r: Rng, max: number, op: Op, model: "cubes" | "tower" | "pictures"): Question {
  const p = parts(r, max, op);
  const { answer, options } = sentenceOptions(r, op, p, max);
  return { kind: "choice", prompt: op === "+" ? "¿Qué suma muestra el dibujo?" : "¿Qué resta muestra el dibujo?", visual: model === "cubes" ? cubeVisual(p, op) : model === "tower" ? { ...cubeVisual(p, op), vertical: true } as Visual : pictureVisual(r, p, op), options, answer, explanation: op === "+" ? `${p.a} y ${p.b} más son ${p.c}.` : `Hay ${p.c} y se quitan ${p.b}: quedan ${p.a}.` };
}

export function wordsToSentence(r: Rng, max: number, op: Op): Question {
  const p = parts(r, max, op);
  const { answer, options } = sentenceOptions(r, op, p, max);
  const words = op === "+" ? `${numberWord(p.a)} más ${numberWord(p.b)} es igual a ${numberWord(p.c)}` : `${numberWord(p.c)} menos ${numberWord(p.b)} es igual a ${numberWord(p.a)}`;
  return { kind: "choice", prompt: "¿Cómo se escribe con números?", visual: { kind: "text", text: words.charAt(0).toUpperCase() + words.slice(1) }, options, answer, explanation: answer };
}

export type FactForm = "cubes" | "cubeSentence" | "words" | "pictures" | "numbers" | "missing" | "oneTwo" | "anyOrder" | "makeTenModel" | "makeTen" | "makeUsing" | "zero";

// Operaciones de suma o resta en distintas presentaciones.
export function fact(r: Rng, max: number, op: Op, form: FactForm): Question {
  if (form === "makeTenModel" || form === "makeTen") {
    const a = r.int(1, 9);
    return numQ(r, "¿Qué número falta para llegar a 10?", 10 - a, 0, 10, form === "makeTenModel" ? { kind: "frame", size: 10, counts: [a] } : { kind: "text", text: `${a} + ? = 10` }, `${a} + ${10 - a} = 10.`);
  }
  if (form === "anyOrder") {
    const p = parts(r, max, "+");
    return numQ(r, "Sumar en otro orden da lo mismo. ¿Qué número falta?", p.a, 0, max, { kind: "text", text: `${p.a} + ${p.b} = ${p.b} + ?` }, `${p.a} + ${p.b} = ${p.b} + ${p.a}.`);
  }
  if (form === "zero") {
    const n = r.int(0, max);
    const plus = r.chance(0.5);
    return numQ(r, "Resuelve.", n, 0, max, { kind: "text", text: `${n} ${plus ? "+" : "−"} 0 = ?` }, `Sumar o quitar 0 no cambia el número: ${n}.`, plus ? "suma" : "resta");
  }
  if (form === "makeUsing") {
    const p = parts(r, max, op);
    const target = op === "+" ? p.c : p.a;
    const good = op === "+" ? `${p.a} + ${p.b}` : `${p.c} − ${p.b}`;
    const wrong: string[] = [];
    for (let guard = 0; wrong.length < 3 && guard < 60; guard++) {
      const q = parts(r, max, op);
      const value = op === "+" ? q.c : q.a;
      const s = op === "+" ? `${q.a} + ${q.b}` : `${q.c} − ${q.b}`;
      if (value !== target && !wrong.includes(s)) wrong.push(s);
    }
    return { kind: "choice", prompt: `¿Qué ${op === "+" ? "suma" : "resta"} da ${target}?`, options: uniqueOptions(r, good, wrong), answer: good, explanation: `${good} = ${target}.` };
  }
  let p = parts(r, max, op);
  if (form === "oneTwo") {
    const k = r.pick([1, 2]);
    p = op === "+" ? ((a) => ({ a, b: k, c: a + k }))(r.int(0, max - k)) : ((c) => ({ a: c - k, b: k, c }))(r.int(k, max));
  }
  const [x, y, z] = op === "+" ? [p.a, p.b, p.c] : [p.c, p.b, p.a];
  const explanation = `${sentence(op, x, y, z)}.`;
  const tag = op === "+" ? "suma" : "resta";
  if (form === "missing") {
    const hideSecond = r.chance(0.5);
    return numQ(r, "¿Qué número falta?", hideSecond ? y : x, 0, max, { kind: "text", text: hideSecond ? `${x} ${op} ? = ${z}` : `? ${op} ${y} = ${z}` }, explanation, tag);
  }
  if (form === "cubes") return numQ(r, op === "+" ? "¿Cuántos cubos hay en total?" : "Se quitan los cubos tachados. ¿Cuántos quedan?", z, 0, max, cubeVisual(p, op), explanation, tag);
  if (form === "cubeSentence") return numQ(r, `${x} ${op} ${y} = ?`, z, 0, max, cubeVisual(p, op), explanation, tag);
  if (form === "words") return numQ(r, op === "+" ? `${x} y ${y} son…` : `${x} menos ${y} son…`, z, 0, max, cubeVisual(p, op), explanation, tag);
  if (form === "pictures") return numQ(r, op === "+" ? "¿Cuántos hay en total?" : "¿Cuántos quedan?", z, 0, max, pictureVisual(r, p, op), explanation, tag);
  return numQ(r, "Resuelve.", z, 0, max, { kind: "text", text: `${x} ${op} ${y} = ?` }, explanation, tag);
}

export type ApartForm = "cubes" | "ways" | "sentence" | "waysSentence" | "decompose";

// Descomponer un número (o siempre el 10 si `fixed` = 10).
export function takeApart(r: Rng, max: number, form: ApartForm, fixed?: number): Question {
  const n = fixed ?? r.int(Math.min(3, max), max);
  const a = r.int(1, n - 1);
  const b = n - a;
  if (form === "ways" || form === "waysSentence") {
    const good = form === "ways" ? `${a} y ${b}` : `${a} + ${b}`;
    const wrong = [[a, b + 1], [a + 1, b], [Math.max(0, a - 1), b]].filter(([x, y]) => x + y !== n).map(([x, y]) => (form === "ways" ? `${x} y ${y}` : `${x} + ${y}`));
    return { kind: "choice", prompt: `¿Cuál es una forma de formar ${n}?`, visual: form === "ways" ? { kind: "cubes", groups: [n] } : undefined, options: uniqueOptions(r, good, wrong), answer: good, explanation: `${a} y ${b} forman ${n}.` };
  }
  const visual: Visual = form === "cubes" ? { kind: "cubes", groups: [a, b] } : form === "decompose" ? { kind: "frame", size: 10, counts: [n] } : { kind: "text", text: `${n} = ${a} + ?` };
  return numQ(r, form === "sentence" ? "¿Qué número falta?" : `${n} es ${a} y…`, b, 0, max, visual, `${n} = ${a} + ${b}.`);
}

const KIDS = ["Ana", "Luis", "Rosa", "Hugo", "Mía", "Leo"];
const THINGS: [string, string, string][] = [["🍎", "manzanas", "manzana"], ["🎈", "globos", "globo"], ["🍪", "galletas", "galleta"], ["⚽", "pelotas", "pelota"], ["🌸", "flores", "flor"], ["🐟", "peces", "pez"]];

export type ProblemForm = "cubes" | "pictures" | "writePictures" | "plain" | "write";

// Problemas de cambio: juntar o quitar.
export function wordProblem(r: Rng, max: number, op: Op | "mixed", form: ProblemForm): Question {
  const o: Op = op === "mixed" ? r.pick<Op>(["+", "−"]) : op;
  const p = parts(r, max, o);
  const kid = r.pick(KIDS);
  const [emoji, name, one] = r.pick(THINGS);
  const story = o === "+" ? `${kid} tiene ${p.a} ${p.a === 1 ? one : name}. Le dan ${p.b} más.` : `${kid} tiene ${p.c} ${name}. Regala ${p.b}.`;
  const fem = name !== "globos" && name !== "peces";
  const ask = `${fem ? "¿Cuántas" : "¿Cuántos"} ${o === "+" ? "tiene ahora" : "le quedan"}?`;
  const z = o === "+" ? p.c : p.a;
  const visual: Visual | undefined = form === "cubes" ? cubeVisual(p, o) : form === "pictures" || form === "writePictures" ? (o === "+" ? { kind: "groups", emoji, a: p.a, b: p.b } : { kind: "takeaway", emoji, total: p.c, removed: p.b }) : undefined;
  if (form === "writePictures" || form === "write") {
    const { answer, options } = sentenceOptions(r, o, p, max);
    return { kind: "choice", prompt: `${story} ¿Qué operación resuelve el problema?`, visual, options, answer, explanation: `${answer}.`, tag: o === "+" ? "suma" : "resta" };
  }
  return numQ(r, `${story} ${ask}`, z, 0, max, visual, o === "+" ? `${p.a} + ${p.b} = ${p.c}.` : `${p.c} − ${p.b} = ${p.a}.`, o === "+" ? "suma" : "resta");
}

export function mixedFact(r: Rng, max: number): Question {
  return fact(r, max, r.pick<Op>(["+", "−"]), "numbers");
}

export function waysToMake(r: Rng): Question {
  const n = r.int(2, 9);
  const good = r.chance(0.5) ? ((a) => `${a} + ${n - a}`)(r.int(0, n)) : ((b) => `${n + b} − ${b}`)(r.int(1, 10 - n));
  const wrong: string[] = [];
  for (let guard = 0; wrong.length < 3 && guard < 60; guard++) {
    const m = r.int(1, 10);
    if (m === n) continue;
    const s = r.chance(0.5) ? ((a) => `${a} + ${m - a}`)(r.int(0, m)) : m < 10 ? ((b) => `${m + b} − ${b}`)(r.int(1, 10 - m)) : `10 − 0`;
    if (!wrong.includes(s) && s !== good) wrong.push(s);
  }
  return { kind: "choice", prompt: `¿Cuál es una forma de obtener ${n}?`, options: uniqueOptions(r, good, wrong), answer: good, explanation: `${good} = ${n}.` };
}

export function relatedFacts(r: Rng, max: number): Question {
  const p = parts(r, max, "+");
  const toSub = r.chance(0.5);
  const answer = toSub ? p.a : p.c;
  return { kind: "choice", prompt: toSub ? `${p.a} + ${p.b} = ${p.c}. Entonces ${p.c} − ${p.b} = ?` : `${p.c} − ${p.b} = ${p.a}. Entonces ${p.a} + ${p.b} = ?`, visual: { kind: "cubes", groups: [p.a, p.b] }, options: nopts(r, answer, 0, max), answer: String(answer), explanation: "La suma y la resta están relacionadas: usan los mismos tres números." };
}

// ---------------------------------------------------------------------------
// Números del 11 al 19, decenas y unidades
// ---------------------------------------------------------------------------

export type TeenForm = "makeWords" | "apartWords" | "makeSentence" | "apartSentence" | "bothSentence" | "tensOnes";

export function teen(r: Rng, form: TeenForm, model: boolean): Question {
  const n = r.int(11, 19);
  const u = n - 10;
  const visual: Visual | undefined = model ? { kind: "placeValue", tens: 1, ones: u } : undefined;
  const f = form === "bothSentence" ? r.pick<TeenForm>(["makeSentence", "apartSentence"]) : form;
  if (f === "makeWords") return numQ(r, `10 y ${u} son…`, n, 11, 19, visual, `10 y ${u} forman ${n}.`);
  if (f === "apartWords") return numQ(r, `${n} son 10 y…`, u, 1, 9, visual, `${n} son 10 y ${u}.`);
  if (f === "makeSentence") return { kind: "choice", prompt: `10 + ${u} = ?`, visual, options: nopts(r, n, 11, 19), answer: String(n), explanation: `10 + ${u} = ${n}.` };
  if (f === "apartSentence") return { kind: "choice", prompt: `${n} = 10 + ?`, visual, options: nopts(r, u, 1, 9), answer: String(u), explanation: `${n} = 10 + ${u}.` };
  return r.chance(0.5)
    ? { kind: "choice", prompt: `1 decena y ${u} unidades forman…`, visual, options: nopts(r, n, 11, 19), answer: String(n), explanation: `1 decena (10) y ${u} unidades son ${n}.` }
    : { kind: "choice", prompt: `${n} tiene 1 decena y… ¿cuántas unidades?`, visual, options: nopts(r, u, 1, 9), answer: String(u), explanation: `${n} = 1 decena y ${u} unidades.` };
}

export function tensOnes(r: Rng, max: number): Question {
  const n = r.int(11, max);
  const t = Math.floor(n / 10);
  const u = n % 10;
  const visual: Visual = { kind: "placeValue", tens: t, ones: u };
  const form = r.int(0, 2);
  if (form === 0) return numQ(r, "¿Cuántas decenas (barras de 10) hay?", t, 0, 4, visual, `Hay ${t} ${t === 1 ? "decena" : "decenas"} y ${u} unidades.`, "decenas");
  if (form === 1) return numQ(r, "¿Cuántas unidades (cubitos sueltos) hay?", u, 0, 9, visual, `Hay ${t} ${t === 1 ? "decena" : "decenas"} y ${u} unidades.`, "unidades");
  return numQ(r, "¿Qué número muestran los bloques?", n, 11, max, visual, `${t} ${t === 1 ? "decena" : "decenas"} y ${u} unidades son ${n}.`, "numero");
}

// ---------------------------------------------------------------------------
// Patrones
// ---------------------------------------------------------------------------

const COLOR_SETS = [["🔴", "🔵"], ["🟢", "🟡"], ["🟣", "🟠"], ["🔴", "🟡", "🔵"], ["🟢", "🟣", "🟠"]];
const SIZE_SETS = [["⬛", "▪️"], ["🔶", "🔸"], ["🔷", "🔹"], ["⬛", "◼️", "▪️"]];
const SHAPE_SETS = [["🔵", "🟦"], ["🔺", "🟥"], ["⭐", "🔵"], ["🔺", "🟦", "⭐"], ["🟢", "🔺", "🟧"]];

export function patternK(r: Rng, kind: "color" | "size" | "shape" | "any", form: "next" | "complete"): Question {
  const k = kind === "any" ? r.pick(["color", "size", "shape"] as const) : kind;
  const unit = r.pick(k === "color" ? COLOR_SETS : k === "size" ? SIZE_SETS : SHAPE_SETS);
  const core = r.chance(0.3) && unit.length === 2 ? [unit[0], unit[0], unit[1]] : unit;
  const len = core.length * 2 + r.int(1, core.length);
  const full = Array.from({ length: len + 1 }, (_, i) => core[i % core.length]);
  const hidden = form === "next" ? len : r.int(core.length, len - 1);
  const items = full.slice(0, len + (form === "next" ? 1 : 0)).map((x, i) => (i === hidden ? "?" : x));
  return { kind: "choice", prompt: form === "next" ? "¿Qué sigue en el patrón?" : "¿Qué falta en el patrón?", visual: { kind: "pattern", items }, options: r.shuffle([...new Set(unit)]), answer: full[hidden], explanation: `El patrón se repite: ${core.join(" ")}.`, tag: k };
}

export function growing(r: Rng, form: "pattern" | "nextShape" | "nextRow"): Question {
  const emoji = r.pick(SHAPES);
  const start = r.int(1, 2);
  const step = form === "pattern" ? 1 : r.pick([1, 2]);
  const rowsVisual: Visual = { kind: "rows", rows: [0, 1, 2].map((i) => ({ emoji, count: start + i * step })) };
  const next = start + 3 * step;
  if (form === "nextShape") return numQ(r, "El patrón crece. ¿Cuántas figuras tendrá la siguiente fila?", next, 1, next + 3, rowsVisual, `Cada fila tiene ${step} más: sigue una de ${next}.`);
  const draw = (k: number) => emoji.repeat(k);
  return { kind: "choice", prompt: form === "pattern" ? "El patrón crece. ¿Qué fila sigue?" : "¿Cuál es la siguiente fila del patrón?", visual: rowsVisual, options: r.shuffle([next, next - step, next + 1, start].filter((x, i, a) => x > 0 && a.indexOf(x) === i).map(draw)), answer: draw(next), explanation: `Cada fila tiene ${step} más: sigue una de ${next}.` };
}

// ---------------------------------------------------------------------------
// Posiciones, igual y diferente
// ---------------------------------------------------------------------------

export type PositionKind = "front" | "inside" | "above" | "beside" | "lmr" | "tmb";

export function position(r: Rng, kind: PositionKind): Question {
  const e = r.shuffle(ANIMALS);
  if (kind === "front") {
    const row = e.slice(0, 3);
    const front = r.chance(0.5);
    return pickQ(r, `Los animales caminan hacia la ➡️. ¿Quién va ${front ? "delante" : "detrás"} de ${row[1]}?`, front ? row[2] : row[0], row, front ? "Delante es más cerca de la flecha." : "Detrás es más lejos de la flecha.", { kind: "pattern", items: [...row, "➡️"] }, front ? "delante" : "detras");
  }
  if (kind === "inside") {
    const inside = r.chance(0.5);
    return pickQ(r, `¿Quién está ${inside ? "dentro" : "fuera"} de la caja?`, inside ? e[0] : e[1], [e[0], e[1]], inside ? `${e[0]} está dentro de la caja.` : `${e[1]} está fuera de la caja.`, { kind: "box", inside: [e[0]], outside: [e[1]] }, inside ? "dentro" : "fuera");
  }
  if (kind === "above") {
    const stack = e.slice(0, 3);
    const above = r.chance(0.5);
    return pickQ(r, `¿Quién está ${above ? "encima" : "debajo"} de ${stack[1]}?`, above ? stack[0] : stack[2], stack, above ? "Encima es más arriba." : "Debajo es más abajo.", { kind: "stack", items: stack }, above ? "encima" : "debajo");
  }
  if (kind === "beside") {
    const row = e.slice(0, 4);
    const i = r.int(0, 1);
    return pickQ(r, `¿Quién está entre ${row[i]} y ${row[i + 2]}, al lado de los dos?`, row[i + 1], row.filter((x) => x !== row[i] && x !== row[i + 2]), `${row[i + 1]} está junto a ${row[i]}.`, { kind: "pattern", items: row });
  }
  const three = e.slice(0, 3);
  if (kind === "lmr") {
    const names = ["a la izquierda", "en el medio", "a la derecha"];
    const i = r.int(0, 2);
    return pickQ(r, `¿Quién está ${names[i]}?`, three[i], three, `${three[i]} está ${names[i]}.`, { kind: "pattern", items: three }, names[i]);
  }
  const names = ["arriba", "en el medio", "abajo"];
  const i = r.int(0, 2);
  return pickQ(r, `¿Quién está ${names[i]}?`, three[i], three, `${three[i]} está ${names[i]}.`, { kind: "stack", items: three }, names[i]);
}

export function sameDifferent(r: Rng, kind: "different" | "same" | "both"): Question {
  const k = kind === "both" ? r.pick(["different", "same"] as const) : kind;
  const pool = r.shuffle([...COUNTABLES, ...ANIMALS]);
  if (k === "different") {
    const row = r.shuffle([pool[0], pool[0], pool[0], pool[1]]);
    return { kind: "choice", prompt: "¿Cuál es diferente a los demás?", visual: { kind: "pattern", items: row }, options: r.shuffle([pool[0], pool[1]]), answer: pool[1], explanation: `${pool[1]} es diferente.`, tag: "diferente" };
  }
  return pickQ(r, "¿Cuál es igual a este?", pool[0], pool.slice(1, 4), `${pool[0]} es igual.`, { kind: "picture", emoji: pool[0] }, "igual");
}

// ---------------------------------------------------------------------------
// Figuras planas y cuerpos
// ---------------------------------------------------------------------------

const SHAPE_INFO: Record<string, { sides: number; corners: number; curved: boolean; square: boolean; equal: boolean | null; plural: string; article: string }> = {
  círculo: { sides: 0, corners: 0, curved: true, square: false, equal: null, plural: "círculos", article: "un" },
  triángulo: { sides: 3, corners: 3, curved: false, square: false, equal: null, plural: "triángulos", article: "un" },
  cuadrado: { sides: 4, corners: 4, curved: false, square: true, equal: true, plural: "cuadrados", article: "un" },
  rectángulo: { sides: 4, corners: 4, curved: false, square: true, equal: false, plural: "rectángulos", article: "un" },
  hexágono: { sides: 6, corners: 6, curved: false, square: false, equal: true, plural: "hexágonos", article: "un" },
  pentágono: { sides: 5, corners: 5, curved: false, square: false, equal: true, plural: "pentágonos", article: "un" },
};
const SHAPE_NAMES = Object.keys(SHAPE_INFO);
const LETTERS = "ABCDEF";

// Elegir, entre varias figuras rotuladas, la del tipo pedido.
export function shapePick(r: Rng, target: string, kind: "shapes" | "solids" = "shapes"): Question {
  const pool = (kind === "shapes" ? SHAPE_NAMES : SOLIDS).filter((n) => n !== target);
  const names = r.shuffle([target, ...r.shuffle(pool).slice(0, 3)]);
  const i = names.indexOf(target);
  const art = kind === "solids" && (target === "esfera" || target === "pirámide cuadrada") ? "una" : "un";
  return { kind: "choice", prompt: `¿Cuál es ${art} ${target}?`, visual: { kind, names }, options: names.map((_, k) => LETTERS[k]), answer: LETTERS[i], explanation: `La figura ${LETTERS[i]} es ${art} ${target}.`, tag: target };
}

// Marcar todas las figuras del tipo pedido.
export function shapeSort(r: Rng, target: string | null, kind: "shapes" | "solids" = "shapes"): Question {
  const pool = kind === "shapes" ? SHAPE_NAMES : SOLIDS;
  const t = target ?? r.pick(pool);
  const hits = r.int(2, 3);
  const names = r.shuffle([...Array(hits).fill(t), ...Array.from({ length: 5 - hits }, () => r.pick(pool.filter((n) => n !== t)))]);
  const letters = names.map((_, i) => LETTERS[i]);
  const plural = kind === "shapes" ? SHAPE_INFO[t].plural : SOLID_PLURAL[t];
  return { kind: "multi", prompt: `Selecciona ${plural}.`, visual: { kind, names }, options: letters, answers: letters.filter((_, i) => names[i] === t), explanation: `Son ${letters.filter((_, i) => names[i] === t).join(", ")}.`, tag: t };
}

export type AttrKind = "curved" | "corners" | "squareCorners" | "sides" | "equalSides" | "sidesCorners" | "compare" | "attributes";

export function shapeAttr(r: Rng, kind: AttrKind): Question {
  const k = kind === "sidesCorners" ? r.pick(["sides", "corners"] as const) : kind;
  if (k === "corners" || k === "sides") {
    const name = r.pick(SHAPE_NAMES);
    const n = k === "corners" ? SHAPE_INFO[name].corners : SHAPE_INFO[name].sides;
    return numQ(r, k === "corners" ? "¿Cuántas esquinas tiene la figura?" : "¿Cuántos lados tiene la figura?", n, 0, 6, { kind: "shapes", names: [name] }, `El ${name} tiene ${n} ${k === "corners" ? "esquinas" : "lados"}.`, name);
  }
  if (k === "curved" || k === "squareCorners" || k === "equalSides") {
    const pool = k === "equalSides" ? ["cuadrado", "rectángulo", "pentágono", "hexágono"] : SHAPE_NAMES;
    // Mitad de las veces la respuesta es «Sí».
    const yesPool = pool.filter((n) => (k === "curved" ? SHAPE_INFO[n].curved : k === "squareCorners" ? SHAPE_INFO[n].square : SHAPE_INFO[n].equal === true));
    const name = r.pick(r.chance(0.5) ? yesPool : pool.filter((n) => !yesPool.includes(n)));
    const info = SHAPE_INFO[name];
    const yes = k === "curved" ? info.curved : k === "squareCorners" ? info.square : info.equal === true;
    const prompt = k === "curved" ? "¿La figura tiene partes curvas?" : k === "squareCorners" ? "¿La figura tiene esquinas cuadradas (como la esquina de una hoja)?" : "¿Todos los lados de la figura son iguales?";
    return yesNo(prompt, yes, yes ? `Sí: es un ${name}.` : `No: es un ${name}.`, { kind: "shapes", names: [name] });
  }
  const [a, b] = r.shuffle(SHAPE_NAMES.filter((n) => n !== "círculo")).slice(0, 2);
  if (k === "compare") {
    if (SHAPE_INFO[a].sides === SHAPE_INFO[b].sides) return shapeAttr(r, kind);
    const more = r.chance(0.5);
    const win = (more ? SHAPE_INFO[a].sides > SHAPE_INFO[b].sides : SHAPE_INFO[a].sides < SHAPE_INFO[b].sides) ? "A" : "B";
    return { kind: "choice", prompt: `¿Qué figura tiene ${more ? "más" : "menos"} lados?`, visual: { kind: "shapes", names: [a, b] }, options: ["A", "B"], answer: win, explanation: `El ${a} tiene ${SHAPE_INFO[a].sides} lados y el ${b} tiene ${SHAPE_INFO[b].sides}.` };
  }
  const name = r.pick(SHAPE_NAMES);
  const facts = [`${SHAPE_INFO[name].sides} lados`, `${SHAPE_INFO[name].corners} esquinas`];
  const good = name === "círculo" ? "Es redondo y no tiene esquinas" : `Tiene ${facts[0]} y ${facts[1]}`;
  const wrong = SHAPE_NAMES.filter((n) => n !== name && SHAPE_INFO[n].sides !== SHAPE_INFO[name].sides).map((n) => (n === "círculo" ? "Es redondo y no tiene esquinas" : `Tiene ${SHAPE_INFO[n].sides} lados y ${SHAPE_INFO[n].corners} esquinas`));
  return pickQ(r, "¿Qué describe a esta figura?", good, wrong, `Es un ${name}.`, { kind: "shapes", names: [name] }, name);
}

const SOLIDS = ["cubo", "prisma rectangular", "cilindro", "cono", "esfera", "pirámide cuadrada"];
const SOLID_PLURAL: Record<string, string> = { cubo: "los cubos", "prisma rectangular": "los prismas", cilindro: "los cilindros", cono: "los conos", esfera: "las esferas", "pirámide cuadrada": "las pirámides" };

export function flatOrSolid(r: Rng): Question {
  const solid = r.chance(0.5);
  const name = solid ? r.pick(SOLIDS) : r.pick(SHAPE_NAMES);
  return { kind: "choice", prompt: "¿La figura es plana o es un cuerpo sólido?", visual: { kind: solid ? "solids" : "shapes", names: [name] }, options: ["Plana", "Sólida"], answer: solid ? "Sólida" : "Plana", explanation: solid ? `El ${name} es un cuerpo sólido: tiene volumen.`.replace("El esfera", "La esfera").replace("El pirámide", "La pirámide") : `El ${name} es una figura plana.`, tag: solid ? "solida" : "plana" };
}

const SOLID_FACTS: [string, boolean, boolean, boolean][] = [["esfera", true, false, false], ["cubo", false, true, true], ["cilindro", true, true, true], ["cono", true, false, true]];

export function describeSolid(r: Rng): Question {
  const [name, rolls, stacks, slides] = r.pick(SOLID_FACTS);
  const which = r.int(0, 2);
  const yes = [rolls, stacks, slides][which];
  const prompt = ["¿Este cuerpo puede rodar?", "¿Este cuerpo se puede apilar (poner otro igual encima)?", "¿Este cuerpo puede deslizarse sobre un lado plano?"][which];
  return yesNo(prompt, yes, yes ? "Sí." : "No.", { kind: "solids", names: [name] });
}

const REAL_2D: [string, string][] = [["🍕", "triángulo"], ["🕒", "círculo"], ["🚪", "rectángulo"], ["🪟", "cuadrado"], ["📺", "rectángulo"], ["🍪", "círculo"], ["📐", "triángulo"], ["🖼️", "cuadrado"], ["⚽", "círculo"], ["📱", "rectángulo"]];
const REAL_3D: [string, string][] = [["⚽", "esfera"], ["🎲", "cubo"], ["🥫", "cilindro"], ["🍦", "cono"], ["🧊", "cubo"], ["🏀", "esfera"], ["🥁", "cilindro"], ["🎉", "cono"], ["🌍", "esfera"], ["🎁", "cubo"], ["🕯️", "cilindro"], ["🪖", "esfera"]];

export function realWorld(r: Rng, kind: "2d" | "3dA" | "3dB"): Question {
  if (kind === "2d") {
    const [emoji, shape] = r.pick(REAL_2D);
    return pickQ(r, "¿A qué figura se parece?", shape, ["círculo", "triángulo", "cuadrado", "rectángulo"], `Se parece a un ${shape}.`, { kind: "picture", emoji }, shape);
  }
  const pool = REAL_3D.filter(([e]) => e !== "🪖");
  if (kind === "3dA") {
    const [emoji, solid] = r.pick(pool);
    return pickQ(r, "¿A qué cuerpo se parece?", solid, ["esfera", "cubo", "cilindro", "cono"], `Se parece a ${solid === "esfera" ? "una esfera" : `un ${solid}`}.`, { kind: "picture", emoji }, solid);
  }
  const solid = r.pick(["esfera", "cubo", "cilindro", "cono"]);
  const good = r.pick(pool.filter(([, s]) => s === solid))[0];
  const wrong = r.shuffle(pool.filter(([, s]) => s !== solid)).slice(0, 3).map(([e]) => e);
  return pickQ(r, `¿Qué objeto tiene forma de ${solid}?`, good, wrong, `${good} tiene forma de ${solid}.`, { kind: "solids", names: [solid] }, solid);
}

// Cuerpos uno encima de otro o uno al lado de otro.
export function solidPosition(r: Rng, kind: "above" | "beside"): Question {
  const objs = r.shuffle([["⚽", "esfera"], ["🎲", "cubo"], ["🥫", "cilindro"], ["🍦", "cono"]] as [string, string][]).slice(0, 3);
  if (kind === "above") {
    const above = r.chance(0.5);
    const answer = above ? objs[0] : objs[2];
    return pickQ(r, `¿Qué cuerpo está ${above ? "encima" : "debajo"} del ${objs[1][0]}?`, answer[1], ["esfera", "cubo", "cilindro", "cono"], `${answer[0]} tiene forma de ${answer[1]}.`, { kind: "stack", items: objs.map(([e]) => e) }, above ? "encima" : "debajo");
  }
  const i = r.pick([0, 2]);
  return pickQ(r, `¿Qué cuerpo está al lado del ${objs[1][0]}, ${i === 0 ? "a la izquierda" : "a la derecha"}?`, objs[i][1], ["esfera", "cubo", "cilindro", "cono"], `${objs[i][0]} tiene forma de ${objs[i][1]}.`, { kind: "pattern", items: objs.map(([e]) => e) });
}

// ---------------------------------------------------------------------------
// Partes iguales
// ---------------------------------------------------------------------------

export function equalParts(r: Rng, halves: boolean): Question {
  const shape = r.pick(["bar", "circle"] as const);
  const n = halves ? r.pick([2, 2, 2, 3, 4]) : r.int(2, 4);
  const equal = r.chance(halves ? 0.65 : 0.5);
  let cuts: number[];
  if (shape === "bar") {
    cuts = Array.from({ length: n - 1 }, (_, i) => ((i + 1) * 100) / n);
    if (!equal) cuts = cuts.map((c, i) => (i === 0 ? c * r.pick([0.45, 0.6]) : c + 8));
  } else {
    cuts = Array.from({ length: n }, (_, i) => (i * 360) / n);
    if (!equal) cuts = cuts.map((c, i) => (i === 1 ? c * r.pick([0.5, 0.6]) : c));
  }
  const visual: Visual = { kind: "splitShape", shape, cuts };
  if (halves) return yesNo("¿La figura está dividida en mitades (dos partes iguales)?", equal && n === 2, equal && n === 2 ? "Sí: son dos partes iguales." : n === 2 ? "No: las dos partes no son iguales." : `No: tiene ${n} partes.`, visual);
  return yesNo("¿Todas las partes son iguales?", equal, equal ? `Sí: son ${n} partes iguales.` : "No: hay partes más grandes que otras.", visual);
}

// ---------------------------------------------------------------------------
// Clasificar y gráficos
// ---------------------------------------------------------------------------

// Figuras de colores: [color][forma].
const COLORS = ["rojo", "azul", "verde", "amarillo"];
const FORMS = ["círculos", "cuadrados", "corazones"];
const TILE: string[][] = [["🔴", "🟥", "❤️"], ["🔵", "🟦", "💙"], ["🟢", "🟩", "💚"], ["🟡", "🟨", "💛"]];

function randomTiles(r: Rng, n: number) {
  return Array.from({ length: n }, () => ({ c: r.int(0, 3), f: r.int(0, 2) }));
}

export type ClassifyKind = "color" | "sortColor" | "sortShape" | "sort" | "sortCount" | "sortCompare" | "vennCount" | "vennSort";

export function classify(r: Rng, kind: ClassifyKind): Question {
  if (kind === "color") {
    const t = { c: r.int(0, 3), f: r.int(0, 2) };
    return pickQ(r, "¿De qué color es la figura?", COLORS[t.c], COLORS, `Es de color ${COLORS[t.c]}.`, { kind: "picture", emoji: TILE[t.c][t.f] }, COLORS[t.c]);
  }
  if (kind === "vennCount" || kind === "vennSort") {
    const c = r.int(0, 3);
    const left = Array.from({ length: r.int(1, 3) }, () => TILE[c][r.pick([1, 2])]);
    const both = Array.from({ length: r.int(1, 3) }, () => TILE[c][0]);
    const right = Array.from({ length: r.int(1, 3) }, () => TILE[r.pick([0, 1, 2, 3].filter((x) => x !== c))][0]);
    const visual: Visual = { kind: "venn", left, both, right, leftLabel: `De color ${COLORS[c]}`, rightLabel: "Círculos" };
    if (kind === "vennCount") {
      const which = r.int(0, 2);
      const prompts = [`¿Cuántas figuras son de color ${COLORS[c]}?`, "¿Cuántas figuras son círculos?", `¿Cuántas figuras son círculos de color ${COLORS[c]}?`];
      const answers = [left.length + both.length, both.length + right.length, both.length];
      return numQ(r, prompts[which], answers[which], 0, 7, visual, `Son ${answers[which]}.`);
    }
    const t = { c: r.int(0, 3), f: r.int(0, 2) };
    const zones = [`Solo en «De color ${COLORS[c]}»`, "En el medio (las dos cosas)", "Solo en «Círculos»", "Fuera de los dos círculos"];
    const answer = t.c === c && t.f === 0 ? zones[1] : t.c === c ? zones[0] : t.f === 0 ? zones[2] : zones[3];
    return { kind: "choice", prompt: `¿Dónde va esta figura: ${TILE[t.c][t.f]}?`, visual, options: zones, answer, explanation: `${TILE[t.c][t.f]} es ${FORMS[t.f].replace(/es$|s$/, "")} de color ${COLORS[t.c]}.` };
  }
  const tiles = randomTiles(r, 6);
  const byColor = kind === "sortColor" || ((kind === "sort" || kind === "sortCount" || kind === "sortCompare") && r.chance(0.5));
  const shown = tiles.map((t) => TILE[t.c][t.f]);
  if (kind === "sortColor" || kind === "sortShape" || kind === "sort") {
    const by = kind === "sortShape" ? false : byColor;
    const target = by ? r.pick([...new Set(tiles.map((t) => t.c))]) : r.pick([...new Set(tiles.map((t) => t.f))]);
    const answers = [...new Set(tiles.filter((t) => (by ? t.c : t.f) === target).map((t) => TILE[t.c][t.f]))];
    const options = [...new Set(shown)];
    if (answers.length === options.length) return classify(r, kind);
    return { kind: "multi", prompt: by ? `Selecciona todas las figuras de color ${COLORS[target]}.` : `Selecciona todos los ${FORMS[target]}.`, visual: { kind: "pattern", items: shown }, options, answers, explanation: `Son: ${answers.join(" ")}.`, tag: by ? "color" : "forma" };
  }
  const key = (t: { c: number; f: number }) => (byColor ? t.c : t.f);
  const groups = [...new Set(tiles.map(key))];
  const label = (g: number) => (byColor ? `de color ${COLORS[g]}` : FORMS[g]);
  const countOf = (g: number) => tiles.filter((t) => key(t) === g).length;
  if (kind === "sortCount") {
    const g = r.pick(groups);
    return numQ(r, byColor ? `¿Cuántas figuras son ${label(g)}?` : `¿Cuántos ${label(g)} hay?`, countOf(g), 0, 6, { kind: "pattern", items: shown }, `Hay ${countOf(g)}.`);
  }
  if (groups.length < 2) return classify(r, kind);
  const [g1, g2] = r.shuffle(groups).slice(0, 2);
  if (countOf(g1) === countOf(g2)) return classify(r, kind);
  const more = r.chance(0.5);
  const win = (more ? countOf(g1) > countOf(g2) : countOf(g1) < countOf(g2)) ? g1 : g2;
  const name = (g: number) => (byColor ? COLORS[g] : FORMS[g]);
  return { kind: "choice", prompt: `¿De cuál hay ${more ? "más" : "menos"}: ${name(g1)} o ${name(g2)}?`, visual: { kind: "pattern", items: shown }, options: [name(g1), name(g2)], answer: name(win), explanation: `Hay ${countOf(g1)} ${byColor ? "de color " : ""}${name(g1)} y ${countOf(g2)} ${byColor ? "de color " : ""}${name(g2)}.` };
}

export function graph(r: Rng, kind: "correct" | "make" | "interpret"): Question {
  const [e1, e2, e3] = r.shuffle(COUNTABLES).slice(0, 3);
  const counts = [r.int(1, 5), r.int(1, 5), r.int(1, 5)];
  const emojis = [e1, e2, e3];
  const rows = emojis.map((emoji, i) => ({ emoji, count: counts[i] }));
  if (kind === "interpret") {
    const form = r.int(0, 1);
    if (form === 0 || new Set(counts).size < 3) {
      const i = r.int(0, 2);
      return numQ(r, `Mira el gráfico. ¿Cuántos ${emojis[i]} hay?`, counts[i], 0, 6, { kind: "rows", rows }, `En la fila de ${emojis[i]} hay ${counts[i]}.`);
    }
    const more = r.chance(0.5);
    const target = more ? Math.max(...counts) : Math.min(...counts);
    return pickQ(r, more ? "Mira el gráfico. ¿De cuál hay más?" : "Mira el gráfico. ¿De cuál hay menos?", emojis[counts.indexOf(target)], emojis, `Hay ${counts.join(", ")}.`, { kind: "rows", rows });
  }
  const pile = r.shuffle(emojis.flatMap((e, i) => Array(counts[i]).fill(e)));
  if (kind === "make") {
    const i = r.int(0, 2);
    return { kind: "shade", prompt: `${pile.join("")}  Completa la fila del gráfico: toca una casilla por cada ${emojis[i]}.`, shape: "bar", parts: 5, answer: counts[i], explanation: `Hay ${counts[i]} ${emojis[i]}.` };
  }
  const draw = (cs: number[]) => emojis.map((e, i) => e.repeat(cs[i])).join("\n");
  const answer = draw(counts);
  const wrong = [[counts[1], counts[0], counts[2]], [counts[0], counts[2], counts[1]], [counts[0] % 5 + 1, counts[1], counts[2]], [counts[0], counts[1], counts[2] % 5 + 1]].map(draw).filter((x) => x !== answer);
  return { kind: "choice", prompt: "¿Qué gráfico muestra bien estos dibujos?", visual: { kind: "scatter", items: scatterAt(r, pile) }, options: uniqueOptions(r, answer, wrong, 3), mono: true, answer, explanation: `Hay ${counts[0]} ${e1}, ${counts[1]} ${e2} y ${counts[2]} ${e3}.` };
}

// ---------------------------------------------------------------------------
// Medición
// ---------------------------------------------------------------------------

type Pair = [big: string, small: string];
const TALL: Pair[] = [["🦒", "🐕"], ["🌳", "🌱"], ["🏢", "🏠"], ["🐘", "🐈"], ["🧍", "👶"]];
const HEAVY: Pair[] = [["🐘", "🐭"], ["🚗", "🚲"], ["🍉", "🍓"], ["🪨", "🪶"], ["🚌", "⚽"], ["🐄", "🐥"]];
const HOLDS: Pair[] = [["🛁", "☕"], ["🪣", "🥄"], ["🏊", "🥛"], ["🍲", "🍵"], ["🚰", "💧"]];
const COVERS: [string, string][] = [["una sábana", "una servilleta"], ["una alfombra", "un pañuelo"], ["una pizarra", "un cuaderno"], ["una manta", "una media"], ["un mantel", "un plato"]];

export type MeasureKind = "long" | "tall" | "wide" | "heavy" | "holds" | "covers" | "mixed" | "which" | "objects" | "cubes" | "buildCubes" | "heightCubes" | "buildHeight";

export function measure(r: Rng, kind: MeasureKind): Question {
  const k = kind === "mixed" ? r.pick(["tall", "heavy", "holds"] as const) : kind;
  if (k === "long" || k === "wide") {
    const a = r.int(2, 10);
    let b = r.int(2, 10);
    while (b === a) b = r.int(2, 10);
    const bigger = r.chance(0.5);
    const words = k === "long" ? ["larga", "corta"] : ["ancha", "angosta"];
    const answer = (bigger ? a > b : a < b) ? "A" : "B";
    return { kind: "choice", prompt: `¿Qué barra es más ${bigger ? words[0] : words[1]}?`, visual: { kind: "lengthBars", a, b }, options: ["A", "B"], answer, explanation: `La barra ${answer} es más ${bigger ? words[0] : words[1]}.`, tag: bigger ? words[0] : words[1] };
  }
  if (k === "tall" || k === "heavy" || k === "holds") {
    const [big, small] = r.pick(k === "tall" ? TALL : k === "heavy" ? HEAVY : HOLDS);
    const bigger = r.chance(0.5);
    const q = k === "tall" ? (bigger ? "¿Cuál es más alto?" : "¿Cuál es más bajo?") : k === "heavy" ? (bigger ? "¿Cuál pesa más?" : "¿Cuál pesa menos?") : bigger ? "¿En cuál cabe más agua?" : "¿En cuál cabe menos agua?";
    return { kind: "choice", prompt: q, options: r.shuffle([big, small]), answer: bigger ? big : small, explanation: `${bigger ? big : small}.`, tag: k };
  }
  if (k === "covers") {
    const [big, small] = r.pick(COVERS);
    const more = r.chance(0.5);
    return { kind: "choice", prompt: more ? "¿Qué cubre más espacio?" : "¿Qué cubre menos espacio?", options: r.shuffle([big, small]), answer: more ? big : small, explanation: `${big.charAt(0).toUpperCase() + big.slice(1)} cubre más que ${small}.` };
  }
  if (k === "which") {
    const items: [string, string][] = [["¿Qué tan largo es un lápiz?", "El tamaño"], ["¿Cuánto pesa una sandía?", "El peso"], ["¿Cuánta agua cabe en una jarra?", "La capacidad"], ["¿Qué tan alto es un árbol?", "El tamaño"], ["¿Cuánto pesa un perro?", "El peso"], ["¿Cuánto jugo cabe en un vaso?", "La capacidad"], ["¿Qué tan ancha es una puerta?", "El tamaño"], ["¿Cuánto pesa una mochila?", "El peso"]];
    const [q, a] = r.pick(items);
    return { kind: "choice", prompt: `${q} ¿Qué se mide?`, options: ["El tamaño", "El peso", "La capacidad"], answer: a, explanation: `Se mide ${a.toLowerCase()}.` };
  }
  const n = r.int(2, kind === "objects" ? 8 : 9);
  if (k === "objects") return numQ(r, "¿Cuántos clips mide de largo?", n, 1, 9, { kind: "measureObjects", itemEmoji: r.pick(["✏️", "🖍️", "🥕", "🐛", "🔑"]), unitEmoji: "📎", count: n }, `Mide ${n} clips.`);
  if (k === "cubes") return numQ(r, "El lápiz mide lo mismo que el tren de cubos. ¿Cuántos cubos mide?", n, 1, 10, { kind: "cubes", groups: [n] }, `Mide ${n} cubos.`);
  if (k === "heightCubes") return numQ(r, "La planta es tan alta como la torre de cubos. ¿Cuántos cubos mide?", n, 1, 10, { kind: "cubes", groups: [n], vertical: true }, `Mide ${n} cubos de alto.`);
  return { kind: "shade", prompt: k === "buildCubes" ? `La cuerda mide ${n} cubos de largo. Arma el tren: toca ${n} casillas.` : `La torre mide ${n} cubos de alto. Arma la torre: toca ${n} casillas.`, shape: "area", parts: 10, answer: n, explanation: `Se necesitan ${n} cubos.` };
}

// ---------------------------------------------------------------------------
// La hora y el dinero
// ---------------------------------------------------------------------------

export function clockK(r: Rng, kind: "words" | "digital" | "read"): Question {
  const hour = r.int(1, 12);
  const half = kind !== "words" && r.chance(0.4);
  const visual: Visual = { kind: "clock", hour, minute: half ? 30 : 0 };
  if (kind === "read" && !half) return numQ(r, "Son las ___ en punto. ¿Qué número falta?", hour, 1, 12, visual, `La aguja corta señala el ${hour}: son las ${hour} en punto.`);
  const fmt = (h: number, m: number) => (kind === "words" ? `${h} en punto` : `${h}:${m === 0 ? "00" : "30"}`);
  const answer = fmt(hour, half ? 30 : 0);
  const wrong = [fmt((hour % 12) + 1, half ? 30 : 0), fmt(hour === 1 ? 12 : hour - 1, half ? 30 : 0), kind === "words" ? fmt(((hour + 5) % 12) + 1, 0) : fmt(hour, half ? 0 : 30)];
  return pickQ(r, "¿Qué hora marca el reloj?", answer, wrong, half ? `La aguja larga está en el 6: son las ${hour} y media.` : `La aguja larga está en el 12 y la corta en el ${hour}.`, visual, half ? "y-media" : "en-punto");
}

const COIN_NAME: Record<number, string> = { 10: "10 céntimos", 20: "20 céntimos", 50: "50 céntimos", 100: "1 sol", 200: "2 soles", 500: "5 soles" };
const ALL_COINS = [10, 20, 50, 100, 200, 500];

export type MoneyKind = "names" | "values" | "count1" | "count12" | "count125" | "compare";

export function money(r: Rng, kind: MoneyKind): Question {
  if (kind === "names") {
    const c = r.pick(ALL_COINS);
    return pickQ(r, "¿Qué moneda es?", COIN_NAME[c], ALL_COINS.map((x) => COIN_NAME[x]), `Es la moneda de ${COIN_NAME[c]}.`, { kind: "coins", coins: [c] }, COIN_NAME[c]);
  }
  if (kind === "values") {
    const [a, b] = r.shuffle(ALL_COINS).slice(0, 2);
    const more = r.chance(0.5);
    const win = more ? Math.max(a, b) : Math.min(a, b);
    return { kind: "choice", prompt: more ? "¿Qué moneda vale más?" : "¿Qué moneda vale menos?", visual: { kind: "coins", coins: [a, b] }, options: [COIN_NAME[a], COIN_NAME[b]], answer: COIN_NAME[win], explanation: `${COIN_NAME[Math.max(a, b)]} vale más que ${COIN_NAME[Math.min(a, b)]}.` };
  }
  const allowed = kind === "count1" ? [100] : kind === "count12" ? [100, 200] : [100, 200, 500];
  const group = () => {
    const n = r.int(1, kind === "count1" ? 9 : 4);
    const coins = Array.from({ length: n }, () => r.pick(allowed)).sort((x, y) => y - x);
    return sum(coins) > 1000 ? [500, 200, 100] : coins;
  };
  if (kind === "compare") {
    const a = group();
    let b = group();
    while (sum(b) === sum(a)) b = group();
    const show = (g: number[]) => g.map((c) => ["①", "②", "", "", "⑤"][c / 100 - 1]).join(" ");
    const more = sum(a) > sum(b) ? "A" : "B";
    return { kind: "choice", prompt: "Las monedas son de 1, 2 y 5 soles. ¿Qué grupo tiene más dinero?", visual: { kind: "text", text: `A:  ${show(a)}\nB:  ${show(b)}` }, options: ["A", "B"], answer: more, explanation: `A tiene ${sum(a) / 100} soles y B tiene ${sum(b) / 100} soles.` };
  }
  const coins = group();
  const total = sum(coins) / 100;
  return numQ(r, "¿Cuántos soles hay en total?", total, 1, 12, { kind: "coins", coins }, `${coins.map((c) => c / 100).join(" + ")} = ${total} ${total === 1 ? "sol" : "soles"}.`);
}

// ---------------------------------------------------------------------------
// Armar figuras y cuerpos
// ---------------------------------------------------------------------------

const COMPOSE: [string, string, string[]][] = [
  ["Si juntas dos cuadrados iguales, uno al lado del otro, ¿qué figura se forma?", "rectángulo", ["triángulo", "círculo", "hexágono"]],
  ["Si juntas dos triángulos iguales por su lado más largo, ¿qué figura puedes formar?", "cuadrado", ["círculo", "hexágono", "pentágono"]],
  ["Si juntas seis triángulos iguales alrededor de un punto, ¿qué figura se forma?", "hexágono", ["cuadrado", "círculo", "rectángulo"]],
  ["Si cortas un cuadrado de esquina a esquina, ¿qué figuras obtienes?", "dos triángulos", ["dos círculos", "dos cuadrados", "dos hexágonos"]],
  ["Si cortas un rectángulo por la mitad, ¿qué figuras puedes obtener?", "dos cuadrados", ["dos círculos", "dos hexágonos", "tres triángulos"]],
  ["Si juntas cuatro cuadrados pequeños, dos arriba y dos abajo, ¿qué figura se forma?", "cuadrado", ["triángulo", "círculo", "hexágono"]],
  ["Si juntas un cuadrado y un triángulo encima, ¿a qué se parece?", "a una casa", ["a una pelota", "a una rueda", "a una moneda"]],
  ["Si juntas tres cuadrados iguales en fila, ¿qué figura se forma?", "rectángulo", ["triángulo", "círculo", "cuadrado"]],
];

export function composeShapes(r: Rng): Question {
  const [prompt, answer, wrong] = r.pick(COMPOSE);
  return pickQ(r, prompt, answer, wrong, `Se forma: ${answer}.`);
}

const BUILD: [string, string, string[]][] = [
  ["Si pones un cono encima de un cilindro, ¿a qué se parece?", "a un cohete 🚀", ["a una pelota ⚽", "a un dado 🎲", "a una moneda 🪙"]],
  ["Si pones un cubo encima de otro cubo, ¿qué cuerpo se forma?", "un prisma (una caja alta)", ["una esfera", "un cono", "una pirámide"]],
  ["Un helado en barquillo 🍦 está hecho de una bola y un barquillo. ¿Qué cuerpos son?", "una esfera y un cono", ["un cubo y un cono", "dos cilindros", "un cubo y una esfera"]],
  ["Si pones una esfera encima de un cilindro, ¿puede quedarse quieta?", "Sí, con cuidado, sobre la cara plana", ["No, el cilindro no tiene caras planas", "No, las esferas no existen", "Sí, porque la esfera tiene esquinas"]],
  ["¿Qué cuerpo NO sirve para armar una torre, porque rueda hacia todos lados?", "la esfera", ["el cubo", "el prisma", "el cilindro parado"]],
  ["Una torre tiene 3 cubos. Si le quitas 1 cubo, ¿cuántos cubos quedan?", "2 cubos", ["4 cubos", "3 cubos", "1 cubo"]],
  ["Una casita de bloques tiene un cubo abajo y una pirámide arriba. ¿Cuántos bloques usa?", "2 bloques", ["1 bloque", "3 bloques", "4 bloques"]],
  ["Si juntas dos cubos, uno al lado del otro, ¿qué cuerpo se forma?", "un prisma rectangular", ["una esfera grande", "un cono largo", "un cilindro"]],
  ["Un tren de juguete se arma con 4 cubos en fila. Si se sueltan 2, ¿cuántos quedan unidos?", "2 cubos", ["6 cubos", "4 cubos", "1 cubo"]],
  ["¿Qué cuerpo pondrías ABAJO para que una torre no se caiga?", "un cubo", ["una esfera", "un cono de punta", "una pelota"]],
];

export function buildSolids(r: Rng): Question {
  const [prompt, answer, wrong] = r.pick(BUILD);
  return pickQ(r, prompt, answer, wrong, `Respuesta: ${answer}.`);
}

// Armar un tren de cubos para sumar o restar: se tocan las casillas del resultado.
export function buildTrain(r: Rng, max: number, op: Op): Question {
  const p = parts(r, max, op);
  const z = op === "+" ? p.c : p.a;
  const prompt = op === "+" ? `Arma un tren con ${p.a} ${p.a === 1 ? "cubo" : "cubos"} y ${p.b} más. Toca todas las casillas del tren.` : `Un tren tiene ${p.c} cubos y se quitan ${p.b}. Toca las casillas de los cubos que quedan.`;
  return { kind: "shade", prompt, shape: "bar", parts: max <= 5 ? 5 : 10, answer: z, explanation: op === "+" ? `${p.a} y ${p.b} son ${p.c}.` : `${p.c} menos ${p.b} son ${p.a}.`, tag: op === "+" ? "suma" : "resta" };
}

// ---------------------------------------------------------------------------
// Educación financiera
// ---------------------------------------------------------------------------

type Item = [prompt: string, answer: string, wrong: string[]];

const EARN_YES = ["Vender limonada 🍋", "Vender pan en la panadería 🍞", "Cortar el pelo en la peluquería ✂️", "Vender dibujos 🎨", "Manejar un bus 🚌", "Cosechar papas y venderlas 🥔", "Curar enfermos 🩺", "Arreglar zapatos 👞", "Enseñar en la escuela 👩‍🏫", "Coser ropa y venderla 🧵", "Construir casas 🧱", "Pescar y vender pescado 🐟"];
const EARN_NO = ["Dormir la siesta 😴", "Mirar televisión 📺", "Jugar en el parque 🛝", "Comer un helado 🍦", "Saltar la cuerda 🤸", "Leer un cuento en la cama 📖", "Gastar la propina en dulces 🍬", "Ir de paseo al río 🏞️", "Bañarse por la mañana 🛁", "Jugar a las escondidas 🙈", "Cantar en la ducha 🎶", "Tomar el desayuno 🥛"];

const GIFT: Item[] = [
  ["La abuela le da 5 soles a Rosa por su cumpleaños. ¿Es un regalo o dinero ganado?", "Es un regalo", ["Es dinero ganado", "Es un préstamo"]],
  ["Hugo vende galletas y recibe 3 soles. ¿Es un regalo o dinero ganado?", "Es dinero ganado", ["Es un regalo", "Es un préstamo"]],
  ["El tío le da 2 soles a Mía por Navidad. ¿Es un regalo o dinero ganado?", "Es un regalo", ["Es dinero ganado", "Es un préstamo"]],
  ["La mamá de Leo trabaja en una tienda y le pagan. ¿Es un regalo o dinero ganado?", "Es dinero ganado", ["Es un regalo", "Es un préstamo"]],
  ["Ana lava el carro del vecino y él le paga. ¿Es un regalo o dinero ganado?", "Es dinero ganado", ["Es un regalo", "Es un préstamo"]],
  ["El padrino le da una propina a Luis porque lo quiere mucho. ¿Es un regalo o dinero ganado?", "Es un regalo", ["Es dinero ganado", "Es un préstamo"]],
  ["Don Pedro vende choclos en el mercado y recibe monedas. ¿Es un regalo o dinero ganado?", "Es dinero ganado", ["Es un regalo", "Es un préstamo"]],
  ["A Rosa le dan 1 sol de sorpresa en su santo. ¿Es un regalo o dinero ganado?", "Es un regalo", ["Es dinero ganado", "Es un préstamo"]],
  ["La señora Carmen teje chompas y las vende. ¿Es un regalo o dinero ganado?", "Es dinero ganado", ["Es un regalo", "Es un préstamo"]],
  ["Los abuelos le dan a Hugo una alcancía con monedas por su cumpleaños. ¿Es un regalo o dinero ganado?", "Es un regalo", ["Es dinero ganado", "Es un préstamo"]],
];

const JOBS: Item[] = [
  ["¿Qué debe saber hacer un cocinero? 👨‍🍳", "Preparar comida", ["Manejar un avión", "Curar animales", "Apagar incendios"]],
  ["¿Qué debe saber hacer una doctora? 🩺", "Cuidar a los enfermos", ["Hornear pan", "Arreglar carros", "Pintar casas"]],
  ["¿Qué debe saber hacer un chofer? 🚌", "Manejar un bus", ["Cortar el pelo", "Sembrar papas", "Coser ropa"]],
  ["¿Qué debe saber hacer una maestra? 👩‍🏫", "Enseñar a los niños", ["Pescar en el mar", "Construir puentes", "Volar un avión"]],
  ["¿Qué debe saber hacer un bombero? 🚒", "Apagar incendios", ["Vender fruta", "Tocar guitarra", "Hacer zapatos"]],
  ["¿Qué debe saber hacer un panadero? 🍞", "Hacer pan", ["Sacar muelas", "Manejar un tren", "Cuidar ovejas"]],
  ["¿Qué debe saber hacer una piloto? ✈️", "Volar un avión", ["Cocinar sopa", "Cortar madera", "Ordeñar vacas"]],
  ["¿Qué debe saber hacer un agricultor? 🌽", "Sembrar y cosechar", ["Arreglar dientes", "Dirigir el tránsito", "Dibujar planos"]],
  ["¿Qué debe saber hacer una veterinaria? 🐶", "Curar a los animales", ["Construir casas", "Vender periódicos", "Reparar relojes"]],
  ["¿Qué debe saber hacer un carpintero? 🪚", "Trabajar la madera", ["Poner inyecciones", "Cantar ópera", "Pescar truchas"]],
  ["¿Qué debe saber hacer un músico? 🎸", "Tocar un instrumento", ["Pegar ladrillos", "Curar gripes", "Manejar un taxi"]],
  ["¿Qué debe saber hacer una costurera? 🧵", "Coser ropa", ["Hacer helados", "Apagar el fuego", "Criar gallinas"]],
];

const NEEDS: [string, boolean][] = [["Agua para beber 💧", true], ["Comida 🍲", true], ["Una casa donde vivir 🏠", true], ["Ropa para abrigarse 🧥", true], ["Zapatos 👟", true], ["Medicinas cuando estás enfermo 💊", true], ["Un videojuego 🎮", false], ["Caramelos 🍬", false], ["Un robot de juguete 🤖", false], ["Una pelota nueva ⚽", false], ["Un helado 🍦", false], ["Globos 🎈", false], ["Una muñeca 🪆", false], ["Stickers ⭐", false]];

export function financial(r: Rng, kind: "earn" | "gift" | "jobs" | "needs"): Question {
  if (kind === "needs") {
    const [thing, need] = r.pick(NEEDS);
    return { kind: "choice", prompt: `${thing}\n¿Es una necesidad o un deseo?`, options: ["Necesidad", "Deseo"], answer: need ? "Necesidad" : "Deseo", explanation: need ? "Es una necesidad: lo necesitamos para vivir." : "Es un deseo: nos gusta, pero podemos vivir sin eso.", tag: need ? "necesidad" : "deseo" };
  }
  if (kind === "earn") {
    const answer = r.pick(EARN_YES);
    return pickQ(r, r.pick(["¿Cuál es una forma de ganar dinero?", "¿Con cuál de estas actividades se gana dinero?", "Luis quiere ganar dinero. ¿Qué puede hacer?"]), answer, EARN_NO, `Se gana dinero trabajando o vendiendo algo: ${answer}.`);
  }
  if (kind === "jobs") {
    const [prompt, answer] = r.pick(JOBS);
    return pickQ(r, prompt, answer, JOBS.map((j) => j[1]), `Respuesta: ${answer}.`);
  }
  const [prompt, answer, wrong] = r.pick(GIFT);
  return { kind: "choice", prompt, options: [answer, ...wrong].sort(), answer, explanation: answer === "Es un regalo" ? "Es un regalo: se lo dan sin trabajar." : "Es dinero ganado: lo recibe por su trabajo." };
}
