import { choose, pickInSentence, type ChoiceItem, type InSentenceItem } from "../../../generators/lengua/bank";
import { f, pt, s, sorter } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Secundaria · banco de gramática y ortografía: prefijos anti-, no y
// pos-, sufijos -ción y -oso, bases cultas (crono, grafía, métrico, termo,
// esfera...), tildes en monosílabos, «aún», «solo», adverbios en -mente y
// compuestos; la oración y sus errores, frases y proposiciones, pronombres,
// verboides, concordancia, tiempos, comparativos, modificadores, comas
// (también en construcciones absolutas), punto y coma, dos puntos, raya,
// pertenencia, mayúsculas y citas. Para ir más allá: prefijos i- e ir-,
// sufijos -ante, -ente y -encia, y bases auto, cracia, micro, scopio y tecno.

// --- Ortografía ----------------------------------------------------------------

const AFFIX: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "antiinflamatorio", "antinflamatorio", "anti-inflamatorio"),
  f("¿Qué palabra está bien escrita?", "posguerra", "pos-guerra", "posgerra"),
  f("¿Qué palabra está bien escrita?", "posgrado", "pos grado", "posgrádo"),
  f("¿Qué expresión está bien escrita?", "la no violencia", "la noviolencia", "la no-violencia"),
  f("¿Qué palabra está bien escrita?", "excepcional", "exepcional", "excepsional"),
  f("¿Qué palabra está bien escrita?", "ambicioso", "ambisioso", "ambiciozo"),
  f("¿Qué palabra está bien escrita?", "precioso", "presioso", "preciozo"),
  f("¿Qué palabra está bien escrita?", "contagioso", "contajioso", "contagiozo"),
];
const BASES: ChoiceItem[] = [
  f("¿Qué significa «termo» en «termómetro»?", "calor", "frío", "agua"),
  f("¿Qué significa «métrico» en «simétrico»?", "medida", "mitad", "metal"),
  f("¿Qué significa «esfera» en «atmósfera»?", "globo, esfera", "aire que respiramos", "nube"),
  f("¿Qué significa «grama» en «telegrama»?", "letra, escrito", "peso", "voz que se envía a distancia"),
  f("¿Qué palabra está bien escrita?", "cronómetro", "cronometro", "kronómetro"),
  f("¿Qué palabra está bien escrita?", "hemisferio", "emisferio", "hemisférío"),
  f("¿Qué palabra está bien escrita?", "termoeléctrica", "termo eléctrica", "termoelectrica"),
  f("¿Qué palabra está bien escrita?", "fotógrafo", "fotografo", "fotógrafó"),
];
const COMMON_1: ChoiceItem[] = [
  f("¿Qué oración tiene bien la tilde?", "Aún no llega el bus.", "Aun no llega el bús.", "Aún no llega el bús."),
  f("¿Qué oración tiene bien la tilde?", "Aun los más tímidos participaron.", "Aún los más tímidos participaron.", "Aun los más tímidos participarón."),
  f("¿Qué oración tiene bien las tildes?", "Fue a Lima, y yo, a Cusco.", "Fué a Lima, y yo, a Cusco.", "Fue a Lima, y yó, a Cusco."),
  f("¿Qué oración tiene bien las tildes?", "Dio un paso y vio el mar.", "Dió un paso y vió el mar.", "Dio un paso y vió el mar."),
  f("¿Qué oración tiene bien las tildes?", "Solo quiero un té.", "Sólo quiero un te.", "Solo quiero un te."),
];
const COMMON_2: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "rápidamente", "rapidamente", "rápidaménte"),
  f("¿Qué palabra está bien escrita?", "cortésmente", "cortesmente", "cortesménte"),
  f("¿Qué palabra está bien escrita?", "decimoséptimo", "décimo séptimo", "decimoseptimo"),
  f("¿Qué palabra está bien escrita?", "asimismo", "asi mismo", "asímismo"),
  f("¿Qué palabra está bien escrita?", "veintidós", "veintidos", "veinte y dos"),
  f("¿Qué palabra está bien escrita?", "tiovivo", "tío vivo", "tiovívo"),
];
const CORRECT_X = sorter(["Bien escrita", "Mal escrita"], "¿La palabra está bien escrita?");
const COMMON_3: ChoiceItem[] = [
  CORRECT_X("hipócrita", 0),
  CORRECT_X("ipócrita", 1),
  CORRECT_X("exhibición", 0),
  CORRECT_X("exibición", 1),
  CORRECT_X("vulnerable", 0),
  CORRECT_X("bulnerable", 1),
  CORRECT_X("precisión", 0),
  CORRECT_X("presición", 1),
];

// --- La oración ------------------------------------------------------------------

const FRAGMENT = sorter(["Oración completa", "Fragmento", "Oraciones pegadas"], "¿Es una oración completa, un fragmento u oraciones pegadas?");
const FRAGMENT_ITEMS: ChoiceItem[] = [
  FRAGMENT("Siempre que hay elecciones en el país.", 1),
  FRAGMENT("Hubo elecciones, ganó la oposición.", 2),
  FRAGMENT("En las elecciones ganó la oposición.", 0),
  FRAGMENT("El libro que me prestaste la semana pasada.", 1),
  FRAGMENT("Me prestaste un libro, ya lo terminé.", 2),
  FRAGMENT("Ya terminé el libro que me prestaste.", 0),
];
const FIX_RUNON: ChoiceItem[] = [
  pt("¿Qué puntuación corrige el texto?", "«No vino a la reunión estaba enfermo»", "No vino a la reunión: estaba enfermo.", "No vino a la reunión, estaba enfermo.", "No vino, a la reunión estaba enfermo."),
  pt("¿Qué puntuación corrige el texto?", "«Algunos querían quedarse otros preferían irse»", "Algunos querían quedarse; otros preferían irse.", "Algunos querían quedarse, otros preferían irse.", "Algunos, querían quedarse otros preferían irse."),
  pt("¿Qué puntuación corrige el texto?", "«Llegamos tarde. Aunque salimos temprano.»", "Llegamos tarde aunque salimos temprano.", "Llegamos tarde. Aunque, salimos temprano.", "Llegamos. Tarde aunque salimos temprano."),
];

// --- Frases y proposiciones ---------------------------------------------------------

const PHRASE = sorter(["Frase", "Proposición"], "¿Es una frase (sin verbo conjugado) o una proposición (con verbo conjugado)?");
const PHRASE_ITEMS: ChoiceItem[] = [
  PHRASE("bajo la lluvia de Iquitos", 0),
  PHRASE("aunque nadie lo creía", 1),
  PHRASE("antes del amanecer", 0),
  PHRASE("donde nació Grau", 1),
  PHRASE("terminado el examen", 0),
  PHRASE("si el tren llega a tiempo", 1),
];
const PREP_PHRASE: InSentenceItem[] = [
  s("La casa de mis abuelos está junto al río.", "de", "mis", "abuelos", "junto", "al", "río"),
  s("Trabajó durante años en la mina de Cerro de Pasco.", "durante", "años", "en", "la", "mina", "de", "Cerro", "Pasco"),
  s("Hablamos con la alcaldesa sobre el agua.", "con", "la", "alcaldesa", "sobre", "el", "agua"),
];
const APPOSITION: ChoiceItem[] = [
  pt("¿Cuál es la aposición?", "«Chabuca Granda, la autora de «La flor de la canela», nació en Apurímac.»", "la autora de «La flor de la canela»", "Chabuca Granda nació en Apurímac", "nació en Apurímac"),
  pt("¿Cuál es la aposición?", "«El Huascarán, la montaña más alta del Perú, está en Áncash.»", "la montaña más alta del Perú", "El Huascarán está en Áncash", "está en Áncash"),
  pt("¿Cuál es la aposición?", "«Mi profesor, un historiador apasionado, nos llevó a Pachacámac.»", "un historiador apasionado", "Mi profesor", "nos llevó a Pachacámac"),
];
const CLAUSES: ChoiceItem[] = [
  pt("¿Cuál es la proposición subordinada?", "«Aunque el camino era largo, llegaron antes del anochecer.»", "Aunque el camino era largo", "llegaron antes del anochecer", "antes del anochecer"),
  pt("¿Cuál es la proposición subordinada?", "«Nadie sabía dónde había escondido el mapa.»", "dónde había escondido el mapa", "Nadie sabía", "Nadie sabía dónde"),
  pt("¿Cuál es la proposición subordinada?", "«El poeta cuyo libro ganó el premio es de Tacna.»", "cuyo libro ganó el premio", "El poeta es de Tacna", "es de Tacna"),
];
const SENTENCE_KIND = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada", "Coordinada y subordinada"], "¿Cómo es la oración?");
const KIND_ITEMS: ChoiceItem[] = [
  SENTENCE_KIND("El ministro inauguró el hospital de Moquegua.", 0),
  SENTENCE_KIND("Llovió en la sierra, pero la costa siguió seca.", 1),
  SENTENCE_KIND("Cuando llegó el invierno, las lomas florecieron.", 2),
  SENTENCE_KIND("Cuando llegó el invierno, las lomas florecieron y los turistas volvieron.", 3),
  SENTENCE_KIND("O estudias o trabajas.", 1),
  SENTENCE_KIND("Dijo que vendría.", 2),
];
const RELATIVE: ChoiceItem[] = [
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Visitamos el museo. El museo guarda el Señor de Sipán.»", "Visitamos el museo que guarda el Señor de Sipán.", "Visitamos el museo, el museo guarda el Señor de Sipán.", "Visitamos el museo cuyo guarda el Señor de Sipán."),
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Admiro a la científica. Sus estudios salvaron cultivos.»", "Admiro a la científica cuyos estudios salvaron cultivos.", "Admiro a la científica que sus estudios salvaron cultivos.", "Admiro a la científica, sus estudios salvaron cultivos."),
  pt("¿Cómo se unen las dos oraciones con una proposición de relativo?", "«Recuerdo el año. Ese año ganamos el campeonato.»", "Recuerdo el año en que ganamos el campeonato.", "Recuerdo el año que ganamos el campeonato en él.", "Recuerdo el año, ganamos el campeonato."),
];

// --- Pronombres ------------------------------------------------------------------

const LEISMO: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "A los turistas los guiamos por Kuélap.", "A los turistas les guiamos por Kuélap.", "A los turistas le guiamos por Kuélap."),
  f("¿Qué oración es correcta?", "A la abuela le contamos la noticia.", "A la abuela la contamos la noticia.", "A la abuela lo contamos la noticia."),
  f("¿Qué oración es correcta?", "La carta la escribí anoche.", "La carta le escribí anoche.", "La carta lo escribí anoche."),
  f("¿Qué oración es correcta?", "A mis compañeras las invité a la fiesta.", "A mis compañeras les invité a la fiesta.", "A mis compañeras le invité a la fiesta."),
];
const THAN_AS: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Tú estudias más que yo.", "Tú estudias más que mí.", "Tú estudias más que a mí."),
  f("¿Qué oración es correcta?", "Nadie canta como ella.", "Nadie canta como la.", "Nadie canta como le."),
  f("¿Qué oración es correcta?", "Mi hermana es tan alta como yo.", "Mi hermana es tan alta como mí.", "Mi hermana es tan alta como conmigo."),
];
const QUIEN: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Las vecinas con quienes hablé apoyan el proyecto.", "Las vecinas con quien hablé apoyan el proyecto.", "Las vecinas con quienes hablé apoya el proyecto."),
  f("¿Qué oración es correcta?", "Es el escritor a quien entrevisté.", "Es el escritor quien entrevisté.", "Es el escritor a quienes entrevisté."),
  f("Completa: «Los artesanos ___ obras se exhiben en el museo vienen de Ayacucho.»", "cuyas", "que sus", "cuyos"),
  f("Completa: «El motivo por el ___ renunció no está claro.»", "cual", "cuyo", "quien"),
  f("Completa: «La ciudad ___ nací está en la selva.»", "donde", "cuya", "quien"),
];
const AMBIGUOUS: ChoiceItem[] = [
  pt("¿Por qué es ambigua la oración?", "«La madre de Lucía le prestó su vestido.»", "No se sabe si el vestido es de la madre o de Lucía.", "Porque no tiene sujeto.", "Porque «le» debería ser «la» y «prestó» debería ir en plural."),
  pt("¿Por qué es ambigua la oración?", "«El alcalde se reunió con el gobernador y le pidió apoyo.»", "No queda claro quién pidió apoyo a quién.", "Porque hay dos personas en la oración.", "Porque falta una coma después de «alcalde»."),
  pt("¿Qué versión elimina la ambigüedad?", "«Carlos habló con su padre de su viaje.»", "Carlos habló con su padre del viaje que este hizo.", "Carlos habló, con su padre, de su viaje.", "Carlos habló con su padre de su viaje de él."),
];
const SHIFTS: ChoiceItem[] = [
  pt("¿Qué versión corrige el cambio indebido de persona?", "«Si uno practica, mejoras.»", "Si uno practica, mejora.", "Si uno practica, mejoramos.", "Si uno practica, mejoran."),
  pt("¿Qué versión corrige el cambio indebido de persona?", "«Cuando llegamos al Colca, uno ve los cóndores.»", "Cuando llegamos al Colca, vemos los cóndores.", "Cuando llegamos al Colca, uno vemos los cóndores.", "Cuando llegamos al Colca, ves los cóndores."),
  pt("¿Qué versión corrige el cambio indebido de número?", "«La comunidad decidió reunirse, y ellos acordaron una faena.»", "La comunidad decidió reunirse y acordó una faena.", "La comunidad decidieron reunirse y acordaron una faena.", "La comunidad decidió reunirse, y ellas acordaron."),
];

// --- Verbos y verboides -------------------------------------------------------------

const TRANSITIVE = sorter(["Transitivo", "Intransitivo", "Copulativo"], "¿Cómo se usa el verbo en la oración?");
const TRANSITIVE_ITEMS: ChoiceItem[] = [
  TRANSITIVE("La empresa exporta espárragos.", 0),
  TRANSITIVE("El cóndor vuela sobre el cañón.", 1),
  TRANSITIVE("La noticia parece falsa.", 2),
  TRANSITIVE("Los estudiantes escribieron un manifiesto.", 0),
  TRANSITIVE("El bebé llora de noche.", 1),
  TRANSITIVE("Mi abuelo es agricultor.", 2),
];
const VERBOIDS = sorter(["Infinitivo", "Gerundio", "Participio"], "¿Qué verboide es la palabra indicada?");
const VERBOID_ITEMS: ChoiceItem[] = [
  VERBOIDS("«Viajar» en: «Viajar es aprender».", 0),
  VERBOIDS("«llorando» en: «Se despidió llorando».", 1),
  VERBOIDS("«firmado» en: «El acuerdo firmado entró en vigencia».", 2),
  VERBOIDS("«Leyendo» en: «Leyendo se aprende a escribir».", 1),
  VERBOIDS("«votar» en: «Es su derecho votar».", 0),
  VERBOIDS("«rendidos» en: «Rendidos, los soldados descansaron».", 2),
];
const AGREEMENT: ChoiceItem[] = [
  f("¿Qué oración tiene la concordancia correcta?", "Los hijos de mi vecina estudian en Arequipa.", "Los hijos de mi vecina estudia en Arequipa.", "El hijo de mi vecina estudian en Arequipa."),
  f("¿Qué oración tiene la concordancia correcta?", "Alguno de ustedes sabe la respuesta.", "Alguno de ustedes saben la respuesta y la dirá.", "Alguno de ustedes sabemos la respuesta."),
  f("¿Qué oración tiene la concordancia correcta?", "El presidente y la ministra viajaron a Piura.", "El presidente y la ministra viajó a Piura.", "El presidente y la ministra viajamos a Piura."),
  f("¿Qué oración tiene la concordancia correcta?", "Se necesitan voluntarios.", "Se necesita voluntarios.", "Se necesitan voluntario."),
  f("¿Qué oración tiene la concordancia correcta?", "Nadie quiso hablar.", "Nadie quisieron hablar.", "Nadie quisimos hablar."),
  f("¿Qué oración tiene la concordancia correcta?", "Hubo protestas en la plaza.", "Hubieron protestas en la plaza.", "Habían protestas en la plaza."),
];
const TENSES: ChoiceItem[] = [
  f("Completa con el tiempo progresivo: «Mientras tú dormías, yo ___ para el examen.»", "estaba estudiando", "estudié", "habré estudiado"),
  f("Completa con el tiempo compuesto: «Cuando llegues, ya ___ la cena.»", "habremos preparado", "preparábamos", "estamos preparando"),
  f("Completa con el tiempo compuesto: «Nunca ___ un paisaje tan bello.»", "había visto", "veré", "estaré viendo"),
  pt("¿Qué versión corrige el cambio indebido de tiempo?", "«El año pasado viajé a Tumbes y visito los manglares.»", "El año pasado viajé a Tumbes y visité los manglares.", "El año pasado viajo a Tumbes y visité los manglares.", "El año pasado viajaré a Tumbes y visité los manglares."),
  pt("¿Qué versión corrige el cambio indebido de tiempo?", "«Cuando era niño, mi abuela me cuenta historias.»", "Cuando era niño, mi abuela me contaba historias.", "Cuando soy niño, mi abuela me contaba historias.", "Cuando era niño, mi abuela me contará historias."),
];

// --- Comparativos y modificadores ---------------------------------------------------

const ADJ_ADV: ChoiceItem[] = [
  f("Completa: «Explicó el tema muy ___.»", "bien", "bueno", "buen"),
  f("Completa: «Fue un ___ discurso.»", "buen", "bien", "bueno de"),
  f("Completa: «Hoy me siento ___ que ayer.»", "mejor", "más bien mejor", "más bueno"),
  f("Completa: «El resultado fue ___ de lo esperado.»", "peor", "más malo peor", "más peor"),
  f("Completa: «Es la ___ temporada de lluvias en años.»", "peor", "más mala peor", "más peor"),
  f("Completa: «Corrió ___ que todos.»", "más rápido", "más rápidamente rápido", "rápido más"),
];
const CORRELATIVE: ChoiceItem[] = [
  f("Completa: «No solo ganó el premio, ___ también batió el récord.»", "sino que", "si no que", "pero que"),
  f("Completa: «___ los alumnos ___ los profesores asistieron.»", "Tanto … como", "Ni … como", "O … como"),
  f("Completa: «Ni el dinero ___ la fama lo cambiaron.»", "ni", "o", "y"),
  f("Completa: «Ya sea por tren ___ por bus, llegaremos a Cusco.»", "o", "ni", "y"),
];
const MODIFIERS: ChoiceItem[] = [
  pt("¿Qué versión corrige el modificador mal colocado?", "«Vendo cocina para señora de cuatro hornillas.»", "Vendo cocina de cuatro hornillas para señora.", "Vendo para señora de cuatro hornillas cocina.", "Vendo cocina para señora, de cuatro hornillas, a buen precio."),
  pt("¿Qué versión corrige el gerundio mal usado?", "«Se aprobó una ley regulando el transporte.»", "Se aprobó una ley que regula el transporte.", "Se aprobó regulando una ley el transporte.", "Regulando el transporte, se aprobó una ley."),
  pt("¿Qué versión corrige el modificador colgante?", "«Al entrar al salón, la pizarra estaba sucia.»", "Al entrar al salón, vi que la pizarra estaba sucia.", "Al entrar la pizarra al salón, estaba sucia.", "La pizarra, al entrar al salón, estaba sucia."),
  pt("¿Los modificadores están bien usados?", "«Agotados, los corredores llegaron a la meta.»", "Sí, «agotados» modifica claramente a «los corredores».", "No, porque «agotados» debería ir después de «meta» para que la oración se entienda.", "No, porque falta un verbo en la oración."),
];

// --- Puntuación ------------------------------------------------------------------

const RESTRICTIVE: ChoiceItem[] = [
  pt("¿Qué sugiere la puntuación?", "«Los vecinos, que pagaron, recibieron el agua.»", "Que todos los vecinos pagaron y recibieron el agua.", "Que solo recibieron agua los que pagaron.", "Que solo los vecinos que pagaron recibieron el agua y los demás no."),
  pt("¿Qué sugiere la puntuación?", "«Los vecinos que pagaron recibieron el agua.»", "Que solo los que pagaron recibieron el agua.", "Que todos los vecinos pagaron.", "Que todos los vecinos pagaron y todos recibieron el agua."),
  f("¿Qué oración tiene bien las comas?", "Mi tío, que vive en Juliaca, es músico.", "Mi tío que vive en Juliaca, es músico.", "Mi tío, que vive en Juliaca es músico."),
  f("¿Qué oración tiene bien las comas?", "El Amazonas, que nace en el Perú, es el río más caudaloso.", "El Amazonas que nace en el Perú, es el río más caudaloso.", "El Amazonas, que nace en el Perú es el río más caudaloso."),
];
const COMMAS: ChoiceItem[] = [
  f("¿Qué oración tiene bien las comas?", "Terminada la clase, salimos al patio.", "Terminada la clase salimos, al patio.", "Terminada, la clase salimos al patio."),
  f("¿Qué oración tiene bien las comas?", "Profesora, ¿puedo salir?", "Profesora ¿puedo, salir?", "¿Profesora puedo salir?,"),
  f("¿Qué oración tiene bien las comas?", "Quería ir al cine, no al teatro.", "Quería ir, al cine no al teatro.", "Quería, ir al cine no al teatro."),
  f("¿Qué oración tiene bien las comas?", "Por cierto, ¿trajiste el libro?", "Por cierto ¿trajiste, el libro?", "Por, cierto ¿trajiste el libro?"),
  f("¿Qué oración tiene bien las comas?", "Era una tarde gris, fría y silenciosa.", "Era una tarde, gris, fría, y silenciosa.", "Era, una tarde gris fría y silenciosa."),
  f("¿Qué oración tiene bien las comas?", "Aunque llovía, salimos a correr.", "Aunque llovía salimos, a correr.", "Aunque, llovía salimos a correr."),
  f("¿Qué oración tiene bien las comas?", "Estudió Medicina, trabajó en Ayacucho y fundó una posta.", "Estudió, Medicina trabajó en Ayacucho y fundó una posta.", "Estudió Medicina trabajó, en Ayacucho y fundó una posta."),
  f("¿Qué oración tiene bien las comas?", "Llegaron, en cambio, los más jóvenes.", "Llegaron en cambio, los más jóvenes.", "Llegaron, en cambio los más jóvenes."),
];
const SEMICOLON: ChoiceItem[] = [
  f("¿Qué oración une bien las proposiciones?", "Estudió toda la noche; sin embargo, no aprobó.", "Estudió toda la noche, sin embargo no aprobó.", "Estudió toda la noche sin embargo; no aprobó."),
  f("¿Qué oración usa bien los dos puntos para introducir una cita?", "El letrero decía: «Prohibido pasar».", "El letrero decía; «Prohibido pasar».", "El letrero: decía «Prohibido pasar»."),
  f("¿Qué oración usa bien los dos puntos para introducir una lista?", "Necesitamos tres cosas: paciencia, tiempo y dinero.", "Necesitamos: tres cosas paciencia, tiempo y dinero.", "Necesitamos tres cosas; paciencia, tiempo y dinero."),
  f("¿Qué oración usa bien el punto y coma en una serie?", "Asistieron Ana, la presidenta; Luis, el tesorero, y Rosa, la secretaria.", "Asistieron Ana; la presidenta, Luis; el tesorero y Rosa; la secretaria.", "Asistieron Ana, la presidenta, Luis, el tesorero, y Rosa, la secretaria."),
  f("¿Qué oración usa bien los dos puntos?", "Lo dijo claramente: no habría prórroga.", "Lo dijo: claramente no habría prórroga.", "Lo dijo claramente; no: habría prórroga."),
];
const DASHES: ChoiceItem[] = [
  f("¿Qué oración usa bien la raya?", "Su abuela —que tenía noventa años— aún tejía.", "Su abuela -que tenía noventa años- aún tejía.", "Su abuela —que tenía noventa años aún tejía."),
  f("¿Qué oración usa bien el guion?", "Firmaron un acuerdo peruano-chileno.", "Firmaron un acuerdo peruano—chileno.", "Firmaron un acuerdo peruano chileno-."),
  f("¿Qué oración usa bien los puntos suspensivos?", "Quería decirle que… mejor no.", "Quería decirle que…, mejor, no….", "Quería… decirle… que mejor no…"),
  f("¿Qué oración usa bien los puntos suspensivos en una cita incompleta?", "Vallejo escribió: «Hay golpes en la vida […]».", "Vallejo escribió: «Hay golpes en la vida…….».", "Vallejo escribió «Hay golpes en la vida» […]."),
];
const POSSESSION: ChoiceItem[] = [
  f("¿Qué expresión es correcta en castellano?", "los años ochenta", "los 80's", "los ochentas'"),
  f("¿Qué expresión es correcta en castellano?", "el restaurante de Gastón", "el restaurante Gastón's", "Gastón's restaurante"),
  f("¿Qué expresión es correcta en castellano?", "las ONG", "las ONG's", "las ONGs'"),
  pt("¿Qué indica la expresión?", "«el taller de Ana y Luis»", "Que el taller es de ambos (pertenencia conjunta)", "Que cada uno tiene su taller", "Que cada uno de ellos tiene un taller propio en distintos lugares"),
];
const CAPITALS: ChoiceItem[] = [
  f("¿Qué oración tiene bien las mayúsculas?", "En la Segunda Guerra Mundial el Perú declaró la guerra al Eje.", "En la segunda guerra mundial el Perú declaró la guerra al eje.", "En la Segunda guerra Mundial el perú declaró la guerra al Eje."),
  f("¿Qué oración tiene bien las mayúsculas?", "El ministro de Educación visitó la Universidad Nacional de Trujillo.", "El Ministro de educación visitó la universidad nacional de Trujillo.", "El ministro de educación visitó la Universidad nacional de Trujillo."),
  f("¿Qué oración tiene bien las mayúsculas?", "En octubre celebramos al Señor de los Milagros.", "En Octubre celebramos al señor de los milagros.", "En octubre celebramos al señor de los Milagros."),
  f("¿Qué título tiene bien las mayúsculas?", "Los ríos profundos", "Los Ríos Profundos", "Los ríos Profundos"),
];
const QUOTES: ChoiceItem[] = [
  f("¿Qué cita está bien puntuada?", "Como dijo Basadre, el Perú es «una promesa».", "Como dijo Basadre, el Perú es una «promesa.»", "Como dijo Basadre el Perú es: «una promesa»."),
  f("¿Qué diálogo está bien puntuado?", "—No sé —respondió—. Tal vez mañana.", "-No sé -respondió-. Tal vez mañana.", "—No sé, respondió. Tal vez mañana—."),
  f("¿Qué oración usa bien las comillas dentro de otras comillas?", "Dijo: «El profesor nos pidió leer “Paco Yunque”».", "Dijo: «El profesor nos pidió leer «Paco Yunque»».", "Dijo: “El profesor nos pidió leer “Paco Yunque””."),
];

// --- Para ir más allá: ortografía culta -------------------------------------------

const X_AFFIX: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "ilegal", "inlegal", "illegal"),
  f("¿Qué palabra está bien escrita?", "irregular", "iregular", "inregular"),
  f("¿Qué palabra está bien escrita?", "irresponsable", "iresponsable", "inresponsable"),
  f("¿Qué palabra está bien escrita?", "ilógico", "inlógico", "illógico"),
  f("¿Qué palabra está bien escrita?", "importante", "importánte", "inportante"),
  f("¿Qué palabra está bien escrita?", "convivencia", "convivensia", "combivencia"),
  f("¿Qué palabra está bien escrita?", "excelente", "exelente", "ecselente"),
  f("¿Qué palabra está bien escrita?", "competencia", "competensia", "compentencia"),
];
const X_BASES: ChoiceItem[] = [
  f("¿Qué significa «auto» en «autobiografía»?", "uno mismo", "automóvil", "otro"),
  f("¿Qué significa «cracia» en «burocracia»?", "gobierno, poder", "estudio", "estudio o ciencia"),
  f("¿Qué significa «micro» en «microorganismo»?", "pequeño", "grande", "muchos"),
  f("¿Qué significa «scopio» en «periscopio»?", "ver, observar", "medir la distancia", "medir"),
  f("¿Qué significa «tecno» en «tecnología»?", "arte, técnica", "tiempo o época", "tiempo"),
  f("¿Qué palabra está bien escrita?", "autógrafo", "autografo", "autógrafó"),
  f("¿Qué palabra está bien escrita?", "tecnócrata", "tecnocrata", "técnocrata"),
  f("¿Qué palabra está bien escrita?", "microscopio", "microscópio", "mycroscopio"),
];

export const ROWS: Row[] = [
  ["ortografia-1", (r) => choose(r, "", AFFIX)],
  ["ortografia-2", (r) => choose(r, "", BASES)],
  ["frecuentes-1", (r) => choose(r, "", COMMON_1)],
  ["frecuentes-2", (r) => choose(r, "", COMMON_2)],
  ["frecuentes-3", (r) => choose(r, "", COMMON_3)],
  ["oracion-1", (r) => choose(r, "", FRAGMENT_ITEMS)],
  ["oracion-2", (r) => choose(r, "", FIX_RUNON)],
  ["frases-1", (r) => choose(r, "", PHRASE_ITEMS)],
  ["frases-2", (r) => pickInSentence(r, "Selecciona las palabras de las frases con preposición.", PREP_PHRASE)],
  ["frases-3", (r) => choose(r, "", APPOSITION)],
  ["proposiciones-1", (r) => choose(r, "", CLAUSES)],
  ["proposiciones-2", (r) => choose(r, "", KIND_ITEMS)],
  ["proposiciones-3", (r) => choose(r, "", RELATIVE)],
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
  ["ortografia-culta-1", (r) => choose(r, "", X_AFFIX)],
  ["ortografia-culta-2", (r) => choose(r, "", X_BASES)],
];
