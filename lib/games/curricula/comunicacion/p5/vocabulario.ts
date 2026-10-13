import { choose, mix, pickAll, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { abcOrder, f, pool, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Vocabulario (IXL 5th grade ELA, BB-KK). Los afijos del inglés pasan a los
// del castellano:
//   pre-, re-, sub- → pre-, re-, sub-        mis- → mal- (maltratar, malgastar)
//   un-, dis-, in-, im-, non- → des-, in-, im-, i-
//   -ful → -oso, -osa        -less → a-/an- y «sin» (anormal, sinfín)
//   -able, -ible → -able, -ible

export const SECTIONS: Section[] = [
  { id: "BB", name: "Prefijos y sufijos", icon: "🧩" },
  { id: "CC", name: "Raíces griegas y latinas", icon: "🏛️" },
  { id: "DD", name: "Categorías", icon: "🗂️" },
  { id: "EE", name: "Sinónimos y antónimos", icon: "↔️" },
  { id: "FF", name: "Analogías", icon: "🔁" },
  { id: "GG", name: "Homófonos y homónimos", icon: "👂" },
  { id: "HH", name: "Modismos y refranes", icon: "💬" },
  { id: "II", name: "Matices de significado", icon: "🌈" },
  { id: "JJ", name: "Claves de contexto", icon: "🔎" },
  { id: "KK", name: "Uso del diccionario", icon: "📖" },
];

const ask = (q: (x: string) => string, list: [string, string][]) => pool(list.map(([x, a]) => [q(x), a] as [string, string]), "p");
const means = (word: string, a: string, ...d: string[]) => w(`¿Qué significa «${word}»?`, a, ...d);

// --- BB. Prefijos y sufijos --------------------------------------------------

const PRE: ChoiceItem[] = [
  means("predecir", "Decir algo antes de que ocurra", "Decir algo dos veces seguidas en voz alta", "Negar lo dicho"), means("prejuicio", "Opinión formada antes de conocer", "Juicio que se repite una y otra vez", "Falta de opinión"),
  means("precocido", "Cocido con anticipación", "Cocido otra vez al día siguiente", "Sin cocinar"), means("preescolar", "Anterior a la escuela primaria", "Posterior a la escuela secundaria", "Contrario a la escuela"),
  means("prevenir", "Actuar antes para evitar un daño", "Volver a venir al mismo lugar otra vez", "Dejar de venir"), means("prenatal", "Anterior al nacimiento", "Posterior al nacimiento", "Sin nacimiento"),
  f("El pronóstico permite ___ las lluvias.", "predecir", "desdecir", "redecir"), f("Lavarse las manos ayuda a ___ enfermedades.", "prevenir", "revenir", "convenir"),
  f("Mi hermanito de cuatro años va al nivel ___.", "preescolar", "extraescolar", "escolarizado"), f("No lo juzgues sin conocerlo: eso es un ___.", "prejuicio", "perjuicio", "juicio"),
];
const RE: ChoiceItem[] = [
  means("reforestar", "Volver a plantar árboles", "Talar los árboles", "Plantar antes de tiempo"), means("reutilizar", "Usar de nuevo", "Usar por primera vez", "Dejar de usar"),
  means("reaparecer", "Aparecer otra vez", "Desaparecer", "Aparecer antes"), means("reconsiderar", "Pensar de nuevo una decisión", "Decidir sin pensar", "Olvidar"),
  means("reabastecer", "Volver a llenar de provisiones", "Vaciar un almacén", "Abastecer antes"), means("reencuentro", "Encuentro después de una separación", "Primer encuentro", "Despedida"),
  f("Tras el incendio, los vecinos decidieron ___ el cerro.", "reforestar", "deforestar", "forestal"), f("Podemos ___ los frascos como maceteros.", "reutilizar", "inutilizar", "utilitario"),
  f("Después de veinte años, hubo un ___ de la promoción.", "reencuentro", "desencuentro", "encontrón"), f("El sol volvió a ___ entre las nubes.", "reaparecer", "desaparecer", "aparentar"),
];
const SUB: ChoiceItem[] = [
  means("subterráneo", "Que está bajo la tierra", "Que está sobre la tierra", "Que rodea la tierra"), means("subrayar", "Trazar una línea debajo", "Borrar una línea con cuidado", "Escribir encima"),
  means("subsuelo", "Capa que está bajo el suelo", "Suelo que está en lo más alto", "Suelo sin tierra"), means("subdirector", "Quien está debajo del director", "Quien da las órdenes al director", "Antiguo director"),
  means("subtítulo", "Título secundario, bajo el principal", "Título más importante de todo el libro", "Texto sin título"), means("subacuático", "Que ocurre bajo el agua", "Que flota en el agua", "Que evita el agua"),
  f("El metro es un tren ___.", "subterráneo", "terrestre", "aterrizado"), f("Voy a ___ las ideas principales del texto.", "subrayar", "rayar", "tachar"),
  f("El petróleo se extrae del ___.", "subsuelo", "entresuelo", "suelo"), f("Los buzos grabaron un video ___.", "subacuático", "acuoso", "aguatero"),
];
const MAL: ChoiceItem[] = [
  means("malgastar", "Gastar mal o en exceso", "Gastar con cuidado", "No gastar"), means("maltratar", "Tratar mal", "Tratar otra vez", "Tratar con cariño"),
  means("malentendido", "Algo que se entendió mal", "Algo muy claro", "Algo que no se dijo"), means("malhumorado", "Que está de mal humor", "Que hace reír", "Que no tiene humor"),
  means("malinterpretar", "Interpretar de manera equivocada", "Interpretar dos veces", "Interpretar bien"), means("malherido", "Herido de gravedad", "Apenas rasguñado", "Ya curado"),
  f("No debes ___ a los animales.", "maltratar", "tratar", "retratar"), f("Fue un ___: yo dije «martes» y él oyó «marzo».", "malentendido", "entendimiento", "acuerdo"),
  f("Hoy el profesor está ___: no ha sonreído.", "malhumorado", "humorista", "sonriente"), f("No hay que ___ el dinero de la propina.", "malgastar", "desgastar", "gastador"),
];
const NEG: ChoiceItem[] = [
  means("desobediente", "Que no obedece", "Que obedece siempre", "Que obedece otra vez"), means("inexacto", "Que no es exacto", "Muy exacto", "Exacto de nuevo"),
  means("imperfecto", "Que no es perfecto", "Más que perfecto", "Perfecto antes"), means("ilegal", "Que no es legal", "Que cumple la ley", "Ley antigua"),
  means("irreal", "Que no es real", "Muy real", "Real otra vez"), means("desconocido", "Que no se conoce", "Muy conocido", "Conocido antes"),
  means("impuntual", "Que no llega a la hora", "Que llega antes", "Que llega siempre a tiempo"), means("ilógico", "Que no tiene lógica", "Muy razonable", "Lógico otra vez"),
  f("Cruzar con luz roja es ___.", "ilegal", "legal", "legalizar"), f("Llegó veinte minutos tarde: es muy ___.", "impuntual", "puntual", "puntualidad"),
  f("El dato era ___: faltaban dos decimales.", "inexacto", "exacto", "exactitud"), f("Un visitante ___ tocó la puerta.", "desconocido", "conocido", "reconocido"),
];
const OSO: ChoiceItem[] = [
  means("pedregoso", "Lleno de piedras", "Sin piedras", "Hecho de una piedra"), means("caudaloso", "Que lleva mucha agua", "Que lleva poca agua", "Que no tiene cauce"),
  means("bondadoso", "Lleno de bondad", "Sin bondad", "Que finge bondad"), means("misterioso", "Que encierra misterio", "Sin misterio", "Que resuelve misterios"),
  means("espumoso", "Que tiene mucha espuma", "Sin espuma", "Que quita la espuma"), means("rencoroso", "Que guarda rencor", "Que perdona pronto", "Que no siente nada"),
  f("El camino ___ nos destrozó las zapatillas.", "pedregoso", "piedra", "empedrar"), f("El Marañón es un río muy ___.", "caudaloso", "caudal", "encauzado"),
  f("La anciana, siempre ___, compartió su pan.", "bondadosa", "bondad", "bondadosamente"), f("Un ruido ___ venía del desván.", "misterioso", "misterio", "misteriosamente"),
];
const SIN: ChoiceItem[] = [
  means("anormal", "Que no es normal", "Muy normal", "Normal otra vez"), means("asimétrico", "Que no tiene simetría", "Que es simétrico", "Con doble simetría"),
  means("analfabeto", "Que no sabe leer ni escribir", "Que lee muy rápido y sin equivocarse", "Que enseña a leer"), means("anónimo", "Que no lleva el nombre del autor", "Que lleva muchos nombres y apellidos", "De nombre famoso"),
  means("sinfín", "Cantidad que no tiene fin", "El final de algo muy esperado", "Un fin cercano"), means("sinsabor", "Disgusto, falta de gusto", "Sabor muy fuerte y picante", "Sabor dulce"),
  means("atípico", "Que se sale de lo común", "Muy común en todas partes", "Común otra vez"), means("sinvergüenza", "Que actúa sin vergüenza", "Muy tímido con los desconocidos", "Que se sonroja"),
  f("El poema era ___: nadie sabía quién lo escribió.", "anónimo", "famoso", "nominal"), f("En el cielo había un ___ de estrellas.", "sinfín", "final", "confín"),
  f("Fue un invierno ___: casi no hizo frío.", "atípico", "típico", "tipificado"), f("La mariposa tenía un dibujo ___: un ala distinta de la otra.", "asimétrico", "simétrico", "métrico"),
];
const ABLE: ChoiceItem[] = [
  means("navegable", "Que se puede navegar", "Que navega solo, sin timón", "Que no flota"), means("inflamable", "Que se enciende con facilidad", "Que no arde nunca, ni con fósforos", "Que apaga el fuego"),
  means("legible", "Que se puede leer", "Que no se entiende", "Que lee mucho"), means("audible", "Que se puede oír", "Que no suena para nada", "Que oye bien"),
  means("renovable", "Que se puede renovar", "Que se acaba para siempre", "Que es antiguo"), means("discutible", "Que se puede poner en duda", "Que es totalmente seguro y cierto", "Que discute mucho"),
  means("potable", "Que se puede beber", "Que se puede comer", "Que está sucia"), means("increíble", "Difícil de creer", "Fácil de creer", "Que cree en todo"),
  f("Escribe con letra ___, por favor.", "legible", "lector", "leyenda"), f("La energía solar es ___.", "renovable", "renovación", "novedosa"),
  f("Cuidado: ese líquido es ___.", "inflamable", "inflamado", "llameante"), f("El Titicaca es un lago ___.", "navegable", "navegante", "naviero"),
];

const SAME_AFFIX = (affix: string, meaning: string, yes: string[], no: string[]) => (q: Parameters<typeof pickAll>[0]) => pickAll(q, `Selecciona las palabras en las que «${affix}» significa «${meaning}».`, yes, no, affix);
const AFFIX_GROUPS = [
  SAME_AFFIX("sub-", "debajo", ["subterráneo", "subsuelo", "submarino", "subrayar", "subtítulo"], ["subir", "súbito", "subasta", "sublime", "subida", "sujeto"]),
  SAME_AFFIX("mal-", "mal", ["malgastar", "maltratar", "malhumorado", "malentendido", "malherido"], ["maleta", "malla", "malecón", "malva", "maleza", "malabar"]),
  SAME_AFFIX("pre-", "antes", ["predecir", "prevenir", "prenatal", "preescolar", "precocido"], ["presa", "precio", "pregón", "prenda", "preso", "presión"]),
  SAME_AFFIX("in-/im-/i-", "no", ["inexacto", "imperfecto", "ilegal", "irreal", "impuntual"], ["iglesia", "imán", "isla", "invento", "imagen", "idioma"]),
  SAME_AFFIX("-able/-ible", "que se puede", ["navegable", "legible", "audible", "renovable", "potable"], ["cable", "tabla", "mueble", "roble", "sable", "doble"]),
  SAME_AFFIX("a-/an-", "sin, no", ["anormal", "atípico", "asimétrico", "anónimo", "analfabeto"], ["animal", "amigo", "abuelo", "antena", "anillo", "ardilla"]),
];
const SPEECH = sorter(["Sustantivo", "Adjetivo", "Verbo"], "¿Qué clase de palabra es?");
const SUFFIX_SPEECH: ChoiceItem[] = [
  ...["hermosura", "educación", "vendedor", "claridad", "amistad", "tristeza", "nacimiento", "dulzura"].map((x) => SPEECH(x, 0)),
  ...["navegable", "caudaloso", "legible", "pedregoso", "renovable", "misterioso", "audible", "bondadoso"].map((x) => SPEECH(x, 1)),
  ...["suavizar", "florecer", "clarificar", "endulzar", "organizar", "anochecer", "simplificar", "fortalecer"].map((x) => SPEECH(x, 2)),
];
const ANALOGIES: ChoiceItem[] = [
  f("legal → ilegal\nreal → ___", "irreal", "realidad", "realista"), f("gastar → malgastar\ntratar → ___", "maltratar", "tratado", "retratar"),
  f("piedra → pedregoso\nmisterio → ___", "misterioso", "misterios", "misteriosamente"), f("navegar → navegable\nleer → ___", "legible", "lector", "lectura"),
  f("suelo → subsuelo\ntítulo → ___", "subtítulo", "titular", "titulado"), f("normal → anormal\ntípico → ___", "atípico", "tipo", "tipificar"),
  f("decir → predecir\nvenir → ___", "prevenir", "venida", "revenir"), f("claro → claridad\nhermoso → ___", "hermosura", "hermosear", "hermosamente"),
  f("dulce → endulzar\nflor → ___", "florecer", "florero", "florido"), f("usar → reutilizar\nplantar árboles → ___", "reforestar", "forestal", "deforestar"),
];
const PATTERN_SENTENCES: ChoiceItem[] = [
  f("Lo que no es legal es ___.", "ilegal", "legalmente", "legalizar"), f("Un río que se puede navegar es ___.", "navegable", "navegante", "navegación"),
  f("Quien gasta mal su dinero lo ___.", "malgasta", "desgasta", "gastará"), f("Un terreno lleno de piedras es ___.", "pedregoso", "empedrado", "pedrada"),
  f("Lo que está bajo la tierra es ___.", "subterráneo", "terrenal", "aterrado"), f("Decir algo antes de que pase es ___.", "predecirlo", "desdecirlo", "maldecirlo"),
  f("Volver a usar algo es ___.", "reutilizarlo", "inutilizarlo", "utilizable"), f("Una carta sin nombre de autor es ___.", "anónima", "nominal", "renombrada"),
  f("Una letra que se puede leer es ___.", "legible", "leyenda", "lectora"), f("Quien no llega a la hora es ___.", "impuntual", "puntualmente", "puntualidad"),
];

// --- CC. Raíces griegas y latinas --------------------------------------------

const ROOT_SORT = (root: string, yes: string[], no: string[]) => (q: Parameters<typeof pickAll>[0]) => pickAll(q, `Selecciona las palabras que comparten la raíz «${root}».`, yes, no, root);
const ROOT_GROUPS = [
  ROOT_SORT("auto- (por sí mismo)", ["automóvil", "autógrafo", "autobiografía", "autorretrato"], ["aula", "autor", "aurora", "ausente", "auxilio"]),
  ROOT_SORT("foto- (luz)", ["fotografía", "fotosíntesis", "fotocopia", "fotón"], ["foca", "fogata", "fondo", "forma", "fósforo"]),
  ROOT_SORT("micro- (pequeño)", ["microscopio", "microbio", "micrófono", "microondas"], ["miedo", "miel", "mitad", "mirada", "minero"]),
  ROOT_SORT("-scopio (mirar)", ["telescopio", "microscopio", "periscopio", "estetoscopio"], ["escoba", "escudo", "espejo", "copia", "escondite"]),
  ROOT_SORT("termo- (calor)", ["termómetro", "termo", "térmico", "termostato"], ["término", "ternero", "terreno", "tercio", "terror"]),
  ROOT_SORT("-fono / fon- (sonido)", ["teléfono", "micrófono", "fonética", "megáfono"], ["fondo", "fonda", "fogón", "forro", "foso"]),
];
const ROOT_CLUES: ChoiceItem[] = [
  w("«Hemi-» significa «mitad». ¿Qué es un hemisferio?", "La mitad de una esfera", "Una esfera completa", "El centro de la Tierra"), w("«Multi-» significa «muchos». ¿Qué es algo multicolor?", "De muchos colores", "De un solo color", "Sin ningún color"),
  w("«Equi-» significa «igual». ¿Qué es un triángulo equilátero?", "El que tiene sus lados iguales", "El que tiene lados distintos", "El que tiene un lado curvo"), w("«Pedi-/ped-» significa «pie». ¿Qué es un peatón?", "Quien va a pie", "Quien va en auto", "Quien vende zapatos"),
  w("«Herb-» significa «hierba». ¿Qué come un herbívoro?", "Plantas", "Carne", "De todo"), w("«Carn-» significa «carne». ¿Qué come un carnívoro?", "Carne", "Plantas", "Solo frutas"),
  w("«Manu-» significa «mano». ¿Qué es un trabajo manual?", "El que se hace con las manos", "El que hace una máquina muy moderna", "El que se hace de noche"), w("«Acu-» significa «agua». ¿Qué es un acueducto?", "Un canal que conduce agua", "Un camino de tierra para carretas", "Un puente para trenes"),
  w("«Xeno-» significa «extranjero». ¿Qué es la xenofobia?", "El rechazo a los extranjeros", "El amor a los viajes por el mundo", "El miedo al agua"), w("«Bene-» significa «bien». ¿Qué es un benefactor?", "Quien hace el bien a otros", "Quien causa daño a los demás", "Quien vende bienes"),
];
const MEANING_TO_ROOT: ChoiceItem[] = [
  w("«Hemisferio» es media esfera y «hemiciclo», medio círculo. ¿Qué significa «hemi-»?", "mitad", "esfera", "doble"), w("«Multicolor» tiene muchos colores y «multitud» es mucha gente. ¿Qué significa «multi-»?", "muchos", "color", "pocos"),
  w("«Equilátero» tiene lados iguales y «equidistante» está a igual distancia. ¿Qué significa «equi-»?", "igual", "lado", "lejos"), w("«Herbívoro» come plantas y «carnívoro» come carne. ¿Qué significa «-voro»?", "que come", "planta", "animal"),
  w("«Manuscrito» se escribe a mano y «manualidad» se hace con las manos. ¿Qué significa «manu-»?", "mano", "escrito", "arte"), w("«Peatón» va a pie y «pedal» se mueve con el pie. ¿Qué significa «ped-»?", "pie", "camino", "rueda"),
  w("«Claustrofobia» es miedo al encierro y «aracnofobia», miedo a las arañas. ¿Qué significa «-fobia»?", "miedo", "araña", "encierro"), w("«Biblioteca» guarda libros y «bibliografía» es una lista de libros. ¿Qué significa «biblio-»?", "libro", "lista", "lugar"),
  w("«Cardiólogo» trata el corazón y «cardiaco» se refiere al corazón. ¿Qué significa «cardio-»?", "corazón", "médico", "sangre"), w("«Hidrografía» describe las aguas y «geografía», la Tierra. ¿Qué significa «-grafía»?", "descripción", "agua", "tierra"),
];
const WORDS_TO_ROOT = ask((t) => `Observa las palabras: ${t}. ¿Qué significa la raíz que comparten?`, [
  ["teléfono, televisión, telescopio", "lejos"], ["biología, biografía, biosfera", "vida"], ["termómetro, termo, térmico", "calor"], ["acuario, acuático, acueducto", "agua"],
  ["dentista, dental, dentadura", "diente"], ["triciclo, triángulo, trípode", "tres"], ["zoológico, zoología", "animal"], ["microscopio, microbio, microchip", "pequeño"],
  ["cronómetro, cronología, crónica", "tiempo"], ["fotografía, fotosíntesis, fotocopia", "luz"],
]);
const ROOT_MEANING = ask((t) => `¿Qué significa la raíz ${t}?`, [
  ["hemi- (hemisferio)", "mitad"], ["multi- (multicolor, multitud)", "muchos"], ["equi- (equilátero, equilibrio)", "igual"], ["ped- (peatón, pedal)", "pie"],
  ["manu- (manuscrito, manual)", "mano"], ["biblio- (biblioteca)", "libro"], ["cardio- (cardiólogo)", "corazón"], ["-voro (herbívoro, carnívoro)", "que come"],
  ["-fobia (claustrofobia)", "miedo"], ["bene- (beneficio, benefactor)", "bien"], ["auto- (automóvil, autógrafo)", "por sí mismo"], ["-cracia (democracia)", "gobierno"],
]);
const ROOT_WORDS: ChoiceItem[] = [
  means("manuscrito", "Texto escrito a mano", "Texto impreso en máquina", "Libro de mano"), means("equidistante", "Que está a igual distancia", "Que está muy lejos de todo lo demás", "Que no tiene distancia"),
  means("multitud", "Gran cantidad de personas", "Persona sola en medio de la plaza", "Grupo de dos"), means("bibliografía", "Lista de libros consultados", "Vida de un autor contada por otro", "Tienda de libros"),
  means("cardiólogo", "Médico del corazón", "Médico de los huesos", "Médico de los niños"), means("aracnofobia", "Miedo a las arañas", "Gusto por las arañas", "Estudio de las arañas"),
  means("democracia", "Gobierno elegido por el pueblo", "Gobierno de un solo rey o emperador", "Falta de gobierno"), means("autobiografía", "Vida de alguien contada por él mismo", "Vida de una persona contada por su vecino", "Libro sobre autos"),
  means("periscopio", "Aparato para mirar sobre un obstáculo", "Aparato para oír lo que pasa muy lejos", "Aparato para medir"), means("hidrografía", "Descripción de mares, ríos y lagos", "Descripción de montañas y volcanes", "Estudio del clima"),
];
const ROOT_MATCH = pool([
  ["hemisferio", "media esfera"], ["peatón", "persona que va a pie"], ["herbívoro", "animal que come plantas"], ["manuscrito", "escrito a mano"], ["autógrafo", "firma de propia mano"],
  ["termostato", "aparato que regula el calor"], ["megáfono", "aparato que amplía el sonido"], ["equilátero", "de lados iguales"], ["microbio", "ser vivo muy pequeño"], ["bibliografía", "lista de libros"],
]);
const ROOT_USE: ChoiceItem[] = [
  f("El Perú está en el ___ sur.", "hemisferio", "hemiciclo", "atmósfera"), f("El ___ debe cruzar por la esquina.", "peatón", "pedal", "pedestal"),
  f("La vicuña es un animal ___.", "herbívoro", "carnívoro", "omnipresente"), f("El museo guarda un ___ del siglo XVII.", "manuscrito", "manubrio", "manicomio"),
  f("El cantante me firmó un ___.", "autógrafo", "automóvil", "autómata"), f("Vimos bacterias con el ___.", "microscopio", "telescopio", "periscopio"),
  f("El guía habló por un ___ para que todos oyeran.", "megáfono", "teléfono", "xilófono"), f("Al final del informe va la ___.", "bibliografía", "biografía", "biblioteca"),
  f("Una ___ llenó la plaza en Fiestas Patrias.", "multitud", "multa", "multiplicación"), f("En una ___, los ciudadanos votan.", "democracia", "demografía", "burocracia"),
];

// --- DD. Categorías ----------------------------------------------------------

const GROUPS: Record<string, string[]> = {
  "géneros literarios": ["cuento", "novela", "fábula", "leyenda", "poema", "mito"],
  "figuras y cuerpos geométricos": ["prisma", "cilindro", "pentágono", "esfera", "pirámide", "rombo"],
  "aparatos de medición": ["termómetro", "balanza", "cronómetro", "brújula", "regla", "barómetro"],
  "ecosistemas": ["bosque", "desierto", "manglar", "puna", "arrecife", "páramo"],
  "instrumentos de viento": ["quena", "zampoña", "flauta", "trompeta", "clarinete", "pututo"],
  "signos de puntuación": ["coma", "punto", "raya", "paréntesis", "comillas", "dos puntos"],
};
const GROUP_NAMES = Object.keys(GROUPS);
const othersOf = (g: string) => GROUP_NAMES.filter((k) => k !== g).flatMap((k) => GROUPS[k]);

// --- EE. Sinónimos y antónimos -----------------------------------------------

const SYNONYMS = ask((x) => `¿Cuál es un sinónimo de «${x}»?`, [
  ["abundante", "copioso"], ["breve", "conciso"], ["tenaz", "constante"], ["remoto", "lejano"], ["cautela", "prudencia"], ["asombro", "sorpresa"],
  ["extenso", "amplio"], ["adversario", "rival"], ["labor", "tarea"], ["sereno", "tranquilo"], ["veloz", "raudo"], ["apreciar", "valorar"],
]);
const SYN = "¿Qué palabra del texto es sinónimo de la palabra destacada?";
const SYN_CONTEXT: ChoiceItem[] = [
  pt(SYN, "El sendero era ESCABROSO. Avanzamos lentamente por aquel camino accidentado.", "accidentado", "lentamente", "avanzamos"), pt(SYN, "Fue una respuesta CONCISA. La maestra valoró que fuera tan breve.", "breve", "maestra", "valoró"),
  pt(SYN, "La laguna estaba SERENA. Sus aguas tranquilas reflejaban el nevado.", "tranquilas", "reflejaban", "nevado"), pt(SYN, "Es una jugadora TENAZ. Ninguna rival es tan perseverante como ella.", "perseverante", "ninguna", "rival"),
  pt(SYN, "El castillo quedaba en un lugar REMOTO. Nadie visitaba un sitio tan apartado.", "apartado", "visitaba", "castillo"), pt(SYN, "Recibimos una lluvia COPIOSA. Fue tan abundante que inundó la plaza.", "abundante", "inundó", "plaza"),
  pt(SYN, "Habló con CAUTELA. Su prudencia evitó una discusión.", "prudencia", "discusión", "evitó"), pt(SYN, "El público quedó ATÓNITO. Todos estaban asombrados por el truco.", "asombrados", "público", "truco"),
];
const ANTONYMS = ask((x) => `¿Cuál es un antónimo de «${x}»?`, [
  ["abundante", "escaso"], ["conciso", "extenso"], ["remoto", "cercano"], ["sereno", "agitado"], ["cautela", "imprudencia"], ["adversario", "aliado"],
  ["apreciar", "despreciar"], ["optimista", "pesimista"], ["rígido", "flexible"], ["ampliar", "reducir"], ["nítido", "borroso"], ["cumbre", "abismo"],
]);
const ANTC = "¿Qué palabra del texto es antónimo de la palabra destacada?";
const ANT_CONTEXT: ChoiceItem[] = [
  pt(ANTC, "La imagen de la primera foto es NÍTIDA; la de la segunda salió borrosa.", "borrosa", "segunda", "imagen"), pt(ANTC, "Mi tía es OPTIMISTA, mientras que su hermano es bastante pesimista.", "pesimista", "bastante", "hermano"),
  pt(ANTC, "En verano el agua es ABUNDANTE; en invierno se vuelve escasa.", "escasa", "invierno", "vuelve"), pt(ANTC, "El primer informe fue EXTENSO y el segundo, conciso.", "conciso", "segundo", "informe"),
  pt(ANTC, "Antes eran ADVERSARIOS; después del torneo se hicieron aliados.", "aliados", "torneo", "después"), pt(ANTC, "El acero es RÍGIDO, pero el caucho es flexible.", "flexible", "caucho", "acero"),
  pt(ANTC, "Unos APRECIAN el silencio; otros lo desprecian.", "desprecian", "silencio", "otros"), pt(ANTC, "El mar amaneció SERENO y por la tarde estaba agitado.", "agitado", "tarde", "amaneció"),
];

// --- FF. Analogías -----------------------------------------------------------

const ANALOGY: ChoiceItem[] = [
  f("pez es a agua como ave es a ___", "aire", "nido", "pluma"), f("pintor es a pincel como escritor es a ___", "lapicero", "libro", "lector"),
  f("frío es a calor como noche es a ___", "día", "luna", "sueño"), f("hoja es a árbol como pétalo es a ___", "flor", "jardín", "tallo"),
  f("médico es a hospital como maestro es a ___", "escuela", "alumno", "pizarra"), f("semilla es a planta como huevo es a ___", "ave", "nido", "cáscara"),
  f("capítulo es a libro como escena es a ___", "obra de teatro", "actor", "telón"), f("sed es a beber como hambre es a ___", "comer", "cocina", "plato"),
  f("isla es a mar como oasis es a ___", "desierto", "palmera", "agua"), f("ayer es a pasado como mañana es a ___", "futuro", "tarde", "presente"),
  f("oído es a escuchar como ojo es a ___", "ver", "lentes", "pestaña"), f("alpaca es a lana como abeja es a ___", "miel", "flor", "panal"),
];

// --- GG. Homófonos y homónimos -----------------------------------------------

const HOMOPHONE_PIC = pool([
  ["🥛 Recipiente para beber", "vaso"], ["📏 Me apoyo en algo para afirmar (verbo basar)", "baso"], ["🗳️ Papeleta de una elección", "voto"], ["🗑️ Echo a la basura (verbo botar)", "boto"],
  ["🌳 Líquido que circula por las plantas", "savia"], ["🦉 Que sabe mucho", "sabia"], ["📖 Pasar las hojas de un libro", "hojear"], ["👀 Mirar rápidamente", "ojear"],
  ["📸 Dar a conocer un secreto", "revelar"], ["✊ Levantarse contra una autoridad", "rebelar"],
]);
const HOMOPHONE_USE: ChoiceItem[] = [
  f("Me ___ en los datos del censo para mi informe.", "baso", "vaso", "bazo"), f("Sírveme un ___ de chicha, por favor.", "vaso", "baso", "bazo"),
  f("Yo ___ la basura todas las noches.", "boto", "voto", "bóto"), f("Mi ___ fue para la lista azul.", "voto", "boto", "vóto"),
  f("La ___ sube por el tallo de la planta.", "savia", "sabia", "sabía"), f("Voy a ___ la revista antes de comprarla.", "hojear", "ojear", "ogear"),
  f("El mago no quiso ___ su truco.", "revelar", "rebelar", "rrevelar"), f("El cazador ___ vizcachas en el cerro.", "caza", "casa", "cassa"),
  f("Mi prima se ___ en diciembre.", "casa", "caza", "caça"), f("La ___ del mar mojó la toalla.", "ola", "hola", "olla"),
  f("Hay que ___ al caballo antes del viaje.", "herrar", "errar", "herar"), f("El gato ___ el plato de leche.", "halló", "hayó", "ayó"),
];
const MULTI_PIC = pool([
  ["☄️  🪁", "cometa"], ["🛍️  📈", "bolsa"], ["🥭  🍳", "mango"], ["📻  ⭕", "radio"], ["🏙️  💰", "capital"],
  ["🖱️  🐁", "ratón"], ["🎼  📝", "nota"], ["🪵  🧍", "tronco"], ["🧊  🪣", "cubo"], ["🏦  🐟", "banco"],
]);
const DEF = "¿Qué significado tiene la palabra destacada en la oración?";
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt(DEF, "El juez dictó su FALLO.", "Decisión de un tribunal", "Error o equivocación de alguien", "Avería"), pt(DEF, "El motor tuvo un FALLO.", "Avería o defecto", "Decisión de un tribunal de justicia", "Acierto"),
  pt(DEF, "El RADIO del círculo mide dos centímetros.", "Línea del centro al borde", "Aparato que transmite música y noticias", "Hueso"), pt(DEF, "Sacó una buena NOTA en ciencias.", "Calificación", "Sonido musical de una melodía", "Mensaje breve"),
  pt(DEF, "Dejó una NOTA en la refrigeradora.", "Mensaje breve escrito", "Calificación de un examen final", "Sonido"), pt(DEF, "La ORDEN del capitán fue clara.", "Mandato", "Manera de colocar las cosas en su sitio", "Grupo religioso"),
  pt(DEF, "El CAPITAL del negocio era pequeño.", "Dinero para invertir", "Ciudad principal de un país o región", "Letra mayúscula"), pt(DEF, "Lima es la CAPITAL del Perú.", "Ciudad principal de un país", "Dinero que se invierte en un negocio", "Pena máxima"),
  pt(DEF, "El FRENTE frío llegará el lunes.", "Zona de choque entre masas de aire", "Parte de la cara sobre las cejas", "Fachada"), pt(DEF, "Se golpeó la FRENTE con la puerta.", "Parte superior de la cara", "Primera línea de un ejército en guerra", "Fachada"),
];
const SENT = "¿En qué oración la palabra tiene ese significado?";
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  pt(SENT, "cólera: enfermedad contagiosa", "En 1991 hubo una epidemia de cólera.", "Montó en cólera al ver el desorden de la sala.", "Su cólera duró poco."),
  pt(SENT, "corte: tribunal de justicia", "La corte declaró inocente al acusado.", "Se hizo un corte en el dedo con el cuchillo.", "Me gusta tu corte."),
  pt(SENT, "pendiente: cuesta o inclinación del terreno", "La bicicleta bajó sola por la pendiente.", "Tengo una tarea pendiente de la semana pasada.", "Perdió un pendiente."),
  pt(SENT, "cometa: astro con cola luminosa", "El cometa Halley volverá en 2061.", "Volamos una cometa de papel en el cerro.", "Mi cometa se enredó."),
  pt(SENT, "partida: salida hacia otro lugar", "La partida del tren fue a las seis.", "Jugamos una partida de ajedrez muy larga.", "Ganó la partida."),
  pt(SENT, "tronco: cuerpo humano sin cabeza ni extremidades", "El médico le examinó el tronco.", "Nos sentamos en un tronco junto al río.", "El tronco era de pino."),
  pt(SENT, "bolsa: mercado donde se compran acciones", "Las acciones subieron en la bolsa.", "Guardó las frutas en una bolsa de tela.", "La bolsa se rompió."),
  pt(SENT, "mango: parte por donde se agarra un objeto", "La sartén tiene el mango flojo.", "Comí un mango muy dulce en el desayuno.", "El mango estaba verde."),
];

// --- HH. Modismos y refranes -------------------------------------------------

const IDIOM = "¿Qué significa la expresión destacada?";
const IDIOM_CONTEXT_1: ChoiceItem[] = [
  pt(IDIOM, "Cuando le preguntaron por el vidrio roto, Raúl SE HIZO EL LOCO.", "Fingió no saber nada.", "Empezó a gritar como un loco.", "Se rio."), pt(IDIOM, "Hoy mi hermana ESTÁ EN LA LUNA: no oye nada de lo que le digo.", "Está distraída.", "Está de viaje por el espacio.", "Está feliz."),
  pt(IDIOM, "Con ese gol, el equipo SE PUSO LAS PILAS.", "Reaccionó con energía.", "Cambió las baterías del marcador.", "Se cansó."), pt(IDIOM, "No me gusta que me DEN GATO POR LIEBRE.", "Que me engañen con algo peor.", "Que me regalen animales.", "Que me cocinen."),
  pt(IDIOM, "El examen estuvo PAPAYITA.", "Estuvo muy fácil.", "Estuvo dulce como una fruta.", "Estuvo largo."), pt(IDIOM, "Mi abuelo NO TIENE PELOS EN LA LENGUA.", "Dice lo que piensa sin rodeos.", "Tiene la lengua muy limpia.", "Habla poco."),
  pt(IDIOM, "Tuvimos que HACER UNA CHANCHA para comprar la torta.", "Juntar dinero entre todos.", "Criar un cerdo en el patio.", "Pedir fiado."), pt(IDIOM, "Después de la carrera quedé HECHO POLVO.", "Agotadísimo.", "Cubierto de tierra del camino.", "Contento."),
];
const SAYING_1: ChoiceItem[] = [
  w("¿Qué significa «No dejes para mañana lo que puedes hacer hoy»?", "No hay que postergar las tareas.", "Mañana siempre habrá más tiempo libre.", "Hoy es feriado."), w("¿Qué significa «Quien siembra vientos recoge tempestades»?", "Quien hace daño recibirá daño.", "El viento ayuda a que crezcan los sembríos.", "Lloverá pronto."),
  w("¿Qué significa «A caballo regalado no se le mira el diente»?", "No se critica lo que se recibe gratis.", "Hay que revisar bien a los caballos.", "Los regalos son caros."), w("¿Qué significa «El hábito no hace al monje»?", "La apariencia no dice cómo es alguien.", "Los monjes usan ropa especial cada día.", "Hay que vestirse bien."),
  w("¿Qué significa «Ver para creer»?", "Solo creo lo que compruebo.", "Hay que cuidarse mucho la vista.", "Creo todo."), w("¿Qué significa «Matar dos pájaros de un tiro»?", "Lograr dos cosas con una sola acción.", "Salir a cazar aves al campo.", "Fallar."),
  w("¿Qué significa «Poner el hombro»?", "Ayudar con esfuerzo.", "Cargar una mochila pesada.", "Descansar."), w("¿Qué significa «Llover sobre mojado»?", "Sumarse un problema a otro.", "Regar las plantas dos veces.", "Secarse."),
];
const IDIOM_CONTEXT_2: ChoiceItem[] = [
  pt(IDIOM, "Le pedí un favor y ME DIO LA ESPALDA.", "Se negó a ayudarme.", "Me cargó sobre sus hombros.", "Me abrazó."), pt(IDIOM, "Esa película ME PUSO LA PIEL DE GALLINA.", "Me emocionó o me asustó mucho.", "Me dio ganas de comer pollo.", "Me aburrió."),
  pt(IDIOM, "La directora PUSO LAS CARTAS SOBRE LA MESA.", "Habló con total claridad.", "Empezó a jugar naipes con todos.", "Se calló."), pt(IDIOM, "Mi primo siempre LLEVA LA CONTRARIA.", "Se opone a lo que dicen los demás.", "Carga las cosas al revés.", "Obedece."),
  pt(IDIOM, "Con el nuevo trabajo, mi papá ANDA CON EL TIEMPO JUSTO.", "Casi no le alcanza el tiempo.", "Usa un reloj muy exacto.", "Llega temprano."), pt(IDIOM, "Lo vi tan triste que SE ME PARTIÓ EL ALMA.", "Sentí muchísima pena.", "Me dolió el estómago de pronto.", "Me reí."),
  pt(IDIOM, "El vendedor quiso VERME LA CARA.", "Quiso engañarme.", "Quiso saludarme con cariño.", "Quiso retratarme."), pt(IDIOM, "Ese chiste ya está MÁS VISTO QUE EL SOL.", "Es muy conocido.", "Es muy brillante y caluroso.", "Es nuevo."),
];
const SAYING_2: ChoiceItem[] = [
  w("¿Qué significa «Agua que no has de beber, déjala correr»?", "No te metas en lo que no te corresponde.", "Siempre hay que hervir el agua del río.", "Bebe poco."), w("¿Qué significa «Perro que ladra no muerde»?", "Quien amenaza mucho suele hacer poco.", "Los perros que ladran son todos mansos.", "Cuida tu perro."),
  w("¿Qué significa «De tal palo, tal astilla»?", "Los hijos se parecen a sus padres.", "La madera se parte con facilidad.", "Usa leña seca."), w("¿Qué significa «En casa de herrero, cuchillo de palo»?", "Falta algo justo donde debería abundar.", "Los herreros prefieren trabajar la madera.", "Compra cuchillos."),
  w("¿Qué significa «No hay mal que por bien no venga»?", "De lo malo puede salir algo bueno.", "Todo lo malo trae siempre más cosas malas.", "Nada cambia."), w("¿Qué significa «Buscar una aguja en un pajar»?", "Buscar algo casi imposible de hallar.", "Coser en medio del campo.", "Ordenar la paja."),
  w("¿Qué significa «Echar leña al fuego»?", "Empeorar una discusión.", "Preparar una fogata para cocinar.", "Apagar el fuego."), w("¿Qué significa «Quien mucho abarca, poco aprieta»?", "Quien intenta demasiado no logra nada bien.", "Hay que abrazar fuerte a los amigos.", "Ten manos grandes."),
];

// --- II. Matices de significado ----------------------------------------------

const DIFFERENCE: ChoiceItem[] = [
  w("¿En qué se diferencian «oír» y «escuchar»?", "«Escuchar» es oír con atención.", "«Oír» exige mucha más atención.", "Son iguales."), w("¿En qué se diferencian «ver» y «observar»?", "«Observar» es mirar con detenimiento.", "«Ver» es mirar con muchísimo más cuidado.", "Son iguales."),
  w("¿En qué se diferencian «alegre» y «eufórico»?", "«Eufórico» es una alegría desbordante.", "«Alegre» es bastante más intenso.", "«Eufórico» es triste."), w("¿En qué se diferencian «molesto» y «furioso»?", "«Furioso» es un enojo mucho mayor.", "«Molesto» es un enojo más fuerte.", "«Furioso» es calmado."),
  w("¿En qué se diferencian «pedir» y «suplicar»?", "«Suplicar» es pedir con ruegos.", "«Pedir» es rogar de rodillas.", "«Suplicar» es ordenar."), w("¿En qué se diferencian «viejo» y «antiguo»?", "«Antiguo» suele sugerir valor por su edad.", "«Viejo» siempre es un elogio.", "Son contrarios."),
  w("¿En qué se diferencian «delgado» y «escuálido»?", "«Escuálido» es delgado en exceso.", "«Delgado» es flaco en extremo.", "«Escuálido» es robusto."), w("¿En qué se diferencian «llovizna» y «diluvio»?", "El «diluvio» es una lluvia torrencial.", "La «llovizna» es mucho más fuerte.", "Son iguales."),
];
const CON = sorter(["Positiva 👍", "Negativa 👎"], "¿La palabra destacada tiene una connotación positiva o negativa?");
const CONNOTATION: ChoiceItem[] = [
  ...["Es una vendedora PERSISTENTE.", "Tiene un aroma INTENSO.", "Es un niño INQUIETO por aprender.", "Vive en una casa SENCILLA.", "Fue una decisión AUDAZ.", "Es un hombre RESERVADO.", "Hizo un comentario FRANCO."].map((x) => CON(x, 0)),
  ...["Es una vendedora FASTIDIOSA.", "Tiene un TUFO intenso.", "Es un niño REVOLTOSO.", "Vive en una casucha MISERABLE.", "Fue una decisión TEMERARIA.", "Es un hombre HURAÑO.", "Hizo un comentario GROSERO."].map((x) => CON(x, 1)),
];

// --- JJ. Claves de contexto --------------------------------------------------

const FIND_WORD: ChoiceItem[] = [
  f("El terreno era tan ___ que no crecía ni una hierba.", "árido", "fértil", "húmedo"), f("Con voz ___, casi un susurro, pidió disculpas.", "tenue", "potente", "chillona"),
  f("La decisión fue ___: todos votaron a favor.", "unánime", "dividida", "dudosa"), f("El anciano, ___ por la noticia, tuvo que sentarse.", "conmovido", "aburrido", "distraído"),
  f("Tras la sequía, el reservorio quedó casi ___.", "vacío", "repleto", "rebosante"), f("El testigo fue ___: contó todo sin omitir nada.", "minucioso", "descuidado", "breve"),
  f("El río, ___ por las lluvias, se llevó el puente.", "crecido", "seco", "tranquilo"), f("Era un tema ___: nadie en el aula lo entendía.", "complejo", "sencillo", "divertido"),
  f("El guardián, siempre ___, notó la ventana abierta.", "alerta", "dormido", "ausente"), f("Fue un gesto ___: donó todo su premio.", "generoso", "mezquino", "tímido"),
];
const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «efímero»?", "La flor del cactus es efímera, es decir, dura muy poco.", "De corta duración", "De gran tamaño", "De olor fuerte"), pt("¿Qué significa «perplejo»?", "Quedó perplejo, o sea, confundido, ante la pregunta.", "Confundido", "Contento", "Cansado"),
  pt("¿Qué significa «oriundo»?", "Es oriundo de Tarma: nació y creció allí.", "Originario de un lugar", "Visitante de paso", "Dueño de tierras"), pt("¿Qué significa «vasto»?", "Cruzaron un desierto vasto, inmenso hasta donde alcanzaba la vista.", "Muy extenso", "Muy seco", "Muy peligroso"),
  pt("¿Qué significa «austero»?", "Lleva una vida austera, sencilla y sin lujos.", "Sencilla", "Divertida", "Desordenada"), pt("¿Qué significa «ileso»?", "Salió ileso del accidente: no sufrió ningún daño.", "Sin heridas", "Muy asustado", "Malherido"),
  pt("¿Qué significa «indagar»?", "La policía va a indagar, es decir, a investigar el caso.", "Investigar", "Olvidar", "Cerrar"), pt("¿Qué significa «súbito»?", "Hubo un cambio súbito, repentino, en el clima.", "Repentino", "Lento", "Agradable"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «hostil»?", "El clima era hostil: vientos helados, granizo y ni un refugio.", "Adverso, poco amigable", "Templado y agradable", "Muy caluroso"), pt("¿Qué significa «meticulosa»?", "Fue meticulosa: revisó cada tornillo dos veces antes de cerrar la tapa.", "Muy cuidadosa", "Muy rápida", "Muy olvidadiza"),
  pt("¿Qué significa «menguó»?", "El caudal menguó tanto que se podía cruzar el río a pie.", "Disminuyó", "Aumentó", "Se ensució"), pt("¿Qué significa «elocuente»?", "Su discurso fue tan elocuente que convenció hasta a sus rivales.", "Que habla de modo convincente", "Que habla muy bajo", "Que habla poco"),
  pt("¿Qué significa «precario»?", "El puente era precario: tablas sueltas y sogas gastadas.", "Inseguro, frágil", "Moderno y firme", "Muy ancho"), pt("¿Qué significa «reacio»?", "Era reacio a cambiar: se negó a probar el método nuevo.", "Que se resiste", "Que acepta todo", "Que duda poco"),
  pt("¿Qué significa «exhaustivo»?", "Hizo un estudio exhaustivo: no dejó ningún dato sin revisar.", "Muy completo", "Muy breve", "Muy confuso"), pt("¿Qué significa «lúgubre»?", "La casona era lúgubre: oscura, silenciosa y cubierta de telarañas.", "Sombría y triste", "Alegre y luminosa", "Pequeña"),
];
const DOMAIN = pool([
  ["🌍 Línea imaginaria que divide la Tierra en dos hemisferios", "ecuador"], ["🧬 Unidad más pequeña de un ser vivo", "célula"], ["🌋 Roca fundida que sale de un volcán", "lava"], ["📐 Línea que une dos vértices no contiguos de un polígono", "diagonal"],
  ["🌦️ Conjunto de gases que rodea la Tierra", "atmósfera"], ["🏛️ Conjunto de leyes principales de un país", "constitución"], ["🪐 Trayectoria de un planeta alrededor del Sol", "órbita"], ["🍃 Proceso por el que las plantas fabrican su alimento", "fotosíntesis"],
  ["⚡ Camino cerrado por donde circula la electricidad", "circuito"], ["🗳️ Derecho de los ciudadanos a votar", "sufragio"],
]);
const ACADEMIC: ChoiceItem[] = [
  f("___ las causas de la sequía y explica cada una.", "Analiza", "Dibuja", "Memoriza"), f("Lee los dos textos y ___ sus semejanzas y diferencias.", "contrasta", "copia", "subraya"),
  f("___ tu opinión con dos razones.", "Fundamenta", "Esconde", "Repite"), f("A partir de los datos, ___ una conclusión.", "infiere", "inventa", "ignora"),
  f("___ el proceso en un esquema de cuatro pasos.", "Sintetiza", "Critica", "Opina"), f("___ la fuente antes de usar esa información.", "Verifica", "Adorna", "Supón"),
  f("El experimento permitió ___ la hipótesis.", "comprobar", "decorar", "imaginar"), f("___ las palabras según su categoría gramatical.", "Clasifica", "Calcula", "Predice"),
  f("En el párrafo final, ___ lo aprendido.", "evalúa", "mide", "traza"), f("___ el fenómeno con tus propias palabras.", "Describe", "Suma", "Tacha"),
];

// --- KK. Uso del diccionario -------------------------------------------------

const ABC2 = [["cabildo", "ceniza", "ciprés", "cosecha", "cumbre"], ["tabla", "techo", "timón", "torre", "túnel"], ["nave", "nevado", "nido", "noticia", "nube"], ["rama", "regla", "ribera", "roca", "ruta"]];
const ABC3 = [["proa", "prado", "prenda", "prisa", "prueba"], ["grano", "greda", "grillo", "gruta", "grosor"], ["flauta", "flecha", "flor", "fluido", "flaco"], ["clavo", "clima", "cloro", "club", "clase"]];
const ABC4 = [["constancia", "constelación", "constitución", "construir", "consuelo"], ["interés", "interior", "internet", "intervalo", "interno"], ["desayuno", "descanso", "desfile", "desierto", "despensa"], ["parada", "paraguas", "paralelo", "páramo", "parásito"]];

const GUIDE_WORDS: ChoiceItem[] = [
  w("Las palabras guía de la página son «desierto» y «destino». ¿Qué palabra está en esa página?", "despensa", "desayuno", "detalle", "decena"), w("Las palabras guía de la página son «marea» y «marzo». ¿Qué palabra está en esa página?", "marino", "manta", "masa", "madera"),
  w("Las palabras guía de la página son «plano» y «plaza». ¿Qué palabra está en esa página?", "plata", "placa", "pluma", "pleno"), w("Las palabras guía de la página son «canal» y «canto». ¿Qué palabra está en esa página?", "canoa", "camino", "caña", "cabra"),
  w("Las palabras guía de la página son «trabajo» y «tren». ¿Qué palabra está en esa página?", "trazo", "trigo", "tabla", "trompo"), w("Las palabras guía de la página son «entrada» y «envío». ¿Qué palabra está en esa página?", "envase", "enero", "época", "encima"),
  w("Las palabras guía de la página son «globo» y «gota». ¿Qué palabra está en esa página?", "golpe", "gente", "grano", "gallo"), w("Las palabras guía de la página son «selva» y «señal». ¿Qué palabra está en esa página?", "semilla", "sed", "sierra", "sábado"),
];

const ENTRY = "caudal s. m. 1. Cantidad de agua que lleva un río. 2. Conjunto de bienes o dinero de una persona. Der. caudaloso. Pl. caudales.";
const ENTRY2 = "tenue adj. 1. Delicado, delgado. 2. De poca intensidad: una luz tenue. Sin. débil, suave. Ant. intenso.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «caudal»?", ENTRY, "Sustantivo masculino", "Adjetivo", "Verbo"), pt("Según la entrada, ¿qué indica «Der.»?", ENTRY, "Una palabra derivada", "La mano derecha", "Un sinónimo"),
  pt("Según la entrada, ¿cuál es el plural de «caudal»?", ENTRY, "caudales", "caudals", "caudalces"), pt("Según la entrada, ¿cuántas acepciones tiene «caudal»?", ENTRY, "Dos", "Una", "Cuatro"),
  pt("Según la entrada, ¿qué clase de palabra es «tenue»?", ENTRY2, "Adjetivo", "Sustantivo", "Adverbio"), pt("Según la entrada, ¿cuál es un antónimo de «tenue»?", ENTRY2, "intenso", "suave", "débil"),
  pt("Según la entrada, ¿para qué sirve «una luz tenue»?", ENTRY2, "Para dar un ejemplo de uso", "Para dar un sinónimo más preciso", "Para dar el plural"), pt("Según la entrada, ¿qué palabra puede reemplazar a «tenue»?", ENTRY2, "débil", "intenso", "fuerte"),
];
const ENTRY3 = "cabo s. m. 1. Extremo de una cosa. 2. Punta de tierra que entra en el mar. 3. Grado militar inferior al de sargento. 4. Cuerda de un barco.";
const ENTRY4 = "planta s. f. 1. Ser vivo vegetal. 2. Parte inferior del pie. 3. Piso de un edificio. 4. Fábrica o instalación industrial.";
const WHICH = "¿Qué acepción se usa en la oración?";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY3}\n\n«El barco dobló el cabo al atardecer».`, "La acepción 2", "La acepción 1", "La acepción 3"), pt(WHICH, `${ENTRY3}\n\n«El cabo ordenó formar la fila».`, "La acepción 3", "La acepción 2", "La acepción 4"),
  pt(WHICH, `${ENTRY3}\n\n«El marinero lanzó un cabo al muelle».`, "La acepción 4", "La acepción 1", "La acepción 2"), pt(WHICH, `${ENTRY3}\n\n«Sujeta el otro cabo de la soga».`, "La acepción 1", "La acepción 3", "La acepción 4"),
  pt(WHICH, `${ENTRY4}\n\n«Mi tía trabaja en una planta de tratamiento de agua».`, "La acepción 4", "La acepción 1", "La acepción 3"), pt(WHICH, `${ENTRY4}\n\n«La oficina queda en la tercera planta».`, "La acepción 3", "La acepción 2", "La acepción 4"),
  pt(WHICH, `${ENTRY4}\n\n«Me salió una ampolla en la planta».`, "La acepción 2", "La acepción 1", "La acepción 3"), pt(WHICH, `${ENTRY4}\n\n«Riega la planta dos veces por semana».`, "La acepción 1", "La acepción 2", "La acepción 4"),
];
const THES = "DICCIONARIO DE SINÓNIMOS\ncaminar v. Sin. andar, pasear, marchar, deambular, recorrer. Ant. detenerse.";
const THES2 = "DICCIONARIO DE SINÓNIMOS\nbonito adj. Sin. hermoso, bello, lindo, precioso, atractivo. Ant. feo, horrible.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué sinónimo de «caminar» conviene para un desfile militar?", THES, "marchar", "pasear", "deambular"), pt("Según la entrada, ¿qué sinónimo conviene para caminar sin rumbo?", THES, "deambular", "marchar", "recorrer"),
  pt("Según la entrada, ¿cuál es un antónimo de «caminar»?", THES, "detenerse", "andar", "recorrer"), pt("Según la entrada, ¿qué sinónimo conviene para un domingo tranquilo en el parque?", THES, "pasear", "marchar", "detenerse"),
  pt("Según la entrada, ¿qué palabra puede reemplazar a «bonito»?", THES2, "precioso", "horrible", "feo"), pt("Según la entrada, ¿cuál es un antónimo de «bonito»?", THES2, "horrible", "bello", "lindo"),
  pt("Escribiste «bonito» tres veces en un párrafo. ¿Para qué te sirve esta entrada?", THES2, "Para variar el vocabulario", "Para corregir las tildes", "Para saber cómo se pronuncia"), pt("Según la entrada, ¿qué clase de palabra es «bonito»?", THES2, "Adjetivo", "Verbo", "Sustantivo"),
];

export const ROWS: Row[] = [
  ["BB.1", "Palabras con pre-", (r) => choose(r, "Completa la oración.", PRE)],
  ["BB.2", "Palabras con re-", (r) => choose(r, "Completa la oración.", RE)],
  ["BB.3", "Palabras con sub-", (r) => choose(r, "Completa la oración.", SUB)],
  ["BB.4", "Palabras con mal-", (r) => choose(r, "Completa la oración.", MAL)],
  ["BB.5", "Palabras con des-, in-, im- e i-", (r) => choose(r, "Completa la oración.", NEG)],
  ["BB.6", "Palabras con -oso y -osa", (r) => choose(r, "Completa la oración.", OSO)],
  ["BB.7", "Palabras con a-, an- y sin", (r) => choose(r, "Completa la oración.", SIN)],
  ["BB.8", "Palabras con -able e -ible", (r) => choose(r, "Completa la oración.", ABLE)],
  ["BB.9", "Clasificar por significado palabras con el mismo prefijo o sufijo", (r) => mix(r, AFFIX_GROUPS)],
  ["BB.10", "Clasificar por clase de palabra las palabras con sufijo", (r) => choose(r, "", SUFFIX_SPEECH)],
  ["BB.11", "Analogías con patrones de palabras", (r) => choose(r, "Completa la analogía.", ANALOGIES)],
  ["BB.12", "Oraciones con patrones de palabras", (r) => choose(r, "Completa la oración.", PATTERN_SENTENCES)],

  ["CC.1", "Clasificar palabras que comparten una raíz griega o latina", (r) => mix(r, ROOT_GROUPS)],
  ["CC.2", "Usar raíces griegas y latinas como pistas del significado de las palabras", (r) => choose(r, "", ROOT_CLUES)],
  ["CC.3", "Usar el significado de las palabras como pista del significado de las raíces", (r) => choose(r, "", MEANING_TO_ROOT)],
  ["CC.4", "Usar palabras como pistas del significado de raíces griegas y latinas", (r) => choose(r, "", WORDS_TO_ROOT)],
  ["CC.5", "Determinar el significado de raíces griegas y latinas", (r) => choose(r, "", ROOT_MEANING)],
  ["CC.6", "Determinar el significado de palabras con raíces griegas y latinas", (r) => choose(r, "", ROOT_WORDS)],
  ["CC.7", "Relacionar palabras con raíces griegas y latinas con su significado", (r) => choose(r, "¿Qué significa la palabra?", ROOT_MATCH)],
  ["CC.8", "Usar palabras con raíces y afijos", (r) => choose(r, "Completa la oración.", ROOT_USE)],

  ["DD.1", "Seleccionar los miembros de un grupo", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que pertenecen al grupo: ${g}.`, GROUPS[g], othersOf(g), g);
  }],
  ["DD.2", "Seleccionar las palabras que no pertenecen al grupo", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que NO pertenecen al grupo: ${g}.`, othersOf(g), GROUPS[g], g);
  }],

  ["EE.1", "Elegir el sinónimo", (r) => choose(r, "", SYNONYMS)],
  ["EE.2", "Encontrar sinónimos en contexto", (r) => choose(r, "", SYN_CONTEXT)],
  ["EE.3", "Elegir el antónimo", (r) => choose(r, "", ANTONYMS)],
  ["EE.4", "Encontrar antónimos en contexto", (r) => choose(r, "", ANT_CONTEXT)],

  ["FF.1", "Analogías", (r) => choose(r, "Completa la analogía.", ANALOGY)],

  ["GG.1", "Homófonos con dibujos", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la pista?", HOMOPHONE_PIC)],
  ["GG.2", "Usar el homófono correcto", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["GG.3", "Palabras con varios significados, con dibujos", (r) => choose(r, "Una misma palabra nombra los dos dibujos. ¿Cuál es?", MULTI_PIC)],
  ["GG.4", "¿Qué definición corresponde a la oración?", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["GG.5", "¿Qué oración corresponde a la definición?", (r) => choose(r, "", SENTENCE_FOR_DEF)],

  ["HH.1", "Determinar el significado de modismos por el contexto: grupo 1", (r) => choose(r, "", IDIOM_CONTEXT_1)],
  ["HH.2", "Identificar el significado de modismos y refranes: grupo 1", (r) => choose(r, "", SAYING_1)],
  ["HH.3", "Determinar el significado de modismos por el contexto: grupo 2", (r) => choose(r, "", IDIOM_CONTEXT_2)],
  ["HH.4", "Identificar el significado de modismos y refranes: grupo 2", (r) => choose(r, "", SAYING_2)],

  ["II.1", "Describir la diferencia entre palabras parecidas", (r) => choose(r, "", DIFFERENCE)],
  ["II.2", "Connotación positiva y negativa", (r) => choose(r, "", CONNOTATION)],

  ["JJ.1", "Encontrar palabras usando el contexto", (r) => choose(r, "¿Qué palabra completa mejor la oración?", FIND_WORD)],
  ["JJ.2", "Determinar el significado de palabras usando sinónimos en contexto", (r) => choose(r, "", SYN_CLUE)],
  ["JJ.3", "Usar el contexto para identificar el significado de una palabra", (r) => choose(r, "", CONTEXT)],
  ["JJ.4", "Determinar el significado de palabras de las áreas, con dibujos", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la definición?", DOMAIN)],
  ["JJ.5", "Usar vocabulario académico en contexto", (r) => choose(r, "Completa la oración.", ACADEMIC)],

  ["KK.1", "Ordenar alfabéticamente según las dos primeras letras", (r) => abcOrder(r, ABC2, "Empiezan igual: mira la segunda letra.")],
  ["KK.2", "Ordenar alfabéticamente según las tres primeras letras", (r) => abcOrder(r, ABC3, "Las dos primeras letras son iguales: mira la tercera.")],
  ["KK.3", "Ordenar alfabéticamente: desafío", (r) => abcOrder(r, ABC4, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["KK.4", "Usar las palabras guía", (r) => choose(r, "", GUIDE_WORDS)],
  ["KK.5", "Usar las entradas del diccionario", (r) => choose(r, "", DICTIONARY)],
  ["KK.6", "Usar las definiciones del diccionario", (r) => choose(r, "", DEFINITIONS)],
  ["KK.7", "Usar las entradas del diccionario de sinónimos", (r) => choose(r, "", THESAURUS)],
];
