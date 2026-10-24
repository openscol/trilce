import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { choiceQ, fixedQ, intQ, sg, yesNo } from "../kit";
import { nz } from "../sec1/util";
import { dec, line10, poly, valQ, xMinus } from "../alg1/util";

// Precálculo: temas sueltos que no estaban en cursos anteriores.

// Valor máximo o mínimo de una función cuadrática.
export function quadExtreme(r: Rng): Question {
  const a = nz(r, 3), h = r.int(-4, 4), k = r.int(-9, 9);
  const coefs = [a, -2 * a * h, a * h * h + k];
  const max = a < 0;
  return intQ(r, `¿Cuál es el valor ${max ? "máximo" : "mínimo"} de f(x) = ${poly(coefs)}?`, k, `El vértice está en x = −b ÷ 2a = ${sg(h)}; f(${sg(h)}) = ${sg(k)}. Como a ${max ? "< 0, es un máximo" : "> 0, es un mínimo"}.`, undefined, max ? "maximo" : "minimo", [h, -k, coefs[2]]);
}

// Resolver ecuaciones con sumas y diferencias de cubos (soluciones reales).
export function cubeEquation(r: Rng): Question {
  const a = r.pick([1, 2, 3]), b = r.int(1, 5) * r.pick([1, -1]);
  const k = r.pick([1, 2]);
  // k(ax − ... ) : k·a³x³ = k·b³ → x = b/a
  const lhs = `${poly([k * a ** 3, 0, 0, -k * b ** 3])} = 0`;
  const x = b / a;
  return choiceQ(r, `¿Cuál es la solución real de ${lhs}?`, `x = ${Number.isInteger(x) ? sg(x) : `${b < 0 ? "−" : ""}${Math.abs(b)}/${a}`}`, [`x = ${Number.isInteger(x) ? sg(-x) : `${b < 0 ? "" : "−"}${Math.abs(b)}/${a}`}`, `x = ±${Math.abs(b)}${a === 1 ? "" : `/${a}`}`, `x = ${sg(b ** 3)}`].filter((w, i, all) => all.indexOf(w) === i), `Se factoriza como diferencia (o suma) de cubos: (${poly([a, -b])})(…) = 0; el factor cuadrático no tiene raíces reales. x = ${dec(Math.round(x * 1000) / 1000)}.`, undefined, "cubos");
}

// ¿dos funciones racionales son inversas?
export function rationalInverse(r: Rng): Question {
  const a = r.int(1, 4), b = nz(r, 5), c = nz(r, 4);
  // f(x) = (ax + b)/(x − c) ⇒ f⁻¹(x) = (cx + b)/(x − a)
  const yes = r.chance(0.5);
  const g = yes ? `(${poly([c, b])})/(${xMinus(a)})` : `(${poly([c, -b])})/(${xMinus(a)})`;
  return yesNo(`¿Son inversas f(x) = (${poly([a, b])})/(${xMinus(c)}) y g(x) = ${g}?`, yes, yes ? "Al despejar x en y = f(x) se obtiene g; además f(g(x)) = x." : "Al despejar x en y = f(x) se obtiene otra expresión: f(g(x)) ≠ x.", undefined, yes ? "si" : "no");
}

// Inecuaciones de grado mayor (tabla de signos).
export function higherInequality(r: Rng, graph: boolean): Question {
  const roots = r.shuffle([-6, -4, -3, -1, 0, 2, 3, 5, 7]).slice(0, 3).sort((x, y) => x - y);
  const [p, q, s] = roots;
  const op = r.pick([">", "<", "≥", "≤"]);
  const closed = op === "≥" || op === "≤", pos = op === ">" || op === "≥";
  // (x − p)(x − q)(x − s): negativo antes de p, positivo entre p y q, negativo entre q y s, positivo después de s.
  const text = `${roots.map((x) => (x === 0 ? "x" : `(${xMinus(x)})`)).join("")} ${op} 0`;
  const lt = closed ? "≤" : "<", gt = closed ? "≥" : ">";
  const good = pos ? `${sg(p)} ${lt} x ${lt} ${sg(q)} o x ${gt} ${sg(s)}` : `x ${lt} ${sg(p)} o ${sg(q)} ${lt} x ${lt} ${sg(s)}`;
  const flip = pos ? `x ${lt} ${sg(p)} o ${sg(q)} ${lt} x ${lt} ${sg(s)}` : `${sg(p)} ${lt} x ${lt} ${sg(q)} o x ${gt} ${sg(s)}`;
  const why = `Los ceros ${roots.map(sg).join(", ")} dividen la recta; el producto es negativo antes de ${sg(p)} y cambia de signo en cada cero.`;
  if (graph) {
    const yes = r.chance(0.5);
    const showPos = yes ? pos : !pos;
    const segs = showPos ? [{ from: p, to: q, closedFrom: closed, closedTo: closed }, { from: s, closedFrom: closed }] : [{ to: p, closedTo: closed }, { from: q, to: s, closedFrom: closed, closedTo: closed }];
    return yesNo(`¿La recta numérica muestra las soluciones de ${text}?`, yes, why, line10({ segments: segs }), pos ? "positivo" : "negativo");
  }
  return choiceQ(r, "Resuelve la inecuación.", good, [flip, `${sg(p)} ${lt} x ${lt} ${sg(s)}`, `x ${lt} ${sg(q)}`].filter((w) => w !== good), why, text, pos ? "positivo" : "negativo");
}

// Inversa de una matriz 3 × 3 (un elemento).
export function inverse3(r: Rng): Question {
  // Triangular superior con unos en la diagonal: la inversa es entera.
  const a = nz(r, 4), b = nz(r, 4), c = nz(r, 4);
  const M = [[1, a, b], [0, 1, c], [0, 0, 1]];
  const inv = [[1, -a, a * c - b], [0, 1, -c], [0, 0, 1]];
  const [i, j] = r.pick([[0, 1], [0, 2], [1, 2]]);
  const text = M.map((row, k) => `${k === 0 ? "A = " : "    "}[ ${row.map((v) => sg(v).padStart(3, " ")).join("  ")} ]`).join("\n");
  return intQ(r, `¿Qué número está en la fila ${i + 1}, columna ${j + 1} de A⁻¹?`, inv[i][j], `Al reducir [A | I] por filas se obtiene A⁻¹; el elemento pedido es ${sg(inv[i][j])}. (Comprueba que A · A⁻¹ = I.)`, text, "3x3", [-inv[i][j], M[i][j]]);
}

// Excentricidad de elipses e hipérbolas.
export function eccentricity(r: Rng, hyper: boolean): Question {
  const [a, b, c] = r.pick(hyper ? [[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13]] : [[5, 3, 4], [5, 4, 3], [10, 6, 8], [13, 5, 12]]);
  const eq = hyper ? `x²/${a * a} − y²/${b * b} = 1` : `x²/${a * a} + y²/${b * b} = 1`;
  const g = (p: number, q: number): number => (q ? g(q, p % q) : p);
  const k = g(c, a);
  return choiceQ(r, `¿Cuál es la excentricidad de ${hyper ? "la hipérbola" : "la elipse"} ${eq}?`, `${c / k}/${a / k}`, [`${a / g(a, c)}/${c / g(a, c)}`, `${b / g(b, a)}/${a / g(b, a)}`, `${c / g(c, b)}/${b / g(c, b)}`].filter((w, i, all) => w !== `${c / k}/${a / k}` && all.indexOf(w) === i), `e = c ÷ a, con c² = a² ${hyper ? "+" : "−"} b²: c = ${c}, e = ${c}/${a}. ${hyper ? "En una hipérbola e > 1." : "En una elipse 0 < e < 1."}`, undefined, hyper ? "hiperbola" : "elipse");
}

// Hallar términos de una sucesión (fórmula explícita).
export function sequenceTerm(r: Rng): Question {
  const n = r.int(3, 9);
  const forms: [string, (k: number) => number][] = [["aₙ = n² − 1", (k) => k * k - 1], ["aₙ = 3n + 4", (k) => 3 * k + 4], ["aₙ = 2ⁿ", (k) => 2 ** k], ["aₙ = (−1)ⁿ · n", (k) => (k % 2 ? -k : k)], ["aₙ = n(n + 1)/2", (k) => (k * (k + 1)) / 2], ["aₙ = 5 − 2n", (k) => 5 - 2 * k]];
  const [f, fn] = r.pick(forms);
  return intQ(r, `Si ${f}, ¿cuánto vale a${"₀₁₂₃₄₅₆₇₈₉"[n]}?`, fn(n), `Se reemplaza n = ${n}: a${"₀₁₂₃₄₅₆₇₈₉"[n]} = ${sg(fn(n))}.`, undefined, "explicita", [fn(n - 1), fn(n + 1)]);
}

// Binomial (media y desviación), teorema central del límite y aproximación normal.
export function binomialStats(r: Rng, mode: "moments" | "clt" | "approx"): Question {
  const n = r.pick([20, 50, 100, 200, 400]), p = r.pick([0.1, 0.2, 0.25, 0.5, 0.4]);
  const mu = n * p, v = n * p * (1 - p), sd = Math.round(Math.sqrt(v) * 100) / 100;
  if (mode === "moments") {
    const k = r.int(0, 2);
    if (k === 0) return valQ(r, `Una variable binomial tiene n = ${n} y p = ${dec(p)}. ¿Cuál es su media?`, mu, [v, n * (1 - p), p], `μ = np = ${n} × ${dec(p)} = ${dec(mu)}.`, undefined, "media");
    if (k === 1) return valQ(r, `Una variable binomial tiene n = ${n} y p = ${dec(p)}. ¿Cuál es su varianza?`, v, [mu, sd, n * p * p], `σ² = np(1 − p) = ${n} × ${dec(p)} × ${dec(1 - p)} = ${dec(v)}.`, undefined, "varianza");
    return valQ(r, `Una variable binomial tiene n = ${n} y p = ${dec(p)}. ¿Cuál es su desviación estándar? Redondea a la centésima.`, sd, [v, Math.round(Math.sqrt(mu) * 100) / 100, Math.round(sd * 2 * 100) / 100], `σ = √(np(1 − p)) = √${dec(v)} ≈ ${dec(sd)}.`, undefined, "desviacion");
  }
  if (mode === "clt") return fixedQ("Según el teorema central del límite, si las muestras son grandes (n ≥ 30), ¿cómo es la distribución de las medias muestrales?", ["Aproximadamente normal", "Igual a la de la población", "Uniforme", "Siempre sesgada a la derecha"], "Aproximadamente normal", "Para muestras grandes, las medias muestrales se distribuyen aproximadamente normal, con media μ y desviación σ/√n, sea cual sea la forma de la población.", undefined, "tcl");
  const ok = mu >= 10 && n * (1 - p) >= 10;
  return yesNo(`Una binomial tiene n = ${n} y p = ${dec(p)}. ¿Se puede aproximar con una normal (np ≥ 10 y n(1 − p) ≥ 10)?`, ok, `np = ${dec(mu)} y n(1 − p) = ${dec(n * (1 - p))}: ${ok ? "los dos son al menos 10." : "alguno es menor que 10."}`, undefined, ok ? "si" : "no");
}

// Analizar una recta de regresión usando estadísticos (m = r · sy / sx; b = ȳ − m x̄).
export function regressionStats(r: Rng): Question {
  const rr = r.pick([0.5, 0.6, 0.8, -0.5, -0.8]), sx = r.int(2, 6), sy = r.int(2, 12), xb = r.int(5, 20), yb = r.int(20, 80);
  const m = Math.round(((rr * sy) / sx) * 100) / 100;
  const b = Math.round((yb - m * xb) * 100) / 100;
  if (r.chance(0.5)) return valQ(r, `Un conjunto de datos tiene r = ${dec(rr)}, sₓ = ${sx} y s_y = ${sy}. ¿Cuál es la pendiente de la recta de regresión? Redondea a la centésima.`, m, [Math.round(((rr * sx) / sy) * 100) / 100, Math.round((sy / sx) * 100) / 100, -m], `m = r · s_y ÷ sₓ = ${dec(rr)} × ${sy} ÷ ${sx} = ${dec(m)}.`, undefined, "pendiente");
  return valQ(r, `La recta de regresión tiene pendiente ${dec(m)} y pasa por (x̄, ȳ) = (${xb}, ${yb}). ¿Cuál es su intersección con el eje y?`, b, [Math.round((yb + m * xb) * 100) / 100, yb, Math.round((xb - m * yb) * 100) / 100], `b = ȳ − m x̄ = ${yb} − ${m < 0 ? `(${dec(m)})` : dec(m)} × ${xb} = ${dec(b)}.`, undefined, "interseccion");
}


