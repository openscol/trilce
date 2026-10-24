import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, choiceQ, fixedQ, fmt, multiQ, numQ, yesNo } from "./kit";
import { classifyTriangle } from "./geometry2";

// Geometría de 4.° en adelante: perímetro y área de rectángulos y figuras
// compuestas, rectas y ángulos, triángulos, cuadriláteros y simetría.

type Pt = [number, number];
const RECT: Pt[] = [[2, 22], [98, 22], [98, 78], [2, 78]];
const SQUARE: Pt[] = [[16, 12], [84, 12], [84, 80], [16, 80]];
const rect = (w: string, h: string, square = false): Visual => ({ kind: "polygon", points: square ? SQUARE : RECT, sideLabels: [w, h, "", ""], rightAngles: [0, 1, 2, 3] });
const unitOf = (r: Rng) => r.pick(["cm", "m"]);

// Variantes del mismo dibujo: reflejado y/o girado 90° (para que no siempre se vea igual).
const flip = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [100 - x, y]);
const turn = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [y, x]);
function vary(r: Rng, pts: Pt[]): Pt[] {
  const flipped = r.chance(0.5) ? flip(pts) : pts;
  return r.chance(0.5) ? turn(flipped) : flipped;
}

// Perímetro, hallar el lado que falta.
export function perimeterMissingSide(r: Rng): Question {
  const u = unitOf(r);
  if (r.chance(0.5)) {
    const w = r.int(5, 30);
    const h = r.int(2, w - 1);
    const p = 2 * (w + h);
    return numQ(h, `El perímetro del rectángulo es ${p} ${u}. ¿Cuánto mide el lado marcado con «?»?`, rect(`${w} ${u}`, "?"), `Dos lados miden ${w}: ${p} − ${2 * w} = ${2 * h}; ${2 * h} ÷ 2 = ${h} ${u}.`, "rectangulo");
  }
  const sides = [r.int(4, 20), r.int(4, 20), r.int(4, 20)];
  if (sides[0] + sides[1] <= sides[2] || sides[0] + sides[2] <= sides[1] || sides[1] + sides[2] <= sides[0]) return perimeterMissingSide(r);
  const p = sides[0] + sides[1] + sides[2];
  return numQ(sides[2], `El perímetro del triángulo es ${p} ${u}. ¿Cuánto mide el lado marcado con «?»?`, { kind: "polygon", points: [[18, 20], [98, 92], [2, 92]], sideLabels: [`${sides[0]} ${u}`, `${sides[1]} ${u}`, "?"] }, `${p} − ${sides[0]} − ${sides[1]} = ${sides[2]} ${u}.`, "triangulo");
}

// Rectángulo con sus medidas.
function dims(r: Rng, max = 20) {
  const a = r.int(3, max);
  const b = r.int(2, max);
  // El largo (w) nunca es menor que el ancho (h).
  const [w, h] = a >= b ? [a, b] : [b, a];
  return { w, h, area: w * h, perim: 2 * (w + h) };
}

// Perímetro o área de rectángulos con fórmulas.
export function rectFormula(r: Rng, what: "perimetro" | "area"): Question {
  const u = unitOf(r);
  const square = r.chance(0.25);
  const d = dims(r);
  const w = d.w;
  const h = square ? w : d.h === w ? w - 1 : d.h;
  if (what === "perimetro") return numQ(square ? 4 * w : 2 * (w + h), `Usa la fórmula para hallar el perímetro del ${square ? "cuadrado" : "rectángulo"}, en ${u}.`, rect(`${w} ${u}`, `${h} ${u}`, square), square ? `P = 4 × lado = 4 × ${w} = ${4 * w} ${u}.` : `P = 2 × (largo + ancho) = 2 × (${w} + ${h}) = ${2 * (w + h)} ${u}.`, square ? "cuadrado" : "rectangulo");
  return numQ(w * h, `Usa la fórmula para hallar el área del ${square ? "cuadrado" : "rectángulo"}, en ${u}².`, rect(`${w} ${u}`, `${h} ${u}`, square), `A = largo × ancho = ${w} × ${h} = ${w * h} ${u}².`, square ? "cuadrado" : "rectangulo");
}

const PLACES = ["un jardín", "un patio", "una cancha", "un huerto", "una piscina", "un salón", "una alfombra", "un terreno"];

// Problemas de perímetro y de área.
export function rectProblem(r: Rng, what: "perimetro" | "area" | "both"): Question {
  const kind = what === "both" ? r.pick(["perimetro", "area"] as const) : what;
  const { w, h, area, perim } = dims(r, 25);
  const place = r.pick(PLACES);
  const name = r.pick(NAMES);
  if (kind === "perimetro") {
    return r.chance(0.5)
      ? numQ(perim, `${name} quiere cercar ${place} rectangular de ${w} m de largo y ${h} m de ancho. ¿Cuántos metros de cerca necesita?`, undefined, `La cerca va por el borde (perímetro): 2 × (${w} + ${h}) = ${perim} m.`, "perimetro")
      : numQ(perim * 2, `${name} da 2 vueltas alrededor de ${place} rectangular de ${w} m por ${h} m. ¿Cuántos metros recorre?`, undefined, `Una vuelta es el perímetro: 2 × (${w} + ${h}) = ${perim} m; dos vueltas: ${perim * 2} m.`, "perimetro");
  }
  return r.chance(0.5)
    ? numQ(area, `${name} va a cubrir con césped ${place} rectangular de ${w} m de largo y ${h} m de ancho. ¿Cuántos metros cuadrados de césped necesita?`, undefined, `Cubrir la superficie es hallar el área: ${w} × ${h} = ${area} m².`, "area")
    : numQ(area, `El piso de ${place} rectangular mide ${w} m por ${h} m. Cada loseta cubre 1 m². ¿Cuántas losetas se necesitan?`, undefined, `Área: ${w} × ${h} = ${area} m², o sea ${area} losetas.`, "area");
}

// Crear rectángulos con un área dada.
export function rectanglesWithArea(r: Rng): Question {
  for (;;) {
    const { w, h, area } = dims(r, 12);
    const wrong: string[] = [];
    for (const [a, b] of [[w + 1, h], [w, h + 1], [w - 1, h + 2], [w + 2, h - 1], [w + h, 2], [w - 1, h]]) if (a > 0 && b > 0 && a * b !== area) wrong.push(`${a} por ${b}`);
    if (wrong.length < 3) continue;
    return choiceQ(r, `¿Qué rectángulo tiene un área de ${area} unidades cuadradas? (largo por ancho)`, `${w} por ${h}`, wrong, `${w} × ${h} = ${area}.`);
  }
}

// Hallar el área o el lado que falta de un rectángulo.
export function areaOrSide(r: Rng): Question {
  const u = unitOf(r);
  const { w, h, area } = dims(r);
  if (r.chance(0.4)) return numQ(area, `¿Cuál es el área del rectángulo, en ${u}²?`, rect(`${w} ${u}`, `${h} ${u}`), `${w} × ${h} = ${area} ${u}².`, "area");
  return numQ(h, `El área del rectángulo es ${area} ${u}². ¿Cuánto mide el lado marcado con «?», en ${u}?`, rect(`${w} ${u}`, "?"), `${area} ÷ ${w} = ${h} ${u}.`, "lado");
}

// Figura en L: un rectángulo de W × H al que se le quitó una esquina de a × b.
function lShape(r: Rng): { W: number; H: number; a: number; b: number; points: Pt[]; area: number; perim: number; cut: [Pt, Pt] } {
  const W = r.int(6, 14);
  const H = r.int(5, 12);
  const a = r.int(2, W - 2);
  const b = r.int(2, H - 2);
  // Escala al lienzo de 100 × 100.
  const s = 90 / Math.max(W, H);
  // Con un entrante (o un saliente) muy chico, los rótulos se pisan.
  if (a * s < 28 || b * s < 46 || (W - a) * s < 24 || (H - b) * s < 22) return lShape(r);
  const P = (x: number, y: number): Pt => [5 + x * s, 5 + y * s];
  // El vértice extra (en línea con el lado) solo sirve para subir el rótulo del
  // lado vertical del entrante y que no se pise con el del lado horizontal.
  const points: Pt[] = [P(0, 0), P(W - a, 0), P(W - a, b * 0.45), P(W - a, b), P(W, b), P(W, H), P(0, H)];
  return { W, H, a, b, points, area: W * H - a * b, perim: 2 * (W + H), cut: [P(W - a, b), P(W - a, H)] as [Pt, Pt] };
}

// Área (o perímetro) de figuras compuestas.
export function complexFigure(r: Rng, what: "area" | "perimetro" | "both", words = false): Question {
  const kind = what === "both" ? r.pick(["area", "perimetro"] as const) : what;
  const f = lShape(r);
  const u = "m";
  const visual: Visual = { kind: "polygon", points: f.points, sideLabels: [`${f.W - f.a} ${u}`, `${f.b} ${u}`, "", `${f.a} ${u}`, `${f.H - f.b} ${u}`, `${f.W} ${u}`, `${f.H} ${u}`], dashed: kind === "area" ? [f.cut] : undefined };
  const intro = words ? `El plano muestra ${r.pick(["un jardín", "una sala", "un patio", "un parque"])}. ` : "";
  if (kind === "area") {
    const left = (f.W - f.a) * f.H;
    const right = f.a * (f.H - f.b);
    return numQ(f.area, `${intro}¿Cuál es el área de la figura, en ${u}²? (Pártela en dos rectángulos.)`, visual, `Rectángulo izquierdo: ${f.W - f.a} × ${f.H} = ${left}; derecho: ${f.a} × ${f.H - f.b} = ${right}; total ${left} + ${right} = ${f.area} ${u}².`, "area");
  }
  return numQ(f.perim, `${intro}¿Cuál es el perímetro de la figura, en ${u}?`, visual, `Sumamos todos los lados: ${f.W - f.a} + ${f.b} + ${f.a} + ${f.H - f.b} + ${f.W} + ${f.H} = ${f.perim} ${u}.`, "perimetro");
}

// Área entre dos rectángulos.
export function areaBetween(r: Rng): Question {
  const W = r.int(8, 20);
  const H = r.int(6, 15);
  const w = r.int(2, W - 3);
  const h = r.int(2, H - 3);
  const [outer, inner, u] = r.pick([["Un jardín", "una piscina", "m"], ["Una pared", "una ventana", "m"], ["Un patio", "una jardinera", "m"], ["Una cartulina", "una foto pegada", "cm"], ["Un parque", "una cancha", "m"]]);
  return numQ(W * H - w * h, `${outer} rectangular mide ${W} ${u} por ${H} ${u}. Dentro hay ${inner} rectangular de ${w} ${u} por ${h} ${u}. ¿Cuál es el área de la parte que queda libre, en ${u}²?`, undefined, `Área grande: ${W} × ${H} = ${W * H}; área pequeña: ${w} × ${h} = ${w * h}; ${W * H} − ${w * h} = ${W * H - w * h} ${u}².`);
}

// Comparar área y perímetro de rectángulos y cuadrados.
export function compareAreaPerimeter(r: Rng): Question {
  for (;;) {
    const a = dims(r, 12);
    const s = r.int(3, 10);
    const b = r.chance(0.5) ? { w: s, h: s, area: s * s, perim: 4 * s } : dims(r, 12);
    const what = r.pick(["area", "perim"] as const);
    if (a[what] === b[what]) continue;
    const more = r.chance(0.5);
    const answer = (a[what] > b[what]) === more ? "Figura A" : "Figura B";
    const label = what === "area" ? "área" : "perímetro";
    return fixedQ(`¿Qué figura tiene ${more ? "mayor" : "menor"} ${label}?`, ["Figura A", "Figura B"], answer, `A: ${label} ${a[what]}. B: ${label} ${b[what]}.`, `Figura A: rectángulo de ${a.w} cm por ${a.h} cm\nFigura B: ${b.w === b.h ? `cuadrado de ${b.w} cm de lado` : `rectángulo de ${b.w} cm por ${b.h} cm`}`, label);
  }
}

const SAME = ["La misma área", "El mismo perímetro", "Las dos cosas", "Ninguna de las dos"];

// Rectángulos con el mismo perímetro o la misma área.
export function samePerimeterOrArea(r: Rng): Question {
  for (;;) {
    const a = dims(r, 12);
    const want = r.int(0, 3);
    let b = dims(r, 12);
    if (want === 0) {
      const w = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12].filter((x) => a.area % x === 0 && x !== a.w && x !== a.h));
      if (!w) continue;
      b = { w, h: a.area / w, area: a.area, perim: 2 * (w + a.area / w) };
    } else if (want === 1) {
      const w = r.int(1, a.w + a.h - 1);
      b = { w, h: a.w + a.h - w, area: w * (a.w + a.h - w), perim: a.perim };
    } else if (want === 2) b = { w: a.h, h: a.w, area: a.area, perim: a.perim };
    const got = a.area === b.area && a.perim === b.perim ? 2 : a.area === b.area ? 0 : a.perim === b.perim ? 1 : 3;
    if (got !== want || (want !== 2 && a.w === b.h && a.h === b.w)) continue;
    return fixedQ("¿Qué tienen igual los rectángulos A y B?", SAME, SAME[got], `A: área ${a.area} y perímetro ${a.perim}. B: área ${b.area} y perímetro ${b.perim}.`, `A: ${a.w} cm por ${a.h} cm\nB: ${b.w} cm por ${b.h} cm`, SAME[got]);
  }
}

// Relación entre área y perímetro (dado uno y un lado, hallar el otro).
export function areaPerimeterRelation(r: Rng, words = false): Question {
  const { w, h, area, perim } = dims(r, 15);
  const fromArea = r.chance(0.5);
  const subject = words ? `${r.pick(PLACES)} rectangular`.replace(/^u/, "U") : "Un rectángulo";
  if (fromArea) return numQ(perim, `${subject} tiene ${area} m² de área y ${w} m de largo. ¿Cuál es su perímetro, en metros?`, undefined, `Ancho: ${area} ÷ ${w} = ${h} m. Perímetro: 2 × (${w} + ${h}) = ${perim} m.`, "de-area-a-perimetro");
  return numQ(area, `${subject} tiene ${perim} m de perímetro y ${w} m de largo. ¿Cuál es su área, en m²?`, undefined, `Largo + ancho = ${perim} ÷ 2 = ${w + h}; ancho = ${h} m. Área: ${w} × ${h} = ${area} m².`, "de-perimetro-a-area");
}

// Con el mismo perímetro, ¿qué rectángulo tiene más área?
export function perimeterAreaProblem(r: Rng): Question {
  const half = r.int(6, 14);
  const ws = r.shuffle(Array.from({ length: Math.floor(half / 2) }, (_, i) => i + 1)).slice(0, 3);
  const options = r.shuffle(ws).map((w) => `${half - w} m por ${w} m`);
  const more = r.chance(0.6);
  const best = more ? Math.max(...ws) : Math.min(...ws);
  return fixedQ(`${r.pick(NAMES)} tiene ${half * 2} m de cerca para un corral rectangular. ¿Con qué medidas el corral tiene ${more ? "mayor" : "menor"} área?`, options, `${half - best} m por ${best} m`, `Todos tienen ${half * 2} m de perímetro. Áreas: ${ws.map((w) => `${half - w} × ${w} = ${(half - w) * w}`).join("; ")} m².`, undefined, more ? "mayor" : "menor");
}

// Usar el área y el perímetro para calcular costos.
export function costProblem(r: Rng): Question {
  const { w, h, area, perim } = dims(r, 12);
  const price = r.int(2, 9);
  return r.chance(0.5)
    ? numQ(perim * price, `Un terreno rectangular mide ${w} m por ${h} m. Cercarlo cuesta ${price} soles por metro. ¿Cuántos soles cuesta cercar todo el terreno?`, undefined, `Perímetro: 2 × (${w} + ${h}) = ${perim} m; ${perim} × ${price} = ${fmt(perim * price)} soles.`, "perimetro")
    : numQ(area * price, `Un piso rectangular mide ${w} m por ${h} m. Cada metro cuadrado de losetas cuesta ${price} soles. ¿Cuántos soles cuesta cubrir todo el piso?`, undefined, `Área: ${w} × ${h} = ${area} m²; ${area} × ${price} = ${fmt(area * price)} soles.`, "area");
}

// ---------------------------------------------------------------------------
// Rectas y ángulos

const FIGURES: Record<"punto" | "recta" | "segmento" | "semirrecta" | "angulo", [string, string]> = {
  punto: ["Punto", "Un punto marca un lugar exacto; no tiene tamaño."],
  recta: ["Recta", "Una recta sigue sin fin en los dos sentidos (dos flechas)."],
  segmento: ["Segmento", "Un segmento es un trozo de recta con dos extremos."],
  semirrecta: ["Semirrecta", "Una semirrecta empieza en un punto y sigue sin fin en un solo sentido."],
  angulo: ["Ángulo", "Un ángulo lo forman dos semirrectas que salen del mismo punto."],
};

// Puntos, rectas, segmentos, semirrectas y ángulos.
export function pointsLinesRays(r: Rng): Question {
  const key = r.pick(Object.keys(FIGURES) as (keyof typeof FIGURES)[]);
  const labels = r.pick([["A", "B", "C"], ["P", "Q", "R"], ["M", "N", "O"], ["D", "E", "F"], ["R", "S", "T"]]);
  return fixedQ("¿Qué muestra el dibujo?", Object.values(FIGURES).map(([n]) => n), FIGURES[key][0], FIGURES[key][1], { kind: "geoFigure", figure: key, rotation: r.pick([0, 0, 20, -20, 40, -35]), labels }, key);
}

// ¿las rectas son paralelas, perpendiculares o secantes? (sí o no).
export function lineRelationYesNo(r: Rng): Question {
  const relations = ["paralelas", "perpendiculares", "secantes"] as const;
  const shown = r.pick(relations);
  const asked = r.chance(0.5) ? shown : r.pick(relations.filter((x) => x !== shown));
  // Las perpendiculares también se cortan: no se pregunta «¿son secantes?» sobre ellas.
  if (shown === "perpendiculares" && asked === "secantes") return lineRelationYesNo(r);
  const why = { paralelas: "Nunca se cortan y siempre están a la misma distancia: son paralelas.", perpendiculares: "Se cortan formando ángulos rectos: son perpendiculares.", secantes: "Se cortan en un punto sin formar ángulos rectos: son secantes (oblicuas)." };
  return yesNo(`¿Las dos rectas son ${asked}?`, shown === asked, why[shown], { kind: "lines", relation: shown, rotation: r.pick([0, 20, 45, 70, 110, 150]) }, shown);
}

const POLYS: { name: string; points: Pt[]; right: number[]; sides: number }[] = [
  { name: "triángulo rectángulo", points: [[10, 12], [10, 92], [92, 92]], right: [1], sides: 3 },
  { name: "rectángulo", points: RECT, right: [0, 1, 2, 3], sides: 4 },
  { name: "trapecio rectángulo", points: [[10, 20], [60, 20], [95, 85], [10, 85]], right: [0, 3], sides: 4 },
  { name: "triángulo", points: [[50, 8], [95, 90], [5, 90]], right: [], sides: 3 },
  { name: "pentágono", points: [[50, 5], [95, 38], [78, 92], [22, 92], [5, 38]], right: [], sides: 5 },
  { name: "hexágono", points: [[27, 8], [73, 8], [96, 50], [73, 92], [27, 92], [4, 50]], right: [], sides: 6 },
  { name: "pentágono con forma de casa", points: [[50, 5], [90, 40], [90, 92], [10, 92], [10, 40]], right: [2, 3], sides: 5 },
  { name: "figura en L", points: [[10, 8], [50, 8], [50, 52], [92, 52], [92, 92], [10, 92]], right: [0, 1, 3, 4, 5], sides: 6 },
];

// Lados y ángulos de polígonos.
export function sidesAndAngles(r: Rng): Question {
  const p = r.pick(POLYS);
  const visual: Visual = { kind: "polygon", points: p.points, rightAngles: p.right };
  const form = r.int(0, 2);
  if (form === 0) return numQ(p.sides, "¿Cuántos lados tiene la figura?", visual, `Tiene ${p.sides} lados.`, "lados");
  if (form === 1) return numQ(p.sides, "¿Cuántos ángulos (vértices) tiene la figura?", visual, `Un polígono tiene tantos ángulos como lados: ${p.sides}.`, "angulos");
  return numQ(p.right.length, "Los ángulos rectos están marcados con un cuadradito. ¿Cuántos ángulos rectos tiene la figura?", visual, `Tiene ${p.right.length} ${p.right.length === 1 ? "ángulo recto" : "ángulos rectos"}.`, "rectos");
}

const ANGLE_TYPES = ["Agudo", "Recto", "Obtuso", "Llano", "Cóncavo"];
const angleType = (deg: number) => (deg < 90 ? "Agudo" : deg === 90 ? "Recto" : deg < 180 ? "Obtuso" : deg === 180 ? "Llano" : "Cóncavo");
const ANGLE_WHY: Record<string, string> = { Agudo: "mide menos de 90°", Recto: "mide exactamente 90°", Obtuso: "mide más de 90° y menos de 180°", Llano: "mide exactamente 180°", Cóncavo: "mide más de 180°" };

// Ángulos agudos, rectos, obtusos, llanos y cóncavos.
export function classifyAngle5(r: Rng): Question {
  const type = r.pick(ANGLE_TYPES);
  const deg = type === "Agudo" ? r.pick([20, 35, 50, 65, 80]) : type === "Recto" ? 90 : type === "Obtuso" ? r.pick([105, 120, 135, 150, 165]) : type === "Llano" ? 180 : r.pick([210, 240, 270, 300, 330]);
  return fixedQ(`El ángulo mide ${deg}°. ¿Qué tipo de ángulo es?`, ANGLE_TYPES, angleType(deg), `Es ${type.toLowerCase()}: ${ANGLE_WHY[type]}.`, { kind: "angle", degrees: deg, rotation: type === "Cóncavo" ? 0 : r.pick([0, 0, 30, 90, 200]) }, type.toLowerCase());
}

const TURN_PARTS = [2, 3, 4, 5, 6, 8, 9, 10, 12];

// Ángulos como fracciones de una vuelta.
export function angleFraction(r: Rng, toDegrees: boolean): Question {
  const parts = r.pick(TURN_PARTS);
  const k = toDegrees && r.chance(0.6) ? 1 : r.int(1, parts - 1);
  const visual: Visual = { kind: "fraction", shape: "circle", parts, shaded: k };
  const deg = (360 / parts) * k;
  if (toDegrees) return numQ(deg, `Un ángulo abarca ${k}/${parts} de una vuelta completa (360°). ¿Cuántos grados mide?`, visual, `360 ÷ ${parts} = ${360 / parts}; ${360 / parts} × ${k} = ${deg}°.`, `${parts}-partes`);
  return choiceQ(r, `El círculo está dividido en ${parts} partes iguales. ¿Qué fracción de la vuelta abarca el ángulo sombreado?`, `${k}/${parts}`, [`${parts - k}/${parts}`, `${k}/${parts + 1}`, `${k + 1}/${parts}`, `${k}/360`, `${parts}/${k + parts}`].filter((x) => x !== `${k}/${parts}`), `Están sombreadas ${k} de ${parts} partes iguales: ${k}/${parts} de vuelta.`, visual, `${parts}-partes`);
}

const TURNS: [string, number][] = [["un cuarto de vuelta", 90], ["media vuelta", 180], ["tres cuartos de vuelta", 270], ["una vuelta completa", 360]];

// Ángulos de 90°, 180°, 270° y 360°.
export function quarterTurns(r: Rng): Question {
  const [name, deg] = r.pick(TURNS);
  const form = r.int(0, 2);
  if (form === 0) return fixedQ(`¿Cuántos grados mide ${name}?`, ["90°", "180°", "270°", "360°"], `${deg}°`, `${name[0].toUpperCase()}${name.slice(1)} mide ${deg}°.`, undefined, String(deg));
  if (form === 1) return fixedQ(`Un giro de ${deg}° es...`, TURNS.map(([n]) => n), name, `${deg}° es ${name}.`, undefined, String(deg));
  const start = r.pick([12, 3, 6, 9]);
  const end = ((start + deg / 30 - 1) % 12) + 1;
  return fixedQ(`El minutero gira del ${start} al ${end} en el sentido del reloj${deg === 360 ? " (pasa por todos los números)" : ""}. ¿Cuántos grados giró?`, ["90°", "180°", "270°", "360°"], `${deg}°`, `De un número al siguiente hay 30°. Giró ${deg / 30} espacios: ${deg}°.`, undefined, "reloj");
}

// Medir ángulos en un círculo.
export function angleOnCircle(r: Rng): Question {
  const parts = r.pick([4, 6, 8, 9, 10, 12]);
  const k = r.int(1, parts - 1);
  const each = 360 / parts;
  return numQ(each * k, `El círculo (360°) está dividido en ${parts} ángulos iguales. ¿Cuántos grados mide el ángulo sombreado?`, { kind: "fraction", shape: "circle", parts, shaded: k }, `Cada parte mide 360 ÷ ${parts} = ${each}°; ${k} ${k === 1 ? "parte" : "partes"}: ${each * k}°.`, `${parts}-partes`);
}

// Medir (o comprobar) ángulos con un transportador.
export function protractor(r: Rng, check: boolean): Question {
  const deg = r.int(1, 17) * 10;
  const visual: Visual = { kind: "angle", degrees: deg, rotation: 0, protractor: true };
  if (!check) return numQ(deg, "Lee el transportador. ¿Cuántos grados mide el ángulo?", visual, `Un lado pasa por 0° y el otro por ${deg}°: mide ${deg}°.`, angleType(deg).toLowerCase());
  const good = r.chance(0.5);
  // Si está mal, suele ser por leer la otra escala (180° − x) o por pasarse unas marcas.
  const off = r.chance(0.5) && deg !== 90 ? 180 - deg : Math.min(170, Math.max(10, deg + r.pick([-20, -10, 10, 20])));
  const said = good ? deg : off === deg ? (deg >= 90 ? deg - 10 : deg + 10) : off;
  return yesNo(`${r.pick(NAMES)} debía dibujar un ángulo de ${said}°. ¿Lo dibujó bien?`, good, `El ángulo dibujado mide ${deg}°.`, visual, good ? "si" : "no");
}

// Estimar medidas de ángulos.
export function estimateAngle(r: Rng): Question {
  const sets = [[20, 70, 110, 160], [30, 90, 140, 170], [45, 80, 120, 175], [15, 60, 100, 150]];
  const options = r.pick(sets);
  const deg = r.pick(options);
  return fixedQ("Sin transportador: ¿cuál es la mejor estimación de la medida del ángulo?", options.map((x) => `${x}°`), `${deg}°`, `Compáralo con un ángulo recto (90°): este mide cerca de ${deg}°.`, { kind: "angle", degrees: deg, rotation: r.pick([0, 0, 25, 180]) }, angleType(deg).toLowerCase());
}

// Ángulos adyacentes.
export function adjacentAngles(r: Rng): Question {
  const a = r.int(2, 16) * 5;
  const b = r.int(2, Math.floor((175 - a) / 5)) * 5;
  if (r.chance(0.5)) return numQ(a + b, `Dos ángulos adyacentes miden ${a}° y ${b}°. ¿Cuántos grados mide el ángulo que forman juntos?`, undefined, `Los ángulos adyacentes se suman: ${a} + ${b} = ${a + b}°.`, "sumar");
  return numQ(b, `Un ángulo de ${a + b}° está dividido en dos ángulos adyacentes. Uno mide ${a}°. ¿Cuántos grados mide el otro?`, undefined, `${a + b} − ${a} = ${b}°.`, "restar");
}

// Problemas con medidas de ángulos.
export function angleProblem(r: Rng): Question {
  const form = r.int(0, 3);
  if (form === 0) {
    const n = r.pick([4, 5, 6, 8, 9, 10, 12]);
    return numQ(360 / n, `Una pizza redonda se corta en ${n} tajadas iguales. ¿Cuántos grados mide el ángulo de la punta de cada tajada?`, undefined, `360 ÷ ${n} = ${360 / n}°.`, "repartir");
  }
  if (form === 1) {
    const h = r.int(1, 11);
    const deg = h <= 6 ? h * 30 : (12 - h) * 30;
    return numQ(deg, `En un reloj, de un número al siguiente hay 30°. ¿Cuántos grados mide el ángulo menor entre las agujas a las ${h}:00?`, undefined, `Entre el 12 y el ${h} hay ${deg / 30} espacios: ${deg}°.`, "reloj");
  }
  if (form === 2) {
    const a = r.int(3, 14) * 5;
    const k = r.int(2, Math.min(5, Math.floor(180 / a)));
    return numQ(a * k, `Un abanico se abre ${a}° cada vez que se despliega una varilla. ¿Cuántos grados se abre con ${k} varillas?`, undefined, `${k} × ${a} = ${a * k}°.`, "multiplicar");
  }
  const turned = r.int(3, 16) * 10;
  return numQ(180 - turned, `Una puerta puede abrirse hasta 180°. Ya está abierta ${turned}°. ¿Cuántos grados más puede abrirse?`, undefined, `180 − ${turned} = ${180 - turned}°.`, "restar");
}

// Hallar un ángulo desconocido.
export function unknownAngle(r: Rng): Question {
  const [total, name] = r.pick<[number, string]>([[90, "un ángulo recto"], [180, "un ángulo llano"], [360, "una vuelta completa"]]);
  const a = r.int(2, total / 5 - 4) * 5;
  if (total === 360 || r.chance(0.3)) {
    const b = r.int(2, Math.floor((total - a) / 5) - 2) * 5;
    if (b < 10) return unknownAngle(r);
    return numQ(total - a - b, `Tres ángulos forman juntos ${name} (${total}°). Dos de ellos miden ${a}° y ${b}°. ¿Cuánto mide el tercero?`, `${a}° + ${b}° + x = ${total}°`, `${total} − ${a} − ${b} = ${total - a - b}°.`, String(total));
  }
  return numQ(total - a, `Dos ángulos forman juntos ${name} (${total}°). Uno mide ${a}°. ¿Cuánto mide el otro?`, `${a}° + x = ${total}°`, `${total} − ${a} = ${total - a}°.`, String(total));
}

// Clasificar triángulos solo por ángulos o solo por lados.
export function classifyTriangleBy(r: Rng, by: "lados" | "angulos"): Question {
  for (;;) {
    const q = classifyTriangle(r);
    if (q.tag === `por-${by}`) return q;
  }
}

// ---------------------------------------------------------------------------
// Cuadriláteros

type Quad = { name: string; article: string; points: Pt[]; right: number[]; parallel: number; equalSides: boolean; names: string[] };
const QUADS: Quad[] = [
  { name: "Cuadrado", article: "un cuadrado", points: SQUARE, right: [0, 1, 2, 3], parallel: 2, equalSides: true, names: ["Cuadrilátero", "Paralelogramo", "Rectángulo", "Rombo", "Cuadrado"] },
  { name: "Rectángulo", article: "un rectángulo", points: RECT, right: [0, 1, 2, 3], parallel: 2, equalSides: false, names: ["Cuadrilátero", "Paralelogramo", "Rectángulo"] },
  { name: "Rombo", article: "un rombo", points: [[50, 4], [90, 50], [50, 96], [10, 50]], right: [], parallel: 2, equalSides: true, names: ["Cuadrilátero", "Paralelogramo", "Rombo"] },
  { name: "Romboide", article: "un romboide", points: [[30, 22], [98, 22], [70, 78], [2, 78]], right: [], parallel: 2, equalSides: false, names: ["Cuadrilátero", "Paralelogramo"] },
  { name: "Trapecio", article: "un trapecio", points: [[30, 22], [70, 22], [96, 78], [4, 78]], right: [], parallel: 1, equalSides: false, names: ["Cuadrilátero", "Trapecio"] },
  { name: "Trapezoide", article: "un trapezoide", points: [[20, 14], [72, 28], [94, 86], [8, 66]], right: [], parallel: 0, equalSides: false, names: ["Cuadrilátero"] },
];
const ALL_NAMES = ["Cuadrilátero", "Paralelogramo", "Rectángulo", "Rombo", "Cuadrado", "Trapecio"];
const quadVisual = (q: Quad, r: Rng): Visual => ({ kind: "polygon", points: vary(r, q.points), rightAngles: q.right });
const quadFacts = (q: Quad) => `${q.parallel === 0 ? "No tiene lados paralelos" : q.parallel === 1 ? "Tiene un solo par de lados paralelos" : "Tiene dos pares de lados paralelos"}, ${q.equalSides ? "sus cuatro lados son iguales" : "sus lados no son todos iguales"} y ${q.right.length === 4 ? "tiene cuatro ángulos rectos" : "no tiene ángulos rectos"}.`;

// Lados paralelos en cuadriláteros.
export function parallelSides(r: Rng): Question {
  const q = r.pick(QUADS);
  return numQ(q.parallel, "¿Cuántos pares de lados paralelos tiene este cuadrilátero?", quadVisual(q, r), `${quadFacts(q)}`, q.name.toLowerCase());
}

// Lados y ángulos de cuadriláteros.
export function quadSidesAngles(r: Rng): Question {
  const q = r.pick(QUADS);
  const form = r.int(0, 2);
  if (form === 0) return yesNo("¿Este cuadrilátero tiene los cuatro lados iguales?", q.equalSides, quadFacts(q), quadVisual(q, r), "lados-iguales");
  if (form === 1) return yesNo("¿Este cuadrilátero tiene cuatro ángulos rectos?", q.right.length === 4, quadFacts(q), quadVisual(q, r), "angulos-rectos");
  return numQ(q.right.length, "Los ángulos rectos están marcados con un cuadradito. ¿Cuántos ángulos rectos tiene este cuadrilátero?", quadVisual(q, r), quadFacts(q), "contar-rectos");
}

const FAMILY_WHY: Record<string, string> = {
  Paralelogramo: "Un paralelogramo tiene dos pares de lados paralelos.",
  Trapecio: "Un trapecio tiene un solo par de lados paralelos.",
  Rectángulo: "Un rectángulo tiene cuatro ángulos rectos.",
  Rombo: "Un rombo tiene los cuatro lados iguales.",
};

// Identificar paralelogramos, trapecios, rectángulos o rombos.
export function identifyQuad(r: Rng, family: "Paralelogramo" | "Trapecio" | "Rectángulo" | "Rombo"): Question {
  const yes = r.chance(0.5);
  const q = r.pick(QUADS.filter((x) => x.names.includes(family) === yes));
  const plural = family === "Paralelogramo" ? "un paralelogramo" : family === "Trapecio" ? "un trapecio" : family === "Rectángulo" ? "un rectángulo" : "un rombo";
  return yesNo(`¿Esta figura es ${plural}?`, yes, `${FAMILY_WHY[family]} ${quadFacts(q).replace(/^Tiene/, "Esta figura tiene").replace(/^No tiene/, "Esta figura no tiene")}`, quadVisual(q, r), q.name.toLowerCase());
}

// Clasificar cuadriláteros (el nombre más preciso).
export function classifyQuad(r: Rng): Question {
  const q = r.pick(QUADS);
  return fixedQ("¿Cuál es el nombre más preciso de este cuadrilátero?", QUADS.map((x) => x.name), q.name, quadFacts(q), quadVisual(q, r), q.name.toLowerCase());
}

// Elegir todos los nombres de un cuadrilátero.
export function allQuadNames(r: Rng): Question {
  const q = r.pick(QUADS.filter((x) => x.names.length > 1));
  return multiQ("Selecciona todos los nombres que le corresponden a esta figura.", ALL_NAMES, q.names, `${quadFacts(q)} Por eso es: ${q.names.join(", ").toLowerCase()}.`, quadVisual(q, r), q.name.toLowerCase());
}

const OTHER_NAMES = ["Paralelogramo", "Rectángulo", "Rombo", "Trapecio"];

// Nombrar cuadriláteros de más de una forma.
export function quadOtherNames(r: Rng): Question {
  const q = r.pick(QUADS.filter((x) => x.names.length > 2));
  const one = q.name.toLowerCase();
  const facts = quadFacts(q).replace("Tiene", `Un ${one} tiene`);
  if (r.chance(0.4)) return multiQ(`¿Qué otros nombres le corresponden a todo ${one}? Selecciona todos.`, OTHER_NAMES, q.names.filter((n) => OTHER_NAMES.includes(n) && n !== q.name), facts, undefined, one);
  const candidate = r.pick(ALL_NAMES.filter((n) => n !== q.name && n !== "Cuadrilátero"));
  return yesNo(`¿Todo ${one} es también un ${candidate.toLowerCase()}?`, q.names.includes(candidate), `${FAMILY_WHY[candidate] ?? "Un cuadrado tiene cuatro lados iguales y cuatro ángulos rectos."} ${facts}`, undefined, one);
}

const DRAW: [string, string][] = [
  ["cuatro lados iguales y cuatro ángulos rectos", "Cuadrado"],
  ["cuatro ángulos rectos y lados de dos medidas distintas", "Rectángulo"],
  ["cuatro lados iguales y ningún ángulo recto", "Rombo"],
  ["dos pares de lados paralelos, sin ángulos rectos y con lados de dos medidas", "Romboide"],
  ["un solo par de lados paralelos", "Trapecio"],
  ["ningún par de lados paralelos", "Trapezoide"],
];

// Dibujar cuadriláteros (¿qué figura hay que dibujar?).
export function drawQuad(r: Rng): Question {
  const [text, answer] = r.pick(DRAW);
  return fixedQ(`${r.pick(NAMES)} debe dibujar un cuadrilátero con ${text}. ¿Qué figura debe dibujar?`, QUADS.map((x) => x.name), answer, `Con ${text} se obtiene ${QUADS.find((x) => x.name === answer)!.article}.`, undefined, answer.toLowerCase());
}

// ---------------------------------------------------------------------------
// Simetría

type Sym = { name: string; points: Pt[]; count: number; axes: { v?: boolean; h?: boolean; d?: boolean } };
const SYM_SHAPES: Sym[] = [
  { name: "cuadrado", points: [[15, 15], [85, 15], [85, 85], [15, 85]], count: 4, axes: { v: true, h: true, d: true } },
  { name: "rectángulo", points: [[5, 25], [95, 25], [95, 75], [5, 75]], count: 2, axes: { v: true, h: true } },
  { name: "triángulo equilátero", points: [[50, 10], [96, 90], [4, 90]], count: 3, axes: { v: true } },
  { name: "triángulo isósceles", points: [[50, 4], [80, 92], [20, 92]], count: 1, axes: { v: true } },
  { name: "triángulo escaleno", points: [[18, 20], [98, 92], [2, 92]], count: 0, axes: {} },
  { name: "rombo", points: [[50, 15], [95, 50], [50, 85], [5, 50]], count: 2, axes: { v: true, h: true } },
  { name: "romboide", points: [[30, 25], [98, 25], [70, 75], [2, 75]], count: 0, axes: {} },
  { name: "trapecio isósceles", points: [[30, 25], [70, 25], [95, 75], [5, 75]], count: 1, axes: { v: true } },
  { name: "flecha", points: [[5, 38], [60, 38], [60, 15], [95, 50], [60, 85], [60, 62], [5, 62]], count: 1, axes: { h: true } },
  { name: "casa", points: [[50, 8], [88, 42], [88, 92], [12, 92], [12, 42]], count: 1, axes: { v: true } },
  { name: "hexágono regular", points: [[27, 10], [73, 10], [96, 50], [73, 90], [27, 90], [4, 50]], count: 6, axes: { v: true, h: true } },
  { name: "trapecio rectángulo", points: [[15, 25], [60, 25], [92, 78], [15, 78]], count: 0, axes: {} },
];
const AXIS: Record<"v" | "h" | "d", [string, [Pt, Pt]]> = { v: ["vertical", [[50, -6], [50, 106]]], h: ["horizontal", [[-10, 50], [110, 50]]], d: ["diagonal", [[4, 4], [96, 96]]] };

// Identificar ejes de simetría.
export function isSymmetryLine(r: Rng): Question {
  const yes = r.chance(0.5);
  const cases = SYM_SHAPES.flatMap((s) => (["v", "h", "d"] as const).map((a) => ({ s, a, ok: !!s.axes[a] }))).filter((c) => c.ok === yes);
  const { s, a } = r.pick(cases);
  return yesNo("¿La línea punteada es un eje de simetría de la figura?", yes, yes ? "Sí: al doblar por la línea, las dos partes coinciden exactamente." : "No: al doblar por la línea, las dos partes no coinciden.", { kind: "polygon", points: s.points, dashed: [AXIS[a][1]] }, AXIS[a][0]);
}

// Trazar ejes de simetría (¿en qué dirección va el eje?).
export function symmetryDirection(r: Rng): Question {
  const single = SYM_SHAPES.filter((s) => s.count === 1);
  const none = SYM_SHAPES.filter((s) => s.count === 0);
  const s = r.chance(0.25) ? r.pick(none) : r.pick(single);
  const turned = r.chance(0.5);
  const mirrored = r.chance(0.5);
  const base = mirrored ? flip(s.points) : s.points;
  // Al girar 90°, un eje vertical pasa a ser horizontal y al revés.
  const answer = s.count === 0 ? "No tiene eje de simetría" : !!s.axes.v !== turned ? "Vertical" : "Horizontal";
  return fixedQ("Vas a trazar el eje de simetría de esta figura. ¿En qué dirección va?", ["Vertical", "Horizontal", "No tiene eje de simetría"], answer, s.count === 0 ? "Ninguna línea divide la figura en dos partes que coincidan." : `El eje es ${answer.toLowerCase()}: divide la figura en dos mitades que coinciden.`, { kind: "polygon", points: turned ? turn(base) : base }, answer.toLowerCase());
}

// Contar ejes de simetría.
export function countSymmetryLines(r: Rng): Question {
  const s = r.pick(SYM_SHAPES);
  return numQ(s.count, `¿Cuántos ejes de simetría tiene este ${s.name}?`.replace("este flecha", "esta flecha").replace("este casa", "esta figura con forma de casa"), { kind: "polygon", points: s.points }, `Un ${s.name} tiene ${s.count} ${s.count === 1 ? "eje" : "ejes"} de simetría.`.replace("Un flecha", "Esta flecha").replace("Un casa", "Esta figura"), s.name);
}
