import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";
import { wordsOf } from "./bank";
import { RHYMES } from "./phonics";
import { label, MORE_WORDS, WORDS, type Word } from "./words";

// Lectoescritura de Inicial (5 años): el abecedario (con la ñ), mayúsculas y
// minúsculas, y conciencia fonológica con respuestas que se tocan. Los juegos
// de "escucha" usan el botón 🔊 (nombre de la letra, sílaba o palabra).

const ALL: Word[] = [...WORDS, ...MORE_WORDS];
const plain = (s: string) => s.normalize("NFD").replace(/[́̈]/g, "").normalize("NFC");

export const ALPHABET = "abcdefghijklmnñopqrstuvwxyz".split("");

const NAMES: Record<string, string> = {
  a: "a", b: "be", c: "ce", d: "de", e: "e", f: "efe", g: "ge", h: "hache", i: "i", j: "jota", k: "ka", l: "ele", m: "eme",
  n: "ene", ñ: "eñe", o: "o", p: "pe", q: "cu", r: "erre", s: "ese", t: "te", u: "u", v: "uve", w: "uve doble", x: "equis", y: "ye", z: "zeta",
};
const say = (l: string) => `letra ${NAMES[l]}`;
const up = (l: string) => l.toUpperCase();
const both = (l: string) => `${up(l)} ${l}`;

function others<T>(r: Rng, pool: T[], exclude: T[], n: number): T[] {
  return r.shuffle(pool.filter((x) => !exclude.includes(x))).slice(0, n);
}

// Distractores de largo parecido al de la respuesta, para que no se adivine por el tamaño.
function nearLength<T>(r: Rng, pool: T[], text: (x: T) => string, length: number, n: number): T[] {
  return r
    .shuffle(pool)
    .map((x) => ({ x, d: Math.abs([...text(x)].length - length) }))
    .sort((a, b) => Math.min(a.d, 2) - Math.min(b.d, 2))
    .slice(0, n)
    .map((o) => o.x);
}

// Palabras con dibujo que empiezan con la letra (sin contar los dígrafos ch y ll).
function startsWith(l: string): Word[] {
  return ALL.filter((x) => plain(x.w)[0] === l && !/^(ch|ll)/.test(x.w));
}
function contains(l: string): Word[] {
  return ALL.filter((x) => plain(x.w).includes(l));
}

// ---------------------------------------------------------------------------
// El abecedario
// ---------------------------------------------------------------------------

// Aprender una letra: escucharla, unir mayúscula y minúscula, y reconocerla
// al inicio de una palabra. Con varias letras sirve de repaso.
export function learnLetter(r: Rng, letters: string[]): Question {
  const l = r.pick(letters);
  const initial = startsWith(l);
  const form = r.int(0, 3);
  if (form === 0) {
    return {
      kind: "choice",
      prompt: "Toca 🔊 y elige la letra que escuchas.",
      options: [l, ...others(r, ALPHABET, [l], 3)].sort((a, b) => a.localeCompare(b, "es")).map(both),
      answer: both(l),
      explanation: `Es la letra ${both(l)}.`,
      speak: say(l),
      tag: l,
    };
  }
  if (form === 1) {
    const toLower = r.chance(0.5);
    const show = toLower ? up : (x: string) => x;
    const opt = toLower ? (x: string) => x : up;
    return {
      kind: "choice",
      prompt: toLower ? "¿Cuál es la misma letra en minúscula?" : "¿Cuál es la misma letra en mayúscula?",
      visual: { kind: "text", text: show(l) },
      options: uniqueOptions(r, opt(l), others(r, ALPHABET, [l], 3).map(opt)),
      answer: opt(l),
      explanation: `${up(l)} y ${l} son la misma letra.`,
      tag: l,
    };
  }
  if (form === 2 && initial.length > 0) {
    const x = r.pick(initial);
    return {
      kind: "choice",
      prompt: "Escucha la palabra. ¿Con qué letra empieza?",
      visual: { kind: "picture", emoji: x.e, caption: x.w },
      options: uniqueOptions(r, l, others(r, ALPHABET, [l, plain(x.w)[0]], 3)),
      answer: l,
      explanation: `«${x.w}» empieza con la letra «${l}».`,
      speak: x.w,
      tag: l,
    };
  }
  // Un dibujo que empieza con la letra (o que la tiene, si ninguna palabra empieza con ella).
  const pool = initial.length > 0 ? initial : contains(l);
  const x = r.pick(pool);
  const wrong = nearLength(r, ALL.filter((y) => !plain(y.w).includes(l)), (y) => y.w, x.w.length, 3);
  return {
    kind: "choice",
    prompt: initial.length > 0 ? `¿Qué palabra empieza con la letra «${l}»?` : `¿Qué palabra tiene la letra «${l}»?`,
    options: uniqueOptions(r, label(x), wrong.map(label)),
    answer: label(x),
    explanation: initial.length > 0 ? `«${x.w}» empieza con «${l}».` : `«${x.w}» tiene la letra «${l}».`,
    tag: l,
  };
}

// Encontrar en el abecedario la letra que se escucha.
export function findLetter(r: Rng, upper: boolean, count = 6): Question {
  const l = r.pick(ALPHABET);
  const show = upper ? up : (x: string) => x;
  return {
    kind: "choice",
    prompt: "Toca 🔊 y busca la letra que escuchas.",
    options: [l, ...others(r, ALPHABET, [l], count - 1)].sort((a, b) => a.localeCompare(b, "es")).map(show),
    answer: show(l),
    explanation: `Es la letra ${both(l)}.`,
    speak: say(l),
    tag: l,
  };
}

// Letras que se confunden por su forma.
const CONFUSED = [["b", "d", "p", "q"], ["m", "n", "ñ", "u"], ["u", "v", "w", "y"], ["a", "e", "o", "c"], ["f", "t", "l", "i"], ["g", "j", "q", "y"], ["h", "n", "k", "r"]];

export function confusedLetter(r: Rng): Question {
  const group = r.pick(CONFUSED);
  const l = r.pick(group);
  return {
    kind: "choice",
    prompt: "Toca 🔊 y busca la letra. ¡Mira bien: se parecen!",
    options: r.shuffle(group),
    answer: l,
    explanation: `Es la letra «${l}».`,
    speak: say(l),
    tag: l,
  };
}

export function confusedWords(r: Rng): Question {
  const l = r.pick(["b", "d", "p", "q", "m", "n", "u", "v", "l", "t", "f"]);
  const short = ALL.filter((x) => x.w.length <= 6);
  const hits = others(r, short.filter((x) => plain(x.w).includes(l)), [], r.int(2, 3));
  const rest = others(r, short.filter((x) => !plain(x.w).includes(l)), [], 6 - hits.length);
  return {
    kind: "multi",
    prompt: `Selecciona todas las palabras que tienen la letra «${l}».`,
    options: r.shuffle([...hits, ...rest].map((x) => x.w)),
    answers: hits.map((x) => x.w),
    explanation: `Tienen «${l}»: ${hits.map((x) => x.w).join(", ")}.`,
    tag: l,
  };
}

// Unir mayúscula y minúscula dentro de un grupo de letras.
export function matchCase(r: Rng, letters: string, toLower: boolean): Question {
  const group = letters.split("");
  const l = r.pick(group);
  const opt = toLower ? (x: string) => x : up;
  return {
    kind: "choice",
    prompt: toLower ? "¿Cuál es la misma letra en minúscula?" : "¿Cuál es la misma letra en mayúscula?",
    visual: { kind: "text", text: toLower ? up(l) : l },
    options: uniqueOptions(r, opt(l), others(r, group, [l], 3).map(opt)),
    answer: opt(l),
    explanation: `${up(l)} y ${l} son la misma letra.`,
    tag: l,
  };
}

export function findCase(r: Rng, lower: boolean): Question {
  const letters = r.shuffle(ALPHABET).slice(0, 6);
  const hits = r.int(2, 4);
  const options = letters.map((l, i) => (i < hits === lower ? l : up(l)));
  return {
    kind: "multi",
    prompt: lower ? "Selecciona todas las letras minúsculas." : "Selecciona todas las letras mayúsculas.",
    options: r.shuffle(options),
    answers: options.slice(0, hits),
    explanation: `Son: ${options.slice(0, hits).join(", ")}.`,
  };
}

export function abcOrder(r: Rng): Question {
  const start = r.int(0, ALPHABET.length - 4);
  const seq = ALPHABET.slice(start, start + 4);
  let tiles = r.shuffle(seq);
  if (tiles.every((t, i) => t === seq[i])) tiles = [...tiles.slice(1), tiles[0]];
  return { kind: "sequence", prompt: "Ordena las letras como en el abecedario.", tiles, reuse: false, length: 4, answer: seq, explanation: `El orden es: ${seq.join(", ")}.` };
}

// ---------------------------------------------------------------------------
// Reconocer palabras
// ---------------------------------------------------------------------------

// Encontrar la palabra igual entre otras parecidas.
export function sameWord(r: Rng, groups: string[][]): Question {
  const group = r.pick(groups);
  const w = r.pick(group);
  return { kind: "choice", prompt: "¿Qué palabra es igual a esta?", visual: { kind: "text", text: w }, options: r.shuffle(group), answer: w, explanation: `La palabra es «${w}».` };
}

export function spacing(r: Rng, sentences: string[]): Question {
  const s = r.pick(sentences);
  const ws = s.split(" ");
  const long = ws.findIndex((w) => w.length >= 4);
  const split = ws.map((w, i) => (i === long ? `${w.slice(0, 2)} ${w.slice(2)}` : w)).join(" ");
  const wrong = [ws[0] + ws.slice(1).join(" "), split, ws.slice(0, -1).join(" ") + ws[ws.length - 1]];
  return { kind: "choice", prompt: "¿Qué oración tiene bien los espacios entre las palabras?", options: uniqueOptions(r, s, wrong), answer: s, explanation: `Cada palabra va separada: «${s}»` };
}

export function findWord(r: Rng, sentences: string[]): Question {
  const s = r.pick(sentences);
  const ws = wordsOf(s);
  const w = r.pick(ws.filter((x) => x.length >= 3));
  return { kind: "choice", prompt: "Toca 🔊 y busca esa palabra en la oración.", visual: { kind: "text", text: s }, options: ws, answer: w, explanation: `La palabra era «${w}».`, speak: w.toLowerCase() };
}

// ---------------------------------------------------------------------------
// Rima y sílabas
// ---------------------------------------------------------------------------

const pictured = (w: string) => WORDS.find((x) => x.w === w);

export function rhymePicture(r: Rng): Question {
  const g = r.pick(RHYMES.filter((x) => x.filter(pictured).length >= 2));
  const [base, match] = r.shuffle(g.filter(pictured));
  const pool = WORDS.filter((x) => !RHYMES.some((gg) => gg.includes(x.w)));
  const answer = label(pictured(match)!);
  return { kind: "choice", prompt: `¿Qué dibujo rima con «${base}»?`, options: uniqueOptions(r, answer, nearLength(r, pool, (x) => x.w, match.length, 3).map(label)), answer, explanation: `«${base}» y «${match}» riman: terminan igual.`, speak: base };
}

export function sameEnding(r: Rng): Question {
  const g = r.pick(RHYMES);
  const [base, match] = r.shuffle(g);
  const wrong = r.shuffle(RHYMES.filter((x) => x !== g)).slice(0, 3).map((x) => r.pick(x));
  return { kind: "choice", prompt: `¿Qué palabra termina igual que «${base}»?`, options: uniqueOptions(r, match, wrong), answer: match, explanation: `«${base}» y «${match}» terminan igual: riman.`, speak: base };
}

export function twoSameEnding(r: Rng): Question {
  const [g, g2, g3] = r.shuffle(RHYMES);
  const pair = r.shuffle(g).slice(0, 2);
  return { kind: "multi", prompt: "¿Qué dos palabras terminan igual?", options: r.shuffle([...pair, r.pick(g2), r.pick(g3)]), answers: pair, explanation: `«${pair[0]}» y «${pair[1]}» terminan igual: riman.` };
}

export const COMPOUNDS: [first: string, second: string][] = [
  ["saca", "puntas"], ["para", "guas"], ["gira", "sol"], ["abre", "latas"], ["lava", "platos"], ["rompe", "cabezas"], ["tela", "raña"],
  ["pasa", "tiempo"], ["cumple", "años"], ["salva", "vidas"], ["pisa", "papeles"], ["para", "caídas"], ["medio", "día"], ["guarda", "bosques"],
];

export function joinCompound(r: Rng): Question {
  const [a, b] = r.pick(COMPOUNDS);
  const whole = a + b;
  const wrong = others(r, COMPOUNDS.filter((c) => c[0] + c[1] !== whole), [], 2).map(([x, y]) => x + y);
  return { kind: "choice", prompt: "Une las dos partes. ¿Qué palabra se forma?", visual: { kind: "text", text: `${a} + ${b}` }, options: uniqueOptions(r, whole, [b + a, ...wrong]), answer: whole, explanation: `${a} + ${b} = ${whole}.`, speak: `${a}... ${b}` };
}

const COMPOUND_SWAPS: [word: string, from: string, to: string, result: string][] = [
  ["paraguas", "aguas", "sol", "parasol"], ["lavaplatos", "platos", "manos", "lavamanos"], ["sacapuntas", "puntas", "corchos", "sacacorchos"],
  ["abrelatas", "latas", "cartas", "abrecartas"], ["guardabosques", "bosques", "espaldas", "guardaespaldas"], ["pasatiempo", "tiempo", "manos", "pasamanos"],
];

// Quitar o cambiar una de las dos partes de una palabra compuesta.
export function changeCompound(r: Rng): Question {
  if (r.chance(0.5)) {
    const [w, from, to, result] = r.pick(COMPOUND_SWAPS);
    const wrong = COMPOUND_SWAPS.map((s) => s[3]).filter((x) => x !== result);
    return { kind: "choice", prompt: `En «${w}», cambia «${from}» por «${to}». ¿Qué palabra queda?`, options: uniqueOptions(r, result, [w, ...r.shuffle(wrong).slice(0, 2)]), answer: result, explanation: `Queda «${result}».`, speak: `${w}. Cambia ${from} por ${to}.` };
  }
  const [a, b] = r.pick(COMPOUNDS.filter(([x, y]) => x !== "para" && y !== "guas" && y !== "raña"));
  const first = r.chance(0.5);
  const answer = first ? b : a;
  const pool = COMPOUNDS.flat().filter((x) => x !== a && x !== b && x !== "guas" && x !== "raña");
  return { kind: "choice", prompt: `Di «${a + b}» sin «${first ? a : b}». ¿Qué queda?`, options: uniqueOptions(r, answer, [first ? a : b, ...others(r, [...new Set(pool)], [], 2)]), answer, explanation: `«${a + b}» sin «${first ? a : b}» es «${answer}».`, speak: `${a + b}, sin ${first ? a : b}` };
}

const SHORT_WORDS = ALL.filter((x) => x.syl.length <= 4);

// ¿Cuántas sílabas? Se responde tocando un número (palmadas).
export function clapSyllables(r: Rng): Question {
  const n = r.int(1, 4);
  const x = r.pick(SHORT_WORDS.filter((y) => y.syl.length === n));
  return {
    kind: "choice",
    prompt: "Da una palmada 👏 por cada sílaba. ¿Cuántas sílabas tiene la palabra?",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    options: ["1", "2", "3", "4"],
    answer: String(n),
    explanation: `${x.syl.join(" - ")}: ${n} ${n === 1 ? "sílaba" : "sílabas"}.`,
    speak: x.w,
    tag: `${n}-silabas`,
  };
}

export function moreSyllables(r: Rng): Question {
  const [n, m] = r.shuffle([1, 2, 3, 4]).slice(0, 2);
  const a = r.pick(SHORT_WORDS.filter((y) => y.syl.length === n));
  const b = r.pick(SHORT_WORDS.filter((y) => y.syl.length === m));
  const more = r.chance(0.6);
  const win = (more ? n > m : n < m) ? a : b;
  return {
    kind: "choice",
    prompt: more ? "¿Qué palabra tiene más sílabas?" : "¿Qué palabra tiene menos sílabas?",
    options: [label(a), label(b)],
    answer: label(win),
    explanation: `${a.syl.join("-")} (${n}) y ${b.syl.join("-")} (${m}).`,
    tag: more ? "mas" : "menos",
  };
}

// Sonido inicial + el resto: s + ol = sol.
const ONSET_WORDS = "sol sal pan par paz pez mar mal mes mil col con gol tos dos don luz red voz".split(" ");

export function onsetRime(r: Rng): Question {
  const w = r.pick(ONSET_WORDS);
  const same = ONSET_WORDS.filter((x) => x !== w && (x[0] === w[0] || x.slice(1) === w.slice(1)));
  const wrong = [...r.shuffle(same).slice(0, 2), ...others(r, ONSET_WORDS, [w, ...same], 2)];
  return { kind: "choice", prompt: "Une el primer sonido con el resto. ¿Qué palabra se forma?", visual: { kind: "text", text: `${w[0]} + ${w.slice(1)}` }, options: uniqueOptions(r, w, wrong), answer: w, explanation: `${w[0]} + ${w.slice(1)} = ${w}.`, speak: `${w[0]}... ${w.slice(1)}` };
}

// ---------------------------------------------------------------------------
// Sonidos y letras
// ---------------------------------------------------------------------------

const ENDS = ["a", "o", "e", "n", "l", "r"];
const last = (x: Word) => x.w[x.w.length - 1];

export function sameEndWord(r: Rng): Question {
  const e = r.pick(ENDS.filter((k) => WORDS.filter((x) => last(x) === k).length >= 2));
  const [base, match] = others(r, WORDS.filter((x) => last(x) === e), [], 2);
  const wrong = others(r, WORDS.filter((x) => last(x) !== e), [], 3);
  return { kind: "choice", prompt: `¿Qué palabra termina con el mismo sonido que «${base.w}»?`, options: uniqueOptions(r, label(match), wrong.map(label)), answer: label(match), explanation: `«${base.w}» y «${match.w}» terminan con /${e}/.`, speak: base.w };
}

const CLEAR = "mpltsrnbfd".split("");

export function wordsStartingWith(r: Rng): Question {
  // Sin ll ni ch al inicio: son otro sonido.
  const simple = WORDS.filter((x) => !/^(ll|ch)/.test(x.w));
  const l = r.pick(CLEAR.filter((c) => simple.filter((x) => x.w[0] === c).length >= 3));
  const hits = others(r, simple.filter((x) => x.w[0] === l), [], r.int(2, 3));
  const rest = others(r, simple.filter((x) => x.w[0] !== l), [], 5 - hits.length);
  return {
    kind: "multi",
    prompt: `Selecciona las palabras que empiezan con el sonido /${l}/.`,
    options: r.shuffle([...hits, ...rest].map(label)),
    answers: hits.map(label),
    explanation: `Empiezan con /${l}/: ${hits.map((x) => x.w).join(", ")}.`,
    speak: `Selecciona las palabras que empiezan como ${l}a`,
    tag: l,
  };
}

// Escuchar una sílaba y elegir la consonante con la que empieza. Las letras
// de un mismo juego nunca suenan igual (no se mezclan b/v, c/k/q, s/z, ll/y).
export function heardConsonant(r: Rng, letters: string[]): Question {
  const c = r.pick(letters);
  const v = r.pick(c === "c" || c === "g" ? ["a", "o", "u"] : c === "ñ" ? ["a", "o"] : ["a", "e", "i", "o", "u"]);
  const syl = c + v;
  return {
    kind: "choice",
    prompt: "Toca 🔊 y escucha la sílaba. ¿Con qué letra empieza?",
    options: letters.length <= 5 ? letters : [c, ...others(r, letters, [c], 3)].sort((a, b) => a.localeCompare(b, "es")),
    answer: c,
    explanation: `Era «${syl}»: empieza con «${c}».`,
    speak: syl,
    tag: c,
  };
}

// Palabras con una sola vocal (repetida o no): encontrar la que tiene la vocal pedida.
const VOWEL_WORDS: Record<string, string[]> = {
  a: ["casa", "rana", "papa", "cama", "taza", "mapa", "sal", "pan", "mar"],
  e: ["pez", "tren", "leche", "bebé", "nene", "mes", "red", "pele"],
  i: ["kiwi", "mil", "sí", "bici", "gris", "fin", "Lili"],
  o: ["oso", "sol", "ojo", "loro", "lobo", "mono", "coco", "foto"],
  u: ["luz", "tú", "sur", "cruz", "bus", "tutú", "cucú"],
};

export function findVowelWord(r: Rng, v: string): Question {
  const w = r.pick(VOWEL_WORDS[v]);
  const wrong = r.shuffle(Object.keys(VOWEL_WORDS).filter((k) => k !== v)).slice(0, 3).map((k) => r.pick(VOWEL_WORDS[k]));
  return { kind: "choice", prompt: `¿Qué palabra tiene la vocal «${v}»?`, options: uniqueOptions(r, w, wrong), answer: w, explanation: `«${w}» tiene la vocal «${v}».`, tag: v };
}

// Palabras que empiezan con vocal (con dibujo propio: no todas están en el banco).
const VOWEL_START: Record<string, [string, string][]> = {
  a: [["🐝", "abeja"], ["🕷️", "araña"], ["🌳", "árbol"], ["✈️", "avión"], ["⚓", "ancla"], ["💍", "anillo"], ["🐿️", "ardilla"]],
  e: [["🐘", "elefante"], ["⭐", "estrella"], ["🦔", "erizo"], ["🧹", "escoba"], ["🪞", "espejo"], ["🪜", "escalera"]],
  i: [["🧲", "imán"], ["🏝️", "isla"], ["⛪", "iglesia"], ["🦎", "iguana"], ["💉", "inyección"]],
  o: [["🐻", "oso"], ["🐑", "oveja"], ["👁️", "ojo"], ["👂", "oreja"], ["8️⃣", "ocho"], ["🌊", "ola"]],
  u: [["🍇", "uva"], ["💅", "uña"], ["1️⃣", "uno"], ["🦄", "unicornio"], ["🪐", "universo"]],
};

export function startsWithVowel(r: Rng, v: string): Question {
  const show = ([e, w]: [string, string]) => `${e} ${w}`;
  const x = r.pick(VOWEL_START[v]);
  const pool = Object.keys(VOWEL_START).filter((k) => k !== v).flatMap((k) => VOWEL_START[k]);
  const wrong = nearLength(r, pool, (y) => y[1], x[1].length, 3).map(show);
  return { kind: "choice", prompt: `¿Qué palabra empieza con la vocal «${v}»?`, options: uniqueOptions(r, show(x), wrong), answer: show(x), explanation: `«${x[1]}» empieza con «${v}».`, tag: v };
}

// ¿Qué trabada suena? (sin la palabra escrita: se escucha y se mira el dibujo)
const BLENDS = ["bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr"];
const START_BLEND = "plato playa planta plátano globo flor fresa tren trompeta brocha dragón grillo flamenco bróculi".split(" ").filter((w) => ALL.some((x) => x.w === w));
const MIDDLE_BLEND = "libro cabra tigre cebra sombrero ancla bicicleta cocodrilo estrella cangrejo regla cable pueblo niebla templo".split(" ");

export function whichBlend(r: Rng, where: "start" | "middle"): Question {
  const w = r.pick(where === "start" ? START_BLEND : MIDDLE_BLEND);
  const x = ALL.find((y) => y.w === w)!;
  const blend = where === "start" ? w.slice(0, 2) : BLENDS.find((b) => w.indexOf(b) > 0)!;
  const near = BLENDS.filter((b) => b !== blend && (b[0] === blend[0] || b[1] === blend[1]));
  return {
    kind: "choice",
    prompt: where === "start" ? "Escucha la palabra. ¿Con qué trabada empieza?" : "Escucha la palabra. ¿Qué trabada suena en medio?",
    visual: { kind: "picture", emoji: x.e },
    options: uniqueOptions(r, blend, [...r.shuffle(near).slice(0, 2), ...others(r, BLENDS, [blend, ...near], 1)]),
    answer: blend,
    explanation: `«${w}» tiene «${blend}».`,
    speak: w,
    tag: blend,
  };
}

// ---------------------------------------------------------------------------
// Palabras frecuentes (10 grupos de 5)
// ---------------------------------------------------------------------------

export const K_SIGHT: string[][] = [
  ["el", "la", "un", "una", "en"],
  ["yo", "mi", "tu", "es", "de"],
  ["no", "sí", "con", "se", "que"],
  ["los", "las", "por", "me", "lo"],
  ["más", "muy", "hay", "soy", "voy"],
  ["ella", "su", "al", "del", "son"],
  ["este", "esta", "aquí", "hoy", "ya"],
  ["bien", "mal", "todo", "nada", "otro"],
  ["para", "pero", "como", "fue", "era"],
  ["tengo", "quiero", "veo", "está", "dijo"],
];

export function readSight(r: Rng, sets: number[]): Question {
  const pool = sets.flatMap((i) => K_SIGHT[i - 1]);
  const w = r.pick(pool);
  return { kind: "choice", prompt: "Toca 🔊, escucha y elige la palabra.", options: uniqueOptions(r, w, pool.filter((x) => x !== w)), answer: w, explanation: `La palabra era «${w}».`, speak: w, tag: w };
}

export function spellSight(r: Rng): Question {
  const w = r.pick(K_SIGHT.flat().filter((x) => x.length >= 3 && x.length <= 5));
  const letters = [...w];
  const pool = "aeiolmnrst".split("").filter((c) => !letters.includes(c));
  return { kind: "sequence", prompt: "Toca 🔊, escucha y escribe la palabra.", tiles: r.shuffle([...new Set(letters), ...others(r, pool, [], 2)]), reuse: true, length: letters.length, answer: letters, explanation: `Se escribe «${w}».`, speak: w };
}
