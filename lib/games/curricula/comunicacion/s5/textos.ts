import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Secundaria · banco de lecturas largas, todas resúmenes y textos
// propios (no citas textuales): estrategias retóricas en documentos de la
// historia del Perú (la carta del Solitario de Sayán, el decreto de Castilla
// de 1854, el proemio de «Aves sin nido», «Nuestros indios» de González
// Prada), el desarrollo de textos informativos, argumentos, la novela
// «Matalaché» (Enrique López Albújar), el drama «Collacocha» (Enrique Solari
// Swayne), el ensayo «Peruanidad» (Víctor Andrés Belaunde) y documentos
// institucionales (reglamento, política de privacidad, bases de un concurso).
// Para ir más allá: la novela «El padre Horán» (Narciso Aréstegui), el viaje
// de Humboldt por el Perú y documentos legales (contrato, libro de
// reclamaciones, garantía).

// --- Estrategias retóricas en textos históricos --------------------------------

const RHETORIC_1 = [
  read("La carta del Solitario de Sayán (1822)", "✉️", "En 1822 se discutía si el Perú independiente debía ser una monarquía o una república. José Faustino Sánchez Carrión, que firmaba como «el Solitario de Sayán», publicó cartas en defensa de la república. Sostenía que un rey, aunque fuera extranjero y bien intencionado, acostumbraría a los peruanos a obedecer en lugar de participar, y que solo un gobierno elegido por los ciudadanos formaría hombres libres.",
    ["¿Qué estrategia usa al imaginar a un rey «bien intencionado»?", "Concede lo mejor del argumento contrario para mostrar que aun así es inaceptable.", "Elogia sin reservas a la monarquía y a los reyes de España.", "Cuenta una larga anécdota personal sobre su infancia en Sayán y sus primeros estudios en Lima."],
    ["¿Qué valor defiende?", "La participación libre de los ciudadanos", "La obediencia al rey", "La riqueza de los comerciantes de Lima"],
    ["¿Por qué firmaba con un seudónimo?", "Para proteger su identidad en un debate peligroso", "Porque no sabía escribir su nombre", "Porque vivía en España y no quería que lo reconocieran en el Perú"]),
  read("El decreto de Castilla (1854)", "⛓️", "En diciembre de 1854, en plena guerra civil, el presidente Ramón Castilla firmó en Huancayo el decreto que abolía la esclavitud en el Perú. El texto declaraba que la libertad era un derecho que la nación no podía negar a ninguno de sus hijos, y ordenaba indemnizar a los antiguos dueños. Ese mismo año se había suprimido el tributo indígena. Con ambas medidas, Castilla buscó también ganar apoyo popular frente a sus adversarios.",
    ["¿Qué argumento de principio usa el decreto?", "La libertad como derecho que la nación debe a todos sus hijos", "La conveniencia económica de la esclavitud", "La conveniencia económica de mantener el trabajo esclavo en las haciendas de la costa"],
    ["¿Qué intención política adicional reconoce el texto?", "Ganar apoyo popular en la guerra civil", "Agradar a los antiguos dueños", "Cumplir un tratado con Inglaterra"],
    ["¿Qué muestra la orden de indemnizar a los dueños?", "Que la medida buscó evitar la oposición de los propietarios", "Que los esclavizados recibieron dinero y tierras del Estado para empezar una nueva vida", "Que el decreto fue anulado al poco tiempo"]),
];
const RHETORIC_2 = [
  read("El proemio de «Aves sin nido» (1889)", "📕", "En el proemio de su novela, Clorinda Matto de Turner explicó que no escribía solo para entretener. Quería mostrar los abusos que sufrían los indígenas a manos del cura, el gobernador y el juez de los pueblos andinos, y pedía a los lectores que, al conocer esa realidad, exigieran leyes más justas. Presentaba la novela como una fotografía fiel de las costumbres, y no como invención.",
    ["¿Qué propósito declara la autora?", "Denunciar abusos y promover leyes más justas", "Solo entretener", "Elogiar a las autoridades de los pueblos"],
    ["¿Qué efecto busca al llamarla una «fotografía»?", "Dar credibilidad a la denuncia", "Indicar que el libro tiene ilustraciones", "Negar que sea una novela"],
    ["¿A quiénes señala como responsables de los abusos?", "Al cura, al gobernador y al juez", "A los indígenas", "A los comerciantes de Lima y del Callao"]),
  read("«Nuestros indios» (1904)", "🪶", "En el ensayo «Nuestros indios», Manuel González Prada rechazó que la situación del indígena se debiera a una supuesta inferioridad. Sostuvo que el problema era económico y social, y que la condición del indio no cambiaría con sermones ni con escuelas mientras siguiera explotado. Concluyó que el indio debía redimirse por su propio esfuerzo, y no esperar la compasión de sus opresores.",
    ["¿Qué tesis rebate el autor?", "La supuesta inferioridad del indígena", "La importancia de la economía", "La necesidad de cambios sociales"],
    ["¿Qué tono predomina en su conclusión?", "Combativo y desafiante", "Neutral y descriptivo", "Humorístico"],
    ["¿Qué critica de las soluciones de su tiempo?", "Que se limitaban a sermones y escuelas sin cambiar la explotación", "Que eran demasiado radicales", "Que eran demasiado radicales y pedían cambios imposibles para la época"]),
];

// --- Desarrollo de textos informativos -------------------------------------------

const DEVELOPMENT_1 = [
  read("El puerto de Chancay", "🚢", "Durante siglos, el comercio peruano con Asia pasó por puertos de otros países o por el Callao, congestionado. En 2024 empezó a operar el puerto de Chancay, al norte de Lima, capaz de recibir los barcos más grandes del Pacífico. Sus defensores destacan que acortará en varios días el viaje de las mercancías a Asia; sus críticos advierten sobre el impacto en la pesca artesanal y en el crecimiento desordenado de la ciudad. El texto, así, presenta el puerto como una oportunidad y un desafío.",
    ["¿Cómo desarrolla el autor el tema?", "Presenta antecedentes, el hecho y dos posturas sobre sus efectos.", "Da solo datos técnicos del puerto.", "Narra la vida de un pescador artesanal de Chancay desde niño."],
    ["¿Qué contraste organiza el tercer momento del texto?", "Defensores frente a críticos", "Pasado frente a futuro", "El puerto del Callao frente al puerto de Chancay"],
    ["¿Qué función cumple la última oración?", "Sintetiza el enfoque equilibrado del texto.", "Presenta un dato nuevo.", "Presenta un dato nuevo sobre el costo de construcción del puerto."]),
  read("El agua que llega a Lima", "🚰", "Lima es una ciudad en el desierto que bebe agua de los Andes. El río Rímac no alcanza para diez millones de personas, por eso se trae agua de la cuenca del Mantaro, al otro lado de la cordillera, a través de túneles y lagunas. Ese sistema depende de las lluvias y de los glaciares, que retroceden. Si los limeños no reducen su consumo, la ciudad podría enfrentar escasez en pocas décadas.",
    ["¿Qué estructura sigue el texto?", "Problema, solución actual, riesgo y advertencia", "Un relato de viaje por la cuenca del Mantaro y sus lagunas", "Una lista de ríos del Perú"],
    ["¿Qué paradoja abre el texto?", "Una gran ciudad que vive en el desierto", "Una cordillera sin glaciares ni lagunas", "Una cordillera sin glaciares"],
    ["¿Qué plantea la conclusión?", "Una advertencia condicionada al consumo", "Una solución definitiva", "Una solución definitiva al problema del agua en Lima"]),
];
const DEVELOPMENT_2 = [
  read("La vacuna llega a los Andes", "💉", "A inicios del siglo XIX, la viruela mataba a miles de personas en el virreinato. En 1806 llegó a Lima la expedición de la vacuna, que traía el remedio de una forma sorprendente: en los brazos de niños que se iban contagiando la vacuna uno tras otro durante el viaje. Desde Lima, la vacunación se extendió a las provincias. La historia muestra que la ciencia necesita también de redes humanas para llegar a todos.",
    ["¿Cómo avanza el desarrollo del texto?", "Del problema a la solución y luego a una reflexión", "De una opinión a otra opinión contraria", "De una opinión a otra opinión contraria, sin llegar a ninguna conclusión"],
    ["¿Qué detalle sorprende al lector?", "Que la vacuna viajó en los brazos de niños", "Que Lima no tenía médicos ni hospitales en esa época", "Que Lima no tenía médicos"],
    ["¿Qué idea amplía la última oración?", "Que la ciencia depende de redes humanas", "Que la viruela sigue existiendo", "Que la viruela sigue existiendo hoy en las provincias del Perú"]),
  read("La lengua de señas", "🤟", "La lengua de señas peruana no es un conjunto de gestos improvisados: tiene gramática, vocabulario y variantes regionales, como cualquier lengua. En 2010 fue reconocida oficialmente, lo que obliga a las entidades públicas a contar con intérpretes. Sin embargo, todavía hay pocos intérpretes y muchos colegios no la enseñan. Reconocer una lengua en la ley es el primer paso; garantizar su uso, el siguiente.",
    ["¿Qué hace el autor en la primera oración?", "Corrige una idea equivocada sobre la lengua de señas.", "Cuenta su experiencia aprendiendo señas durante un verano en un colegio de Lima.", "Da una lista de señas básicas para saludar."],
    ["¿Qué conector introduce el problema pendiente?", "«Sin embargo»", "«como cualquier lengua»", "«En 2010»"],
    ["¿Qué estructura tiene la última oración?", "Un paralelismo que distingue dos etapas", "Una cita de autoridad de un especialista en lenguas", "Una cita de autoridad"]),
];

// --- Argumentos ----------------------------------------------------------------

const ARGS_1 = [
  read("Una hora más de lectura", "📚", "El currículo debería dedicar una hora diaria a la lectura libre. Los alumnos que leen por gusto obtienen mejores resultados en todas las áreas, según las evaluaciones internacionales. Además, la lectura desarrolla la empatía, porque nos hace vivir otras vidas. Algunos dirán que no hay tiempo en el horario. Pero si un hábito mejora todas las áreas, dedicarle tiempo no es perderlo, sino invertirlo.",
    ["¿Cuál es la tesis?", "El currículo debería dedicar una hora diaria a la lectura libre.", "Los alumnos no tienen tiempo para leer.", "Las evaluaciones internacionales son injustas con el Perú."],
    ["¿Qué tipo de evidencia usa primero?", "Resultados de evaluaciones internacionales", "Una anécdota personal sobre un amigo que lee mucho", "Una encuesta en redes sociales"],
    ["¿Cómo responde a la objeción del horario?", "Replantea el tiempo de lectura como una inversión.", "Propone eliminar matemáticas.", "Propone eliminar matemáticas para dar más horas a la lectura libre."]),
  read("Trabajo remoto", "💻", "El Estado debería permitir el trabajo remoto en los puestos que no requieren atención presencial. Durante la pandemia se demostró que muchas tareas pueden hacerse desde casa sin bajar la productividad. Además, se reducirían el tráfico y la contaminación. Es cierto que no todos tienen buena conexión, pero la medida sería voluntaria y no reemplazaría la atención presencial donde se necesita.",
    ["¿Qué evidencia ofrece el autor?", "La experiencia durante la pandemia", "Un estudio de una universidad de Lima", "La opinión de un ministro"],
    ["¿Qué contraargumento reconoce?", "La falta de buena conexión en algunos hogares", "Que la productividad baja mucho cuando se trabaja desde casa", "Que la productividad sube demasiado"],
    ["¿Cómo limita el alcance de su propuesta?", "La plantea como voluntaria y solo para ciertos puestos.", "La aplica a todos los trabajadores.", "La aplica a todos los trabajadores del país, sin excepción ni plazo."]),
];
const ARGS_2 = [
  read("Lenguas originarias en la universidad", "🗣️", "Las universidades deberían ofrecer cursos de quechua, aimara o una lengua amazónica a todos sus estudiantes. Millones de peruanos hablan esas lenguas, y médicos, abogados o maestros que no las entienden no pueden servirles bien. Algunos creen que es mejor aprender inglés. Pero no se trata de elegir: un profesional peruano necesita comunicarse con el mundo y, sobre todo, con su propio país.",
    ["¿Qué razón principal da el autor?", "Los profesionales deben poder comunicarse con millones de peruanos.", "El quechua es más fácil que el inglés.", "Las universidades tienen pocos cursos y necesitan llenar el horario."],
    ["¿Cómo responde a la preferencia por el inglés?", "Niega que haya que elegir entre ambas opciones.", "Acepta que el inglés es más importante.", "Acepta que el inglés es más importante y retira su propuesta."],
    ["¿Qué recurso usa la última oración?", "Una antítesis entre el mundo y el propio país", "Una estadística", "Una estadística sobre los hablantes de quechua"]),
  read("Contra la comida chatarra en los kioscos", "🍟", "Los kioscos escolares no deberían vender comida chatarra. La obesidad infantil ha aumentado en la última década y los hábitos se forman en la escuela. La ley de alimentación saludable ya exige advertencias en los envases, pero eso no basta si el kiosco solo ofrece galletas y gaseosas. Se dirá que los alumnos comprarán afuera. Puede ser, pero el colegio no debe ser parte del problema.",
    ["¿Qué hecho usa como evidencia?", "El aumento de la obesidad infantil", "El precio de las gaseosas", "La opinión de los kiosqueros"],
    ["¿Qué hace el autor con la objeción de que comprarán afuera?", "La admite en parte y responde con un principio.", "Cambia su tesis y propone vender comida chatarra solo los viernes.", "Cambia su tesis."],
    ["¿Por qué menciona la ley de alimentación saludable?", "Para mostrar que las advertencias no son suficientes", "Para pedir que se derogue", "Para pedir que se derogue y se eliminen los octógonos de los envases"]),
];

// --- Novela: «Matalaché» -----------------------------------------------------------

const NOVEL = [
  read("Matalaché (resumen I)", "🌵", "La novela transcurre en Piura, poco antes de la independencia, en una hacienda dedicada a fabricar jabón. José Manuel, a quien todos llaman Matalaché, es un esclavo mulato fuerte, inteligente y orgulloso, que trabaja como capataz de la jabonería. María Luz, la hija del hacendado, regresa de Lima y se enamora de él, aunque esa relación está prohibida por las rígidas jerarquías de la época.",
    ["¿Qué obstáculo enfrenta el amor de los protagonistas?", "Las jerarquías sociales y raciales de la época", "La distancia entre Piura y Lima", "Que María Luz está comprometida con un militar español"],
    ["¿Cómo se presenta a Matalaché?", "Como un hombre fuerte, inteligente y orgulloso", "Como un hombre débil y sumiso", "Como un hombre débil, sumiso y temeroso del hacendado"],
    ["¿En qué momento histórico se sitúa la novela?", "Poco antes de la independencia", "Durante el imperio inca", "Durante el imperio de los incas en el Cusco"]),
  read("Matalaché (resumen II)", "🔥", "Cuando el hacendado descubre la relación de su hija con el esclavo, su furia es implacable. Matalaché, que se niega a humillarse, es condenado a una muerte terrible en la propia jabonería. López Albújar convierte esta historia de amor en una denuncia de la esclavitud y del racismo, y presenta a su protagonista como un hombre que defiende su dignidad hasta el final.",
    ["¿Qué denuncia la novela?", "La esclavitud y el racismo", "La pobreza de los hacendados", "La vida en Lima"],
    ["¿Qué actitud mantiene Matalaché ante el castigo?", "Defiende su dignidad y no se humilla.", "Pide perdón y se arrepiente.", "Huye a la sierra con María Luz y vive feliz."],
    ["¿Por qué es significativo que muera en la jabonería?", "Porque el lugar de su trabajo esclavo se vuelve el de su castigo", "Porque allí había nacido", "Porque allí había nacido y quería morir en el mismo lugar"]),
];

// --- Teatro: «Collacocha» -----------------------------------------------------------

const DRAMA = [
  read("Collacocha (resumen I)", "🏔️", "El ingeniero Nicolás Echecopar dirige la construcción de un túnel en lo alto de los Andes, para unir la costa con la selva. Es un hombre enérgico, que trata con rudeza a sus trabajadores, pero que cree profundamente en que su obra cambiará la vida de los pueblos. La montaña, con sus lluvias y derrumbes, parece oponerse a cada avance.",
    ["¿Qué conflicto central presenta la obra?", "El ser humano frente a una naturaleza hostil", "Una disputa amorosa entre ingenieros", "Una disputa amorosa entre dos ingenieros del campamento"],
    ["¿Qué rasgo define a Echecopar?", "Su energía y su fe en la obra", "Su cobardía", "Su desinterés por los pueblos"],
    ["¿Qué papel cumple la montaña?", "Es casi un antagonista que se opone al avance.", "Es solo el paisaje de fondo.", "Ayuda a los trabajadores a terminar rápido."]),
  read("Collacocha (resumen II)", "🌧️", "Un aluvión destruye parte del campamento y amenaza la obra. Mientras otros quieren abandonar el proyecto, Echecopar sigue adelante, aunque sufre pérdidas personales. Años después, el túnel está terminado y la carretera funciona. La obra plantea si el progreso justifica los sacrificios y celebra la voluntad de quienes transforman el territorio.",
    ["¿Qué pregunta plantea la obra?", "Si el progreso justifica los sacrificios", "Si la montaña es más alta que el túnel", "Si conviene viajar en avión"],
    ["¿Qué hace Echecopar tras el aluvión?", "Continúa la obra pese a las pérdidas.", "Abandona el proyecto.", "Culpa a los trabajadores y se va del Perú."],
    ["¿Qué tipo de obra es «Collacocha»?", "Un drama", "Una comedia de costumbres", "Un poema épico"]),
];

// --- Ensayo: «Peruanidad» -------------------------------------------------------------

const ESSAY = [
  read("Peruanidad (I)", "🇵🇪", "En «Peruanidad» (1942), Víctor Andrés Belaunde se preguntó qué une a los peruanos más allá de sus diferencias. Rechazó tanto la idea de que el Perú fuera solo indígena como la de que fuera solo español. Propuso entender la nación como una síntesis: una unidad viva formada por el encuentro de culturas a lo largo de la historia.",
    ["¿Qué pregunta guía el ensayo?", "Qué une a los peruanos más allá de sus diferencias", "Cuántos habitantes tiene el Perú", "Cuántos habitantes tenía el Perú en 1942 y en qué regiones vivían"],
    ["¿Qué dos posturas rechaza?", "Que el Perú sea solo indígena o solo español", "Que la costa sea más importante que la sierra y la selva para la nación", "Que la costa sea mejor que la sierra"],
    ["¿Qué concepto propone?", "La nación como síntesis de culturas", "La nación como un territorio sin historia", "La separación de las regiones"]),
  read("Peruanidad (II)", "🤝", "Para Belaunde, esa síntesis no estaba terminada: era una tarea. El país debía integrar a quienes la historia había excluido y construir instituciones que representaran a todos. Sus críticos, sin embargo, señalaron que su visión daba demasiado peso a la herencia española y católica y minimizaba los conflictos sociales. Así, el ensayo abrió un debate que continúa hasta hoy sobre la identidad nacional.",
    ["¿Por qué la síntesis es una «tarea»?", "Porque la integración de todos no se había logrado", "Porque ya estaba terminada y solo faltaba celebrarla", "Porque ya estaba terminada"],
    ["¿Qué critican sus detractores?", "El peso que da a la herencia española y católica", "Que hablara demasiado de la economía y poco de la cultura", "Que hablara de la economía"],
    ["¿Qué muestra la última oración?", "Que el tema de la identidad sigue en discusión", "Que nadie leyó el ensayo en su época ni después", "Que nadie leyó el ensayo"]),
];

// --- Documentos institucionales -----------------------------------------------------

const DOCUMENTS = [
  read("Reglamento interno", "📘", "Art. 12.— El estudiante que acumule tres tardanzas injustificadas en un mes será citado con su apoderado.\nArt. 13.— El uso del celular en el aula solo está permitido con autorización del docente.\nArt. 14.— Las faltas graves serán evaluadas por el comité de convivencia, que garantizará el derecho del estudiante a ser escuchado.",
    ["¿Qué ocurre tras tres tardanzas injustificadas?", "Se cita al estudiante con su apoderado.", "El estudiante es expulsado.", "Se le baja la nota en todos los cursos del bimestre."],
    ["¿Cuándo se puede usar el celular en el aula?", "Con autorización del docente", "Siempre que no suene durante la clase", "Siempre que no suene"],
    ["¿Qué derecho garantiza el artículo 14?", "El derecho a ser escuchado", "El derecho a no estudiar", "El derecho a usar el celular"]),
  read("Política de privacidad", "🔒", "Esta aplicación recopila tu nombre, correo y ubicación para brindarte el servicio. No compartiremos tus datos con terceros sin tu consentimiento, salvo por mandato judicial. Puedes solicitar la eliminación de tus datos escribiendo a privacidad@app.pe. Al usar la aplicación, aceptas estas condiciones.",
    ["¿En qué caso se compartirían los datos sin consentimiento?", "Por mandato judicial", "Nunca, en ningún caso", "Cuando la empresa lo decida"],
    ["¿Cómo se pueden eliminar los datos?", "Escribiendo al correo indicado", "Desinstalando la aplicación", "No se pueden eliminar"],
    ["¿Qué implica la última oración?", "Que usar la aplicación equivale a aceptar las condiciones", "Que hay que firmar un contrato en papel en una oficina", "Que hay que firmar un contrato en papel"]),
  read("Bases del concurso", "🏆", "BASES DEL CONCURSO REGIONAL DE CUENTO 2025\n1. Participan estudiantes de 3.° a 5.° de secundaria.\n2. Cada participante enviará un solo cuento inédito, de máximo tres páginas.\n3. El plazo vence el 30 de septiembre.\n4. El jurado evaluará originalidad, uso del lenguaje y estructura.\n5. Los cuentos con plagio serán descalificados.",
    ["¿Quiénes pueden participar?", "Estudiantes de 3.° a 5.° de secundaria", "Solo estudiantes de quinto de secundaria de Lima", "Solo estudiantes de quinto"],
    ["¿Qué significa «inédito» en las bases?", "Que no ha sido publicado antes", "Que está escrito a mano y con letra clara", "Que está escrito a mano"],
    ["¿Qué criterio NO evalúa el jurado?", "La cantidad de páginas", "La originalidad", "El uso del lenguaje"]),
];

// --- Para ir más allá ------------------------------------------------------------------

const NOVEL_X = [
  read("El padre Horán (resumen I)", "⛪", "Publicada en 1848, «El padre Horán», de Narciso Aréstegui, es considerada una de las primeras novelas peruanas. Transcurre en el Cusco de inicios de la república. Horán es un sacerdote respetado por la sociedad, confesor de Angélica, una joven de familia humilde. Bajo su apariencia virtuosa, Horán alimenta una pasión obsesiva por ella.",
    ["¿Qué contraste define al padre Horán?", "Su apariencia virtuosa frente a su pasión oculta", "Su pobreza frente a su riqueza", "Su pobreza de origen frente a la riqueza que acumuló en la iglesia"],
    ["¿Por qué es importante esta novela en la historia literaria?", "Es considerada una de las primeras novelas peruanas.", "Es la novela más larga del Perú.", "Fue escrita en quechua y traducida al castellano en el siglo XX."],
    ["¿Dónde transcurre la historia?", "En el Cusco de inicios de la república", "En una misión de la selva amazónica durante el virreinato", "En la selva amazónica"]),
  read("El padre Horán (resumen II)", "🕯️", "La obsesión de Horán termina en tragedia: incapaz de dominar su pasión, asesina a Angélica. La novela, de tono romántico, critica la hipocresía de quienes usan su autoridad moral para ocultar sus abusos, y la complicidad de una sociedad que no se atreve a cuestionarlos. Por su denuncia, fue polémica en su tiempo.",
    ["¿Qué critica la novela?", "El abuso de la autoridad moral y la complicidad social", "La falta de iglesias en el Cusco", "La falta de iglesias y de sacerdotes en los pueblos del Cusco"],
    ["¿A qué movimiento literario pertenece?", "Al romanticismo", "Al vanguardismo", "Al realismo mágico"],
    ["¿Por qué fue polémica?", "Por su denuncia de los abusos de un sacerdote", "Por estar escrita en verso y no en prosa, algo raro en su época", "Por estar escrita en verso"]),
];
const NONFICTION_X = [
  read("Humboldt en el Perú (I)", "🧭", "En 1802, el naturalista alemán Alexander von Humboldt recorrió el Perú. Cruzó los Andes, estudió las plantas según la altitud y midió la temperatura del mar frente al Callao. Descubrió que el agua era mucho más fría de lo esperado para una costa tropical, y explicó que una corriente fría venía del sur. Esa corriente lleva hoy su nombre.",
    ["¿Qué descubrimiento hizo frente al Callao?", "Que el mar era más frío de lo esperado", "Que había oro en la playa", "Que el mar era más caliente que en el Caribe"],
    ["¿Qué relación estudió en los Andes?", "La relación entre las plantas y la altitud", "La relación entre los incas y los españoles", "La relación entre la luna y las mareas"],
    ["¿Qué lleva hoy su nombre?", "La corriente fría del Pacífico sur", "Un volcán de Arequipa", "Un volcán de Arequipa que él escaló en 1802"]),
  read("Humboldt en el Perú (II)", "🐦", "Humboldt observó también el uso del guano como abono por los campesinos de la costa, una práctica que venía desde los incas, y envió muestras a Europa. Décadas después, el guano se convertiría en la principal exportación del Perú. Su viaje muestra cómo la observación científica de un territorio puede anticipar, sin proponérselo, transformaciones económicas enormes.",
    ["¿Qué práctica tradicional observó Humboldt?", "El uso del guano como abono", "La pesca con dinamita", "La pesca con redes de los antiguos moches"],
    ["¿Qué consecuencia tuvo, décadas después, lo que observó?", "El guano se volvió la principal exportación del Perú.", "Los campesinos dejaron de usar el guano y lo reemplazaron por abonos europeos.", "Los incas volvieron a gobernar la costa."],
    ["¿Qué reflexión propone la última oración?", "La ciencia puede anticipar cambios económicos sin buscarlo.", "La ciencia no sirve para la economía.", "La ciencia no sirve para la economía y debe mantenerse lejos de ella."]),
];
const LEGAL_X = [
  read("Contrato de alquiler", "🏠", "CLÁUSULA TERCERA: El arrendatario pagará una renta mensual de S/ 900, por adelantado, los primeros cinco días de cada mes.\nCLÁUSULA QUINTA: El arrendatario no podrá subarrendar el inmueble sin autorización escrita del arrendador.\nCLÁUSULA SÉPTIMA: El plazo del contrato es de un año, renovable por acuerdo de ambas partes.",
    ["¿Quién es el arrendatario?", "La persona que alquila y paga la renta", "El dueño del inmueble", "El dueño del inmueble que lo alquila"],
    ["¿Qué prohíbe la cláusula quinta?", "Subarrendar sin autorización escrita", "Pintar las paredes", "Pintar las paredes de otro color"],
    ["¿Qué ocurre al terminar el año?", "Puede renovarse si ambas partes están de acuerdo.", "El arrendatario pasa a ser dueño del inmueble después de pagar doce meses seguidos.", "El arrendatario se convierte en dueño."]),
  read("Libro de reclamaciones", "📒", "Según el Código de Protección y Defensa del Consumidor, todo establecimiento debe tener un libro de reclamaciones, físico o virtual. Un «reclamo» expresa disconformidad con un producto o servicio; una «queja», en cambio, se refiere a la mala atención. El proveedor debe responder en un plazo máximo de 15 días hábiles.",
    ["¿En qué se diferencia un reclamo de una queja?", "El reclamo es sobre el producto o servicio; la queja, sobre la atención.", "La queja es solo para bancos y el reclamo, para cualquier tienda o servicio público.", "La queja es solo para bancos."],
    ["¿Cuál es el plazo de respuesta del proveedor?", "15 días hábiles como máximo", "Treinta días calendario, renovables por otros treinta", "No hay plazo"],
    ["¿Qué norma regula el libro de reclamaciones?", "El Código de Protección y Defensa del Consumidor", "La Constitución de 1823", "La Constitución de 1823, la primera del Perú republicano"]),
  read("Certificado de garantía", "🔧", "GARANTÍA: Este producto tiene una garantía de 12 meses desde la fecha de compra contra defectos de fabricación. La garantía no cubre daños por mal uso, caídas o contacto con líquidos. Para hacerla efectiva, presente este certificado y el comprobante de pago.",
    ["¿Qué cubre la garantía?", "Defectos de fabricación durante 12 meses", "Daños por caídas o por contacto con agua durante dos años", "Daños por caídas"],
    ["¿Qué se necesita para usar la garantía?", "El certificado y el comprobante de pago", "Una carta firmada por el alcalde del distrito", "Una carta del alcalde"],
    ["Si el celular se moja, ¿lo cubre la garantía?", "No, porque el contacto con líquidos está excluido", "Sí, porque el producto todavía está dentro del plazo de doce meses", "Solo si es nuevo"]),
];

export const ROWS: Row[] = [
  ["retorica-1", (r) => readPassage(r, RHETORIC_1, false)],
  ["retorica-2", (r) => readPassage(r, RHETORIC_2, false)],
  ["desarrollo-1", (r) => readPassage(r, DEVELOPMENT_1, false)],
  ["desarrollo-2", (r) => readPassage(r, DEVELOPMENT_2, false)],
  ["argumentos-1", (r) => readPassage(r, ARGS_1, false)],
  ["argumentos-2", (r) => readPassage(r, ARGS_2, false)],
  ["matalache", (r) => readPassage(r, NOVEL, false)],
  ["collacocha", (r) => readPassage(r, DRAMA, false)],
  ["peruanidad", (r) => readPassage(r, ESSAY, false)],
  ["documentos", (r) => readPassage(r, DOCUMENTS, false)],
  ["padre-horan", (r) => readPassage(r, NOVEL_X, false)],
  ["humboldt", (r) => readPassage(r, NONFICTION_X, false)],
  ["documentos-legales", (r) => readPassage(r, LEGAL_X, false)],
];
