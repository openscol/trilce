import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, choiceQ, d3, decQ, fadd, fixedQ, fmt, fmul, fracQ, fshow, mixed, numQ, trueFalse, yesNo } from "./kit";

// Geometría de 5.° en adelante: polígonos, perímetro y área con decimales y
// fracciones, figuras en cuadrícula y volumen con cubos unitarios.

type Pt = [number, number];
const regular = (n: number, cx = 50, cy = 50, rad = 44): Pt[] => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return [Math.round((cx + rad * Math.cos(a)) * 10) / 10, Math.round((cy + rad * Math.sin(a)) * 10) / 10];
});
const POLY_NAMES: Record<number, string> = { 3: "triángulo", 4: "cuadrilátero", 5: "pentágono", 6: "hexágono", 7: "heptágono", 8: "octágono", 9: "eneágono", 10: "decágono" };
const IRREGULAR: Record<number, Pt[]> = {
  3: [[10, 20], [95, 85], [5, 85]],
  4: [[15, 15], [70, 25], [95, 85], [5, 70]],
  5: [[30, 5], [90, 30], [80, 90], [20, 80], [5, 40]],
  6: [[20, 10], [60, 5], [95, 45], [75, 90], [30, 95], [5, 50]],
  8: [[30, 5], [70, 10], [95, 30], [90, 70], [65, 95], [25, 90], [5, 65], [12, 28]],
};

const QUAD_FACTS: [string, boolean][] = [
  ["Todos los cuadrados son rectángulos.", true],
  ["Todos los rectángulos son cuadrados.", false],
  ["Todos los cuadrados son rombos.", true],
  ["Todos los rombos son cuadrados.", false],
  ["Todos los rectángulos son paralelogramos.", true],
  ["Todos los paralelogramos son rectángulos.", false],
  ["Todos los rombos son paralelogramos.", true],
  ["Todos los trapecios son paralelogramos.", false],
  ["Todos los paralelogramos son cuadriláteros.", true],
  ["Algunos rectángulos son rombos.", true],
  ["Ningún trapecio es un cuadrilátero.", false],
  ["Un cuadrado es a la vez rectángulo y rombo.", true],
  ["Algunos paralelogramos tienen cuatro ángulos rectos.", true],
  ["Un rombo siempre tiene cuatro ángulos rectos.", false],
  ["Un trapecio tiene dos pares de lados paralelos.", false],
  ["Todo cuadrilátero con cuatro ángulos rectos es un rectángulo.", true],
];

// 5.° QQ.10: describir las relaciones entre los cuadriláteros.
export function quadRelations(r: Rng): Question {
  const [text, ok] = r.pick(QUAD_FACTS);
  return trueFalse("¿Verdadero o falso?", ok, "Cuadrado: 4 lados iguales y 4 ángulos rectos. Rectángulo: 4 ángulos rectos. Rombo: 4 lados iguales. Paralelogramo: 2 pares de lados paralelos. Trapecio: un solo par.", text);
}

// 5.° RR.1: ¿es un polígono?
export function isPolygon(r: Rng): Question {
  const yes = r.chance(0.5);
  if (yes) {
    const n = r.pick([3, 4, 5, 6, 8]);
    return yesNo("¿Esta figura es un polígono?", true, "Sí: es una figura cerrada formada solo por segmentos rectos.", { kind: "polygon", points: r.chance(0.5) ? regular(n) : IRREGULAR[n] }, "si");
  }
  if (r.chance(0.4)) return yesNo("¿Esta figura es un polígono?", false, "No: tiene una línea curva. Un polígono solo tiene lados rectos.", { kind: "shapes", names: ["círculo"] }, "curva");
  const n = r.pick([4, 5, 6]);
  return yesNo("¿Esta figura es un polígono?", false, "No: la figura está abierta. Un polígono es una figura cerrada.", { kind: "polygon", points: IRREGULAR[n], open: true }, "abierta");
}

// 5.° RR.2: número de lados de los polígonos.
export function polygonSides(r: Rng): Question {
  const n = r.int(3, 10);
  const form = r.int(0, 2);
  if (form === 0) return numQ(n, `¿Cuántos lados tiene un ${POLY_NAMES[n]}?`, undefined, `Un ${POLY_NAMES[n]} tiene ${n} lados.`, "nombre-a-lados");
  const names = Object.values(POLY_NAMES);
  const near = names.filter((x) => Math.abs(Number(Object.keys(POLY_NAMES).find((k) => POLY_NAMES[Number(k)] === x)) - n) <= 2 && x !== POLY_NAMES[n]);
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  if (form === 1) return choiceQ(r, `¿Cómo se llama el polígono de ${n} lados?`, cap(POLY_NAMES[n]), near.map(cap), `El polígono de ${n} lados es el ${POLY_NAMES[n]}.`, undefined, "lados-a-nombre");
  return choiceQ(r, "¿Cómo se llama este polígono? (Cuenta sus lados.)", cap(POLY_NAMES[n]), near.map(cap), `Tiene ${n} lados: es un ${POLY_NAMES[n]}.`, { kind: "polygon", points: regular(n) }, "dibujo");
}

// 5.° RR.3: polígonos regulares e irregulares.
export function regularIrregular(r: Rng): Question {
  const isRegular = r.chance(0.5);
  const n = isRegular ? r.pick([3, 4, 5, 6, 7, 8, 10]) : r.pick([3, 4, 5, 6, 8]);
  // Las irregulares también se muestran reflejadas, para que no siempre se vean igual.
  const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [100 - x, y]);
  const flip = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [x, 100 - y]);
  const shown = isRegular ? regular(n) : r.pick([IRREGULAR[n], mirror(IRREGULAR[n]), flip(IRREGULAR[n]), flip(mirror(IRREGULAR[n]))]);
  return fixedQ("¿El polígono es regular o irregular?", ["Regular", "Irregular"], isRegular ? "Regular" : "Irregular", isRegular ? "Es regular: todos sus lados miden lo mismo y todos sus ángulos son iguales." : "Es irregular: sus lados (o sus ángulos) no son todos iguales.", { kind: "polygon", points: shown }, `${isRegular ? "regular" : "irregular"}-${n}`);
}

const VENN_ITEMS: [string, boolean, boolean][] = [
  ["un cuadrado", true, true],
  ["un rectángulo que no es cuadrado", true, false],
  ["un trapecio", true, false],
  ["un rombo que no es cuadrado", true, false],
  ["un triángulo equilátero", false, true],
  ["un pentágono regular", false, true],
  ["un hexágono regular", false, true],
  ["un triángulo escaleno", false, false],
  ["un pentágono irregular", false, false],
  ["un octágono regular", false, true],
  ["un romboide", true, false],
  ["un hexágono irregular", false, false],
];
const ZONES = ["Solo en «Cuadriláteros»", "En el centro (los dos)", "Solo en «Polígonos regulares»", "Fuera de los dos círculos"];

// 5.° RR.4: clasificar polígonos en diagramas de Venn.
export function polygonVenn(r: Rng): Question {
  const want = r.int(0, 3);
  const zone = (q: boolean, reg: boolean) => (q && reg ? 1 : q ? 0 : reg ? 2 : 3);
  const pool = VENN_ITEMS.filter(([, q, reg]) => zone(q, reg) === want);
  const [name, q, reg] = r.pick(pool);
  return fixedQ(`¿Dónde va ${name} en el diagrama?`, ZONES, ZONES[want], `${name[0].toUpperCase()}${name.slice(1)} ${q ? "tiene 4 lados" : "no tiene 4 lados"} y ${reg ? "es regular (lados y ángulos iguales)" : "no es regular"}.`, { kind: "venn", left: [], both: [], right: [], leftLabel: "Cuadriláteros", rightLabel: "Polígonos regulares" }, ZONES[want]);
}

// 5.° RR.5: propiedades de los polígonos.
export function polygonProperties(r: Rng): Question {
  const n = r.int(3, 10);
  const name = POLY_NAMES[n];
  const form = r.int(0, 3);
  if (form === 0) return numQ(n, `¿Cuántos vértices tiene un ${name}?`, undefined, `Un polígono tiene tantos vértices como lados: ${n}.`, "vertices");
  if (form === 1) return numQ(n, `¿Cuántos ángulos interiores tiene un ${name}?`, undefined, `Un polígono tiene tantos ángulos como lados: ${n}.`, "angulos");
  if (form === 2) {
    const side = r.int(2, 12);
    return numQ(n * side, `Un ${name} regular tiene lados de ${side} cm. ¿Cuál es su perímetro, en cm?`, undefined, `Tiene ${n} lados iguales: ${n} × ${side} = ${n * side} cm.`, "perimetro-regular");
  }
  const ok = r.chance(0.5);
  const statement = ok ? r.pick([`Un ${name} tiene ${n} lados y ${n} vértices.`, "Todos los lados de un polígono son segmentos rectos.", "En un polígono regular todos los lados miden lo mismo."]) : r.pick([`Un ${name} tiene ${n + 1} vértices.`, "Un círculo es un polígono.", "Un polígono puede tener un lado curvo.", `Un ${name} tiene más lados que ángulos.`]);
  return trueFalse("¿Verdadero o falso?", ok, `Un polígono es una figura cerrada de lados rectos; tiene igual cantidad de lados, vértices y ángulos.`, statement, "afirmaciones");
}

const RECT: Pt[] = [[2, 22], [98, 22], [98, 78], [2, 78]];
const rect = (w: string, h: string): Visual => ({ kind: "polygon", points: RECT, sideLabels: [w, h, "", ""], rightAngles: [0, 1, 2, 3] });
const TEN = 100; // un décimo, en milésimos

// 5.° SS.2 / TT.9: perímetro (y área) de rectángulos con lados decimales.
export function decimalRect(r: Rng, what: "perimetro" | "area" | "both"): Question {
  const kind = what === "both" ? r.pick(["perimetro", "area"] as const) : what;
  const u = r.pick(["cm", "m"]);
  const w = r.int(21, 99) * TEN;
  const h = r.int(11, Math.floor(w / TEN) - 1) * TEN;
  const visual = rect(`${d3(w)} ${u}`, `${d3(h)} ${u}`);
  if (kind === "perimetro") return decQ(r, `¿Cuál es el perímetro del rectángulo, en ${u}?`, 2 * (w + h), `2 × (${d3(w)} + ${d3(h)}) = 2 × ${d3(w + h)} = ${d3(2 * (w + h))} ${u}.`, visual, "perimetro", [w + h, (w * h) / 1000]);
  return decQ(r, `¿Cuál es el área del rectángulo, en ${u}²?`, (w * h) / 1000, `${d3(w)} × ${d3(h)} = ${d3((w * h) / 1000)} ${u}².`, visual, "area", [2 * (w + h), w + h, (w * h) / 100, (w * h) / 10000].filter(Number.isInteger));
}

// 5.° SS.3 / TT.8: perímetro (y área) de rectángulos con lados fraccionarios.
export function fractionRect(r: Rng, what: "perimetro" | "area" | "both"): Question {
  const kind = what === "both" ? r.pick(["perimetro", "area"] as const) : what;
  const u = r.pick(["m", "km"]);
  const d = r.pick([2, 3, 4, 5, 8]);
  const side = (): Frac => (r.chance(0.5) ? [r.int(1, 3) * d + r.int(1, d - 1), d] : [r.int(1, d - 1), d]);
  const a = side();
  const b = side();
  const show = (f: Frac) => mixed(f[0], f[1]);
  const visual = rect(`${show(a)} ${u}`, `${show(b)} ${u}`);
  if (kind === "perimetro") {
    const p = fmul(fadd(a, b), [2, 1]);
    return fracQ(r, `¿Cuál es el perímetro del rectángulo, en ${u}?`, p, `2 × (${show(a)} + ${show(b)}) = 2 × ${fshow(fadd(a, b))} = ${fshow(p)} ${u}.`, visual, "perimetro", [fadd(a, b), fmul(a, b)]);
  }
  const p = fmul(a, b);
  return fracQ(r, `¿Cuál es el área del rectángulo, en ${u}²?`, p, `${show(a)} × ${show(b)} = ${fshow(p)} ${u}².`, visual, "area", [fadd(a, b), fmul(fadd(a, b), [2, 1])]);
}

// Figura sobre la cuadrícula (cada casilla mide 1 unidad): rectángulo o figura en L.
function gridFigure(r: Rng): { points: Pt[]; area: number; perim: number } {
  const x = r.int(0, 2);
  const y = r.int(0, 2);
  const W = r.int(3, 10 - x - 1);
  const H = r.int(3, 10 - y - 1);
  const P = (cx: number, cy: number): Pt => [(x + cx) * 10, (y + cy) * 10];
  if (r.chance(0.4)) return { points: [P(0, 0), P(W, 0), P(W, H), P(0, H)], area: W * H, perim: 2 * (W + H) };
  const a = r.int(1, W - 2);
  const b = r.int(1, H - 2);
  return { points: [P(0, 0), P(W - a, 0), P(W - a, b), P(W, b), P(W, H), P(0, H)], area: W * H - a * b, perim: 2 * (W + H) };
}

// 5.° SS.4 / TT.6: perímetro y área de figuras en cuadrículas.
export function gridMeasure(r: Rng, what: "perimetro" | "area"): Question {
  const f = gridFigure(r);
  const visual: Visual = { kind: "polygon", points: f.points, grid: true };
  if (what === "perimetro") return numQ(f.perim, "Cada casilla mide 1 unidad de lado. ¿Cuál es el perímetro de la figura, en unidades?", visual, `Contamos los lados de casilla que forman el borde: ${f.perim} unidades.`, "perimetro");
  return numQ(f.area, "Cada casilla es 1 unidad cuadrada. ¿Cuál es el área de la figura, en unidades cuadradas?", visual, `Contamos las casillas de adentro: ${f.area} unidades cuadradas.`, "area");
}

// 5.° TT.10: área y perímetro, problemas de varios pasos con conversiones.
export function areaConversionProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const w = r.int(2, 9);
  const hCm = r.int(2, 9) * 50 + 100;
  const form = r.int(0, 2);
  if (form === 0) return numQ(2 * (w * 100 + hCm), `${n} tiene una lona rectangular de ${w} m de largo y ${hCm} cm de ancho. ¿Cuántos centímetros de cinta necesita para bordear toda la lona?`, undefined, `${w} m = ${w * 100} cm; perímetro: 2 × (${w * 100} + ${hCm}) = ${fmt(2 * (w * 100 + hCm))} cm.`, "perimetro-en-cm");
  if (form === 1) return decQ(r, `Un jardín rectangular mide ${w} m de largo y ${hCm} cm de ancho. ¿Cuál es su área, en m²?`, w * hCm * 10, `${hCm} cm = ${d3(hCm * 10)} m; ${w} × ${d3(hCm * 10)} = ${d3(w * hCm * 10)} m².`, undefined, "area-en-m2", [w * hCm * 1000, 2 * (w * 1000 + hCm * 10)]);
  const tile = r.pick([20, 25, 50]);
  const side = r.int(2, 6);
  return numQ(((side * 100) / tile) ** 2, `Un piso cuadrado de ${side} m de lado se cubre con losetas cuadradas de ${tile} cm de lado. ¿Cuántas losetas se necesitan?`, undefined, `${side} m = ${side * 100} cm; en cada lado caben ${side * 100} ÷ ${tile} = ${(side * 100) / tile} losetas; ${(side * 100) / tile} × ${(side * 100) / tile} = ${fmt(((side * 100) / tile) ** 2)}.`, "losetas");
}

// ---------------------------------------------------------------------------
// Volumen

const prism = (l: number, w: number, h: number): Visual => ({ kind: "cubes3d", heights: Array.from({ length: w }, () => Array.from({ length: l }, () => h)) });

// Pilas en escalera: ningún cubo queda escondido detrás de otro.
function staircase(r: Rng): number[][] {
  const rows = r.int(2, 3);
  const cols = r.int(2, 4);
  const top = r.int(2, 4);
  const grid: number[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      const cap = Math.min(i > 0 ? grid[i - 1][j] : top, j > 0 ? grid[i][j - 1] : top);
      grid[i].push(i === 0 && j === 0 ? top : r.int(Math.max(0, cap - 2), cap));
    }
  }
  return grid;
}

// 5.° UU.1 / UU.9: volumen de figuras irregulares hechas con cubos unitarios.
export function cubeFigureVolume(r: Rng, compound = false): Question {
  if (compound) {
    const l = r.int(3, 5);
    const w = r.int(2, 3);
    const h = r.int(1, 2);
    const l2 = r.int(1, l - 1);
    const h2 = r.int(1, 3);
    const heights = Array.from({ length: w }, () => Array.from({ length: l }, (_, j) => (j < l2 ? h + h2 : h)));
    return numQ(l * w * h + l2 * w * h2, "La figura está formada por dos prismas rectangulares de cubos de 1 cm³. ¿Cuál es su volumen, en cm³?", { kind: "cubes3d", heights }, `Prisma de abajo: ${l} × ${w} × ${h} = ${l * w * h}; prisma de arriba: ${l2} × ${w} × ${h2} = ${l2 * w * h2}; total ${l * w * h + l2 * w * h2} cm³.`, "compuesta");
  }
  const heights = staircase(r);
  const total = heights.flat().reduce((a, b) => a + b, 0);
  return numQ(total, "Cada cubo mide 1 unidad cúbica; debajo de cada cubo hay otro cubo o el piso. ¿Cuál es el volumen de la figura, en unidades cúbicas?", { kind: "cubes3d", heights }, `Contamos los cubos por columnas: ${heights.map((row) => row.join(" + ")).join(" + ")} = ${total}.`, "irregular");
}

// 5.° UU.2 / UU.3: volumen de prismas rectangulares hechos con cubos unitarios.
export function cubePrismVolume(r: Rng, expression: boolean): Question {
  const l = r.int(2, 5);
  const w = r.int(2, 4);
  const h = r.int(2, 4);
  const visual = prism(l, w, h);
  const answer = `${l} × ${w} × ${h}`;
  if (expression) return choiceQ(r, "El prisma está hecho con cubos unitarios. ¿Qué expresión da su volumen?", answer, [`${l} + ${w} + ${h}`, `${l} × ${w} + ${h}`, `${l} × ${w}`, `2 × (${l} + ${w} + ${h})`, `${l + 1} × ${w} × ${h}`], `Largo × ancho × altura: ${answer} = ${l * w * h} cubos.`, visual);
  return numQ(l * w * h, "El prisma está hecho con cubos de 1 cm³. ¿Cuál es su volumen, en cm³?", visual, `Cada capa tiene ${l} × ${w} = ${l * w} cubos y hay ${h} capas: ${l * w} × ${h} = ${l * w * h} cm³.`);
}

// 5.° UU.4 – UU.8: volumen de cubos y prismas rectangulares (fórmula y problemas).
export function prismVolume(r: Rng, mode: "cubesWord" | "formula" | "word" | "compare" | "multiStep"): Question {
  const l = r.int(2, 12);
  const w = r.int(2, 10);
  const h = r.int(2, 9);
  const v = l * w * h;
  const n = r.pick(NAMES);
  if (mode === "cubesWord") return numQ(v, r.pick([`${n} arma una caja con cubos de 1 cm³: cada capa tiene ${l} filas de ${w} cubos y hay ${h} capas. ¿Cuál es el volumen de la caja, en cm³?`, `Una torre de cubos unitarios tiene una base de ${l} por ${w} cubos y ${h} pisos. ¿Cuántos cubos tiene?`]), undefined, `${l} × ${w} × ${h} = ${fmt(v)}.`);
  if (mode === "formula") {
    if (r.chance(0.3)) {
      const s = r.int(2, 9);
      return numQ(s ** 3, `Un cubo tiene aristas de ${s} cm. ¿Cuál es su volumen, en cm³?`, undefined, `V = arista × arista × arista = ${s} × ${s} × ${s} = ${s ** 3} cm³.`, "cubo");
    }
    return numQ(v, `Un prisma rectangular mide ${l} cm de largo, ${w} cm de ancho y ${h} cm de altura. ¿Cuál es su volumen, en cm³?`, undefined, `V = largo × ancho × altura = ${l} × ${w} × ${h} = ${fmt(v)} cm³.`, "prisma");
  }
  if (mode === "word") return numQ(v, r.pick([`Una pecera mide ${l} dm de largo, ${w} dm de ancho y ${h} dm de altura. ¿Cuántos decímetros cúbicos de agua caben?`, `Una cajita mide ${l} cm por ${w} cm por ${h} cm. ¿Cuál es su volumen, en cm³?`, `Un contenedor mide ${l} m de largo, ${w} m de ancho y ${h} m de alto. ¿Cuál es su volumen, en m³?`]), undefined, `${l} × ${w} × ${h} = ${fmt(v)}.`);
  if (mode === "compare") {
    if (r.chance(0.5)) return numQ(h, `Una caja tiene un volumen de ${fmt(v)} cm³. Su base mide ${l} cm por ${w} cm. ¿Cuál es su altura, en cm?`, undefined, `Área de la base: ${l} × ${w} = ${l * w}; ${fmt(v)} ÷ ${l * w} = ${h} cm.`, "dimension-que-falta");
    const k = r.int(2, 4);
    return numQ(k, `La caja A mide ${l} cm × ${w} cm × ${h} cm. La caja B mide ${l} cm × ${w} cm × ${h * k} cm. ¿Cuántas veces el volumen de A es el volumen de B?`, undefined, `Solo cambia la altura, que es ${k} veces mayor: el volumen de B es ${k} veces el de A (${fmt(v)} y ${fmt(v * k)} cm³).`, "veces");
  }
  const form = r.int(0, 2);
  if (form === 0) {
    const k = r.int(2, 6);
    return numQ(v * k, `Cada caja mide ${l} cm × ${w} cm × ${h} cm. ¿Qué volumen ocupan ${k} cajas iguales, en cm³?`, undefined, `Una caja: ${l} × ${w} × ${h} = ${fmt(v)} cm³; ${k} cajas: ${fmt(v * k)} cm³.`, "varias-cajas");
  }
  if (form === 1) {
    const filled = r.int(1, h - 1);
    return numQ(l * w * (h - filled), `Un tanque mide ${l} dm × ${w} dm × ${h} dm y tiene agua hasta ${filled} dm de altura. ¿Cuántos decímetros cúbicos faltan para llenarlo?`, undefined, `Falta una altura de ${h - filled} dm: ${l} × ${w} × ${h - filled} = ${fmt(l * w * (h - filled))} dm³.`, "lo-que-falta");
  }
  const s = r.pick([1, 2].filter((x) => l % x === 0 && w % x === 0 && h % x === 0));
  return numQ(v / s ** 3, `Una caja mide ${l} cm × ${w} cm × ${h} cm. ¿Cuántos cubos de ${s} cm de arista caben exactamente dentro?`, undefined, `A lo largo caben ${l / s}, a lo ancho ${w / s} y a lo alto ${h / s}: ${l / s} × ${w / s} × ${h / s} = ${fmt(v / s ** 3)}.`, "cubos-que-caben");
}

// 5.° UU.10: volumen de cubos y prismas con lados decimales.
export function decimalVolume(r: Rng): Question {
  const l = r.int(2, 9);
  const w = r.int(2, 9);
  const h = r.int(11, 99); // décimos
  const v = l * w * h * TEN;
  return decQ(r, `Un prisma rectangular mide ${l} m de largo, ${w} m de ancho y ${d3(h * TEN)} m de altura. ¿Cuál es su volumen, en m³?`, v, `${l} × ${w} = ${l * w}; ${l * w} × ${d3(h * TEN)} = ${d3(v)} m³.`, undefined, undefined, [v * 10, v / 10, (l + w) * 1000 + h * TEN].filter(Number.isInteger));
}

const CUBIC: [string, string][] = [
  ["el volumen de un dado", "cm³"], ["el volumen de una caja de fósforos", "cm³"], ["el volumen de un borrador", "cm³"], ["el volumen de una lonchera", "cm³"],
  ["el volumen de una piscina", "m³"], ["el volumen de un salón de clases", "m³"], ["el volumen de un camión de carga", "m³"], ["el agua de un reservorio", "m³"],
  ["el volumen de una pecera", "dm³"], ["el volumen de una caja de leche", "dm³"], ["el volumen de un balde", "dm³"],
];

// 5.° UU.11: comparar y aplicar las unidades cúbicas.
export function cubicUnits(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const [thing, unit] = r.pick(CUBIC);
    return fixedQ(`¿Qué unidad conviene para medir ${thing}?`, ["cm³", "dm³", "m³"], unit, `Para ${thing} conviene usar ${unit}.`, undefined, unit);
  }
  if (form === 1) {
    const [big, small, k] = r.pick<[string, string, number]>([["dm³", "cm³", 1000], ["m³", "dm³", 1000]]);
    const n = r.int(2, 9);
    return numQ(n * k, `Completa (1 ${big} = ${fmt(k)} ${small}).`, `${n} ${big} = ? ${small}`, `${n} × ${fmt(k)} = ${fmt(n * k)} ${small}.`, "convertir");
  }
  const [a, b] = r.pick([["1 m³", "1 cm³"], ["1 dm³", "1 cm³"], ["1 m³", "1 dm³"]]);
  const bigger = r.chance(0.5);
  return fixedQ(`¿Cuál es ${bigger ? "mayor" : "menor"}?`, [a, b], bigger ? a : b, `Un cubo de arista más larga ocupa más espacio: ${a} es mayor que ${b}.`, undefined, "comparar");
}
