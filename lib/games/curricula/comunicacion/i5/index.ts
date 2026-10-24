import type { Question, Section } from "../../../types";
import { X, cnebCurriculum, type Game } from "../cneb";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · Inicial 5 años, organizado según el CNEB (ciclo II). El modo
// CNEB trae lo que pide el nivel esperado al terminar inicial: escuchar y
// comprender textos orales, jugar con los sonidos (rimas, sílabas, sonido
// inicial), reconocer letras, anticipar el contenido de un texto por sus
// imágenes y hacer inferencias sencillas. La lectura y la escritura
// convencionales (leer palabras y cuentos, dígrafos, trabadas, mayúsculas)
// van marcadas `extendido`: adelantan 1.° de primaria. Los bloques son bancos
// de juegos; aquí se decide qué ve el alumno.
export const BLOCKS = [fundamentos, lectura, vocabulario, gramatica];

const SECTIONS: Section[] = [
  { id: "escuchar", name: "Escucho y comprendo", icon: "👂", topic: "escucha" },
  { id: "sonidos", name: "Juego con los sonidos", icon: "🎵", topic: "letras-sonidos" },
  { id: "letras", name: "Conozco las letras", icon: "🔤", topic: "letras-sonidos" },
  { id: "vocales", name: "Las vocales", icon: "🅰️", topic: "letras-sonidos" },
  { id: "imagenes", name: "Leo imágenes y cuentos", icon: "📖", topic: "comprension" },
  { id: "palabras", name: "Palabras para hablar", icon: "💬", topic: "vocabulario" },
  { id: "oraciones", name: "Oraciones y palabras", icon: "🧩", topic: "gramatica" },
  { id: "leer-palabras", name: "Leo mis primeras palabras", icon: "🔎", topic: "letras-sonidos", extended: true },
  { id: "leer-cuentos", name: "Leo cuentos solito", icon: "📚", topic: "comprension", extended: true },
];

export const GAMES: Game[] = [
  ["que-pregunta", "escuchar", "¿Quién, qué, cuándo, dónde o por qué?", ["PP.1"]],
  ["cuentos-escuchados", "escuchar", "Escucha cuentos y responde", ["II.1", "II.2"]],
  ["textos-escuchados", "escuchar", "Escucha sobre la naturaleza, la gente y los alimentos", ["KK.1", "KK.2", "KK.3"]],

  ["rimas", "sonidos", "¿Qué palabras riman?", ["H.1", "H.2", "H.3", "H.5"]],
  ["completar-rima", "sonidos", "Completa la rima", ["H.4", "H.6"]],
  ["silabas", "sonidos", "Aplaude las sílabas", ["I.3", "I.4", "I.5"]],
  ["unir-silabas", "sonidos", "Une sílabas y partes de palabras", ["I.1", "I.2", "I.6"]],
  ["primer-sonido", "sonidos", "¿Con qué sonido empieza o termina?", ["L.1", "L.2", "L.3", "J.3"]],
  ["unir-sonidos", "sonidos", "Une y ordena sonidos", ["J.1", "J.2", "J.4"]],
  ["cambiar-sonidos", "sonidos", "Cambia un sonido y forma otra palabra", ["K.1", "K.2", "K.3", "K.4"]],

  ["letras-a-h", "letras", "Las letras de la A a la H", ["A.1", "A.2", "A.3", "A.4", "A.5", "A.6", "A.7", "A.8", "A.9", "A.10", "A.11"]],
  ["letras-i-p", "letras", "Las letras de la I a la P", ["B.1", "B.2", "B.3", "B.4", "B.5", "B.6", "B.7", "B.8", "B.9", "B.10", "B.11"]],
  ["letras-q-z", "letras", "Las letras de la Q a la Z", ["C.1", "C.2", "C.3", "C.4", "C.5", "C.6", "C.7", "C.8", "C.9", "C.10", "C.11", "C.12", "C.13"]],
  ["buscar-letra", "letras", "Encuentra la letra", ["D.1", "D.2", "D.3", "D.4", "D.5", "D.6"]],
  ["mayusculas-minusculas", "letras", "Mayúsculas y minúsculas", ["E.1", "E.2", "E.3", "E.4", "E.5", "E.6", "E.7", "E.8", "E.9", "E.10"]],
  ["abecedario", "letras", "Ordena el abecedario", ["E.11"]],
  ["letra-sonido", "letras", "¿Qué letra suena así?", ["M.1", "M.2", "M.3", "M.4", "M.5", "M.6", "M.7"]],
  ["palabras-iguales", "letras", "Palabras iguales y espacios", ["F.1", "F.2", "F.3"]],

  ["vocal-consonante", "vocales", "¿Vocal o consonante?", ["G.1", "G.2"]],
  ["encontrar-vocal", "vocales", "Encuentra la vocal", ["N.1", "N.2", "N.3", "N.4", "N.5", "N.6"]],
  ["vocal-inicial", "vocales", "¿Con qué vocal empieza?", ["W.3", "W.4", "W.5", "W.6", "W.7"]],
  ["misma-vocal", "vocales", "Palabras con la misma vocal", ["W.1", "W.2", "W.8"]],

  ["partes-libro", "imagenes", "Las partes de un libro", ["Z.1", "HH.1"]],
  ["real-fantasia", "imagenes", "¿Puede pasar de verdad?", ["AA.1"]],
  ["de-que-trata", "imagenes", "¿De qué trata?", ["BB.1", "BB.2"]],
  ["sentimientos", "imagenes", "¿Cómo se siente? ¿Qué pasará?", ["CC.1", "CC.2", "CC.3", "CC.4"]],
  ["ensenanza", "imagenes", "La enseñanza del cuento", ["CC.5"]],
  ["para-que", "imagenes", "¿Para qué se escribió?", ["DD.1", "GG.1"]],
  ["lugar-personajes", "imagenes", "Lugares y personajes", ["EE.1", "EE.2"]],
  ["ordenar-cuento", "imagenes", "Ordena el cuento", ["FF.1", "FF.2"]],

  ["numeros-colores", "palabras", "Números y colores", ["MM.1", "MM.2"]],
  ["adjetivos-verbos", "palabras", "¿Cómo es? ¿Qué hace?", ["NN.1", "NN.2"]],
  ["ubicacion", "palabras", "Dentro, fuera, encima y debajo", ["OO.1", "OO.2"]],
  ["opuestos", "palabras", "Palabras parecidas y opuestas", ["QQ.1", "QQ.2"]],
  ["categorias", "palabras", "Agrupa por categorías", ["RR.1", "RR.2"]],
  ["varios-significados", "palabras", "Una palabra, varios significados", ["SS.1"]],

  ["contar-preguntar", "oraciones", "¿Cuenta algo o pregunta algo?", ["TT.1", "TT.3", "TT.4"]],
  ["sustantivos", "oraciones", "Personas, animales, lugares y cosas", ["VV.1", "VV.2"]],
  ["verbos", "oraciones", "Palabras de acción", ["WW.1", "WW.2", "WW.3"]],
  ["signos-mayusculas", "oraciones", "Signos y mayúsculas", ["TT.2", "UU.1", "UU.2"], X],

  ["palabras-a", "leer-palabras", "Palabras con a", ["O.1", "O.2", "O.3", "O.4"]],
  ["palabras-e", "leer-palabras", "Palabras con e", ["P.1", "P.2", "P.3"]],
  ["palabras-i", "leer-palabras", "Palabras con i", ["Q.1", "Q.2", "Q.3"]],
  ["palabras-o", "leer-palabras", "Palabras con o", ["R.1", "R.2", "R.3"]],
  ["palabras-u", "leer-palabras", "Palabras con u", ["S.1", "S.2", "S.3"]],
  ["palabras-cortas", "leer-palabras", "Lee y escribe palabras cortas", ["T.1", "T.2", "T.3", "T.4", "T.5", "T.6"]],
  ["digrafos", "leer-palabras", "ch, ll, rr, qu y ñ", ["U.1", "U.2", "U.3", "U.4", "U.5", "U.6", "U.7", "U.8", "U.9"]],
  ["trabadas", "leer-palabras", "Trabadas", ["V.1", "V.2", "V.3", "V.4", "V.5", "V.6"]],
  ["frecuentes-1", "leer-palabras", "Palabras frecuentes: grupos 1 al 5", ["X.1", "X.2", "X.3", "X.4", "X.5", "X.6", "X.7"]],
  ["frecuentes-2", "leer-palabras", "Palabras frecuentes: grupos 6 al 10", ["X.8", "X.9", "X.10", "X.11", "X.12", "X.13", "X.14", "X.15"]],
  ["frecuentes-oracion", "leer-palabras", "Usa las palabras frecuentes", ["X.16", "X.17"]],

  ["cuentos-vocales", "leer-cuentos", "Cuentos con cada vocal", ["Y.1", "Y.2", "Y.3", "Y.4", "Y.5", "Y.6"]],
  ["cuentos-solo", "leer-cuentos", "Cuentos para leer solo", ["JJ.1", "JJ.2"]],
  ["informativos-solo", "leer-cuentos", "Animales y lugares", ["LL.1", "LL.2"]],
];

// A esta edad todavía no se lee con soltura: el botón 🔊 lee el enunciado y,
// fuera de los juegos donde justamente hay que leer solo, también el texto.
// Las rimas (H) sí se leen en voz alta: se trabajan de oído.
const READ_ALONE = new Set([...fundamentos.SECTIONS.map((s) => s.id).filter((id) => id !== "H"), "JJ", "LL"]);
const clean = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}️‍▢—]/gu, " ")
    .replace(/_+/g, "…")
    .replace(/\s+/g, " ")
    .trim();

function aloud(q: Question, group: string): Question {
  if (q.speak) return q.visual?.kind === "passage" ? { ...q, speak: `${q.speak} ${q.prompt}` } : q;
  const text = !READ_ALONE.has(group) && q.visual?.kind === "text" ? `${q.visual.text.replace(/[.\s]+$/, "")}. ` : "";
  return { ...q, speak: clean(`${text}${q.prompt}`) };
}

export const COMUNICACION_I5 = cnebCurriculum(BLOCKS, SECTIONS, GAMES, (key, gen) => {
  const group = key.split(".")[0];
  return (r) => aloud(gen(r), group);
});
