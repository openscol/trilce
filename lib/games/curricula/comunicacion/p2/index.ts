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
  ["cuentos-oidos", "escuchar", "Escucha cuentos", ["DD.1", "DD.2", "DD.3"]],
  ["textos-oidos", "escuchar", "Escucha textos informativos", ["FF.1", "FF.2", "FF.3", "FF.4"]],

  ["rimas", "sonidos", "Rimas y adivinanzas", ["A.1", "A.2", "A.3", "A.4", "A.5", "A.6"]],
  ["silabas", "sonidos", "Cuenta sílabas", ["B.1", "B.2"]],
  ["cambiar-sonidos", "sonidos", "Cambia o quita un sonido", ["C.1", "C.2"]],
  ["abiertas-cerradas", "sonidos", "Sílabas abiertas y cerradas", ["O.1", "O.2", "O.3", "O.4", "O.5"]],

  ["digrafos", "digrafos", "ch, ll, rr, qu, gu y letras mudas", ["D.1", "D.2", "D.3", "D.4", "D.5", "D.6", "D.7"]],
  ["trabadas", "digrafos", "Trabadas", ["E.1", "E.2", "E.3", "E.4", "E.6", "E.7", "E.8"]],
  ["bl-cl-gl-pl", "digrafos", "bl, cl, gl y pl", ["P.3", "P.4", "P.5", "P.6", "P.7"]],
  ["diptongos", "digrafos", "Diptongos ie y ue", ["H.1", "H.2", "H.3", "H.4"]],
  ["vocal-diptongo", "digrafos", "¿Vocal sola o diptongo?", ["I.1", "I.2", "I.3", "I.4", "I.5", "I.6", "I.7"]],
  ["diptongos-ai-au", "digrafos", "Diptongos ai, au, ei, eu y oi", ["L.1", "L.2", "L.3", "P.1", "P.2"]],

  ["vocales", "leer-palabras", "Escribe palabras con cada vocal", ["F.1", "F.2", "F.3", "F.4", "F.5", "F.6", "F.7"]],
  ["varias-silabas", "leer-palabras", "Palabras de dos sílabas", ["Q.1", "Q.2", "Q.3", "Q.4", "Q.5", "Q.6"]],
  ["frecuentes", "leer-palabras", "Palabras frecuentes", ["S.1", "S.2", "S.3"]],
  ["prefijos-lectura", "leer-palabras", "Lee palabras con prefijos y sufijos", ["R.1", "R.2"]],

  ["cuentos-sencillos", "cuentos-letras", "Cuentos con palabras sencillas y con h", ["T.1", "T.2"]],
  ["cuentos-patrones", "cuentos-letras", "Cuentos con c, qu, g, gu, z, j, r y rr", ["T.3", "T.4", "T.5", "T.6", "T.7"]],

  ["idea-principal", "comprension", "Tema e idea principal", ["U.1", "U.2"]],
  ["inferencias", "comprension", "Haz inferencias", ["V.1", "V.2"]],
  ["ensenanza", "comprension", "La enseñanza de mitos, fábulas y leyendas", ["V.3"]],
  ["proposito", "comprension", "El propósito del autor", ["W.1", "W.2"]],
  ["personajes", "comprension", "Escenario y personajes", ["X.1", "X.2", "X.3"]],
  ["secuencia", "comprension", "El orden de los hechos", ["Y.1", "Y.2", "Z.1"]],
  ["causa-efecto", "comprension", "Causa y efecto", ["AA.1", "AA.2"]],
  ["comparar", "comprension", "Compara y contrasta", ["BB.1"]],

  ["partes-texto", "textos", "Las partes de un texto", ["CC.1"]],
  ["cuentos", "textos", "Lee fantasías, cuentos realistas y ciencia ficción", ["EE.1", "EE.2", "EE.3"]],
  ["informativos", "textos", "Lee sobre animales, deportes, lugares y personajes", ["GG.1", "GG.2", "GG.3", "GG.4"]],

  ["prefijos-sufijos", "vocabulario", "Prefijos y sufijos", ["OO.1", "OO.2", "OO.3", "OO.4", "OO.5", "OO.6"]],
  ["compuestas", "vocabulario", "Palabras compuestas", ["PP.1", "PP.2", "PP.3"]],
  ["categorias", "vocabulario", "Categorías", ["QQ.1", "QQ.2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["RR.1", "RR.2", "RR.3", "RR.4", "RR.5", "RR.6"]],
  ["varios-significados", "vocabulario", "Varios significados y pistas del contexto", ["SS.4", "VV.1"]],
  ["matices", "vocabulario", "Matices de significado", ["TT.1", "TT.2", "TT.3", "TT.4"]],
  ["expresiones", "vocabulario", "Expresiones y frases hechas", ["UU.1"]],
  ["orden-alfabetico", "vocabulario", "Orden alfabético", ["WW.1", "WW.2", "WW.3"]],
  ["homofonos", "vocabulario", "Homófonos", ["SS.1", "SS.2", "SS.3"], X],
  ["diccionario", "vocabulario", "Palabras guía y entradas del diccionario", ["WW.4", "WW.5"], X],

  ["h-muda", "ortografia", "La h muda", ["G.1", "G.2", "G.3", "G.4"]],
  ["patrones", "ortografia", "c o qu, g o gu, c o z, g o j", ["J.1", "J.2", "J.3", "J.4", "J.5", "J.7"]],
  ["r-rr", "ortografia", "r suave y r fuerte", ["J.6", "K.1", "K.2", "K.3", "K.4"]],
  ["gue-gui", "ortografia", "gue, gui, güe y güi", ["M.1", "M.2"]],
  ["c-g-suave", "ortografia", "c y g: suave o fuerte", ["N.1", "N.2", "N.3", "N.4"]],
  ["mp-mb", "ortografia", "m antes de p y b", ["E.5"]],
  ["sufijos", "ortografia", "Cambios al agregar sufijos", ["XX.1", "XX.2", "XX.3", "XX.4"]],

  ["mayusculas", "puntuacion", "Mayúsculas en nombres, lugares y títulos", ["JJJ.1", "JJJ.2", "JJJ.3", "JJJ.4", "JJJ.5"]],
  ["comas", "puntuacion", "Comas en enumeraciones, fechas y lugares", ["III.1", "III.2", "III.3", "III.4"]],
  ["cartas", "puntuacion", "Saludos y despedidas de las cartas", ["JJJ.6"]],
  ["abreviaturas", "puntuacion", "Abreviaturas de días y meses", ["LLL.1", "LLL.2"], X],

  ["tipos-oracion", "oraciones", "Tipos de oración", ["YY.1"]],
  ["sujeto-predicado", "oraciones", "Sujeto y predicado", ["YY.2", "YY.3"]],
  ["oracion-completa", "oraciones", "¿Oración completa o fragmento?", ["YY.4", "YY.7"]],
  ["pegadas", "oraciones", "Oraciones pegadas", ["YY.5", "YY.6"], X],

  ["sustantivos", "gramatica", "Sustantivos comunes y propios", ["ZZ.1", "ZZ.2", "ZZ.3", "ZZ.4", "ZZ.5"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["ZZ.6", "ZZ.7", "ZZ.8", "ZZ.9", "ZZ.10", "ZZ.11", "ZZ.12", "ZZ.13"]],
  ["pronombres", "gramatica", "Pronombres personales", ["AAA.1", "AAA.2", "AAA.3", "AAA.4", "AAA.5", "AAA.6"]],
  ["posesivos", "gramatica", "Pronombres posesivos", ["AAA.7", "AAA.8"]],
  ["reflexivos", "gramatica", "Pronombres reflexivos", ["AAA.9", "AAA.10"], X],
  ["articulos", "gramatica", "Artículos", ["EEE.1", "EEE.2"]],
  ["adjetivos", "gramatica", "Adjetivos", ["FFF.1", "FFF.2", "FFF.3", "FFF.4"]],
  ["adverbios", "gramatica", "Adverbios", ["FFF.5", "FFF.6", "FFF.7", "FFF.8"], X],
  ["preposiciones", "gramatica", "Preposiciones", ["GGG.1", "GGG.2"]],
  ["contracciones", "gramatica", "al, del, conmigo y contigo", ["HHH.1", "HHH.2", "HHH.3", "HHH.4", "HHH.5", "HHH.6"]],

  ["tipos-verbos", "verbos", "Verbos de acción y auxiliares", ["BBB.1", "BBB.2", "BBB.3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["CCC.1", "CCC.2", "CCC.3"]],
  ["pasado-regular", "verbos", "Pasado, presente y futuro", ["DDD.1", "DDD.2", "DDD.3", "DDD.4", "DDD.5", "DDD.12", "DDD.18"]],
  ["pasado-irregular", "verbos", "Verbos irregulares en pasado", ["DDD.6", "DDD.7", "DDD.8", "DDD.9", "DDD.10", "DDD.11", "DDD.17"]],
  ["ser-estar", "verbos", "Ser, estar y tener", ["DDD.13", "DDD.14", "DDD.15", "DDD.16"]],

  ["ordenar", "escribir", "Ordena las oraciones", ["HH.1"]],
  ["oracion-tematica", "escribir", "La oración temática", ["II.1", "II.2", "II.3"]],
  ["conectores", "escribir", "Conectores y palabras de orden", ["JJ.1", "JJ.2", "JJ.3", "JJ.4", "JJ.5"]],
  ["proposito-escritor", "escribir", "Escribe según el propósito", ["KK.1"]],
  ["opinion", "escribir", "Escribe una opinión", ["LL.1", "LL.2", "LL.3", "LL.4"]],
  ["detalles", "escribir", "Agrega detalles y diálogos", ["MM.1", "MM.2", "MM.3", "MM.4", "MM.5"]],
  ["unir-oraciones", "escribir", "Une y varía oraciones", ["NN.1", "NN.2", "NN.3", "NN.4"]],
];

export const COMUNICACION_P2 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
