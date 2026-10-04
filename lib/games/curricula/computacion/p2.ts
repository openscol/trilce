import * as D from "../../generators/compu/data";
import * as K from "../../generators/compu/keyboard";
import * as R from "../../generators/compu/robot";
import { quiz, orderQuiz, pickAll, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import { uniqueOptions } from "../../generators/common";
import type { Rng } from "../../rng";
import type { Curriculum, Question, Section, Skill } from "../../types";

// Computación · 2.° de Primaria. Continúa 1.° con más dificultad: almacenamiento,
// escritorio y atajos, mecanografía con fila guía, archivos, procesador de
// textos, robot con bucles combinados, bloques estilo Scratch, datos y códigos,
// búsqueda en internet y ciudadanía digital.

const SECTIONS: Section[] = [
  { id: "A", name: "Equipos y almacenamiento", icon: "💾" },
  { id: "B", name: "El escritorio y los atajos", icon: "🪟" },
  { id: "C", name: "Mecanografía", icon: "⌨️" },
  { id: "D", name: "Archivos y carpetas", icon: "📁" },
  { id: "E", name: "El procesador de textos", icon: "📝" },
  { id: "F", name: "Dibujo digital", icon: "🎨" },
  { id: "G", name: "Programar al robot", icon: "🤖" },
  { id: "H", name: "Eventos y bloques", icon: "🧱" },
  { id: "I", name: "Condicionales y lógica", icon: "🔀" },
  { id: "J", name: "Datos y códigos", icon: "📊" },
  { id: "K", name: "Internet y búsquedas", icon: "🌐" },
  { id: "L", name: "Ciudadanía digital", icon: "🛡️" },
  { id: "M", name: "Robots e inteligencia artificial", icon: "🦾" },
];

function situations(list: [string, string][], prompt?: string): ChoiceItem[] {
  const answers = [...new Set(list.map(([, a]) => a))];
  return list.map(([t, a]) => ({ t, a, p: prompt, d: answers.filter((x) => x !== a) }));
}

function namePictures(list: [string, string][], prompt?: string): ChoiceItem[] {
  return list.map(([pic, a]) => ({ pic, a, p: prompt, d: list.map(([, n]) => n).filter((n) => n !== a) }));
}

// ---------------------------------------------------------------------------
// A. Equipos y almacenamiento
// ---------------------------------------------------------------------------

const ROLE = ["Entrada", "Salida", "Almacenamiento"];
const DEVICE_ROLE: ChoiceItem[] = (
  [
    ["⌨️ Teclado", 0], ["🖱️ Mouse", 0], ["🎤 Micrófono", 0], ["📷 Cámara web", 0], ["👆 Pantalla táctil (al tocarla)", 0],
    ["🖥️ Monitor", 1], ["🔊 Parlantes", 1], ["🖨️ Impresora", 1], ["🎧 Audífonos", 1], ["📽️ Proyector", 1],
    ["💾 Memoria USB", 2], ["💽 Disco duro", 2], ["☁️ La nube", 2], ["💿 CD", 2],
  ] as const
).map(([t, i]) => ({ t, p: "¿Este dispositivo es de entrada, de salida o de almacenamiento?", a: ROLE[i], d: ROLE.filter((_, k) => k !== i) }));

const STORAGE = ["💾 Memoria USB", "💽 Disco duro", "☁️ La nube", "💿 CD", "📀 DVD", "💳 Tarjeta de memoria", "🗄️ Disco externo"];
const NOT_STORAGE = ["🖱️ Mouse", "🔊 Parlantes", "🎤 Micrófono", "🖨️ Impresora", "⌨️ Teclado"];

const WHICH_COMPUTER = situations([
  ["Es una computadora que no se mueve de la mesa: tiene monitor, CPU, teclado y mouse.", "🖥️ Computadora de escritorio"],
  ["Se puede llevar a todas partes; se abre y se cierra como un libro.", "💻 Laptop"],
  ["Es una pantalla plana que se usa tocándola con los dedos, sin teclado.", "📲 Tablet"],
  ["Sirve para llamar, enviar mensajes y cabe en el bolsillo.", "📱 Celular"],
], "¿Qué tipo de computadora es?");

const PORTS: ChoiceItem[] = [
  { p: "¿Dónde conecto una memoria USB?", a: "En el puerto USB", d: ["En el enchufe de la pared", "En la pantalla", "En el teclado"] },
  { p: "La laptop tiene poca batería. ¿Qué hago?", a: "La conecto a su cargador", d: ["La meto al refrigerador", "Le quito el teclado", "La sacudo"] },
  { p: "¿Dónde conecto los audífonos?", a: "En la entrada de audífonos o por Bluetooth", d: ["En el puerto de la impresora", "En la pantalla", "En la batería"] },
  { p: "Antes de sacar la memoria USB, ¿qué es mejor hacer?", a: "Cerrar los archivos y «expulsarla»", d: ["Jalarla rápido mientras se copia", "Apagar la luz", "Mojarla"] },
];

// ---------------------------------------------------------------------------
// B. Escritorio y atajos
// ---------------------------------------------------------------------------

const DESKTOP = situations([
  ["La imagen que se ve detrás de todos los íconos.", "Fondo de pantalla"],
  ["La barra de abajo donde se ven los programas abiertos y la hora.", "Barra de tareas"],
  ["El botón que abre la lista de todos los programas.", "Menú Inicio"],
  ["Los dibujitos que abren programas o archivos al hacer doble clic.", "Íconos"],
], "¿Cómo se llama esta parte del escritorio?");

const WINDOWS: ChoiceItem[] = [
  { p: "Tengo abiertos Paint y un juego. ¿Cómo paso de uno al otro?", a: "Hago clic en su botón de la barra de tareas", d: ["Apago la computadora", "Desconecto el mouse", "Cierro los dos"] },
  { p: "Minimicé una ventana. ¿Dónde la encuentro?", a: "En la barra de tareas", d: ["En la papelera", "Se borró para siempre", "En la impresora"] },
  { p: "¿Cómo muevo una ventana a otro lugar de la pantalla?", a: "Arrastro su barra de título", d: ["Hago doble clic en el fondo", "Presiono Espacio", "La empujo con el dedo en el monitor"] },
];

const SHORTCUTS: [keys: string, action: string][] = [
  ["Ctrl + C", "Copiar"], ["Ctrl + V", "Pegar"], ["Ctrl + X", "Cortar"], ["Ctrl + Z", "Deshacer"], ["Ctrl + S", "Guardar"], ["Ctrl + P", "Imprimir"],
  ["Ctrl + A", "Seleccionar todo"], ["Ctrl + F", "Buscar"],
];

function shortcut(r: Rng): Question {
  const [keys, action] = r.pick(SHORTCUTS);
  if (r.chance(0.5)) {
    return {
      kind: "choice",
      prompt: `¿Qué hace el atajo ${keys}?`,
      options: uniqueOptions(r, action, SHORTCUTS.map(([, a]) => a).filter((a) => a !== action)),
      answer: action,
      explanation: `${keys}: ${action.toLowerCase()}.`,
      tag: keys,
    };
  }
  return {
    kind: "choice",
    prompt: `¿Qué atajo uso para ${action.toLowerCase()}?`,
    options: uniqueOptions(r, keys, SHORTCUTS.map(([k]) => k).filter((k) => k !== keys)),
    answer: keys,
    explanation: `Para ${action.toLowerCase()}: ${keys}.`,
    tag: keys,
  };
}

const COPY_PASTE: ChoiceItem[] = [
  { p: "Copio una palabra y la pego en otro lugar. ¿Qué pasa con la palabra original?", a: "Se queda donde estaba", d: ["Desaparece", "Se borra todo el texto", "Cambia de color"] },
  { p: "Corto una imagen y la pego en otro lugar. ¿Qué pasa con la original?", a: "Se mueve: ya no está donde estaba", d: ["Se queda igual en los dos lugares", "Se imprime", "Se agranda"] },
  { p: "¿Qué hago primero para copiar un texto?", a: "Lo selecciono", d: ["Lo pego", "Apago la computadora", "Cierro el programa"] },
  { p: "Quiero mover un párrafo a otra página, sin que quede repetido. ¿Qué uso?", a: "Cortar y pegar", d: ["Copiar y pegar", "Imprimir", "Deshacer"] },
];

// ---------------------------------------------------------------------------
// D-F. Archivos, procesador de textos y dibujo
// ---------------------------------------------------------------------------

const FILE_TYPES = namePictures([
  ["🖼️", "Imagen o foto"], ["🎵", "Música o sonido"], ["🎬", "Video"], ["📄", "Documento de texto"], ["📊", "Hoja de cálculo o gráfico"],
], "¿Qué tipo de archivo es?");

const FILE_NAMES: ChoiceItem[] = [
  { p: "Guardaste un dibujo de tu perro. ¿Cuál es el mejor nombre?", a: "dibujo perro Toby", d: ["documento nuevo 3", "asdfghjklñ", "archivo sin título"] },
  { p: "Escribiste un cuento sobre el mar. ¿Cuál es el mejor nombre?", a: "cuento del mar", d: ["nuevo documento", "aaaaaaaaaa", "texto 1 final final"] },
  { p: "Tomaste fotos de tu cumpleaños. ¿Cuál es el mejor nombre para la carpeta?", a: "fotos cumpleaños", d: ["carpeta nueva (2)", "zzzzzz", "cosas varias mías"] },
  { p: "¿Por qué es bueno ponerle un buen nombre a un archivo?", a: "Para encontrarlo fácilmente después", d: ["Para que ocupe menos espacio en el disco", "Para que se abra más rápido", "Para que nadie lo pueda borrar nunca"] },
];

const NEW_FOLDER: OrderItem[] = [
  { seq: ["Hacer clic derecho en el escritorio", "Elegir «Nuevo»", "Elegir «Carpeta»", "Escribir el nombre y presionar Enter"] },
  { seq: ["Abrir el programa", "Escribir el texto", "Elegir «Guardar»", "Ponerle nombre al archivo"] },
];

const TRASH: ChoiceItem[] = [
  { p: "Borré un archivo sin querer. ¿Dónde lo busco?", a: "En la papelera de reciclaje 🗑️", d: ["En la bandeja de la impresora", "Dentro del teclado o del mouse", "Ya no existe en ningún lugar"] },
  { p: "¿Qué hago para recuperar un archivo de la papelera?", a: "Lo selecciono y elijo «Restaurar»", d: ["Apago y prendo la computadora", "Vacío la papelera de reciclaje", "Lo arrastro de nuevo a la papelera"] },
  { p: "Si vacío la papelera, ¿qué pasa con los archivos?", a: "Se borran definitivamente", d: ["Vuelven a su carpeta original", "Se imprimen", "Se copian a una memoria USB"] },
  { p: "¿Qué pasa al arrastrar un archivo a la papelera?", a: "Se mueve a la papelera", d: ["Se borra para siempre al instante", "Se imprime", "Se cambia su nombre por «basura»"] },
];

const FORMAT_BUTTONS: ChoiceItem[] = [
  { t: "N", p: "En el procesador de textos, ¿qué hace el botón N?", a: "Negrita: letras más gruesas", d: ["Cursiva: letras inclinadas", "Subrayado: una línea debajo", "Cambia el color"] },
  { t: "K", p: "En el procesador de textos, ¿qué hace el botón K?", a: "Cursiva: letras inclinadas", d: ["Negrita: letras más gruesas", "Subrayado: una línea debajo", "Borra el texto"] },
  { t: "S", p: "En el procesador de textos, ¿qué hace el botón S?", a: "Subrayado: una línea debajo", d: ["Negrita: letras más gruesas", "Cursiva: letras inclinadas", "Guarda el archivo"] },
];

const HOW_IT_LOOKS: ChoiceItem[] = [
  { p: "Quiero que el título se vea más grueso y fuerte. ¿Qué uso?", a: "Negrita (N)", d: ["Cursiva (K)", "Subrayado (S)", "Borrar"] },
  { p: "Quiero poner una línea debajo de una palabra importante. ¿Qué uso?", a: "Subrayado (S)", d: ["Negrita (N)", "Cursiva (K)", "Imprimir"] },
  { p: "Quiero que una palabra se vea inclinada. ¿Qué uso?", a: "Cursiva (K)", d: ["Negrita (N)", "Subrayado (S)", "Guardar"] },
  { p: "Quiero que las letras se vean más grandes. ¿Qué cambio?", a: "El tamaño de la letra", d: ["El color de la letra", "El nombre del archivo", "El fondo de pantalla"] },
  { p: "Quiero que el título sea rojo. ¿Qué cambio?", a: "El color de la letra", d: ["El tamaño de la letra", "La alineación", "El volumen"] },
];

const ALIGN: ChoiceItem[] = [
  { p: "Quiero que el título quede en el medio de la hoja. ¿Qué alineación uso?", a: "Centrar", d: ["Alinear a la izquierda", "Alinear a la derecha"] },
  { p: "Normalmente, ¿hacia dónde se alinea el texto de un cuento?", a: "A la izquierda", d: ["Al centro de la hoja", "A la derecha"] },
  { p: "Quiero poner la fecha pegada al lado derecho de la hoja. ¿Qué alineación uso?", a: "Alinear a la derecha", d: ["Centrar", "Alinear a la izquierda"] },
  { p: "Quiero centrar el nombre de mi poema. ¿Qué botón uso?", a: "Centrar", d: ["Alinear a la derecha", "Alinear a la izquierda"] },
  { p: "En una carta, ¿dónde va la firma normalmente?", a: "A la derecha o al centro", d: ["Arriba del título", "Dentro de la fecha"] },
];

const WRITE_DOC: OrderItem[] = [
  { seq: ["Abrir el procesador de textos", "Escribir el título", "Escribir el texto", "Guardar el documento"] },
  { seq: ["Seleccionar el título", "Hacer clic en Negrita", "Elegir un tamaño más grande", "Guardar los cambios"] },
];

const DRAW_TOOLS = situations([
  ["Quiero dibujar una línea recta perfecta.", "📏 Línea"],
  ["Quiero dibujar un círculo.", "⭕ Elipse"],
  ["Quiero dibujar un rectángulo.", "▭ Rectángulo"],
  ["Quiero rellenar una figura de color.", "🪣 Relleno"],
  ["Quiero escribir un título en el dibujo.", "🔤 Texto"],
], "¿Qué herramienta uso?");

const DRAW_EDIT: ChoiceItem[] = [
  { p: "Dibujé una flor y quiero otra igual al lado. ¿Qué hago?", a: "La selecciono, la copio y la pego", d: ["Uso el borrador sobre la primera flor", "Borro todo y empiezo de nuevo", "Cambio el tamaño de la hoja"] },
  { p: "Quiero mover el sol a otra parte del dibujo. ¿Qué hago?", a: "Lo selecciono y lo arrastro", d: ["Lo borro", "Cierro Paint y lo abro otra vez", "Lo pinto de negro con el balde"] },
  { p: "El dibujo se ve muy pequeño para trabajar los detalles. ¿Qué uso?", a: "🔍 La lupa", d: ["🪣 El balde de relleno", "🧽 Goma", "💾 El botón Guardar"] },
  { p: "Me salió mal la última línea. ¿Qué uso?", a: "Deshacer (Ctrl + Z)", d: ["Guardar (Ctrl + S)", "Imprimir (Ctrl + P)", "Copiar (Ctrl + C)"] },
];

// ---------------------------------------------------------------------------
// H. Eventos y bloques (estilo Scratch)
// ---------------------------------------------------------------------------

const EVENTS: ChoiceItem[] = [
  { code: "when this sprite clicked\nsay [¡Miau!]", p: "¿Qué hace que este programa empiece?", a: "Hacer clic en el gato", d: ["Decir ¡Miau! muy fuerte", "Mover el gato 10 pasos", "Cambiar el gato de color"] },
  { code: "when [espacio v] key pressed\nchange y by (50)\nwait (0.3) seconds\nchange y by (-50)", p: "¿Qué hace que el personaje salte?", a: "Presionar la tecla Espacio", d: ["Hacer clic en la bandera", "Mover el mouse a un lado", "Esperar un minuto entero"] },
  { code: "when flag clicked\nplay sound (Música v) until done", p: "¿Qué pasa al hacer clic en la bandera verde?", a: "Suena la música", d: ["Se apaga la computadora", "El gato salta dos veces", "No pasa absolutamente nada"] },
  { code: "when [flecha derecha v] key pressed\nmove (10) steps", p: "¿Qué tecla hace avanzar al auto?", a: "La flecha ➡️", d: ["La flecha ⬅️", "La tecla Enter", "La barra espaciadora"] },
];

const BLOCKS_ORDER: OrderItem[] = [
  { seq: ["when flag clicked", "say [¡Hola!] for (2) seconds", "move (10) steps", "say [¡Adiós!] for (2) seconds"], blocks: true },
  { seq: ["when flag clicked", "go to x: (0) y: (0)", "repeat (3)\nchange y by (20)\nend"], blocks: true },
  { seq: ["when this sprite clicked", "play sound (Miau v) until done", "hide"], blocks: true },
];

const PROGRAM_RESULT: ChoiceItem[] = [
  { code: "when flag clicked\nrepeat (3)\nplay sound (Aplauso v) until done\nend", p: "¿Cuántas veces suena el aplauso?", a: "3 veces", d: ["1 vez", "2 veces", "No suena"] },
  { code: "when flag clicked\nmove (10) steps\nmove (10) steps", p: "¿Cuántos pasos se mueve en total?", a: "20 pasos", d: ["10 pasos", "2 pasos", "30 pasos"] },
  { code: "when this sprite clicked\nsay [¡Guau!]", p: "¿Cuándo dice «¡Guau!» el perro?", a: "Cuando hago clic en el perro", d: ["Siempre, sin parar", "Cuando apago la computadora", "Al presionar la bandera"] },
  { code: "when flag clicked\nrepeat (2)\nturn cw (90) degrees\nchange y by (30)\nend", p: "¿Cuántas veces gira el objeto?", a: "2 veces", d: ["1 vez", "4 veces", "3 veces"] },
];

// ---------------------------------------------------------------------------
// I. Condicionales y lógica
// ---------------------------------------------------------------------------

const IF_ELSE: ChoiceItem[] = [
  { t: "Si está lloviendo, juego adentro. Si no, juego en el parque. Hoy hay sol. ☀️", p: "¿Dónde juego?", a: "En el parque", d: ["Adentro", "No juego"] },
  { t: "Si el número es mayor que 5, el robot aplaude. Si no, salta. El número es 8.", p: "¿Qué hace el robot?", a: "Aplaude", d: ["Salta", "Se apaga"] },
  { t: "Si el número es mayor que 5, el robot aplaude. Si no, salta. El número es 3.", p: "¿Qué hace el robot?", a: "Salta", d: ["Aplaude", "Se apaga"] },
  { t: "Si la batería está baja, la conecto al cargador. Si no, sigo usándola. La batería está al 90 %.", p: "¿Qué hago?", a: "Sigo usándola", d: ["La conecto al cargador", "La apago"] },
  { t: "Si toco la estrella ⭐ gano 1 punto. Si no, no pasa nada. Toqué una piedra 🪨.", p: "¿Qué pasa?", a: "No pasa nada", d: ["Gano 1 punto", "Gano 10 puntos"] },
];

const THINGS: { label: string; color: string; kind: string }[] = [
  { label: "🍒 cereza", color: "rojo", kind: "fruta" }, { label: "🍏 manzana verde", color: "verde", kind: "fruta" },
  { label: "🥝 kiwi", color: "verde", kind: "fruta" }, { label: "🍐 pera", color: "verde", kind: "fruta" },
  { label: "🍍 piña", color: "amarillo", kind: "fruta" }, { label: "🦀 cangrejo", color: "rojo", kind: "animal" },
  { label: "🐊 cocodrilo", color: "verde", kind: "animal" }, { label: "🦜 loro verde", color: "verde", kind: "animal" },
  { label: "🐥 patito", color: "amarillo", kind: "animal" }, { label: "🐠 pez rojo", color: "rojo", kind: "animal" },
  { label: "🐝 abeja", color: "amarillo", kind: "animal" },
  { label: "🍎 manzana", color: "rojo", kind: "fruta" }, { label: "🍓 fresa", color: "rojo", kind: "fruta" },
  { label: "🍌 plátano", color: "amarillo", kind: "fruta" }, { label: "🍋 limón", color: "amarillo", kind: "fruta" },
  { label: "🚗 carro rojo", color: "rojo", kind: "juguete" }, { label: "🎈 globo rojo", color: "rojo", kind: "juguete" },
  { label: "🐤 pollito", color: "amarillo", kind: "animal" }, { label: "🐞 mariquita", color: "rojo", kind: "animal" },
  { label: "🥒 pepino", color: "verde", kind: "verdura" }, { label: "🐸 rana", color: "verde", kind: "animal" },
];

function twoRules(r: Rng): Question {
  for (;;) {
    const color = r.pick(["rojo", "amarillo", "verde"]);
    const kind = r.pick(["fruta", "animal"]);
    const all = THINGS.filter((t) => t.color === color && t.kind === kind);
    if (all.length === 0) continue;
    // Solo algunos de los que cumplen: así cada partida es distinta.
    const yes = r.shuffle(all).slice(0, r.int(1, Math.min(3, all.length)));
    const no = THINGS.filter((t) => !(t.color === color && t.kind === kind));
    const others = r.shuffle(no).slice(0, 6 - yes.length);
    const article = kind === "fruta" ? "una fruta" : "un animal";
    return {
      kind: "multi",
      prompt: `Regla: selecciona lo que es ${article} Y es de color ${color}.`,
      options: r.shuffle([...yes, ...others].map((t) => t.label)),
      answers: yes.map((t) => t.label),
      explanation: `Cumplen las dos condiciones: ${yes.map((t) => t.label).join(", ")}.`,
    };
  }
}

const TRUE_FALSE: ChoiceItem[] = (
  [
    ["🍎 🍎 🍎 🍌", "Hay más manzanas que plátanos.", true], ["🍎 🍌 🍌 🍌", "Hay más manzanas que plátanos.", false],
    ["🔴 🔵 🔴 🔴", "Todas las fichas son rojas.", false], ["🔵 🔵 🔵", "Todas las fichas son azules.", true],
    ["🐶 🐱 🐶", "Hay un gato.", true], ["🐶 🐶 🐶", "Hay un gato.", false],
    ["⭐ ⭐ 🌙", "Hay estrellas y lunas.", true], ["⭐ ⭐ ⭐", "Hay estrellas y lunas.", false],
  ] as const
).map(([pic, t, ok]) => ({ pic, t, p: "Mira el dibujo. ¿La frase es verdadera o falsa?", a: ok ? "Verdadera ✅" : "Falsa ❌", d: [ok ? "Falsa ❌" : "Verdadera ✅"] }));

// ---------------------------------------------------------------------------
// K-M. Internet, ciudadanía digital y tecnología
// ---------------------------------------------------------------------------

const BROWSER: ChoiceItem[] = [
  { p: "¿Qué programa uso para entrar a páginas de internet?", a: "El navegador 🌐", d: ["Paint 🎨", "La calculadora 🧮", "La papelera 🗑️"] },
  { p: "¿Cómo se llama lo que escribo arriba para ir a una página, como www.ejemplo.com?", a: "La dirección web", d: ["La contraseña", "El fondo de pantalla", "El nombre del archivo"] },
  { p: "¿Qué hace el botón ⬅️ del navegador?", a: "Vuelve a la página anterior", d: ["Apaga todo", "Borra el historial de internet", "Imprime la página que estoy viendo"] },
  { p: "¿Qué hace el botón 🔄 del navegador?", a: "Vuelve a cargar la página", d: ["Cierra todo", "Cambia el idioma de la página", "Guarda la página como archivo"] },
];

const KEYWORDS: ChoiceItem[] = [
  { p: "Quiero saber qué come el oso panda. ¿Qué escribo en el buscador?", a: "qué come el oso panda", d: ["hola, ¿cómo estás, buscador?", "animales del mundo entero", "osos osos osos osos"] },
  { p: "Quiero ver fotos de la Torre Eiffel. ¿Qué escribo?", a: "fotos Torre Eiffel", d: ["torre", "fotos lindas", "París Francia Europa mundo"] },
  { p: "Quiero saber cuánto mide una jirafa. ¿Qué escribo?", a: "cuánto mide una jirafa", d: ["jirafa bonita amarilla", "animal alto con manchas", "mide mide mide"] },
  { p: "¿Qué son las palabras clave en una búsqueda?", a: "Las palabras más importantes", d: ["Las contraseñas de mi correo", "Las palabras más largas del texto", "Palabras secretas de los espías"] },
];

const RELIABLE: ChoiceItem[] = [
  { p: "¿Dónde es más confiable buscar información para una tarea?", a: "En una página educativa", d: ["En el comentario de un desconocido", "En un mensaje en cadena", "En una publicidad del juego"] },
  { p: "Una página dice «¡Los peces vuelan por el cielo!». ¿Qué hago?", a: "Lo compruebo en otra fuente", d: ["Lo creo porque está en internet", "Lo comparto con toda la clase", "Lo copio tal cual en mi tarea"] },
  { p: "¿Todo lo que está en internet es verdad?", a: "No, hay que comprobarlo", d: ["Sí, siempre es verdad", "Solo si tiene muchas fotos", "Solo si el texto es muy largo"] },
  { p: "¿Qué señal hace dudar de una página?", a: "Tiene muchos errores y anuncios", d: ["Tiene el nombre de su autor", "Cita libros y otras fuentes", "Es de un museo o universidad"] },
];

function strongPassword(r: Rng): Question {
  const animals = ["Gato", "Perro", "Luna", "Sol", "Llama", "Rana", "Oso"];
  const marks = ["!", "#", "*", "$"];
  const strong = `${r.pick(animals)}${r.pick(marks)}${r.pick(animals)}${r.int(10, 99)}`;
  // Débiles de todos los largos: que la segura no sea siempre la más larga.
  const weak = ["1234", "contraseña123", "123456789012", "aaaaaaaaaaaa", "minombreesana", "qwertyuiop", "ana2015"];
  return {
    kind: "choice",
    prompt: "¿Cuál es la contraseña más segura?",
    options: uniqueOptions(r, strong, weak),
    answer: strong,
    explanation: `«${strong}» es larga y mezcla mayúsculas, minúsculas, números y símbolos.`,
  };
}

const PHISHING: ChoiceItem[] = [
  { t: "«¡Ganaste una tablet! Escribe tu dirección y la contraseña de tus papás.»", p: "¿Qué hago con este mensaje?", a: "No respondo y se lo muestro a un adulto", d: ["Escribo los datos rápido antes de que acabe", "Se lo reenvío a todos mis amigos", "Le respondo con mi dirección completa"] },
  { t: "«Tu juego se va a borrar. Haz clic aquí para salvarlo.»", p: "¿Qué hago?", a: "No hago clic y le pregunto a un adulto", d: ["Hago clic enseguida para salvar mi juego", "Escribo mi contraseña donde me piden", "Lo comparto para avisar a los demás"] },
  { t: "Un desconocido dice que es de mi colegio y me pide mi contraseña.", p: "¿Qué hago?", a: "No se la doy y le cuento a un adulto", d: ["Se la doy porque dice que es del colegio", "Le doy solo la mitad de mi contraseña", "Le doy la contraseña de mi mamá"] },
  { t: "Un mensaje dice que mi mamá está en problemas y que envíe un código.", p: "¿Qué hago?", a: "Llamo a mi mamá o aviso a un adulto", d: ["Envío el código rápido para ayudarla", "Respondo con todos los datos de mi casa", "Le mando el código a un amigo"] },
];

const FOOTPRINT: ChoiceItem[] = [
  { p: "Lo que publico en internet...", a: "Puede quedarse aunque lo borre", d: ["Desaparece al día siguiente", "Solo lo pueden ver mis papás", "Se borra al apagar la computadora"] },
  { p: "Antes de publicar una foto, ¿qué debo hacer?", a: "Pedir permiso a quienes salen en ella", d: ["Publicarla rápido para que la vean", "Agregar mi dirección para que sepan dónde es", "Mandarla primero a personas desconocidas"] },
  { p: "¿Qué es la huella digital?", a: "Lo que dejo en internet al usarlo", d: ["La marca de mi dedo en la pantalla", "Un dibujo de un pie en la computadora", "La contraseña de mi correo"] },
  { p: "¿Qué foto es mejor no publicar?", a: "Una con el nombre de mi colegio", d: ["Un dibujo de un dinosaurio", "Una foto de un paisaje sin personas", "Una foto de una flor del parque"] },
];

const BULLYING: ChoiceItem[] = [
  { p: "Alguien me escribe mensajes feos todos los días. ¿Qué hago?", a: "Guardo los mensajes y le cuento a un adulto", d: ["Le respondo con insultos todavía peores", "No le digo a nadie y borro los mensajes", "Le escribo mensajes feos a otra persona"] },
  { p: "Veo que se burlan de un compañero en un grupo. ¿Qué hago?", a: "No me sumo y aviso a un adulto", d: ["Me río también para no quedar mal", "Comparto el mensaje en otro grupo", "Agrego más burlas y emojis"] },
  { p: "¿Qué es el ciberacoso?", a: "Molestar a alguien una y otra vez por internet", d: ["Jugar en línea con amigos del colegio", "Buscar información para una tarea escolar", "Enviar un dibujo bonito a mi abuela por correo"] },
  { p: "Un amigo me cuenta que lo molestan en línea. ¿Qué hago?", a: "Lo escucho y lo ayudo a contarle a un adulto", d: ["Le digo que no es importante y que lo olvide", "Me uno a quienes lo molestan", "Le digo que borre su cuenta y se calle"] },
];

const AUTHORSHIP: ChoiceItem[] = [
  { p: "Uso un dibujo que hizo otra persona en mi trabajo. ¿Qué debo hacer?", a: "Decir quién lo hizo", d: ["Decir que lo hice yo", "Borrarle la firma del autor", "Cambiarle el color y decir que es mío"] },
  { p: "Copiar un texto de internet y decir que yo lo escribí...", a: "No está bien", d: ["Está bien siempre", "Está bien si nadie se entera", "Es igual que escribirlo yo"] },
  { p: "Una amiga hizo un video y yo quiero usarlo en mi trabajo. ¿Qué hago?", a: "Le pido permiso y digo que es suyo", d: ["Lo uso sin decirle nada a ella", "Lo publico como si fuera mío", "Le cambio el título y lo uso"] },
  { p: "¿Qué es el plagio?", a: "Copiar el trabajo de otro como propio", d: ["Escribir un cuento con mis palabras", "Citar la página de donde saqué datos", "Pedir ayuda a la maestra para estudiar"] },
];

const ROBOTS: ChoiceItem[] = [
  { p: "¿Qué es un robot?", a: "Una máquina que sigue instrucciones", d: ["Un animal de metal que vive solo", "Un juguete que piensa como una persona", "Una planta que funciona con electricidad"] },
  { p: "¿Cuál de estos es un robot que ayuda en casa?", a: "🤖 Una aspiradora robot", d: ["🧹 Una escoba de madera", "🪑 Una silla de plástico", "🍳 Una sartén para cocinar"] },
  { p: "¿Quién le da las instrucciones a un robot?", a: "Las personas que lo programan", d: ["El robot se las inventa solo", "Los animales de la casa", "El viento y la lluvia del día"] },
  { p: "¿Dónde trabajan muchos robots?", a: "En fábricas, armando autos", d: ["En el mar, nadando con peces", "En los árboles, haciendo nidos", "En las nubes, haciendo lluvia"] },
];

const AI: ChoiceItem[] = [
  { p: "Le pido a un asistente de voz: «¿Qué tiempo hará mañana?». ¿Qué hace?", a: "Busca el pronóstico y responde", d: ["Cambia el clima para que haga sol", "Se apaga y no vuelve a prender", "Llama por teléfono a mis amigos"] },
  { p: "La inteligencia artificial puede equivocarse. ¿Qué hago?", a: "Reviso la respuesta con un adulto", d: ["Le creo todo sin pensar ni revisar", "Nunca reviso lo que responde", "Le doy mi contraseña para que mejore"] },
  { p: "¿Cuál usa inteligencia artificial?", a: "Una app que reconoce plantas", d: ["Un lápiz de colores con borrador", "Una pelota de fútbol con luces", "Un libro de papel con dibujos"] },
  { p: "¿Qué necesita una IA para aprender?", a: "Muchos ejemplos (datos)", d: ["Dormir y comer bien", "Un lápiz y un cuaderno", "Que la guardemos en un cajón"] },
];

// ---------------------------------------------------------------------------

type Row = [id: string, title: string, generate: Skill["generate"]];

const ROWS: Row[] = [
  ["A.1", "¿Entrada, salida o almacenamiento?", (r) => quiz(r, "", DEVICE_ROLE)],
  ["A.2", "Dispositivos de almacenamiento", (r) => pickAll(r, "Selecciona los dispositivos donde se GUARDA información.", STORAGE, NOT_STORAGE)],
  ["A.3", "Escritorio, laptop, tablet o celular", (r) => quiz(r, "¿Qué tipo de computadora es?", WHICH_COMPUTER)],
  ["A.4", "Puertos y conexiones", (r) => quiz(r, "", PORTS)],

  ["B.1", "Las partes del escritorio", (r) => quiz(r, "¿Cómo se llama esta parte del escritorio?", DESKTOP)],
  ["B.2", "Trabajar con varias ventanas", (r) => quiz(r, "", WINDOWS)],
  ["B.3", "Atajos de teclado", shortcut],
  ["B.4", "Copiar, cortar y pegar", (r) => quiz(r, "", COPY_PASTE)],

  ["C.1", "La fila guía", K.homeRow],
  ["C.2", "¿Qué dedo usa cada tecla?", K.fingerForKey],
  ["C.3", "Escribir palabras largas", K.typeLongWord],
  ["C.4", "Escribir palabras con tilde", K.typeAccent],
  ["C.5", "Escribir preguntas y exclamaciones", K.typePunctuation],
  ["C.6", "Escribir oraciones completas", K.typeLongSentence],

  ["D.1", "Tipos de archivo", (r) => quiz(r, "¿Qué tipo de archivo es?", FILE_TYPES)],
  ["D.2", "Ponerles buenos nombres a los archivos", (r) => quiz(r, "", FILE_NAMES)],
  ["D.3", "Crear carpetas y guardar archivos", (r) => orderQuiz(r, "Ordena los pasos.", NEW_FOLDER)],
  ["D.4", "La papelera: borrar y restaurar", (r) => quiz(r, "", TRASH)],

  ["E.1", "Los botones de formato: negrita, cursiva y subrayado", (r) => quiz(r, "", FORMAT_BUTTONS)],
  ["E.2", "¿Qué formato uso?", (r) => quiz(r, "", HOW_IT_LOOKS)],
  ["E.3", "Alinear el texto", (r) => quiz(r, "", ALIGN)],
  ["E.4", "Ordenar los pasos para escribir un documento", (r) => orderQuiz(r, "Ordena los pasos.", WRITE_DOC)],

  ["F.1", "Herramientas de formas y líneas", (r) => quiz(r, "¿Qué herramienta uso?", DRAW_TOOLS)],
  ["F.2", "Copiar, mover y acercar partes del dibujo", (r) => quiz(r, "", DRAW_EDIT)],

  ["G.1", "Programar al robot: caminos largos", (r) => R.writeProgram(r, 4, 7)],
  ["G.2", "Elegir el programa más corto", R.shortestProgram],
  ["G.3", "Programas con bucles combinados", R.chooseLoopProgram],
  ["G.4", "¿A dónde llega el robot con bucles?", R.loopDestination],
  ["G.5", "Corregir el programa del robot", (r) => R.debugRobot(r, 4, 7)],

  ["H.1", "Eventos: ¿qué hace que el programa empiece?", (r) => quiz(r, "", EVENTS)],
  ["H.2", "Ordenar los bloques de un programa", (r) => orderQuiz(r, "Ordena los bloques del programa.", BLOCKS_ORDER)],
  ["H.3", "¿Qué hace el programa de bloques?", (r) => quiz(r, "", PROGRAM_RESULT)],

  ["I.1", "Si... si no", (r) => quiz(r, "", IF_ELSE)],
  ["I.2", "Clasificar con dos reglas", twoRules],
  ["I.3", "¿Verdadero o falso?", (r) => quiz(r, "", TRUE_FALSE)],

  ["J.1", "Leer un pictograma", D.readPictograph],
  ["J.2", "Comparar datos en un pictograma", D.comparePictograph],
  ["J.3", "Descifrar un mensaje secreto", D.decodeMessage],
  ["J.4", "Escribir en código secreto", D.encodeMessage],

  ["K.1", "El navegador y las direcciones web", (r) => quiz(r, "", BROWSER)],
  ["K.2", "Buscar con palabras clave", (r) => quiz(r, "", KEYWORDS)],
  ["K.3", "¿Es confiable la información?", (r) => quiz(r, "", RELIABLE)],

  ["L.1", "Elegir una contraseña segura", strongPassword],
  ["L.2", "Mensajes engañosos", (r) => quiz(r, "", PHISHING)],
  ["L.3", "Mi huella digital", (r) => quiz(r, "", FOOTPRINT)],
  ["L.4", "Qué hacer ante el ciberacoso", (r) => quiz(r, "", BULLYING)],
  ["L.5", "Respetar el trabajo de otros", (r) => quiz(r, "", AUTHORSHIP)],

  ["M.1", "¿Qué es un robot?", (r) => quiz(r, "", ROBOTS)],
  ["M.2", "La inteligencia artificial en la vida diaria", (r) => quiz(r, "", AI)],
];

const SKILLS: Skill[] = ROWS.map(([id, title, generate]) => {
  const section = id.split(".")[0];
  return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
});

export const COMPUTACION_P2: Curriculum = { sections: SECTIONS, skills: SKILLS };
