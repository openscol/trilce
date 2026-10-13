import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { fmt } from "./bignumbers";

// Piezas comunes de los generadores de 4.° en adelante: armar preguntas,
// distractores numéricos, números en palabras, fracciones y decimales.

export { fmt };

export const txt = (text: string): Visual => ({ kind: "text", text });
const vis = (v?: Visual | string) => (typeof v === "string" ? txt(v) : v);

export function numQ(answer: number, prompt: string, visual: Visual | string | undefined, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: vis(visual), answer, explanation, tag };
}

// Opción múltiple: la respuesta más hasta tres distractores distintos.
export function choiceQ(r: Rng, prompt: string, answer: string, distractors: string[], explanation: string, visual?: Visual | string, tag?: string): Question {
  const set = new Set<string>([answer]);
  for (const d of r.shuffle(distractors)) {
    if (set.size >= 4) break;
    set.add(d);
  }
  return { kind: "choice", prompt, visual: vis(visual), options: r.shuffle([...set]), answer, explanation, tag };
}

// Opciones en un orden fijo (símbolos, Sí/No, listas ordenadas).
export function fixedQ(prompt: string, options: string[], answer: string, explanation: string, visual?: Visual | string, tag?: string): Question {
  return { kind: "choice", prompt, visual: vis(visual), options, answer, explanation, tag };
}

export const yesNo = (prompt: string, yes: boolean, explanation: string, visual?: Visual | string, tag?: string) =>
  fixedQ(prompt, ["Sí", "No"], yes ? "Sí" : "No", explanation, visual, tag ?? (yes ? "si" : "no"));

export const trueFalse = (prompt: string, isTrue: boolean, explanation: string, visual?: Visual | string, tag?: string) =>
  fixedQ(prompt, ["Verdadero", "Falso"], isTrue ? "Verdadero" : "Falso", explanation, visual, tag ?? (isTrue ? "verdadero" : "falso"));

export const SYMBOLS = ["<", "=", ">"];
export const sym = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");
export const symbolQ = (a: number, b: number, left: string, right: string, explanation: string, prompt = "Elige el símbolo correcto.") =>
  fixedQ(prompt, SYMBOLS, sym(a, b), explanation, `${left}  ?  ${right}`, sym(a, b));

export function multiQ(prompt: string, options: string[], answers: string[], explanation: string, visual?: Visual | string, tag?: string): Question {
  return { kind: "multi", prompt, visual: vis(visual), options, answers, explanation, tag };
}

export function orderQ(r: Rng, prompt: string, sorted: string[], explanation: string, visual?: Visual | string, tag?: string): Question {
  return { kind: "sequence", prompt, visual: vis(visual), tiles: r.shuffle(sorted), reuse: false, length: sorted.length, answer: sorted, explanation, tag };
}

// Distractores numéricos cercanos a `answer`: errores de ±1, ±10, ±100... (nunca negativos).
export function nearNums(r: Rng, answer: number, extra: number[] = []): number[] {
  const out = new Set<number>(extra.filter((x) => x >= 0 && x !== answer));
  const mags = [1, 10, 100, 1000, 10000, 100000].filter((m) => m <= Math.max(1, answer));
  let guard = 0;
  while (out.size < 6 && guard++ < 60) {
    const c = answer + r.pick([-2, -1, 1, 2]) * r.pick(mags);
    if (c >= 0 && c !== answer) out.add(c);
  }
  return [...out];
}

// Respuesta numérica como opción múltiple (para no escribir números largos o con formato).
export function numChoice(r: Rng, prompt: string, answer: number, explanation: string, visual?: Visual | string, tag?: string, extra: number[] = [], show: (n: number) => string = fmt): Question {
  return choiceQ(r, prompt, show(answer), nearNums(r, answer, extra).map(show), explanation, visual, tag);
}

export const table = (headers: string[] | undefined, rows: string[][], title?: string): Visual => ({ kind: "table", headers, rows, title });

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
export const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
export const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

// `count` enteros distintos entre min y max.
export function distinct(r: Rng, count: number, min: number, max: number, ok: (n: number) => boolean = () => true): number[] {
  const set = new Set<number>();
  let guard = 0;
  while (set.size < count && guard++ < 500) {
    const n = r.int(min, max);
    if (ok(n)) set.add(n);
  }
  return [...set];
}

// Entero de `digits` cifras.
export const nDigits = (r: Rng, digits: number) => r.int(10 ** (digits - 1), 10 ** digits - 1);

export const NAMES = ["Ana", "Luis", "Rosa", "Mateo", "Lucía", "Diego", "Carla", "Hugo", "Sofía", "Pablo", "Elena", "Bruno", "Valeria", "Omar", "Camila", "Renzo"];
export const twoNames = (r: Rng) => r.shuffle(NAMES).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Números en palabras (hasta 999 999 999)

const UNITS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const TENS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const HUNDREDS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

// `apocope`: "uno" → "un" (veintiún mil, treinta y un millones).
function below1000(n: number, apocope: boolean): string {
  if (n === 100) return "cien";
  const parts: string[] = [];
  if (n >= 100) parts.push(HUNDREDS[Math.floor(n / 100)]);
  const rest = n % 100;
  if (rest > 0) {
    if (rest < 30) parts.push(apocope && rest === 1 ? "un" : apocope && rest === 21 ? "veintiún" : UNITS[rest]);
    else {
      const u = rest % 10;
      parts.push(TENS[Math.floor(rest / 10)] + (u ? ` y ${apocope && u === 1 ? "un" : UNITS[u]}` : ""));
    }
  }
  return parts.join(" ");
}

export function words(n: number): string {
  if (n === 0) return "cero";
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (millions === 1) parts.push("un millón");
  else if (millions > 1) parts.push(`${below1000(millions, true)} millones`);
  if (thousands === 1) parts.push("mil");
  else if (thousands > 1) parts.push(`${below1000(thousands, true)} mil`);
  if (rest > 0) parts.push(below1000(rest, false));
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Fracciones y decimales

export type Frac = [n: number, d: number];
export const fr = ([n, d]: Frac) => `${n}/${d}`;
export const simp = ([n, d]: Frac): Frac => [n / gcd(n, d), d / gcd(n, d)];
export const fcmp = (a: Frac, b: Frac) => Math.sign(a[0] * b[1] - b[0] * a[1]);
// Número mixto: mixed(11, 4) = "2 3/4"; mixed(8, 4) = "2".
export function mixed(n: number, d: number) {
  const w = Math.floor(n / d);
  const rest = n % d;
  return rest === 0 ? String(w) : w === 0 ? `${rest}/${d}` : `${w} ${rest}/${d}`;
}

// Centésimos → decimal con coma y sin ceros de más: 350 → "3,5"; 347 → "3,47"; 300 → "3".
export function d2(h: number) {
  const whole = Math.floor(h / 100);
  const rest = h % 100;
  if (rest === 0) return fmt(whole);
  return `${fmt(whole)},${rest % 10 === 0 ? rest / 10 : String(rest).padStart(2, "0")}`;
}

// Céntimos → precio: 350 → "S/ 3,50"; 300 → "S/ 3".
export function soles(c: number) {
  return c % 100 === 0 ? `S/ ${fmt(c / 100)}` : `S/ ${fmt(Math.floor(c / 100))},${String(c % 100).padStart(2, "0")}`;
}

// Distractores para una cantidad en centésimos o céntimos. Se mueven en la
// última cifra que usa la respuesta (3,5 → 3,4 y 3,6, no 3,51), para que la
// respuesta no se distinga por su forma. `grain`: paso mínimo (10 = monedas de 10 céntimos).
export function nearCents(r: Rng, answer: number, show: (n: number) => string, extra: number[] = [], grain = 1): string[] {
  const step = Math.max(grain, answer % 10 !== 0 ? 1 : answer % 100 !== 0 ? 10 : 100);
  const out = new Set<number>(extra.filter((x) => x > 0 && x !== answer && x % step === 0));
  let guard = 0;
  while (out.size < 6 && guard++ < 80) {
    const c = answer + r.pick([-2, -1, 1, 2]) * step * r.pick([1, 1, 10]);
    if (c > 0 && c !== answer) out.add(c);
  }
  return [...out].map(show);
}

// ---------------------------------------------------------------------------
// 5.° en adelante

// Operaciones con fracciones (el resultado sale simplificado).
export const fadd = (a: Frac, b: Frac): Frac => simp([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
export const fsub = (a: Frac, b: Frac): Frac => simp([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
export const fmul = (a: Frac, b: Frac): Frac => simp([a[0] * b[0], a[1] * b[1]]);
// Fracción simplificada; si pasa de 1, como número mixto: fshow([9, 6]) = "1 1/2".
export const fshow = (f: Frac) => {
  const [n, d] = simp(f);
  return mixed(n, d);
};

// Milésimos → decimal con coma y sin ceros de más: 3450 → "3,45"; 5 → "0,005".
export function d3(t: number) {
  const whole = Math.floor(t / 1000);
  const rest = String(t % 1000).padStart(3, "0").replace(/0+$/, "");
  return rest ? `${fmt(whole)},${rest}` : fmt(whole);
}

// Distractores para una cantidad en milésimos: se mueven en la última cifra que
// usa la respuesta; `extra` sirve para los errores típicos (coma corrida).
export function nearMil(r: Rng, answer: number, extra: number[] = []): string[] {
  const step = answer % 10 !== 0 ? 1 : answer % 100 !== 0 ? 10 : answer % 1000 !== 0 ? 100 : 1000;
  const out = new Set<number>(extra.filter((x) => x > 0 && x !== answer && Number.isInteger(x)));
  let guard = 0;
  while (out.size < 6 && guard++ < 80) {
    const c = answer + r.pick([-2, -1, 1, 2]) * step * r.pick([1, 1, 10]);
    if (c > 0 && c !== answer) out.add(c);
  }
  return [...out].map(d3);
}

// Respuesta decimal (en milésimos) como opción múltiple.
export function decQ(r: Rng, prompt: string, answer: number, explanation: string, visual?: Visual | string, tag?: string, extra: number[] = []): Question {
  return choiceQ(r, prompt, d3(answer), nearMil(r, answer, extra), explanation, visual, tag);
}

// Respuesta en fracción (simplificada o mixta) como opción múltiple; los
// distractores nunca valen lo mismo que la respuesta.
export function fracQ(r: Rng, prompt: string, answer: Frac, explanation: string, visual?: Visual | string, tag?: string, extra: Frac[] = []): Question {
  const [n, d] = simp(answer);
  const pool: Frac[] = [...extra, [n + 1, d], [n + d, d], [n + 2, d], [n * 2, d], ...(n > 1 ? [[n - 1, d] as Frac] : []), ...(n > d ? [[n - d, d] as Frac] : [[n, d + 1] as Frac, [n + 1, d + 1] as Frac, [n, d * 2] as Frac])];
  const same = (f: Frac) => f[0] * d === n * f[1];
  const wrong = pool.filter((f) => f[0] > 0 && f[1] > 0 && !same(f)).map(fshow);
  return choiceQ(r, prompt, fshow(answer), wrong.filter((w) => w !== fshow(answer)), explanation, visual, tag);
}

// 10³, 10⁴...
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const pow10 = (e: number) => `10${[...String(e)].map((c) => SUP[Number(c)]).join("")}`;

// ---------------------------------------------------------------------------
// 6.° en adelante

// Entero con signo para mostrar: −5, 0, 7 (el signo menos tipográfico, no el guion).
export const sg = (n: number) => (n < 0 ? `−${fmt(-n)}` : fmt(n));
// Entre paréntesis si es negativo, para escribirlo dentro de una operación: 3 + (−5).
export const par = (n: number) => (n < 0 ? `(${sg(n)})` : sg(n));

// Respuesta entera que puede ser negativa: va como opción múltiple (el teclado
// numérico del celular no tiene signo menos). Incluye el error de signo.
export function intQ(r: Rng, prompt: string, answer: number, explanation: string, visual?: Visual | string, tag?: string, extra: number[] = []): Question {
  const pool = new Set<number>([...extra, -answer, answer + 1, answer - 1, answer + 2, answer - 2, -answer + 1, -answer - 1, answer + 10, answer - 10]);
  pool.delete(answer);
  return choiceQ(r, prompt, sg(answer), [...pool].map(sg), explanation, visual, tag);
}

// Porcentaje como texto: 25 → "25 %".
export const pct = (n: number) => `${fmt(n)} %`;
