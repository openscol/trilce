import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 2.° de Secundaria · banco de gramática y ortografía (primera parte):
// prefijos ante-, inter-, super-, trans-/tras- y sufijos -al, -ción, -sión;
// raíces aud, yect, dic, duc; b en -aba y -bir, v tras n, l, d, b, g en -gen y
// geo-, tildes; frases y proposiciones; pertenencia conjunta («la casa de Ana
// y Luis») o separada; pronombres; participios como adjetivos, gerundios e
// infinitivos; modos indicativo, subjuntivo e imperativo.


// --- Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("anteayer", "antiayer", "anteaier"), spell("antebrazo", "antibrazo", "antebraso"), spell("interrumpir", "interumpir", "interrunpir"), spell("intercambio", "intercanbio", "intercambío"),
  spell("supervisar", "superbisar", "supervizar"), spell("superávit", "superabit", "superávid"), spell("transbordo", "tranbordo", "transvordo"), spell("transmitir", "tranmitir", "transmetir"),
  spell("trasladar", "traslasdar", "trazladar"), spell("anteponer", "antiponer", "anteponér"), spell("interactuar", "interatuar", "interactúar"), spell("superponer", "superpomer", "superponér"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("comercial", "comersial", "comercíal"), spell("cultural", "cultúral", "kultural"), spell("ambiental", "anbiental", "ambiemtal"), spell("ancestral", "ansestral", "ancestrál"),
  spell("contaminación", "contaminasión", "contaminacíon"), spell("explosión", "esplosión", "explosíon"), spell("migración", "migrasión", "migracción"), spell("comprensión", "comprención", "conprensión"),
  spell("prevención", "prebención", "prevensión"), spell("conversión", "converción", "combersión"), spell("educacional", "educasional", "educacionál"), spell("revisión", "revición", "rebisión"),
];
const AUD_YECT: ChoiceItem[] = [
  spell("auditorio", "auditório", "audítorio"), spell("audición", "audisión", "audicción"), spell("audiencia", "audiensia", "audencia"), spell("inaudible", "inaudivle", "inaudíble"),
  spell("proyecto", "proyeto", "projecto"), spell("inyección", "inyeción", "injección"), spell("trayectoria", "trallectoria", "trayetoria"), spell("objeción", "objección", "obgeción"),
  spell("sujeto", "sugeto", "sujecto"), spell("proyector", "proyertor", "projector"), spell("audiovisual", "audiobisual", "audiovisúal"), spell("objetivo", "objectivo", "ovjetivo"),
];
const DIC_DUC: ChoiceItem[] = [
  spell("predicción", "predición", "predicsión"), spell("contradicción", "contradición", "contradiccíon"), spell("dictadura", "dictádura", "ditadura"), spell("diccionario", "dicionario", "dicsionario"),
  spell("producción", "produción", "producsión"), spell("reducción", "redución", "reduccíon"), spell("traducción", "tradución", "tradusción"), spell("conducta", "condupta", "condúcta"),
  spell("deducir", "deduzir", "deducír"), spell("introducción", "introdución", "introducsión"), spell("productivo", "produtivo", "productibo"), spell("veredicto", "veredito", "beredicto"),
];
const SET_BA: ChoiceItem[] = [
  spell("estaba", "estava", "eztaba"), spell("caminaban", "caminavan", "kaminaban"), spell("recibir", "recivir", "resibir"), spell("escribir", "escrivir", "ezcribir"),
  spell("iba", "iva", "híba"), spell("prohibir", "proivir", "prohivir"), spell("subir", "suvir", "subír"), spell("cantábamos", "cantávamos", "cantabamos"),
  spell("describir", "descrivir", "descríbir"), spell("trabajaba", "trabajava", "travajaba"), spell("sucumbir", "sucunbir", "sucumvir"), spell("jugábamos", "jugávamos", "jugabamos"),
];
const SET_V: ChoiceItem[] = [
  spell("invierno", "imbierno", "inbierno"), spell("envase", "embase", "enbase"), spell("adverbio", "adberbio", "advervio"), spell("obvio", "obbio", "ovbio"),
  spell("olvido", "olbido", "holvido"), spell("invitar", "inbitar", "imbitar"), spell("advertir", "adbertir", "abvertir"), spell("subvención", "subbención", "suvvención"),
  spell("envidia", "embidia", "enbidia"), spell("salvavidas", "salbavidas", "salvabidas"), spell("conversar", "combersar", "converzar"), spell("invento", "imbento", "inbento"),
];
const SET_G: ChoiceItem[] = [
  spell("origen", "orijen", "horigen"), spell("energía", "enerjía", "henergía"), spell("geografía", "jeografía", "geográfia"), spell("imagen", "imajen", "himagen"),
  spell("margen", "marjen", "margén"), spell("biología", "biolojía", "viología"), spell("geología", "jeología", "geolojía"), spell("virgen", "virjen", "birgen"),
  spell("tecnología", "tecnolojía", "técnología"), spell("geometría", "jeometría", "geometria"), spell("aborigen", "aborijen", "havorigen"), spell("analogía", "analojía", "hanalogía"),
];
const SET_TILDE: ChoiceItem[] = [
  spell("árbol", "arbol", "árból"), spell("lápiz", "lapiz", "lapíz"), spell("también", "tambien", "támbien"), spell("canción", "cancion", "cánción"),
  spell("rápido", "rapido", "rapído"), spell("música", "musica", "musíca"), spell("cárcel", "carcel", "carcél"), spell("país", "pais", "páis"),
  spell("sílaba", "silaba", "silába"), spell("difícil", "dificil", "díficil"), spell("después", "despues", "déspues"), spell("murciélago", "murcielago", "murcíelago"),
];

// --- Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["El Manu alberga más de mil especies de aves.", "No sabemos quién ganó el concurso.", "Me pregunto por qué se secó el río.", "La reunión empieza a las ocho."].map((x) => KIND(x, 0)),
  ...["¿Quién escribió «Los ríos profundos»?", "¿Cuándo se abolió la esclavitud en el Perú?", "¿Ya entregaste tu ensayo?", "¿Por qué emigran las aves?"].map((x) => KIND(x, 1)),
  ...["Revisa tu ensayo antes de entregarlo.", "No dejen basura en la playa.", "Cita siempre las fuentes.", "Guarden silencio durante la ceremonia."].map((x) => KIND(x, 2)),
  ...["¡Qué hermoso es el Colca!", "¡Aprobé el examen!", "¡Cuánto tiempo sin verte!", "¡Qué frío hace en Puno!"].map((x) => KIND(x, 3)),
];
const SUBJECT_PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el sujeto completo?", "Los pescadores artesanales de Paita salieron antes del amanecer.", "Los pescadores artesanales de Paita", "Los pescadores", "Los pescadores artesanales de Paita salieron"), pt("¿Cuál es el predicado completo?", "Los pescadores artesanales de Paita salieron antes del amanecer.", "salieron antes del amanecer", "salieron", "de Paita salieron antes"),
  pt("¿Cuál es el sujeto completo?", "Desde el mirador se veían los cóndores del cañón.", "los cóndores del cañón", "Desde el mirador", "se veían los cóndores"), pt("¿Cuál es el predicado completo?", "La autora de «Aves sin nido» denunció los abusos.", "denunció los abusos", "denunció", "La autora de «Aves sin nido» denunció"),
  pt("¿Cuál es el sujeto completo?", "A los turistas les fascinan las Líneas de Nasca.", "las Líneas de Nasca", "A los turistas", "les fascinan"), pt("¿Cuál es el predicado completo?", "El viejo puente de Q'eswachaka se renueva cada año.", "se renueva cada año", "se renueva", "El viejo puente se renueva"),
  pt("¿Cuál es el sujeto completo?", "Llegó al pueblo una banda de músicos de Jauja.", "una banda de músicos de Jauja", "al pueblo", "Llegó al pueblo"), pt("¿Cuál es el predicado completo?", "Mis compañeros de quinto organizaron una colecta.", "organizaron una colecta", "organizaron", "Mis compañeros organizaron"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto?", "Los pescadores artesanales de Paita salieron antes del amanecer.", "pescadores", "Paita", "artesanales"), pt("¿Cuál es el núcleo del predicado?", "Los pescadores artesanales de Paita salieron antes del amanecer.", "salieron", "amanecer", "pescadores"),
  pt("¿Cuál es el núcleo del sujeto?", "La autora de «Aves sin nido» denunció los abusos.", "autora", "abusos", "Aves"), pt("¿Cuál es el núcleo del predicado?", "Mis compañeros de quinto organizaron una colecta.", "organizaron", "colecta", "compañeros"),
  pt("¿Cuál es el núcleo del sujeto?", "A los turistas les fascinan las Líneas de Nasca.", "Líneas", "turistas", "Nasca"), pt("¿Cuál es el núcleo del predicado?", "Desde el mirador se veían los cóndores del cañón.", "veían", "mirador", "cóndores"),
  pt("¿Cuál es el núcleo del sujeto?", "Llegó al pueblo una banda de músicos de Jauja.", "banda", "músicos", "pueblo"), pt("¿Cuál es el núcleo del predicado?", "El viejo puente de Q'eswachaka se renueva cada año.", "renueva", "puente", "año"),
];
const COMPOUND_SP: ChoiceItem[] = [
  pt("¿Cuál es el sujeto compuesto?", "La zampoña y la quena suenan juntas en la fiesta.", "La zampoña y la quena", "suenan juntas", "la quena suenan juntas en la fiesta"), pt("¿Cuál es el predicado compuesto?", "La periodista investigó el caso y publicó un reportaje.", "investigó el caso y publicó un reportaje", "investigó el caso", "La periodista investigó el caso y publicó"),
  pt("¿Cuál es el sujeto compuesto?", "Tanto Arguedas como Alegría escribieron sobre los Andes.", "Tanto Arguedas como Alegría", "escribieron", "Alegría escribieron sobre los Andes del Perú"), pt("¿Cuál es el predicado compuesto?", "Los voluntarios recogieron basura, separaron el plástico y lo llevaron al reciclaje.", "recogieron basura, separaron el plástico y lo llevaron al reciclaje", "recogieron basura", "Los voluntarios recogieron basura, separaron el plástico y lo llevaron"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "Piura y Tumbes producen mango.", "Sujeto compuesto", "Predicado compuesto", "Ninguno de los dos"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El volcán tembló y expulsó ceniza.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "La biblioteca municipal abre a las nueve.", "Ninguno de los dos", "Sujeto compuesto", "Predicado compuesto"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "Mi madre cocina y vende tamales.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["El jurado anunció a los ganadores.", "Aunque llovía, la procesión salió.", "Los arqueólogos excavaron durante meses.", "Si estudias con método, aprenderás más.", "Nadie esperaba el resultado.", "La comunidad reconstruyó el canal."];
const FRAGMENT_ITEMS = ["El jurado que anunció a los ganadores.", "Aunque llovía en toda la ciudad.", "Excavando durante meses en el desierto.", "Si estudias con método.", "Un resultado que nadie esperaba.", "Para reconstruir el canal de riego."];
const RUN_ON_ITEMS = ["El jurado deliberó anunció a los ganadores.", "Llovía mucho la procesión salió igual.", "Excavaron meses encontraron una tumba.", "Estudia con método aprenderás más.", "Nadie lo esperaba todos se sorprendieron.", "Se rompió el canal la comunidad lo reconstruyó."];

// --- Frases y proposiciones -------------------------------------------------

const PC = sorter(["Frase (no tiene verbo conjugado)", "Proposición (tiene sujeto y verbo conjugado)"], "¿Es una frase o una proposición?");
const PHRASE_CLAUSE: ChoiceItem[] = [
  ...["a orillas del Titicaca", "antes del amanecer", "la antigua casona de Trujillo", "con paciencia y esfuerzo", "sin decir una palabra", "a pesar del frío"].map((x) => PC(x, 0)),
  ...["mientras los cóndores volaban", "porque no había agua", "que escribió Arguedas", "si llega el tren", "aunque nadie lo creía", "cuando terminó la guerra"].map((x) => PC(x, 1)),
];
const APPO = "¿Cuál es la aposición de la oración?";
const APPOSITIVES: ChoiceItem[] = [
  pt(APPO, "Arguedas, autor de «Los ríos profundos», nació en Andahuaylas.", "autor de «Los ríos profundos»", "Arguedas", "Arguedas, autor de «Los ríos profundos», nació"), pt(APPO, "Caral, la ciudad más antigua de América, está en Supe.", "la ciudad más antigua de América", "Caral", "Caral, la ciudad más antigua de América, está"),
  pt(APPO, "Mi tía, una enfermera de Tacna, salvó al niño.", "una enfermera de Tacna", "Mi tía", "salvó al niño"), pt(APPO, "Visitamos Chan Chan, la capital chimú.", "la capital chimú", "Chan Chan", "Visitamos Chan Chan"),
  pt(APPO, "El Huáscar, monitor de Grau, es hoy un museo.", "monitor de Grau", "El Huáscar", "El Huáscar es hoy un museo"), pt(APPO, "Raimondi, el naturalista italiano, recorrió todo el Perú.", "el naturalista italiano", "Raimondi", "recorrió todo el Perú"),
  pt(APPO, "Leímos «Ollantay», un drama quechua.", "un drama quechua", "«Ollantay»", "Leímos «Ollantay»"), pt(APPO, "El ají amarillo, ingrediente básico de la cocina peruana, es picante.", "ingrediente básico de la cocina peruana", "El ají amarillo", "El ají amarillo, ingrediente básico de la cocina peruana, es picante"),
];
const CLAUSE = sorter(["Proposición principal", "Proposición subordinada"], "La parte en MAYÚSCULAS, ¿es la proposición principal o la subordinada?");
const CLAUSES: ChoiceItem[] = [
  ...["EL PUENTE SE CAYÓ porque el río creció.", "Aunque estaba cansado, EL CORREDOR LLEGÓ A LA META.", "VISITAREMOS KUÉLAP cuando terminen las lluvias.", "Si consigues los permisos, ABRIREMOS LA FERIA.", "ADMIRO A LA ESCRITORA que ganó el premio.", "Como no había luz, ESTUDIAMOS CON VELAS."].map((x) => CLAUSE(x, 0)),
  ...["El puente se cayó PORQUE EL RÍO CRECIÓ.", "AUNQUE ESTABA CANSADO, el corredor llegó a la meta.", "Visitaremos Kuélap CUANDO TERMINEN LAS LLUVIAS.", "SI CONSIGUES LOS PERMISOS, abriremos la feria.", "Admiro a la escritora QUE GANÓ EL PREMIO.", "COMO NO HABÍA LUZ, estudiamos con velas."].map((x) => CLAUSE(x, 1)),
];
const SCC = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada", "Compuesta con coordinación y subordinación"], "¿Cómo es la oración?");
const SIMPLE_COMPOUND_COMPLEX: ChoiceItem[] = [
  ...["Los vecinos del barrio limpiaron el parque.", "En la plaza de Armas de Cusco hay muchos turistas.", "Mi abuela y mi tía tejen mantas.", "Ayer llovió toda la tarde."].map((x) => SCC(x, 0)),
  ...["Estudié mucho, pero no aprobé.", "El sol salió y la neblina desapareció.", "¿Vienes o te quedas?", "Ni come ni deja comer."].map((x) => SCC(x, 1)),
  ...["Aprobé porque estudié mucho.", "El libro que me prestaste es excelente.", "Si llueve, no iremos.", "Cuando llegó el tren, ya era de noche."].map((x) => SCC(x, 2)),
  ...["Estudié mucho y aprobé el curso que más temía.", "Cuando llegó el tren, bajamos y caminamos a la plaza.", "Quería ir, pero no pude porque llovía.", "El niño que ganó el concurso sonrió y saludó al público."].map((x) => SCC(x, 3)),
];
const RELATIVE = "¿Cómo se unen mejor las dos oraciones con una proposición de relativo?";
const COMBINE_RELATIVE: ChoiceItem[] = [
  pt(RELATIVE, "Leímos una novela. La novela cuenta la vida de una comunidad andina.", "Leímos una novela que cuenta la vida de una comunidad andina.", "Leímos una novela y la novela cuenta la vida de una comunidad andina de la sierra.", "Leímos."),
  pt(RELATIVE, "Visitamos el pueblo. En ese pueblo nació Vallejo.", "Visitamos el pueblo donde nació Vallejo.", "Visitamos el pueblo que en ese pueblo nació Vallejo, el poeta.", "Vallejo nació."),
  pt(RELATIVE, "Conocí a un artesano. Sus retablos son famosos.", "Conocí a un artesano cuyos retablos son famosos.", "Conocí a un artesano que sus retablos son famosos en todo el país.", "Retablos famosos."),
  pt(RELATIVE, "Esa es la profesora. Le escribí una carta a la profesora.", "Esa es la profesora a quien le escribí una carta.", "Esa es la profesora que le escribí una carta a ella la semana pasada.", "Le escribí."),
  pt(RELATIVE, "Me prestó un libro. El libro tiene ilustraciones de Sabogal.", "Me prestó un libro que tiene ilustraciones de Sabogal.", "Me prestó un libro y ese libro tiene ilustraciones de Sabogal en cada capítulo.", "Sabogal ilustró."),
  pt(RELATIVE, "Es un tema. No estoy de acuerdo con ese tema.", "Es un tema con el cual no estoy de acuerdo.", "Es un tema que no estoy de acuerdo con ese tema para nada.", "No estoy."),
];

// --- Sustantivos ---------------------------------------------------------

const PLURAL = (word: string, a: string, ...d: string[]) => w(`¿Cuál es el plural de «${word}»?`, a, ...d);
const PLURAL_REVIEW: ChoiceItem[] = [
  PLURAL("volumen", "volúmenes", "volumenes", "volúmens"), PLURAL("origen", "orígenes", "origenes", "orígens"), PLURAL("hipótesis", "hipótesis", "hipótesises", "hipótesiss"),
  PLURAL("dosis", "dosis", "dosises", "dósis"), PLURAL("ají", "ajíes", "ajises", "ajíses"), PLURAL("colibrí", "colibríes", "colibrises", "colibríses"),
  PLURAL("cráter", "cráteres", "cráters", "crateres"), PLURAL("tórax", "tórax", "tóraxes", "tóraces"), PLURAL("eslogan", "eslóganes", "eslogans", "esloganes"),
  PLURAL("cruz", "cruces", "cruzes", "cruses"), PLURAL("certamen", "certámenes", "certamenes", "certámens"), PLURAL("fax", "faxes", "fax", "faces"),
];
const COMPOUND_PLURALS: ChoiceItem[] = [
  PLURAL("rascacielos", "rascacielos", "rascacieloses", "rascascielos"), PLURAL("bienvenida", "bienvenidas", "bienesvenidas", "bienvenidases"), PLURAL("sinvergüenza", "sinvergüenzas", "sinesvergüenzas", "sinvergüenza"),
  PLURAL("ciudad estado", "ciudades estado", "ciudad estados", "ciudades estados"), PLURAL("palabra clave", "palabras clave", "palabra claves", "palabrases clave"), PLURAL("bocamanga", "bocamangas", "bocasmangas", "bocamanga"),
  PLURAL("parachoques", "parachoques", "parachoqueses", "parachoque"), PLURAL("hispanohablante", "hispanohablantes", "hispanoshablantes", "hispanohablantees"), PLURAL("pez espada", "peces espada", "pez espadas", "peces espadas"),
  PLURAL("medialuna", "medialunas", "mediaslunas", "medialunases"), PLURAL("lavaplatos", "lavaplatos", "lavaplatoses", "lavasplatos"), PLURAL("mapamundi", "mapamundis", "mapasmundi", "mapamundíes"),
];
const OWN = sorter(["Plural (sin dueño)", "Pertenencia de un dueño", "Pertenencia de varios dueños"], "La frase en MAYÚSCULAS, ¿qué expresa?");
const POSSESSIVE_ID: ChoiceItem[] = [
  ...["LOS DANZANTES llegaron a la plaza.", "Compré LOS RETABLOS en Ayacucho.", "LAS VICUÑAS corrían por la puna.", "Saludé a LAS ENFERMERAS."].map((x) => OWN(x, 0)),
  ...["Leí EL DIARIO DE MI ABUELA.", "Se escapó LA LLAMA DEL PASTOR.", "Admiramos LOS MURALES DE LA ARTISTA.", "Visité LA CHACRA DE MI TÍO."].map((x) => OWN(x, 1)),
  ...["Leí LOS DIARIOS DE MIS ABUELAS.", "Se escaparon LAS LLAMAS DE LOS PASTORES.", "Admiramos LOS MURALES DE LAS ARTISTAS.", "Visité LAS CHACRAS DE MIS TÍOS."].map((x) => OWN(x, 2)),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  pt("¿Cómo se escribe la frase de pertenencia?", "Las mantas que tejieron las artesanas", "las mantas de las artesanas", "de las artesanas sus mantas", "las artesanas sus mantas"),
  pt("¿Cómo se escribe la frase de pertenencia?", "El poema que escribió Vallejo", "el poema de Vallejo", "de Vallejo su poema", "el Vallejo poema"),
  pt("¿Cómo se escribe la frase de pertenencia?", "La voz que tiene el cantante", "la voz del cantante", "la voz de el cantante", "del cantante su voz"),
  pt("¿Cómo se escribe la frase de pertenencia?", "Los reclamos que hicieron los vecinos", "los reclamos de los vecinos", "los vecinos sus reclamos", "de los vecinos su reclamos"),
  pt("¿Cómo se escribe la frase de pertenencia?", "La idea que tuvo la delegada", "la idea de la delegada", "de la delegada su idea", "la delegada idea"),
  pt("¿Cómo se escribe la frase de pertenencia?", "El escudo que tiene el Perú", "el escudo del Perú", "el escudo de el Perú", "del Perú su escudo"),
];
const FIXIT = "¿Cómo se corrige la oración?";
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt(FIXIT, "De mi abuelo su chacra está en Junín.", "La chacra de mi abuelo está en Junín.", "De mi abuelo la su chacra está en Junín.", "Su chacra de mi abuelo está en Junín."),
  pt(FIXIT, "Los orígens de la marinera son discutidos.", "Los orígenes de la marinera son discutidos.", "Los origenes de la marinera son discutidos.", "Los origen de la marinera son discutidos."),
  pt(FIXIT, "Escuché la voz de el director.", "Escuché la voz del director.", "Escuché la voz de él director.", "Escuché del director su voz."),
  pt(FIXIT, "Los ajises de Arequipa son picantes.", "Los ajíes de Arequipa son picantes.", "Los ají de Arequipa son picantes.", "Las ajíes de Arequipa son picante."),
  pt(FIXIT, "Vi su casa de ellos en el cerro.", "Vi la casa de ellos en el cerro.", "Vi su casa suya de ellos en el cerro.", "Vi de ellos su casa en el cerro."),
  pt(FIXIT, "Los cráters del Misti se ven desde lejos.", "Los cráteres del Misti se ven desde lejos.", "Las cráteres del Misti se ven desde lejos.", "Los crater del Misti se ven desde lejos."),
];
const JOINT = sorter(["Pertenencia conjunta (de los dos a la vez)", "Pertenencia separada (cada uno tiene el suyo)"], "¿Qué indica la frase en MAYÚSCULAS?");
const JOINT_ID: ChoiceItem[] = [
  ...["Visitamos LA CASA DE ANA Y LUIS, donde viven juntos.", "Leímos EL LIBRO DE RAMOS Y VEGA, escrito entre los dos.", "Fuimos a LA TIENDA DE MIS TÍOS, que la atienden juntos.", "Escuchamos LA CANCIÓN DE ROSA Y PEDRO, que compusieron a dúo."].map((x) => JOINT(x, 0)),
  ...["Visitamos LAS CASAS DE ANA Y DE LUIS, una en Lima y otra en Ica.", "Leímos LOS LIBROS DE RAMOS Y DE VEGA, cada uno el suyo.", "Revisé LOS CUADERNOS DE PEDRO Y DE JUAN.", "Arreglamos LAS BICICLETAS DE ROSA Y DE SU PRIMA."].map((x) => JOINT(x, 1)),
  w("Ana y Luis viven juntos en una sola casa. ¿Qué frase es correcta?", "la casa de Ana y Luis", "las casas de Ana y de Luis", "la casa de Ana y la de Luis"),
  w("Rosa y Pedro tienen cada uno su propio perro. ¿Qué frase es correcta?", "los perros de Rosa y de Pedro", "el perro de Rosa y Pedro", "los perro de Rosa y Pedro"),
];

// --- Pronombres y antecedentes ---------------------------------------------

const ANTECEDENTS: ChoiceItem[] = [
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "La periodista entrevistó al alcalde y LO grabó.", "al alcalde", "La periodista", "una cámara de la radio local"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Los alumnos presentaron su proyecto; ELLOS lo prepararon un mes.", "Los alumnos", "su proyecto", "un mes"),
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Compré una quena y LA toqué en la fiesta.", "una quena", "la fiesta", "el músico que vino de Puno a la fiesta"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Mi madre llamó a mis tías y LES contó la noticia.", "mis tías", "Mi madre", "la noticia"),
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "El museo, QUE abrió ayer, tiene momias.", "El museo", "momias", "ayer"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Encontré las llaves que buscabas; LAS dejé en la mesa.", "las llaves", "la mesa", "el cajón de la cocina, junto a la mesa"),
];
const AGREE: ChoiceItem[] = [
  f("Las comunidades defendieron ___ territorio.", "su", "sus", "nuestro"), f("Cada uno de los jugadores trajo ___ uniforme.", "su", "sus", "nuestros"),
  f("El jurado dio ___ veredicto.", "su", "sus", "nuestro"), f("Las artesanas vendieron ___ mantas en la feria.", "sus", "su", "nuestras"),
  f("Encontré los documentos y ___ guardé.", "los", "lo", "las"), f("Ana y yo terminamos ___ ensayo.", "nuestro", "su", "sus"),
  f("El Congreso aprobó ___ presupuesto.", "su", "sus", "nuestro"), f("Saludé a la directora y ___ di las gracias.", "le", "la", "les"),
];
const SHIFT = "¿Cómo se corrige el cambio indebido de pronombre?";
const PRONOUN_SHIFTS: ChoiceItem[] = [
  pt(SHIFT, "Cuando uno viaja a Puno, te da soroche.", "Cuando uno viaja a Puno, le da soroche.", "Cuando uno viaja a Puno, nos da soroche a todos los que vamos.", "Te da soroche."),
  pt(SHIFT, "Si los estudiantes estudian, aprobarás.", "Si los estudiantes estudian, aprobarán.", "Si los estudiantes estudian, aprobaremos todos juntos en el examen final.", "Aprobarás."),
  pt(SHIFT, "Nosotros llegamos al mirador y ves los cóndores.", "Nosotros llegamos al mirador y vimos los cóndores.", "Nosotros llegamos al mirador y ellos vieron los cóndores volando sobre el cañón.", "Ves cóndores."),
  pt(SHIFT, "Uno debe cuidar su salud, porque si no te enfermas.", "Uno debe cuidar su salud, porque si no se enferma.", "Uno debe cuidar su salud, porque si no nos enfermamos todos en la familia.", "Te enfermas."),
  pt(SHIFT, "Los ciudadanos deben votar, aunque no te guste ningún candidato.", "Los ciudadanos deben votar, aunque no les guste ningún candidato.", "Los ciudadanos deben votar, aunque no nos guste ningún candidato de los que hay.", "Vota."),
  pt(SHIFT, "Cada alumno debe traer sus libros; ustedes no pueden olvidarlos.", "Cada alumno debe traer sus libros; no puede olvidarlos.", "Cada alumno debe traer sus libros; nosotros no podemos olvidarlos nunca en casa.", "Tráiganlos."),
];
const VAGUE = "¿Qué oración tiene una referencia ambigua del pronombre?";
const VAGUE_REF: ChoiceItem[] = [
  w(VAGUE, "Rosa le contó a su madre que ella había perdido el trabajo.", "Rosa le contó a su madre que había perdido su propio trabajo en la fábrica.", "Rosa le dijo a su madre: «Perdí el trabajo»."), w(VAGUE, "Cuando el profesor habló con Luis, él estaba molesto.", "El profesor estaba molesto cuando habló con Luis en el patio del colegio.", "Luis estaba molesto cuando habló con el profesor."),
  w(VAGUE, "Pusimos los vasos en las cajas y las llevamos al auto.", "Pusimos los vasos en las cajas y llevamos las cajas al auto que estaba afuera.", "Llevamos al auto las cajas con los vasos."), w(VAGUE, "El perro mordió al gato y luego huyó.", "El perro mordió al gato y luego el perro huyó corriendo por la calle.", "Después de morder al gato, el perro huyó."),
  w(VAGUE, "Mi padre discutió con mi tío sobre su negocio.", "Mi padre discutió con mi tío sobre el negocio de mi tío en el mercado central.", "Mi padre y mi tío discutieron sobre el negocio de mi padre."), w(VAGUE, "Julia visitó a su amiga cuando se mudó.", "Julia visitó a su amiga cuando esta se mudó a su nueva casa en Surco.", "Cuando su amiga se mudó, Julia la visitó."),
];
const ALL_ANT = "¿Cuáles son todos los antecedentes posibles del pronombre en MAYÚSCULAS?";
const ALL_ANTECEDENTS: ChoiceItem[] = [
  pt(ALL_ANT, "Rosa le contó a su madre que ELLA había perdido el trabajo.", "Rosa o su madre", "Solo Rosa, que es quien habla", "Solo su madre"), pt(ALL_ANT, "Cuando el profesor habló con Luis, ÉL estaba molesto.", "El profesor o Luis", "Solo el profesor, que es mayor", "Solo Luis"),
  pt(ALL_ANT, "Pusimos los vasos en las cajas y LAS llevamos al auto.", "Solo las cajas", "Los vasos o las cajas, sin duda", "Solo los vasos"), pt(ALL_ANT, "Mi padre discutió con mi tío sobre SU negocio.", "Mi padre o mi tío", "Solo mi padre, que inició la discusión", "Solo mi tío"),
  pt(ALL_ANT, "Las niñas saludaron a sus abuelas cuando ELLAS llegaron.", "Las niñas o sus abuelas", "Solo las niñas, que saludaron primero", "Solo sus abuelas"), pt(ALL_ANT, "Pedro le prestó a Juan SU bicicleta.", "Pedro o Juan", "Solo Pedro, el dueño que la prestó", "Solo Juan"),
];

// --- Tipos de pronombres ---------------------------------------------------

const SUBJ_OBJ: ChoiceItem[] = [
  f("A ___ me encanta la música criolla.", "mí", "yo", "me"), f("___ y mi hermano ganamos el concurso.", "Yo", "Mí", "Me"),
  f("Esta carta es para ___.", "ti", "tú", "te"), f("___ eres quien debe decidir.", "Tú", "Ti", "Te"),
  f("Vi a los músicos y ___ aplaudí.", "los", "ellos", "les"), f("Le entregué el premio a ___.", "ella", "la", "le"),
  f("A ___ nos tocó limpiar el aula.", "nosotros", "nos", "nuestro"), f("El libro, ___ di a Rosa ayer.", "se lo", "le lo", "ella lo"),
];
const I_AND_ME: ChoiceItem[] = [
  f("Entre Rosa y ___ terminamos el mural.", "yo", "mí", "me"), f("Mis padres y ___ viajamos a Arequipa.", "yo", "mí", "me"),
  f("Trajeron chocolates para Luis y para ___.", "mí", "yo", "me"), f("El director nos felicitó a Ana y a ___.", "mí", "yo", "me"),
  f("Según Pedro y ___, el plan es viable.", "yo", "mí", "me"), f("Lo hicieron por mis hermanos y por ___.", "mí", "yo", "me"),
  f("Tú y ___ somos los delegados.", "yo", "mí", "me"), f("Esa noticia nos alegró a mi madre y a ___.", "mí", "yo", "me"),
];
const COMPOUND_PRONOUNS: ChoiceItem[] = [
  f("Ella y ___ preparamos la exposición.", "yo", "mí", "me"), f("Esto queda entre tú y ___.", "yo", "mí", "me"),
  f("Tú y ___ llegaron primero.", "él", "lo", "le"), f("Nos esperaron a ti y a ___.", "mí", "yo", "me"),
  f("Ustedes y ___ formaremos un solo equipo.", "nosotros", "nos", "nuestro"), f("Hablé con él y con ___.", "ella", "la", "le"),
  f("Ni ella ni ___ sabíamos la respuesta.", "yo", "mí", "me"), f("Nos invitaron a ellos y a ___.", "nosotros", "nos", "nuestros"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("El atleta ___ preparó durante meses.", "se", "lo", "le"), f("El entrenador ___ preparó durante meses.", "lo", "se", "le"),
  f("Yo ___ abrigo bien en invierno.", "me", "lo", "se"), f("La abuela ___ abriga con su chal.", "se", "la", "le"),
  f("Mi madre ___ peinó a mi hermana.", "la", "se", "le"), f("Mi hermana ___ peinó sola.", "se", "la", "le"),
  f("Nosotros ___ inscribimos en el taller.", "nos", "los", "se"), f("La profesora ___ inscribió en el concurso.", "nos", "se", "les"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Ella confía en ___ misma.", "sí", "ella", "se"), f("Los alumnos ___ organizaron sin ayuda.", "se", "les", "los"),
  f("Me dije a ___ mismo que lo lograría.", "mí", "yo", "me"), f("Debes quererte a ___ mismo.", "ti", "tú", "te"),
  f("Los vecinos solo pensaban en ___ mismos.", "sí", "ellos", "se"), f("___ preparamos el desayuno solos.", "Nos", "Los", "Se"),
  f("¿___ hiciste daño al caer?", "Te", "Ti", "Se"), f("Ustedes deben cuidarse a ___ mismos.", "sí", "ustedes", "se"),
];
const RI = sorter(["Reflexivo", "Enfático"], "El pronombre en MAYÚSCULAS, ¿es reflexivo o enfático?");
const REFLEXIVE_INTENSIVE: ChoiceItem[] = [
  ...["Luis SE cortó con el cuchillo.", "Los niños SE lavaron la cara.", "ME miré en el espejo.", "Nos defendimos a NOSOTROS MISMOS.", "Ella SE culpa de todo."].map((x) => RI(x, 0)),
  ...["La ministra MISMA inauguró la obra.", "YO MISMO pinté el mural.", "Ellas MISMAS organizaron la feria.", "El autor MISMO firmó los libros.", "Tú MISMA lo dijiste."].map((x) => RI(x, 1)),
];
const QUIEN: ChoiceItem[] = [
  f("Es el escritor ___ más admiro.", "a quien", "quien", "que lo"), f("La señora con ___ hablé vende tamales.", "quien", "que", "quienes"),
  f("Los alumnos, ___ habían estudiado, aprobaron.", "quienes", "quien", "los cuales que"), f("___ quiera participar, debe inscribirse.", "Quien", "Que", "Cual"),
  f("Es la vecina a ___ ayudamos.", "quien", "que", "cual"), f("Los científicos, ___ trabajaron diez años, publicaron el estudio.", "quienes", "quien", "de los cuales que"),
  f("No sé con ___ ir a la fiesta.", "quién", "quien", "que"), f("Son ellos ___ ganaron.", "quienes", "quien", "los que que"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("La comunidad ___ tierras fueron despojadas resistió.", "cuyas", "cuyos", "que sus"), f("El valle ___ crecí está en Áncash.", "donde", "cuyo", "quien"),
  f("Es un problema sobre el ___ debemos reflexionar.", "cual", "quien", "cuyo"), f("El autor ___ novela leí es Ciro Alegría.", "cuya", "cuyo", "que su"),
  f("La razón por la ___ vine es importante.", "cual", "quien", "cuya"), f("Los libros ___ me prestaste son de Arguedas.", "que", "quienes", "cuyos"),
  f("La ciudad ___ visitamos tiene un río.", "que", "quien", "cuyo"), f("La alumna, ___ padre es pescador, ganó la beca.", "cuyo", "cuya", "que su"),
];

// --- Tipos de verbos -------------------------------------------------------

const TI = sorter(["Transitivo", "Intransitivo"], "El verbo en MAYÚSCULAS, ¿es transitivo o intransitivo?");
const TRANSITIVE: ChoiceItem[] = [
  ...["La artesana TALLÓ un retablo.", "Los vecinos SEMBRARON árboles.", "ESCRIBÍ un ensayo sobre Grau.", "El huaico DESTRUYÓ el puente.", "La banda TOCÓ un huaino."].map((x) => TI(x, 0)),
  ...["El niño LLORÓ toda la noche.", "Los cóndores VOLABAN sobre el cañón.", "El río CRECIÓ en febrero.", "Mi abuelo NACIÓ en Jauja.", "Los turistas LLEGARON al amanecer."].map((x) => TI(x, 1)),
];
const LINK = sorter(["Atributo: adjetivo", "Atributo: sustantivo"], "¿Qué tipo de atributo tiene el verbo copulativo?");
const LINKING: ChoiceItem[] = [
  ...["El camino a Choquequirao es agotador.", "Los alumnos parecen preocupados.", "La sopa está fría.", "Su respuesta fue brillante.", "La noche estaba oscura."].map((x) => LINK(x, 0)),
  ...["Arguedas fue antropólogo.", "Mi madre es abogada.", "Ese cerro parece un gigante dormido.", "Lima es la capital del Perú.", "Grau fue un héroe."].map((x) => LINK(x, 1)),
];

// --- Concordancia ---------------------------------------------------------

const AGREEMENT_FIX: ChoiceItem[] = [
  pt(FIXIT, "El conjunto de danzantes llegaron tarde.", "El conjunto de danzantes llegó tarde.", "El conjunto de danzante llegaron tarde.", "Los conjunto de danzantes llegó tarde."),
  pt(FIXIT, "Les encanta las fiestas patronales.", "Les encantan las fiestas patronales.", "Les encantamos las fiestas patronales.", "Le encanta las fiesta patronales."),
  pt(FIXIT, "Se busca vendedores con experiencia.", "Se buscan vendedores con experiencia.", "Se buscamos vendedores con experiencia.", "Se busca vendedor con experiencias."),
  pt(FIXIT, "La gente del barrio aplaudieron al alcalde.", "La gente del barrio aplaudió al alcalde.", "La gente del barrio aplaudimos al alcalde.", "Las gentes del barrio aplaudió."),
  pt(FIXIT, "Faltan un minuto para el inicio.", "Falta un minuto para el inicio.", "Faltamos un minuto para el inicio.", "Faltan un minutos para el inicio."),
  pt(FIXIT, "El equipo de científicos descubrieron una especie.", "El equipo de científicos descubrió una especie.", "El equipo de científico descubrieron una especie.", "Los equipo de científicos descubrió una especie."),
];
const INDEFINITE: ChoiceItem[] = [
  f("Cada uno de los participantes ___ un diploma.", "recibió", "recibieron", "recibimos"), f("Nadie ___ la verdad.", "conocía", "conocían", "conocíamos"),
  f("Todos ___ a la marcha.", "asistieron", "asistió", "asistí"), f("Alguno de ustedes ___ mi celular.", "tiene", "tienen", "tenemos"),
  f("Ninguna de las alumnas ___ el examen.", "desaprobó", "desaprobaron", "desaprobamos"), f("Muchos ___ que la ley es injusta.", "opinan", "opina", "opino"),
  f("Varios de los vecinos ___ el reclamo.", "firmaron", "firmó", "firmé"), f("Cualquiera ___ cometer un error.", "puede", "pueden", "podemos"),
  f("Algunos ___ en la plaza.", "esperaban", "esperaba", "esperábamos"), f("Pocos ___ el final de la película.", "entendieron", "entendió", "entendí"),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  f("Tú y yo ___ el proyecto.", "presentaremos", "presentarán", "presentarás"), f("El cajón y la guitarra ___ el festejo.", "acompañan", "acompaña", "acompañamos"),
  f("La directora, junto con los profesores, ___ la ceremonia.", "presidió", "presidieron", "presidimos"), f("Tú y tu prima ___ invitadas.", "están", "está", "estamos"),
  f("La lluvia y el granizo ___ la cosecha.", "dañaron", "dañó", "dañamos"), f("Rosa y yo ___ en el coro.", "cantamos", "cantan", "canta"),
  f("El capitán con su tripulación ___ al puerto.", "llegó", "llegaron", "llegamos"), f("Mi padre y mi tío ___ en la mina.", "trabajan", "trabaja", "trabajamos"),
];

// --- Tiempos y modos verbales ------------------------------------------------

const PAST_IRREGULAR: ChoiceItem[] = [
  f("Los obreros ___ el puente en un año. (construir)", "construyeron", "construieron", "construyó"), f("Ella ___ el libro al quechua. (traducir)", "tradujo", "tradució", "traduciste"),
  f("Ayer no ___ ir a clases. (poder, yo)", "pude", "podí", "pudí"), f("La noticia nos ___ mucho. (satisfacer)", "satisfizo", "satisfació", "satisfazo"),
  f("Ellos ___ al acusado. (detener)", "detuvieron", "detenieron", "detuvo"), f("El juez ___ la sentencia. (leer)", "leyó", "leió", "leyí"),
  f("Nosotros ___ la verdad. (decir)", "dijimos", "decimos", "dijiemos"), f("Tú ___ muy bien en el examen. (andar)", "anduviste", "andaste", "anduvistes"),
  f("Los niños ___ en el patio. (caber)", "cupieron", "cabieron", "cupo"), f("El cocinero ___ la mesa. (poner)", "puso", "ponió", "pusó"),
];
const THREE_TENSES: ChoiceItem[] = [
  f("En 1854 Castilla ___ la esclavitud. (abolir)", "abolió", "abolirá", "abole"), f("El próximo año ___ el censo nacional. (realizarse)", "se realizará", "se realizó", "se realiza"),
  f("Cada mañana, los pescadores ___ al mar. (salir)", "salen", "salieron", "saldrán"), f("Ayer ___ un temblor en Ica. (ocurrir)", "ocurrió", "ocurrirá", "ocurre"),
  f("Mañana ___ las inscripciones. (cerrarse)", "se cerrarán", "se cerraron", "se cerraban"), f("Ahora mismo, el presidente ___ su mensaje. (dar)", "da", "dio", "dará"),
  f("Hace un siglo, Lima ___ menos habitantes. (tener)", "tenía", "tendrá", "tiene"), f("Dentro de un mes ___ vacaciones. (empezar, nosotros)", "empezaremos", "empezamos", "empezábamos"),
];
const TENSE_SHIFTS: ChoiceItem[] = [
  pt(FIXIT, "Ayer fuimos al museo y vemos las momias.", "Ayer fuimos al museo y vimos las momias.", "Ayer fuimos al museo y veremos las momias que llegaron de Arequipa.", "Ayer vamos y vimos."),
  pt(FIXIT, "Cuando terminó la clase, los alumnos salen corriendo.", "Cuando terminó la clase, los alumnos salieron corriendo.", "Cuando terminó la clase, los alumnos saldrán corriendo hacia el patio del colegio.", "Salen."),
  pt(FIXIT, "El protagonista abrió la carta y descubre la verdad.", "El protagonista abrió la carta y descubrió la verdad.", "El protagonista abrió la carta y descubrirá la verdad en el último capítulo.", "Abre y descubrió."),
  pt(FIXIT, "Mientras yo estudiaba, mi hermana duerme.", "Mientras yo estudiaba, mi hermana dormía.", "Mientras yo estudiaba, mi hermana dormirá toda la tarde en su cuarto.", "Mientras estudio, dormía."),
  pt(FIXIT, "Si practicas todos los días, mejoraste.", "Si practicas todos los días, mejorarás.", "Si practicas todos los días, mejorabas mucho en la técnica del charango.", "Si practicaste, mejorarás."),
  pt(FIXIT, "En 1879 empieza la guerra y Grau murió en Angamos.", "En 1879 empezó la guerra y Grau murió en Angamos.", "En 1879 empezará la guerra y Grau morirá en Angamos, frente a la costa.", "Empieza y murió."),
];
const PROGRESSIVE: ChoiceItem[] = [
  f("Cuando llegaste, ___ la cena. (preparar, yo)", "estaba preparando", "estoy preparando", "estaré preparando"), f("No interrumpas: ___ un examen. (rendir, ella)", "está rindiendo", "estaba rindiendo", "está rendiendo"),
  f("A esta hora, mañana, ___ por el Amazonas. (navegar, nosotros)", "estaremos navegando", "estábamos navegando", "estamos navegando"), f("Los niños ___ cuando sonó la alarma. (dormir)", "estaban durmiendo", "estaban dormiendo", "están durmiendo"),
  f("¿Qué ___ en este momento? (leer, tú)", "estás leyendo", "estás leiendo", "estabas leyendo"), f("El agua ___ desde hace diez minutos. (hervir)", "está hirviendo", "está herviendo", "estaba hervido"),
  f("Ayer a las cinco ___ en el parque. (correr, yo)", "estaba corriendo", "estoy corriendo", "estaré corriendo"), f("Los científicos ___ el fenómeno desde 2010. (estudiar)", "están estudiando", "estarán estudiando", "estaban estudiado"),
];
const PERFECT: ChoiceItem[] = [
  f("Este mes ya ___ dos novelas. (leer, yo)", "he leído", "había leído", "he leyido"), f("Cuando llegó la ambulancia, el herido ya ___. (despertar)", "había despertado", "ha despertado", "habrá despertado"),
  f("Para el viernes ___ el informe. (terminar, nosotros)", "habremos terminado", "hemos terminado", "habíamos terminado"), f("¿Alguna vez ___ el Manu? (visitar, tú)", "has visitado", "habías visitado", "has visitada"),
  f("Nunca ___ un cóndor tan cerca. (ver, yo)", "había visto", "había vido", "habré vido"), f("Mis primos ___ de Iquitos. (volver)", "han vuelto", "han volvido", "han vuelvido"),
  f("¿Quién ___ en la pizarra? (escribir)", "ha escrito", "ha escribido", "ha escribió"), f("Para cuando lleguen, ya ___ el sol. (ponerse)", "se habrá puesto", "se habrá ponido", "se ha ponido"),
];
const PART = "¿A qué palabra modifica el participio en MAYÚSCULAS?";
const PARTICIPLES: ChoiceItem[] = [
  pt(PART, "La casona, RESTAURADA el año pasado, luce hermosa.", "casona", "año", "hermosa"), pt(PART, "Los niños, CANSADOS de jugar, se durmieron.", "niños", "jugar", "durmieron"),
  pt(PART, "Encontramos una carta ESCRITA en quechua.", "carta", "quechua", "Encontramos"), pt(PART, "Las calles INUNDADAS quedaron cerradas.", "calles", "cerradas", "quedaron"),
  pt(PART, "El libro, PUBLICADO en 1958, sigue vigente.", "libro", "1958", "vigente"), pt(PART, "Vimos un cóndor HERIDO en el camino.", "cóndor", "camino", "Vimos"),
  w("¿Qué palabra de la oración es un participio que funciona como adjetivo? «La puerta cerrada no dejaba pasar a nadie».", "cerrada", "puerta", "dejaba"), w("¿Qué palabra de la oración es un participio que funciona como adjetivo? «Los vecinos, preocupados, llamaron a la policía».", "preocupados", "vecinos", "llamaron"),
];
const GERUND_DOES = sorter(["Modo (cómo)", "Tiempo (cuándo)", "Causa (por qué)", "Condición (si…)"], "¿Qué expresa el gerundio en MAYÚSCULAS?");
const GERUNDS: ChoiceItem[] = [
  ...["Entró al aula SONRIENDO.", "Se ganó la vida VENDIENDO periódicos.", "Aprendió a tocar el cajón ESCUCHANDO discos."].map((x) => GERUND_DOES(x, 0)),
  ...["LLEGANDO a casa, me di cuenta del error.", "CRUZANDO el puente, vimos el río crecido.", "Me quedé dormido VIENDO la película."].map((x) => GERUND_DOES(x, 1)),
  ...["SIENDO tan tarde, cancelamos la reunión.", "TENIENDO fiebre, no fue a clases.", "SABIENDO la verdad, no dijo nada."].map((x) => GERUND_DOES(x, 2)),
  ...["LEYENDO cada día, mejorarás tu vocabulario.", "AHORRANDO un poco, podrás viajar.", "TOMANDO el bus temprano, llegarás a tiempo."].map((x) => GERUND_DOES(x, 3)),
];
const INF = "¿Cuál es la frase de infinitivo de la oración?";
const INFINITIVES: ChoiceItem[] = [
  pt(INF, "Viajar por el Amazonas es mi sueño.", "Viajar por el Amazonas", "es mi sueño", "por el Amazonas es mi sueño de siempre"), pt(INF, "Me gustaría aprender quechua.", "aprender quechua", "Me gustaría", "Me gustaría aprender"),
  pt(INF, "Decidió estudiar Arqueología en San Marcos.", "estudiar Arqueología en San Marcos", "Decidió", "Arqueología"), pt(INF, "Cuidar el agua es responsabilidad de todos.", "Cuidar el agua", "es responsabilidad de todos", "el agua es responsabilidad"),
  pt("¿Qué función cumple el infinitivo en «Leer ayuda a pensar»?", "Leer ayuda a pensar.", "«Leer» es el sujeto.", "«Leer» es el verbo principal conjugado.", "Ninguna"), pt("¿Qué función cumple el infinitivo en «Prefiero caminar»?", "Prefiero caminar.", "Complemento del verbo", "Sujeto", "Adjetivo"),
  pt(INF, "Salimos temprano para alcanzar el tren.", "alcanzar el tren", "Salimos temprano", "Salimos temprano para"), pt(INF, "Es difícil olvidar ese día.", "olvidar ese día", "Es difícil", "ese día"),
];
const MOOD = sorter(["Indicativo (hechos)", "Subjuntivo (deseos, dudas, posibilidades)", "Imperativo (órdenes)"], "¿En qué modo está el verbo en MAYÚSCULAS?");
const MOODS: ChoiceItem[] = [
  ...["Mañana VIAJAMOS a Cusco.", "El río CRECIÓ en febrero.", "Mi abuela TEJE mantas.", "Los alumnos ESTUDIARÁN para el examen."].map((x) => MOOD(x, 0)),
  ...["Ojalá LLUEVA pronto.", "Dudo que VENGA hoy.", "Quiero que me AYUDES.", "Si TUVIERA tiempo, leería más."].map((x) => MOOD(x, 1)),
  ...["CIERRA la puerta, por favor.", "ESTUDIEN para el examen.", "VEN aquí.", "LEE el capítulo tres."].map((x) => MOOD(x, 2)),
];
const MOOD_ERRORS: ChoiceItem[] = [
  pt(FIXIT, "Espero que vienes a la fiesta.", "Espero que vengas a la fiesta.", "Espero que vendrás a la fiesta.", "Espero que veniste a la fiesta."),
  pt(FIXIT, "Si tendría dinero, viajaría a Iquitos.", "Si tuviera dinero, viajaría a Iquitos.", "Si tengo dinero, viajaría a Iquitos.", "Si tendré dinero, viajaría a Iquitos."),
  pt(FIXIT, "Ojalá que mañana no llueve.", "Ojalá que mañana no llueva.", "Ojalá que mañana no lloverá.", "Ojalá que mañana no llovió."),
  pt(FIXIT, "Dudo que él dice la verdad.", "Dudo que él diga la verdad.", "Dudo que él dirá la verdad.", "Dudo que él dijo la verdad."),
  pt(FIXIT, "Quiero que me explicas el problema.", "Quiero que me expliques el problema.", "Quiero que me explicarás el problema.", "Quiero que me explicaste el problema."),
  pt(FIXIT, "Cuando llegarás, avísame.", "Cuando llegues, avísame.", "Cuando llegas, avísame.", "Cuando llegaste, avísame."),
  pt(FIXIT, "Es importante que todos participan.", "Es importante que todos participen.", "Es importante que todos participarán.", "Es importante que todos participaron."),
  pt(FIXIT, "Me alegra que aprobaste.", "Me alegra que hayas aprobado.", "Me alegra que aprobarás.", "Me alegra que apruebas."),
];

export const ROWS: Row[] = [
  ["prefijos-ortografia-1", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["prefijos-ortografia-2", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["prefijos-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "anteayer interrumpir supervisar transbordo comercial ambiental migración comprensión prevención revisión", "a e i o u b v s c z h")])],
  ["raices-ortografia-1", (r) => choose(r, WELL, AUD_YECT)],
  ["raices-ortografia-2", (r) => choose(r, WELL, DIC_DUC)],
  ["raices-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...AUD_YECT, ...DIC_DUC]), (q) => P2.spellHeard(q, "auditorio audiencia proyecto inyección trayectoria predicción diccionario producción traducción conducta", "a e i o u b v s c x j y")])],
  ["b-v-1", (r) => choose(r, WELL, SET_BA)],
  ["b-v-2", (r) => choose(r, WELL, SET_V)],
  ["b-v-3", (r) => P2.spellHeard(r, "estaba caminaban recibir escribir describir invierno envase adverbio olvido invitar", "a e i o u b v m")],
  ["g-tildes-1", (r) => choose(r, WELL, SET_G)],
  ["g-tildes-2", (r) => choose(r, WELL, SET_TILDE)],
  ["g-tildes-3", (r) => P2.spellHeard(r, "origen energía geografía imagen margen árbol también canción rápido difícil", "a e i o u á é í ó g j h")],
  ["g-tildes-4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_BA, ...SET_V, ...SET_G, ...SET_TILDE]), (q) => P2.spellHeard(q, "estaba recibir invierno adverbio origen energía después música", "a e i o u é ú b v g j")])],

  ["oracion-1", (r) => choose(r, "", SENTENCE_KIND)],
  ["oracion-2", (r) => choose(r, "", SUBJECT_PREDICATE)],
  ["oracion-3", (r) => choose(r, "", SIMPLE_SP)],
  ["oracion-4", (r) => choose(r, "", COMPOUND_SP)],
  ["fragmentos-1", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["fragmentos-2", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["fragmentos-3", (r) => choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],

  ["frase-proposicion-1", (r) => choose(r, "", PHRASE_CLAUSE)],
  ["frase-proposicion-2", (r) => choose(r, "", APPOSITIVES)],
  ["subordinadas-1", (r) => choose(r, "", CLAUSES)],
  ["subordinadas-2", (r) => choose(r, "", SIMPLE_COMPOUND_COMPLEX)],
  ["subordinadas-3", (r) => choose(r, "", COMBINE_RELATIVE)],

  ["plurales-1", (r) => choose(r, "", PLURAL_REVIEW)],
  ["plurales-2", (r) => choose(r, "", COMPOUND_PLURALS)],
  ["plurales-3", (r) => choose(r, "", POSSESSIVE_ID)],
  ["plurales-4", (r) => choose(r, "", POSSESSIVE_FORM)],
  ["plurales-5", (r) => choose(r, "", POSSESSIVE_ERRORS)],
  ["plurales-6", (r) => choose(r, "", JOINT_ID)],

  ["antecedentes-1", (r) => choose(r, "", ANTECEDENTS)],
  ["antecedentes-2", (r) => choose(r, "Completa la oración.", AGREE)],
  ["antecedentes-3", (r) => choose(r, "", PRONOUN_SHIFTS)],
  ["antecedentes-4", (r) => choose(r, "", VAGUE_REF)],
  ["antecedentes-5", (r) => choose(r, "", ALL_ANTECEDENTS)],

  ["personales-1", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["personales-2", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["personales-3", (r) => choose(r, "Completa la oración.", COMPOUND_PRONOUNS)],
  ["reflexivos-1", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["reflexivos-2", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],
  ["reflexivos-3", (r) => choose(r, "", REFLEXIVE_INTENSIVE)],
  ["relativos-1", (r) => choose(r, "Completa la oración.", QUIEN)],
  ["relativos-2", (r) => choose(r, "Completa la oración.", RELATIVE_USE)],

  ["transitivos-1", (r) => choose(r, "", TRANSITIVE)],
  ["transitivos-2", (r) => choose(r, "", LINKING)],

  ["concordancia-1", (r) => choose(r, "", AGREEMENT_FIX)],
  ["concordancia-2", (r) => choose(r, "Completa la oración.", INDEFINITE)],
  ["concordancia-3", (r) => choose(r, "Completa la oración.", COMPOUND_SUBJECT)],

  ["tiempos-1", (r) => choose(r, "Completa con el verbo en pasado.", PAST_IRREGULAR)],
  ["tiempos-2", (r) => choose(r, "Completa con el verbo en el tiempo que corresponde.", THREE_TENSES)],
  ["tiempos-3", (r) => choose(r, "", TENSE_SHIFTS)],
  ["tiempos-4", (r) => choose(r, "Completa la oración.", PROGRESSIVE)],
  ["tiempos-5", (r) => choose(r, "Completa la oración.", PERFECT)],
  ["verboides-1", (r) => choose(r, "", PARTICIPLES)],
  ["verboides-2", (r) => choose(r, "", GERUNDS)],
  ["verboides-3", (r) => choose(r, "", INFINITIVES)],
  ["modos-1", (r) => choose(r, "", MOODS)],
  ["modos-2", (r) => choose(r, "", MOOD_ERRORS)],
];
