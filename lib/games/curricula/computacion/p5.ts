import * as A from "../../generators/compu/advanced";
import * as R from "../../generators/compu/robot";
import { quiz, type ChoiceItem } from "../../generators/lengua/bank";
import type { Curriculum, Section } from "../../types";
import { buildCurriculum, situations, type Row } from "./shared";

// Computación · 5.° de Primaria: unidades de almacenamiento, binario de 8
// bits, funciones de la hoja de cálculo, programación con listas, búsqueda
// binaria, cifrado César, compresión, lógica, direcciones web, IA y
// ciudadanía digital.

const SECTIONS: Section[] = [
  { id: "A", name: "Unidades de almacenamiento", icon: "💾" },
  { id: "B", name: "Sistema binario (8 bits)", icon: "0️⃣" },
  { id: "C", name: "Hoja de cálculo: funciones", icon: "🧮" },
  { id: "D", name: "Gráficos y datos", icon: "📊" },
  { id: "E", name: "Programación", icon: "💻" },
  { id: "F", name: "Algoritmos de búsqueda", icon: "🔍" },
  { id: "G", name: "Criptografía", icon: "🔐" },
  { id: "H", name: "Compresión de datos", icon: "🗜️" },
  { id: "I", name: "Lógica booleana", icon: "🔀" },
  { id: "J", name: "Direcciones web y seguridad", icon: "🌐" },
  { id: "K", name: "Inteligencia artificial", icon: "🦾" },
  { id: "L", name: "Ciudadanía digital", icon: "🛡️" },
];

const STORAGE_SIZE: ChoiceItem[] = [
  { p: "¿Qué ocupa más espacio normalmente?", a: "Un video de 10 minutos", d: ["Un documento de una página", "Una canción corta", "Una foto pequeña de perfil"] },
  { p: "¿Qué ocupa menos espacio normalmente?", a: "Un texto de una página", d: ["Una película completa", "Un video de 10 minutos", "Un juego grande con gráficos"] },
  { p: "¿En qué unidad se mide normalmente un disco duro?", a: "En gigabytes o terabytes", d: ["En bits, de uno en uno", "En kilómetros por hora", "En metros y centímetros"] },
  { p: "¿Cuántos bits tiene un byte?", a: "8", d: ["2", "10", "100"] },
];

const URL_PARTS = situations([
  ["https:// (en https://www.colegio.edu.pe/tareas)", "Protocolo: la forma segura de comunicarse"],
  ["www.colegio.edu.pe (en https://www.colegio.edu.pe/tareas)", "Dominio: el nombre del sitio web"],
  ["/tareas (en https://www.colegio.edu.pe/tareas)", "Ruta: la página dentro del sitio"],
  ["https:// (en https://www.minedu.gob.pe/aprendo)", "Protocolo: la forma segura de comunicarse"],
  ["www.minedu.gob.pe (en https://www.minedu.gob.pe/aprendo)", "Dominio: el nombre del sitio web"],
  ["/aprendo (en https://www.minedu.gob.pe/aprendo)", "Ruta: la página dentro del sitio"],
  ["https:// (en https://www.biblioteca.pe/cuentos/andinos)", "Protocolo: la forma segura de comunicarse"],
  ["www.biblioteca.pe (en https://www.biblioteca.pe/cuentos/andinos)", "Dominio: el nombre del sitio web"],
  ["/cuentos/andinos (en https://www.biblioteca.pe/cuentos/andinos)", "Ruta: la página dentro del sitio"],
], "¿Qué parte de la dirección web es?");

const WEB_SECURITY: ChoiceItem[] = [
  { p: "¿Qué significa el candado 🔒 junto a la dirección web?", a: "Que la conexión está cifrada", d: ["Que la página es un juego", "Que la página está bloqueada", "Que no hay conexión a internet"] },
  { p: "¿Cuál dirección parece falsa?", a: "www.banco-n4cion-seguro.xyz", d: ["www.minedu.gob.pe", "www.colegio.edu.pe", "www.bibliotecanacional.gob.pe"] },
  { p: "¿Qué terminación usan muchos sitios del gobierno peruano?", a: ".gob.pe", d: [".xyz", ".juego", ".gratis"] },
  { p: "Una página con «http://» (sin s) me pide la contraseña. ¿Qué hago?", a: "No la escribo, no es segura", d: ["La escribo igual, no pasa nada", "Escribo la contraseña de mis papás", "La publico para que la vean"] },
];

const AI: ChoiceItem[] = [
  { p: "¿Cómo aprende una IA a reconocer gatos en fotos?", a: "Viendo muchas fotos de gatos", d: ["Comiendo croquetas de gato", "Adivinando sin ver ningún dato", "Leyendo un solo libro de animales"] },
  { p: "Si una IA solo vio fotos de perros blancos, ¿qué puede pasar?", a: "Que falle con perros de otros colores", d: ["Que reconozca todos los perros perfecto", "Que se convierta en un perro blanco", "Que nunca vuelva a equivocarse"] },
  { p: "¿Cuál es un ejemplo de IA en la vida diaria?", a: "Un traductor automático", d: ["Un lápiz con borrador", "Una regla de plástico de 30 cm", "Un cuaderno cuadriculado"] },
  { p: "Una IA te da una respuesta para tu tarea. ¿Qué haces?", a: "La compruebo y la explico con mis palabras", d: ["La copio sin leerla y la entrego así", "La entrego como mía sin revisar nada", "Le doy mis contraseñas para que la mejore"] },
];

const CITIZENSHIP: ChoiceItem[] = [
  { p: "Ves una noticia increíble en redes sociales. ¿Qué haces antes de compartirla?", a: "Verifico si medios confiables la publican", d: ["La comparto rápido para ser el primero", "Le agrego más cosas para que sea mejor", "La envío a todos mis contactos de una vez"] },
  { p: "¿Qué es una noticia falsa?", a: "Información inventada que parece verdad", d: ["Una noticia muy antigua, de hace muchos años", "Una noticia muy corta y sin fotos", "Una noticia que trae muchas fotos"] },
  { p: "Un compañero recibe mensajes ofensivos en un grupo. ¿Cómo lo ayudo?", a: "Lo apoyo y aviso a un adulto", d: ["Me río y reacciono a los mensajes", "Reenvío los mensajes a otros grupos", "Lo saco del grupo sin decirle nada"] },
  { p: "¿Qué es la huella digital?", a: "El rastro que dejo en internet", d: ["La marca del dedo en la pantalla", "Un programa para dibujar huellas", "Un virus que copia las fotos"] },
];

const ROWS: Row[] = [
  ["A.1", "Ordenar unidades: bit, byte, KB, MB, GB, TB", A.unitsOrder],
  ["A.2", "Bits y bytes", A.bitsInBytes],
  ["A.3", "¿Qué ocupa más espacio?", (r) => quiz(r, "", STORAGE_SIZE)],

  ["B.1", "Del binario al decimal (8 bits)", (r) => A.binaryToDecimal(r, 8)],
  ["B.2", "Del decimal al binario (8 bits)", (r) => A.decimalToBinary(r, 8)],
  ["B.3", "Imágenes en código binario", A.pixelRow],

  ["C.1", "La función SUMA", (r) => A.sheetFormula(r, ["SUMA"])],
  ["C.2", "La función PROMEDIO", (r) => A.sheetFormula(r, ["PROMEDIO"])],
  ["C.3", "Las funciones MAX y MIN", (r) => A.sheetFormula(r, ["MAX", "MIN"])],
  ["C.4", "Fórmulas con operaciones", (r) => A.sheetFormula(r, ["suma", "resta", "mult"])],

  ["D.1", "Elegir el gráfico adecuado", (r) => quiz(r, "", situations([
    ["Comparar las ventas de cada día de la feria.", "📊 Gráfico de barras"],
    ["Ver cómo creció una planta semana a semana.", "📈 Gráfico de líneas"],
    ["Mostrar qué porcentaje de la clase prefiere cada deporte.", "🥧 Gráfico circular"],
    ["Comparar las notas de cinco alumnos.", "📊 Gráfico de barras"],
  ], "¿Qué gráfico es mejor para...?"))],
  ["D.2", "Filtrar datos con dos condiciones", (r) => A.dbFilter(r, 2)],

  ["E.1", "Condiciones: si... si no", (r) => A.pseudocode(r, 3)],
  ["E.2", "Recorrer una lista", (r) => A.pseudocode(r, 4)],
  ["E.3", "Posiciones de una lista", A.listIndex],
  ["E.4", "Robot: funciones", R.functionDestination],
  ["E.5", "Robot: depurar programas largos", (r) => R.debugRobot(r, 6, 8)],

  ["F.1", "Búsqueda lineal", A.linearSearch],
  ["F.2", "Búsqueda binaria en listas de 7", (r) => A.binarySearch(r, 7)],

  ["G.1", "Cifrado César (corrimiento de 1 a 3)", (r) => A.caesar(r, 3)],

  ["H.1", "Comprimir y descomprimir (RLE)", A.rle],

  ["I.1", "Lógica con comparaciones", (r) => A.booleanEval(r, 2)],
  ["I.2", "Lógica con NO", (r) => A.booleanEval(r, 3)],

  ["J.1", "Las partes de una dirección web", (r) => quiz(r, "", URL_PARTS)],
  ["J.2", "¿Es segura la página?", (r) => quiz(r, "", WEB_SECURITY)],

  ["K.1", "¿Cómo aprende la inteligencia artificial?", (r) => quiz(r, "", AI)],

  ["L.1", "Noticias falsas, ciberacoso y huella digital", (r) => quiz(r, "", CITIZENSHIP)],
];

export const COMPUTACION_P5: Curriculum = buildCurriculum(SECTIONS, ROWS);
