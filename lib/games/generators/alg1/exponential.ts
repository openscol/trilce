import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, intQ, sg, soles, table, yesNo } from "../kit";
import { dec } from "../sec2/util";
import { coef, curve, frac, poly, valQ } from "./util";

// Álgebra 1: exponentes racionales, sucesiones recursivas y funciones exponenciales.

// ---------------------------------------------------------------------------
// Exponentes racionales

// Potencia con exponente fraccionario como texto: 8^(2/3).
const rp = (base: string, n0: number, d0: number) => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n0, d0) || 1, n = n0 / k, d = d0 / k;
  return d === 1 ? (n === 1 ? base : `${base}^${n < 0 ? `(${sg(n)})` : n}`) : `${base}^(${frac(n, d)})`;
};
const PERFECT: [number, number, number][] = [[4, 2, 2], [9, 3, 2], [16, 4, 2], [25, 5, 2], [36, 6, 2], [49, 7, 2], [64, 8, 2], [100, 10, 2], [8, 2, 3], [27, 3, 3], [64, 4, 3], [125, 5, 3], [16, 2, 4], [81, 3, 4], [32, 2, 5], [1000, 10, 3]];

// S.1 / S.2: evaluar enteros elevados a exponentes racionales (positivos o también negativos).
export function rationalPower(r: Rng, negative: boolean): Question {
  const [b, k, n] = r.pick(PERFECT);
  const m = r.pick([1, 1, 2, 3].filter((x) => k ** x <= 1000 && x % n !== 0));
  const neg = negative && r.chance(0.5);
  const val = k ** m;
  const good = neg ? `1/${fmt(val)}` : fmt(val);
  const wrong = neg ? [`−${fmt(val)}`, fmt(val), `1/${fmt(k)}`, `−1/${fmt(val)}`] : [fmt(k), fmt(b * m), fmt(k ** (m + 1)), `1/${fmt(val)}`];
  return choiceQ(r, `¿Cuánto vale ${rp(String(b), neg ? -m : m, n)}?`, good, [...new Set(wrong)].filter((w) => w !== good), `El denominador ${n} es la raíz: ${n === 2 ? "√" : `raíz ${n === 3 ? "cúbica" : `${n}.ª`} de `}${b} = ${k}. ${m > 1 ? `Luego se eleva a ${m}: ${k}^${m} = ${fmt(val)}. ` : ""}${neg ? `El exponente negativo da el inverso: 1/${fmt(val)}.` : ""}`, undefined, neg ? "negativo" : "positivo");
}

const fracAdd = (a: [number, number], b: [number, number], sign = 1): [number, number] => {
  const n = a[0] * b[1] + sign * b[0] * a[1], d = a[1] * b[1];
  const g = (x: number, y: number): number => (y ? g(y, x % y) : Math.abs(x));
  const k = g(n, d) || 1;
  return [n / k, d / k];
};
// S.3-S.6: reglas de las potencias con exponentes racionales.
export function rationalExponentRule(r: Rng, rule: "product" | "quotient" | "power" | "mixed"): Question {
  const ru = rule === "mixed" ? r.pick(["product", "quotient", "power"] as const) : rule;
  const v = r.pick(["x", "m", "n", "p"]);
  const e1: [number, number] = [r.int(1, 5), r.pick([2, 3, 4, 5])], e2: [number, number] = [r.int(1, 4), r.pick([2, 3, 4, 6])];
  let res: [number, number], shown: string, why: string, bad: [number, number][];
  if (ru === "product") {
    res = fracAdd(e1, e2);
    shown = `${rp(v, e1[0], e1[1])} · ${rp(v, e2[0], e2[1])}`;
    why = `Se suman los exponentes: ${frac(...e1)} + ${frac(...e2)} = ${frac(...res)}.`;
    bad = [[e1[0] * e2[0], e1[1] * e2[1]], [e1[0] + e2[0], e1[1] + e2[1]], fracAdd(e1, e2, -1)];
  } else if (ru === "quotient") {
    res = fracAdd(e1, e2, -1);
    shown = `${rp(v, e1[0], e1[1])} ÷ ${rp(v, e2[0], e2[1])}`;
    why = `Se restan los exponentes: ${frac(...e1)} − ${frac(...e2)} = ${frac(...res)}.`;
    bad = [fracAdd(e1, e2), [e1[0] * e2[1], e1[1] * e2[0]], [e1[0] - e2[0] || 1, Math.abs(e1[1] - e2[1]) || 2]];
  } else {
    const p = r.pick([2, 3, 4, 6]);
    res = fracAdd([e1[0] * p, e1[1]], [0, 1]);
    shown = `(${rp(v, e1[0], e1[1])})^${p}`;
    why = `Se multiplican los exponentes: ${frac(...e1)} × ${p} = ${frac(...res)}.`;
    bad = [fracAdd(e1, [p, 1]), [e1[0], e1[1] * p], [e1[0] + p, e1[1]]];
  }
  const good = rp(v, res[0], res[1]);
  const wrong = [...new Set(bad.map((b) => rp(v, b[0], b[1])))].filter((w) => w !== good);
  return choiceQ(r, "Simplifica. Escribe el resultado como una sola potencia.", good, wrong, why, shown, ru);
}

// ---------------------------------------------------------------------------
// Sucesiones recursivas

const fnText = (k: number, c: number, kind: "arith" | "geo") => (kind === "arith" ? `f(n) = f(n − 1) ${c < 0 ? "−" : "+"} ${Math.abs(c)}` : `f(n) = ${coef(k)}f(n − 1)`);

// U.5: evaluar fórmulas recursivas.
export function evaluateRecursive(r: Rng): Question {
  const a = r.int(-3, 5), k = r.pick([2, 3, -2]), c = nz0(r, 5), n = r.int(3, 5);
  const terms = [a];
  for (let i = 1; i < n; i++) terms.push(k * terms[i - 1] + c);
  if (Math.abs(terms[n - 1]) > 999) return evaluateRecursive(r);
  return intQ(r, `Una sucesión se define así: f(1) = ${sg(a)} y f(n) = ${sg(k)}f(n − 1) ${c < 0 ? "−" : "+"} ${Math.abs(c)}. ¿Cuánto vale f(${n})?`, terms[n - 1], `Se calcula término a término: ${terms.map((t, i) => `f(${i + 1}) = ${sg(t)}`).join(", ")}.`, undefined, "recursiva", [terms[n - 2], terms[n - 1] + c, k * terms[n - 1]]);
}
const nz0 = (r: Rng, max: number) => r.int(1, max) * r.pick([-1, 1]);

const FORMULAS: [string, boolean][] = [["f(n) = 3n + 2", true], ["f(n) = f(n − 1) + 4", false], ["f(n) = 5 · 2^(n − 1)", true], ["f(n) = 3f(n − 1)", false], ["f(n) = −2n + 10", true], ["f(n) = f(n − 1) − 7", false], ["f(n) = n² + 1", true], ["f(n) = 2f(n − 1) + 1", false]];
// U.6: ¿fórmula explícita o recursiva?
export function explicitOrRecursive(r: Rng): Question {
  const [f, explicit] = r.pick(FORMULAS);
  const O = ["Explícita", "Recursiva"];
  return fixedQ(`¿La fórmula ${f} es explícita o recursiva?`, O, O[explicit ? 0 : 1], explicit ? "Calcula cualquier término directamente a partir de n." : "Cada término se calcula a partir del anterior, f(n − 1).", undefined, explicit ? "explicita" : "recursiva");
}

// Fórmulas explícitas: geométrica a · k^(n − 1) y aritmética a + c(n − 1).
const powK = (k: number) => (k < 0 ? `(${sg(k)})` : String(k));
const geoF = (a: number, k: number, exp = "n − 1") => `f(n) = ${a === 1 ? "" : `${sg(a)} · `}${powK(k)}^(${exp})`.replace("^(n)", "^n");
const arithF = (a: number, c: number, exp = "(n − 1)") => `f(n) = ${sg(a)} ${c < 0 ? "−" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${exp}`;

// U.8: expresiones para sucesiones geométricas.
export function geometricFormula(r: Rng): Question {
  const a = r.int(1, 6), k = r.pick([2, 3, 4, -2, 5]);
  const terms = [0, 1, 2, 3].map((i) => a * k ** i);
  const good = geoF(a, k);
  const wrong = [geoF(k, a), geoF(a, k, "n"), arithF(a, k), `f(n) = ${coef(a * k)}n`].filter((w) => w !== good);
  return choiceQ(r, `¿Qué fórmula explícita describe la sucesión ${terms.map(sg).join(", ")}, …?`, good, [...new Set(wrong)], `Empieza en ${a} y se multiplica por ${sg(k)} cada vez: ${good}.`, undefined, "geometrica");
}

// U.9: escribir una fórmula recursiva.
export function writeRecursive(r: Rng): Question {
  const arith = r.chance(0.5);
  const a = r.int(-5, 9), c = nz0(r, 9), k = r.pick([2, 3, -2, 4]);
  const terms = [0, 1, 2, 3].map((i) => (arith ? a + c * i : a * k ** i));
  if (!arith && a === 0) return writeRecursive(r);
  const good = `f(1) = ${sg(a)}; ${fnText(k, c, arith ? "arith" : "geo")}`;
  const wrong = arith
    ? [`f(1) = ${sg(a)}; ${fnText(k, -c, "arith")}`, `f(1) = ${sg(a + c)}; ${fnText(k, c, "arith")}`, `f(1) = ${sg(a)}; ${fnText(c, c, "geo")}`]
    : [`f(1) = ${sg(a)}; ${fnText(k, k, "arith")}`, `f(1) = ${sg(a * k)}; ${fnText(k, c, "geo")}`, `f(1) = ${sg(a)}; ${fnText(-k, c, "geo")}`];
  return choiceQ(r, `¿Qué fórmula recursiva describe la sucesión ${terms.map(sg).join(", ")}, …?`, good, [...new Set(wrong)].filter((w) => w !== good), arith ? `Primer término ${sg(a)}; cada término es el anterior ${c < 0 ? "menos" : "más"} ${Math.abs(c)}.` : `Primer término ${sg(a)}; cada término es el anterior por ${sg(k)}.`, undefined, arith ? "aritmetica" : "geometrica");
}

// U.10 / U.11: convertir entre fórmulas recursivas y explícitas.
export function convertFormula(r: Rng, toExplicit: boolean): Question {
  const arith = r.chance(0.6);
  const a = r.int(-5, 9) || 2, c = nz0(r, 9), k = r.pick([2, 3, -2, 4]);
  const explicit = arith ? arithF(a, c) : geoF(a, k);
  const recursive = `f(1) = ${sg(a)}; ${fnText(k, c, arith ? "arith" : "geo")}`;
  if (toExplicit) {
    const wrong = arith ? [arithF(c, a), arithF(a, c, "n"), geoF(a, c)] : [geoF(k, a), geoF(a, k, "n"), arithF(a, k)];
    return choiceQ(r, `¿Qué fórmula explícita equivale a ${recursive}?`, explicit, [...new Set(wrong)].filter((w) => w !== explicit), arith ? `Es aritmética: primer término ${sg(a)} y diferencia ${sg(c)}.` : `Es geométrica: primer término ${sg(a)} y razón ${sg(k)}.`, undefined, arith ? "aritmetica" : "geometrica");
  }
  const wrong = arith ? [`f(1) = ${sg(c)}; ${fnText(k, a || 1, "arith")}`, `f(1) = ${sg(a)}; ${fnText(k, -c, "arith")}`, `f(1) = ${sg(a)}; ${fnText(c, c, "geo")}`] : [`f(1) = ${sg(k)}; ${fnText(a, c, "geo")}`, `f(1) = ${sg(a)}; ${fnText(k, k, "arith")}`, `f(1) = ${sg(a * k)}; ${fnText(k, c, "geo")}`];
  return choiceQ(r, `¿Qué fórmula recursiva equivale a ${explicit}?`, recursive, [...new Set(wrong)].filter((w) => w !== recursive), arith ? `Primer término f(1) = ${sg(a)}; se suma ${sg(c)} cada vez.` : `Primer término f(1) = ${sg(a)}; se multiplica por ${sg(k)} cada vez.`, undefined, arith ? "aritmetica" : "geometrica");
}

// ---------------------------------------------------------------------------
// Funciones exponenciales

type Exp = { a: number; b: number; k: number };
const expText = (e: Exp) => {
  const base = e.b < 1 ? "(1/2)" : String(e.b);
  const head = e.a === 1 ? "" : e.a === -1 ? "−" : `${sg(e.a)} · `;
  return `f(x) = ${head}${base}^x${e.k ? ` ${e.k < 0 ? "−" : "+"} ${Math.abs(e.k)}` : ""}`;
};
const expF = (e: Exp) => (x: number) => e.a * e.b ** x + e.k;
const randomExp = (r: Rng, shift = true): Exp => ({ a: r.pick([1, 1, 2, 3, -1]), b: r.pick([2, 3, 0.5, 2]), k: shift ? r.int(-3, 2) : 0 });
const expPlane = (es: Exp[], points: { x: number; y: number }[] = []): Visual => ({ kind: "coordPlane", min: -6, max: 6, points: points.map((p) => ({ ...p, emoji: "•" })), curves: es.map((e) => ({ points: curve(expF(e), -6, 6, 0.05) })) });

// V.1: evaluar una función exponencial.
export function evaluateExponential(r: Rng): Question {
  const e = randomExp(r, false), x = e.b < 1 ? r.int(-3, 1) : r.int(-1, 4);
  const v = expF(e)(x);
  if (Number.isInteger(v)) return intQ(r, `Si ${expText(e)}, ¿cuánto vale f(${sg(x)})?`, v, `f(${sg(x)}) = ${e.a === 1 ? "" : `${sg(e.a)} · `}${e.b < 1 ? "(1/2)" : e.b}^${x < 0 ? `(${sg(x)})` : x} = ${sg(v)}.`, undefined, "entero", [e.a * e.b * x, -v, v * 2]);
  const d = Math.round(1 / Math.abs(v / e.a)) ;
  const good = frac(e.a, d);
  return choiceQ(r, `Si ${expText(e)}, ¿cuánto vale f(${sg(x)})?`, good, [frac(e.a * d, 1), frac(-e.a, d), frac(e.a, d * 2), frac(e.a * x, 1)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Un exponente negativo da el inverso: f(${sg(x)}) = ${good}.`, undefined, "fraccion");
}

// V.2 / V.3 / V.4: graficar y relacionar funciones exponenciales con sus gráficos.
export function matchExponential(r: Rng, mode: "graph" | "match" | "matchShift"): Question {
  const e = randomExp(r, mode === "matchShift");
  if (mode === "graph") {
    const yes = r.chance(0.5);
    const shown = yes ? e : r.pick([{ ...e, b: e.b === 0.5 ? 2 : 0.5 }, { ...e, a: -e.a }, { ...e, k: e.k + 2 }]);
    return yesNo(`¿El gráfico muestra ${expText(e)}?`, yes, `Pasa por (0, ${sg(e.a + e.k)}), ${e.b > 1 ? "crece" : "decrece"} hacia la derecha${e.a < 0 ? " (reflejada: está debajo de la asíntota)" : ""} y se acerca a y = ${sg(e.k)}.`, expPlane([shown], [{ x: 0, y: shown.a + shown.k }]), "graficar");
  }
  const wrong = [{ ...e, b: e.b === 0.5 ? 2 : 0.5 }, { ...e, a: -e.a }, { ...e, k: e.k + (e.k > 0 ? -2 : 2) }, { ...e, a: e.a === 1 ? 3 : 1 }].map(expText);
  return choiceQ(r, "¿Qué función corresponde al gráfico?", expText(e), [...new Set(wrong)].filter((w) => w !== expText(e)), `Corta el eje y en ${sg(e.a + e.k)}, la asíntota horizontal es y = ${sg(e.k)} y ${e.b > 1 ? (e.a > 0 ? "crece" : "decrece") : e.a > 0 ? "decrece" : "crece"} hacia la derecha.`, expPlane([e], [{ x: 0, y: e.a + e.k }]), "relacionar");
}

// V.5 / V.6: dominio y rango de funciones exponenciales.
export function exponentialDomainRange(r: Rng, graph: boolean): Question {
  const e = randomExp(r);
  const domain = r.chance(0.35);
  const range = e.a > 0 ? `y > ${sg(e.k)}` : `y < ${sg(e.k)}`;
  const good = domain ? "Todos los números reales" : range;
  const wrong = domain ? [`x > ${sg(e.k)}`, "x > 0", "Todos los números positivos"] : [e.a > 0 ? `y < ${sg(e.k)}` : `y > ${sg(e.k)}`, "Todos los números reales", `y > ${sg(e.a + e.k)}`, e.a > 0 ? `y ≥ ${sg(e.k)}` : `y ≤ ${sg(e.k)}`];
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de ${graph ? "la función del gráfico" : expText(e)}?`, good, wrong.filter((w) => w !== good), domain ? "Se puede elevar la base a cualquier número: el dominio son todos los reales." : `La función se acerca a y = ${sg(e.k)} sin tocarla y queda ${e.a > 0 ? "encima" : "debajo"}: ${range}.`, graph ? expPlane([e]) : undefined, domain ? "dominio" : "rango");
}

// V.7: escribir funciones exponenciales a partir de tablas y gráficos.
export function writeExponential(r: Rng): Question {
  const a = r.int(1, 5), b = r.pick([2, 3, 4]), dec2 = r.chance(0.3);
  const base = dec2 ? 0.5 : b;
  const xs = [0, 1, 2, 3];
  const ys = xs.map((x) => a * (dec2 ? 8 : 1) * base ** x);
  const A = a * (dec2 ? 8 : 1);
  const bt = dec2 ? "(1/2)" : String(b);
  const good = `f(x) = ${A === 1 ? "" : `${A} · `}${bt}^x`;
  const wrong = [`f(x) = ${bt} · ${A}^x`, `f(x) = ${poly([A, dec2 ? -A / 2 : A * (b - 1)])}`, `f(x) = ${A === 1 ? "" : `${A} · `}${dec2 ? "2" : `(1/${b})`}^x`, `f(x) = ${A + 1} · ${bt}^x`];
  return choiceQ(r, "¿Qué función exponencial describe la tabla?", good, wrong, `f(0) = ${fmt(A)} es el valor inicial y cada valor se multiplica por ${dec2 ? "1/2" : b}.`, table(["x", "f(x)"], xs.map((x, i) => [String(x), dec(ys[i])])), "tabla");
}

const GROWTH: [string, string, string][] = [
  ["La población de un pueblo", "habitantes", "crece"],
  ["El número de bacterias de un cultivo", "bacterias", "crece"],
  ["El valor de una moto", "soles", "baja"],
  ["La cantidad de un medicamento en la sangre", "mg", "baja"],
];
// V.8 / V.9 / V.10: crecimiento y decrecimiento exponencial.
export function exponentialGrowth(r: Rng, mode: "write" | "identify" | "word"): Question {
  const [what, unit, dir] = r.pick(GROWTH);
  const p = r.pick([2, 3, 4, 5, 8, 10, 12, 15, 20, 25]);
  const start = r.pick([200, 500, 800, 1000, 1200, 5000]);
  const factor = dir === "crece" ? 1 + p / 100 : 1 - p / 100;
  if (mode === "write") {
    const good = `y = ${fmt(start)}(${dec(factor)})^x`;
    return choiceQ(r, `${what} es ${fmt(start)} ${unit} y ${dir === "crece" ? "aumenta" : "disminuye"} ${p} % cada año. ¿Qué función da la cantidad y después de x años?`, good, [`y = ${fmt(start)}(${dec(dir === "crece" ? 1 - p / 100 : 1 + p / 100)})^x`, `y = ${fmt(start)}(${dec(p / 100)})^x`, `y = ${fmt(start)} ${dir === "crece" ? "+" : "−"} ${p}x`, `y = ${fmt(start)}(${p})^x`], `${dir === "crece" ? "Aumentar" : "Disminuir"} ${p} % es multiplicar por ${dec(factor)} cada año.`, undefined, dir === "crece" ? "crecimiento" : "decrecimiento");
  }
  if (mode === "identify") {
    const a = r.int(2, 9) * 100;
    const show = r.chance(0.5) ? factor : r.pick([1.5, 0.75, 1.08, 0.9]);
    const grow = show > 1;
    const rate = Math.round(Math.abs(show - 1) * 100);
    if (r.chance(0.5)) return fixedQ(`¿La función y = ${fmt(a)}(${dec(show)})^x representa crecimiento o decrecimiento exponencial?`, ["Crecimiento", "Decrecimiento"], grow ? "Crecimiento" : "Decrecimiento", `La base ${dec(show)} es ${grow ? "mayor" : "menor"} que 1.`, undefined, grow ? "crecimiento" : "decrecimiento");
    return intQ(r, `En la función y = ${fmt(a)}(${dec(show)})^x, ¿en qué porcentaje ${grow ? "crece" : "decrece"} la cantidad en cada período?`, rate, `|${dec(show)} − 1| = ${dec(Math.abs(show - 1))} → ${rate} %.`, undefined, "tasa", [Math.round(show * 100), 100 - rate]);
  }
  const t = r.int(2, 5);
  const val = Math.round(start * factor ** t);
  return valQ(r, `${what} es ${fmt(start)} ${unit} y ${dir === "crece" ? "aumenta" : "disminuye"} ${p} % cada año. ¿Cuánto será después de ${t} años? (Redondea al entero.)`, val, [Math.round(start * (1 + (dir === "crece" ? 1 : -1) * (p / 100) * t)), Math.round(start * factor ** (t - 1)), Math.round(start * factor ** (t + 1))], `${fmt(start)} × ${dec(factor)}^${t} ≈ ${fmt(val)}.`, undefined, dir === "crece" ? "crecimiento" : "decrecimiento");
}

// V.11: interés compuesto: problemas.
export function compoundInterestWord(r: Rng): Question {
  const P = r.pick([1000, 2000, 5000, 10000]), rate = r.pick([2, 3, 4, 5, 6, 8]), t = r.int(2, 6);
  const n = r.pick([1, 2, 4, 12]);
  const A = Math.round(P * (1 + rate / 100 / n) ** (n * t) * 100);
  const per = ["", "anual", "semestral", "", "trimestral", "", "", "", "", "", "", "", "mensual"][n];
  const name = r.pick(NAMES);
  return choiceQ(r, `${name} deposita ${soles(P * 100)} al ${rate} % anual con capitalización ${per}. ¿Cuánto tendrá después de ${t} años? (Redondea al céntimo.)`, soles(A), [soles(Math.round(P * (1 + (rate / 100) * t) * 100)), soles(Math.round(P * (1 + rate / 100) ** t * 100) + (n === 1 ? 1000 : 0)), soles(A + 100), soles(A - 1000)].filter((w, i, all) => w !== soles(A) && all.indexOf(w) === i), `A = P(1 + r/n)^(nt) = ${fmt(P)} × (1 + ${dec(rate / 100)}/${n})^${n * t} ≈ ${soles(A)}.`, undefined, per);
}
