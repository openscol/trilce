import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fmt, sg } from "../kit";
import { type P, type SF, pt, snorm } from "../sec1/util";

// Piezas comunes de los generadores de 2.° de secundaria.

const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
// Exponente en superíndice, también negativo: −3 → "⁻³".
export const sup = (e: number) => (e < 0 ? "⁻" : "") + [...String(Math.abs(e))].map((c) => SUPS[Number(c)]).join("");
// Potencia: pw("x", 3) = "x³"; pw("2", −1) = "2⁻¹"; las bases negativas van entre paréntesis.
export const pw = (base: string, e: number) => `${base.startsWith("−") ? `(${base})` : base}${e === 1 ? "" : sup(e)}`;

// Decimal con coma a partir de un número (hasta 4 decimales, sin ceros sobrantes).
export const dec = (n: number) => {
  const t = Number(n.toFixed(4));
  const [i, f] = String(Math.abs(t)).split(".");
  return `${t < 0 ? "−" : ""}${fmt(Number(i))}${f ? `,${f}` : ""}`;
};

// Notación científica: mantisa con coma (2,5) × 10 elevado a e.
export const sciText = (m: number, e: number) => `${dec(m)} × 10${sup(e)}`;

// Raíz: √n y ∛n.
export const sqrtText = (n: number) => `√${n}`;
export const cbrtText = (n: number) => (n < 0 ? `∛(${sg(n)})` : `∛${n}`);

// Recta y = (mn/md)x + b dentro de un plano de −size a size: sus extremos en el borde.
export function lineEnds(mn: number, md: number, b: number, size = 6): { from: P; to: P } | null {
  const ys = (x: number) => b + (mn * x) / md;
  const xs = (y: number) => ((y - b) * md) / mn;
  const cands: P[] = [];
  for (const x of [-size, size]) {
    const y = ys(x);
    if (y >= -size - 1e-9 && y <= size + 1e-9) cands.push({ x, y });
  }
  if (mn !== 0) {
    for (const y of [-size, size]) {
      const x = xs(y);
      if (x > -size + 1e-9 && x < size - 1e-9) cands.push({ x, y });
    }
  }
  if (cands.length < 2) return null;
  cands.sort((p, q) => p.x - q.x);
  return { from: cands[0], to: cands[cands.length - 1] };
}

// Plano con una o más rectas y puntos marcados.
export function linesPlane(lines: { mn: number; md: number; b: number; label?: string }[], points: (P & { emoji?: string })[] = [], size = 6): Visual {
  return {
    kind: "coordPlane",
    min: -size,
    max: size,
    points: points.map((p) => ({ x: p.x, y: p.y, emoji: p.emoji ?? "•" })),
    lines: lines.flatMap((l) => {
      const ends = lineEnds(l.mn, l.md, l.b, size);
      return ends ? [{ ...ends, label: l.label }] : [];
    }),
  };
}

// Recta vertical x = c.
export const verticalLine = (c: number, size = 6) => ({ from: { x: c, y: -size }, to: { x: c, y: size } });

// Pendiente como texto, en fracción impropia: 2, −1/3, 3/2, 0.
export const slopeText = (mn: number, md: number) => {
  const [n, d] = snorm([mn, md]);
  return d === 1 ? sg(n) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`;
};

// Pendiente como opción múltiple (fracciones impropias); ningún distractor vale lo mismo.
export function slopeQ(r: Rng, prompt: string, mn: number, md: number, explanation: string, visual?: Visual, tag?: string, extra: [number, number][] = []): Question {
  const [n, d] = snorm([mn, md]);
  const pool: [number, number][] = [...extra, [-n, d], [d, n || 1], [-d, n || 1], [n + d, d], [n - d, d], [n, d + 1], [2 * n, d]];
  const good = slopeText(n, d);
  const wrong = pool.filter(([a, b]) => b !== 0 && a * d !== n * b).map(([a, b]) => slopeText(a, b));
  return choiceQ(r, prompt, good, [...new Set(wrong)].filter((w) => w !== good), explanation, visual, tag);
}

// Ecuación en forma pendiente-intersección: y = 2x − 3, y = −(1/2)x + 4, y = 5.
export function slopeIntercept(mn: number, md: number, b: number) {
  const [n, d] = snorm([mn, md]);
  let head = "";
  if (n !== 0) {
    const abs = Math.abs(n);
    const coef = d === 1 ? (abs === 1 ? "" : String(abs)) : `(${abs}/${d})`;
    head = `${n < 0 ? "−" : ""}${coef}x`;
  }
  if (!head) return `y = ${sg(b)}`;
  return b === 0 ? `y = ${head}` : `y = ${head} ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}`;
}

// Opciones de ecuaciones de rectas parecidas a la correcta.
export function lineEqQ(r: Rng, prompt: string, mn: number, md: number, b: number, explanation: string, visual?: Visual, tag?: string): Question {
  const good = slopeIntercept(mn, md, b);
  const wrong = [
    slopeIntercept(-mn, md, b),
    slopeIntercept(mn, md, -b),
    slopeIntercept(md, mn === 0 ? 1 : mn, b),
    slopeIntercept(mn, md, b + 1),
    slopeIntercept(mn + md, md, b),
    b !== 0 && md === 1 ? slopeIntercept(b, 1, mn) : slopeIntercept(mn, md, b === 2 ? -2 : 2),
  ].filter((w) => w !== good);
  return choiceQ(r, prompt, good, [...new Set(wrong)], explanation, visual, tag);
}

export { type P, type SF, pt };
