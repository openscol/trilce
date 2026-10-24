import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { wordsOf } from "../../../generators/lengua/bank";
import type { Rng } from "../../../rng";
import type { Question } from "../../../types";
import type { Row } from "./row";
import { VERBS } from "./vocabulario";

// Inicial 5 años · banco de oraciones y palabras: contar o preguntar, los
// signos ¿? y ¡! al inicio y al final, la oración completa, mayúscula al
// inicio y en los nombres propios, sustantivos y verbos de acción.


const TELL = ["Cuenta algo", "Pregunta algo"];
const TELL_ASK: [string, number][] = [
  ["El gato duerme.", 0], ["Mi mamá cocina arroz.", 0], ["Hoy hace sol.", 0], ["La rana salta.", 0], ["Tengo un perro.", 0], ["El pan está rico.", 0],
  ["¿Dónde está mi gorro?", 1], ["¿Cómo te llamas?", 1], ["¿Quieres jugar?", 1], ["¿Qué hora es?", 1], ["¿Tienes hambre?", 1], ["¿Quién vino hoy?", 1],
];

const MARKS = [".  (punto)", "¿ ?  (pregunta)", "¡ !  (exclamación)"];
const END_MARKS: [string, number][] = [
  ["Cómo te llamas", 1], ["Dónde vives", 1], ["Quieres pan", 1], ["Qué hora es", 1],
  ["Qué lindo día", 2], ["Feliz cumpleaños", 2], ["Cuidado con el perro", 2], ["Qué rico helado", 2],
  ["El sol sale de día", 0], ["Mi mamá lee un libro", 0], ["El pato nada en el lago", 0], ["Yo tengo cinco años", 0],
];

// [oración completa, dos pedazos que no son oración]. La oración completa es
// a veces la más larga, a veces la más corta y a veces la del medio.
const COMPLETE: [string, string, string][] = [
  ["El perro ladra.", "El perro grande y negro", "Ladra muy"],
  ["Mi mamá cocina arroz con pollo.", "Mi mamá y la olla", "Cocina el"],
  ["Yo corro.", "Los niños del parque", "Corren muy por"],
  ["El sol brilla.", "El sol amarillo del cielo", "Brilla en"],
  ["Papá lava el carro rojo de mi tío.", "El carro rojo", "Lava el de"],
  ["Ana come.", "Una pera verde y jugosa", "Come una de"],
  ["Los pájaros vuelan alto.", "Los pájaros del árbol alto del parque", "Vuelan por"],
  ["El bebé duerme en su cuna nueva.", "El bebé chiquito", "Duerme en la"],
  ["Leo ríe.", "El niño de la casa azul", "Ríe mucho con"],
];

const SCRAMBLED: OrderItem[] = [
  { seq: ["El", "gato", "toma", "leche."] }, { seq: ["Mi", "mamá", "lee", "un", "cuento."] }, { seq: ["La", "rana", "salta", "alto."] },
  { seq: ["Yo", "como", "pan."] }, { seq: ["El", "sol", "sale", "hoy."] }, { seq: ["Papá", "lava", "el", "carro."] },
  { seq: ["Ana", "pinta", "una", "flor."] }, { seq: ["El", "bebé", "duerme", "mucho."] },
];

const SENTENCES = [
  "El gato duerme.", "Mi perro corre.", "La luna brilla.", "Hoy hace frío.", "Tengo una pelota.", "Los niños juegan.", "Mamá canta bonito.", "Papá lee un libro.",
];

function firstCapital(r: Rng): Question {
  const s = r.pick(SENTENCES);
  const [first, second, ...rest] = s.split(" ");
  const lower = first.toLowerCase();
  const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
  const wrong = [[lower, second, ...rest].join(" "), [lower, cap(second), ...rest].join(" ")];
  return { kind: "choice", prompt: "¿Qué oración empieza bien, con mayúscula?", options: r.shuffle([s, ...wrong]), answer: s, explanation: `La primera letra de la oración va en mayúscula: «${s}»` };
}

const NAMES: [before: string, name: string, after: string][] = [
  ["Mi amiga", "Ana", "canta."], ["Mi perro", "Toby", "ladra."], ["El señor", "Pepe", "vende pan."], ["Mi hermano", "Luis", "juega."],
  ["La gata", "Mimí", "duerme."], ["Yo vivo en", "Lima", "con mi mamá."], ["Mi tía", "Rosa", "cocina."], ["Voy a", "Cusco", "con papá."],
];

function nameCapital(r: Rng): Question {
  const [before, name, after] = r.pick(NAMES);
  const ws = before.split(" ");
  const good = `${before} ${name} ${after}`;
  const swapped = [...ws.slice(0, -1), ws[ws.length - 1][0].toUpperCase() + ws[ws.length - 1].slice(1)].join(" ");
  const wrong = [`${before} ${name.toLowerCase()} ${after}`, `${swapped} ${name.toLowerCase()} ${after}`];
  return { kind: "choice", prompt: "Los nombres propios se escriben con mayúscula. ¿Cuál está bien escrita?", options: r.shuffle([good, ...wrong]), answer: good, explanation: `«${name}» es un nombre propio: va con mayúscula.` };
}

const KINDS = ["Persona", "Animal", "Lugar", "Cosa"];
const NOUNS: [string, number][] = [
  ["👩‍🏫 maestra", 0], ["🧑‍🚒 bombero", 0], ["👶 bebé", 0], ["👵 abuela", 0], ["🧑‍⚕️ doctor", 0], ["👦 niño", 0],
  ["🐶 perro", 1], ["🐮 vaca", 1], ["🐟 pez", 1], ["🦋 mariposa", 1], ["🐸 rana", 1], ["🦁 león", 1],
  ["🏫 escuela", 2], ["🏖️ playa", 2], ["🌳 parque", 2], ["🏥 hospital", 2], ["🛒 mercado", 2], ["🏠 casa", 2],
  ["⚽ pelota", 3], ["🪑 silla", 3], ["✏️ lápiz", 3], ["📖 libro", 3], ["🥄 cuchara", 3], ["🔑 llave", 3],
];

const PLURALS: [string, string, string][] = [
  ["🐱", "gato", "gatos"], ["🌸", "flor", "flores"], ["🐟", "pez", "peces"], ["⚽", "pelota", "pelotas"], ["🌳", "árbol", "árboles"], ["⭐", "estrella", "estrellas"],
  ["✏️", "lápiz", "lápices"], ["🍎", "manzana", "manzanas"], ["🐶", "perro", "perros"], ["📖", "libro", "libros"], ["🦆", "pato", "patos"], ["🚗", "carro", "carros"],
];

function singularPlural(r: Rng): Question {
  const [x, y] = r.shuffle(PLURALS);
  const many = r.chance(0.5);
  return {
    kind: "choice",
    prompt: "¿Qué palabra corresponde al dibujo?",
    visual: { kind: "objects", emoji: x[0], count: many ? r.int(2, 4) : 1 },
    options: r.shuffle([x[1], x[2], y[1], y[2]]),
    answer: many ? x[2] : x[1],
    explanation: many ? `Hay varios: «${x[2]}».` : `Hay uno solo: «${x[1]}».`,
    tag: many ? "plural" : "singular",
  };
}

const VERB_SENTENCES: [string, string][] = [
  ["El perro corre rápido.", "corre"], ["Mamá cocina arroz.", "cocina"], ["La rana salta alto.", "salta"], ["Yo leo un cuento.", "leo"],
  ["El bebé llora mucho.", "llora"], ["Papá lava el carro.", "lava"], ["Ana pinta una flor.", "pinta"], ["El pez nada en el río.", "nada"],
  ["Los niños juegan fútbol.", "juegan"], ["El gallo canta temprano.", "canta"],
];

const VERB_PICTURES: [string, string, string][] = [
  ["🏊", "El niño ___ en la piscina.", "nada"], ["😴", "El gato ___ en el sofá.", "duerme"], ["📖", "La niña ___ un cuento.", "lee"],
  ["🍽️", "Papá ___ su almuerzo.", "come"], ["🏃", "El perro ___ en el parque.", "corre"], ["🎤", "Mi tía ___ una canción.", "canta"],
  ["💃", "La abuela ___ en la fiesta.", "baila"], ["🎨", "Leo ___ un dibujo.", "pinta"], ["🧹", "Mamá ___ el piso.", "barre"], ["🚴", "Tito ___ su bicicleta.", "monta"],
];
const VERB_ITEMS: ChoiceItem[] = VERB_PICTURES.map(([pic, t, a]) => ({ pic, t, a, d: VERB_PICTURES.map((v) => v[2]).filter((v) => v !== a) }));

const fixed = (prompt: string, list: [string, number][], options: string[], show: (t: string) => string = (t) => t) => (r: Rng): Question => {
  const [text, i] = r.pick(list);
  return { kind: "choice", prompt, visual: { kind: "text", text: show(text) }, options, answer: options[i], explanation: `La respuesta es: ${options[i]}.`, tag: options[i] };
};

export const ROWS: Row[] = [
  ["contar-preguntar-1", fixed("¿La oración cuenta algo o pregunta algo?", TELL_ASK, TELL)],
  ["signos-mayusculas-1", fixed("¿Qué signos le faltan a la oración?", END_MARKS, MARKS, (t) => `▢ ${t} ▢`)],
  ["contar-preguntar-2", (r) => {
    const [good, a, b] = r.pick(COMPLETE);
    return { kind: "choice", prompt: "¿Cuál es una oración completa?", options: r.shuffle([good, a, b]), answer: good, explanation: `«${good}» dice quién y qué hace.` };
  }],
  ["contar-preguntar-3", (r) => order(r, "Ordena las palabras para formar una oración.", SCRAMBLED)],

  ["signos-mayusculas-2", firstCapital],
  ["signos-mayusculas-3", nameCapital],

  ["sustantivos-1", fixed("¿Es una persona, un animal, un lugar o una cosa?", NOUNS, KINDS)],
  ["sustantivos-2", singularPlural],

  ["verbos-1", (r) => {
    const [pic, verb] = r.pick(VERBS);
    return { kind: "choice", prompt: "¿Qué acción muestra el dibujo?", visual: { kind: "picture", emoji: pic }, options: r.shuffle([verb, ...r.shuffle(VERBS.filter((v) => v[1] !== verb)).slice(0, 3).map((v) => v[1])]), answer: verb, explanation: `${pic} muestra «${verb}».` };
  }],
  ["verbos-2", (r) => {
    const [s, verb] = r.pick(VERB_SENTENCES);
    return { kind: "choice", prompt: "¿Qué palabra dice la acción (lo que hace)?", visual: { kind: "text", text: s }, options: wordsOf(s), answer: verb, explanation: `La acción es «${verb}».` };
  }],
  ["verbos-3", (r) => choose(r, "Mira el dibujo y completa la oración.", VERB_ITEMS)],
];
