import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de escritura (IXL 6th grade ELA, O-U), con estas adaptaciones:
//   frequently confused words → a ver / haber, porque / por qué, sino / si no, etc.
//   errors in everyday use → errores frecuentes del castellano (haiga, dijistes, hubieron, dequeísmo)
//   Works Cited y citas en el texto (MLA) → referencias y citas en formato APA, el más usado en el Perú

export const SECTIONS: Section[] = [
  { id: "O", name: "Organizar la escritura", icon: "🗂️" },
  { id: "P", name: "Desarrollar y apoyar argumentos", icon: "💬" },
  { id: "Q", name: "Estilo", icon: "🎨" },
  { id: "R", name: "Identificar evidencias en el texto", icon: "🔎" },
  { id: "S", name: "Escribir con claridad y concisión", icon: "🧹" },
  { id: "T", name: "Corregir y revisar", icon: "🔍" },
  { id: "U", name: "Habilidades de investigación", icon: "📚" },
];

// --- O. Organizar la escritura -----------------------------------------------

const BROAD_NARROW: OrderItem[] = [
  { seq: ["ciencias naturales", "biología", "zoología", "aves del Perú", "el gallito de las rocas"] }, { seq: ["historia universal", "historia de América", "historia del Perú", "la República", "la guerra del Pacífico"] },
  { seq: ["arte", "literatura", "narrativa peruana", "cuentos de Valdelomar", "«El caballero Carmelo»"] }, { seq: ["problemas ambientales", "contaminación del agua", "contaminación de los ríos", "el río Rímac"] },
  { seq: ["deporte", "deportes acuáticos", "surf", "surf en el Perú", "las olas de Chicama"] }, { seq: ["tecnología", "comunicaciones", "internet", "redes sociales", "noticias falsas en redes"] },
  { seq: ["salud", "alimentación", "nutrientes", "proteínas", "proteínas de las menestras"] }, { seq: ["geografía", "relieve", "cordilleras", "los Andes", "el nevado Huascarán"] },
];
const BY_TOPIC: ChoiceItem[] = [
  pt("Preparas un informe sobre el cambio climático. ¿En qué sección va este dato?", "«Los glaciares tropicales han perdido la mitad de su superficie».", "Consecuencias", "Causas", "Soluciones"), pt("Preparas un informe sobre el cambio climático. ¿En qué sección va este dato?", "«La quema de combustibles fósiles libera dióxido de carbono».", "Causas", "Consecuencias", "Soluciones"),
  pt("Preparas un informe sobre el cambio climático. ¿En qué sección va este dato?", "«Reemplazar el carbón por energía solar reduce las emisiones».", "Soluciones", "Causas", "Consecuencias"), pt("Escribes una biografía. ¿En qué sección va este dato?", "«A los ocho años armó su primera radio».", "Infancia", "Obra", "Reconocimientos"),
  pt("Escribes una biografía. ¿En qué sección va este dato?", "«Recibió el premio nacional de ciencias en 1998».", "Reconocimientos", "Infancia", "Formación"), pt("Escribes sobre un libro. ¿En qué sección va este dato?", "«La protagonista es valiente, pero impulsiva».", "Personajes", "Argumento", "Opinión personal"),
  pt("Escribes sobre un libro. ¿En qué sección va este dato?", "«Recomiendo esta novela por su final inesperado».", "Opinión personal", "Personajes", "Datos del autor"), pt("Escribes sobre tu región. ¿En qué sección va este dato?", "«La mayoría de la población trabaja en la agricultura».", "Economía", "Clima", "Historia"),
];
const NOT = "¿Qué oración no pertenece al párrafo?";
const NOT_BELONG: ChoiceItem[] = [
  pt(NOT, "(1) El ajedrez se originó en la India. (2) Pasó a Persia y luego a Europa. (3) Mi primo tiene un tablero magnético. (4) En el siglo XV adquirió sus reglas actuales.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) Las vacunas entrenan al sistema inmunitario. (2) Presentan al cuerpo una versión inofensiva del germen. (3) Así, las defensas aprenden a reconocerlo. (4) Los hospitales suelen ser edificios blancos.", "La oración 4", "La oración 1", "La oración 3"),
  pt(NOT, "(1) La radio fue el primer medio masivo en llegar a los pueblos. (2) No requería saber leer. (3) Funcionaba con pilas. (4) El cine mudo usaba carteles con texto.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) Dormir poco afecta el aprendizaje. (2) El cerebro consolida la memoria durante el sueño. (3) Las almohadas de plumas son suaves. (4) Por eso conviene dormir ocho horas.", "La oración 3", "La oración 1", "La oración 4"),
  pt(NOT, "(1) Los manglares protegen la costa. (2) Hay playas muy turísticas en el Caribe. (3) Sus raíces frenan el oleaje. (4) También retienen sedimentos.", "La oración 2", "La oración 3", "La oración 4"),
  pt(NOT, "(1) El quechua tiene varias variantes. (2) No suena igual en Cusco que en Áncash. (3) Aun así, sus hablantes suelen entenderse. (4) El inglés se enseña en secundaria.", "La oración 4", "La oración 1", "La oración 2"),
  pt(NOT, "(1) Reciclar vidrio ahorra energía. (2) Fundirlo requiere menos calor que fabricarlo desde cero. (3) Además, puede reciclarse infinitas veces. (4) Las ventanas dejan pasar la luz.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) El debate enseña a escuchar. (2) Obliga a entender la postura contraria. (3) El auditorio tiene cien butacas. (4) También entrena para argumentar con orden.", "La oración 3", "La oración 2", "La oración 4"),
];
const TOPIC = "¿Qué oración temática resume mejor la idea principal del párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Guardan agua como una esponja, filtran contaminantes y dan refugio a aves migratorias. Sin embargo, muchos se han rellenado para construir.", "Los humedales cumplen funciones valiosas, pero están amenazados.", "Los humedales tienen agua y en ellos viven algunas aves.", "Construir es necesario."),
  pt(TOPIC, "___ Permite hablar con familiares lejanos y aprender casi cualquier cosa. A la vez, roba horas de sueño y expone a engaños.", "El celular ofrece ventajas y también riesgos.", "El celular es el mejor invento de toda la historia.", "Los familiares viven lejos."),
  pt(TOPIC, "___ En la costa se pesca; en la sierra se cultiva papa y se cría ganado; en la selva se cosecha cacao y café.", "Cada región del Perú tiene actividades económicas propias.", "En la selva del Perú hace muchísimo calor todo el año.", "La papa es nutritiva."),
  pt(TOPIC, "___ Primero dudó de sus propias mediciones. Las repitió durante dos años. Solo cuando no quedó otra explicación, publicó sus resultados.", "La científica actuó con rigor antes de anunciar su hallazgo.", "La científica tardó dos años porque trabajaba despacio.", "Medir es difícil."),
  pt(TOPIC, "___ Los griegos las usaban para explicar los rayos; los incas, para justificar el poder del Inca; hoy seguimos contando historias para entender lo que nos asusta.", "En todas las épocas, los relatos han servido para dar sentido al mundo.", "Los griegos tenían miedo de los rayos y de las tormentas.", "Los incas mandaban."),
  pt(TOPIC, "___ Una sola bolsa tarda siglos en degradarse, y cada persona usa cientos al año. Los ríos las arrastran hasta el mar.", "Las bolsas de plástico son un problema ambiental grave.", "Las bolsas de plástico sirven para llevar las compras.", "El mar es grande."),
];

// --- P. Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (juicio personal)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["El Perú tiene 24 departamentos y una provincia constitucional.", "La luz tarda unos ocho minutos en llegar del Sol a la Tierra.", "César Vallejo nació en Santiago de Chuco.", "El agua está formada por hidrógeno y oxígeno.", "El lago Titicaca es compartido por dos países.", "La Constitución vigente del Perú es de 1993."].map((x) => FO(x, 0)),
  ...["Vallejo es el mejor poeta de todos los tiempos.", "El Titicaca es más bello que cualquier otro lago.", "La química es el curso más interesante.", "Nadie debería viajar sin conocer Arequipa.", "Las leyes actuales son demasiado blandas.", "El sol de la sierra es el más agradable."].map((x) => FO(x, 1)),
];
const EVID = "¿Qué evidencia apoya mejor la afirmación?";
const EVIDENCE: ChoiceItem[] = [
  pt(EVID, "Afirmación: Leer por placer mejora el rendimiento escolar.", "Un estudio con 5000 alumnos halló mejores notas en los lectores.", "A mi prima le encanta leer novelas de aventuras y por eso creo que es cierto.", "Los libros son baratos."),
  pt(EVID, "Afirmación: Las ciclovías reducen los accidentes.", "Donde se instaló una, los accidentes bajaron un 40 %.", "Las bicicletas son más bonitas que los autos y hacen menos ruido.", "Yo monto bicicleta."),
  pt(EVID, "Afirmación: El desayuno influye en la atención.", "En una prueba, quienes desayunaron resolvieron más ejercicios.", "El desayuno es, para muchísima gente, la comida más rica de todo el día.", "Mi tío nunca desayuna."),
  pt(EVID, "Afirmación: La deforestación aumenta los huaicos.", "Las cuencas taladas registran el doble de deslizamientos.", "Los árboles dan sombra, se ven muy bien y adornan los cerros.", "Llueve en verano."),
  pt(EVID, "Afirmación: Dormir poco afecta la memoria.", "Voluntarios sin dormir recordaron un 30 % menos.", "A nadie le gusta levantarse temprano en invierno.", "Mi hermano duerme mucho."),
  pt(EVID, "Afirmación: El trabajo en equipo mejora los proyectos.", "Los grupos que se reunían cada semana obtuvieron mejores notas.", "Trabajar con amigos es más divertido que hacerlo solo, según mi opinión.", "Somos cuatro."),
];
const COUNTER = "¿Cuál es el contraargumento (la objeción a la tesis)?";
const COUNTERCLAIMS: ChoiceItem[] = [
  pt(COUNTER, "Tesis: Deben prohibirse los celulares en clase.", "Los celulares pueden servir para aprender.", "Los celulares distraen a los alumnos.", "Muchos alumnos miran redes sociales en plena clase."),
  pt(COUNTER, "Tesis: La ciudad necesita más ciclovías.", "Las ciclovías quitan espacio a los buses.", "Las ciclovías reducen la contaminación del aire.", "Montar bicicleta es saludable."),
  pt(COUNTER, "Tesis: Los zoológicos deberían cerrarse.", "Algunos zoológicos salvan especies en peligro.", "Los animales sufren en cautiverio y enferman.", "Las jaulas son pequeñas."),
  pt(COUNTER, "Tesis: La tarea escolar debe eliminarse.", "La práctica en casa refuerza lo aprendido.", "La tarea quita tiempo de juego y de descanso.", "Los niños llegan cansados."),
  pt(COUNTER, "Tesis: Todos deberían aprender a programar.", "No todos los trabajos requerirán programar.", "Programar desarrolla el pensamiento lógico.", "Hay cursos gratuitos."),
  pt(COUNTER, "Tesis: El turismo beneficia a las comunidades.", "El turismo masivo encarece la vida.", "El turismo crea muchos puestos de trabajo.", "Los turistas compran artesanías."),
];
const FALL = sorter(["Ataque personal (ad hominem)", "Generalización apresurada", "Falso dilema", "Apelación a la mayoría", "Falsa causa"], "¿Qué falacia contiene el razonamiento?");
const FALLACIES: ChoiceItem[] = [
  ...["No le hagas caso sobre el reciclaje: ni siquiera sabe vestirse bien.", "¿Cómo va a opinar de matemática si siempre llega tarde?", "Su propuesta no sirve porque él es un engreído."].map((x) => FALL(x, 0)),
  ...["Conocí a dos limeños antipáticos; todos los limeños son así.", "Este libro me aburrió, así que leer es aburrido.", "Un perro me mordió; los perros son peligrosos."].map((x) => FALL(x, 1)),
  ...["O apoyas mi plan o no te importa el colegio.", "Si no te gusta el fútbol, odias los deportes.", "O estudias medicina o fracasarás en la vida."].map((x) => FALL(x, 2)),
  ...["Todos lo comparten, así que debe de ser cierto.", "Millones compran esa marca; es la mejor.", "Si la mayoría copia, no puede estar mal."].map((x) => FALL(x, 3)),
  ...["Me puse la gorra roja y ganamos: la gorra da suerte.", "Desde que pusieron la antena, llueve menos: es por la antena.", "Cantó el gallo y salió el sol: el gallo hace salir el sol."].map((x) => FALL(x, 4)),
];

// --- Q. Estilo ---------------------------------------------------------------

const PERS = "¿Qué oración usa la personificación?";
const PERSONIFICATION: ChoiceItem[] = [
  pt(PERS, "Idea: El viento soplaba fuerte.", "El viento golpeaba las ventanas, furioso.", "El viento soplaba a ochenta kilómetros por hora.", "Había viento."),
  pt(PERS, "Idea: El sol salió.", "El sol se asomó, tímido, tras el cerro.", "El sol salió a las seis y cuarto de la mañana.", "Amaneció."),
  pt(PERS, "Idea: La puerta hizo ruido.", "La vieja puerta se quejó al abrirse.", "La puerta de madera hizo un ruido bastante fuerte.", "Sonó la puerta."),
  pt(PERS, "Idea: Las olas llegaban a la orilla.", "Las olas lamían la arena con paciencia.", "Las olas llegaban a la orilla cada diez segundos.", "Había olas."),
  pt(PERS, "Idea: El reloj marcaba la hora.", "El reloj nos apuraba con su dedo flaco.", "El reloj de pared marcaba las ocho en punto.", "Eran las ocho."),
  pt(PERS, "Idea: La ciudad estaba en silencio.", "La ciudad contenía la respiración.", "En la ciudad no se escuchaba ningún ruido esa noche.", "No había ruido."),
  pt(PERS, "Idea: El fuego consumía la leña.", "El fuego devoraba la leña con hambre.", "El fuego consumía la leña en unos pocos minutos.", "Ardía la leña."),
  pt(PERS, "Idea: Las estrellas brillaban.", "Las estrellas nos guiñaban desde lejos.", "Las estrellas brillaban con mucha intensidad.", "Había estrellas."),
];
const MODEL = "¿Qué oración sigue la misma estructura que el modelo?";
const VARIED: ChoiceItem[] = [
  pt(MODEL, "Modelo: Aunque el camino era largo, nadie se quejó.", "Aunque la tarea era difícil, todos la terminaron.", "La tarea era difícil y todos la terminaron igual.", "Todos terminaron."),
  pt(MODEL, "Modelo: El río, que nace en los Andes, desemboca en el Atlántico.", "La autora, que creció en Puno, escribe en dos lenguas.", "La autora creció en Puno y escribe en dos lenguas.", "La autora escribe."),
  pt(MODEL, "Modelo: Cuanto más leía, más preguntas tenía.", "Cuanto más practicaba, mejor tocaba.", "Practicaba mucho y por eso tocaba cada vez mejor.", "Tocaba mejor."),
  pt(MODEL, "Modelo: No fue la lluvia, sino el viento, lo que derribó el árbol.", "No fue el miedo, sino el cansancio, lo que lo detuvo.", "El cansancio lo detuvo, aunque también tenía miedo.", "Se detuvo."),
  pt(MODEL, "Modelo: Con los ojos cerrados, escuchó la quena.", "Con las manos heladas, abrió la carta.", "Abrió la carta mientras tenía las manos heladas.", "Abrió la carta."),
  pt(MODEL, "Modelo: Ni las advertencias ni los ruegos lo convencieron.", "Ni los premios ni los aplausos la cambiaron.", "Los premios y los aplausos no lograron cambiarla.", "No cambió."),
  pt(MODEL, "Modelo: ¿Quién, sino ella, podía resolverlo?", "¿Dónde, sino aquí, podíamos descansar?", "Solamente aquí podíamos descansar un rato.", "Descansamos aquí."),
  pt(MODEL, "Modelo: Terminada la función, el público salió en silencio.", "Resuelto el problema, el equipo volvió a casa.", "El equipo volvió a casa después de resolver el problema.", "Volvieron a casa."),
];
const VERB = "¿Qué verbo es más preciso que el que está entre corchetes?";
const STRONG_VERB: ChoiceItem[] = [
  pt(VERB, "El orador [dijo] su discurso con pasión.", "pronunció", "escuchó atento", "hizo"), pt(VERB, "La multitud [fue] hacia la plaza.", "avanzó", "estuvo", "hubo"),
  pt(VERB, "El detective [miró] cada rincón de la habitación.", "inspeccionó", "desordenó todo", "vio"), pt(VERB, "El terremoto [rompió] los muros de adobe.", "derrumbó", "construyó", "puso"),
  pt(VERB, "La noticia [fue] por todo el pueblo.", "circuló", "pasó", "estuvo"), pt(VERB, "El niño [tomó] la mano de su madre con fuerza.", "apretó", "tuvo", "puso"),
  pt(VERB, "El águila [bajó] sobre su presa.", "se lanzó", "fue", "estuvo"), pt(VERB, "El alcalde [hizo] un nuevo reglamento.", "promulgó", "desobedeció", "dio"),
  pt(VERB, "La científica [vio] una bacteria desconocida.", "detectó", "miró", "tuvo"), pt(VERB, "El anciano [dijo en voz baja] una oración.", "murmuró", "habló", "contó"),
];

// --- R. Evidencias -----------------------------------------------------------

const DETAIL = "¿Qué detalle del texto apoya la afirmación?";
const SUPPORT_INFO: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: Los pulpos resuelven problemas.\nTexto: Los pulpos tienen tres corazones y sangre azul. En acuarios han desenroscado frascos para sacar comida. Viven pocos años.", "Han desenroscado frascos para sacar comida.", "Tienen tres corazones y sangre de color azul.", "Viven pocos años."),
  pt(DETAIL, "Afirmación: El quipu servía para contar.\nTexto: Los quipus se hacían con algodón o lana de camélidos. La posición de los nudos indicaba unidades y decenas. Algunos tenían colores.", "Los nudos indicaban unidades y decenas.", "Se hacían con algodón o lana de camélidos.", "Tenían colores."),
  pt(DETAIL, "Afirmación: El ruido afecta el aprendizaje.\nTexto: La escuela está junto a una avenida muy transitada. Los alumnos de las aulas ruidosas leyeron peor en las pruebas. Tiene tres pisos.", "Los alumnos de aulas ruidosas leyeron peor.", "La escuela está junto a una avenida transitada.", "Tiene tres pisos."),
  pt(DETAIL, "Afirmación: La papa llegó a ser esencial en Europa.\nTexto: Los españoles llevaron la papa a Europa en el siglo XVI. Dos siglos después alimentaba a la mayoría de los campesinos irlandeses. Es un tubérculo.", "Alimentaba a la mayoría de los campesinos irlandeses.", "Los españoles la llevaron a Europa en el siglo XVI, por mar.", "Es un tubérculo."),
  pt(DETAIL, "Afirmación: Las abejas se comunican.\nTexto: Las abejas viven en colonias de miles de individuos. Con una danza indican a las demás dónde hay flores. Producen miel.", "Con una danza indican dónde hay flores.", "Viven en colonias de miles de individuos.", "Producen miel."),
  pt(DETAIL, "Afirmación: El plástico entra en la cadena alimentaria.\nTexto: El plástico se fabrica a partir del petróleo. Se han hallado microplásticos en peces que consumimos. Es resistente.", "Se han hallado microplásticos en peces.", "Se fabrica a partir del petróleo.", "Es resistente."),
];
const SUPPORT_LITERARY: ChoiceItem[] = [
  pt(DETAIL, "Afirmación: Marta se siente culpable.\nTexto: Marta llegó a casa a las siete de la noche. No pudo mirar a su hermano a los ojos. Dejó la mochila.", "No pudo mirar a su hermano a los ojos.", "Llegó a casa a las siete de la noche.", "Dejó la mochila."),
  pt(DETAIL, "Afirmación: El capitán respeta a su tripulación.\nTexto: El capitán llevaba veinte años navegando por el Pacífico. Comía lo mismo que los marineros y al final. Tenía un catalejo.", "Comía lo mismo que los marineros y al final.", "Llevaba veinte años navegando por el Pacífico.", "Tenía un catalejo."),
  pt(DETAIL, "Afirmación: La abuela esconde su tristeza.\nTexto: La abuela preparó el desayuno como todos los domingos. Sonrió, pero sus manos temblaban al servir el té. Usaba mandil.", "Sonrió, pero sus manos temblaban.", "Preparó el desayuno como todos los domingos.", "Usaba mandil."),
  pt(DETAIL, "Afirmación: Rubén es ambicioso.\nTexto: Rubén entró al taller de carpintería a los quince. «Algún día este taller será mío», dijo el primer día. Barría el aserrín.", "«Algún día este taller será mío», dijo.", "Entró al taller de carpintería a los quince.", "Barría el aserrín."),
  pt(DETAIL, "Afirmación: El pueblo desconfía del forastero.\nTexto: El forastero llegó montado en una mula vieja. A su paso, las puertas se cerraban una tras otra. Traía un sombrero.", "Las puertas se cerraban a su paso.", "Llegó montado en una mula vieja.", "Traía un sombrero."),
  pt(DETAIL, "Afirmación: Lucas admira a su hermana.\nTexto: Lucas y su hermana iban a la misma escuela del barrio. Él guardaba en una caja cada recorte donde ella aparecía. Tenía diez años.", "Guardaba cada recorte donde ella aparecía.", "Iban a la misma escuela del barrio.", "Tenía diez años."),
];

// --- S. Claridad y concisión -------------------------------------------------

const CONJ_ADV: ChoiceItem[] = [
  f("El experimento falló; ___, repetimos el procedimiento.", "por consiguiente", "sin embargo", "por ejemplo"), f("La propuesta es costosa; ___, vale la pena.", "no obstante", "por lo tanto", "es decir"),
  f("Llovió toda la semana; ___, el río se desbordó.", "en consecuencia", "en cambio", "asimismo"), f("El libro es extenso; ___, se lee con facilidad.", "sin embargo", "por ende", "además"),
  f("La autora es poeta; ___, ha publicado tres novelas.", "además", "no obstante", "por consiguiente"), f("No presentó pruebas; ___, su argumento es débil.", "por lo tanto", "sin embargo", "asimismo"),
  f("El norte es árido; el sur, ___, es lluvioso.", "en cambio", "por ende", "además"), f("Es bilingüe, ___, habla dos lenguas.", "es decir", "no obstante", "en cambio"),
  f("Reciclar ahorra recursos; ___, reduce la basura.", "asimismo", "sin embargo", "por lo tanto"), f("Entrenó poco; ___, ganó la carrera.", "aun así", "por eso", "es decir"),
];

// --- T. Corregir y revisar ---------------------------------------------------

const CONFUSED_USE: ChoiceItem[] = [
  f("Voy ___ si ya llegó el correo.", "a ver", "haber", "aver"), f("Tiene que ___ otra explicación.", "haber", "a ver", "haver"),
  f("No sé el ___ de su enojo.", "porqué", "porque", "por qué"), f("Dime ___ no viniste.", "por qué", "porque", "porqué"),
  f("Llegué tarde ___ perdí el bus.", "porque", "por qué", "porqué"), f("No lo hizo él, ___ su hermano.", "sino", "si no", "sinó"),
  f("___ llueve, iremos a la playa.", "Si no", "Sino", "Sinó"), f("___ no ha terminado la tarea.", "Aún", "Aun", "Haún"),
  f("___ los más pequeños ayudaron.", "Aun", "Aún", "Haun"), f("No sé ___ poner el florero.", "dónde", "donde", "adonde"),
  f("Es la casa ___ nací.", "donde", "dónde", "adónde"), f("___ llegado tarde tres veces esta semana.", "Has", "As", "Haz"),
  f("___ que estudiar más.", "Hay", "Ahí", "Ay"), f("Eso ___ pasado antes.", "ha", "a", "ah"),
  f("Se ___ a llorar.", "echó", "hechó", "hecho"), f("Voy ___ estudiar para el examen.", "a", "ha", "ah"),
];
const FIX = "La oración tiene un error. ¿Cómo se corrige?";
const CONFUSED_FIX: ChoiceItem[] = [
  pt(FIX, "No sé porque se fue.", "No sé por qué se fue.", "No sé porqué se fue.", "No sé por que se fue."), pt(FIX, "Aun no llega el bus.", "Aún no llega el bus.", "Haun no llega el bus.", "Aún no yega el bus."),
  pt(FIX, "Si no vienes, sino llamas, me preocupo.", "Si no vienes, si no llamas, me preocupo.", "Sino vienes, sino llamas, me preocupo.", "Si no vienes, sinó llamas, me preocupo."), pt(FIX, "A ver quién ha echo esto.", "A ver quién ha hecho esto.", "Haber quién ha hecho esto.", "A ver quién a hecho esto."),
  pt(FIX, "¿Adonde vas con tanta prisa?", "¿Adónde vas con tanta prisa?", "¿A donde vas con tanta prisa?", "¿Adonde bas con tanta prisa?"), pt(FIX, "Tiene que a ver una solución.", "Tiene que haber una solución.", "Tiene que aver una solución.", "Tiene que haver una solución."),
  pt(FIX, "Ahí que llegar temprano.", "Hay que llegar temprano.", "Ay que llegar temprano.", "Ahi que llegar temprano."), pt(FIX, "No vino por que estaba enfermo.", "No vino porque estaba enfermo.", "No vino por qué estaba enfermo.", "No vino porqué estaba enfermo."),
  pt(FIX, "Dime donde lo dejaste.", "Dime dónde lo dejaste.", "Dime adonde lo dejaste.", "Dime dónde lo dejastes."), pt(FIX, "Se a caído el vaso.", "Se ha caído el vaso.", "Se ah caído el vaso.", "Se ha caido el vaso."),
];
const SIGN = "Este cartel tiene un error. ¿Cómo se corrige?";
const SIGNS: ChoiceItem[] = [
  pt(SIGN, "🪧 «Se prohibe fumar»", "«Se prohíbe fumar»", "«Se proibe fumar»", "«Se prohive fumar»"), pt(SIGN, "🪧 «Atención: hombres trabajando, disculpe las molestia»", "«…disculpe las molestias»", "«…disculpe la molestias»", "«…disculpen las molestia»"),
  pt(SIGN, "🪧 «Solo para personal autorisado»", "«Solo para personal autorizado»", "«Solo para personal authorizado»", "«Solo para personal autorisádo»"), pt(SIGN, "🪧 «No arroje desperdicio al rio»", "«No arroje desperdicios al río»", "«No arroge desperdicios al río»", "«No arroje desperdicio al rió»"),
  pt(SIGN, "🪧 «Bienvenidos ha nuestra feria»", "«Bienvenidos a nuestra feria»", "«Bienbenidos ha nuestra feria»", "«Bienvenidos ah nuestra feria»"), pt(SIGN, "🪧 «Se dictan clases de matematica»", "«Se dictan clases de matemática»", "«Se dicta clases de matemática»", "«Se dictan clases de matemátika»"),
  pt(SIGN, "🪧 «Horario: de 8 a.m ha 5 p.m»", "«Horario: de 8 a. m. a 5 p. m.»", "«Horario: de 8 am ha 5 pm»", "«Horario: de 8 a.m ah 5 p.m»"), pt(SIGN, "🪧 «Favor de hacer cola aqui»", "«Favor de hacer cola aquí»", "«Fabor de hacer cola aqui»", "«Favor de aser cola aquí»"),
  pt(SIGN, "🪧 «Venta de pollos biboz»", "«Venta de pollos vivos»", "«Venta de poyos vivos»", "«Benta de pollos vivos»"), pt(SIGN, "🪧 «Cuidado: piso mojado, puede resvalar»", "«…puede resbalar»", "«…puede rezbalar»", "«…puede resbalár»"),
];
const EVERYDAY: ChoiceItem[] = [
  pt(FIX, "Ojalá haiga torta en la fiesta.", "Ojalá haya torta en la fiesta.", "Ojalá haiga tortas en la fiesta.", "Ojalá halla torta en la fiesta."), pt(FIX, "¿Ya comistes?", "¿Ya comiste?", "¿Ya comistés?", "¿Ya comites?"),
  pt(FIX, "Hubieron muchos invitados.", "Hubo muchos invitados.", "Habían muchos invitados.", "Hubieron mucho invitado."), pt(FIX, "Pienso de que tienes razón.", "Pienso que tienes razón.", "Pienso de que tenés razón.", "Pienso en de que tienes razón."),
  pt(FIX, "Este dibujo es más mejor.", "Este dibujo es mejor.", "Este dibujo es más bueno mejor.", "Este dibujo es muy mejor."), pt(FIX, "Nadies vino a la reunión.", "Nadie vino a la reunión.", "Nadies vinieron a la reunión.", "Naide vino a la reunión."),
  pt(FIX, "Me olvidé que tenía examen.", "Me olvidé de que tenía examen.", "Me olvidé de qué tenía examen.", "Me olvidé en que tenía examen."), pt(FIX, "Habían tres perros en la calle.", "Había tres perros en la calle.", "Hubieron tres perros en la calle.", "Habían tres perro en la calle."),
  pt(FIX, "Subió para arriba a su cuarto.", "Subió a su cuarto.", "Subió para arriba de su cuarto.", "Subió arriba para su cuarto."), pt(FIX, "Dile a tus amigos que vengan.", "Diles a tus amigos que vengan.", "Dile a tu amigos que vengan.", "Dile a tus amigos que venga."),
  pt(FIX, "Hace años atrás vivíamos allí.", "Hace años vivíamos allí.", "Hacen años atrás vivíamos allí.", "Hace años atrás vivíamos ahí."), pt(FIX, "La calor es insoportable.", "El calor es insoportable.", "La calor es insoportables.", "La calor está insoportable."),
];
const REVISE = "¿Cuál es la mejor revisión de la oración?";
const REVISIONS: ChoiceItem[] = [
  pt(REVISE, "En mi opinión personal, yo creo que el libro es bueno.", "Creo que el libro es bueno.", "En mi opinión personal mía, yo creo que el libro es bueno.", "El libro."),
  pt(REVISE, "El motivo por el cual llegó tarde fue debido a que perdió el bus.", "Llegó tarde porque perdió el bus.", "El motivo de la razón de su tardanza fue que el bus lo perdió.", "Perdió."),
  pt(REVISE, "Las cosas que compramos en el mercado eran cosas muy buenas.", "Las frutas que compramos en el mercado eran excelentes.", "Las cosas que compramos eran cosas que eran muy buenas.", "Compramos cosas."),
  pt(REVISE, "Entramos adentro del museo y vimos muchas cosas que había.", "Entramos al museo y vimos sus colecciones.", "Entramos adentro del interior del museo y vimos cosas.", "Vimos el museo adentro."),
  pt(REVISE, "El río estaba contaminado y el río olía mal y el río no tenía peces.", "El río estaba contaminado: olía mal y no tenía peces.", "El río estaba contaminado y olía y el río sin peces estaba.", "El río olía."),
  pt(REVISE, "Hizo un viaje, hizo fotos e hizo un informe.", "Viajó, tomó fotos y redactó un informe.", "Hizo un viaje e hizo fotos e hizo también un informe.", "Hizo todo."),
  pt(REVISE, "A pesar de que llovía mucho, pero salimos igual.", "A pesar de que llovía mucho, salimos igual.", "A pesar de que llovía mucho, pero sin embargo salimos igual.", "Llovía, pero."),
  pt(REVISE, "El alumno le dijo al profesor que él estaba equivocado.", "El alumno le dijo al profesor: «Usted está equivocado».", "El alumno le dijo al profesor que él mismo él estaba equivocado.", "Le dijo que él."),
];

// --- U. Investigación --------------------------------------------------------

const REL = "¿Qué fuente es más pertinente para el tema?";
const RELEVANT: ChoiceItem[] = [
  pt(REL, "Tema: las causas del fenómeno de El Niño.", "Un informe del servicio nacional de meteorología", "Un blog de recetas de pescado", "Una novela ambientada en Piura durante las lluvias"),
  pt(REL, "Tema: la vida de Micaela Bastidas.", "Una biografía escrita por una historiadora", "Un foro anónimo de internet", "Un catálogo de estampillas con su retrato"),
  pt(REL, "Tema: beneficios de la quinua.", "Un artículo de una revista de nutrición", "Un anuncio de una marca de quinua", "Un cuento sobre una niña que siembra quinua"),
  pt(REL, "Tema: cómo funciona una vacuna.", "La página de un organismo de salud pública", "Un video sin autor que promete «la verdad oculta»", "Un poema sobre los médicos"),
  pt(REL, "Tema: población actual de tu región.", "El último censo del instituto de estadística", "Un libro de geografía de 1980", "Una canción sobre tu región"),
  pt(REL, "Tema: la arquitectura de Chan Chan.", "Un estudio arqueológico reciente", "Una guía de restaurantes de Trujillo", "Un comentario en una red social"),
];
const BIAS = sorter(["Neutral (informa sin opinar)", "Sesgado (toma partido o exagera)"], "¿El titular es neutral o sesgado?");
const HEADLINES: ChoiceItem[] = [
  ...["Municipio aprueba presupuesto para 2027", "Selección empata 1-1 en partido amistoso", "Sube el precio del pollo en mercados de Lima", "Alumnos de quinto presentan proyecto de ciencias", "Inician obras en la avenida principal", "Congreso debate reforma educativa"].map((x) => BIAS(x, 0)),
  ...["Municipio despilfarra otra vez el dinero de todos", "Vergonzoso empate de una selección sin alma", "¡Escándalo! El pollo, por las nubes", "Geniales alumnos humillan a los expertos", "Caos total: alcalde destroza la avenida", "Congresistas flojos vuelven a perder el tiempo"].map((x) => BIAS(x, 1)),
];
const REF = "Referencia (formato APA):\nRíos, A. (2021). Los glaciares del Perú. Editorial Andina.";
const REF2 = "Referencia (formato APA):\nVega, L. y Soto, M. (2019). El agua en los Andes. Revista Cumbres, 12(3), 45-58.";
const WORKS_CITED: ChoiceItem[] = [
  pt("En la referencia, ¿qué es «Ríos, A.»?", REF, "La autora", "La editorial", "El título"), pt("En la referencia, ¿qué indica «(2021)»?", REF, "El año de publicación", "El número de páginas", "La edición"),
  pt("En la referencia, ¿qué es «Los glaciares del Perú»?", REF, "El título del libro", "El nombre de la editorial", "El tema del capítulo"), pt("En la referencia, ¿qué es «Editorial Andina»?", REF, "La editorial que lo publicó", "La autora del libro citado", "La ciudad"),
  pt("En la referencia, ¿cuántos autores tiene el artículo?", REF2, "Dos", "Uno", "Tres"), pt("En la referencia, ¿qué es «Revista Cumbres»?", REF2, "La revista donde se publicó", "El título completo del artículo", "La editorial"),
  pt("En la referencia, ¿qué indica «45-58»?", REF2, "Las páginas del artículo", "El año de publicación", "El volumen"), pt("¿Cómo se ordenan las referencias al final de un trabajo?", REF, "Alfabéticamente por apellido del autor", "Por tamaño del libro", "Por el orden en que leíste cada una de las fuentes"),
];
const IN_TEXT: ChoiceItem[] = [
  w("¿Qué cita en el texto es correcta en formato APA?", "Los glaciares retroceden (Ríos, 2021).", "Los glaciares retroceden (A. Ríos, Editorial Andina).", "Los glaciares retroceden, Ríos."), w("¿Qué cita textual es correcta en formato APA?", "«El hielo desaparece» (Ríos, 2021, p. 34).", "«El hielo desaparece» Ríos 2021 página 34", "El hielo desaparece (p. 34)."),
  w("Mencionas al autor en la oración. ¿Cómo queda la cita?", "Según Ríos (2021), los glaciares retroceden.", "Según (Ríos), 2021 los glaciares retroceden.", "Según Ríos, A., los glaciares retroceden."), w("El artículo tiene dos autores. ¿Cómo se cita?", "(Vega y Soto, 2019)", "(Vega, 2019)", "(Vega, Soto, Revista Cumbres)"),
  w("¿Qué datos lleva una cita en el texto en formato APA?", "Apellido del autor y año", "Título completo y editorial", "Nombre de pila y ciudad"), w("¿Cuándo debes añadir el número de página?", "Cuando copias las palabras exactas", "Cuando resumes todo el libro en una línea", "Nunca"),
  w("Parafraseas una idea de Vega y Soto. ¿Cómo la citas?", "El agua escasea en verano (Vega y Soto, 2019).", "El agua escasea en verano.", "«El agua escasea en verano», según lo que yo mismo pienso y digo."), w("¿Dónde aparece la referencia completa de una cita?", "En la lista de referencias, al final", "En el título del trabajo, entre paréntesis", "En la carátula"),
];
const PLAG = "¿Es plagio? ¿Por qué?";
const SOURCE = "Fuente (Soto, 2020, p. 8): «La Amazonía produce cerca de una quinta parte del agua dulce que llega a los océanos».";
const PLAGIARISM: ChoiceItem[] = [
  pt(PLAG, `${SOURCE}\nAlumno: La Amazonía produce cerca de una quinta parte del agua dulce que llega a los océanos.`, "Sí: copia literal sin comillas ni cita.", "No: es un dato de conocimiento público.", "No: omitió el nombre."),
  pt(PLAG, `${SOURCE}\nAlumno: Según Soto (2020), aproximadamente el 20 % del agua dulce que desemboca en los mares proviene de la Amazonía.`, "No: parafrasea y cita la fuente.", "Sí: cambió las palabras originales del autor.", "Sí: usó porcentaje."),
  pt(PLAG, `${SOURCE}\nAlumno: Alrededor de un quinto del agua dulce de los océanos viene de la Amazonía.`, "Sí: parafrasea, pero no cita.", "No: las palabras son completamente suyas.", "No: es breve."),
  pt(PLAG, `${SOURCE}\nAlumno: «La Amazonía produce cerca de una quinta parte del agua dulce que llega a los océanos» (Soto, 2020, p. 8).`, "No: cita textual con comillas y fuente.", "Sí: copió la oración completa del libro.", "Sí: falta su opinión."),
  w("Entregas como propio un trabajo hecho por una inteligencia artificial o por otra persona. ¿Qué es?", "Plagio, porque no es de tu autoría", "Un resumen bien hecho", "Una paráfrasis correcta y con cita"),
  w("¿Qué diferencia a una paráfrasis de un plagio?", "La paráfrasis reconoce la fuente.", "La paráfrasis copia las palabras exactas.", "No hay ninguna diferencia."),
  w("Usas un gráfico de otro autor. ¿Qué corresponde?", "Indicar su fuente bajo el gráfico", "Recortarle el nombre del autor", "Cambiarle los colores"),
  w("¿Qué NO necesita cita?", "Un dato de conocimiento general, como que el Perú está en Sudamérica", "Una estadística tomada de un informe", "Una frase copiada de un libro"),
];

export const ROWS: Row[] = [
  ["O.1", "Ordenar temas del más amplio al más específico", (r) => order(r, "Ordena los temas del más amplio al más específico.", BROAD_NARROW)],
  ["O.2", "Organizar la información por tema", (r) => choose(r, "", BY_TOPIC)],
  ["O.3", "Quitar la oración que no pertenece", (r) => choose(r, "", NOT_BELONG)],
  ["O.4", "Elegir la oración temática que mejor recoge la idea principal", (r) => choose(r, "", TOPIC_SENTENCE)],

  ["P.1", "Distinguir hechos de opiniones", (r) => choose(r, "", FACT_OPINION)],
  ["P.2", "Elegir evidencias que apoyen una afirmación", (r) => choose(r, "", EVIDENCE)],
  ["P.3", "Identificar contraargumentos", (r) => choose(r, "", COUNTERCLAIMS)],
  ["P.4", "Clasificar falacias lógicas", (r) => choose(r, "", FALLACIES)],

  ["Q.1", "Usar la personificación", (r) => choose(r, "", PERSONIFICATION)],
  ["Q.2", "Crear oraciones variadas a partir de modelos", (r) => choose(r, "", VARIED)],
  ["Q.3", "Mejorar la oración con un verbo más preciso", (r) => choose(r, "", STRONG_VERB)],

  ["R.1", "Identificar detalles de apoyo en textos informativos", (r) => choose(r, "", SUPPORT_INFO)],
  ["R.2", "Identificar detalles de apoyo en textos literarios", (r) => choose(r, "", SUPPORT_LITERARY)],

  ["S.1", "Conectar ideas con conectores: sin embargo, por lo tanto, además", (r) => choose(r, "Completa con el mejor conector.", CONJ_ADV)],

  ["T.1", "Usar la palabra correcta entre las que se confunden", (r) => choose(r, "Completa la oración.", CONFUSED_USE)],
  ["T.2", "Corregir errores con palabras que se confunden", (r) => choose(r, "", CONFUSED_FIX)],
  ["T.3", "Corregir errores en carteles", (r) => choose(r, "", SIGNS)],
  ["T.4", "Corregir errores del habla cotidiana", (r) => choose(r, "", EVERYDAY)],
  ["T.5", "Proponer revisiones adecuadas", (r) => choose(r, "", REVISIONS)],

  ["U.1", "Identificar fuentes pertinentes", (r) => choose(r, "", RELEVANT)],
  ["U.2", "Evaluar si un titular periodístico es sesgado", (r) => choose(r, "", HEADLINES)],
  ["U.3", "Reconocer las partes de una referencia bibliográfica (formato APA)", (r) => choose(r, "", WORKS_CITED)],
  ["U.4", "Usar citas dentro del texto (formato APA)", (r) => choose(r, "", IN_TEXT)],
  ["U.5", "Identificar y corregir el plagio", (r) => choose(r, "", PLAGIARISM)],
];
