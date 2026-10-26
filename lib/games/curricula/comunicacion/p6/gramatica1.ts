import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, pickAll, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 6.° de Primaria · banco de gramática y ortografía (primera parte): prefijos
// ex-, in-, inter- y sufijos -ecer, -ista; raíces latinas (scrib, tract, fer,
// port, struct); h intermedia, g y j, -ción/-sión/-cción, b y v; proposiciones
// subordinadas; plurales y pertenencia; pronombres y antecedentes, reflexivos
// y enfáticos (yo mismo); verbos copulativos y su atributo.


// --- Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("exportar", "esportar", "exsportar"), spell("extraer", "estraer", "extrahér"), spell("inhalar", "inalar", "imhalar"), spell("intercambio", "intercanbio", "inter cambio"),
  spell("excavar", "escavar", "excabar"), spell("inhábil", "inábil", "inhavil"), spell("interrumpir", "interumpir", "interrunpir"), spell("exhibir", "exibir", "exhivir"),
  spell("inmóvil", "immóvil", "inmóbil"), spell("internacional", "internasional", "inter nacional"), spell("exclamar", "esclamar", "exclamár"), spell("innovar", "inovar", "innobar"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("amanecer", "amaneser", "hamanecer"), spell("periodista", "periodizta", "periodísta"), spell("florecer", "floreser", "floreccer"), spell("artista", "artizta", "hartista"),
  spell("oscurecer", "oscureser", "hoscurecer"), spell("deportista", "deportizta", "deportísta"), spell("agradecer", "agradeser", "hagradecer"), spell("electricista", "electrisista", "eletricista"),
  spell("envejecer", "envegecer", "embejecer"), spell("ciclista", "siclista", "ciclizta"), spell("fortalecer", "fortaleser", "fortalescer"), spell("dentista", "dentizta", "dentísta"),
];
const BASE_1: ChoiceItem[] = [
  spell("describir", "descrivir", "describír"), spell("inscripción", "inscribción", "inscripsión"), spell("manuscrito", "manoescrito", "manuscripto"), spell("atraer", "atraher", "atraér"),
  spell("contracción", "contración", "contracsión"), spell("suscribir", "suscrivir", "subscrivir"), spell("extracto", "estracto", "extrato"), spell("transcripción", "transcribción", "transcripsión"),
  spell("abstracto", "astracto", "abstrato"), spell("prescribir", "prescrivir", "prezcribir"), spell("distraer", "distraher", "diztraer"), spell("escritura", "escriptura", "hescritura"),
];
const BASE_2: ChoiceItem[] = [
  spell("transferir", "transfirir", "tranzferir"), spell("exportación", "esportación", "exportasión"), spell("estructura", "extructura", "estrutura"), spell("preferencia", "preferensia", "prefirencia"),
  spell("soportar", "soportár", "sopportar"), spell("construcción", "construción", "construcsión"), spell("referir", "refirir", "rreferir"), spell("transporte", "trasnporte", "tranzporte"),
  spell("instrucción", "instrución", "instrucsión"), spell("diferente", "diferemte", "difirente"), spell("importar", "inportar", "importár"), spell("destruir", "destruhir", "deztruir"),
];
const SET_H: ChoiceItem[] = [
  spell("vehículo", "veículo", "behículo"), spell("prohibir", "proibir", "prohivir"), spell("ahorro", "aorro", "ahoro"), spell("zanahoria", "zanaoria", "sanahoria"),
  spell("exhausto", "exausto", "exhauzto"), spell("coherente", "coerente", "coherénte"), spell("bahía", "baía", "vahía"), spell("almohada", "almoada", "halmohada"),
  spell("deshacer", "desacer", "deshaser"), spell("rehén", "reén", "rrehén"), spell("anhelo", "anelo", "hanhelo"), spell("adherir", "aderir", "adherír"),
];
const SET_GJ: ChoiceItem[] = [
  spell("escoger", "escojer", "ezcoger"), spell("dirigir", "dirijir", "dirigír"), spell("garaje", "garage", "garáje"), spell("extranjero", "extrangero", "estranjero"),
  spell("crujir", "crugir", "krujir"), spell("exigir", "exijir", "ecsigir"), spell("paisaje", "paisage", "paizaje"), spell("gigante", "jigante", "gigamte"),
  spell("mensajero", "mensagero", "menzajero"), spell("corregir", "correjir", "coregir"), spell("lenguaje", "lenguage", "lemguaje"), spell("tejido", "tegido", "texido"),
];
const SET_CION: ChoiceItem[] = [
  spell("solución", "solusión", "solucción"), spell("decisión", "decición", "desición"), spell("dirección", "direción", "direcsión"), spell("expresión", "expreción", "espresión"),
  spell("atención", "atensión", "atencción"), spell("discusión", "discución", "discussión"), spell("protección", "proteción", "protecsión"), spell("conclusión", "conclución", "concluzión"),
  spell("situación", "situasión", "cituación"), spell("selección", "seleción", "selecsión"), spell("extensión", "extención", "estensión"), spell("traducción", "tradución", "traducsión"),
];
const SET_BV: ChoiceItem[] = [
  spell("posibilidad", "posivilidad", "pocibilidad"), spell("herbívoro", "herbíboro", "erbívoro"), spell("observar", "obserbar", "ovservar"), spell("estuvo", "estubo", "eztuvo"),
  spell("caminaba", "caminava", "kaminaba"), spell("absolver", "absolber", "avsolver"), spell("nuevamente", "nuebamente", "nuevamemte"), spell("responsabilidad", "responsavilidad", "responzabilidad"),
  spell("obtuvo", "obtubo", "optuvo"), spell("advertir", "adbertir", "abvertir"), spell("subrayar", "suvrayar", "subrallar"), spell("evidente", "ebidente", "evidemte"),
];

// --- Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["Los resultados se publicarán el viernes.", "Nadie conoce el origen del incendio.", "Me pregunto si lloverá.", "El museo no abre los lunes."].map((x) => KIND(x, 0)),
  ...["¿Qué evidencia respalda esa afirmación?", "¿Habrá clases mañana?", "¿A quién le entregaste el informe?", "¿Cuál es la tesis del autor?"].map((x) => KIND(x, 1)),
  ...["Cita siempre tus fuentes.", "No interrumpan al expositor.", "Por favor, revisen la bibliografía.", "Compara ambos textos."].map((x) => KIND(x, 2)),
  ...["¡Qué descubrimiento tan asombroso!", "¡Por fin terminamos!", "¡Cuánto ha cambiado la ciudad!", "¡Qué argumento tan débil!"].map((x) => KIND(x, 3)),
];
const SUBJECT_PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el sujeto completo?", "Los primeros habitantes del valle cultivaban algodón.", "Los primeros habitantes del valle", "Los primeros habitantes", "habitantes del valle cultivaban algodón"), pt("¿Cuál es el predicado completo?", "Los primeros habitantes del valle cultivaban algodón.", "cultivaban algodón", "cultivaban", "del valle cultivaban"),
  pt("¿Cuál es el sujeto completo?", "Durante siglos permaneció oculta la ciudadela de piedra.", "la ciudadela de piedra", "Durante siglos", "permaneció oculta la ciudadela"), pt("¿Cuál es el predicado completo?", "La autora de la novela recibió un premio internacional.", "recibió un premio internacional", "recibió un premio", "La autora de la novela recibió un premio"),
  pt("¿Cuál es el sujeto completo?", "A nadie le sorprendió la decisión del jurado.", "la decisión del jurado", "A nadie", "le sorprendió la decisión"), pt("¿Cuál es el predicado completo?", "El informe de los geólogos advierte sobre nuevos deslizamientos.", "advierte sobre nuevos deslizamientos", "advierte", "El informe de los geólogos advierte"),
  pt("¿Cuál es el sujeto completo?", "Me gustan los relatos de misterio.", "los relatos de misterio", "Me", "gustan los relatos de misterio"), pt("¿Cuál es el predicado completo?", "Ningún alumno de la sección B faltó al ensayo.", "faltó al ensayo", "de la sección B faltó", "Ningún alumno faltó"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto?", "Los primeros habitantes del valle cultivaban algodón.", "habitantes", "valle", "primeros"), pt("¿Cuál es el núcleo del predicado?", "Los primeros habitantes del valle cultivaban algodón.", "cultivaban", "algodón", "habitantes"),
  pt("¿Cuál es el núcleo del sujeto?", "La autora de la novela recibió un premio internacional.", "autora", "novela", "premio"), pt("¿Cuál es el núcleo del predicado?", "El informe de los geólogos advierte sobre nuevos deslizamientos.", "advierte", "informe", "deslizamientos"),
  pt("¿Cuál es el núcleo del sujeto?", "Me gustan los relatos de misterio.", "relatos", "misterio", "Me"), pt("¿Cuál es el núcleo del predicado?", "Durante siglos permaneció oculta la ciudadela de piedra.", "permaneció", "ciudadela", "siglos"),
  pt("¿Cuál es el núcleo del sujeto?", "Ningún alumno de la sección B faltó al ensayo.", "alumno", "sección", "ensayo"), pt("¿Cuál es el núcleo del predicado?", "A nadie le sorprendió la decisión del jurado.", "sorprendió", "decisión", "nadie"),
];
const COMPOUND_SP: ChoiceItem[] = [
  pt("¿Cuál es el sujeto compuesto?", "El cóndor y el puma aparecen en muchos mitos andinos.", "El cóndor y el puma", "muchos mitos andinos", "El cóndor"), pt("¿Cuál es el predicado compuesto?", "La científica midió la muestra y anotó los resultados.", "midió la muestra y anotó los resultados", "midió la muestra", "La científica midió la muestra y anotó"),
  pt("¿Cuál es el sujeto compuesto?", "Ni la lluvia ni el frío detuvieron la marcha.", "Ni la lluvia ni el frío", "la marcha", "ni el frío detuvieron la marcha"), pt("¿Cuál es el predicado compuesto?", "Los alumnos leyeron el cuento, lo resumieron y lo comentaron.", "leyeron el cuento, lo resumieron y lo comentaron", "leyeron el cuento", "Los alumnos leyeron el cuento, lo resumieron y"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "Mi madre y mi abuela tejen mantas.", "Sujeto compuesto", "Predicado compuesto", "Ninguno de los dos"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El río creció y arrasó el puente.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El tren de carga llegó con retraso.", "Ninguno de los dos", "Sujeto compuesto", "Predicado compuesto"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "Lima y Arequipa organizaron el festival.", "Sujeto compuesto", "Predicado compuesto", "Ninguno de los dos"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El público aplaudió y pidió otra canción.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"), pt("¿Cuál es el sujeto compuesto?", "Tanto los docentes como los padres asistieron.", "Tanto los docentes como los padres", "los docentes como los padres asistieron", "los docentes"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["La expedición alcanzó la cumbre al amanecer.", "Si llueve, se suspenderá el desfile.", "Nadie esperaba ese resultado.", "Los arqueólogos hallaron una tumba intacta.", "Aunque estaba agotada, siguió corriendo.", "El debate terminó sin acuerdo."];
const FRAGMENT_ITEMS = ["La expedición que alcanzó la cumbre.", "Si llueve durante el desfile.", "Un resultado que nadie esperaba.", "Hallada por los arqueólogos en el desierto.", "Aunque estaba completamente agotada.", "Sin llegar a ningún acuerdo."];
const RUN_ON_ITEMS = ["La expedición alcanzó la cumbre todos celebraron.", "Empezó a llover se suspendió el desfile.", "Nadie lo esperaba el resultado sorprendió.", "Hallaron una tumba la noticia dio la vuelta al mundo.", "Estaba agotada siguió corriendo.", "El debate terminó nadie quedó conforme."];

const CLAUSE = sorter(["Proposición principal", "Proposición subordinada"], "La parte en MAYÚSCULAS, ¿es la proposición principal o la subordinada?");
const CLAUSES: ChoiceItem[] = [
  ...["EL PROYECTO FRACASÓ porque faltó planificación.", "Aunque era tarde, SEGUIMOS TRABAJANDO.", "TE LLAMARÉ cuando llegue a casa.", "Como no había pruebas, EL CASO SE ARCHIVÓ.", "LEÍ EL LIBRO que me recomendaste.", "Si el río crece, EVACUARÁN LA RIBERA."].map((x) => CLAUSE(x, 0)),
  ...["El proyecto fracasó PORQUE FALTÓ PLANIFICACIÓN.", "AUNQUE ERA TARDE, seguimos trabajando.", "Te llamaré CUANDO LLEGUE A CASA.", "COMO NO HABÍA PRUEBAS, el caso se archivó.", "Leí el libro QUE ME RECOMENDASTE.", "SI EL RÍO CRECE, evacuarán la ribera."].map((x) => CLAUSE(x, 1)),
];
const SCC = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada"], "¿Cómo es la oración?");
const SIMPLE_COMPOUND_COMPLEX: ChoiceItem[] = [
  ...["Los glaciares de la cordillera retroceden cada año.", "El autor y su editora presentaron la novela.", "En la plaza principal hubo un concierto.", "La expedición alcanzó la cumbre al amanecer.", "Mañana rendiremos el examen de ciencias."].map((x) => SCC(x, 0)),
  ...["Los glaciares retroceden y los ríos pierden caudal.", "Presentó la novela, pero no firmó ejemplares.", "¿Vamos al concierto o nos quedamos?", "No estudió ni entregó el trabajo.", "Llegaron temprano, mas no había nadie."].map((x) => SCC(x, 1)),
  ...["Los ríos pierden caudal porque los glaciares retroceden.", "Aunque presentó la novela, no firmó ejemplares.", "Iremos al concierto si conseguimos entradas.", "El alumno que no estudió desaprobó.", "Cuando llegaron, no había nadie."].map((x) => SCC(x, 2)),
];

// --- Sustantivos ---------------------------------------------------------

const PROPER = ["Caral", "Ucayali", "Vallejo", "Amazonía", "Neptuno", "Atlántico", "Tacna", "Huáscar", "Europa", "Quijote"];
const COMMON = ["ciudadela", "afluente", "poeta", "selva", "planeta", "océano", "frontera", "monitor", "continente", "caballero"];
const PLURAL_FORM: ChoiceItem[] = [
  w("¿Cuál es el plural de «matiz»?", "matices", "matizes", "matises"), w("¿Cuál es el plural de «virrey»?", "virreyes", "virreys", "virreies"), w("¿Cuál es el plural de «esquí»?", "esquís", "esquises", "esquíces"),
  w("¿Cuál es el plural de «cicatriz»?", "cicatrices", "cicatrizes", "cicatrises"), w("¿Cuál es el plural de «menú»?", "menús", "menuses", "menúces"), w("¿Cuál es el plural de «aprendiz»?", "aprendices", "aprendizes", "aprendises"),
  w("¿Cuál es el plural de «ley»?", "leyes", "leys", "leies"), w("¿Cuál es el plural de «tabú»?", "tabúes", "tabuses", "tabuces"), w("¿Cuál es el plural de «codorniz»?", "codornices", "codornizes", "codornises"),
  w("¿Cuál es el plural de «jabalí»?", "jabalíes", "jabalises", "jabalices"),
];
const PLURAL_USE: ChoiceItem[] = [
  f("El cuadro tiene muchos ___ de azul.", "matices", "matizes", "matiz"), f("Las ___ del accidente ya sanaron.", "cicatrices", "cicatrizes", "cicatriz"), f("Los ___ del taller aprenden rápido.", "aprendices", "aprendizes", "aprendiz"),
  f("Los restaurantes cambiaron sus ___.", "menús", "menuses", "menú"), f("En el corral hay doce ___.", "codornices", "codornizes", "codorniz"), f("Los ___ escaparon hacia el bosque.", "jabalíes", "jabalises", "jabalí"),
  f("Las nuevas ___ protegen los bosques.", "leyes", "leys", "ley"), f("Los ___ gobernaron el Perú durante la Colonia.", "virreyes", "virreys", "virrey"), f("Cada sociedad tiene sus propios ___.", "tabúes", "tabuses", "tabú"),
  f("Alquilamos dos pares de ___.", "esquís", "esquises", "esquí"),
];
const PLURAL_REVIEW: ChoiceItem[] = [
  w("¿Cuál es el plural de «régimen»?", "regímenes", "régimenes", "regimens"), w("¿Cuál es el plural de «la tesis»?", "las tesis", "las tesises", "las teses"), w("¿Cuál es el plural de «espécimen»?", "especímenes", "espécimenes", "especimens"),
  w("¿Cuál es el plural de «el lunes»?", "los lunes", "los luneses", "los lun"), w("¿Cuál es el plural de «álbum»?", "álbumes", "álbums", "albumes"), w("¿Cuál es el plural de «origen»?", "orígenes", "origenes", "orígens"),
  w("¿Cuál es el plural de «la crisis»?", "las crisis", "las crisises", "las crises"), w("¿Cuál es el plural de «volumen»?", "volúmenes", "volumenes", "volúmens"), w("¿Cuál es el plural de «el tórax»?", "los tórax", "los tóraxes", "los tóraces"),
  w("¿Cuál es el plural de «club»?", "clubes", "clubses", "cluves"),
];
const PLURAL_REVIEW_USE: ChoiceItem[] = [
  f("La enciclopedia tiene doce ___.", "volúmenes", "volumenes", "volumen"), f("Los dos ___ de fotos están en el estante.", "álbumes", "álbums", "álbum"), f("El museo exhibe ___ de mariposas.", "especímenes", "espécimenes", "espécimen"),
  f("Las ___ económicas afectan a todos.", "crisis", "crisises", "crises"), f("Los dos ___ jugarán la final.", "clubes", "clubses", "club"), f("Estudiamos los ___ de la escritura.", "orígenes", "origenes", "origen"),
  f("Tres alumnas sustentaron sus ___.", "tesis", "tesises", "teses"), f("Algunos ___ políticos limitan la prensa.", "regímenes", "régimenes", "régimen"), f("Todos los ___ hay asamblea.", "lunes", "luneses", "lun"),
  f("El pintor usó ___ muy sutiles.", "matices", "matizes", "matiz"),
];
const OWN = sorter(["Plural (más de uno, sin dueño)", "Pertenece a uno solo", "Pertenece a varios"], "¿Qué indican las palabras destacadas?");
const POSSESSIVE_ID: ChoiceItem[] = [
  ...["LOS POETAS leyeron en la plaza.", "LAS CIENTÍFICAS publicaron el estudio.", "LOS JUECES deliberaron dos horas.", "LAS AUTORAS firmaron ejemplares."].map((x) => OWN(x, 0)),
  ...["Los versos DEL POETA conmovieron al público.", "El hallazgo DE LA CIENTÍFICA fue noticia.", "El fallo DEL JUEZ sorprendió.", "La novela DE LA AUTORA ganó un premio."].map((x) => OWN(x, 1)),
  ...["Los versos DE LOS POETAS conmovieron al público.", "Los hallazgos DE LAS CIENTÍFICAS fueron noticia.", "Los fallos DE LOS JUECES sorprendieron.", "Las novelas DE LAS AUTORAS ganaron premios."].map((x) => OWN(x, 2)),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  f("la opinión ___ jueces", "de los", "del", "de la"), f("el caudal ___ río", "del", "de la", "de los"), f("los derechos ___ autora", "de la", "del", "de las"),
  f("la superficie ___ agua", "del", "de la", "de los"), f("las conclusiones ___ investigadoras", "de las", "del", "de los"), f("el vuelo ___ aves", "de las", "del", "de la"),
  f("la sede ___ club", "del", "de la", "de las"), f("el resultado ___ análisis", "de los", "de las", "de la"), f("el centro ___ área", "del", "de la", "de las"),
  f("las tradiciones ___ región", "de la", "del", "de los"),
];
const FIX = "¿Cómo se corrige el error?";
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt(FIX, "Los matizes de el cuadro son sutiles.", "Los matices del cuadro son sutiles.", "Los matizes del cuadro son sutiles.", "Los matices de el cuadro son sutiles."), pt(FIX, "La superficie de la agua brillaba.", "La superficie del agua brillaba.", "La superficie de el agua brillaba.", "La superficie de las agua brillaba."),
  pt(FIX, "Las ley de los país cambian.", "Las leyes de los países cambian.", "Las leyes de los país cambian.", "Las ley de los países cambian."), pt(FIX, "El fallo de los juez fue unánime.", "El fallo de los jueces fue unánime.", "El fallo del jueces fue unánime.", "El fallo de los juezes fue unánime."),
  pt(FIX, "Los regimenes de esa época eran duros.", "Los regímenes de esa época eran duros.", "Los régimenes de esa época eran duros.", "Los regimens de esa época eran duros."), pt(FIX, "Las crisises de el siglo pasado fueron graves.", "Las crisis del siglo pasado fueron graves.", "Las crisises del siglo pasado fueron graves.", "Las crisis de el siglo pasado fueron graves."),
  pt(FIX, "El centro de la área está marcado.", "El centro del área está marcado.", "El centro de el área está marcado.", "El centro de las área está marcado."), pt(FIX, "Los álbums de las autora son valiosos.", "Los álbumes de las autoras son valiosos.", "Los álbumes de las autora son valiosos.", "Los álbums de las autoras son valiosos."),
];

// --- Pronombres y antecedentes -------------------------------------------

const ANTE = "¿A quién o a qué se refiere el pronombre destacado?";
const ANTECEDENTS: ChoiceItem[] = [
  pt(ANTE, "Carla perdió su cuaderno, pero LO encontró en la biblioteca.", "El cuaderno", "Carla", "La biblioteca"), pt(ANTE, "Los alumnos entregaron el informe y la profesora LOS felicitó.", "Los alumnos", "El informe", "La profesora"),
  pt(ANTE, "Cuando Mateo vio a su hermana, LE dio un abrazo.", "Su hermana", "Mateo", "El abrazo"), pt(ANTE, "La ciudad es antigua; ELLA guarda muchas historias.", "La ciudad", "Las historias", "La antigüedad"),
  pt(ANTE, "Compré dos libros y LOS leí en una semana.", "Los dos libros", "La semana", "El comprador"), pt(ANTE, "La directora llamó a los padres para informarLES del paseo.", "Los padres", "La directora", "El paseo"),
  pt(ANTE, "Las autoras presentaron la novela; ELLAS respondieron preguntas.", "Las autoras", "Las preguntas", "La novela"), pt(ANTE, "Llamé a mis abuelos y LES conté la noticia.", "Mis abuelos", "La noticia", "Yo"),
  pt(ANTE, "La carta llegó tarde; nadie LA esperaba ya.", "La carta", "La tarde", "Nadie"), pt(ANTE, "Pedro y yo estudiamos; NOSOTROS aprobamos.", "Pedro y yo", "Los estudios", "El examen"),
];
const AGREE: ChoiceItem[] = [
  f("Las alumnas terminaron y la profesora ___ felicitó.", "las", "los", "la"), f("El informe es largo; ___ leeremos con calma.", "lo", "la", "los"), f("Mis primos llegaron y ___ serví limonada.", "les", "le", "las"),
  f("La decisión es difícil; ___ pensaremos bien.", "la", "lo", "las"), f("Los datos son claros: ___ analizaremos mañana.", "los", "las", "lo"), f("A María ___ regalaron un libro.", "le", "les", "la"),
  f("Las fuentes son confiables; ___ citaremos siempre.", "las", "los", "la"), f("Cada alumna trajo ___ propio proyecto.", "su", "sus", "suyo"),
  f("Los niños y las niñas guardaron ___ mochilas.", "sus", "su", "suyas"),
];
const VAGUE = "¿Qué oración tiene un pronombre de referencia ambigua (no queda claro a quién se refiere)?";
const VAGUE_REF: ChoiceItem[] = [
  w(VAGUE, "Ana le dijo a Rosa que ella había ganado.", "Ana le dijo a Rosa: «Tú has ganado».", "Ana ganó y se lo contó a Rosa."), w(VAGUE, "Cuando Luis saludó a Pedro, él estaba nervioso.", "Luis estaba nervioso cuando saludó a Pedro.", "Pedro estaba nervioso cuando Luis lo saludó."),
  w(VAGUE, "El perro persiguió al gato hasta que se cansó.", "El perro persiguió al gato hasta cansarse.", "El gato se cansó de huir del perro."), w(VAGUE, "Mi tía llamó a mi mamá cuando estaba cocinando.", "Mi tía, mientras cocinaba, llamó a mi mamá.", "Mi mamá cocinaba cuando mi tía la llamó."),
  w(VAGUE, "Saqué el cuaderno del estuche y lo limpié.", "Saqué el cuaderno del estuche y limpié el cuaderno.", "Limpié el estuche después de sacar el cuaderno."), w(VAGUE, "El profesor habló con el alumno sobre su trabajo.", "El profesor comentó con el alumno el trabajo de este.", "El profesor habló de su propio trabajo con el alumno."),
  w(VAGUE, "Diego le prestó a Raúl su bicicleta.", "Diego le prestó a Raúl la bicicleta de Diego.", "Raúl usó la bicicleta que Diego le prestó."), w(VAGUE, "En el informe dicen que subirán los precios.", "El informe del ministerio señala que subirán los precios.", "Según el ministerio, subirán los precios."),
];
const ALL_ANTE = "¿Quién puede ser el antecedente del pronombre destacado?";
const ALL_ANTECEDENTS: ChoiceItem[] = [
  pt(ALL_ANTE, "Sofía le contó a Elena que ELLA había aprobado.", "Sofía o Elena", "Solo Sofía, por ser el sujeto", "Solo Elena"), pt(ALL_ANTE, "El médico atendió al paciente cuando ÉL llegó.", "El médico o el paciente", "Solo el médico", "Solo el paciente, por estar más cerca"),
  pt(ALL_ANTE, "Marta abrazó a Lucía; ELLA estaba feliz.", "Marta o Lucía", "Solo Marta, por ser el sujeto", "Solo Lucía"), pt(ALL_ANTE, "Jorge vio a Iván con SU perro.", "Jorge o Iván", "Solo Jorge", "Solo Iván, por estar más cerca"),
  pt(ALL_ANTE, "Rosa saludó a su prima; luego ELLA se fue.", "Rosa o su prima", "Solo Rosa, por ser el sujeto", "Solo la prima"), pt(ALL_ANTE, "Carlos compró una torta y SE la comió.", "Solo Carlos", "Carlos o la torta", "Solo la torta"),
  pt(ALL_ANTE, "La niña miró la luna y LA dibujó.", "Solo la luna", "La niña o la luna", "Solo la niña"), pt(ALL_ANTE, "El entrenador habló con el capitán antes de que ÉL saliera.", "El entrenador o el capitán", "Solo el entrenador", "Solo el capitán, por estar más cerca"),
];
const SHIFT = "¿Qué oración mantiene bien la persona y el número del pronombre?";
const PRONOUN_SHIFTS: ChoiceItem[] = [
  w(SHIFT, "Si uno estudia, uno aprende.", "Si uno estudia, tú aprendes.", "Si uno estudia, aprendemos ellos."), w(SHIFT, "Cuando viajamos, conocemos lugares nuevos.", "Cuando viajamos, uno conoces lugares nuevos.", "Cuando viajamos, tú conocen lugares nuevos."),
  w(SHIFT, "Cada alumno debe traer su cuaderno.", "Cada alumno deben traer sus cuadernos de ellos.", "Cada alumno debe traer nuestro cuaderno."), w(SHIFT, "Los alumnos deben cuidar sus útiles.", "Los alumnos deben cuidar tu útiles.", "Los alumnos debe cuidar su útiles."),
  w(SHIFT, "Si tú lees a diario, mejoras tu vocabulario.", "Si tú lees a diario, uno mejora su vocabulario.", "Si tú lees a diario, mejoramos su vocabulario."), w(SHIFT, "Nosotros llegamos temprano y nos sentamos adelante.", "Nosotros llegamos temprano y se sentaron adelante.", "Nosotros llegamos temprano y te sientas adelante."),
  w(SHIFT, "Quien quiera participar debe inscribirse.", "Quien quiera participar deben inscribirnos.", "Quien quiera participar debes inscribirte."), w(SHIFT, "Me gusta leer porque aprendo mucho.", "Me gusta leer porque aprendes mucho.", "Me gusta leer porque uno aprenden mucho."),
];

// --- Tipos de pronombres -------------------------------------------------

const SUBJ_OBJ: ChoiceItem[] = [
  f("___ propusimos el tema del debate.", "Nosotros", "Nos", "A nosotros"), f("El comité ___ eligió a ella como delegada.", "la", "ella", "le"), f("A los finalistas ___ entregaron un diploma.", "les", "los", "ellos"),
  f("Entre ___ y yo resolvimos el problema.", "tú", "ti", "te"), f("Esta carta es para ___.", "ti", "tú", "te"), f("A mi abuela ___ visito cada domingo.", "la", "le", "ella"),
  f("___ sabes más que yo.", "Tú", "Ti", "Te"), f("El guía ___ explicó la historia a nosotros.", "nos", "nosotros", "los"), f("A Luis ___ vi en el estadio.", "lo", "él", "le"),
  f("Según ___, la respuesta es correcta.", "ella", "la", "le"),
];
const I_AND_ME: ChoiceItem[] = [
  f("Mi equipo y ___ presentaremos mañana.", "yo", "mí", "me"), f("El jurado nos eligió a Rosa y a ___.", "mí", "yo", "me"), f("Entre mi hermano y ___ pintamos el cuarto.", "yo", "mí", "me"),
  f("Trajeron un regalo para ti y para ___.", "mí", "yo", "me"), f("Mis padres y ___ viajaremos en julio.", "yo", "mí", "me"), f("Excepto ___, todos sabían la noticia.", "yo", "mí", "me"),
  f("Se rieron de Diego y de ___.", "mí", "yo", "me"), f("Incluso ___ me equivoqué.", "yo", "mí", "me"), f("La carta iba dirigida a mi madre y a ___.", "mí", "yo", "me"),
  f("¿Quieres estudiar ___ esta tarde?", "conmigo", "con yo", "con mí"),
];
const COMPOUND_PRONOUNS: ChoiceItem[] = [
  f("Tú y él ___ los encargados.", "son", "es", "somos"), f("Ella y yo ___ el informe.", "redactamos", "redactan", "redactó"), f("Ustedes y ellos ___ al mismo grupo.", "pertenecen", "pertenecemos", "pertenece"),
  f("El premio fue para ___.", "ti y para mí", "tú y yo", "ti y yo"), f("Nos eligieron a ___.", "él y a mí", "él y yo", "le y me"), f("Ni tú ni yo ___ la respuesta.", "sabíamos", "sabían", "sabías"),
  f("Ella y tú ___ la exposición.", "prepararán", "prepararemos", "preparará"), f("Hablaron de ___.", "ti y de ella", "tú y ella", "te y la"), f("Él, tú y yo ___ un equipo.", "formamos", "forman", "formas"),
  w("¿Qué orden es más cortés?", "Tú, ella y yo iremos.", "Yo, tú y ella iremos.", "Yo y ustedes iremos."),
];
const POSS_USE: ChoiceItem[] = [
  f("Esta propuesta la escribimos nosotros: es ___.", "nuestra", "nuestro", "suya"), f("Tu argumento es sólido; el ___ necesita más pruebas, admití.", "mío", "mía", "tuyo"), f("Estas notas son de Elena: son ___.", "suyas", "suyos", "mías"),
  f("Ya entregué mi resumen. ¿Entregaste el ___?", "tuyo", "tuya", "suyos"), f("Los errores fueron de ustedes: son ___.", "suyos", "suyas", "nuestros"), f("Esa idea no es de ella, es ___, dije.", "mía", "mío", "suya"),
  f("Nuestras fuentes son tres; las ___, ¿cuántas son?", "tuyas", "tuyos", "tuya"), f("El mérito es de todo el equipo: es ___.", "nuestro", "nuestra", "mío"), f("¿Este cuaderno es ___? Lleva tu nombre.", "tuyo", "tuya", "mío"),
  f("Los abuelos defendieron sus tierras porque eran ___.", "suyas", "suyos", "nuestras"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Yo ___ preparé para el debate.", "me", "yo", "mí"), f("La autora ___ inspiró en su infancia.", "se", "ella", "la"), f("Nosotros ___ organizamos en grupos.", "nos", "nosotros", "los"),
  f("Tú ___ comprometiste a venir.", "te", "tú", "ti"), f("Los alumnos ___ esforzaron mucho.", "se", "ellos", "los"), f("Ustedes ___ equivocaron de fecha.", "se", "ustedes", "les"),
  f("Yo ___ arrepentí de no haber estudiado.", "me", "se", "yo"), f("El público ___ puso de pie.", "se", "él", "lo"), f("Tú ___ acostumbrarás pronto.", "te", "tú", "se"),
  f("Nosotras ___ dimos cuenta del error.", "nos", "nosotras", "se"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Me exijo a mí ___, dijo Laura.", "misma", "mismo", "mismas"), f("Los científicos se corrigen a sí ___.", "mismos", "mismo", "mismas"), f("Conócete a ti ___, Andrés.", "mismo", "misma", "mismos"),
  f("La escritora se cita a sí ___.", "misma", "mismo", "mismas"), f("Nos evaluamos a nosotros ___.", "mismos", "mismo", "misma"), f("El anciano se bastaba a sí ___.", "mismo", "misma", "mismos"),
  f("Las atletas se superaron a sí ___.", "mismas", "mismos", "misma"), f("Ustedes se perjudican a sí ___.", "mismos", "mismo", "misma"), f("Yo me dije a mí ___: «Calma», contó Pedro.", "mismo", "misma", "mismos"),
  f("Ella habla consigo ___.", "misma", "mismo", "mismas"),
];
const RI = sorter(["Reflexivo (la acción recae sobre quien la hace)", "Enfático (solo refuerza al sujeto)"], "El pronombre destacado, ¿es reflexivo o enfático?");
const REFLEXIVE_INTENSIVE: ChoiceItem[] = [
  ...["Yo ME lavé las manos.", "Ella SE peinó frente al espejo.", "Nos preguntamos a NOSOTROS MISMOS qué hacer.", "El gato SE lamió la pata.", "Te cortaste a TI MISMO sin querer.", "Los niños SE vistieron solos."].map((x) => RI(x, 0)),
  ...["Yo MISMO preparé la cena.", "La directora MISMA nos recibió.", "Ellos MISMOS construyeron la casa.", "Tú MISMA lo dijiste ayer.", "El alcalde MISMO firmó la carta.", "Nosotras MISMAS pintamos el mural."].map((x) => RI(x, 1)),
];
const REL_IN = [
  s("El estudio que citamos es reciente.", "que"), s("La persona a quien entrevisté es bióloga.", "quien"), s("Ese es el valle donde nació el poeta.", "donde"), s("El autor cuyas obras leímos visitará la escuela.", "cuyas"),
  s("Las causas por las cuales fracasó son varias.", "cuales"), s("Quien investiga encuentra.", "Quien"), s("Recuerdo el día cuando nos conocimos.", "cuando"), s("Los datos que presentó eran falsos.", "que"),
];
const QUE_QUIEN: ChoiceItem[] = [
  f("La investigadora ___ dirigió el estudio es peruana.", "que", "quienes", "cuya"), f("El testigo a ___ interrogaron dijo la verdad.", "quien", "quienes", "cuyo"), f("Los vecinos con ___ hablamos apoyan el proyecto.", "quienes", "quien", "cuyos"),
  f("Fue Micaela Bastidas ___ organizó los envíos.", "quien", "quienes", "cuya"), f("El artículo ___ leíste es de opinión.", "que", "quien", "cuyo"), f("Las autoras de ___ te hablé vendrán.", "quienes", "quien", "cuyas"),
  f("___ tengan dudas pueden preguntar.", "Quienes", "Quien", "Cuyos"), f("El alumno ___ ganó el concurso es de sexto.", "que", "quienes", "cuyo"), f("La doctora a ___ acudimos nos atendió bien.", "quien", "quienes", "cuya"),
  f("El mapa ___ usamos estaba desactualizado.", "que", "quien", "cuyo"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("El río ___ aguas bajan turbias está contaminado.", "cuyas", "que", "quien"), f("La época en la ___ vivió fue difícil.", "cual", "quien", "cuya"), f("La escuela ___ estudié cumple cien años.", "donde", "cuya", "quien"),
  f("El científico ___ teoría cambió la física era alemán.", "cuya", "que", "donde"), f("Es la razón por la ___ renunció.", "cual", "cuya", "donde"), f("El libro ___ me recomendaste es excelente.", "que", "quien", "cuyo"),
  f("Los pueblos ___ lenguas desaparecen pierden su memoria.", "cuyas", "que", "quienes"), f("El momento ___ todo cambió fue aquel.", "cuando", "donde", "cuyo"), f("La colega con ___ trabajo es muy responsable.", "quien", "cuya", "donde"),
  f("Los argumentos con los ___ defendió su tesis eran sólidos.", "cuales", "cual", "quienes"),
];

// --- Tipos de verbos -----------------------------------------------------

const HELPING: ChoiceItem[] = [
  pt("¿Cuál es el verbo auxiliar?", "Los resultados han sido publicados.", "han sido", "publicados", "resultados"), pt("¿Cuál es el verbo principal?", "Los resultados han sido publicados.", "publicados", "han", "sido"),
  pt("¿Cuál es el verbo auxiliar?", "Estaremos esperando tu llamada.", "Estaremos", "esperando", "llamada"), pt("¿Cuál es el verbo principal?", "Deberías revisar las fuentes.", "revisar", "Deberías", "fuentes"),
  pt("¿Cuál es el verbo auxiliar?", "La ley fue aprobada ayer.", "fue", "aprobada", "ayer"), pt("¿Cuál es el verbo principal?", "Habíamos terminado antes del mediodía.", "terminado", "Habíamos", "antes"),
  pt("¿Cuál es el verbo auxiliar?", "Voy a exponer mañana.", "Voy", "exponer", "mañana"), pt("¿Cuál es el verbo principal?", "Puede haber ocurrido un error.", "ocurrido", "Puede", "haber"),
  pt("¿Cuál es el verbo auxiliar?", "Sigue lloviendo en la sierra.", "Sigue", "lloviendo", "sierra"), pt("¿Cuál es el verbo principal?", "Tuvieron que evacuar el edificio.", "evacuar", "Tuvieron", "edificio"),
];
const TI = sorter(["Transitivo (tiene objeto directo)", "Intransitivo (no tiene objeto directo)"], "El verbo destacado, ¿es transitivo o intransitivo en la oración?");
const TRANSITIVE: ChoiceItem[] = [
  ...["La científica ANALIZÓ las muestras.", "El alcalde INAUGURÓ el puente.", "Los alumnos LEYERON la novela.", "Mi abuela TEJE una manta.", "El viento DERRIBÓ el árbol.", "Ya ENTREGUÉ el informe."].map((x) => TI(x, 0)),
  ...["El bebé DUERME profundamente.", "Los pájaros VUELAN hacia el sur.", "El público RIO a carcajadas.", "El tren LLEGÓ con retraso.", "La planta CRECIÓ rápido.", "Mi abuelo NACIÓ en Jauja."].map((x) => TI(x, 1)),
];
const LINKING: ChoiceItem[] = [
  pt("¿Cuál es el verbo copulativo?", "La laguna parece un espejo.", "parece", "laguna", "espejo"), pt("¿Cuál es el atributo (lo que se dice del sujeto)?", "La laguna parece un espejo.", "un espejo", "La laguna", "parece"),
  pt("¿Cuál es el verbo copulativo?", "Los alumnos están cansados.", "están", "cansados", "alumnos"), pt("¿Cuál es el atributo?", "Los alumnos están cansados.", "cansados", "Los alumnos", "están"),
  pt("¿Cuál es el atributo?", "Mi madre es ingeniera.", "ingeniera", "Mi madre", "es"), pt("El atributo de «El cielo estaba gris», ¿es un adjetivo o un sustantivo?", "El cielo estaba gris.", "Adjetivo", "Sustantivo", "Verbo"),
  pt("El atributo de «Vallejo fue poeta», ¿es un adjetivo o un sustantivo?", "Vallejo fue poeta.", "Sustantivo", "Adjetivo", "Adverbio"), w("¿Qué oración tiene un verbo copulativo?", "El examen resultó difícil.", "El examen empezó a las ocho.", "Rendimos el examen ayer."),
  w("¿Qué oración tiene un verbo copulativo?", "La sopa está fría.", "Tomé la sopa con pan.", "Sirvieron la sopa tarde."), pt("¿Cuál es el atributo?", "El viaje resultó agotador.", "agotador", "El viaje", "resultó"),
];
const MODAL = sorter(["Capacidad", "Permiso", "Obligación", "Posibilidad", "Consejo"], "¿Qué indica el verbo destacado?");
const MODAL_SHOWS: ChoiceItem[] = [
  ...["Esta máquina PUEDE levantar dos toneladas.", "Mi prima SABE programar.", "Ya PUEDO leer en inglés."].map((x) => MODAL(x, 0)),
  ...["¿PUEDO consultar mis apuntes?", "PUEDEN salir cuando terminen.", "¿PODEMOS usar el laboratorio?"].map((x) => MODAL(x, 1)),
  ...["DEBES citar tus fuentes.", "TENEMOS QUE entregar hoy.", "HAY QUE respetar los turnos."].map((x) => MODAL(x, 2)),
  ...["PUEDE QUE el bus llegue tarde.", "DEBE DE haber un error.", "PODRÍA llover esta noche."].map((x) => MODAL(x, 3)),
  ...["DEBERÍAS dormir más.", "CONVENDRÍA revisar el texto.", "DEBERÍAMOS salir temprano."].map((x) => MODAL(x, 4)),
];
const MODAL_USE: ChoiceItem[] = [
  f("Para aprobar, ___ entregar todos los trabajos.", "debes", "sueles", "quiero"), f("Estás pálido; ___ ir al médico.", "deberías", "solías", "quise"), f("No contestan; ___ estar de viaje.", "deben de", "suelo", "quiero"),
  f("¿___ repetir la consigna, por favor?", "Podría", "Solía", "Debo"), f("En el museo ___ guardar silencio.", "hay que", "suelen", "quiero"), f("___ que mañana haya paro de transporte.", "Puede", "Suele", "Debo"),
  f("Con práctica, cualquiera ___ aprender a tocar.", "puede", "debes", "quieren"), f("De niño ___ pasar los veranos en Huanta.", "solía", "debes", "pueden"), f("Si quieres opinar, ___ informarte antes.", "tienes que", "sueles", "puedo"),
  f("¿___ pasar, profesora?", "Podemos", "Solemos", "Debes"),
];

// --- Concordancia --------------------------------------------------------

const SUBJECT_VERB: ChoiceItem[] = [
  f("La mayoría de los estudiantes ___ a favor.", "votó", "votamos", "votaste"), f("Ninguno de los informes ___ completo.", "estaba", "estabas", "estábamos"), f("El conjunto de normas ___ ayer.", "cambió", "cambiaste", "cambiamos"),
  f("___ exigen una respuesta.", "Los vecinos", "El vecino", "Un vecino"), f("Cada uno de los participantes ___ un certificado.", "recibirá", "recibirán", "recibiremos"), f("La lista de invitados ___ en la mesa.", "está", "estás", "estamos"),
  f("___ contiene tres capítulos.", "El libro", "Los libros", "Unos libros"), f("Una serie de errores ___ el proyecto.", "arruinó", "arruinaste", "arruinamos"), f("El público ___ de pie.", "aplaudió", "aplaudieron", "aplaudimos"),
  f("Todos los miembros del jurado ___ de acuerdo.", "estaban", "estaba", "estabas"),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  f("La lectura y la escritura ___ de la mano.", "van", "va", "vamos"), f("Tú y tu equipo ___ primero.", "expondrán", "expondremos", "expondrás"), f("Mi hermano y yo ___ el desayuno.", "preparamos", "preparan", "prepara"),
  f("Ni el calor ni la sed ___ a los caminantes.", "vencieron", "venció", "vencimos"), f("El director y la subdirectora ___ el acta.", "firmaron", "firmó", "firmamos"), f("Tanto el cuento como el poema ___ del mar.", "hablan", "habla", "hablamos"),
  f("El lápiz, la regla y el compás ___ en la cartuchera.", "están", "está", "estamos"), f("Comer bien y dormir lo suficiente ___ la salud.", "favorecen", "favorece", "favorecemos"), f("Ella y sus primas ___ mañana.", "llegarán", "llegará", "llegaremos"),
  f("El autor y su traductor ___ en la feria.", "estuvieron", "estuvo", "estuvimos"),
];

// --- Tiempos verbales ----------------------------------------------------

const PAST_IRREGULAR: ChoiceItem[] = [
  f("Los expedicionarios ___ (andar) tres días.", "anduvieron", "andaron", "anduvimos"), f("El equipaje no ___ (caber) en la maletera.", "cupo", "cabió", "cupe"), f("La intérprete ___ (traducir) el discurso.", "tradujo", "traducio", "traduje"),
  f("Yo ___ (deducir) la respuesta.", "deduje", "deducí", "dedujo"), f("Ellos ___ (prever) la tormenta.", "previeron", "preveyeron", "previmos"), f("El público ___ (reír) a carcajadas.", "rio", "reyó", "ríe"),
  f("Nosotros ___ (satisfacer) todos los requisitos.", "satisficimos", "satisfacimos", "satisficieron"), f("Tú ___ (proponer) una solución.", "propusiste", "proponiste", "propuso"), f("Los testigos ___ (contradecir) la versión.", "contradijeron", "contradecieron", "contradijimos"),
  f("El ladrón ___ (huir) por el techo.", "huyó", "huió", "huí"), f("Yo ___ (obtener) la mejor nota.", "obtuve", "obtení", "obtuvo"), f("Ustedes ___ (intervenir) a tiempo.", "intervinieron", "intervenieron", "intervinimos"),
];
const THREE_TENSES: ChoiceItem[] = [
  f("El próximo año nosotros ___ (empezar) la secundaria.", "empezaremos", "empezamos", "empezábamos"), f("Ahora mismo el jurado ___ (deliberar).", "delibera", "deliberó", "deliberará"), f("En 1821 San Martín ___ (proclamar) la Independencia.", "proclamó", "proclama", "proclamará"),
  f("Cada mañana el panadero ___ (abrir) a las seis.", "abre", "abrió", "abrirá"), f("Mañana tú ___ (saber) el resultado.", "sabrás", "supiste", "sabes"), f("Ayer ellos ___ (traer) las pruebas.", "trajeron", "traen", "traerán"),
  f("Dentro de un siglo la ciudad ___ (ser) distinta.", "será", "fue", "es"), f("Anoche yo ___ (dormir) muy poco.", "dormí", "duermo", "dormiré"), f("En este momento ustedes ___ (tener) la palabra.", "tienen", "tuvieron", "tendrán"),
  f("Pasado mañana ella ___ (venir) a visitarnos.", "vendrá", "vino", "viene"),
];
const SHIFT_T = "¿Qué oración mantiene bien el tiempo verbal?";
const TENSE_SHIFTS: ChoiceItem[] = [
  w(SHIFT_T, "El autor nació en 1892 y publicó su primer libro en 1918.", "El autor nació en 1892 y publica su primer libro en 1918.", "El autor nace en 1892 y publicó su primer libro en 1918."), w(SHIFT_T, "Cuando sonó la alarma, todos evacuaron.", "Cuando sonó la alarma, todos evacúan.", "Cuando suena la alarma, todos evacuaron."),
  w(SHIFT_T, "El narrador describe el pueblo y luego presenta al protagonista.", "El narrador describe el pueblo y luego presentó al protagonista.", "El narrador describió el pueblo y luego presenta al protagonista."), w(SHIFT_T, "Si entrenamos, ganaremos el torneo.", "Si entrenamos, ganábamos el torneo.", "Si entrenábamos, ganaremos el torneo."),
  w(SHIFT_T, "Subió al escenario, tomó el micrófono y cantó.", "Subió al escenario, toma el micrófono y cantó.", "Sube al escenario, tomó el micrófono y canta."), w(SHIFT_T, "Mientras leía, tomaba apuntes.", "Mientras leía, toma apuntes.", "Mientras lee, tomaba apuntes."),
  pt("¿Cómo se corrige el cambio indebido de tiempo?", "La expedición partió al alba y llega a la cumbre al mediodía.", "La expedición partió al alba y llegó a la cumbre al mediodía.", "La expedición parte al alba y llegó a la cumbre al mediodía.", "La expedición partió al alba y llegará a la cumbre al mediodía."),
  pt("¿Cómo se corrige el cambio indebido de tiempo?", "El personaje abre la carta y empezó a llorar.", "El personaje abre la carta y empieza a llorar.", "El personaje abrió la carta y empieza a llorar.", "El personaje abre la carta y empezará a llorar."),
];
const PROGRESSIVE_USE: ChoiceItem[] = [
  f("En este instante el jurado ___.", "está deliberando", "estaba deliberando", "deliberó"), f("Ayer a esta hora nosotros ___ el examen.", "estábamos rindiendo", "estamos rindiendo", "estaremos rindiendo"), f("Mañana a las diez yo ___ mi proyecto.", "estaré exponiendo", "estaba exponiendo", "estoy exponiendo"),
  f("Cuando llegaste, ella ___ un informe.", "estaba redactando", "está redactando", "estará redactando"), f("No interrumpas: ___ los datos.", "estamos analizando", "estábamos analizando", "analizamos ayer"), f("El año que viene ya ___ en secundaria.", "estaremos estudiando", "estábamos estudiando", "estamos estudiando"),
  f("Anoche, mientras dormías, ___ granizo.", "estaba cayendo", "está cayendo", "estará cayendo"), f("Mira: los glaciares ___.", "están retrocediendo", "estaban retrocediendo", "retrocedieron"), f("A esta hora, el domingo, ___ hacia Cusco.", "estaremos viajando", "estábamos viajando", "estamos viajando"),
  f("Ahora ustedes ___ la mejor decisión.", "están tomando", "estaban tomando", "tomaron"),
];
const PROGRESSIVE_FORM: ChoiceItem[] = [
  w("¿Cuál es el gerundio de «influir»?", "influyendo", "influiendo", "influido"), w("¿Cuál es el gerundio de «corregir»?", "corrigiendo", "corregiendo", "corregido"), w("¿Cuál es el gerundio de «proveer»?", "proveyendo", "proveiendo", "provisto"),
  w("¿Cuál es el gerundio de «servir»?", "sirviendo", "serviendo", "servido"), w("¿Cuál es el gerundio de «distribuir»?", "distribuyendo", "distribuiendo", "distribuido"), w("¿Cuál es el gerundio de «decir»?", "diciendo", "deciendo", "dicho"),
  w("¿Cuál es el gerundio de «medir»?", "midiendo", "mediendo", "medido"), w("¿Cuál es el gerundio de «oír»?", "oyendo", "oiendo", "oído"), w("¿Cuál es el gerundio de «repetir»?", "repitiendo", "repetiendo", "repetido"),
  w("¿Cuál es el gerundio de «leer»?", "leyendo", "leiendo", "leído"),
];
const PAST_OR_PARTICIPLE: ChoiceItem[] = [
  f("El jurado ya ha ___ su decisión.", "dicho", "dijo", "decido"), f("Ayer el jurado ___ su decisión.", "dijo", "dicho", "decido"), f("La editorial ha ___ mil ejemplares.", "impreso", "imprimió", "imprimiendo"),
  f("El conflicto quedó ___.", "resuelto", "resolvió", "resolvido"), f("Nunca había ___ algo así.", "visto", "vi", "veído"), f("Anoche ___ un poema.", "escribí", "escrito", "escribido"),
  f("Los datos han sido ___ por dos equipos.", "revisados", "revisaron", "revisando"), f("El pan se ha ___ en aceite.", "frito", "frió", "friendo"), f("El explorador ___ en 1911.", "volvió", "vuelto", "volvido"),
  f("Hemos ___ el contrato.", "roto", "rompimos", "rompido"), f("Han ___ una nueva especie.", "descubierto", "descubrieron", "descubrido"), f("El sol se ha ___.", "puesto", "puso", "ponido"),
];
const PERFECT_USE: ChoiceItem[] = [
  f("Este año ___ más que nunca.", "hemos leído", "habíamos leído", "habremos leído"), f("Cuando llegó la ayuda, el río ya ___.", "había bajado", "ha bajado", "habrá bajado"), f("Para fin de mes ___ el proyecto.", "habremos terminado", "habíamos terminado", "hemos terminado"),
  f("Todavía no ___ los resultados.", "han publicado", "habían publicado", "habrán publicado"), f("Antes de la imprenta, los libros se ___ a mano.", "habían copiado", "han copiado", "habrán copiado"), f("Dentro de diez años, muchos glaciares ___.", "habrán desaparecido", "habían desaparecido", "han desaparecido"),
  f("¿Alguna vez ___ un eclipse?", "has visto", "habías visto", "habrás visto"), f("Cuando sonó el timbre, ya ___ el examen.", "había entregado", "he entregado", "habré entregado"), f("Hoy ___ muy temprano.", "me he despertado", "me había despertado", "me habré despertado"),
  f("El lunes ya ___ la respuesta.", "habremos recibido", "habíamos recibido", "hemos recibido"),
];
const PERFECT_FORM: ChoiceItem[] = [
  w("¿Cuál es el participio de «satisfacer»?", "satisfecho", "satisfacido", "satisfaciendo"), w("¿Cuál es el participio de «prever»?", "previsto", "preveído", "previendo"), w("¿Cuál es el participio de «componer»?", "compuesto", "componido", "componiendo"),
  w("¿Cuál es el participio de «deshacer»?", "deshecho", "deshacido", "deshaciendo"), w("¿Cuál es el participio de «devolver»?", "devuelto", "devolvido", "devolviendo"), w("¿Cuál es el participio de «describir»?", "descrito", "describido", "describiendo"),
  w("¿Cómo se forma «ellos + haber + resolver» en pretérito pluscuamperfecto?", "habían resuelto", "han resuelto", "habían resolvido"), w("¿Cómo se forma «yo + haber + decir» en futuro perfecto?", "habré dicho", "he dicho", "habré decido"),
  w("¿Cómo se forma «tú + haber + abrir» en pretérito perfecto?", "has abierto", "habías abierto", "has abrido"), w("¿Cómo se forma «nosotros + haber + poner» en pretérito pluscuamperfecto?", "habíamos puesto", "hemos puesto", "habíamos ponido"),
];

export const ROWS: Row[] = [
  ["prefijos-ortografia-1", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["prefijos-ortografia-2", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["prefijos-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "exportar excavar exhibir inmóvil innovar amanecer florecer periodista ciclista dentista", "a e i o u x s c z h b v")])],
  ["raices-ortografia-1", (r) => choose(r, WELL, BASE_1)],
  ["raices-ortografia-2", (r) => choose(r, WELL, BASE_2)],
  ["raices-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...BASE_1, ...BASE_2]), (q) => P2.spellHeard(q, "describir manuscrito atraer extracto distraer transferir soportar estructura transporte destruir", "a e i o u b v s c x p")])],
  ["h-g-j-1", (r) => choose(r, WELL, SET_H)],
  ["h-g-j-2", (r) => choose(r, WELL, SET_GJ)],
  ["h-g-j-3", (r) => P2.spellHeard(r, "vehículo prohibir ahorro bahía anhelo escoger dirigir garaje paisaje gigante lenguaje tejido", "a e i o u í h g j b v")],
  ["cion-sion-b-v-1", (r) => choose(r, WELL, SET_CION)],
  ["cion-sion-b-v-2", (r) => choose(r, WELL, SET_BV)],
  ["cion-sion-b-v-3", (r) => P2.spellHeard(r, "solución decisión atención discusión situación observar estuvo obtuvo advertir evidente", "a e i o u ó c s z b v")],
  ["cion-sion-b-v-4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_CION, ...SET_BV]), (q) => P2.spellHeard(q, "solución decisión observar evidente acción obtuvo", "a e i o u ó c s b v")])],

  ["tipos-oracion", (r) => choose(r, "", SENTENCE_KIND)],
  ["sujeto-predicado-1", (r) => choose(r, "", SUBJECT_PREDICATE)],
  ["sujeto-predicado-2", (r) => choose(r, "", SIMPLE_SP)],
  ["sujeto-predicado-3", (r) => choose(r, "", COMPOUND_SP)],
  ["fragmentos-1", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["fragmentos-2", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["fragmentos-3", (r) => choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],
  ["subordinadas-1", (r) => choose(r, "", CLAUSES)],
  ["subordinadas-2", (r) => choose(r, "", SIMPLE_COMPOUND_COMPLEX)],

  ["plurales-1", (r) => mix(r, [(q) => pickAll(q, "Selecciona los sustantivos propios.", PROPER, COMMON, "propios"), (q) => pickAll(q, "Selecciona los sustantivos comunes.", COMMON, PROPER, "comunes")])],
  ["plurales-2", (r) => choose(r, "", PLURAL_FORM)],
  ["plurales-3", (r) => choose(r, "Completa la oración.", PLURAL_USE)],
  ["plurales-4", (r) => choose(r, "", [...PLURAL_REVIEW, ...PLURAL_FORM])],
  ["plurales-5", (r) => choose(r, "Completa la oración.", [...PLURAL_REVIEW_USE, ...PLURAL_USE])],
  ["plurales-6", (r) => choose(r, "", POSSESSIVE_ID)],
  ["plurales-7", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],
  ["plurales-8", (r) => choose(r, "", POSSESSIVE_ERRORS)],

  ["antecedentes-1", (r) => choose(r, "", ANTECEDENTS)],
  ["antecedentes-2", (r) => choose(r, "Completa la oración.", AGREE)],
  ["antecedentes-3", (r) => choose(r, "", VAGUE_REF)],
  ["antecedentes-4", (r) => choose(r, "", ALL_ANTECEDENTS)],
  ["antecedentes-5", (r) => choose(r, "", PRONOUN_SHIFTS)],

  ["personales-1", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["personales-2", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["personales-3", (r) => choose(r, "Completa la oración.", COMPOUND_PRONOUNS)],
  ["personales-4", (r) => choose(r, "Completa la oración.", POSS_USE)],
  ["reflexivos-1", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["reflexivos-2", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],
  ["reflexivos-3", (r) => choose(r, "", REFLEXIVE_INTENSIVE)],
  ["relativos-1", (r) => pickInSentence(r, "Selecciona el pronombre o adverbio relativo.", REL_IN)],
  ["relativos-2", (r) => choose(r, "Completa la oración.", QUE_QUIEN)],
  ["relativos-3", (r) => choose(r, "Completa la oración.", RELATIVE_USE)],

  ["auxiliares-1", (r) => choose(r, "", HELPING)],
  ["transitivos-1", (r) => choose(r, "", TRANSITIVE)],
  ["transitivos-2", (r) => choose(r, "", LINKING)],
  ["auxiliares-2", (r) => choose(r, "", MODAL_SHOWS)],
  ["auxiliares-3", (r) => choose(r, "Completa la oración.", MODAL_USE)],

  ["concordancia-1", (r) => choose(r, "Completa la oración.", SUBJECT_VERB)],
  ["concordancia-2", (r) => choose(r, "Completa la oración.", COMPOUND_SUBJECT)],

  ["tiempos-1", (r) => choose(r, "Completa con el verbo en pasado.", PAST_IRREGULAR)],
  ["tiempos-2", (r) => choose(r, "Completa con el verbo en el tiempo que corresponde.", THREE_TENSES)],
  ["tiempos-3", (r) => choose(r, "", TENSE_SHIFTS)],
  ["gerundio-1", (r) => choose(r, "Completa la oración.", PROGRESSIVE_USE)],
  ["gerundio-2", (r) => choose(r, "", PROGRESSIVE_FORM)],
  ["compuestos-1", (r) => choose(r, "Completa la oración.", PAST_OR_PARTICIPLE)],
  ["compuestos-2", (r) => choose(r, "Completa la oración.", PERFECT_USE)],
  ["compuestos-3", (r) => choose(r, "", PERFECT_FORM)],
];
