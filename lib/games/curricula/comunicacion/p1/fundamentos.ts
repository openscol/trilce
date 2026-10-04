import * as P from "../../../generators/lengua/phonics";
import { choose, mix, readPassage, type ChoiceItem, type Passage } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { word } from "../../../generators/lengua/words";
import type { Row } from "./row";

// Fundamentos de lectura (IXL 1st grade ELA, A-X), adaptados al castellano:
// las secciones de fonética inglesa (short/long vowels, silent e, vowel
// teams...) pasan a su equivalente en la enseñanza de la lectoescritura en
// castellano (sílabas por vocal, h muda, diptongos, patrones ortográficos...).

export const SECTIONS: Section[] = [
  { id: "A", name: "Vocales y consonantes", icon: "🔤" },
  { id: "B", name: "Rima", icon: "🎵" },
  { id: "C", name: "Sílabas", icon: "👏" },
  { id: "D", name: "Unir y separar sonidos", icon: "🧩" },
  { id: "E", name: "Cambiar sonidos", icon: "🔄" },
  { id: "F", name: "Sonidos y letras", icon: "🔡" },
  { id: "G", name: "Dígrafos: ch, ll, rr, qu", icon: "🔗" },
  { id: "H", name: "Palabras con a", icon: "🅰️" },
  { id: "I", name: "Palabras con e", icon: "📗" },
  { id: "J", name: "Palabras con i", icon: "📘" },
  { id: "K", name: "Palabras con o", icon: "📙" },
  { id: "L", name: "Palabras con u", icon: "📕" },
  { id: "M", name: "Vocales: repaso", icon: "🔠" },
  { id: "N", name: "Dígrafos y trabadas", icon: "🧱" },
  { id: "O", name: "Palabras con la misma vocal", icon: "🎯" },
  { id: "P", name: "La h muda", icon: "🤫" },
  { id: "Q", name: "Diptongos", icon: "👯" },
  { id: "R", name: "Patrones ortográficos", icon: "✍️" },
  { id: "S", name: "Letras que se confunden", icon: "🔍" },
  { id: "T", name: "La r: suave y fuerte", icon: "🐯" },
  { id: "U", name: "Palabras con y", icon: "🪀" },
  { id: "V", name: "Palabras de dos sílabas", icon: "✌️" },
  { id: "W", name: "Palabras frecuentes", icon: "⭐" },
  { id: "X", name: "Cuentos para leer", icon: "📚" },
];

// Oración que corresponde a un dibujo; los distractores son las demás
// oraciones del mismo banco.
function sentencesFor(list: [string, string][]): ChoiceItem[] {
  return list.map(([pic, a]) => ({ pic, a, d: list.map(([, s]) => s).filter((s) => s !== a) }));
}

const SENT_A: [string, string][] = [
  ["🐸", "La rana salta."], ["🗺️", "Ana mira el mapa."], ["☕", "La taza tiene agua."], ["🛏️", "Papá está en la cama."],
  ["🦆", "El pato nada."], ["🐱", "Mi gato salta."], ["🦙", "La llama camina."],
];
const SENT_E1: [string, string][] = [
  ["🐶", "El perro bebe agua."], ["🐟", "El pez nada en el mar."], ["🚂", "El tren es veloz."], ["🍐", "Elena come una pera."],
];
const SENT_E2: [string, string][] = [
  ["👶", "El bebé duerme."], ["🥛", "Bebo leche fresca."], ["🍦", "Es un helado de fresa."], ["🦓", "La cebra es blanca y negra."],
  ["⌚", "El reloj marca la hora."],
];
const SENT_I: [string, string][] = [
  ["🍍", "Mi tía corta la piña."], ["🐯", "El tigre ruge fuerte."], ["📖", "Leo un libro."], ["🦒", "La jirafa es muy alta."],
  ["🪺", "El nido tiene huevos."], ["✂️", "Corto el papel con la tijera."], ["🐧", "El pingüino vive en el frío."],
];
const SENT_O: [string, string][] = [
  ["🐻", "El oso come miel."], ["☀️", "El sol sale de día."], ["🦜", "El loro habla."], ["🌹", "La rosa es roja."],
  ["🚗", "Mamá maneja el coche."], ["🐒", "El mono come plátano."], ["🦊", "El zorro corre."],
];
const SENT_U: [string, string][] = [
  ["🍇", "Lucas come uvas."], ["🌙", "La luna sale de noche."], ["☁️", "La nube es blanca."], ["🐛", "El gusano es pequeño."],
  ["🐙", "El pulpo tiene ocho brazos."], ["🌧️", "Cae mucha lluvia."], ["🦉", "El búho vuela de noche."],
];
const SENT_H: [string, string][] = [
  ["🍦", "Hugo come un helado."], ["🥚", "La gallina puso un huevo."], ["🍃", "Cae una hoja del árbol."], ["🐜", "La hormiga es pequeña."],
  ["🧚", "El hada tiene alas."], ["🧊", "El hielo está muy frío."], ["🦴", "El perro tiene un hueso."], ["🧵", "Mamá cose con hilo."],
];
const SENT_DIPH: [string, string][] = [
  ["🎹", "Julia toca el piano."], ["💧", "Bebo agua fresca."], ["🚪", "Abre la puerta, por favor."], ["❄️", "Cae nieve en la montaña."],
  ["🔥", "El fuego da calor."], ["👸", "La reina tiene una corona."], ["🧤", "Me pongo un guante."], ["📓", "Escribo en mi cuaderno."],
];

const COUPLETS: ChoiceItem[] = [
  { t: "La luna sale de noche,\nla veo desde el ___.", a: "coche", d: ["carro", "auto", "tren"] },
  { t: "Salta y salta la rana,\nsale por la ___.", a: "ventana", d: ["puerta", "casa", "calle"] },
  { t: "Vuela, vuela, mariposa,\nse posa en la ___.", a: "rosa", d: ["flor", "hoja", "mesa"] },
  { t: "Mi pelota de colores\nrueda entre las ___.", a: "flores", d: ["plantas", "piedras", "hojas"] },
  { t: "El sol brilla en el cielo\ny se derrite el ___.", a: "hielo", d: ["helado", "agua", "queso"] },
  { t: "En el mar nada un pez,\nlo veo una y otra ___.", a: "vez", d: ["día", "hora", "tarde"] },
  { t: "Mi perrito juguetón\nduerme en su ___.", a: "colchón", d: ["cama", "casa", "silla"] },
  { t: "La abeja vuela feliz\ny se posa en mi ___.", a: "nariz", d: ["mano", "cabeza", "pie"] },
  { t: "Un ratón muy pequeñito\ncome queso ___.", a: "despacito", d: ["rápido", "mucho", "blanco"] },
];

const POEMS: ChoiceItem[] = [
  { t: "Tengo un gato\nque come en un plato.\nSi le doy pescado,\nqueda ___.", a: "encantado", d: ["contento", "feliz", "alegre"] },
  { t: "Mi amiga la ballena\nnada sin pena.\nCanta en el mar\ny me invita a ___.", a: "nadar", d: ["comer", "dormir", "reír"] },
  { t: "En el árbol hay un nido,\nun pajarito ha nacido.\nAbre el pico sin parar,\nquiere aprender a ___.", a: "volar", d: ["correr", "subir", "dormir"] },
  { t: "La gallina Josefina\npasea por la cocina.\nPone un huevo cada día\ny lo cuida con ___.", a: "alegría", d: ["cuidado", "amor", "calma"] },
  { t: "Cuando llueve en mi ciudad\nme pongo botas de verdad.\nSalto en los charcos sin parar\ny me vuelvo a ___.", a: "mojar", d: ["caer", "reír", "dormir"] },
  { t: "Mi tambor hace pom, pom,\ncon mi amigo Ramón.\nTocamos en la mañana\ny también en la ___.", a: "semana", d: ["tarde", "noche", "fiesta"] },
];

const SENT_SHORT: ChoiceItem[] = [
  { t: "El ___ brilla en el cielo.", a: "sol", d: ["sal", "sil"] },
  { t: "Mi ___ ladra mucho.", a: "perro", d: ["pero", "parro"] },
  { t: "La ___ salta en el charco.", a: "rana", d: ["rena", "runa"] },
  { t: "El ___ nada en la pecera.", a: "pez", d: ["paz", "piz"] },
  { t: "Me pongo la ___ porque llueve.", a: "bota", d: ["bote", "buta"] },
  { t: "Mi mamá corta el ___.", a: "pan", d: ["pon", "pin"] },
  { t: "La ___ sale de noche.", a: "luna", d: ["lana", "lona"] },
  { t: "Tengo cinco dedos en la ___.", a: "mano", d: ["mono", "mana"] },
  { t: "El ___ come plátanos.", a: "mono", d: ["mano", "mena"] },
];

const Y_SENTENCES: ChoiceItem[] = [
  { t: "El r__ tiene una corona.", a: "ey", d: ["ay", "oy", "uy"] },
  { t: "H__ es mi cumpleaños.", a: "oy", d: ["ay", "ey", "uy"] },
  { t: "H__ un gato en el techo.", a: "ay", d: ["oy", "ey", "uy"] },
  { t: "Estoy m__ contento.", a: "uy", d: ["ay", "ey", "oy"] },
  { t: "Yo s__ tu amigo.", a: "oy", d: ["ay", "ey", "uy"] },
  { t: "Mañana v__ a la playa.", a: "oy", d: ["ay", "ey", "uy"] },
  { t: "La l__ dice que debemos cruzar con cuidado.", a: "ey", d: ["ay", "oy", "uy"] },
];

const TWO_SYL_SENTENCES: ChoiceItem[] = [
  { t: "Mi ___ toma leche.", a: "gato", d: ["mesa", "sopa", "nube"] },
  { t: "Me pongo el ___ en la cabeza.", a: "gorro", d: ["perro", "plato", "queso"] },
  { t: "El ___ tiene muchas páginas.", a: "libro", d: ["lobo", "globo", "coche"] },
  { t: "En el cielo hay una ___ blanca.", a: "nube", d: ["mesa", "rana", "sopa"] },
  { t: "El ___ navega por el mar.", a: "barco", d: ["burro", "tigre", "queso"] },
  { t: "Tomo ___ caliente con cuchara.", a: "sopa", d: ["silla", "playa", "piña"] },
  { t: "El ___ ladra en el patio.", a: "perro", d: ["pera", "pato", "loro"] },
];

const SIGHT_A: ChoiceItem[] = [
  { t: "___ perro corre en el parque.", a: "El", d: ["Los", "Una", "Las"] },
  { t: "Tengo ___ gato y un perro.", a: "un", d: ["una", "los", "la"] },
  { t: "Ana ___ Pepe juegan.", a: "y", d: ["en", "de", "la"] },
  { t: "El libro está ___ la mesa.", a: "en", d: ["y", "la", "un"] },
  { t: "La casa ___ mi abuela es grande.", a: "de", d: ["en", "y", "un"] },
  { t: "Mi gato ___ negro.", a: "es", d: ["son", "con", "para"] },
  { t: "Ellos ___ mis amigos.", a: "son", d: ["es", "por", "mi"] },
  { t: "Voy al parque ___ mi papá.", a: "con", d: ["son", "es", "su"] },
  { t: "Este regalo es ___ ti.", a: "para", d: ["con", "desde", "son"] },
  { t: "___ me llamo Ana.", a: "Yo", d: ["Se", "Lo", "Que"] },
  { t: "El niño ___ lava las manos.", a: "se", d: ["me", "yo", "lo"] },
  { t: "Vamos ___ cine.", a: "al", d: ["el", "la", "lo"] },
];
const SIGHT_B: ChoiceItem[] = [
  { t: "___ un gato en el techo.", a: "Hay", d: ["Muy", "Más", "Como"] },
  { t: "La sopa está ___ caliente.", a: "muy", d: ["hay", "pero", "donde"] },
  { t: "Me gusta el helado, ___ no el café.", a: "pero", d: ["más", "muy", "donde"] },
  { t: "La casa ___ vivo es azul.", a: "donde", d: ["cuando", "quien", "muy"] },
  { t: "Me baño ___ hace calor.", a: "cuando", d: ["donde", "como", "hay"] },
  { t: "___ libro es mío.", a: "Este", d: ["Esta", "Esa", "Aquí"] },
  { t: "Mi mamá está ___, en la cocina.", a: "aquí", d: ["este", "ayer", "esa"] },
  { t: "___ fui al parque con mi tía.", a: "Ayer", d: ["Este", "Esa", "Aquí"] },
  { t: "El elefante es muy ___.", a: "grande", d: ["poco", "nada", "mal"] },
  { t: "Comí ___ y ya no tengo hambre.", a: "mucho", d: ["nada", "otro", "mal"] },
  { t: "Mañana voy a ___ al zoológico.", a: "ir", d: ["ver", "dar", "decir"] },
  { t: "Tengo que ___ mi tarea.", a: "hacer", d: ["ir", "dar", "querer"] },
];

const H_WORDS = "helado hoja huevo hormiga hilo hada hielo hueso búho zanahoria";
const H_SPELLING: ChoiceItem[] = H_WORDS.split(" ").map((w) => {
  const i = w.indexOf("h");
  return {
    pic: word(w).e,
    a: w,
    d: [w.slice(0, i) + w.slice(i + 1), w.slice(0, i) + "j" + w.slice(i + 1), w.slice(0, i) + "g" + w.slice(i + 1)],
    e: `«${w}» se escribe con h, aunque la h no suena.`,
  };
});

const DIPH = /ia|ie|io|ua|ue|ei|ai|au|eu|oi/;
const diphParts = (list: string) => list.split(" ").map((w) => ({ w, part: (w.match(DIPH) ?? [""])[0] }));

const R_VOWEL = [
  { w: "barco", part: "ar" }, { w: "tortuga", part: "or" }, { w: "cerdo", part: "er" }, { w: "tambor", part: "or" },
  { w: "mar", part: "ar" }, { w: "flor", part: "or" }, { w: "serpiente", part: "er" }, { w: "cuaderno", part: "er" },
  { w: "hormiga", part: "or" }, { w: "circo", part: "ir" }, { w: "surco", part: "ur" }, { w: "turno", part: "ur" },
];

const STORIES: Record<string, Passage[]> = {
  a: [
    { title: "La rana Ana", emoji: "🐸", text: "Ana es una rana. Ana salta y salta. Ana nada en la laguna. ¡Ana es una rana muy rápida!",
      qs: [
        { q: "¿Quién es Ana?", a: "Una rana", d: ["Un pato", "Una vaca"] },
        { q: "¿Dónde nada Ana?", a: "En la laguna", d: ["En la casa", "En el mar"] },
        { q: "¿Cómo es Ana?", a: "Rápida", d: ["Lenta", "Triste"] },
      ] },
    { title: "El mapa de Paco", emoji: "🗺️", text: "Paco tiene un mapa. El mapa marca una casa. Paco va a la casa y halla una caja. ¡En la caja hay pan!",
      qs: [
        { q: "¿Qué tiene Paco?", a: "Un mapa", d: ["Un pato", "Una taza"] },
        { q: "¿Qué hay en la caja?", a: "Pan", d: ["Agua", "Sal"] },
        { q: "¿Qué marca el mapa?", a: "Una casa", d: ["Una cama", "Una rana"] },
      ] },
  ],
  e: [
    { title: "El pez de Elena", emoji: "🐟", text: "Elena tiene un pez. El pez es verde. Elena le da de comer al pez. El pez se mece en el agua.",
      qs: [
        { q: "¿De qué color es el pez?", a: "Verde", d: ["Rojo", "Amarillo"] },
        { q: "¿Quién tiene un pez?", a: "Elena", d: ["Pepe", "Daniela"] },
      ] },
    { title: "El tren de Pepe", emoji: "🚂", text: "Pepe tiene un tren. El tren es de metal. Pepe pone el tren en la mesa. ¡El tren mete ruido!",
      qs: [
        { q: "¿Dónde pone Pepe el tren?", a: "En la mesa", d: ["En la cama", "En el suelo"] },
        { q: "¿De qué es el tren?", a: "De metal", d: ["De papel", "De madera"] },
      ] },
  ],
  i: [
    { title: "Mimí y el nido", emoji: "🪺", text: "Mimí mira un nido. En el nido hay tres pajaritos. Los pajaritos piden comida. Mimí sonríe.",
      qs: [
        { q: "¿Qué mira Mimí?", a: "Un nido", d: ["Un tigre", "Una piña"] },
        { q: "¿Cuántos pajaritos hay?", a: "Tres", d: ["Dos", "Cinco"] },
        { q: "¿Qué piden los pajaritos?", a: "Comida", d: ["Agua", "Un libro"] },
      ] },
    { title: "El libro de Lili", emoji: "📖", text: "Lili lee un libro. El libro es de un tigre. El tigre vive en la selva. A Lili le gusta el libro.",
      qs: [
        { q: "¿Qué lee Lili?", a: "Un libro", d: ["Un mapa", "Una carta"] },
        { q: "¿De qué animal es el libro?", a: "De un tigre", d: ["De un pez", "De un oso"] },
        { q: "¿Dónde vive el tigre?", a: "En la selva", d: ["En el mar", "En la casa"] },
      ] },
  ],
  o: [
    { title: "El oso Toto", emoji: "🐻", text: "Toto es un oso. Toto come miel y moras. Toto toma el sol en la loma. Luego Toto se duerme.",
      qs: [
        { q: "¿Qué come Toto?", a: "Miel y moras", d: ["Pan y queso", "Sopa"] },
        { q: "¿Dónde toma el sol?", a: "En la loma", d: ["En el río", "En la cama"] },
        { q: "¿Qué hace Toto al final?", a: "Se duerme", d: ["Se baña", "Corre"] },
      ] },
    { title: "El loro Coco", emoji: "🦜", text: "Coco es un loro. Coco habla mucho. Coco dice: «¡Hola, Rosa!». Rosa le da una galleta.",
      qs: [
        { q: "¿Quién es Coco?", a: "Un loro", d: ["Un oso", "Un perro"] },
        { q: "¿Qué dice Coco?", a: "¡Hola, Rosa!", d: ["¡Adiós!", "¡Tengo hambre!"] },
        { q: "¿Qué le da Rosa?", a: "Una galleta", d: ["Una pelota", "Agua"] },
      ] },
  ],
  u: [
    { title: "La luna y la nube", emoji: "🌙", text: "Hay una luna en el cielo. Una nube pasa y tapa la luna. Lucas busca la luna. ¡Uy! La luna sale otra vez.",
      qs: [
        { q: "¿Qué tapa la luna?", a: "Una nube", d: ["Un pájaro", "El sol"] },
        { q: "¿Quién busca la luna?", a: "Lucas", d: ["Lupe", "Juan"] },
        { q: "¿Qué pasa al final?", a: "La luna sale otra vez", d: ["Llueve", "Lucas se duerme"] },
      ] },
    { title: "Las uvas de Lupe", emoji: "🍇", text: "Lupe tiene uvas. Las uvas son muy dulces. Lupe le da una uva a su amigo Julio. Julio dice: «¡Gracias!».",
      qs: [
        { q: "¿Qué tiene Lupe?", a: "Uvas", d: ["Pan", "Un gusano"] },
        { q: "¿Cómo son las uvas?", a: "Dulces", d: ["Ácidas", "Amargas"] },
        { q: "¿A quién le da una uva?", a: "A Julio", d: ["A Ana", "A un perro"] },
      ] },
  ],
  mix: [
    { title: "Un día en el parque", emoji: "🌳", text: "Sami y su papá van al parque. Sami sube al tobogán. Papá lo mira y se ríe. Después comen helado de fresa.",
      qs: [
        { q: "¿Con quién va Sami?", a: "Con su papá", d: ["Con su abuela", "Solo"] },
        { q: "¿A qué sube Sami?", a: "Al tobogán", d: ["A un árbol", "A un caballo"] },
        { q: "¿Qué comen después?", a: "Helado de fresa", d: ["Pan", "Sopa"] },
      ] },
    { title: "La pelota roja", emoji: "⚽", text: "Nina tiene una pelota roja. La pelota rueda hasta el río. Un pato la empuja con el pico. ¡Nina la recupera!",
      qs: [
        { q: "¿De qué color es la pelota?", a: "Roja", d: ["Verde", "Azul"] },
        { q: "¿Hasta dónde rueda?", a: "Hasta el río", d: ["Hasta la casa", "Hasta la escuela"] },
        { q: "¿Quién empuja la pelota?", a: "Un pato", d: ["Un perro", "Un niño"] },
      ] },
  ],
  h: [
    { title: "El helado de Hugo", emoji: "🍦", text: "Hugo tiene un helado. Hace mucho calor y el helado se derrite. Hugo se mancha la mano. ¡Hay que comerlo rápido!",
      qs: [
        { q: "¿Qué tiene Hugo?", a: "Un helado", d: ["Un huevo", "Un hilo"] },
        { q: "¿Por qué se derrite el helado?", a: "Porque hace calor", d: ["Porque llueve", "Porque es de noche"] },
        { q: "¿Qué se mancha Hugo?", a: "La mano", d: ["La cara", "La camisa"] },
      ] },
    { title: "La hormiga y la hoja", emoji: "🐜", text: "Una hormiga encontró una hoja. La hoja era muy grande. La hormiga la llevó hasta su hormiguero. ¡Qué fuerte es la hormiga!",
      qs: [
        { q: "¿Qué encontró la hormiga?", a: "Una hoja", d: ["Un huevo", "Un hilo"] },
        { q: "¿Cómo era la hoja?", a: "Muy grande", d: ["Muy pequeña", "De papel"] },
        { q: "¿A dónde la llevó?", a: "A su hormiguero", d: ["Al río", "A la escuela"] },
      ] },
  ],
  ieue: [
    { title: "La nieve", emoji: "❄️", text: "En la sierra cae nieve. Diego se pone guantes y botas. Hace un muñeco de nieve. Después vuelve a su casa a tomar algo caliente.",
      qs: [
        { q: "¿Dónde cae nieve?", a: "En la sierra", d: ["En la playa", "En el desierto"] },
        { q: "¿Qué hace Diego?", a: "Un muñeco de nieve", d: ["Un castillo de arena", "Un dibujo"] },
        { q: "¿Qué se pone Diego?", a: "Guantes y botas", d: ["Un sombrero", "Sandalias"] },
      ] },
    { title: "El huevo de la gallina", emoji: "🥚", text: "La gallina puso un huevo. El huevo estaba en el nido. Un día se rompió y salió un pollito. La gallina lo cuidó con cariño.",
      qs: [
        { q: "¿Qué puso la gallina?", a: "Un huevo", d: ["Una piedra", "Una pluma"] },
        { q: "¿Qué salió del huevo?", a: "Un pollito", d: ["Un pato", "Una serpiente"] },
        { q: "¿Dónde estaba el huevo?", a: "En el nido", d: ["En la cocina", "En el agua"] },
      ] },
  ],
  iaio: [
    { title: "El piano de Julia", emoji: "🎹", text: "Julia toca el piano todos los días. Su abuela la escucha. Un día Julia tocó una canción nueva. Su abuela aplaudió muy feliz.",
      qs: [
        { q: "¿Qué toca Julia?", a: "El piano", d: ["La guitarra", "El tambor"] },
        { q: "¿Quién la escucha?", a: "Su abuela", d: ["Su perro", "Su maestra"] },
        { q: "¿Qué hizo la abuela?", a: "Aplaudió", d: ["Lloró", "Se durmió"] },
      ] },
    { title: "El avión de Mario", emoji: "✈️", text: "Mario hizo un avión de papel. Lo lanzó desde el patio. El avión voló alto, muy alto. Luego cayó junto a un río.",
      qs: [
        { q: "¿De qué era el avión?", a: "De papel", d: ["De metal", "De madera"] },
        { q: "¿Desde dónde lo lanzó?", a: "Desde el patio", d: ["Desde el techo", "Desde la playa"] },
        { q: "¿Dónde cayó el avión?", a: "Junto a un río", d: ["En un árbol", "En la casa"] },
      ] },
  ],
  aiei: [
    { title: "La reina y el aire", emoji: "👸", text: "Había una reina que tenía un peine de oro. Un día el aire se llevó el peine. Seis niños corrieron a buscarlo. ¡Lo encontraron en un jardín!",
      qs: [
        { q: "¿Qué tenía la reina?", a: "Un peine de oro", d: ["Una corona de plata", "Un perro"] },
        { q: "¿Qué se llevó el peine?", a: "El aire", d: ["Un gato", "La lluvia"] },
        { q: "¿Cuántos niños lo buscaron?", a: "Seis", d: ["Dos", "Diez"] },
      ] },
    { title: "El baile de Jaime", emoji: "💃", text: "Jaime baila en la fiesta. Baila con su amiga Aida. Bailan hasta las seis. ¡Qué bonito baile!",
      qs: [
        { q: "¿Qué hace Jaime?", a: "Baila", d: ["Canta", "Duerme"] },
        { q: "¿Con quién baila?", a: "Con Aida", d: ["Con su papá", "Solo"] },
        { q: "¿Hasta qué hora bailan?", a: "Hasta las seis", d: ["Hasta las diez", "Hasta las dos"] },
      ] },
  ],
  diph: [
    { title: "En el puerto", emoji: "⚓", text: "En el puerto hay muchos barcos. Un pescador sale temprano con su hijo. Pescan peces y los guardan en una caja. Al volver, el cielo está naranja.",
      qs: [
        { q: "¿Dónde hay muchos barcos?", a: "En el puerto", d: ["En la montaña", "En la ciudad"] },
        { q: "¿Con quién sale el pescador?", a: "Con su hijo", d: ["Con su perro", "Solo"] },
        { q: "¿De qué color está el cielo al volver?", a: "Naranja", d: ["Azul claro", "Gris oscuro"] },
      ] },
    { title: "La siesta del gato", emoji: "🐱", text: "Al gato Bruno le gusta dormir la siesta. Se acuesta junto a la ventana, donde hay sol. Sueña con ratones. Cuando despierta, tiene hambre.",
      qs: [
        { q: "¿Qué le gusta a Bruno?", a: "Dormir la siesta", d: ["Correr en el patio", "Nadar en el río"] },
        { q: "¿Dónde se acuesta?", a: "Junto a la ventana", d: ["En el techo de la casa", "Dentro de una caja"] },
        { q: "¿Con qué sueña?", a: "Con ratones", d: ["Con perros", "Con peces"] },
      ] },
  ],
  r: [
    { title: "El perro Rocky", emoji: "🐶", text: "Rocky es un perro marrón. Corre por el cerro con Raúl. Raúl le tira una rama y Rocky la trae. ¡Rocky es un gran corredor!",
      qs: [
        { q: "¿De qué color es Rocky?", a: "Marrón", d: ["Negro", "Blanco"] },
        { q: "¿Por dónde corre?", a: "Por el cerro", d: ["Por la playa", "Por la calle"] },
        { q: "¿Qué le tira Raúl?", a: "Una rama", d: ["Una pelota", "Un hueso"] },
      ] },
    { title: "La carrera", emoji: "🐢", text: "La tortuga y el ratón hicieron una carrera. El ratón corrió rápido, pero se quedó dormido. La tortuga caminó despacio sin parar. ¡La tortuga ganó la carrera!",
      qs: [
        { q: "¿Quién ganó la carrera?", a: "La tortuga", d: ["El ratón", "Nadie"] },
        { q: "¿Qué hizo el ratón?", a: "Se quedó dormido", d: ["Ganó", "Se cayó al río"] },
        { q: "¿Cómo caminó la tortuga?", a: "Despacio, sin parar", d: ["Muy rápido", "Saltando"] },
      ] },
  ],
};

const VA = "casa rana papa cama taza mapa gato pato vaca llama sal pan mar mano hada ancla campana payaso";
const VE1 = "pera perro pez tren leche bebé cereza";
const VE2 = "cebra regalo reloj helado estrella león elefante";
const VI1 = "piña silla hilo nido tigre tijera";
const VI2 = "libro jirafa pingüino tiburón limón grillo kiwi";
const VO1 = "oso sol ojo loro lobo foca bota rosa coche mono";
const VO2 = "gorro corona tomate sopa hoja conejo cohete zorro globo sombrero";
const VU1 = "uva luna nube gusano";
const VU2 = "cuchara pulpo búho lluvia";
const ONE_VOWEL_PICS = "casa rana papa cama taza mapa sal pan mar llama hada pez tren leche bebé kiwi oso sol ojo loro lobo mono gorro zorro globo flor";
const SHORT = "sol pan mar pez tren flor uva oso luna mano pato rana lobo nido foca sopa nube";
const DIGRAPH_WORDS = "coche leche llave pollo silla perro gorro zorro queso llama cuchara chocolate";
const TWO_SYL = "gato pato perro rana oso mono vaca pera uva luna nube casa coche barco globo libro piña fresa queso leche taza sopa";

export const ROWS: Row[] = [
  ["A.1", "Clasificar vocales y consonantes", P.sortLetters],
  ["A.2", "Encontrar las vocales en una palabra", P.vowelsInWord],

  ["B.1", "Elegir el dibujo que rima con la palabra", P.rhymePicture],
  ["B.2", "¿Qué palabra no rima?", P.notRhyme],
  ["B.3", "Completar la rima", (r) => choose(r, "Completa la rima.", COUPLETS)],
  ["B.4", "Completar el poema con una palabra que rime", (r) => choose(r, "Completa el poema con una palabra que rime.", POEMS)],
  ["B.5", "Formar un grupo de palabras que riman", P.rhymeSet],

  ["C.1", "¿Cuántas sílabas tiene la palabra?", P.countSyllables],
  ["C.2", "Clasificar por número de sílabas", P.sortBySyllables],

  ["D.1", "Unir los sonidos para formar una palabra", P.blendSounds],
  ["D.2", "Identificar cada sonido de una palabra", P.identifySound],
  ["D.3", "Ordenar los sonidos", P.orderSounds],

  ["E.1", "Cambiar el primer sonido de una palabra", (r) => P.changeSound(r, P.FIRST_SOUND_PAIRS, "el primer sonido")],
  ["E.2", "Cambiar el último sonido de una palabra", (r) => P.changeSound(r, P.LAST_SOUND_PAIRS, "el último sonido")],
  ["E.3", "Cambiar la vocal de una palabra", (r) => P.changeSound(r, P.VOWEL_PAIRS, "la vocal")],
  ["E.4", "Cambiar un sonido: repaso", (r) =>
    mix(r, [
      (q) => P.changeSound(q, P.FIRST_SOUND_PAIRS, "el primer sonido"),
      (q) => P.changeSound(q, P.LAST_SOUND_PAIRS, "el último sonido"),
      (q) => P.changeSound(q, P.VOWEL_PAIRS, "la vocal"),
    ])],

  ["F.1", "¿Qué dos palabras empiezan con el mismo sonido?", P.sameStart],
  ["F.2", "¿Qué dos palabras terminan con el mismo sonido?", P.sameEnd],
  ["F.3", "¿Con qué letra empieza la palabra?", (r) => P.letterAt(r, "first")],
  ["F.4", "¿Con qué letra termina la palabra?", (r) => P.letterAt(r, "last")],

  ["G.1", "Elegir el dígrafo correcto", (r) => P.completePart(r, P.DIGRAPH_START, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],
  ["G.2", "Completar la palabra con el dígrafo correcto", (r) => P.completePart(r, P.DIGRAPH_ANY, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],

  ["H.1", "Elegir la palabra con a que corresponde al dibujo: grupo 1", (r) => P.wordForPicture(r, VA.split(" ").slice(0, 9).join(" "))],
  ["H.2", "Leer palabras con ma, pa y la: grupo 1", (r) => P.wordForPicture(r, "mapa papa cama mano pato campana payaso llama")],
  ["H.3", "Completar la palabra con a", (r) => P.completeSyllable(r, VA)],
  ["H.4", "Elegir la oración con a que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_A))],
  ["H.5", "Elegir la palabra con a que corresponde al dibujo: grupo 2", (r) => P.wordForPicture(r, VA.split(" ").slice(9).join(" "))],
  ["H.6", "Leer palabras con sa, ta y ra: grupo 2", (r) => P.wordForPicture(r, "casa taza rana sal gato vaca hada")],

  ["I.1", "Elegir el dibujo de la palabra con e: grupo 1", (r) => P.pictureForWord(r, VE1)],
  ["I.2", "Completar la palabra con e", (r) => P.completeSyllable(r, `${VE1} ${VE2}`)],
  ["I.3", "Elegir la oración con e que corresponde al dibujo: grupo 1", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_E1))],
  ["I.4", "Elegir el dibujo de la palabra con e: grupo 2", (r) => P.pictureForWord(r, VE2)],
  ["I.5", "Elegir la oración con e que corresponde al dibujo: grupo 2", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_E2))],

  ["J.1", "Elegir la palabra con i que corresponde al dibujo: grupo 1", (r) => P.wordForPicture(r, VI1)],
  ["J.2", "Completar palabras con i", (r) => P.completeSyllable(r, `${VI1} ${VI2}`)],
  ["J.3", "Elegir la oración con i que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_I))],
  ["J.4", "Elegir la palabra con i que corresponde al dibujo: grupo 2", (r) => P.wordForPicture(r, VI2)],

  ["K.1", "Elegir la palabra con o que corresponde al dibujo: grupo 1", (r) => P.wordForPicture(r, VO1)],
  ["K.2", "Completar la palabra con o: grupo 1", (r) => P.completeSyllable(r, VO1)],
  ["K.3", "Elegir la oración con o que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_O))],
  ["K.4", "Elegir la palabra con o que corresponde al dibujo: grupo 2", (r) => P.wordForPicture(r, VO2)],
  ["K.5", "Completar la palabra con o: grupo 2", (r) => P.completeSyllable(r, VO2)],

  ["L.1", "Elegir el dibujo de la palabra con u: grupo 1", (r) => P.pictureForWord(r, VU1)],
  ["L.2", "Completar la palabra con u", (r) => P.completeSyllable(r, `${VU1} ${VU2}`)],
  ["L.3", "Elegir la oración con u que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_U))],
  ["L.4", "Elegir el dibujo de la palabra con u: grupo 2", (r) => P.pictureForWord(r, VU2)],

  ["M.1", "Identificar la vocal que suena en una palabra", (r) => P.identifyVowel(r, ONE_VOWEL_PICS)],
  ["M.2", "Completar la palabra con la vocal correcta", (r) => P.completeVowel(r, SHORT)],
  ["M.3", "Leer palabras cortas: grupo 1", (r) => P.wordForPicture(r, "sol pan mar pez tren flor uva oso")],
  ["M.4", "Leer palabras cortas: grupo 2", (r) => P.wordForPicture(r, "luna mano pato rana mono pera lobo nido foca sopa nube dado")],
  ["M.5", "Cambiar una letra para formar otra palabra", (r) => P.changeOneLetter(r, P.ONE_LETTER_PAIRS)],
  ["M.6", "Escribir la palabra", (r) => P.spellWord(r, SHORT)],
  ["M.7", "Completar la oración con la palabra correcta", (r) => choose(r, "Completa la oración.", SENT_SHORT)],

  ["N.1", "Escribir la palabra con ch, ll o rr", (r) => P.spellWord(r, "coche leche llave pollo silla perro gorro zorro llama", "ch ll rr a e i o u")],
  ["N.2", "Completar la palabra según el dibujo: rr, ll, ch, ñ", (r) => P.completePart(r, P.DOUBLE_AND_Ñ, ["rr", "ll", "ch", "ñ"], "¿Qué letras faltan?")],
  ["N.3", "¿La palabra empieza con una trabada?", (r) => P.hasBlend(r, "start")],
  ["N.4", "Completar la palabra con la trabada inicial correcta", (r) => P.completeBlend(r, "start")],
  ["N.5", "Clasificar por trabada o dígrafo inicial", P.sortBlend],
  ["N.6", "¿La palabra tiene una trabada en medio?", (r) => P.hasBlend(r, "middle")],
  ["N.7", "Completar la palabra con la trabada de en medio", (r) => P.completeBlend(r, "middle")],
  ["N.8", "Elegir m o n: mp y mb", P.mOrN],
  ["N.9", "Elegir la palabra con la trabada correcta", P.fillBlend],
  ["N.10", "Leer la palabra con dígrafo", (r) => P.wordForPicture(r, DIGRAPH_WORDS)],

  ["O.1", "Encontrar la palabra con la misma vocal", P.sameVowelWord],
  ["O.2", "¿Qué dos palabras tienen la misma vocal?", P.twoSameVowel],
  ["O.3", "Clasificar palabras según su vocal", P.sortByVowel],

  ["P.1", "Elegir la palabra con h que corresponde al dibujo", (r) => P.wordForPicture(r, H_WORDS)],
  ["P.2", "Elegir la palabra con h bien escrita", (r) => choose(r, "¿Cuál está bien escrita?", H_SPELLING)],
  ["P.3", "Escribir la palabra con h", (r) => P.spellWord(r, "hoja hilo hada hielo hueso huevo", "h a e i o u l j s")],
  ["P.4", "Elegir la oración con h que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_H))],

  ["Q.1", "Elegir el dibujo de la palabra con diptongo", (r) => P.pictureForWord(r, "piano agua huevo hueso puerta nieve hielo fuego lluvia serpiente cuaderno guante reina dinosaurio zanahoria")],
  ["Q.2", "Completar palabras con ie y ue", (r) => P.completePart(r, diphParts("huevo hueso puerta nieve hielo fuego serpiente"), ["ue", "ie", "ua", "ia"], "¿Qué diptongo falta?")],
  ["Q.3", "Completar la palabra con el diptongo correcto", (r) => P.completePart(r, diphParts("piano agua huevo puerta nieve fuego lluvia cuaderno guante reina dinosaurio zanahoria"), ["ia", "ie", "io", "ua", "ue", "ei", "au"], "¿Qué diptongo falta?")],
  ["Q.4", "Elegir la oración con diptongo que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_DIPH))],

  ["R.1", "Clasificar palabras con c o qu", (r) => P.sortSpelling(r, "qu", ["queso", "mantequilla", "paquete", "máquina", "raqueta", "esquina", "quince"], ["casa", "conejo", "cuchara", "coche", "foca", "vaca", "boca", "corona"])],
  ["R.2", "Clasificar palabras con g o gu", (r) => P.sortSpelling(r, "gu", ["guitarra", "hamburguesa", "juguete", "águila", "manguera", "guiso", "guerra"], ["gato", "gorro", "gallina", "gorila", "tortuga", "lago", "gota"])],
  ["R.3", "Clasificar palabras con c o z", (r) => P.sortSpelling(r, "z", ["zapato", "zorro", "taza", "zanahoria", "pozo", "azul", "zumo"], ["cebra", "cine", "cielo", "cena", "dulce", "cocina", "ciruela"])],
  ["R.4", "Clasificar palabras con g o j", (r) => P.sortSpelling(r, "j", ["jirafa", "ojo", "oreja", "hoja", "tijera", "conejo", "naranja", "jugo"], ["gigante", "girasol", "gema", "gente", "mágico", "página", "general"])],
  ["R.5", "Clasificar palabras con r o rr", (r) => P.sortSpelling(r, "rr", ["perro", "zorro", "gorro", "guitarra", "carro", "burro", "tierra", "cerro"], ["pera", "loro", "toro", "oreja", "corona", "tijera", "ratón", "rosa"])],

  ["S.1", "Elegir la palabra bien escrita: b o d", (r) => P.correctSpelling(r, "dado nido lobo búho nube bota boca cebra cabra abeja bebé globo", [["b", "d"]])],
  ["S.2", "Elegir la palabra bien escrita: p o q", (r) => P.correctSpelling(r, "pato papa pera piña pez pulpo mapa sopa pelota", [["p", "q"]])],
  ["S.3", "Elegir la palabra bien escrita: m o n", (r) => P.correctSpelling(r, "mano mono luna nube nido mapa cama rana limón manzana", [["m", "n"]])],
  ["S.4", "Elegir la palabra bien escrita: ll o y", (r) => P.correctSpelling(r, "llave lluvia llama pollo silla playa payaso yoyo rey", [["ll", "y"], ["y", "i"]])],
  ["S.5", "Elegir la palabra bien escrita: b o v", (r) => P.correctSpelling(r, "vaca uva nieve oveja ballena bota boca bebé abeja globo nube", [["b", "v"]])],
  ["S.6", "Clasificar palabras con b o v", (r) => P.sortSpelling(r, "v", ["vaca", "uva", "nieve", "oveja", "vestido", "ventana", "avión", "volcán"], ["ballena", "bota", "boca", "bebé", "abeja", "globo", "nube", "burro"])],

  ["T.1", "Elegir la palabra con r que corresponde al dibujo", (r) => P.wordForPicture(r, "ratón rosa rana reloj regalo rey reina perro zorro gorro pera loro corona tijera oreja")],
  ["T.2", "Completar la palabra con ar, er, ir, or, ur", (r) => P.completePart(r, R_VOWEL, ["ar", "er", "ir", "or", "ur"], "¿Qué letras faltan?")],

  ["U.1", "Elegir el dibujo de la palabra con y", (r) => P.pictureForWord(r, "rey yoyo playa payaso")],
  ["U.2", "Completar con ay, ey, oy, uy", (r) => choose(r, "¿Qué letras faltan?", Y_SENTENCES)],

  ["V.1", "Separar palabras de dos sílabas", P.segmentWord],
  ["V.2", "Leer palabras de dos sílabas", (r) => P.wordForPicture(r, TWO_SYL)],
  ["V.3", "Unir dos sílabas para formar una palabra: fácil", (r) => P.joinSyllables(r, false)],
  ["V.4", "Unir dos sílabas para formar una palabra: difícil", (r) => P.joinSyllables(r, true)],
  ["V.5", "Completar palabras de dos sílabas", P.completeSecondSyllable],
  ["V.6", "Completar la oración con una palabra de dos sílabas", (r) => choose(r, "Completa la oración.", TWO_SYL_SENTENCES)],

  ["W.1", "Leer palabras frecuentes, grupo 1: el, la, los, las, un, una, en, de", (r) => P.readSightWord(r, [0])],
  ["W.2", "Leer palabras frecuentes, grupo 2: es, son, mi, tu, su, con, por, para", (r) => P.readSightWord(r, [1])],
  ["W.3", "Leer palabras frecuentes, grupo 3: que, no, sí, yo, me, se, lo, al", (r) => P.readSightWord(r, [2])],
  ["W.4", "Leer palabras frecuentes: repaso de los grupos 1, 2 y 3", (r) => P.readSightWord(r, [0, 1, 2])],
  ["W.5", "Leer palabras frecuentes, grupo 4: hay, muy, más, pero, como, cuando, donde, quien", (r) => P.readSightWord(r, [3])],
  ["W.6", "Leer palabras frecuentes, grupo 5: este, esta, ese, esa, aquí, allí, hoy, ayer", (r) => P.readSightWord(r, [4])],
  ["W.7", "Leer palabras frecuentes, grupo 6: grande, poco, mucho, bien, mal, todo, nada, otro", (r) => P.readSightWord(r, [5])],
  ["W.8", "Leer palabras frecuentes, grupo 7: ver, ir, dar, hacer, tener, poder, decir, querer", (r) => P.readSightWord(r, [6])],
  ["W.9", "Leer palabras frecuentes: repaso de los grupos 4, 5, 6 y 7", (r) => P.readSightWord(r, [3, 4, 5, 6])],
  ["W.10", "Leer palabras frecuentes: repaso de los grupos 1 al 7", (r) => P.readSightWord(r, [0, 1, 2, 3, 4, 5, 6])],
  ["W.11", "Completar la oración con la palabra frecuente: grupos 1, 2 y 3", (r) => choose(r, "Completa la oración.", SIGHT_A)],
  ["W.12", "Completar la oración con la palabra frecuente: grupos 4, 5, 6 y 7", (r) => choose(r, "Completa la oración.", SIGHT_B)],
  ["W.13", "Completar la oración con la palabra frecuente: repaso", (r) => choose(r, "Completa la oración.", [...SIGHT_A, ...SIGHT_B])],
  ["W.14", "Escribir la palabra frecuente", P.spellSightWord],

  ["X.1", "Leer cuentos con a", (r) => readPassage(r, STORIES.a, false)],
  ["X.2", "Leer cuentos con e", (r) => readPassage(r, STORIES.e, false)],
  ["X.3", "Leer cuentos con i", (r) => readPassage(r, STORIES.i, false)],
  ["X.4", "Leer cuentos con o", (r) => readPassage(r, STORIES.o, false)],
  ["X.5", "Leer cuentos con u", (r) => readPassage(r, STORIES.u, false)],
  ["X.6", "Leer cuentos con todas las vocales", (r) => readPassage(r, STORIES.mix, false)],
  ["X.7", "Leer cuentos con h", (r) => readPassage(r, STORIES.h, false)],
  ["X.8", "Leer cuentos con diptongos: ie, ue", (r) => readPassage(r, STORIES.ieue, false)],
  ["X.9", "Leer cuentos con diptongos: ia, io", (r) => readPassage(r, STORIES.iaio, false)],
  ["X.10", "Leer cuentos con diptongos: ai, ei", (r) => readPassage(r, STORIES.aiei, false)],
  ["X.11", "Leer cuentos con diptongos", (r) => readPassage(r, STORIES.diph, false)],
  ["X.12", "Leer cuentos con r y rr", (r) => readPassage(r, STORIES.r, false)],
];
