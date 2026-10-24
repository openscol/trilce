import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 2.° de Secundaria · banco de escritura: organizar las ideas, tesis,
// evidencias y contraargumentos, apelaciones y falacias, conectores (no
// obstante, por consiguiente, asimismo, es decir), voz activa, voz pasiva
// (ser + participio) y pasiva refleja (se + verbo), corrección (haber / a ver,
// hay / ahí / ay, aparte / a parte, demás / de más; queísmo, «habemos»,
// «cónyugue») e investigación con referencias APA.


// --- Organizar la escritura -----------------------------------------------

const BROAD_NARROW: OrderItem[] = [
  { seq: ["artes", "artes visuales", "pintura", "pintura peruana", "la obra de José Sabogal"] }, { seq: ["ciencias sociales", "historia", "historia republicana", "la guerra del Pacífico", "el combate de Angamos"] },
  { seq: ["planeta Tierra", "océanos", "océano Pacífico", "mar peruano", "la corriente de Humboldt"] }, { seq: ["salud", "enfermedades", "enfermedades nutricionales", "anemia", "anemia infantil en la sierra"] },
  { seq: ["literatura", "narrativa", "novela", "novela indigenista", "«El mundo es ancho y ajeno»"] }, { seq: ["tecnología", "informática", "inteligencia artificial", "chatbots", "uso de chatbots en el colegio"] },
  { seq: ["deporte", "deportes de equipo", "vóley", "vóley femenino peruano", "la final de Seúl 1988"] }, { seq: ["economía", "agricultura", "agroexportación", "frutas", "la palta Hass"] },
];
const BY_TOPIC: ChoiceItem[] = [
  pt("Preparas un informe sobre la minería ilegal. ¿En qué sección va este dato?", "«El mercurio contamina los peces que comen las comunidades».", "Consecuencias", "Causas", "Soluciones"), pt("Preparas un informe sobre la minería ilegal. ¿En qué sección va este dato?", "«El alto precio del oro hace rentable la extracción informal».", "Causas", "Consecuencias", "Soluciones"),
  pt("Preparas un informe sobre la minería ilegal. ¿En qué sección va este dato?", "«Formalizar a los mineros y controlar la venta de mercurio».", "Soluciones", "Causas", "Consecuencias"), pt("Escribes una biografía de Chabuca Granda. ¿En qué sección va este dato?", "«De niña vivió en una casa de Barranco».", "Infancia", "Obra", "Legado"),
  pt("Escribes una reseña de una película. ¿En qué sección va este dato?", "«La fotografía del desierto es impresionante».", "Valoración", "Sinopsis", "Ficha técnica"), pt("Escribes una reseña de una película. ¿En qué sección va este dato?", "«Dirección: Claudia Llosa. Año: 2009».", "Ficha técnica", "Valoración", "Sinopsis"),
  pt("Escribes sobre Iquitos. ¿En qué sección va este dato?", "«Solo se llega por avión o por el río».", "Geografía y acceso", "Gastronomía", "Fiestas"), pt("Escribes sobre Iquitos. ¿En qué sección va este dato?", "«El 24 de junio se celebra la fiesta de San Juan».", "Fiestas", "Geografía y acceso", "Gastronomía"),
];
const NOT = "¿Qué oración no pertenece al párrafo?";
const NOT_BELONG: ChoiceItem[] = [
  pt(NOT, "(1) Caral es la ciudad más antigua de América. (2) Tiene unos cinco mil años. (3) Lima tiene muchos centros comerciales. (4) Sus pirámides se construyeron con piedra y bolsas de fibra.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) La anchoveta es la base de la pesca peruana. (2) Se usa para fabricar harina de pescado. (3) El atún es un pez muy rápido. (4) También es rica en omega 3.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) Las abejas polinizan los cultivos. (2) Sin ellas, muchas frutas no se formarían. (3) Los pesticidas las están matando. (4) Las mariposas son coloridas.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) El debate exige preparación. (2) Hay que investigar ambas posturas. (3) También conviene ensayar los argumentos. (4) Mi primo ganó un concurso de canto.", "La oración 4", "La oración 1", "La oración 3"),
  pt(NOT, "(1) El Qhapaq Ñan unía el imperio inca. (2) Medía miles de kilómetros. (3) Los chasquis corrían por él. (4) Hoy se viaja en avión de Lima a Cusco.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) Dormir bien mejora el humor. (2) La falta de sueño causa irritabilidad. (3) Las camas de dos plazas son caras. (4) Por eso los adolescentes necesitan descansar.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) Raimondi recorrió el Perú. (2) Anotaba datos de plantas y minerales. (3) Italia tiene forma de bota. (4) Publicó la obra «El Perú».", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) Las lomas florecen en invierno. (2) Dependen de la neblina. (3) En verano hace calor en la playa. (4) Albergan especies únicas.", "La oración 3", "La oración 2", "La oración 4"),
];
const TOPIC = "¿Qué oración temática resume mejor la idea principal del párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Permite que los alumnos de zonas rurales accedan a clases, bibliotecas digitales y tutorías que antes no tenían. Sin embargo, sin conectividad ni dispositivos, esa promesa no llega a todos.", "Internet puede reducir la brecha educativa, pero solo si llega a todos.", "Internet es una red mundial de computadoras conectadas entre sí desde los años noventa.", "Hay internet."),
  pt(TOPIC, "___ El huaino canta el amor y la migración; la marinera, el cortejo; el festejo, la memoria afroperuana.", "La música peruana expresa la diversidad de sus pueblos.", "La marinera es un baile en pareja que se baila con un pañuelo en la mano.", "Hay música."),
  pt(TOPIC, "___ Primero recolectó semillas nativas. Luego las probó en distintas alturas. Después de diez años, obtuvo una papa resistente a las heladas.", "El agrónomo desarrolló una papa resistente tras un largo proceso.", "El agrónomo recolectó semillas nativas en varias comunidades de la sierra.", "Hay papas."),
  pt(TOPIC, "___ Los jóvenes se informan por videos cortos, los adultos por la televisión y los mayores, todavía, por la radio.", "Cada generación se informa de manera distinta.", "La radio es un medio muy antiguo que se inventó a fines del siglo XIX.", "Hay medios."),
  pt(TOPIC, "___ Reduce el estrés, mejora el sueño y fortalece el corazón. Además, se puede practicar a cualquier edad.", "Caminar a diario trae múltiples beneficios.", "Caminar es una actividad que la mayoría de personas hace todos los días.", "Caminar cansa."),
  pt(TOPIC, "___ Su clima seco conservó tejidos de dos mil años; sus vientos, en cambio, borraron ciudades enteras de adobe.", "El desierto costero ha protegido y destruido el patrimonio a la vez.", "Los tejidos de Paracas tienen colores muy vivos y diseños de animales marinos.", "El desierto es seco."),
];

// --- Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (juicio personal)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["El lago Titicaca está a más de 3800 metros de altitud.", "José María Arguedas escribió «Los ríos profundos».", "El Perú tiene más de cuarenta lenguas originarias.", "La selección peruana de vóley fue subcampeona olímpica en 1988.", "El quechua es lengua oficial en las zonas donde predomina.", "La papa tiene miles de variedades en el Perú."].map((x) => FO(x, 0)),
  ...["«Los ríos profundos» es la mejor novela peruana.", "El vóley es más emocionante que el fútbol.", "Lima es la ciudad más fea de Sudamérica.", "La música criolla es aburrida.", "Ningún plato supera al cebiche.", "Los jóvenes de hoy leen menos que antes, y eso es lamentable."].map((x) => FO(x, 1)),
];
const THESIS = "¿Qué oración es la mejor tesis para un ensayo argumentativo?";
const THESES: ChoiceItem[] = [
  w(THESIS, "El Estado debe garantizar internet en las escuelas rurales, porque sin conexión la desigualdad educativa crecerá.", "Internet llegó al Perú en los años noventa y hoy lo usan millones de personas en sus celulares, computadoras y televisores.", "¿Qué es internet?"),
  w(THESIS, "Los museos deberían ser gratuitos para escolares, ya que el acceso al patrimonio forma ciudadanos.", "En Lima hay muchos museos, como el Museo Larco, el MALI y el Museo Nacional de Arqueología, Antropología e Historia.", "Los museos son bonitos."),
  w(THESIS, "Prohibir los descartables en las playas es necesario para proteger la vida marina.", "Las playas del Perú se llenan de bañistas en verano, sobre todo los fines de semana y durante los feriados largos.", "Me gusta la playa."),
  w(THESIS, "La educación física debería tener más horas, porque mejora la salud y el rendimiento académico.", "En mi colegio tenemos educación física dos veces por semana, los martes y los jueves después del recreo largo.", "El deporte es deporte."),
  w(THESIS, "Las lenguas originarias deben enseñarse en todos los colegios del país para preservar la diversidad cultural.", "En el Perú se hablan el quechua, el aimara, el asháninka, el awajún, el shipibo-konibo y muchas otras lenguas.", "Hay muchas lenguas."),
  w(THESIS, "La venta de comida chatarra cerca de los colegios debería regularse para combatir la obesidad infantil.", "Cerca de mi colegio hay tres tiendas que venden galletas, gaseosas, chocolates y papitas fritas en bolsa.", "La comida es rica."),
];
const EVIDENCE: ChoiceItem[] = [
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: La lectura diaria mejora el vocabulario.", "Un estudio mostró que los alumnos que leen 20 minutos al día conocen más palabras.", "Mi hermana lee todas las noches antes de dormir, aunque a veces se queda dormida con el libro en la mano.", "Leer es bonito."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Los glaciares peruanos retroceden.", "El Inaigem registró una pérdida de más de la mitad de su superficie desde 1962.", "El nevado Pastoruri es un destino turístico muy visitado por familias de Lima durante las vacaciones.", "Hace frío."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El ruido afecta la concentración.", "En una prueba, los alumnos rindieron menos en un aula con ruido de tráfico.", "Las bocinas de los autos suenan muy fuerte en las avenidas principales de la ciudad, sobre todo en hora punta.", "El ruido molesta."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Las áreas protegidas conservan especies.", "En la Reserva de Pampa Galeras, la población de vicuñas se multiplicó tras prohibirse la caza.", "Las vicuñas son animales muy bonitos que viven en la puna y tienen el pelaje de color canela.", "Hay vicuñas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Usar casco en bicicleta reduce lesiones graves.", "Estudios médicos muestran menos lesiones cerebrales en ciclistas con casco.", "En muchas tiendas de la ciudad venden cascos de colores, con luces y con diseños de superhéroes.", "Las bicicletas son rápidas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El turismo genera empleo en Cusco.", "Según cifras oficiales, miles de cusqueños trabajan en hoteles, restaurantes y transporte turístico.", "Cusco es una ciudad muy bonita, con calles empedradas, iglesias coloniales y muros incas que todos admiran.", "Cusco es antiguo."),
];
const COUNTER = "¿Cuál es un contraargumento a la afirmación?";
const COUNTERCLAIMS: ChoiceItem[] = [
  pt(COUNTER, "«Los colegios deberían eliminar las tareas para la casa».", "Las tareas ayudan a reforzar lo aprendido y a crear hábitos de estudio.", "Sin tareas, los alumnos tendrían más tiempo para descansar, jugar, leer por gusto y compartir con su familia.", "Las tareas son tareas."),
  pt(COUNTER, "«El Estado debería subsidiar el transporte para estudiantes».", "Los subsidios cuestan dinero que podría usarse en otras necesidades urgentes.", "Muchos estudiantes gastan una parte importante del dinero de su familia en pasajes para llegar al colegio.", "Los buses son azules."),
  pt(COUNTER, "«Los celulares deberían prohibirse en el colegio».", "El celular, bien usado, es una herramienta de investigación y aprendizaje.", "Los celulares distraen a los alumnos durante las clases y facilitan que copien en los exámenes escritos.", "Los celulares tienen cámara."),
  pt(COUNTER, "«Las corridas de toros deberían prohibirse».", "Para algunos pueblos son una tradición cultural muy antigua.", "Los toros sufren durante las corridas y muchas personas consideran que es un espectáculo cruel e innecesario.", "Los toros son grandes."),
  pt(COUNTER, "«La minería es la mejor vía para el desarrollo del país».", "La minería mal regulada contamina ríos y afecta la agricultura.", "La minería aporta una gran parte de las exportaciones y de los impuestos que recibe el Estado cada año.", "Hay minas."),
  pt(COUNTER, "«El voto debería ser voluntario».", "Con voto voluntario, muchos sectores podrían quedar sin representación.", "Obligar a votar a quien no quiere hacerlo es una forma de limitar la libertad de los ciudadanos.", "Las elecciones son en domingo."),
];
const APPEAL = sorter(["Ethos (credibilidad)", "Pathos (emoción)", "Logos (lógica y datos)"], "¿A qué apela el anuncio?");
const APPEALS: ChoiceItem[] = [
  ...["«La pasta dental que usan los dentistas del Perú».", "«Avalado por el Ministerio de Salud».", "«Desde 1950, la marca en la que confían las familias».", "«Nuestra campeona mundial de surf solo usa este bloqueador»."].map((x) => APPEAL(x, 0)),
  ...["«Porque tu familia merece volver a casa sana y salva».", "«Regálale a mamá el abrazo que no le diste».", "«Un perrito te espera para darte amor incondicional».", "«Siente otra vez la emoción de tu primer gol»."].map((x) => APPEAL(x, 1)),
  ...["«Consume 30 % menos combustible que la competencia».", "«Ocho de cada diez clientes renovaron su plan».", "«Carga completa en solo 20 minutos».", "«Precio por kilo: el más bajo del mercado»."].map((x) => APPEAL(x, 2)),
];
const FALLACY = sorter(["Ataque personal", "Generalización apresurada", "Falso dilema", "Pendiente resbaladiza", "Apelación a la autoridad irrelevante"], "¿Qué falacia contiene el argumento?");
const FALLACIES: ChoiceItem[] = [
  ...["Su propuesta de reciclaje no vale nada: él mismo llega tarde siempre.", "No le creas sobre economía; ni siquiera terminó el colegio."].map((x) => FALLACY(x, 0)),
  ...["Probé dos platos en ese restaurante y estaban fríos: toda la comida de esa ciudad es mala.", "Un chofer de combi me trató mal; todos los choferes son groseros."].map((x) => FALLACY(x, 1)),
  ...["O estás con nosotros o estás contra nosotros.", "O cerramos la mina o el río morirá."].map((x) => FALLACY(x, 2)),
  ...["Si permitimos celulares en recreo, luego los usarán en clase, después en los exámenes y al final nadie aprenderá nada.", "Si hoy faltas a una clase, mañana faltarás a todas y terminarás sin profesión."].map((x) => FALLACY(x, 3)),
  ...["Un famoso futbolista dice que este banco es el mejor; por eso debe serlo.", "La actriz de la novela recomienda este jarabe para la tos."].map((x) => FALLACY(x, 4)),
];

// --- Estilo -----------------------------------------------------------------

const PERSON = "¿Qué oración usa la personificación?";
const PERSONIFICATION: ChoiceItem[] = [
  w(PERSON, "La ciudad tosía humo por sus chimeneas.", "La ciudad tenía muchas fábricas con chimeneas que soltaban humo negro.", "Hay humo."), w(PERSON, "El mar mordía la orilla con rabia.", "Las olas del mar golpeaban la orilla con mucha fuerza aquella tarde.", "El mar."),
  w(PERSON, "La vieja casona suspiraba con cada ráfaga.", "La vieja casona tenía ventanas rotas por donde entraba el viento frío.", "Sopla."), w(PERSON, "El sol se despidió detrás de los cerros.", "El sol se ocultó detrás de los cerros a las seis y cuarto de la tarde.", "Anochece."),
  w(PERSON, "La lluvia tamborileaba impaciente en el techo.", "La lluvia caía con fuerza sobre el techo de calamina de la casa.", "Llueve."), w(PERSON, "Los libros esperaban en silencio a sus lectores.", "Los libros estaban ordenados en los estantes de la biblioteca del colegio.", "Hay libros."),
  w(PERSON, "El hambre recorría las calles del pueblo.", "En el pueblo había muchas familias que no tenían qué comer.", "Tenían hambre."), w(PERSON, "La montaña se cubrió el rostro con nubes.", "La montaña quedó cubierta por nubes espesas durante toda la mañana.", "Hay nubes."),
];
const VARIED: ChoiceItem[] = [
  pt("¿Qué oración sigue el modelo?", "Modelo: «Agotado por el viaje, el abuelo se quedó dormido».", "Emocionada por la noticia, la niña corrió a casa.", "La niña corrió a casa porque estaba emocionada por la noticia que recibió.", "Corrió."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Si estudias con constancia, aprobarás el curso».", "Si ahorras cada mes, comprarás la bicicleta.", "Ahorrar cada mes es importante para comprar cosas como una bicicleta nueva.", "Ahorra."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Llegó, miró, se fue».", "Habló, convenció, ganó.", "Habló durante una hora y al final convenció al jurado y ganó el concurso.", "Ganó."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Cuanto más leía, más preguntas tenía».", "Cuanto más practicaba, mejor tocaba.", "Practicaba mucho todos los días para tocar mejor el charango en la fiesta.", "Tocaba."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «No por mucho madrugar amanece más temprano».", "No por mucho gritar tendrás más razón.", "Gritar mucho no sirve para tener la razón en una discusión con tus amigos.", "Grita."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Tan pronto como sonó el timbre, salimos corriendo».", "Tan pronto como dejó de llover, salimos al patio.", "Salimos al patio después de que dejó de llover y el sol volvió a salir.", "Salimos."),
];
const STRONG = "¿Qué verbo hace más precisa la oración?";
const STRONG_VERB: ChoiceItem[] = [
  pt(STRONG, "El público hizo mucho ruido al final del concierto.", "ovacionó", "estuvo", "se puso a hacer cosas"), pt(STRONG, "La niña lloró con mucha fuerza.", "sollozó", "hizo", "estuvo llorando un rato"),
  pt(STRONG, "El río se llevó con fuerza las casas.", "arrasó", "tuvo", "pasó por encima de"), pt(STRONG, "Comió despacio, saboreando cada bocado.", "degustó", "tomó", "estuvo comiendo algo"),
  pt(STRONG, "El perro corrió rápido hacia la puerta.", "se abalanzó", "fue", "estuvo yendo"), pt(STRONG, "Dijo con fuerza que era inocente.", "proclamó", "dijo", "estuvo diciendo bajito"),
  pt(STRONG, "Miró rápido el periódico.", "hojeó", "vio", "estuvo mirando mucho"), pt(STRONG, "Subió con dificultad la cuesta.", "trepó", "fue", "estuvo subiendo"),
];

// --- Evidencias -------------------------------------------------------------

const SUPPORT_INFO: ChoiceItem[] = [
  pt("¿Qué detalle apoya la idea principal?", "Idea: El Perú es un país megadiverso.", "Alberga más de 20 000 especies de plantas.", "Su capital, Lima, fue fundada por los españoles en el año 1535.", "Es grande."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: La anemia afecta el aprendizaje.", "Reduce la atención y la memoria de los niños.", "Se combate con alimentos como la sangrecita y las menestras de la sierra.", "Es una enfermedad."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: Los incas fueron grandes ingenieros.", "Construyeron puentes colgantes y caminos de miles de kilómetros.", "El último inca, Atahualpa, fue capturado por los españoles en Cajamarca.", "Eran incas."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: El plástico daña la vida marina.", "Las tortugas confunden las bolsas con medusas y se las comen.", "El plástico se inventó a comienzos del siglo XX y hoy está en todas partes.", "Hay plástico."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: La migración transformó Lima.", "Los migrantes andinos fundaron distritos enteros como Comas o Villa El Salvador.", "Lima tiene un clima húmedo y nublado durante gran parte del año.", "Lima es grande."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: La música mejora la memoria.", "Aprender un instrumento fortalece las conexiones del cerebro.", "La quena es un instrumento de viento hecho tradicionalmente de caña o de hueso.", "La música suena."),
];
const SUPPORT_LIT: ChoiceItem[] = [
  pt("¿Qué detalle muestra que Ana está nerviosa?", "Ana entró al examen. Se mordía las uñas y releía la misma pregunta una y otra vez.", "Se mordía las uñas y releía la pregunta.", "Entró al examen.", "El aula del examen era grande y tenía ventanas que daban al patio."),
  pt("¿Qué detalle muestra que el abuelo es humilde?", "El abuelo recibió el premio, agradeció en voz baja y dijo que era mérito de todo el pueblo.", "Dijo que el mérito era de todo el pueblo.", "Recibió el premio.", "El premio era una placa de bronce con su nombre grabado en letras grandes."),
  pt("¿Qué detalle muestra que Luis siente culpa?", "Luis no se atrevía a mirar a su hermano a los ojos y se ofreció a lavar los platos toda la semana.", "No se atrevía a mirarlo y se ofreció a lavar los platos.", "Tenía un hermano.", "En la casa de Luis había una cocina pequeña con un lavadero de metal."),
  pt("¿Qué detalle muestra que el pueblo está de fiesta?", "Las calles estaban adornadas con banderines; la banda tocaba y olía a chicharrón.", "Banderines, música de banda y olor a chicharrón", "Había calles.", "El pueblo quedaba a tres horas de la ciudad por una carretera afirmada."),
  pt("¿Qué detalle muestra que la madre está orgullosa?", "La madre guardó el diploma en una carpeta de plástico y se lo mostraba a cada vecino que llegaba.", "Se lo mostraba a cada vecino.", "Lo guardó.", "La carpeta era de plástico transparente y la había comprado en el mercado."),
  pt("¿Qué detalle muestra que Rosa es valiente?", "Cuando todos callaron, Rosa se levantó y denunció al compañero que robaba las loncheras.", "Se levantó y denunció al compañero.", "Todos callaron.", "Las loncheras de los alumnos eran de colores y tenían sus nombres escritos."),
];

// --- Claridad y concisión -----------------------------------------------------

const CONJ_ADV: ChoiceItem[] = [
  f("El proyecto era costoso; ___, fue aprobado.", "no obstante", "por consiguiente", "es decir"), f("El río se desbordó; ___, evacuaron a las familias.", "por consiguiente", "no obstante", "en cambio"),
  f("La costa es árida; la selva, ___, es lluviosa.", "en cambio", "asimismo", "por consiguiente"), f("Es un ave migratoria, ___, viaja cada año entre continentes.", "es decir", "no obstante", "en cambio"),
  f("El plan reduce costos; ___, mejora la calidad.", "asimismo", "no obstante", "en cambio"), f("No presentó el informe; ___, perdió la beca.", "en consecuencia", "asimismo", "es decir"),
  f("Tenía fiebre; ___, fue a rendir el examen.", "aun así", "por lo tanto", "es decir"), f("La lectura amplía el vocabulario; ___, mejora la escritura.", "además", "sin embargo", "en cambio"),
];
const PARA = "¿Qué oración tiene una estructura paralela?";
const PARALLEL: ChoiceItem[] = [
  w(PARA, "El curso enseña a investigar, a redactar y a exponer.", "El curso enseña a investigar, la redacción y exponiendo.", "El curso enseña investigar."), w(PARA, "Queremos un barrio limpio, seguro y verde.", "Queremos un barrio limpio, con seguridad y que tenga árboles verdes.", "Queremos un barrio."),
  w(PARA, "No solo trabaja, sino que también estudia.", "No solo trabaja, sino estudiando también por las noches en la universidad.", "Trabaja y estudia."), w(PARA, "Prefiero leer novelas a ver series.", "Prefiero leer novelas a que vea series de televisión en la plataforma.", "Prefiero leer."),
  w(PARA, "Fue elegida por su honestidad, su experiencia y su liderazgo.", "Fue elegida por honesta, su experiencia y porque sabe liderar a los demás.", "Fue elegida."), w(PARA, "Hay que planificar, redactar y revisar.", "Hay que planificar, la redacción y que se revise el texto final con cuidado.", "Hay que escribir."),
  w(PARA, "Viajamos de día, descansamos de tarde y cantamos de noche.", "Viajamos de día, la tarde para descansar y cantando de noche junto a la fogata.", "Viajamos."), w(PARA, "Tanto los padres como los maestros asistieron.", "Tanto los padres como que asistieron también los maestros del colegio.", "Asistieron."),
];
const REDUNDANT = "¿Qué versión elimina la redundancia?";
const REDUNDANCY: ChoiceItem[] = [
  pt(REDUNDANT, "Bajó abajo a la cocina por un vaso de agua.", "Bajó a la cocina por un vaso de agua.", "Bajó abajo, a la cocina de abajo, por un vaso de agua fría.", "Bajó."),
  pt(REDUNDANT, "Es un lapso de tiempo muy corto.", "Es un lapso muy corto.", "Es un lapso de tiempo muy corto y breve de duración.", "Es corto."),
  pt(REDUNDANT, "Me lo contó a mí personalmente.", "Me lo contó personalmente.", "Me lo contó a mí, personalmente y en persona, cara a cara.", "Me contó."),
  pt(REDUNDANT, "Fue un accidente fortuito que nadie esperaba.", "Fue un accidente que nadie esperaba.", "Fue un accidente fortuito, casual e inesperado que nadie esperaba.", "Accidente."),
  pt(REDUNDANT, "Tenemos que planificar con anticipación el viaje.", "Tenemos que planificar el viaje.", "Tenemos que planificar con anticipación previa el viaje de antemano.", "Planificar."),
  pt(REDUNDANT, "El resultado final fue un empate.", "El resultado fue un empate.", "El resultado final del final del partido fue un empate igualado.", "Empate."),
  pt(REDUNDANT, "Volvió a regresar a su pueblo natal.", "Regresó a su pueblo natal.", "Volvió a regresar otra vez de nuevo a su pueblo natal.", "Volvió."),
  pt(REDUNDANT, "Hubo un consenso general entre todos los delegados.", "Hubo consenso entre los delegados.", "Hubo un consenso general y unánime entre todos los delegados juntos.", "Consenso."),
];

// --- Voz activa y pasiva ------------------------------------------------------

const VOICE = sorter(["Voz activa", "Voz pasiva"], "¿La oración está en voz activa o en voz pasiva?");
const IDENTIFY_VOICE: ChoiceItem[] = [
  ...["Arguedas escribió «Los ríos profundos».", "Los vecinos limpiaron el parque.", "El huaico destruyó el puente.", "La profesora corrigió los exámenes.", "Ruth Shady estudió Caral.", "Los bomberos apagaron el incendio."].map((x) => VOICE(x, 0)),
  ...["«Los ríos profundos» fue escrita por Arguedas.", "El parque fue limpiado por los vecinos.", "El puente fue destruido por el huaico.", "Los exámenes fueron corregidos por la profesora.", "Se vendieron todas las entradas.", "Se inauguró la biblioteca el lunes."].map((x) => VOICE(x, 1)),
];
const ACTIVE = "¿Cómo queda la oración en voz activa?";
const TO_ACTIVE: ChoiceItem[] = [
  pt(ACTIVE, "El cebiche fue preparado por mi abuela.", "Mi abuela preparó el cebiche.", "El cebiche preparó a mi abuela.", "Mi abuela fue preparada por el cebiche."),
  pt(ACTIVE, "La carta fue enviada por el director.", "El director envió la carta.", "La carta envió al director.", "El director fue enviado por la carta."),
  pt(ACTIVE, "Los árboles fueron sembrados por los alumnos.", "Los alumnos sembraron los árboles.", "Los árboles sembraron a los alumnos.", "Los alumnos fueron sembrados."),
  pt(ACTIVE, "El partido fue ganado por el equipo de Tacna.", "El equipo de Tacna ganó el partido.", "El partido ganó al equipo de Tacna.", "Tacna fue ganada por el partido."),
  pt(ACTIVE, "La noticia fue publicada por el diario.", "El diario publicó la noticia.", "La noticia publicó el diario ayer.", "El diario fue publicado por la noticia."),
  pt(ACTIVE, "El mural será pintado por los artistas del barrio.", "Los artistas del barrio pintarán el mural.", "El mural pintará a los artistas del barrio.", "Los artistas serán pintados por el mural."),
  pt(ACTIVE, "Las Líneas de Nasca fueron estudiadas por María Reiche.", "María Reiche estudió las Líneas de Nasca.", "Las Líneas de Nasca estudiaron a María Reiche.", "María Reiche fue estudiada por las Líneas."),
  pt(ACTIVE, "El ladrón fue capturado por la policía.", "La policía capturó al ladrón.", "El ladrón capturó a la policía.", "La policía fue capturada por el ladrón."),
];

// --- Corregir y revisar -------------------------------------------------------

const CONFUSED_USE: ChoiceItem[] = [
  f("Vamos ___ si ya llegó el bus.", "a ver", "haber", "aver"), f("Debe ___ un error en la lista.", "haber", "a ver", "aber"),
  f("___ muchos alumnos en el patio.", "Hay", "Ahí", "Ay"), f("Deja la mochila ___, sobre la silla.", "ahí", "hay", "ay"),
  f("¡___, me duele la muela!", "Ay", "Hay", "Ahí"), f("Pon esos libros ___; los revisaré luego.", "aparte", "a parte", "apartes"),
  f("No iré ___ ninguna fiesta este fin de semana.", "a", "ha", "ah"), f("Ella ___ terminado su tarea.", "ha", "a", "ah"),
  f("Los ___ alumnos ya se fueron.", "demás", "de más", "dé más"), f("Pagaste diez soles ___ por el pasaje.", "de más", "demás", "demas"),
  f("Discutieron ___ al problema del agua.", "en torno", "entorno", "entornó"), f("El ___ natural del colegio es muy bonito.", "entorno", "en torno", "entornó"),
];
const CONFUSED_FIX: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Vamos a ver la película de estreno.", "Vamos haber la película de estreno.", "Vamos a haber la película de estreno."), w("¿Qué oración está bien escrita?", "Tiene que haber una solución.", "Tiene que a ver una solución.", "Tiene que aver una solución."),
  w("¿Qué oración está bien escrita?", "Ahí está el cuaderno que buscabas.", "Hay está el cuaderno que buscabas.", "Ay está el cuaderno que buscabas."), w("¿Qué oración está bien escrita?", "No hay agua desde la mañana.", "No ahí agua desde la mañana.", "No ay agua desde la mañana."),
  w("¿Qué oración está bien escrita?", "Aparte de estudiar, trabaja los fines de semana.", "A parte de estudiar, trabaja los fines de semana.", "Apartes de estudiar, trabaja los fines de semana."), w("¿Qué oración está bien escrita?", "Mi hermano ha viajado a Iquitos.", "Mi hermano a viajado a Iquitos.", "Mi hermano ah viajado a Iquitos."),
  w("¿Qué oración está bien escrita?", "Los demás se quedaron en el aula.", "Los de más se quedaron en el aula.", "Los dé más se quedaron en el aula."), w("¿Qué oración está bien escrita?", "Conversamos en torno a la fogata.", "Conversamos entorno a la fogata.", "Conversamos en-torno a la fogata."),
];
const SIGNS: ChoiceItem[] = [
  pt("¿Cómo se corrige el cartel?", "«SE PROIVE FUMAR»", "«SE PROHÍBE FUMAR»", "«SE PROHIVE FUMAR»", "«SE PROHÍVE FUMAR»"),
  pt("¿Cómo se corrige el cartel?", "«NO BOTAR VASURA»", "«NO BOTAR BASURA»", "«NO VOTAR BASURA»", "«NO BOTAR BAZURA»"),
  pt("¿Cómo se corrige el cartel?", "«SE NECESITA AYUDANTE DE COSINA»", "«SE NECESITA AYUDANTE DE COCINA»", "«SE NESECITA AYUDANTE DE COCINA»", "«SE NECESITA ALLUDANTE DE COCINA»"),
  pt("¿Cómo se corrige el cartel?", "«ESTACIONAMIENTO EXCLUSIBO»", "«ESTACIONAMIENTO EXCLUSIVO»", "«ESTASIONAMIENTO EXCLUSIVO»", "«ESTACIONAMIENTO ESCLUSIVO»"),
  pt("¿Cómo se corrige el cartel?", "«CUIDADO CON EL PERRO, MUERDE ACE DAÑO»", "«CUIDADO CON EL PERRO: MUERDE Y HACE DAÑO»", "«CUIDADO CON EL PERRO, MUERDE HACE DAÑO»", "«CUIDADO CON EL PERRO MUERDE Y ASE DAÑO»"),
  pt("¿Cómo se corrige el cartel?", "«VENDO TERRENO DE OCASIÓN CON VISTA AL MAR PARA FAMILIA»", "«VENDO TERRENO CON VISTA AL MAR, DE OCASIÓN»", "«VENDO FAMILIA CON VISTA AL MAR PARA TERRENO»", "«VENDO TERRENO PARA MAR CON VISTA A FAMILIA»"),
  pt("¿Cómo se corrige el cartel?", "«HORARIO DE ATENSIÓN: 8 A. M. A 6 P. M.»", "«HORARIO DE ATENCIÓN: 8 A. M. A 6 P. M.»", "«HORARIO DE ATENCIÓN: 8 A. M. HA 6 P. M.»", "«ORARIO DE ATENCIÓN: 8 A. M. A 6 P. M.»"),
  pt("¿Cómo se corrige el cartel?", "«SE ASEN LLAVES»", "«SE HACEN LLAVES»", "«SE HACEN YAVES»", "«SE ASEN YAVES»"),
];
const FIX = "¿Cómo se corrige la oración?";
const EVERYDAY: ChoiceItem[] = [
  pt(FIX, "Habemos treinta alumnos en el salón.", "Somos treinta alumnos en el salón.", "Hemos treinta alumnos en el salón.", "Habíamos treinta alumnos en el salón presentes."),
  pt(FIX, "Me di cuenta que no tenía mi celular.", "Me di cuenta de que no tenía mi celular.", "Me di cuenta de qué no tenía mi celular.", "Me di de cuenta que no tenía mi celular."),
  pt(FIX, "Estoy seguro que vendrá.", "Estoy seguro de que vendrá.", "Estoy seguro de qué vendrá.", "Estoy de seguro que vendrá."),
  pt(FIX, "Su cónyugue llegó tarde a la reunión.", "Su cónyuge llegó tarde a la reunión.", "Su cónyugüe llegó tarde a la reunión.", "Su cónyuje llegó tarde a la reunión."),
  pt(FIX, "Hubieron problemas con la luz.", "Hubo problemas con la luz.", "Hubieran problemas con la luz.", "Habieron problemas con la luz."),
  pt(FIX, "Le dije a mis amigos que vinieran temprano.", "Les dije a mis amigos que vinieran temprano.", "Le dije a mis amigos que vengan temprano a la casa de mi abuela.", "Les dije que vengan."),
  pt(FIX, "Ayer me compré una nueva polo azul.", "Ayer me compré un polo azul nuevo.", "Ayer me compré una polo nuevo azul.", "Ayer me compré nueva una polo azul."),
  pt(FIX, "Si yo sabría la respuesta, te la diría.", "Si yo supiera la respuesta, te la diría.", "Si yo sé la respuesta, te la diría.", "Si yo sabía la respuesta, te la diría."),
];
const REVISE = "¿Qué revisión mejora el texto?";
const REVISIONS: ChoiceItem[] = [
  pt(REVISE, "«La minería es importante. La minería genera empleo. La minería contamina».", "Unir y matizar: «La minería genera empleo, pero también contamina».", "Agregar otra oración que empiece con «La minería», por ejemplo: «La minería se hace en la sierra y en la selva».", "Borrar todo."),
  pt(REVISE, "«En conclusión, como dije al principio y como repetí antes, la lectura es importante».", "Ir al grano: «En conclusión, la lectura es importante».", "Agregar «y como lo seguiré repitiendo», para que el lector recuerde la idea principal.", "Quitar «la lectura»."),
  pt(REVISE, "«El informe estuvo chévere y los datos salieron bacán».", "Usar un registro formal: «El informe fue claro y los datos, precisos».", "Agregar más jergas para que el informe suene cercano, divertido y juvenil para todos.", "Dejarlo igual."),
  pt(REVISE, "«Ganamos el partido. Por lo tanto, entrenamos mucho».", "Corregir la relación lógica: «Entrenamos mucho; por lo tanto, ganamos el partido».", "Agregar más detalles sobre el estadio y el clima del día en que se jugó el partido.", "Quitar «el partido»."),
  pt(REVISE, "«Los alumnos tienen que cuidar el agua. Además, los pingüinos viven en la Antártida».", "Reemplazar el dato por uno pertinente: «Además, deben cerrar bien los caños».", "Agregar más información sobre los pingüinos, su alimentación y el lugar donde viven.", "Quitar «Además»."),
  pt(REVISE, "«Pedro le prestó su libro a Juan, y él lo perdió».", "Aclarar quién lo perdió: «…a Juan, y Juan lo perdió».", "Agregar el título del libro, el autor y el año de publicación entre paréntesis.", "Quitar «su»."),
];

// --- Investigación ------------------------------------------------------------

const RELEVANT: ChoiceItem[] = [
  pt("¿Qué fuente es más pertinente?", "Tema: La contaminación del río Rímac.", "Un informe de la Autoridad Nacional del Agua sobre la calidad del río", "Un video de turistas que pasean por el centro de Lima y se toman fotos junto al río", "Un poema sobre el río"),
  pt("¿Qué fuente es más pertinente?", "Tema: La vida de José María Arguedas.", "Una biografía escrita por un investigador de su obra", "Una película de ficción sobre un niño que vive en Andahuaylas y quiere ser futbolista", "Un mapa de Apurímac"),
  pt("¿Qué fuente es más pertinente?", "Tema: Los efectos de las redes sociales en adolescentes.", "Un estudio publicado en una revista de psicología", "Un anuncio de una red social que asegura que conecta a las personas con sus amigos de todo el mundo", "Un meme"),
  pt("¿Qué fuente es más pertinente?", "Tema: La población del Perú por regiones.", "Los resultados del último censo del INEI", "Una guía turística que recomienda los mejores lugares para visitar en cada región del país", "Un folleto de viajes"),
  pt("¿Qué fuente es más pertinente?", "Tema: Los sismos en la costa peruana.", "Los registros del Instituto Geofísico del Perú", "Una publicación en redes de una persona que dice haber sentido un temblor muy fuerte anoche en su casa", "Una canción"),
  pt("¿Qué fuente es más pertinente?", "Tema: La historia de la guerra del Pacífico.", "Un libro de un historiador con fuentes documentadas", "Una telenovela ambientada en el siglo XIX con romances, intrigas y algunas escenas de batallas", "Un afiche"),
];
const BIAS = sorter(["Neutral", "Sesgado"], "¿El titular es neutral o sesgado?");
const HEADLINES: ChoiceItem[] = [
  ...["Gobierno anuncia aumento del sueldo mínimo a partir de enero", "Lluvias intensas afectan a cinco distritos de Piura", "Selección peruana empata 1 a 1 con Colombia", "Inauguran nuevo hospital en Huancavelica"].map((x) => BIAS(x, 0)),
  ...["Gobierno regala migajas a los trabajadores", "Las lluvias castigan otra vez a una Piura abandonada por todos", "Selección vuelve a decepcionar con un empate vergonzoso", "Por fin un hospital digno, después de años de abandono"].map((x) => BIAS(x, 1)),
];
const REF = "Referencia: Alegría, C. (1941). El mundo es ancho y ajeno. Ercilla.";
const WORKS_CITED: ChoiceItem[] = [
  pt("¿Qué parte de la referencia es el año?", REF, "1941", "Ercilla", "C."), pt("¿Qué parte de la referencia es la editorial?", REF, "Ercilla", "1941", "El mundo es ancho y ajeno"),
  pt("¿Qué parte de la referencia es el apellido del autor?", REF, "Alegría", "Ercilla", "C."), pt("¿Qué parte de la referencia es el título?", REF, "El mundo es ancho y ajeno", "Alegría, C.", "Ercilla"),
  pt("En una referencia APA, ¿qué representa «C.»?", REF, "La inicial del nombre del autor", "La ciudad de la editorial", "El capítulo del libro"), w("¿Qué referencia de un artículo web está bien escrita en formato APA?", "Quispe, R. (2022, 5 de mayo). El agua en los Andes. Diario Andino. https://diarioandino.pe/agua", "El agua en los Andes. Quispe. Diario Andino. 2022. Internet.", "https://diarioandino.pe/agua"),
  w("En APA, ¿cómo se ordenan las referencias al final del trabajo?", "Por orden alfabético del apellido del autor", "Por orden de importancia según el estudiante", "Al azar"), w("En APA, ¿qué va en cursiva en la referencia de un libro?", "El título del libro", "El nombre del autor", "El año de publicación"),
];
const IN_TEXT: ChoiceItem[] = [
  w("¿Qué cita textual está bien hecha en formato APA?", "Según Huamán (2020), «la escuela es el primer espacio público de un niño» (p. 45).", "Según Huamán, la escuela es el primer espacio público de un niño.", "«La escuela es el primer espacio público de un niño» (Pedro, 2020)."),
  w("¿Qué cita parafraseada está bien hecha en formato APA?", "La lectura temprana mejora el rendimiento escolar (Torres, 2019).", "La lectura temprana mejora el rendimiento escolar (2019, Torres, página).", "La lectura temprana mejora el rendimiento, dijo alguien."),
  w("¿Cómo se cita en APA una idea de dos autores?", "(Ramos y Vega, 2021)", "(Ramos, Vega y todos los demás autores del libro, 2021)", "(2021)"),
  w("¿Cómo se cita en APA una obra de tres o más autores?", "(Flores et al., 2018)", "(Flores, 2018, y otros autores más que colaboraron)", "(et al.)"),
  w("Si la cita textual tiene más de 40 palabras, ¿qué se hace en APA?", "Se escribe en un bloque aparte, con sangría y sin comillas", "Se escribe entre comillas dobles y en negrita", "Se omite"),
  w("¿Qué indica «p.» en una cita APA?", "La página de donde se tomó la cita", "El país de origen del autor citado", "El párrafo del ensayo"),
  w("Cuando se cita una institución como autor, ¿qué se escribe?", "(Instituto Nacional de Estadística e Informática [INEI], 2023)", "(Un instituto, 2023)", "(Estadística)"),
];
const PLAG = sorter(["Es plagio", "No es plagio"], "¿Es plagio?");
const PLAGIARISM: ChoiceItem[] = [
  ...["Copiar las respuestas de un chatbot y presentarlas como propias.", "Traducir un artículo en inglés y entregarlo como si fuera tuyo.", "Parafrasear un texto ajeno sin indicar la fuente.", "Pegar un gráfico de otro informe sin mencionar de dónde salió."].map((x) => PLAG(x, 0)),
  ...["Citar entre comillas las palabras de un autor con su apellido y año.", "Parafrasear una idea y poner la referencia al final.", "Escribir tus propias conclusiones a partir de tu investigación.", "Usar datos del INEI indicando la fuente."].map((x) => PLAG(x, 1)),
];

export const ROWS: Row[] = [
  ["organizar-1", (r) => order(r, "Ordena los temas del más amplio al más específico.", BROAD_NARROW)],
  ["organizar-2", (r) => choose(r, "", BY_TOPIC)],
  ["organizar-3", (r) => choose(r, "", NOT_BELONG)],
  ["organizar-4", (r) => choose(r, "", TOPIC_SENTENCE)],

  ["tesis-1", (r) => choose(r, "", FACT_OPINION)],
  ["tesis-2", (r) => choose(r, "", THESES)],
  ["tesis-3", (r) => choose(r, "", EVIDENCE)],
  ["contraargumentos", (r) => choose(r, "", COUNTERCLAIMS)],
  ["apelaciones", (r) => choose(r, "", APPEALS)],
  ["falacias", (r) => choose(r, "", FALLACIES)],

  ["personificacion", (r) => choose(r, "", PERSONIFICATION)],
  ["estilo-1", (r) => choose(r, "", VARIED)],
  ["estilo-2", (r) => choose(r, "", STRONG_VERB)],

  ["tesis-4", (r) => choose(r, "", SUPPORT_INFO)],
  ["tesis-5", (r) => choose(r, "", SUPPORT_LIT)],

  ["claridad-1", (r) => choose(r, "Completa con el mejor conector.", CONJ_ADV)],
  ["claridad-2", (r) => choose(r, "", PARALLEL)],
  ["claridad-3", (r) => choose(r, "", REDUNDANCY)],

  ["voz-pasiva-1", (r) => choose(r, "", IDENTIFY_VOICE)],
  ["voz-pasiva-2", (r) => choose(r, "", TO_ACTIVE)],

  ["confundidas-1", (r) => choose(r, "Completa la oración.", CONFUSED_USE)],
  ["confundidas-2", (r) => choose(r, "", CONFUSED_FIX)],
  ["corregir-1", (r) => choose(r, "", SIGNS)],
  ["corregir-2", (r) => choose(r, "", EVERYDAY)],
  ["corregir-3", (r) => choose(r, "", REVISIONS)],

  ["fuentes-1", (r) => choose(r, "", RELEVANT)],
  ["fuentes-2", (r) => choose(r, "", HEADLINES)],
  ["apa-1", (r) => choose(r, "", WORKS_CITED)],
  ["apa-2", (r) => choose(r, "", IN_TEXT)],
  ["fuentes-3", (r) => choose(r, "", PLAGIARISM)],
];
