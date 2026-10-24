import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 3.° de Secundaria · banco de gramática y ortografía (primera parte):
// prefijos bi-, tri-, uni- y sufijos -al, -ano, -ura; bases bio, geo, grafía,
// logía, foto, scopio, tele; -cc-, -ez y -eza, hiatos con tilde, h intermedia;
// leísmo, laísmo y loísmo (le / la / lo); pronombres después de «que» y
// «como» (más alto que yo); relativos (que, quien, quienes, a quien);
// verboides, concordancia, tiempos y modos verbales.


// --- Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("bicentenario", "vicentenario", "bisentenario"), spell("bilingüe", "bilingue", "vilingüe"), spell("bisílabo", "visílabo", "bisílavo"), spell("bimestral", "vimestral", "bimestrál"),
  spell("triángulo", "triangulo", "triánguló"), spell("trimestre", "trimestré", "tremestre"), spell("tricolor", "tricolór", "tricoulor"), spell("trilingüe", "trilingue", "trilinguë"),
  spell("unicelular", "unisselular", "unicelulár"), spell("uniforme", "huniforme", "uniformé"), spell("unilateral", "unilatéral", "hunilateral"), spell("unísono", "unisono", "hunísono"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("ancestral", "ansestral", "ancestrál"), spell("regional", "rejional", "regionál"), spell("mundial", "mundíal", "mumdial"), spell("ciudadano", "ciudadáno", "siudadano"),
  spell("peruano", "peruáno", "perruano"), spell("cotidiano", "cotidíano", "cotideano"), spell("escritura", "escrítura", "escriptura"), spell("ternura", "ternúra", "thernura"),
  spell("agricultura", "agrícultura", "agricultúra"), spell("frescura", "frezcura", "frescúra"), spell("arquitectura", "arquitetura", "arquitectúra"), spell("nacional", "nasional", "nacionál"),
];
const BASES: ChoiceItem[] = [
  spell("biografía", "viografía", "biografia"), spell("biodiversidad", "biodibersidad", "viodiversidad"), spell("geografía", "jeografía", "geografia"), spell("geología", "jeología", "geolojía"),
  spell("caligrafía", "caligrafia", "kaligrafía"), spell("arqueología", "arquiología", "arqueolojía"), spell("fotografía", "fotografia", "fotógrafia"), spell("fotosíntesis", "fotosintesis", "fotosíntezis"),
  spell("telescopio", "teleskopio", "telescópio"), spell("microscopio", "microscópio", "micruscopio"), spell("televisión", "telebisión", "televición"), spell("telepatía", "telepatia", "telepatíá"),
];
const SET_CC: ChoiceItem[] = [
  spell("acción", "ación", "accíon"), spell("dirección", "direción", "direcsión"), spell("lección", "leción", "lecsión"), spell("corrección", "correción", "coreción"),
  spell("infección", "infeción", "infecsión"), spell("construcción", "construción", "construcsión"), spell("satisfacción", "satisfación", "satisfacsión"), spell("diccionario", "dicionario", "dicsionario"),
  spell("perfección", "perfeción", "perfecsión"), spell("instrucción", "instrución", "instrucsión"), spell("reacción", "reación", "reacsión"), spell("protección", "proteción", "protecsión"),
];
const SET_EZ: ChoiceItem[] = [
  spell("vejez", "vejes", "bejez"), spell("rapidez", "rapides", "rápidez"), spell("pobreza", "pobresa", "povreza"), spell("belleza", "bellesa", "beyeza"),
  spell("sencillez", "sencilles", "sensillez"), spell("naturaleza", "naturalesa", "naturalesza"), spell("tristeza", "tristesa", "triztesa"), spell("timidez", "timides", "tímidez"),
  spell("grandeza", "grandesa", "grandeça"), spell("madurez", "madures", "madúrez"), spell("firmeza", "firmesa", "firmezza"), spell("niñez", "niñes", "niñéz"),
];
const SET_HIATO: ChoiceItem[] = [
  spell("día", "dia", "díia"), spell("país", "pais", "paíss"), spell("oído", "oido", "oídó"), spell("baúl", "baul", "bául"),
  spell("búho", "buho", "búo"), spell("reír", "reir", "réir"), spell("maíz", "maiz", "máiz"), spell("ataúd", "ataud", "atáud"),
  spell("tranvía", "tranvia", "tramvía"), spell("Raúl", "Raul", "Rául"), spell("increíble", "increible", "incréible"), spell("geografía", "geografia", "geográfia"),
];
const SET_H: ChoiceItem[] = [
  spell("ahorro", "aorro", "ahorró"), spell("prohibir", "proibir", "prohivir"), spell("vehículo", "veículo", "vehiculo"), spell("deshacer", "desacer", "deshaser"),
  spell("ahijado", "aijado", "ahíjado"), spell("rehén", "reén", "rehen"), spell("cohibido", "coibido", "cohivido"), spell("cohete", "coete", "cohéte"),
  spell("alcohol", "alcool", "alcohól"), spell("zanahoria", "zanaoria", "sanahoria"), spell("ahogar", "aogar", "ahojar"), spell("almohada", "almoada", "almohadá"),
];

// --- Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["La CVR presentó su informe en 2003.", "No sé por qué se retrasó el tren.", "Me pregunto quién ganará las elecciones.", "El museo cierra los lunes."].map((x) => KIND(x, 0)),
  ...["¿Quién escribió «La ciudad y los perros»?", "¿Por qué baja el nivel del Titicaca?", "¿Ya leíste el informe?", "¿Cuándo se fundó Lima?"].map((x) => KIND(x, 1)),
  ...["Cita tus fuentes en formato APA.", "No interrumpan al expositor.", "Revisa la ortografía antes de enviar.", "Apaguen los celulares durante el examen."].map((x) => KIND(x, 2)),
  ...["¡Qué discurso tan conmovedor!", "¡Ganamos la final!", "¡Cuánta gente vino a la marcha!", "¡Qué frío hace en Juliaca!"].map((x) => KIND(x, 3)),
];
const FRAG = "¿Cuál de estas es un fragmento (no una oración completa)?";
const FRAGMENTS: ChoiceItem[] = [
  w(FRAG, "Porque la ley no se cumplía.", "La ley no se cumplía.", "Como la ley no se cumplía, protestaron."), w(FRAG, "El escritor que ganó el premio.", "El escritor ganó el premio.", "El escritor que ganó el premio vive en Arequipa."),
  w(FRAG, "Después de la larga reunión del jueves.", "La reunión fue larga.", "Después de la reunión, todos se fueron."), w(FRAG, "Leyendo el informe con atención.", "Leyó el informe con atención.", "Leyendo con atención, encontró el error."),
  w(FRAG, "Aunque nadie lo esperaba.", "Nadie lo esperaba.", "Aunque nadie lo esperaba, ganaron."), w(FRAG, "Para mejorar la calidad del agua.", "El agua mejoró.", "Instalaron filtros para mejorar el agua."),
];
const RUN = "¿Cuál de estas son oraciones pegadas (sin puntuación ni conector)?";
const RUN_ONS: ChoiceItem[] = [
  w(RUN, "Llovió toda la noche la carretera se cerró.", "Llovió; la cerraron.", "Como llovió toda la noche, la carretera se cerró."), w(RUN, "El jurado deliberó anunció al ganador.", "El jurado anunció.", "Tras deliberar, el jurado anunció al ganador."),
  w(RUN, "Estudió mucho aprobó el examen.", "Estudió mucho, así que aprobó el examen.", "Estudió y aprobó."), w(RUN, "La marcha empezó a las diez terminó a la una.", "La marcha empezó a las diez y terminó a la una.", "La marcha duró tres horas."),
  w(RUN, "Nadie respondió el teléfono sonó tres veces.", "Nadie respondió, aunque el teléfono sonó tres veces.", "Sonó; nadie respondió."), w(RUN, "Se fue la luz encendimos velas.", "Se fue la luz, así que encendimos velas.", "Sin luz, velas."),
];
const PUNCT_FIX = "¿Qué opción corrige el error?";
const FIX_PUNCT: ChoiceItem[] = [
  pt(PUNCT_FIX, "Llovió toda la noche la carretera se cerró.", "Llovió toda la noche; la carretera se cerró.", "Llovió toda la noche, la carretera, se cerró.", "Llovió. Toda la noche la carretera. Se cerró."),
  pt(PUNCT_FIX, "Porque la ley no se cumplía. Los vecinos protestaron.", "Porque la ley no se cumplía, los vecinos protestaron.", "Porque la ley no se cumplía; los vecinos protestaron.", "Porque. La ley no se cumplía los vecinos protestaron."),
  pt(PUNCT_FIX, "Estudió mucho aprobó el examen.", "Estudió mucho y aprobó el examen.", "Estudió, mucho aprobó, el examen.", "Estudió mucho aprobó. El examen."),
  pt(PUNCT_FIX, "Aunque nadie lo esperaba. El equipo ganó.", "Aunque nadie lo esperaba, el equipo ganó.", "Aunque nadie lo esperaba el equipo; ganó.", "Aunque. Nadie lo esperaba el equipo ganó."),
  pt(PUNCT_FIX, "El jurado deliberó anunció al ganador.", "El jurado deliberó. Luego anunció al ganador.", "El jurado, deliberó anunció, al ganador.", "El jurado deliberó anunció; al ganador."),
  pt(PUNCT_FIX, "Leyendo el informe. Encontró el error.", "Leyendo el informe, encontró el error.", "Leyendo el informe; encontró el error.", "Leyendo. El informe encontró el error."),
];

// --- Frases y proposiciones -------------------------------------------------

const PC = sorter(["Frase (no tiene verbo conjugado)", "Proposición (tiene sujeto y verbo conjugado)"], "¿Es una frase o una proposición?");
const PHRASE_CLAUSE: ChoiceItem[] = [
  ...["después de la guerra", "en el corazón de los Andes", "sin ningún temor", "a pesar de las críticas", "durante el conflicto armado", "con la mirada perdida"].map((x) => PC(x, 0)),
  ...["cuando terminó la guerra", "porque nadie lo escuchaba", "que denunció los abusos", "si el Congreso aprueba la ley", "aunque las críticas eran duras", "mientras los cadetes dormían"].map((x) => PC(x, 1)),
];
const PREP = "¿Cuál es la frase con preposición de la oración?";
const PREP_PHRASE: ChoiceItem[] = [
  pt(PREP, "Los testimonios llegaron desde Ayacucho.", "desde Ayacucho", "Los testimonios llegaron", "llegaron"), pt(PREP, "El cadete escribía cartas para sus compañeros.", "para sus compañeros", "El cadete escribía cartas", "cartas"),
  pt(PREP, "La muestra se exhibió en el museo.", "en el museo", "La muestra se exhibió", "se exhibió"), pt(PREP, "Caminaron hacia la plaza principal.", "hacia la plaza principal", "Caminaron", "principal"),
  pt(PREP, "Llegó tarde por el tráfico.", "por el tráfico", "Llegó tarde", "tarde"), pt(PREP, "El poeta de Santiago de Chuco murió en París.", "de Santiago de Chuco", "El poeta", "murió"),
];
const APPO = "¿Cuál es la aposición de la oración?";
const APPOSITIVES: ChoiceItem[] = [
  pt(APPO, "Vargas Llosa, premio Nobel de 2010, nació en Arequipa.", "premio Nobel de 2010", "Vargas Llosa", "Vargas Llosa, premio Nobel de 2010, nació"), pt(APPO, "El LUM, museo de la memoria, está en Miraflores.", "museo de la memoria", "El LUM", "El LUM está en Miraflores"),
  pt(APPO, "Mariátegui, fundador de «Amauta», murió joven.", "fundador de «Amauta»", "Mariátegui", "Mariátegui murió joven a los treinta y cinco años"), pt(APPO, "Visitamos Ayacucho, la ciudad de las iglesias.", "la ciudad de las iglesias", "Ayacucho", "Visitamos Ayacucho"),
  pt(APPO, "El Jaguar, líder del Círculo, era temido.", "líder del Círculo", "El Jaguar", "El Jaguar era temido por todos los cadetes"), pt(APPO, "Leímos «Trilce», poemario de Vallejo.", "poemario de Vallejo", "«Trilce»", "Leímos «Trilce»"),
];
const CLAUSE = sorter(["Proposición principal", "Proposición subordinada"], "La parte en MAYÚSCULAS, ¿es la proposición principal o la subordinada?");
const CLAUSES: ChoiceItem[] = [
  ...["EL CORONEL OCULTÓ LA VERDAD porque temía un escándalo.", "Aunque Gamboa insistió, EL CASO SE CERRÓ.", "LA COMUNIDAD PROTESTARÁ si no llega el agua.", "CONOCÍ AL TESTIGO que declaró ante la CVR."].map((x) => CLAUSE(x, 0)),
  ...["El coronel ocultó la verdad PORQUE TEMÍA UN ESCÁNDALO.", "AUNQUE GAMBOA INSISTIÓ, el caso se cerró.", "La comunidad protestará SI NO LLEGA EL AGUA.", "Conocí al testigo QUE DECLARÓ ANTE LA CVR."].map((x) => CLAUSE(x, 1)),
];
const SCC = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada", "Compuesta con coordinación y subordinación"], "¿Cómo es la oración?");
const SIMPLE_COMPOUND_COMPLEX: ChoiceItem[] = [
  ...["La Comisión recogió miles de testimonios.", "En 1963 se publicó la novela.", "Los cadetes y los oficiales formaron en el patio."].map((x) => SCC(x, 0)),
  ...["Gamboa investigó, pero el coronel lo trasladó.", "Llovió mucho y el río creció.", "¿Lees la novela o ves la película?"].map((x) => SCC(x, 1)),
  ...["El caso se cerró porque el coronel lo ordenó.", "La novela que leímos critica la violencia.", "Si estudias, aprobarás."].map((x) => SCC(x, 2)),
  ...["Gamboa investigó, pero lo trasladaron porque incomodaba.", "Cuando llegó el informe, lo leímos y lo discutimos.", "El cadete que denunció el crimen fue amenazado y se retractó."].map((x) => SCC(x, 3)),
];
const RELATIVE = "¿Cómo se unen mejor las dos oraciones con una proposición de relativo?";
const COMBINE_RELATIVE: ChoiceItem[] = [
  pt(RELATIVE, "Leímos una novela. La novela critica la violencia institucional.", "Leímos una novela que critica la violencia institucional.", "Leímos una novela y la novela critica la violencia institucional en un colegio militar.", "Leímos."),
  pt(RELATIVE, "Visitamos el museo. En ese museo se guardan los testimonios.", "Visitamos el museo donde se guardan los testimonios.", "Visitamos el museo que en ese museo se guardan los testimonios de la época.", "Hay testimonios."),
  pt(RELATIVE, "Conocimos a una escritora. Sus novelas se traducen a diez idiomas.", "Conocimos a una escritora cuyas novelas se traducen a diez idiomas.", "Conocimos a una escritora que sus novelas se traducen a diez idiomas distintos.", "Hay novelas."),
  pt(RELATIVE, "Ese es el teniente. Le contamos la verdad al teniente.", "Ese es el teniente a quien le contamos la verdad.", "Ese es el teniente que le contamos la verdad a él aquella noche en el colegio.", "Contamos."),
  pt(RELATIVE, "Es una causa. Lucharé por esa causa.", "Es una causa por la cual lucharé.", "Es una causa que lucharé por esa causa durante toda mi vida.", "Lucharé."),
];

// --- Sustantivos ---------------------------------------------------------

const PLURAL = (word: string, a: string, ...d: string[]) => w(`¿Cuál es el plural de «${word}»?`, a, ...d);
const PLURAL_REVIEW: ChoiceItem[] = [
  PLURAL("régimen", "regímenes", "régimens", "regimenes"), PLURAL("carácter", "caracteres", "carácteres", "caráctes"), PLURAL("espécimen", "especímenes", "espécimens", "especimenes"),
  PLURAL("tesis", "tesis", "tesises", "tesiss"), PLURAL("currículum", "currículums", "currícula", "currículumes"), PLURAL("club", "clubes", "clubses", "clubos"),
  PLURAL("menú", "menús", "menúes", "menuses"), PLURAL("bambú", "bambúes", "bambuses", "bambúses"), PLURAL("récord", "récords", "récordes", "recórds"),
  PLURAL("análisis", "análisis", "análisises", "análisiss"), PLURAL("lápiz", "lápices", "lápizes", "lápises"), PLURAL("dólar", "dólares", "dólars", "dolares"),
];
const COMPOUND_PLURALS: ChoiceItem[] = [
  PLURAL("cortometraje", "cortometrajes", "cortosmetrajes", "cortometrajeses"), PLURAL("hombre lobo", "hombres lobo", "hombre lobos", "hombres lobos"), PLURAL("el guardacostas", "los guardacostas", "los guardacostases", "los guardascostas"),
  PLURAL("año luz", "años luz", "año luces", "años luces"), PLURAL("país miembro", "países miembro", "país miembros", "paises miembros"), PLURAL("altorrelieve", "altorrelieves", "altosrelieves", "altorrelievees"),
  PLURAL("el portaaviones", "los portaaviones", "los portaavioneses", "los portasaviones"), PLURAL("sordomudo", "sordomudos", "sordosmudos", "sordomudoes"), PLURAL("ciudad dormitorio", "ciudades dormitorio", "ciudad dormitorios", "ciudades dormitorios"),
  PLURAL("bocacalle", "bocacalles", "bocascalles", "bocacallees"), PLURAL("el cumpleaños", "los cumpleaños", "los cumpleañoses", "los cumplesaños"), PLURAL("pez espada", "peces espada", "pez espadas", "peces espadas"),
];

// --- Pronombres ---------------------------------------------------------------

const FIXIT = "¿Cómo se corrige la oración?";
const LEISMO: ChoiceItem[] = [
  pt(FIXIT, "A María la dije que viniera temprano.", "A María le dije que viniera temprano.", "A María lo dije que viniera temprano.", "A María les dije que viniera temprano."),
  pt(FIXIT, "A mis primas les vi en el mercado.", "A mis primas las vi en el mercado.", "A mis primas los vi en el mercado.", "A mis primas le vi en el mercado."),
  pt(FIXIT, "A los alumnos lo entregaron sus diplomas.", "A los alumnos les entregaron sus diplomas.", "A los alumnos los entregaron sus diplomas.", "A los alumnos le entregaron sus diplomas."),
  pt(FIXIT, "La mesa le compré en Huancayo.", "La mesa la compré en Huancayo.", "La mesa lo compré en Huancayo.", "La mesa les compré en Huancayo."),
  pt(FIXIT, "A mi abuela la regalé una manta.", "A mi abuela le regalé una manta.", "A mi abuela lo regalé una manta.", "A mi abuela las regalé una manta."),
  pt(FIXIT, "Los libros les dejé en la mesa.", "Los libros los dejé en la mesa.", "Los libros le dejé en la mesa.", "Los libros las dejé en la mesa."),
];
const SUBJ_OBJ: ChoiceItem[] = [
  f("A ___ me preocupa el cambio climático.", "mí", "yo", "me"), f("___ y mi hermana organizamos la colecta.", "Yo", "Mí", "Me"),
  f("Esto queda entre tú y ___.", "yo", "mí", "me"), f("Lo hicieron por ti y por ___.", "mí", "yo", "me"),
  f("Vi a las artesanas y ___ felicité.", "las", "les", "la"), f("A los testigos ___ pidieron declarar.", "les", "los", "le"),
  f("Le entregué la carta a ___.", "él", "lo", "le"), f("Conmigo y ___ no cuenten.", "contigo", "con ti", "con tú"),
];
const THAN_AS: ChoiceItem[] = [
  f("Mi hermana es más alta que ___.", "yo", "mí", "me"), f("Nadie lee tanto como ___.", "tú", "ti", "te"),
  f("Ella corre más rápido que ___.", "él", "lo", "le"), f("Nadie sabe tanto como ___.", "nosotros", "nos", "nuestro"),
  f("Tú escribes mejor que ___.", "yo", "mí", "me"), f("Ellos trabajan igual que ___.", "ella", "la", "le"),
  f("Excepto ___, todos llegaron.", "yo", "mí", "me"), f("Según ___, el examen fue fácil.", "tú", "ti", "te"),
];
const QUIEN_FIX: ChoiceItem[] = [
  pt(FIXIT, "Los vecinos, quien estaban molestos, protestaron.", "Los vecinos, quienes estaban molestos, protestaron.", "Los vecinos, que quien estaban molestos, protestaron.", "Los vecinos, cuyos estaban molestos, protestaron."),
  pt(FIXIT, "Es la casa quien construyó mi abuelo.", "Es la casa que construyó mi abuelo.", "Es la casa a quien construyó mi abuelo.", "Es la casa quienes construyó mi abuelo."),
  pt(FIXIT, "El alumno quien ganó es mi primo.", "El alumno que ganó es mi primo.", "El alumno quienes ganó es mi primo.", "El alumno cual ganó es mi primo."),
  pt(FIXIT, "Ellos son quien firmaron la carta.", "Ellos son quienes firmaron la carta.", "Ellos son quien firmó la carta.", "Ellos son cuyos firmaron la carta."),
  pt(FIXIT, "La señora quien hablé vende emoliente.", "La señora con quien hablé vende emoliente.", "La señora quienes hablé vende emoliente.", "La señora cuya hablé vende emoliente."),
  pt(FIXIT, "El perro quien ladra es del vecino.", "El perro que ladra es del vecino.", "El perro a quien ladra es del vecino.", "El perro quienes ladra es del vecino."),
];
const QUIEN: ChoiceItem[] = [
  f("Es el periodista a ___ entrevistamos.", "quien", "que", "cual"), f("Los testigos, ___ habían sufrido mucho, declararon.", "quienes", "quien", "cuales"),
  f("La autora con ___ conversamos vive en Cusco.", "quien", "que", "quienes"), f("___ quiera participar debe inscribirse.", "Quien", "Que", "Cual"),
  f("No sé a ___ preguntarle.", "quién", "quien", "que"), f("Son ellas ___ organizaron la feria.", "quienes", "quien", "las que que"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("La comunidad ___ tierras fueron despojadas resistió.", "cuyas", "cuyos", "que sus"), f("El pueblo ___ nació Arguedas está en Apurímac.", "donde", "cuyo", "quien"),
  f("Es un tema sobre el ___ hay mucho que decir.", "cual", "quien", "cuyo"), f("La novela ___ autor es arequipeño ganó un premio.", "cuyo", "cuya", "que su"),
  f("La razón por la ___ protestaron era justa.", "cual", "quien", "cuya"), f("Los testimonios ___ recogió la CVR son públicos.", "que", "quienes", "cuyos"),
];
const VAGUE = "¿Qué oración tiene una referencia ambigua del pronombre?";
const VAGUE_REF: ChoiceItem[] = [
  w(VAGUE, "Alberto le dijo a Gamboa que él conocía al culpable.", "Alberto le dijo a Gamboa que conocía al culpable del crimen en el colegio.", "Alberto le dijo a Gamboa: «Conozco al culpable»."), w(VAGUE, "Cuando la ministra se reunió con la alcaldesa, ella estaba molesta.", "La ministra estaba molesta cuando se reunió con la alcaldesa del distrito.", "La alcaldesa estaba molesta cuando se reunió con la ministra."),
  w(VAGUE, "Sacaron los documentos de las cajas y las quemaron.", "Sacaron los documentos de las cajas y quemaron las cajas vacías después.", "Quemaron las cajas después de sacar los documentos."), w(VAGUE, "Mi madre habló con mi tía sobre su hija.", "Mi madre habló con mi tía sobre la hija de mi tía, que vive en Tacna.", "Mi madre y mi tía hablaron sobre mi prima."),
];
const ALL_ANT = "¿Cuáles son todos los antecedentes posibles del pronombre en MAYÚSCULAS?";
const ALL_ANTECEDENTS: ChoiceItem[] = [
  pt(ALL_ANT, "Alberto le dijo a Gamboa que ÉL conocía al culpable.", "Alberto o Gamboa", "Solo Alberto, que es quien habla", "Solo Gamboa"), pt(ALL_ANT, "La ministra se reunió con la alcaldesa cuando ELLA llegó.", "La ministra o la alcaldesa", "Solo la ministra, que convocó la reunión", "Solo la alcaldesa"),
  pt(ALL_ANT, "Sacaron los documentos de las cajas y LAS quemaron.", "Solo las cajas", "Los documentos o las cajas, sin distinción", "Solo los documentos"), pt(ALL_ANT, "Mi madre habló con mi tía sobre SU hija.", "Mi madre o mi tía", "Solo mi madre, que inició la conversación", "Solo mi tía"),
];
const SHIFT = "¿Cómo se corrige el cambio indebido de pronombre?";
const PRONOUN_SHIFTS: ChoiceItem[] = [
  pt(SHIFT, "Cuando uno lee esa novela, te das cuenta de la violencia.", "Cuando uno lee esa novela, se da cuenta de la violencia.", "Cuando uno lee esa novela, nos damos cuenta todos de la violencia del colegio.", "Te das cuenta."),
  pt(SHIFT, "Los ciudadanos deben informarse antes de que votes.", "Los ciudadanos deben informarse antes de votar.", "Los ciudadanos deben informarse antes de que votemos todos juntos en las elecciones.", "Vota."),
  pt(SHIFT, "Si uno no cita las fuentes, cometes plagio.", "Si uno no cita las fuentes, comete plagio.", "Si uno no cita las fuentes, cometemos todos plagio y nos sancionan en el colegio.", "Plagias."),
  pt(SHIFT, "Cada alumno debe revisar su ensayo; ustedes no pueden entregarlo con errores.", "Cada alumno debe revisar su ensayo; no puede entregarlo con errores.", "Cada alumno debe revisar su ensayo; nosotros no podemos entregarlo nunca con errores.", "Revisen."),
];

// --- Tipos de verbos -------------------------------------------------------

const TI = sorter(["Transitivo", "Intransitivo"], "El verbo en MAYÚSCULAS, ¿es transitivo o intransitivo?");
const TRANSITIVE: ChoiceItem[] = [
  ...["La Comisión RECOGIÓ testimonios.", "Alberto ESCRIBÍA cartas.", "El coronel OCULTÓ la verdad.", "Los vecinos SEMBRARON árboles."].map((x) => TI(x, 0)),
  ...["El Esclavo MURIÓ días después.", "Los cadetes MARCHABAN al amanecer.", "El río CRECIÓ.", "La delegación LLEGÓ tarde."].map((x) => TI(x, 1)),
];
const LINK = sorter(["Atributo: adjetivo", "Atributo: sustantivo"], "¿Qué tipo de atributo tiene el verbo copulativo?");
const LINKING: ChoiceItem[] = [
  ...["El Jaguar era temible.", "La investigación parecía imposible.", "El informe fue contundente.", "Los testimonios son desgarradores."].map((x) => LINK(x, 0)),
  ...["Gamboa era teniente.", "Vargas Llosa es novelista.", "La CVR fue una comisión independiente.", "Ese cadete parecía un niño."].map((x) => LINK(x, 1)),
];
const PART = "¿A qué palabra modifica el participio en MAYÚSCULAS?";
const PARTICIPLES: ChoiceItem[] = [
  pt(PART, "Los testimonios, RECOGIDOS en todo el país, conmovieron a todos.", "testimonios", "país", "todos"), pt(PART, "El cadete, HUMILLADO por los mayores, no habló.", "cadete", "mayores", "habló"),
  pt(PART, "Encontraron una carta ESCRITA a mano.", "carta", "mano", "Encontraron"), pt(PART, "Los pueblos ABANDONADOS quedaron en silencio.", "pueblos", "silencio", "quedaron"),
  pt(PART, "La novela, PUBLICADA en 1963, causó polémica.", "novela", "1963", "polémica"), pt(PART, "Vimos una casa DESTRUIDA por el sismo.", "casa", "sismo", "Vimos"),
];
const GERUND_DOES = sorter(["Modo (cómo)", "Tiempo (cuándo)", "Causa (por qué)", "Condición (si…)"], "¿Qué expresa el gerundio en MAYÚSCULAS?");
const GERUNDS: ChoiceItem[] = [
  ...["Respondió SONRIENDO.", "Aprendió el oficio OBSERVANDO a su padre."].map((x) => GERUND_DOES(x, 0)),
  ...["SALIENDO del colegio, vio a Teresa.", "CRUZANDO la plaza, escuchó el disparo."].map((x) => GERUND_DOES(x, 1)),
  ...["TEMIENDO un escándalo, el coronel calló.", "SIENDO tan tarde, cerraron el caso."].map((x) => GERUND_DOES(x, 2)),
  ...["ESTUDIANDO así, aprobarás.", "CITANDO las fuentes, evitarás el plagio."].map((x) => GERUND_DOES(x, 3)),
];
const INF = "¿Cuál es la frase de infinitivo de la oración?";
const INFINITIVES: ChoiceItem[] = [
  pt(INF, "Recordar el pasado es una responsabilidad.", "Recordar el pasado", "es una responsabilidad", "el pasado es una responsabilidad de todos"), pt(INF, "Alberto decidió denunciar al Jaguar.", "denunciar al Jaguar", "Alberto decidió", "Alberto decidió denunciar"),
  pt(INF, "Es difícil olvidar esos años.", "olvidar esos años", "Es difícil", "esos años"), pt(INF, "Trabajaron para reconstruir el pueblo.", "reconstruir el pueblo", "Trabajaron", "Trabajaron para"),
  pt("¿Qué función cumple el infinitivo en «Leer es viajar»?", "Leer es viajar.", "«Leer» es el sujeto.", "«Leer» es el verbo principal conjugado de la oración.", "Ninguna"), pt("¿Qué función cumple el infinitivo en «Quiero estudiar Derecho»?", "Quiero estudiar Derecho.", "Complemento del verbo", "Sujeto", "Adjetivo"),
];

// --- Concordancia ---------------------------------------------------------

const AGREEMENT_FIX: ChoiceItem[] = [
  pt(FIXIT, "El grupo de cadetes formaron en el patio.", "El grupo de cadetes formó en el patio.", "El grupo de cadete formaron en el patio.", "Los grupo de cadetes formó en el patio."),
  pt(FIXIT, "Se recogió miles de testimonios.", "Se recogieron miles de testimonios.", "Se recogimos miles de testimonios.", "Se recogió mil testimonio."),
  pt(FIXIT, "Le preocupan la situación del país.", "Le preocupa la situación del país.", "Le preocupamos la situación del país.", "Les preocupan la situación de los países."),
  pt(FIXIT, "La gente del pueblo se quejaron del ruido.", "La gente del pueblo se quejó del ruido.", "La gente del pueblo nos quejamos del ruido.", "Las gentes del pueblo se quejó del ruido."),
  pt(FIXIT, "Existe muchas razones para protestar.", "Existen muchas razones para protestar.", "Existimos muchas razones para protestar.", "Existe mucha razones para protestar."),
  pt(FIXIT, "El conjunto de pruebas demuestran su inocencia.", "El conjunto de pruebas demuestra su inocencia.", "El conjunto de prueba demuestran su inocencia.", "Los conjunto de pruebas demuestra su inocencia."),
];
const INDEFINITE: ChoiceItem[] = [
  pt(FIXIT, "Cada uno de los testigos declararon.", "Cada uno de los testigos declaró.", "Cada uno declararon.", "Cada uno de los testigos declaramos."),
  pt(FIXIT, "Nadie sabían la verdad.", "Nadie sabía la verdad.", "Nadie sabíamos la verdad.", "Nadie sabían."),
  pt(FIXIT, "Ninguno de los cadetes hablaron.", "Ninguno de los cadetes habló.", "Ninguno hablaron.", "Ningunos de los cadetes habló."),
  pt(FIXIT, "Alguien dejaron la puerta abierta.", "Alguien dejó la puerta abierta.", "Alguien dejamos la puerta abierta.", "Alguien dejaron."),
  pt(FIXIT, "Todos aplaudió al final.", "Todos aplaudieron al final.", "Todos aplaudimos al final, y él también.", "Todo aplaudieron al final."),
  pt(FIXIT, "Cualquiera de ustedes pueden responder.", "Cualquiera de ustedes puede responder.", "Cualquiera de ustedes podemos responder.", "Cualquiera pueden."),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  pt(FIXIT, "Gamboa y Alberto sospechaba del Jaguar.", "Gamboa y Alberto sospechaban del Jaguar.", "Gamboa y Alberto sospechábamos del Jaguar.", "Gamboa y Alberto sospechó del Jaguar."),
  pt(FIXIT, "Tú y yo presentarán el trabajo.", "Tú y yo presentaremos el trabajo.", "Tú y yo presentarás el trabajo.", "Tú y yo presentará el trabajo."),
  pt(FIXIT, "El director, junto con los profesores, inauguraron la feria.", "El director, junto con los profesores, inauguró la feria.", "El director, junto con los profesores, inauguramos la feria.", "Los director, junto con los profesores, inauguró la feria."),
  pt(FIXIT, "La lluvia y el viento destruyó los techos.", "La lluvia y el viento destruyeron los techos.", "La lluvia y el viento destruimos los techos.", "La lluvia y los vientos destruyó el techo."),
  pt(FIXIT, "Tú y tu hermana está invitadas.", "Tú y tu hermana están invitadas.", "Tú y tu hermana estamos invitadas.", "Tú y tu hermana estás invitada."),
  pt(FIXIT, "Rosa y yo cantan en el coro.", "Rosa y yo cantamos en el coro.", "Rosa y yo canta en el coro.", "Rosa y yo cantas en el coro."),
];

// --- Tiempos y modos -------------------------------------------------------

const PROGRESSIVE: ChoiceItem[] = [
  f("Cuando sonó la alarma, los cadetes ___. (dormir)", "estaban durmiendo", "estaban dormiendo", "están durmiendo"), f("No interrumpas: el jurado ___. (deliberar)", "está deliberando", "estaba deliberado", "estará deliberado"),
  f("A esta hora, mañana, ___ en Cusco. (aterrizar, nosotros)", "estaremos aterrizando", "estábamos aterrizando", "estamos aterrizado"), f("¿Qué ___ ahora? (leer, tú)", "estás leyendo", "estás leiendo", "estabas leído"),
  f("Ayer a las seis ___ el informe. (redactar, yo)", "estaba redactando", "estoy redactando", "estaré redactado"), f("Los científicos ___ el glaciar desde 2015. (estudiar)", "están estudiando", "estaban estudiado", "estarán estudiado"),
];
const PERFECT: ChoiceItem[] = [
  f("Este año ya ___ tres novelas peruanas. (leer, yo)", "he leído", "había leído", "he leyido"), f("Cuando llegó la policía, el ladrón ya ___. (huir)", "había huido", "ha huido", "había huyido"),
  f("Para julio, ___ el proyecto. (terminar, nosotros)", "habremos terminado", "hemos terminado", "habíamos terminando"), f("Nunca ___ algo tan conmovedor. (ver, yo)", "había visto", "había vido", "habré vido"),
  f("¿Quién ___ la ventana? (abrir)", "ha abierto", "ha abrido", "ha abrió"), f("Para cuando llegues, ya ___ el sol. (ponerse)", "se habrá puesto", "se habrá ponido", "se ha ponido"),
];
const TENSE_SHIFTS: ChoiceItem[] = [
  pt(FIXIT, "Alberto vio el crimen y decide denunciarlo.", "Alberto vio el crimen y decidió denunciarlo.", "Alberto vio el crimen y decidirá denunciarlo ante el teniente Gamboa al día siguiente.", "Ve y decidió."),
  pt(FIXIT, "Cuando terminó la reunión, todos salen.", "Cuando terminó la reunión, todos salieron.", "Cuando terminó la reunión, todos saldrán corriendo hacia la plaza principal.", "Salen."),
  pt(FIXIT, "Mientras el jurado deliberaba, el público espera.", "Mientras el jurado deliberaba, el público esperaba.", "Mientras el jurado deliberaba, el público esperará impaciente en la sala.", "Espera."),
  pt(FIXIT, "En 2003, la CVR entrega su informe y propuso reparaciones.", "En 2003, la CVR entregó su informe y propuso reparaciones.", "En 2003, la CVR entregará su informe y propondrá reparaciones a las víctimas.", "Entrega."),
];
const MOOD = sorter(["Indicativo (hechos)", "Subjuntivo (deseos, dudas, posibilidades)", "Imperativo (órdenes)"], "¿En qué modo está el verbo en MAYÚSCULAS?");
const MOODS: ChoiceItem[] = [
  ...["El coronel OCULTÓ la verdad.", "La CVR ENTREGARÁ su informe.", "Los cadetes MARCHAN cada mañana."].map((x) => MOOD(x, 0)),
  ...["Ojalá SE HAGA justicia.", "Dudo que el coronel CONFIESE.", "Si TUVIERA pruebas, lo denunciaría."].map((x) => MOOD(x, 1)),
  ...["DI la verdad.", "CITEN sus fuentes.", "NO OLVIDES a las víctimas."].map((x) => MOOD(x, 2)),
];
const MOOD_ERRORS: ChoiceItem[] = [
  pt(FIXIT, "Espero que el jurado decide pronto.", "Espero que el jurado decida pronto.", "Espero que el jurado decidirá pronto.", "Espero que el jurado decidió pronto."),
  pt(FIXIT, "Si habría sabido, te habría avisado.", "Si hubiera sabido, te habría avisado.", "Si sabría, te habría avisado.", "Si he sabido, te habría avisado."),
  pt(FIXIT, "Es necesario que todos participan.", "Es necesario que todos participen.", "Es necesario que todos participarán.", "Es necesario que todos participaron."),
  pt(FIXIT, "No creo que él tiene razón.", "No creo que él tenga razón.", "No creo que él tendrá razón.", "No creo que él tuvo razón."),
  pt(FIXIT, "Cuando terminarás, avísame.", "Cuando termines, avísame.", "Cuando terminas, avísame.", "Cuando terminaste, avísame."),
  pt(FIXIT, "Me alegra que viniste.", "Me alegra que hayas venido.", "Me alegra que vendrás.", "Me alegra que vienes."),
];

export const ROWS: Row[] = [
  ["prefijos-ortografia-1", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["prefijos-ortografia-2", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["prefijos-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "bicentenario bisílabo trimestre tricolor uniforme ancestral regional ciudadano escritura ternura", "a e i o u b v s c z")])],
  ["bases-cultas", (r) => mix(r, [(q) => choose(q, WELL, BASES), (q) => P2.spellHeard(q, "biografía geografía caligrafía arqueología fotografía telescopio microscopio televisión", "a e i o u í b v g j s c")])],
  ["cc-ez-1", (r) => choose(r, WELL, SET_CC)],
  ["cc-ez-2", (r) => choose(r, WELL, SET_EZ)],
  ["cc-ez-3", (r) => P2.spellHeard(r, "acción dirección lección corrección construcción vejez rapidez pobreza belleza tristeza", "a e i o u ó c s z x")],
  ["hiatos-h-1", (r) => choose(r, WELL, SET_HIATO)],
  ["hiatos-h-2", (r) => choose(r, WELL, SET_H)],
  ["hiatos-h-3", (r) => P2.spellHeard(r, "día país oído baúl maíz ahorro prohibir vehículo cohete zanahoria", "a e i o u í ú h b v")],
  ["hiatos-h-4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_CC, ...SET_EZ, ...SET_HIATO, ...SET_H]), (q) => P2.spellHeard(q, "acción lección vejez belleza país oído ahorro cohete", "a e i o u í ó c s z h")])],

  ["tipos-oracion-1", (r) => choose(r, "", SENTENCE_KIND)],
  ["tipos-oracion-2", (r) => choose(r, "", FRAGMENTS)],
  ["tipos-oracion-3", (r) => choose(r, "", RUN_ONS)],
  ["tipos-oracion-4", (r) => choose(r, "", FIX_PUNCT)],

  ["frase-proposicion-1", (r) => choose(r, "", PHRASE_CLAUSE)],
  ["frase-proposicion-2", (r) => choose(r, "", PREP_PHRASE)],
  ["frase-proposicion-3", (r) => choose(r, "", APPOSITIVES)],
  ["subordinadas-1", (r) => choose(r, "", CLAUSES)],
  ["subordinadas-2", (r) => choose(r, "", SIMPLE_COMPOUND_COMPLEX)],
  ["subordinadas-3", (r) => choose(r, "", COMBINE_RELATIVE)],

  ["plurales-1", (r) => choose(r, "", PLURAL_REVIEW)],
  ["plurales-2", (r) => choose(r, "", COMPOUND_PLURALS)],

  ["leismo", (r) => choose(r, "", LEISMO)],
  ["sujeto-complemento-1", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["sujeto-complemento-2", (r) => choose(r, "Completa la oración.", THAN_AS)],
  ["relativos-1", (r) => choose(r, "", QUIEN_FIX)],
  ["relativos-2", (r) => choose(r, "Completa la oración.", QUIEN)],
  ["relativos-3", (r) => choose(r, "Completa la oración.", RELATIVE_USE)],
  ["antecedentes-1", (r) => choose(r, "", VAGUE_REF)],
  ["antecedentes-2", (r) => choose(r, "", ALL_ANTECEDENTS)],
  ["antecedentes-3", (r) => choose(r, "", PRONOUN_SHIFTS)],

  ["tipos-verbos-1", (r) => choose(r, "", TRANSITIVE)],
  ["tipos-verbos-2", (r) => choose(r, "", LINKING)],
  ["tipos-verbos-3", (r) => choose(r, "", PARTICIPLES)],
  ["tipos-verbos-4", (r) => choose(r, "", GERUNDS)],
  ["tipos-verbos-5", (r) => choose(r, "", INFINITIVES)],

  ["concordancia-1", (r) => choose(r, "", AGREEMENT_FIX)],
  ["concordancia-2", (r) => choose(r, "", INDEFINITE)],
  ["concordancia-3", (r) => choose(r, "", COMPOUND_SUBJECT)],

  ["tiempos-modos-1", (r) => choose(r, "Completa la oración.", PROGRESSIVE)],
  ["tiempos-modos-2", (r) => choose(r, "Completa la oración.", PERFECT)],
  ["tiempos-modos-3", (r) => choose(r, "", TENSE_SHIFTS)],
  ["tiempos-modos-4", (r) => choose(r, "", MOODS)],
  ["tiempos-modos-5", (r) => choose(r, "", MOOD_ERRORS)],
];
