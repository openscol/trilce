import type { Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 2.° de Secundaria, organizado según el CNEB (nivel esperado
// al terminar el ciclo VI). El modo CNEB trae: integrar y contrastar
// información de textos complejos, deducir tesis, tono y punto de vista,
// analizar figuras literarias y obras peruanas (Arguedas, Alegría), textos de
// no ficción sobre el Perú (afroperuanos, Ruiz Gallo, Raimondi), argumentar
// con evidencias y contraargumentos, reconocer apelaciones retóricas, citar
// en APA, y escribir con cohesión, voz activa, modos verbales y la puntuación
// del punto y coma, los dos puntos y la raya. Lo marcado `extendido` adelanta
// el ciclo VII (falacias, modificadores mal colocados, guion en adjetivos
// compuestos). Los bloques son bancos de juegos; aquí se decide qué ve el
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
  { id: "verbos", name: "Tiempos y modos verbales", icon: "🏃", topic: "gramatica" },
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

  ["rios-profundos", "obras", "«Los ríos profundos» de José María Arguedas", ["K.1", "K.2"]],
  ["mundo-ancho", "obras", "«El mundo es ancho y ajeno» de Ciro Alegría", ["K.3", "K.4"]],

  ["informativos", "no-ficcion", "Animales, lugares, tecnología, ciencia e historia", ["I.1", "I.2", "I.3", "I.4", "I.5"]],
  ["afroperuanos", "no-ficcion", "La abolición de la esclavitud y el pueblo afroperuano", ["L.1", "L.2"]],
  ["ruiz-gallo", "no-ficcion", "El inventor Pedro Ruiz Gallo", ["L.3", "L.4"]],
  ["raimondi", "no-ficcion", "Los viajes de Antonio Raimondi", ["L.5", "L.6"]],

  ["sinonimos-antonimos", "vocabulario", "Sinónimos y antónimos", ["Y.1", "Y.2"]],
  ["matices", "vocabulario", "Matices y connotación", ["Z.1", "Z.2"]],
  ["homofonos", "vocabulario", "Homófonos y definiciones", ["AA.1", "AA.2", "AA.3"]],
  ["analogias", "vocabulario", "Analogías", ["BB.1", "BB.2"]],
  ["contexto", "vocabulario", "Pistas del contexto", ["CC.1", "CC.2", "CC.3", "CC.4"]],
  ["academico", "vocabulario", "Vocabulario académico y de las áreas", ["CC.5", "CC.6", "DD.1"]],
  ["diccionario", "vocabulario", "Uso del diccionario", ["EE.1", "EE.2", "EE.3", "EE.4", "EE.5"]],

  ["prefijos", "raices", "Prefijos", ["W.1", "W.2", "W.3", "W.4", "W.5", "W.7"]],
  ["sufijos", "raices", "Sufijos -oso, -able, -ible", ["W.6", "W.8"]],
  ["griegas-latinas", "raices", "Raíces griegas y latinas", ["X.1", "X.2", "X.3", "X.4"]],

  ["prefijos-ortografia", "ortografia", "Prefijos ante-, inter-, super-, trans-; sufijos -al, -ción, -sión", ["FF.1", "FF.2", "FF.3"]],
  ["raices-ortografia", "ortografia", "Raíces aud, yect, dic y duc", ["FF.4", "FF.5", "FF.6"]],
  ["b-v", "ortografia", "b en -aba y -bir; v después de n, l, d y b", ["FF.7", "FF.8", "FF.9"]],
  ["g-tildes", "ortografia", "g en -gen, -gía y geo-; palabras con tilde", ["FF.10", "FF.11", "FF.12", "FF.13"]],
  ["confundidas", "ortografia", "Palabras que se confunden", ["U.1", "U.2"]],

  ["comas", "puntuacion", "La coma", ["UU.1", "UU.2", "UU.3", "UU.4", "UU.5"]],
  ["explicativos", "puntuacion", "Elementos explicativos y especificativos", ["TT.1", "TT.2"]],
  ["punto-y-coma", "puntuacion", "Punto y coma y dos puntos", ["VV.1", "VV.2"]],
  ["raya-suspensivos", "puntuacion", "La raya y los puntos suspensivos", ["WW.1", "WW.3"]],
  ["guion", "puntuacion", "El guion en adjetivos compuestos", ["WW.2"], X],
  ["mayusculas", "puntuacion", "Mayúsculas y títulos", ["XX.1", "XX.2", "YY.1", "YY.2"]],
  ["citas-dialogos", "puntuacion", "Direcciones, citas y diálogos", ["YY.3", "YY.4"]],

  ["oracion", "oraciones", "Sujeto, predicado y sus núcleos", ["GG.1", "GG.2", "GG.3", "GG.4"]],
  ["fragmentos", "oraciones", "Fragmentos y oraciones pegadas", ["GG.5", "GG.6", "GG.7"]],
  ["frase-proposicion", "oraciones", "Frases, proposiciones y aposiciones", ["HH.1", "HH.2"]],
  ["subordinadas", "oraciones", "Coordinación y subordinación", ["HH.3", "HH.4", "HH.5"]],
  ["objetos", "oraciones", "Objeto directo e indirecto", ["QQ.1"]],

  ["antecedentes", "pronombres", "Pronombres y antecedentes", ["JJ.1", "JJ.2", "JJ.3", "JJ.4", "JJ.5"]],
  ["personales", "pronombres", "Pronombres de sujeto y de complemento", ["KK.1", "KK.2", "KK.3"]],
  ["reflexivos", "pronombres", "Reflexivos y enfáticos", ["KK.4", "KK.5", "KK.6"]],
  ["relativos", "pronombres", "Pronombres relativos", ["KK.7", "KK.8"]],

  ["plurales", "gramatica", "Plurales, compuestos y pertenencia", ["II.1", "II.2", "II.3", "II.4", "II.5", "II.6"]],
  ["adjetivos-adverbios", "gramatica", "Adjetivos y adverbios", ["OO.1", "OO.2", "OO.3", "OO.4", "OO.5"]],
  ["comparar", "gramatica", "Comparativos y superlativos", ["OO.6", "OO.7", "OO.8", "OO.9"]],
  ["preposiciones", "gramatica", "Frases con preposición y conjunciones correlativas", ["PP.1", "RR.1"]],
  ["modificadores", "gramatica", "Modificadores mal colocados", ["SS.1", "SS.2", "SS.3"], X],

  ["transitivos", "verbos", "Transitivos, intransitivos y copulativos", ["LL.1", "LL.2"]],
  ["concordancia", "verbos", "Concordancia entre sujeto y verbo", ["MM.1", "MM.2", "MM.3"]],
  ["tiempos", "verbos", "Tiempos simples, progresivos y compuestos", ["NN.1", "NN.2", "NN.3", "NN.4", "NN.5"]],
  ["verboides", "verbos", "Participios, gerundios e infinitivos", ["NN.6", "NN.7", "NN.8"]],
  ["modos", "verbos", "Indicativo, subjuntivo e imperativo", ["NN.9", "NN.10"]],
  ["voz-pasiva", "verbos", "Voz activa y voz pasiva", ["T.1", "T.2"]],

  ["organizar", "escribir", "Organiza las ideas", ["O.1", "O.2", "O.3", "O.4"]],
  ["estilo", "escribir", "Varía las oraciones y elige verbos precisos", ["Q.2", "Q.3"]],
  ["claridad", "escribir", "Conectores, paralelismo y redundancias", ["S.1", "S.2", "S.3"]],
  ["corregir", "escribir", "Corrige y revisa", ["U.3", "U.4", "U.5"]],

  ["tesis", "argumentar", "Hechos, opiniones, tesis y evidencias", ["P.1", "P.2", "P.3", "R.1", "R.2"]],
  ["contraargumentos", "argumentar", "Contraargumentos", ["P.4"]],
  ["apelaciones", "argumentar", "Ethos, pathos y logos en los anuncios", ["P.5"]],
  ["falacias", "argumentar", "Falacias", ["P.6"], X],
  ["fuentes", "argumentar", "Fuentes, titulares sesgados y plagio", ["V.1", "V.2", "V.5"]],
  ["apa", "argumentar", "Referencias y citas en formato APA", ["V.3", "V.4"]],
];

export const COMUNICACION_S2 = cnebCurriculum(BLOCKS, SECTIONS, GAMES);
