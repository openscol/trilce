import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 1.° de Secundaria · banco de gramática y ortografía (primera parte):
// prefijos ad-, de- y sufijos -ivo, -oso; raíces spect, vis, form, rupt; ll e
// y, c/s/z, x, h inicial; frase y proposición, oración compuesta con
// coordinación y subordinación; pertenencia; pronombres (yo, mí, que, quien, a
// quien), reflexivos y enfáticos; el gerundio y lo que expresa; infinitivos.


// --- Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("adquirir", "aquirir", "adquerir"), spell("adyacente", "adjacente", "adiacente"), spell("advertencia", "abvertencia", "adbertencia"), spell("adherir", "aderir", "adherír"),
  spell("adjuntar", "ajuntar", "adjumtar"), spell("admirar", "amirar", "admirrar"), spell("decrecer", "decreser", "decrezer"), spell("devaluar", "debaluar", "devaluár"),
  spell("demoler", "dimoler", "demolér"), spell("deformar", "deformár", "diformar"), spell("delimitar", "dilimitar", "delimitár"), spell("depositar", "depocitar", "deposítar"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("decisivo", "decisibo", "decicivo"), spell("explosivo", "esplosivo", "explosibo"), spell("creativo", "creatibo", "criativo"), spell("atractivo", "atrativo", "atractibo"),
  spell("nocivo", "nosivo", "nocibo"), spell("ofensivo", "ofencivo", "ofensibo"), spell("generoso", "generozo", "jeneroso"), spell("peligroso", "peligrozo", "pelijroso"),
  spell("misterioso", "misteriozo", "mistirioso"), spell("luminoso", "luminozo", "lumimoso"), spell("espacioso", "espaciozo", "espasioso"), spell("ruidoso", "ruidozo", "ruídoso"),
];
const SPECT_VIS: ChoiceItem[] = [
  spell("espectador", "expectador", "espetador"), spell("inspección", "inspeción", "inspexión"), spell("perspectiva", "perspetiva", "prespectiva"), spell("espectáculo", "expectáculo", "espetáculo"),
  spell("visible", "vizible", "bisible"), spell("revisar", "rebisar", "revizar"), spell("televisión", "telebisión", "televición"), spell("evidencia", "ebidencia", "evidensia"),
  spell("previsión", "previción", "prebisión"), spell("visitante", "bisitante", "vicitante"), spell("supervisar", "superbisar", "supervizar"), spell("respetuoso", "respectuoso", "respetuozo"),
];
const FORM_RUPT: ChoiceItem[] = [
  spell("información", "imformación", "informasión"), spell("uniforme", "uniformé", "unifórme"), spell("transformación", "tranformación", "transformasión"), spell("formulario", "formolario", "fórmulario"),
  spell("deforme", "diforme", "deformé"), spell("reformar", "riformar", "reformár"), spell("interrupción", "interrución", "interumpción"), spell("erupción", "erupsión", "irupción"),
  spell("corrupto", "corruto", "corupto"), spell("ruptura", "rutura", "roptura"), spell("abrupto", "abruto", "avrupto"), spell("irrumpir", "irumpir", "irrunpir"),
];
const SET_LLY: ChoiceItem[] = [
  spell("llovizna", "yovizna", "llobizna"), spell("ensayo", "ensallo", "enzayo"), spell("rayo", "rallo", "rraiyo"), spell("cuello", "cueyo", "cuelo"),
  spell("apoyar", "apollar", "apoiar"), spell("desarrollo", "desarroyo", "desarolo"), spell("joya", "jolla", "goya"), spell("payaso", "pallaso", "payazo"),
  spell("millonario", "miyonario", "milonario"), spell("yema", "llema", "iema"), spell("bullicio", "buyicio", "bullisio"), spell("trayecto", "trallecto", "trayeto"),
];
const SET_CSZ: ChoiceItem[] = [
  spell("cereza", "sereza", "cerreza"), spell("conciencia", "consiencia", "conciensia"), spell("escasez", "escases", "ezcasez"), spell("nacimiento", "nasimiento", "nacimíento"),
  spell("sencillez", "sencilles", "sensillez"), spell("preciso", "presiso", "precizo"), spell("análisis", "análicis", "análizis"), spell("cocina", "cosina", "cozina"),
  spell("zigzag", "sigsag", "zigsag"), spell("francés", "franzés", "fransés"), spell("vejez", "vejes", "bejez"), spell("necesario", "nesesario", "necezario"),
];
const SET_X: ChoiceItem[] = [
  spell("examen", "esamen", "ecsamen"), spell("exhausto", "exausto", "esausto"), spell("extranjero", "estranjero", "extrangero"), spell("expectativa", "espectativa", "expetativa"),
  spell("excelente", "exelente", "escelente"), spell("exacto", "esacto", "egzacto"), spell("texto", "testo", "tecsto"), spell("auxilio", "ausilio", "auxílio"),
  spell("próximo", "prócimo", "prósimo"), spell("sexto", "sesto", "secsto"), spell("extraordinario", "estraordinario", "extraordinarío"), spell("exhalar", "exalar", "esalar"),
];
const SET_H: ChoiceItem[] = [
  spell("huevo", "uevo", "güevo"), spell("hielo", "ielo", "yelo"), spell("hueso", "ueso", "güeso"), spell("humano", "umano", "jumano"),
  spell("hidratar", "idratar", "hidratár"), spell("hipótesis", "ipótesis", "hipótesís"), spell("horizonte", "orizonte", "horisonte"), spell("hormiga", "ormiga", "hormíga"),
  spell("huella", "uella", "hueya"), spell("herencia", "erencia", "herensia"), spell("hexágono", "exágono", "hexájono"), spell("hemisferio", "emisferio", "hemisfério"),
];

// --- Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["El Colca es uno de los cañones más profundos del mundo.", "No sé si vendrá mañana.", "Los resultados del concurso aún no se publican.", "Quisiera saber dónde nació Chabuca Granda."].map((x) => KIND(x, 0)),
  ...["¿Dónde nació Chabuca Granda?", "¿Cuántos departamentos tiene el Perú?", "¿Ya leíste «Paco Yunque»?", "¿Por qué se seca el lago?"].map((x) => KIND(x, 1)),
  ...["Apaga la luz al salir.", "No corran por los pasillos.", "Lee el capítulo tres para mañana.", "Traigan sus cuadernos, por favor."].map((x) => KIND(x, 2)),
  ...["¡Qué alto es el Huascarán!", "¡Ganamos el campeonato!", "¡Cuánta gente vino a la procesión!", "¡Qué rico huele ese pan!"].map((x) => KIND(x, 3)),
];
const SUBJECT_PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el sujeto completo?", "Las alpacas de la comunidad pastan cerca del lago.", "Las alpacas de la comunidad", "Las alpacas", "pastan cerca del lago"), pt("¿Cuál es el predicado completo?", "Las alpacas de la comunidad pastan cerca del lago.", "pastan cerca del lago", "pastan", "de la comunidad pastan"),
  pt("¿Cuál es el sujeto completo?", "En la plaza de Ayacucho se celebró la Semana Santa.", "la Semana Santa", "En la plaza de Ayacucho", "se celebró la Semana Santa"), pt("¿Cuál es el predicado completo?", "El poeta de Santiago de Chuco escribió «Los heraldos negros».", "escribió «Los heraldos negros»", "escribió", "El poeta de Santiago de Chuco escribió"),
  pt("¿Cuál es el sujeto completo?", "A mi hermano menor le encantan los videojuegos.", "los videojuegos", "A mi hermano menor", "le encantan los videojuegos"), pt("¿Cuál es el predicado completo?", "Los estudiantes de quinto organizaron una feria de ciencias.", "organizaron una feria de ciencias", "organizaron", "Los estudiantes de quinto organizaron"),
  pt("¿Cuál es el sujeto completo?", "Llegaron tarde los músicos de la banda.", "los músicos de la banda", "Llegaron tarde", "la banda"), pt("¿Cuál es el predicado completo?", "Mi abuela materna prepara un cebiche delicioso.", "prepara un cebiche delicioso", "prepara", "Mi abuela materna prepara"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto?", "Las alpacas de la comunidad pastan cerca del lago.", "alpacas", "comunidad", "lago"), pt("¿Cuál es el núcleo del predicado?", "Las alpacas de la comunidad pastan cerca del lago.", "pastan", "lago", "alpacas"),
  pt("¿Cuál es el núcleo del sujeto?", "El poeta de Santiago de Chuco escribió «Los heraldos negros».", "poeta", "Santiago", "heraldos"), pt("¿Cuál es el núcleo del predicado?", "Los estudiantes de quinto organizaron una feria de ciencias.", "organizaron", "feria", "ciencias"),
  pt("¿Cuál es el núcleo del sujeto?", "A mi hermano menor le encantan los videojuegos.", "videojuegos", "hermano", "menor"), pt("¿Cuál es el núcleo del predicado?", "Llegaron tarde los músicos de la banda.", "Llegaron", "músicos", "tarde"),
  pt("¿Cuál es el núcleo del sujeto?", "Mi abuela materna prepara un cebiche delicioso.", "abuela", "cebiche", "materna"), pt("¿Cuál es el núcleo del predicado?", "En la plaza de Ayacucho se celebró la Semana Santa.", "celebró", "plaza", "Semana"),
];
const COMPOUND_SP: ChoiceItem[] = [
  pt("¿Cuál es el sujeto compuesto?", "La quena y el charango acompañaron la danza.", "La quena y el charango", "el charango acompañaron la danza", "La quena"), pt("¿Cuál es el predicado compuesto?", "El pescador remendó la red y salió al mar.", "remendó la red y salió al mar", "remendó la red", "El pescador remendó la red y salió"),
  pt("¿Cuál es el sujeto compuesto?", "Ni el director ni la subdirectora asistieron.", "Ni el director ni la subdirectora", "asistieron", "ni la subdirectora asistieron a la reunión"), pt("¿Cuál es el predicado compuesto?", "Los vecinos limpiaron el parque, pintaron las bancas y sembraron flores.", "limpiaron el parque, pintaron las bancas y sembraron flores", "limpiaron el parque", "Los vecinos limpiaron el parque, pintaron las bancas y sembraron"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "Tacna y Moquegua comparten el desierto.", "Sujeto compuesto", "Predicado compuesto", "Ninguno de los dos"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "La niña leyó el cuento y dibujó al protagonista.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"),
  pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El bus interprovincial salió a medianoche.", "Ninguno de los dos", "Sujeto compuesto", "Predicado compuesto"), pt("¿La oración tiene sujeto compuesto, predicado compuesto o ninguno?", "El volcán rugió y lanzó cenizas.", "Predicado compuesto", "Sujeto compuesto", "Ninguno de los dos"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["Los pescadores salieron antes del amanecer.", "Cuando llegó la lluvia, se cerró la carretera.", "Nadie conocía al nuevo vecino.", "La banda tocó hasta medianoche.", "Aunque perdimos, jugamos bien.", "Mi prima estudia enfermería en Huancayo."];
const FRAGMENT_ITEMS = ["Los pescadores que salieron antes del amanecer.", "Cuando llegó la lluvia a la sierra.", "Un vecino al que nadie conocía.", "Tocando hasta la medianoche en la plaza.", "Aunque al final perdimos.", "Mi prima, que estudia enfermería en Huancayo."];
const RUN_ON_ITEMS = ["Los pescadores salieron temprano el mar estaba tranquilo.", "Llegó la lluvia se cerró la carretera.", "Nadie lo conocía todos lo miraban.", "La banda tocó hasta tarde la gente bailó.", "Perdimos el partido jugamos bien.", "Mi prima estudia enfermería quiere trabajar en Huancayo."];

// --- Frases y proposiciones -------------------------------------------------

const PC = sorter(["Frase (no tiene verbo conjugado)", "Proposición (tiene sujeto y verbo conjugado)"], "¿Es una frase o una proposición?");
const PHRASE_CLAUSE: ChoiceItem[] = [
  ...["en la orilla del río", "después del almuerzo", "el viejo puente colgante", "muy temprano por la mañana", "con mucho cuidado", "debajo de la mesa"].map((x) => PC(x, 0)),
  ...["cuando llegó el tren", "porque llovía", "que vende choclos", "si estudias", "aunque nadie lo sabía", "mientras la abuela cocinaba"].map((x) => PC(x, 1)),
];
const APPO = "¿Cuál es la aposición de la oración?";
const APPOSITIVES: ChoiceItem[] = [
  pt(APPO, "Lima, la capital del Perú, fue fundada en 1535.", "la capital del Perú", "Lima", "fue fundada en 1535"), pt(APPO, "César Vallejo, el gran poeta de Santiago de Chuco, murió en París.", "el gran poeta de Santiago de Chuco", "César Vallejo", "murió en París"),
  pt(APPO, "Mi vecino, un ingeniero de minas, construyó un puente.", "un ingeniero de minas", "Mi vecino", "construyó un puente"), pt(APPO, "El Misti, volcán arequipeño, está cubierto de nieve.", "volcán arequipeño", "El Misti", "está cubierto de nieve"),
  pt(APPO, "Visitamos Kuélap, la fortaleza de los chachapoyas.", "la fortaleza de los chachapoyas", "Kuélap", "Visitamos"), pt(APPO, "Rosa, mi mejor amiga, ganó el concurso.", "mi mejor amiga", "Rosa", "ganó el concurso"),
  pt(APPO, "El cuy, un roedor andino, es un plato típico.", "un roedor andino", "El cuy", "es un plato típico"), pt(APPO, "Leí «Ollantay», un drama quechua colonial.", "un drama quechua colonial", "«Ollantay»", "Leí"),
];
const CLAUSE = sorter(["Proposición principal", "Proposición subordinada"], "La parte en MAYÚSCULAS, ¿es la proposición principal o la subordinada?");
const CLAUSES: ChoiceItem[] = [
  ...["SALIMOS AL PATIO cuando sonó el timbre.", "Aunque hacía frío, LOS NIÑOS SE BAÑARON EN EL RÍO.", "LA PROFESORA NOS FELICITÓ porque terminamos a tiempo.", "Si no llueve, SEMBRAREMOS MAÑANA.", "CONOZCO A LA SEÑORA que vende emoliente.", "Mientras esperábamos, EMPEZÓ LA PROCESIÓN."].map((x) => CLAUSE(x, 0)),
  ...["Salimos al patio CUANDO SONÓ EL TIMBRE.", "AUNQUE HACÍA FRÍO, los niños se bañaron en el río.", "La profesora nos felicitó PORQUE TERMINAMOS A TIEMPO.", "SI NO LLUEVE, sembraremos mañana.", "Conozco a la señora QUE VENDE EMOLIENTE.", "MIENTRAS ESPERÁBAMOS, empezó la procesión."].map((x) => CLAUSE(x, 1)),
];
const SCC = sorter(["Simple", "Compuesta coordinada", "Compuesta subordinada", "Compuesta con coordinación y subordinación"], "¿Cómo es la oración?");
const SIMPLE_COMPOUND_COMPLEX: ChoiceItem[] = [
  ...["El tren a Machu Picchu sale a las seis.", "Mis primos de Iquitos llegaron ayer.", "En invierno la neblina cubre Lima.", "La banda y los danzantes recorrieron la plaza."].map((x) => SCC(x, 0)),
  ...["Llovió mucho y el río se desbordó.", "Quería ir a la fiesta, pero tenía que estudiar.", "¿Vienes con nosotros o te quedas en casa?", "No comió ni durmió en toda la noche."].map((x) => SCC(x, 1)),
  ...["El río se desbordó porque llovió mucho.", "Iremos a la playa si sale el sol.", "La chica que ganó el concurso es mi prima.", "Cuando llegamos, la tienda ya estaba cerrada."].map((x) => SCC(x, 2)),
  ...["Llovió mucho y el río, que estaba crecido, se desbordó.", "Cuando sonó el timbre, salimos al patio y jugamos fútbol.", "Quería ir a la fiesta, pero no pude porque tenía examen.", "El chofer frenó y los pasajeros que iban de pie cayeron."].map((x) => SCC(x, 3)),
];
const RELATIVE = "¿Cómo se unen mejor las dos oraciones con una proposición de relativo?";
const COMBINE_RELATIVE: ChoiceItem[] = [
  pt(RELATIVE, "Conocí a un pescador. El pescador vendía conchas negras.", "Conocí a un pescador que vendía conchas negras.", "Conocí a un pescador y el pescador vendía conchas negras.", "Conocí conchas negras."),
  pt(RELATIVE, "Leí una novela. La novela ganó un premio.", "Leí una novela que ganó un premio.", "Leí una novela, y la novela ganó un premio también.", "Una novela leí."),
  pt(RELATIVE, "Esta es la casa. En esta casa nació mi abuelo.", "Esta es la casa donde nació mi abuelo.", "Esta es la casa y en esta casa nació mi abuelo.", "Mi abuelo es la casa."),
  pt(RELATIVE, "Saludé a la profesora. Su hijo estudia conmigo.", "Saludé a la profesora cuyo hijo estudia conmigo.", "Saludé a la profesora que su hijo estudia conmigo.", "Su hijo saludó."),
  pt(RELATIVE, "Ese es el amigo. Viajé con ese amigo a Cusco.", "Ese es el amigo con quien viajé a Cusco.", "Ese es el amigo que viajé con él a Cusco.", "Viajé a un amigo."),
  pt(RELATIVE, "Encontré el libro. Lo había perdido en el bus.", "Encontré el libro que había perdido en el bus.", "Encontré el libro que lo había perdido en el bus.", "El bus perdió el libro."),
];

// --- Sustantivos ---------------------------------------------------------

const PLURAL = (word: string, a: string, ...d: string[]) => w(`¿Cuál es el plural de «${word}»?`, a, ...d);
const PLURAL_REVIEW: ChoiceItem[] = [
  PLURAL("régimen", "regímenes", "régimenes", "régimens"), PLURAL("carácter", "caracteres", "carácteres", "carácters"), PLURAL("espécimen", "especímenes", "espécimenes", "espécimens"),
  PLURAL("el análisis", "los análisis", "los análisises", "los análisis es"), PLURAL("la crisis", "las crisis", "las crisises", "las crisiss"), PLURAL("el lunes", "los lunes", "los luneses", "los lunés"),
  PLURAL("club", "clubes", "clubses", "clubos"), PLURAL("álbum", "álbumes", "álbunes", "álbumses"), PLURAL("sándwich", "sándwiches", "sándwichs", "sándwichez"),
  PLURAL("lápiz", "lápices", "lápizes", "lápises"), PLURAL("examen", "exámenes", "examenes", "exámens"), PLURAL("joven", "jóvenes", "jovenes", "jóvens"),
];
const COMPOUND_PLURALS: ChoiceItem[] = [
  PLURAL("bocacalle", "bocacalles", "bocascalles", "bocacalle"), PLURAL("el sacacorchos", "los sacacorchos", "los sacacorchoses", "los sacacorcho"), PLURAL("el guardaespaldas", "los guardaespaldas", "los guardaespaldases", "los guardasespaldas"),
  PLURAL("hombre rana", "hombres rana", "hombre ranas", "hombres ranas"), PLURAL("coche cama", "coches cama", "coche camas", "coches camases"), PLURAL("altavoz", "altavoces", "altavozes", "altosvoces"),
  PLURAL("pasatiempo", "pasatiempos", "pasastiempos", "pasatiempoes"), PLURAL("el cumpleaños", "los cumpleaños", "los cumpleañoses", "los cumplesaños"), PLURAL("mediodía", "mediodías", "mediosdías", "mediodíases"),
  PLURAL("sordomudo", "sordomudos", "sordosmudos", "sordomudoes"), PLURAL("ciudad dormitorio", "ciudades dormitorio", "ciudad dormitorios", "ciudades dormitorioses"), PLURAL("puntapié", "puntapiés", "puntaspiés", "puntapieses"),
];
const OWN = sorter(["Plural (sin dueño)", "Pertenencia de un dueño", "Pertenencia de varios dueños"], "La frase en MAYÚSCULAS, ¿qué expresa?");
const POSSESSIVE_ID: ChoiceItem[] = [
  ...["LOS VECINOS barrieron la calle.", "Compré LAS MANDARINAS en el mercado.", "LAS ALPACAS bajaron del cerro.", "Saludé a LOS PROFESORES."].map((x) => OWN(x, 0)),
  ...["Pintaron LA CASA DE MI TÍA.", "Se perdió EL PERRO DEL VECINO.", "Leí LOS CUENTOS DE VALDELOMAR.", "Arreglé LA BICICLETA DE MI HERMANA."].map((x) => OWN(x, 1)),
  ...["Pintaron LA CASA DE MIS TÍAS.", "Se perdió EL PERRO DE LOS VECINOS.", "Leí LOS CUENTOS DE LOS HERMANOS GRIMM.", "Arreglé LAS BICICLETAS DE MIS HERMANAS."].map((x) => OWN(x, 2)),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  pt("¿Cómo se escribe la frase de pertenencia?", "Las chompas que tejieron las abuelas", "las chompas de las abuelas", "las abuelas sus chompas", "de las abuelas sus chompas"),
  pt("¿Cómo se escribe la frase de pertenencia?", "El cuaderno que es de Luis", "el cuaderno de Luis", "de Luis su cuaderno", "el Luis cuaderno"),
  pt("¿Cómo se escribe la frase de pertenencia?", "La chacra que tiene el señor Mamani", "la chacra del señor Mamani", "la chacra de el señor Mamani", "del señor Mamani su chacra"),
  pt("¿Cómo se escribe la frase de pertenencia?", "Los uniformes que usan los bomberos", "los uniformes de los bomberos", "los bomberos sus uniformes", "de los bomberos su uniformes"),
  pt("¿Cómo se escribe la frase de pertenencia?", "La idea que tuvo mi prima", "la idea de mi prima", "de mi prima su idea", "la mi prima idea"),
  pt("¿Cómo se escribe la frase de pertenencia?", "El techo que tiene el colegio", "el techo del colegio", "el techo de el colegio", "del colegio su techo"),
];
const FIXIT = "¿Cómo se corrige la oración?";
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt(FIXIT, "De mi mamá su casa queda en Puno.", "La casa de mi mamá queda en Puno.", "De mi mamá la su casa queda en Puno.", "Su casa de mi mamá queda en Puno."),
  pt(FIXIT, "Los lápizes de los alumnos están en la mesa.", "Los lápices de los alumnos están en la mesa.", "Los lápiz de los alumnos están en la mesa.", "Los lápizes de el alumno están en la mesa."),
  pt(FIXIT, "Encontré el celular de el profesor.", "Encontré el celular del profesor.", "Encontré el celular de él profesor.", "Encontré del profesor su celular."),
  pt(FIXIT, "Los análisises de sangre salieron bien.", "Los análisis de sangre salieron bien.", "Las análisis de sangre salieron bien.", "Los análisis de sangres salió bien."),
  pt(FIXIT, "Vi sus zapatos de ellos en la puerta.", "Vi los zapatos de ellos en la puerta.", "Vi sus zapatos suyos de ellos en la puerta.", "Vi de ellos sus zapatos en la puerta."),
  pt(FIXIT, "Los régimenes de lluvias cambiaron.", "Los regímenes de lluvias cambiaron.", "Los régimens de lluvias cambiaron.", "Los régimen de lluvias cambiaron."),
];

// --- Pronombres y antecedentes ---------------------------------------------

const ANTECEDENTS: ChoiceItem[] = [
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "La abuela tejió una manta y LA regaló a su nieta.", "una manta", "La abuela", "a su nieta querida"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Los turistas llegaron tarde porque ELLOS perdieron el bus.", "Los turistas", "el bus", "tarde"),
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Compré dos libros de Arguedas; LOS leeré en vacaciones.", "dos libros de Arguedas", "Arguedas", "las vacaciones de verano en Lima"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Rosa llamó a Pedro y LE pidió ayuda.", "Pedro", "Rosa", "ayuda"),
  pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "El río que cruza el pueblo creció; ESTE arrastró varios árboles.", "El río", "el pueblo", "varios árboles"), pt("¿Cuál es el antecedente del pronombre en MAYÚSCULAS?", "Las niñas prepararon una maqueta y LA presentaron en la feria.", "una maqueta", "Las niñas", "la feria"),
];
const AGREE: ChoiceItem[] = [
  f("Las alumnas trajeron ___ cuadernos.", "sus", "su", "nuestros"), f("Cada alumno debe traer ___ propio diccionario.", "su", "sus", "nuestro"),
  f("El equipo celebró ___ victoria.", "su", "sus", "nuestra"), f("Los vecinos limpiaron la calle; ___ estaban cansados al final.", "ellos", "él", "nosotros"),
  f("Compré flores y ___ puse en un jarrón.", "las", "la", "los"), f("Juan y yo hicimos ___ tarea juntos.", "nuestra", "su", "sus"),
  f("La municipalidad anunció ___ nuevo plan.", "su", "sus", "nuestro"), f("Visité a mis abuelos y ___ conté mis notas.", "les", "le", "los"),
];
const VAGUE = "¿Qué oración tiene una referencia ambigua del pronombre?";
const VAGUE_REF: ChoiceItem[] = [
  w(VAGUE, "Ana le dijo a Lucía que ella había ganado.", "Ana le dijo a Lucía que había ganado el concurso de dibujo.", "Ana le dijo a Lucía: «Ganaste»."), w(VAGUE, "Cuando Pedro vio a su primo, él se puso feliz.", "Pedro se puso feliz al ver a su primo.", "Su primo se puso feliz cuando vio a Pedro en la plaza."),
  w(VAGUE, "Sacamos los libros de las cajas y las botamos.", "Sacamos los libros de las cajas y botamos las cajas.", "Botamos las cajas después de sacar los libros."), w(VAGUE, "El perro persiguió al gato hasta que se cansó.", "El perro persiguió al gato hasta que el perro se cansó.", "El perro se cansó de perseguir al gato."),
  w(VAGUE, "Mi papá habló con el vecino sobre su auto.", "Mi papá habló con el vecino sobre el auto del vecino.", "Mi papá le habló al vecino sobre el auto de mi papá."), w(VAGUE, "Luisa visitó a su abuela cuando estaba enferma.", "Luisa visitó a su abuela, que estaba enferma.", "Cuando la abuela enfermó, Luisa la visitó."),
];
const ALL_ANT = "¿Cuáles son todos los antecedentes posibles del pronombre en MAYÚSCULAS?";
const ALL_ANTECEDENTS: ChoiceItem[] = [
  pt(ALL_ANT, "Ana le dijo a Lucía que ELLA había ganado.", "Ana o Lucía", "Solo Ana, la que habla", "Solo Lucía"), pt(ALL_ANT, "Pedro saludó a Luis cuando ÉL llegó.", "Pedro o Luis", "Solo Pedro, el que saluda", "Solo Luis"),
  pt(ALL_ANT, "Sacamos los platos de las cajas y LAS lavamos.", "Solo las cajas", "Los platos o las cajas", "Solo los platos"), pt(ALL_ANT, "Mi tía habló con mi madre sobre SU viaje.", "Mi tía o mi madre", "Solo mi tía, que es quien habla", "Solo mi madre"),
  pt(ALL_ANT, "El gato y el perro jugaban; luego ESTE se durmió.", "El perro", "El gato o el perro", "Solo el gato"), pt(ALL_ANT, "Los niños vieron a los payasos y ELLOS rieron.", "Los niños o los payasos", "Solo los niños", "Solo los payasos, que hacen reír"),
];
const SHIFT = "¿Cómo se corrige el cambio indebido de pronombre?";
const PRONOUN_SHIFTS: ChoiceItem[] = [
  pt(SHIFT, "Cuando uno estudia de noche, te cansas más.", "Cuando uno estudia de noche, se cansa más.", "Cuando uno estudia de noche, nos cansamos más.", "Cuando estudias de noche, uno te cansas más."),
  pt(SHIFT, "Si los alumnos llegan tarde, debes justificarlo.", "Si los alumnos llegan tarde, deben justificarlo.", "Si los alumnos llegan tarde, debemos justificarlo.", "Si llegan tarde, debes."),
  pt(SHIFT, "Cada persona debe cuidar sus cosas; ustedes son responsables.", "Cada persona debe cuidar sus cosas; es responsable de ellas.", "Cada persona debe cuidar sus cosas; nosotros somos responsables.", "Cuiden."),
  pt(SHIFT, "Nosotros fuimos al museo y te sorprendes con las momias.", "Nosotros fuimos al museo y nos sorprendimos con las momias.", "Nosotros fuimos al museo y se sorprendieron con las momias.", "Fuimos y te sorprendiste."),
  pt(SHIFT, "Uno nunca sabe cuándo vas a necesitar ayuda.", "Uno nunca sabe cuándo va a necesitar ayuda.", "Uno nunca sabe cuándo vamos a necesitar ayuda.", "Nunca sabes cuándo uno vas a necesitar."),
  pt(SHIFT, "Los turistas que visitan Puno deben abrigarte bien.", "Los turistas que visitan Puno deben abrigarse bien.", "Los turistas que visitan Puno deben abrigarnos bien.", "Abrígate bien en Puno, turistas."),
];

// --- Tipos de pronombres ---------------------------------------------------

const SUBJ_OBJ: ChoiceItem[] = [
  f("A ___ me gusta el arroz con pato.", "mí", "yo", "me"), f("___ llegué primero a la meta.", "Yo", "Mí", "Me"),
  f("Este regalo es para ___.", "ti", "tú", "te"), f("___ eres el delegado del salón.", "Tú", "Ti", "Te"),
  f("Vi a Rosa y ___ saludé.", "la", "ella", "le"), f("Le di el libro a ___.", "ella", "la", "le"),
  f("Esperamos a los músicos y ___ aplaudimos.", "los", "ellos", "les"), f("Cuando llegó la carta, ___ entregué a mi madre.", "se la", "le la", "ella la"),
];
const I_AND_ME: ChoiceItem[] = [
  f("Entre tú y ___ no hay secretos.", "yo", "mí", "me"), f("Rosa y ___ preparamos la exposición.", "yo", "mí", "me"),
  f("Trajeron empanadas para Luis y para ___.", "mí", "yo", "me"), f("Mi abuela nos llamó a mi hermano y a ___.", "mí", "yo", "me"),
  f("Según tú y ___, el plan es bueno.", "yo", "mí", "me"), f("El profesor nos felicitó a Ana y a ___.", "mí", "yo", "me"),
  f("Mis primos y ___ iremos a Huacachina.", "yo", "mí", "me"), f("La carta era para ella y para ___.", "mí", "yo", "me"),
];
const COMPOUND_PRONOUNS: ChoiceItem[] = [
  f("Ella y ___ ganamos el concurso.", "yo", "mí", "me"), f("El premio es para ellos y para ___.", "nosotros", "nos", "nuestros"),
  f("Tú y ___ llegaron primero.", "él", "lo", "le"), f("Nos invitaron a ti y a ___.", "mí", "yo", "me"),
  f("Ustedes y ___ formaremos un equipo.", "nosotros", "nos", "nuestro"), f("El profesor habló con ella y con ___.", "él", "lo", "le"),
  f("Ni tú ni ___ sabíamos la respuesta.", "yo", "mí", "me"), f("Lo vimos a él y a ___ en la feria.", "ella", "la", "le"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Lucía ___ peina antes de salir.", "se", "la", "le"), f("Lucía ___ peina a su hermanita.", "la", "se", "le"),
  f("Yo ___ lavo las manos antes de comer.", "me", "lo", "se"), f("Los niños ___ abrigaron con chompas.", "se", "los", "les"),
  f("Mi papá ___ afeitó la barba.", "se", "lo", "le"), f("La enfermera ___ vacunó al bebé.", "lo", "se", "le"),
  f("Nosotros ___ despertamos a las seis.", "nos", "los", "se"), f("Tú ___ miras mucho en el espejo.", "te", "la", "se"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Ella habla consigo ___ cuando está nerviosa.", "misma", "mismo", "mismas"), f("Los alumnos ___ organizaron solos.", "se", "les", "los"),
  f("Me prometí a ___ mismo no rendirme.", "mí", "yo", "me"), f("Tienes que creer en ___ misma.", "ti", "tú", "te"),
  f("Pedro siempre piensa en ___ mismo.", "sí", "él", "se"), f("Ustedes deben cuidarse a ___ mismos.", "sí", "ustedes", "se"),
  f("¿___ cortaste el pelo tú solo?", "Te", "Ti", "Se"), f("Las niñas ___ disfrazaron de marineras.", "se", "las", "les"),
];
const RI = sorter(["Reflexivo", "Enfático"], "El pronombre en MAYÚSCULAS, ¿es reflexivo o enfático?");
const REFLEXIVE_INTENSIVE: ChoiceItem[] = [
  ...["Ana SE miró en el espejo.", "Se habla a SÍ MISMO cuando estudia.", "Los niños SE vistieron solos.", "ME preparé un café.", "Te cuidas a TI MISMO."].map((x) => RI(x, 0)),
  ...["Lo dijo el director MISMO.", "YO MISMA preparé la torta.", "La alcaldesa MISMA vino a la inauguración.", "Ellos MISMOS pintaron el mural.", "Tú MISMO lo viste."].map((x) => RI(x, 1)),
];
const QUIEN: ChoiceItem[] = [
  f("Es la profesora ___ nos enseñó a leer.", "que", "quien que", "la cual que"), f("Esa es la amiga ___ te presenté.", "a quien", "quien", "a la que que"),
  f("Los vecinos, ___ estaban molestos, protestaron.", "quienes", "quien", "de los cuales"), f("El chico con ___ hablé es de Tacna.", "quien", "que", "quienes"),
  f("___ termine primero, ganará un libro.", "Quien", "Que", "Cual"), f("Es el doctor a ___ consulté.", "quien", "que", "cual"),
  f("Las niñas, ___ cantaron en el coro, ganaron.", "quienes", "quien", "las cuales que"), f("No sé a ___ invitar.", "quién", "quien", "que"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("El pueblo ___ nací está en Áncash.", "donde", "cuyo", "quien"), f("El escritor ___ libro leí vive en Lima.", "cuyo", "que su", "quien"),
  f("La casa, ___ techo es de calamina, se mojó.", "cuyo", "cuya", "que su"), f("Es una idea con la ___ no estoy de acuerdo.", "cual", "quien", "cuya"),
  f("El bus ___ tomé iba lleno.", "que", "quien", "cuyo"), f("La alumna, ___ padres son pescadores, ganó la beca.", "cuyos", "cuyas", "que sus"),
  f("Es el motivo por el ___ renuncié.", "cual", "quien", "cuyo"), f("La ciudad ___ visitamos tiene un río.", "que", "quien", "cuya"),
];

// --- Tipos de verbos -------------------------------------------------------

const TI = sorter(["Transitivo", "Intransitivo"], "El verbo en MAYÚSCULAS, ¿es transitivo o intransitivo?");
const TRANSITIVE: ChoiceItem[] = [
  ...["Mi abuela TEJE chompas de alpaca.", "El pescador LANZÓ la red.", "LEÍMOS un cuento de Valdelomar.", "El viento ARRASTRÓ las hojas.", "Pedro COMPRÓ pan."].map((x) => TI(x, 0)),
  ...["El bebé DUERME.", "Los turistas LLEGARON tarde.", "El río CRECIÓ en verano.", "Mi perro LADRA de noche.", "La flor SE MARCHITÓ."].map((x) => TI(x, 1)),
];
const LINK = sorter(["Atributo: adjetivo", "Atributo: sustantivo"], "¿Qué tipo de atributo tiene el verbo copulativo?");
const LINKING: ChoiceItem[] = [
  ...["El cielo está nublado.", "La sopa parece deliciosa.", "Mi abuelo es muy sabio.", "Los alumnos están cansados.", "La montaña es altísima."].map((x) => LINK(x, 0)),
  ...["Mi tía es ingeniera.", "Lima es la capital.", "Ese chico parece un artista.", "Arguedas fue un gran escritor.", "Mi hermano es el delegado."].map((x) => LINK(x, 1)),
];

// --- Concordancia ---------------------------------------------------------

const AGREEMENT_FIX: ChoiceItem[] = [
  pt(FIXIT, "Los alumnos de la sección B llegó tarde.", "Los alumnos de la sección B llegaron tarde.", "Los alumnos de la sección B llegamos tarde.", "El alumnos de la sección B llegaron tarde."),
  pt(FIXIT, "La gente aplaudieron al final.", "La gente aplaudió al final.", "La gente aplaudimos al final.", "Las gentes aplaudió al final."),
  pt(FIXIT, "El grupo de turistas visitaron Kuélap.", "El grupo de turistas visitó Kuélap.", "El grupo de turista visitaron Kuélap.", "Los grupo de turistas visitó Kuélap."),
  pt(FIXIT, "Me gusta los cuentos de terror.", "Me gustan los cuentos de terror.", "Me gustamos los cuentos de terror.", "Me gusta el cuentos de terror."),
  pt(FIXIT, "Faltó dos alumnos a la clase.", "Faltaron dos alumnos a la clase.", "Faltamos dos alumnos a la clase.", "Faltó dos alumno a la clase."),
  pt(FIXIT, "Se vende departamentos en el centro.", "Se venden departamentos en el centro.", "Se vendemos departamentos en el centro.", "Se vende departamento en los centros."),
];
const INDEFINITE: ChoiceItem[] = [
  f("Cada uno de los alumnos ___ su lonchera.", "trae", "traen", "traemos"), f("Nadie ___ la respuesta correcta.", "sabía", "sabían", "sabíamos"),
  f("Todos ___ a la ceremonia.", "asistieron", "asistió", "asistí"), f("Alguien ___ la puerta.", "tocó", "tocaron", "tocamos"),
  f("Ninguno de ellos ___ la tarea.", "hizo", "hicieron", "hicimos"), f("Cualquiera ___ equivocarse.", "puede", "pueden", "podemos"),
  f("Algunos ___ que el examen fue fácil.", "dicen", "dice", "digo"), f("Cada estudiante ___ un número.", "recibió", "recibieron", "recibimos"),
  f("Algunos de los vecinos ___ por el ruido.", "protestaron", "protestó", "protesté"), f("Muchos ___ el verano a la playa.", "prefieren", "prefiere", "prefiero"),
  f("Varios de mis primos ___ en Arequipa.", "viven", "vive", "vivo"),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  f("Tú y yo ___ al concierto.", "iremos", "irán", "irás"), f("Mi madre y mi tía ___ en el mercado.", "venden", "vende", "vendemos"),
  f("El director, con los profesores, ___ la reunión.", "inició", "iniciaron", "iniciamos"), f("Tú y tu hermano ___ invitados.", "están", "está", "estamos"),
  f("La lluvia y el viento ___ los techos.", "dañaron", "dañó", "dañamos"), f("Ella y yo ___ la exposición.", "preparamos", "prepararon", "preparó"),
  f("El capitán y su equipo ___ el trofeo.", "levantaron", "levantó", "levantamos"), f("La profesora junto con sus alumnos ___ al museo.", "fue", "fueron", "fuimos"),
];

// --- Tiempos verbales ------------------------------------------------------

const PAST_IRREGULAR: ChoiceItem[] = [
  f("Ayer ___ por todo el centro de Arequipa. (andar)", "anduve", "andé", "anduví"), f("El intérprete ___ el discurso al quechua. (traducir)", "tradujo", "tradució", "traduzo"),
  f("No ___ todo en la maleta. (caber, yo)", "cupe", "cabí", "cabé"), f("La respuesta no lo ___. (satisfacer)", "satisfizo", "satisfació", "satisfacío"),
  f("Mi padre ___ el auto toda la noche. (conducir)", "condujo", "condució", "condujió"), f("Ella ___ venir, pero no pudo. (querer)", "quiso", "quisó", "querió"),
  f("Ellos ___ la verdad. (decir)", "dijeron", "dijieron", "dijiron"), f("¿Dónde ___ las llaves? (poner, tú)", "pusiste", "ponistes", "ponisteis"),
  f("Los científicos ___ el sismo. (prever)", "previeron", "previó", "preveyeron"), f("___ muchos problemas ese año. (haber)", "Hubo", "Hubieron", "Hubió"),
];
const THREE_TENSES: ChoiceItem[] = [
  f("Ayer ___ en el río. (nadar, nosotros)", "nadamos", "nadaremos", "nadaríamos"), f("Mañana ___ el examen de ciencias. (rendir, yo)", "rendiré", "rendí", "rindo"),
  f("Todos los días ___ a las seis. (levantarse, ella)", "se levanta", "se levantó", "se levantará"), f("El año pasado ___ en Tacna. (vivir, ellos)", "vivieron", "vivirán", "viven"),
  f("Dentro de dos semanas ___ las vacaciones. (empezar)", "empezarán", "empezaron", "empiezan"), f("Mira por la ventana: ahora mismo ___ granizo. (caer)", "cae", "cayó", "caerá"),
  f("En 1821 San Martín ___ la independencia. (proclamar)", "proclamó", "proclamará", "proclama"), f("El próximo año mi hermana ___ a secundaria. (pasar)", "pasará", "pasó", "pasa"),
];
const TENSE_SHIFTS: ChoiceItem[] = [
  pt(FIXIT, "Ayer fui al mercado y compro papas.", "Ayer fui al mercado y compré papas.", "Ayer fui al mercado y compraré papas.", "Ayer voy al mercado y compré papas."),
  pt(FIXIT, "Cuando llegó el bus, todos suben corriendo.", "Cuando llegó el bus, todos subieron corriendo.", "Cuando llegó el bus, todos subirán corriendo.", "Cuando llega el bus, todos subieron corriendo."),
  pt(FIXIT, "Mañana viajaremos a Cusco y visitamos Sacsayhuamán ayer.", "Mañana viajaremos a Cusco y visitaremos Sacsayhuamán.", "Mañana viajamos a Cusco y visitamos Sacsayhuamán ayer.", "Ayer viajaremos a Cusco y visitamos Sacsayhuamán."),
  pt(FIXIT, "El narrador abrió la puerta y ve una sombra.", "El narrador abrió la puerta y vio una sombra.", "El narrador abrió la puerta y verá una sombra.", "El narrador abre la puerta y vio una sombra."),
  pt(FIXIT, "Mientras cocinaba, mi hermano pone la mesa.", "Mientras cocinaba, mi hermano ponía la mesa.", "Mientras cocinaba, mi hermano pondrá la mesa.", "Mientras cocino, mi hermano ponía la mesa."),
  pt(FIXIT, "Si estudias, aprobaste el curso.", "Si estudias, aprobarás el curso.", "Si estudias, aprobabas el curso.", "Si estudiaste, aprobarás el curso ayer."),
];
const PROGRESSIVE: ChoiceItem[] = [
  f("Ayer a esta hora ___ en la playa. (bañarse, nosotros)", "nos estábamos bañando", "nos estamos bañando", "nos estaremos bañando"), f("No me llames ahora: ___ la tarea. (hacer, yo)", "estoy haciendo", "estaba haciendo", "estaré haciendo"),
  f("Mañana a las diez ___ a Iquitos. (volar, ellos)", "estarán volando", "estaban volando", "están volando ayer"), f("Cuando sonó el teléfono, ___ un libro. (leer, yo)", "estaba leyendo", "estoy leyendo", "estaré leyendo"),
  f("¿Qué ___ en este momento? (hacer, tú)", "estás haciendo", "estabas haciendo", "estarás haciendo ayer"), f("El agua ___ desde hace una hora. (hervir)", "está hirviendo", "estaba herviendo", "está hervido"),
  f("Los niños ___ cuando llegó la profesora. (dormir)", "estaban durmiendo", "estaban dormiendo", "están durmiendo ayer"), f("Ella ___ por el parque todas las tardes de este mes. (correr)", "está corriendo", "estaba corrido", "estará corrido"),
];
const PERFECT: ChoiceItem[] = [
  f("Este año ya ___ tres novelas. (leer, yo)", "he leído", "había leído", "he leyido"), f("Cuando llegamos, la película ya ___. (empezar)", "había empezado", "ha empezado", "habrá empezado"),
  f("Para diciembre, ___ el proyecto. (terminar, nosotros)", "habremos terminado", "hemos terminado", "habíamos terminado"), f("¿Alguna vez ___ el Titicaca? (visitar, tú)", "has visitado", "habías visitado", "habrás visitado"),
  f("Nunca ___ tanta gente en la plaza. (ver, yo)", "había visto", "habré visto", "he vido"), f("Mis tíos ___ de Cusco esta mañana. (volver)", "han vuelto", "han volvido", "han volvió"),
  f("Para cuando llegues, ya ___ la cena. (preparar, ella)", "habrá preparado", "ha preparado", "había preparado"), f("¿Quién ___ la ventana? (romper)", "ha roto", "ha rompido", "ha rompió"),
];
const GERUND_DOES = sorter(["Modo (cómo)", "Tiempo (cuándo)", "Causa (por qué)", "Condición (si…)"], "¿Qué expresa el gerundio en MAYÚSCULAS?");
const GERUNDS: ChoiceItem[] = [
  ...["Llegó CORRIENDO al colegio.", "Habla GRITANDO.", "Aprendió quechua ESCUCHANDO a su abuela."].map((x) => GERUND_DOES(x, 0)),
  ...["SALIENDO de clase, me encontré con Luis.", "VOLVIENDO a casa, vi un accidente.", "Me dormí ESCUCHANDO la radio."].map((x) => GERUND_DOES(x, 1)),
  ...["ESTANDO enfermo, no fue a la fiesta.", "SIENDO tan tarde, decidimos irnos.", "CONOCIENDO su carácter, no le dije nada."].map((x) => GERUND_DOES(x, 2)),
  ...["ESTUDIANDO así, aprobarás.", "SALIENDO ahora, llegaremos a tiempo.", "AHORRANDO un poco, compraremos la bicicleta."].map((x) => GERUND_DOES(x, 3)),
];
const INF = "¿Cuál es la frase de infinitivo de la oración?";
const INFINITIVES: ChoiceItem[] = [
  pt(INF, "Leer novelas policiales me relaja.", "Leer novelas policiales", "me relaja", "novelas policiales me relaja mucho"), pt(INF, "Mi sueño es conocer el Amazonas.", "conocer el Amazonas", "Mi sueño", "Mi sueño es conocer el Amazonas"),
  pt(INF, "Prefiero caminar por la playa.", "caminar por la playa", "Prefiero", "Prefiero caminar por la playa"), pt(INF, "Viajar en tren a Huancayo es una aventura.", "Viajar en tren a Huancayo", "es una aventura", "una aventura"),
  pt("¿Qué función cumple el infinitivo «Nadar» en «Nadar en el mar es divertido»?", "Nadar en el mar es divertido.", "Sujeto", "Complemento", "Verbo principal"), pt("¿Qué función cumple el infinitivo «bailar» en «Quiero bailar marinera»?", "Quiero bailar marinera.", "Complemento del verbo", "Sujeto", "Adjetivo"),
  pt(INF, "Me encanta tocar el cajón.", "tocar el cajón", "Me encanta", "Me encanta tocar el cajón"), pt(INF, "Salimos temprano para ver el amanecer.", "ver el amanecer", "Salimos temprano", "Salimos temprano para ver"),
];

export const ROWS: Row[] = [
  ["prefijos-ortografia-1", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["prefijos-ortografia-2", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["prefijos-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "adquirir advertencia decrecer devaluar decisivo creativo nocivo generoso peligroso espacioso", "a e i o u b v s c z h")])],
  ["raices-ortografia-1", (r) => choose(r, WELL, SPECT_VIS)],
  ["raices-ortografia-2", (r) => choose(r, WELL, FORM_RUPT)],
  ["raices-ortografia-3", (r) => mix(r, [(q) => choose(q, WELL, [...SPECT_VIS, ...FORM_RUPT]), (q) => P2.spellHeard(q, "espectador perspectiva visible revisar evidencia uniforme reformar interrupción erupción abrupto", "a e i o u b v s c x p")])],
  ["ll-y-c-s-z-1", (r) => choose(r, WELL, SET_LLY)],
  ["ll-y-c-s-z-2", (r) => choose(r, WELL, SET_CSZ)],
  ["ll-y-c-s-z-3", (r) => P2.spellHeard(r, "llovizna ensayo desarrollo apoyar bullicio trayecto cereza escasez sencillez conciencia preciso", "a e i o u ll y c s z")],
  ["x-h-1", (r) => choose(r, WELL, SET_X)],
  ["x-h-2", (r) => choose(r, WELL, SET_H)],
  ["x-h-3", (r) => P2.spellHeard(r, "examen exhausto extranjero excelente auxilio huella hielo hipótesis horizonte herencia", "a e i o u ó x s c h")],
  ["x-h-4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_X, ...SET_H]), (q) => P2.spellHeard(q, "examen exhausto texto huella horizonte hueso", "a e i o u x s c h")])],

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

  ["antecedentes-1", (r) => choose(r, "", ANTECEDENTS)],
  ["antecedentes-2", (r) => choose(r, "Completa la oración.", AGREE)],
  ["antecedentes-3", (r) => choose(r, "", VAGUE_REF)],
  ["antecedentes-4", (r) => choose(r, "", ALL_ANTECEDENTS)],
  ["antecedentes-5", (r) => choose(r, "", PRONOUN_SHIFTS)],

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
  ["verboides-1", (r) => choose(r, "", GERUNDS)],
  ["verboides-2", (r) => choose(r, "", INFINITIVES)],
];
