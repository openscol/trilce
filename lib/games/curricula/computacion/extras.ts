import * as T from "../../generators/compu/topics";
import { completePattern, numberSequence } from "../../generators/patterns";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../generators/lengua/bank";
import type { Rng } from "../../rng";
import type { Curriculum, Question, Section } from "../../types";

// Apartados comunes a todos los grados de Computación: «Programación y
// software», «Scratch» e «Inteligencia artificial». Se agregan al final de
// cada grado con `withExtras`, que también fija la partida en 15 preguntas.

export const SESSION_LENGTH = 15;

type Extra = { name: string; icon: string; rows: [title: string, generate: (r: Rng) => Question][] };

// ---------------------------------------------------------------------------
// Bancos y hechos
// ---------------------------------------------------------------------------

const HW_SW: [string, string][] = [
  ["⌨️ El teclado", "Hardware"], ["🖱️ El mouse", "Hardware"], ["🖥️ El monitor", "Hardware"], ["🖨️ La impresora", "Hardware"],
  ["🔊 Los parlantes", "Hardware"], ["💾 La memoria USB", "Hardware"], ["🎮 Un juego de la tablet", "Software"], ["🎨 El programa Paint", "Software"],
  ["🌐 El navegador", "Software"], ["🧮 La app de calculadora", "Software"], ["🪟 Windows", "Software"], ["🎵 La app de música", "Software"],
];
const HW_SW_WORDS = {
  ask: "¿Es hardware (se puede tocar) o software (un programa)?",
  all: (c: string) => `Selecciona todo lo que es ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `${t} es ${c.toLowerCase()}.`,
};

const WHAT_IS_PROGRAM: ChoiceItem[] = [
  { p: "¿Qué es un programa?", a: "Instrucciones que sigue la computadora", d: ["Una pieza que se puede tocar", "Un cable que va al enchufe", "Un dibujo pegado en la pantalla"] },
  { p: "¿Quién escribe los programas?", a: "Personas llamadas programadores", d: ["La computadora se los inventa", "Los parlantes cuando suenan", "El mouse cuando se mueve"] },
  { p: "¿Qué pasa si una instrucción está en mal orden?", a: "El programa puede hacer algo mal", d: ["El programa funciona siempre igual", "La computadora se vuelve más rápida", "El monitor cambia de color solo"] },
  { p: "Un juego en la tablet es...", a: "Un programa (software)", d: ["Una pieza (hardware)", "Un cable de la tablet", "Un botón de la tablet"] },
  { p: "¿Qué hace la computadora con un programa?", a: "Sigue sus pasos en orden", d: ["Lo pinta de colores", "Lo guarda en un cajón", "Lo lanza a la papelera"] },
];

const DAILY_ORDER: OrderItem[] = [
  { seq: ["Tomar el vaso", "Echar el agua", "Beber el agua"] },
  { seq: ["Abrir la mochila", "Guardar el cuaderno", "Cerrar la mochila"] },
  { seq: ["Encender la tablet", "Abrir el juego", "Jugar un rato", "Apagar la tablet"] },
  { seq: ["Ponerse el pijama", "Lavarse los dientes", "Apagar la luz", "Dormir"] },
  { seq: ["Pelar el plátano", "Comer el plátano", "Botar la cáscara"] },
];

const APPS: [string, string][] = [
  ["🧮 Calculadora", "Hacer cuentas"], ["🎨 Paint", "Dibujar"], ["🌐 Navegador", "Ver páginas web"], ["🎵 Reproductor", "Escuchar música"],
  ["📷 Cámara", "Tomar fotos"], ["📝 Bloc de notas", "Escribir textos"], ["📧 Correo", "Enviar mensajes"], ["🗺️ Mapas", "Ver cómo llegar"],
];
const APPS_WORDS = {
  ask: "¿Para qué sirve este programa?",
  all: (c: string) => `Selecciona los programas que sirven para: ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `${t} sirve para: ${c.toLowerCase()}.`,
};

const SCRATCH_PARTS: ChoiceItem[] = [
  { p: "¿Qué hace la bandera verde 🏁?", a: "Empieza el programa", d: ["Borra el proyecto entero", "Guarda el archivo", "Cambia el idioma"] },
  { p: "¿Qué hace el botón rojo 🛑?", a: "Detiene el programa", d: ["Empieza el programa", "Agrega un gato nuevo", "Cambia el fondo"] },
  { p: "¿Cómo se llama el lugar donde se mueven los personajes?", a: "El escenario", d: ["La papelera", "El teclado", "El cuaderno de notas"] },
  { p: "¿Cómo se llaman los personajes de Scratch, como el gato?", a: "Objetos", d: ["Celdas", "Carpetas", "Ventanas"] },
  { p: "¿Cómo se arma un programa en Scratch?", a: "Juntando bloques", d: ["Pintando la pantalla", "Moviendo el monitor", "Escribiendo cartas"] },
  { p: "Este bloque está al inicio del programa. ¿Cuándo empieza?", code: "when flag clicked\nmove (10) steps", a: "Al hacer clic en la bandera", d: ["Al apagar la computadora", "Cuando el gato se cansa", "Nunca empieza"] },
];

const BLOCK_ACTIONS: [string, string][] = [
  ["move (10) steps", "El objeto avanza"], ["turn cw (15) degrees", "El objeto gira"], ["say [¡Hola!]", "Aparece un globo de texto"],
  ["play sound (Miau v) until done", "Se escucha un sonido"], ["next costume", "Cambia la apariencia del objeto"], ["wait (1) seconds", "Hace una pausa"],
  ["hide", "El objeto desaparece"], ["show", "El objeto aparece"],
];

const BLOCK_CATEGORY: [string, string][] = [
  ["move (10) steps", "Movimiento (azul)"], ["turn cw (15) degrees", "Movimiento (azul)"], ["go to x: (0) y: (0)", "Movimiento (azul)"],
  ["say [¡Hola!]", "Apariencia (morado)"], ["next costume", "Apariencia (morado)"], ["hide", "Apariencia (morado)"],
  ["play sound (Miau v) until done", "Sonido (rosado)"], ["stop all sounds", "Sonido (rosado)"],
  ["when flag clicked", "Eventos (amarillo)"], ["when [espacio v] key pressed", "Eventos (amarillo)"],
  ["repeat (10)\nend", "Control (naranja)"], ["wait (1) seconds", "Control (naranja)"],
];
const BLOCK_WORDS = {
  blocks: true,
  blockStatement: (c: string) => `Este bloque es de ${c}.`,
  ask: "¿A qué categoría pertenece este bloque?",
  all: (c: string) => `Selecciona los bloques de la categoría ${c}.`,
  statement: (t: string, c: string) => `El bloque «${t}» es de ${c}.`,
};

const IS_AI: [string, string][] = [
  ["🗣️ Un asistente que entiende lo que le dices", "Usa IA"], ["📷 Una cámara que reconoce caras", "Usa IA"], ["🌍 Un traductor automático", "Usa IA"],
  ["🎬 Una app que te recomienda videos", "Usa IA"], ["🚗 Un auto que se maneja solo", "Usa IA"], ["🌿 Una app que reconoce plantas", "Usa IA"],
  ["💡 Un foco que se prende con un interruptor", "No usa IA"], ["✏️ Un lápiz de colores", "No usa IA"], ["🔦 Una linterna", "No usa IA"],
  ["🧸 Un oso de peluche", "No usa IA"], ["⏰ Un reloj despertador simple", "No usa IA"], ["🚲 Una bicicleta", "No usa IA"],
];
const IS_AI_WORDS = {
  ask: "¿Usa inteligencia artificial?",
  all: (c: string) => (c === "Usa IA" ? "Selecciona lo que usa inteligencia artificial." : "Selecciona lo que NO usa inteligencia artificial."),
  statement: (t: string, c: string) => `${t}: ${c === "Usa IA" ? "usa" : "no usa"} inteligencia artificial.`,
};

const WHAT_IS_AI: ChoiceItem[] = [
  { p: "¿Qué es la inteligencia artificial (IA)?", a: "Máquinas que aprenden de ejemplos", d: ["Robots que sienten como personas", "Computadoras que nunca se apagan", "Cables que llevan la electricidad"] },
  { p: "¿Cómo aprende una IA?", a: "Mirando muchísimos ejemplos", d: ["Durmiendo toda la noche", "Comiendo frutas y verduras", "Jugando con otros robots"] },
  { p: "¿La IA siempre tiene la razón?", a: "No, a veces se equivoca", d: ["Sí, nunca se equivoca", "Solo los días de sol", "Sí, porque es una máquina"] },
  { p: "¿Quién crea la inteligencia artificial?", a: "Personas que la programan", d: ["Los animales del bosque", "La lluvia y el viento", "Se crea sola en la nube"] },
  { p: "¿Qué puede hacer una IA?", a: "Reconocer fotos y voces", d: ["Sentir hambre y sueño", "Crecer como una planta", "Tener amigos de verdad"] },
];

const AI_CARE: ChoiceItem[] = [
  { p: "Le pregunto algo a una IA para mi tarea. ¿Qué hago con la respuesta?", a: "La reviso con un adulto", d: ["La copio sin leerla", "La creo sin revisarla", "La comparto con todos"] },
  { p: "¿Qué no debo contarle a una app con IA?", a: "Mi dirección y mi contraseña", d: ["Mi animal favorito del zoo", "Una pregunta sobre planetas", "El nombre de una fruta dulce"] },
  { p: "Una IA hizo un dibujo para mí. ¿Lo hice yo?", a: "No, lo hizo la IA", d: ["Sí, lo hice yo solo", "Sí, porque lo pedí", "Lo hizo mi maestra"] },
  { p: "La IA me dice algo raro que no parece cierto. ¿Qué hago?", a: "Lo compruebo en un libro", d: ["Lo creo de inmediato", "Lo cuento como verdad", "Lo copio en mi tarea"] },
  { p: "¿Puede una IA ser mi amiga de verdad?", a: "No, es un programa", d: ["Sí, siente como yo", "Sí, me quiere mucho", "Sí, vive en mi casa"] },
];

const SOFTWARE_TYPES: [string, string][] = [
  ["🪟 Windows", "Sistema operativo"], ["🤖 Android", "Sistema operativo"], ["🍏 iOS", "Sistema operativo"],
  ["🎮 Minecraft", "Juego"], ["🧩 Un rompecabezas en línea", "Juego"], ["🏎️ Un juego de carreras", "Juego"],
  ["🌐 Chrome", "Navegador"], ["🦊 Firefox", "Navegador"], ["🧭 Safari", "Navegador"],
  ["🎨 Paint", "Para crear o editar"], ["📝 Un procesador de textos", "Para crear o editar"], ["🎬 Un editor de video", "Para crear o editar"],
];
const SOFTWARE_WORDS = {
  ask: "¿Qué tipo de software es?",
  all: (c: string) => `Selecciona los que son: ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `${t} es: ${c.toLowerCase()}.`,
};

const BUGS: ChoiceItem[] = [
  { p: "¿Qué es un error (bug) en un programa?", a: "Algo que hace que falle", d: ["Un insecto en el teclado", "Un dibujo muy bonito", "Un botón de encender"] },
  { p: "El robot debía ir a la derecha y fue a la izquierda. ¿Qué pasó?", a: "Hay un error en las instrucciones", d: ["El robot está muy cansado hoy", "La pantalla está muy sucia hoy", "El robot quería ir de paseo"] },
  { p: "Encontré un error en mi programa. ¿Qué hago?", a: "Lo busco y lo corrijo", d: ["Borro todo el proyecto", "Apago la computadora", "Lo dejo así para siempre"] },
  { p: "¿Cómo se llama buscar y corregir errores?", a: "Depurar", d: ["Dibujar", "Imprimir", "Navegar"] },
  { p: "¿Es malo equivocarse al programar?", a: "No, así se aprende", d: ["Sí, nunca hay que errar", "Sí, se rompe la computadora", "Sí, se borra internet"] },
];

const IO_KIDS: [string, string][] = [
  ["Escribir con el teclado", "Entrada"], ["Hacer clic con el mouse", "Entrada"], ["Hablarle al micrófono", "Entrada"], ["Tomar una foto con la cámara", "Entrada"],
  ["Ver un video en el monitor", "Salida"], ["Escuchar música en los parlantes", "Salida"], ["Imprimir un dibujo", "Salida"], ["Oír sonidos con audífonos", "Salida"],
];
const IO_WORDS = {
  ask: "¿Es entrada (le damos información a la computadora) o salida (la computadora nos muestra algo)?",
  all: (c: string) => `Selecciona las acciones de ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `«${t}» es ${c.toLowerCase()}.`,
};

const EVENT_BLOCKS: ChoiceItem[] = [
  { p: "¿Qué bloque hace que el programa empiece con la bandera verde?", a: "when flag clicked", d: ["move (10) steps", "next costume", "wait (1) seconds"], blocks: true },
  { p: "Quiero que el gato salte al presionar la barra espaciadora. ¿Qué bloque uso?", a: "when [espacio v] key pressed", d: ["when this sprite clicked", "play sound (Miau v) until done", "turn cw (15) degrees"], blocks: true },
  { p: "Quiero que el perro ladre cuando lo toquen con el mouse. ¿Qué bloque uso?", a: "when this sprite clicked", d: ["when [espacio v] key pressed", "when flag clicked", "say [¡Guau!]"], blocks: true },
  { p: "¿De qué color son los bloques de eventos?", a: "Amarillos", d: ["Azules", "Morados", "Rosados"] },
  { p: "¿Dónde va un bloque de evento?", code: "when flag clicked\nsay [¡Hola!]\nmove (10) steps", a: "Al inicio del programa", d: ["Al final del programa", "Dentro de otro bloque", "En la papelera"] },
];

const LOOKS_SOUND: [string, string][] = [
  ["say [¡Hola!] for (2) seconds", "Apariencia"], ["change size by (10)", "Apariencia"], ["next costume", "Apariencia"],
  ["change [color v] effect by (25)", "Apariencia"], ["hide", "Apariencia"],
  ["start sound (Miau v)", "Sonido"], ["set volume to (50) %", "Sonido"], ["stop all sounds", "Sonido"], ["play sound (Pop v) until done", "Sonido"],
];
const LOOKS_WORDS = {
  blocks: true,
  blockStatement: (c: string) => `Este bloque es de ${c}.`,
  ask: "¿Este bloque es de Apariencia o de Sonido?",
  all: (c: string) => `Selecciona los bloques de ${c}.`,
  statement: (t: string, c: string) => `«${t}» es un bloque de ${c}.`,
};

const AI_TASKS: [string, string][] = [
  ["Una app reconoce a tu perro en una foto", "Reconocer imágenes"], ["El celular se desbloquea al ver tu cara", "Reconocer imágenes"],
  ["Una cámara lee las placas de los autos", "Reconocer imágenes"], ["Le hablas al celular y escribe lo que dices", "Reconocer voz"],
  ["Un parlante obedece cuando dices «pon música»", "Reconocer voz"], ["Un subtitulador escribe lo que dicen en un video", "Reconocer voz"],
  ["Un traductor pasa un texto del inglés al castellano", "Entender texto"], ["Un corrector detecta faltas en tu redacción", "Entender texto"],
  ["Una app te sugiere la siguiente palabra al escribir", "Entender texto"], ["Una app te recomienda canciones parecidas", "Recomendar"],
  ["Una tienda en línea te sugiere productos", "Recomendar"], ["Una plataforma te propone videos similares", "Recomendar"],
];
const AI_TASK_WORDS = {
  ask: "¿Qué tipo de tarea hace la IA aquí?",
  all: (c: string) => `Selecciona los ejemplos de: ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `${t}: eso es ${c.toLowerCase()}.`,
};

const LANGUAGES: ChoiceItem[] = [
  { p: "¿Qué es un lenguaje de programación?", a: "Una forma de dar órdenes a la computadora", d: ["Un idioma que hablan los robots en casa", "Un tipo de teclado con muchas teclas", "Un juego para aprender inglés rápido"] },
  { p: "¿Cuál es un lenguaje de programación?", a: "Python", d: ["Paint", "Wi-Fi", "Excel"] },
  { p: "Scratch usa bloques. Python usa...", a: "Texto escrito", d: ["Solo dibujos", "Solo sonidos", "Solo colores"] },
  { p: "¿Por qué hay varios lenguajes de programación?", a: "Cada uno sirve mejor para algo", d: ["Porque los inventó un solo país", "Porque las computadoras se aburren", "Porque así se gasta menos luz"] },
  { p: "¿Qué lenguaje se usa mucho para hacer páginas web?", a: "JavaScript", d: ["Excel", "Scratch Jr", "Paint 3D"] },
];

const IPO: [string, string][] = [
  ["Escribir dos números en la calculadora", "Entrada"], ["Hablarle al asistente de voz", "Entrada"], ["Hacer clic en el botón «jugar»", "Entrada"],
  ["La calculadora suma los números", "Proceso"], ["El juego calcula tu puntaje", "Proceso"], ["La app ordena las fotos por fecha", "Proceso"],
  ["Mostrar el resultado en la pantalla", "Salida"], ["Sonar una alarma", "Salida"], ["Imprimir el certificado", "Salida"],
];
const IPO_WORDS = {
  ask: "¿Es entrada, proceso o salida?",
  all: (c: string) => `Selecciona los pasos de ${c.toLowerCase()}.`,
  statement: (t: string, c: string) => `«${t}» es ${c.toLowerCase()}.`,
};

const DATA_TYPES: [string, string][] = [
  ["25", "Número"], ["3.5", "Número"], ["0", "Número"], ["1000", "Número"],
  ["\"hola\"", "Texto"], ["\"Ana Rojas\"", "Texto"], ["\"25\"", "Texto"], ["\"¡ganaste!\"", "Texto"],
  ["verdadero", "Verdadero/Falso"], ["falso", "Verdadero/Falso"], ["5 > 3", "Verdadero/Falso"], ["2 == 7", "Verdadero/Falso"],
];
const DATA_WORDS = {
  ask: "¿Qué tipo de dato es? (lo que va entre comillas es texto)",
  all: (c: string) => `Selecciona los datos de tipo ${c}.`,
  statement: (t: string, c: string) => `${t} es de tipo ${c}.`,
};

const ALGO_PROGRAM: ChoiceItem[] = [
  { p: "¿Cuál es la diferencia entre algoritmo y programa?", a: "El programa es el algoritmo escrito en código", d: ["El algoritmo es una pieza de la computadora", "No hay ninguna diferencia entre los dos", "El programa siempre es más corto que el otro"] },
  { p: "Una receta de cocina se parece a...", a: "Un algoritmo", d: ["Un virus", "Un monitor", "Una contraseña"] },
  { p: "¿Qué debe tener un buen algoritmo?", a: "Pasos claros y en orden", d: ["Pasos al azar y largos", "Muchos dibujos de colores", "Solo una palabra en total"] },
  { p: "Antes de programar, ¿qué conviene hacer?", a: "Pensar los pasos del algoritmo", d: ["Apagar la computadora un rato", "Borrar todos los programas", "Cambiar el fondo de pantalla"] },
  { p: "¿Qué es el código?", a: "Las instrucciones escritas en un lenguaje", d: ["La contraseña de mi correo", "Un número para abrir candados", "Un mensaje secreto de espías"] },
];

const BROADCAST: ChoiceItem[] = [
  { p: "¿Para qué sirve el bloque «enviar»?", code: "broadcast (¡empieza! v)", a: "Para avisar a otros objetos", d: ["Para mandar un correo real", "Para borrar el escenario", "Para cambiar el idioma"] },
  { p: "El gato envía «¡empieza!». ¿Qué bloque usa el perro para reaccionar?", a: "when I receive [¡empieza! v]", d: ["when [espacio v] key pressed", "broadcast (¡empieza! v)", "when this sprite clicked"], blocks: true },
  { p: "¿Pueden varios objetos recibir el mismo mensaje?", a: "Sí, todos los que lo usen", d: ["No, solo uno a la vez", "Solo el gato naranja", "Solo si son del mismo color"] },
  { p: "Quiero avisar que cambie el fondo cuando termina el diálogo. ¿Qué bloque uso?", a: "broadcast (cambiar fondo v)", d: ["when I receive [cambiar fondo v]", "say [cambiar fondo]", "ask [¿cambiar fondo?] and wait"], blocks: true },
  { p: "¿De qué categoría son estos bloques?", code: "broadcast (mensaje1 v)\n\nwhen I receive [mensaje1 v]", a: "Eventos", d: ["Sonido", "Movimiento", "Lápiz"] },
];

const RULES_VS_EXAMPLES: ChoiceItem[] = [
  { p: "Un programa común sigue reglas escritas por personas. Una IA...", a: "Aprende a partir de ejemplos", d: ["Nunca necesita ningún dato", "Funciona sin electricidad", "Inventa reglas sin datos"] },
  { p: "Para que una IA reconozca perros, ¿qué le damos?", a: "Muchas fotos de perros", d: ["Una lista de palabras", "Un solo dibujo de gato", "Una canción de perros"] },
  { p: "¿Qué es más fácil de enseñar con ejemplos que con reglas?", a: "Reconocer una cara", d: ["Sumar dos números", "Ordenar de la A a la Z", "Contar del 1 al 10"] },
  { p: "Una calculadora sigue reglas fijas. ¿Usa IA para sumar?", a: "No, solo sigue reglas", d: ["Sí, aprende a sumar", "Sí, mira ejemplos", "Sí, adivina el total"] },
  { p: "¿Qué pasa si a una IA le damos ejemplos equivocados?", a: "Aprende cosas equivocadas", d: ["Aprende igual de bien", "Se arregla sola siempre", "Se vuelve más rápida"] },
];

const AI_MISTAKES: ChoiceItem[] = [
  { p: "Una IA confunde un perro con un gato. ¿Qué pudo pasar?", a: "Le faltaron ejemplos variados", d: ["Se cansó de trabajar tanto", "El perro estaba muy enojado", "Hacía mucho frío en la sala"] },
  { p: "¿Por qué hay que revisar lo que dice una IA?", a: "Porque puede equivocarse", d: ["Porque siempre miente", "Porque no tiene batería", "Porque habla muy bajito"] },
  { p: "Una IA solo vio fotos de manzanas rojas. ¿Qué pasará con una verde?", a: "Puede no reconocerla", d: ["La reconocerá perfecto", "La pintará de rojo", "La convertirá en pera"] },
  { p: "¿Qué ayuda a que una IA se equivoque menos?", a: "Datos variados y revisados", d: ["Apagarla todas las noches", "Cambiar su color de fondo", "Hablarle en voz muy alta"] },
  { p: "Si una IA se equivoca, ¿quién debe corregirla?", a: "Las personas responsables", d: ["Nadie, es una máquina", "La misma pantalla sola", "El mouse de la computadora"] },
];

const CONDITIONS_SCRATCH: ChoiceItem[] = [
  { p: "Quiero que el juego termine si el gato toca el borde. ¿Qué bloque uso?", a: "if <touching (borde v)?> then\nstop [todos v]\nend", d: ["if <key (espacio v) pressed?> then\nstop [todos v]\nend", "repeat (10)\nmove (10) steps\nend", "forever\nnext costume\nend"], blocks: true },
  { p: "¿Qué revisa esta condición?", code: "if <touching color [#ff0000]?> then\nsay [¡Ay!]\nend", a: "Si el objeto toca algo rojo", d: ["Si el objeto es de color rojo", "Si el fondo cambió a rojo", "Si suena un sonido rojo"] },
  { p: "¿Qué programa revisa la condición todo el tiempo?", a: "when flag clicked\nforever\nif <touching (borde v)?> then\nif on edge, bounce\nend\nend", d: ["when flag clicked\nrepeat (2)\nif <touching (borde v)?> then\nif on edge, bounce\nend\nend", "when flag clicked\nif <touching (borde v)?> then\nif on edge, bounce\nend", "when flag clicked\nwait (1) seconds\nif on edge, bounce"], blocks: true },
  { p: "Quiero perder una vida al tocar al enemigo. ¿Qué bloque uso?", a: "if <touching (enemigo v)?> then\nchange [vidas v] by (-1)\nend", d: ["if <touching (enemigo v)?> then\nchange [vidas v] by (1)\nend", "if <key (espacio v) pressed?> then\nchange [vidas v] by (-1)\nend", "repeat (3)\nchange [vidas v] by (-1)\nend"], blocks: true },
  { p: "¿De qué color es el bloque «si ... entonces»?", code: "if <> then\nend", a: "Naranja (Control)", d: ["Azul (Movimiento)", "Morado (Apariencia)", "Rosado (Sonido)"] },
];

const SENSORS: [string, string][] = [
  ["<touching (borde v)?>", "Sensores"], ["<touching color [#ff0000]?>", "Sensores"], ["<key (espacio v) pressed?>", "Sensores"],
  ["ask [¿Cómo te llamas?] and wait", "Sensores"], ["(answer)", "Sensores"], ["(timer)", "Sensores"],
  ["move (10) steps", "Movimiento"], ["go to x: (0) y: (0)", "Movimiento"], ["point in direction (90)", "Movimiento"],
  ["((5) + (3))", "Operadores"], ["(pick random (1) to (10))", "Operadores"], ["(join [hola] [mundo])", "Operadores"],
];
const SENSOR_WORDS = {
  blocks: true,
  blockStatement: (c: string) => `Este bloque es de ${c}.`,
  ask: "¿De qué categoría es este bloque?",
  all: (c: string) => `Selecciona los bloques de ${c}.`,
  statement: (t: string, c: string) => `«${t}» es un bloque de ${c}.`,
};

const AI_PRIVACY: ChoiceItem[] = [
  { p: "Una app con IA pide fotos de tu cara para «divertirse». ¿Qué haces?", a: "Pregunto a un adulto antes", d: ["Subo muchas fotos de inmediato", "Mando también las de mis amigos", "Acepto todo sin leer nada"] },
  { p: "¿Por qué las empresas quieren nuestros datos para la IA?", a: "Para entrenar sus sistemas", d: ["Para regalarnos juguetes", "Para limpiar la computadora", "Para apagar internet"] },
  { p: "¿Qué datos son privados?", a: "Mi dirección y mi teléfono", d: ["Mi color favorito del mundo", "El nombre de un planeta", "Una receta de cocina típica"] },
  { p: "Un asistente de voz siempre escucha. ¿Qué es prudente?", a: "No decir datos privados cerca", d: ["Decirle todas mis contraseñas", "Gritarle mi dirección completa", "Contarle secretos de mi familia"] },
  { p: "¿Qué debes leer antes de usar una app con IA?", a: "Qué datos va a usar", d: ["Solo el color del ícono", "El nombre del dibujante", "Nada, se instala y listo"] },
];

const OPEN_SOURCE: ChoiceItem[] = [
  { p: "¿Qué es el software libre?", a: "Software que se puede usar, estudiar y compartir", d: ["Software que se regala solo en navidad", "Software que no necesita computadora", "Software que funciona sin instrucciones"] },
  { p: "¿Qué es una actualización de software?", a: "Una nueva versión que mejora el programa", d: ["Un virus que borra todos los archivos", "Un cable nuevo para la computadora", "Un juego que se instala sin permiso"] },
  { p: "¿Qué es una app?", a: "Un programa para celular o tablet", d: ["Un cable para cargar el celular", "Una pieza de la pantalla táctil", "Un tipo de batería recargable"] },
  { p: "Antes de instalar una app, ¿qué conviene revisar?", a: "Qué permisos pide", d: ["De qué color es", "Cuánto pesa la tablet", "Si tiene un nombre largo"] },
  { p: "¿Qué es una licencia de software?", a: "Las reglas para usar un programa", d: ["Un permiso para manejar autos", "Un tipo de contraseña segura", "Un archivo de música gratis"] },
];

const CLONES: ChoiceItem[] = [
  { p: "¿Qué hace este bloque?", code: "create clone of (mí mismo v)", a: "Crea una copia del objeto", d: ["Crea un fondo nuevo", "Repite un sonido", "Borra el programa"] },
  { p: "Quiero que caigan muchas gotas de lluvia iguales. ¿Qué bloque uso?", a: "create clone of (mí mismo v)", d: ["move (10) steps", "switch backdrop to (azul v)", "next costume"], blocks: true },
  { p: "¿Con qué bloque empieza a actuar cada clon?", a: "when I start as a clone", d: ["when flag clicked", "when [a v] key pressed", "when I receive [mensaje1 v]"], blocks: true },
  { p: "¿Para qué sirve este bloque?", code: "delete this clone", a: "Para borrar esa copia", d: ["Para borrar el proyecto", "Para cerrar Scratch", "Para detener la música"] },
  { p: "¿De qué categoría son los bloques de clones?", code: "create clone of (mí mismo v)\n\nwhen I start as a clone", a: "Control", d: ["Sonido", "Lápiz", "Movimiento"] },
];

const SUPERVISED: ChoiceItem[] = [
  { p: "¿Qué es una etiqueta en los datos de una IA?", a: "La respuesta correcta de cada ejemplo", d: ["Un adhesivo pegado en la computadora", "El precio de la computadora nueva", "El color favorito del programador"] },
  { p: "Le damos fotos con la palabra «gato» o «perro». ¿Cómo se llama ese aprendizaje?", a: "Aprendizaje supervisado", d: ["Aprendizaje de memoria", "Aprendizaje por correo", "Aprendizaje sin datos"] },
  { p: "¿Para qué separamos datos de prueba?", a: "Para ver si aprendió bien", d: ["Para que pese menos", "Para pintar los datos", "Para borrarlos después"] },
  { p: "Una foto de perro tiene la etiqueta «gato». ¿Qué pasa?", a: "La IA aprende algo mal", d: ["La IA aprende más rápido", "La IA se pone contenta", "No pasa absolutamente nada"] },
  { p: "¿Qué hace una IA después de entrenar?", a: "Predice con datos nuevos", d: ["Olvida todo lo que vio", "Se apaga para siempre", "Borra los datos nuevos"] },
];

const BIAS: ChoiceItem[] = [
  { p: "¿Qué es un sesgo en una IA?", a: "Una preferencia injusta por los datos", d: ["Un cable roto dentro del robot", "Una pantalla más grande de lo normal", "Una contraseña difícil de recordar"] },
  { p: "Una IA de voz solo entiende bien a adultos. ¿Por qué?", a: "Casi no tuvo voces de niños", d: ["Los niños hablan muy rápido", "Los adultos tienen más batería", "La IA no tiene parlantes"] },
  { p: "¿Cómo se reduce el sesgo?", a: "Con datos variados de todos", d: ["Con datos de una sola persona", "Apagando la IA cada hora", "Usando un monitor más grande"] },
  { p: "Si una IA decide algo injusto, ¿qué deben hacer las personas?", a: "Revisarla y corregirla", d: ["Aceptarlo sin preguntar", "Apagar la luz del salón", "Copiar lo que decidió"] },
  { p: "¿Quién puede notar un sesgo en una IA?", a: "Las personas que la revisan", d: ["Nadie, es imposible notarlo", "Solo la computadora misma", "Solo el router de la casa"] },
];

const GENERATIVE: ChoiceItem[] = [
  { p: "¿Qué hace una IA generativa?", a: "Crea textos o imágenes nuevas", d: ["Solo apaga y prende focos", "Solo suma números grandes", "Solo guarda archivos viejos"] },
  { p: "Una IA hizo una foto de un perro astronauta. ¿Es real?", a: "No, la inventó la IA", d: ["Sí, la tomó en la Luna", "Sí, el perro existe así", "Sí, porque se ve real"] },
  { p: "¿Qué es una imagen falsa hecha con IA que parece real?", a: "Un deepfake", d: ["Un píxel", "Un bucle", "Un servidor"] },
  { p: "Uso una IA para un trabajo. ¿Qué es honesto?", a: "Decir que usé la IA", d: ["Decir que lo hice solo", "Borrar que fue la IA", "No contárselo a nadie"] },
  { p: "¿Cómo reconozco un texto confiable aunque lo escriba una IA?", a: "Comparando con buenas fuentes", d: ["Viendo si es muy largo", "Viendo si tiene emojis", "Viendo si está en negrita"] },
];

const CHECK_AI: ChoiceItem[] = [
  { p: "Una IA te da un dato histórico para tu tarea. ¿Qué haces?", a: "Lo compruebo en otra fuente", d: ["Lo copio tal como está", "Lo cambio un poco y ya", "Lo invento de nuevo yo"] },
  { p: "Una IA cita un libro que no encuentras. ¿Qué puede pasar?", a: "Que la IA lo inventó", d: ["Que el libro es secreto", "Que la biblioteca cerró", "Que el libro se borró"] },
  { p: "¿Cuál es una buena fuente para comprobar a una IA?", a: "Un libro o sitio educativo", d: ["Un comentario anónimo", "Un mensaje en cadena", "Una publicidad del juego"] },
  { p: "La IA y tu libro dicen cosas distintas. ¿Qué haces?", a: "Pregunto a mi profesor", d: ["Le creo siempre a la IA", "Elijo la más divertida", "Uso las dos sin pensar"] },
  { p: "¿La IA sabe todo lo que pasó ayer?", a: "No siempre está al día", d: ["Sí, lo sabe todo siempre", "Sí, lee la mente de todos", "Sí, vive en el periódico"] },
];

const NEURAL: ChoiceItem[] = [
  { p: "¿En qué se inspiran las redes neuronales artificiales?", a: "En las neuronas del cerebro", d: ["En las redes de pescar", "En los cables del enchufe", "En las raíces de los árboles"] },
  { p: "¿Qué hace una red neuronal al entrenar?", a: "Ajusta sus conexiones con los datos", d: ["Cambia el color de la pantalla", "Borra los datos que no le gustan", "Pide permiso para apagarse"] },
  { p: "¿Qué recibe una red neuronal para reconocer una foto?", a: "Los números de sus píxeles", d: ["El nombre del fotógrafo", "La contraseña del usuario", "El precio de la cámara"] },
  { p: "¿Por qué una red neuronal necesita muchos datos?", a: "Para aprender patrones generales", d: ["Para ocupar todo el disco duro", "Para gastar más electricidad", "Para que la pantalla brille"] },
  { p: "¿Qué da una red neuronal al final?", a: "Una predicción, como «es un gato»", d: ["Un dibujo hecho con lápiz", "Una canción de cumpleaños", "Un cable nuevo para el router"] },
];

const AI_ETHICS: ChoiceItem[] = [
  { p: "Alguien hace un video falso de un compañero con IA. ¿Está bien?", a: "No, puede dañarlo", d: ["Sí, si es divertido", "Sí, si nadie lo ve", "Sí, si es corto"] },
  { p: "¿Qué hacer si ves un video falso que se burla de alguien?", a: "No lo comparto y aviso", d: ["Lo comparto rápido", "Le agrego más burlas", "Lo guardo para luego"] },
  { p: "¿Quién es responsable de lo que se publica con IA?", a: "La persona que lo publica", d: ["Nadie, lo hizo la IA", "El celular que se usó", "El router de la casa"] },
  { p: "¿Está bien usar la voz de alguien con IA sin permiso?", a: "No, hay que pedir permiso", d: ["Sí, las voces son de todos", "Sí, si suena muy parecido", "Sí, si es para un juego"] },
  { p: "Una IA crea un dibujo. ¿Qué es honesto decir?", a: "Que lo hizo con ayuda de IA", d: ["Que lo pinté yo solo a mano", "Que lo hizo mi hermano mayor", "Que lo encontré en la calle"] },
];

const SOFTWARE_CYCLE: OrderItem[] = [
  { seq: ["Entender el problema", "Diseñar la solución", "Programar", "Probar", "Mejorar"] },
  { seq: ["Planear el juego", "Dibujar los personajes", "Programar los bloques", "Probar con amigos"] },
  { seq: ["Escribir el código", "Ejecutar el programa", "Encontrar el error", "Corregir y volver a probar"] },
];

const DEBUG_CODE: ChoiceItem[] = [
  { t: "total = 0\npara i desde 1 hasta 3:\n    total = total + 1\nmostrar total", p: "Queríamos sumar 1 + 2 + 3 = 6, pero muestra 3. ¿Qué línea está mal?", a: "total = total + 1", d: ["total = 0", "para i desde 1 hasta 3:", "mostrar total"] },
  { t: "edad = 10\nsi edad > 12:\n    mostrar \"Eres mayor de 10\"", p: "Queríamos el mensaje para mayores de 10. ¿Qué línea está mal?", a: "si edad > 12:", d: ["edad = 10", "mostrar \"Eres mayor de 10\"", "Ninguna línea"] },
  { t: "lado = 5\narea = lado + lado\nmostrar area", p: "Queríamos el área de un cuadrado de lado 5 (25). ¿Qué línea está mal?", a: "area = lado + lado", d: ["lado = 5", "mostrar area", "Ninguna línea"] },
  { t: "puntos = 0\nrepetir 4 veces:\n    puntos = 10\nmostrar puntos", p: "Queríamos sumar 10 puntos cuatro veces (40). ¿Qué línea está mal?", a: "puntos = 10", d: ["puntos = 0", "repetir 4 veces:", "mostrar puntos"] },
  { t: "nombre = \"Ana\"\nmostrar \"Hola, \" + nombre\nmostrar nombre * 2", p: "El programa da error. ¿Qué línea está mal?", a: "mostrar nombre * 2", d: ["nombre = \"Ana\"", "mostrar \"Hola, \" + nombre", "Ninguna línea"] },
];

const SCRATCH_DEBUG: ChoiceItem[] = [
  { p: "El gato no se mueve al presionar la bandera verde. ¿Qué bloque falta arriba?", code: "move (10) steps\nsay [¡Hola!]", a: "when flag clicked", d: ["play sound (Miau v) until done", "hide", "next costume"], blocks: true },
  { p: "El gato sale del escenario y no vuelve. ¿Qué bloque ayuda?", a: "if on edge, bounce", d: ["play sound (Pop v) until done", "change size by (50)", "hide"], blocks: true },
  { p: "El puntaje no vuelve a cero al empezar. ¿Qué bloque agrego al inicio?", a: "set [puntos v] to (0)", d: ["change [puntos v] by (1)", "show variable [puntos v]", "wait (1) seconds"], blocks: true },
  { p: "La animación va demasiado rápido. ¿Qué bloque agrego dentro del bucle?", code: "forever\nnext costume\nend", a: "wait (0.2) seconds", d: ["move (100) steps", "stop all sounds", "delete all of [lista v]"], blocks: true },
  { p: "El enemigo aparece siempre en el mismo lugar. ¿Qué bloque uso?", a: "go to x: (pick random (-200) to (200)) y: (0)", d: ["go to x: (0) y: (0)", "next costume", "turn cw (15) degrees"], blocks: true },
];

const SCRATCH_PROJECT: OrderItem[] = [
  { seq: ["Elegir la idea del juego", "Agregar objetos y fondos", "Programar los bloques", "Probar y corregir", "Compartir el proyecto"] },
  { seq: ["when flag clicked", "set [puntos v] to (0)", "go to x: (0) y: (0)", "forever\nif <touching (moneda v)?> then\nchange [puntos v] by (1)\nend\nend"], blocks: true },
  { seq: ["when flag clicked", "say [¡Hola!] for (2) seconds", "move (10) steps", "play sound (Miau v) until done"], blocks: true },
];

// ---------------------------------------------------------------------------
// Por grado
// ---------------------------------------------------------------------------

const prog = (rows: Extra["rows"]): Extra => ({ name: "Programación y software", icon: "💻", rows });
const scratch = (rows: Extra["rows"]): Extra => ({ name: "Scratch", icon: "🐱", rows });
const ia = (rows: Extra["rows"]): Extra => ({ name: "Inteligencia artificial", icon: "🧠", rows });

const EXTRAS: Record<string, Extra[]> = {
  p1: [
    prog([
      ["¿Hardware o software?", (r) => classify(r, HW_SW.slice(0, 10), HW_SW_WORDS)],
      ["¿Qué es un programa?", (r) => quiz(r, "", WHAT_IS_PROGRAM)],
      ["Instrucciones en orden", (r) => orderQuiz(r, "Ordena las instrucciones.", DAILY_ORDER)],
      ["Programas que conozco", (r) => classify(r, APPS, APPS_WORDS)],
    ]),
    scratch([
      ["Las partes de Scratch", (r) => quiz(r, "", SCRATCH_PARTS)],
      ["¿Qué hace este bloque?", (r) => classify(r, BLOCK_ACTIONS, { blocks: true, blockStatement: (c) => `Este bloque: ${c.toLowerCase()}.`, ask: "¿Qué hace este bloque?", all: (c) => `Selecciona el bloque que hace esto: ${c.toLowerCase()}.`, statement: (t, c) => `«${t}»: ${c.toLowerCase()}.` })],
      ["¿Cuántos pasos avanza el gato?", (r) => T.scratchSteps(r, 1)],
    ]),
    ia([
      ["¿Usa inteligencia artificial?", (r) => classify(r, IS_AI, IS_AI_WORDS)],
      ["¿Qué es la inteligencia artificial?", (r) => quiz(r, "", WHAT_IS_AI)],
      ["Enseñar a una máquina con ejemplos", T.trainingExamples],
    ]),
  ],
  p2: [
    prog([
      ["Tipos de software", (r) => classify(r, SOFTWARE_TYPES, SOFTWARE_WORDS)],
      ["¿Hardware o software?", (r) => classify(r, HW_SW, HW_SW_WORDS)],
      ["Errores en los programas", (r) => quiz(r, "", BUGS)],
      ["Entrada y salida", (r) => classify(r, IO_KIDS, IO_WORDS)],
    ]),
    scratch([
      ["Bloques de eventos", (r) => quiz(r, "", EVENT_BLOCKS)],
      ["Bucles: repetir pasos", (r) => T.scratchSteps(r, 2)],
      ["Disfraces y animación", T.scratchCostume],
      ["Bloques de apariencia y sonido", (r) => classify(r, LOOKS_SOUND, LOOKS_WORDS)],
    ]),
    ia([
      ["Etiquetar ejemplos", T.labelData],
      ["La IA reconoce patrones", completePattern],
      ["Usar la IA con cuidado", (r) => quiz(r, "", AI_CARE)],
      ["¿Usa inteligencia artificial?", (r) => classify(r, IS_AI, IS_AI_WORDS)],
    ]),
  ],
  p3: [
    prog([
      ["Lenguajes de programación", (r) => quiz(r, "", LANGUAGES)],
      ["Entrada, proceso y salida", (r) => classify(r, IPO, IPO_WORDS)],
      ["Algoritmos y programas", (r) => quiz(r, "", ALGO_PROGRAM)],
      ["Errores y depuración", (r) => quiz(r, "", BUGS)],
    ]),
    scratch([
      ["Coordenadas: la posición x", (r) => T.scratchXY(r, 1)],
      ["Variables en Scratch", (r) => T.scratchVariable(r, 1)],
      ["Enviar y recibir mensajes", (r) => quiz(r, "", BROADCAST)],
      ["Categorías de bloques", (r) => classify(r, BLOCK_CATEGORY, BLOCK_WORDS)],
    ]),
    ia([
      ["Reglas o ejemplos", (r) => quiz(r, "", RULES_VS_EXAMPLES)],
      ["Imágenes, voz y texto", (r) => classify(r, AI_TASKS, AI_TASK_WORDS)],
      ["Buenos datos de entrenamiento", T.betterDataset],
      ["Cuando la IA se equivoca", (r) => quiz(r, "", AI_MISTAKES)],
    ]),
  ],
  p4: [
    prog([
      ["Tipos de datos", (r) => classify(r, DATA_TYPES, DATA_WORDS)],
      ["Operaciones con paréntesis", (r) => T.expression(r, 1)],
      ["Comparaciones", T.comparisonExpr],
      ["Funciones", (r) => T.functionCall(r, 1)],
    ]),
    scratch([
      ["Coordenadas x e y", (r) => T.scratchXY(r, 2)],
      ["Variables y bucles", (r) => T.scratchVariable(r, 2)],
      ["Condiciones: si ... entonces", (r) => quiz(r, "", CONDITIONS_SCRATCH)],
      ["Sensores, movimiento y operadores", (r) => classify(r, SENSORS, SENSOR_WORDS)],
    ]),
    ia([
      ["Etiquetar datos", T.labelData],
      ["Datos de entrenamiento", T.betterDataset],
      ["La IA predice patrones", (r) => numberSequence(r, r.chance(0.5))],
      ["Privacidad y la IA", (r) => quiz(r, "", AI_PRIVACY)],
    ]),
  ],
  p5: [
    prog([
      ["Funciones con parámetros", (r) => T.functionCall(r, 2)],
      ["Bucles con contador", (r) => T.countLoop(r, 1)],
      ["Prioridad de las operaciones", (r) => T.expression(r, 2)],
      ["Apps, licencias y software libre", (r) => quiz(r, "", OPEN_SOURCE)],
    ]),
    scratch([
      ["Operadores de Scratch", T.scratchOperators],
      ["Números al azar", T.scratchRandom],
      ["Variables con condiciones", (r) => T.scratchVariable(r, 3)],
      ["Clones", (r) => quiz(r, "", CLONES)],
    ]),
    ia([
      ["Aprendizaje supervisado", (r) => (r.chance(0.5) ? T.labelData(r) : quiz(r, "", SUPERVISED))],
      ["Sesgo en los datos", (r) => quiz(r, "", BIAS)],
      ["IA generativa", (r) => quiz(r, "", GENERATIVE)],
      ["Comprobar lo que dice una IA", (r) => quiz(r, "", CHECK_AI)],
    ]),
  ],
  p6: [
    prog([
      ["Funciones anidadas", (r) => T.functionCall(r, 3)],
      ["Bucles con contador y condición", (r) => T.countLoop(r, 2)],
      ["El ciclo de desarrollo de software", (r) => orderQuiz(r, "Ordena las etapas.", SOFTWARE_CYCLE)],
      ["Depurar código", (r) => quiz(r, "", DEBUG_CODE)],
    ]),
    scratch([
      ["Listas en Scratch", T.scratchList],
      ["Mis bloques (bloques propios)", T.scratchMyBlock],
      ["Depurar un proyecto", (r) => quiz(r, "", SCRATCH_DEBUG)],
      ["Planear un proyecto", (r) => orderQuiz(r, "Ordena los pasos.", SCRATCH_PROJECT)],
    ]),
    ia([
      ["¿Cómo funciona una red neuronal?", (r) => quiz(r, "", NEURAL)],
      ["Buenas instrucciones para una IA", T.promptQuality],
      ["Ética, deepfakes y responsabilidad", (r) => quiz(r, "", AI_ETHICS)],
      ["Sesgo en los datos", (r) => quiz(r, "", BIAS)],
    ]),
  ],
};

// Agrega los tres apartados al final del grado (letras siguientes a la última
// sección) y fija la partida en 15 preguntas.
export function withExtras(curriculum: Curriculum, grade: keyof typeof EXTRAS): Curriculum {
  const last = curriculum.sections[curriculum.sections.length - 1].id;
  let next = last.charCodeAt(0) + 1;
  const sections: Section[] = [...curriculum.sections];
  const skills = [...curriculum.skills];
  for (const extra of EXTRAS[grade]) {
    const id = String.fromCharCode(next++);
    sections.push({ id, name: extra.name, icon: extra.icon });
    extra.rows.forEach(([title, generate], i) => skills.push({ id: `${id}.${i + 1}`, section: id, title, icon: extra.icon, generate }));
  }
  return { sections, skills, sessionLength: SESSION_LENGTH };
}

