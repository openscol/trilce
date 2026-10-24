import { choose, mix, order, pickAll, pickInSentence, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, s, sorter, w } from "./helpers";
import type { Row } from "./row";

// 3.° de Primaria · banco de gramática y ortografía (primera parte): prefijos
// re- y des-, sufijos -oso, -mente, -dad, -eza, -ito, cambios z→c, c→qu, g→gu
// (empecé, busqué, llegué), la oración, sustantivos, plurales y pertenencia,
// pronombres (yo, mí), clases de verbos, concordancia y tiempos verbales con
// ser, estar, tener y haber.


const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("deshacer", "desacer", "dezhacer"), spell("releer", "reler", "rreleer"), spell("reescribir", "rescrivir", "reescrivir"), spell("desordenar", "dezordenar", "des ordenar"),
  spell("deshabitado", "desabitado", "deshavitado"), spell("reabrir", "re abrir", "reavrir"), spell("desenvolver", "desenbolver", "desemvolver"), spell("rehacer", "reacer", "rehaser"),
  spell("desobedecer", "desovedecer", "desobedeser"), spell("reconstruir", "reconstruhir", "recostruir"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("rápidamente", "rapidamente", "rápidamemte"), spell("felizmente", "felismente", "felízmente"), spell("cuidadoso", "cuidadozo", "cuidadosso"), spell("belleza", "bellesa", "beyeza"),
  spell("bondad", "vondad", "bondat"), spell("perrito", "perito", "perrrito"), spell("fácilmente", "facilmente", "fásilmente"), spell("tristeza", "tristesa", "tristeça"),
  spell("amistad", "amistat", "hamistad"), spell("hermoso", "ermoso", "hermozo"),
];
const Z_C: ChoiceItem[] = [
  pt(WELL, "lápiz → plural", "lápices", "lápizes", "lápises"), pt(WELL, "pez → diminutivo", "pececito", "pezecito", "pesesito"), pt(WELL, "luz → plural", "luces", "luzes", "luses"),
  pt(WELL, "empezar → ayer yo...", "empecé", "empezé", "empesé"), pt(WELL, "cruzar → ayer yo...", "crucé", "cruzé", "crusé"), pt(WELL, "feliz → plural", "felices", "felizes", "felises"),
  pt(WELL, "nariz → diminutivo", "naricita", "narizita", "narisita"), pt(WELL, "almorzar → ayer yo...", "almorcé", "almorzé", "almorsé"), pt(WELL, "nuez → plural", "nueces", "nuezes", "nueses"),
];
const C_QU: ChoiceItem[] = [
  pt(WELL, "buscar → ayer yo...", "busqué", "buscé", "buské"), pt(WELL, "poco → diminutivo", "poquito", "pocito", "pokito"), pt(WELL, "tocar → ayer yo...", "toqué", "tocé", "toké"),
  pt(WELL, "barco → diminutivo", "barquito", "barcito", "barkito"), pt(WELL, "sacar → ayer yo...", "saqué", "sacé", "saké"), pt(WELL, "chico → diminutivo", "chiquito", "chicito", "chikito"),
  pt(WELL, "explicar → ayer yo...", "expliqué", "explicé", "expliké"), pt(WELL, "vaca → diminutivo", "vaquita", "vacita", "vakita"), pt(WELL, "pescar → ayer yo...", "pesqué", "pescé", "peské"),
];
const G_GU: ChoiceItem[] = [
  pt(WELL, "llegar → ayer yo...", "llegué", "llegé", "llejé"), pt(WELL, "amigo → diminutivo", "amiguito", "amigito", "amijito"), pt(WELL, "jugar → ayer yo...", "jugué", "jugé", "jujé"),
  pt(WELL, "pagar → ayer yo...", "pagué", "pagé", "pajé"), pt(WELL, "lago → diminutivo", "laguito", "lagito", "lajito"), pt(WELL, "agua → diminutivo", "agüita", "aguita", "agita"),
  pt(WELL, "apagar → ayer yo...", "apagué", "apagé", "apajé"), pt(WELL, "hormiga → diminutivo", "hormiguita", "hormigita", "hormijita"), pt(WELL, "regar → ayer yo...", "regué", "regé", "rejé"),
];

const KIND = sorter(["Afirmación", "Pregunta", "Orden", "Exclamación"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  KIND("Los delfines son mamíferos.", 0), KIND("¿A qué hora empieza el partido?", 1), KIND("Guarda tus juguetes, por favor.", 2), KIND("¡Qué susto me diste!", 3),
  KIND("Mi prima vive en Tacna.", 0), KIND("¿Quién dejó la puerta abierta?", 1), KIND("Lávate las manos antes de comer.", 2), KIND("¡Ganamos el campeonato!", 3),
  KIND("El bus pasa cada diez minutos.", 0), KIND("¿Dónde guardaste el pegamento?", 1), KIND("Abre el libro en la página veinte.", 2), KIND("¡Cuánto has crecido!", 3),
];

const SUBJECT: ChoiceItem[] = [
  pt("¿Cuál es el sujeto completo?", "El perro de mi vecino ladra toda la noche.", "El perro de mi vecino", "El perro de mi vecino ladra", "ladra toda la noche"),
  pt("¿Cuál es el sujeto completo?", "Mi hermana mayor estudia medicina.", "Mi hermana mayor", "Mi hermana", "estudia medicina"),
  pt("¿Cuál es el sujeto completo?", "Los niños del tercer grado visitaron el museo.", "Los niños del tercer grado", "Los niños del tercer grado visitaron", "visitaron el museo"),
  pt("¿Cuál es el sujeto completo?", "La maestra nueva nos leyó un cuento.", "La maestra nueva", "La maestra", "nos leyó un cuento"),
  pt("¿Cuál es el sujeto completo?", "Un fuerte viento del sur derribó el árbol.", "Un fuerte viento del sur", "Un fuerte viento del sur derribó", "derribó el árbol"),
  pt("¿Cuál es el sujeto completo?", "Las flores amarillas del jardín se marchitaron.", "Las flores amarillas del jardín", "Las flores amarillas del jardín se", "se marchitaron"),
  pt("¿Cuál es el sujeto completo?", "En la plaza, dos músicos tocaban la quena.", "dos músicos", "En la plaza", "tocaban la quena"),
];
const PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el predicado completo?", "El perro de mi vecino ladra toda la noche.", "ladra toda la noche", "ladra", "El perro de mi vecino"),
  pt("¿Cuál es el predicado completo?", "Mi hermana mayor estudia medicina.", "estudia medicina", "medicina", "Mi hermana mayor"),
  pt("¿Cuál es el predicado completo?", "Los niños del tercer grado visitaron el museo.", "visitaron el museo", "visitaron", "Los niños del tercer grado"),
  pt("¿Cuál es el predicado completo?", "La maestra nueva nos leyó un cuento.", "nos leyó un cuento", "nueva nos leyó un cuento", "La maestra nueva"),
  pt("¿Cuál es el predicado completo?", "Un fuerte viento del sur derribó el árbol.", "derribó el árbol", "el árbol", "Un fuerte viento del sur"),
  pt("¿Cuál es el predicado completo?", "Las flores amarillas del jardín se marchitaron.", "se marchitaron", "del jardín", "Las flores amarillas del jardín"),
  pt("¿Cuál es el predicado completo?", "Mi abuelo cuenta historias de su pueblo.", "cuenta historias de su pueblo", "abuelo cuenta historias de su pueblo", "Mi abuelo"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto (la palabra más importante)?", "El perro de mi vecino ladra toda la noche.", "perro", "vecino", "ladra", "noche"),
  pt("¿Cuál es el núcleo del predicado (el verbo)?", "El perro de mi vecino ladra toda la noche.", "ladra", "perro", "vecino", "noche"),
  pt("¿Cuál es el núcleo del sujeto (la palabra más importante)?", "Los niños del tercer grado visitaron el museo.", "niños", "grado", "museo", "visitaron"),
  pt("¿Cuál es el núcleo del predicado (el verbo)?", "Los niños del tercer grado visitaron el museo.", "visitaron", "niños", "museo", "grado"),
  pt("¿Cuál es el núcleo del sujeto (la palabra más importante)?", "Las flores amarillas del jardín se marchitaron.", "flores", "jardín", "amarillas", "marchitaron"),
  pt("¿Cuál es el núcleo del predicado (el verbo)?", "Mi abuelo cuenta historias de su pueblo.", "cuenta", "abuelo", "historias", "pueblo"),
  pt("¿Cuál es el núcleo del sujeto (la palabra más importante)?", "La maestra nueva nos leyó un cuento.", "maestra", "nueva", "cuento", "leyó"),
  pt("¿Cuál es el núcleo del predicado (el verbo)?", "Un fuerte viento del sur derribó el árbol.", "derribó", "viento", "árbol", "fuerte"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["El tren llegó a la estación.", "Mi tía vende flores en el mercado.", "Los pájaros cantan al amanecer.", "Ayer llovió toda la tarde.", "La maestra explicó la tarea.", "Mi gato duerme en el sillón."];
const FRAGMENT_ITEMS = ["El tren de las ocho.", "Vende flores en.", "Los pájaros del parque.", "Toda la tarde de ayer.", "Porque estaba cansado.", "Cuando llegamos a la playa."];
const RUN_ON_ITEMS = ["El tren llegó bajamos corriendo.", "Mi tía vende flores yo le ayudo.", "Ayer llovió no salimos.", "Tengo hambre voy a almorzar.", "El gato duerme el perro ladra.", "Sonó el timbre entramos al salón."];

const SIMPLE = sorter(["Simple (una sola idea con su verbo)", "Compuesta (dos ideas unidas)"], "¿La oración es simple o compuesta?");
const SIMPLE_COMPOUND: ChoiceItem[] = [
  SIMPLE("El perro ladra.", 0), SIMPLE("El perro ladra y el gato huye.", 1), SIMPLE("Mi mamá cocina arroz con pollo.", 0), SIMPLE("Mi mamá cocina y mi papá pone la mesa.", 1),
  SIMPLE("Quiero salir, pero está lloviendo.", 1), SIMPLE("Los niños del barrio juegan en el parque.", 0), SIMPLE("Estudié mucho, así que aprobé.", 1), SIMPLE("La luna brilla sobre el mar.", 0),
  SIMPLE("¿Vienes conmigo o te quedas en casa?", 1), SIMPLE("Ana y Luis cantan en el coro.", 0),
];
const MAKE_COMPOUND: ChoiceItem[] = [
  pt("¿Cómo se unen en una oración compuesta?", "Tengo sueño. No quiero dormir.", "Tengo sueño, pero no quiero dormir.", "Tengo sueño no quiero dormir.", "Tengo sueño, o bien no quiero dormir."),
  pt("¿Cómo se unen en una oración compuesta?", "Sonó el timbre. Entramos al salón.", "Sonó el timbre y entramos al salón.", "Sonó el timbre entramos al salón.", "Sonó el timbre, pero entramos al salón."),
  pt("¿Cómo se unen en una oración compuesta?", "Podemos ir al parque. Podemos ver una película.", "Podemos ir al parque o podemos ver una película.", "Podemos ir al parque podemos ver una película.", "Podemos ir al parque, pero podemos ver una película."),
  pt("¿Cómo se unen en una oración compuesta?", "Llovía mucho. Nos quedamos en casa.", "Llovía mucho, así que nos quedamos en casa.", "Llovía mucho nos quedamos en casa.", "Llovía mucho, o bien no nos quedamos en casa."),
  pt("¿Cómo se unen en una oración compuesta?", "Leo un cuento. Mi hermano dibuja.", "Leo un cuento y mi hermano dibuja.", "Leo un cuento mi hermano dibuja.", "Leo un cuento, así que mi hermano dibuja."),
  pt("¿Cómo se unen en una oración compuesta?", "El examen era difícil. Lo terminé a tiempo.", "El examen era difícil, pero lo terminé a tiempo.", "El examen era difícil lo terminé a tiempo.", "El examen era difícil, o bien lo terminé a tiempo."),
];
const UNSCRAMBLE: OrderItem[] = [
  { seq: ["Mi", "abuela", "teje", "una", "chompa", "azul."] }, { seq: ["Los", "niños", "juegan", "en", "el", "patio."] }, { seq: ["Ayer", "fuimos", "al", "mercado", "con", "papá."] },
  { seq: ["El", "cóndor", "vuela", "sobre", "las", "montañas."] }, { seq: ["¿Dónde", "guardaste", "mi", "cuaderno", "rojo?"] }, { seq: ["La", "maestra", "leyó", "un", "cuento", "divertido."] },
  { seq: ["Mañana", "visitaremos", "a", "mis", "primos."] }, { seq: ["¡Qué", "rico", "está", "este", "pastel!"] },
];

const WHICH_NOUN: ChoiceItem[] = [
  w("¿Qué palabra es un sustantivo?", "ventana", "abrir", "ancha", "rápido"), w("¿Qué palabra es un sustantivo?", "montaña", "subir", "alta", "lejos"),
  w("¿Qué palabra es un sustantivo?", "carpintero", "cortar", "hábil", "bien"), w("¿Qué palabra es un sustantivo?", "mercado", "comprar", "barato", "siempre"),
  w("¿Qué palabra es un sustantivo?", "tortuga", "nadar", "lenta", "despacio"), w("¿Qué palabra es un sustantivo?", "biblioteca", "leer", "silenciosa", "allí"),
  w("¿Qué palabra es un sustantivo?", "alegría", "reír", "alegre", "alegremente"), w("¿Qué palabra es un sustantivo?", "martillo", "golpear", "pesado", "fuerte"),
];
const NOUNS_IN = [
  s("El gato duerme en el sillón.", "gato", "sillón"), s("Mi hermana compró una mochila.", "hermana", "mochila"), s("Las abejas vuelan sobre las flores.", "abejas", "flores"),
  s("El panadero hornea el pan temprano.", "panadero", "pan"), s("Lucía guardó sus lápices en la cartuchera.", "Lucía", "lápices", "cartuchera"),
  s("La lluvia mojó la ropa del cordel.", "lluvia", "ropa", "cordel"), s("Un cóndor voló sobre el cañón.", "cóndor", "cañón"), s("Los turistas visitaron la catedral.", "turistas", "catedral"),
];
const ABSTRACT_IN = [
  s("La amistad es un tesoro.", "amistad", "tesoro"), s("Sentí alegría cuando llegó mi abuelo.", "alegría", "abuelo"), s("El miedo no dejó dormir a Tomás.", "miedo", "Tomás"),
  s("La paciencia de la maestra es enorme.", "paciencia", "maestra"), s("Mi perro me demuestra cariño.", "perro", "cariño"), s("La honestidad es una gran virtud.", "honestidad", "virtud"),
  s("El niño tenía la esperanza de ganar.", "niño", "esperanza"), s("La libertad es un derecho de las personas.", "libertad", "derecho", "personas"),
];
const PROPER = ["Lima", "Mateo", "Perú", "Amazonas", "Cusco", "Valeria", "Titicaca", "Arequipa"];
const COMMON = ["ciudad", "niño", "país", "río", "plaza", "maestra", "lago", "volcán"];

const PLURAL_FORM: ChoiceItem[] = [
  pt("¿Cuál es el plural?", "flor", "flores", "flors", "florces"), pt("¿Cuál es el plural?", "lápiz", "lápices", "lápizes", "lápizs"), pt("¿Cuál es el plural?", "camión", "camiones", "camións", "camiónes"),
  pt("¿Cuál es el plural?", "reloj", "relojes", "relojs", "relojeces"), pt("¿Cuál es el plural?", "pez", "peces", "pezes", "pezs"), pt("¿Cuál es el plural?", "papel", "papeles", "papels", "papelces"),
  pt("¿Cuál es el plural?", "nuez", "nueces", "nuezes", "nuezs"), pt("¿Cuál es el plural?", "ciudad", "ciudades", "ciudads", "ciudaces"), pt("¿Cuál es el plural?", "café", "cafés", "cafees", "caféses"),
  pt("¿Cuál es el plural?", "árbol", "árboles", "árbols", "árbolces"),
];
const PLURAL_USE: ChoiceItem[] = [
  f("En la pecera nadan tres ___.", "peces", "pez", "pezes"), f("Compré dos ___ nuevos para dibujar.", "lápices", "lápiz", "lápizes"), f("Las ___ del parque son altas.", "paredes", "pared", "pareds"),
  f("Pasaron varios ___ cargados de fruta.", "camiones", "camión", "camións"), f("Los ___ marcan la misma hora.", "relojes", "reloj", "relojs"), f("Recogimos muchas ___ del nogal.", "nueces", "nuez", "nuezes"),
  f("Las ___ más grandes del país están en la costa.", "ciudades", "ciudad", "ciudads"), f("Hay tres ___ en la mesa.", "papeles", "papel", "papels"),
];
const NUMBER = sorter(["Singular", "Plural"], "¿El sustantivo está en singular o en plural?");
const SING_PLUR: ChoiceItem[] = [
  NUMBER("lápices", 1), NUMBER("crisis", 0), NUMBER("mes", 0), NUMBER("meses", 1), NUMBER("paraguas", 0), NUMBER("reyes", 1),
  NUMBER("lunes", 0), NUMBER("países", 1), NUMBER("autobús", 0), NUMBER("luces", 1), NUMBER("compás", 0), NUMBER("leyes", 1),
];
const IRREGULAR_PLURAL: ChoiceItem[] = [
  f("un paraguas → dos ___", "paraguas", "paraguases", "paragua"), f("el lunes → los ___", "lunes", "luneses", "lune"), f("un rey → dos ___", "reyes", "reys", "reies"),
  f("un colibrí → dos ___", "colibríes", "colibrices", "colibríos"), f("una crisis → dos ___", "crisis", "crisises", "crisi"), f("un sofá → dos ___", "sofás", "sofases", "sofáes"),
  f("un cumpleaños → dos ___", "cumpleaños", "cumpleañoses", "cumpleaño"), f("un autobús → dos ___", "autobuses", "autobús", "autobúses"), f("una ley → dos ___", "leyes", "leys", "leies"),
];
const OWN = sorter(["Plural (varios)", "Pertenencia (de un dueño)", "Pertenencia (de varios dueños)"], "¿Qué muestran las palabras en MAYÚSCULAS?");
const POSSESSIVE_ID: ChoiceItem[] = [
  OWN("LOS PERROS corren en el parque.", 0), OWN("El hueso DEL PERRO está enterrado.", 1), OWN("Los huesos DE LOS PERROS están enterrados.", 2),
  OWN("LAS NIÑAS dibujan.", 0), OWN("La mochila DE LA NIÑA es roja.", 1), OWN("Las mochilas DE LAS NIÑAS son rojas.", 2),
  OWN("LOS MAESTROS llegaron temprano.", 0), OWN("El libro DEL MAESTRO es grueso.", 1), OWN("La sala DE LOS MAESTROS está cerrada.", 2),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  f("el cuaderno ___ niña", "de la", "del", "de los"), f("la cola ___ gato", "del", "de la", "de las"), f("los juguetes ___ niños", "de los", "del", "de la"),
  f("las alas ___ mariposas", "de las", "del", "de los"), f("el carro ___ vecino", "del", "de la", "de los"), f("la casa ___ abuelos", "de los", "del", "de la"),
  f("el nido ___ aves", "de las", "del", "de el"), f("la bicicleta ___ Rosa", "de", "del", "de la"), f("el pico ___ águila", "del", "de la", "de el"),
];
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt("¿Cómo se corrige el error?", "La cola de el perro es larga.", "La cola del perro es larga.", "La cola de la perro es larga.", "La cola del el perro es larga."),
  pt("¿Cómo se corrige el error?", "Los libro de la maestra son nuevos.", "Los libros de la maestra son nuevos.", "Los libro de las maestra son nuevos.", "El libros de la maestra son nuevos."),
  pt("¿Cómo se corrige el error?", "El juguete de los niño está roto.", "El juguete de los niños está roto.", "El juguete del niños está roto.", "El juguetes de los niño está roto."),
  pt("¿Cómo se corrige el error?", "Fuimos a el parque de la ciudad.", "Fuimos al parque de la ciudad.", "Fuimos a la parque de la ciudad.", "Fuimos al el parque de la ciudad."),
  pt("¿Cómo se corrige el error?", "Las pluma del loro son verdes.", "Las plumas del loro son verdes.", "Las pluma de los loro son verdes.", "La plumas del loro son verdes."),
  pt("¿Cómo se corrige el error?", "La puerta de la casas está abierta.", "La puerta de la casa está abierta.", "La puertas de la casas está abierta.", "La puerta del casas está abierta."),
];

const PRONOUNS_IN = [
  s("Ella canta y yo toco la guitarra.", "Ella", "yo"), s("Nosotros fuimos al cine con ellos.", "Nosotros", "ellos"), s("Tú sabes que él llegó tarde.", "Tú", "él"),
  s("Ustedes pueden sentarse con nosotras.", "Ustedes", "nosotras"), s("Yo vi que ellas ganaron.", "Yo", "ellas"), s("Él dice que usted es muy amable.", "Él", "usted"),
  s("Ellos juegan mientras tú estudias.", "Ellos", "tú"),
];
const SUBJ_OBJ: ChoiceItem[] = [
  f("___ vamos al parque los domingos.", "Nosotros", "Nos", "A nosotros"), f("Mi tía ___ regaló un libro.", "me", "yo", "mí"), f("___ eres mi mejor amigo.", "Tú", "Te", "Ti"),
  f("A Rosa ___ vi ayer en la feria.", "la", "ella", "le"), f("___ juegan muy bien al fútbol.", "Ellos", "Los", "Les"), f("El profesor ___ felicitó a todos.", "nos", "nosotros", "yo"),
  f("A mis primos ___ invité a mi fiesta.", "los", "ellos", "sus"), f("¿___ ayudo con la bolsa?", "Te", "Tú", "Ti"),
];
const REPLACE: ChoiceItem[] = [
  pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "MARÍA Y YO fuimos al cine.", "Nosotras", "Ellas", "Ustedes"), pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "LOS NIÑOS corren en el patio.", "Ellos", "Nosotros", "Él"),
  pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "LA DOCTORA revisó al paciente.", "Ella", "Él", "Ellas"), pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "MI ABUELO siembra papas.", "Él", "Ella", "Ellos"),
  pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "ANA Y LUCÍA cantan juntas.", "Ellas", "Ellos", "Nosotras"), pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "TÚ Y TU HERMANO llegaron tarde.", "Ustedes", "Nosotros", "Ellos"),
  pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "Vi A LOS VECINOS en la plaza.", "Los vi en la plaza.", "Les vi en la plaza.", "La vi en la plaza."), pt("Reemplaza las palabras en MAYÚSCULAS por un pronombre.", "Compré LA TORTA ayer.", "La compré ayer.", "Lo compré ayer.", "Le compré ayer."),
];
const I_AND_ME: ChoiceItem[] = [
  f("Mi hermana y ___ fuimos a la feria.", "yo", "mí", "me"), f("Este regalo es para ti y para ___.", "mí", "yo", "me"), f("Luis y ___ hicimos la maqueta.", "yo", "mí", "me"),
  f("La maestra nos eligió a Carla y a ___.", "mí", "yo", "me"), f("Entre tú y ___ lo resolveremos.", "yo", "mí", "me"), f("Mis primos vinieron con mi mamá y ___.", "conmigo", "con yo", "con mí"),
  f("Tú y ___ somos buenos amigos.", "yo", "mí", "me"), f("A mi papá y a ___ nos gusta pescar.", "mí", "yo", "me"),
];
const POSS_IN = [
  s("Este cuaderno es mío y ese es tuyo.", "mío", "tuyo"), s("La casa azul es nuestra.", "nuestra"), s("Las llaves son suyas, no mías.", "suyas", "mías"),
  s("Ese perro es suyo.", "suyo"), s("Los lápices rojos son tuyos.", "tuyos"), s("La idea fue nuestra y el mérito es vuestro.", "nuestra", "vuestro"), s("El premio es mío.", "mío"),
];
const POSS_USE: ChoiceItem[] = [
  f("Esta mochila es de Ana. Es ___.", "suya", "mía", "tuya"), f("Yo compré este lápiz. Es ___.", "mío", "suyo", "tuyo"), f("Ese libro es tuyo y este es ___.", "mío", "míos", "mía"),
  f("La casa es de nosotros. Es ___.", "nuestra", "suya", "vuestra"), f("Tú hiciste esos dibujos. Son ___.", "tuyos", "tuyo", "míos"), f("Las zapatillas son de Luis. Son ___.", "suyas", "suya", "tuyas"),
  f("Yo traje estas galletas. Son ___.", "mías", "mía", "suyas"), f("El terreno es de mis abuelos. Es ___.", "suyo", "nuestro", "mío"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Yo ___ lavo las manos antes de comer.", "me", "yo", "mí"), f("Ella ___ peina frente al espejo.", "se", "ella", "la"), f("Nosotros ___ levantamos temprano.", "nos", "nosotros", "los"),
  f("Tú ___ cepillas los dientes.", "te", "tú", "ti"), f("Los niños ___ abrigan cuando hace frío.", "se", "ellos", "los"), f("Yo ___ visto solo.", "me", "se", "yo"),
  f("Ustedes ___ sientan aquí.", "se", "ustedes", "le"), f("Mi papá ___ afeita cada mañana.", "se", "él", "lo"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Me miro en el espejo y ___ peino.", "me", "se", "te"), f("Mi hermano ___ baña con agua tibia.", "se", "me", "nos"), f("¿Tú ___ acuerdas de mí?", "te", "se", "me"),
  f("Nosotras ___ divertimos en la fiesta.", "nos", "se", "os"), f("Ellos ___ durmieron temprano.", "se", "nos", "te"), f("Yo ___ caí de la bicicleta.", "me", "se", "nos"),
  f("Ana ___ puso la casaca.", "se", "me", "te"), f("Ustedes ___ equivocaron de salón.", "se", "nos", "te"),
];

const ACTION_USE: ChoiceItem[] = [
  f("El caballo ___ por el campo.", "galopa", "blanco", "ayer"), f("La cocinera ___ la sopa con un cucharón.", "revuelve", "caliente", "sopa"), f("Los alumnos ___ sus nombres en la lista.", "escriben", "lápiz", "claros"),
  f("El águila ___ sobre el valle.", "vuela", "ala", "alto"), f("Mi abuelo ___ las plantas cada tarde.", "riega", "verde", "agua"), f("El carpintero ___ la madera.", "corta", "dura", "sierra"),
  f("Las niñas ___ la cuerda en el recreo.", "saltan", "larga", "patio"), f("El bebé ___ cuando tiene hambre.", "llora", "leche", "pequeño"),
];
const ACTION_IN = [
  s("El perro corre y salta en el jardín.", "corre", "salta"), s("Mamá corta las verduras y prepara la sopa.", "corta", "prepara"), s("Los niños cantan mientras la maestra toca el piano.", "cantan", "toca"),
  s("Papá maneja el carro.", "maneja"), s("Yo leo un cuento y mi hermana dibuja.", "leo", "dibuja"), s("El viento mueve las hojas.", "mueve"), s("Lucía escribe una carta y la envía.", "escribe", "envía"),
];
const HELPING: ChoiceItem[] = [
  pt("¿Cuál es el verbo auxiliar (el que ayuda al verbo principal)?", "Mi hermano ha terminado la tarea.", "ha", "Mi", "la"), pt("¿Cuál es el verbo principal?", "Mi hermano ha terminado la tarea.", "terminado", "la tarea", "hermano"),
  pt("¿Cuál es el verbo auxiliar (el que ayuda al verbo principal)?", "Los niños están jugando en el patio.", "están", "jugando", "patio"), pt("¿Cuál es el verbo principal?", "Los niños están jugando en el patio.", "jugando", "están", "niños"),
  pt("¿Cuál es el verbo auxiliar (el que ayuda al verbo principal)?", "Mañana voy a visitar a mi tía.", "voy", "mi", "tía"), pt("¿Cuál es el verbo principal?", "Mañana voy a visitar a mi tía.", "visitar", "voy a", "mañana"),
  pt("¿Cuál es el verbo auxiliar (el que ayuda al verbo principal)?", "Hemos comido ceviche.", "Hemos", "comido", "ceviche"), pt("¿Cuál es el verbo principal?", "La maestra está leyendo un cuento.", "leyendo", "está", "cuento"),
];

const SUBJECT_NUMBER: ChoiceItem[] = [
  NUMBER("EL EQUIPO ganó el partido.", 0), NUMBER("LOS JUGADORES celebraron.", 1), NUMBER("MI FAMILIA viaja en verano.", 0), NUMBER("MIS PRIMOS viven en Piura.", 1),
  NUMBER("LA GENTE aplaudió.", 0), NUMBER("LAS PERSONAS aplaudieron.", 1), NUMBER("ANA Y LUIS cantan.", 1), NUMBER("EL PERRO Y EL GATO duermen.", 1),
  NUMBER("LA BANDADA de aves voló.", 0), NUMBER("CADA NIÑO trae su lonchera.", 0),
].map((x) => ({ ...x, p: "El sujeto en MAYÚSCULAS, ¿es singular o plural?" }));
const SUBJECT_VERB: ChoiceItem[] = [
  f("Los niños ___ en el parque.", "juegan", "juega", "juego"), f("Mi hermana ___ muy bien.", "canta", "cantan", "cantas"), f("El equipo ___ todos los sábados.", "entrena", "entrenan", "entrenamos"),
  f("Ana y Luis ___ juntos.", "estudian", "estudia", "estudias"), f("La gente ___ en la plaza.", "baila", "bailan", "bailamos"), f("___ ladran toda la noche.", "Los perros", "El perro", "Mi perro"),
  f("___ vuela muy alto.", "El cóndor", "Los cóndores", "Las aves"), f("Mis abuelos ___ en el campo.", "viven", "vive", "vivo"), f("Cada alumno ___ su cuaderno.", "trae", "traen", "traes"),
];
const PRONOUN_VERB: ChoiceItem[] = [
  f("Yo ___ en la escuela.", "estudio", "estudias", "estudia"), f("Tú ___ muy rápido.", "corres", "corro", "corre"), f("Ella ___ una carta.", "escribe", "escribo", "escriben"),
  f("Nosotros ___ en el coro.", "cantamos", "cantan", "canto"), f("Ustedes ___ temprano.", "llegan", "llegamos", "llegas"), f("Ellos ___ al fútbol.", "juegan", "juega", "jugamos"),
  f("Usted ___ muy bien.", "cocina", "cocinas", "cocinan"), f("Él y yo ___ amigos.", "somos", "son", "soy"), f("Tú y ella ___ primas.", "son", "somos", "eres"),
];

const PAST_SENTENCE: ChoiceItem[] = [
  w("¿Qué oración está en pasado?", "Ayer caminé hasta el río.", "Hoy camino hasta el río.", "Mañana caminaré hasta el río."), w("¿Qué oración está en pasado?", "La abuela cocinó tamales.", "La abuela cocina tamales.", "La abuela cocinará tamales."),
  w("¿Qué oración está en pasado?", "Los niños saltaron la cuerda.", "Los niños saltan la cuerda.", "Los niños saltarán la cuerda."), w("¿Qué oración está en pasado?", "Luis pintó un mural.", "Luis pinta un mural.", "Luis pintará un mural."),
  w("¿Qué oración está en pasado?", "Nosotros bailamos anoche.", "Nosotros bailaremos luego.", "Nosotros vamos a bailar."), w("¿Qué oración está en pasado?", "El tren llegó tarde.", "El tren llega tarde.", "El tren llegará tarde."),
  w("¿Qué oración está en pasado?", "Tú abriste la ventana.", "Tú abres la ventana.", "Tú abrirás la ventana."),
];
const PAST_IN = [
  s("Ayer caminé al mercado y compré frutas.", "caminé", "compré"), s("La maestra explicó la lección.", "explicó"), s("Los niños corrieron y saltaron en el patio.", "corrieron", "saltaron"),
  s("Mi tía cocinó arroz y preparó jugo.", "cocinó", "preparó"), s("Anoche miramos las estrellas.", "miramos"), s("El perro ladró cuando sonó el timbre.", "ladró", "sonó"), s("Ustedes llegaron y saludaron a todos.", "llegaron", "saludaron"),
];
const PAST_REGULAR: ChoiceItem[] = [
  f("Ayer yo ___ (caminar) hasta la plaza.", "caminé", "caminó", "camino"), f("Anoche ella ___ (cenar) temprano.", "cenó", "cené", "cenaron"), f("El sábado nosotros ___ (bailar) marinera.", "bailamos", "bailaron", "bailé"),
  f("Ayer tú ___ (comer) dos panes.", "comiste", "comió", "comí"), f("Los niños ___ (correr) por el patio.", "corrieron", "corrió", "corrimos"), f("Mi papá ___ (vivir) en Huancayo.", "vivió", "viví", "vivieron"),
  f("Ustedes ___ (abrir) las ventanas.", "abrieron", "abrió", "abrimos"), f("Yo ___ (aprender) la canción.", "aprendí", "aprendió", "aprendiste"),
];
const IRREGULAR_ID_1: ChoiceItem[] = [
  w("¿Cuál es el pasado de «ir» (yo)?", "fui", "iré", "voy"), w("¿Cuál es el pasado de «hacer» (él)?", "hizo", "hace", "hará"), w("¿Cuál es el pasado de «tener» (yo)?", "tuve", "tengo", "tendré"),
  w("¿Cuál es el pasado de «decir» (ella)?", "dijo", "dice", "dirá"), w("¿Cuál es el pasado de «poner» (yo)?", "puse", "pongo", "pondré"), w("¿Cuál es el pasado de «venir» (él)?", "vino", "viene", "vendrá"),
  w("¿Cuál es el pasado de «estar» (yo)?", "estuve", "estoy", "estaré"), w("¿Cuál es el pasado de «poder» (ella)?", "pudo", "puede", "podrá"),
];
const IRREGULAR_ID_2: ChoiceItem[] = [
  w("«Trajo» es el pasado de...", "traer", "tragar", "trazar"), w("«Supe» es el pasado de...", "saber", "subir", "sacar"), w("«Quiso» es el pasado de...", "querer", "quitar", "quedar"),
  w("«Anduve» es el pasado de...", "andar", "añadir", "anudar"), w("«Cupo» es el pasado de...", "caber", "caer", "copiar"), w("«Condujo» es el pasado de...", "conducir", "conocer", "contar"),
  w("«Durmió» es el pasado de...", "dormir", "durar", "dorar"), w("«Pidió» es el pasado de...", "pedir", "pisar", "pintar"),
];
const SETS: ChoiceItem[][] = [
  [f("Ayer yo ___ (ir) al mercado.", "fui", "iré", "voy"), f("Ella ___ (ser) la ganadora.", "fue", "fui", "fueron"), f("Nosotros ___ (ir) a la playa.", "fuimos", "fueron", "vamos"), f("Ellos ___ (ser) muy amables.", "fueron", "fuimos", "son"), f("Tú ___ (ir) al cine.", "fuiste", "fue", "fui"), f("Ustedes ___ (ir) de paseo.", "fueron", "fuimos", "van"), f("Yo ___ (dar) las gracias.", "di", "dio", "doy"), f("Él ___ (ver) un cóndor.", "vio", "vi", "ve")],
  [f("Yo ___ (hacer) la tarea.", "hice", "hizo", "hací"), f("Él ___ (hacer) un dibujo.", "hizo", "hice", "hació"), f("Ella ___ (decir) la verdad.", "dijo", "dije", "dició"), f("Yo ___ (decir) que sí.", "dije", "dijo", "decí"), f("Ellos ___ (traer) fruta.", "trajeron", "traieron", "trajo"), f("Tú ___ (hacer) un pastel.", "hiciste", "hizo", "haciste"), f("Nosotros ___ (decir) adiós.", "dijimos", "dijeron", "dijo"), f("Yo ___ (traer) mi lonchera.", "traje", "trajo", "traí")],
  [f("Yo ___ (tener) fiebre.", "tuve", "tuvo", "tení"), f("Él ___ (estar) en casa.", "estuvo", "estuve", "estó"), f("Ella ___ (poder) llegar.", "pudo", "pude", "podió"), f("Yo ___ (poner) la mesa.", "puse", "puso", "poní"), f("Ellos ___ (saber) la respuesta.", "supieron", "sabieron", "supo"), f("Tú ___ (tener) suerte.", "tuviste", "tuvo", "teniste"), f("Nosotros ___ (estar) en Ica.", "estuvimos", "estuvieron", "estuvo"), f("Ella ___ (poner) flores.", "puso", "puse", "ponió")],
  [f("Él ___ (venir) temprano.", "vino", "vine", "venió"), f("Yo ___ (querer) ayudar.", "quise", "quiso", "querí"), f("El bebé ___ (dormir) bien.", "durmió", "dormió", "durmí"), f("Ella ___ (pedir) agua.", "pidió", "pedió", "pidí"), f("Yo ___ (venir) caminando.", "vine", "vino", "vení"), f("Ellos ___ (querer) jugar.", "quisieron", "querieron", "quiso"), f("Ellos ___ (dormir) en carpa.", "durmieron", "dormieron", "durmió"), f("Él ___ (sentir) frío.", "sintió", "sentió", "sintí")],
  [f("Él ___ (conducir) el bus.", "condujo", "condució", "conduje"), f("Yo ___ (andar) todo el día.", "anduve", "andé", "anduvo"), f("Ella ___ (leer) el cuento.", "leyó", "leió", "leí"), f("Él ___ (oír) un ruido.", "oyó", "oió", "oí"), f("El vaso ___ (caer) al piso.", "cayó", "caió", "caí"), f("Yo ___ (traducir) la carta.", "traduje", "traducí", "tradujo"), f("Ellos ___ (leer) en voz alta.", "leyeron", "leieron", "leyó"), f("La ropa no ___ (caber) en la maleta.", "cupo", "cabió", "cupe")],
];
const fromSet = (i: number) => (r: Parameters<typeof choose>[0]) => choose(r, "Completa con el verbo en pasado.", SETS[i]);

const SER_ESTAR: ChoiceItem[] = [
  f("Mi mamá ___ doctora.", "es", "está", "son"), f("Hoy yo ___ muy cansado.", "estoy", "soy", "está"), f("Nosotros ___ en la biblioteca.", "estamos", "somos", "están"),
  f("Tú ___ muy alto.", "eres", "estás", "es"), f("Los niños ___ en el patio.", "están", "son", "estamos"), f("La sopa ___ caliente.", "está", "es", "están"),
  f("Ayer yo ___ enfermo.", "estuve", "fui", "estoy"), f("Ellos ___ mis primos.", "son", "están", "somos"), f("El examen ___ ayer.", "fue", "estuvo", "es"),
  f("Mañana ___ lunes.", "será", "estará", "fue"),
];
const TENER_HABER: ChoiceItem[] = [
  f("Yo ___ nueve años.", "tengo", "tiene", "he"), f("Ella ___ dos hermanos.", "tiene", "tengo", "ha"), f("Nosotros ___ terminado la tarea.", "hemos", "tenemos", "han"),
  f("En el aula ___ treinta carpetas.", "hay", "tiene", "han"), f("Tú ___ razón.", "tienes", "has", "tiene"), f("Ellos ___ llegado tarde.", "han", "tienen", "hemos"),
  f("Ayer yo ___ fiebre.", "tuve", "tengo", "hube"), f("Mañana ___ clases.", "habrá", "tendrá", "hubo"), f("¿Tú ___ visto mi cuaderno?", "has", "tienes", "ha"),
];
const TENSE = sorter(["Pasado", "Presente", "Futuro"], "¿En qué tiempo está la oración?");
const TENSES: ChoiceItem[] = [
  TENSE("Ayer visité a mi abuela.", 0), TENSE("Ahora leo un cuento.", 1), TENSE("Mañana iremos al museo.", 2), TENSE("El año pasado viajamos a Cusco.", 0),
  TENSE("Mi papá trabaja en un taller.", 1), TENSE("El sábado jugaré con mis primos.", 2), TENSE("Anoche llovió mucho.", 0), TENSE("Los pájaros cantan en el árbol.", 1),
  TENSE("Pronto llegará el verano.", 2), TENSE("Hace un rato terminé la tarea.", 0), TENSE("Vamos a preparar una torta.", 2), TENSE("Mi hermana duerme.", 1),
];
const TO_FUTURE: ChoiceItem[] = [
  pt("Cambia la oración al futuro.", "Yo camino a la escuela.", "Yo caminaré a la escuela.", "Yo caminé a la escuela.", "Yo caminaba a la escuela."), pt("Cambia la oración al futuro.", "Ella canta una canción.", "Ella cantará una canción.", "Ella cantó una canción.", "Ella cantaba una canción."),
  pt("Cambia la oración al futuro.", "Nosotros comemos fruta.", "Nosotros comeremos fruta.", "Nosotros comimos fruta.", "Nosotros comíamos fruta."), pt("Cambia la oración al futuro.", "Los niños juegan fútbol.", "Los niños jugarán fútbol.", "Los niños jugaron fútbol.", "Los niños jugaban fútbol."),
  pt("Cambia la oración al futuro.", "Tú escribes una carta.", "Tú escribirás una carta.", "Tú escribiste una carta.", "Tú escribías una carta."), pt("Cambia la oración al futuro.", "Mi papá hace la cena.", "Mi papá hará la cena.", "Mi papá hizo la cena.", "Mi papá hacía la cena."),
  pt("Cambia la oración al futuro.", "Yo tengo un perro.", "Yo tendré un perro.", "Yo tuve un perro.", "Yo tenía un perro."), pt("Cambia la oración al futuro.", "Ustedes salen temprano.", "Ustedes saldrán temprano.", "Ustedes salieron temprano.", "Ustedes salían temprano."),
];

export const ROWS: Row[] = [
  ["prefijos-ortografia-1", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["prefijos-ortografia-2", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["cambios-sufijos-1", (r) => choose(r, WELL, Z_C)],
  ["cambios-sufijos-2", (r) => choose(r, WELL, C_QU)],
  ["cambios-sufijos-3", (r) => choose(r, WELL, G_GU)],
  ["cambios-sufijos-4", (r) => choose(r, WELL, [...Z_C, ...C_QU, ...G_GU])],

  ["tipos-oracion", (r) => choose(r, "", SENTENCE_KIND)],
  ["sujeto-predicado-1", (r) => choose(r, "", SUBJECT)],
  ["sujeto-predicado-2", (r) => choose(r, "", PREDICATE)],
  ["sujeto-predicado-3", (r) => choose(r, "", SIMPLE_SP)],
  ["fragmentos-1", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["fragmentos-2", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["fragmentos-3", (r) => choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],
  ["compuestas-oraciones-1", (r) => choose(r, "", SIMPLE_COMPOUND)],
  ["compuestas-oraciones-2", (r) => choose(r, "", MAKE_COMPOUND)],
  ["fragmentos-4", (r) => order(r, "Ordena las palabras para formar una oración.", UNSCRAMBLE)],

  ["sustantivos-1", (r) => choose(r, "", WHICH_NOUN)],
  ["sustantivos-2", (r) => pickInSentence(r, "Selecciona los sustantivos de la oración.", NOUNS_IN)],
  ["sustantivos-3", (r) => pickInSentence(r, "Selecciona los sustantivos (también los que nombran ideas o sentimientos).", ABSTRACT_IN)],
  ["sustantivos-4", (r) => mix(r, [(q) => pickAll(q, "Selecciona los sustantivos propios.", PROPER, COMMON, "propios"), (q) => pickAll(q, "Selecciona los sustantivos comunes.", COMMON, PROPER, "comunes")])],
  ["plurales-1", (r) => choose(r, "", PLURAL_FORM)],
  ["plurales-2", (r) => choose(r, "Completa la oración.", PLURAL_USE)],
  ["plurales-3", (r) => choose(r, "", SING_PLUR)],
  ["plurales-4", (r) => choose(r, "Completa con el plural.", IRREGULAR_PLURAL)],
  ["plurales-5", (r) => choose(r, "", POSSESSIVE_ID)],
  ["plurales-6", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],
  ["plurales-7", (r) => choose(r, "", POSSESSIVE_ERRORS)],

  ["pronombres-1", (r) => pickInSentence(r, "Selecciona los pronombres personales.", PRONOUNS_IN)],
  ["pronombres-2", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["pronombres-3", (r) => choose(r, "", REPLACE)],
  ["pronombres-4", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["pronombres-5", (r) => pickInSentence(r, "Selecciona los pronombres posesivos.", POSS_IN)],
  ["pronombres-6", (r) => choose(r, "Completa la oración.", POSS_USE)],
  ["reflexivos-1", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["reflexivos-2", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],

  ["tipos-verbos-1", (r) => choose(r, "Completa la oración con un verbo.", ACTION_USE)],
  ["tipos-verbos-2", (r) => pickInSentence(r, "Selecciona los verbos de acción.", ACTION_IN)],
  ["tipos-verbos-3", (r) => choose(r, "", HELPING)],

  ["concordancia-1", (r) => choose(r, "", SUBJECT_NUMBER)],
  ["concordancia-2", (r) => choose(r, "Completa la oración.", SUBJECT_VERB)],
  ["concordancia-3", (r) => choose(r, "Completa la oración.", PRONOUN_VERB)],

  ["tiempos-1", (r) => choose(r, "", PAST_SENTENCE)],
  ["tiempos-2", (r) => pickInSentence(r, "Selecciona los verbos en pasado.", PAST_IN)],
  ["tiempos-3", (r) => choose(r, "Completa con el verbo en pasado.", PAST_REGULAR)],
  ["irregulares-1", (r) => choose(r, "", IRREGULAR_ID_1)],
  ["irregulares-2", (r) => choose(r, "", IRREGULAR_ID_2)],
  ["irregulares-3", fromSet(0)],
  ["irregulares-4", fromSet(1)],
  ["irregulares-5", fromSet(2)],
  ["irregulares-6", fromSet(3)],
  ["irregulares-7", fromSet(4)],
  ["ser-estar-1", (r) => choose(r, "Completa la oración.", SER_ESTAR)],
  ["ser-estar-2", (r) => choose(r, "Completa la oración.", TENER_HABER)],
  ["tiempos-4", (r) => choose(r, "", TENSES)],
  ["tiempos-5", (r) => choose(r, "", TO_FUTURE)],
];
