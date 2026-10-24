import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Rng } from "../../../rng";
import type { Question } from "../../../types";
import type { Row } from "./row";

// Inicial 5 años · banco de vocabulario oral: números, colores, ubicación,
// palabras para preguntar, opuestos, categorías y palabras con varios
// significados.


const fromPic = (list: [string, string][]): ChoiceItem[] => list.map(([pic, a]) => ({ pic, a, d: list.map((x) => x[1]).filter((x) => x !== a) }));
const fromText = (list: [string, string][]): ChoiceItem[] => list.map(([t, a]) => ({ t, a, d: list.map((x) => x[1]).filter((x) => x !== a) }));

const NUMBER_WORDS = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
const THINGS = ["🍎", "⭐", "🐟", "🎈", "🌸", "⚽"];

function numberWord(r: Rng): Question {
  const n = r.int(1, 10);
  const near = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n && Math.abs(x - n) <= 3)).slice(0, 3);
  const nums = [n, ...near].sort((a, b) => a - b);
  if (r.chance(0.5)) {
    return { kind: "choice", prompt: "Cuenta. ¿Qué palabra dice cuántos hay?", visual: { kind: "objects", emoji: r.pick(THINGS), count: n }, options: nums.map((x) => NUMBER_WORDS[x - 1]), answer: NUMBER_WORDS[n - 1], explanation: `Hay ${n}: «${NUMBER_WORDS[n - 1]}».`, tag: "palabra" };
  }
  return { kind: "choice", prompt: "¿Qué número dice la palabra?", visual: { kind: "text", text: NUMBER_WORDS[n - 1] }, options: nums.map(String), answer: String(n), explanation: `«${NUMBER_WORDS[n - 1]}» es ${n}.`, tag: "numero" };
}

const COLORS: [string, string][] = [
  ["🔴", "rojo"], ["🔵", "azul"], ["🟢", "verde"], ["🟡", "amarillo"], ["🟠", "anaranjado"], ["🟣", "morado"], ["🟤", "marrón"], ["⚫", "negro"], ["⚪", "blanco"],
  ["🍌", "amarillo"], ["🍓", "rojo"], ["🐸", "verde"], ["☁️", "blanco"], ["🍊", "anaranjado"], ["🍇", "morado"], ["🐻", "marrón"],
];

// [más, menos, adjetivo de «más», adjetivo de «menos»]
const ADJECTIVES: [string, string, string, string][] = [
  ["🐘", "🐭", "grande", "pequeño"], ["🦒", "🐕", "alto", "bajo"], ["🐆", "🐢", "rápido", "lento"], ["🔥", "🧊", "caliente", "frío"],
  ["🪨", "🪶", "pesado", "liviano"], ["🐍", "🐛", "largo", "corto"], ["👴", "👶", "viejo", "joven"], ["🦁", "🐑", "feroz", "manso"],
];

export const VERBS: [string, string][] = [
  ["🏃", "correr"], ["🏊", "nadar"], ["😴", "dormir"], ["🍽️", "comer"], ["📖", "leer"], ["✍️", "escribir"], ["💃", "bailar"], ["🎤", "cantar"],
  ["🧗", "trepar"], ["🧹", "barrer"], ["🎨", "pintar"], ["🚴", "pedalear"], ["🛁", "bañarse"], ["🤿", "bucear"],
];

function location(r: Rng): Question {
  const animals = r.shuffle(["🐸", "🐵", "🐱", "🐶", "🐰", "🐥"]);
  const form = r.int(0, 2);
  if (form === 0) {
    const inside = r.chance(0.5);
    const who = inside ? animals[0] : animals[1];
    return { kind: "choice", prompt: `¿Dónde está ${who}?`, visual: { kind: "box", inside: [animals[0]], outside: [animals[1]] }, options: ["Dentro de la caja", "Fuera de la caja"], answer: inside ? "Dentro de la caja" : "Fuera de la caja", explanation: inside ? `${who} está dentro.` : `${who} está fuera.`, tag: "dentro-fuera" };
  }
  if (form === 1) {
    const top = r.chance(0.5);
    const who = top ? animals[0] : animals[1];
    const other = top ? animals[1] : animals[0];
    return { kind: "choice", prompt: `¿Dónde está ${who}?`, visual: { kind: "stack", items: [animals[0], animals[1]] }, options: [`Encima de ${other}`, `Debajo de ${other}`], answer: top ? `Encima de ${other}` : `Debajo de ${other}`, explanation: top ? `${who} está arriba: encima.` : `${who} está abajo: debajo.`, tag: "encima-debajo" };
  }
  const row = animals.slice(0, 4);
  const i = r.pick([0, 3]);
  const answer = row[i === 0 ? 1 : 2];
  return { kind: "choice", prompt: `¿Quién está al lado de ${row[i]}?`, visual: { kind: "pattern", items: row }, options: r.shuffle(row.filter((x) => x !== row[i])), answer, explanation: `${answer} está junto a ${row[i]}.`, tag: "al-lado" };
}

const LOCATION_WORDS: ChoiceItem[] = [
  { t: "El pez nada ___ del agua.", a: "dentro", d: ["fuera", "encima"] },
  { t: "El gorro va ___ de la cabeza.", a: "encima", d: ["debajo", "dentro"] },
  { t: "Los zapatos se guardan ___ de la cama.", a: "debajo", d: ["encima", "lejos"] },
  { t: "Las raíces están ___ de la tierra.", a: "debajo", d: ["encima", "fuera"] },
  { t: "En la fila, me paro ___ de mi amigo.", a: "detrás", d: ["encima", "dentro"] },
  { t: "Juego en el parque, ___ de la casa.", a: "fuera", d: ["dentro", "debajo"] },
  { t: "La leche está ___ del vaso.", a: "dentro", d: ["fuera", "debajo"] },
  { t: "El techo está ___ de la casa.", a: "encima", d: ["debajo", "dentro"] },
  { t: "La alfombra está ___ de la mesa.", a: "debajo", d: ["encima", "dentro"] },
  { t: "El pájaro sale ___ de su jaula.", a: "fuera", d: ["dentro", "debajo"] },
];

const QUESTION_WORDS = ["Quién", "Qué", "Cuándo", "Dónde", "Por qué"];
const QUESTIONS: [string, number][] = [
  ["— ¿___ es tu maestra?\n— La señora Ana.", 0], ["— ¿___ vives?\n— En Cusco.", 3], ["— ¿___ es tu cumpleaños?\n— En mayo.", 2],
  ["— ¿___ comes?\n— Una manzana.", 1], ["— ¿___ lloras?\n— Porque me caí.", 4], ["— ¿___ está el gato?\n— Debajo de la cama.", 3],
  ["— ¿___ rompió el vaso?\n— Fue Leo.", 0], ["— ¿___ vamos al parque?\n— Mañana.", 2], ["— ¿___ hay en la caja?\n— Un juguete.", 1],
  ["— ¿___ usas paraguas?\n— Porque llueve.", 4],
];

const ANTONYMS: [string, string][] = [
  ["grande", "🐭 pequeño"], ["frío", "🔥 caliente"], ["día", "🌙 noche"], ["feliz", "😢 triste"], ["arriba", "⬇️ abajo"],
  ["abierto", "🔒 cerrado"], ["rápido", "🐢 lento"], ["mojado", "🏜️ seco"], ["despierto", "😴 dormido"], ["lleno", "🫙 vacío"],
];

const SYNONYMS: [string, string][] = [
  ["contento", "feliz"], ["bonito", "lindo"], ["grande", "enorme"], ["pequeño", "chico"], ["empezar", "comenzar"], ["caminar", "andar"],
  ["brincar", "saltar"], ["mirar", "ver"], ["veloz", "rápido"], ["enojado", "molesto"], ["casa", "hogar"],
];

const CATEGORIES: Record<string, string[]> = {
  "los animales": ["🐶", "🐱", "🐮", "🐸", "🦁", "🐘", "🐟", "🦋"],
  "las frutas": ["🍎", "🍌", "🍇", "🍓", "🍐", "🍊", "🍍", "🍉"],
  "las prendas de vestir": ["👕", "👗", "🧦", "🧢", "🧤", "👖", "🧥", "👟"],
  "los medios de transporte": ["🚗", "🚌", "✈️", "🚲", "🚂", "⛵", "🚁", "🚚"],
};
const CATEGORY_NAMES = Object.keys(CATEGORIES);

function sortCategory(r: Rng): Question {
  const c = r.pick(CATEGORY_NAMES);
  const hits = r.shuffle(CATEGORIES[c]).slice(0, r.int(2, 3));
  const rest = r.shuffle(CATEGORY_NAMES.filter((k) => k !== c).flatMap((k) => CATEGORIES[k])).slice(0, 6 - hits.length);
  return { kind: "multi", prompt: `Selecciona todos ${c}.`.replace("todos las", "todas las"), options: r.shuffle([...hits, ...rest]), answers: hits, explanation: `Son: ${hits.join(" ")}.`, tag: c };
}

function oddOneOut(r: Rng): Question {
  const [c, other] = r.shuffle(CATEGORY_NAMES);
  const three = r.shuffle(CATEGORIES[c]).slice(0, 3);
  const odd = r.pick(CATEGORIES[other]);
  return { kind: "choice", prompt: "¿Cuál NO es como los demás?", options: r.shuffle([...three, odd]), answer: odd, explanation: `${three.join(" ")} son ${c.replace(/^l[oa]s /, "")}; ${odd} no.` };
}

const MEANINGS: [string, string][] = [
  ["🦙  🔥", "llama"], ["🍃  📄", "hoja"], ["🐭  🖱️", "ratón"], ["🪶  🖊️", "pluma"], ["✉️  🃏", "carta"], ["🏦  🪑", "banco"],
  ["🏆  🍷", "copa"], ["⛰️  🪚", "sierra"], ["🌱  🦶", "planta"], ["🔑  🚰", "llave"], ["🎵  📝", "nota"],
];

export const ROWS: Row[] = [
  ["numeros-colores-1", numberWord],
  ["numeros-colores-2", (r) => choose(r, "¿De qué color es?", fromPic(COLORS))],

  ["adjetivos-verbos-1", (r) => {
    const [more, less, big, small] = r.pick(ADJECTIVES);
    const first = r.chance(0.5);
    return { kind: "choice", prompt: `¿Cuál es ${first ? big : small}?`, options: r.shuffle([more, less]), answer: first ? more : less, explanation: `${more} es ${big} y ${less} es ${small}.` };
  }],
  ["adjetivos-verbos-2", (r) => {
    const [pic, verb] = r.pick(VERBS);
    return { kind: "choice", prompt: `¿Qué dibujo muestra la acción «${verb}»?`, options: r.shuffle([pic, ...r.shuffle(VERBS.filter((v) => v[1] !== verb)).slice(0, 3).map((v) => v[0])]), answer: pic, explanation: `${pic} muestra «${verb}».` };
  }],

  ["ubicacion-1", location],
  ["ubicacion-2", (r) => choose(r, "Completa la oración.", LOCATION_WORDS)],

  ["que-pregunta", (r) => {
    const [text, i] = r.pick(QUESTIONS);
    const answer = QUESTION_WORDS[i];
    return { kind: "choice", prompt: "¿Qué palabra falta en la pregunta?", visual: { kind: "text", text }, options: QUESTION_WORDS, answer, explanation: `La pregunta empieza con «¿${answer}…?».`, tag: answer };
  }],

  ["opuestos-1", (r) => {
    const [w, a] = r.pick(ANTONYMS);
    return { kind: "choice", prompt: `¿Qué dibujo muestra lo contrario de «${w}»?`, options: r.shuffle([a, ...r.shuffle(ANTONYMS.map((x) => x[1]).filter((x) => x !== a)).slice(0, 3)]), answer: a, explanation: `Lo contrario de «${w}» es «${a.split(" ").slice(1).join(" ")}».` };
  }],
  ["opuestos-2", (r) => {
    const item = r.pick(fromText(SYNONYMS));
    return choose(r, "", [{ ...item, t: undefined, p: `¿Qué palabra significa lo mismo que «${item.t}»?` }]);
  }],

  ["categorias-1", sortCategory],
  ["categorias-2", oddOneOut],

  ["varios-significados", (r) => choose(r, "Una misma palabra nombra los dos dibujos. ¿Cuál es?", fromPic(MEANINGS))],
];
