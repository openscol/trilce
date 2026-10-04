import * as A from "../../generators/compu/advanced";
import { quiz, orderQuiz, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import type { Curriculum, Section } from "../../types";
import { buildCurriculum, situations, type Row } from "./shared";

// Computación · 6.° de Primaria: pseudocódigo con listas, algoritmos de
// ordenamiento y búsqueda binaria, lógica booleana, hoja de cálculo con SI,
// bases de datos, binario, cifrado, HTML, redes, ciberseguridad y ética de la IA.

const SECTIONS: Section[] = [
  { id: "A", name: "Pseudocódigo", icon: "📜" },
  { id: "B", name: "Listas", icon: "📋" },
  { id: "C", name: "Algoritmos de ordenamiento", icon: "🔢" },
  { id: "D", name: "Búsqueda binaria", icon: "🔍" },
  { id: "E", name: "Lógica booleana", icon: "🔀" },
  { id: "F", name: "Hoja de cálculo avanzada", icon: "🧮" },
  { id: "G", name: "Bases de datos", icon: "🗃️" },
  { id: "H", name: "Representar y proteger datos", icon: "🔐" },
  { id: "I", name: "Páginas web y HTML", icon: "🌐" },
  { id: "J", name: "Redes", icon: "📡" },
  { id: "K", name: "Ciberseguridad", icon: "🛡️" },
  { id: "L", name: "Ética e inteligencia artificial", icon: "⚖️" },
];

const ALGO_CONCEPTS: ChoiceItem[] = [
  { p: "¿Qué es un algoritmo?", a: "Pasos ordenados para resolver un problema", d: ["Una computadora muy rápida y potente", "Un virus que se copia por toda la red", "Un archivo de música, de fotos o de video"] },
  { p: "¿Qué es depurar un programa?", a: "Encontrar y corregir sus errores", d: ["Borrarlo para empezar de cero", "Imprimirlo para leerlo en papel", "Hacerlo más largo con más líneas"] },
  { p: "¿Qué es una variable?", a: "Un nombre que guarda un valor", d: ["Un número que nunca puede cambiar", "Una tecla especial del teclado", "Un gráfico de barras de colores"] },
  { p: "¿Para qué sirve un bucle?", a: "Para repetir instrucciones", d: ["Para apagar la computadora", "Para borrar todas las variables", "Para dibujar un círculo perfecto"] },
  { p: "¿Qué es una condición en un programa?", a: "Una pregunta que decide qué hacer", d: ["Una lista de números ordenados", "Un dibujo que aparece al inicio", "La velocidad de la computadora"] },
];

const SORT_CONCEPTS: ChoiceItem[] = [
  { p: "En el ordenamiento burbuja, ¿qué pasa con el mayor en cada pasada?", a: "Avanza hasta el final", d: ["Se queda al inicio de la lista", "Se borra de la lista", "Se duplica en dos lugares"] },
  { p: "Ordenamiento por selección: ¿qué se busca en cada paso?", a: "El menor de los que faltan", d: ["El número del medio de la lista", "Un número cualquiera al azar", "El último número que se agregó"] },
  { p: "¿Por qué es útil tener una lista ordenada?", a: "Para buscar mucho más rápido", d: ["Para que ocupe menos colores", "Para que el programa no tenga errores", "Para que la lista se vea más corta"] },
  { p: "¿Cómo queda [3, 1, 2] ordenada de menor a mayor?", a: "[1, 2, 3]", d: ["[3, 2, 1]", "[2, 1, 3]", "[1, 3, 2]"] },
];

const SEARCH_CONCEPTS: ChoiceItem[] = [
  { p: "¿Qué necesita la búsqueda binaria para funcionar?", a: "Que la lista esté ordenada", d: ["Que la lista sea corta", "Que tenga solo números pares", "Nada"] },
  { p: "En una lista ordenada de 1000 nombres, ¿qué búsqueda suele ser más rápida?", a: "La búsqueda binaria", d: ["La búsqueda lineal", "Leer la lista al revés", "Son iguales siempre"] },
  { p: "Buscas una palabra en el diccionario abriéndolo por la mitad. ¿A qué algoritmo se parece?", a: "Búsqueda binaria", d: ["Búsqueda lineal", "Ordenamiento burbuja", "Compresión"] },
];

const TRUTH_TABLE: ChoiceItem[] = (
  [
    ["VERDADERO Y VERDADERO", true], ["VERDADERO Y FALSO", false], ["FALSO Y FALSO", false],
    ["VERDADERO O FALSO", true], ["FALSO O FALSO", false], ["NO VERDADERO", false], ["NO FALSO", true],
  ] as const
).map(([t, v]) => ({ t, p: "Completa la tabla de verdad: ¿cuál es el resultado?", a: v ? "VERDADERO" : "FALSO", d: [v ? "FALSO" : "VERDADERO"] }));

const DB_CONCEPTS = situations([
  ["Cada fila de la tabla, con los datos de un alumno.", "Registro"],
  ["Cada columna de la tabla, como «Nombre» o «Edad».", "Campo"],
  ["Mostrar solo las filas que cumplen una condición.", "Filtrar"],
  ["Poner las filas de menor a mayor según un campo.", "Ordenar"],
], "En una base de datos, ¿cómo se llama...?");

const HTML = situations([
  ["<h1>", "Un título grande"], ["<p>", "Un párrafo de texto"], ["<img>", "Una imagen"],
  ["<a>", "Un enlace a otra página"], ["<ul>", "Una lista con viñetas"], ["<b>", "Texto en negrita"],
], "En HTML, ¿qué crea la etiqueta...?");

const HTML_ORDER: OrderItem[] = [
  { p: "Ordena el código para formar un enlace en HTML.", seq: ["<a href=\"tareas.html\">", "Ver tareas", "</a>"] },
  { p: "Ordena el código para formar una lista en HTML.", seq: ["<ul>", "<li>Manzana</li>", "<li>Pera</li>", "</ul>"] },
  { p: "Ordena el código para poner texto en negrita.", seq: ["<b>", "¡Importante!", "</b>"] },
  { p: "Ordena el código para formar un párrafo en HTML.", seq: ["<p>", "Hola, mundo", "</p>"] },
  { p: "Ordena el código para formar un título en HTML.", seq: ["<h1>", "Mi página", "</h1>"] },
  { p: "Ordena la estructura básica de una página.", seq: ["<html>", "<body>", "contenido", "</body>", "</html>"] },
];

const NETWORKS: ChoiceItem[] = [
  { p: "Cuando envío una foto por internet, se divide en pedacitos que viajan por separado. ¿Cómo se llaman?", a: "Paquetes", d: ["Píxeles", "Celdas", "Diapositivas"] },
  { p: "¿Qué hace el DNS?", a: "Traduce nombres de sitios a direcciones IP", d: ["Borra los virus que llegan por internet", "Imprime las páginas web que visitamos", "Carga la batería del router por la noche"] },
  { p: "¿Qué es una dirección IP?", a: "Un número que identifica un dispositivo", d: ["La contraseña secreta del Wi-Fi de casa", "El nombre de una página web famosa", "Un tipo de cable para conectar el router"] },
  { p: "¿Qué es el ancho de banda?", a: "Cuántos datos pasan por segundo", d: ["El tamaño de la pantalla en pulgadas", "La batería que le queda al router", "El número de teclas del teclado"] },
];

const SECURITY: ChoiceItem[] = [
  { p: "¿Cuál es la contraseña más segura?", a: "Mi$Llama.Corre-Lejos42", d: ["juan.perez.2012.lima", "12345678901234567890", "contraseñacontraseña"] },
  { p: "¿Qué es la ingeniería social?", a: "Engañar a personas para obtener datos", d: ["Construir puentes y edificios grandes", "Una red social para ingenieros", "Programar robots que ayudan en casa"] },
  { p: "¿Por qué es importante hacer copias de seguridad?", a: "Para no perder archivos si algo falla", d: ["Para que la computadora sea más rápida", "Para gastar más espacio en el disco", "Para eliminar todos los virus"] },
  { p: "Un mensaje urgente dice: «¡Responde en 5 minutos o perderás tu cuenta!». ¿Qué indica?", a: "Que probablemente es un engaño", d: ["Que es un mensaje oficial seguro", "Que debo responder lo antes posible", "Que gané un premio por ser rápido"] },
];

const ETHICS: ChoiceItem[] = [
  { p: "Una IA siempre elige al mismo tipo de persona para un premio. ¿Qué puede pasar?", a: "Que tenga un sesgo en sus datos", d: ["Que la computadora está apagada", "Que hay demasiada luz en la sala", "Que la IA nunca se equivoca en nada"] },
  { p: "¿Es correcto entregar un trabajo hecho por una IA como si fuera propio?", a: "No, hay que decir que se usó IA", d: ["Sí, siempre que quede bonito", "Sí, si nadie se da cuenta del truco", "Sí, si el trabajo es muy corto"] },
  { p: "¿Quién es responsable de cómo se usa una IA?", a: "Las personas que la crean y usan", d: ["Nadie, porque es una máquina", "Solo la computadora donde funciona", "El router que la conecta a internet"] },
  { p: "¿Qué datos no debo darle a una aplicación de IA?", a: "Mi dirección y mis contraseñas", d: ["Una pregunta de ciencias naturales", "El nombre de mi animal favorito", "Una receta de cocina para el postre"] },
];

const ROWS: Row[] = [
  ["A.1", "Conceptos de programación", (r) => quiz(r, "", ALGO_CONCEPTS)],
  ["A.2", "Ejecutar pseudocódigo con condiciones", (r) => A.pseudocode(r, 3)],
  ["A.3", "Ejecutar pseudocódigo con listas", (r) => A.pseudocode(r, 4)],

  ["B.1", "Posiciones y longitud de una lista", A.listIndex],

  ["C.1", "Ordenamiento burbuja: una pasada", A.bubblePass],
  ["C.2", "Cómo funcionan los ordenamientos", (r) => quiz(r, "", SORT_CONCEPTS)],

  ["D.1", "Búsqueda binaria en listas de 15", (r) => A.binarySearch(r, 15)],
  ["D.2", "Búsqueda lineal o binaria", (r) => quiz(r, "", SEARCH_CONCEPTS)],

  ["E.1", "Tablas de verdad", (r) => quiz(r, "", TRUTH_TABLE)],
  ["E.2", "Expresiones con Y, O y NO", (r) => A.booleanEval(r, 3)],

  ["F.1", "Funciones SUMA, PROMEDIO, MAX y MIN", (r) => A.sheetFormula(r, ["SUMA", "PROMEDIO", "MAX", "MIN"])],
  ["F.2", "La función SI", (r) => A.sheetFormula(r, ["SI"])],

  ["G.1", "Registros, campos y filtros", (r) => quiz(r, "", DB_CONCEPTS)],
  ["G.2", "Consultas con dos condiciones", (r) => A.dbFilter(r, 2)],

  ["H.1", "Binario de 8 bits", (r) => (r.chance(0.5) ? A.binaryToDecimal(r, 8) : A.decimalToBinary(r, 8))],
  ["H.2", "Cifrado César (corrimiento hasta 5)", (r) => A.caesar(r, 5)],
  ["H.3", "Compresión RLE", A.rle],

  ["I.1", "Etiquetas HTML", (r) => quiz(r, "", HTML)],
  ["I.2", "Escribir código HTML en orden", (r) => orderQuiz(r, "", HTML_ORDER)],

  ["J.1", "Paquetes, IP y DNS", (r) => quiz(r, "", NETWORKS)],

  ["K.1", "Contraseñas, ingeniería social y copias de seguridad", (r) => quiz(r, "", SECURITY)],

  ["L.1", "Ética e inteligencia artificial", (r) => quiz(r, "", ETHICS)],
];

export const COMPUTACION_P6: Curriculum = buildCurriculum(SECTIONS, ROWS);
