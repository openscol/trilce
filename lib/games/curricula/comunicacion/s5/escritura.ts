import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Secundaria · banco de escritura: organizar las ideas, oraciones
// temáticas y tesis, evidencias y su análisis, contraargumentos, conectores
// argumentativos (en suma, a su vez, dicho de otro modo, por consiguiente),
// falacias, apelaciones al ethos, al pathos y al logos, comparaciones,
// paralelismo, redundancias, voz activa y pasiva, revisión y referencias y
// citas en formato APA.

// --- Organizar ---------------------------------------------------------------

const BROAD: OrderItem[] = [
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Arte", "Música", "Música afroperuana", "El festejo de El Carmen"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Geografía", "Hidrografía", "Ríos de la vertiente del Atlántico", "El río Ucayali"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Tecnología", "Inteligencia artificial", "Traducción automática", "Traductores al quechua"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Salud", "Nutrición", "Anemia infantil", "La anemia en Puno"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Política", "Elecciones", "Elecciones regionales", "Las elecciones de Cusco"] },
];
const BY_TOPIC = sorter(["Ventajas", "Desventajas", "Propuestas"], "En un ensayo sobre el uso de la inteligencia artificial en el colegio, ¿en qué apartado va esta idea?");
const TOPIC_ITEMS: ChoiceItem[] = [
  BY_TOPIC("Explica temas difíciles con ejemplos adaptados a cada alumno.", 0),
  BY_TOPIC("Ayuda a practicar idiomas a cualquier hora.", 0),
  BY_TOPIC("Puede dar información falsa con mucha seguridad.", 1),
  BY_TOPIC("Facilita que algunos alumnos copien sin aprender.", 1),
  BY_TOPIC("Enseñar a verificar las respuestas con fuentes confiables.", 2),
  BY_TOPIC("Pedir que los trabajos incluyan el proceso y no solo el resultado.", 2),
];

// --- Oración temática y tesis -------------------------------------------------

const TOPIC_SENTENCE: ChoiceItem[] = [
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. El Perú tiene costa, sierra y selva, y en ellas conviven decenas de ecosistemas. Esa diversidad explica la variedad de sus cultivos, de su fauna y de su cocina.»", "La diversidad geográfica del Perú explica muchas de sus riquezas.", "La selva es húmeda.", "El Perú es el país con más montañas nevadas de todo el planeta, por encima de Nepal."),
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. Los estudiantes que hacen deporte duermen mejor, manejan mejor el estrés y se concentran más en clase.»", "La actividad física trae beneficios que van más allá de la salud.", "El fútbol es el deporte más popular del Perú.", "Algunos estudiantes no tienen zapatillas adecuadas para correr en la losa del colegio."),
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. En 1970, el terremoto de Áncash dejó miles de víctimas. Desde entonces se crearon normas de construcción y simulacros nacionales.»", "Los grandes desastres impulsaron la prevención en el Perú.", "Áncash está en la sierra.", "Los simulacros nacionales son aburridos y nadie los toma en serio en los colegios de Lima."),
];
const THESIS = sorter(["Es una tesis", "No es una tesis"], "¿La oración es una tesis (una afirmación que se puede defender)?");
const THESIS_ITEMS: ChoiceItem[] = [
  THESIS("El servicio militar no debería ser obligatorio.", 0),
  THESIS("El Perú limita con cinco países.", 1),
  THESIS("Los museos deberían ser gratuitos para los estudiantes.", 0),
  THESIS("El Misti es un volcán.", 1),
  THESIS("La literatura oral merece el mismo lugar que la escrita en el colegio.", 0),
  THESIS("¿Cuántas lenguas se hablan en el Perú?", 1),
  THESIS("El país debería invertir más en trenes que en aeropuertos.", 0),
  THESIS("La Universidad de San Marcos se fundó en 1551.", 1),
];

// --- Evidencias y análisis ---------------------------------------------------

const FACT = sorter(["Hecho", "Opinión"], "¿Es un hecho o una opinión?");
const FACT_ITEMS: ChoiceItem[] = [
  FACT("Machu Picchu fue declarado Patrimonio de la Humanidad en 1983.", 0),
  FACT("Machu Picchu es la maravilla más impresionante del mundo.", 1),
  FACT("El lago Titicaca es compartido por el Perú y Bolivia.", 0),
  FACT("Puno tiene las mejores danzas del país.", 1),
  FACT("Mario Vargas Llosa recibió el Nobel de Literatura en 2010.", 0),
  FACT("Vargas Llosa es el mejor escritor peruano de la historia.", 1),
];
const STRONG: ChoiceItem[] = [
  w("Afirmación: «El programa de tutoría redujo la deserción». ¿Qué evidencia es más sólida?", "La tasa de abandono bajó del 8 % al 3 % en dos años, según el registro del colegio.", "Los tutores dicen que los alumnos están más felices y que vienen con más ganas.", "Mi hermano dice que ya nadie deja el colegio."),
  w("Afirmación: «La nueva carretera aumentó el comercio». ¿Qué evidencia es más sólida?", "Las ventas en la feria del distrito crecieron un 45 % desde su apertura.", "Ahora se ven más camiones pasando por la plaza del distrito los domingos.", "Un comerciante está contento."),
  w("Afirmación: «El sistema de alerta salvó vidas». ¿Qué evidencia es más sólida?", "El informe de Defensa Civil registra la evacuación de 1200 familias antes del huaico.", "La gente dice que la alarma sonó muy fuerte aquella noche y que todos salieron.", "Fue una buena idea."),
  w("Afirmación: «Los alumnos leen más desde que hay biblioteca de aula». ¿Qué evidencia es más sólida?", "El registro de préstamos pasó de 40 a 130 libros al mes.", "Los alumnos llevan libros a casa con más frecuencia, según comentan algunas madres.", "Se nota."),
];
const WEAK = sorter(["Sólida", "Débil"], "¿Es una evidencia sólida o débil para apoyar una afirmación?");
const WEAK_ITEMS: ChoiceItem[] = [
  WEAK("Las cifras del censo nacional", 0),
  WEAK("Un video viral sin fecha ni fuente", 1),
  WEAK("Un artículo de una revista científica revisada por pares", 0),
  WEAK("La opinión de un influencer sobre medicina", 1),
  WEAK("Las estadísticas del Ministerio de Salud", 0),
  WEAK("Un rumor que circula en el barrio", 1),
];
const SUPPORT = [
  { p: "Afirmación: «La pesca artesanal está en riesgo». ¿Qué oración del texto la apoya?", t: "«Los pescadores de Paita salen cada día más lejos. Las capturas cayeron a la mitad en diez años. Algunos venden ahora pescado de piscigranja.»", a: "Las capturas cayeron a la mitad en diez años.", d: ["Algunos venden ahora pescado de piscigranja.", "Los pescadores son de Paita, una ciudad del norte con un gran puerto."] },
  { p: "Afirmación: «El reciclaje funciona en el distrito». ¿Qué oración del texto la apoya?", t: "«El distrito tiene tres camiones nuevos. Se recogen 20 toneladas de material reciclable al mes. Los vecinos reciben un descuento en arbitrios.»", a: "Se recogen 20 toneladas de material reciclable al mes.", d: ["El distrito tiene tres camiones nuevos y modernos para la limpieza pública.", "Los vecinos reciben un descuento."] },
] as ChoiceItem[];
const ANALYSIS: ChoiceItem[] = [
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: las becas reducen la desigualdad. Evidencia: el 70 % de los becarios son los primeros de su familia en ir a la universidad.", "Las becas abren oportunidades a familias que antes no accedían a estudios superiores.", "Las becas son caras para el Estado.", "Muchos becarios estudian Ingeniería y otros prefieren carreras de Ciencias Sociales."),
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: la radio sigue siendo clave en el campo. Evidencia: el 80 % de las familias rurales se informa por radio.", "Como la mayoría rural se informa por radio, es el medio más eficaz para llegar a ella.", "La radio es antigua.", "En las ciudades se escucha más música que noticias, sobre todo los fines de semana."),
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: el idioma materno facilita el aprendizaje. Evidencia: los niños de escuelas bilingües comprenden mejor lo que leen.", "Aprender primero en su lengua permite a los niños entender antes de pasar al castellano.", "Las escuelas bilingües son pocas y casi todas están en zonas rurales alejadas de las ciudades principales.", "Los niños que hablan quechua también juegan fútbol y vóley en los recreos."),
];
const COUNTER: ChoiceItem[] = [
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: el voto debería ser voluntario. Contraargumento: votaría muy poca gente.", "En países con voto voluntario, la participación es menor, pero los votantes están mejor informados; además, se pueden hacer campañas para incentivarla.", "La gente que no vota no merece opinar sobre nada de lo que decidan los gobernantes, así que su ausencia no sería un problema para el país.", "La gente que no vota no merece opinar sobre nada."),
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: las clases deberían empezar a las 8:30. Contraargumento: los padres llegarían tarde al trabajo.", "Los colegios pueden abrir a las 7:30 con actividades opcionales para quienes lo necesiten.", "Los padres deberían cambiar de trabajo.", "Los padres deberían buscar otro trabajo con un horario más flexible para acompañar a sus hijos."),
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: los videojuegos pueden ser educativos. Contraargumento: generan adicción.", "El riesgo existe con el uso excesivo; por eso se proponen tiempos limitados y juegos con objetivos de aprendizaje.", "Los que critican los videojuegos nunca han jugado y no saben de lo que hablan, así que su opinión no debería tomarse en cuenta.", "Los que critican los videojuegos nunca han jugado."),
];
const TRANSITIONS: ChoiceItem[] = [
  f("Elige el conector: «Se analizaron causas, efectos y propuestas. ___, la contaminación del lago exige una acción conjunta.»", "En suma", "Por ejemplo", "Sin embargo"),
  f("Elige el conector: «El Estado debe invertir en salud; ___, las familias deben adoptar hábitos saludables.»", "a su vez", "por ejemplo", "en cambio"),
  f("Elige el conector: «La propuesta es inviable. ___, no puede aplicarse con los recursos actuales.»", "Dicho de otro modo", "No obstante", "Por otra parte"),
  f("Elige el conector: «Los precios subieron; ___, las ventas disminuyeron.»", "por consiguiente", "a pesar de ello", "es decir"),
  f("Elige el conector: «El plan es costoso. ___, sus beneficios superan la inversión.»", "Con todo", "Por lo tanto", "En otras palabras"),
];
const FALLACIES = ["Ataque a la persona", "Falsa disyuntiva", "Generalización apresurada", "Apelación a la autoridad irrelevante", "Falsa causa"];
const fal = sorter(FALLACIES, "¿Qué falacia hay en el argumento?");
const FALLACY_ITEMS: ChoiceItem[] = [
  fal("Su propuesta de salud no vale: es un político corrupto.", 0),
  fal("No puede hablar de educación porque no tiene hijos.", 0),
  fal("O construimos la mina o el pueblo seguirá en la pobreza.", 1),
  fal("O estás con la reforma o estás con el atraso.", 1),
  fal("Mi vecino limeño es impuntual; todos los limeños lo son.", 2),
  fal("Un alumno de ese colegio sacó mala nota; el colegio es pésimo.", 2),
  fal("Ese futbolista famoso recomienda este seguro; debe ser el mejor.", 3),
  fal("Una actriz dijo en televisión que esa vacuna es peligrosa.", 3),
  fal("Desde que pusieron la antena, llueve menos: la antena causa la sequía.", 4),
  fal("Usé mi lapicero azul y aprobé; ese lapicero me da suerte.", 4),
];

// --- Persuasión ------------------------------------------------------------------

const APPEAL = sorter(["Ethos", "Pathos", "Logos"], "¿A qué apela este anuncio?");
const APPEAL_ITEMS: ChoiceItem[] = [
  APPEAL("«La marca elegida por los chefs del mejor restaurante del país.»", 0),
  APPEAL("«Avalado por la Sociedad Peruana de Pediatría.»", 0),
  APPEAL("«Porque quien te cuidó toda la vida merece lo mejor.»", 1),
  APPEAL("«No permitas que tus hijos pasen otro invierno sin abrigo.»", 1),
  APPEAL("«Rinde 300 lavadas: el doble que la competencia.»", 2),
  APPEAL("«Con este plan pagas 40 soles menos al mes.»", 2),
];
const USE_APPEAL: ChoiceItem[] = [
  w("Quieres convencer al municipio de instalar luminarias usando el logos. ¿Qué oración usarías?", "En las calles iluminadas del distrito, los robos bajaron un 35 % el último año.", "Piense en las madres que vuelven solas a casa de noche, con miedo en cada esquina.", "Como presidente de la junta vecinal desde hace diez años, conozco bien el barrio."),
  w("Quieres convencer a tus compañeros de donar sangre usando el pathos. ¿Qué oración usarías?", "Hoy, una niña en el hospital espera que alguien como tú le devuelva la sonrisa.", "Cada donación puede salvar hasta tres vidas, según el Ministerio de Salud.", "Como médico del colegio, garantizo que el procedimiento es seguro."),
  w("Quieres convencer a los padres de un taller de prevención usando el ethos. ¿Qué oración usarías?", "Lo dictará una psicóloga con veinte años de experiencia en salud adolescente.", "Los talleres de prevención reducen las conductas de riesgo en un 30 %.", "Imagine la tranquilidad de saber que su hijo sabe cuidarse."),
];

// --- Claridad y estilo ---------------------------------------------------------------

const COMPARISON: ChoiceItem[] = [
  f("¿Qué oración tiene una comparación correcta?", "La población de Arequipa es mayor que la de Cusco.", "La población de Arequipa es más mayor que Cusco.", "Arequipa es mayor que la población de Cusco."),
  f("¿Qué oración tiene una comparación correcta?", "Este libro es peor que el anterior.", "Este libro es más peor que el anterior.", "Este libro es más malo peor que el anterior."),
  f("¿Qué oración tiene una comparación correcta?", "Su nota fue inferior a la mía.", "Su nota fue más inferior que la mía.", "Su nota fue inferior que la mía."),
  f("¿Qué oración tiene una comparación correcta?", "El sueldo de un docente en el Perú es menor que el de uno en Chile.", "El sueldo de un docente en el Perú es más menor que el sueldo de los docentes chilenos.", "Un docente en el Perú es menor que el sueldo de Chile."),
];
const PARALLEL_ID: ChoiceItem[] = [
  f("¿Qué oración tiene estructura paralela?", "Queremos un país más justo, más seguro y más educado.", "Queremos un país más justo, con seguridad y que se eduque.", "Queremos justicia, un país seguro y educando."),
  f("¿Qué oración tiene estructura paralela?", "El voluntariado consiste en enseñar, acompañar y escuchar.", "El voluntariado consiste en enseñar, el acompañamiento y que escuches.", "El voluntariado consiste en la enseñanza, acompañar y escuchando."),
  f("¿Qué oración tiene estructura paralela?", "No vino por cansancio ni por desinterés, sino por enfermedad.", "No vino por cansancio ni porque no le interesaba, sino enfermo.", "No vino cansado ni por desinterés, sino porque se enfermó."),
  f("¿Qué oración tiene estructura paralela?", "Leer abre la mente; escribir la ordena.", "Leer abre la mente; la escritura, ordenando.", "La lectura abre la mente; escribir la está ordenando."),
];
const REDUNDANT: ChoiceItem[] = [
  f("¿Qué versión elimina la redundancia?", "Es una tradición de todos los años.", "Es una tradición anual de todos los años.", "Es una tradición anual que se repite cada año todos los años."),
  f("¿Qué versión elimina la redundancia?", "Los resultados fueron sorprendentes.", "Los resultados fueron sorpresivos e inesperados.", "Los resultados fueron sorprendentes e inesperados por sorpresa."),
  f("¿Qué versión elimina la redundancia?", "Es una persona que ayuda a todos.", "Es una persona humana que ayuda a todos.", "Es una persona humana, solidaria y que ayuda a todos los demás."),
  f("¿Qué versión elimina la redundancia?", "El testigo vio el accidente.", "El testigo vio con sus propios ojos el accidente.", "El testigo presencial vio con sus propios ojos el accidente."),
];
const VOICE = sorter(["Voz activa", "Voz pasiva", "Pasiva refleja"], "¿En qué voz está la oración?");
const VOICE_ITEMS: ChoiceItem[] = [
  VOICE("La comunidad construyó el puente.", 0),
  VOICE("El puente fue construido por la comunidad.", 1),
  VOICE("Se construyó un puente nuevo.", 2),
  VOICE("La editorial publicó la antología.", 0),
  VOICE("La antología fue publicada en 2020.", 1),
  VOICE("Se publicaron tres antologías.", 2),
];
const ACTIVE: ChoiceItem[] = [
  pt("Reescribe en voz activa.", "«La medalla fue entregada por la directora.»", "La directora entregó la medalla.", "La medalla entregó a la directora.", "Se entregó la medalla por la directora."),
  pt("Reescribe en voz activa.", "«El acuerdo fue firmado por ambos países.»", "Ambos países firmaron el acuerdo.", "El acuerdo firmó a ambos países.", "Fue firmado el acuerdo."),
  pt("Reescribe en voz activa.", "«Los poemas fueron traducidos al quechua por un equipo de docentes.»", "Un equipo de docentes tradujo los poemas al quechua.", "Los poemas tradujeron al equipo.", "Los poemas fueron traducidos al quechua por un equipo de docentes."),
];

// --- Revisión --------------------------------------------------------------------------

const CONFUSED: ChoiceItem[] = [
  f("Completa: «No entiendo el ___ de su decisión.»", "porqué", "por qué", "porque"),
  f("Completa: «Además, ___ de lo dicho, presentó pruebas.»", "aparte", "a parte", "a-parte"),
  f("Completa: «Trajo comida de ___ para todos.»", "más", "mas", "demás"),
  f("Completa: «Los ___ alumnos llegaron después.»", "demás", "de más", "demas"),
  f("Completa: «Cobraron diez soles ___.»", "de más", "demás", "demas"),
  f("Completa: «El jefe se lo dijo ___ mismo.»", "a sí", "así", "asi"),
  f("Completa: «___ se hace el trabajo.»", "Así", "A sí", "Asi"),
  f("Completa: «Lo hizo con ___ fin de ayudar.»", "el", "él", "él solo"),
];
const MISSPELLED: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "exuberante", "exhuberante", "exhuverante"),
  f("¿Qué palabra está bien escrita?", "inherente", "inerente", "inherrente"),
  f("¿Qué palabra está bien escrita?", "sobrevivir", "sobrevibir", "sovrevivir"),
  f("¿Qué palabra está bien escrita?", "excesivo", "exesivo", "escesivo"),
  f("¿Qué palabra está bien escrita?", "subversivo", "suversivo", "subvercivo"),
  f("¿Qué palabra está bien escrita?", "idiosincrasia", "idiosincracia", "ideosincrasia"),
  f("¿Qué palabra está bien escrita?", "neumonía", "nemonía", "neumonia"),
  f("¿Qué palabra está bien escrita?", "esplendor", "explendor", "esplendór"),
];
const SIGNS: ChoiceItem[] = [
  pt("¿Cómo debe corregirse el cartel?", "«SE ASE LIMPIESA»", "SE HACE LIMPIEZA", "SE HACE LIMPIESA", "SE ASE LIMPIEZA"),
  pt("¿Cómo debe corregirse el cartel?", "«NO ARROJAR BASURA, SERA MULTADO»", "NO ARROJAR BASURA: SERÁ MULTADO", "NO ARROJAR VASURA, SERÁ MULTADO", "NO HARROJAR BASURA, SERA MULTADO"),
  pt("¿Cómo debe corregirse el cartel?", "«REPARACION DE CELULARES Y COMPUTADORA'S»", "REPARACIÓN DE CELULARES Y COMPUTADORAS", "REPARACION DE CELULARES Y COMPUTADORAS", "REPARACIÓN DE CELULARES Y COMPUTADORA'S"),
  pt("¿Cómo debe corregirse el cartel?", "«ATENCION DE LUNES A VIERNES DE 9 A 6 PM»", "ATENCIÓN DE LUNES A VIERNES DE 9:00 A. M. A 6:00 P. M.", "ATENCION DE LUNES A VIERNES DE 9 A 6 PM.", "ATENCIÓN DE LUNES A VIERNES DE 9:00 AM. A 6:00 PM. HORAS CORRIDAS"),
];
const EVERYDAY: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Si lo hubiera sabido, habría venido.", "Si lo habría sabido, hubiera venido.", "Si lo habría sabido, habría venido."),
  f("¿Qué oración es correcta?", "Me acuerdo de que llovía.", "Me acuerdo que llovía.", "Me acuerdo de qué llovía."),
  f("¿Qué oración es correcta?", "Pienso que es injusto.", "Pienso de que es injusto.", "Pienso de qué es injusto."),
  f("¿Qué oración es correcta?", "Delante de mí había una cola.", "Delante mío había una cola.", "Adelante mío había una cola."),
  f("¿Qué oración es correcta?", "Hace años que no lo veo.", "Hacen años que no lo veo.", "Hacen años que no le veo."),
  f("¿Qué oración es correcta?", "Le di el libro a mi hermano.", "Les di el libro a mi hermano.", "Le dí el libro a mi hermano."),
];
const REVISE: ChoiceItem[] = [
  pt("¿Qué revisión mejora el texto?", "«La reunión fue larga. La reunión fue tensa. Al final de la reunión hubo acuerdos.»", "La reunión fue larga y tensa, pero al final hubo acuerdos.", "La reunión, la reunión, la reunión: larga, tensa y acuerdos.", "Reunión larga. Tensa. Acuerdos."),
  pt("¿Qué revisión mejora el texto?", "«El proyecto, que fue presentado por los alumnos, que son de quinto, que ganaron el concurso, fue premiado.»", "El proyecto de los alumnos de quinto ganó el concurso y fue premiado.", "El proyecto que fue que los alumnos que ganaron fue premiado.", "El proyecto, de quinto, alumnos, ganador, premiado."),
  pt("¿Qué revisión mejora el texto?", "«Hay que decir que, en realidad, básicamente, el problema es la falta de agua.»", "El problema es la falta de agua.", "Hay que decir, básicamente, en realidad, que el problema es el agua faltante.", "Básicamente, el problema, en realidad, es básicamente el agua."),
];

// --- Investigación: APA y plagio -----------------------------------------------------

const APA_READ: ChoiceItem[] = [
  pt("¿Qué indica «(2017)» en la referencia?", "Cueto, M. (2017). La salud pública en el Perú. Fondo Editorial PUCP.", "El año de publicación", "La edición del libro", "El número de capítulos"),
  pt("¿Qué parte de la referencia es el título?", "Cueto, M. (2017). La salud pública en el Perú. Fondo Editorial PUCP.", "La salud pública en el Perú", "Fondo Editorial PUCP", "Fondo Editorial PUCP, Lima"),
  pt("¿Qué tipo de fuente es?", "Ministerio de Educación. (2024). Resultados de la Evaluación Nacional de Logros de Aprendizaje. https://minedu.gob.pe", "Un informe institucional en línea", "Una entrevista en video publicada en una red social", "Una entrevista en video"),
  pt("¿Qué tipo de fuente es?", "Ríos, A., y Pérez, L. (2021). El agua en los Andes. Revista Peruana de Geografía, 12(2), 45–60.", "Un artículo de revista académica", "Un libro de cuentos", "Una página de una red social"),
];
const APA_PARTS: ChoiceItem[] = [
  w("En formato APA, ¿qué indica «12(2)» en la referencia de una revista?", "El volumen y el número de la revista", "La cantidad de autores y de páginas del artículo", "La cantidad de autores"),
  w("En formato APA, ¿cómo se ordena la lista de referencias?", "Alfabéticamente por el apellido del primer autor", "Por año de publicación", "Por año de publicación, del más reciente al más antiguo"),
  w("En formato APA, ¿qué se escribe si no se conoce la fecha?", "(s. f.), que significa «sin fecha»", "El año actual", "Nada, se deja en blanco el espacio"),
  w("En formato APA, cuando una obra tiene una institución como autora, ¿qué se escribe primero?", "El nombre de la institución", "El nombre del director", "El título de la obra"),
];
const APA_CITE: ChoiceItem[] = [
  f("¿Qué cita en el texto sigue el formato APA?", "La anemia afecta más a las zonas rurales (Cueto, 2017).", "La anemia afecta más a las zonas rurales (Marcos Cueto, libro de 2017, página 30).", "La anemia afecta más a las zonas rurales, según un libro."),
  f("¿Qué cita en el texto con dos autores sigue el formato APA?", "Ríos y Pérez (2021) explican el retroceso glaciar.", "Ríos, Pérez, 2021, explican el retroceso glaciar.", "Los autores Ríos y Pérez explican en su artículo el retroceso glaciar."),
  f("¿Qué cita textual breve sigue el formato APA?", "Según Cueto (2017), «la salud es un reflejo de la desigualdad» (p. 15).", "Según Cueto, la salud es un reflejo de la desigualdad, página 15, año 2017.", "«La salud es un reflejo de la desigualdad» (Cueto)."),
];
const PLAGIARISM: ChoiceItem[] = [
  pt("¿Es plagio?", "Usas una respuesta de inteligencia artificial y la entregas como si fuera tuya sin decirlo.", "Sí, porque presentas como propio un texto que no escribiste.", "No, porque la inteligencia artificial no es una persona.", "No, si la respuesta es correcta y bien escrita."),
  pt("¿Es plagio?", "Traduces un artículo del inglés y lo entregas con tu nombre, sin citar al autor.", "Sí, porque traducir no te convierte en autor de las ideas.", "No, porque está en otro idioma.", "No, porque al traducirlo a otro idioma el texto pasa a ser una obra nueva y propia."),
  pt("¿Es plagio?", "Parafraseas un informe con tus palabras y lo citas en el texto y en las referencias.", "No, porque reconoces la fuente.", "Sí, porque las ideas no son tuyas.", "Sí, porque no copiaste textual y eso está prohibido."),
  pt("¿Es plagio?", "Entregas el mismo trabajo que hiciste el año pasado para otro curso sin avisar.", "Sí, es autoplagio: presentas como nuevo un trabajo ya evaluado.", "No, porque es tu propio trabajo.", "No, porque es tu propio trabajo y puedes usarlo todas las veces que quieras."),
];

export const ROWS: Row[] = [
  ["organizar-1", (r) => order(r, "", BROAD)],
  ["organizar-2", (r) => choose(r, "", TOPIC_ITEMS)],
  ["tematica-tesis-1", (r) => choose(r, "", TOPIC_SENTENCE)],
  ["tematica-tesis-2", (r) => choose(r, "", THESIS_ITEMS)],
  ["evidencias-1", (r) => choose(r, "", FACT_ITEMS)],
  ["evidencias-2", (r) => choose(r, "", STRONG)],
  ["evidencias-3", (r) => choose(r, "", WEAK_ITEMS)],
  ["evidencias-4", (r) => choose(r, "", SUPPORT)],
  ["analisis-1", (r) => choose(r, "", ANALYSIS)],
  ["analisis-2", (r) => choose(r, "", COUNTER)],
  ["analisis-3", (r) => choose(r, "", TRANSITIONS)],
  ["falacias", (r) => choose(r, "", FALLACY_ITEMS)],
  ["persuasion-1", (r) => choose(r, "", APPEAL_ITEMS)],
  ["persuasion-2", (r) => choose(r, "", USE_APPEAL)],
  ["claridad-1", (r) => choose(r, "", COMPARISON)],
  ["claridad-2", (r) => choose(r, "", PARALLEL_ID)],
  ["claridad-3", (r) => choose(r, "", REDUNDANT)],
  ["voz-1", (r) => choose(r, "", VOICE_ITEMS)],
  ["voz-2", (r) => choose(r, "", ACTIVE)],
  ["revision-1", (r) => choose(r, "", CONFUSED)],
  ["revision-2", (r) => choose(r, "", MISSPELLED)],
  ["revision-3", (r) => choose(r, "", SIGNS)],
  ["revision-4", (r) => choose(r, "", EVERYDAY)],
  ["revision-5", (r) => choose(r, "", REVISE)],
  ["apa-1", (r) => choose(r, "", APA_READ)],
  ["apa-2", (r) => choose(r, "", APA_PARTS)],
  ["apa-3", (r) => choose(r, "", APA_CITE)],
  ["apa-4", (r) => choose(r, "", PLAGIARISM)],
];
