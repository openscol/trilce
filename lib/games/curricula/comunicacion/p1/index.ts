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
  ["cuentos-oidos", "escuchar", "Escucha cuentos y poemas", ["HH.1", "HH.2", "HH.3"]],
  ["textos-oidos", "escuchar", "Escucha textos informativos", ["JJ.1", "JJ.2", "JJ.3"]],
  ["problema-solucion", "escuchar", "Escucha y encuentra el problema", ["EE.1"]],

  ["vocal-consonante", "sonidos", "Vocales y consonantes", ["A.1", "A.2"]],
  ["rimas", "sonidos", "Rimas y poemas", ["B.1", "B.2", "B.3", "B.4", "B.5"]],
  ["contar-silabas", "sonidos", "Cuenta sílabas", ["C.1", "C.2"]],
  ["unir-sonidos", "sonidos", "Une, separa y ordena sonidos", ["D.1", "D.2", "D.3"]],
  ["cambiar-sonidos", "sonidos", "Cambia un sonido", ["E.1", "E.2", "E.3", "E.4"]],
  ["sonido-letra", "sonidos", "Sonido inicial y final", ["F.1", "F.2", "F.3", "F.4"]],

  ["palabras-a", "vocales", "Palabras con a", ["H.1", "H.2", "H.3", "H.4", "H.5", "H.6"]],
  ["palabras-e", "vocales", "Palabras con e", ["I.1", "I.2", "I.3", "I.4", "I.5"]],
  ["palabras-i", "vocales", "Palabras con i", ["J.1", "J.2", "J.3", "J.4"]],
  ["palabras-o", "vocales", "Palabras con o", ["K.1", "K.2", "K.3", "K.4", "K.5"]],
  ["palabras-u", "vocales", "Palabras con u", ["L.1", "L.2", "L.3", "L.4"]],
  ["palabras-cortas", "vocales", "Lee y escribe palabras cortas", ["M.1", "M.2", "M.3", "M.4", "M.5", "M.6", "M.7"]],
  ["misma-vocal", "vocales", "Palabras con la misma vocal", ["O.1", "O.2", "O.3"]],

  ["dos-silabas", "silabas", "Palabras de dos sílabas", ["V.1", "V.2", "V.3", "V.4", "V.5", "V.6"]],
  ["digrafos", "silabas", "ch, ll, rr y qu", ["G.1", "G.2", "N.1", "N.2", "N.10"]],
  ["trabadas", "silabas", "Trabadas", ["N.3", "N.4", "N.5", "N.6", "N.7", "N.9"]],
  ["diptongos", "silabas", "Diptongos", ["Q.1", "Q.2", "Q.3", "Q.4"]],
  ["r-y", "silabas", "La r y la y", ["T.1", "T.2", "U.1", "U.2"]],

  ["frecuentes-1", "frecuentes", "Palabras frecuentes: grupos 1 al 3", ["W.1", "W.2", "W.3", "W.4"]],
  ["frecuentes-2", "frecuentes", "Palabras frecuentes: grupos 4 al 7", ["W.5", "W.6", "W.7", "W.8", "W.9", "W.10"]],
  ["frecuentes-oracion", "frecuentes", "Completa con la palabra frecuente", ["W.11", "W.12", "W.13", "W.14"]],

  ["cuentos-vocales", "cuentos-letras", "Cuentos con cada vocal", ["X.1", "X.2", "X.3", "X.4", "X.5", "X.6"]],
  ["cuentos-sonidos", "cuentos-letras", "Cuentos con h, diptongos y r", ["X.7", "X.8", "X.9", "X.10", "X.11", "X.12"]],

  ["real-fantasia", "comprension", "¿Podría pasar de verdad?", ["Y.1"]],
  ["de-que-trata", "comprension", "¿De qué trata?", ["Z.1", "Z.2"]],
  ["inferencias", "comprension", "Sentimientos, predicciones y adivinanzas", ["AA.1", "AA.2", "AA.3", "AA.4"]],
  ["ensenanza", "comprension", "La enseñanza del cuento", ["AA.5"]],
  ["proposito", "comprension", "¿Para qué se escribió?", ["BB.1"]],
  ["personajes", "comprension", "Escenario y personajes", ["CC.1", "CC.2", "CC.3"]],
  ["secuencia", "comprension", "¿Qué pasó primero?", ["DD.1", "DD.2"]],
  ["elementos-cuento", "comprension", "Elementos del cuento y narrador", ["EE.2", "FF.1"]],

  ["partes-texto", "textos", "Las partes de un texto", ["GG.1"]],
  ["cuentos", "textos", "Lee fantasías, cuentos y fábulas", ["II.1", "II.2", "II.3"]],
  ["informativos", "textos", "Lee sobre animales, deportes y lugares", ["KK.1", "KK.2", "KK.3"]],

  ["sustantivos-adjetivos", "vocabulario", "Nombres, cualidades y números", ["LL.1", "LL.2", "LL.3"]],
  ["categorias", "vocabulario", "Categorías", ["MM.1", "MM.2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["NN.1", "NN.2"]],
  ["varios-significados", "vocabulario", "Palabras con varios significados", ["OO.1", "RR.1"]],
  ["orden-alfabetico", "vocabulario", "Orden alfabético", ["SS.1", "SS.2"]],
  ["matices", "vocabulario", "Matices de significado", ["PP.1", "PP.2", "PP.3"], X],
  ["prefijos-sufijos", "vocabulario", "Prefijos y sufijos", ["QQ.1", "QQ.2"], X],

  ["h-muda", "ortografia", "La h muda", ["P.1", "P.2", "P.3", "P.4"]],
  ["c-qu-g-gu", "ortografia", "c o qu, g o gu, c o z, g o j", ["R.1", "R.2", "R.3", "R.4"]],
  ["r-rr", "ortografia", "r o rr", ["R.5"]],
  ["letras-confunden", "ortografia", "Letras que se confunden", ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"]],
  ["mp-mb", "ortografia", "m antes de p y b", ["N.8"]],
  ["mayusculas", "ortografia", "Mayúsculas", ["EEE.1", "EEE.2", "EEE.3"]],

  ["tipos-oracion", "oraciones", "Afirmaciones, preguntas, órdenes y exclamaciones", ["TT.1", "TT.2", "TT.3", "TT.4", "TT.5", "TT.6"]],
  ["preguntas", "oraciones", "¿Quién, qué, cuándo, dónde o por qué?", ["TT.7"]],
  ["sujeto-predicado", "oraciones", "Sujeto y predicado", ["TT.8"]],
  ["oracion-completa", "oraciones", "Forma oraciones completas", ["TT.9", "TT.10", "TT.11"]],
  ["conectores", "oraciones", "Une ideas: y, o, pero, porque", ["CCC.1", "CCC.2", "CCC.3"]],

  ["sustantivos", "gramatica", "Sustantivos comunes y propios", ["UU.1", "UU.2", "UU.3", "UU.4", "UU.5"]],
  ["plurales", "gramatica", "Singular y plural", ["UU.6", "UU.7", "UU.8", "UU.9"]],
  ["pertenencia", "gramatica", "De quién es: de, del, al", ["UU.10", "UU.11", "DDD.1", "DDD.2", "DDD.3", "DDD.4"]],
  ["pronombres", "gramatica", "Pronombres y posesivos", ["VV.1", "VV.2", "VV.3", "VV.4"]],
  ["posesivos-tonicos", "gramatica", "Mío, tuyo, suyo", ["VV.5"], X],
  ["articulos", "gramatica", "Artículos", ["ZZ.1", "ZZ.2"]],
  ["adjetivos", "gramatica", "Adjetivos", ["AAA.1", "AAA.2", "AAA.3"]],
  ["comparativos", "gramatica", "Más... que y el más...", ["AAA.4", "AAA.5", "AAA.6"], X],
  ["preposiciones", "gramatica", "Preposiciones", ["BBB.1", "BBB.2"]],

  ["accion", "verbos", "Verbos de acción", ["WW.1", "WW.2", "WW.3"]],
  ["concordancia", "verbos", "¿Uno o más de uno?", ["XX.1", "XX.2", "XX.3", "XX.4", "XX.5"]],
  ["tiempos", "verbos", "Presente, pasado y futuro", ["YY.1", "YY.2", "YY.3", "YY.4", "YY.5", "YY.8", "YY.9"]],
  ["irregulares", "verbos", "Verbos irregulares en pasado", ["YY.6", "YY.7"], X],
  ["ser-estar-tener", "verbos", "Ser, estar y tener", ["YY.10", "YY.11", "YY.12", "YY.13"]],
];

export const COMUNICACION_P1 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
