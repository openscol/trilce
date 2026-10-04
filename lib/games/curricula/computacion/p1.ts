import * as K from "../../generators/compu/keyboard";
import * as R from "../../generators/compu/robot";
import { completePattern } from "../../generators/patterns";
import { uniqueOptions } from "../../generators/common";
import { quiz, orderQuiz, pickAll, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import { WORDS } from "../../generators/lengua/words";
import type { Rng } from "../../rng";
import type { Curriculum, Question, Section, Skill } from "../../types";

// Computación · 1.° de Primaria. Sin lista oficial de IXL: temas habituales de
// computación en primer grado (partes y cuidado del equipo, mouse, teclado,
// íconos, dibujo), pensamiento computacional estilo Code.org (algoritmos,
// robot con flechas, bucles, condicionales, depuración) y ciudadanía digital.

const SECTIONS: Section[] = [
  { id: "A", name: "La computadora y sus partes", icon: "🖥️" },
  { id: "B", name: "Encender, apagar y cuidar la computadora", icon: "🔌" },
  { id: "C", name: "El mouse", icon: "🖱️" },
  { id: "D", name: "El teclado", icon: "⌨️" },
  { id: "E", name: "Íconos, ventanas y archivos", icon: "🪟" },
  { id: "F", name: "Dibujar en la computadora", icon: "🎨" },
  { id: "G", name: "Secuencias y algoritmos", icon: "🧩" },
  { id: "H", name: "Patrones y bucles", icon: "🔁" },
  { id: "I", name: "Condicionales: si... entonces", icon: "🔀" },
  { id: "J", name: "Encontrar y corregir errores", icon: "🐞" },
  { id: "K", name: "Internet seguro", icon: "🛡️" },
  { id: "L", name: "La tecnología a mi alrededor", icon: "📱" },
];

// Ítems "dibujo → nombre" donde los distractores son los otros nombres.
function namePictures(list: [string, string][], prompt?: string): ChoiceItem[] {
  return list.map(([pic, a]) => ({ pic, a, p: prompt, d: list.map(([, n]) => n).filter((n) => n !== a) }));
}

// Ítems "situación → respuesta" con distractores tomados de las demás respuestas.
function situations(list: [string, string][], prompt?: string): ChoiceItem[] {
  const answers = [...new Set(list.map(([, a]) => a))];
  return list.map(([t, a]) => ({ t, a, p: prompt, d: answers.filter((x) => x !== a) }));
}

// ---------------------------------------------------------------------------
// A. Partes de la computadora
// ---------------------------------------------------------------------------

const DEVICES: [string, string][] = [
  ["🖥️", "Computadora de escritorio"], ["💻", "Laptop"], ["📱", "Celular"], ["🖨️", "Impresora"], ["📷", "Cámara"],
  ["🎧", "Audífonos"], ["⌨️", "Teclado"], ["🖱️", "Mouse"], ["📺", "Televisor"], ["🔊", "Parlante"],
];

const PARTS: [string, string][] = [
  ["🖥️", "Monitor (pantalla)"], ["⌨️", "Teclado"], ["🖱️", "Mouse"], ["🗄️", "CPU (torre)"], ["🔊", "Parlantes"],
];

const PART_USE = situations([
  ["Muestra las imágenes y lo que escribo.", "🖥️ Monitor"],
  ["Sirve para escribir letras y números.", "⌨️ Teclado"],
  ["Mueve la flecha en la pantalla y sirve para hacer clic.", "🖱️ Mouse"],
  ["Es el «cerebro» de la computadora: guarda y procesa la información.", "🗄️ CPU"],
  ["Deja escuchar música y sonidos.", "🔊 Parlantes"],
  ["Saca en papel lo que hay en la pantalla.", "🖨️ Impresora"],
  ["Toma fotos y graba videos.", "📷 Cámara"],
  ["Sirve para grabar mi voz.", "🎤 Micrófono"],
], "¿Qué parte es?");

const INPUT = ["⌨️ Teclado", "🖱️ Mouse", "🎤 Micrófono", "📷 Cámara"];
const OUTPUT = ["🖥️ Monitor", "🔊 Parlantes", "🖨️ Impresora", "🎧 Audífonos"];

function inputOutput(r: Rng): Question {
  return r.chance(0.5)
    ? pickAll(r, "Selecciona los dispositivos de ENTRADA (con ellos le damos información a la computadora).", INPUT, OUTPUT, "entrada")
    : pickAll(r, "Selecciona los dispositivos de SALIDA (con ellos la computadora nos muestra o hace sonar algo).", OUTPUT, INPUT, "salida");
}

const NOT_TECH = [
  "🍎 Manzana", "🧸 Oso de peluche", "🪨 Piedra", "🌳 Árbol", "⚽ Pelota", "📚 Libros", "✏️ Lápiz", "🖍️ Crayón",
  "🪁 Cometa", "🥄 Cuchara", "🧦 Medias", "🎒 Mochila", "🪑 Silla", "🌻 Girasol", "🐶 Perro", "🧩 Rompecabezas",
];

function notTech(r: Rng): Question {
  const three = r.shuffle(DEVICES).slice(0, 3).map(([e, n]) => `${e} ${n}`);
  const odd = r.pick(NOT_TECH);
  return {
    kind: "choice",
    prompt: "¿Cuál NO es un aparato tecnológico?",
    options: r.shuffle([...three, odd]),
    answer: odd,
    explanation: `${odd} no funciona con electricidad ni es un aparato tecnológico.`,
  };
}

// ---------------------------------------------------------------------------
// B. Encender, apagar y cuidar
// ---------------------------------------------------------------------------

const TURN_ON: OrderItem[] = [
  { seq: ["🔌 Conectar el cargador", "🔘 Prender la laptop", "🔑 Escribir la contraseña", "🎨 Abrir Paint"] },
  { seq: ["🪑 Sentarme bien", "🔘 Encender la computadora", "⏳ Esperar el escritorio"] },
  { seq: ["🔘 Encender el monitor", "🔘 Encender la CPU", "🖱️ Mover el mouse"] },
  { seq: ["🔌 Revisar que esté conectada", "🔘 Presionar el botón de encendido", "⏳ Esperar a que cargue", "🖱️ Empezar a usarla"] },
  { seq: ["🔘 Encender la computadora", "🔑 Escribir mi usuario y contraseña", "🖱️ Abrir el programa"] },
];
const TURN_OFF: OrderItem[] = [
  { seq: ["💾 Guardar la tarea", "✖️ Cerrar el programa", "⏻ Apagar la laptop", "📁 Cerrar la tapa"] },
  { seq: ["✖️ Cerrar el juego", "⏻ Apagar la tablet", "🔌 Ponerla a cargar"] },
  { seq: ["💾 Guardar el cuento", "🖨️ Imprimirlo", "⏻ Apagar la computadora"] },
  { seq: ["💾 Guardar mi trabajo", "✖️ Cerrar los programas", "⏻ Elegir «Apagar» en el menú", "⏳ Esperar a que se apague la pantalla"] },
  { seq: ["💾 Guardar el dibujo", "✖️ Cerrar Paint", "⏻ Apagar la computadora"] },
];

const GOOD = "Bien 👍";
const BAD = "Mal 👎";
const CARE: ChoiceItem[] = (
  [
    ["Como galletas encima del teclado.", BAD], ["Me lavo las manos antes de usar la computadora.", GOOD],
    ["Pongo mi vaso de jugo junto a la laptop.", BAD], ["Uso el mouse con cuidado.", GOOD],
    ["Golpeo la pantalla con el dedo.", BAD], ["Apago la computadora cuando termino.", GOOD],
    ["Jalo los cables para desconectar.", BAD], ["Cierro la laptop con suavidad.", GOOD],
  ] as const
).map(([t, a]) => ({ t, a, d: [a === GOOD ? BAD : GOOD] }));

const POSTURE: ChoiceItem[] = [
  { p: "¿Cuál es la forma correcta de sentarse frente a la computadora?", a: "Espalda recta y pies en el suelo", d: ["Acostado en la silla, con los pies arriba", "Con la cara pegada a la pantalla", "De rodillas sobre la silla giratoria"] },
  { p: "¿A qué distancia debe estar la pantalla?", a: "A la distancia de mi brazo", d: ["Pegada a mi nariz", "En el suelo, debajo de la mesa", "Detrás de mí, muy lejos"] },
  { p: "¿Qué hago si me cansan los ojos?", a: "Descanso y miro lejos un rato", d: ["Me acerco más a la pantalla", "Subo el brillo al máximo posible", "Sigo sin parar hasta terminar"] },
  { p: "¿Cómo deben estar mis manos en el teclado?", a: "Relajadas, sobre las teclas", d: ["Golpeando las teclas muy fuerte", "Una encima de la otra", "Con los puños bien cerrados"] },
  { p: "¿Dónde deben estar mis pies?", a: "Apoyados en el piso", d: ["Encima de la mesa de la computadora", "Colgando sin tocar nada", "Sobre la CPU para calentarlos"] },
];

// ---------------------------------------------------------------------------
// C. Mouse
// ---------------------------------------------------------------------------

const MOUSE_PARTS: ChoiceItem[] = [
  { p: "¿Con qué botón del mouse hago clic normalmente?", pic: "🖱️", a: "El botón izquierdo", d: ["El botón derecho", "La rueda del centro", "El cable del mouse"] },
  { p: "¿Para qué sirve la rueda del mouse?", pic: "🖱️", a: "Para subir y bajar en la página", d: ["Para apagar la computadora", "Para escribir letras y números", "Para imprimir la página entera"] },
  { p: "¿Qué pasa al hacer clic con el botón derecho?", pic: "🖱️", a: "Se abre un menú con opciones", d: ["Se apaga la computadora", "Se borra todo el archivo", "Se cierra la ventana abierta"] },
  { p: "Cuando muevo el mouse sobre la mesa, ¿qué se mueve en la pantalla?", pic: "🖱️", a: "La flecha (puntero)", d: ["El teclado completo", "El fondo de pantalla", "La ventana entera"] },
  { p: "¿Qué hago para seleccionar un ícono?", pic: "🖱️", a: "Un clic sobre él", d: ["Lo arrastro a la papelera", "Doble clic con el botón derecho", "Giro la rueda dos veces"] },
];

const MOUSE_ACTIONS = situations([
  ["Quiero abrir un juego que está en el escritorio.", "Doble clic"],
  ["Quiero presionar el botón «Siguiente».", "Un clic"],
  ["Quiero mover una foto a una carpeta.", "Arrastrar y soltar"],
  ["Quiero ver más abajo en una página larga.", "Girar la rueda"],
  ["Quiero abrir una carpeta.", "Doble clic"],
  ["Quiero elegir un color en Paint.", "Un clic"],
  ["Quiero poner una pieza del rompecabezas en su lugar.", "Arrastrar y soltar"],
], "¿Qué hago con el mouse?");

const CLICKABLE = WORDS.filter((x) => x.syl.length <= 3);

function clickTarget(r: Rng): Question {
  const target = r.pick(CLICKABLE);
  const others = r.shuffle(CLICKABLE.filter((x) => x !== target)).slice(0, 5);
  return {
    kind: "choice",
    prompt: `Haz clic en: ${target.w}.`,
    options: r.shuffle([target, ...others].map((x) => x.e)),
    answer: target.e,
    explanation: `${target.w} es ${target.e}.`,
    speak: target.w,
  };
}

const GROUPS: Record<string, string[]> = {
  animales: ["🐶", "🐱", "🐮", "🐸", "🐟", "🦁", "🐰"],
  frutas: ["🍎", "🍌", "🍇", "🍐", "🍓", "🍍", "🍉"],
  "medios de transporte": ["🚗", "🚌", "🚂", "✈️", "⛵", "🚲", "🚚"],
};

function clickAll(r: Rng): Question {
  const g = r.pick(Object.keys(GROUPS));
  const others = Object.entries(GROUPS).filter(([k]) => k !== g).flatMap(([, v]) => v);
  return pickAll(r, `Haz clic en todos los ${g}.`, GROUPS[g], others, g);
}

// ---------------------------------------------------------------------------
// D. Teclado: teclas especiales
// ---------------------------------------------------------------------------

const SPECIAL: [key: string, does: string][] = [
  ["Espacio", "Deja un espacio entre palabras"],
  ["Enter", "Pasa a la línea de abajo o confirma"],
  ["Borrar", "Borra la letra que está antes del cursor"],
  ["Shift", "Escribe una mayúscula mientras la mantienes apretada"],
  ["Bloq Mayús", "Escribe todo en mayúsculas"],
];

// Tecla → qué hace (con el teclado marcado), o qué hace → qué tecla (banco).
const SPECIAL_ITEMS: ChoiceItem[] = [
  ...SPECIAL.map(([key, does]) => ({ p: `¿Qué hace la tecla ${key}?`, a: does, d: SPECIAL.map(([, d]) => d).filter((d) => d !== does) })),
  ...SPECIAL.map(([key, does]) => ({ p: `¿Qué tecla ${does.charAt(0).toLowerCase()}${does.slice(1)}?`, a: key, d: SPECIAL.map(([k]) => k).filter((k) => k !== key) })),
];

function specialKey(r: Rng): Question {
  if (r.chance(0.5)) return quiz(r, "", SPECIAL_ITEMS);
  const [key, does] = r.pick(SPECIAL);
  return {
    kind: "choice",
    prompt: `¿Qué hace la tecla marcada (${key})?`,
    visual: { kind: "keyboard", highlight: [key] },
    options: uniqueOptions(r, does, SPECIAL.map(([, d]) => d).filter((d) => d !== does)),
    answer: does,
    explanation: `${key}: ${does.toLowerCase()}.`,
    tag: key,
  };
}

const WHICH_KEY = situations([
  ["Terminé una línea y quiero bajar a la siguiente.", "Enter"],
  ["Me equivoqué en una letra y quiero borrarla.", "Borrar"],
  ["Quiero separar dos palabras.", "Espacio"],
  ["Quiero escribir la primera letra de mi nombre en mayúscula.", "Shift"],
  ["Quiero escribir un título TODO EN MAYÚSCULAS.", "Bloq Mayús"],
], "¿Qué tecla uso?");

// ---------------------------------------------------------------------------
// E. Íconos, ventanas y archivos
// ---------------------------------------------------------------------------

const ICONS = namePictures([
  ["🗑️", "Papelera: para borrar archivos"], ["📁", "Carpeta: para guardar archivos juntos"], ["🔍", "Buscar"],
  ["⚙️", "Configuración"], ["💾", "Guardar"], ["🖨️", "Imprimir"], ["🔊", "Volumen"], ["🏠", "Inicio"],
  ["🔒", "Bloquear"], ["✂️", "Cortar"], ["📋", "Pegar"], ["↩️", "Deshacer"],
], "¿Qué significa este ícono?");

const WINDOW_BUTTONS: ChoiceItem[] = [
  { t: "—", p: "¿Qué hace este botón de la ventana?", a: "Minimizar: esconde la ventana", d: ["Maximizar: agranda la ventana", "Cerrar la ventana"] },
  { t: "☐", p: "¿Qué hace este botón de la ventana?", a: "Maximizar: agranda la ventana", d: ["Minimizar: esconde la ventana", "Cerrar la ventana"] },
  { t: "✕", p: "¿Qué hace este botón de la ventana?", a: "Cerrar la ventana", d: ["Minimizar: esconde la ventana", "Maximizar: agranda la ventana"] },
  { p: "Quiero cerrar el programa. ¿Qué botón uso?", a: "✕", d: ["—", "☐"] },
  { p: "Quiero ver la ventana más grande. ¿Qué botón uso?", a: "☐", d: ["—", "✕"] },
];

const FILES: ChoiceItem[] = [
  { p: "¿Para qué sirve guardar un archivo?", a: "Para no perder mi trabajo", d: ["Para borrarlo", "Para apagar la computadora", "Para imprimirlo"] },
  { p: "Si apago la computadora sin guardar mi dibujo, ¿qué puede pasar?", a: "Puedo perder mi dibujo", d: ["El dibujo se imprime", "El dibujo se vuelve más bonito", "Nada, nunca se pierde"] },
  { p: "¿Dónde guardo mis archivos para encontrarlos fácilmente?", a: "En una carpeta con un nombre claro", d: ["En la papelera", "En cualquier lugar, sin nombre", "En el teclado"] },
  { p: "¿Qué ícono uso para guardar?", a: "💾", d: ["🗑️", "🔍", "✂️"] },
];

const FOLDER = situations([
  ["📄 foto del cumpleaños", "📁 Fotos"], ["📄 canción de cuna", "📁 Música"], ["📄 dibujo de mi casa", "📁 Dibujos"],
  ["📄 tarea de matemáticas", "📁 Tareas"], ["📄 foto de la playa", "📁 Fotos"], ["📄 canción del colegio", "📁 Música"],
  ["📄 dibujo de un dinosaurio", "📁 Dibujos"], ["📄 tarea de comunicación", "📁 Tareas"],
], "¿En qué carpeta guardo este archivo?");

// ---------------------------------------------------------------------------
// F. Dibujar
// ---------------------------------------------------------------------------

const TOOLS = namePictures([
  ["✏️", "Lápiz"], ["🖌️", "Pincel"], ["🪣", "Bote de pintura (rellenar)"], ["🧽", "Borrador"],
  ["🔤", "Texto"], ["⬜", "Formas"], ["🎨", "Colores"], ["🔍", "Lupa (acercar)"],
], "¿Cómo se llama esta herramienta de dibujo?");

const WHICH_TOOL = situations([
  ["Quiero pintar todo el interior de un círculo de un solo color.", "🪣 Bote de pintura"],
  ["Quiero borrar una línea que me salió mal.", "🧽 Borrador"],
  ["Quiero escribir mi nombre en el dibujo.", "🔤 Texto"],
  ["Quiero dibujar un cuadrado perfecto.", "⬜ Formas"],
  ["Quiero hacer un trazo delgado.", "✏️ Lápiz"],
  ["Quiero ver de cerca una parte pequeña del dibujo.", "🔍 Lupa"],
], "¿Qué herramienta uso?");

const UNDO: ChoiceItem[] = [
  { p: "Borré algo sin querer. ¿Qué botón me ayuda a recuperarlo?", a: "↩️ Deshacer", d: ["↪️ Rehacer", "🗑️ Papelera", "🖨️ Imprimir"] },
  { p: "¿Qué hace el botón ↪️ Rehacer?", a: "Vuelve a hacer lo que deshice", d: ["Borra todo el dibujo", "Apaga la computadora", "Guarda el archivo"] },
  { p: "¿Qué teclas usan muchos programas para deshacer?", a: "Ctrl + Z", d: ["Ctrl + P", "Espacio", "Enter"] },
];

// ---------------------------------------------------------------------------
// G-J. Pensamiento computacional
// ---------------------------------------------------------------------------

const ALGORITHMS: OrderItem[] = [
  { seq: ["Mojar las manos", "Poner jabón", "Frotar las manos", "Enjuagar y secar"] },
  { seq: ["Poner pasta en el cepillo", "Cepillar los dientes", "Enjuagar la boca"] },
  { seq: ["Abrir la puerta", "Entrar", "Cerrar la puerta"] },
  { seq: ["Cavar un hoyo", "Poner la semilla", "Tapar con tierra", "Regar"] },
  { seq: ["Ponerse las medias", "Ponerse los zapatos", "Amarrar los pasadores"] },
];

const MISSING_STEP: ChoiceItem[] = [
  { t: "1. Mojar las manos\n2. ?\n3. Frotar las manos\n4. Enjuagar", a: "Poner jabón", d: ["Secar las manos", "Comer", "Ponerse los zapatos"] },
  { t: "1. Poner pasta en el cepillo\n2. ?\n3. Enjuagar la boca", a: "Cepillar los dientes", d: ["Peinarse", "Ponerse la gorra", "Apagar la luz"] },
  { t: "1. Cavar un hoyo\n2. Poner la semilla\n3. ?\n4. Regar", a: "Tapar con tierra", d: ["Cortar la flor", "Pintar la maceta", "Comer la semilla"] },
  { t: "1. Encender la computadora\n2. ?\n3. Dibujar", a: "Abrir Paint", d: ["Apagar la computadora", "Imprimir", "Cerrar Paint"] },
  { t: "1. Abrir el refrigerador\n2. ?\n3. Cerrar el refrigerador", a: "Sacar la leche", d: ["Apagar la luz", "Lavar el carro", "Dormir"] },
];

const INTRUDER: ChoiceItem[] = [
  { t: "1. Mojar las manos\n2. Poner jabón\n3. Ponerse los zapatos\n4. Enjuagar", a: "Ponerse los zapatos", d: ["Mojar las manos", "Poner jabón", "Enjuagar"] },
  { t: "1. Poner pasta en el cepillo\n2. Saltar la cuerda\n3. Cepillar los dientes\n4. Enjuagar la boca", a: "Saltar la cuerda", d: ["Poner pasta en el cepillo", "Cepillar los dientes", "Enjuagar la boca"] },
  { t: "1. Encender la computadora\n2. Regar las plantas\n3. Abrir Paint\n4. Dibujar", a: "Regar las plantas", d: ["Encender la computadora", "Abrir Paint", "Dibujar"] },
  { t: "1. Cavar un hoyo\n2. Poner la semilla\n3. Comer helado\n4. Tapar con tierra", a: "Comer helado", d: ["Cavar un hoyo", "Poner la semilla", "Tapar con tierra"] },
];

const LOOP_EMOJIS = ["👏", "🦘", "➡️", "🥁", "⭐"];

function loopMeaning(r: Rng): Question {
  const e = r.pick(LOOP_EMOJIS);
  const n = r.int(2, 5);
  const rep = (k: number) => Array(k).fill(e).join(" ");
  return {
    kind: "choice",
    prompt: `¿Qué hace el bucle «Repetir ${n} veces ${e}»?`,
    options: uniqueOptions(r, rep(n), [rep(n - 1), rep(n + 1), rep(Math.max(1, n - 2))]),
    answer: rep(n),
    explanation: `Un bucle repite la misma instrucción: ${n} veces ${e}.`,
  };
}

function loopShorten(r: Rng): Question {
  const e = r.pick(LOOP_EMOJIS);
  const n = r.int(3, 6);
  const answer = `Repetir ${n} veces ${e}`;
  const other = r.pick(LOOP_EMOJIS.filter((x) => x !== e));
  return {
    kind: "choice",
    prompt: "¿Qué bucle hace lo mismo que este programa?",
    visual: { kind: "text", text: Array(n).fill(e).join(" ") },
    options: uniqueOptions(r, answer, [`Repetir ${n - 1} veces ${e}`, `Repetir ${n + 1} veces ${e}`, `Repetir ${n} veces ${other}`]),
    answer,
    explanation: `Hay ${n} veces ${e}: «${answer}».`,
  };
}

const IF_THEN: ChoiceItem[] = [
  { t: "Si llueve, llevo paraguas. Hoy está lloviendo. 🌧️", p: "¿Qué hago?", a: "Llevo paraguas ☂️", d: ["Llevo lentes de sol 🕶️", "Me pongo sandalias 🩴"] },
  { t: "Si el semáforo está en rojo, me detengo. El semáforo está en rojo. 🔴", p: "¿Qué hago?", a: "Me detengo", d: ["Cruzo la calle", "Corro"] },
  { t: "Si tengo hambre, como algo. Tengo hambre.", p: "¿Qué hago?", a: "Como algo 🍎", d: ["Me duermo", "Me baño"] },
  { t: "Si hace frío, me pongo chompa. Hoy hace calor. ☀️", p: "¿Qué hago?", a: "No me pongo chompa", d: ["Me pongo chompa", "Me pongo dos chompas"] },
  { t: "Si la luz está verde, el robot avanza. La luz está verde. 🟢", p: "¿Qué hace el robot?", a: "El robot avanza", d: ["El robot se detiene", "El robot retrocede"] },
  { t: "Si termino mi tarea, juego. Todavía no terminé mi tarea.", p: "¿Qué hago?", a: "Primero termino la tarea", d: ["Juego", "Me voy a dormir"] },
];

const RULES: [group: string, place: string, items: string[]][] = [
  ["fruta", "a la canasta 🧺", ["🍎 manzana", "🍌 plátano", "🍇 uva", "🍐 pera", "🍓 fresa", "🍍 piña"]],
  ["animal", "a la granja 🏡", ["🐶 perro", "🐱 gato", "🐮 vaca", "🐸 rana", "🐷 cerdo", "🐔 gallina"]],
  ["vehículo", "al garaje 🅿️", ["🚗 carro", "🚌 bus", "🚚 camión", "🚲 bicicleta", "🛵 moto", "🚜 tractor"]],
  ["ropa", "al armario 🚪", ["👕 camisa", "👗 vestido", "👞 zapato", "🧢 gorra", "🧤 guante", "👢 bota"]],
];

function followRule(r: Rng): Question {
  const [group, place, items] = r.pick(RULES);
  const others = RULES.filter(([g]) => g !== group).flatMap(([, , list]) => list);
  return pickAll(r, `Regla: si es ${group === "ropa" ? "ropa" : `un${group === "fruta" ? "a" : ""} ${group}`}, va ${place}. Selecciona lo que va ${place}.`, items, others, group);
}

// ---------------------------------------------------------------------------
// K-L. Ciudadanía digital y tecnología
// ---------------------------------------------------------------------------

const PRIVATE = ["Mi dirección", "Mi contraseña", "El nombre de mi colegio", "Mi número de teléfono", "Fotos de mi casa"];
const OK_TO_SHARE = ["Mi color favorito", "Mi animal favorito", "Un dibujo de un sol", "Mi comida favorita"];

const PASSWORDS: ChoiceItem[] = [
  { p: "¿A quién le puedes decir tu contraseña?", a: "A mi mamá o a mi papá", d: ["A un amigo del colegio", "A alguien que conocí en un juego", "A todos"] },
  { p: "¿Cuál es una contraseña más segura?", a: "Gato!Luna7", d: ["1234", "ana", "contraseña"] },
  { p: "Alguien en internet te pide tu contraseña. ¿Qué haces?", a: "No se la doy y le aviso a un adulto", d: ["Se la doy", "Le doy la mitad", "La publico"] },
];

const SCARY: ChoiceItem[] = [
  { t: "En un video aparece algo que me da miedo.", a: "Lo cierro y le cuento a un adulto", d: ["Lo sigo viendo solo hasta el final", "Se lo mando a todos mis amigos", "Lo veo de nuevo sin decirle a nadie"] },
  { t: "Un desconocido me escribe en un juego y quiere ser mi amigo.", a: "No respondo y aviso a un adulto", d: ["Le cuento dónde vivo y mi colegio", "Acepto y chateamos en secreto", "Le mando una foto para conocernos"] },
  { t: "Aparece un mensaje: «¡Ganaste un premio! Haz clic aquí».", a: "No hago clic y le pregunto a un adulto", d: ["Hago clic rápido antes de que se acabe", "Escribo mi nombre y mi dirección", "Lo comparto con todos mis compañeros"] },
  { t: "Alguien que no conozco me pide una foto mía.", a: "No la envío y le cuento a un adulto", d: ["Se la envío porque parece amable", "Le mando una foto de mi casa y mi calle", "La envío y no le digo nada a nadie"] },
  { t: "Un juego me pide la contraseña de mi mamá para comprar algo.", a: "No la escribo y le aviso a mi mamá", d: ["La busco en el celular de mi mamá", "La escribo porque el juego la necesita", "Pruebo varias hasta adivinarla"] },
];

const HABITS: ChoiceItem[] = [
  { p: "¿Qué es mejor antes de dormir?", a: "Apagar las pantallas y leer un cuento", d: ["Jugar en el celular hasta muy tarde", "Ver videos en la cama con la luz apagada", "Dormir con la tablet prendida al lado"] },
  { p: "Llevo mucho rato con la tablet. ¿Qué hago?", a: "Descanso y juego afuera", d: ["Sigo jugando todo el día", "Subo el volumen al máximo", "Me acerco más a la pantalla"] },
  { p: "¿Quién decide cuánto tiempo uso la computadora?", a: "Mis papás o mi maestra", d: ["Yo solo, cuando quiera", "Un desconocido del juego", "El juego que estoy jugando"] },
  { p: "¿Qué hago con la tablet mientras como?", a: "La dejo y como con mi familia", d: ["La pongo al lado del plato", "Juego mientras como rápido", "Veo videos con el volumen alto"] },
];

const KINDNESS: ChoiceItem[] = [
  { t: "Un amigo publica un dibujo.", p: "¿Qué comentario es amable?", a: "¡Qué bonito dibujo!", d: ["Está feo, no me gusta", "No sabes dibujar nada", "Jajaja, qué dibujo tan malo"] },
  { p: "Alguien se burla de otro niño en un chat. ¿Qué haces?", a: "No participo y aviso a un adulto", d: ["Me burlo yo también para encajar", "Comparto los mensajes con otros", "Me río y escribo más burlas"] },
  { p: "Antes de enviar un mensaje, me pregunto:", a: "¿Lo diría así en persona?", d: ["¿Cómo puedo hacerlo más feo?", "¿A quién puedo molestar hoy?", "¿Cuántas faltas le pongo?"] },
  { p: "Un compañero perdió en un juego en línea. ¿Qué le escribo?", a: "¡Buen intento, sigue practicando!", d: ["¡Eres el peor jugador de todos!", "Jajaja, perdiste otra vez", "Mejor ya no juegues nunca más"] },
];

const WHICH_DEVICE = situations([
  ["Quiero llamar a mi abuela.", "📱 Celular"], ["Quiero sacar mi dibujo en papel.", "🖨️ Impresora"],
  ["Quiero escuchar música sin molestar a nadie.", "🎧 Audífonos"], ["Quiero tomar una foto.", "📷 Cámara"],
  ["Quiero ver una película en familia.", "📺 Televisor"], ["Quiero escribir una carta en la computadora.", "⌨️ Teclado"],
], "¿Qué aparato uso?");

const THEN_NOW = situations([
  ["Antes: ✉️ cartas de papel. Ahora:", "📧 Correo electrónico"],
  ["Antes: 📞 teléfono con cable. Ahora:", "📱 Celular"],
  ["Antes: 📚 enciclopedias. Ahora:", "🌐 Buscar en internet"],
  ["Antes: 🗺️ mapa de papel. Ahora:", "📍 Mapa en el celular"],
  ["Antes: 📼 películas en casete. Ahora:", "📺 Películas por internet"],
], "¿Qué usamos ahora?");

const ELECTRIC = ["💻 Laptop", "📱 Celular", "📺 Televisor", "🔦 Linterna", "🖨️ Impresora", "💡 Foco"];
const NOT_ELECTRIC = ["📚 Libro", "✏️ Lápiz", "⚽ Pelota", "🪁 Cometa", "🧸 Peluche", "✂️ Tijera"];

// ---------------------------------------------------------------------------

type Row = [id: string, title: string, generate: Skill["generate"]];

const ROWS: Row[] = [
  ["A.1", "Reconocer aparatos tecnológicos", (r) => quiz(r, "¿Cómo se llama este aparato?", namePictures(DEVICES))],
  ["A.2", "Las partes de la computadora", (r) => quiz(r, "¿Qué parte de la computadora es?", namePictures(PARTS))],
  ["A.3", "¿Para qué sirve cada parte?", (r) => quiz(r, "¿Qué parte es?", PART_USE)],
  ["A.4", "Dispositivos de entrada y de salida", inputOutput],
  ["A.5", "¿Cuál no es un aparato tecnológico?", notTech],

  ["B.1", "Ordenar los pasos para encender la computadora", (r) => orderQuiz(r, "Ordena los pasos para encender la computadora.", TURN_ON)],
  ["B.2", "Ordenar los pasos para apagar la computadora", (r) => orderQuiz(r, "Ordena los pasos para apagar la computadora.", TURN_OFF)],
  ["B.3", "Cuidar la computadora: ¿bien o mal?", (r) => quiz(r, "¿Está bien o mal?", CARE)],
  ["B.4", "La postura correcta frente a la computadora", (r) => quiz(r, "", POSTURE)],

  ["C.1", "Las partes del mouse", (r) => quiz(r, "", MOUSE_PARTS)],
  ["C.2", "Clic, doble clic, arrastrar y rueda", (r) => quiz(r, "¿Qué hago con el mouse?", MOUSE_ACTIONS)],
  ["C.3", "Práctica: hacer clic en el dibujo", clickTarget],
  ["C.4", "Práctica: hacer clic en todos los del grupo", clickAll],

  ["D.1", "Encontrar letras en el teclado", K.findKey],
  ["D.2", "Las teclas especiales", specialKey],
  ["D.3", "¿Qué tecla uso?", (r) => quiz(r, "¿Qué tecla uso?", WHICH_KEY)],
  ["D.4", "Escribir letras", K.typeLetter],
  ["D.5", "Escribir palabras", K.typeWord],
  ["D.6", "Escribir nombres con mayúscula (Shift)", K.typeCapital],
  ["D.7", "Escribir números", K.typeNumber],
  ["D.8", "Escribir una oración", K.typeSentence],

  ["E.1", "¿Qué significa el ícono?", (r) => quiz(r, "¿Qué significa este ícono?", ICONS)],
  ["E.2", "Los botones de la ventana: minimizar, maximizar y cerrar", (r) => quiz(r, "", WINDOW_BUTTONS)],
  ["E.3", "Guardar y abrir archivos", (r) => quiz(r, "", FILES)],
  ["E.4", "Ordenar archivos en carpetas", (r) => quiz(r, "¿En qué carpeta guardo este archivo?", FOLDER)],

  ["F.1", "Las herramientas de dibujo", (r) => quiz(r, "¿Cómo se llama esta herramienta?", TOOLS)],
  ["F.2", "¿Qué herramienta de dibujo uso?", (r) => quiz(r, "¿Qué herramienta uso?", WHICH_TOOL)],
  ["F.3", "Deshacer y rehacer", (r) => quiz(r, "", UNDO)],

  ["G.1", "Ordenar los pasos de un algoritmo", (r) => orderQuiz(r, "Un algoritmo es una lista de pasos en orden. Ordena los pasos.", ALGORITHMS)],
  ["G.2", "¿Qué paso falta?", (r) => quiz(r, "¿Qué paso falta en el algoritmo?", MISSING_STEP)],
  ["G.3", "Seguir instrucciones: ¿a dónde llega el robot?", R.robotDestination],
  ["G.4", "Elegir el programa que lleva al robot a la estrella", R.chooseProgram],
  ["G.5", "Programar al robot con flechas", R.writeProgram],

  ["H.1", "Encontrar el patrón que se repite", completePattern],
  ["H.2", "¿Qué hace un bucle?", loopMeaning],
  ["H.3", "Acortar un programa con un bucle", loopShorten],
  ["H.4", "Programar al robot con un bucle", R.loopProgram],

  ["I.1", "Si... entonces en la vida diaria", (r) => quiz(r, "", IF_THEN)],
  ["I.2", "Seguir una regla para clasificar", followRule],

  ["J.1", "¿Qué paso no va en el algoritmo?", (r) => quiz(r, "¿Qué paso no va en este algoritmo?", INTRUDER)],
  ["J.2", "¿En qué paso se equivocó el robot?", R.debugRobot],

  ["K.1", "Información personal: ¿se comparte o no?", (r) => pickAll(r, "Selecciona lo que NO debes compartir con desconocidos en internet.", PRIVATE, OK_TO_SHARE)],
  ["K.2", "Contraseñas seguras", (r) => quiz(r, "", PASSWORDS)],
  ["K.3", "¿Qué hago si algo en internet me asusta?", (r) => quiz(r, "¿Qué hago?", SCARY)],
  ["K.4", "Buenos hábitos con las pantallas", (r) => quiz(r, "", HABITS)],
  ["K.5", "Ser amable en internet", (r) => quiz(r, "", KINDNESS)],

  ["L.1", "¿Qué aparato uso para...?", (r) => quiz(r, "¿Qué aparato uso?", WHICH_DEVICE)],
  ["L.2", "La tecnología antes y ahora", (r) => quiz(r, "¿Qué usamos ahora?", THEN_NOW)],
  ["L.3", "¿Funciona con electricidad o batería?", (r) => pickAll(r, "Selecciona los objetos que necesitan electricidad o batería para funcionar.", ELECTRIC, NOT_ELECTRIC)],
];

const SKILLS: Skill[] = ROWS.map(([id, title, generate]) => {
  const section = id.split(".")[0];
  return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
});

export const COMPUTACION_P1: Curriculum = { sections: SECTIONS, skills: SKILLS };
