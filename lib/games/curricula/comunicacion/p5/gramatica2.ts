import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pool, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 5th grade ELA, SS-ZZ), con las
// reglas del castellano:
//   orden de los adjetivos → posición del adjetivo y formas cortas (buen, gran, primer, algún)
//   adverbios relativos → donde, cuando, como
//   more / most → más... que, el más..., mejor, peor, mayor, menor
//   conjunciones correlativas → ni... ni, o... o, tanto... como, no solo... sino también
//   contracciones (I'm, don't) → al, del; conmigo, contigo, consigo
//   mayúsculas: días, meses, gentilicios e idiomas van con minúscula
//   unidades inglesas → símbolos del sistema métrico (sin punto)
//   calles y estados → Av., Jr., Ca., Psje. y n.º, dpto., int., s/n

export const SECTIONS: Section[] = [
  { id: "SS", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "TT", name: "Preposiciones", icon: "📦" },
  { id: "UU", name: "Conjunciones", icon: "🔗" },
  { id: "VV", name: "Contracciones", icon: "✂️" },
  { id: "WW", name: "Comas", icon: "❗" },
  { id: "XX", name: "Mayúsculas", icon: "🔠" },
  { id: "YY", name: "Formato", icon: "📝" },
  { id: "ZZ", name: "Abreviaturas", icon: "📅" },
];

// --- SS. Adjetivos y adverbios -----------------------------------------------

const ADJECTIVES_IN = [
  s("El anciano sabio contó una leyenda antigua.", "sabio", "antigua"), s("Cruzamos un puente estrecho sobre un río caudaloso.", "estrecho", "caudaloso"), s("La niña curiosa abrió la caja misteriosa.", "curiosa", "misteriosa"),
  s("Un viento gélido azotaba las cumbres nevadas.", "gélido", "nevadas"), s("Los hábiles artesanos tallaron figuras diminutas.", "hábiles", "diminutas"), s("Era una tarde tranquila y luminosa.", "tranquila", "luminosa"),
  s("El valle fértil produce frutas dulces.", "fértil", "dulces"), s("Tres perros flacos seguían al pastor silencioso.", "Tres", "flacos", "silencioso"),
];
const ADJ_ORDER: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Fue un gran día para todos.", "Fue un grande día para todos.", "Fue un día gran para todos."), w("¿Qué oración está bien escrita?", "Es el primer premio que gano.", "Es el primero premio que gano.", "Es el premio primer que gano."),
  w("¿Qué oración está bien escrita?", "No vino ningún alumno.", "No vino ninguno alumno.", "No vino alumno ningún."), w("¿Qué oración está bien escrita?", "Algún día viajaré al Cusco.", "Alguno día viajaré al Cusco.", "Día algún viajaré al Cusco."),
  w("¿Qué oración está bien escrita?", "Hizo un buen trabajo.", "Hizo un bueno trabajo.", "Hizo un trabajo buen."), w("¿Qué oración está bien escrita?", "San Martín proclamó la Independencia.", "Santo Martín proclamó la Independencia.", "Martín San proclamó la Independencia."),
  w("¿Qué oración está bien escrita?", "Compré dos chompas rojas de lana.", "Compré rojas dos chompas de lana.", "Compré chompas dos rojas de lana."), w("¿Qué oración está bien escrita?", "Vimos un mal partido.", "Vimos un malo partido.", "Vimos un partido mal."),
  w("¿Qué significa «una gran mujer»?", "Una mujer admirable", "Una mujer de gran tamaño", "Una mujer muy anciana"), w("¿Qué significa «una mujer grande»?", "Una mujer de gran tamaño o edad", "Una mujer admirable", "Una mujer famosa"),
  w("¿Qué significa «un simple empleado»?", "Un empleado sin mayor cargo", "Un empleado poco inteligente", "Un empleado muy amable"), w("¿Qué significa «cierta noticia»?", "Alguna noticia, no se dice cuál", "Una noticia verdadera", "Una noticia falsa"),
];
const ADVERBS_IN = [
  s("Ayer llegamos tarde y cansados.", "Ayer", "tarde"), s("El puma avanzó lentamente y luego saltó.", "lentamente", "luego"), s("Aquí siempre llueve mucho.", "Aquí", "siempre", "mucho"),
  s("Hablaba bastante bien.", "bastante", "bien"), s("Jamás había subido tan arriba.", "Jamás", "tan", "arriba"), s("Quizá mañana salgamos temprano.", "Quizá", "mañana", "temprano"),
  s("Vive cerca y viene frecuentemente.", "cerca", "frecuentemente"), s("Respondió demasiado rápido.", "demasiado", "rápido"),
];
const RELATIVE_ADVERBS: ChoiceItem[] = [
  f("Visitamos la casa ___ vivió el poeta.", "donde", "cuando", "como"), f("Nunca olvidaré el año ___ nevó en Lima.", "cuando", "donde", "como"), f("Resolví el problema ___ me indicaste.", "como", "donde", "cuando"),
  f("Ese es el puerto ___ zarpan los barcos.", "de donde", "de cuando", "de como"), f("Avísame ___ llegues.", "cuando", "donde", "como"), f("Camina hasta ___ termina la pista.", "donde", "cuando", "como"),
  f("Lo hice tal ___ decía la receta.", "como", "donde", "cuando"), f("Fue en verano ___ nos conocimos.", "cuando", "donde", "como"), f("Iré ___ tú vayas.", "adonde", "cuando", "como"),
  f("Me sorprende la forma ___ dibuja.", "como", "donde", "cuando"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("La tortuga avanza ___.", "lentamente", "lenta", "lentitud"), f("Fue una respuesta ___.", "rápida", "rápidamente", "rapidez"), f("Explicó el tema ___.", "claramente", "clara", "claridad"),
  f("Tiene una letra ___.", "clara", "claramente", "aclarar"), f("Los niños jugaban ___.", "alegremente", "alegre", "alegría"), f("Es un perro muy ___.", "tranquilo", "tranquilamente", "tranquilidad"),
  f("Canta muy ___.", "bien", "bueno", "buena"), f("Es un ___ cantante.", "buen", "bien", "buenamente"), f("Lo hizo ___, sin fijarse.", "mal", "malo", "mala"),
  f("Tuvo un ___ día.", "mal", "malamente", "maldad"),
];
const AA = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ...["Compré MUCHO pan.", "Es un camino LARGO.", "Tiene POCA paciencia.", "Fue un salto ALTO.", "Dio una respuesta RÁPIDA.", "Hay BASTANTE comida."].map((x) => AA(x, 0)),
  ...["Trabaja MUCHO.", "Habló LARGO y tendido.", "Duerme POCO.", "Voló ALTO.", "Respondió RÁPIDO.", "Comimos BASTANTE."].map((x) => AA(x, 1)),
];
const COMPARE_ADJ: ChoiceItem[] = [
  f("La selva es ___ húmeda que la costa.", "más", "tan", "muy"), f("El gato es ___ ágil como el mono.", "tan", "más", "menos"), f("El invierno es ___ caluroso que el verano.", "menos", "tan", "muy"),
  f("Tu dibujo es ___ que el mío.", "mejor", "bueno", "bien"), f("Mi nota fue ___ que la tuya.", "peor", "mala", "mal"), f("Mi hermano es ___ que yo: tiene quince años.", "mayor", "más", "grande"),
  f("Este cuento es tan divertido ___ el anterior.", "como", "que", "de"), f("El Nilo es casi tan largo ___ el Amazonas.", "como", "que", "más"), f("Ella es ___ que su prima por dos años.", "menor", "menos", "poca"),
  f("La ballena es ___ grande que el elefante.", "más", "tan", "muy"),
];
const SUPERLATIVE: ChoiceItem[] = [
  w("¿Cómo se escribe el superlativo de «bueno»?", "buenísimo", "buenisimo", "buenícimo"), w("¿Cómo se escribe el superlativo de «joven»?", "jovencísimo", "jovenísimo", "jovensísimo"), w("¿Cómo se escribe el superlativo de «amargo»?", "amarguísimo", "amargísimo", "amarguisimo"),
  w("¿Cómo se escribe el superlativo de «flaco»?", "flaquísimo", "flacísimo", "flaquisimo"), w("¿Cómo se escribe el superlativo de «audaz»?", "audacísimo", "audazísimo", "audasísimo"), w("¿Cómo se escribe el superlativo de «vago»?", "vaguísimo", "vagísimo", "vaguisimo"),
  w("¿Cómo se escribe el superlativo de «tosco»?", "tosquísimo", "toscísimo", "tosquisimo"), w("¿Cómo se escribe el superlativo de «feroz»?", "ferocísimo", "ferozísimo", "ferosísimo"), w("¿Cómo se escribe el superlativo de «simpático»?", "simpatiquísimo", "simpaticísimo", "simpatiquisimo"),
  w("¿Cómo se escribe el superlativo de «limpio»?", "limpísimo", "limpiísimo", "limpisimo"),
];
const MORE_MOST: ChoiceItem[] = [
  f("El Huascarán es la montaña ___ alta del Perú.", "más", "muy", "tan"), f("De mis tres hermanos, Hugo es ___.", "el mayor", "el más mayor", "mayor que"), f("Fue ___ partido del campeonato: perdimos 5 a 0.", "el peor", "el más peor", "peor que"),
  f("Esta es ___ noticia del día: ¡ganamos!", "la mejor", "la más mejor", "mejor que"), f("El guepardo es ___ rápido que el caballo.", "más", "el más", "tan"), f("De todo el salón, Ana es ___ aplicada.", "la más", "más", "tan"),
  f("Mi prima es ___ de la familia: tiene tres años.", "la menor", "la más menor", "menor que"), f("Febrero es el mes ___ corto.", "más", "muy", "tan"), f("Hoy hace ___ frío que ayer.", "más", "el más", "muy"),
  f("Es el libro ___ interesante que he leído.", "más", "muy", "tanto"),
];
const COMPARE_ADV: ChoiceItem[] = [
  f("El avión llega ___ pronto que el bus.", "más", "tan", "muy"), f("Hoy dormí ___ que ayer: descansé de verdad.", "mejor", "más bien", "bueno"), f("Lee tan rápido ___ su hermana.", "como", "que", "de"),
  f("Ayer jugamos ___ que nunca: perdimos todo.", "peor", "más mal", "malo"), f("Vive ___ lejos que yo de la escuela.", "más", "tan", "mucho"), f("Habla ___ claro posible.", "lo más", "tan", "muy"),
  f("Llegó ___ tarde que los demás.", "más", "tan", "muy"), f("Trabaja tanto ___ su padre.", "como", "que", "más"), f("Corre ___ rápido que todos.", "más", "tan", "mejor"),
  f("Estudia ___ que antes: ahora repasa a diario.", "más", "tanto", "muy"),
];

// --- TT. Preposiciones -------------------------------------------------------

const PREPS_IN = [
  s("Viajamos desde Lima hasta Tumbes por la costa.", "desde", "hasta", "por"), s("El gato duerme bajo la mesa de la cocina.", "bajo", "de"), s("Luchó contra el viento durante horas.", "contra", "durante"),
  s("Según el mapa, estamos entre dos ríos.", "Según", "entre"), s("Salió sin abrigo hacia la plaza.", "sin", "hacia"), s("Habló ante el público con seguridad.", "ante", "con"),
  s("Tras la lluvia, salimos a caminar.", "Tras", "a"), s("El regalo es para ti.", "para"),
];
const PO = "¿Cuál es la preposición y su término (lo que va después)?";
const PREP_OBJECT: ChoiceItem[] = [
  pt(PO, "Las vicuñas corren por la pampa.", "por la pampa", "Las vicuñas", "corren por"), pt(PO, "El niño se escondió tras la cortina.", "tras la cortina", "El niño", "se escondió tras"),
  pt(PO, "Navegaron contra la corriente.", "contra la corriente", "Navegaron", "Navegaron contra"), pt(PO, "Pintó el mural con sus compañeros.", "con sus compañeros", "Pintó el mural con sus", "el mural con"),
  pt(PO, "El tren pasa entre dos cerros.", "entre dos cerros", "El tren pasa entre dos", "pasa entre"), pt(PO, "Caminaron hacia el mirador.", "hacia el mirador", "Caminaron", "Caminaron hacia el"),
  pt(PO, "Trabajó desde el amanecer.", "desde el amanecer", "Trabajó", "Trabajó desde el amanecer hasta"), pt(PO, "Escribió un poema sobre el mar.", "sobre el mar", "Escribió un poema", "un poema sobre"),
];
const PREP_PHRASE: ChoiceItem[] = [
  w("¿Cuál es una frase con preposición?", "bajo la lluvia", "la lluvia fina", "llueve fuerte"), w("¿Cuál es una frase con preposición?", "desde el muelle", "el muelle viejo", "pesca mucho"),
  w("¿Cuál es una frase con preposición?", "sobre la colina", "la colina verde", "sube rápido"), w("¿Cuál es una frase con preposición?", "hasta el final", "el final feliz", "termina pronto"),
  w("¿Cuál es una frase con preposición?", "ante el juez", "el juez serio", "habla claro"), w("¿Cuál es una frase con preposición?", "mediante un sorteo", "un sorteo justo", "sortea hoy"),
  w("¿Cuál es una frase con preposición?", "sin permiso", "permiso escrito", "sale tarde"), w("¿Cuál es una frase con preposición?", "con paciencia", "mucha paciencia", "espera aquí"),
];
const PREP_REVIEW: ChoiceItem[] = [
  f("El avión vuela ___ las nubes.", "sobre", "según", "sin"), f("___ la ley, todos somos iguales.", "Ante", "Tras", "Hacia"), f("Llegaron ___ las ocho y las nueve.", "entre", "contra", "bajo"),
  f("Lo eligieron ___ votación.", "mediante", "hacia", "desde"), f("___ la tormenta vino la calma.", "Tras", "Según", "Sin"), f("Vengo ___ Huancayo.", "de", "a", "en"),
  f("Este jarabe es bueno ___ la tos.", "para", "desde", "tras"), f("___ el pronóstico, mañana nevará.", "Según", "Contra", "Bajo"), f("Remamos ___ la orilla.", "hacia", "sin", "según"),
  f("Estudio ___ las tres de la tarde.", "desde", "entre", "contra"),
];

// --- UU. Conjunciones --------------------------------------------------------

const COORD_IN = [
  s("Quería ir, pero estaba enfermo.", "pero"), s("Ni come ni deja comer.", "Ni", "ni"), s("Estudia inglés e italiano.", "e"),
  s("¿Tomas té o café?", "o"), s("No es de Lima, sino de Ica.", "sino"), s("Llovió mucho y el río creció.", "y"),
  s("Era tarde, mas seguimos caminando.", "mas"), s("Había diez u once personas.", "u"),
];
const SUBORD_IN = [
  s("Me quedé porque llovía.", "porque"), s("Aunque es joven, sabe mucho.", "Aunque"), s("Si puedes, ven temprano.", "Si"),
  s("Avísame cuando termines.", "cuando"), s("Estudia mientras yo cocino.", "mientras"), s("Como llegó tarde, perdió el bus.", "Como"),
  s("Dijo que volvería pronto.", "que"), s("Lo haré aunque me cueste.", "aunque"),
];
const CORRELATIVE_PAIR: ChoiceItem[] = [
  f("___ el frío ___ la lluvia nos detuvieron.", "Ni / ni", "O / ni", "Tanto / ni"), f("___ estudias ___ no aprobarás.", "O / o", "Ni / ni", "Tanto / como"),
  f("___ los niños ___ los adultos disfrutaron.", "Tanto / como", "Ni / como", "O / ni"), f("___ canta, ___ baila.", "No solo / sino que también", "Ni / como", "Tanto / o"),
  f("___ llueva ___ truene, iremos.", "Ya / ya", "Ni / como", "Tanto / sino"), f("Es ___ inteligente ___ trabajadora.", "tan / como", "tanto / ni", "o / sino"),
  f("___ vienes conmigo ___ te quedas.", "O / o", "Ni / sino", "Tanto / como"), f("No quiero ___ sopa ___ ensalada.", "ni / ni", "o / como", "tanto / sino"),
  f("___ en la costa ___ en la sierra hubo fiestas.", "Tanto / como", "Ni / o", "Ya / ni"), f("___ ganó la carrera, ___ batió el récord.", "No solo / sino que", "Ni / como", "O / ni"),
];
const CORRELATIVE_FILL: ChoiceItem[] = [
  f("Ni tú ___ yo sabíamos la respuesta.", "ni", "o", "como"), f("Tanto mi mamá ___ mi papá trabajan.", "como", "ni", "o"), f("No solo llegó tarde, ___ que olvidó la tarea.", "sino", "pero", "ni"),
  f("O vienes ahora ___ nos vamos sin ti.", "o", "ni", "como"), f("No vino ni el lunes ___ el martes.", "ni", "o", "y"), f("Es tan alto ___ su padre.", "como", "que", "ni"),
  f("No fue Luis, ___ Pedro.", "sino", "pero", "ni"), f("Tanto en verano ___ en invierno sale a correr.", "como", "o", "ni"), f("Ya ría, ___ llore, siempre canta.", "ya", "ni", "como"),
  f("No solo es amable, sino ___ generoso.", "también", "tampoco", "como"),
];

// --- VV. Contracciones -------------------------------------------------------

const AL_DEL: ChoiceItem[] = [
  f("Regresamos ___ pueblo al anochecer.", "al", "a el", "del"), f("La cima ___ cerro estaba nevada.", "del", "de el", "al"), f("Le escribí ___ alcalde.", "al", "a el", "del"),
  f("Vengo ___ estadio.", "del", "de el", "al"), f("Ese libro es de ___, no de ella.", "él", "el", "del"), f("Viajaremos a ___ Salvador.", "El", "el", "al"),
  f("El nido ___ cóndor está en la roca.", "del", "de el", "al"), f("Fuimos ___ médico.", "al", "a el", "del"), f("El agua ___ río bajaba turbia.", "del", "de el", "al"),
  f("Saltó ___ agua sin dudar.", "al", "a el", "del"),
];
const CONMIGO: ChoiceItem[] = [
  f("¿Vendrás ___ a la feria?", "conmigo", "con mí", "con yo"), f("Siempre cuento ___, amiga.", "contigo", "con ti", "con tú"), f("El arriero llevaba ___ dos mulas.", "consigo", "con sí", "con se"),
  f("Nadie quiso sentarse ___ y me quedé solo.", "conmigo", "con mí", "con yo"), f("Me gusta estudiar ___ porque explicas bien.", "contigo", "con ti", "con tú"), f("La niña hablaba ___ misma.", "consigo", "con sí", "con se"),
  f("Trae el cuaderno ___ cuando vengas.", "contigo", "con ti", "con tú"), f("Mi perro siempre sale ___.", "conmigo", "con mí", "con yo"), f("El viajero cargaba ___ una maleta vieja.", "consigo", "con sí", "con se"),
  f("Estoy de acuerdo ___.", "contigo", "con ti", "con tú"),
];

// --- WW. Comas ---------------------------------------------------------------

const COMMA = "¿Qué oración tiene las comas bien puestas?";
const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "Sembramos quinua, kiwicha, tarwi y oca.", "Sembramos quinua kiwicha, tarwi y oca.", "Sembramos, quinua, kiwicha, tarwi, y oca."), w(COMMA, "El desfile tuvo bandas, danzas y carros alegóricos.", "El desfile tuvo bandas danzas y carros alegóricos.", "El desfile, tuvo bandas, danzas y carros alegóricos."),
  w(COMMA, "Llegó, saludó, se sentó y empezó a leer.", "Llegó saludó se sentó y empezó a leer.", "Llegó, saludó, se sentó, y, empezó a leer."), w(COMMA, "Es un texto breve, claro y ordenado.", "Es un texto breve claro y ordenado.", "Es un texto, breve, claro y ordenado."),
  w(COMMA, "Limitamos con Ecuador, Colombia, Brasil, Bolivia y Chile.", "Limitamos con Ecuador Colombia Brasil Bolivia y Chile.", "Limitamos con, Ecuador, Colombia, Brasil, Bolivia, y Chile."), w(COMMA, "Trajo pan, queso, aceitunas y jugo.", "Trajo pan queso aceitunas y jugo.", "Trajo pan, queso, aceitunas, y, jugo."),
  w(COMMA, "Corrieron, saltaron y nadaron.", "Corrieron saltaron y nadaron.", "Corrieron, saltaron, y nadaron,"), w(COMMA, "Compré hilo, agujas y botones.", "Compré hilo agujas y botones.", "Compré, hilo, agujas y botones."),
];
const COMMA_DATES_PLACES: ChoiceItem[] = [
  w("¿Qué fecha de carta está bien escrita?", "Huancayo, 12 de abril de 2026", "Huancayo 12 de abril, de 2026", "Huancayo, 12, de abril de 2026"), w(COMMA, "Nací en Chiclayo, Lambayeque.", "Nací en Chiclayo Lambayeque.", "Nací, en Chiclayo Lambayeque."),
  w("¿Qué fecha está bien escrita?", "Jueves, 30 de agosto de 2029", "Jueves 30, de agosto de 2029", "Jueves, 30 de agosto, de 2029"), w(COMMA, "El congreso será en Bogotá, Colombia, en mayo.", "El congreso será en Bogotá Colombia, en mayo.", "El congreso será en, Bogotá Colombia en mayo."),
  w("¿Qué fecha de carta está bien escrita?", "Iquitos, 5 de enero de 2027", "Iquitos 5 de enero de, 2027", "Iquitos, 5 de enero, 2027"), w(COMMA, "Mi abuelo nació en Jauja, Junín.", "Mi abuelo nació en Jauja Junín.", "Mi abuelo, nació en Jauja Junín."),
  w(COMMA, "Viajaremos a Santiago, Chile, el lunes.", "Viajaremos a Santiago Chile el lunes.", "Viajaremos, a Santiago Chile, el lunes."), w("¿Qué fecha de carta está bien escrita?", "Puno, 2 de febrero de 2028", "Puno 2, de febrero de 2028", "Puno, 2 de, febrero de 2028"),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Valeria, pásame el diccionario.", "Valeria pásame el diccionario.", "Valeria pásame, el diccionario."), w(COMMA, "Te felicito, hijo, por tu esfuerzo.", "Te felicito hijo por tu esfuerzo.", "Te felicito hijo, por tu esfuerzo."),
  w(COMMA, "Doctor, ¿puedo pasar?", "Doctor ¿puedo pasar?", "Doctor ¿puedo, pasar?"), w(COMMA, "No corras, Tomás.", "No corras Tomás.", "No, corras Tomás."),
  w(COMMA, "Amigos, llegó la hora.", "Amigos llegó la hora.", "Amigos llegó, la hora."), w(COMMA, "Gracias, vecinos, por venir.", "Gracias vecinos por venir.", "Gracias vecinos, por venir."),
  w(COMMA, "¿Qué opinas, Rosa?", "¿Qué opinas Rosa?", "¿Qué, opinas Rosa?"), w(COMMA, "Señora, su vuelto.", "Señora su vuelto.", "Señora su, vuelto."),
];
const COMMA_INTRO: ChoiceItem[] = [
  w(COMMA, "Por lo tanto, debemos ahorrar agua.", "Por lo tanto debemos, ahorrar agua.", "Por, lo tanto debemos ahorrar agua."), w(COMMA, "En primer lugar, lee el texto.", "En primer lugar lee, el texto.", "En, primer lugar lee el texto."),
  w(COMMA, "Sin duda, fue la mejor función.", "Sin duda fue, la mejor función.", "Sin, duda fue la mejor función."), w(COMMA, "Al amanecer, los pescadores salieron.", "Al amanecer los pescadores, salieron.", "Al, amanecer los pescadores salieron."),
  w(COMMA, "Finalmente, entregamos el informe.", "Finalmente entregamos, el informe.", "Finalmente entregamos el, informe."), w(COMMA, "Es decir, todos participaron.", "Es decir todos, participaron.", "Es, decir todos participaron."),
  w(COMMA, "No obstante, el partido continuó.", "No obstante el partido, continuó.", "No, obstante el partido continuó."), w(COMMA, "Después de la cena, leímos un cuento.", "Después de la cena leímos, un cuento.", "Después, de la cena leímos un cuento."),
];
const COMMA_COMPOUND: ChoiceItem[] = [
  w(COMMA, "Quise ir al paseo, pero tenía fiebre.", "Quise ir al paseo pero, tenía fiebre.", "Quise, ir al paseo pero tenía fiebre."), w(COMMA, "Si terminas temprano, iremos al parque.", "Si terminas temprano iremos, al parque.", "Si, terminas temprano iremos al parque."),
  w(COMMA, "Aunque llovía, salimos a correr.", "Aunque llovía salimos, a correr.", "Aunque, llovía salimos a correr."), w(COMMA, "No es de madera, sino de piedra.", "No es de madera sino, de piedra.", "No es, de madera sino de piedra."),
  w(COMMA, "Cuando sonó el timbre, todos salieron.", "Cuando sonó el timbre todos, salieron.", "Cuando, sonó el timbre todos salieron."), w(COMMA, "Estudió mucho, así que aprobó.", "Estudió mucho así que, aprobó.", "Estudió, mucho así que aprobó."),
  w(COMMA, "Como no había buses, fuimos a pie.", "Como no había buses fuimos, a pie.", "Como, no había buses fuimos a pie."), w(COMMA, "Tenía sueño, aunque había dormido bien.", "Tenía sueño aunque, había dormido bien.", "Tenía, sueño aunque había dormido bien."),
];

// --- XX. Mayúsculas ----------------------------------------------------------

const CAPS_FIX = "¿Cómo se corrigen las mayúsculas de la oración?";
const CAPS_ERRORS: ChoiceItem[] = [
  pt(CAPS_FIX, "el Lunes viajaremos a cusco.", "El lunes viajaremos a Cusco.", "El Lunes viajaremos a Cusco.", "El lunes viajaremos a cusco."), pt(CAPS_FIX, "Mi Tía carmen habla Quechua.", "Mi tía Carmen habla quechua.", "Mi tía Carmen habla Quechua.", "Mi Tía Carmen habla quechua."),
  pt(CAPS_FIX, "En Julio celebramos fiestas patrias.", "En julio celebramos Fiestas Patrias.", "En Julio celebramos Fiestas Patrias.", "En julio celebramos fiestas patrias."), pt(CAPS_FIX, "El Río amazonas cruza la Selva.", "El río Amazonas cruza la selva.", "El Río Amazonas cruza la Selva.", "El río amazonas cruza la selva."),
  pt(CAPS_FIX, "Los Incas construyeron machu picchu.", "Los incas construyeron Machu Picchu.", "Los Incas construyeron Machu Picchu.", "Los incas construyeron Machu picchu."), pt(CAPS_FIX, "El Doctor ruiz atiende los Martes.", "El doctor Ruiz atiende los martes.", "El Doctor Ruiz atiende los martes.", "El doctor Ruiz atiende los Martes."),
  pt(CAPS_FIX, "Mi amigo Japonés vive en lima.", "Mi amigo japonés vive en Lima.", "Mi amigo Japonés vive en Lima.", "Mi Amigo japonés vive en Lima."), pt(CAPS_FIX, "La independencia del perú fue en 1821.", "La Independencia del Perú fue en 1821.", "La independencia del Perú fue en 1821.", "La Independencia Del Perú fue en 1821."),
  pt(CAPS_FIX, "leímos sobre el Lago titicaca.", "Leímos sobre el lago Titicaca.", "Leímos sobre el Lago Titicaca.", "leímos sobre el lago Titicaca."), pt(CAPS_FIX, "En Navidad visitamos a la Abuela rosa.", "En Navidad visitamos a la abuela Rosa.", "En navidad visitamos a la abuela Rosa.", "En Navidad visitamos a la Abuela Rosa."),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título de novela está bien escrito?", "El mundo es ancho y ajeno", "El Mundo Es Ancho Y Ajeno", "el mundo es ancho y ajeno"), w("¿Qué título de libro está bien escrito?", "Tradiciones peruanas", "Tradiciones Peruanas", "tradiciones peruanas"),
  w("¿Qué título de cuento está bien escrito?", "El vuelo de los cóndores", "El Vuelo De Los Cóndores", "el vuelo de los Cóndores"), w("¿Qué título de novela está bien escrito?", "Don Quijote de la Mancha", "Don quijote de la mancha", "don Quijote De La Mancha"),
  w("¿Qué título de poema está bien escrito?", "Piedra negra sobre una piedra blanca", "Piedra Negra Sobre Una Piedra Blanca", "piedra negra sobre una piedra blanca"), w("¿Qué título de revista está bien escrito?", "Caretas", "caretas", "CAretas"),
  w("¿Qué título de libro está bien escrito?", "Leyendas del Perú", "Leyendas Del Perú", "leyendas del perú"), w("¿Qué título de cuento está bien escrito?", "Alienación", "alienación", "ALienación"),
  w("¿Qué título de diario está bien escrito?", "La República", "la república", "La república"), w("¿Qué título de libro está bien escrito?", "Viaje al centro de la Tierra", "Viaje Al Centro De La Tierra", "viaje al centro de la tierra"),
];

// --- YY. Formato -------------------------------------------------------------

const FORMAT_TITLES: ChoiceItem[] = [
  w("En la computadora, ¿cómo se escribe el título de una novela?", "En cursiva", "En negrita", "Entre corchetes"), w("¿Cómo se escribe el título de un artículo de revista?", "Entre comillas", "En cursiva", "Subrayado"),
  w("Al escribir a mano, ¿cómo se destaca el título de un libro?", "Se subraya.", "Se tacha.", "Se encierra en un círculo."), w("¿Cómo se escribe el nombre de una revista?", "En cursiva", "Tachado", "Entre paréntesis"),
  w("¿Cómo se escribe el título de un capítulo de un libro?", "Entre comillas", "En negrita", "En mayúsculas"), w("¿Cómo se escribe el título de un cuento dentro de una antología?", "Entre comillas", "En cursiva", "Entre guiones"),
  w("¿Cómo se escribe el título de una obra de teatro?", "En cursiva", "En negrita", "Entre paréntesis"), w("¿Cómo se escribe el título de un poema suelto?", "Entre comillas", "Subrayado", "Entre barras"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Cuál está bien escrito?", "Leí el capítulo «La partida» anoche.", "Leí el capítulo La Partida anoche.", "Leí el capítulo «la Partida» anoche."), w("¿Cuál está bien escrito?", "El artículo «Glaciares en retroceso» es breve.", "El artículo Glaciares En Retroceso es breve.", "El artículo «glaciares en Retroceso» es breve."),
  w("¿Cuál está bien escrito?", "Recitamos el poema «A mi hermano Miguel».", "Recitamos el poema a mi hermano miguel.", "Recitamos el poema «a mi Hermano miguel»."), w("¿Cuál está bien escrito?", "Cantamos «Contigo Perú» en el acto.", "Cantamos contigo perú en el acto.", "Cantamos «contigo perú» en el acto."),
  w("¿Cuál está bien escrito?", "Me gustó el cuento «El trompo».", "Me gustó el cuento el trompo.", "Me gustó el cuento «el Trompo»."), w("¿Cuál está bien escrito?", "La canción «Valicha» es un huayno.", "La canción valicha es un huayno.", "La Canción «valicha» es un huayno."),
  w("¿Cuál está bien escrito?", "Analizamos el cuento «El banquete».", "Analizamos el cuento el banquete.", "Analizamos el Cuento «el Banquete»."), w("¿Cuál está bien escrito?", "El capítulo «Los primeros pasos» abre el libro.", "El capítulo los primeros pasos abre el libro.", "El capítulo «los Primeros Pasos» abre el libro."),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Jr. Ayacucho n.º 512, Huamanga", "jr. ayacucho n.º 512 huamanga", "Jr. Ayacucho, n.º, 512 Huamanga"), w("¿Qué dirección está bien escrita?", "Av. La Marina 2000, dpto. 301, Lima", "av. la marina 2000 dpto. 301 lima", "Av. la Marina, 2000 dpto. 301, lima"),
  w("¿Qué dirección está bien escrita?", "Ca. Real s/n, Chupaca", "ca. real s/n chupaca", "Ca. real, s/n Chupaca"), w("¿Qué dirección está bien escrita?", "Psje. Los Olivos 45, int. B, Tacna", "psje. los olivos 45 int. b tacna", "Psje. los Olivos, 45, int. b Tacna"),
  w("¿Qué dato va al final de una dirección?", "La ciudad o el distrito", "El nombre de la vía", "El número de la casa"), w("¿Qué dirección está bien escrita?", "Urb. Santa Rosa, Mz. F, Lt. 12, Ica", "urb. santa rosa mz. f lt. 12 ica", "Urb. Santa rosa, mz. F, lt. 12 Ica"),
  w("¿Qué dirección está bien escrita?", "Av. Grau 870, Piura", "av. Grau 870 piura", "Av. grau, 870, piura"), w("¿Qué significa «s/n» en una dirección?", "Sin número", "Sin nombre", "Segundo nivel"),
];
const DIALOGUE: ChoiceItem[] = [
  w("¿Qué diálogo está bien escrito?", "—¿Falta mucho? —preguntó Inés.", "¿Falta mucho? —preguntó Inés.", "—¿Falta mucho? — preguntó Inés"), w("¿Qué diálogo está bien escrito?", "—Llegaremos al anochecer —dijo el guía.", "Llegaremos al anochecer, —dijo el guía.", "— Llegaremos al anochecer — dijo el guía."),
  w("¿Qué diálogo está bien escrito?", "—No temas —susurró—. Estoy aquí.", "—No temas —susurró. Estoy aquí.", "No temas —susurró—, estoy aquí."), w("¿Qué diálogo está bien escrito?", "—¡Cuidado! —gritó el arriero.", "¡Cuidado! —gritó el arriero.", "—¡Cuidado! gritó— el arriero."),
  w("¿Qué diálogo está bien escrito?", "—Creo —dijo Luis— que nos perdimos.", "—Creo —dijo Luis que nos perdimos.", "—Creo dijo Luis— que nos perdimos."), w("¿Qué diálogo está bien escrito?", "—Gracias por venir —dijo la abuela.", "—Gracias por venir— dijo la abuela.", "Gracias por venir, —dijo la abuela."),
  w("¿Cómo se marca el comentario del narrador dentro de un diálogo?", "Entre rayas, pegadas al comentario", "Entre comillas simples", "Entre paréntesis"), w("¿Qué diálogo está bien escrito?", "—¿Quién anda ahí? —preguntó el guardián.", "—¿Quién anda ahí?, —preguntó el guardián.", "¿—Quién anda ahí? —preguntó el guardián."),
];

// --- ZZ. Abreviaturas --------------------------------------------------------

const abbr = (list: [string, string][]) => pool(list.map(([name, a]) => [`¿Cuál es la abreviatura o el símbolo de «${name}»?`, a] as [string, string]), "p");
const DAY_MONTH_ABBR: [string, string][] = [["lunes", "lun."], ["miércoles", "mié."], ["viernes", "vie."], ["sábado", "sáb."], ["domingo", "dom."], ["enero", "ene."], ["febrero", "feb."], ["abril", "abr."], ["agosto", "ago."], ["setiembre", "set."], ["octubre", "oct."], ["diciembre", "dic."]];
const TITLE_ABBR: [string, string][] = [["señor", "Sr."], ["señora", "Sra."], ["señorita", "Srta."], ["doctor", "Dr."], ["doctora", "Dra."], ["ingeniero", "Ing."], ["licenciada", "Lic."], ["profesor", "Prof."], ["usted", "Ud."], ["ustedes", "Uds."], ["arquitecto", "Arq."], ["magíster", "Mg."]];
const UNIT_ABBR: [string, string][] = [["kilogramo", "kg"], ["gramo", "g"], ["litro", "l"], ["mililitro", "ml"], ["kilómetro", "km"], ["metro", "m"], ["centímetro", "cm"], ["milímetro", "mm"], ["hora", "h"], ["minuto", "min"], ["segundo", "s"], ["tonelada", "t"]];
const STREET_ABBR: [string, string][] = [["avenida", "Av."], ["jirón", "Jr."], ["calle", "Ca."], ["pasaje", "Psje."], ["urbanización", "Urb."], ["manzana", "Mz."], ["lote", "Lt."], ["número", "n.º"], ["departamento", "dpto."], ["interior", "int."], ["sin número", "s/n"], ["código postal", "C. P."]];

export const ROWS: Row[] = [
  ["SS.1", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos de la oración.", ADJECTIVES_IN)],
  ["SS.2", "Ordenar los adjetivos: su lugar y sus formas cortas", (r) => choose(r, "", ADJ_ORDER)],
  ["SS.3", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios (dicen cómo, cuándo, dónde o cuánto).", ADVERBS_IN)],
  ["SS.4", "Usar adverbios relativos: donde, cuando y como", (r) => choose(r, "Completa la oración.", RELATIVE_ADVERBS)],
  ["SS.5", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["SS.6", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],
  ["SS.7", "Usar adjetivos para comparar", (r) => choose(r, "Completa la comparación.", COMPARE_ADJ)],
  ["SS.8", "Escribir adjetivos que comparan: -ísimo", (r) => choose(r, "", SUPERLATIVE)],
  ["SS.9", "Usar adjetivos con «más» y «el más»", (r) => choose(r, "Completa la oración.", MORE_MOST)],
  ["SS.10", "Usar adverbios para comparar", (r) => choose(r, "Completa la comparación.", COMPARE_ADV)],

  ["TT.1", "Identificar preposiciones", (r) => pickInSentence(r, "Selecciona las preposiciones.", PREPS_IN)],
  ["TT.2", "Identificar las preposiciones y sus términos", (r) => choose(r, "", PREP_OBJECT)],
  ["TT.3", "Identificar frases con preposición", (r) => choose(r, "", PREP_PHRASE)],
  ["TT.4", "Preposiciones: repaso", (r) => choose(r, "Completa la oración.", PREP_REVIEW)],

  ["UU.1", "Identificar conjunciones coordinantes", (r) => pickInSentence(r, "Selecciona las conjunciones que unen (y, e, o, u, ni, pero, mas, sino).", COORD_IN)],
  ["UU.2", "Identificar conjunciones subordinantes", (r) => pickInSentence(r, "Selecciona la conjunción que introduce la idea subordinada.", SUBORD_IN)],
  ["UU.3", "Usar el par correcto de conjunciones correlativas", (r) => choose(r, "Completa la oración.", CORRELATIVE_PAIR)],
  ["UU.4", "Completar con la conjunción correlativa que falta", (r) => choose(r, "Completa la oración.", CORRELATIVE_FILL)],

  ["VV.1", "Contracciones: al y del", (r) => choose(r, "Completa la oración.", AL_DEL)],
  ["VV.2", "Contracciones: conmigo, contigo y consigo", (r) => choose(r, "Completa la oración.", CONMIGO)],

  ["WW.1", "Comas en una enumeración", (r) => choose(r, "", COMMA_SERIES)],
  ["WW.2", "Comas en las fechas y en los nombres de lugares", (r) => choose(r, "", COMMA_DATES_PLACES)],
  ["WW.3", "Comas con vocativos", (r) => choose(r, "", COMMA_ADDRESS)],
  ["WW.4", "Comas después de elementos introductorios", (r) => choose(r, "", COMMA_INTRO)],
  ["WW.5", "Comas en oraciones compuestas y subordinadas", (r) => choose(r, "", COMMA_COMPOUND)],
  ["WW.6", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_DATES_PLACES, ...COMMA_ADDRESS, ...COMMA_INTRO, ...COMMA_COMPOUND])],

  ["XX.1", "Corregir errores de mayúsculas", (r) => choose(r, "", CAPS_ERRORS)],
  ["XX.2", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],

  ["YY.1", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["YY.2", "Dar formato y poner mayúsculas a los títulos", (r) => choose(r, "", TITLES_BOTH)],
  ["YY.3", "Dar formato a las direcciones", (r) => choose(r, "", ADDRESSES)],
  ["YY.4", "Puntuar los diálogos", (r) => choose(r, "", DIALOGUE)],

  ["ZZ.1", "Abreviar los días de la semana y los meses del año", (r) => choose(r, "", abbr(DAY_MONTH_ABBR))],
  ["ZZ.2", "Abreviar los tratamientos de las personas", (r) => choose(r, "", abbr(TITLE_ABBR))],
  ["ZZ.3", "Abreviar unidades de medida", (r) => choose(r, "", abbr(UNIT_ABBR))],
  ["ZZ.4", "Abreviar los nombres de las vías y los datos de una dirección", (r) => choose(r, "", abbr(STREET_ABBR))],
];
