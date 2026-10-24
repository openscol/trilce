import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 4.° de Primaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo IV). El modo CNEB trae: leer textos narrativos,
// informativos, poéticos y dramáticos; identificar la idea principal y el
// tema, deducir el propósito y el punto de vista del autor, analizar
// personajes, trama y estructura del texto, comparaciones y metáforas;
// palabras agudas, graves y esdrújulas; y escribir textos con oraciones
// temáticas y de cierre, conectores, argumentos, comas y mayúsculas. Lo
// marcado `extendido` adelanta el ciclo V (alusiones, efecto de las figuras
// literarias, tiempos compuestos, pronombres relativos, raíces griegas y
// latinas, fuentes y plagio). Los bloques son bancos de juegos; aquí se
// decide qué ve el alumno.
export const BLOCKS = [fundamentos, lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "palabras", name: "Leo y escribo palabras", icon: "🔤", topic: "letras-sonidos" },
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Cómo está hecho el texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "literarios", name: "Leo cuentos, poemas y teatro", icon: "📚", topic: "literatura" },
  { id: "informativos", name: "Leo textos informativos", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "diccionario", name: "Uso el diccionario", icon: "📕", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "tildes", name: "Agudas, graves y esdrújulas", icon: "🖋️", topic: "tildes" },
  { id: "puntuacion", name: "Mayúsculas, comas y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
  { id: "investigar", name: "Investigo con fuentes", icon: "🔍", topic: "redaccion", extended: true },
];

export const GAMES: Game[] = [
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["varias-silabas-1", "varias-silabas-2", "varias-silabas-3", "varias-silabas-4"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["prefijos-lectura-1", "prefijos-lectura-2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["frecuentes-1", "frecuentes-2"]],

  ["idea-principal", "comprension", "La idea principal", ["idea-principal-1", "idea-principal-2", "idea-principal-3"]],
  ["dos-textos", "comprension", "Une las ideas de dos textos", ["dos-textos-1", "dos-textos-2"]],
  ["inferencias", "comprension", "Inferencias y predicciones", ["inferencias-1", "inferencias-2", "inferencias-3", "inferencias-4"]],
  ["tema", "comprension", "El tema de mitos, fábulas y cuentos", ["tema-1", "tema-2"]],
  ["proposito", "comprension", "Propósito, mensaje y punto de vista", ["proposito-1", "proposito-2", "proposito-3"]],
  ["argumentativos", "comprension", "Analiza textos argumentativos", ["argumentativos"]],
  ["personajes", "comprension", "Personajes", ["personajes-1", "personajes-2"]],
  ["narrador-trama", "comprension", "Narrador, elementos del cuento y trama", ["narrador-trama-1", "narrador-trama-2", "narrador-trama-3"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["sentidos-1", "sentidos-2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["visuales-1", "visuales-2"]],

  ["orden-comparacion", "estructura", "Orden de los hechos y comparación", ["orden-comparacion-1", "orden-comparacion-2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["causa-efecto-1", "causa-efecto-2"]],
  ["estructuras", "estructura", "Estructuras del texto", ["estructuras"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["partes-texto"]],

  ["simil-metafora", "recursos", "Comparaciones y metáforas", ["simil-metafora-1", "simil-metafora-2", "simil-metafora-3"]],
  ["alusion", "recursos", "Alusiones", ["alusion"], X],
  ["efecto-figuras", "recursos", "El efecto de las figuras literarias", ["efecto-figuras"], X],
  ["poesia", "recursos", "Rima y elementos de la poesía", ["poesia-1", "poesia-2"]],

  ["ilustrados", "literarios", "Lee fantasía, cuentos realistas y ciencia ficción", ["ilustrados-1", "ilustrados-2", "ilustrados-3"]],
  ["realistas", "literarios", "Lee cuentos, ficción histórica, poesía y teatro", ["realistas-1", "realistas-2", "realistas-3", "realistas-4"]],

  ["informativos-1", "informativos", "Animales, arte, lugares y deportes", ["informativos-1-1", "informativos-1-2", "informativos-1-3", "informativos-1-4"]],
  ["informativos-2", "informativos", "Personajes, tecnología, ciencia e historia", ["informativos-2-1", "informativos-2-2", "informativos-2-3", "informativos-2-4"]],

  ["prefijos", "vocabulario", "Prefijos pre-, re-, des- e in-", ["prefijos-1", "prefijos-2", "prefijos-3", "prefijos-4"]],
  ["sufijos", "vocabulario", "Sufijos y familias de palabras", ["sufijos-1", "sufijos-2", "sufijos-3", "sufijos-4", "sufijos-5", "sufijos-6"]],
  ["analogias", "vocabulario", "Analogías con patrones de palabras", ["analogias-1", "analogias-2"]],
  ["raices", "vocabulario", "Raíces griegas y latinas", ["raices-1", "raices-2", "raices-3", "raices-4", "raices-5", "raices-6", "raices-7"], X],
  ["compuestas", "vocabulario", "Palabras compuestas", ["compuestas-1", "compuestas-2", "compuestas-3"]],
  ["categorias", "vocabulario", "Categorías", ["categorias-1", "categorias-2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2", "sinonimos-antonimos-3", "sinonimos-antonimos-4", "sinonimos-antonimos-5", "sinonimos-antonimos-6"]],
  ["homofonos", "vocabulario", "Homófonos", ["homofonos-1", "homofonos-2", "homofonos-3", "homofonos-4"]],
  ["homonimos", "vocabulario", "Palabras con varios significados", ["homonimos-1", "homonimos-2", "homonimos-3"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["modismos-1", "modismos-2", "modismos-3", "modismos-4"]],
  ["matices", "vocabulario", "Matices y connotación", ["matices-1", "matices-2", "matices-3"]],
  ["contexto", "vocabulario", "Pistas del contexto y vocabulario de las áreas", ["contexto-1", "contexto-2", "contexto-3", "contexto-4", "contexto-5"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["orden-alfabetico-1", "orden-alfabetico-2", "orden-alfabetico-3", "orden-alfabetico-4"]],
  ["entradas", "diccionario", "Palabras guía, definiciones y sinónimos", ["entradas-1", "entradas-2", "entradas-3", "entradas-4"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["prefijos-ortografia-1", "prefijos-ortografia-2", "prefijos-ortografia-3"]],
  ["b-v-h", "ortografia", "Palabras frecuentes con b, v y h", ["b-v-h-1", "b-v-h-2", "b-v-h-3"]],
  ["g-j-c-s-z", "ortografia", "Palabras frecuentes con g, j, c, s y z", ["g-j-c-s-z-1", "g-j-c-s-z-2", "g-j-c-s-z-3", "g-j-c-s-z-4"]],

  ["agudas-graves", "tildes", "¿Aguda, grave o esdrújula?", ["agudas-graves"]],

  ["mayusculas", "puntuacion", "Mayúsculas", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4", "mayusculas-5", "mayusculas-6"]],
  ["comas", "puntuacion", "La coma", ["comas-1", "comas-2", "comas-3", "comas-4", "comas-5", "comas-6"]],
  ["abreviaturas", "puntuacion", "Abreviaturas", ["abreviaturas-1", "abreviaturas-2", "abreviaturas-3", "abreviaturas-4", "abreviaturas-5", "abreviaturas-6", "abreviaturas-7", "abreviaturas-8"]],
  ["formato", "puntuacion", "Cartas, direcciones y títulos", ["formato-1", "formato-2", "formato-3", "formato-4", "formato-5"]],
  ["dialogos", "puntuacion", "Puntúa los diálogos", ["dialogos"]],

  ["tipos-oracion", "oraciones", "Enunciativas, interrogativas, imperativas y exclamativas", ["tipos-oracion"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["sujeto-predicado-1", "sujeto-predicado-2", "sujeto-predicado-3"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["fragmentos-1", "fragmentos-2", "fragmentos-3", "fragmentos-4"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["compuestas-oraciones-1", "compuestas-oraciones-2"]],

  ["sustantivos", "gramatica", "Sustantivos", ["sustantivos-1", "sustantivos-2", "sustantivos-3", "sustantivos-4"]],
  ["plurales", "gramatica", "Plurales", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6"]],
  ["pertenencia", "gramatica", "Frases de pertenencia", ["pertenencia-1", "pertenencia-2", "pertenencia-3"]],
  ["pronombres", "gramatica", "Pronombres personales, posesivos y reflexivos", ["pronombres-1", "pronombres-2", "pronombres-3", "pronombres-4", "pronombres-5", "pronombres-6", "pronombres-7", "pronombres-8"]],
  ["relativos", "gramatica", "Pronombres relativos", ["relativos-1", "relativos-2"]],
  ["relativos-cuyo", "gramatica", "Cuyo, el cual y donde", ["relativos-cuyo"], X],
  ["articulos", "gramatica", "Artículos", ["articulos-1", "articulos-2", "articulos-3"]],
  ["adjetivos", "gramatica", "Adjetivos", ["adjetivos-1", "adjetivos-2", "adjetivos-3", "adjetivos-4"]],
  ["adverbios", "gramatica", "Adverbios", ["adverbios-1", "adverbios-2", "adverbios-3", "adverbios-4", "adverbios-5"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["comparar-1", "comparar-2", "comparar-3", "comparar-4"]],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2", "preposiciones-3", "preposiciones-4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["conjunciones-1", "conjunciones-2", "conjunciones-3", "conjunciones-4"]],

  ["tipos-verbos", "verbos", "Clases de verbos", ["tipos-verbos-1", "tipos-verbos-2", "tipos-verbos-3"]],
  ["perifrasis", "verbos", "Poder, deber, querer y soler", ["perifrasis-1", "perifrasis-2"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2", "concordancia-3", "concordancia-4"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["tiempos-1", "tiempos-2", "tiempos-3", "tiempos-4", "tiempos-5"]],
  ["irregulares", "verbos", "Verbos irregulares", ["irregulares-1", "irregulares-2", "irregulares-3", "irregulares-4", "irregulares-5"]],
  ["ser-estar", "verbos", "Ser, estar, tener y haber", ["ser-estar-1", "ser-estar-2"]],
  ["gerundio", "verbos", "Estar + gerundio", ["gerundio-1", "gerundio-2"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["compuestos-1", "compuestos-2", "compuestos-3"], X],

  ["organizar", "escribir", "Organiza las ideas", ["organizar-1", "organizar-2", "organizar-3", "organizar-4"]],
  ["inicio-cierre", "escribir", "Oración temática y de cierre", ["inicio-cierre-1", "inicio-cierre-2"]],
  ["conectores", "escribir", "Conectores", ["conectores-1", "conectores-2", "conectores-3", "conectores-4"]],
  ["argumentos", "escribir", "Opiniones, razones y detalles de apoyo", ["argumentos-1", "argumentos-2", "argumentos-3", "argumentos-4", "argumentos-5"]],
  ["detalles", "escribir", "Emociones, verbos precisos e imágenes", ["detalles-1", "detalles-2", "detalles-3"]],
  ["variar", "escribir", "Varía las oraciones", ["variar"]],
  ["corregir", "escribir", "Corrige errores", ["corregir"]],

  ["fuentes", "investigar", "Plagio y fuentes primarias y secundarias", ["fuentes-1", "fuentes-2"]],
];

export const COMUNICACION_P4 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
