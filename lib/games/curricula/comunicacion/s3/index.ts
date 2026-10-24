import type { Section } from "../../../types";
import { cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 3.° de Secundaria, organizado según el CNEB (ciclo VII). Todo
// el grado corresponde al ciclo: lectura atenta de textos literarios e
// informativos, desarrollo de temas y personajes, tono objetivo y subjetivo,
// figuras literarias, la novela «La ciudad y los perros», textos sobre el
// Informe de la CVR, estrategias retóricas y persuasivas, documentos de
// trabajo, argumentación con evidencias, análisis y contraargumentos,
// falacias, citas APA, tilde diacrítica, leísmo, laísmo y loísmo, modos
// verbales y la puntuación de textos complejos. Los bloques son bancos de
// juegos; aquí se decide qué ve el alumno.
export const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS: Section[] = [
  { id: "comprension", name: "Comprensión de lectura", icon: "📖", topic: "comprension" },
  { id: "lectura-atenta", name: "Lectura atenta", icon: "🔎", topic: "comprension" },
  { id: "recursos", name: "Recursos literarios y poesía", icon: "✨", topic: "literatura" },
  { id: "obras", name: "La novela y la memoria", icon: "🏔️", topic: "literatura" },
  { id: "informativos", name: "Textos informativos y funcionales", icon: "📰", topic: "tipos-texto" },
  { id: "vocabulario", name: "Vocabulario", icon: "📚", topic: "vocabulario" },
  { id: "raices", name: "Prefijos, sufijos y raíces", icon: "🌱", topic: "vocabulario" },
  { id: "ortografia", name: "Ortografía y tildes", icon: "✏️", topic: "ortografia" },
  { id: "puntuacion", name: "Puntuación y formato", icon: "❗", topic: "puntuacion" },
  { id: "oraciones", name: "La oración compuesta", icon: "💬", topic: "gramatica" },
  { id: "pronombres", name: "Pronombres", icon: "👤", topic: "gramatica" },
  { id: "gramatica", name: "Verbos y modificadores", icon: "🧩", topic: "gramatica" },
  { id: "escribir", name: "Redacción y revisión", icon: "📝", topic: "redaccion" },
  { id: "argumentar", name: "Argumentación e investigación", icon: "🔍", topic: "redaccion" },
];

export const GAMES: Game[] = [
  ["ideas-principales", "comprension", "Una o varias ideas principales", ["A.1", "A.2"]],
  ["temas", "comprension", "El tema y su desarrollo", ["B.1", "B.2"]],
  ["proposito", "comprension", "Destinatario, propósito y perspectiva", ["C.1", "C.2"]],
  ["tono", "comprension", "Registro y tono objetivo o subjetivo", ["D.1", "D.2", "D.3"]],
  ["argumentos", "comprension", "Sigue el desarrollo de un argumento", ["K.1", "K.2"]],

  ["literarios", "lectura-atenta", "Narrador, personajes y estructura literaria", ["F.1", "F.2", "F.3"]],
  ["informativos-atenta", "lectura-atenta", "Elección de palabras y estructura informativa", ["G.1", "G.2"]],
  ["cuentos", "lectura-atenta", "Analiza cuentos cortos", ["H.1", "H.2"]],

  ["alusiones", "recursos", "Alusiones", ["E.1", "E.2"]],
  ["figuras", "recursos", "Eufemismo, hipérbole, oxímoron y paradoja", ["E.3", "E.4", "E.5", "E.6"]],
  ["poesia", "recursos", "Elementos de la poesía", ["I.1"]],
  ["personificacion", "recursos", "Usa la personificación", ["U.1"]],

  ["ciudad-perros", "obras", "«La ciudad y los perros» de Mario Vargas Llosa", ["L.1", "L.2"]],
  ["cvr", "obras", "El Informe de la CVR y la memoria", ["N.1", "N.2"]],

  ["retorica-historica", "informativos", "Estrategias retóricas en textos históricos", ["J.1", "J.2"]],
  ["desarrollo", "informativos", "El desarrollo de textos informativos", ["J.3", "J.4"]],
  ["trabajo", "informativos", "Correos, memorandos, cartas y avisos", ["O.1", "O.2"]],
  ["organizadores", "informativos", "Organizadores gráficos", ["P.1"]],

  ["homofonos", "vocabulario", "Homófonos", ["BB.1", "BB.2"]],
  ["otras-lenguas", "vocabulario", "Etimología y expresiones de otras lenguas", ["CC.1", "CC.2", "CC.3"]],
  ["precision", "vocabulario", "Exactitud, connotación y sinónimos", ["DD.1", "DD.2", "DD.3", "DD.4"]],
  ["analogias", "vocabulario", "Analogías", ["EE.1", "EE.2", "Z.1", "Z.2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["FF.1", "FF.2", "FF.3"]],
  ["diccionario", "vocabulario", "Uso del diccionario", ["GG.1", "GG.2", "GG.3", "GG.4"]],

  ["prefijos", "raices", "Prefijos", ["Z.3", "Z.4", "Z.5", "Z.6", "Z.7", "Z.9"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["Z.8", "Z.10"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["AA.1", "AA.2", "AA.3", "AA.4", "AA.5"]],

  ["prefijos-ortografia", "ortografia", "Prefijos bi-, tri-, uni-; sufijos -al, -ano, -ura", ["HH.1", "HH.2", "HH.3"]],
  ["bases-cultas", "ortografia", "Bases bio, geo, grafía, logía, foto y tele", ["HH.4"]],
  ["cc-ez", "ortografia", "-cc-, -ez y -eza", ["HH.5", "HH.6", "HH.7"]],
  ["hiatos-h", "ortografia", "Hiatos con tilde y h intermedia", ["HH.8", "HH.9", "HH.10", "HH.11"]],
  ["diacritica", "ortografia", "La tilde diacrítica", ["X.1", "X.2"]],
  ["mal-escritas", "ortografia", "Palabras que suelen escribirse mal", ["X.3", "X.4"]],

  ["comas", "puntuacion", "La coma", ["TT.1", "TT.2", "TT.3", "TT.4", "TT.5"]],
  ["explicativos", "puntuacion", "Elementos explicativos y especificativos", ["SS.1", "SS.2"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["UU.1", "UU.2", "UU.3"]],
  ["raya-guion", "puntuacion", "Raya, guion y puntos suspensivos", ["VV.1", "VV.2", "VV.3"]],
  ["mayusculas", "puntuacion", "Mayúsculas, títulos, citas y diálogos", ["XX.1", "YY.1", "YY.2", "YY.3", "YY.4"]],

  ["tipos-oracion", "oraciones", "Fragmentos y oraciones pegadas", ["II.1", "II.2", "II.3", "II.4"]],
  ["frase-proposicion", "oraciones", "Frases, proposiciones y aposiciones", ["JJ.1", "JJ.2", "JJ.3"]],
  ["subordinadas", "oraciones", "Coordinación y subordinación", ["JJ.4", "JJ.5", "JJ.6"]],
  ["plurales", "oraciones", "Plurales y pertenencia", ["KK.1", "KK.2", "WW.1", "WW.2"]],

  ["leismo", "pronombres", "Leísmo, laísmo y loísmo", ["LL.1"]],
  ["sujeto-complemento", "pronombres", "Pronombres de sujeto, de complemento y tras «que» y «como»", ["LL.2", "LL.3"]],
  ["relativos", "pronombres", "Quien, quienes y otros relativos", ["LL.4", "LL.5", "LL.6"]],
  ["antecedentes", "pronombres", "Antecedentes y referencias ambiguas", ["LL.7", "LL.8", "LL.9"]],

  ["tipos-verbos", "gramatica", "Verbos y verboides", ["MM.1", "MM.2", "MM.3", "MM.4", "MM.5"]],
  ["concordancia", "gramatica", "Concordancia entre sujeto y verbo", ["NN.1", "NN.2", "NN.3"]],
  ["tiempos-modos", "gramatica", "Tiempos y modos verbales", ["OO.1", "OO.2", "OO.3", "OO.4", "OO.5"]],
  ["voz-pasiva", "gramatica", "Voz activa y voz pasiva", ["W.1", "W.2"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos, adverbios y comparativos", ["PP.1", "PP.2", "PP.3", "PP.4", "PP.5", "QQ.1"]],
  ["modificadores", "gramatica", "Modificadores mal colocados", ["RR.1", "RR.2", "RR.3"]],

  ["organizar", "escribir", "Organiza las ideas, oraciones temáticas y tesis", ["Q.1", "Q.2", "R.1", "R.2"]],
  ["claridad", "escribir", "Conectores, comparaciones y paralelismo", ["V.1", "V.2", "V.3", "V.4", "V.5"]],
  ["corregir", "escribir", "Corrige y revisa", ["X.5", "X.6", "X.7"]],

  ["evidencias", "argumentar", "Hechos, opiniones y evidencias", ["S.1", "S.2", "S.3", "S.4"]],
  ["analisis", "argumentar", "Análisis, contraargumentos y transiciones", ["S.5", "S.6", "S.7"]],
  ["falacias", "argumentar", "Falacias", ["S.8"]],
  ["persuasion", "argumentar", "Ethos, pathos y logos", ["T.1", "T.2"]],
  ["apa", "argumentar", "Referencias APA y plagio", ["Y.1", "Y.2", "Y.3", "Y.4"]],
];

export const COMUNICACION_S3 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
