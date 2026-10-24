import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { choiceQ, decQ, fmt, numQ } from "../kit";
import { PI_NOTE, mil } from "../sec1/util";
import { pt } from "../sec2/util";
import { dec, valQ } from "../alg1/util";

// Geometría: áreas (trapecios, rombos, polígonos regulares, en el plano,
// fórmula de Herón), sólidos (vocabulario, sólidos de revolución), áreas
// laterales, volúmenes compuestos, cambios de escala, unidades y densidad.

// S.4: área de trapecios.
export function trapezoidArea(r: Rng): Question {
  const b1 = r.int(3, 15), b2 = b1 + r.int(2, 10), h = r.int(2, 12);
  if (((b1 + b2) * h) % 2) return trapezoidArea(r);
  return numQ(((b1 + b2) * h) / 2, `Un trapecio tiene bases de ${b1} cm y ${b2} cm, y una altura de ${h} cm. ¿Cuál es su área, en cm²?`, { kind: "polygon", points: [[10, 85], [90, 85], [70, 25], [30, 25]], sideLabels: [`${b2} cm`, "", `${b1} cm`, ""], dashed: [[[30, 25], [30, 85]]] }, `A = (b₁ + b₂) × h ÷ 2 = (${b1} + ${b2}) × ${h} ÷ 2 = ${((b1 + b2) * h) / 2}.`, "trapecio");
}

// S.5: área de rombos.
export function rhombusArea(r: Rng): Question {
  const d1 = r.int(2, 12) * 2, d2 = r.int(2, 12);
  return numQ((d1 * d2) / 2, `Las diagonales de un rombo miden ${d1} cm y ${d2} cm. ¿Cuál es su área, en cm²?`, undefined, `A = d₁ × d₂ ÷ 2 = ${d1} × ${d2} ÷ 2 = ${(d1 * d2) / 2}.`, "rombo");
}

const POLY: [string, number][] = [["pentágono", 5], ["hexágono", 6], ["octágono", 8], ["decágono", 10]];
// S.6: área de polígonos regulares (con apotema).
export function regularPolygonArea(r: Rng): Question {
  const [name, n] = r.pick(POLY);
  const side = r.int(2, 12), ap = r.int(2, 15);
  const area = (n * side * ap) / 2;
  return valQ(r, `Un ${name} regular tiene lados de ${side} cm y apotema de ${ap} cm. ¿Cuál es su área, en cm²?`, area, [n * side * ap, (side * ap) / 2, (n * side + ap) / 2], `A = perímetro × apotema ÷ 2 = (${n} × ${side}) × ${ap} ÷ 2 = ${dec(area)}.`, undefined, "regular");
}

// S.7 / S.8: área y perímetro en el plano de coordenadas.
export function coordinateArea(r: Rng, level: 1 | 2): Question {
  const x0 = r.int(-6, 0), y0 = r.int(-6, 0);
  if (level === 1) {
    const w = r.int(2, 6), h = r.int(2, 6);
    const pts = [{ x: x0, y: y0 }, { x: x0 + w, y: y0 }, { x: x0 + w, y: y0 + h }, { x: x0, y: y0 + h }];
    const area = r.chance(0.5);
    return numQ(area ? w * h : 2 * (w + h), `¿Cuál es ${area ? "el área" : "el perímetro"} del rectángulo de vértices ${pts.map(pt).join(", ")}?`, { kind: "coordPlane", min: -8, max: 8, points: [], shapes: [{ points: pts }] }, `Lados de ${w} y ${h}: ${area ? `${w} × ${h} = ${w * h}` : `2 × (${w} + ${h}) = ${2 * (w + h)}`}.`, area ? "area" : "perimetro");
  }
  // Triángulo con vértices enteros: área con la fórmula del determinante (cordones).
  const pts = [{ x: x0, y: y0 }, { x: x0 + r.int(3, 7), y: y0 + r.int(-1, 2) }, { x: x0 + r.int(0, 5), y: y0 + r.int(3, 7) }];
  const twice = Math.abs((pts[1].x - pts[0].x) * (pts[2].y - pts[0].y) - (pts[2].x - pts[0].x) * (pts[1].y - pts[0].y));
  if (!twice) return coordinateArea(r, level);
  return valQ(r, `¿Cuál es el área del triángulo de vértices ${pts.map(pt).join(", ")}?`, twice / 2, [twice, twice / 2 + 1, twice / 4], `Con la fórmula de los cordones (o encerrándolo en un rectángulo y restando triángulos): ${dec(twice / 2)}.`, { kind: "coordPlane", min: -8, max: 8, points: [], shapes: [{ points: pts }] }, "triangulo");
}

// S.14: fórmula de Herón.
export function heron(r: Rng): Question {
  const [a, b, c] = r.pick([[13, 14, 15], [5, 5, 6], [5, 5, 8], [10, 13, 13], [7, 15, 20], [9, 10, 17], [6, 25, 29], [3, 4, 5], [6, 8, 10], [17, 25, 26]]);
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  return numQ(area, `Un triángulo tiene lados de ${a}, ${b} y ${c} cm. Usa la fórmula de Herón para hallar su área, en cm².`, undefined, `s = (${a} + ${b} + ${c}) ÷ 2 = ${s}; A = √(s(s − a)(s − b)(s − c)) = √(${s} × ${s - a} × ${s - b} × ${s - c}) = ${area}.`, "heron");
}

// ---------------------------------------------------------------------------
// Sólidos

const VOCAB: [string, string, string[]][] = [
  ["Sólido con dos bases poligonales paralelas y congruentes unidas por caras rectangulares.", "Prisma", ["Pirámide", "Cilindro", "Cono"]],
  ["Sólido con una base poligonal y caras triangulares que se unen en un vértice.", "Pirámide", ["Prisma", "Cono", "Esfera"]],
  ["Sólido con dos bases circulares paralelas y una superficie curva.", "Cilindro", ["Cono", "Prisma", "Esfera"]],
  ["Sólido con una base circular y una superficie curva que termina en un vértice.", "Cono", ["Cilindro", "Pirámide", "Esfera"]],
  ["Conjunto de puntos del espacio que están a la misma distancia de un centro.", "Esfera", ["Cilindro", "Cono", "Cubo"]],
  ["Segmento donde se unen dos caras de un poliedro.", "Arista", ["Vértice", "Cara", "Base"]],
  ["Punto donde se unen tres o más aristas.", "Vértice", ["Arista", "Cara", "Apotema"]],
  ["Altura de una cara lateral de una pirámide regular (del vértice al punto medio de un lado de la base).", "Apotema (altura inclinada)", ["Altura", "Arista lateral", "Radio"]],
];
// T.2: vocabulario de figuras tridimensionales.
export function solidVocabulary(r: Rng): Question {
  const [def, good, wrong] = r.pick(VOCAB);
  return choiceQ(r, `¿Qué es? ${def}`, good, wrong, `${good}: ${def.toLowerCase()}`, undefined, "vocabulario");
}

const REVOLUTION: [string, string, string[]][] = [
  ["un rectángulo alrededor de uno de sus lados", "Un cilindro", ["Un cono", "Una esfera", "Un prisma"]],
  ["un triángulo rectángulo alrededor de uno de sus catetos", "Un cono", ["Un cilindro", "Una pirámide", "Una esfera"]],
  ["un semicírculo alrededor de su diámetro", "Una esfera", ["Un cono", "Un cilindro", "Un círculo"]],
  ["un cuadrado alrededor de uno de sus lados", "Un cilindro (con altura igual al radio)", ["Un cubo (con arista igual al lado)", "Un cono (con altura igual al radio)", "Una esfera"]],
  ["un triángulo rectángulo alrededor de su hipotenusa", "Dos conos unidos por sus bases", ["Un cono con la punta hacia abajo", "Un cilindro con dos bases", "Una pirámide de base circular"]],
];
// T.5: sólidos de revolución.
export function revolution(r: Rng): Question {
  const [shape, good, wrong] = r.pick(REVOLUTION);
  return choiceQ(r, `¿Qué sólido se forma al girar ${shape}?`, good, wrong, `Al girar ${shape} se forma ${good.toLowerCase()}.`, undefined, "revolucion");
}

// ---------------------------------------------------------------------------
// Área lateral y volúmenes

// U.1 / U.2: área lateral de prismas y cilindros / de pirámides y conos.
export function lateral(r: Rng, kind: "prismCylinder" | "pyramidCone"): Question {
  const cyl = r.chance(0.5);
  if (kind === "prismCylinder") {
    if (cyl) {
      const rr = r.int(1, 9), h = r.int(2, 15);
      return decQ(r, `${PI_NOTE} Un cilindro tiene ${rr} cm de radio y ${h} cm de altura. ¿Cuál es su área lateral, en cm²?`, 6280 * rr * h, `Área lateral = 2πrh = 2 × 3,14 × ${rr} × ${h} = ${mil(6280 * rr * h)}.`, undefined, "cilindro", [3140 * rr * h, 6280 * rr * (rr + h)]);
    }
    const a = r.int(2, 9), b = r.int(2, 9), h = r.int(2, 12);
    return numQ(2 * (a + b) * h, `Un prisma rectangular tiene una base de ${a} cm × ${b} cm y ${h} cm de altura. ¿Cuál es su área lateral, en cm²?`, undefined, `Área lateral = perímetro de la base × altura = ${2 * (a + b)} × ${h} = ${2 * (a + b) * h}.`, "prisma");
  }
  if (cyl) {
    const [rr, , g] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
    return decQ(r, `${PI_NOTE} Un cono tiene ${rr} cm de radio y ${g} cm de generatriz. ¿Cuál es su área lateral, en cm²?`, 3140 * rr * g, `Área lateral = πrg = 3,14 × ${rr} × ${g} = ${mil(3140 * rr * g)}.`, undefined, "cono", [3140 * rr * (rr + g), 6280 * rr * g]);
  }
  const s = r.int(2, 12), ap = r.int(3, 15);
  return numQ(2 * s * ap, `Una pirámide cuadrangular regular tiene base de ${s} cm de lado y apotema (altura inclinada) de ${ap} cm. ¿Cuál es su área lateral, en cm²?`, undefined, `4 caras triangulares: 4 × (${s} × ${ap} ÷ 2) = ${2 * s * ap}.`, "piramide");
}

// U.12: volumen de figuras compuestas.
export function compoundVolume(r: Rng): Question {
  if (r.chance(0.5)) {
    const rr = r.int(1, 6), h = r.int(2, 10), hc = 3 * r.int(1, 4);
    const v = 3140 * rr * rr * h + (3140 * rr * rr * hc) / 3;
    return decQ(r, `${PI_NOTE} Un sólido está formado por un cilindro de ${rr} cm de radio y ${h} cm de altura, con un cono del mismo radio y ${hc} cm de altura encima. ¿Cuál es su volumen, en cm³?`, v, `Cilindro: 3,14 × ${rr * rr} × ${h} = ${mil(3140 * rr * rr * h)}. Cono: 3,14 × ${rr * rr} × ${hc} ÷ 3 = ${mil((3140 * rr * rr * hc) / 3)}. Total: ${mil(v)}.`, undefined, "cilindro-cono", [3140 * rr * rr * (h + hc)]);
  }
  const s = r.int(2, 9), h = r.int(2, 10), hp = 3 * r.int(1, 4);
  return numQ(s * s * h + (s * s * hp) / 3, `Un sólido está formado por un prisma de base cuadrada de ${s} cm de lado y ${h} cm de altura, con una pirámide de la misma base y ${hp} cm de altura encima. ¿Cuál es su volumen, en cm³?`, undefined, `Prisma: ${s * s} × ${h} = ${s * s * h}. Pirámide: ${s * s} × ${hp} ÷ 3 = ${(s * s * hp) / 3}. Total: ${s * s * h + (s * s * hp) / 3}.`, "prisma-piramide");
}

// U.15 / U.16: cambios de escala en perímetro, área y volumen.
export function scaleChanges(r: Rng, withPerimeter: boolean): Question {
  const k = r.pick([2, 3, 4, 0.5]);
  const what = r.pick(withPerimeter ? ["perímetro", "área", "volumen"] : ["área de superficie", "volumen"]);
  const pow = what === "perímetro" ? 1 : what === "volumen" ? 3 : 2;
  const base = r.pick([8, 16, 24, 40, 64]);
  const ans = base * k ** pow;
  return valQ(r, `Todas las dimensiones de una figura se multiplican por ${dec(k)}. Si su ${what} era ${base}, ¿cuál es su nuevo ${what}?`, ans, [base * k, base * k ** 2, base * k ** 3].filter((x) => x !== ans), `El ${what} se multiplica por ${dec(k)}${pow === 1 ? "" : pow === 2 ? "²" : "³"} = ${dec(k ** pow)}: ${base} × ${dec(k ** pow)} = ${dec(ans)}.`, undefined, what);
}

// ---------------------------------------------------------------------------
// Medición

// V.3: convertir unidades cuadradas y cúbicas.
export function squareCubicUnits(r: Rng): Question {
  const form = r.int(0, 3);
  const n = r.int(2, 9);
  if (form === 0) return numQ(n * 10000, `¿Cuántos cm² hay en ${n} m²?`, undefined, `1 m = 100 cm, así que 1 m² = 100 × 100 = 10 000 cm²; ${n} × 10 000 = ${fmt(n * 10000)}.`, "m2-cm2");
  if (form === 1) return numQ(n * 1000000, `¿Cuántos cm³ hay en ${n} m³?`, undefined, `1 m³ = 100 × 100 × 100 = 1 000 000 cm³; ${n} × 1 000 000 = ${fmt(n * 1000000)}.`, "m3-cm3");
  if (form === 2) return numQ(n * 9, `¿Cuántos pies cuadrados hay en ${n} yardas cuadradas? (1 yarda = 3 pies)`, undefined, `1 yd² = 3 × 3 = 9 pies²; ${n} × 9 = ${n * 9}.`, "yd2-pie2");
  return numQ(n * 1000, `¿Cuántos litros caben en un tanque de ${n} m³? (1 dm³ = 1 litro)`, undefined, `1 m³ = 1000 dm³ = 1000 litros; ${n} × 1000 = ${fmt(n * 1000)}.`, "m3-litros");
}

// V.9: densidad, masa y volumen.
export function density(r: Rng): Question {
  const [what, d] = r.pick([["aluminio", 2.7], ["hierro", 7.9], ["madera de pino", 0.5], ["oro", 19.3], ["hielo", 0.9]] as [string, number][]);
  const v = r.int(2, 20) * 10;
  const m = Math.round(d * v * 10) / 10;
  const form = r.int(0, 2);
  if (form === 0) return valQ(r, `Un bloque de ${what} tiene ${v} cm³ de volumen y su densidad es ${dec(d)} g/cm³. ¿Cuál es su masa, en gramos?`, m, [v / d, d + v, m * 10].map((x) => Math.round(x * 10) / 10), `masa = densidad × volumen = ${dec(d)} × ${v} = ${dec(m)} g.`, undefined, "masa");
  if (form === 1) return valQ(r, `Un objeto tiene ${dec(m)} g de masa y ${v} cm³ de volumen. ¿Cuál es su densidad, en g/cm³?`, d, [Math.round((v / m) * 100) / 100, d * 10, Math.round(d * 1.5 * 10) / 10], `densidad = masa ÷ volumen = ${dec(m)} ÷ ${v} = ${dec(d)}.`, undefined, "densidad");
  return valQ(r, `Un objeto de ${what} (densidad ${dec(d)} g/cm³) tiene ${dec(m)} g de masa. ¿Cuál es su volumen, en cm³?`, v, [Math.round(m * d * 10) / 10, v / 10, v + 10], `volumen = masa ÷ densidad = ${dec(m)} ÷ ${dec(d)} = ${v}.`, undefined, "volumen");
}

