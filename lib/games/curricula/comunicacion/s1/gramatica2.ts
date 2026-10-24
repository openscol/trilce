import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 7th grade ELA, NN-XX), con las
// reglas del castellano:
//   orden de los adjetivos → posición del adjetivo y formas cortas (buen, gran, primer)
//   good/better/best, bad/worse/worst → bueno, mejor, óptimo; malo, peor, pésimo
//   well/better/best, badly/worse/worst → bien, mejor; mal, peor
//   conjunciones correlativas → ni… ni, o… o, tanto… como, no solo… sino también
//   misplaced / dangling modifiers → modificadores mal colocados y gerundios mal usados
//   restrictive / nonrestrictive → especificativas (sin comas) y explicativas (con comas)
//   hyphens in compound adjectives → guion en adjetivos compuestos (teórico-práctico)
//   mayúsculas: días, meses, gentilicios e idiomas van con minúscula; en los
//   títulos, solo la primera palabra y los nombres propios
//   citas y diálogos: comillas angulares («») y raya (—)

export const SECTIONS: Section[] = [
  { id: "NN", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "OO", name: "Preposiciones", icon: "📦" },
  { id: "PP", name: "Objeto directo e indirecto", icon: "🎯" },
  { id: "QQ", name: "Conjunciones", icon: "🔗" },
  { id: "RR", name: "Modificadores mal colocados", icon: "🧲" },
  { id: "SS", name: "Elementos explicativos y especificativos", icon: "🔍" },
  { id: "TT", name: "Comas", icon: "❗" },
  { id: "UU", name: "Punto y coma, dos puntos y comas", icon: "⏸️" },
  { id: "VV", name: "Raya, guion y puntos suspensivos", icon: "➖" },
  { id: "WW", name: "Mayúsculas", icon: "🔠" },
  { id: "XX", name: "Formato", icon: "📝" },
];

// --- NN. Adjetivos y adverbios -----------------------------------------------

const ADJECTIVES_IN = [
  s("La vieja casona tenía balcones tallados.", "vieja", "tallados"), s("Un viento helado bajaba del nevado imponente.", "helado", "imponente"), s("Los danzantes ayacuchanos lucían trajes coloridos.", "ayacuchanos", "coloridos"),
  s("Probé un cebiche fresco y picante.", "fresco", "picante"), s("Aquella noche oscura escuchamos un grito lejano.", "oscura", "lejano"), s("La pequeña biblioteca guarda libros valiosos.", "pequeña", "valiosos"),
  s("El río turbio arrastraba ramas secas.", "turbio", "secas"), s("Mi abuela prepara un pan dulce delicioso.", "dulce", "delicioso"),
];
const ADJ_ORDER: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Fue el primer día de clases.", "Fue el primero día de clases.", "Fue el día primer de clases."), w("¿Qué oración está bien escrita?", "Es un buen amigo.", "Es un bueno amigo.", "Es un amigo buen."),
  w("¿Qué oración está bien escrita?", "Fue un gran día.", "Fue un grande día.", "Fue un día gran."), w("¿Qué oración está bien escrita?", "Algún día viajaré a Iquitos.", "Alguno día viajaré a Iquitos.", "Día algún viajaré a Iquitos."),
  w("¿Qué oración está bien escrita?", "Compré tres mantas andinas muy abrigadoras.", "Compré andinas tres mantas muy abrigadoras.", "Compré mantas tres abrigadoras muy andinas."), w("¿Qué oración está bien escrita?", "Vive en el tercer piso.", "Vive en el tercero piso.", "Vive en el piso tercer."),
  w("¿Qué significa «un gran hombre»?", "Un hombre admirable", "Un hombre muy alto", "Un hombre gordo"), w("¿Qué significa «un hombre grande»?", "Un hombre de gran tamaño", "Un hombre admirable", "Un hombre viejo"),
  w("¿Qué significa «cierta noticia»?", "Una noticia determinada", "Una noticia verdadera", "Una noticia falsa"), w("¿Qué significa «una noticia cierta»?", "Una noticia verdadera", "Una noticia determinada", "Una noticia antigua"),
];
const ADVERBS_IN = [
  s("Mañana saldremos muy temprano.", "Mañana", "muy", "temprano"), s("Nunca había caminado tan lejos.", "Nunca", "tan", "lejos"), s("Quizás llueva hoy.", "Quizás", "hoy"),
  s("Allí también venden emoliente.", "Allí", "también"), s("Casi siempre almorzamos aquí.", "Casi", "siempre", "aquí"), s("Respondió rápidamente y bien.", "rápidamente", "bien"),
  s("Todavía no ha llegado el bus.", "Todavía", "no"), s("Después caminamos lentamente.", "Después", "lentamente"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("El cóndor vuela ___ sobre el cañón.", "majestuosamente", "majestuoso", "majestuosidad"), f("Es un vuelo ___.", "majestuoso", "majestuosamente", "majestuosidad"),
  f("La niña respondió ___.", "correctamente", "correcta", "corrección"), f("Fue una respuesta ___.", "correcta", "correctamente", "corregir"),
  f("Los obreros trabajaron ___.", "intensamente", "intensos", "intensidad"), f("Tuvimos un día ___.", "intenso", "intensamente", "intensificar"),
  f("Canta muy ___.", "bien", "bueno", "buena"), f("Su comportamiento fue ___.", "malo", "mal", "malamente"),
];
const AA = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ...["Tomé un café RÁPIDO.", "Es un camino LARGO.", "Hay BASTANTE comida.", "Tiene una voz SUAVE.", "Lleva una vida TRANQUILA.", "Es un niño ALTO."].map((x) => AA(x, 0)),
  ...["Caminó RÁPIDO.", "Habló LARGO y tendido.", "Comió BASTANTE.", "Pisa SUAVE para no despertarlo.", "Duerme TRANQUILO.", "Habla ALTO."].map((x) => AA(x, 1)),
];
const COMP_SUP_ADJ: ChoiceItem[] = [
  f("El Titicaca es ___ grande que el lago Junín.", "más", "muy", "el más"), f("El Huascarán es la montaña ___ alta del Perú.", "más", "muy", "tan"),
  f("Mi pueblo es ___ tranquilo como el tuyo.", "tan", "más", "el más"), f("Este camino es ___ peligroso que el otro.", "menos", "tan", "poco"),
  f("La sopa estaba ___: me quemé la lengua.", "calientísima", "calentísima", "más caliente que"), f("De todas mis primas, Ana es ___ alegre.", "la más", "más", "tan"),
  f("El viaje a Iquitos fue ___.", "larguísimo", "largísimo", "más largo que"), f("Este examen es ___ difícil que el de ayer.", "más", "el más", "muy"),
];
const GOOD_BAD: ChoiceItem[] = [
  f("Tu dibujo es ___ que el mío.", "mejor", "más bueno", "bien"), f("Fue el ___ partido de la temporada: perdimos cinco a cero.", "peor", "más malo", "más peor"),
  f("De todas las empanadas, esta es la ___.", "mejor", "más mejor", "buena"), f("El servicio fue ___: nadie nos atendió.", "pésimo", "peorísimo", "más peor"),
  f("La cosecha de este año fue ___: la mejor posible.", "óptima", "mejorísima", "más"), f("Hoy el tráfico está ___ que ayer.", "peor", "más peor", "mal"),
  f("Es un ___ momento para empezar.", "buen", "bueno", "bien"), f("Tuvo un ___ día: se le perdió el celular.", "mal", "malo", "malamente"),
];
const COMP_SUP_ADV: ChoiceItem[] = [
  f("Llegó ___ tarde que su hermano.", "más", "muy", "tan"), f("Corre tan rápido ___ un venado.", "como", "que", "de"),
  f("De todos, Pedro es quien habla ___ despacio.", "más", "muy", "tan"), f("La casa de mi tía queda ___.", "cerquísima", "cercaísima", "más cerca que"),
  f("Ahora estudia ___ seriamente que antes.", "más", "muy", "tanto"), f("Vino lo ___ pronto que pudo.", "más", "muy", "tan"),
  f("Hoy amaneció ___ temprano que ayer.", "menos", "tan", "poco"), f("Se fue ___: antes del amanecer.", "tempranísimo", "tempranoísimo", "más temprano que"),
];
const WELL_BADLY: ChoiceItem[] = [
  f("Hoy bailaste ___ que nunca.", "mejor", "más bien", "bueno"), f("Dormí ___ que anoche: hacía mucho frío.", "peor", "más mal", "malo"),
  f("Es quien ___ toca la quena del grupo.", "mejor", "más bien", "buen"), f("Lo explicaste muy ___.", "bien", "bueno", "buen"),
  f("El equipo jugó ___ y perdió.", "mal", "malo", "mala"), f("De todos, fue quien ___ cantó: desafinó todo el tiempo.", "peor", "más mal", "pésimo"),
  f("Cuanto más ensaya, ___ canta.", "mejor", "más bueno", "bien"), f("Habla inglés tan ___ como su profesora.", "bien", "buena", "mejor"),
];

// --- OO. Preposiciones ---------------------------------------------------------

const PREP = "¿Cuál es la frase con preposición de la oración?";
const PREP_PHRASE: ChoiceItem[] = [
  pt(PREP, "Los turistas caminaron por la orilla.", "por la orilla", "Los turistas caminaron", "caminaron"), pt(PREP, "Mi abuela vive en Ayacucho.", "en Ayacucho", "Mi abuela vive", "vive"),
  pt(PREP, "El gato durmió sobre el tejado.", "sobre el tejado", "El gato durmió sobre", "durmió"), pt(PREP, "Compré un regalo para mi madre.", "para mi madre", "Compré un regalo", "un regalo"),
  pt(PREP, "Salimos después de la misa.", "después de la misa", "Salimos", "la misa"), pt(PREP, "El niño de la gorra roja ganó.", "de la gorra roja", "El niño", "ganó"),
  pt(PREP, "Mis primos llegaron desde Tumbes.", "desde Tumbes", "Mis primos llegaron", "llegaron"), pt(PREP, "La carta estaba entre los libros.", "entre los libros", "La carta", "estaba"),
];

// --- PP. Objeto directo e indirecto --------------------------------------------

const OD = sorter(["Objeto directo", "Objeto indirecto"], "La parte en MAYÚSCULAS, ¿es objeto directo u objeto indirecto?");
const OBJECTS: ChoiceItem[] = [
  ...["Mi abuela tejió UNA CHOMPA.", "Los niños vieron A SU PROFESORA en el mercado.", "Compramos PAN CON CHICHARRÓN.", "El alcalde inauguró EL PUENTE.", "Escuché UN HUAINO."].map((x) => OD(x, 0)),
  ...["Mi abuela tejió una chompa A SU NIETO.", "Le entregué el informe AL DIRECTOR.", "Les compramos pan A LOS VECINOS.", "El alcalde dio un discurso A LOS VECINOS.", "Le dediqué un huaino A MI MADRE."].map((x) => OD(x, 1)),
];

// --- QQ. Conjunciones -----------------------------------------------------------

const CORRELATIVE_PAIR: ChoiceItem[] = [
  f("___ estudias ___ no aprobarás.", "O… o", "Ni… ni", "Tanto… como"), f("___ el padre ___ la madre asistieron a la reunión.", "Tanto… como", "O… o", "Ni… o"),
  f("No vino ___ Rosa ___ su hermano.", "ni… ni", "o… o", "tanto… como"), f("___ es inteligente, ___ también muy trabajadora.", "No solo… sino", "Ni… ni", "O… o"),
  f("___ vamos al cine ___ nos quedamos en casa.", "O… o", "Tanto… como", "Ni… ni"), f("Le gusta ___ la marinera ___ el huaino.", "tanto… como", "ni… ni", "o… sino"),
  f("___ quiere comer ___ quiere dormir.", "Ni… ni", "Tanto… como", "No solo… sino"), f("Visitamos ___ Cusco, ___ también Puno.", "no solo… sino", "ni… ni", "o… o"),
];

// --- RR. Modificadores mal colocados ---------------------------------------------

const PIC = "¿Qué oración describe correctamente el dibujo?";
const MISPLACED_PICS: ChoiceItem[] = [
  { pic: "🐕🧑‍🦯", p: PIC, a: "El señor con lentes oscuros paseaba al perro.", d: ["El señor paseaba al perro con lentes oscuros.", "Con lentes oscuros, el perro paseaba al señor."] },
  { pic: "👵🛍️🍞", p: PIC, a: "La señora compró pan con una bolsa de tela.", d: ["La señora compró pan con bolsa de tela dentro.", "Con una bolsa de tela, el pan compró a la señora."] },
  { pic: "🚲👧🧺", p: PIC, a: "Se vende bicicleta con canasta para niña.", d: ["Se vende bicicleta para niña con canasta.", "Se vende niña con canasta para bicicleta."] },
  { pic: "🧑‍🍳🐟🔪", p: PIC, a: "El cocinero, con un cuchillo afilado, limpió el pescado.", d: ["El cocinero limpió el pescado con un cuchillo afilado en la boca.", "El pescado con un cuchillo limpió al cocinero."] },
  { pic: "🐈🛋️👦", p: PIC, a: "El niño vio al gato que dormía en el sofá.", d: ["Durmiendo en el sofá, el niño vio al gato.", "Durmiendo en el sofá, el gato vio al niño."] },
  { pic: "👨‍🌾🐄🥛", p: PIC, a: "El campesino ordeñó la vaca de manchas negras.", d: ["El campesino de manchas negras ordeñó la vaca.", "De manchas negras, el campesino ordeñó la vaca."] },
];
const DANGLING = "¿Qué oración tiene un modificador mal colocado o un gerundio mal usado?";
const SELECT_MISPLACED: ChoiceItem[] = [
  w(DANGLING, "Saliendo de casa, la lluvia me empapó.", "Al salir de casa, me empapó la lluvia.", "La lluvia me empapó cuando salí de casa."), w(DANGLING, "Vendo zapatos para hombre de cuero.", "Vendo zapatos de cuero para hombre.", "Vendo zapatos de cuero para caballero."),
  w(DANGLING, "Se cayó del árbol, rompiéndose la pierna al día siguiente.", "Se cayó del árbol y se rompió la pierna.", "Al caer del árbol, se rompió la pierna."), w(DANGLING, "Encontré un collar para perro de plata.", "Encontré un collar de plata para perro.", "Encontré un collar de plata para mi perro."),
  w(DANGLING, "Corriendo por el parque, el celular se me cayó.", "Mientras corría por el parque, se me cayó el celular.", "Se me cayó el celular mientras corría."), w(DANGLING, "Alquilo cuarto para estudiante amoblado.", "Alquilo cuarto amoblado para estudiante.", "Alquilo un cuarto amoblado para estudiantes."),
  w(DANGLING, "Ley regulando el tránsito.", "Ley que regula el tránsito", "Ley de regulación del tránsito"), w(DANGLING, "Siendo niño, la casa de mi abuela me parecía enorme.", "Cuando era niño, la casa de mi abuela me parecía enorme.", "Cuando yo era niño, la casa me parecía enorme."),
];
const MC = sorter(["Correcto", "Incorrecto"], "¿El modificador está bien usado?");
const MODIFIERS_OK: ChoiceItem[] = [
  ...["Compré un queso de Cajamarca para mi abuela.", "Al llegar a casa, me quité los zapatos.", "La niña que vive en la esquina canta muy bien.", "Vendo cocina a gas en buen estado.", "Cuando entré al aula, todos se callaron."].map((x) => MC(x, 0)),
  ...["Vendo cocina para señora a gas.", "Entrando al aula, todos se callaron.", "Compré un queso para mi abuela de Cajamarca.", "Caminando por la playa, la ola me mojó.", "Se busca chofer para camión con experiencia."].map((x) => MC(x, 1)),
];

// --- SS. Explicativas y especificativas -----------------------------------------

const MEANING = "¿Qué sugiere la puntuación?";
const PUNCT_MEANING: ChoiceItem[] = [
  pt(MEANING, "«Los alumnos, que viven lejos, llegaron tarde».", "Todos los alumnos viven lejos y todos llegaron tarde.", "Solo llegaron tarde los alumnos que viven lejos.", "Ningún alumno llegó tarde."),
  pt(MEANING, "«Los alumnos que viven lejos llegaron tarde».", "Solo llegaron tarde los alumnos que viven lejos.", "Todos los alumnos viven lejos y todos llegaron tarde.", "Nadie llegó."),
  pt(MEANING, "«Mi hermano, que vive en Tacna, es médico».", "Tengo un solo hermano, y vive en Tacna.", "Tengo varios hermanos; el de Tacna es médico.", "No tengo hermanos."),
  pt(MEANING, "«Mi hermano que vive en Tacna es médico».", "Tengo varios hermanos; el de Tacna es médico.", "Tengo un solo hermano, y vive en Tacna.", "Mi hermano no es médico."),
  pt(MEANING, "«Las casas, que eran de adobe, se cayeron».", "Todas las casas eran de adobe y se cayeron.", "Solo se cayeron las casas de adobe.", "No se cayó ninguna."),
  pt(MEANING, "«Las casas que eran de adobe se cayeron».", "Solo se cayeron las casas de adobe.", "Todas las casas eran de adobe y se cayeron.", "No había casas."),
];
const COMMA = "¿Qué oración tiene bien puestas las comas?";
const NONRESTRICTIVE: ChoiceItem[] = [
  w(COMMA, "El Misti, que está nevado, se ve desde la plaza.", "El Misti que está nevado, se ve desde la plaza.", "El Misti, que está nevado se ve, desde la plaza, de Arequipa."), w(COMMA, "Mi madre, que es enfermera, trabaja de noche.", "Mi madre que es enfermera, trabaja de noche.", "Mi madre, que es enfermera trabaja de noche, en el hospital."),
  w(COMMA, "Arguedas, autor de «Los ríos profundos», nació en Andahuaylas.", "Arguedas autor de «Los ríos profundos», nació en Andahuaylas.", "Arguedas, autor de «Los ríos profundos» nació en Andahuaylas."), w(COMMA, "El lago Titicaca, que comparten Perú y Bolivia, es navegable.", "El lago Titicaca que comparten Perú y Bolivia, es navegable.", "El lago Titicaca, que comparten Perú y Bolivia es navegable."),
  w(COMMA, "Los libros que me prestaste son muy buenos.", "Los libros, que me prestaste son muy buenos.", "Los libros que me prestaste, son muy buenos."), w(COMMA, "El perro que ladra de noche es del vecino.", "El perro, que ladra de noche es del vecino.", "El perro que ladra de noche, es del vecino."),
];

// --- TT. Comas -------------------------------------------------------------------

const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "Llevamos frazadas, linternas, agua y fósforos.", "Llevamos frazadas linternas agua y fósforos.", "Llevamos, frazadas, linternas, agua, y fósforos."), w(COMMA, "Recorrimos Chiclayo, Trujillo y Piura.", "Recorrimos Chiclayo Trujillo y Piura.", "Recorrimos, Chiclayo, Trujillo, y Piura."),
  w("¿Qué fecha de carta está bien escrita?", "Puno, 2 de febrero de 2027", "Puno 2 de febrero, de 2027", "Puno, 2, de febrero de 2027"), w(COMMA, "Nació en Andahuaylas, Apurímac.", "Nació en Andahuaylas Apurímac.", "Nació, en Andahuaylas Apurímac."),
  w(COMMA, "Corrió, saltó, gritó y celebró.", "Corrió saltó gritó y celebró.", "Corrió, saltó, gritó, y, celebró."), w(COMMA, "La feria será en Huancayo, Junín, en julio.", "La feria será en Huancayo Junín, en julio.", "La feria será en, Huancayo Junín en julio."),
];
const COMMA_COMPOUND: ChoiceItem[] = [
  w(COMMA, "Quería ir al concierto, pero no tenía entrada.", "Quería ir al concierto pero, no tenía entrada.", "Quería ir, al concierto pero no tenía entrada."), w(COMMA, "Si llueve mañana, suspenderemos la excursión.", "Si llueve mañana suspenderemos, la excursión.", "Si llueve, mañana suspenderemos, la excursión."),
  w(COMMA, "Cuando llegó el bus, todos subieron.", "Cuando llegó, el bus todos subieron.", "Cuando llegó el bus todos, subieron."), w(COMMA, "Estudió mucho, así que aprobó.", "Estudió mucho así, que aprobó.", "Estudió, mucho así que aprobó."),
  w(COMMA, "Aunque estaba cansada, siguió bailando.", "Aunque estaba, cansada siguió bailando.", "Aunque estaba cansada siguió, bailando."), w(COMMA, "No es de Lima, sino de Ica.", "No es de Lima sino, de Ica.", "No es, de Lima sino de Ica."),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Rosa, ven a ayudarme.", "Rosa ven, a ayudarme.", "Rosa ven a ayudarme."), w(COMMA, "Sin embargo, nadie se quejó.", "Sin embargo nadie, se quejó.", "Sin, embargo nadie se quejó."),
  w(COMMA, "¡Ay, qué susto me diste!", "¡Ay qué, susto me diste!", "¡Ay qué susto, me diste!"), w(COMMA, "El examen, según dicen, será fácil.", "El examen según, dicen será fácil.", "El examen según dicen, será fácil."),
  w(COMMA, "Bueno, empecemos la clase.", "Bueno empecemos, la clase.", "Bueno empecemos la clase,"), w(COMMA, "Gracias, profesora, por su paciencia.", "Gracias profesora, por su paciencia.", "Gracias, profesora por su paciencia."),
  w(COMMA, "Por cierto, ¿trajiste el libro?", "Por cierto ¿trajiste, el libro?", "Por, cierto ¿trajiste el libro?"), w(COMMA, "Mi tío, sin duda, es el mejor cocinero.", "Mi tío sin duda, es el mejor cocinero.", "Mi tío, sin duda es el mejor cocinero."),
];
const COMMA_ADJ: ChoiceItem[] = [
  w(COMMA, "Era una noche fría, oscura, silenciosa.", "Era una noche fría oscura silenciosa.", "Era una noche, fría, oscura, silenciosa."), w(COMMA, "Tiene una voz dulce, clara, potente.", "Tiene una voz dulce clara potente.", "Tiene, una voz dulce, clara, potente."),
  w(COMMA, "Compré una manta gruesa, suave y abrigadora.", "Compré una manta gruesa suave, y abrigadora.", "Compré, una manta gruesa, suave y abrigadora."), w(COMMA, "Es un camino largo, empinado y pedregoso.", "Es un camino largo empinado, y pedregoso.", "Es un camino, largo, empinado y pedregoso."),
  w("¿En qué oración NO van comas entre los adjetivos?", "Vi un gran cóndor andino.", "Vi un cóndor enorme, negro, majestuoso.", "Vi un ave fuerte, ágil, veloz."), w("¿En qué oración NO van comas entre los adjetivos?", "Usa una vieja chompa azul.", "Usa una chompa vieja, gastada, rota.", "Usa una chompa fea, sucia, arrugada."),
];

// --- UU. Punto y coma, dos puntos y comas --------------------------------------------

const PUNCT = "¿Qué oración está bien puntuada?";
const SEMICOLON_CLAUSES: ChoiceItem[] = [
  w(PUNCT, "Estudió toda la noche; sin embargo, no aprobó.", "Estudió toda la noche, sin embargo no aprobó.", "Estudió toda la noche sin embargo; no aprobó."), w(PUNCT, "El norte es cálido; el sur, frío.", "El norte es cálido, el sur; frío.", "El norte es cálido el sur, frío."),
  w(PUNCT, "Llovió mucho; por lo tanto, se suspendió el partido.", "Llovió mucho, por lo tanto se suspendió el partido.", "Llovió mucho por lo tanto; se suspendió el partido."), w(PUNCT, "Unos bailaban; otros, cantaban.", "Unos bailaban, otros; cantaban.", "Unos; bailaban otros cantaban."),
  w(PUNCT, "Se cortó la luz; tuvimos que usar velas.", "Se cortó la luz, tuvimos que usar velas.", "Se cortó; la luz tuvimos que usar velas."), w(PUNCT, "Ana prefiere la costa; su hermano, la sierra.", "Ana prefiere la costa, su hermano; la sierra.", "Ana prefiere; la costa su hermano la sierra."),
];
const SEMICOLON_LISTS: ChoiceItem[] = [
  w(PUNCT, "Necesitamos tres cosas: agua, comida y abrigo.", "Necesitamos tres cosas, agua, comida y abrigo.", "Necesitamos: tres cosas agua, comida y abrigo."), w(PUNCT, "Viajaron a Cusco, la capital histórica; Puno, la del folclore; y Arequipa, la Ciudad Blanca.", "Viajaron a Cusco, la capital histórica, Puno, la del folclore, y Arequipa, la Ciudad Blanca.", "Viajaron a: Cusco la capital histórica; Puno la del folclore y Arequipa la Ciudad Blanca."),
  w(PUNCT, "Hubo tres ganadoras: Rosa, de Tacna; Ana, de Piura; y Lucía, de Cusco.", "Hubo tres ganadoras: Rosa, de Tacna, Ana, de Piura, y Lucía, de Cusco.", "Hubo tres ganadoras; Rosa de Tacna, Ana de Piura y Lucía de Cusco."), w(PUNCT, "Lleva lo siguiente: cuaderno, lápiz y regla.", "Lleva lo siguiente cuaderno, lápiz y regla.", "Lleva: lo siguiente; cuaderno, lápiz y regla."),
  w(PUNCT, "Hay tres regiones: costa, sierra y selva.", "Hay tres regiones; costa, sierra y selva.", "Hay: tres regiones, costa, sierra, y selva."), w("¿Qué oración NO debe llevar dos puntos?", "Compré pan, queso y leche.", "Compré tres cosas: pan, queso y leche.", "Lo dijo claro: no vendrá."),
];

// --- VV. Raya, guion y puntos suspensivos ----------------------------------------------

const DASHES: ChoiceItem[] = [
  w("¿Qué oración usa bien la raya?", "Mi abuelo —que tiene noventa años— todavía siembra.", "Mi abuelo -que tiene noventa años todavía siembra.", "Mi abuelo — que tiene noventa años, todavía siembra."), w("¿Qué diálogo está bien escrito?", "—¿Vienes mañana? —preguntó Rosa.", "-¿Vienes mañana? -preguntó Rosa.", "¿Vienes mañana? — preguntó Rosa —"),
  w("¿Qué oración usa bien la raya?", "Llegaron todos —incluso el director— a la ceremonia.", "Llegaron todos —incluso el director a la ceremonia.", "Llegaron todos, —incluso el director—, a la ceremonia,"), w("¿Qué diálogo está bien escrito?", "—Ya voy —respondió Luis—, espérame.", "—Ya voy, respondió Luis, espérame.", "-Ya voy -respondió Luis-, espérame-"),
  w("¿Para qué sirve la raya en «El Misti —volcán activo— domina Arequipa»?", "Para encerrar una aclaración", "Para unir dos palabras compuestas", "Para indicar una resta"), w("¿Qué diálogo está bien escrito?", "—No sé —dijo él.", "—No sé —dijo él—.", "—No sé— dijo él."),
];
const HYPHENS: ChoiceItem[] = [
  w("¿Qué está bien escrito?", "un curso teórico-práctico", "un curso teórico práctico", "un curso teóricopráctico"), w("¿Qué está bien escrito?", "un acuerdo peruano-chileno", "un acuerdo peruano chileno", "un acuerdo peruanochileno"),
  w("¿Qué está bien escrito?", "un estudio económico-social", "un estudio económico social", "un estudio económicosocial"), w("¿Qué está bien escrito?", "la frontera ecuatoriano-peruana", "la frontera ecuatoriano peruana", "la frontera ecuatorianoperuana"),
  w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "un problema sociocultural", "un problema socio-cultural", "un problema socio cultural"), w("¿Qué está bien escrito? (adjetivo compuesto que ya es una sola palabra)", "los países hispanohablantes", "los países hispano-hablantes", "los países hispano hablantes"),
  w("¿Qué está bien escrito?", "una relación calidad-precio", "una relación calidad precio", "una relación calidadprecio"), w("¿Qué está bien escrito?", "un hecho histórico-político", "un hecho histórico político", "un hecho históricopolítico"),
];
const ELLIPSIS: ChoiceItem[] = [
  w("¿En qué oración los puntos suspensivos están bien usados?", "Abrí la puerta y… no había nadie.", "Abrí… la… puerta…", "Abrí… la puerta… y… no… había… nadie."), w("¿En qué oración los puntos suspensivos están bien usados?", "Compramos papas, ollucos, ocas…", "Compramos papas, ollucos, ocas, etc…", "Compramos… papas."),
  w("¿En qué oración los puntos suspensivos están bien usados?", "Quería decirte que… mejor no.", "Quería… decirte.", "Quería… decirte… que mejor… no."), w("¿En qué oración los puntos suspensivos están bien usados?", "«Más vale tarde…», dijo mi abuela.", "«Más vale tarde que nunca…….», dijo.", "«Más… vale… tarde», dijo… mi abuela."),
  w("¿Qué indican los puntos suspensivos en «Si yo te contara…»?", "Que algo queda sin decir", "Que la oración es una pregunta", "Que termina el texto"), w("¿Qué indica «[…]» en una cita?", "Que se ha omitido parte del texto citado", "Que el autor estaba dudando", "Que la cita es falsa"),
];

// --- WW. Mayúsculas --------------------------------------------------------------

const CAPS = "¿Qué oración está bien escrita?";
const CAPS_ERRORS: ChoiceItem[] = [
  w(CAPS, "El lunes 28 de julio celebramos la Independencia.", "El Lunes 28 de Julio celebramos la independencia.", "el lunes 28 de julio celebramos la independencia."), w(CAPS, "Mi profesora de inglés es arequipeña.", "Mi profesora de Inglés es Arequipeña.", "Mi Profesora de inglés es arequipeña."),
  w(CAPS, "Visitamos el lago Titicaca en Puno.", "Visitamos el Lago titicaca en puno.", "visitamos el lago titicaca en Puno."), w(CAPS, "El presidente del Perú viajó a Brasil.", "El Presidente del perú viajó a brasil.", "El presidente del perú viajó a Brasil."),
  w(CAPS, "En otoño leímos «Los ríos profundos».", "En Otoño leímos «Los Ríos Profundos».", "en otoño leímos «los ríos profundos»."), w(CAPS, "La Biblioteca Nacional del Perú está en San Borja.", "La biblioteca nacional del Perú está en san Borja.", "La Biblioteca nacional del perú está en San borja."),
  w(CAPS, "Los incas adoraban al dios Inti.", "Los Incas adoraban al Dios inti.", "los incas adoraban al dios inti."), w(CAPS, "El río Rímac atraviesa Lima.", "El Río rímac atraviesa lima.", "el río Rímac atraviesa Lima."),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título está bien escrito?", "Cien años de soledad", "Cien Años De Soledad", "cien años de soledad"), w("¿Qué título está bien escrito?", "La ciudad y los perros", "La Ciudad y los Perros", "la ciudad y los perros"),
  w("¿Qué título está bien escrito?", "El mundo es ancho y ajeno", "El Mundo Es Ancho y Ajeno", "el mundo es ancho y ajeno"), w("¿Qué título está bien escrito?", "Los heraldos negros", "Los Heraldos Negros", "los heraldos negros"),
  w("¿Qué título está bien escrito?", "Historia de la República del Perú", "Historia De La República Del Perú", "historia de la república del perú"), w("¿Qué título está bien escrito?", "Un mundo para Julius", "Un Mundo Para Julius", "un mundo para Julius"),
  w("En un título en castellano, ¿qué palabras llevan mayúscula?", "La primera y los nombres propios", "Todas las palabras importantes", "Ninguna"), w("¿Qué título está bien escrito?", "El zorro de arriba y el zorro de abajo", "El Zorro de Arriba y el Zorro de Abajo", "el zorro de arriba y el zorro de abajo"),
];

// --- XX. Formato -------------------------------------------------------------------

const FORMAT_TITLES: ChoiceItem[] = [
  w("En un texto digitado, ¿cómo se escribe el título de un libro?", "En cursiva", "Entre comillas", "En negrita"), w("¿Cómo se escribe el título de un cuento dentro de un libro?", "Entre comillas", "En cursiva", "Subrayado"),
  w("¿Cómo se escribe el nombre de una revista?", "En cursiva", "Entre comillas", "Entre paréntesis"), w("¿Cómo se escribe el título de una canción?", "Entre comillas", "En cursiva", "En negrita"),
  w("¿Cómo se escribe el título de un artículo de periódico?", "Entre comillas", "En cursiva", "En mayúsculas"), w("¿Cómo se escribe el título de una obra de teatro?", "En cursiva", "Entre comillas", "En negrita"),
  w("¿Cómo se escribe el título de un poema de un poemario?", "Entre comillas", "En cursiva", "Subrayado"), w("¿Cómo se escribe el nombre de una serie de televisión?", "En cursiva", "Entre comillas", "Entre corchetes"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí _Los ríos profundos_ en vacaciones.", "Leí «Los Ríos Profundos» en vacaciones.", "Leí _Los Ríos Profundos_ en vacaciones."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Recité «Masa», de César Vallejo.", "Recité _Masa_, de César Vallejo.", "Recité «masa», de César Vallejo."),
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Compré _El Comercio_ en el quiosco.", "Compré «el comercio» en el quiosco.", "Compré «El Comercio» en el quiosco."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Cantamos «La flor de la canela».", "Cantamos _La Flor De La Canela_.", "Cantamos «La Flor de la Canela»."),
  w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Vimos la obra _Ollantay_ en el teatro.", "Vimos la obra «ollantay» en el teatro.", "Vimos la obra _ollantay_ en el teatro."), w("¿Qué está bien escrito? (La cursiva se indica con _guiones bajos_).", "Leí «El caballero Carmelo» en _Cuentos peruanos_.", "Leí _El caballero Carmelo_ en «Cuentos peruanos».", "Leí «El Caballero Carmelo» en _Cuentos Peruanos_."),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Av. Grau 450, Piura", "av. grau 450 piura", "Av. grau, 450, piura"), w("¿Qué dirección está bien escrita?", "Jr. Lampa 820, of. 301, Cercado de Lima", "jr. lampa 820 of. 301 cercado de lima", "Jr. lampa, 820 of. 301 Cercado de lima"),
  w("¿Qué dirección está bien escrita?", "Ca. Mercaderes 115, Arequipa", "ca. mercaderes 115 arequipa", "Ca. mercaderes, 115 arequipa"), w("¿Qué dirección está bien escrita?", "Prolongación Tacna 230, int. 2, Iquitos", "prolongación tacna 230 int. 2 iquitos", "Prolongación tacna, 230, int. 2 iquitos"),
  w("¿Qué dirección está bien escrita?", "Urb. Santa Rosa, Mz. C, Lt. 12, Chiclayo", "urb. santa rosa mz. c lt. 12 chiclayo", "Urb. santa Rosa, mz. C, lt. 12 chiclayo"), w("¿Qué significa «Jr.» en una dirección?", "Jirón", "Junior", "Jardín"),
  w("¿Qué significa «Mz.» en una dirección?", "Manzana", "Mezanine", "Mayorazgo"), w("¿Qué significa «s/n» en una dirección?", "Sin número", "Sin nombre", "Sur-norte"),
];
const QUOTES: ChoiceItem[] = [
  w("¿Qué cita está bien escrita?", "Mi abuela siempre dice: «El que madruga, Dios lo ayuda».", "Mi abuela siempre dice: El que madruga, Dios lo ayuda.", "Mi abuela siempre dice «el que madruga, Dios lo ayuda»"), w("¿Qué diálogo está bien escrito?", "—¿A qué hora sale el bus? —preguntó Pedro.", "«¿A qué hora sale el bus?» preguntó Pedro —", "-¿A qué hora sale el bus? Preguntó Pedro."),
  w("¿Qué cita está bien escrita?", "Vallejo escribió: «Hay golpes en la vida, tan fuertes… ¡Yo no sé!».", "Vallejo escribió: hay golpes en la vida, tan fuertes… ¡Yo no sé!", "Vallejo escribió «Hay golpes en la vida, tan fuertes… ¡yo no sé!»"), w("¿Qué diálogo está bien escrito?", "—Ya llegamos —dijo mamá—. Bajen con cuidado.", "—Ya llegamos —dijo mamá. —Bajen con cuidado.", "—Ya llegamos, dijo mamá, bajen con cuidado."),
  w("¿Dónde va el punto en una cita entre comillas que cierra la oración?", "Después de las comillas de cierre: «…».", "Antes de las comillas de cierre: «….»", "No lleva punto, porque las comillas ya cierran la oración."), w("¿Qué comillas se recomiendan primero en castellano?", "Las angulares: « »", "Las simples: ‘ ’", "Los paréntesis: ( )"),
];

export const ROWS: Row[] = [
  ["NN.1", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos de la oración.", ADJECTIVES_IN)],
  ["NN.2", "Ordenar los adjetivos: su lugar y sus formas cortas", (r) => choose(r, "", ADJ_ORDER)],
  ["NN.3", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios de la oración.", ADVERBS_IN)],
  ["NN.4", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["NN.5", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],
  ["NN.6", "Formar y usar adjetivos comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADJ)],
  ["NN.7", "Bueno, mejor, óptimo; malo, peor, pésimo", (r) => choose(r, "Completa la oración.", GOOD_BAD)],
  ["NN.8", "Formar y usar adverbios comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADV)],
  ["NN.9", "Bien, mejor; mal, peor", (r) => choose(r, "Completa la oración.", WELL_BADLY)],

  ["OO.1", "Identificar frases con preposición", (r) => choose(r, "", PREP_PHRASE)],

  ["PP.1", "¿Es un objeto directo o un objeto indirecto?", (r) => choose(r, "", OBJECTS)],

  ["QQ.1", "Usar el par correcto de conjunciones correlativas", (r) => choose(r, "Completa la oración.", CORRELATIVE_PAIR)],

  ["RR.1", "Modificadores mal colocados, con dibujos", (r) => choose(r, "", MISPLACED_PICS)],
  ["RR.2", "Elegir el modificador mal colocado o el gerundio mal usado", (r) => choose(r, "", SELECT_MISPLACED)],
  ["RR.3", "¿Los modificadores están bien usados?", (r) => choose(r, "", MODIFIERS_OK)],

  ["SS.1", "¿Qué sugiere la puntuación?", (r) => choose(r, "", PUNCT_MEANING)],
  ["SS.2", "Comas en los elementos explicativos", (r) => choose(r, "", NONRESTRICTIVE)],

  ["TT.1", "Comas en enumeraciones, fechas y lugares", (r) => choose(r, "", COMMA_SERIES)],
  ["TT.2", "Comas en oraciones compuestas", (r) => choose(r, "", COMMA_COMPOUND)],
  ["TT.3", "Comas con vocativos, palabras introductorias, interjecciones e incisos", (r) => choose(r, "", COMMA_ADDRESS)],
  ["TT.4", "Comas entre adjetivos coordinados", (r) => choose(r, "", COMMA_ADJ)],
  ["TT.5", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_COMPOUND, ...COMMA_ADDRESS, ...COMMA_ADJ])],

  ["UU.1", "Usar punto y coma y comas para separar proposiciones", (r) => choose(r, "", SEMICOLON_CLAUSES)],
  ["UU.2", "Usar punto y coma, dos puntos y comas en enumeraciones", (r) => choose(r, "", SEMICOLON_LISTS)],

  ["VV.1", "Usar la raya", (r) => choose(r, "", DASHES)],
  ["VV.2", "Usar el guion en adjetivos compuestos", (r) => choose(r, "", HYPHENS)],
  ["VV.3", "Decidir si los puntos suspensivos están bien usados", (r) => choose(r, "", ELLIPSIS)],

  ["WW.1", "Corregir errores de mayúsculas", (r) => choose(r, "", CAPS_ERRORS)],
  ["WW.2", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],

  ["XX.1", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["XX.2", "Dar formato y poner mayúsculas a los títulos: repaso", (r) => choose(r, "", TITLES_BOTH)],
  ["XX.3", "Dar formato a las direcciones", (r) => choose(r, "", ADDRESSES)],
  ["XX.4", "Dar formato a las citas y a los diálogos", (r) => choose(r, "", QUOTES)],
];
