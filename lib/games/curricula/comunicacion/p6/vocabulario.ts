import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import { abcOrder, f, pool, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 6.° de Primaria · banco de vocabulario: prefijos (mal-, des-, in-, im-, i-,
// a-/an-, sin) y sufijos (-oso, -able, -ible), raíces griegas y latinas,
// homófonos, modismos, matices, analogías, contexto y diccionario.


const ask = (q: (x: string) => string, list: [string, string][]) => pool(list.map(([x, a]) => [q(x), a] as [string, string]), "p");
const means = (word: string, a: string, ...d: string[]) => w(`¿Qué significa «${word}»?`, a, ...d);

// --- Prefijos y sufijos ---------------------------------------------------

const PRE: ChoiceItem[] = [
  means("predisponer", "Preparar el ánimo de antemano", "Disponer algo por segunda vez", "Desordenar"), means("prematuro", "Que ocurre antes de tiempo", "Que llega demasiado tarde a todo", "Muy maduro"),
  means("preámbulo", "Lo que se dice antes de entrar en materia", "Resumen que va al final", "Paseo corto"), means("presentir", "Intuir algo antes de que suceda", "Sentir de nuevo lo mismo que ayer", "No sentir"),
  means("prefijo", "Elemento que va antes de la raíz", "Elemento que va después de la raíz", "Palabra fija"), means("preestablecido", "Fijado con anterioridad", "Establecido otra vez desde cero", "Sin establecer"),
  f("El bebé nació ___, a los siete meses.", "prematuro", "maduro", "inmaduramente"), f("Tras un breve ___, el director anunció a los ganadores.", "preámbulo", "epílogo", "ambulatorio"),
  f("Empecé a ___ que algo andaba mal.", "presentir", "resentir", "consentir"), f("Seguimos el orden ___ en el reglamento.", "preestablecido", "restablecido", "desestabilizado"),
];
const RE: ChoiceItem[] = [
  means("reanudar", "Continuar lo que se había interrumpido", "Interrumpir algo que iba muy bien", "Anudar fuerte"), means("replantear", "Volver a plantear de otra manera", "Plantear por primera vez", "Dejar de plantear"),
  means("restablecer", "Volver a poner en su estado anterior", "Establecer algo nunca antes visto", "Destruir"), means("reincidir", "Volver a cometer una falta", "Corregir una falta para siempre", "Evitar"),
  means("recapitular", "Repasar de forma resumida lo dicho", "Escribir un capítulo totalmente nuevo", "Olvidar"), means("reivindicar", "Reclamar lo que a uno le corresponde", "Renunciar a lo que le corresponde", "Vender"),
  f("Tras la lluvia, se va a ___ el partido.", "reanudar", "anudar", "desanudar"), f("Antes del examen, vamos a ___ lo aprendido.", "recapitular", "capitular", "decapitar"),
  f("El médico logró ___ la salud del paciente.", "restablecer", "establecerse", "desestabilizar"), f("Si no funciona, hay que ___ el problema.", "replantear", "desplantar", "implantar"),
];
const SUB: ChoiceItem[] = [
  means("subestimar", "Dar a algo menos valor del que tiene", "Dar a algo más valor del que tiene", "Estimar bien"), means("subsistir", "Mantenerse con vida a duras penas", "Vivir con gran abundancia y lujos", "Dejar de existir"),
  means("subordinado", "Que depende de otro superior", "Que manda sobre todos los demás", "Sin orden"), means("subyacer", "Estar oculto debajo de algo", "Estar a la vista encima de todo", "Yacer al lado"),
  means("subdividir", "Dividir lo que ya estaba dividido", "Unir las partes en una sola", "No dividir"), means("subconsciente", "Lo que está por debajo de la conciencia", "Lo que se piensa con total claridad", "Sin ciencia"),
  f("No debes ___ a tu rival: es mejor de lo que crees.", "subestimar", "sobrestimar", "estimular"), f("Con tan poca lluvia, las plantas apenas logran ___.", "subsistir", "insistir", "desistir"),
  f("El capítulo se va a ___ en tres secciones.", "subdividir", "multiplicar", "individuar"), f("Bajo su enojo parecía ___ una gran tristeza.", "subyacer", "sobresalir", "yacimiento"),
];
const MAL: ChoiceItem[] = [
  means("malversar", "Usar indebidamente dinero ajeno", "Administrar con honradez el dinero", "Conversar mal"), means("maldecir", "Decir palabras contra alguien o algo", "Decir palabras de elogio a alguien", "Decir poco"),
  means("malograr", "Echar a perder", "Lograr con muchísimo esfuerzo", "Lograr dos veces"), means("malestar", "Sensación de incomodidad", "Sensación de gran bienestar", "Estar lejos"),
  means("malpensado", "Que tiende a pensar mal de los demás", "Que piensa siempre bien de todos", "Que no piensa"), means("malnutrición", "Alimentación deficiente", "Alimentación abundante y equilibrada", "Falta de sed"),
  f("Sentí un ___ en el estómago después de almorzar.", "malestar", "bienestar", "estatura"), f("La helada puede ___ toda la cosecha.", "malograr", "lograr", "relograr"),
  f("Lo acusaron de ___ los fondos del municipio.", "malversar", "conversar", "versificar"), f("La ___ infantil afecta el aprendizaje.", "malnutrición", "nutrición", "nutricionista"),
];
const NEG: ChoiceItem[] = [
  means("inadmisible", "Que no se puede aceptar", "Que se acepta con mucho gusto", "Admitido antes"), means("imparcial", "Que no favorece a ninguna parte", "Que favorece siempre a un amigo", "En partes"),
  means("irreversible", "Que no puede volver atrás", "Que se puede deshacer fácilmente", "Al revés"), means("desinteresado", "Que actúa sin buscar provecho", "Que solo busca su propio provecho", "Muy curioso"),
  means("ilegible", "Que no se puede leer", "Que se lee con gran facilidad", "Que lee mucho"), means("inverosímil", "Que parece imposible de creer", "Que parece totalmente cierto", "Muy parecido"),
  means("desproporcionado", "Que no guarda proporción", "Que está perfectamente equilibrado", "En porciones"), means("impune", "Que queda sin castigo", "Que recibe un castigo muy severo", "Muy puntual"),
  f("Un árbitro debe ser ___.", "imparcial", "parcial", "parcialmente"), f("Su letra era tan pequeña que resultaba ___.", "ilegible", "legible", "legendaria"),
  f("El daño al glaciar es ___.", "irreversible", "reversible", "reverso"), f("Su excusa sonó ___: nadie la creyó.", "inverosímil", "verosímil", "verdadera"),
];
const OSO: ChoiceItem[] = [
  means("fastuoso", "Lleno de lujo y esplendor", "Sencillo y sin ningún adorno", "Muy rápido"), means("minucioso", "Que cuida los menores detalles", "Que hace todo de prisa y mal", "Muy pequeño"),
  means("tedioso", "Que causa aburrimiento", "Que resulta apasionante y ameno", "Con mucho té"), means("ostentoso", "Que hace alarde de riqueza", "Que oculta todo lo que tiene", "Muy tímido"),
  means("tortuoso", "Que tiene muchas vueltas", "Que es recto y fácil de seguir", "Con tortas"), means("clamoroso", "Acompañado de gritos y aplausos", "Que ocurre en completo silencio", "Muy claro"),
  f("El camino a la cima era ___: curva tras curva.", "tortuoso", "torturado", "tortuga"), f("Hizo un trabajo ___: revisó cada cifra.", "minucioso", "minúsculo", "diminutivo"),
  f("El discurso fue tan ___ que varios bostezaron.", "tedioso", "tenaz", "teatral"), f("El equipo tuvo un recibimiento ___.", "clamoroso", "clamor", "aclamar"),
];
const SIN: ChoiceItem[] = [
  means("apático", "Que no muestra interés ni emoción", "Que se entusiasma con todo", "Muy simpático"), means("amorfo", "Que no tiene forma definida", "Que tiene una forma perfecta", "Enamorado"),
  means("anarquía", "Ausencia de gobierno", "Gobierno de un rey muy poderoso", "Arca antigua"), means("asintomático", "Que no presenta síntomas", "Que tiene síntomas muy graves", "Sin tomate"),
  means("sinsentido", "Algo que carece de lógica", "Algo muy bien razonado y claro", "Sentido común"), means("ateo", "Que no cree en ningún dios", "Que cree en muchos dioses", "Muy religioso"),
  means("anónimo", "De autor desconocido", "De autor muy conocido por todos", "Con dos nombres"), means("sinnúmero", "Cantidad incalculable", "Cantidad muy pequeña y exacta", "Número par"),
  f("Estaba ___: nada parecía importarle.", "apático", "simpático", "empático"), f("La masa era todavía ___, sin forma.", "amorfa", "amorosa", "morfológica"),
  f("Tenía el virus, pero era ___.", "asintomático", "sintomático", "sistemático"), f("Recibió un ___ de felicitaciones.", "sinnúmero", "número", "numeral"),
];
const ABLE: ChoiceItem[] = [
  means("plausible", "Digno de aplauso o admisible", "Imposible de aceptar o de creer", "Muy lento"), means("perecible", "Que se echa a perder pronto", "Que dura muchísimos años", "Que parece"),
  means("tangible", "Que se puede tocar", "Que solo existe en la imaginación", "Que baila tango"), means("vulnerable", "Que puede ser dañado", "Que no puede sufrir ningún daño", "Muy veloz"),
  means("sostenible", "Que puede mantenerse sin agotar recursos", "Que agota pronto los recursos", "Que sostiene"), means("factible", "Que se puede hacer", "Que es totalmente irrealizable", "Hecho en fábrica"),
  means("inagotable", "Que no se acaba", "Que se termina enseguida", "Muy cansado"), means("comprensible", "Que se puede entender", "Que nadie logra entender nunca", "Que comprime"),
  f("La leche es un producto ___: guárdala en frío.", "perecible", "perecer", "parecido"), f("El plan es ___: tenemos tiempo y recursos.", "factible", "factura", "ficticio"),
  f("Los niños son los más ___ ante el frío.", "vulnerables", "venerables", "invulnerables"), f("La pesca debe ser ___ para que haya peces mañana.", "sostenible", "sostenida", "insostenible"),
];

// --- Raíces griegas y latinas ---------------------------------------------

const ROOT_CLUES: ChoiceItem[] = [
  w("«Antropo-» significa «ser humano». ¿Qué estudia la antropología?", "Al ser humano y sus culturas", "A los animales y sus costumbres", "A las rocas"), w("«Filo-» significa «amor». ¿Qué es un bibliófilo?", "Quien ama los libros", "Quien teme a los libros antiguos", "Quien vende libros"),
  w("«Poli-» significa «muchos» y «glot-», «lengua». ¿Qué es un políglota?", "Quien habla muchas lenguas", "Quien no habla ninguna lengua", "Quien come mucho"), w("«Pseudo-» significa «falso». ¿Qué es un pseudónimo?", "Un nombre falso que usa un autor", "El nombre verdadero de un autor", "Un apodo cariñoso"),
  w("«Pan-» significa «todo». ¿Qué es una pandemia?", "Una enfermedad que se extiende por todo el mundo", "Una enfermedad de un solo barrio", "Una panadería"), w("«Neo-» significa «nuevo». ¿Qué es un neologismo?", "Una palabra nueva en la lengua", "Una palabra muy antigua y en desuso", "Un error"),
  w("«Cosmo-» significa «universo». ¿Qué es un cosmonauta?", "Quien viaja por el espacio", "Quien navega por los ríos", "Quien estudia el mar"), w("«Paleo-» significa «antiguo». ¿Qué estudia la paleontología?", "Los seres vivos del pasado remoto", "Los seres vivos que nacerán", "Las palabras"),
  w("«Orto-» significa «correcto». ¿Qué es la ortografía?", "La escritura correcta", "La escritura hecha a mano", "La letra bonita"), w("«Hetero-» significa «distinto». ¿Qué es un grupo heterogéneo?", "Uno formado por elementos distintos", "Uno formado por elementos iguales", "Uno muy pequeño"),
];
const MEANING_TO_ROOT: ChoiceItem[] = [
  w("«Antropología» estudia al ser humano y «filántropo» es quien ama a la humanidad. ¿Qué significa «antropo-»?", "ser humano", "estudio", "amor"), w("«Bibliófilo» ama los libros y «filosofía» es amor a la sabiduría. ¿Qué significa «filo-»?", "amor", "libro", "saber"),
  w("«Pseudónimo» es un nombre falso y «pseudociencia», una ciencia falsa. ¿Qué significa «pseudo-»?", "falso", "nombre", "ciencia"), w("«Neologismo» es una palabra nueva y «neonato», un recién nacido. ¿Qué significa «neo-»?", "nuevo", "palabra", "niño"),
  w("«Ortografía» es escritura correcta y «ortodoncia» corrige los dientes. ¿Qué significa «orto-»?", "correcto", "diente", "letra"), w("«Homogéneo» es de igual clase y «homónimo», de igual nombre. ¿Qué significa «homo-»?", "igual", "nombre", "clase"),
  w("«Cosmonauta» viaja por el universo y «cosmos» es el universo. ¿Qué significa «cosmo-»?", "universo", "viaje", "nave"), w("«Hemisferio» es media esfera y «atmósfera», la esfera de gases. ¿Qué significa «-sfera»?", "esfera", "gas", "mitad"),
  w("«Cronología» ordena en el tiempo y «anacrónico» está fuera de su tiempo. ¿Qué significa «crono-»?", "tiempo", "orden", "fuera"), w("«Geografía» describe la Tierra y «geólogo» la estudia. ¿Qué significa «geo-»?", "tierra", "estudio", "mapa"),
];
const WORDS_TO_ROOT = ask((t) => `Observa las palabras: ${t}. ¿Qué significa la raíz que comparten?`, [
  ["monarquía, anarquía, jerarquía", "gobierno"], ["biblioteca, hemeroteca, pinacoteca", "lugar donde se guarda"], ["cardiología, biología, geología", "estudio"], ["omnívoro, herbívoro, carnívoro", "que come"],
  ["políglota, polígono, politeísmo", "muchos"], ["autógrafo, autonomía, automóvil", "por sí mismo"], ["hidratar, hidroeléctrica, hidrógeno", "agua"], ["neonato, neologismo, neoclásico", "nuevo"],
  ["filántropo, antropología, antropomorfo", "ser humano"], ["psicología, psiquiatra, psíquico", "mente"],
]);
const ROOT_MEANING = ask((t) => `¿Qué significa la raíz ${t}?`, [
  ["antropo- (antropología)", "ser humano"], ["filo- (filosofía, bibliófilo)", "amor"], ["pseudo- (pseudónimo)", "falso"], ["neo- (neologismo)", "nuevo"],
  ["orto- (ortografía)", "correcto"], ["homo- (homogéneo)", "igual"], ["hetero- (heterogéneo)", "distinto"], ["pan- (pandemia, panamericano)", "todo"],
  ["psico- (psicología)", "mente"], ["-teca (biblioteca)", "depósito"], ["-arquía (monarquía)", "gobierno"], ["paleo- (paleolítico)", "antiguo"],
]);
const ROOT_WORDS: ChoiceItem[] = [
  means("filántropo", "Persona que ayuda a los demás por amor a la humanidad", "Persona que estudia a los seres humanos del pasado", "Persona que odia"), means("hemeroteca", "Lugar donde se guardan diarios y revistas", "Lugar donde se guardan pinturas y esculturas", "Farmacia"),
  means("monarquía", "Gobierno de un solo rey o reina", "Gobierno elegido por todo el pueblo", "Falta de gobierno"), means("politeísmo", "Creencia en muchos dioses", "Creencia en un único dios", "Falta de creencias"),
  means("homónimo", "Que tiene el mismo nombre", "Que tiene un nombre muy distinto", "Sin nombre"), means("anacrónico", "Que no corresponde a su época", "Que es propio de su tiempo", "Muy puntual"),
  means("pinacoteca", "Museo de pinturas", "Depósito de libros antiguos", "Tienda de pinos"), means("panamericano", "De toda América", "De una sola ciudad americana", "De un panadero"),
  means("psicología", "Estudio de la mente y la conducta", "Estudio de los peces y los mares", "Estudio de las plantas"), means("neoclásico", "Que retoma lo clásico con forma nueva", "Que rechaza todo lo clásico", "Muy antiguo"),
];

// --- Sinónimos y antónimos ------------------------------------------------

const SYNONYMS = ask((x) => `¿Cuál es un sinónimo de «${x}»?`, [
  ["efímero", "pasajero"], ["perspicaz", "agudo"], ["meticuloso", "minucioso"], ["austero", "sobrio"], ["insólito", "inusual"], ["elocuente", "expresivo"],
  ["obstinado", "terco"], ["vasto", "extenso"], ["lúgubre", "sombrío"], ["ecuánime", "imparcial"], ["trivial", "insignificante"], ["benévolo", "bondadoso"],
]);
const SYN = "¿Qué palabra del texto es sinónimo de la palabra destacada?";
const SYN_CONTEXT: ChoiceItem[] = [
  pt(SYN, "Fue una alegría EFÍMERA: tan pasajera que al día siguiente nadie la recordaba.", "pasajera", "siguiente", "recordaba"), pt(SYN, "El juez se mostró ECUÁNIME. Todos reconocieron que había sido imparcial.", "imparcial", "reconocieron", "todos"),
  pt(SYN, "Era un paraje INHÓSPITO; nadie quería vivir en un lugar tan desolado.", "desolado", "quería", "lugar"), pt(SYN, "Su respuesta fue AMBIGUA. Por lo confusa, cada quien entendió algo distinto.", "confusa", "distinto", "entendió"),
  pt(SYN, "Llevaba una vida AUSTERA, sobria hasta en las fiestas.", "sobria", "fiestas", "llevaba"), pt(SYN, "El anciano era OBSTINADO: tan terco que nadie logró convencerlo.", "terco", "convencerlo", "nadie"),
  pt(SYN, "Fue un hecho INSÓLITO. Algo tan inusual no ocurría desde hacía un siglo.", "inusual", "ocurría", "siglo"), pt(SYN, "La sala tenía un aire LÚGUBRE; la luz tenue la hacía aún más sombría.", "sombría", "tenue", "sala"),
];
const ANTONYMS = ask((x) => `¿Cuál es un antónimo de «${x}»?`, [
  ["efímero", "duradero"], ["austero", "derrochador"], ["insólito", "habitual"], ["obstinado", "flexible"], ["vasto", "reducido"], ["lúgubre", "alegre"],
  ["trivial", "importante"], ["benévolo", "malévolo"], ["ambiguo", "preciso"], ["escaso", "abundante"], ["cauto", "temerario"], ["nítido", "difuso"],
]);
const ANTC = "¿Qué palabra del texto es antónimo de la palabra destacada?";
const ANT_CONTEXT: ChoiceItem[] = [
  pt(ANTC, "Lo que parecía un problema TRIVIAL resultó ser importante.", "importante", "problema", "parecía"), pt(ANTC, "Su hermano es CAUTO; él, en cambio, es temerario.", "temerario", "hermano", "cambio"),
  pt(ANTC, "El primer discurso fue AMBIGUO; el segundo, preciso.", "preciso", "segundo", "discurso"), pt(ANTC, "La fama suele ser EFÍMERA, pero el buen nombre es duradero.", "duradero", "nombre", "fama"),
  pt(ANTC, "De un rey BENÉVOLO pasaron a un sucesor malévolo.", "malévolo", "sucesor", "pasaron"), pt(ANTC, "La foto de lejos salió DIFUSA; la de cerca, nítida.", "nítida", "cerca", "lejos"),
  pt(ANTC, "Era AUSTERO en casa y derrochador cuando viajaba.", "derrochador", "viajaba", "casa"), pt(ANTC, "Lo INSÓLITO terminó volviéndose habitual.", "habitual", "terminó", "volviéndose"),
];

// --- Homófonos ------------------------------------------------------------

const HOMOPHONE_USE: ChoiceItem[] = [
  f("El juez ___ que el acusado era inocente.", "halló", "hayó", "ayó"), f("Espero que ___ buenas noticias.", "haya", "halla", "aya"),
  f("La ___ del árbol alimenta las hojas.", "savia", "sabia", "sabía"), f("El pueblo se ___ contra el abuso.", "rebeló", "reveló", "revelo"),
  f("El fotógrafo ___ las imágenes.", "reveló", "rebeló", "rebelo"), f("___ el pollo a fuego lento.", "Cuece", "Cuese", "Cuesse"),
  f("La costurera ___ el dobladillo.", "cose", "coce", "coze"), f("Hay que ___ las mercancías importadas con un impuesto.", "gravar", "grabar", "gravár"),
  f("Voy a ___ un video para la clase.", "grabar", "gravar", "grabár"), f("Subimos a la ___ del cerro.", "cima", "sima", "cimma"),
  f("El espeleólogo descendió a una ___ profunda.", "sima", "cima", "zima"), f("Me ___ en datos comprobados.", "baso", "vaso", "bazo"),
];
const DEF = "¿Qué significado tiene la palabra destacada en la oración?";
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt(DEF, "El CUADRO clínico del paciente mejoró.", "Conjunto de síntomas", "Pintura enmarcada en la pared", "Figura de cuatro lados"), pt(DEF, "Colgó un CUADRO en la sala.", "Pintura enmarcada", "Conjunto de síntomas de un enfermo", "Equipo"),
  pt(DEF, "El BANCO de niebla cubrió la carretera.", "Masa extensa de niebla", "Entidad que guarda y presta dinero", "Asiento"), pt(DEF, "El texto tiene un REGISTRO formal.", "Modo de expresarse según la situación", "Libro donde se anotan los nacimientos", "Inspección"),
  pt(DEF, "La POTENCIA del motor es de cien caballos.", "Capacidad de producir trabajo", "País de gran poder económico", "Exponente"), pt(DEF, "Dos elevado a la tercera POTENCIA es ocho.", "Producto de multiplicar un número por sí mismo", "Fuerza de un motor o de una máquina", "País"),
  pt(DEF, "El ARTÍCULO 2 de la Constitución habla de los derechos.", "Cada parte numerada de una ley", "Palabra que acompaña al sustantivo", "Mercancía"), pt(DEF, "«El» es un ARTÍCULO.", "Palabra que acompaña al sustantivo", "Texto publicado en un periódico", "Mercancía"),
  pt(DEF, "La ópera tiene tres ACTOS.", "Partes en que se divide una obra", "Acciones que realiza una persona", "Ceremonias"), pt(DEF, "Hubo un ACTO por Fiestas Patrias.", "Ceremonia pública", "Parte de una obra de teatro o de ópera", "Hecho"),
];
const SENT = "¿En qué oración la palabra tiene ese significado?";
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  pt(SENT, "columna: sección vertical de un periódico", "Escribe una columna de opinión cada domingo.", "Le duele la columna desde que cargó el costal.", "El templo tiene una columna."),
  pt(SENT, "red: conjunto de computadoras conectadas", "La red de la escuela está caída.", "El pescador remendó la red con hilo grueso.", "La pelota tocó la red."),
  pt(SENT, "tesis: idea que se defiende con argumentos", "La tesis del ensayo aparece en el primer párrafo.", "Sustentó su tesis para graduarse de ingeniera.", "La tesis tenía 200 páginas."),
  pt(SENT, "planta: fábrica o instalación industrial", "La planta procesa mil litros de leche al día.", "La planta necesita sol y agua para crecer.", "Vive en la segunda planta."),
  pt(SENT, "clave: código para acceder a algo", "Cambia tu clave cada cierto tiempo.", "La clave del éxito es la constancia diaria.", "Es una pieza clave."),
  pt(SENT, "carrera: estudios para ejercer una profesión", "Eligió la carrera de enfermería.", "Ganó la carrera de cien metros por una cabeza.", "Fue una carrera reñida."),
  pt(SENT, "justo: apretado, ceñido", "El zapato me queda justo.", "El profesor fue justo al calificar a todos.", "Llegó justo a tiempo."),
  pt(SENT, "cara: de precio elevado", "Esa casaca es demasiado cara.", "Se lavó la cara con agua helada del caño.", "Tiene buena cara."),
];

// --- Modismos y refranes --------------------------------------------------

const IDIOM = "¿Qué significa la expresión destacada?";
const IDIOM_CONTEXT_1: ChoiceItem[] = [
  pt(IDIOM, "El alcalde prometió el puente, pero después SE LAVÓ LAS MANOS.", "Se desentendió del asunto.", "Se aseó antes de la inauguración.", "Trabajó duro."), pt(IDIOM, "Tuvimos que HACER DE TRIPAS CORAZÓN para terminar la caminata.", "Sacar fuerzas pese a la dificultad.", "Preparar un plato típico con menudencia.", "Rendirnos."),
  pt(IDIOM, "En la reunión, Lucía PUSO EL DEDO EN LA LLAGA.", "Señaló el verdadero problema.", "Se lastimó la mano con la puerta.", "Guardó silencio."), pt(IDIOM, "Con esa pregunta ME AGARRÓ EN CURVA.", "Me tomó desprevenido.", "Me alcanzó en la carretera.", "Me ayudó."),
  pt(IDIOM, "No te AHOGUES EN UN VASO DE AGUA.", "No te angusties por algo pequeño.", "No bebas con tanta prisa.", "Aprende a nadar."), pt(IDIOM, "El nuevo delegado LLEGÓ PISANDO FUERTE.", "Empezó con mucha seguridad.", "Hizo ruido con sus zapatos nuevos.", "Llegó cojeando."),
  pt(IDIOM, "Estuve EN ASCUAS hasta que publicaron las notas.", "Muy inquieto por la espera.", "Sentado junto a la fogata.", "Dormido."), pt(IDIOM, "Su explicación NO TIENE NI PIES NI CABEZA.", "Carece de sentido.", "Le falta un dibujo del cuerpo.", "Es brillante."),
];
const SAYING_1: ChoiceItem[] = [
  w("¿Qué significa «No por mucho madrugar amanece más temprano»?", "Apresurarse no adelanta lo que tiene su tiempo.", "Hay que levantarse antes de que salga el sol.", "Dormir es malo."), w("¿Qué significa «Del dicho al hecho hay mucho trecho»?", "Prometer es más fácil que cumplir.", "Hay que caminar bastante para llegar lejos.", "Hablar cansa."),
  w("¿Qué significa «A río revuelto, ganancia de pescadores»?", "Algunos se aprovechan del desorden.", "Se pesca mejor cuando el río está crecido.", "Pescar es rentable."), w("¿Qué significa «El que calla otorga»?", "Quien no se opone parece estar de acuerdo.", "Quien guarda silencio recibe un premio.", "Callar es bueno."),
  w("¿Qué significa «Más sabe el diablo por viejo que por diablo»?", "La experiencia enseña más que la astucia.", "Los ancianos son personas muy traviesas.", "El diablo es viejo."), w("¿Qué significa «No hay peor ciego que el que no quiere ver»?", "Es inútil convencer a quien se niega a aceptar la realidad.", "La ceguera es la peor enfermedad.", "Hay que usar lentes."),
  w("¿Qué significa «Ir al grano»?", "Tratar lo esencial sin rodeos.", "Cosechar el maíz en la chacra.", "Comer cereales."), w("¿Qué significa «Dar gato por liebre»?", "Engañar entregando algo de menor calidad.", "Regalar una mascota a un vecino.", "Cocinar bien."),
];
const IDIOM_CONTEXT_2: ChoiceItem[] = [
  pt(IDIOM, "Cuando vio el desorden, mi mamá PUSO EL GRITO EN EL CIELO.", "Se indignó muchísimo.", "Rezó en voz muy alta.", "Se rio."), pt(IDIOM, "El plan parecía perfecto, pero HIZO AGUA por todos lados.", "Fracasó.", "Se mojó con la lluvia del techo.", "Triunfó."),
  pt(IDIOM, "Ese alumno es LA OVEJA NEGRA del salón.", "El que se comporta distinto, para mal.", "El que cuida el rebaño de la escuela.", "El mejor."), pt(IDIOM, "Le SALIÓ EL TIRO POR LA CULATA.", "Obtuvo lo contrario de lo que buscaba.", "Disparó un arma en medio del campo abierto.", "Acertó."),
  pt(IDIOM, "Hay que TOMAR EL TORO POR LAS ASTAS.", "Enfrentar el problema con decisión.", "Ir a una corrida en la plaza de toros.", "Huir."), pt(IDIOM, "Aprobó el curso POR UN PELO.", "Por muy poco.", "Gracias a su nuevo peinado.", "Con la nota más alta."),
  pt(IDIOM, "Me contó la historia CON PELOS Y SEÑALES.", "Con todos los detalles.", "Usando gestos de las manos.", "Muy resumida."), pt(IDIOM, "Después de la pelea, decidieron HACER BORRÓN Y CUENTA NUEVA.", "Olvidar lo pasado y empezar de nuevo.", "Borrar la pizarra del salón antes del recreo.", "Seguir peleando."),
];
const SAYING_2: ChoiceItem[] = [
  w("¿Qué significa «Cría fama y échate a dormir»?", "La reputación ganada sigue actuando por uno.", "Las personas famosas duermen demasiado y trabajan poco.", "Dormir da fama."), w("¿Qué significa «Aunque la mona se vista de seda, mona se queda»?", "Lo que se es no cambia con la apariencia.", "Los monos no deben usar ropa fina ni zapatos.", "La seda es cara."),
  w("¿Qué significa «A buen entendedor, pocas palabras»?", "Quien es listo comprende sin largas explicaciones.", "Hay que hablar poco con todos, incluso con los amigos.", "Entender es difícil."), w("¿Qué significa «No se ganó Zamora en una hora»?", "Lo importante requiere tiempo y paciencia.", "Zamora es una ciudad muy lejana y difícil de hallar.", "Hay que apurarse."),
  w("¿Qué significa «Cada loco con su tema»?", "Cada quien insiste en lo que le interesa.", "Los locos estudian mucho y siempre el mismo curso.", "Hay muchos temas."), w("¿Qué significa «Más vale maña que fuerza»?", "La habilidad logra más que la fuerza bruta.", "Hay que hacer ejercicio cada mañana, sin falta.", "La fuerza gana."),
  w("¿Qué significa «Estar entre dos aguas»?", "No decidirse entre dos opciones.", "Nadar en medio de un río caudaloso.", "Tener sed."), w("¿Qué significa «Quemar las naves»?", "Tomar una decisión que impide retroceder.", "Incendiar un puerto entero por un descuido.", "Viajar en barco."),
];

// --- Elección y uso ------------------------------------------------------

const DIFFERENCE: ChoiceItem[] = [
  w("¿En qué se diferencian «mirar» y «contemplar»?", "«Contemplar» es mirar con calma y admiración.", "«Mirar» es observar con mucha más atención.", "Son iguales."), w("¿En qué se diferencian «convencer» y «persuadir»?", "«Persuadir» apela más a las emociones.", "«Convencer» usa siempre la fuerza física.", "Son contrarios."),
  w("¿En qué se diferencian «error» y «mentira»?", "La «mentira» es intencional.", "El «error» siempre se hace a propósito.", "Son iguales."), w("¿En qué se diferencian «solo» y «solitario»?", "«Solitario» sugiere que prefiere estar sin compañía.", "«Solo» indica que odia a la gente.", "Son contrarios."),
  w("¿En qué se diferencian «económico» y «tacaño»?", "«Tacaño» critica a quien evita gastar.", "«Económico» es siempre un insulto fuerte.", "Son iguales."), w("¿En qué se diferencian «informar» y «opinar»?", "«Opinar» añade un juicio personal.", "«Informar» consiste en dar un juicio personal.", "Son iguales."),
  w("¿En qué se diferencian «murmullo» y «estruendo»?", "El «estruendo» es un ruido muy fuerte.", "El «murmullo» es un ruido ensordecedor.", "Son iguales."), w("¿En qué se diferencian «conocer» y «dominar»?", "«Dominar» implica un saber profundo.", "«Conocer» implica un saber mayor.", "Son contrarios."),
];
const CON = sorter(["Positiva 👍", "Negativa 👎"], "¿La palabra destacada tiene una connotación positiva o negativa?");
const CONNOTATION: ChoiceItem[] = [
  ...["Es un líder FIRME.", "Tiene una actitud CAUTELOSA.", "Es un joven AMBICIOSO y trabajador.", "Su estilo es ATREVIDO.", "Es una persona AHORRADORA.", "Dio una respuesta DIRECTA.", "Es muy SEGURO de sí mismo."].map((x) => CON(x, 0)),
  ...["Es un líder AUTORITARIO.", "Tiene una actitud COBARDE.", "Es un joven CODICIOSO.", "Su estilo es VULGAR.", "Es una persona MEZQUINA.", "Dio una respuesta BRUSCA.", "Es muy ARROGANTE."].map((x) => CON(x, 1)),
];

// --- Analogías -----------------------------------------------------------

const ANALOGY: ChoiceItem[] = [
  f("autor es a novela como compositor es a ___", "sinfonía", "orquesta", "violín"), f("termómetro es a temperatura como balanza es a ___", "peso", "kilo", "plato"),
  f("sequía es a lluvia como hambre es a ___", "alimento", "estómago", "cocina"), f("capítulo es a novela como estrofa es a ___", "poema", "verso", "rima"),
  f("timón es a barco como volante es a ___", "auto", "carretera", "chofer"), f("juez es a tribunal como médico es a ___", "hospital", "receta", "paciente"),
  f("prólogo es a inicio como epílogo es a ___", "final", "libro", "título"), f("abeja es a colmena como hormiga es a ___", "hormiguero", "hoja", "azúcar"),
  f("nevado es a hielo como desierto es a ___", "arena", "cactus", "calor"), f("ver es a ojo como oír es a ___", "oído", "sonido", "audífono"),
  f("origen es a fin como alba es a ___", "ocaso", "mediodía", "sol"), f("maestro es a enseñar como juez es a ___", "juzgar", "ley", "martillo"),
];
const ANALOGY_HARD: ChoiceItem[] = [
  f("efímero es a duradero como escaso es a ___", "abundante", "poco", "limitado"), f("pincel es a pintor como cincel es a ___", "escultor", "mármol", "estatua"),
  f("prefacio es a libro como obertura es a ___", "ópera", "música", "teatro"), f("hipótesis es a comprobar como promesa es a ___", "cumplir", "decir", "jurar"),
  f("átomo es a molécula como letra es a ___", "palabra", "alfabeto", "sonido"), f("archipiélago es a isla como constelación es a ___", "estrella", "cielo", "planeta"),
  f("síntoma es a enfermedad como humo es a ___", "fuego", "chimenea", "ceniza"), f("sequía es a hambruna como chispa es a ___", "incendio", "fósforo", "luz"),
  f("elogiar es a criticar como construir es a ___", "demoler", "edificar", "planear"), f("biblioteca es a libros como pinacoteca es a ___", "pinturas", "pinos", "música"),
  f("monólogo es a uno como diálogo es a ___", "dos", "muchos", "nadie"), f("orador es a elocuencia como atleta es a ___", "resistencia", "estadio", "medalla"),
];

// --- Claves de contexto --------------------------------------------------

const FIND_WORD: ChoiceItem[] = [
  f("Tras una espera ___, por fin anunciaron al ganador.", "interminable", "brevísima", "puntual"), f("El testigo dio una versión ___: se contradijo tres veces.", "incoherente", "precisa", "convincente"),
  f("La noticia causó ___ en todo el pueblo: nadie hablaba de otra cosa.", "revuelo", "indiferencia", "silencio"), f("Con gesto ___, rechazó la ayuda que le ofrecían.", "altivo", "humilde", "agradecido"),
  f("El terreno era tan ___ que el agua desaparecía al instante.", "permeable", "impermeable", "resbaloso"), f("Su discurso fue ___: en dos minutos lo dijo todo.", "conciso", "extenso", "repetitivo"),
  f("El ladrón actuó con ___: nadie oyó nada.", "sigilo", "estrépito", "torpeza"), f("Era un debate ___: ninguno quería ceder.", "reñido", "amistoso", "breve"),
  f("La ciudad quedó ___ tras el terremoto.", "devastada", "intacta", "embellecida"), f("Fue una decisión ___: la tomó sin pensar.", "precipitada", "meditada", "prudente"),
];
const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «exiguo»?", "Recibió un sueldo exiguo, es decir, muy escaso.", "Muy escaso", "Muy generoso", "Muy tardío"), pt("¿Qué significa «locuaz»?", "Era un vendedor locuaz, muy hablador.", "Hablador", "Callado", "Honrado"),
  pt("¿Qué significa «ineludible»?", "Es un deber ineludible: no se puede evitar.", "Inevitable", "Opcional", "Olvidado"), pt("¿Qué significa «aledaño»?", "Visitamos los pueblos aledaños, o sea, los vecinos.", "Cercano", "Lejano", "Antiguo"),
  pt("¿Qué significa «fidedigno»?", "Es una fuente fidedigna, digna de confianza.", "Confiable", "Dudosa", "Reciente"), pt("¿Qué significa «taciturno»?", "Llegó taciturno, callado y pensativo.", "Silencioso", "Bullicioso", "Alegre"),
  pt("¿Qué significa «menester»?", "Es menester, o necesario, llegar puntual.", "Necesario", "Prohibido", "Difícil"), pt("¿Qué significa «colosal»?", "Era una estatua colosal, gigantesca.", "Enorme", "Diminuta", "Antigua"),
];
const ANT_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «parco»?", "A diferencia de su hermano, tan hablador, él era parco.", "De pocas palabras", "Muy conversador", "Muy alto"), pt("¿Qué significa «lóbrego»?", "El salón, antes luminoso, quedó lóbrego tras el apagón.", "Oscuro", "Brillante", "Amplio"),
  pt("¿Qué significa «diáfano»?", "El agua no estaba turbia, sino diáfana.", "Transparente", "Sucia y maloliente", "Salada"), pt("¿Qué significa «frugal»?", "No fue un banquete abundante, sino una cena frugal.", "Moderada", "Excesiva", "Fría"),
  pt("¿Qué significa «dócil»?", "El potro, antes rebelde, se volvió dócil.", "Obediente", "Indomable", "Veloz"), pt("¿Qué significa «pusilánime»?", "No era valiente como su hermana: era pusilánime.", "Falto de valor", "Muy audaz y decidido", "Muy fuerte"),
  pt("¿Qué significa «perenne»?", "No es una planta de temporada, sino perenne.", "Que dura todo el año", "Que dura apenas un mes", "Que no florece"), pt("¿Qué significa «enjuto»?", "Lejos de ser robusto, era un hombre enjuto.", "Delgado", "Corpulento", "Alto"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «mitigar»?", "Plantaron árboles para mitigar el calor: bajo su sombra, la plaza es más fresca.", "Atenuar", "Aumentar", "Medir"), pt("¿Qué significa «proliferar»?", "Con las lluvias empezaron a proliferar los mosquitos: en una semana estaban en todas partes.", "Multiplicarse", "Desaparecer", "Dormir"),
  pt("¿Qué significa «escéptico»?", "Se mostró escéptico: pidió pruebas antes de creer en la noticia.", "Que duda", "Que cree todo", "Que se asusta"), pt("¿Qué significa «vestigio»?", "De la antigua muralla solo queda un vestigio: unas pocas piedras.", "Resto", "Plano", "Dueño"),
  pt("¿Qué significa «ecuánime»?", "Escuchó a las dos partes sin alterarse y decidió con ecuanimidad.", "Con calma y justicia", "Con furia", "Con prisa"), pt("¿Qué significa «endeble»?", "La escalera era endeble: crujía y se movía con cada paso.", "Frágil", "Sólida", "Nueva"),
  pt("¿Qué significa «soslayar»?", "No podemos soslayar el problema: hay que enfrentarlo ahora.", "Evitar", "Resolver", "Explicar"), pt("¿Qué significa «paulatino»?", "El cambio fue paulatino: nadie lo notó hasta meses después.", "Gradual", "Repentino", "Violento"),
];
const ACADEMIC_LIT: ChoiceItem[] = [
  f("El ___ es el personaje principal del relato.", "protagonista", "narrador omnisciente", "desenlace"), f("El momento de mayor tensión de la trama es el ___.", "clímax", "prólogo", "epílogo"),
  f("El ___ es quien se opone al protagonista.", "antagonista", "narrador", "autor"), f("El ___ de un cuento es el lugar y el tiempo en que ocurre.", "escenario", "tema", "conflicto"),
  f("La idea profunda que transmite una obra es su ___.", "tema", "título", "trama"), f("Una ___ es una pista que anticipa lo que ocurrirá.", "prefiguración", "moraleja", "acotación"),
  f("El ___ es la voz que cuenta la historia.", "narrador", "lector", "editor"), f("Decir lo contrario de lo que se piensa, con intención, es ___.", "ironía", "rima", "métrica"),
  f("Las indicaciones entre paréntesis de una obra de teatro son ___.", "acotaciones", "estrofas", "capítulos"), f("La enseñanza de una fábula es su ___.", "moraleja", "metáfora", "clímax"),
];
const ACADEMIC_INFO: ChoiceItem[] = [
  f("La ___ es la postura que defiende un texto argumentativo.", "tesis", "anécdota", "rima"), f("Los datos que respaldan una afirmación son la ___.", "evidencia", "opinión", "hipérbole"),
  f("Un texto ___ presenta información sin dar opiniones.", "expositivo", "lírico", "dramático"), f("___ es resumir las ideas esenciales de un texto.", "Sintetizar", "Memorizar", "Decorar"),
  f("Una ___ es una conclusión a la que se llega a partir de pistas.", "inferencia", "cita", "portada"), f("Un texto es ___ cuando sus ideas se relacionan con lógica.", "coherente", "extenso", "antiguo"),
  f("La ___ es una explicación provisional que debe comprobarse.", "hipótesis", "conclusión", "bibliografía"), f("Una fuente ___ es aquella en la que se puede confiar.", "confiable", "anónima", "sesgada"),
  f("El ___ de un autor es su manera de ver un tema.", "punto de vista", "seudónimo", "glosario"), f("___ dos fuentes es comprobar si dicen lo mismo.", "Contrastar", "Plagiar", "Subrayar"),
];

// --- Vocabulario de las áreas --------------------------------------------

const DOMAIN = pool([
  ["🌋 Roca fundida que se encuentra bajo la corteza terrestre", "magma"], ["🧬 Molécula que contiene la información hereditaria", "ADN"], ["⚖️ Fuerza con que la Tierra atrae los cuerpos", "gravedad"], ["🗺️ Línea imaginaria que une los dos polos", "meridiano"],
  ["🏛️ Forma de gobierno en que el pueblo elige a sus autoridades", "democracia"], ["🔢 Número que solo se divide entre uno y entre sí mismo", "primo"], ["🌿 Conjunto de seres vivos y su ambiente", "ecosistema"], ["💧 Paso del agua de líquido a vapor", "evaporación"],
  ["📐 Segmento que une el centro de un círculo con su borde", "radio"], ["🦴 Animal que tiene columna vertebral", "vertebrado"],
]);

// --- Uso del diccionario -------------------------------------------------

const ABC = [["transcurso", "transformar", "tránsito", "transmitir", "transparente"], ["consecuencia", "conservar", "considerar", "consistir", "constante"], ["reflejo", "reflexión", "reforma", "refrán", "refugio"], ["interés", "interior", "intermedio", "internet", "intervalo"], ["precaución", "preceder", "precio", "preciso", "predecir"], ["estrategia", "estrecho", "estrella", "estreno", "estribo"]];
const GUIDE_WORDS: ChoiceItem[] = [
  w("Las palabras guía de la página son «informe» y «ingreso». ¿Qué palabra está en esa página?", "ingenio", "inicio", "índice", "imán"), w("Las palabras guía de la página son «producto» y «prólogo». ¿Qué palabra está en esa página?", "programa", "pronto", "proceso", "prisa"),
  w("Las palabras guía de la página son «recurso» y «refrán». ¿Qué palabra está en esa página?", "reflejo", "regla", "recibo", "rebaño"), w("Las palabras guía de la página son «contexto» y «contrato». ¿Qué palabra está en esa página?", "contorno", "control", "contar", "conserva"),
  w("Las palabras guía de la página son «sistema» y «sobre». ¿Qué palabra está en esa página?", "situación", "socio", "sirena", "sílaba"), w("Las palabras guía de la página son «materia» y «mayoría». ¿Qué palabra está en esa página?", "matiz", "mazorca", "masa", "marea"),
  w("Las palabras guía de la página son «extenso» y «extraño». ¿Qué palabra está en esa página?", "exterior", "extremo", "experto", "éxito"), w("Las palabras guía de la página son «volcán» y «voto». ¿Qué palabra está en esa página?", "voluntad", "voz", "vocal", "vista"),
];
const ENTRY = "sustentar v. tr. 1. Sostener algo para que no se caiga. 2. Proveer del alimento necesario. 3. Defender una idea con razones. Der. sustento, sustentable.";
const ENTRY2 = "ávido, da adj. Que desea algo con ansia: ávido de aprender. Sin. ansioso, deseoso. Ant. desinteresado.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «sustentar»?", ENTRY, "Verbo transitivo", "Sustantivo masculino", "Adjetivo"), pt("Según la entrada, ¿cuántas acepciones tiene «sustentar»?", ENTRY, "Tres", "Dos", "Una"),
  pt("Según la entrada, ¿qué son «sustento» y «sustentable»?", ENTRY, "Palabras derivadas", "Sinónimos de sustentar", "Antónimos"), pt("Según la entrada, ¿qué indica «, da» después de «ávido»?", ENTRY2, "La terminación del femenino", "El plural de la palabra «ávido»", "Un sinónimo"),
  pt("Según la entrada, ¿para qué sirve «ávido de aprender»?", ENTRY2, "Para mostrar un ejemplo de uso", "Para dar la definición", "Para indicar el antónimo de la palabra"), pt("Según la entrada, ¿cuál es un antónimo de «ávido»?", ENTRY2, "desinteresado", "ansioso de saber", "deseoso"),
  pt("Según la entrada, ¿qué clase de palabra es «ávido»?", ENTRY2, "Adjetivo", "Verbo", "Adverbio"), pt("Según la entrada, ¿qué significa «tr.»?", ENTRY, "Transitivo", "Traducción", "Tradicional"),
];
const WHICH = "¿Qué acepción se usa en la oración?";
const ENTRY3 = "registro s. m. 1. Acción de examinar algo con cuidado. 2. Libro o lista donde se anotan datos. 3. Modo de hablar según la situación. 4. Extensión de notas de una voz.";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY}\n\n«La alumna sustentó su opinión con tres argumentos».`, "La acepción 3", "La acepción 1", "La acepción 2"), pt(WHICH, `${ENTRY}\n\n«Dos columnas sustentan el techo».`, "La acepción 1", "La acepción 2", "La acepción 3"),
  pt(WHICH, `${ENTRY}\n\n«Con su trabajo sustenta a cuatro hijos».`, "La acepción 2", "La acepción 1", "La acepción 3"), pt(WHICH, `${ENTRY3}\n\n«La policía hizo un registro de la casa».`, "La acepción 1", "La acepción 2", "La acepción 4"),
  pt(WHICH, `${ENTRY3}\n\n«Tu nombre figura en el registro de asistencia».`, "La acepción 2", "La acepción 1", "La acepción 3"), pt(WHICH, `${ENTRY3}\n\n«En una carta al director conviene un registro formal».`, "La acepción 3", "La acepción 2", "La acepción 4"),
  pt(WHICH, `${ENTRY3}\n\n«La soprano tiene un registro muy amplio».`, "La acepción 4", "La acepción 1", "La acepción 3"),
];
const THES = "DICCIONARIO DE SINÓNIMOS\ndifícil adj. Sin. complicado, arduo, complejo, laborioso, espinoso. Ant. fácil, sencillo.";
const THES2 = "DICCIONARIO DE SINÓNIMOS\nmostrar v. Sin. enseñar, exhibir, evidenciar, revelar, demostrar. Ant. ocultar, esconder.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué sinónimo de «difícil» conviene para un trabajo que exige mucho esfuerzo?", THES, "arduo", "sencillo", "fácil"), pt("Según la entrada, ¿qué sinónimo conviene para un tema delicado de tratar?", THES, "espinoso", "laborioso", "fácil"),
  pt("Según la entrada, ¿cuál es un antónimo de «difícil»?", THES, "sencillo", "complejo", "arduo"), pt("Según la entrada, ¿qué sinónimo de «mostrar» conviene para una pintura en un museo?", THES2, "exhibir", "ocultar", "esconder"),
  pt("Según la entrada, ¿qué sinónimo conviene para un secreto que sale a la luz?", THES2, "revelar", "exhibir", "ocultar"), pt("Según la entrada, ¿qué sinónimo conviene en «Los datos ___ que la hipótesis era cierta»?", THES2, "evidencian", "esconden", "exhiben"),
  pt("Según la entrada, ¿cuál es un antónimo de «mostrar»?", THES2, "ocultar", "revelar", "enseñar"), pt("¿Por qué no todos los sinónimos sirven en cualquier oración?", THES, "Porque cada uno tiene un matiz distinto", "Porque están mal escritos", "Porque son antónimos"),
];

export const ROWS: Row[] = [
  ["prefijos-1", (r) => choose(r, "Completa la oración.", PRE)],
  ["prefijos-2", (r) => choose(r, "Completa la oración.", RE)],
  ["prefijos-3", (r) => choose(r, "Completa la oración.", SUB)],
  ["prefijos-4", (r) => choose(r, "Completa la oración.", MAL)],
  ["prefijos-5", (r) => choose(r, "Completa la oración.", NEG)],
  ["sufijos-1", (r) => choose(r, "Completa la oración.", OSO)],
  ["prefijos-6", (r) => choose(r, "Completa la oración.", SIN)],
  ["sufijos-2", (r) => choose(r, "Completa la oración.", ABLE)],

  ["griegas-latinas-1", (r) => choose(r, "", ROOT_CLUES)],
  ["griegas-latinas-2", (r) => choose(r, "", MEANING_TO_ROOT)],
  ["griegas-latinas-3", (r) => choose(r, "", WORDS_TO_ROOT)],
  ["griegas-latinas-4", (r) => choose(r, "", ROOT_MEANING)],
  ["griegas-latinas-5", (r) => choose(r, "", ROOT_WORDS)],

  ["sinonimos-antonimos-1", (r) => choose(r, "", SYNONYMS)],
  ["sinonimos-antonimos-2", (r) => choose(r, "", SYN_CONTEXT)],
  ["sinonimos-antonimos-3", (r) => choose(r, "", ANTONYMS)],
  ["sinonimos-antonimos-4", (r) => choose(r, "", ANT_CONTEXT)],

  ["homofonos-1", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["homofonos-2", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["homofonos-3", (r) => choose(r, "", SENTENCE_FOR_DEF)],

  ["modismos-1", (r) => choose(r, "", IDIOM_CONTEXT_1)],
  ["modismos-2", (r) => choose(r, "", SAYING_1)],
  ["modismos-3", (r) => choose(r, "", IDIOM_CONTEXT_2)],
  ["modismos-4", (r) => choose(r, "", SAYING_2)],

  ["matices-1", (r) => choose(r, "", DIFFERENCE)],
  ["matices-2", (r) => choose(r, "", CONNOTATION)],

  ["analogias-1", (r) => choose(r, "Completa la analogía.", ANALOGY)],
  ["analogias-2", (r) => choose(r, "Completa la analogía.", ANALOGY_HARD)],

  ["contexto-1", (r) => choose(r, "¿Qué palabra completa mejor la oración?", FIND_WORD)],
  ["contexto-2", (r) => choose(r, "", SYN_CLUE)],
  ["contexto-3", (r) => choose(r, "", ANT_CLUE)],
  ["contexto-4", (r) => choose(r, "", CONTEXT)],
  ["academico-1", (r) => choose(r, "Completa la oración.", ACADEMIC_LIT)],
  ["academico-2", (r) => choose(r, "Completa la oración.", ACADEMIC_INFO)],

  ["academico-3", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la definición?", DOMAIN)],

  ["diccionario-1", (r) => abcOrder(r, ABC, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["diccionario-2", (r) => choose(r, "", GUIDE_WORDS)],
  ["diccionario-3", (r) => choose(r, "", DICTIONARY)],
  ["diccionario-4", (r) => choose(r, "", DEFINITIONS)],
  ["diccionario-5", (r) => choose(r, "", THESAURUS)],
];
