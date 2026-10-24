import { choose, order, pickInSentence, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Primaria · banco de escritura: organizar la escritura, oraciones
// temáticas y de cierre, conectores, argumentos y detalles de apoyo,
// detalles descriptivos, variedad de oraciones, corrección e investigación.


// --- Organizar la escritura -----------------------------------------------

const SENTENCE_ORDER: OrderItem[] = [
  { seq: ["El sábado fuimos a sembrar árboles al parque.", "Primero cavamos los hoyos con una lampa.", "Después colocamos los plantones y los cubrimos de tierra.", "Al final regamos todo y nos tomamos una foto."] },
  { seq: ["Mi perro se escapó ayer por la tarde.", "Lo buscamos por todo el barrio sin suerte.", "Entonces pegamos carteles con su foto.", "Esta mañana una vecina lo trajo a casa."] },
  { seq: ["Para hacer una cometa, corta dos cañas delgadas.", "Luego amárralas en forma de cruz.", "Después pega el papel sobre las cañas.", "Por último, ata la cola y el hilo."] },
  { seq: ["Los alumnos notaron que el patio estaba sucio.", "Propusieron formar brigadas de limpieza.", "Cada salón eligió un día de la semana.", "Un mes después, el patio lucía impecable."] },
  { seq: ["Hace millones de años, los dinosaurios dominaban la Tierra.", "Un día, un enorme asteroide chocó contra el planeta.", "El polvo cubrió el cielo y bajó la temperatura.", "Con el tiempo, la mayoría de los dinosaurios desapareció."] },
  { seq: ["Quería aprender a montar bicicleta.", "Al principio me caí varias veces.", "Mi papá me sostuvo del asiento durante una semana.", "Ayer pedaleé solo hasta la esquina."] },
];

const GENERAL_SPECIFIC: OrderItem[] = [
  { seq: ["ser vivo", "animal", "ave", "cóndor"] }, { seq: ["lugar", "país", "ciudad", "barrio"] }, { seq: ["alimento", "fruta", "cítrico", "mandarina"] },
  { seq: ["arte", "música", "instrumento", "quena"] }, { seq: ["ciencia", "astronomía", "planeta", "Marte"] }, { seq: ["texto", "cuento", "capítulo", "párrafo"] },
  { seq: ["vehículo", "transporte acuático", "barco", "velero"] }, { seq: ["deporte", "deporte de equipo", "vóley", "saque"] }, { seq: ["ropa", "abrigo", "poncho", "poncho de alpaca"] },
];

const BY_TOPIC: ChoiceItem[] = [
  pt("Escribes sobre los delfines. ¿En qué sección va este dato?", "«Comen peces, calamares y camarones».", "Alimentación", "Hábitat", "Peligros"),
  pt("Escribes sobre los delfines. ¿En qué sección va este dato?", "«Las redes de pesca los atrapan por accidente».", "Peligros", "Alimentación", "Hábitat"),
  pt("Escribes sobre tu distrito. ¿En qué sección va este dato?", "«Se fundó en 1857 junto a un antiguo molino».", "Historia", "Lugares para visitar", "Comidas típicas"),
  pt("Escribes sobre tu distrito. ¿En qué sección va este dato?", "«El mirador ofrece la mejor vista del valle».", "Lugares para visitar", "Historia", "Comidas típicas"),
  pt("Escribes sobre el vóley. ¿En qué sección va este dato?", "«Cada equipo tiene seis jugadoras en la cancha».", "Reglas", "Historia", "Jugadoras famosas"),
  pt("Escribes sobre el vóley. ¿En qué sección va este dato?", "«Se inventó en 1895 en Estados Unidos».", "Historia", "Reglas", "Equipamiento"),
  pt("Escribes sobre los volcanes. ¿En qué sección va este dato?", "«El magma sube cuando la presión es muy alta».", "Cómo hacen erupción", "Volcanes del Perú", "Medidas de seguridad"),
  pt("Escribes sobre los volcanes. ¿En qué sección va este dato?", "«Aléjate de la zona y cúbrete la nariz».", "Medidas de seguridad", "Volcanes del Perú", "Cómo hacen erupción"),
];

const NOT = "¿Qué oración no pertenece al párrafo?";
const NOT_BELONG: ChoiceItem[] = [
  pt(NOT, "(1) Los gatos son muy limpios. (2) Pasan horas lamiéndose el pelaje. (3) Mi tío tiene una camioneta roja. (4) Incluso entierran sus desechos.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) El desayuno da energía para la mañana. (2) Los niños que desayunan atienden mejor. (3) Una fruta y avena bastan. (4) El recreo dura veinte minutos.", "La oración 4", "La oración 1", "La oración 3"),
  pt(NOT, "(1) La Luna no tiene luz propia. (2) Las mareas me dan miedo. (3) Refleja la luz del Sol. (4) Por eso vemos sus fases.", "La oración 2", "La oración 3", "La oración 4"),
  pt(NOT, "(1) Mi abuelo era carpintero. (2) Hizo las sillas de toda la familia. (3) Su taller olía a cedro. (4) El cedro crece en la selva.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) Me encanta el invierno. (2) Tomo chocolate caliente. (3) Uso mi chompa favorita. (4) En verano voy a la playa.", "La oración 4", "La oración 1", "La oración 2"),
  pt(NOT, "(1) Las bibliotecas prestan libros gratis. (2) Mi lapicero se quedó sin tinta. (3) También ofrecen talleres. (4) Son lugares tranquilos para estudiar.", "La oración 2", "La oración 1", "La oración 4"),
  pt(NOT, "(1) El camello resiste días sin beber. (2) Guarda grasa en la joroba. (3) Sus pestañas lo protegen de la arena. (4) Los pingüinos viven en el hielo.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) Aprender a nadar es útil. (2) Puede salvarte la vida. (3) Mi piscina favorita es azul. (4) Además, fortalece todo el cuerpo.", "La oración 3", "La oración 1", "La oración 4"),
];

// --- Introducciones y conclusiones ----------------------------------------

const TOPIC = "¿Cuál es la mejor oración temática para este párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Tiene parques con juegos, una biblioteca nueva y una losa deportiva. Además, los vecinos se saludan por su nombre.", "Mi barrio es un buen lugar para vivir.", "Mi barrio tiene una losa.", "Algunos barrios de la ciudad son muy grandes."),
  pt(TOPIC, "___ Guía a personas ciegas, encuentra a quienes se pierden en la montaña y acompaña a los enfermos.", "El perro ayuda al ser humano de muchas maneras.", "Los perros ladran.", "El perro es un animal de cuatro patas y cola."),
  pt(TOPIC, "___ Primero sentí un cosquilleo. Luego el tablón tembló bajo mis pies. Cerré los ojos y salté al agua.", "Nunca olvidaré mi primer salto del trampolín.", "Las piscinas tienen agua.", "Mi hermano sabe nadar muy bien desde pequeño."),
  pt(TOPIC, "___ Se puede comer sancochada, frita, al horno o en puré. Hay papas amarillas, moradas y rojas.", "La papa es un alimento muy variado.", "La papa es amarilla.", "A mi primo no le gusta el puré."),
  pt(TOPIC, "___ Apaga las luces que no uses. Cierra bien el caño. Camina en lugar de pedir que te lleven en auto.", "Hay acciones sencillas para cuidar el planeta.", "El planeta es redondo.", "Los autos modernos tienen cuatro puertas."),
  pt(TOPIC, "___ El cielo se puso negro en minutos. El viento arrancó las tejas y el río creció hasta la plaza.", "La tormenta del martes fue la peor del año.", "El martes es un día.", "Las tejas de mi casa son rojas."),
];

const END = "¿Cuál es la mejor oración de cierre para este párrafo?";
const CONCLUDING: ChoiceItem[] = [
  pt(END, "Leer cada noche tiene ventajas. Aprendes palabras nuevas, descansas de las pantallas y duermes mejor. ___", "Por eso, vale la pena leer antes de dormir.", "Mi libro favorito tiene más de cien páginas.", "Las pantallas de los celulares son cada vez más grandes."),
  pt(END, "El día de campo salió perfecto. Jugamos fútbol, comimos choclo con queso y nos bañamos en el río. ___", "Fue un día que todos queremos repetir.", "El choclo es amarillo y el queso, blanco.", "El río nace en una montaña."),
  pt(END, "Los murciélagos son útiles. Comen miles de insectos cada noche y esparcen semillas por el bosque. ___", "En resumen, merecen cuidado y no miedo.", "Los murciélagos son de color negro o marrón.", "También hay insectos que salen de día."),
  pt(END, "Para la función ensayamos un mes entero. Cosimos los disfraces y pintamos el escenario. ___", "Al abrirse el telón, supimos que valió la pena.", "El telón del teatro de la escuela es de color rojo.", "Un mes tiene treinta días."),
  pt(END, "Tener una mascota exige compromiso. Hay que alimentarla, limpiarla y llevarla al veterinario. ___", "Así que, antes de adoptar, piénsalo bien.", "Los veterinarios usan bata blanca y guantes.", "Mi vecina tiene dos gatos y un loro."),
  pt(END, "El agua es escasa en muchas ciudades. Cada gota que se desperdicia le falta a otra persona. ___", "Por todo ello, debemos usarla con cuidado.", "El agua de los ríos y de los lagos es transparente.", "Las ciudades tienen edificios."),
];

// --- Conectores -----------------------------------------------------------

const TIME_IN = [
  s("Primero lavamos las verduras y luego las picamos.", "Primero", "luego"), s("Antes cenábamos temprano; ahora cenamos tarde.", "Antes", "ahora"),
  s("Después del almuerzo dormimos y finalmente salimos.", "Después", "finalmente"), s("Ayer llovió, hoy hay sol y mañana viajaremos.", "Ayer", "hoy", "mañana"),
  s("Mientras cocinaba, sonó el teléfono; entonces apagué la hornilla.", "Mientras", "entonces"), s("Anoche terminé el libro y pronto empezaré otro.", "Anoche", "pronto"),
  s("Inicialmente dudé, pero posteriormente acepté.", "Inicialmente", "posteriormente"), s("Todavía no llega el bus; ya debería estar aquí.", "Todavía", "ya"),
];

const COORD: ChoiceItem[] = [
  f("Quise llamarte, ___ mi celular no tenía batería.", "pero", "o", "ni"), f("No vino Carla ___ tampoco su hermana.", "ni", "pero", "sino"),
  f("¿Prefieres chicha ___ limonada?", "o", "ni", "e"), f("Estudia geografía ___ historia.", "e", "y", "u"),
  f("No es un sapo, ___ una rana.", "sino", "pero", "ni"), f("Tiene siete ___ ocho años.", "u", "o", "e"),
  f("Barrí el patio ___ regué las plantas.", "y", "ni", "sino"), f("El examen era largo, ___ lo terminé a tiempo.", "pero", "o", "e"),
  f("No iremos en bus, ___ en tren.", "sino", "o", "y"), f("Llegaron Marta ___ Ignacio.", "e", "y", "o"),
];

const SUBORD: ChoiceItem[] = [
  f("Llevé paraguas ___ el cielo estaba nublado.", "porque", "aunque", "si"), f("Te presto mi libro ___ me lo devuelves el lunes.", "si", "aunque", "porque"),
  f("___ estaba cansada, terminó la carrera.", "Aunque", "Porque", "Si"), f("Apaga la luz ___ salgas del cuarto.", "cuando", "aunque", "porque"),
  f("Yo barro ___ tú sacudes los muebles.", "mientras", "si", "aunque"), f("No salgas ___ deje de llover.", "hasta que", "porque", "si"),
  f("Habla más alto ___ todos te escuchen.", "para que", "aunque", "mientras"), f("___ terminó la clase, corrimos al patio.", "Apenas", "Aunque", "Para que"),
  f("Me quedé en casa ___ tenía fiebre.", "ya que", "para que", "hasta que"), f("___ no estudias, no aprobarás.", "Si", "Aunque", "Mientras"),
];

const TRANSITION: ChoiceItem[] = [
  f("Olvidé mi lonchera. ___, mi amiga compartió su almuerzo.", "Por suerte", "Por ejemplo", "En cambio"), f("A Luis le gusta el frío. ___, su hermana prefiere el calor.", "En cambio", "Por eso", "Además"),
  f("Llovió toda la noche. ___, el partido se suspendió.", "Por eso", "Sin embargo", "Por ejemplo"), f("Hay frutas muy ácidas. ___, el limón y el maracuyá.", "Por ejemplo", "En cambio", "Por eso"),
  f("Estudió mucho. ___, no aprobó el examen.", "Sin embargo", "Además", "Por ejemplo"), f("El museo es gratuito. ___, queda cerca de la escuela.", "Además", "Sin embargo", "En cambio"),
  f("Hicimos la maqueta y la pintamos. ___, la presentamos al salón.", "Finalmente", "En cambio", "Por ejemplo"), f("No había buses. ___, fuimos caminando.", "Así que", "Además", "Aunque"),
  f("Reciclar reduce la basura. ___, ahorra dinero.", "También", "En cambio", "Sin embargo"), f("Mi abuela no usa celular. ___, escribe cartas.", "En su lugar", "Por ejemplo", "Además"),
];

// --- Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (lo que alguien piensa)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["El Perú limita con cinco países.", "El agua hierve a 100 °C al nivel del mar.", "El lago Titicaca está a más de 3800 metros de altura.", "Una semana tiene siete días.", "La ballena azul es el animal más grande que existe.", "Lima es la capital del Perú."].map((x) => FO(x, 0)),
  ...["El ceviche es la comida más rica del mundo.", "El invierno es la peor estación.", "Todos deberían aprender a tocar guitarra.", "El lago Titicaca es el más hermoso del planeta.", "Las ballenas son aburridas.", "Leer es más divertido que ver televisión."].map((x) => FO(x, 1)),
];

const OPIN = "¿Qué oración expresa la opinión del autor?";
const AUTHOR_OPINION: ChoiceItem[] = [
  pt(OPIN, "(1) Nuestra escuela tiene un huerto. (2) Lo cuidan los alumnos de cuarto. (3) Creo que todas las escuelas deberían tener uno.", "La oración 3", "La oración 1", "La oración 2"),
  pt(OPIN, "(1) En mi opinión, los uniformes son incómodos. (2) Son de tela gruesa. (3) Se usan cinco días a la semana.", "La oración 1", "La oración 2", "La oración 3"),
  pt(OPIN, "(1) El parque abre a las ocho. (2) Es el mejor lugar del distrito. (3) Tiene veinte árboles.", "La oración 2", "La oración 1", "La oración 3"),
  pt(OPIN, "(1) Los celulares tienen cámara. (2) Muchos niños los usan. (3) Pienso que no deben usarse en clase.", "La oración 3", "La oración 1", "La oración 2"),
  pt(OPIN, "(1) El ajedrez tiene 32 piezas. (2) Me parece el juego más interesante. (3) Se juega entre dos.", "La oración 2", "La oración 1", "La oración 3"),
  pt(OPIN, "(1) Considero injusto que no haya rampas. (2) La escuela tiene tres pisos. (3) Hay dos escaleras.", "La oración 1", "La oración 2", "La oración 3"),
];

const REASON = "¿Qué razón apoya mejor la opinión?";
const REASONS: ChoiceItem[] = [
  pt(REASON, "Opinión: La escuela debería tener más tachos de basura.", "Así habría menos papeles en el suelo.", "Los tachos son de plástico o de metal muy resistente.", "A mí me gusta el color verde."),
  pt(REASON, "Opinión: Los niños deben dormir al menos nueve horas.", "Dormir bien ayuda a crecer y a concentrarse.", "Las camas son cómodas.", "De noche pasan muy pocos autos por la calle donde vivo."),
  pt(REASON, "Opinión: Deberíamos ir de paseo al museo.", "Allí veríamos lo que estudiamos en clase.", "El museo tiene varias puertas y muchas ventanas.", "Mi primo fue una vez."),
  pt(REASON, "Opinión: Es mejor ir a la escuela en bicicleta.", "Se hace ejercicio y no se contamina.", "Las bicicletas tienen dos ruedas y un timón.", "Mi bicicleta es de color azul."),
  pt(REASON, "Opinión: La clase de arte debería durar más.", "En cuarenta minutos no se termina un trabajo.", "El arte existe desde hace muchísimos siglos en el mundo.", "Tengo doce colores."),
  pt(REASON, "Opinión: No se debe alimentar a los animales del zoológico.", "La comida de las personas puede enfermarlos.", "Los animales tienen hambre.", "El zoológico cobra entrada los domingos y los feriados."),
];

const DETAIL = "¿Qué detalle del texto apoya la afirmación?";
const SUPPORT_LITERARY: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: Carmen es valiente.\nTexto: Carmen vivía en una casita junto al río. Cuando el ternero cayó al agua, se lanzó sin pensarlo. Tenía el cabello largo y oscuro.", "Se lanzó al agua sin pensarlo.", "Vivía en una casita junto al río.", "Tenía el cabello largo y oscuro."),
  pt(DETAIL, "Afirmación: El abuelo extraña su pueblo.\nTexto: El abuelo llegó a la ciudad a mediados de marzo. Cada tarde mira fotos del valle. Usa un sombrero gris.", "Cada tarde mira fotos del valle.", "Llegó a la ciudad a mediados de marzo.", "Usa un sombrero gris."),
  pt(DETAIL, "Afirmación: Los hermanos se llevan bien.\nTexto: Ana y Tito comparten un cuarto pequeño. Cuando Tito se enferma, Ana le lee cuentos. Su casa es de dos pisos.", "Ana le lee cuentos a Tito.", "Comparten un cuarto pequeño.", "Su casa es de dos pisos."),
  pt(DETAIL, "Afirmación: El zorro es astuto.\nTexto: El zorro tenía hambre desde la mañana. Fingió dormir hasta que las gallinas se acercaron. Su cola era rojiza y muy peluda.", "Fingió dormir para atraerlas.", "Tenía hambre desde la mañana.", "Su cola era rojiza y muy peluda."),
  pt(DETAIL, "Afirmación: Julia está nerviosa.\nTexto: Julia esperaba su turno detrás del telón. Se mordía las uñas. Llevaba un vestido celeste con flores.", "Se mordía las uñas.", "Esperaba su turno detrás del telón.", "Llevaba un vestido celeste."),
  pt(DETAIL, "Afirmación: El pueblo es generoso.\nTexto: El pueblo queda en lo alto de la sierra. Cuando la casa de Rosa se quemó, cada vecino llevó adobes. Hay una plaza con una pileta.", "Cada vecino llevó adobes.", "Queda en lo alto de la sierra.", "Hay una plaza con una pileta."),
];

const SUPPORT_INFO: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: El colibrí gasta mucha energía.\nTexto: El colibrí es un ave pequeña de colores brillantes. Su corazón late mil veces por minuto. Vive en América.", "Su corazón late mil veces por minuto.", "Es un ave pequeña de colores brillantes.", "Vive en América."),
  pt(DETAIL, "Afirmación: La totora es muy útil.\nTexto: La totora es una planta que crece en el agua. Con ella se hacen balsas y casas. Es de color verde.", "Con ella se hacen balsas y casas.", "Es una planta que crece en el agua.", "Es de color verde."),
  pt(DETAIL, "Afirmación: El desierto de Atacama es muy seco.\nTexto: Atacama está en el norte de Chile, en Sudamérica. En algunas zonas no llueve hace décadas. Tiene cerros.", "En algunas zonas no llueve hace décadas.", "Está en el norte de Chile, en Sudamérica.", "Tiene cerros."),
  pt(DETAIL, "Afirmación: Los pulpos son inteligentes.\nTexto: Los pulpos tienen ocho brazos con ventosas. Pueden abrir frascos. Viven en el fondo del mar.", "Pueden abrir frascos.", "Tienen ocho brazos con ventosas.", "Viven en el fondo del mar."),
  pt(DETAIL, "Afirmación: El plástico daña el mar.\nTexto: El plástico es un material liviano y barato. Las tortugas se comen las bolsas por error. Se fabrica desde hace un siglo.", "Las tortugas se comen las bolsas.", "Es un material liviano y barato.", "Se fabrica desde hace un siglo."),
  pt(DETAIL, "Afirmación: La quinua es nutritiva.\nTexto: La quinua crece en el altiplano, a gran altura. Contiene proteínas y hierro. Sus granos son pequeños.", "Contiene proteínas y hierro.", "Crece en el altiplano, a gran altura.", "Sus granos son pequeños."),
];

// --- Detalles descriptivos ------------------------------------------------

const SHOW = "¿Qué oración muestra la emoción o el rasgo, en lugar de solo decirlo?";
const EMOTIONS: ChoiceItem[] = [
  pt(SHOW, "Idea: Sergio estaba asustado.", "Sergio se tapó hasta la nariz y no respiró.", "Sergio tenía muchísimo miedo aquella noche oscura.", "Sergio estaba realmente asustado."),
  pt(SHOW, "Idea: Lola estaba feliz.", "Lola dio tres saltos y abrazó a su mamá.", "Lola se sentía muy contenta ese día tan especial.", "Lola era una niña feliz."),
  pt(SHOW, "Idea: El profesor estaba molesto.", "El profesor cruzó los brazos y frunció el ceño.", "El profesor estaba bastante enojado con todos nosotros.", "El profesor se molestó mucho."),
  pt(SHOW, "Idea: Mi hermana es ordenada.", "Mi hermana guarda su ropa por colores.", "Mi hermana es una chica muy ordenada en todo.", "A mi hermana le gusta el orden."),
  pt(SHOW, "Idea: Hugo estaba cansado.", "Hugo arrastró los pies hasta el sillón.", "Hugo sentía un cansancio verdaderamente terrible.", "Hugo estaba muy agotado."),
  pt(SHOW, "Idea: La abuela es cariñosa.", "La abuela me acomodó la bufanda y me besó.", "La abuela es una persona muy tierna con sus nietos.", "Mi abuela me quiere mucho."),
  pt(SHOW, "Idea: Bruno estaba aburrido.", "Bruno bostezó y dibujó círculos.", "Bruno se aburría muchísimo en esa clase.", "Bruno no tenía interés."),
  pt(SHOW, "Idea: Inés tenía vergüenza.", "Inés bajó la mirada, con las mejillas rojas.", "Inés sentía una vergüenza realmente muy grande.", "Inés era muy tímida."),
];

const STRONG_VERB: ChoiceItem[] = [
  pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El perro [fue] hacia la pelota.", "se abalanzó", "estuvo", "anduvo"), pt("¿Qué verbo es más preciso que el que está entre corchetes?", "La niña [dijo] un secreto al oído.", "susurró", "habló", "contó algo"),
  pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El viento [movía] las ramas.", "sacudía", "tenía", "hacía"), pt("¿Qué verbo es más preciso que el que está entre corchetes?", "Tomás [comió] la empanada en dos mordiscos.", "devoró", "probó", "tuvo"),
  pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El ladrón [salió] por la ventana.", "escapó", "pasó", "estuvo"), pt("¿Qué verbo es más preciso que el que está entre corchetes?", "La lluvia [caía] sobre el techo de calamina.", "golpeteaba", "había", "pasaba"),
  pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El público [hizo ruido] al ver el gol.", "rugió", "habló", "miró"), pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El gato [caminó] sin que nadie lo notara.", "se deslizó", "se movió", "anduvo"),
  pt("¿Qué verbo es más preciso que el que está entre corchetes?", "Mi abuela [hizo] una chompa de lana.", "tejió", "puso", "tuvo"), pt("¿Qué verbo es más preciso que el que está entre corchetes?", "El niño [miró] la vitrina de juguetes un largo rato.", "contempló", "vio", "notó"),
];

const IMAGE = "¿Qué oración agrega una imagen más viva al relato?";
const IMAGERY: ChoiceItem[] = [
  pt(IMAGE, "Relato: Entramos a la cueva. ___", "El aire frío olía a tierra mojada.", "La cueva era un lugar bastante interesante.", "Era una cueva como otras."),
  pt(IMAGE, "Relato: La abuela abrió el horno. ___", "Un vapor dulce de canela nos envolvió.", "Dentro había algo de comida para todos nosotros.", "El horno estaba caliente."),
  pt(IMAGE, "Relato: Llegamos a la playa al atardecer. ___", "El sol se hundía como una naranja encendida.", "La playa se veía realmente muy bonita a esa hora.", "Era tarde y había mar."),
  pt(IMAGE, "Relato: El mercado estaba abierto. ___", "Pirámides de mangos brillaban entre gritos.", "Había muchísimas cosas diferentes para comprar.", "El mercado era grande."),
  pt(IMAGE, "Relato: Empezó la tormenta. ___", "Los truenos hacían temblar los vidrios.", "La tormenta era bastante fuerte y duró mucho.", "Hacía mal tiempo."),
  pt(IMAGE, "Relato: Mi perro me recibió. ___", "Su cola golpeaba la puerta como un tambor.", "Mi perro estaba muy contento de verme llegar.", "El perro hizo cosas."),
];

// --- Variedad de oraciones ------------------------------------------------

const MODEL = "¿Qué oración sigue la misma estructura que el modelo?";
const VARIED: ChoiceItem[] = [
  pt(MODEL, "Modelo: Cuando salió el sol, los pájaros empezaron a cantar.", "Cuando sonó el timbre, los alumnos salieron.", "Los alumnos salieron al patio y jugaron un partido.", "Los alumnos, contentos, salieron."),
  pt(MODEL, "Modelo: Cansado y hambriento, el viajero tocó la puerta.", "Nerviosa y sonriente, la niña subió al escenario.", "La niña subió al escenario cuando por fin la llamaron.", "La niña subió y sonrió."),
  pt(MODEL, "Modelo: El gato, que dormía en el sillón, abrió un ojo.", "Mi tía, que vive en Tacna, llegó ayer.", "Mi tía llegó ayer porque vive en Tacna.", "Ayer llegó mi tía de Tacna."),
  pt(MODEL, "Modelo: Aunque llovía, salimos a correr.", "Aunque tenía sueño, terminé la tarea.", "Tenía mucho sueño y terminé toda la tarea.", "Terminé la tarea con sueño."),
  pt(MODEL, "Modelo: Corrió, saltó y cayó al agua.", "Abrió, miró y cerró la caja.", "Abrió la caja porque quería mirar.", "Cuando abrió la caja, miró."),
  pt(MODEL, "Modelo: En lo alto del cerro, brillaba una fogata.", "Al fondo del pasillo, sonaba una guitarra.", "Una guitarra sonaba y todos la oían desde lejos.", "Sonaba una guitarra muy fuerte."),
  pt(MODEL, "Modelo: ¿Quién dejó la puerta abierta?", "¿Quién trajo este paquete?", "Alguien trajo este paquete.", "¡Qué paquete tan grande!"),
  pt(MODEL, "Modelo: Si terminas temprano, iremos al parque.", "Si ahorras un poco, comprarás el libro.", "Ahorra un poco cada semana y compra el libro.", "Ahorraste y compraste el libro."),
];

// --- Corregir y revisar ---------------------------------------------------

const SIGN = "Este cartel tiene un error. ¿Cómo se corrige?";
const SIGNS: ChoiceItem[] = [
  pt(SIGN, "🪧 «Se alquila cuartos»", "«Se alquilan cuartos»", "«Se alquila quartos»", "«Se Alquila Cuartos»"), pt(SIGN, "🪧 «Prohibido votar basura»", "«Prohibido botar basura»", "«Proibido votar basura»", "«Prohibido votar vasura»"),
  pt(SIGN, "🪧 «Ay pan caliente»", "«Hay pan caliente»", "«Ahí pan caliente»", "«Ay pan calliente»"), pt(SIGN, "🪧 «Bienbenidos a Cusco»", "«Bienvenidos a Cusco»", "«Bienbenidos a cusco»", "«Bien venidos a Cuzko»"),
  pt(SIGN, "🪧 «Atención al publico»", "«Atención al público»", "«Atencion al publico»", "«Atención al Publico»"), pt(SIGN, "🪧 «No estacionar frente ala cochera»", "«No estacionar frente a la cochera»", "«No estacionar frente ala cochéra»", "«No estasionar frente ala cochera»"),
  pt(SIGN, "🪧 «Zapatos para niño's»", "«Zapatos para niños»", "«Sapatos para niño's»", "«Zapatos para Niño's»"), pt(SIGN, "🪧 «Cerrado por bacaciones»", "«Cerrado por vacaciones»", "«Serrado por bacaciones»", "«Cerrado por bacasiones»"),
  pt(SIGN, "🪧 «Venta de frutas y berduras»", "«Venta de frutas y verduras»", "«Benta de frutas y berduras»", "«Venta de frutaz y berduras»"), pt(SIGN, "🪧 «silencio, por favor»", "«Silencio, por favor»", "«silencio por Favor»", "«Cilencio, por favor»"),
];

// --- Investigación -------------------------------------------------------

const PLAG = "¿Es plagio? ¿Cómo se corrige?";
const SOURCE = "Fuente (libro de Ana Ríos): «El cóndor andino puede planear durante horas sin batir las alas».";
const PLAGIARISM: ChoiceItem[] = [
  pt(PLAG, `${SOURCE}\nAlumno: El cóndor andino puede planear durante horas sin batir las alas.`, "Sí: copió igual; debe usar comillas y citar.", "No: los datos sobre animales pertenecen a todos.", "Sí: debe borrar la oración."),
  pt(PLAG, `${SOURCE}\nAlumno: Según Ana Ríos, el cóndor es capaz de mantenerse en el aire mucho tiempo casi sin aletear.`, "No: usó sus palabras y citó la fuente.", "Sí: cambió las palabras exactas de la autora del libro.", "Sí: no puso comillas."),
  pt(PLAG, `${SOURCE}\nAlumno: El cóndor planea por horas sin mover las alas, algo que descubrí yo.`, "Sí: presenta como propia una idea ajena.", "No: usó palabras distintas a las que trae el libro.", "No: es un dato conocido."),
  pt(PLAG, `${SOURCE}\nAlumno: «El cóndor andino puede planear durante horas sin batir las alas» (Ana Ríos).`, "No: usó comillas y nombró a la autora.", "Sí: copió todas las palabras tal como estaban.", "Sí: falta su opinión."),
  w("¿Qué es el plagio?", "Presentar como propio el trabajo de otra persona", "Leer varios libros y revistas para hacer un trabajo", "Escribir un resumen"),
  w("Copias un párrafo de una página web para tu tarea. ¿Qué debes hacer?", "Ponerlo entre comillas e indicar la fuente", "Cambiarle el tipo de letra y el color al párrafo", "Borrar el nombre de la página"),
  w("¿Cuál es la mejor manera de evitar el plagio?", "Explicar con tus palabras y citar la fuente", "Copiar de un solo libro en vez de copiar de varios", "No leer nada antes de escribir"),
  w("Tu amigo te deja copiar su resumen y lo entregas con tu nombre. ¿Es plagio?", "Sí, porque el trabajo no es tuyo.", "No, porque él te dio permiso para copiarlo.", "No, porque es un resumen."),
];

const SRC = sorter(["Fuente primaria (de alguien que lo vivió o del momento)", "Fuente secundaria (lo explica alguien después)"], "¿Es una fuente primaria o secundaria?");
const SOURCES: ChoiceItem[] = [
  ...["El diario de una niña durante el terremoto de 1970", "Una foto tomada el día de la inauguración del estadio", "La carta que un soldado envió a su familia", "Una entrevista grabada a un sobreviviente", "El acta original de la Independencia", "Un quipu inca conservado en un museo"].map((x) => SRC(x, 0)),
  ...["Un libro de texto que explica el terremoto de 1970", "Una enciclopedia sobre la historia del estadio", "Un documental actual sobre una guerra antigua", "La biografía de un sobreviviente escrita por un historiador", "Un artículo que analiza la Independencia", "Un video educativo sobre los quipus"].map((x) => SRC(x, 1)),
];

export const ROWS: Row[] = [
  ["organizar-1", (r) => order(r, "Ordena las oraciones.", SENTENCE_ORDER)],
  ["organizar-2", (r) => order(r, "Ordena de lo más general a lo más específico.", GENERAL_SPECIFIC)],
  ["organizar-3", (r) => choose(r, "", BY_TOPIC)],
  ["organizar-4", (r) => choose(r, "", NOT_BELONG)],

  ["inicio-cierre-1", (r) => choose(r, "", TOPIC_SENTENCE)],
  ["inicio-cierre-2", (r) => choose(r, "", CONCLUDING)],

  ["conectores-1", (r) => pickInSentence(r, "Selecciona las palabras que indican orden o momento en el tiempo.", TIME_IN)],
  ["conectores-2", (r) => choose(r, "Completa la oración.", COORD)],
  ["conectores-3", (r) => choose(r, "Completa la oración.", SUBORD)],
  ["conectores-4", (r) => choose(r, "Completa con el mejor conector.", TRANSITION)],

  ["argumentos-1", (r) => choose(r, "", FACT_OPINION)],
  ["argumentos-2", (r) => choose(r, "", AUTHOR_OPINION)],
  ["argumentos-3", (r) => choose(r, "", REASONS)],
  ["argumentos-4", (r) => choose(r, "", SUPPORT_LITERARY)],
  ["argumentos-5", (r) => choose(r, "", SUPPORT_INFO)],

  ["detalles-1", (r) => choose(r, "", EMOTIONS)],
  ["detalles-2", (r) => choose(r, "", STRONG_VERB)],
  ["detalles-3", (r) => choose(r, "", IMAGERY)],

  ["variar", (r) => choose(r, "", VARIED)],

  ["corregir", (r) => choose(r, "", SIGNS)],

  ["fuentes-1", (r) => choose(r, "", PLAGIARISM)],
  ["fuentes-2", (r) => choose(r, "", SOURCES)],
];
