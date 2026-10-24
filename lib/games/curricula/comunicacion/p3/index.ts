import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 3.° de Primaria, organizado según el CNEB (ciclo IV, que
// termina en 4.°). El modo CNEB trae: leer textos narrativos, informativos y
// poéticos con varios elementos complejos, identificar la idea principal,
// deducir causas, enseñanzas y el propósito del autor, reconocer la
// estructura del texto, la sílaba tónica, el vocabulario por contexto, y
// escribir párrafos ordenados con conectores, mayúsculas, comas y
// concordancia. Lo marcado `extendido` adelanta el ciclo V (raíces griegas y
// latinas, analogías, connotación, abreviaturas de direcciones). Los bloques
// son bancos de juegos; aquí se decide qué ve el alumno.
export const BLOCKS = [fundamentos, lectura, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "palabras", name: "Leo y escribo palabras", icon: "🔤", topic: "letras-sonidos" },
  { id: "cuentos-letras", name: "Cuentos para practicar sonidos", icon: "📚", topic: "letras-sonidos" },
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Cómo está hecho el texto", icon: "🧱", topic: "tipos-texto" },
  { id: "literarios", name: "Leo cuentos y poemas", icon: "📚", topic: "literatura" },
  { id: "informativos", name: "Leo textos informativos", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "diccionario", name: "Uso el diccionario", icon: "📕", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "tildes", name: "La sílaba tónica", icon: "🖋️", topic: "tildes" },
  { id: "puntuacion", name: "Mayúsculas, comas y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["diptongos-hiatos", "palabras", "Diptongos e hiatos", ["diptongos-hiatos-1", "diptongos-hiatos-2", "diptongos-hiatos-3", "diptongos-hiatos-4", "diptongos-hiatos-5", "diptongos-hiatos-6"]],
  ["rimas", "palabras", "Rimas y adivinanzas", ["rimas"]],
  ["grupos-consonanticos", "palabras", "Grupos de consonantes y dígrafos", ["grupos-consonanticos-1", "grupos-consonanticos-2", "grupos-consonanticos-3", "grupos-consonanticos-4", "grupos-consonanticos-5", "grupos-consonanticos-6"]],
  ["r-diptongos-u", "palabras", "r y rr, diptongos y ü", ["r-diptongos-u-1", "r-diptongos-u-2", "r-diptongos-u-3"]],
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["varias-silabas-1", "varias-silabas-2", "varias-silabas-3", "varias-silabas-4", "varias-silabas-5", "varias-silabas-6"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["prefijos-lectura-1", "prefijos-lectura-2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["frecuentes-1", "frecuentes-2", "frecuentes-3", "frecuentes-4", "frecuentes-5"]],

  ["cuentos-sonidos", "cuentos-letras", "Cuentos con diptongos, hiatos, r y ü", ["cuentos-sonidos-1", "cuentos-sonidos-2", "cuentos-sonidos-3"]],

  ["idea-principal", "comprension", "La idea principal", ["idea-principal-1", "idea-principal-2", "idea-principal-3"]],
  ["inferencias", "comprension", "Inferencias y predicciones", ["inferencias-1", "inferencias-2", "inferencias-3", "inferencias-4"]],
  ["ensenanza", "comprension", "La enseñanza de mitos, fábulas y leyendas", ["ensenanza"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["proposito-1", "proposito-2", "proposito-3"]],
  ["comparar-textos", "comprension", "Compara dos textos y analiza los que buscan convencer", ["comparar-textos-1", "comparar-textos-2"]],
  ["personajes", "comprension", "Personajes y elementos del cuento", ["personajes-1", "personajes-2"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["sentidos-1", "sentidos-2"]],
  ["ilustraciones", "comprension", "Compara ilustraciones", ["ilustraciones"]],

  ["orden-hechos", "estructura", "Orden de los hechos y comparación", ["orden-hechos-1", "orden-hechos-2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["causa-efecto-1", "causa-efecto-2", "causa-efecto-3"]],
  ["estructuras", "estructura", "Estructuras del texto", ["estructuras"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["partes-texto"]],

  ["simil", "literarios", "Comparaciones (símiles)", ["simil-1", "simil-2"]],
  ["poesia", "literarios", "Rima y tipos de poemas", ["poesia-1", "poesia-2"]],
  ["ilustrados", "literarios", "Lee cuentos ilustrados", ["ilustrados-1", "ilustrados-2", "ilustrados-3", "ilustrados-4"]],
  ["realistas", "literarios", "Lee cuentos realistas, históricos y poesía", ["realistas-1", "realistas-2", "realistas-3", "realistas-4"]],

  ["informativos-1", "informativos", "Animales, alimentos, arte y deportes", ["informativos-1-1", "informativos-1-2", "informativos-1-3", "informativos-1-4"]],
  ["informativos-2", "informativos", "Personajes, lugares, tecnología y ciencia", ["informativos-2-1", "informativos-2-2", "informativos-2-3", "informativos-2-4"]],

  ["prefijos", "vocabulario", "Prefijos pre-, re-, des- e in-", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4"]],
  ["sufijos", "vocabulario", "Sufijos -mente, -eza, -dad, -able, -miento", ["sufijos-1", "sufijos-2", "sufijos-3", "sufijos-4", "sufijos-5", "sufijos-6"]],
  ["raices", "vocabulario", "Raíces griegas y latinas", ["raices-1", "raices-2", "raices-3"], X],
  ["analogias", "vocabulario", "Analogías con patrones de palabras", ["analogias-1", "analogias-2"], X],
  ["compuestas", "vocabulario", "Palabras compuestas", ["compuestas-1", "compuestas-2", "compuestas-3"]],
  ["categorias", "vocabulario", "Categorías", ["categorias-1", "categorias-2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2", "sinonimos-antonimos-3", "sinonimos-antonimos-4", "sinonimos-antonimos-5", "sinonimos-antonimos-6"]],
  ["homofonos", "vocabulario", "Homófonos", ["homofonos-1", "homofonos-2", "homofonos-3"]],
  ["homonimos", "vocabulario", "Palabras con varios significados", ["homonimos-1", "homonimos-2", "homonimos-3", "homonimos-4"]],
  ["matices", "vocabulario", "Matices de significado", ["matices-1", "matices-2"]],
  ["connotacion", "vocabulario", "Connotación positiva y negativa", ["connotacion"], X],
  ["expresiones", "vocabulario", "Expresiones", ["expresiones"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["contexto-1", "contexto-2", "contexto-3"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["orden-alfabetico-1", "orden-alfabetico-2", "orden-alfabetico-3", "orden-alfabetico-4"]],
  ["entradas", "diccionario", "Palabras guía, entradas y definiciones", ["entradas-1", "entradas-2", "entradas-3"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["prefijos-ortografia-1", "prefijos-ortografia-2"]],
  ["cambios-sufijos", "ortografia", "z por c, c por qu, g por gu", ["cambios-sufijos-1", "cambios-sufijos-2", "cambios-sufijos-3", "cambios-sufijos-4"]],

  ["silaba-tonica", "tildes", "Encuentra la sílaba tónica", ["silaba-tonica"]],

  ["mayusculas", "puntuacion", "Mayúsculas en nombres, fechas y lugares", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4", "mayusculas-5"]],
  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5"]],
  ["abreviaturas", "puntuacion", "Abreviaturas de días, meses, tratamientos y unidades", ["abreviaturas-1", "abreviaturas-2", "abreviaturas-3", "abreviaturas-4", "abreviaturas-5"]],
  ["abreviaturas-direcciones", "puntuacion", "Abreviaturas de direcciones", ["abreviaturas-direcciones-1", "abreviaturas-direcciones-2", "abreviaturas-direcciones-3"], X],
  ["formato", "puntuacion", "Cartas, direcciones y títulos", ["formato-1", "formato-2", "formato-3", "formato-4", "formato-5"]],
  ["dialogos", "puntuacion", "Puntúa los diálogos", ["dialogos"]],

  ["tipos-oracion", "oraciones", "Tipos de oración", ["tipos-oracion"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["sujeto-predicado-1", "sujeto-predicado-2", "sujeto-predicado-3"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["fragmentos-1", "fragmentos-2", "fragmentos-3", "fragmentos-4"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["compuestas-oraciones-1", "compuestas-oraciones-2"]],

  ["sustantivos", "gramatica", "Sustantivos comunes, propios y abstractos", ["sustantivos-1", "sustantivos-2", "sustantivos-3", "sustantivos-4"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6", "plurales-7"]],
  ["pronombres", "gramatica", "Pronombres personales y posesivos", ["pronombres-1", "pronombres-2", "pronombres-3", "pronombres-4", "pronombres-5", "pronombres-6"]],
  ["reflexivos", "gramatica", "Pronombres reflexivos", ["reflexivos-1", "reflexivos-2"]],
  ["articulos", "gramatica", "Artículos", ["articulos-1", "articulos-2", "articulos-3"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["adjetivos-adverbios-1", "adjetivos-adverbios-2", "adjetivos-adverbios-3", "adjetivos-adverbios-4", "adjetivos-adverbios-5", "adjetivos-adverbios-6", "adjetivos-adverbios-7"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["comparar-1", "comparar-2", "comparar-3"]],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2", "preposiciones-3", "preposiciones-4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["conjunciones-1", "conjunciones-2", "conjunciones-3", "conjunciones-4"]],

  ["tipos-verbos", "verbos", "Verbos de acción, principales y auxiliares", ["tipos-verbos-1", "tipos-verbos-2", "tipos-verbos-3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2", "concordancia-3"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["tiempos-1", "tiempos-2", "tiempos-3", "tiempos-4", "tiempos-5"]],
  ["irregulares", "verbos", "Verbos irregulares en pasado", ["irregulares-1", "irregulares-2", "irregulares-3", "irregulares-4", "irregulares-5", "irregulares-6", "irregulares-7"]],
  ["ser-estar", "verbos", "Ser, estar, tener y haber", ["ser-estar-1", "ser-estar-2"]],

  ["organizar", "escribir", "Organiza las ideas", ["organizar-1", "organizar-2", "organizar-3"]],
  ["oracion-tematica", "escribir", "La oración temática", ["oracion-tematica-1", "oracion-tematica-2", "oracion-tematica-3"]],
  ["proposito-escritor", "escribir", "Escribe según el propósito", ["proposito-escritor"]],
  ["conectores", "escribir", "Conectores", ["conectores-1", "conectores-2", "conectores-3", "conectores-4", "conectores-5", "conectores-6"]],
  ["opinion", "escribir", "Hechos, opiniones y razones", ["opinion-1", "opinion-2", "opinion-3", "opinion-4", "opinion-5", "opinion-6"]],
  ["detalles", "escribir", "Detalles, emociones y verbos precisos", ["detalles-1", "detalles-2", "detalles-3"]],
  ["variar", "escribir", "Une y varía oraciones", ["variar-1", "variar-2", "variar-3"]],
  ["corregir", "escribir", "Corrige errores", ["corregir"]],
];

export const COMUNICACION_P3 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
