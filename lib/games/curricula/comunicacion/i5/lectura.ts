import { choose, order, readPassage, type ChoiceItem, type OrderItem, type Passage } from "../../../generators/lengua/bank";
import type { Row } from "./row";

// Inicial 5 años · banco de comprensión: imágenes, cuentos y textos
// informativos. Los textos para leer con ayuda se pueden escuchar con 🔊; los
// textos para leer solo son más cortos y no se leen en voz alta.


// Cada respuesta tiene como distractores las respuestas de los demás ítems.
const fromText = (list: [string, string][]): ChoiceItem[] => list.map(([t, a]) => ({ t, a, d: list.map((x) => x[1]).filter((x) => x !== a) }));
const fromPic = (list: [string, string][]): ChoiceItem[] => list.map(([pic, a]) => ({ pic, a, d: list.map((x) => x[1]).filter((x) => x !== a) }));

const BOOK: ChoiceItem[] = [
  { p: "¿Qué parte del libro muestra el título y un dibujo grande?", a: "La portada", d: ["El lomo", "Una página", "El índice"] },
  { p: "¿Cómo se llama el nombre de un libro?", a: "El título", d: ["El autor", "La página", "El lomo"] },
  { p: "¿Quién escribe las palabras de un libro?", a: "El autor o la autora", d: ["El ilustrador", "El lector", "El vendedor de libros"] },
  { p: "¿Quién hace los dibujos de un libro?", a: "El ilustrador", d: ["El autor", "El lector", "El bibliotecario"] },
  { p: "¿Qué pasamos para seguir leyendo un libro?", a: "Las páginas", d: ["La portada", "El título", "Los autores"] },
  { p: "¿Por dónde empezamos a leer una página?", a: "Arriba, a la izquierda", d: ["Abajo, a la derecha", "En el medio", "Arriba, a la derecha"] },
  { p: "¿Cómo se llama la parte de atrás de un libro?", a: "La contraportada", d: ["La portada del frente", "El título", "La página uno"] },
  { p: "¿Qué nos muestran los dibujos de un cuento?", a: "Lo que pasa en el cuento", d: ["El precio del libro", "Quién vende el libro en la tienda", "El número"] },
  { p: "¿Hacia dónde leemos las palabras?", a: "De izquierda a derecha", d: ["De derecha a izquierda", "De abajo hacia arriba", "En círculos"] },
  { p: "¿Qué nos dice el número de la página?", a: "En qué página estamos", d: ["Quién escribió el libro", "El título", "Cuántos dibujos hay en total"] },
];

const REAL = [
  "Un niño come una manzana.", "Una niña monta bicicleta.", "Un gato duerme en el sofá.", "Un pájaro vuela a su nido.",
  "Papá cocina la sopa.", "Un pez nada en el río.", "La abuela teje una chompa.", "Un perro corre en el parque.",
];
const FANTASY = [
  "Un gato maneja un camión.", "Una vaca vuela a la luna.", "Un pez canta en la escuela.", "Un árbol camina por la calle.",
  "Un perro lee el periódico.", "Una niña tiene alas de dragón.", "Un ratón cocina una torta.", "La luna baja a tomar sopa.",
];

const SCENES: [string, string][] = [
  ["🎂🎈🎁", "Un cumpleaños"], ["🏖️🌊⛱️", "Un día de playa"], ["🌧️☂️💧", "Un día de lluvia"], ["⚽🥅🏃", "Un partido de fútbol"],
  ["🛏️🌙😴", "La hora de dormir"], ["🍳🥛🍞", "El desayuno"], ["🏫📚✏️", "La escuela"], ["🐄🐖🐓", "Los animales de la granja"],
  ["🚒🔥🧑‍🚒", "Los bomberos"], ["🦁🐘🦒", "Un paseo al zoológico"],
];

const MAIN_IDEA: Passage[] = [
  { title: "Los perros", emoji: "🐶", text: "Los perros son buenos amigos. Juegan con los niños. Cuidan la casa. Mueven la cola cuando están contentos.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De los perros", d: ["De los gatos", "De las casas"] },
      { q: "¿Cuál es la idea principal?", a: "Los perros son buenos amigos.", d: ["Los perros comen mucho.", "Los niños van a la escuela cada día."] },
    ] },
  { title: "La lluvia", emoji: "🌧️", text: "La lluvia cae de las nubes. Moja las plantas y llena los ríos. Las plantas necesitan la lluvia para crecer.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De la lluvia", d: ["Del sol", "De los ríos"] },
      { q: "¿Cuál es la idea principal?", a: "La lluvia ayuda a las plantas.", d: ["Las nubes son blancas.", "Los ríos tienen muchísimos peces."] },
    ] },
  { title: "Las abejas", emoji: "🐝", text: "Las abejas vuelan de flor en flor. Con las flores hacen miel. La miel es dulce y rica.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De las abejas", d: ["De las flores", "De las moscas"] },
      { q: "¿Cuál es la idea principal?", a: "Las abejas hacen miel.", d: ["Las flores son rojas.", "La miel es muy cara."] },
    ] },
  { title: "Mi escuela", emoji: "🏫", text: "En mi escuela aprendo a leer. También pinto y canto. Juego con mis amigos en el recreo.",
    qs: [
      { q: "¿De qué trata el texto?", a: "De la escuela", d: ["De la casa", "Del parque"] },
      { q: "¿Cuál es la idea principal?", a: "En la escuela aprendo y juego.", d: ["En el parque hay juegos.", "Mis amigos son muy altos y fuertes."] },
    ] },
  { title: "El sol", emoji: "☀️", text: "El sol nos da luz y calor. Sale por la mañana. Con el sol, el día es claro.",
    qs: [
      { q: "¿De qué trata el texto?", a: "Del sol", d: ["De la luna", "De la noche"] },
      { q: "¿Cuál es la idea principal?", a: "El sol da luz y calor.", d: ["La luna sale de noche.", "El día es largo."] },
    ] },
];

const FEELINGS: [string, string][] = [["😀", "Feliz"], ["😢", "Triste"], ["😠", "Enojado"], ["😨", "Asustado"], ["😴", "Con sueño"], ["😲", "Sorprendido"], ["🤒", "Enfermo"]];

const NEXT: ChoiceItem[] = [
  { t: "Ana tiene sueño y se pone el pijama.", a: "Se va a dormir.", d: ["Se va a nadar.", "Sale a correr al parque."] },
  { t: "El cielo está gris y hay nubes negras.", a: "Va a llover.", d: ["Hará calor.", "Va a salir la luna llena."] },
  { t: "Luis infla e infla un globo sin parar.", a: "El globo revienta.", d: ["El globo canta.", "El globo se vuelve una pelota."] },
  { t: "Mamá pone la torta en el horno caliente.", a: "La torta se cocina.", d: ["La torta vuela.", "La torta se congela en el horno."] },
  { t: "El perro ve a su dueño llegar a casa.", a: "Mueve la cola.", d: ["Se esconde.", "Se pone a llorar muy triste."] },
  { t: "Rosa siembra una semilla y la riega cada día.", a: "Crece una planta.", d: ["Sale un pez.", "La semilla se vuelve una piedra."] },
  { t: "Pepe deja su helado bajo el sol.", a: "El helado se derrite.", d: ["El helado crece.", "El helado se pone más frío y duro."] },
  { t: "Suena el timbre del recreo en la escuela.", a: "Los niños salen a jugar.", d: ["Los niños se duermen.", "Los niños se van a la playa en avión."] },
];

const INFER: ChoiceItem[] = [
  { t: "Tomás lleva paraguas y botas. Sus zapatos están mojados.", p: "¿Cómo está el día?", a: "Está lloviendo", d: ["Hace mucho sol", "Está nevando en la playa"] },
  { t: "Lucía bosteza y se frota los ojos.", p: "¿Cómo se siente Lucía?", a: "Tiene sueño", d: ["Tiene sed", "Está muy asustada"] },
  { t: "El plato del gato está vacío. El gato maúlla junto al plato.", p: "¿Qué quiere el gato?", a: "Quiere comer", d: ["Quiere agua", "Quiere salir a pasear"] },
  { t: "Hay velas, globos y una torta sobre la mesa.", p: "¿Qué se celebra?", a: "Un cumpleaños", d: ["Una carrera", "Un partido de fútbol"] },
  { t: "Mateo se abriga con chompa, gorro y guantes.", p: "¿Cómo está el clima?", a: "Hace frío", d: ["Llueve", "Hay mucho viento caliente"] },
  { t: "Sara llora. Su globo se fue volando al cielo.", p: "¿Por qué llora Sara?", a: "Perdió su globo", d: ["Tiene sueño", "Se cayó de la bicicleta"] },
  { t: "Papá lleva una caña y un balde al río.", p: "¿Qué va a hacer papá?", a: "Va a pescar", d: ["Va a leer", "Va a lavar la ropa sucia"] },
];

const RIDDLES: [string, string][] = [
  ["Tengo cuatro patas y digo guau.", "🐶 el perro"], ["Vuelo de flor en flor y hago miel.", "🐝 la abeja"], ["Salgo de día y doy luz y calor.", "☀️ el sol"],
  ["Tengo páginas y cuentos para leer.", "📖 el libro"], ["Soy redonda y me pateas para hacer gol.", "⚽ la pelota"], ["Vivo en el agua y tengo aletas.", "🐟 el pez"],
  ["Tengo ruedas y te llevo por la calle.", "🚗 el carro"], ["Salgo de noche y a veces soy redonda.", "🌙 la luna"], ["Doy leche y digo mu.", "🐮 la vaca"],
  ["Caigo de las nubes y te mojo.", "🌧️ la lluvia"],
];

const THEME: Passage[] = [
  { title: "La hormiga y la paloma", emoji: "🐜", text: "Una hormiga cayó al río. Una paloma le lanzó una hoja y la salvó. Otro día, la hormiga ayudó a la paloma.",
    qs: [
      { q: "¿De quiénes trata el cuento?", a: "De una hormiga y una paloma", d: ["De un gato y un ratón", "De un niño y su perrito blanco"] },
      { q: "¿Qué nos enseña el cuento?", a: "Es bueno ayudar a los demás.", d: ["Es bueno nadar en el río.", "Las palomas comen muchas hormigas."] },
    ] },
  { title: "El conejo que compartió", emoji: "🐰", text: "Coni tenía muchas zanahorias. Su amigo Tito no tenía nada. Coni le dio la mitad. Los dos comieron felices.",
    qs: [
      { q: "¿De quiénes trata el cuento?", a: "De dos amigos", d: ["De dos hermanas", "De un granjero"] },
      { q: "¿Qué nos enseña el cuento?", a: "Es bueno compartir.", d: ["Es bueno esconder la comida.", "Comer es feo."] },
    ] },
  { title: "La tortuga lenta", emoji: "🐢", text: "La tortuga caminaba despacio, pero no paraba. La liebre se durmió. La tortuga llegó primero a la meta.",
    qs: [
      { q: "¿Quién llegó primero?", a: "La tortuga", d: ["La liebre", "El zorro"] },
      { q: "¿Qué nos enseña el cuento?", a: "Si no te rindes, llegas lejos.", d: ["Dormir mucho es lo mejor.", "Las liebres nunca aprenden a correr."] },
    ] },
  { title: "Pablo dice la verdad", emoji: "👦", text: "Pablo rompió un vaso. Tenía miedo, pero se lo contó a su mamá. Ella lo abrazó y le dio las gracias.",
    qs: [
      { q: "¿Qué rompió Pablo?", a: "Un vaso", d: ["Un plato", "Una taza"] },
      { q: "¿Qué nos enseña el cuento?", a: "Es bueno decir la verdad.", d: ["Es bueno romper vasos.", "Los vasos siempre son de plástico."] },
    ] },
];

const PURPOSES = ["Contar un cuento", "Dar información", "Enseñar cómo hacer algo"];
const PURPOSE: [string, number][] = [
  ["Había una vez un dragón que tenía miedo del fuego.", 0], ["Las ranas viven cerca del agua y comen insectos.", 1],
  ["Primero lávate las manos. Luego sécalas con una toalla.", 2], ["Un día, la princesa encontró un mapa mágico.", 0],
  ["El elefante es el animal más grande de la tierra.", 1], ["Para hacer limonada, exprime limones y agrega agua y azúcar.", 2],
  ["Érase una vez un conejo que quería volar.", 0], ["Los dientes sirven para masticar la comida.", 1],
  ["Dobla el papel por la mitad. Después, recorta un corazón.", 2],
];

const DESCRIBE: [string, string][] = [
  ["Es un animal grande y gris con trompa.", "🐘"], ["Es una fruta roja con semillitas.", "🍓"], ["Es amarillo, brilla y da calor.", "☀️"],
  ["Tiene alas de colores y vuela entre las flores.", "🦋"], ["Es blanco y frío, y se arma con nieve.", "⛄"], ["Es verde, salta y dice croac.", "🐸"],
  ["Tiene cuatro ruedas y es rojo.", "🚗"], ["Es largo, no tiene patas y se arrastra.", "🐍"], ["Es una casa muy alta con muchas ventanas.", "🏢"],
  ["Tiene melena y ruge muy fuerte.", "🦁"],
];

const SETTING: [string, string][] = [
  ["El cuento pasa en la playa.", "🏖️"], ["El cuento pasa en el bosque.", "🌲"], ["El cuento pasa en un castillo.", "🏰"], ["El cuento pasa en la granja.", "🚜"],
  ["El cuento pasa en el espacio.", "🚀"], ["El cuento pasa de noche.", "🌙"], ["El cuento pasa en la escuela.", "🏫"], ["El personaje es un pirata.", "🏴‍☠️"],
  ["El personaje es una reina.", "👸"], ["El personaje es un robot.", "🤖"], ["El personaje es un dragón.", "🐉"], ["El personaje es un payaso.", "🤡"],
];

const SEQUENCES: OrderItem[] = [
  { t: "Del huevo a la gallina", seq: ["🥚", "🐣", "🐥", "🐔"] },
  { t: "De la semilla al fruto", seq: ["🌱", "🌿", "🌳", "🍎"] },
  { t: "Un día completo", seq: ["🌅", "☀️", "🌇", "🌙"] },
  { t: "Antes de ir a la escuela", seq: ["🛏️", "🪥", "🎒", "🏫"] },
  { t: "Hacer una torta", seq: ["🥣", "🔥", "🎂", "😋"] },
  { t: "La lluvia y el arcoíris", seq: ["☁️", "🌧️", "🌈"] },
  { t: "De la oruga a la mariposa", seq: ["🥚", "🐛", "🦋"] },
  { t: "Mandar una carta", seq: ["✏️", "📄", "✉️", "📬"] },
];

const PROBLEM: Passage[] = [
  { title: "El zapato de Leo", emoji: "👟", text: "A Leo se le desató el zapato y casi se cae. Su hermana le enseñó a hacer el nudo. Ahora Leo se amarra solo.",
    qs: [
      { q: "¿Cuál es el problema?", a: "Se le desató el zapato.", d: ["Perdió su mochila.", "Tenía mucha hambre y sed."] },
      { q: "¿Cómo se soluciona el problema?", a: "Su hermana le enseña el nudo.", d: ["Leo compra zapatos.", "Leo se queda descalzo en su casa."] },
    ] },
  { title: "La gatita en el árbol", emoji: "🐱", text: "La gatita Luna subió a un árbol y no podía bajar. El abuelo trajo una escalera. La gatita bajó a sus brazos.",
    qs: [
      { q: "¿Cuál es el problema?", a: "La gatita no podía bajar.", d: ["La gatita tenía sed.", "El árbol se cayó con el viento."] },
      { q: "¿Cómo se soluciona el problema?", a: "El abuelo trajo una escalera.", d: ["La gatita saltó al río.", "Llovió muy fuerte toda la tarde."] },
    ] },
  { title: "La lonchera olvidada", emoji: "🍱", text: "Mía olvidó su lonchera en casa. Tenía hambre en el recreo. Su amiga Sol compartió su pan con ella.",
    qs: [
      { q: "¿Cuál es el problema?", a: "Mía olvidó su lonchera.", d: ["Mía perdió su lápiz.", "Sol estaba enferma en su casa."] },
      { q: "¿Cómo se soluciona el problema?", a: "Sol compartió su pan.", d: ["Mía se fue a dormir.", "La maestra cantó una canción larga."] },
    ] },
  { title: "El juguete roto", emoji: "🧸", text: "El carrito de Beto perdió una rueda. Beto estaba triste. Papá pegó la rueda con goma. ¡El carrito volvió a rodar!",
    qs: [
      { q: "¿Cuál es el problema?", a: "El carrito perdió una rueda.", d: ["Beto perdió su gorra.", "Papá estaba dormido en el sillón."] },
      { q: "¿Cómo se soluciona el problema?", a: "Papá pegó la rueda.", d: ["Mamá compró pan.", "Beto botó el carrito a la basura."] },
    ] },
];

const NARRATOR: ChoiceItem[] = [
  { t: "Yo soy Mateo. Me gusta jugar fútbol con mi hermana Lía.", a: "Mateo", d: ["Lía", "La mamá"] },
  { t: "Me llamo Rosa. Hoy mi abuelo Tito me llevó al parque.", a: "Rosa", d: ["Tito", "Un perro"] },
  { t: "Soy un perro y me llamo Toby. Mi dueño Pepe me da huesos.", a: "Toby", d: ["Pepe", "Un gato"] },
  { t: "Yo soy Ana, la maestra. Les leo un cuento a Sami y a Leo.", a: "Ana", d: ["Sami", "Leo"] },
  { t: "Soy Lucas. Mi mamá Elena me hizo una torta.", a: "Lucas", d: ["Elena", "Un vecino"] },
  { t: "Me llamo Nina y soy una gata. Duermo en la cama de Julia.", a: "Nina", d: ["Julia", "Un ratón"] },
  { t: "Yo soy el abuelo Paco. Mi nieto Dani me ayuda en la chacra.", a: "Paco", d: ["Dani", "La vaca"] },
];

const FEATURES: ChoiceItem[] = [
  { p: "¿Qué nos dice el título de un texto?", a: "De qué trata el texto", d: ["Cuánto cuesta", "Quién lo compró ayer en la tienda"] },
  { p: "¿Para qué sirven las fotos y los dibujos de un texto?", a: "Para entender mejor", d: ["Para pesar más", "Para que el libro huela rico"] },
  { p: "Debajo de una foto hay unas palabras que la explican. ¿Para qué sirven?", a: "Para explicar la foto", d: ["Para tapar la foto", "Para contar un chiste diferente"] },
  { p: "Algunas palabras están en letras grandes y oscuras. ¿Por qué?", a: "Porque son importantes", d: ["Porque sobró tinta", "Porque están mal escritas y hay que borrarlas"] },
  { p: "¿Dónde buscas en qué página empieza un cuento?", a: "En el índice", d: ["En la foto", "En el precio del libro"] },
  { p: "¿Qué muestra un mapa en un texto?", a: "Dónde están los lugares", d: ["Qué hora es", "Cómo se llama el autor del libro"] },
  { p: "¿Qué muestra un dibujo con flechas y nombres?", a: "Las partes de algo", d: ["Un chiste", "El final del cuento de la princesa"] },
];

const FANTASY_ALONG: Passage[] = [
  { title: "El dragón que tenía frío", emoji: "🐉", text: "Dino era un dragón pequeño. No sabía lanzar fuego y siempre tenía frío. Un día estornudó muy fuerte y, ¡fuum!, salió una llamita. Desde entonces, Dino calienta la sopa de todos sus amigos.",
    qs: [
      { q: "¿Quién es Dino?", a: "Un dragón", d: ["Un ratón", "Un gigante"] },
      { q: "¿Qué problema tenía Dino?", a: "Tenía frío", d: ["Tenía sed", "Tenía mucho sueño"] },
      { q: "¿Qué calienta Dino para sus amigos?", a: "La sopa", d: ["La cama", "El agua del mar"] },
    ] },
  { title: "La nube viajera", emoji: "☁️", text: "Nubi era una nube que quería conocer el mar. Viajó sobre montañas y pueblos. Al llegar al mar, lloró de alegría. Sus lágrimas fueron lluvia para los peces.",
    qs: [
      { q: "¿Qué quería conocer Nubi?", a: "El mar", d: ["El sol", "La selva"] },
      { q: "¿Qué era Nubi?", a: "Una nube", d: ["Una niña", "Un pájaro"] },
      { q: "¿En qué se convirtieron sus lágrimas?", a: "En lluvia", d: ["En nieve", "En piedras"] },
    ] },
];

const REAL_ALONG: Passage[] = [
  { title: "El primer día de Vale", emoji: "🎒", text: "Vale tenía miedo de ir a la escuela. En la puerta, apretó la mano de su papá. La maestra la saludó con una sonrisa. En el recreo, Vale ya tenía una amiga nueva.",
    qs: [
      { q: "¿Cómo se sentía Vale al inicio?", a: "Con miedo", d: ["Con hambre", "Muy enojada"] },
      { q: "¿Quién saludó a Vale con una sonrisa?", a: "La maestra", d: ["La abuela", "Un policía"] },
      { q: "¿Qué tenía Vale en el recreo?", a: "Una amiga nueva", d: ["Una pelota nueva", "Un diente flojo"] },
    ] },
  { title: "La torta para el abuelo", emoji: "🎂", text: "Hoy es el cumpleaños del abuelo. Nico y la abuela hacen una torta. Nico bate los huevos y la abuela pone la harina. Cuando el abuelo llega, todos gritan: ¡Sorpresa!",
    qs: [
      { q: "¿De quién es el cumpleaños?", a: "Del abuelo", d: ["De Nico", "De la abuela"] },
      { q: "¿Qué hace Nico?", a: "Bate los huevos", d: ["Lava los platos", "Compra globos"] },
      { q: "¿Qué gritan todos?", a: "¡Sorpresa!", d: ["¡Adiós!", "¡Buenas noches!"] },
    ] },
];

const FANTASY_ALONE: Passage[] = [
  { title: "La rana y el sapo", emoji: "🐸", text: "La rana quiere cantar. El sapo toca el tambor. La rana canta y el sapo toca. ¡Todos los animales bailan!",
    qs: [
      { q: "¿Qué quiere la rana?", a: "Cantar", d: ["Nadar", "Dormir"] },
      { q: "¿Qué toca el sapo?", a: "El tambor", d: ["El piano", "La guitarra"] },
      { q: "¿Qué hacen los animales?", a: "Bailan", d: ["Comen", "Lloran"] },
    ] },
  { title: "El ratón valiente", emoji: "🐭", text: "Un ratón ve a un gato dormido. El ratón pasa sin hacer ruido. Toma su queso y corre a casa. ¡Qué ratón tan valiente!",
    qs: [
      { q: "¿Cómo está el gato?", a: "Dormido", d: ["Enojado", "Mojado"] },
      { q: "¿Qué toma el ratón?", a: "Su queso", d: ["Su gorro", "Su cama"] },
      { q: "¿Cómo es el ratón?", a: "Valiente", d: ["Miedoso", "Gigante"] },
    ] },
];

const REAL_ALONE: Passage[] = [
  { title: "Mi perro Rex", emoji: "🐶", text: "Tengo un perro. Se llama Rex. Rex corre en el patio. Yo le doy agua y comida.",
    qs: [
      { q: "¿Cómo se llama el perro?", a: "Rex", d: ["Max", "Toby"] },
      { q: "¿Dónde corre Rex?", a: "En el patio", d: ["En la sala", "En el río"] },
      { q: "¿Qué le doy a Rex?", a: "Agua y comida", d: ["Pan y queso fresco", "Leche"] },
    ] },
  { title: "En el mercado", emoji: "🛒", text: "Voy al mercado con mamá. Compramos papas y tomates. La señora nos da una yapa. Volvemos a casa a cocinar.",
    qs: [
      { q: "¿Con quién voy al mercado?", a: "Con mamá", d: ["Con papá", "Con mi tío"] },
      { q: "¿Qué compramos?", a: "Papas y tomates", d: ["Pan, leche y huevos", "Uvas"] },
      { q: "¿Qué nos da la señora?", a: "Una yapa", d: ["Una flor", "Un gato"] },
    ] },
];

const SCIENCE: Passage[] = [
  { title: "Las plantas", emoji: "🌱", text: "Las plantas son seres vivos. Necesitan agua, luz del sol y tierra para crecer. Sus raíces toman el agua de la tierra. Sus hojas reciben la luz del sol.",
    qs: [
      { q: "¿Qué necesitan las plantas para crecer?", a: "Agua, luz y tierra", d: ["Leche y pan", "Zapatos, ropa y juguetes"] },
      { q: "¿Qué parte toma el agua de la tierra?", a: "Las raíces", d: ["Las flores", "Las hojas"] },
      { q: "¿Qué reciben las hojas?", a: "La luz del sol", d: ["La tierra", "El agua salada del mar"] },
    ] },
  { title: "El día y la noche", emoji: "🌗", text: "De día vemos el sol y el cielo está claro. De noche el cielo está oscuro y vemos la luna y las estrellas. Muchos animales duermen de noche, pero el búho se despierta.",
    qs: [
      { q: "¿Qué vemos en el cielo de noche?", a: "La luna y las estrellas", d: ["El sol", "Las nubes blancas y el arcoíris"] },
      { q: "¿Qué animal se despierta de noche?", a: "El búho", d: ["La gallina", "La vaca"] },
      { q: "¿Cómo está el cielo de día?", a: "Claro", d: ["Oscuro", "Negro"] },
    ] },
];

const PEOPLE: Passage[] = [
  { title: "Pedro Paulet", emoji: "🚀", text: "Pedro Paulet nació en Arequipa, en el Perú. De niño miraba las estrellas y soñaba con viajar al espacio. De grande diseñó un motor para cohetes. Muchos lo llaman un pionero de los viajes espaciales.",
    qs: [
      { q: "¿Dónde nació Pedro Paulet?", a: "En Arequipa", d: ["En Lima", "En Cusco"] },
      { q: "¿Qué diseñó de grande?", a: "Un motor para cohetes", d: ["Un barco de vela", "Una bicicleta de carreras muy veloz"] },
      { q: "¿Con qué soñaba de niño?", a: "Con viajar al espacio", d: ["Con cocinar", "Con ser un famoso futbolista"] },
    ] },
  { title: "María Reiche", emoji: "🏜️", text: "María Reiche nació en Alemania y vivió en el Perú. Estudió las Líneas de Nazca durante muchos años. Barría el desierto con una escoba para ver mejor los dibujos. Gracias a ella, hoy cuidamos las líneas.",
    qs: [
      { q: "¿Qué estudió María Reiche?", a: "Las Líneas de Nazca", d: ["Las montañas", "Los peces del mar peruano"] },
      { q: "¿Con qué barría el desierto?", a: "Con una escoba", d: ["Con una pala", "Con un trapo"] },
      { q: "¿Dónde nació María Reiche?", a: "En Alemania", d: ["En el Perú", "En México"] },
    ] },
];

const FOOD: Passage[] = [
  { title: "La papa", emoji: "🥔", text: "La papa crece debajo de la tierra. En el Perú hay miles de tipos de papa: amarillas, blancas, moradas. Con la papa se preparan purés, sopas y papas fritas.",
    qs: [
      { q: "¿Dónde crece la papa?", a: "Debajo de la tierra", d: ["En el mar", "En las ramas de los árboles"] },
      { q: "¿Qué se prepara con la papa?", a: "Puré", d: ["Jugo", "Helado"] },
      { q: "¿De qué colores hay papas?", a: "Amarillas, blancas y moradas", d: ["Solo azules", "Verdes, rosadas, celestes y plateadas"] },
    ] },
  { title: "De dónde viene el pan", emoji: "🍞", text: "El pan se hace con harina. La harina sale del trigo, que es una planta. El panadero mezcla harina, agua y levadura, y hornea la masa. ¡Así sale el pan calientito!",
    qs: [
      { q: "¿Con qué se hace el pan?", a: "Con harina", d: ["Con arena", "Con leche fría"] },
      { q: "¿Quién hornea la masa?", a: "El panadero", d: ["El bombero", "El doctor"] },
      { q: "¿De qué planta sale la harina?", a: "Del trigo", d: ["Del pino", "Del maíz morado"] },
    ] },
];

const ANIMALS: Passage[] = [
  { title: "La llama", emoji: "🦙", text: "La llama vive en los Andes. Tiene mucha lana. Come pasto. La llama carga cosas.",
    qs: [
      { q: "¿Dónde vive la llama?", a: "En los Andes", d: ["En el mar", "En la selva"] },
      { q: "¿Qué come la llama?", a: "Pasto", d: ["Carne", "Peces"] },
      { q: "¿Qué tiene la llama?", a: "Mucha lana", d: ["Dos alas", "Una trompa"] },
    ] },
  { title: "El cóndor", emoji: "🦅", text: "El cóndor es un ave muy grande. Vuela muy alto. Tiene alas negras. Vive en las montañas.",
    qs: [
      { q: "¿Cómo vuela el cóndor?", a: "Muy alto", d: ["Muy bajo", "Bajo el agua"] },
      { q: "¿De qué color son sus alas?", a: "Negras", d: ["Rojas", "Verdes"] },
      { q: "¿Dónde vive el cóndor?", a: "En las montañas", d: ["En el río", "En la ciudad grande"] },
    ] },
];

const PLACES: Passage[] = [
  { title: "La playa", emoji: "🏖️", text: "En la playa hay arena y mar. El agua es salada. Los niños hacen castillos. Las olas van y vienen.",
    qs: [
      { q: "¿Qué hay en la playa?", a: "Arena y mar", d: ["Nieve y hielo", "Pasto y vacas"] },
      { q: "¿Cómo es el agua del mar?", a: "Salada", d: ["Dulce", "Roja"] },
      { q: "¿Qué hacen los niños?", a: "Castillos", d: ["Tortas", "Tareas"] },
    ] },
  { title: "La selva", emoji: "🌴", text: "La selva es verde y húmeda. Llueve mucho. Hay monos, loros y ríos grandes. Los árboles son muy altos.",
    qs: [
      { q: "¿Cómo es la selva?", a: "Verde y húmeda", d: ["Blanca", "Seca, fría y sin árboles"] },
      { q: "¿Qué animales hay en la selva?", a: "Monos y loros", d: ["Osos polares", "Llamas y focas"] },
      { q: "¿Cómo son los árboles?", a: "Muy altos", d: ["Muy bajos", "De hielo"] },
    ] },
];

export const ROWS: Row[] = [
  ["partes-libro-1", (r) => choose(r, "", BOOK)],

  ["real-fantasia", (r) => {
    const real = r.chance(0.5);
    const [yes, no] = real ? [REAL, FANTASY] : [FANTASY, REAL];
    const answer = r.pick(yes);
    return {
      kind: "choice",
      prompt: real ? "¿Qué puede pasar en la vida real?" : "¿Qué NO puede pasar en la vida real? (Es fantasía.)",
      options: r.shuffle([answer, ...r.shuffle(no).slice(0, 2)]),
      answer,
      explanation: real ? "Eso sí puede pasar de verdad." : "Eso solo pasa en los cuentos de fantasía.",
      tag: real ? "real" : "fantasia",
    };
  }],

  ["de-que-trata-1", (r) => choose(r, "¿De qué trata el dibujo?", fromPic(SCENES))],
  ["de-que-trata-2", (r) => readPassage(r, MAIN_IDEA, true)],

  ["sentimientos-1", (r) => choose(r, "¿Cómo se siente?", fromPic(FEELINGS))],
  ["sentimientos-2", (r) => choose(r, "¿Qué pasará después?", NEXT)],
  ["sentimientos-3", (r) => choose(r, "", INFER)],
  ["sentimientos-4", (r) => choose(r, "Adivina, adivinador: ¿qué soy?", fromText(RIDDLES))],
  ["ensenanza", (r) => readPassage(r, THEME, true)],

  ["para-que-1", (r) => {
    const [text, i] = r.pick(PURPOSE);
    return { kind: "choice", prompt: "¿Para qué se escribió este texto?", visual: { kind: "text", text }, options: PURPOSES, answer: PURPOSES[i], explanation: `Se escribió para: ${PURPOSES[i].toLowerCase()}.`, tag: PURPOSES[i] };
  }],

  ["lugar-personajes-1", (r) => choose(r, "¿Qué dibujo corresponde a la descripción?", fromText(DESCRIBE))],
  ["lugar-personajes-2", (r) => choose(r, "¿Qué dibujo corresponde?", fromText(SETTING))],

  ["ordenar-cuento-1", (r) => order(r, "Ordena los dibujos, de lo primero a lo último.", SEQUENCES)],
  ["ordenar-cuento-2", (r) => readPassage(r, PROBLEM, true)],

  ["para-que-2", (r) => choose(r, "¿Quién cuenta la historia?", NARRATOR)],

  ["partes-libro-2", (r) => choose(r, "", FEATURES)],

  ["cuentos-escuchados-1", (r) => readPassage(r, FANTASY_ALONG, true)],
  ["cuentos-escuchados-2", (r) => readPassage(r, REAL_ALONG, true)],

  ["cuentos-solo-1", (r) => readPassage(r, FANTASY_ALONE, false)],
  ["cuentos-solo-2", (r) => readPassage(r, REAL_ALONE, false)],

  ["textos-escuchados-1", (r) => readPassage(r, SCIENCE, true)],
  ["textos-escuchados-2", (r) => readPassage(r, PEOPLE, true)],
  ["textos-escuchados-3", (r) => readPassage(r, FOOD, true)],

  ["informativos-solo-1", (r) => readPassage(r, ANIMALS, false)],
  ["informativos-solo-2", (r) => readPassage(r, PLACES, false)],
];
