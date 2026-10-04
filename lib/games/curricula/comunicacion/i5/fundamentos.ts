import * as K from "../../../generators/lengua/kinder";
import * as P from "../../../generators/lengua/phonics";
import { choose, mix, readPassage, type ChoiceItem, type Passage } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "./row";

// Fundamentos de lectura (IXL Kindergarten ELA, A-Y) en castellano. Lo que
// solo existe en inglés se cambia por su equivalente en la lectoescritura en
// castellano:
// - El abecedario lleva la ñ (se aprende junto con la n).
// - Vocales cortas (short a, e...) → palabras con a, e, i, o, u.
// - Vocales largas (long a...) → palabras que empiezan con cada vocal.
// - Dígrafos sh/th/ck... → ch, ll, rr, qu (y la ñ).
// - Trabadas al final (-nd, -st) → trabadas en medio de la palabra.
// - Sonido de cada consonante → la sílaba que se escucha (sin mezclar letras
//   que suenan igual: b/v, c/k/q, s/z, ll/y).
// - Sight words → palabras frecuentes del castellano, en 10 grupos de 5.

export const SECTIONS: Section[] = [
  { id: "A", name: "Aprender las letras: A–H", icon: "🔤" },
  { id: "B", name: "Aprender las letras: I–P", icon: "🔤" },
  { id: "C", name: "Aprender las letras: Q–Z", icon: "🔤" },
  { id: "D", name: "Identificar letras", icon: "🔎" },
  { id: "E", name: "Minúsculas y mayúsculas", icon: "🔠" },
  { id: "F", name: "Reconocer palabras", icon: "👀" },
  { id: "G", name: "Vocales y consonantes", icon: "🅰️" },
  { id: "H", name: "Rima", icon: "🎵" },
  { id: "I", name: "Sílabas", icon: "👏" },
  { id: "J", name: "Unir y separar sonidos", icon: "🧩" },
  { id: "K", name: "Cambiar sonidos", icon: "🔄" },
  { id: "L", name: "Sonido inicial y final", icon: "🔊" },
  { id: "M", name: "Letras y sonidos", icon: "🔡" },
  { id: "N", name: "Las vocales", icon: "🗣️" },
  { id: "O", name: "Palabras con a", icon: "🅰️" },
  { id: "P", name: "Palabras con e", icon: "📗" },
  { id: "Q", name: "Palabras con i", icon: "📘" },
  { id: "R", name: "Palabras con o", icon: "📙" },
  { id: "S", name: "Palabras con u", icon: "📕" },
  { id: "T", name: "Vocales: repaso", icon: "🔠" },
  { id: "U", name: "Dígrafos: ch, ll, rr, qu", icon: "🔗" },
  { id: "V", name: "Trabadas", icon: "🧱" },
  { id: "W", name: "Vocales en las palabras", icon: "🎯" },
  { id: "X", name: "Palabras frecuentes", icon: "⭐" },
  { id: "Y", name: "Cuentos para leer", icon: "📚" },
];

// Una letra por juego y repasos, en el orden de IXL. La ñ va con la n.
const learn = (id: string, letter: string): Row =>
  letter === "n"
    ? [id, "Aprender las letras N y Ñ", (r) => K.learnLetter(r, ["n", "ñ"])]
    : [id, `Aprender la letra ${letter.toUpperCase()}`, (r) => K.learnLetter(r, [letter])];
const review = (id: string, from: string, to: string): Row => {
  const letters = K.ALPHABET.slice(K.ALPHABET.indexOf(from), K.ALPHABET.indexOf(to) + 1);
  return [id, `Repasar las letras ${from.toUpperCase()}–${to.toUpperCase()}`, (r) => K.learnLetter(r, letters)];
};

function sentencesFor(list: [string, string][]): ChoiceItem[] {
  return list.map(([pic, a]) => ({ pic, a, d: list.map(([, s]) => s).filter((s) => s !== a) }));
}

const SENT_A: [string, string][] = [["🐸", "La rana salta."], ["🦆", "El pato nada."], ["🐮", "La vaca camina."], ["🛏️", "La cama es grande."], ["🍞", "Mamá corta el pan."], ["✋", "Lavo mi mano."]];
const SENT_E: [string, string][] = [["🐟", "El pez nada."], ["🚂", "El tren pasa."], ["👶", "El bebé ríe."], ["🥛", "Bebo leche."], ["🍐", "Como una pera."], ["🐶", "El perro ladra."]];
const SENT_I: [string, string][] = [["🍍", "La piña es dulce."], ["🪑", "Me siento en la silla."], ["🐯", "El tigre ruge."], ["📖", "Leo mi libro."], ["🪺", "El nido tiene huevos."]];
const SENT_O: [string, string][] = [["🐻", "El oso duerme."], ["☀️", "Sale el sol."], ["🦜", "El loro habla."], ["🐒", "El mono salta."], ["🚗", "El coche corre."], ["🌹", "La rosa es roja."]];
const SENT_U: [string, string][] = [["🍇", "Como uvas."], ["🌙", "Sale la luna."], ["☁️", "La nube es blanca."], ["🐙", "El pulpo nada."], ["🌧️", "Cae la lluvia."]];

const VA = "casa rana papa cama taza mapa gato pato vaca sal pan mar mano";
const VE = "pera perro pez tren leche bebé";
const VI = "piña silla hilo nido tigre libro";
const VO = "oso sol ojo loro lobo foca bota rosa coche mono";
const VU = "uva luna nube gusano pulpo";
const SHORT = "sol pan mar pez uva oso luna mano pato rana lobo nido foca sopa nube";

const COUPLETS: ChoiceItem[] = [
  { t: "El gato\ncome en el ___.", a: "plato", d: ["vaso", "piso", "mar"] },
  { t: "La rana\nmira por la ___.", a: "ventana", d: ["puerta", "mesa", "calle"] },
  { t: "El ratón\nse esconde en el ___.", a: "cajón", d: ["techo", "baúl", "patio"] },
  { t: "La ballena\njuega en la ___.", a: "arena", d: ["playa", "orilla", "ola"] },
  { t: "Mi pelota\ncayó en la ___.", a: "bota", d: ["caja", "silla", "red"] },
  { t: "La mariposa\nhuele la ___.", a: "rosa", d: ["flor", "hoja", "fruta"] },
  { t: "El león\ncome ___.", a: "melón", d: ["pera", "sandía", "pan"] },
  { t: "La gallina\nestá en la ___.", a: "cocina", d: ["sala", "granja", "cama"] },
];

const SENT_SHORT: ChoiceItem[] = [
  { t: "El ___ sale de día.", a: "sol", d: ["sal", "sur"] },
  { t: "Mi ___ ladra.", a: "perro", d: ["pero", "parra"] },
  { t: "La ___ da leche.", a: "vaca", d: ["boca", "vela"] },
  { t: "El ___ nada.", a: "pez", d: ["paz", "pie"] },
  { t: "Como ___ con queso.", a: "pan", d: ["pin", "par"] },
  { t: "La ___ brilla de noche.", a: "luna", d: ["lana", "lupa"] },
  { t: "Me lavo la ___.", a: "mano", d: ["mono", "mona"] },
  { t: "El ___ dice miau.", a: "gato", d: ["pato", "gota"] },
  { t: "Duermo en mi ___.", a: "cama", d: ["casa", "capa"] },
];

const YES_NO: [string, boolean][] = [
  ["¿El pez nada?", true], ["¿La vaca vuela?", false], ["¿El sol sale de día?", true], ["¿El gato ladra?", false],
  ["¿La rana salta?", true], ["¿El pan se come?", true], ["¿La mesa corre?", false], ["¿El perro tiene patas?", true],
  ["¿La luna es un animal?", false], ["¿La sopa se toma?", true], ["¿El oso es una fruta?", false], ["¿El pato dice miau?", false],
];

const SIGHT_SENTENCES: ChoiceItem[] = [
  { t: "___ gato duerme.", a: "El", d: ["La", "Una", "Las"] },
  { t: "Tengo ___ pelota.", a: "una", d: ["un", "el", "los"] },
  { t: "___ me llamo Leo.", a: "Yo", d: ["Tu", "Mi", "Se"] },
  { t: "La casa ___ grande.", a: "es", d: ["en", "de", "se"] },
  { t: "Voy al parque ___ mamá.", a: "con", d: ["por", "que", "son"] },
  { t: "___ niños juegan.", a: "Los", d: ["El", "La", "Un"] },
  { t: "La sopa está ___ rica.", a: "muy", d: ["hay", "soy", "voy"] },
  { t: "___ es mi mochila.", a: "Esta", d: ["Este", "Aquí", "Hoy"] },
  { t: "Yo ___ cinco años.", a: "tengo", d: ["veo", "está", "dijo"] },
  { t: "El regalo es ___ ti.", a: "para", d: ["pero", "como", "era"] },
  { t: "Hoy me siento ___.", a: "bien", d: ["todo", "nada", "otro"] },
];

const SIMILAR_WORDS = [
  ["casa", "cosa", "cama", "saca"], ["pato", "pata", "palo", "tapo"], ["mesa", "misa", "masa", "meta"], ["luna", "lana", "lupa", "nula"],
  ["sol", "sal", "los", "col"], ["mano", "mono", "mona", "mago"], ["rosa", "ropa", "rota", "risa"], ["pelo", "palo", "polo", "pela"],
  ["boca", "bota", "bola", "foca"], ["dedo", "dado", "dudo", "boda"],
];
const SIMILAR_SIGHT = [
  ["el", "al", "la", "le"], ["un", "una", "uno", "en"], ["es", "se", "su", "en"], ["mi", "me", "ni", "mis"], ["con", "son", "sin", "can"],
  ["por", "para", "pero", "paro"], ["los", "las", "les", "sol"], ["muy", "hoy", "soy", "voy"], ["yo", "ya", "hay", "oye"], ["este", "esta", "esto", "ese"],
];

const SENTENCES = [
  "El gato come pan.", "La rana salta alto.", "Mi mamá lee un cuento.", "El perro corre mucho.",
  "Yo tengo una pelota.", "La luna sale de noche.", "Papá lava el carro.", "El pato nada feliz.",
];

const STORIES: Record<string, Passage[]> = {
  a: [
    { title: "La pata Sara", emoji: "🦆", text: "Sara es una pata. Sara nada en la charca. Sara va a casa. ¡Sara canta!",
      qs: [
        { q: "¿Quién es Sara?", a: "Una pata", d: ["Una rana", "Una vaca"] },
        { q: "¿Dónde nada Sara?", a: "En la charca", d: ["En la cama", "En la playa"] },
      ] },
    { title: "Mamá y Ana", emoji: "👩", text: "Ana va a la sala. Mamá ama a Ana. Mamá le da pan a Ana. Ana lava la taza.",
      qs: [
        { q: "¿Qué le da mamá a Ana?", a: "Pan", d: ["Sal", "Papa"] },
        { q: "¿Qué lava Ana?", a: "La taza", d: ["La casa", "La cama"] },
        { q: "¿A dónde va Ana?", a: "A la sala", d: ["A la cama", "A la casa"] },
      ] },
  ],
  e: [
    { title: "El nene Pepe", emoji: "👶", text: "Pepe es un nene. Pepe bebe leche. Pepe ve un pez. El pez es de Pepe.",
      qs: [
        { q: "¿Qué bebe Pepe?", a: "Leche", d: ["Sopa", "Jugo"] },
        { q: "¿Qué ve Pepe?", a: "Un pez", d: ["Un tren", "Un rey"] },
      ] },
    { title: "El tren verde", emoji: "🚂", text: "El tren es verde. El tren se mueve. Tere ve el tren. Tere se ríe.",
      qs: [
        { q: "¿De qué color es el tren?", a: "Verde", d: ["Rojo", "Negro"] },
        { q: "¿Quién ve el tren?", a: "Tere", d: ["Pepe", "Elena"] },
      ] },
  ],
  i: [
    { title: "Lili y Mimí", emoji: "🐱", text: "Lili vive aquí. Mimí es la gatita de Lili. Mimí dice miau. Lili ríe.",
      qs: [
        { q: "¿Quién es Mimí?", a: "Una gatita", d: ["Una niñita", "Una pollita"] },
        { q: "¿Qué dice Mimí?", a: "Miau", d: ["Guau", "Pío"] },
      ] },
    { title: "El kiwi", emoji: "🥝", text: "Lili pide un kiwi. Mimí mira el kiwi. Lili divide el kiwi. ¡Qué rico!",
      qs: [
        { q: "¿Qué pide Lili?", a: "Un kiwi", d: ["Un higo", "Un pan"] },
        { q: "¿Quién mira el kiwi?", a: "Mimí", d: ["Pipo", "Tití"] },
      ] },
  ],
  o: [
    { title: "El oso Bobo", emoji: "🐻", text: "Bobo es un oso. Bobo come coco. Bobo toma sol. Bobo es gordo y flojo.",
      qs: [
        { q: "¿Qué come Bobo?", a: "Coco", d: ["Pollo", "Mote"] },
        { q: "¿Cómo es Bobo?", a: "Gordo", d: ["Flaco", "Chico"] },
        { q: "¿Quién es Bobo?", a: "Un oso", d: ["Un mono", "Un lobo"] },
      ] },
    { title: "El loro Yoyo", emoji: "🦜", text: "Yoyo es un loro. Yoyo dice hola. Yoyo come choclo. Yoyo es rojo.",
      qs: [
        { q: "¿Qué dice Yoyo?", a: "Hola", d: ["Chau", "Miau"] },
        { q: "¿De qué color es Yoyo?", a: "Rojo", d: ["Azul", "Verde"] },
      ] },
  ],
  u: [
    { title: "La mula Lulú", emoji: "🫏", text: "Lulú es una mula. Lulú sube. Lulú usa un tutú. ¡Lulú es única!",
      qs: [
        { q: "¿Quién es Lulú?", a: "Una mula", d: ["Una vaca", "Una rana"] },
        { q: "¿Qué usa Lulú?", a: "Un tutú", d: ["Un gorro", "Una bota"] },
      ] },
    { title: "La luna", emoji: "🌙", text: "Tutú mira la luna. La luna da luz. Una nube tapa la luna. Tutú apaga la luz.",
      qs: [
        { q: "¿Qué mira Tutú?", a: "La luna", d: ["El sol", "La nube"] },
        { q: "¿Qué tapa la luna?", a: "Una nube", d: ["Una mula", "Una casa"] },
      ] },
  ],
  mix: [
    { title: "El gato y la pelota", emoji: "🐱", text: "El gato ve una pelota. La pelota es roja. El gato la empuja. La pelota rueda y el gato corre.",
      qs: [
        { q: "¿Qué ve el gato?", a: "Una pelota", d: ["Una paloma", "Una galleta"] },
        { q: "¿De qué color es la pelota?", a: "Roja", d: ["Azul", "Verde"] },
        { q: "¿Qué hace el gato al final?", a: "Corre", d: ["Duerme", "Come"] },
      ] },
    { title: "Paseo en el parque", emoji: "🌳", text: "Sami va al parque con su papá. Sube al tobogán. Come un helado de fresa. Regresa a casa feliz.",
      qs: [
        { q: "¿Con quién va Sami?", a: "Con su papá", d: ["Con su tía", "Con su mamá"] },
        { q: "¿Qué come Sami?", a: "Un helado", d: ["Un pastel", "Una pera"] },
        { q: "¿Cómo regresa Sami?", a: "Feliz", d: ["Triste", "Molesto"] },
      ] },
  ],
};

const sentence = (list: [string, string][]): Row[2] => (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(list));

export const ROWS: Row[] = [
  learn("A.1", "a"), learn("A.2", "b"), learn("A.3", "c"), learn("A.4", "d"), review("A.5", "a", "d"),
  learn("A.6", "e"), learn("A.7", "f"), learn("A.8", "g"), learn("A.9", "h"), review("A.10", "e", "h"), review("A.11", "a", "h"),

  learn("B.1", "i"), learn("B.2", "j"), learn("B.3", "k"), learn("B.4", "l"), review("B.5", "i", "l"),
  learn("B.6", "m"), learn("B.7", "n"), learn("B.8", "o"), learn("B.9", "p"), review("B.10", "m", "p"), review("B.11", "i", "p"),

  learn("C.1", "q"), learn("C.2", "r"), learn("C.3", "s"), learn("C.4", "t"), learn("C.5", "u"), review("C.6", "q", "u"),
  learn("C.7", "v"), learn("C.8", "w"), learn("C.9", "x"), learn("C.10", "y"), learn("C.11", "z"), review("C.12", "v", "z"), review("C.13", "q", "z"),

  ["D.1", "Encontrar la letra en el abecedario: mayúsculas", (r) => K.findLetter(r, true)],
  ["D.2", "Encontrar la letra en el abecedario: minúsculas", (r) => K.findLetter(r, false)],
  ["D.3", "Letras que se confunden: encontrar la letra", K.confusedLetter],
  ["D.4", "Letras que se confunden: encontrar todas las letras", K.confusedWords],
  ["D.5", "Repasar las letras A–Z", (r) => K.learnLetter(r, K.ALPHABET)],
  ["D.6", "Elegir la letra que escuchas", (r) => K.findLetter(r, r.chance(0.5), 4)],

  ["E.1", "Elegir la minúscula que corresponde: c, k, o, p, s, u, v, w, x, z", (r) => K.matchCase(r, "ckopsuvwxz", true)],
  ["E.2", "Elegir la minúscula que corresponde: f, i, j, l, m, t, y", (r) => K.matchCase(r, "fijlmty", true)],
  ["E.3", "Elegir la minúscula que corresponde: a, b, d, e, g, h, n, ñ, q, r", (r) => K.matchCase(r, "abdeghnñqr", true)],
  ["E.4", "Elegir la minúscula que corresponde: repaso", (r) => K.matchCase(r, K.ALPHABET.join(""), true)],
  ["E.5", "Encontrar todas las minúsculas", (r) => K.findCase(r, true)],
  ["E.6", "Elegir la mayúscula que corresponde: C, K, O, P, S, U, V, W, X, Z", (r) => K.matchCase(r, "ckopsuvwxz", false)],
  ["E.7", "Elegir la mayúscula que corresponde: F, I, J, L, M, T, Y", (r) => K.matchCase(r, "fijlmty", false)],
  ["E.8", "Elegir la mayúscula que corresponde: A, B, D, E, G, H, N, Ñ, Q, R", (r) => K.matchCase(r, "abdeghnñqr", false)],
  ["E.9", "Elegir la mayúscula que corresponde: repaso", (r) => K.matchCase(r, K.ALPHABET.join(""), false)],
  ["E.10", "Encontrar todas las mayúsculas", (r) => K.findCase(r, false)],
  ["E.11", "Ordenar las letras como en el abecedario", K.abcOrder],

  ["F.1", "Elegir las dos palabras que son iguales", (r) => K.sameWord(r, SIMILAR_WORDS)],
  ["F.2", "Elegir la oración que tiene bien los espacios", (r) => K.spacing(r, SENTENCES)],
  ["F.3", "Encontrar una palabra en una oración", (r) => K.findWord(r, SENTENCES)],

  ["G.1", "Clasificar vocales y consonantes", P.sortLetters],
  ["G.2", "Encontrar la vocal en la palabra", P.vowelsInWord],

  ["H.1", "¿Qué palabra termina igual?", K.sameEnding],
  ["H.2", "¿Qué dos palabras terminan igual?", K.twoSameEnding],
  ["H.3", "Elegir el dibujo que rima con la palabra", K.rhymePicture],
  ["H.4", "Formar un grupo de palabras que riman", P.rhymeSet],
  ["H.5", "¿Qué palabra no rima?", P.notRhyme],
  ["H.6", "Completar la rima", (r) => choose(r, "Completa la rima.", COUPLETS)],

  ["I.1", "Unir dos partes para formar una palabra compuesta", K.joinCompound],
  ["I.2", "Unir sílabas para formar una palabra", (r) => P.joinSyllables(r, false)],
  ["I.3", "¿Cuántas sílabas tiene la palabra?", K.clapSyllables],
  ["I.4", "¿Qué palabra tiene más sílabas?", K.moreSyllables],
  ["I.5", "Clasificar por número de sílabas", P.sortBySyllables],
  ["I.6", "Cambiar o quitar una parte de una palabra compuesta", K.changeCompound],

  ["J.1", "Unir el primer sonido con el resto para formar una palabra", K.onsetRime],
  ["J.2", "Unir cada sonido de una palabra", P.blendSounds],
  ["J.3", "Identificar el primer, el segundo y el último sonido de una palabra", P.identifySound],
  ["J.4", "Ordenar los sonidos", (r) => {
    const q = P.orderSounds(r);
    // Que las fichas no salgan ya en orden.
    return q.kind === "sequence" && q.tiles.every((t, i) => t === q.answer[i]) ? { ...q, tiles: [...q.tiles.slice(1), q.tiles[0]] } : q;
  }],

  ["K.1", "Cambiar el primer sonido de una palabra", (r) => P.changeSound(r, P.FIRST_SOUND_PAIRS, "el primer sonido")],
  ["K.2", "Cambiar el último sonido de una palabra", (r) => P.changeSound(r, P.LAST_SOUND_PAIRS, "el último sonido")],
  ["K.3", "Cambiar la vocal de una palabra", (r) => P.changeSound(r, P.VOWEL_PAIRS, "la vocal")],
  ["K.4", "Cambiar un sonido de una palabra: repaso", (r) =>
    mix(r, [
      (q) => P.changeSound(q, P.FIRST_SOUND_PAIRS, "el primer sonido"),
      (q) => P.changeSound(q, P.LAST_SOUND_PAIRS, "el último sonido"),
      (q) => P.changeSound(q, P.VOWEL_PAIRS, "la vocal"),
    ])],

  ["L.1", "¿Qué dos palabras empiezan con el mismo sonido?", P.sameStart],
  ["L.2", "¿Qué palabra termina con el mismo sonido?", K.sameEndWord],
  ["L.3", "¿Qué dos palabras terminan con el mismo sonido?", P.sameEnd],

  ["M.1", "Encontrar las palabras que empiezan con un sonido", K.wordsStartingWith],
  ["M.2", "Elegir la letra que corresponde al sonido: b, d, j, p, t", (r) => K.heardConsonant(r, ["b", "d", "j", "p", "t"])],
  ["M.3", "Elegir la letra que corresponde al sonido: f, l, m, n, r, s", (r) => K.heardConsonant(r, ["f", "l", "m", "n", "r", "s"])],
  ["M.4", "Elegir la letra que corresponde al sonido: c, g, ñ, ch", (r) => K.heardConsonant(r, ["c", "g", "ñ", "ch"])],
  ["M.5", "Elegir la letra que corresponde al sonido: repaso", (r) => K.heardConsonant(r, ["b", "d", "j", "p", "t", "f", "l", "m", "n", "r", "s", "c", "g", "ñ", "ch"])],
  ["M.6", "¿Con qué letra empieza la palabra?", (r) => P.letterAt(r, "first")],
  ["M.7", "¿Con qué letra termina la palabra?", (r) => P.letterAt(r, "last")],

  ["N.1", "Encontrar la palabra con a", (r) => K.findVowelWord(r, "a")],
  ["N.2", "Encontrar la palabra con e", (r) => K.findVowelWord(r, "e")],
  ["N.3", "Encontrar la palabra con i", (r) => K.findVowelWord(r, "i")],
  ["N.4", "Encontrar la palabra con o", (r) => K.findVowelWord(r, "o")],
  ["N.5", "Encontrar la palabra con u", (r) => K.findVowelWord(r, "u")],
  ["N.6", "Identificar la vocal que suena en una palabra", (r) => P.identifyVowel(r, "casa rana papa cama sal pan mar pez tren leche bebé kiwi oso sol ojo loro lobo mono")],

  ["O.1", "Elegir la palabra con a que corresponde al dibujo", (r) => P.wordForPicture(r, VA)],
  ["O.2", "Leer palabras con ma y pa", (r) => P.wordForPicture(r, "mapa papa mano pato pan mar cama")],
  ["O.3", "Completar la palabra con a", (r) => P.completeSyllable(r, VA)],
  ["O.4", "Elegir la oración con a que corresponde al dibujo", sentence(SENT_A)],

  ["P.1", "Elegir el dibujo de la palabra con e", (r) => P.pictureForWord(r, VE)],
  ["P.2", "Completar la palabra con e", (r) => P.completeSyllable(r, VE)],
  ["P.3", "Elegir la oración con e que corresponde al dibujo", sentence(SENT_E)],

  ["Q.1", "Elegir la palabra con i que corresponde al dibujo", (r) => P.wordForPicture(r, VI)],
  ["Q.2", "Completar palabras con i", (r) => P.completeSyllable(r, VI)],
  ["Q.3", "Elegir la oración con i que corresponde al dibujo", sentence(SENT_I)],

  ["R.1", "Elegir la palabra con o que corresponde al dibujo", (r) => P.wordForPicture(r, VO)],
  ["R.2", "Completar la palabra con o", (r) => P.completeSyllable(r, VO)],
  ["R.3", "Elegir la oración con o que corresponde al dibujo", sentence(SENT_O)],

  ["S.1", "Elegir el dibujo de la palabra con u", (r) => P.pictureForWord(r, VU)],
  ["S.2", "Completar la palabra con u", (r) => P.completeSyllable(r, VU)],
  ["S.3", "Elegir la oración con u que corresponde al dibujo", sentence(SENT_U)],

  ["T.1", "Completar la palabra con la vocal correcta", (r) => P.completeVowel(r, SHORT)],
  ["T.2", "Cambiar una letra para formar otra palabra", (r) => P.changeOneLetter(r, P.ONE_LETTER_PAIRS)],
  ["T.3", "Leer palabras cortas", (r) => P.wordForPicture(r, SHORT)],
  ["T.4", "Escribir la palabra corta", (r) => P.spellWord(r, "sol pan mar pez uva oso luna mano pato rana")],
  ["T.5", "Completar la oración con la palabra correcta", (r) => choose(r, "Completa la oración.", SENT_SHORT)],
  ["T.6", "Leer preguntas con palabras cortas", (r) => {
    const [q, yes] = r.pick(YES_NO);
    return { kind: "choice", prompt: "Lee la pregunta y responde.", visual: { kind: "text", text: q }, options: ["Sí", "No"], answer: yes ? "Sí" : "No", explanation: yes ? "La respuesta es sí." : "La respuesta es no." };
  }],

  ["U.1", "Elegir el dígrafo correcto", (r) => P.completePart(r, P.DIGRAPH_START, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],
  ["U.2", "Leer palabras con ch", (r) => P.wordForPicture(r, "coche leche cuchara chocolate brocha mochila")],
  ["U.3", "Leer palabras con ll", (r) => P.wordForPicture(r, "llave lluvia llama pollo silla caballo gallina galleta")],
  ["U.4", "Leer palabras con rr", (r) => P.wordForPicture(r, "perro zorro gorro guitarra arroz")],
  ["U.5", "Leer palabras con qu", (r) => P.wordForPicture(r, "queso paquete raqueta mosquito bosque")],
  ["U.6", "Leer la palabra con dígrafo: ch, ll, rr", (r) => P.wordForPicture(r, "coche leche llave pollo silla perro gorro zorro llama cuchara")],
  ["U.7", "Leer palabras con ñ", (r) => P.wordForPicture(r, "piña araña montaña")],
  ["U.8", "Elegir la palabra que corresponde al dibujo: rr, ll, ch, ñ, qu", (r) => P.pictureForWord(r, "perro gorro pollo silla coche leche piña araña queso bosque")],
  ["U.9", "Escribir la palabra con dígrafo", (r) => P.spellWord(r, "coche leche llave pollo silla perro gorro zorro", "ch ll rr a e i o u")],

  ["V.1", "¿Con qué trabada empieza la palabra?", (r) => K.whichBlend(r, "start")],
  ["V.2", "¿La palabra empieza con una trabada?", (r) => P.hasBlend(r, "start")],
  ["V.3", "Completar la palabra con la trabada inicial correcta", (r) => P.completeBlend(r, "start")],
  ["V.4", "¿Qué trabada tiene la palabra en medio?", (r) => K.whichBlend(r, "middle")],
  ["V.5", "¿La palabra tiene una trabada en medio?", (r) => P.hasBlend(r, "middle")],
  ["V.6", "Completar la palabra con la trabada de en medio", (r) => P.completeBlend(r, "middle")],

  ["W.1", "Encontrar la palabra con la misma vocal", P.sameVowelWord],
  ["W.2", "¿Qué dos palabras tienen la misma vocal?", P.twoSameVowel],
  ["W.3", "Encontrar la palabra que empieza con a", (r) => K.startsWithVowel(r, "a")],
  ["W.4", "Encontrar la palabra que empieza con e", (r) => K.startsWithVowel(r, "e")],
  ["W.5", "Encontrar la palabra que empieza con i", (r) => K.startsWithVowel(r, "i")],
  ["W.6", "Encontrar la palabra que empieza con o", (r) => K.startsWithVowel(r, "o")],
  ["W.7", "Encontrar la palabra que empieza con u", (r) => K.startsWithVowel(r, "u")],
  ["W.8", "Clasificar palabras según su vocal", P.sortByVowel],

  ["X.1", "Elegir las dos palabras frecuentes que son iguales", (r) => K.sameWord(r, SIMILAR_SIGHT)],
  ["X.2", "Leer palabras frecuentes, grupo 1: el, la, un, una, en", (r) => K.readSight(r, [1])],
  ["X.3", "Leer palabras frecuentes, grupo 2: yo, mi, tu, es, de", (r) => K.readSight(r, [2])],
  ["X.4", "Leer palabras frecuentes, grupo 3: no, sí, con, se, que", (r) => K.readSight(r, [3])],
  ["X.5", "Leer palabras frecuentes: repaso de los grupos 1, 2 y 3", (r) => K.readSight(r, [1, 2, 3])],
  ["X.6", "Leer palabras frecuentes, grupo 4: los, las, por, me, lo", (r) => K.readSight(r, [4])],
  ["X.7", "Leer palabras frecuentes, grupo 5: más, muy, hay, soy, voy", (r) => K.readSight(r, [5])],
  ["X.8", "Leer palabras frecuentes, grupo 6: ella, su, al, del, son", (r) => K.readSight(r, [6])],
  ["X.9", "Leer palabras frecuentes: repaso de los grupos 4, 5 y 6", (r) => K.readSight(r, [4, 5, 6])],
  ["X.10", "Leer palabras frecuentes, grupo 7: este, esta, aquí, hoy, ya", (r) => K.readSight(r, [7])],
  ["X.11", "Leer palabras frecuentes, grupo 8: bien, mal, todo, nada, otro", (r) => K.readSight(r, [8])],
  ["X.12", "Leer palabras frecuentes, grupo 9: para, pero, como, fue, era", (r) => K.readSight(r, [9])],
  ["X.13", "Leer palabras frecuentes, grupo 10: tengo, quiero, veo, está, dijo", (r) => K.readSight(r, [10])],
  ["X.14", "Leer palabras frecuentes: repaso de los grupos 7, 8, 9 y 10", (r) => K.readSight(r, [7, 8, 9, 10])],
  ["X.15", "Leer palabras frecuentes: repaso de los grupos 1 al 10", (r) => K.readSight(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])],
  ["X.16", "Completar la oración con la palabra frecuente correcta", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
  ["X.17", "Escribir la palabra frecuente", K.spellSight],

  ["Y.1", "Leer cuentos con a", (r) => readPassage(r, STORIES.a, false)],
  ["Y.2", "Leer cuentos con e", (r) => readPassage(r, STORIES.e, false)],
  ["Y.3", "Leer cuentos con i", (r) => readPassage(r, STORIES.i, false)],
  ["Y.4", "Leer cuentos con o", (r) => readPassage(r, STORIES.o, false)],
  ["Y.5", "Leer cuentos con u", (r) => readPassage(r, STORIES.u, false)],
  ["Y.6", "Leer cuentos con todas las vocales", (r) => readPassage(r, STORIES.mix, false)],
];
