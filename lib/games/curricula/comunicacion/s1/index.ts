import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 1.° de Secundaria, organizado según el CNEB (ciclo VI, que
// termina en 2.°). El modo CNEB trae: integrar información de textos de
// estructura compleja, deducir temas, tesis, tono y punto de vista, analizar
// figuras literarias y obras peruanas (Palma, Matto de Turner, «Ollantay»,
// Garcilaso), evaluar argumentos, fuentes y titulares, citar en formato APA,
// y escribir con cohesión (pronombres y antecedentes, conectores,
// paralelismo), oraciones compuestas y la puntuación del punto y coma, los dos
// puntos y la raya. Lo marcado `extendido` adelanta 2.° y 3.° (apelaciones
// retóricas, falacias, guion en adjetivos compuestos, modificadores mal
// colocados). Los bloques son bancos de juegos; aquí se decide qué ve el
// alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprensión de lectura", icon: "📖", topic: "comprension" },
  { id: "estructura", name: "Estructura del texto", icon: "🧱", topic: "tipos-texto" },
  { id: "recursos", name: "Recursos literarios", icon: "✨", topic: "literatura" },
  { id: "obras", name: "Obras de la literatura peruana", icon: "🏔️", topic: "literatura" },
  { id: "no-ficcion", name: "Textos informativos y de no ficción", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Vocabulario", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "ortografia", name: "Ortografía", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración compuesta", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Clases de palabras", icon: "🧩", topic: "gramatica" },
  { id: "verbos", name: "Los verbos", icon: "🏃", topic: "gramatica" },
  { id: "escribir", name: "Redacción y revisión", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumentación e investigación", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["ideas-principales", "comprension", "Una o varias ideas principales", ["A.1", "A.2", "A.3"]],
  ["temas", "comprension", "El tema y varios temas", ["B.1", "B.2", "B.3"]],
  ["proposito", "comprension", "Propósito y punto de vista del autor", ["C.1", "C.2"]],
  ["tono", "comprension", "Registro y tono", ["D.1", "D.2"]],
  ["literatura", "comprension", "Narrador, inferencias y análisis de cuentos", ["G.1", "G.2", "G.3"]],
  ["argumento", "comprension", "Sigue el desarrollo de un argumento", ["J.1"]],
  ["comparar-textos", "comprension", "Compara textos y géneros", ["M.1", "M.2"]],
  ["visuales", "comprension", "Ilustraciones y organizadores gráficos", ["N.1", "N.2"]],

  ["estructuras", "estructura", "Comparación, causa-efecto y problema-solución", ["E.1", "E.2", "E.3", "E.4"]],

  ["sentidos-alusion", "recursos", "Detalles sensoriales y alusiones", ["F.1", "F.2", "F.3"]],
  ["figuras", "recursos", "Interpreta y clasifica figuras literarias", ["F.4", "F.5", "F.6"]],
  ["rima", "recursos", "El esquema de rima", ["H.1"]],
  ["personificacion", "recursos", "Usa la personificación", ["Q.1"]],

  ["tradiciones", "obras", "«Tradiciones peruanas» de Ricardo Palma", ["K.1", "K.2"]],
  ["aves-sin-nido", "obras", "«Aves sin nido» de Clorinda Matto de Turner", ["K.3", "K.4"]],
  ["ollantay", "obras", "«Ollantay»", ["K.5", "K.6"]],

  ["informativos", "no-ficcion", "Animales, lugares, tecnología, ciencia e historia", ["I.1", "I.2", "I.3", "I.4", "I.5"]],
  ["garcilaso", "no-ficcion", "Los «Comentarios reales» del Inca Garcilaso", ["L.1", "L.2"]],
  ["yungay", "no-ficcion", "El terremoto de 1970 y Yungay", ["L.3", "L.4"]],

  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["X.1", "X.2"]],
  ["homofonos", "vocabulario", "Homófonos y definiciones", ["Y.1", "Y.2", "Y.3"]],
  ["matices", "vocabulario", "Matices y connotación", ["Z.1", "Z.2"]],
  ["analogias", "vocabulario", "Analogías", ["AA.1", "AA.2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["BB.1", "BB.2", "BB.3", "BB.4"]],
  ["academico", "vocabulario", "Vocabulario académico y de las áreas", ["BB.5", "BB.6", "CC.1"]],
  ["diccionario", "vocabulario", "Uso del diccionario", ["DD.1", "DD.2", "DD.3", "DD.4", "DD.5"]],

  ["prefijos", "raices", "Prefijos", ["V.1", "V.2", "V.3", "V.4", "V.5", "V.7"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["V.6", "V.8"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["W.1", "W.2", "W.3", "W.4"]],

  ["prefijos-ortografia", "ortografia", "Prefijos ad- y de-, sufijos -ivo y -oso", ["EE.1", "EE.2", "EE.3"]],
  ["raices-ortografia", "ortografia", "Raíces spect, vis, form y rupt", ["EE.4", "EE.5", "EE.6"]],
  ["ll-y-c-s-z", "ortografia", "ll, y, c, s y z", ["EE.7", "EE.8", "EE.9"]],
  ["x-h", "ortografia", "x y h inicial", ["EE.10", "EE.11", "EE.12", "EE.13"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["T.1", "T.2"]],

  ["comas", "puntuacion", "La coma", ["TT.1", "TT.2", "TT.3", "TT.4", "TT.5"]],
  ["explicativos", "puntuacion", "Elementos explicativos y especificativos", ["SS.1", "SS.2"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["UU.1", "UU.2"]],
  ["raya-suspensivos", "puntuacion", "La raya y los puntos suspensivos", ["VV.1", "VV.3"]],
  ["guion", "puntuacion", "El guion en adjetivos compuestos", ["VV.2"], X],
  ["mayusculas", "puntuacion", "Mayúsculas y títulos", ["WW.1", "WW.2", "XX.1", "XX.2"]],
  ["citas-dialogos", "puntuacion", "Direcciones, citas y diálogos", ["XX.3", "XX.4"]],

  ["oracion", "oraciones", "Sujeto, predicado y sus núcleos", ["FF.1", "FF.2", "FF.3", "FF.4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["FF.5", "FF.6", "FF.7"]],
  ["frase-proposicion", "oraciones", "Frases, proposiciones y aposiciones", ["GG.1", "GG.2"]],
  ["subordinadas", "oraciones", "Coordinación y subordinación", ["GG.3", "GG.4", "GG.5"]],
  ["objetos", "oraciones", "Objeto directo e indirecto", ["PP.1"]],

  ["antecedentes", "pronombres", "Pronombres y antecedentes", ["II.1", "II.2", "II.3", "II.4", "II.5"]],
  ["personales", "pronombres", "Pronombres de sujeto y de complemento", ["JJ.1", "JJ.2", "JJ.3"]],
  ["reflexivos", "pronombres", "Reflexivos y enfáticos", ["JJ.4", "JJ.5", "JJ.6"]],
  ["relativos", "pronombres", "Pronombres relativos", ["JJ.7", "JJ.8"]],

  ["plurales", "gramatica", "Plurales, compuestos y pertenencia", ["HH.1", "HH.2", "HH.3", "HH.4", "HH.5"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["NN.1", "NN.2", "NN.3", "NN.4", "NN.5"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["NN.6", "NN.7", "NN.8", "NN.9"]],
  ["preposiciones", "gramatica", "Frases con preposición y conjunciones correlativas", ["OO.1", "QQ.1"]],
  ["modificadores", "gramatica", "Modificadores mal colocados", ["RR.1", "RR.2", "RR.3"], X],

  ["transitivos", "verbos", "Transitivos, intransitivos y copulativos", ["KK.1", "KK.2"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["LL.1", "LL.2", "LL.3"]],
  ["tiempos", "verbos", "Tiempos simples, progresivos y compuestos", ["MM.1", "MM.2", "MM.3", "MM.4", "MM.5"]],
  ["verboides", "verbos", "Gerundios e infinitivos", ["MM.6", "MM.7"]],

  ["organizar", "escribir", "Organiza las ideas", ["O.1", "O.2", "O.3", "O.4"]],
  ["estilo", "escribir", "Varía las oraciones y elige verbos precisos", ["Q.2", "Q.3"]],
  ["claridad", "escribir", "Conectores, paralelismo y redundancias", ["S.1", "S.2", "S.3"]],
  ["corregir", "escribir", "Corrige y revisa", ["T.3", "T.4", "T.5"]],

  ["tesis", "argumentar", "Hechos, opiniones, tesis y evidencias", ["P.1", "P.2", "P.3", "R.1", "R.2"]],
  ["contraargumentos", "argumentar", "Contraargumentos", ["P.4"]],
  ["apelaciones", "argumentar", "Ethos, pathos y logos en los anuncios", ["P.5"], X],
  ["falacias", "argumentar", "Falacias", ["P.6"], X],
  ["fuentes", "argumentar", "Fuentes, titulares sesgados y plagio", ["U.1", "U.2", "U.5"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["U.3", "U.4"]],
];

export const COMUNICACION_S1 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
