import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pool, pt, s, sorter, w } from "./helpers";
import type { Row } from "./row";

// 3.° de Primaria · banco de gramática y ortografía (segunda parte):
// artículos (el agua, un águila), adjetivos y adverbios, preposiciones,
// conjunciones, al, del, conmigo, contigo y consigo, comas, mayúsculas (días,
// meses, gentilicios e idiomas con minúscula), abreviaturas de unidades del
// sistema métrico y de direcciones (Av., Jr., Ca., Psje., n.º, dpto., int.,
// s/n), formato de títulos y diálogos con raya (—).


const EL_UN: ChoiceItem[] = [
  f("___ agua del río está fría.", "El", "La", "Las"), f("Vimos ___ águila en el cielo.", "un", "una", "unas"), f("___ hacha del leñador es pesada.", "El", "La", "Los"),
  f("Tengo ___ hambre terrible.", "un", "una", "unos"), f("___ aula está limpia.", "El", "La", "Un la"), f("___ amiga de Rosa llegó.", "La", "El", "Un"),
  f("___ alma del pueblo es su música.", "El", "La", "Unas"), f("Compré ___ arpa pequeña.", "un", "una", "unos"), f("___ abeja picó a Luis.", "La", "El", "Los"),
];
const ARTICLE_USE: ChoiceItem[] = [
  f("Vi ___ perro en la calle; ___ perro era marrón.", "un / el", "el / un", "una / la"), f("___ niñas juegan en el patio.", "Las", "Los", "La"), f("Necesito ___ tijeras para cortar.", "unas", "unos", "un"),
  f("___ sol salió temprano.", "El", "Un", "La"), f("Mi tía compró ___ flores.", "unas", "unos", "una"), f("___ libros de la biblioteca son nuevos.", "Los", "Las", "El"),
  f("Había ___ vez un dragón.", "una", "un", "la"), f("Pásame ___ sal, por favor.", "la", "el", "un"), f("En el nido hay ___ huevos.", "unos", "unas", "un"),
];
const ARTICLES_IN = [
  s("El gato persigue a un ratón.", "El", "un"), s("Las niñas compraron unas galletas.", "Las", "unas"), s("Un perro ladra en la esquina.", "Un", "la"),
  s("Los alumnos leen el cuento.", "Los", "el"), s("La maestra trajo una lámina.", "La", "una"), s("Unos pájaros cantan sobre los cables.", "Unos", "los"), s("El panadero vende unos panes.", "El", "unos"),
];

const ADJ_KIND = sorter(["Cómo es", "Cuántos hay"], "El adjetivo en MAYÚSCULAS, ¿dice cómo es o cuántos hay?");
const KIND_OR_MANY: ChoiceItem[] = [
  ADJ_KIND("Tengo TRES lápices.", 1), ADJ_KIND("Tengo lápices ROJOS.", 0), ADJ_KIND("Hay MUCHAS nubes.", 1), ADJ_KIND("Hay nubes GRISES.", 0), ADJ_KIND("Vi un perro ENORME.", 0),
  ADJ_KIND("Vi VARIOS perros.", 1), ADJ_KIND("Comí POCAS galletas.", 1), ADJ_KIND("Comí galletas SALADAS.", 0), ADJ_KIND("El río CAUDALOSO ruge.", 0), ADJ_KIND("Llegaron DOCE invitados.", 1),
];
const ADJ_FOR_NOUN: ChoiceItem[] = [
  pt("¿Qué adjetivo describe a «casa»?", "La casa antigua tiene un jardín.", "antigua", "jardín", "tiene"), pt("¿Qué adjetivo describe a «perro»?", "El perro juguetón corre por el parque.", "juguetón", "corre", "parque"),
  pt("¿Qué adjetivo describe a «sopa»?", "Mi abuela preparó una sopa deliciosa.", "deliciosa", "preparó", "abuela"), pt("¿Qué adjetivo describe a «montañas»?", "Las altas montañas tienen nieve.", "altas", "nieve", "tienen"),
  pt("¿Qué adjetivo describe a «niño»?", "El niño valiente cruzó el puente.", "valiente", "cruzó", "puente"), pt("¿Qué adjetivo describe a «flores»?", "Compré flores frescas en el mercado.", "frescas", "compré", "mercado"),
  pt("¿Qué adjetivo describe a «mar»?", "El mar tranquilo brillaba al sol.", "tranquilo", "brillaba", "al sol"), pt("¿Qué adjetivo describe a «zapatos»?", "Mis zapatos nuevos me aprietan.", "nuevos", "aprietan", "mis"),
];
const ADJECTIVES_IN = [
  s("El gato negro duerme en la silla vieja.", "negro", "vieja"), s("Una niña alegre canta una canción bonita.", "alegre", "bonita"), s("El cielo azul tiene nubes blancas.", "azul", "blancas"),
  s("Compré un pan caliente.", "caliente"), s("El perro pequeño persigue una pelota roja.", "pequeño", "roja"), s("La sopa caliente tiene verduras frescas.", "caliente", "frescas"), s("Un viento fuerte movió las ramas secas.", "fuerte", "secas"),
];
const ADV_KIND = sorter(["Cómo", "Cuándo", "Dónde"], "El adverbio en MAYÚSCULAS, ¿dice cómo, cuándo o dónde?");
const ADVERB_KIND: ChoiceItem[] = [
  ADV_KIND("El caracol avanza LENTAMENTE.", 0), ADV_KIND("AYER fuimos al río.", 1), ADV_KIND("Deja la mochila AQUÍ.", 2), ADV_KIND("Canta BIEN.", 0), ADV_KIND("Llegaré MAÑANA.", 1),
  ADV_KIND("El gato está ARRIBA.", 2), ADV_KIND("Habla DESPACIO.", 0), ADV_KIND("SIEMPRE desayuno fruta.", 1), ADV_KIND("Mis primos viven LEJOS.", 2), ADV_KIND("Corrió RÁPIDAMENTE.", 0),
  ADV_KIND("Te llamo LUEGO.", 1), ADV_KIND("Juegan AFUERA.", 2),
];
const ADVERBS_IN = [
  s("Ayer llegué tarde.", "Ayer", "tarde"), s("El tren pasó rápidamente.", "rápidamente"), s("Mi abuela vive cerca.", "cerca"), s("Hoy comimos bien.", "Hoy", "bien"),
  s("El bebé duerme tranquilamente arriba.", "tranquilamente", "arriba"), s("Siempre camino despacio.", "Siempre", "despacio"), s("Mañana jugaremos afuera.", "Mañana", "afuera"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("Ana canta muy ___.", "bien", "buena", "bueno"), f("Es un ___ jugador.", "buen", "bien", "buenamente"), f("El tren es ___.", "rápido", "rápidamente", "rápida"),
  f("El tren avanza ___.", "rápidamente", "rápida", "rapidísimas"), f("La tortuga es ___.", "lenta", "lentamente", "lento"), f("Habla ___, por favor.", "claramente", "clara", "claridades"),
  f("Tu letra es muy ___.", "clara", "claramente", "claro"), f("Hoy me siento ___.", "mal", "malo", "mala"), f("Resolvió el problema ___.", "fácilmente", "fácil ella", "facilidad"),
];
const ADJ_ADV = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ADJ_ADV("El niño es ALEGRE.", 0), ADJ_ADV("El niño canta ALEGREMENTE.", 1), ADJ_ADV("Llegó TARDE.", 1), ADJ_ADV("Es una calle TRANQUILA.", 0), ADJ_ADV("Duerme TRANQUILAMENTE.", 1),
  ADJ_ADV("El examen fue FÁCIL.", 0), ADJ_ADV("Lo resolvió FÁCILMENTE.", 1), ADJ_ADV("Vive CERCA.", 1), ADJ_ADV("Tengo un perro FIEL.", 0), ADJ_ADV("Juega BIEN.", 1),
  ADJ_ADV("Es un BUEN amigo.", 0), ADJ_ADV("La sopa está CALIENTE.", 0),
];
const COMPARE_ADJ: ChoiceItem[] = [
  f("El elefante es ___ grande que el ratón.", "más", "tan", "menos"), f("Mi hermano es ___ alto como yo.", "tan", "más", "menos"), f("El caracol es ___ rápido que la liebre.", "menos", "más", "tan"),
  f("Este helado es ___ que el de ayer.", "mejor", "bien", "más mejor"), f("Mi nota fue ___ que la tuya.", "peor", "mal", "más peor"), f("El Huascarán es la montaña ___ alta del Perú.", "más", "muy", "tan"),
  f("Mi abuelo es ___ que mi papá.", "mayor", "más mayor", "muy"), f("Mi hermanita es ___ que yo.", "menor", "más menor", "menos"), f("Un león es ___ fuerte como un tigre.", "tan", "más", "tanto"),
];
const SUPERLATIVE: ChoiceItem[] = [
  pt("¿Cuál está bien escrita?", "rico → muy rico", "riquísimo", "ricísimo", "rikísimo"), pt("¿Cuál está bien escrita?", "feliz → muy feliz", "felicísimo", "felizísimo", "felisísimo"),
  pt("¿Cuál está bien escrita?", "largo → muy largo", "larguísimo", "largísimo", "larjísimo"), pt("¿Cuál está bien escrita?", "grande → muy grande", "grandísimo", "grandisimo", "grandícimo"),
  pt("¿Cuál está bien escrita?", "poco → muy poco", "poquísimo", "pocísimo", "pokísimo"), pt("¿Cuál está bien escrita?", "amable → muy amable", "amabilísimo", "amablísimo", "amabelísimo"),
  pt("¿Cuál está bien escrita?", "blanco → muy blanco", "blanquísimo", "blancísimo", "blankísimo"), pt("¿Cuál está bien escrita?", "fácil → muy fácil", "facilísimo", "fácilísimo", "fasilísimo"),
];
const COMPARE_ADV: ChoiceItem[] = [
  f("Ana corre ___ rápido que Luis.", "más", "tan", "muy"), f("Hoy llegué ___ temprano como ayer.", "tan", "más", "menos"), f("Mi hermano canta ___ que yo.", "mejor", "bien", "más mejor"),
  f("Con lluvia se maneja ___ que con sol.", "peor", "mal", "más peor"), f("El caracol avanza ___ lento que la hormiga.", "más", "tan", "tanto"), f("Hoy dormí ___ que ayer.", "menos", "menor", "tan"),
  f("Habla ___ despacio, por favor.", "más", "tan", "mejor"), f("Vivo ___ cerca de la escuela como tú.", "tan", "más", "tanto"),
];

const PREPS_IN = [
  s("El gato está sobre la mesa.", "sobre"), s("Voy a la escuela con mi hermana.", "a", "con"), s("El regalo es para ti.", "para"), s("Caminamos por el parque hasta el río.", "por", "hasta"),
  s("El libro de Ana está en la mochila.", "de", "en"), s("Salí sin paraguas.", "sin"), s("Vengo desde mi casa.", "desde"), s("La pelota rodó hacia el arco.", "hacia"),
];
const PREP_OBJECT: ChoiceItem[] = [
  pt("¿Cuál es la preposición y su término (lo que va después)?", "El gato duerme sobre el sillón.", "sobre el sillón", "El gato", "El gato duerme sobre"), pt("¿Cuál es la preposición y su término (lo que va después)?", "Fuimos al cine con mis primos.", "con mis primos", "Fuimos al", "Fuimos al cine con"),
  pt("¿Cuál es la preposición y su término (lo que va después)?", "Guardé el lápiz en la cartuchera.", "en la cartuchera", "Guardé el lápiz en la", "lápiz en"), pt("¿Cuál es la preposición y su término (lo que va después)?", "Este dibujo es para mi mamá.", "para mi mamá", "Este dibujo", "Este dibujo es para"),
  pt("¿Cuál es la preposición y su término (lo que va después)?", "El perro corrió hacia la puerta.", "hacia la puerta", "El perro", "El perro corrió hacia"), pt("¿Cuál es la preposición y su término (lo que va después)?", "Vivo cerca de la plaza.", "de la plaza", "Vivo cerca", "cerca de"),
  pt("¿Cuál es la preposición y su término (lo que va después)?", "Salimos sin las casacas.", "sin las casacas", "Salimos sin las", "las casacas"),
];
const PREP_PHRASE: ChoiceItem[] = [
  w("¿Cuál es una frase con preposición?", "debajo de la cama", "la cama grande y nueva", "duerme mucho"), w("¿Cuál es una frase con preposición?", "con mis amigos", "mis amigos nuevos", "juegan fútbol"),
  w("¿Cuál es una frase con preposición?", "desde la ventana", "la ventana rota", "mira el cielo"), w("¿Cuál es una frase con preposición?", "por el camino", "el camino largo", "camina lento"),
  w("¿Cuál es una frase con preposición?", "sin azúcar", "azúcar blanca", "toma café"), w("¿Cuál es una frase con preposición?", "hasta mañana", "mañana temprano", "llega tarde"),
  w("¿Cuál es una frase con preposición?", "entre los árboles", "los árboles altos", "crecen bien"), w("¿Cuál es una frase con preposición?", "para la fiesta", "la fiesta alegre", "bailan todos"),
];
const PREP_REVIEW: ChoiceItem[] = [
  f("El avión vuela ___ las nubes.", "sobre", "sin", "desde hace"), f("Voy ___ la escuela caminando.", "a", "de", "en"), f("Tomo el té ___ azúcar.", "sin", "hacia", "entre"),
  f("El regalo es ___ mi abuela.", "para", "desde", "sobre"), f("Vengo ___ el mercado.", "desde", "sin", "para"), f("El río pasa ___ dos cerros.", "entre", "desde", "a"),
  f("Estudio ___ mi prima.", "con", "hacia", "desde"), f("Caminamos ___ la plaza.", "hacia", "sin", "de"), f("Te espero ___ las cinco.", "hasta", "entre", "con"),
];

const COORD_IN = [
  s("Ana y Luis cantan.", "y"), s("¿Quieres té o café?", "o"), s("Estudié, pero no aprobé.", "pero"), s("No come ni duerme.", "ni"),
  s("No es azul, sino verde.", "sino"), s("Padre e hijo viajan.", "e"), s("Llovía, pero salimos y jugamos.", "pero", "y"), s("¿Vienes o te quedas?", "o"),
];
const SUBORD_IN = [
  s("No salí porque llovía.", "porque"), s("Te llamo cuando llegue.", "cuando"), s("Si estudias, aprobarás.", "Si"), s("Fui aunque estaba cansado.", "aunque"),
  s("Leo mientras espero.", "mientras"), s("Come para que crezcas.", "para", "que"), s("Avísame cuando termines porque quiero verlo.", "cuando", "porque"),
];

const AL_DEL: ChoiceItem[] = [
  f("Vamos ___ parque.", "al", "a el", "del"), f("Vengo ___ mercado.", "del", "de el", "al"), f("Le di el libro ___ maestro.", "al", "a el", "del"),
  f("La puerta ___ salón está abierta.", "del", "de el", "al"), f("Subimos ___ cerro.", "al", "a el", "del"), f("Es el perro ___ vecino.", "del", "de el", "al"),
  f("Viajaremos ___ Cusco.", "al", "a el", "a"), f("Salimos ___ cine a las ocho.", "del", "de el", "al"), f("Llegué ___ colegio temprano.", "al", "a el", "del"),
];
const CONMIGO: ChoiceItem[] = [
  f("¿Quieres venir ___? (con + yo)", "conmigo", "con mí", "con yo"), f("Iré ___ al parque. (con + tú)", "contigo", "con ti", "con tú"), f("Trajo su lonchera ___. (con + él mismo)", "consigo", "con sí", "con él mismo sí"),
  f("Mi perro siempre está ___. (con + yo)", "conmigo", "con mí", "con yo"), f("Quiero jugar ___. (con + tú)", "contigo", "con ti", "con tú"), f("Estudia ___ esta tarde. (con + yo)", "conmigo", "con mí", "con migo"),
  f("¿Puedo sentarme ___? (con + tú)", "contigo", "con ti", "con tigo"), f("Lleva siempre un paraguas ___. (con + ella misma)", "consigo", "con sí", "con sigo"),
];

const COMMA = "¿Qué oración usa bien las comas?";
const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "Compré pan, queso, leche y huevos.", "Compré pan queso leche y huevos.", "Compré, pan, queso, leche, y huevos."), w(COMMA, "En el zoológico vi monos, loros y tortugas.", "En el zoológico vi monos loros y tortugas.", "En el zoológico vi, monos, loros, y tortugas."),
  w(COMMA, "Mi mochila tiene lápices, cuadernos y una regla.", "Mi mochila tiene lápices cuadernos y una regla.", "Mi mochila tiene, lápices, cuadernos y, una regla."), w(COMMA, "Ana, Luis y Rosa llegaron temprano.", "Ana Luis y Rosa llegaron temprano.", "Ana, Luis, y, Rosa llegaron temprano."),
  w(COMMA, "Me gusta correr, nadar y bailar.", "Me gusta correr nadar y bailar.", "Me gusta, correr, nadar y, bailar."), w(COMMA, "El sancochado lleva carne, papa, choclo y zapallo.", "El sancochado lleva carne papa choclo y zapallo.", "El sancochado lleva, carne, papa, choclo, y zapallo."),
];
const COMMA_DATES: ChoiceItem[] = [
  w("¿Qué fecha está bien escrita?", "Lima, 28 de julio de 2025", "Lima 28 de julio, de 2025", "Lima, 28, de julio de 2025"), w("¿Qué fecha está bien escrita?", "Cusco, 24 de junio de 2024", "Cusco 24, de junio de 2024", "Cusco, 24 de junio, de, 2024"),
  w("¿Qué fecha está bien escrita?", "Martes, 3 de marzo de 2026", "Martes 3, de marzo de 2026", "Martes, 3, de marzo, de 2026"), w("¿Qué fecha está bien escrita?", "Piura, 1 de enero de 2025", "Piura 1 de enero, de 2025", "Piura, 1, de enero de 2025"),
  w("¿Qué fecha está bien escrita?", "Viernes, 12 de octubre de 2025", "Viernes 12, de octubre de 2025", "Viernes, 12 de, octubre de 2025"), w("¿Qué fecha está bien escrita?", "Tacna, 28 de agosto de 2024", "Tacna 28 de agosto de, 2024", "Tacna, 28, de agosto, de 2024"),
];
const COMMA_PLACES: ChoiceItem[] = [
  w(COMMA, "Mi tía vive en Arequipa, Perú.", "Mi tía vive en Arequipa Perú.", "Mi tía vive, en Arequipa Perú."), w(COMMA, "Nací en Trujillo, La Libertad.", "Nací en Trujillo La Libertad.", "Nací, en Trujillo La Libertad."),
  w(COMMA, "Viajamos a Quito, Ecuador.", "Viajamos a Quito Ecuador.", "Viajamos, a Quito Ecuador."), w(COMMA, "El concurso será en Puno, Perú.", "El concurso será en Puno Perú.", "El concurso, será en Puno Perú."),
  w(COMMA, "Mi abuelo es de Huaraz, Áncash.", "Mi abuelo es de Huaraz Áncash.", "Mi abuelo es, de Huaraz Áncash."), w(COMMA, "Llegó una carta de Bogotá, Colombia.", "Llegó una carta de Bogotá Colombia.", "Llegó una carta, de Bogotá Colombia."),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Mamá, ¿puedo salir a jugar?", "Mamá ¿puedo salir a jugar?", "Mamá ¿puedo, salir a jugar?"), w(COMMA, "Sí, me gusta el helado.", "Sí me gusta el helado.", "Sí me gusta, el helado."),
  w(COMMA, "Niños, guarden sus cuadernos.", "Niños guarden sus cuadernos.", "Niños guarden, sus cuadernos."), w(COMMA, "No, gracias, ya comí.", "No gracias ya comí.", "No gracias ya, comí."),
  w(COMMA, "Luis, pásame la pelota.", "Luis pásame la pelota.", "Luis pásame, la pelota."), w(COMMA, "Bueno, empecemos la clase.", "Bueno empecemos la clase.", "Bueno empecemos, la clase."),
  w(COMMA, "Gracias, abuela, por la torta.", "Gracias abuela por la torta.", "Gracias abuela, por la torta."), w(COMMA, "Primero, lávate las manos.", "Primero lávate, las manos.", "Primero lávate las, manos."),
];

const CAPS = "¿Cuál está bien escrita?";
const CAPS_NAMES: ChoiceItem[] = [
  w(CAPS, "Mi perro Toby juega con Lucía.", "Mi perro toby juega con Lucía.", "Mi Perro Toby juega con lucía."), w(CAPS, "La doctora Ramos atiende hoy.", "La Doctora ramos atiende hoy.", "La doctora ramos atiende hoy."),
  w(CAPS, "El señor Quispe vende pan.", "El Señor quispe vende pan.", "El señor quispe vende pan."), w(CAPS, "Visité a la Sra. Díaz.", "Visité a la sra. Díaz.", "Visité a la Sra. díaz."),
  w(CAPS, "Mi gata Mishi duerme con Pablo.", "Mi gata mishi duerme con Pablo.", "Mi Gata Mishi duerme con pablo."), w(CAPS, "El profesor Vargas enseña música.", "El Profesor vargas enseña música.", "El profesor vargas enseña música."),
  w(CAPS, "Hablé con el Dr. Salas.", "Hablé con el dr. Salas.", "Hablé con el Dr. salas."),
];
const CAPS_DAYS: ChoiceItem[] = [
  w(CAPS, "El lunes empieza la escuela.", "El Lunes empieza la escuela.", "el lunes empieza la Escuela."), w(CAPS, "Mi cumpleaños es en marzo.", "Mi cumpleaños es en Marzo.", "Mi Cumpleaños es en marzo."),
  w(CAPS, "En Navidad cenamos en familia.", "En navidad cenamos en familia.", "En Navidad cenamos en Familia."), w(CAPS, "El viernes hay feria.", "El Viernes hay feria.", "El viernes hay Feria."),
  w(CAPS, "Celebramos Fiestas Patrias en julio.", "Celebramos fiestas patrias en Julio.", "Celebramos Fiestas Patrias en Julio."), w(CAPS, "En diciembre llega el Año Nuevo.", "En Diciembre llega el año nuevo.", "En diciembre llega el año nuevo."),
  w(CAPS, "El sábado es el Día de la Madre.", "El Sábado es el día de la madre.", "El sábado es el día de la Madre."),
];
const CAPS_PLACES: ChoiceItem[] = [
  w(CAPS, "El río Amazonas es muy largo.", "El Río amazonas es muy largo.", "El río amazonas es muy largo."), w(CAPS, "Viajamos al lago Titicaca.", "Viajamos al Lago titicaca.", "Viajamos al lago titicaca."),
  w(CAPS, "Lima es la capital del Perú.", "lima es la capital del Perú.", "Lima es la Capital del perú."), w(CAPS, "La cordillera de los Andes cruza Sudamérica.", "La Cordillera de los andes cruza Sudamérica.", "La cordillera de los andes cruza sudamérica."),
  w(CAPS, "El océano Pacífico baña la costa.", "El Océano pacífico baña la costa.", "El océano pacífico baña la Costa."), w(CAPS, "Subimos al nevado Huascarán.", "Subimos al Nevado huascarán.", "Subimos al nevado huascarán."),
  w(CAPS, "Vivo en la ciudad de Ayacucho.", "Vivo en la Ciudad de ayacucho.", "Vivo en la ciudad de ayacucho."),
];
const CAPS_NATIONALITY: ChoiceItem[] = [
  w(CAPS, "Mi vecino es chileno y habla inglés.", "Mi vecino es Chileno y habla Inglés.", "Mi vecino es chileno y habla Inglés."), w(CAPS, "La comida peruana es deliciosa.", "La comida Peruana es deliciosa.", "La Comida peruana es deliciosa."),
  w(CAPS, "Estudio quechua y castellano.", "Estudio Quechua y Castellano.", "Estudio quechua y Castellano."), w(CAPS, "El equipo brasileño ganó.", "El equipo Brasileño ganó.", "El Equipo brasileño ganó."),
  w(CAPS, "Mi tía vive en Brasil y habla portugués.", "Mi tía vive en brasil y habla portugués.", "Mi tía vive en Brasil y habla Portugués."), w(CAPS, "Leí un cuento japonés.", "Leí un cuento Japonés.", "Leí un Cuento japonés."),
  w(CAPS, "Los cusqueños celebran el Inti Raymi.", "Los Cusqueños celebran el inti raymi.", "Los Cusqueños celebran el Inti Raymi."),
];

const DAY_ABBR: [string, string][] = [["lunes", "lun."], ["martes", "mart."], ["miércoles", "miérc."], ["jueves", "juev."], ["viernes", "vier."], ["sábado", "sáb."], ["domingo", "dom."]];
const MONTH_ABBR: [string, string][] = [["enero", "en."], ["febrero", "febr."], ["marzo", "mzo."], ["abril", "abr."], ["agosto", "ag."], ["setiembre", "set."], ["octubre", "oct."], ["noviembre", "nov."], ["diciembre", "dic."]];
const TITLE_ABBR: [string, string][] = [["señor", "Sr."], ["señora", "Sra."], ["doctor", "Dr."], ["doctora", "Dra."], ["profesor", "Prof."], ["usted", "Ud."], ["ustedes", "Uds."], ["licenciado", "Lic."], ["ingeniero", "Ing."], ["señorita", "Srta."]];
const MASS_ABBR: [string, string][] = [["kilogramo", "kg"], ["gramo", "g"], ["litro", "l"], ["mililitro", "ml"], ["tonelada", "t"], ["miligramo", "mg"]];
const LENGTH_ABBR: [string, string][] = [["kilómetro", "km"], ["metro", "m"], ["centímetro", "cm"], ["milímetro", "mm"], ["decímetro", "dm"]];
const STREET_ABBR: [string, string][] = [["avenida", "Av."], ["jirón", "Jr."], ["calle", "Ca."], ["pasaje", "Psje."], ["urbanización", "Urb."], ["manzana", "Mz."], ["lote", "Lt."]];
const ADDRESS_ABBR: [string, string][] = [["número", "n.º"], ["departamento", "dpto."], ["interior", "int."], ["sin número", "s/n"], ["código postal", "C. P."], ["izquierda", "izq."], ["derecha", "dcha."]];
const abbr = (list: [string, string][]) => pool(list.map(([name, a]) => [`¿Cuál es la abreviatura o el símbolo de «${name}»?`, a] as [string, string]), "p");

const LETTERS: ChoiceItem[] = [
  w("¿Qué saludo de carta está bien escrito?", "Querida abuela:", "Querida abuela,", "querida Abuela:"), w("¿Qué despedida de carta está bien escrita?", "Con cariño,", "con Cariño", "Con cariño:"),
  w("¿Qué saludo de carta está bien escrito?", "Estimado profesor Ruiz:", "Estimado Profesor ruiz,", "estimado profesor Ruiz:"), w("¿Qué despedida de carta está bien escrita?", "Un abrazo,", "un Abrazo:", "Un Abrazo"),
  w("¿Qué saludo de carta está bien escrito?", "Hola, Mateo:", "Hola Mateo,", "hola, mateo:"), w("¿Qué despedida de carta está bien escrita?", "Hasta pronto,", "hasta Pronto:", "Hasta Pronto"),
  w("¿Qué va después del saludo de una carta en castellano?", "Dos puntos (:)", "Una coma (,)", "Un punto y coma (;)"),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Av. Los Olivos 245, Lima", "av. los olivos 245 Lima", "Av. Los Olivos, 245 Lima,"), w("¿Qué dirección está bien escrita?", "Jr. Unión 120, Cusco", "jr. unión 120 Cusco", "Jr. Unión, 120 Cusco,"),
  w("¿Qué dirección está bien escrita?", "Ca. Las Flores 38, Piura", "ca. las flores 38 piura", "Ca. Las Flores, 38 Piura,"), w("¿Qué dirección está bien escrita?", "Psje. San Martín 15, dpto. 3", "psje. san martín 15 Dpto 3", "Psje. San Martín, 15 dpto, 3"),
  w("¿Qué dirección está bien escrita?", "Av. Grau s/n, Tacna", "av. grau S/N tacna", "Av. Grau, s/n Tacna,"), w("¿Qué dirección está bien escrita?", "Urb. El Sol, Mz. B, Lt. 4", "urb. el sol mz. b lt. 4", "Urb. El Sol Mz, B Lt, 4"),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título de libro está bien escrito?", "El zorro y el cóndor", "El Zorro Y El Cóndor", "el zorro y el cóndor"), w("¿Qué título de libro está bien escrito?", "Cuentos de la selva", "Cuentos De La Selva", "cuentos de la Selva"),
  w("¿Qué título de libro está bien escrito?", "Viaje al centro de la Tierra", "Viaje Al Centro De La Tierra", "viaje al centro de la tierra"), w("¿Qué título de libro está bien escrito?", "Las aventuras de Pinocho", "Las Aventuras De Pinocho", "las aventuras de pinocho"),
  w("¿Qué título de libro está bien escrito?", "La vuelta al mundo en ochenta días", "La Vuelta Al Mundo En Ochenta Días", "la vuelta al Mundo en ochenta días"), w("¿Qué título de libro está bien escrito?", "Leyendas del Perú", "Leyendas Del Perú", "leyendas del perú"),
  w("¿Qué título de libro está bien escrito?", "El principito", "El Principito de", "el Principito"),
];
const TITLE_FORMAT = sorter(["En cursiva (o subrayado, si es a mano)", "Entre comillas"], "¿Cómo se destaca este título dentro de un texto?");
const FORMAT_TITLES: ChoiceItem[] = [
  TITLE_FORMAT("El título de un LIBRO: Cuentos de la selva", 0), TITLE_FORMAT("El título de un POEMA dentro de un libro: Los heraldos negros", 1), TITLE_FORMAT("El título de una PELÍCULA: Coco", 0),
  TITLE_FORMAT("El título de una CANCIÓN: El cóndor pasa", 1), TITLE_FORMAT("El título de un PERIÓDICO: El Comercio", 0), TITLE_FORMAT("El título de un CUENTO dentro de un libro: El gato con botas", 1),
  TITLE_FORMAT("El título de una REVISTA: Urbanito", 0), TITLE_FORMAT("El título de un ARTÍCULO de periódico: Llega el invierno", 1), TITLE_FORMAT("El título de un CAPÍTULO de un libro: La gran tormenta", 1),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Qué oración escribe bien el título?", "Leí el cuento «El gato con botas».", "Leí el cuento «El Gato Con Botas».", "Leí el cuento el gato con botas."), w("¿Qué oración escribe bien el título?", "Cantamos «El cóndor pasa».", "Cantamos «El Cóndor Pasa».", "Cantamos el Cóndor pasa."),
  w("¿Qué oración escribe bien el título?", "Mi poema favorito es «La niña de la lámpara azul».", "Mi poema favorito es «La Niña De La Lámpara Azul».", "Mi poema favorito es la niña de la Lámpara azul."), w("¿Qué oración escribe bien el título?", "Aprendimos la canción «Mi Perú».", "Aprendimos la canción «mi perú».", "Aprendimos la canción Mi perú."),
  w("¿Qué oración escribe bien el título?", "El capítulo se llama «Un viaje inesperado».", "El capítulo se llama «Un Viaje Inesperado».", "El capítulo se llama un Viaje inesperado."), w("¿Qué oración escribe bien el título?", "Recité «Los tres cerditos» en clase.", "Recité «Los Tres Cerditos» en clase.", "Recité los Tres cerditos en clase."),
];
const DIALOGUE: ChoiceItem[] = [
  w("¿Qué diálogo está bien escrito?", "—¿Vienes al parque? —preguntó Ana.", "¿Vienes al parque? preguntó Ana.", "—¿Vienes al parque? preguntó— Ana."), w("¿Qué diálogo está bien escrito?", "—Tengo hambre —dijo Luis.", "Tengo hambre dijo —Luis.", "—Tengo hambre dijo Luis—."),
  w("¿Qué diálogo está bien escrito?", "—¡Cuidado! —gritó el bombero.", "¡Cuidado! gritó —el bombero.", "—¡Cuidado! gritó el bombero."), w("¿Qué diálogo está bien escrito?", "—Mañana iremos al río —anunció papá.", "Mañana iremos al río —anunció papá—.", "—Mañana iremos al río anunció papá."),
  w("¿Qué diálogo está bien escrito?", "—Gracias —respondió la niña.", "Gracias —respondió la niña—", "—Gracias respondió— la niña."), w("¿Qué diálogo está bien escrito?", "—¿Dónde está mi gorra? —preguntó Tito.", "—¿Dónde está mi gorra, preguntó Tito?", "¿Dónde está mi gorra —preguntó Tito."),
  w("¿Qué signo se usa en castellano para marcar lo que dice un personaje?", "La raya (—)", "El punto (.)", "La coma (,)"),
];

export const ROWS: Row[] = [
  ["articulos-1", (r) => choose(r, "¿Qué artículo va?", EL_UN)],
  ["articulos-2", (r) => choose(r, "¿Qué artículo va?", ARTICLE_USE)],
  ["articulos-3", (r) => pickInSentence(r, "Selecciona los artículos de la oración.", ARTICLES_IN)],

  ["adjetivos-adverbios-1", (r) => choose(r, "", KIND_OR_MANY)],
  ["adjetivos-adverbios-2", (r) => choose(r, "", ADJ_FOR_NOUN)],
  ["adjetivos-adverbios-3", (r) => pickInSentence(r, "Selecciona los adjetivos (palabras que dicen cómo es algo).", ADJECTIVES_IN)],
  ["adjetivos-adverbios-4", (r) => choose(r, "", ADVERB_KIND)],
  ["adjetivos-adverbios-5", (r) => pickInSentence(r, "Selecciona los adverbios (dicen cómo, cuándo o dónde).", ADVERBS_IN)],
  ["adjetivos-adverbios-6", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["adjetivos-adverbios-7", (r) => choose(r, "", ADJ_OR_ADV)],
  ["comparar-1", (r) => choose(r, "Completa la comparación.", COMPARE_ADJ)],
  ["comparar-2", (r) => choose(r, "", SUPERLATIVE)],
  ["comparar-3", (r) => choose(r, "Completa la comparación.", COMPARE_ADV)],

  ["preposiciones-1", (r) => pickInSentence(r, "Selecciona las preposiciones.", PREPS_IN)],
  ["preposiciones-2", (r) => choose(r, "", PREP_OBJECT)],
  ["preposiciones-3", (r) => choose(r, "", PREP_PHRASE)],
  ["preposiciones-4", (r) => choose(r, "Completa la oración.", PREP_REVIEW)],

  ["conjunciones-1", (r) => pickInSentence(r, "Selecciona las conjunciones que unen (y, e, o, ni, pero, sino).", COORD_IN)],
  ["conjunciones-2", (r) => pickInSentence(r, "Selecciona las palabras que unen una idea con su causa, condición o momento.", SUBORD_IN)],

  ["conjunciones-3", (r) => choose(r, "Completa la oración.", AL_DEL)],
  ["conjunciones-4", (r) => choose(r, "Completa la oración.", CONMIGO)],

  ["comas-1", (r) => choose(r, "", COMMA_SERIES)],
  ["comas-2", (r) => choose(r, "", COMMA_DATES)],
  ["comas-3", (r) => choose(r, "", COMMA_PLACES)],
  ["comas-4", (r) => choose(r, "", COMMA_ADDRESS)],
  ["comas-5", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_DATES, ...COMMA_PLACES, ...COMMA_ADDRESS])],

  ["mayusculas-1", (r) => choose(r, "", CAPS_NAMES)],
  ["mayusculas-2", (r) => choose(r, "", CAPS_DAYS)],
  ["mayusculas-3", (r) => choose(r, "", CAPS_PLACES)],
  ["mayusculas-4", (r) => choose(r, "", CAPS_NATIONALITY)],
  ["mayusculas-5", (r) => choose(r, "", [...CAPS_NAMES, ...CAPS_DAYS, ...CAPS_PLACES, ...CAPS_NATIONALITY])],

  ["abreviaturas-1", (r) => choose(r, "", abbr(DAY_ABBR))],
  ["abreviaturas-2", (r) => choose(r, "", abbr(MONTH_ABBR))],
  ["abreviaturas-3", (r) => choose(r, "", abbr(TITLE_ABBR))],
  ["abreviaturas-4", (r) => choose(r, "", abbr(MASS_ABBR))],
  ["abreviaturas-5", (r) => choose(r, "", abbr(LENGTH_ABBR))],
  ["abreviaturas-direcciones-1", (r) => choose(r, "", abbr(STREET_ABBR))],
  ["abreviaturas-direcciones-2", (r) => choose(r, "", abbr(ADDRESS_ABBR))],
  ["abreviaturas-direcciones-3", (r) => choose(r, "", abbr([...STREET_ABBR, ...ADDRESS_ABBR]))],

  ["formato-1", (r) => choose(r, "", LETTERS)],
  ["formato-2", (r) => choose(r, "", ADDRESSES)],
  ["formato-3", (r) => choose(r, "", CAPS_TITLES)],
  ["formato-4", (r) => choose(r, "", FORMAT_TITLES)],
  ["formato-5", (r) => choose(r, "", TITLES_BOTH)],
  ["dialogos", (r) => choose(r, "", DIALOGUE)],
];
