import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES, uniqueOptions } from "./common";

const NAMES: Record<number, string> = { 2: "mitades", 3: "tercios", 4: "cuartos" };

function fractionOptions(r: Rng, shaded: number, parts: number) {
  const answer = `${shaded}/${parts}`;
  const cands = [`${parts - shaded}/${parts}`, `${shaded}/${parts + 1}`, `${shaded + 1}/${parts}`, `${shaded}/${Math.max(2, parts - 1)}`, `${parts}/${shaded}`]
    .filter((c) => c !== answer && !c.startsWith("0/") && Number(c.split("/")[0]) <= Number(c.split("/")[1]));
  return { answer, options: uniqueOptions(r, answer, cands) };
}

// K.1
export function halvesThirdsFourths(r: Rng): Question {
  const parts = r.pick([2, 3, 4]);
  const shape = r.pick(["circle", "area"] as const);
  return {
    kind: "choice",
    prompt: "¿En qué partes iguales está dividida la figura?",
    visual: { kind: "fraction", shape, parts, shaded: 1 },
    options: ["mitades", "tercios", "cuartos"],
    answer: NAMES[parts],
    explanation: `Hay ${parts} partes iguales: son ${NAMES[parts]}.`,
    tag: NAMES[parts],
  };
}

// K.2 (círculo), K.4 (barras), K.5 (áreas)
export function fractionOfShape(r: Rng, shape: "circle" | "bar" | "area", maxParts: number): Question {
  const parts = shape === "circle" ? r.pick([2, 3, 4]) : r.int(2, maxParts);
  const shaded = r.int(1, parts - 1);
  const { answer, options } = fractionOptions(r, shaded, parts);
  return {
    kind: "choice",
    prompt: "¿Qué fracción está sombreada?",
    visual: { kind: "fraction", shape, parts, shaded },
    options,
    answer,
    explanation: `${shaded} de ${parts} partes iguales están sombreadas: ${answer}.`,
    tag: `${parts}-partes`,
  };
}

// K.3
export function fractionOfGroup(r: Rng): Question {
  const total = r.pick([2, 3, 4, 5, 6, 8]);
  const highlighted = r.int(1, total - 1);
  const { answer, options } = fractionOptions(r, highlighted, total);
  return {
    kind: "choice",
    prompt: "¿Qué fracción del grupo está marcada?",
    visual: { kind: "fractionGroup", emoji: r.pick(COUNTABLES), total, highlighted },
    options,
    answer,
    explanation: `${highlighted} de ${total} están marcados: ${answer}.`,
  };
}

// K.6 / K.7
export function shadeFraction(r: Rng, shape: "bar" | "area"): Question {
  const parts = r.pick([2, 3, 4, 6, 8]);
  const shaded = r.int(1, parts - 1);
  return {
    kind: "shade",
    prompt: `Sombrea ${shaded}/${parts}. Toca las partes.`,
    shape,
    parts,
    answer: shaded,
    explanation: `Hay que sombrear ${shaded} de las ${parts} partes.`,
    tag: `${parts}-partes`,
  };
}

// K.8 / K.9
export function fractionOnLine(r: Rng, unitOnly: boolean): Question {
  const parts = r.pick([2, 3, 4, 5, 6, 8]);
  const marked = unitOnly ? 1 : r.int(1, parts);
  const { answer, options } = fractionOptions(r, marked, parts);
  return {
    kind: "choice",
    prompt: "¿Qué fracción marca el punto?",
    visual: { kind: "fractionLine", parts, marked },
    options,
    answer,
    explanation: `Entre 0 y 1 hay ${parts} partes iguales; el punto está en la ${marked}.ª: ${answer}.`,
  };
}

// ---------------------------------------------------------------------------
// 2.° grado
// ---------------------------------------------------------------------------

// 2.° L.8: dos barras del mismo tamaño muestran fracciones equivalentes.
export function equivalentAreaModels(r: Rng): Question {
  const parts = r.pick([2, 3, 4]);
  const shaded = r.int(1, parts - 1);
  const m = r.pick(parts === 4 ? [2] : [2, 3]);
  const answer = shaded * m;
  return {
    kind: "number",
    prompt: "Las dos barras muestran fracciones equivalentes. ¿Qué número falta?",
    visual: { kind: "fractionPair", items: [{ parts, shaded }, { parts: parts * m, shaded: answer }] },
    answer,
    explanation: `${shaded}/${parts} = ${answer}/${parts * m}: la misma parte de la barra está sombreada.`,
    tag: `${parts}-a-${parts * m}`,
  };
}

// 2.° L.11: la misma longitud en dos rectas con distinta división.
export function equivalentOnLines(r: Rng): Question {
  const parts = r.pick([2, 3, 4]);
  const k = r.int(1, parts - 1);
  const m = r.pick(parts === 4 ? [2] : [2, 3]);
  const answer = `${k * m}/${parts * m}`;
  const cands = [`${k}/${parts * m}`, `${k * m + 1}/${parts * m}`, `${Math.max(1, k * m - 1)}/${parts * m}`, `${k + 1}/${parts * m}`];
  return {
    kind: "choice",
    prompt: `El punto de la primera recta marca ${k}/${parts}. ¿Qué fracción de la segunda recta es equivalente?`,
    visual: { kind: "fractionLines", lines: [{ parts, marked: k }, { parts: parts * m }] },
    options: uniqueOptions(r, answer, cands.filter((c) => c !== answer)),
    answer,
    explanation: `${k}/${parts} y ${answer} están en el mismo lugar de la recta.`,
  };
}

const POINT_LABELS = ["A", "B", "C"];

function lettered(r: Rng, total: number, target: number) {
  const ticks = new Set<number>([target]);
  while (ticks.size < 3) ticks.add(r.int(0, total));
  const sorted = [...ticks].sort((a, b) => a - b);
  const points = sorted.map((at, i) => ({ at, label: POINT_LABELS[i] }));
  return { points, answer: points.find((p) => p.at === target)!.label };
}

// 2.° L.12: recta de 0 a 2; ¿qué punto es igual a 1?
export function fractionEqualToOne(r: Rng): Question {
  const parts = r.pick([2, 3, 4, 5, 6, 8]);
  const { points, answer } = lettered(r, parts * 2, parts);
  return {
    kind: "choice",
    prompt: `¿Qué punto muestra ${parts}/${parts}?`,
    visual: { kind: "fractionLine", parts, wholes: 2, points },
    options: POINT_LABELS,
    answer,
    explanation: `${parts}/${parts} = 1: son ${parts} partes de ${parts}, una unidad completa.`,
  };
}

// 2.° L.13 / L.14: ¿qué punto muestra la fracción?
export function graphFraction(r: Rng, unitOnly: boolean): Question {
  const parts = r.pick([2, 3, 4, 5, 6, 8]);
  const k = unitOnly ? 1 : r.int(1, parts);
  const { points, answer } = lettered(r, parts, k);
  return {
    kind: "choice",
    prompt: `¿Qué punto muestra ${k}/${parts}?`,
    visual: { kind: "fractionLine", parts, points },
    options: POINT_LABELS,
    answer,
    explanation: `Entre 0 y 1 hay ${parts} partes iguales; ${k}/${parts} está a ${k} ${k === 1 ? "parte" : "partes"} del 0.`,
  };
}
