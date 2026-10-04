import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";
import { baseVowel, label, VOWELS, word, WORDS, type Word } from "./words";

// Generadores de fundamentos de lectura (conciencia fonológica, vocales,
// sílabas, dígrafos, trabadas, ortografía). Cada uno recibe la lista de
// palabras del juego, así el mismo generador sirve para varios juegos/grados.

const ORDINALS = ["primer", "segundo", "tercer", "cuarto", "quinto", "sexto"];

function pickOthers<T>(r: Rng, pool: T[], exclude: T[], n: number): T[] {
  return r.shuffle(pool.filter((x) => !exclude.includes(x))).slice(0, n);
}

function pictureOf(x: Word) {
  return { kind: "picture" as const, emoji: x.e };
}

// Letras de una palabra como sonidos/grafías: ch, ll, rr y qu cuentan como una.
export function graphemes(w: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const two = w.slice(i, i + 2);
    if (["ch", "ll", "rr", "qu"].includes(two)) {
      out.push(two);
      i++;
    } else out.push(w[i]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// A. Vocales y consonantes
// ---------------------------------------------------------------------------

const CONSONANTS = "bcdfghjklmnñprstvyz".split("");

export function sortLetters(r: Rng): Question {
  const wantVowels = r.chance(0.5);
  const vowels = r.shuffle(VOWELS).slice(0, r.int(2, 4));
  const consonants = r.shuffle(CONSONANTS).slice(0, 8 - vowels.length);
  const options = r.shuffle([...vowels, ...consonants]);
  return {
    kind: "multi",
    prompt: `Selecciona todas las ${wantVowels ? "vocales" : "consonantes"}.`,
    options,
    answers: wantVowels ? vowels : consonants,
    explanation: "Las vocales son a, e, i, o, u. Las demás letras son consonantes.",
    tag: wantVowels ? "vocales" : "consonantes",
  };
}

export function vowelsInWord(r: Rng): Question {
  const x = r.pick(WORDS.filter((w) => new Set(w.w).size >= 3));
  const letters = [...new Set([...x.w])];
  const answers = letters.filter((ch) => baseVowel(ch));
  return {
    kind: "multi",
    prompt: `Selecciona las vocales de la palabra «${x.w}».`,
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    options: letters,
    answers,
    explanation: `Las vocales de «${x.w}» son: ${answers.join(", ")}.`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// B. Rima
// ---------------------------------------------------------------------------

// Grupos que riman (misma terminación desde la vocal acentuada).
export const RHYMES: string[][] = [
  ["gato", "pato", "zapato", "plato", "olfato"],
  ["ratón", "camión", "avión", "limón", "dragón", "tiburón", "balón", "botón", "corazón"],
  ["rana", "manzana", "campana", "ventana", "lana", "semana"],
  ["rosa", "mariposa", "osa", "cosa", "hermosa"],
  ["pelota", "bota", "gota", "nota"],
  ["trompeta", "bicicleta", "galleta", "maleta", "camiseta"],
  ["sombrero", "bombero", "panadero", "cartero"],
  ["silla", "ardilla", "semilla", "tortilla", "orilla"],
  ["ballena", "cadena", "sirena", "arena"],
  ["camello", "cuello", "sello", "bello"],
];

const withPicture = (w: string) => WORDS.find((x) => x.w === w);

export function rhymePicture(r: Rng): Question {
  const groups = RHYMES.filter((g) => g.filter(withPicture).length >= 2);
  const g = r.pick(groups);
  const [base, match] = r.shuffle(g.filter(withPicture));
  const others = WORDS.filter((x) => !RHYMES.some((gg) => gg.includes(x.w)));
  const answer = label(word(match));
  return {
    kind: "choice",
    prompt: `¿Qué dibujo rima con «${base}»?`,
    options: uniqueOptions(r, answer, pickOthers(r, others, [], 3).map(label)),
    answer,
    explanation: `«${base}» y «${match}» riman: terminan igual.`,
    speak: base,
  };
}

export function rhymeSet(r: Rng): Question {
  const g = r.pick(RHYMES.filter((x) => x.length >= 4));
  const [base, ...rest] = r.shuffle(g);
  const hits = rest.slice(0, r.int(2, 3));
  const others = pickOthers(r, RHYMES.filter((x) => x !== g).flat(), [], 6 - hits.length);
  return {
    kind: "multi",
    prompt: `Selecciona todas las palabras que riman con «${base}».`,
    options: r.shuffle([...hits, ...others]),
    answers: hits,
    explanation: `Riman con «${base}»: ${hits.join(", ")}.`,
    speak: base,
  };
}

export function notRhyme(r: Rng): Question {
  const g = r.pick(RHYMES);
  const three = r.shuffle(g).slice(0, 3);
  const odd = r.pick(RHYMES.filter((x) => x !== g).flat());
  return {
    kind: "choice",
    prompt: "¿Qué palabra NO rima con las demás?",
    options: r.shuffle([...three, odd]),
    answer: odd,
    explanation: `${three.join(", ")} riman entre sí; «${odd}» no.`,
  };
}

// ---------------------------------------------------------------------------
// C. Sílabas
// ---------------------------------------------------------------------------

export function countSyllables(r: Rng): Question {
  const x = r.pick(WORDS);
  return {
    kind: "number",
    prompt: "¿Cuántas sílabas tiene la palabra? Da una palmada por cada sílaba.",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    answer: x.syl.length,
    explanation: `${x.syl.join(" - ")}: ${x.syl.length} ${x.syl.length === 1 ? "sílaba" : "sílabas"}.`,
    speak: x.w,
    tag: `${x.syl.length}-silabas`,
  };
}

export function sortBySyllables(r: Rng): Question {
  const n = r.int(1, 4);
  const hits = pickOthers(r, WORDS.filter((x) => x.syl.length === n), [], r.int(2, 3));
  const others = pickOthers(r, WORDS.filter((x) => x.syl.length !== n), [], 6 - hits.length);
  return {
    kind: "multi",
    prompt: `Selecciona las palabras que tienen ${n} ${n === 1 ? "sílaba" : "sílabas"}.`,
    options: r.shuffle([...hits, ...others].map(label)),
    answers: hits.map(label),
    explanation: hits.map((x) => x.syl.join("-")).join(", ") + ".",
    tag: `${n}-silabas`,
  };
}

// ---------------------------------------------------------------------------
// D. Unir y separar sonidos (palabras de escritura transparente)
// ---------------------------------------------------------------------------

export const PHONETIC = words(
  "sol pan mar sal luna mano pato rana uva oso mono pera lobo dado nido foca sopa tomate papa nube pie flor tren pelota limón ratón"
);

function words(list: string) {
  return list.split(" ").map(word);
}

export function blendSounds(r: Rng): Question {
  const x = r.pick(PHONETIC);
  const answer = label(x);
  const similar = PHONETIC.filter((y) => y !== x && Math.abs(y.w.length - x.w.length) <= 1);
  return {
    kind: "choice",
    prompt: "Une los sonidos. ¿Qué palabra forman?",
    visual: { kind: "text", text: [...x.w].map((ch) => `/${ch}/`).join(" ") },
    options: uniqueOptions(r, answer, pickOthers(r, similar, [], 3).map(label)),
    answer,
    explanation: `${[...x.w].join(" + ")} = ${x.w}.`,
  };
}

export function identifySound(r: Rng): Question {
  const x = r.pick(PHONETIC.filter((y) => y.w.length >= 3));
  const letters = [...x.w];
  const i = r.int(0, letters.length - 1);
  const pos = i === letters.length - 1 ? "último" : ORDINALS[i];
  const answer = letters[i];
  const pool = "aeioumpstlnrdbf".split("").filter((c) => c !== answer);
  return {
    kind: "choice",
    prompt: `¿Cuál es el ${pos} sonido de «${x.w}»?`,
    visual: pictureOf(x),
    options: uniqueOptions(r, answer, pickOthers(r, pool, [], 3)),
    answer,
    explanation: `${letters.map((c) => `/${c}/`).join(" ")}: el ${pos} sonido es /${answer}/.`,
    speak: x.w,
  };
}

export function orderSounds(r: Rng): Question {
  const x = r.pick(PHONETIC.filter((y) => new Set(y.w).size === y.w.length));
  const letters = [...x.w];
  return {
    kind: "sequence",
    prompt: "Ordena los sonidos para formar la palabra del dibujo.",
    visual: pictureOf(x),
    tiles: r.shuffle(letters),
    reuse: false,
    length: letters.length,
    answer: letters,
    explanation: `La palabra es «${x.w}».`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// E. Cambiar sonidos: pares de palabras que difieren en un sonido.
// ---------------------------------------------------------------------------

export const FIRST_SOUND_PAIRS: [string, string][] = [
  ["pato", "gato"], ["gato", "pato"], ["rana", "lana"], ["mesa", "pesa"], ["casa", "masa"],
  ["sopa", "ropa"], ["luna", "cuna"], ["boca", "foca"], ["foca", "roca"], ["dado", "lado"],
  ["nube", "sube"], ["pera", "cera"], ["mapa", "capa"], ["sol", "col"], ["mono", "tono"],
];
export const LAST_SOUND_PAIRS: [string, string][] = [
  ["gato", "gata"], ["pato", "pata"], ["mono", "mona"], ["oso", "osa"], ["pan", "par"],
  ["mar", "mal"], ["col", "con"], ["dos", "don"], ["niño", "niña"], ["loro", "lora"],
  ["lobo", "loba"], ["foco", "foca"], ["tren", "tres"],
];
export const VOWEL_PAIRS: [string, string][] = [
  ["sol", "sal"], ["mesa", "misa"], ["pala", "pela"], ["peso", "piso"], ["palo", "polo"],
  ["casa", "cosa"], ["masa", "mesa"], ["pila", "pala"], ["rata", "rota"], ["lana", "luna"],
  ["pato", "pito"], ["pan", "pin"], ["mapa", "mopa"],
];

export function changeSound(r: Rng, pairs: [string, string][], where: string): Question {
  const [from, to] = r.pick(pairs);
  const i = [...from].findIndex((c, k) => c !== to[k]);
  const a = from[i];
  const b = to[i];
  const distract = pairs.flat().filter((w) => w !== to && w !== from && Math.abs(w.length - to.length) <= 1);
  return {
    kind: "choice",
    prompt: `Cambia ${where} /${a}/ de «${from}» por /${b}/. ¿Qué palabra se forma?`,
    options: uniqueOptions(r, to, [from, ...pickOthers(r, distract, [], 3)]),
    answer: to,
    explanation: `«${from}» con /${b}/ en lugar de /${a}/ es «${to}».`,
    speak: from,
    tag: where,
  };
}

// ---------------------------------------------------------------------------
// F. Sonidos y letras
// ---------------------------------------------------------------------------

// Letras iniciales sin ambigüedad de sonido (sin c, g, q, h, z, y, x).
const CLEAR_START = "mpltsrnbfdv".split("");

function startLetter(x: Word) {
  return x.w[0];
}

export function sameStart(r: Rng): Question {
  const letters = CLEAR_START.filter((l) => WORDS.filter((x) => startLetter(x) === l).length >= 2);
  const l = r.pick(letters);
  const pair = pickOthers(r, WORDS.filter((x) => startLetter(x) === l), [], 2);
  const others = pickOthers(r, WORDS.filter((x) => CLEAR_START.includes(startLetter(x)) && startLetter(x) !== l), [], 2);
  // Que los dos distractores no empiecen igual entre sí.
  if (startLetter(others[0]) === startLetter(others[1])) return sameStart(r);
  return {
    kind: "multi",
    prompt: "¿Qué dos palabras empiezan con el mismo sonido?",
    options: r.shuffle([...pair, ...others].map(label)),
    answers: pair.map(label),
    explanation: `«${pair[0].w}» y «${pair[1].w}» empiezan con /${l}/.`,
  };
}

export function sameEnd(r: Rng): Question {
  const ends = ["a", "o", "e", "n", "l", "r"];
  const last = (x: Word) => x.w[x.w.length - 1];
  const e = r.pick(ends.filter((k) => WORDS.filter((x) => last(x) === k).length >= 2));
  const pair = pickOthers(r, WORDS.filter((x) => last(x) === e), [], 2);
  const pool = WORDS.filter((x) => last(x) !== e && ends.includes(last(x)));
  const others = pickOthers(r, pool, [], 2);
  if (last(others[0]) === last(others[1])) return sameEnd(r);
  return {
    kind: "multi",
    prompt: "¿Qué dos palabras terminan con el mismo sonido?",
    options: r.shuffle([...pair, ...others].map(label)),
    answers: pair.map(label),
    explanation: `«${pair[0].w}» y «${pair[1].w}» terminan con /${e}/.`,
  };
}

export function letterAt(r: Rng, position: "first" | "last"): Question {
  const letters0 = "abdefilmnoprstuvz".split("");
  const pool = WORDS.filter((x) =>
    position === "first"
      ? CLEAR_START.includes(startLetter(x)) || VOWELS.includes(startLetter(x))
      : letters0.includes(x.w[x.w.length - 1])
  );
  const x = r.pick(pool);
  const answer = position === "first" ? x.w[0] : x.w[x.w.length - 1];
  const letters = letters0.filter((c) => c !== answer);
  return {
    kind: "choice",
    prompt: `Escucha la palabra. ¿Con qué letra ${position === "first" ? "empieza" : "termina"}?`,
    visual: pictureOf(x),
    options: uniqueOptions(r, answer, pickOthers(r, letters, [], 3)),
    answer,
    explanation: `«${x.w}» ${position === "first" ? "empieza" : "termina"} con «${answer}».`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// Completar una parte de la palabra (dígrafo, sílaba, trabada, diptongo).
// ---------------------------------------------------------------------------

// Muestra la palabra con `part` reemplazada por huecos y pide la parte.
export function completePart(
  r: Rng,
  list: { w: string; part: string }[],
  choices: string[],
  prompt = "Completa la palabra."
): Question {
  const item = r.pick(list);
  const x = WORDS.find((y) => y.w === item.w);
  const i = item.w.indexOf(item.part);
  const shown = item.w.slice(0, i) + "_".repeat(item.part.length) + item.w.slice(i + item.part.length);
  return {
    kind: "choice",
    prompt,
    visual: x ? { kind: "picture", emoji: x.e, caption: shown } : { kind: "text", text: shown },
    options: uniqueOptions(r, item.part, choices.filter((c) => c !== item.part)),
    answer: item.part,
    explanation: `Se escribe «${item.w}».`,
    speak: item.w,
    tag: item.part,
  };
}

function parts(list: string, part: (w: string) => string): { w: string; part: string }[] {
  return list.split(" ").map((w) => ({ w, part: part(w) }));
}

function firstMatch(re: RegExp) {
  return (w: string) => (w.match(re) ?? [""])[0];
}

export const DIGRAPH_START = parts("chocolate llave lluvia llama queso", firstMatch(/ch|ll|rr|qu/));
export const DIGRAPH_ANY = parts(
  "chocolate llave lluvia llama queso coche leche cuchara brocha pollo silla caballo galleta estrella gallina camello ballena perro zorro gorro guitarra",
  firstMatch(/ch|ll|rr|qu/)
);
export const DOUBLE_AND_Ñ = parts("perro zorro gorro guitarra pollo silla caballo galleta coche leche piña araña montaña", firstMatch(/rr|ll|ch|ñ/));

// ---------------------------------------------------------------------------
// H-M. Vocales: elegir palabra o dibujo, completar sílaba, deletrear.
// ---------------------------------------------------------------------------

export function wordForPicture(r: Rng, list: string): Question {
  const bank = words(list);
  const x = r.pick(bank);
  const pool = bank.length >= 4 ? bank : [...bank, ...WORDS];
  return {
    kind: "choice",
    prompt: "¿Qué palabra corresponde al dibujo?",
    visual: pictureOf(x),
    options: uniqueOptions(r, x.w, pickOthers(r, pool, [x], 3).map((y) => y.w)),
    answer: x.w,
    explanation: `Es ${x.e} «${x.w}».`,
    speak: x.w,
  };
}

export function pictureForWord(r: Rng, list: string): Question {
  const bank = words(list);
  const x = r.pick(bank);
  const pool = bank.length >= 4 ? bank : [...bank, ...WORDS];
  return {
    kind: "choice",
    prompt: "¿Qué dibujo corresponde a la palabra?",
    visual: { kind: "text", text: x.w },
    options: uniqueOptions(r, x.e, pickOthers(r, pool, [x], 3).map((y) => y.e)),
    answer: x.e,
    explanation: `«${x.w}» es ${x.e}.`,
    speak: x.w,
  };
}

// Falta la primera sílaba; las opciones cambian solo la vocal.
export function completeSyllable(r: Rng, list: string): Question {
  // Con una sola sílaba, "falta una sílaba" sería escribir la palabra entera.
  const x = r.pick(words(list).filter((y) => y.syl.length >= 2));
  const syl = x.syl[0];
  const vi = [...syl].findIndex((c) => baseVowel(c));
  const options = VOWELS.map((v) => syl.slice(0, vi) + v + syl.slice(vi + 1));
  const answer = syl;
  return {
    kind: "choice",
    prompt: "¿Qué sílaba falta?",
    visual: { kind: "picture", emoji: x.e, caption: `__${x.w.slice(syl.length)}` },
    options: uniqueOptions(r, answer, options.filter((o) => o !== answer)),
    answer,
    explanation: `${x.syl.join("-")}: falta «${syl}».`,
    speak: x.w,
  };
}

export function identifyVowel(r: Rng, list: string): Question {
  const x = r.pick(words(list));
  const v = [...x.w].map(baseVowel).find(Boolean)!;
  return {
    kind: "choice",
    prompt: `¿Qué vocal suena en «${x.w}»?`,
    visual: pictureOf(x),
    options: VOWELS,
    answer: v,
    explanation: `En «${x.w}» suena la «${v}».`,
    speak: x.w,
    tag: v,
  };
}

// Falta una vocal; el dibujo dice cuál es.
export function completeVowel(r: Rng, list: string): Question {
  const x = r.pick(words(list));
  const idx = [...x.w].map((c, i) => (baseVowel(c) ? i : -1)).filter((i) => i >= 0);
  const i = r.pick(idx);
  const answer = baseVowel(x.w[i])!;
  return {
    kind: "choice",
    prompt: "¿Qué vocal falta?",
    visual: { kind: "picture", emoji: x.e, caption: x.w.slice(0, i) + "_" + x.w.slice(i + 1) },
    options: VOWELS,
    answer,
    explanation: `Se escribe «${x.w}».`,
    speak: x.w,
    tag: answer,
  };
}

export function changeOneLetter(r: Rng, pairs: [string, string][]): Question {
  const [from, to] = r.pick(pairs);
  const target = word(to);
  const distract = pairs.map((p) => p[1]).filter((w) => w !== to);
  return {
    kind: "choice",
    prompt: `Cambia una letra de «${from}» para formar la palabra del dibujo.`,
    visual: pictureOf(target),
    options: uniqueOptions(r, to, [from, ...pickOthers(r, distract, [], 3)]),
    answer: to,
    explanation: `«${from}» → «${to}».`,
  };
}

export const ONE_LETTER_PAIRS: [string, string][] = [
  ["pato", "gato"], ["gato", "pato"], ["boca", "foca"], ["foca", "boca"], ["mano", "mono"], ["mono", "mano"],
  ["sal", "sol"], ["sol", "sal"], ["casa", "cama"], ["cama", "casa"], ["bota", "boca"], ["boca", "bota"],
  ["oso", "ojo"], ["ojo", "oso"],
];

// Deletrear: fichas con las letras (o dígrafos) de la palabra y dos de más.
export function spellWord(r: Rng, list: string, extras = "a e i o u m l p s t r n"): Question {
  const x = r.pick(words(list));
  const g = graphemes(x.w);
  const pool = extras.split(" ").filter((c) => !g.includes(c));
  const tiles = r.shuffle([...new Set(g), ...pickOthers(r, pool, [], 2)]);
  return {
    kind: "sequence",
    prompt: "Escribe la palabra del dibujo. Toca las letras en orden.",
    visual: pictureOf(x),
    tiles,
    reuse: true,
    length: g.length,
    answer: g,
    explanation: `Se escribe «${x.w}».`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// N. Trabadas (grupos consonánticos)
// ---------------------------------------------------------------------------

const BLENDS = ["bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr"];
const startBlend = (w: string) => (BLENDS.includes(w.slice(0, 2)) ? w.slice(0, 2) : null);
const middleBlend = (w: string) => BLENDS.find((b) => w.indexOf(b) > 0) ?? null;

export const START_BLEND_WORDS = "plato playa planta plátano globo flor fresa tren trompeta brocha dragón grillo";
export const MIDDLE_BLEND_WORDS = "libro cabra tigre cebra sombrero ancla bicicleta cocodrilo estrella cangrejo";

export function hasBlend(r: Rng, where: "start" | "middle"): Question {
  const yesList = words(where === "start" ? START_BLEND_WORDS : MIDDLE_BLEND_WORDS);
  const test = where === "start" ? startBlend : middleBlend;
  const noList = WORDS.filter((x) => !BLENDS.some((b) => x.w.includes(b)));
  const yes = r.chance(0.5);
  const x = r.pick(yes ? yesList : noList);
  const blend = test(x.w);
  return {
    kind: "choice",
    prompt: where === "start" ? "¿La palabra empieza con una trabada (como pl, br, tr)?" : "¿La palabra tiene una trabada en medio (como br, gr, tr)?",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    options: ["Sí", "No"],
    answer: blend ? "Sí" : "No",
    explanation: blend ? `Sí: «${x.w}» tiene «${blend}».` : `No: «${x.w}» no tiene trabada${where === "start" ? " al inicio" : ""}.`,
    speak: x.w,
  };
}

export function completeBlend(r: Rng, where: "start" | "middle"): Question {
  const list = (where === "start" ? START_BLEND_WORDS : MIDDLE_BLEND_WORDS).split(" ").map((w) => ({
    w,
    part: (where === "start" ? startBlend(w) : middleBlend(w))!,
  }));
  const item = r.pick(list);
  const same = BLENDS.filter((b) => b[1] === item.part[1] || b[0] === item.part[0]);
  return completePart(r, [item], same, "¿Qué trabada falta?");
}

export function sortBlend(r: Rng): Question {
  const all = words(START_BLEND_WORDS + " " + "llave lluvia chocolate queso");
  const firstPart = (w: string) => startBlend(w) ?? w.slice(0, 2);
  const groups = [...new Set(all.map((x) => firstPart(x.w)))].filter((b) => all.filter((x) => firstPart(x.w) === b).length >= 2);
  const b = r.pick(groups);
  const hits = all.filter((x) => firstPart(x.w) === b);
  const others = pickOthers(r, all.filter((x) => firstPart(x.w) !== b), [], 6 - hits.length);
  return {
    kind: "multi",
    prompt: `Selecciona las palabras que empiezan con «${b}».`,
    options: r.shuffle([...hits, ...others].map(label)),
    answers: hits.map(label),
    explanation: `Empiezan con «${b}»: ${hits.map((x) => x.w).join(", ")}.`,
    tag: b,
  };
}

// La palabra correcta frente a la misma con otra trabada.
export function fillBlend(r: Rng): Question {
  const x = r.pick(words(START_BLEND_WORDS));
  const b = startBlend(x.w)!;
  const wrong = BLENDS.filter((o) => o !== b && (o[1] === b[1] || o[0] === b[0])).map((o) => o + x.w.slice(2));
  return {
    kind: "choice",
    prompt: "¿Qué palabra corresponde al dibujo?",
    visual: pictureOf(x),
    options: uniqueOptions(r, x.w, wrong),
    answer: x.w,
    explanation: `Es «${x.w}», con «${b}».`,
    speak: x.w,
  };
}

// m antes de p y b.
export const M_OR_N = [
  ...parts("campana tambor sombrero bombero trompeta", () => "m"),
  ...parts("manzana naranja cangrejo ventana elefante montaña pingüino planta", () => "n"),
].map(({ w, part }) => {
  const i = [...w].findIndex((c, k) => c === part && k < w.length - 1 && !"aeiouáéíóú".includes(w[k + 1]));
  return { w, part: w[i], at: i };
});

export function mOrN(r: Rng): Question {
  const item = r.pick(M_OR_N);
  const x = word(item.w);
  return {
    kind: "choice",
    prompt: "¿Va «m» o «n»? Recuerda: antes de p y b se escribe m.",
    visual: { kind: "picture", emoji: x.e, caption: item.w.slice(0, item.at) + "_" + item.w.slice(item.at + 1) },
    options: ["m", "n"],
    answer: item.part,
    explanation: `Se escribe «${item.w}».`,
    speak: item.w,
    tag: item.part === "m" ? "mp-mb" : "n",
  };
}

// ---------------------------------------------------------------------------
// O. Misma vocal
// ---------------------------------------------------------------------------

export const ONE_VOWEL: Record<string, string[]> = {
  a: ["casa", "rana", "papa", "cama", "taza", "mapa", "sal", "pan", "mar", "llama", "hada", "ancla", "campana"],
  e: ["pez", "tren", "leche", "bebé", "nene", "verde", "mes", "red", "pared"],
  i: ["kiwi", "mil", "mini", "sí", "Lili"],
  o: ["oso", "sol", "ojo", "loro", "lobo", "mono", "gorro", "zorro", "globo", "flor", "coco", "foto"],
  u: ["tú", "tul", "sur", "luz", "cruz", "tutú"],
};

const vowelOf = (w: string) => Object.keys(ONE_VOWEL).find((v) => ONE_VOWEL[v].includes(w))!;

export function sameVowelWord(r: Rng): Question {
  const v = r.pick(["a", "e", "o"]);
  const [base, match] = r.shuffle(ONE_VOWEL[v]);
  const others = VOWELS.filter((x) => x !== v).map((x) => r.pick(ONE_VOWEL[x]));
  return {
    kind: "choice",
    prompt: `¿Qué palabra tiene la misma vocal que «${base}»?`,
    options: uniqueOptions(r, match, others),
    answer: match,
    explanation: `«${base}» y «${match}» solo tienen la vocal «${v}».`,
    speak: base,
    tag: v,
  };
}

export function twoSameVowel(r: Rng): Question {
  const [v, w2, w3] = r.shuffle(VOWELS);
  const pair = r.shuffle(ONE_VOWEL[v]).slice(0, 2);
  const others = [r.pick(ONE_VOWEL[w2]), r.pick(ONE_VOWEL[w3])];
  return {
    kind: "multi",
    prompt: "¿Qué dos palabras tienen la misma vocal?",
    options: r.shuffle([...pair, ...others]),
    answers: pair,
    explanation: `«${pair[0]}» y «${pair[1]}» tienen la vocal «${v}».`,
    tag: v,
  };
}

export function sortByVowel(r: Rng): Question {
  const v = r.pick(["a", "e", "o"]);
  const hits = r.shuffle(ONE_VOWEL[v]).slice(0, 3);
  const others = r.shuffle(VOWELS.filter((x) => x !== v).flatMap((x) => ONE_VOWEL[x])).slice(0, 3);
  return {
    kind: "multi",
    prompt: `Selecciona las palabras que solo tienen la vocal «${v}».`,
    options: r.shuffle([...hits, ...others]),
    answers: hits,
    explanation: `Solo tienen «${v}»: ${hits.join(", ")}.`,
    tag: v,
  };
}

export { vowelOf };

// ---------------------------------------------------------------------------
// R-S. Ortografía: clasificar o elegir la escritura correcta.
// ---------------------------------------------------------------------------

export function sortSpelling(r: Rng, pattern: string, yes: string[], no: string[]): Question {
  const hits = r.shuffle(yes).slice(0, 3);
  const others = r.shuffle(no).slice(0, 3);
  return {
    kind: "multi",
    prompt: `Selecciona las palabras que se escriben con «${pattern}».`,
    options: r.shuffle([...hits, ...others]),
    answers: hits,
    explanation: `Se escriben con «${pattern}»: ${hits.join(", ")}.`,
    tag: pattern,
  };
}

// Palabra con dibujo vs. la misma con letras intercambiadas (b/d, p/q, b/v...).
export function correctSpelling(r: Rng, list: string, swaps: [string, string][]): Question {
  const x = r.pick(words(list));
  const wrong = swaps
    .flatMap(([a, b]) => [x.w.replace(a, b), x.w.replace(b, a)])
    .concat(swaps.flatMap(([a, b]) => [x.w.split(a).join(b), x.w.split(b).join(a)]))
    .filter((w) => w !== x.w);
  return {
    kind: "choice",
    prompt: "¿Cuál está bien escrita?",
    visual: pictureOf(x),
    options: uniqueOptions(r, x.w, wrong),
    answer: x.w,
    explanation: `Se escribe «${x.w}».`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// V. Palabras de dos sílabas
// ---------------------------------------------------------------------------

const TWO = WORDS.filter((x) => x.syl.length === 2);

export function segmentWord(r: Rng): Question {
  const x = r.pick(TWO.filter((y) => y.w.length >= 4));
  const answer = x.syl.join("-");
  const w = x.w;
  const cut = x.syl[0].length;
  const wrong = [w.slice(0, cut + 1) + "-" + w.slice(cut + 1), w.slice(0, cut - 1) + "-" + w.slice(cut - 1), w.slice(0, 1) + "-" + w.slice(1)].filter(
    (o) => o !== answer && !o.startsWith("-") && !o.endsWith("-")
  );
  return {
    kind: "choice",
    prompt: `¿Cómo se separa «${w}» en sílabas?`,
    visual: pictureOf(x),
    options: uniqueOptions(r, answer, wrong),
    answer,
    explanation: `${answer}: dos sílabas.`,
    speak: w,
  };
}

const HARD_TWO = words("globo libro coche perro tigre cabra lluvia playa llave fresa brocha pollo silla zorro plato");

export function joinSyllables(r: Rng, hard: boolean): Question {
  // Sin sílabas repetidas (papa, yoyo): las opciones quedarían todas iguales.
  const pool = (hard ? HARD_TWO : TWO.filter((x) => !HARD_TWO.includes(x))).filter((x) => x.syl[0] !== x.syl[1]);
  const x = r.pick(pool);
  const [a, b] = x.syl;
  const swapped = b + a;
  const others = pickOthers(r, pool.filter((y) => y.syl[0] === a || y.syl[1] === b), [x], 2).map((y) => y.w);
  return {
    kind: "choice",
    prompt: "Une las sílabas. ¿Qué palabra se forma?",
    visual: { kind: "text", text: `${a} + ${b}` },
    options: uniqueOptions(r, x.w, [swapped, ...others, a + a, b + b]),
    answer: x.w,
    explanation: `${a} + ${b} = ${x.w}.`,
  };
}

export function completeSecondSyllable(r: Rng): Question {
  const x = r.pick(TWO);
  const [a, b] = x.syl;
  const others = r.shuffle(TWO.map((y) => y.syl[1]).filter((s) => s !== b)).slice(0, 5);
  return {
    kind: "choice",
    prompt: "¿Qué sílaba falta?",
    visual: { kind: "picture", emoji: x.e, caption: `${a}__` },
    options: uniqueOptions(r, b, others),
    answer: b,
    explanation: `${a} + ${b} = ${x.w}.`,
    speak: x.w,
  };
}

// ---------------------------------------------------------------------------
// W. Palabras frecuentes
// ---------------------------------------------------------------------------

export const SIGHT_SETS: string[][] = [
  // Sin "y": sola, la voz del navegador puede leerla como la letra ("i griega").
  ["el", "la", "los", "las", "un", "una", "en", "de"],
  ["es", "son", "mi", "tu", "su", "con", "por", "para"],
  ["que", "no", "sí", "yo", "me", "se", "lo", "al"],
  ["hay", "muy", "más", "pero", "como", "cuando", "donde", "quien"],
  ["este", "esta", "ese", "esa", "aquí", "allí", "hoy", "ayer"],
  ["grande", "poco", "mucho", "bien", "mal", "todo", "nada", "otro"],
  ["ver", "ir", "dar", "hacer", "tener", "poder", "decir", "querer"],
];

export function readSightWord(r: Rng, sets: number[]): Question {
  const pool = sets.flatMap((i) => SIGHT_SETS[i]);
  const w = r.pick(pool);
  return {
    kind: "choice",
    prompt: "Toca 🔊, escucha y elige la palabra.",
    options: uniqueOptions(r, w, pool.filter((x) => x !== w)),
    answer: w,
    explanation: `La palabra era «${w}».`,
    speak: w,
    tag: w,
  };
}

export function spellSightWord(r: Rng): Question {
  const w = r.pick(SIGHT_SETS.flat().filter((x) => x.length >= 3 && x.length <= 6));
  const letters = [...w];
  const pool = "aeiolmnrst".split("").filter((c) => !letters.includes(c));
  return {
    kind: "sequence",
    prompt: "Toca 🔊, escucha y escribe la palabra.",
    tiles: r.shuffle([...new Set(letters), ...pickOthers(r, pool, [], 2)]),
    reuse: true,
    length: letters.length,
    answer: letters,
    explanation: `Se escribe «${w}».`,
    speak: w,
  };
}
