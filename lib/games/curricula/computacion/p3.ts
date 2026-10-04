import * as A from "../../generators/compu/advanced";
import * as D from "../../generators/compu/data";
import * as K from "../../generators/compu/keyboard";
import * as R from "../../generators/compu/robot";
import { quiz, orderQuiz, pickAll, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import type { Curriculum, Section } from "../../types";
import { buildCurriculum, situations, type Row } from "./shared";

// Computación · 3.° de Primaria: la computadora por dentro, sistema operativo,
// archivos y extensiones, documentos y presentaciones, primera hoja de
// cálculo (celdas), robot con funciones, variables, datos y correo.

const SECTIONS: Section[] = [
  { id: "A", name: "La computadora por dentro", icon: "🧠" },
  { id: "B", name: "Sistema operativo y programas", icon: "🪟" },
  { id: "C", name: "Mecanografía", icon: "⌨️" },
  { id: "D", name: "Archivos y extensiones", icon: "📁" },
  { id: "E", name: "Documentos", icon: "📝" },
  { id: "F", name: "Presentaciones", icon: "📽️" },
  { id: "G", name: "Hoja de cálculo: celdas", icon: "📊" },
  { id: "H", name: "Programar al robot", icon: "🤖" },
  { id: "I", name: "Variables", icon: "🔢" },
  { id: "J", name: "Datos y tablas", icon: "📈" },
  { id: "K", name: "Correo electrónico", icon: "📧" },
  { id: "L", name: "Ciudadanía digital", icon: "🛡️" },
];

const INSIDE = situations([
  ["Es el «cerebro»: hace los cálculos y sigue las instrucciones.", "🧠 Procesador (CPU)"],
  ["Guarda lo que estás usando ahora; se borra al apagar.", "⚡ Memoria RAM"],
  ["Guarda tus archivos aunque apagues la computadora.", "💽 Disco duro o SSD"],
  ["Es la placa donde se conectan todas las piezas.", "🟩 Placa madre"],
  ["Le da electricidad a todas las piezas.", "🔌 Fuente de poder"],
], "¿Qué pieza es?");

const RAM_VS_DISK: ChoiceItem[] = [
  { p: "Escribí un cuento y se fue la luz sin guardar. ¿Por qué lo perdí?", a: "Estaba solo en la RAM, que se borra al apagarse", d: ["Porque el disco duro se rompió con la luz", "Porque el teclado se desconectó de golpe", "Porque el monitor se apagó antes que la CPU"] },
  { p: "¿Dónde quedan mis fotos cuando apago la computadora?", a: "En el disco duro", d: ["En la memoria RAM", "En el monitor", "En el cable del mouse"] },
  { p: "¿Qué pasa si una computadora tiene más memoria RAM?", a: "Puede tener más programas abiertos", d: ["La pantalla se vuelve más grande", "El teclado escribe más rápido", "Gasta menos tinta al imprimir"] },
  { p: "¿Qué pasa con la memoria RAM al apagar la computadora?", a: "Se borra lo que tenía", d: ["Se guarda todo para siempre", "Se copia a la impresora", "Se convierte en disco duro"] },
];

const OS: ChoiceItem[] = [
  { p: "¿Qué es el sistema operativo?", a: "El programa principal que hace funcionar la computadora y los demás programas", d: ["Un juego", "Un tipo de mouse", "Una página web"] },
  { p: "¿Cuál es un sistema operativo?", a: "Windows", d: ["Paint", "Una memoria USB", "El teclado"] },
  { p: "¿Cuál es un sistema operativo de celulares?", a: "Android", d: ["YouTube", "La calculadora", "El cargador"] },
  { p: "Paint, la calculadora y el navegador son...", a: "Programas o aplicaciones", d: ["Sistemas operativos", "Piezas de la computadora", "Virus"] },
];

const INSTALL: ChoiceItem[] = [
  { p: "¿Qué debo hacer antes de instalar un programa nuevo?", a: "Pedir permiso a un adulto", d: ["Instalarlo sin preguntar", "Apagar el monitor", "Borrar mis archivos"] },
  { p: "La computadora pide una actualización. ¿Para qué sirve?", a: "Para corregir errores y mejorar la seguridad", d: ["Para borrar mis fotos", "Para gastar internet sin motivo", "Para cambiar el teclado"] },
  { p: "¿De dónde es más seguro descargar aplicaciones?", a: "De la tienda oficial, con ayuda de un adulto", d: ["De cualquier página con anuncios", "De un mensaje de un desconocido", "De un enlace que llegó por correo extraño"] },
];

const TOP_ROW = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const BOTTOM_ROW = ["z", "x", "c", "v", "b", "n", "m"];
const HOME_ROW = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"];

const EXTENSIONS = situations([
  ["foto_paseo.jpg", "🖼️ Imagen"], ["cancion.mp3", "🎵 Audio"], ["video_cumple.mp4", "🎬 Video"], ["tarea.docx", "📄 Documento"],
  ["exposicion.pptx", "📽️ Presentación"], ["notas.xlsx", "📊 Hoja de cálculo"], ["dibujo.png", "🖼️ Imagen"],
], "¿Qué tipo de archivo es, según su extensión?");

const PATHS: ChoiceItem[] = [
  { t: "Documentos ▸ Colegio ▸ Tareas ▸ cuento.docx", p: "¿En qué carpeta está cuento.docx?", a: "Tareas", d: ["Documentos", "Colegio", "Escritorio"] },
  { t: "Imágenes ▸ Vacaciones ▸ playa.jpg", p: "¿Dentro de qué carpeta está la carpeta Vacaciones?", a: "Imágenes", d: ["playa.jpg", "Documentos", "Música"] },
  { t: "Música ▸ Favoritas ▸ himno.mp3", p: "¿Qué es «Favoritas»?", a: "Una carpeta dentro de Música", d: ["Un archivo de audio", "Un programa", "Un sistema operativo"] },
  { t: "Documentos ▸ Colegio ▸ Matemática ▸ fracciones.docx", p: "¿Cuántas carpetas hay que abrir desde Documentos para llegar al archivo?", a: "2", d: ["1", "3", "4"] },
];

const DOCS: ChoiceItem[] = [
  { p: "Quiero hacer una lista de útiles con puntos al inicio de cada línea. ¿Qué uso?", a: "Viñetas", d: ["Negrita", "Imprimir", "Subrayado"] },
  { p: "Una palabra aparece subrayada en rojo. ¿Qué significa?", a: "Que puede estar mal escrita", d: ["Que es muy importante", "Que es un enlace", "Que se va a borrar"] },
  { p: "Quiero poner una foto dentro de mi documento. ¿Qué uso?", a: "Insertar ▸ Imagen", d: ["Archivo ▸ Cerrar", "Copiar el título", "Cambiar el tamaño de letra"] },
  { p: "Quiero organizar datos en filas y columnas dentro del documento. ¿Qué inserto?", a: "Una tabla", d: ["Una viñeta", "Un salto de página", "Una imagen"] },
  { p: "¿Para qué sirve el corrector ortográfico?", a: "Para encontrar palabras mal escritas", d: ["Para cambiar el color del fondo", "Para imprimir", "Para apagar la computadora"] },
];

const SLIDES: ChoiceItem[] = [
  { p: "En un programa de presentaciones, cada página se llama...", a: "Diapositiva", d: ["Celda de cálculo", "Carpeta", "Pestaña del navegador"] },
  { p: "¿Qué debe tener la primera diapositiva?", a: "El título y el nombre del autor", d: ["Solo dibujos sin ningún texto", "La conclusión final del tema", "Una lista larga de números"] },
  { p: "¿Qué es mejor en una diapositiva?", a: "Pocas palabras e imágenes claras", d: ["Mucho texto en letra pequeña", "Letras del color del fondo", "Todo escrito en mayúsculas"] },
  { p: "El efecto al pasar de una diapositiva a otra se llama...", a: "Transición", d: ["Fórmula", "Viñeta numerada", "Contraseña"] },
  { p: "¿Qué tamaño de letra conviene en una diapositiva?", a: "Grande, para leer de lejos", d: ["Muy pequeña, para que quepa todo", "Distinta en cada palabra", "Del mismo color que el fondo"] },
];

const PRESENT_ORDER: OrderItem[] = [
  { seq: ["Escribir el título", "Agregar imágenes", "Elegir una transición", "Guardar la presentación"] },
  { seq: ["Saludar al público", "Explicar el tema", "Mostrar ejemplos", "Responder preguntas"] },
  { seq: ["Abrir el programa de presentaciones", "Crear una diapositiva nueva", "Escribir el contenido"] },
  { seq: ["Diapositiva de título", "Presentación del tema", "Datos importantes", "Conclusión"] },
  { seq: ["Elegir el tema", "Buscar información", "Hacer las diapositivas", "Practicar la exposición"] },
];

const SHEET_PARTS: ChoiceItem[] = [
  { p: "En una hoja de cálculo, las columnas se nombran con...", a: "Letras: A, B, C...", d: ["Números: 1, 2, 3...", "Colores", "Emojis"] },
  { p: "En una hoja de cálculo, las filas se nombran con...", a: "Números: 1, 2, 3...", d: ["Letras: A, B, C...", "Nombres de personas", "Días de la semana"] },
  { p: "¿Qué es una celda?", a: "El cuadrito donde se cruzan una columna y una fila", d: ["Una diapositiva", "Un archivo de música", "Una carpeta"] },
  { p: "La celda C4 está en...", a: "La columna C y la fila 4", d: ["La fila C y la columna 4", "La columna 4 y la fila 4", "La cuarta hoja"] },
];

const EMAIL_PARTS = situations([
  ["La dirección de la persona que recibirá el correo.", "Para"],
  ["El tema del correo, en pocas palabras.", "Asunto"],
  ["Un archivo que envío junto al correo, como una foto.", "Adjunto 📎"],
  ["El mensaje que escribo.", "Cuerpo del mensaje"],
], "¿Qué parte del correo es?");

const EMAIL: ChoiceItem[] = [
  { p: "¿Qué símbolo tiene toda dirección de correo electrónico?", a: "@ (arroba)", d: ["# (numeral)", "* (asterisco)", "& (ampersand)"] },
  { p: "¿Cuál es una dirección de correo válida?", a: "ana.rojas@colegio.edu.pe", d: ["ana rojas colegio edu pe", "www.anarojas.colegio.pe", "ana.rojas#colegio.edu.pe"] },
  { p: "¿Cuál es un buen asunto para enviar la tarea a la maestra?", a: "Tarea de Ciencias - Ana Rojas", d: ["holaaaa, maestra, ¿cómo está?", "(sin asunto)", "mensaje mensaje mensaje"] },
  { p: "Recibo un correo de un desconocido con un archivo adjunto. ¿Qué hago?", a: "No lo abro y le aviso a un adulto", d: ["Lo abro enseguida para ver qué es", "Lo reenvío a todos mis contactos", "Respondo con mi nombre y dirección"] },
];

const PRIVACY: ChoiceItem[] = [
  { p: "¿Quién debería poder ver mi perfil en un juego en línea?", a: "Solo amigos que conozco en persona", d: ["Todo el mundo, para tener más fans", "Cualquier jugador que me escriba", "Los desconocidos que me envíen regalos"] },
  { p: "Un juego pide permiso para usar mi ubicación. ¿Qué hago?", a: "Le pregunto a un adulto antes", d: ["Acepto siempre sin leer nada", "Escribo también mi dirección", "Lo comparto con mis compañeros"] },
  { p: "¿Qué nombre de usuario es más seguro?", a: "EstrellaAzul27", d: ["AnaRojasLima2015", "MiCasaEnMiraflores", "AnaColegioTrilce"] },
  { p: "¿Qué información puedo poner en mi perfil?", a: "Mi personaje o animal favorito", d: ["Mi dirección y mi teléfono", "El nombre de mi colegio y salón", "Mi fecha de nacimiento completa"] },
];

const SCREEN_TIME: ChoiceItem[] = [
  { p: "Llevo una hora seguida en la computadora. ¿Qué es bueno hacer?", a: "Descansar y mirar a lo lejos", d: ["Seguir jugando una hora más", "Acercarme más a la pantalla", "Subir el brillo y el volumen"] },
  { p: "¿Qué es un buen equilibrio?", a: "Pantallas un rato, y también jugar y leer", d: ["Pantallas todo el día, incluso al comer", "Mirar la pantalla sin parpadear mucho", "Dormir con la tablet encendida al lado"] },
  { p: "¿Cuánto antes de dormir es bueno dejar las pantallas?", a: "Un buen rato antes", d: ["Justo en el último segundo", "Nunca, se puede dormir con ellas", "Solo cuando se acabe la batería"] },
  { p: "¿Qué actividad no usa pantallas?", a: "Jugar con una pelota en el parque", d: ["Ver videos en la tablet", "Jugar en el celular de mi papá", "Mirar dibujos en la televisión"] },
];

const ROWS: Row[] = [
  ["A.1", "Las piezas de la computadora por dentro", (r) => quiz(r, "¿Qué pieza es?", INSIDE)],
  ["A.2", "Memoria RAM y almacenamiento", (r) => quiz(r, "", RAM_VS_DISK)],
  ["A.3", "Entrada, salida o almacenamiento", (r) => quiz(r, "", situations([
    ["⌨️ Teclado", "Entrada"], ["🖱️ Mouse", "Entrada"], ["🎤 Micrófono", "Entrada"], ["📷 Escáner", "Entrada"],
    ["🖥️ Monitor", "Salida"], ["🖨️ Impresora", "Salida"], ["🔊 Parlantes", "Salida"],
    ["💽 Disco duro", "Almacenamiento"], ["💾 Memoria USB", "Almacenamiento"], ["☁️ La nube", "Almacenamiento"],
  ], "¿Es un dispositivo de entrada, de salida o de almacenamiento?"))],

  ["B.1", "¿Qué es el sistema operativo?", (r) => quiz(r, "", OS)],
  ["B.2", "Instalar y actualizar programas", (r) => quiz(r, "", INSTALL)],
  ["B.3", "Atajos de teclado", (r) => quiz(r, "", situations([
    ["Ctrl + C", "Copiar"], ["Ctrl + V", "Pegar"], ["Ctrl + X", "Cortar"], ["Ctrl + Z", "Deshacer"], ["Ctrl + S", "Guardar"], ["Ctrl + P", "Imprimir"], ["Ctrl + A", "Seleccionar todo"],
  ], "¿Qué hace este atajo?"))],

  ["C.1", "La fila superior del teclado", (r) => pickAll(r, "Selecciona las letras de la fila superior (Q W E R T Y U I O P).", TOP_ROW.map((x) => x.toUpperCase()), [...HOME_ROW, ...BOTTOM_ROW].map((x) => x.toUpperCase()))],
  ["C.2", "La fila inferior del teclado", (r) => pickAll(r, "Selecciona las letras de la fila inferior (Z X C V B N M).", BOTTOM_ROW.map((x) => x.toUpperCase()), [...HOME_ROW, ...TOP_ROW].map((x) => x.toUpperCase()))],
  ["C.3", "¿Qué dedo usa cada tecla?", K.fingerForKey],
  ["C.4", "Escribir palabras con tilde", K.typeAccent],
  ["C.5", "Escribir oraciones completas", K.typeLongSentence],

  ["D.1", "Extensiones de archivo", (r) => quiz(r, "", EXTENSIONS)],
  ["D.2", "Carpetas dentro de carpetas", (r) => quiz(r, "", PATHS)],
  ["D.3", "Ponerles buenos nombres a los archivos", (r) => quiz(r, "", [
    { p: "¿Cuál es el mejor nombre para tu exposición sobre los volcanes?", a: "exposicion volcanes", d: ["presentación nueva 2", "aaaaaaa", "documento final final"] },
    { p: "¿Cuál es el mejor nombre para la foto de tu mascota Toby?", a: "foto Toby", d: ["IMG_0001", "imagen sin título", "zzz"] },
    { p: "¿Por qué no conviene llamar a todos los archivos «nuevo»?", a: "Porque no sabré qué contiene cada uno", d: ["Porque ocupan más espacio en el disco", "Porque se borran solos al día siguiente", "Porque no se pueden abrir nunca más"] },
    { p: "¿Qué nombre ayuda a encontrar la tarea de Matemática del lunes?", a: "tarea matemática lunes", d: ["documento 7", "tarea", "archivo de la semana pasada"] },
  ])],

  ["E.1", "Viñetas, imágenes, tablas y corrector", (r) => quiz(r, "", DOCS)],
  ["E.2", "Formato del texto", (r) => quiz(r, "", [
    { t: "N", p: "¿Qué hace el botón N?", a: "Negrita", d: ["Cursiva", "Subrayado", "Nuevo archivo"] },
    { t: "K", p: "¿Qué hace el botón K?", a: "Cursiva", d: ["Negrita", "Subrayado", "Copiar"] },
    { t: "S", p: "¿Qué hace el botón S?", a: "Subrayado", d: ["Negrita", "Cursiva", "Guardar"] },
    { p: "Quiero que el título esté en el centro de la hoja. ¿Qué uso?", a: "Centrar", d: ["Viñetas", "Cursiva", "Insertar tabla"] },
  ])],

  ["F.1", "Las partes de una presentación", (r) => quiz(r, "", SLIDES)],
  ["F.2", "Ordenar las diapositivas", (r) => orderQuiz(r, "Ordena las partes de la presentación.", PRESENT_ORDER)],

  ["G.1", "Filas, columnas y celdas", (r) => quiz(r, "", SHEET_PARTS)],
  ["G.2", "Encontrar una celda", A.sheetCell],

  ["H.1", "Programar al robot: caminos largos", (r) => R.writeProgram(r, 5, 8)],
  ["H.2", "Programas con bucles combinados", R.chooseLoopProgram],
  ["H.3", "Funciones: un bloque de pasos con nombre", R.functionDestination],
  ["H.4", "Corregir el programa del robot", (r) => R.debugRobot(r, 5, 8)],

  ["I.1", "Variables: ¿cuánto vale al final?", (r) => A.pseudocode(r, 1)],
  ["I.2", "Variables dentro de un bucle", (r) => A.pseudocode(r, 2)],

  ["J.1", "Leer un pictograma", D.readPictograph],
  ["J.2", "Comparar datos", D.comparePictograph],
  ["J.3", "Buscar en una tabla de datos", (r) => A.dbFilter(r, 1)],
  ["J.4", "Mensajes en código secreto", D.decodeMessage],

  ["K.1", "Las partes de un correo electrónico", (r) => quiz(r, "", EMAIL_PARTS)],
  ["K.2", "Usar el correo electrónico", (r) => quiz(r, "", EMAIL)],

  ["L.1", "Privacidad en juegos y aplicaciones", (r) => quiz(r, "", PRIVACY)],
  ["L.2", "Elegir una contraseña segura", (r) => quiz(r, "¿Cuál es la contraseña más segura?", [
    { a: "Sol#Llama82", d: ["123456789012", "contraseña2015", "aaaaaaaaaa"] },
    { a: "Rana!Azul47", d: ["qwertyuiop", "mipperrotoby", "111111111111"] },
    { a: "Luna*Verde19", d: ["abc123abc123", "colegiotrilce", "anarojas2015"] },
    { a: "Oso$Rojo35", d: ["1234567890", "contraseña", "mimamamemima"] },
  ])],
  ["L.3", "Tiempo de pantalla equilibrado", (r) => quiz(r, "", SCREEN_TIME)],
];

export const COMPUTACION_P3: Curriculum = buildCurriculum(SECTIONS, ROWS);
