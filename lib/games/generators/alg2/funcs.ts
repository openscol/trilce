import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, fmt, intQ, numQ, sg, table, yesNo } from "../kit";
import { lin, nz, pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { curve, line10, poly, polyAdd, polyMul, xMinus } from "../alg1/util";

// Álgebra 2: sistemas de tres variables, regiones factibles y programación
// lineal, inecuaciones con valor absoluto y cuadráticas, sistemas no
// lineales, operaciones y composición de funciones, funciones inversas,
// funciones racionales y variación conjunta y combinada.

type P = { x: number; y: number };
const term = (k: number, v: string, first: boolean) => (k === 0 ? "" : `${first ? (k < 0 ? "−" : "") : k < 0 ? " − " : " + "}${Math.abs(k) === 1 ? "" : Math.abs(k)}${v}`);
const eq3 = (a: number, b: number, c: number, d: number) => `${term(a, "x", true)}${term(b, "y", !a)}${term(c, "z", !a && !b)} = ${sg(d)}`;
const triple = (x: number, y: number, z: number) => `(${sg(x)}, ${sg(y)}, ${sg(z)})`;

// E.12-E.14: sistemas de tres ecuaciones con tres incógnitas.
export function system3(r: Rng, mode: "substitution" | "elimination" | "count"): Question {
  const x = r.int(-4, 5), y = r.int(-4, 5), z = r.int(-4, 5);
  if (mode === "count") {
    const kind = r.int(0, 2);
    const [a, b, c] = [nz(r, 3), nz(r, 3), nz(r, 3)];
    const e1 = [a, b, c, a * x + b * y + c * z];
    const e2 = [1, nz(r, 2), nz(r, 2)];
    e2.push(e2[0] * x + e2[1] * y + e2[2] * z);
    let e3: number[];
    if (kind === 0) {
      e3 = [nz(r, 2), 1, nz(r, 3)];
      e3.push(e3[0] * x + e3[1] * y + e3[2] * z);
      const det = e1[0] * (e2[1] * e3[2] - e2[2] * e3[1]) - e1[1] * (e2[0] * e3[2] - e2[2] * e3[0]) + e1[2] * (e2[0] * e3[1] - e2[1] * e3[0]);
      if (det === 0) return system3(r, mode);
    } else e3 = e1.map((v, i) => (i === 3 ? v * 2 + (kind === 1 ? r.pick([1, -2, 3]) : 0) : v * 2));
    const O = ["Una solución", "Ninguna solución", "Infinitas soluciones"];
    return fixedQ("¿Cuántas soluciones tiene el sistema?", O, O[kind], ["Ninguna ecuación es combinación de las otras: hay una sola solución.", "La tercera ecuación tiene los mismos coeficientes que el doble de la primera, pero otro término independiente: es imposible.", "La tercera ecuación es el doble de la primera: sobra una ecuación y hay infinitas soluciones."][kind], [e1, e2, e3].map((e) => eq3(e[0], e[1], e[2], e[3])).join("\n"), ["una", "ninguna", "infinitas"][kind]);
  }
  let rows: number[][];
  if (mode === "substitution") {
    const k = nz(r, 3), m = r.int(-5, 5);
    // z = kx + m se reemplaza en las otras.
    const zz = k * x + m;
    const a = [nz(r, 3), nz(r, 3), 1], b = [1, nz(r, 3), nz(r, 2)];
    rows = [[-k, 0, 1, m], [...a, a[0] * x + a[1] * y + zz], [...b, b[0] * x + b[1] * y + b[2] * zz]];
    const det = rows[0][0] * (rows[1][1] * rows[2][2] - rows[1][2] * rows[2][1]) - rows[0][1] * (rows[1][0] * rows[2][2] - rows[1][2] * rows[2][0]) + rows[0][2] * (rows[1][0] * rows[2][1] - rows[1][1] * rows[2][0]);
    if (det === 0) return system3(r, mode);
    const good = triple(x, y, zz);
    return choiceQ(r, "Resuelve el sistema por sustitución.", good, [triple(y, x, zz), triple(-x, y, zz), triple(x, y, zz + 1), triple(x, -y, -zz)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `De la primera ecuación, z = ${lin(k, m)}; se reemplaza en las otras dos y se resuelve el sistema de dos incógnitas: ${good}.`, `z = ${lin(k, m)}\n${eq3(a[0], a[1], a[2], a[0] * x + a[1] * y + zz)}\n${eq3(b[0], b[1], b[2], b[0] * x + b[1] * y + b[2] * zz)}`, "sustitucion");
  }
  rows = [[1, 1, 1], [1, -1, nz(r, 2)], [nz(r, 2), 1, -1]].map((c) => [...c, c[0] * x + c[1] * y + c[2] * z]);
  const det = rows[0][0] * (rows[1][1] * rows[2][2] - rows[1][2] * rows[2][1]) - rows[0][1] * (rows[1][0] * rows[2][2] - rows[1][2] * rows[2][0]) + rows[0][2] * (rows[1][0] * rows[2][1] - rows[1][1] * rows[2][0]);
  if (det === 0) return system3(r, mode);
  const good = triple(x, y, z);
  return choiceQ(r, "Resuelve el sistema por eliminación.", good, [triple(y, x, z), triple(x, z, y), triple(-x, -y, -z), triple(x + 1, y, z - 1)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Se suman o restan pares de ecuaciones para eliminar la misma variable y queda un sistema de dos incógnitas: ${good}.`, rows.map((e) => eq3(e[0], e[1], e[2], e[3])).join("\n"), "eliminacion");
}

// F.5 / F.6: vértices de la región solución y programación lineal.
export function linearProgramming(r: Rng, optimize: boolean): Question {
  // Región: x ≥ 0, y ≥ 0, x + y ≤ s, x ≤ a (con a < s).
  const s = r.int(6, 12), a = r.int(2, s - 2);
  const vs: P[] = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a, y: s - a }, { x: 0, y: s }];
  const text = `x ≥ 0\ny ≥ 0\nx + y ≤ ${s}\nx ≤ ${a}`;
  if (!optimize) {
    const v = r.pick(vs.slice(1));
    const wrong = [{ x: s, y: 0 }, { x: a, y: s }, { x: s - a, y: a }, { x: 0, y: a }].filter((w) => !vs.some((u) => u.x === w.x && u.y === w.y));
    return choiceQ(r, "¿Cuál de estos puntos es un vértice de la región solución del sistema?", pt(v), wrong.map(pt), `Los vértices son los cortes de las rectas borde: ${vs.map(pt).join(", ")}.`, text, "vertices");
  }
  const p = r.int(2, 9), q = r.int(2, 9);
  const vals = vs.map((v) => p * v.x + q * v.y);
  const max = r.chance(0.6);
  const best = max ? Math.max(...vals) : Math.min(...vals.filter((_, i) => i > 0));
  return numQ(best, `Con las restricciones del recuadro, ¿cuál es el valor ${max ? "máximo" : "mínimo (sin contar el origen)"} de f = ${p}x + ${q}y?`, text, `Se evalúa f en los vértices: ${vs.map((v, i) => `${pt(v)} → ${vals[i]}`).join("; ")}.`, max ? "maximo" : "minimo");
}

// H.5 / H.6: inecuaciones de dos variables con valor absoluto (y sistemas con una recta).
export function absInequality2(r: Rng, system: boolean): Question {
  const h = r.int(-3, 3), k = r.int(-3, 2), a = r.pick([1, -1]);
  const above = a > 0 ? r.chance(0.5) : r.chance(0.5);
  const op = above ? r.pick(["≥", ">"]) : r.pick(["≤", "<"]);
  const f = (x: number) => a * Math.abs(x - h) + k;
  const text = `y ${op} ${a < 0 ? "−" : ""}|${xMinus(h)}|${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}`;
  const region = (ab: boolean): Visual => ({ kind: "coordPlane", min: -6, max: 6, points: [], regions: [{ points: [...curve(f, -7, 7, 0.5), { x: 7, y: ab ? 40 : -40 }, { x: -7, y: ab ? 40 : -40 }] }], curves: [{ points: curve(f, -7, 7, 0.5), dashed: op === ">" || op === "<" }] });
  const ok = (p: P) => (op === "≥" ? p.y >= f(p.x) : op === ">" ? p.y > f(p.x) : op === "≤" ? p.y <= f(p.x) : p.y < f(p.x));
  if (!system) {
    const yes = r.chance(0.5);
    return yesNo(`¿El gráfico muestra las soluciones de ${text}?`, yes, `El borde es la «V» con vértice ${pt({ x: h, y: k })}; ${op === ">" || op === "<" ? "punteado" : "continuo"}, y se sombrea ${above ? "arriba" : "abajo"}.`, region(yes ? above : !above), "valor-absoluto");
  }
  const m = nz(r, 2), b = r.int(-3, 3), lineAbove = r.chance(0.5);
  const lineOk = (p: P) => (lineAbove ? p.y >= m * p.x + b : p.y <= m * p.x + b);
  const all: P[] = [];
  for (let x = -5; x <= 5; x++) for (let y = -5; y <= 5; y++) all.push({ x, y });
  const inside = all.filter((p) => ok(p) && lineOk(p)), outside = all.filter((p) => !(ok(p) && lineOk(p)));
  if (!inside.length || outside.length < 3) return absInequality2(r, system);
  return choiceQ(r, "¿Qué punto es solución del sistema de inecuaciones?", pt(r.pick(inside)), r.shuffle(outside).slice(0, 3).map(pt), "Debe cumplir las dos inecuaciones: reemplaza x e y en cada una.", `${text}\ny ${lineAbove ? "≥" : "≤"} ${lin(m, b)}`, "sistema");
}

// O.9 / O.10: inecuaciones cuadráticas (resolver y graficar).
export function quadInequality(r: Rng, graph: boolean): Question {
  const p = r.int(-6, 3), s = r.int(p + 1, 7);
  const op = r.pick(["<", "≤", ">", "≥"]);
  const inside = op === "<" || op === "≤", closed = op === "≤" || op === "≥";
  const text = `${poly(polyMul([1, -p], [1, -s]))} ${op} 0`;
  const good = inside ? `${sg(p)} ${closed ? "≤" : "<"} x ${closed ? "≤" : "<"} ${sg(s)}` : `x ${closed ? "≤" : "<"} ${sg(p)} o x ${closed ? "≥" : ">"} ${sg(s)}`;
  const flip = inside ? `x ${closed ? "≤" : "<"} ${sg(p)} o x ${closed ? "≥" : ">"} ${sg(s)}` : `${sg(p)} ${closed ? "≤" : "<"} x ${closed ? "≤" : "<"} ${sg(s)}`;
  const why = `Las raíces son ${sg(p)} y ${sg(s)}. La parábola abre hacia arriba: es ${inside ? "negativa entre" : "positiva fuera de"} las raíces.`;
  if (graph) {
    const yes = r.chance(0.5);
    const ins = yes ? inside : !inside;
    return yesNo(`¿La recta numérica muestra las soluciones de ${text}?`, yes, why, line10({ segments: ins ? [{ from: p, to: s, closedFrom: closed, closedTo: closed }] : [{ to: p, closedTo: closed }, { from: s, closedFrom: closed }] }), inside ? "entre" : "fuera");
  }
  return choiceQ(r, "Resuelve la inecuación.", good, [flip, good.replace(/≤/g, "<").replace(/≥/g, ">") === good ? good.replace(/</g, "≤").replace(/>/g, "≥") : good.replace(/≤/g, "<").replace(/≥/g, ">"), `${sg(-s)} ${closed ? "≤" : "<"} x ${closed ? "≤" : "<"} ${sg(-p)}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), why, text, inside ? "entre" : "fuera");
}

// P.3 / P.4: sistemas recta-circunferencia y parábola-parábola.
export function nonlinearSystem(r: Rng, kind: "lineCircle" | "parabolas"): Question {
  if (kind === "lineCircle") {
    const [a, b, rr] = r.pick([[3, 4, 5], [0, 5, 5], [5, 0, 5], [6, 8, 10], [0, 3, 3]]);
    // Recta que pasa por (a, b) y (−a, −b) (por el centro) o por (a, b) y (b, a).
    const P1 = { x: a, y: b }, P2 = { x: b, y: a };
    if (a === b) return nonlinearSystem(r, kind);
    // Recta por P1 y P2: x + y = a + b
    const good = `${pt(P1)} y ${pt(P2)}`;
    return choiceQ(r, "Resuelve el sistema.", good, [`${pt({ x: -a, y: -b })} y ${pt({ x: -b, y: -a })}`, `Solo ${pt(P1)}`, `${pt(P1)} y ${pt({ x: -a, y: b })}`], `Se despeja y = ${a + b} − x y se reemplaza en x² + y² = ${rr * rr}: queda una ecuación cuadrática con soluciones x = ${a} y x = ${b}.`, `x² + y² = ${rr * rr}\nx + y = ${a + b}`, "recta-circunferencia");
  }
  // Parábolas y = x² + c1 e y = −x² + c2 que se cortan en x = ±t.
  const t = r.int(1, 2), c1 = r.int(-4, 0), c2 = c1 + 2 * t * t;
  const Y = t * t + c1;
  const good = `${pt({ x: -t, y: Y })} y ${pt({ x: t, y: Y })}`;
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: curve((x) => x * x + c1) }, { points: curve((x) => -x * x + c2) }] };
  return choiceQ(r, `El gráfico muestra y = ${poly([1, 0, c1])} e y = ${poly([-1, 0, c2])}. ¿Cuáles son las soluciones del sistema?`, good, [`${pt({ x: -Y || 1, y: t })} y ${pt({ x: Y || 1, y: t })}`, `Solo ${pt({ x: 0, y: c1 })}`, `${pt({ x: -t, y: c2 })} y ${pt({ x: t, y: c2 })}`].filter((w) => w !== good), `Se igualan: x² ${c1 < 0 ? "−" : "+"} ${Math.abs(c1)} = −x² ${c2 < 0 ? "−" : "+"} ${Math.abs(c2)} → 2x² = ${2 * t * t} → x = ±${t}.`, visual, "parabolas");
}

// ---------------------------------------------------------------------------
// Operaciones con funciones

// U.3 / U.4: dividir funciones (y operaciones mixtas).
export function divideFunctions(r: Rng): Question {
  const a = nz(r, 5), b = nz(r, 6), k = r.int(2, 5);
  const f = polyMul([1, a], [1, b]).map((c) => c * k), g = [1, a];
  const good = poly([k, k * b]);
  return choiceQ(r, `Si f(x) = ${poly(f)} y g(x) = ${poly(g)}, ¿cuánto es (f/g)(x)? (x ≠ ${sg(-a)})`, good, [poly([k, k * a]), poly([1, b]), poly([k, -k * b]), poly([k, b])].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Se factoriza f: ${k}(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}); se cancela x ${a < 0 ? "−" : "+"} ${Math.abs(a)}.`, undefined, "dividir");
}

// U.5-U.8: composición de funciones (valor o ecuación; lineal o con cuadrática).
export function composition(r: Rng, quadratic: boolean, equation: boolean): Question {
  const f = [nz(r, 4), r.int(-6, 6)], g = quadratic ? [1, 0, r.int(-5, 5)] : [nz(r, 4), r.int(-6, 6)];
  const fFirst = r.chance(0.5);
  const outer = fFirst ? f : g, inner = fFirst ? g : f;
  const [on, inn] = fFirst ? ["f", "g"] : ["g", "f"];
  const ev = (p: number[], x: number) => p.reduce((s, c) => s * x + c, 0);
  const show = `f(x) = ${poly(f)} y g(x) = ${poly(g)}`;
  if (!equation) {
    const x = r.int(-3, 4);
    const v = ev(outer, ev(inner, x));
    return intQ(r, `Si ${show}, ¿cuánto vale (${on} ∘ ${inn})(${sg(x)})?`, v, `Primero ${inn}(${sg(x)}) = ${sg(ev(inner, x))}; luego ${on}(${sg(ev(inner, x))}) = ${sg(v)}.`, undefined, quadratic ? "cuadratica" : "lineal", [ev(inner, ev(outer, x)), ev(outer, x) * ev(inner, x)]);
  }
  // outer(inner(x)) como polinomio.
  let res: number[] = [0];
  for (const c of outer) res = polyAdd(polyMul(res, inner), [c]);
  let other: number[] = [0];
  for (const c of inner) other = polyAdd(polyMul(other, outer), [c]);
  const good = poly(res);
  return choiceQ(r, `Si ${show}, ¿cuál es (${on} ∘ ${inn})(x)?`, good, [poly(other), poly(polyMul(f, g)), poly(polyAdd(f, g))].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Se reemplaza x por ${inn}(x) dentro de ${on}: ${on}(${poly(inner)}) = ${good}.`, undefined, "ecuacion");
}

// ---------------------------------------------------------------------------
// Funciones inversas

// V.1: identificar funciones inversas.
export function identifyInverse(r: Rng): Question {
  const a = r.pick([2, 3, 4, 5]), b = nz(r, 8);
  const yes = r.chance(0.5);
  const g = yes ? `g(x) = (x ${b < 0 ? "+" : "−"} ${Math.abs(b)})/${a}` : r.pick([`g(x) = (x ${b < 0 ? "−" : "+"} ${Math.abs(b)})/${a}`, `g(x) = x/${a} ${b < 0 ? "+" : "−"} ${Math.abs(b)}`, `g(x) = ${a}x ${b < 0 ? "+" : "−"} ${Math.abs(b)}`]);
  return yesNo(`¿Son inversas f(x) = ${lin(a, b)} y ${g}?`, yes, yes ? `f(g(x)) = x y g(f(x)) = x.` : `Al componer no se obtiene x: por ejemplo, f(g(0)) ≠ 0.`, undefined, yes ? "si" : "no");
}

// V.2 / V.3: valores de funciones inversas desde tablas o gráficos.
export function inverseValues(r: Rng, graph: boolean): Question {
  const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 5).sort((a, b) => a - b);
  const ys = r.shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 5);
  const i = r.int(0, 4);
  const visual: Visual = graph ? { kind: "coordPlane", min: -6, max: 6, points: xs.map((x, j) => ({ x, y: ys[j], emoji: "•" })) } : table(["x", "f(x)"], xs.map((x, j) => [sg(x), sg(ys[j])]));
  return intQ(r, `${graph ? "El gráfico muestra" : "La tabla muestra"} la función f, que es invertible. ¿Cuánto vale f⁻¹(${sg(ys[i])})?`, xs[i], `f⁻¹(${sg(ys[i])}) es el x tal que f(x) = ${sg(ys[i])}: x = ${sg(xs[i])}.`, visual, graph ? "grafico" : "tabla", [ys[i], -xs[i]]);
}

// V.4: gráficos de funciones inversas (reflexión respecto de y = x).
export function inverseGraph(r: Rng): Question {
  const p = { x: r.int(-5, 5), y: r.int(-5, 5) };
  if (p.x === p.y) return inverseGraph(r);
  return pointQ(r, `El punto ${pt(p)} está en el gráfico de f. ¿Qué punto está seguro en el gráfico de f⁻¹?`, { x: p.y, y: p.x }, "El gráfico de la inversa es el reflejo respecto de la recta y = x: se intercambian x e y.", undefined, "intercambiar", [{ x: -p.x, y: -p.y }]);
}

// V.5: hallar funciones inversas.
export function findInverse(r: Rng): Question {
  const form = r.int(0, 2);
  const a = r.pick([2, 3, 4, 5]), b = nz(r, 8);
  if (form === 0) return choiceQ(r, `¿Cuál es la inversa de f(x) = ${lin(a, b)}?`, `f⁻¹(x) = (${xMinus(b)})/${a}`, [`f⁻¹(x) = (${xMinus(-b)})/${a}`, `f⁻¹(x) = ${lin(a, -b)}`, `f⁻¹(x) = x/${a} ${b < 0 ? "+" : "−"} ${Math.abs(b)}`], `Se intercambian x e y y se despeja: x = ${a}y ${b < 0 ? "−" : "+"} ${Math.abs(b)} → y = (${xMinus(b)})/${a}.`, undefined, "lineal");
  if (form === 1) return choiceQ(r, `¿Cuál es la inversa de f(x) = x³ ${b < 0 ? "−" : "+"} ${Math.abs(b)}?`, `f⁻¹(x) = ∛(${xMinus(b)})`, [`f⁻¹(x) = ∛x ${b < 0 ? "+" : "−"} ${Math.abs(b)}`, `f⁻¹(x) = ∛(${xMinus(-b)})`, `f⁻¹(x) = (${xMinus(b)})³`], `x = y³ ${b < 0 ? "−" : "+"} ${Math.abs(b)} → y³ = ${xMinus(b)} → y = ∛(${xMinus(b)}).`, undefined, "cubica");
  return choiceQ(r, `¿Cuál es la inversa de f(x) = ${a}/x?`, `f⁻¹(x) = ${a}/x`, [`f⁻¹(x) = x/${a}`, `f⁻¹(x) = ${a}x`, `f⁻¹(x) = 1/(${a}x)`], `x = ${a}/y → y = ${a}/x: la función es su propia inversa.`, undefined, "reciproca");
}

// ---------------------------------------------------------------------------
// Funciones racionales

// X.1-X.3: asíntotas, valores excluidos y dominio de funciones racionales.
export function rationalFunction(r: Rng, mode: "asymptotes" | "reciprocal" | "domain"): Question {
  const h = nz(r, 5), k = r.int(-4, 4), a = r.pick([1, 2, 3, -1, -2]);
  const f = `f(x) = ${sg(a)}/(${xMinus(h)})${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}`;
  if (mode === "asymptotes") {
    const vert = r.chance(0.5);
    return choiceQ(r, `¿Cuál es la asíntota ${vert ? "vertical" : "horizontal"} de ${f}?`, vert ? `x = ${sg(h)}` : `y = ${sg(k)}`, vert ? [`x = ${sg(-h)}`, `y = ${sg(k)}`, `x = ${sg(a)}`] : [`y = ${sg(-k)}`, `x = ${sg(h)}`, `y = ${sg(a)}`].filter((w) => w !== `y = ${sg(k)}`), vert ? `El denominador es 0 cuando x = ${sg(h)}: ahí hay una asíntota vertical.` : `Cuando x se hace muy grande, la fracción se acerca a 0 y f(x) a ${sg(k)}.`, undefined, vert ? "vertical" : "horizontal");
  }
  if (mode === "reciprocal") {
    const dom = r.chance(0.5);
    const good = dom ? `Todos los reales excepto x = ${sg(h)}` : `Todos los reales excepto y = ${sg(k)}`;
    return choiceQ(r, `¿Cuál es el ${dom ? "dominio" : "rango"} de ${f}?`, good, [`Todos los reales excepto ${dom ? "x" : "y"} = ${sg(-(dom ? h : k)) || 1}`, "Todos los números reales", `Todos los reales excepto ${dom ? "y" : "x"} = ${sg(dom ? k : h)}`].filter((w) => w !== good), dom ? "No se puede dividir entre 0." : `La función nunca toma el valor de la asíntota horizontal y = ${sg(k)}.`, undefined, dom ? "dominio" : "rango");
  }
  const p = nz(r, 6), q = r.int(-6, 6);
  if (p === q) return rationalFunction(r, mode);
  const den = polyMul([1, -p], [1, -q]);
  const good = `Todos los reales excepto x = ${sg(Math.min(p, q))} y x = ${sg(Math.max(p, q))}`;
  return choiceQ(r, `¿Cuál es el dominio de f(x) = (x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) / (${poly(den)})?`, good, [`Todos los reales excepto x = ${sg(-Math.max(p, q))} y x = ${sg(-Math.min(p, q))}`, `Todos los reales excepto x = ${sg(-a)}`, "Todos los números reales"], `El denominador ${poly(den)} = ${`(${xMinus(p)})(${xMinus(q)})`} se anula en x = ${sg(p)} y x = ${sg(q)}.`, undefined, "dominio");
}

// X.4: evaluar expresiones racionales con varias variables.
export function evaluateRational2(r: Rng): Question {
  const x = nz(r, 5), y = nz(r, 5);
  const num = x * x - y, den = x + y;
  if (den === 0 || num % den) return evaluateRational2(r);
  return intQ(r, `Calcula el valor de (x² − y) / (x + y) cuando x = ${sg(x)} e y = ${sg(y)}.`, num / den, `(${x * x} − ${y < 0 ? `(${sg(y)})` : y}) ÷ (${sg(x)} + ${y < 0 ? `(${sg(y)})` : y}) = ${sg(num)} ÷ ${sg(den)} = ${sg(num / den)}.`, undefined, "dos-variables", [-num / den, num]);
}

// X.10: simplificar fracciones complejas (algebraicas).
export function complexFractionAlg(r: Rng): Question {
  const a = r.int(1, 6), b = r.int(1, 6);
  // (1/x + a) / (1/x − b) = (1 + ax) / (1 − bx)
  const good = `(${poly([a, 1])}) / (${poly([-b, 1])})`;
  return choiceQ(r, "Simplifica la fracción compleja. (Supón que ningún denominador es 0.)", good, [`(${poly([1, a])}) / (${poly([1, -b])})`, `(${poly([a, 1])}) / (${poly([b, 1])})`, `${a}/${-b}`.replace("/-", "/−")], `Se multiplican numerador y denominador por x: (${poly([a, 1])}) / (${poly([-b, 1])}).`, `(1/x + ${a}) / (1/x − ${b})`, "compleja");
}

// ---------------------------------------------------------------------------
// Variación

const VAR_KINDS = ["Directa", "Inversa", "Conjunta", "Combinada"];
// Y.3-Y.7: clasificar, escribir y resolver variaciones conjunta y combinada.
export function variation(r: Rng, mode: "classify" | "write" | "constant" | "solve"): Question {
  const k = r.int(2, 9);
  const forms: [string, number][] = [[`y = ${k}x`, 0], [`y = ${k}/x`, 1], [`y = ${k}xz`, 2], [`y = ${k}x/z`, 3], [`y = ${k}xz/w`, 3], [`xy = ${k}`, 1]];
  if (mode === "classify") {
    const [eq, i] = r.pick(forms);
    return fixedQ(`¿Qué tipo de variación representa ${eq}?`, VAR_KINDS, VAR_KINDS[i], ["y = kx.", "y = k/x.", "y varía directamente con el producto de dos variables: y = kxz.", "Mezcla directa e inversa: y = kx/z."][i], undefined, VAR_KINDS[i].toLowerCase());
  }
  const x = r.int(2, 6), z = r.int(2, 6);
  const joint = r.chance(0.5);
  const y = joint ? k * x * z : (k * x) / z;
  if (!Number.isInteger(y)) return variation(r, mode);
  const desc = joint ? "y varía conjuntamente con x y z" : "y varía directamente con x e inversamente con z";
  if (mode === "write") return choiceQ(r, `Si ${desc}, e y = ${y} cuando x = ${x} y z = ${z}, ¿qué ecuación relaciona las variables?`, joint ? `y = ${k}xz` : `y = ${k}x/z`, joint ? [`y = ${k}x/z`, `y = ${k * x}z`, `y = ${y === 1 ? "" : y}xz`] : [`y = ${k}xz`, `y = ${k}z/x`, `y = ${y === 1 ? "" : y}x/z`], joint ? `k = y ÷ (xz) = ${y} ÷ ${x * z} = ${k}.` : `k = yz ÷ x = ${y * z} ÷ ${x} = ${k}.`, undefined, joint ? "conjunta" : "combinada");
  if (mode === "constant") return numQ(k, `Si ${desc}, e y = ${y} cuando x = ${x} y z = ${z}, ¿cuál es la constante de variación?`, undefined, joint ? `k = y ÷ (xz) = ${y} ÷ ${x * z} = ${k}.` : `k = yz ÷ x = ${y * z} ÷ ${x} = ${k}.`, joint ? "conjunta" : "combinada");
  const x2 = r.int(2, 8), z2 = r.int(2, 8);
  const y2 = joint ? k * x2 * z2 : (k * x2) / z2;
  if (!Number.isInteger(y2)) return variation(r, mode);
  return numQ(y2, `Si ${desc}, e y = ${y} cuando x = ${x} y z = ${z}, ¿cuánto vale y cuando x = ${x2} y z = ${z2}?`, undefined, `k = ${k}; y = ${k} × ${x2} ${joint ? "×" : "÷"} ${z2} = ${fmt(y2)}.`, joint ? "conjunta" : "combinada");
}


