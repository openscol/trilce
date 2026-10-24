import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, choiceQ, fixedQ, fmt, fmul, fracQ, fshow, mixed, numQ, yesNo } from "./kit";

// Geometría de 6.° en adelante: ángulos, ángulos de polígonos, cuerpos
// geométricos, áreas de paralelogramos, triángulos, trapecios y rombos, área
// de superficie y volumen.

type Pt = [number, number];

// Nombrar ángulos.
export function nameAngles(r: Rng): Question {
  const [a, b, c] = r.pick([["A", "B", "C"], ["P", "Q", "R"], ["M", "N", "O"], ["D", "E", "F"], ["R", "S", "T"], ["X", "Y", "Z"]]);
  const visual: Visual = { kind: "geoFigure", figure: "angulo", labels: [a, b, c], rotation: r.pick([0, 0, 15, -15]) };
  if (r.chance(0.4)) return fixedQ("¿Cuál es el vértice de este ángulo?", [a, b, c], b, `El vértice es el punto donde se unen los dos lados: ${b}.`, visual, "vertice");
  const good = r.pick([`∠${a}${b}${c}`, `∠${c}${b}${a}`]);
  return choiceQ(r, "¿Cómo se nombra este ángulo?", good, [`∠${b}${a}${c}`, `∠${a}${c}${b}`, `∠${b}${c}${a}`, `∠${c}${a}${b}`], `La letra del vértice (${b}) va siempre en el medio: ${good}.`, visual, "nombre");
}

// Ángulos complementarios y suplementarios.
export function complementSupplement(r: Rng): Question {
  const comp = r.chance(0.5);
  const total = comp ? 90 : 180;
  const a = r.int(1, total / 5 - 1) * 5 + r.pick([0, 0, 2, 3]);
  const form = r.int(0, 2);
  if (form === 0) return numQ(total - a, `¿Cuánto mide el ${comp ? "complemento" : "suplemento"} de un ángulo de ${a}°?`, undefined, `Los ángulos ${comp ? "complementarios suman 90°" : "suplementarios suman 180°"}: ${total} − ${a} = ${total - a}°.`, comp ? "complemento" : "suplemento");
  const b = r.chance(0.5) ? total - a : total - a + (total - a > 10 ? r.pick([-10, -5, 5, 10]) : r.pick([5, 10]));
  if (form === 1) return fixedQ(`Dos ángulos miden ${a}° y ${total - a}°. ¿Cómo son?`, ["Complementarios", "Suplementarios", "Ninguno de los dos"], comp ? "Complementarios" : "Suplementarios", `${a} + ${total - a} = ${total}°.`, undefined, "clasificar");
  return yesNo(`¿Dos ángulos de ${a}° y ${b}° son ${comp ? "complementarios" : "suplementarios"}?`, b === total - a, `${a} + ${b} = ${a + b}°; los ${comp ? "complementarios suman 90°" : "suplementarios suman 180°"}.`, undefined, comp ? "complementarios" : "suplementarios");
}

const PAIRS: [string, string, string][] = [
  ["Dos ángulos que suman 90°.", "Complementarios", "Complementarios: suman 90°."],
  ["Dos ángulos que suman 180°.", "Suplementarios", "Suplementarios: suman 180°."],
  ["Dos ángulos que comparten el vértice y un lado, uno junto al otro.", "Adyacentes", "Adyacentes: comparten vértice y un lado."],
  ["Dos ángulos opuestos que se forman cuando dos rectas se cruzan.", "Opuestos por el vértice", "Opuestos por el vértice: quedan frente a frente y miden lo mismo."],
  ["Dos ángulos que tienen exactamente la misma medida.", "Congruentes", "Congruentes: tienen la misma medida."],
  ["Un ángulo de 35° y otro de 55°.", "Complementarios", "35 + 55 = 90°: complementarios."],
  ["Un ángulo de 110° y otro de 70°.", "Suplementarios", "110 + 70 = 180°: suplementarios."],
  ["Los dos ángulos que forman juntos un ángulo recto.", "Complementarios", "Un ángulo recto mide 90°."],
  ["Los dos ángulos que forman juntos una línea recta.", "Suplementarios", "Una línea recta es un ángulo de 180°."],
  ["Dos rectas se cruzan: el ángulo de arriba y el de abajo.", "Opuestos por el vértice", "Quedan frente a frente: opuestos por el vértice."],
  ["Un ángulo de 48° y otro que también mide 48°.", "Congruentes", "Misma medida: congruentes."],
  ["Dos ángulos vecinos que comparten un lado y no se superponen.", "Adyacentes", "Vecinos con un lado en común: adyacentes."],
];
const PAIR_NAMES = ["Complementarios", "Suplementarios", "Adyacentes", "Opuestos por el vértice", "Congruentes"];

// Identificar pares de ángulos.
export function identifyAnglePairs(r: Rng): Question {
  const [text, answer, why] = r.pick(PAIRS);
  return fixedQ("¿Cómo se llaman estos ángulos?", PAIR_NAMES, answer, why, text, answer.toLowerCase());
}

// Hallar medidas de ángulos complementarios, suplementarios, opuestos y adyacentes.
export function anglePairMeasures(r: Rng): Question {
  const a = r.int(4, 34) * 5 + r.pick([0, 1, 2]);
  const form = r.int(0, 3);
  if (form === 0 && a < 90) return numQ(90 - a, `Dos ángulos son complementarios y uno mide ${a}°. ¿Cuánto mide el otro?`, `${a}° + x = 90°`, `90 − ${a} = ${90 - a}°.`, "complementarios");
  if (form === 1) return numQ(180 - a, `Dos ángulos son suplementarios y uno mide ${a}°. ¿Cuánto mide el otro?`, `${a}° + x = 180°`, `180 − ${a} = ${180 - a}°.`, "suplementarios");
  if (form === 2) return numQ(a, `Dos rectas se cruzan. Uno de los ángulos mide ${a}°. ¿Cuánto mide su opuesto por el vértice?`, undefined, `Los ángulos opuestos por el vértice son congruentes: ${a}°.`, "opuestos");
  return numQ(180 - a, `Dos rectas se cruzan y uno de los ángulos mide ${a}°. ¿Cuánto mide el ángulo adyacente (el vecino)?`, undefined, `Los vecinos forman una línea recta: 180 − ${a} = ${180 - a}°.`, "adyacentes");
}

// Desigualdad triangular.
export function triangleInequality(r: Rng): Question {
  const a = r.int(2, 15);
  const b = r.int(2, 15);
  const yes = r.chance(0.5);
  const c = yes ? r.int(Math.abs(a - b) + 1, a + b - 1) : r.chance(0.5) ? a + b + r.int(0, 5) : Math.max(1, Math.abs(a - b) - r.int(0, 2));
  const sides = [a, b, c].sort((x, y) => x - y);
  const ok = sides[0] + sides[1] > sides[2];
  return yesNo(`¿Se puede formar un triángulo con lados de ${a} cm, ${b} cm y ${c} cm?`, ok, `Los dos lados menores deben sumar más que el mayor: ${sides[0]} + ${sides[1]} = ${sides[0] + sides[1]}, que ${ok ? "sí" : "no"} es mayor que ${sides[2]}.`);
}

// Ángulos que faltan en triángulos, cuadriláteros y polígonos.
export function missingAngle(r: Rng, kind: "triangle" | "special" | "quad" | "polygon"): Question {
  if (kind === "triangle") {
    const a = r.int(4, 22) * 5;
    const b = r.int(4, Math.floor((170 - a) / 5)) * 5;
    return numQ(180 - a - b, `Dos ángulos de un triángulo miden ${a}° y ${b}°. ¿Cuánto mide el tercero?`, `${a}° + ${b}° + x = 180°`, `Los ángulos de un triángulo suman 180°: 180 − ${a} − ${b} = ${180 - a - b}°.`);
  }
  if (kind === "special") {
    const form = r.int(0, 3);
    if (form === 0) return numQ(60, "¿Cuánto mide cada ángulo de un triángulo equilátero?", undefined, "Los tres son iguales: 180 ÷ 3 = 60°.", "equilatero");
    if (form === 1) {
      const top = r.int(2, 16) * 10;
      return numQ((180 - top) / 2, `En un triángulo isósceles, el ángulo desigual mide ${top}°. ¿Cuánto mide cada uno de los otros dos?`, undefined, `Los dos son iguales: (180 − ${top}) ÷ 2 = ${(180 - top) / 2}°.`, "isosceles");
    }
    if (form === 2) {
      const base = r.int(4, 17) * 5;
      return numQ(180 - 2 * base, `En un triángulo isósceles, cada uno de los dos ángulos iguales mide ${base}°. ¿Cuánto mide el tercero?`, undefined, `180 − ${base} − ${base} = ${180 - 2 * base}°.`, "isosceles");
    }
    const a = r.int(2, 16) * 5;
    return numQ(90 - a, `En un triángulo rectángulo, uno de los ángulos agudos mide ${a}°. ¿Cuánto mide el otro?`, undefined, `El recto mide 90°, así que los otros dos suman 90°: 90 − ${a} = ${90 - a}°.`, "rectangulo");
  }
  if (kind === "quad") {
    const [a, b, c] = [r.int(12, 24) * 5, r.int(12, 24) * 5, r.int(10, 20) * 5];
    if (360 - a - b - c < 20) return missingAngle(r, kind);
    return numQ(360 - a - b - c, `Tres ángulos de un cuadrilátero miden ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto?`, `${a}° + ${b}° + ${c}° + x = 360°`, `Los ángulos de un cuadrilátero suman 360°: 360 − ${a} − ${b} − ${c} = ${360 - a - b - c}°.`);
  }
  const n = r.int(3, 10);
  const name = ["", "", "", "triángulo", "cuadrilátero", "pentágono", "hexágono", "heptágono", "octágono", "eneágono", "decágono"][n];
  const total = (n - 2) * 180;
  if (r.chance(0.6)) return numQ(total, `¿Cuánto suman los ángulos interiores de un ${name}?`, "Suma = (número de lados − 2) × 180°", `(${n} − 2) × 180 = ${fmt(total)}°.`, "suma");
  const regular = [3, 4, 5, 6, 8, 9, 10].includes(n) ? n : 6;
  return numQ(((regular - 2) * 180) / regular, `¿Cuánto mide cada ángulo interior de un polígono regular de ${regular} lados?`, "Suma = (número de lados − 2) × 180°", `Suman ${(regular - 2) * 180}°; como son ${regular} ángulos iguales: ${(regular - 2) * 180} ÷ ${regular} = ${((regular - 2) * 180) / regular}°.`, "cada-angulo");
}

// ---------------------------------------------------------------------------
// Cuerpos geométricos

const SOLIDS: { name: string; poly: boolean; faces: number; edges: number; vertices: number; clue: string }[] = [
  { name: "cubo", poly: true, faces: 6, edges: 12, vertices: 8, clue: "Tiene 6 caras cuadradas iguales." },
  { name: "prisma rectangular", poly: true, faces: 6, edges: 12, vertices: 8, clue: "Tiene 6 caras rectangulares, iguales de dos en dos." },
  { name: "pirámide cuadrada", poly: true, faces: 5, edges: 8, vertices: 5, clue: "Tiene una base cuadrada y 4 caras triangulares que se unen en una punta." },
  { name: "pirámide triangular", poly: true, faces: 4, edges: 6, vertices: 4, clue: "Tiene 4 caras, todas triangulares." },
  { name: "prisma triangular", poly: true, faces: 5, edges: 9, vertices: 6, clue: "Tiene 2 bases triangulares y 3 caras rectangulares." },
  { name: "cilindro", poly: false, faces: 0, edges: 0, vertices: 0, clue: "Tiene 2 bases circulares y una superficie curva." },
  { name: "cono", poly: false, faces: 0, edges: 0, vertices: 0, clue: "Tiene una base circular y termina en una punta." },
  { name: "esfera", poly: false, faces: 0, edges: 0, vertices: 0, clue: "No tiene caras planas ni aristas: es toda curva." },
];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const the = (name: string) => (/^(pirámide|esfera)/.test(name) ? `la ${name}` : `el ${name}`);

// Identificar poliedros.
export function identifyPolyhedra(r: Rng): Question {
  const yes = r.chance(0.5);
  const s = r.pick(SOLIDS.filter((x) => x.poly === yes));
  return yesNo("¿Este cuerpo es un poliedro?", yes, yes ? `Sí: todas las caras de ${the(s.name)} son planas (polígonos).`.replace(" de el ", " del ") : `No: ${the(s.name)} tiene una superficie curva.`, { kind: "solids", names: [s.name] }, s.name);
}

// ¿qué figura se describe?
export function describedSolid(r: Rng): Question {
  const s = r.pick(SOLIDS);
  const clue = s.poly && r.chance(0.5) ? `Tiene ${s.faces} caras, ${s.edges} aristas y ${s.vertices} vértices${s.name === "cubo" ? ", y todas sus caras son cuadrados" : s.name === "prisma rectangular" ? ", y sus caras son rectángulos" : ""}.` : s.clue;
  const pool = SOLIDS.filter((x) => x.name !== s.name);
  return choiceQ(r, `¿Qué cuerpo geométrico se describe? «${clue}»`, cap(s.name), pool.map((x) => cap(x.name)), `Es ${the(s.name)}.`, undefined, s.name);
}

// Vistas de frente, de lado y desde arriba.
export function solidViews(r: Rng): Question {
  const rows = r.int(2, 3);
  const cols = r.int(2, 3);
  const top = r.int(2, 3);
  const grid: number[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      const limit = Math.min(i > 0 ? grid[i - 1][j] : top, j > 0 ? grid[i][j - 1] : top);
      grid[i].push(i === 0 && j === 0 ? top : r.int(Math.max(0, limit - 1), limit));
    }
  }
  const visual: Visual = { kind: "cubes3d", heights: grid };
  const view = r.pick(["arriba", "frente", "lado"] as const);
  const fromTop = grid.flat().filter((h) => h > 0).length;
  // De frente se ve, por cada columna, la pila más alta; de lado, por cada fila.
  const fromFront = Array.from({ length: cols }, (_, j) => Math.max(...grid.map((row) => row[j]))).reduce((a, b) => a + b, 0);
  const fromSide = grid.map((row) => Math.max(...row)).reduce((a, b) => a + b, 0);
  const answer = view === "arriba" ? fromTop : view === "frente" ? fromFront : fromSide;
  const why = view === "arriba" ? "Desde arriba se ve un cuadrado por cada pila." : view === "frente" ? "De frente se ve, en cada columna, la altura de la pila más alta." : "De lado se ve, en cada fila, la altura de la pila más alta.";
  return numQ(answer, `Si miras la figura ${view === "arriba" ? "desde arriba" : view === "frente" ? "de frente" : "de lado"}, ¿cuántos cuadrados ves en esa vista?`, visual, `${why} Son ${answer}.`, view);
}

// ---------------------------------------------------------------------------
// Áreas

const dash = (a: Pt, b: Pt): [Pt, Pt] => [a, b];
const PARALLELOGRAM: Visual = { kind: "polygon", points: [[28, 25], [98, 25], [72, 78], [2, 78]], dashed: [dash([28, 25], [28, 78])] };
const TRIANGLE: Visual = { kind: "polygon", points: [[38, 15], [96, 82], [4, 82]], dashed: [dash([38, 15], [38, 82])] };
const TRAPEZOID: Visual = { kind: "polygon", points: [[30, 25], [72, 25], [96, 78], [4, 78]], dashed: [dash([30, 25], [30, 78])] };
const RHOMBUS: Visual = { kind: "polygon", points: [[50, 10], [92, 50], [50, 90], [8, 50]], dashed: [dash([50, 10], [50, 90]), dash([8, 50], [92, 50])] };

export type AreaShape = "parallelogram" | "triangle" | "trapezoid" | "rhombus";

// Áreas de paralelogramos, triángulos, trapecios y rombos.
// `understand`: la pregunta guía el porqué de la fórmula.
export function shapeArea(r: Rng, shapes: AreaShape[], understand = false): Question {
  const shape = r.pick(shapes);
  const u = r.pick(["cm", "m"]);
  const b = r.int(3, 20);
  const h = r.int(2, 16);
  if (shape === "parallelogram") {
    if (understand) return numQ(b * h, `Si al paralelogramo se le corta el triángulo de un lado y se pasa al otro, queda un rectángulo de ${b} ${u} de base y ${h} ${u} de altura. ¿Cuál es el área del paralelogramo, en ${u}²?`, PARALLELOGRAM, `El área no cambia al mover el triángulo: base × altura = ${b} × ${h} = ${b * h} ${u}².`, shape);
    return numQ(b * h, `El paralelogramo tiene ${b} ${u} de base y ${h} ${u} de altura (la línea punteada). ¿Cuál es su área, en ${u}²?`, PARALLELOGRAM, `A = base × altura = ${b} × ${h} = ${b * h} ${u}² (la altura, no el lado inclinado).`, shape);
  }
  if (shape === "triangle") {
    const hh = (b * h) % 2 === 0 ? h : h + 1;
    if (understand) return numQ((b * hh) / 2, `Dos triángulos iguales forman un paralelogramo de ${b} ${u} de base y ${hh} ${u} de altura. ¿Cuál es el área de uno de los triángulos, en ${u}²?`, TRIANGLE, `El paralelogramo mide ${b} × ${hh} = ${b * hh}; el triángulo es la mitad: ${(b * hh) / 2} ${u}².`, shape);
    return numQ((b * hh) / 2, `El triángulo tiene ${b} ${u} de base y ${hh} ${u} de altura (la línea punteada). ¿Cuál es su área, en ${u}²?`, TRIANGLE, `A = base × altura ÷ 2 = ${b} × ${hh} ÷ 2 = ${(b * hh) / 2} ${u}².`, shape);
  }
  if (shape === "trapezoid") {
    const small = r.int(2, b - 1);
    const hh = ((b + small) * h) % 2 === 0 ? h : h + 1;
    const area = ((b + small) * hh) / 2;
    if (understand) return numQ(area, `Dos trapecios iguales forman un paralelogramo de base ${b} + ${small} = ${b + small} ${u} y altura ${hh} ${u}. ¿Cuál es el área de uno de los trapecios, en ${u}²?`, TRAPEZOID, `El paralelogramo mide ${b + small} × ${hh} = ${(b + small) * hh}; el trapecio es la mitad: ${area} ${u}².`, shape);
    return numQ(area, `El trapecio tiene bases de ${b} ${u} y ${small} ${u}, y ${hh} ${u} de altura. ¿Cuál es su área, en ${u}²?`, TRAPEZOID, `A = (base mayor + base menor) × altura ÷ 2 = (${b} + ${small}) × ${hh} ÷ 2 = ${area} ${u}².`, shape);
  }
  const d1 = r.int(3, 18);
  const d2 = (d1 * h) % 2 === 0 ? h : h + 1;
  return numQ((d1 * d2) / 2, `Las diagonales del rombo miden ${d1} ${u} y ${d2} ${u}. ¿Cuál es su área, en ${u}²?`, RHOMBUS, `A = diagonal × diagonal ÷ 2 = ${d1} × ${d2} ÷ 2 = ${(d1 * d2) / 2} ${u}².`, shape);
}

// Área de figuras compuestas con triángulos (un rectángulo con un techo triangular).
export function compoundWithTriangle(r: Rng): Question {
  const w = r.int(2, 9) * 2;
  const h = r.int(3, 10);
  const roof = r.int(2, 8);
  const visual: Visual = { kind: "polygon", points: [[50, 6], [90, 40], [90, 92], [10, 92], [10, 40]], dashed: [dash([10, 40], [90, 40]), dash([50, 6], [50, 40])] };
  const area = w * h + (w * roof) / 2;
  return numQ(area, `La figura es un rectángulo de ${w} m de ancho y ${h} m de alto, con un triángulo encima de ${w} m de base y ${roof} m de altura. ¿Cuál es el área total, en m²?`, visual, `Rectángulo: ${w} × ${h} = ${w * h}; triángulo: ${w} × ${roof} ÷ 2 = ${(w * roof) / 2}; total ${area} m².`);
}

// Área entre dos triángulos.
export function areaBetweenTriangles(r: Rng): Question {
  const B = r.int(5, 12) * 2;
  const H = r.int(4, 12);
  const b = r.int(1, B / 2 - 1) * 2;
  const h = r.int(1, H - 1);
  return numQ((B * H) / 2 - (b * h) / 2, `Un triángulo grande tiene ${B} cm de base y ${H} cm de altura. Dentro hay un triángulo pequeño de ${b} cm de base y ${h} cm de altura. ¿Cuál es el área de la parte que queda entre los dos, en cm²?`, undefined, `Grande: ${B} × ${H} ÷ 2 = ${(B * H) / 2}; pequeño: ${b} × ${h} ÷ 2 = ${(b * h) / 2}; diferencia ${(B * H) / 2 - (b * h) / 2} cm².`);
}

// Áreas de cuadriláteros y triángulos en problemas.
export function areaWordProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  const b = r.int(2, 12) * 2;
  const h = r.int(3, 15);
  const cases: [string, number, string][] = [
    [`${name} corta una vela triangular de ${b} m de base y ${h} m de altura. ¿Cuántos metros cuadrados de tela tiene la vela?`, (b * h) / 2, `${b} × ${h} ÷ 2`],
    [`Un jardín tiene forma de paralelogramo de ${b} m de base y ${h} m de altura. ¿Cuál es su área, en m²?`, b * h, `${b} × ${h}`],
    [`Una cometa tiene forma de rombo con diagonales de ${b} cm y ${h * 2} cm. ¿Cuál es su área, en cm²?`, b * h, `${b} × ${h * 2} ÷ 2`],
    [`Una pared triangular mide ${b} m de base y ${h} m de altura. Cada lata de pintura cubre ${b / 2} m². ¿Cuántas latas se necesitan para pintarla?`, h, `Área: ${b} × ${h} ÷ 2 = ${(b * h) / 2}; ${(b * h) / 2} ÷ ${b / 2}`],
  ];
  const [text, answer, why] = r.pick(cases);
  return numQ(answer, text, undefined, `${why} = ${answer}.`);
}

// Área de polígonos.
export function polygonAreaReview(r: Rng): Question {
  return r.pick([() => shapeArea(r, ["parallelogram", "triangle", "trapezoid", "rhombus"]), () => compoundWithTriangle(r), () => areaWordProblem(r), () => areaBetweenTriangles(r)])();
}

// ---------------------------------------------------------------------------
// Área de superficie y volumen

// Volumen de cubos y prismas con lados fraccionarios.
export function fractionVolume(r: Rng): Question {
  const d = r.pick([2, 3, 4]);
  const a: Frac = r.chance(0.5) ? [r.int(1, 2) * d + r.int(1, d - 1), d] : [r.int(1, d - 1), d];
  const l = r.int(2, 8);
  const w = r.int(2, 6);
  const v = fmul(fmul(a, [l, 1]), [w, 1]);
  const text = mixed(a[0], a[1]);
  return fracQ(r, `Un prisma rectangular mide ${l} m de largo, ${w} m de ancho y ${text} m de altura. ¿Cuál es su volumen, en m³?`, v, `${l} × ${w} = ${l * w}; ${l * w} × ${text} = ${fshow(v)} m³.`, undefined, undefined, [fmul(a, [l + w, 1]), [l * w + a[0], a[1]]]);
}

// Área de superficie de cubos y prismas rectangulares.
export function surfaceAreaPrism(r: Rng): Question {
  if (r.chance(0.3)) {
    const s = r.int(2, 12);
    return numQ(6 * s * s, `Un cubo tiene aristas de ${s} cm. ¿Cuál es su área de superficie, en cm²?`, undefined, `Cada cara mide ${s} × ${s} = ${s * s} y son 6 caras: 6 × ${s * s} = ${fmt(6 * s * s)} cm².`, "cubo");
  }
  const [l, w, h] = [r.int(3, 12), r.int(2, 9), r.int(2, 8)];
  const area = 2 * (l * w + l * h + w * h);
  return numQ(area, `Un prisma rectangular mide ${l} cm de largo, ${w} cm de ancho y ${h} cm de altura. ¿Cuál es su área de superficie, en cm²?`, undefined, `Tres pares de caras: 2 × (${l} × ${w} + ${l} × ${h} + ${w} × ${h}) = 2 × ${l * w + l * h + w * h} = ${fmt(area)} cm².`, "prisma");
}

const TRIPLES: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];

// Volumen y área de superficie de prismas triangulares (base: triángulo rectángulo).
export function triangularPrism(r: Rng, what: "volumen" | "superficie"): Question {
  const [a, b, c] = r.pick(TRIPLES);
  const len = r.int(3, 12);
  const base = (a * b) / 2;
  if (what === "volumen") return numQ(base * len, `Un prisma triangular tiene como base un triángulo rectángulo de catetos ${a} cm y ${b} cm, y mide ${len} cm de largo. ¿Cuál es su volumen, en cm³?`, { kind: "solids", names: ["prisma triangular"] }, `Área de la base: ${a} × ${b} ÷ 2 = ${base}; volumen = ${base} × ${len} = ${fmt(base * len)} cm³.`);
  const area = 2 * base + (a + b + c) * len;
  return numQ(area, `Un prisma triangular tiene como base un triángulo rectángulo de lados ${a} cm, ${b} cm y ${c} cm, y mide ${len} cm de largo. ¿Cuál es su área de superficie, en cm²?`, { kind: "solids", names: ["prisma triangular"] }, `Dos bases: 2 × (${a} × ${b} ÷ 2) = ${2 * base}; tres rectángulos: (${a} + ${b} + ${c}) × ${len} = ${(a + b + c) * len}; total ${fmt(area)} cm².`);
}

// Área de superficie de pirámides (base cuadrada).
export function surfaceAreaPyramid(r: Rng): Question {
  const s = r.int(2, 12);
  const slant = r.int(3, 15);
  const area = s * s + 2 * s * slant;
  return numQ(area, `Una pirámide tiene una base cuadrada de ${s} cm de lado. Cada cara triangular tiene ${s} cm de base y ${slant} cm de altura. ¿Cuál es su área de superficie, en cm²?`, { kind: "solids", names: ["pirámide cuadrada"] }, `Base: ${s} × ${s} = ${s * s}; cuatro triángulos: 4 × (${s} × ${slant} ÷ 2) = ${2 * s * slant}; total ${fmt(area)} cm².`);
}

// Relacionar volumen y área de superficie.
export function volumeSurfaceRelation(r: Rng): Question {
  const s = r.int(2, 9);
  const form = r.int(0, 2);
  if (form === 0) return numQ(6 * s * s, `Un cubo tiene un volumen de ${fmt(s ** 3)} cm³. ¿Cuál es su área de superficie, en cm²?`, undefined, `La arista mide ${s} cm (${s} × ${s} × ${s} = ${fmt(s ** 3)}); área: 6 × ${s * s} = ${fmt(6 * s * s)} cm².`, "de-volumen-a-area");
  if (form === 1) return numQ(s ** 3, `Un cubo tiene un área de superficie de ${fmt(6 * s * s)} cm². ¿Cuál es su volumen, en cm³?`, undefined, `Cada cara mide ${fmt(6 * s * s)} ÷ 6 = ${s * s} cm², así que la arista es ${s} cm; volumen: ${fmt(s ** 3)} cm³.`, "de-area-a-volumen");
  const [l, w, h] = [r.int(2, 6), r.int(2, 5), r.int(2, 4)];
  const what = r.chance(0.5);
  return fixedQ(`Para saber cuánto ${what ? "papel hace falta para forrar una caja" : "arroz cabe en una caja"} de ${l} cm × ${w} cm × ${h} cm, ¿qué se calcula?`, ["El volumen de la caja", "El área de superficie", "El perímetro de la base"], what ? "El área de superficie" : "El volumen de la caja", what ? `Forrar es cubrir las caras: área de superficie = ${2 * (l * w + l * h + w * h)} cm².` : `Lo que cabe adentro es el volumen: ${l * w * h} cm³.`, undefined, what ? "superficie" : "volumen");
}
