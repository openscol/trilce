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
  ["varias-silabas", "palabras", "Palabras de varias sílabas", ["A.2", "A.3", "A.4", "A.5"]],
  ["prefijos-lectura", "palabras", "Lee palabras con prefijos y sufijos", ["B.1", "B.2"]],
  ["frecuentes", "palabras", "Palabras frecuentes y difíciles", ["C.1", "C.2"]],

  ["idea-principal", "comprension", "La idea principal", ["D.1", "D.2", "D.3"]],
  ["dos-textos", "comprension", "Une las ideas de dos textos", ["D.4", "F.4"]],
  ["inferencias", "comprension", "Inferencias y predicciones", ["E.1", "E.2", "E.3", "E.4"]],
  ["tema", "comprension", "El tema de mitos, fábulas y cuentos", ["E.5", "E.6"]],
  ["proposito", "comprension", "Propósito, mensaje y punto de vista", ["F.1", "F.2", "F.3"]],
  ["argumentativos", "comprension", "Analiza textos argumentativos", ["F.5"]],
  ["personajes", "comprension", "Personajes", ["G.1", "G.2"]],
  ["narrador-trama", "comprension", "Narrador, elementos del cuento y trama", ["H.1", "H.2", "H.3"]],
  ["sentidos", "comprension", "Detalles sensoriales", ["J.1", "J.2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["L.1", "L.2"]],

  ["orden-comparacion", "estructura", "Orden de los hechos y comparación", ["I.1", "I.2"]],
  ["causa-efecto", "estructura", "Causas, efectos, problemas y soluciones", ["I.3", "I.4"]],
  ["estructuras", "estructura", "Estructuras del texto", ["I.5"]],
  ["partes-texto", "estructura", "Las partes de un texto", ["M.1"]],

  ["simil-metafora", "recursos", "Comparaciones y metáforas", ["K.1", "K.2", "K.3"]],
  ["alusion", "recursos", "Alusiones", ["K.4"], X],
  ["efecto-figuras", "recursos", "El efecto de las figuras literarias", ["K.5"], X],
  ["poesia", "recursos", "Rima y elementos de la poesía", ["N.1", "N.2"]],

  ["ilustrados", "literarios", "Lee fantasía, cuentos realistas y ciencia ficción", ["O.1", "O.2", "O.3"]],
  ["realistas", "literarios", "Lee cuentos, ficción histórica, poesía y teatro", ["P.1", "P.2", "P.3", "P.4"]],

  ["informativos-1", "informativos", "Animales, arte, lugares y deportes", ["Q.1", "Q.2", "Q.3", "Q.4"]],
  ["informativos-2", "informativos", "Personajes, tecnología, ciencia e historia", ["R.1", "R.2", "R.3", "R.4"]],

  ["prefijos", "vocabulario", "Prefijos pre-, re-, des- e in-", ["BB.1", "BB.2", "BB.3", "BB.4"]],
  ["sufijos", "vocabulario", "Sufijos y familias de palabras", ["BB.5", "BB.6", "BB.7", "BB.8", "BB.9", "BB.10"]],
  ["analogias", "vocabulario", "Analogías con patrones de palabras", ["BB.11", "BB.12"]],
  ["raices", "vocabulario", "Raíces griegas y latinas", ["CC.1", "CC.2", "CC.3", "CC.4", "CC.5", "CC.6", "CC.7"], X],
  ["compuestas", "vocabulario", "Palabras compuestas", ["DD.1", "DD.2", "DD.3"]],
  ["categorias", "vocabulario", "Categorías", ["EE.1", "EE.2"]],
  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["FF.1", "FF.2", "FF.3", "FF.4", "FF.5", "FF.6"]],
  ["homofonos", "vocabulario", "Homófonos", ["GG.1", "GG.2", "GG.3", "GG.4"]],
  ["homonimos", "vocabulario", "Palabras con varios significados", ["GG.5", "GG.6", "GG.7"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["HH.1", "HH.2", "HH.3", "HH.4"]],
  ["matices", "vocabulario", "Matices y connotación", ["II.1", "II.2", "II.3"]],
  ["contexto", "vocabulario", "Pistas del contexto y vocabulario de las áreas", ["JJ.1", "JJ.2", "JJ.3", "JJ.4", "JJ.5"]],

  ["orden-alfabetico", "diccionario", "Orden alfabético", ["KK.1", "KK.2", "KK.3", "KK.4"]],
  ["entradas", "diccionario", "Palabras guía, definiciones y sinónimos", ["KK.5", "KK.6", "KK.7", "KK.8"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["LL.1", "LL.2", "LL.3"]],
  ["b-v-h", "ortografia", "Palabras frecuentes con b, v y h", ["LL.4", "LL.5", "LL.6"]],
  ["g-j-c-s-z", "ortografia", "Palabras frecuentes con g, j, c, s y z", ["LL.7", "LL.8", "LL.9", "LL.10"]],

  ["agudas-graves", "tildes", "¿Aguda, grave o esdrújula?", ["A.1"]],

  ["mayusculas", "puntuacion", "Mayúsculas", ["YY.1", "YY.2", "YY.3", "YY.4", "YY.5", "YY.6"]],
  ["comas", "puntuacion", "La coma", ["XX.1", "XX.2", "XX.3", "XX.4", "XX.5", "XX.6"]],
  ["abreviaturas", "puntuacion", "Abreviaturas", ["ZZ.1", "ZZ.2", "ZZ.3", "ZZ.4", "ZZ.5", "ZZ.6", "ZZ.7", "ZZ.8"]],
  ["formato", "puntuacion", "Cartas, direcciones y títulos", ["AAA.1", "AAA.2", "AAA.3", "AAA.4", "AAA.5"]],
  ["dialogos", "puntuacion", "Puntúa los diálogos", ["AAA.6"]],

  ["tipos-oracion", "oraciones", "Enunciativas, interrogativas, imperativas y exclamativas", ["MM.1"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado y sus núcleos", ["MM.2", "MM.3", "MM.4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["MM.5", "MM.6", "MM.7", "MM.10"]],
  ["compuestas-oraciones", "oraciones", "Oraciones simples y compuestas", ["MM.8", "MM.9"]],

  ["sustantivos", "gramatica", "Sustantivos", ["NN.1", "NN.2", "NN.3", "NN.4"]],
  ["plurales", "gramatica", "Plurales", ["NN.5", "NN.6", "NN.7", "NN.8", "NN.9", "NN.10"]],
  ["pertenencia", "gramatica", "Frases de pertenencia", ["NN.11", "NN.12", "NN.13"]],
  ["pronombres", "gramatica", "Pronombres personales, posesivos y reflexivos", ["OO.1", "OO.2", "OO.3", "OO.4", "OO.5", "OO.6", "OO.7", "OO.8"]],
  ["relativos", "gramatica", "Pronombres relativos", ["OO.9", "OO.10"]],
  ["relativos-cuyo", "gramatica", "Cuyo, el cual y donde", ["OO.11"], X],
  ["articulos", "gramatica", "Artículos", ["SS.1", "SS.2", "SS.3"]],
  ["adjetivos", "gramatica", "Adjetivos", ["TT.1", "TT.2", "TT.3", "TT.4"]],
  ["adverbios", "gramatica", "Adverbios", ["TT.5", "TT.6", "TT.7", "TT.8", "TT.9"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["TT.10", "TT.11", "TT.12", "TT.13"]],
  ["preposiciones", "gramatica", "Preposiciones", ["UU.1", "UU.2", "UU.3", "UU.4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["VV.1", "VV.2", "WW.1", "WW.2"]],

  ["tipos-verbos", "verbos", "Clases de verbos", ["PP.1", "PP.2", "PP.3"]],
  ["perifrasis", "verbos", "Poder, deber, querer y soler", ["PP.4", "PP.5"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["QQ.1", "QQ.2", "QQ.3", "QQ.4"]],
  ["tiempos", "verbos", "Pasado, presente y futuro", ["RR.1", "RR.2", "RR.3", "RR.11", "RR.12"]],
  ["irregulares", "verbos", "Verbos irregulares", ["RR.4", "RR.5", "RR.6", "RR.7", "RR.8"]],
  ["ser-estar", "verbos", "Ser, estar, tener y haber", ["RR.9", "RR.10"]],
  ["gerundio", "verbos", "Estar + gerundio", ["RR.13", "RR.14"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["RR.15", "RR.16", "RR.17"], X],

  ["organizar", "escribir", "Organiza las ideas", ["S.1", "S.2", "S.3", "S.4"]],
  ["inicio-cierre", "escribir", "Oración temática y de cierre", ["T.1", "T.2"]],
  ["conectores", "escribir", "Conectores", ["V.1", "V.2", "V.3", "V.4"]],
  ["argumentos", "escribir", "Opiniones, razones y detalles de apoyo", ["W.1", "W.2", "W.3", "W.4", "W.5"]],
  ["detalles", "escribir", "Emociones, verbos precisos e imágenes", ["X.1", "X.2", "X.3"]],
  ["variar", "escribir", "Varía las oraciones", ["Y.1"]],
  ["corregir", "escribir", "Corrige errores", ["Z.1"]],

  ["fuentes", "investigar", "Plagio y fuentes primarias y secundarias", ["AA.1", "AA.2"]],
];

export const COMUNICACION_P4 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
