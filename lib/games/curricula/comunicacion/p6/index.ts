import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 6.° de Primaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo V y la primaria). El modo CNEB trae: leer y comparar
// textos de géneros distintos, integrar información, deducir temas, tono y
// punto de vista, interpretar figuras literarias, analizar obras narrativas
// peruanas y textos de no ficción, seguir un argumento, elegir evidencias,
// evaluar fuentes y titulares, y escribir con cohesión, conectores, comas y
// concordancia de pronombres y verbos. Lo marcado `extendido` adelanta 1.° de
// secundaria (falacias, citas y referencias en formato APA, raya, verbos
// transitivos y copulativos, objeto directo e indirecto, proposiciones
// subordinadas). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Cómo está hecho el texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "obras", name: "Obras narrativas peruanas", icon: "🏔️", topic: "literatura" },
  { id: "no-ficcion", name: "Textos de no ficción", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "diccionario", name: "Uso el diccionario", icon: "📕", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación, mayúsculas y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumento e investigo", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["idea-principal", "comprension", "La idea principal", ["idea-principal-1", "idea-principal-2"]],
  ["temas", "comprension", "El tema y varios temas", ["temas-1", "temas-2", "temas-3"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["proposito-1", "proposito-2"]],
  ["tono", "comprension", "Registro y tono", ["tono-1", "tono-2"]],
  ["literatura", "comprension", "Narrador, inferencias y análisis de cuentos", ["literatura-1", "literatura-2", "literatura-3"]],
  ["argumento", "comprension", "Sigue el desarrollo de un argumento", ["argumento"]],
  ["comparar-textos", "comprension", "Compara textos y géneros", ["comparar-textos-1", "comparar-textos-2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["visuales-1", "visuales-2"]],

  ["estructuras", "estructura", "Comparación, causa-efecto y problema-solución", ["estructuras-1", "estructuras-2", "estructuras-3", "estructuras-4"]],

  ["sentidos-alusion", "recursos", "Detalles sensoriales y alusiones", ["sentidos-alusion-1", "sentidos-alusion-2"]],
  ["figuras", "recursos", "Interpreta y clasifica figuras literarias", ["figuras-1", "figuras-2", "figuras-3"]],
  ["rima", "recursos", "El esquema de rima", ["rima"]],
  ["personificacion", "recursos", "Usa la personificación", ["personificacion"]],

  ["caballero-carmelo", "obras", "«El caballero Carmelo»", ["caballero-carmelo-1", "caballero-carmelo-2"]],
  ["paco-yunque", "obras", "«Paco Yunque»", ["paco-yunque-1", "paco-yunque-2"]],
  ["cuentos-selva", "obras", "«Cuentos de la selva»", ["cuentos-selva-1", "cuentos-selva-2"]],

  ["informativos", "no-ficcion", "Animales, lugares, tecnología, ciencia e historia", ["informativos-1", "informativos-2", "informativos-3", "informativos-4", "informativos-5"]],
  ["tubman", "no-ficcion", "Harriet Tubman", ["tubman-1", "tubman-2"]],
  ["malala", "no-ficcion", "Malala Yousafzai", ["malala-1", "malala-2"]],
  ["chicago", "no-ficcion", "El gran incendio de Chicago", ["chicago-1", "chicago-2"]],

  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2", "sinonimos-antonimos-3", "sinonimos-antonimos-4"]],
  ["homofonos", "vocabulario", "Homófonos y definiciones", ["homofonos-1", "homofonos-2", "homofonos-3"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["modismos-1", "modismos-2", "modismos-3", "modismos-4"]],
  ["matices", "vocabulario", "Matices y connotación", ["matices-1", "matices-2"]],
  ["analogias", "vocabulario", "Analogías", ["analogias-1", "analogias-2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["contexto-1", "contexto-2", "contexto-3", "contexto-4"]],
  ["academico", "vocabulario", "Vocabulario académico y de las áreas", ["academico-1", "academico-2", "academico-3"]],

  ["prefijos", "raices", "Prefijos", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4", "prefijos-5", "prefijos-6"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["sufijos-1", "sufijos-2"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["griegas-latinas-1", "griegas-latinas-2", "griegas-latinas-3", "griegas-latinas-4", "griegas-latinas-5"]],

  ["diccionario", "diccionario", "Orden alfabético, palabras guía y entradas", ["diccionario-1", "diccionario-2", "diccionario-3", "diccionario-4", "diccionario-5"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["prefijos-ortografia-1", "prefijos-ortografia-2", "prefijos-ortografia-3"]],
  ["raices-ortografia", "ortografia", "Escribe palabras con raíces latinas", ["raices-ortografia-1", "raices-ortografia-2", "raices-ortografia-3"]],
  ["h-g-j", "ortografia", "h intermedia, g y j", ["h-g-j-1", "h-g-j-2", "h-g-j-3"]],
  ["cion-sion-b-v", "ortografia", "-ción, -sión, -cción, b y v", ["cion-sion-b-v-1", "cion-sion-b-v-2", "cion-sion-b-v-3", "cion-sion-b-v-4"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["confundidas-1", "confundidas-2"]],

  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5"]],
  ["comas-compuestas", "puntuacion", "Comas en oraciones compuestas", ["comas-compuestas"]],
  ["sugiere", "puntuacion", "¿Qué sugiere la puntuación?", ["sugiere"]],
  ["raya", "puntuacion", "La raya", ["raya"], X],
  ["mayusculas", "puntuacion", "Mayúsculas y títulos", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4"]],
  ["citas-dialogos", "puntuacion", "Direcciones, citas y diálogos", ["citas-dialogos-1", "citas-dialogos-2"]],

  ["tipos-oracion", "oraciones", "Clases de oraciones", ["tipos-oracion"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado, núcleos y compuestos", ["sujeto-predicado-1", "sujeto-predicado-2", "sujeto-predicado-3"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["fragmentos-1", "fragmentos-2", "fragmentos-3"]],
  ["subordinadas", "oraciones", "Proposiciones subordinadas", ["subordinadas-1", "subordinadas-2"], X],
  ["objetos", "oraciones", "Objeto directo e indirecto", ["objetos"], X],

  ["antecedentes", "pronombres", "Pronombres y antecedentes", ["antecedentes-1", "antecedentes-2", "antecedentes-3", "antecedentes-4", "antecedentes-5"]],
  ["personales", "pronombres", "Pronombres personales y posesivos", ["personales-1", "personales-2", "personales-3", "personales-4"]],
  ["reflexivos", "pronombres", "Reflexivos y enfáticos", ["reflexivos-1", "reflexivos-2", "reflexivos-3"]],
  ["relativos", "pronombres", "Pronombres relativos", ["relativos-1", "relativos-2", "relativos-3"]],

  ["plurales", "gramatica", "Sustantivos, plurales y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6", "plurales-7", "plurales-8"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["adjetivos-adverbios-1", "adjetivos-adverbios-2", "adjetivos-adverbios-3", "adjetivos-adverbios-4", "adjetivos-adverbios-5", "adjetivos-adverbios-6"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["comparar-1", "comparar-2", "comparar-3", "comparar-4"]],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2", "preposiciones-3", "preposiciones-4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["conjunciones-1", "conjunciones-2", "conjunciones-3", "conjunciones-4", "conjunciones-5", "conjunciones-6", "conjunciones-7"]],

  ["auxiliares", "verbos", "Verbos auxiliares y perífrasis", ["auxiliares-1", "auxiliares-2", "auxiliares-3"]],
  ["transitivos", "verbos", "Transitivos, intransitivos y copulativos", ["transitivos-1", "transitivos-2"], X],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2"]],
  ["tiempos", "verbos", "Tiempos verbales", ["tiempos-1", "tiempos-2", "tiempos-3"]],
  ["gerundio", "verbos", "Estar + gerundio", ["gerundio-1", "gerundio-2"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["compuestos-1", "compuestos-2", "compuestos-3"]],

  ["organizar", "escribir", "Organiza las ideas", ["organizar-1", "organizar-2", "organizar-3", "organizar-4"]],
  ["estilo", "escribir", "Varía las oraciones y elige verbos precisos", ["estilo-1", "estilo-2"]],
  ["conectores", "escribir", "Conectores: sin embargo, por lo tanto, además", ["conectores"]],
  ["corregir", "escribir", "Corrige y revisa", ["corregir-1", "corregir-2", "corregir-3"]],

  ["hecho-opinion", "argumentar", "Hechos, opiniones y evidencias", ["hecho-opinion-1", "hecho-opinion-2", "hecho-opinion-3", "hecho-opinion-4"]],
  ["contraargumentos", "argumentar", "Contraargumentos", ["contraargumentos"]],
  ["falacias", "argumentar", "Falacias", ["falacias"], X],
  ["fuentes", "argumentar", "Fuentes pertinentes, titulares sesgados y plagio", ["fuentes-1", "fuentes-2", "fuentes-3"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["apa-1", "apa-2"], X],
];

export const COMUNICACION_P6 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
