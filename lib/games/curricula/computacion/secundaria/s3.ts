import * as A from "../../../generators/compu/advanced";
import * as P from "../../../generators/compu/python";
import * as P2 from "../../../generators/compu/python2";
import * as S from "../../../generators/compu/secondary";
import * as X from "../../../generators/compu/secondary2";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "../shared";
import { secundaria } from "./common";

// Computación · 3.° de Secundaria. Ordenamiento y búsqueda, bases de datos y
// SQL, representación avanzada (complemento a 2, UTF-8), redes y protocolos,
// detección de errores, ciberseguridad, desarrollo web, datos y
// visualización, sistemas operativos y procesos, robótica e IoT, proyecto de
// software, historia y sociedad de la computación, Python con textos, listas
// y funciones, Scratch, software e IA (k vecinos, métricas, k-medias).

const SECTIONS: Section[] = [
  { id: "A", name: "Ordenamiento y búsqueda", icon: "🔍" },
  { id: "B", name: "Bases de datos y SQL", icon: "🗃️" },
  { id: "C", name: "Representación avanzada de datos", icon: "🔢" },
  { id: "D", name: "Redes y protocolos", icon: "🌐" },
  { id: "E", name: "Detección de errores", icon: "✅" },
  { id: "F", name: "Ciberseguridad", icon: "🛡️" },
  { id: "G", name: "Desarrollo web", icon: "🕸️" },
  { id: "H", name: "Datos y visualización", icon: "📈" },
  { id: "I", name: "Sistemas operativos y procesos", icon: "⚙️" },
  { id: "J", name: "Robótica e IoT", icon: "🤖" },
  { id: "K", name: "Proyecto de software", icon: "🧭" },
  { id: "L", name: "Historia y sociedad de la computación", icon: "🏛️" },
  { id: "M", name: "Python: textos, listas y funciones", icon: "🐍" },
  { id: "N", name: "Scratch", icon: "🐱" },
  { id: "O", name: "Programación y software", icon: "💻" },
  { id: "P", name: "Inteligencia artificial", icon: "🧠" },
];

type Facts = [string, string][];
const words = (ask: string, all: (c: string) => string, statement: (t: string, c: string) => string) => ({ ask, all, statement });

// --- A. Ordenamiento y búsqueda ---------------------------------------------

const SORT_COMPARE: ChoiceItem[] = [
  { p: "¿Qué algoritmo compara pares vecinos y los intercambia si están desordenados?", a: "Burbuja", d: ["Inserción", "Selección", "Búsqueda binaria"] },
  { p: "¿Qué algoritmo toma cada elemento y lo mete en su lugar en la parte ya ordenada?", a: "Inserción", d: ["Burbuja", "Selección", "Búsqueda lineal"] },
  { p: "¿Qué algoritmo busca el menor de los que faltan y lo pone al inicio?", a: "Selección", d: ["Inserción", "Burbuja", "Búsqueda binaria"] },
  { p: "En el peor caso, ¿cuántas comparaciones hace una búsqueda binaria en 1 000 datos?", a: "Unas 10", d: ["Unas 500", "Unas 1 000", "Unas 100"] },
  { p: "¿Cuándo conviene la búsqueda lineal?", a: "Si la lista es corta o no está ordenada", d: ["Si la lista es enorme y ya está ordenada", "Solo si los datos son números enteros", "Nunca: siempre es la peor opción"] },
  { p: "La burbuja con una lista ya ordenada y la mejora «si no hubo cambios, parar»: ¿cuántas pasadas hace?", a: "1", d: ["0", "2", "n"] },
];

const ALGO_EFFICIENCY: ChoiceItem[] = [
  { p: "Con una lista casi ordenada, ¿qué algoritmo simple suele ser más rápido?", a: "Inserción", d: ["Selección", "Burbuja sin mejora", "Búsqueda lineal"] },
  { p: "¿Por qué ordenar una vez una lista que se consultará muchas veces?", a: "Luego cada búsqueda binaria es rápida", d: ["Porque ordenar no cuesta nada de tiempo", "Porque así la lista ocupa menos memoria", "Porque las listas desordenadas se borran"] },
  { p: "Merge sort divide la lista en mitades y luego las…", a: "Une ordenadamente", d: ["Borra por completo", "Copia sin cambios", "Desordena al azar"] },
  { p: "¿Qué hace más lento al ordenamiento burbuja con listas grandes?", a: "Compara casi todos los pares", d: ["Usa demasiados colores", "Solo funciona con texto", "Necesita internet"] },
  { p: "Buscar en un diccionario abriéndolo por la mitad se parece a…", a: "La búsqueda binaria", d: ["La búsqueda lineal", "El ordenamiento burbuja", "El cifrado César"] },
];

// --- B. Bases de datos ------------------------------------------------------

const DB_KEYS: ChoiceItem[] = [
  { p: "¿Qué es la clave primaria de una tabla?", a: "Un campo que identifica cada fila sin repetirse", d: ["La contraseña para abrir la base de datos", "La primera columna, aunque se repita", "El campo con los números más grandes"] },
  { p: "¿Qué campo sirve mejor como clave primaria de «alumnos»?", a: "Código de alumno", d: ["Nombre", "Fecha de nacimiento", "Grado y sección"] },
  { p: "¿Qué es una clave foránea?", a: "Un campo que apunta a la clave de otra tabla", d: ["Una clave escrita en otro idioma", "Una contraseña que viene del extranjero", "Una columna que no tiene ningún dato"] },
  { p: "¿Por qué no repetir el nombre del profesor en cada fila de «cursos»?", a: "Para evitar datos repetidos y errores", d: ["Porque los nombres ocupan mucha pantalla", "Porque SQL no acepta nombres de personas", "Para que la tabla tenga más columnas"] },
  { p: "¿Qué hace la cláusula WHERE en SQL?", a: "Filtra las filas que cumplen una condición", d: ["Ordena las filas de mayor a menor", "Borra la tabla completa de la base", "Cambia el nombre de las columnas"] },
];

const SQL_CLAUSES: Facts = [
  ["SELECT nombre, nota", "Elegir columnas"], ["SELECT *", "Elegir columnas"],
  ["WHERE nota >= 11", "Filtrar filas"], ["WHERE grado = 3", "Filtrar filas"],
  ["ORDER BY nota DESC", "Ordenar"], ["ORDER BY nombre", "Ordenar"],
  ["COUNT(*)", "Calcular un resumen"], ["AVG(nota)", "Calcular un resumen"], ["MAX(nota)", "Calcular un resumen"],
];
const SQL_WORDS = words("¿Qué hace esta parte de la consulta SQL?", (c) => `Selecciona las partes que sirven para: ${c.toLowerCase()}.`, (t, c) => `«${t}» sirve para ${c.toLowerCase()}.`);

// --- C. Representación avanzada -----------------------------------------------

const FLOATS: ChoiceItem[] = [
  { p: "En Python, ¿por qué 0.1 + 0.2 da 0.30000000000000004?", a: "El binario guarda esos decimales de forma aproximada", d: ["Python tiene un error grave que nadie ha corregido", "La computadora suma mal cuando lleva horas prendida", "Porque 0.1 y 0.2 se guardan como números negativos"] },
  { p: "¿Qué partes tiene un número en punto flotante?", a: "Signo, exponente y mantisa", d: ["Solo la parte entera", "Color, tamaño y forma de cada cifra", "Nombre, tipo y valor de la variable"] },
  { p: "¿Por qué no conviene comparar decimales con == en un programa?", a: "Pueden tener pequeños errores de redondeo", d: ["Porque == solo sirve con textos", "Porque los decimales nunca se pueden comparar", "Porque == borra los decimales de la variable"] },
  { p: "¿Qué es el desbordamiento (overflow)?", a: "Un resultado que no cabe en los bits", d: ["Un archivo que se abrió dos veces seguidas", "Agua que se derrama sobre el teclado de la PC", "Un número con muchos decimales"] },
  { p: "Con 8 bits sin signo, ¿qué pasa al sumar 200 + 100?", a: "Desborda: no cabe en 8 bits", d: ["Da 300 sin ningún problema", "Da exactamente 0 siempre", "Se vuelve negativo y se borra"] },
];

const UNICODE: ChoiceItem[] = [
  { p: "¿Por qué se creó Unicode si ya existía ASCII?", a: "ASCII no tenía ñ, tildes ni otros alfabetos", d: ["ASCII ocupaba demasiados bytes por letra", "Unicode es más antiguo que ASCII", "ASCII solo servía para los números"] },
  { p: "¿Cuántos caracteres distintos tiene el ASCII original de 7 bits?", a: "128", d: ["256", "26", "1 000"] },
  { p: "¿Qué es UTF-8?", a: "Una forma de guardar Unicode con 1 a 4 bytes", d: ["Un tipo de letra muy usado en Word", "Un virus que cambia los caracteres", "Un formato para guardar fotos"] },
  { p: "Un texto aparece como «AÃ±o» en vez de «Año». ¿Qué pasó?", a: "Se leyó con una codificación equivocada", d: ["El archivo tiene un virus peligroso", "Alguien escribió mal la palabra", "La pantalla está rota"] },
  { p: "¿Por qué los emojis ocupan más bytes que las letras en UTF-8?", a: "Tienen códigos Unicode más grandes", d: ["Porque tienen colores", "Porque son imágenes JPG", "Porque se ven más grandes"] },
];

// --- D. Redes -------------------------------------------------------------------

const TCP_IP: Facts = [
  ["HTTP / HTTPS", "Aplicación"], ["SMTP (correo)", "Aplicación"], ["DNS", "Aplicación"],
  ["TCP: entrega ordenada y sin pérdidas", "Transporte"], ["UDP: rápido, sin confirmar entrega", "Transporte"],
  ["IP: direcciones y rutas", "Internet (red)"], ["Router que elige el camino", "Internet (red)"],
  ["Wi-Fi", "Enlace (acceso a la red)"], ["Cable Ethernet", "Enlace (acceso a la red)"],
];
const TCP_WORDS = words("¿A qué capa del modelo TCP/IP pertenece?", (c) => `Selecciona lo que pertenece a la capa: ${c}.`, (t, c) => `${t}: capa ${c}.`);

const NET_DEVICES: ChoiceItem[] = [
  { p: "¿Qué dispositivo une las computadoras de una misma red local?", a: "Switch", d: ["Monitor", "Escáner", "Proyector"] },
  { p: "¿Qué identifica de forma única a la tarjeta de red de un equipo?", a: "La dirección MAC", d: ["El nombre del usuario", "La clave del Wi-Fi", "El tamaño del disco"] },
  { p: "¿Qué hace un firewall?", a: "Filtra el tráfico que entra y sale", d: ["Enfría el procesador de la PC", "Aumenta la velocidad del Wi-Fi", "Guarda copias de las páginas"] },
  { p: "Una videollamada usa UDP en vez de TCP. ¿Por qué?", a: "Prefiere rapidez aunque se pierda algún dato", d: ["Porque UDP cifra mejor la información", "Porque TCP no funciona con imágenes", "Porque UDP siempre entrega todo en orden"] },
  { p: "¿Qué hace el protocolo DHCP?", a: "Da una dirección IP a cada equipo", d: ["Traduce nombres de páginas web", "Envía y recibe correos", "Comprime los archivos"] },
  { p: "¿Por qué se creó IPv6?", a: "Se acababan las direcciones IPv4", d: ["IPv4 era demasiado rápido", "Para que el Wi-Fi tenga más alcance", "Para eliminar los routers"] },
];

const DNS_ORDER: OrderItem[] = [
  { p: "Resolución DNS de www.ejemplo.pe:", seq: ["El navegador revisa su caché", "Pregunta al servidor DNS del proveedor", "Se consulta al servidor de «.pe»", "Se obtiene la IP del sitio", "El navegador se conecta a esa IP"] },
  { p: "Conexión TCP (saludo de tres pasos):", seq: ["El cliente envía SYN", "El servidor responde SYN-ACK", "El cliente envía ACK", "Empiezan a enviarse datos"] },
  { p: "Enviar un correo electrónico:", seq: ["Escribes y presionas Enviar", "Tu cliente lo entrega por SMTP", "El servidor lo reenvía al del destinatario", "El destinatario lo descarga por IMAP"] },
];

const PORTS: ChoiceItem[] = [
  { p: "¿Qué puerto usa normalmente HTTPS?", a: "443", d: ["80", "25", "22"] },
  { p: "¿Qué puerto usa normalmente HTTP?", a: "80", d: ["443", "53", "21"] },
  { p: "¿Qué servicio usa normalmente el puerto 53?", a: "DNS", d: ["FTP", "SSH", "SMTP"] },
  { p: "¿Qué servicio usa el puerto 22 para administrar servidores a distancia?", a: "SSH", d: ["DNS", "HTTP", "SMTP"] },
  { p: "¿Qué servicio usa normalmente el puerto 25?", a: "SMTP", d: ["SSH", "HTTPS", "DHCP"] },
  { p: "¿Para qué sirven los puertos en una red?", a: "Para saber a qué programa va cada dato", d: ["Para conectar los cables a la pared", "Para medir la velocidad del Wi-Fi", "Para cifrar las contraseñas"] },
];

// --- E. Detección de errores ----------------------------------------------------

const ERROR_DETECT: ChoiceItem[] = [
  { p: "¿Qué detecta un bit de paridad?", a: "Que un bit cambió durante el envío", d: ["Quién envió el mensaje original", "Cuántas veces se leyó el mensaje", "Si el mensaje tiene virus"] },
  { p: "¿Puede la paridad detectar dos bits cambiados a la vez?", a: "No, la paridad sigue igual", d: ["Sí, siempre los detecta", "Sí, y además los corrige", "Solo si son ceros"] },
  { p: "¿Para qué sirve el dígito de control de un DNI o un ISBN?", a: "Para detectar errores al escribirlo", d: ["Para saber la edad de la persona", "Para ordenar los libros por color", "Para cifrar el número completo"] },
  { p: "¿Qué hace un checksum (suma de verificación)?", a: "Compara una suma calculada antes y después", d: ["Cuenta las palabras de un documento", "Borra los archivos que tienen errores", "Elige la ruta más corta de la red"] },
  { p: "Si el receptor detecta un error, ¿qué hace la técnica ARQ?", a: "Pide que se reenvíe el paquete", d: ["Borra todo el archivo recibido", "Cambia la clave del Wi-Fi", "Apaga el router por un minuto"] },
];

const DETECT_CORRECT: ChoiceItem[] = [
  { p: "¿Qué diferencia hay entre detectar y corregir errores?", a: "Corregir también arregla el dato dañado", d: ["Son exactamente lo mismo con otro nombre", "Detectar siempre es más lento que corregir", "Corregir no necesita ningún bit adicional"] },
  { p: "El código de Hamming puede…", a: "Encontrar y corregir un bit equivocado", d: ["Comprimir archivos de video muy pesados", "Cifrar mensajes secretos con una clave", "Ordenar listas de números de mayor a menor"] },
  { p: "¿Por qué los códigos QR siguen funcionando aunque estén algo dañados?", a: "Tienen datos extra para corregir errores", d: ["Porque la cámara se imagina lo que falta", "Porque solo usan los colores negro y blanco", "Porque se leen siempre a través de internet"] },
  { p: "Un mensaje llega con error y no se puede reenviar (por ejemplo, desde una sonda espacial). ¿Qué conviene?", a: "Usar un código que corrija errores", d: ["Usar solo un bit de paridad simple", "Enviar el mensaje sin ninguna protección", "Apagar la antena hasta que se arregle"] },
  { p: "¿Qué cuesta agregar bits de corrección?", a: "El mensaje ocupa un poco más", d: ["El mensaje se borra al llegar", "La red se apaga por completo", "Nada, no tiene ningún costo extra"] },
];

// --- F. Ciberseguridad ------------------------------------------------------------

const SOCIAL_ENG: Facts = [
  ["Un correo falso que imita a tu banco", "Phishing"], ["Un SMS con un enlace para «reclamar un premio»", "Phishing"],
  ["Alguien llama diciendo ser de soporte técnico y pide tu clave", "Pretexto (suplantación)"], ["Un «inspector» falso pide entrar a la sala de servidores", "Pretexto (suplantación)"],
  ["Dejar una memoria USB infectada en el patio para que alguien la conecte", "Cebo"], ["Ofrecer una película gratis que trae un virus", "Cebo"],
  ["Mirar por encima del hombro cómo escribes tu clave", "Espiar (shoulder surfing)"], ["Grabar con el celular la pantalla del cajero", "Espiar (shoulder surfing)"],
];
const SOCIAL_WORDS = words("¿Qué técnica de ingeniería social es?", (c) => `Selecciona los casos de: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const VPN_FIREWALL: ChoiceItem[] = [
  { p: "¿Qué hace una VPN?", a: "Crea un túnel cifrado para tu conexión", d: ["Hace que la batería dure el doble", "Elimina todos los virus del celular", "Aumenta la memoria de la computadora"] },
  { p: "¿Qué hace un firewall?", a: "Decide qué tráfico de red pasa y cuál no", d: ["Apaga incendios dentro de la computadora", "Acelera los videojuegos en línea", "Guarda copias de seguridad en la nube"] },
  { p: "¿Qué es un parche de seguridad?", a: "Una actualización que corrige una falla", d: ["Un sticker que se pega en la laptop", "Un virus que se instala de noche", "Una contraseña de un solo uso"] },
  { p: "¿Qué es una copia de seguridad 3-2-1?", a: "3 copias, en 2 medios, 1 fuera de casa", d: ["3 contraseñas para 2 cuentas y 1 correo", "3 antivirus en 2 computadoras y 1 celular", "3 discos rotos, 2 sanos y 1 perdido"] },
  { p: "¿Qué es una vulnerabilidad de día cero?", a: "Una falla que aún no tiene parche", d: ["Un virus que se borra a medianoche", "Un error que ocurre el primer día del año", "Una contraseña que dura un solo día"] },
];

const PW_STRENGTH: Facts = [
  ["123456", "Débil"], ["password", "Débil"], ["Lima2025", "Débil"], ["qwerty", "Débil"], ["ana2009", "Débil"],
  ["Gato.Azul-Come!Pan77", "Fuerte"], ["t7#Kp!2vQ9&mZ", "Fuerte"], ["Mi-Perro-Ladra-A-Las-3", "Fuerte"], ["R10.Rimac;Sube%Lento", "Fuerte"],
];
const PW_WORDS = words("¿Esta contraseña es débil o fuerte?", (c) => `Selecciona las contraseñas de tipo: ${c.toLowerCase()}.`, (t, c) => `«${t}» es una contraseña ${c.toLowerCase()}.`);

const INCIDENT: OrderItem[] = [
  { p: "Crees que alguien entró a tu cuenta:", seq: ["Cambiar la contraseña desde un equipo seguro", "Cerrar las sesiones abiertas", "Activar la verificación en dos pasos", "Revisar la actividad reciente", "Avisar a tus contactos si enviaron algo"] },
  { p: "Tu computadora tiene ransomware:", seq: ["Desconectarla de la red", "Avisar al responsable de sistemas", "No pagar el rescate", "Restaurar desde una copia de seguridad"] },
  { p: "Perdiste tu celular:", seq: ["Localizarlo o bloquearlo a distancia", "Cambiar las contraseñas importantes", "Avisar a tu operador", "Borrar los datos a distancia si no aparece"] },
];

const AUTH_FACTORS: Facts = [
  ["Contraseña", "Algo que sabes"], ["PIN de 4 dígitos", "Algo que sabes"], ["Respuesta a una pregunta secreta", "Algo que sabes"],
  ["Código que llega al celular", "Algo que tienes"], ["Llave de seguridad USB", "Algo que tienes"], ["Tarjeta del banco", "Algo que tienes"],
  ["Huella digital", "Algo que eres"], ["Reconocimiento facial", "Algo que eres"], ["Lectura del iris", "Algo que eres"],
];
const AUTH_WORDS = words("¿Qué factor de autenticación es?", (c) => `Selecciona los factores de tipo: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

// --- G. Desarrollo web ------------------------------------------------------------

const HTML_TAGS: Facts = [
  ["<h1>", "Estructura del texto"], ["<p>", "Estructura del texto"], ["<ul>", "Estructura del texto"],
  ["<img>", "Contenido multimedia"], ["<video>", "Contenido multimedia"], ["<audio>", "Contenido multimedia"],
  ["<form>", "Formularios"], ["<input>", "Formularios"], ["<button>", "Formularios"],
  ["<a>", "Enlaces"],
];
const HTML_WORDS = words("¿Para qué se usa esta etiqueta HTML?", (c) => `Selecciona las etiquetas de: ${c.toLowerCase()}.`, (t, c) => `${t} se usa para: ${c.toLowerCase()}.`);

const WEB_ROLES: ChoiceItem[] = [
  { p: "En una página web, ¿qué hace el HTML?", a: "Define la estructura y el contenido", d: ["Define los colores y la tipografía", "Hace los cálculos y la interacción", "Guarda los datos en el servidor"] },
  { p: "¿Qué hace el CSS?", a: "Define el aspecto: colores, tamaños, posición", d: ["Define el contenido de los títulos", "Guarda las contraseñas de usuarios", "Traduce la página a otros idiomas"] },
  { p: "¿Qué hace el JavaScript en el navegador?", a: "Da interacción y lógica a la página", d: ["Dibuja los píxeles del monitor", "Conecta los cables de la red", "Imprime la página automáticamente"] },
  { p: "¿Qué es el diseño web adaptable (responsive)?", a: "Que la página se ajuste a cada pantalla", d: ["Que la página responda los correos", "Que la página tenga muchos colores", "Que la página cargue sin internet"] },
  { p: "¿Qué hace el atributo alt de una imagen?", a: "Describe la imagen para lectores de pantalla", d: ["Cambia el tamaño de la imagen", "Pone un borde alrededor de la imagen", "Hace que la imagen se mueva sola"] },
];

const HTTP_STATUS: Facts = [
  ["200 OK", "Éxito (2xx)"], ["201 Created", "Éxito (2xx)"],
  ["301 Moved Permanently", "Redirección (3xx)"], ["302 Found", "Redirección (3xx)"],
  ["404 Not Found", "Error del cliente (4xx)"], ["403 Forbidden", "Error del cliente (4xx)"], ["401 Unauthorized", "Error del cliente (4xx)"],
  ["500 Internal Server Error", "Error del servidor (5xx)"], ["503 Service Unavailable", "Error del servidor (5xx)"],
];
const STATUS_WORDS = words("¿Qué tipo de respuesta HTTP es este código?", (c) => `Selecciona los códigos de tipo: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

const HTML_ORDER: OrderItem[] = [
  { p: "Ordena la estructura básica de una página.", seq: ["<!DOCTYPE html>", "<html>", "<head>…</head>", "<body>…</body>", "</html>"], mono: true },
  { p: "Ordena el formulario.", seq: ["<form>", '<label>Nombre</label>', '<input type="text">', "<button>Enviar</button>", "</form>"], mono: true },
  { p: "Ordena la regla CSS.", seq: ["h1 {", "  color: blue;", "  font-size: 24px;", "}"], mono: true },
];

// --- H. Datos y visualización -----------------------------------------------------

const DATA_VIZ: ChoiceItem[] = [
  { p: "¿Qué muestra un histograma?", a: "Cuántos datos caen en cada intervalo", d: ["La historia completa de una empresa", "El orden alfabético de todos los datos", "Una sola cifra que resume los datos"] },
  { p: "¿Qué muestra un diagrama de caja (boxplot)?", a: "Mediana, cuartiles y valores extremos", d: ["Solo el promedio de todos los datos", "La cantidad de colores usados en él", "Las fechas exactas de cada medición"] },
  { p: "¿Qué es un mapa de calor?", a: "Colores que muestran valores altos y bajos", d: ["Un mapa del clima de la ciudad de hoy", "Un dibujo hecho con témperas y pinceles", "Una foto infrarroja de la computadora"] },
  { p: "¿Por qué el eje de un gráfico debe tener título y unidades?", a: "Para entender qué se mide y en qué escala", d: ["Para que el gráfico tenga muchos más colores", "Porque así el archivo pesa bastante menos", "Para ocultar los datos más importantes"] },
  { p: "Dos variables suben juntas. ¿Eso prueba que una causa la otra?", a: "No, correlación no es causalidad", d: ["Sí, siempre lo prueba sin duda", "Solo si las dos suben muy rápido", "Sí, cuando hay muchos datos juntos"] },
];

const SAMPLING: ChoiceItem[] = [
  { p: "En estadística, ¿qué es una muestra?", a: "Una parte de la población que se estudia", d: ["Toda la población, sin excepción", "Un regalo que dan en las tiendas", "Un error en los datos recogidos"] },
  { p: "Para saber qué deporte prefieren los alumnos del colegio, ¿qué muestra es mejor?", a: "Alumnos al azar de todos los grados", d: ["Solo el equipo de fútbol del colegio", "Solo tus amigos más cercanos", "Solo los alumnos de primer grado"] },
  { p: "Una encuesta en línea solo la responden quienes tienen internet. ¿Qué problema hay?", a: "Sesgo de selección", d: ["Exceso de datos", "Falta de colores", "Error de ortografía"] },
  { p: "¿Por qué se usa una muestra y no toda la población?", a: "Es más rápido y barato", d: ["Siempre es más exacta", "La ley lo exige", "La población no existe"] },
  { p: "¿Qué pasa si la muestra es muy pequeña?", a: "Las conclusiones son menos fiables", d: ["Las conclusiones son perfectas", "Los datos se vuelven más grandes", "La encuesta dura más años"] },
];

const ANONYMIZE: ChoiceItem[] = [
  { p: "¿Qué es anonimizar datos?", a: "Quitar lo que identifica a cada persona", d: ["Borrar toda la base de datos del colegio", "Poner todos los nombres en mayúsculas", "Compartir los datos en las redes sociales"] },
  { p: "Publicas resultados de una encuesta del colegio. ¿Qué no debes mostrar?", a: "Los nombres de quienes respondieron", d: ["El promedio de todas las respuestas", "El número total de personas encuestadas", "El gráfico de barras con los resultados"] },
  { p: "¿Por qué el DNI y la dirección juntos son datos sensibles?", a: "Identifican a una persona exacta", d: ["Porque ocupan demasiados bytes", "Porque son números muy grandes", "Porque cambian de valor cada año"] },
  { p: "¿Qué es un dato agregado?", a: "Un resumen de muchos, como un promedio", d: ["Un dato que se agregó a la tabla por error", "El dato más grande de toda la tabla", "Un dato copiado de internet sin citar"] },
  { p: "Antes de usar datos de personas en un proyecto, ¿qué necesitas?", a: "Su consentimiento", d: ["Su contraseña", "Su foto de perfil", "Su número de tarjeta"] },
];

// --- I. Sistemas operativos -------------------------------------------------------

const PROCESS: ChoiceItem[] = [
  { p: "¿Qué es un proceso?", a: "Un programa que se está ejecutando", d: ["Un programa guardado en el disco", "Un cable conectado a la placa", "Un archivo de texto comprimido"] },
  { p: "¿Qué hace el planificador (scheduler) del sistema operativo?", a: "Decide qué proceso usa la CPU", d: ["Planifica tus tareas del colegio", "Ordena los archivos por fecha", "Elige el fondo de pantalla"] },
  { p: "¿Por qué parece que varios programas corren a la vez con una sola CPU?", a: "La CPU alterna entre ellos muy rápido", d: ["Porque cada programa trae su propia CPU", "Porque los programas no usan la CPU", "Porque la pantalla se divide en partes"] },
  { p: "En Round Robin, ¿qué es el quantum?", a: "El tiempo máximo de CPU por turno", d: ["El número de procesos en la cola", "La memoria total del equipo", "La velocidad del ventilador"] },
  { p: "¿Qué hace el Administrador de tareas?", a: "Muestra y cierra procesos", d: ["Crea tareas del colegio", "Escribe correos solo", "Formatea el disco duro"] },
];

const MEMORY_MGMT: ChoiceItem[] = [
  { p: "¿Qué es la memoria virtual?", a: "Usar parte del disco como si fuera RAM", d: ["Una memoria que solo existe en internet", "La memoria de los videojuegos en 3D", "Una RAM de juguete para practicar"] },
  { p: "¿Por qué la memoria virtual es más lenta que la RAM?", a: "El disco es más lento que la RAM", d: ["Porque usa menos electricidad", "Porque está guardada en otro país lejano", "Porque no tiene bits, solo letras y signos"] },
  { p: "¿Qué hace el sistema operativo si un programa intenta leer la memoria de otro?", a: "Lo impide para proteger los datos", d: ["Se lo permite siempre sin preguntar", "Borra los dos programas a la vez", "Apaga la computadora de inmediato"] },
  { p: "¿Qué es una fuga de memoria?", a: "Memoria que se pide y no se libera", d: ["Una memoria USB perdida", "Agua que entra a la RAM por una ventana", "Una contraseña que se filtró en internet"] },
  { p: "¿Qué pasa cuando la RAM se llena?", a: "El equipo se vuelve lento", d: ["La pantalla se apaga", "El teclado deja de existir", "Se duplica la memoria sola"] },
];

const FILE_SYSTEMS: ChoiceItem[] = [
  { p: "¿Qué es un sistema de archivos (como NTFS o ext4)?", a: "La forma de organizar archivos en el disco", d: ["Una carpeta llamada «Sistema» en el escritorio", "Un programa para editar documentos de texto", "Un cable que conecta el disco con la placa"] },
  { p: "¿Qué pasa realmente al «eliminar» un archivo y vaciar la papelera?", a: "Se marca su espacio como libre", d: ["Se destruye el disco duro entero", "Se envía a otra computadora de la red", "Se imprime antes de borrarse del todo"] },
  { p: "¿Qué son los permisos de lectura, escritura y ejecución?", a: "Reglas de quién puede usar un archivo", d: ["Colores que tienen los archivos en pantalla", "Tamaños posibles que puede tener un archivo", "Nombres especiales que usa el sistema"] },
  { p: "¿Qué es una ruta absoluta?", a: "La ruta completa desde la raíz", d: ["Una ruta que nunca cambia de nombre", "La ruta más corta que encuentra el GPS", "Un archivo guardado sin extensión"] },
  { p: "¿Por qué no conviene apagar la PC desenchufándola?", a: "Puede dañar archivos que se estaban guardando", d: ["Porque la pantalla se pone de color azul", "Porque se borra el teclado de inmediato", "Porque gasta más electricidad que apagarla"] },
];

// --- J. Robótica e IoT --------------------------------------------------------------

const IOT_PROTOCOLS: ChoiceItem[] = [
  { p: "¿Qué tecnología inalámbrica usan los audífonos para conectarse al celular?", a: "Bluetooth", d: ["Ethernet", "Fibra óptica", "HDMI"] },
  { p: "¿Qué protocolo ligero usan muchos sensores IoT para enviar mensajes a un servidor?", a: "MQTT", d: ["HTML", "SMTP", "FTP"] },
  { p: "¿Qué ventaja tiene LoRa para sensores en el campo?", a: "Llega lejos con poca batería", d: ["Transmite videos en 4K", "No necesita ninguna antena", "Funciona solo con cable"] },
  { p: "¿Qué permite NFC, como al pagar acercando el celular?", a: "Comunicarse a muy corta distancia", d: ["Conectarse a satélites lejanos", "Cargar el celular sin batería", "Navegar más rápido por internet"] },
  { p: "En MQTT, ¿qué hace el «broker»?", a: "Recibe y reparte los mensajes", d: ["Mide la temperatura del aire", "Mueve los motores del robot", "Cifra las fotos del celular"] },
];

const SENSOR_DATA: ChoiceItem[] = [
  { p: "Un sensor da valores que saltan un poco aunque nada cambie. ¿Cómo se llama eso?", a: "Ruido", d: ["Brillo", "Sesgo", "Formato"] },
  { p: "¿Cómo se reduce el ruido de un sensor?", a: "Promediando varias lecturas", d: ["Leyendo el sensor una sola vez", "Pintando el sensor de negro", "Apagando el robot cada minuto"] },
  { p: "¿Qué es calibrar un sensor?", a: "Ajustarlo con valores conocidos", d: ["Pintarlo de un color nuevo y brillante", "Cambiarle la batería por una nueva", "Desconectarlo de la placa principal"] },
  { p: "Un sensor analógico entrega valores de 0 a 1023. ¿Cuántos bits usa el conversor?", a: "10", d: ["8", "16", "1023"] },
  { p: "¿Cada cuánto conviene leer un sensor de temperatura de una casa?", a: "Cada varios segundos o minutos", d: ["Un millón de veces por segundo", "Una sola vez al año, en verano", "Nunca, el valor se puede adivinar"] },
];

const MAZE: OrderItem[] = [
  { p: "Algoritmo de la mano derecha para salir de un laberinto:", seq: ["Si a la derecha está libre, girar a la derecha", "Si no, si adelante está libre, avanzar", "Si no, girar a la izquierda", "Repetir hasta encontrar la salida"] },
  { p: "Robot aspiradora:", seq: ["Avanzar en línea recta", "Detectar un obstáculo", "Girar un ángulo al azar", "Seguir limpiando", "Volver a la base si la batería está baja"] },
  { p: "Brazo robótico que clasifica objetos:", seq: ["La cámara toma una foto", "El programa reconoce el objeto", "El brazo lo levanta", "Lo deja en la caja correcta"] },
];

const COMMS: Facts = [
  ["Audífonos inalámbricos", "Bluetooth"], ["Reloj inteligente con el celular", "Bluetooth"],
  ["Cámara de seguridad de la casa", "Wi-Fi"], ["Televisor inteligente", "Wi-Fi"],
  ["Pagar acercando el celular", "NFC"], ["Tarjeta del metro", "NFC"],
  ["Sensores de un campo de cultivo a kilómetros", "LoRa"], ["Medidor de agua en zonas rurales", "LoRa"],
];
const COMMS_WORDS = words("¿Qué tecnología de comunicación conviene?", (c) => `Selecciona los casos que usan ${c}.`, (t, c) => `${t}: ${c}.`);

const AUTONOMOUS: ChoiceItem[] = [
  { p: "¿Qué sensores combina un auto autónomo?", a: "Cámaras, radar y LiDAR", d: ["Solo un micrófono en el techo", "Solo el velocímetro del tablero", "Ninguno, se guía solo con un mapa"] },
  { p: "Un dron de reparto pierde la señal GPS. ¿Qué es lo más seguro?", a: "Aterrizar o volver de forma segura", d: ["Seguir volando a ciegas hasta llegar", "Acelerar al máximo para salir rápido", "Apagar los motores en pleno vuelo"] },
  { p: "¿Quién es responsable si un robot autónomo causa un daño?", a: "Las personas que lo diseñan y operan", d: ["Nadie, porque es solo una máquina", "Solo el robot, que debe pagar la multa", "El cliente que lo miró pasar por la calle"] },
  { p: "¿Por qué los robots industriales tienen botón de parada de emergencia?", a: "Para detenerlos al instante si hay peligro", d: ["Para que se vean más modernos en las fotos", "Para cambiar la música de toda la fábrica", "Para encenderlos más rápido cada mañana"] },
  { p: "¿Qué tarea es ideal para un robot en una fábrica?", a: "Una tarea repetitiva o peligrosa", d: ["Consolar a una persona que está triste", "Inventar una canción original para el día", "Decidir las leyes de un país entero"] },
];

// --- K. Proyecto de software ------------------------------------------------------

const AGILE_INTRO: ChoiceItem[] = [
  { p: "¿Qué es un MVP (producto mínimo viable)?", a: "La versión más simple que ya es útil", d: ["El programador más valioso del equipo", "La versión final con todo terminado", "Un premio para la mejor aplicación"] },
  { p: "¿Por qué mostrar avances a los usuarios cada pocas semanas?", a: "Para corregir el rumbo a tiempo", d: ["Para que paguen antes de tiempo", "Para que el equipo descanse más", "Para no tener que probar el código"] },
  { p: "¿Qué es un tablero Kanban?", a: "Columnas «por hacer», «haciendo» y «hecho»", d: ["Un juego de mesa japonés muy antiguo", "Un teclado especial para programar", "Una pizarra para dibujar personajes"] },
  { p: "¿Qué es la retroalimentación (feedback) de usuarios?", a: "Lo que opinan al usar el producto", d: ["El ruido que hace la computadora", "Un tipo de virus informático", "El precio final del producto"] },
  { p: "¿Qué hace un equipo en la reunión diaria corta (daily)?", a: "Cuenta avances y obstáculos", d: ["Programa todo el proyecto", "Elige el color del logo", "Celebra el fin del proyecto"] },
];

const PROTOTYPE: Facts = [
  ["Bocetos en papel de las pantallas", "Baja fidelidad"], ["Rectángulos grises que muestran dónde va cada cosa", "Baja fidelidad"], ["Dibujos hechos a mano en la pizarra", "Baja fidelidad"],
  ["Diseño con colores, fotos y textos reales", "Alta fidelidad"], ["Pantallas interactivas que parecen la app final", "Alta fidelidad"], ["Mockup con el logo y la tipografía definitiva", "Alta fidelidad"],
];
const PROTO_WORDS = words("¿Es un prototipo de baja o de alta fidelidad?", (c) => `Selecciona los prototipos de ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const UX_TEST: ChoiceItem[] = [
  { p: "En una prueba con usuarios, ¿qué conviene hacer?", a: "Observar sin ayudarles", d: ["Decirles dónde hacer clic", "Usar la app por ellos", "Elegir solo a tus amigos"] },
  { p: "Cinco usuarios no encuentran el botón «Pagar». ¿Qué significa?", a: "Hay un problema de diseño", d: ["Los usuarios no saben usar celulares", "El botón funciona perfecto", "Hay que esconderlo mejor"] },
  { p: "¿Qué es una encuesta de satisfacción?", a: "Preguntas para saber si al usuario le gustó", d: ["Un examen que toma el profesor de cómputo", "Un formulario para pagar la aplicación", "Una lista de errores del programa"] },
  { p: "¿Para qué sirve una persona usuaria («persona») en diseño?", a: "Representar a un tipo de usuario real", d: ["Contratar a un actor para la app", "Elegir al jefe del proyecto", "Escribir el código más rápido"] },
  { p: "¿Qué mide la tasa de éxito de una tarea?", a: "Cuántos usuarios logran completarla", d: ["Cuántas líneas tiene el código", "Cuánto pesa la aplicación", "Cuántos colores usa el diseño"] },
];

const PROJECT_ORDER: OrderItem[] = [
  { p: "Proyecto: app para reservar la biblioteca.", seq: ["Entrevistar a alumnos y bibliotecaria", "Escribir los requisitos", "Hacer bocetos de las pantallas", "Programar la primera versión", "Probar con usuarios reales"] },
  { p: "Pensamiento de diseño (design thinking):", seq: ["Empatizar", "Definir el problema", "Idear soluciones", "Prototipar", "Evaluar"] },
  { p: "Publicar una nueva versión:", seq: ["Terminar los cambios", "Pasar las pruebas", "Escribir las notas de la versión", "Publicar", "Escuchar comentarios"] },
];

// --- L. Historia y sociedad -------------------------------------------------------

const TECH_HISTORY: OrderItem[] = [
  { p: "Ordena de lo más antiguo a lo más reciente:", seq: ["El ábaco", "La máquina analítica de Babbage", "La ENIAC", "La computadora personal", "El teléfono inteligente"] },
  { p: "Ordena de lo más antiguo a lo más reciente:", seq: ["Tarjetas perforadas", "Disquetes", "CD", "Memorias USB", "Almacenamiento en la nube"] },
  { p: "Ordena de lo más antiguo a lo más reciente:", seq: ["El telégrafo", "El teléfono", "Internet (ARPANET)", "La World Wide Web", "Las redes sociales"] },
];

const PIONEERS: ChoiceItem[] = [
  { p: "¿Quién escribió el primer algoritmo para una máquina, en el siglo XIX?", a: "Ada Lovelace", d: ["Grace Hopper", "Tim Berners-Lee", "Bill Gates"] },
  { p: "¿Quién propuso la «máquina de Turing», base teórica de la computación?", a: "Alan Turing", d: ["Charles Babbage", "Steve Jobs", "Ada Lovelace"] },
  { p: "¿Quién creó uno de los primeros compiladores y popularizó la palabra «bug»?", a: "Grace Hopper", d: ["Alan Turing", "Ada Lovelace", "Linus Torvalds"] },
  { p: "¿Quién inventó la World Wide Web en 1989?", a: "Tim Berners-Lee", d: ["Alan Turing", "Grace Hopper", "Charles Babbage"] },
  { p: "¿Quién diseñó la máquina analítica, antecesora de la computadora?", a: "Charles Babbage", d: ["Tim Berners-Lee", "Alan Turing", "Linus Torvalds"] },
  { p: "¿Quién creó el núcleo del sistema operativo Linux?", a: "Linus Torvalds", d: ["Charles Babbage", "Ada Lovelace", "Tim Berners-Lee"] },
];

const GREEN_IT: ChoiceItem[] = [
  { p: "¿Qué hacer con un celular viejo que ya no usas?", a: "Llevarlo a un punto de reciclaje electrónico", d: ["Botarlo a la basura común de la casa", "Quemarlo en el patio para que no ocupe", "Enterrarlo en el jardín del colegio"] },
  { p: "¿Por qué los centros de datos gastan tanta energía?", a: "Miles de servidores trabajan y se enfrían", d: ["Porque tienen muchas luces de colores", "Porque imprimen todos los correos", "Porque tienen televisores encendidos"] },
  { p: "¿Qué ayuda a reducir el consumo de energía en casa?", a: "Apagar los equipos que no usas", d: ["Dejar el cargador siempre enchufado", "Subir el brillo de todas las pantallas", "Tener la PC encendida toda la noche"] },
  { p: "¿Qué metales valiosos se recuperan al reciclar placas electrónicas?", a: "Oro, plata y cobre", d: ["Sal y azúcar", "Plástico y madera", "Arena y piedra"] },
  { p: "¿Qué es la obsolescencia programada?", a: "Diseñar productos para que duren poco", d: ["Programar la alarma del celular", "Actualizar una app cada semana", "Ordenar los programas por fecha"] },
];

const TECH_JOBS: Facts = [
  ["Crea apps para celulares", "Desarrollo de software"], ["Programa páginas web", "Desarrollo de software"],
  ["Protege a una empresa de ataques", "Ciberseguridad"], ["Busca fallas de seguridad con permiso (hacker ético)", "Ciberseguridad"],
  ["Analiza datos para tomar decisiones", "Ciencia de datos"], ["Entrena modelos de inteligencia artificial", "Ciencia de datos"],
  ["Diseña pantallas fáciles de usar", "Diseño UX/UI"], ["Hace pruebas con usuarios reales", "Diseño UX/UI"],
];
const JOBS_WORDS = words("¿A qué área tecnológica pertenece este trabajo?", (c) => `Selecciona los trabajos de: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const MOORE: ChoiceItem[] = [
  { p: "¿Qué dice la ley de Moore?", a: "Los transistores de un chip se duplican cada 2 años", d: ["Las computadoras se vuelven el doble de grandes cada año", "Internet duplica su precio para todos cada mes", "Los celulares pesan el doble cada diez años"] },
  { p: "¿Qué reemplazó a las válvulas de vacío en las computadoras?", a: "El transistor", d: ["El teclado mecánico", "El ratón óptico", "El monitor plano"] },
  { p: "¿Qué es un circuito integrado (chip)?", a: "Muchos transistores en una pieza pequeña", d: ["Un cable muy largo y enrollado varias veces", "Un programa de dibujo para hacer planos", "Una batería recargable de larga duración"] },
  { p: "¿Por qué hoy un celular es más potente que computadoras enormes de 1970?", a: "Sus chips tienen muchos más transistores", d: ["Porque los celulares usan muchos más cables", "Porque las pantallas táctiles calculan más", "Porque antes no existía la electricidad"] },
  { p: "¿Qué tamaño ocupaba la ENIAC (1945)?", a: "Una habitación entera", d: ["Un bolsillo del pantalón", "Una mochila del colegio", "Una mesa pequeña de noche"] },
];

// --- M. Python ----------------------------------------------------------------------

const PY_ORDER: OrderItem[] = [
  { p: "Ordena la función y su uso.", seq: ["def cuadrado(x):", "    return x * x", "print(cuadrado(4))"], mono: true },
  { p: "Ordena el programa: promedio de una lista.", seq: ["notas = [14, 16, 11]", "suma = sum(notas)", "prom = suma / len(notas)", "print(prom)"], mono: true },
  { p: "Ordena el programa: cuenta las vocales.", seq: ['texto = "computadora"', "c = 0", "for letra in texto:", '    if letra in "aeiou":', "        c += 1", "print(c)"], mono: true },
  { p: "Ordena el programa: busca el mayor.", seq: ["nums = [4, 9, 2]", "mayor = nums[0]", "for x in nums:", "    if x > mayor:", "        mayor = x", "print(mayor)"], mono: true },
  { p: "Ordena el programa: función que saluda.", seq: ["def saludo(nombre):", '    return "Hola, " + nombre', 'print(saludo("Ana"))'], mono: true },
];

// --- O. Programación y software ------------------------------------------------------

const LANGUAGES: ChoiceItem[] = [
  { p: "¿Qué hace un compilador?", a: "Traduce todo el programa antes de ejecutarlo", d: ["Ejecuta una línea a la vez mientras traduce", "Dibuja la interfaz gráfica del programa", "Busca virus dentro del código fuente"] },
  { p: "¿Qué hace un intérprete, como el de Python?", a: "Traduce y ejecuta línea por línea", d: ["Traduce todo a un archivo .exe primero", "Convierte el código en una imagen", "Envía el código a otra computadora"] },
  { p: "¿Qué lenguaje es de bajo nivel?", a: "Ensamblador", d: ["Python", "Scratch", "JavaScript"] },
  { p: "¿Qué ventaja tiene un lenguaje de alto nivel?", a: "Es más fácil de leer y escribir", d: ["Siempre es más rápido que el ensamblador", "No necesita ninguna traducción", "Solo funciona en un tipo de procesador"] },
  { p: "¿Qué es un IDE?", a: "Un programa para escribir y probar código", d: ["Un tipo de cable para la red local", "Un lenguaje para hacer páginas web", "Un virus que borra los programas"] },
];

const GIT: ChoiceItem[] = [
  { p: "¿Para qué sirve un sistema de control de versiones como Git?", a: "Guardar el historial de cambios del código", d: ["Hacer que el programa corra más rápido", "Traducir el código a otros idiomas", "Detectar virus en las computadoras"] },
  { p: "En Git, ¿qué es un commit?", a: "Una foto guardada de los cambios", d: ["Un error grave del programa", "Una copia del disco duro entero", "Un mensaje de chat al equipo"] },
  { p: "¿Para qué sirve crear una rama (branch)?", a: "Probar cambios sin dañar la versión principal", d: ["Borrar los archivos que ya no se usan", "Copiar el proyecto en una memoria USB", "Hacer que el código ocupe menos espacio"] },
  { p: "Un cambio rompió el programa. ¿Qué permite Git?", a: "Volver a una versión anterior", d: ["Culpar al compañero automáticamente", "Arreglar el error sin revisarlo", "Borrar el historial de cambios"] },
  { p: "¿Qué es GitHub?", a: "Un sitio para guardar y compartir repositorios", d: ["Un lenguaje de programación muy nuevo", "Un antivirus para los programadores", "Una red social solo para fotos"] },
];

const PARADIGMS: ChoiceItem[] = [
  { p: "Un programa hecho de instrucciones paso a paso es de estilo…", a: "Imperativo", d: ["Funcional puro", "Declarativo", "Aleatorio"] },
  { p: "Organizar el código en clases y objetos es programación…", a: "Orientada a objetos", d: ["Por bloques de colores", "Sin funciones", "Lineal sin variables"] },
  { p: "En SQL dices QUÉ datos quieres, no CÓMO buscarlos. Es un lenguaje…", a: "Declarativo", d: ["Imperativo", "Ensamblador", "Binario"] },
  { p: "Scratch reacciona a clics, teclas y mensajes. Es programación…", a: "Orientada a eventos", d: ["Sin ninguna lógica", "Solo con números", "En lenguaje máquina"] },
  { p: "Usar funciones que no cambian datos externos es estilo…", a: "Funcional", d: ["Desordenado", "Ensamblador", "Gráfico"] },
];

const CODE_QUALITY: ChoiceItem[] = [
  { p: "¿Qué significa el principio DRY («no te repitas»)?", a: "No copiar el mismo código muchas veces", d: ["No beber agua mientras estás programando", "No repetir nunca una prueba que ya pasó", "Usar una sola variable en todo el programa"] },
  { p: "¿Por qué dividir un programa largo en funciones?", a: "Es más fácil de leer, probar y reutilizar", d: ["Hace que el archivo pese muchísimo más", "Así nadie más puede entender el código", "Porque Python no acepta programas largos"] },
  { p: "¿Qué es refactorizar?", a: "Mejorar el código sin cambiar lo que hace", d: ["Agregar errores a propósito para probarlo", "Borrar todo el programa y escribirlo otra vez", "Cambiar de computadora para programar mejor"] },
  { p: "¿Qué es una revisión de código (code review)?", a: "Que otra persona revise tu código", d: ["Que el código se revise solo sin ayuda", "Imprimir el código en papel para guardarlo", "Borrar el código de otros sin preguntar"] },
  { p: "¿Qué nombre de función es más claro?", a: "calcular_promedio", d: ["f", "hacer_cosas_varias", "x2"] },
];

// --- P. Inteligencia artificial -------------------------------------------------------

const OVERFIT: ChoiceItem[] = [
  { p: "¿Qué es el sobreajuste (overfitting)?", a: "Aprender de memoria los ejemplos y fallar con nuevos", d: ["Entrenar con datos nuevos cada día", "Usar una computadora demasiado potente", "Tener muchos datos de buena calidad"] },
  { p: "¿Qué ayuda a evitar el sobreajuste?", a: "Más datos y variados", d: ["Menos datos de prueba", "Entrenar con los mismos datos", "Quitar todas las etiquetas"] },
  { p: "¿Qué es la exactitud de un modelo?", a: "El porcentaje de aciertos", d: ["La rapidez del modelo", "El tamaño de los datos", "El número de errores"] },
  { p: "Un detector de enfermedad avisa «sano» a todos y acierta 95%. ¿Es bueno?", a: "No: no detecta a ningún enfermo", d: ["Sí: 95% es excelente siempre", "Sí: nunca da falsas alarmas", "No: debería acertar 100% de todos"] },
  { p: "En k vecinos, ¿por qué se elige un k impar con dos clases?", a: "Para evitar empates en la votación", d: ["Porque los pares son más lentos", "Porque así usa menos memoria", "Porque los datos siempre son impares"] },
];

const ROWS: Row[] = [
  ["A.1", "Ordenamiento burbuja", A.bubblePass],
  ["A.2", "Ordenamiento por inserción", S.insertionPass],
  ["A.3", "Ordenamiento por selección", X.selectionPass],
  ["A.4", "Contar intercambios (inversiones)", X.inversions],
  ["A.5", "Búsqueda binaria en 15 datos", (r) => A.binarySearch(r, 15)],
  ["A.6", "Búsqueda lineal", A.linearSearch],
  ["A.7", "Comparar algoritmos", (r) => quiz(r, "", SORT_COMPARE)],
  ["A.8", "Eficiencia de los algoritmos", (r) => quiz(r, "", ALGO_EFFICIENCY)],

  ["B.1", "Consultas SQL: COUNT con WHERE", (r) => S.sqlQuery(r, [0, 1])],
  ["B.2", "Consultas SQL: MAX", (r) => S.sqlQuery(r, [2])],
  ["B.3", "Consultas SQL: ORDER BY y LIMIT", (r) => S.sqlQuery(r, [3])],
  ["B.4", "Actualizar datos con UPDATE", X.sqlUpdate],
  ["B.5", "Claves primarias y foráneas", (r) => quiz(r, "", DB_KEYS)],
  ["B.6", "Partes de una consulta SQL", (r) => classify(r, SQL_CLAUSES, SQL_WORDS)],

  ["C.1", "Complemento a 2: escribir negativos", (r) => X.twosComplement(r, [0])],
  ["C.2", "Complemento a 2: leer negativos", (r) => X.twosComplement(r, [1])],
  ["C.3", "Bytes en UTF-8", X.utf8Bytes],
  ["C.4", "Bases numéricas", X.baseConvert],
  ["C.5", "Decimales y desbordamiento", (r) => quiz(r, "", FLOATS)],
  ["C.6", "ASCII y Unicode", (r) => quiz(r, "", UNICODE)],

  ["D.1", "Capas del modelo TCP/IP", (r) => classify(r, TCP_IP, TCP_WORDS)],
  ["D.2", "¿Es una IP válida?", S.ipValid],
  ["D.3", "Switch, MAC, firewall y DHCP", (r) => quiz(r, "", NET_DEVICES)],
  ["D.4", "Tablas de rutas", X.routing],
  ["D.5", "DNS y conexiones paso a paso", (r) => orderQuiz(r, "", DNS_ORDER)],
  ["D.6", "Puertos y servicios", (r) => quiz(r, "", PORTS)],

  ["E.1", "Bit de paridad", S.parityBit],
  ["E.2", "Dígito de control (ISBN-13)", S.isbnCheck],
  ["E.3", "Suma de verificación (checksum)", (r) => X.checksum(r, [0])],
  ["E.4", "Algoritmo de Luhn", (r) => X.checksum(r, [1])],
  ["E.5", "Paridad, checksum y reenvío", (r) => quiz(r, "", ERROR_DETECT)],
  ["E.6", "Detectar o corregir errores", (r) => quiz(r, "", DETECT_CORRECT)],

  ["F.1", "Cifrado de Vigenère", X.vigenere],
  ["F.2", "Ingeniería social", (r) => classify(r, SOCIAL_ENG, SOCIAL_WORDS)],
  ["F.3", "VPN, firewall, parches y copias", (r) => quiz(r, "", VPN_FIREWALL)],
  ["F.4", "Contraseñas débiles y fuertes", (r) => classify(r, PW_STRENGTH, PW_WORDS)],
  ["F.5", "Qué hacer ante un incidente", (r) => orderQuiz(r, "", INCIDENT)],
  ["F.6", "Factores de autenticación", (r) => classify(r, AUTH_FACTORS, AUTH_WORDS)],

  ["G.1", "Etiquetas HTML", (r) => classify(r, HTML_TAGS, HTML_WORDS)],
  ["G.2", "HTML, CSS y JavaScript", (r) => quiz(r, "", WEB_ROLES)],
  ["G.3", "Selectores CSS", X.cssSelector],
  ["G.4", "JavaScript: variables y bucles", (r) => X.jsOutput(r, [0, 2])],
  ["G.5", "JavaScript: textos y filtros", (r) => X.jsOutput(r, [1, 3])],
  ["G.6", "Códigos de respuesta HTTP", (r) => classify(r, HTTP_STATUS, STATUS_WORDS)],
  ["G.7", "Ordenar código HTML y CSS", (r) => orderQuiz(r, "", HTML_ORDER)],

  ["H.1", "Media, mediana y moda", S.statistics],
  ["H.2", "Normalizar datos (min-max)", X.minMaxNorm],
  ["H.3", "Gráficos para analizar datos", (r) => quiz(r, "", DATA_VIZ)],
  ["H.4", "Muestras y encuestas", (r) => quiz(r, "", SAMPLING)],
  ["H.5", "Anonimizar datos", (r) => quiz(r, "", ANONYMIZE)],
  ["H.6", "Agrupar con GROUP BY", (r) => X.sqlGroupBy(r, [0, 1])],

  ["I.1", "Planificación FCFS", (r) => X.scheduling(r, [0])],
  ["I.2", "Planificación SJF", (r) => X.scheduling(r, [1])],
  ["I.3", "Planificación Round Robin", (r) => X.scheduling(r, [2])],
  ["I.4", "Procesos y planificador", (r) => quiz(r, "", PROCESS)],
  ["I.5", "Gestión de memoria", (r) => quiz(r, "", MEMORY_MGMT)],
  ["I.6", "Sistemas de archivos y permisos", (r) => quiz(r, "", FILE_SYSTEMS)],

  ["J.1", "Protocolos para IoT", (r) => quiz(r, "", IOT_PROTOCOLS)],
  ["J.2", "Datos de sensores", (r) => quiz(r, "", SENSOR_DATA)],
  ["J.3", "Algoritmos de robots", (r) => orderQuiz(r, "", MAZE)],
  ["J.4", "Programar una micro:bit", X.microbit],
  ["J.5", "Bluetooth, Wi-Fi, NFC y LoRa", (r) => classify(r, COMMS, COMMS_WORDS)],
  ["J.6", "Robots y vehículos autónomos", (r) => quiz(r, "", AUTONOMOUS)],

  ["K.1", "MVP, Kanban y trabajo ágil", (r) => quiz(r, "", AGILE_INTRO)],
  ["K.2", "Prototipos de baja y alta fidelidad", (r) => classify(r, PROTOTYPE, PROTO_WORDS)],
  ["K.3", "Pruebas con usuarios", (r) => quiz(r, "", UX_TEST)],
  ["K.4", "Etapas de un proyecto", (r) => orderQuiz(r, "", PROJECT_ORDER)],
  ["K.5", "Control de versiones con Git", (r) => quiz(r, "", GIT)],
  ["K.6", "Calidad del código", (r) => quiz(r, "", CODE_QUALITY)],

  ["L.1", "Línea de tiempo de la computación", (r) => orderQuiz(r, "", TECH_HISTORY)],
  ["L.2", "Pioneros de la computación", (r) => quiz(r, "", PIONEERS)],
  ["L.3", "Tecnología y medio ambiente", (r) => quiz(r, "", GREEN_IT)],
  ["L.4", "Profesiones tecnológicas", (r) => classify(r, TECH_JOBS, JOBS_WORDS)],
  ["L.5", "Transistores y ley de Moore", (r) => quiz(r, "", MOORE)],
  ["L.6", "Potencias de 2 en la historia", X.powersOfTwo],

  ["M.1", "Textos: índices y cortes", (r) => P.pyStrings(r, [0, 1, 2])],
  ["M.2", "Textos: len, upper, al revés y count", (r) => P.pyStrings(r, [3, 4, 5, 6])],
  ["M.3", "Listas: índices y cortes", (r) => P.pyLists(r, [0, 1, 2, 3])],
  ["M.4", "Listas: sum, sort, insert y alias", (r) => P.pyLists(r, [4, 5, 6, 7])],
  ["M.5", "Funciones con return", (r) => P.pyFunctions(r, [0, 1, 3])],
  ["M.6", "None y argumentos con nombre", (r) => P.pyFunctions(r, [2, 4])],
  ["M.7", "Recorrer listas con for", P.pyListLoop],
  ["M.8", "Bucles anidados", P.pyNested],
  ["M.9", "Matrices (listas de listas)", P2.pyMatrix],
  ["M.10", "enumerate y zip", P2.pyEnumerateZip],
  ["M.11", "Algoritmos con textos", P2.pyStringAlgo],
  ["M.12", "Ordenar las líneas de un programa", (r) => orderQuiz(r, "", PY_ORDER)],

  ["N.1", "Bloques recursivos", (r) => S.scratchRecursion(r, 1)],
  ["N.2", "Simular la gravedad", S.scratchGravity],
  ["N.3", "Repetir hasta que…", S.scratchRepeatUntil],
  ["N.4", "Polígonos con el lápiz", S.scratchPolygon],
  ["N.5", "Clones", X.scratchClones],
  ["N.6", "Enviar y esperar mensajes", X.scratchBroadcast],
  ["N.7", "Sumar con condición en una lista", S.scratchListSum],
  ["N.8", "Operadores matemáticos", X.scratchMathBlocks],

  ["O.1", "Compiladores, intérpretes y lenguajes", (r) => quiz(r, "", LANGUAGES)],
  ["O.2", "Paradigmas de programación", (r) => quiz(r, "", PARADIGMS)],
  ["O.3", "Algoritmo de Euclides", X.euclid],
  ["O.4", "Pilas y colas", X.stackQueueOps],

  ["P.1", "k vecino más cercano", (r) => S.knn(r, 1)],
  ["P.2", "Exactitud y precisión", S.modelMetrics],
  ["P.3", "Sobreajuste y evaluación", (r) => quiz(r, "", OVERFIT)],
  ["P.4", "Matriz de confusión: exactitud", (r) => X.confusion(r, [0])],
  ["P.5", "Matriz de confusión: precisión y recall", (r) => X.confusion(r, [1, 2])],
  ["P.6", "k-medias: agrupar datos", (r) => X.kmeansStep(r, [0])],
];

export const COMPUTACION_S3 = secundaria(SECTIONS, ROWS);
