import * as P from "../../../generators/lengua/phonics";
import { choose, mix, readPassage, type ChoiceItem, type Passage } from "../../../generators/lengua/bank";
import { word } from "../../../generators/lengua/words";
import type { Row } from "./row";

// 1.° de Primaria · banco de lectoescritura: conciencia fonológica, sílabas con
// cada vocal, h muda, diptongos, dígrafos y trabadas, patrones ortográficos
// (c/qu, g/gu, c/z, g/j, r/rr), letras que se confunden, palabras frecuentes y
// cuentos para leer con cada sonido.


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
  ["vocal-consonante-1", P.sortLetters],
  ["vocal-consonante-2", P.vowelsInWord],

  ["rimas-1", P.rhymePicture],
  ["rimas-2", P.notRhyme],
  ["rimas-3", (r) => choose(r, "Completa la rima.", COUPLETS)],
  ["rimas-4", (r) => choose(r, "Completa el poema con una palabra que rime.", POEMS)],
  ["rimas-5", P.rhymeSet],

  ["contar-silabas-1", P.countSyllables],
  ["contar-silabas-2", P.sortBySyllables],

  ["unir-sonidos-1", P.blendSounds],
  ["unir-sonidos-2", P.identifySound],
  ["unir-sonidos-3", P.orderSounds],

  ["cambiar-sonidos-1", (r) => P.changeSound(r, P.FIRST_SOUND_PAIRS, "el primer sonido")],
  ["cambiar-sonidos-2", (r) => P.changeSound(r, P.LAST_SOUND_PAIRS, "el último sonido")],
  ["cambiar-sonidos-3", (r) => P.changeSound(r, P.VOWEL_PAIRS, "la vocal")],
  ["cambiar-sonidos-4", (r) =>
    mix(r, [
      (q) => P.changeSound(q, P.FIRST_SOUND_PAIRS, "el primer sonido"),
      (q) => P.changeSound(q, P.LAST_SOUND_PAIRS, "el último sonido"),
      (q) => P.changeSound(q, P.VOWEL_PAIRS, "la vocal"),
    ])],

  ["sonido-letra-1", P.sameStart],
  ["sonido-letra-2", P.sameEnd],
  ["sonido-letra-3", (r) => P.letterAt(r, "first")],
  ["sonido-letra-4", (r) => P.letterAt(r, "last")],

  ["digrafos-1", (r) => P.completePart(r, P.DIGRAPH_START, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],
  ["digrafos-2", (r) => P.completePart(r, P.DIGRAPH_ANY, ["ch", "ll", "rr", "qu"], "¿Qué letras faltan?")],

  ["palabras-a-1", (r) => P.wordForPicture(r, VA.split(" ").slice(0, 9).join(" "))],
  ["palabras-a-2", (r) => P.wordForPicture(r, "mapa papa cama mano pato campana payaso llama")],
  ["palabras-a-3", (r) => P.completeSyllable(r, VA)],
  ["palabras-a-4", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_A))],
  ["palabras-a-5", (r) => P.wordForPicture(r, VA.split(" ").slice(9).join(" "))],
  ["palabras-a-6", (r) => P.wordForPicture(r, "casa taza rana sal gato vaca hada")],

  ["palabras-e-1", (r) => P.pictureForWord(r, VE1)],
  ["palabras-e-2", (r) => P.completeSyllable(r, `${VE1} ${VE2}`)],
  ["palabras-e-3", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_E1))],
  ["palabras-e-4", (r) => P.pictureForWord(r, VE2)],
  ["palabras-e-5", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_E2))],

  ["palabras-i-1", (r) => P.wordForPicture(r, VI1)],
  ["palabras-i-2", (r) => P.completeSyllable(r, `${VI1} ${VI2}`)],
  ["palabras-i-3", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_I))],
  ["palabras-i-4", (r) => P.wordForPicture(r, VI2)],

  ["palabras-o-1", (r) => P.wordForPicture(r, VO1)],
  ["palabras-o-2", (r) => P.completeSyllable(r, VO1)],
  ["palabras-o-3", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_O))],
  ["palabras-o-4", (r) => P.wordForPicture(r, VO2)],
  ["palabras-o-5", (r) => P.completeSyllable(r, VO2)],

  ["palabras-u-1", (r) => P.pictureForWord(r, VU1)],
  ["palabras-u-2", (r) => P.completeSyllable(r, `${VU1} ${VU2}`)],
  ["palabras-u-3", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_U))],
  ["palabras-u-4", (r) => P.pictureForWord(r, VU2)],

  ["palabras-cortas-1", (r) => P.identifyVowel(r, ONE_VOWEL_PICS)],
  ["palabras-cortas-2", (r) => P.completeVowel(r, SHORT)],
  ["palabras-cortas-3", (r) => P.wordForPicture(r, "sol pan mar pez tren flor uva oso")],
  ["palabras-cortas-4", (r) => P.wordForPicture(r, "luna mano pato rana mono pera lobo nido foca sopa nube dado")],
  ["palabras-cortas-5", (r) => P.changeOneLetter(r, P.ONE_LETTER_PAIRS)],
  ["palabras-cortas-6", (r) => P.spellWord(r, SHORT)],
  ["palabras-cortas-7", (r) => choose(r, "Completa la oración.", SENT_SHORT)],

  ["digrafos-3", (r) => P.spellWord(r, "coche leche llave pollo silla perro gorro zorro llama", "ch ll rr a e i o u")],
  ["digrafos-4", (r) => P.completePart(r, P.DOUBLE_AND_Ñ, ["rr", "ll", "ch", "ñ"], "¿Qué letras faltan?")],
  ["trabadas-1", (r) => P.hasBlend(r, "start")],
  ["trabadas-2", (r) => P.completeBlend(r, "start")],
  ["trabadas-3", P.sortBlend],
  ["trabadas-4", (r) => P.hasBlend(r, "middle")],
  ["trabadas-5", (r) => P.completeBlend(r, "middle")],
  ["mp-mb", P.mOrN],
  ["trabadas-6", P.fillBlend],
  ["digrafos-5", (r) => P.wordForPicture(r, DIGRAPH_WORDS)],

  ["misma-vocal-1", P.sameVowelWord],
  ["misma-vocal-2", P.twoSameVowel],
  ["misma-vocal-3", P.sortByVowel],

  ["h-muda-1", (r) => P.wordForPicture(r, H_WORDS)],
  ["h-muda-2", (r) => choose(r, "¿Cuál está bien escrita?", H_SPELLING)],
  ["h-muda-3", (r) => P.spellWord(r, "hoja hilo hada hielo hueso huevo", "h a e i o u l j s")],
  ["h-muda-4", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_H))],

  ["diptongos-1", (r) => P.pictureForWord(r, "piano agua huevo hueso puerta nieve hielo fuego lluvia serpiente cuaderno guante reina dinosaurio zanahoria")],
  ["diptongos-2", (r) => P.completePart(r, diphParts("huevo hueso puerta nieve hielo fuego serpiente"), ["ue", "ie", "ua", "ia"], "¿Qué diptongo falta?")],
  ["diptongos-3", (r) => P.completePart(r, diphParts("piano agua huevo puerta nieve fuego lluvia cuaderno guante reina dinosaurio zanahoria"), ["ia", "ie", "io", "ua", "ue", "ei", "au"], "¿Qué diptongo falta?")],
  ["diptongos-4", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_DIPH))],

  ["c-qu-g-gu-1", (r) => P.sortSpelling(r, "qu", ["queso", "mantequilla", "paquete", "máquina", "raqueta", "esquina", "quince"], ["casa", "conejo", "cuchara", "coche", "foca", "vaca", "boca", "corona"])],
  ["c-qu-g-gu-2", (r) => P.sortSpelling(r, "gu", ["guitarra", "hamburguesa", "juguete", "águila", "manguera", "guiso", "guerra"], ["gato", "gorro", "gallina", "gorila", "tortuga", "lago", "gota"])],
  ["c-qu-g-gu-3", (r) => P.sortSpelling(r, "z", ["zapato", "zorro", "taza", "zanahoria", "pozo", "azul", "zumo"], ["cebra", "cine", "cielo", "cena", "dulce", "cocina", "ciruela"])],
  ["c-qu-g-gu-4", (r) => P.sortSpelling(r, "j", ["jirafa", "ojo", "oreja", "hoja", "tijera", "conejo", "naranja", "jugo"], ["gigante", "girasol", "gema", "gente", "mágico", "página", "general"])],
  ["r-rr", (r) => P.sortSpelling(r, "rr", ["perro", "zorro", "gorro", "guitarra", "carro", "burro", "tierra", "cerro"], ["pera", "loro", "toro", "oreja", "corona", "tijera", "ratón", "rosa"])],

  ["letras-confunden-1", (r) => P.correctSpelling(r, "dado nido lobo búho nube bota boca cebra cabra abeja bebé globo", [["b", "d"]])],
  ["letras-confunden-2", (r) => P.correctSpelling(r, "pato papa pera piña pez pulpo mapa sopa pelota", [["p", "q"]])],
  ["letras-confunden-3", (r) => P.correctSpelling(r, "mano mono luna nube nido mapa cama rana limón manzana", [["m", "n"]])],
  ["letras-confunden-4", (r) => P.correctSpelling(r, "llave lluvia llama pollo silla playa payaso yoyo rey", [["ll", "y"], ["y", "i"]])],
  ["letras-confunden-5", (r) => P.correctSpelling(r, "vaca uva nieve oveja ballena bota boca bebé abeja globo nube", [["b", "v"]])],
  ["letras-confunden-6", (r) => P.sortSpelling(r, "v", ["vaca", "uva", "nieve", "oveja", "vestido", "ventana", "avión", "volcán"], ["ballena", "bota", "boca", "bebé", "abeja", "globo", "nube", "burro"])],

  ["r-y-1", (r) => P.wordForPicture(r, "ratón rosa rana reloj regalo rey reina perro zorro gorro pera loro corona tijera oreja")],
  ["r-y-2", (r) => P.completePart(r, R_VOWEL, ["ar", "er", "ir", "or", "ur"], "¿Qué letras faltan?")],

  ["r-y-3", (r) => P.pictureForWord(r, "rey yoyo playa payaso")],
  ["r-y-4", (r) => choose(r, "¿Qué letras faltan?", Y_SENTENCES)],

  ["dos-silabas-1", P.segmentWord],
  ["dos-silabas-2", (r) => P.wordForPicture(r, TWO_SYL)],
  ["dos-silabas-3", (r) => P.joinSyllables(r, false)],
  ["dos-silabas-4", (r) => P.joinSyllables(r, true)],
  ["dos-silabas-5", P.completeSecondSyllable],
  ["dos-silabas-6", (r) => choose(r, "Completa la oración.", TWO_SYL_SENTENCES)],

  ["frecuentes-1-1", (r) => P.readSightWord(r, [0])],
  ["frecuentes-1-2", (r) => P.readSightWord(r, [1])],
  ["frecuentes-1-3", (r) => P.readSightWord(r, [2])],
  ["frecuentes-1-4", (r) => P.readSightWord(r, [0, 1, 2])],
  ["frecuentes-2-1", (r) => P.readSightWord(r, [3])],
  ["frecuentes-2-2", (r) => P.readSightWord(r, [4])],
  ["frecuentes-2-3", (r) => P.readSightWord(r, [5])],
  ["frecuentes-2-4", (r) => P.readSightWord(r, [6])],
  ["frecuentes-2-5", (r) => P.readSightWord(r, [3, 4, 5, 6])],
  ["frecuentes-2-6", (r) => P.readSightWord(r, [0, 1, 2, 3, 4, 5, 6])],
  ["frecuentes-oracion-1", (r) => choose(r, "Completa la oración.", SIGHT_A)],
  ["frecuentes-oracion-2", (r) => choose(r, "Completa la oración.", SIGHT_B)],
  ["frecuentes-oracion-3", (r) => choose(r, "Completa la oración.", [...SIGHT_A, ...SIGHT_B])],
  ["frecuentes-oracion-4", P.spellSightWord],

  ["cuentos-vocales-1", (r) => readPassage(r, STORIES.a, false)],
  ["cuentos-vocales-2", (r) => readPassage(r, STORIES.e, false)],
  ["cuentos-vocales-3", (r) => readPassage(r, STORIES.i, false)],
  ["cuentos-vocales-4", (r) => readPassage(r, STORIES.o, false)],
  ["cuentos-vocales-5", (r) => readPassage(r, STORIES.u, false)],
  ["cuentos-vocales-6", (r) => readPassage(r, STORIES.mix, false)],
  ["cuentos-sonidos-1", (r) => readPassage(r, STORIES.h, false)],
  ["cuentos-sonidos-2", (r) => readPassage(r, STORIES.ieue, false)],
  ["cuentos-sonidos-3", (r) => readPassage(r, STORIES.iaio, false)],
  ["cuentos-sonidos-4", (r) => readPassage(r, STORIES.aiei, false)],
  ["cuentos-sonidos-5", (r) => readPassage(r, STORIES.diph, false)],
  ["cuentos-sonidos-6", (r) => readPassage(r, STORIES.r, false)],
];
