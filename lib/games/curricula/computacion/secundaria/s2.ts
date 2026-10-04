import * as A from "../../../generators/compu/advanced";
import * as P from "../../../generators/compu/python";
import * as P2 from "../../../generators/compu/python2";
import * as S from "../../../generators/compu/secondary";
import * as X from "../../../generators/compu/secondary2";
import * as T from "../../../generators/compu/topics";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "../shared";
import { secundaria } from "./common";

// Computación · 2.° de Secundaria. Lógica digital, datos y estadística (情報I),
// internet de las cosas (物联网, China), criptografía, arquitectura y lenguaje
// máquina, direcciones de red, búsqueda y ordenamiento, multimedia y
// compresión, hoja de cálculo avanzada, bases de datos, bienestar digital,
// robótica y control, Python con decisiones y bucles, Scratch, pruebas de
// software e IA.

const SECTIONS: Section[] = [
  { id: "A", name: "Lógica digital", icon: "🔌" },
  { id: "B", name: "Datos y estadística", icon: "📊" },
  { id: "C", name: "Internet de las cosas", icon: "📡" },
  { id: "D", name: "Criptografía", icon: "🔐" },
  { id: "E", name: "Arquitectura y lenguaje máquina", icon: "🖥️" },
  { id: "F", name: "Redes: direcciones y paquetes", icon: "🌐" },
  { id: "G", name: "Búsqueda y ordenamiento", icon: "🔍" },
  { id: "H", name: "Multimedia y compresión", icon: "🎞️" },
  { id: "I", name: "Hoja de cálculo avanzada", icon: "🧮" },
  { id: "J", name: "Bases de datos", icon: "🗃️" },
  { id: "K", name: "Bienestar y ciudadanía digital", icon: "🌱" },
  { id: "L", name: "Robótica y control", icon: "🤖" },
  { id: "M", name: "Python: decisiones y bucles", icon: "🐍" },
  { id: "N", name: "Scratch", icon: "🐱" },
  { id: "O", name: "Programación y software", icon: "💻" },
  { id: "P", name: "Inteligencia artificial", icon: "🧠" },
];

type Facts = [string, string][];
const words = (ask: string, all: (c: string) => string, statement: (t: string, c: string) => string) => ({ ask, all, statement });

// --- A. Lógica digital ------------------------------------------------------

const BOOL_ALGEBRA: ChoiceItem[] = [
  { p: "¿Qué compuerta da 1 solo si las dos entradas son 1?", a: "AND", d: ["OR", "XOR", "NOT"] },
  { p: "¿Qué compuerta da 1 si al menos una entrada es 1?", a: "OR", d: ["AND", "NAND", "NOT"] },
  { p: "¿Qué compuerta da 1 solo si las entradas son distintas?", a: "XOR", d: ["AND", "OR", "NOR"] },
  { p: "¿Qué compuerta invierte la entrada?", a: "NOT", d: ["AND", "XOR", "OR"] },
  { p: "Una alarma suena si la puerta está abierta Y es de noche. ¿Qué compuerta usa?", a: "AND", d: ["OR", "XOR", "NOT"] },
  { p: "Una lámpara se enciende con el interruptor A O con el B. ¿Qué compuerta usa?", a: "OR", d: ["AND", "NOT", "NAND"] },
  { p: "¿Cuántas filas tiene la tabla de verdad de una compuerta con 3 entradas?", a: "8", d: ["3", "6", "9"] },
];

const GATE_SITUATIONS: ChoiceItem[] = [
  { p: "Un ascensor arranca si la puerta está cerrada Y alguien marcó un piso. ¿Qué compuerta?", a: "AND", d: ["OR", "XOR", "NOR"] },
  { p: "Suena el timbre si tocan la puerta de adelante O la de atrás. ¿Qué compuerta?", a: "OR", d: ["AND", "NOT", "XOR"] },
  { p: "Una escalera tiene un interruptor arriba y otro abajo: cualquiera cambia la luz. ¿Qué compuerta?", a: "XOR", d: ["AND", "OR", "NAND"] },
  { p: "El riego se activa cuando NO llueve. ¿Qué compuerta?", a: "NOT", d: ["AND", "OR", "XOR"] },
  { p: "Una luz se enciende solo si ningún sensor detecta movimiento (lo contrario de OR). ¿Qué compuerta?", a: "NOR", d: ["AND", "XOR", "OR"] },
];

const LOGIC_LAWS: ChoiceItem[] = [
  { p: "Según De Morgan, NOT (A AND B) es igual a…", a: "(NOT A) OR (NOT B)", d: ["(NOT A) AND (NOT B)", "A OR B", "NOT A AND B"] },
  { p: "Según De Morgan, NOT (A OR B) es igual a…", a: "(NOT A) AND (NOT B)", d: ["(NOT A) OR (NOT B)", "A AND B", "NOT A OR B"] },
  { p: "¿A qué es igual A AND 1?", a: "A", d: ["1", "0", "NOT A"] },
  { p: "¿A qué es igual A OR 1?", a: "1", d: ["A", "0", "NOT A"] },
  { p: "¿A qué es igual NOT (NOT A)?", a: "A", d: ["NOT A", "0", "1"] },
  { p: "¿A qué es igual A AND (NOT A)?", a: "0", d: ["1", "A", "NOT A"] },
];

const LOGIC_LIFE: Facts = [
  ["Entras al cine si tienes entrada y eres mayor de 12", "AND"], ["Apruebas si das el examen y entregas el trabajo", "AND"],
  ["Pagas con tarjeta o en efectivo", "OR"], ["El parque abre sábado o domingo", "OR"],
  ["La luz se apaga si no hay nadie en el cuarto", "NOT"], ["Sales al recreo si no está lloviendo", "NOT"],
];
const LIFE_WORDS = words("¿Qué operación lógica describe esta regla?", (c) => `Selecciona las reglas que usan ${c}.`, (t, c) => `«${t}» usa ${c}.`);

// --- B. Datos y estadística ------------------------------------------------

const CHARTS: ChoiceItem[] = [
  { p: "Quieres mostrar cómo cambió la temperatura cada día del mes. ¿Qué gráfico usas?", a: "Gráfico de líneas", d: ["Gráfico circular", "Tabla de verdad", "Mapa de calor"] },
  { p: "Quieres mostrar qué parte del total representa cada gasto. ¿Qué gráfico usas?", a: "Gráfico circular", d: ["Gráfico de líneas", "Diagrama de flujo", "Gráfico de dispersión"] },
  { p: "Quieres comparar cuántos alumnos hay en cada grado. ¿Qué gráfico usas?", a: "Gráfico de barras", d: ["Gráfico de dispersión", "Gráfico circular", "Diagrama de flujo"] },
  { p: "Quieres ver si la altura y el peso de las personas están relacionados. ¿Qué gráfico usas?", a: "Gráfico de dispersión", d: ["Gráfico circular", "Gráfico de barras", "Tabla de verdad"] },
  { p: "Un gráfico de barras empieza el eje en 90 y no en 0. ¿Qué problema tiene?", a: "Exagera las diferencias", d: ["Usa muy pocos colores", "No tiene un título largo", "Las barras son muy anchas"] },
];

const CORRELATION: Facts = [
  ["Horas de estudio y nota del examen", "Correlación positiva"], ["Temperatura y venta de helados", "Correlación positiva"],
  ["Edad de un auto y su precio de venta", "Correlación negativa"], ["Horas frente a la pantalla y horas de sueño", "Correlación negativa"], ["Altitud y temperatura del aire", "Correlación negativa"],
  ["Número de calzado y nota en matemáticas", "Sin correlación"], ["Color favorito y estatura", "Sin correlación"], ["Día de nacimiento y velocidad al correr", "Sin correlación"],
];
const CORR_WORDS = words("¿Qué relación esperas entre estos datos?", (c) => `Selecciona los pares con: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

const DATA_KINDS: Facts = [
  ["Color de ojos", "Cualitativa"], ["Distrito donde vive", "Cualitativa"], ["Deporte favorito", "Cualitativa"], ["Marca de celular", "Cualitativa"],
  ["Estatura en cm", "Cuantitativa"], ["Número de hermanos", "Cuantitativa"], ["Nota del examen", "Cuantitativa"], ["Minutos de viaje al colegio", "Cuantitativa"],
];
const KINDS_WORDS = words("¿Es una variable cualitativa o cuantitativa?", (c) => `Selecciona las variables de tipo ${c.toLowerCase()}.`, (t, c) => `«${t}» es una variable ${c.toLowerCase()}.`);

const DATA_CLEAN: ChoiceItem[] = [
  { p: "En una encuesta aparece la edad «150». ¿Qué es?", a: "Un dato atípico o un error", d: ["Un dato perfecto para el promedio", "La edad promedio del grupo", "Una edad muy común en el aula"] },
  { p: "La columna «distrito» dice «Lima», «lima» y «LIMA». ¿Qué conviene hacer?", a: "Unificar cómo se escribe", d: ["Contarlos como tres distritos", "Borrar la columna entera", "Cambiarlos a números al azar"] },
  { p: "Faltan algunas respuestas en la encuesta. ¿Qué es lo correcto?", a: "Marcarlas como vacías y decidir cómo tratarlas", d: ["Inventar respuestas que parezcan reales", "Copiar las respuestas de otra persona", "Borrar todas las encuestas del grupo"] },
  { p: "Una persona respondió dos veces la encuesta. ¿Qué haces?", a: "Quitar la fila duplicada", d: ["Sumar sus respuestas", "Duplicar las de los demás", "Dejarla, no importa"] },
  { p: "¿Por qué limpiar los datos antes de analizarlos?", a: "Para que las conclusiones sean correctas", d: ["Para que el archivo tenga más colores", "Para que la computadora vaya más rápido", "Porque los datos limpios pesan más"] },
];

// --- C. Internet de las cosas ----------------------------------------------

const IOT: Facts = [
  ["Termómetro digital", "Sensor"], ["Detector de movimiento", "Sensor"], ["Sensor de humedad del suelo", "Sensor"], ["Cámara", "Sensor"], ["Micrófono", "Sensor"],
  ["Motor de una puerta", "Actuador"], ["Parlante", "Actuador"], ["Válvula de riego", "Actuador"], ["Foco LED", "Actuador"],
  ["Microcontrolador (Arduino, micro:bit)", "Controlador"], ["Placa Raspberry Pi", "Controlador"],
];
const IOT_WORDS = words("En un sistema IoT, ¿qué papel cumple?", (c) => `Selecciona los que son: ${c.toLowerCase()}.`, (t, c) => `${t}: es un ${c.toLowerCase()}.`);

const IOT_SYSTEMS: ChoiceItem[] = [
  { p: "¿Qué es el internet de las cosas (IoT)?", a: "Objetos con sensores conectados a internet", d: ["Una red social para compartir fotos y videos", "Un navegador para ver páginas web del colegio", "Un cable que une varias computadoras"] },
  { p: "Un riego inteligente mide la humedad y abre el agua si el suelo está seco. ¿Qué hace el controlador?", a: "Decide según los datos del sensor", d: ["Mide la humedad del suelo", "Deja pasar el agua a las plantas", "Fabrica la electricidad del sistema"] },
  { p: "¿Qué riesgo tiene una cámara IoT con la clave de fábrica?", a: "Cualquiera podría entrar y ver la cámara", d: ["Gastará mucho más electricidad que antes", "Las fotos saldrán siempre en blanco y negro", "Se apagará sola durante la noche"] },
  { p: "En una ciudad inteligente, ¿para qué sirven los semáforos con sensores?", a: "Para ajustar los tiempos según el tráfico", d: ["Para cobrar multas a todos los peatones", "Para cambiar de color al azar cada minuto", "Para tomar fotos de los paisajes"] },
  { p: "¿Qué es un actuador?", a: "Un dispositivo que hace una acción física", d: ["Un programa que guarda las fotos del celular", "Un sensor que mide la temperatura del aire", "Una persona que actúa en videos"] },
];

const CONTROL: OrderItem[] = [
  { p: "Ciclo de un sistema de control:", seq: ["El sensor mide", "El controlador compara con el valor deseado", "El controlador decide", "El actuador actúa"] },
  { p: "Luz automática del pasillo:", seq: ["El sensor detecta movimiento", "El micro:bit recibe la señal", "El programa decide encender", "El foco se enciende"] },
  { p: "Ventilador inteligente:", seq: ["Medir la temperatura", "Comparar con 25 °C", "Decidir si hace calor", "Encender el ventilador"] },
];

const IOT_PRIVACY: ChoiceItem[] = [
  { p: "¿Qué debes hacer primero al instalar un dispositivo IoT en casa?", a: "Cambiar la contraseña de fábrica", d: ["Ponerlo cerca de la ventana más grande", "Pintarlo de otro color", "Desconectar el router de la casa"] },
  { p: "Un parlante inteligente escucha siempre. ¿Qué riesgo hay?", a: "Podría grabar conversaciones privadas", d: ["Podría gastar todo el saldo del celular", "Podría cambiar el idioma de la casa", "Podría apagar la refrigeradora sola"] },
  { p: "¿Por qué actualizar el software de los dispositivos IoT?", a: "Para cerrar fallas de seguridad", d: ["Para que cambien de forma y color", "Para que hagan más ruido", "Para que pesen menos al moverlos"] },
  { p: "Un reloj inteligente envía tu ritmo cardíaco a una empresa. ¿Qué debes revisar?", a: "Su política de privacidad", d: ["El color de la correa", "La marca de la batería", "El tamaño de la caja"] },
  { p: "¿Qué es mejor para los dispositivos IoT del hogar?", a: "Una red Wi-Fi separada para ellos", d: ["La misma red abierta y sin clave", "Conectarlos a la red del vecino", "Dejar el router sin ninguna clave"] },
];

const IOT_APPS: Facts = [
  ["Sensores que miden la humedad de los cultivos", "Agricultura"], ["Collares GPS para el ganado", "Agricultura"],
  ["Pulseras que miden el ritmo cardíaco", "Salud"], ["Pastilleros que avisan la hora de la medicina", "Salud"],
  ["Focos que se apagan solos al salir", "Hogar"], ["Cerraduras que se abren con el celular", "Hogar"],
  ["Contenedores que avisan cuando están llenos", "Ciudad"], ["Paraderos que muestran cuándo llega el bus", "Ciudad"],
];
const APPS_WORDS = words("¿En qué área se usa esta aplicación de IoT?", (c) => `Selecciona las aplicaciones de IoT en: ${c.toLowerCase()}.`, (t, c) => `«${t}»: IoT en ${c.toLowerCase()}.`);

// --- D. Criptografía -------------------------------------------------------

const CRYPTO: ChoiceItem[] = [
  { p: "¿Qué es cifrar un mensaje?", a: "Transformarlo para que solo lo lea quien tiene la clave", d: ["Borrarlo después de enviarlo a otra persona", "Escribirlo con letras mayúsculas y números", "Enviarlo varias veces para que no se pierda"] },
  { p: "En el cifrado César con clave 3, ¿en qué se convierte la A?", a: "D", d: ["C", "B", "E"] },
  { p: "¿Por qué el cifrado César es fácil de romper?", a: "Solo hay 25 claves posibles", d: ["Usa letras y no números", "Necesita una computadora", "El mensaje queda muy largo"] },
  { p: "En el cifrado simétrico, ¿cuántas claves se usan?", a: "La misma clave para cifrar y descifrar", d: ["Ninguna, porque no necesita claves", "Una clave distinta por cada letra", "Una clave pública y otra privada"] },
  { p: "¿Qué protege HTTPS?", a: "Los datos que viajan entre tú y la web", d: ["La batería del celular mientras navegas", "Las fotos guardadas en tu galería", "El brillo de la pantalla del celular"] },
];

// --- E. Arquitectura --------------------------------------------------------

const VON_NEUMANN: ChoiceItem[] = [
  { p: "En la arquitectura de Von Neumann, ¿dónde se guardan los programas?", a: "En la misma memoria que los datos", d: ["Solo dentro del teclado", "En la pantalla del monitor", "En un cable aparte de la PC"] },
  { p: "¿Qué une la CPU con la memoria para mover datos?", a: "Los buses", d: ["Los píxeles", "Las teclas", "Los parlantes"] },
  { p: "¿Qué registro guarda la dirección de la siguiente instrucción?", a: "El contador de programa (PC)", d: ["El acumulador (ACC)", "La memoria caché del disco", "El registro de la impresora"] },
  { p: "¿Qué es el «cuello de botella» de Von Neumann?", a: "La CPU espera datos de la memoria", d: ["El ventilador se traba con polvo", "La pantalla tarda en encender", "El teclado tiene teclas duras"] },
  { p: "¿Qué hace la unidad de control?", a: "Coordina la búsqueda y ejecución de instrucciones", d: ["Guarda los archivos del usuario para siempre", "Hace las sumas y restas de los programas", "Muestra las ventanas y los íconos"] },
];

const MACHINE_LANG: ChoiceItem[] = [
  { p: "¿En qué lenguaje entiende directamente la CPU?", a: "Lenguaje máquina (binario)", d: ["Español de Perú", "Python 3", "Bloques de Scratch"] },
  { p: "¿Qué es el lenguaje ensamblador?", a: "Instrucciones de máquina con palabras cortas", d: ["Un idioma para armar muebles en la casa", "Un lenguaje visual de bloques de colores", "Un programa para editar fotografías viejas"] },
  { p: "¿Qué hace un ensamblador (assembler)?", a: "Traduce ensamblador a binario", d: ["Arma computadoras en fábricas", "Une fotos en un álbum", "Cifra mensajes secretos"] },
  { p: "¿Por qué casi nadie programa apps en lenguaje máquina?", a: "Es muy difícil de leer y escribir", d: ["Porque está prohibido por ley", "Porque no funciona en ninguna PC", "Porque solo existe en celulares"] },
  { p: "LOAD, ADD y STORE son ejemplos de…", a: "Instrucciones de ensamblador", d: ["Funciones de hoja de cálculo", "Bloques de eventos de Scratch", "Etiquetas de páginas HTML"] },
];

const REGISTERS: Facts = [
  ["Guarda el resultado de las operaciones", "Acumulador (ACC)"], ["Recibe el resultado de cada suma", "Acumulador (ACC)"],
  ["Apunta a la siguiente instrucción", "Contador de programa (PC)"], ["Avanza en 1 después de buscar cada instrucción", "Contador de programa (PC)"],
  ["Guarda la instrucción que se está ejecutando", "Registro de instrucción (IR)"], ["Contiene la instrucción que se decodifica", "Registro de instrucción (IR)"],
];
const REG_WORDS = words("¿Qué registro de la CPU cumple esta función?", (c) => `Selecciona las funciones del ${c}.`, (t, c) => `«${t}»: ${c}.`);

// --- F. Redes ---------------------------------------------------------------

const PRIVATE_PUBLIC: Facts = [
  ["192.168.1.10", "IP privada"], ["10.0.0.5", "IP privada"], ["172.16.4.20", "IP privada"], ["192.168.0.1", "IP privada"],
  ["8.8.8.8", "IP pública"], ["200.48.225.130", "IP pública"], ["1.1.1.1", "IP pública"], ["181.65.10.2", "IP pública"],
];
const IP_WORDS = words("¿Es una dirección IP privada o pública?", (c) => `Selecciona cada ${c.toLowerCase()}.`, (t, c) => `${t} es una ${c.toLowerCase()}.`);

const TOPOLOGY: Facts = [
  ["Todos los equipos se conectan a un switch central", "Estrella"], ["Si cae el centro, cae toda la red", "Estrella"],
  ["Todos comparten un único cable principal", "Bus"], ["Si se corta el cable principal, nadie se comunica", "Bus"],
  ["Cada equipo se conecta con el siguiente formando un círculo", "Anillo"], ["Los datos dan la vuelta pasando por cada equipo", "Anillo"],
  ["Cada equipo se conecta con muchos otros", "Malla"], ["Si un cable falla, hay otros caminos", "Malla"],
];
const TOPO_WORDS = words("¿Qué topología de red describe?", (c) => `Selecciona lo que describe la topología ${c.toLowerCase()}.`, (t, c) => `«${t}»: topología ${c.toLowerCase()}.`);

const WIFI: ChoiceItem[] = [
  { p: "¿Qué cifrado de Wi-Fi es más seguro hoy?", a: "WPA3", d: ["WEP", "Ninguno", "Abierta"] },
  { p: "¿Por qué el Wi-Fi llega peor a cuartos lejanos?", a: "La señal se debilita con distancia y paredes", d: ["El router se cansa después de un buen rato", "Los cuartos lejanos usan otro idioma", "La señal solo viaja hacia arriba del router"] },
  { p: "¿Qué es el SSID?", a: "El nombre de la red Wi-Fi", d: ["La clave del router", "La velocidad máxima", "El precio del plan de internet"] },
  { p: "¿Qué ventaja tiene el cable de red sobre el Wi-Fi?", a: "Suele ser más estable y rápido", d: ["Se puede llevar a cualquier parte", "No necesita ningún dispositivo extra", "Funciona sin electricidad"] },
  { p: "¿Qué es un repetidor Wi-Fi?", a: "Un equipo que amplía la señal", d: ["Un virus que copia la señal", "Una clave que se repite siempre", "Un cable que se enrolla solo"] },
];

// --- G. Búsqueda y ordenamiento ---------------------------------------------

const SEARCH_SORT: ChoiceItem[] = [
  { p: "¿Qué necesita la búsqueda binaria para funcionar?", a: "Que la lista esté ordenada", d: ["Que la lista sea muy corta", "Que haya solo números pares", "Que la lista tenga muchos colores"] },
  { p: "En la búsqueda lineal, ¿cuántos elementos revisas como máximo en una lista de 50?", a: "50", d: ["6", "25", "1"] },
  { p: "En la búsqueda binaria con 64 datos, ¿cuántas comparaciones bastan como máximo?", a: "7", d: ["64", "32", "2"] },
  { p: "El ordenamiento burbuja compara…", a: "Pares de vecinos", d: ["Solo el primero de todos", "Elementos al azar", "Solo los dos extremos"] },
  { p: "¿Qué ordenamiento elige el menor de los que faltan y lo pone adelante?", a: "Selección", d: ["Burbuja", "Inserción", "Búsqueda binaria"] },
];

// --- H. Multimedia ----------------------------------------------------------

const MEDIA_QUALITY: ChoiceItem[] = [
  { p: "Si subes la frecuencia de muestreo de un audio, ¿qué pasa?", a: "Mejor calidad y archivo más grande", d: ["Peor calidad y archivo más chico", "El audio dura menos segundos", "Se convierte en un video corto de música"] },
  { p: "¿Qué es la profundidad de color?", a: "Bits usados para el color de cada píxel", d: ["La distancia de la cámara al objeto", "El brillo máximo de la pantalla", "El número de fotos por segundo"] },
  { p: "¿Qué son los FPS en un video?", a: "Imágenes que se muestran por segundo", d: ["Fotos que se guardan en la nube", "Filtros para editar las fotos", "Formatos para guardar sonido"] },
  { p: "¿Qué pasa si agrandas mucho una imagen de mapa de bits?", a: "Se ven los píxeles (pixelado)", d: ["Gana detalle automáticamente", "Se vuelve una imagen vectorial", "Cambia a blanco y negro"] },
  { p: "Un audio en estéreo, comparado con mono, ocupa…", a: "El doble", d: ["La mitad", "Lo mismo", "Cuatro veces menos"] },
];

// --- I. Hoja de cálculo -------------------------------------------------------

const SHEET_FUNCS: ChoiceItem[] = [
  { p: "Quieres contar cuántos alumnos aprobaron (nota ≥ 11). ¿Qué función usas?", a: "CONTAR.SI", d: ["SUMA", "PROMEDIO", "REDONDEAR"] },
  { p: "Quieres buscar el precio de un producto por su código. ¿Qué función usas?", a: "BUSCARV", d: ["CONTAR", "MIN", "REDONDEAR"] },
  { p: "Quieres escribir «Aprobado» o «Desaprobado» según la nota. ¿Qué función usas?", a: "SI", d: ["SUMA", "CONTAR", "HOY"] },
  { p: "Quieres sumar solo las ventas de «Lima». ¿Qué función usas?", a: "SUMAR.SI", d: ["SUMA", "MAX", "CONTAR.SI"] },
  { p: "Quieres la nota más alta del salón. ¿Qué función usas?", a: "MAX", d: ["MIN", "SUMA", "SI"] },
];

// --- J. Bases de datos -------------------------------------------------------

const DB_INTRO: ChoiceItem[] = [
  { p: "¿Qué es una base de datos?", a: "Datos organizados para buscarlos y actualizarlos", d: ["Una carpeta con fotos de las vacaciones de verano", "Un programa para dibujar figuras geométricas", "Una lista de canciones favoritas del celular"] },
  { p: "En una tabla, ¿qué es un registro?", a: "Una fila con los datos de un elemento", d: ["El nombre de una columna de la tabla", "La contraseña de la base de datos", "Un gráfico de barras de colores"] },
  { p: "En una tabla, ¿qué es un campo?", a: "Una columna, como «nombre» o «edad»", d: ["Una fila completa de datos de alguien", "Un archivo comprimido en formato ZIP", "El total de la tabla, al final de todo"] },
  { p: "¿Qué es un SGBD (como MySQL o PostgreSQL)?", a: "El programa que administra la base de datos", d: ["Un lenguaje para hacer páginas web bonitas", "Un tipo de cable para las redes de la oficina", "Un antivirus especial para los servidores"] },
  { p: "¿Qué lenguaje se usa para consultar bases de datos?", a: "SQL", d: ["HTML", "CSS", "MP3"] },
];

const FIELD_TYPES: Facts = [
  ["Nombre del alumno", "Texto"], ["Correo electrónico", "Texto"], ["Distrito", "Texto"],
  ["Edad", "Número"], ["Nota del examen", "Número"], ["Precio", "Número"],
  ["Fecha de nacimiento", "Fecha"], ["Día de la matrícula", "Fecha"],
  ["¿Pagó la pensión?", "Sí/No"], ["¿Está activo?", "Sí/No"],
];
const FIELD_WORDS = words("¿Qué tipo de dato conviene para este campo?", (c) => `Selecciona los campos de tipo ${c.toLowerCase()}.`, (t, c) => `«${t}» es un campo de tipo ${c.toLowerCase()}.`);

const DB_VS_SHEET: ChoiceItem[] = [
  { p: "¿Por qué un colegio usa una base de datos y no una hoja de cálculo para todo?", a: "Maneja muchos datos y usuarios a la vez", d: ["Porque las hojas de cálculo son ilegales", "Porque una base no necesita computadora", "Porque así no hay que guardar nada"] },
  { p: "¿Qué evita una clave primaria?", a: "Registros repetidos", d: ["Errores de ortografía", "Virus en la tabla", "Gráficos feos"] },
  { p: "Dos personas actualizan la misma base a la vez. ¿Quién lo controla?", a: "El gestor de base de datos", d: ["El teclado de cada usuario", "La impresora de la oficina", "Nadie, se borra todo"] },
  { p: "¿Qué ventaja tiene separar alumnos y cursos en tablas distintas?", a: "No se repiten datos", d: ["Ocupa más espacio", "Es más difícil buscar", "Se pierden datos"] },
  { p: "¿Qué es una consulta?", a: "Una pregunta a la base para obtener datos", d: ["Un mensaje al soporte técnico", "Una cita con el doctor del colegio", "Un archivo de respaldo comprimido"] },
];

// --- K. Bienestar y ciudadanía digital --------------------------------------

const SCREEN_TIME: ChoiceItem[] = [
  { p: "¿Qué ayuda a dormir mejor?", a: "Dejar las pantallas una hora antes", d: ["Usar el celular hasta dormirse", "Ver videos con el brillo al máximo", "Jugar en línea hasta muy tarde"] },
  { p: "¿Qué es la regla 20-20-20 para la vista?", a: "Cada 20 min, mirar a 20 pies por 20 s", d: ["Usar 20 apps durante 20 horas", "Dormir 20 minutos cada 20 horas", "Tener 20 pestañas como máximo"] },
  { p: "¿Por qué las apps envían tantas notificaciones?", a: "Para que vuelvas a usarlas", d: ["Porque el celular está fallando", "Para que ahorres más batería", "Porque así lo exige la ley"] },
  { p: "¿Qué puedes hacer si sientes que usas demasiado el celular?", a: "Poner límites de tiempo en las apps", d: ["Comprar un celular más rápido", "Activar todas las notificaciones", "Usarlo solo de madrugada"] },
  { p: "¿Qué es el FOMO?", a: "El miedo a perderse algo en redes", d: ["Un tipo de virus informático", "Un formato de archivo de video", "Un juego en línea muy famoso"] },
];

const DIGITAL_RIGHTS: ChoiceItem[] = [
  { p: "¿Qué derecho tienes sobre tus datos personales en una app?", a: "Pedir verlos, corregirlos o borrarlos", d: ["Ninguno, son de la empresa", "Solo cambiar el color de la app", "Venderlos a otras empresas"] },
  { p: "¿Qué es la libertad de expresión en internet?", a: "Opinar respetando los derechos de otros", d: ["Decir cualquier cosa, aunque dañe a otros", "Publicar datos privados de los demás", "Insultar si estás de mal humor"] },
  { p: "¿Qué es la brecha digital?", a: "Diferencias en el acceso a la tecnología", d: ["Una grieta en la pantalla del celular", "El espacio libre en un disco duro", "La distancia entre dos routers"] },
  { p: "¿Qué significa leer los términos y condiciones?", a: "Saber qué aceptas al usar un servicio", d: ["Perder el tiempo sin ningún motivo", "Comprar la versión premium de la app", "Cambiar tu contraseña cada día"] },
  { p: "Una app pide acceso a tus contactos sin necesitarlo. ¿Qué haces?", a: "Negar el permiso", d: ["Aceptar siempre", "Darle más permisos", "Enviar los contactos"] },
];

const FEEDS: ChoiceItem[] = [
  { p: "¿Cómo decide una red social qué videos mostrarte?", a: "Un algoritmo usa lo que viste antes", d: ["Los elige una persona por ti", "Los muestra al azar", "Siempre muestra los más antiguos"] },
  { p: "¿Qué es una burbuja de filtro?", a: "Ver solo lo que coincide con tus gustos", d: ["Un filtro para fotos con brillo", "Una burbuja que protege del virus", "Un juego de burbujas en el celular"] },
  { p: "¿Cómo puedes salir un poco de tu burbuja de filtro?", a: "Buscar fuentes con otras opiniones", d: ["Ver solo lo que el algoritmo sugiere", "Bloquear a quien piense distinto", "Usar la app más horas al día"] },
  { p: "¿Por qué las plataformas quieren que pases más tiempo en ellas?", a: "Ganan dinero con anuncios", d: ["Así cuidan tu salud mental", "Porque se aburren solas", "Para ahorrar electricidad"] },
  { p: "Ves solo noticias que confirman lo que ya piensas. ¿Qué riesgo hay?", a: "Creer que todos opinan igual", d: ["Que el celular se apague", "Que la batería dure más", "Que mejore tu ortografía"] },
];

const WELLBEING: Facts = [
  ["Silenciar notificaciones al estudiar", "Saludable"], ["Hacer pausas activas cada hora", "Saludable"], ["Hablar con un adulto si algo te incomoda en línea", "Saludable"], ["Tener horarios sin pantallas", "Saludable"],
  ["Revisar el celular apenas despiertas, por horas", "Poco saludable"], ["Compararte todo el tiempo con influencers", "Poco saludable"], ["Jugar en línea toda la madrugada", "Poco saludable"], ["Comer siempre frente a una pantalla", "Poco saludable"],
];
const WELL_WORDS = words("¿Es un hábito digital saludable?", (c) => `Selecciona los hábitos de tipo: ${c.toLowerCase()}.`, (t, c) => `«${t}» es ${c.toLowerCase()}.`);

const COPYRIGHT: Facts = [
  ["Usar una imagen con licencia Creative Commons citando al autor", "Se puede usar"], ["Usar música libre de derechos en tu video", "Se puede usar"], ["Citar un párrafo con comillas y fuente", "Se puede usar"],
  ["Subir una película completa a tu canal", "No se puede usar"], ["Vender stickers con un personaje famoso sin permiso", "No se puede usar"], ["Copiar un trabajo ajeno y firmarlo tú", "No se puede usar"],
];
const COPY_WORDS = words("Respetando los derechos de autor, ¿se puede hacer?", (c) => `Selecciona los casos donde: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

// --- L. Robótica y control ----------------------------------------------------

const OPEN_CLOSED: Facts = [
  ["Una tostadora que se apaga a los 2 minutos, sin medir el pan", "Lazo abierto"], ["Un riego que se activa a las 6:00, llueva o no", "Lazo abierto"], ["Un microondas con temporizador", "Lazo abierto"],
  ["Un aire acondicionado que mide la temperatura y se ajusta", "Lazo cerrado"], ["Un robot que corrige su rumbo con el sensor de línea", "Lazo cerrado"], ["Un riego que se activa si el suelo está seco", "Lazo cerrado"],
];
const LOOP_WORDS = words("¿Es un sistema de control de lazo abierto o cerrado?", (c) => `Selecciona los sistemas de ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const ROBOT_SEQ: OrderItem[] = [
  { p: "Programa de un robot que esquiva obstáculos:", seq: ["Avanzar", "Medir la distancia", "Si hay obstáculo, detenerse", "Girar a la derecha", "Repetir"] },
  { p: "Robot que sigue una línea negra:", seq: ["Leer el sensor de la izquierda", "Leer el sensor de la derecha", "Corregir la dirección", "Avanzar un poco", "Repetir"] },
  { p: "Construir un robot:", seq: ["Definir la tarea", "Elegir sensores y motores", "Armar la estructura", "Programar", "Probar y ajustar"] },
];

const ROBOT_SENSORS: ChoiceItem[] = [
  { p: "Un robot debe detenerse antes de chocar. ¿Qué sensor usa?", a: "Sensor de distancia", d: ["Sensor de humedad", "Micrófono", "Termómetro"] },
  { p: "Un robot debe seguir una línea negra en el piso. ¿Qué sensor usa?", a: "Sensor infrarrojo", d: ["Brújula digital", "Micrófono", "Termómetro"] },
  { p: "Un robot debe saber si se cayó o se inclinó. ¿Qué sensor usa?", a: "Acelerómetro", d: ["Sensor de luz", "Micrófono", "Cámara térmica"] },
  { p: "Un robot debe girar hacia donde hay más luz. ¿Qué sensor usa?", a: "Sensor de luz", d: ["Acelerómetro", "Termómetro", "Sensor de humedad"] },
  { p: "Un robot debe orientarse siempre hacia el norte. ¿Qué sensor usa?", a: "Brújula digital", d: ["Sensor de luz", "Micrófono", "Termómetro"] },
];

const LINE_FOLLOWER: ChoiceItem[] = [
  { p: "En un seguidor de línea, el sensor izquierdo ve negro y el derecho blanco. ¿Qué hace?", a: "Gira a la izquierda", d: ["Gira a la derecha", "Se detiene del todo", "Retrocede rápido"] },
  { p: "En un seguidor de línea, los dos sensores ven blanco y la línea está en medio. ¿Qué hace?", a: "Sigue derecho", d: ["Gira a la izquierda", "Gira a la derecha", "Se apaga solo"] },
  { p: "¿Por qué la línea es negra sobre fondo blanco?", a: "Por el contraste de luz reflejada", d: ["Porque el negro pesa menos", "Porque el robot no ve colores", "Por costumbre de los fabricantes"] },
  { p: "El robot se sale de la línea en las curvas. ¿Qué ajustarías?", a: "Bajar la velocidad", d: ["Pintar el robot", "Quitar un sensor", "Subir la velocidad"] },
  { p: "¿Qué tipo de control es un seguidor de línea?", a: "Lazo cerrado", d: ["Lazo abierto", "Sin control", "Manual"] },
];

// --- M. Python --------------------------------------------------------------

const PY_ORDER: OrderItem[] = [
  { p: "Ordena el programa: dice si un número es par.", seq: ["n = int(input())", "if n % 2 == 0:", '    print("par")', "else:", '    print("impar")'], mono: true },
  { p: "Ordena el programa: suma del 1 al 10.", seq: ["total = 0", "for i in range(1, 11):", "    total += i", "print(total)"], mono: true },
  { p: "Ordena el programa: imprime 5, 4, 3, 2, 1 y «¡Despegue!».", seq: ["n = 5", "while n > 0:", "    print(n)", "    n -= 1", 'print("¡Despegue!")'], mono: true },
  { p: "Ordena el programa: aprobado o desaprobado.", seq: ["nota = int(input())", "if nota >= 11:", '    print("Aprobado")', "else:", '    print("Desaprobado")'], mono: true },
  { p: "Ordena el programa: tabla del 7.", seq: ["for i in range(1, 13):", "    r = 7 * i", '    print("7 x", i, "=", r)'], mono: true },
];

// --- O. Programación y software ----------------------------------------------

const TEST_DATA: Facts = [
  ["Edad válida 0–120: probar con 35", "Normal"], ["Edad válida 0–120: probar con 70", "Normal"], ["Nota 0–20: probar con 14", "Normal"],
  ["Edad válida 0–120: probar con 0", "Límite"], ["Edad válida 0–120: probar con 120", "Límite"], ["Nota 0–20: probar con 20", "Límite"],
  ["Edad válida 0–120: probar con −5", "Erróneo"], ["Edad válida 0–120: probar con «hola»", "Erróneo"], ["Nota 0–20: probar con 25", "Erróneo"],
];
const TEST_WORDS = words("¿Qué tipo de dato de prueba es?", (c) => `Selecciona los datos de prueba de tipo: ${c.toLowerCase()}.`, (t, c) => `${t} → dato ${c.toLowerCase()}.`);

const VALIDATION: Facts = [
  ["La nota debe estar entre 0 y 20", "Rango"], ["La edad debe ser de 0 a 120", "Rango"],
  ["El DNI debe tener 8 dígitos", "Longitud"], ["La contraseña debe tener al menos 8 caracteres", "Longitud"],
  ["El nombre no puede quedar vacío", "Presencia"], ["Hay que escribir el correo sí o sí", "Presencia"],
  ["El correo debe tener la forma nombre@dominio", "Formato"], ["La fecha debe escribirse dd/mm/aaaa", "Formato"],
];
const VALIDATION_WORDS = words("¿Qué tipo de validación es?", (c) => `Selecciona las validaciones de ${c.toLowerCase()}.`, (t, c) => `«${t}» es validación de ${c.toLowerCase()}.`);

const ERROR_KINDS: Facts = [
  ["Olvidar los dos puntos después del if", "De sintaxis"], ["Escribir «pritn» en vez de «print»", "De sintaxis"], ["Abrir un paréntesis y no cerrarlo", "De sintaxis"],
  ["Dividir entre una variable que vale 0", "De ejecución"], ["Pedir el elemento 10 de una lista de 3", "De ejecución"], ["Convertir «hola» a número con int()", "De ejecución"],
  ["Calcular el promedio dividiendo entre 2 en vez de 3", "Lógico"], ["Usar > cuando debía ser >=", "Lógico"], ["Un bucle que suma uno de más", "Lógico"],
];
const ERROR_WORDS = words("¿Qué tipo de error es?", (c) => `Selecciona los errores de tipo: ${c.toLowerCase()}.`, (t, c) => `«${t}»: error ${c.toLowerCase()}.`);

const DEBUG_STRATEGY: ChoiceItem[] = [
  { p: "Tu programa da un resultado raro. ¿Qué haces primero?", a: "Agregar print para ver los valores", d: ["Borrar todo y empezar de nuevo", "Cambiar líneas al azar hasta que ande", "Culpar a la computadora por el error"] },
  { p: "¿Qué es la «depuración del patito de goma»?", a: "Explicar tu código en voz alta línea por línea", d: ["Programar mientras te bañas en la tina de casa", "Pegar un patito de goma encima del monitor", "Usar un antivirus que tiene forma de pato"] },
  { p: "¿Para qué sirve un depurador (debugger)?", a: "Ejecutar paso a paso y ver variables", d: ["Traducir el código a otro idioma", "Hacer el programa mucho más bonito", "Borrar los errores del código solo"] },
  { p: "El error aparece solo con algunos datos. ¿Qué conviene?", a: "Probar con esos datos y reducir el caso", d: ["Ignorarlo porque casi nunca pasa", "Probar solo con datos que funcionan", "Cambiar de lenguaje de programación"] },
  { p: "¿Qué ayuda a encontrar errores más rápido?", a: "Probar cada parte apenas la escribes", d: ["Escribir todo y probar al final", "No probar nunca el programa", "Usar nombres de variables raros"] },
];

const COMMENTS: ChoiceItem[] = [
  { p: "En Python, ¿cómo se escribe un comentario?", a: "Con # al inicio", d: ["Con // al inicio", "Entre <!-- -->", "Con ; al final"] },
  { p: "¿Para qué sirven los comentarios en el código?", a: "Explicar el código a las personas", d: ["Hacer que el programa sea más rápido", "Corregir los errores solos", "Mostrar mensajes al usuario"] },
  { p: "¿Qué nombre de variable es más claro para la nota final?", a: "nota_final", d: ["x", "nf2", "a1"] },
  { p: "¿Qué es un buen comentario?", a: "# Calcula el promedio de las 3 notas", d: ["# aquí hay código", "# variable", "# no sé qué hace esto, pero funciona"] },
  { p: "¿Por qué usar sangría (indentación) correcta en Python?", a: "Define qué líneas van dentro de un bloque", d: ["Solo hace que el código se vea bonito", "Hace que el programa use menos memoria", "Cambia el color del texto en el editor"] },
];

// --- P. Inteligencia artificial ----------------------------------------------

const CLASS_REG: Facts = [
  ["¿Este correo es spam o no?", "Clasificación"], ["¿La foto es de un perro, un gato o un ave?", "Clasificación"], ["¿El tumor es benigno o maligno?", "Clasificación"], ["¿Qué dígito escribió la persona?", "Clasificación"],
  ["¿Cuánto costará esta casa?", "Regresión"], ["¿Qué temperatura hará mañana?", "Regresión"], ["¿Cuántos helados se venderán el sábado?", "Regresión"], ["¿Cuántos minutos tardará el bus?", "Regresión"],
];
const CLASS_WORDS = words("¿Es un problema de clasificación o de regresión?", (c) => `Selecciona los problemas de ${c.toLowerCase()}.`, (t, c) => `«${t}» es un problema de ${c.toLowerCase()}.`);

const TRAIN_TEST: ChoiceItem[] = [
  { p: "¿Para qué se separan datos de prueba que el modelo no ve al entrenar?", a: "Para medir si funciona con casos nuevos", d: ["Para que el entrenamiento sea más corto", "Para guardar una copia de seguridad", "Para que el modelo ocupe menos memoria"] },
  { p: "Un modelo acierta 100% en entrenamiento y 60% en prueba. ¿Qué pasó?", a: "Memorizó los ejemplos (sobreajuste)", d: ["Le faltó electricidad a la computadora", "Los datos de prueba eran más fáciles", "El modelo es perfecto y no falla"] },
  { p: "¿Qué es una etiqueta en un conjunto de datos?", a: "La respuesta correcta de cada ejemplo", d: ["El nombre del archivo de la base de datos", "El precio del programa de IA", "Una pegatina pegada en la computadora"] },
  { p: "¿Qué pasa si entrenas un modelo con pocos datos?", a: "Suele equivocarse más con casos nuevos", d: ["Siempre será más exacto y mucho más rápido", "Ya no necesitará ningún dato de prueba", "Podrá predecir cualquier cosa"] },
  { p: "¿Qué es una característica (feature) en los datos?", a: "Un dato que describe a cada ejemplo", d: ["El resultado final que se predice", "Un error que comete el modelo entrenado", "La pantalla donde se ve el resultado"] },
];

const ROWS: Row[] = [
  ["A.1", "Compuertas AND, OR, XOR, NAND, NOR, NOT", (r) => S.logicGates(r, 1)],
  ["A.2", "Circuitos con dos compuertas", (r) => S.logicGates(r, 2)],
  ["A.3", "Tablas de verdad con 3 variables", X.truthTable3],
  ["A.4", "¿Qué compuerta se usa?", (r) => quiz(r, "", BOOL_ALGEBRA)],
  ["A.5", "Compuertas en situaciones reales", (r) => quiz(r, "", GATE_SITUATIONS)],
  ["A.6", "Leyes de De Morgan y álgebra de Boole", (r) => quiz(r, "", LOGIC_LAWS)],
  ["A.7", "AND, OR y NOT en la vida diaria", (r) => classify(r, LOGIC_LIFE, LIFE_WORDS)],
  ["A.8", "Suma binaria", S.binaryAddition],

  ["B.1", "La mediana", (r) => S.statistics(r, [0])],
  ["B.2", "La media (promedio)", (r) => S.statistics(r, [1])],
  ["B.3", "La moda", (r) => S.statistics(r, [2])],
  ["B.4", "Fórmulas y la función SI", (r) => A.sheetFormula(r, ["SUMA", "PROMEDIO", "MAX", "MIN", "SI"])],
  ["B.5", "Elegir el gráfico adecuado", (r) => quiz(r, "", CHARTS)],
  ["B.6", "Correlación entre datos", (r) => classify(r, CORRELATION, CORR_WORDS)],
  ["B.7", "Variables cualitativas y cuantitativas", (r) => classify(r, DATA_KINDS, KINDS_WORDS)],
  ["B.8", "Limpiar datos", (r) => quiz(r, "", DATA_CLEAN)],

  ["C.1", "Sensores, actuadores y controladores", (r) => classify(r, IOT, IOT_WORDS)],
  ["C.2", "Sistemas IoT y ciudades inteligentes", (r) => quiz(r, "", IOT_SYSTEMS)],
  ["C.3", "El ciclo de control", (r) => orderQuiz(r, "", CONTROL)],
  ["C.4", "Programar un sensor", (r) => X.microbit(r, [1])],
  ["C.5", "Seguridad y privacidad en IoT", (r) => quiz(r, "", IOT_PRIVACY)],
  ["C.6", "Aplicaciones del IoT", (r) => classify(r, IOT_APPS, APPS_WORDS)],

  ["D.1", "Cifrado César", (r) => A.caesar(r, 13)],
  ["D.2", "Cifrado, claves y HTTPS", (r) => quiz(r, "", CRYPTO)],
  ["D.3", "Cifrado XOR", X.xorBits],
  ["D.4", "¿Cuánto tarda la fuerza bruta?", (r) => X.passwordCombos(r, [1])],

  ["E.1", "Programas en ensamblador", (r) => X.assembly(r, [0])],
  ["E.2", "Ensamblador con variables", (r) => X.assembly(r, [1])],
  ["E.3", "Arquitectura de Von Neumann", (r) => quiz(r, "", VON_NEUMANN)],
  ["E.4", "Lenguaje máquina y ensamblador", (r) => quiz(r, "", MACHINE_LANG)],
  ["E.5", "Registros de la CPU", (r) => classify(r, REGISTERS, REG_WORDS)],
  ["E.6", "Potencias de 2 y bits", X.powersOfTwo],

  ["F.1", "Direcciones IP en binario", (r) => X.packets(r, [2])],
  ["F.2", "Paquetes y TCP", (r) => X.packets(r, [0, 1])],
  ["F.3", "Equipos en una red y máscaras", X.subnetHosts],
  ["F.4", "IP privadas y públicas", (r) => classify(r, PRIVATE_PUBLIC, IP_WORDS)],
  ["F.5", "Topologías de red", (r) => classify(r, TOPOLOGY, TOPO_WORDS)],
  ["F.6", "Wi-Fi", (r) => quiz(r, "", WIFI)],

  ["G.1", "Búsqueda lineal", A.linearSearch],
  ["G.2", "Búsqueda binaria", (r) => A.binarySearch(r, 7)],
  ["G.3", "Ordenamiento burbuja", A.bubblePass],
  ["G.4", "Ordenamiento por selección", X.selectionPass],
  ["G.5", "Contar intercambios", X.inversions],
  ["G.6", "Comparar búsquedas y ordenamientos", (r) => quiz(r, "", SEARCH_SORT)],

  ["H.1", "Compresión RLE", A.rle],
  ["H.2", "Razón de compresión", (r) => X.compressionRatio(r, [0])],
  ["H.3", "Porcentaje de compresión", (r) => X.compressionRatio(r, [1])],
  ["H.4", "¿Cuánto pesa un sonido?", X.soundSize],
  ["H.5", "Resolución y bits de color", X.resolution],
  ["H.6", "Calidad de audio, imagen y video", (r) => quiz(r, "", MEDIA_QUALITY)],

  ["I.1", "Copiar fórmulas", (r) => X.sheetRefs(r, [0, 2])],
  ["I.2", "Referencias absolutas", (r) => X.sheetRefs(r, [1])],
  ["I.3", "CONTAR.SI", (r) => X.countIf(r, [0, 2])],
  ["I.4", "SUMAR.SI", (r) => X.countIf(r, [1])],
  ["I.5", "BUSCARV", X.vlookup],
  ["I.6", "¿Qué función conviene usar?", (r) => quiz(r, "", SHEET_FUNCS)],

  ["J.1", "Filtrar registros", (r) => A.dbFilter(r, 1)],
  ["J.2", "Consultas con dos condiciones", (r) => A.dbFilter(r, 2)],
  ["J.3", "Registros, campos y SQL", (r) => quiz(r, "", DB_INTRO)],
  ["J.4", "Tipos de datos de los campos", (r) => classify(r, FIELD_TYPES, FIELD_WORDS)],
  ["J.5", "Contar con SQL", (r) => S.sqlQuery(r, [0])],
  ["J.6", "Base de datos u hoja de cálculo", (r) => quiz(r, "", DB_VS_SHEET)],

  ["K.1", "Tiempo de pantalla y descanso", (r) => quiz(r, "", SCREEN_TIME)],
  ["K.2", "Derechos digitales", (r) => quiz(r, "", DIGITAL_RIGHTS)],
  ["K.3", "Algoritmos de recomendación", (r) => quiz(r, "", FEEDS)],
  ["K.4", "Hábitos digitales saludables", (r) => classify(r, WELLBEING, WELL_WORDS)],
  ["K.5", "Derechos de autor", (r) => classify(r, COPYRIGHT, COPY_WORDS)],
  ["K.6", "Contraseñas posibles", (r) => X.passwordCombos(r, [0])],

  ["L.1", "micro:bit: botones y contador", (r) => X.microbit(r, [0])],
  ["L.2", "micro:bit: bucles", (r) => X.microbit(r, [2])],
  ["L.3", "Control de lazo abierto y cerrado", (r) => classify(r, OPEN_CLOSED, LOOP_WORDS)],
  ["L.4", "Programar un robot paso a paso", (r) => orderQuiz(r, "", ROBOT_SEQ)],
  ["L.5", "¿Qué sensor necesita el robot?", (r) => quiz(r, "", ROBOT_SENSORS)],
  ["L.6", "Robot seguidor de línea", (r) => quiz(r, "", LINE_FOLLOWER)],

  ["M.1", "if, elif y else", (r) => P.pyIf(r, [0])],
  ["M.2", "Condiciones con and y or", (r) => P.pyIf(r, [1, 2])],
  ["M.3", "Varios if seguidos", (r) => P.pyIf(r, [3])],
  ["M.4", "Expresiones lógicas", P.pyBool],
  ["M.5", "Valores verdaderos y falsos", P2.pyTruthy],
  ["M.6", "for: sumar y acumular", (r) => P.pyFor(r, [0, 5])],
  ["M.7", "range() con inicio, fin y paso", (r) => P.pyFor(r, [1, 2])],
  ["M.8", "for: productos y textos", (r) => P.pyFor(r, [3, 4])],
  ["M.9", "while: dividir y duplicar", (r) => P.pyWhile(r, [0, 1])],
  ["M.10", "while: restar, cifras y break", (r) => P.pyWhile(r, [2, 3, 4])],
  ["M.11", "Completar la línea que falta", P.pyMissingLine],
  ["M.12", "Ordenar las líneas de un programa", (r) => orderQuiz(r, "", PY_ORDER)],

  ["N.1", "Bucles anidados", S.scratchNested],
  ["N.2", "Recorrer una lista", S.scratchListSum],
  ["N.3", "Dirección y giros", S.scratchDirection],
  ["N.4", "Mis bloques con parámetros", T.scratchMyBlock],
  ["N.5", "Números aleatorios", T.scratchRandom],
  ["N.6", "Clones", X.scratchClones],
  ["N.7", "Enviar y esperar mensajes", X.scratchBroadcast],
  ["N.8", "Redondear", (r) => X.scratchMathBlocks(r, [0])],
  ["N.9", "Valor absoluto y raíz cuadrada", (r) => X.scratchMathBlocks(r, [1, 2])],
  ["N.10", "Simular la gravedad", S.scratchGravity],

  ["O.1", "Datos de prueba: normal, límite y erróneo", (r) => classify(r, TEST_DATA, TEST_WORDS)],
  ["O.2", "Validar datos de entrada", (r) => classify(r, VALIDATION, VALIDATION_WORDS)],
  ["O.3", "Errores de sintaxis, de ejecución y lógicos", (r) => classify(r, ERROR_KINDS, ERROR_WORDS)],
  ["O.4", "Estrategias para depurar", (r) => quiz(r, "", DEBUG_STRATEGY)],
  ["O.5", "Comentarios y código claro", (r) => quiz(r, "", COMMENTS)],
  ["O.6", "Prueba de escritorio de un bucle", (r) => T.countLoop(r, 2)],

  ["P.1", "Clasificación o regresión", (r) => classify(r, CLASS_REG, CLASS_WORDS)],
  ["P.2", "Predecir con un modelo lineal", S.linearModel],
  ["P.3", "Datos de entrenamiento y de prueba", (r) => quiz(r, "", TRAIN_TEST)],
  ["P.4", "Árboles de decisión", X.decisionTree],
  ["P.5", "Análisis de sentimiento", X.sentiment],
  ["P.6", "Predecir la siguiente palabra", X.markovNext],
];

export const COMPUTACION_S2 = secundaria(SECTIONS, ROWS);
