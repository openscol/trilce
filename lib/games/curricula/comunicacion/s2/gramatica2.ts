import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 8th grade ELA, OO-YY), con las
// reglas del castellano (las mismas adaptaciones que en 1.°):
//   orden de los adjetivos → posición del adjetivo y formas cortas (buen, gran, primer)
//   good/better/best, bad/worse/worst → bueno, mejor, óptimo; malo, peor, pésimo
//   well/better/best, badly/worse/worst → bien, mejor; mal, peor
//   conjunciones correlativas → ni… ni, o… o, tanto… como, no solo… sino también
//   misplaced / dangling modifiers → modificadores mal colocados y gerundios mal usados
//   restrictive / nonrestrictive → especificativas (sin comas) y explicativas (con comas)
//   hyphens in compound adjectives → guion en adjetivos compuestos (político-económico)
//   mayúsculas: días, meses, gentilicios e idiomas van con minúscula; en los
//   títulos, solo la primera palabra y los nombres propios
//   citas y diálogos: comillas angulares («») y raya (—)

export const SECTIONS: Section[] = [
  { id: "OO", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "PP", name: "Preposiciones", icon: "📦" },
  { id: "QQ", name: "Objeto directo e indirecto", icon: "🎯" },
  { id: "RR", name: "Conjunciones", icon: "🔗" },
  { id: "SS", name: "Modificadores mal colocados", icon: "🧲" },
  { id: "TT", name: "Elementos explicativos y especificativos", icon: "🔍" },
  { id: "UU", name: "Comas", icon: "❗" },
  { id: "VV", name: "Punto y coma, dos puntos y comas", icon: "⏸️" },
  { id: "WW", name: "Raya, guion y puntos suspensivos", icon: "➖" },
  { id: "XX", name: "Mayúsculas", icon: "🔠" },
  { id: "YY", name: "Formato", icon: "📝" },
];

// --- OO. Adjetivos y adverbios -----------------------------------------------

const ADJECTIVES_IN = [
  s("Una neblina espesa cubría el puerto silencioso.", "espesa", "silencioso"), s("El joven arqueólogo halló una tumba intacta.", "joven", "intacta"), s("Las danzas puneñas tienen trajes deslumbrantes.", "puneñas", "deslumbrantes"),
  s("Compramos un queso fresco y salado.", "fresco", "salado"), s("Aquel invierno crudo dejó pastos secos.", "crudo", "secos"), s("La anciana sabia contaba historias asombrosas.", "sabia", "asombrosas"),
  s("Un río caudaloso cruza la selva tropical.", "caudaloso", "tropical"), s("Su voz grave llenó el auditorio vacío.", "grave", "vacío"),
];
const ADJ_ORDER: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Es el primer puesto del concurso.", "Es el primero puesto del concurso.", "Es el puesto primer del concurso."), w("¿Qué oración está bien escrita?", "Fue un mal día.", "Fue un malo día.", "Fue un día mal."),
  w("¿Qué oración está bien escrita?", "Es un gran escritor.", "Es un grande escritor.", "Es un escritor gran."), w("¿Qué oración está bien escrita?", "Ningún alumno faltó.", "Ninguno alumno faltó.", "Alumno ningún faltó."),
  w("¿Qué oración está bien escrita?", "Vimos dos pequeños colibríes verdes.", "Vimos pequeños dos colibríes verdes.", "Vimos colibríes dos verdes pequeños."), w("¿Qué oración está bien escrita?", "Cualquier día te visito.", "Cualquiera día te visito.", "Día cualquier te visito."),
  w("¿Qué significa «un viejo amigo»?", "Un amigo de hace muchos años", "Un amigo de edad avanzada", "Un amigo enojado"), w("¿Qué significa «un amigo viejo»?", "Un amigo de edad avanzada", "Un amigo de hace muchos años", "Un amigo nuevo"),
  w("¿Qué significa «simple vista»?", "La vista sin instrumentos", "Una vista muy sencilla y aburrida", "Una vista lejana"), w("¿Qué significa «un alto funcionario»?", "Un funcionario de cargo importante", "Un funcionario de gran estatura", "Un funcionario joven"),
];
const ADVERBS_IN = [
  s("Mañana llegaremos bastante temprano.", "Mañana", "bastante", "temprano"), s("Jamás había visto un cóndor tan cerca.", "Jamás", "tan", "cerca"), s("Probablemente vengan hoy.", "Probablemente", "hoy"),
  s("Allí siempre venden picarones.", "Allí", "siempre"), s("Casi nunca llueve aquí.", "Casi", "nunca", "aquí"), s("Habló pausadamente y bien.", "pausadamente", "bien"),
  s("Aún no responde el mensaje.", "Aún", "no"), s("Luego subimos lentamente.", "Luego", "lentamente"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("La banda tocó ___ toda la noche.", "alegremente", "alegre", "alegría"), f("Fue una fiesta ___.", "alegre", "alegremente", "alegría"),
  f("El juez actuó ___.", "imparcialmente", "imparcial", "imparcialidad"), f("Es un juez ___.", "imparcial", "imparcialmente", "imparcialidad"),
  f("La niña leyó el poema ___.", "expresivamente", "expresiva", "expresión"), f("Tiene una mirada ___.", "expresiva", "expresivamente", "expresión"),
  f("Juegas muy ___.", "bien", "bueno", "buena"), f("Es un ___ jugador.", "buen", "bien", "bueno que"),
];
const AA = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ...["Es un examen DIFÍCIL.", "Tiene MUCHA paciencia.", "Es un tren LENTO.", "Lleva una vida SANA.", "Es una voz CLARA.", "Tiene MEDIA hora libre."].map((x) => AA(x, 0)),
  ...["Lo explicó DIFÍCIL, nadie entendió.", "Trabaja MUCHO.", "Avanza LENTO.", "Respira HONDO.", "Habla CLARO.", "Está MEDIO cansada."].map((x) => AA(x, 1)),
];
const COMP_SUP_ADJ: ChoiceItem[] = [
  f("El Amazonas es ___ caudaloso que el Rímac.", "más", "muy", "el más"), f("El Colca es uno de los cañones ___ profundos del mundo.", "más", "muy", "tan"),
  f("Este invierno fue ___ frío como el anterior.", "tan", "más", "el más"), f("La ruta de la costa es ___ peligrosa que la de la sierra.", "menos", "tan", "poco"),
  f("El agua del Titicaca estaba ___.", "friísima", "friosísima", "más fría que"), f("De todos los platos, el cebiche es ___ famoso.", "el más", "más", "tan"),
  f("Fue un examen ___: duró cuatro horas.", "larguísimo", "largísimo", "más largo que"), f("Su argumento es ___ sólido que el mío.", "más", "el más", "muy"),
];
const GOOD_BAD: ChoiceItem[] = [
  f("Tu ensayo es ___ que el mío.", "mejor", "más bueno", "bien"), f("Fue la ___ sequía en cincuenta años.", "peor", "más mala", "más peor"),
  f("De todos los cantantes, ella es la ___.", "mejor", "más mejor", "buena"), f("La atención del hospital fue ___.", "pésima", "peorísima", "más peor"),
  f("Las condiciones para sembrar son ___ este año.", "óptimas", "mejorísimas", "más mejores"), f("El tráfico está ___ que nunca.", "peor", "más peor", "mal"),
  f("Es un ___ comienzo.", "buen", "bueno", "bien"), f("Tuvo un ___ presentimiento.", "mal", "malo", "malamente"),
];
const COMP_SUP_ADV: ChoiceItem[] = [
  f("Terminó ___ rápido que todos.", "más", "muy", "tan"), f("Habla tan pausadamente ___ su abuelo.", "como", "que", "de"),
  f("De todos, ella es quien escribe ___ claramente.", "más", "muy", "tan"), f("El pueblo queda ___.", "lejísimos", "lejosísimo", "más lejos que"),
  f("Ahora responde ___ cuidadosamente que antes.", "más", "muy", "tanto"), f("Lo terminó lo ___ pronto posible.", "más", "muy", "tan"),
  f("Hoy salió ___ tarde que ayer.", "menos", "tan", "poco"), f("Llegó ___: a las cinco de la mañana.", "tempranísimo", "tempranoísimo", "más temprano que"),
];
const WELL_BADLY: ChoiceItem[] = [
  f("Hoy tocaste el cajón ___ que nunca.", "mejor", "más bien", "bueno"), f("El equipo jugó ___ que la semana pasada.", "peor", "más mal", "malo"),
  f("Es quien ___ redacta del salón.", "mejor", "más bien", "buen"), f("Lo hiciste muy ___.", "bien", "bueno", "buen"),
  f("Durmió ___ por el ruido.", "mal", "malo", "mala"), f("De todos, fue quien ___ actuó en la obra.", "peor", "más mal", "pésimo"),
  f("Cuanto más lee, ___ escribe.", "mejor", "más bueno", "bien"), f("Baila tan ___ como su hermana.", "bien", "buena", "mejor"),
];

// --- PP. Preposiciones ---------------------------------------------------------

const PREP = "¿Cuál es la frase con preposición de la oración?";
const PREP_PHRASE: ChoiceItem[] = [
  pt(PREP, "Los cóndores volaban sobre el cañón.", "sobre el cañón", "Los cóndores volaban", "volaban"), pt(PREP, "Mi tío trabaja en Chimbote.", "en Chimbote", "Mi tío trabaja", "trabaja"),
  pt(PREP, "La niña caminó hacia la plaza.", "hacia la plaza", "La niña caminó", "caminó"), pt(PREP, "Preparé un pastel para mi abuela.", "para mi abuela", "Preparé un pastel", "un pastel"),
  pt(PREP, "Llegamos antes de la lluvia.", "antes de la lluvia", "Llegamos", "la lluvia"), pt(PREP, "La señora del sombrero vende quesos.", "del sombrero", "La señora", "vende quesos"),
  pt(PREP, "Los turistas vinieron desde Cusco.", "desde Cusco", "Los turistas vinieron", "vinieron"), pt(PREP, "El gato se escondió bajo la cama.", "bajo la cama", "El gato se escondió", "se escondió"),
];

// --- QQ. Objeto directo e indirecto --------------------------------------------

const OD = sorter(["Objeto directo", "Objeto indirecto"], "La parte en MAYÚSCULAS, ¿es objeto directo u objeto indirecto?");
const OBJECTS: ChoiceItem[] = [
  ...["La artesana talló UN RETABLO.", "Los alumnos saludaron A LA DIRECTORA.", "Compré UNA CHOMPA DE ALPACA.", "El jurado premió A LOS GANADORES.", "Escribí UNA CARTA."].map((x) => OD(x, 0)),
  ...["La artesana le regaló un retablo A SU NIETA.", "Le entregamos el informe AL ALCALDE.", "Les compré chompas A MIS SOBRINOS.", "El jurado les dio diplomas A LOS GANADORES.", "Le escribí una carta A MI ABUELO."].map((x) => OD(x, 1)),
];

// --- RR. Conjunciones -----------------------------------------------------------

const CORRELATIVE_PAIR: ChoiceItem[] = [
  f("___ la sierra ___ la selva sufrieron las heladas.", "Tanto… como", "Ni… o", "No solo… sino también"), f("___ los jóvenes ___ los adultos participaron.", "Tanto… como", "O… o", "Ni… o"),
  f("No trajo ___ el cuaderno ___ el libro.", "ni… ni", "o… o", "no solo… sino también"), f("___ canta, ___ también compone sus canciones.", "No solo… sino que", "Ni… ni", "O… o"),
  f("___ estudias ahora ___ te quedas sin salir.", "O… o", "Tanto… como", "No solo… sino también"), f("Le gustan ___ el vals ___ el festejo.", "tanto… como", "ni… ni", "o… sino"),
  f("___ quiso hablar ___ quiso comer.", "Ni… ni", "Tanto… como", "No solo… sino"), f("Visitamos ___ Puno, ___ también el lago.", "no solo… sino", "ni… ni", "o… o"),
];

// --- SS. Modificadores mal colocados ---------------------------------------------

const PIC = "¿Qué oración describe correctamente el dibujo?";
const MISPLACED_PICS: ChoiceItem[] = [
  { pic: "👨‍🌾🦙🎒", p: PIC, a: "El pastor con una mochila guiaba a la llama.", d: ["El pastor guiaba a la llama con una mochila.", "Con una mochila, la llama guiaba al pastor."] },
  { pic: "👩‍🍳🥘🥄", p: PIC, a: "La cocinera, con una cuchara de palo, movía la olla.", d: ["La cocinera movía la olla con una cuchara de palo en la cabeza.", "La olla con una cuchara movía a la cocinera."] },
  { pic: "🛏️🧒📚", p: PIC, a: "Se vende cama de madera para niño.", d: ["Se vende cama para niño de madera.", "Se vende niño de madera para cama."] },
  { pic: "👵🐕☂️", p: PIC, a: "La abuela, con su paraguas, paseaba al perro.", d: ["La abuela paseaba al perro con su paraguas puesto.", "Con su paraguas, el perro paseaba a la abuela."] },
  { pic: "🧑‍🎓📜🏫", p: PIC, a: "El joven recibió en el colegio el diploma enmarcado.", d: ["El joven enmarcado recibió el diploma en el colegio.", "Enmarcado, el joven recibió el diploma."] },
  { pic: "🐟🎣👦", p: PIC, a: "El niño pescó un pez con una caña nueva.", d: ["Con una caña nueva, el pez pescó al niño.", "El niño pescó un pez con caña nueva de colores en la boca."] },
];
const DANGLING = "¿Qué oración tiene un modificador mal colocado o un gerundio mal usado?";
const SELECT_MISPLACED: ChoiceItem[] = [
  w(DANGLING, "Bajando del bus, el celular se me perdió.", "Al bajar del bus, perdí el celular.", "Perdí el celular cuando bajaba del bus."), w(DANGLING, "Se vende mesa para cocina de madera.", "Se vende mesa de madera para cocina.", "Se vende una mesa de madera para la cocina."),
  w(DANGLING, "El ladrón huyó, siendo detenido horas después.", "El ladrón huyó y fue detenido horas después.", "El ladrón huyó; horas después lo detuvieron."), w(DANGLING, "Busco un abrigo para niña de lana.", "Busco un abrigo de lana para niña.", "Busco un abrigo de lana para mi hija."),
  w(DANGLING, "Estudiando toda la noche, el examen me pareció fácil.", "Como estudié toda la noche, el examen me pareció fácil.", "El examen me pareció fácil porque estudié toda la noche."), w(DANGLING, "Decreto estableciendo nuevas tarifas.", "Decreto que establece nuevas tarifas", "Decreto de nuevas tarifas"),
  w(DANGLING, "Siendo pequeña, mi madre me llevaba al mercado.", "Cuando era pequeña, mi madre me llevaba al mercado.", "Mi madre me llevaba al mercado cuando yo era pequeña."), w(DANGLING, "Leí que murió el poeta en el periódico.", "Leí en el periódico que murió el poeta.", "En el periódico leí que el poeta murió."),
];
const MC = sorter(["Correcto", "Incorrecto"], "¿El modificador está bien usado?");
const MODIFIERS_OK: ChoiceItem[] = [
  ...["Compré un retablo de Ayacucho para mi profesora.", "Al terminar el examen, entregué la hoja.", "El chico que vive al frente toca la guitarra.", "Se vende refrigeradora usada en buen estado.", "Mientras caminaba por el parque, vi un colibrí."].map((x) => MC(x, 0)),
  ...["Se vende refrigeradora para familia usada.", "Caminando por el parque, un colibrí me sorprendió.", "Compré un retablo para mi profesora de Ayacucho.", "Terminando el examen, la hoja fue entregada.", "Se necesita profesor para niños de matemáticas."].map((x) => MC(x, 1)),
];

// --- TT. Explicativas y especificativas -----------------------------------------

const MEANING = "¿Qué sugiere la puntuación?";
const PUNCT_MEANING: ChoiceItem[] = [
  pt(MEANING, "«Los turistas, que tenían soroche, descansaron».", "Todos los turistas tenían soroche y todos descansaron.", "Solo descansaron los turistas que tenían soroche.", "Nadie descansó."),
  pt(MEANING, "«Los turistas que tenían soroche descansaron».", "Solo descansaron los turistas que tenían soroche.", "Todos los turistas tenían soroche y todos descansaron.", "Nadie tenía soroche."),
  pt(MEANING, "«Mi prima, que estudia en Arequipa, ganó una beca».", "Tengo una sola prima, y estudia en Arequipa.", "Tengo varias primas; la de Arequipa ganó la beca.", "No tengo primas."),
  pt(MEANING, "«Mi prima que estudia en Arequipa ganó una beca».", "Tengo varias primas; la de Arequipa ganó la beca.", "Tengo una sola prima, y estudia en Arequipa.", "Mi prima no estudia."),
  pt(MEANING, "«Los árboles, que estaban secos, se talaron».", "Todos los árboles estaban secos y se talaron.", "Solo se talaron los árboles secos.", "No se taló ninguno."),
  pt(MEANING, "«Los árboles que estaban secos se talaron».", "Solo se talaron los árboles secos.", "Todos los árboles estaban secos y se talaron.", "No había árboles."),
];
const COMMA = "¿Qué oración tiene bien puestas las comas?";
const NONRESTRICTIVE: ChoiceItem[] = [
  w(COMMA, "El Huascarán, que es la montaña más alta del Perú, está en Áncash.", "El Huascarán que es la montaña más alta del Perú, está en Áncash.", "El Huascarán, que es la montaña más alta del Perú está, en Áncash."), w(COMMA, "Mi abuelo, que fue minero, vive en Cerro de Pasco.", "Mi abuelo que fue minero, vive en Cerro de Pasco.", "Mi abuelo, que fue minero vive en Cerro de Pasco."),
  w(COMMA, "Ciro Alegría, autor de «El mundo es ancho y ajeno», nació en Huamachuco.", "Ciro Alegría autor de «El mundo es ancho y ajeno», nació en Huamachuco.", "Ciro Alegría, autor de «El mundo es ancho y ajeno» nació en Huamachuco."), w(COMMA, "El río Rímac, que abastece a Lima, está contaminado.", "El río Rímac que abastece a Lima, está contaminado.", "El río Rímac, que abastece a Lima está contaminado."),
  w(COMMA, "Los alumnos que llegaron tarde no entraron.", "Los alumnos, que llegaron tarde no entraron.", "Los alumnos que llegaron tarde, no entraron."), w(COMMA, "La novela que me recomendaste es buenísima.", "La novela, que me recomendaste es buenísima.", "La novela que me recomendaste, es buenísima."),
];

// --- UU. Comas -------------------------------------------------------------------

const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "Llevamos carpas, linternas, agua y abrigo.", "Llevamos carpas linternas agua y abrigo.", "Llevamos, carpas, linternas, agua, y abrigo."), w(COMMA, "Recorrimos Tacna, Moquegua y Arequipa.", "Recorrimos Tacna Moquegua y Arequipa.", "Recorrimos, Tacna, Moquegua, y Arequipa."),
  w("¿Qué fecha de carta está bien escrita?", "Cusco, 24 de junio de 2027", "Cusco 24 de junio, de 2027", "Cusco, 24, de junio de 2027"), w(COMMA, "Nació en Huamachuco, La Libertad.", "Nació en Huamachuco La Libertad.", "Nació, en Huamachuco La Libertad."),
  w(COMMA, "Investigó, escribió, revisó y publicó.", "Investigó escribió revisó y publicó.", "Investigó, escribió, revisó, y, publicó."), w(COMMA, "El festival será en Puno, Perú, en febrero.", "El festival será en Puno Perú, en febrero.", "El festival será en, Puno Perú en febrero."),
];
const COMMA_COMPOUND: ChoiceItem[] = [
  w(COMMA, "Quería participar, pero no tenía permiso.", "Quería participar pero, no tenía permiso.", "Quería, participar pero no tenía permiso."), w(COMMA, "Si llueve esta tarde, suspenderemos el partido.", "Si llueve esta tarde suspenderemos, el partido.", "Si llueve, esta tarde suspenderemos, el partido."),
  w(COMMA, "Cuando terminó la ceremonia, todos aplaudieron.", "Cuando terminó, la ceremonia todos aplaudieron.", "Cuando terminó la ceremonia todos, aplaudieron."), w(COMMA, "Practicó mucho, así que ganó.", "Practicó mucho así, que ganó.", "Practicó, mucho así que ganó."),
  w(COMMA, "Aunque tenía miedo, subió al escenario.", "Aunque tenía, miedo subió al escenario.", "Aunque tenía miedo subió, al escenario."), w(COMMA, "No es cusqueño, sino puneño.", "No es cusqueño sino, puneño.", "No es, cusqueño sino puneño."),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Pedro, cierra la ventana.", "Pedro cierra, la ventana.", "Pedro cierra la ventana."), w(COMMA, "No obstante, aceptó la propuesta.", "No obstante aceptó, la propuesta.", "No, obstante aceptó la propuesta."),
  w(COMMA, "¡Uf, qué calor hace!", "¡Uf qué, calor hace!", "¡Uf qué calor, hace!"), w(COMMA, "La reunión, según el director, será breve.", "La reunión según, el director será breve.", "La reunión según el director, será breve."),
  w(COMMA, "Bien, comencemos el debate.", "Bien comencemos, el debate.", "Bien comencemos el debate,"), w(COMMA, "Gracias, señora alcaldesa, por su visita.", "Gracias señora alcaldesa, por su visita.", "Gracias, señora alcaldesa por su visita."),
  w(COMMA, "Por cierto, ¿leíste el libro?", "Por cierto ¿leíste, el libro?", "Por, cierto ¿leíste el libro?"), w(COMMA, "Mi abuela, sin duda, cocina mejor que nadie.", "Mi abuela sin duda, cocina mejor que nadie.", "Mi abuela, sin duda cocina mejor que nadie."),
];
const COMMA_ADJ: ChoiceItem[] = [
  w(COMMA, "Era un desierto árido, inmenso, silencioso.", "Era un desierto árido inmenso silencioso.", "Era un desierto, árido, inmenso, silencioso."), w(COMMA, "Tiene una risa franca, contagiosa, sonora.", "Tiene una risa franca contagiosa sonora.", "Tiene, una risa franca, contagiosa, sonora."),
  w(COMMA, "Compró un poncho grueso, colorido y abrigador.", "Compró un poncho grueso colorido, y abrigador.", "Compró, un poncho grueso, colorido y abrigador."), w(COMMA, "Es un camino estrecho, empinado y resbaloso.", "Es un camino estrecho empinado, y resbaloso.", "Es un camino, estrecho, empinado y resbaloso."),
  w("¿En qué oración NO van comas entre los adjetivos?", "Leyó una gran novela peruana.", "Leyó una novela larga, densa, conmovedora.", "Leyó un libro breve, claro, útil."), w("¿En qué oración NO van comas entre los adjetivos?", "Vive en una antigua casa colonial.", "Vive en una casa vieja, oscura, húmeda.", "Vive en un cuarto frío, estrecho, sucio."),
];

// --- VV. Punto y coma, dos puntos y comas --------------------------------------------

const PUNCT = "¿Qué oración está bien puntuada?";
const SEMICOLON_CLAUSES: ChoiceItem[] = [
  w(PUNCT, "Entrenó todo el año; sin embargo, perdió la final.", "Entrenó todo el año, sin embargo perdió la final.", "Entrenó todo el año sin embargo; perdió la final."), w(PUNCT, "La costa es seca; la selva, húmeda.", "La costa es seca, la selva; húmeda.", "La costa es seca la selva, húmeda."),
  w(PUNCT, "Hubo huaicos; por lo tanto, se cerró la carretera.", "Hubo huaicos, por lo tanto se cerró la carretera.", "Hubo huaicos por lo tanto; se cerró la carretera."), w(PUNCT, "Unos leían; otros, dibujaban.", "Unos leían, otros; dibujaban.", "Unos; leían otros dibujaban."),
  w(PUNCT, "Se fue la luz; encendimos velas.", "Se fue la luz, encendimos velas.", "Se fue; la luz encendimos velas."), w(PUNCT, "Rosa prefiere la poesía; su hermano, la novela.", "Rosa prefiere la poesía, su hermano; la novela.", "Rosa prefiere; la poesía su hermano la novela."),
];
const SEMICOLON_LISTS: ChoiceItem[] = [
  w(PUNCT, "Necesitamos tres cosas: agua, comida y medicinas.", "Necesitamos tres cosas, agua, comida y medicinas.", "Necesitamos: tres cosas agua, comida y medicinas."), w(PUNCT, "Viajamos a Trujillo, la ciudad de la marinera; Chiclayo, la de los museos; y Piura, la del calor.", "Viajamos a Trujillo, la ciudad de la marinera, Chiclayo, la de los museos, y Piura, la del calor.", "Viajamos a: Trujillo la ciudad de la marinera; Chiclayo la de los museos y Piura la del calor."),
  w(PUNCT, "Hubo tres finalistas: Ana, de Ica; Luis, de Tacna; y Rosa, de Puno.", "Hubo tres finalistas: Ana, de Ica, Luis, de Tacna, y Rosa, de Puno.", "Hubo tres finalistas; Ana de Ica, Luis de Tacna y Rosa de Puno."), w(PUNCT, "Trae lo siguiente: cuaderno, regla y colores.", "Trae lo siguiente cuaderno, regla y colores.", "Trae: lo siguiente; cuaderno, regla y colores."),
  w(PUNCT, "El Perú tiene tres regiones naturales: costa, sierra y selva.", "El Perú tiene tres regiones naturales; costa, sierra y selva.", "El Perú tiene: tres regiones naturales, costa, sierra, y selva."), w("¿Qué oración NO debe llevar dos puntos?", "Los ganadores son Ana y Luis.", "Hubo dos ganadores: Ana y Luis.", "Lo dijo claramente: no vendrá."),
];

// --- WW. Raya, guion y puntos suspensivos ----------------------------------------------

const DASHES: ChoiceItem[] = [
  w("¿Qué oración usa bien la raya?", "El Misti —volcán activo— vigila Arequipa.", "El Misti -volcán activo vigila Arequipa.", "El Misti — volcán activo, vigila Arequipa."), w("¿Qué diálogo está bien escrito?", "—¿Ya terminaste? —preguntó la profesora.", "-¿Ya terminaste? -preguntó la profesora.", "¿Ya terminaste? — preguntó la profesora —"),
  w("¿Qué oración usa bien la raya?", "Todos vinieron —hasta el abuelo— a la fiesta.", "Todos vinieron —hasta el abuelo a la fiesta.", "Todos vinieron, —hasta el abuelo—, a la fiesta,"), w("¿Qué diálogo está bien escrito?", "—Ahora no —respondió Ana—; más tarde.", "—Ahora no, respondió Ana, más tarde.", "-Ahora no -respondió Ana-, más tarde-"),
  w("¿Para qué sirve la raya en «Grau —el Caballero de los Mares— murió en Angamos»?", "Para encerrar una aclaración", "Para unir palabras compuestas", "Para indicar una resta"), w("¿Qué diálogo está bien escrito?", "—Ya voy —dijo Luis.", "—Ya voy —dijo Luis—.", "—Ya voy— dijo Luis."),
];
const HYPHENS: ChoiceItem[] = [
  w("¿Qué está bien escrito?", "una crisis político-económica", "una crisis político económica", "una crisis políticoeconómica"), w("¿Qué está bien escrito?", "el límite peruano-boliviano", "el límite peruano boliviano", "el límite peruanoboliviano"),
  w("¿Qué está bien escrito?", "un enfoque teórico-metodológico", "un enfoque teórico metodológico", "un enfoque teóricometodológico"), w("¿Qué está bien escrito?", "un tratado chileno-peruano", "un tratado chileno peruano", "un tratado chilenoperuano"),
  w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "la cultura afroperuana", "la cultura afro-peruana", "la cultura afro peruana"), w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "un país latinoamericano", "un país latino-americano", "un país latino americano"),
  w("¿Qué está bien escrito?", "un partido Perú-Brasil", "un partido Perú Brasil", "un partido PerúBrasil"), w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "un problema socioeconómico", "un problema socio-económico", "un problema socio económico"),
];
const ELLIPSIS: ChoiceItem[] = [
  w("¿En qué oración los puntos suspensivos están bien usados?", "Abrí el sobre y… estaba vacío.", "Abrí… el… sobre…", "Abrí… el sobre… y… estaba… vacío… del todo."), w("¿En qué oración los puntos suspensivos están bien usados?", "Vendían papas, ocas, mashuas…", "Vendían papas, ocas, mashuas, etc…", "Vendían… papas."),
  w("¿En qué oración los puntos suspensivos están bien usados?", "Iba a decirte que… no importa.", "Iba… a decirte.", "Iba… a… decirte… que… no… importa… nada."), w("¿En qué oración los puntos suspensivos están bien usados?", "«A buen entendedor…», dijo mi abuelo.", "«A buen entendedor pocas palabras…….».", "«A… buen… entendedor», dijo… mi abuelo."),
  w("¿Qué indican los puntos suspensivos en «Si supieras lo que vi…»?", "Que algo queda sin decir", "Que la oración es una pregunta", "Que termina el capítulo"), w("¿Qué indica «[…]» en una cita?", "Que se omitió parte del texto citado", "Que el autor dudaba al escribir", "Que la cita es inventada"),
];

// --- XX. Mayúsculas --------------------------------------------------------------

const CAPS = "¿Qué oración está bien escrita?";
const CAPS_ERRORS: ChoiceItem[] = [
  w(CAPS, "El jueves 8 de octubre recordamos el combate de Angamos.", "El Jueves 8 de Octubre recordamos el Combate de Angamos.", "el jueves 8 de octubre recordamos el combate de angamos."), w(CAPS, "Mi profesor de quechua es puneño.", "Mi profesor de Quechua es Puneño.", "Mi Profesor de quechua es puneño."),
  w(CAPS, "Navegamos por el río Amazonas desde Iquitos.", "Navegamos por el Río amazonas desde iquitos.", "navegamos por el río amazonas desde Iquitos."), w(CAPS, "La ministra de Educación visitó Ayacucho.", "La Ministra de educación visitó ayacucho.", "La ministra de educación visitó ayacucho."),
  w(CAPS, "En verano leímos «El mundo es ancho y ajeno».", "En Verano leímos «El Mundo Es Ancho y Ajeno».", "en verano leímos «el mundo es ancho y ajeno»."), w(CAPS, "El Museo de Arte de Lima está en el Parque de la Exposición.", "El museo de arte de Lima está en el parque de la exposición.", "El Museo de arte de lima está en el Parque de la exposición."),
  w(CAPS, "Los chimú adoraban a la Luna.", "Los Chimú adoraban a la luna.", "los chimú adoraban a la Luna."), w(CAPS, "El lago Titicaca es compartido por el Perú y Bolivia.", "El Lago titicaca es compartido por el perú y bolivia.", "el lago Titicaca es compartido por el Perú y Bolivia."),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título está bien escrito?", "Los ríos profundos", "Los Ríos Profundos", "los ríos profundos"), w("¿Qué título está bien escrito?", "El mundo es ancho y ajeno", "El Mundo es Ancho y Ajeno", "el mundo es ancho y ajeno"),
  w("¿Qué título está bien escrito?", "La casa verde", "La Casa Verde", "la casa verde"), w("¿Qué título está bien escrito?", "Tradiciones peruanas", "Tradiciones Peruanas", "tradiciones peruanas"),
  w("¿Qué título está bien escrito?", "Comentarios reales de los incas", "Comentarios Reales de los Incas", "comentarios reales de los incas"), w("¿Qué título está bien escrito?", "Los perros hambrientos", "Los Perros Hambrientos", "los perros hambrientos"),
  w("En un título en castellano, ¿qué palabras llevan mayúscula?", "La primera y los nombres propios", "Todas las palabras importantes", "Ninguna"), w("¿Qué título está bien escrito?", "Viaje al centro de la Tierra", "Viaje al Centro de la Tierra", "viaje al centro de la tierra"),
];

// --- YY. Formato -------------------------------------------------------------------

const FORMAT_TITLES: ChoiceItem[] = [
  w("En un texto digitado, ¿cómo se escribe el título de una novela?", "En cursiva", "Entre comillas", "En negrita"), w("¿Cómo se escribe el título de un cuento dentro de un libro?", "Entre comillas", "En cursiva", "Subrayado"),
  w("¿Cómo se escribe el nombre de un diario?", "En cursiva", "Entre comillas", "Entre paréntesis"), w("¿Cómo se escribe el título de un poema?", "Entre comillas", "En cursiva", "En negrita"),
  w("¿Cómo se escribe el título de un capítulo de un libro?", "Entre comillas", "En cursiva", "En mayúsculas"), w("¿Cómo se escribe el título de una película?", "En cursiva", "Entre comillas", "En negrita"),
  w("¿Cómo se escribe el título de un artículo de una revista?", "Entre comillas", "En cursiva", "Subrayado"), w("¿Cómo se escribe el título de un álbum musical?", "En cursiva", "Entre comillas", "Entre corchetes"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí _El mundo es ancho y ajeno_ en el verano.", "Leí «El Mundo es Ancho y Ajeno» en el verano.", "Leí _El Mundo Es Ancho Y Ajeno_ en el verano."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Recitamos «Los heraldos negros», de Vallejo.", "Recitamos _Los heraldos negros_, de Vallejo.", "Recitamos «Los Heraldos Negros», de Vallejo."),
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí la noticia en _La República_.", "Leí la noticia en «la república».", "Leí la noticia en «La República»."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Bailamos «Valicha» en la actuación.", "Bailamos _Valicha_ en la actuación.", "Bailamos «valicha» en la actuación."),
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Vimos la película _La teta asustada_.", "Vimos la película «la teta asustada».", "Vimos la película _La Teta Asustada_."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí «Warma kuyay» en _Agua_, de Arguedas.", "Leí _Warma kuyay_ en «Agua», de Arguedas.", "Leí «Warma Kuyay» en _Agua_, de Arguedas."),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Av. Brasil 1550, Jesús María", "av. brasil 1550 jesús maría", "Av. brasil, 1550, jesús María"), w("¿Qué dirección está bien escrita?", "Jr. Pumacahua 230, dpto. 101, Huancayo", "jr. pumacahua 230 dpto. 101 huancayo", "Jr. pumacahua, 230 dpto. 101 Huancayo"),
  w("¿Qué dirección está bien escrita?", "Ca. San Agustín 410, Cusco", "ca. san agustín 410 cusco", "Ca. san agustín, 410 cusco"), w("¿Qué dirección está bien escrita?", "Psje. Los Olivos 18, Moquegua", "psje. los olivos 18 moquegua", "Psje. los olivos, 18, moquegua"),
  w("¿Qué dirección está bien escrita?", "A. H. Villa María, Mz. F, Lt. 7, Nuevo Chimbote", "a. h. villa maría mz. f lt. 7 nuevo chimbote", "A. H. villa María, mz. F, lt. 7 nuevo Chimbote"), w("¿Qué significa «A. H.» en una dirección?", "Asentamiento humano", "Avenida histórica", "Altura habitada"),
  w("¿Qué significa «Lt.» en una dirección?", "Lote", "Letra", "Litoral"), w("¿Qué significa «int.» en una dirección?", "Interior", "Internacional", "Intersección"),
];
const QUOTES: ChoiceItem[] = [
  w("¿Qué cita está bien escrita?", "Mi abuelo repetía: «Quien siembra vientos recoge tempestades».", "Mi abuelo repetía: Quien siembra vientos recoge tempestades.", "Mi abuelo repetía «quien siembra vientos recoge tempestades»"), w("¿Qué diálogo está bien escrito?", "—¿Dónde queda la plaza? —preguntó el turista.", "«¿Dónde queda la plaza?» preguntó el turista —", "-¿Dónde queda la plaza? Preguntó el turista."),
  w("¿Qué cita está bien escrita?", "Arguedas escribió: «No soy un aculturado».", "Arguedas escribió: no soy un aculturado.", "Arguedas escribió «No soy un aculturado»"), w("¿Qué diálogo está bien escrito?", "—Ya llegamos —anunció el chofer—. Bajen con cuidado.", "—Ya llegamos —anunció el chofer. —Bajen con cuidado.", "—Ya llegamos, anunció el chofer, bajen con cuidado."),
  w("¿Dónde va el punto en una cita entre comillas que cierra la oración?", "Después de las comillas de cierre: «…».", "Antes de las comillas de cierre: «….»", "No lleva punto, porque las comillas ya cierran la oración."), w("¿Qué comillas se usan dentro de una cita que ya está entre comillas angulares?", "Las inglesas: « … “ … ” … »", "Otra vez las angulares: « … « … » … »", "Paréntesis"),
];

export const ROWS: Row[] = [
  ["OO.1", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos de la oración.", ADJECTIVES_IN)],
  ["OO.2", "Ordenar los adjetivos: su lugar y sus formas cortas", (r) => choose(r, "", ADJ_ORDER)],
  ["OO.3", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios de la oración.", ADVERBS_IN)],
  ["OO.4", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["OO.5", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],
  ["OO.6", "Formar y usar adjetivos comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADJ)],
  ["OO.7", "Bueno, mejor, óptimo; malo, peor, pésimo", (r) => choose(r, "Completa la oración.", GOOD_BAD)],
  ["OO.8", "Formar y usar adverbios comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADV)],
  ["OO.9", "Bien, mejor; mal, peor", (r) => choose(r, "Completa la oración.", WELL_BADLY)],

  ["PP.1", "Identificar frases con preposición", (r) => choose(r, "", PREP_PHRASE)],

  ["QQ.1", "¿Es un objeto directo o un objeto indirecto?", (r) => choose(r, "", OBJECTS)],

  ["RR.1", "Usar el par correcto de conjunciones correlativas", (r) => choose(r, "Completa la oración.", CORRELATIVE_PAIR)],

  ["SS.1", "Modificadores mal colocados, con dibujos", (r) => choose(r, "", MISPLACED_PICS)],
  ["SS.2", "Elegir el modificador mal colocado o el gerundio mal usado", (r) => choose(r, "", SELECT_MISPLACED)],
  ["SS.3", "¿Los modificadores están bien usados?", (r) => choose(r, "", MODIFIERS_OK)],

  ["TT.1", "¿Qué sugiere la puntuación?", (r) => choose(r, "", PUNCT_MEANING)],
  ["TT.2", "Comas en los elementos explicativos", (r) => choose(r, "", NONRESTRICTIVE)],

  ["UU.1", "Comas en enumeraciones, fechas y lugares", (r) => choose(r, "", COMMA_SERIES)],
  ["UU.2", "Comas en oraciones compuestas", (r) => choose(r, "", COMMA_COMPOUND)],
  ["UU.3", "Comas con vocativos, palabras introductorias, interjecciones e incisos", (r) => choose(r, "", COMMA_ADDRESS)],
  ["UU.4", "Comas entre adjetivos coordinados", (r) => choose(r, "", COMMA_ADJ)],
  ["UU.5", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_COMPOUND, ...COMMA_ADDRESS, ...COMMA_ADJ])],

  ["VV.1", "Usar punto y coma y comas para separar proposiciones", (r) => choose(r, "", SEMICOLON_CLAUSES)],
  ["VV.2", "Usar punto y coma, dos puntos y comas en enumeraciones", (r) => choose(r, "", SEMICOLON_LISTS)],

  ["WW.1", "Usar la raya", (r) => choose(r, "", DASHES)],
  ["WW.2", "Usar el guion en adjetivos compuestos", (r) => choose(r, "", HYPHENS)],
  ["WW.3", "Decidir si los puntos suspensivos están bien usados", (r) => choose(r, "", ELLIPSIS)],

  ["XX.1", "Corregir errores de mayúsculas", (r) => choose(r, "", CAPS_ERRORS)],
  ["XX.2", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],

  ["YY.1", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["YY.2", "Dar formato y poner mayúsculas a los títulos: repaso", (r) => choose(r, "", TITLES_BOTH)],
  ["YY.3", "Dar formato a las direcciones", (r) => choose(r, "", ADDRESSES)],
  ["YY.4", "Dar formato a las citas y a los diálogos", (r) => choose(r, "", QUOTES)],
];
