import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 5.° de Primaria, organizado según el CNEB (ciclo V, que
// termina en 6.°). El modo CNEB trae: leer textos de estructura compleja,
// integrar información de varios textos, deducir temas, el propósito, el
// punto de vista y el tono, interpretar figuras literarias y alusiones,
// resumir, argumentar con razones y detalles de apoyo, investigar en fuentes
// sin plagiar, la tildación general y de hiatos, y la gramática del verbo
// (tiempos simples y compuestos, concordancia, perífrasis). Lo marcado
// `extendido` adelanta secundaria (proposiciones subordinadas y su
// puntuación). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [fundamentos, lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "palabras", name: "Leo y escribo palabras", icon: "🔤", topic: "letras-sonidos" },
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Cómo está hecho el texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "literarios", name: "Leo cuentos, poemas y teatro", icon: "📚", topic: "literatura" },
  { id: "informativos", name: "Leo textos informativos", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "diccionario", name: "Uso el diccionario", icon: "📕", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "tildes", name: "Tildes", icon: "🖋️", topic: "tildes" },
  { id: "puntuacion", name: "Mayúsculas, comas y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["varias-silabas-1", "varias-silabas-2", "varias-silabas-3", "varias-silabas-4"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["prefijos-lectura-1", "prefijos-lectura-2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["frecuentes-1", "frecuentes-2"]],

  ["idea-principal", "comprension", "La idea principal", ["idea-principal-1", "idea-principal-2", "idea-principal-3"]],
  ["dos-textos", "comprension", "Integra información de dos textos", ["dos-textos-1", "dos-textos-2"]],
  ["inferencias", "comprension", "Inferencias con evidencia", ["inferencias-1", "inferencias-2"]],
  ["temas", "comprension", "El tema y varios temas", ["temas-1", "temas-2"]],
  ["proposito", "comprension", "Propósito, mensaje y puntos de vista", ["proposito-1", "proposito-2", "proposito-3"]],
  ["argumentativos", "comprension", "Analiza textos argumentativos", ["argumentativos"]],
  ["tono", "comprension", "Registro formal e informal", ["tono"]],
  ["personajes", "comprension", "Personajes", ["personajes-1", "personajes-2"]],
  ["narrador-trama", "comprension", "Narrador, elementos del cuento y trama", ["narrador-trama-1", "narrador-trama-2", "narrador-trama-3"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["sentidos-1", "sentidos-2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["visuales-1", "visuales-2"]],

  ["orden-comparacion", "estructura", "Orden de los hechos y comparación", ["orden-comparacion-1", "orden-comparacion-2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["causa-efecto-1", "causa-efecto-2"]],
  ["estructuras", "estructura", "Estructuras del texto", ["estructuras"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["partes-texto"]],

  ["simil-metafora", "recursos", "Comparaciones y metáforas", ["simil-metafora-1", "simil-metafora-2", "simil-metafora-3"]],
  ["alusion-efecto", "recursos", "Alusiones y efecto de las figuras", ["alusion-efecto-1", "alusion-efecto-2"]],
  ["poesia", "recursos", "Rima y elementos de la poesía", ["poesia-1", "poesia-2"]],

  ["ilustrados", "literarios", "Lee fantasía, cuentos realistas y ficción histórica", ["ilustrados-1", "ilustrados-2", "ilustrados-3"]],
  ["realistas", "literarios", "Lee cuentos, ficción histórica, poesía y teatro", ["realistas-1", "realistas-2", "realistas-3", "realistas-4"]],

  ["informativos-1", "informativos", "Animales, arte, lugares y deportes", ["informativos-1-1", "informativos-1-2", "informativos-1-3", "informativos-1-4"]],
  ["informativos-2", "informativos", "Personajes, tecnología, ciencia e historia", ["informativos-2-1", "informativos-2-2", "informativos-2-3", "informativos-2-4"]],

  ["categorias", "vocabulario", "Categorías", ["categorias-1", "categorias-2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2", "sinonimos-antonimos-3", "sinonimos-antonimos-4"]],
  ["analogias", "vocabulario", "Analogías", ["analogias-1", "analogias-2", "analogias-3"]],
  ["homofonos", "vocabulario", "Homófonos y palabras con varios significados", ["homofonos-1", "homofonos-2", "homofonos-3", "homofonos-4", "homofonos-5"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["modismos-1", "modismos-2", "modismos-3", "modismos-4"]],
  ["matices", "vocabulario", "Matices y connotación", ["matices-1", "matices-2"]],
  ["contexto", "vocabulario", "Pistas del contexto y vocabulario de las áreas", ["contexto-1", "contexto-2", "contexto-3", "contexto-4", "contexto-5"]],

  ["prefijos", "raices", "Prefijos pre-, re-, sub-, mal-, des-, in-, a-", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4", "prefijos-5", "prefijos-6"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["sufijos-1", "sufijos-2", "sufijos-3", "sufijos-4"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["griegas-latinas-1", "griegas-latinas-2", "griegas-latinas-3", "griegas-latinas-4", "griegas-latinas-5", "griegas-latinas-6", "griegas-latinas-7", "griegas-latinas-8"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["orden-alfabetico-1", "orden-alfabetico-2", "orden-alfabetico-3"]],
  ["entradas", "diccionario", "Palabras guía, definiciones y sinónimos", ["entradas-1", "entradas-2", "entradas-3", "entradas-4"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["prefijos-ortografia-1", "prefijos-ortografia-2", "prefijos-ortografia-3"]],
  ["mb-ll-y", "ortografia", "mb, mp, nv, ll e y", ["mb-ll-y-1", "mb-ll-y-2"]],
  ["x-cc-sc", "ortografia", "x, cc y sc", ["x-cc-sc-1", "x-cc-sc-2", "x-cc-sc-3"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["confundidas-1", "confundidas-2"]],

  ["agudas-esdrujulas", "tildes", "Agudas, graves, esdrújulas y sobresdrújulas", ["agudas-esdrujulas"]],
  ["hiatos", "tildes", "La tilde en los hiatos", ["hiatos-1", "hiatos-2"]],

  ["mayusculas", "puntuacion", "Mayúsculas", ["mayusculas-1", "mayusculas-2"]],
  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5"]],
  ["comas-subordinadas", "puntuacion", "Comas en oraciones compuestas", ["comas-subordinadas"], X],
  ["abreviaturas", "puntuacion", "Abreviaturas", ["abreviaturas-1", "abreviaturas-2", "abreviaturas-3", "abreviaturas-4"]],
  ["formato", "puntuacion", "Títulos, direcciones y diálogos", ["formato-1", "formato-2", "formato-3", "formato-4"]],

  ["tipos-oracion", "oraciones", "Clases de oraciones", ["tipos-oracion"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["sujeto-predicado-1", "sujeto-predicado-2"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["fragmentos-1", "fragmentos-2", "fragmentos-3", "fragmentos-4"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["compuestas-oraciones-1", "compuestas-oraciones-2"]],
  ["subordinadas", "oraciones", "Proposiciones principales y subordinadas", ["subordinadas-1", "subordinadas-2"], X],

  ["sustantivos", "gramatica", "Sustantivos", ["sustantivos-1", "sustantivos-2"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6", "plurales-7"]],
  ["pronombres", "gramatica", "Pronombres personales, posesivos y reflexivos", ["pronombres-1", "pronombres-2", "pronombres-3", "pronombres-4", "pronombres-5", "pronombres-6", "pronombres-7", "pronombres-8"]],
  ["relativos", "gramatica", "Pronombres relativos", ["relativos-1", "relativos-2", "relativos-3"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["adjetivos-adverbios-1", "adjetivos-adverbios-2", "adjetivos-adverbios-3", "adjetivos-adverbios-4", "adjetivos-adverbios-5", "adjetivos-adverbios-6"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["comparar-1", "comparar-2", "comparar-3", "comparar-4"]],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2", "preposiciones-3", "preposiciones-4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["conjunciones-1", "conjunciones-2", "conjunciones-3", "conjunciones-4", "conjunciones-5", "conjunciones-6"]],

  ["tipos-verbos", "verbos", "Verbos principales, auxiliares y perífrasis", ["tipos-verbos-1", "tipos-verbos-2", "tipos-verbos-3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["tiempos-1", "tiempos-2", "tiempos-3", "tiempos-4", "tiempos-5"]],
  ["gerundio", "verbos", "Estar + gerundio", ["gerundio-1", "gerundio-2"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["compuestos-1", "compuestos-2", "compuestos-3"]],

  ["organizar", "escribir", "Organiza las ideas y usa conectores", ["organizar-1", "organizar-2", "organizar-3", "organizar-4", "organizar-5", "organizar-6"]],
  ["inicio-cierre", "escribir", "Oración temática y de cierre", ["inicio-cierre-1", "inicio-cierre-2"]],
  ["resumir", "escribir", "Resume un relato", ["resumir"]],
  ["argumentos", "escribir", "Opiniones, razones y detalles de apoyo", ["argumentos-1", "argumentos-2", "argumentos-3", "argumentos-4", "argumentos-5"]],
  ["detalles", "escribir", "Emociones, verbos precisos e imágenes", ["detalles-1", "detalles-2", "detalles-3"]],
  ["variar", "escribir", "Varía las oraciones", ["variar"]],
  ["corregir", "escribir", "Corrige carteles", ["corregir"]],
  ["fuentes", "escribir", "Plagio y fuentes primarias y secundarias", ["fuentes-1", "fuentes-2"]],
];

export const COMUNICACION_P5 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
