import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 6.° de Primaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo V y la primaria). El modo CNEB trae: leer y comparar
// textos de géneros distintos, integrar información, deducir temas, tono y
// punto de vista, interpretar figuras literarias, analizar obras narrativas
// peruanas y textos de no ficción, seguir un argumento, elegir evidencias,
// evaluar fuentes y titulares, y escribir con cohesión, conectores, comas y
// concordancia de pronombres y verbos. Lo marcado `extendido` adelanta 1.° de
// secundaria (falacias, citas y referencias en formato APA, raya, verbos
// transitivos y copulativos, objeto directo e indirecto, proposiciones
// subordinadas). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprendo lo que leo", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Cómo está hecho el texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "obras", name: "Obras narrativas peruanas", icon: "🏔️", topic: "literatura" },
  { id: "no-ficcion", name: "Textos de no ficción", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Palabras nuevas", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "diccionario", name: "Uso el diccionario", icon: "📕", topic: "vocabulario" },
  { id: "ortografia", name: "Escribo bien las palabras", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación, mayúsculas y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Planifico y escribo", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumento e investigo", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["idea-principal", "comprension", "La idea principal", ["A.1", "A.2"]],
  ["temas", "comprension", "El tema y varios temas", ["B.1", "B.2", "B.3"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["C.1", "C.2"]],
  ["tono", "comprension", "Registro y tono", ["D.1", "D.2"]],
  ["literatura", "comprension", "Narrador, inferencias y análisis de cuentos", ["G.1", "G.2", "G.3"]],
  ["argumento", "comprension", "Sigue el desarrollo de un argumento", ["J.1"]],
  ["comparar-textos", "comprension", "Compara textos y géneros", ["M.1", "M.2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["N.1", "N.2"]],

  ["estructuras", "estructura", "Comparación, causa-efecto y problema-solución", ["E.1", "E.2", "E.3", "E.4"]],

  ["sentidos-alusion", "recursos", "Detalles sensoriales y alusiones", ["F.1", "F.2"]],
  ["figuras", "recursos", "Interpreta y clasifica figuras literarias", ["F.3", "F.4", "F.5"]],
  ["rima", "recursos", "El esquema de rima", ["H.1"]],
  ["personificacion", "recursos", "Usa la personificación", ["Q.1"]],

  ["caballero-carmelo", "obras", "«El caballero Carmelo»", ["K.1", "K.2"]],
  ["paco-yunque", "obras", "«Paco Yunque»", ["K.3", "K.4"]],
  ["cuentos-selva", "obras", "«Cuentos de la selva»", ["K.5", "K.6"]],

  ["informativos", "no-ficcion", "Animales, lugares, tecnología, ciencia e historia", ["I.1", "I.2", "I.3", "I.4", "I.5"]],
  ["tubman", "no-ficcion", "Harriet Tubman", ["L.1", "L.2"]],
  ["malala", "no-ficcion", "Malala Yousafzai", ["L.3", "L.4"]],
  ["chicago", "no-ficcion", "El gran incendio de Chicago", ["L.5", "L.6"]],

  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["X.1", "X.2", "X.3", "X.4"]],
  ["homofonos", "vocabulario", "Homófonos y definiciones", ["Y.1", "Y.2", "Y.3"]],
  ["modismos", "vocabulario", "Modismos y refranes", ["Z.1", "Z.2", "Z.3", "Z.4"]],
  ["matices", "vocabulario", "Matices y connotación", ["AA.1", "AA.2"]],
  ["analogias", "vocabulario", "Analogías", ["BB.1", "BB.2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["CC.1", "CC.2", "CC.3", "CC.4"]],
  ["academico", "vocabulario", "Vocabulario académico y de las áreas", ["CC.5", "CC.6", "DD.1"]],

  ["prefijos", "raices", "Prefijos", ["V.1", "V.2", "V.3", "V.4", "V.5", "V.7"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["V.6", "V.8"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["W.1", "W.2", "W.3", "W.4", "W.5"]],

  ["diccionario", "diccionario", "Orden alfabético, palabras guía y entradas", ["EE.1", "EE.2", "EE.3", "EE.4", "EE.5"]],

  ["prefijos-ortografia", "ortografia", "Escribe palabras con prefijos y sufijos", ["FF.1", "FF.2", "FF.3"]],
  ["raices-ortografia", "ortografia", "Escribe palabras con raíces latinas", ["FF.4", "FF.5", "FF.6"]],
  ["h-g-j", "ortografia", "h intermedia, g y j", ["FF.7", "FF.8", "FF.9"]],
  ["cion-sion-b-v", "ortografia", "-ción, -sión, -cción, b y v", ["FF.10", "FF.11", "FF.12", "FF.13"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["T.1", "T.2"]],

  ["comas", "puntuacion", "La coma", ["SS.1", "SS.3", "SS.4", "SS.5", "SS.7"]],
  ["comas-compuestas", "puntuacion", "Comas en oraciones compuestas", ["SS.2"]],
  ["sugiere", "puntuacion", "¿Qué sugiere la puntuación?", ["SS.6"]],
  ["raya", "puntuacion", "La raya", ["SS.8"], X],
  ["mayusculas", "puntuacion", "Mayúsculas y títulos", ["TT.1", "TT.2", "UU.1", "UU.2"]],
  ["citas-dialogos", "puntuacion", "Direcciones, citas y diálogos", ["UU.3", "UU.4"]],

  ["tipos-oracion", "oraciones", "Clases de oraciones", ["GG.1"]],
  ["sujeto-predicado", "oraciones", "Sujeto, predicado, núcleos y compuestos", ["GG.2", "GG.3", "GG.4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["GG.5", "GG.6", "GG.7"]],
  ["subordinadas", "oraciones", "Proposiciones subordinadas", ["GG.8", "GG.9"], X],
  ["objetos", "oraciones", "Objeto directo e indirecto", ["PP.1"], X],

  ["antecedentes", "pronombres", "Pronombres y antecedentes", ["II.1", "II.2", "II.3", "II.4", "II.5"]],
  ["personales", "pronombres", "Pronombres personales y posesivos", ["JJ.1", "JJ.2", "JJ.3", "JJ.4"]],
  ["reflexivos", "pronombres", "Reflexivos y enfáticos", ["JJ.5", "JJ.6", "JJ.7"]],
  ["relativos", "pronombres", "Pronombres relativos", ["JJ.8", "JJ.9", "JJ.10"]],

  ["plurales", "gramatica", "Sustantivos, plurales y pertenencia", ["HH.1", "HH.2", "HH.3", "HH.4", "HH.5", "HH.6", "HH.7", "HH.8"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["NN.1", "NN.2", "NN.3", "NN.4", "NN.5", "NN.6"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["NN.7", "NN.8", "NN.9", "NN.10"]],
  ["preposiciones", "gramatica", "Preposiciones", ["OO.1", "OO.2", "OO.3", "OO.4"]],
  ["conjunciones", "gramatica", "Conjunciones y contracciones", ["QQ.1", "QQ.2", "QQ.3", "QQ.4", "QQ.5", "RR.1", "RR.2"]],

  ["auxiliares", "verbos", "Verbos auxiliares y perífrasis", ["KK.1", "KK.4", "KK.5"]],
  ["transitivos", "verbos", "Transitivos, intransitivos y copulativos", ["KK.2", "KK.3"], X],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["LL.1", "LL.2"]],
  ["tiempos", "verbos", "Tiempos verbales", ["MM.1", "MM.2", "MM.3"]],
  ["gerundio", "verbos", "Estar + gerundio", ["MM.4", "MM.5"]],
  ["compuestos", "verbos", "Participio y tiempos compuestos", ["MM.6", "MM.7", "MM.8"]],

  ["organizar", "escribir", "Organiza las ideas", ["O.1", "O.2", "O.3", "O.4"]],
  ["estilo", "escribir", "Varía las oraciones y elige verbos precisos", ["Q.2", "Q.3"]],
  ["conectores", "escribir", "Conectores: sin embargo, por lo tanto, además", ["S.1"]],
  ["corregir", "escribir", "Corrige y revisa", ["T.3", "T.4", "T.5"]],

  ["hecho-opinion", "argumentar", "Hechos, opiniones y evidencias", ["P.1", "P.2", "R.1", "R.2"]],
  ["contraargumentos", "argumentar", "Contraargumentos", ["P.3"]],
  ["falacias", "argumentar", "Falacias", ["P.4"], X],
  ["fuentes", "argumentar", "Fuentes pertinentes, titulares sesgados y plagio", ["U.1", "U.2", "U.5"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["U.3", "U.4"], X],
];

export const COMUNICACION_P6 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
