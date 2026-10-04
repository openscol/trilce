import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { numberOptions, uniqueOptions } from "../common";

// Datos y códigos: pictogramas y mensajes secretos (base del pensamiento
// computacional: representar información con símbolos).

const ITEMS: [emoji: string, plural: string, fem: boolean][] = [
  ["🍎", "manzanas", true], ["🍌", "plátanos", false], ["🍇", "uvas", true], ["⚽", "pelotas", true],
  ["🐶", "perros", false], ["🐱", "gatos", false], ["🌸", "flores", true], ["⭐", "estrellas", true],
];

const howMany = (fem: boolean) => (fem ? "Cuántas" : "Cuántos");

function table(r: Rng) {
  const rows = r.shuffle(ITEMS).slice(0, 3).map(([e, name, fem]) => ({ e, name, fem, n: r.int(1, 7) }));
  // Sin empates, para que "el que más/menos" tenga una sola respuesta.
  if (new Set(rows.map((x) => x.n)).size < rows.length) return table(r);
  return rows;
}

function pictograph(rows: { e: string; n: number }[]) {
  return rows.map((x) => Array(x.n).fill(x.e).join(" ")).join("\n");
}

export function readPictograph(r: Rng): Question {
  const rows = table(r);
  const t = r.pick(rows);
  return {
    kind: "number",
    prompt: `Mira el pictograma. ¿${howMany(t.fem)} ${t.name} hay?`,
    visual: { kind: "text", text: pictograph(rows) },
    answer: t.n,
    explanation: `Contamos los ${t.e}: hay ${t.n}.`,
  };
}

export function comparePictograph(r: Rng): Question {
  const rows = table(r);
  const kind = r.int(0, 2);
  if (kind === 2) {
    const [a, b] = r.shuffle(rows);
    const diff = Math.abs(a.n - b.n);
    const [big, small] = a.n > b.n ? [a, b] : [b, a];
    return {
      kind: "choice",
      prompt: `¿${howMany(big.fem)} ${big.name} más que ${small.name} hay?`,
      visual: { kind: "text", text: pictograph(rows) },
      options: numberOptions(r, diff, 0, 7),
      answer: String(diff),
      explanation: `${big.n} − ${small.n} = ${diff}.`,
    };
  }
  const most = kind === 0;
  const sorted = [...rows].sort((x, y) => (most ? y.n - x.n : x.n - y.n));
  const answer = `${sorted[0].e} ${sorted[0].name}`;
  return {
    kind: "choice",
    prompt: `¿De qué hay ${most ? "más" : "menos"}?`,
    visual: { kind: "text", text: pictograph(rows) },
    options: rows.map((x) => `${x.e} ${x.name}`),
    answer,
    explanation: `Hay ${sorted[0].n} ${sorted[0].name}.`,
  };
}

const SYMBOLS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "🌙", "❤️", "🔺"];
const SECRET_WORDS = ["sol", "mar", "pan", "luna", "gato", "casa", "mesa", "pato", "oso", "lima", "rosa", "dado"];

function codeFor(r: Rng, letters: string[]) {
  const syms = r.shuffle(SYMBOLS).slice(0, letters.length);
  return new Map(letters.map((l, i) => [l, syms[i]]));
}

// Clave visible + mensaje en símbolos → palabra.
export function decodeMessage(r: Rng): Question {
  const w = r.pick(SECRET_WORDS);
  const letters = [...new Set([...w, ...r.shuffle("abelmnorst".split("")).slice(0, 2)])];
  const code = codeFor(r, letters);
  const key = [...code.entries()].map(([l, s]) => `${s} = ${l}`).join("   ");
  const message = [...w].map((l) => code.get(l)).join(" ");
  const others = SECRET_WORDS.filter((x) => x !== w && x.length === w.length);
  return {
    kind: "choice",
    prompt: "Usa la clave para descifrar el mensaje secreto.",
    visual: { kind: "text", text: `Clave: ${key}\nMensaje: ${message}` },
    options: uniqueOptions(r, w, [...others, [...w].reverse().join("")]),
    answer: w,
    explanation: `${message} = ${w}.`,
  };
}

// Palabra → ¿qué mensaje en símbolos la codifica?
export function encodeMessage(r: Rng): Question {
  const w = r.pick(SECRET_WORDS.filter((x) => new Set(x).size === x.length));
  const letters = [...new Set([...w, ...r.shuffle("abelmnorst".split("")).filter((l) => !w.includes(l)).slice(0, 2)])];
  const code = codeFor(r, letters);
  const key = [...code.entries()].map(([l, s]) => `${s} = ${l}`).join("   ");
  const enc = (s: string) => [...s].map((l) => code.get(l)).join(" ");
  const answer = enc(w);
  const shuffled = [...w];
  const wrong = [enc([...w].reverse().join("")), enc(r.shuffle(shuffled).join("")), [...w].map((l, i) => (i === 0 ? code.get(letters[letters.length - 1]) : code.get(l))).join(" ")];
  return {
    kind: "choice",
    prompt: `Usa la clave para escribir «${w}» en código secreto.`,
    visual: { kind: "text", text: `Clave: ${key}` },
    options: uniqueOptions(r, answer, wrong.filter((x) => x !== answer)),
    answer,
    explanation: `«${w}» = ${answer}.`,
  };
}
