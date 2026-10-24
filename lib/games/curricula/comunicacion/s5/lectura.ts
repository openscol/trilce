import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Secundaria · banco de comprensión y lectura atenta con lecturas
// propias sobre el Perú: ideas principales, desarrollo de temas, destinatario,
// propósito y perspectiva, tono, alusiones (mitología, Biblia, clásicos y
// mitos andinos), figuras literarias (también anáfora, antítesis, apóstrofe,
// aliteración, quiasmo y lítote), narrador, personajes y estructura, cuentos
// breves y poesía peruana de dominio público (Vallejo, Eguren, Chocano).

// --- Ideas principales -----------------------------------------------------

const MAIN = [
  read("El mar de Grau", "🐋", "Frente a la costa peruana corre la corriente de Humboldt, que trae aguas frías y ricas en nutrientes desde el sur. Gracias a ella, el mar peruano es uno de los más productivos del planeta: alimenta enormes cardúmenes de anchoveta, que a su vez sostienen a aves, lobos marinos y ballenas. Esa misma riqueza explica que el Perú sea una potencia pesquera, y también que cualquier alteración, como el Niño, tenga efectos tan graves en su economía.",
    ["¿Cuál es la idea principal?", "La corriente de Humboldt hace del mar peruano uno de los más productivos del mundo.", "Las ballenas se alimentan de lobos marinos.", "El Niño es un fenómeno que ocurre solo en el Perú y que nadie ha logrado explicar."],
    ["¿Qué relación establece el texto entre la anchoveta y otras especies?", "La anchoveta es la base de una cadena alimentaria.", "La anchoveta compite con las ballenas.", "Las aves y los lobos marinos se alimentan sobre todo de algas y plancton."],
    ["¿Qué explica la última oración?", "Por qué la riqueza del mar también hace vulnerable la economía", "Cómo se pesca la anchoveta", "Qué es la corriente de Humboldt y de dónde viene el agua fría"]),
  read("Caral, la ciudad más antigua", "🏛️", "Hace unos cinco mil años, en el valle de Supe, al norte de Lima, floreció Caral, considerada la ciudad más antigua de América. Sus habitantes construyeron pirámides, plazas circulares y viviendas sin conocer la cerámica. Lo más sorprendente es que no se han encontrado armas ni murallas: todo indica que fue una sociedad que se organizó a partir del comercio y la religión, más que de la guerra.",
    ["¿Cuál es la idea principal?", "Caral fue una ciudad muy antigua organizada en torno al comercio y la religión.", "Caral está al norte de Lima.", "Los habitantes de Caral fabricaban cerámica fina y armas de bronce para la guerra."],
    ["¿Por qué es importante que no haya armas ni murallas?", "Sugiere que la sociedad no se basaba en la guerra.", "Prueba que Caral fue destruida.", "Indica que sus habitantes eran nómadas que vivían en cuevas."],
    ["¿Qué dato muestra su antigüedad?", "Floreció hace unos cinco mil años.", "Sus pirámides y plazas circulares todavía se pueden visitar.", "Está en el valle de Supe."]),
  read("El empleo informal", "🧺", "En el Perú, más de siete de cada diez trabajadores tienen un empleo informal: no tienen contrato, seguro de salud ni aportes para su jubilación. La informalidad permite que muchas familias generen ingresos rápidamente, pero las deja desprotegidas ante una enfermedad o en la vejez. Reducirla no depende solo de fiscalizar, sino de facilitar trámites, bajar costos y ofrecer beneficios reales a quienes se formalizan.",
    ["¿Cuál es la idea principal?", "La informalidad es extendida y reducirla requiere incentivos, no solo control.", "Los trabajadores informales ganan más que los formales.", "El Estado debería cerrar todos los negocios informales de inmediato para proteger a los trabajadores."],
    ["¿Qué ventaja de la informalidad reconoce el texto?", "Permite generar ingresos rápidamente.", "Da seguro de salud.", "Garantiza una buena jubilación y vacaciones pagadas cada año."],
    ["¿Qué propone el autor?", "Facilitar trámites, bajar costos y ofrecer beneficios", "Fiscalizar más", "Aumentar los impuestos a los negocios pequeños de los mercados"]),
];

const MULTI = [
  read("El guano de las islas", "🐦", "En el siglo XIX, el excremento de las aves marinas acumulado en las islas peruanas, el guano, se convirtió en el fertilizante más buscado de Europa. Su venta llenó las arcas del Estado durante décadas. Sin embargo, la riqueza se usó mal: se gastó en préstamos y obras sin planificación, y benefició a pocos. Cuando el guano se agotó, el país quedó endeudado. Hoy, los historiadores ven esa etapa como una lección sobre cómo administrar los recursos naturales.",
    ["¿Qué ideas principales desarrolla el texto?", "El auge del guano, su mala administración y la lección que dejó", "Cómo viven las aves marinas", "Que Europa compraba guano porque no tenía tierras fértiles propias"],
    ["¿Qué conector marca el giro del texto?", "«Sin embargo»", "«Hoy»", "«Cuando el guano se agotó, el país quedó endeudado»"],
    ["¿Por qué se habla de una «lección»?", "Porque la experiencia enseña cómo no administrar un recurso", "Porque el guano se enseña en el colegio", "Porque los historiadores escribieron un libro con ese título"]),
  read("La música andina en la ciudad", "🎶", "Cuando los migrantes andinos llegaron a Lima en el siglo XX, trajeron consigo el huaino. En coliseos y radios surgieron estrellas como el Jilguero del Huascarán o Pastorita Huaracina, que cantaban la nostalgia de la tierra. Con los años, el huaino se mezcló con la cumbia y nació la chicha, la música de las nuevas barriadas. Así, la ciudad no solo recibió a los migrantes, sino que fue transformada por su cultura.",
    ["¿Cuáles son las ideas principales?", "La llegada del huaino a Lima, su popularidad y su mezcla con la cumbia", "Los coliseos de Lima", "La vida del Jilguero del Huascarán desde su infancia en Áncash"],
    ["¿Qué expresa la última oración?", "Que la cultura migrante cambió a la ciudad.", "Que Lima rechazó a los migrantes.", "Que la cumbia es más antigua que el huaino y que la chicha."],
    ["¿Qué tema cantaban las estrellas del huaino?", "La nostalgia de la tierra", "La vida en el mar", "El fútbol y los clubes de Lima"]),
];

// --- Temas ------------------------------------------------------------------

const THEMES = [
  read("Las dos lenguas", "🗣️", "Durante años, Marco se avergonzó de que su madre le hablara en quechua delante de sus amigos. Le respondía en castellano y fingía no entender. Cuando ella enfermó, el médico de la posta no comprendía sus síntomas y Marco tuvo que traducir. Esa tarde, mientras repetía en castellano las palabras de su madre, sintió que por primera vez era el puente entre dos mundos. Al volver a casa, le pidió que le enseñara las canciones que le cantaba de niño.",
    ["¿Cómo se desarrolla el tema de la identidad?", "Del rechazo a la lengua materna a su recuperación", "De la aceptación al rechazo", "De la vergüenza al olvido definitivo de la lengua de su madre"],
    ["¿Qué simboliza la imagen del «puente»?", "El valor de unir dos culturas", "Una construcción de la posta médica", "La distancia entre Marco y su madre, que nunca se supera"],
    ["¿Qué muestra el pedido final de Marco?", "Su deseo de reconectarse con su cultura", "Que quiere aprender música profesionalmente", "Que la madre se curó"]),
  read("El último tren", "🚂", "El tren dejó de pasar por Ticlio el año en que cerraron la mina. Al principio, el pueblo esperó que volviera; luego, los jóvenes se fueron a Lima. Solo don Teodoro seguía limpiando cada mañana el andén. «¿Para qué, si ya no viene?», le preguntaban. «Para que el pueblo recuerde que alguna vez llegó», respondía. Años después, cuando se reabrió la línea para turistas, encontraron la estación impecable.",
    ["¿Qué tema central propone el cuento?", "La memoria y la esperanza frente al abandono", "Lo moderno que es el tren", "El turismo como única salida para los pueblos de la sierra"],
    ["¿Qué revela la respuesta de don Teodoro?", "Que cuidar la estación es una forma de preservar la memoria", "Que la empresa del tren le pagaba un sueldo por limpiar el andén cada mañana", "Que no sabía que el tren ya no pasaba por Ticlio"],
    ["¿Qué efecto tiene el final?", "Premia la constancia del personaje con un giro esperanzador.", "Muestra que su esfuerzo fue inútil.", "Explica la historia de la minería en la región y sus problemas."]),
];

// --- Destinatario, propósito y perspectiva ----------------------------------

const AUDIENCE: ChoiceItem[] = [
  pt("¿A quién se dirige el texto y con qué propósito?", "«Estimados postulantes: el examen de admisión se rendirá el domingo 14. Presentarse con DNI y lápiz 2B a las 7:00 a. m.»", "A los postulantes, para darles instrucciones", "A los docentes, para pedirles que corrijan", "A los padres de familia, para venderles útiles"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«Se recomienda a los productores de cacao aplicar el control biológico de la mazorca negra en los meses de mayor humedad.»", "A los productores de cacao, para orientarlos técnicamente", "A los consumidores de chocolate, para que compren más", "A los niños de la región, para entretenerlos"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«Querida promoción: hoy cerramos una etapa. Llévense lo aprendido y no olviden de dónde vienen.»", "A los egresados, para despedirlos y motivarlos", "A los profesores, para evaluarlos", "Al director regional, para pedirle más presupuesto para el colegio"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«Usuario: su recibo vence el 20. Evite el corte pagando en agentes o por la aplicación.»", "A los clientes del servicio, para recordarles el pago", "A los técnicos de la empresa, para darles órdenes de trabajo", "A los vecinos, para invitarlos a una fiesta"),
];
const PERSPECTIVE: ChoiceItem[] = [
  pt("¿Cuál es la perspectiva del autor?", "«Las universidades nacionales han formado a buena parte de los profesionales del país, aunque con presupuestos que serían impensables en otros países.»", "Las universidades nacionales hacen mucho con pocos recursos.", "Las universidades nacionales son las peores del país.", "Las universidades privadas deberían recibir el presupuesto de las nacionales."),
  pt("¿Cuál es la perspectiva del autor?", "«Hablar de “descentralización” mientras todas las decisiones se toman en Lima es una contradicción que las regiones pagan cada día.»", "La descentralización no se cumple en la práctica.", "Lima debería tomar más decisiones.", "Las regiones deberían depender todavía más de las decisiones que se toman en Lima."),
  pt("¿Cuál es la perspectiva del autor?", "«La gastronomía peruana es un orgullo, pero no puede ocultar que miles de niños aún sufren desnutrición.»", "El éxito gastronómico no debe hacer olvidar el hambre.", "La gastronomía peruana es mala.", "La desnutrición ya no existe en el Perú gracias a la cocina."),
  pt("¿Cuál es la perspectiva del autor?", "«No hay que temer a la inteligencia artificial, sino aprender a usarla con criterio.»", "La inteligencia artificial debe usarse con responsabilidad.", "La inteligencia artificial debe prohibirse.", "La inteligencia artificial piensa mejor que las personas en todo."),
];

// --- Tono -------------------------------------------------------------------

const FORMAL: ChoiceItem[] = [
  f("¿Qué texto es más formal?", "Le agradeceré confirmar su participación antes del viernes.", "Avísame si vienes, ¿ya?", "Confirma rápido, causa, que se acaba el plazo del viernes."),
  f("¿Qué texto es más formal?", "La institución lamenta los inconvenientes ocasionados.", "Sorry por el roche, gente.", "Perdón, se nos chispoteó y salió todo mal esta vez."),
  f("¿Qué texto es más formal?", "Se convoca a los delegados a una reunión extraordinaria.", "¡Delegados, reunión ya!", "Oigan, delegados, júntense un ratito después de clase."),
  f("¿Qué texto es más formal?", "Solicito se me conceda una prórroga para la entrega.", "¿Me das más tiempo pe?", "Profe, porfa, déjeme entregar el trabajo la otra semana."),
];
const OBJECTIVE = sorter(["Objetivo", "Subjetivo"], "¿El tono de este texto es objetivo o subjetivo?");
const OBJECTIVE_ITEMS: ChoiceItem[] = [
  OBJECTIVE("El río Amazonas tiene unos 7000 kilómetros de longitud.", 0),
  OBJECTIVE("El Amazonas es un espectáculo que te deja sin palabras.", 1),
  OBJECTIVE("El censo registró 32,6 millones de habitantes.", 0),
  OBJECTIVE("Es increíble que el censo haya tardado tanto.", 1),
  OBJECTIVE("La ley entró en vigencia el 1 de enero.", 0),
  OBJECTIVE("Esa ley absurda solo complica la vida de todos.", 1),
  OBJECTIVE("La tasa de desempleo bajó dos puntos en el último año.", 0),
  OBJECTIVE("Por suerte, al fin las cosas mejoran para los jóvenes.", 1),
];
const TONE: ChoiceItem[] = [
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «La obra presenta un retraso de seis meses.»\nB: «Seis meses de espera y nada: otra promesa que se lleva el viento.»", "A es neutral; B es desencantado.", "A es entusiasta; B es neutral.", "Los dos tienen el mismo tono, aunque B usa más palabras."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «Volver a Chachapoyas fue como abrir un álbum de fotos de mi infancia.»\nB: «Chachapoyas está a 2335 metros de altitud.»", "A es nostálgico; B es informativo.", "A es irónico; B es emotivo.", "A es técnico y preciso; B es poético y emotivo."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «Excelente idea: cerrar la biblioteca justo en época de exámenes.»\nB: «La biblioteca cerrará durante los exámenes.»", "A es irónico; B es neutral.", "A es sincero; B es irónico.", "Ambos son alegres y celebran el cierre."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «Nunca olvidaremos tu sonrisa, profesor.»\nB: «El profesor laboró en la institución durante 30 años.»", "A es afectuoso; B es formal e impersonal.", "A es formal y distante; B es cariñoso y cercano.", "Ninguno expresa sentimientos."),
];

// --- Alusiones ------------------------------------------------------------------

const ALLUSION: ChoiceItem[] = [
  pt("¿Qué quiere decir la alusión?", "«Cada mañana empujaba su roca de Sísifo: el mismo trabajo, sin final.»", "Que hacía una tarea repetitiva e interminable", "Que trabajaba en una cantera", "Que su trabajo estaba a punto de terminar"),
  pt("¿Qué quiere decir la alusión?", "«La reunión fue una torre de Babel: nadie entendía a nadie.»", "Que hubo confusión porque no se entendían", "Que se construyó un edificio muy alto", "Que todos estuvieron de acuerdo"),
  pt("¿Qué quiere decir la alusión?", "«Como Prometeo, el maestro llevó el fuego del conocimiento a su pueblo.»", "Que compartió el saber, aunque le costara sacrificios", "Que provocó un incendio", "Que se negó a enseñar y guardó todos sus conocimientos para sí mismo"),
  pt("¿Qué quiere decir la alusión?", "«Ser o no ser: esa era la duda de Ana ante la beca en el extranjero.»", "Que enfrentaba una decisión trascendental", "Que estaba ensayando una obra de teatro para el aniversario del colegio", "Que no le importaba la beca"),
  pt("¿Qué quiere decir la alusión?", "«Esperaban a su Inkarrí, el que volvería a reunir lo que estaba disperso.»", "Que esperaban un renacer o una restauración de su pueblo", "Que esperaban la llegada de un turista extranjero con regalos para la comunidad", "Que esperaban la cosecha de maíz"),
];
const ALLUSION_SOURCE: ChoiceItem[] = [
  f("¿De dónde proviene el mito de Sísifo?", "De la mitología griega", "De la Biblia", "De la tradición andina"),
  f("¿De dónde proviene la torre de Babel?", "De la Biblia", "De la mitología griega", "De una leyenda amazónica"),
  f("¿De dónde proviene la frase «ser o no ser»?", "De «Hamlet», de William Shakespeare", "De una tradición de Ricardo Palma sobre la Lima colonial", "De la Biblia"),
  f("¿De dónde proviene el mito de Inkarrí?", "De la tradición andina posterior a la Conquista", "De una novela de Vargas Llosa ambientada en la selva amazónica", "De una novela de Vargas Llosa"),
  f("¿De dónde proviene el mito de Prometeo?", "De la mitología griega", "De la tradición inca", "Del Quijote"),
  f("¿De dónde proviene la historia de Caín y Abel?", "De la Biblia", "De la mitología griega", "De las «Tradiciones peruanas»"),
];

// --- Figuras literarias ---------------------------------------------------------

const FIGURES_1 = ["Eufemismo", "Hipérbole", "Oxímoron", "Paradoja"];
const fig1 = sorter(FIGURES_1, "¿Qué figura literaria hay en la oración?");
const FIGURE_ITEMS_1: ChoiceItem[] = [
  fig1("Lo despidieron por «reestructuración de personal».", 0),
  fig1("Es una persona con capacidades diferentes.", 0),
  fig1("Esta clase dura una eternidad.", 1),
  fig1("Lloró un océano de lágrimas.", 1),
  fig1("Se escuchaba un silencio ensordecedor.", 2),
  fig1("Fue una victoria amarga.", 2),
  fig1("El que pierde su vida la gana.", 3),
  fig1("Quien mucho abarca poco aprieta.", 3),
];
const FIGURES_2 = ["Anáfora", "Antítesis", "Apóstrofe", "Aliteración", "Quiasmo", "Lítote"];
const fig2 = sorter(FIGURES_2, "¿Qué figura literaria hay en el texto?");
const FIGURE_ITEMS_2: ChoiceItem[] = [
  fig2("Hay golpes en la vida, tan fuertes… / Golpes como del odio de Dios.", 0),
  fig2("Por ti la tierra florece, por ti el río canta, por ti vuelve la lluvia.", 0),
  fig2("Es tan corto el amor y tan largo el olvido.", 1),
  fig2("Ayer naciste y morirás mañana.", 1),
  fig2("¡Oh, río Rímac, testigo de mi infancia, devuélveme mis tardes!", 2),
  fig2("Cordillera, escucha a tus hijos que vuelven.", 2),
  fig2("El ruido con que rueda la ronca tempestad.", 3),
  fig2("Bajo el ala aleve del leve abanico.", 3),
  fig2("Ni son todos los que están, ni están todos los que son.", 4),
  fig2("Comer para vivir, no vivir para comer.", 4),
  fig2("No es precisamente un genio en matemáticas.", 5),
  fig2("El examen no estuvo nada fácil.", 5),
];
const FIGURE_EFFECT: ChoiceItem[] = [
  pt("¿Qué efecto tiene la figura en el texto?", "«Por ti la tierra florece, por ti el río canta, por ti vuelve la lluvia.»", "La repetición de «por ti» intensifica la gratitud hacia el ser amado.", "Informa sobre el clima de la región.", "Informa sobre el clima de la región y la llegada de la temporada de lluvias en los Andes."),
  pt("¿Qué efecto tiene la figura en el texto?", "«Es tan corto el amor y tan largo el olvido.»", "La oposición resalta el dolor de una pérdida.", "Explica la duración de una relación.", "Explica cuánto tiempo dura una relación amorosa y cuánto tarda en olvidarse."),
  pt("¿Qué efecto tiene la figura en el texto?", "«No es precisamente un genio en matemáticas.»", "Suaviza una crítica diciendo lo contrario de forma atenuada.", "Elogia su talento para los números.", "Elogia su talento para los números y su facilidad para las matemáticas."),
  pt("¿Qué efecto tiene la figura en el texto?", "«¡Oh, río Rímac, devuélveme mis tardes!»", "Al hablarle al río, expresa con intensidad la nostalgia del hablante.", "Describe el caudal del río en verano y los peligros de bañarse en sus aguas turbias.", "Describe el caudal del río en verano."),
];

// --- Lectura atenta: textos literarios -------------------------------------------

const NARRATOR = sorter(["Primera persona", "Tercera persona omnisciente", "Tercera persona limitada", "Segunda persona"], "¿Qué tipo de narrador tiene el fragmento?");
const NARRATOR_ITEMS: ChoiceItem[] = [
  NARRATOR("Nunca supe por qué mi padre guardó esa carta durante cuarenta años.", 0),
  NARRATOR("El juez temía perder su puesto; el acusado, su libertad; y la madre, que esperaba afuera, solo pensaba en su hijo.", 1),
  NARRATOR("Elena entró a la casa vacía. Algo había cambiado, pero no sabía qué.", 2),
  NARRATOR("Cruzas el puente colgante y sientes que el río te llama desde abajo.", 3),
  NARRATOR("Confieso que aquella noche tuve miedo, aunque nunca se lo dije a nadie.", 0),
  NARRATOR("Ninguno de los tres sabía lo que pensaban los otros: Julia sospechaba, Ramón callaba y el viejo, en su silla, lo entendía todo.", 1),
];
const CHARACTERS = [
  read("El capataz", "🌾", "Durante veinte años, Anselmo fue el capataz más temido de la hacienda. Cobraba multas, castigaba a los peones y obedecía sin preguntar. Cuando la hacienda pasó a manos de la cooperativa, nadie quiso trabajar con él. Solo, en su casa, Anselmo empezó a recordar los nombres de cada peón que había castigado. Un día se presentó en la asamblea, pidió perdón en voz baja y se ofreció a enseñar a los jóvenes a reparar los canales.",
    ["¿Cómo evoluciona Anselmo?", "De capataz cruel a hombre arrepentido que busca reparar", "De peón a hacendado", "De peón humilde a hacendado poderoso que compra las tierras de la cooperativa"],
    ["¿Qué provoca su cambio?", "La soledad y el recuerdo del daño causado", "Una orden de la cooperativa", "Una herencia que recibió de un pariente en la ciudad"],
    ["¿Qué sugiere su ofrecimiento final?", "Que busca reparar el daño sirviendo a la comunidad.", "Que quiere volver a ser capataz.", "Que quiere recuperar su puesto de capataz en la nueva cooperativa."]),
  read("La campeona", "🏃‍♀️", "Gladys ganaba todas las carreras del colegio y no saludaba a nadie. Corría sola, entrenaba sola y celebraba sola. En la final regional se lesionó el tobillo a mitad de la pista. Fueron sus rivales del colegio quienes la ayudaron a cruzar la meta. Al año siguiente, Gladys no corrió: entrenó al equipo de las más pequeñas.",
    ["¿Cómo cambia Gladys?", "Del individualismo a la solidaridad", "De la solidaridad al egoísmo", "De la solidaridad con sus compañeras al egoísmo total"],
    ["¿Qué hecho provoca el cambio?", "La ayuda de sus rivales tras la lesión", "Ganar la final", "Una sanción de su entrenador por faltar a los entrenamientos"],
    ["¿Qué revela su decisión final?", "Que ahora valora el equipo y la enseñanza.", "Que dejó el deporte por miedo.", "Que la lesión le impidió volver a correr y por eso dejó el deporte."]),
];
const CRAFT: ChoiceItem[] = [
  pt("¿Qué recurso de estructura usa el autor?", "La novela alterna capítulos narrados por la madre y por el hijo.", "Varios narradores y puntos de vista alternados", "Un único narrador omnisciente", "Un único narrador omnisciente que conoce los pensamientos de todos"),
  pt("¿Qué recurso de estructura usa el autor?", "El cuento comienza con el funeral del protagonista y luego cuenta su vida.", "Comienza por el final y retrocede (estructura circular o retrospectiva)", "Sigue un orden cronológico lineal", "Un final abierto que no explica qué pasó con el protagonista ni con su familia"),
  pt("¿Qué recurso de estructura usa el autor?", "En medio del relato, aparece la carta completa que el abuelo escribió en 1950.", "Inserta un documento dentro de la narración", "Usa una anticipación del futuro", "Cambia de narrador a segunda persona"),
  pt("¿Qué recurso de estructura usa el autor?", "El narrador anuncia en la primera página que el pueblo desaparecerá bajo el agua de la represa.", "Una anticipación (prolepsis)", "Una retrospección (analepsis)", "Un diálogo teatral"),
];

// --- Lectura atenta: textos informativos ---------------------------------------

const WORD_CHOICE: ChoiceItem[] = [
  pt("¿Qué efecto tiene la palabra «saqueo» en la oración?", "«El saqueo de los recursos dejó al país endeudado.»", "Presenta la explotación como un robo y la critica con dureza.", "Describe de forma neutral la venta de recursos.", "Elogia la habilidad de los comerciantes de la época."),
  pt("¿Qué efecto tiene la palabra «héroes» en la oración?", "«Los héroes de la salud trabajaron durante la pandemia.»", "Exalta el sacrificio del personal de salud.", "Indica que eran militares.", "Critica su trabajo durante la pandemia."),
  pt("¿Qué efecto tiene la palabra «invadieron» en la oración?", "«Los migrantes invadieron los cerros de la ciudad.»", "Sugiere una ocupación ilegítima y tiene una carga negativa.", "Es neutral y solo informa el lugar donde se instalaron.", "Elogia la valentía de los migrantes."),
  pt("¿Qué efecto tiene la palabra «apenas» en la oración?", "«El Estado invirtió apenas el 3 % en educación.»", "Sugiere que la inversión fue insuficiente.", "Indica que la inversión fue enorme.", "No cambia el sentido de la oración."),
];
const INFO_CRAFT = [
  read("¿Por qué el Perú tiene tantos climas?", "🌡️", "El Perú está en la zona tropical, pero en su territorio hay desiertos, glaciares y selvas. ¿Cómo es posible? Intervienen tres factores. La cordillera de los Andes crea pisos de altitud con temperaturas muy distintas. La corriente de Humboldt enfría el mar y la costa, lo que impide las lluvias. Y la Amazonía, húmeda y cálida, recibe la humedad del Atlántico. El resultado es uno de los países con más climas del mundo.",
    ["¿Cómo está organizado el texto?", "Plantea una pregunta y la responde con tres factores.", "Narra un viaje por la costa.", "Compara el clima del Perú con el de Chile y el de Ecuador, sus países vecinos."],
    ["¿Qué función cumple la pregunta «¿Cómo es posible?»?", "Despierta la curiosidad y anuncia la explicación.", "Expresa una duda del autor que nunca se resuelve en el texto.", "Pide la opinión del lector."],
    ["¿Qué función cumple la última oración?", "Sintetiza la consecuencia de los tres factores.", "Presenta un cuarto factor: la deforestación de la Amazonía.", "Cambia de tema y habla de turismo."]),
  read("Dos modelos de ciudad", "🏙️", "Algunas ciudades crecen hacia afuera: ocupan nuevos terrenos en las afueras y obligan a viajar largas distancias. Otras crecen hacia arriba: construyen edificios en zonas ya urbanizadas, lo que acerca a las personas a sus trabajos, pero exige buenos servicios de agua y desagüe. Lima ha seguido sobre todo el primer modelo, y hoy muchos limeños pasan más de tres horas al día en el transporte.",
    ["¿Qué estructura usa el texto?", "Comparación y contraste entre dos modelos", "Secuencia de pasos para construir un edificio en Lima", "Causa y efecto de un terremoto"],
    ["¿Qué ejemplo concreta la comparación?", "El caso de Lima y su transporte", "Una ciudad europea", "Los edificios de Miraflores y San Isidro"],
    ["¿Qué sugiere la última oración?", "Que el modelo elegido tiene costos para la vida diaria.", "Que todos los limeños deberían mudarse al campo para evitar el tráfico.", "Que todos deberían vivir en el campo."]),
];

// --- Cuentos ------------------------------------------------------------------------

const STORIES_1 = [
  read("La radio de la abuela", "📻", "La abuela Eusebia escuchaba la radio en quechua todas las madrugadas, mientras pelaba habas. Cuando murió, nadie quiso quedarse con el aparato viejo. Su nieta Rocío lo llevó a Lima sin saber por qué. Años después, ya periodista, fundó un programa de radio en quechua para los migrantes de la ciudad. El primer día, antes de hablar, encendió la vieja radio y la dejó sonar en el estudio.",
    ["¿Qué simboliza la radio?", "La herencia cultural de la abuela", "El avance de la tecnología", "El avance de la tecnología en las comunidades rurales"],
    ["¿Qué une el pasado y el presente del cuento?", "El programa en quechua continúa lo que la abuela escuchaba.", "Rocío vuelve al pueblo para vivir con su familia y trabajar en la chacra de su abuela.", "La radio se malogra al llegar a Lima."],
    ["¿Qué tema desarrolla el cuento?", "La continuidad de la memoria cultural", "El éxito profesional", "La migración como pérdida total de la identidad"]),
  read("La prueba", "📝", "Julio encontró en el pasillo las respuestas del examen final. Nadie lo vio. Pasó la noche sin dormir, mirando el sobre sobre la mesa. A la mañana siguiente lo entregó en la dirección sin abrirlo. Sacó catorce. Su compañero, que había copiado de otro lado, sacó veinte. Julio no dijo nada. Pero esa tarde, por primera vez en mucho tiempo, durmió tranquilo.",
    ["¿Qué conflicto enfrenta Julio?", "Un dilema moral entre hacer trampa o ser honesto", "La falta de tiempo para estudiar todos los cursos antes del examen final", "La falta de tiempo para estudiar"],
    ["¿Qué contraste plantea el desenlace?", "La nota más baja frente a la conciencia tranquila", "El éxito de su compañero frente al fracaso escolar de Julio en todo el año", "La amistad y la traición"],
    ["¿Cuál es el tema?", "El valor de la integridad", "La injusticia de los exámenes", "El sueño"]),
];
const STORIES_2 = [
  read("El huaico", "🌊", "Esa noche el río bajó con piedras grandes como casas. Doña Rosaura despertó a los vecinos golpeando ollas y nadie murió, aunque el agua se llevó la mitad del pueblo. En las semanas siguientes llegaron cámaras, autoridades y promesas. Luego se fueron todos. Fue doña Rosaura, otra vez, quien organizó las faenas para reconstruir el puente con las propias manos de la comunidad.",
    ["¿Qué critica implícitamente el cuento?", "La ausencia de las autoridades después de la emergencia", "La valentía de doña Rosaura", "El trabajo comunal, que considera inútil frente a la ayuda del Estado"],
    ["¿Qué rasgo define a doña Rosaura?", "Su liderazgo y solidaridad", "Su miedo", "Su deseo de salir en televisión"],
    ["¿Qué muestra la repetición «otra vez»?", "Que la comunidad depende de su propio esfuerzo.", "Que doña Rosaura se equivoca siempre.", "Que el huaico se repitió esa misma noche dos veces."]),
  read("El retrato", "🖼️", "El pintor del pueblo hizo el retrato del alcalde tal como era: con su barriga, su mirada cansada y su anillo de oro. El alcalde se ofendió y mandó guardarlo en un depósito. Años más tarde, cuando nadie recordaba sus obras, el retrato fue encontrado y expuesto en la municipalidad. La gente se detenía a mirarlo: era lo único verdadero que quedaba de aquel gobierno.",
    ["¿Por qué se ofendió el alcalde?", "Porque el retrato lo mostraba sin adornos", "Porque el pintor cobró mucho", "Porque el retrato era de otra persona"],
    ["¿Qué ironía contiene el final?", "Lo que el alcalde escondió es lo único que queda de su gobierno.", "El alcalde, arrepentido, encargó un nuevo retrato con adornos y lo colgó en la plaza.", "El retrato fue destruido por la humedad del depósito."],
    ["¿Qué tema propone el cuento?", "La verdad del arte frente a la vanidad del poder", "La pintura al óleo", "La pintura al óleo como técnica difícil de aprender en los pueblos"]),
];

// --- Poesía peruana -----------------------------------------------------------------

const POETRY: ChoiceItem[] = [
  pt("¿Qué recurso predomina en estos versos de César Vallejo?", "«Hay golpes en la vida, tan fuertes… ¡Yo no sé! / Golpes como del odio de Dios»", "La anáfora y la comparación para expresar un dolor inmenso", "La rima consonante para crear un tono alegre", "La descripción objetiva de un paisaje andino al amanecer, con sus colores y sonidos"),
  pt("¿Qué tipo de rima tienen estos versos de José Santos Chocano?", "«Soy el cantor de América autóctono y salvaje: / mi lira tiene un alma, mi canto un ideal. / Mi verso no se mece colgado de un ramaje / con un vaivén pausado de hamaca tropical.»", "Rima consonante alterna (ABAB)", "Verso libre sin rima", "Rima asonante en los versos pares"),
  pt("¿Qué ambiente crea José María Eguren en estos versos?", "«En el pasadizo nebuloso / cual mágico sueño de Estambul, / su perfil presenta destellos / la niña de la lámpara azul.»", "Un ambiente misterioso y de ensueño", "Un ambiente festivo, ruidoso y lleno de gente en la calle", "Un ambiente científico y objetivo"),
  w("¿Qué caracteriza a la poesía vanguardista de «Trilce» (1922), de Vallejo?", "La ruptura con la métrica y el lenguaje tradicionales", "La rima perfecta y los temas heroicos", "Las descripciones del mar y de los barcos que llegaban al puerto del Callao"),
  w("¿Cómo se llama el verso de once sílabas, el más usado en el soneto?", "Endecasílabo", "Octosílabo", "Alejandrino"),
  w("¿Cómo se llama el verso de catorce sílabas, usado por los modernistas como Chocano?", "Alejandrino", "Endecasílabo", "Heptasílabo"),
  w("¿Qué es el «yo poético»?", "La voz que habla en el poema, que no siempre es el autor", "El nombre del poeta", "El nombre completo del poeta que firma el libro y su lugar de nacimiento"),
  w("¿Qué movimiento literario representa José Santos Chocano?", "El modernismo", "El romanticismo", "El vanguardismo"),
];

export const ROWS: Row[] = [
  ["ideas-principales-1", (r) => readPassage(r, MAIN, false)],
  ["ideas-principales-2", (r) => readPassage(r, MULTI, false)],
  ["temas", (r) => readPassage(r, THEMES, false)],
  ["proposito-1", (r) => choose(r, "", AUDIENCE)],
  ["proposito-2", (r) => choose(r, "", PERSPECTIVE)],
  ["tono-1", (r) => choose(r, "", FORMAL)],
  ["tono-2", (r) => choose(r, "", OBJECTIVE_ITEMS)],
  ["tono-3", (r) => choose(r, "", TONE)],
  ["alusiones-1", (r) => choose(r, "", ALLUSION)],
  ["alusiones-2", (r) => choose(r, "", ALLUSION_SOURCE)],
  ["figuras-1", (r) => choose(r, "", FIGURE_ITEMS_1)],
  ["figuras-2", (r) => choose(r, "", FIGURE_ITEMS_2)],
  ["figuras-3", (r) => choose(r, "", FIGURE_EFFECT)],
  ["literarios-1", (r) => choose(r, "", NARRATOR_ITEMS)],
  ["literarios-2", (r) => readPassage(r, CHARACTERS, false)],
  ["literarios-3", (r) => choose(r, "", CRAFT)],
  ["informativos-atenta-1", (r) => choose(r, "", WORD_CHOICE)],
  ["informativos-atenta-2", (r) => readPassage(r, INFO_CRAFT, false)],
  ["cuentos-1", (r) => readPassage(r, STORIES_1, false)],
  ["cuentos-2", (r) => readPassage(r, STORIES_2, false)],
  ["poesia", (r) => choose(r, "", POETRY)],
];
