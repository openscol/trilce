import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, intQ, numQ, par, sg, table, yesNo } from "../kit";
import { type P, lin, nz, pointQ } from "../sec1/util";
import { SLOPES, drawnLine, intPoints, pointSlopeText, randomLine, stdText } from "../sec2/algebra";
import { lineEnds, lineEqQ, linesPlane, pt, slopeIntercept, slopeQ, slopeText } from "../sec2/util";
import { coef, curve, dec, valQ } from "./util";

const cx = (k: number, v = "x") => `${coef(k)}${v}`;

// Álgebra 1: formas de la ecuación de la recta, conceptos de función,
// funciones lineales, sistemas con matrices, inecuaciones de dos variables
// y funciones definidas por partes.

// ---------------------------------------------------------------------------
// Ecuaciones de la recta

// Escribir ecuaciones en forma general (Ax + By = C, A > 0, enteros).
export function writeStandard(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-6, 6);
  // y = (mn/md)x + b → −mn·x + md·y = md·b; se deja A positivo.
  let [A, B, C] = [-mn, md, md * b];
  if (A < 0) [A, B, C] = [-A, -B, -C];
  const good = stdText(A, B, C);
  const wrong = [stdText(A, -B, C), stdText(A, B, -C), stdText(B, A, C), stdText(A, B, C + B)].filter((w) => w !== good);
  return choiceQ(r, `Escribe ${slopeIntercept(mn, md, b)} en forma general (Ax + By = C, con coeficientes enteros).`, good, [...new Set(wrong)], `Se multiplica por ${md} y se pasa el término con x al lado izquierdo: ${good}.`, undefined, "forma-general");
}

// Forma general: intersecciones con los ejes.
export function standardIntercepts(r: Rng): Question {
  const px = nz(r, 6), py = nz(r, 6);
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
  const k = g(g(py, px), px * py);
  let [A, B, C] = [py / k, px / k, (px * py) / k];
  if (A < 0) [A, B, C] = [-A, -B, -C];
  const xAxis = r.chance(0.5);
  return intQ(r, `¿En qué valor corta la recta ${stdText(A, B, C)} al eje ${xAxis ? "x" : "y"}?`, xAxis ? px : py, xAxis ? `Con y = 0: ${cx(A)} = ${sg(C)} → x = ${sg(px)}.` : `Con x = 0: ${cx(B).replace("x", "y")} = ${sg(C)} → y = ${sg(py)}.`, undefined, xAxis ? "corte-x" : "corte-y", [xAxis ? py : px, -(xAxis ? px : py), C]);
}

// Escribir la ecuación en forma punto-pendiente (con datos o desde el gráfico).
export function writePointSlope(r: Rng, graph: boolean): Question {
  const [mn, md, b] = randomLine(r);
  const pts = intPoints(mn, md, b).filter((p) => p.x !== 0);
  const p = r.pick(pts);
  const good = pointSlopeText(mn, md, p);
  const wrong = [pointSlopeText(mn, md, { x: -p.x, y: -p.y }), pointSlopeText(-mn, md, p), pointSlopeText(md, Math.abs(mn) || 1, p), pointSlopeText(mn, md, { x: p.y, y: p.x })].filter((w) => w !== good);
  if (graph) {
    const q = pts.find((s) => s.x === p.x + md) ?? pts.find((s) => s.x === p.x - md) ?? pts.find((s) => s !== p)!;
    return choiceQ(r, `¿Qué ecuación en forma punto-pendiente corresponde a la recta? Usa el punto ${pt(p)}.`, good, [...new Set(wrong)], `Pendiente entre ${pt(p)} y ${pt(q)}: ${slopeText(mn, md)}. Forma y − y₁ = m(x − x₁): ${good}.`, linesPlane([{ mn, md, b }], [p, q]), "grafico");
  }
  return choiceQ(r, `Una recta pasa por ${pt(p)} y tiene pendiente ${slopeText(mn, md)}. ¿Cuál es su ecuación en forma punto-pendiente?`, good, [...new Set(wrong)], `y − y₁ = m(x − x₁) con (x₁, y₁) = ${pt(p)} y m = ${slopeText(mn, md)}: ${good}.`, undefined, "datos");
}

// Pendiente e intersecciones a partir de la ecuación.
export function slopeAndIntercepts(r: Rng): Question {
  const px = nz(r, 6), py = nz(r, 6);
  const A = py, B = px, C = px * py;
  const eq = stdText(A, B, C);
  const k = r.int(0, 2);
  if (k === 0) return slopeQ(r, `¿Cuál es la pendiente de la recta ${eq}?`, -py, px, `Se despeja y: y = ${slopeIntercept(-py, px, py).slice(4)}. La pendiente es ${slopeText(-py, px)}.`, undefined, "pendiente");
  if (k === 1) return intQ(r, `¿En qué valor corta la recta ${eq} al eje x?`, px, `Con y = 0: x = ${sg(C)} ÷ ${par(A)} = ${sg(px)}.`, undefined, "corte-x", [py, -px]);
  return intQ(r, `¿En qué valor corta la recta ${eq} al eje y?`, py, `Con x = 0: y = ${sg(C)} ÷ ${par(B)} = ${sg(py)}.`, undefined, "corte-y", [px, -py]);
}

// Graficar una recta: práctica mixta.
export function graphLineMixed(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const form = r.int(0, 2);
  const p = intPoints(mn, md, b).find((q) => q.x !== 0) ?? { x: md, y: b + mn };
  let eq = slopeIntercept(mn, md, b);
  if (form === 1) eq = pointSlopeText(mn, md, p);
  if (form === 2) eq = stdText(-mn, md, md * b);
  return drawnLine(r, eq, mn, md, b, `Pasa por ${pt({ x: 0, y: b })} y tiene pendiente ${slopeText(mn, md)}.`, ["pendiente-interseccion", "punto-pendiente", "forma-general"][form]);
}

// Ecuación de una recta paralela o perpendicular.
export function parallelPerpLine(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b0 = r.int(-5, 5);
  const perp = r.chance(0.5);
  const [m2n, m2d] = perp ? [-md, mn] : [mn, md];
  const b = r.int(-5, 5);
  const p = intPoints(m2n, m2d, b).find((q) => q.x !== 0) ?? { x: 0, y: b };
  const why = `${perp ? "La pendiente perpendicular es el inverso opuesto" : "Las paralelas tienen la misma pendiente"}: ${slopeText(m2n, m2d)}. Con el punto ${pt(p)}, b = ${sg(b)}.`;
  return lineEqQ(r, `¿Cuál es la ecuación de la recta ${perp ? "perpendicular" : "paralela"} a ${slopeIntercept(mn, md, b0)} que pasa por ${pt(p)}?`, m2n, m2d, b, why, undefined, perp ? "perpendicular" : "paralela");
}

// ---------------------------------------------------------------------------
// Conceptos de función

// Relaciones: pasar entre tablas, gráficos, diagramas y listas de puntos.
export function convertRelation(r: Rng): Question {
  const ps: P[] = r.shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 4).map((x) => ({ x, y: r.int(-4, 5) }));
  const list = (qs: P[]) => `{${qs.map(pt).join(", ")}}`;
  const swapped = ps.map((p) => ({ x: p.y, y: p.x }));
  const changed = ps.map((p, i) => (i === 1 ? { x: p.x, y: p.y + 1 } : p));
  const negated = ps.map((p, i) => (i === 2 ? { x: -p.x || 4, y: p.y } : p));
  const wrong = [list(swapped), list(changed), list(negated)].filter((w) => w !== list(ps));
  if (r.chance(0.5)) return choiceQ(r, "¿Qué lista de pares ordenados representa la misma relación que la tabla?", list(ps), wrong, "Cada fila de la tabla es un par (x, y).", table(["x", "y"], ps.map((p) => [sg(p.x), sg(p.y)])), "tabla");
  return choiceQ(r, "¿Qué lista de pares ordenados representa la relación del gráfico?", list(ps), wrong, "Cada punto del gráfico es un par (x, y).", { kind: "coordPlane", min: -6, max: 6, points: ps.map((p) => ({ ...p, emoji: "•" })) }, "grafico");
}

// Evaluar una función reemplazando por una expresión.
export function plugExpression(r: Rng): Question {
  const a = nz(r, 5), b = nz(r, 8), k = nz(r, 4);
  const f = lin(a, b);
  const good = lin(a, a * k + b);
  const wrong = [lin(a, k + b), lin(a + k, b), lin(a, a * k - b), lin(a * k, b)].filter((w) => w !== good);
  return choiceQ(r, `Si f(x) = ${f}, ¿cuánto es f(x ${k < 0 ? "−" : "+"} ${Math.abs(k)})?`, good, [...new Set(wrong)], `Se reemplaza x por (x ${k < 0 ? "−" : "+"} ${Math.abs(k)}): ${sg(a)}(x ${k < 0 ? "−" : "+"} ${Math.abs(k)}) ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${good}.`, undefined, "expresion");
}

// Hallar (o aproximar) soluciones con una tabla.
export function tableSolutions(r: Rng, approximate: boolean): Question {
  const xs = [-2, -1, 0, 1, 2, 3, 4];
  const a = nz(r, 3), b = r.int(-4, 4), c = nz(r, 3);
  if (a === c) return tableSolutions(r, approximate);
  const f = (x: number) => a * x + b;
  if (approximate) {
    // f(x) = valor entre dos filas: se pregunta entre qué x está la solución.
    const i = r.int(1, xs.length - 2);
    const target = f(xs[i]) + a / 2;
    const good = `Entre ${sg(xs[i])} y ${sg(xs[i] + 1)}`;
    return choiceQ(r, `Según la tabla de f, ¿entre qué valores de x está la solución de f(x) = ${dec(target)}?`, good, [`Entre ${sg(xs[i] - 1)} y ${sg(xs[i])}`, `Entre ${sg(xs[i] + 1)} y ${sg(xs[i] + 2)}`, `Entre ${sg(xs[i] - 2)} y ${sg(xs[i] - 1)}`], `${dec(target)} está entre f(${sg(xs[i])}) = ${sg(f(xs[i]))} y f(${sg(xs[i] + 1)}) = ${sg(f(xs[i] + 1))}.`, table(["x", "f(x)"], xs.map((x) => [sg(x), sg(f(x))])), "aproximar");
  }
  const x0 = r.pick(xs.slice(1, -1));
  const d = f(x0) - c * x0;
  const g = (x: number) => c * x + d;
  return intQ(r, `Las tablas muestran f(x) = ${lin(a, b)} y g(x) = ${lin(c, d)}. ¿Para qué valor de x se cumple f(x) = g(x)?`, x0, `En x = ${sg(x0)} las dos tablas dan ${sg(f(x0))}.`, table(["x", "f(x)", "g(x)"], xs.map((x) => [sg(x), sg(f(x)), sg(g(x))])), "tabla", [f(x0), x0 + 1]);
}

const EVERYDAY: [string, (x: number, y: number) => string, (x: number, y: number) => string[]][] = [
  ["C(h) es el costo, en soles, de alquilar una bicicleta por h horas", (x, y) => `Alquilar la bicicleta ${x} horas cuesta ${y} soles`, (x, y) => [`Alquilar la bicicleta ${y} horas cuesta ${x} soles`, `Cada hora de alquiler cuesta ${y} soles`, `Con ${y} soles se alquila ${x} horas más`]],
  ["T(m) es la temperatura del horno, en °C, m minutos después de encenderlo", (x, y) => `A los ${x} minutos, el horno está a ${y} °C`, (x, y) => [`A los ${y} minutos, el horno está a ${x} °C`, `La temperatura sube ${y} °C cada minuto`, `El horno tarda ${y} minutos en llegar a ${x} °C`]],
  ["P(d) es el número de páginas que Lucía ha leído después de d días", (x, y) => `Después de ${x} días, Lucía ha leído ${y} páginas`, (x, y) => [`Después de ${y} días, Lucía ha leído ${x} páginas`, `Lucía lee ${y} páginas cada día`, `Al libro le faltan ${y} páginas por leer`]],
];
// Interpretar funciones con lenguaje cotidiano.
export function interpretFunction(r: Rng): Question {
  const [ctx, good, wrong] = r.pick(EVERYDAY);
  const x = r.int(2, 9), y = r.int(12, 99);
  const name = ctx[0];
  return choiceQ(r, `${ctx}. ¿Qué significa ${name}(${x}) = ${y}?`, good(x, y), wrong(x, y), `Lo que va entre paréntesis es la entrada (${x}) y el resultado es la salida (${y}).`, undefined, "lenguaje");
}

// Estimar la tasa de cambio promedio a partir de un gráfico.
export function averageRate(r: Rng): Question {
  const a = r.pick([1, -1]) * r.pick([0.5, 1]), h = r.int(-2, 2), k = r.int(-4, 2);
  const f = (x: number) => a * (x - h) ** 2 + k;
  const x1 = r.int(-4, 1), x2 = x1 + r.int(2, 4);
  if (Math.abs(f(x1)) > 6 || Math.abs(f(x2)) > 6 || !Number.isInteger(f(x1)) || !Number.isInteger(f(x2))) return averageRate(r);
  const rate = (f(x2) - f(x1)) / (x2 - x1);
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [{ x: x1, y: f(x1), emoji: "•" }, { x: x2, y: f(x2), emoji: "•" }], curves: [{ points: curve(f) }] };
  return valQ(r, `¿Cuál es la tasa de cambio promedio de la función entre x = ${sg(x1)} y x = ${sg(x2)}?`, rate, [-rate, (f(x2) - f(x1)), rate + 1, (x2 - x1) / (f(x2) - f(x1) || 1)], `(f(${sg(x2)}) − f(${sg(x1)})) ÷ (${sg(x2)} − ${par(x1)}) = (${sg(f(x2))} − ${par(f(x1))}) ÷ ${x2 - x1} = ${dec(rate)}.`, visual, "promedio");
}

// ---------------------------------------------------------------------------
// Funciones lineales

// Dominio y rango de funciones lineales (gráficos y problemas).
export function linearDomainRange(r: Rng, word: boolean): Question {
  if (word) {
    const per = r.int(2, 6), max = r.pick([10, 12, 15, 20]), fee = r.int(5, 15);
    const name = r.pick(NAMES);
    const domain = r.chance(0.5);
    const good = domain ? `0 ≤ x ≤ ${max}` : `${fee} ≤ y ≤ ${fee + per * max}`;
    const wrong = domain ? [`0 ≤ x ≤ ${fee + per * max}`, `${fee} ≤ x ≤ ${max}`, `x ≥ 0`] : [`0 ≤ y ≤ ${fee + per * max}`, `${fee} ≤ y ≤ ${max}`, `y ≥ ${fee}`];
    return choiceQ(r, `${name} paga ${fee} soles de entrada a un parque y ${per} soles por cada juego; el parque permite hasta ${max} juegos por persona. Si x es el número de juegos y y el costo total, ¿cuál es el ${domain ? "dominio" : "rango"}? (x es entero.)`, good, wrong, domain ? `x va de 0 a ${max} juegos.` : `El costo va de ${fee} (0 juegos) a ${fee} + ${per} × ${max} = ${fee + per * max}.`, undefined, domain ? "dominio" : "rango");
  }
  const [mn, md, b] = randomLine(r);
  // Un segmento interior (que no llegue al borde del plano), entre dos puntos enteros.
  const pts = intPoints(mn, md, b).filter((p) => Math.abs(p.x) <= 5 && Math.abs(p.y) <= 5);
  if (pts.length < 2) return linearDomainRange(r, word);
  const i = r.int(0, pts.length - 2), j = r.int(i + 1, pts.length - 1);
  const A = pts[i], B = pts[j];
  if (A.x === B.x) return linearDomainRange(r, word);
  const ca = r.chance(0.5), cb = r.chance(0.5);
  const domain = r.chance(0.5);
  const lo = domain ? A.x : Math.min(A.y, B.y), hi = domain ? B.x : Math.max(A.y, B.y);
  const cl = domain ? ca : A.y <= B.y ? ca : cb, ch = domain ? cb : A.y <= B.y ? cb : ca;
  const v = domain ? "x" : "y";
  const good = `${sg(lo)} ${cl ? "≤" : "<"} ${v} ${ch ? "≤" : "<"} ${sg(hi)}`;
  const wrong = [`${sg(lo)} ${cl ? "<" : "≤"} ${v} ${ch ? "≤" : "<"} ${sg(hi)}`, `${sg(lo)} ${cl ? "≤" : "<"} ${v} ${ch ? "<" : "≤"} ${sg(hi)}`, domain ? `${sg(Math.min(A.y, B.y))} ≤ x ≤ ${sg(Math.max(A.y, B.y))}` : `${sg(A.x)} ≤ y ≤ ${sg(B.x)}`];
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [ca ? A : null, cb ? B : null].filter((p): p is P => !!p).map((p) => ({ ...p, emoji: "•" })), openPoints: [ca ? null : A, cb ? null : B].filter((p): p is P => !!p), lines: [{ from: A, to: B }] };
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de la función del gráfico?`, good, [...new Set(wrong)].filter((w) => w !== good), `${domain ? "Valores de x" : "Valores de y"} que alcanza el segmento; un círculo vacío indica que ese extremo no se incluye.`, visual, domain ? "dominio" : "rango");
}

// Transformaciones de funciones lineales.
export function transformLinear(r: Rng): Question {
  const a = nz(r, 4), b = nz(r, 6), k = nz(r, 5);
  const f = lin(a, b);
  const form = r.int(0, 2);
  if (form === 0) {
    const good = lin(a, b + k);
    return choiceQ(r, `Si f(x) = ${f} y g(x) = f(x) ${k < 0 ? "−" : "+"} ${Math.abs(k)}, ¿cuál es g(x)?`, good, [lin(a, b - k), lin(a + k, b), lin(a, a * k + b)].filter((w) => w !== good), `Se suma ${sg(k)} a toda la función: ${good}. El gráfico se traslada ${Math.abs(k)} hacia ${k > 0 ? "arriba" : "abajo"}.`, undefined, "vertical");
  }
  if (form === 1) {
    const OPTS = [`Se traslada ${Math.abs(k)} unidades hacia ${k > 0 ? "arriba" : "abajo"}`, `Se traslada ${Math.abs(k)} unidades hacia ${k > 0 ? "abajo" : "arriba"}`, `Se vuelve ${Math.abs(k)} veces más inclinada`, "Se refleja respecto del eje x"];
    return choiceQ(r, `¿Cómo cambia el gráfico de f(x) = ${f} al pasar a g(x) = ${lin(a, b + k)}?`, OPTS[0], OPTS.slice(1), `Solo cambió el término independiente: ${sg(b)} → ${sg(b + k)}.`, undefined, "describir");
  }
  const good = lin(-a, -b);
  return choiceQ(r, `Si f(x) = ${f} y g(x) = −f(x), ¿cuál es g(x)?`, good, [lin(-a, b), lin(a, -b), lin(a, b)].filter((w) => w !== good), `Se cambia el signo de toda la función: ${good}. El gráfico se refleja respecto del eje x.`, undefined, "reflexion");
}

// ---------------------------------------------------------------------------
// Sistemas: matrices aumentadas

// Resolver un sistema con una matriz aumentada.
export function augmentedMatrix(r: Rng, word: boolean): Question {
  const x = r.int(-5, 6), y = r.int(-5, 6);
  const a1 = nz(r, 4), b1 = nz(r, 4), a2 = nz(r, 4), b2 = nz(r, 4);
  if (a1 * b2 === a2 * b1) return augmentedMatrix(r, word);
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
  const w = (n: number) => sg(n).padStart(3, " ");
  const matrix = `[ ${w(a1)}  ${w(b1)} | ${w(c1)} ]\n[ ${w(a2)}  ${w(b2)} | ${w(c2)} ]`;
  if (word) {
    const p1 = r.int(2, 6), p2 = r.int(p1 + 1, 9), n1 = r.int(3, 9), n2 = r.int(3, 9);
    return numQ(n1, `Una librería vendió ${n1 + n2} artículos entre cuadernos de ${p1} soles y lapiceros de ${p2} soles, y recaudó ${n1 * p1 + n2 * p2} soles. La matriz aumentada representa el sistema (x = cuadernos, y = lapiceros). ¿Cuántos cuadernos vendió?`, `[ 1  1 | ${n1 + n2} ]\n[ ${p1}  ${p2} | ${n1 * p1 + n2 * p2} ]`, `La matriz representa x + y = ${n1 + n2} y ${p1}x + ${p2}y = ${n1 * p1 + n2 * p2}. Al reducirla por filas: x = ${n1}, y = ${n2}.`, "problema");
  }
  return pointQ(r, "La matriz aumentada representa un sistema de ecuaciones en x e y. ¿Cuál es la solución (x, y)?", { x, y }, `La matriz representa ${stdText(a1, b1, c1)} y ${stdText(a2, b2, c2)}. Reduciendo por filas: x = ${sg(x)}, y = ${sg(y)}.`, matrix, "matriz");
}

// ---------------------------------------------------------------------------
// Inecuaciones de dos variables

type Ineq2 = { mn: number; md: number; b: number; op: "<" | ">" | "≤" | "≥" };
const OPS2: Ineq2["op"][] = ["<", ">", "≤", "≥"];
const ineq2Text = (q: Ineq2) => slopeIntercept(q.mn, q.md, q.b).replace(/^y =/, `y ${q.op}`);
function ineq2Visual(q: Ineq2): Visual {
  const f = (x: number) => q.b + (q.mn * x) / q.md;
  const above = q.op === ">" || q.op === "≥";
  const ends = lineEnds(q.mn, q.md, q.b, 6) ?? { from: { x: -6, y: f(-6) }, to: { x: 6, y: f(6) } };
  return {
    kind: "coordPlane",
    min: -6,
    max: 6,
    points: [],
    regions: [{ points: [{ x: -7, y: f(-7) }, { x: 7, y: f(7) }, { x: 7, y: above ? 40 : -40 }, { x: -7, y: above ? 40 : -40 }] }],
    lines: [{ ...ends, dashed: q.op === "<" || q.op === ">" }],
  };
}
const randomIneq2 = (r: Rng): Ineq2 => {
  const [mn, md, b] = randomLine(r);
  return { mn, md, b, op: r.pick(OPS2) };
};

// ¿el par cumple la inecuación (o el sistema)?
export function satisfiesIneq2(r: Rng, system: boolean): Question {
  const q1 = randomIneq2(r), q2 = randomIneq2(r);
  const p = { x: r.int(-5, 5), y: r.int(-5, 5) };
  const ok = (q: Ineq2) => {
    const v = q.b + (q.mn * p.x) / q.md;
    return q.op === "<" ? p.y < v : q.op === ">" ? p.y > v : q.op === "≤" ? p.y <= v : p.y >= v;
  };
  if (system) {
    const yes = ok(q1) && ok(q2);
    return yesNo(`¿El par ${pt(p)} es solución del sistema de inecuaciones?`, yes, yes ? "Cumple las dos inecuaciones." : `No cumple ${ok(q1) ? "la segunda" : "la primera"} inecuación.`, `${ineq2Text(q1)}\n${ineq2Text(q2)}`, yes ? "si" : "no");
  }
  const v = q1.b + (q1.mn * p.x) / q1.md;
  return yesNo(`¿El par ${pt(p)} cumple la inecuación ${ineq2Text(q1)}?`, ok(q1), `Con x = ${sg(p.x)}, el lado derecho vale ${dec(v)}; ${sg(p.y)} ${q1.op} ${dec(v)} es ${ok(q1) ? "verdadero" : "falso"}.`, undefined, ok(q1) ? "si" : "no");
}

// Despejar y en una inecuación.
export function ineqSolveY(r: Rng): Question {
  const B = r.pick([1, 2, 3, -1, -2]), A = nz(r, 5), b = r.int(-5, 5), op = r.pick(OPS2);
  const flip: Record<Ineq2["op"], Ineq2["op"]> = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
  const res: Ineq2 = { mn: -A, md: B, b, op: B < 0 ? flip[op] : op };
  const shown = `${stdText(A, B, B * b).replace(" = ", ` ${op} `)}`;
  const good = ineq2Text(res);
  const wrong = [ineq2Text({ ...res, op: flip[res.op] }), ineq2Text({ ...res, mn: A }), ineq2Text({ ...res, b: -b })].filter((w) => w !== good);
  return choiceQ(r, `Despeja y en la inecuación ${shown}.`, good, wrong, `Se pasa ${lin(A, 0)} al otro lado y se divide entre ${sg(B)}${B < 0 ? "; como es negativo, se invierte el signo" : ""}: ${good}.`, undefined, B < 0 ? "invierte" : "no-invierte");
}

// Graficar una inecuación de dos variables / escribirla a partir del gráfico.
export function graphIneq2(r: Rng, write: boolean): Question {
  const q = randomIneq2(r);
  const why = `Borde: ${slopeIntercept(q.mn, q.md, q.b)}, ${q.op === "<" || q.op === ">" ? "punteado (no se incluye)" : "continuo (se incluye)"}; se sombrea ${q.op === ">" || q.op === "≥" ? "arriba" : "abajo"} de la recta.`;
  if (write) return choiceQ(r, "¿Qué inecuación representa el gráfico?", ineq2Text(q), OPS2.filter((o) => o !== q.op).map((op) => ineq2Text({ ...q, op })), why, ineq2Visual(q), "escribir");
  const yes = r.chance(0.5);
  const shown = yes ? q : { ...q, op: r.pick(OPS2.filter((o) => o !== q.op)) };
  return yesNo(`¿El gráfico muestra las soluciones de ${ineq2Text(q)}?`, yes, why, ineq2Visual(shown), "graficar");
}

// Escribir inecuaciones de dos variables: problemas.
export function ineq2Word(r: Rng): Question {
  const p1 = r.int(2, 9), p2 = r.int(2, 9), total = r.int(40, 120);
  if (p1 === p2) return ineq2Word(r);
  const name = r.pick(NAMES);
  const [a, b] = r.pick([["polos", "gorras"], ["cuadernos", "lapiceros"], ["entradas de adulto", "entradas de niño"]]);
  const good = `${p1}x + ${p2}y ≤ ${total}`;
  return choiceQ(r, `${name} tiene ${total} soles para comprar ${a} de ${p1} soles y ${b} de ${p2} soles. Si x es la cantidad de ${a} e y la de ${b}, ¿qué inecuación muestra lo que puede comprar?`, good, [`${p1}x + ${p2}y ≥ ${total}`, `${p2}x + ${p1}y ≤ ${total}`, `x + y ≤ ${total}`], `El gasto (${p1}x + ${p2}y) no puede pasar de ${total}: se usa ≤.`, undefined, "plantear");
}

// Resolver sistemas de inecuaciones graficando (¿qué punto está en la región?).
export function ineqSystemGraph(r: Rng): Question {
  const q1 = randomIneq2(r), q2 = randomIneq2(r);
  if (q1.mn * q2.md === q2.mn * q1.md) return ineqSystemGraph(r);
  const ok = (q: Ineq2, p: P) => {
    const v = q.b + (q.mn * p.x) / q.md;
    return q.op === "<" ? p.y < v : q.op === ">" ? p.y > v : q.op === "≤" ? p.y <= v : p.y >= v;
  };
  const all: P[] = [];
  for (let x = -5; x <= 5; x++) for (let y = -5; y <= 5; y++) all.push({ x, y });
  const inside = all.filter((p) => ok(q1, p) && ok(q2, p)), outside = all.filter((p) => !(ok(q1, p) && ok(q2, p)));
  if (!inside.length || outside.length < 3) return ineqSystemGraph(r);
  const v1 = ineq2Visual(q1), v2 = ineq2Visual(q2);
  const visual: Visual = v1.kind === "coordPlane" && v2.kind === "coordPlane" ? { ...v1, regions: [...(v1.regions ?? []), ...(v2.regions ?? [])], lines: [...(v1.lines ?? []), ...(v2.lines ?? [])] } : v1;
  return choiceQ(r, "El gráfico muestra un sistema de inecuaciones (la solución es donde se cruzan las dos zonas sombreadas). ¿Qué punto es una solución?", pt(r.pick(inside)), r.shuffle(outside).slice(0, 3).map(pt), `La solución es la zona sombreada dos veces; ese punto cumple ${ineq2Text(q1)} y ${ineq2Text(q2)}.`, visual, "sistema");
}

// ---------------------------------------------------------------------------
// Funciones definidas por partes

type Piece = { a: number; b: number; from?: number; to?: number; closedFrom?: boolean; closedTo?: boolean };
function piecewise(r: Rng): { pieces: Piece[]; c: number; text: string } {
  const c = r.int(-2, 2);
  const left = r.chance(0.5);
  const pieces: Piece[] = [
    { a: nz(r, 2), b: r.int(-3, 3), to: c, closedTo: left },
    { a: nz(r, 2), b: r.int(-3, 3), from: c, closedFrom: !left },
  ];
  const text = `f(x) = ${lin(pieces[0].a, pieces[0].b)}, si x ${left ? "≤" : "<"} ${sg(c)}\nf(x) = ${lin(pieces[1].a, pieces[1].b)}, si x ${left ? ">" : "≥"} ${sg(c)}`;
  return { pieces, c, text };
}
const pieceAt = (pieces: Piece[], x: number) => pieces.find((p) => (p.to === undefined || x < p.to || (x === p.to && p.closedTo)) && (p.from === undefined || x > p.from || (x === p.from && p.closedFrom)))!;

// Evaluar funciones definidas por partes.
export function evaluatePiecewise(r: Rng): Question {
  const { pieces, c, text } = piecewise(r);
  const x = r.chance(0.4) ? c : r.int(-5, 5);
  const p = pieceAt(pieces, x);
  const other = pieces.find((q) => q !== p)!;
  const v = p.a * x + p.b;
  return intQ(r, `¿Cuánto vale f(${sg(x)})?`, v, `${sg(x)} cumple la condición de la parte ${lin(p.a, p.b)}: ${lin(p.a, p.b).replace("x", `(${sg(x)})`)} = ${sg(v)}.`, text, x === c ? "borde" : "parte", [other.a * x + other.b, -v]);
}

// Graficar funciones definidas por partes.
export function graphPiecewise(r: Rng): Question {
  const { pieces, c, text } = piecewise(r);
  const yes = r.chance(0.5);
  // Gráfico incorrecto: los extremos abierto/cerrado invertidos o las dos partes intercambiadas.
  const swapEnds = pieces.map((p) => ({ ...p, closedFrom: !p.closedFrom, closedTo: !p.closedTo }));
  const swapSides: Piece[] = [{ ...pieces[1], from: undefined, to: c, closedTo: pieces[0].closedTo }, { ...pieces[0], from: c, to: undefined, closedFrom: pieces[1].closedFrom }];
  const shown = yes ? pieces : r.chance(0.5) ? swapEnds : swapSides;
  const segs = shown.map((p) => {
    const x1 = p.from ?? -7, x2 = p.to ?? 7;
    return { from: { x: x1, y: p.a * x1 + p.b }, to: { x: x2, y: p.a * x2 + p.b }, color: "green" as const };
  });
  const ends = shown.map((p) => (p.from !== undefined ? { x: p.from, y: p.a * p.from + p.b, closed: !!p.closedFrom } : { x: p.to!, y: p.a * p.to! + p.b, closed: !!p.closedTo }));
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: ends.filter((e) => e.closed).map((e) => ({ x: e.x, y: e.y, emoji: "•" })), openPoints: ends.filter((e) => !e.closed).map((e) => ({ x: e.x, y: e.y })), lines: segs };
  const why = `A la izquierda de ${sg(c)} va ${lin(pieces[0].a, pieces[0].b)} y a la derecha ${lin(pieces[1].a, pieces[1].b)}; en x = ${sg(c)} el punto lleno va en la parte que incluye el ${sg(c)}.`;
  return yesNo(`¿El gráfico corresponde a esta función definida por partes?\n${text}`, yes, why, visual, "grafico");
}

