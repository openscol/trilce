import type { Section } from "../../../types";
import { cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 3.° de Secundaria, organizado según el CNEB (ciclo VII). Todo
// el grado corresponde al ciclo: lectura atenta de textos literarios e
// informativos, desarrollo de temas y personajes, tono objetivo y subjetivo,
// figuras literarias, la novela «La ciudad y los perros», textos sobre el
// Informe de la CVR, estrategias retóricas y persuasivas, documentos de
// trabajo, argumentación con evidencias, análisis y contraargumentos,
// falacias, citas APA, tilde diacrítica, leísmo, laísmo y loísmo, modos
// verbales y la puntuación de textos complejos. Los bloques son bancos de
// juegos; aquí se decide qué ve el alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprensión de lectura", icon: "📖", topic: "comprension" },
  { id: "lectura-atenta", name: "Lectura atenta", icon: "🔎", topic: "comprension" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "obras", name: "La novela y la memoria", icon: "🏔️", topic: "literatura" },
  { id: "informativos", name: "Textos informativos y funcionales", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Vocabulario", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "ortografia", name: "Ortografía y tildes", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración compuesta", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Verbos y modificadores", icon: "🧩", topic: "gramatica" },
  { id: "escribir", name: "Redacción y revisión", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumentación e investigación", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["ideas-principales", "comprension", "Una o varias ideas principales", ["ideas-principales-1", "ideas-principales-2"]],
  ["temas", "comprension", "El tema y su desarrollo", ["temas-1", "temas-2"]],
  ["proposito", "comprension", "Destinatario, propósito y perspectiva", ["proposito-1", "proposito-2"]],
  ["tono", "comprension", "Registro y tono objetivo o subjetivo", ["tono-1", "tono-2", "tono-3"]],
  ["argumentos", "comprension", "Sigue el desarrollo de un argumento", ["argumentos-1", "argumentos-2"]],

  ["literarios", "lectura-atenta", "Narrador, personajes y estructura literaria", ["literarios-1", "literarios-2", "literarios-3"]],
  ["informativos-atenta", "lectura-atenta", "Elección de palabras y estructura informativa", ["informativos-atenta-1", "informativos-atenta-2"]],
  ["cuentos", "lectura-atenta", "Analiza cuentos cortos", ["cuentos-1", "cuentos-2"]],

  ["alusiones", "recursos", "Alusiones", ["alusiones-1", "alusiones-2"]],
  ["figuras", "recursos", "Eufemismo, hipérbole, oxímoron y paradoja", ["figuras-1", "figuras-2", "figuras-3", "figuras-4"]],
  ["poesia", "recursos", "Elementos de la poesía", ["poesia"]],
  ["personificacion", "recursos", "Usa la personificación", ["personificacion"]],

  ["ciudad-perros", "obras", "«La ciudad y los perros» de Mario Vargas Llosa", ["ciudad-perros-1", "ciudad-perros-2"]],
  ["cvr", "obras", "El Informe de la CVR y la memoria", ["cvr-1", "cvr-2"]],

  ["retorica-historica", "informativos", "Estrategias retóricas en textos históricos", ["retorica-historica-1", "retorica-historica-2"]],
  ["desarrollo", "informativos", "El desarrollo de textos informativos", ["desarrollo-1", "desarrollo-2"]],
  ["trabajo", "informativos", "Correos, memorandos, cartas y avisos", ["trabajo-1", "trabajo-2"]],
  ["organizadores", "informativos", "Organizadores gráficos", ["organizadores"]],

  ["homofonos", "vocabulario", "Homófonos", ["homofonos-1", "homofonos-2"]],
  ["otras-lenguas", "vocabulario", "Etimología y expresiones de otras lenguas", ["otras-lenguas-1", "otras-lenguas-2", "otras-lenguas-3"]],
  ["precision", "vocabulario", "Exactitud, connotación y sinónimos", ["precision-1", "precision-2", "precision-3", "precision-4"]],
  ["analogias", "vocabulario", "Analogías", ["analogias-1", "analogias-2", "analogias-3", "analogias-4"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["contexto-1", "contexto-2", "contexto-3"]],
  ["diccionario", "vocabulario", "Uso del diccionario", ["diccionario-1", "diccionario-2", "diccionario-3", "diccionario-4"]],

  ["prefijos", "raices", "Prefijos", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4", "prefijos-5", "prefijos-6"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["sufijos-1", "sufijos-2"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["griegas-latinas-1", "griegas-latinas-2", "griegas-latinas-3", "griegas-latinas-4", "griegas-latinas-5"]],

  ["prefijos-ortografia", "ortografia", "Prefijos bi-, tri-, uni-; sufijos -al, -ano, -ura", ["prefijos-ortografia-1", "prefijos-ortografia-2", "prefijos-ortografia-3"]],
  ["bases-cultas", "ortografia", "Bases bio, geo, grafía, logía, foto y tele", ["bases-cultas"]],
  ["cc-ez", "ortografia", "-cc-, -ez y -eza", ["cc-ez-1", "cc-ez-2", "cc-ez-3"]],
  ["hiatos-h", "ortografia", "Hiatos con tilde y h intermedia", ["hiatos-h-1", "hiatos-h-2", "hiatos-h-3", "hiatos-h-4"]],
  ["diacritica", "ortografia", "La tilde diacrítica", ["diacritica-1", "diacritica-2"]],
  ["mal-escritas", "ortografia", "Palabras que suelen escribirse mal", ["mal-escritas-1", "mal-escritas-2"]],

  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5"]],
  ["explicativos", "puntuacion", "Elementos explicativos y especificativos", ["explicativos-1", "explicativos-2"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["punto-y-coma-1", "punto-y-coma-2", "punto-y-coma-3"]],
  ["raya-guion", "puntuacion", "Raya, guion y puntos suspensivos", ["raya-guion-1", "raya-guion-2", "raya-guion-3"]],
  ["mayusculas", "puntuacion", "Mayúsculas, títulos, citas y diálogos", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4", "mayusculas-5"]],

  ["tipos-oracion", "oraciones", "Fragmentos y oraciones pegadas", ["tipos-oracion-1", "tipos-oracion-2", "tipos-oracion-3", "tipos-oracion-4"]],
  ["frase-proposicion", "oraciones", "Frases, proposiciones y aposiciones", ["frase-proposicion-1", "frase-proposicion-2", "frase-proposicion-3"]],
  ["subordinadas", "oraciones", "Coordinación y subordinación", ["subordinadas-1", "subordinadas-2", "subordinadas-3"]],
  ["plurales", "oraciones", "Plurales y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4"]],

  ["leismo", "pronombres", "Leísmo, laísmo y loísmo", ["leismo"]],
  ["sujeto-complemento", "pronombres", "Pronombres de sujeto, de complemento y tras «que» y «como»", ["sujeto-complemento-1", "sujeto-complemento-2"]],
  ["relativos", "pronombres", "Quien, quienes y otros relativos", ["relativos-1", "relativos-2", "relativos-3"]],
  ["antecedentes", "pronombres", "Antecedentes y referencias ambiguas", ["antecedentes-1", "antecedentes-2", "antecedentes-3"]],

  ["tipos-verbos", "gramatica", "Verbos y verboides", ["tipos-verbos-1", "tipos-verbos-2", "tipos-verbos-3", "tipos-verbos-4", "tipos-verbos-5"]],
  ["concordancia", "gramatica", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2", "concordancia-3"]],
  ["tiempos-modos", "gramatica", "Tiempos y modos verbales", ["tiempos-modos-1", "tiempos-modos-2", "tiempos-modos-3", "tiempos-modos-4", "tiempos-modos-5"]],
  ["voz-pasiva", "gramatica", "Voz activa y voz pasiva", ["voz-pasiva-1", "voz-pasiva-2"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos, adverbios y comparativos", ["adjetivos-adverbios-1", "adjetivos-adverbios-2", "adjetivos-adverbios-3", "adjetivos-adverbios-4", "adjetivos-adverbios-5", "adjetivos-adverbios-6"]],
  ["modificadores", "gramatica", "Modificadores mal colocados", ["modificadores-1", "modificadores-2", "modificadores-3"]],

  ["organizar", "escribir", "Organiza las ideas, oraciones temáticas y tesis", ["organizar-1", "organizar-2", "organizar-3", "organizar-4"]],
  ["claridad", "escribir", "Conectores, comparaciones y paralelismo", ["claridad-1", "claridad-2", "claridad-3", "claridad-4", "claridad-5"]],
  ["corregir", "escribir", "Corrige y revisa", ["corregir-1", "corregir-2", "corregir-3"]],

  ["evidencias", "argumentar", "Hechos, opiniones y evidencias", ["evidencias-1", "evidencias-2", "evidencias-3", "evidencias-4"]],
  ["analisis", "argumentar", "Análisis, contraargumentos y transiciones", ["analisis-1", "analisis-2", "analisis-3"]],
  ["falacias", "argumentar", "Falacias", ["falacias"]],
  ["persuasion", "argumentar", "Ethos, pathos y logos", ["persuasion-1", "persuasion-2"]],
  ["apa", "argumentar", "Referencias APA y plagio", ["apa-1", "apa-2", "apa-3", "apa-4"]],
];

export const COMUNICACION_S3 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
