import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pool, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 4th grade ELA, SS-AAA), con las
// reglas del castellano:
//   a / an → el / un ante a tónica (el agua, un águila)
//   orden de los adjetivos → posición del adjetivo y formas cortas (buen, gran, primer)
//   adverbios relativos → donde, cuando, como
//   more / most → más... que, el más..., mejor, peor, mayor, menor
//   contracciones (I'm, don't) → al, del; conmigo, contigo, consigo
//   mayúsculas: días, meses, gentilicios e idiomas van con minúscula
//   unidades inglesas → kg, g, l, ml; km, m, cm, mm (símbolos sin punto)
//   calles y estados → Av., Jr., Ca., Psje. y n.º, dpto., int., s/n
//   diálogos: con raya (—)

export const SECTIONS: Section[] = [
  { id: "SS", name: "Artículos", icon: "📌" },
  { id: "TT", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "UU", name: "Preposiciones", icon: "📦" },
  { id: "VV", name: "Conjunciones", icon: "🔗" },
  { id: "WW", name: "Contracciones", icon: "✂️" },
  { id: "XX", name: "Comas", icon: "❗" },
  { id: "YY", name: "Mayúsculas", icon: "🔠" },
  { id: "ZZ", name: "Abreviaturas", icon: "📅" },
  { id: "AAA", name: "Formato", icon: "📝" },
];

// --- SS. Artículos -----------------------------------------------------------

const EL_UN: ChoiceItem[] = [
  f("___ águila real planea sobre el valle.", "El", "La", "Las"), f("Necesito ___ hacha para partir la leña.", "un", "una", "unas"), f("___ área de juegos está cerrada.", "El", "La", "Los"),
  f("___ arena de la playa quema.", "La", "El", "Un"), f("Tocó ___ arpa en la fiesta.", "un", "una", "unos"), f("___ ala del avión brillaba.", "El", "La", "Unas"),
  f("___ alta montaña tenía nieve.", "La", "El", "Los"), f("Tengo ___ ansia enorme de llegar.", "un", "una", "unos"), f("___ habla de ese pueblo es muy dulce.", "El", "La", "Unas"),
  f("___ amable señora nos ayudó.", "La", "El", "Un"),
];
const ARTICLE_USE: ChoiceItem[] = [
  f("Había ___ cóndor en la roca; ___ cóndor abrió las alas.", "un / el", "el / un", "una / la"), f("___ aguas del lago son frías.", "Las", "Los", "El"), f("Compré ___ tijeras y ___ regla.", "unas / una", "unos / un", "una / unas"),
  f("___ Luna gira alrededor de ___ Tierra.", "La / la", "Una / una", "El / el"), f("Mi tío trajo ___ paltas de su chacra.", "unas", "unos", "una"), f("___ problemas de hoy fueron difíciles.", "Los", "Las", "El"),
  f("Pásame ___ mapa que está en la mesa.", "el", "la", "unos"), f("___ día vi ___ zorro cerca del río.", "Un / un", "El / el", "Una / una"), f("___ manos se lavan con jabón.", "Las", "Los", "La"),
  f("En el corral hay ___ gallinas.", "unas", "unos", "un"),
];
const ARTICLES_IN = [
  s("El arriero llevó unas mulas por la cuesta.", "El", "unas", "la"), s("Una tejedora vende los ponchos en el mercado.", "Una", "los", "el"), s("Las nubes cubrieron un cerro.", "Las", "un"),
  s("Los pescadores sacaron unos peces de la red.", "Los", "unos", "la"), s("El viento apagó una vela.", "El", "una"), s("Unos niños cruzaron el puente.", "Unos", "el"),
  s("La luna iluminó las chacras.", "La", "las"), s("Un zorro cruzó la pampa.", "Un", "la"),
];

// --- TT. Adjetivos y adverbios -----------------------------------------------

const ADJ_KIND = sorter(["Cómo es", "Cuántos hay"], "El adjetivo en MAYÚSCULAS, ¿dice cómo es o cuántos hay?");
const KIND_OR_MANY: ChoiceItem[] = [
  ...["Subimos una cuesta EMPINADA.", "El río CAUDALOSO arrastró troncos.", "Probé una mazamorra DULCE.", "Vive en una casa ANTIGUA.", "Llevaba una manta ÁSPERA.", "Era una noche HELADA."].map((x) => ADJ_KIND(x, 0)),
  ...["Vinieron VARIOS vecinos.", "Quedan POCAS entradas.", "Leí CUATRO capítulos.", "Hay BASTANTES sillas.", "ALGUNOS alumnos faltaron.", "Tiene DOS hermanas."].map((x) => ADJ_KIND(x, 1)),
];
const ADJ_FOR_NOUN: ChoiceItem[] = [
  pt("¿Qué adjetivo describe a «sendero»?", "El sendero angosto bordeaba el precipicio.", "angosto", "bordeaba", "precipicio"), pt("¿Qué adjetivo describe a «tejedoras»?", "Las hábiles tejedoras terminaron la manta.", "hábiles", "manta", "terminaron"),
  pt("¿Qué adjetivo describe a «laguna»?", "Acampamos junto a una laguna cristalina.", "cristalina", "acampamos", "junto"), pt("¿Qué adjetivo describe a «viento»?", "Un viento helado bajaba del nevado.", "helado", "nevado", "bajaba"),
  pt("¿Qué adjetivo describe a «perro»?", "El perro, cansado, se echó en la sombra.", "cansado", "sombra", "echó"), pt("¿Qué adjetivo describe a «frutas»?", "En el puesto vendían frutas jugosas.", "jugosas", "puesto", "vendían"),
  pt("¿Qué adjetivo describe a «camino»?", "Tomamos un camino polvoriento hacia el pueblo.", "polvoriento", "pueblo", "tomamos"), pt("¿Qué adjetivo describe a «niñas»?", "Las niñas, curiosas, abrieron la caja.", "curiosas", "caja", "abrieron"),
];
const ADJECTIVES_IN = [
  s("El sendero angosto llevaba a una laguna cristalina.", "angosto", "cristalina"), s("Un viento helado movía las hojas secas.", "helado", "secas"), s("La anciana sabia contó una historia antigua.", "sabia", "antigua"),
  s("Compramos frutas jugosas y pan fresco.", "jugosas", "fresco"), s("El niño tímido abrazó a su perro fiel.", "tímido", "fiel"), s("Una nube oscura tapó el sol brillante.", "oscura", "brillante"),
  s("Las hábiles tejedoras usaron lana suave.", "hábiles", "suave"), s("El río caudaloso arrastró troncos enormes.", "caudaloso", "enormes"),
];
const ADJ_ORDER: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Es un buen amigo.", "Es un bueno amigo.", "Es un amigo buen."), w("¿Qué oración está bien escrita?", "Vivimos en una gran ciudad.", "Vivimos en una grande ciudad.", "Vivimos en una ciudad gran."),
  w("¿Qué oración está bien escrita?", "Hoy es el primer día de clases.", "Hoy es el primero día de clases.", "Hoy es el día primer de clases."), w("¿Qué oración está bien escrita?", "Tuvimos un mal día.", "Tuvimos un malo día.", "Tuvimos un día mal."),
  w("¿Qué oración está bien escrita?", "Compré tres panes calientes.", "Compré calientes tres panes.", "Compré panes tres calientes."), w("¿Qué oración está bien escrita?", "Vive en el tercer piso.", "Vive en el tercero piso.", "Vive en el piso tercer."),
  w("¿Qué oración está bien escrita?", "Tengo dos gatos negros.", "Tengo negros dos gatos.", "Tengo gatos dos negros."), w("¿Qué oración está bien escrita?", "No tengo ningún lápiz.", "No tengo ninguno lápiz.", "No tengo lápiz ningún."),
  w("¿Qué significa «un viejo amigo»?", "Un amigo de hace mucho tiempo", "Un amigo de mucha edad", "Un amigo que se fue"), w("¿Qué significa «un hombre pobre»?", "Un hombre con poco dinero", "Un hombre que da lástima", "Un hombre muy flaco"),
];
const ADV_KIND = sorter(["Cómo", "Cuándo", "Dónde"], "El adverbio en MAYÚSCULAS, ¿dice cómo, cuándo o dónde?");
const ADVERB_KIND: ChoiceItem[] = [
  ...["El puma avanzó SIGILOSAMENTE.", "Habla DESPACIO, por favor.", "Resolvió el problema FÁCILMENTE.", "Dormí MAL anoche."].map((x) => ADV_KIND(x, 0)),
  ...["ANOCHE cayó granizo.", "Llegaremos PRONTO.", "SIEMPRE desayuno avena.", "Te llamo LUEGO."].map((x) => ADV_KIND(x, 1)),
  ...["Mi casa queda CERCA.", "Busca ARRIBA, en el estante.", "Los niños juegan AFUERA.", "Ven ACÁ."].map((x) => ADV_KIND(x, 2)),
];
const ADVERBS_IN = [
  s("Anoche llovió fuertemente.", "Anoche", "fuertemente"), s("Mi abuelo camina despacio y siempre llega temprano.", "despacio", "siempre", "temprano"), s("Los niños juegan afuera.", "afuera"),
  s("Hoy cantaste muy bien.", "Hoy", "muy", "bien"), s("El bus pasa cerca.", "cerca"), s("Nunca había subido tan alto.", "Nunca", "tan", "alto"),
  s("Ayer buscamos arriba y abajo.", "Ayer", "arriba", "abajo"), s("Responde tranquilamente.", "tranquilamente"),
];
const RELATIVE_ADVERBS: ChoiceItem[] = [
  f("Este es el pueblo ___ nació mi abuela.", "donde", "cuando", "como"), f("Recuerdo el día ___ aprendí a nadar.", "cuando", "donde", "como"), f("Hazlo ___ te enseñé.", "como", "donde", "cuando"),
  f("La casa ___ vivimos tiene un patio.", "donde", "cuando", "como"), f("Fue en julio ___ nevó en la puna.", "cuando", "donde", "como"), f("Me gusta la manera ___ explica la maestra.", "como", "donde", "cuando"),
  f("Volvimos al río ___ pescamos el año pasado.", "donde", "como", "cuando"), f("Dibujé el parque tal ___ lo recordaba.", "como", "donde", "cuando"),
  f("Era de noche ___ llegamos al tambo.", "cuando", "donde", "como"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("El tren avanza ___.", "rápidamente", "rápida", "rápidos"), f("Es una niña muy ___.", "cuidadosa", "cuidadosamente", "cuidado"), f("Cerró la puerta ___.", "suavemente", "suavidad", "suaves"),
  f("El examen fue ___.", "fácil", "fácilmente", "facilidad"), f("Respondió ___ a todas las preguntas.", "correctamente", "correcta", "correctos"), f("Lleva una vida ___.", "tranquila", "tranquilamente", "tranquilidad"),
  f("Los alumnos escucharon ___.", "atentamente", "atención", "atenta"), f("Tiene una voz ___.", "dulce", "dulcemente", "dulzura"), f("Cantó ___ en el festival.", "bien", "buena", "bueno"),
  f("Es un ___ jugador.", "buen", "bien", "buenamente"),
];
const AA = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ...["Es un tren RÁPIDO.", "Tiene una voz ALTA.", "Fue un examen CLARO.", "Compró un pan DURO.", "Es una tarea FÁCIL.", "Vi un perro TRANQUILO."].map((x) => AA(x, 0)),
  ...["El tren corre RÁPIDO.", "Habla ALTO, que no te oigo.", "Explícalo CLARO.", "Trabaja DURO todo el día.", "Aprende FÁCILMENTE.", "Duerme TRANQUILAMENTE."].map((x) => AA(x, 1)),
];
const COMPARE_ADJ: ChoiceItem[] = [
  f("El Huascarán es ___ alto que el Misti.", "más", "tan", "muy"), f("Mi hermano es ___ alto como yo.", "tan", "más", "menos"), f("El caracol es ___ veloz que la liebre.", "menos", "tan", "muy"),
  f("Esta sopa está ___ que la de ayer.", "mejor", "bien", "buena"), f("Mi abuelo es ___ que mi papá.", "mayor", "más", "muy"), f("Hoy el clima está ___ que ayer.", "peor", "mal", "malo"),
  f("El Amazonas es el río ___ caudaloso del mundo.", "más", "tan", "muy"), f("Es la alumna ___ puntual del salón.", "más", "tan", "mucho"), f("Tu mochila pesa tanto ___ la mía.", "como", "que", "de"),
  f("Mi hermanita es ___ que yo: tiene cinco años.", "menor", "poco", "menos"),
];
const SUPERLATIVE: ChoiceItem[] = [
  w("¿Cómo se escribe el superlativo de «rico»?", "riquísimo", "ricísimo", "riquisimo"), w("¿Cómo se escribe el superlativo de «largo»?", "larguísimo", "largísimo", "larguisimo"), w("¿Cómo se escribe el superlativo de «feliz»?", "felicísimo", "felizísimo", "felisísimo"),
  w("¿Cómo se escribe el superlativo de «amable»?", "amabilísimo", "amablísimo", "amableísimo"), w("¿Cómo se escribe el superlativo de «blanco»?", "blanquísimo", "blancísimo", "blanquisimo"), w("¿Cómo se escribe el superlativo de «fácil»?", "facilísimo", "fácilísimo", "facilisimo"),
  w("¿Cómo se escribe el superlativo de «poco»?", "poquísimo", "pocísimo", "poquisimo"), w("¿Cómo se escribe el superlativo de «antiguo»?", "antiquísimo", "antiguísimo", "antigüisimo"), w("¿Cómo se escribe el superlativo de «veloz»?", "velocísimo", "velozísimo", "velosísimo"),
  w("¿Cómo se escribe el superlativo de «seco»?", "sequísimo", "secísimo", "sequisimo"),
];
const MORE_MOST: ChoiceItem[] = [
  f("De los tres hermanos, Raúl es ___ alto.", "el más", "más", "tan"), f("Esta es ___ película del año: me encantó.", "la mejor", "la más mejor", "mejor que"), f("Fue ___ día de mi vida: perdí mi mochila.", "el peor", "el más peor", "peor que"),
  f("El guepardo es ___ veloz que el león.", "más", "el más", "tan"), f("Mi abuela es ___ de la familia: tiene 90 años.", "la mayor", "la más mayor", "mayor que"), f("De todos los ríos, el Amazonas es ___ largo.", "el más", "más", "tan"),
  f("La hormiga es ___ pequeña que la abeja.", "más", "la más", "tan"), f("Soy ___ del salón: cumplo años en diciembre.", "el menor", "el más menor", "menor que"), f("Hoy tengo ___ tarea que ayer.", "más", "la más", "muy"),
  f("De las cuatro maquetas, la tuya es ___ creativa.", "la más", "más", "tan"),
];
const COMPARE_ADV: ChoiceItem[] = [
  f("El tren llega ___ rápido que el bus.", "más", "tan", "muy"), f("Hoy canté ___ que ayer.", "mejor", "más bien", "bueno"), f("Mi abuelo camina ___ despacio que yo.", "más", "tan", "mucho"),
  f("Ella dibuja tan bien ___ su mamá.", "como", "que", "de"), f("Hoy dormí ___ que anoche: tuve pesadillas.", "peor", "más mal", "malo"), f("Vivo ___ cerca de la escuela que tú.", "más", "tan", "muy"),
  f("Llegamos ___ temprano como pudimos.", "tan", "más", "muy"), f("De todos, Luis es quien corre ___ rápido.", "más", "tan", "mejor"), f("Ana lee ___ que su hermano: dos libros al mes.", "más", "tanto", "muy"),
  f("Habla ___ bajo, que el bebé duerme.", "más", "tan", "mejor"),
];

// --- UU. Preposiciones -------------------------------------------------------

const PREPS_IN = [
  s("Caminamos por el sendero hasta la laguna.", "por", "hasta"), s("El gato saltó desde el techo.", "desde"), s("Guardé las llaves en el cajón de la cocina.", "en", "de"),
  s("Viajamos con mis tíos hacia el norte.", "con", "hacia"), s("Dejé el libro sobre la mesa.", "sobre"), s("Trabajó sin descanso durante la cosecha.", "sin", "durante"),
  s("El puente pasa entre dos cerros.", "entre"), s("Hizo un regalo para su abuela.", "para"),
];
const PO = "¿Cuál es la preposición y su término (lo que va después)?";
const PREP_OBJECT: ChoiceItem[] = [
  pt(PO, "El cóndor planeaba sobre el cañón.", "sobre el cañón", "El cóndor", "planeaba sobre"), pt(PO, "Caminamos hasta la laguna.", "hasta la laguna", "Caminamos", "Caminamos hasta la"),
  pt(PO, "Mi tía teje con lana de alpaca.", "con lana de alpaca", "Mi tía teje", "teje con"), pt(PO, "El zorro salió de su madriguera.", "de su madriguera", "El zorro salió", "salió de"),
  pt(PO, "Dejaron las mochilas bajo el árbol.", "bajo el árbol", "Dejaron las mochilas", "las mochilas bajo"), pt(PO, "Remaron contra la corriente.", "contra la corriente", "Remaron", "Remaron contra"),
  pt(PO, "El bus pasa por la plaza.", "por la plaza", "El bus pasa", "pasa por"), pt(PO, "Escribí una carta para mi abuelo.", "para mi abuelo", "Escribí una carta", "una carta para"),
];
const PREP_PHRASE: ChoiceItem[] = [
  w("¿Cuál es una frase con preposición?", "hacia la cumbre", "la cumbre nevada", "sube despacio"), w("¿Cuál es una frase con preposición?", "sin zapatos", "zapatos nuevos", "corre veloz"),
  w("¿Cuál es una frase con preposición?", "entre los árboles", "los árboles altos", "crecen rápido"), w("¿Cuál es una frase con preposición?", "durante la noche", "la noche fría", "duerme poco"),
  w("¿Cuál es una frase con preposición?", "contra el viento", "el viento fuerte", "sopla mucho"), w("¿Cuál es una frase con preposición?", "según el mapa", "el mapa viejo", "mira bien"),
  w("¿Cuál es una frase con preposición?", "tras la puerta", "la puerta azul", "abre ya"), w("¿Cuál es una frase con preposición?", "ante el público", "el público feliz", "aplaude fuerte"),
];
const PREP_REVIEW: ChoiceItem[] = [
  f("El tren va ___ Cusco ___ Puno.", "de / a", "en / con", "por / sin"), f("Partió el pan ___ un cuchillo.", "con", "sin", "hacia"), f("Estudié ___ las cuatro ___ las seis.", "desde / hasta", "entre / por", "con / de"),
  f("Salió ___ paraguas y se mojó.", "sin", "con", "sobre"), f("___ el noticiero, mañana lloverá.", "Según", "Hacia", "Entre"), f("El gato se escondió ___ la cama.", "bajo", "hacia", "según"),
  f("Caminaron ___ el río para no perderse.", "hacia", "sin", "según"), f("Repartieron los panes ___ todos los niños.", "entre", "contra", "bajo"), f("No hables ___ la película.", "durante", "según", "hacia"),
  f("Este poncho es ___ lana de oveja.", "de", "a", "por"),
];

// --- VV. Conjunciones --------------------------------------------------------

const COORD_IN = [
  s("Compré pan y queso, pero olvidé la leche.", "y", "pero"), s("No tengo hambre ni sed.", "ni"), s("¿Vienes hoy o prefieres mañana?", "o"),
  s("Padre e hijo pescan juntos.", "e"), s("No es lunes, sino martes.", "sino"), s("Llovía, mas salimos igual.", "mas"),
  s("Trae siete u ocho sillas.", "u"), s("Corrió y saltó, pero no ganó.", "y", "pero"),
];
const SUBORD_IN = [
  s("No salimos porque llovía.", "porque"), s("Si terminas, jugamos.", "Si"), s("Aunque hacía frío, nadamos.", "Aunque"),
  s("Te aviso cuando llegue.", "cuando"), s("Leo mientras espero.", "mientras"), s("Como no viniste, empezamos.", "Como"),
  s("Estudia para que apruebes.", "para", "que"), s("Dijo que vendría.", "que"),
];

// --- WW. Contracciones -------------------------------------------------------

const AL_DEL: ChoiceItem[] = [
  f("Vamos ___ estadio el domingo.", "al", "a el", "del"), f("El techo ___ colegio es rojo.", "del", "de el", "al"), f("Vengo ___ mercado.", "del", "de el", "al"),
  f("Le di de comer ___ gato.", "al", "a el", "del"), f("Subimos ___ mirador.", "al", "a el", "del"), f("La carta es ___ director.", "del", "de el", "al"),
  f("Saludé ___ profesor de música.", "al", "a el", "del"), f("Esa bicicleta es de ___, no mía.", "él", "el", "del"), f("Llegamos ___ final del camino.", "al", "a el", "del"),
  f("El sonido ___ río me relaja.", "del", "de el", "al"),
];
const CONMIGO: ChoiceItem[] = [
  f("¿Quieres venir ___ al parque?", "conmigo", "con mí", "con yo"), f("Voy ___ a donde tú vayas.", "contigo", "con ti", "con tú"), f("El abuelo siempre lleva ___ una foto.", "consigo", "con sí", "con se"),
  f("Mi perro duerme ___ en mi cama.", "conmigo", "con mí", "con yo"), f("Quiero hablar ___ un momento.", "contigo", "con ti", "con tú"), f("Trajo ___ todos sus libros.", "consigo", "con sí", "con se"),
  f("Estudia ___ y te explico.", "conmigo", "con mí", "con yo"), f("¿Puedo sentarme ___?", "contigo", "con ti", "con tú"), f("Cuenta ___ para lo que necesites.", "conmigo", "con mí", "con yo"),
  f("No estoy molesto ___.", "contigo", "con ti", "con tú"),
];

// --- XX. Comas ---------------------------------------------------------------

const COMMA = "¿Qué oración tiene las comas bien puestas?";
const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "Compré papas, choclos, habas y ollucos.", "Compré papas choclos, habas y ollucos.", "Compré, papas, choclos, habas, y ollucos."), w(COMMA, "Vimos llamas, alpacas y vicuñas.", "Vimos llamas alpacas y vicuñas.", "Vimos llamas, alpacas, y, vicuñas."),
  w(COMMA, "Barrí, trapeé y sacudí los muebles.", "Barrí trapeé y sacudí los muebles.", "Barrí, trapeé y, sacudí los muebles."), w(COMMA, "El día estaba frío, gris y lluvioso.", "El día estaba frío gris y lluvioso.", "El día, estaba frío, gris y lluvioso."),
  w(COMMA, "Necesito lápiz, regla, compás y borrador.", "Necesito lápiz regla compás y borrador.", "Necesito, lápiz, regla, compás y borrador."), w(COMMA, "Visitamos Ica, Nasca y Paracas.", "Visitamos Ica Nasca y Paracas.", "Visitamos, Ica, Nasca, y Paracas."),
  w(COMMA, "Mi tía canta, baila y toca el cajón.", "Mi tía canta baila y toca el cajón.", "Mi tía, canta, baila y toca el cajón."), w(COMMA, "Lunes, miércoles y viernes hay taller.", "Lunes miércoles y viernes hay taller.", "Lunes, miércoles, y viernes, hay taller."),
];
const COMMA_DATES: ChoiceItem[] = [
  w("¿Qué fecha de carta está bien escrita?", "Lima, 28 de julio de 2025", "Lima 28 de julio, de 2025", "Lima, 28, de julio de 2025"), w("¿Qué fecha de carta está bien escrita?", "Cusco, 24 de junio de 2024", "Cusco 24, de junio de 2024", "Cusco, 24 de junio, de 2024"),
  w("¿Qué fecha está bien escrita?", "Viernes, 3 de octubre de 2025", "Viernes 3, de octubre de 2025", "Viernes, 3 de, octubre de 2025"), w("¿Qué fecha de carta está bien escrita?", "Arequipa, 15 de agosto de 2023", "Arequipa 15 de agosto, 2023", "Arequipa, 15, agosto de 2023"),
  w("¿Qué fecha está bien escrita?", "Martes, 1 de enero de 2030", "Martes 1, de enero, de 2030", "Martes, 1, de enero de 2030"), w("¿Qué fecha de carta está bien escrita?", "Tacna, 28 de agosto de 2026", "Tacna 28 de, agosto de 2026", "Tacna, 28 de agosto, 2026."),
  w("¿Dónde va la coma en la fecha de una carta?", "Entre el lugar y el día", "Entre el día y el mes", "Entre el mes y el año"), w("¿Dónde va la coma en «Sábado 9 de mayo de 2026»?", "Después de «Sábado»", "Después de «mayo»", "Después de «9»"),
];
const COMMA_PLACES: ChoiceItem[] = [
  w(COMMA, "Nací en Huaraz, Áncash.", "Nací en Huaraz Áncash.", "Nací, en Huaraz Áncash."), w(COMMA, "Viajamos a Ayacucho, Perú, en julio.", "Viajamos a Ayacucho Perú, en julio.", "Viajamos a, Ayacucho Perú en julio."),
  w(COMMA, "Mi abuela vive en Sicuani, Cusco.", "Mi abuela vive en, Sicuani Cusco.", "Mi abuela vive en Sicuani Cusco."), w(COMMA, "El tren sale de Juliaca, Puno.", "El tren sale, de Juliaca Puno.", "El tren sale de Juliaca Puno."),
  w(COMMA, "Conocí Quito, Ecuador, el año pasado.", "Conocí Quito Ecuador, el año pasado.", "Conocí, Quito Ecuador el año pasado."), w(COMMA, "La feria será en Tarma, Junín.", "La feria será en Tarma Junín.", "La feria, será en Tarma Junín."),
  w(COMMA, "Mi primo estudia en La Paz, Bolivia.", "Mi primo estudia en La Paz Bolivia.", "Mi primo estudia, en La Paz Bolivia."), w(COMMA, "Llegó una carta de Paita, Piura.", "Llegó una carta de Paita Piura.", "Llegó, una carta de Paita Piura."),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Mateo, alcánzame la regla.", "Mateo alcánzame la regla.", "Mateo alcánzame, la regla."), w(COMMA, "Gracias, abuela, por el desayuno.", "Gracias abuela por el desayuno.", "Gracias abuela, por el desayuno."),
  w(COMMA, "Niños, formen una fila.", "Niños formen una fila.", "Niños formen, una fila."), w(COMMA, "¿Me ayudas, Lucía?", "¿Me ayudas Lucía?", "¿Me, ayudas Lucía?"),
  w(COMMA, "Profesora, ya terminé.", "Profesora ya terminé.", "Profesora ya, terminé."), w(COMMA, "Ven aquí, Rocky.", "Ven aquí Rocky.", "Ven, aquí Rocky."),
  w(COMMA, "Señor, ¿qué hora es?", "Señor ¿qué hora es?", "Señor ¿qué, hora es?"), w(COMMA, "Escucha, hijo, lo que te digo.", "Escucha hijo lo que te digo.", "Escucha hijo, lo que te digo."),
];
const COMMA_INTRO: ChoiceItem[] = [
  w(COMMA, "Sin embargo, llegamos a tiempo.", "Sin embargo llegamos, a tiempo.", "Sin, embargo llegamos a tiempo."), w(COMMA, "Por último, apaga la luz.", "Por último apaga, la luz.", "Por, último apaga la luz."),
  w(COMMA, "Sí, quiero más chicha.", "Sí quiero, más chicha.", "Sí quiero más, chicha."), w(COMMA, "Después de almorzar, lavamos los platos.", "Después de almorzar lavamos, los platos.", "Después, de almorzar lavamos los platos."),
  w(COMMA, "En cambio, mi hermana prefiere el vóley.", "En cambio mi hermana, prefiere el vóley.", "En, cambio mi hermana prefiere el vóley."), w(COMMA, "Bueno, empecemos de nuevo.", "Bueno empecemos, de nuevo.", "Bueno empecemos de, nuevo."),
  w(COMMA, "Cuando sonó el timbre, salimos al patio.", "Cuando sonó, el timbre salimos al patio.", "Cuando sonó el timbre salimos, al patio."), w(COMMA, "Además, trae tu cuaderno.", "Además trae, tu cuaderno.", "Además trae tu, cuaderno."), w(COMMA, "Por ejemplo, la papa y el olluco.", "Por ejemplo la papa, y el olluco.", "Por, ejemplo la papa y el olluco."),
];

// --- YY. Mayúsculas ----------------------------------------------------------

const CAPS = "¿Qué oración usa bien las mayúsculas?";
const CAPS_NAMES: ChoiceItem[] = [
  w(CAPS, "Mi perro Sultán ladra mucho.", "Mi perro sultán ladra mucho.", "Mi Perro Sultán ladra mucho."), w(CAPS, "La doctora Ramos me atendió.", "La Doctora ramos me atendió.", "La doctora ramos me atendió."),
  w(CAPS, "Don Julio riega su chacra.", "don julio riega su chacra.", "Don julio riega su Chacra."), w(CAPS, "Mi gata se llama Pelusa.", "Mi gata se llama pelusa.", "Mi Gata se llama Pelusa."),
  w(CAPS, "El señor Quispe vende pan.", "El Señor quispe vende pan.", "El señor quispe vende Pan."), w(CAPS, "Ayer vino mi tía Carmen.", "Ayer vino mi Tía carmen.", "Ayer vino mi tía carmen."),
  w(CAPS, "La profesora Inés toca guitarra.", "La Profesora inés toca guitarra.", "La profesora inés toca Guitarra."), w(CAPS, "Invité a Mateo y a Valeria.", "Invité a mateo y a Valeria.", "Invité a Mateo y a valeria."),
];
const CAPS_DAYS: ChoiceItem[] = [
  w(CAPS, "El lunes empiezan las clases.", "El Lunes empiezan las clases.", "El lunes empiezan las Clases."), w(CAPS, "En julio celebramos Fiestas Patrias.", "En Julio celebramos fiestas patrias.", "En Julio celebramos Fiestas Patrias."),
  w(CAPS, "La Navidad es en diciembre.", "La navidad es en Diciembre.", "La Navidad es en Diciembre."), w(CAPS, "El sábado iremos al río.", "El Sábado iremos al río.", "El sábado iremos al Río."),
  w(CAPS, "Mi cumpleaños es en marzo.", "Mi cumpleaños es en Marzo.", "Mi Cumpleaños es en marzo."), w(CAPS, "En Semana Santa visitamos Ayacucho.", "En semana santa visitamos ayacucho.", "En Semana santa visitamos Ayacucho."),
  w(CAPS, "El Día de la Madre cae en mayo.", "El día de la madre cae en Mayo.", "El Día de la Madre cae en Mayo."), w(CAPS, "Los martes y jueves hay ensayo.", "Los Martes y Jueves hay ensayo.", "Los martes y Jueves hay ensayo."),
];
const CAPS_PLACES: ChoiceItem[] = [
  w(CAPS, "El río Marañón nace en los Andes.", "El Río marañón nace en los andes.", "El río marañón nace en los Andes."), w(CAPS, "Subimos al nevado Huascarán.", "Subimos al Nevado huascarán.", "Subimos al nevado huascarán."),
  w(CAPS, "El lago Titicaca está en Puno.", "El Lago titicaca está en puno.", "El lago titicaca está en Puno."), w(CAPS, "Vivo en el distrito de Miraflores.", "Vivo en el Distrito de miraflores.", "Vivo en el distrito de miraflores."),
  w(CAPS, "La cordillera de los Andes cruza el Perú.", "La Cordillera de los andes cruza el perú.", "La cordillera de los andes cruza el Perú."), w(CAPS, "El océano Pacífico baña la costa.", "El Océano pacífico baña la costa.", "El océano pacífico baña la Costa."),
  w(CAPS, "Viajamos a América del Sur.", "Viajamos a américa del sur.", "Viajamos a América Del sur."), w(CAPS, "La plaza San Martín está en Lima.", "La Plaza san martín está en lima.", "La plaza san Martín está en Lima."),
];
const CAPS_HISTORY: ChoiceItem[] = [
  w(CAPS, "La Independencia del Perú se proclamó en 1821.", "La independencia del perú se proclamó en 1821.", "La Independencia Del Perú Se proclamó en 1821."), w(CAPS, "Estudiamos la Edad Media.", "Estudiamos la edad media.", "Estudiamos La Edad media."),
  w(CAPS, "La Segunda Guerra Mundial terminó en 1945.", "La segunda guerra mundial terminó en 1945.", "La Segunda guerra Mundial terminó en 1945."), w(CAPS, "La Constitución Política protege nuestros derechos.", "La constitución política protege nuestros Derechos.", "La Constitución política Protege nuestros derechos."),
  w(CAPS, "En el Renacimiento hubo grandes pintores.", "En el renacimiento hubo grandes Pintores.", "En El Renacimiento hubo grandes pintores."), w(CAPS, "Los incas construyeron Machu Picchu.", "Los Incas construyeron machu picchu.", "Los incas construyeron Machu picchu."),
  w(CAPS, "Leímos el Acta de la Independencia.", "Leímos el acta de la independencia.", "Leímos El Acta de la independencia."), w(CAPS, "La batalla de Ayacucho fue en 1824.", "La Batalla de ayacucho fue en 1824.", "La batalla de ayacucho Fue en 1824."),
];
const CAPS_NATIONALITY: ChoiceItem[] = [
  w(CAPS, "Mi vecino es chileno.", "Mi vecino es Chileno.", "Mi Vecino es chileno."), w(CAPS, "Hablo quechua y castellano.", "Hablo Quechua y Castellano.", "Hablo quechua y Castellano."),
  w(CAPS, "La comida peruana es famosa.", "La comida Peruana es famosa.", "La Comida peruana es famosa."), w(CAPS, "Aprendo inglés los sábados.", "Aprendo Inglés los Sábados.", "Aprendo Inglés los sábados."),
  w(CAPS, "Llegaron turistas japoneses al Cusco.", "Llegaron turistas Japoneses al cusco.", "Llegaron Turistas japoneses al Cusco."), w(CAPS, "El pintor era de Italia: era italiano.", "El pintor era de italia: era Italiano.", "El pintor era de Italia: era Italiano."),
  w(CAPS, "Mi abuela habla aimara.", "Mi abuela habla Aimara.", "Mi Abuela habla aimara."), w(CAPS, "Leí un cuento ruso.", "Leí un cuento Ruso.", "Leí un Cuento ruso."),
];

// --- ZZ. Abreviaturas --------------------------------------------------------

const abbr = (list: [string, string][]) => pool(list.map(([name, a]) => [`¿Cuál es la abreviatura o el símbolo de «${name}»?`, a] as [string, string]), "p");
const DAY_ABBR: [string, string][] = [["lunes", "lun."], ["martes", "mar."], ["miércoles", "mié."], ["jueves", "jue."], ["viernes", "vie."], ["sábado", "sáb."], ["domingo", "dom."]];
const MONTH_ABBR: [string, string][] = [["enero", "ene."], ["febrero", "feb."], ["marzo", "mar."], ["abril", "abr."], ["junio", "jun."], ["julio", "jul."], ["agosto", "ago."], ["setiembre", "set."], ["octubre", "oct."], ["noviembre", "nov."], ["diciembre", "dic."]];
const TITLE_ABBR: [string, string][] = [["señor", "Sr."], ["señora", "Sra."], ["doctor", "Dr."], ["doctora", "Dra."], ["profesor", "Prof."], ["profesora", "Prof.ª"], ["ingeniero", "Ing."], ["usted", "Ud."], ["licenciado", "Lic."], ["don", "D."]];
const MASS_ABBR: [string, string][] = [["kilogramo", "kg"], ["gramo", "g"], ["litro", "l"], ["mililitro", "ml"], ["tonelada", "t"], ["miligramo", "mg"]];
const LENGTH_ABBR: [string, string][] = [["kilómetro", "km"], ["metro", "m"], ["centímetro", "cm"], ["milímetro", "mm"], ["metro cuadrado", "m²"], ["hectárea", "ha"]];
const STREET_ABBR: [string, string][] = [["avenida", "Av."], ["jirón", "Jr."], ["calle", "Ca."], ["pasaje", "Psje."], ["urbanización", "Urb."], ["manzana", "Mz."], ["lote", "Lt."]];
const ADDRESS_ABBR: [string, string][] = [["número", "n.º"], ["departamento", "dpto."], ["interior", "int."], ["sin número", "s/n"], ["código postal", "C. P."], ["teléfono", "tel."], ["página", "pág."]];

// --- AAA. Formato ------------------------------------------------------------

const LETTERS: ChoiceItem[] = [
  w("¿Qué saludo de carta está bien escrito?", "Estimada directora:", "Estimada directora,", "estimada Directora:"), w("¿Qué despedida de carta está bien escrita?", "Atentamente,", "atentamente:", "Atentamente:"),
  w("¿Qué saludo de carta está bien escrito?", "Querido tío Manuel:", "Querido Tío manuel,", "querido tío Manuel:"), w("¿Qué despedida de carta está bien escrita?", "Con mucho cariño,", "con mucho Cariño:", "Con Mucho Cariño"),
  w("¿Qué saludo de carta está bien escrito?", "Queridos abuelos:", "Queridos Abuelos,", "queridos abuelos:"), w("¿Qué despedida de carta está bien escrita?", "Saludos cordiales,", "saludos Cordiales:", "Saludos Cordiales"),
  w("¿Qué signo va después del saludo de una carta en castellano?", "Dos puntos (:)", "Una coma (,)", "Un punto (.)"), w("¿Con qué letra empieza el texto que sigue al saludo de una carta?", "Con mayúscula, en otra línea", "Con minúscula, en la misma línea", "Con minúscula, en otra línea"),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Av. Los Incas n.º 245, Cusco", "av. los incas n.º 245 Cusco", "Av. Los Incas, n.º, 245 Cusco"), w("¿Qué dirección está bien escrita?", "Jr. Unión 310, dpto. 4, Lima", "jr. unión 310 dpto. 4 Lima", "Jr. Unión, 310 dpto. 4, lima"),
  w("¿Qué dirección está bien escrita?", "Ca. Las Flores s/n, Tarma", "ca. las flores s/n tarma", "Ca. las Flores, s/n Tarma"), w("¿Qué dirección está bien escrita?", "Psje. San José 12, Ica", "psje. San josé 12 Ica", "Psje. san José, 12 ica"),
  w("¿Qué dirección está bien escrita?", "Urb. El Bosque, Mz. C, Lt. 8, Piura", "urb. El bosque Mz. C Lt. 8 piura", "Urb. el Bosque, mz. c, lt. 8, Piura"), w("¿Qué va primero al escribir una dirección?", "El nombre de la vía", "El nombre de la ciudad", "El número del departamento"),
  w("¿Qué dirección está bien escrita?", "Av. Grau 150, int. 2, Arequipa", "Av. grau 150 int. 2 arequipa", "av. Grau, 150, int. 2 Arequipa"), w("¿Cómo se indica que una casa no tiene número?", "s/n", "n.º 0", "sin n."),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título de libro está bien escrito?", "Los ríos profundos", "Los Ríos Profundos", "los ríos profundos"), w("¿Qué título de cuento está bien escrito?", "El caballero Carmelo", "El Caballero carmelo", "el caballero Carmelo"),
  w("¿Qué título de libro está bien escrito?", "El zorro de arriba y el zorro de abajo", "El Zorro De Arriba Y El Zorro De Abajo", "el zorro de arriba y el zorro de abajo"), w("¿Qué título de poema está bien escrito?", "Los heraldos negros", "Los Heraldos Negros", "los heraldos negros"),
  w("¿Qué título de cuento está bien escrito?", "Paco Yunque", "paco yunque", "Paco yunque"), w("¿Qué título de libro está bien escrito?", "Cuentos de la selva", "Cuentos De La Selva", "cuentos de la Selva"),
  w("¿Qué título de periódico está bien escrito?", "El Comercio", "el comercio", "El comercio"), w("En el título de un libro en castellano, ¿qué palabras llevan mayúscula?", "La primera y los nombres propios", "Todas las palabras", "Solo la última"),
];
const FORMAT_TITLES: ChoiceItem[] = [
  w("Al escribir a mano, ¿cómo se destaca el título de un libro?", "Se subraya.", "Se tacha.", "Se escribe todo en minúsculas."), w("En la computadora, ¿cómo se escribe el título de un libro?", "En cursiva", "En negrita", "Entre comillas dobles"),
  w("¿Cómo se escribe el título de un cuento que está dentro de un libro?", "Entre comillas", "En cursiva", "Subrayado dos veces"), w("¿Cómo se escribe el título de un poema?", "Entre comillas", "En cursiva", "Con mayúsculas"),
  w("¿Cómo se escribe el nombre de un periódico?", "En cursiva", "Subrayado", "Entre paréntesis"), w("¿Cómo se escribe el título de una canción?", "Entre comillas", "En cursiva", "En negrita"),
  w("¿Cómo se escribe el título de una película?", "En cursiva", "Tachado", "Entre corchetes"), w("¿Cómo se escribe el título de un capítulo?", "Entre comillas", "En cursiva", "Subrayado"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Cuál está bien escrito?", "Leí el cuento «El vuelo de los cóndores».", "Leí el cuento El Vuelo De Los Cóndores.", "Leí el cuento «el vuelo de los cóndores»."), w("¿Cuál está bien escrito?", "Cantamos «El cóndor pasa» en el coro.", "Cantamos El Cóndor Pasa en el coro.", "Cantamos «el Cóndor Pasa» en el coro."),
  w("¿Cuál está bien escrito?", "Recité el poema «Masa».", "Recité el poema masa.", "Recité el Poema «masa»."), w("¿Cuál está bien escrito?", "El capítulo «La llegada» es el más corto.", "El capítulo la llegada es el más corto.", "El Capítulo «la Llegada» es el más corto."),
  w("¿Cuál está bien escrito?", "Me gustó el cuento «Paco Yunque».", "Me gustó el cuento paco yunque.", "Me gustó el cuento «paco Yunque»."), w("¿Cuál está bien escrito?", "Aprendimos la canción «Mi Perú».", "Aprendimos la canción mi perú.", "Aprendimos la Canción «mi Perú»."),
  w("¿Cuál está bien escrito?", "El poema «Los heraldos negros» es de Vallejo.", "El poema Los Heraldos Negros es de vallejo.", "El poema «los Heraldos negros» es de Vallejo."), w("¿Cuál está bien escrito?", "Leímos el cuento «El sueño del pongo».", "Leímos el cuento El Sueño Del Pongo.", "Leímos el cuento «el sueño del Pongo»."),
];
const DIALOGUE: ChoiceItem[] = [
  w("¿Qué diálogo está bien escrito?", "—¿Vienes al río? —preguntó Tito.", "¿Vienes al río? preguntó Tito.", "—¿Vienes al río? — preguntó Tito"), w("¿Qué diálogo está bien escrito?", "—Tengo frío —dijo Ana.", "Tengo frío, —dijo Ana.", "— Tengo frío — dijo Ana."),
  w("¿Qué diálogo está bien escrito?", "—¡Corre! —gritó el arquero.", "¡Corre! —gritó el arquero.", "—¡Corre! gritó— el arquero."), w("¿Qué diálogo está bien escrito?", "—No sé —respondió—. Pregúntale a mamá.", "—No sé —respondió. Pregúntale a mamá.", "No sé —respondió—, pregúntale a mamá."),
  w("¿Qué diálogo está bien escrito?", "—Mañana hay examen —avisó la profesora.", "Mañana hay examen —avisó la profesora—", "—Mañana hay examen— avisó la profesora."), w("¿Con qué signo empieza lo que dice un personaje en un diálogo?", "Con una raya (—)", "Con un guion bajo (_)", "Con un paréntesis"),
  w("¿Qué diálogo está bien escrito?", "—Gracias, abuelo —susurró Killa.", "—Gracias abuelo— susurró Killa.", "Gracias, abuelo, —susurró Killa."), w("¿Qué diálogo está bien escrito?", "—¿Quién llegó? —quiso saber Leo.", "—¿Quién llegó?, —quiso saber Leo.", "¿—Quién llegó? —quiso saber Leo."),
];

export const ROWS: Row[] = [
  ["SS.1", "Usar el artículo correcto: el o la, un o una", (r) => choose(r, "¿Qué artículo va?", EL_UN)],
  ["SS.2", "Usar el artículo correcto: un, una, unos, unas, el, la, los, las", (r) => choose(r, "¿Qué artículo va?", ARTICLE_USE)],
  ["SS.3", "Identificar artículos", (r) => pickInSentence(r, "Selecciona los artículos de la oración.", ARTICLES_IN)],

  ["TT.1", "¿El adjetivo dice cómo es o cuántos hay?", (r) => choose(r, "", KIND_OR_MANY)],
  ["TT.2", "Identificar el adjetivo que describe al sustantivo", (r) => choose(r, "", ADJ_FOR_NOUN)],
  ["TT.3", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos (palabras que dicen cómo es algo).", ADJECTIVES_IN)],
  ["TT.4", "Ordenar los adjetivos: su lugar y sus formas cortas", (r) => choose(r, "", ADJ_ORDER)],
  ["TT.5", "¿El adverbio dice cómo, cuándo o dónde?", (r) => choose(r, "", ADVERB_KIND)],
  ["TT.6", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios (dicen cómo, cuándo, dónde o cuánto).", ADVERBS_IN)],
  ["TT.7", "Usar adverbios relativos: donde, cuando y como", (r) => choose(r, "Completa la oración.", RELATIVE_ADVERBS)],
  ["TT.8", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["TT.9", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],
  ["TT.10", "Usar adjetivos para comparar", (r) => choose(r, "Completa la comparación.", COMPARE_ADJ)],
  ["TT.11", "Escribir adjetivos que comparan: -ísimo", (r) => choose(r, "", SUPERLATIVE)],
  ["TT.12", "Usar adjetivos con «más» y «el más»", (r) => choose(r, "Completa la oración.", MORE_MOST)],
  ["TT.13", "Usar adverbios para comparar", (r) => choose(r, "Completa la comparación.", COMPARE_ADV)],

  ["UU.1", "Identificar preposiciones", (r) => pickInSentence(r, "Selecciona las preposiciones.", PREPS_IN)],
  ["UU.2", "Identificar las preposiciones y sus términos", (r) => choose(r, "", PREP_OBJECT)],
  ["UU.3", "Identificar frases con preposición", (r) => choose(r, "", PREP_PHRASE)],
  ["UU.4", "Preposiciones: repaso", (r) => choose(r, "Completa la oración.", PREP_REVIEW)],

  ["VV.1", "Identificar conjunciones coordinantes", (r) => pickInSentence(r, "Selecciona las conjunciones que unen (y, e, o, u, ni, pero, mas, sino).", COORD_IN)],
  ["VV.2", "Identificar conjunciones subordinantes", (r) => pickInSentence(r, "Selecciona las palabras que unen una idea con su causa, condición, momento o finalidad.", SUBORD_IN)],

  ["WW.1", "Contracciones: al y del", (r) => choose(r, "Completa la oración.", AL_DEL)],
  ["WW.2", "Contracciones: conmigo, contigo y consigo", (r) => choose(r, "Completa la oración.", CONMIGO)],

  ["XX.1", "Comas en una enumeración", (r) => choose(r, "", COMMA_SERIES)],
  ["XX.2", "Comas en las fechas", (r) => choose(r, "", COMMA_DATES)],
  ["XX.3", "Comas en los nombres de lugares", (r) => choose(r, "", COMMA_PLACES)],
  ["XX.4", "Comas con vocativos", (r) => choose(r, "", COMMA_ADDRESS)],
  ["XX.5", "Comas después de palabras y frases introductorias", (r) => choose(r, "", COMMA_INTRO)],
  ["XX.6", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_DATES, ...COMMA_PLACES, ...COMMA_ADDRESS, ...COMMA_INTRO])],

  ["YY.1", "Mayúscula en los nombres de personas y mascotas, y en los tratamientos", (r) => choose(r, "", CAPS_NAMES)],
  ["YY.2", "Días y meses con minúscula; festividades con mayúscula", (r) => choose(r, "", CAPS_DAYS)],
  ["YY.3", "Mayúscula en los nombres de lugares y accidentes geográficos", (r) => choose(r, "", CAPS_PLACES)],
  ["YY.4", "Mayúscula en los nombres de hechos históricos, épocas y documentos", (r) => choose(r, "", CAPS_HISTORY)],
  ["YY.5", "Gentilicios e idiomas: con minúscula", (r) => choose(r, "", CAPS_NATIONALITY)],
  ["YY.6", "Mayúsculas: repaso", (r) => choose(r, "", [...CAPS_NAMES, ...CAPS_DAYS, ...CAPS_PLACES, ...CAPS_HISTORY, ...CAPS_NATIONALITY])],

  ["ZZ.1", "Abreviar los días de la semana", (r) => choose(r, "", abbr(DAY_ABBR))],
  ["ZZ.2", "Abreviar los meses del año", (r) => choose(r, "", abbr(MONTH_ABBR))],
  ["ZZ.3", "Abreviar los tratamientos de las personas", (r) => choose(r, "", abbr(TITLE_ABBR))],
  ["ZZ.4", "Abreviar unidades de masa y de capacidad", (r) => choose(r, "", abbr(MASS_ABBR))],
  ["ZZ.5", "Abreviar unidades de longitud y de superficie", (r) => choose(r, "", abbr(LENGTH_ABBR))],
  ["ZZ.6", "Abreviar los nombres de las vías: avenida, jirón, calle", (r) => choose(r, "", abbr(STREET_ABBR))],
  ["ZZ.7", "Abreviar los datos de una dirección: número, departamento, interior", (r) => choose(r, "", abbr(ADDRESS_ABBR))],
  ["ZZ.8", "Abreviar vías y datos de una dirección: repaso", (r) => choose(r, "", abbr([...STREET_ABBR, ...ADDRESS_ABBR]))],

  ["AAA.1", "Saludos y despedidas de las cartas", (r) => choose(r, "", LETTERS)],
  ["AAA.2", "Dar formato a las direcciones", (r) => choose(r, "", ADDRESSES)],
  ["AAA.3", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],
  ["AAA.4", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["AAA.5", "Dar formato y poner mayúsculas a los títulos", (r) => choose(r, "", TITLES_BOTH)],
  ["AAA.6", "Puntuar los diálogos", (r) => choose(r, "", DIALOGUE)],
];
