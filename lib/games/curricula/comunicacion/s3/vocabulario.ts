import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pool, pt, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Vocabulario (IXL 9th grade ELA, Z-GG). Los afijos del inglés pasan a los del
// castellano, como en 1.° y 2.°. «Foreign words and expressions» pasa a
// latinismos, galicismos, anglicismos y préstamos del quechua; «new or contested
// usages», a lo que dicen la RAE y la Fundéu sobre usos nuevos o discutidos.

export const SECTIONS: Section[] = [
  { id: "Z", name: "Prefijos y sufijos", icon: "🧩" },
  { id: "AA", name: "Raíces griegas y latinas", icon: "🏛️" },
  { id: "BB", name: "Homófonos", icon: "👂" },
  { id: "CC", name: "Palabras y expresiones de otras lenguas", icon: "🌍" },
  { id: "DD", name: "Elección y uso de las palabras", icon: "🌈" },
  { id: "EE", name: "Analogías", icon: "🔁" },
  { id: "FF", name: "Claves de contexto", icon: "🔎" },
  { id: "GG", name: "Uso del diccionario", icon: "📖" },
];

const means = (word: string, a: string, ...d: string[]) => w(`¿Qué significa «${word}»?`, a, ...d);

// --- Z. Prefijos y sufijos ---------------------------------------------------

const PATTERN_ANALOGY: ChoiceItem[] = [
  f("Leal es a desleal como honesto es a ___.", "deshonesto", "honestidad", "honestamente"), f("Posible es a imposible como legal es a ___.", "ilegal", "legalizar", "legalidad"),
  f("Hacer es a rehacer como construir es a ___.", "reconstruir", "construcción", "constructor"), f("Peligro es a peligroso como orgullo es a ___.", "orgulloso", "orgullosamente", "desorgullo"),
  f("Leer es a legible como creer es a ___.", "creíble", "creencia", "creyente"), f("Marino es a submarino como suelo es a ___.", "subsuelo", "suelto", "sueldo"),
  f("Tratar es a maltratar como gastar es a ___.", "malgastar", "gastado", "gastador"), f("Ver es a prever como decir es a ___.", "predecir", "dicción", "dicho"),
];
const PATTERN_SENTENCE: ChoiceItem[] = [
  f("Si «inútil» es lo que no es útil, «___» es lo que no es justo.", "injusto", "justicia", "ajusticiado"), f("Si «releer» es volver a leer, «___» es volver a escribir.", "reescribir", "escritura", "describir"),
  f("Si «bondadoso» es quien tiene bondad, «___» es quien tiene valor.", "valeroso", "valorado", "valoración"), f("Si «lavable» es lo que se puede lavar, «___» es lo que se puede reciclar.", "reciclable", "reciclaje", "reciclado"),
  f("Si «prehistoria» es antes de la historia, «___» es antes de la guerra.", "preguerra", "posguerra", "guerrero"), f("Si «subterráneo» está bajo tierra, «___» está bajo el agua.", "subacuático", "acuático", "acuario"),
  f("Si «malestar» es estar mal, «___» es humor malo.", "malhumor", "humorista", "humorado"), f("Si «anormal» es lo que no es normal, «___» es lo que no tiene simetría.", "asimétrico", "simetría", "simétricamente"),
];
const PRE: ChoiceItem[] = [
  means("predeterminado", "Fijado de antemano", "Decidido en el último momento", "Terminado"), means("preámbulo", "Lo que se dice antes de entrar en materia", "El resumen final de un discurso", "Paseo"),
  f("Los arqueólogos estudian la cerámica ___.", "preincaica", "postincaica", "incaica de hoy"), f("Hay que ___ los riesgos antes de construir.", "prever", "rever", "ver después"),
];
const RE: ChoiceItem[] = [
  means("reivindicación", "Reclamo de un derecho", "Renuncia voluntaria a un derecho", "Venganza"), means("reincorporarse", "Volver a integrarse a un grupo o trabajo", "Salir para siempre de un grupo", "Incorporar"),
  f("Tras años de olvido, la danza volvió a ___.", "resurgir", "surgir de cero", "sumergirse"), f("La comunidad exigió ___ el acuerdo.", "renegociar", "negociar por primera vez", "desnegociar"),
];
const SUB: ChoiceItem[] = [
  means("subyugar", "Someter por la fuerza", "Liberar de la opresión", "Subir"), means("subrepticio", "Que se hace a escondidas", "Que se hace a la vista de todos", "Rápido"),
  f("El texto tiene un mensaje ___ que hay que descubrir.", "subyacente", "superficial y evidente", "yacente"), f("Hay que ___ los errores del informe antes de enviarlo.", "subsanar", "sanar del todo", "empeorar"),
];
const MAL: ChoiceItem[] = [
  means("malversar", "Usar indebidamente fondos ajenos", "Administrar el dinero con honradez", "Versar"), means("maledicencia", "Hábito de hablar mal de otros", "Costumbre de bendecir a todos", "Dicción"),
  f("El alcalde fue acusado de ___ fondos públicos.", "malversar", "versar", "invertir bien"), f("Hubo un ___ y la reunión fue un caos.", "malentendido", "entendimiento claro", "sobreentendido"),
];
const NEG: ChoiceItem[] = [
  means("inconmensurable", "Tan grande que no se puede medir", "Pequeño y fácil de medir", "Mensual"), means("desmitificar", "Quitar el carácter de mito", "Convertir algo en un mito", "Mitificar"),
  f("Su conducta fue ___: violó todas las normas.", "irresponsable", "responsable", "desresponsable"), f("La manifestación fue de ___ violencia.", "no", "des", "in"),
];
const OSO: ChoiceItem[] = [
  means("pernicioso", "Muy dañino", "Muy beneficioso", "Pequeño"), means("ostentoso", "Que se exhibe con vanidad", "Discreto y modesto", "Oscuro"),
  f("Fue un discurso ___, lleno de palabras difíciles.", "pomposo", "pompa", "pomposidad"), f("Es un trabajo ___: requiere paciencia y precisión.", "laborioso", "labor", "laboral"),
];
const SIN: ChoiceItem[] = [
  means("amorfo", "Sin forma definida", "Con una forma muy precisa", "Amoroso"), means("apático", "Sin interés ni entusiasmo", "Muy entusiasta y activo", "Simpático"),
  f("Discutir sin pruebas es un ___.", "sinsentido", "sentido común", "sentimiento"), f("Sufrió un ___ de problemas.", "sinfín", "final", "fin"),
];
const ABLE: ChoiceItem[] = [
  means("inefable", "Que no se puede expresar con palabras", "Que se explica con facilidad y en pocas palabras", "Falso"), means("inexpugnable", "Que no se puede conquistar", "Que se conquista fácilmente", "Pugnaz"),
  f("Las pruebas eran ___.", "irrefutables", "refutadas por el juez", "refutación"), f("El desarrollo debe ser ___.", "sostenible", "sostenido en el tiempo", "sostén"),
];

// --- AA. Raíces griegas y latinas -----------------------------------------------

const SORT_ROOTS: ChoiceItem[] = [
  w("¿Qué palabra comparte raíz con «biología» y «biografía»?", "biodiversidad", "bicicleta", "biblioteca municipal de Lima"), w("¿Qué palabra comparte raíz con «teléfono» y «televisión»?", "telescopio", "tela", "telar de cintura andino"),
  w("¿Qué palabra comparte raíz con «geografía» y «geología»?", "geometría", "gesto", "generosidad infinita"), w("¿Qué palabra comparte raíz con «fotografía» y «fotosíntesis»?", "fotosensible", "fonda", "forastero de otro pueblo"),
  w("¿Qué palabra comparte raíz con «crónica» y «cronómetro»?", "sincronizar", "cromo", "croqueta de pollo"), w("¿Qué palabra comparte raíz con «audición» y «auditorio»?", "audible", "audaz", "auditorio del colegio"),
  w("¿Qué palabra comparte raíz con «manuscrito» y «manufactura»?", "manipular", "manzana", "manteca de cerdo"), w("¿Qué palabra comparte raíz con «hidroeléctrica» y «deshidratar»?", "hidrografía", "hiedra trepadora del muro", "hidalgo"),
];
const ROOT_CLUES: ChoiceItem[] = [
  pt("Usa la raíz como pista: ¿qué significa «misántropo»?", "«miso» significa «odio» y «antropo», «ser humano».", "Persona que rechaza el trato humano", "Persona que ama a toda la humanidad", "Antropólogo"),
  pt("Usa la raíz como pista: ¿qué significa «teocracia»?", "«teo» significa «dios» y «cracia», «gobierno».", "Gobierno basado en la autoridad religiosa", "Gobierno elegido por el pueblo en elecciones libres", "Teoría"),
  pt("Usa la raíz como pista: ¿qué significa «ambidiestro»?", "«ambi» significa «ambos».", "Que usa igual las dos manos", "Que no puede usar ninguna de sus manos", "Diestro"),
  pt("Usa la raíz como pista: ¿qué significa «lucífugo»?", "«luci» significa «luz» y «fugo», «que huye».", "Que huye de la luz", "Que busca siempre la luz del sol", "Luminoso"),
  pt("Usa la raíz como pista: ¿qué significa «policromo»?", "«poli» significa «muchos» y «cromo», «color».", "De muchos colores", "De un solo color oscuro", "Político"),
  pt("Usa la raíz como pista: ¿qué significa «cosmopolita»?", "«cosmo» significa «mundo» y «polis», «ciudad».", "Que se siente ciudadano del mundo", "Que nunca ha salido de su pueblo natal", "Cósmico"),
];
const WORDS_TO_ROOT: ChoiceItem[] = [
  w("Piensa en «democracia», «aristocracia» y «burocracia». ¿Qué significa «cracia»?", "gobierno o poder", "pueblo", "nobleza"), w("Piensa en «claustrofobia», «xenofobia» y «hidrofobia». ¿Qué significa «fobia»?", "miedo o rechazo", "amor", "enfermedad"),
  w("Piensa en «homicidio», «genocidio» y «insecticida». ¿Qué significa «cidio» o «cida»?", "que mata", "que cuida", "que ve"), w("Piensa en «antropología», «antropomorfo» y «filántropo». ¿Qué significa «antropo»?", "ser humano", "animal", "mundo"),
  w("Piensa en «cardiología», «cardíaco» y «electrocardiograma». ¿Qué significa «cardio»?", "corazón", "sangre", "electricidad"), w("Piensa en «egocéntrico», «egoísmo» y «ególatra». ¿Qué significa «ego»?", "yo", "otro", "centro"),
];
const ROOT_MEANING = pool(([
  ["cracia", "gobierno"], ["fobia", "miedo o rechazo"], ["filia", "amor o afición"], ["cida", "que mata"], ["teo", "dios"], ["cosmo", "mundo"],
  ["necro", "muerto"], ["pseudo", "falso"], ["orto", "recto o correcto"], ["etno", "pueblo o raza"], ["morfo", "forma"], ["fago", "que come"],
] as [string, string][]).map(([root, a]) => [`¿Qué significa la raíz «${root}»?`, a] as [string, string]), "p");
const ROOT_WORDS: ChoiceItem[] = [
  means("seudónimo", "Nombre falso que usa un autor", "Nombre verdadero de una persona", "Sinónimo"), means("ortografía", "Escritura correcta de las palabras", "Arte de dibujar mapas antiguos", "Grafía"),
  means("etnografía", "Descripción de los pueblos y sus costumbres", "Estudio de los astros", "Dibujo"), means("necrópolis", "Cementerio extenso o ciudad de los muertos", "Ciudad moderna muy poblada", "Policía"),
  means("antropófago", "Que come carne humana", "Que estudia al ser humano", "Que ama a la humanidad"), means("amorfo", "Sin forma definida", "Con muchas formas a la vez", "Amoroso"),
  means("ateo", "Que no cree en Dios", "Que es muy religioso", "Teatral"), means("bibliofilia", "Afición a los libros", "Miedo a las bibliotecas", "Biología"),
];

// --- BB. Homófonos ----------------------------------------------------------------

const HOMOPHONE_USE: ChoiceItem[] = [
  f("Los jóvenes decidieron ___ contra la injusticia.", "rebelarse", "revelarse", "rebelár"), f("El periodista va a ___ la verdad.", "revelar", "rebelar", "rebelár"),
  f("La ___ es extensa; abarca tres regiones.", "vasta", "basta", "vázta"), f("¡___ de mentiras!", "Basta", "Vasta", "Bazta"),
  f("El herrero va a ___ el caballo.", "herrar", "errar", "herar"), f("El Estado decidió ___ las bebidas azucaradas con un impuesto.", "gravar", "grabar", "grávar"),
  f("Vamos a ___ un documental.", "grabar", "gravar", "grávar"), f("La bandera ondea en el ___.", "asta", "hasta", "azta"),
  f("Esperamos ___ las ocho.", "hasta", "asta", "azta"), f("Es un paisaje muy ___.", "bello", "vello", "beyo"),
];
const HOMOPHONE_FIX: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "El cazador fue a cazar al bosque.", "El casador fue a casar al bosque.", "El cazador fue a casar al bosque."), w("¿Qué oración está bien escrita?", "Voy a coser el botón y a cocer las papas.", "Voy a cocer el botón y a coser las papas.", "Voy a coser el botón y a coser las papas."),
  w("¿Qué oración está bien escrita?", "El ciervo huyó del cazador.", "El siervo huyó del casador.", "El siervo huyó del cazador."), w("¿Qué oración está bien escrita?", "Tuvo que cambiar el tubo del agua.", "Tubo que cambiar el tuvo del agua.", "Tuvo que cambiar el tuvo del agua."),
  w("¿Qué oración está bien escrita?", "No hay que botar basura antes de votar.", "No hay que votar basura antes de botar.", "No hay que botar basura antes de botar."), w("¿Qué oración está bien escrita?", "Echo de menos a mi abuela; ese hecho me entristece.", "Hecho de menos a mi abuela; ese echo me entristece.", "Echo de menos a mi abuela; ese echo me entristece."),
  w("¿Qué oración está bien escrita?", "Se cayó cuando todos se callaron.", "Se calló cuando todos se cayeron.", "Se cayó cuando todos se cayaron."), w("¿Qué oración está bien escrita?", "La savia nutre al árbol, dijo la sabia maestra.", "La sabia nutre al árbol, dijo la savia maestra.", "La savia nutre al árbol, dijo la savia maestra."),
];

// --- CC. Palabras de otras lenguas ------------------------------------------------

const ETYMOLOGY: ChoiceItem[] = [
  pt("Según su etimología, ¿qué significa «chacra»?", "«chacra» viene del quechua «chakra», terreno de cultivo.", "Terreno de cultivo", "Vivienda en la ciudad", "Fiesta"),
  pt("Según su etimología, ¿qué significa «almohada»?", "«almohada» viene del árabe «al-mujadda», lo que sirve para apoyar la mejilla.", "Cojín para apoyar la cabeza", "Prenda de vestir", "Alfombra"),
  pt("Según su etimología, ¿qué significa «cancha»?", "«cancha» viene del quechua «kancha», recinto o espacio cercado.", "Espacio cercado para una actividad", "Camino de montaña", "Instrumento musical"),
  pt("Según su etimología, ¿qué significa «puma»?", "«puma» viene del quechua «puma», felino de los Andes.", "Felino americano", "Ave de los Andes", "Árbol"),
  pt("Según su etimología, ¿qué significa «ojalá»?", "«ojalá» viene del árabe «law šá lláh», si Dios quiere.", "Expresa el deseo de que algo ocurra", "Expresa el miedo de que algo pase", "Saludo"),
  pt("Según su etimología, ¿qué significa «huaico»?", "«huaico» viene del quechua «wayq'u», quebrada.", "Avenida de lodo y piedras por una quebrada", "Lluvia muy fina en la costa", "Viento"),
  pt("Según su etimología, ¿qué significa «filosofía»?", "«filosofía» viene del griego «philos», amor, y «sophía», sabiduría.", "Amor a la sabiduría", "Estudio de los números", "Miedo"),
];
const FOREIGN_CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «in situ»?", "«Los arqueólogos estudiaron los restos in situ, sin trasladarlos».", "En el mismo lugar", "En un laboratorio lejano", "Rápidamente"),
  pt("¿Qué significa «statu quo»?", "«Los reformistas querían cambiar el statu quo».", "El estado de cosas actual", "Una nueva ley", "La revolución"),
  pt("¿Qué significa «grosso modo»?", "«Grosso modo, el proyecto costará un millón».", "Aproximadamente", "Exactamente, con todos los decimales", "Nunca"),
  pt("¿Qué significa «a priori»?", "«A priori, la idea parecía buena, pero falló en la práctica».", "Antes de comprobarlo", "Después de muchas pruebas", "Por suerte"),
  pt("¿Qué significa «déjà vu»?", "«Tuve un déjà vu: sentí que ya había estado allí».", "Sensación de haber vivido algo antes", "Miedo a lo desconocido", "Sueño"),
  pt("¿Qué significa «per cápita»?", "«El ingreso per cápita aumentó un 3 %».", "Por persona", "Por familia completa", "En total"),
  pt("¿Qué significa «ad honórem»?", "«Trabaja ad honórem en la biblioteca».", "Sin cobrar", "Con un sueldo muy alto", "De noche"),
  pt("¿Qué significa «sui géneris»?", "«Es un artista sui géneris: mezcla huaino y jazz».", "Peculiar, único en su género", "Muy común y repetido", "Famoso"),
];
const FOREIGN_USE: ChoiceItem[] = [
  f("Lo hizo por decisión propia, ___.", "motu proprio", "a priori, sin pruebas", "in situ"), f("El ___ de la carrera llegó a las diez.", "currículum", "statu quo de siempre", "déjà vu"),
  f("No quiero cambiar nada: prefiero mantener el ___.", "statu quo", "per cápita", "ad honórem"), f("Explicó el tema ___, sin entrar en detalles.", "grosso modo", "in situ", "motu proprio"),
  f("El juez revisó las pruebas ___, en el lugar del crimen.", "in situ", "a posteriori", "sui géneris"), f("Solo ___ supimos que había sido un error.", "a posteriori", "a priori", "ad honórem, sin cobrar"),
  f("Su obra es ___: no se parece a nada.", "sui géneris", "per cápita, por persona", "statu quo"), f("La ONG trabaja ___ para ayudar a los niños.", "ad honórem", "in situ", "a priori, antes de saberlo"),
];

// --- DD. Elección y uso de las palabras -------------------------------------------

const CONNOT = "¿Qué palabra se ajusta mejor a la oración por su significado y su connotación?";
const CONNOTATION: ChoiceItem[] = [
  pt(CONNOT, "Admiramos a la científica por su carácter ___: no se rindió ante los fracasos.", "tenaz", "terco", "lento"), pt(CONNOT, "Criticaron al alcalde por su actitud ___: nunca escuchaba a nadie.", "obstinada", "perseverante", "tímida"),
  pt(CONNOT, "La abuela era ___: ahorraba cada sol para emergencias.", "ahorrativa", "tacaña", "pobre"), pt(CONNOT, "Nadie quería prestarle nada: era muy ___.", "tacaño", "ahorrativo", "rico"),
  pt(CONNOT, "Es un joven ___ que siempre propone ideas nuevas.", "audaz", "temerario", "tranquilo"), pt(CONNOT, "Fue ___ cruzar el río crecido sin cuerda.", "temerario", "audaz", "prudente"),
  pt(CONNOT, "Su casa es ___: pequeña, pero cálida.", "acogedora", "estrecha", "vacía"), pt(CONNOT, "El cuarto era ___ e incómodo: no cabía nadie.", "estrecho", "acogedor", "grande"),
];
const PRECISE = "¿Qué palabra hace más precisa la oración?";
const PRECISE_WORDS: ChoiceItem[] = [
  pt(PRECISE, "El médico hizo un diagnóstico de la enfermedad.", "emitió", "hizo", "llevó a cabo"), pt(PRECISE, "La empresa tiene muchas cosas que mejorar.", "deficiencias", "cosas", "temas y asuntos varios"),
  pt(PRECISE, "El autor dice que la guerra fue un error.", "sostiene", "dice", "habla y comenta"), pt(PRECISE, "El huaico hizo daños en el pueblo.", "causó", "hizo", "llegó a tener"),
  pt(PRECISE, "La ley pone reglas para el uso del agua.", "establece", "pone por escrito", "da"), pt(PRECISE, "Tiene un problema grande de salud.", "grave", "grande", "gordo"),
  pt(PRECISE, "La investigación ve las causas de la migración.", "analiza", "ve", "se pone a mirar"), pt(PRECISE, "El ministro dio su renuncia.", "presentó", "hizo entrega de", "hizo"),
];
const THES = "DICCIONARIO DE SINÓNIMOS\ndecir v. Sin. afirmar, sostener, declarar, insinuar, confesar, exclamar.";
const REPLACE: ChoiceItem[] = [
  pt("¿Qué sinónimo de «dijo» conviene en «El acusado ___ su culpa ante el juez»?", THES, "confesó", "exclamó", "insinuó"), pt("¿Qué sinónimo conviene en «Mariátegui ___ que el problema del indio era económico»?", THES, "sostuvo", "exclamó", "confesó"),
  pt("¿Qué sinónimo conviene en «Sin decirlo directamente, ___ que no estaba de acuerdo»?", THES, "insinuó", "declaró", "exclamó"), pt("¿Qué sinónimo conviene en «¡Ganamos!, ___ la capitana»?", THES, "exclamó", "insinuó", "confesó"),
  pt("¿Qué sinónimo conviene en «El ministro ___ el estado de emergencia»?", THES, "declaró", "insinuó", "confesó"), pt("¿Qué sinónimo conviene en «Los científicos ___ que el glaciar desaparecerá»?", THES, "afirman", "exclaman", "insinúan"),
];
const USAGE: ChoiceItem[] = [
  w("Según la RAE, ¿cómo se escribe el adverbio «solo» (solamente)?", "Sin tilde; solo se admite tilde si hay ambigüedad", "Siempre con tilde: «sólo»", "Con mayúscula"), w("Según la RAE, ¿cómo se escribe «guion»?", "Sin tilde, porque es monosílaba según la ortografía", "Siempre con tilde: «guión»", "Con h: «guihón»"),
  w("¿Acepta la RAE la palabra «presidenta»?", "Sí, es el femenino de «presidente»", "No, siempre debe decirse «la presidente»", "Solo en Perú"), w("¿Acepta la RAE el uso de la «e» como marca de género («todes»)?", "No, la considera ajena al sistema de la lengua", "Sí, desde 2020 es la forma oficial", "Solo en textos oficiales"),
  w("¿Cuál es la forma recomendada en lugar de «en base a»?", "«con base en» o «a partir de»", "«en base de»", "«a base en»"), w("¿Cuál es la forma correcta?", "motu proprio", "de motu propio", "a motu propio"),
  w("¿Está en el diccionario de la RAE la palabra «selfi»?", "Sí, adaptada al castellano", "No, solo se admite «selfie» en inglés", "Solo como verbo"), w("¿Cuál es la forma correcta?", "grosso modo", "a grosso modo", "groso modo"),
];

// --- EE. Analogías ------------------------------------------------------------------

const ANALOGY: ChoiceItem[] = [
  f("Novelista es a novela como ensayista es a ___.", "ensayo", "poema", "partitura"), f("Juez es a tribunal como congresista es a ___.", "Congreso", "hospital", "teatro"),
  f("Huascarán es a montaña como Titicaca es a ___.", "lago", "río", "volcán"), f("Prólogo es a inicio como epílogo es a ___.", "final", "medio", "título"),
  f("Sismógrafo es a sismos como termómetro es a ___.", "temperatura", "lluvia", "altura"), f("Vallejo es a poesía como Arguedas es a ___.", "novela", "pintura", "escultura"),
  f("Cosecha es a agricultor como captura es a ___.", "pescador", "carpintero", "panadero"), f("Libertad es a esclavitud como paz es a ___.", "guerra", "calma", "pueblo"),
];
const ANALOGY_HARD: ChoiceItem[] = [
  f("Efímero es a perenne como exiguo es a ___.", "copioso", "escaso", "breve"), f("Censura es a prensa como represa es a ___.", "río", "luz", "camino"),
  f("Mecenas es a artista como benefactor es a ___.", "beneficiario", "enemigo", "juez"), f("Erosión es a agua como oxidación es a ___.", "oxígeno", "fuego", "viento"),
  f("Retórica es a persuadir como lógica es a ___.", "razonar", "emocionar", "cantar"), f("Pródigo es a derrochar como avaro es a ___.", "acumular", "regalar", "gastar"),
  f("Anacronismo es a tiempo como incongruencia es a ___.", "lógica", "espacio", "color"), f("Apología es a defensa como diatriba es a ___.", "ataque", "elogio", "pregunta"),
];

// --- FF. Claves de contexto ----------------------------------------------------------

const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «inexorable»? (Busca un sinónimo en la oración).", "El paso del tiempo es inexorable, implacable.", "Implacable", "Reversible", "Lento"),
  pt("¿Qué significa «díscolo»? (Busca un sinónimo en la oración).", "Era un alumno díscolo, rebelde e indisciplinado.", "Rebelde", "Obediente", "Estudioso"),
  pt("¿Qué significa «exiguo»? (Busca un sinónimo en la oración).", "El presupuesto era exiguo, insuficiente para la obra.", "Insuficiente", "Abundante", "Secreto"),
  pt("¿Qué significa «vetusto»? (Busca un sinónimo en la oración).", "Vivía en un edificio vetusto, muy antiguo.", "Muy antiguo", "Moderno", "Alto"),
  pt("¿Qué significa «taciturno»? (Busca un sinónimo en la oración).", "Desde la muerte de su esposa, estaba taciturno, callado y triste.", "Callado y triste", "Alegre y hablador", "Enfermo"),
  pt("¿Qué significa «probo»? (Busca un sinónimo en la oración).", "Era un juez probo, es decir, honrado.", "Honrado", "Corrupto", "Joven"),
];
const ANT_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «locuaz»? (Busca un antónimo en la oración).", "No era callado como su padre, sino locuaz.", "Hablador", "Callado", "Serio"),
  pt("¿Qué significa «efímero»? (Busca un antónimo en la oración).", "Su éxito no fue duradero, sino efímero.", "Breve", "Duradero", "Grande"),
  pt("¿Qué significa «magnánimo»? (Busca un antónimo en la oración).", "A diferencia de su rival, mezquino y rencoroso, fue magnánimo.", "Generoso", "Mezquino", "Tímido"),
  pt("¿Qué significa «aciago»? (Busca un antónimo en la oración).", "No fue un día feliz, sino aciago.", "Desgraciado", "Feliz", "Largo"),
  pt("¿Qué significa «diáfano»? (Busca un antónimo en la oración).", "Su explicación no fue confusa: fue diáfana.", "Claro", "Confusa", "Larga"),
  pt("¿Qué significa «indolente»? (Busca un antónimo en la oración).", "Su hermana era diligente; él, indolente.", "Perezoso", "Diligente", "Alegre"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «soslayar»?", "El informe soslayó el tema de la corrupción; nunca lo mencionó.", "Evitar o eludir", "Destacar", "Investigar a fondo"),
  pt("¿Qué significa «inveterado»?", "Es un lector inveterado: lee desde hace cincuenta años.", "Arraigado por el tiempo", "Novato, recién iniciado en la lectura", "Rápido"),
  pt("¿Qué significa «conspicuo»?", "Era un miembro conspicuo de la sociedad: todos lo conocían.", "Ilustre, sobresaliente", "Desconocido y olvidado por todos", "Pobre"),
  pt("¿Qué significa «ínfulas»?", "Desde que ganó el premio, se da ínfulas de genio.", "Presunción, vanidad", "Humildad y sencillez sinceras", "Tristeza"),
  pt("¿Qué significa «pusilánime»?", "Fue pusilánime: no se atrevió a defender a su amigo.", "Cobarde", "Valiente", "Leal"),
  pt("¿Qué significa «cáustico»?", "Su humor cáustico ofendió a varios invitados.", "Mordaz, hiriente", "Dulce", "Aburrido y sin gracia alguna"),
];

// --- GG. Uso del diccionario -------------------------------------------------------

const ENTRY = "ingente adj. Muy grande: un ingente esfuerzo. Sin. enorme, colosal. Ant. pequeño, ínfimo.";
const ENTRY2 = "consistir intr. 1. Estar formado por algo: El plan consiste en tres etapas. 2. Tener algo su fundamento en otra cosa: Su éxito consiste en la constancia. ◆ Se construye con la preposición «en».";
const ENTRY3 = "álgido, da adj. 1. Muy frío. 2. Dicho de un momento o periodo: crítico o culminante de un proceso: el momento álgido del debate.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «ingente»?", ENTRY, "Adjetivo", "Sustantivo", "Verbo"), pt("Según la entrada, ¿cuál es un antónimo de «ingente»?", ENTRY, "ínfimo", "colosal", "enorme"),
  pt("Según la entrada, ¿qué clase de verbo es «consistir»?", ENTRY2, "Intransitivo", "Transitivo", "Copulativo"), pt("Según la entrada, ¿cuántas acepciones tiene «álgido»?", ENTRY3, "Dos", "Una", "Tres"),
  pt("Según la entrada, ¿cuál es el femenino de «álgido»?", ENTRY3, "álgida", "álgido", "álgidas"), pt("Según la entrada, ¿para qué sirve «un ingente esfuerzo»?", ENTRY, "Es un ejemplo de uso", "Es un sinónimo", "Es la etimología"),
];
const WHICH = "¿Qué acepción corresponde a la oración?";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY3}\n\n«En el momento álgido de la discusión, todos gritaban».`, "La acepción 2", "La acepción 1", "Ninguna"), pt(WHICH, `${ENTRY3}\n\n«Una noche álgida obligó a abrigar a las alpacas».`, "La acepción 1", "La acepción 2", "Ninguna"),
  pt(WHICH, `${ENTRY2}\n\n«El examen consiste en veinte preguntas».`, "La acepción 1", "La acepción 2", "Ninguna"), pt(WHICH, `${ENTRY2}\n\n«La felicidad consiste en compartir».`, "La acepción 2", "La acepción 1", "Ninguna"),
];
const CORRECT_USE: ChoiceItem[] = [
  pt("Según la entrada, ¿qué oración usa bien el verbo?", ENTRY2, "El proyecto consiste en tres fases.", "El proyecto consiste de tres fases.", "El proyecto consiste a tres fases."),
  pt("Según la entrada, ¿qué oración usa bien el verbo?", ENTRY2, "Su método consiste en repetir.", "Su método consiste de repetir.", "Su método consiste que repite."),
  pt("Según la entrada, ¿qué oración usa bien la palabra?", ENTRY3, "Fue el momento álgido del partido.", "Fue el momento álgido y caluroso del verano tropical.", "Estaba álgido de felicidad."),
  pt("Según la entrada, ¿qué oración usa bien la palabra?", ENTRY, "Hicieron un esfuerzo ingente para reconstruir el pueblo.", "Hicieron un esfuerzo ingente y pequeño.", "Ingentemente lo hicieron."),
  w("¿Qué oración usa bien «seguro de»?", "Estoy seguro de que vendrá.", "Estoy seguro que vendrá mañana temprano.", "Estoy seguro de qué vendrá."), w("¿Qué oración usa bien «sobre todo»?", "Me gusta la fruta, sobre todo el mango.", "Me gusta la fruta, sobretodo el mango.", "Me gusta la fruta, sobre-todo el mango."),
];
const THES2 = "DICCIONARIO DE SINÓNIMOS\nimportante adj. Sin. relevante, trascendental, crucial, significativo, primordial. Ant. irrelevante, insignificante.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué sinónimo conviene para un hecho que cambió la historia?", THES2, "trascendental", "significativo", "irrelevante"), pt("Según la entrada, ¿qué sinónimo conviene para algo de lo que depende el éxito de un plan?", THES2, "crucial", "relevante", "insignificante"),
  pt("Según la entrada, ¿cuál es un antónimo de «importante»?", THES2, "irrelevante", "primordial", "crucial"), pt("Según la entrada, ¿qué sinónimo conviene en «Un aumento ___ de las ventas»?", THES2, "significativo", "trascendental", "primordial"),
  pt("Según la entrada, ¿qué sinónimo conviene para lo que debe hacerse primero?", THES2, "primordial", "significativo", "insignificante"), pt("¿Por qué un diccionario de sinónimos ayuda a escribir mejor?", THES2, "Porque permite elegir el matiz más preciso", "Porque traduce al inglés", "Porque corrige la letra"),
];

export const ROWS: Row[] = [
  ["Z.1", "Analogías con patrones de palabras", (r) => choose(r, "Completa la analogía.", PATTERN_ANALOGY)],
  ["Z.2", "Oraciones con patrones de palabras", (r) => choose(r, "Completa la oración.", PATTERN_SENTENCE)],
  ["Z.3", "Palabras con pre-", (r) => choose(r, "Completa la oración.", PRE)],
  ["Z.4", "Palabras con re-", (r) => choose(r, "Completa la oración.", RE)],
  ["Z.5", "Palabras con sub-", (r) => choose(r, "Completa la oración.", SUB)],
  ["Z.6", "Palabras con mal-", (r) => choose(r, "Completa la oración.", MAL)],
  ["Z.7", "Palabras con des-, in-, im-, i- y no", (r) => choose(r, "Completa la oración.", NEG)],
  ["Z.8", "Palabras con -oso y -osa", (r) => choose(r, "Completa la oración.", OSO)],
  ["Z.9", "Palabras con a-, an- y sin-", (r) => choose(r, "Completa la oración.", SIN)],
  ["Z.10", "Palabras con -able e -ible", (r) => choose(r, "Completa la oración.", ABLE)],

  ["AA.1", "Agrupar palabras por raíces griegas o latinas comunes", (r) => choose(r, "", SORT_ROOTS)],
  ["AA.2", "Usar raíces griegas y latinas como pistas del significado de las palabras", (r) => choose(r, "", ROOT_CLUES)],
  ["AA.3", "Usar palabras como pistas del significado de raíces griegas y latinas", (r) => choose(r, "", WORDS_TO_ROOT)],
  ["AA.4", "Determinar el significado de raíces griegas y latinas", (r) => choose(r, "", ROOT_MEANING)],
  ["AA.5", "Determinar el significado de palabras con raíces griegas y latinas", (r) => choose(r, "", ROOT_WORDS)],

  ["BB.1", "Usar el homófono correcto", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["BB.2", "Identificar y corregir errores con homófonos", (r) => choose(r, "", HOMOPHONE_FIX)],

  ["CC.1", "Usar la etimología para determinar el significado de las palabras", (r) => choose(r, "", ETYMOLOGY)],
  ["CC.2", "Usar el contexto para entender expresiones de otras lenguas", (r) => choose(r, "", FOREIGN_CONTEXT)],
  ["CC.3", "Usar la expresión latina o extranjera correcta", (r) => choose(r, "Completa la oración.", FOREIGN_USE)],

  ["DD.1", "Elegir la palabra cuyo significado y connotación se ajustan a la oración", (r) => choose(r, "", CONNOTATION)],
  ["DD.2", "Usar las palabras con exactitud y precisión", (r) => choose(r, "", PRECISE_WORDS)],
  ["DD.3", "Reemplazar palabras con ayuda del diccionario de sinónimos", (r) => choose(r, "", REPLACE)],
  ["DD.4", "Explorar palabras con usos nuevos o discutidos", (r) => choose(r, "", USAGE)],

  ["EE.1", "Analogías", (r) => choose(r, "Completa la analogía.", ANALOGY)],
  ["EE.2", "Analogías: desafío", (r) => choose(r, "Completa la analogía.", ANALOGY_HARD)],

  ["FF.1", "Determinar el significado de palabras usando sinónimos en contexto", (r) => choose(r, "", SYN_CLUE)],
  ["FF.2", "Determinar el significado de palabras usando antónimos en contexto", (r) => choose(r, "", ANT_CLUE)],
  ["FF.3", "Usar el contexto para identificar el significado de una palabra", (r) => choose(r, "", CONTEXT)],

  ["GG.1", "Usar las entradas del diccionario", (r) => choose(r, "", DICTIONARY)],
  ["GG.2", "Usar las definiciones del diccionario", (r) => choose(r, "", DEFINITIONS)],
  ["GG.3", "Usar las entradas del diccionario para determinar el uso correcto", (r) => choose(r, "", CORRECT_USE)],
  ["GG.4", "Usar las entradas del diccionario de sinónimos", (r) => choose(r, "", THESAURUS)],
];
