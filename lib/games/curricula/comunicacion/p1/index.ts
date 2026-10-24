import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · 1.° de Primaria, organizado según el CNEB (ciclo III). El
// modo CNEB trae: escuchar y comprender textos orales, la conciencia
// fonológica, la relación entre letras y sonidos, leer palabras, oraciones y
// textos breves (cuentos, fábulas, textos informativos), deducir y opinar
// sobre lo leído, y escribir palabras y oraciones con las primeras
// convenciones (mayúscula, punto, signos). Lo marcado `extendido` adelanta
// 2.° (prefijos y sufijos, matices de significado, comparativos, verbos
// irregulares). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [fundamentos, lectura, vocabulario, gramatica];

const SECTIONS: Section[] = [
  { id: "escuchar", name: "Escucho y comprendo", icon: "👂", topic: "escucha" },
  { id: "sonidos", name: "Juego con los sonidos", icon: "🎵", topic: "letras-sonidos" },
  { id: "vocales", name: "Leo palabras con vocales", icon: "🅰️", topic: "letras-sonidos" },
  { id: "silabas", name: "Sílabas, dígrafos y trabadas", icon: "🔤", topic: "letras-sonidos" },
  { id: "frecuentes", name: "Palabras frecuentes", icon: "⭐", topic: "letras-sonidos" },
  { id: "cuentos-letras", name: "Leo cuentos cortos", icon: "📚", topic: "comprension" },
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "textos", name: "Leo textos variados", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "oraciones", name: "Oraciones y signos", icon: "❗", topic: "puntuacion" },
  { id: "gramatica", name: "Las palabras en la oración", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
];

export const GAMES: Game[] = [
  ["cuentos-oidos", "escuchar", "Escucha cuentos y poemas", ["cuentos-oidos-1", "cuentos-oidos-2", "cuentos-oidos-3"]],
  ["textos-oidos", "escuchar", "Escucha textos informativos", ["textos-oidos-1", "textos-oidos-2", "textos-oidos-3"]],
  ["problema-solucion", "escuchar", "Escucha y encuentra el problema", ["problema-solucion"]],

  ["vocal-consonante", "sonidos", "Vocales y consonantes", ["vocal-consonante-1", "vocal-consonante-2"]],
  ["rimas", "sonidos", "Rimas y poemas", ["rimas-1", "rimas-2", "rimas-3", "rimas-4", "rimas-5"]],
  ["contar-silabas", "sonidos", "Cuenta sílabas", ["contar-silabas-1", "contar-silabas-2"]],
  ["unir-sonidos", "sonidos", "Une, separa y ordena sonidos", ["unir-sonidos-1", "unir-sonidos-2", "unir-sonidos-3"]],
  ["cambiar-sonidos", "sonidos", "Cambia un sonido", ["cambiar-sonidos-1", "cambiar-sonidos-2", "cambiar-sonidos-3", "cambiar-sonidos-4"]],
  ["sonido-letra", "sonidos", "Sonido inicial y final", ["sonido-letra-1", "sonido-letra-2", "sonido-letra-3", "sonido-letra-4"]],

  ["palabras-a", "vocales", "Palabras con a", ["palabras-a-1", "palabras-a-2", "palabras-a-3", "palabras-a-4", "palabras-a-5", "palabras-a-6"]],
  ["palabras-e", "vocales", "Palabras con e", ["palabras-e-1", "palabras-e-2", "palabras-e-3", "palabras-e-4", "palabras-e-5"]],
  ["palabras-i", "vocales", "Palabras con i", ["palabras-i-1", "palabras-i-2", "palabras-i-3", "palabras-i-4"]],
  ["palabras-o", "vocales", "Palabras con o", ["palabras-o-1", "palabras-o-2", "palabras-o-3", "palabras-o-4", "palabras-o-5"]],
  ["palabras-u", "vocales", "Palabras con u", ["palabras-u-1", "palabras-u-2", "palabras-u-3", "palabras-u-4"]],
  ["palabras-cortas", "vocales", "Lee y escribe palabras cortas", ["palabras-cortas-1", "palabras-cortas-2", "palabras-cortas-3", "palabras-cortas-4", "palabras-cortas-5", "palabras-cortas-6", "palabras-cortas-7"]],
  ["misma-vocal", "vocales", "Palabras con la misma vocal", ["misma-vocal-1", "misma-vocal-2", "misma-vocal-3"]],

  ["dos-silabas", "silabas", "Palabras de dos sílabas", ["dos-silabas-1", "dos-silabas-2", "dos-silabas-3", "dos-silabas-4", "dos-silabas-5", "dos-silabas-6"]],
  ["digrafos", "silabas", "ch, ll, rr y qu", ["digrafos-1", "digrafos-2", "digrafos-3", "digrafos-4", "digrafos-5"]],
  ["trabadas", "silabas", "Trabadas", ["trabadas-1", "trabadas-2", "trabadas-3", "trabadas-4", "trabadas-5", "trabadas-6"]],
  ["diptongos", "silabas", "Diptongos", ["diptongos-1", "diptongos-2", "diptongos-3", "diptongos-4"]],
  ["r-y", "silabas", "La r y la y", ["r-y-1", "r-y-2", "r-y-3", "r-y-4"]],

  ["frecuentes-1", "frecuentes", "Palabras frecuentes: grupos 1 al 3", ["frecuentes-1-1", "frecuentes-1-2", "frecuentes-1-3", "frecuentes-1-4"]],
  ["frecuentes-2", "frecuentes", "Palabras frecuentes: grupos 4 al 7", ["frecuentes-2-1", "frecuentes-2-2", "frecuentes-2-3", "frecuentes-2-4", "frecuentes-2-5", "frecuentes-2-6"]],
  ["frecuentes-oracion", "frecuentes", "Completa con la palabra frecuente", ["frecuentes-oracion-1", "frecuentes-oracion-2", "frecuentes-oracion-3", "frecuentes-oracion-4"]],

  ["cuentos-vocales", "cuentos-letras", "Cuentos con cada vocal", ["cuentos-vocales-1", "cuentos-vocales-2", "cuentos-vocales-3", "cuentos-vocales-4", "cuentos-vocales-5", "cuentos-vocales-6"]],
  ["cuentos-sonidos", "cuentos-letras", "Cuentos con h, diptongos y r", ["cuentos-sonidos-1", "cuentos-sonidos-2", "cuentos-sonidos-3", "cuentos-sonidos-4", "cuentos-sonidos-5", "cuentos-sonidos-6"]],

  ["real-fantasia", "comprension", "¿Podría pasar de verdad?", ["real-fantasia"]],
  ["de-que-trata", "comprension", "¿De qué trata?", ["de-que-trata-1", "de-que-trata-2"]],
  ["inferencias", "comprension", "Sentimientos, predicciones y adivinanzas", ["inferencias-1", "inferencias-2", "inferencias-3", "inferencias-4"]],
  ["ensenanza", "comprension", "La enseñanza del cuento", ["ensenanza"]],
  ["proposito", "comprension", "¿Para qué se escribió?", ["proposito"]],
  ["personajes", "comprension", "Escenario y personajes", ["personajes-1", "personajes-2", "personajes-3"]],
  ["secuencia", "comprension", "¿Qué pasó primero?", ["secuencia-1", "secuencia-2"]],
  ["elementos-cuento", "comprension", "Elementos del cuento y narrador", ["elementos-cuento-1", "elementos-cuento-2"]],

  ["partes-texto", "textos", "Las partes de un texto", ["partes-texto"]],
  ["cuentos", "textos", "Lee fantasías, cuentos y fábulas", ["cuentos-1", "cuentos-2", "cuentos-3"]],
  ["informativos", "textos", "Lee sobre animales, deportes y lugares", ["informativos-1", "informativos-2", "informativos-3"]],

  ["sustantivos-adjetivos", "vocabulario", "Nombres, cualidades y números", ["sustantivos-adjetivos-1", "sustantivos-adjetivos-2", "sustantivos-adjetivos-3"]],
  ["categorias", "vocabulario", "Categorías", ["categorias-1", "categorias-2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["sinonimos-antonimos-1", "sinonimos-antonimos-2"]],
  ["varios-significados", "vocabulario", "Palabras con varios significados", ["varios-significados-1", "varios-significados-2"]],
  ["orden-alfabetico", "vocabulario", "Orden alfabético", ["orden-alfabetico-1", "orden-alfabetico-2"]],
  ["matices", "vocabulario", "Matices de significado", ["matices-1", "matices-2", "matices-3"], X],
  ["prefijos-sufijos", "vocabulario", "Prefijos y sufijos", ["prefijos-sufijos-1", "prefijos-sufijos-2"], X],

  ["h-muda", "ortografia", "La h muda", ["h-muda-1", "h-muda-2", "h-muda-3", "h-muda-4"]],
  ["c-qu-g-gu", "ortografia", "c o qu, g o gu, c o z, g o j", ["c-qu-g-gu-1", "c-qu-g-gu-2", "c-qu-g-gu-3", "c-qu-g-gu-4"]],
  ["r-rr", "ortografia", "r o rr", ["r-rr"]],
  ["letras-confunden", "ortografia", "Letras que se confunden", ["letras-confunden-1", "letras-confunden-2", "letras-confunden-3", "letras-confunden-4", "letras-confunden-5", "letras-confunden-6"]],
  ["mp-mb", "ortografia", "m antes de p y b", ["mp-mb"]],
  ["mayusculas", "ortografia", "Mayúsculas", ["mayusculas-1", "mayusculas-2", "mayusculas-3"]],

  ["tipos-oracion", "oraciones", "Afirmaciones, preguntas, órdenes y exclamaciones", ["tipos-oracion-1", "tipos-oracion-2", "tipos-oracion-3", "tipos-oracion-4", "tipos-oracion-5", "tipos-oracion-6"]],
  ["preguntas", "oraciones", "¿Quién, qué, cuándo, dónde o por qué?", ["preguntas"]],
  ["sujeto-predicado", "oraciones", "Sujeto y predicado", ["sujeto-predicado"]],
  ["oracion-completa", "oraciones", "Forma oraciones completas", ["oracion-completa-1", "oracion-completa-2", "oracion-completa-3"]],
  ["conectores", "oraciones", "Une ideas: y, o, pero, porque", ["conectores-1", "conectores-2", "conectores-3"]],

  ["sustantivos", "gramatica", "Sustantivos comunes y propios", ["sustantivos-1", "sustantivos-2", "sustantivos-3", "sustantivos-4", "sustantivos-5"]],
  ["plurales", "gramatica", "Singular y plural", ["plurales-1", "plurales-2", "plurales-3", "plurales-4"]],
  ["pertenencia", "gramatica", "De quién es: de, del, al", ["pertenencia-1", "pertenencia-2", "pertenencia-3", "pertenencia-4", "pertenencia-5", "pertenencia-6"]],
  ["pronombres", "gramatica", "Pronombres y posesivos", ["pronombres-1", "pronombres-2", "pronombres-3", "pronombres-4"]],
  ["posesivos-tonicos", "gramatica", "Mío, tuyo, suyo", ["posesivos-tonicos"], X],
  ["articulos", "gramatica", "Artículos", ["articulos-1", "articulos-2"]],
  ["adjetivos", "gramatica", "Adjetivos", ["adjetivos-1", "adjetivos-2", "adjetivos-3"]],
  ["comparativos", "gramatica", "Más... que y el más...", ["comparativos-1", "comparativos-2", "comparativos-3"], X],
  ["preposiciones", "gramatica", "Preposiciones", ["preposiciones-1", "preposiciones-2"]],

  ["accion", "verbos", "Verbos de acción", ["accion-1", "accion-2", "accion-3"]],
  ["concordancia", "verbos", "¿Uno o más de uno?", ["concordancia-1", "concordancia-2", "concordancia-3", "concordancia-4", "concordancia-5"]],
  ["tiempos", "verbos", "Presente, pasado y futuro", ["tiempos-1", "tiempos-2", "tiempos-3", "tiempos-4", "tiempos-5", "tiempos-6", "tiempos-7"]],
  ["irregulares", "verbos", "Verbos irregulares en pasado", ["irregulares-1", "irregulares-2"], X],
  ["ser-estar-tener", "verbos", "Ser, estar y tener", ["ser-estar-tener-1", "ser-estar-tener-2", "ser-estar-tener-3", "ser-estar-tener-4"]],
];

export const COMUNICACION_P1 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
