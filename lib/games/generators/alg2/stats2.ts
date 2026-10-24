import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, intQ, numQ, sg, table, yesNo } from "../kit";
import { nz, pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { dec, frac, valQ } from "../alg1/util";

// Álgebra 2: distribuciones de probabilidad (discretas, binomial, normal),
// intervalos de confianza, diseño de experimentos y matrices (determinante,
// inversa, ecuaciones y transformaciones).

const r2 = (n: number) => Math.round(n * 100) / 100;
const r4 = (n: number) => Math.round(n * 10000) / 10000;

// ---------------------------------------------------------------------------
// Distribuciones discretas

// QQ.1: identificar distribuciones de probabilidad.
export function identifyDistribution(r: Rng): Question {
  const xs = [0, 1, 2, 3];
  const ps = r.pick([[0.1, 0.2, 0.3, 0.4], [0.25, 0.25, 0.25, 0.25], [0.5, 0.2, 0.2, 0.1], [0.3, 0.3, 0.3, 0.3], [0.4, 0.3, 0.2, 0.2], [0.6, 0.5, -0.2, 0.1]]);
  const sum = r2(ps.reduce((s, p) => s + p, 0));
  const ok = sum === 1 && ps.every((p) => p >= 0);
  return yesNo("¿La tabla representa una distribución de probabilidad?", ok, ok ? "Todas las probabilidades están entre 0 y 1 y suman 1." : ps.some((p) => p < 0) ? "Hay una probabilidad negativa." : `Las probabilidades suman ${dec(sum)}, no 1.`, table(["x", "P(x)"], xs.map((x, i) => [String(x), dec(ps[i])])), ok ? "si" : "no");
}

const VARS: [string, boolean][] = [["el número de caras al lanzar 5 monedas", true], ["la estatura de un alumno elegido al azar", false], ["el número de alumnos que faltan un día", true], ["el tiempo que tarda un bus en llegar", false], ["la cantidad de goles en un partido", true], ["el peso de una sandía", false], ["el número de hermanos de una persona", true], ["la temperatura al mediodía", false]];
// QQ.2: variables aleatorias discretas y continuas.
export function discreteContinuous(r: Rng): Question {
  const [v, disc] = r.pick(VARS);
  return fixedQ(`¿La variable aleatoria «${v}» es discreta o continua?`, ["Discreta", "Continua"], disc ? "Discreta" : "Continua", disc ? "Toma valores que se pueden contar (0, 1, 2…)." : "Puede tomar cualquier valor de un intervalo (se mide, no se cuenta).", undefined, disc ? "discreta" : "continua");
}

// QQ.3 / QQ.4: escribir y graficar distribuciones discretas.
export function writeDistribution(r: Rng, graph: boolean): Question {
  const counts = [r.int(1, 6), r.int(1, 6), r.int(1, 6), r.int(1, 6)];
  const total = counts.reduce((s, c) => s + c, 0);
  const i = r.int(0, 3);
  if (graph) {
    const visual: Visual = { kind: "barChart", title: "Cantidad de fichas", bars: counts.map((c, j) => ({ label: String(j + 1), value: c })), max: Math.max(...counts) + 1, step: 1 };
    return choiceQ(r, `Una bolsa tiene fichas numeradas: el gráfico muestra cuántas hay de cada número. Se saca una ficha al azar. ¿Cuál es P(x = ${i + 1})?`, frac(counts[i], total), [frac(counts[i], 10), frac(1, 4), frac(total - counts[i], total)].filter((w, k, all) => w !== frac(counts[i], total) && all.indexOf(w) === k), `${counts[i]} de ${total} fichas tienen el ${i + 1}: P = ${frac(counts[i], total)}.`, visual, "grafico");
  }
  return choiceQ(r, `Una bolsa tiene ${counts.map((c, j) => `${c} fichas con el ${j + 1}`).join(", ")}. Se saca una al azar y x es el número. ¿Cuál es P(x = ${i + 1})?`, frac(counts[i], total), [frac(counts[i], total - counts[i] || 1), frac(1, 4), frac(i + 1, total)].filter((w, k, all) => w !== frac(counts[i], total) && all.indexOf(w) === k), `P(x = ${i + 1}) = ${counts[i]}/${total}${frac(counts[i], total) !== `${counts[i]}/${total}` ? ` = ${frac(counts[i], total)}` : ""}.`, undefined, "escribir");
}

// QQ.5-QQ.7: valor esperado, varianza y desviación estándar.
export function expectedValue(r: Rng, what: "mean" | "variance" | "sd"): Question {
  const xs = [0, 1, 2, 3];
  const ps = r.pick([[0.1, 0.2, 0.3, 0.4], [0.25, 0.25, 0.25, 0.25], [0.4, 0.3, 0.2, 0.1], [0.2, 0.3, 0.3, 0.2], [0.1, 0.4, 0.4, 0.1]]);
  const mu = r4(xs.reduce((s, x, i) => s + x * ps[i], 0));
  const v = r4(xs.reduce((s, x, i) => s + (x - mu) ** 2 * ps[i], 0));
  const vis = table(["x", "P(x)"], xs.map((x, i) => [String(x), dec(ps[i])]));
  if (what === "mean") return valQ(r, "¿Cuál es el valor esperado E(x) de la distribución?", mu, [1.5, r4(mu + 0.3), r4(v)], `E(x) = Σ x · P(x) = ${xs.map((x, i) => `${x} × ${dec(ps[i])}`).join(" + ")} = ${dec(mu)}.`, vis, "media");
  if (what === "variance") return valQ(r, "¿Cuál es la varianza de la distribución? Redondea a la centésima.", r2(v), [r2(Math.sqrt(v)), r2(v + mu), r2(mu)], `Var = Σ (x − μ)² P(x) con μ = ${dec(mu)}: ${dec(r2(v))}.`, vis, "varianza");
  return valQ(r, "¿Cuál es la desviación estándar de la distribución? Redondea a la centésima.", r2(Math.sqrt(v)), [r2(v), r2(Math.sqrt(v) + 0.2), r2(mu)], `σ = √Var = √${dec(r2(v))} ≈ ${dec(r2(Math.sqrt(v)))}.`, vis, "desviacion");
}

// QQ.8-QQ.10: juegos de azar (distribución, valor esperado, mejor apuesta).
export function gameOfChance(r: Rng, mode: "distribution" | "expected" | "better"): Question {
  const cost = r.int(1, 5), prize = r.int(5, 20), n = r.pick([4, 5, 10]);
  const ev = r2(prize / n - cost);
  const name = r.pick(NAMES);
  const story = `${name} paga ${cost} soles por girar una ruleta con ${n} sectores iguales; si sale el sector ganador recibe ${prize} soles.`;
  if (mode === "distribution") return choiceQ(r, `${story} Si x es su ganancia neta, ¿cuál es la distribución de x?`, `P(x = ${prize - cost}) = 1/${n}; P(x = −${cost}) = ${n - 1}/${n}`, [`P(x = ${prize}) = 1/${n}; P(x = 0) = ${n - 1}/${n}`, `P(x = ${prize - cost}) = ${n - 1}/${n}; P(x = −${cost}) = 1/${n}`, `P(x = ${prize - cost}) = 1/2; P(x = −${cost}) = 1/2`], `Si gana recibe ${prize} pero ya pagó ${cost}: ganancia ${prize - cost}. Si pierde, −${cost}.`, undefined, "distribucion");
  if (mode === "expected") return valQ(r, `${story} ¿Cuál es el valor esperado de su ganancia neta, en soles?`, ev, [r2(prize / n), r2(prize - cost), r2(-ev)], `E = (${prize - cost}) × 1/${n} + (−${cost}) × ${n - 1}/${n} = ${dec(ev)}.`, undefined, "esperado");
  const prize2 = r.int(5, 20), n2 = r.pick([4, 5, 10]);
  const ev2 = r2(prize2 / n2 - cost);
  if (ev === ev2) return gameOfChance(r, mode);
  return fixedQ(`Dos juegos cuestan ${cost} soles. En el juego A se gana ${prize} soles con probabilidad 1/${n}; en el juego B se gana ${prize2} soles con probabilidad 1/${n2}. ¿Cuál conviene más?`, ["El juego A", "El juego B"], ev > ev2 ? "El juego A" : "El juego B", `Valor esperado: A = ${dec(ev)}, B = ${dec(ev2)}; conviene el mayor.`, undefined, "apuesta");
}

// ---------------------------------------------------------------------------
// Binomial y normal

const C = (n: number, k: number) => { let c = 1; for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1); return c; };
// RR.1: probabilidades binomiales.
export function binomial(r: Rng): Question {
  const n = r.int(3, 8), k = r.int(0, n), p = r.pick([0.5, 0.2, 0.3, 0.6]);
  const v = r4(C(n, k) * p ** k * (1 - p) ** (n - k));
  return valQ(r, `Un experimento tiene probabilidad de éxito ${dec(p)}. Se repite ${n} veces. ¿Cuál es la probabilidad de obtener exactamente ${k} éxitos? Redondea a la diezmilésima.`, v, [r4(p ** k * (1 - p) ** (n - k)), r4(C(n, k) * p ** k), r4(k / n)], `P = C(${n}, ${k}) · ${dec(p)}^${k} · ${dec(1 - p)}^${n - k} = ${C(n, k)} × … ≈ ${dec(v)}.`, undefined, "binomial");
}

// Función de distribución normal estándar (aproximación de Abramowitz-Stegun).
const phi = (z: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};
// RR.2-RR.5: distribución normal (regla 68-95-99,7, valores z y valores de la variable).
export function normal(r: Rng, mode: "empirical" | "probability" | "z" | "value"): Question {
  const mu = r.pick([50, 60, 70, 100, 150]), s = r.pick([5, 8, 10, 15]);
  if (mode === "empirical") {
    const k = r.int(1, 3);
    const pct = [68, 95, 99.7][k - 1];
    return choiceQ(r, `Una variable tiene distribución normal con media ${mu} y desviación estándar ${s}. ¿Qué porcentaje de los datos está aproximadamente entre ${mu - k * s} y ${mu + k * s}?`, `${dec(pct)} %`, ["68 %", "95 %", "99,7 %", "50 %"].filter((w) => w !== `${dec(pct)} %`), `Está a ${k} desviación${k > 1 ? "es" : ""} estándar de la media: regla 68-95-99,7.`, undefined, "empirica");
  }
  if (mode === "z") {
    const x = mu + s * r.pick([-2, -1.5, -1, 0.5, 1, 1.2, 2]);
    const z = r2((x - mu) / s);
    return valQ(r, `Una variable normal tiene media ${mu} y desviación estándar ${s}. ¿Cuál es el valor z de x = ${dec(x)}?`, z, [-z, r2((x - mu) / (s * s)), r2(x / s)], `z = (x − μ) ÷ σ = (${dec(x)} − ${mu}) ÷ ${s} = ${dec(z)}.`, undefined, "z");
  }
  if (mode === "value") {
    const z = r.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
    return valQ(r, `Una variable normal tiene media ${mu} y desviación estándar ${s}. ¿Qué valor de x tiene z = ${dec(z)}?`, mu + z * s, [mu - z * s, mu + z, r2(mu * z)], `x = μ + zσ = ${mu} + ${z < 0 ? `(${dec(z)})` : dec(z)} × ${s} = ${dec(mu + z * s)}.`, undefined, "valor");
  }
  const z = r.pick([0.5, 1, 1.5, 2, -1, -0.5]);
  const less = r.chance(0.5);
  const p = r4(less ? phi(z) : 1 - phi(z));
  return valQ(r, `Una variable normal tiene media ${mu} y desviación estándar ${s}. ¿Cuál es la probabilidad de que x sea ${less ? "menor" : "mayor"} que ${dec(mu + z * s)}? Usa una tabla o calculadora; redondea a la diezmilésima.`, p, [r4(1 - p), r4(p / 2), r4(phi(-Math.abs(z)) * 2)].filter((v) => v !== p), `z = ${dec(z)}; P(${less ? "Z < " : "Z > "}${dec(z)}) ≈ ${dec(p)}.`, undefined, "probabilidad");
}

// RR.6: distribución de las medias muestrales.
export function sampleMeans(r: Rng): Question {
  const mu = r.pick([40, 50, 100]), s = r.pick([6, 8, 10, 12, 15, 20]), n = r.pick([4, 9, 16, 25, 36]);
  if (r.chance(0.5)) return numQ(mu, `Una población tiene media ${mu} y desviación estándar ${s}. Se toman muestras de tamaño ${n}. ¿Cuál es la media de la distribución de las medias muestrales?`, undefined, "La media de las medias muestrales es igual a la media de la población.", "media");
  return valQ(r, `Una población tiene media ${mu} y desviación estándar ${s}. Se toman muestras de tamaño ${n}. ¿Cuál es la desviación estándar de las medias muestrales (error estándar)?`, r2(s / Math.sqrt(n)), [s, r2(s / n), r2(s * Math.sqrt(n))], `σ/√n = ${s} ÷ √${n} = ${dec(r2(s / Math.sqrt(n)))}.`, undefined, "error-estandar");
}

// ---------------------------------------------------------------------------
// Inferencia y experimentos

// SS.6-SS.8: intervalos de confianza (medias y proporciones) e interpretación.
export function confidenceInterval(r: Rng, mode: "mean" | "proportion" | "interpret"): Question {
  if (mode === "interpret") {
    const lo = r.int(10, 50), hi = lo + r.int(2, 8);
    return choiceQ(r, `Un intervalo de confianza del 95 % para el tiempo promedio de viaje de los alumnos es (${lo} min, ${hi} min). ¿Qué significa?`, "Con 95 % de confianza, la media de todos los alumnos está en ese intervalo", ["El 95 % de los alumnos tarda un tiempo que está dentro de ese intervalo", "La media de la muestra está con total seguridad dentro del intervalo", "El 95 % de las muestras posibles tendrán exactamente esa misma media"], "El intervalo estima la media de la población, no los datos individuales.", undefined, "interpretar");
  }
  if (mode === "proportion") {
    const n = r.pick([100, 200, 400, 500]), x = r.int(Math.round(n * 0.2), Math.round(n * 0.8));
    const p = x / n, me = r4(1.96 * Math.sqrt((p * (1 - p)) / n));
    const good = `(${dec(r4(p - me))}, ${dec(r4(p + me))})`;
    return choiceQ(r, `En una encuesta a ${n} personas, ${x} dicen que sí. ¿Cuál es el intervalo de confianza del 95 % para la proporción? (Usa z = 1,96; redondea a la diezmilésima.)`, good, [`(${dec(r4(p - me / 2))}, ${dec(r4(p + me / 2))})`, `(${dec(r4(p - 2 * me))}, ${dec(r4(p + 2 * me))})`, `(${dec(r4(p - 0.05))}, ${dec(r4(p + 0.05))})`].filter((w) => w !== good), `p̂ = ${dec(r4(p))}; margen = 1,96 × √(p̂(1 − p̂)/n) ≈ ${dec(me)}.`, undefined, "proporcion");
  }
  const xbar = r.int(40, 80), s = r.pick([4, 6, 8, 10]), n = r.pick([16, 25, 36, 64, 100]);
  const me = r2((1.96 * s) / Math.sqrt(n));
  const good = `(${dec(r2(xbar - me))}, ${dec(r2(xbar + me))})`;
  return choiceQ(r, `Una muestra de ${n} datos tiene media ${xbar} y desviación estándar ${s}. ¿Cuál es el intervalo de confianza del 95 % para la media? (Usa z = 1,96.)`, good, [`(${dec(r2(xbar - 1.96 * s))}, ${dec(r2(xbar + 1.96 * s))})`, `(${dec(r2(xbar - s / Math.sqrt(n)))}, ${dec(r2(xbar + s / Math.sqrt(n)))})`, `(${dec(r2(xbar - me * 2))}, ${dec(r2(xbar + me * 2))})`].filter((w) => w !== good), `Margen = 1,96 × ${s} ÷ √${n} = ${dec(me)}.`, undefined, "media");
}

const DESIGN: [string, string, string[]][] = [
  ["Se eligen al azar 50 alumnos: a la mitad se le da un suplemento y a la otra un placebo, y se comparan sus notas.", "Experimento", ["Estudio observacional", "Encuesta", "Censo"]],
  ["Se pregunta a 200 vecinos cuántas horas duermen.", "Encuesta", ["Experimento", "Estudio observacional", "Censo"]],
  ["Se registra durante un año si las personas fuman y si tienen problemas respiratorios, sin intervenir.", "Estudio observacional", ["Experimento", "Encuesta", "Simulación"]],
  ["En un experimento, el grupo que no recibe el tratamiento sirve para comparar.", "Grupo de control", ["Grupo experimental", "Muestra sesgada", "Variable de respuesta"]],
  ["Asignar los tratamientos al azar a los participantes.", "Aleatorización", ["Replicación", "Muestreo por conveniencia", "Censo"]],
];
// SS.9: diseño de experimentos.
export function experimentDesign(r: Rng): Question {
  const [text, good, wrong] = r.pick(DESIGN);
  return choiceQ(r, `¿Qué es? ${text}`, good, wrong, `${good}.`, undefined, "diseno");
}

// SS.10: analizar resultados con simulaciones.
export function simulationAnalysis(r: Rng): Question {
  const diff = r.int(2, 12), extreme = r.int(0, 40);
  const sig = extreme < 25;
  return fixedQ(`En un experimento, la diferencia entre las medias del grupo tratado y el de control fue ${diff}. Al reasignar los grupos al azar 1000 veces, solo ${extreme} simulaciones dieron una diferencia de ${diff} o más. ¿La diferencia es significativa (con un nivel del 5 %)?`, ["Sí, es significativa", "No, puede deberse al azar"], sig ? "Sí, es significativa" : "No, puede deberse al azar", `${extreme} de 1000 = ${dec(extreme / 10)} %; ${sig ? "es menor que 5 %: es poco probable que sea solo azar." : "es mayor o igual que 5 %: puede deberse al azar."}`, undefined, sig ? "significativa" : "azar");
}

// ---------------------------------------------------------------------------
// Matrices

type M2 = [[number, number], [number, number]];
const m2 = (r: Rng, max = 6): M2 => [[r.int(-max, max), r.int(-max, max)], [r.int(-max, max), r.int(-max, max)]];
const mText = (name: string, m: number[][]) => m.map((row, i) => `${i === 0 ? `${name} = ` : " ".repeat(name.length + 3)}[ ${row.map((v) => sg(v).padStart(3, " ")).join("  ")} ]`).join("\n");
const det2 = (m: M2) => m[0][0] * m[1][1] - m[0][1] * m[1][0];

// UU.8 / UU.10: simplificar expresiones matriciales y resolver ecuaciones (X + A = B, kX = B).
export function matrixEquation(r: Rng, simplify: boolean): Question {
  const A = m2(r), B = m2(r), k = r.pick([2, 3, -1]);
  const i = r.int(0, 1), j = r.int(0, 1);
  if (simplify) {
    const v = k * (A[i][j] + B[i][j]) - A[i][j];
    return intQ(r, `Simplifica ${k === -1 ? "−" : k}(A + B) − A y di qué número queda en la fila ${i + 1}, columna ${j + 1}.`, v, `${k === -1 ? "−" : k}(${sg(A[i][j])} + ${A[i][j] < 0 || B[i][j] >= 0 ? sg(B[i][j]) : sg(B[i][j])}) − ${A[i][j] < 0 ? `(${sg(A[i][j])})` : A[i][j]} = ${sg(v)}.`, `${mText("A", A)}\n${mText("B", B)}`, "simplificar", [v + A[i][j], -v]);
  }
  const v = B[i][j] - A[i][j];
  return intQ(r, `Resuelve X + A = B. ¿Qué número queda en la fila ${i + 1}, columna ${j + 1} de X?`, v, `X = B − A: ${sg(B[i][j])} − ${A[i][j] < 0 ? `(${sg(A[i][j])})` : A[i][j]} = ${sg(v)}.`, `${mText("A", A)}\n${mText("B", B)}`, "ecuacion", [A[i][j] + B[i][j], -v]);
}

// UU.11 / UU.12: determinante y matrices invertibles.
export function determinant(r: Rng, invertible: boolean): Question {
  if (!invertible && r.chance(0.3)) {
    const M = [[r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)], [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)], [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)]];
    const d = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    return intQ(r, "Calcula el determinante de la matriz A.", d, "Desarrollando por la primera fila (cofactores) o con la regla de Sarrus.", mText("A", M), "3x3", [-d, d + 1]);
  }
  let A = m2(r);
  if (invertible && r.chance(0.5)) {
    const k = nz(r, 3);
    A = [[A[0][0], A[0][1]], [A[0][0] * k, A[0][1] * k]];
  }
  const d = det2(A);
  if (invertible) return yesNo("¿La matriz A es invertible?", d !== 0, `det A = (${sg(A[0][0])})(${sg(A[1][1])}) − (${sg(A[0][1])})(${sg(A[1][0])}) = ${sg(d)}: ${d !== 0 ? "es distinto de 0, sí es invertible." : "es 0, no es invertible."}`, mText("A", A), d ? "si" : "no");
  return intQ(r, "Calcula el determinante de la matriz A.", d, `det = ad − bc = (${sg(A[0][0])})(${sg(A[1][1])}) − (${sg(A[0][1])})(${sg(A[1][0])}) = ${sg(d)}.`, mText("A", A), "2x2", [A[0][0] * A[1][1] + A[0][1] * A[1][0], -d]);
}

// UU.13-UU.15: matriz inversa, identificar inversas y resolver con la inversa.
export function matrixInverse(r: Rng, mode: "inverse" | "identify" | "solve"): Question {
  // Matrices con determinante ±1 para que la inversa sea entera.
  const a = r.int(1, 4), b = r.int(1, 4);
  const A: M2 = r.chance(0.5) ? [[a * b + 1, a], [b, 1]] : [[1, a], [b, a * b + 1]];
  const d = det2(A);
  const inv: M2 = [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]];
  const show = (m: M2) => `[[${m[0].map(sg).join(", ")}], [${m[1].map(sg).join(", ")}]]`;
  if (mode === "identify") {
    const yes = r.chance(0.5);
    const B: M2 = yes ? inv : [[inv[0][0], -inv[0][1]], [-inv[1][0], inv[1][1]]];
    return yesNo("¿B es la inversa de A?", yes, yes ? "A · B da la matriz identidad." : "A · B no da la matriz identidad.", `${mText("A", A)}\n${mText("B", B)}`, yes ? "si" : "no");
  }
  if (mode === "solve") {
    const x = r.int(-5, 5), y = r.int(-5, 5);
    const bv = [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
    return pointQ(r, `Resuelve A · [x, y] = [${sg(bv[0])}, ${sg(bv[1])}] usando la inversa de A. ¿Cuánto valen (x, y)?`, { x, y }, `[x, y] = A⁻¹ · [${sg(bv[0])}, ${sg(bv[1])}] = ${pt({ x, y })}.`, mText("A", A), "resolver");
  }
  return choiceQ(r, "¿Cuál es la inversa de A?", show(inv), [show([[A[1][1], A[0][1]], [A[1][0], A[0][0]]]), show([[inv[0][0], -inv[0][1]], [-inv[1][0], inv[1][1]]]), show(A)].filter((w, i, all) => w !== show(inv) && all.indexOf(w) === i), `A⁻¹ = (1/det) · [[d, −b], [−c, a]] con det = ${sg(d)}.`, mText("A", A), "inversa");
}

const TRANS: [string, M2][] = [["Reflexión respecto del eje x", [[1, 0], [0, -1]]], ["Reflexión respecto del eje y", [[-1, 0], [0, 1]]], ["Rotación de 90° antihoraria", [[0, -1], [1, 0]]], ["Rotación de 180°", [[-1, 0], [0, -1]]], ["Reflexión respecto de y = x", [[0, 1], [1, 0]]], ["Dilatación de factor 2", [[2, 0], [0, 2]]]];
// UU.16-UU.18: matrices de transformación (identificar, matriz de vértices, imagen).
export function transformMatrix(r: Rng, mode: "identify" | "vertex" | "image"): Question {
  const [name, M] = r.pick(TRANS);
  const pts = [{ x: r.int(-4, 4), y: r.int(-4, 4) }, { x: r.int(-4, 4), y: r.int(-4, 4) }, { x: r.int(-4, 4), y: r.int(-4, 4) }];
  if (mode === "identify") return choiceQ(r, "¿Qué transformación representa la matriz T?", name, TRANS.filter((t) => t[0] !== name).map((t) => t[0]).slice(0, 3), "Se aplica T a (1, 0) y (0, 1) y se observa a dónde van.", mText("T", M), "identificar");
  if (mode === "vertex") {
    const good = `[[${pts.map((p) => sg(p.x)).join(", ")}], [${pts.map((p) => sg(p.y)).join(", ")}]]`;
    return choiceQ(r, `¿Cuál es la matriz de vértices del triángulo de vértices ${pts.map(pt).join(", ")}?`, good, [`[[${pts.map((p) => sg(p.y)).join(", ")}], [${pts.map((p) => sg(p.x)).join(", ")}]]`, `[[${pts.map((p) => `${sg(p.x)}, ${sg(p.y)}`).join("], [")}]]`, `[[${pts.map((p) => sg(-p.x)).join(", ")}], [${pts.map((p) => sg(p.y)).join(", ")}]]`].filter((w) => w !== good), "La primera fila tiene las coordenadas x y la segunda las y, un vértice por columna.", undefined, "vertices");
  }
  const P = pts[0];
  const img = { x: M[0][0] * P.x + M[0][1] * P.y, y: M[1][0] * P.x + M[1][1] * P.y };
  return pointQ(r, `Se multiplica la matriz T por el vértice ${pt(P)}. ¿Cuál es su imagen?`, img, `T · [${sg(P.x)}, ${sg(P.y)}] = ${pt(img)} (${name.toLowerCase()}).`, mText("T", M), "imagen");
}


