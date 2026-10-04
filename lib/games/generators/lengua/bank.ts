import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { uniqueOptions } from "../common";

// Generadores genéricos de Comunicación: la mayoría de juegos de gramática,
// vocabulario y lectura son "elige la correcta" sobre un banco de ítems. El
// juego se define con datos, sin código nuevo.

type Shown = {
  p?: string; // enunciado propio del ítem (si no, el del juego)
  t?: string; // texto grande (palabra, oración)
  pic?: string; // dibujo (emoji)
  cap?: string; // texto bajo el dibujo
  read?: { title?: string; emoji?: string; text: string }; // lectura
  code?: string; // bloques de Scratch (sintaxis en inglés de scratchblocks)
  py?: string; // código (Python...) en letra monoespaciada; `t` va encima como título
  say?: string; // lo que lee el botón 🔊
  e?: string; // explicación tras responder
  tag?: string;
};

// `blocks`: las opciones / fichas son bloques de Scratch y se dibujan como tales.
// `mono`: las opciones / fichas son código y van en letra monoespaciada.
export type ChoiceItem = Shown & { a: string; d: string[]; blocks?: boolean; mono?: boolean };
export type MultiItem = Shown & { opts: string[]; ans: string[]; blocks?: boolean };
export type OrderItem = Shown & { seq: string[]; blocks?: boolean; mono?: boolean };

function visualOf(item: Shown): Visual | undefined {
  if (item.code) return { kind: "scratch", code: item.code, title: item.t };
  if (item.py) return { kind: "code", text: item.py, title: item.t };
  if (item.read) return { kind: "passage", ...item.read };
  // Con dibujo y texto a la vez, el texto va debajo del dibujo.
  if (item.pic) return { kind: "picture", emoji: item.pic, caption: item.cap ?? item.t };
  if (item.t) return { kind: "text", text: item.t };
  return undefined;
}

export function choose(r: Rng, prompt: string, items: ChoiceItem[]): Question {
  const item = r.pick(items);
  return {
    kind: "choice",
    prompt: item.p ?? prompt,
    visual: visualOf(item),
    options: uniqueOptions(r, item.a, item.d.filter((d) => d !== item.a)),
    answer: item.a,
    explanation: item.e ?? (item.blocks ? "Esa es la respuesta correcta." : `La respuesta correcta es «${item.a}».`),
    speak: item.say,
    tag: item.tag,
    blocks: item.blocks,
    mono: item.mono,
  };
}

export function chooseAll(r: Rng, prompt: string, items: MultiItem[]): Question {
  const item = r.pick(items);
  return {
    kind: "multi",
    prompt: item.p ?? prompt,
    visual: visualOf(item),
    options: r.shuffle(item.opts),
    answers: item.ans,
    explanation: item.e ?? `Las respuestas correctas son: ${item.ans.join(", ")}.`,
    speak: item.say,
    tag: item.tag,
  };
}

export function order(r: Rng, prompt: string, items: OrderItem[]): Question {
  const item = r.pick(items);
  let tiles = r.shuffle(item.seq);
  // Que no aparezca ya ordenado.
  if (tiles.every((t, i) => t === item.seq[i])) tiles = [...tiles.slice(1), tiles[0]];
  return {
    kind: "sequence",
    prompt: item.p ?? prompt,
    visual: visualOf(item),
    tiles,
    reuse: false,
    length: item.seq.length,
    answer: item.seq,
    explanation: item.e ?? (item.blocks || item.mono ? "Así queda el programa en orden." : `El orden correcto es: ${item.seq.join(" → ")}.`),
    speak: item.say,
    tag: item.tag,
    blocks: item.blocks,
    mono: item.mono,
  };
}

// Mezcla varios juegos (para los "repaso").
export function mix(r: Rng, generators: ((r: Rng) => Question)[]): Question {
  return r.pick(generators)(r);
}

// Lectura con preguntas: elige un texto y una de sus preguntas. `aloud`
// activa el botón 🔊 para leer el texto completo (lecturas "en voz alta").
export type Passage = { title: string; emoji?: string; text: string; qs: { q: string; a: string; d: string[] }[] };

export function readPassage(r: Rng, passages: Passage[], aloud: boolean): Question {
  const p = r.pick(passages);
  const q = r.pick(p.qs);
  return {
    kind: "choice",
    prompt: q.q,
    visual: { kind: "passage", title: p.title, emoji: p.emoji, text: p.text },
    options: uniqueOptions(r, q.a, q.d),
    answer: q.a,
    explanation: `Según el texto: «${q.a}».`,
    speak: aloud ? `${p.title}. ${p.text.replace(/\n/g, " ")}` : undefined,
    tag: p.title,
  };
}

// "Selecciona todas las ..." con 2-3 aciertos de `yes` y relleno de `no`.
export function pickAll(r: Rng, prompt: string, yes: string[], no: string[], tag?: string): Question {
  const hits = r.shuffle(yes).slice(0, r.int(2, 3));
  const others = r.shuffle(no).slice(0, 6 - hits.length);
  return {
    kind: "multi",
    prompt,
    options: r.shuffle([...hits, ...others]),
    answers: hits,
    explanation: `Son: ${hits.join(", ")}.`,
    tag,
  };
}

// Palabras de una oración, sin signos y sin repetir, para marcarlas.
export function wordsOf(sentence: string) {
  return [...new Set(sentence.replace(/[.,;:¿?¡!«»]/g, "").split(/\s+/).filter(Boolean))];
}

export type InSentenceItem = { s: string; ans: string[] };

export function pickInSentence(r: Rng, prompt: string, items: InSentenceItem[]): Question {
  const item = r.pick(items);
  return {
    kind: "multi",
    prompt,
    visual: { kind: "text", text: item.s },
    options: wordsOf(item.s),
    answers: item.ans,
    explanation: `Son: ${item.ans.join(", ")}.`,
  };
}

// ---------------------------------------------------------------------------
// Bancos con más variedad: cada ítem se pregunta de varias formas.
// ---------------------------------------------------------------------------

const YES = "Sí, es correcta ✅";
const NO = "No, es incorrecta ❌";

// "¿Es correcta esta respuesta?" con la respuesta buena o un distractor.
function judge(r: Rng, prompt: string, item: ChoiceItem): Question {
  const shown = r.chance(0.4) ? item.a : r.pick(item.d);
  const question = item.p ?? prompt;
  const context = [item.t, item.pic].filter(Boolean).join("  ");
  const ok = shown === item.a;
  // Con bloques: la respuesta propuesta se dibuja como bloque (o el programa
  // de la pregunta se dibuja y la respuesta va en texto).
  const visual: Visual = item.blocks
    ? { kind: "scratch", code: shown, title: `${context ? `${context}\n` : ""}${question}\nRespuesta propuesta:` }
    : item.py
      ? { kind: "code", text: item.py, title: `${context ? `${context}\n` : ""}${question}\n→ ${shown}` }
      : item.code
      ? { kind: "scratch", code: item.code, title: `${context ? `${context}\n` : ""}${question}\n→ ${shown}` }
      : { kind: "text", text: `${context ? `${context}\n` : ""}${question}\n→ ${shown}` };
  return {
    kind: "choice",
    prompt: "¿Es correcta esta respuesta?",
    visual,
    options: [YES, NO],
    answer: ok ? YES : NO,
    explanation: item.blocks ? (ok ? "Sí, es ese bloque." : "No, es otro bloque.") : ok ? `Sí: «${item.a}».` : `No. La respuesta correcta es «${item.a}».`,
    tag: item.tag,
  };
}

// Banco de preguntas: elegir la respuesta o juzgar si una respuesta es correcta.
export function quiz(r: Rng, prompt: string, items: ChoiceItem[]): Question {
  return r.chance(0.55) ? choose(r, prompt, items) : judge(r, prompt, r.pick(items));
}

// Pasos en orden: ordenar todo, o decir qué paso va en un lugar o después de otro.
export function orderQuiz(r: Rng, prompt: string, items: OrderItem[]): Question {
  const form = r.int(0, 2);
  if (form === 0) return order(r, prompt, items);
  const item = r.pick(items);
  const seq = item.seq;
  if (form === 1) {
    const i = r.int(0, seq.length - 1);
    return {
      kind: "choice",
      prompt: `${item.p ?? prompt} ¿Qué va en el lugar ${i + 1}?`.trim(),
      visual: item.read ? { kind: "passage", ...item.read } : undefined,
      options: uniqueOptions(r, seq[i], seq.filter((s) => s !== seq[i])),
      answer: seq[i],
      explanation: item.blocks || item.mono ? "Así queda el programa en orden." : `El orden es: ${seq.join(" → ")}.`,
      blocks: item.blocks,
      mono: item.mono,
    };
  }
  const i = r.int(0, seq.length - 2);
  return {
    kind: "choice",
    prompt: item.blocks ? "¿Qué bloque va justo después de este?" : item.mono ? "¿Qué línea va justo después de esta?" : `¿Qué va justo después de «${seq[i]}»?`,
    visual: item.blocks ? { kind: "scratch", code: seq[i] } : item.mono ? { kind: "code", text: seq[i], title: item.p } : item.read ? { kind: "passage", ...item.read } : undefined,
    options: uniqueOptions(r, seq[i + 1], seq.filter((s) => s !== seq[i + 1])),
    answer: seq[i + 1],
    explanation: item.blocks || item.mono ? "Así queda el programa en orden." : `El orden es: ${seq.join(" → ")}.`,
    blocks: item.blocks,
    mono: item.mono,
  };
}

// Hechos "cosa → categoría", preguntados de tres formas: ¿a qué categoría
// pertenece?, selecciona todos los de una categoría, o verdadero/falso.
// Con `blocks`, cada «cosa» es un bloque de Scratch y se dibuja como bloque.
export function classify(
  r: Rng,
  facts: [thing: string, category: string][],
  words: {
    ask: string;
    all: (c: string) => string;
    statement: (thing: string, c: string) => string;
    blocks?: boolean;
    blockStatement?: (c: string) => string; // con bloques: la frase va sobre el bloque dibujado
  }
): Question {
  const categories = [...new Set(facts.map(([, c]) => c))];
  const form = r.int(0, 2);
  if (form === 0) {
    const [thing, c] = r.pick(facts);
    return {
      kind: "choice",
      prompt: words.ask,
      visual: words.blocks ? { kind: "scratch", code: thing } : { kind: "text", text: thing },
      options: categories,
      answer: c,
      explanation: `${thing}: ${c}.`,
      tag: c,
    };
  }
  if (form === 1) {
    const c = r.pick(categories);
    const yes = facts.filter(([, k]) => k === c).map(([t]) => t);
    const no = facts.filter(([, k]) => k !== c).map(([t]) => t);
    const q = pickAll(r, words.all(c), yes, no, c);
    return words.blocks ? { ...q, blocks: true, explanation: "Esos son los bloques correctos." } : q;
  }
  const [thing, real] = r.pick(facts);
  const claimed = r.chance(0.5) ? real : r.pick(categories.filter((c) => c !== real));
  const ok = claimed === real;
  return {
    kind: "choice",
    prompt: "¿Verdadero o falso?",
    visual: words.blocks ? { kind: "scratch", code: thing, title: (words.blockStatement ?? ((c: string) => `Este bloque: ${c}.`))(claimed) } : { kind: "text", text: words.statement(thing, claimed) },
    options: ["Verdadero ✅", "Falso ❌"],
    answer: ok ? "Verdadero ✅" : "Falso ❌",
    explanation: words.blocks ? (ok ? `Verdadero: es de ${real}.` : `Falso: es de ${real}.`) : ok ? `Verdadero: ${thing}, ${real}.` : `Falso: ${thing} es ${real}.`,
    tag: real,
  };
}
