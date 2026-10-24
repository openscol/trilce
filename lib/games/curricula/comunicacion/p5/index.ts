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
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["A.2", "A.3", "A.4", "A.5"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["B.1", "B.2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["C.1", "C.2"]],

  ["idea-principal", "comprension", "La idea principal", ["D.1", "D.2", "D.3"]],
  ["dos-textos", "comprension", "Integra información de dos textos", ["D.4", "F.4"]],
  ["inferencias", "comprension", "Inferencias con evidencia", ["E.1", "E.2"]],
  ["temas", "comprension", "El tema y varios temas", ["E.3", "E.4"]],
  ["proposito", "comprension", "Propósito, mensaje y puntos de vista", ["F.1", "F.2", "F.3"]],
  ["argumentativos", "comprension", "Analiza textos argumentativos", ["F.5"]],
  ["tono", "comprension", "Registro formal e informal", ["G.1"]],
  ["personajes", "comprension", "Personajes", ["H.1", "H.2"]],
  ["narrador-trama", "comprension", "Narrador, elementos del cuento y trama", ["I.1", "I.2", "I.3"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["K.1", "K.2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["M.1", "M.2"]],

  ["orden-comparacion", "estructura", "Orden de los hechos y comparación", ["J.1", "J.2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["J.3", "J.4"]],
  ["estructuras", "estructura", "Estructuras del texto", ["J.5"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["N.1"]],

  ["simil-metafora", "recursos", "Comparaciones y metáforas", ["L.1", "L.2", "L.3"]],
  ["alusion-efecto", "recursos", "Alusiones y efecto de las figuras", ["L.4", "L.5"]],
  ["poesia", "recursos", "Rima y elementos de la poesía", ["O.1", "O.2"]],

  ["ilustrados", "literarios", "Lee fantasía, cuentos realistas y ficción histórica", ["P.1", "P.2", "P.3"]],
  ["realistas", "literarios", "Lee cuentos, ficción histórica, poesía y teatro", ["Q.1", "Q.2", "Q.3", "Q.4"]],

  ["informativos-1", "informativos", "Animales, arte, lugares y deportes", ["R.1", "R.2", "R.3", "R.4"]],
  ["informativos-2", "informativos", "Personajes, tecnología, ciencia e historia", ["S.1", "S.2", "S.3", "S.4"]],

  ["categorias", "vocabulario", "Categorías", ["DD.1", "DD.2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["EE.1", "EE.2", "EE.3", "EE.4"]],
  ["analogias", "vocabulario", "Analogías", ["FF.1", "BB.11", "BB.12"]],
  ["homofonos", "vocabulario", "Homófonos y palabras con varios significados", ["GG.1", "GG.2", "GG.3", "GG.4", "GG.5"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["HH.1", "HH.2", "HH.3", "HH.4"]],
  ["matices", "vocabulario", "Matices y connotación", ["II.1", "II.2"]],
  ["contexto", "vocabulario", "Pistas del contexto y vocabulario de las áreas", ["JJ.1", "JJ.2", "JJ.3", "JJ.4", "JJ.5"]],

  ["prefijos", "raices", "Prefijos pre-, re-, sub-, mal-, des-, in-, a-", ["BB.1", "BB.2", "BB.3", "BB.4", "BB.5", "BB.7"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["BB.6", "BB.8", "BB.9", "BB.10"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["CC.1", "CC.2", "CC.3", "CC.4", "CC.5", "CC.6", "CC.7", "CC.8"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["KK.1", "KK.2", "KK.3"]],
  ["entradas", "diccionario", "Palabras guía, definiciones y sinónimos", ["KK.4", "KK.5", "KK.6", "KK.7"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["LL.1", "LL.2", "LL.3"]],
  ["mb-ll-y", "ortografia", "mb, mp, nv, ll e y", ["LL.5", "LL.7"]],
  ["x-cc-sc", "ortografia", "x, cc y sc", ["LL.8", "LL.9", "LL.10"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["Z.1", "Z.2"]],

  ["agudas-esdrujulas", "tildes", "Agudas, graves, esdrújulas y sobresdrújulas", ["A.1"]],
  ["hiatos", "tildes", "La tilde en los hiatos", ["LL.4", "LL.6"]],

  ["mayusculas", "puntuacion", "Mayúsculas", ["XX.1", "XX.2"]],
  ["comas", "puntuacion", "La coma", ["WW.1", "WW.2", "WW.3", "WW.4", "WW.6"]],
  ["comas-subordinadas", "puntuacion", "Comas en oraciones compuestas", ["WW.5"], X],
  ["abreviaturas", "puntuacion", "Abreviaturas", ["ZZ.1", "ZZ.2", "ZZ.3", "ZZ.4"]],
  ["formato", "puntuacion", "Títulos, direcciones y diálogos", ["YY.1", "YY.2", "YY.3", "YY.4"]],

  ["tipos-oracion", "oraciones", "Clases de oraciones", ["MM.1"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["MM.2", "MM.3"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["MM.4", "MM.5", "MM.6", "MM.11"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["MM.8", "MM.10"]],
  ["subordinadas", "oraciones", "Proposiciones principales y subordinadas", ["MM.7", "MM.9"], X],

  ["sustantivos", "gramatica", "Sustantivos", ["NN.1", "NN.2"]],
  ["plurales", "gramatica", "Plurales y pertenencia", ["NN.3", "NN.4", "NN.5", "NN.6", "NN.7", "NN.8", "NN.9"]],
  ["pronombres", "gramatica", "Pronombres personales, posesivos y reflexivos", ["OO.1", "OO.2", "OO.3", "OO.4", "OO.5", "OO.6", "OO.7", "OO.8"]],
  ["relativos", "gramatica", "Pronombres relativos", ["OO.9", "OO.10", "OO.11"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["SS.1", "SS.2", "SS.3", "SS.4", "SS.5", "SS.6"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["SS.7", "SS.8", "SS.9", "SS.10"]],
  ["preposiciones", "gramatica", "Preposiciones", ["TT.1", "TT.2", "TT.3", "TT.4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["UU.1", "UU.2", "UU.3", "UU.4", "VV.1", "VV.2"]],

  ["tipos-verbos", "verbos", "Verbos principales, auxiliares y perífrasis", ["PP.1", "PP.2", "PP.3"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["QQ.1", "QQ.2"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["RR.1", "RR.2", "RR.3", "RR.4", "RR.5"]],
  ["gerundio", "verbos", "Estar + gerundio", ["RR.6", "RR.7"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["RR.8", "RR.9", "RR.10"]],

  ["organizar", "escribir", "Organiza las ideas y usa conectores", ["T.1", "T.2", "T.3", "T.4", "T.5", "T.6"]],
  ["inicio-cierre", "escribir", "Oración temática y de cierre", ["U.1", "U.2"]],
  ["resumir", "escribir", "Resume un relato", ["V.1"]],
  ["argumentos", "escribir", "Opiniones, razones y detalles de apoyo", ["W.1", "W.2", "W.3", "W.4", "W.5"]],
  ["detalles", "escribir", "Emociones, verbos precisos e imágenes", ["X.1", "X.2", "X.3"]],
  ["variar", "escribir", "Varía las oraciones", ["Y.1"]],
  ["corregir", "escribir", "Corrige carteles", ["Z.3"]],
  ["fuentes", "escribir", "Plagio y fuentes primarias y secundarias", ["AA.1", "AA.2"]],
];

export const COMUNICACION_P5 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
