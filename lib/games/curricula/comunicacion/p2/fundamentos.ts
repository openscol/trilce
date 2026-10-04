import * as P from "../../../generators/lengua/phonics";
import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, pickAll, readPassage, type ChoiceItem, type Passage } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "./row";

// Fundamentos de lectura (IXL 2nd grade ELA, A-T), adaptados al castellano
// igual que en 1.°: lo que en inglés es fonética propia de ese idioma pasa a
// su equivalente en nuestra lectoescritura.
//   dígrafos y trígrafos (ch, sh, -dge...) → ch, ll, rr, qu, gu, gue/gui
//   silent e → h muda            vowel teams → diptongos
//   short/long vowels → vocal sola o en diptongo
//   long vowel patterns → c/qu, g/gu, c/z, g/j, r/rr
//   r-controlled → r suave y fuerte   diphthongs oi/ou → ai, au, ei, eu, oi
//   variant vowels → gue, gui, güe, güi   consonant-l-e → bl, cl, gl, pl

export const SECTIONS: Section[] = [
  { id: "A", name: "Rima", icon: "🎵" },
  { id: "B", name: "Sílabas", icon: "👏" },
  { id: "C", name: "Cambiar y quitar sonidos", icon: "🔄" },
  { id: "D", name: "Dígrafos y letras mudas", icon: "🔗" },
  { id: "E", name: "Dígrafos y trabadas", icon: "🧱" },
  { id: "F", name: "Vocales", icon: "🔠" },
  { id: "G", name: "La h muda", icon: "🤫" },
  { id: "H", name: "Diptongos", icon: "👯" },
  { id: "I", name: "Vocal sola o en diptongo", icon: "🎯" },
  { id: "J", name: "Patrones ortográficos", icon: "✍️" },
  { id: "K", name: "La r: suave y fuerte", icon: "🐯" },
  { id: "L", name: "Diptongos: ai, au, ei, eu, oi", icon: "👑" },
  { id: "M", name: "Gue, gui, güe y güi", icon: "🐧" },
  { id: "N", name: "C y g: sonido suave y fuerte", icon: "🦓" },
  { id: "O", name: "Sílabas abiertas y cerradas", icon: "🚪" },
  { id: "P", name: "Sílabas avanzadas", icon: "🧗" },
  { id: "Q", name: "Palabras de varias sílabas", icon: "✌️" },
  { id: "R", name: "Palabras con prefijos y sufijos", icon: "🧩" },
  { id: "S", name: "Palabras frecuentes", icon: "⭐" },
  { id: "T", name: "Cuentos para leer", icon: "📚" },
];

// Oración que corresponde a un dibujo; los distractores son las demás.
function sentencesFor(list: [string, string][]): ChoiceItem[] {
  return list.map(([pic, a]) => ({ pic, a, d: list.map(([, s]) => s).filter((s) => s !== a) }));
}

const partsOf = (list: string, re: RegExp) => list.split(" ").map((w) => ({ w, part: (w.match(re) ?? [""])[0] }));

// --- A. Rima -------------------------------------------------------------------

const COUPLETS: ChoiceItem[] = [
  { t: "El gato Renato\nperdió su ___.", a: "zapato", d: ["sombrero", "pelota", "camisa"] },
  { t: "En la ventana\ncanta una ___.", a: "rana", d: ["gallina", "tortuga", "paloma"] },
  { t: "Salió el camión\ncargado de ___.", a: "melón", d: ["sandía", "naranja", "fresa"] },
  { t: "La mariposa\nse posa en la ___.", a: "rosa", d: ["hoja", "rama", "piedra"] },
  { t: "Con mi trompeta\nvoy en ___.", a: "bicicleta", d: ["camión", "autobús", "barco"] },
  { t: "Sobre la arena\nduerme la ___.", a: "sirena", d: ["tortuga", "gaviota", "foca"] },
  { t: "El bombero\nperdió su ___.", a: "sombrero", d: ["casco", "bota", "manguera"] },
  { t: "Sube a la silla\nla pequeña ___.", a: "ardilla", d: ["hormiga", "tortuga", "abeja"] },
];

const POEMS: ChoiceItem[] = [
  { t: "Tengo un perrito lanudo\nque me sigue al caminar.\nCuando llego de la escuela\nél se pone a ___.", a: "saltar", d: ["dormido", "comida", "corriendo"] },
  { t: "La luna sale de noche,\nel sol sale al despertar.\nLas estrellas en el cielo\nno dejan de ___.", a: "brillar", d: ["luces", "dormidas", "oscuro"] },
  { t: "Mi abuela teje una manta\nde lana de mil colores.\nCuando termina, la adorna\ncon un ramito de ___.", a: "flores", d: ["hojas", "hilos", "botones"] },
  { t: "En el huerto de mi tío\ncrecen papas y maíz.\nCuando llueve, cada planta\nse despierta muy ___.", a: "feliz", d: ["contenta", "mojada", "verde"] },
  { t: "El río baja cantando\nentre piedras y arena.\nEn la orilla, muy contenta,\ncanta una ___.", a: "sirena", d: ["tortuga", "gaviota", "ranita"] },
  { t: "Tres patitos van al lago\ncaminando sin parar.\nEl más chico se retrasa\nporque quiere ___.", a: "jugar", d: ["comida", "dormido", "nadando"] },
];

const RIDDLES: { clue: string; w: string }[] = [
  { clue: "Rima con «gato»\ny nada en el lago.", w: "pato" },
  { clue: "Rima con «camión»\ny le gusta el queso.", w: "ratón" },
  { clue: "Rima con «bota»\ny cae cuando llueve.", w: "gota" },
  { clue: "Rima con «luna»\ny en ella duerme el bebé.", w: "cuna" },
  { clue: "Rima con «mesa»\ny es una fruta roja y pequeña.", w: "fresa" },
  { clue: "Rima con «arena»\ny es el animal más grande del mar.", w: "ballena" },
  { clue: "Rima con «pelota»\ny se pone en el pie.", w: "bota" },
  { clue: "Rima con «rana»\ny la abro para ver la calle.", w: "ventana" },
  { clue: "Rima con «silla»\ny trepa a los árboles.", w: "ardilla" },
  { clue: "Rima con «sol»\ny lleva su casa a cuestas.", w: "caracol" },
];

// --- D. Dígrafos y letras mudas ---------------------------------------------------

const DIGRAPH_READ = "coche leche llave pollo silla perro gorro zorro queso llama cuchara chocolate guitarra águila paquete mosquito";
const DIGRAPHS = partsOf("chocolate llave lluvia queso coche leche cuchara pollo silla caballo galleta estrella gallina perro zorro gorro guitarra paquete raqueta mosquito águila juguete", /ch|ll|rr|qu|gu/);

const SILENT: ChoiceItem[] = [
  { pic: "🍦", t: "_elado", a: "h", d: ["j", "g", "b"] },
  { pic: "🥚", t: "_uevo", a: "h", d: ["g", "b", "j"] },
  { pic: "🍃", t: "_oja", a: "h", d: ["j", "g", "ll"] },
  { pic: "🧊", t: "_ielo", a: "h", d: ["y", "ll", "g"] },
  { pic: "🎸", t: "g_itarra", a: "u", d: ["ü", "e", "o"] },
  { pic: "🧀", t: "q_eso", a: "u", d: ["e", "i", "ü"] },
  { pic: "🦅", t: "ág_ila", a: "u", d: ["ü", "e", "a"] },
  { pic: "🧸", t: "jug_ete", a: "u", d: ["ü", "e", "i"] },
  { pic: "🦟", t: "mosq_ito", a: "u", d: ["i", "e", "ü"] },
  { pic: "🦉", t: "bú_o", a: "h", d: ["j", "g", "y"] },
];

// --- E. Trabadas ---------------------------------------------------------------------

// Palabras cuya terminación solo admite una de las sílabas de las opciones
// (no «tronco»: también valdrían «blanco», «brinco» y «fresco»).
const BLEND_SYLLABLES = [
  { w: "planta", part: "plan" }, { w: "frescura", part: "fres" }, { w: "cristal", part: "cris" }, { w: "princesa", part: "prin" },
  { w: "tramposo", part: "tram" }, { w: "granja", part: "gran" }, { w: "brindis", part: "brin" }, { w: "plancha", part: "plan" },
  { w: "trompeta", part: "trom" },
];
const BLEND_CHOICES = ["plan", "fres", "cris", "prin", "tram", "gran", "brin", "trom", "tron"];

const BLEND_SENTENCES: ChoiceItem[] = [
  { t: "Riego la ___ todas las mañanas.", a: "planta", d: ["plancha", "playa", "plata"] },
  { t: "El oso polar es de color ___.", a: "blanco", d: ["banco", "blando", "brinco"] },
  { t: "El pájaro carpintero pica el ___ del árbol.", a: "tronco", d: ["trompo", "trono", "trineo"] },
  { t: "La ___ del cuento vivía en un castillo.", a: "princesa", d: ["promesa", "prensa", "primavera"] },
  { t: "El ratón cayó en la ___.", a: "trampa", d: ["trompa", "tropa", "trenza"] },
  { t: "Mi papá toca la ___ en la banda.", a: "trompeta", d: ["trampa", "tormenta", "tropa"] },
  { t: "El elefante es un animal muy ___.", a: "grande", d: ["grano", "grado", "ganso"] },
  { t: "El vaso es de ___ y se puede romper.", a: "cristal", d: ["cresta", "crema", "costal"] },
];

// --- G. La h muda ----------------------------------------------------------------------

const H_WORDS = "helado hoja huevo hormiga hilo hada hielo hueso búho zanahoria huella hamburguesa";

const H_COMPLETE: ChoiceItem[] = [
  { pic: "🥚", t: "__evo", a: "hu", d: ["u", "gu", "bu"] },
  { pic: "🦴", t: "__eso", a: "hu", d: ["u", "gu", "ju"] },
  { pic: "🧊", t: "__elo", a: "hi", d: ["i", "y", "lli"] },
  { pic: "🍃", t: "__ja", a: "ho", d: ["o", "jo", "go"] },
  { pic: "🧚", t: "__da", a: "ha", d: ["a", "ja", "ga"] },
  { pic: "🧵", t: "__lo", a: "hi", d: ["i", "ji", "y"] },
  { pic: "🐜", t: "__rmiga", a: "ho", d: ["o", "jo", "go"] },
  { pic: "🍦", t: "__lado", a: "he", d: ["e", "je", "ge"] },
  { pic: "🐾", t: "__ella", a: "hu", d: ["u", "gu", "bu"] },
];

const SENT_H: [string, string][] = [
  ["🍦", "Hugo come un helado de fresa."],
  ["🥚", "La gallina puso un huevo."],
  ["🐜", "La hormiga lleva una hoja."],
  ["🧚", "El hada tiene alas."],
  ["🧊", "Hay hielo en el vaso."],
  ["🦉", "El búho duerme de día."],
  ["🐾", "El perro dejó una huella."],
  ["🍔", "Helena pidió una hamburguesa."],
];

// --- H. Diptongos -----------------------------------------------------------------------

const DIPH = /ia|ie|io|ua|ue|ei|ai|au|eu|oi|iu|ui/;
const DIPH_WORDS = "piano agua huevo hueso puerta nieve hielo fuego lluvia serpiente cuaderno guante reina dinosaurio zanahoria ciervo pueblo niebla puente ciudad";

const SENT_DIPH: [string, string][] = [
  ["🎹", "Lucía toca el piano."],
  ["❄️", "La nieve cubre la montaña."],
  ["🔥", "El fuego calienta la olla."],
  ["🚪", "Cierra la puerta, por favor."],
  ["🌉", "Cruzamos el puente a pie."],
  ["🏘️", "Mi abuelo vive en un pueblo."],
  ["🧤", "Perdí un guante en el parque."],
  ["🌧️", "La lluvia moja la ciudad."],
];

// --- I. Vocal sola o en diptongo ---------------------------------------------------------

const WITH_DIPH = ["piano", "agua", "huevo", "puerta", "nieve", "fuego", "lluvia", "reina", "pueblo", "ciudad", "viaje", "cielo", "fiesta", "abuela", "cuento"];
const NO_DIPH = ["casa", "pato", "luna", "mesa", "perro", "libro", "tomate", "camisa", "pelota", "ventana", "conejo", "zapato"];

// --- J. Patrones ortográficos ---------------------------------------------------------------

const QU = { yes: ["queso", "paquete", "raqueta", "mosquito", "bosque", "máquina", "esquina", "quince"], no: ["casa", "conejo", "cuchara", "coche", "foca", "vaca", "boca", "corona"] };
const GU = { yes: ["guitarra", "águila", "juguete", "hamburguesa", "manguera", "guiso", "guerra"], no: ["gato", "gorro", "gallina", "gorila", "tortuga", "lago", "gota"] };
const Z = { yes: ["zapato", "zorro", "taza", "zanahoria", "pozo", "azul", "zumo"], no: ["cebra", "cine", "cielo", "cena", "dulce", "cocina", "ciruela"] };
const J = { yes: ["jirafa", "ojo", "oreja", "hoja", "tijera", "conejo", "naranja", "jugo"], no: ["gigante", "girasol", "gema", "gente", "mágico", "página", "general"] };
const RR = { yes: ["perro", "zorro", "gorro", "guitarra", "carro", "burro", "tierra", "cerro"], no: ["pera", "loro", "toro", "oreja", "corona", "tijera", "ratón", "rosa"] };

const WELL_WRITTEN: ChoiceItem[] = [
  { t: "La ___ da leche.", a: "vaca", d: ["baca", "vaka", "baka"] },
  { t: "Me puse el ___ nuevo.", a: "zapato", d: ["sapato", "zapatto", "çapato"] },
  { t: "El ___ maúlla en el tejado.", a: "gato", d: ["jato", "guato", "gatto"] },
  { t: "Corté el papel con la ___.", a: "tijera", d: ["tigera", "tijerra", "tigerra"] },
  { t: "El ___ ladra muy fuerte.", a: "perro", d: ["pero", "perrro", "pejo"] },
  { t: "Comí pan con ___.", a: "queso", d: ["keso", "ceso", "cueso"] },
  { t: "Toco la ___ en la fiesta.", a: "guitarra", d: ["gitarra", "guitara", "jitarra"] },
  { t: "La ___ tiene el cuello largo.", a: "jirafa", d: ["girafa", "jirrafa", "guirafa"] },
  { t: "Cayó mucha ___ en la noche.", a: "lluvia", d: ["yuvia", "llubia", "yubia"] },
  { t: "La ___ tiene rayas blancas y negras.", a: "cebra", d: ["zebra", "sebra", "cevra"] },
];

// --- K. La r ---------------------------------------------------------------------------------

const R_WORDS = "ratón rosa rana reloj regalo rey reina perro zorro gorro pera loro corona tijera oreja robot regla arroz";
const R_VOWEL = [
  { w: "barco", part: "ar" }, { w: "martillo", part: "ar" }, { w: "ardilla", part: "ar" }, { w: "mar", part: "ar" },
  { w: "cerdo", part: "er" }, { w: "serpiente", part: "er" }, { w: "cuaderno", part: "er" }, { w: "puerta", part: "er" },
  { w: "hormiga", part: "or" }, { w: "tortuga", part: "or" }, { w: "tambor", part: "or" }, { w: "flor", part: "or" },
  { w: "murciélago", part: "ur" }, { w: "hamburguesa", part: "ur" }, { w: "circo", part: "ir" }, { w: "mirlo", part: "ir" },
];
// Un solo hueco para «r» y para «rr»: si no, el tamaño del hueco daría la respuesta.
const R_OR_RR: ChoiceItem[] = [
  ...["perro", "zorro", "gorro", "guitarra", "arroz", "carro", "burro", "torre"].map((w) => ({ t: w.replace("rr", "_"), a: "rr", d: ["r"], say: w, e: `Se escribe «${w}».` })),
  ...["pera", "loro", "corona", "tijera", "oreja", "jirafa", "mariposa", "tiburón"].map((w) => ({ t: w.replace("r", "_"), a: "r", d: ["rr"], say: w, e: `Se escribe «${w}».` })),
];

const SENT_R: [string, string][] = [
  ["🐶", "El perro corre por el cerro."],
  ["🐭", "El ratón roe un rico queso."],
  ["🎁", "Rosa recibió un regalo."],
  ["🦜", "El loro repite lo que oye."],
  ["👑", "La reina lleva una corona."],
  ["🦊", "El zorro se esconde en la tierra."],
  ["🤖", "El robot recoge los juguetes."],
  ["🍚", "Ramiro come arroz con pollo."],
];

// --- L. Diptongos con i y u ---------------------------------------------------------------------

const IU_DIPH = partsOf("reina astronauta baile seis dinosaurio peine jaula aire boina neutro deuda oigo flauta veinte aceite pausa", /ai|au|ei|eu|oi/);

const SENT_IU: [string, string][] = [
  ["👸", "La reina saluda desde el balcón."],
  ["🧑‍🚀", "El astronauta viaja en un cohete."],
  ["💃", "Paula aprende un baile nuevo."],
  ["🦕", "El dinosaurio era enorme."],
  ["🤴", "El rey vive en un castillo."],
  ["🐂", "El buey jala la carreta."],
  ["6️⃣", "Tengo seis lápices de colores."],
];

// --- M. Gue, gui, güe, güi ---------------------------------------------------------------------

const GUE_GUI = partsOf("guitarra águila juguete hamburguesa guepardo pingüino cigüeña vergüenza manguera guiso bilingüe paragüitas hoguera guinda", /güe|güi|gue|gui/);

const U_SOUNDS: ChoiceItem[] = [
  { p: "¿En cuál de estas palabras SÍ suena la u?", a: "pingüino", d: ["guitarra", "guiso", "águila"] },
  { p: "¿En cuál de estas palabras SÍ suena la u?", a: "cigüeña", d: ["manguera", "guiso", "hoguera"] },
  { p: "¿En cuál de estas palabras SÍ suena la u?", a: "vergüenza", d: ["guerra", "guinda", "hoguera"] },
  { p: "¿En cuál de estas palabras NO suena la u?", a: "guitarra", d: ["pingüino", "agua", "guante"] },
  { p: "¿En cuál de estas palabras NO suena la u?", a: "guiso", d: ["cigüeña", "paraguas", "igual"] },
  { p: "¿En cuál de estas palabras NO suena la u?", a: "águila", d: ["bilingüe", "lengua", "guapo"] },
  { p: "¿En cuál de estas palabras SÍ suena la u?", a: "paraguas", d: ["guepardo", "guiso", "guía"] },
  { p: "¿En cuál de estas palabras NO suena la u?", a: "queso", d: ["cuatro", "cuento", "escuela"] },
];

// --- N. C y g suaves y fuertes ------------------------------------------------------------------

const SOFT_C = ["cebra", "cereza", "cine", "cielo", "cisne", "cerdo", "ciudad", "cena"];
const HARD_C = ["casa", "coche", "cuchara", "conejo", "foca", "vaca", "boca", "cuna"];
const SOFT_G = ["girasol", "gema", "genio", "gigante", "gente", "página", "gelatina"];
const HARD_G = ["gato", "gorro", "gusano", "tortuga", "lago", "gota", "amigo"];
const SOFT_PICS = "cebra cereza cerdo cisne ciervo ciudad girasol gema genio";

const SENT_SOFT: [string, string][] = [
  ["🦓", "La cebra cena en el cerro."],
  ["🍒", "Cecilia come una cereza."],
  ["🦢", "El cisne nada en el lago."],
  ["🌻", "El girasol gira hacia el sol."],
  ["🧞", "El genio salió de la lámpara."],
  ["💎", "La gema brilla mucho."],
  ["🦌", "El ciervo corre por el bosque."],
  ["🏙️", "En la ciudad hay muchos edificios."],
];

// --- O / P / Q. Sílabas ---------------------------------------------------------------------------

const OPEN_CLOSED = "sol pan mar pez tren flor barco pulpo cerdo tambor pastel pato luna mano rana nido foca sopa casa gato cactus robot volcán delfín jabón bosque";
const TWO_OPEN_CLOSED = "pa-to lu-na bar-co pul-po cer-do tam-bor pas-tel ro-bot vol-cán del-fín ja-bón cac-tus ca-sa bos-que mon-te car-ta";
const DIPH_SEGMENT = "hue-vo puer-ta nie-ve rei-na llu-via hie-lo fue-go pue-blo nie-bla puen-te cier-vo guan-te ciu-dad bai-le pia-no a-gua";
const CONS_L = "ta-bla ca-ble mue-ble pue-blo tem-plo an-cla re-gla si-glo do-ble nie-bla ro-ble so-plo te-cla chi-cle tri-ple sim-ple";
const CONS_L_WORDS = CONS_L.replace(/-/g, "");
const CONS_L_PARTS = partsOf(CONS_L_WORDS, /bla|ble|blo|cla|cle|gla|glo|plo|ple/);

const CONS_L_SPELLING: ChoiceItem[] = [
  { p: "¿Cuál está bien escrita?", say: "tabla", a: "tabla", d: ["talba", "tavla", "tabal"] },
  { p: "¿Cuál está bien escrita?", say: "cable", a: "cable", d: ["cabel", "cavle", "calbe"] },
  { p: "¿Cuál está bien escrita?", say: "mueble", a: "mueble", d: ["muevle", "muebel", "mueple"] },
  { p: "¿Cuál está bien escrita?", say: "regla", a: "regla", d: ["rregla", "regal", "rejla"] },
  { p: "¿Cuál está bien escrita?", say: "templo", a: "templo", d: ["tenplo", "tempol", "templó"] },
  { p: "¿Cuál está bien escrita?", say: "niebla", a: "niebla", d: ["nievla", "niebal", "nibla"] },
  { p: "¿Cuál está bien escrita?", say: "chicle", a: "chicle", d: ["chikle", "chicel", "chiclé"] },
  { p: "¿Cuál está bien escrita?", say: "pueblo", a: "pueblo", d: ["puevlo", "puebol", "peublo"] },
];

const TWO_SYL = "gato pato perro rana mono vaca pera luna nube casa coche barco globo libro piña fresa queso leche taza sopa robot cactus regla cable taxi jabón";

const TWO_SYL_EASY: ChoiceItem[] = [
  { t: "El ___ nada en el lago.", a: "pato", d: ["pala", "pito", "pata"] },
  { t: "De noche sale la ___.", a: "luna", d: ["lana", "lupa", "lona"] },
  { t: "Tomo la ___ con cuchara.", a: "sopa", d: ["sapo", "ropa", "soda"] },
  { t: "La ___ tapa el sol.", a: "nube", d: ["nave", "nudo", "sube"] },
  { t: "Mi ___ tiene una puerta roja.", a: "casa", d: ["cosa", "caso", "masa"] },
  { t: "El ___ come plátanos.", a: "mono", d: ["mano", "moño", "tono"] },
  { t: "Tomo té en una ___.", a: "taza", d: ["tapa", "raza", "tiza"] },
  { t: "La ___ croa en la laguna.", a: "rana", d: ["rama", "lana", "rata"] },
];

const TWO_SYL_HARD: ChoiceItem[] = [
  { t: "Leo un ___ de cuentos antes de dormir.", a: "libro", d: ["libre", "litro", "labio"] },
  { t: "El ___ voló hasta las nubes.", a: "globo", d: ["glotón", "grano", "lobo"] },
  { t: "Navegamos por el río en un ___.", a: "barco", d: ["banco", "marco", "barro"] },
  { t: "Mido la mesa con la ___.", a: "regla", d: ["regalo", "reja", "tecla"] },
  { t: "El ___ pincha si lo tocas.", a: "cactus", d: ["cacto", "casco", "tactos"] },
  { t: "Me lavo las manos con ___.", a: "jabón", d: ["jamón", "balón", "japón"] },
  { t: "Comí pan con ___ fresco.", a: "queso", d: ["quiso", "beso", "hueso"] },
  { t: "El ___ camina y habla como una persona.", a: "robot", d: ["rabo", "robo", "bote"] },
];

// --- R. Prefijos y sufijos ---------------------------------------------------------------------

const AFFIX_SEGMENT: ChoiceItem[] = [
  { p: "¿Cómo se separa la palabra en sus partes?", t: "deshacer", a: "des + hacer", d: ["de + shacer", "desha + cer", "d + eshacer"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "releer", a: "re + leer", d: ["rel + eer", "r + eleer", "rele + er"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "infeliz", a: "in + feliz", d: ["inf + eliz", "i + nfeliz", "infe + liz"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "florero", a: "flor + ero", d: ["flo + rero", "fl + orero", "flore + ro"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "panadero", a: "pan + adero", d: ["pa + nadero", "pana + dero", "panade + ro"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "desordenar", a: "des + ordenar", d: ["de + sordenar", "desor + denar", "desorde + nar"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "rehacer", a: "re + hacer", d: ["reh + acer", "reha + cer", "r + ehacer"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "arbolito", a: "árbol + ito", d: ["ar + bolito", "arbo + lito", "arboli + to"] },
  { p: "¿Cómo se separa la palabra en sus partes?", t: "zapatero", a: "zapat + ero", d: ["za + patero", "zapate + ro", "z + apatero"] },
];

const AFFIX_SENTENCES: ChoiceItem[] = [
  { t: "No entendí el cuento, así que lo voy a ___.", a: "releer", d: ["leer", "lector", "lectura"] },
  { t: "El señor que hace pan es el ___.", a: "panadero", d: ["panadería", "pancito", "empanada"] },
  { t: "Mi cuarto está limpio; no lo vayas a ___.", a: "desordenar", d: ["ordenar", "ordenado", "orden"] },
  { t: "Puse las flores en el ___.", a: "florero", d: ["florista", "florecer", "florido"] },
  { t: "La torre de bloques se cayó; la voy a ___.", a: "rehacer", d: ["deshacer", "hacer", "hecho"] },
  { t: "Un perro muy pequeño es un ___.", a: "perrito", d: ["perrazo", "perrera", "perruno"] },
  { t: "Perdió su juguete y está ___.", a: "infeliz", d: ["feliz", "felicidad", "felizmente"] },
  { t: "El nudo está muy apretado; no lo puedo ___.", a: "desatar", d: ["atar", "atado", "reatar"] },
];

// --- S. Palabras frecuentes ------------------------------------------------------------------------

const SIGHT = "también entonces después siempre nunca porque aunque mientras todavía además bastante durante hacia hasta desde";
const SIGHT_SPELL = "nunca hasta desde hacia antes luego cerca lejos mucho poco";

const SIGHT_SENTENCES: ChoiceItem[] = [
  { t: "Me lavo las manos ___ de comer.", a: "antes", d: ["nunca", "aunque", "hacia"] },
  { t: "No salí a jugar ___ llovía mucho.", a: "porque", d: ["hasta", "desde", "además"] },
  { t: "Mi hermana canta y yo ___.", a: "también", d: ["tampoco", "nunca", "hacia"] },
  { t: "Caminamos ___ el parque.", a: "hacia", d: ["durante", "aunque", "todavía"] },
  { t: "___ me cepillo los dientes por la noche.", a: "Siempre", d: ["Hacia", "Hasta", "Desde"] },
  { t: "El bebé ___ no sabe caminar.", a: "todavía", d: ["después", "durante", "entonces"] },
  { t: "Te espero ___ las cinco de la tarde.", a: "hasta", d: ["nunca", "aunque", "además"] },
  { t: "Primero hago la tarea y ___ juego.", a: "después", d: ["nunca", "aunque", "hacia"] },
  { t: "No hables ___ la película.", a: "durante", d: ["también", "además", "entonces"] },
];

// --- T. Cuentos ---------------------------------------------------------------------------------------

const STORIES: Record<string, Passage[]> = {
  simple: [
    {
      title: "La sopa de Sara", emoji: "🍲",
      text: "Sara y su papá hacen sopa. Ponen papa, tomate y un poco de sal. La sopa sale rica. Sara le da un plato a su mamá. La mamá dice: «¡Qué rica sopa!».",
      qs: [
        { q: "¿Qué hacen Sara y su papá?", a: "Una sopa", d: ["Un pastel", "Una ensalada", "Un jugo"] },
        { q: "¿Qué le ponen a la sopa?", a: "Papa, tomate y sal", d: ["Pera, uva y miel", "Pan y queso", "Leche y azúcar"] },
        { q: "¿A quién le da Sara un plato?", a: "A su mamá", d: ["A su perro", "A su tío", "A su amiga"] },
      ],
    },
    {
      title: "El mono y la luna", emoji: "🐒",
      text: "Un mono mira la luna desde una rama. La luna se ve en el lago. El mono mete la mano en el agua para tomar la luna, pero no la toca. El mono se ríe: la luna sigue en el cielo.",
      qs: [
        { q: "¿Dónde está el mono?", a: "En una rama", d: ["En una casa", "En una nave", "En una cama"] },
        { q: "¿Qué quiere tomar el mono?", a: "La luna", d: ["Una pera", "Un pato", "Una nube"] },
        { q: "¿Por qué no puede tomar la luna?", a: "Porque sigue en el cielo", d: ["Porque el lago está seco", "Porque tiene sueño", "Porque la tapa una nube"] },
      ],
    },
    {
      title: "Un paseo en bote", emoji: "⛵",
      text: "Tito sube al bote con su tío. Reman y reman por el lago. Un pato nada al lado del bote. Tito le tira pan. El pato come y se va. Tito saluda al pato con la mano.",
      qs: [
        { q: "¿Con quién va Tito?", a: "Con su tío", d: ["Con su mamá", "Con su perro", "Con un amigo"] },
        { q: "¿Qué animal nada al lado del bote?", a: "Un pato", d: ["Un pez", "Una rana", "Un sapo"] },
        { q: "¿Qué le tira Tito al pato?", a: "Pan", d: ["Una pelota", "Agua", "Una rama"] },
      ],
    },
  ],
  h: [
    {
      title: "El helado de Hugo", emoji: "🍦",
      text: "Hoy hace mucho calor. Hugo va con su hermana a comprar un helado. Hugo pide uno de higo y Helena, uno de fresa. El helado de Hugo se cae al suelo. Helena le da la mitad del suyo. ¡Qué buena hermana!",
      qs: [
        { q: "¿Por qué van a comprar helado?", a: "Porque hace calor", d: ["Porque es de noche", "Porque llueve", "Porque tienen sueño"] },
        { q: "¿Qué le pasa al helado de Hugo?", a: "Se cae al suelo", d: ["Se derrite en el vaso", "Se lo come un perro", "Lo pierde en casa"] },
        { q: "¿Qué hace Helena?", a: "Le da la mitad de su helado", d: ["Se ríe mucho de su hermano", "Se va a su casa", "Compra otro helado"] },
      ],
    },
    {
      title: "La hormiga y la hoja", emoji: "🐜",
      text: "Una hormiga halló una hoja enorme. No podía llevarla sola. Llamó a sus hermanas del hormiguero. Entre todas levantaron la hoja y la llevaron a casa. Ahora tienen comida para el invierno.",
      qs: [
        { q: "¿Qué halló la hormiga?", a: "Una hoja enorme", d: ["Un hueso muy duro", "Un hilo largo", "Un huevo roto"] },
        { q: "¿A quién llamó la hormiga?", a: "A sus hermanas", d: ["A un búho", "A una abeja reina", "A su mamá"] },
        { q: "¿Para qué les sirve la hoja?", a: "Para comer en el invierno", d: ["Para hacer un techo nuevo", "Para jugar con ella", "Para cruzar el río"] },
      ],
    },
    {
      title: "El búho que no dormía", emoji: "🦉",
      text: "Un búho vivía en el hueco de un árbol. De día, todos los animales hacían ruido y el búho no podía dormir. Una hada lo vio triste y le hizo unas orejeras de hilo. Ahora el búho duerme de día y vuela feliz de noche.",
      qs: [
        { q: "¿Dónde vivía el búho?", a: "En el hueco de un árbol", d: ["En una cueva oscura", "En el techo de una casa", "En un nido de paja"] },
        { q: "¿Por qué no podía dormir?", a: "Por el ruido de los animales", d: ["Porque tenía hambre", "Porque hacía frío", "Porque había mucha luz de luna"] },
        { q: "¿Qué le hizo el hada?", a: "Unas orejeras de hilo", d: ["Una cama de hojas secas", "Un gorro de lana", "Una casa nueva"] },
      ],
    },
  ],
  cq: [
    {
      title: "El queso de Quique", emoji: "🧀",
      text: "Quique compró un queso en la esquina. Lo guardó en la cocina, dentro de una caja. Por la noche, un ratón pequeño quiso comerse el queso. El gato Coco lo vio y el ratón corrió a su cueva. El queso quedó completo.",
      qs: [
        { q: "¿Dónde compró Quique el queso?", a: "En la esquina", d: ["En el parque", "En la escuela", "En el campo"] },
        { q: "¿Quién quiso comerse el queso?", a: "Un ratón", d: ["El gato Coco", "Quique", "Un perro"] },
        { q: "¿Por qué el ratón no se lo comió?", a: "Porque lo vio el gato", d: ["Porque no tenía hambre", "Porque la caja pesaba", "Porque llegó Quique"] },
      ],
    },
    {
      title: "La guitarra de Gabi", emoji: "🎸",
      text: "A Gabi le regalaron una guitarra. Al comienzo solo sacaba ruidos. Su amigo Guido le enseñó unas notas. Gabi practicó cada tarde después de comer. En la fiesta del colegio tocó una canción y todos aplaudieron.",
      qs: [
        { q: "¿Qué le regalaron a Gabi?", a: "Una guitarra", d: ["Un tambor", "Una trompeta", "Un piano"] },
        { q: "¿Quién le enseñó a tocar?", a: "Su amigo Guido", d: ["Su profesora", "Su abuelo", "Su hermana"] },
        { q: "¿Qué pasó en la fiesta del colegio?", a: "Tocó una canción y la aplaudieron", d: ["Se le rompió la guitarra", "No quiso salir a tocar", "Olvidó la canción"] },
      ],
    },
    {
      title: "Un paquete en la puerta", emoji: "📦",
      text: "El cartero dejó un paquete en la puerta de Camila. La caja era grande y pesaba poco. Camila quería abrirla, pero esperó a su mamá. Dentro había una cometa de colores que le mandó su tía Quela desde Cusco.",
      qs: [
        { q: "¿Quién dejó el paquete?", a: "El cartero", d: ["La tía Quela", "Un vecino", "La mamá"] },
        { q: "¿Qué había dentro del paquete?", a: "Una cometa de colores", d: ["Una muñeca de trapo", "Un libro de cuentos", "Una caja de galletas"] },
        { q: "¿Qué hizo Camila antes de abrirlo?", a: "Esperó a su mamá", d: ["Llamó al cartero", "Lo escondió", "Lo sacudió fuerte"] },
      ],
    },
  ],
  czgj: [
    {
      title: "La cebra Cecilia", emoji: "🦓",
      text: "La cebra Cecilia vivía cerca de un cerro. Cada mañana comía hierba fresca. Un día conoció a una jirafa llamada Julia. Julia alcanzaba las hojas más altas y se las pasaba a Cecilia. Desde ese día comen juntas.",
      qs: [
        { q: "¿Dónde vivía Cecilia?", a: "Cerca de un cerro", d: ["En una ciudad grande", "Junto al mar", "En una jaula"] },
        { q: "¿A quién conoció Cecilia?", a: "A una jirafa", d: ["A un zorro rojo", "A un cisne", "A un genio"] },
        { q: "¿Cómo ayudaba Julia a Cecilia?", a: "Le pasaba las hojas altas", d: ["La cargaba sobre su lomo", "Le buscaba agua", "La cuidaba de noche"] },
      ],
    },
    {
      title: "El girasol gigante", emoji: "🌻",
      text: "Jorge sembró una semilla en el jardín. La regó con cuidado cada jueves. Pasaron las semanas y creció un girasol gigante, más alto que Jorge. La gente del barrio venía a verlo. Jorge regaló las semillas a sus vecinos.",
      qs: [
        { q: "¿Qué sembró Jorge?", a: "Una semilla", d: ["Un árbol", "Una rosa", "Un cactus chico"] },
        { q: "¿Cómo era el girasol?", a: "Más alto que Jorge", d: ["Pequeño y rojo", "Seco y gris", "Del tamaño de una taza"] },
        { q: "¿Qué hizo Jorge con las semillas?", a: "Las regaló a sus vecinos", d: ["Las vendió en la plaza", "Se las comió todas", "Las guardó en un cajón"] },
      ],
    },
    {
      title: "Zapatos nuevos", emoji: "👞",
      text: "Zoila tenía los zapatos rotos. Su abuelo es zapatero y trabaja en la plaza. Con cuero, hilo y una aguja le hizo unos zapatos azules. Zoila los cuida mucho: los limpia cada noche y los deja junto a su cama.",
      qs: [
        { q: "¿Qué le pasaba a Zoila?", a: "Tenía los zapatos rotos", d: ["Perdió su mochila", "Tenía mucho frío", "No encontraba su casa"] },
        { q: "¿En qué trabaja su abuelo?", a: "Es zapatero", d: ["Es panadero", "Es jardinero", "Es cartero"] },
        { q: "¿De qué color son los zapatos nuevos?", a: "Azules", d: ["Rojos", "Negros", "Verdes"] },
      ],
    },
  ],
  patterns: [
    {
      title: "El mercado", emoji: "🧺",
      text: "Los sábados, Jimena va al mercado con su mamá. Compran queso, zanahorias, cebollas y un kilo de guindas. Jimena lleva la canasta pequeña. A la salida, la señora Gisela les regala una yapa: dos plátanos maduros.",
      qs: [
        { q: "¿Cuándo va Jimena al mercado?", a: "Los sábados", d: ["Los lunes", "Cada noche", "En vacaciones"] },
        { q: "¿Qué lleva Jimena?", a: "La canasta pequeña", d: ["La bolsa del pan", "El monedero", "Una caja grande"] },
        { q: "¿Qué les regala la señora Gisela?", a: "Dos plátanos", d: ["Un queso", "Una guinda", "Tres cebollas"] },
      ],
    },
    {
      title: "El juguete perdido", emoji: "🧸",
      text: "Guille buscó su osito de juguete por toda la casa. Miró debajo de la cama, en la cocina y en el jardín. No lo encontró. Entonces vio a su perro Zeus dormido en el sillón, abrazado al osito. Guille sonrió y los dejó dormir.",
      qs: [
        { q: "¿Qué buscaba Guille?", a: "Su osito de juguete", d: ["Su zapato azul", "Su cuaderno", "Su pelota"] },
        { q: "¿Quién tenía el osito?", a: "Su perro Zeus", d: ["Su hermana", "Su gato", "Su mamá"] },
        { q: "¿Qué hizo Guille al final?", a: "Los dejó dormir", d: ["Le quitó el osito", "Despertó al perro", "Se puso a llorar"] },
      ],
    },
    {
      title: "La carrera", emoji: "🏃",
      text: "En el colegio hubo una carrera. Rocío corrió rápido, pero se cayó cerca de la meta. Su amigo Quique se detuvo y la ayudó a levantarse. Los dos cruzaron la meta juntos. No ganaron la carrera, pero todos los aplaudieron.",
      qs: [
        { q: "¿Qué le pasó a Rocío?", a: "Se cayó cerca de la meta", d: ["Perdió un zapato", "Se quedó dormida", "Llegó tarde al colegio"] },
        { q: "¿Qué hizo Quique?", a: "La ayudó a levantarse", d: ["Siguió corriendo", "Se rió de ella", "Llamó a la maestra"] },
        { q: "¿Por qué los aplaudieron?", a: "Porque se ayudaron", d: ["Porque ganaron", "Porque corrieron lento", "Porque cantaron"] },
      ],
    },
  ],
  r: [
    {
      title: "El perro Ramón", emoji: "🐶",
      text: "Ramón es un perro que corre por el cerro. Le gusta perseguir mariposas y ladrar a los carros. Un día se enredó en una rama y no podía salir. Rosa, su dueña, lo oyó ladrar y lo rescató. Ramón le lamió la cara.",
      qs: [
        { q: "¿Qué le gusta hacer a Ramón?", a: "Perseguir mariposas", d: ["Dormir en la torre", "Nadar en el río", "Comer arroz"] },
        { q: "¿Qué le pasó un día?", a: "Se enredó en una rama", d: ["Se perdió en la ciudad", "Se cayó al río", "Rompió un jarrón"] },
        { q: "¿Quién lo rescató?", a: "Rosa", d: ["Un carro", "Un vecino", "Su mamá"] },
      ],
    },
    {
      title: "La torre de arena", emoji: "🏖️",
      text: "Rita y Raúl fueron a la orilla del mar. Con arena mojada armaron una torre muy alta. Le pusieron ramas y caracoles. Vino una ola y se llevó la torre. Rita y Raúl se rieron y empezaron otra, más lejos del agua.",
      qs: [
        { q: "¿Qué armaron Rita y Raúl?", a: "Una torre de arena", d: ["Un barco de papel", "Una carpa", "Un muñeco de barro"] },
        { q: "¿Qué pasó con la torre?", a: "Se la llevó una ola", d: ["La pisó un perro", "La tumbó el viento", "La rompió Raúl"] },
        { q: "¿Dónde hicieron la otra torre?", a: "Más lejos del agua", d: ["Dentro del mar", "En su casa", "Sobre una roca"] },
      ],
    },
    {
      title: "El loro hablador", emoji: "🦜",
      text: "El loro de mi tío Arturo repite todo lo que oye. Si suena el teléfono, grita: «¡Aló!». Si llega el cartero, grita: «¡Carta!». Una tarde gritó: «¡Arroz quemado!». Mi tío corrió a la cocina: el loro tenía razón.",
      qs: [
        { q: "¿Qué hace el loro?", a: "Repite lo que oye", d: ["Canta óperas", "Duerme todo el día", "Vuela por la ciudad"] },
        { q: "¿Qué grita cuando llega el cartero?", a: "¡Carta!", d: ["¡Aló!", "¡Arroz!", "¡Arturo!"] },
        { q: "¿Qué pasaba en la cocina?", a: "El arroz se quemaba", d: ["Había un ratón", "Se cayó un plato", "Entró el cartero"] },
      ],
    },
  ],
  diph: [
    {
      title: "El pingüino y la cigüeña", emoji: "🐧",
      text: "Un pingüino quería volar como la cigüeña. Aleteaba y aleteaba, pero no subía. La cigüeña le dijo: «Tú no vuelas en el aire, pero nadie nada como tú en el agua». El pingüino se lanzó al mar y nadó veloz. Ya no sintió vergüenza.",
      qs: [
        { q: "¿Qué quería el pingüino?", a: "Volar como la cigüeña", d: ["Tocar bien la guitarra", "Vivir en un árbol", "Comer guindas"] },
        { q: "¿Qué hace muy bien el pingüino?", a: "Nadar", d: ["Volar", "Cantar", "Trepar"] },
        { q: "¿Cómo se sintió al final?", a: "Contento con lo que sabe hacer", d: ["Triste por no poder volar nunca", "Enojado con la cigüeña", "Asustado del mar"] },
      ],
    },
    {
      title: "Viaje al pueblo", emoji: "🏘️",
      text: "En julio viajamos al pueblo de mi abuela. Hay un puente de piedra y un río de agua fría. Por las mañanas hay niebla y luego sale el sol. Mi abuela prepara huevos con queso y nos cuenta cuentos junto al fuego.",
      qs: [
        { q: "¿Cuándo viajan al pueblo?", a: "En julio", d: ["En enero", "Cada domingo", "En diciembre"] },
        { q: "¿Qué hay por las mañanas?", a: "Niebla", d: ["Nieve", "Lluvia", "Viento fuerte"] },
        { q: "¿Qué hace la abuela junto al fuego?", a: "Cuenta cuentos", d: ["Teje una manta", "Toca el piano", "Lava la ropa"] },
      ],
    },
    {
      title: "El astronauta", emoji: "🧑‍🚀",
      text: "Mauricio sueña con ser astronauta. Cada noche mira el cielo con su abuelo. Ya conoce seis estrellas por su nombre. En su cuaderno dibuja naves y planetas. Su abuelo le dice: «Estudia mucho y llegarás muy lejos».",
      qs: [
        { q: "¿Qué quiere ser Mauricio?", a: "Astronauta", d: ["Bailarín", "Pintor", "Carpintero"] },
        { q: "¿Cuántas estrellas conoce por su nombre?", a: "Seis", d: ["Dos", "Veinte", "Cien"] },
        { q: "¿Qué dibuja en su cuaderno?", a: "Naves y planetas", d: ["Flores y mariposas", "Casas y autos", "Peces y ríos"] },
      ],
    },
  ],
};

const sortPattern = (pattern: string, set: { yes: string[]; no: string[] }) => (r: Parameters<typeof P.sortSpelling>[0]) => P.sortSpelling(r, pattern, set.yes, set.no);

export const ROWS: Row[] = [
  ["A.1", "Elegir el dibujo que rima con la palabra", P.rhymePicture],
  ["A.2", "¿Qué palabra no rima?", P.notRhyme],
  ["A.3", "Completar la rima", (r) => choose(r, "Completa la rima.", COUPLETS)],
  ["A.4", "Completar el poema con una palabra que rime", (r) => choose(r, "Completa el poema con una palabra que rime.", POEMS)],
  ["A.5", "Escribir palabras que riman para responder adivinanzas", (r) => P2.spellFromClue(r, RIDDLES)],
  ["A.6", "Formar un grupo de palabras que riman", P.rhymeSet],

  ["B.1", "¿Cuántas sílabas tiene la palabra?", P.countSyllables],
  ["B.2", "Clasificar por número de sílabas", P.sortBySyllables],

  ["C.1", "Cambiar un sonido de la palabra", (r) =>
    mix(r, [
      (q) => P.changeSound(q, P.FIRST_SOUND_PAIRS, "el primer sonido"),
      (q) => P.changeSound(q, P.LAST_SOUND_PAIRS, "el último sonido"),
      (q) => P.changeSound(q, P.VOWEL_PAIRS, "la vocal"),
    ])],
  ["C.2", "Quitar un sonido de la palabra", P2.deleteSound],

  ["D.1", "Leer palabras con dígrafos", (r) => P.wordForPicture(r, DIGRAPH_READ)],
  ["D.2", "Completar la palabra con el dígrafo correcto: ch, ll, rr, qu, gu", (r) => P.completePart(r, DIGRAPHS, ["ch", "ll", "rr", "qu", "gu"], "¿Qué letras faltan?")],
  ["D.3", "Escribir la palabra con dígrafo: ch, ll, rr, qu", (r) => P.spellWord(r, "coche leche llave pollo silla perro gorro zorro queso", "ch ll rr qu a e i o u")],
  ["D.4", "Escribir palabras con qu y x", (r) => P.spellWord(r, "queso taxi paquete raqueta mosquito bosque", "qu x c s a e i o u")],
  ["D.5", "Escribir palabras con ch, ll, rr, qu, ñ y x", (r) => P.spellWord(r, "coche llave perro queso taxi piña araña zorro pollo leche", "ch ll rr qu ñ x a e i o")],
  ["D.6", "Escribir palabras con gue, gui y güi", (r) => P.spellWord(r, "águila juguete guitarra guepardo pingüino", "g u ü e i a o j")],
  ["D.7", "Completar las palabras con letras mudas", (r) => choose(r, "¿Qué letra muda falta?", SILENT)],

  ["E.1", "Clasificar por trabada o dígrafo inicial", P.sortBlend],
  ["E.2", "Leer palabras con trabadas", P.fillBlend],
  ["E.3", "Completar la palabra con la trabada inicial correcta", (r) => P.completeBlend(r, "start")],
  ["E.4", "Completar la palabra con la trabada de en medio", (r) => P.completeBlend(r, "middle")],
  ["E.5", "Escribir palabras con mp y mb", (r) => P.spellWord(r, "tambor campana bombero trompeta sombrero", "m n b p a e o r t")],
  ["E.6", "Escribir la palabra con una trabada", (r) => P.spellWord(r, "plato globo flor tren fresa libro tigre cabra cebra playa", "a e i o u l r p b t")],
  ["E.7", "Completar la palabra con una sílaba trabada", (r) => P.completePart(r, BLEND_SYLLABLES, BLEND_CHOICES, "¿Qué sílaba falta?")],
  ["E.8", "Completar la oración con una palabra con trabada", (r) => choose(r, "Completa la oración.", BLEND_SENTENCES)],

  ["F.1", "Completar la palabra con la vocal correcta", (r) => P.completeVowel(r, "sol pan mar pez tren flor uva oso luna mano pato rana lobo nido foca sopa nube coco foco vela")],
  ["F.2", "Cambiar una letra para formar otra palabra", (r) => P.changeOneLetter(r, P.ONE_LETTER_PAIRS)],
  ["F.3", "Escribir la palabra con a", (r) => P.spellWord(r, "casa rana papa cama taza mapa sal pan mar")],
  ["F.4", "Escribir la palabra con e", (r) => P.spellWord(r, "pez tren leche pera bebé vela", "a e i o u ch l p s t r n")],
  ["F.5", "Escribir la palabra con i", (r) => P.spellWord(r, "piña silla hilo nido kiwi", "a e i o u ñ ll h k")],
  ["F.6", "Escribir la palabra con o", (r) => P.spellWord(r, "oso sol ojo loro lobo mono coco foco")],
  ["F.7", "Escribir la palabra con u", (r) => P.spellWord(r, "uva luna nube pulpo búho", "a e i o u ú b v l n")],

  ["G.1", "Elegir la palabra con h que corresponde al dibujo", (r) => P.wordForPicture(r, H_WORDS)],
  ["G.2", "Completar las palabras con h", (r) => choose(r, "¿Qué letras faltan?", H_COMPLETE)],
  ["G.3", "Escribir la palabra con h", (r) => P.spellWord(r, "hoja hilo hada hielo hueso huevo búho huella", "h a e i o u l j s")],
  ["G.4", "Elegir la oración con h que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_H))],

  ["H.1", "Elegir el dibujo de la palabra con diptongo", (r) => P.pictureForWord(r, DIPH_WORDS)],
  ["H.2", "Completar las palabras con diptongo: ie, ue", (r) => P.completePart(r, partsOf("huevo hueso puerta nieve hielo fuego serpiente ciervo pueblo niebla puente", /ie|ue/), ["ue", "ie", "ua", "ia"], "¿Qué diptongo falta?")],
  ["H.3", "Completar la palabra con el diptongo correcto", (r) => P.completePart(r, partsOf(DIPH_WORDS, DIPH), ["ia", "ie", "io", "ua", "ue", "ei", "au", "iu"], "¿Qué diptongo falta?")],
  ["H.4", "Elegir la oración con diptongo que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_DIPH))],

  ["I.1", "Clasificar palabras con diptongo y sin diptongo", (r) => pickAll(r, "Selecciona las palabras que tienen diptongo (dos vocales juntas en la misma sílaba).", WITH_DIPH, NO_DIPH)],
  ["I.2", "Relacionar palabras con a (sola o en diptongo) con su dibujo", (r) => P.wordForPicture(r, "casa rana mapa agua piano guante paraguas lluvia baile")],
  ["I.3", "Relacionar palabras con e (sola o en diptongo) con su dibujo", (r) => P.wordForPicture(r, "pera leche tren nieve hielo huevo puerta reina ciervo puente")],
  ["I.4", "Elegir la palabra con i (sola o en diptongo) que corresponde al dibujo", (r) => P.wordForPicture(r, "piña silla nido pie piano hielo nieve ciudad lluvia")],
  ["I.5", "Elegir la palabra con o (sola o en diptongo) que corresponde al dibujo", (r) => P.wordForPicture(r, "oso lobo mono coco avión camión león piano trofeo")],
  ["I.6", "Elegir la palabra con u (sola o en diptongo) que corresponde al dibujo", (r) => P.wordForPicture(r, "uva luna nube huevo fuego cuaderno guante pueblo buey")],
  ["I.7", "Usar las letras para clasificar palabras con diptongo", (r) =>
    mix(r, [
      (q) => P.sortSpelling(q, "ue", ["huevo", "fuego", "puerta", "pueblo", "puente", "abuela", "cuento"], ["nieve", "piano", "agua", "reina", "ciudad", "viaje", "lluvia"]),
      (q) => P.sortSpelling(q, "ie", ["nieve", "hielo", "cielo", "fiesta", "ciervo", "niebla", "pie"], ["huevo", "piano", "agua", "reina", "fuego", "viaje", "guante"]),
      (q) => P.sortSpelling(q, "ia", ["piano", "lluvia", "viaje", "familia", "historia", "zanahoria"], ["huevo", "nieve", "agua", "reina", "fuego", "cielo", "pueblo"]),
    ])],

  ["J.1", "Elegir las palabras con el patrón indicado", (r) => mix(r, [sortPattern("qu", QU), sortPattern("gu", GU), sortPattern("z", Z), sortPattern("j", J), sortPattern("rr", RR)])],
  ["J.2", "Escribir la palabra con c o qu", (r) => P.spellWord(r, "casa coche cama queso paquete raqueta mosquito bosque", "c qu k s a e i o")],
  ["J.3", "Escribir la palabra con g o gu", (r) => P.spellWord(r, "gato gorro gusano guitarra águila juguete guepardo", "g u j a e i o")],
  ["J.4", "Escribir la palabra con c o z", (r) => P.spellWord(r, "cebra cereza cerdo cisne zapato zorro taza pez", "c z s a e i o")],
  ["J.5", "Escribir la palabra con g o j", (r) => P.spellWord(r, "jirafa ojo hoja conejo tijera oveja abeja girasol gema genio", "g j a e i o")],
  ["J.6", "Escribir la palabra con r o rr", (r) => P.spellWord(r, "perro zorro gorro pera loro ratón rosa rana arroz", "r rr a e o")],
  ["J.7", "Completar la oración con la palabra bien escrita", (r) => choose(r, "Completa la oración con la palabra bien escrita.", WELL_WRITTEN)],

  ["K.1", "Elegir la palabra con r que corresponde al dibujo", (r) => P.wordForPicture(r, R_WORDS)],
  ["K.2", "Completar la palabra con ar, er, ir, or, ur", (r) => P.completePart(r, R_VOWEL, ["ar", "er", "ir", "or", "ur"], "¿Qué letras faltan?")],
  ["K.3", "Completar la palabra con r o rr", (r) => choose(r, "¿Va «r» o «rr»? Toca 🔊 para escuchar la palabra.", R_OR_RR)],
  ["K.4", "Elegir la oración con r que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_R))],

  ["L.1", "Elegir el dibujo de la palabra con diptongo: ai, au, ei, ey, uy", (r) => P.pictureForWord(r, "reina rey astronauta baile seis dinosaurio buey paraguas")],
  ["L.2", "Completar la palabra con el diptongo correcto: ai, au, ei, eu, oi", (r) => P.completePart(r, IU_DIPH, ["ai", "au", "ei", "eu", "oi"], "¿Qué diptongo falta?")],
  ["L.3", "Elegir la oración con diptongo que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_IU))],

  ["M.1", "Completar palabras con gue, gui, güe y güi", (r) => P.completePart(r, GUE_GUI, ["gue", "gui", "güe", "güi"], "¿Qué letras faltan?")],
  ["M.2", "¿En qué palabra suena distinto?", (r) => choose(r, "", U_SOUNDS)],

  ["N.1", "Clasificar palabras con c y g: sonido suave y fuerte", (r) =>
    mix(r, [
      (q) => pickAll(q, "Selecciona las palabras donde la c suena suave (como en «cine»).", SOFT_C, HARD_C),
      (q) => pickAll(q, "Selecciona las palabras donde la g suena suave (como en «gente»).", SOFT_G, HARD_G),
      (q) => pickAll(q, "Selecciona las palabras donde la c suena fuerte (como en «casa»).", HARD_C, SOFT_C),
      (q) => pickAll(q, "Selecciona las palabras donde la g suena fuerte (como en «gato»).", HARD_G, SOFT_G),
    ])],
  ["N.2", "Elegir la palabra con c o g suave que corresponde al dibujo", (r) => P.wordForPicture(r, SOFT_PICS)],
  ["N.3", "Elegir la oración con c o g suave que corresponde al dibujo", (r) => choose(r, "¿Qué oración corresponde al dibujo?", sentencesFor(SENT_SOFT))],
  ["N.4", "Escribir la palabra con c o g suave", (r) => P.spellWord(r, "cebra cerdo cisne gema genio cereza girasol", "c g s j z a e i o")],

  ["O.1", "¿La sílaba es abierta o cerrada?", (r) => P2.openClosed(r, OPEN_CLOSED)],
  ["O.2", "Separar palabras de dos sílabas: abiertas y cerradas", (r) => P2.segmentList(r, TWO_OPEN_CLOSED)],
  ["O.3", "Leer palabras de dos sílabas: abiertas y cerradas", (r) => P.wordForPicture(r, "pato luna barco pulpo cerdo tambor pastel robot volcán delfín jabón cactus bosque")],
  ["O.4", "Escribir palabras con sílabas abiertas", (r) => P.spellWord(r, "pato luna mano rana nido foca sopa casa gato vela coco foco")],
  ["O.5", "Escribir palabras con sílabas abiertas y cerradas", (r) => P.spellWord(r, "barco pulpo cerdo tambor pastel robot jabón cactus", "a e i o u b c r s t l n")],

  ["P.1", "Separar palabras de dos sílabas con diptongo", (r) => P2.segmentList(r, DIPH_SEGMENT)],
  ["P.2", "Leer palabras de dos sílabas con diptongo", (r) => P.wordForPicture(r, DIPH_SEGMENT.replace(/-/g, ""))],
  ["P.3", "Separar palabras con bl, cl, gl y pl", (r) => P2.segmentList(r, CONS_L)],
  ["P.4", "Leer palabras con bl, cl, gl y pl", (r) => P2.listenChoose(r, CONS_L_WORDS)],
  ["P.5", "Completar las palabras con bl, cl, gl y pl", (r) => P.completePart(r, CONS_L_PARTS, ["bla", "ble", "blo", "cla", "cle", "gla", "glo", "plo", "ple"], "¿Qué sílaba falta?")],
  ["P.6", "Elegir la palabra con bl, cl, gl o pl bien escrita", (r) => choose(r, "¿Cuál está bien escrita?", CONS_L_SPELLING)],
  ["P.7", "Escribir la palabra con bl, cl, gl o pl", (r) => P2.spellHeard(r, "tabla cable doble regla ancla siglo roble tecla soplo", "b c g p l a e i o")],

  ["Q.1", "Leer palabras de dos sílabas", (r) => P.wordForPicture(r, TWO_SYL)],
  ["Q.2", "Completar palabras de dos sílabas", P.completeSecondSyllable],
  ["Q.3", "Unir dos sílabas para formar una palabra: fácil", (r) => P.joinSyllables(r, false)],
  ["Q.4", "Unir dos sílabas para formar una palabra: difícil", (r) => P.joinSyllables(r, true)],
  ["Q.5", "Completar la oración con una palabra de dos sílabas: fácil", (r) => choose(r, "Completa la oración.", TWO_SYL_EASY)],
  ["Q.6", "Completar la oración con una palabra de dos sílabas: difícil", (r) => choose(r, "Completa la oración.", TWO_SYL_HARD)],

  ["R.1", "Separar y leer palabras con prefijos o sufijos", (r) => choose(r, "", AFFIX_SEGMENT)],
  ["R.2", "Completar la oración con la palabra con prefijo o sufijo", (r) => choose(r, "Completa la oración.", AFFIX_SENTENCES)],

  ["S.1", "Leer palabras frecuentes", (r) => P2.listenChoose(r, SIGHT)],
  ["S.2", "Completar la oración con la palabra frecuente correcta", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
  ["S.3", "Escribir la palabra frecuente", (r) => P2.spellHeard(r, SIGHT_SPELL, "a e i o u c h l n r s t")],

  ["T.1", "Leer cuentos con palabras sencillas", (r) => readPassage(r, STORIES.simple, false)],
  ["T.2", "Leer cuentos con h", (r) => readPassage(r, STORIES.h, false)],
  ["T.3", "Leer cuentos con c, qu, g y gu", (r) => readPassage(r, STORIES.cq, false)],
  ["T.4", "Leer cuentos con c, z, g y j", (r) => readPassage(r, STORIES.czgj, false)],
  ["T.5", "Leer cuentos con patrones ortográficos", (r) => readPassage(r, STORIES.patterns, false)],
  ["T.6", "Leer cuentos con r y rr", (r) => readPassage(r, STORIES.r, false)],
  ["T.7", "Leer cuentos con diptongos y con ü", (r) => readPassage(r, STORIES.diph, false)],
];
