import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · 2.° de Primaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo III). El modo CNEB trae: escuchar y comprender textos
// orales, leer con fluidez palabras con dígrafos, trabadas y diptongos, leer
// cuentos y textos informativos, deducir causas, enseñanzas y propósitos,
// organizar ideas en orden con conectores, y escribir con mayúsculas, comas
// de enumeración y concordancia. Lo marcado `extendido` adelanta 3.°
// (pronombres reflexivos, adverbios, homófonos, abreviaturas, oraciones
// pegadas, uso del diccionario con palabras guía). Los bloques son bancos de
// juegos; aquí se decide qué ve el alumno.
export const BLOCKS = [fundamentos, lectura, escritura, vocabulario, gramatica];

const SECTIONS: Section[] = [
  { id: "escuchar", name: "Escucho y comprendo", icon: "👂", topic: "escucha" },
  { id: "sonidos", name: "Sonidos y sílabas", icon: "🎵", topic: "letras-sonidos" },
  { id: "digrafos", name: "Dígrafos, trabadas y diptongos", icon: "🔤", topic: "letras-sonidos" },
  { id: "leer-palabras", name: "Leo y escribo palabras", icon: "🔎", topic: "letras-sonidos" },
  { id: "cuentos-letras", name: "Leo cuentos cortos", icon: "📚", topic: "comprension" },
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "textos", name: "Leo textos variados", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Mayúsculas y comas", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "gramatica", name: "Las palabras en la oración", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["cuentos-oidos", "escuchar", "Escucha cuentos", ["cuentos-oidos-1", "cuentos-oidos-2", "cuentos-oidos-3"]],
  ["textos-oidos", "escuchar", "Escucha textos informativos", ["textos-oidos-1", "textos-oidos-2", "textos-oidos-3", "textos-oidos-4"]],

  ["rimas", "sonidos", "Rimas y adivinanzas", ["rimas-1", "rimas-2", "rimas-3", "rimas-4", "rimas-5", "rimas-6"]],
  ["silabas", "sonidos", "Cuenta sílabas", ["silabas-1", "silabas-2"]],
  ["cambiar-sonidos", "sonidos", "Cambia o quita un sonido", ["cambiar-sonidos-1", "cambiar-sonidos-2"]],
  ["abiertas-cerradas", "sonidos", "Sílabas abiertas y cerradas", ["abiertas-cerradas-1", "abiertas-cerradas-2", "abiertas-cerradas-3", "abiertas-cerradas-4", "abiertas-cerradas-5"]],

  ["digrafos", "digrafos", "ch, ll, rr, qu, gu y letras mudas", ["digrafos-1", "digrafos-2", "digrafos-3", "digrafos-4", "digrafos-5", "digrafos-6", "digrafos-7"]],
  ["trabadas", "digrafos", "Trabadas", ["trabadas-1", "trabadas-2", "trabadas-3", "trabadas-4", "trabadas-5", "trabadas-6", "trabadas-7"]],
  ["bl-cl-gl-pl", "digrafos", "bl, cl, gl y pl", ["bl-cl-gl-pl-1", "bl-cl-gl-pl-2", "bl-cl-gl-pl-3", "bl-cl-gl-pl-4", "bl-cl-gl-pl-5"]],
  ["diptongos", "digrafos", "Diptongos ie y ue", ["diptongos-1", "diptongos-2", "diptongos-3", "diptongos-4"]],
  ["vocal-diptongo", "digrafos", "¿Vocal sola o diptongo?", ["vocal-diptongo-1", "vocal-diptongo-2", "vocal-diptongo-3", "vocal-diptongo-4", "vocal-diptongo-5", "vocal-diptongo-6", "vocal-diptongo-7"]],
  ["diptongos-ai-au", "digrafos", "Diptongos ai, au, ei, eu y oi", ["diptongos-ai-au-1", "diptongos-ai-au-2", "diptongos-ai-au-3", "diptongos-ai-au-4", "diptongos-ai-au-5"]],

  ["vocales", "leer-palabras", "Escribe palabras con cada vocal", ["vocales-1", "vocales-2", "vocales-3", "vocales-4", "vocales-5", "vocales-6", "vocales-7"]],
  ["varias-silabas", "leer-palabras", "Palabras de dos sílabas", ["varias-silabas-1", "varias-silabas-2", "varias-silabas-3", "varias-silabas-4", "varias-silabas-5", "varias-silabas-6"]],
  ["frecuentes", "leer-palabras", "Palabras frecuentes", ["frecuentes-1", "frecuentes-2", "frecuentes-3"]],
  ["prefijos-lectura", "leer-palabras", "Lee palabras con prefijos y sufijos", ["prefijos-lectura-1", "prefijos-lectura-2"]],

  ["cuentos-sencillos", "cuentos-letras", "Cuentos con palabras sencillas y con h", ["cuentos-sencillos-1", "cuentos-sencillos-2"]],
  ["cuentos-patrones", "cuentos-letras", "Cuentos con c, qu, g, gu, z, j, r y rr", ["cuentos-patrones-1", "cuentos-patrones-2", "cuentos-patrones-3", "cuentos-patrones-4", "cuentos-patrones-5"]],

  ["idea-principal", "comprension", "Tema e idea principal", ["idea-principal-1", "idea-principal-2"]],
  ["inferencias", "comprension", "Haz inferencias", ["inferencias-1", "inferencias-2"]],
  ["ensenanza", "comprension", "La enseñanza de mitos, fábulas y leyendas", ["ensenanza"]],
  ["proposito", "comprension", "El propósito del autor", ["proposito-1", "proposito-2"]],
  ["personajes", "comprension", "Escenario y personajes", ["personajes-1", "personajes-2", "personajes-3"]],
  ["secuencia", "comprension", "El orden de los hechos", ["secuencia-1", "secuencia-2", "secuencia-3"]],
  ["causa-efecto", "comprension", "Causa y efecto", ["causa-efecto-1", "causa-efecto-2"]],
  ["comparar", "comprension", "Compara y contrasta", ["comparar"]],

  ["partes-texto", "textos", "Las partes de un texto", ["partes-texto"]],
  ["cuentos", "textos", "Lee fantasías, cuentos realistas y ciencia ficción", ["cuentos-1", "cuentos-2", "cuentos-3"]],
  ["informativos", "textos", "Lee sobre animales, deportes, lugares y personajes", ["informativos-1", "informativos-2", "informativos-3", "informativos-4"]],

  ["prefijos-sufijos", "vocabulario", "Prefijos y sufijos", ["prefijos-sufijos-1", "prefijos-sufijos-2", "prefijos-sufijos-3", "prefijos-sufijos-4", "prefijos-sufijos-5", "prefijos-sufijos-6"]],
  ["compuestas", "vocabulario", "Palabras compuestas", ["compuestas-1", "compuestas-2", "compuestas-3"]],
  ["categorias", "vocabulario", "Categorías", ["categorias-1", "categorias-2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2", "sinonimos-antonimos-3", "sinonimos-antonimos-4", "sinonimos-antonimos-5", "sinonimos-antonimos-6"]],
  ["varios-significados", "vocabulario", "Varios significados y pistas del contexto", ["varios-significados-1", "varios-significados-2"]],
  ["matices", "vocabulario", "Matices de significado", ["matices-1", "matices-2", "matices-3", "matices-4"]],
  ["expresiones", "vocabulario", "Expresiones y frases hechas", ["expresiones"]],
  ["orden-alfabetico", "vocabulario", "Orden alfabético", ["orden-alfabetico-1", "orden-alfabetico-2", "orden-alfabetico-3"]],
  ["homofonos", "vocabulario", "Homófonos", ["homofonos-1", "homofonos-2", "homofonos-3"], X],
  ["diccionario", "vocabulario", "Palabras guía y entradas del diccionario", ["diccionario-1", "diccionario-2"], X],

  ["h-muda", "ortografia", "La h muda", ["h-muda-1", "h-muda-2", "h-muda-3", "h-muda-4"]],
  ["patrones", "ortografia", "c o qu, g o gu, c o z, g o j", ["patrones-1", "patrones-2", "patrones-3", "patrones-4", "patrones-5", "patrones-6"]],
  ["r-rr", "ortografia", "r suave y r fuerte", ["r-rr-1", "r-rr-2", "r-rr-3", "r-rr-4", "r-rr-5"]],
  ["gue-gui", "ortografia", "gue, gui, güe y güi", ["gue-gui-1", "gue-gui-2"]],
  ["c-g-suave", "ortografia", "c y g: suave o fuerte", ["c-g-suave-1", "c-g-suave-2", "c-g-suave-3", "c-g-suave-4"]],
  ["mp-mb", "ortografia", "m antes de p y b", ["mp-mb"]],
  ["sufijos", "ortografia", "Cambios al agregar sufijos", ["sufijos-1", "sufijos-2", "sufijos-3", "sufijos-4"]],

  ["mayusculas", "puntuacion", "Mayúsculas en nombres, lugares y títulos", ["mayusculas-1", "mayusculas-2", "mayusculas-3", "mayusculas-4", "mayusculas-5"]],
  ["comas", "puntuacion", "Comas en enumeraciones, fechas y lugares", ["comas-1", "comas-2", "comas-3", "comas-4"]],
  ["cartas", "puntuacion", "Saludos y despedidas de las cartas", ["cartas"]],
  ["abreviaturas", "puntuacion", "Abreviaturas de días y meses", ["abreviaturas-1", "abreviaturas-2"], X],

  ["tipos-oracion", "oraciones", "Tipos de oración", ["tipos-oracion"]],
  ["sujeto-predicado", "oraciones", "Sujeto y predicado", ["sujeto-predicado-1", "sujeto-predicado-2"]],
  ["oracion-completa", "oraciones", "¿Oración completa o fragmento?", ["oracion-completa-1", "oracion-completa-2"]],
  ["pegadas", "oraciones", "Oraciones pegadas", ["pegadas-1", "pegadas-2"], X],

  ["sustantivos", "gramatica", "Sustantivos comunes y propios", ["sustantivos-1", "sustantivos-2", "sustantivos-3", "sustantivos-4", "sustantivos-5"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["plurales-1", "plurales-2", "plurales-3", "plurales-4", "plurales-5", "plurales-6", "plurales-7", "plurales-8"]],
  ["pronombres", "gramatica", "Pronombres personales", ["pronombres-1", "pronombres-2", "pronombres-3", "pronombres-4", "pronombres-5", "pronombres-6"]],
  ["posesivos", "gramatica", "Pronombres posesivos", ["posesivos-1", "posesivos-2"]],
  ["reflexivos", "gramatica", "Pronombres reflexivos", ["reflexivos-1", "reflexivos-2"], X],
  ["articulos", "gramatica", "Artículos", ["articulos-1", "articulos-2"]],
  ["adjetivos", "gramatica", "Adjetivos", ["adjetivos-1", "adjetivos-2", "adjetivos-3", "adjetivos-4"]],
  ["adverbios", "gramatica", "Adverbios", ["adverbios-1", "adverbios-2", "adverbios-3", "adverbios-4"], X],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2"]],
  ["contracciones", "gramatica", "al, del, conmigo y contigo", ["contracciones-1", "contracciones-2", "contracciones-3", "contracciones-4", "contracciones-5", "contracciones-6"]],

  ["tipos-verbos", "verbos", "Verbos de acción y auxiliares", ["tipos-verbos-1", "tipos-verbos-2", "tipos-verbos-3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["concordancia-1", "concordancia-2", "concordancia-3"]],
  ["pasado-regular", "verbos", "Pasado, presente y futuro", ["pasado-regular-1", "pasado-regular-2", "pasado-regular-3", "pasado-regular-4", "pasado-regular-5", "pasado-regular-6", "pasado-regular-7"]],
  ["pasado-irregular", "verbos", "Verbos irregulares en pasado", ["pasado-irregular-1", "pasado-irregular-2", "pasado-irregular-3", "pasado-irregular-4", "pasado-irregular-5", "pasado-irregular-6", "pasado-irregular-7"]],
  ["ser-estar", "verbos", "Ser, estar y tener", ["ser-estar-1", "ser-estar-2", "ser-estar-3", "ser-estar-4"]],

  ["ordenar", "escribir", "Ordena las oraciones", ["ordenar"]],
  ["oracion-tematica", "escribir", "La oración temática", ["oracion-tematica-1", "oracion-tematica-2", "oracion-tematica-3"]],
  ["conectores", "escribir", "Conectores y palabras de orden", ["conectores-1", "conectores-2", "conectores-3", "conectores-4", "conectores-5"]],
  ["proposito-escritor", "escribir", "Escribe según el propósito", ["proposito-escritor"]],
  ["opinion", "escribir", "Escribe una opinión", ["opinion-1", "opinion-2", "opinion-3", "opinion-4"]],
  ["detalles", "escribir", "Agrega detalles y diálogos", ["detalles-1", "detalles-2", "detalles-3", "detalles-4", "detalles-5"]],
  ["unir-oraciones", "escribir", "Une y varía oraciones", ["unir-oraciones-1", "unir-oraciones-2", "unir-oraciones-3", "unir-oraciones-4"]],
];

export const COMUNICACION_P2 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
