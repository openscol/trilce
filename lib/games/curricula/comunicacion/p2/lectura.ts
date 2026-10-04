import { choose, order, readPassage, type ChoiceItem, type OrderItem, type Passage } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "./row";

// Estrategias de lectura (IXL 2nd grade ELA, U-GG). Lecturas propias, con
// temas cercanos a los alumnos (Perú y Latinoamérica).

export const SECTIONS: Section[] = [
  { id: "U", name: "Idea principal", icon: "💡" },
  { id: "V", name: "Inferencias y enseñanza", icon: "🕵️" },
  { id: "W", name: "Propósito del autor", icon: "✍️" },
  { id: "X", name: "Escenario y personajes", icon: "🎭" },
  { id: "Y", name: "Secuencia", icon: "🔢" },
  { id: "Z", name: "Trama", icon: "📖" },
  { id: "AA", name: "Causa y efecto", icon: "➡️" },
  { id: "BB", name: "Comparar y contrastar", icon: "⚖️" },
  { id: "CC", name: "Partes del texto", icon: "📰" },
  { id: "DD", name: "Lecturas literarias en voz alta", icon: "🔊" },
  { id: "EE", name: "Lecturas literarias", icon: "📚" },
  { id: "FF", name: "Textos informativos en voz alta", icon: "🔊" },
  { id: "GG", name: "Textos informativos", icon: "🌎" },
];

// --- U. Idea principal -----------------------------------------------------------

const TOPIC_PURPOSE: Passage[] = [
  {
    title: "Las abejas", emoji: "🐝",
    text: "Las abejas son insectos muy trabajadores. Vuelan de flor en flor para recoger néctar. Con el néctar hacen miel en su panal. Al volar, llevan polen de una flor a otra y así ayudan a que nazcan nuevas plantas.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De las abejas y su trabajo", d: ["De cómo sembrar flores", "De los insectos peligrosos", "De una fábrica de miel"] },
      { q: "¿Para qué escribió el autor este texto?", a: "Para dar información sobre las abejas", d: ["Para contar un cuento de risa sobre flores", "Para vender frascos de miel", "Para enseñar a volar"] },
      { q: "¿Qué hacen las abejas con el néctar?", a: "Hacen miel", d: ["Hacen cera", "Lo regalan", "Lo entierran"] },
    ],
  },
  {
    title: "Cómo lavarse las manos", emoji: "🧼",
    text: "Lavarse las manos evita muchas enfermedades. Primero, moja tus manos con agua. Luego, frótalas con jabón durante veinte segundos. Después, enjuágalas bien. Al final, sécalas con una toalla limpia.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De cómo lavarse las manos", d: ["De cómo hacer jabón en casa", "De las enfermedades", "De las toallas"] },
      { q: "¿Para qué se escribió este texto?", a: "Para explicar cómo hacer algo", d: ["Para contar una historia", "Para hacer reír al lector", "Para describir un paisaje bonito"] },
      { q: "¿Cuánto tiempo hay que frotar las manos con jabón?", a: "Veinte segundos", d: ["Dos segundos", "Quince minutos", "Una hora"] },
    ],
  },
  {
    title: "La papa", emoji: "🥔",
    text: "La papa nació en los Andes hace miles de años. En el Perú existen más de tres mil variedades de papa. Hay papas amarillas, blancas, rosadas y moradas. Hoy la papa se come en casi todos los países del mundo.",
    qs: [
      { q: "¿Cuál es el tema del texto?", a: "La papa", d: ["Los países del mundo", "Los colores", "Las montañas"] },
      { q: "¿Para qué escribió el autor este texto?", a: "Para informar sobre la papa", d: ["Para dar una receta", "Para vender papas", "Para contar un chiste de papas"] },
      { q: "¿Dónde nació la papa?", a: "En los Andes", d: ["En el mar", "En la selva", "En Europa"] },
    ],
  },
];

const MAIN_DETAIL: Passage[] = [
  {
    title: "Los colibríes", emoji: "🐦",
    text: "Los colibríes son aves sorprendentes. Mueven sus alas tan rápido que casi no se ven. Pueden quedarse quietos en el aire, como un helicóptero. También son las únicas aves que pueden volar hacia atrás.",
    qs: [
      { q: "¿Cuál es la idea principal?", a: "Los colibríes son aves sorprendentes", d: ["Los helicópteros vuelan quietos en el aire", "Las aves tienen alas", "Los colibríes son muy pequeños"] },
      { q: "¿Qué detalle apoya la idea principal?", a: "Pueden volar hacia atrás", d: ["Viven en jaulas", "Comen semillas muy duras", "Duermen de día"] },
    ],
  },
  {
    title: "El desayuno", emoji: "🥣",
    text: "El desayuno es una comida muy importante. Te da energía para estudiar y jugar. Los niños que desayunan bien prestan más atención en clase. Un buen desayuno puede tener avena, fruta, pan y leche.",
    qs: [
      { q: "¿Cuál es la idea principal?", a: "El desayuno es una comida muy importante", d: ["La avena es muy rica", "Los niños juegan mucho en el recreo del colegio", "La leche viene de la vaca"] },
      { q: "¿Qué detalle apoya la idea principal?", a: "Da energía para estudiar y jugar", d: ["El almuerzo es al mediodía", "El pan se compra en la panadería", "La fruta crece en árboles"] },
    ],
  },
  {
    title: "Las bibliotecas", emoji: "📚",
    text: "En una biblioteca se pueden hacer muchas cosas. Puedes leer cuentos, revistas y libros de ciencia. Puedes llevar libros prestados a tu casa. Algunas bibliotecas tienen computadoras y talleres de dibujo.",
    qs: [
      { q: "¿Cuál es la idea principal?", a: "En una biblioteca se pueden hacer muchas cosas", d: ["Los libros de ciencia son largos y tienen fotos", "Las computadoras son caras", "Los cuentos son para niños"] },
      { q: "¿Qué detalle apoya la idea principal?", a: "Puedes llevar libros prestados", d: ["Hay que guardar silencio en misa", "Los cuadernos tienen hojas", "Las revistas se venden en quioscos"] },
    ],
  },
];

// --- V. Inferencias y enseñanza -----------------------------------------------------

const BOOK_TITLES: ChoiceItem[] = [
  { pic: "🐉🏰", a: "El dragón del castillo", d: ["Recetas con verduras", "Cómo cuidar tu bicicleta", "Los planetas"] },
  { pic: "🚀🌕", a: "Viaje a la Luna", d: ["El gato dormilón", "La vida en la granja", "Canciones de cuna"] },
  { pic: "🐶🦴", a: "El perrito que perdió su hueso", d: ["El pez volador", "La escuela de brujas y magos", "Aprende a sumar"] },
  { pic: "🥕🥦🍅", a: "Las verduras de mi huerto", d: ["Aventuras en el mar", "El tren de la medianoche", "Animales del Polo"] },
  { pic: "⚽🏆", a: "El equipo campeón", d: ["Flores del desierto", "Mi primer libro de cocina", "El ratón de biblioteca"] },
  { pic: "🦖🦕", a: "El mundo de los dinosaurios", d: ["Un día de lluvia", "La princesa valiente y el mar", "Juegos de mesa"] },
  { pic: "🧙‍♀️🧹", a: "La bruja que no sabía volar", d: ["Los peces del río", "Cómo armar una cometa gigante", "El panadero feliz"] },
  { pic: "🐠🐙🌊", a: "La vida en el mar", d: ["Aves de la montaña", "El circo llegó", "Mi abuelo el zapatero"] },
];

const INFERENCES: Passage[] = [
  {
    title: "La mochila", emoji: "🎒",
    text: "Luciana metió en su mochila un gorro, un bloqueador solar y una botella de agua. Su papá cargó una sombrilla grande y una pelota. «¡No olviden las toallas!», dijo la mamá mientras subían al carro.",
    qs: [
      { q: "¿A dónde va la familia?", a: "A la playa", d: ["A la escuela", "Al cine", "A la nieve"] },
      { q: "¿Cómo está el clima?", a: "Hace sol y calor", d: ["Llueve mucho", "Hace mucho frío", "Hay neblina"] },
    ],
  },
  {
    title: "El examen", emoji: "📝",
    text: "Mateo no quiso cenar. Repasó su cuaderno una y otra vez. Esa noche dio muchas vueltas en la cama. Por la mañana le sudaban las manos cuando la maestra repartió las hojas.",
    qs: [
      { q: "¿Cómo se siente Mateo?", a: "Nervioso", d: ["Aburrido", "Enojado", "Tranquilo"] },
      { q: "¿Qué repartió la maestra?", a: "Un examen", d: ["Dulces", "Dibujos", "Pelotas"] },
    ],
  },
  {
    title: "Ruidos en la cocina", emoji: "🍽️",
    text: "Daniela oyó un ruido en la cocina. En el piso había un plato roto y huellas de leche. Debajo de la mesa, su gato Michi se lamía los bigotes blancos.",
    qs: [
      { q: "¿Quién rompió el plato?", a: "El gato Michi", d: ["Daniela", "El viento", "Un ratón"] },
      { q: "¿Por qué el gato tiene los bigotes blancos?", a: "Porque tomó leche", d: ["Porque es muy viejo", "Porque jugó con harina", "Porque tiene frío"] },
    ],
  },
];

const FABLES: Passage[] = [
  {
    title: "La liebre y la tortuga", emoji: "🐢",
    text: "Una liebre se burlaba de una tortuga por ser lenta. La tortuga la retó a una carrera. La liebre corrió tan rápido que se echó a dormir a mitad del camino. La tortuga siguió paso a paso, sin parar, y llegó primero a la meta.",
    qs: [
      { q: "¿Qué enseña esta fábula?", a: "Con constancia se llega lejos", d: ["Correr muy rápido es lo mejor", "Dormir es muy importante", "Las tortugas son veloces"] },
      { q: "¿Por qué perdió la liebre?", a: "Porque se confió y se durmió", d: ["Porque se lastimó una pata", "Porque se perdió en el bosque", "Porque la tortuga hizo trampa"] },
    ],
  },
  {
    title: "El zorro y el cóndor", emoji: "🦊",
    text: "Cuenta una leyenda andina que el zorro quiso ir a una fiesta en el cielo. El cóndor lo llevó en su lomo y le pidió que no fuera glotón. Pero el zorro comió y comió, y el cóndor se fue sin él. Al bajar por una soga, el zorro cayó y las semillas que tenía en la panza se regaron por la tierra.",
    qs: [
      { q: "¿Qué enseña esta leyenda?", a: "No hay que ser glotón", d: ["Los zorros saben volar", "Las fiestas son aburridas", "Hay que comer muy rápido"] },
      { q: "¿Por qué el cóndor se fue sin el zorro?", a: "Porque el zorro no le hizo caso", d: ["Porque tenía mucho sueño y frío", "Porque empezó a llover", "Porque se rompió la soga"] },
    ],
  },
  {
    title: "El pastor mentiroso", emoji: "🐑",
    text: "Un pastor gritaba por diversión: «¡Viene el lobo!». Los vecinos corrían a ayudarlo y él se reía. Un día el lobo llegó de verdad. El pastor gritó y gritó, pero nadie le creyó y el lobo se llevó sus ovejas.",
    qs: [
      { q: "¿Qué enseña esta fábula?", a: "Al mentiroso nadie le cree", d: ["Los lobos son amigables", "Gritar es divertido", "Las ovejas son valientes"] },
      { q: "¿Por qué nadie ayudó al pastor al final?", a: "Porque ya los había engañado", d: ["Porque estaban dormidos", "Porque vivían muy lejos de allí", "Porque le tenían miedo"] },
    ],
  },
];

// --- W. Propósito del autor ------------------------------------------------------------

const INFORM = "Para informar";
const ENTERTAIN = "Para entretener";
const PERSUADE = "Para convencer";
const purpose = (t: string, a: string): ChoiceItem => ({ t, a, d: [INFORM, ENTERTAIN, PERSUADE].filter((x) => x !== a) });

const PURPOSE: ChoiceItem[] = [
  purpose("Las tortugas marinas ponen sus huevos en la arena. Las crías nacen después de dos meses.", INFORM),
  purpose("Había una vez un sapo que quería ser cantante. Cada noche ensayaba bajo la luna.", ENTERTAIN),
  purpose("¡Prueba las galletas Crocantín! Son las más ricas. ¡Pídelas hoy mismo!", PERSUADE),
  purpose("El corazón es un músculo que bombea sangre a todo el cuerpo.", INFORM),
  purpose("Todos deberíamos sembrar un árbol. Los árboles nos dan sombra y aire limpio.", PERSUADE),
  purpose("—¿Qué le dijo un pez a otro pez? —¡Nada!", ENTERTAIN),
  purpose("El lago Titicaca está entre el Perú y Bolivia.", INFORM),
  purpose("Ven al circo Estrella. ¡No te lo puedes perder!", PERSUADE),
  purpose("El dragón Tomás tenía miedo del fuego. ¡Qué problema para un dragón!", ENTERTAIN),
];

const PERSUASIVE: Passage[] = [
  {
    title: "Más tiempo de recreo", emoji: "⚽",
    text: "Creo que el recreo debería durar más. Primero, los niños necesitamos movernos para estar sanos. Además, después de jugar prestamos más atención en clase. Por eso, pido a la directora diez minutos más de recreo.",
    qs: [
      { q: "¿Qué quiere lograr el autor?", a: "Que el recreo dure más", d: ["Que haya menos tareas", "Que cierren el colegio", "Que compren pelotas"] },
      { q: "¿Qué razón da el autor?", a: "Después de jugar se presta más atención", d: ["El recreo es muy corto en otros países", "Las clases son aburridas", "La directora juega fútbol"] },
      { q: "¿A quién le pide el cambio?", a: "A la directora", d: ["A sus padres", "Al alcalde", "A los vecinos"] },
    ],
  },
  {
    title: "Adopta una mascota", emoji: "🐕",
    text: "Si quieres una mascota, ¡adóptala! En los albergues hay muchos perros y gatos que esperan una familia. Adoptar no cuesta dinero y le das un hogar a un animal que lo necesita. Visita el albergue de tu ciudad este sábado.",
    qs: [
      { q: "¿De qué quiere convencerte el autor?", a: "De adoptar una mascota", d: ["De comprar comida para perros", "De no tener animales", "De trabajar en un albergue"] },
      { q: "¿Qué razón da el autor?", a: "Le das un hogar a un animal", d: ["Los gatos cazan ratones", "Los perros son muy caros", "El albergue cierra los sábados"] },
      { q: "¿Qué te pide hacer el autor?", a: "Visitar el albergue", d: ["Escribir una carta", "Ahorrar dinero", "Pasear a un vecino"] },
    ],
  },
  {
    title: "Apaga la luz", emoji: "💡",
    text: "Apagar la luz cuando sales de un cuarto es muy fácil y ayuda mucho. Tu familia paga menos en el recibo. Además, se gasta menos energía y eso cuida el planeta. ¡Hazlo desde hoy!",
    qs: [
      { q: "¿Qué quiere el autor que hagas?", a: "Apagar la luz al salir", d: ["Comprar más focos", "Dormir más temprano", "Estudiar a oscuras"] },
      { q: "¿Cuál es una razón que da?", a: "Se cuida el planeta", d: ["La luz hace daño a los ojos", "Los focos se rompen", "Es divertido estar a oscuras"] },
      { q: "¿Qué palabras muestran que quiere convencer?", a: "¡Hazlo desde hoy!", d: ["Un cuarto", "El recibo", "La luz"] },
    ],
  },
];

// --- X. Escenario y personajes ------------------------------------------------------------

const DESCRIBED: ChoiceItem[] = [
  { t: "Tiene el pelaje anaranjado con rayas negras y unos colmillos enormes.", a: "🐯", d: ["🦁", "🐱", "🦓"] },
  { t: "Es redonda, roja por fuera y tiene pepitas negras por dentro.", a: "🍉", d: ["🍎", "🍓", "🍒"] },
  { t: "Tiene ocho brazos largos y vive en el fondo del mar.", a: "🐙", d: ["🦀", "🐠", "🐳"] },
  { t: "Es alto, verde y está lleno de espinas.", a: "🌵", d: ["🌳", "🌻", "🌱"] },
  { t: "Tiene alas de colores y antes fue una oruga.", a: "🦋", d: ["🐝", "🐦", "🐞"] },
  { t: "Es frío, blanco y cae del cielo en las montañas.", a: "❄️", d: ["🌧️", "☀️", "🌈"] },
  { t: "Tiene cuatro ruedas, es grande y lleva a muchos pasajeros.", a: "🚌", d: ["🚲", "🚗", "✈️"] },
  { t: "Lleva una corona dorada y un largo vestido.", a: "👸", d: ["🤡", "🧑‍🚀", "🧑‍🚒"] },
];

const SETTING_CHARACTER: ChoiceItem[] = [
  { p: "¿Dónde ocurre la historia?", t: "Las olas llegaban hasta nuestros pies. Las gaviotas volaban sobre la arena caliente.", a: "🏖️", d: ["🏔️", "🏫", "🌳"] },
  { p: "¿Dónde ocurre la historia?", t: "Los árboles eran tan altos que tapaban el sol. Se oían monos y loros entre las ramas.", a: "🌴", d: ["🏜️", "🏙️", "🏠"] },
  { p: "¿Dónde ocurre la historia?", t: "Sonó la campana. Todos guardaron sus cuadernos y salieron al patio.", a: "🏫", d: ["🏥", "🏖️", "🎪"] },
  { p: "¿Quién es el personaje?", t: "Se puso el casco, subió al camión rojo y encendió la sirena.", a: "🧑‍🚒", d: ["🧑‍🍳", "🧑‍🏫", "🤡"] },
  { p: "¿Quién es el personaje?", t: "Flotaba dentro de la nave y miraba la Tierra por la ventanilla.", a: "🧑‍🚀", d: ["🧑‍⚕️", "🏴‍☠️", "🧙"] },
  { p: "¿Dónde ocurre la historia?", t: "Hacía mucho frío. Todo estaba cubierto de nieve y los pinos parecían blancos.", a: "🏔️", d: ["🏖️", "🏜️", "🌋"] },
  { p: "¿Quién es el personaje?", t: "Amasó la harina, encendió el horno y sacó el pan calientito.", a: "🧑‍🍳", d: ["🧑‍🚒", "🧑‍🚀", "🧑‍⚕️"] },
  { p: "¿Dónde ocurre la historia?", t: "Los payasos hacían reír y el trapecista volaba bajo la gran carpa.", a: "🎪", d: ["🏫", "🏥", "🏰"] },
];

const TRAITS: ChoiceItem[] = [
  { p: "¿Cómo es Camila?", t: "Camila vio a un niño nuevo solo en el recreo. Se acercó y le dijo: «¿Quieres jugar con nosotros?».", a: "Amable", d: ["Miedosa", "Presumida", "Floja"] },
  { p: "¿Cómo es Bruno?", t: "Bruno encontró una billetera en la calle. La llevó a la comisaría sin sacar ni una moneda.", a: "Honrado", d: ["Travieso", "Tímido", "Gruñón"] },
  { p: "¿Cómo es Sofía?", t: "Aunque el cerro era alto y estaba cansada, Sofía dijo: «No voy a rendirme» y siguió subiendo.", a: "Perseverante", d: ["Distraída", "Egoísta", "Perezosa"] },
  { p: "¿Cómo se siente Tomás?", t: "Tomás apretó los puños y gritó: «¡No es justo! ¡Ese juguete era mío!».", a: "Enojado", d: ["Feliz", "Asustado", "Cansado"] },
  { p: "¿Cómo es el abuelo?", t: "El abuelo repartió su pan entre todos los niños, aunque a él le quedó solo un pedacito.", a: "Generoso", d: ["Tacaño", "Mentiroso", "Miedoso"] },
  { p: "¿Cómo es Valeria?", t: "Valeria entró sola a la cueva oscura para rescatar al perrito.", a: "Valiente", d: ["Floja", "Burlona", "Olvidadiza"] },
  { p: "¿Cómo se siente Pablo?", t: "A Pablo le temblaban las piernas. «¿Y si me olvido la poesía?», susurró detrás del telón.", a: "Nervioso", d: ["Orgulloso", "Aburrido", "Enojado"] },
  { p: "¿Cómo es Rita?", t: "Rita ordenó sus lápices por colores y forró todos sus cuadernos antes del primer día de clases.", a: "Ordenada", d: ["Descuidada", "Tímida", "Glotona"] },
];

// --- Y. Secuencia ----------------------------------------------------------------------

const STORY_ORDER: OrderItem[] = [
  { read: { title: "El diente de Nico", text: "A Nico se le movía un diente. Mordió una manzana y el diente se cayó. Lo puso debajo de su almohada. Por la mañana encontró una moneda." }, seq: ["Se le mueve un diente", "Muerde una manzana", "Pone el diente bajo la almohada", "Encuentra una moneda"] },
  { read: { title: "La cometa", text: "Ana y su papá compraron papel y cañas. Armaron una cometa y la pintaron. Fueron al cerro y la hicieron volar. Al atardecer, volvieron a casa." }, seq: ["Compran papel y cañas", "Arman y pintan la cometa", "La hacen volar en el cerro", "Vuelven a casa"] },
  { read: { title: "El pastel", text: "Primero, la abuela mezcló harina, huevos y azúcar. Después metió el molde al horno. Cuando el pastel se enfrió, lo decoró con fresas. Por último, todos comieron un pedazo." }, seq: ["Mezcla los ingredientes", "Mete el molde al horno", "Decora el pastel", "Todos comen"] },
  { read: { title: "El perrito perdido", text: "Lucas oyó un llanto en el parque. Encontró un perrito mojado y lo llevó a casa. Su mamá pegó carteles en el barrio. Al día siguiente apareció la dueña." }, seq: ["Oye un llanto", "Lleva el perrito a casa", "Pegan carteles", "Aparece la dueña"] },
];

const INFO_ORDER: OrderItem[] = [
  { read: { title: "De oruga a mariposa", text: "La mariposa pone un huevo en una hoja. Del huevo sale una oruga que come mucho. Luego la oruga se envuelve en un capullo. Al final, sale convertida en mariposa." }, seq: ["Huevo", "Oruga", "Capullo", "Mariposa"] },
  { read: { title: "El ciclo del agua", text: "El sol calienta el agua del mar y la convierte en vapor. El vapor sube y forma nubes. Cuando las nubes se enfrían, cae la lluvia. El agua vuelve a los ríos y al mar." }, seq: ["El sol calienta el agua", "El vapor forma nubes", "Cae la lluvia", "El agua vuelve al mar"] },
  { read: { title: "Del trigo al pan", text: "El agricultor siembra el trigo. Cuando crece, lo cosecha. En el molino, el trigo se convierte en harina. El panadero usa la harina para hacer pan." }, seq: ["Se siembra el trigo", "Se cosecha", "Se muele para hacer harina", "Se hace el pan"] },
  { read: { title: "Cómo crece una planta", text: "Se pone una semilla en la tierra. Con agua, la semilla echa raíces. Después sale un tallo con hojas. Con el tiempo, la planta da flores." }, seq: ["Se siembra la semilla", "Salen las raíces", "Sale el tallo con hojas", "La planta da flores"] },
];

// --- Z. Trama -----------------------------------------------------------------------------

const PLOT: Passage[] = [
  {
    title: "La pelota en el árbol", emoji: "🌳",
    text: "Diego y Mía jugaban en el parque. De pronto, la pelota quedó atrapada en un árbol muy alto. Sacudieron el tronco, pero no cayó. Entonces Mía trajo la escoba de su casa y, con el palo, bajaron la pelota.",
    qs: [
      { q: "¿Quiénes son los personajes?", a: "Diego y Mía", d: ["Un árbol y una escoba", "La mamá de Mía", "Un perro y un gato"] },
      { q: "¿Dónde ocurre la historia?", a: "En el parque", d: ["En la escuela", "En la playa", "En la cocina"] },
      { q: "¿Cuál es el problema?", a: "La pelota quedó atrapada", d: ["Se rompió la escoba nueva", "Empezó a llover", "Diego se perdió"] },
      { q: "¿Cómo se resuelve?", a: "La bajan con una escoba", d: ["Compran otra pelota igual", "Trepan al árbol", "Esperan al viento"] },
    ],
  },
  {
    title: "El concurso de dibujo", emoji: "🎨",
    text: "En el salón de segundo grado había un concurso de dibujo. A Renata se le rompió su único lápiz. Estaba a punto de llorar cuando su compañero Iker le prestó uno. Renata terminó su dibujo y los dos sonrieron.",
    qs: [
      { q: "¿Dónde ocurre la historia?", a: "En el salón de clases", d: ["En un museo", "En el patio", "En una tienda de útiles"] },
      { q: "¿Cuál es el problema?", a: "A Renata se le rompió el lápiz", d: ["Renata perdió su dibujo terminado", "Iker no quiso dibujar", "Se acabó el papel"] },
      { q: "¿Cómo se resuelve?", a: "Iker le presta un lápiz", d: ["La maestra cancela el concurso", "Renata se va a casa", "Renata dibuja con el dedo"] },
    ],
  },
  {
    title: "La ovejita perdida", emoji: "🐑",
    text: "En un pueblo de la sierra, Killa cuidaba las ovejas de su abuelo. Una tarde contó y faltaba una. Buscó por el cerro hasta que oyó un balido detrás de unas rocas. La ovejita estaba atrapada entre las piedras. Killa la sacó con cuidado y volvieron juntas.",
    qs: [
      { q: "¿Quién es el personaje principal?", a: "Killa", d: ["El abuelo", "Un lobo", "Un pastor vecino"] },
      { q: "¿Dónde ocurre la historia?", a: "En un pueblo de la sierra", d: ["En una ciudad grande y ruidosa", "En una isla", "En la selva"] },
      { q: "¿Cuál es el problema?", a: "Faltaba una oveja", d: ["Se enfermó el abuelo", "Llovió toda la tarde", "Killa se quedó dormida"] },
      { q: "¿Cómo se resuelve?", a: "Killa la encuentra y la saca", d: ["El abuelo compra otra oveja", "La oveja vuelve sola", "Un vecino la trae"] },
    ],
  },
];

// --- AA. Causa y efecto ------------------------------------------------------------------

const EFFECT_TO_CAUSE: ChoiceItem[] = [
  { p: "¿Cuál es la causa?", t: "Efecto: El piso de la cocina está mojado.", a: "Se derramó un vaso de agua.", d: ["La mesa es de madera.", "El gato duerme.", "Es lunes."] },
  { p: "¿Cuál es la causa?", t: "Efecto: Marta llegó tarde a la escuela.", a: "Se quedó dormida.", d: ["Le gusta leer.", "Tiene una mochila azul.", "Su maestra es amable."] },
  { p: "¿Cuál es la causa?", t: "Efecto: Las plantas del jardín se secaron.", a: "Nadie las regó.", d: ["Tenían flores rojas.", "Estaban en macetas.", "Era domingo."] },
  { p: "¿Cuál es la causa?", t: "Efecto: A Paco le duele la barriga.", a: "Comió demasiados dulces.", d: ["Se puso un polo nuevo.", "Leyó un cuento.", "Saludó a su tío."] },
  { p: "¿Cuál es la causa?", t: "Efecto: El helado se derritió.", a: "Lo dejaron al sol.", d: ["Era de chocolate.", "Costó dos soles.", "Tenía una galleta."] },
  { p: "¿Cuál es la causa?", t: "Efecto: La calle está llena de charcos.", a: "Llovió toda la noche.", d: ["Pasó un camión.", "Hay muchas casas.", "Es una calle larga."] },
  { p: "¿Cuál es la causa?", t: "Efecto: Sonó la alarma de humo.", a: "Se quemó la comida.", d: ["Alguien tocó el timbre.", "Se abrió la ventana.", "Cantó un pájaro."] },
  { p: "¿Cuál es la causa?", t: "Efecto: El equipo saltó de alegría.", a: "Metieron un gol.", d: ["Empezó el partido.", "Se pusieron las medias.", "El árbitro llegó."] },
];

const CAUSE_TO_EFFECT: ChoiceItem[] = [
  { p: "¿Cuál es el efecto?", t: "Causa: Se fue la luz en toda la casa.", a: "Encendimos unas velas.", d: ["Regamos las plantas.", "Fuimos al mercado.", "Lavamos el carro."] },
  { p: "¿Cuál es el efecto?", t: "Causa: Julia estudió mucho para el examen.", a: "Sacó una buena nota.", d: ["Perdió su lápiz.", "Se mojó los zapatos.", "Llegó tarde."] },
  { p: "¿Cuál es el efecto?", t: "Causa: Hizo mucho frío en la mañana.", a: "Me puse una chompa.", d: ["Comí un helado de fresa.", "Fui a la playa.", "Abrí la ventana."] },
  { p: "¿Cuál es el efecto?", t: "Causa: El perro tenía hambre.", a: "Se comió todo su plato.", d: ["Se puso a volar.", "Leyó un libro.", "Pintó la pared de azul."] },
  { p: "¿Cuál es el efecto?", t: "Causa: Olvidé mi paraguas y llovió.", a: "Llegué mojado a casa.", d: ["Me quemé con el sol.", "Encontré una moneda.", "Me dio mucho sueño."] },
  { p: "¿Cuál es el efecto?", t: "Causa: El niño se cepilla los dientes todos los días.", a: "Tiene los dientes sanos.", d: ["Le crece el pelo.", "Corre mucho más rápido.", "Sabe nadar."] },
  { p: "¿Cuál es el efecto?", t: "Causa: Se pinchó la llanta de la bicicleta.", a: "Tuve que caminar.", d: ["Gané la carrera.", "Me compré un helado.", "Vi una película."] },
  { p: "¿Cuál es el efecto?", t: "Causa: Sembramos semillas y las regamos.", a: "Crecieron unas plantitas.", d: ["Se secó el río.", "Cayó nieve.", "Se rompió la pala del jardín."] },
];

// --- BB. Comparar y contrastar -------------------------------------------------------------

const COMPARE: Passage[] = [
  {
    title: "Ranas y sapos", emoji: "🐸",
    text: "Las ranas y los sapos son anfibios y los dos nacen de huevos en el agua. Las ranas tienen la piel lisa y húmeda, y dan saltos largos. Los sapos tienen la piel seca y rugosa, y dan saltos cortos.",
    qs: [
      { q: "¿En qué se parecen las ranas y los sapos?", a: "Los dos son anfibios", d: ["Los dos tienen piel seca", "Los dos dan saltos largos", "Los dos viven en árboles"] },
      { q: "¿En qué se diferencian?", a: "En la piel", d: ["En que nacen de huevos", "En que son anfibios", "En que tienen ojos"] },
      { q: "¿Quién da saltos largos?", a: "La rana", d: ["El sapo", "Los dos", "Ninguno"] },
    ],
  },
  {
    title: "La costa y la sierra", emoji: "⛰️",
    text: "En el Perú, la costa está junto al mar y casi no llueve. La sierra tiene montañas altas y hace más frío. En las dos regiones hay ciudades, colegios y mercados. En la costa se pesca mucho; en la sierra se siembra papa.",
    qs: [
      { q: "¿En qué se parecen la costa y la sierra?", a: "En las dos hay ciudades", d: ["En las dos hace frío", "Las dos están junto al mar", "En las dos nieva"] },
      { q: "¿En qué se diferencian?", a: "En el clima", d: ["En que hay colegios", "En que hay mercados", "En que hay personas"] },
      { q: "¿Dónde se siembra papa?", a: "En la sierra", d: ["En la costa", "En el mar", "En las dos"] },
    ],
  },
  {
    title: "Bicicleta y patineta", emoji: "🚲",
    text: "La bicicleta y la patineta sirven para pasear y hacer ejercicio. La bicicleta tiene dos ruedas grandes, un timón y pedales. La patineta tiene cuatro ruedas pequeñas y se empuja con un pie. Para usar las dos se necesita casco.",
    qs: [
      { q: "¿En qué se parecen?", a: "Las dos sirven para pasear", d: ["Las dos tienen pedales", "Las dos tienen timón", "Las dos tienen dos ruedas"] },
      { q: "¿Qué tiene la bicicleta que no tiene la patineta?", a: "Pedales", d: ["Ruedas", "Casco", "Color"] },
      { q: "¿Qué se necesita para usar las dos?", a: "Un casco", d: ["Un motor", "Una llave", "Un remo"] },
    ],
  },
];

// --- CC. Partes del texto ------------------------------------------------------------------

const TEXT_FEATURES: ChoiceItem[] = [
  { p: "¿Dónde buscas en qué página empieza cada capítulo?", a: "En el índice", d: ["En la portada", "En el glosario", "En un pie de foto"] },
  { p: "¿Dónde buscas el significado de una palabra difícil del libro?", a: "En el glosario", d: ["En el índice", "En el título", "En la portada"] },
  { p: "¿Qué te dice de qué trata una sección?", a: "El subtítulo", d: ["El número de página", "El punto final", "El color del papel"] },
  { p: "¿Qué explica lo que se ve en una foto?", a: "El pie de foto", d: ["El índice", "El glosario", "La contraportada"] },
  { p: "¿Para qué se ponen algunas palabras en negrita?", a: "Para mostrar que son importantes", d: ["Para que ocupen más", "Porque están mal escritas", "Para adornar la hoja"] },
  { p: "¿Dónde encuentras el título y el nombre del autor?", a: "En la portada", d: ["En el glosario", "En un gráfico", "En el índice"] },
  { p: "¿Qué muestra datos con barras o dibujos?", a: "Un gráfico", d: ["Un subtítulo", "Una portada", "Un glosario"] },
  { p: "¿Qué te ayuda a ver dónde queda un lugar?", a: "Un mapa", d: ["Un índice", "Una negrita", "Un título"] },
];

// --- DD. Lecturas literarias en voz alta ------------------------------------------------------

const LIT_ALOUD: Record<string, Passage[]> = {
  realista: [
    {
      title: "El primer día de Alonso", emoji: "🏫",
      text: "Alonso se mudó de Piura a Lima y hoy empieza en un colegio nuevo. No conoce a nadie. En el recreo se sienta solo con su lonchera. Una niña llamada Abril se acerca: «¿Te gustan las canicas?». Alonso saca de su bolsillo su canica de la suerte. Al final del recreo ya tiene tres amigos.",
      qs: [
        { q: "¿Por qué Alonso no conoce a nadie?", a: "Porque es nuevo en el colegio", d: ["Porque llegó tarde", "Porque no quiere hablar con nadie", "Porque es muy pequeño"] },
        { q: "¿Qué le pregunta Abril?", a: "Si le gustan las canicas", d: ["De qué ciudad viene él", "Cómo se llama", "Si tiene hambre"] },
        { q: "¿Cómo termina el recreo?", a: "Alonso tiene amigos", d: ["Alonso pierde su canica", "Alonso se va a casa", "Abril se enoja"] },
      ],
    },
    {
      title: "La abuela aprende", emoji: "📱",
      text: "La abuela Carmen recibió un celular por su cumpleaños. No sabía ni encenderlo. Su nieta Fabiana le enseñó con paciencia: primero a llamar, luego a mandar fotos. Hoy la abuela le envía cada mañana una foto de sus plantas con un mensaje: «Buenos días, mi maestra».",
      qs: [
        { q: "¿Qué recibió la abuela?", a: "Un celular", d: ["Una planta", "Una cámara", "Un televisor"] },
        { q: "¿Quién le enseñó a usarlo?", a: "Su nieta Fabiana", d: ["Su vecino", "Un vendedor amable", "Su hijo"] },
        { q: "¿Por qué la abuela llama «maestra» a Fabiana?", a: "Porque Fabiana le enseñó", d: ["Porque trabaja en un colegio", "Porque es muy alta", "Porque le pone notas"] },
      ],
    },
    {
      title: "La alcancía", emoji: "🐷",
      text: "Emilia quería unos patines. Su mamá le dijo que ahorrara. Cada semana guardó su propina en una alcancía con forma de chanchito. Dejó de comprar figuritas y dulces. Después de cuatro meses rompió la alcancía: ¡le alcanzaba! Emilia dijo que esos patines eran los más bonitos del mundo.",
      qs: [
        { q: "¿Qué quería Emilia?", a: "Unos patines", d: ["Una bicicleta", "Una muñeca", "Un chanchito"] },
        { q: "¿Cómo consiguió el dinero?", a: "Ahorró su propina", d: ["Se lo regaló su tía", "Vendió sus juguetes", "Lo encontró en la calle"] },
        { q: "¿Por qué le parecieron los más bonitos?", a: "Porque los compró con su esfuerzo", d: ["Porque eran de oro", "Porque eran los únicos de la tienda", "Porque eran muy grandes"] },
      ],
    },
  ],
  fantasia: [
    {
      title: "La nube que no quería llover", emoji: "☁️",
      text: "Había una nube llamada Pompón que no quería llover. «Si suelto mi agua, me haré pequeña», decía. Abajo, las flores se marchitaban. Un día Pompón oyó llorar a un girasol. Sintió pena y dejó caer toda su lluvia. Se hizo chiquita, pero el campo se llenó de colores y el sol le regaló un arcoíris.",
      qs: [
        { q: "¿Por qué Pompón no quería llover?", a: "Porque se haría pequeña", d: ["Porque tenía frío", "Porque estaba dormida", "Porque no tenía agua"] },
        { q: "¿Qué la hizo cambiar?", a: "Oyó llorar a un girasol", d: ["La empujó un viento fuerte", "Se lo pidió el sol", "La asustó un trueno"] },
        { q: "¿Qué pasó después de la lluvia?", a: "El campo se llenó de colores", d: ["La nube creció más", "Las flores se secaron", "El sol se escondió"] },
      ],
    },
    {
      title: "El dragón que estornudaba", emoji: "🐉",
      text: "Fuego era un dragón con un problema: cada vez que estornudaba, quemaba algo. Quemó su cama, su sopa y la cola de su gato. Los vecinos le tenían miedo. Una noche de invierno se apagaron todas las chimeneas del pueblo. Fuego estornudó en cada casa y las encendió. Desde entonces, todos lo invitan a cenar.",
      qs: [
        { q: "¿Qué problema tenía Fuego?", a: "Quemaba cosas al estornudar", d: ["No sabía volar", "Tenía miedo del agua", "No tenía amigos dragones"] },
        { q: "¿Cómo ayudó al pueblo?", a: "Encendió las chimeneas", d: ["Apagó un incendio", "Cocinó la cena", "Espantó a todos los lobos"] },
        { q: "¿Cómo lo tratan ahora los vecinos?", a: "Lo invitan a cenar", d: ["Le tienen miedo", "Lo echan del pueblo", "Le tiran agua"] },
      ],
    },
    {
      title: "Los zapatos mágicos", emoji: "👟",
      text: "Nayra encontró unos zapatos viejos en el desván. Al ponérselos, sus pies empezaron a bailar solos. Bailó en la sala, en la calle y en la plaza. La gente dejaba sus tristezas y se ponía a bailar con ella. Cuando Nayra se quitó los zapatos, descubrió que ya sabía bailar sin magia.",
      qs: [
        { q: "¿Dónde encontró Nayra los zapatos?", a: "En el desván", d: ["En una tienda", "En la plaza", "En el río"] },
        { q: "¿Qué hacían los zapatos?", a: "Hacían bailar a sus pies", d: ["La hacían volar", "La volvían invisible un rato", "La hacían correr"] },
        { q: "¿Qué descubrió Nayra al final?", a: "Que ya sabía bailar sola", d: ["Que los zapatos eran nuevos", "Que la magia era mala", "Que perdió un zapato"] },
      ],
    },
  ],
  historica: [
    {
      title: "El pequeño chasqui", emoji: "🏃",
      text: "Hace más de quinientos años, en el imperio inca, vivía un niño llamado Yaku. Su papá era chasqui: corría por los caminos de piedra llevando mensajes en un quipu, unas cuerdas con nudos. Un día su papá se torció el pie. Yaku tomó el quipu y corrió hasta el siguiente puesto. El mensaje llegó a tiempo al Cusco.",
      qs: [
        { q: "¿Cuándo ocurre esta historia?", a: "Hace más de quinientos años", d: ["La semana pasada", "En el futuro", "Hace diez años"] },
        { q: "¿Qué era un chasqui?", a: "Un mensajero que corría", d: ["Un soldado a caballo", "Un pescador", "Un tejedor"] },
        { q: "¿Qué hizo Yaku cuando su papá se lastimó?", a: "Llevó él mismo el mensaje", d: ["Volvió a casa", "Escondió el quipu", "Pidió un caballo"] },
      ],
    },
    {
      title: "El día de la bandera", emoji: "🇵🇪",
      text: "Era julio de 1821 en Lima. Manuela, de ocho años, ayudaba a su mamá a coser una tela roja y blanca. En la plaza había muchísima gente. Un general llamado José de San Martín levantó la bandera y proclamó la independencia del Perú. Manuela agitó su banderita y gritó con todos: «¡Viva el Perú!».",
      qs: [
        { q: "¿En qué año ocurre la historia?", a: "En 1821", d: ["En 2021", "En 1500", "En 1990"] },
        { q: "¿Qué cosían Manuela y su mamá?", a: "Una tela roja y blanca", d: ["Un vestido azul", "Una manta de lana", "Un sombrero"] },
        { q: "¿Qué proclamó San Martín?", a: "La independencia del Perú", d: ["El inicio de las clases", "Una fiesta de cumpleaños", "La llegada de un barco"] },
      ],
    },
    {
      title: "El caballito de totora", emoji: "🌊",
      text: "Hace muchísimo tiempo, en la costa norte del Perú, un niño llamado Chimo miraba a su abuelo amarrar tallos de totora. Con ellos hacía una balsa angosta, como un caballito. Al amanecer, el abuelo entraba al mar montado en su balsa y volvía con pescado. Chimo soñaba con remar algún día sobre las olas.",
      qs: [
        { q: "¿De qué estaba hecha la balsa?", a: "De totora", d: ["De hierro", "De plástico", "De piedra"] },
        { q: "¿Para qué usaba el abuelo la balsa?", a: "Para pescar", d: ["Para viajar a otra ciudad", "Para dormir", "Para llevar turistas"] },
        { q: "¿Qué soñaba Chimo?", a: "Remar sobre las olas", d: ["Volar en avión", "Vivir en la montaña", "Vender pescado"] },
      ],
    },
  ],
};

// --- EE. Lecturas literarias ----------------------------------------------------------------

const LIT_ALONE: Record<string, Passage[]> = {
  animales: [
    {
      title: "La alpaca presumida", emoji: "🦙",
      text: "Pacha era una alpaca con la lana más suave del cerro. No dejaba que nadie la tocara. Llegó el invierno y un cuy tiritaba de frío. Pacha dudó, pero al final lo dejó acurrucarse en su lana. Esa noche descubrió que compartir abriga más que presumir.",
      qs: [
        { q: "¿Cómo era la lana de Pacha?", a: "Muy suave", d: ["Áspera", "Corta", "Mojada"] },
        { q: "¿Quién tenía frío?", a: "Un cuy", d: ["Un cóndor", "Un zorro", "Un pato"] },
        { q: "¿Qué aprendió Pacha?", a: "Que compartir es mejor", d: ["Que el invierno es corto", "Que los cuyes muerden", "Que su lana es fea"] },
      ],
    },
    {
      title: "El ratón inventor", emoji: "🐭",
      text: "El ratón Tuerca vivía en un taller. Con tapas, palitos y un resorte armó un carrito. Quería cruzar la sala sin que lo viera el gato. El carrito salió disparado, chocó con una maceta y despertó al gato. Tuerca corrió a su agujero y se puso a diseñar un carrito con frenos.",
      qs: [
        { q: "¿Qué armó Tuerca?", a: "Un carrito", d: ["Un avión", "Una trampa", "Una casa"] },
        { q: "¿Qué salió mal?", a: "El carrito chocó y despertó al gato", d: ["El carrito no arrancó", "El resorte se perdió", "Se acabó el queso"] },
        { q: "¿Qué hará ahora Tuerca?", a: "Un carrito con frenos", d: ["Mudarse de casa", "Hacerse amigo del gato", "Dormir todo el día"] },
      ],
    },
    {
      title: "La tortuga viajera", emoji: "🐢",
      text: "La tortuga Lola quería conocer el mar. Los demás animales se rieron: «¡Tardarás un año!». Lola caminó un poquito cada día. Vio ríos, cerros y pueblos. Cuando por fin llegó a la playa, tenía más historias que contar que cualquiera de los que se quedaron.",
      qs: [
        { q: "¿Qué quería Lola?", a: "Conocer el mar", d: ["Ganar una carrera", "Subir a un árbol", "Encontrar comida"] },
        { q: "¿Por qué se rieron los demás?", a: "Porque Lola es lenta", d: ["Porque no sabe nadar", "Porque es muy pequeña", "Porque tiene miedo"] },
        { q: "¿Qué ganó Lola con su viaje?", a: "Muchas historias", d: ["Una medalla", "Una casa nueva", "Un caparazón más grande"] },
      ],
    },
  ],
  realista: [
    {
      title: "El huerto del salón", emoji: "🌱",
      text: "La maestra Rosa trajo semillas de rabanito. Cada niño sembró la suya en un vaso. Thiago regaba la suya todos los días, pero no salía nada. Quiso tirarla. La maestra le pidió esperar una semana más. El lunes siguiente, un brote verde asomaba en su vaso.",
      qs: [
        { q: "¿Qué sembraron los niños?", a: "Semillas de rabanito", d: ["Semillas de girasol", "Frijoles", "Flores"] },
        { q: "¿Por qué Thiago quiso tirar su vaso?", a: "Porque no salía nada", d: ["Porque se rompió", "Porque olía mal", "Porque tenía bichos"] },
        { q: "¿Qué enseña el cuento?", a: "A tener paciencia", d: ["A regar menos", "A sembrar en el patio", "A cambiar de semilla"] },
      ],
    },
    {
      title: "El hermano menor", emoji: "👶",
      text: "Desde que nació Gael, todos miran solo al bebé. Ximena se siente invisible. Una tarde Gael llora y nadie logra calmarlo. Ximena le canta la canción del elefante y Gael se ríe. «Solo tú sabes hacerlo reír», le dice su papá. Ximena ya no se siente invisible.",
      qs: [
        { q: "¿Cómo se siente Ximena al principio?", a: "Invisible", d: ["Muy feliz", "Asustada", "Cansada"] },
        { q: "¿Cómo calma Ximena a Gael?", a: "Le canta una canción", d: ["Le da un juguete", "Lo saca a pasear", "Le cuenta un cuento"] },
        { q: "¿Por qué cambia lo que siente Ximena?", a: "Porque se da cuenta de que es importante", d: ["Porque le compran un regalo", "Porque el bebé se va", "Porque ya no hay ruido"] },
      ],
    },
    {
      title: "El partido", emoji: "⚽",
      text: "El equipo de Benja iba perdiendo dos a cero. En el segundo tiempo, Benja tuvo el arco libre, pero vio a Dana mejor ubicada y le pasó la pelota. ¡Gol! Luego metieron otro. Empataron. El entrenador dijo: «Hoy no ganamos, pero jugamos como un equipo».",
      qs: [
        { q: "¿Cómo iba el partido al comienzo?", a: "Perdían dos a cero", d: ["Ganaban uno a cero", "Iban empatados", "No había empezado"] },
        { q: "¿Qué hizo Benja?", a: "Le pasó la pelota a Dana", d: ["Pateó muy lejos", "Se fue de la cancha", "Atajó un penal"] },
        { q: "¿Por qué está contento el entrenador?", a: "Porque jugaron como equipo", d: ["Porque ganaron el campeonato", "Porque terminó temprano", "Porque no llovió"] },
      ],
    },
  ],
  ficcion: [
    {
      title: "Mi amigo Bip", emoji: "🤖",
      text: "En el año 2090, Izan recibió un robot llamado Bip. Bip sabía sumar, cocinar y ordenar el cuarto, pero no sabía jugar. Izan le enseñó las escondidas. Bip siempre se escondía detrás de la cortina y sus luces lo delataban. Los dos se reían tanto que a Bip le saltaban chispas.",
      qs: [
        { q: "¿Cuándo ocurre la historia?", a: "En el futuro", d: ["Hace mil años", "En la época inca", "Ayer"] },
        { q: "¿Qué no sabía hacer Bip?", a: "Jugar", d: ["Sumar", "Cocinar", "Ordenar"] },
        { q: "¿Por qué lo encontraban siempre?", a: "Por sus luces", d: ["Porque hacía ruido", "Porque era muy grande", "Porque hablaba"] },
      ],
    },
    {
      title: "Vacaciones en Marte", emoji: "🚀",
      text: "La familia Quispe viajó a Marte en una nave. El viaje duró muchos meses. En Marte todo era rojo y había que usar traje espacial para salir. Killari saltaba muy alto porque allí pesa menos. Lo que más extrañó fue el olor de la lluvia de su pueblo.",
      qs: [
        { q: "¿A dónde viajó la familia?", a: "A Marte", d: ["A la Luna", "A la selva", "Al fondo del mar"] },
        { q: "¿Por qué Killari saltaba muy alto?", a: "Porque allí pesa menos", d: ["Porque tenía zapatos con resortes", "Porque era muy fuerte", "Porque había viento"] },
        { q: "¿Qué extrañó más?", a: "El olor de la lluvia", d: ["Su televisor", "Sus juguetes", "El ruido de los carros"] },
      ],
    },
    {
      title: "La escuela flotante", emoji: "🛸",
      text: "En el futuro, la escuela de Aymara flota sobre el lago. Los alumnos llegan en botes solares. Las pizarras son de luz y los libros hablan. Pero un día se va la energía y nada funciona. La maestra saca tizas y un libro de papel. Los niños descubren que así también se aprende.",
      qs: [
        { q: "¿Dónde está la escuela?", a: "Flotando sobre un lago", d: ["En una montaña", "Bajo la tierra", "En un avión"] },
        { q: "¿Qué problema ocurre?", a: "Se va la energía", d: ["Se hunde la escuela", "Faltan los alumnos", "Se pierde un bote"] },
        { q: "¿Qué descubren los niños?", a: "Que con tiza y papel también se aprende", d: ["Que los botes son lentos", "Que el lago es frío", "Que no les gusta leer"] },
      ],
    },
  ],
};

// --- FF. Textos informativos en voz alta ------------------------------------------------------

const INFO_ALOUD: Record<string, Passage[]> = {
  ciencia: [
    {
      title: "Los volcanes", emoji: "🌋",
      text: "Un volcán es una abertura en la Tierra por donde sale roca derretida. Debajo del suelo esa roca se llama magma. Cuando sale se llama lava y es muy caliente. Al enfriarse, la lava se vuelve piedra. En el Perú hay volcanes como el Misti, cerca de Arequipa.",
      qs: [
        { q: "¿Qué sale por un volcán?", a: "Roca derretida", d: ["Agua helada", "Arena fina", "Aire frío"] },
        { q: "¿Cómo se llama la roca derretida cuando sale?", a: "Lava", d: ["Magma", "Ceniza", "Barro"] },
        { q: "¿Qué pasa cuando la lava se enfría?", a: "Se vuelve piedra", d: ["Se vuelve agua", "Desaparece", "Se vuelve fuego"] },
      ],
    },
    {
      title: "¿Por qué hay día y noche?", emoji: "🌍",
      text: "La Tierra gira sobre sí misma como un trompo. Da una vuelta completa cada veinticuatro horas. En la parte que mira al Sol es de día. En la parte que queda del otro lado es de noche. Por eso, cuando en el Perú es de día, en Japón es de noche.",
      qs: [
        { q: "¿Por qué hay día y noche?", a: "Porque la Tierra gira", d: ["Porque el Sol se apaga", "Porque la Luna tapa el Sol", "Porque las nubes cubren el cielo"] },
        { q: "¿Cuánto tarda la Tierra en dar una vuelta?", a: "Veinticuatro horas", d: ["Una semana", "Un año", "Una hora"] },
        { q: "¿Dónde es de día?", a: "En la parte que mira al Sol", d: ["En toda la Tierra a la vez", "Solo en el mar", "Solo en las montañas"] },
      ],
    },
    {
      title: "Las plantas respiran", emoji: "🌿",
      text: "Las plantas fabrican su propio alimento. Para hacerlo necesitan agua, aire y la luz del sol. Sus hojas atrapan la luz. Mientras fabrican su alimento, sueltan oxígeno, el gas que respiramos. Por eso los bosques son tan importantes para todos los seres vivos.",
      qs: [
        { q: "¿Qué necesitan las plantas para hacer su alimento?", a: "Agua, aire y luz", d: ["Tierra y piedras", "Leche y pan", "Solo agua"] },
        { q: "¿Qué parte de la planta atrapa la luz?", a: "Las hojas", d: ["Las raíces", "Las semillas", "Las espinas"] },
        { q: "¿Por qué son importantes los bosques?", a: "Porque dan oxígeno", d: ["Porque dan sombra a las casas", "Porque guardan agua salada", "Porque hacen ruido"] },
      ],
    },
  ],
  famosos: [
    {
      title: "María Reiche", emoji: "🧹",
      text: "María Reiche nació en Alemania, pero vivió casi toda su vida en el Perú. Estudió las líneas de Nazca, unas figuras enormes dibujadas en el desierto. Las medía y las limpiaba con escobas para que no se borraran. Gracias a ella, hoy esas líneas están protegidas.",
      qs: [
        { q: "¿Dónde nació María Reiche?", a: "En Alemania", d: ["En el Perú", "En México", "En España"] },
        { q: "¿Qué estudió?", a: "Las líneas de Nazca", d: ["Los volcanes", "Las estrellas", "Los ríos"] },
        { q: "¿Para qué usaba escobas?", a: "Para limpiar las líneas", d: ["Para barrer su casa", "Para pintar las figuras", "Para espantar animales"] },
      ],
    },
    {
      title: "Marie Curie", emoji: "🔬",
      text: "Marie Curie fue una científica que nació en Polonia. De niña le encantaba aprender. En su época, pocas mujeres podían estudiar ciencias, pero ella no se rindió. Descubrió dos elementos nuevos y ganó dos premios Nobel. Sus descubrimientos ayudan hoy a los médicos.",
      qs: [
        { q: "¿Qué era Marie Curie?", a: "Científica", d: ["Pintora", "Cantante", "Deportista"] },
        { q: "¿Cuántos premios Nobel ganó?", a: "Dos", d: ["Ninguno", "Uno", "Diez"] },
        { q: "¿Qué dificultad tuvo?", a: "Pocas mujeres podían estudiar ciencias", d: ["No le gustaba leer", "Vivía en una isla lejana", "No sabía sumar ni restar"] },
      ],
    },
    {
      title: "Jane Goodall", emoji: "🐒",
      text: "Jane Goodall soñaba desde niña con vivir entre animales. De joven viajó a África para estudiar a los chimpancés. Los observó con paciencia durante muchos años. Descubrió que usan palitos como herramientas para sacar insectos. Hoy enseña a cuidar la naturaleza.",
      qs: [
        { q: "¿Qué animales estudió Jane Goodall?", a: "Los chimpancés", d: ["Los leones", "Las ballenas", "Los pingüinos"] },
        { q: "¿Qué descubrió?", a: "Que usan herramientas", d: ["Que saben nadar", "Que duermen de pie", "Que comen piedras"] },
        { q: "¿Dónde los estudió?", a: "En África", d: ["En Europa", "En el Polo Sur", "En su casa"] },
      ],
    },
  ],
  arte: [
    {
      title: "El cajón peruano", emoji: "🥁",
      text: "El cajón es un instrumento musical que nació en el Perú. Es una caja de madera. El músico se sienta encima y la golpea con las manos. Según dónde golpee, el sonido es grave o agudo. El cajón acompaña la música criolla y hoy se toca en muchos países.",
      qs: [
        { q: "¿De qué está hecho el cajón?", a: "De madera", d: ["De metal", "De cuero", "De barro"] },
        { q: "¿Cómo se toca?", a: "Se golpea con las manos", d: ["Se sopla", "Se rasga con una púa", "Se toca con un arco"] },
        { q: "¿Dónde se sienta el músico?", a: "Encima del cajón", d: ["En el suelo", "En una silla alta", "Detrás del telón"] },
      ],
    },
    {
      title: "El Inti Raymi", emoji: "☀️",
      text: "El Inti Raymi es la fiesta del Sol. Los incas la celebraban para agradecer las cosechas. Hoy se recuerda cada 24 de junio en el Cusco. Cientos de personas se visten con trajes de colores, bailan y cantan en quechua. Vienen visitantes de todo el mundo.",
      qs: [
        { q: "¿A quién celebra el Inti Raymi?", a: "Al Sol", d: ["A la Luna", "Al mar", "A la lluvia"] },
        { q: "¿Cuándo se celebra?", a: "El 24 de junio", d: ["El 28 de julio", "El 1 de enero", "El 25 de diciembre"] },
        { q: "¿En qué ciudad se celebra?", a: "En el Cusco", d: ["En Lima", "En Iquitos", "En Tacna"] },
      ],
    },
    {
      title: "Los retablos", emoji: "🎨",
      text: "El retablo es una caja de madera con puertitas. Dentro tiene figuras pequeñas que muestran fiestas, mercados o cosechas. Los artesanos de Ayacucho hacen las figuras con una masa de papa y yeso, y las pintan de muchos colores. Cada retablo cuenta una historia.",
      qs: [
        { q: "¿Qué es un retablo?", a: "Una caja de madera con figuras", d: ["Una manta de lana", "Un instrumento musical", "Un plato de comida"] },
        { q: "¿Dónde se hacen muchos retablos?", a: "En Ayacucho", d: ["En Lima", "En Piura", "En Loreto"] },
        { q: "¿Qué muestran las figuras?", a: "Fiestas, mercados o cosechas", d: ["Solo animales del mar", "Letras y números", "Planetas"] },
      ],
    },
  ],
  negocios: [
    {
      title: "La panadería", emoji: "🥖",
      text: "El panadero se levanta de madrugada. Compra harina, levadura y sal. Con eso amasa y hornea el pan. Luego lo vende a sus vecinos. Con el dinero que gana paga los ingredientes, la luz y a sus ayudantes. Lo que sobra es su ganancia.",
      qs: [
        { q: "¿Qué compra el panadero?", a: "Harina, levadura y sal", d: ["Leche y frutas", "Madera, clavos y pintura", "Telas y botones"] },
        { q: "¿Qué hace con el dinero que gana?", a: "Paga sus gastos", d: ["Lo tira", "Lo esconde todo", "Lo regala todo"] },
        { q: "¿Qué es la ganancia?", a: "Lo que sobra después de pagar", d: ["El precio del pan", "La harina que queda en el saco", "El horno"] },
      ],
    },
    {
      title: "¿Qué es ahorrar?", emoji: "🪙",
      text: "Ahorrar es guardar una parte de tu dinero en lugar de gastarlo todo. Puedes ahorrar en una alcancía o en un banco. Si ahorras un poco cada semana, con el tiempo podrás comprar algo que cuesta más. Ahorrar también sirve para las emergencias.",
      qs: [
        { q: "¿Qué es ahorrar?", a: "Guardar parte del dinero", d: ["Gastar todo el dinero", "Pedir dinero prestado", "Regalar monedas"] },
        { q: "¿Dónde se puede ahorrar?", a: "En una alcancía o un banco", d: ["En una tienda o en un mercado", "En la feria", "En la calle"] },
        { q: "¿Para qué sirve ahorrar?", a: "Para comprar algo más caro después", d: ["Para tener cada vez menos dinero", "Para no ir al colegio", "Para comer más"] },
      ],
    },
    {
      title: "Los robots", emoji: "🤖",
      text: "Un robot es una máquina que sigue instrucciones. Las personas escriben esas instrucciones en un programa. Hay robots que arman carros en las fábricas y otros que limpian el piso. Algunos exploran lugares peligrosos, como el fondo del mar o el planeta Marte.",
      qs: [
        { q: "¿Qué es un robot?", a: "Una máquina que sigue instrucciones", d: ["Un animal de metal", "Un juguete sin pilas", "Una persona disfrazada de máquina"] },
        { q: "¿Quién escribe las instrucciones?", a: "Las personas", d: ["Otros robots siempre", "Los animales", "Nadie"] },
        { q: "¿Para qué sirven los robots exploradores?", a: "Para ir a lugares peligrosos", d: ["Para cocinar comida muy rica", "Para cantar", "Para dormir"] },
      ],
    },
  ],
};

// --- GG. Textos informativos --------------------------------------------------------------------

const INFO_ALONE: Record<string, Passage[]> = {
  animales: [
    {
      title: "El cóndor andino", emoji: "🦅",
      text: "El cóndor andino es una de las aves voladoras más grandes del mundo. Con las alas abiertas mide más de tres metros. Casi no aletea: planea usando el viento de las montañas. Se alimenta de animales muertos, y así ayuda a limpiar la naturaleza.",
      qs: [
        { q: "¿Cuánto miden sus alas abiertas?", a: "Más de tres metros", d: ["Medio metro", "Más de diez metros", "Un metro"] },
        { q: "¿Cómo vuela el cóndor?", a: "Planea con el viento", d: ["Aletea sin descansar", "Da saltos", "No puede volar"] },
        { q: "¿De qué se alimenta?", a: "De animales muertos", d: ["De frutas", "De semillas", "De peces vivos del río"] },
      ],
    },
    {
      title: "El delfín rosado", emoji: "🐬",
      text: "En los ríos de la Amazonía vive un delfín de color rosado. No vive en el mar, sino en agua dulce. Tiene el hocico largo para atrapar peces entre las raíces. Como el agua es turbia, se guía por sonidos. Está en peligro y hay que protegerlo.",
      qs: [
        { q: "¿Dónde vive el delfín rosado?", a: "En los ríos de la Amazonía", d: ["En el mar", "En un lago de la sierra", "En el desierto"] },
        { q: "¿Cómo se guía en el agua turbia?", a: "Por sonidos", d: ["Por el olfato", "Con una linterna", "Por el color"] },
        { q: "¿Para qué le sirve el hocico largo?", a: "Para atrapar peces", d: ["Para respirar", "Para nadar rápido", "Para cantar"] },
      ],
    },
    {
      title: "La vicuña", emoji: "🦙",
      text: "La vicuña vive en las alturas de los Andes. Es pariente de la llama y de la alpaca, pero es más pequeña y delgada. Su lana es finísima y muy valiosa. En el Perú se la esquila en una fiesta llamada chaccu y luego se la deja libre. La vicuña aparece en el escudo del Perú.",
      qs: [
        { q: "¿Dónde vive la vicuña?", a: "En las alturas de los Andes", d: ["En la selva", "En la playa", "En el desierto de la costa"] },
        { q: "¿Cómo es su lana?", a: "Finísima y valiosa", d: ["Gruesa y muy barata", "Dura y negra", "No tiene lana"] },
        { q: "¿Dónde aparece la vicuña?", a: "En el escudo del Perú", d: ["En las monedas de otros países", "En la bandera de Chile", "En ningún símbolo"] },
      ],
    },
  ],
  deportes: [
    {
      title: "El ajedrez", emoji: "♟️",
      text: "El ajedrez es un juego para dos personas. Se juega en un tablero de sesenta y cuatro casillas. Cada jugador tiene dieciséis piezas. Gana quien atrapa al rey del rival: eso se llama jaque mate. Jugar ajedrez ayuda a pensar antes de actuar.",
      qs: [
        { q: "¿Cuántas personas juegan?", a: "Dos", d: ["Cuatro", "Una", "Once"] },
        { q: "¿Cuántas piezas tiene cada jugador?", a: "Dieciséis", d: ["Ocho", "Sesenta y cuatro", "Diez"] },
        { q: "¿Cómo se gana?", a: "Atrapando al rey rival", d: ["Juntando más piezas", "Llegando al otro lado", "Moviendo más rápido"] },
      ],
    },
    {
      title: "La natación", emoji: "🏊",
      text: "Nadar es un deporte muy completo porque mueve todo el cuerpo. Hay cuatro estilos: libre, espalda, pecho y mariposa. Para nadar seguro, primero hay que aprender a flotar y a respirar. Nunca debes meterte al agua sin un adulto cerca.",
      qs: [
        { q: "¿Por qué la natación es un deporte completo?", a: "Porque mueve todo el cuerpo", d: ["Porque es muy fácil", "Porque se juega en equipo", "Porque no cansa"] },
        { q: "¿Cuántos estilos hay?", a: "Cuatro", d: ["Dos", "Seis", "Uno"] },
        { q: "¿Qué hay que aprender primero?", a: "A flotar y a respirar", d: ["A saltar del trampolín", "A nadar mariposa", "A bucear muy hondo"] },
      ],
    },
    {
      title: "Las cometas", emoji: "🪁",
      text: "En agosto sopla mucho viento y es tiempo de cometas. Una cometa se hace con cañas, papel y una cola larga. La cola le da equilibrio para que no dé vueltas. Para hacerla volar hay que correr contra el viento y soltar el hilo poco a poco. Nunca la vueles cerca de cables.",
      qs: [
        { q: "¿Para qué sirve la cola?", a: "Para dar equilibrio", d: ["Para adornar", "Para que pese más", "Para amarrar el hilo"] },
        { q: "¿Cómo se hace volar?", a: "Corriendo contra el viento", d: ["Lanzándola hacia abajo", "Mojándola", "Sin soltar hilo"] },
        { q: "¿Dónde no se debe volar?", a: "Cerca de cables", d: ["En el campo", "En la playa", "En un cerro"] },
      ],
    },
  ],
  lugares: [
    {
      title: "Machu Picchu", emoji: "🏔️",
      text: "Machu Picchu es una ciudad que construyeron los incas en lo alto de una montaña, en el Cusco. Sus muros son de piedras que encajan sin pegamento. Tiene templos, casas y terrazas para sembrar. Cada año la visitan personas de todo el mundo.",
      qs: [
        { q: "¿Quiénes construyeron Machu Picchu?", a: "Los incas", d: ["Los españoles", "Los romanos", "Los piratas"] },
        { q: "¿Cómo son sus muros?", a: "De piedras que encajan", d: ["De ladrillo rojo", "De madera", "De barro y paja"] },
        { q: "¿Para qué servían las terrazas?", a: "Para sembrar", d: ["Para jugar", "Para guardar agua", "Para dormir"] },
      ],
    },
    {
      title: "El lago Titicaca", emoji: "🛶",
      text: "El lago Titicaca está entre el Perú y Bolivia, a gran altura. Es tan grande que parece un mar. En él viven los uros, que construyen islas flotantes con totora, una planta del lago. Con la totora también hacen sus casas y sus balsas.",
      qs: [
        { q: "¿Entre qué países está el lago?", a: "El Perú y Bolivia", d: ["Chile y Argentina", "El Perú y Brasil", "Ecuador y Colombia"] },
        { q: "¿Con qué hacen los uros sus islas?", a: "Con totora", d: ["Con piedras", "Con cemento", "Con arena"] },
        { q: "¿Qué más hacen con la totora?", a: "Casas y balsas", d: ["Ropa de lana", "Ollas de barro", "Zapatos"] },
      ],
    },
    {
      title: "Las líneas de Nazca", emoji: "🐒",
      text: "En el desierto de Nazca hay figuras gigantes dibujadas en el suelo. Hay un mono, un colibrí, una araña y muchas más. Fueron hechas hace más de mil quinientos años. Son tan grandes que se ven mejor desde un avión. Como allí casi no llueve, no se han borrado.",
      qs: [
        { q: "¿Dónde están las líneas?", a: "En el desierto de Nazca", d: ["En la selva", "En una montaña nevada", "En el fondo del mar"] },
        { q: "¿Desde dónde se ven mejor?", a: "Desde un avión", d: ["Desde un barco", "Desde una cueva", "De noche"] },
        { q: "¿Por qué no se han borrado?", a: "Porque casi no llueve", d: ["Porque están pintadas", "Porque son de piedra", "Porque están techadas"] },
      ],
    },
  ],
  famosos: [
    {
      title: "Pedro Paulet", emoji: "🚀",
      text: "Pedro Paulet nació en Arequipa. De niño miraba el cielo y jugaba con cohetes de fiesta. De joven estudió ingeniería y diseñó un motor para cohetes. Soñaba con naves que viajaran al espacio mucho antes de que existieran. Por eso se le recuerda como un pionero de los cohetes.",
      qs: [
        { q: "¿Dónde nació Pedro Paulet?", a: "En Arequipa", d: ["En Lima", "En Cusco", "En Puno"] },
        { q: "¿Qué diseñó?", a: "Un motor para cohetes", d: ["Un puente", "Un barco", "Una bicicleta"] },
        { q: "¿Por qué se le recuerda?", a: "Por ser un pionero de los cohetes", d: ["Por ser un gran cocinero", "Por ser futbolista", "Por pintar cuadros"] },
      ],
    },
    {
      title: "Frida Kahlo", emoji: "🎨",
      text: "Frida Kahlo fue una pintora mexicana. De joven tuvo un accidente y pasó mucho tiempo en cama. Allí empezó a pintar con un espejo sobre ella. Pintó muchos autorretratos, es decir, cuadros de sí misma. Usaba colores vivos y ropa tradicional de México.",
      qs: [
        { q: "¿De qué país era Frida Kahlo?", a: "De México", d: ["Del Perú", "De Chile", "De España"] },
        { q: "¿Qué es un autorretrato?", a: "Un cuadro de uno mismo", d: ["Un cuadro de frutas", "Una foto de un paisaje", "Un dibujo de animales"] },
        { q: "¿Cuándo empezó a pintar?", a: "Cuando estaba en cama", d: ["Cuando era anciana", "Cuando viajó a Europa", "Cuando iba al colegio"] },
      ],
    },
    {
      title: "Gabriela Mistral", emoji: "📝",
      text: "Gabriela Mistral nació en Chile. Fue maestra de escuela en pueblos pequeños. Escribía poemas sobre los niños, la naturaleza y el amor. En 1945 ganó el premio Nobel de Literatura. Fue la primera persona de Latinoamérica en recibirlo.",
      qs: [
        { q: "¿Dónde nació Gabriela Mistral?", a: "En Chile", d: ["En México", "En Argentina", "En el Perú"] },
        { q: "¿Qué escribía?", a: "Poemas", d: ["Recetas", "Noticias", "Canciones de rock"] },
        { q: "¿Qué premio ganó?", a: "El Nobel de Literatura", d: ["Una medalla olímpica", "Un premio de pintura", "Un concurso de canto"] },
      ],
    },
  ],
};

export const ROWS: Row[] = [
  ["U.1", "Determinar el tema y el propósito de textos informativos", (r) => readPassage(r, TOPIC_PURPOSE, false)],
  ["U.2", "Identificar la idea principal y un detalle de apoyo", (r) => readPassage(r, MAIN_DETAIL, false)],

  ["V.1", "¿Qué título de libro corresponde al dibujo?", (r) => choose(r, "¿Qué título de libro corresponde al dibujo?", BOOK_TITLES)],
  ["V.2", "Hacer inferencias a partir de un texto", (r) => readPassage(r, INFERENCES, false)],
  ["V.3", "Determinar la enseñanza de mitos, fábulas y leyendas", (r) => readPassage(r, FABLES, false)],

  ["W.1", "Identificar el propósito de un texto", (r) => choose(r, "¿Para qué se escribió este texto?", PURPOSE)],
  ["W.2", "Analizar textos que buscan convencer", (r) => readPassage(r, PERSUASIVE, false)],

  ["X.1", "Elegir el dibujo que corresponde a la oración descriptiva", (r) => choose(r, "¿Qué dibujo corresponde a la descripción?", DESCRIBED)],
  ["X.2", "Elegir el dibujo que corresponde al escenario o al personaje", (r) => choose(r, "Lee y responde.", SETTING_CHARACTER)],
  ["X.3", "Usar acciones y diálogos para entender a los personajes", (r) => choose(r, "Lee y responde.", TRAITS)],

  ["Y.1", "Ordenar los hechos de un cuento", (r) => order(r, "Lee el cuento y ordena lo que pasa.", STORY_ORDER)],
  ["Y.2", "Determinar el orden de los hechos en textos informativos", (r) => order(r, "Lee el texto y ordena los pasos.", INFO_ORDER)],

  ["Z.1", "Leer e identificar los elementos del cuento", (r) => readPassage(r, PLOT, false)],

  ["AA.1", "Relacionar cada efecto con su causa", (r) => choose(r, "", EFFECT_TO_CAUSE)],
  ["AA.2", "Relacionar cada causa con su efecto", (r) => choose(r, "", CAUSE_TO_EFFECT)],

  ["BB.1", "Comparar y contrastar en textos informativos", (r) => readPassage(r, COMPARE, false)],

  ["CC.1", "Usar las partes de un texto", (r) => choose(r, "", TEXT_FEATURES)],

  ["DD.1", "Escuchar cuentos realistas", (r) => readPassage(r, LIT_ALOUD.realista, true)],
  ["DD.2", "Escuchar cuentos de fantasía", (r) => readPassage(r, LIT_ALOUD.fantasia, true)],
  ["DD.3", "Escuchar cuentos de ficción histórica", (r) => readPassage(r, LIT_ALOUD.historica, true)],

  ["EE.1", "Leer fantasías de animales", (r) => readPassage(r, LIT_ALONE.animales, false)],
  ["EE.2", "Leer cuentos realistas", (r) => readPassage(r, LIT_ALONE.realista, false)],
  ["EE.3", "Leer ciencia ficción", (r) => readPassage(r, LIT_ALONE.ficcion, false)],

  ["FF.1", "Escuchar textos de ciencia y naturaleza", (r) => readPassage(r, INFO_ALOUD.ciencia, true)],
  ["FF.2", "Escuchar textos sobre personajes famosos", (r) => readPassage(r, INFO_ALOUD.famosos, true)],
  ["FF.3", "Escuchar textos sobre arte, música y tradiciones", (r) => readPassage(r, INFO_ALOUD.arte, true)],
  ["FF.4", "Escuchar textos sobre negocios y tecnología", (r) => readPassage(r, INFO_ALOUD.negocios, true)],

  ["GG.1", "Leer sobre animales", (r) => readPassage(r, INFO_ALONE.animales, false)],
  ["GG.2", "Leer sobre deportes y pasatiempos", (r) => readPassage(r, INFO_ALONE.deportes, false)],
  ["GG.3", "Leer sobre lugares famosos", (r) => readPassage(r, INFO_ALONE.lugares, false)],
  ["GG.4", "Leer sobre personajes famosos", (r) => readPassage(r, INFO_ALONE.famosos, false)],
];
