import * as P from "../../../generators/compu/python";
import * as P2 from "../../../generators/compu/python2";
import * as S from "../../../generators/compu/secondary";
import * as X from "../../../generators/compu/secondary2";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "../shared";
import { secundaria } from "./common";

// Computación · 5.° de Secundaria. Estructuras de datos y grafos, algoritmos
// avanzados, bases de datos y big data, ingeniería de software, criptografía
// y ciberseguridad avanzada, redes y sistemas distribuidos, computación
// teórica (autómatas, Turing, P vs NP), sociedad de la información y leyes
// peruanas, proyecto final y emprendimiento, Python avanzado, Scratch e IA
// (nivel de Singapur, China y Japón en el último año escolar).

const SECTIONS: Section[] = [
  { id: "A", name: "Estructuras de datos y grafos", icon: "🕸️" },
  { id: "B", name: "Algoritmos avanzados", icon: "🧮" },
  { id: "C", name: "Bases de datos y big data", icon: "🗃️" },
  { id: "D", name: "Ingeniería de software", icon: "🏗️" },
  { id: "E", name: "Ciberseguridad avanzada", icon: "🔐" },
  { id: "F", name: "Redes y sistemas distribuidos", icon: "🌐" },
  { id: "G", name: "Computación teórica", icon: "♾️" },
  { id: "H", name: "Sociedad de la información", icon: "⚖️" },
  { id: "I", name: "Proyecto final y emprendimiento", icon: "🚀" },
  { id: "J", name: "Python avanzado", icon: "🐍" },
  { id: "K", name: "Scratch", icon: "🐱" },
  { id: "L", name: "Inteligencia artificial", icon: "🧠" },
];

type Facts = [string, string][];
const words = (ask: string, all: (c: string) => string, statement: (t: string, c: string) => string) => ({ ask, all, statement });

// --- A. Estructuras de datos y grafos ------------------------------------------

const STRUCTS: Facts = [
  ["El botón «deshacer» de un editor", "Pila"], ["Las páginas para «volver atrás» del navegador", "Pila"], ["Llamadas a funciones recursivas", "Pila"],
  ["La fila para imprimir documentos", "Cola"], ["Clientes esperando en el banco", "Cola"], ["Mensajes en orden de llegada", "Cola"],
  ["Carpetas dentro de carpetas", "Árbol"], ["El árbol genealógico de una familia", "Árbol"],
  ["Rutas entre ciudades", "Grafo"], ["Amistades de una red social", "Grafo"], ["Estaciones y líneas del metro", "Grafo"],
];
const STRUCT_WORDS = words("¿Qué estructura de datos representa mejor esto?", (c) => `Selecciona los ejemplos que son: ${c.toLowerCase()}.`, (t, c) => `«${t}» se representa con: ${c.toLowerCase()}.`);

const GRAPHS: ChoiceItem[] = [
  { p: "En un grafo, ¿qué son los nodos (vértices)?", a: "Los puntos que se conectan", d: ["Las líneas entre los puntos", "Los números de cada ruta", "Los colores del dibujo final"] },
  { p: "¿Qué es una arista?", a: "Una conexión entre dos nodos", d: ["Un nodo sin ninguna conexión", "El nodo más grande del grafo", "Un error dentro del grafo"] },
  { p: "¿Qué algoritmo encuentra el camino más corto en un grafo con distancias?", a: "Dijkstra", d: ["Burbuja", "César", "Monte Carlo"] },
  { p: "La búsqueda en anchura (BFS) visita primero…", a: "Los vecinos más cercanos", d: ["El nodo más lejano de todos", "Un nodo cualquiera al azar", "Solo el último nodo añadido"] },
  { p: "Un GPS usa un grafo. ¿Qué representan los pesos de las aristas?", a: "La distancia o el tiempo de cada tramo", d: ["El peso de cada auto en la pista", "La cantidad de semáforos verdes", "El número de pasajeros del bus"] },
  { p: "En un árbol, el nodo de arriba del todo se llama…", a: "Raíz", d: ["Hoja", "Rama", "Arista"] },
];

// --- B. Algoritmos avanzados ---------------------------------------------------

const ALGO_ADV: ChoiceItem[] = [
  { p: "¿Qué es un problema NP-completo, como el del viajante?", a: "Uno que no sabemos resolver rápido para casos grandes", d: ["Uno que ya se resuelve al instante con cualquier PC", "Uno que no tiene ninguna solución posible", "Uno que solo se resuelve con lápiz y papel"] },
  { p: "¿Qué es una heurística?", a: "Una regla práctica que da una buena solución rápido", d: ["Un algoritmo que siempre da la solución perfecta", "Un error que aparece al compilar el código", "Un tipo de memoria muy rápida del procesador"] },
  { p: "¿Por qué la recursión puede llenar la memoria?", a: "Cada llamada ocupa espacio en la pila", d: ["Porque copia el disco duro en cada paso", "Porque descarga archivos de internet", "Porque borra las variables globales"] },
  { p: "¿Qué hace la búsqueda con retroceso (backtracking), como al resolver un sudoku?", a: "Prueba opciones y retrocede si no funcionan", d: ["Escribe números al azar hasta llenar todo", "Mira la solución en la última página", "Resuelve solo las casillas más fáciles"] },
  { p: "¿Qué complejidad tiene probar todas las combinaciones de n interruptores?", a: "O(2ⁿ)", d: ["O(n)", "O(log n)", "O(1)"] },
];

const HEURISTICS: ChoiceItem[] = [
  { p: "Un repartidor visita siempre la casa más cercana que falta. ¿Qué tipo de algoritmo usa?", a: "Voraz (vecino más cercano)", d: ["Fuerza bruta completa", "Búsqueda binaria", "Ordenamiento burbuja"] },
  { p: "¿Por qué un GPS no prueba todas las rutas posibles?", a: "Serían demasiadas: usa algoritmos eficientes", d: ["Porque no tiene mapas de todas las calles", "Porque solo conoce las rutas más antiguas", "Porque el satélite no lo permite"] },
  { p: "El algoritmo A* mejora a Dijkstra usando…", a: "Una estimación de la distancia que falta", d: ["Una lista de calles ordenada al azar", "Solo la primera ruta que encuentra", "El número de semáforos de cada calle"] },
  { p: "¿Qué ventaja tiene una heurística frente a la fuerza bruta?", a: "Es mucho más rápida", d: ["Siempre es más exacta", "No necesita datos", "Funciona sin computadora"] },
  { p: "¿Qué desventaja puede tener una heurística?", a: "A veces no da la mejor solución", d: ["Nunca termina de ejecutarse", "Solo funciona con números pares", "Borra los datos de entrada"] },
];

const SORT_CHOICE: ChoiceItem[] = [
  { p: "Tienes un millón de datos desordenados. ¿Qué algoritmo conviene?", a: "Merge sort o quicksort (n log n)", d: ["Burbuja, porque es el más simple", "Selección, porque usa poca memoria", "Ninguno, mejor buscar a mano"] },
  { p: "Vas a buscar muchas veces en una lista grande que no cambia. ¿Qué haces?", a: "Ordenarla una vez y usar búsqueda binaria", d: ["Buscar siempre de forma lineal, uno por uno", "Desordenarla antes de cada búsqueda", "Copiar la lista a mano en un cuaderno"] },
  { p: "Necesitas buscar por clave al instante, como un diccionario. ¿Qué estructura usas?", a: "Una tabla hash", d: ["Una lista sin orden", "Una pila", "Una cola"] },
  { p: "Debes atender pedidos por orden de llegada. ¿Qué estructura usas?", a: "Una cola", d: ["Una pila", "Un conjunto", "Una tabla hash"] },
  { p: "Necesitas el camino más corto en un mapa con distancias. ¿Qué algoritmo usas?", a: "Dijkstra", d: ["Burbuja", "Euclides", "César"] },
];

// --- C. Bases de datos y big data -------------------------------------------------

const BIG_DATA: Facts = [
  ["Millones de fotos subidas cada día", "Volumen"], ["Petabytes de datos de un telescopio", "Volumen"],
  ["Datos de sensores que llegan cada milisegundo", "Velocidad"], ["Transacciones bancarias en tiempo real", "Velocidad"],
  ["Textos, audios, videos y tablas mezclados", "Variedad"], ["Datos de redes sociales, GPS y compras juntos", "Variedad"],
  ["Datos con errores o de fuentes dudosas", "Veracidad"], ["Encuestas con respuestas falsas", "Veracidad"],
];
const BIG_WORDS = words("¿Qué «V» del big data describe mejor esto?", (c) => `Selecciona los ejemplos de ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const NOSQL: ChoiceItem[] = [
  { p: "¿Qué es una base de datos NoSQL?", a: "Una base que no usa solo tablas fijas", d: ["Una base que no guarda ningún dato", "Una base escrita en lenguaje SQL", "Una base que funciona sin servidor"] },
  { p: "¿Qué guarda una base de datos de documentos (como MongoDB)?", a: "Documentos parecidos a JSON", d: ["Solo hojas de cálculo de Excel", "Fotos impresas en papel", "Archivos de música MP3"] },
  { p: "¿Para qué es buena una base de datos de grafos?", a: "Relaciones como amistades o rutas", d: ["Guardar solo números enteros", "Ordenar alfabéticamente nombres", "Comprimir videos muy pesados"] },
  { p: "¿Qué ventaja tienen las bases relacionales (SQL)?", a: "Datos consistentes con reglas claras", d: ["No necesitan ningún diseño previo", "Guardan solo imágenes y videos", "Funcionan sin ninguna computadora"] },
  { p: "¿Qué es escalar horizontalmente una base de datos?", a: "Repartirla en más servidores", d: ["Girar el servidor de lado", "Borrar la mitad de los datos", "Usar una pantalla más ancha"] },
];

const DB_SECURITY: ChoiceItem[] = [
  { p: "¿Por qué se cifran las bases de datos con datos personales?", a: "Si las roban, no se pueden leer", d: ["Para que ocupen mucho menos espacio", "Para que las consultas sean más rápidas", "Porque así se ven más ordenadas"] },
  { p: "¿Qué es un respaldo (backup) de la base de datos?", a: "Una copia para recuperar datos perdidos", d: ["Una consulta muy rápida y especial", "Un usuario con todos los permisos", "Una tabla que se borra cada día"] },
  { p: "¿Quién debería poder borrar tablas en la base de un colegio?", a: "Solo administradores autorizados", d: ["Cualquier alumno con internet", "Todos los padres de familia", "Cualquier visitante de la web"] },
  { p: "¿Qué es la seguridad a nivel de fila (RLS)?", a: "Cada usuario ve solo las filas que le corresponden", d: ["Cada fila tiene un color distinto en la tabla", "Las filas se ordenan solas por seguridad", "Se borran las filas viejas cada semana"] },
  { p: "¿Qué registra un log de auditoría?", a: "Quién hizo qué cambio y cuándo", d: ["La temperatura del servidor", "Los colores de cada tabla", "El precio de la base"] },
];

// --- D. Ingeniería de software -----------------------------------------------------

const SCRUM: ChoiceItem[] = [
  { p: "En Scrum, ¿qué es un sprint?", a: "Un ciclo corto de trabajo, de 1 a 4 semanas", d: ["Una carrera entre los programadores", "La versión final que nunca cambia", "Un error que detiene todo el proyecto"] },
  { p: "¿Qué ventaja tiene el desarrollo ágil frente al de cascada?", a: "Se adapta a cambios con entregas frecuentes", d: ["Se planifica todo y nunca se cambia nada", "No necesita hablar con los usuarios", "Se termina sin hacer ninguna prueba"] },
  { p: "¿Qué es una historia de usuario?", a: "Una necesidad contada desde el usuario", d: ["La biografía completa del programador", "Un manual técnico de cien páginas", "El historial del navegador web"] },
  { p: "¿Qué son las pruebas unitarias?", a: "Pruebas de cada función por separado", d: ["Pruebas que hace un solo usuario", "Pruebas del sistema ya instalado", "Pruebas de la velocidad del internet"] },
  { p: "En el modelo en cascada, ¿cuándo se prueba?", a: "Después de programar todo", d: ["Antes de analizar el problema", "Nunca, porque no hace falta", "Solo cuando el cliente lo pide"] },
];

const REQUIREMENTS: Facts = [
  ["El sistema debe permitir registrar un pago", "Funcional"], ["El alumno puede ver sus notas", "Funcional"], ["Se puede imprimir la boleta", "Funcional"], ["El docente puede crear un examen", "Funcional"],
  ["La página carga en menos de 2 segundos", "No funcional"], ["Funciona en celulares y computadoras", "No funcional"], ["Los datos viajan cifrados", "No funcional"], ["Soporta 1 000 usuarios a la vez", "No funcional"],
];
const REQ_WORDS = words("¿Qué tipo de requisito es?", (c) => `Selecciona los requisitos de tipo: ${c.toLowerCase()}.`, (t, c) => `«${t}» es un requisito ${c.toLowerCase()}.`);

const SECURE_CODE: ChoiceItem[] = [
  { p: "¿Cómo se evita la inyección SQL?", a: "Con consultas parametrizadas", d: ["Escribiendo todo en mayúsculas", "Comprando más servidores", "Usando contraseñas más cortas"] },
  { p: "¿Por qué no se debe confiar en los datos que escribe el usuario?", a: "Pueden traer errores o código malicioso", d: ["Porque los usuarios escriben muy lento", "Porque ocupan demasiada memoria RAM", "Porque siempre están en otro idioma"] },
  { p: "¿Dónde NO se deben guardar las contraseñas de una base de datos?", a: "Escritas dentro del código público", d: ["En variables de entorno del servidor", "En un gestor de secretos cifrado", "En un archivo fuera del repositorio"] },
  { p: "¿Qué es el principio de mínimo privilegio?", a: "Dar solo los permisos necesarios", d: ["Dar todos los permisos a todos", "Quitar todos los permisos siempre", "Dar más permisos a los nuevos"] },
  { p: "¿Para qué sirve registrar (log) los accesos al sistema?", a: "Para detectar y revisar incidentes", d: ["Para que el sistema sea más rápido", "Para borrar a los usuarios antiguos", "Para cambiar el diseño de la web"] },
];

const SDLC_MODELS: Facts = [
  ["Se planifica todo al inicio y cada fase va después de la otra", "Cascada"], ["Las pruebas recién llegan cuando todo está programado", "Cascada"], ["Cambiar los requisitos a mitad cuesta mucho", "Cascada"],
  ["Se entregan versiones útiles cada pocas semanas", "Ágil"], ["El cliente revisa avances seguido y propone cambios", "Ágil"], ["El equipo se reúne a diario para coordinar", "Ágil"],
];
const SDLC_WORDS = words("¿Describe el modelo en cascada o el ágil?", (c) => `Selecciona lo que describe el modelo ${c.toLowerCase()}.`, (t, c) => `«${t}»: modelo ${c.toLowerCase()}.`);

const DEVOPS: ChoiceItem[] = [
  { p: "¿Qué es la integración continua (CI)?", a: "Probar el código automáticamente con cada cambio", d: ["Programar sin descansar durante todo el día y la noche", "Juntar a todo el equipo en una misma sala pequeña", "Integrar el teclado con el monitor de la oficina"] },
  { p: "¿Qué es el despliegue continuo (CD)?", a: "Publicar versiones automáticas y frecuentes", d: ["Instalar el programa a mano una vez al año", "Copiar todo el código a una memoria USB vieja", "Borrar las versiones antiguas del servidor"] },
  { p: "¿Qué es un contenedor (como Docker)?", a: "Un paquete con la app y todo lo que necesita", d: ["Una caja física para guardar computadoras viejas", "Un tipo de virus que se esconde en las apps", "Un servidor que solo guarda fotografías"] },
  { p: "¿Para qué sirve monitorear una aplicación en producción?", a: "Detectar fallas antes que los usuarios", d: ["Ver las pantallas de todos los usuarios", "Cambiar el color de la app cada semana", "Borrar a los usuarios que no entran nunca"] },
  { p: "¿Qué es revertir (rollback) un despliegue?", a: "Volver a la versión anterior estable", d: ["Escribir todo el código al revés", "Apagar todos los servidores de golpe", "Desinstalar el sistema operativo entero"] },
];

// --- E. Ciberseguridad avanzada ---------------------------------------------------

const CRYPTO_THEORY: ChoiceItem[] = [
  { p: "¿En qué se basa la seguridad de RSA?", a: "Es muy difícil factorizar números enormes", d: ["Las claves se guardan en papel", "Usa solo letras del alfabeto", "Las computadoras no saben multiplicar"] },
  { p: "¿Qué clave se puede compartir con todo el mundo en RSA?", a: "La pública", d: ["La privada", "Las dos", "Ninguna"] },
  { p: "¿Para qué sirve el intercambio de claves Diffie-Hellman?", a: "Acordar una clave secreta por un canal público", d: ["Cambiar la contraseña del Wi-Fi cada día", "Enviar las claves impresas por correo", "Borrar las claves después de usarlas"] },
  { p: "¿Por qué una computadora cuántica sería un riesgo para RSA?", a: "Podría factorizar mucho más rápido", d: ["Porque consume demasiada energía", "Porque no tiene teclado", "Porque es muy grande"] },
  { p: "¿Qué propiedad tiene una buena función hash?", a: "Un cambio mínimo cambia todo el resultado", d: ["Siempre devuelve el mismo número para todo", "Se puede revertir para ver el original", "Hace que los archivos pesen el doble"] },
];

const PENTEST: OrderItem[] = [
  { p: "Fases de una prueba de penetración (hacking ético):", seq: ["Obtener permiso por escrito", "Reunir información", "Buscar vulnerabilidades", "Probarlas con cuidado", "Entregar un informe"] },
  { p: "Responder a un incidente de seguridad:", seq: ["Detectar el incidente", "Contener el daño", "Eliminar la causa", "Recuperar los sistemas", "Aprender y mejorar"] },
  { p: "Proteger una aplicación nueva:", seq: ["Identificar qué datos son valiosos", "Analizar los riesgos", "Aplicar controles", "Probar la seguridad", "Monitorear siempre"] },
];

const ATTACKS_ADV: ChoiceItem[] = [
  { p: "¿Qué es un ataque de intermediario (man-in-the-middle)?", a: "Alguien intercepta la comunicación entre dos partes", d: ["Un virus que se esconde en el centro del disco", "Un ataque que solo ocurre a mediodía", "Un hacker que vive en un país del medio"] },
  { p: "¿Qué es una botnet?", a: "Muchos equipos infectados controlados a distancia", d: ["Una red de robots de juguete del colegio", "Un buscador de internet para bots buenos", "Un programa para chatear con amigos"] },
  { p: "¿Qué es un ataque de día cero?", a: "Uno que usa una falla aún desconocida", d: ["Uno que ocurre el primer día del año", "Uno que no causa ningún daño", "Uno que se borra a medianoche"] },
  { p: "¿Qué es el robo de credenciales con «relleno» (credential stuffing)?", a: "Probar claves filtradas de un sitio en otros", d: ["Rellenar formularios con datos inventados", "Guardar las contraseñas en un cuaderno", "Cambiar la clave cada semana"] },
  { p: "¿Por qué no reutilizar la misma contraseña en varios sitios?", a: "Si una se filtra, caen todas tus cuentas", d: ["Porque las webs lo prohíben por ley", "Porque se borra la contraseña sola", "Porque ocupan más memoria"] },
];

// --- F. Redes y sistemas distribuidos ---------------------------------------------

const DISTRIBUTED: ChoiceItem[] = [
  { p: "¿Qué es un sistema distribuido?", a: "Muchas computadoras que trabajan como una", d: ["Una computadora que reparte folletos en la calle", "Un programa que solo usa una CPU para todo", "Un cable que distribuye electricidad"] },
  { p: "¿Por qué los grandes servicios usan muchos servidores?", a: "Para soportar millones de usuarios y fallas", d: ["Porque usar un solo servidor está prohibido por ley", "Para gastar más electricidad cada mes", "Porque los servidores se aburren si están solos"] },
  { p: "¿Qué es la redundancia en un sistema?", a: "Tener copias por si algo falla", d: ["Repetir el mismo error muchas veces seguidas", "Escribir el código dos veces sin ningún motivo", "Guardar un archivo dos veces"] },
  { p: "¿Qué es un balanceador de carga?", a: "Reparte el trabajo entre varios servidores", d: ["Mide el peso exacto de cada servidor", "Carga la batería de todas las laptops", "Ordena los cables del centro de datos"] },
  { p: "¿Qué es la computación en el borde (edge computing)?", a: "Procesar datos cerca de donde se generan", d: ["Usar la computadora en el borde de la mesa", "Procesar todo en un único servidor muy lejano", "Apagar los equipos sin uso"] },
];

const BLOCKCHAIN: ChoiceItem[] = [
  { p: "¿Qué es una cadena de bloques (blockchain)?", a: "Un registro compartido muy difícil de alterar", d: ["Una cadena de metal para asegurar los servidores", "Un juego de bloques para aprender a programar", "Una red social para compartir fotos y videos"] },
  { p: "¿Qué une cada bloque con el anterior en una blockchain?", a: "El hash del bloque anterior", d: ["Un cable de red muy largo", "El nombre completo del usuario", "Una contraseña fija para todos"] },
  { p: "¿Por qué es difícil cambiar un bloque antiguo?", a: "Habría que rehacer todos los bloques siguientes", d: ["Porque los bloques están escritos a mano en papel", "Porque solo una persona en el mundo tiene la llave", "Porque los bloques antiguos se borran solos"] },
  { p: "¿Qué es un contrato inteligente?", a: "Un programa que corre en la blockchain", d: ["Un contrato firmado por una inteligencia artificial", "Un documento legal escrito muy rápido", "Un acuerdo hecho por WhatsApp entre amigos"] },
  { p: "¿Qué crítica ambiental tienen algunas blockchains?", a: "Consumen mucha energía", d: ["Producen mucho plástico", "Usan demasiado papel", "Contaminan el agua de los ríos"] },
];

const OSI: OrderItem[] = [
  { p: "Capas del modelo OSI, de abajo hacia arriba:", seq: ["Física", "Enlace de datos", "Red", "Transporte", "Sesión", "Presentación", "Aplicación"] },
  { p: "Capas del modelo TCP/IP, de abajo hacia arriba:", seq: ["Acceso a la red", "Internet", "Transporte", "Aplicación"] },
];

// --- G. Computación teórica ----------------------------------------------------------

const TURING: ChoiceItem[] = [
  { p: "¿Qué es una máquina de Turing?", a: "Un modelo teórico de lo que puede calcular una computadora", d: ["Una computadora real que fabricó Alan Turing en serie", "Una máquina para descifrar mensajes del ejército", "Un robot que habla como una persona"] },
  { p: "¿Qué dice el problema de la parada?", a: "Ningún programa puede predecir si cualquier otro termina", d: ["Todos los programas terminan si esperamos lo suficiente", "Los programas se detienen cuando se acaba la batería", "Las computadoras deben apagarse por la noche"] },
  { p: "¿Qué es el test de Turing?", a: "Ver si una máquina conversa como una persona", d: ["Un examen de matemáticas para computadoras", "Una prueba de velocidad del procesador", "Un antivirus creado por Alan Turing"] },
  { p: "¿Qué significa que un lenguaje sea «Turing completo»?", a: "Puede calcular todo lo que es computable", d: ["Que lo creó Alan Turing en persona", "Que no tiene ningún error de diseño", "Que solo sirve para hacer páginas web"] },
  { p: "¿Qué tiene una máquina de Turing?", a: "Una cinta, un cabezal y reglas", d: ["Un teclado y un monitor", "Una batería y una cámara", "Un ratón y una impresora"] },
];

const PNP: ChoiceItem[] = [
  { p: "¿Qué tienen de especial los problemas de la clase P?", a: "Se resuelven en tiempo razonable", d: ["No tienen ninguna solución posible", "Solo se resuelven con suerte", "Necesitan internet para resolverse"] },
  { p: "En los problemas NP, ¿qué es fácil?", a: "Comprobar si una solución propuesta es correcta", d: ["Encontrar la solución sin pensar nada", "Borrar el problema de la computadora", "Resolverlos con una sola operación"] },
  { p: "Un sudoku es difícil de resolver pero fácil de revisar. ¿Qué clase se parece?", a: "NP", d: ["P", "O(1)", "Ninguna"] },
  { p: "¿Qué se sabe hoy sobre la pregunta «¿P = NP?»", a: "Sigue sin resolverse", d: ["Se demostró que sí", "Se demostró que no", "No tiene importancia"] },
  { p: "¿Por qué importa P vs NP para la criptografía?", a: "La seguridad depende de que ciertos problemas sean difíciles", d: ["Porque las contraseñas solo usan la letra P", "Porque los hackers estudian solo matemáticas", "Porque los números primos son muy pequeños"] },
];

const REGEX: ChoiceItem[] = [
  { p: "¿Qué texto coincide con la expresión regular «colou?r»?", a: "color", d: ["colr", "colouur", "kolor"] },
  { p: "¿Qué texto coincide con «\\d{3}»?", a: "123", d: ["12", "abc", "1a3"] },
  { p: "¿Qué texto coincide con «^a.*z$»?", a: "abcz", d: ["zbca", "abc", "bz"] },
  { p: "¿Qué texto coincide con «[aeiou]+»?", a: "aei", d: ["xyz", "123", "bcd"] },
  { p: "¿Qué hace la expresión «\\w+@\\w+\\.pe»?", a: "Busca correos que terminan en .pe", d: ["Busca números de teléfono", "Busca fechas de cumpleaños", "Busca palabras en mayúsculas"] },
];

// --- H. Sociedad de la información ---------------------------------------------------

const LAW: ChoiceItem[] = [
  { p: "En Perú, ¿qué ley protege los datos personales?", a: "La Ley N.° 29733", d: ["La Ley del Tránsito", "La Ley de Educación Física", "La Ley del Presupuesto"] },
  { p: "Según la protección de datos, para usar tus datos una empresa necesita…", a: "Tu consentimiento informado", d: ["Solo tu número de celular", "Un permiso de tus vecinos", "Nada, los datos son públicos"] },
  { p: "¿Qué permite una licencia Creative Commons BY?", a: "Usar la obra citando al autor", d: ["Usarla sin mencionar a nadie", "Venderla como si fuera tuya", "Nada, está totalmente prohibida"] },
  { p: "Descargar y vender un juego de otro sin permiso infringe…", a: "Los derechos de autor", d: ["Las reglas de ortografía", "La ley de la gravedad", "El horario del colegio"] },
  { p: "¿Qué es un delito informático?", a: "Un delito cometido usando tecnología", d: ["Un error de ortografía en el chat", "Tener una computadora muy antigua", "Jugar videojuegos los fines de semana"] },
];

const SOCIETY: ChoiceItem[] = [
  { p: "¿Qué es la brecha digital?", a: "La diferencia en acceso a la tecnología", d: ["Una grieta en la pantalla del celular", "El espacio libre del disco duro", "La distancia entre dos routers"] },
  { p: "¿Cómo puede la tecnología ayudar en zonas rurales del Perú?", a: "Con educación y salud a distancia", d: ["Reemplazando a todas las personas", "Prohibiendo los libros impresos", "Cerrando las escuelas del pueblo"] },
  { p: "¿Qué es el teletrabajo?", a: "Trabajar a distancia usando internet", d: ["Trabajar reparando televisores", "Trabajar solo en un teleférico", "Trabajar sin ningún horario fijo"] },
  { p: "¿Qué es una burbuja de filtro en redes sociales?", a: "Ver solo contenido que piensa como tú", d: ["Un filtro de belleza para las fotos", "Una burbuja que protege del virus", "Un juego de burbujas en el celular"] },
  { p: "¿Qué es el e-waste?", a: "Basura de aparatos electrónicos", d: ["Un correo electrónico vacío", "Un virus que borra archivos", "Una tienda en línea de reciclaje"] },
];

const DIGITAL_GOV: ChoiceItem[] = [
  { p: "¿Qué es el gobierno digital?", a: "Trámites y servicios públicos por internet", d: ["Un gobierno formado solo por robots y computadoras", "Votar por videojuegos favoritos", "Prohibir el uso de papel en todas las oficinas"] },
  { p: "¿Qué ventaja tiene un trámite en línea en gob.pe?", a: "Evita colas y se hace desde cualquier lugar", d: ["Siempre cuesta el doble que hacerlo en persona", "Solo funciona en computadoras muy antiguas", "No necesita ningún dato de la persona que lo pide"] },
  { p: "¿Qué es la identidad digital (como el DNI electrónico)?", a: "Una forma segura de probar quién eres en línea", d: ["Tu foto de perfil favorita en las redes sociales", "Un apodo que usas en los videojuegos en línea", "La contraseña de tu correo electrónico personal"] },
  { p: "¿Qué riesgo tiene que todos los servicios públicos sean solo digitales?", a: "Excluir a quien no tiene acceso", d: ["Que haya demasiadas colas en las oficinas", "Que se gaste mucho más papel que antes", "Que todo sea más lento"] },
  { p: "¿Para qué sirve la transparencia en datos públicos?", a: "Para que la ciudadanía vigile al Estado", d: ["Para esconder los gastos reales del gobierno", "Para vender los datos", "Para borrar los registros de años anteriores"] },
];

const FUTURE_WORK: ChoiceItem[] = [
  { p: "¿Qué habilidades serán más valiosas con la automatización?", a: "Creatividad, pensamiento crítico y colaboración", d: ["Hacer tareas repetitivas muy rápido a mano", "Memorizar todas las tablas sin entenderlas", "Evitar usar cualquier tipo de tecnología"] },
  { p: "¿Qué es el aprendizaje a lo largo de la vida?", a: "Seguir aprendiendo siempre, no solo en el colegio", d: ["Estudiar solo hasta terminar la secundaria y parar", "Aprender una sola cosa y repetirla para siempre", "Repetir exactamente lo mismo todos los años"] },
  { p: "¿Qué trabajos son más fáciles de automatizar?", a: "Los repetitivos y predecibles", d: ["Los que requieren empatía con otros", "Los que inventan cosas totalmente nuevas", "Los que cuidan a personas enfermas"] },
  { p: "La IA ayuda a un médico a leer radiografías. ¿Qué pasa con el médico?", a: "Trabaja mejor apoyado por la IA", d: ["Desaparece de inmediato del hospital", "Ya no necesita estudiar nada más", "Deja de ver pacientes para siempre"] },
  { p: "¿Qué es un emprendimiento tecnológico?", a: "Un negocio que resuelve un problema con tecnología", d: ["Un trabajo fijo en una oficina del Estado peruano", "Un videojuego que se juega en grupo con amigos", "Una tienda que solo vende computadoras usadas"] },
];

// --- I. Proyecto final y emprendimiento -------------------------------------------------

const STARTUP: ChoiceItem[] = [
  { p: "¿Qué es una startup?", a: "Una empresa nueva que busca crecer rápido", d: ["Una empresa antigua que no cambia nada", "Un botón para encender la computadora", "Un programa que inicia con Windows"] },
  { p: "¿Qué es validar una idea de negocio?", a: "Comprobar con usuarios reales que la necesitan", d: ["Pedir a tus amigos que digan que es buena", "Registrar la marca antes de pensar nada", "Gastar todo el dinero en publicidad"] },
  { p: "¿Qué es el «problema» en un modelo de negocio?", a: "La necesidad real que tiene el cliente", d: ["Un error del código de la aplicación", "Una pelea entre los socios", "La falta de computadoras"] },
  { p: "¿Por qué muchas startups fracasan?", a: "Crean algo que nadie necesita", d: ["Porque usan computadoras nuevas", "Porque tienen nombres en inglés", "Porque trabajan en equipo"] },
  { p: "¿Qué es la propuesta de valor?", a: "Por qué el cliente te elegiría a ti", d: ["El precio de las acciones", "El color del logo", "La dirección de la oficina"] },
];

const PITCH: OrderItem[] = [
  { p: "Partes de un pitch (presentación corta de tu proyecto):", seq: ["El problema", "Tu solución", "A quién ayuda", "Cómo funciona (demo)", "Qué necesitas"] },
  { p: "Método lean startup:", seq: ["Construir un prototipo mínimo", "Medir cómo lo usan", "Aprender de los datos", "Mejorar o cambiar de rumbo"] },
  { p: "Proyecto final de computación:", seq: ["Elegir un problema real", "Investigar a los usuarios", "Diseñar la solución", "Programar y probar", "Presentar los resultados"] },
];

const REVENUE: Facts = [
  ["Pagar cada mes por música sin anuncios", "Suscripción"], ["Una plataforma educativa con pago anual", "Suscripción"],
  ["Una app gratis que muestra anuncios", "Publicidad"], ["Un canal de videos que gana por cada vista con anuncios", "Publicidad"],
  ["Un juego gratis que vende trajes para los personajes", "Gratis con compras"], ["Una app gratis con funciones extra de pago", "Gratis con compras"],
  ["Una tienda en línea que vende productos", "Venta directa"], ["Vender una licencia de software una sola vez", "Venta directa"],
];
const REVENUE_WORDS = words("¿Qué modelo de ingresos usa?", (c) => `Selecciona los ejemplos del modelo: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const METRICS: ChoiceItem[] = [
  { p: "¿Qué son los usuarios activos mensuales?", a: "Personas que usaron la app en el mes", d: ["Personas que descargaron la app alguna vez", "Personas que trabajan dentro de la empresa", "Personas que vieron un anuncio en la calle"] },
  { p: "¿Qué mide la tasa de retención?", a: "Cuántos usuarios siguen usando el producto", d: ["Cuánto dinero gana la empresa cada año", "Cuántos errores tiene el código del producto", "Cuánto pesa la aplicación en el celular"] },
  { p: "¿Qué es una prueba A/B?", a: "Comparar dos versiones con usuarios distintos", d: ["Un examen que tiene solo dos preguntas", "Probar solamente la versión A con el equipo", "Elegir entre dos programadores para un puesto"] },
  { p: "¿Por qué medir antes de decidir un cambio grande?", a: "Para decidir con datos y no solo con opiniones", d: ["Porque medir es obligatorio por una ley nueva", "Para que el proyecto dure muchísimo más tiempo", "Porque los datos siempre le dan la razón al jefe"] },
  { p: "100 personas visitan la página y 5 se registran. ¿Cuál es la tasa de conversión?", a: "5%", d: ["50%", "95%", "20%"] },
];

const IMPACT: ChoiceItem[] = [
  { p: "¿Qué son los Objetivos de Desarrollo Sostenible (ODS)?", a: "Metas de la ONU para mejorar el mundo al 2030", d: ["Reglas oficiales para programar en Python", "Una lista de videojuegos educativos famosos", "Leyes para cobrar más impuestos a todos"] },
  { p: "Una app conecta a agricultores con compradores sin intermediarios. ¿Qué impacto busca?", a: "Mejores ingresos para los agricultores", d: ["Que los agricultores dejen de trabajar", "Que la comida sea mucho más cara en Lima", "Que haya cada vez menos cultivos en el país"] },
  { p: "¿Qué es la innovación social?", a: "Soluciones nuevas para problemas de la comunidad", d: ["Cambiar de red social favorita cada mes", "Inventar nuevos emojis para los mensajes", "Comprar el celular más nuevo del mercado"] },
  { p: "¿Qué debe considerar un proyecto tecnológico responsable?", a: "Su impacto en las personas y el ambiente", d: ["Solo cuánto dinero puede ganar el primer año", "Solo qué tan bonito se ve en las fotos", "Solo cuántos seguidores tendrá en redes"] },
  { p: "¿Cómo puede la tecnología apoyar la educación en el Perú?", a: "Con contenidos accesibles en varias lenguas", d: ["Reemplazando a todos los docentes del país", "Cerrando todas las bibliotecas públicas", "Prohibiendo los cuadernos en las escuelas"] },
];

// --- L. Inteligencia artificial -------------------------------------------------------

const AI_ETHICS: ChoiceItem[] = [
  { p: "¿Qué es la explicabilidad de una IA?", a: "Poder entender por qué decidió algo", d: ["Que la IA hable muchos idiomas", "Que la IA funcione sin internet", "Que la IA sea gratuita para todos"] },
  { p: "Un sistema de IA para dar créditos rechaza más a un grupo. ¿Qué se debe hacer?", a: "Revisar los datos y corregir el sesgo", d: ["Ignorarlo porque la IA no se equivoca", "Ocultar los resultados al público", "Eliminar a ese grupo de los datos"] },
  { p: "¿Qué busca la regulación de la IA, como la ley de la Unión Europea?", a: "Reducir riesgos para las personas", d: ["Prohibir todas las computadoras", "Que solo una empresa use IA", "Que la IA tome todas las decisiones"] },
  { p: "¿Qué es un deepfake?", a: "Un video falso generado con IA", d: ["Un video grabado bajo el mar", "Un archivo muy pesado de video", "Una cámara de alta definición"] },
  { p: "¿Quién debe tener la última palabra en una decisión médica apoyada por IA?", a: "El médico, que revisa la sugerencia", d: ["La IA, porque nunca se equivoca", "El paciente, sin consultar a nadie", "El programador que hizo la IA"] },
  { p: "¿Qué impacto ambiental tiene entrenar modelos de IA grandes?", a: "Consume mucha energía y agua", d: ["Ninguno, no usa electricidad", "Ayuda a crecer a las plantas", "Enfría el planeta de inmediato"] },
];

const LLM_ADV: ChoiceItem[] = [
  { p: "¿Qué es el ajuste fino (fine-tuning) de un modelo?", a: "Entrenarlo más con datos de una tarea", d: ["Borrar el modelo y empezar todo desde cero", "Cambiar el nombre del modelo en la página", "Subir el volumen del asistente de voz"] },
  { p: "¿Qué es la «ventana de contexto» de un LLM?", a: "Cuánto texto puede considerar a la vez", d: ["La ventana de la sala donde están los servidores", "El tamaño de la pantalla del celular del usuario", "El tiempo que tarda en responder"] },
  { p: "¿Qué hace la técnica RAG (generación aumentada con búsqueda)?", a: "Busca documentos y los usa para responder", d: ["Inventa respuestas sin leer ningún documento", "Borra la memoria del modelo cada día", "Traduce todo al inglés antes de responder"] },
  { p: "¿Por qué un modelo puede tener sesgos?", a: "Aprende de datos que contienen sesgos", d: ["Porque las computadoras tienen sus propias opiniones", "Porque se entrena sin datos", "Porque solo funciona de noche y se cansa"] },
  { p: "¿Qué es la «temperatura» al generar texto?", a: "Cuánta variedad hay en las respuestas", d: ["Lo caliente que está el procesador del servidor", "La hora del día en el servidor", "El clima de la ciudad donde vive el usuario"] },
];

const ROWS: Row[] = [
  ["A.1", "Pilas, colas, árboles y grafos", (r) => classify(r, STRUCTS, STRUCT_WORDS)],
  ["A.2", "Camino más corto (Dijkstra)", S.shortestPath],
  ["A.3", "Grafos y árboles", (r) => quiz(r, "", GRAPHS)],
  ["A.4", "Recorrido en anchura (BFS)", (r) => X.bfsOrder(r, [0])],
  ["A.5", "Recorrido en profundidad (DFS)", (r) => X.bfsOrder(r, [1])],
  ["A.6", "Árbol binario: preorden y altura", (r) => X.bstTree(r, [0, 1])],

  ["B.1", "Programación dinámica: monedas", (r) => X.coinChange(r, [1])],
  ["B.2", "Llamadas de la recursión", X.fibCalls],
  ["B.3", "Tablas hash con colisiones", (r) => X.hashIndex(r, [1])],
  ["B.4", "Problemas difíciles y backtracking", (r) => quiz(r, "", ALGO_ADV)],
  ["B.5", "Heurísticas", (r) => quiz(r, "", HEURISTICS)],
  ["B.6", "Elegir el algoritmo adecuado", (r) => quiz(r, "", SORT_CHOICE)],

  ["C.1", "JOIN entre tablas", X.sqlJoin],
  ["C.2", "GROUP BY y ORDER BY", X.sqlGroupBy],
  ["C.3", "UPDATE y consultas", X.sqlUpdate],
  ["C.4", "Las «V» del big data", (r) => classify(r, BIG_DATA, BIG_WORDS)],
  ["C.5", "Bases de datos NoSQL", (r) => quiz(r, "", NOSQL)],
  ["C.6", "Seguridad de las bases de datos", (r) => quiz(r, "", DB_SECURITY)],

  ["D.1", "Metodologías ágiles y pruebas", (r) => quiz(r, "", SCRUM)],
  ["D.2", "Requisitos funcionales y no funcionales", (r) => classify(r, REQUIREMENTS, REQ_WORDS)],
  ["D.3", "Programación segura", (r) => quiz(r, "", SECURE_CODE)],
  ["D.4", "Cascada o ágil", (r) => classify(r, SDLC_MODELS, SDLC_WORDS)],
  ["D.5", "DevOps: integración y despliegue continuo", (r) => quiz(r, "", DEVOPS)],
  ["D.6", "Pruebas automáticas de árboles", (r) => X.bstTree(r, [2])],

  ["E.1", "RSA de juguete: cifrar", (r) => X.rsaToy(r, [0])],
  ["E.2", "RSA de juguete: descifrar", (r) => X.rsaToy(r, [1])],
  ["E.3", "Cifrado XOR", X.xorBits],
  ["E.4", "Criptografía moderna", (r) => quiz(r, "", CRYPTO_THEORY)],
  ["E.5", "Hacking ético y respuesta a incidentes", (r) => orderQuiz(r, "", PENTEST)],
  ["E.6", "Ataques avanzados", (r) => quiz(r, "", ATTACKS_ADV)],

  ["F.1", "Tablas de rutas", X.routing],
  ["F.2", "Subredes y máscaras", X.subnetHosts],
  ["F.3", "Tiempo de transferencia", S.transferTime],
  ["F.4", "Sistemas distribuidos", (r) => quiz(r, "", DISTRIBUTED)],
  ["F.5", "Blockchain", (r) => quiz(r, "", BLOCKCHAIN)],
  ["F.6", "Modelos OSI y TCP/IP", (r) => orderQuiz(r, "", OSI)],

  ["G.1", "Autómatas finitos: estado final", (r) => X.automaton(r, [0])],
  ["G.2", "Autómatas finitos: ¿acepta la cadena?", (r) => X.automaton(r, [1])],
  ["G.3", "Máquinas de Turing y el problema de la parada", (r) => quiz(r, "", TURING)],
  ["G.4", "P vs NP", (r) => quiz(r, "", PNP)],
  ["G.5", "Lógica con 3 variables", X.truthTable3],
  ["G.6", "Expresiones regulares", (r) => quiz(r, "", REGEX)],

  ["H.1", "Datos personales, derechos de autor y leyes", (r) => quiz(r, "", LAW)],
  ["H.2", "Tecnología y sociedad", (r) => quiz(r, "", SOCIETY)],
  ["H.3", "Gobierno digital", (r) => quiz(r, "", DIGITAL_GOV)],
  ["H.4", "El futuro del trabajo", (r) => quiz(r, "", FUTURE_WORK)],

  ["I.1", "Startups y propuesta de valor", (r) => quiz(r, "", STARTUP)],
  ["I.2", "Pitch, lean startup y proyecto final", (r) => orderQuiz(r, "", PITCH)],
  ["I.3", "Modelos de ingresos", (r) => classify(r, REVENUE, REVENUE_WORDS)],
  ["I.4", "Métricas de un producto digital", (r) => quiz(r, "", METRICS)],
  ["I.5", "Tecnología con impacto social", (r) => quiz(r, "", IMPACT)],
  ["I.6", "Simular el crecimiento de usuarios", (r) => S.simulation(r, [0])],

  ["J.1", "Recursión: suma y factorial", (r) => P.pyRecursion(r, [0, 1])],
  ["J.2", "Recursión: Fibonacci y potencias", (r) => P.pyRecursion(r, [2, 3])],
  ["J.3", "Clases: una cuenta bancaria", (r) => P.pyClasses(r, [0])],
  ["J.4", "Objetos y polimorfismo", (r) => P.pyClasses(r, [1, 2])],
  ["J.5", "sorted con key y reverse", (r) => P.pySorting(r, [0, 1])],
  ["J.6", "lambda, filter y map", (r) => (r.chance(0.5) ? P.pySorting(r, [2, 3]) : P2.pyMapLambda(r))],
  ["J.7", "Pilas y colas con listas", P.pyStackQueue],
  ["J.8", "Búsqueda binaria en Python", P.pyBinarySearch],
  ["J.9", "Recursión con listas", P2.pyRecursionList],
  ["J.10", "__str__, atributos de clase y super()", P2.pyClasses2],
  ["J.11", "*args, **kwargs, generadores y clausuras", P2.pyAdvancedFns],
  ["J.12", "Leer y escribir archivos", P2.pyFiles],

  ["K.1", "Recursión: árboles fractales", (r) => S.scratchRecursion(r, 2)],
  ["K.2", "Bucles anidados", S.scratchNested],
  ["K.3", "Recorrer listas con condiciones", S.scratchListSum],
  ["K.4", "Clones", X.scratchClones],
  ["K.5", "Enviar y esperar mensajes", X.scratchBroadcast],
  ["K.6", "Simular la gravedad", S.scratchGravity],

  ["L.1", "k vecinos más cercanos (k = 3)", (r) => S.knn(r, 3)],
  ["L.2", "La neurona artificial", S.perceptron],
  ["L.3", "Métricas de un modelo", S.modelMetrics],
  ["L.4", "Ética, sesgo y regulación de la IA", (r) => quiz(r, "", AI_ETHICS)],
  ["L.5", "k-medias", X.kmeansStep],
  ["L.6", "Descenso del gradiente", X.gradientStep],
  ["L.7", "Matriz de confusión", X.confusion],
  ["L.8", "Modelos de lenguaje por dentro", (r) => quiz(r, "", LLM_ADV)],
];

export const COMPUTACION_S5 = secundaria(SECTIONS, ROWS);
