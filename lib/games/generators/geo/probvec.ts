import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, numQ, sg, table, yesNo } from "../kit";
import { pt } from "../sec2/util";
import { dec, frac, valQ } from "../alg1/util";

// Geometría: probabilidad (combinatoria, tablas de doble entrada,
// condicional, independencia, geométrica, regla de la suma) y vectores.

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));

// AA.8: probabilidades con combinaciones y permutaciones.
export function comboProbability(r: Rng): Question {
  const g = r.int(3, 7), b = r.int(3, 7), k = 2;
  const total = C(g + b, k), fav = C(g, k);
  return choiceQ(r, `En una bolsa hay ${g} canicas verdes y ${b} azules. Se sacan ${k} al azar (sin devolver). ¿Cuál es la probabilidad de que las dos sean verdes?`, frac(fav, total), [frac(g, g + b), frac(g * g, (g + b) ** 2), frac(C(b, k), total), frac(fav, total * 2)].filter((w, i, all) => w !== frac(fav, total) && all.indexOf(w) === i), `Casos favorables: C(${g}, 2) = ${fav}. Casos posibles: C(${g + b}, 2) = ${total}. P = ${frac(fav, total)}.`, undefined, "combinaciones");
}

function twoWay(r: Rng) {
  const [rows, cols, title] = r.pick([
    [["Hace deporte", "No hace deporte"], ["1.° de secundaria", "2.° de secundaria"], "Alumnos encuestados"],
    [["Prefiere té", "Prefiere café"], ["Mañana", "Tarde"], "Clientes de una cafetería"],
    [["Usa lentes", "No usa lentes"], ["Mujer", "Hombre"], "Docentes de un colegio"],
  ] as [string[], string[], string][]);
  const cells = [[r.int(5, 40), r.int(5, 40)], [r.int(5, 40), r.int(5, 40)]];
  const rowT = cells.map((c) => c[0] + c[1]), colT = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]];
  const total = rowT[0] + rowT[1];
  const visual: Visual = table(["", cols[0], cols[1], "Total"], [[rows[0], String(cells[0][0]), String(cells[0][1]), String(rowT[0])], [rows[1], String(cells[1][0]), String(cells[1][1]), String(rowT[1])], ["Total", String(colT[0]), String(colT[1]), String(total)]], title);
  return { rows, cols, cells, rowT, colT, total, visual };
}

// AA.9 / AA.12: probabilidades (también condicionales) con tablas de doble entrada.
export function twoWayProbability(r: Rng, conditional: boolean): Question {
  const t = twoWay(r);
  const i = r.int(0, 1), j = r.int(0, 1);
  const lc = (s: string) => s[0].toLowerCase() + s.slice(1);
  if (conditional) {
    const good = frac(t.cells[i][j], t.colT[j]);
    return choiceQ(r, `Se elige una persona al azar. Si es de «${t.cols[j]}», ¿cuál es la probabilidad de que ${lc(t.rows[i])}?`, good, [frac(t.cells[i][j], t.total), frac(t.cells[i][j], t.rowT[i]), frac(t.colT[j], t.total)].filter((w, k, all) => w !== good && all.indexOf(w) === k), `Solo se mira la columna «${t.cols[j]}»: ${t.cells[i][j]} de ${t.colT[j]} = ${good}.`, t.visual, "condicional");
  }
  const good = frac(t.cells[i][j], t.total);
  return choiceQ(r, `Se elige una persona al azar. ¿Cuál es la probabilidad de que ${lc(t.rows[i])} y sea de «${t.cols[j]}»?`, good, [frac(t.cells[i][j], t.colT[j]), frac(t.cells[i][j], t.rowT[i]), frac(t.rowT[i], t.total)].filter((w, k, all) => w !== good && all.indexOf(w) === k), `${t.cells[i][j]} de ${t.total} = ${good}.`, t.visual, "conjunta");
}

// AA.10 / AA.13: identificar sucesos independientes (P(A ∩ B) = P(A) · P(B)) e independencia y probabilidad condicional.
export function independence(r: Rng, conditional: boolean): Question {
  const pa = r.pick([0.2, 0.3, 0.4, 0.5, 0.6]), pb = r.pick([0.2, 0.25, 0.5, 0.4]);
  const indep = r.chance(0.5);
  const pab = indep ? Math.round(pa * pb * 1000) / 1000 : Math.round((pa * pb + r.pick([0.05, -0.04, 0.08])) * 1000) / 1000;
  if (pab <= 0) return independence(r, conditional);
  if (conditional) {
    const pagb = Math.round((pab / pb) * 1000) / 1000;
    return yesNo(`P(A) = ${dec(pa)}, P(B) = ${dec(pb)} y P(A | B) = ${dec(pagb)}. ¿A y B son independientes?`, indep, indep ? `P(A | B) = P(A): saber que ocurrió B no cambia la probabilidad de A.` : `P(A | B) = ${dec(pagb)} ≠ P(A) = ${dec(pa)}: no son independientes.`, undefined, indep ? "si" : "no");
  }
  return yesNo(`P(A) = ${dec(pa)}, P(B) = ${dec(pb)} y P(A y B) = ${dec(pab)}. ¿A y B son independientes?`, indep, `P(A) · P(B) = ${dec(Math.round(pa * pb * 1000) / 1000)}${indep ? ", igual a P(A y B): son independientes." : `, distinto de P(A y B) = ${dec(pab)}: no son independientes.`}`, undefined, indep ? "si" : "no");
}

// AA.11: probabilidad condicional (fórmula).
export function conditionalProbability(r: Rng): Question {
  const pb = r.pick([0.4, 0.5, 0.6, 0.8]), pab = r.pick([0.1, 0.2, 0.3].filter((x) => x < pb));
  const v = Math.round((pab / pb) * 1000) / 1000;
  return valQ(r, `P(B) = ${dec(pb)} y P(A y B) = ${dec(pab)}. ¿Cuánto vale P(A | B)?`, v, [Math.round(pab * pb * 1000) / 1000, Math.round((pb / pab) * 100) / 100, Math.round((pb - pab) * 100) / 100].filter((x) => x <= 10), `P(A | B) = P(A y B) ÷ P(B) = ${dec(pab)} ÷ ${dec(pb)} = ${dec(v)}.`, undefined, "formula");
}

// AA.14: probabilidad geométrica.
export function geometricProbability(r: Rng): Question {
  if (r.chance(0.5)) {
    const L = r.int(10, 30), a = r.int(1, L - 4), b = r.int(a + 2, L);
    return choiceQ(r, `Se elige un punto al azar en un segmento de 0 a ${L}. ¿Cuál es la probabilidad de que esté entre ${a} y ${b}?`, frac(b - a, L), [frac(a, L), frac(b, L), frac(b - a, b)].filter((w, i, all) => w !== frac(b - a, L) && all.indexOf(w) === i), `Longitud favorable ÷ longitud total = ${b - a}/${L} = ${frac(b - a, L)}.`, undefined, "segmento");
  }
  const s = r.int(4, 10) * 2, rr = r.int(1, s / 2 - 1);
  const piFrac = (n: number, d: number) => {
    const f = frac(n, d);
    return f.includes("/") ? `${f.split("/")[0] === "1" ? "" : f.split("/")[0]}π/${f.split("/")[1]}` : `${f}π`;
  };
  const good = piFrac(rr * rr, s * s);
  return choiceQ(r, `Se lanza un dardo al azar sobre un tablero cuadrado de ${s} cm de lado que tiene dibujado un círculo de ${rr} cm de radio. ¿Cuál es la probabilidad de caer dentro del círculo? (Deja π en la respuesta.)`, good, [piFrac(rr, s), piFrac(2 * rr, s * s), piFrac(rr * rr, s)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Área del círculo ÷ área del cuadrado = π × ${rr * rr} ÷ ${s * s} = ${good}.`, undefined, "area");
}

// AA.15: regla de la suma.
export function additionRule(r: Rng): Question {
  if (r.chance(0.5)) {
    const n = 52, hearts = 13, figures = 12, both = 3;
    const kind = r.int(0, 1);
    return choiceQ(r, kind ? "Se saca una carta de una baraja de 52 (13 de cada palo; J, Q y K son figuras). ¿Cuál es la probabilidad de sacar un corazón o una figura?" : "Se saca una carta de una baraja de 52. ¿Cuál es la probabilidad de sacar un as o un rey?", kind ? frac(hearts + figures - both, n) : frac(8, n), kind ? [frac(hearts + figures, n), frac(hearts, n), frac(both, n)] : [frac(4, n), frac(16, n), frac(1, n)], kind ? "P(A o B) = P(A) + P(B) − P(A y B) = 13/52 + 12/52 − 3/52 = 22/52 = 11/26." : "Son excluyentes: 4/52 + 4/52 = 8/52 = 2/13.", undefined, kind ? "solapados" : "excluyentes");
  }
  const pa = r.pick([0.3, 0.4, 0.5]), pb = r.pick([0.2, 0.3, 0.4]), pab = r.pick([0.1, 0.15]);
  const v = Math.round((pa + pb - pab) * 100) / 100;
  return valQ(r, `P(A) = ${dec(pa)}, P(B) = ${dec(pb)} y P(A y B) = ${dec(pab)}. ¿Cuánto vale P(A o B)?`, v, [Math.round((pa + pb) * 100) / 100, Math.round(pa * pb * 100) / 100, Math.round((pa + pb + pab) * 100) / 100], `P(A o B) = P(A) + P(B) − P(A y B) = ${dec(v)}.`, undefined, "formula");
}

// ---------------------------------------------------------------------------
// Vectores

const vecVisual = (vs: { x: number; y: number; from?: { x: number; y: number }; label?: string }[]): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: [], lines: vs.map((v) => ({ from: v.from ?? { x: 0, y: 0 }, to: { x: (v.from?.x ?? 0) + v.x, y: (v.from?.y ?? 0) + v.y }, label: v.label, arrow: true })) });
const comp = (x: number, y: number) => `⟨${sg(x)}, ${sg(y)}⟩`;

// BB.1: direcciones de la brújula y vectores.
export function compassVector(r: Rng): Question {
  const d = r.int(2, 9);
  const dirs: [string, number, number][] = [["norte", 0, 1], ["sur", 0, -1], ["este", 1, 0], ["oeste", -1, 0]];
  const [name, x, y] = r.pick(dirs);
  return choiceQ(r, `Un avión vuela ${d} km hacia el ${name}. Con el este como x positivo y el norte como y positivo, ¿qué vector representa el viaje?`, comp(d * x, d * y), dirs.filter((q) => q[0] !== name).map(([, a, b]) => comp(d * a, d * b)), `El ${name} es ${comp(x, y)}; ${d} km en esa dirección es ${comp(d * x, d * y)}.`, undefined, name);
}

// BB.2: módulo de un vector.
export function vectorMagnitude(r: Rng): Question {
  const [a, b, m] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [0, 7, 7], [9, 12, 15]]);
  const x = a * r.pick([1, -1]), y = b * r.pick([1, -1]);
  return numQ(m, `¿Cuál es el módulo (la longitud) del vector ${comp(x, y)}?`, undefined, `|v| = √((${sg(x)})² + (${sg(y)})²) = √${m * m} = ${m}.`, "modulo");
}

// BB.3: forma de componentes de un vector (dados dos puntos).
export function vectorComponents(r: Rng): Question {
  const A = { x: r.int(-6, 4), y: r.int(-6, 4) }, B = { x: r.int(-6, 6), y: r.int(-6, 6) };
  if (A.x === B.x && A.y === B.y) return vectorComponents(r);
  const v = { x: B.x - A.x, y: B.y - A.y };
  return choiceQ(r, `Un vector va de A${pt(A)} a B${pt(B)}. ¿Cuál es su forma de componentes?`, comp(v.x, v.y), [comp(-v.x, -v.y), comp(B.x + A.x, B.y + A.y), comp(v.y, v.x)].filter((w, i, all) => w !== comp(v.x, v.y) && all.indexOf(w) === i), `Se resta el punto inicial al final: ⟨${sg(B.x)} − ${A.x < 0 ? `(${sg(A.x)})` : A.x}, ${sg(B.y)} − ${A.y < 0 ? `(${sg(A.y)})` : A.y}⟩ = ${comp(v.x, v.y)}.`, vecVisual([{ ...v, from: A }]), "componentes");
}

// BB.4: componentes a partir del módulo y el ángulo de dirección.
export function vectorFromAngle(r: Rng): Question {
  const m = r.int(2, 20), th = r.int(10, 350);
  const x = Math.round(m * Math.cos((th * Math.PI) / 180) * 10) / 10, y = Math.round(m * Math.sin((th * Math.PI) / 180) * 10) / 10;
  const good = `⟨${dec(x)}, ${dec(y)}⟩`;
  return choiceQ(r, `Un vector tiene módulo ${m} y ángulo de dirección ${th}° (medido desde el eje x positivo). ¿Cuál es su forma de componentes? Redondea a la décima.`, good, [`⟨${dec(y)}, ${dec(x)}⟩`, `⟨${dec(-x)}, ${dec(y)}⟩`, `⟨${dec(x)}, ${dec(-y)}⟩`].filter((w) => w !== good), `x = ${m} cos ${th}° ≈ ${dec(x)}; y = ${m} sen ${th}° ≈ ${dec(y)}.`, undefined, "angulo");
}

// BB.5-BB.8: sumar y restar vectores (también gráficamente: triángulo o paralelogramo).
export function vectorAdd(r: Rng, mode: "triangle" | "parallelogram" | "add" | "subtract"): Question {
  const u = { x: r.int(-4, 4) || 2, y: r.int(-4, 4) }, v = { x: r.int(-4, 4), y: r.int(-4, 4) || -3 };
  const sub = mode === "subtract";
  const res = sub ? { x: u.x - v.x, y: u.y - v.y } : { x: u.x + v.x, y: u.y + v.y };
  const good = comp(res.x, res.y);
  const wrong = [sub ? comp(u.x + v.x, u.y + v.y) : comp(u.x - v.x, u.y - v.y), comp(v.x - u.x, v.y - u.y), comp(res.y, res.x), comp(u.x * v.x, u.y * v.y)].filter((w, i, all) => w !== good && all.indexOf(w) === i);
  if (mode === "triangle" || mode === "parallelogram") {
    const visual = mode === "triangle" ? vecVisual([{ ...u, label: "u" }, { ...v, from: u, label: "v" }]) : vecVisual([{ ...u, label: "u" }, { ...v, label: "v" }]);
    const yes = r.chance(0.5);
    const shown = yes ? res : { x: res.x + r.pick([-1, 1]), y: res.y };
    const vis = visual.kind === "coordPlane" ? { ...visual, lines: [...(visual.lines ?? []), { from: { x: 0, y: 0 }, to: shown, dashed: true, label: "u + v", arrow: true }] } : visual;
    return yesNo(`La flecha punteada debería ser la resultante u + v (método del ${mode === "triangle" ? "triángulo" : "paralelogramo"}). ¿Lo es?`, yes, `u + v = ${comp(u.x, u.y)} + ${comp(v.x, v.y)} = ${good}.`, vis, mode);
  }
  return choiceQ(r, `Si u = ${comp(u.x, u.y)} y v = ${comp(v.x, v.y)}, ¿cuánto es u ${sub ? "−" : "+"} v?`, good, wrong, `Se ${sub ? "restan" : "suman"} componente a componente: ${good}.`, undefined, sub ? "restar" : "sumar");
}

