import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, intQ, numQ, sg, table, yesNo } from "../kit";
import { dec, valQ } from "./util";

// Álgebra 1: desviación estándar, correlación y regresión, permutaciones y
// combinaciones, y matrices.

// ---------------------------------------------------------------------------
// Estadística de una variable

const round = (n: number, k = 1) => Math.round(n * 10 ** k) / 10 ** k;

// II.6 / II.7: desviación estándar de una población o de una muestra.
export function standardDeviation(r: Rng, sample: boolean): Question {
  const n = r.int(4, 6), mean = r.int(5, 20);
  const xs = Array.from({ length: n - 1 }, () => mean + r.int(-6, 6));
  xs.push(mean * n - xs.reduce((a, b) => a + b, 0));
  if (xs.some((x) => x < 0)) return standardDeviation(r, sample);
  const ss = xs.reduce((s, x) => s + (x - mean) ** 2, 0);
  const sd = round(Math.sqrt(ss / (sample ? n - 1 : n)));
  const other = round(Math.sqrt(ss / (sample ? n : n - 1)));
  return valQ(r, `Calcula la desviación estándar de ${sample ? "la muestra" : "la población"}: ${xs.join(", ")}. Redondea a la décima.`, sd, [other, round(ss / (sample ? n - 1 : n)), sd + 0.5, round(sd * 2)], `Media = ${mean}. Suma de los cuadrados de las desviaciones = ${ss}. Se divide entre ${sample ? `n − 1 = ${n - 1}` : `n = ${n}`} y se saca raíz: ≈ ${dec(sd)}.`, undefined, sample ? "muestra" : "poblacion");
}

const MEASURES: [string, string, string[], string][] = [
  ["Los sueldos de una empresa: casi todos ganan entre 1500 y 2500 soles, pero el gerente gana 30 000.", "La mediana y el rango intercuartílico", ["La media y la desviación estándar", "La moda y el rango", "La media y el rango"], "Con un valor atípico tan grande conviene usar medidas resistentes: mediana y rango intercuartílico."],
  ["Las estaturas de los alumnos de un salón: los datos son simétricos y sin valores atípicos.", "La media y la desviación estándar", ["La mediana y el rango intercuartílico", "La moda y el rango", "Solo la moda"], "Con datos simétricos y sin atípicos, la media y la desviación estándar describen bien el centro y la dispersión."],
  ["Los precios de casas en un distrito: la mayoría son baratas y unas pocas muy caras (datos sesgados a la derecha).", "La mediana y el rango intercuartílico", ["La media y la desviación estándar", "La moda y el rango", "La media y el rango"], "Con datos sesgados, la mediana y el rango intercuartílico no se dejan arrastrar por los extremos."],
];
// II.8: elegir medidas de centro y de dispersión apropiadas.
export function chooseMeasures(r: Rng): Question {
  const [text, good, wrong, why] = r.pick(MEASURES);
  return choiceQ(r, `${text} ¿Qué medidas de centro y de dispersión conviene usar?`, good, wrong, why, undefined, "medidas");
}

// ---------------------------------------------------------------------------
// Estadística de dos variables

function cloud(r: Rng, rho: number, n = 10) {
  return Array.from({ length: n }, (_, i) => {
    const x = 1 + i * (9 / (n - 1)) + (r.int(-3, 3) / 10);
    const noise = (r.int(-10, 10) / 10) * 4 * (1 - Math.abs(rho)) + (r.int(-10, 10) / 10) * 0.6;
    const y = 5 + rho * (x - 5.5) * 0.9 + noise * 1.2;
    return { x: round(x), y: Math.max(0.3, Math.min(9.7, round(y))) };
  });
}
const corr = (ps: { x: number; y: number }[]) => {
  const n = ps.length, mx = ps.reduce((s, p) => s + p.x, 0) / n, my = ps.reduce((s, p) => s + p.y, 0) / n;
  const sxy = ps.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0), sxx = ps.reduce((s, p) => s + (p.x - mx) ** 2, 0), syy = ps.reduce((s, p) => s + (p.y - my) ** 2, 0);
  return { r: sxy / Math.sqrt(sxx * syy), m: sxy / sxx, b: my - (sxy / sxx) * mx };
};
const scatter = (ps: { x: number; y: number }[], line?: { m: number; b: number }): Visual => ({ kind: "scatterPlot", xLabel: "x", yLabel: "y", xMax: 10, yMax: 10, xStep: 1, yStep: 1, points: ps, line: line ? { from: { x: 0, y: line.b }, to: { x: 10, y: line.m * 10 + line.b } } : undefined });

// JJ.4: relacionar coeficientes de correlación con diagramas de dispersión.
export function matchCorrelation(r: Rng): Question {
  const levels = [0.95, 0.6, 0, -0.6, -0.95];
  const target = r.pick(levels);
  const ps = cloud(r, target);
  const real = corr(ps).r;
  const opts = ["r ≈ 0,95", "r ≈ 0,6", "r ≈ 0", "r ≈ −0,6", "r ≈ −0,95"];
  // Se elige la opción más cercana al r real de los puntos dibujados.
  const best = levels.reduce((b, l) => (Math.abs(l - real) < Math.abs(b - real) ? l : b));
  const good = opts[levels.indexOf(best)];
  return choiceQ(r, "¿Qué coeficiente de correlación corresponde mejor al diagrama?", good, r.shuffle(opts.filter((o) => o !== good)).slice(0, 3), `Los puntos ${best > 0 ? "suben" : best < 0 ? "bajan" : "no siguen ninguna recta"}${Math.abs(best) > 0.9 ? " y están muy pegados a una recta" : Math.abs(best) > 0.5 ? " con bastante dispersión" : ""}: r ≈ ${dec(best)}.`, scatter(ps), best > 0 ? "positiva" : best < 0 ? "negativa" : "nula");
}

function dataset(r: Rng) {
  const m = r.pick([1, 2, -1, 1.5, 3]), b = r.int(4, 10);
  const xs = [1, 2, 3, 4, 5, 6];
  return xs.map((x) => ({ x, y: Math.max(0, Math.round(m * x + b + r.int(-2, 2))) }));
}

// JJ.5: calcular coeficientes de correlación.
export function calculateCorrelation(r: Rng): Question {
  const ps = dataset(r);
  const c = corr(ps).r;
  if (!Number.isFinite(c)) return calculateCorrelation(r);
  const v = round(c, 2);
  return valQ(r, "Usa una calculadora para hallar el coeficiente de correlación r de los datos. Redondea a la centésima.", v, [round(-v, 2), round(v * v, 2), round(v - 0.1, 2), round(Math.min(1, v + 0.08), 2)].filter((w) => Math.abs(w) <= 1), `Con la calculadora (regresión lineal) r ≈ ${dec(v)}. ${Math.abs(v) > 0.8 ? "Es una correlación fuerte." : "Es una correlación moderada o débil."}`, table(["x", "y"], ps.map((p) => [String(p.x), String(p.y)])), v > 0 ? "positiva" : "negativa");
}

const lineText = (m: number, b: number) => {
  const mm = round(m, 2), bb = round(b, 2);
  const head = mm === 1 ? "x" : mm === -1 ? "−x" : mm === 0 ? "" : `${dec(mm)}x`;
  if (!head) return `y = ${dec(bb)}`;
  return bb === 0 ? `y = ${head}` : `y = ${head} ${bb < 0 ? "−" : "+"} ${dec(Math.abs(bb))}`;
};
// JJ.8: hallar la ecuación de la recta de regresión.
export function regressionLine(r: Rng): Question {
  const ps = dataset(r);
  const { m, b } = corr(ps);
  const good = lineText(m, b);
  return choiceQ(r, "Usa una calculadora para hallar la recta de regresión de los datos. Redondea a la centésima.", good, [lineText(b, m), lineText(-m, b), lineText(m, b + 1), lineText(m + 0.5, b)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `La regresión lineal por mínimos cuadrados da ${good}.`, table(["x", "y"], ps.map((p) => [String(p.x), String(p.y)])), "regresion");
}

const REG_CTX: [string, string, string][] = [
  ["las horas de estudio (x) y la nota del examen (y)", "hora más de estudio", "la nota esperada sin estudiar"],
  ["la temperatura en °C (x) y las bebidas vendidas (y)", "grado más de temperatura", "las bebidas que se venderían a 0 °C"],
  ["los años de antigüedad de un auto (x) y su precio en miles de soles (y)", "año más de antigüedad", "el precio de un auto nuevo"],
];
// JJ.7 / JJ.9: interpretar rectas de ajuste y de regresión.
export function interpretRegression(r: Rng): Question {
  const [ctx, per, icpt] = r.pick(REG_CTX);
  const neg = ctx.includes("antigüedad");
  const m = round((neg ? -1 : 1) * r.int(12, 60) / 10, 1), b = r.int(20, 60);
  const askSlope = r.chance(0.5);
  const good = askSlope ? `Por cada ${per}, y ${m > 0 ? "aumenta" : "disminuye"} unos ${dec(Math.abs(m))}` : `Es ${icpt}`;
  const wrong = askSlope ? [`Por cada ${per}, y ${m > 0 ? "disminuye" : "aumenta"} unos ${dec(Math.abs(m))}`, `Es ${icpt}`, `y siempre vale ${dec(m)}`] : [`Por cada ${per}, y ${m > 0 ? "aumenta" : "disminuye"} unos ${dec(Math.abs(m))}`, `Es el valor máximo que puede tomar y`, `Es el valor de x cuando y = 0`];
  return choiceQ(r, `La recta de regresión ${lineText(m, b)} relaciona ${ctx}. ¿Qué significa ${askSlope ? `el ${dec(m)}` : `el ${b}`}?`, good, wrong, askSlope ? "Es la pendiente: el cambio en y por cada unidad de x." : "Es la intersección con el eje y: el valor de y cuando x = 0.", undefined, askSlope ? "pendiente" : "interseccion");
}

// JJ.10: analizar una recta de regresión (residuos).
export function analyzeRegression(r: Rng): Question {
  const m = r.int(2, 5), b = r.int(10, 30), x = r.int(3, 9), res = r.int(-6, 6) || 3;
  const actual = m * x + b + res;
  if (r.chance(0.5)) return intQ(r, `La recta de regresión es y = ${m}x + ${b}. Para x = ${x}, el dato real es y = ${actual}. ¿Cuál es el residuo (real − predicho)?`, res, `Predicho: ${m} × ${x} + ${b} = ${m * x + b}. Residuo: ${actual} − ${m * x + b} = ${sg(res)}.`, undefined, "residuo", [-res, m * x + b]);
  return numQ(m * x + b, `La recta de regresión es y = ${m}x + ${b}. ¿Qué valor de y predice para x = ${x}?`, undefined, `${m} × ${x} + ${b} = ${m * x + b}.`, "prediccion");
}

// JJ.11: regresión exponencial.
export function exponentialRegression(r: Rng): Question {
  const a = r.pick([2, 3, 5, 10]), b = r.pick([1.5, 2, 3, 0.5]);
  const xs = [0, 1, 2, 3, 4];
  const ys = xs.map((x) => round(a * b ** x * (1 + r.int(-3, 3) / 100), 1));
  const good = `y = ${a}(${dec(b)})^x`;
  return choiceQ(r, "¿Qué modelo exponencial se ajusta mejor a los datos?", good, [`y = ${dec(b)}(${a})^x`, `y = ${a}x + ${dec(b)}`, `y = ${a}(${dec(b === 0.5 ? 2 : round(1 / b, 2))})^x`, `y = ${a * 2}(${dec(b)})^x`].filter((w) => w !== good), `Para x = 0, y ≈ ${a}; cada valor se multiplica aproximadamente por ${dec(b)}.`, table(["x", "y"], xs.map((x, i) => [String(x), dec(ys[i])])), b > 1 ? "crecimiento" : "decrecimiento");
}

const CAUSAL: [string, boolean, string][] = [
  ["En verano aumentan las ventas de helados y también los ahogamientos en playas.", false, "Las dos suben por una tercera causa: el calor (más gente va a la playa)."],
  ["Mientras más horas se riega un huerto, más crecen las plantas (hasta cierto punto).", true, "El agua es necesaria para que las plantas crezcan: hay causalidad."],
  ["Los alumnos con zapatos más grandes saben leer mejor.", false, "Los mayores tienen pies más grandes y leen mejor por la edad, no por el zapato."],
  ["Mientras más rápido va un auto, más distancia necesita para frenar.", true, "La velocidad causa que se necesite más distancia de frenado."],
  ["Las ciudades con más bomberos tienen más incendios.", false, "Las ciudades más grandes tienen más bomberos y más incendios: la causa es el tamaño."],
  ["A más horas de ejercicio intenso, más calorías se queman.", true, "El ejercicio causa el gasto de calorías."],
];
// JJ.12: correlación y causalidad.
export function correlationCausation(r: Rng): Question {
  const [text, causal, why] = r.pick(CAUSAL);
  const O = ["Es probable que una cause la otra", "Hay correlación, pero no causalidad"];
  return fixedQ(`${text} ¿Qué se puede decir de esta relación?`, O, O[causal ? 0 : 1], why, undefined, causal ? "causal" : "no-causal");
}

// ---------------------------------------------------------------------------
// Permutaciones y combinaciones

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const P = (n: number, k: number) => fact(n) / fact(n - k);
const C = (n: number, k: number) => P(n, k) / fact(k);

// KK.7: permutaciones.
export function permutations(r: Rng): Question {
  const n = r.int(4, 8), k = r.int(2, Math.min(4, n));
  const form = r.int(0, 2);
  if (form === 0) return numQ(fact(n), `¿De cuántas maneras se pueden ordenar ${n} libros distintos en un estante?`, undefined, `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" × ")} = ${fmt(fact(n))}.`, "todos");
  if (form === 1) return numQ(P(n, k), `En una carrera corren ${n} atletas. ¿De cuántas maneras se pueden repartir los ${k} primeros puestos?`, undefined, `El orden importa: P(${n}, ${k}) = ${Array.from({ length: k }, (_, i) => n - i).join(" × ")} = ${fmt(P(n, k))}.`, "puestos");
  return numQ(P(n, k), `${r.pick(NAMES)} quiere formar una clave con ${k} letras distintas elegidas entre ${n} letras, sin repetir. ¿Cuántas claves puede formar?`, undefined, `P(${n}, ${k}) = ${fmt(P(n, k))}.`, "clave");
}

// KK.8: notación de permutaciones y combinaciones.
export function permCombNotation(r: Rng): Question {
  const n = r.int(4, 9), k = r.int(2, Math.min(4, n - 1));
  const form = r.int(0, 2);
  if (form === 0) return numQ(P(n, k), `¿Cuánto vale P(${n}, ${k})?`, undefined, `P(n, k) = n! ÷ (n − k)! = ${Array.from({ length: k }, (_, i) => n - i).join(" × ")} = ${fmt(P(n, k))}.`, "permutacion");
  if (form === 1) return numQ(C(n, k), `¿Cuánto vale C(${n}, ${k})?`, undefined, `C(n, k) = P(n, k) ÷ k! = ${fmt(P(n, k))} ÷ ${fact(k)} = ${fmt(C(n, k))}.`, "combinacion");
  const order = r.chance(0.5);
  return choiceQ(r, order ? `¿Qué expresión da el número de maneras de elegir presidente, secretario y tesorero entre ${n} personas?` : `¿Qué expresión da el número de maneras de elegir un comité de 3 personas entre ${n}?`, order ? `P(${n}, 3)` : `C(${n}, 3)`, order ? [`C(${n}, 3)`, `P(3, ${n})`, `${n}!`] : [`P(${n}, 3)`, `C(3, ${n})`, `${n} × 3`], order ? "Los cargos son distintos: el orden importa, es una permutación." : "En un comité no importa el orden: es una combinación.", undefined, order ? "elegir-permutacion" : "elegir-combinacion");
}

// ---------------------------------------------------------------------------
// Matrices

const mat = (rows: number, cols: number, r: Rng, max = 9) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => r.int(-max, max)));
const matText = (name: string, m: number[][]) => m.map((row, i) => `${i === 0 ? `${name} = ` : " ".repeat(name.length + 3)}[ ${row.map((v) => (v < 0 ? `−${-v}` : String(v)).padStart(3, " ")).join("  ")} ]`).join("\n");

// LL.1: vocabulario de matrices.
export function matrixVocabulary(r: Rng): Question {
  const rows = r.int(2, 4), cols = r.int(2, 4);
  const A = mat(rows, cols, r);
  if (r.chance(0.5)) return choiceQ(r, "¿Cuál es la dimensión de la matriz A?", `${rows} × ${cols}`, [`${cols} × ${rows}`, `${rows * cols}`, `${rows} × ${cols + 1}`].filter((w) => w !== `${rows} × ${cols}`), `Tiene ${rows} filas y ${cols} columnas: ${rows} × ${cols}.`, matText("A", A), "dimension");
  const i = r.int(1, rows), j = r.int(1, cols);
  return intQ(r, `¿Cuál es el elemento a${"₀₁₂₃₄"[i]}${"₀₁₂₃₄"[j]} (fila ${i}, columna ${j}) de la matriz A?`, A[i - 1][j - 1], `Se busca la fila ${i} y la columna ${j}: ${sg(A[i - 1][j - 1])}.`, matText("A", A), "elemento", i <= cols && j <= rows ? [A[j - 1][i - 1]] : []);
}

// LL.2: reglas de las operaciones con matrices.
export function matrixRules(r: Rng): Question {
  const [a, b, c, d] = [r.int(1, 4), r.int(1, 4), r.int(1, 4), r.int(1, 4)];
  const mult = r.chance(0.6);
  if (mult) {
    const ok = b === c;
    if (r.chance(0.5) && ok) return choiceQ(r, `A es una matriz ${a} × ${b} y B es ${c} × ${d}. ¿Cuál es la dimensión de A·B?`, `${a} × ${d}`, [...new Set([`${b} × ${c}`, `${d} × ${a}`, `${a} × ${b}`, `${a + 1} × ${d}`, `${a} × ${d + 1}`])].filter((w) => w !== `${a} × ${d}`), `Se puede multiplicar porque las columnas de A (${b}) son iguales a las filas de B (${c}); el resultado tiene las filas de A y las columnas de B.`, undefined, "dimension-producto");
    return yesNo(`A es una matriz ${a} × ${b} y B es ${c} × ${d}. ¿Se puede calcular A·B?`, ok, ok ? `Sí: las columnas de A (${b}) coinciden con las filas de B (${c}).` : `No: A tiene ${b} columnas y B tiene ${c} filas.`, undefined, "multiplicar");
  }
  const ok = a === c && b === d;
  return yesNo(`A es una matriz ${a} × ${b} y B es ${c} × ${d}. ¿Se puede calcular A + B?`, ok, ok ? "Sí: tienen la misma dimensión." : "No: para sumar, las matrices deben tener la misma dimensión.", undefined, "sumar");
}

// LL.3-LL.5: sumar, restar, multiplicar por un escalar y combinaciones.
export function matrixLinear(r: Rng, mode: "addsub" | "scalar" | "combo"): Question {
  const A = mat(2, 2, r, 6), B = mat(2, 2, r, 6);
  const k = r.pick([2, 3, -2, -1, 4]), m = r.pick([2, 3, -1]);
  const i = r.int(0, 1), j = r.int(0, 1);
  const minus = r.chance(0.5);
  const val = mode === "addsub" ? A[i][j] + (minus ? -1 : 1) * B[i][j] : mode === "scalar" ? k * A[i][j] : k * A[i][j] + m * B[i][j];
  const kA = `${k === -1 ? "−" : sg(k)}A`;
  const expr = mode === "addsub" ? `A ${minus ? "−" : "+"} B` : mode === "scalar" ? kA : `${kA} ${m < 0 ? "−" : "+"} ${Math.abs(m) === 1 ? "" : Math.abs(m)}B`;
  const why = mode === "addsub" ? `Se ${minus ? "restan" : "suman"} los elementos de la misma posición: ${A[i][j]} ${minus ? "−" : "+"} ${B[i][j] < 0 ? `(${B[i][j]})` : B[i][j]} = ${val}.` : mode === "scalar" ? `Se multiplica cada elemento por ${k}: ${k} × ${A[i][j] < 0 ? `(${A[i][j]})` : A[i][j]} = ${val}.` : `${k} × ${A[i][j] < 0 ? `(${A[i][j]})` : A[i][j]} ${m < 0 ? "−" : "+"} ${Math.abs(m)} × ${B[i][j] < 0 ? `(${B[i][j]})` : B[i][j]} = ${val}.`;
  return intQ(r, `Calcula ${expr}. ¿Qué número queda en la fila ${i + 1}, columna ${j + 1}?`, val, why.replace(/-/g, "−"), `${matText("A", A)}\n${matText("B", B)}`.replace(/-/g, "−"), mode, [-val, val + 1]);
}

// LL.6: multiplicar dos matrices.
export function matrixMultiply(r: Rng): Question {
  const A = mat(2, 2, r, 5), B = mat(2, 2, r, 5);
  const i = r.int(0, 1), j = r.int(0, 1);
  const val = A[i][0] * B[0][j] + A[i][1] * B[1][j];
  const p = (n: number) => (n < 0 ? `(−${-n})` : String(n));
  return intQ(r, `Calcula A·B. ¿Qué número queda en la fila ${i + 1}, columna ${j + 1}?`, val, `Fila ${i + 1} de A por columna ${j + 1} de B: ${p(A[i][0])} × ${p(B[0][j])} + ${p(A[i][1])} × ${p(B[1][j])} = ${val < 0 ? `−${-val}` : val}.`, `${matText("A", A)}\n${matText("B", B)}`, "producto", [A[i][j] * B[i][j], A[i][0] * B[j][0] + A[i][1] * B[j][1]]);
}

const PROPS: [string, boolean, string][] = [
  ["A + B = B + A", true, "La suma de matrices es conmutativa."],
  ["A·B = B·A", false, "En general, el producto de matrices no es conmutativo."],
  ["(A + B) + C = A + (B + C)", true, "La suma de matrices es asociativa."],
  ["k(A + B) = kA + kB", true, "El escalar se distribuye."],
  ["(A·B)·C = A·(B·C)", true, "El producto de matrices es asociativo."],
  ["A·(B + C) = A·B + A·C", true, "El producto se distribuye sobre la suma."],
];
// LL.7: propiedades de las matrices.
export function matrixProperties(r: Rng): Question {
  const [text, ok, why] = r.pick(PROPS);
  return fixedQ(`Si A, B y C son matrices cuadradas del mismo tamaño y k es un número, ¿se cumple siempre ${text}?`, ["Sí, siempre", "No siempre"], ok ? "Sí, siempre" : "No siempre", why, undefined, ok ? "si" : "no");
}
