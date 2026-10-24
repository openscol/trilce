import type { Rng } from "../rng";
import type { Question, Visual } from "../types";

// Geometría de 3.° en adelante: rectas, ángulos, triángulos y perímetro.

// Rectas paralelas, perpendiculares y secantes.
export function lineRelation(r: Rng): Question {
  const relation = r.pick(["paralelas", "perpendiculares", "secantes"] as const);
  const names = { paralelas: "Paralelas", perpendiculares: "Perpendiculares", secantes: "Secantes" };
  const why = {
    paralelas: "Nunca se cruzan y siempre están a la misma distancia.",
    perpendiculares: "Se cruzan formando ángulos rectos.",
    secantes: "Se cruzan, pero no forman ángulos rectos.",
  };
  return {
    kind: "choice",
    prompt: "¿Cómo son estas dos rectas?",
    visual: { kind: "lines", relation, rotation: r.pick([0, 15, 30, 45, 60, 90, 120, 150]) },
    options: Object.values(names),
    answer: names[relation],
    explanation: `${names[relation]}: ${why[relation].toLowerCase()}`,
    tag: relation,
  };
}

const ANGLES = [20, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
const ROTATIONS = [0, 30, 60, 90, 180, 210, 270, 300];

// Comparar con un ángulo recto.
export function angleVsRight(r: Rng): Question {
  const degrees = r.chance(0.3) ? 90 : r.pick(ANGLES);
  const options = ["Menor que un ángulo recto", "Igual a un ángulo recto", "Mayor que un ángulo recto"];
  const answer = options[degrees < 90 ? 0 : degrees === 90 ? 1 : 2];
  return {
    kind: "choice",
    prompt: "¿Cómo es este ángulo comparado con un ángulo recto?",
    visual: { kind: "angle", degrees, rotation: r.pick(ROTATIONS) },
    options,
    answer,
    explanation: `Un ángulo recto mide 90° (como la esquina de una hoja). Este mide ${degrees}°.`,
    tag: degrees < 90 ? "menor" : degrees === 90 ? "igual" : "mayor",
  };
}

// Agudo, recto, obtuso o llano.
export function classifyAngle(r: Rng): Question {
  const type = r.pick(["Agudo", "Recto", "Obtuso", "Llano"] as const);
  const degrees = type === "Agudo" ? r.pick(ANGLES.filter((a) => a < 90)) : type === "Recto" ? 90 : type === "Obtuso" ? r.pick(ANGLES.filter((a) => a > 90)) : 180;
  const why = { Agudo: "mide menos de 90°", Recto: "mide exactamente 90°", Obtuso: "mide más de 90° y menos de 180°", Llano: "mide 180°: forma una línea recta" };
  return {
    kind: "choice",
    prompt: "¿Qué tipo de ángulo es?",
    visual: { kind: "angle", degrees, rotation: r.pick(ROTATIONS) },
    options: ["Agudo", "Recto", "Obtuso", "Llano"],
    answer: type,
    explanation: `Es ${type.toLowerCase()}: ${why[type]}.`,
    tag: type.toLowerCase(),
  };
}

type Pt = [number, number];
const TRIANGLES: Record<string, Pt[]> = {
  equilatero: [[50, 10], [96, 90], [4, 90]],
  isosceles: [[50, 4], [80, 92], [20, 92]],
  escaleno: [[18, 20], [98, 92], [2, 92]],
  rectangulo: [[10, 12], [10, 92], [92, 92]],
  obtusangulo: [[2, 30], [98, 92], [34, 92]],
};

// Clasificar triángulos por sus lados o por sus ángulos.
export function classifyTriangle(r: Rng): Question {
  if (r.chance(0.5)) {
    const type = r.pick(["Equilátero", "Isósceles", "Escaleno"] as const);
    const a = r.int(4, 9);
    const sides = type === "Equilátero" ? [a, a, a] : type === "Isósceles" ? [a + r.int(1, 3), a + r.int(1, 3), a].map((x, i, arr) => (i === 1 ? arr[0] : x)) : [a + 3, a + 5, a];
    const shape = type === "Equilátero" ? TRIANGLES.equilatero : type === "Isósceles" ? TRIANGLES.isosceles : TRIANGLES.escaleno;
    // Lados del dibujo: 0 = derecho, 1 = base, 2 = izquierdo.
    const labels = type === "Isósceles" ? [`${sides[0]} cm`, `${sides[2]} cm`, `${sides[1]} cm`] : type === "Escaleno" ? [`${sides[1]} cm`, `${sides[0]} cm`, `${sides[2]} cm`] : sides.map((s) => `${s} cm`);
    const why = { Equilátero: "tiene los tres lados iguales", Isósceles: "tiene dos lados iguales", Escaleno: "tiene los tres lados distintos" };
    return {
      kind: "choice",
      prompt: "Según sus lados, ¿qué tipo de triángulo es?",
      visual: { kind: "polygon", points: shape, sideLabels: labels },
      options: ["Equilátero", "Isósceles", "Escaleno"],
      answer: type,
      explanation: `Es ${type.toLowerCase()}: ${why[type]}.`,
      tag: "por-lados",
    };
  }
  const type = r.pick(["Acutángulo", "Rectángulo", "Obtusángulo"] as const);
  const angles =
    type === "Rectángulo"
      ? (() => {
          const a = r.pick([20, 30, 35, 40, 45]);
          return [90, a, 90 - a];
        })()
      : type === "Obtusángulo"
        ? (() => {
            const big = r.pick([100, 110, 120, 130]);
            const a = r.pick([20, 25, 30]);
            return [big, a, 180 - big - a];
          })()
        : r.pick([[60, 60, 60], [70, 60, 50], [80, 55, 45], [75, 65, 40], [50, 60, 70]]);
  const visual: Visual =
    type === "Rectángulo" ? { kind: "polygon", points: TRIANGLES.rectangulo, rightAngles: [1] } : { kind: "polygon", points: type === "Obtusángulo" ? TRIANGLES.obtusangulo : TRIANGLES.isosceles };
  const why = { Acutángulo: "sus tres ángulos miden menos de 90°", Rectángulo: "tiene un ángulo de 90°", Obtusángulo: "tiene un ángulo mayor que 90°" };
  return {
    kind: "choice",
    prompt: `Un triángulo tiene ángulos de ${angles.join("°, ").replace(/, (\d+)$/, " y $1")}°. Según sus ángulos, ¿qué tipo es?`,
    visual,
    options: ["Acutángulo", "Rectángulo", "Obtusángulo"],
    answer: type,
    explanation: `Es ${type.toLowerCase()}: ${why[type]}.`,
    tag: "por-angulos",
  };
}

// Perímetro de rectángulos, cuadrados, triángulos y otros polígonos.
export function perimeter(r: Rng): Question {
  const form = r.int(0, 3);
  const unit = r.pick(["cm", "m"]);
  if (form === 0) {
    const w = r.int(5, 20);
    const h = r.int(2, w - 1);
    return {
      kind: "number",
      prompt: `¿Cuál es el perímetro del rectángulo, en ${unit}?`,
      visual: { kind: "polygon", points: [[2, 22], [98, 22], [98, 78], [2, 78]], sideLabels: [`${w} ${unit}`, `${h} ${unit}`, `${w} ${unit}`, `${h} ${unit}`] },
      answer: 2 * (w + h),
      explanation: `Sumamos los cuatro lados: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} ${unit}.`,
      tag: "rectangulo",
    };
  }
  if (form === 1) {
    const s = r.int(2, 25);
    return {
      kind: "number",
      prompt: `Cada lado del cuadrado mide ${s} ${unit}. ¿Cuál es su perímetro, en ${unit}?`,
      visual: { kind: "polygon", points: [[12, 12], [88, 12], [88, 88], [12, 88]], sideLabels: [`${s} ${unit}`, "", "", ""] },
      answer: 4 * s,
      explanation: `Un cuadrado tiene 4 lados iguales: 4 × ${s} = ${4 * s} ${unit}.`,
      tag: "cuadrado",
    };
  }
  if (form === 2) {
    const a = r.int(5, 15);
    const b = r.int(5, 15);
    const c = r.int(Math.abs(a - b) + 2, a + b - 2);
    return {
      kind: "number",
      prompt: `¿Cuál es el perímetro del triángulo, en ${unit}?`,
      visual: { kind: "polygon", points: TRIANGLES.escaleno, sideLabels: [`${a} ${unit}`, `${b} ${unit}`, `${c} ${unit}`] },
      answer: a + b + c,
      explanation: `Sumamos los tres lados: ${a} + ${b} + ${c} = ${a + b + c} ${unit}.`,
      tag: "triangulo",
    };
  }
  const sides = Array.from({ length: 5 }, () => r.int(3, 12));
  return {
    kind: "number",
    prompt: `¿Cuál es el perímetro de la figura, en ${unit}?`,
    visual: { kind: "polygon", points: [[50, 4], [96, 38], [78, 94], [22, 94], [4, 38]], sideLabels: sides.map((s) => `${s} ${unit}`) },
    answer: sides.reduce((x, y) => x + y, 0),
    explanation: `Sumamos todos los lados: ${sides.join(" + ")} = ${sides.reduce((x, y) => x + y, 0)} ${unit}.`,
    tag: "pentagono",
  };
}
