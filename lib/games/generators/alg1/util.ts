import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fmt, sg } from "../kit";
import { type P, sfshow, snorm } from "../sec1/util";
import { dec, sup } from "../sec2/util";

// Piezas comunes de los generadores de Álgebra 1.

// Polinomio a partir de sus coeficientes, del grado mayor al término independiente:
// poly([2, −3, 1]) = "2x² − 3x + 1"; poly([1, 0, −4]) = "x² − 4".
export function poly(coefs: number[], v = "x"): string {
  const n = coefs.length - 1;
  let out = "";
  coefs.forEach((c, i) => {
    if (c === 0) return;
    const e = n - i;
    const abs = Math.abs(c);
    const body = e === 0 ? fmt(abs) : `${abs === 1 ? "" : fmt(abs)}${v}${e === 1 ? "" : sup(e)}`;
    out += out ? ` ${c < 0 ? "−" : "+"} ${body}` : `${c < 0 ? "−" : ""}${body}`;
  });
  return out || "0";
}

// Producto de polinomios (coeficientes del grado mayor al menor).
export function polyMul(a: number[], b: number[]): number[] {
  const out = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return out;
}
// Suma de polinomios alineados por el término independiente.
export function polyAdd(a: number[], b: number[]): number[] {
  const n = Math.max(a.length, b.length);
  const pa = [...Array(n - a.length).fill(0), ...a], pb = [...Array(n - b.length).fill(0), ...b];
  const out = pa.map((x, i) => x + pb[i]);
  while (out.length > 1 && out[0] === 0) out.shift();
  return out;
}

// «x − c» con el signo correcto (y solo «x» si c = 0).
export const xMinus = (c: number, v = "x") => (c === 0 ? v : `${v} ${c < 0 ? "+" : "−"} ${Math.abs(c)}`);
// Coeficiente delante de una variable: 1 → "", −1 → "−", −3 → "−3".
export const coef = (k: number) => (k === 1 ? "" : k === -1 ? "−" : sg(k));

// Binomio (x + b) o (ax + b) como texto.
export const binom = (a: number, b: number, v = "x") => `(${poly([a, b], v)})`;

// Fracción con signo como texto (simplificada, en fracción impropia): 3/2, −1/4, 5.
export const frac = (n: number, d: number) => {
  const [a, b] = snorm([n, d]);
  return b === 1 ? sg(a) : `${a < 0 ? "−" : ""}${Math.abs(a)}/${b}`;
};
export { sfshow };

// Puntos de una curva y = f(x) para dibujarla.
export function curve(f: (x: number) => number, from = -6, to = 6, step = 0.1): P[] {
  const out: P[] = [];
  for (let x = from; x <= to + 1e-9; x += step) {
    const y = f(x);
    if (Number.isFinite(y) && Math.abs(y) < 60) out.push({ x: Number(x.toFixed(4)), y });
  }
  return out;
}

// Plano de −size a size con curvas y puntos.
export function curvePlane(fs: ((x: number) => number)[], points: P[] = [], size = 6, from?: number[]): Visual {
  return {
    kind: "coordPlane",
    min: -size,
    max: size,
    points: points.map((p) => ({ ...p, emoji: "•" })),
    curves: fs.map((f, i) => ({ points: curve(f, from?.[i] ?? -size, size) })),
  };
}

// Recta numérica de −10 a 10.
export const line10 = (extra: Partial<Extract<Visual, { kind: "numberLine" }>> = {}): Visual => ({ kind: "numberLine", min: -10, max: 10, step: 1, labelEvery: 5, ...extra });

// Opción múltiple con números (con signo, decimales con coma), sin repetir valores.
export function valQ(r: Rng, prompt: string, answer: number, wrong: number[], explanation: string, visual?: Visual | string, tag?: string): Question {
  const good = dec(answer);
  const opts = [...new Set(wrong.filter((w) => Number.isFinite(w)).map(dec))].filter((w) => w !== good);
  return choiceQ(r, prompt, good, opts, explanation, visual, tag);
}

export { dec, sup };
