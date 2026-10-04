import * as A from "../../../generators/compu/advanced";
import * as P from "../../../generators/compu/python";
import * as P2 from "../../../generators/compu/python2";
import * as S from "../../../generators/compu/secondary";
import * as X from "../../../generators/compu/secondary2";
import { classify, orderQuiz, quiz, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import type { Row } from "../shared";
import { pyErrorItems, secundaria } from "./common";

// Computación · 4.° de Secundaria. Complejidad algorítmica, algoritmos
// clásicos (Euclides, voraces, programación dinámica), estructuras de datos,
// modelación y simulación (情報I), ciencia de datos, bases de datos avanzadas,
// redes y la nube, ciberseguridad y criptografía moderna, desarrollo web,
// computación y sociedad, Python con estructuras de datos y excepciones,
// Scratch, programación orientada a objetos y redes neuronales.

const SECTIONS: Section[] = [
  { id: "A", name: "Complejidad algorítmica", icon: "⏱️" },
  { id: "B", name: "Algoritmos clásicos", icon: "🧮" },
  { id: "C", name: "Estructuras de datos", icon: "🗂️" },
  { id: "D", name: "Modelación y simulación", icon: "📈" },
  { id: "E", name: "Ciencia de datos", icon: "📊" },
  { id: "F", name: "Bases de datos avanzadas", icon: "🗃️" },
  { id: "G", name: "Redes y la nube", icon: "☁️" },
  { id: "H", name: "Ciberseguridad", icon: "🛡️" },
  { id: "I", name: "Desarrollo web", icon: "🕸️" },
  { id: "J", name: "Computación y sociedad", icon: "⚖️" },
  { id: "K", name: "Python: estructuras de datos y errores", icon: "🐍" },
  { id: "L", name: "Scratch", icon: "🐱" },
  { id: "M", name: "Programación y software", icon: "💻" },
  { id: "N", name: "Inteligencia artificial", icon: "🧠" },
];

type Facts = [string, string][];
const words = (ask: string, all: (c: string) => string, statement: (t: string, c: string) => string) => ({ ask, all, statement });

// --- A. Complejidad -----------------------------------------------------------

const BIG_O: Facts = [
  ["Leer el primer elemento de una lista", "O(1)"], ["Sumar dos números", "O(1)"],
  ["Búsqueda binaria en una lista ordenada", "O(log n)"], ["Adivinar un número del 1 al n con «mayor o menor»", "O(log n)"],
  ["Buscar un nombre recorriendo toda la lista", "O(n)"], ["Encontrar el mayor de una lista", "O(n)"], ["Sumar todos los elementos", "O(n)"],
  ["Ordenamiento burbuja", "O(n²)"], ["Comparar cada alumno con todos los demás", "O(n²)"],
];
const BIG_O_WORDS = words("¿Cómo crece el tiempo de este algoritmo?", (c) => `Selecciona los algoritmos que son ${c}.`, (t, c) => `«${t}» es ${c}.`);

const STRATEGIES: ChoiceItem[] = [
  { p: "Probar todas las combinaciones posibles de un candado es…", a: "Fuerza bruta", d: ["Divide y vencerás", "Algoritmo voraz", "Programación dinámica"] },
  { p: "Dar el vuelto usando siempre la moneda más grande posible es un algoritmo…", a: "Voraz", d: ["Recursivo", "De fuerza bruta", "De búsqueda binaria"] },
  { p: "Partir la lista por la mitad, ordenar cada parte y luego unirlas (merge sort) es…", a: "Divide y vencerás", d: ["Fuerza bruta", "Algoritmo voraz", "Búsqueda lineal simple"] },
  { p: "Guardar resultados ya calculados para no repetirlos (como en Fibonacci) es…", a: "Programación dinámica", d: ["Fuerza bruta", "Ordenamiento burbuja", "Divide y vencerás"] },
  { p: "Si duplicas los datos, un algoritmo O(n²) tarda…", a: "Unas 4 veces más", d: ["Lo mismo que antes", "El doble", "Unas 8 veces más"] },
  { p: "¿Por qué importa la complejidad algorítmica?", a: "Predice cómo crece el tiempo con más datos", d: ["Dice cuántas líneas de código tiene", "Mide el precio de la computadora", "Indica qué lenguaje usar siempre"] },
];

const GROWTH: ChoiceItem[] = [
  { p: "Con un millón de datos, ¿qué algoritmo termina antes?", a: "Uno O(log n)", d: ["Uno O(n)", "Uno O(n²)", "Uno O(2ⁿ)"] },
  { p: "¿Cuál crece más rápido cuando n es grande?", a: "2ⁿ", d: ["n²", "n", "log n"] },
  { p: "Un algoritmo tarda 1 s con 1 000 datos y es O(n). ¿Cuánto tardará con 10 000?", a: "Unos 10 s", d: ["Unos 100 s", "1 s", "Unos 2 s"] },
  { p: "Un algoritmo O(n²) tarda 1 s con 1 000 datos. ¿Cuánto con 10 000?", a: "Unos 100 s", d: ["Unos 10 s", "1 s", "Unos 20 s"] },
  { p: "¿Qué complejidad tiene revisar si una lista tiene repetidos comparando todos los pares?", a: "O(n²)", d: ["O(1)", "O(log n)", "O(n)"] },
];

// --- B. Algoritmos clásicos ---------------------------------------------------

const DIVIDE: ChoiceItem[] = [
  { p: "¿Qué hace la estrategia «divide y vencerás»?", a: "Parte el problema, resuelve las partes y las une", d: ["Prueba todas las combinaciones posibles una a una", "Elige siempre la opción que parece mejor ahora", "Pide ayuda a otras computadoras de la red"] },
  { p: "Merge sort une dos listas ordenadas comparando…", a: "Los primeros de cada lista", d: ["Solo los últimos de cada lista", "Elementos al azar de las dos", "Únicamente los números pares"] },
  { p: "En quicksort, ¿qué es el pivote?", a: "El elemento que separa menores y mayores", d: ["El primer error que aparece al ordenar", "La lista que ya está completamente ordenada", "El número de pasadas que hace el algoritmo"] },
  { p: "¿Por qué la búsqueda binaria es un ejemplo de divide y vencerás?", a: "Descarta la mitad en cada paso", d: ["Usa dos computadoras a la vez", "Revisa los datos uno por uno", "Ordena la lista dos veces"] },
  { p: "¿Qué complejidad tiene merge sort?", a: "O(n log n)", d: ["O(n²)", "O(1)", "O(2ⁿ)"] },
];

const VORAZ_DP: ChoiceItem[] = [
  { p: "¿Por qué el algoritmo voraz no siempre da el mínimo de monedas?", a: "Elegir lo mejor ahora no garantiza lo mejor al final", d: ["Porque las monedas grandes valen menos que las chicas", "Porque siempre usa más tiempo que la fuerza bruta", "Porque solo funciona con monedas de un sol"] },
  { p: "Con monedas de 1, 3 y 4, ¿cuántas monedas usa el voraz para 6?", a: "3 (4 + 1 + 1)", d: ["2 (3 + 3)", "1 (6)", "6 (1 × 6)"] },
  { p: "Con monedas de 1, 3 y 4, ¿cuál es el mínimo real para 6?", a: "2 (3 + 3)", d: ["3 (4 + 1 + 1)", "1 (6)", "4 (1 + 1 + 1 + 3)"] },
  { p: "¿Qué guarda la programación dinámica?", a: "Las soluciones de los subproblemas", d: ["Las contraseñas de los usuarios", "Una copia de todo el disco", "Solo el último resultado"] },
  { p: "¿Qué es la memoización?", a: "Recordar resultados ya calculados", d: ["Aprender el código de memoria", "Borrar la memoria RAM", "Escribir notas en papel"] },
];

// --- C. Estructuras de datos ------------------------------------------------

const DS_CONCEPTS: ChoiceItem[] = [
  { p: "¿Qué estructura usa el botón «deshacer»?", a: "Una pila", d: ["Una cola", "Una tabla hash", "Un grafo"] },
  { p: "¿Qué estructura usa una impresora para atender documentos en orden de llegada?", a: "Una cola", d: ["Una pila", "Un árbol", "Un conjunto"] },
  { p: "¿Por qué una tabla hash encuentra datos tan rápido?", a: "Calcula directamente la posición de la clave", d: ["Revisa todos los datos uno por uno", "Ordena la tabla cada vez que busca", "Guarda todos los datos en la pantalla"] },
  { p: "En un árbol binario de búsqueda, ¿dónde están los valores menores que la raíz?", a: "En el subárbol izquierdo", d: ["En el subárbol derecho", "Fuera del árbol", "En la raíz misma"] },
  { p: "¿Qué es una colisión en una tabla hash?", a: "Dos claves que caen en la misma posición", d: ["Dos computadoras que chocan en la red", "Un error que borra toda la tabla", "Una clave que no tiene ningún valor"] },
];

// --- D. Modelación ----------------------------------------------------------

const MODELS: ChoiceItem[] = [
  { p: "¿Qué es un modelo en ciencias de la computación?", a: "Una representación simplificada de la realidad", d: ["Una copia exacta y completa del mundo", "Una persona que posa para fotografías", "Un tipo de computadora muy moderna"] },
  { p: "¿Qué es una simulación?", a: "Ejecutar un modelo para ver qué pasaría", d: ["Mentir sobre los resultados obtenidos", "Copiar los datos de otra persona", "Dibujar un gráfico de barras a mano"] },
  { p: "El método de Monte Carlo usa…", a: "Muchos experimentos al azar", d: ["Una sola prueba muy precisa", "Solo números enteros pares", "Datos tomados de un casino"] },
  { p: "¿Por qué simular un terremoto en la computadora y no esperar uno real?", a: "Es seguro, rápido y se repite muchas veces", d: ["Porque los terremotos no existen", "Porque la simulación siempre es exacta", "Porque así no hace falta construir"] },
  { p: "Una simulación de tráfico no considera la lluvia. ¿Qué pasa?", a: "Sus predicciones serán menos fiables", d: ["Será más precisa que la realidad", "Funcionará igual en todos los casos", "Ya no se podrá ejecutar nunca"] },
  { p: "Un modelo crece un 10% cada año. ¿Qué tipo de crecimiento es?", a: "Exponencial", d: ["Lineal", "Constante", "Negativo"] },
];

const SIM_DESIGN: OrderItem[] = [
  { p: "Pasos para hacer una simulación:", seq: ["Definir la pregunta", "Elegir las variables del modelo", "Programar las reglas", "Ejecutar muchas veces", "Comparar con datos reales"] },
  { p: "Simular la fila de una cafetería:", seq: ["Medir cuántos clientes llegan por minuto", "Medir cuánto tarda cada atención", "Programar llegadas al azar", "Simular un día completo", "Ver cuánto se espera en promedio"] },
  { p: "Mejorar un modelo:", seq: ["Ejecutar el modelo", "Comparar con la realidad", "Encontrar las diferencias", "Ajustar las reglas", "Volver a probar"] },
];

// --- E. Ciencia de datos -------------------------------------------------------

const DATA_SCIENCE: ChoiceItem[] = [
  { p: "¿Qué hace un científico de datos?", a: "Analiza datos para responder preguntas", d: ["Repara computadoras que se malograron", "Diseña los logos de las empresas", "Vende datos personales en internet"] },
  { p: "¿Por qué normalizar datos antes de usarlos en un modelo?", a: "Para que todas las variables tengan escalas parecidas", d: ["Para que los datos ocupen el doble de memoria", "Para borrar los datos que no nos gustan", "Para que los gráficos tengan más colores"] },
  { p: "¿Qué es un valor atípico (outlier)?", a: "Un dato muy distinto a los demás", d: ["El dato más común de la tabla", "Un dato escrito en otro idioma", "El promedio de todos los datos"] },
  { p: "¿Qué es el aprendizaje no supervisado, como k-medias?", a: "Encontrar grupos sin etiquetas previas", d: ["Aprender con respuestas ya marcadas", "Aprender con premios y castigos", "Copiar el resultado de otro modelo"] },
  { p: "¿Qué es big data?", a: "Datos enormes, rápidos y muy variados", d: ["Un disco duro de gran tamaño", "Una tabla con letras grandes", "Un archivo de Excel con colores"] },
];

const DATA_PIPELINE: OrderItem[] = [
  { p: "Proceso de un proyecto de datos:", seq: ["Formular la pregunta", "Recolectar los datos", "Limpiar los datos", "Analizar y visualizar", "Comunicar conclusiones"] },
  { p: "k-medias paso a paso:", seq: ["Elegir k centros al azar", "Asignar cada punto al centro más cercano", "Recalcular cada centro como el promedio", "Repetir hasta que no cambie"] },
  { p: "Preparar datos para un modelo:", seq: ["Quitar duplicados", "Tratar valores vacíos", "Normalizar las escalas", "Separar entrenamiento y prueba"] },
];

// --- F. Bases de datos avanzadas ------------------------------------------------

const NORMALIZATION: ChoiceItem[] = [
  { p: "¿Qué busca la normalización de una base de datos?", a: "Evitar datos repetidos e inconsistentes", d: ["Que todas las tablas tengan el mismo color", "Que la base ocupe mucho más espacio", "Que cada tabla tenga una sola columna"] },
  { p: "Si el nombre del curso se repite en mil matrículas y cambia, ¿qué problema hay?", a: "Hay que cambiarlo en mil lugares", d: ["Se borra la base de datos completa", "No pasa nada en ningún caso", "Se duplican automáticamente"] },
  { p: "¿Qué hace un JOIN en SQL?", a: "Combina filas de dos tablas relacionadas", d: ["Borra las filas repetidas de una sola tabla", "Crea una tabla nueva, vacía y sin columnas", "Ordena una tabla de mayor a menor por nota"] },
  { p: "¿Qué hace GROUP BY?", a: "Agrupa filas iguales para resumirlas", d: ["Borra todas las filas de un mismo grupo", "Ordena las columnas por su nombre", "Une dos bases de datos distintas en una"] },
  { p: "¿Qué es una transacción?", a: "Operaciones que ocurren todas o ninguna", d: ["Una compra hecha con tarjeta de crédito en línea", "Una tabla que se borra al final de cada día", "Un correo que envía la base de datos al usuario"] },
];

const SQL_COMMANDS: Facts = [
  ["CREATE TABLE alumnos (...)", "Definir la estructura"], ["ALTER TABLE alumnos ADD edad INT", "Definir la estructura"], ["DROP TABLE pruebas", "Definir la estructura"],
  ["INSERT INTO alumnos VALUES (...)", "Modificar los datos"], ["UPDATE alumnos SET nota = 15", "Modificar los datos"], ["DELETE FROM alumnos WHERE id = 3", "Modificar los datos"],
  ["SELECT * FROM alumnos", "Consultar los datos"], ["SELECT COUNT(*) FROM cursos", "Consultar los datos"],
];
const SQL_WORDS = words("¿Para qué sirve esta instrucción SQL?", (c) => `Selecciona las instrucciones para: ${c.toLowerCase()}.`, (t, c) => `«${t}» sirve para ${c.toLowerCase()}.`);

// --- G. Redes y la nube ---------------------------------------------------------

const CLIENT_SERVER: ChoiceItem[] = [
  { p: "En el modelo cliente-servidor, ¿qué hace el cliente?", a: "Pide un servicio", d: ["Guarda todos los datos de todos", "Responde a miles de pedidos", "Fabrica los cables de red"] },
  { p: "¿Qué es una red P2P (entre pares)?", a: "Equipos que comparten datos sin servidor central", d: ["Una red con un único servidor muy potente y caro", "Una red solo para dos computadoras de la casa", "Un cable que une dos impresoras de la oficina"] },
  { p: "¿Qué es la latencia?", a: "El tiempo que tarda un dato en llegar", d: ["La cantidad de datos que pasan por segundo", "El tamaño total de un archivo descargado", "La potencia de la antena del router"] },
  { p: "¿Por qué los videos grandes usan servidores repartidos por el mundo (CDN)?", a: "Para estar cerca del usuario y cargar rápido", d: ["Para que los videos ocupen mucho más espacio", "Para que nadie más pueda ver esos videos", "Para cobrar más caro el servicio de internet"] },
  { p: "¿Qué ventaja tiene la computación en la nube?", a: "Usar servidores sin comprarlos", d: ["No necesita internet nunca", "Es siempre gratis para todos", "Funciona sin electricidad"] },
];

const CLOUD_MODELS: Facts = [
  ["Alquilar máquinas virtuales para instalar lo que quieras", "IaaS (infraestructura)"], ["Alquilar almacenamiento y servidores por horas", "IaaS (infraestructura)"],
  ["Subir tu código y que la plataforma lo ejecute", "PaaS (plataforma)"], ["Una base de datos administrada por el proveedor", "PaaS (plataforma)"],
  ["Usar el correo web desde el navegador", "SaaS (aplicaciones)"], ["Editar documentos en línea", "SaaS (aplicaciones)"], ["Una plataforma de videollamadas", "SaaS (aplicaciones)"],
];
const CLOUD_WORDS = words("¿Qué modelo de servicio en la nube es?", (c) => `Selecciona los ejemplos de ${c}.`, (t, c) => `«${t}» es ${c}.`);

// --- H. Ciberseguridad ------------------------------------------------------------

const CRYPTO_ADV: ChoiceItem[] = [
  { p: "En el cifrado de clave pública, ¿con qué se cifra un mensaje para Ana?", a: "Con la clave pública de Ana", d: ["Con la clave privada de Ana", "Con la contraseña del Wi-Fi", "Sin ninguna clave"] },
  { p: "¿Qué es una función hash?", a: "Convierte datos en una huella de tamaño fijo", d: ["Comprime fotos sin perder nada de calidad", "Traduce textos a otros idiomas del mundo", "Ordena listas de números de mayor a menor"] },
  { p: "¿Por qué las webs guardan el hash de tu contraseña y no la contraseña?", a: "Si roban la base, no ven las claves", d: ["Porque el hash ocupa más espacio", "Porque así se recupera más rápido", "Porque la ley prohíbe guardar textos"] },
  { p: "¿Para qué sirve una firma digital?", a: "Probar quién envió algo y que no cambió", d: ["Dibujar la firma a mano con el mouse", "Hacer que el archivo pese mucho menos", "Ocultar el archivo en una carpeta secreta"] },
  { p: "¿Qué es un ataque de fuerza bruta a una contraseña?", a: "Probar muchísimas claves hasta acertar", d: ["Romper la computadora con un golpe", "Pedir la clave por correo falso", "Instalar un antivirus muy potente"] },
];

const ATTACKS: Facts = [
  ["Un correo falso del banco pide tu clave", "Phishing"], ["Un SMS de «premio» con un enlace raro", "Phishing"],
  ["Miles de equipos saturan una web hasta tumbarla", "DDoS"], ["Una botnet inunda de tráfico al servidor", "DDoS"],
  ["Escribir ' OR 1=1 -- en un formulario de login", "Inyección SQL"], ["Meter código SQL en el buscador de una tienda", "Inyección SQL"],
  ["Un programa prueba millones de contraseñas", "Fuerza bruta"], ["Intentar todas las claves de 4 dígitos", "Fuerza bruta"],
  ["Archivos cifrados y una nota que pide bitcoins", "Ransomware"],
];
const ATTACK_WORDS = words("¿Qué tipo de ataque es?", (c) => `Selecciona los casos de: ${c}.`, (t, c) => `«${t}» es un ataque de ${c}.`);

const SECURE_WEB: ChoiceItem[] = [
  { p: "¿Qué es un ataque XSS?", a: "Meter código malicioso que se ejecuta en otros navegadores", d: ["Saturar un servidor con millones de pedidos a la vez", "Adivinar contraseñas probando todas las combinaciones", "Robar una laptop olvidada en una cafetería"] },
  { p: "¿Cómo se evita la inyección SQL?", a: "Con consultas parametrizadas", d: ["Escribiendo todo en mayúsculas", "Comprando más servidores", "Usando contraseñas más cortas"] },
  { p: "¿Por qué una web debe validar los datos también en el servidor?", a: "El navegador se puede manipular", d: ["Para que la página sea más bonita", "Porque el servidor no tiene memoria", "Para que cargue más lento"] },
  { p: "¿Qué es una cookie de sesión robada?", a: "Permite entrar a tu cuenta sin tu clave", d: ["Una galleta que alguien se comió en el recreo", "Un archivo de música que se borró por error", "Un anuncio molesto que no se puede cerrar"] },
  { p: "¿Qué hace el certificado de un sitio HTTPS?", a: "Prueba que el sitio es quien dice ser", d: ["Hace que el sitio cargue sin internet", "Bloquea todos los anuncios de la web", "Guarda tus contraseñas en el navegador"] },
];

// --- I. Desarrollo web --------------------------------------------------------------

const HTTP_METHODS: Facts = [
  ["Ver la lista de productos", "GET (leer)"], ["Abrir el perfil de un usuario", "GET (leer)"],
  ["Enviar el formulario de registro", "POST (crear)"], ["Publicar un comentario nuevo", "POST (crear)"],
  ["Cambiar la foto de perfil", "PUT (actualizar)"], ["Editar el precio de un producto", "PUT (actualizar)"],
  ["Eliminar una publicación", "DELETE (borrar)"], ["Borrar un producto del carrito", "DELETE (borrar)"],
];
const METHOD_WORDS = words("¿Qué método HTTP corresponde a esta acción?", (c) => `Selecciona las acciones que usan ${c}.`, (t, c) => `«${t}» usa ${c}.`);

const WEB_ARCH: ChoiceItem[] = [
  { p: "¿Qué es el frontend de una aplicación web?", a: "La parte que ve y usa el usuario", d: ["El servidor que guarda la base de datos", "El cable que conecta al proveedor", "El contrato con el cliente"] },
  { p: "¿Qué es el backend?", a: "La parte del servidor: lógica y datos", d: ["Los colores y botones de la página", "La parte trasera del monitor", "El teclado del programador"] },
  { p: "El frontend pide datos al backend mediante…", a: "Una API", d: ["Un correo", "Un USB", "Una impresora"] },
  { p: "¿Qué es un framework web (como Django o React)?", a: "Herramientas listas para construir apps más rápido", d: ["Un marco de fotos para el escritorio de la PC", "Un virus que se instala junto con el navegador", "Una red social exclusiva de programadores"] },
  { p: "¿Dónde se guardan los datos de los usuarios de una red social?", a: "En bases de datos del servidor", d: ["Solo en el celular de cada uno", "En la pantalla del usuario", "En el teclado del servidor"] },
];

const JSON_Q: ChoiceItem[] = [
  { p: "¿Qué es JSON?", a: "Un formato de texto para intercambiar datos", d: ["Un lenguaje para hacer estilos de páginas", "Un programa para editar fotografías", "Un protocolo para enviar correos"] },
  { p: "En {\"nombre\": \"Ana\", \"edad\": 14}, ¿qué valor tiene «edad»?", a: "14", d: ["Ana", "edad", "nombre"] },
  { p: "En JSON, ¿cómo se escribe una lista?", a: "Entre corchetes [ ]", d: ["Entre paréntesis ( )", "Entre comillas « »", "Entre signos < >"] },
  { p: "¿A qué estructura de Python se parece un objeto JSON?", a: "A un diccionario", d: ["A un número entero", "A un bucle while", "A una función"] },
  { p: "¿Por qué tantas APIs usan JSON?", a: "Es ligero y fácil de leer para personas y programas", d: ["Es el único formato que existe en el mundo", "Ocupa mucho más espacio que los demás", "Solo funciona en computadoras Windows"] },
];

// --- J. Computación y sociedad --------------------------------------------------------

const ETHICS_TECH: ChoiceItem[] = [
  { p: "Una app gratis vende los datos de sus usuarios a anunciantes. ¿Qué se dice?", a: "Si es gratis, el producto puedes ser tú", d: ["Las apps gratis nunca usan tus datos", "Es ilegal que existan apps gratuitas", "Los anunciantes no compran datos"] },
  { p: "¿Qué es el diseño ético de tecnología?", a: "Pensar en el bienestar de quienes la usan", d: ["Hacer que la app sea lo más adictiva posible", "Usar solo colores que estén de moda", "Ganar dinero sin importar a quién afecte"] },
  { p: "¿Qué es un «patrón oscuro» (dark pattern)?", a: "Un diseño que engaña al usuario", d: ["Un fondo de pantalla en modo oscuro", "Un virus que apaga la pantalla", "Un tipo de letra de color negro"] },
  { p: "Un programador descubre que su app discrimina a un grupo. ¿Qué debería hacer?", a: "Avisar y proponer una corrección", d: ["Callar para no tener problemas", "Borrar las pruebas del error", "Culpar a los usuarios afectados"] },
  { p: "¿Qué significa que la tecnología no es neutral?", a: "Refleja las decisiones de quienes la crean", d: ["Que siempre está apagada al inicio", "Que no tiene ningún color de fondo", "Que solo funciona en ciertos países"] },
];

const OPEN_DATA: ChoiceItem[] = [
  { p: "¿Qué son los datos abiertos?", a: "Datos públicos que cualquiera puede usar", d: ["Datos robados que se publicaron en internet", "Archivos que se abren sin ningún programa", "Contraseñas que se compartieron por error"] },
  { p: "¿Para qué sirve que el Estado publique datos abiertos de presupuesto?", a: "Para que la ciudadanía vigile cómo se gasta", d: ["Para que nadie pueda ver los gastos reales", "Para que los datos ocupen menos espacio", "Para vender esos datos a otros países"] },
  { p: "¿Qué es el software de código abierto?", a: "Software cuyo código se puede ver y mejorar", d: ["Software que se abre sin pedir ninguna contraseña", "Software que siempre es de pago y muy caro", "Software que no tiene ninguna línea de código"] },
  { p: "¿Qué ventaja tiene la ciencia abierta?", a: "Otros pueden revisar y repetir los resultados", d: ["Los científicos ya no necesitan reunir datos", "Los resultados nunca se pueden discutir ni revisar", "Solo una persona en el mundo puede leer el estudio"] },
  { p: "Usas datos abiertos en un proyecto. ¿Qué debes hacer?", a: "Citar la fuente y respetar la licencia", d: ["Decir que tú los recolectaste todos", "Cambiar los números que no te gusten", "Venderlos como si fueran tuyos"] },
];

const PLATFORM_ECON: ChoiceItem[] = [
  { p: "¿Cómo gana dinero la mayoría de redes sociales gratuitas?", a: "Con publicidad dirigida", d: ["Cobrando cada mensaje", "Vendiendo celulares", "Con donaciones del gobierno"] },
  { p: "¿Qué es la economía de plataformas (como apps de taxi o delivery)?", a: "Apps que conectan a quien ofrece y a quien pide un servicio", d: ["Tiendas que solo venden plataformas de madera", "Empresas que fabrican estaciones de tren", "Bancos que prestan dinero para videojuegos"] },
  { p: "¿Qué es el comercio electrónico?", a: "Comprar y vender por internet", d: ["Vender aparatos electrónicos", "Pagar solo en efectivo", "Enviar cartas por correo"] },
  { p: "¿Qué riesgo laboral tiene la economía de plataformas?", a: "Trabajadores sin beneficios ni estabilidad", d: ["Que las apps funcionen demasiado bien", "Que los clientes reciban todo gratis", "Que las empresas paguen más impuestos"] },
  { p: "¿Qué son las criptomonedas?", a: "Dinero digital registrado con criptografía", d: ["Monedas antiguas escondidas en criptas", "Puntos de un videojuego en línea", "Billetes impresos con tinta especial"] },
];

const INCLUSION: ChoiceItem[] = [
  { p: "¿Qué es un lector de pantalla?", a: "Un programa que lee en voz alta lo que hay en pantalla", d: ["Una lupa de vidrio para ver mejor el monitor", "Una persona que lee los mensajes de otros", "Un programa que borra el texto de las páginas"] },
  { p: "¿Qué hace accesible un video para personas sordas?", a: "Subtítulos", d: ["Más volumen", "Más brillo", "Más velocidad"] },
  { p: "¿Por qué traducir apps a lenguas originarias como el quechua?", a: "Para que más personas puedan usarlas", d: ["Para que la app pese menos", "Para que nadie la entienda", "Porque es más barato que el español"] },
  { p: "¿Qué ayuda a personas con daltonismo en un gráfico?", a: "No depender solo del color", d: ["Usar solo rojo y verde", "Quitar todas las etiquetas", "Hacer el gráfico más pequeño"] },
  { p: "¿Qué es la alfabetización digital?", a: "Saber usar la tecnología de forma crítica y segura", d: ["Aprender el alfabeto en una computadora", "Escribir solo con letras mayúsculas", "Tener el celular más caro del mercado"] },
];

const SURVEILLANCE: ChoiceItem[] = [
  { p: "¿Qué riesgo tiene el reconocimiento facial en todas las calles?", a: "Vigilancia masiva y pérdida de privacidad", d: ["Que las cámaras se mojen con la lluvia", "Que la gente camine más rápido", "Que haya más tráfico de autos"] },
  { p: "¿Qué son los metadatos de una foto?", a: "Datos ocultos como fecha, lugar y cámara", d: ["Los colores que tiene la foto original", "Los filtros que le pusiste antes de subirla", "Las personas que salen en ella, con su nombre"] },
  { p: "¿Por qué desactivar la ubicación de las fotos al publicarlas?", a: "Pueden revelar dónde vives o estudias", d: ["Porque así las fotos salen más nítidas", "Porque la ubicación borra los colores", "Porque así gastas más datos móviles"] },
  { p: "¿Qué es el cifrado de extremo a extremo en un chat?", a: "Solo emisor y receptor leen los mensajes", d: ["Que el chat se borra solo al final del día", "Que los mensajes viajan por cable submarino", "Que el servidor lee todo para revisarlo antes"] },
  { p: "¿Qué equilibrio debe buscar una sociedad con la vigilancia?", a: "Seguridad sin perder derechos y privacidad", d: ["Vigilar a todas las personas sin ninguna regla", "Prohibir todas las cámaras que hay en el país", "Dejar que cada empresa decida sola qué hacer"] },
];

// --- K. Python -------------------------------------------------------------------------

const PY_ERRORS = pyErrorItems([
  ['notas = {"Ana": 15}\nprint(notas["Luis"])', "KeyError"], ['d = {"a": 1}\nprint(d["b"] + 1)', "KeyError"],
  ["datos = [1, 2, 3]\nprint(datos[3])", "IndexError"], ['s = "hola"\nprint(s[10])', "IndexError"],
  ["x = 5\nx.append(3)", "AttributeError"], ['texto = "abc"\ntexto.push("d")', "AttributeError"],
  ["print(len(5))", "TypeError"], ["t = (1, 2, 3)\nt[0] = 9", "TypeError"],
  ["import math\nprint(math.sqrt(-1))", "ValueError"], ['n = int("7.5")', "ValueError"],
]);

// --- M. Programación y software ------------------------------------------------------

const OOP: ChoiceItem[] = [
  { p: "En programación orientada a objetos, ¿qué es una clase?", a: "Un molde que define atributos y métodos", d: ["Un salón donde se enseña a programar", "Una variable que guarda solo números", "Un error que detiene el programa"] },
  { p: "¿Qué es un objeto?", a: "Un ejemplar creado a partir de una clase", d: ["Cualquier archivo guardado en la PC", "Un comentario dentro del código", "Una lista que no se puede cambiar"] },
  { p: "En la clase Perro, «ladrar()» es…", a: "Un método", d: ["Un atributo", "Una clase", "Un módulo"] },
  { p: "En la clase Perro, «nombre» y «edad» son…", a: "Atributos", d: ["Métodos", "Bucles", "Módulos"] },
  { p: "Gato y Perro heredan de Animal. ¿Qué ventaja da la herencia?", a: "Reutilizar el código común", d: ["Que el programa no tenga errores", "Que los objetos sean invisibles", "Que no se necesiten métodos"] },
  { p: "Ocultar los datos internos y usarlos solo con métodos se llama…", a: "Encapsulamiento", d: ["Herencia", "Recursión", "Compilación"] },
];

const API: ChoiceItem[] = [
  { p: "¿Qué es una API?", a: "Una forma de que programas se comuniquen", d: ["Un tipo de virus de la red local", "Un lenguaje de programación nuevo", "Una pieza de hardware del servidor"] },
  { p: "Una app del clima muestra datos de otro servicio. ¿Qué usa probablemente?", a: "Una API del servicio del clima", d: ["Un termómetro dentro del celular", "Un cable conectado al satélite", "Una hoja de cálculo hecha a mano"] },
  { p: "¿Qué es una biblioteca (librería) de código?", a: "Código listo que puedes reutilizar", d: ["Un edificio con libros de Python", "Un archivo que no se puede abrir", "Un error que se repite siempre"] },
  { p: "¿Qué formato de datos usan muchas APIs web?", a: "JSON", d: ["XLSX", "MP3", "EXE"] },
  { p: "En Python, ¿qué hace «import random»?", a: "Trae un módulo con funciones de azar", d: ["Crea un número aleatorio al instante", "Borra las variables del programa", "Instala Python en la computadora"] },
];

const TESTING: ChoiceItem[] = [
  { p: "¿Qué es una prueba unitaria?", a: "Una prueba automática de una sola función", d: ["Una prueba que hace un solo usuario a mano", "Un examen escrito sobre programación", "Una revisión del diseño de la pantalla"] },
  { p: "En Python, ¿qué hace «assert suma(2, 3) == 5»?", a: "Da error si la condición es falsa", d: ["Imprime el número 5 en pantalla", "Cambia el resultado de la función", "Borra la función si está mal"] },
  { p: "¿Qué es una prueba de integración?", a: "Probar que varias partes funcionan juntas", d: ["Probar una sola línea de código", "Probar el color de los botones", "Probar la velocidad del internet"] },
  { p: "¿Por qué automatizar las pruebas?", a: "Se repiten rápido tras cada cambio", d: ["Para no tener que programar nunca", "Porque así el código tiene más errores", "Para que el programa pese menos"] },
  { p: "¿Qué es el desarrollo guiado por pruebas (TDD)?", a: "Escribir la prueba antes que el código", d: ["Probar solo cuando el cliente se queja", "Escribir el código sin ninguna prueba", "Dejar que los usuarios encuentren errores"] },
];

// --- N. Inteligencia artificial --------------------------------------------------------

const NEURAL: ChoiceItem[] = [
  { p: "En una red neuronal, ¿qué hacen los pesos?", a: "Indican cuánto importa cada entrada", d: ["Miden cuánto pesa la computadora", "Guardan las fotos del entrenamiento", "Cuentan cuántas neuronas hay"] },
  { p: "¿Qué se ajusta durante el entrenamiento de una red neuronal?", a: "Los pesos y sesgos", d: ["El tamaño de la pantalla", "El número de usuarios", "La velocidad del internet"] },
  { p: "¿Qué tienen de especial las redes de «aprendizaje profundo»?", a: "Muchas capas de neuronas", d: ["Funcionan bajo el agua", "Usan una sola neurona", "No necesitan ningún dato"] },
  { p: "¿Qué tipo de red se usa mucho para reconocer imágenes?", a: "Red convolucional (CNN)", d: ["Red de área local (LAN)", "Red eléctrica de la casa", "Red social de fotografías"] },
  { p: "¿Qué mide la función de pérdida (loss)?", a: "Qué tan lejos están las predicciones", d: ["Cuántos datos se han perdido", "Cuánta batería usa el modelo", "Cuántas capas tiene la red"] },
];

const GENAI: ChoiceItem[] = [
  { p: "¿Qué es un modelo de lenguaje grande (LLM)?", a: "Una IA entrenada con muchísimo texto", d: ["Un diccionario impreso muy grande", "Un traductor que usa reglas fijas", "Un buscador que copia páginas web"] },
  { p: "¿Cómo genera texto un LLM?", a: "Predice la siguiente palabra (token)", d: ["Copia frases de un libro al azar", "Busca la respuesta en una tabla fija", "Un humano escribe cada respuesta"] },
  { p: "¿Qué es un token para un LLM?", a: "Un trozo de texto, como parte de una palabra", d: ["Una moneda para pagar el servicio", "La contraseña de la cuenta de IA", "Una imagen que acompaña el texto"] },
  { p: "¿Por qué un LLM puede inventar datos falsos?", a: "Genera lo probable, no lo verificado", d: ["Porque quiere engañar a propósito", "Porque su internet es muy lento", "Porque solo conoce palabras cortas"] },
  { p: "Una imagen muy realista de un político circula sin fuente. ¿Qué haces?", a: "Dudo y busco si fue generada por IA", d: ["La comparto rápido porque es noticia", "La creo porque las fotos no mienten", "Le pongo un filtro y la publico"] },
];

const ROWS: Row[] = [
  ["A.1", "Contar pasos: bucles anidados y seguidos", (r) => P.pyComplexity(r, [0, 2])],
  ["A.2", "Contar pasos: duplicar y pares", (r) => P.pyComplexity(r, [1, 3])],
  ["A.3", "Notación Big O", (r) => classify(r, BIG_O, BIG_O_WORDS)],
  ["A.4", "Estrategias para diseñar algoritmos", (r) => quiz(r, "", STRATEGIES)],
  ["A.5", "Fibonacci recursivo: ¿cuántas llamadas?", X.fibCalls],
  ["A.6", "Cómo crecen los algoritmos", (r) => quiz(r, "", GROWTH)],

  ["B.1", "Algoritmo de Euclides: el MCD", (r) => X.euclid(r, [0])],
  ["B.2", "Algoritmo de Euclides: los pasos", (r) => X.euclid(r, [1])],
  ["B.3", "Algoritmo voraz: dar el vuelto", (r) => X.coinChange(r, [0])],
  ["B.4", "Programación dinámica: mínimo de monedas", (r) => X.coinChange(r, [1])],
  ["B.5", "Divide y vencerás", (r) => quiz(r, "", DIVIDE)],
  ["B.6", "Voraz o programación dinámica", (r) => quiz(r, "", VORAZ_DP)],

  ["C.1", "Pilas", (r) => X.stackQueueOps(r, [0])],
  ["C.2", "Colas", (r) => X.stackQueueOps(r, [1])],
  ["C.3", "Tablas hash", (r) => X.hashIndex(r, [0])],
  ["C.4", "Colisiones y sondeo lineal", (r) => X.hashIndex(r, [1])],
  ["C.5", "Árboles binarios de búsqueda", X.bstTree],
  ["C.6", "¿Qué estructura conviene?", (r) => quiz(r, "", DS_CONCEPTS)],

  ["D.1", "Simular crecimiento porcentual", (r) => S.simulation(r, [0])],
  ["D.2", "Simular ahorro", (r) => S.simulation(r, [1])],
  ["D.3", "Simular rebotes", (r) => S.simulation(r, [2])],
  ["D.4", "Modelos y simulaciones", (r) => quiz(r, "", MODELS)],
  ["D.5", "Analizar datos con la hoja de cálculo", (r) => A.sheetFormula(r, ["PROMEDIO", "MAX", "MIN", "SI"])],
  ["D.6", "Pasos de una simulación", (r) => orderQuiz(r, "", SIM_DESIGN)],

  ["E.1", "Normalizar datos", X.minMaxNorm],
  ["E.2", "k-medias: nuevo centro", (r) => X.kmeansStep(r, [1])],
  ["E.3", "Medidas de tendencia central", S.statistics],
  ["E.4", "El grupo con más ventas", (r) => X.sqlGroupBy(r, [2])],
  ["E.5", "Conceptos de ciencia de datos", (r) => quiz(r, "", DATA_SCIENCE)],
  ["E.6", "Proceso de un proyecto de datos", (r) => orderQuiz(r, "", DATA_PIPELINE)],

  ["F.1", "JOIN: contar matrículas", (r) => X.sqlJoin(r, [0])],
  ["F.2", "JOIN: sumar horas", (r) => X.sqlJoin(r, [1])],
  ["F.3", "GROUP BY", (r) => X.sqlGroupBy(r, [0, 1])],
  ["F.4", "UPDATE y consultas", X.sqlUpdate],
  ["F.5", "Normalización, JOIN y transacciones", (r) => quiz(r, "", NORMALIZATION)],
  ["F.6", "Instrucciones SQL", (r) => classify(r, SQL_COMMANDS, SQL_WORDS)],

  ["G.1", "Subredes y máscaras", X.subnetHosts],
  ["G.2", "Tablas de rutas", X.routing],
  ["G.3", "Tiempo de transferencia", S.transferTime],
  ["G.4", "Paquetes y direcciones", X.packets],
  ["G.5", "Cliente-servidor, P2P y latencia", (r) => quiz(r, "", CLIENT_SERVER)],
  ["G.6", "IaaS, PaaS y SaaS", (r) => classify(r, CLOUD_MODELS, CLOUD_WORDS)],

  ["H.1", "Cifrado César con cualquier clave", (r) => A.caesar(r, 25)],
  ["H.2", "Clave pública, hash y firma digital", (r) => quiz(r, "", CRYPTO_ADV)],
  ["H.3", "Tipos de ataques", (r) => classify(r, ATTACKS, ATTACK_WORDS)],
  ["H.4", "Cifrado de Vigenère", X.vigenere],
  ["H.5", "RSA de juguete: cifrar", (r) => X.rsaToy(r, [0])],
  ["H.6", "Seguridad en aplicaciones web", (r) => quiz(r, "", SECURE_WEB)],

  ["I.1", "JavaScript: variables y bucles", (r) => X.jsOutput(r, [0, 2])],
  ["I.2", "JavaScript: textos y filtros", (r) => X.jsOutput(r, [1, 3])],
  ["I.3", "Selectores CSS", X.cssSelector],
  ["I.4", "Métodos HTTP", (r) => classify(r, HTTP_METHODS, METHOD_WORDS)],
  ["I.5", "Frontend, backend y APIs", (r) => quiz(r, "", WEB_ARCH)],
  ["I.6", "El formato JSON", (r) => quiz(r, "", JSON_Q)],

  ["J.1", "Ética en el diseño de tecnología", (r) => quiz(r, "", ETHICS_TECH)],
  ["J.2", "Datos abiertos y código abierto", (r) => quiz(r, "", OPEN_DATA)],
  ["J.3", "Economía digital", (r) => quiz(r, "", PLATFORM_ECON)],
  ["J.4", "Tecnología inclusiva", (r) => quiz(r, "", INCLUSION)],
  ["J.5", "Vigilancia y privacidad", (r) => quiz(r, "", SURVEILLANCE)],
  ["J.6", "¿Cuánto resiste una contraseña?", (r) => X.passwordCombos(r, [1])],

  ["K.1", "Diccionarios: leer y cambiar", (r) => P.pyDicts(r, [0, 1, 2])],
  ["K.2", "Diccionarios: recorrer y contar", (r) => P.pyDicts(r, [3, 4, 5])],
  ["K.3", "Listas por comprensión", (r) => P.pyComprehension(r, [0, 1])],
  ["K.4", "Comprensiones con sum y len", (r) => P.pyComprehension(r, [2, 3])],
  ["K.5", "split, join y strip", (r) => P.pyStrMethods(r, [0, 1, 2])],
  ["K.6", "replace y f-strings", (r) => P.pyStrMethods(r, [3, 4])],
  ["K.7", "Excepciones: try, except y finally", P.pyExceptions],
  ["K.8", "Alcance de variables y global", (r) => P.pyScope(r, [0, 3])],
  ["K.9", "Parámetros por defecto", (r) => P.pyScope(r, [1, 2])],
  ["K.10", "Módulos math y random", P.pyModules],
  ["K.11", "KeyError, IndexError y otros errores", (r) => quiz(r, "", PY_ERRORS)],
  ["K.12", "Conjuntos (set)", P2.pySets],
  ["K.13", "Tuplas", P2.pyTuples],
  ["K.14", "Comprensión de diccionarios", P2.pyDictComp],

  ["L.1", "Recursión: árboles fractales", (r) => S.scratchRecursion(r, 2)],
  ["L.2", "Sumar con condición en una lista", S.scratchListSum],
  ["L.3", "Simular la gravedad", S.scratchGravity],
  ["L.4", "Polígonos con el lápiz", S.scratchPolygon],
  ["L.5", "Bucles anidados", S.scratchNested],
  ["L.6", "Operadores matemáticos", X.scratchMathBlocks],

  ["M.1", "Clases, objetos y herencia", (r) => quiz(r, "", OOP)],
  ["M.2", "APIs y bibliotecas", (r) => quiz(r, "", API)],
  ["M.3", "Pruebas automáticas", (r) => quiz(r, "", TESTING)],
  ["M.4", "Árboles de búsqueda en código", (r) => X.bstTree(r, [2])],

  ["N.1", "La neurona artificial (perceptrón)", S.perceptron],
  ["N.2", "Redes neuronales", (r) => quiz(r, "", NEURAL)],
  ["N.3", "IA generativa y modelos de lenguaje", (r) => quiz(r, "", GENAI)],
  ["N.4", "Descenso del gradiente", X.gradientStep],
  ["N.5", "Tokens", X.tokenCount],
  ["N.6", "Matriz de confusión", X.confusion],
];

export const COMPUTACION_S4 = secundaria(SECTIONS, ROWS);
