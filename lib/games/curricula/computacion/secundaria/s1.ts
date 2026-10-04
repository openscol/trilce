import * as A from "../../../generators/compu/advanced";
import * as P from "../../../generators/compu/python";
import * as P2 from "../../../generators/compu/python2";
import * as R from "../../../generators/compu/robot";
import * as S from "../../../generators/compu/secondary";
import * as X from "../../../generators/compu/secondary2";
import * as T from "../../../generators/compu/topics";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { situations, type Row } from "../shared";
import { pyErrorItems, secundaria } from "./common";

// Computación · 1.° de Secundaria. Pensamiento computacional, matemática
// para la computación, representación de datos, hardware, sistemas
// operativos, redes, búsqueda de información, colaboración digital,
// seguridad, hoja de cálculo, multimedia, robótica con micro:bit, Python
// (primeros pasos), Scratch, software e IA. Nivel de referencia: Singapur
// (Lower Secondary Computing), China (信息科技, 7.° grado) y Japón (情報).

const SECTIONS: Section[] = [
  { id: "A", name: "Pensamiento computacional y algoritmos", icon: "🧩" },
  { id: "B", name: "Matemática para la computación", icon: "➗" },
  { id: "C", name: "Representación de datos", icon: "🔢" },
  { id: "D", name: "Hardware y arquitectura", icon: "🖥️" },
  { id: "E", name: "Sistemas operativos y archivos", icon: "🗂️" },
  { id: "F", name: "Redes e internet", icon: "🌐" },
  { id: "G", name: "Búsqueda y evaluación de información", icon: "🔎" },
  { id: "H", name: "Comunicación y colaboración digital", icon: "✉️" },
  { id: "I", name: "Seguridad y ciudadanía digital", icon: "🛡️" },
  { id: "J", name: "Hoja de cálculo", icon: "📊" },
  { id: "K", name: "Diseño de información y multimedia", icon: "🎨" },
  { id: "L", name: "Robótica y micro:bit", icon: "🤖" },
  { id: "M", name: "Python: primeros pasos", icon: "🐍" },
  { id: "N", name: "Scratch", icon: "🐱" },
  { id: "O", name: "Programación y software", icon: "💻" },
  { id: "P", name: "Inteligencia artificial", icon: "🧠" },
];

type Facts = [string, string][];
const words = (ask: string, all: (c: string) => string, statement: (t: string, c: string) => string) => ({ ask, all, statement });

// --- A. Pensamiento computacional ------------------------------------------

const CT: ChoiceItem[] = [
  { p: "Dividir un problema grande en partes pequeñas se llama…", a: "Descomposición", d: ["Abstracción", "Generalización", "Compilación"] },
  { p: "Quedarse solo con los datos importantes y quitar detalles es…", a: "Abstracción", d: ["Descomposición", "Depuración", "Iteración"] },
  { p: "Notar que varios problemas se resuelven de la misma forma es…", a: "Reconocer patrones", d: ["Diseñar algoritmos", "Descomponer tareas", "Abstraer los datos"] },
  { p: "Escribir los pasos exactos para resolver el problema es…", a: "Diseñar un algoritmo", d: ["Abstraer el problema", "Buscar un patrón", "Instalar un programa"] },
  { p: "Un mapa del metro muestra estaciones y líneas, pero no calles ni edificios. ¿Qué idea usa?", a: "Abstracción", d: ["Recursión", "Compresión", "Encriptación"] },
  { p: "Para organizar una fiesta separas: comida, música e invitados. ¿Qué haces?", a: "Descomposición", d: ["Generalización", "Ordenamiento", "Codificación"] },
];

const FLOW = situations(
  [
    ["«Inicio»", "Óvalo"], ["«Fin»", "Óvalo"], ["«¿nota >= 11?»", "Rombo"], ["«¿Hay saldo?»", "Rombo"],
    ["«total = total + precio»", "Rectángulo"], ["«área = base × altura»", "Rectángulo"], ["«Leer edad»", "Paralelogramo"], ["«Mostrar resultado»", "Paralelogramo"],
  ],
  "En un diagrama de flujo, ¿en qué figura va…?"
);

const ALGO_EVERYDAY: OrderItem[] = [
  { p: "Algoritmo para buscar una palabra en el diccionario:", seq: ["Abrir el diccionario por la mitad", "Comparar con la palabra buscada", "Ir a la mitad que corresponde", "Repetir hasta encontrarla"] },
  { p: "Algoritmo para preparar un vaso de refresco:", seq: ["Poner agua en la jarra", "Agregar el sobre de refresco", "Remover hasta disolver", "Servir en el vaso"] },
  { p: "Algoritmo para enviar una tarea por la plataforma:", seq: ["Iniciar sesión", "Abrir el curso", "Adjuntar el archivo", "Presionar «Enviar»"] },
  { p: "Algoritmo para cruzar la pista:", seq: ["Detenerse en el borde", "Mirar a ambos lados", "Esperar la luz verde", "Cruzar caminando"] },
];

const CT_APPLY: ChoiceItem[] = [
  { p: "Un GPS no dibuja árboles ni casas, solo calles y destinos. ¿Qué técnica usa?", a: "Abstracción", d: ["Descomposición", "Recursión", "Compilación"] },
  { p: "Para hacer un videojuego lo separas en personajes, niveles y sonidos. ¿Qué técnica usas?", a: "Descomposición", d: ["Abstracción", "Encriptación", "Iteración"] },
  { p: "Te das cuenta de que sumar 2+2+2+2 es igual a 4×2. ¿Qué técnica usas?", a: "Reconocer patrones", d: ["Depurar el código", "Comprimir datos", "Descomponer tareas"] },
  { p: "Escribes una receta exacta para que cualquiera prepare el mismo pastel. ¿Qué creas?", a: "Un algoritmo", d: ["Una abstracción", "Un patrón", "Un virus"] },
  { p: "Revisas paso a paso por qué tu programa da un resultado equivocado. ¿Qué haces?", a: "Depurar", d: ["Abstraer", "Comprimir", "Descomponer"] },
];

// --- D. Hardware ------------------------------------------------------------

const HW_PARTS: Facts = [
  ["Procesador (CPU)", "Ejecuta las instrucciones"], ["Unidad aritmético-lógica (ALU)", "Ejecuta las instrucciones"],
  ["Memoria RAM", "Guarda datos mientras se usan"], ["Memoria caché", "Guarda datos mientras se usan"],
  ["Disco SSD", "Guarda archivos de forma permanente"], ["Disco duro (HDD)", "Guarda archivos de forma permanente"],
  ["Placa madre", "Conecta todas las piezas"], ["Bus de datos", "Conecta todas las piezas"],
];
const HW_WORDS = words("¿Qué función cumple este componente?", (c) => `Selecciona los componentes que: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

const IO_DEVICES: Facts = [
  ["Teclado", "Entrada"], ["Mouse", "Entrada"], ["Micrófono", "Entrada"], ["Escáner", "Entrada"],
  ["Monitor", "Salida"], ["Impresora", "Salida"], ["Parlantes", "Salida"], ["Proyector", "Salida"],
  ["Pantalla táctil", "Entrada y salida"], ["Audífonos con micrófono", "Entrada y salida"],
];
const IO_WORDS = words("¿Es un dispositivo de entrada, de salida o de ambos?", (c) => `Selecciona los dispositivos de ${c.toLowerCase()}.`, (t, c) => `${t} es un dispositivo de ${c.toLowerCase()}.`);

const MEMORY: ChoiceItem[] = [
  { p: "¿Qué pasa con los datos de la RAM al apagar la computadora?", a: "Se borran", d: ["Se guardan solos", "Pasan a la impresora", "Se duplican"] },
  { p: "¿Qué memoria guarda las instrucciones para encender la computadora (BIOS)?", a: "La ROM", d: ["La RAM", "La caché", "La papelera"] },
  { p: "¿Para qué sirve la memoria caché?", a: "Dar datos muy rápido a la CPU", d: ["Guardar fotos para siempre", "Conectar el Wi-Fi de la casa", "Imprimir documentos rápido"] },
  { p: "Tu computadora se pone lenta con muchas pestañas abiertas. ¿Qué ayudaría más?", a: "Más memoria RAM", d: ["Un mouse nuevo", "Más brillo", "Otro teclado"] },
  { p: "¿Qué significa que la RAM sea «volátil»?", a: "Necesita energía para guardar datos", d: ["Puede volar por el aire", "Se instala solo en celulares", "Guarda datos aunque esté apagada"] },
];

const FETCH: OrderItem[] = [
  { p: "Ciclo de instrucción de la CPU:", seq: ["Buscar la instrucción en memoria", "Decodificar la instrucción", "Ejecutar la instrucción", "Guardar el resultado"] },
  { p: "Al encender la computadora:", seq: ["Se lee el programa de arranque (ROM)", "Se revisa el hardware", "Se carga el sistema operativo", "Aparece la pantalla de inicio"] },
  { p: "Al abrir un programa:", seq: ["Doble clic en el ícono", "El sistema lo busca en el disco", "Se copia a la RAM", "La CPU ejecuta sus instrucciones"] },
];

const STORAGE_TYPES: Facts = [
  ["Disco duro (HDD)", "Magnético"], ["Cinta de respaldo", "Magnético"],
  ["Memoria USB", "Estado sólido (flash)"], ["Disco SSD", "Estado sólido (flash)"], ["Tarjeta microSD", "Estado sólido (flash)"],
  ["DVD", "Óptico"], ["Blu-ray", "Óptico"], ["CD de música", "Óptico"],
];
const STORAGE_WORDS = words("¿Qué tipo de almacenamiento es?", (c) => `Selecciona el almacenamiento de tipo: ${c.toLowerCase()}.`, (t, c) => `${t}: almacenamiento ${c.toLowerCase()}.`);

const CPU: ChoiceItem[] = [
  { p: "¿Qué mide la velocidad de reloj de una CPU (por ejemplo, 3 GHz)?", a: "Ciclos por segundo", d: ["Grados de temperatura", "Bytes de memoria", "Píxeles de pantalla"] },
  { p: "¿Qué ventaja tiene una CPU de varios núcleos?", a: "Hace varias tareas a la vez", d: ["Ocupa menos espacio en disco", "Mejora el sonido de los parlantes", "Hace que el Wi-Fi llegue más lejos"] },
  { p: "¿Qué parte de la CPU hace sumas y comparaciones?", a: "La ALU", d: ["La RAM", "El monitor", "El ventilador"] },
  { p: "¿Por qué una CPU necesita ventilador o disipador?", a: "Se calienta al trabajar", d: ["Para hacer menos ruido", "Para conectarse a internet", "Para guardar archivos"] },
  { p: "¿Qué hace la unidad de control (UC) de la CPU?", a: "Dirige el orden de las tareas", d: ["Guarda las fotos del usuario", "Muestra imágenes en la pantalla", "Enfría los demás componentes"] },
];

// --- E. Sistemas operativos -------------------------------------------------

const OS_FUNCTIONS: ChoiceItem[] = [
  { p: "¿Qué hace un sistema operativo?", a: "Administra el hardware y los programas", d: ["Solo sirve para navegar por internet", "Es un juego que viene de regalo", "Es un antivirus que borra archivos"] },
  { p: "¿Quién decide qué programa usa la CPU en cada momento?", a: "El sistema operativo", d: ["El teclado numérico", "La impresora láser", "El usuario, a mano"] },
  { p: "¿Para qué sirven las cuentas de usuario?", a: "Separar archivos y permisos de cada persona", d: ["Hacer que la pantalla sea más brillante", "Conectar más impresoras a la vez", "Acelerar la descarga de juegos"] },
  { p: "¿Qué es un controlador (driver)?", a: "Un programa que hace funcionar un dispositivo", d: ["Una persona que maneja la computadora del aula", "Un cable que conecta la impresora con la PC", "Un archivo de música comprimido en formato MP3"] },
  { p: "¿Qué es la interfaz gráfica (GUI)?", a: "Ventanas, íconos y menús para usar la PC", d: ["Una lista de comandos que se escriben", "La parte física dentro del gabinete", "Un tipo de memoria muy rápida"] },
];

const OS_EXAMPLES: Facts = [
  ["Windows", "Computadoras"], ["macOS", "Computadoras"], ["Ubuntu (Linux)", "Computadoras"],
  ["Android", "Celulares y tablets"], ["iOS", "Celulares y tablets"], ["HarmonyOS", "Celulares y tablets"],
  ["Ubuntu Server", "Servidores"], ["Windows Server", "Servidores"], ["Red Hat Linux", "Servidores"],
];
const OS_WORDS = words("¿En qué equipos se usa principalmente este sistema operativo?", (c) => `Selecciona los sistemas para: ${c.toLowerCase()}.`, (t, c) => `${t} se usa en ${c.toLowerCase()}.`);

const SHORTCUTS: ChoiceItem[] = [
  { p: "¿Qué atajo deshace la última acción?", a: "Ctrl + Z", d: ["Ctrl + Y", "Ctrl + X", "Alt + F4"] },
  { p: "¿Qué atajo cambia entre ventanas abiertas?", a: "Alt + Tab", d: ["Ctrl + P", "Ctrl + S", "Shift + A"] },
  { p: "¿Qué atajo busca una palabra en la página?", a: "Ctrl + F", d: ["Ctrl + B", "Ctrl + N", "Ctrl + Q"] },
  { p: "¿Qué atajo bloquea la sesión en Windows?", a: "Win + L", d: ["Win + D", "Ctrl + L", "Alt + L"] },
  { p: "¿Qué atajo guarda el documento?", a: "Ctrl + S", d: ["Ctrl + G", "Ctrl + D", "Ctrl + W"] },
  { p: "¿Qué atajo selecciona todo?", a: "Ctrl + A", d: ["Ctrl + T", "Ctrl + E", "Ctrl + U"] },
];

const FILE_EXT: Facts = [
  [".docx", "Documento de texto"], [".pdf", "Documento de texto"], [".txt", "Documento de texto"],
  [".xlsx", "Hoja de cálculo"], [".csv", "Hoja de cálculo"], [".ods", "Hoja de cálculo"],
  [".py", "Código fuente"], [".html", "Código fuente"], [".js", "Código fuente"],
  [".zip", "Archivo comprimido"], [".rar", "Archivo comprimido"],
];
const EXT_WORDS = words("¿Qué tipo de archivo tiene esta extensión?", (c) => `Selecciona las extensiones de tipo: ${c.toLowerCase()}.`, (t, c) => `${t} es un archivo de tipo: ${c.toLowerCase()}.`);

// --- F. Redes ---------------------------------------------------------------

const NET: ChoiceItem[] = [
  { p: "¿Qué dispositivo conecta tu red de casa con internet?", a: "El router", d: ["El monitor", "La impresora", "El teclado"] },
  { p: "¿Qué es una red LAN?", a: "Una red local, como la del colegio", d: ["Una red que cubre todo un país", "Un cable para cargar el celular", "Una red mundial formada por satélites"] },
  { p: "¿Qué es un servidor?", a: "Una computadora que ofrece servicios a otras", d: ["Una pantalla táctil de gran tamaño", "Un cable que transporta electricidad", "Una persona que repara computadoras en casa"] },
  { p: "¿Qué es la nube (cloud)?", a: "Servidores en internet que guardan datos", d: ["Una red de satélites que mide el clima", "El vapor que sale de la computadora", "Un tipo de pantalla más brillante"] },
  { p: "¿Qué diferencia hay entre internet y la web?", a: "La web es un servicio que funciona sobre internet", d: ["Son exactamente lo mismo con otro nombre", "Internet es para correos y la web para juegos", "La web funciona sin cables e internet con cables"] },
  { p: "¿Qué hace un navegador web?", a: "Muestra páginas web", d: ["Protege de todos los virus", "Crea redes Wi-Fi nuevas", "Fabrica direcciones IP"] },
];

const PROTOCOLS: Facts = [
  ["HTTP", "Ver páginas web"], ["HTTPS", "Ver páginas web"], ["SMTP", "Enviar correos"], ["IMAP", "Recibir correos"],
  ["POP3", "Recibir correos"], ["FTP", "Transferir archivos"], ["SFTP", "Transferir archivos"], ["DNS", "Traducir nombres a IP"], ["DHCP", "Asignar direcciones IP"],
];
const PROTOCOL_WORDS = words("¿Para qué se usa este protocolo?", (c) => `Selecciona los protocolos para: ${c.toLowerCase()}.`, (t, c) => `${t} sirve para ${c.toLowerCase()}.`);

const NET_JOURNEY: OrderItem[] = [
  { p: "¿Qué pasa al escribir una dirección web?", seq: ["El navegador pregunta al DNS la IP", "Se envía la petición al servidor", "El servidor responde con la página", "El navegador la muestra"] },
  { p: "Cómo viaja un mensaje de chat:", seq: ["Se divide en paquetes", "Los paquetes viajan por routers", "Llegan al destino", "Se vuelven a unir en orden"] },
  { p: "Conectarse a un Wi-Fi nuevo:", seq: ["Buscar redes disponibles", "Elegir la red", "Escribir la contraseña", "Recibir una IP (DHCP)"] },
];

// --- G. Búsqueda y evaluación de información --------------------------------

const SEARCH_OPS: ChoiceItem[] = [
  { p: "¿Qué hacen las comillas en «\"cambio climático\"» al buscar?", a: "Buscan la frase exacta", d: ["Borran las palabras", "Buscan solo imágenes", "Traducen la frase"] },
  { p: "¿Qué hace el signo menos en «jaguar -auto»?", a: "Excluye resultados con «auto»", d: ["Resta dos números grandes", "Busca solo autos jaguar", "Ordena de menor a mayor"] },
  { p: "¿Qué hace «site:gob.pe vacunas»?", a: "Busca solo en sitios gob.pe", d: ["Crea una página web nueva", "Busca en todos los países", "Descarga todas las vacunas"] },
  { p: "¿Qué hace «filetype:pdf fotosíntesis»?", a: "Busca solo archivos PDF", d: ["Convierte la web a PDF", "Busca solo videos", "Imprime los resultados"] },
  { p: "Quieres resultados de perros o gatos. ¿Qué escribes?", a: "perros OR gatos", d: ["perros -gatos", "\"perros gatos\"", "site:perros gatos"] },
];

const SOURCES: Facts = [
  ["Una página del Ministerio de Salud (minsa.gob.pe)", "Confiable"], ["Un artículo de una universidad con autor y fecha", "Confiable"], ["Una enciclopedia con referencias", "Confiable"],
  ["Un audio reenviado sin autor por WhatsApp", "Dudosa"], ["Un video que dice «los médicos no quieren que sepas esto»", "Dudosa"], ["Una web sin autor, llena de anuncios", "Dudosa"],
  ["Un titular en mayúsculas: «¡INCREÍBLE!»", "Dudosa"], ["Un diario conocido que cita sus fuentes", "Confiable"],
];
const SOURCE_WORDS = words("¿Esta fuente parece confiable o dudosa?", (c) => `Selecciona las fuentes que parecen: ${c.toLowerCase()}.`, (t, c) => `${t}: fuente ${c.toLowerCase()}.`);

const FAKE_NEWS: ChoiceItem[] = [
  { p: "Antes de compartir una noticia sorprendente, ¿qué conviene hacer?", a: "Buscarla en otras fuentes serias", d: ["Compartirla rápido para ser el primero", "Creerla si tiene muchos «me gusta»", "Agregarle muchos emojis"] },
  { p: "Una foto parece de un desastre de hoy. ¿Cómo verificar si es vieja?", a: "Hacer una búsqueda inversa de imagen", d: ["Mirar cuántos la compartieron", "Aumentar el brillo y el contraste de la foto", "Preguntar en un grupo de chat de amigos"] },
  { p: "¿Qué es la desinformación?", a: "Información falsa difundida a propósito", d: ["Una noticia que tiene errores de tipeo", "Un dato que todavía no se ha publicado", "Un mensaje enviado por correo electrónico"] },
  { p: "¿Qué indica que una página podría ser falsa?", a: "Una dirección parecida a la oficial", d: ["Un candado y su dirección oficial", "Un autor conocido con su firma", "Fuentes citadas al final del texto"] },
  { p: "¿Por qué los titulares exagerados son sospechosos?", a: "Buscan clics más que informar", d: ["Siempre los escriben científicos", "La ley obliga a usar mayúsculas", "Son más fáciles de leer"] },
];

const CITE: ChoiceItem[] = [
  { p: "¿Por qué hay que citar las fuentes en un trabajo?", a: "Para reconocer al autor y poder verificar", d: ["Para que el trabajo sea más largo y pesado", "Porque así el trabajo se ve más bonito", "Para poder cobrar dinero por el trabajo"] },
  { p: "¿Qué datos lleva una cita de una página web?", a: "Autor, título, fecha y dirección", d: ["Solo el color de fondo de la página", "El precio de la computadora usada", "El nombre de tu profesor"] },
  { p: "Copiar un texto de internet y presentarlo como tuyo es…", a: "Plagio", d: ["Cita", "Paráfrasis", "Investigación"] },
  { p: "¿Qué es parafrasear?", a: "Explicar la idea con tus palabras y citar", d: ["Copiar el texto igual sin comillas", "Traducir palabra por palabra", "Borrar la fuente para que no se note"] },
  { p: "Usas una imagen de internet en tu presentación. ¿Qué haces?", a: "Revisar su licencia y citarla", d: ["Usarla sin decir nada", "Recortarla para que no la reconozcan", "Cambiarle el color y decir que es tuya"] },
];

const DOMAINS: Facts = [
  [".gob.pe", "Gobierno"], [".gob.mx", "Gobierno"], [".edu.pe", "Educación"], [".edu", "Educación"],
  [".com", "Empresa o comercio"], [".com.pe", "Empresa o comercio"], [".org", "Organización"], [".org.pe", "Organización"],
];
const DOMAIN_WORDS = words("¿Qué tipo de sitio suele usar este dominio?", (c) => `Selecciona los dominios de tipo: ${c.toLowerCase()}.`, (t, c) => `${t} suele ser de: ${c.toLowerCase()}.`);

const SEARCH_STRATEGY: OrderItem[] = [
  { p: "Investigar un tema en internet:", seq: ["Definir qué quiero saber", "Elegir palabras clave", "Buscar y filtrar resultados", "Comparar varias fuentes", "Citar lo que uso"] },
  { p: "Verificar un dato dudoso:", seq: ["Identificar quién lo dice", "Buscar el dato en fuentes oficiales", "Revisar la fecha", "Decidir si es confiable"] },
  { p: "Hacer un informe con fuentes:", seq: ["Buscar información", "Tomar notas con mis palabras", "Escribir el informe", "Agregar la bibliografía"] },
];

// --- H. Comunicación y colaboración -----------------------------------------

const EMAIL: ChoiceItem[] = [
  { p: "¿Qué hace el campo CC en un correo?", a: "Envía una copia visible a otros", d: ["Borra el correo después de leerlo", "Oculta a todos los destinatarios", "Cifra el mensaje con una clave"] },
  { p: "¿Qué hace el campo CCO (copia oculta)?", a: "Envía copia sin que otros lo vean", d: ["Envía el correo mucho más rápido", "Corrige la ortografía del mensaje", "Adjunta las fotos de forma automática"] },
  { p: "¿Qué debe tener el asunto de un correo?", a: "Una idea breve del contenido", d: ["Todo el mensaje completo, palabra por palabra", "Solo emojis de colores", "Nada, es mejor dejarlo vacío"] },
  { p: "¿Cómo empiezas un correo a un profesor?", a: "Con un saludo respetuoso", d: ["Con «¡Oye, tú!»", "Sin ningún saludo", "Con muchas mayúsculas"] },
  { p: "Quieres escribir a 40 padres sin mostrar sus correos entre ellos. ¿Qué usas?", a: "CCO", d: ["CC", "Para", "Asunto"] },
];

const NETIQUETTE: Facts = [
  ["Escribir todo en MAYÚSCULAS", "Inadecuado"], ["Responder con insultos en un foro", "Inadecuado"], ["Compartir capturas privadas sin permiso", "Inadecuado"], ["Enviar cadenas a todos tus contactos", "Inadecuado"],
  ["Saludar y despedirse en un correo", "Adecuado"], ["Silenciar el micrófono si no hablas", "Adecuado"], ["Revisar la ortografía antes de enviar", "Adecuado"], ["Respetar opiniones distintas", "Adecuado"],
];
const NET_WORDS = words("Según la netiqueta, ¿es adecuado o inadecuado?", (c) => `Selecciona los comportamientos ${c.toLowerCase()}s.`, (t, c) => `«${t}» es ${c.toLowerCase()}.`);

const CLOUD_COLLAB: ChoiceItem[] = [
  { p: "¿Qué ventaja tiene un documento compartido en la nube?", a: "Varias personas editan a la vez", d: ["Ya no necesita internet nunca", "Nadie más puede verlo jamás", "Se imprime solo cada día"] },
  { p: "¿Qué permite el historial de versiones?", a: "Ver y recuperar versiones anteriores", d: ["Borrar el archivo para siempre", "Cambiar el idioma del teclado", "Aumentar el espacio del disco"] },
  { p: "Un compañero solo debe leer el trabajo, no cambiarlo. ¿Qué permiso le das?", a: "Lector", d: ["Editor", "Propietario", "Administrador"] },
  { p: "¿Para qué sirven los comentarios en un documento compartido?", a: "Sugerir cambios sin borrar el texto", d: ["Cambiar el tipo de letra de todo", "Cerrar el documento a los demás", "Enviar el documento por correo"] },
  { p: "¿Qué riesgo tiene compartir un enlace «cualquier persona puede editar»?", a: "Desconocidos podrían cambiarlo", d: ["El archivo pesará mucho más", "Se borrará al día siguiente", "Ya no se podrá imprimir"] },
];

const EMAIL_ORDER: OrderItem[] = [
  { p: "Partes de un correo formal, en orden:", seq: ["Saludo", "Presentación breve", "Mensaje principal", "Despedida", "Firma"] },
  { p: "Enviar una tarea por correo:", seq: ["Escribir el correo del profesor", "Poner un asunto claro", "Redactar el mensaje", "Adjuntar el archivo", "Enviar"] },
  { p: "Organizar un trabajo en grupo en la nube:", seq: ["Crear el documento", "Compartirlo con el grupo", "Repartir las partes", "Revisar con comentarios", "Entregar la versión final"] },
];

const VIDEO_CALL: ChoiceItem[] = [
  { p: "En una clase virtual, ¿qué conviene hacer al entrar?", a: "Silenciar el micrófono", d: ["Subir el volumen al máximo", "Compartir la pantalla", "Grabar sin avisar"] },
  { p: "¿Para qué sirve «levantar la mano» en una videollamada?", a: "Pedir la palabra en orden", d: ["Salir de la reunión rápido", "Apagar la cámara de todos", "Cambiar el fondo de la pantalla"] },
  { p: "¿Es correcto grabar una videollamada sin avisar?", a: "No, hay que pedir permiso", d: ["Sí, siempre se puede hacer", "Sí, si la reunión es corta", "Solo si la clase es de noche"] },
  { p: "Tu conexión está lenta en la videollamada. ¿Qué puedes hacer?", a: "Apagar la cámara un momento", d: ["Abrir más pestañas de videos", "Descargar archivos grandes", "Reiniciar el router ajeno"] },
  { p: "¿Qué es un fondo virtual?", a: "Una imagen que reemplaza lo que hay detrás", d: ["Un virus que entra a la PC por la cámara web", "Un programa que sirve para grabar la pantalla", "La música que suena mientras esperas la llamada"] },
];

const PERMISSIONS: Facts = [
  ["Puede leer, pero no escribir comentarios", "Lector"], ["Solo mira la presentación final", "Lector"],
  ["Puede dejar notas, pero no cambiar el texto", "Comentarista"], ["Sugiere cambios con comentarios", "Comentarista"],
  ["Puede cambiar el contenido del documento", "Editor"], ["Agrega y borra diapositivas", "Editor"],
];
const PERM_WORDS = words("¿Qué permiso corresponde?", (c) => `Selecciona lo que puede hacer un ${c.toLowerCase()}.`, (t, c) => `«${t}»: permiso de ${c.toLowerCase()}.`);

// --- I. Seguridad -----------------------------------------------------------

const MALWARE: Facts = [
  ["Se copia en otros archivos cuando los abres", "Virus"], ["Se esparce solo por la red, sin que lo abras", "Gusano"],
  ["Parece un juego gratis, pero abre una puerta al atacante", "Troyano"], ["Cifra tus archivos y pide dinero para devolverlos", "Ransomware"],
  ["Bloquea las fotos del celular y exige un pago", "Ransomware"], ["Espía lo que haces y lo envía a otra persona", "Spyware"],
  ["Registra cada tecla que presionas", "Spyware"], ["Llena la pantalla de anuncios que no pediste", "Adware"],
];
const MALWARE_WORDS = words("¿Qué tipo de software malicioso es?", (c) => `Selecciona las descripciones de: ${c}.`, (t, c) => `«${t}»: es ${c}.`);

const SECURITY: ChoiceItem[] = [
  { p: "¿Qué es la autenticación en dos pasos (2FA)?", a: "Pedir la clave y un código extra", d: ["Tener dos contraseñas iguales", "Entrar dos veces a la misma página", "Usar dos computadoras a la vez"] },
  { p: "Recibes un correo de «tu banco» con un enlace para «verificar tu cuenta». ¿Qué haces?", a: "No abro el enlace; entro yo a la web oficial", d: ["Abro el enlace rápido para no perder la cuenta", "Respondo el correo con mi clave para verificar", "Reenvío el correo a todos mis contactos"] },
  { p: "¿Qué es el phishing?", a: "Suplantar a alguien para robar datos", d: ["Pescar en un lago usando una app", "Un antivirus que limpia el correo", "Una forma rápida de bajar archivos"] },
  { p: "¿Por qué hay que actualizar el sistema operativo?", a: "Corrige fallas de seguridad conocidas", d: ["Hace que la pantalla sea más grande", "Borra los archivos que no se usan", "Aumenta la memoria RAM de la PC"] },
  { p: "¿Qué indica el candado 🔒 junto a la dirección web?", a: "Que la conexión va cifrada (HTTPS)", d: ["Que la página no tiene publicidad", "Que la página es del gobierno", "Que nadie más puede visitarla"] },
  { p: "¿Qué es un gestor de contraseñas?", a: "Un programa que guarda claves cifradas", d: ["Un cuaderno donde anoto mis claves", "Una persona que adivina contraseñas", "Un virus que roba contraseñas"] },
];

const PRIVACY: ChoiceItem[] = [
  { p: "¿Qué es la huella digital?", a: "El rastro de datos que dejo en internet", d: ["La marca de mi dedo en la pantalla", "La foto de perfil de mi cuenta", "El número de serie de mi celular"] },
  { p: "Antes de publicar una foto, ¿qué conviene pensar?", a: "Quién podrá verla y si me afectará luego", d: ["Si tiene suficientes filtros de color", "Si la cámara del celular es nueva", "Cuántos megas pesa el archivo"] },
  { p: "¿Qué dato NO conviene publicar?", a: "Mi dirección y mi horario del colegio", d: ["Mi opinión sobre una película", "Un dibujo que hice en clase", "La foto de un paisaje bonito"] },
  { p: "¿Qué son las cookies de una página web?", a: "Datos que guarda la web en tu navegador", d: ["Galletas que regalan las tiendas online", "Virus que se esconden en las imágenes", "Anuncios que aparecen en las redes"] },
  { p: "Un amigo publica una foto tuya sin permiso. ¿Qué es lo correcto?", a: "Pedirle con respeto que la retire", d: ["Publicar una foto suya en venganza", "Dejarlo así porque no importa nada", "Cerrar todas mis redes para siempre"] },
];

const SAFE_HABITS: Facts = [
  ["Usar una contraseña distinta en cada cuenta", "Seguro"], ["Activar la verificación en dos pasos", "Seguro"], ["Cerrar sesión en computadoras públicas", "Seguro"], ["Descargar apps solo de tiendas oficiales", "Seguro"],
  ["Conectarse al banco desde un Wi-Fi público abierto", "Riesgoso"], ["Prestar tu contraseña a un amigo", "Riesgoso"], ["Instalar programas «pirata»", "Riesgoso"], ["Abrir adjuntos de correos desconocidos", "Riesgoso"],
];
const SAFE_WORDS = words("¿Este hábito es seguro o riesgoso?", (c) => `Selecciona los hábitos ${c.toLowerCase()}s.`, (t, c) => `«${t}» es ${c.toLowerCase()}.`);

const CYBERBULLYING: ChoiceItem[] = [
  { p: "¿Qué es el ciberacoso?", a: "Molestar o humillar a alguien por internet", d: ["Navegar muchas horas seguidas sin descansar", "Usar las redes sociales para estudiar en grupo", "Enviar mensajes de voz a tus amigos del barrio"] },
  { p: "Un compañero recibe burlas en un grupo de chat. ¿Qué haces?", a: "No reenvío, lo apoyo y aviso a un adulto", d: ["Me río para no quedar mal con el grupo", "Reenvío las burlas a otros grupos", "Salgo del grupo y no digo nada"] },
  { p: "¿Qué conviene guardar si sufres ciberacoso?", a: "Capturas de los mensajes como prueba", d: ["Nada, mejor borrar todo enseguida", "Solo los mensajes que sean bonitos", "La contraseña del acosador"] },
  { p: "¿Qué es el grooming?", a: "Un adulto que engaña a un menor por internet", d: ["Peinar y bañar a una mascota con mucho cuidado", "Un juego en línea muy conocido entre los jóvenes", "Una forma de mejorar la velocidad del internet"] },
  { p: "Un desconocido te pide fotos y que no le cuentes a nadie. ¿Qué haces?", a: "Lo bloqueo y aviso a un adulto", d: ["Le mando una foto sin mi cara", "Le pregunto por qué las quiere", "Le doy mi número de celular"] },
];

// --- K. Multimedia ----------------------------------------------------------

const VECTOR_BITMAP: Facts = [
  ["Una foto tomada con el celular", "Mapa de bits (píxeles)"], ["Una imagen .jpg", "Mapa de bits (píxeles)"], ["Un dibujo hecho en Paint", "Mapa de bits (píxeles)"],
  ["Un logo .svg que se agranda sin perder calidad", "Vectorial (formas)"], ["Un ícono hecho con curvas y figuras", "Vectorial (formas)"], ["Una tipografía (letra) del sistema", "Vectorial (formas)"],
];
const VECTOR_WORDS = words("¿Es una imagen de mapa de bits o vectorial?", (c) => `Selecciona las imágenes de tipo: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

const MEDIA: Facts = [
  [".jpg", "Imagen"], [".png", "Imagen"], [".gif", "Imagen"], [".mp3", "Sonido"], [".wav", "Sonido"], [".ogg", "Sonido"], [".mp4", "Video"], [".mov", "Video"], [".webm", "Video"],
];
const MEDIA_WORDS = words("¿Qué tipo de archivo multimedia es?", (c) => `Selecciona los formatos de ${c.toLowerCase()}.`, (t, c) => `${t} es un formato de ${c.toLowerCase()}.`);

const COMPRESSION: ChoiceItem[] = [
  { p: "¿Qué es la compresión con pérdida (como JPG o MP3)?", a: "Quita detalles que casi no se notan", d: ["Guarda todos los datos sin cambios", "Hace el archivo más grande", "Cifra el archivo con una clave"] },
  { p: "¿Qué formato conviene para un texto o programa que no puede cambiar ni un dato?", a: "Compresión sin pérdida (ZIP)", d: ["Compresión con pérdida (JPG)", "Captura de pantalla en baja", "Foto del texto con el celular"] },
  { p: "¿Por qué se comprimen los videos para internet?", a: "Para que pesen menos y carguen rápido", d: ["Para que se vean más grandes en la pantalla", "Para que no tengan sonido", "Para que duren más minutos de lo normal"] },
  { p: "Guardas muchas veces un JPG editado. ¿Qué puede pasar?", a: "Pierde un poco de calidad cada vez", d: ["Gana más resolución cada vez que se guarda", "Se vuelve un video corto", "Se convierte en un archivo PNG"] },
  { p: "¿Qué formato de imagen permite fondo transparente?", a: "PNG", d: ["JPG", "MP3", "DOCX"] },
];

const DESIGN: ChoiceItem[] = [
  { p: "En una presentación, ¿qué ayuda a leer mejor?", a: "Buen contraste entre texto y fondo", d: ["Letra amarilla sobre fondo blanco", "Muchos tipos de letra distintos", "Textos largos en cada diapositiva"] },
  { p: "¿Qué es la jerarquía visual?", a: "Destacar lo más importante primero", d: ["Usar todos los colores posibles", "Poner el texto en desorden", "Hacer todo del mismo tamaño"] },
  { p: "¿Por qué alinear los elementos de un afiche?", a: "Se ve ordenado y fácil de seguir", d: ["Para que pese menos el archivo", "Porque la ley lo obliga siempre", "Para que se imprima más rápido"] },
  { p: "¿Cuántas ideas conviene poner en una diapositiva?", a: "Una idea principal", d: ["Todas las del tema", "Ninguna, solo fotos", "Diez como mínimo"] },
  { p: "¿Para qué sirve una infografía?", a: "Explicar datos con imágenes y poco texto", d: ["Guardar archivos de forma segura", "Programar un videojuego sencillo", "Enviar correos a muchas personas"] },
];

// --- L. Robótica ------------------------------------------------------------

const ROBOT_PARTS: Facts = [
  ["Sensor de distancia (ultrasonido)", "Sensor"], ["Acelerómetro", "Sensor"], ["Sensor de luz", "Sensor"], ["Brújula digital", "Sensor"],
  ["Motor de las ruedas", "Actuador"], ["Matriz de LED", "Actuador"], ["Zumbador (buzzer)", "Actuador"], ["Servomotor del brazo", "Actuador"],
  ["Placa micro:bit", "Controlador"], ["Placa Arduino", "Controlador"],
];
const ROBOT_WORDS = words("En un robot, ¿qué papel cumple esta pieza?", (c) => `Selecciona las piezas que son: ${c.toLowerCase()}.`, (t, c) => `${t}: es un ${c.toLowerCase()}.`);

const ROBOTICS: ChoiceItem[] = [
  { p: "¿Qué hace un robot que esquiva obstáculos al detectar una pared?", a: "Lee el sensor y decide girar", d: ["Se apaga para siempre", "Avanza más rápido hacia ella", "Cambia el color de su luz"] },
  { p: "¿Qué es un bucle «para siempre» en un robot?", a: "Instrucciones que se repiten sin parar", d: ["Una pieza que no se desgasta nunca", "Un cable que no se desconecta", "Un error que borra el programa"] },
  { p: "¿Por qué se prueba un robot muchas veces?", a: "Para encontrar y corregir errores", d: ["Para gastar las baterías", "Porque así se vende más caro", "Para que aprenda a hablar"] },
  { p: "¿Qué es un robot autónomo?", a: "Uno que decide solo con sus sensores", d: ["Uno que siempre se controla a mano", "Uno que no tiene ninguna batería", "Uno que solo funciona en fábricas"] },
  { p: "El robot gira demasiado. ¿Qué cambiarías primero en el programa?", a: "El tiempo o el ángulo del giro", d: ["El color de las ruedas", "El nombre del robot", "La marca de la batería"] },
];

// --- M. Python --------------------------------------------------------------

const PY_ERRORS = pyErrorItems([
  ['print("Hola)', "SyntaxError"], ['prin("Hola")', "NameError"], ['edad = 12\nprint("Tengo " + edad)', "TypeError"], ['if 5 > 3:\nprint("sí")', "IndentationError"],
  ["print(10 / 0)", "ZeroDivisionError"], ['n = int("diez")', "ValueError"], ["print(puntos)\npuntos = 5", "NameError"], ["x = 5\nif x > 3\n    print(x)", "SyntaxError"],
  ["lista = [1, 2, 3]\nprint(lista + 4)", "TypeError"], ["total = 0\nfor i in range(3):\ntotal += i", "IndentationError"], ['x = float("3,5")', "ValueError"], ["a = 0\nprint(5 % a)", "ZeroDivisionError"],
]);

const PY_ORDER: OrderItem[] = [
  { p: "Ordena el programa.", seq: ["lado = 5", "area = lado * lado", "print(area)"], mono: true },
  { p: "Ordena el programa para que imprima 35.", seq: ["precio = 20", "precio = precio * 2", "precio = precio - 5", "print(precio)"], mono: true },
  { p: "Ordena el programa.", seq: ["edad = int(input())", "edad = edad + 1", 'print("El próximo año tendrás", edad)'], mono: true },
  { p: "Ordena el programa que convierte °C a °F.", seq: ["c = float(input())", "f = c * 9 / 5 + 32", "print(f)"], mono: true },
  { p: "Ordena el programa para que imprima 10.", seq: ["x = 3", "y = x * 4", "x = y - 2", "print(x)"], mono: true },
];

const VAR_NAMES: Facts = [
  ["edad", "Nombre válido"], ["nota_final", "Nombre válido"], ["_contador", "Nombre válido"], ["precio2", "Nombre válido"], ["totalAlumnos", "Nombre válido"],
  ["2precio", "Nombre no válido"], ["nota final", "Nombre no válido"], ["mi-edad", "Nombre no válido"], ["for", "Nombre no válido"], ["print!", "Nombre no válido"],
];
const VAR_WORDS = words("En Python, ¿este nombre de variable es válido?", (c) => `Selecciona: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

// --- O. Programación y software ---------------------------------------------

const PROCESSES: OrderItem[] = [
  { p: "Ciclo de desarrollo de software:", seq: ["Analizar el problema", "Diseñar la solución", "Programar", "Probar", "Mantener y mejorar"] },
  { p: "Crear una app pensando en el usuario:", seq: ["Identificar una necesidad", "Investigar a los usuarios", "Hacer un prototipo", "Probar con usuarios", "Publicar la app"] },
  { p: "De código a programa:", seq: ["Escribir el código fuente", "Traducirlo a lenguaje máquina", "Ejecutar el programa", "Revisar los resultados"] },
  { p: "Depurar un error:", seq: ["Reproducir el error", "Encontrar la línea culpable", "Corregir el código", "Volver a probar"] },
];

const LICENSES: Facts = [
  ["Linux", "Libre (código abierto)"], ["LibreOffice", "Libre (código abierto)"], ["Firefox", "Libre (código abierto)"], ["Python", "Libre (código abierto)"],
  ["Windows", "Propietario (de pago)"], ["Microsoft Office", "Propietario (de pago)"], ["Photoshop", "Propietario (de pago)"],
  ["WhatsApp", "Gratuito pero cerrado"], ["Google Chrome", "Gratuito pero cerrado"], ["Zoom (versión básica)", "Gratuito pero cerrado"],
];
const LICENSE_WORDS = words("¿Qué tipo de licencia tiene este software?", (c) => `Selecciona el software de tipo: ${c.toLowerCase()}.`, (t, c) => `${t} es software ${c.toLowerCase()}.`);

const UX: ChoiceItem[] = [
  { p: "¿Qué es la usabilidad?", a: "Qué tan fácil es usar un programa", d: ["Cuántas veces se descargó una app", "Cuánta memoria ocupa un programa", "El precio que cuesta una licencia"] },
  { p: "Para que un botón importante se note, conviene…", a: "Darle contraste y un lugar visible", d: ["Ponerlo pequeño en una esquina", "Usar el mismo color del fondo", "Esconderlo dentro de un menú"] },
  { p: "¿Por qué usar íconos conocidos (🔍 buscar, 🗑️ borrar)?", a: "El usuario entiende sin leer mucho", d: ["Hacen que la app pese mucho menos", "Así nadie puede copiar el diseño", "Porque las letras están prohibidas"] },
  { p: "¿Qué es la accesibilidad?", a: "Que todas las personas puedan usarlo", d: ["Que solo funcione con internet rápido", "Que la app sea gratis para todos", "Que se pueda abrir en cualquier país"] },
  { p: "¿Qué ayuda a una persona con baja visión?", a: "Poder agrandar el texto", d: ["Letras grises sobre fondo gris", "Animaciones rápidas y brillantes", "Botones sin ninguna etiqueta"] },
  { p: "¿Qué es un prototipo?", a: "Una versión simple para probar ideas", d: ["La versión final que se vende", "El manual de usuario impreso", "Un virus de prueba muy simple"] },
];

const SOFTWARE_KINDS: Facts = [
  ["Windows, Android, Linux", "Sistema operativo"], ["iOS, macOS", "Sistema operativo"],
  ["Word, Excel, Canva", "Aplicación"], ["WhatsApp, Spotify", "Aplicación"], ["Un videojuego", "Aplicación"],
  ["Antivirus", "Utilitario"], ["Compresor de archivos (7-Zip)", "Utilitario"], ["Desfragmentador de disco", "Utilitario"],
  ["Python, Java, C++", "Lenguaje de programación"], ["JavaScript", "Lenguaje de programación"],
];
const KINDS_WORDS = words("¿Qué tipo de software es?", (c) => `Selecciona los que son: ${c.toLowerCase()}.`, (t, c) => `${t}: ${c.toLowerCase()}.`);

const DEV_ROLES: Facts = [
  ["Escribe el código del programa", "Programador"], ["Corrige los errores del código", "Programador"],
  ["Diseña pantallas fáciles de usar", "Diseñador UX/UI"], ["Dibuja prototipos de la app", "Diseñador UX/UI"],
  ["Busca errores probando la app", "Tester (QA)"], ["Escribe casos de prueba", "Tester (QA)"],
  ["Conversa con el cliente para entender qué necesita", "Analista"], ["Escribe la lista de requisitos", "Analista"],
];
const ROLES_WORDS = words("En un equipo de software, ¿quién hace esto?", (c) => `Selecciona las tareas del ${c}.`, (t, c) => `«${t}»: lo hace el ${c}.`);

// --- P. Inteligencia artificial ----------------------------------------------

const ML_TYPES: Facts = [
  ["Aprender a reconocer gatos con fotos etiquetadas", "Supervisado"], ["Predecir el precio de casas con precios conocidos", "Supervisado"], ["Detectar spam con correos ya marcados", "Supervisado"],
  ["Agrupar clientes parecidos sin etiquetas", "No supervisado"], ["Encontrar grupos de canciones similares", "No supervisado"], ["Separar noticias por temas sin categorías previas", "No supervisado"],
  ["Un robot aprende a caminar con premios y castigos", "Por refuerzo"], ["Una IA aprende ajedrez ganando y perdiendo partidas", "Por refuerzo"], ["Un auto aprende a estacionar sumando puntos", "Por refuerzo"],
];
const ML_WORDS = words("¿Qué tipo de aprendizaje automático es?", (c) => `Selecciona los ejemplos de aprendizaje ${c.toLowerCase()}.`, (t, c) => `«${t}» es aprendizaje ${c.toLowerCase()}.`);

const AI_PIPELINE: OrderItem[] = [
  { p: "Crear un modelo de IA:", seq: ["Recolectar datos", "Limpiar y etiquetar los datos", "Entrenar el modelo", "Evaluar con datos nuevos", "Usar el modelo"] },
  { p: "Mejorar un modelo:", seq: ["Definir el problema", "Elegir qué datos se necesitan", "Entrenar", "Medir los errores", "Mejorar y reentrenar"] },
  { p: "Usar un chatbot de forma responsable:", seq: ["Escribir la instrucción (prompt)", "La IA genera una respuesta", "Revisar si es correcta", "Corregir o pedir mejoras"] },
];

const AI_USE: ChoiceItem[] = [
  { p: "Un chatbot te da un dato con mucha seguridad. ¿Qué haces?", a: "Lo verifico en fuentes confiables", d: ["Lo copio tal cual en mi tarea", "Lo creo porque las IA no fallan", "Lo comparto sin leerlo completo"] },
  { p: "¿Qué es una «alucinación» de la IA?", a: "Una respuesta inventada que parece cierta", d: ["Un error de la pantalla al mostrar colores", "Un sueño que tiene la computadora", "Un virus que crea imágenes raras"] },
  { p: "¿Cuál es un buen prompt?", a: "Explica el tema, el público y el formato", d: ["Haz algo bueno sobre cualquier cosa", "Escribe todo lo que sepas ya mismo", "Responde rápido sin pensar mucho"] },
  { p: "¿Qué NO debes escribir en un chatbot público?", a: "Contraseñas y datos personales", d: ["Preguntas de historia del Perú", "Ideas para un proyecto escolar", "Dudas sobre una fórmula de física"] },
  { p: "Usaste IA para una tarea. ¿Qué es lo honesto?", a: "Decir cómo y para qué la usé", d: ["Ocultarlo para tener más nota", "Decir que la IA lo hizo todo", "Borrar el historial del chat"] },
];

const AI_EVERYDAY: Facts = [
  ["El celular se desbloquea reconociendo tu cara", "Usa IA"], ["Una app traduce lo que dices en voz alta", "Usa IA"], ["La plataforma de videos recomienda qué ver", "Usa IA"], ["El correo separa el spam solo", "Usa IA"],
  ["Una calculadora suma 2 + 2", "No usa IA"], ["Un foco se prende con un interruptor", "No usa IA"], ["Un reloj despertador suena a las 6:00", "No usa IA"], ["Un control remoto cambia de canal", "No usa IA"],
];
const EVERYDAY_WORDS = words("¿Usa inteligencia artificial?", (c) => `Selecciona los ejemplos que: ${c.toLowerCase()}.`, (t, c) => `«${t}»: ${c.toLowerCase()}.`);

const ROWS: Row[] = [
  ["A.1", "Descomposición, patrones y abstracción", (r) => quiz(r, "", CT)],
  ["A.2", "Símbolos de los diagramas de flujo", (r) => quiz(r, "", FLOW)],
  ["A.3", "Seguir instrucciones con variables", (r) => A.pseudocode(r, 1)],
  ["A.4", "Bucles en pseudocódigo", (r) => A.pseudocode(r, 2)],
  ["A.5", "Seguir un algoritmo con condiciones", (r) => A.pseudocode(r, 3)],
  ["A.6", "Tabla de seguimiento con listas", (r) => A.pseudocode(r, 4)],
  ["A.7", "Algoritmos de la vida diaria", (r) => orderQuiz(r, "", ALGO_EVERYDAY)],
  ["A.8", "Pensamiento computacional en situaciones", (r) => quiz(r, "", CT_APPLY)],

  ["B.1", "Sistema octal (base 8)", (r) => X.baseConvert(r, [0, 1])],
  ["B.2", "Otras bases: 3 y 5", (r) => X.baseConvert(r, [2, 3])],
  ["B.3", "Potencias de 2: ¿cuántos valores?", (r) => X.powersOfTwo(r, [0])],
  ["B.4", "¿Cuántos bits se necesitan?", (r) => X.powersOfTwo(r, [1, 2])],
  ["B.5", "Aritmética modular (mod)", X.modArith],
  ["B.6", "Suma binaria", S.binaryAddition],

  ["C.1", "Binario a decimal (8 bits)", (r) => A.binaryToDecimal(r, 8)],
  ["C.2", "Decimal a binario (8 bits)", (r) => A.decimalToBinary(r, 8)],
  ["C.3", "Hexadecimal a decimal", (r) => S.hexadecimal(r, [0])],
  ["C.4", "Decimal a hexadecimal", (r) => S.hexadecimal(r, [1])],
  ["C.5", "Binario a hexadecimal", (r) => S.hexadecimal(r, [2])],
  ["C.6", "Texto en código ASCII", S.asciiCode],
  ["C.7", "¿Cuánto pesa una imagen?", S.imageSize],
  ["C.8", "Unidades: bit, byte, KB, MB, GB", (r) => (r.chance(0.5) ? A.unitsOrder(r) : A.bitsInBytes(r))],

  ["D.1", "Componentes y sus funciones", (r) => classify(r, HW_PARTS, HW_WORDS)],
  ["D.2", "Dispositivos de entrada y salida", (r) => classify(r, IO_DEVICES, IO_WORDS)],
  ["D.3", "RAM, ROM y caché", (r) => quiz(r, "", MEMORY)],
  ["D.4", "El ciclo de la CPU", (r) => orderQuiz(r, "", FETCH)],
  ["D.5", "Tipos de almacenamiento", (r) => classify(r, STORAGE_TYPES, STORAGE_WORDS)],
  ["D.6", "La CPU: núcleos y velocidad", (r) => quiz(r, "", CPU)],
  ["D.7", "Calcular espacio de almacenamiento", X.storageCalc],

  ["E.1", "¿Qué hace un sistema operativo?", (r) => quiz(r, "", OS_FUNCTIONS)],
  ["E.2", "Sistemas operativos y sus equipos", (r) => classify(r, OS_EXAMPLES, OS_WORDS)],
  ["E.3", "Atajos de teclado", (r) => quiz(r, "", SHORTCUTS)],
  ["E.4", "Extensiones de archivo", (r) => classify(r, FILE_EXT, EXT_WORDS)],
  ["E.5", "Rutas de archivos", (r) => X.fileTree(r, [0])],
  ["E.6", "Contar archivos en carpetas", (r) => X.fileTree(r, [1])],
  ["E.7", "¿En qué carpeta está?", (r) => X.fileTree(r, [2])],

  ["F.1", "Router, servidor, LAN y la nube", (r) => quiz(r, "", NET)],
  ["F.2", "Protocolos de internet", (r) => classify(r, PROTOCOLS, PROTOCOL_WORDS)],
  ["F.3", "Velocidad de descarga", S.transferTime],
  ["F.4", "Partes de una dirección web", X.urlParts],
  ["F.5", "Paquetes de datos", (r) => X.packets(r, [0, 1])],
  ["F.6", "El viaje de los datos", (r) => orderQuiz(r, "", NET_JOURNEY)],

  ["G.1", "Operadores de búsqueda", (r) => quiz(r, "", SEARCH_OPS)],
  ["G.2", "¿Fuente confiable o dudosa?", (r) => classify(r, SOURCES, SOURCE_WORDS)],
  ["G.3", "Noticias falsas y desinformación", (r) => quiz(r, "", FAKE_NEWS)],
  ["G.4", "Citar fuentes y evitar el plagio", (r) => quiz(r, "", CITE)],
  ["G.5", "Dominios de internet", (r) => classify(r, DOMAINS, DOMAIN_WORDS)],
  ["G.6", "Pasos para investigar", (r) => orderQuiz(r, "", SEARCH_STRATEGY)],

  ["H.1", "Correo: Para, CC y CCO", (r) => quiz(r, "", EMAIL)],
  ["H.2", "Netiqueta", (r) => classify(r, NETIQUETTE, NET_WORDS)],
  ["H.3", "Trabajar en la nube", (r) => quiz(r, "", CLOUD_COLLAB)],
  ["H.4", "Escribir y organizar", (r) => orderQuiz(r, "", EMAIL_ORDER)],
  ["H.5", "Videollamadas y clases virtuales", (r) => quiz(r, "", VIDEO_CALL)],
  ["H.6", "Permisos al compartir", (r) => classify(r, PERMISSIONS, PERM_WORDS)],

  ["I.1", "Tipos de malware", (r) => classify(r, MALWARE, MALWARE_WORDS)],
  ["I.2", "Phishing, 2FA y contraseñas", (r) => quiz(r, "", SECURITY)],
  ["I.3", "Huella digital y privacidad", (r) => quiz(r, "", PRIVACY)],
  ["I.4", "¿Cuántas contraseñas posibles?", (r) => X.passwordCombos(r, [0])],
  ["I.5", "Hábitos seguros y riesgosos", (r) => classify(r, SAFE_HABITS, SAFE_WORDS)],
  ["I.6", "Ciberacoso y grooming", (r) => quiz(r, "", CYBERBULLYING)],

  ["J.1", "La función SUMA", (r) => A.sheetFormula(r, ["SUMA"])],
  ["J.2", "La función PROMEDIO", (r) => A.sheetFormula(r, ["PROMEDIO"])],
  ["J.3", "MAX y MIN", (r) => A.sheetFormula(r, ["MAX", "MIN"])],
  ["J.4", "La función SI", (r) => A.sheetFormula(r, ["SI"])],
  ["J.5", "Copiar fórmulas: referencias relativas", (r) => X.sheetRefs(r, [0, 2])],
  ["J.6", "Referencias absolutas con $", (r) => X.sheetRefs(r, [1])],
  ["J.7", "CONTAR.SI y SUMAR.SI", X.countIf],

  ["K.1", "Colores RGB y su código hexadecimal", (r) => X.rgbColor(r, [0, 2])],
  ["K.2", "Leer colores hexadecimales", (r) => X.rgbColor(r, [1])],
  ["K.3", "Resolución y megapíxeles", X.resolution],
  ["K.4", "Mapa de bits o vectorial", (r) => classify(r, VECTOR_BITMAP, VECTOR_WORDS)],
  ["K.5", "Formatos de imagen, audio y video", (r) => classify(r, MEDIA, MEDIA_WORDS)],
  ["K.6", "Compresión con y sin pérdida", (r) => quiz(r, "", COMPRESSION)],
  ["K.7", "Principios de diseño", (r) => quiz(r, "", DESIGN)],

  ["L.1", "micro:bit: botones y contador", (r) => X.microbit(r, [0])],
  ["L.2", "micro:bit: sensor de luz", (r) => X.microbit(r, [1])],
  ["L.3", "micro:bit: bucles", (r) => X.microbit(r, [2])],
  ["L.4", "Sensores, actuadores y controladores", (r) => classify(r, ROBOT_PARTS, ROBOT_WORDS)],
  ["L.5", "Cómo piensa un robot", (r) => quiz(r, "", ROBOTICS)],
  ["L.6", "Robot: funciones", R.functionDestination],

  ["M.1", "print: unir y repetir texto", (r) => P.pyPrint(r, [0, 2, 3])],
  ["M.2", "print con comas, sep y end", (r) => P.pyPrint(r, [1, 4, 5])],
  ["M.3", "Variables: asignar y actualizar", (r) => P.pyVariables(r, [0, 1, 4])],
  ["M.4", "Variables: intercambiar y copiar", (r) => P.pyVariables(r, [2, 3, 5])],
  ["M.5", "Operadores //, % y **", (r) => P.pyArithmetic(r, [0, 1, 2])],
  ["M.6", "Prioridad de operaciones y /", (r) => P.pyArithmetic(r, [3, 4, 5, 6])],
  ["M.7", "La función type()", (r) => P.pyTypes(r, [0])],
  ["M.8", "Convertir tipos e input()", (r) => P.pyTypes(r, [1, 2, 3, 4])],
  ["M.9", "Funciones max, min, round y divmod", (r) => P2.pyBuiltins(r, [0, 1, 2])],
  ["M.10", "Nombres de variables válidos", (r) => classify(r, VAR_NAMES, VAR_WORDS)],
  ["M.11", "Errores comunes", (r) => quiz(r, "", PY_ERRORS)],
  ["M.12", "Ordenar las líneas de un programa", (r) => orderQuiz(r, "", PY_ORDER)],

  ["N.1", "Variables y bucles", (r) => T.scratchVariable(r, 3)],
  ["N.2", "Operadores", T.scratchOperators],
  ["N.3", "Listas", T.scratchList],
  ["N.4", "Polígonos: figura y ángulo", (r) => S.scratchPolygon(r, [0, 2])],
  ["N.5", "Polígonos: perímetro", (r) => S.scratchPolygon(r, [1])],
  ["N.6", "Repetir hasta que…", S.scratchRepeatUntil],
  ["N.7", "Coordenadas x e y", (r) => T.scratchXY(r, 2)],
  ["N.8", "Dirección y giros", S.scratchDirection],
  ["N.9", "Preguntar y responder", X.scratchAskJoin],
  ["N.10", "Movimiento con bucles", X.scratchMotion],

  ["O.1", "Etapas para crear software", (r) => orderQuiz(r, "", PROCESSES)],
  ["O.2", "Software libre, gratuito y propietario", (r) => classify(r, LICENSES, LICENSE_WORDS)],
  ["O.3", "Diseño de interfaces y accesibilidad", (r) => quiz(r, "", UX)],
  ["O.4", "Tipos de software", (r) => classify(r, SOFTWARE_KINDS, KINDS_WORDS)],
  ["O.5", "Roles en un equipo de software", (r) => classify(r, DEV_ROLES, ROLES_WORDS)],
  ["O.6", "Funciones con parámetros", (r) => T.functionCall(r, 2)],

  ["P.1", "Tipos de aprendizaje automático", (r) => classify(r, ML_TYPES, ML_WORDS)],
  ["P.2", "Cómo se crea un modelo de IA", (r) => orderQuiz(r, "", AI_PIPELINE)],
  ["P.3", "Usar la IA generativa con criterio", (r) => quiz(r, "", AI_USE)],
  ["P.4", "Buenas instrucciones (prompts)", T.promptQuality],
  ["P.5", "¿Usa inteligencia artificial?", (r) => classify(r, AI_EVERYDAY, EVERYDAY_WORDS)],
  ["P.6", "Datos de entrenamiento variados", T.betterDataset],
];

export const COMPUTACION_S1 = secundaria(SECTIONS, ROWS);
