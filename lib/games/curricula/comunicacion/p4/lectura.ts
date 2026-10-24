import { choose, order, readPassage, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Primaria · banco de comprensión con lecturas propias, cercanas a los
// alumnos (Perú y Latinoamérica). Las alusiones usan fuentes conocidas en
// castellano (mitos griegos, fábulas, el Quijote).


// --- Idea principal -------------------------------------------------------

const DETAILS = "¿Qué idea principal unen estos detalles?";
const KEY_DETAILS: ChoiceItem[] = [
  pt(DETAILS, "• La quinua tiene muchas proteínas.\n• Crece en suelos fríos y secos.\n• Se cultiva en los Andes desde hace miles de años.", "La quinua es un alimento andino muy valioso.", "La quinua solo crece en lugares calientes y húmedos.", "Los Andes son montañas altas."),
  pt(DETAILS, "• Los delfines se llaman entre sí con silbidos.\n• Cazan en grupo.\n• Cuidan a los delfines heridos.", "Los delfines viven y cooperan en grupo.", "Los delfines son peces.", "Los delfines prefieren vivir solos en el fondo del mar."),
  pt(DETAILS, "• Leer mejora el vocabulario.\n• Leer ayuda a concentrarse.\n• Leer permite conocer otros lugares.", "Leer trae muchos beneficios.", "Los libros son muy caros.", "Hay que leer solamente en la biblioteca de la escuela."),
  pt(DETAILS, "• El colibrí bate sus alas 50 veces por segundo.\n• Puede volar hacia atrás.\n• Se queda quieto en el aire frente a una flor.", "El colibrí vuela de una manera sorprendente.", "El colibrí come muchas flores de colores cada día.", "Todas las aves vuelan igual."),
  pt(DETAILS, "• En el reciclaje, el papel usado se vuelve papel nuevo.\n• Las botellas se convierten en ropa.\n• Se bota menos basura.", "Reciclar permite aprovechar lo que ya se usó.", "El papel se hace con botellas.", "La basura debe quemarse lejos de las casas y los ríos."),
  pt(DETAILS, "• Los incas construyeron puentes colgantes.\n• Hicieron caminos de piedra por las montañas.\n• Los chasquis llevaban mensajes corriendo.", "Los incas lograron comunicar un territorio enorme.", "Los incas no conocían las montañas.", "Los chasquis eran los mejores constructores de puentes."),
  pt(DETAILS, "• Dormir bien ayuda a crecer.\n• Con sueño es difícil prestar atención.\n• El cuerpo se repara mientras dormimos.", "Dormir bien es necesario para la salud.", "Los niños duermen menos que los adultos mayores.", "Soñar es divertido."),
  pt(DETAILS, "• El desierto de Sechura casi no recibe lluvia.\n• De día hace mucho calor.\n• Pocas plantas logran vivir allí.", "El desierto es un lugar difícil para vivir.", "En el desierto llueve todas las tardes del verano.", "El desierto es frío."),
];

const MAIN_PASSAGES = [
  read("Las líneas de Nasca", "🏜️", "En el desierto del sur del Perú hay enormes dibujos trazados en el suelo: un mono, un colibrí, una araña. Los hizo el pueblo nasca hace unos dos mil años, retirando las piedras oscuras de la superficie. Son tan grandes que solo se ven completos desde el aire. Hasta hoy, los científicos discuten para qué servían.",
    ["¿Cuál es la idea principal del texto?", "Las líneas de Nasca son dibujos antiguos, enormes y aún misteriosos.", "El desierto del sur del Perú es un lugar seco.", "Los científicos viajan en avioneta por el Perú para estudiar a los monos y colibríes."],
    ["¿Qué detalle apoya que los dibujos son enormes?", "Solo se ven completos desde el aire.", "Los hizo el pueblo nasca.", "Están en el sur del Perú, donde casi nunca llueve."],
    ["¿Qué título también le quedaría bien al texto?", "Dibujos gigantes en el desierto", "Cómo dibujar un mono", "Los animales que viven hoy en el desierto peruano"]),
  read("El trabajo de las abejas", "🐝", "Las abejas hacen mucho más que miel. Cuando vuelan de flor en flor, llevan polen pegado en el cuerpo. Gracias a ese polen, las plantas pueden dar frutos y semillas. Sin las abejas, tendríamos menos manzanas, paltas y fresas. Por eso, cuidar a las abejas es cuidar nuestra comida.",
    ["¿Cuál es la idea principal del texto?", "Las abejas son necesarias para que las plantas den frutos.", "La miel es dulce.", "Las manzanas, las paltas y las fresas son las frutas más ricas que existen."],
    ["¿Qué oración resume mejor el último mensaje del texto?", "Proteger a las abejas nos conviene a todos.", "Hay que comer más miel en el desayuno.", "Las flores no necesitan a nadie."],
    ["¿Qué detalle NO apoya la idea principal?", "La miel se guarda en frascos de vidrio.", "Las abejas llevan polen de flor en flor.", "Sin abejas habría menos frutas."]),
];

const MAIN_ANALYZE = [
  read("Un tejido que cuenta historias", "🧶", "En la isla de Taquile, en el lago Titicaca, tejer es cosa de todos. Los niños aprenden desde pequeños. En cada chullo y en cada faja, los tejedores colocan figuras: aves, flores, chacras. Esas figuras cuentan quién es la persona, si está casada y qué sucedió en el año. Para los taquileños, un tejido se lee como un libro.",
    ["¿Cuál es la idea principal?", "En Taquile, los tejidos sirven para comunicar la vida de la gente.", "El lago Titicaca es muy grande y frío.", "Los chullos abrigan la cabeza."],
    ["¿Por qué el autor compara un tejido con un libro?", "Porque las figuras del tejido guardan información que se puede interpretar.", "Porque los tejidos tienen páginas.", "Porque en Taquile se venden muchos libros con dibujos de aves, flores y chacras."],
    ["¿Qué detalle muestra que tejer es importante en Taquile?", "Los niños aprenden a tejer desde pequeños.", "La isla queda en un lago.", "Algunos tejidos tienen flores de colores muy vivos."]),
  read("El agua que viaja", "💧", "El agua del planeta nunca se queda quieta. El sol calienta los mares y el agua sube como vapor. En lo alto se enfría y forma nubes. Luego cae como lluvia, nieve o granizo. Esa agua corre por los ríos y vuelve al mar, donde todo empieza otra vez. A este viaje sin fin lo llamamos ciclo del agua.",
    ["¿Cuál es la idea principal?", "El agua recorre un ciclo que se repite sin parar.", "La lluvia moja los campos.", "El sol calienta más en el verano que en el invierno, sobre todo cerca del mar."],
    ["¿Qué palabras del texto refuerzan la idea de repetición?", "«Nunca se queda quieta» y «empieza otra vez»", "«Nieve o granizo»", "«El sol calienta los mares y el agua»"],
    ["¿Qué paso ocurre justo antes de que llueva?", "El vapor se enfría y forma nubes.", "El agua vuelve al mar por los ríos.", "El sol se oculta."]),
];

const TWO = "¿Qué idea comparten los dos textos?";
const TWO_MAIN: ChoiceItem[] = [
  pt(TWO, "Texto 1: Caminar media hora al día fortalece el corazón y mejora el ánimo.\nTexto 2: Los niños que juegan al aire libre duermen mejor y se enferman menos.", "Moverse es bueno para la salud.", "Dormir es más importante que jugar.", "Caminar es mejor que cualquier otro ejercicio conocido."),
  pt(TWO, "Texto 1: El cóndor andino está en peligro porque pierde su hogar.\nTexto 2: Quedan pocos osos de anteojos, pues los bosques donde viven se talan.", "Algunos animales peligran al perder su hábitat.", "El cóndor y el oso de anteojos comen lo mismo.", "Los bosques crecen rápido."),
  pt(TWO, "Texto 1: Con el quipu, los incas llevaban las cuentas usando nudos.\nTexto 2: Los egipcios anotaban sus cosechas con dibujos llamados jeroglíficos.", "Los pueblos antiguos inventaron formas de registrar datos.", "Los incas y los egipcios se conocieron.", "Los nudos son más fáciles de leer que los dibujos y las letras."),
  pt(TWO, "Texto 1: En la feria, cada familia vende lo que cultiva en su chacra.\nTexto 2: En el mercado del barrio, los vecinos compran directo a los productores.", "Comprar y vender entre vecinos une a la comunidad.", "Las ferias son ruidosas.", "En los mercados todo cuesta más caro que en las tiendas grandes."),
  pt(TWO, "Texto 1: Marie Curie repitió sus experimentos durante años hasta lograrlo.\nTexto 2: Antes de volar, los hermanos Wright construyeron muchos aviones que fallaron.", "Los grandes logros exigen perseverancia.", "Los inventos salen bien a la primera.", "Los científicos y los inventores siempre trabajan solos y en secreto."),
  pt(TWO, "Texto 1: Apagar la luz al salir de un cuarto ahorra energía.\nTexto 2: Cerrar el caño mientras te cepillas ahorra muchos litros de agua.", "Los pequeños hábitos ayudan a cuidar los recursos.", "El agua y la luz son gratis.", "Solo las fábricas deben ahorrar energía y agua todos los días."),
];

// --- Inferencias y tema ---------------------------------------------------

const BOOK_TITLES = pool([
  ["🧗‍♀️🏔️", "La cumbre más alta"], ["🔭🪐", "Vecinos del sistema solar"], ["🐢🌊", "El largo viaje de la tortuga"], ["🕵️🔍", "El caso del collar perdido"],
  ["👩‍🍳🥘", "Recetas de mi abuela"], ["🚂🌄", "El tren de los Andes"], ["🦖🦴", "Gigantes de la prehistoria"], ["⚽🏆", "La final del campeonato"],
  ["🏰🐉", "El dragón del castillo"], ["🌱🪴", "Mi primer huerto"],
], "pic");

const INFER: ChoiceItem[] = [
  pt("¿Qué se puede inferir?", "Rosa miró el cielo gris, volvió a entrar y salió con botas y paraguas.", "Rosa cree que va a llover.", "Rosa va a la playa.", "Rosa perdió sus zapatos nuevos en el camino a casa."),
  pt("¿Qué se puede inferir?", "Al abrir la lonchera, Tomás suspiró y le ofreció su sándwich a un amigo.", "A Tomás no le gustó su comida.", "Tomás tenía muchísima hambre desde la mañana.", "Tomás olvidó la lonchera."),
  pt("¿Qué se puede inferir?", "Las luces se apagaron, la gente dejó de hablar y se abrió el telón.", "Va a comenzar una función de teatro.", "Hubo un apagón.", "La gente se está yendo del cine porque terminó la película."),
  pt("¿Qué se puede inferir?", "Camila tenía las manos frías, repasaba sus apuntes y miraba el reloj a cada rato.", "Camila está nerviosa por un examen.", "Camila está aburrida.", "Camila acaba de regresar de sus vacaciones en la playa."),
  pt("¿Qué se puede inferir?", "El perro olfateó la puerta, movió la cola y empezó a dar saltos.", "Llegó alguien que el perro conoce.", "El perro tiene miedo de la tormenta que se acerca.", "El perro está enfermo."),
  pt("¿Qué se puede inferir?", "Don Julio guardó las redes, amarró el bote y contó los pescados de la canasta.", "Don Julio es pescador y terminó su jornada.", "Don Julio vende botes.", "Don Julio va a salir de paseo con sus nietos por el río."),
  pt("¿Qué se puede inferir?", "En el salón había globos, una torta con diez velas y una caja envuelta.", "Alguien cumple diez años.", "Es el último día de clases del año escolar.", "Hay un concurso."),
  pt("¿Qué se puede inferir?", "Las hojas de la planta estaban caídas y la tierra de la maceta, agrietada.", "A la planta le falta agua.", "La planta acaba de florecer con mucha fuerza.", "La planta es de plástico."),
];

const INFER_SUPPORT = [
  read("La carta", "✉️", "Abril corrió hasta la puerta cuando oyó la moto del cartero. Recibió el sobre con las dos manos y leyó el remitente tres veces. Luego subió las escaleras de dos en dos gritando: «¡Mamá, me respondieron del concurso de cuentos!».",
    ["¿Qué se puede inferir sobre Abril?", "Esperaba esa carta con muchas ganas.", "No sabía leer el remitente.", "Tenía miedo del cartero y de su moto ruidosa."],
    ["¿Qué detalle apoya esa inferencia?", "Corrió hasta la puerta al oír la moto.", "El cartero llegó en moto.", "El sobre era de papel."],
    ["¿Qué se puede inferir del grito de Abril?", "Había enviado un cuento a un concurso.", "Su mamá trabaja en el correo del pueblo.", "No quería abrir el sobre."]),
  read("El partido", "⚽", "Faltaban dos minutos y el marcador seguía empatado. Renato se amarró otra vez los chimpunes, respiró hondo y miró a la tribuna. Allí estaba su abuelo, con la misma gorra de siempre. Renato sonrió y pidió la pelota.",
    ["¿Qué se puede inferir sobre Renato?", "Ver a su abuelo le dio confianza.", "Quería irse del partido.", "Estaba molesto con su abuelo por haber llegado tarde."],
    ["¿Qué detalle apoya esa inferencia?", "Sonrió y pidió la pelota.", "El marcador estaba empatado.", "Faltaban dos minutos para terminar el partido."],
    ["¿Qué se puede inferir del abuelo?", "Suele ir a ver los partidos de Renato.", "Es el árbitro.", "Nunca antes había visto jugar a su nieto en una cancha."]),
];

const PREDICT: ChoiceItem[] = [
  pt("¿Qué es más probable que pase después?", "Inés olvidó cerrar la jaula. Cuando volvió, la puerta estaba abierta y había plumas en la ventana.", "Inés buscará a su pájaro.", "Inés comprará una jaula más grande y más cara.", "Inés se irá a dormir."),
  pt("¿Qué es más probable que pase después?", "El río creció toda la noche. Al amanecer, el agua ya tocaba el puente de madera.", "Los vecinos evitarán cruzar el puente.", "Los niños irán a nadar.", "El puente se volverá de piedra para resistir mejor el agua."),
  pt("¿Qué es más probable que pase después?", "Bruno estudió toda la semana y resolvió todos los ejercicios de práctica sin errores.", "A Bruno le irá bien en el examen.", "Bruno faltará al examen.", "Bruno olvidará todo lo que estudió apenas llegue al salón."),
  pt("¿Qué es más probable que pase después?", "La masa llevaba una hora en el horno y de la cocina salía olor a quemado.", "El pan saldrá chamuscado.", "El pan quedará crudo por dentro y muy pálido por fuera.", "El horno se apagará solo."),
  pt("¿Qué es más probable que pase después?", "Valeria regó y abonó su girasol cada día. Hoy apareció un botón amarillo.", "El girasol florecerá pronto.", "El girasol se marchitará sin motivo esa misma tarde.", "Valeria lo arrancará."),
  pt("¿Qué es más probable que pase después?", "Los jugadores llegaron sin dormir y sin haber entrenado en todo el mes.", "Jugarán peor de lo habitual.", "Ganarán el torneo con facilidad y sin cansarse nada.", "El rival se rendirá."),
  pt("¿Qué es más probable que pase después?", "El cielo se oscureció, sopló un viento helado y cayeron las primeras gotas.", "Empezará a llover con fuerza.", "Saldrá el sol.", "La gente tenderá su ropa recién lavada en las azoteas."),
  pt("¿Qué es más probable que pase después?", "Mateo prometió cuidar al perro, pero lleva tres días sin sacarlo a pasear.", "Sus padres hablarán con Mateo.", "El perro aprenderá a pasearse solo por todo el barrio.", "Le regalarán otro perro."),
];

const FABLES = [
  read("La hormiga y la paloma", "🐜", "Una hormiga cayó a un arroyo y la corriente la arrastraba. Una paloma la vio y dejó caer una hoja; la hormiga subió y llegó a la orilla. Días después, un cazador apuntó a la paloma. La hormiga le picó el pie, el cazador gritó y la paloma escapó volando.",
    ["¿Cuál es el tema de la fábula?", "El bien que haces vuelve a ti.", "Los pequeños siempre pierden.", "Nunca hay que acercarse a los arroyos ni a los cazadores."],
    ["¿Qué hecho muestra ese tema?", "La hormiga salvó a la paloma que antes la había salvado.", "La corriente arrastró a la hormiga.", "El cazador gritó."],
    ["¿Qué enseñanza deja sobre el tamaño?", "Hasta el más pequeño puede ayudar.", "Solo los grandes son valientes.", "Las aves vuelan más rápido que cualquier insecto del bosque."]),
  read("El origen del lago", "🏞️", "Cuentan en el altiplano que, hace mucho, hubo un valle fértil donde nadie pasaba hambre. Los dioses pusieron una sola regla: no subir al cerro del fuego sagrado. Pero la gente, por ambición, subió a buscarlo. Entonces los pumas bajaron del cerro y el cielo lloró cuarenta días. Del valle inundado nació el lago Titicaca.",
    ["¿Cuál es el tema de la leyenda?", "La ambición trae consecuencias.", "Los pumas son peligrosos.", "Los valles fértiles siempre terminan convertidos en lagos muy grandes."],
    ["¿Qué explica esta leyenda?", "Cómo se formó el lago Titicaca.", "Por qué los pumas viven en los cerros del altiplano.", "Cómo se hace el fuego."],
    ["¿Qué acción de los personajes causó el castigo?", "Desobedecer la única regla.", "Sembrar en el valle.", "Pedir lluvia a los dioses durante cuarenta días seguidos."]),
];

const THEMES = [
  read("El dibujo de Sofía", "🎨", "Sofía borró su dibujo por quinta vez. «Nunca me saldrá como el de Daniela», pensó. La profesora se acercó y le pidió que lo terminara a su manera. Sofía pintó el cielo de morado y los árboles de azul. Al final de la clase, todos querían saber cómo se le había ocurrido.",
    ["¿Cuál es el tema del cuento?", "Vale más ser auténtico que imitar a otros.", "Dibujar es muy difícil.", "Hay que borrar los dibujos muchas veces para que queden perfectos."],
    ["¿Qué detalle del final apoya el tema?", "Todos querían saber cómo se le ocurrió.", "La clase terminó.", "La profesora se acercó a mirar el cuaderno de Sofía."],
    ["¿Cómo cambia Sofía en el cuento?", "Pasa de dudar de sí misma a confiar en sus ideas.", "Pasa de estar alegre a enojarse.", "No cambia en nada."]),
  read("La bicicleta prestada", "🚲", "Iván rompió el timbre de la bicicleta que le prestó su primo. Podía devolverla callado: quizá nadie lo notaría. Pasó la tarde con un nudo en el estómago. Por fin tocó la puerta y contó lo que pasó. Su primo se rio: «Ese timbre ya estaba flojo. Gracias por decírmelo».",
    ["¿Cuál es el tema del cuento?", "Decir la verdad da tranquilidad.", "No hay que prestar las cosas.", "Las bicicletas se malogran con facilidad si uno no las cuida."],
    ["¿Qué muestra el «nudo en el estómago»?", "Que callar lo hacía sentir mal.", "Que tenía hambre.", "Que había pedaleado demasiado rápido durante toda la tarde."],
    ["¿Qué decisión de Iván revela el tema?", "Tocar la puerta y contar lo ocurrido.", "Pedir prestada la bicicleta.", "Pasar la tarde en casa."]),
];

// --- Propósito y punto de vista -------------------------------------------

const PURPOSE = sorter(["Informar", "Convencer", "Entretener"], "¿Cuál es el propósito del texto?");
const TEXT_PURPOSE: ChoiceItem[] = [
  ...["Un artículo que explica cómo se forman los volcanes.", "Una ficha con el peso, la altura y la dieta de la llama.", "Las instrucciones para armar una cometa.", "Una noticia sobre la inauguración de un puente."].map((x) => PURPOSE(x, 0)),
  ...["Un afiche que pide votar por Ana para delegada.", "Una carta al alcalde para que ponga más tachos en el parque.", "Un anuncio que asegura que cierta pasta dental es la mejor.", "Un volante que invita a donar ropa abrigadora."].map((x) => PURPOSE(x, 1)),
  ...["Un cuento sobre un zorro que quería tocar la luna.", "Una historieta de un gato detective.", "Un poema divertido sobre un pulpo bailarín.", "Una adivinanza sobre el viento."].map((x) => PURPOSE(x, 2)),
];

const MSG = "¿Cuál es el propósito del autor y su mensaje?";
const PURPOSE_MESSAGE: ChoiceItem[] = [
  pt(MSG, "Cada año, millones de botellas de plástico acaban en el mar. ¡Lleva tu propio tomatodo y sé parte del cambio!", "Convencer: usa menos plástico.", "Informar: cómo se fabrican las botellas.", "Entretener: la historia de una botella que viaja por el mar."),
  pt(MSG, "El murciélago no es ciego. Se guía con sonidos que rebotan en los objetos; a esto se le llama ecolocalización.", "Informar: cómo se orienta el murciélago.", "Convencer: adopta un murciélago como mascota.", "Entretener: un chiste."),
  pt(MSG, "El zorro quiso engañar al cuy, pero el cuy le dijo que el cielo se caía y lo dejó sosteniendo una roca toda la noche.", "Entretener: la astucia vence a la fuerza.", "Informar: qué comen los zorros y los cuyes en el campo.", "Convencer: no críes cuyes."),
  pt(MSG, "Lavarse las manos veinte segundos elimina gérmenes. Hazlo siempre antes de comer: tu salud lo vale.", "Convencer: lávate bien las manos.", "Entretener: un cuento de gérmenes.", "Informar: de dónde viene el agua que sale por el caño."),
  pt(MSG, "La papa nació en los Andes. Hoy existen más de tres mil variedades y se cultiva en casi todo el mundo.", "Informar: el origen y la variedad de la papa.", "Convencer: come solo papa.", "Entretener: la aventura de una papa que quería ser camote."),
  pt(MSG, "Nuestra biblioteca cierra a la una y muchos no alcanzamos a ir. Pedimos que abra también por las tardes.", "Convencer: amplíen el horario de la biblioteca.", "Informar: cuántos libros hay.", "Entretener: un cuento de misterio que ocurre en una biblioteca."),
];

const POV = "¿En qué se diferencian los dos puntos de vista?";
const POINT_OF_VIEW: ChoiceItem[] = [
  pt(POV, "Lucas: «La lluvia arruinó el paseo; nos quedamos encerrados».\nMaría: «¡Por fin llovió! Mis plantas estaban secas».", "Lucas ve la lluvia como un problema y María, como algo bueno.", "A los dos les molesta la lluvia porque no pueden salir a jugar.", "Lucas tiene plantas y María quería salir de paseo."),
  pt(POV, "Vecino: «El gallo canta a las cinco y no deja dormir».\nGranjera: «Gracias al gallo, empiezo temprano mi trabajo».", "Al vecino el canto le fastidia; a la granjera le sirve.", "Los dos quieren vender el gallo porque canta demasiado temprano.", "Ninguno escucha al gallo."),
  pt(POV, "Alumno: «Tres tareas en un día es demasiado».\nProfesora: «Practicar a diario refuerza lo aprendido».", "El alumno ve una carga; la profesora, una ayuda.", "Los dos piensan que no debe haber tareas en ningún curso.", "La profesora cree que son pocas."),
  pt(POV, "Hermano mayor: «Mi cuarto compartido no me deja estudiar».\nHermano menor: «Me encanta: nunca me siento solo».", "Uno siente que pierde algo y el otro, que gana compañía.", "Los dos quieren cuartos separados.", "El menor no puede estudiar y el mayor se siente solo."),
  pt(POV, "Turista: «El mercado es colorido y fascinante».\nVendedor: «Para mí es un día más de trabajo duro».", "Lo que para el turista es novedad, para el vendedor es rutina.", "A ninguno de los dos le gusta el mercado porque es ruidoso y cansa.", "El turista trabaja allí."),
  pt(POV, "Narrador 1: «Vi cómo mi equipo perdía y casi lloro».\nNarrador 2: «Los jugadores salieron cabizbajos de la cancha».", "El primero cuenta lo que siente; el segundo solo lo que observa.", "Los dos narradores jugaron el partido y celebraron juntos la victoria.", "Ninguno vio el partido."),
];

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿Qué información aparece solo en el Texto 2?", "Texto 1: La vicuña vive en la puna y tiene la lana más fina del mundo.\nTexto 2: La vicuña vive en la puna. Cada dos años se la esquila en una fiesta llamada chaccu.", "El nombre de la fiesta de la esquila", "Que la vicuña vive en la puna", "Que su lana es la más fina del mundo"),
  pt("¿En qué coinciden los dos textos?", "Texto 1: El caballito de totora se usa para pescar en Huanchaco desde hace siglos.\nTexto 2: Los pescadores de Huanchaco entran al mar sobre balsas de totora.", "En que en Huanchaco se pesca con balsas de totora", "En que la totora crece en la sierra", "En la cantidad de pescadores"),
  pt("¿Qué información aparece solo en el Texto 1?", "Texto 1: El Amazonas nace en los Andes peruanos y mide casi 7000 km.\nTexto 2: El Amazonas es el río más caudaloso del planeta.", "Dónde nace y cuánto mide", "Que es el más caudaloso", "Que lleva más agua que cualquier otro río del planeta"),
  pt("¿En qué se diferencian los textos?", "Texto 1: El autor cuenta su visita a Machu Picchu y lo que sintió.\nTexto 2: El texto da la altitud, la fecha de construcción y el material de los muros.", "Uno relata una experiencia y el otro presenta datos.", "Los dos son cuentos inventados.", "Uno habla del Cusco y el otro de una ciudad de Egipto."),
  pt("¿Qué texto serviría más para saber cómo cuidar un cuy?", "Texto 1: «El cuy en la historia»: su papel en las culturas andinas.\nTexto 2: «Guía práctica»: alimentación, limpieza y espacio que necesita un cuy.", "El Texto 2, porque da indicaciones de cuidado", "El Texto 1, porque es más antiguo", "Ninguno, porque los dos hablan de historia"),
  pt("¿Qué se puede afirmar al juntar los dos textos?", "Texto 1: La anchoveta es el alimento principal de muchas aves marinas.\nTexto 2: Cuando el mar se calienta, la anchoveta se aleja de la costa.", "Con mar caliente, las aves marinas tendrán menos alimento.", "Las aves marinas calientan el mar.", "La anchoveta come aves."),
];

const PERSUASIVE = [
  read("Un recreo más largo", "⏰", "Los alumnos de cuarto grado creemos que el recreo debería durar treinta minutos y no quince. En primer lugar, comer y jugar en quince minutos es casi imposible. Además, varios estudios señalan que los niños que se mueven más atienden mejor en clase. Por último, tendríamos tiempo para ir al baño sin correr. Pedimos a la dirección que lo considere.",
    ["¿Cuál es la opinión de los autores?", "El recreo debería durar treinta minutos.", "El recreo debería eliminarse.", "Las clases de la mañana deberían empezar mucho más temprano."],
    ["¿Qué razón se apoya en una prueba?", "Los estudios dicen que moverse ayuda a atender.", "Comer en quince minutos es difícil.", "Pedimos que lo consideren."],
    ["¿A quién quieren convencer?", "A la dirección de la escuela", "A los alumnos de tercer grado", "A los padres de familia que recogen a sus hijos"]),
  read("Adopta, no compres", "🐶", "En los albergues de la ciudad hay cientos de perros esperando un hogar. Cuando adoptas, salvas una vida y dejas un espacio libre para otro animal rescatado. Los perros adoptados ya están vacunados y suelen ser muy agradecidos. Antes de comprar una mascota, visita un albergue: tu mejor amigo puede estar allí.",
    ["¿Qué quiere lograr el texto?", "Que la gente adopte en vez de comprar.", "Que la gente venda sus perros.", "Que todos los albergues de la ciudad cierren sus puertas."],
    ["¿Qué razón da el texto?", "Al adoptar se salva una vida.", "Los perros de raza son más bonitos y más caros.", "Los albergues son grandes."],
    ["¿Qué oración es un llamado directo al lector?", "«Antes de comprar una mascota, visita un albergue».", "«Hay cientos de perros esperando».", "«Suelen ser muy agradecidos»."]),
];

// --- Personajes -----------------------------------------------------------

const TRAIT = "¿Cómo es el personaje?";
const TRAITS: ChoiceItem[] = [
  pt(TRAIT, "—Toma la mitad de mi pan —dijo Elena—. Yo ya comí bastante.", "Generosa", "Envidiosa", "Distraída"),
  pt(TRAIT, "Aunque le temblaban las piernas, Nico subió al escenario y empezó a cantar.", "Valiente", "Perezoso", "Mentiroso"),
  pt(TRAIT, "Paula revisó tres veces su maqueta y midió cada pieza con la regla.", "Cuidadosa", "Impaciente", "Desordenada"),
  pt(TRAIT, "—¿Y por qué el cielo es azul? ¿Y de dónde sale el viento? —preguntaba Leo sin parar.", "Curioso", "Tímido", "Gruñón"),
  pt(TRAIT, "Marta falló diez veces el tiro libre. Se secó el sudor y lo intentó otra vez.", "Perseverante", "Miedosa", "Presumida"),
  pt(TRAIT, "—Yo gané solo. Ustedes casi no ayudaron —dijo Raúl, y levantó la copa.", "Presumido", "Humilde", "Agradecido"),
  pt(TRAIT, "Sara encontró una billetera y la llevó a la dirección sin abrirla.", "Honrada", "Traviesa", "Egoísta"),
  pt(TRAIT, "Diego esperó sin quejarse a que su hermanito terminara de amarrarse los zapatos.", "Paciente", "Apurado", "Burlón"),
];

const COMPARE_CHARACTERS = [
  read("Dos hermanas", "👭", "Lía se levanta antes que el sol, ordena su mochila y repasa la lección. Su hermana Noa salta de la cama a último minuto y busca sus zapatos por toda la casa. Sin embargo, cuando un compañero está triste, las dos son las primeras en sentarse a su lado.",
    ["¿En qué se diferencian Lía y Noa?", "Lía es organizada y Noa, desordenada.", "Lía es alegre y Noa, triste.", "Lía duerme mucho y Noa repasa siempre la lección."],
    ["¿En qué se parecen?", "Las dos son solidarias.", "Las dos son madrugadoras.", "Las dos pierden sus zapatos cada mañana."],
    ["¿Qué detalle muestra cómo es Noa?", "Busca sus zapatos por toda la casa.", "Repasa la lección antes de salir a la escuela.", "Se levanta antes que el sol."]),
  read("El zorro y el cóndor", "🦊", "El zorro presumía de ser el más listo del valle y se burlaba de todos. El cóndor, en cambio, hablaba poco y escuchaba mucho. Cuando llegó la sequía, el zorro quiso guardar para sí el último charco. El cóndor voló lejos, halló un manantial y avisó a todos los animales.",
    ["¿Cómo es el zorro comparado con el cóndor?", "El zorro es egoísta; el cóndor piensa en los demás.", "El zorro es callado y humilde; el cóndor es burlón y presumido.", "Los dos son igual de generosos."],
    ["¿Qué acción muestra cómo es el cóndor?", "Avisó a todos sobre el manantial.", "Se burló del zorro.", "Guardó el último charco del valle solo para él."],
    ["¿Qué tienen en común los dos personajes?", "Los dos enfrentan la misma sequía.", "Los dos saben volar muy alto sobre el valle.", "Los dos hablan poco."]),
];

// --- Elementos del cuento -------------------------------------------------

const NARR = sorter(["Primera persona (el narrador participa)", "Tercera persona (el narrador cuenta desde fuera)"], "¿Desde qué punto de vista se narra?");
const NARRATOR: ChoiceItem[] = [
  ...["Abrí la caja con cuidado y encontré las cartas de mi abuelo.", "Nunca olvidaré el día en que aprendí a nadar.", "Mi hermana y yo corrimos hasta la orilla.", "Sentí que el corazón se me salía cuando dijeron mi nombre.", "Nos perdimos en el mercado y tuve que preguntar el camino."].map((x) => NARR(x, 0)),
  ...["Julia abrió la caja y encontró las cartas de su abuelo.", "El niño no sabía que ese día cambiaría su vida.", "Los hermanos corrieron hasta la orilla.", "A Pedro le latía fuerte el corazón cuando lo llamaron.", "La anciana miró el cielo y pensó que llovería."].map((x) => NARR(x, 1)),
];

const STORY_ELEMENTS = [
  read("La linterna", "🔦", "Una noche de invierno, en una casa de campo de Cajamarca, se fue la luz. Emilia quería leer el final de su libro y no encontraba la linterna. Buscó en los cajones y bajo la cama. Por fin recordó que la había dejado en la mochila del paseo. La encendió y terminó su libro bajo las frazadas.",
    ["¿Cuál es el escenario del cuento?", "Una casa de campo, una noche de invierno", "Un paseo escolar", "Una biblioteca de la ciudad en una tarde de verano"],
    ["¿Cuál es el problema de Emilia?", "No encontraba la linterna para leer.", "Había perdido su libro.", "Tenía frío."],
    ["¿Cómo se resuelve el problema?", "Recordó que la linterna estaba en la mochila.", "Volvió la luz.", "Su mamá le prestó una vela para que siguiera leyendo."]),
  read("El puesto de jugos", "🍊", "Un sábado por la mañana, en la plaza de Huancayo, Andrés ayudaba a su tía en el puesto de jugos. De pronto se malogró la licuadora y la fila de clientes crecía. Andrés propuso exprimir las naranjas a mano. Entre los dos atendieron a todos y la tía le regaló el jugo más grande.",
    ["¿Quiénes son los personajes principales?", "Andrés y su tía", "Los clientes de la fila", "El dueño de la plaza"],
    ["¿Dónde y cuándo ocurre?", "En la plaza de Huancayo, un sábado por la mañana", "En una cocina, de noche", "En un mercado de Lima, un lunes por la tarde"],
    ["¿Cuál es el problema?", "Se malogró la licuadora con muchos clientes esperando.", "Se acabaron las naranjas.", "Andrés llegó tarde."]),
];

const PLOT: ChoiceItem[] = [
  w("¿Qué parte de la trama presenta a los personajes y el lugar?", "El inicio o planteamiento", "El clímax", "El desenlace"),
  w("¿Cómo se llama el momento de mayor tensión de un cuento?", "Clímax", "Inicio", "Escenario"),
  w("¿Qué parte de la trama cuenta cómo termina el problema?", "El desenlace", "El conflicto", "El planteamiento"),
  w("¿Cómo se llama el problema que enfrenta el personaje principal?", "Conflicto", "Desenlace", "Narrador"),
  pt("¿Qué parte de la trama es?", "«Hace mucho, en un pueblo junto al mar, vivía un niño llamado Tadeo con su abuela».", "Inicio", "Clímax", "Desenlace"),
  pt("¿Qué parte de la trama es?", "«La ola levantó el bote. Tadeo soltó el remo, cerró los ojos y saltó hacia la roca».", "Clímax", "Inicio", "Desenlace"),
  pt("¿Qué parte de la trama es?", "«Desde ese día, Tadeo nunca volvió a salir al mar sin avisar, y el pueblo lo recordó como el niño valiente».", "Desenlace", "Inicio", "Conflicto"),
  pt("¿Qué parte de la trama es?", "«Pero una mañana la abuela enfermó, y la única medicina estaba en la isla, al otro lado de la bahía».", "Conflicto", "Desenlace", "Escenario"),
  pt("¿Qué hecho es el clímax?", "1. Rita entrena para la carrera.\n2. El día de la carrera, se cae a pocos metros de la meta.\n3. Se levanta y cruza la meta cojeando.\n4. Todos la aplauden.", "Se cae cerca de la meta y decide levantarse.", "Rita entrena.", "Todos la aplauden al final."),
  pt("¿Qué hecho es el desenlace?", "1. Un pueblo se queda sin agua.\n2. Los vecinos discuten.\n3. Una niña propone cavar juntos un pozo.\n4. Encuentran agua y celebran.", "Encuentran agua y celebran.", "El pueblo se queda sin agua.", "Los vecinos discuten."),
];

// --- Estructura del texto -------------------------------------------------

const INFO_ORDER: OrderItem[] = [
  { p: "Ordena las etapas de la vida de una mariposa.", seq: ["La mariposa pone huevos.", "De cada huevo sale una oruga.", "La oruga forma una crisálida.", "De la crisálida sale una mariposa."] },
  { p: "Ordena los pasos para hacer papel reciclado.", seq: ["Se junta papel usado.", "Se remoja y se licúa.", "Se extiende la pasta sobre una malla.", "Se deja secar al sol."] },
  { p: "Ordena cómo llega el pan a tu mesa.", seq: ["Se cosecha el trigo.", "El trigo se muele y se hace harina.", "El panadero amasa y hornea.", "El pan se vende en la tienda."] },
  { p: "Ordena lo que ocurre en una erupción.", seq: ["El magma sube por el volcán.", "La presión aumenta en el cráter.", "El volcán expulsa lava y ceniza.", "La lava se enfría y se endurece."] },
  { p: "Ordena los pasos de un experimento.", seq: ["Se plantea una pregunta.", "Se propone una hipótesis.", "Se hace la prueba.", "Se anotan las conclusiones."] },
  { p: "Ordena cómo se elabora el chocolate.", seq: ["Se cosechan las mazorcas de cacao.", "Se secan las semillas al sol.", "Se tuestan y se muelen.", "Se mezcla la pasta con azúcar."] },
];

const COMPARE = [
  read("Ranas y sapos", "🐸", "Las ranas y los sapos son anfibios: nacen en el agua y de adultos respiran aire. Sin embargo, no son iguales. Las ranas tienen la piel lisa y húmeda, y patas largas para saltar lejos. Los sapos, en cambio, tienen la piel seca y rugosa, y patas cortas con las que caminan o dan saltitos.",
    ["¿En qué se parecen las ranas y los sapos?", "Los dos son anfibios.", "Los dos tienen piel rugosa.", "Los dos dan saltos muy largos gracias a sus patas."],
    ["¿En qué se diferencian?", "En la piel y en el largo de las patas", "En que solo las ranas nacen en el agua", "En nada"],
    ["¿Qué expresión señala una diferencia?", "«En cambio»", "«Los dos»", "«De adultos»"]),
  read("Costa y selva", "🌴", "La costa peruana es una franja angosta y seca junto al mar; casi nunca llueve y abundan los desiertos. La selva, por el contrario, es húmeda y lluviosa, y está cubierta de bosques inmensos. Ambas regiones tienen algo en común: grandes ríos que dan vida a sus pueblos.",
    ["¿Qué diferencia señala el texto?", "La costa es seca y la selva, lluviosa.", "La costa es más grande que la selva.", "En la selva hay más desiertos que en toda la costa."],
    ["¿Qué tienen en común?", "Ríos que dan vida a sus pueblos", "Bosques inmensos", "Lluvias todo el año"],
    ["¿Qué palabra anuncia una semejanza?", "«Ambas»", "«Por el contrario»", "«Casi nunca»"]),
];

const CAUSE_INFO: ChoiceItem[] = [
  pt("¿Cuál es el efecto?", "Como la Tierra gira sobre sí misma, en una mitad del planeta es de día mientras en la otra es de noche.", "Hay día y noche.", "La Tierra gira.", "El planeta tiene dos mitades."),
  pt("¿Cuál es la causa?", "Muchas ranas están desapareciendo porque los charcos donde ponen sus huevos se secan.", "Los charcos se secan.", "Las ranas desaparecen.", "Las ranas ponen muchos huevos pequeños."),
  pt("¿Cuál es el efecto?", "El fenómeno de El Niño calienta el mar; por eso, los peces de agua fría se alejan de la costa.", "Los peces se alejan de la costa.", "El mar se calienta.", "Ocurre El Niño."),
  pt("¿Cuál es la causa?", "Los glaciares de la cordillera se achican debido al aumento de la temperatura.", "Aumenta la temperatura.", "Los glaciares se achican.", "La cordillera es muy alta."),
  pt("¿Cuál es el efecto?", "Las raíces de los árboles sujetan la tierra. En consecuencia, donde hay bosques ocurren menos deslizamientos.", "Hay menos deslizamientos.", "Las raíces sujetan la tierra.", "Los árboles tienen raíces."),
  pt("¿Cuál es la causa?", "La ciudad se quedó sin luz, ya que un rayo dañó la central eléctrica.", "Un rayo dañó la central.", "La ciudad se quedó sin luz.", "Hubo una gran tormenta de nieve."),
  pt("¿Qué palabras señalan la causa?", "Las aves migran al norte porque allí encuentran más alimento.", "«porque»", "«al norte»", "«más alimento»"),
  pt("¿Qué palabras señalan el efecto?", "No llovió en todo el año; por lo tanto, la cosecha fue pequeña.", "«por lo tanto»", "«en todo el año»", "«no llovió»"),
];

const PROBLEM_SOLUTION = pool([
  ["El río del pueblo está lleno de basura.", "Organizar una jornada de limpieza."], ["Los alumnos llegan tarde porque no hay bus.", "Coordinar una movilidad compartida."], ["La biblioteca tiene pocos libros.", "Hacer una campaña de donación."],
  ["Las plantas del huerto se secan en verano.", "Instalar un sistema de riego."], ["Los autos pasan muy rápido frente a la escuela.", "Colocar un rompemuelles."], ["Muchos vecinos no saben de la reunión.", "Pegar avisos en las esquinas."],
  ["El patio se inunda cuando llueve.", "Limpiar y ampliar los desagües."], ["Los perros rompen las bolsas de basura.", "Usar tachos con tapa."],
]);

const STRUCT = sorter(["Secuencia", "Comparación", "Causa y efecto", "Problema y solución"], "¿Qué estructura tiene el texto?");
const STRUCTURES: ChoiceItem[] = [
  ...["Primero se lava el arroz. Luego se hierve el agua. Por último, se cocina a fuego lento.", "En 1911 se dio a conocer Machu Picchu. Años después llegaron los primeros turistas. Hoy lo visitan miles."].map((x) => STRUCT(x, 0)),
  ...["El puma caza solo; el lobo, en cambio, caza en manada. Ambos son carnívoros.", "A diferencia de la llama, la alpaca es más pequeña y su lana es más fina."].map((x) => STRUCT(x, 1)),
  ...["Debido a la helada, las papas se quemaron. Por eso subió su precio.", "El hielo de los polos se derrite porque sube la temperatura; como resultado, crece el nivel del mar."].map((x) => STRUCT(x, 2)),
  ...["El parque estaba oscuro y la gente tenía miedo. Los vecinos pidieron faroles y ahora todos pasean de noche.", "Faltaba agua en la chacra. Los comuneros construyeron un canal desde la laguna."].map((x) => STRUCT(x, 3)),
];

// --- Detalles sensoriales -------------------------------------------------

const SENSE = sorter(["Vista", "Oído", "Olfato", "Gusto", "Tacto"], "¿A qué sentido se dirige el detalle?");
const SENSES: ChoiceItem[] = [
  ...["El cielo se tiñó de naranja y violeta.", "Una fila de hormigas rojas cruzaba la pared.", "El lago brillaba como un espejo."].map((x) => SENSE(x, 0)),
  ...["Las hojas secas crujían bajo sus pies.", "A lo lejos retumbó un trueno.", "El grillo chirriaba sin descanso."].map((x) => SENSE(x, 1)),
  ...["La cocina se llenó de aroma a canela.", "El aire traía un tufo a pescado.", "La tierra mojada perfumaba la tarde."].map((x) => SENSE(x, 2)),
  ...["El limón le dejó la lengua ácida.", "La mazamorra estaba dulce y tibia.", "El caldo quedó demasiado salado."].map((x) => SENSE(x, 3)),
  ...["La frazada de lana le picaba el cuello.", "La piedra del río estaba lisa y helada.", "La arena caliente le quemaba los pies."].map((x) => SENSE(x, 4)),
];

const SENSORY = "¿Qué oración tiene un detalle sensorial?";
const SENSORY_ID: ChoiceItem[] = [
  w(SENSORY, "El pan crujiente olía a mantequilla.", "El pan es un alimento muy antiguo.", "Compramos pan todos los días."),
  w(SENSORY, "Un viento helado le cortaba la cara.", "Ese día hacía bastante mal clima.", "El clima cambia según la estación del año."),
  w(SENSORY, "Las campanas repicaron en el valle.", "La iglesia del pueblo tiene dos campanas.", "Fuimos a la iglesia."),
  w(SENSORY, "La manta áspera raspaba sus brazos.", "Tenía una manta.", "La manta era un regalo de su abuela materna."),
  w(SENSORY, "El jugo agrio le hizo arrugar la nariz.", "Tomó jugo en el desayuno de esta mañana.", "El jugo es una bebida."),
  w(SENSORY, "Las luciérnagas titilaban en lo oscuro.", "Había muchos insectos en aquel campo.", "Era de noche."),
  pt("¿Qué palabras del texto son detalles sensoriales?", "El mercado estaba lleno. El humo dulce de los anticuchos flotaba entre los gritos de los vendedores.", "«humo dulce» y «gritos»", "«mercado» y «vendedores»", "«estaba» y «entre»"),
  pt("¿Qué palabras del texto son detalles sensoriales?", "Entramos a la cueva. Las paredes húmedas y frías goteaban con un eco lento.", "«húmedas y frías» y «eco lento»", "«entramos» y «a la cueva»", "«las paredes» y «con un»"),
];

// --- Recursos literarios --------------------------------------------------

const FIG = sorter(["Símil (compara con «como» o «parece»)", "Metáfora (dice que una cosa es otra)"], "¿Es un símil o una metáfora?");
const SIMILE_METAPHOR: ChoiceItem[] = [
  ...["Sus ojos brillaban como luceros.", "El bebé duerme como un tronco.", "La noticia corrió como el viento.", "Sus manos parecían de hielo.", "El niño es fuerte como un roble.", "Nadaba igual que un pez."].map((x) => FIG(x, 0)),
  ...["Sus ojos son dos luceros.", "El patio era un horno al mediodía.", "Mi hermano es un lince para las cuentas.", "La luna es un queso en el cielo.", "El tiempo es oro.", "Tus palabras son miel."].map((x) => FIG(x, 1)),
];

const FIGURE_PICS: ChoiceItem[] = [
  { pic: "🐢", a: "Camina lento como una tortuga.", d: ["Es tan veloz como un rayo en el cielo.", "Es una tortuga de mar."] },
  { pic: "🦁", a: "En la cancha, mi capitán es un león.", d: ["En la cancha del barrio vive un león de verdad.", "Mi capitán duerme mucho."] },
  { pic: "☀️", a: "Tu sonrisa es un sol.", d: ["Tu sonrisa es una nube gris.", "El sol tiene dientes."] },
  { pic: "🪶", a: "La mochila pesa como una pluma.", d: ["La mochila pesa como una roca.", "La pluma está en la mochila."] },
  { pic: "🧊", a: "Tenía las manos como témpanos.", d: ["Tenía las manos como brasas.", "Guardó hielo en la mano."] },
  { pic: "🐝", a: "Mi mamá es una abeja: no para de trabajar.", d: ["Mi mamá le teme a las abejas desde que era niña.", "Mi mamá es un oso perezoso."] },
  { pic: "🌊", a: "Un mar de gente llenó la plaza.", d: ["La gente fue a ver el mar desde el malecón.", "La plaza estaba vacía."] },
  { pic: "🦊", a: "Para los negocios, mi tío es un zorro.", d: ["Mi tío cría un zorro en el corral de su chacra.", "Mi tío es lento como caracol."] },
];

const MEAN = "¿Qué significa la expresión?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "Después del paseo, mis piernas eran dos piedras.", "Las tenía pesadas de cansancio.", "Estaban sucias.", "Se habían vuelto de piedra de verdad."),
  pt(MEAN, "La maestra dijo que el salón era un gallinero.", "Había mucho ruido y desorden.", "Había gallinas en el salón de clases.", "Olía mal."),
  pt(MEAN, "Mi abuela es un libro abierto.", "No esconde lo que piensa ni lo que siente.", "Lee mucho.", "Siempre lleva un libro en la mano."),
  pt(MEAN, "El atleta salió como una flecha.", "Partió muy rápido.", "Lanzó una flecha al aire.", "Salió caminando despacio hacia la meta."),
  pt(MEAN, "Sus palabras fueron un balde de agua fría.", "Me desanimaron de golpe.", "Me refrescaron.", "Me mojaron toda la ropa nueva."),
  pt(MEAN, "La ciudad es una selva de cemento.", "Está llena de edificios, sin áreas verdes.", "Tiene muchos árboles.", "Queda dentro de la selva amazónica."),
  pt(MEAN, "Cuando canta, su voz es terciopelo.", "Suena suave y agradable.", "Suena ronca.", "Lleva puesto un vestido de terciopelo."),
  pt(MEAN, "El examen fue pan comido.", "Resultó muy fácil.", "Dio mucha hambre.", "Lo dieron en la panadería del barrio."),
];

const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa «talón de Aquiles» en la oración?", "Fuente: En el mito griego, Aquiles era invencible, salvo en el talón, su único punto débil.\nOración: «La ortografía es mi talón de Aquiles».", "Su punto débil", "Su mayor fortaleza", "Una herida en el pie"),
  pt("¿Qué significa «abrir la caja de Pandora» en la oración?", "Fuente: En el mito, Pandora abrió una caja prohibida y de ella salieron todos los males.\nOración: «Al preguntar por la herencia, abrió la caja de Pandora».", "Provocar muchos problemas", "Encontrar un tesoro escondido", "Guardar un secreto"),
  pt("¿Qué significa la alusión a Midas?", "Fuente: El rey Midas convertía en oro todo lo que tocaba.\nOración: «Esa cocinera es el rey Midas: todo lo que prepara se vende».", "Todo lo que hace resulta valioso.", "Es muy tacaña y esconde todo su dinero.", "Usa joyas de oro."),
  pt("¿Qué significa la alusión a David y Goliat?", "Fuente: El joven David venció al gigante Goliat con una honda.\nOración: «El partido fue un David contra Goliat, y ganó David».", "El equipo más débil venció al más fuerte.", "Ganó el equipo favorito, como todos esperaban.", "Hubo una pelea."),
  pt("¿Qué significa «le creció la nariz» en la oración?", "Fuente: A Pinocho, el muñeco de madera, le crecía la nariz cada vez que mentía.\nOración: «Dijo que hizo la tarea y le creció la nariz».", "Estaba mintiendo.", "Se golpeó la cara.", "Estaba muy resfriado y estornudaba."),
  pt("¿Qué significa «una odisea» en la oración?", "Fuente: En «La Odisea», Ulises tarda diez años y sufre mil peligros para volver a casa.\nOración: «Llegar al aeropuerto con la huelga fue una odisea».", "Un viaje largo y lleno de dificultades", "Un paseo corto y agradable por los alrededores", "Un libro antiguo"),
  pt("¿Qué significa «quijote» en la oración?", "Fuente: Don Quijote salía a defender ideales, aunque todos lo creyeran loco.\nOración: «Mi tío es un quijote: limpia solo toda la playa».", "Lucha por un ideal aunque parezca imposible.", "Es un caballero con armadura, lanza y un caballo flaco.", "No le importa nada."),
  pt("¿Qué significa la alusión a la tortuga?", "Fuente: En la fábula, la tortuga lenta pero constante le gana la carrera a la liebre confiada.\nOración: «Estudia un poco cada día: sé la tortuga, no la liebre».", "Avanza con constancia, sin confiarte.", "Camina muy despacio a la escuela.", "Compite con animales."),
];

const EFFECT = "¿Qué efecto logra el recurso?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«El viento aullaba y arañaba las ventanas».", "Hace que la escena dé miedo.", "Hace que la escena sea graciosa.", "Indica la hora exacta."),
  pt(EFFECT, "«Te lo he dicho un millón de veces».", "Exagera para mostrar fastidio.", "Da un número exacto.", "Muestra una enorme alegría por repetir las cosas."),
  pt(EFFECT, "«El sol acariciaba los campos dorados».", "Crea un ambiente tranquilo y agradable.", "Crea un ambiente de peligro.", "Explica cómo funciona el sol."),
  pt(EFFECT, "«Su risa era una cascada de campanitas».", "Muestra una risa alegre y musical.", "Muestra una risa burlona y fea.", "Dice que había campanas."),
  pt(EFFECT, "«Me muero de hambre», dijo al llegar.", "Recalca que tiene muchísima hambre.", "Avisa que está gravemente enfermo.", "Indica que ya comió."),
  pt(EFFECT, "«La vieja casa gemía con cada paso».", "Le da vida a la casa y crea misterio.", "Describe una casa nueva y muy moderna.", "Hace reír."),
  pt(EFFECT, "«Las estrellas guiñaban desde el cielo».", "Da un tono tierno y juguetón.", "Da un tono triste.", "Informa cuántas estrellas hay en el cielo."),
  pt(EFFECT, "«El silencio pesaba como una losa».", "Transmite tensión e incomodidad.", "Transmite una gran alegría entre amigos.", "Describe una piedra."),
];

// --- Elementos visuales ---------------------------------------------------

const ILLU_1 = "Ilustración 1 ⚡: El dios Illapa, enorme entre nubes negras, lanza un rayo con su honda. Abajo, unos campesinos pequeños se cubren.\nIlustración 2 🌧️: Illapa vierte agua de un cántaro sobre los campos. Los campesinos levantan los brazos, sonrientes.";
const ILLU_2 = "Ilustración 1 🌊: Un héroe rema solo en un mar oscuro; las olas son más altas que su balsa.\nIlustración 2 🏝️: El mismo héroe pisa una playa clara; detrás, el mar está en calma y sale el sol.";
const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿En qué se parecen las dos ilustraciones?", ILLU_1, "En las dos, el dios aparece sobre los campesinos.", "En las dos, los campesinos sonríen.", "En las dos hay un rayo que cae sobre los campos."),
  pt("¿Cómo se muestra al dios en la Ilustración 1?", ILLU_1, "Poderoso y temible", "Amable y generoso", "Débil"),
  pt("¿Qué cambia en la Ilustración 2?", ILLU_1, "El dios ayuda y la gente se alegra.", "El dios desaparece.", "Los campesinos se esconden aún más asustados."),
  pt("¿Qué transmite la Ilustración 1?", ILLU_2, "Peligro y soledad", "Calma y descanso", "Una fiesta en la playa con mucha gente"),
  pt("¿Qué detalle de la Ilustración 2 muestra alivio?", ILLU_2, "El mar en calma y el sol que sale", "Las olas altas", "El color oscuro del mar"),
  pt("¿Qué parte del mito muestra cada ilustración?", ILLU_2, "La 1, la dificultad; la 2, la llegada", "La 1, el final; la 2, el comienzo", "Las dos muestran lo mismo"),
];

const VENN = "DIAGRAMA DE VENN\nSolo la llama: carga peso · orejas largas\nLas dos: viven en los Andes · comen pasto\nSolo la alpaca: lana muy fina · es más pequeña";
const TIMELINE = "LÍNEA DE TIEMPO\n1821 → Independencia del Perú\n1851 → Primer ferrocarril\n1911 → Machu Picchu se da a conocer\n1969 → Llegada del ser humano a la Luna";
const TABLE = "TABLA: PLANETAS\nMercurio | 0 lunas | el más pequeño\nTierra | 1 luna | tiene vida\nJúpiter | más de 90 lunas | el más grande";
const ORGANIZERS: ChoiceItem[] = [
  pt("Según el diagrama, ¿qué tienen en común la llama y la alpaca?", VENN, "Viven en los Andes.", "Tienen lana muy fina.", "Cargan peso."),
  pt("Según el diagrama, ¿qué es propio solo de la alpaca?", VENN, "Su lana muy fina", "Sus orejas largas", "Que come pasto"),
  pt("Según la línea de tiempo, ¿qué ocurrió primero?", TIMELINE, "La independencia del Perú", "El primer ferrocarril", "La llegada a la Luna"),
  pt("Según la línea de tiempo, ¿qué ocurrió entre 1851 y 1969?", TIMELINE, "Machu Picchu se dio a conocer.", "Se independizó el Perú.", "Se inventó el ferrocarril."),
  pt("Según la tabla, ¿qué planeta tiene más lunas?", TABLE, "Júpiter", "Tierra", "Mercurio"),
  pt("Según la tabla, ¿qué dato corresponde a Mercurio?", TABLE, "Es el más pequeño.", "Tiene vida.", "Tiene una luna."),
];

// --- Partes del texto -----------------------------------------------------

const FEATURES: ChoiceItem[] = [
  w("Quieres saber en qué página empieza el capítulo 5. ¿Qué parte del libro usas?", "El índice", "El glosario", "La portada"),
  w("No entiendes la palabra «fotosíntesis» en tu libro de ciencias. ¿Dónde buscas su significado?", "En el glosario", "En el índice", "En la contraportada"),
  w("¿Para qué sirve el pie de foto?", "Para explicar lo que muestra una imagen", "Para indicar el número de página", "Para decir quién escribió el libro"),
  w("¿Para qué sirven las palabras en negrita de un texto?", "Para destacar términos importantes", "Para adornar la página", "Para indicar dónde termina el capítulo"),
  w("¿Qué parte del texto te dice de qué trata cada sección?", "Los subtítulos", "Las notas al pie", "Los números de página"),
  w("Quieres saber en qué páginas se menciona al cóndor. ¿Qué usas?", "El índice alfabético", "El título", "El prólogo del autor"),
  w("En un artículo, ¿qué muestra de un vistazo cómo cambió la temperatura cada mes?", "Un gráfico", "Un subtítulo", "Una cita"),
  w("¿Qué parte de un texto muestra dónde quedan los lugares mencionados?", "Un mapa", "Un glosario", "Una línea de tiempo"),
  w("¿Para qué sirve un recuadro lateral en una página?", "Para dar información adicional sobre el tema", "Para repetir el título", "Para numerar los párrafos"),
  w("¿Dónde encuentras el nombre del autor y el título de un libro?", "En la portada", "En el glosario", "En el pie de foto"),
];

// --- Poesía ---------------------------------------------------------------

const SCHEMES = ["AABB", "ABAB", "ABBA", "ABCB"];
const RHYME = (t: string, i: number): ChoiceItem => ({ p: "¿Cuál es el esquema de rima de la estrofa?", t, a: SCHEMES[i], d: SCHEMES.filter((_, k) => k !== i), e: `Las rimas siguen el esquema ${SCHEMES[i]}.` });
const RHYME_SCHEMES: ChoiceItem[] = [
  RHYME("Baja el río de la sierra,\nva regando toda la tierra.\nLleva truchas, lleva espuma,\nlleva el frío de la bruma.", 0),
  RHYME("Sobre el cerro sale el sol,\nlos gallos empiezan a cantar,\nabre sus hojas el girasol\ny el pueblo se pone a trabajar.", 1),
  RHYME("Tengo un barco de papel\nque navega en la laguna;\nlo acompaña blanca luna\ny es valiente mi bajel.", 2),
  RHYME("La llama sube despacio\npor la cuesta del camino,\nlleva lana, lleva sal\ny un pastor de paso fino.", 3),
  RHYME("Canta el grillo en el maizal,\ncanta y canta sin final.\nLa luna lo oye contenta\ny en su ronda se presenta.", 0),
  RHYME("En la noche silenciosa\nbrilla lejos una estrella,\nvuela y vuela mariposa\npersiguiendo luz tan bella.", 1),
  RHYME("Cuando el viento se despierta\njuega con las hojas secas,\nles hace cosquillas y muecas\ny las deja en mi puerta.", 2),
  RHYME("Mi abuela teje en la tarde\nuna manta de colores;\nen cada hilo que escoge\nva guardando sus amores.", 3),
];

const POEM = "Verde el cerro, verde el río, (1)\nverde el campo en la mañana. (2)\n\nPasa lento el caserío (3)\ny despierta la campana. (4)";
const POETRY: ChoiceItem[] = [
  w("¿Cómo se llama cada línea de un poema?", "Verso", "Estrofa", "Párrafo"),
  w("¿Cómo se llama un grupo de versos separado por un espacio?", "Estrofa", "Verso", "Capítulo"),
  w("¿Qué es la rima?", "La repetición de sonidos al final de los versos", "El título del poema", "El número de estrofas que tiene un poema"),
  w("¿Qué es el ritmo de un poema?", "La musicalidad que crean los acentos y las pausas", "El dibujo o la fotografía que acompaña a cada estrofa", "El nombre del poeta"),
  pt("¿Cuántos versos tiene el fragmento?", POEM, "Cuatro", "Dos", "Ocho"),
  pt("¿Cuántas estrofas tiene el fragmento?", POEM, "Dos", "Cuatro", "Una"),
  pt("¿Qué recurso se nota en los versos 1 y 2?", POEM, "La repetición de la palabra «verde»", "Una pregunta que el poeta le hace al lector", "Un diálogo"),
  pt("¿Qué recurso usa el verso?", "«El viento silba su canción por la quebrada».", "Personificación", "Rima consonante", "Estrofa"),
  pt("¿Qué recurso usa el verso?", "«Ruge, ruge el río ronco».", "Repetición de sonidos (aliteración)", "Comparación con «como» o «parece» (símil)", "Exageración"),
  pt("¿Qué recurso usa el verso?", "«Tu risa es como un cascabel».", "Símil", "Aliteración", "Personificación"),
];

export const ROWS: Row[] = [
  ["idea-principal-1", (r) => choose(r, "", KEY_DETAILS)],
  ["idea-principal-2", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["idea-principal-3", (r) => readPassage(r, MAIN_ANALYZE, false)],
  ["dos-textos-1", (r) => choose(r, "", TWO_MAIN)],

  ["inferencias-1", (r) => choose(r, "¿Qué título de libro corresponde al dibujo?", BOOK_TITLES)],
  ["inferencias-2", (r) => choose(r, "", INFER)],
  ["inferencias-3", (r) => readPassage(r, INFER_SUPPORT, false)],
  ["inferencias-4", (r) => choose(r, "", PREDICT)],
  ["tema-1", (r) => readPassage(r, FABLES, false)],
  ["tema-2", (r) => readPassage(r, THEMES, false)],

  ["proposito-1", (r) => choose(r, "", TEXT_PURPOSE)],
  ["proposito-2", (r) => choose(r, "", PURPOSE_MESSAGE)],
  ["proposito-3", (r) => choose(r, "", POINT_OF_VIEW)],
  ["dos-textos-2", (r) => choose(r, "", TWO_TEXTS)],
  ["argumentativos", (r) => readPassage(r, PERSUASIVE, false)],

  ["personajes-1", (r) => choose(r, "", TRAITS)],
  ["personajes-2", (r) => readPassage(r, COMPARE_CHARACTERS, false)],

  ["narrador-trama-1", (r) => choose(r, "", NARRATOR)],
  ["narrador-trama-2", (r) => readPassage(r, STORY_ELEMENTS, false)],
  ["narrador-trama-3", (r) => choose(r, "", PLOT)],

  ["orden-comparacion-1", (r) => order(r, "Ordena los pasos.", INFO_ORDER)],
  ["orden-comparacion-2", (r) => readPassage(r, COMPARE, false)],
  ["causa-efecto-1", (r) => choose(r, "", CAUSE_INFO)],
  ["causa-efecto-2", (r) => choose(r, "¿Qué solución corresponde al problema?", PROBLEM_SOLUTION)],
  ["estructuras", (r) => choose(r, "", STRUCTURES)],

  ["sentidos-1", (r) => choose(r, "", SENSES)],
  ["sentidos-2", (r) => choose(r, "", SENSORY_ID)],

  ["simil-metafora-1", (r) => choose(r, "", SIMILE_METAPHOR)],
  ["simil-metafora-2", (r) => choose(r, "¿Qué símil o metáfora corresponde al dibujo?", FIGURE_PICS)],
  ["simil-metafora-3", (r) => choose(r, "", FIGURE_MEANING)],
  ["alusion", (r) => choose(r, "", ALLUSIONS)],
  ["efecto-figuras", (r) => choose(r, "", FIGURE_EFFECT)],

  ["visuales-1", (r) => choose(r, "", ILLUSTRATIONS)],
  ["visuales-2", (r) => choose(r, "", ORGANIZERS)],

  ["partes-texto", (r) => choose(r, "", FEATURES)],

  ["poesia-1", (r) => choose(r, "", RHYME_SCHEMES)],
  ["poesia-2", (r) => choose(r, "", POETRY)],
];
