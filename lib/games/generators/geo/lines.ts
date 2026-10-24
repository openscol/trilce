import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { choiceQ, fixedQ, fmt, intQ, numQ, sg, yesNo } from "../kit";
import { pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { dec, line10, valQ } from "../alg1/util";

// Geometría: puntos, segmentos y planos; ángulos; rectas en el espacio y en
// el plano; triángulos; polígonos; simetría.

// ---------------------------------------------------------------------------
// Puntos, rectas y planos

const PLANE_FACTS: [string, boolean, string][] = [
  ["Por dos puntos distintos pasa exactamente una recta.", true, "Es un postulado: dos puntos determinan una recta."],
  ["Por tres puntos no alineados pasa exactamente un plano.", true, "Tres puntos no colineales determinan un plano."],
  ["Si dos planos distintos se cortan, su intersección es una recta.", true, "Dos planos que se cortan lo hacen en una recta."],
  ["Si dos rectas distintas se cortan, su intersección es un punto.", true, "Dos rectas distintas tienen a lo más un punto en común."],
  ["Por tres puntos cualesquiera pasa siempre una recta.", false, "Solo si los tres puntos están alineados (son colineales)."],
  ["Un plano contiene exactamente tres puntos.", false, "Un plano contiene infinitos puntos."],
  ["Si dos puntos están en un plano, la recta que pasa por ellos también está en ese plano.", true, "Es un postulado de los planos."],
  ["Dos rectas que no se cortan siempre son paralelas.", false, "Pueden ser alabeadas: no se cortan y no están en el mismo plano."],
  ["Por un punto pasan infinitas rectas.", true, "Por un punto se pueden trazar todas las rectas que se quiera."],
];
// Propiedades de planos, rectas y puntos.
export function planeFacts(r: Rng): Question {
  const [text, ok, why] = r.pick(PLANE_FACTS);
  return fixedQ(`¿Es verdadera o falsa? ${text}`, ["Verdadera", "Falsa"], ok ? "Verdadera" : "Falsa", why, undefined, ok ? "verdadera" : "falsa");
}

const INTERSECTIONS: [string, string, string[]][] = [
  ["dos rectas distintas que se cortan", "Un punto", ["Una recta", "Dos puntos", "Un plano"]],
  ["dos planos distintos que se cortan", "Una recta", ["Un punto", "Un segmento", "Un plano"]],
  ["una recta y un plano que la corta (sin contenerla)", "Un punto", ["Una recta", "Un plano", "Dos puntos"]],
  ["dos rectas paralelas", "No tienen puntos en común", ["Un punto", "Una recta", "Dos puntos"]],
  ["una recta contenida en un plano y ese plano", "La misma recta", ["Un punto", "Ningún punto", "Dos rectas"]],
];
// Describir intersecciones.
export function intersections(r: Rng): Question {
  const [what, good, wrong] = r.pick(INTERSECTIONS);
  return choiceQ(r, `¿Cuál es la intersección de ${what}?`, good, wrong, `La intersección de ${what} es: ${good.toLowerCase()}.`, undefined, "interseccion");
}

// Longitudes de segmentos en la recta numérica.
export function segmentOnLine(r: Rng): Question {
  const a = r.int(-9, 5), b = r.int(a + 2, 10);
  return numQ(b - a, "¿Cuánto mide el segmento entre los dos puntos marcados?", line10({ dots: [a, b] }), `|${sg(b)} − ${a < 0 ? `(${sg(a)})` : a}| = ${b - a}.`, "recta");
}

// Propiedad aditiva de la longitud (postulado de la suma de segmentos).
export function segmentAddition(r: Rng): Question {
  const x = r.int(2, 9), a = r.int(2, 5), b = r.int(1, 8) * r.pick([1, -1]), c = r.int(1, 4), d = r.int(1, 9) * r.pick([1, -1]);
  const AB = a * x + b, BC = c * x + d;
  if (AB <= 0 || BC <= 0) return segmentAddition(r);
  const ask = r.int(0, 1);
  const lin2 = (k: number, m: number) => `${k === 1 ? "" : k}x${m ? ` ${m < 0 ? "−" : "+"} ${Math.abs(m)}` : ""}`;
  const prompt = `B está entre A y C. AB = ${lin2(a, b)}, BC = ${lin2(c, d)} y AC = ${AB + BC}. ${ask ? "¿Cuánto mide AB?" : "¿Cuánto vale x?"}`;
  const why = `AB + BC = AC: ${lin2(a + c, b + d)} = ${AB + BC} → x = ${x}${ask ? `; AB = ${a} × ${x} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${AB}` : ""}.`;
  return numQ(ask ? AB : x, prompt, undefined, why, "suma");
}

// Puntos medios.
export function midpointSegment(r: Rng): Question {
  const x = r.int(2, 9), a = r.int(3, 6), c = r.int(1, a - 1), b = r.int(1, 5) * r.pick([1, -1]);
  const d = a * x + b - c * x;
  if (a * x + b <= 0 || d === 0) return midpointSegment(r);
  const half = a * x + b;
  const askWhole = r.chance(0.5);
  return numQ(askWhole ? 2 * half : x, `M es el punto medio de AB. AM = ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} y MB = ${c === 1 ? "" : c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}. ${askWhole ? "¿Cuánto mide AB?" : "¿Cuánto vale x?"}`.replace(" + 0", "").replace(" − 0", ""), undefined, `AM = MB: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c === 1 ? "" : c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)} → x = ${x}.${askWhole ? ` AM = ${half}, así que AB = ${2 * half}.` : ""}`, "punto-medio");
}

// Promedios ponderados en la recta numérica.
export function weightedPoint(r: Rng): Question {
  const a = r.int(-8, 0), b = r.int(a + 4, 10), wa = r.int(1, 4), wb = r.int(1, 4);
  const v = (wa * a + wb * b) / (wa + wb);
  return valQ(r, `En una recta numérica hay ${wa} ${wa === 1 ? "ficha" : "fichas"} en ${sg(a)} y ${wb} ${wb === 1 ? "ficha" : "fichas"} en ${sg(b)}. ¿Cuál es la posición promedio (promedio ponderado) de todas las fichas?`, Math.round(v * 100) / 100, [(a + b) / 2, Math.round(((wb * a + wa * b) / (wa + wb)) * 100) / 100, Math.round(v) + 1, Math.round(v) - 1, (wa * a + wb * b) / 2], `(${wa} × ${sg(a)} + ${wb} × ${sg(b)}) ÷ ${wa + wb} = ${dec(Math.round(v * 100) / 100)}.`, line10({ dots: [a, b] }), "ponderado");
}

// Distancias fraccionarias en la recta numérica.
export function fractionalDistance(r: Rng): Question {
  const [n, d] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
  const len = d * r.int(1, 4), a = r.int(-10, 10 - len);
  const b = a + len;
  const p = a + (len * n) / d;
  return intQ(r, `En la recta numérica, A está en ${sg(a)} y B en ${sg(b)}. ¿En qué número está el punto que se encuentra a ${n}/${d} del camino de A hacia B?`, p, `AB mide ${len}; ${n}/${d} de ${len} es ${(len * n) / d}: ${sg(a)} + ${(len * n) / d} = ${sg(p)}.`, line10({ dots: [a, b] }), "fraccion", [b - (len * n) / d, a + n, (a + b) / 2 === Math.round((a + b) / 2) ? (a + b) / 2 : p + 1]);
}

// Segmentos congruentes (en el plano).
export function congruentSegments(r: Rng): Question {
  const [a, b] = r.pick([[3, 4], [6, 8], [5, 12], [0, 5], [4, 0], [0, 3]]);
  const A = { x: r.int(-6, 0), y: r.int(-6, 0) };
  const B = { x: A.x + a, y: A.y + b };
  const yes = r.chance(0.5);
  const C = { x: r.int(-6, 0), y: r.int(0, 2) };
  const [c2, d2] = yes ? r.pick([[a, b], [b, a], [-a, b]]) : [a + 1, b];
  const D = { x: C.x + c2, y: C.y + d2 };
  const len = (P: typeof A, Q: typeof A) => Math.hypot(P.x - Q.x, P.y - Q.y);
  return yesNo(`¿Son congruentes los segmentos AB, con A${pt(A)} y B${pt(B)}, y CD, con C${pt(C)} y D${pt(D)}?`, yes, `AB = √(${a}² + ${b}²) = ${dec(Math.round(len(A, B) * 100) / 100)} y CD = ${dec(Math.round(len(C, D) * 100) / 100)}${yes ? ": miden lo mismo." : ": no miden lo mismo."}`, undefined, yes ? "si" : "no");
}

// Teorema de la mediatriz.
export function perpBisectorTheorem(r: Rng): Question {
  const x = r.int(2, 9), a = r.int(2, 6), c = r.int(1, a - 1), b = r.int(-5, 6);
  const d = (a - c) * x + b;
  if (d <= 0 || b === 0) return perpBisectorTheorem(r);
  return numQ(x, `P está en la mediatriz de AB. PA = ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} y PB = ${c === 1 ? "" : c}x + ${d}. ¿Cuánto vale x?`.replace(" + 0", "").replace(" − 0", ""), undefined, `Todo punto de la mediatriz equidista de A y B: PA = PB → x = ${x}.`, "mediatriz");
}

// Dividir un segmento en una razón dada.
export function partitionSegment(r: Rng): Question {
  const [m, n] = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 1]]);
  const k = m + n;
  const A = { x: r.int(-8, 2), y: r.int(-8, 2) };
  const B = { x: A.x + k * r.pick([1, 2, -1]), y: A.y + k * r.pick([1, 2]) };
  const P = { x: A.x + ((B.x - A.x) * m) / k, y: A.y + ((B.y - A.y) * m) / k };
  return pointQ(r, `A${pt(A)} y B${pt(B)}. ¿Qué punto P divide a AB en la razón AP : PB = ${m} : ${n}?`, P, `P está a ${m}/${k} del camino de A a B: (${sg(A.x)} + ${m}/${k} × ${sg(B.x - A.x)}, ${sg(A.y)} + ${m}/${k} × ${sg(B.y - A.y)}) = ${pt(P)}.`, undefined, "razon", [{ x: A.x + ((B.x - A.x) * n) / k, y: A.y + ((B.y - A.y) * n) / k }]);
}

// Distancia al origen en tres dimensiones.
export function distance3D(r: Rng): Question {
  const [a, b, c, d] = r.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [4, 8, 8, 12], [2, 10, 11, 15]]);
  const s = [a * r.pick([1, -1]), b * r.pick([1, -1]), c * r.pick([1, -1])];
  const [x, y, z] = r.shuffle(s);
  return numQ(d, `¿A qué distancia del origen está el punto (${sg(x)}, ${sg(y)}, ${sg(z)})?`, undefined, `d = √(x² + y² + z²) = √(${x * x} + ${y * y} + ${z * z}) = √${d * d} = ${d}.`, "3d");
}

// ---------------------------------------------------------------------------
// Ángulos

// Vocabulario de ángulos.
export function angleVocabulary(r: Rng): Question {
  const [A, B, C] = r.shuffle(["P", "Q", "R", "S", "T", "M", "N", "K"]).slice(0, 3);
  const form = r.int(0, 2);
  if (form === 0) return fixedQ(`¿Cuál es el vértice del ángulo ∠${A}${B}${C}?`, [A, B, C], B, "En el nombre de un ángulo de tres letras, el vértice es la letra del medio.", undefined, "vertice");
  if (form === 1) return choiceQ(r, `¿Cuáles son los lados del ángulo ∠${A}${B}${C}?`, `Las semirrectas ${B}${A} y ${B}${C}`, [`Las semirrectas ${A}${B} y ${C}${B}`, `Los segmentos ${A}${C} y ${B}${C}`, `Las semirrectas ${A}${C} y ${A}${B}`], `Los lados salen del vértice ${B}: ${B}${A} y ${B}${C}.`, undefined, "lados");
  return choiceQ(r, `¿Qué otro nombre tiene el ángulo ∠${A}${B}${C}?`, `∠${C}${B}${A}`, [`∠${A}${C}${B}`, `∠${B}${A}${C}`, `∠${C}${A}${B}`], `Se puede nombrar en cualquier orden, siempre con el vértice ${B} en el medio.`, undefined, "nombre");
}

// ---------------------------------------------------------------------------
// Rectas en el espacio (cubo ABCD-EFGH)

const CUBE: Record<string, [number, number, number]> = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
const EDGES = ["AB", "BC", "CD", "DA", "EF", "FG", "GH", "HE", "AE", "BF", "CG", "DH"];
const REL = ["Paralelas", "Se cortan", "Alabeadas"];
// Rectas paralelas, secantes y alabeadas (en un cubo).
export function skewLines(r: Rng): Question {
  const [e1, e2] = r.shuffle(EDGES).slice(0, 2);
  const dir = (e: string) => CUBE[e[1]].map((v, i) => v - CUBE[e[0]][i]);
  const d1 = dir(e1), d2 = dir(e2);
  const parallel = d1.every((v, i) => v * d2[(i + 1) % 3] === d2[i] * d1[(i + 1) % 3]) && d1.every((v, i) => v * d2[(i + 2) % 3] === d2[i] * d1[(i + 2) % 3]);
  const share = [...e1].some((c) => e2.includes(c));
  const k = parallel ? 0 : share ? 1 : 2;
  return fixedQ(`En el cubo ABCD-EFGH (ABCD es la base y E, F, G, H están encima de A, B, C, D), ¿cómo son las rectas ${e1} y ${e2}?`, REL, REL[k], ["Tienen la misma dirección y están en un mismo plano: son paralelas.", `Comparten el vértice ${[...e1].find((c) => e2.includes(c))}: se cortan.`, "No se cortan y no están en un mismo plano: son alabeadas."][k], undefined, ["paralelas", "secantes", "alabeadas"][k]);
}

// ---------------------------------------------------------------------------
// Rectas en el plano: distancias

// Distancia de un punto a una recta.
export function pointLineDistance(r: Rng): Question {
  const [A, B, n] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [1, 0, 1], [0, 1, 1], [8, 6, 10]]);
  const P = { x: r.int(-5, 5), y: r.int(-5, 5) };
  const d = r.int(1, 6);
  const C = A * P.x + B * P.y - d * n * r.pick([1, -1]);
  const eq = `${A ? `${A === 1 ? "" : A}x` : ""}${A && B ? " + " : ""}${B ? `${B === 1 ? "" : B}y` : ""} = ${sg(C)}`;
  return numQ(d, `¿Cuál es la distancia del punto ${pt(P)} a la recta ${eq}?`, undefined, `d = |Ax₀ + By₀ − C| ÷ √(A² + B²) = |${sg(A * P.x + B * P.y)} − ${C < 0 ? `(${sg(C)})` : C}| ÷ ${n} = ${d}.`, "punto-recta");
}

// Distancia entre dos rectas paralelas.
export function parallelDistance(r: Rng): Question {
  const [A, B, n] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10], [0, 1, 1]]);
  const C1 = r.int(-20, 20), d = r.int(1, 5);
  const C2 = C1 + d * n * r.pick([1, -1]);
  const eq = (C: number) => `${A === 0 ? "" : `${A}x + `}${B === 1 ? "" : B}y = ${sg(C)}`;
  return numQ(d, `¿Cuál es la distancia entre las rectas paralelas ${eq(C1)} y ${eq(C2)}?`, undefined, `d = |C₁ − C₂| ÷ √(A² + B²) = |${sg(C1)} − ${C2 < 0 ? `(${sg(C2)})` : C2}| ÷ ${n} = ${d}.`, "paralelas");
}

// ---------------------------------------------------------------------------
// Triángulos y polígonos

// Desigualdad del ángulo exterior.
export function exteriorInequality(r: Rng): Question {
  const ext = r.int(100, 150);
  const good = r.int(20, ext - 20);
  const wrong = [ext, ext + r.int(5, 25), ext + r.int(30, 40)].filter((w) => w !== good);
  return choiceQ(r, `Un ángulo exterior de un triángulo mide ${ext}°. ¿Cuál puede ser la medida de uno de los ángulos interiores no adyacentes a él?`, `${good}°`, [...new Set(wrong)].map((w) => `${w}°`), "Un ángulo exterior es mayor que cada uno de los ángulos interiores no adyacentes (es igual a su suma).", undefined, "desigualdad");
}

const POLY_NAMES = ["", "", "", "triángulo", "cuadrilátero", "pentágono", "hexágono", "heptágono", "octágono", "eneágono", "decágono", "", "dodecágono"];
const NS = [3, 4, 5, 6, 8, 9, 10, 12];
// Vocabulario de polígonos.
export function polygonVocabulary(r: Rng): Question {
  const n = r.pick(NS);
  const form = r.int(0, 2);
  if (form === 0) return numQ((n * (n - 3)) / 2, `¿Cuántas diagonales tiene un ${POLY_NAMES[n]}?`, undefined, `n(n − 3) ÷ 2 = ${n} × ${n - 3} ÷ 2 = ${(n * (n - 3)) / 2}.`, "diagonales");
  if (form === 1) {
    const facts: [string, boolean, string][] = [["Un polígono regular tiene todos sus lados y todos sus ángulos iguales.", true, "Esa es la definición de polígono regular."], ["Un polígono convexo tiene algún ángulo interior mayor que 180°.", false, "Eso describe un polígono cóncavo."], ["Un rombo es un polígono regular.", false, "Tiene lados iguales, pero sus ángulos no siempre son iguales."], ["Un triángulo equilátero es un polígono regular.", true, "Tiene lados y ángulos iguales."], ["Un rectángulo que no es cuadrado es un polígono regular.", false, "Sus ángulos son iguales, pero sus lados no."], ["En un polígono cóncavo, alguna diagonal queda fuera de la figura.", true, "Eso pasa en los polígonos cóncavos."]];
    const [t, ok, why] = r.pick(facts);
    return fixedQ(`¿Es verdadera o falsa? ${t}`, ["Verdadera", "Falsa"], ok ? "Verdadera" : "Falsa", why, undefined, "definicion");
  }
  return choiceQ(r, `¿Cómo se llama un polígono de ${n} lados?`, POLY_NAMES[n], NS.filter((m) => m !== n).map((m) => POLY_NAMES[m]).slice(0, 4), `Un polígono de ${n} lados es un ${POLY_NAMES[n]}.`, undefined, "nombre");
}

// Ángulos interiores y exteriores de polígonos.
export function polygonAngles(r: Rng, kind: "interior" | "exterior" | "mixed"): Question {
  const k = kind === "mixed" ? r.pick(["interior", "exterior"] as const) : kind;
  const n = r.pick(NS);
  const form = r.int(0, 2);
  if (k === "interior") {
    if (form === 0) return numQ((n - 2) * 180, `¿Cuánto suman los ángulos interiores de un ${POLY_NAMES[n]}?`, undefined, `(n − 2) × 180° = ${n - 2} × 180° = ${fmt((n - 2) * 180)}°.`, "suma");
    if (form === 1) return numQ(((n - 2) * 180) / n, `¿Cuánto mide cada ángulo interior de un ${POLY_NAMES[n]} regular?`, undefined, `${fmt((n - 2) * 180)}° ÷ ${n} = ${fmt(((n - 2) * 180) / n)}°.`, "regular");
    return numQ(n, `Los ángulos interiores de un polígono suman ${fmt((n - 2) * 180)}°. ¿Cuántos lados tiene?`, undefined, `(n − 2) × 180 = ${(n - 2) * 180} → n − 2 = ${n - 2} → n = ${n}.`, "lados");
  }
  if (form === 0) return numQ(360, `¿Cuánto suman los ángulos exteriores de un ${POLY_NAMES[n]} (uno en cada vértice)?`, undefined, "Los ángulos exteriores de cualquier polígono convexo suman 360°.", "suma-exterior");
  if (form === 1) return numQ(360 / n, `¿Cuánto mide cada ángulo exterior de un ${POLY_NAMES[n]} regular?`, undefined, `360° ÷ ${n} = ${fmt(360 / n)}°.`, "regular-exterior");
  return numQ(n, `Cada ángulo exterior de un polígono regular mide ${fmt(360 / n)}°. ¿Cuántos lados tiene?`, undefined, `360 ÷ ${fmt(360 / n)} = ${n}.`, "lados-exterior");
}

// ---------------------------------------------------------------------------
// Simetría

// [figura, ejes de simetría, orden de simetría rotacional, descripción de un eje]
const SYMMETRY: [string, number, number, string][] = [
  ["un cuadrado", 4, 4, "las diagonales y las rectas que unen puntos medios de lados opuestos"],
  ["un rectángulo (no cuadrado)", 2, 2, "las rectas que unen puntos medios de lados opuestos"],
  ["un triángulo equilátero", 3, 3, "las rectas que van de cada vértice al punto medio del lado opuesto"],
  ["un triángulo isósceles (no equilátero)", 1, 1, "la recta que va del vértice al punto medio de la base"],
  ["un triángulo escaleno", 0, 1, ""],
  ["un rombo (no cuadrado)", 2, 2, "las diagonales"],
  ["un paralelogramo (no rectángulo ni rombo)", 0, 2, ""],
  ["un hexágono regular", 6, 6, "las diagonales mayores y las rectas que unen puntos medios de lados opuestos"],
  ["un pentágono regular", 5, 5, "las rectas que van de cada vértice al punto medio del lado opuesto"],
  ["la letra A", 1, 1, "la recta vertical"],
  ["la letra H", 2, 2, "la recta vertical y la horizontal"],
  ["la letra N", 0, 2, ""],
  ["la letra S", 0, 2, ""],
  ["la letra E", 1, 1, "la recta horizontal"],
  ["la letra F", 0, 1, ""],
  ["un trapecio isósceles", 1, 1, "la recta que une los puntos medios de las bases"],
  ["un círculo", Infinity, Infinity, "cualquier diámetro"],
];
// Simetría axial y rotacional.
export function symmetry(r: Rng, mode: "line" | "rotational" | "draw" | "count"): Question {
  const fig = r.pick(SYMMETRY.filter((f) => (mode === "count" ? Number.isFinite(f[1]) : mode === "draw" ? f[1] > 0 && Number.isFinite(f[1]) : true)));
  const [name, lines, order, axis] = fig;
  if (mode === "line") return yesNo(`¿${name[0].toUpperCase()}${name.slice(1)} tiene simetría axial (al menos un eje de simetría)?`, lines > 0, lines > 0 ? `Sí: por ejemplo, ${axis.split(" y ")[0]}.` : "No: ninguna recta la divide en dos mitades que sean reflejo una de la otra.", undefined, lines > 0 ? "si" : "no");
  if (mode === "rotational") {
    if (!Number.isFinite(order)) return yesNo("¿Un círculo tiene simetría rotacional?", true, "Sí: cualquier giro alrededor de su centro lo deja igual.", undefined, "si");
    if (r.chance(0.5)) return yesNo(`¿${name[0].toUpperCase()}${name.slice(1)} tiene simetría rotacional (un giro de menos de 360° lo deja igual)?`, order > 1, order > 1 ? `Sí: un giro de ${360 / order}° la deja igual.` : "No: solo un giro completo de 360° la deja igual.", undefined, order > 1 ? "si" : "no");
    if (order < 2) return symmetry(r, mode);
    return numQ(360 / order, `¿Cuál es el menor ángulo de giro (en grados) que deja igual a ${name}?`, undefined, `Tiene simetría rotacional de orden ${order}: 360° ÷ ${order} = ${360 / order}°.`, "angulo");
  }
  if (mode === "count") return numQ(lines, `¿Cuántos ejes de simetría tiene ${name}?`, undefined, lines ? `Tiene ${lines}: ${axis}.` : "No tiene ejes de simetría.", "contar");
  const others = SYMMETRY.filter((f) => f[3] && f[3] !== axis).map((f) => f[3]);
  return choiceQ(r, `¿Cuáles son los ejes de simetría de ${name}?`, axis[0].toUpperCase() + axis.slice(1), r.shuffle(others).slice(0, 3).map((o) => o[0].toUpperCase() + o.slice(1)), `En ${name}, los ejes son ${axis}.`, undefined, "ejes");
}

