import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";
import { WORDS } from "../lengua/words";

// Práctica de teclado: reconocer teclas y escribir de verdad (tipo "text").

const LETTERS = "abcdefghijklmnñopqrstuvwxyz".split("");

export function findKey(r: Rng): Question {
  const key = r.pick(LETTERS);
  const answer = key.toUpperCase();
  return {
    kind: "choice",
    prompt: "¿Qué letra está marcada en el teclado?",
    visual: { kind: "keyboard", highlight: [key] },
    options: uniqueOptions(r, answer, r.shuffle(LETTERS.filter((l) => l !== key)).slice(0, 3).map((l) => l.toUpperCase())),
    answer,
    explanation: `Es la tecla «${answer}».`,
    tag: key,
  };
}

export function typeLetter(r: Rng): Question {
  const key = r.pick(LETTERS);
  return {
    kind: "text",
    prompt: `Busca la tecla marcada y escribe la letra «${key}».`,
    visual: { kind: "keyboard", highlight: [key] },
    answer: key,
    explanation: `La letra «${key}».`,
    tag: key,
  };
}

const SHORT_WORDS = WORDS.filter((x) => x.w.length <= 5 && /^[a-zñ]+$/.test(x.w));

export function typeWord(r: Rng): Question {
  const x = r.pick(SHORT_WORDS);
  return {
    kind: "text",
    prompt: "Escribe la palabra con el teclado.",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    answer: x.w,
    explanation: `Se escribe «${x.w}».`,
    speak: x.w,
  };
}

const SENTENCES = [
  "Mi gato come.", "El sol brilla.", "Me gusta leer.", "Hoy es lunes.", "Mi casa es azul.",
  "El perro corre.", "Tengo un lápiz.", "La luna sale.", "Amo a mi mamá.", "Juego con Ana.",
  "Veo un pato.", "Mi oso es café.", "Hoy hace sol.", "Leo un libro.", "La rana salta.", "Me gusta el pan.",
];

export function typeSentence(r: Rng): Question {
  const s = r.pick(SENTENCES);
  return {
    kind: "text",
    prompt: "Copia la oración. Empieza con mayúscula (usa Shift), deja espacios entre las palabras y termina con punto.",
    visual: { kind: "text", text: s },
    answer: s,
    explanation: `Se escribe: «${s}».`,
  };
}

const NAMES = ["Ana", "Luis", "Rosa", "Pedro", "Lima", "Perú", "Cusco", "Sofía", "Mateo", "Lucía", "Diego", "Valeria", "Puno", "Tacna", "Camila", "Andrés", "Arequipa", "Iquitos"];

export function typeCapital(r: Rng): Question {
  const n = r.pick(NAMES);
  return {
    kind: "text",
    prompt: "Escribe el nombre con la primera letra en mayúscula. Mantén apretada la tecla Shift y toca la letra.",
    visual: { kind: "text", text: n },
    answer: n,
    explanation: `Se escribe «${n}», con «${n[0]}» mayúscula.`,
  };
}

export function typeNumber(r: Rng): Question {
  const n = r.int(1, 100);
  return {
    kind: "text",
    prompt: "Escribe el número con las teclas de números.",
    visual: { kind: "text", text: String(n) },
    answer: String(n),
    explanation: `Se escribe ${n}.`,
  };
}

// ---------------------------------------------------------------------------
// 2.° grado: fila guía, dedos, palabras largas, tildes y signos.
// ---------------------------------------------------------------------------

const HOME_ROW = ["a", "s", "d", "f", "j", "k", "l", "ñ"];
const OTHER_KEYS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "z", "x", "c", "v", "b", "n", "m", "g", "h"];

export function homeRow(r: Rng): Question {
  const hits = r.shuffle(HOME_ROW).slice(0, r.int(2, 4));
  const others = r.shuffle(OTHER_KEYS).slice(0, 7 - hits.length);
  return {
    kind: "multi",
    prompt: "La fila guía es donde descansan los dedos: A S D F (mano izquierda) y J K L Ñ (mano derecha). Selecciona las letras de la fila guía.",
    options: r.shuffle([...hits, ...others].map((k) => k.toUpperCase())),
    answers: hits.map((k) => k.toUpperCase()),
    explanation: "La fila guía es A S D F J K L Ñ.",
  };
}

const FINGERS: [key: string, finger: string][] = [
  ["a", "Meñique izquierdo"], ["s", "Anular izquierdo"], ["d", "Medio izquierdo"], ["f", "Índice izquierdo"],
  ["j", "Índice derecho"], ["k", "Medio derecho"], ["l", "Anular derecho"], ["ñ", "Meñique derecho"], ["Espacio", "Pulgar"],
  ["q", "Meñique izquierdo"], ["w", "Anular izquierdo"], ["e", "Medio izquierdo"], ["r", "Índice izquierdo"], ["g", "Índice izquierdo"],
  ["u", "Índice derecho"], ["i", "Medio derecho"], ["o", "Anular derecho"], ["p", "Meñique derecho"], ["h", "Índice derecho"],
];

export function fingerForKey(r: Rng): Question {
  const [key, finger] = r.pick(FINGERS);
  const label = key.length === 1 ? key.toUpperCase() : key;
  return {
    kind: "choice",
    prompt: `¿Qué dedo presiona la tecla marcada (${label}) desde la fila guía?`,
    visual: { kind: "keyboard", highlight: [key] },
    options: uniqueOptions(r, finger, FINGERS.map(([, f]) => f).filter((f) => f !== finger)),
    answer: finger,
    explanation: `La tecla ${label} se presiona con el ${finger.toLowerCase()}.`,
    tag: key,
  };
}

const LONG_WORDS = WORDS.filter((x) => x.w.length >= 6 && /^[a-zñ]+$/.test(x.w));

export function typeLongWord(r: Rng): Question {
  const x = r.pick(LONG_WORDS);
  return {
    kind: "text",
    prompt: "Escribe la palabra con el teclado.",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    answer: x.w,
    explanation: `Se escribe «${x.w}».`,
    speak: x.w,
  };
}

// Palabras con tilde: las del banco con dibujo y otras solo con texto.
const ACCENTED = [
  ...WORDS.filter((x) => /[áéíóú]/.test(x.w)),
  ...["café", "sofá", "papá", "mamá", "jabón", "canción", "música", "número", "pájaro", "corazón", "teléfono", "lápices"].map((w) => ({ w, e: "✍️", syl: [w] })),
];

export function typeAccent(r: Rng): Question {
  const x = r.pick(ACCENTED);
  return {
    kind: "text",
    prompt: "Escribe la palabra con su tilde. Para la tilde, toca primero la tecla ´ y luego la vocal.",
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    answer: x.w,
    explanation: `Se escribe «${x.w}», con tilde.`,
    speak: x.w,
  };
}

const PUNCTUATED = [
  "¿Cómo estás?", "¡Hola!", "¿Quieres jugar?", "¡Qué bonito!", "¿Dónde está mi lápiz?", "¡Feliz cumpleaños!", "¿Qué hora es?", "¡Ganamos!",
  "¿Cómo te llamas?", "¡Qué rico!", "¿Vamos al parque?", "¡Cuidado!", "¿Cuántos años tienes?", "¡Muy bien!", "¿Te gusta leer?", "¡Feliz Navidad!",
];

export function typePunctuation(r: Rng): Question {
  const s = r.pick(PUNCTUATED);
  return {
    kind: "text",
    prompt: "Copia la oración con sus signos de apertura y cierre (¿ ? o ¡ !).",
    visual: { kind: "text", text: s },
    answer: s,
    explanation: `Se escribe: «${s}».`,
  };
}

const LONG_SENTENCES = [
  "Mi perro se llama Toby.", "Hoy fuimos al parque.", "Me gusta jugar fútbol.", "La luna sale de noche.",
  "Mi mamá cocina arroz con pollo.", "El gato duerme en la cama.", "Tengo una mochila azul.", "Leo un cuento cada noche.",
  "El cóndor vuela sobre los Andes.", "Mañana iremos a la playa.", "Mi hermano juega ajedrez.", "La maestra lee una canción.",
  "El sábado visitamos a mi abuela.", "Comí un plátano en el recreo.", "Nuestro salón tiene una pizarra.", "Ayer llovió mucho en Lima.",
];

export function typeLongSentence(r: Rng): Question {
  const s = r.pick(LONG_SENTENCES);
  return {
    kind: "text",
    prompt: "Copia la oración tal como está: mayúscula al inicio, tildes, espacios y punto final.",
    visual: { kind: "text", text: s },
    answer: s,
    explanation: `Se escribe: «${s}».`,
  };
}
