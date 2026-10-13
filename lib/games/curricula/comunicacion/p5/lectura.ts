import { choose, order, readPassage, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de lectura (IXL 5th grade ELA, D-O). Lecturas propias, con temas
// del Perú y de Latinoamérica. Las ilustraciones de IXL se reemplazan por
// descripciones y emojis; las alusiones usan fuentes conocidas en castellano.

export const SECTIONS: Section[] = [
  { id: "D", name: "Idea principal", icon: "💡" },
  { id: "E", name: "Inferencias y tema", icon: "🕵️" },
  { id: "F", name: "Propósito y punto de vista del autor", icon: "✍️" },
  { id: "G", name: "Tono", icon: "🎚️" },
  { id: "H", name: "Personajes", icon: "🎭" },
  { id: "I", name: "Elementos del cuento", icon: "📖" },
  { id: "J", name: "Estructura del texto", icon: "🧱" },
  { id: "K", name: "Detalles sensoriales", icon: "👃" },
  { id: "L", name: "Recursos literarios", icon: "✨" },
  { id: "M", name: "Elementos visuales", icon: "🖼️" },
  { id: "N", name: "Partes del texto", icon: "🔖" },
  { id: "O", name: "Elementos de la poesía", icon: "🎶" },
];

// --- D. Idea principal -------------------------------------------------------

const DETAILS = "¿Qué idea principal unen estos detalles?";
const KEY_DETAILS: ChoiceItem[] = [
  pt(DETAILS, "• Los manglares frenan las olas de las tormentas.\n• Entre sus raíces crecen peces y conchas.\n• Guardan mucho carbono en el suelo.", "Los manglares protegen la costa y la vida.", "Los manglares son árboles que crecen solo en ríos muy fríos.", "Las tormentas son fuertes."),
  pt(DETAILS, "• El oso de anteojos trepa árboles para comer frutos.\n• Dispersa semillas al caminar.\n• Abre claros por donde entra la luz.", "El oso de anteojos ayuda a mantener el bosque.", "El oso de anteojos es un animal carnívoro y muy peligroso.", "Los bosques tienen árboles."),
  pt(DETAILS, "• Los andenes evitan que la lluvia se lleve la tierra.\n• Crean pisos con distintos climas.\n• Permiten sembrar en laderas empinadas.", "Los andenes fueron una solución agrícola ingeniosa.", "Los andenes servían de escaleras.", "En las laderas empinadas nunca se pudo sembrar ningún cultivo."),
  pt(DETAILS, "• Una vacuna enseña al cuerpo a reconocer un germen.\n• Si el germen llega, las defensas ya están listas.\n• Así se han eliminado enfermedades graves.", "Las vacunas preparan al cuerpo para defenderse.", "Las vacunas curan a quienes ya están enfermos de gravedad.", "Los gérmenes son pequeños."),
  pt(DETAILS, "• En el desierto, la camanchaca moja las lomas.\n• Algunas comunidades atrapan esa niebla con mallas.\n• Las gotas se juntan en tanques.", "La niebla puede ser una fuente de agua.", "La niebla impide que crezcan plantas en las lomas de la costa.", "El desierto es grande."),
  pt(DETAILS, "• Los quipus tenían cuerdas de colores.\n• Los nudos indicaban cantidades.\n• Solo los quipucamayos sabían interpretarlos.", "Los quipus eran un sistema de registro de los incas.", "Los quipus eran adornos.", "Los incas escribían en papel con letras muy parecidas a las nuestras."),
  pt(DETAILS, "• Al reír, el cuerpo se relaja.\n• La risa acerca a las personas.\n• Reír ayuda a soportar momentos difíciles.", "Reír trae beneficios para el cuerpo y el ánimo.", "Las personas ríen únicamente cuando alguien cuenta un chiste.", "Reír cansa."),
  pt(DETAILS, "• El pingüino de Humboldt anida en islas con guano.\n• Se alimenta de anchoveta.\n• La pesca excesiva reduce su comida.", "El pingüino de Humboldt depende del mar y está amenazado.", "El pingüino de Humboldt vive en el hielo.", "La anchoveta es el pez más grande de todo el océano Pacífico."),
];

const MAIN_PASSAGES = [
  read("El señor de Sipán", "👑", "En 1987, cerca de Chiclayo, un grupo de arqueólogos halló una tumba intacta. Dentro yacía un gobernante mochica, enterrado hace unos 1700 años con collares de oro, cetros y cerámicas. Lo llamaron el Señor de Sipán. A diferencia de otras tumbas, esta no había sido saqueada, de modo que permitió conocer cómo vivía y cómo se organizaba la sociedad mochica.",
    ["¿Cuál es la idea principal del texto?", "La tumba intacta de Sipán reveló mucho sobre los mochicas.", "Chiclayo es una ciudad del norte del Perú con muchos turistas.", "El oro es un metal valioso."],
    ["¿Qué detalle explica por qué el hallazgo fue tan valioso?", "La tumba no había sido saqueada.", "Ocurrió en 1987.", "El gobernante mochica fue enterrado en un lugar cercano a Chiclayo."],
    ["¿Qué título resume mejor el texto?", "Una tumba que cuenta la historia mochica", "Cómo se fabrican collares de oro", "Arqueólogos de Chiclayo"]),
  read("Dormir para aprender", "😴", "Mientras dormimos, el cerebro no descansa del todo: repasa lo que aprendió durante el día y lo guarda en la memoria. Por eso, quienes duermen poco antes de un examen suelen recordar menos. Además, la falta de sueño vuelve más difícil prestar atención. Los especialistas recomiendan que los niños de diez años duerman entre nueve y once horas.",
    ["¿Cuál es la idea principal del texto?", "Dormir bien es necesario para aprender y recordar.", "Los exámenes son difíciles.", "El cerebro se apaga por completo cuando llega la noche."],
    ["¿Qué hace el cerebro mientras dormimos?", "Repasa y guarda lo aprendido.", "Deja de funcionar hasta el día siguiente.", "Olvida todo."],
    ["¿Qué detalle NO apoya la idea principal?", "Algunas personas roncan al dormir.", "La falta de sueño dificulta la atención.", "Quien duerme poco recuerda menos."]),
];

const MAIN_ANALYZE = [
  read("El cajón peruano", "🥁", "El cajón nació en la costa del Perú, entre la población afrodescendiente. Como a los esclavizados se les prohibía tocar tambores, usaron los cajones de madera en que se embarcaba la fruta. Con las manos y el ingenio, convirtieron un objeto de carga en un instrumento. Hoy el cajón suena en la música criolla y también en el flamenco de España.",
    ["¿Cuál es la idea principal?", "El cajón surgió del ingenio ante una prohibición.", "El flamenco es una música de España que se baila con zapatos.", "Los cajones cargan fruta."],
    ["¿Qué frase del texto refuerza esa idea?", "«Con las manos y el ingenio»", "«En la costa del Perú»", "«Suena en la música criolla y también en el flamenco»"],
    ["¿Qué muestra el último dato sobre España?", "Que el cajón se difundió fuera del Perú", "Que el cajón se inventó en España hace varios siglos", "Que el flamenco es antiguo"]),
  read("Bosques que hacen llover", "🌳", "Los árboles de la Amazonía no solo reciben lluvia: también la producen. Sus raíces absorben agua del suelo y sus hojas la liberan como vapor. Ese vapor forma nubes que el viento empuja hacia los Andes y aún más lejos. Los científicos llaman a este fenómeno «ríos voladores». Cuando se tala el bosque, esos ríos se debilitan y llueve menos en lugares muy distantes.",
    ["¿Cuál es la idea principal?", "La selva produce lluvia que llega a regiones lejanas.", "El viento sopla desde la selva hacia el mar todos los días.", "Los árboles tienen raíces."],
    ["¿Por qué el autor usa la expresión «ríos voladores»?", "Para que se entienda cuánta agua viaja por el aire", "Para decir que los ríos de la selva se han secado", "Para contar una leyenda"],
    ["¿Qué consecuencia de la tala señala el texto?", "Llueve menos en zonas distantes.", "Crecen más árboles.", "Los ríos voladores se vuelven mucho más fuertes y dañinos."]),
];

const TWO = "¿Qué idea se obtiene al unir los dos textos?";
const TWO_MAIN: ChoiceItem[] = [
  pt(TWO, "Texto 1: La anchoveta es el alimento de aves, lobos marinos y peces grandes.\nTexto 2: Si se pesca demasiada anchoveta, las colonias de aves guaneras disminuyen.", "Muchas especies dependen de la anchoveta.", "La anchoveta se alimenta de aves guaneras y lobos marinos.", "Pescar es divertido."),
  pt(TWO, "Texto 1: Los niños que leen por gusto obtienen mejores notas.\nTexto 2: Leer cuentos antes de dormir amplía el vocabulario.", "La lectura frecuente favorece el aprendizaje.", "Los cuentos solo deben leerse por las noches, antes de dormir.", "Leer da sueño."),
  pt(TWO, "Texto 1: Las ciudades con más ciclovías tienen menos tráfico.\nTexto 2: Ir en bicicleta al trabajo reduce la contaminación del aire.", "La bicicleta mejora la vida en la ciudad.", "Las bicicletas son más caras.", "Las ciclovías aumentan el tráfico y la contaminación del aire."),
  pt(TWO, "Texto 1: El quechua se habla en siete países de Sudamérica.\nTexto 2: En el Perú existen 48 lenguas originarias, y varias están en peligro.", "Las lenguas originarias son un patrimonio que hay que proteger.", "El quechua es la única lengua del Perú.", "Todas las lenguas son iguales."),
  pt(TWO, "Texto 1: Los glaciares andinos han perdido la mitad de su hielo en 50 años.\nTexto 2: Muchos pueblos de la sierra dependen del agua del deshielo.", "El retroceso de los glaciares amenaza el agua de la sierra.", "Los glaciares crecen cada año y traen inundaciones a los pueblos.", "El hielo es frío."),
  pt(TWO, "Texto 1: Thomas Edison probó miles de materiales antes de lograr su foco.\nTexto 2: La nadadora entrenó seis años para clasificar a las olimpiadas.", "Los logros exigen constancia.", "Los inventores y las deportistas tienen suerte desde el comienzo.", "Nadar es difícil."),
];

// --- E. Inferencias y tema ---------------------------------------------------

const INF = "¿Qué se puede inferir?";
const INFER: ChoiceItem[] = [
  pt(INF, "El campesino miró las nubes, olió el aire y cubrió de prisa los costales de papa.", "Cree que va a llover pronto.", "Quiere vender las papas en el mercado antes de mediodía.", "Tiene frío."),
  pt(INF, "Lucía releyó la nota tres veces, la dobló con cuidado y la guardó en su diario.", "La nota es importante para ella.", "No entendió lo que decía la nota porque estaba en otro idioma.", "Va a botarla."),
  pt(INF, "Al final de la obra, el público se puso de pie y nadie quería irse.", "La función gustó mucho.", "El teatro tenía las puertas cerradas con llave por seguridad.", "La obra fue muy corta."),
  pt(INF, "Martín bostezó, se frotó los ojos y apoyó la cabeza en la carpeta.", "No durmió lo suficiente.", "Está muy entusiasmado con la clase de matemática de hoy.", "Perdió su lápiz."),
  pt(INF, "La tienda tenía las vitrinas vacías y un cartel: «Gracias por 30 años».", "La tienda va a cerrar definitivamente.", "La tienda acaba de abrir.", "La tienda duplicará su tamaño para vender muchos más productos."),
  pt(INF, "El perro gimió frente a la puerta, con la correa en el hocico.", "Quiere que lo saquen a pasear.", "Tiene hambre y está esperando que le sirvan su comida.", "Está enfermo."),
  pt(INF, "Doña Elsa contó las monedas dos veces, suspiró y devolvió el pan dulce al estante.", "No le alcanzaba el dinero.", "No le gustan los panes dulces porque tienen mucha azúcar.", "Estaba apurada."),
  pt(INF, "Las huellas en el barro eran profundas y estaban muy separadas entre sí.", "El animal era pesado y corría.", "El animal era pequeño y avanzaba con pasitos muy lentos.", "No había llovido."),
];

const INFER_SUPPORT = [
  read("La maleta de la abuela", "🧳", "La abuela Rosa no dejó que nadie cargara su maleta. En el bus la llevó sobre las rodillas todo el camino. Al llegar, antes de saludar, la abrió despacio: dentro, envueltas en mantas, había doce humitas todavía tibias. «Las hice esta madrugada», dijo, y recién entonces abrazó a sus nietos.",
    ["¿Qué se puede inferir sobre la abuela?", "Quería que las humitas llegaran en buen estado.", "No confiaba en sus nietos y por eso escondía su dinero.", "Estaba molesta."],
    ["¿Qué detalle apoya esa inferencia?", "Llevó la maleta sobre las rodillas todo el camino.", "Viajó en bus.", "Tenía doce nietos que la esperaban en el paradero."],
    ["¿Qué muestra que se esforzó por su familia?", "Cocinó de madrugada antes de viajar.", "Abrió la maleta despacio.", "Abrazó a sus nietos."]),
  read("El examen", "📝", "Cuando la profesora repartió las hojas, Darío sonrió. Leyó la primera pregunta y empezó a escribir sin levantar la vista. Veinte minutos después dejó el lapicero, revisó sus respuestas y miró por la ventana. A su lado, Bruno seguía mordiendo el lápiz frente a la segunda pregunta.",
    ["¿Qué se puede inferir sobre Darío?", "Se había preparado bien.", "No sabía las respuestas y decidió rendirse muy rápido.", "Quería copiar."],
    ["¿Qué detalle apoya esa inferencia?", "Escribió sin levantar la vista y terminó pronto.", "Miró por la ventana.", "La profesora repartió las hojas."],
    ["¿Qué se puede inferir sobre Bruno?", "El examen le resultaba difícil.", "Ya había terminado.", "Tenía mucha hambre y por eso mordía su lápiz."]),
];

const THEMES = [
  read("El muro", "🧱", "Dos familias vecinas llevaban años sin hablarse por un muro que una de ellas levantó. Un verano, el río se desbordó. Los hijos de ambas casas, sin consultar a nadie, formaron una cadena para pasar sacos de arena. Al tercer día, los padres trabajaban codo a codo. Cuando bajó el agua, nadie mencionó el muro, pero alguien le abrió una puerta.",
    ["¿Cuál es el tema del cuento?", "Las dificultades pueden unir a quienes estaban enfrentados.", "Los ríos son peligrosos en verano y hay que vivir lejos de ellos.", "Los muros protegen."],
    ["¿Qué hecho del final refuerza el tema?", "Alguien abrió una puerta en el muro.", "El agua bajó.", "Las familias llevaban años sin hablarse por culpa del muro."],
    ["¿Quiénes dan el primer paso hacia la reconciliación?", "Los hijos", "Los padres", "Los vecinos del pueblo de al lado"]),
  read("La nota", "🎻", "Ariana tocó mal una nota en plena presentación. Sintió que todo el auditorio la había oído. Podía detenerse o seguir. Siguió. Al terminar, su maestra le dijo: «¿Sabes qué recordará la gente? Que no te rendiste». Esa noche, Ariana anotó en su cuaderno: «Equivocarse no es lo contrario de hacerlo bien; es parte».",
    ["¿Cuál es el tema del cuento?", "Los errores forman parte de aprender.", "Tocar el violín ante un auditorio lleno es muy sencillo.", "Hay que evitar al público."],
    ["¿Qué frase expresa mejor el tema?", "«Equivocarse no es lo contrario de hacerlo bien; es parte».", "«Sintió que todo el auditorio la había oído».", "«Podía detenerse»."],
    ["¿Qué decisión de Ariana muestra el tema?", "Seguir tocando.", "Anotar en su cuaderno.", "Mirar a su maestra durante toda la presentación."]),
];

const MULTI_THEMES = [
  read("La chacra de Wayra", "🌽", "Cuando su padre enfermó, Wayra, de once años, tuvo que encargarse de la chacra. Al principio regaba de más y las plantas se ahogaban. Una vecina anciana le enseñó a leer la tierra con los dedos. Wayra, a cambio, le leía las cartas que llegaban de la ciudad. En abril cosecharon juntas el mejor maíz del anexo.",
    ["¿Qué dos temas desarrolla el cuento?", "La responsabilidad y la ayuda mutua", "La envidia y la venganza entre vecinos del campo", "El miedo y la soledad"],
    ["¿Qué detalle muestra la ayuda mutua?", "La vecina enseña y Wayra le lee las cartas.", "El padre enfermó.", "Las plantas se ahogaban porque Wayra regaba de más."],
    ["¿Qué detalle muestra la responsabilidad?", "Wayra se encargó de la chacra.", "Cosecharon en abril.", "Llegaban cartas."]),
  read("El premio", "🏅", "Tomás ganó el concurso de ciencias con un filtro de agua. En la premiación, pidió el micrófono: «La idea del carbón fue de Kiara. Sin ella, esto no funcionaba». Kiara subió al escenario, colorada. Después, los dos donaron el filtro a la escuela del caserío, donde el agua llegaba turbia.",
    ["¿Qué dos temas desarrolla el cuento?", "La honestidad y la generosidad", "La competencia y la envidia entre los compañeros de aula", "La pereza y la suerte"],
    ["¿Qué acción muestra la honestidad?", "Tomás reconoció la idea de Kiara.", "Tomás ganó el concurso.", "Kiara se puso colorada al subir al escenario."],
    ["¿Qué acción muestra la generosidad?", "Donaron el filtro a una escuela.", "Pidió el micrófono.", "El filtro usaba carbón."]),
];

// --- F. Propósito y punto de vista -------------------------------------------

const PURPOSE = sorter(["Informar", "Convencer", "Entretener", "Dar instrucciones"], "¿Cuál es el propósito del texto?");
const TEXT_PURPOSE: ChoiceItem[] = [
  ...["Un reportaje sobre el retroceso de los glaciares.", "Una infografía con las partes de una célula.", "Una biografía breve de un científico peruano."].map((x) => PURPOSE(x, 0)),
  ...["Una columna que pide prohibir las bolsas de plástico.", "Un discurso de una candidata a alcaldesa escolar.", "Un afiche: «Dona sangre, salva vidas»."].map((x) => PURPOSE(x, 1)),
  ...["Una novela de aventuras en la selva.", "Una leyenda sobre el origen de un lago.", "Una tira cómica de un perro glotón."].map((x) => PURPOSE(x, 2)),
  ...["Una receta de causa limeña.", "El manual para armar un estante.", "Los pasos para inscribirse en un taller."].map((x) => PURPOSE(x, 3)),
];

const MSG = "¿Cuál es el propósito del autor y su mensaje?";
const PURPOSE_MESSAGE: ChoiceItem[] = [
  pt(MSG, "Cada minuto se tala en el mundo un área de bosque igual a treinta canchas de fútbol. Aún estamos a tiempo: exige madera certificada.", "Convencer: actuemos contra la deforestación.", "Informar: cómo se juega al fútbol en una cancha grande.", "Entretener: un cuento."),
  pt(MSG, "El corazón de un colibrí puede latir más de 1200 veces por minuto durante el vuelo.", "Informar: un dato sorprendente del colibrí.", "Convencer: cuida a los colibríes de tu jardín cada día.", "Entretener: un chiste."),
  pt(MSG, "—¿Por qué lloras, cebolla? —preguntó el cuchillo. —Porque esta vez la que llora soy yo —dijo ella, y el cocinero se quedó sin almuerzo.", "Entretener: una historia con humor.", "Informar: las propiedades de la cebolla en la cocina.", "Convencer: no cocines."),
  pt(MSG, "Usar casco reduce a menos de la mitad el riesgo de una lesión grave. No salgas en bicicleta sin él.", "Convencer: usa siempre casco.", "Informar: cómo se fabrica una bicicleta moderna de carrera.", "Entretener: una fábula."),
  pt(MSG, "Para germinar un frejol, coloca algodón húmedo en un vaso, pon la semilla y déjalo junto a una ventana.", "Dar instrucciones: cómo germinar una semilla.", "Convencer: come más frejoles.", "Informar: la historia del algodón en la costa del Perú."),
  pt(MSG, "En 1969, el ser humano pisó la Luna por primera vez. El viaje de ida duró cerca de tres días.", "Informar: un hecho histórico de la exploración espacial.", "Convencer: viaja a la Luna.", "Entretener: un cuento de ciencia ficción con astronautas."),
];

const POV = "¿En qué coinciden o se diferencian los dos puntos de vista?";
const POINT_OF_VIEW: ChoiceItem[] = [
  pt(POV, "Alcalde: «La nueva carretera traerá comercio y trabajo».\nComunera: «La carretera partirá en dos nuestro bosque».", "Los dos hablan de la carretera, pero uno ve beneficios y la otra, daños.", "Los dos rechazan la carretera porque creen que dañará el bosque y el comercio.", "Ninguno menciona la carretera."),
  pt(POV, "Entrenador: «Perdimos, pero jugamos mejor que nunca».\nHincha: «Perdimos, y eso es lo único que cuenta».", "Coinciden en el resultado y difieren en cómo lo valoran.", "Los dos están felices con el partido y con el resultado final.", "El entrenador cree que ganaron."),
  pt(POV, "Niña: «Mudarnos fue terrible: dejé a mis amigas».\nMamá: «Mudarnos fue lo mejor: ahora vivimos cerca de los abuelos».", "Una resalta lo que perdió y la otra, lo que ganó.", "Las dos extrañan la casa anterior y quieren regresar a ella.", "La mamá dejó a sus amigas."),
  pt(POV, "Pescador: «Con la veda no puedo trabajar».\nBióloga: «Con la veda los peces se reproducen y habrá pesca mañana».", "Él piensa en el presente; ella, en el futuro.", "Los dos quieren eliminar la veda para pescar todo el año.", "A ninguno le importan los peces."),
  pt(POV, "Autor 1: «Los videojuegos quitan tiempo de estudio».\nAutor 2: «Algunos videojuegos entrenan la memoria y la atención».", "Uno destaca un riesgo y el otro, un beneficio.", "Los dos piden prohibir los videojuegos en casa y en la escuela.", "Los dos venden videojuegos."),
  pt(POV, "Diario de Ana: «Sentí que me temblaban las piernas».\nNoticia: «La alumna Ana Ruiz recitó ante 300 personas».", "El diario cuenta emociones; la noticia, solo hechos.", "Los dos textos cuentan con detalle lo que sintió Ana ese día.", "Ninguno habla de Ana."),
];

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿Qué información aparece solo en el Texto 2?", "Texto 1: Chan Chan fue la capital del reino chimú y está hecha de adobe.\nTexto 2: Chan Chan, hecha de adobe, sufre daños cada vez que llegan las lluvias de El Niño.", "El daño de las lluvias", "Que está hecha de adobe", "Que fue la capital chimú"),
  pt("¿En qué coinciden los dos textos?", "Texto 1: La vicuña estuvo a punto de desaparecer por la caza.\nTexto 2: Gracias a la protección, hoy hay más de 200 000 vicuñas en el Perú.", "En que la vicuña necesitó protección", "En el número exacto de vicuñas que hay", "En que la caza continúa"),
  pt("¿Qué texto es más útil para saber cómo llegar a Kuélap?", "Texto 1: «Kuélap, fortaleza de los chachapoyas»: historia y arquitectura.\nTexto 2: «Guía del viajero»: rutas, horarios y precios para visitar Kuélap.", "El Texto 2, porque da datos prácticos", "El Texto 1, porque es de historia", "Ninguno de los dos"),
  pt("¿En qué se diferencian los textos?", "Texto 1: Una científica explica por qué tiembla la tierra.\nTexto 2: Un niño cuenta lo que sintió durante el sismo.", "Uno explica el fenómeno y el otro relata una vivencia.", "Los dos son relatos personales de niños que sintieron el sismo.", "Los dos dan cifras."),
  pt("¿Qué se puede concluir al unir los textos?", "Texto 1: El plástico tarda siglos en degradarse.\nTexto 2: Cada persona usa cientos de bolsas de plástico al año.", "El plástico que usamos se acumula por mucho tiempo.", "Las bolsas de plástico se degradan en menos de un año.", "Nadie usa plástico."),
  pt("¿Qué información aparece solo en el Texto 1?", "Texto 1: El Huascarán mide más de 6700 metros y está en Áncash.\nTexto 2: El Huascarán es la montaña más alta del Perú.", "Su altura y su ubicación", "Que es la más alta del Perú", "Que es una montaña"),
];

const PERSUASIVE = [
  read("Menos pantallas, más patio", "📵", "Proponemos que durante el recreo no se usen celulares. En primer lugar, el recreo es el único momento para correr y conversar cara a cara. En segundo lugar, un estudio de nuestra propia escuela mostró que, los días sin celular, hubo menos peleas. Algunos dirán que el celular sirve para emergencias; para eso, puede quedar guardado en la mochila. Probemos un mes y evaluemos.",
    ["¿Cuál es la postura de los autores?", "No usar celulares durante el recreo", "Prohibir los celulares en toda la ciudad", "Eliminar el recreo"],
    ["¿Qué razón se apoya en una prueba?", "Los días sin celular hubo menos peleas.", "El recreo sirve para correr y conversar.", "Probemos un mes."],
    ["¿Cómo responden a la objeción de las emergencias?", "Proponen guardar el celular en la mochila.", "Dicen que en la escuela no existen emergencias.", "No responden."]),
  read("Un huerto en cada escuela", "🥬", "Toda escuela debería tener un huerto. Cuando los alumnos siembran, entienden de dónde viene la comida y prueban verduras que antes rechazaban. Además, el huerto es un laboratorio vivo para ciencias y matemática. No hace falta mucho espacio: bastan unas cajas de madera y un rincón con sol. Lo que sí hace falta es decisión.",
    ["¿Qué quiere lograr el texto?", "Que las escuelas instalen huertos", "Que los alumnos vendan verduras", "Que se cierren los laboratorios"],
    ["¿Qué argumento responde a quienes dicen que no hay sitio?", "Bastan unas cajas y un rincón con sol.", "El huerto sirve para ciencias y matemática.", "Los alumnos siembran."],
    ["¿Qué oración funciona como cierre persuasivo?", "«Lo que sí hace falta es decisión».", "«Bastan unas cajas de madera».", "«Entienden de dónde viene la comida»."]),
];

// --- G. Tono -----------------------------------------------------------------

const FORMAL = "¿Qué oración es más formal?";
const FORMALITY: ChoiceItem[] = [
  w(FORMAL, "Le agradezco su pronta respuesta.", "Gracias por contestar al toque, pues.", "Chévere que respondiste."), w(FORMAL, "Solicito permiso para ausentarme mañana.", "Mañana no vengo, ¿ya?", "Oye, mañana falto porque tengo que ir a un sitio."),
  w(FORMAL, "Lamento informarle que la reunión se canceló.", "Uy, ya no hay reunión.", "Qué pena, se cayó la reunión que teníamos para hoy."), w(FORMAL, "¿Podría indicarme dónde queda la biblioteca?", "¿Dónde está la biblio?", "Oye, ¿y la biblioteca por dónde queda, ah? Dime, pues."),
  w(FORMAL, "Estimados padres de familia:", "Hola, papis y mamis de todo el salón:", "¡Qué tal, gente!"), w(FORMAL, "El experimento no obtuvo el resultado esperado.", "El experimento nos salió recontra mal, qué roche.", "No nos ligó."),
  w(FORMAL, "Adjunto el informe solicitado.", "Ahí te mando el informe que querías.", "Te paso lo que pediste."), w(FORMAL, "Me dirijo a usted para presentar una queja.", "Te escribo porque estoy recontra molesto con ustedes.", "Oye, esto no puede ser."),
  w(FORMAL, "Los estudiantes deberán ingresar en orden.", "Los chicos entran tranquilitos y sin hacer chongo.", "Pasen nomás."), w(FORMAL, "Quedo a la espera de su respuesta.", "Avísame cualquier cosa cuando puedas, ¿ya?", "Me cuentas, ¿sí?"),
];

// --- H. Personajes -----------------------------------------------------------

const TRAIT = "¿Cómo es el personaje?";
const TRAITS: ChoiceItem[] = [
  pt(TRAIT, "—No fui yo quien rompió el vidrio, pero vi quién fue y se lo diré a la directora —afirmó Celia.", "Recta", "Miedosa", "Distraída"),
  pt(TRAIT, "Renzo pasó la tarde desarmando el reloj viejo para ver cómo giraban los engranajes.", "Curioso", "Vanidoso", "Indeciso"),
  pt(TRAIT, "—Si tú no puedes, yo llevo las dos mochilas —dijo Paola, aunque también estaba cansada.", "Solidaria", "Orgullosa", "Rencorosa"),
  pt(TRAIT, "Antes de responder, el abuelo se quedó callado un buen rato, mirando el fuego.", "Reflexivo", "Impulsivo", "Burlón"),
  pt(TRAIT, "—¿Otra vez arroz? Esto está frío. Y esta silla es dura —se quejó Hernán.", "Quejoso", "Agradecido", "Tímido"),
  pt(TRAIT, "Sin que nadie se lo pidiera, Mayra se quedó a ordenar las sillas después de la actuación.", "Colaboradora", "Perezosa", "Desconfiada"),
  pt(TRAIT, "—Yo ya lo sabía. Yo siempre lo sé todo antes que ustedes —dijo Fabricio.", "Engreído", "Modesto", "Prudente"),
  pt(TRAIT, "Elena cambió de respuesta cuatro veces y al final dejó la pregunta en blanco.", "Insegura", "Decidida", "Generosa"),
];

const COMPARE_CHARACTERS = [
  read("Los dos capitanes", "⚽", "Samuel, capitán del equipo azul, grita las jugadas y celebra cada gol corriendo hacia la tribuna. Irene, capitana del equipo rojo, casi no levanta la voz: basta una mirada suya para que sus compañeras se ordenen. Cuando un rival cae lesionado, sin embargo, los dos son los primeros en detener el juego.",
    ["¿En qué se diferencian Samuel e Irene?", "Él es expresivo y ella, serena.", "Él es tímido y ella, muy ruidosa.", "Él juega limpio y ella no."],
    ["¿En qué se parecen?", "Ambos respetan al rival.", "Ambos gritan las jugadas.", "Ambos celebran corriendo hacia la tribuna."],
    ["¿Qué detalle muestra el liderazgo de Irene?", "Le basta una mirada para ordenar al equipo.", "Detiene el juego.", "Es capitana del equipo rojo desde hace dos años."]),
  read("La hormiga y la cigarra, otra vez", "🐜", "La hormiga guardó granos todo el verano y no descansó ni un domingo. La cigarra cantó en cada fiesta del prado y alegró a todos. Llegó el invierno. La cigarra tocó la puerta con hambre; la hormiga abrió con aburrimiento: llevaba meses sin oír una canción. Esa noche cenaron juntas, y hubo música.",
    ["¿Cómo es la hormiga frente a la cigarra?", "Previsora; la cigarra, despreocupada.", "Alegre, mientras que la cigarra es seria.", "Perezosa, igual que ella."],
    ["¿Qué le faltaba a cada una?", "A la cigarra, comida; a la hormiga, alegría.", "A las dos, un lugar abrigado donde dormir en invierno.", "A la hormiga, granos."],
    ["¿Qué cambia respecto de la fábula tradicional?", "Las dos se necesitan y comparten.", "La hormiga deja morir a la cigarra.", "La cigarra trabaja todo el verano."]),
];

// --- I. Elementos del cuento -------------------------------------------------

const NARR = sorter(["Primera persona (el narrador es un personaje)", "Tercera persona limitada (sigue a un solo personaje)", "Tercera persona omnisciente (lo sabe todo de todos)"], "¿Desde qué punto de vista se narra?");
const NARRATOR: ChoiceItem[] = [
  ...["Guardé la carta sin abrirla; me daba miedo saber.", "Nunca supe por qué mi abuelo calló aquel día.", "Corrimos hasta el muelle, pero el bote ya no estaba.", "Me juré que volvería a ese pueblo."].map((x) => NARR(x, 0)),
  ...["Camila guardó la carta; le daba miedo saber. No vio que su hermano la observaba.", "Elías sintió un nudo en la garganta, pero no sabía qué pensaba su madre.", "Rosa miró el reloj y se preguntó si llegarían a tiempo.", "Solo Julio notó el temblor en su propia voz."].map((x) => NARR(x, 1)),
  ...["Camila temía abrir la carta; su hermano, en cambio, ya sabía lo que decía.", "Elías callaba por orgullo; su madre, por tristeza.", "Ninguno de los tres sospechaba que pensaban lo mismo.", "Rosa confiaba en llegar; el chofer, en secreto, lo dudaba."].map((x) => NARR(x, 2)),
];

const STORY_ELEMENTS = [
  read("El apagón", "🕯️", "Una noche de julio, en un edificio del centro de Arequipa, se fue la luz. En el ascensor quedaron atrapados el señor Paredes, que no saludaba a nadie, y Nico, el niño del quinto piso. Pasaron una hora a oscuras. Nico sacó sus canicas luminosas y le enseñó a jugar. Cuando volvió la luz, el señor Paredes pidió la revancha.",
    ["¿Cuál es el escenario?", "Un ascensor de un edificio, una noche de julio", "Un parque del centro de Arequipa, un domingo al mediodía", "Una escuela"],
    ["¿Cuál es el conflicto?", "Quedan atrapados juntos y a oscuras.", "Nico pierde sus canicas luminosas en el ascensor.", "El edificio se incendia."],
    ["¿Cómo cambia el señor Paredes?", "De distante pasa a ser cercano.", "De alegre pasa a estar molesto.", "No cambia."]),
  read("La apuesta", "🚣", "En la laguna de Paca, una tarde de feria, Benjamín apostó que cruzaría remando antes que su prima Ada. A mitad de camino se le rompió un remo. Ada pudo ganar fácilmente; en cambio, giró su bote y lo remolcó hasta la orilla. Benjamín pagó la apuesta: una semana lavando los platos de los dos.",
    ["¿Quiénes son los personajes principales?", "Benjamín y Ada", "Los vendedores de la feria", "Un pescador"],
    ["¿Cuál es el clímax?", "El remo se rompe y Ada regresa por él.", "Benjamín hace la apuesta en plena tarde de feria.", "Benjamín lava los platos."],
    ["¿Cuál es el desenlace?", "Benjamín cumple la apuesta.", "Ada gana la carrera y se burla de su primo.", "Los dos se hunden."]),
];

const PLOT: ChoiceItem[] = [
  w("¿Cómo se llama la parte en que los hechos se complican antes del clímax?", "Nudo o desarrollo", "Desenlace o final", "Planteamiento"), w("¿Qué es un conflicto externo?", "La lucha del personaje contra algo de fuera", "Una duda que el personaje siente en su interior", "El lugar del relato"),
  w("¿Qué es un conflicto interno?", "Una lucha dentro del propio personaje", "Una pelea a golpes entre dos personajes", "Una tormenta"), w("¿Qué es el desenlace?", "La parte donde se resuelve el conflicto", "La parte donde aparece el problema", "El título"),
  pt("¿Qué tipo de conflicto es?", "Marina quiere decir la verdad, pero teme perder a su mejor amiga.", "Interno", "Externo, contra la naturaleza", "Externo, contra otro personaje"), pt("¿Qué tipo de conflicto es?", "Los pescadores luchan contra una tormenta para volver al puerto.", "Externo, contra la naturaleza", "Interno", "Externo, contra otro personaje"),
  pt("¿Qué tipo de conflicto es?", "Dos hermanos discuten por quién heredará la chacra.", "Externo, contra otro personaje", "Interno", "Externo, contra la naturaleza"), pt("¿Qué parte de la trama es?", "«Entonces la cuerda cedió, y por un instante nadie respiró».", "Clímax", "Planteamiento", "Desenlace"),
  pt("¿Qué parte de la trama es?", "«Vivían al pie del nevado tres hermanas tejedoras».", "Planteamiento", "Clímax", "Nudo"), pt("¿Qué hecho pertenece al nudo?", "1. Un niño halla un mapa.\n2. Sigue las pistas y se pierde en el bosque.\n3. Encuentra la cueva en el último segundo.\n4. Regresa a casa.", "Sigue las pistas y se pierde.", "Halla un mapa.", "Regresa a casa con el tesoro."),
];

// --- J. Estructura del texto -------------------------------------------------

const INFO_ORDER: OrderItem[] = [
  { p: "Ordena cómo se forma un fósil.", seq: ["Un animal muere y queda cubierto de lodo.", "Las partes blandas se descomponen.", "Los minerales reemplazan los huesos.", "La erosión deja el fósil al descubierto."] },
  { p: "Ordena el recorrido del agua potable.", seq: ["Se capta el agua del río.", "Se filtra y se desinfecta en la planta.", "Se almacena en reservorios.", "Llega a las casas por tuberías."] },
  { p: "Ordena cómo se elige al municipio escolar.", seq: ["Se inscriben las listas.", "Los candidatos presentan sus propuestas.", "Los alumnos votan.", "Se cuentan los votos y se anuncia al ganador."] },
  { p: "Ordena las fases de un eclipse de Luna.", seq: ["La Luna entra en la sombra de la Tierra.", "La sombra la cubre poco a poco.", "La Luna se ve rojiza.", "La Luna sale de la sombra."] },
  { p: "Ordena cómo se hace un tejido de alpaca.", seq: ["Se esquila al animal.", "Se hila la fibra.", "Se tiñe con plantas o minerales.", "Se teje en el telar."] },
  { p: "Ordena cómo se propaga una noticia falsa.", seq: ["Alguien inventa un dato.", "Lo publica sin fuente.", "Otros lo comparten sin verificar.", "Mucha gente termina creyéndolo."] },
];

const COMPARE = [
  read("Cóndor y gallinazo", "🦅", "El cóndor andino y el gallinazo son aves carroñeras: limpian el ambiente al comer animales muertos. Sin embargo, difieren bastante. El cóndor vive en las alturas, mide hasta tres metros con las alas abiertas y pone un huevo cada dos años. El gallinazo, por su parte, abunda en las ciudades de la costa, es mucho más pequeño y se reproduce con mayor frecuencia.",
    ["¿En qué se parecen?", "Ambos comen animales muertos.", "Ambos viven en ciudades.", "Ambos ponen un huevo cada dos años."],
    ["¿Qué diferencia señala el texto?", "El lugar donde viven y su tamaño", "Lo que comen", "Que solo uno de ellos es un ave"],
    ["¿Qué expresión introduce el contraste?", "«Sin embargo»", "«Ambos»", "«Al comer»"]),
  read("Cuento y noticia", "📰", "Un cuento y una noticia relatan hechos, pero no del mismo modo. El cuento narra sucesos imaginados y busca entretener; su autor puede inventar personajes y lugares. La noticia, en cambio, informa sobre algo real y reciente, y debe responder qué pasó, quién, cuándo, dónde y por qué. Mientras el cuento guarda lo más emocionante para el final, la noticia lo dice al comienzo.",
    ["¿Qué tienen en común?", "Los dos relatan hechos.", "Los dos son inventados.", "Los dos empiezan por lo más importante."],
    ["¿En qué se diferencian?", "En si los hechos son reales o imaginados", "En que solo el cuento tiene palabras", "En nada"],
    ["¿Qué palabra señala una diferencia en la última oración?", "«Mientras»", "«Final»", "«Dice»"]),
];

const CAUSE_INFO: ChoiceItem[] = [
  pt("¿Cuál es el efecto?", "Al subir la temperatura del mar, los corales expulsan las algas que les dan color y se vuelven blancos.", "Los corales se blanquean.", "Sube la temperatura.", "Las algas dan color."),
  pt("¿Cuál es la causa?", "Como el suelo quedó sin árboles, las lluvias arrastraron la tierra fértil.", "El suelo quedó sin árboles.", "La tierra fértil se perdió.", "Llovió poco."),
  pt("¿Cuál es el efecto?", "La Luna atrae el agua de los océanos; en consecuencia, el nivel del mar sube y baja dos veces al día.", "Se producen las mareas.", "La Luna atrae el agua.", "El océano es salado."),
  pt("¿Cuál es la causa?", "Muchos jóvenes migraron a la ciudad, por lo que el pueblo quedó con pocos agricultores.", "Los jóvenes migraron.", "Quedaron pocos agricultores.", "El pueblo creció."),
  pt("¿Cuál es el efecto?", "Debido a que el aire caliente pesa menos, el globo aerostático se eleva.", "El globo se eleva.", "El aire caliente pesa menos.", "El globo es grande."),
  pt("¿Cuál es la causa?", "Las abejas disminuyen a causa del uso de pesticidas en los cultivos.", "El uso de pesticidas", "La disminución de abejas", "El aumento de flores"),
  pt("¿Qué expresión señala la causa?", "El partido se suspendió debido a la tormenta eléctrica.", "«debido a»", "«se suspendió»", "«el partido»"),
  pt("¿Qué expresión señala el efecto?", "Se rompió la tubería; como resultado, la calle se inundó.", "«como resultado»", "«se rompió»", "«la tubería»"),
];

const PROBLEM_SOLUTION = pool([
  ["Las heladas queman los cultivos de la puna.", "Cubrir los sembríos con mantas térmicas."], ["En el barrio no hay dónde reciclar.", "Instalar un punto de acopio."], ["Los alumnos olvidan lo leído.", "Hacer resúmenes después de leer."],
  ["La laguna se llena de plásticos.", "Colocar tachos y organizar limpiezas."], ["Muchos niños no desayunan.", "Abrir un comedor escolar."], ["Las noticias falsas se difunden rápido.", "Verificar la fuente antes de compartir."],
  ["El puente peatonal está oscuro.", "Instalar luminarias solares."], ["La biblioteca cierra antes de la salida.", "Ampliar su horario de atención."],
]);

const STRUCT = sorter(["Secuencia", "Comparación", "Causa y efecto", "Problema y solución", "Descripción"], "¿Qué estructura tiene el texto?");
const STRUCTURES: ChoiceItem[] = [
  ...["En 1532 llegaron los españoles. Tres años después se fundó Lima. En 1821 se proclamó la Independencia.", "Primero se seca el cacao; luego se tuesta; finalmente se muele."].map((x) => STRUCT(x, 0)),
  ...["Tanto el delfín como el tiburón viven en el mar; pero el delfín es mamífero y el tiburón, pez.", "La costa es seca; la selva, por el contrario, recibe lluvias casi a diario."].map((x) => STRUCT(x, 1)),
  ...["Como se taló el bosque, el río arrastra más lodo y el agua llega turbia.", "El uso excesivo del celular antes de dormir provoca que cueste conciliar el sueño."].map((x) => STRUCT(x, 2)),
  ...["Los buses llegaban llenos y tarde. La municipalidad creó un carril exclusivo y el viaje se acortó.", "Faltaban libros en el aula. Las familias armaron una biblioteca con donaciones."].map((x) => STRUCT(x, 3)),
  ...["El tucán tiene un pico enorme y colorido, plumaje negro y una mancha amarilla en el pecho.", "La plaza es cuadrada, con una pileta de piedra al centro y bancas de fierro alrededor."].map((x) => STRUCT(x, 4)),
];

// --- K. Detalles sensoriales -------------------------------------------------

const SENSE = sorter(["Vista", "Oído", "Olfato", "Gusto", "Tacto"], "¿A qué sentido se dirige el detalle?");
const SENSES: ChoiceItem[] = [
  ...["Un relámpago partió el cielo en dos.", "Las luces del puerto parpadeaban a lo lejos.", "La neblina borraba los cerros."].map((x) => SENSE(x, 0)),
  ...["El río rugía entre las piedras.", "Un silbido agudo cortó el silencio.", "La puerta chirrió al abrirse."].map((x) => SENSE(x, 1)),
  ...["El eucalipto perfumaba el camino.", "Del horno salía olor a pan recién hecho.", "El establo apestaba a guano."].map((x) => SENSE(x, 2)),
  ...["El ají le encendió la lengua.", "La granadilla era dulce y fresca.", "El café amargo lo despertó."].map((x) => SENSE(x, 3)),
  ...["El lodo tibio se le escurría entre los dedos.", "El viento le erizó la piel.", "La corteza rugosa le raspó la palma."].map((x) => SENSE(x, 4)),
];
const SENSORY = "¿Qué oración tiene un detalle sensorial?";
const SENSORY_ID: ChoiceItem[] = [
  w(SENSORY, "El granizo tamborileaba sobre la calamina.", "Anoche cayó granizo en todo el distrito.", "El granizo es agua."), w(SENSORY, "Un olor agrio subía desde el sótano.", "El sótano estaba debajo de la casa antigua.", "Había un sótano."),
  w(SENSORY, "La sopa humeante le quemó el paladar.", "La sopa se sirve antes del segundo plato.", "Tomó sopa."), w(SENSORY, "El terciopelo se deslizaba suave entre sus dedos.", "El terciopelo es una tela que se usa en vestidos.", "Compró tela."),
  w(SENSORY, "Chispas anaranjadas saltaban de la fogata.", "La fogata estaba en el centro del campamento.", "Hicieron fuego."), w(SENSORY, "El zumbido de los mosquitos no la dejó dormir.", "Los mosquitos abundan cerca del agua estancada.", "Había insectos."),
  pt("¿Qué palabras del texto son detalles sensoriales?", "Bajamos al muelle. El aire salado y el graznido de las gaviotas nos recibieron.", "«aire salado» y «graznido»", "«bajamos» y «recibieron»", "«muelle» y «nos»"),
  pt("¿Qué palabras del texto son detalles sensoriales?", "La panadería abrió. Un calor dulce, con olor a vainilla, llenó la vereda.", "«calor dulce» y «olor a vainilla»", "«panadería» y «vereda»", "«abrió» y «llenó»"),
];

// --- L. Recursos literarios --------------------------------------------------

const FIG = sorter(["Símil (compara con «como», «cual» o «parece»)", "Metáfora (dice que una cosa es otra)"], "¿Es un símil o una metáfora?");
const SIMILE_METAPHOR: ChoiceItem[] = [
  ...["El río serpenteaba como una cinta de plata.", "Sus palabras cayeron cual piedras.", "La ciudad parecía un hormiguero.", "Corrió igual que una liebre.", "Tenía el cabello como la noche.", "El niño temblaba como una hoja."].map((x) => FIG(x, 0)),
  ...["El río era una cinta de plata.", "Sus palabras fueron piedras.", "La ciudad es un hormiguero.", "La memoria es un baúl.", "Su cabello era la noche misma.", "El tiempo es un ladrón."].map((x) => FIG(x, 1)),
];
const FIGURE_PICS: ChoiceItem[] = [
  { pic: "🕰️", a: "El tiempo es un ladrón silencioso.", d: ["El reloj fue robado por un ladrón anoche.", "El tiempo es lento."] }, { pic: "📚", a: "Un libro es una ventana al mundo.", d: ["El libro está junto a la ventana de mi cuarto.", "El libro es grande."] },
  { pic: "🌋", a: "Estalló como un volcán de rabia.", d: ["El volcán está dormido.", "Visitó un volcán con su familia en verano."] }, { pic: "🕸️", a: "Quedó atrapado en una red de mentiras.", d: ["La araña teje una red.", "Compró una red para pescar en la laguna."] },
  { pic: "🪨", a: "Tiene el corazón de piedra.", d: ["Halló una piedra con forma de corazón.", "La piedra es dura."] }, { pic: "🦉", a: "Mi abuela es un búho: de noche lo ve todo.", d: ["Mi abuela tiene un búho.", "El búho de mi abuela duerme durante el día."] },
  { pic: "⚡", a: "La noticia cayó como un rayo.", d: ["Un rayo cayó sobre el árbol del patio.", "Hubo tormenta."] }, { pic: "🌱", a: "Cada niño es una semilla.", d: ["Cada niño sembró una semilla en su maceta.", "La semilla brotó."] },
];
const MEAN = "¿Qué significa la expresión?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "Después de la discusión, entre ellos se levantó un muro.", "Dejaron de comunicarse.", "Construyeron una pared de ladrillo en el jardín.", "Se abrazaron."),
  pt(MEAN, "La memoria de mi abuelo es un baúl sin fondo.", "Recuerda muchísimas cosas.", "Guarda sus recuerdos en un baúl de madera.", "Olvida todo."),
  pt(MEAN, "Las noticias volaron como pólvora.", "Se difundieron rapidísimo.", "Explotaron con mucho ruido en la plaza.", "Nadie se enteró."),
  pt(MEAN, "Ese niño es una esponja en clase.", "Aprende todo con facilidad.", "Se moja con frecuencia cuando llueve mucho.", "Es blando."),
  pt(MEAN, "La maestra tiene ojos en la espalda.", "Se da cuenta de todo.", "Usa lentes oscuros cuando sale al patio.", "Ve muy poco."),
  pt(MEAN, "El pueblo dormía bajo una sábana de neblina.", "La neblina lo cubría por completo.", "Todos dormían con sábanas blancas y gruesas.", "Hacía sol."),
  pt(MEAN, "Su carta fue un rayo de sol en mi semana.", "Me alegró mucho.", "Llegó un mediodía de muchísimo calor.", "Me quemó."),
  pt(MEAN, "Tenía un nudo en la garganta.", "Estaba a punto de llorar.", "Se había atado mal la bufanda de lana.", "Tenía hambre."),
];
const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa la alusión a Ícaro?", "Fuente: Ícaro voló con alas de cera; por acercarse demasiado al sol, se derritieron y cayó.\nOración: «Quiso crecer tan rápido que terminó como Ícaro».", "Fracasó por exceso de ambición.", "Aprendió a volar en avión desde muy joven.", "Se quemó con el sol."),
  pt("¿Qué significa «canto de sirena»?", "Fuente: En la «Odisea», las sirenas atraían a los marinos con su canto para hacerlos naufragar.\nOración: «Esa oferta es un canto de sirena».", "Algo atractivo que esconde un peligro", "Una canción muy hermosa que todos quieren oír", "Un aviso de tormenta"),
  pt("¿Qué significa «trabajo de Hércules»?", "Fuente: Hércules debió cumplir doce tareas casi imposibles.\nOración: «Limpiar el río fue un trabajo de Hércules».", "Una tarea enorme y muy difícil", "Un trabajo sencillo de un solo día", "Una tarea de gimnasio"),
  pt("¿Qué significa «caballo de Troya»?", "Fuente: Los griegos entraron en Troya escondidos dentro de un caballo de madera que parecía un regalo.\nOración: «Ese correo era un caballo de Troya».", "Un engaño con apariencia inofensiva", "Un regalo sincero de un amigo muy querido", "Un juguete antiguo"),
  pt("¿Qué significa «luchar contra molinos de viento»?", "Fuente: Don Quijote atacó unos molinos creyendo que eran gigantes.\nOración: «Discutir con él es luchar contra molinos de viento».", "Enfrentar enemigos imaginarios", "Trabajar en un molino de viento", "Ganar siempre"),
  pt("¿Qué significa la alusión a Cenicienta?", "Fuente: Cenicienta pasó de fregar pisos a casarse con el príncipe.\nOración: «El equipo fue la Cenicienta del torneo».", "Nadie lo esperaba y llegó muy lejos.", "Perdió un zapato.", "Llegó tarde al partido, casi a medianoche."),
  pt("¿Qué significa «la manzana de la discordia»?", "Fuente: En el mito, una manzana de oro «para la más bella» causó una pelea entre las diosas.\nOración: «El terreno fue la manzana de la discordia entre los hermanos».", "Lo que originó la pelea", "Un regalo de bodas muy costoso", "Una fruta dañada"),
  pt("¿Qué significa «ser un Robin Hood»?", "Fuente: Robin Hood quitaba a los ricos para dar a los pobres.\nOración: «El médico es un Robin Hood: cobra a quien puede y atiende gratis a quien no».", "Ayuda a los que menos tienen.", "Es un ladrón peligroso y muy buscado.", "Vive en el bosque."),
];
const EFFECT = "¿Qué efecto logra el recurso?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«La casa nos tragó con su boca oscura».", "Vuelve amenazante la entrada.", "Indica que la casa es acogedora y luminosa.", "Hace reír."),
  pt(EFFECT, "«Esperé una eternidad en la fila».", "Exagera para transmitir impaciencia.", "Informa el tiempo exacto de la espera.", "Expresa alegría."),
  pt(EFFECT, "«El arroyo murmuraba secretos entre las piedras».", "Crea un ambiente apacible y misterioso.", "Crea un ambiente de guerra.", "Explica de dónde viene el agua."),
  pt(EFFECT, "«Sus ojos eran dos brasas».", "Muestra una mirada intensa, quizá furiosa.", "Muestra una mirada apagada y dormida.", "Dice que tenía fiebre."),
  pt(EFFECT, "«El silencio gritaba en la sala».", "Resalta lo incómodo del silencio.", "Indica que alguien gritó.", "Muestra que la sala estaba llena de música."),
  pt(EFFECT, "«Llovían aplausos sobre el escenario».", "Destaca la abundancia de aplausos.", "Señala que el teatro tenía goteras.", "Da un tono triste."),
  pt(EFFECT, "«Era un gigante de papel».", "Sugiere que su fuerza era solo apariencia.", "Sugiere que era invencible.", "Describe a un hombre que hacía cometas."),
  pt(EFFECT, "«La ciudad despertó bostezando humo».", "Da vida a la ciudad y sugiere contaminación.", "Indica que la ciudad está limpia.", "Hace el texto más científico."),
];

// --- M. Elementos visuales ---------------------------------------------------

const ILLU_1 = "Ilustración 1 🌞: Manco Cápac y Mama Ocllo salen de las aguas del Titicaca; él lleva una vara de oro que brilla más que todo lo demás.\nIlustración 2 ⛰️: Los mismos personajes, pequeños, al pie de un cerro enorme; la vara se hunde en la tierra y la gente los rodea.";
const ILLU_2 = "Ilustración 1 🐍: Una serpiente de dos cabezas ocupa casi todo el cielo; abajo, unas casas diminutas.\nIlustración 2 🌈: La serpiente se ha convertido en un arcoíris; bajo él, los campos están verdes y hay gente trabajando.";
const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿Qué se destaca en la Ilustración 1?", ILLU_1, "La vara de oro", "El cerro", "La gente del pueblo"), pt("¿Qué cambia en la Ilustración 2?", ILLU_1, "Los personajes se ven pequeños frente al cerro.", "La vara desaparece.", "Los personajes vuelven al lago del que habían salido."),
  pt("¿Qué momento del mito muestra la Ilustración 2?", ILLU_1, "El hallazgo del lugar para la ciudad", "La salida de las aguas del lago Titicaca", "El final del imperio"), pt("¿Qué transmite la Ilustración 1?", ILLU_2, "Amenaza", "Tranquilidad", "Alegría"),
  pt("¿Qué idea expresa el cambio entre las dos ilustraciones?", ILLU_2, "El peligro se transforma en algo beneficioso.", "La serpiente destruye el pueblo y los campos verdes.", "No hay ningún cambio."), pt("¿Qué detalle de la Ilustración 2 muestra bienestar?", ILLU_2, "Los campos verdes y la gente trabajando", "Las dos cabezas de la serpiente en el cielo", "Las casas diminutas"),
];

const WEB = "MAPA CONCEPTUAL\nEnergías → renovables: solar · eólica · hidráulica\nEnergías → no renovables: petróleo · carbón · gas";
const CHART = "CUADRO DE DOBLE ENTRADA\n          | Costa | Sierra | Selva\nClima     | seco  | frío   | lluvioso\nCultivo   | uva   | papa   | cacao";
const CAUSE_MAP = "ESQUEMA DE CAUSA Y EFECTO\nTala de árboles → suelo sin raíces → huaicos en época de lluvia → carreteras bloqueadas";
const ORGANIZERS: ChoiceItem[] = [
  pt("Según el mapa conceptual, ¿cuál es una energía renovable?", WEB, "La eólica", "El carbón", "El gas"), pt("Según el mapa conceptual, ¿en qué grupo está el petróleo?", WEB, "No renovables", "Renovables", "En ninguno"),
  pt("Según el cuadro, ¿qué clima tiene la sierra?", CHART, "Frío", "Seco", "Lluvioso"), pt("Según el cuadro, ¿dónde se cultiva el cacao?", CHART, "En la selva", "En la costa", "En la sierra"),
  pt("Según el esquema, ¿qué ocurre justo después de que el suelo queda sin raíces?", CAUSE_MAP, "Hay huaicos en época de lluvia.", "Se talan los árboles.", "Se bloquean las carreteras."), pt("Según el esquema, ¿cuál es la causa inicial?", CAUSE_MAP, "La tala de árboles", "Los huaicos", "Las carreteras bloqueadas"),
];

// --- N. Partes del texto -----------------------------------------------------

const FEATURES: ChoiceItem[] = [
  w("Quieres saber qué significa «erosión» en tu libro de ciencias. ¿Qué parte consultas?", "El glosario", "La portada", "La bibliografía"), w("Quieres saber de qué libros sacó sus datos el autor. ¿Qué parte consultas?", "La bibliografía", "El glosario final", "El índice"),
  w("Buscas rápidamente todas las páginas donde aparece «Caral». ¿Qué usas?", "El índice alfabético", "El prólogo del autor", "El pie de foto"), w("¿Qué elemento compara las alturas de varias montañas de un vistazo?", "Un gráfico de barras", "Un subtítulo", "Una cita textual del autor"),
  w("¿Para qué sirve una línea de tiempo?", "Para ordenar hechos según su fecha", "Para definir palabras difíciles", "Para mostrar un lugar"), w("¿Para qué sirve la leyenda de un mapa?", "Para explicar sus símbolos y colores", "Para contar un cuento", "Para dar el nombre completo del autor del mapa"),
  w("En una página web, ¿qué te lleva a otra página con más información?", "Un hipervínculo", "Un pie de foto", "Una negrita"), w("¿Qué parte de un artículo resume su contenido en pocas líneas, antes del texto?", "La entradilla o bajada", "La bibliografía final", "El glosario"),
  w("¿Para qué sirve una nota al pie?", "Para aclarar o ampliar un dato del texto", "Para numerar los capítulos y las secciones del libro", "Para adornar la página"), w("¿Qué elemento muestra las partes de un volcán con sus nombres?", "Un diagrama rotulado", "Una línea de tiempo", "Un índice"),
];

// --- O. Poesía ---------------------------------------------------------------

const SCHEMES = ["AABB", "ABAB", "ABBA", "ABCB"];
const RHYME = (t: string, i: number): ChoiceItem => ({ p: "¿Cuál es el esquema de rima de la estrofa?", t, a: SCHEMES[i], d: SCHEMES.filter((_, k) => k !== i), e: `Las rimas siguen el esquema ${SCHEMES[i]}.` });
const RHYME_SCHEMES: ChoiceItem[] = [
  RHYME("Sube la niebla del mar,\nla loma empieza a brotar;\nmoja la tierra dormida\ny le devuelve la vida.", 0),
  RHYME("En la puna silba el viento,\nla vicuña alza la frente;\ncorre libre, sin lamento,\npor la pampa transparente.", 1),
  RHYME("Tejedora de mi aldea,\ncon tus hilos de color\nvas bordando con amor\nlo que el corazón desea.", 2),
  RHYME("El tren cruza la montaña\nechando humo y canción;\nlleva sueños de mi gente\ndentro de cada vagón.", 3),
  RHYME("Sale el sol por la quebrada\ny despierta a la manada;\nbajan todas a beber\nantes del amanecer.", 0),
  RHYME("Cuando el río se desborda\nnadie duerme en el poblado;\nla campana suena sorda\ny el cielo sigue nublado.", 1),
  RHYME("Yo tenía un barrilete\nque subía hasta la luna;\nno hubo estrella ninguna\nque no pidiera un billete.", 2),
  RHYME("Mi madre amasa en silencio\nel pan de cada mañana;\nel horno guarda el calor\ny perfuma la ventana.", 3),
];
const POEM = "Quien tiene un amigo tiene (1)\nun puerto donde llegar, (2)\nuna lámpara encendida (3)\ny un pedacito de mar. (4)\n\nQuien tiene un amigo sabe (5)\nque nunca camina solo. (6)";
const POETRY: ChoiceItem[] = [
  pt("¿Cuántas estrofas tiene el poema?", POEM, "Dos", "Seis", "Cuatro"), pt("¿Qué versos riman en la primera estrofa?", POEM, "El 2 y el 4", "El 1 y el 2", "El 1 y el 3"),
  pt("¿Qué recurso se repite al inicio de los versos 1 y 5?", POEM, "Anáfora (repetir palabras al comienzo)", "Onomatopeya (imitar un sonido con palabras)", "Hipérbole"), pt("¿Qué recurso hay en «un puerto donde llegar»?", POEM, "Metáfora: el amigo es un refugio", "Símil con «como»", "Rima asonante con el verso anterior"),
  w("¿Qué es una onomatopeya?", "Una palabra que imita un sonido", "Una exageración hecha a propósito", "Un verso sin rima"), w("¿Qué es una hipérbole?", "Una exageración intencional", "Una comparación con «como»", "Una rima perfecta"),
  w("¿Qué es el verso libre?", "El que no sigue rima ni medida fijas", "El que tiene siempre ocho sílabas por verso", "El que se canta"), w("¿Qué es la rima asonante?", "La que repite solo las vocales finales", "La que repite vocales y consonantes", "La que no repite nada"),
  pt("¿Qué recurso usa el verso?", "«¡Tic, tac!, insiste el reloj en la pared».", "Onomatopeya", "Anáfora", "Metáfora"), pt("¿Qué recurso usa el verso?", "«Lloré un océano entero aquella tarde».", "Hipérbole", "Onomatopeya", "Personificación"),
];

export const ROWS: Row[] = [
  ["D.1", "Usar detalles clave para determinar la idea principal", (r) => choose(r, "", KEY_DETAILS)],
  ["D.2", "Determinar la idea principal de un texto", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["D.3", "Identificar y analizar la idea principal de un texto", (r) => readPassage(r, MAIN_ANALYZE, false)],
  ["D.4", "Combinar las ideas principales de dos textos", (r) => choose(r, "", TWO_MAIN)],

  ["E.1", "Hacer inferencias a partir de un texto", (r) => choose(r, "", INFER)],
  ["E.2", "Hacer inferencias e identificar los detalles que las apoyan", (r) => readPassage(r, INFER_SUPPORT, false)],
  ["E.3", "Determinar el tema de cuentos cortos", (r) => readPassage(r, THEMES, false)],
  ["E.4", "Determinar varios temas en cuentos cortos", (r) => readPassage(r, MULTI_THEMES, false)],

  ["F.1", "Identificar el propósito de un texto", (r) => choose(r, "", TEXT_PURPOSE)],
  ["F.2", "Identificar el propósito y el mensaje del autor", (r) => choose(r, "", PURPOSE_MESSAGE)],
  ["F.3", "Comparar y contrastar puntos de vista", (r) => choose(r, "", POINT_OF_VIEW)],
  ["F.4", "Comparar la información de dos textos", (r) => choose(r, "", TWO_TEXTS)],
  ["F.5", "Analizar textos argumentativos", (r) => readPassage(r, PERSUASIVE, false)],

  ["G.1", "¿Qué oración es más formal?", (r) => choose(r, "", FORMALITY)],

  ["H.1", "Usar acciones y diálogos para entender a los personajes", (r) => choose(r, "", TRAITS)],
  ["H.2", "Comparar y contrastar personajes", (r) => readPassage(r, COMPARE_CHARACTERS, false)],

  ["I.1", "Identificar el punto de vista del narrador", (r) => choose(r, "", NARRATOR)],
  ["I.2", "Identificar los elementos del cuento", (r) => readPassage(r, STORY_ELEMENTS, false)],
  ["I.3", "Analizar los elementos de la trama", (r) => choose(r, "", PLOT)],

  ["J.1", "Determinar el orden de los hechos en textos informativos", (r) => order(r, "Ordena los pasos.", INFO_ORDER)],
  ["J.2", "Comparar y contrastar en textos informativos", (r) => readPassage(r, COMPARE, false)],
  ["J.3", "Relacionar causas y efectos en textos informativos", (r) => choose(r, "", CAUSE_INFO)],
  ["J.4", "Relacionar problemas con sus soluciones", (r) => choose(r, "¿Qué solución corresponde al problema?", PROBLEM_SOLUTION)],
  ["J.5", "Identificar y analizar estructuras de texto", (r) => choose(r, "", STRUCTURES)],

  ["K.1", "Clasificar detalles sensoriales", (r) => choose(r, "", SENSES)],
  ["K.2", "Identificar detalles sensoriales", (r) => choose(r, "", SENSORY_ID)],

  ["L.1", "Identificar símiles y metáforas", (r) => choose(r, "", SIMILE_METAPHOR)],
  ["L.2", "Símiles y metáforas con dibujos", (r) => choose(r, "¿Qué símil o metáfora corresponde al dibujo?", FIGURE_PICS)],
  ["L.3", "Determinar el significado de símiles y metáforas", (r) => choose(r, "", FIGURE_MEANING)],
  ["L.4", "Interpretar el significado de una alusión a partir de su fuente", (r) => choose(r, "", ALLUSIONS)],
  ["L.5", "Analizar el efecto de las figuras literarias en el significado y el tono", (r) => choose(r, "", FIGURE_EFFECT)],

  ["M.1", "Comparar ilustraciones de mitos", (r) => choose(r, "", ILLUSTRATIONS)],
  ["M.2", "Leer organizadores gráficos", (r) => choose(r, "", ORGANIZERS)],

  ["N.1", "Elegir y usar las partes de un texto", (r) => choose(r, "", FEATURES)],

  ["O.1", "Señalar el esquema de rima", (r) => choose(r, "", RHYME_SCHEMES)],
  ["O.2", "Identificar los elementos de la poesía", (r) => choose(r, "", POETRY)],
];
