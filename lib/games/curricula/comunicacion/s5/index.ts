import type { Section } from "../../../types";
import { cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · 5.° de Secundaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo VII y la educación básica). El modo CNEB trae: integrar y
// contrastar información de textos complejos, el desarrollo de los temas, la
// perspectiva del autor y el tono, alusiones y figuras literarias (anáfora,
// antítesis, apóstrofe, aliteración, quiasmo, lítote), narrador, personajes y
// estructura, poesía peruana, retórica en documentos de la historia del
// Perú, la novela «Matalaché», el drama «Collacocha», el ensayo «Peruanidad»
// y documentos institucionales; argumentar con evidencias, análisis y
// contraargumentos, falacias y apelaciones; citar en APA, y escribir con
// precisión y corrección. Lo marcado `extendido` va más allá de la educación
// básica: la novela «El padre Horán», el viaje de Humboldt por el Perú,
// documentos legales y ortografía de prefijos y bases cultas.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprensión de lectura", icon: "📖", topic: "comprension" },
  { id: "lectura-atenta", name: "Lectura atenta", icon: "🔎", topic: "comprension" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "obras", name: "Novela, teatro y ensayo", icon: "🏔️", topic: "literatura" },
  { id: "informativos", name: "Textos históricos, informativos e institucionales", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Vocabulario", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "ortografia", name: "Ortografía y tildes", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración compuesta", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Verbos, comparativos y modificadores", icon: "🧩", topic: "gramatica" },
  { id: "escribir", name: "Redacción y revisión", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumentación e investigación", icon: "🔍", topic: "redaccion" },
  { id: "mas-alla", name: "Para ir más allá", icon: "🚀", topic: "literatura", extended: true },
];

export const GAMES: Game[] = [
  ["ideas-principales", "comprension", "Una o varias ideas principales", ["ideas-principales-1", "ideas-principales-2"]],
  ["temas", "comprension", "El desarrollo de los temas", ["temas"]],
  ["proposito", "comprension", "Destinatario, propósito y perspectiva", ["proposito-1", "proposito-2"]],
  ["tono", "comprension", "Registro y tono", ["tono-1", "tono-2", "tono-3"]],
  ["argumentos", "comprension", "Sigue el desarrollo de un argumento", ["argumentos-1", "argumentos-2"]],

  ["literarios", "lectura-atenta", "Narrador, personajes y estructura del relato", ["literarios-1", "literarios-2", "literarios-3"]],
  ["informativos-atenta", "lectura-atenta", "Elección de palabras y estructura informativa", ["informativos-atenta-1", "informativos-atenta-2"]],
  ["cuentos", "lectura-atenta", "Analiza cuentos breves", ["cuentos-1", "cuentos-2"]],

  ["alusiones", "recursos", "Alusiones y sus fuentes", ["alusiones-1", "alusiones-2"]],
  ["figuras", "recursos", "Eufemismo, hipérbole, oxímoron y paradoja", ["figuras-1"]],
  ["figuras-2", "recursos", "Anáfora, antítesis, apóstrofe, aliteración, quiasmo y lítote", ["figuras-2"]],
  ["efecto-figuras", "recursos", "El efecto de las figuras literarias", ["figuras-3"]],
  ["poesia", "recursos", "Poesía peruana: Vallejo, Eguren y Chocano", ["poesia"]],

  ["matalache", "obras", "«Matalaché» de Enrique López Albújar", ["matalache"]],
  ["collacocha", "obras", "«Collacocha» de Enrique Solari Swayne", ["collacocha"]],
  ["peruanidad", "obras", "«Peruanidad» de Víctor Andrés Belaunde", ["peruanidad"]],

  ["retorica", "informativos", "Retórica en textos de la historia del Perú", ["retorica-1", "retorica-2"]],
  ["desarrollo", "informativos", "El desarrollo de textos informativos", ["desarrollo-1", "desarrollo-2"]],
  ["documentos", "informativos", "Reglamentos, políticas y bases", ["documentos"]],

  ["homofonos", "vocabulario", "Homófonos", ["homofonos-1", "homofonos-2"]],
  ["prestamos", "vocabulario", "Préstamos y expresiones de otras lenguas", ["prestamos-1", "prestamos-2", "prestamos-3"]],
  ["palabras-parecidas", "vocabulario", "Palabras parecidas y connotación", ["precision-1", "precision-2"]],
  ["precision", "vocabulario", "Precisión, sinónimos y uso correcto", ["precision-3", "precision-4", "precision-5"]],
  ["usos-discutidos", "vocabulario", "Usos nuevos o discutidos", ["usos-discutidos"]],
  ["analogias", "vocabulario", "Analogías", ["analogias"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["contexto-1"]],
  ["ciencia", "vocabulario", "Vocabulario de ciencia y tecnología", ["contexto-2"]],

  ["prefijos", "raices", "Prefijos y sufijos cultos", ["prefijos-1", "prefijos-2", "prefijos-3"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["raices-1", "raices-2", "raices-3"]],

  ["afijos-ortografia", "ortografia", "anti-, no, pos-, -ción y -oso", ["ortografia-1"]],
  ["bases", "ortografia", "crono, grama, métrico, termo y esfera", ["ortografia-2"]],
  ["tildes", "ortografia", "Monosílabos, «aún» y «solo»", ["frecuentes-1"]],
  ["compuestas", "ortografia", "Tildes en adverbios en -mente y palabras compuestas", ["frecuentes-2"]],
  ["bien-escrita", "ortografia", "¿Está bien escrita?", ["frecuentes-3"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["revision-1"]],
  ["mal-escritas", "ortografia", "Palabras que suelen escribirse mal", ["revision-2"]],

  ["comas", "puntuacion", "La coma", ["comas-2"]],
  ["explicativas", "puntuacion", "Especificativas y explicativas", ["comas-1"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["signos-1"]],
  ["raya-guion", "puntuacion", "Raya, guion y puntos suspensivos", ["signos-2"]],
  ["pertenencia", "puntuacion", "Pertenencia sin apóstrofo", ["formato-1"]],
  ["mayusculas", "puntuacion", "Mayúsculas, citas y diálogos", ["formato-2", "formato-3"]],

  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["oracion-1", "oracion-2"]],
  ["frases", "oraciones", "Frases, frases con preposición y aposiciones", ["frases-1", "frases-2", "frases-3"]],
  ["proposiciones", "oraciones", "Coordinación, subordinación y relativo", ["proposiciones-1", "proposiciones-2", "proposiciones-3"]],

  ["le-la-lo", "pronombres", "Le, la, lo y pronombres tras «que» y «como»", ["pronombres-1", "pronombres-2"]],
  ["relativos", "pronombres", "Quien, quienes, cuyo y otros relativos", ["pronombres-3"]],
  ["antecedentes", "pronombres", "Antecedentes ambiguos y cambios de persona", ["antecedentes-1", "antecedentes-2"]],

  ["verbos", "gramatica", "Transitivos, copulativos y verboides", ["verbos-1", "verbos-2"]],
  ["concordancia", "gramatica", "Concordancia entre sujeto y verbo", ["concordancia"]],
  ["tiempos", "gramatica", "Tiempos progresivos y compuestos", ["tiempos"]],
  ["voz", "gramatica", "Voz activa y voz pasiva", ["voz-1", "voz-2"]],
  ["comparativos", "gramatica", "Comparativos y correlativas", ["comparativos-1", "comparativos-2"]],
  ["modificadores", "gramatica", "Modificadores mal colocados y colgantes", ["modificadores"]],

  ["organizar", "escribir", "Organiza las ideas", ["organizar-1", "organizar-2"]],
  ["tematica-tesis", "escribir", "Oración temática y tesis", ["tematica-tesis-1", "tematica-tesis-2"]],
  ["claridad", "escribir", "Comparaciones, paralelismo y redundancias", ["claridad-1", "claridad-2", "claridad-3"]],
  ["corregir", "escribir", "Corrige carteles, errores frecuentes y propón mejoras", ["revision-3", "revision-4", "revision-5"]],

  ["evidencias", "argumentar", "Hechos, opiniones y evidencias", ["evidencias-1", "evidencias-2", "evidencias-3", "evidencias-4"]],
  ["analisis", "argumentar", "Análisis, contraargumentos y conectores", ["analisis-1", "analisis-2", "analisis-3"]],
  ["falacias", "argumentar", "Falacias", ["falacias"]],
  ["persuasion", "argumentar", "Ethos, pathos y logos", ["persuasion-1", "persuasion-2"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["apa-1", "apa-2", "apa-3"]],
  ["plagio", "argumentar", "¿Es plagio?", ["apa-4"]],

  ["padre-horan", "mas-alla", "«El padre Horán» de Narciso Aréstegui", ["padre-horan"]],
  ["humboldt", "mas-alla", "Humboldt en el Perú", ["humboldt"]],
  ["documentos-legales", "mas-alla", "Contratos, libro de reclamaciones y garantías", ["documentos-legales"]],
  ["ortografia-culta", "mas-alla", "i-, ir-, -ante, -encia y bases cultas", ["ortografia-culta-1", "ortografia-culta-2"]],
];

export const COMUNICACION_S5 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
