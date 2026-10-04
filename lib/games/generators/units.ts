import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES } from "./common";

// Unidades de medida, plano de coordenadas y estadística (3.° en adelante).

export type UnitKind = "longitud" | "capacidad" | "masa";

// Unidades de menor a mayor, con el factor respecto a la anterior.
const UNITS: Record<UnitKind, { units: [string, string][]; pairs: [big: string, small: string, factor: number][]; things: [string, string][] }> = {
  longitud: {
    units: [["mm", "milímetro"], ["cm", "centímetro"], ["m", "metro"], ["km", "kilómetro"]],
    pairs: [["cm", "mm", 10], ["m", "cm", 100], ["km", "m", 1000]],
    things: [["el largo de una hormiga", "mm"], ["el grosor de una moneda", "mm"], ["el largo de un lápiz", "cm"], ["el ancho de un cuaderno", "cm"], ["el largo de un salón", "m"], ["la altura de un árbol", "m"], ["la distancia entre dos ciudades", "km"], ["el largo de una carretera", "km"]],
  },
  capacidad: {
    units: [["ml", "mililitro"], ["l", "litro"]],
    pairs: [["l", "ml", 1000]],
    things: [["una cucharita de jarabe", "ml"], ["un gotero", "ml"], ["un vaso de jugo", "ml"], ["un balde de agua", "l"], ["una piscina", "l"], ["el tanque de un auto", "l"]],
  },
  masa: {
    units: [["g", "gramo"], ["kg", "kilogramo"]],
    pairs: [["kg", "g", 1000]],
    things: [["un lápiz", "g"], ["una moneda", "g"], ["una galleta", "g"], ["un perro grande", "kg"], ["una persona", "kg"], ["un saco de arroz", "kg"]],
  },
};

const SYMBOLS = ["<", "=", ">"];

// 3.° W.2 / W.4 / W.6: comparar unidades y cantidades.
export function compareUnits(r: Rng, kind: UnitKind): Question {
  const U = UNITS[kind];
  const form = r.int(0, 2);
  if (form === 0) {
    const [thing, unit] = r.pick(U.things);
    return {
      kind: "choice",
      prompt: `¿Qué unidad conviene para medir ${thing}?`,
      options: U.units.map(([u, name]) => `${name} (${u})`),
      answer: `${U.units.find(([u]) => u === unit)![1]} (${unit})`,
      explanation: `Para ${thing} conviene usar ${unit}.`,
      tag: "elegir-unidad",
    };
  }
  const [big, small, factor] = r.pick(U.pairs);
  if (form === 1) {
    const larger = r.chance(0.5);
    return {
      kind: "choice",
      prompt: `¿Qué unidad es ${larger ? "mayor" : "menor"}?`,
      options: [`1 ${big}`, `1 ${small}`],
      answer: larger ? `1 ${big}` : `1 ${small}`,
      explanation: `1 ${big} = ${factor} ${small}.`,
      tag: "mayor-menor",
    };
  }
  const n = r.int(1, 9);
  const equal = r.chance(0.25);
  const step = factor / 10;
  const other = equal ? n * factor : n * factor + r.pick([-1, 1]) * step * r.int(1, 5);
  const left = r.chance(0.5);
  const a = `${n} ${big}`;
  const b = `${other} ${small}`;
  const c = n * factor - other;
  const answer = (left ? c : -c) < 0 ? "<" : c === 0 ? "=" : ">";
  return {
    kind: "choice",
    prompt: "Elige el símbolo correcto.",
    visual: { kind: "text", text: left ? `${a}  ?  ${b}` : `${b}  ?  ${a}` },
    options: SYMBOLS,
    answer,
    explanation: `${n} ${big} = ${n * factor} ${small}.`,
    tag: "comparar-cantidades",
  };
}

// 3.° W.3 / W.5 / W.7: convertir unidades.
export function convertUnits(r: Rng, kind: UnitKind): Question {
  const [big, small, factor] = r.pick(UNITS[kind].pairs);
  const n = r.int(1, 12);
  return r.chance(0.5)
    ? { kind: "number", prompt: "Convierte la medida.", visual: { kind: "text", text: `${n} ${big} = ? ${small}` }, answer: n * factor, explanation: `1 ${big} = ${factor} ${small}; ${n} × ${factor} = ${n * factor} ${small}.`, tag: `${big}-a-${small}` }
    : { kind: "number", prompt: "Convierte la medida.", visual: { kind: "text", text: `${n * factor} ${small} = ? ${big}` }, answer: n, explanation: `${factor} ${small} = 1 ${big}; ${n * factor} ÷ ${factor} = ${n} ${big}.`, tag: `${small}-a-${big}` };
}

// 3.° X.1: ¿qué objeto está en esas coordenadas?
export function locateObject(r: Rng): Question {
  const max = 6;
  const emojis = r.shuffle(COUNTABLES).slice(0, 4);
  const used = new Set<string>();
  const points = emojis.map((emoji) => {
    for (;;) {
      const x = r.int(1, max);
      const y = r.int(1, max);
      // Sin un objeto en la posición invertida de otro: evita dudas.
      if (!used.has(`${x},${y}`) && !used.has(`${y},${x}`)) {
        used.add(`${x},${y}`);
        return { x, y, emoji };
      }
    }
  });
  const t = r.pick(points);
  return {
    kind: "choice",
    prompt: `¿Qué objeto está en (${t.x}, ${t.y})? (primero → horizontal, luego ↑ vertical)`,
    visual: { kind: "coordPlane", max, points },
    options: r.shuffle(emojis),
    answer: t.emoji,
    explanation: `Avanzamos ${t.x} a la derecha y ${t.y} hacia arriba: llegamos a ${t.emoji}.`,
  };
}

// 3.° Y.1: media (promedio) y moda.
export function meanMode(r: Rng): Question {
  if (r.chance(0.5)) {
    const n = r.pick([3, 4, 5]);
    const xs = Array.from({ length: n }, () => r.int(2, 20));
    const sum = xs.reduce((a, b) => a + b, 0);
    xs[n - 1] += (n - (sum % n)) % n;
    const total = xs.reduce((a, b) => a + b, 0);
    return {
      kind: "number",
      prompt: "¿Cuál es la media (promedio) de estos datos?",
      visual: { kind: "text", text: xs.join("   ") },
      answer: total / n,
      explanation: `Sumamos y dividimos entre la cantidad de datos: ${xs.join(" + ")} = ${total}; ${total} ÷ ${n} = ${total / n}.`,
      tag: "media",
    };
  }
  const mode = r.int(1, 20);
  const others = r.shuffle(Array.from({ length: 20 }, (_, i) => i + 1).filter((x) => x !== mode)).slice(0, r.int(3, 4));
  const data = r.shuffle([mode, mode, ...(r.chance(0.5) ? [mode] : []), ...others]);
  return {
    kind: "number",
    prompt: "¿Cuál es la moda de estos datos?",
    visual: { kind: "text", text: data.join("   ") },
    answer: mode,
    explanation: `La moda es el dato que más se repite: ${mode}.`,
    tag: "moda",
  };
}

