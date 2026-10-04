import { choose, mix, order, pickAll, pickInSentence, type ChoiceItem, type InSentenceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "./row";

// Gramática y ortografía (IXL 2nd grade ELA, XX-LLL), con las reglas del
// castellano en lugar de las del inglés:
//   sufijos (drop e, double consonant, y→i) → z→c, c→qu, g→gu
//   posesivo con 's → pertenencia con de, del, de la, de los
//   irregular plurals → plurales en -ces, con tilde y los que no cambian
//   I and me → yo, mí, conmigo            a / an → un, una, unos, unas
//   to be → ser y estar                   to have → tener
//   contractions (I'm, don't) → al, del, conmigo, contigo
//   mayúsculas: días y meses van con minúscula; en los títulos, solo la primera palabra

export const SECTIONS: Section[] = [
  { id: "XX", name: "Ortografía", icon: "✍️" },
  { id: "YY", name: "Oraciones completas e incompletas", icon: "💬" },
  { id: "ZZ", name: "Sustantivos", icon: "🏷️" },
  { id: "AAA", name: "Pronombres", icon: "👤" },
  { id: "BBB", name: "Tipos de verbos", icon: "🏃" },
  { id: "CCC", name: "Concordancia entre sujeto y verbo", icon: "🤝" },
  { id: "DDD", name: "Tiempos verbales", icon: "⏳" },
  { id: "EEE", name: "Artículos", icon: "📌" },
  { id: "FFF", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "GGG", name: "Preposiciones", icon: "📦" },
  { id: "HHH", name: "Contracciones", icon: "✂️" },
  { id: "III", name: "Puntuación", icon: "❗" },
  { id: "JJJ", name: "Mayúsculas", icon: "🔠" },
  { id: "LLL", name: "Abreviaturas", icon: "📅" },
];

// Atajos para escribir los bancos: f = completar un texto; w = pregunta sola.
const f = (t: string, a: string, ...d: string[]): ChoiceItem => ({ t, a, d });
const w = (p: string, a: string, ...d: string[]): ChoiceItem => ({ p, a, d });
const pt = (p: string, t: string, a: string, ...d: string[]): ChoiceItem => ({ p, t, a, d });
const s = (sentence: string, ...ans: string[]): InSentenceItem => ({ s: sentence, ans });

// --- XX. Ortografía -----------------------------------------------------------------

const Z_TO_C: ChoiceItem[] = [
  f("un pez → muchos ___", "peces", "pezes", "peses", "pecez"),
  f("un lápiz → dos ___", "lápices", "lápizes", "lápises", "lapiz"),
  f("una luz → varias ___", "luces", "luzes", "luses", "lucez"),
  f("una nariz → dos ___", "narices", "narizes", "narises", "naricez"),
  f("una vez → tres ___", "veces", "vezes", "veses", "vecez"),
  f("feliz → Ellos están ___.", "felices", "felizes", "felises", "felicez"),
  f("una lombriz → cinco ___", "lombrices", "lombrizes", "lombrises", "lombricez"),
  f("un pez pequeño → un ___", "pececito", "pezecito", "pesecito", "pezito"),
];

const C_TO_QU: ChoiceItem[] = [
  f("una vaca pequeña → una ___", "vaquita", "vacita", "vakita", "vacquita"),
  f("un barco pequeño → un ___", "barquito", "barcito", "barkito", "barcquito"),
  f("muy chico → ___", "chiquito", "chicito", "chikito", "chicquito"),
  f("muy poco → ___", "poquito", "pocito", "pokito", "pocquito"),
  f("una boca pequeña → una ___", "boquita", "bocita", "bokita", "bocquita"),
  f("una muñeca pequeña → una ___", "muñequita", "muñecita", "muñekita", "muñecquita"),
  f("un saco pequeño → un ___", "saquito", "sacito", "sakito", "sacquito"),
  f("una foca pequeña → una ___", "foquita", "focita", "fokita", "focquita"),
];

const G_TO_GU: ChoiceItem[] = [
  f("un amigo pequeño → un ___", "amiguito", "amigito", "amijito", "amigüito"),
  f("un lago pequeño → un ___", "laguito", "lagito", "lajito", "lagüito"),
  f("una hormiga pequeña → una ___", "hormiguita", "hormigita", "hormijita", "hormigüita"),
  f("un jugo pequeño → un ___", "juguito", "jugito", "jujito", "jugüito"),
  f("una tortuga pequeña → una ___", "tortuguita", "tortugita", "tortujita", "tortugüita"),
  f("una barriga pequeña → una ___", "barriguita", "barrigita", "barrijita", "barrigüita"),
  f("un fuego pequeño → un ___", "fueguito", "fuegito", "fuejito", "fuegüito"),
];

// --- YY. Oraciones -------------------------------------------------------------------

const KINDS = ["Afirmación", "Pregunta", "Orden", "Exclamación"];
const kind = (t: string, a: string): ChoiceItem => ({ t, a, d: KINDS.filter((k) => k !== a) });
const SENTENCE_KIND: ChoiceItem[] = [
  kind("El gato duerme en el sofá.", "Afirmación"), kind("Mi escuela queda cerca.", "Afirmación"), kind("Hoy es martes.", "Afirmación"),
  kind("¿Dónde está mi mochila?", "Pregunta"), kind("¿Cuántos años tienes?", "Pregunta"), kind("¿Vienes a jugar?", "Pregunta"),
  kind("Cierra la puerta, por favor.", "Orden"), kind("Lávate las manos.", "Orden"), kind("Guarda tus juguetes.", "Orden"),
  kind("¡Qué lindo día!", "Exclamación"), kind("¡Ganamos el partido!", "Exclamación"), kind("¡Cuidado con el perro!", "Exclamación"),
];

const SUBJECT: ChoiceItem[] = [
  pt("¿Cuál es el sujeto de la oración?", "Mi hermana menor pinta un cuadro.", "Mi hermana menor", "pinta un cuadro", "un cuadro", "pinta"),
  pt("¿Cuál es el sujeto de la oración?", "El perro de Luis ladra mucho.", "El perro de Luis", "ladra mucho", "mucho", "ladra"),
  pt("¿Cuál es el sujeto de la oración?", "Los pájaros cantan al amanecer.", "Los pájaros", "cantan al amanecer", "al amanecer", "cantan"),
  pt("¿Cuál es el sujeto de la oración?", "La maestra escribe en la pizarra.", "La maestra", "escribe en la pizarra", "en la pizarra", "escribe"),
  pt("¿Cuál es el sujeto de la oración?", "Carla y Mateo juegan ajedrez.", "Carla y Mateo", "juegan ajedrez", "ajedrez", "juegan"),
  pt("¿Cuál es el sujeto de la oración?", "El viento mueve las hojas.", "El viento", "mueve las hojas", "las hojas", "mueve"),
  pt("¿Cuál es el sujeto de la oración?", "Las nubes grises tapan el sol.", "Las nubes grises", "tapan el sol", "el sol", "tapan"),
  pt("¿Cuál es el sujeto de la oración?", "Mi abuelo cuenta historias.", "Mi abuelo", "cuenta historias", "historias", "cuenta"),
];

const PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el predicado de la oración?", "Mi hermana menor pinta un cuadro.", "pinta un cuadro", "Mi hermana menor", "Mi hermana", "un cuadro"),
  pt("¿Cuál es el predicado de la oración?", "El perro de Luis ladra mucho.", "ladra mucho", "El perro de Luis", "El perro", "de Luis"),
  pt("¿Cuál es el predicado de la oración?", "Los pájaros cantan al amanecer.", "cantan al amanecer", "Los pájaros", "Los pájaros cantan", "al amanecer"),
  pt("¿Cuál es el predicado de la oración?", "La maestra escribe en la pizarra.", "escribe en la pizarra", "La maestra", "La maestra escribe en", "la pizarra"),
  pt("¿Cuál es el predicado de la oración?", "Carla y Mateo juegan ajedrez.", "juegan ajedrez", "Carla y Mateo", "Carla", "Mateo"),
  pt("¿Cuál es el predicado de la oración?", "El viento mueve las hojas.", "mueve las hojas", "El viento", "El viento mueve", "las hojas"),
  pt("¿Cuál es el predicado de la oración?", "Las nubes grises tapan el sol.", "tapan el sol", "Las nubes grises", "Las nubes", "el sol"),
  pt("¿Cuál es el predicado de la oración?", "Mi abuelo cuenta historias.", "cuenta historias", "Mi abuelo", "Mi abuelo cuenta", "historias"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const COMPLETE_ITEMS = ["El bebé duerme en su cuna.", "Mi tía vende frutas.", "Los niños corren en el patio.", "La lluvia mojó la calle.", "Pedro lee un cuento.", "El sol sale por la mañana."];
const FRAGMENT_ITEMS = ["El perro de mi vecino.", "Corriendo por el parque.", "La casa azul de la esquina.", "Después de la clase.", "Muy temprano en la mañana.", "Con su mochila nueva."];
const RUN_ON_ITEMS = ["Fui al parque jugué fútbol comí helado.", "Mi gato duerme mi perro ladra.", "Llovió mucho no salimos.", "Tengo hambre voy a comer.", "Ana canta Luis baila.", "El bus llegó subimos rápido."];
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a) }));

const UNSCRAMBLE: OrderItem[] = [
  { seq: ["El", "gato", "bebe", "leche."] },
  { seq: ["Mi", "mamá", "cocina", "arroz", "con", "pollo."] },
  { seq: ["Los", "niños", "juegan", "en", "el", "parque."] },
  { seq: ["La", "maestra", "lee", "un", "cuento."] },
  { seq: ["Ayer", "fuimos", "a", "la", "playa."] },
  { seq: ["Mi", "perro", "ladra", "muy", "fuerte."] },
  { seq: ["El", "tren", "llega", "a", "las", "ocho."] },
  { seq: ["¿Dónde", "guardaste", "mis", "zapatos?"] },
];

// --- ZZ. Sustantivos -----------------------------------------------------------------

const NOUNS = ["perro", "escuela", "maestra", "lápiz", "río", "abuelo", "ciudad", "mesa", "flor", "doctor"];
const NOT_NOUNS = ["correr", "bonito", "rápido", "saltar", "azul", "comer", "muy", "feliz", "cantar", "debajo"];

const WHICH_NOUN: ChoiceItem[] = [
  w("¿Qué palabra es un sustantivo?", "montaña", "subir", "alta", "lejos"),
  w("¿Qué palabra es un sustantivo?", "bombero", "apagar", "valiente", "rápido"),
  w("¿Qué palabra es un sustantivo?", "cuaderno", "escribir", "nuevo", "aquí"),
  w("¿Qué palabra es un sustantivo?", "tortuga", "lenta", "caminar", "despacio"),
  w("¿Qué palabra es un sustantivo?", "mercado", "comprar", "grande", "cerca"),
  w("¿Qué palabra es un sustantivo?", "estrella", "brillar", "lejana", "arriba"),
  w("¿Qué palabra es un sustantivo?", "panadero", "hornear", "amable", "temprano"),
  w("¿Qué palabra es un sustantivo?", "ventana", "abrir", "limpia", "afuera"),
];

const NOUNS_IN: InSentenceItem[] = [
  s("El perro corre por el parque.", "perro", "parque"),
  s("Mi abuela teje una chompa.", "abuela", "chompa"),
  s("Los niños llevan sus mochilas.", "niños", "mochilas"),
  s("La gallina puso un huevo.", "gallina", "huevo"),
  s("El doctor trabaja en el hospital.", "doctor", "hospital"),
  s("Una mariposa vuela sobre la flor.", "mariposa", "flor"),
  s("El panadero vende pan caliente.", "panadero", "pan"),
  s("Mi hermano perdió su zapato.", "hermano", "zapato"),
];

const PROPER = ["Lima", "María", "Perú", "Amazonas", "Cusco", "Rocky", "Titicaca", "Andrés", "Arequipa"];
const COMMON = ["ciudad", "niña", "país", "río", "perro", "lago", "maestro", "montaña", "calle"];
const COMMON_PROPER: ChoiceItem[] = [
  ...["Lima", "Mateo", "Perú", "Amazonas", "Firulais", "Piura"].map((t) => ({ t, a: "Propio", d: ["Común"] })),
  ...["ciudad", "niño", "país", "río", "perro", "plaza"].map((t) => ({ t, a: "Común", d: ["Propio"] })),
];

const PLURAL_FORM: ChoiceItem[] = [
  f("un gato → dos ___", "gatos", "gatoes", "gatoz", "gates"),
  f("una flor → tres ___", "flores", "flors", "floris", "florez"),
  f("un árbol → muchos ___", "árboles", "árbols", "árbolos", "arbolez"),
  f("una mesa → dos ___", "mesas", "mesaes", "meses", "mesaz"),
  f("un reloj → dos ___", "relojes", "relojs", "relojos", "reloges"),
  f("una ciudad → varias ___", "ciudades", "ciudads", "ciudadas", "ciudadez"),
  f("un pan → cuatro ___", "panes", "pans", "panos", "panez"),
  f("un libro → cinco ___", "libros", "libroes", "libres", "libroz"),
];

const PLURAL_USE: ChoiceItem[] = [
  f("En el jardín hay muchas ___.", "flores", "flor", "flors", "florez"),
  f("Compré tres ___ en la panadería.", "panes", "pan", "pans", "panez"),
  f("Los ___ del parque dan sombra.", "árboles", "árbol", "árbols", "arboles"),
  f("Mi abuela tiene dos ___.", "gatos", "gato", "gatoes", "gates"),
  f("En mi mochila llevo cuatro ___.", "cuadernos", "cuaderno", "cuadernoes", "cuadernes"),
  f("Las ___ de mi barrio son angostas.", "calles", "calle", "callees", "callez"),
  f("Tengo dos ___ de colores.", "lápices", "lápiz", "lápizes", "lapices"),
];

const SING_PLUR: ChoiceItem[] = [
  f("El ___ ladra.", "perro", "perros", "perroes", "pero"),
  f("Las ___ vuelan.", "aves", "ave", "avez", "aveses"),
  f("Una ___ brilla en el cielo.", "estrella", "estrellas", "estrellaes", "estrela"),
  f("Los ___ juegan fútbol.", "niños", "niño", "niñoes", "niñes"),
  f("Mi ___ es azul.", "mochila", "mochilas", "mochilaes", "mochil"),
  f("Unos ___ nadan en el río.", "peces", "pez", "pezes", "peses"),
  f("Esa ___ es muy alta.", "torre", "torres", "torrees", "tore"),
];

const SINGULAR_OR_PLURAL: ChoiceItem[] = [
  ...["manzana", "reloj", "ciudad", "pez", "lápiz", "flor"].map((t) => ({ t, a: "Singular", d: ["Plural"] })),
  ...["manzanas", "relojes", "ciudades", "peces", "lápices", "flores"].map((t) => ({ t, a: "Plural", d: ["Singular"] })),
];

const IRREGULAR_PLURAL: ChoiceItem[] = [
  f("un camión → dos ___", "camiones", "camións", "camiónes", "camionez"),
  f("un ratón → tres ___", "ratones", "ratóns", "ratónes", "ratonez"),
  f("el lunes → todos los ___", "lunes", "luneses", "lunés", "lunez"),
  f("un paraguas → dos ___", "paraguas", "paraguases", "paragua", "paraguaz"),
  f("una actriz → dos ___", "actrices", "actrizes", "actrises", "actricez"),
  f("un león → cuatro ___", "leones", "leóns", "leónes", "leonez"),
  f("un cumpleaños → dos ___", "cumpleaños", "cumpleañoses", "cumpleaño", "cumpleañoz"),
  f("una raíz → muchas ___", "raíces", "raízes", "raíses", "raicez"),
];

const PLURAL = "Plural (más de uno)";
const OWNER_ONE = "Pertenencia: un dueño";
const OWNER_MANY = "Pertenencia: varios dueños";
const own = (t: string, a: string): ChoiceItem => ({ t, a, d: [PLURAL, OWNER_ONE, OWNER_MANY].filter((x) => x !== a) });
const POSSESSIVE_ID: ChoiceItem[] = [
  own("Los perros ladran.", PLURAL), own("Las niñas cantan.", PLURAL), own("Mis primos llegaron.", PLURAL),
  own("La pelota del perro está rota.", OWNER_ONE), own("El libro de la niña es nuevo.", OWNER_ONE), own("La casa de mi abuelo es grande.", OWNER_ONE),
  own("La pelota de los perros está rota.", OWNER_MANY), own("El salón de las niñas es azul.", OWNER_MANY), own("La casa de mis abuelos es grande.", OWNER_MANY),
];

const POSSESSIVE_FORM: ChoiceItem[] = [
  f("El perro tiene un hueso → el hueso ___ perro", "del", "de el", "de la", "de los"),
  f("La maestra tiene un libro → el libro ___ maestra", "de la", "del", "de el", "de los"),
  f("Los niños tienen una pelota → la pelota ___ niños", "de los", "del", "de la", "de las"),
  f("Las gatas tienen una cama → la cama ___ gatas", "de las", "de los", "del", "de la"),
  f("Ana tiene una bicicleta → la bicicleta ___ Ana", "de", "del", "de la", "de los"),
  f("El panadero tiene un horno → el horno ___ panadero", "del", "de el", "de la", "de"),
  f("Mis primos tienen un carro → el carro ___ mis primos", "de", "del", "de los", "de la"),
];

const POSSESSIVE_ERRORS: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "El juguete del niño está roto.", "El juguete de el niño está roto.", "El juguete del niños está roto.", "El juguete de niño está roto."),
  w("¿Cuál está bien escrita?", "Las mochilas de las niñas son rojas.", "Las mochilas del niñas son rojas.", "Las mochila de las niñas son rojas.", "Las mochilas de la niñas son rojas."),
  w("¿Cuál está bien escrita?", "Los lápices de Juan son nuevos.", "Los lápizes de Juan son nuevos.", "Los lápices del Juan son nuevos.", "Los lápiz de Juan son nuevos."),
  w("¿Cuál está bien escrita?", "La cola del gato es larga.", "La cola de el gato es larga.", "La cola del gatos es larga.", "La colas del gato es larga."),
  w("¿Cuál está bien escrita?", "Los zapatos de los niños están limpios.", "Los zapatos del niños están limpios.", "Los zapato de los niños están limpios.", "Los zapatos de los niño están limpios."),
  w("¿Cuál está bien escrita?", "El nido de las aves está en el árbol.", "El nido de la aves está en el árbol.", "El nido del aves está en el árbol.", "El nidos de las aves está en el árbol."),
];

// --- AAA. Pronombres -------------------------------------------------------------------

const PRONOUNS_IN: InSentenceItem[] = [
  s("Ella canta muy bien.", "Ella"),
  s("Nosotros jugamos en el patio.", "Nosotros"),
  s("Ellos llegaron tarde y yo también.", "Ellos", "yo"),
  s("Tú dibujas mejor que él.", "Tú", "él"),
  s("Ustedes pueden pasar.", "Ustedes"),
  s("Yo como pan y ella toma leche.", "Yo", "ella"),
  s("Ellas bailan y nosotros aplaudimos.", "Ellas", "nosotros"),
];

const SUBJ_OBJ: ChoiceItem[] = [
  f("___ tengo un gato.", "Yo", "Me", "Mí", "Mi"),
  f("Mi mamá ___ abrazó.", "me", "yo", "mí", "mi"),
  f("___ es mi mejor amigo.", "Él", "Lo", "Le", "Se"),
  f("A Rosa ___ vi en el parque.", "la", "ella", "le", "se"),
  f("___ vamos a la playa.", "Nosotros", "Nos", "Nuestro", "Los"),
  f("La maestra ___ felicitó a todos.", "nos", "nosotros", "nuestro", "ellos"),
  f("¿___ quieres jugar?", "Tú", "Te", "Ti", "Tu"),
  f("El regalo es para ___.", "ti", "tú", "te", "tu"),
];

const REPLACE_SINGULAR: ChoiceItem[] = [
  f("MARÍA canta. → ___ canta.", "Ella", "Él", "Ellas", "Nosotros"),
  f("EL PERRO ladra. → ___ ladra.", "Él", "Ella", "Ellos", "Tú"),
  f("MI PAPÁ cocina. → ___ cocina.", "Él", "Ella", "Ellos", "Yo"),
  f("LA MAESTRA escribe. → ___ escribe.", "Ella", "Él", "Ellas", "Ustedes"),
  f("PEDRO corre. → ___ corre.", "Él", "Ella", "Ellos", "Nosotros"),
  f("LA GATA duerme. → ___ duerme.", "Ella", "Él", "Ellas", "Tú"),
  f("MI ABUELO lee. → ___ lee.", "Él", "Ella", "Ellos", "Yo"),
];

const REPLACE_PLURAL: ChoiceItem[] = [
  f("LOS NIÑOS juegan. → ___ juegan.", "Ellos", "Ellas", "Él", "Nosotros"),
  f("ANA Y ROSA cantan. → ___ cantan.", "Ellas", "Ellos", "Ella", "Ustedes"),
  f("MI HERMANO Y YO comemos. → ___ comemos.", "Nosotros", "Ellos", "Ustedes", "Él"),
  f("LAS GALLINAS comen. → ___ comen.", "Ellas", "Ellos", "Ella", "Nosotras"),
  f("LUIS Y MARTA bailan. → ___ bailan.", "Ellos", "Ellas", "Él", "Nosotros"),
  f("TÚ Y PEDRO corren. → ___ corren.", "Ustedes", "Nosotros", "Ellos", "Él"),
  f("MIS PRIMAS Y YO jugamos. → ___ jugamos.", "Nosotras", "Ellas", "Ustedes", "Ella"),
];

const I_AND_ME: ChoiceItem[] = [
  f("Mi hermano y ___ fuimos al cine.", "yo", "mí", "me", "conmigo"),
  f("Este regalo es para ___.", "mí", "yo", "me", "mi"),
  f("¿Quieres venir ___?", "conmigo", "con mí", "con yo", "comigo"),
  f("Ana y ___ somos amigas.", "yo", "mí", "me", "mi"),
  f("Mi abuela cocinó para mi primo y para ___.", "mí", "yo", "me", "conmigo"),
  f("Voy a jugar ___.", "contigo", "con ti", "con tú", "contigó"),
  f("Entre tú y ___ armamos la carpa.", "yo", "mí", "me", "conmigo"),
  w("¿Cuál está bien escrita?", "Mi papá y yo vamos al mercado.", "Yo y mi papá vamos al mercado.", "Mi papá y mí vamos al mercado.", "Mí y mi papá vamos al mercado."),
];

const PERSONAL: ChoiceItem[] = [
  f("___ somos compañeros de clase.", "Nosotros", "Ellos", "Yo", "Tú"),
  f("___ eres muy amable.", "Tú", "Yo", "Él", "Ellos"),
  f("___ son mis primas.", "Ellas", "Ella", "Nosotros", "Tú"),
  f("___ soy alumno de segundo grado.", "Yo", "Tú", "Él", "Ustedes"),
  f("___ es mi hermano mayor.", "Él", "Ellos", "Yo", "Nosotros"),
  f("¿___ quieren más jugo?", "Ustedes", "Tú", "Yo", "Él"),
  f("___ tiene una muñeca nueva.", "Ella", "Ellas", "Yo", "Nosotras"),
];

const POSS_IN: InSentenceItem[] = [
  s("Ese cuaderno es mío.", "mío"),
  s("La pelota roja es tuya.", "tuya"),
  s("El perro es nuestro.", "nuestro"),
  s("Estos zapatos son suyos.", "suyos"),
  s("La casa azul es nuestra.", "nuestra"),
  s("Aquel lápiz es tuyo y este es mío.", "tuyo", "mío"),
  s("Las mochilas son suyas.", "suyas"),
];

const POSS_USE: ChoiceItem[] = [
  f("Este lápiz es de mí. Es ___.", "mío", "tuyo", "suyo", "nuestro"),
  f("Esa mochila es de ti. Es ___.", "tuya", "mía", "suya", "nuestra"),
  f("El carro es de mi papá. Es ___.", "suyo", "mío", "tuyo", "nuestro"),
  f("La casa es de mi familia y de mí. Es ___.", "nuestra", "suya", "tuya", "mía"),
  f("Los juguetes son de ti. Son ___.", "tuyos", "míos", "suyos", "nuestros"),
  f("Las llaves son de Ana. Son ___.", "suyas", "mías", "tuyas", "nuestras"),
  f("El perro es de mi hermana y de mí. Es ___.", "nuestro", "suyo", "tuyo", "mío"),
];

const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Ana ___ peina frente al espejo.", "se", "ella", "le", "la"),
  f("Yo ___ lavo las manos.", "me", "yo", "mí", "mi"),
  f("___ te cepillas los dientes.", "Tú", "Te", "Ti", "Tu"),
  f("Nosotros ___ levantamos temprano.", "nos", "nosotros", "nuestro", "se"),
  f("___ se baña cada mañana.", "Él", "Se", "Le", "Lo"),
  f("Los niños ___ ponen el uniforme.", "se", "ellos", "les", "los"),
  f("___ me despierto a las seis.", "Yo", "Me", "Mí", "Mi"),
];

const REFLEXIVE_USE: ChoiceItem[] = [
  f("Yo ___ visto solo.", "me", "te", "se", "nos"),
  f("Tú ___ acuestas temprano.", "te", "me", "se", "nos"),
  f("Mi hermano ___ ducha con agua fría.", "se", "me", "te", "nos"),
  f("Nosotros ___ sentamos en el sillón.", "nos", "se", "me", "te"),
  f("Las niñas ___ ríen del chiste.", "se", "nos", "me", "te"),
  f("¿Tú ___ llamas Diego?", "te", "me", "se", "nos"),
  f("Yo ___ miro en el espejo.", "me", "se", "te", "nos"),
  f("Ustedes ___ divierten en el recreo.", "se", "nos", "te", "me"),
];

// --- BBB. Tipos de verbos ---------------------------------------------------------------

const ACTION_USE: ChoiceItem[] = [
  f("El pájaro ___ en la rama.", "canta", "verde", "nido", "arriba"),
  f("Mi papá ___ el carro.", "maneja", "rojo", "llave", "rápido"),
  f("Los niños ___ la cuerda.", "saltan", "larga", "patio", "juntos"),
  f("La cocinera ___ la sopa.", "prueba", "caliente", "olla", "después"),
  f("El pez ___ en el río.", "nada", "mojado", "agua", "abajo"),
  f("Yo ___ una carta a mi tía.", "escribo", "lápiz", "larga", "ayer"),
  f("El bebé ___ en su cuna.", "duerme", "pequeño", "manta", "tranquilo"),
];

const ACTION_IN: InSentenceItem[] = [
  s("El perro corre y salta.", "corre", "salta"),
  s("Mi mamá cocina arroz.", "cocina"),
  s("Los niños leen y escriben.", "leen", "escriben"),
  s("La rana nada en la laguna.", "nada"),
  s("El abuelo riega las plantas.", "riega"),
  s("Las aves vuelan y cantan.", "vuelan", "cantan"),
  s("Tomás pinta un cuadro.", "pinta"),
];

const HELPING_IN: InSentenceItem[] = [
  s("Mi hermano ha comido toda la torta.", "ha"),
  s("Los niños están jugando en el patio.", "están"),
  s("Yo he terminado la tarea.", "he"),
  s("Mi mamá está cocinando.", "está"),
  s("Nosotros hemos visto esa película.", "hemos"),
  s("Tú has crecido mucho.", "has"),
  s("Las aves están volando hacia el sur.", "están"),
  s("Mañana voy a visitar a mi tía.", "voy"),
];

// --- CCC. Concordancia --------------------------------------------------------------------

const ONE = "Uno";
const MANY = "Más de uno";
const ONE_OR_MORE: ChoiceItem[] = [
  ...["El gato maúlla.", "La niña dibuja.", "Mi primo corre.", "El árbol crece.", "Una estrella brilla."].map((t) => ({ t, a: ONE, d: [MANY] })),
  ...["Los gatos maúllan.", "Las niñas dibujan.", "Mis primos corren.", "Los árboles crecen.", "Unas estrellas brillan."].map((t) => ({ t, a: MANY, d: [ONE] })),
];

const SUBJECT_VERB: ChoiceItem[] = [
  f("Los pájaros ___ en el árbol.", "cantan", "canta", "canto", "cantas"),
  f("Mi hermana ___ un libro.", "lee", "leen", "leo", "lees"),
  f("___ ladran toda la noche.", "Los perros", "El perro", "Mi perro", "Un perro"),
  f("___ come una manzana.", "La niña", "Las niñas", "Los niños", "Mis primas"),
  f("Las flores ___ en primavera.", "crecen", "crece", "crezco", "creces"),
  f("El tren ___ a las ocho.", "sale", "salen", "salgo", "sales"),
  f("___ juegan en el recreo.", "Los alumnos", "El alumno", "La alumna", "Mi amigo"),
  f("Mi papá y mi tío ___ fútbol.", "juegan", "juega", "juego", "juegas"),
];

const PRONOUN_VERB: ChoiceItem[] = [
  f("Yo ___ al parque.", "voy", "vas", "va", "van"),
  f("Tú ___ muy bien.", "cantas", "canto", "canta", "cantan"),
  f("Ella ___ un vestido rojo.", "tiene", "tengo", "tienes", "tienen"),
  f("Nosotros ___ la tarea.", "hacemos", "hago", "hace", "hacen"),
  f("Ellos ___ en Cusco.", "viven", "vive", "vivo", "vives"),
  f("Ustedes ___ temprano.", "llegan", "llega", "llego", "llegas"),
  f("Él ___ en bicicleta.", "pasea", "paseo", "paseas", "pasean"),
  f("Yo ___ una carta.", "escribo", "escribes", "escribe", "escriben"),
];

// --- DDD. Tiempos verbales ---------------------------------------------------------------

const PAST_SENTENCE: ChoiceItem[] = [
  w("¿Qué oración está en pasado?", "Ayer jugué en el parque.", "Hoy juego en el parque.", "Mañana jugaré en el parque.", "Siempre juego en el parque."),
  w("¿Qué oración está en pasado?", "Mi mamá cocinó arroz.", "Mi mamá cocina arroz.", "Mi mamá cocinará arroz.", "Mi mamá va a cocinar arroz."),
  w("¿Qué oración está en pasado?", "Los niños cantaron una canción.", "Los niños cantan una canción.", "Los niños cantarán una canción.", "Los niños van a cantar."),
  w("¿Qué oración está en pasado?", "El perro saltó la cerca.", "El perro salta la cerca.", "El perro saltará la cerca.", "El perro va a saltar."),
  w("¿Qué oración está en pasado?", "Pinté un dibujo.", "Pinto un dibujo.", "Pintaré un dibujo.", "Voy a pintar un dibujo."),
  w("¿Qué oración está en pasado?", "Lavamos los platos.", "Lavaremos los platos.", "Vamos a lavar los platos.", "Lavarán los platos."),
  w("¿Qué oración está en pasado?", "Ella caminó hasta la escuela.", "Ella camina hasta la escuela.", "Ella caminará hasta la escuela.", "Ella va a caminar."),
];

const PAST_VERBS_IN: InSentenceItem[] = [
  s("Ayer caminé y salté en el parque.", "caminé", "salté"),
  s("Mi tía cocinó una torta.", "cocinó"),
  s("Los niños jugaron y cantaron.", "jugaron", "cantaron"),
  s("El gato saltó al techo.", "saltó"),
  s("Nosotros limpiamos y ordenamos el salón.", "limpiamos", "ordenamos"),
  s("Tú pintaste un cuadro bonito.", "pintaste"),
  s("La maestra explicó la lección.", "explicó"),
];

const PAST_REGULAR: ChoiceItem[] = [
  f("Ayer yo ___ fútbol. (jugar)", "jugué", "juego", "jugaré", "jugando"),
  f("Anoche mi mamá ___ sopa. (cocinar)", "cocinó", "cocina", "cocinará", "cocinar"),
  f("El lunes los niños ___ al museo. (caminar)", "caminaron", "caminan", "caminarán", "caminando"),
  f("Ayer tú ___ muy bonito. (cantar)", "cantaste", "cantas", "cantarás", "cantar"),
  f("La semana pasada nosotros ___ el cuarto. (pintar)", "pintamos", "pintaremos", "pintando", "pintar"),
  f("Ayer el bebé ___ mucho. (llorar)", "lloró", "llora", "llorará", "llorando"),
  f("Anoche yo ___ los platos. (lavar)", "lavé", "lavo", "lavaré", "lavando"),
  f("Ayer ellos ___ la puerta. (cerrar)", "cerraron", "cierran", "cerrarán", "cerrando"),
];

const TENSES = ["Pasado", "Presente", "Futuro"];
const when = (t: string, a: string): ChoiceItem => ({ t, a, d: TENSES.filter((x) => x !== a) });
const TIMELINE: ChoiceItem[] = [
  when("Ayer llovió toda la tarde.", "Pasado"), when("Mi abuelo plantó un árbol.", "Pasado"), when("Los niños saltaron la cuerda.", "Pasado"),
  when("Ahora llueve mucho.", "Presente"), when("Mi abuelo planta un árbol.", "Presente"), when("Los niños saltan la cuerda.", "Presente"),
  when("Mañana lloverá.", "Futuro"), when("Mi abuelo plantará un árbol.", "Futuro"), when("Los niños saltarán la cuerda.", "Futuro"),
];

const TO_FUTURE: ChoiceItem[] = [
  pt("Cambia la oración al futuro.", "Hoy canto una canción.", "Mañana cantaré una canción.", "Ayer canté una canción.", "Ahora canto una canción.", "Siempre cantaba una canción."),
  pt("Cambia la oración al futuro.", "Ella come una manzana.", "Ella comerá una manzana.", "Ella comió una manzana.", "Ella comía una manzana.", "Ella ha comido una manzana."),
  pt("Cambia la oración al futuro.", "Los niños juegan en el patio.", "Los niños jugarán en el patio.", "Los niños jugaron en el patio.", "Los niños jugaban en el patio.", "Los niños han jugado en el patio."),
  pt("Cambia la oración al futuro.", "Mi papá lava el carro.", "Mi papá lavará el carro.", "Mi papá lavó el carro.", "Mi papá lavaba el carro.", "Mi papá ha lavado el carro."),
  pt("Cambia la oración al futuro.", "Nosotros viajamos a Cusco.", "Nosotros viajaremos a Cusco.", "Nosotros viajábamos a Cusco.", "Nosotros hemos viajado a Cusco.", "Nosotros viajando a Cusco."),
  pt("Cambia la oración al futuro.", "Tú lees un cuento.", "Tú leerás un cuento.", "Tú leíste un cuento.", "Tú leías un cuento.", "Tú has leído un cuento."),
  pt("Cambia la oración al futuro.", "El tren llega a las ocho.", "El tren llegará a las ocho.", "El tren llegó a las ocho.", "El tren llegaba a las ocho.", "El tren ha llegado a las ocho."),
];

const IRREGULAR_ID_1: ChoiceItem[] = [
  w("¿Cuál es el pasado de «él hace»?", "él hizo", "él hació", "él hacerá", "él hace"),
  w("¿Cuál es el pasado de «yo voy»?", "yo fui", "yo iré", "yo voy", "yo ió"),
  w("¿Cuál es el pasado de «ella tiene»?", "ella tuvo", "ella tenió", "ella tendrá", "ella tiene"),
  w("¿Cuál es el pasado de «él dice»?", "él dijo", "él deció", "él dirá", "él dice"),
  w("¿Cuál es el pasado de «yo soy»?", "yo fui", "yo seré", "yo soy", "yo sió"),
  w("¿Cuál es el pasado de «ellos hacen»?", "ellos hicieron", "ellos hacieron", "ellos harán", "ellos hacen"),
  w("¿Cuál es el pasado de «tú tienes»?", "tú tuviste", "tú teniste", "tú tendrás", "tú tienes"),
];

const IRREGULAR_ID_2: ChoiceItem[] = [
  w("¿Cuál es el pasado de «él pone»?", "él puso", "él ponió", "él pondrá", "él pone"),
  w("¿Cuál es el pasado de «ella viene»?", "ella vino", "ella venió", "ella vendrá", "ella viene"),
  w("¿Cuál es el pasado de «yo puedo»?", "yo pude", "yo podí", "yo podré", "yo puedo"),
  w("¿Cuál es el pasado de «él quiere»?", "él quiso", "él querió", "él querrá", "él quiere"),
  w("¿Cuál es el pasado de «ella sabe»?", "ella supo", "ella sabió", "ella sabrá", "ella sabe"),
  w("¿Cuál es el pasado de «él trae»?", "él trajo", "él traió", "él traerá", "él trae"),
  w("¿Cuál es el pasado de «yo estoy»?", "yo estuve", "yo estí", "yo estaré", "yo estoy"),
  w("¿Cuál es el pasado de «él anda»?", "él anduvo", "él andó", "él andará", "él anda"),
];

const IRREGULAR_SETS: ChoiceItem[][] = [
  [
    f("Ayer yo ___ al mercado. (ir)", "fui", "ió", "voy", "iré"),
    f("El domingo mi papá ___ una torta. (hacer)", "hizo", "hació", "hace", "hará"),
    f("Anoche ella ___ fiebre. (tener)", "tuvo", "tenió", "tiene", "tendrá"),
    f("La fiesta ___ muy divertida. (ser)", "fue", "sió", "es", "será"),
    f("Ayer nosotros ___ al cine. (ir)", "fuimos", "imos", "vamos", "iremos"),
    f("Los niños ___ la tarea. (hacer)", "hicieron", "hacieron", "hacen", "harán"),
    f("Ayer yo ___ un sueño raro. (tener)", "tuve", "tení", "tengo", "tendré"),
  ],
  [
    f("Mi mamá me ___ un secreto. (decir)", "dijo", "deció", "dice", "dirá"),
    f("Yo ___ los platos en la mesa. (poner)", "puse", "poní", "pongo", "pondré"),
    f("Mi tío ___ de Arequipa ayer. (venir)", "vino", "venió", "viene", "vendrá"),
    f("Ayer no ___ salir porque llovía. (poder, yo)", "pude", "podí", "puedo", "podré"),
    f("Ellos ___ la verdad. (decir)", "dijeron", "decieron", "dicen", "dirán"),
    f("Ella ___ el libro en su mochila. (poner)", "puso", "ponió", "pone", "pondrá"),
    f("Mis primos ___ a visitarnos. (venir)", "vinieron", "venieron", "vienen", "vendrán"),
  ],
  [
    f("El bebé no ___ comer la sopa. (querer)", "quiso", "querió", "quiere", "querrá"),
    f("Yo ___ la respuesta. (saber)", "supe", "sabí", "sé", "sabré"),
    f("Mi abuela ___ pan del mercado. (traer)", "trajo", "traió", "trae", "traerá"),
    f("Ayer nosotros ___ en la playa. (estar)", "estuvimos", "estamos", "estaremos", "estando"),
    f("Ellos ___ jugar otra vez. (querer)", "quisieron", "querieron", "quieren", "querrán"),
    f("Tú ___ tu lonchera. (traer)", "trajiste", "traíste", "traes", "traerás"),
    f("Yo ___ enfermo la semana pasada. (estar)", "estuve", "estí", "estoy", "estaré"),
  ],
  [
    f("Mi tía me ___ un regalo. (dar)", "dio", "dó", "da", "dará"),
    f("Ayer yo ___ una película. (ver)", "vi", "veí", "veo", "veré"),
    f("El bebé ___ toda la noche. (dormir)", "durmió", "dormió", "duerme", "dormirá"),
    f("Rosa ___ un cuento ayer. (leer)", "leyó", "leió", "lee", "leerá"),
    f("Mi hermano ___ un helado. (pedir)", "pidió", "pedió", "pide", "pedirá"),
    f("Nosotros ___ por el campo. (andar)", "anduvimos", "andamos", "andaremos", "andando"),
    f("Ellos ___ un arcoíris. (ver)", "vieron", "veron", "ven", "verán"),
  ],
];

const DONE_OR_NOW: ChoiceItem[] = [
  pt("¿Qué oración corresponde?", "Ahora mismo 👀🏃", "El niño está corriendo.", "El niño corrió.", "El niño correrá.", "El niño había corrido."),
  pt("¿Qué oración corresponde?", "Ayer 📅🏃", "El niño corrió.", "El niño está corriendo.", "El niño correrá.", "El niño corre."),
  pt("¿Qué oración corresponde?", "Ahora mismo 👀🍎", "La niña está comiendo.", "La niña comió.", "La niña comerá.", "La niña había comido."),
  pt("¿Qué oración corresponde?", "Ayer 📅🍎", "La niña comió.", "La niña está comiendo.", "La niña comerá.", "La niña come."),
  pt("¿Qué oración corresponde?", "Ahora mismo 👀🎨", "Luis está pintando.", "Luis pintó.", "Luis pintará.", "Luis había pintado."),
  pt("¿Qué oración corresponde?", "Ayer 📅🎨", "Luis pintó.", "Luis está pintando.", "Luis pintará.", "Luis pinta."),
  pt("¿Qué oración corresponde?", "Ahora mismo 👀📖", "Mi mamá está leyendo.", "Mi mamá leyó.", "Mi mamá leerá.", "Mi mamá había leído."),
  pt("¿Qué oración corresponde?", "Ayer 📅📖", "Mi mamá leyó.", "Mi mamá está leyendo.", "Mi mamá leerá.", "Mi mamá lee."),
];

const SER_ESTAR_PRESENT: ChoiceItem[] = [
  f("Yo ___ alumno de segundo grado.", "soy", "eres", "es", "son"),
  f("Tú ___ mi mejor amiga.", "eres", "soy", "es", "somos"),
  f("Nosotros ___ en el patio.", "estamos", "estoy", "está", "están"),
  f("La sopa ___ caliente.", "está", "estoy", "estás", "están"),
  f("Mis primos ___ muy altos.", "son", "es", "soy", "eres"),
  f("Yo ___ contento hoy.", "estoy", "estás", "está", "están"),
  f("Ustedes ___ buenos amigos.", "son", "somos", "es", "eres"),
  f("El gato ___ debajo de la mesa.", "está", "estoy", "estamos", "están"),
];

const SER_ESTAR_PAST: ChoiceItem[] = [
  f("Ayer yo ___ en casa de mi abuela.", "estuve", "estoy", "estaré", "estuvo"),
  f("Cuando era bebé, mi pelo ___ rubio.", "era", "es", "será", "eran"),
  f("La fiesta de ayer ___ muy divertida.", "fue", "es", "será", "fueron"),
  f("Anoche los niños ___ cansados.", "estaban", "están", "estarán", "estaba"),
  f("De pequeños, nosotros ___ vecinos.", "éramos", "somos", "seremos", "eran"),
  f("El lunes mi mamá ___ enferma.", "estuvo", "está", "estará", "estuvieron"),
  f("Los dinosaurios ___ animales enormes.", "eran", "son", "serán", "era"),
  f("Ayer tú ___ muy amable conmigo.", "fuiste", "eres", "serás", "fue"),
];

const SER_O_ESTAR: ChoiceItem[] = [
  f("Mi mamá ___ doctora.", "es", "está", "son", "están"),
  f("Mi mamá ___ en el hospital.", "está", "es", "son", "están"),
  f("Los limones ___ ácidos.", "son", "están", "es", "está"),
  f("Hoy ___ lunes.", "es", "está", "son", "están"),
  f("Los niños ___ cansados.", "están", "son", "es", "está"),
  f("Lima ___ la capital del Perú.", "es", "está", "son", "están"),
  f("Mi cuaderno ___ en la mochila.", "está", "es", "son", "están"),
  f("Yo ___ peruano.", "soy", "estoy", "es", "está"),
];

const TENER: ChoiceItem[] = [
  f("Yo ___ siete años.", "tengo", "tienes", "tiene", "tienen"),
  f("Tú ___ un perro muy lindo.", "tienes", "tengo", "tiene", "tenemos"),
  f("Mi hermana ___ el pelo largo.", "tiene", "tengo", "tienes", "tienen"),
  f("Nosotros ___ clase de música.", "tenemos", "tengo", "tiene", "tienen"),
  f("Ellos ___ mucha hambre.", "tienen", "tiene", "tengo", "tenemos"),
  f("Ayer yo ___ fiebre.", "tuve", "tengo", "tendré", "tuvo"),
  f("Mañana nosotros ___ examen.", "tendremos", "tuvimos", "teníamos", "tendrá"),
  f("Ustedes ___ que hacer la tarea.", "tienen", "tiene", "tenemos", "tengo"),
];

const TIMELINE_IRREGULAR: ChoiceItem[] = [
  when("Ayer fui al mercado.", "Pasado"), when("Mi papá hizo una torta.", "Pasado"), when("Ellos vinieron a la fiesta.", "Pasado"), when("Tuve mucho sueño.", "Pasado"),
  when("Voy al mercado.", "Presente"), when("Mi papá hace una torta.", "Presente"), when("Ellos vienen a la fiesta.", "Presente"),
  when("Iré al mercado.", "Futuro"), when("Mi papá hará una torta.", "Futuro"), when("Ellos vendrán a la fiesta.", "Futuro"), when("Tendré mucho sueño.", "Futuro"),
];

// --- EEE. Artículos --------------------------------------------------------------------------

const UN_UNA: ChoiceItem[] = [
  f("Vi ___ perro en la calle.", "un", "una", "unos", "unas"),
  f("Compré ___ manzana.", "una", "un", "unos", "unas"),
  f("Tengo ___ lápices nuevos.", "unos", "un", "una", "unas"),
  f("Hay ___ flores en el jardín.", "unas", "un", "una", "unos"),
  f("Leí ___ libro muy bonito.", "un", "una", "unos", "unas"),
  f("En el cielo vuela ___ águila.", "un", "una", "unos", "unas"),
  f("Mi tío tiene ___ camioneta.", "una", "un", "unos", "unas"),
  f("Vimos ___ pájaros en el árbol.", "unos", "un", "una", "unas"),
];

const ARTICLES_IN: InSentenceItem[] = [
  s("El perro persigue una pelota.", "El", "una"),
  s("Las niñas compraron unos helados.", "Las", "unos"),
  s("Un gato duerme en la silla.", "Un", "la"),
  s("Los alumnos leen el libro.", "Los", "el"),
  s("La maestra trajo unas láminas.", "La", "unas"),
  s("Una mariposa voló hacia los árboles.", "Una", "los"),
  s("El sol calienta las piedras.", "El", "las"),
];

// --- FFF. Adjetivos y adverbios -----------------------------------------------------------------

const HOW = "Cómo es";
const HOW_MANY = "Cuántos hay";
const KIND_OR_MANY: ChoiceItem[] = [
  ...["Tengo un gato NEGRO.", "Comí una manzana DULCE.", "Vive en una casa GRANDE.", "Es un perro VALIENTE.", "Llevo una chompa SUAVE."].map((t) => ({ p: "¿Qué dice el adjetivo en MAYÚSCULAS?", t, a: HOW, d: [HOW_MANY] })),
  ...["Tengo TRES gatos.", "Comí DOS manzanas.", "Hay MUCHAS casas.", "Vi CINCO perros.", "Llevo POCAS monedas."].map((t) => ({ p: "¿Qué dice el adjetivo en MAYÚSCULAS?", t, a: HOW_MANY, d: [HOW] })),
];

const ADJ_FOR_NOUN: ChoiceItem[] = [
  pt("¿Qué adjetivo describe a «perro»?", "El perro negro ladra en la calle.", "negro", "ladra", "calle", "el"),
  pt("¿Qué adjetivo describe a «flor»?", "La flor roja crece en el jardín.", "roja", "crece", "jardín", "la"),
  pt("¿Qué adjetivo describe a «niño»?", "Un niño alto juega con la pelota.", "alto", "juega", "pelota", "un"),
  pt("¿Qué adjetivo describe a «sopa»?", "La sopa rica está en la mesa.", "rica", "está", "mesa", "la"),
  pt("¿Qué adjetivo describe a «camino»?", "Subimos por un camino largo.", "largo", "subimos", "por", "un"),
  pt("¿Qué adjetivo describe a «casa»?", "Mi abuela vive en una casa vieja.", "vieja", "vive", "abuela", "una"),
  pt("¿Qué adjetivo describe a «gato»?", "El gato gordo no quiere jugar.", "gordo", "quiere", "jugar", "no"),
];

const ADJECTIVES_IN: InSentenceItem[] = [
  s("El perro pequeño tiene una cola larga.", "pequeño", "larga"),
  s("Mi abuela hizo una torta deliciosa.", "deliciosa"),
  s("El cielo azul tiene nubes blancas.", "azul", "blancas"),
  s("Compré un globo rojo.", "rojo"),
  s("La niña alegre canta una canción bonita.", "alegre", "bonita"),
  s("El elefante enorme toma agua fresca.", "enorme", "fresca"),
  s("Tengo un amigo simpático.", "simpático"),
];

const COMPARATIVE = "Comparativo (compara dos)";
const SUPERLATIVE = "Superlativo (el que más)";
const COMPARE_TYPE: ChoiceItem[] = [
  ...["Ana es más alta que Luis.", "El gato es más rápido que la tortuga.", "Mi casa es más pequeña que la tuya.", "El tren es más largo que el bus.", "Hoy hace más frío que ayer."].map((t) => ({ t, a: COMPARATIVE, d: [SUPERLATIVE] })),
  ...["Ana es la más alta del salón.", "El guepardo es el más rápido de todos.", "Es la casa más pequeña del barrio.", "Fue el día más frío del año.", "Esta torta está riquísima."].map((t) => ({ t, a: SUPERLATIVE, d: [COMPARATIVE] })),
];

const HOW_ADV = "Cómo";
const WHEN_ADV = "Cuándo";
const WHERE_ADV = "Dónde";
const adv = (t: string, a: string): ChoiceItem => ({ p: "¿Qué dice el adverbio en MAYÚSCULAS?", t, a, d: [HOW_ADV, WHEN_ADV, WHERE_ADV].filter((x) => x !== a) });
const ADVERB_KIND: ChoiceItem[] = [
  adv("El caracol camina LENTAMENTE.", HOW_ADV), adv("Ella canta BIEN.", HOW_ADV), adv("Habla DESPACIO, por favor.", HOW_ADV),
  adv("AYER fuimos al cine.", WHEN_ADV), adv("Llegaré TARDE.", WHEN_ADV), adv("SIEMPRE desayuno avena.", WHEN_ADV),
  adv("El gato está AFUERA.", WHERE_ADV), adv("Vivo CERCA.", WHERE_ADV), adv("Deja la mochila AQUÍ.", WHERE_ADV),
];

const ADVERBS_IN: InSentenceItem[] = [
  s("El tren llegó tarde.", "tarde"),
  s("Mi hermano corre rápidamente.", "rápidamente"),
  s("Hoy jugamos afuera.", "Hoy", "afuera"),
  s("La tortuga camina despacio.", "despacio"),
  s("Siempre me lavo las manos.", "Siempre"),
  s("El perro duerme aquí.", "aquí"),
  s("Ayer cantaste bien.", "Ayer", "bien"),
];

const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("Mi hermana canta muy ___.", "bien", "buena", "bueno", "buenas"),
  f("Es una cantante muy ___.", "buena", "bien", "bueno", "buenamente"),
  f("El tren es ___.", "rápido", "rápidamente", "rápidas", "rapidez"),
  f("El caracol avanza ___.", "lentamente", "lento caracol", "lentas", "lentitud"),
  f("La maestra es ___ con todos.", "amable", "amablemente", "amabilidad", "amables"),
  f("Nos saludó ___.", "amablemente", "amable saludo", "amables", "amabilidad"),
  f("El examen fue ___.", "fácil", "fácilmente", "facilidad", "fáciles"),
  f("Resolvió el problema ___.", "fácilmente", "fáciles", "facilidad", "fácil problema"),
];

const ADJ_OR_ADV: ChoiceItem[] = [
  ...["El niño FELIZ juega.", "Compré una mochila NUEVA.", "Es un camino LARGO.", "El perro GRANDE ladra.", "Tengo las manos FRÍAS."].map((t) => ({ p: "¿La palabra en MAYÚSCULAS es adjetivo o adverbio?", t, a: "Adjetivo", d: ["Adverbio"] })),
  ...["El niño juega FELIZMENTE.", "Llegamos TEMPRANO.", "Camina DESPACIO.", "El perro ladra FUERTEMENTE.", "Vive LEJOS."].map((t) => ({ p: "¿La palabra en MAYÚSCULAS es adjetivo o adverbio?", t, a: "Adverbio", d: ["Adjetivo"] })),
];

// --- GGG. Preposiciones ---------------------------------------------------------------------

const PREP_PIC: ChoiceItem[] = [
  { pic: "🐱📦", t: "El gato está ___ la caja. (adentro)", a: "en", d: ["sobre", "bajo", "entre"] },
  { pic: "📚🪑", t: "Los libros están ___ la silla. (encima)", a: "sobre", d: ["bajo", "entre", "sin"] },
  { pic: "⚽🛏️", t: "La pelota está ___ la cama. (debajo)", a: "bajo", d: ["sobre", "entre", "desde"] },
  { pic: "🌳🏠🌳", t: "La casa está ___ dos árboles.", a: "entre", d: ["sobre", "bajo", "sin"] },
  { pic: "🚶➡️🏫", t: "El niño camina ___ la escuela.", a: "hacia", d: ["sin", "bajo", "sobre"] },
  { pic: "☕🥛", t: "Tomo café ___ leche.", a: "con", d: ["sin", "bajo", "entre"] },
  { pic: "✈️☁️", t: "El avión vuela ___ las nubes.", a: "sobre", d: ["bajo", "en", "sin"] },
];

const PREP_SENT: ChoiceItem[] = [
  f("Voy ___ la escuela todos los días.", "a", "de", "con", "sin"),
  f("Este regalo es ___ ti.", "para", "sin", "desde", "entre"),
  f("Vengo ___ la casa de mi tía.", "de", "a", "para", "entre"),
  f("Salí ___ paraguas y me mojé.", "sin", "con", "para", "hacia"),
  f("Caminamos ___ el puente.", "por", "sin", "de", "con"),
  f("Estudio ___ las tres hasta las cinco.", "desde", "sin", "para", "con"),
  f("Juego ___ mis amigos en el recreo.", "con", "sin", "hacia", "desde"),
  f("El libro está ___ la mesa.", "sobre", "sin", "para", "hacia"),
];

// --- HHH. Contracciones ------------------------------------------------------------------------

const CONTRACTION_MATCH: ChoiceItem[] = [
  w("a + el =", "al", "ael", "a el", "del"),
  w("de + el =", "del", "deel", "de el", "al"),
  w("con + mí =", "conmigo", "con mí", "conmí", "comigo"),
  w("con + ti =", "contigo", "con ti", "contí", "contigó"),
  w("¿De qué palabras viene «al»?", "a + el", "a + la", "de + el", "a + los"),
  w("¿De qué palabras viene «del»?", "de + el", "de + la", "a + el", "de + los"),
  w("¿De qué palabras viene «conmigo»?", "con + mí", "con + yo", "con + me", "como + mí"),
];

const CONMIGO_FORM: ChoiceItem[] = [
  pt("¿Cómo se escribe correctamente?", "Ven (con + mí) al parque.", "Ven conmigo al parque.", "Ven con mí al parque.", "Ven con yo al parque.", "Ven comigo al parque."),
  pt("¿Cómo se escribe correctamente?", "Quiero jugar (con + ti).", "Quiero jugar contigo.", "Quiero jugar con ti.", "Quiero jugar con tú.", "Quiero jugar contígo."),
  pt("¿Cómo se escribe correctamente?", "Mi perro duerme (con + mí).", "Mi perro duerme conmigo.", "Mi perro duerme con mí.", "Mi perro duerme con yo.", "Mi perro duerme con me."),
  pt("¿Cómo se escribe correctamente?", "Voy (con + ti) a la tienda.", "Voy contigo a la tienda.", "Voy con ti a la tienda.", "Voy con tú a la tienda.", "Voy conti a la tienda."),
  pt("¿Cómo se escribe correctamente?", "¿Almuerzas (con + mí) hoy?", "¿Almuerzas conmigo hoy?", "¿Almuerzas con mí hoy?", "¿Almuerzas con yo hoy?", "¿Almuerzas comigo hoy?"),
  pt("¿Cómo se escribe correctamente?", "Ella trajo su mochila (con + sí).", "Ella trajo su mochila consigo.", "Ella trajo su mochila con sí.", "Ella trajo su mochila con se.", "Ella trajo su mochila consí."),
];

const AL_DEL_FORM: ChoiceItem[] = [
  pt("¿Cómo se escribe correctamente?", "Voy (a + el) parque.", "Voy al parque.", "Voy a el parque.", "Voy del parque.", "Voy ael parque."),
  pt("¿Cómo se escribe correctamente?", "Vengo (de + el) mercado.", "Vengo del mercado.", "Vengo de el mercado.", "Vengo al mercado.", "Vengo deel mercado."),
  pt("¿Cómo se escribe correctamente?", "Le di comida (a + el) gato.", "Le di comida al gato.", "Le di comida a el gato.", "Le di comida del gato.", "Le di comida a gato."),
  pt("¿Cómo se escribe correctamente?", "La puerta (de + el) salón es azul.", "La puerta del salón es azul.", "La puerta de el salón es azul.", "La puerta al salón es azul.", "La puerta de salón es azul."),
  pt("¿Cómo se escribe correctamente?", "Llegamos (a + el) colegio.", "Llegamos al colegio.", "Llegamos a el colegio.", "Llegamos del colegio.", "Llegamos ael colegio."),
  pt("¿Cómo se escribe correctamente?", "El agua (de + el) río está fría.", "El agua del río está fría.", "El agua de el río está fría.", "El agua al río está fría.", "El agua de río está fría."),
];

const CONMIGO_USE: ChoiceItem[] = [
  f("¿Quieres almorzar ___? Yo te invito.", "conmigo", "contigo", "consigo", "con mí"),
  f("Me gusta jugar ___; eres muy divertido.", "contigo", "conmigo", "consigo", "con ti"),
  f("Mi hermanita siempre quiere venir ___ cuando salgo.", "conmigo", "contigo", "con yo", "comigo"),
  f("Voy a estudiar ___ para ayudarte.", "contigo", "conmigo", "con tú", "con ti"),
  f("Llevé mi paraguas ___.", "conmigo", "contigo", "con mí", "con me"),
  f("¿Puedo sentarme ___?", "contigo", "conmigo", "con ti", "con tú"),
  f("El niño trajo su juguete ___.", "consigo", "conmigo", "con sí", "con se"),
];

const AL_DEL_USE: ChoiceItem[] = [
  f("Vamos ___ cine.", "al", "del", "a el", "de el"),
  f("Salgo ___ colegio a la una.", "del", "al", "de el", "a el"),
  f("El gato subió ___ techo.", "al", "del", "a el", "de el"),
  f("Las hojas ___ árbol son verdes.", "del", "al", "de el", "a el"),
  f("Le escribí una carta ___ director.", "al", "del", "a el", "de el"),
  f("Volvimos ___ paseo muy cansados.", "del", "al", "de el", "a el"),
  f("Dale agua ___ perro.", "al", "del", "a el", "de el"),
  f("Este es el cuaderno ___ profesor.", "del", "al", "de el", "a el"),
];

const CONTRACTION_SENTENCE: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "Fui al parque contigo.", "Fui a el parque contigo.", "Fui al parque con ti.", "Fui a el parque con ti."),
  w("¿Cuál está bien escrita?", "Vengo del mercado.", "Vengo de el mercado.", "Vengo deel mercado.", "Vengo dél mercado."),
  w("¿Cuál está bien escrita?", "Mi primo juega conmigo.", "Mi primo juega con mí.", "Mi primo juega con yo.", "Mi primo juega comigo."),
  w("¿Cuál está bien escrita?", "Voy a la playa.", "Voy al la playa.", "Voy ala playa.", "Voy a el playa."),
  w("¿Cuál está bien escrita?", "El libro del niño es nuevo.", "El libro de el niño es nuevo.", "El libro al niño es nuevo.", "El libro deel niño es nuevo."),
  w("¿Cuál está bien escrita?", "Le di un hueso al perro.", "Le di un hueso a el perro.", "Le di un hueso del perro.", "Le di un hueso ael perro."),
  w("¿Cuál está bien escrita?", "Salimos de la casa.", "Salimos del la casa.", "Salimos dela casa.", "Salimos de el casa."),
];

// --- III. Puntuación ---------------------------------------------------------------------------

const COMMA_SERIES: ChoiceItem[] = [
  w("¿Cuál tiene las comas bien puestas?", "Compré pan, queso, leche y huevos.", "Compré pan queso leche y huevos.", "Compré, pan queso leche, y huevos.", "Compré pan, queso leche, y, huevos."),
  w("¿Cuál tiene las comas bien puestas?", "En el zoológico vi monos, osos y leones.", "En el zoológico vi monos osos y leones.", "En el zoológico, vi monos osos, y leones.", "En el zoológico vi, monos, osos, y, leones."),
  w("¿Cuál tiene las comas bien puestas?", "Mi mochila tiene lápices, cuadernos y una regla.", "Mi mochila tiene lápices cuadernos y una regla.", "Mi mochila, tiene lápices cuadernos y, una regla.", "Mi mochila tiene, lápices, cuadernos, y una, regla."),
  w("¿Cuál tiene las comas bien puestas?", "Los colores son rojo, azul, verde y amarillo.", "Los colores son rojo azul verde y amarillo.", "Los colores, son rojo azul, verde y amarillo.", "Los colores son, rojo, azul, verde, y, amarillo."),
  w("¿Cuál tiene las comas bien puestas?", "Jugamos fútbol, vóley y básquet.", "Jugamos fútbol vóley y básquet.", "Jugamos, fútbol vóley, y básquet.", "Jugamos fútbol, vóley, y, básquet."),
  w("¿Cuál tiene las comas bien puestas?", "Ana, Luis y Rosa son mis amigos.", "Ana Luis y Rosa son mis amigos.", "Ana Luis, y Rosa, son mis amigos.", "Ana, Luis, y, Rosa son mis amigos."),
];

const COMMA_DATES: ChoiceItem[] = [
  w("¿Cuál fecha está bien escrita?", "Lima, 5 de mayo de 2025", "Lima 5 de mayo de 2025", "Lima 5, de mayo de 2025", "Lima, 5 de, mayo de 2025"),
  w("¿Cuál fecha está bien escrita?", "Cusco, 24 de junio de 2024", "Cusco 24 de junio de 2024", "Cusco 24 de junio, de 2024", "Cusco, 24, de junio de 2024"),
  w("¿Cuál fecha está bien escrita?", "Lunes, 3 de marzo de 2025", "Lunes 3, de marzo de 2025", "Lunes 3 de marzo, de 2025", "Lunes, 3 de, marzo de 2025"),
  w("¿Cuál fecha está bien escrita?", "Arequipa, 15 de agosto de 2023", "Arequipa 15 de agosto de 2023", "Arequipa 15 de agosto de, 2023", "Arequipa, 15 de agosto, de 2023"),
  w("¿Cuál fecha está bien escrita?", "Piura, 1 de enero de 2026", "Piura 1 de enero de 2026", "Piura 1 de, enero de 2026", "Piura, 1, de enero de 2026"),
  w("¿Cuál fecha está bien escrita?", "Viernes, 28 de julio de 2023", "Viernes 28 de julio de 2023", "Viernes 28 de julio de, 2023", "Viernes, 28 de julio, de 2023"),
];

const COMMA_PLACES: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "Mi tía vive en Cusco, Perú.", "Mi tía vive en Cusco Perú.", "Mi tía vive, en Cusco Perú.", "Mi tía, vive en Cusco Perú."),
  w("¿Cuál está bien escrita?", "Nací en Trujillo, La Libertad.", "Nací en Trujillo La Libertad.", "Nací, en Trujillo La Libertad.", "Nací en, Trujillo La Libertad."),
  w("¿Cuál está bien escrita?", "Viajamos a Santiago, Chile.", "Viajamos a Santiago Chile.", "Viajamos, a Santiago Chile.", "Viajamos a, Santiago Chile."),
  w("¿Cuál está bien escrita?", "El paquete llegó de Quito, Ecuador.", "El paquete llegó de Quito Ecuador.", "El paquete, llegó de Quito Ecuador.", "El paquete llegó, de Quito Ecuador."),
  w("¿Cuál está bien escrita?", "Mi primo estudia en Bogotá, Colombia.", "Mi primo estudia en Bogotá Colombia.", "Mi primo, estudia en Bogotá Colombia.", "Mi primo estudia, en Bogotá Colombia."),
  w("¿Cuál está bien escrita?", "Vivo en Miraflores, Lima.", "Vivo en Miraflores Lima.", "Vivo, en Miraflores Lima.", "Vivo en, Miraflores Lima."),
];

// --- JJJ. Mayúsculas -------------------------------------------------------------------------

const CAPS_NAMES: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "Mi amiga se llama Valeria.", "Mi amiga se llama valeria.", "mi amiga se llama Valeria.", "Mi Amiga se llama valeria."),
  w("¿Cuál está bien escrita?", "Mi perro Toby ladra mucho.", "Mi perro toby ladra mucho.", "Mi Perro Toby ladra mucho.", "mi perro Toby ladra mucho."),
  w("¿Cuál está bien escrita?", "Ayer jugué con Mateo y Lucía.", "Ayer jugué con mateo y lucía.", "Ayer jugué con Mateo y lucía.", "ayer jugué con Mateo y Lucía."),
  w("¿Cuál está bien escrita?", "La gata Michi duerme.", "La gata michi duerme.", "La Gata Michi duerme.", "la gata Michi duerme."),
  w("¿Cuál está bien escrita?", "El señor Quispe vende pan.", "El señor quispe vende pan.", "El Señor quispe vende pan.", "el señor Quispe vende pan."),
  w("¿Cuál está bien escrita?", "Mi abuela Rosa cocina rico.", "Mi abuela rosa cocina rico.", "Mi Abuela Rosa cocina rico.", "mi abuela Rosa cocina rico."),
];

const CAPS_DAYS: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "El lunes tengo clase de música.", "El Lunes tengo clase de música.", "el lunes tengo clase de música.", "El lunes tengo clase de Música."),
  w("¿Cuál está bien escrita?", "Mi cumpleaños es en marzo.", "Mi cumpleaños es en Marzo.", "mi cumpleaños es en marzo.", "Mi Cumpleaños es en marzo."),
  w("¿Cuál está bien escrita?", "En diciembre celebramos la Navidad.", "En Diciembre celebramos la navidad.", "En diciembre celebramos la navidad.", "En Diciembre celebramos la Navidad."),
  w("¿Cuál está bien escrita?", "El viernes es feriado por Fiestas Patrias.", "El Viernes es feriado por fiestas patrias.", "El viernes es feriado por fiestas patrias.", "El Viernes es feriado por Fiestas Patrias."),
  w("¿Cuál está bien escrita?", "El sábado y el domingo descanso.", "El Sábado y el Domingo descanso.", "El sábado y el Domingo descanso.", "el sábado y el domingo descanso."),
  w("¿Cuál está bien escrita?", "En enero empieza el Año Nuevo.", "En Enero empieza el año nuevo.", "En enero empieza el año Nuevo.", "en enero empieza el Año Nuevo."),
];

const CAPS_PLACES: ChoiceItem[] = [
  w("¿Cuál está bien escrita?", "Vivo en Lima, la capital del Perú.", "Vivo en lima, la capital del perú.", "Vivo en Lima, la Capital del perú.", "vivo en Lima, la capital del Perú."),
  w("¿Cuál está bien escrita?", "El río Amazonas es muy largo.", "El Río amazonas es muy largo.", "El río amazonas es muy largo.", "el río Amazonas es muy largo."),
  w("¿Cuál está bien escrita?", "Visitamos el lago Titicaca.", "Visitamos el Lago titicaca.", "Visitamos el lago titicaca.", "visitamos el lago Titicaca."),
  w("¿Cuál está bien escrita?", "Mi escuela queda en la avenida Grau.", "Mi escuela queda en la Avenida grau.", "Mi escuela queda en la avenida grau.", "mi escuela queda en la avenida Grau."),
  w("¿Cuál está bien escrita?", "Mi tío viajó a Chile y a Brasil.", "Mi tío viajó a chile y a brasil.", "Mi tío viajó a Chile y a brasil.", "mi tío viajó a Chile y a Brasil."),
  w("¿Cuál está bien escrita?", "Subimos al nevado Huascarán.", "Subimos al Nevado huascarán.", "Subimos al nevado huascarán.", "subimos al nevado Huascarán."),
];

const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título está bien escrito?", "El gato con botas", "El Gato Con Botas", "el gato con botas", "El gato Con botas"),
  w("¿Qué título está bien escrito?", "La liebre y la tortuga", "La Liebre Y La Tortuga", "la liebre y la tortuga", "La liebre y la Tortuga"),
  w("¿Qué título está bien escrito?", "Los tres cerditos", "Los Tres Cerditos", "los tres cerditos", "Los tres Cerditos"),
  w("¿Qué título está bien escrito?", "Paco Yunque", "paco yunque", "Paco yunque", "paco Yunque"),
  w("¿Qué título está bien escrito?", "Las aventuras de Pinocho", "Las Aventuras De Pinocho", "las aventuras de pinocho", "Las aventuras de pinocho"),
  w("¿Qué título está bien escrito?", "Cuentos de la selva", "Cuentos De La Selva", "cuentos de la selva", "Cuentos de la Selva"),
];

const LETTERS: ChoiceItem[] = [
  w("¿Qué saludo de carta está bien escrito?", "Querida abuela:", "querida abuela:", "Querida Abuela", "querida Abuela,"),
  w("¿Qué saludo de carta está bien escrito?", "Estimado profesor:", "estimado profesor:", "Estimado Profesor", "estimado Profesor,"),
  w("¿Qué despedida de carta está bien escrita?", "Con cariño,", "con cariño,", "Con Cariño", "con Cariño:"),
  w("¿Qué despedida de carta está bien escrita?", "Un abrazo,", "un abrazo,", "Un Abrazo", "un Abrazo:"),
  w("¿Qué saludo de carta está bien escrito?", "Querido tío Manuel:", "querido tío manuel:", "Querido Tío manuel", "querido tío Manuel,"),
  w("¿Qué despedida de carta está bien escrita?", "Hasta pronto,", "hasta pronto,", "Hasta Pronto", "hasta Pronto:"),
  w("¿Qué signo va después del saludo de una carta, como «Querida mamá»?", "Dos puntos (:)", "Punto y coma (;)", "Signo de pregunta (?)", "Ningún signo"),
];

// --- LLL. Abreviaturas -----------------------------------------------------------------------

const abbr = (list: [string, string][], all: string[]): ChoiceItem[] => list.map(([name, a]) => ({ p: `¿Cuál es la abreviatura de «${name}»?`, a, d: all.filter((x) => x !== a) }));
const DAY_ABBR: [string, string][] = [["lunes", "lun."], ["martes", "mar."], ["miércoles", "mié."], ["jueves", "jue."], ["viernes", "vie."], ["sábado", "sáb."], ["domingo", "dom."]];
const MONTH_ABBR: [string, string][] = [["enero", "ene."], ["febrero", "feb."], ["marzo", "mar."], ["abril", "abr."], ["junio", "jun."], ["julio", "jul."], ["agosto", "ago."], ["octubre", "oct."], ["noviembre", "nov."], ["diciembre", "dic."]];

const fromSet = (i: number) => (r: Parameters<typeof choose>[0]) => choose(r, "Completa con el verbo en pasado.", IRREGULAR_SETS[i]);

export const ROWS: Row[] = [
  ["XX.1", "Escribir palabras con sufijos: cambiar z por c", (r) => choose(r, "¿Cuál está bien escrita?", Z_TO_C)],
  ["XX.2", "Escribir palabras con sufijos: cambiar c por qu", (r) => choose(r, "¿Cuál está bien escrita?", C_TO_QU)],
  ["XX.3", "Escribir palabras con sufijos: cambiar g por gu", (r) => choose(r, "¿Cuál está bien escrita?", G_TO_GU)],
  ["XX.4", "Escribir palabras con sufijos: repaso", (r) => choose(r, "¿Cuál está bien escrita?", [...Z_TO_C, ...C_TO_QU, ...G_TO_GU])],

  ["YY.1", "¿La oración es una afirmación, una pregunta, una orden o una exclamación?", (r) => choose(r, "¿Qué tipo de oración es?", SENTENCE_KIND)],
  ["YY.2", "Identificar el sujeto de una oración", (r) => choose(r, "", SUBJECT)],
  ["YY.3", "Identificar el predicado de una oración", (r) => choose(r, "", PREDICATE)],
  ["YY.4", "¿Es una oración completa o un fragmento?", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["YY.5", "¿Es una oración completa o son oraciones pegadas?", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["YY.6", "¿Es una oración completa, un fragmento u oraciones pegadas?", (r) =>
    choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],
  ["YY.7", "Ordenar las palabras para formar una oración completa", (r) => order(r, "Ordena las palabras para formar una oración.", UNSCRAMBLE)],

  ["ZZ.1", "Seleccionar los sustantivos", (r) => pickAll(r, "Selecciona los sustantivos (nombres de personas, animales, lugares o cosas).", NOUNS, NOT_NOUNS)],
  ["ZZ.2", "¿Qué palabra es un sustantivo?", (r) => choose(r, "", WHICH_NOUN)],
  ["ZZ.3", "Identificar sustantivos", (r) => pickInSentence(r, "Selecciona los sustantivos de la oración.", NOUNS_IN)],
  ["ZZ.4", "Clasificar sustantivos comunes y propios", (r) => mix(r, [(q) => pickAll(q, "Selecciona los sustantivos propios.", PROPER, COMMON), (q) => pickAll(q, "Selecciona los sustantivos comunes.", COMMON, PROPER)])],
  ["ZZ.5", "Identificar sustantivos comunes y propios", (r) => choose(r, "¿El sustantivo es común o propio?", COMMON_PROPER)],
  ["ZZ.6", "Formar plurales regulares con -s y -es", (r) => choose(r, "Escribe el plural.", PLURAL_FORM)],
  ["ZZ.7", "Usar plurales regulares con -s y -es", (r) => choose(r, "Completa la oración.", PLURAL_USE)],
  ["ZZ.8", "Usar sustantivos en singular y en plural", (r) => choose(r, "Completa la oración.", SING_PLUR)],
  ["ZZ.9", "¿El sustantivo está en singular o en plural?", (r) => choose(r, "¿Está en singular o en plural?", SINGULAR_OR_PLURAL)],
  ["ZZ.10", "Formar y usar plurales especiales", (r) => choose(r, "Escribe el plural.", IRREGULAR_PLURAL)],
  ["ZZ.11", "Identificar plurales y frases de pertenencia", (r) => choose(r, "¿Qué muestra la oración?", POSSESSIVE_ID)],
  ["ZZ.12", "Formar frases de pertenencia: de, del, de la, de los", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],
  ["ZZ.13", "Identificar y corregir errores de plural y de pertenencia", (r) => choose(r, "", POSSESSIVE_ERRORS)],

  ["AAA.1", "Identificar pronombres personales", (r) => pickInSentence(r, "Selecciona los pronombres personales.", PRONOUNS_IN)],
  ["AAA.2", "Elegir entre pronombres de sujeto y de objeto", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["AAA.3", "Reemplazar el sustantivo singular por un pronombre personal", (r) => choose(r, "Reemplaza las palabras en MAYÚSCULAS por un pronombre.", REPLACE_SINGULAR)],
  ["AAA.4", "Reemplazar el sustantivo plural por un pronombre personal", (r) => choose(r, "Reemplaza las palabras en MAYÚSCULAS por un pronombre.", REPLACE_PLURAL)],
  ["AAA.5", "Sujetos y complementos compuestos con «yo» y «mí»", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["AAA.6", "Elegir el pronombre personal correcto", (r) => choose(r, "Completa la oración.", PERSONAL)],
  ["AAA.7", "Identificar pronombres posesivos", (r) => pickInSentence(r, "Selecciona los pronombres posesivos.", POSS_IN)],
  ["AAA.8", "Usar pronombres posesivos", (r) => choose(r, "Completa la oración.", POSS_USE)],
  ["AAA.9", "Elegir entre pronombres personales y reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["AAA.10", "Usar pronombres reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],

  ["BBB.1", "Usar verbos de acción", (r) => choose(r, "Completa la oración con un verbo.", ACTION_USE)],
  ["BBB.2", "Identificar verbos de acción", (r) => pickInSentence(r, "Selecciona los verbos de acción.", ACTION_IN)],
  ["BBB.3", "Identificar verbos auxiliares", (r) => pickInSentence(r, "Selecciona el verbo auxiliar (el que ayuda al otro verbo).", HELPING_IN)],

  ["CCC.1", "¿Uno o más de uno?", (r) => choose(r, "¿La oración habla de uno o de más de uno?", ONE_OR_MORE)],
  ["CCC.2", "Usar el sujeto o el verbo correcto", (r) => choose(r, "Completa la oración.", SUBJECT_VERB)],
  ["CCC.3", "Concordancia entre pronombre y verbo", (r) => choose(r, "Completa la oración.", PRONOUN_VERB)],

  ["DDD.1", "¿Qué oración está en pasado?", (r) => choose(r, "", PAST_SENTENCE)],
  ["DDD.2", "Identificar verbos regulares en pasado", (r) => pickInSentence(r, "Selecciona los verbos en pasado.", PAST_VERBS_IN)],
  ["DDD.3", "Formar y usar el pasado de verbos regulares", (r) => choose(r, "Completa con el verbo en pasado.", PAST_REGULAR)],
  ["DDD.4", "Ubicar oraciones en la línea de tiempo", (r) => choose(r, "¿Cuándo pasa?", TIMELINE)],
  ["DDD.5", "Cambiar la oración al futuro", (r) => choose(r, "", TO_FUTURE)],
  ["DDD.6", "Identificar el pasado de verbos irregulares I", (r) => choose(r, "", IRREGULAR_ID_1)],
  ["DDD.7", "Identificar el pasado de verbos irregulares II", (r) => choose(r, "", IRREGULAR_ID_2)],
  ["DDD.8", "Formar y usar el pasado de verbos irregulares: grupo 1", fromSet(0)],
  ["DDD.9", "Formar y usar el pasado de verbos irregulares: grupo 2", fromSet(1)],
  ["DDD.10", "Formar y usar el pasado de verbos irregulares: grupo 3", fromSet(2)],
  ["DDD.11", "Formar y usar el pasado de verbos irregulares: grupo 4", fromSet(3)],
  ["DDD.12", "Relacionar oraciones: ya pasó o está pasando", (r) => choose(r, "", DONE_OR_NOW)],
  ["DDD.13", "Ser y estar: usar la forma correcta en presente", (r) => choose(r, "Completa la oración.", SER_ESTAR_PRESENT)],
  ["DDD.14", "Ser y estar: usar la forma correcta en pasado", (r) => choose(r, "Completa la oración.", SER_ESTAR_PAST)],
  ["DDD.15", "Ser y estar: usar la forma correcta", (r) => choose(r, "Completa con ser o estar.", SER_O_ESTAR)],
  ["DDD.16", "Tener: usar la forma correcta", (r) => choose(r, "Completa con el verbo tener.", TENER)],
  ["DDD.17", "Ubicar oraciones con verbos irregulares en la línea de tiempo", (r) => choose(r, "¿Cuándo pasa?", TIMELINE_IRREGULAR)],
  ["DDD.18", "¿La oración está en pasado, presente o futuro?", (r) => choose(r, "¿En qué tiempo está la oración?", [...TIMELINE, ...TIMELINE_IRREGULAR])],

  ["EEE.1", "Usar el artículo correcto: un, una, unos, unas", (r) => choose(r, "¿Qué artículo va?", UN_UNA)],
  ["EEE.2", "Identificar artículos", (r) => pickInSentence(r, "Selecciona los artículos de la oración.", ARTICLES_IN)],

  ["FFF.1", "¿El adjetivo dice cómo es o cuántos hay?", (r) => choose(r, "", KIND_OR_MANY)],
  ["FFF.2", "Identificar el adjetivo que describe al sustantivo", (r) => choose(r, "", ADJ_FOR_NOUN)],
  ["FFF.3", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos (palabras que dicen cómo es algo).", ADJECTIVES_IN)],
  ["FFF.4", "Identificar adjetivos comparativos y superlativos", (r) => choose(r, "¿Qué tipo de comparación es?", COMPARE_TYPE)],
  ["FFF.5", "¿El adverbio dice cómo, cuándo o dónde?", (r) => choose(r, "", ADVERB_KIND)],
  ["FFF.6", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios (dicen cómo, cuándo o dónde).", ADVERBS_IN)],
  ["FFF.7", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["FFF.8", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],

  ["GGG.1", "Elegir la mejor preposición según el dibujo", (r) => choose(r, "Completa la oración según el dibujo.", PREP_PIC)],
  ["GGG.2", "Elegir la mejor preposición para completar la oración", (r) => choose(r, "Completa la oración.", PREP_SENT)],

  ["HHH.1", "Relacionar las contracciones", (r) => choose(r, "", CONTRACTION_MATCH)],
  ["HHH.2", "Formar conmigo, contigo y consigo", (r) => choose(r, "", CONMIGO_FORM)],
  ["HHH.3", "Formar las contracciones al y del", (r) => choose(r, "", AL_DEL_FORM)],
  ["HHH.4", "Usar conmigo, contigo y consigo", (r) => choose(r, "Completa la oración.", CONMIGO_USE)],
  ["HHH.5", "Usar las contracciones al y del", (r) => choose(r, "Completa con al o del.", AL_DEL_USE)],
  ["HHH.6", "Usar contracciones en una oración", (r) => choose(r, "", CONTRACTION_SENTENCE)],

  ["III.1", "Comas en una enumeración", (r) => choose(r, "", COMMA_SERIES)],
  ["III.2", "Comas en las fechas", (r) => choose(r, "", COMMA_DATES)],
  ["III.3", "Comas en los nombres de lugares", (r) => choose(r, "", COMMA_PLACES)],
  ["III.4", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_DATES, ...COMMA_PLACES])],

  ["JJJ.1", "Mayúscula en los nombres de personas y mascotas", (r) => choose(r, "", CAPS_NAMES)],
  ["JJJ.2", "Días y meses con minúscula; festividades con mayúscula", (r) => choose(r, "", CAPS_DAYS)],
  ["JJJ.3", "Mayúscula en los nombres de lugares y accidentes geográficos", (r) => choose(r, "", CAPS_PLACES)],
  ["JJJ.4", "Mayúsculas: repaso", (r) => choose(r, "", [...CAPS_NAMES, ...CAPS_DAYS, ...CAPS_PLACES])],
  ["JJJ.5", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],
  ["JJJ.6", "Saludos y despedidas de las cartas", (r) => choose(r, "", LETTERS)],

  ["LLL.1", "Abreviar los días de la semana", (r) => choose(r, "", abbr(DAY_ABBR, DAY_ABBR.map(([, a]) => a)))],
  ["LLL.2", "Abreviar los meses del año", (r) => choose(r, "", abbr(MONTH_ABBR, MONTH_ABBR.map(([, a]) => a)))],
];
