import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 2.° de Secundaria, organizado según el CNEB (nivel esperado
// al terminar el ciclo VI). El modo CNEB trae: integrar y contrastar
// información de textos complejos, deducir tesis, tono y punto de vista,
// analizar figuras literarias y obras peruanas (Arguedas, Alegría), textos de
// no ficción sobre el Perú (afroperuanos, Ruiz Gallo, Raimondi), argumentar
// con evidencias y contraargumentos, reconocer apelaciones retóricas, citar
// en APA, y escribir con cohesión, voz activa, modos verbales y la puntuación
// del punto y coma, los dos puntos y la raya. Lo marcado `extendido` adelanta
// el ciclo VII (falacias, modificadores mal colocados, guion en adjetivos
// compuestos). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprensión de lectura", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Estructura del texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios", icon: "✨", topic: "literatura" },
  { id: "obras", name: "Obras de la literatura peruana", icon: "🏔️", topic: "literatura" },
  { id: "no-ficcion", name: "Textos informativos y de no ficción", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Vocabulario", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "ortografia", name: "Ortografía", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración compuesta", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Tiempos y modos verbales", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Redacción y revisión", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumentación e investigación", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["ideas-principales", "comprension", "Una o varias ideas principales", ["ideas-principales-1", "ideas-principales-2", "ideas-principales-3"]],
  ["temas", "comprension", "El tema y varios temas", ["temas-1", "temas-2", "temas-3"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["proposito-1", "proposito-2"]],
  ["tono", "comprension", "Registro y tono", ["tono-1", "tono-2"]],
  ["literatura", "comprension", "Narrador, inferencias y análisis de cuentos", ["literatura-1", "literatura-2", "literatura-3"]],
  ["argumento", "comprension", "Sigue el desarrollo de un argumento", ["argumento"]],
  ["comparar-textos", "comprension", "Compara textos y géneros", ["comparar-textos-1", "comparar-textos-2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["visuales-1", "visuales-2"]],

  ["estructuras", "estructura", "Comparación, causa-efecto y problema-solución", ["estructuras-1", "estructuras-2", "estructuras-3", "estructuras-4"]],

  ["sentidos-alusion", "recursos", "Detalles sensoriales y alusiones", ["sentidos-alusion-1", "sentidos-alusion-2", "sentidos-alusion-3"]],
  ["figuras", "recursos", "Interpreta y clasifica figuras literarias", ["figuras-1", "figuras-2", "figuras-3"]],
  ["rima", "recursos", "El esquema de rima", ["rima"]],
  ["personificacion", "recursos", "Usa la personificación", ["personificacion"]],

  ["rios-profundos", "obras", "«Los ríos profundos» de José María Arguedas", ["rios-profundos-1", "rios-profundos-2"]],
  ["mundo-ancho", "obras", "«El mundo es ancho y ajeno» de Ciro Alegría", ["mundo-ancho-1", "mundo-ancho-2"]],

  ["informativos", "no-ficcion", "Animales, lugares, tecnología, ciencia e historia", ["informativos-1", "informativos-2", "informativos-3", "informativos-4", "informativos-5"]],
  ["afroperuanos", "no-ficcion", "La abolición de la esclavitud y el pueblo afroperuano", ["afroperuanos-1", "afroperuanos-2"]],
  ["ruiz-gallo", "no-ficcion", "El inventor Pedro Ruiz Gallo", ["ruiz-gallo-1", "ruiz-gallo-2"]],
  ["raimondi", "no-ficcion", "Los viajes de Antonio Raimondi", ["raimondi-1", "raimondi-2"]],

  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2"]],
  ["matices", "vocabulario", "Matices y connotación", ["matices-1", "matices-2"]],
  ["homofonos", "vocabulario", "Homófonos y definiciones", ["homofonos-1", "homofonos-2", "homofonos-3"]],
  ["analogias", "vocabulario", "Analogías", ["analogias-1", "analogias-2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["contexto-1", "contexto-2", "contexto-3", "contexto-4"]],
  ["academico", "vocabulario", "Vocabulario académico y de las áreas", ["academico-1", "academico-2", "academico-3"]],
  ["diccionario", "vocabulario", "Uso del diccionario", ["diccionario-1", "diccionario-2", "diccionario-3", "diccionario-4", "diccionario-5"]],

  ["prefijos", "raices", "Prefijos", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4", "prefijos-5", "prefijos-6"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["sufijos-1", "sufijos-2"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["griegas-latinas-1", "griegas-latinas-2", "griegas-latinas-3", "griegas-latinas-4"]],

  ["prefijos-ortografia", "ortografia", "Prefijos ante-, inter-, super-, trans-; sufijos -al, -ción, -sión", ["prefijos-ortografia-1", "prefijos-ortografia-2", "prefijos-ortografia-3"]],
  ["raices-ortografia", "ortografia", "Raíces aud, yect, dic y duc", ["raices-ortografia-1", "raices-ortografia-2", "raices-ortografia-3"]],
  ["b-v", "ortografia", "b en -aba y -bir; v después de n, l, d y b", ["b-v-1", "b-v-2", "b-v-3"]],
  ["g-tildes", "ortografia", "g en -gen, -gía y geo-; palabras con tilde", ["g-tildes-1", "g-tildes-2", "g-tildes-3", "g-tildes-4"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["confundidas-1", "confundidas-2"]],

  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5"]],
  ["explicativos", "puntuacion", "Elementos explicativos y especificativos", ["explicativos-1", "explicativos-2"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["punto-y-coma-1", "punto-y-coma-2"]],
  ["raya-suspensivos", "puntuacion", "La raya y los puntos suspensivos", ["raya-suspensivos-1", "raya-suspensivos-2"]],
  ["guion", "puntuacion", "El guion en adjetivos compuestos", ["guion"], X],
  ["mayusculas", "puntuacion", "Mayúsculas y títulos", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4"]],
  ["citas-dialogos", "puntuacion", "Direcciones, citas y diálogos", ["citas-dialogos-1", "citas-dialogos-2"]],

  ["oracion", "oraciones", "Clases de oración, sujeto, predicado y sus núcleos", ["oracion-1", "oracion-2", "oracion-3", "oracion-4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["fragmentos-1", "fragmentos-2", "fragmentos-3"]],
  ["frase-proposicion", "oraciones", "Frases, proposiciones y aposiciones", ["frase-proposicion-1", "frase-proposicion-2"]],
  ["subordinadas", "oraciones", "Coordinación y subordinación", ["subordinadas-1", "subordinadas-2", "subordinadas-3"]],
  ["objetos", "oraciones", "Objeto directo e indirecto", ["objetos"]],

  ["antecedentes", "pronombres", "Pronombres y antecedentes", ["antecedentes-1", "antecedentes-2", "antecedentes-3", "antecedentes-4", "antecedentes-5"]],
  ["personales", "pronombres", "Pronombres de sujeto y de complemento", ["personales-1", "personales-2", "personales-3"]],
  ["reflexivos", "pronombres", "Reflexivos y enfáticos", ["reflexivos-1", "reflexivos-2", "reflexivos-3"]],
  ["relativos", "pronombres", "Pronombres relativos", ["relativos-1", "relativos-2"]],

  ["plurales", "gramatica", "Plurales, compuestos y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["adjetivos-adverbios-1", "adjetivos-adverbios-2", "adjetivos-adverbios-3", "adjetivos-adverbios-4", "adjetivos-adverbios-5"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["comparar-1", "comparar-2", "comparar-3", "comparar-4"]],
  ["preposiciones", "gramatica", "Frases con preposición y conjunciones correlativas", ["preposiciones-1", "preposiciones-2"]],
  ["modificadores", "gramatica", "Modificadores mal colocados", ["modificadores-1", "modificadores-2", "modificadores-3"], X],

  ["transitivos", "verbos", "Transitivos, intransitivos y copulativos", ["transitivos-1", "transitivos-2"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2", "concordancia-3"]],
  ["tiempos", "verbos", "Tiempos simples, progresivos y compuestos", ["tiempos-1", "tiempos-2", "tiempos-3", "tiempos-4", "tiempos-5"]],
  ["verboides", "verbos", "Participios, gerundios e infinitivos", ["verboides-1", "verboides-2", "verboides-3"]],
  ["modos", "verbos", "Indicativo, subjuntivo e imperativo", ["modos-1", "modos-2"]],
  ["voz-pasiva", "verbos", "Voz activa y voz pasiva", ["voz-pasiva-1", "voz-pasiva-2"]],

  ["organizar", "escribir", "Organiza las ideas", ["organizar-1", "organizar-2", "organizar-3", "organizar-4"]],
  ["estilo", "escribir", "Varía las oraciones y elige verbos precisos", ["estilo-1", "estilo-2"]],
  ["claridad", "escribir", "Conectores, paralelismo y redundancias", ["claridad-1", "claridad-2", "claridad-3"]],
  ["corregir", "escribir", "Corrige y revisa", ["corregir-1", "corregir-2", "corregir-3"]],

  ["tesis", "argumentar", "Hechos, opiniones, tesis y evidencias", ["tesis-1", "tesis-2", "tesis-3", "tesis-4", "tesis-5"]],
  ["contraargumentos", "argumentar", "Contraargumentos", ["contraargumentos"]],
  ["apelaciones", "argumentar", "Ethos, pathos y logos en los anuncios", ["apelaciones"]],
  ["falacias", "argumentar", "Falacias", ["falacias"], X],
  ["fuentes", "argumentar", "Fuentes, titulares sesgados y plagio", ["fuentes-1", "fuentes-2", "fuentes-3"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["apa-1", "apa-2"]],
];

export const COMUNICACION_S2 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
