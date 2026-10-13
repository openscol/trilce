import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de escritura (IXL 5th grade ELA, T-AA). Las «palabras que se
// confunden» del inglés (their/there, its/it's) pasan a las del castellano:
// haber / a ver, hay / ahí / ay, porque / por qué, sino / si no, hecho / echo.

export const SECTIONS: Section[] = [
  { id: "T", name: "Organizar la escritura", icon: "🗂️" },
  { id: "U", name: "Introducciones y conclusiones", icon: "🎯" },
  { id: "V", name: "Resumir", icon: "✂️" },
  { id: "W", name: "Desarrollar y apoyar argumentos", icon: "💬" },
  { id: "X", name: "Detalles descriptivos", icon: "🎨" },
  { id: "Y", name: "Variedad de oraciones", icon: "🔀" },
  { id: "Z", name: "Corregir y revisar", icon: "🔍" },
  { id: "AA", name: "Habilidades de investigación", icon: "🔎" },
];

// --- T. Organizar la escritura -----------------------------------------------

const SENTENCE_ORDER: OrderItem[] = [
  { seq: ["El domingo decidimos preparar una pachamanca.", "Primero cavamos un hoyo y calentamos las piedras.", "Luego colocamos las papas, las habas y la carne.", "Dos horas después, toda la familia almorzó junta."] },
  { seq: ["La escuela convocó a un concurso de reciclaje.", "Cada aula juntó botellas durante un mes.", "El jurado pesó lo recolectado.", "El quinto grado ganó con ochenta kilos."] },
  { seq: ["Para escribir un buen resumen, lee el texto completo.", "Después subraya las ideas principales.", "A continuación, redáctalas con tus propias palabras.", "Por último, revisa que no falte nada esencial."] },
  { seq: ["Al amanecer, los pescadores empujaron los botes al mar.", "Durante horas lanzaron y recogieron las redes.", "Al mediodía regresaron con la pesca.", "Por la tarde vendieron el pescado en el muelle."] },
  { seq: ["Hace siglos, los mensajes viajaban a pie o a caballo.", "Más tarde, el telégrafo los envió por cables.", "Luego llegó el teléfono.", "Hoy un mensaje cruza el mundo en un segundo."] },
  { seq: ["Noté que mi planta tenía las hojas amarillas.", "Investigué y supe que le faltaba luz.", "La cambié junto a la ventana.", "A las dos semanas le brotaron hojas verdes."] },
];

const COORD: ChoiceItem[] = [
  f("Quería participar en el concurso, ___ no terminé a tiempo mi maqueta.", "pero", "o", "ni"), f("No trajo el cuaderno ___ la cartuchera.", "ni", "pero", "sino"),
  f("El ganador no fue Lima, ___ Arequipa.", "sino", "pero", "y"), f("Aprendió francés ___ italiano.", "e", "y", "u"),
  f("¿Viajarás en setiembre ___ octubre?", "u", "o", "e"), f("Estudió toda la tarde, ___ aprobó con buena nota.", "así que", "pero", "ni"),
  f("Puedes leer en la biblioteca ___ llevarte el libro a casa.", "o", "ni", "sino"), f("Hacía frío, ___ salimos a caminar de todos modos.", "mas", "o", "e"),
  f("Barrió el patio ___ regó las macetas.", "y", "ni", "sino"), f("No quiero jugo, ___ agua.", "sino", "pero", "o"),
];

const TRANSITION: ChoiceItem[] = [
  f("El proyecto tenía fallas. ___, el jurado valoró la idea.", "No obstante", "Por ejemplo", "Es decir"), f("Debemos ahorrar agua. ___, el próximo verano habrá escasez.", "De lo contrario", "Asimismo", "Por ejemplo"),
  f("El quechua tiene muchas variantes. ___, la de Cusco y la de Áncash.", "Por ejemplo", "En cambio", "Por lo tanto"), f("Llovió tres días seguidos. ___, el río se desbordó.", "Como consecuencia", "Sin embargo", "Es decir"),
  f("El texto es expositivo, ___, explica un tema con datos.", "es decir", "en cambio", "sin embargo"), f("Las abejas polinizan. ___, producen miel.", "Asimismo", "No obstante", "De lo contrario"),
  f("En la costa llueve poco. ___, en la selva llueve casi a diario.", "En cambio", "Por lo tanto", "Asimismo"), f("Analizamos los datos y, ___, redactamos las conclusiones.", "finalmente", "en cambio", "por ejemplo"),
  f("No había pruebas. ___, el caso se archivó.", "Por lo tanto", "Asimismo", "No obstante"), f("Ensayamos poco. ___, la presentación salió bien.", "Aun así", "Por eso", "Es decir"),
];

const GENERAL_SPECIFIC: OrderItem[] = [
  { seq: ["universo", "sistema solar", "planeta", "satélite"] }, { seq: ["América", "Sudamérica", "Perú", "Cajamarca"] }, { seq: ["ser vivo", "vertebrado", "mamífero", "vicuña"] },
  { seq: ["literatura", "narrativa", "cuento", "fábula"] }, { seq: ["ciencia", "biología", "botánica", "estudio de las orquídeas"] }, { seq: ["medio de transporte", "transporte terrestre", "tren", "locomotora"] },
  { seq: ["alimento", "vegetal", "tubérculo", "papa amarilla"] }, { seq: ["arte", "artes visuales", "pintura", "acuarela"] }, { seq: ["comunicación", "comunicación escrita", "carta", "posdata"] },
];

const BY_TOPIC: ChoiceItem[] = [
  pt("Escribes un informe sobre la selva. ¿En qué sección va este dato?", "«Alberga jaguares, tapires y más de mil especies de aves».", "Fauna", "Clima", "Amenazas"), pt("Escribes un informe sobre la selva. ¿En qué sección va este dato?", "«La minería ilegal contamina los ríos con mercurio».", "Amenazas", "Fauna", "Clima"),
  pt("Escribes sobre los incas. ¿En qué sección va este dato?", "«El ayllu trabajaba la tierra en común».", "Organización social", "Arquitectura", "Religión"), pt("Escribes sobre los incas. ¿En qué sección va este dato?", "«Las piedras de sus muros encajan sin mezcla».", "Arquitectura", "Religión", "Organización social"),
  pt("Escribes sobre el sistema solar. ¿En qué sección va este dato?", "«Júpiter y Saturno están formados sobre todo por gas».", "Planetas gigantes", "El Sol", "Planetas rocosos"), pt("Escribes sobre el sistema solar. ¿En qué sección va este dato?", "«Marte tiene el volcán más alto conocido».", "Planetas rocosos", "Planetas gigantes", "El Sol"),
  pt("Escribes sobre la alimentación saludable. ¿En qué sección va este dato?", "«Las menestras aportan hierro y proteínas».", "Nutrientes", "Hábitos", "Riesgos"), pt("Escribes sobre la alimentación saludable. ¿En qué sección va este dato?", "«Conviene comer despacio y a horas fijas».", "Hábitos", "Nutrientes", "Riesgos"),
];

const NOT = "¿Qué oración no pertenece al párrafo?";
const NOT_BELONG: ChoiceItem[] = [
  pt(NOT, "(1) Los volcanes no solo destruyen. (2) Sus cenizas vuelven fértil el suelo. (3) Mi tío vive en Moquegua. (4) Además, su calor puede generar energía.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) El ajedrez entrena la mente. (2) Obliga a planear varios pasos. (3) Enseña a aceptar la derrota. (4) El tablero de mi primo es de plástico.", "La oración 4", "La oración 1", "La oración 3"),
  pt(NOT, "(1) Las lenguas originarias guardan saberes. (2) El recreo empieza a las diez. (3) En ellas hay nombres para plantas medicinales. (4) Si una lengua muere, ese saber se pierde.", "La oración 2", "La oración 3", "La oración 4"),
  pt(NOT, "(1) Caminar es un ejercicio completo. (2) Fortalece el corazón. (3) No necesita equipo. (4) Las zapatillas rojas están de moda.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) La imprenta cambió el mundo. (2) Antes, los libros se copiaban a mano. (3) Los monjes vivían en monasterios fríos. (4) Con ella, el saber llegó a más personas.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) El agua dulce es escasa. (2) Solo una pequeña parte del agua del planeta es bebible. (3) Me gusta nadar en verano. (4) Por eso hay que cuidarla.", "La oración 3", "La oración 1", "La oración 4"),
  pt(NOT, "(1) El cóndor es un símbolo andino. (2) Aparece en mitos y danzas. (3) Figura en el escudo de varios países. (4) Los loros repiten palabras.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) Mi abuela teje desde niña. (2) El bus pasa cada veinte minutos. (3) Aprendió mirando a su madre. (4) Hoy enseña a sus nietas.", "La oración 2", "La oración 3", "La oración 4"),
];

// --- U. Introducciones y conclusiones ----------------------------------------

const TOPIC = "¿Cuál es la mejor oración temática para este párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Regula la temperatura del planeta, produce buena parte del oxígeno y alimenta a millones de personas.", "El océano es esencial para la vida en la Tierra.", "El océano es de color azul y tiene muchas olas grandes.", "Hay cinco océanos."),
  pt(TOPIC, "___ Unos tejen, otros pescan, otros siembran papa a cuatro mil metros. Todos conservan técnicas heredadas de sus abuelos.", "En el Perú, muchos oficios se transmiten de generación en generación.", "Los abuelos son personas mayores.", "La papa crece en la altura."),
  pt(TOPIC, "___ Las manos me sudaban. Repasé la primera línea diez veces. Cuando dijeron mi nombre, sentí que el piso se movía.", "Nunca estuve tan nervioso como el día del recital.", "Los recitales se hacen en el auditorio.", "El piso del auditorio es de madera muy brillante."),
  pt(TOPIC, "___ Ahorra tiempo, permite hablar con familiares lejanos y pone miles de libros al alcance. Sin embargo, también distrae y difunde datos falsos.", "Internet tiene ventajas y desventajas.", "Internet es muy rápido.", "Los familiares lejanos llaman poco y casi nunca escriben."),
  pt(TOPIC, "___ Tenía el pelaje embarrado, una oreja caída y la cola entre las patas. Aun así, cuando le acerqué la mano, la lamió.", "El perro que hallamos en la carretera se veía maltratado.", "Los perros tienen cuatro patas y una cola peluda.", "La carretera es larga."),
  pt(TOPIC, "___ En marzo florecen las retamas. En julio las heladas blanquean los techos. En octubre vuelven las lluvias.", "En mi pueblo, cada estación trae un paisaje distinto.", "Las retamas son amarillas.", "En marzo empiezan las clases en todas las escuelas."),
];
const END = "¿Cuál es la mejor oración de cierre para este párrafo?";
const CONCLUDING: ChoiceItem[] = [
  pt(END, "Los murales del barrio los pintaron los propios vecinos. Cada uno cuenta una historia: la llegada del agua, la primera escuela. ___", "Así, las paredes guardan la memoria del barrio.", "Las paredes del barrio son de ladrillo y de cemento.", "La pintura era azul."),
  pt(END, "Separar la basura toma un minuto. Con ello se recupera papel, vidrio y plástico que volverán a usarse. ___", "Un gesto pequeño, repetido por muchos, cambia una ciudad.", "El vidrio es transparente.", "El plástico se usa para fabricar muchos envases."),
  pt(END, "Ensayamos dos meses. Hubo discusiones, olvidos y un disfraz que se rompió la víspera. ___", "Pero cuando sonó el aplauso, todo aquello valió la pena.", "Los disfraces eran de tela.", "Dos meses son aproximadamente sesenta días."),
  pt(END, "El oso de anteojos necesita bosques extensos. Cada carretera que los divide lo deja más aislado. ___", "Protegerlo exige, ante todo, conservar su hogar.", "El oso tiene manchas claras alrededor de los ojos.", "Las carreteras son largas."),
  pt(END, "Leer en voz alta mejora la pronunciación, enseña a hacer pausas y ayuda a perder el miedo al público. ___", "Por estas razones, conviene practicarlo cada día.", "La voz sale de la garganta.", "El público se sienta en sillas ordenadas en filas."),
  pt(END, "Mi abuelo no fue a la escuela, pero sabe cuándo lloverá con solo mirar los cerros. ___", "Hay saberes que no están en los libros.", "Los cerros son altos.", "Mi abuelo tiene un sombrero de paja muy antiguo."),
];

// --- V. Resumir --------------------------------------------------------------

const SUM = "¿Cuál es el mejor resumen del relato?";
const SUMMARIES: ChoiceItem[] = [
  pt(SUM, "Lía quería un perro, pero su mamá decía que no había espacio. Entonces Lía se ofreció a pasear a los perros de los vecinos. Lo hizo durante tres meses, sin faltar. Su mamá, al ver su constancia, aceptó adoptar un cachorro del albergue.", "Lía demuestra que es responsable y su mamá acepta adoptar un perro.", "Lía pasea perros de los vecinos durante tres meses.", "A Lía le gustan mucho los animales, sobre todo los perros de color marrón."),
  pt(SUM, "Un pueblo se quedó sin puente tras la crecida. Los adultos esperaban ayuda de la capital. Mientras tanto, un grupo de jóvenes tendió una oroya con cables viejos. Por ella cruzaron medicinas y alimentos hasta que llegó el puente nuevo.", "Sin puente, unos jóvenes tienden una oroya y resuelven la emergencia.", "Una crecida destruyó el puente del pueblo y, tiempo después, la capital mandó otro.", "Los jóvenes tenían cables viejos."),
  pt(SUM, "Don Ciro vendía helados en un triciclo. Cuando abrieron una heladería moderna enfrente, perdió clientes. En vez de rendirse, creó sabores de frutas de la zona: aguaymanto, lúcuma, tumbo. Pronto la gente volvió a hacer cola.", "Un heladero supera la competencia innovando con sabores locales.", "Don Ciro tenía un triciclo de helados.", "Abrieron una heladería moderna con muchas luces de colores."),
  pt(SUM, "Mateo encontró una billetera con dinero. Pensó en la bicicleta que quería. Luego vio la foto de una familia dentro. Buscó la dirección y la devolvió. El dueño, agradecido, le ofreció trabajo de fin de semana en su taller.", "Mateo devuelve una billetera y su honestidad es recompensada.", "Mateo quería una bicicleta.", "En la billetera había una foto de una familia y también algunos billetes doblados."),
  pt(SUM, "Las hermanas Quispe heredaron una chacra seca. Una quiso venderla; la otra propuso recuperar un antiguo canal inca. Trabajaron dos años. Al tercero, el agua volvió a correr y cosecharon quinua.", "Dos hermanas recuperan un canal antiguo y reviven su chacra.", "Las hermanas Quispe heredaron una chacra seca y una de ellas quiso venderla.", "La quinua es un cultivo andino."),
  pt(SUM, "En el concurso de talentos, el micrófono de Abril se apagó. El público empezó a murmurar. Abril dejó el micrófono, caminó al borde del escenario y cantó a viva voz. No ganó, pero fue la más aplaudida.", "Abril resuelve un imprevisto con valentía y se gana al público.", "El micrófono de Abril se apagó durante el concurso.", "Abril no ganó el concurso de talentos de su escuela ese año."),
];

// --- W. Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (lo que alguien piensa)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["El río Amazonas desemboca en el océano Atlántico.", "La Luna tarda unos 28 días en dar una vuelta a la Tierra.", "El quechua es lengua oficial del Perú.", "Machu Picchu fue declarado Patrimonio de la Humanidad en 1983.", "El corazón humano tiene cuatro cavidades.", "Un año bisiesto tiene 366 días."].map((x) => FO(x, 0)),
  ...["El Amazonas es el río más impresionante del planeta.", "La Luna llena es más bonita que la menguante.", "El quechua debería enseñarse en todas las escuelas.", "Machu Picchu es el mejor destino del mundo.", "Correr es más saludable que nadar.", "Febrero es un mes aburrido."].map((x) => FO(x, 1)),
];
const OPIN = "¿Qué oración expresa la opinión del autor?";
const AUTHOR_OPINION: ChoiceItem[] = [
  pt(OPIN, "(1) El distrito tiene tres parques. (2) Considero que son insuficientes. (3) Viven aquí cuarenta mil personas.", "La oración 2", "La oración 1", "La oración 3"), pt(OPIN, "(1) A mi juicio, la tarea debería ser más breve. (2) Hoy dejaron veinte ejercicios. (3) La clase dura una hora.", "La oración 1", "La oración 2", "La oración 3"),
  pt(OPIN, "(1) La obra dura dos horas. (2) Actúan doce personas. (3) Sin duda, es la mejor del año.", "La oración 3", "La oración 1", "La oración 2"), pt(OPIN, "(1) El museo cobra cinco soles. (2) Creo que debería ser gratuito para escolares. (3) Abre de martes a domingo.", "La oración 2", "La oración 1", "La oración 3"),
  pt(OPIN, "(1) Es lamentable que se talen esos árboles. (2) Tienen más de cien años. (3) Están en la avenida principal.", "La oración 1", "La oración 2", "La oración 3"), pt(OPIN, "(1) El libro tiene 200 páginas. (2) Trata de un viaje al Amazonas. (3) Me parece demasiado lento al comienzo.", "La oración 3", "La oración 1", "La oración 2"),
];
const REASON = "¿Qué razón apoya mejor la opinión?";
const REASONS: ChoiceItem[] = [
  pt(REASON, "Opinión: La escuela debería enseñar primeros auxilios.", "Saber actuar a tiempo puede salvar una vida.", "Los botiquines suelen ser de color blanco y rojo.", "Mi tía es enfermera."),
  pt(REASON, "Opinión: Los parques deben tener más árboles nativos.", "Necesitan menos agua y alimentan a las aves locales.", "Los árboles tienen hojas.", "Me gustan los parques grandes con muchas bancas."),
  pt(REASON, "Opinión: Es mejor estudiar un poco cada día que todo al final.", "La memoria retiene más si se repasa seguido.", "Los exámenes son los viernes a primera hora.", "Tengo un escritorio nuevo."),
  pt(REASON, "Opinión: Deberíamos tener una radio escolar.", "Los alumnos practicarían cómo hablar y redactar.", "Las radios funcionan con antenas, ondas y parlantes.", "Mi abuelo escucha radio."),
  pt(REASON, "Opinión: Hay que reducir el uso de sorbetes.", "Tardan siglos en degradarse y dañan el mar.", "Los sorbetes son de colores.", "Algunos sorbetes se doblan en la parte de arriba."),
  pt(REASON, "Opinión: Leer cuentos a los niños pequeños es importante.", "Amplía su vocabulario antes de entrar a la escuela.", "Los cuentos tienen dibujos.", "Hay cuentos muy largos y otros bastante cortos."),
];
const DETAIL = "¿Qué detalle del texto apoya la afirmación?";
const SUPPORT_LITERARY: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: Irma es perseverante.\nTexto: Irma vivía cerca de la cancha del barrio. Falló veinte lanzamientos y pidió otros veinte. Usaba una vincha.", "Falló veinte y pidió otros veinte.", "Vivía cerca de la cancha del barrio.", "Usaba una vincha."),
  pt(DETAIL, "Afirmación: El anciano es desconfiado.\nTexto: El anciano tenía una tienda en la esquina. Contaba el vuelto tres veces. Vendía pan.", "Contaba el vuelto tres veces.", "Tenía una tienda en la esquina.", "Vendía pan."),
  pt(DETAIL, "Afirmación: Los amigos son leales.\nTexto: Los tres amigos iban al mismo salón de quinto. Cuando castigaron a uno, los otros se quedaron sin recreo con él. Tenían once años.", "Se quedaron sin recreo con él.", "Iban al mismo salón de quinto.", "Tenían once años."),
  pt(DETAIL, "Afirmación: La niña es observadora.\nTexto: La niña llegó a la casa de campo el sábado. Notó que faltaba una teja y que el gato cojeaba. Llevaba botas.", "Notó la teja que faltaba y la cojera del gato.", "Llegó a la casa de campo el sábado.", "Llevaba botas."),
  pt(DETAIL, "Afirmación: El capitán es prudente.\nTexto: El capitán tenía un barco pesquero muy antiguo. Al ver nubes negras, ordenó volver al puerto. Tenía barba.", "Ordenó volver al ver las nubes.", "Tenía un barco pesquero muy antiguo.", "Tenía barba."),
  pt(DETAIL, "Afirmación: Mario está arrepentido.\nTexto: Mario rompió el jarrón de la sala jugando. Lo pegó pieza por pieza y pidió disculpas. Era martes.", "Lo pegó y pidió disculpas.", "Rompió el jarrón de la sala jugando.", "Era martes."),
];
const SUPPORT_INFO: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: Los murciélagos ayudan a la agricultura.\nTexto: Los murciélagos son mamíferos que vuelan de noche. Comen toneladas de insectos que dañan cultivos. Duermen colgados.", "Comen insectos que dañan cultivos.", "Son mamíferos que vuelan de noche.", "Duermen colgados."),
  pt(DETAIL, "Afirmación: Caral fue una sociedad pacífica.\nTexto: Caral está en el valle de Supe, al norte de Lima. No se han hallado armas ni murallas. Tiene pirámides.", "No se hallaron armas ni murallas.", "Está en el valle de Supe, al norte de Lima.", "Tiene pirámides."),
  pt(DETAIL, "Afirmación: El sueño ayuda a la memoria.\nTexto: Los niños de diez años duermen unas nueve horas. Durante el sueño, el cerebro fija lo aprendido. Algunos sueñan.", "El cerebro fija lo aprendido al dormir.", "Los niños de diez años duermen nueve horas.", "Algunos sueñan."),
  pt(DETAIL, "Afirmación: La papa tiene gran diversidad.\nTexto: La papa se cultiva en los Andes desde hace milenios. Existen más de tres mil variedades. Se cosecha en mayo.", "Existen más de tres mil variedades.", "Se cultiva en los Andes desde hace milenios.", "Se cosecha en mayo."),
  pt(DETAIL, "Afirmación: Los glaciares retroceden.\nTexto: El Pastoruri está en la cordillera Blanca, en Áncash. Ha perdido la mitad de su hielo. Recibe turistas.", "Ha perdido la mitad de su hielo.", "Está en la cordillera Blanca, en Áncash.", "Recibe turistas."),
  pt(DETAIL, "Afirmación: La lectura mejora la escritura.\nTexto: En la escuela se lee una hora diaria desde marzo. Quienes leen más cometen menos errores al escribir. Hay una biblioteca.", "Quienes leen más cometen menos errores.", "Se lee una hora diaria desde marzo.", "Hay una biblioteca."),
];

// --- X. Detalles descriptivos ------------------------------------------------

const SHOW = "¿Qué oración muestra la emoción o el rasgo, en lugar de solo decirlo?";
const EMOTIONS: ChoiceItem[] = [
  pt(SHOW, "Idea: Clara estaba impaciente.", "Clara miró el reloj por quinta vez.", "Clara sentía una impaciencia realmente enorme.", "Clara era impaciente."),
  pt(SHOW, "Idea: El niño tenía frío.", "El niño metió las manos bajo las axilas.", "El niño sentía muchísimo frío esa mañana.", "Hacía frío."),
  pt(SHOW, "Idea: La maestra estaba orgullosa.", "La maestra pegó el dibujo en la puerta.", "La maestra se sentía muy orgullosa de todos.", "Estaba contenta."),
  pt(SHOW, "Idea: Iván es desordenado.", "Bajo su cama había medias de tres semanas.", "Iván es un chico desordenado en todo lo que hace.", "No ordena."),
  pt(SHOW, "Idea: El público estaba emocionado.", "Nadie se sentó durante el último tema.", "El público estaba verdaderamente muy emocionado.", "Les gustó."),
  pt(SHOW, "Idea: Mi tío es tacaño.", "Mi tío reutiliza hasta las bolsitas de té.", "Mi tío es una persona bastante tacaña siempre.", "No gasta."),
  pt(SHOW, "Idea: Sara estaba decepcionada.", "Sara guardó la medalla sin mirarla.", "Sara sentía una decepción demasiado profunda.", "Estaba triste."),
  pt(SHOW, "Idea: El perro tenía miedo.", "El perro se metió bajo la mesa, temblando.", "El perro tenía un miedo terrible a los truenos.", "Se asustó."),
];
const VERB = "¿Qué verbo es más preciso que el que está entre corchetes?";
const STRONG_VERB: ChoiceItem[] = [
  pt(VERB, "El río [pasó] sobre el puente y lo destruyó.", "arrasó", "estuvo", "anduvo"), pt(VERB, "La gimnasta [fue] por el aire.", "voló", "tuvo", "pasó"),
  pt(VERB, "El anciano [caminaba] con dificultad por la cuesta.", "cojeaba", "iba", "estaba"), pt(VERB, "Los hinchas [dijeron] el nombre del goleador.", "corearon", "hablaron", "pusieron"),
  pt(VERB, "El ladrón [miró] la casa durante días.", "vigiló", "vio", "tuvo"), pt(VERB, "La niña [tomó] el vaso de agua de un tirón.", "se bebió", "tuvo", "hizo"),
  pt(VERB, "El fuego [estuvo] en todo el pajonal.", "se propagó", "pasó", "hubo"), pt(VERB, "El zorro [fue] entre los arbustos sin hacer ruido.", "se escabulló", "anduvo", "pasó"),
  pt(VERB, "La noticia [hizo sentir mal] a todo el pueblo.", "conmovió", "pasó", "llegó"), pt(VERB, "El orador [habló] durante dos horas sin parar.", "disertó", "dijo", "estuvo"),
];
const IMAGE = "¿Qué oración agrega una imagen más viva al relato?";
const IMAGERY: ChoiceItem[] = [
  pt(IMAGE, "Relato: Subimos al mirador al amanecer. ___", "El valle despertaba bajo un mar de neblina.", "Desde arriba se veía todo bastante bien.", "Era muy temprano."),
  pt(IMAGE, "Relato: Abrí el baúl de mi abuelo. ___", "Olía a naftalina y a papel viejo.", "Dentro había varias cosas antiguas de la familia.", "Era un baúl."),
  pt(IMAGE, "Relato: Empezó el partido. ___", "La tribuna rugió y tembló el piso.", "Había muchísima gente mirando el partido.", "Todos miraban."),
  pt(IMAGE, "Relato: Entré a la cocina. ___", "El aceite chisporroteaba y picaba en los ojos.", "Estaban cocinando algo para el almuerzo de hoy.", "Había comida."),
  pt(IMAGE, "Relato: Cayó la helada. ___", "El pasto crujía como vidrio bajo las botas.", "El pasto estaba muy frío esa mañana de julio.", "Hacía frío."),
  pt(IMAGE, "Relato: La feria abrió sus puertas. ___", "Entre humo de anticuchos sonaba una banda.", "Había mucha comida y también bastante música.", "Era una feria."),
];

// --- Y. Variedad de oraciones ------------------------------------------------

const MODEL = "¿Qué oración sigue la misma estructura que el modelo?";
const VARIED: ChoiceItem[] = [
  pt(MODEL, "Modelo: Apenas amaneció, los arrieros ensillaron las mulas.", "Apenas escampó, los niños salieron al patio.", "Los niños salieron al patio porque había escampado.", "Escampó y salieron."),
  pt(MODEL, "Modelo: La laguna, quieta y oscura, reflejaba los nevados.", "El anciano, sereno y firme, miraba el horizonte.", "El anciano miraba el horizonte con mucha serenidad.", "Miraba el anciano."),
  pt(MODEL, "Modelo: No solo ganó la carrera, sino que batió el récord.", "No solo leyó el libro, sino que escribió una reseña.", "Leyó el libro completo y después escribió una reseña.", "Leyó y escribió."),
  pt(MODEL, "Modelo: Si el río crece, cerrarán el puente.", "Si la lluvia sigue, suspenderán el desfile.", "La lluvia sigue y por eso suspenderán el desfile.", "Sigue lloviendo."),
  pt(MODEL, "Modelo: Silbando una tonada, el pastor bajó del cerro.", "Arrastrando la mochila, Luis entró al salón.", "Luis entró al salón y arrastraba su pesada mochila.", "Luis entró cansado."),
  pt(MODEL, "Modelo: ¡Qué frío hace en la puna!", "¡Qué calor hace en la selva!", "En la selva hace muchísimo calor todo el año.", "¿Hace calor allá?"),
  pt(MODEL, "Modelo: Ni el viento ni la lluvia detuvieron al cartero.", "Ni el sueño ni el hambre vencieron a la corredora.", "La corredora venció tanto al sueño como al hambre.", "Venció la corredora."),
  pt(MODEL, "Modelo: Mientras el pan se horneaba, la abuela contaba historias.", "Mientras el bus avanzaba, los niños cantaban.", "El bus avanzaba y además los niños iban cantando.", "Los niños cantaban."),
];

// --- Z. Corregir y revisar ---------------------------------------------------

const CONFUSED_USE: ChoiceItem[] = [
  f("Vamos ___ qué dan en el cine.", "a ver", "haber", "a haber"), f("Debe ___ una solución para este problema.", "haber", "a ver", "aver"),
  f("___ un gato en el techo.", "Hay", "Ahí", "Ay"), f("Deja la mochila ___, junto a la puerta.", "ahí", "hay", "ay"),
  f("¡___, me pisaste!", "Ay", "Hay", "Ahí"), f("No fui ___ estaba enfermo.", "porque", "por qué", "porqué"),
  f("¿___ llegaste tan tarde?", "Por qué", "Porque", "Porqué"), f("No quiero té, ___ café.", "sino", "si no", "sinó"),
  f("___ estudias, no aprobarás.", "Si no", "Sino", "Sinó"), f("Ya he ___ la tarea.", "hecho", "echo", "hécho"),
  f("Siempre le ___ sal a la sopa.", "echo", "hecho", "hécho"), f("Ojalá ___ sol mañana.", "haya", "halla", "aya"),
  f("El perro siempre ___ su hueso.", "halla", "haya", "aya"), f("Mi hermano ___ viajado a Puno.", "ha", "a", "ah"),
  f("Voy ___ la biblioteca.", "a", "ha", "ah"), f("Canta ___ que todos la aplauden.", "tan bien", "también", "tambien"),
];
const FIX = "La oración tiene un error. ¿Cómo se corrige?";
const CONFUSED_FIX: ChoiceItem[] = [
  pt(FIX, "Haber si vienes mañana.", "A ver si vienes mañana.", "Aver si vienes mañana.", "Haver si vienes mañana."), pt(FIX, "Ahí tres panes en la mesa.", "Hay tres panes en la mesa.", "Ay tres panes en la mesa.", "Ahi tres panes en la mesa."),
  pt(FIX, "No vino por qué llovía.", "No vino porque llovía.", "No vino porqué llovía.", "No vino por que llovía."), pt(FIX, "No es azul, si no verde.", "No es azul, sino verde.", "No es azul, sinó verde.", "No es azul si no, verde."),
  pt(FIX, "He echo un dibujo.", "He hecho un dibujo.", "E hecho un dibujo.", "He hécho un dibujo."), pt(FIX, "Mi tía a llegado temprano.", "Mi tía ha llegado temprano.", "Mi tía ah llegado temprano.", "Mi tía há llegado temprano."),
  pt(FIX, "Yo tan bien quiero ir.", "Yo también quiero ir.", "Yo tambien quiero ir.", "Yo tanbién quiero ir."), pt(FIX, "Espero que halla clases mañana.", "Espero que haya clases mañana.", "Espero que aya clases mañana.", "Espero que haiga clases mañana."),
  pt(FIX, "¿Porque no viniste ayer?", "¿Por qué no viniste ayer?", "¿Porqué no viniste ayer?", "¿Por que no viniste ayer?"), pt(FIX, "Hay está mi cuaderno.", "Ahí está mi cuaderno.", "Ay está mi cuaderno.", "Ai está mi cuaderno."),
];
const SIGN = "Este cartel tiene un error. ¿Cómo se corrige?";
const SIGNS: ChoiceItem[] = [
  pt(SIGN, "🪧 «Se necesita mozos»", "«Se necesitan mozos»", "«Se nesecita mozos»", "«Se necesita Mozos»"), pt(SIGN, "🪧 «Prohibido el ingreso ha menores»", "«Prohibido el ingreso a menores»", "«Proibido el ingreso ha menores»", "«Prohibido el ingreso ah menores»"),
  pt(SIGN, "🪧 «Ahí almuerzos desde S/ 8»", "«Hay almuerzos desde S/ 8»", "«Ay almuerzos desde S/ 8»", "«Ahí almuersos desde S/ 8»"), pt(SIGN, "🪧 «Exelente atención»", "«Excelente atención»", "«Ecselente atención»", "«Exelente atension»"),
  pt(SIGN, "🪧 «Reparasión de celulares»", "«Reparación de celulares»", "«Reparacion de selulares»", "«Reparazión de celulares»"), pt(SIGN, "🪧 «Favor de no tirar vasura»", "«Favor de no tirar basura»", "«Fabor de no tirar vasura»", "«Favor de no tirar bazura»"),
  pt(SIGN, "🪧 «Abierto de Lunes a Sábado»", "«Abierto de lunes a sábado»", "«abierto de Lunes a Sábado»", "«Abierto de Lunes a sabado»"), pt(SIGN, "🪧 «Pase adelante porfavor»", "«Pase adelante, por favor»", "«Pase adelante por fabor»", "«Pase a delante porfavor»"),
  pt(SIGN, "🪧 «Halla paz en este hogar»", "«Haya paz en este hogar»", "«Aya paz en este hogar»", "«Halla pas en este hogar»"), pt(SIGN, "🪧 «No se aceptan devoluciónes»", "«No se aceptan devoluciones»", "«No se acepta devoluciónes»", "«No se aseptan devoluciónes»"),
];

// --- AA. Investigación -------------------------------------------------------

const PLAG = "¿Es plagio? ¿Por qué?";
const SOURCE = "Fuente (revista «Andes», artículo de Luis Vega): «Los glaciares tropicales son los más sensibles al aumento de la temperatura».";
const PLAGIARISM: ChoiceItem[] = [
  pt(PLAG, `${SOURCE}\nAlumna: Los glaciares tropicales son los más sensibles al aumento de la temperatura.`, "Sí: copió la frase sin comillas ni autor.", "No: es información científica de uso libre.", "No: cambió el orden."),
  pt(PLAG, `${SOURCE}\nAlumna: Como señala Luis Vega, los glaciares de las zonas tropicales reaccionan más que otros cuando sube la temperatura.`, "No: parafraseó y mencionó al autor.", "Sí: usó la misma idea que el artículo.", "Sí: faltan comillas."),
  pt(PLAG, `${SOURCE}\nAlumna: Los glaciares de los trópicos son los que más sufren con el calor.`, "Sí: cambió palabras, pero no citó la fuente.", "No: usó palabras completamente distintas.", "No: es muy corto."),
  pt(PLAG, `${SOURCE}\nAlumna: Según la revista «Andes», «los glaciares tropicales son los más sensibles al aumento de la temperatura».`, "No: usó comillas e indicó la fuente.", "Sí: copió la frase palabra por palabra.", "Sí: no opinó."),
  w("¿Qué es parafrasear?", "Decir la idea de otro con palabras propias", "Copiar un texto entre comillas", "Inventar un dato que no está en ninguna fuente"),
  w("Parafraseas una idea de un libro. ¿Debes citar al autor?", "Sí: la idea sigue siendo suya.", "No: las palabras ya son tuyas.", "Solo si el libro es muy antiguo."),
  w("¿Qué datos debe tener una referencia?", "Autor, título y año de publicación", "El color de la portada", "El número de páginas que leíste esa tarde"),
  w("Usas una foto de internet en tu trabajo. ¿Qué corresponde hacer?", "Indicar de dónde la tomaste", "Recortarla para que no se note", "Nada, porque las fotos no tienen autor"),
];
const SRC = sorter(["Fuente primaria (de alguien que lo vivió o del momento)", "Fuente secundaria (lo explica alguien después)"], "¿Es una fuente primaria o secundaria?");
const SOURCES: ChoiceItem[] = [
  ...["Las cartas de Micaela Bastidas", "Una foto del terremoto tomada ese día", "El cuaderno de campo de una bióloga", "La grabación de un discurso", "Un ceramio mochica original", "El testimonio de un excombatiente"].map((x) => SRC(x, 0)),
  ...["Una biografía de Micaela Bastidas escrita en 2010", "Un reportaje sobre el terremoto, veinte años después", "Un libro de texto de biología", "Un análisis de aquel discurso", "Una enciclopedia sobre los mochicas", "Un documental actual sobre la guerra"].map((x) => SRC(x, 1)),
];

export const ROWS: Row[] = [
  ["T.1", "Poner las oraciones en orden", (r) => order(r, "Ordena las oraciones.", SENTENCE_ORDER)],
  ["T.2", "Usar conjunciones coordinantes", (r) => choose(r, "Completa la oración.", COORD)],
  ["T.3", "Elegir el mejor conector", (r) => choose(r, "Completa con el mejor conector.", TRANSITION)],
  ["T.4", "Ordenar de lo más general a lo más específico", (r) => order(r, "Ordena de lo más general a lo más específico.", GENERAL_SPECIFIC)],
  ["T.5", "Organizar la información por tema", (r) => choose(r, "", BY_TOPIC)],
  ["T.6", "Quitar la oración que no pertenece", (r) => choose(r, "", NOT_BELONG)],

  ["U.1", "Elegir la mejor oración temática", (r) => choose(r, "", TOPIC_SENTENCE)],
  ["U.2", "Elegir la mejor oración de cierre", (r) => choose(r, "", CONCLUDING)],

  ["V.1", "Resumir un relato", (r) => choose(r, "", SUMMARIES)],

  ["W.1", "Distinguir hechos de opiniones", (r) => choose(r, "", FACT_OPINION)],
  ["W.2", "Identificar la opinión que expresa el autor", (r) => choose(r, "", AUTHOR_OPINION)],
  ["W.3", "Elegir razones que apoyen una opinión", (r) => choose(r, "", REASONS)],
  ["W.4", "Identificar detalles de apoyo en textos literarios", (r) => choose(r, "", SUPPORT_LITERARY)],
  ["W.5", "Identificar detalles de apoyo en textos informativos", (r) => choose(r, "", SUPPORT_INFO)],

  ["X.1", "Mostrar las emociones y los rasgos de los personajes", (r) => choose(r, "", EMOTIONS)],
  ["X.2", "Mejorar la oración con un verbo más preciso", (r) => choose(r, "", STRONG_VERB)],
  ["X.3", "Agregar imágenes a los relatos", (r) => choose(r, "", IMAGERY)],

  ["Y.1", "Crear oraciones variadas a partir de modelos", (r) => choose(r, "", VARIED)],

  ["Z.1", "Usar la palabra correcta entre las que se confunden", (r) => choose(r, "Completa la oración.", CONFUSED_USE)],
  ["Z.2", "Corregir errores con palabras que se confunden", (r) => choose(r, "", CONFUSED_FIX)],
  ["Z.3", "Corregir errores en carteles", (r) => choose(r, "", SIGNS)],

  ["AA.1", "Identificar y corregir el plagio", (r) => choose(r, "", PLAGIARISM)],
  ["AA.2", "Identificar fuentes primarias y secundarias", (r) => choose(r, "", SOURCES)],
];
