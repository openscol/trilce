import { choose, mix, pickAll, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { abcOrder, f, pool, pt, sorter, w } from "./helpers";
import type { Row } from "./row";

// Vocabulario (IXL 3rd grade ELA, EE-NN). Los afijos del inglés pasan a los
// del castellano: pre-, re-, mis- → pre-, re-, des-; -ful/-less → -oso/in-;
// -ly/-ness → -mente/-eza, -dad; -able/-ment → -able, -ible/-miento.

export const SECTIONS: Section[] = [
  { id: "EE", name: "Prefijos y sufijos", icon: "🧩" },
  { id: "FF", name: "Raíces griegas y latinas", icon: "🏛️" },
  { id: "GG", name: "Palabras compuestas", icon: "🔗" },
  { id: "HH", name: "Categorías", icon: "🗂️" },
  { id: "II", name: "Sinónimos y antónimos", icon: "↔️" },
  { id: "JJ", name: "Homófonos y homónimos", icon: "👂" },
  { id: "KK", name: "Matices de significado", icon: "🌈" },
  { id: "LL", name: "Expresiones", icon: "💬" },
  { id: "MM", name: "Claves de contexto", icon: "🔎" },
  { id: "NN", name: "Uso del diccionario", icon: "📖" },
];

const PARTS: ChoiceItem[] = [
  w("En «desordenado», ¿cuál es el prefijo?", "des-", "-ado", "orden"), w("En «desordenado», ¿cuál es la palabra base?", "orden", "des-", "nado"),
  w("En «felizmente», ¿cuál es el sufijo?", "-mente", "feliz", "fe-"), w("En «releer», ¿cuál es la palabra base?", "leer", "re-", "rele"),
  w("En «jardinero», ¿cuál es el sufijo?", "-ero", "jardín", "jar-"), w("En «imposible», ¿cuál es el prefijo?", "im-", "i-", "posible"),
  w("En «prehistoria», ¿cuál es el prefijo?", "pre-", "-ia", "historia"), w("En «amistoso», ¿cuál es el sufijo?", "-oso", "amist", "a-"),
  w("En «incómodo», ¿cuál es la palabra base?", "cómodo", "in-", "modo"), w("En «lavable», ¿cuál es el sufijo?", "-able", "lav", "la-"),
];

const PREFIX_MEANING: ChoiceItem[] = [
  w("¿Qué significa «releer»?", "Leer otra vez", "Leer antes", "No leer nunca más"), w("¿Qué significa «deshacer»?", "Lo contrario de hacer", "Hacer otra vez lo mismo", "Hacer antes"),
  w("¿Qué significa «precalentar»?", "Calentar antes", "Calentar otra vez", "No calentar"), w("¿Qué significa «reconstruir»?", "Construir otra vez", "No construir", "Construir antes de tiempo"),
  w("¿Qué significa «desatar»?", "Lo contrario de atar", "Atar otra vez más fuerte", "Atar antes"), w("¿Qué significa «prever»?", "Ver antes de que pase", "Ver otra vez", "No ver nada de lo que pasa"),
  w("¿Qué significa «rellenar»?", "Llenar otra vez", "Llenar antes", "Vaciar por completo"), w("¿Qué significa «desobedecer»?", "No obedecer", "Obedecer otra vez", "Obedecer"),
  w("¿Qué significa «preescolar»?", "Antes de la escuela", "Otra vez en la escuela", "Sin escuela"), w("¿Qué significa «descongelar»?", "Lo contrario de congelar", "Congelar otra vez más fuerte", "Congelar antes"),
];
const PREFIX_USE: ChoiceItem[] = [
  f("El horno debe estar caliente antes de meter la torta: hay que ___.", "precalentarlo", "recalentarlo", "descalentarlo"),
  f("Me equivoqué en el dibujo, así que lo voy a ___.", "rehacer", "deshacer", "prehacer"),
  f("El nudo está muy apretado; no lo puedo ___.", "desatar", "reatar", "preatar"),
  f("La botella está vacía: la voy a ___ con agua.", "rellenar", "desllenar", "prellenar"),
  f("Saca el pollo de la congeladora para ___.", "descongelarlo", "recongelarlo", "precongelarlo"),
  f("El terremoto dañó el puente y ahora lo van a ___.", "reconstruir", "desconstruir", "preconstruir"),
  f("Si no haces caso a tu mamá, la vas a ___.", "desobedecer", "reobedecer", "preobedecer"),
  f("Antes de primaria, mi hermanito va al nivel ___.", "preescolar", "reescolar", "desescolar"),
];
const OSO_IN: ChoiceItem[] = [
  w("¿Qué significa «ruidoso»?", "Que hace mucho ruido", "Sin ruido", "Antes de que haya ruido"), w("¿Qué significa «incómodo»?", "Que no es cómodo", "Muy cómodo", "Cómodo otra vez, como antes"),
  w("¿Qué significa «miedoso»?", "Que tiene mucho miedo", "Sin miedo", "Que da miedo antes de dormir"), w("¿Qué significa «invisible»?", "Que no se puede ver", "Que se ve muy bien", "Que se ve otra vez"),
  w("¿Qué significa «cariñoso»?", "Que da mucho cariño", "Sin cariño", "Que quiere cariño antes"), w("¿Qué significa «incompleto»?", "Que no está completo", "Muy completo", "Completo otra vez, como antes"),
  w("¿Qué significa «peligroso»?", "Que tiene peligro", "Sin peligro", "Peligro que ya pasó"), w("¿Qué significa «infeliz»?", "Que no es feliz", "Muy feliz", "Feliz de nuevo, otra vez"),
];
const MENTE_EZA: ChoiceItem[] = [
  w("¿Qué significa «lentamente»?", "De manera lenta", "Sin lentitud", "Persona lenta"), w("¿Qué significa «belleza»?", "Cualidad de ser bello", "De manera bella y lenta", "Sin belleza"),
  w("¿Qué significa «fácilmente»?", "De manera fácil", "Cualidad de ser fácil", "Nada fácil"), w("¿Qué significa «bondad»?", "Cualidad de ser bueno", "De manera buena y rápida", "Sin bondad"),
  w("¿Qué significa «alegremente»?", "De manera alegre", "Cualidad de alegre", "Sin alegría"), w("¿Qué significa «tristeza»?", "Cualidad de estar triste", "De manera triste y lenta", "Sin tristeza"),
  w("¿Qué significa «cuidadosamente»?", "De manera cuidadosa", "Sin cuidado", "Persona que cuida algo"), w("¿Qué significa «oscuridad»?", "Cualidad de ser oscuro", "De manera oscura y fría", "Sin oscuridad"),
];
const ABLE_MIENTO: ChoiceItem[] = [
  w("¿Qué significa «lavable»?", "Que se puede lavar", "Acción de lavar ropa", "Sin lavar"), w("¿Qué significa «crecimiento»?", "Acción de crecer", "Que se puede crecer", "Sin crecer"),
  w("¿Qué significa «comestible»?", "Que se puede comer", "Acción de comer algo", "Sin comida"), w("¿Qué significa «movimiento»?", "Acción de moverse", "Que se puede mover", "Sin moverse"),
  w("¿Qué significa «increíble»?", "Que no se puede creer", "Acción de creer en algo", "Muy creyente"), w("¿Qué significa «nacimiento»?", "Acción de nacer", "Que puede nacer", "Sin nacer"),
  w("¿Qué significa «visible»?", "Que se puede ver", "Acción de ver algo", "Sin vista"), w("¿Qué significa «descubrimiento»?", "Acción de descubrir", "Que se puede cubrir", "Sin cubrir"),
];

const RE_AGAIN = { yes: ["releer", "rehacer", "recontar", "reabrir", "rellenar", "reescribir"], no: ["regalo", "reloj", "reina", "remo", "regla", "receta"] };
const DES_OPPOSITE = { yes: ["deshacer", "desatar", "desordenar", "descongelar", "desarmar", "destapar"], no: ["desayuno", "desierto", "destino", "desfile", "después", "desde"] };
const IN_NOT = { yes: ["incómodo", "infeliz", "invisible", "incompleto", "injusto", "incapaz"], no: ["invierno", "insecto", "indio", "inglés", "invitar", "inventar"] };

const SPEECH = sorter(["Sustantivo", "Adjetivo", "Adverbio"], "Mira el sufijo. ¿Qué clase de palabra es?");
const SUFFIX_SPEECH: ChoiceItem[] = [
  SPEECH("rápidamente", 2), SPEECH("ruidoso", 1), SPEECH("belleza", 0), SPEECH("lavable", 1), SPEECH("crecimiento", 0), SPEECH("felizmente", 2),
  SPEECH("bondad", 0), SPEECH("miedoso", 1), SPEECH("tranquilamente", 2), SPEECH("comestible", 1), SPEECH("panadero", 0), SPEECH("suavemente", 2),
];

const ANALOGIES: ChoiceItem[] = [
  f("feliz → infeliz\nútil → ___", "inútil", "utilidad", "útilmente"), f("leer → releer\nhacer → ___", "rehacer", "deshacer", "hacedor"),
  f("lento → lentamente\nfácil → ___", "fácilmente", "facilidad", "difícil"), f("pan → panadero\nzapato → ___", "zapatero", "zapatería", "zapatilla"),
  f("atar → desatar\ntapar → ___", "destapar", "retapar", "tapadera"), f("ruido → ruidoso\nmiedo → ___", "miedoso", "miedos", "sin miedo"),
  f("lavar → lavable\nromper → ___", "rompible", "rotura", "rompedor"), f("bello → belleza\ntriste → ___", "tristeza", "tristemente", "tristón"),
  f("flor → florero\nsal → ___", "salero", "salado", "salar"), f("crecer → crecimiento\nmover → ___", "movimiento", "movible", "mudanza"),
];
const PATTERN_SENTENCES: ChoiceItem[] = [
  f("Quien vende pan es un panadero. Quien vende zapatos es un ___.", "zapatero", "zapato", "zapatería"),
  f("Lo que se puede lavar es lavable. Lo que se puede romper es ___.", "rompible", "rotura", "rompedor"),
  f("Si algo no es justo, es injusto. Si algo no es cómodo, es ___.", "incómodo", "comodidad", "cómodamente"),
  f("Hacer algo con calma es hacerlo calmadamente. Hacerlo con cuidado es hacerlo ___.", "cuidadosamente", "cuidadoso", "descuidadamente"),
  f("Volver a leer es releer. Volver a contar es ___.", "recontar", "descontar", "contador"),
  f("El lugar donde venden libros es una librería. Donde venden flores es una ___.", "florería", "florero", "florista"),
  f("Quien tiene miedo es miedoso. Quien tiene cariño es ___.", "cariñoso", "cariños", "encariñar"),
  f("Lo contrario de armar es desarmar. Lo contrario de ordenar es ___.", "desordenar", "reordenar", "ordenado"),
];

const ROOT_CLUES: ChoiceItem[] = [
  w("«Tele-» significa «lejos». ¿Qué es un telescopio?", "Un aparato para ver lo que está lejos", "Un aparato para ver lo muy pequeño", "Un aparato para medir el calor de las cosas"),
  w("«Micro-» significa «pequeño». ¿Qué es un microscopio?", "Un aparato para ver lo muy pequeño", "Un aparato para ver lo que está lejos", "Un aparato para oír sonidos fuertes"),
  w("«Bio-» significa «vida». ¿Qué estudia la biología?", "Los seres vivos", "Las rocas", "Los números y las cuentas"),
  w("«Geo-» significa «tierra». ¿Qué estudia la geografía?", "La Tierra y sus lugares", "Los seres vivos", "Las estrellas lejanas del cielo"),
  w("«Foto-» significa «luz». ¿Qué es una fotografía?", "Una imagen hecha con luz", "Una imagen hecha con agua", "Un sonido grabado"),
  w("«Auto-» significa «por sí mismo». ¿Qué es un autorretrato?", "Un retrato de uno mismo", "Un retrato de un carro", "Un retrato de otra persona"),
  w("«Acua-» significa «agua». ¿Qué es un acuario?", "Un lugar con animales de agua", "Un lugar con aves", "Un lugar con plantas secas del desierto"),
  w("«Termo-» significa «calor». ¿Qué mide un termómetro?", "La temperatura", "La distancia recorrida", "El peso"),
];
const ROOT_MEANING = pool([
  ["tele- (teléfono, televisión, telescopio)", "lejos"], ["micro- (microscopio, microbio)", "chico"], ["bio- (biología, biografía)", "vida"],
  ["geo- (geografía, geología)", "tierra"], ["foto- (fotografía, fotosíntesis)", "luz"], ["acua- (acuario, acuático)", "agua"],
  ["termo- (termómetro, termo)", "calor"], ["zoo- (zoológico, zoología)", "animal"], ["-fono (teléfono, micrófono)", "sonido"], ["hidro- (hidratar, hidroavión)", "agua"],
].map(([t, a]) => [`¿Qué significa la raíz ${t}?`, a] as [string, string]), "p");
const ROOT_WORDS: ChoiceItem[] = [
  w("¿Qué significa «biografía»?", "Escrito sobre la vida de alguien", "Dibujo de la Tierra", "Estudio de los animales y de las plantas"),
  w("¿Qué significa «acuático»?", "Que vive o se hace en el agua", "Que vive en la tierra seca y caliente", "Que vuela muy alto"),
  w("¿Qué significa «zoológico»?", "Lugar donde se ven animales", "Lugar donde se ven plantas", "Lugar donde se ven estrellas"),
  w("¿Qué significa «microbio»?", "Ser vivo muy pequeño", "Ser vivo muy grande y fuerte", "Aparato para oír"),
  w("¿Qué significa «telecomunicación»?", "Comunicación a distancia", "Comunicación con gestos", "Comunicación bajo el agua"),
  w("¿Qué significa «geólogo»?", "Persona que estudia la Tierra", "Persona que estudia la vida marina", "Persona que toma fotos"),
  w("¿Qué significa «micrófono»?", "Aparato que capta sonidos", "Aparato que mide el calor del sol", "Aparato que ve lejos"),
  w("¿Qué significa «hidratarse»?", "Tomar agua", "Tomar sol", "Tomar aire"),
];

const COMPOUND_PIC = pool([
  ["☂️  para + ___", "aguas"], ["🧥  guarda + ___", "ropa"], ["🥫  abre + ___", "latas"], ["✏️  saca + ___", "puntas"], ["🧩  rompe + ___", "cabezas"],
  ["🕸️  tela + ___", "araña"], ["🪂  para + ___", "caídas"], ["🎂  cumple + ___", "años"], ["🍽️  lava + ___", "platos"], ["🚗  para + ___", "brisas"],
]);
const COMPOUND_FORM: ChoiceItem[] = [
  w("¿Qué palabra se forma con «salva» y «vidas»?", "salvavidas", "vidasalva", "salvidas"), w("¿Qué palabra se forma con «medio» y «día»?", "mediodía", "díamedio", "mediadía"),
  w("¿Qué palabra se forma con «pasa» y «manos»?", "pasamanos", "manospasa", "pasamano"), w("¿Qué palabra se forma con «quita» y «sol»?", "quitasol", "solquita", "quitasoles"),
  w("¿Qué palabra se forma con «punta» y «pie»?", "puntapié", "piepunta", "puntapies"), w("¿Qué palabra se forma con «boca» y «calle»?", "bocacalle", "calleboca", "bocalle"),
  w("¿Qué palabra se forma con «espanta» y «pájaros»?", "espantapájaros", "pájarosespanta", "espantapájaro"), w("¿Qué palabra se forma con «agua» y «fiestas»?", "aguafiestas", "fiestasagua", "aguafiesta"),
];
const COMPOUND_USE: ChoiceItem[] = [
  f("En la piscina hay un ___ que cuida a los bañistas.", "salvavidas", "paracaídas", "pasamanos"), f("Llueve mucho: lleva tu ___.", "paraguas", "parabrisas", "quitasol"),
  f("Sujétate del ___ al bajar la escalera.", "pasamanos", "salvavidas", "sacapuntas"), f("Almorzamos al ___, cuando el sol está en lo alto.", "mediodía", "cumpleaños", "pasatiempo"),
  f("El ___ de la chacra asusta a las aves.", "espantapájaros", "rompecabezas", "guardaespaldas"), f("Mi ___ favorito es armar maquetas.", "pasatiempo", "mediodía", "parabrisas"),
  f("No seas ___: déjanos seguir jugando.", "aguafiestas", "salvavidas", "sacapuntas"), f("Se me rompió la punta: préstame tu ___.", "sacapuntas", "abrelatas", "lavaplatos"),
];

const GROUPS: Record<string, string[]> = {
  "instrumentos musicales": ["quena", "cajón", "charango", "violín", "tambor", "zampoña"],
  "herramientas": ["martillo", "serrucho", "alicate", "pala", "destornillador", "llave inglesa"],
  "profesiones": ["enfermera", "carpintero", "piloto", "panadera", "ingeniero", "veterinaria"],
  "insectos": ["hormiga", "abeja", "mariposa", "grillo", "mosquito", "escarabajo"],
  "muebles": ["mesa", "ropero", "sillón", "estante", "cama", "cómoda"],
  "figuras geométricas": ["triángulo", "círculo", "rombo", "rectángulo", "hexágono", "trapecio"],
};
const GROUP_NAMES = Object.keys(GROUPS);
const othersOf = (g: string) => GROUP_NAMES.filter((k) => k !== g).flatMap((k) => GROUPS[k]);

const SYNONYMS = pool([
  ["veloz", "rápido"], ["hermoso", "bello"], ["enorme", "gigante"], ["iniciar", "empezar"], ["alegre", "contento"], ["temor", "miedo"],
  ["terminar", "acabar"], ["hablar", "charlar"], ["delgado", "flaco"], ["aroma", "perfume"], ["anciano", "viejo"], ["brincar", "saltar"],
].map(([x, a]) => [`¿Cuál es un sinónimo de «${x}»?`, a] as [string, string]), "p");
const ANTONYMS = pool([
  ["subir", "bajar"], ["ancho", "angosto"], ["valiente", "cobarde"], ["encender", "apagar"], ["temprano", "tarde"], ["limpio", "sucio"],
  ["ganar", "perder"], ["duro", "blando"], ["lleno", "vacío"], ["triste", "alegre"], ["abrir", "cerrar"], ["amigo", "enemigo"],
].map(([x, a]) => [`¿Cuál es un antónimo de «${x}»?`, a] as [string, string]), "p");

const SAME = "¿Qué oración significa lo mismo?";
const SAME_MEANING: ChoiceItem[] = [
  pt(SAME, "El niño estaba contento.", "El niño estaba alegre.", "El niño estaba triste.", "El niño estaba cansado."),
  pt(SAME, "La casa es enorme.", "La casa es gigante.", "La casa es pequeña.", "La casa es antigua."),
  pt(SAME, "Marta contestó la pregunta.", "Marta respondió la pregunta.", "Marta olvidó la pregunta.", "Marta escuchó la pregunta."),
  pt(SAME, "El perro es veloz.", "El perro es rápido.", "El perro es lento.", "El perro es manso."),
  pt(SAME, "Comenzó la función.", "Empezó la función.", "Terminó la función.", "Canceló la función."),
  pt(SAME, "Sentí temor en la cueva.", "Sentí miedo en la cueva.", "Sentí frío en la cueva.", "Sentí calma en la cueva."),
  pt(SAME, "El anciano descansa.", "El viejo reposa.", "El joven trabaja.", "El niño corre."),
];
const SYN_CONTEXT: ChoiceItem[] = [
  pt("¿Qué palabra del texto es sinónimo de «asustado»?", "El gato estaba asustado. Tan miedoso estaba que no salía de debajo de la cama.", "miedoso", "debajo", "salía"),
  pt("¿Qué palabra del texto es sinónimo de «bonito»?", "El jardín se veía bonito. Era el lugar más hermoso del barrio.", "hermoso", "lugar", "barrio"),
  pt("¿Qué palabra del texto es sinónimo de «cansado»?", "Llegué cansado del partido. Estaba tan agotado que me dormí con zapatillas.", "agotado", "partido", "dormí"),
  pt("¿Qué palabra del texto es sinónimo de «enojada»?", "La maestra estaba enojada por el desorden. Nunca la había visto tan molesta.", "molesta", "desorden", "visto"),
  pt("¿Qué palabra del texto es sinónimo de «difícil»?", "El problema era difícil. Era el más complicado de todo el cuestionario.", "complicado", "cuestionario", "problema"),
  pt("¿Qué palabra del texto es sinónimo de «mirar»?", "Me gusta mirar las estrellas. Puedo observar el cielo durante horas.", "observar", "cielo", "durante"),
  pt("¿Qué palabra del texto es sinónimo de «camino»?", "Seguimos el camino del río. El sendero era angosto y lleno de piedras.", "sendero", "angosto", "piedras"),
];
const ANT_SENTENCE: ChoiceItem[] = [
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "El café está CALIENTE.", "La limonada está fría.", "La sopa está tibia.", "El té está hirviendo."),
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "El examen fue FÁCIL.", "La tarea fue difícil.", "La clase fue sencilla.", "El juego fue simple."),
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "Mi abuelo es ALTO.", "Mi primo es bajo.", "Mi tío es enorme.", "Mi papá es grande."),
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "La calle está LIMPIA.", "El parque está sucio.", "La plaza está aseada.", "El patio está pulcro."),
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "Llegué TEMPRANO.", "Mi hermano llegó tarde.", "Ana llegó puntual, justo a la hora.", "Luis llegó pronto."),
  pt("¿Qué oración usa un antónimo de la palabra en MAYÚSCULAS?", "El león es FEROZ.", "El cordero es manso.", "El tigre es bravo.", "El lobo es salvaje."),
];
const ANT_CONTEXT: ChoiceItem[] = [
  pt("¿Qué palabra del texto es antónimo de «ruidosa»?", "La calle era ruidosa de día. En cambio, de noche quedaba callada.", "callada", "noche", "calle"),
  pt("¿Qué palabra del texto es antónimo de «llena»?", "La jarra estaba llena por la mañana. A mediodía ya estaba vacía.", "vacía", "jarra", "mediodía"),
  pt("¿Qué palabra del texto es antónimo de «valiente»?", "El ratón parecía valiente, pero frente al gato fue muy cobarde.", "cobarde", "frente", "ratón"),
  pt("¿Qué palabra del texto es antónimo de «recordar»?", "Quiero recordar su nombre, pero lo suelo olvidar.", "olvidar", "nombre", "suelo"),
  pt("¿Qué palabra del texto es antónimo de «antiguo»?", "El puente antiguo se cayó. Ahora cruzamos por uno moderno.", "moderno", "puente", "cruzamos"),
  pt("¿Qué palabra del texto es antónimo de «aumentar»?", "En verano va a aumentar el calor; en invierno va a disminuir.", "disminuir", "invierno", "verano"),
];

const HOMOPHONE_PIC = pool([
  ["🐄 Animal que da leche", "vaca"], ["🚗 Parrilla en el techo del carro", "baca"], ["🌊 Onda del mar", "ola"], ["👋 Saludo", "hola"],
  ["🪈 Cilindro hueco por donde pasa el agua", "tubo"], ["🧑 Pasado del verbo tener", "tuvo"], ["🗑️ Echar a la basura", "botar"], ["🗳️ Elegir en una elección", "votar"],
  ["🚩 Palo de la bandera", "asta"], ["⏰ Indica el límite: «___ las cinco»", "hasta"],
]);
const HOMOPHONE_ID: ChoiceItem[] = [
  w("¿Qué palabra suena igual que «vaca»?", "baca", "boca", "vacuna"), w("¿Qué palabra suena igual que «hola»?", "ola", "ala", "hoja"),
  w("¿Qué palabra suena igual que «tubo»?", "tuvo", "tuve", "tapa"), w("¿Qué palabra suena igual que «botar»?", "votar", "batir", "bote"),
  w("¿Qué palabra suena igual que «bello»?", "vello", "vela", "bollo"), w("¿Qué palabra suena igual que «hasta»?", "asta", "hasto", "pasta"),
  w("¿Qué palabra suena igual que «hay»?", "ay", "hoy", "ahí"), w("¿Qué palabra suena igual que «haya»?", "halla", "hoyo", "playa"),
  w("¿Qué palabra suena igual que «hecho»?", "echo", "techo", "hacha"), w("¿Qué palabra suena igual que «cien»?", "sien", "cine", "sin"),
];
const HOMOPHONE_USE: ChoiceItem[] = [
  f("¡___! ¿Cómo estás?", "Hola", "Ola"), f("Una ___ gigante mojó la toalla.", "ola", "hola"), f("Mi papá ___ que trabajar el domingo.", "tuvo", "tubo"),
  f("El agua pasa por un ___ de metal.", "tubo", "tuvo"), f("Hoy vamos a ___ para elegir al delegado.", "votar", "botar"), f("No debes ___ papeles al piso.", "botar", "votar"),
  f("En el jardín ___ muchas flores.", "hay", "ay"), f("¡___! Me pisaste el pie.", "Ay", "Hay"), f("Ya he ___ toda mi tarea.", "hecho", "echo"),
  f("Siempre le ___ azúcar a la leche.", "echo", "hecho"), f("La bandera ondea en el ___.", "asta", "hasta"), f("Te espero ___ las cinco.", "hasta", "asta"),
];

const MULTI_PIC = pool([
  ["🦙  🔥", "llama"], ["🍃  📄", "hoja"], ["🐭  🖱️", "ratón"], ["🪶  🖊️", "pluma"], ["✉️  🃏", "carta"], ["🏦  🪑", "banco"],
  ["🏆  🍷", "copa"], ["⛰️  🪚", "sierra"], ["🌱  🦶", "planta"], ["🔑  🚰", "llave"], ["🎵  📝", "nota"], ["🌙  🪞", "luna"],
], "pic");
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt("¿Qué significa «banco» en esta oración?", "Nos sentamos en el banco del parque.", "Asiento largo", "Lugar donde se guarda dinero", "Cardumen"),
  pt("¿Qué significa «banco» en esta oración?", "Mi mamá fue al banco a pagar la luz.", "Lugar donde se guarda dinero", "Asiento largo", "Grupo grande de peces en el mar"),
  pt("¿Qué significa «hoja» en esta oración?", "Arranqué una hoja del cuaderno.", "Lámina de papel", "Parte verde", "Parte que corta de un cuchillo"),
  pt("¿Qué significa «sierra» en esta oración?", "El carpintero cortó la tabla con la sierra.", "Herramienta para cortar", "Cadena de montañas muy altas", "Tipo de pez"),
  pt("¿Qué significa «sierra» en esta oración?", "En la sierra hace frío por las noches.", "Región de montañas", "Herramienta para cortar", "Tipo de pez"),
  pt("¿Qué significa «planta» en esta oración?", "Me duele la planta del pie.", "Parte de abajo del pie", "Ser vivo con hojas y raíces", "Piso de un edificio"),
  pt("¿Qué significa «copa» en esta oración?", "El nido está en la copa del árbol.", "Parte alta del árbol", "Vaso con pie para brindar", "Trofeo"),
  pt("¿Qué significa «carta» en esta oración?", "Pedimos la carta para elegir el almuerzo.", "Lista de platos", "Mensaje escrito", "Naipe"),
];
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  w("«Llama»: fuego que arde. ¿Qué oración usa ese significado?", "La llama de la vela se apagó.", "La llama come pasto en la puna.", "Mi tía me llama."),
  w("«Pluma»: lo que cubre a las aves. ¿Qué oración usa ese significado?", "El loro perdió una pluma.", "Firmó con su pluma.", "Compré una pluma azul para firmar."),
  w("«Ratón»: aparato de la computadora. ¿Qué oración usa ese significado?", "Mueve el ratón y haz clic.", "El ratón comió queso.", "El gato cazó un ratón en la cocina."),
  w("«Cola»: fila de personas. ¿Qué oración usa ese significado?", "Hicimos cola para entrar.", "El perro mueve la cola.", "Pegué el papel con cola."),
  w("«Nota»: calificación. ¿Qué oración usa ese significado?", "Saqué buena nota en ciencias.", "Tocó una nota aguda.", "Dejé una nota en la mesa de la sala."),
  w("«Muñeca»: parte del brazo. ¿Qué oración usa ese significado?", "Me doblé la muñeca al caer.", "Le regalé una muñeca.", "La muñeca tiene trenzas largas."),
  w("«Cabo»: punta de tierra en el mar. ¿Qué oración usa ese significado?", "El barco rodeó el cabo.", "Ató el cabo al muelle.", "El cabo saludó al sargento."),
];
const HOMONYM_CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «vela» aquí?", "Se fue la luz, así que encendimos una vela.", "Cilindro de cera con mecha", "Tela de un barco", "Acción de cuidar a alguien de noche"),
  pt("¿Qué significa «vela» aquí?", "El viento hinchó la vela y el bote avanzó.", "Tela de un barco", "Luz de cera", "Acción de cuidar de noche"),
  pt("¿Qué significa «gato» aquí?", "Papá usó el gato para levantar el carro y cambiar la llanta.", "Herramienta para levantar pesos", "Animal doméstico que maúlla y ronronea", "Juego de mesa"),
  pt("¿Qué significa «bota» aquí?", "Mi hermano siempre bota la cáscara en el tacho.", "Tira o arroja", "Calzado alto", "Recipiente de cuero"),
  pt("¿Qué significa «cura» aquí?", "Todavía no hay cura para ese resfrío.", "Remedio", "Padre", "Acción de sanar una herida"),
  pt("¿Qué significa «lima» aquí?", "La carpintera pulió el borde con una lima.", "Herramienta para pulir", "Fruta ácida", "Ciudad capital del Perú"),
  pt("¿Qué significa «cuarto» aquí?", "Llegué cuarto en la carrera.", "Después del tercero", "Habitación", "Parte de una hora o de un kilo"),
];

const SHADES_PIC = pool([
  ["🌧️ Caen unas pocas gotas finas.", "llovizna"], ["⛈️ Llueve muchísimo, con truenos.", "tormenta"], ["🙂 Sonríe tranquilo.", "contento"], ["🤩 Salta y grita de alegría.", "eufórico"],
  ["😠 Frunce el ceño.", "molesto"], ["🤬 Grita y patea el suelo.", "furioso"], ["🚶 Avanza paso a paso.", "caminar"], ["🏃 Avanza a toda velocidad.", "correr"],
  ["😢 Se le cae una lágrima.", "triste"], ["😭 Llora sin poder parar.", "afligido"],
]);
const DIFFERENCE: ChoiceItem[] = [
  w("¿En qué se diferencian «mirar» y «observar»?", "Observar es mirar con más atención.", "Mirar es más lento.", "No se diferencian en nada: son iguales."),
  w("¿En qué se diferencian «frío» y «helado»?", "Helado es mucho más frío.", "Frío es todavía mucho más frío.", "Helado es tibio."),
  w("¿En qué se diferencian «hablar» y «gritar»?", "Gritar es hablar muy fuerte.", "Hablar es más fuerte.", "Gritar es hablar en voz muy baja."),
  w("¿En qué se diferencian «comer» y «devorar»?", "Devorar es comer con muchas ganas.", "Comer es más rápido y con más ganas.", "Devorar es comer poco."),
  w("¿En qué se diferencian «grande» y «enorme»?", "Enorme es mucho más grande.", "Grande es mucho más que enorme.", "Enorme es pequeño."),
  w("¿En qué se diferencian «cansado» y «agotado»?", "Agotado es muy cansado.", "Cansado es más fuerte.", "Agotado es descansado."),
  w("¿En qué se diferencian «reír» y «carcajearse»?", "Carcajearse es reír muy fuerte.", "Reír es mucho más ruidoso que eso.", "Carcajearse es sonreír."),
];
const TONE = sorter(["Positiva", "Negativa"], "La palabra en MAYÚSCULAS, ¿da una idea positiva o negativa?");
const CONNOTATION: ChoiceItem[] = [
  TONE("Mi tío es AHORRATIVO: cuida su dinero.", 0), TONE("Mi tío es TACAÑO: no comparte nada.", 1), TONE("La niña es CURIOSA: quiere aprender.", 0), TONE("La niña es ENTROMETIDA: se mete en todo.", 1),
  TONE("El perro es DELGADO y ágil.", 0), TONE("El perro está ESCUÁLIDO y débil.", 1), TONE("Es un niño SEGURO de sí mismo.", 0), TONE("Es un niño PRESUMIDO.", 1),
  TONE("La casa tiene un AROMA a pan.", 0), TONE("La casa tiene un TUFO a humedad.", 1), TONE("Mi abuela es CONVERSADORA.", 0), TONE("Mi vecina es CHISMOSA.", 1),
];

const IDIOMS = pool([
  ["«Está lloviendo a cántaros»", "🌧️ Llueve muchísimo"], ["«Me quedé con la boca abierta»", "😲 Me sorprendí mucho"], ["«Estoy en las nubes»", "💭 Estoy distraído"],
  ["«Es pan comido»", "👍 Es muy fácil"], ["«Tengo un nudo en la garganta»", "🥺 Tengo ganas de llorar"], ["«Se le prendió el foco»", "💡 Tuvo una idea"],
  ["«Metió la pata»", "🙈 Se equivocó"], ["«Me muero de hambre»", "🍽️ Tengo mucha hambre"], ["«Dormí como un tronco»", "😴 Dormí profundamente"], ["«Echar una mano»", "🤝 Ayudar"],
].map(([t, a]) => [`¿Qué dibujo y significado corresponden a ${t}?`, a] as [string, string]), "p");

const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «diminuto»?", "El insecto era diminuto, tan pequeñito que casi no se veía.", "Muy pequeño", "Muy rápido", "Muy raro"),
  pt("¿Qué significa «exhausta»?", "Corrió tanto que quedó exhausta, es decir, muy cansada.", "Muy cansada", "Muy contenta", "Muy sucia"),
  pt("¿Qué significa «obsequio»?", "Recibí un obsequio, o sea, un regalo de mi madrina.", "Regalo", "Castigo", "Mensaje"),
  pt("¿Qué significa «sendero»?", "Caminamos por un sendero, un caminito entre los árboles.", "Camino angosto", "Río pequeño y seco", "Puente"),
  pt("¿Qué significa «colosal»?", "La estatua era colosal, enorme como un edificio.", "Enorme", "Antigua", "Frágil"),
  pt("¿Qué significa «veloz»?", "El tren es veloz; pocos vehículos son tan rápidos.", "Rápido", "Largo", "Ruidoso"),
  pt("¿Qué significa «morada»?", "El zorro volvió a su morada, su hogar bajo las rocas.", "Hogar", "Comida", "Color"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «sequía»?", "Por la sequía, los ríos bajaron y las plantas se marchitaron por falta de lluvia.", "Tiempo largo sin lluvia", "Lluvia muy fuerte con truenos", "Viento helado"),
  pt("¿Qué significa «frágil»?", "Lleva el jarrón con cuidado: es frágil y puede romperse.", "Que se rompe fácilmente", "Que pesa mucho", "Que es muy caro de comprar"),
  pt("¿Qué significa «madrugar»?", "Para ver el amanecer tuvimos que madrugar y salir a las cinco.", "Levantarse muy temprano", "Acostarse tarde", "Dormir la siesta por la tarde"),
  pt("¿Qué significa «nocturno»?", "El búho es nocturno: duerme de día y caza de noche.", "Activo de noche", "Activo de día", "Que no duerme"),
  pt("¿Qué significa «escaso»?", "El agua era escasa, así que cada familia recibía solo un balde.", "Que hay poco", "Que hay mucho", "Que está sucio"),
  pt("¿Qué significa «refugio»?", "Empezó a granizar y buscamos refugio bajo un techo.", "Lugar para protegerse", "Lugar para nadar", "Comida caliente y sabrosa"),
  pt("¿Qué significa «brotar»?", "Con las primeras lluvias, las semillas empezaron a brotar de la tierra.", "Empezar a salir", "Secarse por el sol", "Caerse"),
];
const ACADEMIC: ChoiceItem[] = [
  f("Para ___ dos animales, digo en qué se parecen y en qué se diferencian.", "comparar", "resumir", "predecir"),
  f("Un ___ es contar lo más importante de un texto con pocas palabras.", "resumen", "título", "ejemplo"),
  f("Antes de leer, puedo ___ de qué tratará el cuento mirando la portada.", "predecir", "ordenar", "copiar"),
  f("La ___ es lo que el experimento demuestra al final.", "conclusión", "pregunta", "portada"),
  f("Para ___ una opinión, doy razones y ejemplos.", "justificar", "desordenar", "medir"),
  f("___ es poner las cosas en grupos según lo que tienen en común.", "Clasificar", "Estimar", "Subrayar"),
  f("Una ___ es una idea que todavía hay que comprobar.", "hipótesis", "respuesta", "tabla"),
  f("___ es explicar con detalle cómo es algo.", "Describir", "Sumar", "Seleccionar"),
];

const ABC1 = [["ardilla", "búho", "cóndor", "delfín", "erizo", "foca", "gaviota", "halcón", "iguana", "jaguar", "koala", "loro", "nutria", "oveja", "puma", "rana", "tapir", "vicuña", "zorro"]];
const ABC2 = [["cabra", "cebra", "cisne", "cocodrilo", "cuy"], ["maíz", "melón", "miel", "mora", "muña"], ["pala", "peine", "pinza", "polea", "puerta"], ["sapo", "serpiente", "sirena", "sol", "suri"], ["tapa", "tela", "tinta", "torre", "tubo"], ["lago", "león", "libro", "loma", "luna"]];
const ABC3 = [["cabra", "cadena", "caja", "caldo", "cama", "canto"], ["mago", "maíz", "mano", "mapa", "marea", "masa"], ["pared", "parque", "pasto", "pato", "pavo"], ["tabla", "taco", "tallo", "tambor", "tapa", "taza"], ["coche", "codo", "cofre", "cola", "copa", "corona"]];
const ABC4 = [["camino", "camión", "camisa", "campo", "campana"], ["planeta", "plano", "planta", "plata", "plato"], ["cartel", "carta", "cartón", "carro", "carrera"], ["portada", "portal", "portero", "porción", "porque"], ["estrella", "estrecho", "estreno", "estuche", "estufa"]];

const GUIDE_WORDS: ChoiceItem[] = [
  w("Las palabras guía de la página son «barco» y «bolsa». ¿Qué palabra está en esa página?", "bicicleta", "bandolera", "botón", "avión"),
  w("Las palabras guía de la página son «madera» y «mesa». ¿Qué palabra está en esa página?", "mariposa", "luna", "mostrador", "música"),
  w("Las palabras guía de la página son «parque» y «pez». ¿Qué palabra está en esa página?", "pelota", "pared", "piano", "queso"),
  w("Las palabras guía de la página son «cielo» y «codo». ¿Qué palabra está en esa página?", "ciudad", "cebra", "color", "dedo"),
  w("Las palabras guía de la página son «flor» y «fuego». ¿Qué palabra está en esa página?", "fruta", "fideo", "fútbol", "gato"),
  w("Las palabras guía de la página son «tela» y «tinta». ¿Qué palabra está en esa página?", "tigre", "taza", "torre", "sopa"),
  w("Las palabras guía de la página son «rama» y «reloj». ¿Qué palabra está en esa página?", "regalo", "queso", "remo", "risa"),
  w("Las palabras guía de la página son «gallo» y «gorro». ¿Qué palabra está en esa página?", "globo", "gota", "foca", "grillo"),
];
const ENTRY = "colibrí s. m. Ave muy pequeña, de pico largo y fino, que bate las alas muy rápido. Pl. colibríes.";
const ENTRY2 = "veloz adj. Que se mueve muy rápido. Sin. rápido. Ant. lento.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada del diccionario, ¿qué clase de palabra es «colibrí»?", ENTRY, "Sustantivo masculino", "Adjetivo calificativo", "Verbo"),
  pt("Según la entrada del diccionario, ¿cuál es el plural de «colibrí»?", ENTRY, "colibríes", "colibríos", "colibrices"),
  pt("Según la entrada del diccionario, ¿qué es un colibrí?", ENTRY, "Un ave muy pequeña", "Un pez de río muy veloz", "Un insecto"),
  pt("Según la entrada del diccionario, ¿qué clase de palabra es «veloz»?", ENTRY2, "Adjetivo", "Sustantivo", "Verbo"),
  pt("Según la entrada del diccionario, ¿cuál es un sinónimo de «veloz»?", ENTRY2, "rápido", "lento", "fuerte"),
  pt("Según la entrada del diccionario, ¿cuál es un antónimo de «veloz»?", ENTRY2, "lento", "rápido", "ágil"),
  pt("¿Qué indica la abreviatura «adj.» en una entrada?", ENTRY2, "Que la palabra es un adjetivo", "Que la palabra es antigua y rara", "Que tiene acento"),
  pt("¿Qué indica la abreviatura «s. m.» en una entrada?", ENTRY, "Sustantivo masculino", "Significado muy moderno", "Sin mayúscula"),
];
const BANK_ENTRY = "banco s. m. 1. Asiento largo para varias personas. 2. Lugar donde se guarda y se presta dinero. 3. Grupo grande de peces.";
const LEAF_ENTRY = "hoja s. f. 1. Parte verde y plana de las plantas. 2. Lámina de papel. 3. Parte que corta de un cuchillo.";
const DEFINITIONS: ChoiceItem[] = [
  pt("¿Qué definición corresponde a «El buzo vio un banco de sardinas»?", BANK_ENTRY, "La definición 3", "La definición 1", "La definición 2"),
  pt("¿Qué definición corresponde a «Abrí una cuenta en el banco»?", BANK_ENTRY, "La definición 2", "La definición 1", "La definición 3"),
  pt("¿Qué definición corresponde a «El abuelo descansa en el banco»?", BANK_ENTRY, "La definición 1", "La definición 2", "La definición 3"),
  pt("¿Qué definición corresponde a «Escribe tu nombre en la hoja»?", LEAF_ENTRY, "La definición 2", "La definición 1", "La definición 3"),
  pt("¿Qué definición corresponde a «Cuidado con la hoja, que está afilada»?", LEAF_ENTRY, "La definición 3", "La definición 1", "La definición 2"),
  pt("¿Qué definición corresponde a «Cayó una hoja seca del árbol»?", LEAF_ENTRY, "La definición 1", "La definición 2", "La definición 3"),
];

export const ROWS: Row[] = [
  ["EE.1", "Identificar la palabra base, el prefijo y el sufijo", (r) => choose(r, "", PARTS)],
  ["EE.2", "Determinar el significado de palabras con pre-, re- y des-", (r) => choose(r, "", PREFIX_MEANING)],
  ["EE.3", "Usar los prefijos pre-, re- y des-", (r) => choose(r, "Completa la oración.", PREFIX_USE)],
  ["EE.4", "Determinar el significado de palabras con -oso y con in-", (r) => choose(r, "", OSO_IN)],
  ["EE.5", "Determinar el significado de palabras con -mente, -eza y -dad", (r) => choose(r, "", MENTE_EZA)],
  ["EE.6", "Determinar el significado de palabras con -able, -ible y -miento", (r) => choose(r, "", ABLE_MIENTO)],
  ["EE.7", "Determinar el significado de palabras con sufijo: repaso", (r) => choose(r, "", [...OSO_IN.filter((x) => x.p!.includes("oso»")), ...MENTE_EZA, ...ABLE_MIENTO])],
  ["EE.8", "Determinar el significado de palabras con prefijos y sufijos: repaso", (r) => choose(r, "", [...PREFIX_MEANING, ...OSO_IN, ...MENTE_EZA, ...ABLE_MIENTO])],
  ["EE.9", "Clasificar por significado palabras con el mismo prefijo", (r) =>
    mix(r, [
      (q) => pickAll(q, "Selecciona las palabras en las que «re-» significa «otra vez».", RE_AGAIN.yes, RE_AGAIN.no, "re"),
      (q) => pickAll(q, "Selecciona las palabras en las que «des-» significa «lo contrario».", DES_OPPOSITE.yes, DES_OPPOSITE.no, "des"),
      (q) => pickAll(q, "Selecciona las palabras en las que «in-» significa «no».", IN_NOT.yes, IN_NOT.no, "in"),
    ])],
  ["EE.10", "Clasificar por clase de palabra las palabras con sufijo", (r) => choose(r, "", SUFFIX_SPEECH)],
  ["EE.11", "Analogías con patrones de palabras", (r) => choose(r, "Completa la analogía.", ANALOGIES)],
  ["EE.12", "Oraciones con patrones de palabras", (r) => choose(r, "Completa la oración.", PATTERN_SENTENCES)],

  ["FF.1", "Usar raíces griegas y latinas como pistas del significado", (r) => choose(r, "", ROOT_CLUES)],
  ["FF.2", "Determinar el significado de raíces griegas y latinas", (r) => choose(r, "", ROOT_MEANING)],
  ["FF.3", "Determinar el significado de palabras con raíces griegas y latinas", (r) => choose(r, "", ROOT_WORDS)],

  ["GG.1", "Formar palabras compuestas con dibujos", (r) => choose(r, "¿Qué palabra falta para formar la palabra compuesta del dibujo?", COMPOUND_PIC)],
  ["GG.2", "Formar palabras compuestas", (r) => choose(r, "", COMPOUND_FORM)],
  ["GG.3", "Formar y usar palabras compuestas", (r) => choose(r, "Completa la oración.", COMPOUND_USE)],

  ["HH.1", "Seleccionar los miembros de un grupo", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que pertenecen al grupo: ${g}.`, GROUPS[g], othersOf(g), g);
  }],
  ["HH.2", "Seleccionar las palabras que no pertenecen al grupo", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que NO pertenecen al grupo: ${g}.`, othersOf(g), GROUPS[g], g);
  }],

  ["II.1", "Elegir el sinónimo", (r) => choose(r, "", SYNONYMS)],
  ["II.2", "¿Qué oración tiene el mismo significado?", (r) => choose(r, "", SAME_MEANING)],
  ["II.3", "Encontrar sinónimos en contexto", (r) => choose(r, "", SYN_CONTEXT)],
  ["II.4", "Elegir el antónimo", (r) => choose(r, "", ANTONYMS)],
  ["II.5", "¿Qué oración usa un antónimo?", (r) => choose(r, "", ANT_SENTENCE)],
  ["II.6", "Encontrar antónimos en contexto", (r) => choose(r, "", ANT_CONTEXT)],

  ["JJ.1", "Homófonos con dibujos", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la pista?", HOMOPHONE_PIC)],
  ["JJ.2", "Identificar homófonos", (r) => choose(r, "", HOMOPHONE_ID)],
  ["JJ.3", "Usar el homófono correcto", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["JJ.4", "Palabras con varios significados, con dibujos", (r) => choose(r, "Una misma palabra nombra los dos dibujos. ¿Cuál es?", MULTI_PIC)],
  ["JJ.5", "¿Qué definición corresponde a la oración?", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["JJ.6", "¿Qué oración corresponde a la definición?", (r) => choose(r, "", SENTENCE_FOR_DEF)],
  ["JJ.7", "Usar el contexto para determinar el significado de homónimos", (r) => choose(r, "", HOMONYM_CONTEXT)],

  ["KK.1", "Matices de significado con dibujos", (r) => choose(r, "¿Qué palabra describe mejor el dibujo?", SHADES_PIC)],
  ["KK.2", "Describir la diferencia entre palabras parecidas", (r) => choose(r, "", DIFFERENCE)],
  ["KK.3", "Connotación positiva y negativa", (r) => choose(r, "", CONNOTATION)],

  ["LL.1", "Elegir el dibujo que corresponde a la expresión", (r) => choose(r, "", IDIOMS)],

  ["MM.1", "Determinar el significado de palabras usando sinónimos en contexto", (r) => choose(r, "", SYN_CLUE)],
  ["MM.2", "Usar el contexto para identificar el significado de una palabra", (r) => choose(r, "", CONTEXT)],
  ["MM.3", "Usar vocabulario académico en contexto", (r) => choose(r, "Completa la oración.", ACADEMIC)],

  ["NN.1", "Ordenar alfabéticamente según la primera letra", (r) => abcOrder(r, ABC1, "Mira la primera letra.")],
  ["NN.2", "Ordenar alfabéticamente según las dos primeras letras", (r) => abcOrder(r, ABC2, "Empiezan igual: mira la segunda letra.")],
  ["NN.3", "Ordenar alfabéticamente según las tres primeras letras", (r) => abcOrder(r, ABC3, "Las dos primeras letras son iguales: mira la tercera.")],
  ["NN.4", "Ordenar alfabéticamente: desafío", (r) => abcOrder(r, ABC4, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["NN.5", "Usar las palabras guía", (r) => choose(r, "", GUIDE_WORDS)],
  ["NN.6", "Usar las entradas del diccionario", (r) => choose(r, "", DICTIONARY)],
  ["NN.7", "Usar las definiciones del diccionario", (r) => choose(r, "", DEFINITIONS)],
];
