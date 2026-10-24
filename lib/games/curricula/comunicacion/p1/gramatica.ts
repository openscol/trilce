import { choose, order, pickAll, pickInSentence, type ChoiceItem, type InSentenceItem, type OrderItem } from "../../../generators/lengua/bank";
import { uniqueOptions } from "../../../generators/common";
import type { Rng } from "../../../rng";
import type { Question } from "../../../types";
import type { Row } from "./row";

// 1.° de Primaria · banco de gramática y ortografía: tipos de oración con los
// signos ¿? y ¡!, sujeto y predicado, sustantivos y plurales en -ces,
// pertenencia con de y del, pronombres, ser y estar, tiempos verbales,
// artículos, adjetivos, preposiciones, conectores y mayúsculas (los días y
// los meses van con minúscula).


// ---------------------------------------------------------------------------
// Oraciones
// ---------------------------------------------------------------------------

const KINDS = ["Afirmación", "Pregunta", "Exclamación", "Orden"] as const;
type Kind = (typeof KINDS)[number];
const BY_KIND: Record<Kind, string[]> = {
  Afirmación: ["El perro duerme en su cama.", "Hoy es lunes.", "Mi casa es azul.", "Los peces viven en el agua.", "Ana tiene siete años."],
  Pregunta: ["¿Dónde está mi lápiz?", "¿Quieres jugar conmigo?", "¿Cómo te llamas?", "¿Qué hora es?", "¿Te gusta el helado?"],
  Exclamación: ["¡Qué bonito día!", "¡Ganamos el partido!", "¡Qué miedo!", "¡Me encanta este regalo!", "¡Qué rico pastel!"],
  Orden: ["Cierra la puerta.", "Lávate las manos.", "Guarda tus juguetes.", "Siéntate en tu silla.", "Abre tu libro."],
};
const KIND_PROMPT: Record<Kind, string> = {
  Afirmación: "¿Cuál es una afirmación (cuenta algo)?",
  Pregunta: "¿Cuál es una pregunta?",
  Exclamación: "¿Cuál es una exclamación (muestra emoción)?",
  Orden: "¿Cuál es una orden (pide hacer algo)?",
};

function findKind(r: Rng, kind: Kind): Question {
  const answer = r.pick(BY_KIND[kind]);
  const others = KINDS.filter((k) => k !== kind).map((k) => r.pick(BY_KIND[k]));
  return {
    kind: "choice",
    prompt: KIND_PROMPT[kind],
    options: uniqueOptions(r, answer, others),
    answer,
    explanation: `«${answer}» es una ${kind.toLowerCase()}.`,
    tag: kind,
  };
}

function classifySentence(r: Rng): Question {
  const kind = r.pick([...KINDS]);
  const s = r.pick(BY_KIND[kind]);
  return {
    kind: "choice",
    prompt: "¿Qué tipo de oración es?",
    visual: { kind: "text", text: s },
    options: [...KINDS],
    answer: kind,
    explanation: `Es una ${kind.toLowerCase()}.`,
    tag: kind,
  };
}

const MARKS = ["¿ ... ?", "¡ ... !", "Punto final ( . )"];
const END_MARKS: ChoiceItem[] = (
  [
    ["Cómo te llamas", 0], ["Qué bonito día", 1], ["El gato duerme", 2], ["Dónde vives", 0],
    ["Qué sorpresa", 1], ["Me gusta leer", 2], ["Tienes hambre", 0], ["Ganamos el partido", 1], ["Mi abuela hace pan", 2],
  ] as const
).map(([t, i]) => ({ t: `__ ${t} __`, a: MARKS[i], d: MARKS.filter((_, k) => k !== i) }));

const QUESTION_WORDS = ["¿Quién?", "¿Qué?", "¿Cuándo?", "¿Dónde?", "¿Por qué?"];
const WH: ChoiceItem[] = (
  [
    ["Mi abuela cocina en la cocina.", "En la cocina", 3], ["Pedro trajo el pastel.", "Pedro", 0], ["Comimos fruta en el recreo.", "Fruta", 1],
    ["Vamos a la playa el sábado.", "El sábado", 2], ["Lloró porque se cayó.", "Porque se cayó", 4], ["Los niños juegan en el patio.", "En el patio", 3],
    ["La maestra leyó un cuento.", "La maestra", 0], ["Me abrigo porque hace frío.", "Porque hace frío", 4], ["Mañana iremos al zoológico.", "Mañana", 2],
  ] as const
).map(([t, part, i]) => ({ t, p: `«${part}» responde a la pregunta...`, a: QUESTION_WORDS[i], d: QUESTION_WORDS.filter((_, k) => k !== i) }));

const SUBJ_PRED: [string, string][] = [
  ["El perro", "ladra fuerte"], ["Mi mamá", "cocina arroz"], ["Los pájaros", "vuelan alto"],
  ["Ana", "salta la cuerda"], ["El sol", "brilla mucho"], ["Mis amigos", "juegan fútbol"],
];
const SUBJ = "Quién lo hace (sujeto)";
const PRED = "Qué hace (predicado)";

function subjectOrPredicate(r: Rng): Question {
  const [s, p] = r.pick(SUBJ_PRED);
  const askSubject = r.chance(0.5);
  return {
    kind: "choice",
    prompt: `En la oración, ¿qué parte es «${askSubject ? s : p}»?`,
    visual: { kind: "text", text: `${s} ${p}.` },
    options: [SUBJ, PRED],
    answer: askSubject ? SUBJ : PRED,
    explanation: `«${s}» dice quién; «${p}» dice qué hace.`,
  };
}

const COMPLETE = ["El gato duerme.", "Mi hermana canta.", "Los niños juegan en el patio.", "La luna brilla.", "Papá lava el carro.", "El pez nada."];
const FRAGMENTS = ["El gato grande", "corre por el", "Mi hermana y", "en el patio", "La luna de", "lava el"];

const FINISH: ChoiceItem[] = [
  { t: "El pájaro ___", a: "canta en el árbol.", d: ["en el árbol alto.", "el pájaro y el nido.", "y el gato del patio."] },
  { t: "Mi mamá ___", a: "prepara la cena.", d: ["la cena de hoy.", "y mi papá en casa.", "de la casa grande."] },
  { t: "Los niños ___", a: "juegan en el parque.", d: ["en el parque.", "los niños del colegio.", "con la pelota roja."] },
  { t: "La vaca ___", a: "come pasto.", d: ["pasto.", "y el toro de la granja.", "de la granja."] },
  { t: "Yo ___", a: "leo un cuento.", d: ["un cuento.", "y tú en la escuela.", "en la cama de noche."] },
];

const UNSCRAMBLE: OrderItem[] = [
  { seq: ["El", "gato", "toma", "leche."] },
  { seq: ["Mi", "perro", "es", "negro."] },
  { seq: ["Ana", "juega", "con", "su", "pelota."] },
  { seq: ["Los", "niños", "van", "al", "colegio."] },
  { seq: ["La", "luna", "brilla", "de", "noche."] },
  { seq: ["Me", "gusta", "comer", "fruta."] },
];

// ---------------------------------------------------------------------------
// Sustantivos
// ---------------------------------------------------------------------------

const NOUN_KINDS = ["Persona", "Animal", "Lugar", "Cosa"];
const NOUN_KIND: ChoiceItem[] = (
  [
    ["maestra", 0], ["doctor", 0], ["niño", 0], ["bombero", 0],
    ["perro", 1], ["gato", 1], ["caballo", 1], ["mariposa", 1],
    ["escuela", 2], ["parque", 2], ["playa", 2], ["mercado", 2],
    ["lápiz", 3], ["mesa", 3], ["pelota", 3], ["libro", 3],
  ] as const
).map(([t, i]) => ({ t, a: NOUN_KINDS[i], d: NOUN_KINDS.filter((_, k) => k !== i) }));

const NOUNS = ["perro", "casa", "libro", "árbol", "niña", "pelota", "mesa", "flor"];
const NOT_NOUNS = ["correr", "bonito", "saltar", "rápido", "comer", "azul", "grande", "dormir"];

const NOUNS_IN: InSentenceItem[] = [
  { s: "El perro come su hueso.", ans: ["perro", "hueso"] },
  { s: "La niña lee un libro.", ans: ["niña", "libro"] },
  { s: "Mi papá maneja el carro.", ans: ["papá", "carro"] },
  { s: "El gato duerme en la cama.", ans: ["gato", "cama"] },
  { s: "Los niños juegan con la pelota.", ans: ["niños", "pelota"] },
];

const PROPER = ["Lima", "Ana", "Perú", "Pedro", "Toby", "Cusco"];
const COMMON = ["ciudad", "niña", "país", "perro", "río", "escuela"];

const PROPER_IN: ChoiceItem[] = [
  { t: "Mi perro se llama Toby.", a: "Toby", d: ["perro", "Mi", "llama"] },
  { t: "Mañana viajamos a Cusco.", a: "Cusco", d: ["Mañana", "viajamos", "a"] },
  { t: "Mi maestra se llama Rosa.", a: "Rosa", d: ["maestra", "Mi", "llama"] },
  { t: "El río Amazonas es muy largo.", a: "Amazonas", d: ["río", "El", "largo"] },
  { t: "Juan juega con su pelota.", a: "Juan", d: ["pelota", "juega", "su"] },
  { t: "Vivo en el Perú.", a: "Perú", d: ["Vivo", "en", "el"] },
];

const REGULAR: [emoji: string, one: string, many: string][] = [
  ["🐱", "gato", "gatos"], ["🍎", "manzana", "manzanas"], ["⭐", "estrella", "estrellas"], ["🎈", "globo", "globos"],
  ["🦆", "pato", "patos"], ["📖", "libro", "libros"], ["🏠", "casa", "casas"], ["🌸", "flor", "flores"],
];

function pluralPicture(r: Rng): Question {
  const [e, one, many] = r.pick(REGULAR);
  const count = r.chance(0.5) ? 1 : r.int(2, 5);
  const answer = count === 1 ? one : many;
  return {
    kind: "choice",
    prompt: "¿Qué palabra corresponde al dibujo?",
    visual: { kind: "objects", emoji: e, count },
    options: [one, many],
    answer,
    explanation: count === 1 ? `Hay uno: «${one}».` : `Hay más de uno: «${many}».`,
    tag: count === 1 ? "singular" : "plural",
  };
}

const PLURAL_FORMS: ChoiceItem[] = (
  [
    ["árbol", "árboles"], ["flor", "flores"], ["pan", "panes"], ["reloj", "relojes"], ["papel", "papeles"], ["mar", "mares"],
    ["casa", "casas"], ["mesa", "mesas"], ["gato", "gatos"], ["camión", "camiones"], ["ratón", "ratones"], ["balón", "balones"],
  ] as const
).map(([w, pl]) => {
  const s = w + "s";
  const es = w + "es";
  return { t: `un ${w} → dos ___`, a: pl, d: [s, es, w + "ses"].filter((x) => x !== pl) };
});

const SING_PLUR: ChoiceItem[] = [
  { t: "Hay dos ___ en el árbol.", a: "pájaros", d: ["pájaro"] },
  { t: "Tengo un ___ rojo.", a: "lápiz", d: ["lápices"] },
  { t: "Mi abuela tiene tres ___.", a: "gatos", d: ["gato"] },
  { t: "Comí una ___ verde.", a: "manzana", d: ["manzanas"] },
  { t: "Los ___ juegan en el patio.", a: "niños", d: ["niño"] },
  { t: "La ___ vuela entre las flores.", a: "mariposa", d: ["mariposas"] },
];

const Z_PLURALS: [emoji: string, one: string, many: string][] = [
  ["🐟", "pez", "peces"], ["✏️", "lápiz", "lápices"], ["💡", "luz", "luces"], ["👃", "nariz", "narices"], ["🌽", "maíz", "maíces"],
];

function irregularPlural(r: Rng): Question {
  const [e, one, many] = r.pick(Z_PLURALS);
  return {
    kind: "choice",
    prompt: "¿Qué palabra corresponde al dibujo?",
    visual: { kind: "objects", emoji: e, count: r.int(2, 4) },
    options: uniqueOptions(r, many, [one, one + "s", one + "es"]),
    answer: many,
    explanation: `Las palabras que terminan en z forman el plural con -ces: ${one} → ${many}.`,
  };
}

const POSSESSIVE_PIC: ChoiceItem[] = (
  [
    ["🦴 🐶", "el hueso del perro", "el perro del hueso"],
    ["👑 🤴", "la corona del rey", "el rey de la corona"],
    ["🧀 🐭", "el queso del ratón", "el ratón del queso"],
    ["🪺 🐦", "el nido del pájaro", "el pájaro del nido"],
    ["🥕 🐰", "la zanahoria del conejo", "el conejo de la zanahoria"],
  ] as const
).map(([pic, a, d]) => ({ pic, a, d: [d] }));

const POSSESSIVE_FORM: ChoiceItem[] = [
  { t: "La pelota es de Ana. Es la pelota ___ Ana.", a: "de", d: ["del", "al"] },
  { t: "El hueso es del perro. Es el hueso ___ perro.", a: "del", d: ["de el", "al"] },
  { t: "La casa es de mi abuela. Es la casa ___ mi abuela.", a: "de", d: ["del", "al"] },
  { t: "La cola es del gato. Es la cola ___ gato.", a: "del", d: ["de el", "al"] },
  { t: "El juguete es de Luis. Es el juguete ___ Luis.", a: "de", d: ["del", "al"] },
];

// ---------------------------------------------------------------------------
// VV-XX. Pronombres, verbos y concordancia
// ---------------------------------------------------------------------------

const SUBJ_OBJ: ChoiceItem[] = [
  { t: "___ juego con la pelota.", a: "Yo", d: ["Me", "Mí"] },
  { t: "Mi mamá ___ abraza.", a: "me", d: ["yo", "mí"] },
  { t: "___ corre muy rápido.", a: "Él", d: ["Lo", "Le"] },
  { t: "Pedro se cayó y Ana ___ ayudó.", a: "lo", d: ["él", "yo"] },
  { t: "___ cantamos juntos.", a: "Nosotros", d: ["Nos", "Ustedes"] },
  { t: "El regalo es para ___.", a: "ti", d: ["tú", "te"] },
];

const PERSONAL: ChoiceItem[] = [
  { t: "Pedro tiene sueño. ___ se va a dormir.", a: "Él", d: ["Ella", "Nosotros", "Ellas"] },
  { t: "María y Lucía juegan. ___ se ríen mucho.", a: "Ellas", d: ["Él", "Ella", "Nosotras"] },
  { t: "Mi hermano y yo comemos fruta. ___ comemos juntos.", a: "Nosotros", d: ["Ellos", "Ustedes", "Tú"] },
  { t: "La gata duerme. ___ ronronea.", a: "Ella", d: ["Él", "Ellos", "Nosotros"] },
  { t: "Los perros ladran. ___ tienen hambre.", a: "Ellos", d: ["Él", "Ella", "Nosotros"] },
];

const PRONOUN_SENT: ChoiceItem[] = [
  { t: "___ tengo un perro.", a: "Yo", d: ["Tú", "Él", "Ellos"] },
  { t: "¿___ quieres jugar?", a: "Tú", d: ["Yo", "Nosotros", "Ellos"] },
  { t: "___ somos amigos.", a: "Nosotros", d: ["Yo", "Ustedes", "Ella"] },
  { t: "___ son mis primas.", a: "Ellas", d: ["Él", "Ellos", "Tú"] },
  { t: "___ es mi mejor amigo.", a: "Él", d: ["Ella", "Nosotros", "Ellos"] },
];

const POSS_ADJ: ChoiceItem[] = [
  { t: "Yo tengo un perro. Es ___ perro.", a: "mi", d: ["tu", "su", "nuestro"] },
  { t: "Tú tienes una gorra. Es ___ gorra.", a: "tu", d: ["mi", "su", "nuestra"] },
  { t: "Pedro tiene un libro. Es ___ libro.", a: "su", d: ["mi", "tu", "nuestro"] },
  { t: "Nosotros tenemos una casa. Es ___ casa.", a: "nuestra", d: ["mi", "tu", "nuestro"] },
  { t: "Ellos tienen un carro. Es ___ carro.", a: "su", d: ["mi", "tu", "nuestro"] },
];

const POSS_PRON: ChoiceItem[] = [
  { t: "Este lápiz es de mí. Es ___.", a: "mío", d: ["tuyo", "suyo", "mía"] },
  { t: "Esta gorra es de ti. Es ___.", a: "tuya", d: ["tuyo", "mía", "suya"] },
  { t: "Esta casa es de nosotros. Es ___.", a: "nuestra", d: ["nuestro", "mía", "suya"] },
  { t: "El juguete es de Ana. Es ___.", a: "suyo", d: ["suya", "mío", "tuyo"] },
  { t: "La pelota es de mí. Es ___.", a: "mía", d: ["mío", "tuya", "suya"] },
];

const VERB_PIC: ChoiceItem[] = [
  { pic: "🏊", t: "El niño ___ en la piscina.", a: "nada", d: ["vuela", "duerme", "canta"] },
  { pic: "😴", t: "Mi gato ___ en la cama.", a: "duerme", d: ["corre", "nada", "salta"] },
  { pic: "🎤", t: "Ana ___ una canción.", a: "canta", d: ["come", "barre", "nada"] },
  { pic: "🏃", t: "Pedro ___ muy rápido.", a: "corre", d: ["duerme", "lee", "come"] },
  { pic: "📖", t: "La maestra ___ un cuento.", a: "lee", d: ["salta", "nada", "barre"] },
  { pic: "🐦", t: "El pájaro ___ alto.", a: "vuela", d: ["nada", "lee", "come"] },
];

const VERBS = ["correr", "saltar", "comer", "dormir", "cantar", "leer", "nadar", "escribir"];
const NOT_VERBS = ["mesa", "bonito", "perro", "azul", "casa", "grande", "flor", "feliz"];

const VERB_USE: ChoiceItem[] = [
  { t: "Uso la escoba para ___ el piso.", a: "barrer", d: ["beber", "volar", "cantar"] },
  { t: "Uso el lápiz para ___.", a: "escribir", d: ["nadar", "dormir", "cocinar"] },
  { t: "Uso la cuchara para ___ la sopa.", a: "tomar", d: ["cortar", "barrer", "pintar"] },
  { t: "Uso las tijeras para ___ el papel.", a: "cortar", d: ["comer", "leer", "lavar"] },
  { t: "Uso los ojos para ___.", a: "ver", d: ["oír", "oler", "saltar"] },
  { t: "Uso el jabón para ___ las manos.", a: "lavar", d: ["pintar", "cortar", "escribir"] },
];

const ONE_OR_MORE: ChoiceItem[] = [
  "El perro ladra.", "Los perros ladran.", "La niña salta.", "Las niñas saltan.",
  "Mi amigo canta.", "Mis amigos cantan.", "El pájaro vuela.", "Los pájaros vuelan.",
].map((t, i) => ({ t, a: i % 2 === 0 ? "Uno" : "Más de uno", d: [i % 2 === 0 ? "Más de uno" : "Uno"] }));

const BEST_VERB: ChoiceItem[] = [
  { t: "El gato ___ leche.", a: "toma", d: ["toman"] },
  { t: "Los niños ___ en el parque.", a: "juegan", d: ["juega"] },
  { t: "Mi mamá ___ pan.", a: "compra", d: ["compran"] },
  { t: "Las flores ___ bonitas.", a: "son", d: ["es"] },
  { t: "El pez ___ en el agua.", a: "nada", d: ["nadan"] },
  { t: "Mis primos ___ en Lima.", a: "viven", d: ["vive"] },
];

const BEST_SUBJECT: ChoiceItem[] = [
  { t: "___ duermen en la cama.", a: "Los gatos", d: ["El gato"] },
  { t: "___ corre muy rápido.", a: "El caballo", d: ["Los caballos"] },
  { t: "___ cantan en el coro.", a: "Las niñas", d: ["La niña"] },
  { t: "___ brilla en el cielo.", a: "El sol", d: ["Los soles"] },
  { t: "___ comen semillas.", a: "Los pájaros", d: ["El pájaro"] },
  { t: "___ salta la cuerda.", a: "Ana", d: ["Ana y Luis"] },
];

const PRONOUN_VERB: ChoiceItem[] = [
  { t: "Nosotros ___ fútbol.", a: "jugamos", d: ["juega", "juegan", "juego"] },
  { t: "Yo ___ un helado.", a: "como", d: ["come", "comen", "comemos"] },
  { t: "Tú ___ muy bien.", a: "cantas", d: ["canto", "canta", "cantan"] },
  { t: "Ellos ___ al colegio.", a: "van", d: ["va", "voy", "vamos"] },
  { t: "Ella ___ un libro.", a: "lee", d: ["leo", "leen", "leemos"] },
  { t: "Ustedes ___ en el patio.", a: "corren", d: ["corre", "corro", "corremos"] },
];

const PRONOUN_SUBJECT: ChoiceItem[] = [
  { t: "___ comemos fruta.", a: "Nosotros", d: ["Yo", "Ellos", "Ustedes"] },
  { t: "___ bailas muy bien.", a: "Tú", d: ["Yo", "Ella", "Ellos"] },
  { t: "___ duermo temprano.", a: "Yo", d: ["Tú", "Nosotros", "Ellas"] },
  { t: "___ juegan en el parque.", a: "Ellos", d: ["Yo", "Tú", "Nosotros"] },
  { t: "___ escribe una carta.", a: "Ella", d: ["Yo", "Nosotros", "Ellas"] },
];

// ---------------------------------------------------------------------------
// Tiempos verbales
// ---------------------------------------------------------------------------

const TENSES = { presente: 0, pasado: 1, futuro: 2 } as const;
type Tense = keyof typeof TENSES;
const TENSE_SENTENCES: [string, string, string][] = [
  ["Ahora juego con mi perro.", "Ayer jugué con mi perro.", "Mañana jugaré con mi perro."],
  ["Hoy como sopa.", "Ayer comí sopa.", "Mañana comeré sopa."],
  ["Ana lee un libro ahora.", "Ana leyó un libro ayer.", "Ana leerá un libro mañana."],
  ["El bebé duerme en este momento.", "El bebé durmió toda la noche.", "El bebé dormirá la siesta después."],
];

function findTense(r: Rng, tense: Tense): Question {
  const row = r.pick(TENSE_SENTENCES);
  const answer = row[TENSES[tense]];
  const others = TENSE_SENTENCES.flatMap((s) => s.filter((_, i) => i !== TENSES[tense]));
  const word = { presente: "del presente (ahora)", pasado: "del pasado (ya pasó)", futuro: "del futuro (todavía no pasa)" }[tense];
  return {
    kind: "choice",
    prompt: `¿Qué oración habla ${word}?`,
    options: uniqueOptions(r, answer, r.shuffle(others).slice(0, 5)),
    answer,
    explanation: `«${answer}» está en ${tense}.`,
    tag: tense,
  };
}

const TIMELINE = ["Ayer (pasado)", "Hoy (presente)", "Mañana (futuro)"];
function timelineItems(list: [string, number][]): ChoiceItem[] {
  return list.map(([t, i]) => ({ t, a: TIMELINE[i], d: TIMELINE.filter((_, k) => k !== i) }));
}
const TIMELINE_REGULAR = timelineItems(TENSE_SENTENCES.flatMap((row) => row.map((s, i) => [s, [1, 0, 2][i]] as [string, number])));
const TIMELINE_IRREGULAR = timelineItems([
  ["Ayer fui al mercado.", 0], ["Mañana iré al mercado.", 2], ["Ahora voy al mercado.", 1], ["Ayer tuve un sueño bonito.", 0],
  ["Mañana tendré una fiesta.", 2], ["Ahora hago mi cama.", 1], ["Ayer hice un dibujo.", 0], ["Mañana haré un pastel.", 2],
]);

const PAST_REGULAR: ChoiceItem[] = (
  [
    ["canta", "cantó", "cantará"], ["salta", "saltó", "saltará"], ["juega", "jugó", "jugará"], ["come", "comió", "comerá"],
    ["baila", "bailó", "bailará"], ["corre", "corrió", "correrá"], ["pinta", "pintó", "pintará"], ["nada", "nadó", "nadará"],
  ] as const
).map(([now, past, fut]) => ({ t: `Hoy Ana ${now}. Ayer Ana ___.`, a: past, d: [now, fut, `${now}ndo`] }));

const PAST_IRREGULAR: ChoiceItem[] = [
  { t: "Hoy voy al parque. Ayer ___ al parque.", a: "fui", d: ["voy", "iré", "ido"] },
  { t: "Hoy tengo frío. Ayer ___ frío.", a: "tuve", d: ["tengo", "tendré", "tení"] },
  { t: "Hoy hago la tarea. Ayer ___ la tarea.", a: "hice", d: ["hago", "haré", "hací"] },
  { t: "Hoy digo «hola». Ayer ___ «hola».", a: "dije", d: ["digo", "diré", "decí"] },
  { t: "Hoy pongo la mesa. Ayer ___ la mesa.", a: "puse", d: ["pongo", "pondré", "poní"] },
  { t: "Hoy doy un regalo. Ayer ___ un regalo.", a: "di", d: ["doy", "daré", "dí"] },
];

const ENDINGS: ChoiceItem[] = (
  [
    ["Ella está salt", "ando"], ["Él está com", "iendo"], ["Los niños están jug", "ando"], ["Mamá está escrib", "iendo"],
    ["El perro está corr", "iendo"], ["Papá está cant", "ando"], ["Yo estoy le", "yendo"],
  ] as const
).map(([t, a]) => ({ t: `${t}___.`, a, d: ["ando", "iendo", "yendo"].filter((x) => x !== a), say: `${t}${a}`, p: "Toca 🔊, escucha y completa." }));

const DONE_OR_NOW: ChoiceItem[] = [
  "El niño está pintando.", "El niño pintó un dibujo.", "La niña está comiendo.", "La niña comió su almuerzo.",
  "El perro está corriendo.", "El perro corrió en el parque.",
].map((t, i) => ({ t, a: i % 2 === 0 ? "Está pasando ahora" : "Ya terminó", d: [i % 2 === 0 ? "Ya terminó" : "Está pasando ahora"] }));

function conj(rows: [string, string][], forms: string[]): ChoiceItem[] {
  return rows.map(([t, a]) => ({ t, a, d: forms.filter((f) => f !== a) }));
}

const SER = conj([["Yo ___ alto.", "soy"], ["Tú ___ mi amigo.", "eres"], ["Ella ___ doctora.", "es"], ["Nosotros ___ hermanos.", "somos"], ["Ellos ___ peruanos.", "son"]], ["soy", "eres", "es", "somos", "son"]);
const ESTAR = conj([["Yo ___ feliz.", "estoy"], ["Tú ___ cansado.", "estás"], ["El gato ___ en la caja.", "está"], ["Nosotros ___ en clase.", "estamos"], ["Ellas ___ contentas.", "están"]], ["estoy", "estás", "está", "estamos", "están"]);
const SER_O_ESTAR: ChoiceItem[] = [
  { t: "La manzana ___ roja.", a: "es", d: ["está"] },
  { t: "Hoy ___ muy cansado.", a: "estoy", d: ["soy"] },
  { t: "Mi casa ___ grande.", a: "es", d: ["está"] },
  { t: "El perro ___ en el jardín.", a: "está", d: ["es"] },
  { t: "Yo ___ Ana.", a: "soy", d: ["estoy"] },
  { t: "Mi mamá ___ en la cocina.", a: "está", d: ["es"] },
];
const TENER = conj([["Yo ___ un perro.", "tengo"], ["Tú ___ un gato.", "tienes"], ["Ella ___ una muñeca.", "tiene"], ["Nosotros ___ hambre.", "tenemos"], ["Ellos ___ una pelota.", "tienen"]], ["tengo", "tienes", "tiene", "tenemos", "tienen"]);

// ---------------------------------------------------------------------------
// ZZ-AAA. Artículos y adjetivos
// ---------------------------------------------------------------------------

const ARTICLES = ["el", "la", "los", "las"];
const ARTICLE_ITEMS: ChoiceItem[] = (
  [
    ["casa", "la"], ["perro", "el"], ["libros", "los"], ["flores", "las"], ["sol", "el"], ["luna", "la"],
    ["niños", "los"], ["mesas", "las"], ["árbol", "el"], ["mano", "la"], ["día", "el"], ["mapa", "el"],
  ] as const
).map(([w, a]) => ({ t: `___ ${w}`, a, d: ARTICLES.filter((x) => x !== a) }));

const ARTICLES_IN: InSentenceItem[] = [
  { s: "El perro y la gata juegan.", ans: ["El", "la"] },
  { s: "Los niños comen una manzana.", ans: ["Los", "una"] },
  { s: "Las flores están en el jardín.", ans: ["Las", "el"] },
  { s: "Un pájaro canta en la ventana.", ans: ["Un", "la"] },
  { s: "La maestra lee un cuento.", ans: ["La", "un"] },
];

const SENSES = ["La vista 👀", "El oído 👂", "El olfato 👃", "El gusto 👅", "El tacto ✋"];
const SENSE_WORDS: ChoiceItem[] = (
  [["dulce", 3], ["salado", 3], ["ruidoso", 1], ["suave", 4], ["áspero", 4], ["brillante", 0], ["colorido", 0], ["perfumado", 2], ["apestoso", 2], ["silencioso", 1]] as const
).map(([w, i]) => ({ p: `¿Con qué sentido sabemos que algo es «${w}»?`, t: w, a: SENSES[i], d: SENSES.filter((_, k) => k !== i) }));

const HOW_OR_HOW_MANY: ChoiceItem[] = (
  [
    ["Tengo tres gatos.", "tres", 1], ["Hay muchas flores.", "muchas", 1], ["Compré dos panes.", "dos", 1], ["Veo cinco pájaros.", "cinco", 1],
    ["Tengo un gato negro.", "negro", 0], ["La casa es grande.", "grande", 0], ["El gato es suave.", "suave", 0], ["Mi papá es alto.", "alto", 0],
  ] as const
).map(([t, w, i]) => ({ t, p: `¿Qué nos dice «${w}»?`, a: ["Cómo es", "Cuántos hay"][i], d: [["Cuántos hay", "Cómo es"][i]] }));

const ADJECTIVES_IN: InSentenceItem[] = [
  { s: "El perro grande ladra.", ans: ["grande"] },
  { s: "La flor roja es bonita.", ans: ["roja", "bonita"] },
  { s: "Tengo un gato negro.", ans: ["negro"] },
  { s: "El agua fría está rica.", ans: ["fría", "rica"] },
  { s: "Mi hermana alta canta.", ans: ["alta"] },
];

const COMPARATIVES: ChoiceItem[] = [
  { pic: "🐘 🐶", t: "El elefante es ___ que el perro.", a: "más grande", d: ["el más grande", "grande"] },
  { pic: "🐢 🐇", t: "La tortuga es ___ que el conejo.", a: "más lenta", d: ["la más lenta", "lenta"] },
  { pic: "🧍 🧍‍♂️ 🧒", t: "De los tres hermanos, Juan es ___.", a: "el más alto", d: ["más alto que", "alto que"] },
  { pic: "✏️ 🖍️", t: "Mi lápiz es ___ que tu crayón.", a: "más largo", d: ["el más largo", "largo"] },
  { pic: "🍉 🍎 🍇", t: "De todas las frutas, la sandía es ___.", a: "la más grande", d: ["más grande que", "grande que"] },
  { pic: "☀️ 🌙", t: "El sol es ___ que la luna.", a: "más brillante", d: ["el más brillante", "brillante"] },
];

const COMPARE_KIND: [string, number][] = [
  ["Pedro es más alto que Luis.", 0], ["Ana es la más alta de la clase.", 1], ["Mi perro es más rápido que tu gato.", 0],
  ["Este es el pastel más rico de todos.", 1], ["La sandía es más pesada que la uva.", 0], ["El guepardo es el animal más veloz.", 1],
];
const COMPARE_TYPE: ChoiceItem[] = COMPARE_KIND.map(([t, i]) => ({
  t, a: ["Compara dos cosas (más... que)", "Compara con todos (el más...)"][i], d: [["Compara con todos (el más...)", "Compara dos cosas (más... que)"][i]],
}));
const COMPARE_COUNT: ChoiceItem[] = COMPARE_KIND.map(([t, i]) => ({ t, p: "¿Cuántas cosas compara?", a: ["Dos", "Más de dos"][i], d: [["Más de dos", "Dos"][i]] }));

// ---------------------------------------------------------------------------
// BBB-EEE. Preposiciones, conectores, contracciones y mayúsculas
// ---------------------------------------------------------------------------

const PLACES = ["encima de", "debajo de", "al lado de", "dentro de"];
const PREP_PIC: ChoiceItem[] = (
  [
    ["🐦\n🌳", "El pájaro está ___ el árbol.", 0], ["🌳\n🐶", "El perro está ___ el árbol.", 1], ["🐱 📦", "El gato está ___ la caja.", 2],
    ["☁️\n🏠", "La nube está ___ la casa.", 0], ["🚗 🏠", "El carro está ___ la casa.", 2], ["🪑\n🐈", "El gato está ___ la silla.", 1],
  ] as const
).map(([pic, t, i]) => ({ pic, t, a: PLACES[i], d: PLACES.filter((_, k) => k !== i) }));

const PREP_SENT: ChoiceItem[] = [
  { t: "Voy ___ la escuela.", a: "a", d: ["de", "y", "sin"] },
  { t: "El regalo es ___ ti.", a: "para", d: ["de", "en", "sin"] },
  { t: "Juego ___ mi hermano.", a: "con", d: ["de", "en", "a"] },
  { t: "Vengo ___ la tienda.", a: "de", d: ["con", "para", "sin"] },
  { t: "Corté el papel ___ tijeras.", a: "con", d: ["sin", "para", "de"] },
  { t: "Mi cumpleaños es ___ mayo.", a: "en", d: ["a", "para", "sin"] },
];

const CONJ: ChoiceItem[] = [
  { t: "Tengo un perro ___ un gato.", a: "y", d: ["pero", "porque", "o"] },
  { t: "¿Quieres jugo ___ agua?", a: "o", d: ["y", "porque", "pero"] },
  { t: "Quiero salir, ___ está lloviendo.", a: "pero", d: ["y", "o", "porque"] },
  { t: "Me abrigo ___ hace frío.", a: "porque", d: ["pero", "o", "y"] },
  { t: "¿Vamos al parque ___ al cine?", a: "o", d: ["y", "porque", "pero"] },
];

const TIME_WORDS = ["primero", "luego", "después", "finalmente", "al final"];
const NOT_TIME_WORDS = ["gato", "rojo", "mesa", "saltar", "feliz", "libro"];

const SENTENCE_ORDER: OrderItem[] = [
  { seq: ["Primero, me lavo las manos.", "Luego, como mi almuerzo.", "Al final, lavo mi plato."] },
  { seq: ["Primero, me pongo el pijama.", "Después, me cepillo los dientes.", "Al final, me duermo."] },
  { seq: ["Primero, plantamos la semilla.", "Luego, la regamos.", "Al final, crece una flor."] },
  { seq: ["Primero, abro el libro.", "Después, leo el cuento.", "Al final, cierro el libro."] },
];

const CONTRACTION_MATCH: ChoiceItem[] = [
  { t: "a + el =", a: "al", d: ["del", "ael", "el"] },
  { t: "de + el =", a: "del", d: ["al", "deel", "de"] },
  { t: "al", p: "¿Qué palabras forman «al»?", a: "a + el", d: ["de + el", "a + la", "de + la"] },
  { t: "del", p: "¿Qué palabras forman «del»?", a: "de + el", d: ["a + el", "de + la", "a + la"] },
];

const CONTRACTION_FORM: ChoiceItem[] = [
  { t: "Voy a el parque.", a: "Voy al parque.", d: ["Voy del parque.", "Voy a el parque."] },
  { t: "Vengo de el colegio.", a: "Vengo del colegio.", d: ["Vengo al colegio.", "Vengo de el colegio."] },
  { t: "El hueso de el perro.", a: "El hueso del perro.", d: ["El hueso al perro.", "El hueso de el perro."] },
  { t: "Llamé a el doctor.", a: "Llamé al doctor.", d: ["Llamé del doctor.", "Llamé a el doctor."] },
];

const CONTRACTION_CORRECT: ChoiceItem[] = [
  { a: "Voy a la playa.", d: ["Voy ala playa.", "Voy al la playa."] },
  { a: "Vengo de la tienda.", d: ["Vengo dela tienda.", "Vengo del la tienda."] },
  { a: "Voy al cine.", d: ["Voy a el cine.", "Voy a l cine."] },
  { a: "Salgo del colegio.", d: ["Salgo de el colegio.", "Salgo dél colegio."] },
];

const AL_DEL: ChoiceItem[] = (
  [["Fuimos ___ zoológico.", "al"], ["Salimos ___ cine.", "del"], ["La cola ___ gato es larga.", "del"], ["Le di comida ___ perro.", "al"], ["Regresé ___ parque.", "del"], ["Subimos ___ bus.", "al"]] as const
).map(([t, a]) => ({ t, a, d: [a === "al" ? "del" : "al"] }));

const CAPS_NAMES: ChoiceItem[] = [
  { a: "Mi perro se llama Toby.", d: ["Mi perro se llama toby.", "mi perro se llama toby."] },
  { a: "Mi amiga es Lucía.", d: ["Mi amiga es lucía.", "mi amiga es lucía."] },
  { a: "Pedro y Ana juegan.", d: ["pedro y ana juegan.", "Pedro y ana juegan."] },
  { a: "Mi gata Luna duerme.", d: ["Mi gata luna duerme.", "mi gata luna duerme."] },
  { a: "Hoy vino mi tío Carlos.", d: ["Hoy vino mi tío carlos.", "hoy vino mi tío carlos."] },
];

const CAPS_DAYS: ChoiceItem[] = [
  { a: "Mi cumpleaños es en mayo.", d: ["Mi cumpleaños es en Mayo."] },
  { a: "Hoy es lunes.", d: ["Hoy es Lunes."] },
  { a: "En diciembre es Navidad.", d: ["En Diciembre es Navidad.", "En diciembre es navidad."] },
  { a: "El sábado vamos al parque.", d: ["El Sábado vamos al parque."] },
  { a: "Las clases empiezan en marzo.", d: ["Las clases empiezan en Marzo."] },
].map((x) => ({ ...x, e: "En castellano, los días de la semana y los meses se escriben con minúscula." }));

const CAPS_SENTENCES: ChoiceItem[] = [
  { a: "Me gusta jugar. Mi juego favorito es la pelota.", d: ["me gusta jugar. mi juego favorito es la pelota.", "Me gusta jugar. mi juego favorito es la pelota."] },
  { a: "Hoy llueve. Me pongo las botas.", d: ["hoy llueve. me pongo las botas.", "Hoy llueve. me pongo las botas."] },
  { a: "Tengo un gato. Se llama Michi.", d: ["tengo un gato. se llama Michi.", "Tengo un gato. se llama michi."] },
  { a: "Vamos a la playa. Llevamos pelota.", d: ["vamos a la playa. llevamos pelota.", "Vamos a la playa. llevamos pelota."] },
].map((x) => ({ ...x, e: "La oración empieza con mayúscula, y después de un punto también va mayúscula." }));

export const ROWS: Row[] = [
  ["tipos-oracion-1", (r) => findKind(r, "Afirmación")],
  ["tipos-oracion-2", (r) => findKind(r, "Pregunta")],
  ["tipos-oracion-3", (r) => findKind(r, "Exclamación")],
  ["tipos-oracion-4", (r) => findKind(r, "Orden")],
  ["tipos-oracion-5", (r) => choose(r, "¿Qué signos necesita la oración?", END_MARKS)],
  ["tipos-oracion-6", classifySentence],
  ["preguntas", (r) => choose(r, "", WH)],
  ["sujeto-predicado", subjectOrPredicate],
  ["oracion-completa-1", (r) => pickAll(r, "Selecciona las oraciones completas.", COMPLETE, FRAGMENTS)],
  ["oracion-completa-2", (r) => choose(r, "¿Qué completa la oración?", FINISH)],
  ["oracion-completa-3", (r) => order(r, "Ordena las palabras para formar una oración.", UNSCRAMBLE)],

  ["sustantivos-1", (r) => choose(r, "¿Qué es?", NOUN_KIND)],
  ["sustantivos-2", (r) => pickAll(r, "Selecciona los sustantivos (nombres de personas, animales, lugares o cosas).", NOUNS, NOT_NOUNS)],
  ["sustantivos-3", (r) => pickInSentence(r, "Selecciona los sustantivos de la oración.", NOUNS_IN)],
  ["sustantivos-4", (r) => pickAll(r, "Selecciona los sustantivos propios (nombres propios).", PROPER, COMMON)],
  ["sustantivos-5", (r) => choose(r, "¿Cuál es el sustantivo propio?", PROPER_IN)],
  ["plurales-1", pluralPicture],
  ["plurales-2", (r) => choose(r, "Escribe el plural.", PLURAL_FORMS)],
  ["plurales-3", (r) => choose(r, "Completa la oración.", SING_PLUR)],
  ["plurales-4", irregularPlural],
  ["pertenencia-1", (r) => choose(r, "¿Qué frase corresponde al dibujo?", POSSESSIVE_PIC)],
  ["pertenencia-2", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],

  ["pronombres-1", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["pronombres-2", (r) => choose(r, "Completa la oración.", PERSONAL)],
  ["pronombres-3", (r) => choose(r, "Completa la oración.", PRONOUN_SENT)],
  ["pronombres-4", (r) => choose(r, "Completa la oración.", POSS_ADJ)],
  ["posesivos-tonicos", (r) => choose(r, "Completa la oración.", POSS_PRON)],

  ["accion-1", (r) => choose(r, "Completa la oración según el dibujo.", VERB_PIC)],
  ["accion-2", (r) => pickAll(r, "Selecciona los verbos (palabras que dicen una acción).", VERBS, NOT_VERBS)],
  ["accion-3", (r) => choose(r, "Completa la oración.", VERB_USE)],

  ["concordancia-1", (r) => choose(r, "¿La oración habla de uno o de más de uno?", ONE_OR_MORE)],
  ["concordancia-2", (r) => choose(r, "Completa la oración.", BEST_VERB)],
  ["concordancia-3", (r) => choose(r, "Completa la oración.", BEST_SUBJECT)],
  ["concordancia-4", (r) => choose(r, "Completa la oración.", PRONOUN_VERB)],
  ["concordancia-5", (r) => choose(r, "Completa la oración.", PRONOUN_SUBJECT)],

  ["tiempos-1", (r) => findTense(r, "presente")],
  ["tiempos-2", (r) => findTense(r, "pasado")],
  ["tiempos-3", (r) => findTense(r, "futuro")],
  ["tiempos-4", (r) => choose(r, "¿Cuándo pasa?", TIMELINE_REGULAR)],
  ["tiempos-5", (r) => choose(r, "Completa con el pasado.", PAST_REGULAR)],
  ["irregulares-1", (r) => choose(r, "Completa con el pasado.", PAST_IRREGULAR)],
  ["irregulares-2", (r) => choose(r, "¿Cuándo pasa?", TIMELINE_IRREGULAR)],
  ["tiempos-6", (r) => choose(r, "", ENDINGS)],
  ["tiempos-7", (r) => choose(r, "¿Está pasando ahora o ya terminó?", DONE_OR_NOW)],
  ["ser-estar-tener-1", (r) => choose(r, "Completa con el verbo ser.", SER)],
  ["ser-estar-tener-2", (r) => choose(r, "Completa con el verbo estar.", ESTAR)],
  ["ser-estar-tener-3", (r) => choose(r, "Completa con ser o estar.", SER_O_ESTAR)],
  ["ser-estar-tener-4", (r) => choose(r, "Completa con el verbo tener.", TENER)],

  ["articulos-1", (r) => choose(r, "¿Qué artículo va?", ARTICLE_ITEMS)],
  ["articulos-2", (r) => pickInSentence(r, "Selecciona los artículos de la oración.", ARTICLES_IN)],

  ["adjetivos-1", (r) => choose(r, "", SENSE_WORDS)],
  ["adjetivos-2", (r) => choose(r, "", HOW_OR_HOW_MANY)],
  ["adjetivos-3", (r) => pickInSentence(r, "Selecciona los adjetivos (palabras que dicen cómo es algo).", ADJECTIVES_IN)],
  ["comparativos-1", (r) => choose(r, "Completa la oración según el dibujo.", COMPARATIVES)],
  ["comparativos-2", (r) => choose(r, "¿Qué tipo de comparación es?", COMPARE_TYPE)],
  ["comparativos-3", (r) => choose(r, "", COMPARE_COUNT)],

  ["preposiciones-1", (r) => choose(r, "Completa la oración según el dibujo.", PREP_PIC)],
  ["preposiciones-2", (r) => choose(r, "Completa la oración.", PREP_SENT)],

  ["conectores-1", (r) => choose(r, "Completa la oración.", CONJ)],
  ["conectores-2", (r) => pickAll(r, "Selecciona las palabras que indican orden en el tiempo.", TIME_WORDS, NOT_TIME_WORDS)],
  ["conectores-3", (r) => order(r, "Ordena las oraciones.", SENTENCE_ORDER)],

  ["pertenencia-3", (r) => choose(r, "Elige la respuesta correcta.", CONTRACTION_MATCH)],
  ["pertenencia-4", (r) => choose(r, "¿Cómo se escribe correctamente?", CONTRACTION_FORM)],
  ["pertenencia-5", (r) => choose(r, "¿Cuál está bien escrita?", CONTRACTION_CORRECT)],
  ["pertenencia-6", (r) => choose(r, "Completa con al o del.", AL_DEL)],

  ["mayusculas-1", (r) => choose(r, "¿Cuál está bien escrita?", CAPS_NAMES)],
  ["mayusculas-2", (r) => choose(r, "¿Cuál está bien escrita?", CAPS_DAYS)],
  ["mayusculas-3", (r) => choose(r, "¿Cuál está bien escrita?", CAPS_SENTENCES)],
];

