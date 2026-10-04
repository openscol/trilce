import * as P from "../../../generators/lengua/phonics";
import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, pickAll, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, read, w } from "./helpers";
import type { Row } from "./row";

// Fundamentos de lectura (IXL 3rd grade ELA, A-G), adaptados al castellano:
//   vocales cortas y largas → diptongos e hiatos (por vocal)
//   blends de tres letras → grupos de tres consonantes (mbr, ntr, str...)
//   dígrafos sh/th/ph/wh → ch, ll, rr, qu, gu       mb, kn, dge, tch → la h muda
//   -ng, -nk → mp, mb y nv       r-controlled → r y rr
//   variant vowels → gue, gui, güe, güi
//   tipos de sílaba → sílaba tónica       consonant-l-e → bl, cl, fl, gl, pl
//   letras de un sonido → letras que representan el mismo sonido (c/qu/k, g/j, b/v...)

export const SECTIONS: Section[] = [
  { id: "A", name: "Diptongos e hiatos", icon: "👯" },
  { id: "B", name: "Grupos consonánticos y dígrafos", icon: "🔗" },
  { id: "C", name: "La r, los diptongos y la ü", icon: "🐯" },
  { id: "D", name: "Palabras de varias sílabas", icon: "👏" },
  { id: "E", name: "Palabras con prefijos y sufijos", icon: "🧩" },
  { id: "F", name: "Palabras frecuentes y de escritura difícil", icon: "⭐" },
  { id: "G", name: "Cuentos para leer", icon: "📚" },
];

const DIPHTHONG = ["aire", "peine", "cuento", "ciudad", "viaje", "puerta", "reina", "piano", "jaula", "cuidado", "nieve", "fuego"];
const HIATUS = ["río", "poeta", "maíz", "baúl", "teatro", "país", "día", "leer", "caer", "búho", "océano", "tío"];

const RIDDLES = [
  { clue: "Rima con «botón» y ruge en la selva.", w: "león" },
  { clue: "Rima con «canción» y vuela con pasajeros.", w: "avión" },
  { clue: "Rima con «pastel» y sirve para escribir y dibujar.", w: "papel" },
  { clue: "Rima con «camino» y mueve sus aspas con el viento.", w: "molino" },
  { clue: "Rima con «sandía» y es lo contrario de la noche.", w: "día" },
  { clue: "Rima con «ventana» y es el día después de hoy.", w: "mañana" },
  { clue: "Rima con «cartero» y es el primer mes del año.", w: "enero" },
  { clue: "Rima con «castillo» y sirve para cortar el pan.", w: "cuchillo" },
  { clue: "Rima con «montaña» y teje su tela en un rincón.", w: "araña" },
  { clue: "Rima con «camisa» y aparece en tu cara cuando estás feliz.", w: "sonrisa" },
];

const THREE_CONS = [
  { w: "hombre", part: "mbr" }, { w: "sombra", part: "mbr" }, { w: "compra", part: "mpr" }, { w: "siempre", part: "mpr" },
  { w: "entrada", part: "ntr" }, { w: "centro", part: "ntr" }, { w: "maestra", part: "str" }, { w: "nuestro", part: "str" },
  { w: "inglés", part: "ngl" }, { w: "ejemplo", part: "mpl" }, { w: "templo", part: "mpl" }, { w: "mezcla", part: "zcl" },
];

const STRESS: ChoiceItem[] = [
  w("ca-mi-no. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "mi", "ca", "no"),
  w("pá-ja-ro. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "pá", "ja", "ro"),
  w("co-ra-zón. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "zón", "co", "ra"),
  w("ven-ta-na. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "ta", "ven", "na"),
  w("mú-si-ca. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "mú", "si", "ca"),
  w("pa-pel. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "pel", "pa"),
  w("ár-bol. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "ár", "bol"),
  w("ma-ri-po-sa. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "po", "ma", "ri", "sa"),
  w("ca-mi-ón. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "ón", "ca", "mi"),
  w("te-lé-fo-no. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "lé", "te", "fo", "no"),
  w("es-cue-la. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "cue", "es", "la"),
  w("re-loj. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "loj", "re"),
  w("lá-piz. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "lá", "piz"),
  w("a-mis-tad. ¿Cuál es la sílaba tónica (la que suena más fuerte)?", "tad", "a", "mis"),
];

const LONG_WORDS = "ma-ri-po-sa bi-ci-cle-ta te-lé-fo-no com-pu-ta-do-ra ca-rre-te-ra bi-blio-te-ca cho-co-la-te di-no-sau-rio e-le-fan-te hi-po-pó-ta-mo mur-cié-la-go za-na-ho-ria ven-ti-la-dor hos-pi-tal";
const LONG_READ = "mariposa biblioteca refrigeradora helicóptero computadora supermercado dinosaurio hipopótamo murciélago ventilador semáforo calendario";

const LONG_SENTENCES: ChoiceItem[] = [
  f("Busqué un libro de cuentos en la ___ de mi escuela.", "biblioteca", "bicicleta", "biografía"),
  f("Mi papá guarda la leche en la ___.", "refrigeradora", "computadora", "licuadora"),
  f("El ___ voló sobre la ciudad y aterrizó en el hospital.", "helicóptero", "hipopótamo", "termómetro"),
  f("Cruzamos la pista cuando el ___ se puso en verde.", "semáforo", "teléfono", "micrófono"),
  f("Marqué mi cumpleaños en el ___ de la pared.", "calendario", "diccionario", "vecindario"),
  f("El ___ duerme de día, colgado boca abajo.", "murciélago", "relámpago", "cocodrilo"),
  f("Compramos frutas y verduras en el ___.", "supermercado", "superhéroe", "campamento"),
  f("Hace calor: prende el ___, por favor.", "ventilador", "vendedor", "contenedor"),
  f("La ___ nos explicó la suma con dibujos.", "profesora", "licuadora", "pescadora"),
];

const AFFIX_SPLIT: ChoiceItem[] = [
  w("¿Cómo se separa «deshacer» en prefijo y palabra base?", "des + hacer", "de + shacer", "desha + cer"),
  w("¿Cómo se separa «releer» en prefijo y palabra base?", "re + leer", "rel + eer", "rele + er"),
  w("¿Cómo se separa «imposible» en prefijo y palabra base?", "im + posible", "impo + sible", "i + mposible"),
  w("¿Cómo se separa «submarino» en prefijo y palabra base?", "sub + marino", "su + bmarino", "subma + rino"),
  w("¿Cómo se separa «rápidamente» en palabra base y sufijo?", "rápida + mente", "rápi + damente", "rápidamen + te"),
  w("¿Cómo se separa «panadero» en palabra base y sufijo?", "pan + adero", "pa + nadero", "panade + ro"),
  w("¿Cómo se separa «florero» en palabra base y sufijo?", "flor + ero", "flo + rero", "flore + ro"),
  w("¿Cómo se separa «inútil» en prefijo y palabra base?", "in + útil", "inú + til", "i + nútil"),
  w("¿Cómo se separa «amable» en palabra base y sufijo?", "am(ar) + able", "a + mable", "amab + le"),
  w("¿Cómo se separa «prehistoria» en prefijo y palabra base?", "pre + historia", "prehis + toria", "pr + ehistoria"),
];

const AFFIX_SENTENCES: ChoiceItem[] = [
  f("No entendí el cuento, así que lo voy a ___.", "releer", "leer mal", "lector"),
  f("El nudo está muy apretado: ayúdame a ___ el pasador.", "desatar", "atar", "reatar"),
  f("La tortuga camina ___.", "lentamente", "lentitud", "lento ella"),
  f("Sin luz es ___ leer de noche.", "imposible", "posible", "posiblemente"),
  f("El ___ vende pan caliente cada mañana.", "panadero", "panadería", "empanado"),
  f("Puse las rosas en el ___ de la sala.", "florero", "florista", "florido"),
  f("Mi abuelo es muy ___: saluda a todos con cariño.", "amable", "amor", "amablemente"),
  f("El cuarto está ___: hay ropa por todo el piso.", "desordenado", "ordenado", "reordenar"),
  f("El ___ navega por debajo del agua.", "submarino", "marinero", "marítima"),
  f("Este lápiz roto es ___: ya no escribe.", "inútil", "útil", "utilidad"),
];

const SOUND_LETTERS: ChoiceItem[] = [
  w("En «queso», ¿qué letras representan el sonido /k/?", "qu", "q", "ue", "es"),
  w("En «guitarra», ¿qué letras representan el sonido /g/?", "gu", "g", "ui", "rr"),
  w("En «cine», ¿qué letra representa el sonido /s/?", "c", "i", "n", "e"),
  w("En «jirafa» y «gente», ¿qué letras representan el mismo sonido?", "j y g", "j y f", "r y n", "g y t"),
  w("En «vaca» y «bota», ¿qué letras representan el mismo sonido?", "v y b", "c y t", "v y c", "a y o"),
  w("En «lluvia» y «yoyo», ¿qué letras representan el mismo sonido (para la mayoría de hablantes)?", "ll e y", "ll y v", "u y o", "y e i"),
  w("En «zapato» y «cereza», ¿qué letras representan el mismo sonido?", "z y c", "z y p", "c y r", "p y t"),
  w("En «perro», ¿qué letras representan el sonido fuerte de la r?", "rr", "r", "er", "ro"),
  w("En «rey», ¿qué letra representa el sonido /i/?", "y", "e", "r", "i"),
  w("En «kilo» y «casa», ¿qué letras representan el mismo sonido?", "k y c", "k y l", "c y s", "i y a"),
  w("En «hola», ¿qué letra no representa ningún sonido?", "h", "o", "l", "a"),
  w("En «chocolate», ¿qué letras juntas representan un solo sonido?", "ch", "co", "la", "te"),
];

const SIGHT = "también entonces después todavía mientras siempre nunca además porque aunque durante alrededor";
const SIGHT_SENTENCES: ChoiceItem[] = [
  f("Me gusta el fútbol y ___ el vóley.", "también", "tampoco", "todavía"),
  f("Primero hice la tarea y ___ salí a jugar.", "después", "durante", "aunque"),
  f("Son las nueve y Luis ___ no llega.", "todavía", "también", "además"),
  f("No fui al parque ___ estaba lloviendo.", "porque", "para que", "mientras"),
  f("Yo leo ___ mi hermana dibuja.", "mientras", "entonces", "siempre"),
  f("Salí a correr ___ hacía frío.", "aunque", "porque", "además"),
  f("Los niños se sentaron ___ de la fogata.", "alrededor", "durante", "entonces"),
  f("No hables ___ la película.", "durante", "alrededor", "todavía"),
  f("Mi abuela ___ me cuenta un cuento antes de dormir.", "siempre", "nunca", "todavía"),
  f("Sonó el timbre y ___ entramos al salón.", "entonces", "para que", "mientras"),
];

export const ROWS: Row[] = [
  ["A.1", "Usar las vocales para clasificar palabras con diptongo y con hiato", (r) =>
    mix(r, [
      (q) => pickAll(q, "Selecciona las palabras con diptongo (dos vocales juntas en la misma sílaba).", DIPHTHONG, HIATUS, "diptongo"),
      (q) => pickAll(q, "Selecciona las palabras con hiato (dos vocales juntas en sílabas distintas).", HIATUS, DIPHTHONG, "hiato"),
    ])],
  ["A.2", "Escribir palabras que riman para responder adivinanzas", (r) => P2.spellFromClue(r, RIDDLES)],
  ["A.3", "Escribir la palabra con a: ai, au, ia, ua, aí, aú", (r) => P2.spellHeard(r, "baile aula piano agua maíz baúl paisaje guante jaula viaje", "a e i o u í ú l n s")],
  ["A.4", "Escribir la palabra con e: ei, eu, ie, ue, eo, ee", (r) => P2.spellHeard(r, "reina peine nieve huevo fuego deuda leer poeta cielo teatro", "a e i o u l n r s t")],
  ["A.5", "Escribir la palabra con i: ia, ie, io, iu, ía, ío", (r) => P2.spellHeard(r, "ciudad viuda radio familia río día frío tío sandía fiesta", "a e i o u í d r s t")],
  ["A.6", "Escribir la palabra con o: oi, io, uo, oí, oe, oa", (r) => P2.spellHeard(r, "boina camión cuota oído héroe canoa poema estoy antiguo", "a e i o u í é n r s")],
  ["A.7", "Escribir la palabra con u: ua, ue, ui, uo, úa, úo", (r) => P2.spellHeard(r, "cuatro cuento ruido cuidado búho grúa dúo suave fuerte juicio", "a e i o u ú r s t c")],

  ["B.1", "Completar la palabra con un grupo de tres consonantes", (r) => P.completePart(r, THREE_CONS, ["mbr", "mpr", "ntr", "str", "ngl", "mpl", "zcl"], "¿Qué consonantes faltan?")],
  ["B.2", "Escribir la palabra con dígrafo: ch, ll, rr, qu", (r) => P2.spellHeard(r, "mochila cuchillo carretera paquete ballena barranco chaqueta mantequilla orquesta", "ch ll rr qu a e i o")],
  ["B.3", "Escribir la palabra con h muda: h, hie, hue, h intercalada", (r) => P2.spellHeard(r, "almohada zanahoria búho ahora hielo hueso hierba cohete huella ahorro", "h a e i o u l r")],
  ["B.4", "Escribir palabras con mp, mb y nv", (r) => P2.spellHeard(r, "campo tiempo bombero sombra invierno enviar invitar cambio trompo también", "m n b p v a e i")],
  ["B.5", "Escribir palabras con qu y x", (r) => P2.spellHeard(r, "taxi examen éxito texto máquina esquina parque quince exacto explicar", "qu x c s k a e i")],
  ["B.6", "Escribir palabras con grupos consonánticos y dígrafos: repaso", (r) => P2.spellHeard(r, "mochila carretera almohada bombero invierno examen esquina hombre siempre nuestro", "ch ll rr qu h m n x")],

  ["C.1", "Escribir palabras con r y rr", (r) => P2.spellHeard(r, "carretera ratón enredo honrado sonrisa torre arroz pera alrededor ferrocarril", "r rr a e i o l n")],
  ["C.2", "Escribir palabras con diptongo", (r) => P2.spellHeard(r, "cuaderno viaje puente ciudad aceite jaula nieve fuego guante peine", "a e i o u r s t")],
  ["C.3", "Escribir palabras con gue, gui, güe y güi", (r) => P2.spellHeard(r, "juguete guitarra pingüino cigüeña águila vergüenza hoguera guiso", "g u ü e i a o j")],

  ["D.1", "Identificar la sílaba tónica", (r) => choose(r, "", STRESS)],
  ["D.2", "Separar en sílabas palabras de varias sílabas", (r) => P2.segmentList(r, LONG_WORDS)],
  ["D.3", "Leer palabras de varias sílabas", (r) => P2.listenChoose(r, LONG_READ)],
  ["D.4", "Completar la oración con la palabra de varias sílabas", (r) => choose(r, "Completa la oración.", LONG_SENTENCES)],
  ["D.5", "Escribir palabras con sílabas abiertas y cerradas", (r) => P2.spellHeard(r, "camino pelota tomate ventana pintura mercado partido doctor jardín", "a e i o u d l n r s")],
  ["D.6", "Escribir palabras con bl, cl, fl, gl y pl", (r) => P2.spellHeard(r, "tabla cable bicicleta chancleta flauta regla iglesia plaza pluma amable", "b c f g p l a e")],
  ["D.7", "Escribir palabras de varias sílabas", (r) => P2.spellHeard(r, "mariposa elefante escalera hospital calendario semáforo camiseta película", "a e i o u l n r s t")],

  ["E.1", "Separar y leer palabras con prefijos o sufijos", (r) => choose(r, "", AFFIX_SPLIT)],
  ["E.2", "Completar la oración con la palabra con prefijo o sufijo", (r) => choose(r, "Completa la oración.", AFFIX_SENTENCES)],

  ["F.1", "Seleccionar las letras que representan un sonido", (r) => choose(r, "", SOUND_LETTERS)],
  ["F.2", "Leer palabras frecuentes", (r) => P2.listenChoose(r, SIGHT)],
  ["F.3", "Completar la oración con la palabra frecuente correcta", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
  ["F.4", "Escribir la palabra frecuente: más fáciles", (r) => P2.spellHeard(r, "siempre nunca porque aunque ahora hoy ayer hacia hasta desde", "a e i o u c h n r s")],
  ["F.5", "Escribir la palabra frecuente: más difíciles", (r) => P2.spellHeard(r, "también entonces después todavía mientras además durante alrededor través quizás", "a e i o u é í n s v")],

  ["G.1", "Leer cuentos con diptongos e hiatos", (r) => readPassage(r, STORIES.vowels, false)],
  ["G.2", "Leer cuentos con r y rr", (r) => readPassage(r, STORIES.r, false)],
  ["G.3", "Leer cuentos con gue, gui, güe, güi y diptongos", (r) => readPassage(r, STORIES.gu, false)],
];

const STORIES = {
  vowels: [
    read("El viaje de Mateo", "🚌", "Mateo y su tía viajaron a una ciudad junto al río. El día estaba frío y había neblina. En la plaza, un poeta leía en voz alta frente al teatro. Mateo escuchó con cuidado y luego escribió su propio poema sobre el viaje.",
      ["¿A dónde viajaron Mateo y su tía?", "A una ciudad junto al río", "A un pueblo en la playa", "A una granja en la selva"],
      ["¿Quién leía frente al teatro?", "Un poeta", "Un maestro", "Un cartero"],
      ["¿Qué hizo Mateo después de escuchar?", "Escribió un poema", "Compró un piano", "Se durmió en la plaza"]),
    read("La jaula vacía", "🐦", "Lucía tenía un jilguero en una jaula. Cada mañana, el pájaro miraba el cielo y dejaba de cantar. Lucía sintió pena y abrió la puerta de la jaula. El jilguero voló hacia los árboles y, desde ese día, vuelve a cantar en su ventana.",
      ["¿Qué animal tenía Lucía?", "Un jilguero", "Un canario amarillo", "Un búho"],
      ["¿Por qué Lucía abrió la jaula?", "Porque sintió pena por el pájaro", "Porque quería limpiar la jaula", "Porque el pájaro la había picado"],
      ["¿Qué hace el jilguero desde ese día?", "Vuelve a cantar en la ventana", "Vive dentro de la casa de Lucía, sin jaula", "Nunca regresó"]),
  ],
  r: [
    read("El perro Ramón", "🐕", "Ramón es un perro marrón que corre por la carretera de tierra. Un día vio un carro atascado en el barro. Ramón ladró fuerte hasta que llegaron los vecinos. Entre todos empujaron el carro y Ramón recibió un rico hueso.",
      ["¿De qué color es Ramón?", "Marrón", "Negro", "Blanco"],
      ["¿Qué problema tenía el carro?", "Estaba atascado en el barro", "No tenía ruedas", "Se había quedado sin luces ni gasolina"],
      ["¿Qué recibió Ramón al final?", "Un hueso", "Un collar", "Un baño"]),
    read("La torre de Rita", "🧱", "Rita armó una torre con cajas de cartón. La torre era tan alta que parecía un cerro. De pronto, su hermano Enrique pasó corriendo y la torre se derrumbó. Enrique pidió perdón y los dos la armaron otra vez, más fuerte.",
      ["¿Con qué armó Rita la torre?", "Con cajas de cartón", "Con ladrillos de barro", "Con ramas de árbol"],
      ["¿Por qué se derrumbó la torre?", "Porque Enrique pasó corriendo", "Porque sopló un viento muy fuerte ese día", "Porque Rita la empujó"],
      ["¿Qué hicieron al final?", "La armaron otra vez", "Tiraron las cajas", "Se fueron a dormir"]),
  ],
  gu: [
    read("El pingüino y la cigüeña", "🐧", "Un pingüino pequeño quería volar como la cigüeña. Subió a una roca y agitó sus alas, pero cayó al agua. Le dio vergüenza, hasta que descubrió que bajo el agua era el más veloz. La cigüeña lo aplaudió desde el cielo.",
      ["¿Qué quería hacer el pingüino?", "Volar como la cigüeña", "Nadar hasta la playa más lejana", "Trepar a un árbol"],
      ["¿Qué descubrió bajo el agua?", "Que era el más veloz", "Que no sabía nadar", "Que el agua estaba tibia"],
      ["¿Cómo se sintió al caer?", "Avergonzado", "Furioso", "Muy aburrido"]),
    read("La guitarra del abuelo", "🎸", "En el desván, Miguel encontró una guitarra antigua. Tenía polvo y le faltaba una cuerda. Su abuelo la limpió, la arregló y le enseñó una canción. Ahora, cada domingo, los dos tocan junto a la hoguera mientras la familia come un guiso.",
      ["¿Dónde encontró Miguel la guitarra?", "En el desván", "En el jardín", "En la escuela"],
      ["¿Qué le faltaba a la guitarra?", "Una cuerda", "El mango", "La funda"],
      ["¿Qué hacen los domingos?", "Tocan junto a la hoguera", "Venden guitarras", "Limpian el desván de toda la casa"]),
  ],
};
