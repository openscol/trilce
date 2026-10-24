import { choose, order, readPassage, type ChoiceItem, type OrderItem, type Passage } from "../../../generators/lengua/bank";
import type { Row } from "./row";

// 1.° de Primaria · banco de comprensión: idea principal, inferencias,
// enseñanzas, propósito, personajes, secuencia y narrador, con cuentos y
// textos informativos para escuchar y para leer.


const REAL: ChoiceItem[] = [
  { a: "Un niño juega fútbol en el parque.", d: ["Un perro maneja un autobús.", "Una nube come helado.", "Un gato vuela hasta la luna."] },
  { a: "Mi mamá cocina arroz con pollo.", d: ["Una mesa canta una canción.", "Un pez camina por la calle.", "Un árbol conversa con el sol."] },
  { a: "La gallina pone un huevo.", d: ["La gallina lee el periódico.", "Un huevo baila en la cocina.", "Un caballo usa anteojos para leer."] },
  { a: "Llueve y la calle se moja.", d: ["Llueven caramelos del cielo.", "La lluvia canta una canción.", "Un paraguas sale volando y habla."] },
  { a: "El bebé duerme en su cuna.", d: ["El bebé maneja un camión.", "La cuna vuela por la ventana.", "Un oso de peluche hace la tarea."] },
  { a: "Un pájaro hace su nido en un árbol.", d: ["Un pájaro construye un castillo.", "Un árbol camina hasta el río.", "Un nido toca la guitarra."] },
  { a: "Los niños van a la escuela en bus.", d: ["Los niños van a la escuela en un dragón.", "El bus tiene alas y vuela.", "La escuela se muda sola a otra ciudad."] },
  { a: "Mi abuelo riega las plantas.", d: ["Las plantas riegan a mi abuelo.", "Una planta come pizza.", "Mi abuelo se vuelve invisible."] },
];

const PICTURE_TOPIC: ChoiceItem[] = [
  { pic: "🎂🎈🎁", a: "Una fiesta de cumpleaños", d: ["Un día de lluvia", "Una clase de matemáticas", "Un viaje en tren"] },
  { pic: "🏖️🌊☀️", a: "Un día en la playa", d: ["Una noche de invierno", "Una fiesta en casa", "Un partido de fútbol"] },
  { pic: "⚽🥅🏃", a: "Un partido de fútbol", d: ["Una carrera de autos", "Una clase de música", "Un picnic"] },
  { pic: "🌧️☔👢", a: "Un día de lluvia", d: ["Un día de sol en la playa", "Una fiesta", "Una carrera"] },
  { pic: "🍎🥕🧀🍞", a: "Comida", d: ["Juguetes", "Animales", "Ropa"] },
  { pic: "🐶🐱🐰🐹", a: "Mascotas", d: ["Frutas", "Vehículos", "Útiles escolares"] },
  { pic: "✏️📓📏🎒", a: "Útiles escolares", d: ["Comida", "Instrumentos musicales", "Animales de la granja"] },
  { pic: "🚗🚌🚲✈️", a: "Medios de transporte", d: ["Frutas", "Juguetes de playa", "Ropa de invierno"] },
  { pic: "🎸🥁🎹🎺", a: "Instrumentos musicales", d: ["Herramientas", "Comida", "Medios de transporte"] },
];

const MAIN_IDEA: Passage[] = [
  { title: "Las abejas", emoji: "🐝", text: "Las abejas son insectos muy trabajadores. Vuelan de flor en flor para buscar néctar. Con el néctar fabrican miel. Las abejas también ayudan a que crezcan nuevas plantas.",
    qs: [
      { q: "¿Cuál es la idea principal del texto?", a: "Las abejas trabajan mucho y son útiles.", d: ["Las flores tienen muchos colores bonitos.", "La miel es dulce y se come con pan.", "Los insectos pequeños nos dan miedo."] },
      { q: "¿Cuál es el tema del texto?", a: "Las abejas", d: ["Las flores", "La miel", "Los colores"] },
    ] },
  { title: "Cuidar los dientes", emoji: "🪥", text: "Es importante cepillarse los dientes después de comer. El cepillo quita los restos de comida. Si no nos cepillamos, pueden salir caries. También debemos visitar al dentista.",
    qs: [
      { q: "¿Cuál es la idea principal del texto?", a: "Debemos cuidar nuestros dientes.", d: ["Los dentistas son muy altos.", "La comida siempre es muy rica.", "El cepillo es de muchos colores."] },
      { q: "¿Cuál es el tema del texto?", a: "El cuidado de los dientes", d: ["Las comidas favoritas", "Los colores del cepillo", "Los juguetes del dentista"] },
    ] },
  { title: "El otoño", emoji: "🍂", text: "En otoño, las hojas de los árboles cambian de color. Se ponen amarillas, rojas y marrones. Luego caen al suelo. Los días se vuelven más frescos.",
    qs: [
      { q: "¿Cuál es la idea principal del texto?", a: "En otoño cambian los árboles y el clima.", d: ["Los árboles son muy altos en otoño.", "El suelo del parque es duro y frío.", "Las hojas son verdes durante todo el año."] },
      { q: "¿Cuál es el tema del texto?", a: "El otoño", d: ["El verano", "Los animales", "La playa"] },
    ] },
  { title: "La llama", emoji: "🦙", text: "La llama es un animal de los Andes. Tiene el cuello largo y mucha lana. La gente usa su lana para hacer ropa abrigadora. Las llamas también pueden cargar cosas por los cerros.",
    qs: [
      { q: "¿Cuál es la idea principal del texto?", a: "La llama es un animal útil de los Andes.", d: ["La ropa de lana es muy abrigadora.", "Los cerros de los Andes son altos.", "El cuello de la llama es muy largo."] },
      { q: "¿Cuál es el tema del texto?", a: "La llama", d: ["La ropa", "Los cerros", "El frío"] },
    ] },
];

const FEELINGS: ChoiceItem[] = (
  [
    ["😀", "Feliz"], ["😢", "Triste"], ["😠", "Enojado"], ["😨", "Asustado"], ["😲", "Sorprendido"], ["😴", "Con sueño"], ["🤒", "Enfermo"], ["😳", "Avergonzado"],
  ] as const
).map(([pic, a], _, all) => ({ pic, a, d: all.map(([, f]) => f).filter((f) => f !== a) }));

const WHAT_NEXT: ChoiceItem[] = [
  { t: "Lucía deja caer un vaso de vidrio al suelo.", a: "El vaso se romperá.", d: ["El vaso volará.", "El vaso se volverá de oro.", "Lucía se dormirá."] },
  { t: "Empieza a llover y Pedro no tiene paraguas.", a: "Pedro se mojará.", d: ["Pedro se secará.", "Saldrá un arcoíris dentro de su casa.", "Pedro comerá pan."] },
  { t: "Ana pone una semilla en la tierra y la riega todos los días.", a: "Crecerá una planta.", d: ["Saldrá un gato.", "La tierra se volverá agua.", "La semilla cantará."] },
  { t: "Tomás tiene mucho sueño y se acuesta en su cama.", a: "Tomás se dormirá.", d: ["Tomás irá a nadar.", "Tomás correrá una carrera.", "Tomás pintará la pared."] },
  { t: "El helado está al sol en un día muy caluroso.", a: "El helado se derretirá.", d: ["El helado se congelará más.", "El helado crecerá.", "El helado se irá caminando."] },
  { t: "Mamá saca un pastel con velas y todos cantan «Feliz cumpleaños».", a: "Alguien soplará las velas.", d: ["Todos se irán a dormir.", "El pastel saldrá volando.", "Lloverá dentro de la casa."] },
];

const INFERENCES: Passage[] = [
  { title: "Sofía sale a jugar", emoji: "🧤", text: "Sofía se puso su abrigo, su gorro y sus guantes. Salió y vio todo blanco. Hizo una bola y se la lanzó a su hermano.",
    qs: [{ q: "¿Qué tiempo hace?", a: "Hace frío y hay nieve.", d: ["Hace mucho calor.", "Está lloviendo.", "Hay sol en la playa."] }] },
  { title: "La merienda de Leo", emoji: "🥛", text: "Leo tenía un vaso de leche y un plato con galletas. Al rato, el vaso y el plato estaban vacíos. Leo sonreía con un bigote blanco.",
    qs: [{ q: "¿Qué pasó?", a: "Leo comió las galletas y tomó la leche.", d: ["Leo regaló las galletas.", "El perro comió las galletas.", "Leo no tenía hambre."] }] },
  { title: "El trueno", emoji: "⛈️", text: "Carla escuchó un trueno muy fuerte. Corrió a abrazar a su mamá y cerró los ojos.",
    qs: [{ q: "¿Cómo se sentía Carla?", a: "Asustada", d: ["Feliz", "Aburrida", "Enojada"] }] },
  { title: "El señor Ruiz", emoji: "✉️", text: "El señor Ruiz lleva cartas y paquetes a todas las casas del barrio. Usa una gorra y carga una bolsa grande.",
    qs: [{ q: "¿Quién es el señor Ruiz?", a: "El cartero", d: ["El doctor", "El panadero", "El bombero"] }] },
];

const RIDDLES: ChoiceItem[] = [
  { t: "Tengo orejas largas, como zanahorias y salto mucho. ¿Qué soy?", a: "🐰 un conejo", d: ["🐱 un gato", "🐶 un perro", "🐸 una rana"] },
  { t: "Salgo de noche y brillo en el cielo. A veces estoy redonda. ¿Qué soy?", a: "🌙 la luna", d: ["☀️ el sol", "☁️ una nube", "🔥 el fuego"] },
  { t: "Tengo hojas, pero no soy árbol. Si me lees, te cuento historias. ¿Qué soy?", a: "📖 un libro", d: ["🌳 un árbol", "✏️ un lápiz", "🎈 un globo"] },
  { t: "Tengo agujas, pero no sé coser. Te digo la hora. ¿Qué soy?", a: "⌚ un reloj", d: ["🧵 un hilo", "✂️ una tijera", "📖 un libro"] },
  { t: "Soy amarillo por fuera y blanco por dentro. Los monos me comen. ¿Qué soy?", a: "🍌 un plátano", d: ["🍋 un limón", "🌽 un choclo", "🍎 una manzana"] },
  { t: "Vivo en el mar y tengo ocho brazos. ¿Qué soy?", a: "🐙 un pulpo", d: ["🐟 un pez", "🐳 una ballena", "🦀 un cangrejo"] },
  { t: "Tengo cuatro patas y un respaldo, pero no camino. Te sientas en mí. ¿Qué soy?", a: "🪑 una silla", d: ["🛏️ una cama", "🐴 un caballo", "🚪 una puerta"] },
];

const FABLES: Passage[] = [
  { title: "La hormiga y la cigarra", emoji: "🐜", text: "En verano, la hormiga guardaba comida todos los días. La cigarra solo cantaba y se reía de ella. Llegó el invierno y la cigarra no tenía comida. La hormiga sí tenía, porque había trabajado.",
    qs: [{ q: "¿Qué enseña el cuento?", a: "Es bueno trabajar y prepararse para el futuro.", d: ["Cantar todo el día es lo más importante.", "Las hormigas son pequeñas pero fuertes.", "El invierno es la estación más divertida."] }] },
  { title: "El león y el ratón", emoji: "🦁", text: "Un león atrapó a un ratón, pero lo dejó ir. Días después, el león cayó en una red. El ratón mordió la red y lo liberó. El león le dio las gracias.",
    qs: [{ q: "¿Qué enseña el cuento?", a: "Hasta los pequeños pueden ayudar a los grandes.", d: ["Los leones siempre son malos con todos.", "Las redes de los cazadores son muy fuertes.", "A los ratones les gusta mucho el queso."] }] },
  { title: "El pastorcito mentiroso", emoji: "🐑", text: "Un pastor gritaba «¡Viene el lobo!» para burlarse de la gente. Todos corrían a ayudarlo y no había lobo. Un día el lobo vino de verdad. El pastor gritó, pero nadie le creyó.",
    qs: [{ q: "¿Qué enseña el cuento?", a: "Si mientes, después no te creerán.", d: ["Los lobos siempre comen ovejas.", "Gritar en el campo es divertido.", "Los pastores cuidan muchas ovejas."] }] },
];

const PURPOSES = ["Dar información", "Contar una historia", "Explicar cómo hacer algo", "Invitar a hacer algo"];
const PURPOSE: ChoiceItem[] = (
  [
    ["Los delfines son mamíferos. Respiran aire y viven en el mar.", 0],
    ["Había una vez un dragón que tenía miedo de la oscuridad.", 1],
    ["Primero, pon el pan en el plato. Después, úntale mantequilla. Al final, ponle queso.", 2],
    ["Las plantas necesitan agua, luz y tierra para crecer.", 0],
    ["Un día, un gato y un ratón se hicieron amigos y viajaron juntos.", 1],
    ["Para lavarte las manos: mójalas, ponles jabón, frótalas y enjuágalas.", 2],
    ["¡Ven a la feria del colegio! Habrá juegos y comida rica. ¡No te la pierdas!", 3],
  ] as const
).map(([t, i]) => ({ t, a: PURPOSES[i], d: PURPOSES.filter((_, k) => k !== i) }));

const DESCRIBED: ChoiceItem[] = [
  { t: "Es un animal grande y gris, con una trompa larga.", a: "🐘", d: ["🦒", "🐻", "🐭"] },
  { t: "Es una fruta roja y redonda.", a: "🍎", d: ["🍌", "🍇", "🍋"] },
  { t: "Es largo, tiene vagones y viaja sobre rieles.", a: "🚂", d: ["🚗", "✈️", "⛵"] },
  { t: "Es pequeña, tiene alas de colores y vuela entre las flores.", a: "🦋", d: ["🐝", "🐦", "🐞"] },
  { t: "Es frío y blanco, y cae del cielo en invierno.", a: "❄️", d: ["🌧️", "☀️", "🔥"] },
  { t: "Tiene el cuello muy largo y manchas marrones.", a: "🦒", d: ["🐘", "🦓", "🐴"] },
  { t: "Es amarillo, brilla en el cielo y nos da calor.", a: "☀️", d: ["🌙", "⭐", "☁️"] },
];

const SETTING_CHARACTER: ChoiceItem[] = [
  { t: "El cuento pasa en un lugar con arena, olas y sol.", p: "¿Dónde pasa el cuento?", a: "En la playa", d: ["En la montaña", "En la escuela", "En el bosque"] },
  { t: "El cuento pasa entre árboles altos, donde viven búhos y ardillas.", p: "¿Dónde pasa el cuento?", a: "En el bosque", d: ["En el mar", "En la ciudad", "En un castillo"] },
  { t: "La historia ocurre en un salón con pizarra, carpetas y una maestra.", p: "¿Dónde pasa el cuento?", a: "En la escuela", d: ["En la playa", "En un barco", "En el bosque"] },
  { t: "El personaje usa corona y vive en un castillo.", p: "¿Quién es el personaje?", a: "Un rey", d: ["Un pirata", "Un doctor", "Un granjero"] },
  { t: "El personaje apaga incendios y maneja un camión rojo.", p: "¿Quién es el personaje?", a: "Un bombero", d: ["Un cartero", "Un cocinero", "Un pirata"] },
  { t: "El personaje tiene un barco, un parche en el ojo y busca tesoros.", p: "¿Quién es el personaje?", a: "Un pirata", d: ["Un rey", "Un bombero", "Un doctor"] },
];

const TRAITS: ChoiceItem[] = [
  { t: "Pedro le dijo a su hermana: «¿Quieres la mitad de mi galleta?».", p: "¿Cómo es Pedro?", a: "Generoso", d: ["Egoísta", "Miedoso", "Perezoso"] },
  { t: "Ana se quedó en la cama todo el día y no quiso ayudar a nadie.", p: "¿Cómo es Ana?", a: "Perezosa", d: ["Trabajadora", "Valiente", "Generosa"] },
  { t: "Luis gritó: «¡No es justo! ¡Yo quiero jugar primero!», y pateó la pelota.", p: "¿Cómo se siente Luis?", a: "Enojado", d: ["Contento", "Tranquilo", "Cansado"] },
  { t: "Sara ayudó a un niño que se había caído y lo llevó con la maestra.", p: "¿Cómo es Sara?", a: "Amable", d: ["Grosera", "Perezosa", "Egoísta"] },
  { t: "Tomás entró solo a la cueva oscura para rescatar a su perrito.", p: "¿Cómo es Tomás?", a: "Valiente", d: ["Miedoso", "Perezoso", "Aburrido"] },
  { t: "Mía dijo: «¡Qué lindo día! ¡Me encanta jugar con ustedes!».", p: "¿Cómo se siente Mía?", a: "Contenta", d: ["Triste", "Enojada", "Asustada"] },
];

const STORY_ORDER: OrderItem[] = [
  { seq: ["🥚 huevo", "🐣 nace", "🐥 pollito", "🐔 gallina"] },
  { seq: ["🌰 semilla", "🌱 brote", "🌳 árbol"] },
  { seq: ["🛏️ despertar", "🪥 cepillarse", "🥣 desayunar", "🎒 ir a la escuela"] },
  { seq: ["🐛 oruga", "🟤 capullo", "🦋 mariposa"] },
  { seq: ["🎂 preparar el pastel", "🕯️ encender las velas", "🌬️ soplar las velas", "🍰 comer el pastel"] },
  { seq: ["🌧️ llueve", "☀️ sale el sol", "🌈 aparece el arcoíris"] },
];

const INFO_ORDER: OrderItem[] = [
  { read: { title: "Cómo se hace el pan", emoji: "🍞", text: "El panadero mezcla harina, agua y levadura. Luego amasa la masa. Después la deja crecer. Al final la mete al horno." },
    seq: ["Mezcla los ingredientes", "Amasa la masa", "Deja crecer la masa", "Mete la masa al horno"] },
  { read: { title: "La rana", emoji: "🐸", text: "Primero, la rana pone huevos en el agua. De los huevos salen renacuajos. A los renacuajos les salen patas. Al final se convierten en ranas." },
    seq: ["Pone huevos", "Salen renacuajos", "Les salen patas", "Se convierten en ranas"] },
  { read: { title: "Lavarse los dientes", emoji: "🪥", text: "Pon pasta en el cepillo. Cepilla todos los dientes. Al final, enjuágate la boca con agua." },
    seq: ["Poner pasta en el cepillo", "Cepillar los dientes", "Enjuagar la boca"] },
  { read: { title: "La planta", emoji: "🌱", text: "La semilla está bajo la tierra. Con agua, le sale una raíz. Luego sale un tallo con hojas. Al final, la planta da flores." },
    seq: ["Sale una raíz", "Sale un tallo con hojas", "La planta da flores"] },
];

const PROBLEM_SOLUTION: Passage[] = [
  { title: "El gato en el árbol", emoji: "🐱", text: "Michi subió a un árbol muy alto. Después no podía bajar y maullaba asustado. Papá trajo una escalera, subió despacio y bajó a Michi. ¡Michi le lamió la mano!",
    qs: [
      { q: "¿Cuál es el problema?", a: "Michi no podía bajar del árbol.", d: ["Michi tenía mucha hambre y sed.", "Papá perdió la escalera del patio.", "Michi estaba enfermo en su cama."] },
      { q: "¿Cómo se soluciona?", a: "Papá subió con una escalera y lo bajó.", d: ["Michi saltó solo desde la rama más alta.", "Llamaron a un perro para que lo bajara.", "Cortaron el árbol para que Michi baje."] },
    ] },
  { title: "La cometa rota", emoji: "🪁", text: "Valentina quería volar su cometa, pero tenía un hueco grande. Estaba triste. Su abuelo la ayudó a tapar el hueco con papel y pegamento. ¡La cometa voló muy alto!",
    qs: [
      { q: "¿Cuál es el problema?", a: "La cometa tenía un hueco.", d: ["No había viento.", "Valentina perdió la cometa.", "El abuelo estaba enfermo."] },
      { q: "¿Cómo se soluciona?", a: "Taparon el hueco con papel y pegamento.", d: ["Compraron otra cometa en la tienda.", "Esperaron a que llegara más viento.", "La tiraron a la basura y se fueron."] },
    ] },
  { title: "El lápiz perdido", emoji: "✏️", text: "Joaquín no encontraba su lápiz para hacer la tarea. Buscó en su mochila y en su mesa. Su hermana lo encontró debajo de la cama. Joaquín pudo hacer su tarea.",
    qs: [
      { q: "¿Cuál es el problema?", a: "Joaquín no encontraba su lápiz.", d: ["Joaquín no tenía tarea ese día.", "La mochila de Joaquín estaba rota.", "La hermana de Joaquín estaba triste."] },
      { q: "¿Cómo se soluciona?", a: "Su hermana encontró el lápiz debajo de la cama.", d: ["Joaquín compró un lápiz nuevo en la tienda.", "Joaquín hizo la tarea con un crayón rojo.", "Joaquín decidió no hacer la tarea ese día."] },
    ] },
];

const PLOT: Passage[] = [
  { title: "El dragón dormilón", emoji: "🐉", text: "En un castillo vivía un dragón que dormía todo el día. Los niños del pueblo querían jugar con él. Un día tocaron tambores muy fuerte. El dragón despertó, sonrió y jugó con ellos toda la tarde.",
    qs: [
      { q: "¿Quién es el personaje principal?", a: "Un dragón", d: ["Un rey", "Un caballo", "Una princesa"] },
      { q: "¿Dónde pasa el cuento?", a: "En un castillo", d: ["En el mar", "En la selva", "En la escuela"] },
      { q: "¿Cómo termina el cuento?", a: "El dragón jugó con los niños.", d: ["El dragón se fue volando.", "Los niños se asustaron.", "El castillo se cayó."] },
    ] },
  { title: "La fiesta de Martina", emoji: "🎉", text: "Martina preparó una fiesta en su jardín e invitó a sus amigos del colegio. Pero empezó a llover. Todos entraron a la casa y bailaron en la sala. ¡Fue la mejor fiesta!",
    qs: [
      { q: "¿Quién es el personaje principal?", a: "Martina", d: ["La maestra", "Un perro", "Su abuelo"] },
      { q: "¿Qué problema hubo?", a: "Empezó a llover.", d: ["No llegó nadie.", "Se acabó la comida.", "Se perdió la música."] },
      { q: "¿Cómo termina el cuento?", a: "Bailaron en la sala.", d: ["Cancelaron la fiesta.", "Se mojaron en el jardín.", "Se fueron al cine."] },
    ] },
];

const NARRATOR: ChoiceItem[] = [
  "Yo fui al zoológico con mi papá. Vi un león enorme.",
  "Luis fue al zoológico con su papá. Vio un león enorme.",
  "Me desperté temprano y preparé mi mochila.",
  "Ana se despertó temprano y preparó su mochila.",
  "Mi perro y yo corrimos por el parque.",
  "El perro de Sofía corrió por el parque.",
  "Ayer aprendí a nadar en la piscina.",
  "Ayer Tomás aprendió a nadar en la piscina.",
].map((t, i) => {
  const a = i % 2 === 0 ? "Un personaje del cuento (dice «yo»)" : "Alguien que no está en el cuento";
  return { t, a, d: [i % 2 === 0 ? "Alguien que no está en el cuento" : "Un personaje del cuento (dice «yo»)"] };
});

const TEXT_FEATURES: ChoiceItem[] = [
  { p: "¿Qué parte del texto dice de qué trata, al inicio y con letras grandes?", a: "El título", d: ["El pie de foto", "El índice", "El número de página"] },
  { p: "¿Cómo se llaman las palabras que explican una foto?", a: "El pie de foto", d: ["El título", "El autor", "El índice"] },
  { p: "¿Qué parte de un libro te dice en qué página está cada tema?", a: "El índice", d: ["El título", "La portada", "El dibujo"] },
  { p: "¿Cómo se llama la persona que escribió el libro?", a: "El autor", d: ["El ilustrador", "El lector", "El título"] },
  { p: "¿Cómo se llama la persona que hace los dibujos de un libro?", a: "El ilustrador", d: ["El autor", "El lector", "El índice"] },
  { p: "¿Qué parte del libro está adelante, con el título y un dibujo?", a: "La portada", d: ["El índice", "La última página", "El pie de foto"] },
  { p: "En un texto, las palabras en negrita (más oscuras) sirven para...", a: "Mostrar palabras importantes", d: ["Decir que la palabra está mal", "Adornar la página", "Indicar el final"] },
];

const LIT_ALOUD: Record<string, Passage[]> = {
  fantasia: [
    { title: "La nube que quería ser lluvia", emoji: "☁️", text: "Había una nube pequeña que quería ser lluvia. Las otras nubes le decían: «Eres muy chiquita». La nube tomó mucho vapor del mar y creció y creció. Un día, por fin, llovió sobre un campo de flores. ¡Las flores le dieron las gracias!",
      qs: [
        { q: "¿Qué quería ser la nube?", a: "Lluvia", d: ["Sol", "Estrella"] },
        { q: "¿Cómo creció la nube?", a: "Tomando vapor del mar", d: ["Durmiendo mucho", "Comiendo flores"] },
        { q: "¿Quiénes le dieron las gracias?", a: "Las flores", d: ["Las otras nubes", "El mar"] },
      ] },
    { title: "El robot que aprendió a reír", emoji: "🤖", text: "Bip era un robot que no sabía reír. Su amiga Lola le contó un chiste sobre un pato con zapatos. Bip pensó y pensó. De pronto hizo: «¡Ja, ja, bip!». Desde ese día, Bip ríe todas las mañanas.",
      qs: [
        { q: "¿Quién es Bip?", a: "Un robot", d: ["Un pato", "Un niño"] },
        { q: "¿Qué le contó Lola?", a: "Un chiste", d: ["Un cuento de miedo", "Un secreto"] },
        { q: "¿Qué hace Bip ahora?", a: "Ríe todas las mañanas", d: ["Llora", "Duerme todo el día"] },
      ] },
  ],
  realista: [
    { title: "El primer día de clases", emoji: "🏫", text: "Mateo estaba nervioso por su primer día en el colegio. No conocía a nadie. En el recreo, una niña llamada Rosa lo invitó a jugar a la pelota. Al final del día, Mateo tenía una nueva amiga.",
      qs: [
        { q: "¿Cómo se sentía Mateo al inicio?", a: "Nervioso", d: ["Aburrido", "Enojado"] },
        { q: "¿Quién lo invitó a jugar?", a: "Rosa", d: ["La maestra", "Su hermano"] },
        { q: "¿Qué tenía Mateo al final del día?", a: "Una nueva amiga", d: ["Una pelota nueva", "Mucha tarea"] },
      ] },
    { title: "La mascota de Camila", emoji: "🐶", text: "Camila quería un perro. Su mamá le dijo que primero debía aprender a cuidarlo. Camila leyó libros sobre perros y ayudó a cuidar al perro de su vecino. Un mes después, adoptaron a Pipo.",
      qs: [
        { q: "¿Qué quería Camila?", a: "Un perro", d: ["Un gato", "Una bicicleta"] },
        { q: "¿Qué tuvo que aprender?", a: "A cuidar un perro", d: ["A nadar", "A cocinar"] },
        { q: "¿Cómo se llama el perro?", a: "Pipo", d: ["Rocky", "Michi"] },
      ] },
  ],
  poesia: [
    { title: "El caracol viajero", emoji: "🐌", text: "Un caracol muy lento\nquiso conocer el mar.\nCaminó con su casita\nsin dejar de avanzar.\nTardó toda una semana,\nllegó sin descansar,\ny al ver las olas grandes\nse puso a cantar.",
      qs: [
        { q: "¿Qué quería conocer el caracol?", a: "El mar", d: ["El sol", "El bosque"] },
        { q: "¿Cuánto tardó?", a: "Toda una semana", d: ["Un solo día", "Casi un año entero"] },
        { q: "¿Qué hizo al ver las olas?", a: "Se puso a cantar", d: ["Se durmió", "Se fue a su casa"] },
      ] },
    { title: "La gallina y el maíz", emoji: "🐔", text: "La gallina Beatriz\nencontró un grano de maíz.\nLo sembró en el patio\ny lo regó feliz.\nCreció una planta alta\ncon choclos de oro,\ny la gallina dijo:\n«¡Qué rico tesoro!».",
      qs: [
        { q: "¿Qué encontró la gallina?", a: "Un grano de maíz", d: ["Una piedra", "Un gusano pequeño"] },
        { q: "¿Dónde lo sembró?", a: "En el patio", d: ["En el río", "En la cocina"] },
        { q: "¿Qué creció?", a: "Una planta alta", d: ["Un manzano", "Una flor amarilla"] },
      ] },
  ],
};

const LIT_ALONE: Record<string, Passage[]> = {
  animales: [
    { title: "El conejo que no quería dormir", emoji: "🐰", text: "Tito el conejo nunca quería dormir. Por la noche saltaba y saltaba. Un día estaba tan cansado que se durmió en plena carrera. Desde entonces, Tito se acuesta temprano.",
      qs: [
        { q: "¿Qué no quería hacer Tito?", a: "Dormir", d: ["Comer", "Saltar"] },
        { q: "¿Qué le pasó un día?", a: "Se durmió en plena carrera", d: ["Se perdió", "Ganó un premio"] },
        { q: "¿Qué hace Tito ahora?", a: "Se acuesta temprano", d: ["Salta toda la noche", "No come"] },
      ] },
    { title: "La jirafa y el pajarito", emoji: "🦒", text: "La jirafa Gina era la más alta del bosque. Un pajarito perdió su nido en lo alto de un árbol. Nadie lo podía alcanzar, pero Gina estiró su cuello y se lo devolvió. El pajarito cantó para ella toda la tarde.",
      qs: [
        { q: "¿Quién era la más alta del bosque?", a: "Gina, la jirafa", d: ["El pajarito", "Un elefante"] },
        { q: "¿Qué perdió el pajarito?", a: "Su nido", d: ["Su comida", "Su canción"] },
        { q: "¿Cómo ayudó Gina?", a: "Estiró su cuello", d: ["Trepó el árbol", "Llamó a su mamá"] },
      ] },
  ],
  realista: [
    { title: "La huerta de la escuela", emoji: "🥬", text: "Los niños de primer grado hicieron una huerta. Sembraron lechugas y tomates. Cada día regaban las plantas. Después de unas semanas, prepararon una ensalada para toda la clase.",
      qs: [
        { q: "¿Quiénes hicieron la huerta?", a: "Los niños de primer grado", d: ["Los papás del colegio", "La directora y los profesores"] },
        { q: "¿Qué sembraron?", a: "Lechugas y tomates", d: ["Papas y zanahorias", "Flores de muchos colores"] },
        { q: "¿Qué prepararon al final?", a: "Una ensalada", d: ["Un pastel", "Una sopa caliente"] },
      ] },
    { title: "Andrés y su bicicleta", emoji: "🚲", text: "Andrés tenía una bicicleta nueva, pero se caía mucho. Su hermana le sostenía el asiento mientras pedaleaba. Practicó todos los días. Una tarde, ¡Andrés pedaleó solo hasta la esquina!",
      qs: [
        { q: "¿Qué tenía Andrés?", a: "Una bicicleta nueva", d: ["Unos patines rojos", "Una pelota de fútbol"] },
        { q: "¿Quién lo ayudó?", a: "Su hermana", d: ["Su abuelo", "Su amigo"] },
        { q: "¿Qué logró al final?", a: "Pedalear solo", d: ["Ganar una carrera", "Arreglar la bicicleta"] },
      ] },
  ],
  fabulas: [
    { title: "La zorra y las uvas", emoji: "🦊", text: "Una zorra vio unas uvas en lo alto de una parra. Saltó una y otra vez, pero no las alcanzó. Cansada, se fue diciendo: «Seguro están verdes». En realidad, las uvas estaban maduras.",
      qs: [
        { q: "¿Qué quería la zorra?", a: "Las uvas", d: ["Agua", "Un conejo"] },
        { q: "¿Por qué no comió las uvas?", a: "Porque no las alcanzó", d: ["Porque no tenía hambre", "Porque eran de plástico"] },
        { q: "¿Qué enseña la fábula?", a: "A veces decimos que no queríamos algo que no pudimos conseguir.", d: ["Las zorras son rápidas.", "Las uvas siempre están verdes."] },
      ] },
    { title: "El sol y el viento", emoji: "☀️", text: "El sol y el viento discutían sobre quién era más fuerte. Vieron a un hombre con abrigo. El viento sopló muy fuerte, pero el hombre se abrigó más. Luego el sol brilló suavemente y el hombre se quitó el abrigo.",
      qs: [
        { q: "¿Qué discutían el sol y el viento?", a: "Quién era más fuerte", d: ["Quién era más bonito", "Quién llegaba primero"] },
        { q: "¿Quién logró que el hombre se quitara el abrigo?", a: "El sol", d: ["El viento", "La lluvia"] },
        { q: "¿Qué enseña la fábula?", a: "La amabilidad logra más que la fuerza.", d: ["El viento es frío.", "Los abrigos son caros."] },
      ] },
  ],
};

const INFO_ALOUD: Record<string, Passage[]> = {
  ciencia: [
    { title: "El agua", emoji: "💧", text: "El agua puede estar en tres estados. Cuando es sólida, es hielo. Cuando es líquida, la podemos tomar. Cuando se calienta mucho, se vuelve vapor y sube al cielo.",
      qs: [
        { q: "¿Cómo se llama el agua sólida?", a: "Hielo", d: ["Vapor", "Lluvia"] },
        { q: "¿Qué pasa cuando el agua se calienta mucho?", a: "Se vuelve vapor", d: ["Se vuelve hielo", "Se vuelve tierra"] },
        { q: "¿En cuántos estados puede estar el agua?", a: "Tres", d: ["Dos", "Cinco"] },
      ] },
    { title: "Las plantas", emoji: "🌿", text: "Las plantas necesitan agua, luz del sol y aire para vivir. Sus raíces toman agua de la tierra. Sus hojas usan la luz del sol para fabricar su alimento.",
      qs: [
        { q: "¿Qué toman las raíces?", a: "Agua de la tierra", d: ["Luz del sol", "Piedras del suelo"] },
        { q: "¿Qué usan las hojas para fabricar alimento?", a: "La luz del sol", d: ["La lluvia fría", "La tierra mojada"] },
        { q: "¿Qué necesitan las plantas para vivir?", a: "Agua, luz y aire", d: ["Solo tierra y piedras", "Juguetes y música"] },
      ] },
  ],
  famosos: [
    { title: "Neil Armstrong", emoji: "🚀", text: "Neil Armstrong fue un astronauta. En el año 1969 viajó a la Luna en una nave espacial. Fue la primera persona en caminar sobre la Luna.",
      qs: [
        { q: "¿Qué era Neil Armstrong?", a: "Un astronauta", d: ["Un doctor", "Un pintor"] },
        { q: "¿A dónde viajó?", a: "A la Luna", d: ["Al fondo del mar", "A la selva"] },
        { q: "¿Qué hizo antes que nadie?", a: "Caminar sobre la Luna", d: ["Volar en avión", "Nadar en el mar"] },
      ] },
    { title: "Marie Curie", emoji: "🔬", text: "Marie Curie fue una científica. Estudió mucho y descubrió cosas nuevas sobre la materia. Ganó dos premios Nobel, que son premios muy importantes.",
      qs: [
        { q: "¿Qué era Marie Curie?", a: "Una científica", d: ["Una cantante", "Una futbolista"] },
        { q: "¿Cuántos premios Nobel ganó?", a: "Dos", d: ["Uno", "Cinco"] },
      ] },
    { title: "Ludwig van Beethoven", emoji: "🎼", text: "Beethoven fue un músico que compuso obras muy famosas. Con los años se quedó sordo, es decir, dejó de oír. Aun así, siguió componiendo música.",
      qs: [
        { q: "¿Qué hacía Beethoven?", a: "Componía música", d: ["Pintaba cuadros", "Construía casas"] },
        { q: "¿Qué le pasó con los años?", a: "Se quedó sordo", d: ["Se quedó ciego", "Se fue a vivir al mar"] },
        { q: "¿Qué hizo después?", a: "Siguió componiendo", d: ["Dejó la música", "Se puso a pintar"] },
      ] },
  ],
  comida: [
    { title: "La papa", emoji: "🥔", text: "La papa crece debajo de la tierra. En el Perú hay miles de variedades de papa. Con ella se preparan muchos platos, como la papa a la huancaína y el puré.",
      qs: [
        { q: "¿Dónde crece la papa?", a: "Debajo de la tierra", d: ["En los árboles altos", "Dentro del agua del río"] },
        { q: "¿Cuántas variedades de papa hay en el Perú?", a: "Miles", d: ["Solo dos", "Unas diez"] },
        { q: "¿Qué plato se prepara con papa?", a: "Papa a la huancaína", d: ["Ceviche de pescado", "Helado de fresa"] },
      ] },
    { title: "La leche", emoji: "🥛", text: "La leche viene de animales como la vaca y la cabra. Tiene calcio, que ayuda a tener huesos fuertes. Con la leche se hace queso, yogur y mantequilla.",
      qs: [
        { q: "¿De dónde viene la leche?", a: "De animales como la vaca", d: ["De los árboles del bosque", "Del agua del mar"] },
        { q: "¿Qué ayuda a tener fuerte el calcio?", a: "Los huesos", d: ["El pelo largo", "Las uñas"] },
        { q: "¿Qué se hace con la leche?", a: "Queso", d: ["Pan", "Jugo de naranja"] },
      ] },
  ],
};

const INFO_ALONE: Record<string, Passage[]> = {
  animales: [
    { title: "El cóndor andino", emoji: "🦅", text: "El cóndor andino es una de las aves voladoras más grandes del mundo. Vive en las montañas de los Andes. Puede volar mucho tiempo casi sin mover las alas, aprovechando el viento.",
      qs: [
        { q: "¿Dónde vive el cóndor andino?", a: "En los Andes", d: ["En el mar", "En la selva"] },
        { q: "¿Cómo vuela tanto tiempo?", a: "Aprovecha el viento", d: ["Come mucho antes", "Duerme mientras vuela"] },
        { q: "¿Qué tipo de animal es?", a: "Un ave", d: ["Un pez", "Un insecto"] },
      ] },
    { title: "El delfín", emoji: "🐬", text: "El delfín vive en el mar, pero no es un pez. Es un mamífero, como nosotros, y respira aire. Por eso sube a la superficie del agua para respirar.",
      qs: [
        { q: "¿El delfín es un pez?", a: "No, es un mamífero", d: ["Sí, es un pez grande", "Es un ave del mar"] },
        { q: "¿Para qué sube a la superficie?", a: "Para respirar", d: ["Para comer peces", "Para dormir"] },
      ] },
  ],
  deportes: [
    { title: "El fútbol", emoji: "⚽", text: "En el fútbol juegan dos equipos de once jugadores. Cada equipo trata de meter la pelota en el arco del otro. Solo el arquero puede tocar la pelota con las manos.",
      qs: [
        { q: "¿Cuántos jugadores tiene cada equipo?", a: "Once", d: ["Cinco", "Veinte"] },
        { q: "¿Quién puede tocar la pelota con las manos?", a: "El arquero", d: ["Todos los jugadores", "Nadie"] },
        { q: "¿Qué trata de hacer cada equipo?", a: "Meter la pelota en el arco del otro", d: ["Correr más rápido", "Saltar más alto"] },
      ] },
    { title: "Coleccionar figuritas", emoji: "📒", text: "A muchos niños les gusta coleccionar figuritas. Las pegan en un álbum y las cambian con sus amigos. Cuando completan el álbum, ¡se sienten muy felices!",
      qs: [
        { q: "¿Dónde pegan las figuritas?", a: "En un álbum", d: ["En la pared", "En la mesa"] },
        { q: "¿Qué hacen con sus amigos?", a: "Las cambian", d: ["Las rompen", "Las esconden"] },
      ] },
  ],
  lugares: [
    { title: "Machu Picchu", emoji: "⛰️", text: "Machu Picchu es una ciudad muy antigua construida por los incas. Está en lo alto de una montaña, en Cusco, Perú. Personas de todo el mundo la visitan cada año.",
      qs: [
        { q: "¿Quiénes construyeron Machu Picchu?", a: "Los incas", d: ["Los romanos", "Los egipcios"] },
        { q: "¿Dónde está Machu Picchu?", a: "En Cusco, Perú", d: ["En Lima", "En México"] },
        { q: "¿Quiénes la visitan?", a: "Personas de todo el mundo", d: ["Solo los niños", "Nadie"] },
      ] },
    { title: "El lago Titicaca", emoji: "🛶", text: "El lago Titicaca está entre Perú y Bolivia. Es un lago muy alto, en medio de las montañas. En él hay islas flotantes hechas de totora, una planta del lago.",
      qs: [
        { q: "¿Entre qué países está el lago Titicaca?", a: "Perú y Bolivia", d: ["Perú y Chile", "Ecuador y Colombia"] },
        { q: "¿De qué están hechas las islas flotantes?", a: "De totora", d: ["De piedra", "De madera"] },
      ] },
    { title: "La Torre Eiffel", emoji: "🗼", text: "La Torre Eiffel está en París, Francia. Es una torre muy alta hecha de hierro. De noche se ilumina con miles de luces.",
      qs: [
        { q: "¿Dónde está la Torre Eiffel?", a: "En París, Francia", d: ["En Lima, Perú", "En Madrid, España"] },
        { q: "¿De qué está hecha?", a: "De hierro", d: ["De madera", "De papel"] },
      ] },
  ],
};

export const ROWS: Row[] = [
  ["real-fantasia", (r) => choose(r, "¿Qué podría pasar en la vida real?", REAL)],

  ["de-que-trata-1", (r) => choose(r, "¿De qué trata el dibujo?", PICTURE_TOPIC)],
  ["de-que-trata-2", (r) => readPassage(r, MAIN_IDEA, false)],

  ["inferencias-1", (r) => choose(r, "¿Cómo se siente?", FEELINGS)],
  ["inferencias-2", (r) => choose(r, "¿Qué pasará después?", WHAT_NEXT)],
  ["inferencias-3", (r) => readPassage(r, INFERENCES, false)],
  ["inferencias-4", (r) => choose(r, "Adivina, adivinador.", RIDDLES)],
  ["ensenanza", (r) => readPassage(r, FABLES, false)],

  ["proposito", (r) => choose(r, "¿Para qué se escribió este texto?", PURPOSE)],

  ["personajes-1", (r) => choose(r, "¿Qué dibujo corresponde a la descripción?", DESCRIBED)],
  ["personajes-2", (r) => choose(r, "Lee y responde.", SETTING_CHARACTER)],
  ["personajes-3", (r) => choose(r, "Lee y responde.", TRAITS)],

  ["secuencia-1", (r) => order(r, "Ordena lo que pasa, del primero al último.", STORY_ORDER)],
  ["secuencia-2", (r) => order(r, "Lee el texto y ordena los pasos.", INFO_ORDER)],

  ["problema-solucion", (r) => readPassage(r, PROBLEM_SOLUTION, true)],
  ["elementos-cuento-1", (r) => readPassage(r, PLOT, false)],

  ["elementos-cuento-2", (r) => choose(r, "¿Quién cuenta la historia?", NARRATOR)],

  ["partes-texto", (r) => choose(r, "Elige la respuesta correcta.", TEXT_FEATURES)],

  ["cuentos-oidos-1", (r) => readPassage(r, LIT_ALOUD.fantasia, true)],
  ["cuentos-oidos-2", (r) => readPassage(r, LIT_ALOUD.realista, true)],
  ["cuentos-oidos-3", (r) => readPassage(r, LIT_ALOUD.poesia, true)],

  ["cuentos-1", (r) => readPassage(r, LIT_ALONE.animales, false)],
  ["cuentos-2", (r) => readPassage(r, LIT_ALONE.realista, false)],
  ["cuentos-3", (r) => readPassage(r, LIT_ALONE.fabulas, false)],

  ["textos-oidos-1", (r) => readPassage(r, INFO_ALOUD.ciencia, true)],
  ["textos-oidos-2", (r) => readPassage(r, INFO_ALOUD.famosos, true)],
  ["textos-oidos-3", (r) => readPassage(r, INFO_ALOUD.comida, true)],

  ["informativos-1", (r) => readPassage(r, INFO_ALONE.animales, false)],
  ["informativos-2", (r) => readPassage(r, INFO_ALONE.deportes, false)],
  ["informativos-3", (r) => readPassage(r, INFO_ALONE.lugares, false)],
];
