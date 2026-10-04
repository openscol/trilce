import { choose, chooseAll, order, pickAll, type ChoiceItem, type MultiItem, type OrderItem } from "../../../generators/lengua/bank";
import { uniqueOptions } from "../../../generators/common";
import { WORDS } from "../../../generators/lengua/words";
import type { Rng } from "../../../rng";
import type { Question, Section } from "../../../types";
import type { Row } from "./row";

// Vocabulario (IXL 1st grade ELA, LL-SS).

export const SECTIONS: Section[] = [
  { id: "LL", name: "Sustantivos y adjetivos", icon: "🏷️" },
  { id: "MM", name: "Categorías", icon: "🗂️" },
  { id: "NN", name: "Sinónimos y antónimos", icon: "↔️" },
  { id: "OO", name: "Palabras con varios significados", icon: "🔀" },
  { id: "PP", name: "Matices de significado", icon: "🌈" },
  { id: "QQ", name: "Prefijos y sufijos", icon: "🧩" },
  { id: "RR", name: "Pistas del contexto", icon: "🔎" },
  { id: "SS", name: "Orden alfabético", icon: "🔤" },
];

const NOUN_FOR_PICTURE: ChoiceItem[] = [
  { pic: "🐶", t: "El ___ mueve la cola.", a: "perro", d: ["gato", "conejo", "pato"] },
  { pic: "🍎", t: "Me como una ___ roja.", a: "manzana", d: ["pera", "mandarina", "fresa"] },
  { pic: "🚌", t: "Vamos a la escuela en ___.", a: "bus", d: ["barco", "avión", "tren"] },
  { pic: "⚽", t: "Juego con la ___ en el patio.", a: "pelota", d: ["muñeca", "cometa", "cuerda"] },
  { pic: "🌧️", t: "Hoy cae mucha ___.", a: "lluvia", d: ["nieve", "arena", "granizo"] },
  { pic: "🎂", t: "En mi cumpleaños hay un ___.", a: "pastel", d: ["pan", "helado", "chocolate"] },
  { pic: "📖", t: "La maestra lee un ___.", a: "libro", d: ["cuaderno", "mapa", "lápiz"] },
];

const COMPARE_ADJ: ChoiceItem[] = [
  { pic: "🐘 🐭", t: "El elefante es ___ y el ratón es pequeño.", a: "grande", d: ["pequeño", "rápido", "frío"] },
  { pic: "🔥 🧊", t: "El fuego está caliente y el hielo está ___.", a: "frío", d: ["caliente", "alto", "rojo"] },
  { pic: "🐢 🐇", t: "La tortuga es lenta y el conejo es ___.", a: "rápido", d: ["lento", "pesado", "dulce"] },
  { pic: "🦒 🐁", t: "La jirafa es alta y el ratón es ___.", a: "bajo", d: ["alto", "largo", "feliz"] },
  { pic: "☀️ 🌙", t: "De día está claro y de noche está ___.", a: "oscuro", d: ["claro", "limpio", "mojado"] },
  { pic: "🍋 🍬", t: "El limón es ácido y el caramelo es ___.", a: "dulce", d: ["ácido", "salado", "amargo"] },
];

const NUMBER_WORDS = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
const COUNT_NOUNS: [emoji: string, one: string, many: string, fem: boolean][] = [
  ["🍎", "manzana", "manzanas", true], ["⭐", "estrella", "estrellas", true], ["🐟", "pez", "peces", false],
  ["🎈", "globo", "globos", false], ["🐥", "pollito", "pollitos", false], ["🌸", "flor", "flores", true],
];

function phrase(n: number, noun: (typeof COUNT_NOUNS)[number]) {
  if (n === 1) return `${noun[3] ? "una" : "un"} ${noun[1]}`;
  return `${NUMBER_WORDS[n]} ${noun[2]}`;
}

function numberWords(r: Rng): Question {
  const noun = r.pick(COUNT_NOUNS);
  const n = r.int(1, 10);
  const answer = phrase(n, noun);
  const others = [n - 1, n + 1, n + 2, n - 2].filter((k) => k >= 1 && k <= 10).map((k) => phrase(k, noun));
  return {
    kind: "choice",
    prompt: "¿Cuántos hay? Elige las palabras correctas.",
    visual: { kind: "objects", emoji: noun[0], count: n },
    options: uniqueOptions(r, answer, others),
    answer,
    explanation: `Hay ${answer}.`,
  };
}

const CATEGORIES: Record<string, string[]> = {
  frutas: ["manzana", "pera", "uva", "plátano", "piña", "fresa", "sandía"],
  animales: ["perro", "gato", "vaca", "león", "pato", "oso", "conejo"],
  colores: ["rojo", "azul", "verde", "amarillo", "morado", "blanco"],
  "prendas de vestir": ["camisa", "pantalón", "zapato", "gorro", "vestido", "chompa"],
  "útiles escolares": ["lápiz", "cuaderno", "borrador", "regla", "tijera", "mochila"],
  "medios de transporte": ["carro", "bus", "tren", "avión", "barco", "bicicleta"],
};

function sortCategory(r: Rng): Question {
  const cat = r.pick(Object.keys(CATEGORIES));
  const others = Object.entries(CATEGORIES).filter(([k]) => k !== cat).flatMap(([, v]) => v);
  return pickAll(r, `Selecciona todas las palabras que son ${cat}.`, CATEGORIES[cat], others, cat);
}

function oddOneOut(r: Rng): Question {
  const [cat, other] = r.shuffle(Object.keys(CATEGORIES));
  const three = r.shuffle(CATEGORIES[cat]).slice(0, 3);
  const odd = r.pick(CATEGORIES[other]);
  return {
    kind: "choice",
    prompt: "¿Qué palabra no es como las demás?",
    options: r.shuffle([...three, odd]),
    answer: odd,
    explanation: `${three.join(", ")} son ${cat}; «${odd}» no.`,
  };
}

const SYNONYMS: ChoiceItem[] = (
  [
    ["contento", "feliz", ["triste", "enojado", "cansado"]],
    ["grande", "enorme", ["pequeño", "bajo", "corto"]],
    ["pequeño", "chiquito", ["grande", "alto", "gordo"]],
    ["rápido", "veloz", ["lento", "pesado", "quieto"]],
    ["bonito", "lindo", ["feo", "sucio", "roto"]],
    ["hablar", "conversar", ["callar", "dormir", "correr"]],
    ["mirar", "observar", ["oír", "oler", "tocar"]],
    ["empezar", "comenzar", ["terminar", "parar", "dormir"]],
    ["terminar", "acabar", ["empezar", "comenzar", "abrir"]],
    ["cansado", "agotado", ["descansado", "alegre", "rápido"]],
  ] as const
).map(([w, a, d]) => ({ p: `¿Qué palabra significa lo mismo que «${w}»?`, t: w, a, d: [...d] }));

const ANTONYMS: ChoiceItem[] = (
  [
    ["grande", "pequeño", ["enorme", "alto", "gordo"]],
    ["alto", "bajo", ["largo", "grande", "gigante"]],
    ["día", "noche", ["mañana", "sol", "luz"]],
    ["frío", "caliente", ["helado", "fresco", "mojado"]],
    ["abrir", "cerrar", ["empujar", "jalar", "entrar"]],
    ["subir", "bajar", ["saltar", "escalar", "trepar"]],
    ["lleno", "vacío", ["repleto", "grande", "pesado"]],
    ["rápido", "lento", ["veloz", "ligero", "fuerte"]],
    ["feliz", "triste", ["contento", "alegre", "cansado"]],
    ["limpio", "sucio", ["lavado", "nuevo", "brillante"]],
    ["encender", "apagar", ["prender", "mirar", "tocar"]],
    ["mucho", "poco", ["bastante", "demasiado", "todo"]],
  ] as const
).map(([w, a, d]) => ({ p: `¿Qué palabra significa lo contrario de «${w}»?`, t: w, a, d: [...d] }));

const MULTI_MEANING: ChoiceItem[] = (
  [
    ["Guardo mi dinero en el banco.", "🏦 banco (lugar del dinero)", "🪑 banco (asiento)"],
    ["Me siento en el banco del parque.", "🪑 banco (asiento)", "🏦 banco (lugar del dinero)"],
    ["El barco tiene una vela blanca.", "⛵ vela de barco", "🕯️ vela que alumbra"],
    ["Prendimos una vela en el pastel.", "🕯️ vela que alumbra", "⛵ vela de barco"],
    ["El ratón de la computadora no funciona.", "🖱️ ratón de computadora", "🐭 ratón animal"],
    ["El ratón comió queso.", "🐭 ratón animal", "🖱️ ratón de computadora"],
    ["Una hoja cayó del árbol.", "🍃 hoja de árbol", "📄 hoja de papel"],
    ["Escribí mi nombre en la hoja.", "📄 hoja de papel", "🍃 hoja de árbol"],
    ["Juguemos a las cartas.", "🃏 carta de juego", "✉️ carta para enviar"],
    ["Le mandé una carta a mi abuela.", "✉️ carta para enviar", "🃏 carta de juego"],
  ] as const
).map(([t, a, d]) => ({ t, a, d: [d] }));

const RELATED: MultiItem[] = (
  [
    ["feliz", ["contento", "alegre"], ["triste", "enojado", "dormido"]],
    ["grande", ["enorme", "gigante"], ["pequeño", "diminuto", "corto"]],
    ["hablar", ["decir", "conversar"], ["correr", "dormir", "comer"]],
    ["caminar", ["andar", "pasear"], ["nadar", "volar", "cantar"]],
    ["mirar", ["ver", "observar"], ["oír", "oler", "tocar"]],
    ["rápido", ["veloz", "ligero"], ["lento", "tranquilo", "pesado"]],
  ] as const
).map(([w, ans, no]) => ({ p: `Selecciona las palabras que significan casi lo mismo que «${w}».`, opts: [...ans, ...no], ans: [...ans] }));

const DIFFERENCE: ChoiceItem[] = [
  { t: "Hay un bebé dormido. Ana habla muy bajito.", p: "¿Qué hace Ana?", a: "Susurra", d: ["Grita", "Canta", "Llora"] },
  { t: "Luis ve a su perro muy lejos y lo llama muy fuerte.", p: "¿Qué hace Luis?", a: "Grita", d: ["Susurra", "Bosteza", "Silba"] },
  { t: "La sopa está un poco caliente; ya se puede tomar.", p: "¿Cómo está la sopa?", a: "Tibia", d: ["Hirviendo", "Helada", "Congelada"] },
  { t: "Es tarde y Tomás va al colegio lo más rápido que puede.", p: "¿Qué hace Tomás?", a: "Corre", d: ["Camina despacio", "Se sienta", "Duerme"] },
  { t: "La niña miró la estrella con mucha atención por un largo rato.", p: "¿Qué hizo la niña?", a: "La observó", d: ["Le echó un vistazo", "Cerró los ojos", "Se durmió"] },
];

const SHADES: OrderItem[] = [
  { p: "Ordena de menos caliente a más caliente.", seq: ["tibio", "caliente", "hirviendo"] },
  { p: "Ordena de más pequeño a más grande.", seq: ["pequeño", "grande", "enorme"] },
  { p: "Ordena de más bajito a más fuerte.", seq: ["susurrar", "hablar", "gritar"] },
  { p: "Ordena de más lento a más rápido.", seq: ["caminar", "trotar", "correr"] },
  { p: "Ordena de menos frío a más frío.", seq: ["fresco", "frío", "helado"] },
  { p: "Ordena de menos a más.", seq: ["sonreír", "reír", "reír a carcajadas"] },
];

const AFFIX_USE: ChoiceItem[] = [
  { t: "Un gato pequeño es un ___.", a: "gatito", d: ["gatote", "gatero", "desgato"] },
  { t: "La persona que hace pan es el ___.", a: "panadero", d: ["panecito", "despán", "panote"] },
  { t: "Lo contrario de hacer es ___.", a: "deshacer", d: ["rehacer", "hacedor", "hacito"] },
  { t: "Volver a escribir es ___.", a: "reescribir", d: ["desescribir", "escritor", "escribito"] },
  { t: "La persona que cuida el jardín es el ___.", a: "jardinero", d: ["jardincito", "desjardín", "rejardín"] },
  { t: "Lo contrario de atar es ___.", a: "desatar", d: ["reatar", "atador", "atito"] },
  { t: "Un perro pequeño es un ___.", a: "perrito", d: ["perrote", "perrero", "desperro"] },
];

const AFFIX_MEANING: ChoiceItem[] = (
  [
    ["gatito", "Un gato pequeño"], ["panadero", "Persona que hace pan"], ["deshacer", "Lo contrario de hacer"],
    ["releer", "Volver a leer"], ["zapatero", "Persona que arregla zapatos"], ["desordenado", "Que no está ordenado"],
    ["casita", "Una casa pequeña"],
  ] as const
).map(([w, a], _, all) => ({ p: `¿Qué significa «${w}»?`, t: w, a, d: all.map(([, m]) => m).filter((m) => m !== a) }));

const CONTEXT: ChoiceItem[] = [
  { t: "El elefante es enorme: es más grande que una casa.", p: "¿Qué significa «enorme»?", a: "Muy grande", d: ["Muy pequeño", "Muy rápido", "Muy bonito"] },
  { t: "Estaba exhausto después de correr toda la tarde y se quedó dormido.", p: "¿Qué significa «exhausto»?", a: "Muy cansado", d: ["Muy feliz", "Muy hambriento", "Muy limpio"] },
  { t: "La sopa estaba deliciosa; ¡me comí dos platos!", p: "¿Qué significa «deliciosa»?", a: "Muy rica", d: ["Muy fría", "Muy fea", "Muy salada"] },
  { t: "El cachorro es la cría del perro; todavía es un bebé.", p: "¿Qué significa «cachorro»?", a: "Un perro bebé", d: ["Un gato grande", "Un juguete", "Un pájaro"] },
  { t: "Mi abuelo es muy sabio: sabe muchas cosas y da buenos consejos.", p: "¿Qué significa «sabio»?", a: "Que sabe mucho", d: ["Que corre mucho", "Que duerme mucho", "Que come mucho"] },
  { t: "El cielo estaba nublado y no se veía el sol.", p: "¿Qué significa «nublado»?", a: "Lleno de nubes", d: ["Lleno de estrellas", "Muy soleado", "Lleno de pájaros"] },
];

const ALPHABET = "abcdefghijklmnñopqrstuvwxyz".split("");

function abcLetters(r: Rng): Question {
  const n = r.int(3, 4);
  const letters = r.shuffle(ALPHABET).slice(0, n);
  const sorted = [...letters].sort((a, b) => ALPHABET.indexOf(a) - ALPHABET.indexOf(b));
  return order(r, "Ordena las letras en orden alfabético.", [{ seq: sorted }]);
}

function abcWords(r: Rng): Question {
  const byFirst = new Map<string, string>();
  for (const x of r.shuffle(WORDS)) {
    const first = x.w[0];
    if (ALPHABET.includes(first) && !byFirst.has(first)) byFirst.set(first, x.w);
  }
  const picked = r.shuffle([...byFirst.values()]).slice(0, r.int(3, 4));
  const sorted = [...picked].sort((a, b) => ALPHABET.indexOf(a[0]) - ALPHABET.indexOf(b[0]));
  return order(r, "Ordena las palabras en orden alfabético.", [{ seq: sorted }]);
}

export const ROWS: Row[] = [
  ["LL.1", "Completar la oración con un sustantivo según el dibujo", (r) => choose(r, "Completa la oración según el dibujo.", NOUN_FOR_PICTURE)],
  ["LL.2", "Comparar dibujos usando adjetivos", (r) => choose(r, "Completa la oración según el dibujo.", COMPARE_ADJ)],
  ["LL.3", "Usar palabras de números", numberWords],

  ["MM.1", "Clasificar palabras en categorías", sortCategory],
  ["MM.2", "¿Qué palabra no es como las demás?", oddOneOut],

  ["NN.1", "Elegir sinónimos", (r) => choose(r, "", SYNONYMS)],
  ["NN.2", "Elegir antónimos", (r) => choose(r, "", ANTONYMS)],

  ["OO.1", "Palabras con varios significados", (r) => choose(r, "¿Qué significa la palabra en esta oración?", MULTI_MEANING)],

  ["PP.1", "Encontrar palabras de significado parecido", (r) => chooseAll(r, "", RELATED)],
  ["PP.2", "Distinguir palabras de significado parecido", (r) => choose(r, "", DIFFERENCE)],
  ["PP.3", "Ordenar palabras según su significado", (r) => order(r, "", SHADES)],

  ["QQ.1", "Usar palabras con prefijos y sufijos", (r) => choose(r, "Completa la oración.", AFFIX_USE)],
  ["QQ.2", "Entender palabras con prefijos y sufijos", (r) => choose(r, "", AFFIX_MEANING)],

  ["RR.1", "Usar el contexto para entender una palabra", (r) => choose(r, "", CONTEXT)],

  ["SS.1", "Ordenar letras alfabéticamente", abcLetters],
  ["SS.2", "Ordenar palabras alfabéticamente", abcWords],
];
