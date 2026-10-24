import type { Rng } from "../rng";
import type { Question } from "../types";
import { uniqueOptions } from "./common";

function label(t: number, o: number) {
  return `${t} ${t === 1 ? "decena" : "decenas"} y ${o} ${o === 1 ? "unidad" : "unidades"}`;
}

function pick(r: Rng, max: number) {
  const n = max === 20 ? r.int(10, 20) : r.int(11, 99);
  return { n, t: Math.floor(n / 10), o: n % 10 };
}

function distractors(t: number, o: number, max: number) {
  const list = [label(o, t), label(t + 1, o), label(Math.max(0, t - 1), o), label(t, (o + 1) % 10), label(t, Math.abs(o - 1))];
  return list.filter((l) => l !== label(t, o) && !(max === 20 && /^[3-9]/.test(l)));
}

export function modelToTensOnes(r: Rng, max: number): Question {
  const { t, o } = pick(r, max);
  return {
    kind: "choice",
    prompt: "¿Cuántas decenas y unidades hay?",
    visual: { kind: "placeValue", tens: t, ones: o },
    options: uniqueOptions(r, label(t, o), distractors(t, o, max)),
    answer: label(t, o),
    explanation: `Cada barra es una decena y cada cubo una unidad: ${label(t, o)}.`,
  };
}

export function modelToNumber(r: Rng, max: number): Question {
  const { n, t, o } = pick(r, max);
  return {
    kind: "number",
    prompt: "¿Qué número muestra el dibujo?",
    visual: { kind: "placeValue", tens: t, ones: o },
    answer: n,
    explanation: `${label(t, o)} forman el ${n}.`,
  };
}

export function numberToTensOnes(r: Rng, max: number): Question {
  const { n, t, o } = pick(r, max);
  return {
    kind: "choice",
    prompt: `Escribe el ${n} como decenas y unidades.`,
    visual: { kind: "text", text: String(n) },
    options: uniqueOptions(r, label(t, o), distractors(t, o, max)),
    answer: label(t, o),
    explanation: `${n} = ${label(t, o)}.`,
  };
}

// ---------------------------------------------------------------------------
// 2.° grado: valor posicional hasta las centenas y los millares.
// ---------------------------------------------------------------------------

export type TopPlace = "tens" | "hundreds" | "thousands";

const PLACES = [
  { key: "thousands", one: "millar", many: "millares", value: 1000 },
  { key: "hundreds", one: "centena", many: "centenas", value: 100 },
  { key: "tens", one: "decena", many: "decenas", value: 10 },
  { key: "ones", one: "unidad", many: "unidades", value: 1 },
] as const;

function placesUpTo(top: TopPlace) {
  return PLACES.slice(PLACES.findIndex((p) => p.key === top));
}

// Número con su cifra principal distinta de 0. Los millares se limitan a 1-4
// para que el dibujo de bloques siga siendo legible.
function pickDigits(r: Rng, top: TopPlace) {
  const places = placesUpTo(top);
  const digits = places.map((p, i) => (i === 0 ? r.int(1, p.key === "thousands" ? 4 : 9) : r.int(0, 9)));
  const n = places.reduce((sum, p, i) => sum + digits[i] * p.value, 0);
  return { places, digits, n };
}

function amount(d: number, p: (typeof PLACES)[number]) {
  return `${d} ${d === 1 ? p.one : p.many}`;
}

function modelVisual(places: (typeof PLACES)[number][], digits: number[]) {
  const get = (key: string) => digits[places.findIndex((p) => p.key === key)] ?? 0;
  return {
    kind: "placeValue" as const,
    thousands: get("thousands"),
    hundreds: get("hundreds"),
    tens: get("tens"),
    ones: get("ones"),
  };
}

// ¿qué número muestran los bloques?
export function placeModelNumber(r: Rng, top: TopPlace): Question {
  const { places, digits, n } = pickDigits(r, top);
  const parts = places.map((p, i) => amount(digits[i], p)).join(", ");
  return {
    kind: "number",
    prompt: "¿Qué número muestran los bloques?",
    visual: modelVisual(places, digits),
    answer: n,
    explanation: `${parts}: forman el ${n}.`,
    tag: top,
  };
}

// Valor de una cifra o qué cifra ocupa un lugar.
export function placeValueDigit(r: Rng, top: TopPlace): Question {
  const { places, digits, n } = pickDigits(r, top);
  const at = r.int(0, places.length - 1);
  const p = places[at];
  const d = digits[at];
  // Si la cifra se repite en el número, la pregunta "valor del dígito d" sería ambigua.
  if (r.chance(0.5) || digits.filter((x) => x === d).length > 1 || d === 0) {
    return {
      kind: "number",
      prompt: `¿Qué cifra está en el lugar de las ${p.many} en el ${n}?`,
      visual: { kind: "text", text: String(n) },
      answer: d,
      explanation: `En el ${n}, las ${p.many} son ${d}.`,
      tag: p.many,
    };
  }
  const answer = amount(d, p);
  return {
    kind: "choice",
    prompt: `¿Cuál es el valor de la cifra ${d} en el ${n}?`,
    visual: { kind: "text", text: String(n) },
    options: uniqueOptions(r, answer, places.map((q) => amount(d, q))),
    answer,
    explanation: `La cifra ${d} está en el lugar de las ${p.many}: vale ${d * p.value}.`,
    tag: p.many,
  };
}

// De forma desarrollada a número y al revés.
export function convertPlaceValue(r: Rng, top: TopPlace): Question {
  const { places, digits, n } = pickDigits(r, top);
  const parts = places.map((p, i) => amount(digits[i], p));
  if (r.chance(0.5)) {
    return {
      kind: "number",
      prompt: "¿Qué número es?",
      visual: { kind: "text", text: parts.join("\n") },
      answer: n,
      explanation: `${parts.join(" + ")} = ${n}.`,
      tag: "a-numero",
    };
  }
  const hidden = r.int(0, places.length - 1);
  const shown = places.map((p, i) => (i === hidden ? `? ${p.many}` : amount(digits[i], p)));
  return {
    kind: "number",
    prompt: `Escribe el ${n} en ${places.map((p) => p.many).join(", ")}. ¿Qué número falta?`,
    visual: { kind: "text", text: `${n} =\n${shown.join(" + ")}` },
    answer: digits[hidden],
    explanation: `${n} = ${parts.join(" + ")}.`,
    tag: "desde-numero",
  };
}
