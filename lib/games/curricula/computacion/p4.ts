import * as A from "../../generators/compu/advanced";
import * as K from "../../generators/compu/keyboard";
import * as R from "../../generators/compu/robot";
import { quiz, orderQuiz, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import type { Curriculum, Section } from "../../types";
import { buildCurriculum, situations, type Row } from "./shared";

// Computación · 4.° de Primaria: redes, fórmulas en la hoja de cálculo,
// sistema binario (4 bits), píxeles, bucles y condicionales, ordenamiento,
// lógica Y/O, ciberseguridad y fuentes.

const SECTIONS: Section[] = [
  { id: "A", name: "Redes e internet", icon: "📡" },
  { id: "B", name: "Hoja de cálculo: fórmulas", icon: "🧮" },
  { id: "C", name: "Documentos y presentaciones", icon: "📝" },
  { id: "D", name: "Mecanografía", icon: "⌨️" },
  { id: "E", name: "Sistema binario", icon: "0️⃣" },
  { id: "F", name: "Píxeles e imágenes", icon: "🖼️" },
  { id: "G", name: "Programación: bucles y condiciones", icon: "🔁" },
  { id: "H", name: "Algoritmos: ordenar y buscar", icon: "🔍" },
  { id: "I", name: "Lógica: Y, O", icon: "🔀" },
  { id: "J", name: "Datos", icon: "📊" },
  { id: "K", name: "Ciberseguridad", icon: "🔒" },
  { id: "L", name: "Fuentes y derechos de autor", icon: "©️" },
];

const NETWORK = situations([
  ["El aparato que reparte internet a las computadoras y celulares de la casa.", "📶 Router"],
  ["La conexión sin cables entre los aparatos y el router.", "📡 Wi-Fi"],
  ["Una computadora muy potente que guarda páginas web y las envía cuando las pedimos.", "🗄️ Servidor"],
  ["Guardar archivos en servidores de internet en lugar de en tu computadora.", "☁️ La nube"],
  ["Muchas computadoras conectadas entre sí en todo el mundo.", "🌐 Internet"],
], "¿Qué es?");

const NETWORK_USE: ChoiceItem[] = [
  { p: "Abro una página web. ¿De dónde viene la información?", a: "De un servidor en internet", d: ["Del teclado de mi computadora", "De la tinta de la impresora", "Del cable del mouse"] },
  { p: "El Wi-Fi no funciona. ¿Qué es razonable revisar primero?", a: "Que el router esté encendido", d: ["Que el mouse tenga batería", "Que la impresora tenga papel", "Que el monitor esté limpio"] },
  { p: "¿Qué ventaja tiene guardar un archivo en la nube?", a: "Abrirlo desde otro dispositivo", d: ["Que nunca necesita internet", "Que la computadora va más rápido", "Que no necesita contraseña"] },
  { p: "¿Qué necesita un celular para conectarse al Wi-Fi de la casa?", a: "La contraseña de la red", d: ["Un cable USB muy largo", "El número de la impresora", "Una memoria USB vacía"] },
];

const DOCS: ChoiceItem[] = [
  { p: "Quiero empezar a escribir en una hoja nueva del documento. ¿Qué inserto?", a: "Un salto de página", d: ["Una viñeta grande", "Una transición animada", "Una fórmula de suma"] },
  { p: "Quiero que todas las diapositivas tengan el mismo estilo. ¿Qué uso?", a: "Un tema de diseño", d: ["Una fórmula", "La papelera de reciclaje", "El corrector ortográfico"] },
  { p: "¿Qué debo poner al final de una presentación con información de internet?", a: "Las fuentes que usé", d: ["Mi contraseña del correo", "Una foto", "Un juego para descargar"] },
  { p: "Quiero que una frase aparezca con un efecto al hacer clic. ¿Qué uso?", a: "Animación", d: ["Transición entre diapositivas", "Viñetas", "Salto de página"] },
];

const DOC_ORDER: OrderItem[] = [
  { seq: ["Abrir el documento", "Escribir el título", "Insertar una imagen", "Guardar los cambios"] },
  { seq: ["Seleccionar el texto", "Copiarlo", "Ir a la otra página", "Pegarlo"] },
  { seq: ["Crear la presentación", "Agregar diapositivas", "Poner las fuentes", "Ensayar la exposición"] },
  { seq: ["Investigar el tema", "Escribir el borrador", "Revisar la ortografía", "Dar formato", "Guardar y entregar"] },
];

const NETWORK_SECURITY: ChoiceItem[] = [
  { p: "¿Qué es un virus informático?", a: "Un programa que daña la computadora", d: ["Un resfrío que le da a la computadora", "Un juego gratis que se descarga solo", "Un cable roto dentro de la CPU"] },
  { p: "¿Qué ayuda a proteger la computadora de virus?", a: "Antivirus y actualizaciones", d: ["Subir el volumen al máximo", "Cambiar el fondo de pantalla", "Apagar solo el monitor"] },
  { p: "Además de la contraseña, el juego envía un código al celular de mi mamá para entrar. ¿Cómo se llama eso?", a: "Verificación en dos pasos", d: ["Un virus con contraseña", "Una transición de pantalla", "Un atajo de teclado secreto"] },
  { p: "Usé una computadora del colegio. ¿Qué hago al terminar?", a: "Cerrar sesión", d: ["Dejar mi cuenta abierta", "Pegar mi contraseña en la pantalla", "Apagar solo el monitor"] },
  { p: "¿Es buena idea usar la misma contraseña en todos lados?", a: "No, si la descubren entran a todo", d: ["Sí, así es más fácil de recordar", "Sí, siempre que sea muy corta", "Sí, si es mi nombre y mi edad"] },
];

const SOURCES: ChoiceItem[] = [
  { p: "Uso información de una página web en mi trabajo. ¿Qué hago?", a: "Escribo de dónde la saqué", d: ["Digo que yo lo inventé todo", "La copio sin decir de dónde es", "Borro el nombre del autor"] },
  { p: "¿Puedo usar cualquier imagen de internet y decir que es mía?", a: "No, tienen autor", d: ["Sí, todo internet es gratis", "Sí, siempre", "Sí, si le cambio el color"] },
  { p: "¿Qué significa poner las fuentes en un trabajo?", a: "Decir de dónde saqué la información", d: ["Elegir el tipo y tamaño de letra", "Poner el título grande y en color", "Agregar dibujos en cada página"] },
  { p: "Algunas imágenes tienen licencia libre. ¿Qué significa?", a: "El autor permite usarlas", d: ["Que no tienen ningún autor", "Que puedo decir que son mías", "Que están rotas"] },
];

const CHARTS = situations([
  ["Comparar cuántos alumnos prefieren cada fruta.", "📊 Gráfico de barras"],
  ["Comparar la estatura de cinco amigos.", "📊 Gráfico de barras"],
  ["Comparar cuántos libros leyó cada salón.", "📊 Gráfico de barras"],
  ["Mostrar cómo cambió la temperatura durante la semana.", "📈 Gráfico de líneas"],
  ["Ver cómo creció una planta mes a mes.", "📈 Gráfico de líneas"],
  ["Mostrar las ventas de la feria hora por hora.", "📈 Gráfico de líneas"],
  ["Mostrar qué parte del total es cada color favorito.", "🥧 Gráfico circular"],
  ["Mostrar cómo se reparte el día entre dormir, estudiar y jugar.", "🥧 Gráfico circular"],
  ["Mostrar qué fracción de la clase va caminando, en bus o en auto.", "🥧 Gráfico circular"],
], "¿Qué gráfico es mejor para...?");

const ROWS: Row[] = [
  ["A.1", "Router, Wi-Fi, servidor y la nube", (r) => quiz(r, "¿Qué es?", NETWORK)],
  ["A.2", "Cómo llega internet a mi casa", (r) => quiz(r, "", NETWORK_USE)],

  ["B.1", "Encontrar una celda", A.sheetCell],
  ["B.2", "Fórmulas: sumar y restar celdas", (r) => A.sheetFormula(r, ["suma", "resta"])],
  ["B.3", "Fórmulas: multiplicar celdas", (r) => A.sheetFormula(r, ["mult"])],
  ["B.4", "La función SUMA", (r) => A.sheetFormula(r, ["SUMA"])],

  ["C.1", "Documentos y presentaciones", (r) => quiz(r, "", DOCS)],
  ["C.2", "Los pasos para hacer un trabajo escrito", (r) => orderQuiz(r, "Ordena los pasos.", DOC_ORDER)],

  ["D.1", "¿Qué dedo usa cada tecla?", K.fingerForKey],
  ["D.2", "Escribir preguntas y exclamaciones", K.typePunctuation],
  ["D.3", "Escribir oraciones con tildes", K.typeLongSentence],

  ["E.1", "Del binario al decimal (4 bits)", (r) => A.binaryToDecimal(r, 4)],
  ["E.2", "Del decimal al binario (4 bits)", (r) => A.decimalToBinary(r, 4)],
  ["E.3", "Bits y bytes", A.bitsInBytes],

  ["F.1", "Imágenes hechas de píxeles", A.pixelRow],
  ["F.2", "¿Qué es un píxel?", (r) => quiz(r, "", [
    { p: "¿Qué es un píxel?", a: "Un puntito de color de la imagen", d: ["Un tipo de virus que daña imágenes", "Una tecla del teclado numérico", "Un archivo de música muy corto"] },
    { p: "Si una imagen tiene más píxeles...", a: "Se ven más detalles", d: ["Suena más fuerte al abrirla", "Pesa menos siempre", "Se mueve sola por la pantalla"] },
    { p: "Al agrandar mucho una foto pequeña, se ve «pixelada». ¿Por qué?", a: "Se notan los cuadraditos", d: ["Porque se borró una parte", "Porque tiene un virus", "Porque cambió de color sola"] },
    { p: "¿Cuántos píxeles tiene una imagen de 3 por 4 píxeles?", a: "12", d: ["7", "34", "9"] },
  ])],

  ["G.1", "Variables dentro de un bucle", (r) => A.pseudocode(r, 2)],
  ["G.2", "Condiciones: si... si no", (r) => A.pseudocode(r, 3)],
  ["G.3", "Robot: elegir el programa más corto", R.shortestProgram],
  ["G.4", "Robot: funciones", R.functionDestination],

  ["H.1", "Ordenamiento burbuja: una pasada", A.bubblePass],
  ["H.2", "Búsqueda lineal", A.linearSearch],

  ["I.1", "Lógica Y / O", (r) => A.booleanEval(r, 1)],
  ["I.2", "Lógica con comparaciones", (r) => A.booleanEval(r, 2)],

  ["J.1", "Filtrar una tabla de datos", (r) => A.dbFilter(r, 1)],
  ["J.2", "Elegir el gráfico adecuado", (r) => quiz(r, "", CHARTS)],

  ["K.1", "Virus, antivirus y contraseñas", (r) => quiz(r, "", NETWORK_SECURITY)],
  ["K.2", "Mensajes engañosos (phishing)", (r) => quiz(r, "", [
    { t: "«Tu cuenta será bloqueada. Escribe tu contraseña aquí: www.juego-gratis-premios.xyz»", p: "¿Qué hago?", a: "No escribo nada y aviso a un adulto", d: ["Escribo la contraseña rápido para no perderla", "Reenvío el mensaje a todos mis amigos", "Respondo con mi usuario y mis datos"] },
    { t: "Un correo dice ser de tu colegio, pero la dirección es colegio-trilce@premios-gratis.com.", p: "¿Qué indica?", a: "Que probablemente es falso", d: ["Que es un correo del colegio", "Que gané un premio del colegio", "Que debo responder hoy mismo"] },
    { t: "Una página pide la tarjeta de crédito de tus papás para «descargar un juego gratis».", p: "¿Qué hago?", a: "Cierro la página y aviso a un adulto", d: ["Busco la tarjeta de mis papás para pagar", "Lo descargo igual porque es gratis", "Comparto la página con mis compañeros"] },
  ])],

  ["L.1", "Citar las fuentes", (r) => quiz(r, "", SOURCES)],
];

export const COMPUTACION_P4: Curriculum = buildCurriculum(SECTIONS, ROWS);
