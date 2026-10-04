import { choose, order, pickAll, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "./row";

// Estrategias de escritura (IXL 2nd grade ELA, HH-NN).

export const SECTIONS: Section[] = [
  { id: "HH", name: "Organizar la escritura", icon: "🗂️" },
  { id: "II", name: "Oraciones temáticas", icon: "🎯" },
  { id: "JJ", name: "Conectores", icon: "🔗" },
  { id: "KK", name: "Propósito del autor", icon: "✍️" },
  { id: "LL", name: "Escribir opiniones", icon: "💬" },
  { id: "MM", name: "Detalles descriptivos", icon: "🎨" },
  { id: "NN", name: "Variedad de oraciones", icon: "🔀" },
];

// --- HH. Organizar ------------------------------------------------------------------

const SENTENCE_ORDER: OrderItem[] = [
  { seq: ["Primero, saqué el pan de la bolsa.", "Luego, le puse queso y tomate.", "Después, tapé el sándwich.", "Por último, me lo comí."] },
  { seq: ["Sonó el despertador.", "Me levanté y me lavé la cara.", "Tomé mi desayuno.", "Salí hacia la escuela."] },
  { seq: ["Sembramos una semilla en la maceta.", "La regamos todos los días.", "Salió un tallo verde.", "Al mes, nació una flor."] },
  { seq: ["Las nubes se pusieron grises.", "Empezaron a caer gotas.", "Abrimos el paraguas.", "Cuando paró la lluvia, salió el arcoíris."] },
  { seq: ["Mi equipo salió a la cancha.", "El árbitro tocó el silbato.", "Metimos un gol en el último minuto.", "Celebramos con un abrazo."] },
  { seq: ["Elegí un libro en la biblioteca.", "Se lo mostré a la bibliotecaria.", "Ella anotó mi nombre.", "Me llevé el libro a casa."] },
  { seq: ["Primero, moja el cepillo.", "Luego, ponle pasta dental.", "Después, cepilla tus dientes.", "Al final, enjuágate la boca."] },
];

// --- II. Oraciones temáticas ---------------------------------------------------------

const NOT_SUPPORT: ChoiceItem[] = [
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: Los perros son buenas mascotas.", a: "Las ballenas viven en el mar.", d: ["Cuidan la casa.", "Juegan con los niños.", "Hacen compañía."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: El verano es mi estación favorita.", a: "Mi mochila es azul.", d: ["Puedo ir a la playa.", "Hay vacaciones.", "Como helados."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: Leer es divertido.", a: "El fútbol se juega con una pelota.", d: ["Conoces historias nuevas.", "Imaginas otros mundos.", "Aprendes palabras."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: Hay que cuidar el agua.", a: "Los gatos tienen bigotes.", d: ["Cierra el caño al cepillarte.", "Sin agua no hay vida.", "Repara los caños que gotean."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: Mi abuela cocina muy rico.", a: "El carro de mi tío es rojo.", d: ["Su ají de gallina es famoso.", "Hace un arroz con leche delicioso.", "Todos repiten su sopa."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: Las frutas son saludables.", a: "Los lápices tienen punta.", d: ["Tienen vitaminas.", "Dan energía.", "Ayudan a no enfermarse."] },
  { p: "¿Qué detalle NO apoya la idea?", t: "Idea: El recreo es importante.", a: "La pizarra es verde.", d: ["Los niños descansan.", "Se juega con los amigos.", "Se come la lonchera."] },
];

const TOPIC_NARRATIVE: ChoiceItem[] = [
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Nos levantamos temprano y subimos al bus. En el zoológico vimos monos, osos y un león. Volvimos cansados, pero felices.", a: "Ayer fuimos de paseo al zoológico.", d: ["Los leones comen carne.", "Mi bus es de color verde.", "Me gusta dormir hasta tarde los domingos."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Primero se me cayó la lonchera. Luego olvidé mi cuaderno. Para colmo, llovió a la salida y no tenía paraguas.", a: "Hoy tuve un día de mala suerte.", d: ["La lluvia moja las calles.", "Mi cuaderno tiene forro rojo.", "Las loncheras son útiles."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Hubo globos, torta y una piñata. Vinieron todos mis primos. Mi regalo favorito fue una bicicleta.", a: "Mi cumpleaños fue una gran fiesta.", d: ["Las bicicletas tienen dos ruedas.", "Mis primos viven lejos.", "Los globos son de colores."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Estaba mojado y tiritaba de frío. Lo sequé con una toalla y le di leche. Ahora duerme a los pies de mi cama.", a: "Una noche encontré un gatito en mi puerta.", d: ["Las toallas de mi casa secan muy bien el agua.", "La leche es blanca.", "Mi cama es grande."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Armamos la carpa junto al río. De noche prendimos una fogata y contamos historias. Vimos más estrellas que nunca.", a: "El fin de semana fuimos de campamento.", d: ["Los ríos llevan agua.", "Las estrellas están muy lejos de la Tierra.", "Las carpas son de tela."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Me temblaban las piernas en el escenario. Respiré hondo y empecé a recitar. Al final, todos aplaudieron.", a: "Nunca olvidaré mi primera poesía en público.", d: ["Los escenarios de los teatros son muy altos.", "Mis piernas son largas.", "Respirar es necesario."] },
];

const TOPIC_EXPOSITORY: ChoiceItem[] = [
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Tienen plumas y pico. Ponen huevos. La mayoría puede volar.", a: "Las aves tienen características especiales.", d: ["Los huevos se comen fritos.", "Mi loro se llama Paco.", "Los aviones también vuelan muy alto en el cielo."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Bombea la sangre a todo el cuerpo. Late sin parar, de día y de noche. Si corres, late más rápido.", a: "El corazón es un órgano muy importante.", d: ["Correr por el parque es muy divertido.", "La sangre es roja.", "De noche dormimos."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Algunos van por tierra, como el bus y el tren. Otros van por agua, como el barco. Otros vuelan, como el avión.", a: "Hay muchos medios de transporte.", d: ["El tren hace mucho ruido al pasar.", "Los barcos flotan.", "Mi papá maneja un bus."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ En la costa hay desiertos y playas. En la sierra hay montañas nevadas. En la selva hay bosques y grandes ríos.", a: "El Perú tiene regiones muy distintas.", d: ["La nieve es fría.", "Los ríos de la selva tienen muchos peces.", "Me gusta la playa."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ Los dientes de leche se caen entre los seis y los doce años. Después salen los definitivos. Por eso hay que cepillarlos bien.", a: "Las personas tenemos dos juegos de dientes.", d: ["La leche es buena.", "Los cepillos tienen cerdas.", "A los seis años ya vas al colegio con uniforme."] },
  { p: "¿Qué oración empieza mejor este párrafo?", t: "___ El papel se puede volver a usar. Las botellas de plástico se convierten en otros objetos. Así hay menos basura.", a: "Reciclar ayuda a cuidar el planeta.", d: ["Las botellas de vidrio guardan agua.", "El papel es blanco.", "La basura huele mal."] },
];

// --- JJ. Conectores ---------------------------------------------------------------------

const CONJ: ChoiceItem[] = [
  { t: "Quiero salir a jugar, ___ está lloviendo.", a: "pero", d: ["y", "o", "porque"] },
  { t: "¿Prefieres jugo ___ limonada?", a: "o", d: ["pero", "ni", "y"] },
  { t: "Compré pan ___ queso.", a: "y", d: ["pero", "o", "ni"] },
  { t: "Mi papá ___ Inés vinieron a la fiesta.", a: "e", d: ["y", "o", "u"] },
  { t: "No tengo hambre ___ sed.", a: "ni", d: ["pero", "e", "u"] },
  { t: "¿Viste siete ___ ocho gaviotas?", a: "u", d: ["o", "e", "ni"] },
  { t: "El gato es pequeño, ___ muy valiente.", a: "pero", d: ["o", "ni", "porque"] },
  { t: "Lavé los platos ___ sequé los vasos.", a: "y", d: ["o", "ni", "u"] },
];

const SUBORD: ChoiceItem[] = [
  { t: "No fui al parque ___ estaba enfermo.", a: "porque", d: ["aunque", "si", "hasta que"] },
  { t: "Te llamo ___ llegue a casa.", a: "cuando", d: ["porque", "aunque", "si no"] },
  { t: "___ terminas la tarea, puedes ver tele.", a: "Si", d: ["Aunque", "Porque", "Hasta"] },
  { t: "Salimos a correr ___ hacía frío.", a: "aunque", d: ["porque", "si", "cuando no"] },
  { t: "Mi mamá cocina ___ yo pongo la mesa.", a: "mientras", d: ["porque", "si", "aunque"] },
  { t: "Espérame aquí ___ yo regrese.", a: "hasta que", d: ["porque", "aunque", "si"] },
  { t: "Me puse la casaca ___ no tener frío.", a: "para", d: ["aunque", "cuando", "si"] },
  { t: "Lávate las manos ___ comer.", a: "antes de", d: ["aunque", "porque", "si"] },
];

const TIME_WORDS = ["primero", "luego", "después", "al final", "por último", "antes", "entonces", "mientras tanto", "al día siguiente"];
const NOT_TIME_WORDS = ["mesa", "bonito", "correr", "verde", "debajo", "rápido", "feliz", "ellos", "cinco"];

const TIME_USE: ChoiceItem[] = [
  { t: "___, moja la brocha. Luego, pinta la pared.", a: "Primero", d: ["Por último", "Al final", "Después"] },
  { t: "Primero me puse las medias. ___, me puse los zapatos.", a: "Después", d: ["Antes", "Primero", "Ayer"] },
  { t: "Mezclé la masa, la horneé y, ___, me comí el pastel.", a: "por último", d: ["primero", "antes", "al inicio"] },
  { t: "___ de dormir, me cepillo los dientes.", a: "Antes", d: ["Después", "Luego", "Por último"] },
  { t: "Hoy llovió. ___ saldrá el sol.", a: "Mañana", d: ["Ayer", "Antes", "Anoche"] },
  { t: "Hicimos la tarea y ___ salimos a jugar.", a: "luego", d: ["antes", "primero", "ayer"] },
  { t: "Yo ponía la mesa; ___, mi hermano servía el jugo.", a: "mientras tanto", d: ["por último", "al final", "ayer"] },
];

const LINK_PASSAGE: ChoiceItem[] = [
  { p: "¿Qué conector completa el texto?", t: "Me gusta el fútbol. ___, me encanta la natación.", a: "También", d: ["Pero", "Porque", "Primero"] },
  { p: "¿Qué conector completa el texto?", t: "Quería ir a la playa. ___, amaneció nublado.", a: "Sin embargo", d: ["Por ejemplo", "Además", "Por eso"] },
  { p: "¿Qué conector completa el texto?", t: "Olvidé regar la planta. ___, se marchitó.", a: "Por eso", d: ["Por ejemplo", "Sin embargo", "También"] },
  { p: "¿Qué conector completa el texto?", t: "Hay frutas ácidas. ___, el limón y la naranja.", a: "Por ejemplo", d: ["Por eso", "Sin embargo", "Al final"] },
  { p: "¿Qué conector completa el texto?", t: "Estudié toda la tarde. ___, saqué una buena nota.", a: "Por eso", d: ["Pero", "Por ejemplo", "Aunque"] },
  { p: "¿Qué conector completa el texto?", t: "El perro es juguetón. ___, es muy obediente.", a: "Además", d: ["Sin embargo", "Por eso", "Primero"] },
  { p: "¿Qué conector completa el texto?", t: "Corrimos mucho. ___, llegamos tarde.", a: "Sin embargo", d: ["Además", "Por ejemplo", "También"] },
];

// --- KK. Propósito ------------------------------------------------------------------------

const MATCH_PURPOSE: ChoiceItem[] = [
  { p: "Quieres CONVENCER a tu mamá de adoptar un gato. ¿Qué escribes?", a: "Un gato nos haría compañía y yo prometo cuidarlo.", d: ["Los gatos son mamíferos con bigotes y cola larga.", "Había una vez un gato con botas.", "El gato de mi vecina es negro."] },
  { p: "Quieres INFORMAR sobre las hormigas. ¿Qué escribes?", a: "Las hormigas viven en colonias bajo la tierra.", d: ["¡Compra ya tu granja de hormigas!", "La hormiga Tita soñaba con volar.", "Las hormigas me dan cosquillas, ¡ja, ja!"] },
  { p: "Quieres ENTRETENER a tus amigos. ¿Qué escribes?", a: "Un día, mi zapato salió caminando solo.", d: ["Los zapatos se hacen de cuero.", "Usa zapatos cómodos para correr.", "Los zapatos cuestan cincuenta soles."] },
  { p: "Quieres EXPLICAR cómo hacer limonada. ¿Qué escribes?", a: "Primero, exprime tres limones en una jarra.", d: ["La limonada es la mejor bebida.", "Érase un limón muy gruñón.", "Los limones crecen en árboles con espinas."] },
  { p: "Quieres CONVENCER a tus compañeros de reciclar. ¿Qué escribes?", a: "Si reciclamos, nuestro colegio estará más limpio.", d: ["El plástico se inventó hace más de cien años.", "La botella viajera cruzó el mar.", "Hay tachos de tres colores."] },
  { p: "Quieres INFORMAR sobre tu ciudad. ¿Qué escribes?", a: "Mi ciudad tiene una plaza y dos mercados.", d: ["¡Visita mi ciudad, es la mejor!", "En mi ciudad vive un dragón.", "Mi ciudad debería tener más parques."] },
];

// --- LL. Opiniones --------------------------------------------------------------------------

const FACT_OPINION: ChoiceItem[] = [
  { p: "Completa para que sea un HECHO.", t: "Los elefantes ___.", a: "tienen trompa", d: ["son los más bonitos", "son aburridos", "me dan risa"] },
  { p: "Completa para que sea una OPINIÓN.", t: "El helado de fresa ___.", a: "es el más rico", d: ["es de color rosado", "se hace con leche", "se derrite con el calor"] },
  { p: "Completa para que sea un HECHO.", t: "La semana ___.", a: "tiene siete días", d: ["es muy larga", "es aburrida", "pasa volando"] },
  { p: "Completa para que sea una OPINIÓN.", t: "Los gatos ___.", a: "son mejores que los perros", d: ["tienen cuatro patas", "maúllan", "tienen bigotes"] },
  { p: "Completa para que sea un HECHO.", t: "El Sol ___.", a: "es una estrella", d: ["es hermoso", "es mi favorito", "es muy molesto"] },
  { p: "Completa para que sea una OPINIÓN.", t: "Matemática ___.", a: "es el curso más divertido", d: ["usa números", "enseña a sumar", "se estudia en el colegio"] },
  { p: "Completa para que sea un HECHO.", t: "Lima ___.", a: "es la capital del Perú", d: ["es la ciudad más linda", "es demasiado grande", "es muy divertida"] },
  { p: "Completa para que sea una OPINIÓN.", t: "La lluvia ___.", a: "es muy triste", d: ["cae de las nubes", "es agua", "moja el suelo"] },
];

const OPINION_EXAMPLE: ChoiceItem[] = [
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "Los perros son muy inteligentes. Por ejemplo, ___", a: "mi perro aprendió a dar la pata.", d: ["los gatos duermen mucho.", "a mí me gustan mucho los perros.", "hoy es martes."] },
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "En mi barrio hay vecinos muy amables. Por ejemplo, ___", a: "la señora Rosa nos regala pan.", d: ["mi barrio tiene cinco calles.", "me gusta mi barrio.", "los carros hacen ruido."] },
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "Las frutas son deliciosas. Por ejemplo, ___", a: "el mango es dulce y jugoso.", d: ["las verduras son verdes.", "yo como a las doce.", "el mercado abre temprano."] },
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "Los libros enseñan cosas increíbles. Por ejemplo, ___", a: "leí que los pulpos tienen tres corazones.", d: ["mi libro tiene cien páginas.", "la biblioteca cierra a las cinco de la tarde.", "prefiero ver televisión."] },
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "Mi maestra es muy creativa. Por ejemplo, ___", a: "nos enseñó a sumar con una canción.", d: ["ella vive lejos.", "tiene el pelo corto.", "el salón tiene ventanas muy grandes."] },
  { p: "¿Qué EJEMPLO completa mejor la opinión?", t: "El parque es un lugar divertido. Por ejemplo, ___", a: "tiene columpios y un tobogán.", d: ["queda a dos cuadras.", "lo limpian los lunes.", "tiene una reja de color verde."] },
];

const OPINION_REASON: ChoiceItem[] = [
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "Deberíamos tener una mascota en el salón porque ___", a: "aprenderíamos a cuidarla.", d: ["el salón tiene pizarra.", "los lunes hay formación.", "mi lápiz es rojo."] },
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "Es mejor ir al colegio en bicicleta porque ___", a: "se hace ejercicio y no contamina.", d: ["las bicicletas tienen timbre.", "el colegio es grande.", "mi mochila pesa poco."] },
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "Todos los niños deberían leer cada día porque ___", a: "así aprenden palabras nuevas.", d: ["los libros tienen tapa.", "hay libros de muchos tamaños.", "la biblioteca tiene sillas."] },
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "El recreo debería ser más largo porque ___", a: "necesitamos tiempo para jugar y comer.", d: ["el patio tiene dos arcos.", "la campana suena fuerte.", "hoy hay sol."] },
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "Hay que dormir temprano porque ___", a: "el cuerpo necesita descansar.", d: ["la cama tiene almohada.", "la luna sale de noche.", "mi pijama es azul."] },
  { p: "¿Qué RAZÓN completa mejor la opinión?", t: "Comer verduras es buena idea porque ___", a: "nos ayudan a crecer sanos.", d: ["son de color verde.", "se venden en el mercado.", "vienen en bolsas."] },
];

const OPINION = "Opinión";
const REASON = "Razón";
const EXAMPLE = "Ejemplo";
const table = (t: string, a: string): ChoiceItem => ({ p: "En este texto, ¿qué es la parte resaltada con «»?", t, a, d: [OPINION, REASON, EXAMPLE].filter((x) => x !== a) });

const OPINION_TABLE: ChoiceItem[] = [
  table("«El otoño es la mejor estación.» Hace un clima fresco. Por ejemplo, puedo salir sin sudar.", OPINION),
  table("El otoño es la mejor estación. «Hace un clima fresco.» Por ejemplo, puedo salir sin sudar.", REASON),
  table("El otoño es la mejor estación. Hace un clima fresco. «Por ejemplo, puedo salir sin sudar.»", EXAMPLE),
  table("«Los niños deberían ayudar en casa.» Así aprenden a ser responsables. Yo, por ejemplo, tiendo mi cama.", OPINION),
  table("Los niños deberían ayudar en casa. «Así aprenden a ser responsables.» Yo, por ejemplo, tiendo mi cama.", REASON),
  table("Los niños deberían ayudar en casa. Así aprenden a ser responsables. «Yo, por ejemplo, tiendo mi cama.»", EXAMPLE),
  table("«El ajedrez es un gran juego.» Te enseña a pensar. Por ejemplo, planeas tus jugadas.", OPINION),
  table("El ajedrez es un gran juego. «Te enseña a pensar.» Por ejemplo, planeas tus jugadas.", REASON),
  table("El ajedrez es un gran juego. Te enseña a pensar. «Por ejemplo, planeas tus jugadas.»", EXAMPLE),
];

// --- MM. Detalles descriptivos ---------------------------------------------------------------

const SENSORY_PIC: ChoiceItem[] = [
  { pic: "🍋", a: "ácido y amarillo", d: ["dulce y rojo", "blando y azul", "caliente y negro"] },
  { pic: "🔥", a: "caliente y brillante", d: ["frío y oscuro", "suave y mojado", "dulce y blando"] },
  { pic: "🧊", a: "frío y duro", d: ["tibio y blando", "caliente y seco", "áspero y oscuro"] },
  { pic: "🌹", a: "roja y perfumada", d: ["verde y amarga", "ruidosa y dura", "fría y salada"] },
  { pic: "🥁", a: "redondo y ruidoso", d: ["silencioso y blando", "dulce y frío", "líquido y verde"] },
  { pic: "🐑", a: "suave y lanuda", d: ["dura y fría", "lisa y brillante", "ácida y roja"] },
  { pic: "🍯", a: "dulce y pegajosa", d: ["salada y seca", "amarga y dura", "fría y áspera"] },
  { pic: "🌵", a: "verde y espinoso", d: ["suave y rosado", "dulce y blando", "mojado y azul"] },
];

const SENSE_WORDS: ChoiceItem[] = [
  { p: "¿Con qué sentido lo notas?", t: "El pan recién horneado huele delicioso.", a: "El olfato", d: ["La vista", "El oído", "El tacto"] },
  { p: "¿Con qué sentido lo notas?", t: "La manta es suave y abrigadora.", a: "El tacto", d: ["El gusto", "El oído", "El olfato"] },
  { p: "¿Con qué sentido lo notas?", t: "El trueno retumbó en toda la casa.", a: "El oído", d: ["El gusto", "El tacto", "El olfato"] },
  { p: "¿Con qué sentido lo notas?", t: "La sopa está muy salada.", a: "El gusto", d: ["La vista", "El oído", "El tacto"] },
  { p: "¿Con qué sentido lo notas?", t: "El arcoíris tiene siete colores.", a: "La vista", d: ["El olfato", "El gusto", "El oído"] },
  { p: "Completa con una palabra de los sentidos.", t: "El limón tiene un sabor ___.", a: "ácido", d: ["ruidoso", "brillante", "áspero"] },
  { p: "Completa con una palabra de los sentidos.", t: "La lija es ___ al tocarla.", a: "áspera", d: ["dulce", "silenciosa", "perfumada"] },
  { p: "Completa con una palabra de los sentidos.", t: "La campana hizo un sonido ___.", a: "fuerte", d: ["salado", "rojo", "suave al tacto"] },
];

const DESCRIPTIVE: ChoiceItem[] = [
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "El gato duerme ___.", a: "sobre el cojín tibio", d: ["porque es un gato", "y también duerme", "como duerme el gato"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "Compré un globo ___.", a: "rojo y brillante", d: ["que es un globo", "y lo compré yo", "de los que hay"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "La lluvia caía ___.", a: "suavemente sobre el techo", d: ["y era lluvia de agua", "como cae la lluvia", "porque llovía ese día"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "El perro ___ corre por el parque.", a: "lanudo y juguetón", d: ["que es un perro", "de los perros", "y que corre"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "La niña come una manzana ___.", a: "roja y jugosa", d: ["que es fruta", "de las manzanas", "y la come"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "El árbol ___ da sombra.", a: "viejo y frondoso", d: ["que es árbol", "de los árboles", "y que está ahí"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "Mi abuelo lee en su sillón ___.", a: "verde y mullido", d: ["que es sillón", "donde se sienta", "y que tiene"] },
  { p: "¿Qué detalle descriptivo completa mejor la oración?", t: "El mar estaba ___.", a: "tranquilo y azul", d: ["siendo el mar", "como mar que es", "ahí en el mar"] },
];

const STRONG_VERB: ChoiceItem[] = [
  { p: "Cambia el verbo por uno más preciso.", t: "El león HIZO un ruido fuerte.", a: "rugió", d: ["tuvo", "colocó", "dio"] },
  { p: "Cambia el verbo por uno más preciso.", t: "Lucía DIJO el secreto en voz muy baja.", a: "susurró", d: ["gritó", "habló", "conversó"] },
  { p: "Cambia el verbo por uno más preciso.", t: "El caballo FUE muy rápido por el campo.", a: "galopó", d: ["estuvo", "anduvo", "pasó"] },
  { p: "Cambia el verbo por uno más preciso.", t: "Mi hermano COMIÓ la torta en un segundo.", a: "devoró", d: ["saboreó", "tomó", "tuvo"] },
  { p: "Cambia el verbo por uno más preciso.", t: "La rana FUE de piedra en piedra.", a: "saltó", d: ["estuvo", "caminó", "anduvo"] },
  { p: "Cambia el verbo por uno más preciso.", t: "El bebé HIZO lágrimas toda la noche.", a: "lloró", d: ["colocó", "tuvo", "dio"] },
  { p: "Cambia el verbo por uno más preciso.", t: "Las estrellas TIENEN LUZ en el cielo.", a: "brillan", d: ["aparecen", "son", "hay"] },
  { p: "Cambia el verbo por uno más preciso.", t: "El ladrón SE FUE por la ventana.", a: "escapó", d: ["estuvo", "pasó", "salió despacio"] },
];

const DIALOGUE: ChoiceItem[] = [
  { p: "¿Qué diálogo completa mejor el cuento?", t: "Sara vio que su amigo lloraba. ___ Él le contó que había perdido su perro.", a: "—¿Qué te pasa? —preguntó Sara.", d: ["—¡Feliz cumpleaños! —gritó Sara.", "—Tengo hambre —dijo Sara.", "—Me voy a dormir —dijo Sara."] },
  { p: "¿Qué diálogo completa mejor el cuento?", t: "El mozo se acercó a la mesa. ___ Mi papá pidió dos jugos de naranja.", a: "—¿Qué desean tomar? —preguntó.", d: ["—¡Buenas noches, hasta mañana! —dijo.", "—¿Dónde está el baño? —preguntó.", "—Yo no trabajo aquí —dijo."] },
  { p: "¿Qué diálogo completa mejor el cuento?", t: "Leo abrió el regalo y vio una pelota nueva. ___ Su abuela sonrió.", a: "—¡Gracias, abuelita! —dijo Leo.", d: ["—No me gusta nada —dijo Leo.", "—¿Qué hora es? —preguntó Leo.", "—Tengo sueño —dijo Leo."] },
  { p: "¿Qué diálogo completa mejor el cuento?", t: "La maestra entró al salón. ___ Todos los niños respondieron en coro.", a: "—¡Buenos días, niños! —saludó.", d: ["—¡Hasta mañana! —se despidió.", "—¿Quién rompió el vaso? —gritó.", "—Me duele la cabeza —dijo."] },
  { p: "¿Qué diálogo completa mejor el cuento?", t: "Empezó a llover muy fuerte. ___ Los dos corrieron hacia la casa.", a: "—¡Vamos, nos vamos a mojar! —dijo Ana.", d: ["—Qué lindo día de sol —dijo Ana.", "—Quiero un helado —dijo Ana.", "—Mira esa hormiga —dijo Ana."] },
  { p: "¿Qué diálogo completa mejor el cuento?", t: "Pipo no encontraba sus lentes. ___ ¡Los tenía en la cabeza!", a: "—¿Alguien vio mis lentes? —preguntó.", d: ["—Ya los encontré —dijo.", "—No uso lentes —dijo.", "—Vamos al cine —dijo."] },
];

// --- NN. Variedad de oraciones ------------------------------------------------------------------

const COMBINE_SUBJECTS: ChoiceItem[] = [
  { p: "Une las dos oraciones en una sola.", t: "Ana juega fútbol. Luis juega fútbol.", a: "Ana y Luis juegan fútbol.", d: ["Ana y Luis juega fútbol.", "Ana juega fútbol y fútbol Luis.", "Ana Luis juegan y fútbol."] },
  { p: "Une las dos oraciones en una sola.", t: "El perro duerme. El gato duerme.", a: "El perro y el gato duermen.", d: ["El perro y el gato duerme.", "El perro duerme el gato.", "Duermen y el perro gato."] },
  { p: "Une las dos oraciones en una sola.", t: "Mi mamá canta. Mi tía canta.", a: "Mi mamá y mi tía cantan.", d: ["Mi mamá y mi tía canta.", "Mi mamá canta mi tía.", "Cantan mamá y tía mi."] },
  { p: "Une las dos oraciones en una sola.", t: "Las rosas tienen espinas. Los cactus tienen espinas.", a: "Las rosas y los cactus tienen espinas.", d: ["Las rosas y los cactus tiene espinas.", "Las rosas tienen cactus y espinas.", "Tienen espinas rosas cactus."] },
  { p: "Une las dos oraciones en una sola.", t: "Pedro fue al cine. Marta fue al cine.", a: "Pedro y Marta fueron al cine.", d: ["Pedro y Marta fue al cine.", "Pedro fue Marta al cine.", "Fueron al cine Pedro Marta y."] },
  { p: "Une las dos oraciones en una sola.", t: "El pan está caliente. La sopa está caliente.", a: "El pan y la sopa están calientes.", d: ["El pan y la sopa está caliente.", "El pan está sopa caliente.", "Caliente el pan y están sopa."] },
];

const COMBINE_PREDICATES: ChoiceItem[] = [
  { p: "Une las dos oraciones en una sola.", t: "El bebé come. El bebé duerme.", a: "El bebé come y duerme.", d: ["El bebé come el bebé duerme.", "El bebé y come duerme.", "Come y el duerme bebé."] },
  { p: "Une las dos oraciones en una sola.", t: "Rosa lee cuentos. Rosa escribe poemas.", a: "Rosa lee cuentos y escribe poemas.", d: ["Rosa lee cuentos Rosa poemas.", "Rosa y lee cuentos escribe.", "Lee Rosa y poemas cuentos."] },
  { p: "Une las dos oraciones en una sola.", t: "El pájaro canta. El pájaro vuela.", a: "El pájaro canta y vuela.", d: ["El pájaro canta el pájaro.", "El pájaro y canta vuela.", "Canta vuela y el pájaro."] },
  { p: "Une las dos oraciones en una sola.", t: "Mi papá lava el carro. Mi papá riega el jardín.", a: "Mi papá lava el carro y riega el jardín.", d: ["Mi papá lava el carro mi papá el jardín.", "Mi papá y lava el carro riega.", "Lava y riega mi el carro papá jardín."] },
  { p: "Une las dos oraciones en una sola.", t: "Los niños corren. Los niños saltan.", a: "Los niños corren y saltan.", d: ["Los niños corren los niños.", "Los niños y corren saltan.", "Corren saltan los y niños."] },
  { p: "Une las dos oraciones en una sola.", t: "La gata se estira. La gata bosteza.", a: "La gata se estira y bosteza.", d: ["La gata se estira la gata.", "La gata y se estira bosteza.", "Se estira bosteza y la gata."] },
];

const COMBINE_BOTH: ChoiceItem[] = [
  { p: "Une las oraciones en una sola.", t: "Ana baila. Luis baila. Ana canta. Luis canta.", a: "Ana y Luis bailan y cantan.", d: ["Ana baila y Luis canta bailan.", "Ana y Luis baila y canta.", "Ana Luis bailan cantan y."] },
  { p: "Une las oraciones en una sola.", t: "El sol brilla. El sol calienta. La luna brilla.", a: "El sol brilla y calienta, y la luna brilla.", d: ["El sol y la luna calientan brilla.", "El sol brilla la luna calienta y.", "Brilla y calienta sol luna."] },
  { p: "Une las oraciones en una sola.", t: "Mi perro corre. Mi gato corre. Mi perro juega. Mi gato juega.", a: "Mi perro y mi gato corren y juegan.", d: ["Mi perro y mi gato corre y juega.", "Mi perro corre mi gato juega y.", "Corren juegan mi perro gato."] },
  { p: "Une las oraciones en una sola.", t: "Tomás pinta. Eva pinta. Tomás recorta. Eva recorta.", a: "Tomás y Eva pintan y recortan.", d: ["Tomás y Eva pinta y recorta.", "Tomás pinta Eva recorta y.", "Pintan recortan Tomás Eva."] },
  { p: "Une las oraciones en una sola.", t: "Las ranas saltan. Los sapos saltan. Las ranas croan. Los sapos croan.", a: "Las ranas y los sapos saltan y croan.", d: ["Las ranas y los sapos salta y croa.", "Las ranas saltan los sapos croan y.", "Saltan croan ranas sapos las."] },
];

const INTRO_ELEMENTS: ChoiceItem[] = [
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "Fuimos al parque DESPUÉS DEL ALMUERZO.", a: "Después del almuerzo, fuimos al parque.", d: ["Después fuimos, del almuerzo al parque.", "Fuimos después al parque del almuerzo.", "Del almuerzo fuimos después al parque,"] },
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "El gallo canta CADA MAÑANA.", a: "Cada mañana, el gallo canta.", d: ["Cada el gallo, mañana canta.", "El gallo cada canta mañana.", "Mañana cada, canta el gallo"] },
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "Vimos una estrella fugaz ANOCHE.", a: "Anoche, vimos una estrella fugaz.", d: ["Anoche vimos, una estrella fugaz.", "Una estrella anoche fugaz vimos.", "Vimos anoche, una fugaz estrella"] },
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "Hay muchos peces EN EL RÍO.", a: "En el río, hay muchos peces.", d: ["En el, río hay muchos peces.", "Hay en muchos el río peces.", "Muchos peces, en el hay río"] },
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "Me pongo una casaca CUANDO HACE FRÍO.", a: "Cuando hace frío, me pongo una casaca.", d: ["Cuando hace, frío me pongo una casaca.", "Me pongo cuando una casaca hace frío.", "Hace frío cuando, me una pongo casaca"] },
  { p: "Reescribe la oración empezando por la parte resaltada.", t: "Encontré mis llaves POR FIN.", a: "Por fin, encontré mis llaves.", d: ["Por, fin encontré mis llaves.", "Encontré por mis fin llaves.", "Mis llaves por, encontré fin"] },
];

export const ROWS: Row[] = [
  ["HH.1", "Poner las oraciones en orden", (r) => order(r, "Ordena las oraciones.", SENTENCE_ORDER)],

  ["II.1", "Seleccionar el detalle que no apoya la oración temática", (r) => choose(r, "", NOT_SUPPORT)],
  ["II.2", "Elegir oraciones temáticas para párrafos narrativos", (r) => choose(r, "", TOPIC_NARRATIVE)],
  ["II.3", "Elegir oraciones temáticas para párrafos expositivos", (r) => choose(r, "", TOPIC_EXPOSITORY)],

  ["JJ.1", "Usar conjunciones", (r) => choose(r, "Completa la oración.", CONJ)],
  ["JJ.2", "Usar conectores: porque, cuando, si, aunque", (r) => choose(r, "Completa la oración.", SUBORD)],
  ["JJ.3", "Identificar palabras de orden en el tiempo", (r) => pickAll(r, "Selecciona las palabras que indican orden en el tiempo.", TIME_WORDS, NOT_TIME_WORDS)],
  ["JJ.4", "Usar palabras de orden en el tiempo", (r) => choose(r, "Completa la oración.", TIME_USE)],
  ["JJ.5", "Usar conectores para completar un texto", (r) => choose(r, "", LINK_PASSAGE)],

  ["KK.1", "Elegir el texto que corresponde al propósito del escritor", (r) => choose(r, "", MATCH_PURPOSE)],

  ["LL.1", "Completar oraciones de hecho y de opinión", (r) => choose(r, "", FACT_OPINION)],
  ["LL.2", "Completar el texto de opinión con un ejemplo", (r) => choose(r, "", OPINION_EXAMPLE)],
  ["LL.3", "Completar el texto de opinión con una razón", (r) => choose(r, "", OPINION_REASON)],
  ["LL.4", "Completar el cuadro de opinión, razón y ejemplo", (r) => choose(r, "", OPINION_TABLE)],

  ["MM.1", "Elegir los detalles sensoriales que corresponden al dibujo", (r) => choose(r, "¿Qué palabras describen el dibujo?", SENSORY_PIC)],
  ["MM.2", "Usar palabras de los sentidos", (r) => choose(r, "", SENSE_WORDS)],
  ["MM.3", "Agregar detalles descriptivos a las oraciones", (r) => choose(r, "", DESCRIPTIVE)],
  ["MM.4", "Mejorar la oración con un verbo más preciso", (r) => choose(r, "", STRONG_VERB)],
  ["MM.5", "Insertar un diálogo en un cuento", (r) => choose(r, "", DIALOGUE)],

  ["NN.1", "Unir oraciones: sujetos", (r) => choose(r, "", COMBINE_SUBJECTS)],
  ["NN.2", "Unir oraciones: predicados", (r) => choose(r, "", COMBINE_PREDICATES)],
  ["NN.3", "Unir oraciones: sujetos y predicados", (r) => choose(r, "", COMBINE_BOTH)],
  ["NN.4", "Reescribir oraciones con un elemento introductorio", (r) => choose(r, "", INTRO_ELEMENTS)],
];
