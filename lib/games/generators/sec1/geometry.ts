import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, decQ, fixedQ, fmt, numQ, sg } from "../kit";
import { type P, PI_NOTE, mil, nz, plane, pointQ, pt } from "./util";

// Geometría de 1.° de secundaria: ángulos entre paralelas, círculos, cuerpos,
// escala, transformaciones, congruencia y semejanza.

// ---------------------------------------------------------------------------
// Rectas y ángulos

// Y.6: escribir y resolver ecuaciones usando relaciones entre ángulos.
export function angleEquation(r: Rng): Question {
  const a = r.int(2, 5), x = r.int(5, 25), b = r.int(1, 20);
  const expr = a * x + b;
  const kind = r.int(0, 2);
  if (kind === 2 || expr >= 170) {
    const v = r.int(8, 30), k = r.int(2, 4), c = r.int(1, 15);
    return numQ(v, `Dos ángulos opuestos por el vértice miden (${k}x + ${c})° y ${k * v + c}°. ¿Cuánto vale x?`, undefined, `Los ángulos opuestos por el vértice son iguales: ${k}x + ${c} = ${k * v + c}, así que x = ${v}.`, "opuestos");
  }
  const total = kind === 0 && expr < 85 ? 90 : 180;
  const name = total === 90 ? "complementarios" : "suplementarios";
  return numQ(x, `Dos ángulos ${name} miden (${a}x + ${b})° y ${total - expr}°. ¿Cuánto vale x?`, undefined, `Los ángulos ${name} suman ${total}°: ${a}x + ${b} + ${total - expr} = ${total}, así que ${a}x = ${a * x} y x = ${x}.`, name);
}

const PAIRS: Record<string, [number, number][]> = {
  "Alternos internos": [[3, 6], [4, 5]],
  "Alternos externos": [[1, 8], [2, 7]],
  "Correspondientes": [[1, 5], [2, 6], [3, 7], [4, 8]],
  "Conjugados internos": [[3, 5], [4, 6]],
  "Opuestos por el vértice": [[1, 4], [2, 3], [5, 8], [6, 7]],
};
const PAIR_WHY: Record<string, string> = {
  "Alternos internos": "están entre las paralelas, a lados distintos de la transversal",
  "Alternos externos": "están fuera de las paralelas, a lados distintos de la transversal",
  "Correspondientes": "ocupan la misma posición en cada cruce",
  "Conjugados internos": "están entre las paralelas, al mismo lado de la transversal",
  "Opuestos por el vértice": "se forman en el mismo cruce, uno frente al otro",
};
const PICTURE: Visual = { kind: "transversal" };
const OBTUSE = [1, 4, 5, 8];

// Y.7: identificar ángulos alternos internos y alternos externos.
export function alternateAngles(r: Rng): Question {
  const name = r.pick(["Alternos internos", "Alternos externos"]);
  const [a, b] = r.pick(PAIRS[name]);
  const [from, to] = r.chance(0.5) ? [a, b] : [b, a];
  if (r.chance(0.5)) {
    const wrong = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => n !== from && n !== to);
    return choiceQ(r, `Las dos rectas horizontales son paralelas. ¿Qué ángulo es ${name === "Alternos internos" ? "alterno interno" : "alterno externo"} con el ángulo ${from}?`, `Ángulo ${to}`, r.shuffle(wrong).slice(0, 3).map((n) => `Ángulo ${n}`), `Los ángulos ${a} y ${b} ${PAIR_WHY[name]}.`, PICTURE, name);
  }
  const options = ["Alternos internos", "Alternos externos", "Ninguno de los dos"];
  const other = r.chance(0.35) ? r.pick([...PAIRS["Correspondientes"], ...PAIRS["Conjugados internos"]]) : null;
  const [p, q] = other ?? [a, b];
  return fixedQ(`Las dos rectas horizontales son paralelas. ¿Cómo son los ángulos ${p} y ${q}?`, options, other ? options[2] : name, other ? `Los ángulos ${p} y ${q} no están a lados distintos de la transversal y ambos dentro (o ambos fuera) de las paralelas.` : `Los ángulos ${a} y ${b} ${PAIR_WHY[name]}.`, PICTURE, other ? "ninguno" : name);
}

// Y.8: transversales de rectas paralelas: nombrar pares de ángulos.
export function nameAnglePairs(r: Rng): Question {
  const names = Object.keys(PAIRS);
  const name = r.pick(names);
  const [a, b] = r.pick(PAIRS[name]);
  return fixedQ(`Las dos rectas horizontales son paralelas. ¿Qué nombre reciben los ángulos ${a} y ${b}?`, names, name, `Los ángulos ${a} y ${b} ${PAIR_WHY[name]}.`, PICTURE, name);
}

// Y.9: transversales de rectas paralelas: hallar medidas de ángulos.
export function transversalMeasures(r: Rng): Question {
  const given = r.int(1, 8);
  let ask = r.int(1, 8);
  while (ask === given) ask = r.int(1, 8);
  const obtuse = r.int(95, 160);
  const measure = (n: number) => (OBTUSE.includes(n) ? obtuse : 180 - obtuse);
  const same = measure(given) === measure(ask);
  return numQ(measure(ask), `Las dos rectas horizontales son paralelas. Si el ángulo marcado mide ${measure(given)}°, ¿cuántos grados mide el ángulo ${ask}?`, { kind: "transversal", given: { angle: given, text: `${measure(given)}°` } }, same ? `El ángulo ${ask} es igual al marcado (correspondientes, alternos u opuestos por el vértice): ${measure(ask)}°.` : `El ángulo ${ask} es suplementario del marcado: 180° − ${measure(given)}° = ${measure(ask)}°.`, same ? "iguales" : "suplementarios");
}

// Y.10: segmentos y ángulos bisecados.
export function bisected(r: Rng): Question {
  const half = r.int(3, 40);
  const form = r.int(0, 3);
  if (form === 0) return numQ(2 * half, `M es el punto medio del segmento AB. Si AM mide ${half} cm, ¿cuántos centímetros mide AB?`, undefined, `El punto medio divide el segmento en dos partes iguales: ${half} × 2 = ${2 * half}.`, "segmento");
  if (form === 1) return numQ(half, `M es el punto medio del segmento AB, que mide ${2 * half} cm. ¿Cuántos centímetros mide MB?`, undefined, `Cada mitad mide ${2 * half} ÷ 2 = ${half}.`, "segmento");
  if (form === 2) {
    const angle = r.int(10, 85);
    return r.chance(0.5) ? numQ(angle, `La semirrecta BD biseca el ángulo ABC, que mide ${2 * angle}°. ¿Cuántos grados mide el ángulo ABD?`, undefined, `La bisectriz divide el ángulo en dos iguales: ${2 * angle}° ÷ 2 = ${angle}°.`, "angulo") : numQ(2 * angle, `La semirrecta BD biseca el ángulo ABC. Si el ángulo DBC mide ${angle}°, ¿cuántos grados mide el ángulo ABC?`, undefined, `Las dos partes son iguales: ${angle}° × 2 = ${2 * angle}°.`, "angulo");
  }
  const k = r.int(2, 5), x = r.int(2, 12), c = r.int(1, 9);
  return numQ(x, `M es el punto medio de AB. Si AM = ${k}x + ${c} y MB = ${k * x + c}, ¿cuánto vale x?`, undefined, `Las dos mitades son iguales: ${k}x + ${c} = ${k * x + c}, así que x = ${x}.`, "ecuacion");
}

// ---------------------------------------------------------------------------
// Figuras de dos dimensiones

const RATIOS = [[1, 2, 3], [2, 3, 4], [1, 1, 2], [3, 4, 5], [2, 3, 5], [1, 3, 5], [1, 2, 6], [2, 2, 5], [4, 5, 6], [1, 4, 4], [3, 3, 4], [1, 1, 1], [2, 3, 7], [1, 5, 6]];

// Z.9: hallar los ángulos de un triángulo usando razones.
export function triangleRatioAngles(r: Rng): Question {
  const ratio = r.pick(RATIOS);
  const unit = 180 / (ratio[0] + ratio[1] + ratio[2]);
  const i = r.int(0, 2);
  const which = i === 0 ? "menor" : i === 2 ? "mayor" : "mediano";
  const sorted = [...ratio].sort((a, b) => a - b);
  return numQ(sorted[i] * unit, `Los ángulos de un triángulo están en la razón ${ratio.join(" : ")}. ¿Cuántos grados mide el ángulo ${which}?`, undefined, `Las partes suman ${ratio[0] + ratio[1] + ratio[2]} y los ángulos 180°: cada parte vale ${unit}°. El ángulo ${which} mide ${sorted[i]} × ${unit}° = ${sorted[i] * unit}°.`);
}

// Z.11: hallar ángulos que faltan en cuadriláteros (paralelogramos y expresiones).
export function quadAngles2(r: Rng): Question {
  const form = r.int(0, 2);
  const a = r.int(35, 145);
  if (form === 0) return numQ(180 - a, `En un paralelogramo, un ángulo mide ${a}°. ¿Cuántos grados mide un ángulo consecutivo (el de al lado)?`, undefined, `En un paralelogramo los ángulos consecutivos son suplementarios: 180° − ${a}° = ${180 - a}°.`, "consecutivo");
  if (form === 1) return numQ(a, `En un paralelogramo, un ángulo mide ${a}°. ¿Cuántos grados mide el ángulo opuesto?`, undefined, `En un paralelogramo los ángulos opuestos son iguales: ${a}°.`, "opuesto");
  const parts = r.pick([[1, 2, 3, 4], [1, 1, 2, 2], [2, 3, 3, 4], [1, 2, 2, 3], [3, 4, 5, 6], [1, 2, 3, 3]]);
  const total = parts.reduce((x, y) => x + y, 0);
  const x = 360 / total;
  return numQ(x, `Los ángulos de un cuadrilátero miden ${parts.map((p) => (p === 1 ? "x" : `${p}x`)).join(", ")} grados. ¿Cuánto vale x?`, undefined, `Los ángulos de un cuadrilátero suman 360°: ${total}x = 360, así que x = ${x}.`, "expresiones");
}

const CIRCLE_PARTS: [string, string][] = [
  ["el segmento que va del centro a un punto de la circunferencia", "Radio"],
  ["la cuerda que pasa por el centro", "Diámetro"],
  ["un segmento que une dos puntos de la circunferencia", "Cuerda"],
  ["una parte de la circunferencia entre dos de sus puntos", "Arco"],
  ["una recta que toca la circunferencia en un solo punto", "Tangente"],
  ["el punto que está a la misma distancia de todos los puntos de la circunferencia", "Centro"],
  ["la región del círculo limitada por dos radios y un arco", "Sector circular"],
  ["el ángulo cuyo vértice es el centro del círculo", "Ángulo central"],
];

// Z.13: partes de un círculo.
export function circleParts(r: Rng): Question {
  if (r.chance(0.3)) {
    const radius = r.int(2, 30);
    return r.chance(0.5) ? numQ(2 * radius, `El radio de un círculo mide ${radius} cm. ¿Cuántos centímetros mide su diámetro?`, { kind: "circle", radius: `${radius} cm` }, `El diámetro es el doble del radio: ${radius} × 2 = ${2 * radius}.`, "medidas") : numQ(radius, `El diámetro de un círculo mide ${2 * radius} cm. ¿Cuántos centímetros mide su radio?`, { kind: "circle", diameter: `${2 * radius} cm` }, `El radio es la mitad del diámetro: ${2 * radius} ÷ 2 = ${radius}.`, "medidas");
  }
  const [definition, name] = r.pick(CIRCLE_PARTS);
  return choiceQ(r, `¿Cómo se llama ${definition}?`, name, CIRCLE_PARTS.map((p) => p[1]).filter((n) => n !== name), `${name}: ${definition}.`, undefined, "nombres");
}

// Z.14: ángulos centrales de los círculos.
export function centralAngles(r: Rng): Question {
  const n = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
  const form = r.int(0, 2);
  if (form === 0) return numQ(360 / n, `Un círculo está dividido en ${n} sectores iguales. ¿Cuántos grados mide el ángulo central de cada sector?`, { kind: "circle", sectors: n }, `El círculo completo mide 360°: 360° ÷ ${n} = ${360 / n}°.`, "sectores-iguales");
  if (form === 1) {
    const m = n < 4 ? 6 : n, k = r.int(2, m - 1);
    return numQ((360 / m) * k, `Un círculo está dividido en ${m} sectores iguales. ¿Cuántos grados mide el ángulo central que abarca ${k} de esos sectores?`, { kind: "circle", sectors: m }, `Cada sector mide ${360 / m}°; ${k} sectores: ${(360 / m) * k}°.`, "varios-sectores");
  }
  const angle = r.pick([30, 45, 60, 72, 90, 120, 180]);
  return choiceQ(r, `Un ángulo central mide ${angle}°. ¿Qué fracción del círculo abarca su sector?`, `1/${360 / angle}`, [`1/${360 / angle + 1}`, `1/${360 / angle + 2}`, `1/${Math.max(2, 360 / angle - 1)}`, `1/${(360 / angle) * 2}`].filter((x) => x !== `1/${360 / angle}`), `${angle}° de 360°: ${angle}/360 = 1/${360 / angle}.`, undefined, "fraccion");
}

// ---------------------------------------------------------------------------
// Figuras de tres dimensiones

const BASES: [string, string, number][] = [
  ["un cilindro", "Círculo", 2], ["un cono", "Círculo", 1], ["un prisma triangular", "Triángulo", 2], ["una pirámide de base cuadrada", "Cuadrado", 1],
  ["un prisma rectangular", "Rectángulo", 2], ["un prisma hexagonal", "Hexágono", 2], ["una pirámide triangular", "Triángulo", 1], ["un prisma pentagonal", "Pentágono", 2],
  ["una pirámide hexagonal", "Hexágono", 1], ["un cubo", "Cuadrado", 2],
];

// AA.1: bases de las figuras tridimensionales.
export function solidBases(r: Rng): Question {
  const [solid, shape, count] = r.pick(BASES);
  if (r.chance(0.35)) return fixedQ(`¿Cuántas bases tiene ${solid}?`, ["1", "2"], String(count), count === 2 ? "Los prismas y los cilindros tienen dos bases iguales y paralelas." : "Las pirámides y los conos tienen una sola base.", undefined, "cantidad");
  return choiceQ(r, `¿Qué forma tiene la base de ${solid}?`, shape, [...new Set(BASES.map((b) => b[1]))].filter((x) => x !== shape), `La base de ${solid} es un ${shape.toLowerCase()}.`, undefined, "forma");
}

const SECTIONS: [string, string][] = [
  ["Se corta un cilindro con un plano paralelo a sus bases.", "Círculo"],
  ["Se corta un cilindro de arriba abajo, pasando por el centro de sus bases.", "Rectángulo"],
  ["Se corta un cono con un plano paralelo a su base.", "Círculo"],
  ["Se corta un cono de arriba abajo, pasando por su vértice.", "Triángulo"],
  ["Se corta un cubo con un plano paralelo a una de sus caras.", "Cuadrado"],
  ["Se corta una esfera con cualquier plano.", "Círculo"],
  ["Se corta una pirámide de base cuadrada con un plano paralelo a la base.", "Cuadrado"],
  ["Se corta una pirámide de arriba abajo, pasando por su vértice.", "Triángulo"],
  ["Se corta un prisma triangular con un plano paralelo a sus bases.", "Triángulo"],
  ["Se corta un prisma rectangular (que no es un cubo) con un plano paralelo a una cara alargada.", "Rectángulo"],
];

// AA.4: secciones transversales de figuras tridimensionales.
export function crossSections(r: Rng): Question {
  const [text, shape] = r.pick(SECTIONS);
  return choiceQ(r, `${text} ¿Qué forma tiene el corte?`, shape, ["Círculo", "Rectángulo", "Triángulo", "Cuadrado", "Hexágono"].filter((x) => x !== shape), `El corte tiene forma de ${shape.toLowerCase()}.`);
}

// ---------------------------------------------------------------------------
// Círculos (π ≈ 3,14; resultados en milésimos)

type CircleKind = "circumference" | "area" | "word" | "semiQuarterArea" | "semicircle" | "quarter" | "compound" | "between";

export function circles(r: Rng, kind: CircleKind): Question {
  const rad = r.int(2, 15);
  const unit = r.pick(["cm", "m"]);
  const even = 2 * r.int(1, 7); // radio par: el cuarto de círculo da centésimos exactos
  if (kind === "circumference") {
    const byRadius = r.chance(0.5);
    return decQ(r, `${PI_NOTE} ¿Cuál es la longitud de la circunferencia, en ${unit}?`, 6280 * rad, byRadius ? `C = 2 × π × r = 2 × 3,14 × ${rad} = ${mil(6280 * rad)}.` : `C = π × d = 3,14 × ${2 * rad} = ${mil(6280 * rad)}.`, byRadius ? { kind: "circle", radius: `${rad} ${unit}` } : { kind: "circle", diameter: `${2 * rad} ${unit}` }, byRadius ? "radio" : "diametro", [3140 * rad, 3140 * rad * rad]);
  }
  if (kind === "area") {
    const byRadius = r.chance(0.6);
    return decQ(r, `${PI_NOTE} ¿Cuál es el área del círculo, en ${unit}²?`, 3140 * rad * rad, `A = π × r² = 3,14 × ${rad}² = 3,14 × ${rad * rad} = ${mil(3140 * rad * rad)}.${byRadius ? "" : ` (El radio es la mitad del diámetro: ${rad}.)`}`, byRadius ? { kind: "circle", radius: `${rad} ${unit}` } : { kind: "circle", diameter: `${2 * rad} ${unit}` }, byRadius ? "radio" : "diametro", [6280 * rad, 3140 * 4 * rad * rad]);
  }
  if (kind === "word") {
    const form = r.int(0, 2);
    const wheel = r.pick([20, 25, 30, 35]), pizza = rad + 8;
    if (form === 0) return decQ(r, `${PI_NOTE} La rueda de una bicicleta tiene ${wheel} cm de radio. ¿Cuántos centímetros avanza la bicicleta en una vuelta completa de la rueda?`, 6280 * wheel, `Avanza una circunferencia: 2 × 3,14 × ${wheel} = ${mil(6280 * wheel)}.`, undefined, "circunferencia", [3140 * wheel]);
    if (form === 1) return decQ(r, `${PI_NOTE} Una pizza circular tiene ${pizza} cm de radio. ¿Cuál es su área, en cm²?`, 3140 * pizza * pizza, `A = 3,14 × ${pizza}² = ${mil(3140 * pizza * pizza)}.`, undefined, "area", [6280 * pizza]);
    return numQ(rad, `${PI_NOTE} La circunferencia de una fuente circular mide ${mil(6280 * rad)} m. ¿Cuántos metros mide su radio?`, undefined, `C = 2 × 3,14 × r: ${mil(6280 * rad)} ÷ 6,28 = ${rad}.`, "radio");
  }
  if (kind === "semiQuarterArea") {
    const semi = r.chance(0.5);
    return decQ(r, `${PI_NOTE} ¿Cuál es el área del ${semi ? "semicírculo" : "cuarto de círculo"}, en ${unit}²?`, semi ? 1570 * rad * rad : 785 * even * even, `Es ${semi ? "la mitad" : "la cuarta parte"} del área del círculo completo: 3,14 × ${semi ? rad * rad : even * even} ÷ ${semi ? 2 : 4} = ${mil(semi ? 1570 * rad * rad : 785 * even * even)}.`, semi ? { kind: "circle", part: "semi", diameter: `${2 * rad} ${unit}` } : { kind: "circle", part: "quarter", radius: `${even} ${unit}` }, semi ? "semicirculo" : "cuarto", [semi ? 3140 * rad * rad : 3140 * even * even]);
  }
  if (kind === "semicircle") {
    const form = r.int(0, 2);
    const visual: Visual = { kind: "circle", part: "semi", diameter: `${2 * rad} ${unit}` };
    if (form === 0) return decQ(r, `${PI_NOTE} ¿Cuál es el área del semicírculo, en ${unit}²?`, 1570 * rad * rad, `El radio es ${rad}. Mitad del círculo: 3,14 × ${rad * rad} ÷ 2 = ${mil(1570 * rad * rad)}.`, visual, "area");
    if (form === 1) return decQ(r, `${PI_NOTE} ¿Cuál es el perímetro del semicírculo, en ${unit} (el arco más el diámetro)?`, 5140 * rad, `Arco: 3,14 × ${rad} = ${mil(3140 * rad)}. Más el diámetro ${2 * rad}: ${mil(5140 * rad)}.`, visual, "perimetro", [3140 * rad, 6280 * rad]);
    return numQ(rad, `${PI_NOTE} El arco de un semicírculo mide ${mil(3140 * rad)} ${unit}. ¿Cuánto mide su radio, en ${unit}?`, undefined, `El arco es media circunferencia: π × r = ${mil(3140 * rad)}, así que r = ${rad}.`, "radio");
  }
  if (kind === "quarter") {
    const form = r.int(0, 2);
    const visual: Visual = { kind: "circle", part: "quarter", radius: `${even} ${unit}` };
    if (form === 0) return decQ(r, `${PI_NOTE} ¿Cuál es el área del cuarto de círculo, en ${unit}²?`, 785 * even * even, `Cuarta parte del círculo: 3,14 × ${even * even} ÷ 4 = ${mil(785 * even * even)}.`, visual, "area");
    if (form === 1) return decQ(r, `${PI_NOTE} ¿Cuál es el perímetro del cuarto de círculo, en ${unit} (el arco más los dos radios)?`, 3570 * even, `Arco: 2 × 3,14 × ${even} ÷ 4 = ${mil(1570 * even)}. Más dos radios (${2 * even}): ${mil(3570 * even)}.`, visual, "perimetro", [1570 * even, 5140 * even]);
    return numQ(rad * 2, `${PI_NOTE} El área de un cuarto de círculo es ${mil(785 * 4 * rad * rad)} ${unit}². ¿Cuánto mide su radio, en ${unit}?`, undefined, `Círculo completo: ${mil(3140 * 4 * rad * rad)}. Entre 3,14 da r² = ${4 * rad * rad}, así que r = ${2 * rad}.`, "radio");
  }
  if (kind === "compound") {
    const w = 2 * r.int(1, 6), h = r.int(2, 12), half = w / 2;
    const tri = r.chance(0.35);
    if (tri) {
      const th = r.int(2, 8);
      return decQ(r, `${PI_NOTE} Una figura está formada por un triángulo de base ${w} ${unit} y altura ${th} ${unit}, y un semicírculo cuyo diámetro es esa misma base. ¿Cuál es el área total, en ${unit}²?`, (w * th * 1000) / 2 + 1570 * half * half, `Triángulo: ${w} × ${th} ÷ 2 = ${(w * th) / 2}. Semicírculo de radio ${half}: ${mil(1570 * half * half)}. Total: ${mil((w * th * 1000) / 2 + 1570 * half * half)}.`, undefined, "triangulo");
    }
    return decQ(r, `${PI_NOTE} Una figura está formada por un rectángulo de ${w} ${unit} por ${h} ${unit} y un semicírculo cuyo diámetro es el lado de ${w} ${unit}. ¿Cuál es el área total, en ${unit}²?`, w * h * 1000 + 1570 * half * half, `Rectángulo: ${w} × ${h} = ${w * h}. Semicírculo de radio ${half}: ${mil(1570 * half * half)}. Total: ${mil(w * h * 1000 + 1570 * half * half)}.`, undefined, "rectangulo");
  }
  // between: área entre un cuadrado y el círculo inscrito, o entre dos círculos.
  if (r.chance(0.5)) {
    const side = 2 * rad;
    return decQ(r, `${PI_NOTE} Un círculo de radio ${rad} ${unit} está dentro de un cuadrado de lado ${side} ${unit}. ¿Cuál es el área de la parte del cuadrado que queda fuera del círculo, en ${unit}²?`, side * side * 1000 - 3140 * rad * rad, `Cuadrado: ${side * side}. Círculo: ${mil(3140 * rad * rad)}. Diferencia: ${mil(side * side * 1000 - 3140 * rad * rad)}.`, undefined, "cuadrado-circulo");
  }
  const big = rad + r.int(1, 5);
  return decQ(r, `${PI_NOTE} Un círculo de radio ${big} ${unit} tiene dentro otro círculo de radio ${rad} ${unit}. ¿Cuál es el área del anillo entre los dos, en ${unit}²?`, 3140 * (big * big - rad * rad), `3,14 × (${big}² − ${rad}²) = 3,14 × ${big * big - rad * rad} = ${mil(3140 * (big * big - rad * rad))}.`, undefined, "anillo");
}

// ---------------------------------------------------------------------------
// Área de superficie y volumen

// CC.3: área lateral de prismas y pirámides.
export function lateralArea(r: Rng): Question {
  if (r.chance(0.5)) {
    const [l, w, h] = [r.int(2, 12), r.int(2, 9), r.int(2, 15)];
    return numQ(2 * (l + w) * h, `Un prisma rectangular tiene una base de ${l} cm por ${w} cm y ${h} cm de altura. ¿Cuál es su área lateral (sin contar las dos bases), en cm²?`, undefined, `Área lateral = perímetro de la base × altura = ${2 * (l + w)} × ${h} = ${fmt(2 * (l + w) * h)}.`, "prisma");
  }
  const b = r.int(2, 12), s = r.int(3, 15);
  return numQ(2 * b * s, `Una pirámide de base cuadrada tiene ${b} cm de lado en la base, y la altura de cada cara triangular (apotema) es de ${s} cm. ¿Cuál es su área lateral, en cm²?`, undefined, `Son 4 triángulos de base ${b} y altura ${s}: 4 × (${b} × ${s} ÷ 2) = ${2 * b * s}.`, "piramide");
}

type Solid = "cylinderSurface" | "cylinderVolume" | "pyramidVolume";
// CC.4 / CC.8 / CC.9: cilindros y pirámides.
export function solidMeasure(r: Rng, kind: Solid): Question {
  const rad = r.int(1, 10), h = r.int(2, 15);
  if (kind === "cylinderSurface") {
    return decQ(r, `${PI_NOTE} Un cilindro tiene ${rad} cm de radio y ${h} cm de altura. ¿Cuál es su área de superficie total, en cm²?`, 6280 * rad * (rad + h), `Dos bases: 2 × 3,14 × ${rad}² = ${mil(6280 * rad * rad)}. Lado: 2 × 3,14 × ${rad} × ${h} = ${mil(6280 * rad * h)}. Total: ${mil(6280 * rad * (rad + h))}.`, undefined, undefined, [6280 * rad * h, 3140 * rad * rad * h]);
  }
  if (kind === "cylinderVolume") {
    return decQ(r, `${PI_NOTE} Un cilindro tiene ${rad} cm de radio y ${h} cm de altura. ¿Cuál es su volumen, en cm³?`, 3140 * rad * rad * h, `V = π × r² × h = 3,14 × ${rad * rad} × ${h} = ${mil(3140 * rad * rad * h)}.`, undefined, undefined, [6280 * rad * h, 3140 * rad * h]);
  }
  const b = r.int(2, 12), height = 3 * r.int(1, 8);
  if (r.chance(0.5)) return numQ((b * b * height) / 3, `Una pirámide tiene una base cuadrada de ${b} cm de lado y ${height} cm de altura. ¿Cuál es su volumen, en cm³?`, undefined, `V = área de la base × altura ÷ 3 = ${b * b} × ${height} ÷ 3 = ${fmt((b * b * height) / 3)}.`, "cuadrada");
  const l = r.int(2, 12);
  return numQ((b * l * height) / 3, `Una pirámide tiene una base rectangular de ${b} cm por ${l} cm y ${height} cm de altura. ¿Cuál es su volumen, en cm³?`, undefined, `V = área de la base × altura ÷ 3 = ${b * l} × ${height} ÷ 3 = ${fmt((b * l * height) / 3)}.`, "rectangular");
}

// ---------------------------------------------------------------------------
// Dibujos a escala

// DD.1 / DD.2: factor de escala, lado que falta (o ángulo que falta).
export function scaleFactor(r: Rng, withAngle: boolean): Question {
  const k = r.int(2, 6);
  const [a, b] = [r.int(2, 9), r.int(3, 12)];
  const form = r.int(0, withAngle ? 2 : 1);
  if (form === 0) return numQ(k, `La figura B es una copia a escala de la figura A. Un lado de A mide ${a} cm y el lado correspondiente de B mide ${a * k} cm. ¿Cuál es el factor de escala de A a B?`, undefined, `Factor de escala = medida nueva ÷ medida original = ${a * k} ÷ ${a} = ${k}.`, "factor");
  if (form === 1) return numQ(b * k, `La figura B es una copia a escala de la figura A. Dos lados de A miden ${a} cm y ${b} cm. En B, el lado que corresponde al de ${a} cm mide ${a * k} cm. ¿Cuánto mide en B el lado que corresponde al de ${b} cm?`, undefined, `El factor de escala es ${a * k} ÷ ${a} = ${k}: ${b} × ${k} = ${b * k}.`, "lado");
  const angle = r.int(25, 140);
  return numQ(angle, `La figura B es una copia a escala de la figura A, con factor de escala ${k}. Un ángulo de A mide ${angle}°. ¿Cuántos grados mide el ángulo correspondiente de B?`, undefined, `En un dibujo a escala cambian las longitudes, pero los ángulos se mantienen: ${angle}°.`, "angulo");
}

// DD.4: dibujos a escala: problemas con el factor de escala.
export function scaleFactorProblem(r: Rng): Question {
  const k = r.pick([10, 20, 25, 50, 100]), drawn = r.int(2, 12);
  const form = r.int(0, 2);
  if (form === 0) return numQ(drawn * k, `Un plano está hecho a escala 1 : ${k}. Una pared mide ${drawn} cm en el plano. ¿Cuántos centímetros mide en la realidad?`, undefined, `Cada centímetro del plano representa ${k} cm: ${drawn} × ${k} = ${fmt(drawn * k)}.`, "real");
  if (form === 1) return numQ(drawn, `Una maqueta está hecha a escala 1 : ${k}. Un edificio mide ${fmt(drawn * k)} cm de alto en la realidad. ¿Cuántos centímetros mide en la maqueta?`, undefined, `Se divide entre ${k}: ${fmt(drawn * k)} ÷ ${k} = ${drawn}.`, "dibujo");
  return numQ(k, `Un carrito de juguete mide ${drawn} cm de largo y el carro real mide ${fmt(drawn * k)} cm. La escala es 1 : x. ¿Cuánto vale x?`, undefined, `${fmt(drawn * k)} ÷ ${drawn} = ${k}: la escala es 1 : ${k}.`, "factor");
}

// DD.5: perímetro y área: cambios de escala.
export function scaleChange(r: Rng): Question {
  const k = r.int(2, 5), [l, w] = [r.int(2, 9), r.int(2, 9)];
  const form = r.int(0, 2);
  if (form === 0) return numQ(2 * (l + w) * k, `Un rectángulo tiene ${2 * (l + w)} cm de perímetro. Si todos sus lados se multiplican por ${k}, ¿cuál es el nuevo perímetro, en cm?`, undefined, `El perímetro se multiplica por el mismo factor: ${2 * (l + w)} × ${k} = ${2 * (l + w) * k}.`, "perimetro");
  if (form === 1) return numQ(l * w * k * k, `Un rectángulo tiene ${l * w} cm² de área. Si todos sus lados se multiplican por ${k}, ¿cuál es la nueva área, en cm²?`, undefined, `El área se multiplica por el factor al cuadrado: ${l * w} × ${k}² = ${l * w} × ${k * k} = ${fmt(l * w * k * k)}.`, "area");
  return choiceQ(r, `Los lados de una figura se multiplican por ${k}. ¿Qué pasa con su área?`, `Se multiplica por ${k * k}`, [`Se multiplica por ${k}`, `Se multiplica por ${2 * k}`, `Se multiplica por ${k * k * k}`, `Se suma ${k}`].filter((x) => x !== `Se multiplica por ${k * k}`), `El área depende de dos dimensiones: se multiplica por ${k} × ${k} = ${k * k}.`, undefined, "regla");
}

// ---------------------------------------------------------------------------
// Transformaciones

const KINDS = ["Traslación", "Reflexión", "Rotación"];
// EE.1: identificar reflexiones, rotaciones y traslaciones.
export function identifyTransformation(r: Rng): Question {
  const a = r.int(1, 7), b = r.int(1, 7);
  const cases: [string, number, string][] = [
    [`Cada punto (x, y) de una figura pasa a (x + ${a}, y − ${b}).`, 0, "Todos los puntos se deslizan lo mismo, sin girar ni voltearse."],
    [`Cada punto (x, y) de una figura pasa a (x − ${a}, y).`, 0, "La figura solo se desliza hacia la izquierda."],
    ["Cada punto (x, y) de una figura pasa a (−x, y).", 1, "La figura se voltea respecto del eje y, como en un espejo."],
    ["Cada punto (x, y) de una figura pasa a (x, −y).", 1, "La figura se voltea respecto del eje x, como en un espejo."],
    ["Cada punto (x, y) de una figura pasa a (−y, x).", 2, "La figura gira 90° alrededor del origen."],
    ["Cada punto (x, y) de una figura pasa a (−x, −y).", 2, "La figura gira 180° alrededor del origen."],
    ["Una ficha se desliza en línea recta sobre el tablero, sin girar.", 0, "Deslizar sin girar es una traslación."],
    ["Una letra se ve al revés en un espejo.", 1, "La imagen en un espejo es una reflexión."],
    ["La aguja de un reloj se mueve alrededor del centro.", 2, "Girar alrededor de un punto fijo es una rotación."],
    ["Una puerta se abre girando sobre sus bisagras.", 2, "Girar alrededor de un eje fijo es una rotación."],
    ["Una montaña se ve invertida en el agua tranquila de un lago.", 1, "El reflejo en el agua es una reflexión."],
    ["Un ascensor sube tres pisos.", 0, "Se desplaza sin girar: es una traslación."],
  ];
  const [text, i, why] = r.pick(cases);
  return fixedQ(`${text} ¿Qué transformación es?`, KINDS, KINDS[i], why, undefined, KINDS[i]);
}

type Move = "translate" | "reflectAxes" | "reflectLine" | "rotate";
// EE.2 – EE.9: hallar la imagen de un punto (`graph`: con el plano dibujado).
export function transformPoint(r: Rng, move: Move, graph: boolean): Question {
  const A: P = { x: nz(r, 4), y: nz(r, 4) };
  let image: P, text: string, why: string, tag: string;
  if (move === "translate") {
    const dx = nz(r, 4), dy = nz(r, 4);
    if (Math.abs(A.x + dx) > 6 || Math.abs(A.y + dy) > 6) return transformPoint(r, move, graph);
    image = { x: A.x + dx, y: A.y + dy };
    text = `se traslada ${Math.abs(dx)} ${Math.abs(dx) === 1 ? "unidad" : "unidades"} hacia la ${dx > 0 ? "derecha" : "izquierda"} y ${Math.abs(dy)} hacia ${dy > 0 ? "arriba" : "abajo"}`;
    why = `x: ${sg(A.x)} ${dx > 0 ? "+" : "−"} ${Math.abs(dx)} = ${sg(image.x)}; y: ${sg(A.y)} ${dy > 0 ? "+" : "−"} ${Math.abs(dy)} = ${sg(image.y)}.`;
    tag = "traslacion";
  } else if (move === "reflectAxes") {
    const overX = r.chance(0.5);
    image = overX ? { x: A.x, y: -A.y } : { x: -A.x, y: A.y };
    text = `se refleja respecto del eje ${overX ? "x" : "y"}`;
    why = `Al reflejar respecto del eje ${overX ? "x cambia el signo de y" : "y cambia el signo de x"}.`;
    tag = overX ? "eje-x" : "eje-y";
  } else if (move === "reflectLine") {
    const vertical = r.chance(0.5), k = r.pick([-1, 1, 2, -2]);
    image = vertical ? { x: 2 * k - A.x, y: A.y } : { x: A.x, y: 2 * k - A.y };
    if (Math.abs(image.x) > 6 || Math.abs(image.y) > 6 || (vertical ? A.x === k : A.y === k)) return transformPoint(r, move, graph);
    text = `se refleja respecto de la recta ${vertical ? "x" : "y"} = ${sg(k)}`;
    why = `El punto queda a la misma distancia de la recta, al otro lado: su distancia a la recta es ${Math.abs((vertical ? A.x : A.y) - k)} y la de su imagen también.`;
    tag = vertical ? "recta-vertical" : "recta-horizontal";
  } else {
    const turn = r.pick([90, 180, 270]);
    image = turn === 90 ? { x: -A.y, y: A.x } : turn === 180 ? { x: -A.x, y: -A.y } : { x: A.y, y: -A.x };
    text = `rota ${turn === 270 ? "90° en sentido horario" : `${turn}°${turn === 90 ? " en sentido antihorario" : ""}`} alrededor del origen`;
    why = turn === 90 ? "Giro de 90° antihorario: (x, y) → (−y, x)." : turn === 180 ? "Giro de 180°: (x, y) → (−x, −y)." : "Giro de 90° horario: (x, y) → (y, −x).";
    tag = `giro-${turn}`;
  }
  return pointQ(r, `El punto A ${pt(A)} ${text}. ¿Cuáles son las coordenadas de su imagen A′?`, image, `${why} A′ = ${pt(image)}.`, graph ? plane([{ ...A, emoji: "A" }]) : undefined, tag);
}

// ---------------------------------------------------------------------------
// Congruencia y semejanza

// FF.1: figuras semejantes y congruentes.
export function similarOrCongruent(r: Rng): Question {
  const [a, b] = [r.int(2, 6), r.int(3, 9)];
  if (a === b) return similarOrCongruent(r);
  const kind = r.int(0, 2);
  const k = r.int(2, 4);
  const second = kind === 0 ? [b, a] : kind === 1 ? [a * k, b * k] : [a * k, b * k + r.pick([1, 2])];
  const options = ["Congruentes", "Semejantes, pero no congruentes", "Ni congruentes ni semejantes"];
  const why = kind === 0 ? "Tienen las mismas medidas (solo cambia la posición): son congruentes." : kind === 1 ? `Los lados son proporcionales (${a} × ${k} y ${b} × ${k}) y los ángulos, iguales: son semejantes.` : `${second[0]} ÷ ${a} y ${second[1]} ÷ ${b} no dan lo mismo: los lados no son proporcionales.`;
  return fixedQ("¿Cómo son los dos rectángulos?", options, options[kind], why, `Rectángulo A: ${a} cm × ${b} cm\nRectángulo B: ${second[0]} cm × ${second[1]} cm`, ["congruentes", "semejantes", "ninguno"][kind]);
}

const TRIOS = ["ABC", "DEF", "PQR", "XYZ", "JKL", "MNO", "RST", "UVW"];

// FF.2: enunciados de congruencia y partes correspondientes.
export function congruenceStatement(r: Rng): Question {
  const [t1, t2] = r.shuffle(TRIOS).slice(0, 2);
  const i = r.int(0, 2), j = (i + 1) % 3;
  if (r.chance(0.5)) {
    const good = `${t2[i]}${t2[j]}`;
    const k = (i + 2) % 3;
    return choiceQ(r, `△${t1} ≅ △${t2}. ¿Qué lado corresponde a ${t1[i]}${t1[j]}?`, good, [`${t2[j]}${t2[k]}`, `${t2[i]}${t2[k]}`, `${t1[j]}${t1[k]}`], `Las letras van en el mismo orden: ${t1[i]} ↔ ${t2[i]} y ${t1[j]} ↔ ${t2[j]}.`, undefined, "lado");
  }
  return choiceQ(r, `△${t1} ≅ △${t2}. ¿Qué ángulo corresponde a ∠${t1[i]}?`, `∠${t2[i]}`, [`∠${t2[j]}`, `∠${t2[(i + 2) % 3]}`, `∠${t1[j]}`], `Las letras van en el mismo orden: ${t1[i]} ↔ ${t2[i]}.`, undefined, "angulo");
}

// FF.3 / FF.4: medidas de lados y ángulos de figuras congruentes o semejantes.
export function correspondingMeasures(r: Rng, similar: boolean): Question {
  const [t1, t2] = r.shuffle(TRIOS).slice(0, 2);
  const sides = [r.int(3, 12), r.int(4, 15), r.int(5, 18)];
  const angles = [r.int(30, 80), r.int(35, 70)];
  const k = similar ? r.int(2, 5) : 1;
  const i = r.int(0, 2), j = (i + 1) % 3;
  const symbol = similar ? "∼" : "≅";
  if (r.chance(0.3)) {
    const a = r.int(0, 1);
    return numQ(angles[a], `△${t1} ${symbol} △${t2}. El ángulo ${t1[a]} mide ${angles[a]}°. ¿Cuántos grados mide el ángulo ${t2[a]}?`, undefined, `Los ángulos correspondientes de figuras ${similar ? "semejantes" : "congruentes"} son iguales: ${angles[a]}°.`, "angulo");
  }
  if (!similar) return numQ(sides[i], `△${t1} ≅ △${t2}. El lado ${t1[i]}${t1[j]} mide ${sides[i]} cm. ¿Cuántos centímetros mide ${t2[i]}${t2[j]}?`, undefined, `Los lados correspondientes de figuras congruentes miden lo mismo: ${sides[i]} cm.`, "lado");
  const m = (i + 2) % 3;
  return numQ(sides[j] * k, `△${t1} ∼ △${t2}. ${t1[i]}${t1[j]} = ${sides[i]} cm, ${t2[i]}${t2[j]} = ${sides[i] * k} cm y ${t1[j]}${t1[m]} = ${sides[j]} cm. ¿Cuántos centímetros mide ${t2[j]}${t2[m]}?`, undefined, `El factor de escala es ${sides[i] * k} ÷ ${sides[i]} = ${k}: ${sides[j]} × ${k} = ${sides[j] * k}.`, "lado");
}

// FF.5: figuras semejantes y medición indirecta.
export function indirectMeasurement(r: Rng): Question {
  const h = r.int(1, 3), s = r.int(1, 4), k = r.int(3, 12);
  const [thing, the, small] = r.pick([["un árbol", "el árbol", "un poste"], ["un edificio", "el edificio", "un arbolito"], ["una torre", "la torre", "una estaca"], ["un faro", "el faro", "un bastón"]]);
  return numQ(h * k, `A la misma hora, ${small} de ${h} m de alto proyecta una sombra de ${s} m y ${thing} proyecta una sombra de ${s * k} m. ¿Cuántos metros de alto mide ${the}?`, undefined, `Los triángulos que forman son semejantes: la sombra es ${k} veces mayor, así que la altura también: ${h} × ${k} = ${h * k}.`);
}
