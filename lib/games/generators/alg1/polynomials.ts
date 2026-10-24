import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, gcd, intQ, lcm, numQ, sg } from "../kit";
import { nz } from "../sec1/util";
import { binom, poly, polyAdd, polyMul, sup } from "./util";

// Álgebra 1: polinomios (vocabulario, operaciones, división) y factorización.

const rand = (r: Rng, deg: number, max = 9): number[] => {
  const c = Array.from({ length: deg + 1 }, () => r.int(-max, max));
  if (c[0] === 0) c[0] = nz(r, max);
  return c;
};
// Distractores típicos de un polinomio resultado: un signo cambiado, un coeficiente corrido.
function polyOptions(r: Rng, prompt: string, good: number[], why: string, visual?: Visual | string, tag?: string, extra: number[][] = []): Question {
  const g = poly(good);
  const bad: number[][] = [...extra];
  for (let i = 0; i < good.length; i++) {
    if (good[i] !== 0) bad.push(good.map((c, j) => (j === i ? -c : c)));
    bad.push(good.map((c, j) => (j === i ? c + r.pick([-1, 1, 2]) : c)));
  }
  const wrong = r.shuffle([...new Set(bad.map((b) => poly(b)))].filter((w) => w !== g));
  return choiceQ(r, prompt, g, wrong.slice(0, 5), why, visual, tag);
}

// ---------------------------------------------------------------------------
// Vocabulario y fichas

const NAMES_BY_TERMS = ["", "Monomio", "Binomio", "Trinomio"];
// W.1: vocabulario de polinomios.
export function polyVocabulary(r: Rng): Question {
  const deg = r.int(1, 5);
  const terms = r.int(1, 3);
  const c = Array(deg + 1).fill(0);
  c[0] = nz(r, 9);
  const others = r.shuffle(Array.from({ length: deg }, (_, i) => i + 1)).slice(0, terms - 1);
  others.forEach((i) => (c[i] = nz(r, 9)));
  const shown = poly(c);
  const form = r.int(0, 2);
  if (form === 0) return numQ(deg, `¿Cuál es el grado del polinomio ${shown}?`, undefined, `El grado es el mayor exponente de x: ${deg}.`, "grado");
  if (form === 1) return intQ(r, `¿Cuál es el coeficiente principal de ${shown}?`, c[0], `El coeficiente principal es el que acompaña al término de mayor grado (x${sup(deg)}): ${sg(c[0])}.`, undefined, "coeficiente", [c[c.length - 1], deg]);
  const k = c.filter((x) => x !== 0).length;
  return fixedQ(`¿Cómo se llama el polinomio ${shown} según su número de términos?`, ["Monomio", "Binomio", "Trinomio"], NAMES_BY_TERMS[k], `Tiene ${k} término${k === 1 ? "" : "s"}.`, undefined, "terminos");
}

// Fichas de álgebra de un polinomio de grado 2.
const tiles = (c: number[]): Visual => ({
  kind: "rows",
  rows: [
    { emoji: c[0] < 0 ? "🟥" : "🟦", count: Math.abs(c[0]), label: c[0] < 0 ? "−x²" : "x²" },
    { emoji: c[1] < 0 ? "🟧" : "🟩", count: Math.abs(c[1]), label: c[1] < 0 ? "−x" : "x" },
    { emoji: c[2] < 0 ? "🔻" : "🟨", count: Math.abs(c[2]), label: c[2] < 0 ? "−1" : "1" },
  ].filter((row) => row.count > 0),
});

// W.2 / W.3: representar polinomios con fichas (y sumarlos o restarlos).
export function polyTiles(r: Rng, operate: boolean): Question {
  const a: number[] = [r.int(-3, 3), r.int(-4, 4), r.int(-5, 5)];
  if (a[0] === 0) a[0] = 2;
  if (!operate) return polyOptions(r, "¿Qué polinomio representan las fichas de álgebra?", a, "Cada ficha grande es x², cada barra es x y cada cuadradito es 1; las fichas negativas restan.", tiles(a), "representar");
  const b: number[] = [r.int(-3, 3), r.int(-4, 4), r.int(-5, 5)];
  const minus = r.chance(0.4);
  const res = polyAdd(a, minus ? b.map((x) => -x) : b);
  return polyOptions(r, `Las fichas de arriba muestran A = ${poly(a)}. ¿Cuánto es A ${minus ? "−" : "+"} (${poly(b)})?`, res, `Se juntan las fichas del mismo tipo${minus ? " (restar es sumar el opuesto)" : ""}; un par positivo-negativo se anula: ${poly(res)}.`, tiles(a), minus ? "restar" : "sumar");
}

// W.4 / W.5: sumar y restar polinomios (también para hallar perímetros).
export function addSubPoly(r: Rng, perimeter = false): Question {
  if (perimeter) {
    const sides = [rand(r, 1, 6), rand(r, 1, 6), rand(r, 1, 6)].map((s) => [Math.abs(s[0]), Math.abs(s[1]) + 1]);
    const total = sides.reduce((acc, s) => polyAdd(acc, s), [0]);
    return polyOptions(r, `Un triángulo tiene lados ${sides.map((s) => poly(s)).join(", ")}. ¿Cuál es su perímetro?`, total, "Se suman los tres lados juntando términos semejantes.", undefined, "perimetro");
  }
  const a = rand(r, 2), b = rand(r, 2);
  const minus = r.chance(0.5);
  const res = polyAdd(a, minus ? b.map((x) => -x) : b);
  return polyOptions(r, "Simplifica.", res, minus ? "Restar un polinomio es sumar el opuesto de cada término." : "Se suman los términos semejantes.", `(${poly(a)}) ${minus ? "−" : "+"} (${poly(b)})`, minus ? "restar" : "sumar", minus ? [polyAdd(a, [b[0] * -1, b[1], b[2]])] : []);
}

// ---------------------------------------------------------------------------
// Multiplicación

// W.6: multiplicar un polinomio por un monomio.
export function monomialTimesPoly(r: Rng): Question {
  const k = nz(r, 6), e = r.int(1, 2);
  const p = rand(r, 2, 7);
  const mono = [k, ...Array(e).fill(0)];
  const res = polyMul(mono, p);
  return polyOptions(r, "Multiplica.", res, `Se multiplica ${poly(mono)} por cada término: se multiplican los coeficientes y se suman los exponentes.`, `${poly(mono)}(${poly(p)})`, "monomio", [polyMul([k], p)]);
}

// W.7 / W.8 / W.10: multiplicar dos binomios (también con fichas o modelo de área).
export function multiplyBinomials(r: Rng, model: "none" | "tiles" | "area"): Question {
  const a = model === "tiles" ? 1 : r.pick([1, 1, 2, 3]), b = nz(r, 7), c = model === "tiles" ? 1 : r.pick([1, 2, 3]), d = nz(r, 7);
  const res = polyMul([a, b], [c, d]);
  let visual: Visual | string = `${binom(a, b)}${binom(c, d)}`;
  if (model !== "none") visual = { kind: "areaModel", top: [poly([c, 0]), sg(d)], side: [poly([a, 0]), sg(b)], cells: [[poly([a * c, 0, 0]), poly([a * d, 0])], [poly([b * c, 0]), sg(b * d)]] };
  return polyOptions(r, model === "none" ? "Multiplica." : `El modelo muestra el producto ${binom(a, b)}${binom(c, d)}. ¿Cuál es el resultado?`, res, `Se multiplica cada término por cada término: ${[poly([a * c, 0, 0]), poly([a * d, 0]), poly([b * c, 0]), sg(b * d)].map((t) => (t.startsWith("−") ? `(${t})` : t)).join(" + ")} = ${poly(res)}.`, visual, model, [[a * c, a * d + b * c, -b * d], [a * c, 0, b * d]]);
}

// W.9: productos notables.
export function specialProducts(r: Rng): Question {
  const a = r.pick([1, 1, 2, 3]), b = r.int(1, 9);
  const kind = r.int(0, 2);
  const [p, q] = kind === 0 ? [[a, b], [a, b]] : kind === 1 ? [[a, -b], [a, -b]] : [[a, b], [a, -b]];
  const res = polyMul(p, q);
  const shown = kind === 2 ? `${binom(p[0], p[1])}${binom(q[0], q[1])}` : `${binom(p[0], p[1])}²`;
  const why = ["(a + b)² = a² + 2ab + b²", "(a − b)² = a² − 2ab + b²", "(a + b)(a − b) = a² − b²"][kind];
  return polyOptions(r, "Multiplica.", res, `${why}: ${poly(res)}.`, shown, ["cuadrado-suma", "cuadrado-resta", "suma-por-diferencia"][kind], [[a * a, 0, b * b], [a * a, 0, -b * b], [a * a, a * b, b * b]]);
}

// W.11 / W.12: multiplicar polinomios (también para hallar áreas).
export function multiplyPolys(r: Rng, area = false): Question {
  if (area) {
    const l = [r.int(1, 3), r.int(1, 8)], w = [r.int(1, 3), r.int(-3, 6) || 2];
    const res = polyMul(l, w);
    return polyOptions(r, `Un rectángulo mide ${poly(l)} de largo y ${poly(w)} de ancho. ¿Cuál es su área?`, res, `Área = largo × ancho = ${binom(l[0], l[1])}${binom(w[0], w[1])} = ${poly(res)}.`, undefined, "area");
  }
  const p = [1, nz(r, 5)], q = rand(r, 2, 5);
  const res = polyMul(p, q);
  return polyOptions(r, "Multiplica.", res, "Se multiplica cada término del binomio por cada término del trinomio y se juntan los términos semejantes.", `${binom(p[0], p[1])}(${poly(q)})`, "trinomio");
}

// W.13: sumar, restar y multiplicar polinomios.
export function polyMixed(r: Rng): Question {
  const k = r.int(0, 2);
  if (k === 0) return addSubPoly(r);
  if (k === 1) return multiplyBinomials(r, "none");
  return monomialTimesPoly(r);
}

// W.14: dividir polinomios entre monomios.
export function dividePolyMonomial(r: Rng): Question {
  const k = r.pick([2, 3, 4, 5, -2, -3]), e = r.int(1, 2);
  const q = rand(r, 2, 6);
  const mono = [k, ...Array(e).fill(0)];
  const dividend = polyMul(mono, q);
  return polyOptions(r, "Divide.", q, `Se divide cada término entre ${poly(mono)}: se dividen los coeficientes y se restan los exponentes.`, `(${poly(dividend)}) ÷ ${k < 0 ? `(${poly(mono)})` : poly(mono)}`, "monomio");
}

// W.15: división larga de polinomios (entre x − a).
export function polyLongDivision(r: Rng): Question {
  const a = nz(r, 5), q = rand(r, 1, 6).map((x, i) => (i === 0 ? Math.abs(x) : x));
  const rem = r.chance(0.4) ? nz(r, 5) : 0;
  const dividend = polyAdd(polyMul([1, -a], q), [rem]);
  const good = rem ? `${poly(q)} con residuo ${sg(rem)}` : poly(q);
  const wrong = [rem ? `${poly(q)} con residuo ${sg(-rem)}` : `${poly(q)} con residuo ${sg(a)}`, poly([q[0], q[1] + 2 * a * q[0]]) + (rem ? ` con residuo ${sg(rem)}` : ""), poly([q[0], -q[1]]) + (rem ? ` con residuo ${sg(rem)}` : ""), poly([q[0], q[1] + 1])].filter((w) => w !== good);
  return choiceQ(r, "Divide.", good, wrong, `Se divide término a término: ${poly(dividend)} = (x ${a < 0 ? "+" : "−"} ${Math.abs(a)})(${poly(q)})${rem ? ` ${rem < 0 ? "−" : "+"} ${Math.abs(rem)}` : ""}.`, `(${poly(dividend)}) ÷ (x ${a < 0 ? "+" : "−"} ${Math.abs(a)})`, rem ? "con-residuo" : "exacta");
}

// ---------------------------------------------------------------------------
// Factorización

// Monomio con dos variables: 12x³y².
const mono = (c: number, ex: number, ey: number) => `${c === 1 ? "" : c === -1 ? "−" : sg(c)}${ex ? `x${ex > 1 ? sup(ex) : ""}` : ""}${ey ? `y${ey > 1 ? sup(ey) : ""}` : ""}` || "1";

// X.1 / X.2: M. C. D. y m. c. m. de monomios.
export function monomialGcfLcm(r: Rng, lcmMode: boolean): Question {
  const g = r.int(2, 6), a = g * r.int(1, 5), b = g * r.int(1, 5);
  const [ax, bx, ay, by] = [r.int(1, 4), r.int(1, 4), r.int(0, 3), r.int(0, 3)];
  const coef = lcmMode ? lcm(a, b) : gcd(a, b);
  const ex = lcmMode ? Math.max(ax, bx) : Math.min(ax, bx), ey = lcmMode ? Math.max(ay, by) : Math.min(ay, by);
  const good = mono(coef, ex, ey);
  const wrong = [mono(lcmMode ? gcd(a, b) : lcm(a, b), ex, ey), mono(coef, lcmMode ? Math.min(ax, bx) : Math.max(ax, bx), ey), mono(coef, ex, lcmMode ? Math.min(ay, by) : Math.max(ay, by)), mono(a * b, ax + bx, ay + by)];
  return choiceQ(r, `¿Cuál es el ${lcmMode ? "mínimo común múltiplo" : "máximo común divisor"} de ${mono(a, ax, ay)} y ${mono(b, bx, by)}?`, good, [...new Set(wrong)].filter((w) => w !== good), lcmMode ? "m. c. m. de los coeficientes y cada variable con su mayor exponente." : "M. C. D. de los coeficientes y cada variable común con su menor exponente.", undefined, lcmMode ? "mcm" : "mcd");
}

// X.3: sacar un monomio como factor común.
export function factorMonomial(r: Rng): Question {
  const k = r.int(2, 6), e = r.int(0, 2);
  const inner = rand(r, 2, 5);
  const g0 = inner.reduce((acc, c) => gcd(acc, Math.abs(c)), 0);
  if (g0 !== 1 || inner[inner.length - 1] === 0) return factorMonomial(r);
  const m = [k, ...Array(e).fill(0)];
  const full = polyMul(m, inner);
  const good = `${poly(m)}(${poly(inner)})`;
  const wrong = [`${poly([k])}(${poly(polyMul(Array(e + 1).fill(0).map((_, i) => (i === 0 ? 1 : 0)), inner))})`, `${poly(m)}(${poly(inner.map((c, i) => (i === 1 ? -c : c)))})`, `${poly([k * 2, ...Array(e).fill(0)])}(${poly(inner)})`, `${poly(m)}(${poly(polyAdd(inner, [1]))})`];
  return choiceQ(r, "Factoriza sacando el factor común.", good, [...new Set(wrong)].filter((w) => w !== good), `El factor común de todos los términos es ${poly(m)}; al dividir cada término entre él queda ${poly(inner)}.`, poly(full), "factor-comun");
}

const fac = (a: number, b: number, c: number, d: number) => {
  const f1 = binom(a, b), f2 = binom(c, d);
  return f1 === f2 ? `${f1}²` : `${f1}${f2}`;
};
// X.4 / X.5 / X.6: factorizar trinomios (coeficiente principal 1 u otro).
export function factorQuadratic(r: Rng, lead: "one" | "other" | "tiles"): Question {
  const a = lead === "other" ? r.pick([2, 3, 5]) : 1;
  const b = nz(r, 8), d = nz(r, 8);
  if (gcd(a, Math.abs(b)) !== 1) return factorQuadratic(r, lead);
  const res = polyMul([a, b], [1, d]);
  if (res[1] === 0) return factorQuadratic(r, lead);
  const good = fac(a, b, 1, d);
  const wrong = [fac(a, -b, 1, -d), fac(a, d, 1, b), fac(a, -b, 1, d), fac(a, b, 1, -d)].filter((w) => w !== good && w !== fac(1, d, a, b));
  return choiceQ(r, "Factoriza.", good, [...new Set(wrong)], a === 1 ? `Se buscan dos números que multiplicados den ${sg(b * d)} y sumados den ${sg(b + d)}: ${sg(b)} y ${sg(d)}.` : `Se prueban factores de ${a} y de ${sg(b * d)} hasta obtener el término del medio ${poly([res[1], 0])}: ${good}.`, lead === "tiles" ? tiles(res) : poly(res), lead);
}

// X.7: casos especiales (trinomio cuadrado perfecto, diferencia de cuadrados).
export function factorSpecial(r: Rng): Question {
  const a = r.pick([1, 1, 2, 3]), b = r.int(1, 9);
  if (gcd(a, b) !== 1) return factorSpecial(r);
  const kind = r.int(0, 2);
  const p = kind === 2 ? [a * a, 0, -b * b] : [a * a, (kind === 0 ? 2 : -2) * a * b, b * b];
  const good = kind === 2 ? `${binom(a, b)}${binom(a, -b)}` : `${binom(a, kind === 0 ? b : -b)}²`;
  const wrong = kind === 2 ? [`${binom(a, -b)}²`, `${binom(a, b)}²`, `${binom(a, b)}${binom(1, -(a * b))}`] : [`${binom(a, kind === 0 ? -b : b)}²`, `${binom(a, b)}${binom(a, -b)}`, `${binom(a, kind === 0 ? b * 2 : -b * 2)}${binom(a, kind === 0 ? 1 : -1)}`];
  return choiceQ(r, "Factoriza.", good, [...new Set(wrong)].filter((w) => w !== good), kind === 2 ? `Diferencia de cuadrados: a² − b² = (a + b)(a − b), con a = ${poly([a, 0])} y b = ${b}.` : `Trinomio cuadrado perfecto: el término del medio es 2 × ${poly([a, 0])} × ${b}.`, poly(p), ["tcp-suma", "tcp-resta", "diferencia-cuadrados"][kind]);
}

// X.8: factorizar por agrupación.
export function factorGrouping(r: Rng): Question {
  const a = nz(r, 6), b = nz(r, 6);
  // (x² + a)(x + b) = x³ + bx² + ax + ab
  const p = [1, b, a, a * b];
  const good = `(x² ${a < 0 ? "−" : "+"} ${Math.abs(a)})${binom(1, b)}`;
  const wrong = [`(x² ${a < 0 ? "+" : "−"} ${Math.abs(a)})${binom(1, b)}`, `(x² ${a < 0 ? "−" : "+"} ${Math.abs(a)})${binom(1, -b)}`, `(x² ${b < 0 ? "−" : "+"} ${Math.abs(b)})${binom(1, a)}`];
  return choiceQ(r, "Factoriza por agrupación.", good, [...new Set(wrong)].filter((w) => w !== good), `Se agrupa: x²(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) ${a < 0 ? "−" : "+"} ${Math.abs(a)}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${good}.`, poly(p), "agrupacion");
}

// X.9: factorizar usando un patrón cuadrático (x⁴ + bx² + c).
export function factorPattern(r: Rng): Question {
  const b = nz(r, 7), d = nz(r, 7);
  if (b + d === 0) return factorPattern(r);
  const p = [1, 0, b + d, 0, b * d];
  const t = (k: number) => `(x² ${k < 0 ? "−" : "+"} ${Math.abs(k)})`;
  const good = `${t(b)}${t(d)}`;
  const wrong = [`${t(-b)}${t(-d)}`, `${t(b)}${t(-d)}`, `${binom(1, b)}${binom(1, d)}`];
  return choiceQ(r, "Factoriza. (Piensa en x⁴ como (x²)².)", good, [...new Set(wrong)].filter((w) => w !== good && w !== `${t(d)}${t(b)}`), `Con u = x² queda u² ${b + d < 0 ? "−" : "+"} ${Math.abs(b + d)}u ${b * d < 0 ? "−" : "+"} ${Math.abs(b * d)} = (u ${b < 0 ? "−" : "+"} ${Math.abs(b)})(u ${d < 0 ? "−" : "+"} ${Math.abs(d)}).`, poly(p), "patron");
}

// X.10: factorizar completamente.
export function factorCompletely(r: Rng): Question {
  const k = r.int(2, 5), b = r.int(1, 7);
  const diff = r.chance(0.5);
  const d = diff ? -b : nz(r, 6);
  const inner = polyMul([1, b], [1, d]);
  if (inner[1] === 0 && !diff) return factorCompletely(r);
  const p = inner.map((c) => c * k);
  const good = `${k}${fac(1, b, 1, d)}`;
  const wrong = [`${k}${fac(1, -b, 1, -d)}`, `${k}(${poly(inner)})`, `${fac(k, b, 1, d)}`, `${k}${fac(1, b, 1, -d)}`];
  return choiceQ(r, "Factoriza completamente.", good, [...new Set(wrong)].filter((w) => w !== good), `Primero se saca el factor común ${k}: ${k}(${poly(inner)}). Luego se factoriza el trinomio: ${good}.`, poly(p), "completa");
}
