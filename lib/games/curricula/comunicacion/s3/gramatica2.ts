import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 9th grade ELA, PP-YY), con las
// reglas del castellano (las mismas adaptaciones que en 1.° y 2.°):
//   good/better/best → bueno, mejor, óptimo; well/better/best → bien, mejor
//   correlativas → ni… ni, o… o, tanto… como, no solo… sino también
//   antithetical phrases → comas en las construcciones con «no… sino» y «… no…»
//   apostrophes → el castellano no usa apóstrofo: los errores de plural y pertenencia
//   que imitan el inglés («los 90's», «Juan's») y la pertenencia conjunta o separada
//   mayúsculas en los títulos: solo la primera palabra y los nombres propios

export const SECTIONS: Section[] = [
  { id: "PP", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "QQ", name: "Conjunciones", icon: "🔗" },
  { id: "RR", name: "Modificadores mal colocados", icon: "🧲" },
  { id: "SS", name: "Elementos explicativos y especificativos", icon: "🔍" },
  { id: "TT", name: "Comas", icon: "❗" },
  { id: "UU", name: "Punto y coma, dos puntos y comas", icon: "⏸️" },
  { id: "VV", name: "Raya, guion y puntos suspensivos", icon: "➖" },
  { id: "WW", name: "Plurales y pertenencia sin apóstrofo", icon: "🏷️" },
  { id: "XX", name: "Mayúsculas", icon: "🔠" },
  { id: "YY", name: "Formato", icon: "📝" },
];

// --- PP. Adjetivos y adverbios -----------------------------------------------

const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("El testigo declaró ___ ante la comisión.", "serenamente", "sereno", "serenidad"), f("Fue un testimonio ___.", "sereno", "serenamente", "serenidad"),
  f("El fiscal investigó ___ el caso.", "minuciosamente", "minucioso", "minuciosidad"), f("Hizo un análisis ___.", "minucioso", "minuciosamente", "minuciosidad"),
  f("El coro cantó muy ___.", "bien", "bueno", "buena"), f("Es un ___ coro.", "buen", "bien", "bueno que"),
  f("Respondió ___ a la provocación.", "tranquilamente", "tranquila", "tranquilidad"), f("Tomó una decisión ___.", "tranquila", "tranquilamente", "tranquilidad"),
];
const COMP_SUP_ADJ: ChoiceItem[] = [
  f("Esta novela es ___ compleja que la anterior.", "más", "muy", "la más"), f("Es uno de los informes ___ importantes del siglo.", "más", "muy", "tan"),
  f("Su argumento es ___ sólido como el tuyo.", "tan", "más", "el más"), f("Este camino es ___ largo que el otro.", "menos", "tan", "poco"),
  f("Fue una espera ___.", "larguísima", "largísima", "más larga que"), f("De todas las propuestas, la suya es ___ viable.", "la más", "más", "tan"),
];
const GOOD_BAD: ChoiceItem[] = [
  f("Tu segundo ensayo es ___ que el primero.", "mejor", "más bueno", "bien"), f("Fue la ___ crisis de la década.", "peor", "más mala", "más peor"),
  f("De todos los candidatos, ella es la ___.", "mejor", "más mejor", "buena"), f("Las condiciones de trabajo eran ___.", "pésimas", "peorísimas", "más peores"),
  f("Las condiciones del suelo son ___ para el cultivo.", "óptimas", "mejorísimas", "más mejores"), f("Es un ___ ejemplo de liderazgo.", "buen", "bueno", "bien"),
];
const COMP_SUP_ADV: ChoiceItem[] = [
  f("Llegó ___ temprano que todos.", "más", "muy", "tan"), f("Argumenta tan claramente ___ un abogado.", "como", "que", "de"),
  f("De todos, ella es quien escribe ___ claramente.", "más", "muy", "tan"), f("La comunidad queda ___.", "lejísimos", "lejosísimo", "más lejos que"),
  f("Respondió lo ___ rápido que pudo.", "más", "muy", "tan"), f("Hoy habló ___ pausadamente que ayer.", "menos", "tan", "poco"),
];
const WELL_BADLY: ChoiceItem[] = [
  f("Hoy expusiste ___ que nunca.", "mejor", "más bien", "bueno"), f("El equipo jugó ___ que la semana pasada.", "peor", "más mal", "malo"),
  f("Es quien ___ argumenta del salón.", "mejor", "más bien", "buen"), f("Lo resolviste muy ___.", "bien", "bueno", "buen"),
  f("Durmió ___ por los nervios.", "mal", "malo", "mala"), f("Cuanto más practica, ___ toca.", "mejor", "más bueno", "bien"),
];

// --- QQ. Conjunciones -----------------------------------------------------------

const CORRELATIVE_PAIR: ChoiceItem[] = [
  f("___ el Gobierno ___ la oposición apoyaron la ley.", "Tanto… como", "Ni… o", "No solo… sino también"), f("No firmaron ___ los vecinos ___ el alcalde.", "ni… ni", "o… o", "no solo… sino también"),
  f("___ denuncia la violencia, ___ también propone salidas.", "No solo… sino que", "Ni… ni", "O… o"), f("___ cumplen la ley ___ serán sancionados.", "O… o", "Tanto… como", "No solo… sino también"),
  f("Le interesan ___ la historia ___ la literatura.", "tanto… como", "ni… ni", "o… sino"), f("___ habló ___ dejó hablar.", "Ni… ni", "Tanto… como", "No solo… sino"),
];

// --- RR. Modificadores mal colocados ---------------------------------------------

const PIC = "¿Qué oración describe correctamente el dibujo?";
const MISPLACED_PICS: ChoiceItem[] = [
  { pic: "👮‍♂️🐕🦺", p: PIC, a: "El policía paseaba al perro, que llevaba un chaleco.", d: ["El policía paseaba al perro con chaleco puesto en la cabeza.", "Con chaleco, el perro paseaba al policía."] },
  { pic: "👩‍🏫📗🧒", p: PIC, a: "La profesora le dio al niño un libro de tapas verdes.", d: ["La profesora de tapas verdes le dio un libro al niño.", "De tapas verdes, el niño le dio un libro a la profesora."] },
  { pic: "🪑👴🌳", p: PIC, a: "Se vende silla de madera para anciano.", d: ["Se vende silla para anciano de madera.", "Se vende anciano de madera para silla."] },
  { pic: "👧🎈🐶", p: PIC, a: "La niña con un globo jugaba con el perro.", d: ["La niña jugaba con el perro con un globo en el hocico.", "Con un globo, el perro jugaba con la niña."] },
  { pic: "🧑‍🌾🥔🧺", p: PIC, a: "El agricultor guardó en una canasta las papas recién cosechadas.", d: ["El agricultor recién cosechado guardó las papas en una canasta.", "Recién cosechado, el agricultor guardó las papas."] },
];
const DANGLING = "¿Qué oración tiene un modificador mal colocado o un gerundio mal usado?";
const SELECT_MISPLACED: ChoiceItem[] = [
  w(DANGLING, "Entrando al aula, la pizarra estaba llena de dibujos.", "Al entrar al aula, vi la pizarra llena de dibujos.", "La pizarra estaba llena de dibujos cuando entré al aula."), w(DANGLING, "Se busca secretaria para oficina con experiencia.", "Se busca secretaria con experiencia para oficina.", "Se busca una secretaria con experiencia para la oficina."),
  w(DANGLING, "El detenido fugó, siendo recapturado al día siguiente.", "El detenido fugó y fue recapturado al día siguiente.", "El detenido fugó; al día siguiente lo recapturaron."), w(DANGLING, "Ley regulando el uso del agua.", "Ley que regula el uso del agua", "Ley de regulación del uso del agua"),
  w(DANGLING, "Siendo niño, mi abuelo me enseñó a pescar.", "Cuando era niño, mi abuelo me enseñó a pescar.", "Mi abuelo me enseñó a pescar cuando yo era niño."), w(DANGLING, "Vendo abrigo para dama de piel sintética.", "Vendo abrigo de piel sintética para dama.", "Vendo un abrigo de piel sintética para dama."),
];
const MC = sorter(["Correcto", "Incorrecto"], "¿El modificador está bien usado?");
const MODIFIERS_OK: ChoiceItem[] = [
  ...["Al terminar el examen, entregué la hoja.", "Compré un poncho de alpaca para mi padre.", "La alumna que ganó el concurso es de Puno.", "Mientras leía el informe, tomé notas."].map((x) => MC(x, 0)),
  ...["Terminando el examen, la hoja fue entregada.", "Compré un poncho para mi padre de alpaca.", "Leyendo el informe, las notas se tomaron.", "Se vende casa para familia con jardín."].map((x) => MC(x, 1)),
];

// --- SS. Explicativas y especificativas -----------------------------------------

const MEANING = "¿Qué sugiere la puntuación?";
const PUNCT_MEANING: ChoiceItem[] = [
  pt(MEANING, "«Los cadetes, que conocían la verdad, callaron».", "Todos los cadetes conocían la verdad y todos callaron.", "Solo callaron los cadetes que conocían la verdad.", "Nadie calló."),
  pt(MEANING, "«Los cadetes que conocían la verdad callaron».", "Solo callaron los cadetes que conocían la verdad.", "Todos los cadetes conocían la verdad y todos callaron.", "Nadie sabía."),
  pt(MEANING, "«Mi hermano, que vive en Tacna, es médico».", "Tengo un solo hermano, y vive en Tacna.", "Tengo varios hermanos; el de Tacna es médico.", "No tengo hermanos."),
  pt(MEANING, "«Mi hermano que vive en Tacna es médico».", "Tengo varios hermanos; el de Tacna es médico.", "Tengo un solo hermano, y vive en Tacna.", "No es médico."),
  pt(MEANING, "«Los testigos, que hablaban quechua, declararon con intérprete».", "Todos los testigos hablaban quechua.", "Solo algunos testigos hablaban quechua.", "Nadie declaró."),
  pt(MEANING, "«Los testigos que hablaban quechua declararon con intérprete».", "Solo los testigos quechuahablantes usaron intérprete.", "Todos los testigos hablaban quechua.", "Nadie usó intérprete."),
];
const COMMA = "¿Qué oración tiene bien puestas las comas?";
const NONRESTRICTIVE: ChoiceItem[] = [
  w(COMMA, "Vargas Llosa, que nació en Arequipa, ganó el Nobel.", "Vargas Llosa que nació en Arequipa, ganó el Nobel.", "Vargas Llosa, que nació en Arequipa ganó el Nobel."), w(COMMA, "El LUM, que está en Miraflores, guarda testimonios.", "El LUM que está en Miraflores, guarda testimonios.", "El LUM, que está en Miraflores guarda testimonios."),
  w(COMMA, "Los alumnos que no entregaron el trabajo desaprobaron.", "Los alumnos, que no entregaron el trabajo desaprobaron.", "Los alumnos que no entregaron el trabajo, desaprobaron."), w(COMMA, "La novela que me prestaste es excelente.", "La novela, que me prestaste es excelente.", "La novela que me prestaste, es excelente."),
  w(COMMA, "Mariátegui, fundador de «Amauta», murió en 1930.", "Mariátegui fundador de «Amauta», murió en 1930.", "Mariátegui, fundador de «Amauta» murió en 1930."), w(COMMA, "El Titicaca, que comparten dos países, es navegable.", "El Titicaca que comparten dos países, es navegable.", "El Titicaca, que comparten dos países es navegable."),
];

// --- TT. Comas -------------------------------------------------------------------

const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Señora fiscal, le presento las pruebas.", "Señora fiscal le presento, las pruebas.", "Señora, fiscal le presento las pruebas."), w(COMMA, "Sin embargo, el caso se cerró.", "Sin embargo el caso, se cerró.", "Sin, embargo el caso se cerró."),
  w(COMMA, "¡Ay, qué injusticia!", "¡Ay qué, injusticia!", "¡Ay qué injusticia,!"), w(COMMA, "El informe, según los expertos, es riguroso.", "El informe según, los expertos es riguroso.", "El informe según los expertos, es riguroso."),
  w(COMMA, "No es miedo, sino prudencia.", "No es miedo sino, prudencia.", "No es, miedo sino prudencia."), w(COMMA, "Queremos justicia, no venganza.", "Queremos justicia no, venganza.", "Queremos, justicia no venganza."),
  w(COMMA, "Bueno, empecemos el debate.", "Bueno empecemos, el debate.", "Bueno empecemos el debate,"), w(COMMA, "Era valiente, no temerario.", "Era valiente no, temerario.", "Era, valiente no temerario."),
];
const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "La CVR recogió testimonios, documentos, fotografías y objetos.", "La CVR recogió testimonios documentos fotografías y objetos.", "La CVR recogió, testimonios, documentos, fotografías, y objetos."), w(COMMA, "Recorrimos Huanta, Huamanga y Vilcashuamán.", "Recorrimos Huanta Huamanga y Vilcashuamán.", "Recorrimos, Huanta, Huamanga, y Vilcashuamán."),
  w("¿Qué fecha de carta está bien escrita?", "Ayacucho, 28 de agosto de 2027", "Ayacucho 28 de agosto, de 2027", "Ayacucho, 28, de agosto de 2027"), w(COMMA, "Nació en Arequipa, Perú, en 1936.", "Nació en Arequipa Perú, en 1936.", "Nació, en Arequipa Perú en 1936."),
];
const COMMA_COMPOUND: ChoiceItem[] = [
  w(COMMA, "Gamboa quería investigar, pero lo trasladaron.", "Gamboa quería investigar pero, lo trasladaron.", "Gamboa quería, investigar pero lo trasladaron."), w(COMMA, "Si el Congreso aprueba la ley, se protegerán los glaciares.", "Si el Congreso aprueba la ley se protegerán, los glaciares.", "Si el Congreso, aprueba la ley se protegerán los glaciares."),
  w(COMMA, "Cuando terminó el juicio, todos salieron en silencio.", "Cuando terminó, el juicio todos salieron en silencio.", "Cuando terminó el juicio todos, salieron en silencio."), w(COMMA, "Aunque tenía miedo, Alberto habló.", "Aunque tenía, miedo Alberto habló.", "Aunque tenía miedo Alberto, habló."),
];
const COMMA_ADJ: ChoiceItem[] = [
  w(COMMA, "Fue un juicio largo, tenso, agotador.", "Fue un juicio largo tenso agotador.", "Fue un juicio, largo, tenso, agotador."), w(COMMA, "Escribió una novela intensa, compleja y polémica.", "Escribió una novela intensa compleja, y polémica.", "Escribió, una novela intensa, compleja y polémica."),
  w("¿En qué oración NO van comas entre los adjetivos?", "Leímos una gran novela peruana.", "Leímos una novela larga, densa, conmovedora.", "Leímos un ensayo breve, claro, útil."), w("¿En qué oración NO van comas entre los adjetivos?", "Viven en una antigua casona colonial.", "Viven en una casa vieja, oscura, húmeda.", "Viven en un cuarto frío, estrecho, sucio."),
];

// --- UU. Punto y coma, dos puntos y comas --------------------------------------------

const PUNCT = "¿Qué oración está bien puntuada?";
const SEMICOLON_CLAUSES: ChoiceItem[] = [
  w(PUNCT, "Gamboa insistió; sin embargo, el caso se cerró.", "Gamboa insistió, sin embargo el caso se cerró.", "Gamboa insistió sin embargo; el caso se cerró."), w(PUNCT, "Unos hablaron; otros, callaron.", "Unos hablaron, otros; callaron.", "Unos; hablaron otros callaron."),
  w(PUNCT, "El informe era extenso; por ello, lo dividieron en tomos.", "El informe era extenso, por ello lo dividieron en tomos.", "El informe era extenso por ello; lo dividieron en tomos."), w(PUNCT, "Arguedas escribió sobre los Andes; Vargas Llosa, sobre Lima.", "Arguedas escribió sobre los Andes, Vargas Llosa; sobre Lima.", "Arguedas escribió; sobre los Andes Vargas Llosa sobre Lima."),
];
const SEMICOLON_LISTS: ChoiceItem[] = [
  w(PUNCT, "La CVR propuso tres cosas: reparaciones, justicia y reformas.", "La CVR propuso tres cosas, reparaciones, justicia y reformas.", "La CVR propuso: tres cosas reparaciones, justicia y reformas."), w(PUNCT, "Leímos a Vallejo, el poeta; a Arguedas, el novelista; y a Mariátegui, el ensayista.", "Leímos a Vallejo, el poeta, a Arguedas, el novelista, y a Mariátegui, el ensayista.", "Leímos a: Vallejo el poeta; Arguedas el novelista y Mariátegui el ensayista."),
  w(PUNCT, "Hubo tres ponentes: Ana, de Lima; Luis, de Cusco; y Rosa, de Piura.", "Hubo tres ponentes: Ana, de Lima, Luis, de Cusco, y Rosa, de Piura.", "Hubo tres ponentes; Ana de Lima, Luis de Cusco y Rosa de Piura."), w("¿Qué oración NO debe llevar dos puntos?", "Los ganadores son Ana y Luis.", "Hubo dos ganadores: Ana y Luis.", "Lo dijo claramente: no vendrá."),
];
const SEMICOLON_REVIEW: ChoiceItem[] = [...SEMICOLON_CLAUSES, ...SEMICOLON_LISTS,
  w(PUNCT, "Querida abuela: te escribo desde Lima.", "Querida abuela, te escribo desde Lima.", "Querida abuela; te escribo desde Lima."), w(PUNCT, "Ya lo dijo González Prada: «Los viejos a la tumba, los jóvenes a la obra».", "Ya lo dijo González Prada; «Los viejos a la tumba, los jóvenes a la obra».", "Ya lo dijo González Prada, «Los viejos a la tumba; los jóvenes a la obra»."),
];

// --- VV. Raya, guion y puntos suspensivos ----------------------------------------------

const DASHES: ChoiceItem[] = [
  w("¿Qué oración usa bien la raya?", "El Jaguar —líder del Círculo— era temido por todos.", "El Jaguar -líder del Círculo era temido por todos.", "El Jaguar — líder del Círculo, era temido por todos."), w("¿Qué diálogo está bien escrito?", "—¿Quién fue? —preguntó Gamboa.", "-¿Quién fue? -preguntó Gamboa.", "¿Quién fue? — preguntó Gamboa —"),
  w("¿Qué diálogo está bien escrito?", "—No lo sé —respondió Alberto—; pero lo sospecho.", "—No lo sé, respondió Alberto, pero lo sospecho.", "-No lo sé -respondió Alberto-, pero lo sospecho-"), w("¿Para qué sirve la raya en «La CVR —creada en 2001— investigó veinte años de violencia»?", "Para encerrar una aclaración", "Para unir palabras compuestas", "Para indicar una resta"),
];
const HYPHENS: ChoiceItem[] = [
  w("¿Qué está bien escrito?", "un análisis histórico-social", "un análisis histórico social", "un análisis históricosocial"), w("¿Qué está bien escrito?", "la frontera peruano-ecuatoriana", "la frontera peruano ecuatoriana", "la frontera peruanoecuatoriana"),
  w("¿Qué está bien escrito?", "un enfoque teórico-práctico", "un enfoque teórico práctico", "un enfoque teóricopráctico"), w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "una comunidad quechuahablante", "una comunidad quechua-hablante", "una comunidad quechua hablante"),
  w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "un problema sociopolítico", "un problema socio-político", "un problema socio político"), w("¿Qué está bien escrito?", "el partido Perú-Chile", "el partido Perú Chile", "el partido PerúChile"),
];
const ELLIPSIS: ChoiceItem[] = [
  w("¿En qué oración los puntos suspensivos están bien usados?", "Abrió la carta y… era de su padre.", "Abrió… la… carta…", "Abrió… la carta… y… era… de su padre… muerto."), w("¿En qué oración los puntos suspensivos están bien usados?", "Leímos a Vallejo, Arguedas, Alegría…", "Leímos a Vallejo, Arguedas, Alegría, etc…", "Leímos… a Vallejo."),
  w("¿En qué oración los puntos suspensivos están bien usados?", "«Más vale prevenir…», repetía mi madre.", "«Más vale prevenir que lamentar…….».", "«Más… vale… prevenir», repetía… mi madre."), w("¿Qué indica «[…]» en una cita?", "Que se omitió parte del texto citado", "Que el autor dudaba", "Que la cita es falsa"),
];

// --- WW. Plurales y pertenencia sin apóstrofo ------------------------------------------

const FIXIT = "¿Cómo se corrige la oración?";
const APOSTROPHE_ERRORS: ChoiceItem[] = [
  pt(FIXIT, "La música de los 90's era distinta.", "La música de los noventa era distinta.", "La música de los 90s's era distinta en todo sentido.", "La música 90."),
  pt(FIXIT, "Fuimos a comer a Juan's.", "Fuimos a comer donde Juan.", "Fuimos a comer a Juan's restaurante de la esquina.", "Fuimos."),
  pt(FIXIT, "Compramos dos DVD's.", "Compramos dos DVD.", "Compramos dos DVD's nuevos de películas peruanas.", "DVD."),
  pt(FIXIT, "Los CD's de mi padre están en la caja.", "Los CD de mi padre están en la caja.", "Los CD's de mi padre están en la caja de cartón del cuarto.", "Los discos."),
  pt(FIXIT, "Es el carro de mi tío's.", "Es el carro de mi tío.", "Es el carro de mi tío's que vive en Arequipa.", "Es el carro."),
  pt(FIXIT, "Los lápizes de las alumnas son nuevos.", "Los lápices de las alumnas son nuevos.", "Los lápizes de las alumna's son nuevos y de colores.", "Lápices."),
];
const JOINT = sorter(["Pertenencia conjunta (de los dos a la vez)", "Pertenencia separada (cada uno tiene el suyo)"], "¿Qué indica la frase en MAYÚSCULAS?");
const JOINT_POSSESSION: ChoiceItem[] = [
  ...["Leímos EL INFORME DE LERNER Y SU EQUIPO, redactado en conjunto.", "Visitamos LA CASA DE MIS ABUELOS, donde viven juntos.", "Escuchamos EL DISCO DE ROSA Y PEDRO, grabado a dúo."].map((x) => JOINT(x, 0)),
  ...["Leímos LAS NOVELAS DE ARGUEDAS Y DE ALEGRÍA.", "Visitamos LAS CASAS DE MI TÍA Y DE MI PRIMA, una en Lima y otra en Ica.", "Revisé LOS ENSAYOS DE ANA Y DE LUIS, cada uno el suyo."].map((x) => JOINT(x, 1)),
  w("Ana y Luis escribieron juntos un solo libro. ¿Qué frase es correcta?", "el libro de Ana y Luis", "los libros de Ana y de Luis", "el libro de Ana y el de Luis"), w("Rosa y Pedro tienen cada uno su propio perro. ¿Qué frase es correcta?", "los perros de Rosa y de Pedro", "el perro de Rosa y Pedro", "los perro de Rosa y Pedro"),
];

// --- XX. Mayúsculas --------------------------------------------------------------

const CAPS = "¿Qué oración está bien escrita?";
const CAPS_ERRORS: ChoiceItem[] = [
  w(CAPS, "El 28 de agosto de 2003, la Comisión de la Verdad entregó su informe.", "El 28 de Agosto de 2003, la comisión de la verdad entregó su informe.", "el 28 de agosto de 2003, la comisión de la Verdad entregó su informe."), w(CAPS, "Mi profesora de inglés es ayacuchana.", "Mi profesora de Inglés es Ayacuchana.", "Mi Profesora de inglés es ayacuchana."),
  w(CAPS, "El presidente de la República viajó a Bolivia.", "El Presidente de la república viajó a bolivia.", "El presidente de la república viajó a bolivia."), w(CAPS, "Visitamos el Lugar de la Memoria en Miraflores.", "Visitamos el lugar de la memoria en miraflores.", "Visitamos el Lugar de la memoria en Miraflores."),
  w(CAPS, "En otoño leímos «La ciudad y los perros».", "En Otoño leímos «La Ciudad y los Perros».", "en otoño leímos «la ciudad y los perros»."), w(CAPS, "La Segunda Guerra Mundial terminó en 1945.", "La segunda guerra mundial terminó en 1945.", "La Segunda guerra Mundial terminó en 1945."),
  w(CAPS, "Estudia en la Universidad Nacional Mayor de San Marcos.", "Estudia en la universidad nacional mayor de San Marcos.", "Estudia en la Universidad nacional Mayor de san Marcos."), w(CAPS, "El río Mantaro cruza el valle.", "El Río Mantaro cruza el valle.", "El río mantaro cruza el valle."),
];

// --- YY. Formato -------------------------------------------------------------------

const QUOTES: ChoiceItem[] = [
  w("¿Qué cita está bien escrita?", "González Prada exclamó: «¡Los viejos a la tumba, los jóvenes a la obra!».", "González Prada exclamó: ¡Los viejos a la tumba, los jóvenes a la obra!", "González Prada exclamó «¡los viejos a la tumba, los jóvenes a la obra!»"), w("¿Qué diálogo está bien escrito?", "—¿Quién lo hizo? —preguntó el teniente.", "«¿Quién lo hizo?» preguntó el teniente —", "-¿Quién lo hizo? Preguntó el teniente."),
  w("¿Qué diálogo está bien escrito?", "—Lo vi todo —dijo Alberto—. Fue el Jaguar.", "—Lo vi todo —dijo Alberto. —Fue el Jaguar.", "—Lo vi todo, dijo Alberto, fue el Jaguar."), w("¿Dónde va el punto en una cita que cierra la oración?", "Después de las comillas de cierre: «…».", "Antes de las comillas de cierre: «….»", "No lleva punto, porque las comillas ya cierran la oración."),
  w("¿Qué comillas se usan dentro de una cita que ya está entre angulares?", "Las inglesas: « … “ … ” … »", "Otra vez las angulares: « … « … » … »", "Paréntesis"), w("¿Qué cita está bien escrita?", "Bolognesi respondió que cumpliría sus deberes «hasta quemar el último cartucho».", "Bolognesi respondió que cumpliría sus deberes hasta quemar el último cartucho».", "Bolognesi respondió que cumpliría sus deberes, «Hasta quemar el último cartucho»"),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título está bien escrito?", "La ciudad y los perros", "La Ciudad y los Perros", "la ciudad y los perros"), w("¿Qué título está bien escrito?", "Siete ensayos de interpretación de la realidad peruana", "Siete Ensayos de Interpretación de la Realidad Peruana", "siete ensayos de interpretación de la realidad peruana"),
  w("¿Qué título está bien escrito?", "Conversación en La Catedral", "Conversación en la catedral", "Conversación En La Catedral"), w("¿Qué título está bien escrito?", "Los heraldos negros", "Los Heraldos Negros", "los heraldos negros"),
  w("¿Qué título está bien escrito?", "Informe final de la Comisión de la Verdad y Reconciliación", "Informe Final De La Comisión De La Verdad Y Reconciliación", "informe final de la comisión de la verdad y reconciliación"), w("En un título en castellano, ¿qué palabras llevan mayúscula?", "La primera y los nombres propios", "Todas las palabras importantes", "Ninguna"),
];
const FORMAT_TITLES: ChoiceItem[] = [
  w("En un texto digitado, ¿cómo se escribe el título de una novela?", "En cursiva", "Entre comillas", "En negrita"), w("¿Cómo se escribe el título de un poema dentro de un poemario?", "Entre comillas", "En cursiva", "Subrayado"),
  w("¿Cómo se escribe el nombre de un periódico?", "En cursiva", "Entre comillas", "Entre paréntesis"), w("¿Cómo se escribe el título de un ensayo dentro de un libro?", "Entre comillas", "En cursiva", "En mayúsculas"),
  w("¿Cómo se escribe el título de una película?", "En cursiva", "Entre comillas", "En negrita"), w("¿Cómo se escribe el título de un artículo de revista?", "Entre comillas", "En cursiva", "Subrayado"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí _La ciudad y los perros_ en vacaciones.", "Leí «La Ciudad y los Perros» en vacaciones.", "Leí _La Ciudad Y Los Perros_ en vacaciones."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Analizamos «Masa», de Vallejo.", "Analizamos _Masa_, de Vallejo.", "Analizamos «masa», de Vallejo."),
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí un reportaje en _El Comercio_.", "Leí un reportaje en «el comercio».", "Leí un reportaje en «El Comercio»."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leímos «El problema del indio», de _Siete ensayos de interpretación de la realidad peruana_.", "Leímos _El problema del indio_, de «Siete ensayos…».", "Leímos «El Problema Del Indio», de _Siete Ensayos_."),
];

export const ROWS: Row[] = [
  ["PP.1", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["PP.2", "Formar y usar adjetivos comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADJ)],
  ["PP.3", "Bueno, mejor, óptimo; malo, peor, pésimo", (r) => choose(r, "Completa la oración.", GOOD_BAD)],
  ["PP.4", "Formar y usar adverbios comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADV)],
  ["PP.5", "Bien, mejor; mal, peor", (r) => choose(r, "Completa la oración.", WELL_BADLY)],

  ["QQ.1", "Usar el par correcto de conjunciones correlativas", (r) => choose(r, "Completa la oración.", CORRELATIVE_PAIR)],

  ["RR.1", "Modificadores mal colocados, con dibujos", (r) => choose(r, "", MISPLACED_PICS)],
  ["RR.2", "Elegir el modificador mal colocado o el gerundio mal usado", (r) => choose(r, "", SELECT_MISPLACED)],
  ["RR.3", "¿Los modificadores están bien usados?", (r) => choose(r, "", MODIFIERS_OK)],

  ["SS.1", "¿Qué sugiere la puntuación?", (r) => choose(r, "", PUNCT_MEANING)],
  ["SS.2", "Comas en los elementos explicativos", (r) => choose(r, "", NONRESTRICTIVE)],

  ["TT.1", "Comas con vocativos, palabras introductorias, interjecciones, incisos y contrastes («no…, sino…»)", (r) => choose(r, "", COMMA_ADDRESS)],
  ["TT.2", "Comas en enumeraciones, fechas y lugares", (r) => choose(r, "", COMMA_SERIES)],
  ["TT.3", "Comas en oraciones compuestas", (r) => choose(r, "", COMMA_COMPOUND)],
  ["TT.4", "Comas entre adjetivos coordinados", (r) => choose(r, "", COMMA_ADJ)],
  ["TT.5", "Comas: repaso", (r) => choose(r, "", [...COMMA_ADDRESS, ...COMMA_SERIES, ...COMMA_COMPOUND, ...COMMA_ADJ])],

  ["UU.1", "Usar punto y coma y comas para separar proposiciones", (r) => choose(r, "", SEMICOLON_CLAUSES)],
  ["UU.2", "Usar punto y coma, dos puntos y comas en enumeraciones", (r) => choose(r, "", SEMICOLON_LISTS)],
  ["UU.3", "Punto y coma, dos puntos y comas: repaso", (r) => choose(r, "", SEMICOLON_REVIEW)],

  ["VV.1", "Usar la raya", (r) => choose(r, "", DASHES)],
  ["VV.2", "Usar el guion en adjetivos compuestos", (r) => choose(r, "", HYPHENS)],
  ["VV.3", "Decidir si los puntos suspensivos están bien usados", (r) => choose(r, "", ELLIPSIS)],

  ["WW.1", "Identificar y corregir errores de plural y de pertenencia (sin apóstrofo)", (r) => choose(r, "", APOSTROPHE_ERRORS)],
  ["WW.2", "Identificar y corregir errores de pertenencia conjunta y separada", (r) => choose(r, "", JOINT_POSSESSION)],

  ["XX.1", "Corregir errores de mayúsculas", (r) => choose(r, "", CAPS_ERRORS)],

  ["YY.1", "Dar formato a las citas y a los diálogos", (r) => choose(r, "", QUOTES)],
  ["YY.2", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],
  ["YY.3", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["YY.4", "Dar formato y poner mayúsculas a los títulos: repaso", (r) => choose(r, "", TITLES_BOTH)],
];
