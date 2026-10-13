import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, d2, d3, fshow, sg } from "../kit";

// Piezas comunes de los generadores de secundaria: números con signo
// (decimales y fracciones), expresiones lineales y el plano de 4 cuadrantes.

export const nz = (r: Rng, max: number) => r.int(1, max) * r.pick([-1, 1]);
export const absGcd = (a: number, b: number): number => (b ? absGcd(b, a % b) : Math.abs(a));

// Decimal con signo, en centésimos: −250 → "−2,5".
export const sdec = (h: number) => (h < 0 ? "−" : "") + d2(Math.abs(h));
// Entre paréntesis si es negativo: 3 × (−2,5).
export const pdec = (h: number) => (h < 0 ? `(${sdec(h)})` : sdec(h));

// Respuesta decimal con signo (centésimos) como opción múltiple; incluye el error de signo.
export function sdecQ(r: Rng, prompt: string, answer: number, explanation: string, visual?: Visual | string, tag?: string, extra: number[] = []): Question {
  const a = Math.abs(answer);
  const step = a % 10 !== 0 ? 1 : a % 100 !== 0 ? 10 : 100;
  const pool = new Set<number>([...extra, -answer, answer + step, answer - step, answer + 2 * step, answer - 2 * step, -answer + step, -answer - step, answer + 10 * step, answer - 10 * step]);
  pool.delete(answer);
  return choiceQ(r, prompt, sdec(answer), [...pool].map(sdec), explanation, visual, tag);
}

// Fracción con signo: el signo va en el numerador y el denominador es positivo.
export type SF = [n: number, d: number];
export const snorm = ([n, d]: SF): SF => {
  const g = absGcd(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, (s * d) / g];
};
export const sfshow = (f: SF) => {
  const [n, d] = snorm(f);
  return n === 0 ? "0" : (n < 0 ? "−" : "") + fshow([Math.abs(n), d]);
};
export const psf = (f: SF) => (snorm(f)[0] < 0 ? `(${sfshow(f)})` : sfshow(f));
export const sfadd = (a: SF, b: SF): SF => snorm([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
export const sfsub = (a: SF, b: SF): SF => snorm([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
export const sfmul = (a: SF, b: SF): SF => snorm([a[0] * b[0], a[1] * b[1]]);
export const sfdiv = (a: SF, b: SF): SF => snorm([a[0] * b[1], a[1] * b[0]]);

// Respuesta en fracción con signo como opción múltiple; ningún distractor vale lo mismo.
export function sfQ(r: Rng, prompt: string, answer: SF, explanation: string, visual?: Visual | string, tag?: string, extra: SF[] = []): Question {
  const [n, d] = snorm(answer);
  const pool: SF[] = [...extra, [-n, d], [n + 1, d], [n - 1, d], [n + d, d], [n - d, d], [n, d + 1], [-n + 1, d], [-n - 1, d], [2 * n, d], [d, n || 1]];
  const shown = sfshow(answer);
  const wrong = pool.filter((f) => f[1] !== 0 && f[0] * d !== n * f[1]).map(sfshow).filter((w) => w !== shown);
  return choiceQ(r, prompt, shown, wrong, explanation, visual, tag);
}

// Expresión lineal: lin(2, 7) = "2x + 7"; lin(−1, −3) = "−x − 3"; lin(0, 5) = "5".
export function lin(a: number, b: number, v = "x") {
  const head = a === 0 ? "" : a === 1 ? v : a === -1 ? `−${v}` : `${sg(a)}${v}`;
  if (!head) return sg(b);
  if (b === 0) return head;
  return `${head} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
}

export type P = { x: number; y: number };
export const pt = (p: P) => `(${sg(p.x)}, ${sg(p.y)})`;
export const plane = (points: (P & { emoji: string })[], connect?: "open" | "closed", size = 6): Visual => ({ kind: "coordPlane", min: -size, max: size, points, connect });
export const plane1 = (points: P[], max = 12): Visual => ({ kind: "coordPlane", max, points: points.map((p) => ({ ...p, emoji: "•" })), connect: "open" });

// Opciones de pares ordenados parecidos al correcto (invertido, signos cambiados, corridos).
export function pointQ(r: Rng, prompt: string, answer: P, explanation: string, visual?: Visual | string, tag?: string, extra: P[] = []): Question {
  const { x, y } = answer;
  const wrong: P[] = [...extra, { x: y, y: x }, { x: -x, y }, { x, y: -y }, { x: -x, y: -y }, { x: x + 1, y }, { x, y: y + 1 }, { x: x - 1, y: y - 1 }];
  return choiceQ(r, prompt, pt(answer), wrong.map(pt).filter((w) => w !== pt(answer)), explanation, visual, tag);
}

// π ≈ 3,14: las medidas de círculos se trabajan en milésimos para que salgan exactas.
export const PI_NOTE = "Usa π ≈ 3,14.";
export const mil = d3;
