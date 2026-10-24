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
  ["diptongos-hiatos", "palabras", "Diptongos e hiatos", ["A.1", "A.3", "A.4", "A.5", "A.6", "A.7"]],
  ["rimas", "palabras", "Rimas y adivinanzas", ["A.2"]],
  ["grupos-consonanticos", "palabras", "Grupos de consonantes y dígrafos", ["B.1", "B.2", "B.3", "B.4", "B.5", "B.6"]],
  ["r-diptongos-u", "palabras", "r y rr, diptongos y ü", ["C.1", "C.2", "C.3"]],
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["D.2", "D.3", "D.4", "D.5", "D.6", "D.7"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["E.1", "E.2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["F.1", "F.2", "F.3", "F.4", "F.5"]],

  ["cuentos-sonidos", "cuentos-letras", "Cuentos con diptongos, hiatos, r y ü", ["G.1", "G.2", "G.3"]],

  ["idea-principal", "comprension", "La idea principal", ["H.1", "H.2", "H.3"]],
  ["inferencias", "comprension", "Inferencias y predicciones", ["I.1", "I.2", "I.3", "I.4"]],
  ["ensenanza", "comprension", "La enseñanza de mitos, fábulas y leyendas", ["I.5"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["J.1", "J.2", "J.3"]],
  ["comparar-textos", "comprension", "Compara dos textos y analiza los que buscan convencer", ["J.4", "J.5"]],
  ["personajes", "comprension", "Personajes y elementos del cuento", ["K.1", "L.1"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["N.1", "N.2"]],
  ["ilustraciones", "comprension", "Compara ilustraciones", ["P.1"]],

  ["orden-hechos", "estructura", "Orden de los hechos y comparación", ["M.1", "M.2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["M.3", "M.4", "M.5"]],
  ["estructuras", "estructura", "Estructuras del texto", ["M.6"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["Q.1"]],

  ["simil", "literarios", "Comparaciones (símiles)", ["O.1", "O.2"]],
  ["poesia", "literarios", "Rima y tipos de poemas", ["R.1", "R.2"]],
  ["ilustrados", "literarios", "Lee cuentos ilustrados", ["S.1", "S.2", "S.3", "S.4"]],
  ["realistas", "literarios", "Lee cuentos realistas, históricos y poesía", ["T.1", "T.2", "T.3", "T.4"]],

  ["informativos-1", "informativos", "Animales, alimentos, arte y deportes", ["U.1", "U.2", "U.3", "U.4"]],
  ["informativos-2", "informativos", "Personajes, lugares, tecnología y ciencia", ["V.1", "V.2", "V.3", "V.4"]],

  ["prefijos", "vocabulario", "Prefijos pre-, re-, des- e in-", ["EE.1", "EE.2", "EE.3", "EE.4"]],
  ["sufijos", "vocabulario", "Sufijos -mente, -eza, -dad, -able, -miento", ["EE.5", "EE.6", "EE.7", "EE.8", "EE.9", "EE.10"]],
  ["raices", "vocabulario", "Raíces griegas y latinas", ["FF.1", "FF.2", "FF.3"], X],
  ["analogias", "vocabulario", "Analogías con patrones de palabras", ["EE.11", "EE.12"], X],
  ["compuestas", "vocabulario", "Palabras compuestas", ["GG.1", "GG.2", "GG.3"]],
  ["categorias", "vocabulario", "Categorías", ["HH.1", "HH.2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["II.1", "II.2", "II.3", "II.4", "II.5", "II.6"]],
  ["homofonos", "vocabulario", "Homófonos", ["JJ.1", "JJ.2", "JJ.3"]],
  ["homonimos", "vocabulario", "Palabras con varios significados", ["JJ.4", "JJ.5", "JJ.6", "JJ.7"]],
  ["matices", "vocabulario", "Matices de significado", ["KK.1", "KK.2"]],
  ["connotacion", "vocabulario", "Connotación positiva y negativa", ["KK.3"], X],
  ["expresiones", "vocabulario", "Expresiones", ["LL.1"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["MM.1", "MM.2", "MM.3"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["NN.1", "NN.2", "NN.3", "NN.4"]],
  ["entradas", "diccionario", "Palabras guía, entradas y definiciones", ["NN.5", "NN.6", "NN.7"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["OO.1", "OO.2"]],
  ["cambios-sufijos", "ortografia", "z por c, c por qu, g por gu", ["OO.3", "OO.4", "OO.5", "OO.6"]],

  ["silaba-tonica", "tildes", "Encuentra la sílaba tónica", ["D.1"]],

  ["mayusculas", "puntuacion", "Mayúsculas en nombres, fechas y lugares", ["BBB.1", "BBB.2", "BBB.3", "BBB.4", "BBB.5"]],
  ["comas", "puntuacion", "La coma", ["AAA.1", "AAA.2", "AAA.3", "AAA.4", "AAA.5"]],
  ["abreviaturas", "puntuacion", "Abreviaturas de días, meses, tratamientos y unidades", ["CCC.1", "CCC.2", "CCC.3", "CCC.4", "CCC.5"]],
  ["abreviaturas-direcciones", "puntuacion", "Abreviaturas de direcciones", ["CCC.6", "CCC.7", "CCC.8"], X],
  ["formato", "puntuacion", "Cartas, direcciones y títulos", ["DDD.1", "DDD.2", "DDD.3", "DDD.4", "DDD.5"]],
  ["dialogos", "puntuacion", "Puntúa los diálogos", ["DDD.6"]],

  ["tipos-oracion", "oraciones", "Tipos de oración", ["PP.1"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["PP.2", "PP.3", "PP.4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["PP.5", "PP.6", "PP.7", "PP.10"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["PP.8", "PP.9"]],

  ["sustantivos", "gramatica", "Sustantivos comunes, propios y abstractos", ["QQ.1", "QQ.2", "QQ.3", "QQ.4"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["QQ.5", "QQ.6", "QQ.7", "QQ.8", "QQ.9", "QQ.10", "QQ.11"]],
  ["pronombres", "gramatica", "Pronombres personales y posesivos", ["RR.1", "RR.2", "RR.3", "RR.4", "RR.5", "RR.6"]],
  ["reflexivos", "gramatica", "Pronombres reflexivos", ["RR.7", "RR.8"]],
  ["articulos", "gramatica", "Artículos", ["VV.1", "VV.2", "VV.3"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["WW.1", "WW.2", "WW.3", "WW.4", "WW.5", "WW.6", "WW.7"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["WW.8", "WW.9", "WW.10"]],
  ["preposiciones", "gramatica", "Preposiciones", ["XX.1", "XX.2", "XX.3", "XX.4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["YY.1", "YY.2", "ZZ.1", "ZZ.2"]],

  ["tipos-verbos", "verbos", "Verbos de acción, principales y auxiliares", ["SS.1", "SS.2", "SS.3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["TT.1", "TT.2", "TT.3"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["UU.1", "UU.2", "UU.3", "UU.13", "UU.14"]],
  ["irregulares", "verbos", "Verbos irregulares en pasado", ["UU.4", "UU.5", "UU.6", "UU.7", "UU.8", "UU.9", "UU.10"]],
  ["ser-estar", "verbos", "Ser, estar, tener y haber", ["UU.11", "UU.12"]],

  ["organizar", "escribir", "Organiza las ideas", ["W.1", "W.2", "W.3"]],
  ["oracion-tematica", "escribir", "La oración temática", ["X.1", "X.2", "X.3"]],
  ["proposito-escritor", "escribir", "Escribe según el propósito", ["Y.1"]],
  ["conectores", "escribir", "Conectores", ["Z.1", "Z.2", "Z.3", "Z.4", "Z.5", "Z.6"]],
  ["opinion", "escribir", "Hechos, opiniones y razones", ["AA.1", "AA.2", "AA.3", "AA.4", "AA.5", "AA.6"]],
  ["detalles", "escribir", "Detalles, emociones y verbos precisos", ["BB.1", "BB.2", "BB.3"]],
  ["variar", "escribir", "Une y varía oraciones", ["CC.1", "CC.2", "CC.3"]],
  ["corregir", "escribir", "Corrige errores", ["DD.1"]],
];

export const COMUNICACION_P3 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
