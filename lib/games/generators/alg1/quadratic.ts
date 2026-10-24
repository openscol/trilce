import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, intQ, numQ, sg, table, yesNo } from "../kit";
import { nz, pointQ } from "../sec1/util";
import { linesPlane, pt, slopeIntercept } from "../sec2/util";
import { binom, curve, dec, poly, polyMul, xMinus } from "./util";

// Álgebra 1: funciones cuadráticas, ecuaciones cuadráticas y comparación de
// modelos lineales, cuadráticos y exponenciales.

// ---------------------------------------------------------------------------
// Funciones cuadráticas

type Quad = { a: number; h: number; k: number };
const qf = (q: Quad) => (x: number) => q.a * (x - q.h) ** 2 + q.k;
const coefText = (a: number) => (a === 1 ? "" : a === -1 ? "−" : a === 0.5 ? "(1/2)" : a === -0.5 ? "−(1/2)" : sg(a));
const vertexText = (q: Quad) => `f(x) = ${coefText(q.a)}${q.h === 0 ? "x²" : `(x ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)})²`}${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""}`;
// Forma general (solo con a entero): a x² − 2ah x + (ah² + k).
const standard = (q: Quad) => [q.a, -2 * q.a * q.h, q.a * q.h * q.h + q.k];
const standardText = (q: Quad) => `f(x) = ${poly(standard(q))}`;
const randomQuad = (r: Rng, intA = false): Quad => {
  const a = r.pick(intA ? [1, 1, -1, 2, -2] : [1, 1, -1, 2, -2, 0.5, -0.5]);
  return { a, h: r.int(-3, 3), k: r.int(-4, 4) };
};
const quadPlane = (qs: Quad[], points: { x: number; y: number }[] = []): Visual => ({ kind: "coordPlane", min: -6, max: 6, points: points.map((p) => ({ ...p, emoji: "•" })), curves: qs.map((q) => ({ points: curve(qf(q), -6, 6, 0.05) })) });

// Características de funciones cuadráticas (gráfico o ecuación).
export function quadCharacteristics(r: Rng, graph: boolean): Question {
  const q = randomQuad(r, !graph);
  const visual = graph ? quadPlane([q], [{ x: q.h, y: q.k }]) : vertexText(q);
  const form = r.int(0, 3);
  const prompt = graph ? "Según el gráfico," : "Para la función mostrada,";
  if (form === 0) return pointQ(r, `${prompt} ¿cuál es el vértice?`, { x: q.h, y: q.k }, `En la forma f(x) = a(x − h)² + k el vértice es (h, k) = ${pt({ x: q.h, y: q.k })}.`, visual, "vertice", [{ x: -q.h, y: q.k }]);
  if (form === 1) return choiceQ(r, `${prompt} ¿cuál es el eje de simetría?`, `x = ${sg(q.h)}`, [`x = ${sg(-q.h || 2)}`, `y = ${sg(q.k)}`, `x = ${sg(q.k === q.h ? q.k + 1 : q.k)}`], `El eje de simetría es la recta vertical que pasa por el vértice: x = ${sg(q.h)}.`, visual, "eje");
  if (form === 2) {
    const O = ["Hacia arriba, con un mínimo", "Hacia abajo, con un máximo"];
    return fixedQ(`${prompt} ¿hacia dónde se abre la parábola?`, O, O[q.a > 0 ? 0 : 1], q.a > 0 ? "a es positivo: se abre hacia arriba y el vértice es un mínimo." : "a es negativo: se abre hacia abajo y el vértice es un máximo.", visual, q.a > 0 ? "arriba" : "abajo");
  }
  const y0 = qf(q)(0);
  if (!Number.isInteger(y0)) return quadCharacteristics(r, graph);
  return intQ(r, `${prompt} ¿en qué valor corta la parábola al eje y?`, y0, `f(0) = ${sg(y0)}.`, visual, "corte-y", [q.k, q.h, -y0]);
}

// Completar la tabla de una función cuadrática.
export function quadTable(r: Rng): Question {
  const q = randomQuad(r, true);
  const xs = [q.h - 2, q.h - 1, q.h, q.h + 1, q.h + 2];
  const i = r.int(0, 4);
  return intQ(r, `Completa la tabla de ${standardText(q)}. ¿Qué número va en lugar de «?»?`, qf(q)(xs[i]), `f(${sg(xs[i])}) = ${sg(qf(q)(xs[i]))}.`, table(["x", "f(x)"], xs.map((x, j) => [sg(x), j === i ? "?" : sg(qf(q)(x))])), "tabla", [qf(q)(xs[i]) + q.a, -qf(q)(xs[i])]);
}

// Transformaciones de funciones cuadráticas.
export function quadTransform(r: Rng): Question {
  const q = randomQuad(r);
  if (q.h === 0 && q.k === 0) return quadTransform(r);
  const parts = [q.h ? `${Math.abs(q.h)} ${Math.abs(q.h) === 1 ? "unidad" : "unidades"} a la ${q.h > 0 ? "derecha" : "izquierda"}` : "", q.k ? `${Math.abs(q.k)} hacia ${q.k > 0 ? "arriba" : "abajo"}` : ""].filter(Boolean);
  const good = `Se traslada ${parts.join(" y ")}${q.a < 0 ? " y se refleja respecto del eje x" : ""}`;
  const flip = { ...q, h: -q.h, k: q.k };
  const bad = [flip, { ...q, k: -q.k }, { ...q, a: -q.a }].map((p) => {
    const ps = [p.h ? `${Math.abs(p.h)} ${Math.abs(p.h) === 1 ? "unidad" : "unidades"} a la ${p.h > 0 ? "derecha" : "izquierda"}` : "", p.k ? `${Math.abs(p.k)} hacia ${p.k > 0 ? "arriba" : "abajo"}` : ""].filter(Boolean);
    return `Se traslada ${ps.join(" y ")}${p.a < 0 ? " y se refleja respecto del eje x" : ""}`;
  });
  return choiceQ(r, `¿Cómo se obtiene el gráfico de ${vertexText(q)} a partir del de f(x) = ${coefText(q.a < 0 ? -q.a : q.a)}x²?`, good, [...new Set(bad)].filter((w) => w !== good), `En a(x − h)² + k: h = ${sg(q.h)} mueve en horizontal (el signo dentro del paréntesis es el contrario) y k = ${sg(q.k)} en vertical.`, undefined, "traslacion");
}

// Graficar y relacionar funciones cuadráticas con sus gráficos.
export function quadGraph(r: Rng, mode: "vertex" | "standard" | "match"): Question {
  const q = randomQuad(r, mode !== "vertex");
  const text = mode === "vertex" ? vertexText(q) : standardText(q);
  if (mode === "match") {
    const wrong = [{ ...q, h: -q.h }, { ...q, a: -q.a }, { ...q, k: q.k + 2 }, { ...q, a: q.a * 2 }].map(standardText);
    return choiceQ(r, "¿Qué función corresponde al gráfico?", text, [...new Set(wrong)].filter((w) => w !== text), `El vértice es ${pt({ x: q.h, y: q.k })} y se abre hacia ${q.a > 0 ? "arriba" : "abajo"}; f(0) = ${sg(qf(q)(0))}.`, quadPlane([q], [{ x: q.h, y: q.k }]), "relacionar");
  }
  const yes = r.chance(0.5);
  const shown = yes ? q : r.pick([{ ...q, h: -q.h || 2 }, { ...q, a: -q.a }, { ...q, k: q.k + r.pick([-2, 2]) }]);
  return yesNo(`¿El gráfico muestra ${text}?`, yes, `Vértice ${pt({ x: q.h, y: q.k })}, se abre hacia ${q.a > 0 ? "arriba" : "abajo"}${mode === "standard" ? ` (h = −b ÷ 2a = ${sg(q.h)})` : ""}.`, quadPlane([shown], [{ x: shown.h, y: shown.k }]), mode);
}

// Escribir una función cuadrática en forma de vértice (completando el cuadrado).
export function toVertexForm(r: Rng): Question {
  const q = { ...randomQuad(r, true), a: 1 };
  if (q.h === 0) q.h = r.pick([-2, 2, 3]);
  const good = vertexText(q);
  const wrong = [vertexText({ ...q, h: -q.h }), vertexText({ ...q, k: -q.k }), vertexText({ ...q, k: q.k + q.h * q.h })].filter((w) => w !== good);
  return choiceQ(r, `Escribe ${standardText(q)} en forma de vértice.`, good, [...new Set(wrong)], `Se completa el cuadrado: la mitad de ${sg(-2 * q.h)} es ${sg(-q.h)}; (x ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)})² = ${poly([1, -2 * q.h, q.h * q.h])}, y se ajusta el término independiente: ${good}.`, undefined, "completar");
}

// Dominio y rango de funciones cuadráticas.
export function quadDomainRange(r: Rng, graph: boolean): Question {
  const q = randomQuad(r, !graph);
  const domain = r.chance(0.3);
  const range = q.a > 0 ? `y ≥ ${sg(q.k)}` : `y ≤ ${sg(q.k)}`;
  const good = domain ? "Todos los números reales" : range;
  const wrong = domain ? [`x ≥ ${sg(q.h)}`, `x ≥ ${sg(q.k)}`, "x ≥ 0"] : [q.a > 0 ? `y ≤ ${sg(q.k)}` : `y ≥ ${sg(q.k)}`, `y ≥ ${sg(q.h)}`, "Todos los números reales", q.a > 0 ? `y > ${sg(q.k)}` : `y < ${sg(q.k)}`];
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de ${graph ? "la función del gráfico" : vertexText(q)}?`, good, wrong.filter((w) => w !== good), domain ? "Se puede reemplazar x por cualquier número real." : `El vértice ${pt({ x: q.h, y: q.k })} es un ${q.a > 0 ? "mínimo" : "máximo"}: ${range}.`, graph ? quadPlane([q], [{ x: q.h, y: q.k }]) : undefined, domain ? "dominio" : "rango");
}

// Ceros de una función factorizada / escribir la función a partir de sus ceros.
export function quadZeros(r: Rng, write: boolean): Question {
  const p = r.int(-6, 6), s = r.int(-6, 6), a = r.pick([1, 1, 2, -1, 3]);
  if (p === s || p === 0 || s === 0 || (write && p === -s)) return quadZeros(r, write);
  const f = `${a === 1 ? "" : a === -1 ? "−" : sg(a)}${binom(1, -p)}${binom(1, -s)}`;
  if (write) {
    const good = `f(x) = ${binom(1, -p)}${binom(1, -s)}`;
    return choiceQ(r, `¿Qué función cuadrática (con a = 1) tiene ceros x = ${sg(p)} y x = ${sg(s)}?`, good, [`f(x) = ${binom(1, p)}${binom(1, s)}`, `f(x) = ${binom(1, -p)}${binom(1, s)}`, `f(x) = ${binom(1, p)}${binom(1, -s)}`].filter((w) => w !== good), `Si r es un cero, (x − r) es un factor: (x ${p < 0 ? "+" : "−"} ${Math.abs(p)})(x ${s < 0 ? "+" : "−"} ${Math.abs(s)}).`, undefined, "escribir");
  }
  const [lo, hi] = [Math.min(p, s), Math.max(p, s)];
  return choiceQ(r, `¿Cuáles son los ceros de f(x) = ${f}?`, `x = ${sg(lo)} y x = ${sg(hi)}`, [`x = ${sg(-hi)} y x = ${sg(-lo)}`, `x = ${sg(lo)} y x = ${sg(-hi)}`, `x = ${sg(a)} y x = ${sg(hi)}`].filter((w) => w !== `x = ${sg(lo)} y x = ${sg(hi)}`), "Cada factor vale 0 cuando x es el número que se resta dentro del paréntesis.", undefined, "ceros");
}

// Escribir funciones cuadráticas a partir del vértice o de los ceros y otro punto.
export function quadFromPoints(r: Rng, given: "vertex" | "zeros", form: "vertex" | "standard" | "factored"): Question {
  if (given === "vertex") {
    const q = randomQuad(r, true);
    const x = q.h + r.pick([-2, -1, 1, 2]);
    const P = { x, y: qf(q)(x) };
    const good = form === "vertex" ? vertexText(q) : standardText(q);
    const fmtq = form === "vertex" ? vertexText : standardText;
    const wrong = [{ ...q, a: -q.a }, { ...q, h: -q.h }, { ...q, a: q.a * 2 }, { ...q, k: -q.k }].map(fmtq).filter((w) => w !== good);
    return choiceQ(r, `Una parábola tiene vértice ${pt({ x: q.h, y: q.k })} y pasa por ${pt(P)}. ¿Cuál es su ecuación${form === "standard" ? " en forma general" : " en forma de vértice"}?`, good, [...new Set(wrong)], `f(x) = a(x − h)² + k con el vértice; reemplazando ${pt(P)}: ${sg(P.y)} = a(${sg(x - q.h)})²${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""} → a = ${sg(q.a)}.${form === "standard" ? ` Al desarrollar: ${good}.` : ""}`, undefined, form);
  }
  const p = r.int(-4, 4), s = r.int(-4, 4), a = r.pick([1, -1, 2, -2]);
  if (p === s || p === 0 || s === 0 || p === -s) return quadFromPoints(r, given, form);
  const x = [p, s].includes(0) ? r.pick([-5, 5]) : 0;
  const P = { x, y: a * (x - p) * (x - s) };
  const fact = (k: number) => `f(x) = ${k === 1 ? "" : k === -1 ? "−" : sg(k)}${binom(1, -p)}${binom(1, -s)}`;
  const std = (k: number) => `f(x) = ${poly(polyMul([k], polyMul([1, -p], [1, -s])))}`;
  const f = form === "factored" ? fact : std;
  const good = f(a);
  const wrong = [f(-a), f(a * 2), form === "factored" ? `f(x) = ${a === 1 ? "" : a === -1 ? "−" : sg(a)}${binom(1, p)}${binom(1, s)}` : `f(x) = ${poly(polyMul([a], polyMul([1, p], [1, s])))}`].filter((w) => w !== good);
  return choiceQ(r, `Una parábola corta el eje x en ${sg(p)} y ${sg(s)} y pasa por ${pt(P)}. ¿Cuál es su ecuación${form === "factored" ? " en forma factorizada" : " en forma general"}?`, good, [...new Set(wrong)], `f(x) = a(x − ${par0(p)})(x − ${par0(s)}); con ${pt(P)}: ${sg(P.y)} = a × ${sg((x - p) * (x - s))} → a = ${sg(a)}.`, undefined, form);
}
const par0 = (n: number) => (n < 0 ? `(${sg(n)})` : sg(n));

// Interpretar partes de expresiones cuadráticas: problemas.
export function interpretQuadratic(r: Rng): Question {
  const v = r.pick([10, 15, 20, 25, 30]), h0 = r.int(1, 20);
  const k = r.int(0, 2);
  const shown = `h(t) = −5t² + ${v}t + ${h0}`;
  const opts = ["La altura desde la que se lanza la pelota", "La velocidad inicial de la pelota hacia arriba", "El efecto de la gravedad que frena la pelota", "El tiempo que tarda la pelota en caer"];
  const good = opts[k];
  return choiceQ(r, `Una pelota se lanza hacia arriba. Su altura, en metros, después de t segundos es ${shown}. ¿Qué representa el ${["número " + h0, "número " + v, "−5"][k]}?`, good, opts.filter((o) => o !== good), ["Es h(0): la altura cuando t = 0.", `Es el coeficiente de t: la velocidad inicial, ${v} m/s.`, "Es el término con t²: la gravedad hace que la pelota suba cada vez más lento y luego baje."][k], undefined, ["inicial", "velocidad", "gravedad"][k]);
}

// ---------------------------------------------------------------------------
// Ecuaciones cuadráticas

const sols = (a: number, b: number) => (a === b ? `x = ${sg(a)}` : `x = ${sg(Math.min(a, b))} o x = ${sg(Math.max(a, b))}`);
function solQ(r: Rng, prompt: string, p: number, s: number, why: string, visual?: Visual | string, tag?: string): Question {
  const good = sols(p, s);
  const wrong = [sols(-p, -s), sols(p, -s), sols(-p, s), p === s ? sols(p, -p) : `x = ${sg(Math.max(p, s))}`, sols(p + 1, s + 1)];
  return choiceQ(r, prompt, good, [...new Set(wrong)].filter((w) => w !== good), why, visual, tag);
}

// Resolver con raíces cuadradas.
export function quadSqrt(r: Rng): Question {
  const h = r.int(-5, 5), d = r.int(1, 9), k = r.pick([1, 1, 2, 3]);
  return solQ(r, "Resuelve la ecuación.", h - d, h + d, `${k > 1 ? `Se divide entre ${k}. ` : ""}Se saca raíz: ${xMinus(h)} = ±${d}, así que ${sols(h - d, h + d)}.`, `${k === 1 ? "" : k}${h ? `(${xMinus(h)})` : "x"}² = ${k * d * d}`, "raices");
}

// Producto cero y factorización.
export function quadFactorSolve(r: Rng, factored: boolean): Question {
  const p = r.int(-8, 8), s = r.int(-8, 8), a = factored ? r.pick([1, 2, 3]) : 1;
  if (factored) return solQ(r, "Resuelve la ecuación.", p, s, `Si un producto es 0, algún factor es 0: ${xMinus(p)} = 0 o ${xMinus(s)} = 0.`, `${a === 1 ? "" : a}${p ? binom(1, -p) : "x"}${s ? binom(1, -s) : "x"} = 0`.replace(/^x\(/, "x("), "producto-cero");
  const c = polyMul([1, -p], [1, -s]);
  return solQ(r, "Resuelve la ecuación factorizando.", p, s, `${poly(c)} = ${binom(1, -p)}${binom(1, -s)} = 0, así que ${sols(p, s)}.`, `${poly(c)} = 0`, "factorizar");
}

// Completar el cuadrado.
export function completeSquare(r: Rng): Question {
  const h = nz(r, 9);
  return numQ(h * h, `¿Qué número completa el cuadrado? x² ${h < 0 ? "−" : "+"} ${Math.abs(2 * h)}x + □`, undefined, `Se toma la mitad de ${sg(2 * h)} y se eleva al cuadrado: (${sg(h)})² = ${h * h}. Queda (x ${h < 0 ? "−" : "+"} ${Math.abs(h)})².`, "completar");
}

// Resolver completando el cuadrado o con la fórmula general.
export function quadFormula(r: Rng, method: "square" | "formula"): Question {
  if (r.chance(0.5)) {
    const p = r.int(-7, 7), s = r.int(-7, 7);
    if (p + s === 0) return quadFormula(r, method);
    const c = polyMul([1, -p], [1, -s]);
    return solQ(r, `Resuelve ${method === "square" ? "completando el cuadrado" : "con la fórmula general"}.`, p, s, method === "square" ? `Se completa el cuadrado: (x ${c[1] < 0 ? "−" : "+"} ${dec(Math.abs(c[1]) / 2)})² = ${dec((c[1] / 2) ** 2 - c[2])}; se saca raíz y se despeja.` : `x = (−b ± √(b² − 4ac)) ÷ 2a con a = 1, b = ${sg(c[1])}, c = ${sg(c[2])}: el discriminante es ${c[1] ** 2 - 4 * c[2]}.`, `${poly(c)} = 0`, "enteras");
  }
  const a = method === "square" ? 1 : r.pick([1, 2, 3]), b = nz(r, 7), c = nz(r, 6);
  const D = b * b - 4 * a * c;
  if (D <= 0 || Number.isInteger(Math.sqrt(D)) || (method === "square" && b % 2 !== 0)) return quadFormula(r, method);
  // x = (−b ± k√m) / 2a, simplificado.
  const good = radicalRoots(-b, D, 2 * a);
  const wrong = [radicalRoots(b, D, 2 * a), radicalRoots(-b, b * b + 4 * Math.abs(a * c), 2 * a), radicalRoots(-b, D, a), `x = ${sg(-b)} ± ${D}`];
  const why = method === "square"
    ? `Se pasa ${sg(c)} al otro lado y se suma (${sg(b / 2)})² = ${(b / 2) ** 2}: (x ${b < 0 ? "−" : "+"} ${Math.abs(b / 2)})² = ${(b / 2) ** 2 - c}; se saca raíz: ${good}.`
    : `x = (−b ± √(b² − 4ac)) ÷ 2a = (${sg(-b)} ± √${D}) ÷ ${2 * a}; se simplifica la raíz: ${good}.`;
  return choiceQ(r, method === "square" ? "Resuelve completando el cuadrado." : "Resuelve con la fórmula general.", good, [...new Set(wrong)].filter((w) => w !== good), why, `${poly([a, b, c])} = 0`, "radical");
}

// Raíz cuadrada simplificada √n = k√m.
const simpRoot = (n: number): [number, number] => {
  let k = 1;
  for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; }
  return [k, n];
};
const gcd2 = (a: number, b: number): number => (b ? gcd2(b, a % b) : Math.abs(a));
// Soluciones (p ± √D) / q simplificadas: «x = 3 ± √3», «x = (−2 ± √7) / 3», «x = (1 ± 2√5) / 2».
function radicalRoots(p: number, D: number, q: number): string {
  const [k, m] = simpRoot(Math.abs(D));
  const g = gcd2(gcd2(p, k), q);
  const [P, K, Q] = [p / g, k / g, q / g];
  const rad = `${K === 1 ? "" : K}√${m}`;
  const num = P === 0 ? `±${rad}` : `${sg(P)} ± ${rad}`;
  return Q === 1 ? `x = ${num}` : `x = (${num}) / ${Q}`;
}

// Ecuaciones cuadráticas: problemas.
export function quadWord(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const t = r.int(2, 6), v = 5 * t;
    return numQ(t, `Una pelota se lanza hacia arriba desde el suelo. Su altura es h = −5t² + ${v}t (metros, t en segundos). ¿Después de cuántos segundos vuelve al suelo?`, undefined, `−5t² + ${v}t = 0 → −5t(t − ${t}) = 0 → t = 0 o t = ${t}. Vuelve al suelo a los ${t} s.`, "pelota");
  }
  if (form === 1) {
    const w = r.int(3, 12), d = r.int(2, 6);
    return numQ(w, `Un terreno rectangular mide ${d} m más de largo que de ancho y tiene ${w * (w + d)} m² de área. ¿Cuántos metros mide de ancho?`, undefined, `x(x + ${d}) = ${w * (w + d)} → x² + ${d}x − ${w * (w + d)} = 0 → (x − ${w})(x + ${w + d}) = 0 → x = ${w}.`, "area");
  }
  const n = r.int(4, 15);
  return numQ(n, `El producto de dos números enteros positivos consecutivos es ${n * (n + 1)}. ¿Cuál es el menor?`, undefined, `n(n + 1) = ${n * (n + 1)} → n² + n − ${n * (n + 1)} = 0 → (n − ${n})(n + ${n + 1}) = 0 → n = ${n}.`, "consecutivos");
}

const NROOTS = ["Dos soluciones reales", "Una solución real", "Ninguna solución real"];
// Usar el discriminante.
export function discriminant(r: Rng): Question {
  const kind = r.int(0, 2);
  let a = r.pick([1, 2, 3, -1]), b = nz(r, 8), c: number;
  if (kind === 1) {
    const h = nz(r, 5);
    a = 1;
    b = -2 * h;
    c = h * h;
  } else c = kind === 0 ? r.int(-9, Math.floor((b * b) / (4 * Math.abs(a))) - 1) * Math.sign(a) || -1 : Math.floor((b * b) / (4 * a)) + r.int(1, 6) * Math.sign(a);
  const D = b * b - 4 * a * c;
  const real = D > 0 ? 0 : D === 0 ? 1 : 2;
  if (r.chance(0.4)) return intQ(r, `¿Cuál es el discriminante de ${poly([a, b, c])} = 0?`, D, `b² − 4ac = ${b * b} − 4(${sg(a)})(${sg(c)}) = ${sg(D)}.`, undefined, "valor", [b * b + 4 * a * c, b - 4 * a * c]);
  return fixedQ(`¿Cuántas soluciones reales tiene ${poly([a, b, c])} = 0?`, NROOTS, NROOTS[real], `El discriminante es b² − 4ac = ${sg(D)}: ${D > 0 ? "positivo, dos soluciones" : D === 0 ? "cero, una solución" : "negativo, ninguna solución real"}.`, undefined, ["dos", "una", "ninguna"][real]);
}

// Sistemas de una ecuación lineal y una cuadrática.
export function linearQuadSystem(r: Rng, graph: boolean): Question {
  const p = r.int(-3, 2), s = r.int(p + 1, 3), c = r.int(-3, 1);
  // y = x² + c y la recta que pasa por (p, p² + c) y (s, s² + c).
  const m = p + s, b = c - p * s;
  const P1 = { x: p, y: p * p + c }, P2 = { x: s, y: s * s + c };
  if (Math.abs(P1.y) > 6 || Math.abs(P2.y) > 6) return linearQuadSystem(r, graph);
  const good = `${pt(P1)} y ${pt(P2)}`;
  const wrong = [`${pt({ x: -p, y: P1.y })} y ${pt({ x: -s, y: P2.y })}`, `${pt({ x: P1.y, y: p })} y ${pt({ x: P2.y, y: s })}`, `${pt(P1)} y ${pt({ x: s, y: P2.y + 1 })}`, `Solo ${pt(P1)}`];
  const eqs = `y = ${poly([1, 0, c])}\n${slopeIntercept(m, 1, b)}`;
  const lp = linesPlane([{ mn: m, md: 1, b }]);
  const visual: Visual | string = graph && lp.kind === "coordPlane" ? { ...lp, curves: [{ points: curve((x) => x * x + c) }] } : eqs;
  return choiceQ(r, graph ? `El gráfico muestra y = ${poly([1, 0, c])} y ${slopeIntercept(m, 1, b)}. ¿Cuáles son las soluciones del sistema?` : "Resuelve el sistema.", good, wrong, `Se igualan: ${poly([1, 0, c])} = ${slopeIntercept(m, 1, b).slice(4)} → ${poly([1, -m, c - b])} = 0 → x = ${sg(p)} o x = ${sg(s)}.`, visual, graph ? "grafico" : "algebra");
}

// ---------------------------------------------------------------------------
// Lineal, cuadrática y exponencial

type Model = "lineal" | "cuadrática" | "exponencial";
const MODELS: Model[] = ["lineal", "cuadrática", "exponencial"];
const modelF = (m: Model, r: Rng) => {
  if (m === "lineal") {
    const a = nz(r, 2), b = r.int(-3, 3);
    return { f: (x: number) => a * x + b, text: `y = ${poly([a, b])}` };
  }
  if (m === "cuadrática") {
    const a = r.pick([1, -1, 0.5]), c = r.int(-3, 2);
    return { f: (x: number) => a * x * x + c, text: `y = ${a === 0.5 ? "(1/2)" : a === -1 ? "−" : ""}x² ${c < 0 ? "−" : "+"} ${Math.abs(c)}` };
  }
  const b = r.pick([2, 0.5, 3]), k = r.int(-3, 0);
  return { f: (x: number) => b ** x + k, text: `y = ${b === 0.5 ? "(1/2)" : b}^x ${k < 0 ? "−" : "+"} ${Math.abs(k)}` };
};
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Identificar funciones lineales, cuadráticas y exponenciales (gráficos o tablas).
export function identifyModel(r: Rng, kinds: Model[], show: "graph" | "table"): Question {
  const m = r.pick(kinds);
  const opts = kinds.map(cap);
  if (show === "graph") {
    const { f } = modelF(m, r);
    return fixedQ("¿Qué tipo de función muestra el gráfico?", opts, cap(m), m === "lineal" ? "Es una recta." : m === "cuadrática" ? "Es una parábola (sube y baja de forma simétrica)." : "Crece (o decrece) cada vez más rápido y se acerca a una asíntota horizontal.", { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: curve(f, -6, 6, 0.05) }] }, m);
  }
  const xs = [0, 1, 2, 3, 4];
  const a = r.int(2, 4), b = r.int(1, 5);
  const ys = xs.map((x) => (m === "lineal" ? a * x + b : m === "cuadrática" ? x * x + b : b * a ** x));
  const why = m === "lineal" ? `Las diferencias son iguales (${a}).` : m === "cuadrática" ? "Las primeras diferencias no son iguales, pero las segundas diferencias sí." : `Cada valor se multiplica por ${a}.`;
  return fixedQ("¿Qué tipo de función muestra la tabla?", opts, cap(m), why, table(["x", "y"], xs.map((x, i) => [String(x), fmt(ys[i])])), m);
}

// Escribir funciones lineales y exponenciales (problemas y tablas).
export function writeModel(r: Rng, mode: "word" | "table" | "table3"): Question {
  if (mode === "word") {
    const start = r.pick([100, 200, 500, 1000]), d = r.pick([10, 20, 25, 50]), p = r.pick([2, 3]);
    const lin = r.chance(0.5);
    const name = r.pick(NAMES);
    const good = lin ? `y = ${start} + ${d}x` : `y = ${start}(${p})^x`;
    return choiceQ(r, lin ? `${name} tiene ${start} seguidores y gana ${d} cada semana. ¿Qué función da los seguidores después de x semanas?` : `Un video tiene ${start} vistas y cada día las vistas se multiplican por ${p}. ¿Qué función da las vistas después de x días?`, good, lin ? [`y = ${start}(${d})^x`, `y = ${d} + ${start}x`, `y = ${start} − ${d}x`] : [`y = ${start} + ${p}x`, `y = ${p}(${start})^x`, `y = ${start}(${p}x)`], lin ? "Se suma la misma cantidad cada vez: es lineal." : "Se multiplica por el mismo número cada vez: es exponencial.", undefined, lin ? "lineal" : "exponencial");
  }
  const kinds: Model[] = mode === "table3" ? MODELS : ["lineal", "exponencial"];
  const m = r.pick(kinds);
  const a = r.int(2, 4), b = r.int(1, 6);
  const xs = [0, 1, 2, 3];
  const f = (x: number) => (m === "lineal" ? a * x + b : m === "cuadrática" ? a * x * x + b : b * a ** x);
  const texts = { lineal: `y = ${a}x + ${b}`, cuadrática: `y = ${a}x² + ${b}`, exponencial: `y = ${b === 1 ? "" : `${b} · `}${a}^x` };
  const good = texts[m];
  const wrong = [...Object.values(texts).filter((t) => t !== good), `y = ${a}x + ${b + 1}`, `y = ${b}x + ${a}`].slice(0, 3);
  return choiceQ(r, "¿Qué función describe la tabla?", good, wrong, m === "lineal" ? `Sube ${a} cada vez y empieza en ${b}.` : m === "cuadrática" ? `Las segundas diferencias son constantes; y = ${a}x² + ${b}.` : `Empieza en ${b} y se multiplica por ${a}.`, table(["x", "y"], xs.map((x) => [String(x), fmt(f(x))])), m);
}

// Funciones lineales y exponenciales en intervalos de una unidad.
export function unitIntervals(r: Rng, exponential: boolean): Question {
  const a = r.int(2, 5), b = r.int(1, 9);
  const dec2 = exponential && r.chance(0.3);
  const f = exponential ? `f(x) = ${b} · ${dec2 ? "(1/2)" : a}^x` : `f(x) = ${a}x + ${b}`;
  const good = exponential ? (dec2 ? "Se multiplica por 1/2" : `Se multiplica por ${a}`) : `Aumenta ${a}`;
  const wrong = exponential ? [dec2 ? "Disminuye 1/2" : `Aumenta ${a}`, dec2 ? "Se multiplica por 2" : `Aumenta ${b}`, `Se multiplica por ${b}`] : [`Se multiplica por ${a}`, `Aumenta ${b}`, `Se multiplica por ${b}`];
  return choiceQ(r, `Para ${f}, ¿qué le pasa a f(x) cada vez que x aumenta 1?`, good, wrong.filter((w) => w !== good), exponential ? "En una exponencial, en intervalos iguales el valor se multiplica por el mismo factor (la base)." : "En una lineal, en intervalos iguales el valor cambia en la misma cantidad (la pendiente).", undefined, exponential ? "exponencial" : "lineal");
}

const GROWTH4 = ["Crecimiento lineal", "Decrecimiento lineal", "Crecimiento exponencial", "Decrecimiento exponencial"];
// Describir crecimiento y decrecimiento lineal y exponencial.
export function describeGrowth(r: Rng): Question {
  const k = r.int(0, 3);
  const cases = [
    [`Un ahorro aumenta ${r.int(10, 50)} soles cada mes.`, `y = ${r.int(2, 9)}x + ${r.int(1, 30)}`],
    [`Un tanque pierde ${r.int(5, 20)} litros cada hora.`, `y = ${r.int(50, 200)} − ${r.int(2, 9)}x`],
    [`Una población aumenta ${r.int(2, 9)} % cada año.`, `y = ${r.int(2, 9) * 100}(1,0${r.int(2, 9)})^x`],
    [`Un auto pierde ${r.int(10, 20)} % de su valor cada año.`, `y = ${r.int(20, 60) * 1000}(0,${r.int(80, 90)})^x`],
  ][k];
  return fixedQ(`¿Qué tipo de cambio describe la situación? ${r.chance(0.5) ? cases[0] : `y está dada por ${cases[1]}.`}`, GROWTH4, GROWTH4[k], ["Se suma la misma cantidad cada vez.", "Se resta la misma cantidad cada vez.", "Se multiplica por un factor mayor que 1.", "Se multiplica por un factor entre 0 y 1."][k], undefined, ["crece-lineal", "decrece-lineal", "crece-exp", "decrece-exp"][k]);
}

// Comparar crecimiento lineal, exponencial (y cuadrático).
export function compareGrowth(r: Rng, withQuadratic: boolean): Question {
  const a = r.int(5, 30), b = r.int(1, 10);
  const funcs = [{ name: "f", text: `f(x) = ${a}x + ${b}`, f: (x: number) => a * x + b }, { name: "g", text: "g(x) = 2^x", f: (x: number) => 2 ** x }];
  if (withQuadratic) funcs.push({ name: "h", text: "h(x) = x²", f: (x: number) => x * x });
  const x = r.pick([10, 12, 15]);
  const best = funcs.reduce((m, f) => (f.f(x) > m.f(x) ? f : m));
  if (r.chance(0.5)) return fixedQ(`Compara ${funcs.map((f) => f.text).join(", ")}. ¿Cuál tiene el mayor valor cuando x = ${x}?`, funcs.map((f) => f.name), best.name, `${funcs.map((f) => `${f.name}(${x}) = ${fmt(f.f(x))}`).join("; ")}.`, undefined, "valor");
  const O = ["La exponencial", "La lineal", withQuadratic ? "La cuadrática" : "Las dos crecen igual"];
  return fixedQ(`Compara ${funcs.map((f) => f.text).join(" y ")}. A medida que x crece mucho, ¿cuál termina siendo mayor?`, O, O[0], "Una exponencial con base mayor que 1 termina superando a cualquier lineal o cuadrática.", undefined, "a-largo-plazo");
}

