import { choose, chooseAll, mix, order, pickAll, type ChoiceItem, type MultiItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Rng } from "../../../rng";
import type { Question } from "../../../types";
import type { Row } from "./row";

// 2.° de Primaria · banco de vocabulario: prefijos pre-, re-, des-, in- y
// sufijo -oso, palabras compuestas, categorías, sinónimos y antónimos,
// homófonos, matices, expresiones, contexto y uso del diccionario.


// --- Prefijos y sufijos -----------------------------------------------------------

const ENDINGS: ChoiceItem[] = [
  { say: "cantando", t: "cant___", a: "ando", d: ["aba", "ado", "amos"] },
  { say: "comiendo", t: "com___", a: "iendo", d: ["ido", "ía", "ieron"] },
  { say: "casita", t: "cas___", a: "ita", d: ["ota", "ero", "ona"] },
  { say: "zapatero", t: "zapat___", a: "ero", d: ["ito", "ón", "ería"] },
  { say: "perrazo", t: "perr___", a: "azo", d: ["ito", "era", "uno"] },
  { say: "jugaba", t: "jug___", a: "aba", d: ["ando", "ado", "ará"] },
  { say: "librería", t: "libr___", a: "ería", d: ["ero", "ito", "erío"] },
  { say: "lluvioso", t: "lluvi___", a: "oso", d: ["ita", "ero", "ando"] },
  { say: "rápidamente", t: "rápida___", a: "mente", d: ["dora", "ción", "miento"] },
];

const PARTS: ChoiceItem[] = [
  { p: "¿Cuál es el prefijo de «deshacer»?", a: "des-", d: ["hacer", "-cer", "desha-"] },
  { p: "¿Cuál es la palabra base de «zapatero»?", a: "zapato", d: ["-ero", "zapa", "tero"] },
  { p: "¿Cuál es el sufijo de «florero»?", a: "-ero", d: ["flor", "flo-", "-rero"] },
  { p: "¿Cuál es el prefijo de «releer»?", a: "re-", d: ["leer", "rel-", "-er"] },
  { p: "¿Cuál es la palabra base de «infeliz»?", a: "feliz", d: ["in-", "infe", "-liz"] },
  { p: "¿Cuál es el sufijo de «casita»?", a: "-ita", d: ["casa", "ca-", "-sita"] },
  { p: "¿Cuál es la palabra base de «desordenar»?", a: "ordenar", d: ["des-", "desor", "-nar"] },
  { p: "¿Cuál es el sufijo de «lluvioso»?", a: "-oso", d: ["lluvia", "llu-", "-vioso"] },
  { p: "¿Cuál es el prefijo de «prehistoria»?", a: "pre-", d: ["historia", "-ia", "prehis-"] },
];

const PREFIX_MEANING: ChoiceItem[] = [
  { p: "¿Qué significa «releer»?", a: "Leer otra vez", d: ["No leer", "Leer mucho antes", "Leer mal"] },
  { p: "¿Qué significa «deshacer»?", a: "Lo contrario de hacer", d: ["Hacer todo otra vez", "Hacer antes", "Hacer mucho"] },
  { p: "¿Qué significa «precalentar»?", a: "Calentar antes", d: ["Calentar otra vez", "No calentar", "Enfriar"] },
  { p: "¿Qué significa «rehacer»?", a: "Hacer otra vez", d: ["No hacer", "Hacer mucho antes", "Hacer poco"] },
  { p: "¿Qué significa «desordenar»?", a: "Lo contrario de ordenar", d: ["Ordenar todo otra vez", "Ordenar antes", "Ordenar bien"] },
  { p: "¿Qué significa «prelavado»?", a: "Lavado que se hace antes", d: ["Lavado que se repite mucho", "Sin lavar", "Lavado final"] },
  { p: "¿Qué significa «reabrir»?", a: "Abrir otra vez", d: ["Cerrar", "Abrir mucho antes", "No abrir"] },
  { p: "¿Qué significa «destapar»?", a: "Quitar la tapa", d: ["Tapar otra vez", "Tapar antes", "Tapar bien"] },
];

const PREFIX_USE: ChoiceItem[] = [
  { t: "No entendí la página; la voy a ___.", a: "releer", d: ["desleer", "preleer", "leerre"] },
  { t: "El nudo está muy apretado; no lo puedo ___.", a: "desatar", d: ["reatar", "preatar", "atarre"] },
  { t: "Antes de hornear, hay que ___ el horno.", a: "precalentar", d: ["descalentar", "recalentar", "calentarpre"] },
  { t: "La tienda cerró ayer y hoy va a ___.", a: "reabrir", d: ["desabrir", "preabrir", "abrirre"] },
  { t: "La botella está cerrada; la voy a ___.", a: "destapar", d: ["retapar", "pretapar", "taparde"] },
  { t: "El dibujo salió mal; lo voy a ___.", a: "rehacer", d: ["prehacer", "deshacerre", "hacerre"] },
  { t: "Limpié mi cuarto; por favor, no lo vayas a ___.", a: "desordenar", d: ["reordenar", "preordenar", "ordenarde"] },
  { t: "Los dinosaurios vivieron en la ___.", a: "prehistoria", d: ["rehistoria", "deshistoria", "historiapre"] },
];

const SUFFIX_MEANING: ChoiceItem[] = [
  { p: "¿Qué significa «lluvioso»?", a: "Con mucha lluvia", d: ["Sin lluvia", "Antes de la lluvia", "Lluvia pequeña"] },
  { p: "¿Qué significa «incompleto»?", a: "Que no está completo", d: ["Muy completo", "Completo otra vez", "Casi completo"] },
  { p: "¿Qué significa «miedoso»?", a: "Que tiene miedo", d: ["Que no tiene miedo", "Que da miedo antes", "Miedo pequeño"] },
  { p: "¿Qué significa «invisible»?", a: "Que no se puede ver", d: ["Que se ve muy bien", "Que se ve otra vez", "Que se ve antes"] },
  { p: "¿Qué significa «ruidoso»?", a: "Que hace mucho ruido", d: ["Que no hace ruido", "Ruido pequeño", "Antes del ruido"] },
  { p: "¿Qué significa «incómodo»?", a: "Que no es cómodo", d: ["Muy cómodo", "Cómodo otra vez", "Un poco cómodo"] },
  { p: "¿Qué significa «cariñoso»?", a: "Que da mucho cariño", d: ["Sin cariño", "Cariño pequeño", "Antes del cariño"] },
  { p: "¿Qué significa «injusto»?", a: "Que no es justo", d: ["Muy justo", "Justo otra vez", "Casi justo"] },
];

// --- Palabras compuestas ----------------------------------------------------------

const COMPOUND_PIC: ChoiceItem[] = [
  { pic: "☂️", t: "para + ___", a: "aguas", d: ["sol", "brisas", "caídas"] },
  { pic: "🌻", t: "gira + ___", a: "sol", d: ["luna", "flor", "agua"] },
  { pic: "🕸️", t: "tela + ___", a: "araña", d: ["mosca", "hilo", "pared"] },
  { pic: "✏️", t: "saca + ___", a: "puntas", d: ["corchos", "muelas", "lápices"] },
  { pic: "🎂", t: "cumple + ___", a: "años", d: ["días", "meses", "fiestas"] },
  { pic: "🧩", t: "rompe + ___", a: "cabezas", d: ["olas", "hielos", "piezas"] },
  { pic: "🦗", t: "salta + ___", a: "montes", d: ["ríos", "cerros", "pastos"] },
  { pic: "🥫", t: "abre + ___", a: "latas", d: ["puertas", "cartas", "cajas"] },
];

const COMPOUND_FORM: ChoiceItem[] = [
  { p: "¿Qué palabra compuesta se forma?", t: "lava + manos", a: "lavamanos", d: ["manoslava", "lavamano", "lavarmanos"] },
  { p: "¿Qué palabra compuesta se forma?", t: "medio + día", a: "mediodía", d: ["díamedio", "mediadía", "mediodías"] },
  { p: "¿Qué palabra compuesta se forma?", t: "pasa + tiempo", a: "pasatiempo", d: ["tiempopasa", "pasartiempo", "pasotiempo"] },
  { p: "¿Qué palabra compuesta se forma?", t: "espanta + pájaros", a: "espantapájaros", d: ["pájarosespanta", "espantarpájaro", "espantopájaros"] },
  { p: "¿Qué palabra compuesta se forma?", t: "para + caídas", a: "paracaídas", d: ["caídaspara", "pararcaídas", "paracaer"] },
  { p: "¿Qué palabra compuesta se forma?", t: "boca + calle", a: "bocacalle", d: ["calleboca", "bocalle", "bocascalles"] },
  { p: "¿Qué dos palabras forman «sacacorchos»?", a: "saca + corchos", d: ["sacar + corcho", "sac + acorchos", "saco + corchos"] },
  { p: "¿Qué dos palabras forman «pelirrojo»?", a: "pelo + rojo", d: ["peli + rojo", "pelirro + jo", "pela + rojo"] },
];

const COMPOUND_USE: ChoiceItem[] = [
  { t: "Le saqué punta al lápiz con el ___.", a: "sacapuntas", d: ["sacacorchos", "abrelatas", "paraguas"] },
  { t: "Llovía y abrí mi ___.", a: "paraguas", d: ["parasol", "paracaídas", "parabrisas"] },
  { t: "Armé un ___ de cien piezas.", a: "rompecabezas", d: ["rompeolas", "sacapuntas", "pasamanos"] },
  { t: "Almorzamos al ___, cuando el sol está alto.", a: "mediodía", d: ["medianoche", "cumpleaños", "pasatiempo"] },
  { t: "El ___ cuida el campo de los pájaros.", a: "espantapájaros", d: ["saltamontes", "rompecabezas", "paracaídas"] },
  { t: "Mañana es mi ___ y cumplo ocho.", a: "cumpleaños", d: ["mediodía", "pasatiempo", "abrelatas"] },
  { t: "Abrí la lata de atún con el ___.", a: "abrelatas", d: ["sacapuntas", "lavamanos", "paraguas"] },
  { t: "Sube la escalera agarrado del ___.", a: "pasamanos", d: ["lavamanos", "pasatiempo", "sacacorchos"] },
];

// --- Categorías ---------------------------------------------------------------------

const CATEGORIES: Record<string, string[]> = {
  "los animales": ["puma", "cóndor", "alpaca", "delfín", "tortuga", "zorro"],
  "las frutas": ["mango", "papaya", "lúcuma", "fresa", "piña", "uva"],
  "las prendas de vestir": ["chompa", "pantalón", "medias", "gorro", "falda", "casaca"],
  "los útiles escolares": ["cuaderno", "regla", "borrador", "tajador", "lápiz", "plumón"],
  "los medios de transporte": ["bus", "tren", "barco", "avión", "bicicleta", "mototaxi"],
  "los instrumentos musicales": ["guitarra", "cajón", "quena", "flauta", "tambor", "charango"],
};

function sortCategory(r: Rng): Question {
  const names = Object.keys(CATEGORIES);
  const c = r.pick(names);
  const others = names.filter((n) => n !== c).flatMap((n) => CATEGORIES[n]);
  return pickAll(r, `Selecciona ${c}.`, CATEGORIES[c], others, c);
}

const ODD_ONE: ChoiceItem[] = [
  { p: "¿Qué palabra no es como las demás?", a: "martillo", d: ["mango", "papaya", "fresa"] },
  { p: "¿Qué palabra no es como las demás?", a: "zapato", d: ["puma", "cóndor", "zorro"] },
  { p: "¿Qué palabra no es como las demás?", a: "manzana", d: ["chompa", "falda", "casaca"] },
  { p: "¿Qué palabra no es como las demás?", a: "nube", d: ["bus", "tren", "barco"] },
  { p: "¿Qué palabra no es como las demás?", a: "cuchara", d: ["guitarra", "cajón", "quena"] },
  { p: "¿Qué palabra no es como las demás?", a: "silla", d: ["lunes", "martes", "jueves"] },
  { p: "¿Qué palabra no es como las demás?", a: "perro", d: ["rojo", "azul", "verde"] },
  { p: "¿Qué palabra no es como las demás?", a: "correr", d: ["enero", "marzo", "julio"] },
];

// --- Sinónimos y antónimos ------------------------------------------------------------

const SYNONYMS: ChoiceItem[] = [
  { p: "¿Qué palabra significa lo mismo que «contento»?", a: "alegre", d: ["triste", "cansado", "serio"] },
  { p: "¿Qué palabra significa lo mismo que «empezar»?", a: "comenzar", d: ["terminar", "parar", "dormir"] },
  { p: "¿Qué palabra significa lo mismo que «veloz»?", a: "rápido", d: ["lento", "pesado", "quieto"] },
  { p: "¿Qué palabra significa lo mismo que «enorme»?", a: "gigante", d: ["chico", "flaco", "bajo"] },
  { p: "¿Qué palabra significa lo mismo que «hablar»?", a: "conversar", d: ["callar", "escuchar", "mirar"] },
  { p: "¿Qué palabra significa lo mismo que «bonito»?", a: "lindo", d: ["feo", "viejo", "sucio"] },
  { p: "¿Qué palabra significa lo mismo que «regalo»?", a: "obsequio", d: ["castigo", "trabajo", "pedido"] },
  { p: "¿Qué palabra significa lo mismo que «caminar»?", a: "andar", d: ["volar", "nadar", "saltar"] },
];

const SYN_CONTEXT: ChoiceItem[] = [
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "El perrito estaba ASUSTADO por los truenos.", a: "atemorizado", d: ["dormido", "emocionado", "mojado"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "La maestra nos MOSTRÓ un mapa.", a: "enseñó", d: ["escondió", "rompió", "pidió"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "El camino era muy ESTRECHO.", a: "angosto", d: ["ancho", "largo", "empinado"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "Mi abuelo es un hombre SABIO.", a: "inteligente", d: ["despistado", "joven", "callado"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "Guardé mis AHORROS en la alcancía.", a: "monedas", d: ["juguetes", "dibujos", "dulces"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "El niño CONTESTÓ la pregunta.", a: "respondió", d: ["olvidó", "preguntó", "borró"] },
  { p: "¿Qué palabra significa lo mismo que la palabra en MAYÚSCULAS?", t: "Hoy el mar está CALMADO.", a: "tranquilo", d: ["bravo", "revuelto", "frío"] },
];

const ANTONYMS: ChoiceItem[] = [
  { p: "¿Qué palabra significa lo contrario de «alto»?", a: "bajo", d: ["grande", "largo", "ancho"] },
  { p: "¿Qué palabra significa lo contrario de «abrir»?", a: "cerrar", d: ["empujar", "romper", "tocar"] },
  { p: "¿Qué palabra significa lo contrario de «limpio»?", a: "sucio", d: ["nuevo", "claro", "brillante"] },
  { p: "¿Qué palabra significa lo contrario de «lleno»?", a: "vacío", d: ["pesado", "grande", "redondo"] },
  { p: "¿Qué palabra significa lo contrario de «subir»?", a: "bajar", d: ["trepar", "saltar", "correr"] },
  { p: "¿Qué palabra significa lo contrario de «temprano»?", a: "tarde", d: ["pronto", "ahora", "antes"] },
  { p: "¿Qué palabra significa lo contrario de «encender»?", a: "apagar", d: ["prender", "calentar", "alumbrar"] },
  { p: "¿Qué palabra significa lo contrario de «valiente»?", a: "cobarde", d: ["fuerte", "audaz", "atrevido"] },
];

const ANT_SENTENCE: ChoiceItem[] = [
  { p: "¿Qué oración usa un antónimo de «frío»?", a: "La sopa está caliente.", d: ["La sopa está helada.", "La sopa está fresca.", "La sopa está en la mesa."] },
  { p: "¿Qué oración usa un antónimo de «triste»?", a: "Mi hermano está feliz.", d: ["Mi hermano está apenado.", "Mi hermano está en casa.", "Mi hermano está llorando."] },
  { p: "¿Qué oración usa un antónimo de «rápido»?", a: "El caracol es lento.", d: ["El caracol es veloz.", "El caracol es pequeño.", "El caracol es ligero."] },
  { p: "¿Qué oración usa un antónimo de «día»?", a: "Salimos de noche.", d: ["Salimos de mañana.", "Salimos de paseo.", "Salimos de casa."] },
  { p: "¿Qué oración usa un antónimo de «duro»?", a: "La almohada es blanda.", d: ["La almohada es firme.", "La almohada es blanca.", "La almohada es nueva."] },
  { p: "¿Qué oración usa un antónimo de «cerca»?", a: "Mi tía vive lejos.", d: ["Mi tía vive al lado.", "Mi tía vive sola.", "Mi tía vive aquí."] },
  { p: "¿Qué oración usa un antónimo de «fácil»?", a: "El examen fue difícil.", d: ["El examen fue sencillo.", "El examen fue corto.", "El examen fue ayer."] },
];

const ANT_CONTEXT: ChoiceItem[] = [
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "El vaso está LLENO de jugo.", a: "vacío", d: ["repleto", "limpio", "frío"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "La tortuga camina muy LENTO.", a: "rápido", d: ["despacio", "torpe", "cansado"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "Hoy me levanté TEMPRANO.", a: "tarde", d: ["pronto", "contento", "de día"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "La caja es muy PESADA.", a: "liviana", d: ["grande", "dura", "cargada"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "El cuento tuvo un final ALEGRE.", a: "triste", d: ["feliz", "divertido", "largo"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "Mi cuarto está ORDENADO.", a: "desordenado", d: ["limpio", "arreglado", "pintado"] },
  { p: "¿Qué palabra significa lo contrario de la palabra en MAYÚSCULAS?", t: "El gato ENTRÓ a la cocina.", a: "salió", d: ["pasó", "ingresó", "corrió"] },
];

const SAME_MEANING: ChoiceItem[] = [
  { p: "¿Qué oración significa lo mismo?", t: "El niño está contento.", a: "El niño está feliz.", d: ["El niño está triste.", "El niño está cansado.", "El niño está solo."] },
  { p: "¿Qué oración significa lo mismo?", t: "La clase empieza a las ocho.", a: "La clase comienza a las ocho.", d: ["La clase termina a las ocho.", "La clase dura ocho horas.", "La clase es a las nueve."] },
  { p: "¿Qué oración significa lo mismo?", t: "El perro es veloz.", a: "El perro es rápido.", d: ["El perro es lento.", "El perro es grande.", "El perro es bravo."] },
  { p: "¿Qué oración significa lo mismo?", t: "Mi casa queda cerca.", a: "Mi casa no queda lejos.", d: ["Mi casa queda lejos.", "Mi casa es grande.", "Mi casa no es nueva."] },
  { p: "¿Qué oración significa lo mismo?", t: "El examen fue sencillo.", a: "El examen fue fácil.", d: ["El examen fue difícil.", "El examen fue largo.", "El examen fue ayer."] },
  { p: "¿Qué oración significa lo mismo?", t: "Ana le dio un obsequio a su mamá.", a: "Ana le dio un regalo a su mamá.", d: ["Ana le dio un abrazo a su mamá.", "Ana le pidió un regalo a su mamá.", "Ana le dio un susto a su mamá."] },
  { p: "¿Qué oración significa lo mismo?", t: "El cuarto no está limpio.", a: "El cuarto está sucio.", d: ["El cuarto está ordenado.", "El cuarto está vacío.", "El cuarto es pequeño."] },
];

// --- Homófonos y varios significados -------------------------------------------------------

const HOMOPHONE_PIC: ChoiceItem[] = [
  { pic: "🌊", a: "ola", d: ["hola", "olla", "hora"] },
  { pic: "👋", a: "hola", d: ["ola", "olla", "ala"] },
  { pic: "🐮", a: "vaca", d: ["baca", "boca", "vaga"] },
  { pic: "🏠", a: "casa", d: ["caza", "cosa", "capa"] },
  { pic: "🏹", a: "caza", d: ["casa", "taza", "cazo"] },
  { pic: "🗳️", a: "votar", d: ["botar", "volar", "notar"] },
  { pic: "🧵", a: "coser", d: ["cocer", "comer", "toser"] },
  { pic: "🍲", a: "cocer", d: ["coser", "correr", "cortar"] },
];

const HOMOPHONE_ID: ChoiceItem[] = [
  { p: "¿Qué palabra suena igual que «hola», pero significa otra cosa?", a: "ola", d: ["ala", "olla", "hora"] },
  { p: "¿Qué palabra suena igual que «tubo», pero significa otra cosa?", a: "tuvo", d: ["tuve", "tapa", "tubos"] },
  { p: "¿Qué palabra suena igual que «bello», pero significa otra cosa?", a: "vello", d: ["bella", "sello", "vela"] },
  { p: "¿Qué palabra suena igual que «hecho», pero significa otra cosa?", a: "echo", d: ["eco", "hacha", "hecha"] },
  { p: "¿Qué palabra suena igual que «ay», pero significa otra cosa?", a: "hay", d: ["hoy", "ahí", "ha"] },
  { p: "¿Qué palabra suena igual que «asta», pero significa otra cosa?", a: "hasta", d: ["esta", "pasta", "hacha"] },
  { p: "¿Qué palabra suena igual que «botar», pero significa otra cosa?", a: "votar", d: ["volar", "botas", "notar"] },
  { p: "¿Qué palabra suena igual que «ciento», pero significa otra cosa?", a: "siento", d: ["cuento", "viento", "cien"] },
];

const HOMOPHONE_USE: ChoiceItem[] = [
  { t: "___ muchos niños en el patio.", a: "Hay", d: ["Ay", "Ahí", "Ai"] },
  { t: "¡___, me pisaste el pie!", a: "Ay", d: ["Hay", "Ahí", "Hai"] },
  { t: "Una ___ gigante mojó la toalla.", a: "ola", d: ["hola", "olla", "hora"] },
  { t: "Mi papá ___ un carro rojo.", a: "tuvo", d: ["tubo", "tubó", "tuvó"] },
  { t: "El agua pasa por el ___.", a: "tubo", d: ["tuvo", "tuve", "tuvó"] },
  { t: "Caminé ___ la esquina.", a: "hasta", d: ["asta", "hazta", "azta"] },
  { t: "Mi abuela va a ___ el botón de mi camisa.", a: "coser", d: ["cocer", "coçer", "cozer"] },
  { t: "He ___ toda mi tarea.", a: "hecho", d: ["echo", "hécho", "ehco"] },
];

const MULTI_MEANING: ChoiceItem[] = [
  { pic: "🏦", p: "«Banco» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Lugar donde se guarda dinero", d: ["Asiento para varias personas", "Grupo de peces", "Montón de arena"] },
  { pic: "🍃", p: "«Hoja» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Parte de una planta", d: ["Papel de un cuaderno", "Filo de un cuchillo", "Página de un libro"] },
  { pic: "🦙", p: "«Llama» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Animal de los Andes", d: ["Fuego que sube", "Del verbo llamar", "Luz de una vela"] },
  { pic: "🖱️", p: "«Ratón» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Aparato de la computadora", d: ["Animal pequeño", "Rato muy largo", "Juguete de gato"] },
  { pic: "🏔️", p: "«Sierra» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Región de montañas", d: ["Herramienta para cortar", "Del verbo cerrar", "Pez del mar"] },
  { pic: "✉️", p: "«Carta» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Mensaje escrito en papel", d: ["Naipe para jugar", "Lista de comidas", "Mapa del mar"] },
  { pic: "🏆", p: "«Copa» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Premio de un campeonato", d: ["Parte alta de un árbol", "Vaso con pie", "Parte de un sombrero"] },
  { pic: "🔥", p: "«Llama» tiene varios significados. ¿Cuál muestra el dibujo?", a: "Fuego que sube", d: ["Animal de los Andes", "Del verbo llamar", "Planta del campo"] },
];

// --- Matices de significado ------------------------------------------------------------------

const SHADES_PIC: ChoiceItem[] = [
  { pic: "😡", a: "furioso", d: ["molesto", "tranquilo", "serio"] },
  { pic: "😭", a: "desconsolado", d: ["apenado", "serio", "pensativo"] },
  { pic: "🤣", a: "muerto de risa", d: ["sonriente", "serio", "tranquilo"] },
  { pic: "⛈️", a: "tormenta", d: ["llovizna", "brisa", "rocío"] },
  { pic: "🥶", a: "helado", d: ["fresco", "tibio", "templado"] },
  { pic: "🏃", a: "corre", d: ["camina", "pasea", "gatea"] },
  { pic: "🐘", a: "enorme", d: ["mediano", "pequeño", "diminuto"] },
  { pic: "🐜", a: "diminuto", d: ["grande", "mediano", "enorme"] },
];

const RELATED: MultiItem[] = [
  { p: "Selecciona las palabras que significan «decir en voz baja».", opts: ["susurrar", "murmurar", "gritar", "cantar", "chillar"], ans: ["susurrar", "murmurar"] },
  { p: "Selecciona las palabras que significan «muy grande».", opts: ["enorme", "gigante", "chico", "delgado", "corto"], ans: ["enorme", "gigante"] },
  { p: "Selecciona las palabras que significan «andar rápido».", opts: ["correr", "trotar", "gatear", "pasear", "sentarse"], ans: ["correr", "trotar"] },
  { p: "Selecciona las palabras que significan «mirar».", opts: ["observar", "ver", "oler", "tocar", "probar"], ans: ["observar", "ver"] },
  { p: "Selecciona las palabras que significan «estar alegre».", opts: ["contento", "feliz", "molesto", "aburrido", "cansado"], ans: ["contento", "feliz"] },
  { p: "Selecciona las palabras que significan «tener frío».", opts: ["helado", "congelado", "acalorado", "tibio", "sudado"], ans: ["helado", "congelado"] },
  { p: "Selecciona las palabras que significan «comer».", opts: ["devorar", "almorzar", "beber", "dormir", "cocinar"], ans: ["devorar", "almorzar"] },
];

const DIFFERENCE: ChoiceItem[] = [
  { p: "¿Cuál es la diferencia entre «caminar» y «correr»?", a: "Correr es ir más rápido", d: ["Caminar es ir más rápido", "Correr es ir hacia atrás", "Son exactamente lo mismo"] },
  { p: "¿Cuál es la diferencia entre «hablar» y «gritar»?", a: "Gritar es hablar muy fuerte", d: ["Gritar es hablar muy bajito", "Hablar es más fuerte", "Gritar es no decir nada"] },
  { p: "¿Cuál es la diferencia entre «mirar» y «espiar»?", a: "Espiar es mirar a escondidas", d: ["Espiar es mirar de frente", "Mirar es a escondidas", "Espiar es cerrar los ojos"] },
  { p: "¿Cuál es la diferencia entre «tibio» y «hirviendo»?", a: "Hirviendo es mucho más caliente", d: ["Tibio es mucho más caliente", "Hirviendo es frío", "Tibio es helado"] },
  { p: "¿Cuál es la diferencia entre «llovizna» y «tormenta»?", a: "La tormenta es mucho más fuerte", d: ["La llovizna es mucho más fuerte", "La tormenta no moja", "La llovizna trae rayos"] },
  { p: "¿Cuál es la diferencia entre «comer» y «devorar»?", a: "Devorar es comer con muchas ganas", d: ["Devorar es comer solo un poquito", "Comer es más rápido", "Devorar es no comer"] },
  { p: "¿Cuál es la diferencia entre «contento» y «emocionado»?", a: "Emocionado es más intenso", d: ["Contento es más intenso", "Emocionado es estar triste", "Contento es estar bravo"] },
];

const SHADES: OrderItem[] = [
  { p: "Ordena de menor a mayor temperatura.", seq: ["helado", "frío", "tibio", "caliente"] },
  { p: "Ordena de más lento a más rápido.", seq: ["gatear", "caminar", "trotar", "correr"] },
  { p: "Ordena de más pequeño a más grande.", seq: ["diminuto", "pequeño", "grande", "enorme"] },
  { p: "Ordena de menos a más ruido.", seq: ["susurrar", "hablar", "gritar"] },
  { p: "Ordena de menos a más lluvia.", seq: ["llovizna", "lluvia", "tormenta"] },
  { p: "Ordena de menos a más alegría.", seq: ["serio", "contento", "feliz", "eufórico"] },
  { p: "Ordena de menos a más enojo.", seq: ["tranquilo", "molesto", "enojado", "furioso"] },
];

// --- Expresiones -----------------------------------------------------------------------------

const IDIOMS: ChoiceItem[] = [
  { p: "¿Qué dibujo muestra lo que significa «llueve a cántaros»?", a: "⛈️ Llueve muchísimo", d: ["🏺 Caen jarras del cielo", "☀️ Hace mucho sol", "💧 Cae una gotita"] },
  { p: "¿Qué dibujo muestra lo que significa «estar en las nubes»?", a: "💭 Estar distraído", d: ["☁️ Volar en el cielo", "✈️ Viajar en avión", "⛰️ Subir un cerro"] },
  { p: "¿Qué dibujo muestra lo que significa «es pan comido»?", a: "👍 Es muy fácil", d: ["🍞 Ya se comieron el pan", "🥖 Es una panadería", "😋 Tiene hambre"] },
  { p: "¿Qué dibujo muestra lo que significa «meter la pata»?", a: "🙈 Equivocarse", d: ["🦵 Patear una pelota", "🦆 Pisar un pato", "👟 Ponerse el zapato"] },
  { p: "¿Qué dibujo muestra lo que significa «echar una mano»?", a: "🤝 Ayudar", d: ["✋ Perder una mano", "👏 Aplaudir", "🧤 Tirar un guante"] },
  { p: "¿Qué dibujo muestra lo que significa «tomar el pelo»?", a: "😜 Hacer una broma", d: ["💇 Cortar el cabello", "🧴 Lavarse el pelo", "👒 Ponerse un sombrero"] },
  { p: "¿Qué dibujo muestra lo que significa «ponerse las pilas»?", a: "💪 Esforzarse más", d: ["🔋 Comprar baterías", "🔦 Prender la linterna", "😴 Irse a dormir"] },
  { p: "¿Qué dibujo muestra lo que significa «estar hecho una sopa»?", a: "💦 Estar muy mojado", d: ["🍲 Cocinar una sopa", "🥄 Tener una cuchara", "🔥 Estar muy caliente"] },
];

// --- Contexto ----------------------------------------------------------------------------------

const CONTEXT: ChoiceItem[] = [
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "Después de correr tanto, el perro estaba EXHAUSTO y se echó a dormir.", a: "muy cansado", d: ["muy sucio", "muy contento", "muy asustado"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "El camino era tan ANGOSTO que solo pasaba una persona a la vez.", a: "estrecho", d: ["largo", "oscuro", "mojado"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "La sopa estaba tan INSÍPIDA que le eché sal.", a: "sin sabor", d: ["muy caliente", "muy rica", "muy salada"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "El bebé SOLLOZABA porque se le cayó el juguete.", a: "lloraba", d: ["reía", "dormía", "saltaba"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "Las hormigas son DIMINUTAS: caben en la punta de un dedo.", a: "muy pequeñas", d: ["muy fuertes", "muy rápidas", "muy oscuras"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "El cuarto estaba en PENUMBRA y casi no se veía nada.", a: "casi a oscuras", d: ["muy iluminado", "muy ordenado", "muy frío"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "Mi tía es muy GENEROSA: siempre comparte lo que tiene.", a: "que da a los demás", d: ["que guarda todo", "que habla mucho", "que duerme poco"] },
  { p: "¿Qué significa la palabra en MAYÚSCULAS?", t: "El río estaba CAUDALOSO después de tantas lluvias.", a: "con mucha agua", d: ["casi seco", "muy sucio", "muy quieto"] },
];

// --- Diccionario ------------------------------------------------------------------------------

// Grupos de palabras para ordenar según la primera, segunda o tercera letra.
const ABC: Record<1 | 2 | 3, string[][]> = {
  1: [["árbol", "burro", "casa", "dedo", "foca", "gato", "isla", "luna", "mesa", "nube", "oso", "pato", "rana", "sol", "taza", "uva", "vaca", "zorro"]],
  2: [["baile", "beso", "bici", "bota", "burro"], ["cama", "cena", "cine", "copa", "cuna"], ["mano", "mesa", "mina", "mono", "mula"], ["pato", "pera", "piso", "pozo", "puma"], ["sapo", "seda", "silla", "sopa", "suma"], ["taza", "tela", "tina", "toro", "tubo"]],
  3: [["cabra", "caja", "cama", "capa", "casa"], ["mago", "mala", "mano", "mapa", "masa"], ["pala", "pan", "papa", "pasa", "pato"], ["coche", "codo", "cola", "copa", "cosa"], ["lila", "lima", "lira", "liso"], ["saco", "sal", "sapo", "sastre"]],
};

function abcOrder(r: Rng, level: 1 | 2 | 3): Question {
  const group = r.pick(ABC[level]);
  const words = r.shuffle(group).slice(0, 4);
  const sorted = [...words].sort((a, b) => a.localeCompare(b, "es"));
  const hint = level === 1 ? "Mira la primera letra." : level === 2 ? "Empiezan igual: mira la segunda letra." : "Las dos primeras letras son iguales: mira la tercera.";
  let tiles = words;
  if (tiles.every((w, i) => w === sorted[i])) tiles = [...words.slice(1), words[0]];
  return {
    kind: "sequence",
    prompt: `Ordena las palabras alfabéticamente. ${hint}`,
    tiles,
    reuse: false,
    length: 4,
    answer: sorted,
    explanation: `El orden alfabético es: ${sorted.join(", ")}.`,
    tag: `letra-${level}`,
  };
}

const GUIDE_WORDS: ChoiceItem[] = [
  { p: "Las palabras guía de la página son «gato» y «globo». ¿Qué palabra está en esa página?", a: "gema", d: ["foca", "gusano", "hada"] },
  { p: "Las palabras guía de la página son «mano» y «mesa». ¿Qué palabra está en esa página?", a: "mar", d: ["luna", "mono", "nube"] },
  { p: "Las palabras guía de la página son «pan» y «pez». ¿Qué palabra está en esa página?", a: "pera", d: ["oso", "piso", "queso"] },
  { p: "Las palabras guía de la página son «sal» y «sol». ¿Qué palabra está en esa página?", a: "silla", d: ["rana", "suerte", "taza"] },
  { p: "Las palabras guía de la página son «cama» y «cine». ¿Qué palabra está en esa página?", a: "casa", d: ["burro", "copa", "dedo"] },
  { p: "Las palabras guía de la página son «lana» y «libro». ¿Qué palabra está en esa página?", a: "leche", d: ["jugo", "lluvia", "mesa"] },
  { p: "Las palabras guía de la página son «taza» y «toro». ¿Qué palabra está en esa página?", a: "tigre", d: ["sapo", "trompo", "uva"] },
  { p: "Las palabras guía de la página son «boca» y «burro». ¿Qué palabra está en esa página?", a: "bota", d: ["bici", "casa", "ave"] },
];

const DICTIONARY: ChoiceItem[] = [
  { t: "banco. 1. Asiento largo para varias personas. 2. Lugar donde se guarda dinero.", p: "¿Qué significado se usa en «Me senté en el banco del parque»?", a: "El significado 1", d: ["El significado 2"] },
  { t: "banco. 1. Asiento largo para varias personas. 2. Lugar donde se guarda dinero.", p: "¿Qué significado se usa en «Mi mamá fue al banco a pagar»?", a: "El significado 2", d: ["El significado 1"] },
  { t: "hoja. 1. Parte verde de una planta. 2. Papel de un cuaderno o libro.", p: "¿Qué significado se usa en «Arranqué una hoja para dibujar»?", a: "El significado 2", d: ["El significado 1"] },
  { t: "hoja. 1. Parte verde de una planta. 2. Papel de un cuaderno o libro.", p: "¿Qué significado se usa en «En otoño cae cada hoja del árbol»?", a: "El significado 1", d: ["El significado 2"] },
  { t: "pico. 1. Boca de las aves. 2. Punta de una montaña. 3. Herramienta para cavar.", p: "¿Qué significado se usa en «El loro abrió el pico»?", a: "El significado 1", d: ["El significado 2", "El significado 3"] },
  { t: "pico. 1. Boca de las aves. 2. Punta de una montaña. 3. Herramienta para cavar.", p: "¿Qué significado se usa en «Subimos hasta el pico nevado»?", a: "El significado 2", d: ["El significado 1", "El significado 3"] },
  { t: "pico. 1. Boca de las aves. 2. Punta de una montaña. 3. Herramienta para cavar.", p: "¿Qué significado se usa en «El obrero cavó con un pico»?", a: "El significado 3", d: ["El significado 1", "El significado 2"] },
  { t: "veloz. adj. Que se mueve muy rápido.", p: "Según el diccionario, ¿qué es «veloz»?", a: "Que se mueve muy rápido", d: ["Que se mueve muy lento", "Que no se mueve", "Que hace ruido"] },
  { t: "cumbre. s. f. Parte más alta de una montaña.", p: "Según el diccionario, ¿qué es una «cumbre»?", a: "La parte más alta de una montaña", d: ["El pie de una montaña", "Un río de montaña", "Una cueva"] },
];

export const ROWS: Row[] = [
  ["prefijos-sufijos-1", (r) => choose(r, "Toca 🔊, escucha y completa la palabra.", ENDINGS)],
  ["prefijos-sufijos-2", (r) => choose(r, "", PARTS)],
  ["prefijos-sufijos-3", (r) => choose(r, "", PREFIX_MEANING)],
  ["prefijos-sufijos-4", (r) => choose(r, "Completa la oración.", PREFIX_USE)],
  ["prefijos-sufijos-5", (r) => choose(r, "", SUFFIX_MEANING)],
  ["prefijos-sufijos-6", (r) => mix(r, [(q) => choose(q, "", PARTS), (q) => choose(q, "", PREFIX_MEANING), (q) => choose(q, "", SUFFIX_MEANING), (q) => choose(q, "Completa la oración.", PREFIX_USE)])],

  ["compuestas-1", (r) => choose(r, "¿Qué palabra falta para formar la palabra compuesta del dibujo?", COMPOUND_PIC)],
  ["compuestas-2", (r) => choose(r, "", COMPOUND_FORM)],
  ["compuestas-3", (r) => choose(r, "Completa la oración.", COMPOUND_USE)],

  ["categorias-1", sortCategory],
  ["categorias-2", (r) => choose(r, "", ODD_ONE)],

  ["sinonimos-antonimos-1", (r) => choose(r, "", SYNONYMS)],
  ["sinonimos-antonimos-2", (r) => choose(r, "", SYN_CONTEXT)],
  ["sinonimos-antonimos-3", (r) => choose(r, "", ANTONYMS)],
  ["sinonimos-antonimos-4", (r) => choose(r, "", ANT_SENTENCE)],
  ["sinonimos-antonimos-5", (r) => choose(r, "", ANT_CONTEXT)],
  ["sinonimos-antonimos-6", (r) => choose(r, "", SAME_MEANING)],

  ["homofonos-1", (r) => choose(r, "¿Qué palabra corresponde al dibujo?", HOMOPHONE_PIC)],
  ["homofonos-2", (r) => choose(r, "", HOMOPHONE_ID)],
  ["homofonos-3", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["varios-significados-1", (r) => choose(r, "", MULTI_MEANING)],

  ["matices-1", (r) => choose(r, "¿Qué palabra describe mejor el dibujo?", SHADES_PIC)],
  ["matices-2", (r) => chooseAll(r, "", RELATED)],
  ["matices-3", (r) => choose(r, "", DIFFERENCE)],
  ["matices-4", (r) => order(r, "", SHADES)],

  ["expresiones", (r) => choose(r, "", IDIOMS)],

  ["varios-significados-2", (r) => choose(r, "", CONTEXT)],

  ["orden-alfabetico-1", (r) => abcOrder(r, 1)],
  ["orden-alfabetico-2", (r) => abcOrder(r, 2)],
  ["orden-alfabetico-3", (r) => abcOrder(r, 3)],
  ["diccionario-1", (r) => choose(r, "", GUIDE_WORDS)],
  ["diccionario-2", (r) => choose(r, "", DICTIONARY)],
];
