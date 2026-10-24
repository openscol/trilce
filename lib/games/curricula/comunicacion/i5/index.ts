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
  ["que-pregunta", "escuchar", "¿Quién, qué, cuándo, dónde o por qué?", ["que-pregunta"]],
  ["cuentos-escuchados", "escuchar", "Escucha cuentos y responde", ["cuentos-escuchados-1", "cuentos-escuchados-2"]],
  ["textos-escuchados", "escuchar", "Escucha sobre la naturaleza, la gente y los alimentos", ["textos-escuchados-1", "textos-escuchados-2", "textos-escuchados-3"]],

  ["rimas", "sonidos", "¿Qué palabras riman?", ["rimas-1", "rimas-2", "rimas-3", "rimas-4"]],
  ["completar-rima", "sonidos", "Completa la rima", ["completar-rima-1", "completar-rima-2"]],
  ["silabas", "sonidos", "Aplaude las sílabas", ["silabas-1", "silabas-2", "silabas-3"]],
  ["unir-silabas", "sonidos", "Une sílabas y partes de palabras", ["unir-silabas-1", "unir-silabas-2", "unir-silabas-3"]],
  ["primer-sonido", "sonidos", "¿Con qué sonido empieza o termina?", ["primer-sonido-1", "primer-sonido-2", "primer-sonido-3", "primer-sonido-4"]],
  ["unir-sonidos", "sonidos", "Une y ordena sonidos", ["unir-sonidos-1", "unir-sonidos-2", "unir-sonidos-3"]],
  ["cambiar-sonidos", "sonidos", "Cambia un sonido y forma otra palabra", ["cambiar-sonidos-1", "cambiar-sonidos-2", "cambiar-sonidos-3", "cambiar-sonidos-4"]],

  ["letras-a-h", "letras", "Las letras de la A a la H", ["letras-a-h-1", "letras-a-h-2", "letras-a-h-3", "letras-a-h-4", "letras-a-h-5", "letras-a-h-6", "letras-a-h-7", "letras-a-h-8", "letras-a-h-9", "letras-a-h-10", "letras-a-h-11"]],
  ["letras-i-p", "letras", "Las letras de la I a la P", ["letras-i-p-1", "letras-i-p-2", "letras-i-p-3", "letras-i-p-4", "letras-i-p-5", "letras-i-p-6", "letras-i-p-7", "letras-i-p-8", "letras-i-p-9", "letras-i-p-10", "letras-i-p-11"]],
  ["letras-q-z", "letras", "Las letras de la Q a la Z", ["letras-q-z-1", "letras-q-z-2", "letras-q-z-3", "letras-q-z-4", "letras-q-z-5", "letras-q-z-6", "letras-q-z-7", "letras-q-z-8", "letras-q-z-9", "letras-q-z-10", "letras-q-z-11", "letras-q-z-12", "letras-q-z-13"]],
  ["buscar-letra", "letras", "Encuentra la letra", ["buscar-letra-1", "buscar-letra-2", "buscar-letra-3", "buscar-letra-4", "buscar-letra-5", "buscar-letra-6"]],
  ["mayusculas-minusculas", "letras", "Mayúsculas y minúsculas", ["mayusculas-minusculas-1", "mayusculas-minusculas-2", "mayusculas-minusculas-3", "mayusculas-minusculas-4", "mayusculas-minusculas-5", "mayusculas-minusculas-6", "mayusculas-minusculas-7", "mayusculas-minusculas-8", "mayusculas-minusculas-9", "mayusculas-minusculas-10"]],
  ["abecedario", "letras", "Ordena el abecedario", ["abecedario"]],
  ["letra-sonido", "letras", "¿Qué letra suena así?", ["letra-sonido-1", "letra-sonido-2", "letra-sonido-3", "letra-sonido-4", "letra-sonido-5", "letra-sonido-6", "letra-sonido-7"]],
  ["palabras-iguales", "letras", "Palabras iguales y espacios", ["palabras-iguales-1", "palabras-iguales-2", "palabras-iguales-3"]],

  ["vocal-consonante", "vocales", "¿Vocal o consonante?", ["vocal-consonante-1", "vocal-consonante-2"]],
  ["encontrar-vocal", "vocales", "Encuentra la vocal", ["encontrar-vocal-1", "encontrar-vocal-2", "encontrar-vocal-3", "encontrar-vocal-4", "encontrar-vocal-5", "encontrar-vocal-6"]],
  ["vocal-inicial", "vocales", "¿Con qué vocal empieza?", ["vocal-inicial-1", "vocal-inicial-2", "vocal-inicial-3", "vocal-inicial-4", "vocal-inicial-5"]],
  ["misma-vocal", "vocales", "Palabras con la misma vocal", ["misma-vocal-1", "misma-vocal-2", "misma-vocal-3"]],

  ["partes-libro", "imagenes", "Las partes de un libro", ["partes-libro-1", "partes-libro-2"]],
  ["real-fantasia", "imagenes", "¿Puede pasar de verdad?", ["real-fantasia"]],
  ["de-que-trata", "imagenes", "¿De qué trata?", ["de-que-trata-1", "de-que-trata-2"]],
  ["sentimientos", "imagenes", "¿Cómo se siente? ¿Qué pasará?", ["sentimientos-1", "sentimientos-2", "sentimientos-3", "sentimientos-4"]],
  ["ensenanza", "imagenes", "La enseñanza del cuento", ["ensenanza"]],
  ["para-que", "imagenes", "¿Para qué se escribió?", ["para-que-1", "para-que-2"]],
  ["lugar-personajes", "imagenes", "Lugares y personajes", ["lugar-personajes-1", "lugar-personajes-2"]],
  ["ordenar-cuento", "imagenes", "Ordena el cuento", ["ordenar-cuento-1", "ordenar-cuento-2"]],

  ["numeros-colores", "palabras", "Números y colores", ["numeros-colores-1", "numeros-colores-2"]],
  ["adjetivos-verbos", "palabras", "¿Cómo es? ¿Qué hace?", ["adjetivos-verbos-1", "adjetivos-verbos-2"]],
  ["ubicacion", "palabras", "Dentro, fuera, encima y debajo", ["ubicacion-1", "ubicacion-2"]],
  ["opuestos", "palabras", "Palabras parecidas y opuestas", ["opuestos-1", "opuestos-2"]],
  ["categorias", "palabras", "Agrupa por categorías", ["categorias-1", "categorias-2"]],
  ["varios-significados", "palabras", "Una palabra, varios significados", ["varios-significados"]],

  ["contar-preguntar", "oraciones", "¿Cuenta algo o pregunta algo?", ["contar-preguntar-1", "contar-preguntar-2", "contar-preguntar-3"]],
  ["sustantivos", "oraciones", "Personas, animales, lugares y cosas", ["sustantivos-1", "sustantivos-2"]],
  ["verbos", "oraciones", "Palabras de acción", ["verbos-1", "verbos-2", "verbos-3"]],
  ["signos-mayusculas", "oraciones", "Signos y mayúsculas", ["signos-mayusculas-1", "signos-mayusculas-2", "signos-mayusculas-3"], X],

  ["palabras-a", "leer-palabras", "Palabras con a", ["palabras-a-1", "palabras-a-2", "palabras-a-3", "palabras-a-4"]],
  ["palabras-e", "leer-palabras", "Palabras con e", ["palabras-e-1", "palabras-e-2", "palabras-e-3"]],
  ["palabras-i", "leer-palabras", "Palabras con i", ["palabras-i-1", "palabras-i-2", "palabras-i-3"]],
  ["palabras-o", "leer-palabras", "Palabras con o", ["palabras-o-1", "palabras-o-2", "palabras-o-3"]],
  ["palabras-u", "leer-palabras", "Palabras con u", ["palabras-u-1", "palabras-u-2", "palabras-u-3"]],
  ["palabras-cortas", "leer-palabras", "Lee y escribe palabras cortas", ["palabras-cortas-1", "palabras-cortas-2", "palabras-cortas-3", "palabras-cortas-4", "palabras-cortas-5", "palabras-cortas-6"]],
  ["digrafos", "leer-palabras", "ch, ll, rr, qu y ñ", ["digrafos-1", "digrafos-2", "digrafos-3", "digrafos-4", "digrafos-5", "digrafos-6", "digrafos-7", "digrafos-8", "digrafos-9"]],
  ["trabadas", "leer-palabras", "Trabadas", ["trabadas-1", "trabadas-2", "trabadas-3", "trabadas-4", "trabadas-5", "trabadas-6"]],
  ["frecuentes-1", "leer-palabras", "Palabras frecuentes: grupos 1 al 5", ["frecuentes-1-1", "frecuentes-1-2", "frecuentes-1-3", "frecuentes-1-4", "frecuentes-1-5", "frecuentes-1-6", "frecuentes-1-7"]],
  ["frecuentes-2", "leer-palabras", "Palabras frecuentes: grupos 6 al 10", ["frecuentes-2-1", "frecuentes-2-2", "frecuentes-2-3", "frecuentes-2-4", "frecuentes-2-5", "frecuentes-2-6", "frecuentes-2-7", "frecuentes-2-8"]],
  ["frecuentes-oracion", "leer-palabras", "Usa las palabras frecuentes", ["frecuentes-oracion-1", "frecuentes-oracion-2"]],

  ["cuentos-vocales", "leer-cuentos", "Cuentos con cada vocal", ["cuentos-vocales-1", "cuentos-vocales-2", "cuentos-vocales-3", "cuentos-vocales-4", "cuentos-vocales-5", "cuentos-vocales-6"]],
  ["cuentos-solo", "leer-cuentos", "Cuentos para leer solo", ["cuentos-solo-1", "cuentos-solo-2"]],
  ["informativos-solo", "leer-cuentos", "Animales y lugares", ["informativos-solo-1", "informativos-solo-2"]],
];

// A esta edad todavía no se lee con soltura: el botón 🔊 lee el enunciado y,
// fuera de los juegos donde justamente hay que leer solo, también el texto.
// Se leen solos los juegos de letras, sonidos, vocales y lectura; las rimas
// sí se leen en voz alta, porque se trabajan de oído.
const ALONE_SECTIONS = new Set(["sonidos", "letras", "vocales", "leer-palabras", "leer-cuentos"]);
const BY_EAR = new Set(["rimas", "completar-rima"]);
const READ_ALONE = new Set(GAMES.filter(([id, section]) => ALONE_SECTIONS.has(section) && !BY_EAR.has(id)).flatMap((g) => g[3]));
const clean = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}️‍▢—]/gu, " ")
    .replace(/_+/g, "…")
    .replace(/\s+/g, " ")
    .trim();

function aloud(q: Question, key: string): Question {
  if (q.speak) return q.visual?.kind === "passage" ? { ...q, speak: `${q.speak} ${q.prompt}` } : q;
  const text = !READ_ALONE.has(key) && q.visual?.kind === "text" ? `${q.visual.text.replace(/[.\s]+$/, "")}. ` : "";
  return { ...q, speak: clean(`${text}${q.prompt}`) };
}

export const COMUNICACION_I5 = cnebCurriculum(BLOCKS, SECTIONS, GAMES, (key, gen) => (r) => aloud(gen(r), key));
