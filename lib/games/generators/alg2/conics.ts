import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, numQ, sg } from "../kit";
import { pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { poly } from "../alg1/util";

// Álgebra 2: hacia dónde se abre una parábola, elipses e hipérbolas.

// DD.1: ¿hacia dónde se abre la parábola?
const DIRS = ["Hacia arriba", "Hacia abajo", "Hacia la derecha", "Hacia la izquierda"];
export function parabolaDirection(r: Rng): Question {
  const a = r.pick([1, 2, 3, 0.5]) * r.pick([1, -1]), h = r.int(-4, 4), k = r.int(-4, 4);
  const vertical = r.chance(0.5);
  const A = a === 0.5 ? "(1/2)" : a === -0.5 ? "−(1/2)" : a === 1 ? "" : a === -1 ? "−" : sg(a);
  const sq = (v: string, c: number) => (c ? `(${v} ${c < 0 ? "+" : "−"} ${Math.abs(c)})²` : `${v}²`);
  const eq = vertical ? `y = ${A}${sq("x", h)}${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}` : `x = ${A}${sq("y", k)}${h ? ` ${h < 0 ? "−" : "+"} ${Math.abs(h)}` : ""}`;
  const i = vertical ? (a > 0 ? 0 : 1) : a > 0 ? 2 : 3;
  return fixedQ(`¿Hacia dónde se abre la parábola ${eq}?`, DIRS, DIRS[i], vertical ? `y está despejada (eje vertical) y a = ${A || "1"} es ${a > 0 ? "positivo" : "negativo"}.` : `x está despejada (eje horizontal) y a es ${a > 0 ? "positivo" : "negativo"}.`, undefined, DIRS[i]);
}

// ---------------------------------------------------------------------------
// Elipses e hipérbolas

type Conic = { h: number; k: number; a: number; b: number; horiz: boolean; hyper: boolean };
const TRIPLES = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6]]; // elipse: a, b, c con c² = a² − b²
const HTRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]; // hipérbola: a, b, c con c² = a² + b²
const randomConic = (r: Rng, hyper: boolean): Conic => {
  const [a, b] = r.pick(hyper ? HTRIPLES : TRIPLES);
  return { h: r.int(-3, 3), k: r.int(-3, 3), a, b, horiz: r.chance(0.5), hyper };
};
const cOf = (q: Conic) => Math.sqrt(q.hyper ? q.a * q.a + q.b * q.b : q.a * q.a - q.b * q.b);
const sqT = (v: string, c: number) => (c ? `(${v} ${c < 0 ? "+" : "−"} ${Math.abs(c)})²` : `${v}²`);
const stdEq = (q: Conic) => {
  const X = sqT("x", q.h), Y = sqT("y", q.k);
  const [A2, B2] = [q.a * q.a, q.b * q.b];
  if (q.hyper) return q.horiz ? `${X}/${A2} − ${Y}/${B2} = 1` : `${Y}/${A2} − ${X}/${B2} = 1`;
  return q.horiz ? `${X}/${A2} + ${Y}/${B2} = 1` : `${X}/${B2} + ${Y}/${A2} = 1`;
};
// Forma general: Ax² + Cy² + Dx + Ey + F = 0 (coeficientes enteros).
const generalEq = (q: Conic) => {
  const [A2, B2] = [q.a * q.a, q.b * q.b];
  // Coeficiente de (x − h)² y de (y − k)² tras multiplicar por A2·B2.
  let cx: number, cy: number;
  if (q.hyper) [cx, cy] = q.horiz ? [B2, -A2] : [-A2, B2];
  else [cx, cy] = q.horiz ? [B2, A2] : [A2, B2];
  const F = cx * q.h * q.h + cy * q.k * q.k - A2 * B2;
  const terms = `${poly([cx, 0, 0])} ${cy < 0 ? "−" : "+"} ${Math.abs(cy) === 1 ? "" : Math.abs(cy)}y²${q.h ? ` ${-2 * cx * q.h < 0 ? "−" : "+"} ${Math.abs(2 * cx * q.h)}x` : ""}${q.k ? ` ${-2 * cy * q.k < 0 ? "−" : "+"} ${Math.abs(2 * cy * q.k)}y` : ""}${F ? ` ${F < 0 ? "−" : "+"} ${Math.abs(F)}` : ""} = 0`;
  return terms;
};
const along = (q: Conic, d: number) => (q.horiz ? { x: q.h + d, y: q.k } : { x: q.h, y: q.k + d });
const across = (q: Conic, d: number) => (q.horiz ? { x: q.h, y: q.k + d } : { x: q.h + d, y: q.k });
function conicVisual(q: Conic): Visual {
  const size = Math.max(q.a, q.b) + 4 > 8 ? 14 : 8;
  const pts = (sign: number) =>
    q.hyper
      ? Array.from({ length: 81 }, (_, i) => { const t = -2.5 + i * 0.0625; const u = sign * q.a * Math.cosh(t), v = q.b * Math.sinh(t); return q.horiz ? { x: q.h + u, y: q.k + v } : { x: q.h + v, y: q.k + u }; })
      : Array.from({ length: 73 }, (_, i) => { const t = (i * Math.PI) / 36; const u = q.a * Math.cos(t), v = q.b * Math.sin(t); return q.horiz ? { x: q.h + u, y: q.k + v } : { x: q.h + v, y: q.k + u }; });
  return { kind: "coordPlane", min: -size, max: size, points: [{ x: q.h, y: q.k, emoji: "•" }], curves: q.hyper ? [{ points: pts(1), color: "green" }, { points: pts(-1), color: "green" }] : [{ points: pts(1) }] };
}
const name = (q: Conic) => (q.hyper ? "la hipérbola" : "la elipse");

// FF.1-FF.3, GG.1-GG.5: elementos de elipses e hipérbolas.
export function conicProps(r: Rng, hyper: boolean, mode: "center" | "vertices" | "covertices" | "axes" | "foci" | "asymptotes", general = false): Question {
  const q = randomConic(r, hyper);
  const eq = general ? generalEq(q) : stdEq(q);
  const c = cOf(q);
  const why0 = general ? `Completando cuadrados: ${stdEq(q)}. ` : "";
  if (mode === "center") return pointQ(r, `¿Cuál es el centro de ${name(q)} ${eq}?`, { x: q.h, y: q.k }, `${why0}El centro es (h, k) = ${pt({ x: q.h, y: q.k })}.`, undefined, "centro", [{ x: -q.h, y: -q.k }]);
  if (mode === "vertices" || mode === "covertices") {
    const co = mode === "covertices";
    const P = co ? across(q, q.b) : along(q, q.a), Q = co ? across(q, -q.b) : along(q, -q.a);
    const good = `${pt(Q)} y ${pt(P)}`;
    const alt = co ? `${pt(along(q, -q.b))} y ${pt(along(q, q.b))}` : `${pt(across(q, -q.a))} y ${pt(across(q, q.a))}`;
    return choiceQ(r, `¿Cuáles son los ${co ? "covértices" : "vértices"} de ${name(q)} ${eq}?`, good, [alt, `${pt(co ? across(q, -q.a) : along(q, -q.b))} y ${pt(co ? across(q, q.a) : along(q, q.b))}`, `${pt({ x: -Q.x, y: -Q.y })} y ${pt({ x: -P.x, y: -P.y })}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), `${why0}${co ? `A ${q.b} unidades del centro, en la dirección del eje menor` : `A ${q.a} unidades del centro, sobre el eje ${hyper ? "transverso" : "mayor"}`} (${q.horiz === !co ? "horizontal" : "vertical"}).`, undefined, co ? "covertices" : "vertices");
  }
  if (mode === "axes") {
    const major = r.chance(0.5);
    const label = hyper ? (major ? "eje transverso" : "eje conjugado") : major ? "eje mayor" : "eje menor";
    return numQ(major ? 2 * q.a : 2 * q.b, `¿Cuánto mide el ${label} de ${name(q)} ${eq}?`, undefined, `${why0}Mide el doble de ${major ? "a" : "b"}: 2 × ${major ? q.a : q.b} = ${major ? 2 * q.a : 2 * q.b}.`, label);
  }
  if (mode === "foci") {
    const good = `${pt(along(q, -c))} y ${pt(along(q, c))}`;
    return choiceQ(r, `¿Cuáles son los focos de ${name(q)} ${eq}?`, good, [`${pt(across(q, -c))} y ${pt(across(q, c))}`, `${pt(along(q, -q.a))} y ${pt(along(q, q.a))}`, `${pt(along(q, -(hyper ? Math.sqrt(q.a ** 2 + q.b ** 2) + 1 : q.b)))} y ${pt(along(q, hyper ? Math.sqrt(q.a ** 2 + q.b ** 2) + 1 : q.b))}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), `${why0}c² = a² ${hyper ? "+" : "−"} b² = ${q.a * q.a} ${hyper ? "+" : "−"} ${q.b * q.b} = ${c * c}, c = ${c}; los focos están a ${c} del centro sobre el eje ${hyper ? "transverso" : "mayor"}.`, undefined, "focos");
  }
  // Asíntotas de la hipérbola.
  const m = q.horiz ? `${q.b}/${q.a}` : `${q.a}/${q.b}`;
  const mBad = q.horiz ? `${q.a}/${q.b}` : `${q.b}/${q.a}`;
  const lhs = q.k ? `y ${q.k < 0 ? "+" : "−"} ${Math.abs(q.k)}` : "y";
  const rhs = (s: string) => `±(${s})${q.h ? `(x ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)})` : "x"}`;
  return choiceQ(r, `¿Cuáles son las asíntotas de la hipérbola ${eq}?`, `${lhs} = ${rhs(m)}`, [`${lhs} = ${rhs(mBad)}`, `${q.k ? `y ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : "y + 1"} = ${rhs(m)}`, `y = ${rhs(m)}`].filter((w, i, all) => w !== `${lhs} = ${rhs(m)}` && all.indexOf(w) === i), `Pasan por el centro con pendientes ±${m} (${q.horiz ? "b/a" : "a/b"}).`, undefined, "asintotas");
}

// FF.4-FF.6, GG.6-GG.8: escribir ecuaciones de elipses e hipérbolas.
export function conicEquation(r: Rng, hyper: boolean, mode: "graph" | "properties" | "convert"): Question {
  const q = randomConic(r, hyper);
  const good = stdEq(q);
  const wrong = [stdEq({ ...q, horiz: !q.horiz }), stdEq({ ...q, h: -q.h, k: -q.k }), stdEq({ ...q, a: q.b, b: q.a, horiz: !q.horiz }) === good ? stdEq({ ...q, a: q.a + 1 }) : stdEq({ ...q, a: q.b, b: q.a }), hyper ? stdEq({ ...q, hyper: false }) : stdEq({ ...q, a: q.a + 1 })].filter((w, i, all) => w !== good && all.indexOf(w) === i);
  if (mode === "graph") return choiceQ(r, `¿Cuál es la ecuación de ${name(q)} del gráfico?`, good, wrong, `Centro ${pt({ x: q.h, y: q.k })}; a = ${q.a} sobre el eje ${q.horiz ? "horizontal" : "vertical"} y b = ${q.b}.`, conicVisual(q), "grafico");
  if (mode === "convert") return choiceQ(r, `Escribe ${name(q)} ${generalEq(q)} en forma estándar.`, good, wrong, "Se agrupan los términos en x y en y, se completan cuadrados y se divide para que el lado derecho sea 1.", undefined, "convertir");
  const c = cOf(q);
  return choiceQ(r, `${name(q)[0].toUpperCase()}${name(q).slice(1)} tiene centro ${pt({ x: q.h, y: q.k })}, un vértice en ${pt(along(q, q.a))} y un foco en ${pt(along(q, c))}. ¿Cuál es su ecuación?`, good, wrong, `a = ${q.a} (centro a vértice), c = ${c} (centro a foco) y b² = ${hyper ? "c² − a²" : "a² − c²"} = ${q.b * q.b}.`, undefined, "propiedades");
}
