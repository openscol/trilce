import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { abcOrder, f, pool, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Vocabulario (IXL 8th grade ELA, W-EE). Los afijos del inglés pasan a los del
// castellano, como en 1.°: mis- → mal-; un-, dis-, in-, im-, non- → des-, in-,
// im-, i- y no; -ful → -oso; -less → a-, an- y sin-; -able, -ible → -able, -ible.

export const SECTIONS: Section[] = [
  { id: "W", name: "Prefijos y sufijos", icon: "🧩" },
  { id: "X", name: "Raíces griegas y latinas", icon: "🏛️" },
  { id: "Y", name: "Sinónimos y antónimos", icon: "↔️" },
  { id: "Z", name: "Elección y uso de las palabras", icon: "🌈" },
  { id: "AA", name: "Homófonos", icon: "👂" },
  { id: "BB", name: "Analogías", icon: "🔁" },
  { id: "CC", name: "Claves de contexto", icon: "🔎" },
  { id: "DD", name: "Vocabulario de las áreas", icon: "🔬" },
  { id: "EE", name: "Uso del diccionario", icon: "📖" },
];

const means = (word: string, a: string, ...d: string[]) => w(`¿Qué significa «${word}»?`, a, ...d);

// --- W. Prefijos y sufijos ---------------------------------------------------

const PRE: ChoiceItem[] = [
  means("precursor", "Que abre el camino a otros", "Que llega al final, cuando todo ya terminó", "Corredor"), means("preestablecido", "Fijado con anterioridad", "Que se decide en el momento, sin plan", "Nuevo"),
  means("prejuicio", "Opinión formada antes de conocer algo", "Juicio que se hace después de estudiar todas las pruebas", "Castigo"), means("preeminente", "Que destaca por encima de otros", "Que pasa desapercibido entre los demás", "Antiguo"),
  f("El ___ del libro explica por qué lo escribió.", "prefacio", "epílogo", "índice final"), f("Los sismólogos intentan ___ los terremotos.", "prevenir", "revenir", "devenir"),
  f("Hubo un ___ de la obra para la prensa.", "preestreno", "reestreno", "estreno final"), f("Es una ___ que todos tengan su DNI.", "precondición", "recondición", "condición final"),
];
const RE: ChoiceItem[] = [
  means("reivindicar", "Reclamar algo a lo que se tiene derecho", "Renunciar a un derecho para siempre", "Vender"), means("recapacitar", "Volver a pensar sobre algo con calma", "Actuar sin pensar en las consecuencias", "Capacitar"),
  means("reincidir", "Volver a cometer la misma falta", "Cometer una falta por primera vez", "Olvidar"), means("resurgir", "Volver a aparecer con fuerza", "Desaparecer para siempre de la memoria", "Surgir"),
  f("Después del huaico, tuvieron que ___ el puente.", "reconstruir", "destruir", "construir de cero"), f("La comunidad pidió ___ el contrato con la empresa.", "renegociar", "negociar", "desnegociar"),
  f("El alcalde quiso ___ el parque con más árboles.", "reforestar", "deforestar", "forestar"), f("Tras la crisis, la economía empezó a ___.", "recuperarse", "cuperarse", "desrecuperarse"),
];
const SUB: ChoiceItem[] = [
  means("subyacente", "Que está oculto debajo de algo", "Que está a la vista de todos, en la superficie", "Vecino"), means("subordinado", "Que depende de otro", "Que manda sobre todos los demás", "Ordenado"),
  means("subsanar", "Corregir un error o un defecto", "Cometer un error muy grave", "Sanar"), means("subvencionar", "Ayudar con dinero a una actividad", "Cobrar impuestos a una actividad", "Vender"),
  f("Las aguas ___ abastecen a muchos pueblos de la costa.", "subterráneas", "terrestres", "superficiales"), f("No debes ___ a tus rivales.", "subestimar", "estimar", "sobreestimar"),
  f("El documental tiene ___ en quechua.", "subtítulos", "títulos", "sobretítulos"), f("Se dividió el informe en capítulos y ___.", "subcapítulos", "capítulos", "supercapítulos"),
];
const MAL: ChoiceItem[] = [
  means("malversación", "Uso indebido de fondos públicos", "Buena administración del dinero público", "Verso malo"), means("maleducado", "Que no tiene buenos modales", "Que estudió mucho y tiene buenas notas", "Callado"),
  means("malestar", "Sensación de incomodidad", "Estado de alegría y bienestar general", "Estrella"), means("maltrecho", "En mal estado por un golpe o daño", "Recién fabricado y en perfecto estado", "Pequeño"),
  f("Hubo un ___: pensé que la reunión era mañana.", "malentendido", "entendido", "sobreentendido"), f("El terremoto dejó varias casas ___.", "maltrechas", "trechas", "bien hechas"),
  f("No debemos ___ los recursos del Estado.", "malgastar", "gastar", "regastar"), f("Las heladas pueden ___ la cosecha.", "malograr", "lograr", "relograr"),
];
const NEG: ChoiceItem[] = [
  means("inequívoco", "Que no admite duda", "Que tiene muchos significados posibles", "Equivocado"), means("ilícito", "Contrario a la ley", "Permitido por todas las normas", "Lento"),
  means("desmesurado", "Excesivo, sin medida", "Pequeño y bien calculado", "Medido"), means("inaudito", "Nunca visto ni oído; increíble", "Muy común y conocido por todos", "Sordo"),
  f("Fue una marcha de ___ violencia, sin un solo incidente.", "no", "in", "des"), f("Su actitud fue ___: llegó tarde y no saludó.", "irrespetuosa", "respetuosa", "desrespetuosa"),
  f("El testimonio del testigo era ___ con los hechos.", "incoherente", "coherente", "descoherente"), f("La mina fue clausurada por ser ___.", "informal", "formal", "desformal"),
];
const OSO: ChoiceItem[] = [
  means("meticuloso", "Muy cuidadoso con los detalles", "Que hace todo rápido y sin cuidado", "Miedoso"), means("tortuoso", "Lleno de vueltas y dificultades", "Recto, corto y sin ningún obstáculo", "Lento"),
  means("fastuoso", "Lujoso y espectacular", "Sencillo y sin ningún adorno", "Rápido"), means("ostentoso", "Que se exhibe para llamar la atención", "Discreto, que no busca ser visto", "Oscuro"),
  f("El camino a Choquequirao es largo y ___.", "tortuoso", "tortura", "torturado"), f("Es un investigador ___: revisa cada dato.", "meticuloso", "meticulosidad", "metódicamente"),
  f("La boda fue ___: hubo orquesta y fuegos artificiales.", "fastuosa", "fasto", "fastidiosa"), f("Fue un discurso ___ que nadie entendió.", "pretencioso", "pretensión", "pretendido"),
];
const SIN: ChoiceItem[] = [
  means("atípico", "Que no es típico ni habitual", "Que es muy común y se repite siempre", "Típico"), means("anomalía", "Algo que se aparta de lo normal", "Algo totalmente normal y esperado", "Nombre"),
  means("sinsentido", "Algo absurdo, sin lógica", "Algo lógico y bien razonado", "Sentimiento"), means("acéfalo", "Sin jefe o sin cabeza", "Con muchos jefes al mismo tiempo", "Inteligente"),
  f("Fue un invierno ___: hizo calor todo julio.", "atípico", "típico", "tipificado"), f("El partido quedó ___ tras la renuncia de su líder.", "acéfalo", "cefálico", "encefalado"),
  f("Discutir por eso es un ___.", "sinsentido", "sentido", "sentimiento"), f("La carta era ___: nadie la firmó.", "anónima", "nominal", "nombrada"),
];
const ABLE: ChoiceItem[] = [
  means("indeleble", "Que no se puede borrar", "Que se borra con un poco de agua", "Débil"), means("inexorable", "Que no se puede evitar ni detener", "Que se detiene fácilmente con una súplica", "Duro"),
  means("plausible", "Que se puede admitir como posible o razonable", "Que es imposible y absurdo", "Aplaudido"), means("irrefutable", "Que no se puede negar", "Que se puede discutir y desmentir fácilmente", "Refrescante"),
  f("El paso del tiempo es ___.", "inexorable", "exorable", "exorado"), f("Usa un plumón ___ para marcar la caja.", "indeleble", "deleble", "borrado"),
  f("Presentó pruebas ___ de su inocencia.", "irrefutables", "refutables", "refutadas"), f("Es una explicación ___, aunque no está comprobada.", "plausible", "aplaudida", "aplausiva"),
];

// --- X. Raíces griegas y latinas -----------------------------------------------

const ROOT_CLUES: ChoiceItem[] = [
  pt("Usa la raíz como pista: ¿qué significa «xenofobia»?", "La raíz griega «xeno» significa «extranjero» y «fobia», «miedo o rechazo».", "Rechazo a los extranjeros", "Amor por los viajes al extranjero", "Miedo a la oscuridad"),
  pt("Usa la raíz como pista: ¿qué significa «hematología»?", "La raíz griega «hemo» significa «sangre».", "Estudio de la sangre", "Estudio de los huesos", "Estudio del sol"),
  pt("Usa la raíz como pista: ¿qué significa «equidistante»?", "La raíz latina «equi» significa «igual».", "Que está a igual distancia", "Que está muy lejos de todo", "Que está cerca"),
  pt("Usa la raíz como pista: ¿qué significa «retrospectiva»?", "La raíz latina «retro» significa «hacia atrás».", "Mirada hacia el pasado", "Plan para el futuro", "Vista lateral"),
  pt("Usa la raíz como pista: ¿qué significa «autónomo»?", "La raíz griega «auto» significa «uno mismo».", "Que se gobierna por sí mismo", "Que depende siempre de otros", "Que tiene auto"),
  pt("Usa la raíz como pista: ¿qué significa «crónico»?", "La raíz griega «crono» significa «tiempo».", "Que dura mucho tiempo", "Que dura solo unos segundos", "Que es leve"),
  pt("Usa la raíz como pista: ¿qué significa «benévolo»?", "La raíz latina «bene» significa «bien».", "Que tiene buena voluntad", "Que quiere hacer daño a los demás", "Que vuela"),
  pt("Usa la raíz como pista: ¿qué significa «pandemia»?", "La raíz griega «pan» significa «todo» y «demos», «pueblo».", "Enfermedad que afecta a todo el mundo", "Enfermedad que afecta a una sola persona", "Pan para todos"),
];
const WORDS_TO_ROOT: ChoiceItem[] = [
  w("Piensa en «cronología», «cronómetro» y «sincronizar». ¿Qué significa «crono»?", "tiempo", "ritmo", "historia"), w("Piensa en «aerolínea», «aeropuerto» y «aeróbico». ¿Qué significa «aero»?", "aire", "avión", "agua"),
  w("Piensa en «filosofía», «filantropía» y «bibliófilo». ¿Qué significa «filo»?", "amor o afición", "conocimiento", "libro"), w("Piensa en «manufactura», «manuscrito» y «manipular». ¿Qué significa «manu»?", "mano", "trabajo", "escritura"),
  w("Piensa en «democracia», «demografía» y «epidemia». ¿Qué significa «demo»?", "pueblo", "gobierno", "enfermedad"), w("Piensa en «gráfico», «autógrafo» y «caligrafía». ¿Qué significa «grafo»?", "escritura", "dibujo", "firma"),
  w("Piensa en «fonética», «sinfonía» y «micrófono». ¿Qué significa «fono»?", "sonido", "música", "voz alta"), w("Piensa en «hidroeléctrica», «hidratar» y «deshidratado». ¿Qué significa «hidro»?", "agua", "electricidad", "energía"),
];
const ROOT_MEANING = pool(([
  ["xeno", "extranjero"], ["hemo", "sangre"], ["equi", "igual"], ["retro", "hacia atrás"], ["pan", "todo"], ["demo", "pueblo"],
  ["neo", "nuevo"], ["paleo", "antiguo"], ["omni", "todo (latín)"], ["mega", "grande"], ["homo", "igual (griego)"], ["hetero", "diferente"],
] as [string, string][]).map(([root, a]) => [`¿Qué significa la raíz «${root}»?`, a] as [string, string]), "p");
const ROOT_WORDS: ChoiceItem[] = [
  means("paleontología", "Estudio de los seres vivos del pasado, a partir de fósiles", "Estudio de los planetas, las estrellas y las galaxias del universo", "Pintura antigua"), means("neologismo", "Palabra nueva en una lengua", "Palabra muy antigua que ya no se usa", "Lógica"),
  means("heterogéneo", "Formado por elementos diferentes", "Formado por elementos iguales entre sí", "Genético"), means("omnipotente", "Que todo lo puede", "Que no puede hacer nada por sí mismo sin ayuda", "Potente"),
  means("megalópolis", "Ciudad enorme", "Pueblo muy pequeño y alejado", "Policía"), means("homónimo", "Que tiene el mismo nombre que otro", "Que tiene un nombre muy diferente", "Hombre"),
  means("demografía", "Estudio estadístico de la población", "Estudio de las rocas, los suelos y los minerales", "Dibujo"), means("anacrónico", "Que no corresponde a su época", "Que es muy moderno y actual", "Crónico"),
];

// --- Y. Sinónimos y antónimos ----------------------------------------------------

const SYN = (sentence: string, word: string, a: string, ...d: string[]) => pt(`¿Qué palabra es sinónimo de «${word}»?`, sentence, a, ...d);
const SYNONYMS: ChoiceItem[] = [
  SYN("Su respuesta fue ambigua.", "ambigua", "imprecisa", "clara", "amplia"), SYN("Mostró una actitud altruista.", "altruista", "generosa", "egoísta", "alta"),
  SYN("El paisaje era inhóspito.", "inhóspito", "hostil", "acogedor", "hospitalario"), SYN("Su esfuerzo fue encomiable.", "encomiable", "admirable", "reprochable", "común"),
  SYN("Tuvo una idea brillante y novedosa.", "novedosa", "original", "antigua", "noble"), SYN("La reunión fue tediosa.", "tediosa", "aburrida", "divertida", "tierna"),
  SYN("Es un líder carismático.", "carismático", "cautivador", "antipático", "caro"), SYN("Hizo un análisis minucioso.", "minucioso", "detallado", "superficial", "pequeño"),
];
const ANT = (sentence: string, word: string, a: string, ...d: string[]) => pt(`¿Qué palabra es antónimo de «${word}»?`, sentence, a, ...d);
const ANTONYMS: ChoiceItem[] = [
  ANT("Fue un hallazgo trascendental.", "trascendental", "intrascendente", "importante", "transparente"), ANT("Es un clima benigno.", "benigno", "hostil", "templado", "bonito"),
  ANT("Su relato fue verídico.", "verídico", "falso", "real", "verde"), ANT("La ley es ambigua.", "ambigua", "precisa", "confusa", "amable"),
  ANT("Su carácter es apacible.", "apacible", "irascible", "tranquilo", "agradable"), ANT("Es una fruta perecible.", "perecible", "duradera", "frágil", "perezosa"),
  ANT("El orador fue prolijo.", "prolijo", "conciso", "extenso", "propio"), ANT("Tiene una visión optimista.", "optimista", "pesimista", "positiva", "óptica"),
];

// --- Z. Elección de las palabras --------------------------------------------------

const DIFFERENCE: ChoiceItem[] = [
  w("¿Cuál es la diferencia entre «informar» y «delatar»?", "Delatar es revelar una falta de alguien para que lo castiguen.", "Informar siempre tiene la intención de que alguien sea castigado.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «ahorrar» y «escatimar»?", "Escatimar es dar menos de lo debido, con mezquindad.", "Ahorrar es gastar todo sin pensar en el futuro.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «discutir» y «debatir»?", "Debatir es intercambiar argumentos de forma ordenada.", "Debatir es pelear a gritos sin ninguna regla.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «curioso» y «entrometido»?", "Entrometido es quien se mete donde no lo llaman.", "Curioso es quien se mete en asuntos ajenos sin permiso.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «firme» y «terco»?", "Terco es quien no cede aunque esté equivocado.", "Firme es quien nunca escucha razones ni cambia de opinión.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «sencillo» y «simplón»?", "Simplón tiene un matiz despectivo.", "Sencillo es siempre un insulto muy fuerte.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «aroma» y «tufo»?", "El aroma es agradable; el tufo, desagradable.", "El tufo es un olor más agradable que el aroma.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «multitud» y «turba»?", "Turba sugiere una multitud desordenada y violenta.", "Multitud siempre indica violencia y desorden.", "No hay diferencia."),
];
const CONN = sorter(["Connotación positiva", "Connotación negativa"], "¿Qué connotación tiene la palabra en MAYÚSCULAS?");
const CONNOTATION: ChoiceItem[] = [
  ...["Es un joven AUDAZ.", "Es una persona PRUDENTE.", "Tiene un estilo SOBRIO.", "Es un vendedor PERSUASIVO.", "Es una alumna DETERMINADA.", "Es un hombre ESBELTO."].map((x) => CONN(x, 0)),
  ...["Es un joven TEMERARIO.", "Es una persona COBARDE.", "Tiene un estilo SOSO.", "Es un vendedor MANIPULADOR.", "Es una alumna OBSTINADA.", "Es un hombre ESQUELÉTICO."].map((x) => CONN(x, 1)),
];

// --- AA. Homófonos ----------------------------------------------------------------

const HOMOPHONE_USE: ChoiceItem[] = [
  f("La ___ del Ministerio de Cultura está en San Borja.", "sede", "cede", "cedé"), f("El conductor ___ el paso al peatón.", "cede", "sede", "sedé"),
  f("David derrotó a Goliat con una ___.", "honda", "onda", "jonda"), f("La radio transmite en ___ corta.", "onda", "honda", "hondda"),
  f("En la lotería todo depende del ___.", "azar", "asar", "hazar"), f("Vamos a ___ choclos en la parrilla.", "asar", "azar", "hasar"),
  f("Le dolía la ___ derecha.", "sien", "cien", "zien"), f("Había ___ personas en la cola.", "cien", "sien", "zien"),
  f("___ mucho no haber llegado a tiempo.", "Siento", "Ciento", "Ziento"), f("Los platos de ___ se rompen fácilmente.", "loza", "losa", "lossa"),
  f("Pusieron una ___ de concreto en el techo.", "losa", "loza", "lozza"), f("Cada ___ que llueve, se inunda la calle.", "vez", "ves", "bez"),
];
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt("¿Qué significa «basta» en la oración?", "«¡Basta de excusas!».", "Es suficiente; se acabó", "Tela gruesa y áspera de los sacos", "Bastón"), pt("¿Qué significa «vasta» en la oración?", "«La Amazonía es una región vasta».", "Muy extensa", "Es suficiente; se acabó", "Grosera"),
  pt("¿Qué significa «bienes» en la oración?", "«Repartieron los bienes de la herencia».", "Propiedades o riquezas", "Forma del verbo venir en presente", "Saludos"), pt("¿Qué significa «vienes» en la oración?", "«¿Vienes a la fiesta?».", "Forma del verbo venir", "Propiedades o riquezas", "Ventanas"),
  pt("¿Qué significa «cauce» en la oración?", "«El río salió de su cauce».", "Lecho por donde corre el agua", "Árbol de madera blanda y hojas grandes", "Caída"), pt("¿Qué significa «cause» en la oración?", "«Espero que no cause problemas».", "Forma del verbo causar", "Lecho de un río", "Cauto"),
  pt("¿Qué significa «sesión» en la oración?", "«La sesión del Congreso duró seis horas».", "Reunión o junta", "Acción de ceder algo a otro", "Sección"), pt("¿Qué significa «cesión» en la oración?", "«Firmaron la cesión del terreno a la escuela».", "Acción de ceder algo a otro", "Reunión o junta", "Cesantía"),
];
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  w("¿En qué oración «tuvo» significa «forma del verbo tener»?", "Tuvo que regresar temprano.", "El tubo del agua se rompió.", "Compré un tubo de pintura."),
  w("¿En qué oración «botar» significa «arrojar, echar»?", "No hay que botar papeles al suelo.", "Mañana vamos a votar por el delegado.", "El pueblo salió a votar temprano."),
  w("¿En qué oración «hola» es un saludo?", "Hola, ¿cómo te fue en el examen?", "Una ola enorme llegó a la playa.", "Hubo una ola de calor."),
  w("¿En qué oración «asta» significa «palo de la bandera»?", "Izaron la bandera en el asta.", "Caminamos hasta la plaza.", "Esperé hasta las seis."),
  w("¿En qué oración «hasta» indica un límite?", "Te esperaré hasta las ocho.", "El venado tenía un asta rota.", "La bandera ondea en el asta."),
  w("¿En qué oración «revelar» significa «descubrir un secreto»?", "Al fin decidió revelar la verdad.", "Los estudiantes se van a rebelar.", "El pueblo quiso rebelarse."),
  w("¿En qué oración «rebelarse» significa «sublevarse»?", "Túpac Amaru II decidió rebelarse.", "Hay que revelar las fotos.", "Prometió revelar el secreto."),
  w("¿En qué oración «grabar» significa «registrar sonido o imagen»?", "Vamos a grabar un podcast.", "El impuesto va a gravar las importaciones.", "El Estado decidió gravar el tabaco."),
];

// --- BB. Analogías ------------------------------------------------------------------

const ANALOGY: ChoiceItem[] = [
  f("Novelista es a novela como dramaturgo es a ___.", "obra de teatro", "poema", "pintura al óleo sobre lienzo"), f("Pincel es a pintor como batuta es a ___.", "director de orquesta", "escultor", "pianista de una banda de rock"),
  f("Brújula es a orientarse como reloj es a ___.", "medir el tiempo", "calcular distancias entre ciudades", "pesar"), f("Huaino es a sierra como festejo es a ___.", "costa afroperuana", "selva", "puna y altiplano del sur andino"),
  f("Capítulo es a novela como acto es a ___.", "obra de teatro", "cuento", "poema"), f("Cardiólogo es a corazón como oftalmólogo es a ___.", "ojos", "dientes", "piel y cabello"),
  f("Sequía es a falta de agua como hambruna es a ___.", "falta de alimentos", "exceso de lluvia", "frío"), f("Inca es a Cusco como chimú es a ___.", "Chan Chan", "Caral", "la ciudad de Arequipa"),
];
const ANALOGY_HARD: ChoiceItem[] = [
  f("Prudente es a temerario como generoso es a ___.", "derrochador", "tacaño", "amable con todos"), f("Prólogo es a epílogo como amanecer es a ___.", "anochecer", "mañana", "sol del mediodía"),
  f("Efímero es a eterno como inédito es a ___.", "publicado", "nuevo", "breve y sin terminar"), f("Siembra es a cosecha como estudio es a ___.", "aprendizaje", "lápiz", "recreo largo del viernes"),
  f("Erosión es a viento como oxidación es a ___.", "oxígeno", "sol", "frío intenso de la puna"), f("Mito es a dioses como leyenda es a ___.", "héroes y lugares", "ciencia", "noticias de los diarios de hoy"),
  f("Censura es a expresión como represa es a ___.", "río", "luz", "aire de los pulmones"), f("Mecenas es a artista como patrocinador es a ___.", "deportista", "árbitro", "público que mira el partido"),
];

// --- CC. Claves de contexto ----------------------------------------------------------

const FIND_WORD: ChoiceItem[] = [
  f("Tras la derrota, el equipo regresó ___, sin hablar.", "cabizbajo", "eufórico", "orgulloso"), f("La ley fue ___: quedó sin efecto.", "derogada", "aprobada", "promulgada"),
  f("El testigo dio un relato ___: cada detalle coincidía.", "verosímil", "absurdo", "dudoso"), f("Era una persona ___: nunca hablaba de sí misma.", "reservada", "presumida", "conversadora"),
  f("La epidemia se ___ rápidamente por todo el pueblo.", "propagó", "detuvo", "curó"), f("El edificio, ___ tras el sismo, fue demolido.", "inhabitable", "habitable", "nuevo"),
  f("Las lluvias ___ los cultivos: se perdió todo.", "devastaron", "regaron", "mejoraron"), f("Su respuesta fue tan ___ que nadie supo qué quiso decir.", "ambigua", "clara", "precisa"),
];
const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «escueto»? (Busca un sinónimo en la oración).", "El informe fue escueto, breve y sin adornos.", "Breve", "Extenso y lleno de detalles", "Confuso"),
  pt("¿Qué significa «vehemente»? (Busca un sinónimo en la oración).", "Habló de forma vehemente, apasionada.", "Apasionada", "Tranquila y sin emoción", "Lenta"),
  pt("¿Qué significa «sórdido»? (Busca un sinónimo en la oración).", "Era un lugar sórdido, sucio y miserable.", "Sucio y miserable", "Limpio, ordenado y lujoso", "Silencioso"),
  pt("¿Qué significa «inefable»? (Busca un sinónimo en la oración).", "Sintió una alegría inefable, imposible de explicar con palabras.", "Imposible de explicar", "Fácil de contar a cualquiera", "Pequeña"),
  pt("¿Qué significa «ecuánime»? (Busca un sinónimo en la oración).", "El juez fue ecuánime, es decir, imparcial.", "Imparcial", "Injusto y favorable a una parte", "Rápido"),
  pt("¿Qué significa «lacónico»? (Busca un sinónimo en la oración).", "Respondió de modo lacónico, con muy pocas palabras.", "De pocas palabras", "Muy hablador", "Grosero"),
];
const ANT_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «pródigo»? (Busca un antónimo en la oración).", "Su hermano era ahorrativo; él, en cambio, era pródigo.", "Que gasta en exceso", "Que ahorra todo lo que gana", "Que es pobre"),
  pt("¿Qué significa «sumiso»? (Busca un antónimo en la oración).", "No era rebelde, sino sumiso.", "Obediente", "Rebelde y desobediente", "Triste"),
  pt("¿Qué significa «efusivo»? (Busca un antónimo en la oración).", "A diferencia de su padre, frío y distante, la madre era efusiva.", "Cariñosa y expresiva", "Fría y distante", "Seria"),
  pt("¿Qué significa «nocivo»? (Busca un antónimo en la oración).", "Algunos hongos son beneficiosos; otros, nocivos.", "Dañino", "Beneficioso para la salud", "Pequeño"),
  pt("¿Qué significa «fehaciente»? (Busca un antónimo en la oración).", "No eran rumores dudosos, sino pruebas fehacientes.", "Que prueba algo con certeza", "Dudoso, basado solo en rumores", "Falso"),
  pt("¿Qué significa «prolijo»? (Busca un antónimo en la oración).", "Te pedí un resumen breve, no un informe prolijo.", "Muy extenso y detallado", "Breve", "Desordenado y sin estructura clara"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «desidia»?", "Por desidia, nadie limpió el canal y el agua se estancó.", "Descuido, falta de interés", "Esfuerzo, dedicación y mucho cuidado", "Lluvia"),
  pt("¿Qué significa «paulatino»?", "La recuperación fue paulatina: cada semana, un poco mejor.", "Lento y gradual", "Repentino, de un momento a otro", "Imposible"),
  pt("¿Qué significa «perspicaz»?", "La detective, perspicaz, notó el detalle que todos pasaron por alto.", "Aguda y observadora", "Distraída y sin atención a lo que pasaba", "Cansada"),
  pt("¿Qué significa «exacerbar»?", "Los insultos solo exacerbaron el conflicto.", "Agravar, intensificar", "Calmar y tranquilizar a todos", "Resolver"),
  pt("¿Qué significa «estoico»?", "Soportó el dolor de forma estoica, sin quejarse.", "Con fortaleza y sin quejarse", "Llorando a gritos y quejándose de todo", "Con alegría"),
  pt("¿Qué significa «dilapidar»?", "Dilapidó la herencia en dos años de fiestas.", "Malgastar", "Ahorrar y guardar para el futuro", "Heredar"),
  pt("¿Qué significa «idóneo»?", "Es la persona idónea para el cargo: tiene experiencia y es honesta.", "Adecuado, apropiado", "Incapaz de hacer bien su trabajo", "Joven"),
  pt("¿Qué significa «escrutinio»?", "Tras el escrutinio de los votos, se anunció al ganador.", "Conteo y examen cuidadoso", "Robo de las ánforas", "Votación"),
];
const ACADEMIC_LIT: ChoiceItem[] = [
  f("El ___ es el que narra la historia desde dentro, como personaje.", "narrador protagonista", "lector", "editor"), f("La ___ ocurre cuando lo que pasa es lo contrario de lo esperado.", "ironía", "rima", "tesis"),
  f("El ___ es un salto hacia el pasado en la narración.", "flashback o analepsis", "clímax", "desenlace"), f("El ___ es la atmósfera emocional que transmite un texto.", "tono", "título", "índice"),
  f("Un ___ es un personaje que cambia a lo largo de la historia.", "personaje dinámico", "personaje plano", "narrador"), f("El ___ enfrenta al protagonista con su propia conciencia.", "conflicto interno", "conflicto externo", "escenario"),
  f("Un ___ es un objeto que representa una idea más amplia.", "símbolo", "verso", "capítulo"), f("La novela ___ retrata la vida y los problemas de los pueblos indígenas.", "indigenista", "policial", "de ciencia ficción"),
];
const ACADEMIC_INFO: ChoiceItem[] = [
  f("La autora ___ su tesis con datos y ejemplos.", "sustenta", "rima", "narra como un cuento"), f("Los resultados ___ que el método funciona.", "evidencian", "riman", "se imaginan sin pruebas"),
  f("El artículo ___ dos puntos de vista opuestos.", "contrasta", "dibuja", "canta"), f("Para ___ el problema, primero se define.", "abordar", "abordado", "olvidar por completo"),
  f("La ___ es la suposición que se pone a prueba en una investigación.", "hipótesis", "moraleja", "estrofa"), f("Las ___ del estudio indican que tuvo pocos participantes.", "limitaciones", "rimas", "metáforas"),
  f("El informe ___ las causas del problema antes de proponer soluciones.", "analiza", "rima", "inventa al azar"), f("Una ___ es una fuente original, como un diario o un documento de la época.", "fuente primaria", "fuente falsa", "fuente secundaria"),
];

// --- DD. Vocabulario de las áreas -----------------------------------------------------

const DOMAIN = pool([
  ["🧬 Proceso por el que las especies cambian a lo largo de generaciones", "evolución"], ["⚡ Flujo de cargas eléctricas por un conductor", "corriente eléctrica"], ["🏛️ Separación del poder en Ejecutivo, Legislativo y Judicial", "separación de poderes"], ["💹 Diferencia entre lo que un país exporta e importa", "balanza comercial"],
  ["🌋 Placa de la corteza terrestre que se mueve lentamente", "placa tectónica"], ["🦠 Organismo microscópico de una sola célula, sin núcleo", "bacteria"], ["📐 Lado opuesto al ángulo recto en un triángulo rectángulo", "hipotenusa"], ["🗳️ Derecho a votar y ser elegido", "sufragio"],
  ["🌡️ Aumento de la temperatura media del planeta", "calentamiento global"], ["⚗️ Sustancia formada por dos o más elementos químicos unidos", "compuesto"],
]);

// --- EE. Uso del diccionario -------------------------------------------------------

const ABC = [["transacción", "transcribir", "transcurrir", "transeúnte", "transferir"], ["preferir", "pregunta", "prejuicio", "preludio", "premio"], ["comparar", "compartir", "compás", "compasión", "compatible"], ["intención", "intenso", "intentar", "interés", "interior"], ["resolver", "respeto", "respirar", "responder", "restaurar"], ["desafío", "desarrollo", "desastre", "desayuno", "descanso"]];
const GUIDE = (a: string, b: string, ans: string, ...d: string[]) => w(`Las palabras guía de la página son «${a}» y «${b}». ¿Qué palabra está en esa página?`, ans, ...d);
const GUIDE_WORDS: ChoiceItem[] = [
  GUIDE("bodega", "bolsillo", "boleto", "bombilla", "bocina", "bobina"), GUIDE("galería", "garaje", "ganado", "garra", "galaxia", "gala"),
  GUIDE("hábito", "hallazgo", "hacienda", "hamaca", "habitación", "haba"), GUIDE("lindero", "llave", "litoral", "llover", "límite", "limón"),
  GUIDE("opinión", "orgullo", "orden", "orilla", "operar", "opaco"), GUIDE("selva", "sentido", "semana", "señal", "sello", "selfi"),
  GUIDE("tribu", "trompo", "triunfo", "trueno", "tribal", "tregua"), GUIDE("vecino", "vena", "vejez", "vencer", "vaso", "vecindario"),
];
const ENTRY = "acervo s. m. 1. Conjunto de bienes culturales o morales que pertenecen a una comunidad: el acervo cultural andino. 2. Montón de cosas menudas.";
const ENTRY2 = "inocuo, cua adj. Que no hace daño: una sustancia inocua. Sin. inofensivo. Ant. nocivo, dañino.";
const ENTRY3 = "corriente adj. 1. Que es común, habitual. s. f. 2. Movimiento del agua o del aire en una dirección. 3. Movimiento de cargas eléctricas. 4. Tendencia artística o de pensamiento.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «acervo»?", ENTRY, "Sustantivo masculino", "Adjetivo", "Verbo"), pt("Según la entrada, ¿cuántas acepciones tiene «acervo»?", ENTRY, "Dos", "Tres", "Una"),
  pt("Según la entrada, ¿para qué sirve «el acervo cultural andino»?", ENTRY, "Es un ejemplo de uso", "Es un antónimo", "Es la pronunciación"), pt("Según la entrada, ¿cuál es la forma femenina de «inocuo»?", ENTRY2, "inocua", "inocuo", "inocuá"),
  pt("Según la entrada, ¿cuál es un antónimo de «inocuo»?", ENTRY2, "nocivo", "inofensivo", "inocua"), pt("Según la entrada, ¿cuál es un sinónimo de «inocuo»?", ENTRY2, "inofensivo", "dañino", "nocivo"),
  pt("Según la entrada, ¿qué clases de palabra puede ser «corriente»?", ENTRY3, "Adjetivo y sustantivo femenino", "Solo verbo", "Solo adverbio"), pt("Según la entrada, ¿qué indica «Ant.»?", ENTRY2, "Antónimo", "Antiguo", "Anterior"),
];
const WHICH = "¿Qué acepción corresponde a la oración?";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY3}\n\n«Es un problema corriente en las ciudades».`, "La acepción 1", "La acepción 2", "La acepción 4"), pt(WHICH, `${ENTRY3}\n\n«La corriente del río arrastró la balsa».`, "La acepción 2", "La acepción 1", "La acepción 3"),
  pt(WHICH, `${ENTRY3}\n\n«Se cortó la corriente en todo el barrio».`, "La acepción 3", "La acepción 2", "La acepción 4"), pt(WHICH, `${ENTRY3}\n\n«El indigenismo fue una corriente literaria».`, "La acepción 4", "La acepción 1", "La acepción 3"),
  pt(WHICH, `${ENTRY}\n\n«Las danzas forman parte del acervo de la región».`, "La acepción 1", "La acepción 2", "Ninguna"), pt(WHICH, `${ENTRY}\n\n«Barrió el acervo de papelitos que quedó en el piso».`, "La acepción 2", "La acepción 1", "Ninguna"),
];
const THES = "DICCIONARIO DE SINÓNIMOS\nfeliz adj. Sin. alegre, dichoso, eufórico, radiante, satisfecho. Ant. triste, desdichado.";
const THES2 = "DICCIONARIO DE SINÓNIMOS\nmirar v. Sin. observar, contemplar, escudriñar, vigilar, ojear. Ant. ignorar.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué sinónimo de «feliz» conviene para una alegría desbordante, casi descontrolada?", THES, "eufórico", "satisfecho", "triste"), pt("Según la entrada, ¿qué sinónimo conviene para alguien contento con su trabajo bien hecho?", THES, "satisfecho", "eufórico", "desdichado"),
  pt("Según la entrada, ¿cuál es un antónimo de «feliz»?", THES, "desdichado", "dichoso", "radiante"), pt("Según la entrada, ¿qué sinónimo de «mirar» conviene para examinar algo con mucho detalle?", THES2, "escudriñar", "ojear", "ignorar"),
  pt("Según la entrada, ¿qué sinónimo conviene para mirar un paisaje con calma y admiración?", THES2, "contemplar", "vigilar", "escudriñar"), pt("Según la entrada, ¿qué sinónimo conviene en «El guardia ___ la entrada toda la noche»?", THES2, "vigilaba", "contemplaba", "ojeaba"),
  pt("Según la entrada, ¿qué sinónimo conviene en «Solo ___ el periódico; no lo leí completo»?", THES2, "ojeé", "escudriñé", "contemplé"), pt("¿Para qué sirve un diccionario de sinónimos?", THES, "Para elegir la palabra con el matiz más preciso", "Para conocer la pronunciación", "Para traducir al inglés"),
];

export const ROWS: Row[] = [
  ["W.1", "Palabras con pre-", (r) => choose(r, "Completa la oración.", PRE)],
  ["W.2", "Palabras con re-", (r) => choose(r, "Completa la oración.", RE)],
  ["W.3", "Palabras con sub-", (r) => choose(r, "Completa la oración.", SUB)],
  ["W.4", "Palabras con mal-", (r) => choose(r, "Completa la oración.", MAL)],
  ["W.5", "Palabras con des-, in-, im-, i- y no", (r) => choose(r, "Completa la oración.", NEG)],
  ["W.6", "Palabras con -oso y -osa", (r) => choose(r, "Completa la oración.", OSO)],
  ["W.7", "Palabras con a-, an- y sin-", (r) => choose(r, "Completa la oración.", SIN)],
  ["W.8", "Palabras con -able e -ible", (r) => choose(r, "Completa la oración.", ABLE)],

  ["X.1", "Usar raíces griegas y latinas como pistas del significado de las palabras", (r) => choose(r, "", ROOT_CLUES)],
  ["X.2", "Usar palabras como pistas del significado de raíces griegas y latinas", (r) => choose(r, "", WORDS_TO_ROOT)],
  ["X.3", "Determinar el significado de raíces griegas y latinas", (r) => choose(r, "", ROOT_MEANING)],
  ["X.4", "Determinar el significado de palabras con raíces griegas y latinas", (r) => choose(r, "", ROOT_WORDS)],

  ["Y.1", "Elegir el sinónimo", (r) => choose(r, "", SYNONYMS)],
  ["Y.2", "Elegir el antónimo", (r) => choose(r, "", ANTONYMS)],

  ["Z.1", "Describir la diferencia entre palabras parecidas", (r) => choose(r, "", DIFFERENCE)],
  ["Z.2", "Connotación positiva y negativa", (r) => choose(r, "", CONNOTATION)],

  ["AA.1", "Usar el homófono correcto", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["AA.2", "¿Qué definición corresponde a la oración?", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["AA.3", "¿Qué oración corresponde a la definición?", (r) => choose(r, "", SENTENCE_FOR_DEF)],

  ["BB.1", "Analogías", (r) => choose(r, "Completa la analogía.", ANALOGY)],
  ["BB.2", "Analogías: desafío", (r) => choose(r, "Completa la analogía.", ANALOGY_HARD)],

  ["CC.1", "Encontrar palabras usando el contexto", (r) => choose(r, "¿Qué palabra completa mejor la oración?", FIND_WORD)],
  ["CC.2", "Determinar el significado de palabras usando sinónimos en contexto", (r) => choose(r, "", SYN_CLUE)],
  ["CC.3", "Determinar el significado de palabras usando antónimos en contexto", (r) => choose(r, "", ANT_CLUE)],
  ["CC.4", "Usar el contexto para identificar el significado de una palabra", (r) => choose(r, "", CONTEXT)],
  ["CC.5", "Usar vocabulario académico en contexto: textos literarios", (r) => choose(r, "Completa la oración.", ACADEMIC_LIT)],
  ["CC.6", "Usar vocabulario académico en contexto: textos informativos", (r) => choose(r, "Completa la oración.", ACADEMIC_INFO)],

  ["DD.1", "Determinar el significado de palabras de las áreas, con dibujos", (r) => choose(r, "¿Qué término corresponde al dibujo y a la definición?", DOMAIN)],

  ["EE.1", "Ordenar alfabéticamente", (r) => abcOrder(r, ABC, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["EE.2", "Usar las palabras guía", (r) => choose(r, "", GUIDE_WORDS)],
  ["EE.3", "Usar las entradas del diccionario", (r) => choose(r, "", DICTIONARY)],
  ["EE.4", "Usar las definiciones del diccionario", (r) => choose(r, "", DEFINITIONS)],
  ["EE.5", "Usar las entradas del diccionario de sinónimos", (r) => choose(r, "", THESAURUS)],
];
