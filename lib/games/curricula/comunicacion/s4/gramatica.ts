import { choose, pickInSentence, type ChoiceItem, type InSentenceItem } from "../../../generators/lengua/bank";
import { f, pt, s, sorter } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Secundaria · banco de gramática y ortografía: prefijos im- y sub-,
// sufijos -ble e -izar, bases de las unidades de medida (centi, kilo, mili,
// hidro, tele...), palabras frecuentes con tilde, s/c/z, b/v y g/j/h; la
// oración y sus errores, frases y proposiciones, plurales de compuestos,
// pronombres (le/la/lo, tras «que» y «como», relativos, antecedentes),
// verboides, concordancia, tiempos verbales, comparativos, correlativas,
// modificadores, especificativas y explicativas, y puntuación.

// --- Ortografía ----------------------------------------------------------------

const AFFIX: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "imborrable", "inborrable", "imvorrable"),
  f("¿Qué palabra está bien escrita?", "impermeable", "inpermeable", "impermiable"),
  f("¿Qué palabra está bien escrita?", "subsuelo", "suvsuelo", "subzuelo"),
  f("¿Qué palabra está bien escrita?", "subrayar", "suvrayar", "subrallar"),
  f("¿Qué palabra está bien escrita?", "comestible", "comestivle", "comestiblé"),
  f("¿Qué palabra está bien escrita?", "visible", "bisible", "vicible"),
  f("¿Qué palabra está bien escrita?", "organizar", "organisar", "horganizar"),
  f("¿Qué palabra está bien escrita?", "sintetizar", "sintetisar", "cintetizar"),
];
const BASES: ChoiceItem[] = [
  f("¿Qué significa «kilo» en «kilómetro»?", "mil", "cien", "una milésima"),
  f("¿Qué significa «centi» en «centímetro»?", "una centésima", "cien", "cien unidades"),
  f("¿Qué significa «mili» en «mililitro»?", "una milésima", "un millón", "mil"),
  f("¿Qué significa «hidro» en «hidroeléctrica»?", "agua", "luz", "tierra"),
  f("¿Qué significa «tele» en «telescopio»?", "lejos", "cerca", "grande"),
  f("¿Qué palabra está bien escrita?", "kilogramo", "quilogramo", "kilográmo"),
  f("¿Qué palabra está bien escrita?", "hidrógeno", "hidrójeno", "idrógeno"),
  f("¿Qué palabra está bien escrita?", "telégrafo", "telégrafó", "telegráfo"),
];
const COMMON_1: ChoiceItem[] = [
  f("¿Qué oración tiene bien las tildes?", "¿Cuándo llegarás? Llegaré cuando termine.", "¿Cuando llegarás? Llegaré cuándo termine.", "¿Cuándo llegarás? Llegaré cuándo termine."),
  f("¿Qué oración tiene bien las tildes?", "No sé dónde vive. Vive donde trabaja.", "No sé donde vive. Vive dónde trabaja.", "No se dónde vive. Vive donde trabaja."),
  f("¿Qué oración tiene bien las tildes?", "¡Qué alegría! Dijo que vendría.", "¡Que alegría! Dijo qué vendría.", "¡Qué alegría! Dijo qué vendría."),
  f("¿Qué oración tiene bien las tildes?", "¿Cómo lo hiciste? Como me enseñaron.", "¿Como lo hiciste? Cómo me enseñaron.", "¿Cómo lo hiciste? Cómo me enseñaron."),
  f("¿Qué oración tiene bien las tildes?", "¿Quién llamó? El que vino ayer.", "¿Quien llamó? Él que vino ayer.", "¿Quién llamó? Él que vino ayer."),
];
const COMMON_2: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "ocasión", "ocación", "ocasción"),
  f("¿Qué palabra está bien escrita?", "conclusión", "conclución", "conclusción"),
  f("¿Qué palabra está bien escrita?", "atención", "atensión", "atencción"),
  f("¿Qué palabra está bien escrita?", "dirección", "direción", "dirreción"),
  f("¿Qué palabra está bien escrita?", "reducción", "redución", "redusión"),
  f("¿Qué palabra está bien escrita?", "comprensión", "comprención", "comprencción"),
];
const COMMON_3: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "observar", "obserbar", "ovservar"),
  f("¿Qué palabra está bien escrita?", "objetivo", "ovjetivo", "objetibo"),
  f("¿Qué palabra está bien escrita?", "exigir", "exijir", "egzigir"),
  f("¿Qué palabra está bien escrita?", "hereje", "herege", "ereje"),
  f("¿Qué palabra está bien escrita?", "ahorrar", "aorrar", "ahorar"),
  f("¿Qué palabra está bien escrita?", "vehículo", "veículo", "behículo"),
  f("¿Qué palabra está bien escrita?", "proteger", "protejer", "protegér"),
  f("¿Qué palabra está bien escrita?", "bienvenida", "bienbenida", "vienvenida"),
];

// --- La oración ------------------------------------------------------------------

const TYPE = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const TYPE_ITEMS: ChoiceItem[] = [
  TYPE("El tren a Huancayo sale los viernes.", 0),
  TYPE("¿A qué hora sale el tren a Huancayo?", 1),
  TYPE("Compra los pasajes con anticipación.", 2),
  TYPE("¡Qué paisaje tan impresionante!", 3),
  TYPE("No olvides tu casaca.", 2),
  TYPE("¿Quién ganó el concurso de declamación?", 1),
];
const FRAGMENT = sorter(["Oración completa", "Fragmento", "Oraciones pegadas"], "¿Es una oración completa, un fragmento u oraciones pegadas?");
const FRAGMENT_ITEMS: ChoiceItem[] = [
  FRAGMENT("Aunque llovió toda la noche.", 1),
  FRAGMENT("Llovió toda la noche, el río creció.", 2),
  FRAGMENT("Como llovió toda la noche, el río creció.", 0),
  FRAGMENT("Los alumnos que ganaron el concurso de oratoria.", 1),
  FRAGMENT("Ganamos el concurso, nadie lo esperaba.", 2),
  FRAGMENT("Nadie esperaba que ganáramos el concurso.", 0),
];
const FIX_RUNON: ChoiceItem[] = [
  pt("¿Qué puntuación corrige el texto?", "«Terminó la clase todos salieron al patio»", "Terminó la clase; todos salieron al patio.", "Terminó la clase, todos salieron al patio.", "Terminó, la clase todos salieron al patio."),
  pt("¿Qué puntuación corrige el texto?", "«Me encanta la sierra el aire es puro»", "Me encanta la sierra: el aire es puro.", "Me encanta la sierra, el aire es puro.", "Me encanta, la sierra el aire es puro."),
  pt("¿Qué puntuación corrige el texto?", "«Estudió mucho. Porque quería la beca.»", "Estudió mucho porque quería la beca.", "Estudió mucho. Porque, quería la beca.", "Estudió. Mucho porque quería la beca."),
];

// --- Frases y proposiciones ---------------------------------------------------------

const PHRASE = sorter(["Frase", "Proposición"], "¿Es una frase (sin verbo conjugado) o una proposición (con verbo conjugado)?");
const PHRASE_ITEMS: ChoiceItem[] = [
  PHRASE("en la orilla del lago", 0),
  PHRASE("cuando llegó la lluvia", 1),
  PHRASE("después del partido", 0),
  PHRASE("que vive en Tacna", 1),
  PHRASE("con mucha paciencia", 0),
  PHRASE("porque el bus se malogró", 1),
];
const PREP_PHRASE: InSentenceItem[] = [
  s("Caminamos por la playa de Máncora.", "por", "la", "playa", "de", "Máncora"),
  s("El libro de historia está sobre la mesa.", "de", "historia", "sobre", "la", "mesa"),
  s("Viajó a Cusco con su familia.", "a", "Cusco", "con", "su", "familia"),
];
const APPOSITION: ChoiceItem[] = [
  pt("¿Cuál es la aposición?", "«César Vallejo, el gran poeta de Santiago de Chuco, vivió en París.»", "el gran poeta de Santiago de Chuco", "César Vallejo vivió en París", "vivió en París"),
  pt("¿Cuál es la aposición?", "«Lima, la capital del Perú, tiene más de diez millones de habitantes.»", "la capital del Perú", "Lima", "más de diez millones de habitantes"),
  pt("¿Cuál es la aposición?", "«Mi vecina, una enfermera muy querida, organizó la colecta.»", "una enfermera muy querida", "Mi vecina organizó la colecta", "organizó la colecta"),
];
const CLAUSES: ChoiceItem[] = [
  pt("¿Cuál es la proposición subordinada?", "«Cuando terminó el festival, los músicos guardaron sus instrumentos.»", "Cuando terminó el festival", "los músicos guardaron sus instrumentos", "sus instrumentos"),
  pt("¿Cuál es la proposición subordinada?", "«El profesor dijo que el examen sería el lunes.»", "que el examen sería el lunes", "El profesor dijo", "El profesor dijo que el examen"),
  pt("¿Cuál es la proposición subordinada?", "«La chacra que heredó de su padre está en Jauja.»", "que heredó de su padre", "La chacra está en Jauja", "en Jauja"),
];
const SENTENCE_KIND = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada", "Coordinada y subordinada"], "¿Cómo es la oración?");
const KIND_ITEMS: ChoiceItem[] = [
  SENTENCE_KIND("Los turistas visitaron Kuélap.", 0),
  SENTENCE_KIND("Visitamos Kuélap y luego fuimos a Gocta.", 1),
  SENTENCE_KIND("Visitamos Kuélap, que es una fortaleza chachapoya.", 2),
  SENTENCE_KIND("Visitamos Kuélap, que es una fortaleza chachapoya, y luego fuimos a Gocta.", 3),
  SENTENCE_KIND("Mi hermana estudia y mi hermano trabaja.", 1),
  SENTENCE_KIND("Si estudias, aprobarás.", 2),
];
const RELATIVE: ChoiceItem[] = [
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Leí una novela. La novela trata de la selva.»", "Leí una novela que trata de la selva.", "Leí una novela, la novela trata de la selva.", "Leí una novela cuya trata de la selva."),
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Conocí a una artesana. Sus retablos son famosos.»", "Conocí a una artesana cuyos retablos son famosos.", "Conocí a una artesana que sus retablos son famosos.", "Conocí a una artesana, sus retablos son famosos."),
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Visitamos el pueblo. En el pueblo nació mi abuelo.»", "Visitamos el pueblo donde nació mi abuelo.", "Visitamos el pueblo que nació mi abuelo.", "Visitamos el pueblo, nació mi abuelo."),
];

// --- Sustantivos: plurales de compuestos --------------------------------------------

const COMPOUND: ChoiceItem[] = [
  f("¿Cuál es el plural de «bocacalle»?", "bocacalles", "bocascalles", "bocascalle"),
  f("¿Cuál es el plural de «el cumpleaños»?", "los cumpleaños", "los cumpleañoses", "los cumpleaño"),
  f("¿Cuál es el plural de «guardaespaldas»?", "guardaespaldas", "guardaespaldases", "guardasespaldas"),
  f("¿Cuál es el plural de «hombre rana»?", "hombres rana", "hombre ranas", "hombres ranas"),
  f("¿Cuál es el plural de «sordomudo»?", "sordomudos", "sordosmudos", "sordomudoes"),
  f("¿Cuál es el plural de «el sacacorchos»?", "los sacacorchos", "los sacacorchoses", "los sacascorchos"),
];

// --- Pronombres ------------------------------------------------------------------

const LEISMO: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "A María la vi en el mercado.", "A María le vi en el mercado.", "A María lo vi en el mercado."),
  f("¿Qué oración es correcta?", "A mi hermana le regalé un libro.", "A mi hermana la regalé un libro.", "A mi hermana lo regalé un libro."),
  f("¿Qué oración es correcta?", "Los cuadernos los dejé en la carpeta.", "Los cuadernos les dejé en la carpeta.", "Los cuadernos le dejé en la carpeta."),
  f("¿Qué oración es correcta?", "A mis primos les envié una carta.", "A mis primos los envié una carta.", "A mis primos le envié una carta."),
];
const THAN_AS: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Mi hermano es más alto que yo.", "Mi hermano es más alto que mí.", "Mi hermano es más alto que a mí."),
  f("¿Qué oración es correcta?", "Ella corre tan rápido como tú.", "Ella corre tan rápido como ti.", "Ella corre tan rápido como contigo."),
  f("¿Qué oración es correcta?", "Nadie lo sabe mejor que nosotros.", "Nadie lo sabe mejor que nos.", "Nadie lo sabe mejor que nuestro."),
];
const QUIEN: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Los alumnos con quienes viajé eran de Tacna.", "Los alumnos con quien viajé eran de Tacna.", "Los alumnos con quienes viajé era de Tacna."),
  f("¿Qué oración es correcta?", "Ella es la doctora a quien consulté.", "Ella es la doctora quien consulté.", "Ella es la doctora a quienes consulté."),
  f("¿Qué oración es correcta?", "Fueron mis padres quienes me apoyaron.", "Fueron mis padres quien me apoyaron.", "Fue mis padres quienes me apoyaron."),
  f("Completa: «El autor ___ novela leímos visitará el colegio.»", "cuya", "que su", "cuyo"),
  f("Completa: «La casa en ___ vivió Grau es hoy un museo.»", "la que", "quien", "cuya"),
];
const AMBIGUOUS: ChoiceItem[] = [
  pt("¿Por qué es ambigua la oración?", "«Juan le dijo a Pedro que su perro se había perdido.»", "No se sabe si el perro es de Juan o de Pedro.", "Porque usa el verbo «decir» en lugar de «contar» o «avisar».", "Porque Pedro no tiene perro."),
  pt("¿Por qué es ambigua la oración?", "«La profesora habló con la directora y ella se molestó.»", "No se sabe quién se molestó.", "Porque falta una coma.", "Porque tiene dos verbos y dos sujetos distintos."),
  pt("¿Qué versión elimina la ambigüedad?", "«Rosa vio a Ana cuando salía del colegio.»", "Rosa vio a Ana cuando esta salía del colegio.", "Rosa vio a Ana, cuando salía, del colegio.", "Rosa vio, a Ana cuando salía del colegio."),
];
const SHIFTS: ChoiceItem[] = [
  pt("¿Qué versión corrige el cambio indebido de persona?", "«Cuando uno estudia mucho, te cansas.»", "Cuando uno estudia mucho, se cansa.", "Cuando uno estudia mucho, nos cansamos.", "Cuando uno estudia mucho, te cansa."),
  pt("¿Qué versión corrige el cambio indebido de número?", "«Cada alumno debe traer sus cuadernos y entregarlos a su tutora; ellos deben estar forrados.»", "Cada alumno debe traer sus cuadernos forrados y entregarlos a su tutora.", "Cada alumno deben traer sus cuadernos.", "Cada alumno deben traer sus cuadernos y entregarlos a su tutora; ellos deben estar forrados."),
  pt("¿Qué versión corrige el cambio indebido de persona?", "«Si uno quiere aprobar, tenemos que estudiar.»", "Si queremos aprobar, tenemos que estudiar.", "Si uno quiere aprobar, tienen que estudiar.", "Si uno quiere aprobar, tienes que estudiar."),
];

// --- Verbos y verboides -------------------------------------------------------------

const TRANSITIVE = sorter(["Transitivo", "Intransitivo", "Copulativo"], "¿Cómo se usa el verbo en la oración?");
const TRANSITIVE_ITEMS: ChoiceItem[] = [
  TRANSITIVE("Mi abuela teje chompas de alpaca.", 0),
  TRANSITIVE("Los niños duermen temprano.", 1),
  TRANSITIVE("El cielo está despejado.", 2),
  TRANSITIVE("El equipo ganó el campeonato.", 0),
  TRANSITIVE("El atleta corrió durante una hora.", 1),
  TRANSITIVE("Ese cerro parece un gigante dormido.", 2),
];
const VERBOIDS = sorter(["Infinitivo", "Gerundio", "Participio"], "¿Qué verboide es la palabra indicada?");
const VERBOID_ITEMS: ChoiceItem[] = [
  VERBOIDS("«Leer» en: «Leer abre la mente».", 0),
  VERBOIDS("«caminando» en: «Llegó caminando desde el paradero».", 1),
  VERBOIDS("«terminada» en: «La obra terminada fue inaugurada».", 2),
  VERBOIDS("«cantando» en: «Aprendió quechua cantando».", 1),
  VERBOIDS("«estudiar» en: «Quiero estudiar Medicina».", 0),
  VERBOIDS("«cansados» en: «Los corredores, cansados, se sentaron».", 2),
];
const AGREEMENT: ChoiceItem[] = [
  f("¿Qué oración tiene la concordancia correcta?", "Los perros del vecino ladran de noche.", "Los perros del vecino ladra de noche.", "El perro del vecino ladran de noche."),
  f("¿Qué oración tiene la concordancia correcta?", "Ana y Luis llegaron temprano.", "Ana y Luis llegó temprano.", "Ana y Luis llegamos temprano."),
  f("¿Qué oración tiene la concordancia correcta?", "Cada uno de los alumnos presentó su trabajo.", "Cada uno de los alumnos presentaron su trabajo.", "Cada uno de los alumnos presentamos su trabajo."),
  f("¿Qué oración tiene la concordancia correcta?", "Ni el director ni la subdirectora asistieron.", "Ni el director ni la subdirectora asistí.", "Ni el director ni la subdirectora asistimos."),
  f("¿Qué oración tiene la concordancia correcta?", "Se venden departamentos.", "Se vende departamentos.", "Se venden departamento."),
  f("¿Qué oración tiene la concordancia correcta?", "Alguien dejó su mochila.", "Alguien dejaron su mochila.", "Alguien dejamos su mochila."),
];
const TENSES: ChoiceItem[] = [
  f("Completa con el tiempo progresivo: «Cuando llamaste, yo ___ la cena.»", "estaba preparando", "preparé", "habré preparado"),
  f("Completa con el tiempo compuesto: «Para diciembre, ya ___ el curso.»", "habremos terminado", "terminábamos", "estamos terminando"),
  f("Completa con el tiempo compuesto: «Cuando llegué, el tren ya ___.»", "había partido", "estaba partiendo", "partirá"),
  pt("¿Qué versión corrige el cambio indebido de tiempo?", "«Ayer fuimos al mercado y compramos fruta; luego volvemos a casa.»", "Ayer fuimos al mercado y compramos fruta; luego volvimos a casa.", "Ayer vamos al mercado y compramos fruta; luego volvemos.", "Ayer fuimos al mercado y compraremos fruta; luego volvimos."),
  pt("¿Qué versión corrige el cambio indebido de tiempo?", "«Mientras el profesor explicaba, los alumnos toman apuntes.»", "Mientras el profesor explicaba, los alumnos tomaban apuntes.", "Mientras el profesor explica, los alumnos tomaron apuntes.", "Mientras el profesor explicará, los alumnos toman apuntes."),
];

// --- Adjetivos, adverbios y conjunciones ---------------------------------------------

const ADJ_ADV: ChoiceItem[] = [
  f("Completa: «Habló ___ en la ceremonia.»", "claramente", "claro de manera", "clara"),
  f("Completa: «Su respuesta fue ___.»", "clara", "claramente", "claro modo"),
  f("Completa: «Este año jugamos ___ que el año pasado.»", "mejor", "más bien", "más bueno"),
  f("Completa: «Es el ___ alumno de la promoción.»", "mejor", "más bueno", "más mejor"),
  f("Completa: «Se sintió ___ después del accidente.»", "peor", "más mal", "más peor"),
  f("Completa: «El partido terminó ___ de lo que esperábamos.»", "peor", "más malo", "más peor"),
  f("¿Cuál es el superlativo culto de «bueno»?", "óptimo", "mejorísimo", "más bueno"),
  f("¿Cuál es el superlativo culto de «malo»?", "pésimo", "peorísimo", "más peor"),
];
const CORRELATIVE: ChoiceItem[] = [
  f("Completa: «No solo estudia, ___ también trabaja.»", "sino", "si no", "pero"),
  f("Completa: «___ vienes tú, ___ voy yo.»", "O … o", "Ni … o", "Sí … sí"),
  f("Completa: «Tanto los padres ___ los alumnos participaron.»", "como", "que", "y"),
  f("Completa: «Ni llamó ___ escribió.»", "ni", "o", "y"),
];
const MODIFIERS: ChoiceItem[] = [
  pt("¿Qué versión corrige el modificador mal colocado?", "«Se venden casacas para niños de cuero.»", "Se venden casacas de cuero para niños.", "Se venden de cuero casacas para niños.", "Se venden casacas para niños, de cuero."),
  pt("¿Qué versión corrige el gerundio mal usado?", "«Hubo un accidente, muriendo dos personas.»", "Hubo un accidente en el que murieron dos personas.", "Hubo un accidente muriendo dos personas ayer.", "Muriendo dos personas, hubo un accidente."),
  pt("¿Qué versión corrige el modificador mal colocado?", "«Corriendo por el parque, el perro me mordió.»", "Mientras yo corría por el parque, el perro me mordió.", "El perro me mordió corriendo por el parque yo.", "Corriendo, el perro me mordió por el parque."),
  pt("¿Los modificadores están bien usados?", "«El alumno, nervioso, olvidó su discurso.»", "Sí, «nervioso» modifica claramente a «el alumno».", "No, «nervioso» modifica al discurso.", "No, porque «nervioso» debería ir después de «discurso» para que se entienda."),
];

// --- Puntuación ------------------------------------------------------------------

const RESTRICTIVE: ChoiceItem[] = [
  pt("¿Qué sugiere la puntuación?", "«Los alumnos, que estudiaron, aprobaron.»", "Que todos los alumnos estudiaron y aprobaron.", "Que solo aprobaron los que estudiaron.", "Que nadie aprobó."),
  pt("¿Qué sugiere la puntuación?", "«Los alumnos que estudiaron aprobaron.»", "Que solo aprobaron los que estudiaron.", "Que todos los alumnos estudiaron.", "Que ningún alumno estudió."),
  f("¿Qué oración tiene bien las comas?", "Mi madre, que es enfermera, trabaja de noche.", "Mi madre que es enfermera, trabaja de noche.", "Mi madre, que es enfermera trabaja de noche."),
  f("¿Qué oración tiene bien las comas?", "El Misti, que domina Arequipa, es un volcán.", "El Misti que domina Arequipa, es un volcán.", "El Misti, que domina Arequipa es un volcán."),
];
const COMMAS: ChoiceItem[] = [
  f("¿Qué oración tiene bien las comas?", "Carlos, ven un momento.", "Carlos ven, un momento.", "Carlos ven un momento,"),
  f("¿Qué oración tiene bien las comas?", "No es un problema técnico, sino político.", "No es un problema técnico sino, político.", "No, es un problema técnico sino político."),
  f("¿Qué oración tiene bien las comas?", "Sin embargo, el proyecto continuará.", "Sin embargo el proyecto, continuará.", "Sin, embargo el proyecto continuará."),
  f("¿Qué oración tiene bien las comas?", "Compré papa, olluco, oca y maíz.", "Compré papa, olluco, oca, y, maíz.", "Compré, papa olluco oca y maíz."),
  f("¿Qué oración tiene bien las comas?", "Llegó a Trujillo el 6 de enero de 2024.", "Llegó a Trujillo, el 6, de enero de 2024.", "Llegó, a Trujillo el 6 de enero, de 2024."),
  f("¿Qué oración tiene bien las comas?", "Era un día frío, nublado.", "Era un día, frío nublado.", "Era, un día frío nublado."),
  f("¿Qué oración tiene bien las comas?", "Si llueve, suspenderemos el paseo.", "Si llueve suspenderemos, el paseo.", "Si, llueve suspenderemos el paseo."),
  f("¿Qué oración tiene bien las comas?", "Estudió mucho, pero no aprobó.", "Estudió mucho pero, no aprobó.", "Estudió, mucho pero no aprobó."),
];
const SEMICOLON: ChoiceItem[] = [
  f("¿Qué oración usa bien el punto y coma?", "Los de cuarto fueron al museo; los de quinto, a la biblioteca.", "Los de cuarto; fueron al museo los de quinto, a la biblioteca.", "Los de cuarto fueron; al museo los de quinto a la biblioteca."),
  f("¿Qué oración usa bien los dos puntos?", "Llevamos lo necesario: agua, linterna y abrigo.", "Llevamos: lo necesario agua, linterna y abrigo.", "Llevamos lo: necesario agua, linterna y abrigo."),
  f("¿Qué oración usa bien la puntuación en la enumeración?", "Viajaron a Iquitos, Loreto; Pucallpa, Ucayali, y Tarapoto, San Martín.", "Viajaron a Iquitos; Loreto, Pucallpa; Ucayali y Tarapoto; San Martín.", "Viajaron a Iquitos Loreto, Pucallpa Ucayali, y Tarapoto San Martín."),
  f("¿Qué oración usa bien los dos puntos?", "Querido abuelo: te escribo desde Lima.", "Querido abuelo; te escribo desde Lima.", "Querido: abuelo te escribo desde Lima."),
];
const DASHES: ChoiceItem[] = [
  f("¿Qué oración usa bien la raya?", "La novela —publicada en 1941— ganó un premio.", "La novela -publicada en 1941- ganó un premio.", "La novela —publicada en 1941 ganó un premio."),
  f("¿Qué oración usa bien el guion?", "Es un curso teórico-práctico.", "Es un curso teórico—práctico.", "Es un curso teórico práctico-."),
  f("¿Qué oración usa bien los puntos suspensivos?", "Compramos papas, ollucos, ocas…", "Compramos papas, ollucos, ocas, etc…", "Compramos… papas ollucos ocas."),
  f("¿Qué oración usa bien la raya en un diálogo?", "—Ya llegué —dijo Rosa.", "-Ya llegué -dijo Rosa.", "—Ya llegué, dijo Rosa—."),
];
const POSSESSION: ChoiceItem[] = [
  f("¿Qué expresión es correcta en castellano?", "la casa de Juan", "la casa de Juan's", "Juan's casa"),
  f("¿Qué expresión es correcta en castellano?", "los años noventa", "los 90's", "los noventa's"),
  f("¿Qué expresión es correcta en castellano?", "los DVD", "los DVD's", "los DVDs'"),
  pt("¿Qué indica la expresión?", "«la chacra de Rosa y Pedro»", "Que la chacra es de los dos (pertenencia conjunta)", "Que cada uno tiene su chacra", "Que cada uno de ellos tiene una chacra distinta en otro lugar"),
  pt("¿Qué indica la expresión?", "«las chacras de Rosa y las de Pedro»", "Que cada uno tiene sus propias chacras (pertenencia separada)", "Que Rosa y Pedro comparten las mismas chacras entre los dos", "Que las chacras son del Estado"),
];
const CAPITALS: ChoiceItem[] = [
  f("¿Qué oración tiene bien las mayúsculas?", "El lunes 28 de julio celebramos la Independencia.", "El Lunes 28 de Julio celebramos la independencia.", "El lunes 28 de Julio celebramos la Independencia."),
  f("¿Qué oración tiene bien las mayúsculas?", "Los arequipeños hablan castellano y quechua.", "Los Arequipeños hablan Castellano y Quechua.", "Los arequipeños hablan Castellano y quechua."),
  f("¿Qué título tiene bien las mayúsculas?", "El mundo es ancho y ajeno", "El Mundo Es Ancho Y Ajeno", "El mundo es Ancho y Ajeno"),
  f("¿Qué oración tiene bien las mayúsculas?", "El presidente de la República visitó la región Puno.", "El Presidente de la república visitó la Región Puno.", "el presidente de la República visitó la región puno."),
];
const QUOTES: ChoiceItem[] = [
  f("¿Qué cita está bien puntuada?", "Vallejo escribió: «Hay golpes en la vida, tan fuertes… ¡Yo no sé!».", "Vallejo escribió «Hay golpes en la vida, tan fuertes… ¡Yo no sé!»", "Vallejo escribió: Hay golpes en la vida, tan fuertes… ¡Yo no sé!"),
  f("¿Qué diálogo está bien puntuado?", "—¿Vienes? —preguntó Inés—. Ya es tarde.", "-¿Vienes? -preguntó Inés-. Ya es tarde.", "—¿Vienes?, preguntó Inés. Ya es tarde."),
  f("¿Qué oración usa bien las comillas?", "La palabra «chacra» viene del quechua.", "La palabra chacra viene, del quechua.", "La palabra «chacra viene» del quechua."),
];

export const ROWS: Row[] = [
  ["ortografia-1", (r) => choose(r, "", AFFIX)],
  ["ortografia-2", (r) => choose(r, "", BASES)],
  ["frecuentes-1", (r) => choose(r, "", COMMON_1)],
  ["frecuentes-2", (r) => choose(r, "", COMMON_2)],
  ["frecuentes-3", (r) => choose(r, "", COMMON_3)],
  ["oracion-1", (r) => choose(r, "", TYPE_ITEMS)],
  ["oracion-2", (r) => choose(r, "", FRAGMENT_ITEMS)],
  ["oracion-3", (r) => choose(r, "", FIX_RUNON)],
  ["frases-1", (r) => choose(r, "", PHRASE_ITEMS)],
  ["frases-2", (r) => pickInSentence(r, "Selecciona las palabras de las frases con preposición.", PREP_PHRASE)],
  ["frases-3", (r) => choose(r, "", APPOSITION)],
  ["proposiciones-1", (r) => choose(r, "", CLAUSES)],
  ["proposiciones-2", (r) => choose(r, "", KIND_ITEMS)],
  ["proposiciones-3", (r) => choose(r, "", RELATIVE)],
  ["compuestos", (r) => choose(r, "", COMPOUND)],
  ["pronombres-1", (r) => choose(r, "", LEISMO)],
  ["pronombres-2", (r) => choose(r, "", THAN_AS)],
  ["pronombres-3", (r) => choose(r, "", QUIEN)],
  ["antecedentes-1", (r) => choose(r, "", AMBIGUOUS)],
  ["antecedentes-2", (r) => choose(r, "", SHIFTS)],
  ["verbos-1", (r) => choose(r, "", TRANSITIVE_ITEMS)],
  ["verbos-2", (r) => choose(r, "", VERBOID_ITEMS)],
  ["concordancia", (r) => choose(r, "", AGREEMENT)],
  ["tiempos", (r) => choose(r, "", TENSES)],
  ["comparativos-1", (r) => choose(r, "", ADJ_ADV)],
  ["comparativos-2", (r) => choose(r, "", CORRELATIVE)],
  ["modificadores", (r) => choose(r, "", MODIFIERS)],
  ["comas-1", (r) => choose(r, "", RESTRICTIVE)],
  ["comas-2", (r) => choose(r, "", COMMAS)],
  ["signos-1", (r) => choose(r, "", SEMICOLON)],
  ["signos-2", (r) => choose(r, "", DASHES)],
  ["formato-1", (r) => choose(r, "", POSSESSION)],
  ["formato-2", (r) => choose(r, "", CAPITALS)],
  ["formato-3", (r) => choose(r, "", QUOTES)],
];
