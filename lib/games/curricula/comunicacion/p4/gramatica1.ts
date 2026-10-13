import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, order, pickAll, pickInSentence, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, primera parte (IXL 4th grade ELA, LL-RR), con las
// reglas del castellano en lugar de las del inglés:
//   prefijos dis-, mis-, pre- → des-, in-/im-, pre-     sufijos -able, -ish, -ment → -able/-ible, -izo, -miento
//   common words (sets 1-4) → palabras frecuentes con b/v, con h, con g/j y con c/s/z
//   plurales -ies, -ves → -ces, -íes/-úes y palabras que no cambian (el lunes, los lunes)
//   posesivo con 's → pertenencia con de, del, de la, de los
//   "I" y "me" → yo y mí      who/whom/whose/which/that → que, quien, cuyo, el cual, donde
//   verbos modales → poder, deber, tener que, querer, soler
//   to be → ser y estar      to have → tener y haber
//   progressive → estar + gerundio      perfect → haber + participio

export const SECTIONS: Section[] = [
  { id: "LL", name: "Ortografía", icon: "✍️" },
  { id: "MM", name: "Oraciones, fragmentos y oraciones pegadas", icon: "💬" },
  { id: "NN", name: "Sustantivos", icon: "🏷️" },
  { id: "OO", name: "Pronombres", icon: "👤" },
  { id: "PP", name: "Tipos de verbos", icon: "🏃" },
  { id: "QQ", name: "Concordancia entre sujeto y verbo", icon: "🤝" },
  { id: "RR", name: "Tiempos verbales", icon: "⏳" },
];

// --- LL. Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("deshidratado", "desidratado", "dezhidratado"), spell("inhumano", "inumano", "imhumano"), spell("prehistoria", "preistoria", "prehiztoria"), spell("imposible", "inposible", "imposivle"),
  spell("desobediente", "desovediente", "dezobediente"), spell("imborrable", "inborrable", "imvorrable"), spell("prever", "preveer", "prebér"), spell("deshabitado", "desabitado", "deshavitado"),
  spell("innecesario", "inecesario", "innesesario"), spell("impaciente", "inpaciente", "impasiente"), spell("precalentar", "pre calentar", "precalemtar"), spell("desenvolver", "desenbolver", "desemvolver"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("amable", "amavle", "hamable"), spell("posible", "posivle", "pocible"), spell("movimiento", "mobimiento", "movimiemto"), spell("rojizo", "rojiso", "rogizo"),
  spell("invisible", "invicible", "imvisible"), spell("crecimiento", "cresimiento", "crecimiemto"), spell("enfermizo", "enfermiso", "emfermizo"), spell("lavable", "labable", "lavavle"),
  spell("nacimiento", "nasimiento", "nacimiemto"), spell("resbaladizo", "resvaladizo", "resbaladiso"), spell("comestible", "comestivle", "comeztible"), spell("pensamiento", "pensamiemto", "penzamiento"),
];
const SET_BV: ChoiceItem[] = [
  spell("también", "tanbién", "tamvién"), spell("había", "havía", "abía"), spell("escribir", "escrivir", "eskribir"), spell("volver", "bolver", "volber"),
  spell("nuevo", "nuebo", "nuvo"), spell("iba", "iva", "hiba"), spell("bastante", "vastante", "bastamte"), spell("servir", "serbir", "cervir"),
  spell("abuelo", "avuelo", "habuelo"), spell("vivir", "bibir", "vibir"), spell("estaba", "estava", "eztaba"), spell("deber", "dever", "debér"),
];
const SET_H: ChoiceItem[] = [
  spell("hacer", "acer", "haser"), spell("ahora", "aora", "haora"), spell("hoy", "oy", "hoi"), spell("hielo", "ielo", "yelo"),
  spell("hubo", "ubo", "huvo"), spell("ahí", "aí", "hai"), spell("hermano", "ermano", "hermamo"), spell("zanahoria", "zanaoria", "sanahoria"),
  spell("hambre", "ambre", "hanbre"), spell("huevo", "uevo", "huebo"), spell("almohada", "almoada", "halmoada"), spell("hueso", "ueso", "güeso"),
];
const SET_GJ: ChoiceItem[] = [
  spell("gente", "jente", "gemte"), spell("dijeron", "digeron", "dijieron"), spell("recoger", "recojer", "rrecoger"), spell("viaje", "viage", "biaje"),
  spell("página", "pájina", "pagína"), spell("trajeron", "trageron", "trajieron"), spell("elegir", "elejir", "helegir"), spell("mensaje", "mensage", "mensague"),
  spell("mujer", "muger", "mujér"), spell("proteger", "protejer", "protegér"), spell("tejer", "teger", "tejér"), spell("colegio", "colejio", "colegeo"),
];
const SET_CSZ: ChoiceItem[] = [
  spell("hicieron", "hisieron", "hizieron"), spell("decir", "desir", "dezir"), spell("entonces", "entonses", "entonzes"), spell("empezar", "empesar", "empecar"),
  spell("conocer", "conoser", "conozer"), spell("quizás", "quisás", "quizáz"), spell("necesario", "nesesario", "necezario"), spell("parece", "parese", "pareze"),
  spell("lápices", "lápizes", "lápises"), spell("lección", "lexión", "leción"), spell("empecé", "empezé", "empesé"), spell("cabeza", "cabesa", "kabeza"),
];

// --- MM. Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa (afirma o niega)", "Interrogativa (pregunta)", "Imperativa (ordena o pide)", "Exclamativa (expresa emoción)"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["El museo abre a las nueve.", "Mi primo no sabe nadar.", "La quinua crece en el altiplano.", "Ayer terminamos la maqueta."].map((x) => KIND(x, 0)),
  ...["¿A qué hora abre el museo?", "¿Quién dejó esta mochila?", "¿Has visto mi cuaderno?", "¿Cuánto falta para llegar?"].map((x) => KIND(x, 1)),
  ...["Cierra la puerta, por favor.", "Guarden sus cuadernos.", "No corras en el pasillo.", "Pásame la sal."].map((x) => KIND(x, 2)),
  ...["¡Qué vista tan hermosa!", "¡Ganamos el campeonato!", "¡Cuánto has crecido!", "¡Qué susto me diste!"].map((x) => KIND(x, 3)),
];

const SUBJ = "¿Cuál es el sujeto completo de la oración?";
const SUBJECT: ChoiceItem[] = [
  pt(SUBJ, "Los vecinos del segundo piso pintaron la fachada.", "Los vecinos del segundo piso", "Los vecinos", "del segundo piso pintaron la fachada"), pt(SUBJ, "Mi hermana menor aprendió a montar bicicleta.", "Mi hermana menor", "hermana", "aprendió a montar bicicleta"),
  pt(SUBJ, "En la plaza tocaba una banda de músicos.", "una banda de músicos", "En la plaza tocaba una banda", "tocaba"), pt(SUBJ, "El viejo puente de madera cruje con el viento.", "El viejo puente de madera", "El viejo puente", "de madera cruje con el viento"),
  pt(SUBJ, "Ayer llegaron mis tíos de Arequipa.", "mis tíos de Arequipa", "Ayer", "llegaron mis tíos"), pt(SUBJ, "La profesora de música y sus alumnos ensayaron el himno nacional.", "La profesora de música y sus alumnos", "La profesora de música", "sus alumnos ensayaron el himno nacional"),
  pt(SUBJ, "Las hojas secas del parque cubrían el camino.", "Las hojas secas del parque", "Las hojas", "secas del parque cubrían el camino"), pt(SUBJ, "Por la mañana canta el gallo del vecino.", "el gallo del vecino", "Por la mañana canta el gallo", "canta"),
];
const PRED = "¿Cuál es el predicado completo de la oración?";
const PREDICATE: ChoiceItem[] = [
  pt(PRED, "Los vecinos del segundo piso pintaron la fachada.", "pintaron la fachada", "pintaron", "Los vecinos del segundo piso"), pt(PRED, "Mi hermana menor aprendió a montar bicicleta.", "aprendió a montar bicicleta", "aprendió", "Mi hermana menor aprendió a montar"),
  pt(PRED, "El viejo puente de madera cruje con el viento.", "cruje con el viento", "de madera cruje", "El viejo puente"), pt(PRED, "Las hojas secas del parque cubrían el camino.", "cubrían el camino", "del parque cubrían", "Las hojas secas"),
  pt(PRED, "El cartero dejó tres sobres en el buzón.", "dejó tres sobres en el buzón", "dejó tres sobres", "El cartero dejó tres sobres en el"), pt(PRED, "Mis abuelos viven cerca del mercado.", "viven cerca del mercado", "cerca del mercado", "Mis abuelos viven cerca del"),
  pt(PRED, "La lluvia de anoche inundó la cancha.", "inundó la cancha", "de anoche inundó", "La lluvia"), pt(PRED, "Todos los alumnos de cuarto visitaron el museo.", "visitaron el museo", "de cuarto visitaron", "Todos los alumnos"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto?", "Los vecinos del segundo piso pintaron la fachada.", "vecinos", "piso", "pintaron"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "Los vecinos del segundo piso pintaron la fachada.", "pintaron", "fachada", "vecinos"),
  pt("¿Cuál es el núcleo del sujeto?", "El viejo puente de madera cruje con el viento.", "puente", "madera", "viejo"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "El viejo puente de madera cruje con el viento.", "cruje", "viento", "puente"),
  pt("¿Cuál es el núcleo del sujeto?", "Mi hermana menor aprendió a montar bicicleta.", "hermana", "menor", "bicicleta"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "El cartero dejó tres sobres en el buzón.", "dejó", "sobres", "cartero"),
  pt("¿Cuál es el núcleo del sujeto?", "Las hojas secas del parque cubrían el camino.", "hojas", "parque", "secas"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "La lluvia de anoche inundó la cancha.", "inundó", "lluvia", "cancha"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["El bus salió antes de tiempo.", "Mi abuela teje chompas de alpaca.", "Los delfines saltaron junto al bote.", "Anoche hubo un temblor.", "El director felicitó a los ganadores.", "Nadie contestó el teléfono."];
const FRAGMENT_ITEMS = ["El bus de las siete y media.", "Teje chompas para.", "Los delfines del acuario.", "Durante toda la noche de ayer.", "Aunque estudiamos mucho.", "Mientras caminábamos por la plaza."];
const RUN_ON_ITEMS = ["El bus salió temprano lo perdimos.", "Mi abuela teje yo le alcanzo la lana.", "Hubo un temblor salimos al patio.", "Tengo sed voy por agua.", "El director habló todos aplaudieron.", "Sonó el teléfono nadie contestó."];

const SIMPLE = sorter(["Simple (una sola idea con su verbo)", "Compuesta (dos ideas unidas)"], "¿La oración es simple o compuesta?");
const SIMPLE_COMPOUND: ChoiceItem[] = [
  ...["El perro de mi vecino ladra toda la noche.", "Mis primos y yo fuimos al río.", "La maestra explicó la lección con un mapa.", "Ayer comimos arroz con pollo.", "El niño de la gorra roja corre muy rápido."].map((x) => SIMPLE(x, 0)),
  ...["El perro ladra y el gato se esconde.", "Quise ir al río, pero llovió.", "La maestra explicó y nosotros anotamos.", "Comes ahora o almuerzas más tarde.", "No vino porque estaba enfermo."].map((x) => SIMPLE(x, 1)),
];
const JOIN = "¿Cómo se unen mejor las dos oraciones en una oración compuesta?";
const MAKE_COMPOUND: ChoiceItem[] = [
  pt(JOIN, "Tenía sueño. Terminé la tarea.", "Tenía sueño, pero terminé la tarea.", "Tenía sueño terminé la tarea.", "Tenía sueño, o terminé la tarea."), pt(JOIN, "Llovió toda la noche. El río creció.", "Llovió toda la noche y el río creció.", "Llovió toda la noche, pero el río creció.", "Llovió toda la noche el río creció."),
  pt(JOIN, "Podemos ir al cine. Podemos quedarnos en casa.", "Podemos ir al cine o quedarnos en casa.", "Podemos ir al cine, pero quedarnos en casa.", "Podemos ir al cine podemos quedarnos."), pt(JOIN, "No fui a clases. Tenía fiebre.", "No fui a clases porque tenía fiebre.", "No fui a clases, o tenía fiebre.", "No fui a clases tenía fiebre."),
  pt(JOIN, "Mi papá cocina. Mi mamá pone la mesa.", "Mi papá cocina y mi mamá pone la mesa.", "Mi papá cocina mi mamá pone la mesa.", "Mi papá cocina, sino mi mamá pone la mesa."), pt(JOIN, "Quería helado. La tienda estaba cerrada.", "Quería helado, pero la tienda estaba cerrada.", "Quería helado, y por eso la tienda estaba cerrada.", "Quería helado la tienda cerrada."),
  pt(JOIN, "Estudia mucho. Aprobarás el examen.", "Estudia mucho y aprobarás el examen.", "Estudia mucho, pero aprobarás el examen.", "Estudia mucho aprobarás."), pt(JOIN, "No tengo lápiz. No tengo borrador.", "No tengo lápiz ni borrador.", "No tengo lápiz, pero borrador.", "No tengo lápiz o no borrador."),
];
const UNSCRAMBLE: OrderItem[] = [
  { seq: ["Los", "alumnos", "de", "cuarto", "sembraron", "lechugas"] }, { seq: ["Mi", "abuelo", "cuenta", "historias", "muy", "divertidas"] }, { seq: ["Ayer", "encontramos", "un", "nido", "en", "el", "techo"] },
  { seq: ["El", "río", "baja", "con", "mucha", "fuerza"] }, { seq: ["¿Dónde", "guardaste", "mis", "zapatillas", "nuevas?"] }, { seq: ["La", "tejedora", "vende", "ponchos", "en", "la", "feria"] },
  { seq: ["Nunca", "había", "visto", "tantas", "estrellas"] }, { seq: ["Mañana", "viajaremos", "en", "tren", "al", "Cusco"] },
];

// --- NN. Sustantivos ---------------------------------------------------------

const WHICH_NOUN: ChoiceItem[] = [
  w("¿Qué palabra es un sustantivo?", "montaña", "escalar", "alta"), w("¿Qué palabra es un sustantivo?", "valentía", "valiente", "valientemente"), w("¿Qué palabra es un sustantivo?", "tejedor", "tejer", "tejía"),
  w("¿Qué palabra es un sustantivo?", "amistad", "amigable", "amistosamente"), w("¿Qué palabra es un sustantivo?", "cosecha", "cosechar", "cosechado"), w("¿Qué palabra es un sustantivo?", "silencio", "silencioso", "callar"),
  w("¿Qué palabra es un sustantivo?", "viaje", "viajar", "viajó"), w("¿Qué palabra es un sustantivo?", "pregunta", "preguntar", "preguntó"), w("¿Qué palabra es un sustantivo?", "llegada", "llegar", "llegó"),
  w("¿Qué palabra es un sustantivo?", "pintura", "pintar", "pintado"),
];
const NOUNS_IN = [
  s("El pescador amarró su bote al muelle.", "pescador", "bote", "muelle"), s("Las llamas cargan costales por el camino.", "llamas", "costales", "camino"), s("Mi prima toca el charango en una banda.", "prima", "charango", "banda"),
  s("El viento movía las ramas del eucalipto.", "viento", "ramas", "eucalipto"), s("La enfermera vacunó a los niños del colegio.", "enfermera", "niños", "colegio"), s("Un cóndor planeaba sobre el valle.", "cóndor", "valle"),
  s("La panadera sacó los panes del horno.", "panadera", "panes", "horno"), s("El tren cruzó un puente muy largo.", "tren", "puente"),
];
const ABSTRACT_IN = [
  s("La paciencia del maestro calmó el miedo de los niños.", "paciencia", "maestro", "miedo", "niños"), s("Su honestidad le ganó el respeto del pueblo.", "honestidad", "respeto", "pueblo"), s("La alegría llenó la casa durante la fiesta.", "alegría", "casa", "fiesta"),
  s("El esfuerzo y la constancia traen buenos frutos.", "esfuerzo", "constancia", "frutos"), s("Sentí orgullo al ver mi dibujo en el mural.", "orgullo", "dibujo", "mural"), s("La libertad es un derecho de las personas.", "libertad", "derecho", "personas"),
  s("Su curiosidad lo llevó hasta la biblioteca.", "curiosidad", "biblioteca"), s("La amistad vence a la distancia.", "amistad", "distancia"),
];
const PROPER = ["Arequipa", "Titicaca", "Amazonas", "Micaela", "Perú", "Huascarán", "Túpac Amaru", "Júpiter", "Trujillo", "Ucayali"];
const COMMON = ["ciudad", "lago", "río", "niña", "país", "nevado", "héroe", "planeta", "plaza", "región"];

const PLURAL_FORM: ChoiceItem[] = [
  w("¿Cuál es el plural de «pez»?", "peces", "pezes", "pezs"), w("¿Cuál es el plural de «árbol»?", "árboles", "árbols", "árbolces"), w("¿Cuál es el plural de «mesa»?", "mesas", "mesaes", "meses"),
  w("¿Cuál es el plural de «luz»?", "luces", "luzes", "luzs"), w("¿Cuál es el plural de «camión»?", "camiones", "camións", "camiónes"), w("¿Cuál es el plural de «reloj»?", "relojes", "relojs", "reloges"),
  w("¿Cuál es el plural de «lápiz»?", "lápices", "lápizes", "lápiz"), w("¿Cuál es el plural de «pared»?", "paredes", "pareds", "pareces"), w("¿Cuál es el plural de «café»?", "cafés", "cafeses", "cafées"),
  w("¿Cuál es el plural de «nuez»?", "nueces", "nuezes", "nueses"),
];
const PLURAL_USE: ChoiceItem[] = [
  f("En el acuario vimos muchos ___ de colores.", "peces", "pezes", "pez"), f("Las ___ de la plaza se encendieron al anochecer.", "luces", "luzes", "luz"), f("Sembramos diez ___ en el parque.", "árboles", "árbols", "árbol"),
  f("Saqué punta a todos mis ___.", "lápices", "lápizes", "lápiz"), f("Tres ___ de carga cruzaron el puente.", "camiones", "camións", "camión"), f("Las ___ del salón son celestes.", "paredes", "pareds", "pared"),
  f("Mi abuelo colecciona ___ antiguos.", "relojes", "relojs", "reloj"), f("La ardilla guardó cinco ___.", "nueces", "nuezes", "nuez"), f("Las ___ cantaron al amanecer.", "aves", "avees", "ave"),
  f("Hay dos ___ nuevos en mi cuadra.", "cafés", "cafeses", "café"),
];
const PLURAL_FORM_2: ChoiceItem[] = [
  w("¿Cuál es el plural de «colibrí»?", "colibríes", "colibrises", "colibrices"), w("¿Cuál es el plural de «el lunes»?", "los lunes", "los luneses", "los lun"), w("¿Cuál es el plural de «rubí»?", "rubíes", "rubises", "rubices"),
  w("¿Cuál es el plural de «la crisis»?", "las crisis", "las crisises", "las crisces"), w("¿Cuál es el plural de «bambú»?", "bambúes", "bambuses", "bambuces"), w("¿Cuál es el plural de «el paraguas»?", "los paraguas", "los paraguases", "los paragua"),
  w("¿Cuál es el plural de «actriz»?", "actrices", "actrizes", "actrises"), w("¿Cuál es el plural de «ají»?", "ajíes", "ajises", "ajices"), w("¿Cuál es el plural de «el cumpleaños»?", "los cumpleaños", "los cumpleañoses", "los cumpleaño"),
  w("¿Cuál es el plural de «canción»?", "canciones", "cancións", "canciónes"),
];
const PLURAL_USE_2: ChoiceItem[] = [
  f("Los ___ volaban alrededor de las flores.", "colibríes", "colibrices", "colibrí"), f("Todos los ___ tengo clase de danza.", "lunes", "luneses", "lun"), f("Compramos tres ___ para la lluvia.", "paraguas", "paraguases", "paragua"),
  f("La corona tenía cinco ___ rojos.", "rubíes", "rubises", "rubí"), f("En la selva crecen los ___.", "bambúes", "bambuses", "bambú"), f("Las dos ___ recibieron un premio.", "actrices", "actrizes", "actriz"),
  f("Mi mamá muele ___ amarillos para la salsa.", "ajíes", "ajises", "ají"), f("En mi familia hay cuatro ___ en mayo.", "cumpleaños", "cumpleañoses", "cumpleaño"), f("El coro cantó seis ___.", "canciones", "cancións", "canción"),
  f("El país superó varias ___.", "crisis", "crisises", "crisi"),
];
const NUMBER = sorter(["Singular", "Plural"], "¿El sustantivo destacado está en singular o en plural?");
const SING_PLUR: ChoiceItem[] = [
  ...["El LUNES tengo examen.", "La CRISIS ya pasó.", "Perdí mi PARAGUAS.", "El ANÁLISIS salió bien.", "Hoy es mi CUMPLEAÑOS.", "La TESIS es larga."].map((x) => NUMBER(x, 0)),
  ...["Los LUNES hay formación.", "Las CRISIS se superan.", "Vendían PARAGUAS de colores.", "Los ANÁLISIS salieron bien.", "Celebramos dos CUMPLEAÑOS.", "Los MARTES voy a natación."].map((x) => NUMBER(x, 1)),
];
const IRREGULAR_PLURAL: ChoiceItem[] = [
  f("un joven → dos ___", "jóvenes", "jovenes", "jóvens"), f("un examen → dos ___", "exámenes", "examenes", "examens"), f("un carácter → dos ___", "caracteres", "carácteres", "carácters"),
  f("un régimen → dos ___", "regímenes", "régimenes", "regimens"), f("un compás → dos ___", "compases", "compáses", "compás"), f("un volcán → dos ___", "volcanes", "volcánes", "volcáns"),
  f("una imagen → dos ___", "imágenes", "imagenes", "imágens"), f("un autobús → dos ___", "autobuses", "autobúses", "autobús"), f("un origen → dos ___", "orígenes", "origenes", "origens"),
  f("un inglés → dos ___", "ingleses", "inglésés", "ingléses"),
];

const OWN = sorter(["Plural (más de uno, sin dueño)", "Pertenece a uno solo", "Pertenece a varios"], "¿Qué indican las palabras destacadas?");
const POSSESSIVE_ID: ChoiceItem[] = [
  ...["LOS PASTORES bajaron del cerro.", "LAS TEJEDORAS llegaron a la feria.", "LOS MÚSICOS afinaron sus quenas.", "LAS ALUMNAS formaron una fila."].map((x) => OWN(x, 0)),
  ...["El perro DEL PASTOR ladró.", "El telar DE LA TEJEDORA es antiguo.", "La quena DEL MÚSICO es de caña.", "La mochila DE LA ALUMNA pesa mucho."].map((x) => OWN(x, 1)),
  ...["Los perros DE LOS PASTORES ladraron.", "Los telares DE LAS TEJEDORAS son antiguos.", "Las quenas DE LOS MÚSICOS son de caña.", "Las mochilas DE LAS ALUMNAS pesan mucho."].map((x) => OWN(x, 2)),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  f("el poncho ___ pastor", "del", "de la", "de los"), f("las canastas ___ vendedoras", "de las", "del", "de los"), f("el nido ___ águila", "del", "de la", "de las"),
  f("los remos ___ pescadores", "de los", "del", "de la"), f("la corona ___ reina", "de la", "del", "de las"), f("el canto ___ aves", "de las", "del", "de los"),
  f("la oficina ___ director", "del", "de la", "de los"), f("los cuadernos ___ alumna", "de la", "del", "de las"), f("el patio ___ escuela", "de la", "del", "de los"),
  f("la cueva ___ murciélagos", "de los", "del", "de las"),
];
const FIX = "¿Cómo se corrige el error?";
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt(FIX, "El poncho de el pastor es rojo.", "El poncho del pastor es rojo.", "El poncho de la pastor es rojo.", "El poncho del el pastor es rojo."), pt(FIX, "Las canasta de las vendedoras están llenas.", "Las canastas de las vendedoras están llenas.", "Las canasta de la vendedoras están llenas.", "La canastas de las vendedoras están llenas."),
  pt(FIX, "Los remos de los pescador son largos.", "Los remos de los pescadores son largos.", "Los remos del pescadores son largos.", "Los remo de los pescador son largos."), pt(FIX, "El nido de la águila está en la roca.", "El nido del águila está en la roca.", "El nido de el águila está en la roca.", "El nido de las águila está en la roca."),
  pt(FIX, "La oficina de el director queda arriba.", "La oficina del director queda arriba.", "La oficina de la director queda arriba.", "La oficina del el director queda arriba."), pt(FIX, "Los pezes del acuario son azules.", "Los peces del acuario son azules.", "Los pez del acuario son azules.", "Los pezes de el acuario son azules."),
  pt(FIX, "Los cuaderno de la alumna son nuevos.", "Los cuadernos de la alumna son nuevos.", "Los cuaderno de las alumna son nuevos.", "El cuadernos de la alumna son nuevos."), pt(FIX, "El canto de los aves me despierta.", "El canto de las aves me despierta.", "El canto del aves me despierta.", "El canto de los ave me despierta."),
];

// --- OO. Pronombres ----------------------------------------------------------

const PRONOUNS_IN = [
  s("Ella nos invitó a su casa.", "Ella", "nos"), s("Yo te vi en la feria.", "Yo", "te"), s("Nosotros los ayudamos con la mudanza.", "Nosotros", "los"), s("Tú me prestaste un lápiz.", "Tú", "me"),
  s("Ellos le regalaron una planta.", "Ellos", "le"), s("Ustedes la conocen bien.", "Ustedes", "la"), s("Él se sentó junto a mí.", "Él", "se", "mí"), s("Ellas les contaron un cuento.", "Ellas", "les"),
];
const SUBJ_OBJ: ChoiceItem[] = [
  f("___ preparamos la cena anoche.", "Nosotros", "Nos", "A nosotros"), f("La profesora ___ felicitó por mi dibujo.", "me", "yo", "mí"), f("A mis primos ___ vi en el estadio.", "los", "ellos", "les"),
  f("___ sabes tocar la quena.", "Tú", "Te", "Ti"), f("A Carmen ___ dieron un diploma.", "le", "la", "ella"), f("___ viven cerca del río.", "Ellas", "Las", "Les"),
  f("El guía ___ mostró el camino a todos.", "nos", "nosotros", "yo"), f("Este mensaje es para ___.", "ti", "tú", "te"), f("A la gata ___ encontré en el techo.", "la", "ella", "le"),
  f("___ soy el delegado del salón.", "Yo", "Me", "Mí"),
];
const REP = "¿Qué pronombre reemplaza a las palabras destacadas?";
const REPLACE: ChoiceItem[] = [
  pt(REP, "LOS PESCADORES regresaron al muelle.", "Ellos", "Ellas", "Nosotros"), pt(REP, "Vi A LA DIRECTORA en el patio.", "la", "lo", "le"), pt(REP, "MI HERMANA Y YO sembramos habas.", "Nosotros", "Ellos", "Ustedes"),
  pt(REP, "Compré EL PERIÓDICO en el quiosco.", "lo", "la", "le"), pt(REP, "TÚ Y TUS PRIMOS llegaron tarde.", "Ustedes", "Nosotros", "Ellos"), pt(REP, "Regalé flores A MI MAMÁ.", "le", "la", "lo"),
  pt(REP, "LAS ALPACAS pastan en la puna.", "Ellas", "Ellos", "Ella"), pt(REP, "Guardé LAS LLAVES en el cajón.", "las", "los", "les"), pt(REP, "EL ALCALDE inauguró el puente.", "Él", "Ella", "Ellos"),
  pt(REP, "Escribí una carta A MIS ABUELOS.", "les", "los", "le"),
];
const I_AND_ME: ChoiceItem[] = [
  f("Mi primo y ___ armamos la carpa.", "yo", "mí", "me"), f("La carta era para mi hermano y para ___.", "mí", "yo", "me"), f("Entre tú y ___ terminaremos el mural.", "yo", "mí", "me"),
  f("El profesor nos llamó a Diego y a ___.", "mí", "yo", "me"), f("Mis padres y ___ viajamos a Ica.", "yo", "mí", "me"), f("Mi tía cocinó para mis primos y para ___.", "mí", "yo", "me"),
  f("¿Quieres jugar ___?", "conmigo", "con yo", "con mí"), f("Según ___, la respuesta es doce.", "yo", "mí", "me"), f("Hablaron de Lucía y de ___.", "mí", "yo", "me"),
  f("Tú y ___ somos del mismo equipo.", "yo", "mí", "me"),
];
const POSS_IN = [
  s("Mi mochila es azul y la tuya es verde.", "tuya"), s("Ese cuaderno es mío.", "mío"), s("Nuestra casa es pequeña; la suya es enorme.", "suya"), s("Estas entradas son nuestras.", "nuestras"),
  s("Tu perro ladra; el mío duerme.", "mío"), s("Los lápices rojos son tuyos.", "tuyos"), s("Sus zapatos están limpios; los nuestros, no.", "nuestros"), s("Esa idea fue suya.", "suya"),
];
const POSS_USE: ChoiceItem[] = [
  f("Este poncho es de mi papá: es ___.", "suyo", "mío", "tuyo"), f("Yo traje mi lonchera. ¿Trajiste la ___?", "tuya", "tuyo", "suyas"), f("Compramos esta carpa entre todos: es ___.", "nuestra", "nuestro", "mía"),
  f("Esos chimpunes me los regalaron a mí: son ___.", "míos", "mías", "tuyos"), f("Las bicicletas son de mis primas: son ___.", "suyas", "suyos", "nuestras"), f("Ese libro te lo presté: no es tuyo, es ___.", "mío", "mía", "suyo"),
  f("Tu letra es redonda y la ___ es alargada, pensé al ver mi cuaderno.", "mía", "mío", "tuya"), f("Nosotros hicimos estas maquetas: son ___.", "nuestras", "nuestros", "suyas"), f("¿Este lápiz es ___? Tiene tu nombre.", "tuyo", "tuya", "mío"),
  f("Los abuelos llegaron con sus maletas; estas dos son las ___.", "suyas", "suyos", "mías"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Yo ___ cepillo los dientes después de comer.", "me", "yo", "mí"), f("Mi hermano ___ afeita cada mañana.", "se", "él", "lo"), f("Nosotros ___ abrigamos antes de salir.", "nos", "nosotros", "los"),
  f("Tú ___ despiertas muy temprano.", "te", "tú", "ti"), f("Las niñas ___ pintaron la cara para el desfile.", "se", "ellas", "las"), f("Yo ___ miré en el espejo.", "me", "se", "yo"),
  f("Ustedes ___ sentaron en la primera fila.", "se", "ustedes", "los"), f("El gato ___ lame las patas.", "se", "él", "le"), f("Tú ___ pusiste la casaca al revés.", "te", "tú", "se"),
  f("Nosotras ___ reímos mucho.", "nos", "nosotras", "se"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Antes de dormir, yo ___ lavo la cara.", "me", "se", "te"), f("Los jugadores ___ amarraron los chimpunes.", "se", "nos", "me"), f("Tú ___ peinas con raya al costado.", "te", "se", "me"),
  f("Nosotros ___ sentamos alrededor de la fogata.", "nos", "se", "te"), f("Mi abuela ___ pone un chal cuando hace frío.", "se", "me", "nos"), f("Ustedes ___ quedaron hasta el final.", "se", "nos", "te"),
  f("Yo ___ caí de la bicicleta.", "me", "se", "nos"), f("¿Tú ___ acuerdas de aquella canción?", "te", "me", "se"), f("Mis hermanos y yo ___ disfrazamos de músicos.", "nos", "se", "me"),
  f("El gato ___ escondió debajo de la cama.", "se", "te", "nos"),
];
const REL_IN = [
  s("El libro que leí era de aventuras.", "que"), s("La niña a quien saludé es mi prima.", "quien"), s("El pueblo donde nací es pequeño.", "donde"), s("El árbol cuyas hojas caen es un molle.", "cuyas"),
  s("Los alumnos que llegaron temprano ayudaron.", "que"), s("Ese es el vecino cuyo perro ladra.", "cuyo"), s("La casa en la cual vivo es antigua.", "cual"), s("Los amigos con quienes juego son leales.", "quienes"),
];
const QUE_QUIEN: ChoiceItem[] = [
  f("La señora ___ vende flores es mi tía.", "que", "quienes", "cuya"), f("El amigo con ___ estudio vive cerca.", "quien", "quienes", "cuyo"), f("Las personas a ___ ayudamos nos agradecieron.", "quienes", "quien", "que"),
  f("El niño ___ ganó el concurso es de mi salón.", "que", "quienes", "cuyo"), f("La doctora de ___ te hablé llegó ayer.", "quien", "quienes", "cuya"), f("Los primos con ___ viajé son de Tacna.", "quienes", "quien", "cual"),
  f("El perro ___ adoptamos se llama Coco.", "que", "quien", "cuyo"), f("La maestra a ___ más admiro enseña música.", "quien", "quienes", "cuya"), f("Los niños ___ cantan son del coro.", "que", "quien", "cuyos"),
  f("Es a ti a ___ busco.", "quien", "quienes", "que"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("El escritor ___ libros leímos visitó la escuela.", "cuyos", "que", "quien"), f("La ciudad ___ nací queda junto al mar.", "donde", "cuya", "quien"), f("La mochila ___ compré es resistente.", "que", "quien", "donde"),
  f("La niña ___ mamá es doctora nos ayudó.", "cuya", "que", "quien"), f("El motivo por el ___ falté fue la lluvia.", "cual", "donde", "cuyo"), f("El parque ___ jugamos tiene una pileta.", "donde", "que", "cuyo"),
  f("La persona de ___ te hablé es mi madrina.", "quien", "cuya", "donde"), f("El árbol ___ ramas tocan el techo es un pino.", "cuyas", "que", "cual"), f("Las razones por las ___ ganamos son claras.", "cuales", "cual", "quienes"),
  f("El cuento ___ más me gusta es de un zorro.", "que", "quien", "cuyo"),
];

// --- PP. Tipos de verbos -----------------------------------------------------

const ACTION_USE: ChoiceItem[] = [
  f("El alfarero ___ el barro con sus manos.", "moldea", "barro", "húmedo"), f("Los remeros ___ contra la corriente.", "avanzan", "fuertes", "remo"), f("La abuela ___ la masa del pan.", "amasa", "harina", "suave"),
  f("El cóndor ___ sobre el cañón.", "planea", "alto", "ala"), f("Las tejedoras ___ la lana con plantas.", "tiñen", "rojas", "color"), f("El arriero ___ a las mulas por la cuesta.", "guía", "largo", "camino"),
  f("Los niños ___ la cometa en la loma.", "vuelan", "viento", "alta"), f("El herrero ___ el hierro al rojo vivo.", "golpea", "martillo", "duro"), f("Mi hermano ___ la losa después de cenar.", "lava", "limpio", "plato"),
  f("El río ___ piedras cuando crece.", "arrastra", "caudal", "grande"),
];
const ACTION_IN = [
  s("El alfarero moldea el barro y pinta las vasijas.", "moldea", "pinta"), s("Los remeros avanzan y cantan.", "avanzan", "cantan"), s("La abuela amasa el pan y enciende el horno.", "amasa", "enciende"),
  s("El cóndor planea, gira y desciende.", "planea", "gira", "desciende"), s("Mi hermano barre el patio y riega las plantas.", "barre", "riega"), s("Los niños corren, saltan y ríen.", "corren", "saltan", "ríen"),
  s("El arriero silba y guía a las mulas.", "silba", "guía"), s("La tejedora hila la lana y teje un poncho.", "hila", "teje"),
];
const HELPING: ChoiceItem[] = [
  pt("¿Cuál es el verbo auxiliar?", "Los alumnos han terminado el mural.", "han", "terminado", "mural"), pt("¿Cuál es el verbo principal?", "Los alumnos han terminado el mural.", "terminado", "han", "alumnos"),
  pt("¿Cuál es el verbo auxiliar?", "Mi tía está preparando tamales.", "está", "preparando", "tamales"), pt("¿Cuál es el verbo principal?", "Mi tía está preparando tamales.", "preparando", "está", "tía"),
  pt("¿Cuál es el verbo auxiliar?", "Mañana vamos a visitar el museo.", "vamos", "visitar", "museo"), pt("¿Cuál es el verbo principal?", "Mañana vamos a visitar el museo.", "visitar", "vamos", "mañana"),
  pt("¿Cuál es el verbo auxiliar?", "El puente fue construido por los vecinos.", "fue", "construido", "puente"), pt("¿Cuál es el verbo principal?", "El puente fue construido por los vecinos.", "construido", "fue", "vecinos"),
  pt("¿Cuál es el verbo auxiliar?", "Ya habíamos cenado cuando llegaste.", "habíamos", "cenado", "llegaste"), pt("¿Cuál es el verbo principal?", "Debes entregar la tarea el lunes.", "entregar", "debes", "tarea"),
];
const MODAL = sorter(["Capacidad o permiso", "Obligación", "Deseo", "Costumbre"], "¿Qué indica el verbo destacado?");
const MODAL_SHOWS: ChoiceItem[] = [
  ...["Mi hermana PUEDE nadar cien metros.", "¿PUEDO ir al baño?", "Ya PUEDES salir al recreo.", "El águila PUEDE ver muy lejos."].map((x) => MODAL(x, 0)),
  ...["DEBES lavarte las manos.", "TENEMOS QUE entregar el trabajo hoy.", "Los peatones DEBEN cruzar por la esquina.", "TIENES QUE tomar tu jarabe."].map((x) => MODAL(x, 1)),
  ...["QUIERO aprender quechua.", "Mi primo DESEA viajar a la selva.", "QUEREMOS formar un equipo.", "Ella QUIERE ser veterinaria."].map((x) => MODAL(x, 2)),
  ...["Mi abuelo SUELE madrugar.", "Los domingos SOLEMOS almorzar juntos.", "En agosto SUELE correr viento.", "SUELO leer antes de dormir."].map((x) => MODAL(x, 3)),
];
const MODAL_USE: ChoiceItem[] = [
  f("Para cruzar la pista, ___ mirar a ambos lados.", "debes", "sueles", "quiero"), f("Mi hermanito ya ___ amarrarse los zapatos solo: aprendió ayer.", "puede", "deben", "quieres"), f("De grande ___ ser astronauta: es mi sueño.", "quiero", "suelo", "debes"),
  f("En invierno ___ llover por las tardes.", "suele", "quiere", "pueden"), f("Hoy ___ entregar la tarea: es el último día.", "tenemos que", "solemos", "quieren"), f("¿___ prestarme tu borrador, por favor?", "Puedes", "Sueles", "Debo"),
  f("Los domingos ___ visitar a mis abuelos; es nuestra costumbre.", "solemos", "debes", "puedo"), f("Si tienes fiebre, ___ descansar.", "debes", "sueles", "quiero"), f("No ___ comer maní: soy alérgico.", "puedo", "suelen", "quieres"),
  f("Mi prima ___ aprender a tocar el cajón: sueña con eso.", "quiere", "suelen", "debo"),
];

// --- QQ. Concordancia --------------------------------------------------------

const SUBJ_NUM = sorter(["Singular", "Plural"], "¿El sujeto es singular o plural?");
const SUBJECT_NUMBER: ChoiceItem[] = [
  ...["La gente aplaudió al final.", "El equipo ganó la copa.", "Mi familia vive en Puno.", "El rebaño cruzó el río.", "La bandada voló al sur.", "Cada alumno trajo un libro."].map((x) => SUBJ_NUM(x, 0)),
  ...["Los vecinos aplaudieron al final.", "Las jugadoras ganaron la copa.", "Mis tíos viven en Puno.", "Las ovejas cruzaron el río.", "Mi mamá y mi tía cocinan.", "Tú y yo somos amigos."].map((x) => SUBJ_NUM(x, 1)),
];
const SUBJECT_VERB: ChoiceItem[] = [
  f("La gente ___ temprano a la feria.", "llega", "llegan", "llegamos"), f("Los niños del coro ___ muy bien.", "cantan", "canta", "cantas"), f("El equipo ___ todos los martes.", "entrena", "entrenan", "entrenamos"),
  f("___ venden pan con chicharrón.", "Las señoras", "La señora", "Mi tía"), f("Mi familia ___ ir al campo.", "prefiere", "prefieren", "preferimos"), f("___ ladra cuando pasa el cartero.", "El perro", "Los perros", "Tus perros"),
  f("Las hojas del árbol ___ en otoño.", "caen", "cae", "caes"), f("El rebaño ___ en la loma.", "pasta", "pastan", "pastamos"), f("___ brillan en el cielo despejado.", "Las estrellas", "La estrella", "Una luz"),
  f("Cada alumno ___ su propio dibujo.", "hizo", "hicieron", "hicimos"),
];
const PRONOUN_VERB: ChoiceItem[] = [
  f("Nosotros ___ al vóley en el recreo.", "jugamos", "juegan", "juego"), f("Tú ___ muy rápido.", "corres", "corre", "corren"), f("Ellas ___ en el coro.", "cantan", "canta", "cantamos"),
  f("Yo ___ un cuento cada noche.", "leo", "lee", "leen"), f("Ustedes ___ temprano.", "llegan", "llegas", "llegamos"), f("Él ___ la guitarra.", "toca", "tocan", "tocas"),
  f("Usted ___ razón.", "tiene", "tienes", "tienen"), f("Nosotras ___ la mesa.", "ponemos", "ponen", "pongo"), f("Ellos ___ del mercado.", "vienen", "viene", "venimos"),
  f("Yo ___ que sí.", "digo", "dice", "dicen"),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  f("Mi papá y mi tío ___ la pared.", "pintan", "pinta", "pinto"), f("La llama y la alpaca ___ en los Andes.", "viven", "vive", "vivimos"), f("Tú y yo ___ el mismo equipo.", "formamos", "forman", "formas"),
  f("Carla y sus primas ___ al río.", "fueron", "fue", "fuimos"), f("El lápiz y el borrador ___ en la cartuchera.", "están", "está", "estamos"), f("Tú y tu hermano ___ muy parecidos.", "son", "es", "somos"),
  f("Ni el frío ni la lluvia ___ a los caminantes.", "detuvieron", "detuvo", "detuvimos"), f("Mi abuela y yo ___ pan los sábados.", "horneamos", "hornean", "hornea"), f("El director y la profesora ___ el acto.", "inauguraron", "inauguró", "inauguramos"),
  f("___ juegan ajedrez en el recreo.", "Luis y Ana", "Luis", "Mi amiga"),
];

// --- RR. Tiempos verbales ----------------------------------------------------

const PAST_SENTENCE: ChoiceItem[] = [
  w("¿Qué oración está en pasado?", "Los arrieros cruzaron la quebrada.", "Los arrieros cruzan la quebrada.", "Los arrieros cruzarán la quebrada."), w("¿Qué oración está en pasado?", "La tejedora terminó el poncho.", "La tejedora termina el poncho.", "La tejedora terminará el poncho."),
  w("¿Qué oración está en pasado?", "Ayudé a mi mamá en la chacra.", "Ayudo a mi mamá en la chacra.", "Ayudaré a mi mamá en la chacra."), w("¿Qué oración está en pasado?", "El río inundó los sembríos.", "El río inunda los sembríos.", "El río inundará los sembríos."),
  w("¿Qué oración está en pasado?", "Bailamos huayno en la fiesta.", "Bailaremos huayno en la fiesta.", "Vamos a bailar huayno en la fiesta."), w("¿Qué oración está en pasado?", "Los alumnos visitaron el museo.", "Los alumnos visitan el museo.", "Los alumnos visitarán el museo."),
  w("¿Qué oración está en pasado?", "Mi tío vendió su camioneta.", "Mi tío vende su camioneta.", "Mi tío venderá su camioneta."), w("¿Qué oración está en pasado?", "Subiste al mirador.", "Subes al mirador.", "Subirás al mirador."),
];
const PAST_IN = [
  s("Ayer caminamos hasta la laguna y almorzamos allí.", "caminamos", "almorzamos"), s("El gallo cantó y todos despertaron.", "cantó", "despertaron"), s("Lavé la ropa y barrí el patio.", "Lavé", "barrí"),
  s("Los niños jugaron hasta que llovió.", "jugaron", "llovió"), s("Mi tía cocinó, sirvió y lavó los platos.", "cocinó", "sirvió", "lavó"), s("Abriste la ventana y entró el frío.", "Abriste", "entró"),
  s("El tren partió cuando llegamos.", "partió", "llegamos"), s("Ayer estudié y hoy descanso.", "estudié"),
];
const PAST_REGULAR: ChoiceItem[] = [
  f("Ayer nosotros ___ (caminar) hasta la laguna.", "caminamos", "caminaron", "caminaré"), f("Anoche yo ___ (cenar) temprano.", "cené", "cenó", "ceno"), f("El sábado ellas ___ (bailar) marinera.", "bailaron", "bailamos", "bailan"),
  f("La semana pasada tú ___ (ganar) el concurso.", "ganaste", "ganó", "ganas"), f("Ayer el gallo ___ (cantar) a las cinco.", "cantó", "canté", "canta"), f("Yo ___ (barrer) el patio esta mañana.", "barrí", "barrió", "barro"),
  f("Ustedes ___ (subir) al cerro el domingo.", "subieron", "subimos", "suben"), f("Mi mamá ___ (vender) tamales ayer.", "vendió", "vendí", "vende"), f("Nosotras ___ (escribir) una carta.", "escribimos", "escribieron", "escribió"),
  f("Tú ___ (abrir) la puerta sin tocar.", "abriste", "abrió", "abres"),
];
const IRREGULAR_ID: ChoiceItem[] = [
  w("¿Cuál es el pasado de «andar» (yo)?", "anduve", "andé", "ando"), w("¿Cuál es el pasado de «caber» (él)?", "cupo", "cabió", "cabe"), w("¿Cuál es el pasado de «traducir» (ella)?", "tradujo", "traducio", "traduce"),
  w("¿Cuál es el pasado de «saber» (yo)?", "supe", "sabí", "sé"), w("¿Cuál es el pasado de «poder» (ellos)?", "pudieron", "podieron", "pueden"), w("¿Cuál es el pasado de «querer» (él)?", "quiso", "querió", "quiere"),
  w("¿Cuál es el pasado de «estar» (nosotros)?", "estuvimos", "estamos", "estuvieron"), w("¿Cuál es el pasado de «dormir» (él)?", "durmió", "dormió", "duerme"), w("¿Cuál es el pasado de «pedir» (ella)?", "pidió", "pedió", "pide"),
  w("¿Cuál es el pasado de «conducir» (yo)?", "conduje", "conducí", "conduzco"),
];
const SETS: ChoiceItem[][] = [
  [f("Ayer yo ___ (estar) en la feria.", "estuve", "estuvo", "estoy"), f("Ella ___ (tener) fiebre anoche.", "tuvo", "tuve", "tenió"), f("Nosotros ___ (poder) cruzar el río.", "pudimos", "podimos", "pudieron"), f("Ellos ___ (poner) la mesa.", "pusieron", "ponieron", "puso"), f("Tú ___ (saber) la respuesta.", "supiste", "sabiste", "supo"), f("Yo ___ (poner) las flores en agua.", "puse", "poní", "puso"), f("Ustedes ___ (estar) muy atentos.", "estuvieron", "estuvimos", "estaron"), f("Él ___ (poder) terminar a tiempo.", "pudo", "pude", "podió")],
  [f("Yo ___ (andar) por el malecón.", "anduve", "andé", "anduvo"), f("El baúl no ___ (caber) en el carro.", "cupo", "cabió", "cupe"), f("Ella ___ (querer) ayudar.", "quiso", "querió", "quise"), f("Nosotros ___ (venir) en bus.", "vinimos", "venimos", "vinieron"), f("Ellos ___ (andar) toda la tarde.", "anduvieron", "andaron", "anduvimos"), f("Tú ___ (venir) temprano.", "viniste", "veniste", "vino"), f("Yo ___ (querer) decírtelo.", "quise", "quiso", "querí"), f("Ustedes ___ (caber) en la foto.", "cupieron", "cabieron", "cupimos")],
  [f("El guía ___ (conducir) al grupo.", "condujo", "conducio", "conduje"), f("Yo ___ (traducir) la carta.", "traduje", "traducí", "tradujo"), f("Ellos ___ (decir) la verdad.", "dijeron", "dijieron", "dicieron"), f("Nosotros ___ (traer) la leña.", "trajimos", "traímos", "trajeron"), f("La fábrica ___ (producir) más queso.", "produjo", "producio", "produje"), f("Tú ___ (decir) que vendrías.", "dijiste", "deciste", "dijo"), f("Ustedes ___ (traer) el pan.", "trajeron", "trajieron", "trajimos"), f("Yo ___ (conducir) la bicicleta.", "conduje", "conducí", "condujo")],
  [f("El bebé ___ (dormir) toda la noche.", "durmió", "dormió", "dormí"), f("Ella ___ (pedir) un vaso de agua.", "pidió", "pedió", "pedí"), f("Ellos ___ (sentir) frío.", "sintieron", "sentieron", "sentimos"), f("El mozo ___ (servir) la sopa.", "sirvió", "servió", "serví"), f("Los niños ___ (dormir) en carpas.", "durmieron", "dormieron", "dormimos"), f("Mi abuela ___ (repetir) el cuento.", "repitió", "repetió", "repetí"), f("Él ___ (leer) todo el libro.", "leyó", "leió", "leí"), f("Ellas ___ (oír) un ruido.", "oyeron", "oieron", "oímos")],
];
const fromSet = (i: number) => (r: Parameters<typeof choose>[0]) => choose(r, "Completa con el verbo en pasado.", SETS[i]);

const SER_ESTAR: ChoiceItem[] = [
  f("La reunión ___ en el auditorio.", "es", "está", "son"), f("El auditorio ___ en el segundo piso.", "está", "es", "están"), f("Mis primos ___ de Ayacucho.", "son", "están", "es"),
  f("Hoy la sopa ___ salada.", "está", "es", "son"), f("Ayer nosotros ___ en la playa.", "estuvimos", "éramos", "estamos"), f("De niño, mi papá ___ muy travieso.", "era", "estaba", "es"),
  f("Las ventanas ___ abiertas.", "están", "son", "está"), f("Tú ___ el mayor de tus hermanos.", "eres", "estás", "es"), f("Cuando llegué, todos ___ dormidos.", "estaban", "eran", "están"),
  f("Mañana ___ el cumpleaños de Lía.", "será", "estará", "fue"),
];
const TENER_HABER: ChoiceItem[] = [
  f("En el salón ___ treinta carpetas.", "hay", "ay", "han"), f("Mi hermano ___ diez años.", "tiene", "hay", "ha"), f("Nosotros ___ terminado la maqueta.", "hemos", "tenemos", "hay"),
  f("Ayer ___ una feria en la plaza.", "hubo", "habían", "hubieron"), f("Ellas ___ dos gatos.", "tienen", "han", "hay"), f("¿Tú ___ visto mi lapicero?", "has", "tienes", "hay"),
  f("Mañana ___ una reunión en el patio.", "habrá", "habrán", "han"), f("Yo ___ sed.", "tengo", "he", "hay"), f("Antes ___ muchos árboles aquí.", "había", "hubieron", "habían"),
  f("Los alumnos ___ llegado temprano.", "han", "tienen", "hay"),
];
const TENSE = sorter(["Pasado", "Presente", "Futuro"], "¿En qué tiempo está la oración?");
const TENSES: ChoiceItem[] = [
  ...["El alcalde inauguró la losa.", "Cuando era niña, vivía en Tarma.", "Anduvimos por el malecón.", "Mi tío trajo paltas."].map((x) => TENSE(x, 0)),
  ...["El alcalde inaugura la losa.", "Mi abuela vive en Tarma.", "Andamos por el malecón.", "Mi tío trae paltas cada semana."].map((x) => TENSE(x, 1)),
  ...["El alcalde inaugurará la losa.", "Viviré en Tarma.", "Vamos a andar por el malecón.", "Mi tío traerá paltas."].map((x) => TENSE(x, 2)),
];
const FUT = "¿Cómo queda la oración en futuro?";
const TO_FUTURE: ChoiceItem[] = [
  pt(FUT, "El alcalde inaugura la losa.", "El alcalde inaugurará la losa.", "El alcalde inauguró la losa.", "El alcalde inauguraba la losa."), pt(FUT, "Salimos de paseo.", "Saldremos de paseo.", "Salíamos de paseo.", "Saliremos de paseo."),
  pt(FUT, "Tengo un perro.", "Tendré un perro.", "Tuve un perro.", "Teneré un perro."), pt(FUT, "Ellos hacen la tarea.", "Ellos harán la tarea.", "Ellos hicieron la tarea.", "Ellos hacerán la tarea."),
  pt(FUT, "Tú dices la verdad.", "Tú dirás la verdad.", "Tú dijiste la verdad.", "Tú decirás la verdad."), pt(FUT, "Mi tío viene el lunes.", "Mi tío vendrá el lunes.", "Mi tío vino el lunes.", "Mi tío venirá el lunes."),
  pt(FUT, "Puedo ayudarte.", "Podré ayudarte.", "Pude ayudarte.", "Poderé ayudarte."), pt(FUT, "Ponemos la mesa.", "Pondremos la mesa.", "Pusimos la mesa.", "Poneremos la mesa."),
];
const PROGRESSIVE_USE: ChoiceItem[] = [
  f("Ahora mismo mi mamá ___ el almuerzo.", "está preparando", "estaba preparando", "preparó"), f("Ayer a las ocho, yo ___ la tarea.", "estaba haciendo", "estoy haciendo", "estaré haciendo"), f("Mañana a esta hora ___ hacia Cusco.", "estaremos viajando", "estábamos viajando", "estamos viajando"),
  f("Mira: los niños ___ en el patio.", "están jugando", "estaban jugando", "jugaron"), f("Cuando llegaste, nosotros ___.", "estábamos cenando", "estamos cenando", "estaremos cenando"), f("No hagas ruido: el bebé ___.", "está durmiendo", "estaba durmiendo", "durmió"),
  f("Anoche ___ muy fuerte cuando salimos.", "estaba lloviendo", "está lloviendo", "estará lloviendo"), f("En este momento yo ___ un cuento.", "estoy leyendo", "estaba leyendo", "leí"), f("El próximo lunes ya ___ en la nueva escuela.", "estaré estudiando", "estaba estudiando", "estoy estudiando"),
  f("Ahora ustedes ___ muy bien.", "están cantando", "estaban cantando", "cantaron"),
];
const PROGRESSIVE_FORM: ChoiceItem[] = [
  w("¿Cuál es el gerundio de «leer»?", "leyendo", "leiendo", "leído"), w("¿Cuál es el gerundio de «dormir»?", "durmiendo", "dormiendo", "dormido"), w("¿Cuál es el gerundio de «correr»?", "corriendo", "correndo", "corrido"),
  w("¿Cuál es el gerundio de «decir»?", "diciendo", "deciendo", "dicho"), w("¿Cuál es el gerundio de «ir»?", "yendo", "iendo", "ido"), w("¿Cuál es el gerundio de «pedir»?", "pidiendo", "pediendo", "pedido"),
  w("¿Cuál es el gerundio de «caer»?", "cayendo", "caiendo", "caído"), w("¿Cuál es el gerundio de «cantar»?", "cantando", "cantiendo", "cantado"), w("¿Cuál es el gerundio de «oír»?", "oyendo", "oiendo", "oído"),
  w("¿Cuál es el gerundio de «sentir»?", "sintiendo", "sentiendo", "sentido"),
];
const PAST_OR_PARTICIPLE: ChoiceItem[] = [
  f("Ayer se ___ el vaso.", "rompió", "roto", "rompido"), f("El vaso se ha ___.", "roto", "rompió", "rompido"), f("Mi hermana ___ una carta anoche.", "escribió", "escrito", "escribido"),
  f("Mi hermana ha ___ tres cartas.", "escrito", "escribió", "escribido"), f("Ya hemos ___ la película.", "visto", "vimos", "veído"), f("El sábado ___ la película.", "vimos", "visto", "veímos"),
  f("¿Quién ha ___ la ventana?", "abierto", "abrió", "abrido"), f("El viento ___ la ventana.", "abrió", "abierto", "abrido"), f("Has ___ un buen trabajo.", "hecho", "hiciste", "hacido"),
  f("He ___ la mesa para cenar.", "puesto", "puse", "ponido"), f("Los pollitos han ___ del cascarón.", "salido", "salieron", "salió"), f("Todavía no ha ___ el bus.", "vuelto", "volvió", "volvido"),
];
const PERFECT_USE: ChoiceItem[] = [
  f("Esta semana ___ dos libros.", "he leído", "había leído", "habré leído"), f("Cuando llegamos, la función ya ___.", "había empezado", "ha empezado", "habrá empezado"), f("Para el viernes ya ___ el mural.", "habremos terminado", "habíamos terminado", "hemos terminado"),
  f("Todavía no ___ el cartero.", "ha llegado", "había llegado", "habrá llegado"), f("Antes de mudarse, mis tíos ___ en Piura.", "habían vivido", "han vivido", "habrán vivido"), f("Este año nosotros ___ mucho.", "hemos aprendido", "habíamos aprendido", "habremos aprendido"),
  f("Cuando despertaste, yo ya ___.", "había desayunado", "he desayunado", "habré desayunado"), f("Mañana a esta hora ya ___ el resultado.", "habrán publicado", "habían publicado", "han publicado"), f("¿Alguna vez ___ al mar?", "has ido", "habías ido", "habrás ido"),
  f("Hoy ___ muy temprano.", "me he levantado", "me había levantado", "me habré levantado"),
];
const PERFECT_FORM: ChoiceItem[] = [
  w("¿Cuál es el participio de «romper»?", "roto", "rompido", "rompiendo"), w("¿Cuál es el participio de «escribir»?", "escrito", "escribido", "escribiendo"), w("¿Cuál es el participio de «comer»?", "comido", "comiendo", "comío"),
  w("¿Cuál es el participio de «volver»?", "vuelto", "volvido", "volviendo"), w("¿Cuál es el participio de «decir»?", "dicho", "decido", "diciendo"), w("¿Cuál es el participio de «cantar»?", "cantado", "cantido", "cantando"),
  w("¿Cuál es el participio de «morir»?", "muerto", "morido", "muriendo"), w("¿Cuál es el participio de «cubrir»?", "cubierto", "cubrido", "cubriendo"), w("¿Cómo se forma «nosotros + haber + salir» en pretérito perfecto?", "hemos salido", "habemos salido", "hemos salir"),
  w("¿Cómo se forma «ellos + haber + ver» en pretérito perfecto?", "han visto", "han veído", "habían ver"),
];

export const ROWS: Row[] = [
  ["LL.1", "Aprender a escribir palabras con prefijos: des-, in-, pre-", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["LL.2", "Aprender a escribir palabras con sufijos: -able, -izo, -miento", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["LL.3", "Escribir palabras con prefijos y sufijos: repaso", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "imposible amable movimiento rojizo invisible lavable prehistoria impaciente nacimiento", "a e i o u b v m n s z")])],
  ["LL.4", "Aprender a escribir palabras frecuentes: grupo 1 (b y v)", (r) => choose(r, WELL, SET_BV)],
  ["LL.5", "Aprender a escribir palabras frecuentes: grupo 2 (h)", (r) => choose(r, WELL, SET_H)],
  ["LL.6", "Escribir palabras frecuentes: grupos 1 y 2", (r) => P2.spellHeard(r, "también había escribir volver nuevo bastante hacer ahora hermano hambre huevo zanahoria", "a e i o u b v h n s")],
  ["LL.7", "Aprender a escribir palabras frecuentes: grupo 3 (g y j)", (r) => choose(r, WELL, SET_GJ)],
  ["LL.8", "Aprender a escribir palabras frecuentes: grupo 4 (c, s y z)", (r) => choose(r, WELL, SET_CSZ)],
  ["LL.9", "Escribir palabras frecuentes: grupos 3 y 4", (r) => P2.spellHeard(r, "gente dijeron recoger viaje página mujer decir entonces empezar conocer cabeza parece", "a e i o u g j c s z")],
  ["LL.10", "Escribir palabras frecuentes: repaso de los grupos 1 a 4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_BV, ...SET_H, ...SET_GJ, ...SET_CSZ]), (q) => P2.spellHeard(q, "también había volver hacer ahora hambre gente viaje mujer decir empezar cabeza", "a e i o u b v h g j c s z")])],

  ["MM.1", "¿La oración es enunciativa, interrogativa, imperativa o exclamativa?", (r) => choose(r, "", SENTENCE_KIND)],
  ["MM.2", "Identificar el sujeto completo de una oración", (r) => choose(r, "", SUBJECT)],
  ["MM.3", "Identificar el predicado completo de una oración", (r) => choose(r, "", PREDICATE)],
  ["MM.4", "Identificar el núcleo del sujeto o del predicado", (r) => choose(r, "", SIMPLE_SP)],
  ["MM.5", "¿Es una oración completa o un fragmento?", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["MM.6", "¿Es una oración completa o son oraciones pegadas?", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["MM.7", "¿Es una oración completa, un fragmento u oraciones pegadas?", (r) => choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],
  ["MM.8", "¿La oración es simple o compuesta?", (r) => choose(r, "", SIMPLE_COMPOUND)],
  ["MM.9", "Crear oraciones compuestas", (r) => choose(r, "", MAKE_COMPOUND)],
  ["MM.10", "Ordenar las palabras para crear una oración", (r) => order(r, "Ordena las palabras para formar una oración.", UNSCRAMBLE)],

  ["NN.1", "¿Qué palabra es un sustantivo?", (r) => choose(r, "", WHICH_NOUN)],
  ["NN.2", "Identificar sustantivos", (r) => pickInSentence(r, "Selecciona los sustantivos de la oración.", NOUNS_IN)],
  ["NN.3", "Identificar sustantivos, incluidos los abstractos", (r) => pickInSentence(r, "Selecciona los sustantivos (también los que nombran ideas o sentimientos).", ABSTRACT_IN)],
  ["NN.4", "Identificar sustantivos comunes y propios", (r) => mix(r, [(q) => pickAll(q, "Selecciona los sustantivos propios.", PROPER, COMMON, "propios"), (q) => pickAll(q, "Selecciona los sustantivos comunes.", COMMON, PROPER, "comunes")])],
  ["NN.5", "Formar plurales regulares con -s, -es y -ces", (r) => choose(r, "", PLURAL_FORM)],
  ["NN.6", "Usar plurales regulares con -s, -es y -ces", (r) => choose(r, "Completa la oración.", PLURAL_USE)],
  ["NN.7", "Formar plurales con -s, -es, -ces, -íes y palabras que no cambian", (r) => choose(r, "", PLURAL_FORM_2)],
  ["NN.8", "Usar plurales con -s, -es, -ces, -íes y palabras que no cambian", (r) => choose(r, "Completa la oración.", PLURAL_USE_2)],
  ["NN.9", "¿El sustantivo está en singular o en plural?", (r) => choose(r, "", SING_PLUR)],
  ["NN.10", "Formar y usar plurales especiales", (r) => choose(r, "Completa con el plural.", IRREGULAR_PLURAL)],
  ["NN.11", "Identificar plurales y frases de pertenencia de uno o de varios dueños", (r) => choose(r, "", POSSESSIVE_ID)],
  ["NN.12", "Formar la frase de pertenencia de uno o de varios dueños", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],
  ["NN.13", "Identificar y corregir errores de plural y de pertenencia", (r) => choose(r, "", POSSESSIVE_ERRORS)],

  ["OO.1", "Identificar pronombres personales", (r) => pickInSentence(r, "Selecciona los pronombres personales.", PRONOUNS_IN)],
  ["OO.2", "Elegir entre pronombres de sujeto y de objeto", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["OO.3", "Reemplazar el sustantivo por un pronombre personal", (r) => choose(r, "", REPLACE)],
  ["OO.4", "Sujetos y complementos compuestos con «yo» y «mí»", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["OO.5", "Identificar pronombres posesivos", (r) => pickInSentence(r, "Selecciona los pronombres posesivos.", POSS_IN)],
  ["OO.6", "Usar pronombres posesivos", (r) => choose(r, "Completa la oración.", POSS_USE)],
  ["OO.7", "Elegir entre pronombres personales y reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["OO.8", "Usar pronombres reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],
  ["OO.9", "Identificar pronombres relativos", (r) => pickInSentence(r, "Selecciona el pronombre o adverbio relativo (une la oración con lo que se dice de alguien o de algo).", REL_IN)],
  ["OO.10", "Usar pronombres relativos: que, quien y quienes", (r) => choose(r, "Completa la oración.", QUE_QUIEN)],
  ["OO.11", "Usar pronombres relativos: que, quien, cuyo, el cual y donde", (r) => choose(r, "Completa la oración.", RELATIVE_USE)],

  ["PP.1", "Usar verbos de acción", (r) => choose(r, "Completa la oración con un verbo.", ACTION_USE)],
  ["PP.2", "Identificar verbos de acción", (r) => pickInSentence(r, "Selecciona los verbos de acción.", ACTION_IN)],
  ["PP.3", "Identificar verbos principales y verbos auxiliares", (r) => choose(r, "", HELPING)],
  ["PP.4", "¿Qué indica el verbo: capacidad, obligación, deseo o costumbre?", (r) => choose(r, "", MODAL_SHOWS)],
  ["PP.5", "Usar el verbo correcto: poder, deber, querer, soler", (r) => choose(r, "Completa la oración.", MODAL_USE)],

  ["QQ.1", "¿El sujeto es singular o plural?", (r) => choose(r, "", SUBJECT_NUMBER)],
  ["QQ.2", "Usar el sujeto o el verbo correcto", (r) => choose(r, "Completa la oración.", SUBJECT_VERB)],
  ["QQ.3", "Concordancia entre pronombre y verbo", (r) => choose(r, "Completa la oración.", PRONOUN_VERB)],
  ["QQ.4", "Usar el sujeto o el verbo correcto, con sujetos compuestos", (r) => choose(r, "Completa la oración.", COMPOUND_SUBJECT)],

  ["RR.1", "¿Qué oración está en pasado (verbos regulares)?", (r) => choose(r, "", PAST_SENTENCE)],
  ["RR.2", "Identificar verbos regulares en pasado", (r) => pickInSentence(r, "Selecciona los verbos en pasado.", PAST_IN)],
  ["RR.3", "Formar y usar el pasado de verbos regulares", (r) => choose(r, "Completa con el verbo en pasado.", PAST_REGULAR)],
  ["RR.4", "Identificar el pasado de verbos irregulares", (r) => choose(r, "", IRREGULAR_ID)],
  ["RR.5", "Formar y usar el pasado de verbos irregulares: grupo 1", fromSet(0)],
  ["RR.6", "Formar y usar el pasado de verbos irregulares: grupo 2", fromSet(1)],
  ["RR.7", "Formar y usar el pasado de verbos irregulares: grupo 3", fromSet(2)],
  ["RR.8", "Formar y usar el pasado de verbos irregulares: grupo 4", fromSet(3)],
  ["RR.9", "Ser y estar: usar la forma correcta", (r) => choose(r, "Completa la oración.", SER_ESTAR)],
  ["RR.10", "Tener y haber: usar la forma correcta", (r) => choose(r, "Completa la oración.", TENER_HABER)],
  ["RR.11", "¿La oración está en pasado, presente o futuro?", (r) => choose(r, "", TENSES)],
  ["RR.12", "Cambiar la oración al futuro", (r) => choose(r, "", TO_FUTURE)],
  ["RR.13", "Usar los tiempos con estar + gerundio", (r) => choose(r, "Completa la oración.", PROGRESSIVE_USE)],
  ["RR.14", "Formar el gerundio para los tiempos con estar", (r) => choose(r, "", PROGRESSIVE_FORM)],
  ["RR.15", "Elegir entre el pasado y el participio", (r) => choose(r, "Completa la oración.", PAST_OR_PARTICIPLE)],
  ["RR.16", "Usar los tiempos compuestos con haber", (r) => choose(r, "Completa la oración.", PERFECT_USE)],
  ["RR.17", "Formar los tiempos compuestos con haber", (r) => choose(r, "", PERFECT_FORM)],
];
