import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pool, pt, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Secundaria · banco de vocabulario: prefijos y sufijos cultos
// (anti-, contra-, extra-, hiper-, infra-, pos-, -cida, -fobia, -cracia,
// -logía), analogías, raíces griegas y latinas, homófonos, extranjerismos y
// préstamos, palabras parecidas, denotación y connotación, precisión léxica,
// sinónimos, uso correcto según el diccionario, usos nuevos o discutidos,
// pistas del contexto y vocabulario de ciencia y tecnología.

// --- Prefijos y sufijos -----------------------------------------------------

const PREFIX: ChoiceItem[] = [
  f("¿Qué significa «antibiótico»?", "Que actúa contra los microbios", "Que favorece la vida de los microbios", "Que es anterior a la vida"),
  f("¿Qué significa «contraindicado»?", "Que no conviene en ciertos casos", "Que está indicado dos veces", "Que se recomienda siempre"),
  f("¿Qué significa «extraterrestre»?", "De fuera de la Tierra", "Muy terrestre", "Debajo de la tierra"),
  f("¿Qué significa «hipertensión»?", "Presión arterial por encima de lo normal", "Presión arterial baja", "Tensión nerviosa provocada por el estrés diario"),
  f("¿Qué significa «infraestructura»?", "Base o conjunto de obras que sostienen algo", "Estructura muy alta", "Estructura muy alta que sobresale de las demás"),
  f("¿Qué significa «posguerra»?", "El tiempo después de una guerra", "El tiempo antes de una guerra", "Una guerra pequeña"),
  f("¿Qué significa «intercultural»?", "Que se da entre culturas distintas", "Que está dentro de una sola cultura", "Que no tiene cultura"),
];
const SUFFIX: ChoiceItem[] = [
  f("¿Qué significa «insecticida»?", "Sustancia que mata insectos", "Persona que estudia insectos", "Lugar donde viven insectos"),
  f("¿Qué significa «claustrofobia»?", "Miedo a los lugares cerrados", "Gusto por los lugares cerrados", "Estudio de los lugares cerrados"),
  f("¿Qué significa «teocracia»?", "Gobierno basado en la religión", "Miedo a la religión y a los sacerdotes", "Miedo a la religión"),
  f("¿Qué significa «sismología»?", "Estudio de los sismos", "Miedo a los sismos", "Instrumento que mide la lluvia"),
  f("¿Qué significa «homicida»?", "Que mata a una persona", "Que ama a la humanidad", "Que estudia al ser humano"),
  f("¿Qué significa «xenofobia»?", "Rechazo a los extranjeros", "Amor a los extranjeros", "Estudio de los extranjeros"),
];
const PATTERN: ChoiceItem[] = [
  f("Completa la analogía: insecto es a insecticida como hierba es a ___.", "herbicida", "herbívoro", "herbolario"),
  f("Completa la analogía: agua es a hidrofobia como lugar cerrado es a ___.", "claustrofobia", "acrofobia", "hidrofobia"),
  f("Completa la analogía: pueblo es a democracia como Dios es a ___.", "teocracia", "teología", "ateísmo"),
  f("Completa la oración: «El agricultor usó un ___ para eliminar la maleza.»", "herbicida", "herbívoro", "herbario"),
  f("Completa la oración: «La ___ estudia el origen de las palabras.»", "etimología", "entomología", "etnología"),
];

// --- Raíces griegas y latinas -----------------------------------------------

const ROOTS_SORT: ChoiceItem[] = [
  f("¿Qué palabra comparte raíz con «antropología»?", "filántropo", "antorcha", "antena"),
  f("¿Qué palabra comparte raíz con «cronología»?", "anacrónico", "cromático", "coronado"),
  f("¿Qué palabra comparte raíz con «fotografía»?", "fotosíntesis", "fósforo", "folclore"),
  f("¿Qué palabra comparte raíz con «benefactor»?", "benevolente", "bebida", "berenjena"),
  f("¿Qué palabra comparte raíz con «terrestre»?", "territorio", "terco", "tertulia"),
];
const ROOTS_MEANING = pool([
  ["antropo", "ser humano"],
  ["filo", "amor, afición"],
  ["foto", "luz"],
  ["bene", "bien"],
  ["mal", "mal"],
  ["terra", "tierra"],
  ["aqua", "agua"],
  ["omni", "todo"],
  ["pan", "todo, totalidad"],
  ["neo", "nuevo"],
]).map((it) => ({ ...it, p: "¿Qué significa esta raíz?" }));
const ROOTS_WORDS: ChoiceItem[] = [
  f("Si «filo» es amor y «sofía» es sabiduría, ¿qué es la filosofía?", "El amor a la sabiduría", "El miedo al saber", "El estudio de la tierra"),
  f("Si «omni» es todo y «potente» es poderoso, ¿qué significa «omnipotente»?", "Que lo puede todo", "Que no puede nada", "Que es muy pequeño"),
  f("Si «neo» es nuevo y «logismo» es palabra, ¿qué es un neologismo?", "Una palabra nueva", "Una palabra antigua", "Una palabra extranjera"),
  f("Si «pan» es todo y «demia» es pueblo, ¿qué es una pandemia?", "Una enfermedad que afecta a muchos pueblos", "Una enfermedad de un solo pueblo", "Una enfermedad que solo afecta a un pueblo pequeño"),
  f("Si «a» es sin y «nomos» es ley, ¿qué significa «anomia»?", "Ausencia de normas", "Exceso de leyes", "Ley nueva"),
];

// --- Homófonos ---------------------------------------------------------------

const HOMOPHONE: ChoiceItem[] = [
  f("Completa: «El congresista no quiso ___ en la sesión.»", "votar", "botar", "votár"),
  f("Completa: «No hay que ___ papeles en la calle.»", "botar", "votar", "botár"),
  f("Completa: «La ___ del mar golpeaba la roca.»", "ola", "hola", "olá"),
  f("Completa: «___, ¿cómo estás?»", "Hola", "Ola", "Holá"),
  f("Completa: «El atleta tiene ___ en los brazos.»", "vello", "bello", "beyo"),
  f("Completa: «El paisaje de Huaraz es muy ___.»", "bello", "vello", "beyo"),
  f("Completa: «Voy a ___ la canción en el celular.»", "grabar", "gravar", "grabár"),
  f("Completa: «El gobierno decidió ___ con un impuesto los productos de lujo.»", "gravar", "grabar", "gravár"),
  f("Completa: «Ya está ___: firmamos el contrato.»", "hecho", "echo", "hechó"),
  f("Completa: «Siempre le ___ sal a la sopa.»", "echo", "hecho", "hecho de"),
  f("Completa: «La ___ de patos está prohibida en la reserva.»", "caza", "casa", "cása"),
  f("Completa: «Lo ___ mucho, no quise ofenderte.»", "siento", "ciento", "sientó"),
];
const HOMOPHONE_FIX: ChoiceItem[] = [
  pt("¿Qué palabra está mal usada?", "«La ola de calor obligó a suspender las clases; hola a todos los padres que vinieron.»", "Ninguna: «ola» y «hola» están bien usadas", "ola (debe ser «hola»)", "hola (debe ser «ola»)"),
  pt("¿Qué palabra está mal usada?", "«El vello paisaje de la sierra nos dejó sin palabras.»", "vello (debe ser «bello»)", "paisaje (debe ser «país»)", "sierra (debe ser «cierra»)"),
  pt("¿Qué palabra está mal usada?", "«Los congresistas decidieron botar a favor de la ley.»", "botar (debe ser «votar»)", "congresistas (debe ser «congregantes»)", "ley (debe ser «lei»)"),
  pt("¿Qué palabra está mal usada?", "«Ay que cuidar el agua.»", "Ay (debe ser «Hay»)", "cuidar (debe ser «cuidad»)", "agua (debe ser «hagua»)"),
];

// --- Extranjerismos y préstamos ------------------------------------------------

const ETYMOLOGY: ChoiceItem[] = [
  f("«Guano» viene del quechua «wanu». ¿Qué significaba?", "Abono, estiércol", "Ave marina", "Ave marina de la costa"),
  f("«Ojalá» viene del árabe. ¿Qué expresaba originalmente?", "Un deseo dirigido a Dios", "Un saludo de despedida", "Una orden"),
  f("«Champú» llegó al castellano desde el inglés, que lo tomó del hindi. ¿Qué muestra eso?", "Que las palabras viajan entre varias lenguas", "Que es una palabra quechua", "Que es una palabra quechua que pasó al inglés y al hindi"),
  f("«Huaico» viene del quechua «wayq'u». ¿Qué significaba?", "Quebrada", "Lluvia", "Piedra"),
  f("«Fútbol» viene del inglés «football». ¿Qué tipo de palabra es en castellano?", "Un anglicismo adaptado", "Un préstamo del quechua", "Un quechuismo"),
];
const FOREIGN: ChoiceItem[] = [
  pt("¿Qué significa la expresión?", "«Llegó al acuerdo motu proprio, sin que nadie se lo pidiera.»", "Por propia voluntad", "Obligado por otros", "Por error"),
  pt("¿Qué significa la expresión?", "«El presupuesto per cápita en salud es bajo.»", "Por persona", "Por región", "Total"),
  pt("¿Qué significa la expresión?", "«Su lema era carpe diem: aprovechar cada día.»", "Aprovecha el momento presente", "Prepárate para el futuro", "Recuerda el pasado"),
  pt("¿Qué significa la expresión?", "«El autor escribió con un alter ego que contaba su propia vida.»", "Un personaje que representa a otra versión de sí mismo", "Un enemigo del autor", "Un enemigo del autor que lo critica en sus libros"),
  pt("¿Qué significa la expresión?", "«Recibió el título honoris causa por su trayectoria.»", "Por honor, como reconocimiento", "Por haber pagado una suma", "Por haber aprobado un examen"),
];
const FOREIGN_USE: ChoiceItem[] = [
  f("Completa con la expresión correcta: «Juzgó la obra ___, después de verla completa.»", "a posteriori", "a priori", "sine qua non"),
  f("Completa con la expresión correcta: «El delegado fue elegido ___ para esa reunión.»", "ad hoc", "statu quo", "sine qua non"),
  f("Completa con la expresión correcta: «La asistencia es condición ___ para aprobar.»", "sine qua non", "a posteriori", "a priori"),
  f("Completa con la expresión correcta: «Aprendió el idioma ___ , viviendo en el lugar.»", "in situ", "per cápita", "statu quo"),
  f("¿Qué palabra en castellano puede reemplazar «influencer»?", "influyente", "influenza", "influjo"),
  f("¿Qué palabra en castellano puede reemplazar «online»?", "en línea", "sin línea", "en lino"),
];

// --- Elección y uso de las palabras -------------------------------------------

const RELATED: ChoiceItem[] = [
  f("¿En qué se diferencian «infringir» e «infligir»?", "Infringir es violar una norma; infligir es causar un daño o castigo.", "Son sinónimos exactos y la RAE recomienda usar siempre «infringir».", "Infringir es causar daño; infligir es romper una ley."),
  f("¿En qué se diferencian «prever» y «proveer»?", "Prever es ver con anticipación; proveer es abastecer.", "Son formas del mismo verbo y significan lo mismo en cualquier contexto.", "Prever es abastecer; proveer es adivinar."),
  f("¿En qué se diferencian «actitud» y «aptitud»?", "Actitud es disposición de ánimo; aptitud es capacidad.", "Son sinónimos.", "Actitud es capacidad; aptitud es forma de actuar."),
  f("¿En qué se diferencian «adoptar» y «adaptar»?", "Adoptar es tomar como propio; adaptar es ajustar.", "Son sinónimos y pueden usarse indistintamente en cualquier oración.", "Adoptar es ajustar; adaptar es acoger."),
  f("¿En qué se diferencian «perjuicio» y «prejuicio»?", "Perjuicio es un daño; prejuicio es una opinión previa sin fundamento.", "Son sinónimos y la diferencia es solo de ortografía, sin cambio de significado.", "Perjuicio es una opinión; prejuicio es un daño."),
];
const CONNOTATION: ChoiceItem[] = [
  f("¿Qué palabra se ajusta mejor a un elogio? «Su discurso fue ___.»", "elocuente", "palabrero", "verborreico"),
  f("¿Qué palabra se ajusta mejor a una crítica? «Su actitud fue ___.»", "altanera", "segura", "decidida"),
  f("¿Qué palabra se ajusta mejor a un elogio? «Es una persona ___.»", "prudente", "miedosa", "cobarde"),
  f("¿Qué palabra se ajusta mejor a una crítica? «El proyecto es ___.»", "descabellado", "ambicioso", "audaz"),
  f("¿Qué palabra tiene una connotación neutra para «persona que llega a vivir a otro país»?", "inmigrante", "invasor", "intruso"),
];
const PRECISE: ChoiceItem[] = [
  f("¿Qué palabra es más precisa? «El doctor ___ un tratamiento.»", "prescribió", "dio y puso", "puso"),
  f("¿Qué palabra es más precisa? «El juez ___ al acusado.»", "absolvió", "dejó", "hizo libre"),
  f("¿Qué palabra es más precisa? «La empresa ___ a sus trabajadores.»", "capacitó", "enseñó cosas", "hizo aprender"),
  f("¿Qué palabra es más precisa? «El Congreso ___ la ley.»", "derogó", "quitó", "sacó"),
  f("¿Qué palabra es más precisa? «El volcán ___ ceniza.»", "expulsó", "botó afuera", "sacó"),
];
const THESAURUS: ChoiceItem[] = [
  f("¿Qué sinónimo puede reemplazar «pobre» en «un argumento pobre»?", "endeble", "humilde", "necesitado"),
  f("¿Qué sinónimo puede reemplazar «claro» en «un ejemplo claro»?", "evidente", "luminoso", "despejado"),
  f("¿Qué sinónimo puede reemplazar «fuerte» en «una crítica fuerte»?", "severa", "musculosa", "resistente"),
  f("¿Qué sinónimo puede reemplazar «bajo» en «un precio bajo»?", "módico", "pequeño de estatura", "grave"),
];
const USAGE: ChoiceItem[] = [
  pt("Según la entrada, ¿qué oración usa bien la palabra?", "detentar. tr. Retener y ejercer ilegítimamente algún poder o cargo.", "«El dictador detentó el poder durante años.»", "«La campeona detenta el récord nacional con orgullo.»", "«Detenté mi casa con cuidado.»"),
  pt("Según la entrada, ¿qué oración usa bien la palabra?", "álgido. adj. Dicho de un momento o de un período: crítico o culminante.", "«La discusión llegó a su momento álgido.»", "«Hoy hace un frío álgido en Lima.»", "«El álgido niño corrió.»"),
  pt("Según la entrada, ¿qué oración usa bien la palabra?", "sendos, das. adj. pl. Uno o una para cada cual de dos o más personas o cosas.", "«Los dos alumnos recibieron sendos diplomas.»", "«Recibió sendos regalos muy grandes.»", "«Fue un sendo problema que nadie supo resolver en la reunión.»"),
  pt("Según la entrada, ¿qué oración usa bien la palabra?", "inmiscuirse. prnl. Entrometerse en un asunto ajeno.", "«No te inmiscuyas en problemas ajenos.»", "«Me inmiscuí el abrigo porque hacía mucho frío en la calle.»", "«Inmiscuyó la sopa con sal.»"),
];
const CONTESTED: ChoiceItem[] = [
  w("Según la RAE, ¿es correcto usar «tuitear»?", "Sí, está registrado en el diccionario.", "No, es un anglicismo que la RAE prohíbe usar en textos escritos.", "Solo en inglés."),
  w("Según la Fundéu, ¿qué alternativa en castellano tiene «hacker»?", "pirata informático o jáquer", "computador", "computador especializado en redes"),
  w("Según la RAE, ¿cómo se escribe el plural de «el currículum»?", "los currículums", "los currícula", "los currículumes"),
  w("¿Qué recomienda la RAE sobre «empoderar»?", "Es correcto y significa dar poder a un grupo o persona.", "Es un error que debe evitarse.", "Es un error que debe evitarse porque no existe en el diccionario."),
];

// --- Analogías y contexto ---------------------------------------------------------

const ANALOGIES: ChoiceItem[] = [
  f("Completa: brújula es a orientación como termómetro es a ___.", "temperatura", "presión", "calor del cuerpo"),
  f("Completa: novela es a capítulo como poema es a ___.", "estrofa", "rima", "poeta"),
  f("Completa: escaso es a abundante como efímero es a ___.", "perdurable", "pasajero", "fugaz"),
  f("Completa: juez es a sentencia como médico es a ___.", "diagnóstico", "hospital", "enfermo"),
  f("Completa: telar es a tejido como imprenta es a ___.", "libro", "papel", "tinta"),
  f("Completa: semilla es a germinar como capullo es a ___.", "florecer", "secar", "sembrar"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa la palabra según el contexto? (pista: hay un sinónimo cerca)", "«Era un hombre parco, es decir, de muy pocas palabras.» → parco", "moderado, de pocas palabras", "hablador", "muy hablador"),
  pt("¿Qué significa la palabra según el contexto? (pista: hay un antónimo cerca)", "«Lejos de ser magnánimo, se mostró mezquino con todos.» → magnánimo", "generoso", "tacaño", "valiente"),
  pt("¿Qué significa la palabra según el contexto?", "«El informe fue tan exhaustivo que no dejó ningún detalle sin analizar.» → exhaustivo", "completo, minucioso", "cansado y agotado", "cansado"),
  pt("¿Qué significa la palabra según el contexto?", "«Su llegada fue inopinada: nadie la esperaba.» → inopinada", "inesperada", "puntual", "triste"),
  pt("¿Qué significa la palabra según el contexto? (pista: hay un antónimo cerca)", "«No era una herida leve, sino grave y profusa.» → profusa", "abundante", "escasa", "superficial"),
];
const SCIENCE: ChoiceItem[] = [
  pt("¿Qué significa el término científico según el contexto?", "«Las plantas realizan la fotosíntesis: transforman la luz en energía química.»", "Proceso por el que las plantas transforman la luz en energía", "Respiración de los animales", "Respiración de los animales durante la noche en el bosque"),
  pt("¿Qué significa el término técnico según el contexto?", "«El algoritmo, es decir, la serie de pasos que sigue el programa, ordena los datos.»", "Serie ordenada de pasos para resolver un problema", "Un tipo de computadora", "Un tipo de computadora portátil que usan los programadores"),
  pt("¿Qué significa el término científico según el contexto?", "«La erosión del suelo, causada por el viento y el agua, arrastra la tierra fértil.»", "Desgaste del suelo por acción del viento y el agua", "Abono para el suelo", "Lluvia intensa que cae en los valles de la sierra durante el verano"),
  pt("¿Qué significa el término técnico según el contexto?", "«El servidor almacena los datos que luego consultan miles de usuarios.»", "Computadora que guarda y ofrece datos a otros equipos", "Un mozo de restaurante", "Una persona que atiende las mesas en un restaurante"),
  pt("¿Qué significa el término científico según el contexto?", "«Una especie endémica solo vive en un lugar del mundo, como el gallito de las rocas en ciertos bosques.»", "Que vive únicamente en un lugar determinado", "Que está en peligro de extinción", "Que está en peligro de extinción por la tala de los bosques"),
];

export const ROWS: Row[] = [
  ["prefijos-1", (r) => choose(r, "", PREFIX)],
  ["prefijos-2", (r) => choose(r, "", SUFFIX)],
  ["prefijos-3", (r) => choose(r, "", PATTERN)],
  ["raices-1", (r) => choose(r, "", ROOTS_SORT)],
  ["raices-2", (r) => choose(r, "", ROOTS_MEANING)],
  ["raices-3", (r) => choose(r, "", ROOTS_WORDS)],
  ["homofonos-1", (r) => choose(r, "", HOMOPHONE)],
  ["homofonos-2", (r) => choose(r, "", HOMOPHONE_FIX)],
  ["prestamos-1", (r) => choose(r, "", ETYMOLOGY)],
  ["prestamos-2", (r) => choose(r, "", FOREIGN)],
  ["prestamos-3", (r) => choose(r, "", FOREIGN_USE)],
  ["precision-1", (r) => choose(r, "", RELATED)],
  ["precision-2", (r) => choose(r, "", CONNOTATION)],
  ["precision-3", (r) => choose(r, "", PRECISE)],
  ["precision-4", (r) => choose(r, "", THESAURUS)],
  ["precision-5", (r) => choose(r, "", USAGE)],
  ["usos-discutidos", (r) => choose(r, "", CONTESTED)],
  ["analogias", (r) => choose(r, "", ANALOGIES)],
  ["contexto-1", (r) => choose(r, "", CONTEXT)],
  ["contexto-2", (r) => choose(r, "", SCIENCE)],
];
