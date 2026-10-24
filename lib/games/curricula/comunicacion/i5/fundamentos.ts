import * as K from "../../../generators/lengua/kinder";
import * as P from "../../../generators/lengua/phonics";
import { choose, mix, readPassage, type ChoiceItem, type Passage } from "../../../generators/lengua/bank";
import type { Row } from "./row";

// Inicial 5 años · banco de lectoescritura inicial: conciencia fonológica
// (rimas, sílabas, sonido inicial y final, cambiar sonidos), el abecedario con
// la ñ, mayúsculas y minúsculas, vocales y consonantes, primeras palabras con
// cada vocal, dígrafos (ch, ll, rr, qu, ñ), trabadas, palabras frecuentes del
// castellano en grupos de 5 y cuentos cortos para leer. En las sílabas no se
// mezclan letras que suenan igual (b/v, c/k/q, s/z, ll/y).


// Una letra por generador y repasos de varias letras. La ñ va con la n.
const learn = (key: string, letter: string): Row => [key, (r) => K.learnLetter(r, letter === "n" ? ["n", "ñ"] : [letter])];
const review = (key: string, from: string, to: string): Row => {
  const letters = K.ALPHABET.slice(K.ALPHABET.indexOf(from), K.ALPHABET.indexOf(to) + 1);
  return [key, (r) => K.learnLetter(r, letters)];
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

const sentence = (list: [string, string][]): Row[1] => (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(list));

export const ROWS: Row[] = [
  learn("letras-a-h-1", "a"), learn("letras-a-h-2", "b"), learn("letras-a-h-3", "c"), learn("letras-a-h-4", "d"), review("letras-a-h-5", "a", "d"),
  learn("letras-a-h-6", "e"), learn("letras-a-h-7", "f"), learn("letras-a-h-8", "g"), learn("letras-a-h-9", "h"), review("letras-a-h-10", "e", "h"), review("letras-a-h-11", "a", "h"),

  learn("letras-i-p-1", "i"), learn("letras-i-p-2", "j"), learn("letras-i-p-3", "k"), learn("letras-i-p-4", "l"), review("letras-i-p-5", "i", "l"),
  learn("letras-i-p-6", "m"), learn("letras-i-p-7", "n"), learn("letras-i-p-8", "o"), learn("letras-i-p-9", "p"), review("letras-i-p-10", "m", "p"), review("letras-i-p-11", "i", "p"),

  learn("letras-q-z-1", "q"), learn("letras-q-z-2", "r"), learn("letras-q-z-3", "s"), learn("letras-q-z-4", "t"), learn("letras-q-z-5", "u"), review("letras-q-z-6", "q", "u"),
  learn("letras-q-z-7", "v"), learn("letras-q-z-8", "w"), learn("letras-q-z-9", "x"), learn("letras-q-z-10", "y"), learn("letras-q-z-11", "z"), review("letras-q-z-12", "v", "z"), review("letras-q-z-13", "q", "z"),

  ["buscar-letra-1", (r) => K.findLetter(r, true)],
  ["buscar-letra-2", (r) => K.findLetter(r, false)],
  ["buscar-letra-3", K.confusedLetter],
  ["buscar-letra-4", K.confusedWords],
  ["buscar-letra-5", (r) => K.learnLetter(r, K.ALPHABET)],
  ["buscar-letra-6", (r) => K.findLetter(r, r.chance(0.5), 4)],

  ["mayusculas-minusculas-1", (r) => K.matchCase(r, "ckopsuvwxz", true)],
  ["mayusculas-minusculas-2", (r) => K.matchCase(r, "fijlmty", true)],
  ["mayusculas-minusculas-3", (r) => K.matchCase(r, "abdeghnñqr", true)],
  ["mayusculas-minusculas-4", (r) => K.matchCase(r, K.ALPHABET.join(""), true)],
  ["mayusculas-minusculas-5", (r) => K.findCase(r, true)],
  ["mayusculas-minusculas-6", (r) => K.matchCase(r, "ckopsuvwxz", false)],
  ["mayusculas-minusculas-7", (r) => K.matchCase(r, "fijlmty", false)],
  ["mayusculas-minusculas-8", (r) => K.matchCase(r, "abdeghnñqr", false)],
  ["mayusculas-minusculas-9", (r) => K.matchCase(r, K.ALPHABET.join(""), false)],
  ["mayusculas-minusculas-10", (r) => K.findCase(r, false)],
  ["abecedario", K.abcOrder],

  ["palabras-iguales-1", (r) => K.sameWord(r, SIMILAR_WORDS)],
  ["palabras-iguales-2", (r) => K.spacing(r, SENTENCES)],
  ["palabras-iguales-3", (r) => K.findWord(r, SENTENCES)],

  ["vocal-consonante-1", P.sortLetters],
  ["vocal-consonante-2", P.vowelsInWord],

  ["rimas-1", K.sameEnding],
  ["rimas-2", K.twoSameEnding],
  ["rimas-3", K.rhymePicture],
  ["completar-rima-1", P.rhymeSet],
  ["rimas-4", P.notRhyme],
  ["completar-rima-2", (r) => choose(r, "Completa la rima.", COUPLETS)],

  ["unir-silabas-1", K.joinCompound],
  ["unir-silabas-2", (r) => P.joinSyllables(r, false)],
  ["silabas-1", K.clapSyllables],
  ["silabas-2", K.moreSyllables],
  ["silabas-3", P.sortBySyllables],
  ["unir-silabas-3", K.changeCompound],

  ["unir-sonidos-1", K.onsetRime],
  ["unir-sonidos-2", P.blendSounds],
  ["primer-sonido-4", P.identifySound],
  ["unir-sonidos-3", (r) => {
    const q = P.orderSounds(r);
    // Que las fichas no salgan ya en orden.
    return q.kind === "sequence" && q.tiles.every((t, i) => t === q.answer[i]) ? { ...q, tiles: [...q.tiles.slice(1), q.tiles[0]] } : q;
  }],

  ["cambiar-sonidos-1", (r) => P.changeSound(r, P.FIRST_SOUND_PAIRS, "el primer sonido")],
  ["cambiar-sonidos-2", (r) => P.changeSound(r, P.LAST_SOUND_PAIRS, "el último sonido")],
  ["cambiar-sonidos-3", (r) => P.changeSound(r, P.VOWEL_PAIRS, "la vocal")],
  ["cambiar-sonidos-4", (r) =>
    mix(r, [
      (q) => P.changeSound(q, P.FIRST_SOUND_PAIRS, "el primer sonido"),
      (q) => P.changeSound(q, P.LAST_SOUND_PAIRS, "el último sonido"),
      (q) => P.changeSound(q, P.VOWEL_PAIRS, "la vocal"),
    ])],

  ["primer-sonido-1", P.sameStart],
  ["primer-sonido-2", K.sameEndWord],
  ["primer-sonido-3", P.sameEnd],

  ["letra-sonido-1", K.wordsStartingWith],
  ["letra-sonido-2", (r) => K.heardConsonant(r, ["b", "d", "j", "p", "t"])],
  ["letra-sonido-3", (r) => K.heardConsonant(r, ["f", "l", "m", "n", "r", "s"])],
  ["letra-sonido-4", (r) => K.heardConsonant(r, ["c", "g", "ñ", "ch"])],
  ["letra-sonido-5", (r) => K.heardConsonant(r, ["b", "d", "j", "p", "t", "f", "l", "m", "n", "r", "s", "c", "g", "ñ", "ch"])],
  ["letra-sonido-6", (r) => P.letterAt(r, "first")],
  ["letra-sonido-7", (r) => P.letterAt(r, "last")],

  ["encontrar-vocal-1", (r) => K.findVowelWord(r, "a")],
  ["encontrar-vocal-2", (r) => K.findVowelWord(r, "e")],
  ["encontrar-vocal-3", (r) => K.findVowelWord(r, "i")],
  ["encontrar-vocal-4", (r) => K.findVowelWord(r, "o")],
  ["encontrar-vocal-5", (r) => K.findVowelWord(r, "u")],
  ["encontrar-vocal-6", (r) => P.identifyVowel(r, "casa rana papa cama sal pan mar pez tren leche bebé kiwi oso sol ojo loro lobo mono")],

  ["palabras-a-1", (r) => P.wordForPicture(r, VA)],
  ["palabras-a-2", (r) => P.wordForPicture(r, "mapa papa mano pato pan mar cama")],
  ["palabras-a-3", (r) => P.completeSyllable(r, VA)],
  ["palabras-a-4", sentence(SENT_A)],

  ["palabras-e-1", (r) => P.pictureForWord(r, VE)],
  ["palabras-e-2", (r) => P.completeSyllable(r, VE)],
  ["palabras-e-3", sentence(SENT_E)],

  ["palabras-i-1", (r) => P.wordForPicture(r, VI)],
  ["palabras-i-2", (r) => P.completeSyllable(r, VI)],
  ["palabras-i-3", sentence(SENT_I)],

  ["palabras-o-1", (r) => P.wordForPicture(r, VO)],
  ["palabras-o-2", (r) => P.completeSyllable(r, VO)],
  ["palabras-o-3", sentence(SENT_O)],

  ["palabras-u-1", (r) => P.pictureForWord(r, VU)],
  ["palabras-u-2", (r) => P.completeSyllable(r, VU)],
  ["palabras-u-3", sentence(SENT_U)],

  ["palabras-cortas-1", (r) => P.completeVowel(r, SHORT)],
  ["palabras-cortas-2", (r) => P.changeOneLetter(r, P.ONE_LETTER_PAIRS)],
  ["palabras-cortas-3", (r) => P.wordForPicture(r, SHORT)],
  ["palabras-cortas-4", (r) => P.spellWord(r, "sol pan mar pez uva oso luna mano pato rana")],
  ["palabras-cortas-5", (r) => choose(r, "Completa la oración.", SENT_SHORT)],
  ["palabras-cortas-6", (r) => {
    const [q, yes] = r.pick(YES_NO);
    return { kind: "choice", prompt: "Lee la pregunta y responde.", visual: { kind: "text", text: q }, options: ["Sí", "No"], answer: yes ? "Sí" : "No", explanation: yes ? "La respuesta es sí." : "La respuesta es no." };
  }],

  ["digrafos-1", (r) => P.completePart(r, P.DIGRAPH_START, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],
  ["digrafos-2", (r) => P.wordForPicture(r, "coche leche cuchara chocolate brocha mochila")],
  ["digrafos-3", (r) => P.wordForPicture(r, "llave lluvia llama pollo silla caballo gallina galleta")],
  ["digrafos-4", (r) => P.wordForPicture(r, "perro zorro gorro guitarra arroz")],
  ["digrafos-5", (r) => P.wordForPicture(r, "queso paquete raqueta mosquito bosque")],
  ["digrafos-6", (r) => P.wordForPicture(r, "coche leche llave pollo silla perro gorro zorro llama cuchara")],
  ["digrafos-7", (r) => P.wordForPicture(r, "piña araña montaña")],
  ["digrafos-8", (r) => P.pictureForWord(r, "perro gorro pollo silla coche leche piña araña queso bosque")],
  ["digrafos-9", (r) => P.spellWord(r, "coche leche llave pollo silla perro gorro zorro", "ch ll rr a e i o u")],

  ["trabadas-1", (r) => K.whichBlend(r, "start")],
  ["trabadas-2", (r) => P.hasBlend(r, "start")],
  ["trabadas-3", (r) => P.completeBlend(r, "start")],
  ["trabadas-4", (r) => K.whichBlend(r, "middle")],
  ["trabadas-5", (r) => P.hasBlend(r, "middle")],
  ["trabadas-6", (r) => P.completeBlend(r, "middle")],

  ["misma-vocal-1", P.sameVowelWord],
  ["misma-vocal-2", P.twoSameVowel],
  ["vocal-inicial-1", (r) => K.startsWithVowel(r, "a")],
  ["vocal-inicial-2", (r) => K.startsWithVowel(r, "e")],
  ["vocal-inicial-3", (r) => K.startsWithVowel(r, "i")],
  ["vocal-inicial-4", (r) => K.startsWithVowel(r, "o")],
  ["vocal-inicial-5", (r) => K.startsWithVowel(r, "u")],
  ["misma-vocal-3", P.sortByVowel],

  ["frecuentes-1-1", (r) => K.sameWord(r, SIMILAR_SIGHT)],
  ["frecuentes-1-2", (r) => K.readSight(r, [1])],
  ["frecuentes-1-3", (r) => K.readSight(r, [2])],
  ["frecuentes-1-4", (r) => K.readSight(r, [3])],
  ["frecuentes-1-5", (r) => K.readSight(r, [1, 2, 3])],
  ["frecuentes-1-6", (r) => K.readSight(r, [4])],
  ["frecuentes-1-7", (r) => K.readSight(r, [5])],
  ["frecuentes-2-1", (r) => K.readSight(r, [6])],
  ["frecuentes-2-2", (r) => K.readSight(r, [4, 5, 6])],
  ["frecuentes-2-3", (r) => K.readSight(r, [7])],
  ["frecuentes-2-4", (r) => K.readSight(r, [8])],
  ["frecuentes-2-5", (r) => K.readSight(r, [9])],
  ["frecuentes-2-6", (r) => K.readSight(r, [10])],
  ["frecuentes-2-7", (r) => K.readSight(r, [7, 8, 9, 10])],
  ["frecuentes-2-8", (r) => K.readSight(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])],
  ["frecuentes-oracion-1", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
  ["frecuentes-oracion-2", K.spellSight],

  ["cuentos-vocales-1", (r) => readPassage(r, STORIES.a, false)],
  ["cuentos-vocales-2", (r) => readPassage(r, STORIES.e, false)],
  ["cuentos-vocales-3", (r) => readPassage(r, STORIES.i, false)],
  ["cuentos-vocales-4", (r) => readPassage(r, STORIES.o, false)],
  ["cuentos-vocales-5", (r) => readPassage(r, STORIES.u, false)],
  ["cuentos-vocales-6", (r) => readPassage(r, STORIES.mix, false)],
];
