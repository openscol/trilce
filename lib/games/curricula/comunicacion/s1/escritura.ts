import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de escritura (IXL 7th grade ELA, O-U), con estas adaptaciones:
//   conjunctive adverbs → conectores (sin embargo, por lo tanto, además, en cambio, es decir)
//   frequently confused words → porque / por qué / porqué, sino / si no, asimismo / a sí mismo, etc.
//   errors in everyday use → errores frecuentes del castellano (hubieron, haiga, dijistes, más mejor)
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
  { seq: ["seres vivos", "animales", "mamíferos", "camélidos sudamericanos", "la vicuña"] }, { seq: ["literatura", "literatura peruana", "poesía peruana", "poesía de César Vallejo", "«Los heraldos negros»"] },
  { seq: ["historia", "historia del Perú", "la Colonia", "rebeliones del siglo XVIII", "la rebelión de Túpac Amaru II"] }, { seq: ["medio ambiente", "recursos hídricos", "glaciares", "glaciares de la cordillera Blanca", "el glaciar Pastoruri"] },
  { seq: ["gastronomía", "cocina peruana", "cocina criolla", "platos de fondo", "el ají de gallina"] }, { seq: ["ciencia", "astronomía", "sistema solar", "planetas rocosos", "Marte"] },
  { seq: ["música", "música andina", "instrumentos de viento", "la quena"] }, { seq: ["economía", "exportaciones", "productos agrícolas", "frutas", "el arándano peruano"] },
];
const BY_TOPIC: ChoiceItem[] = [
  pt("Preparas un informe sobre la anemia infantil. ¿En qué sección va este dato?", "«La falta de hierro reduce la capacidad de aprender».", "Consecuencias", "Causas", "Soluciones"), pt("Preparas un informe sobre la anemia infantil. ¿En qué sección va este dato?", "«Muchos niños no consumen alimentos ricos en hierro».", "Causas", "Consecuencias", "Soluciones"),
  pt("Preparas un informe sobre la anemia infantil. ¿En qué sección va este dato?", "«Incluir sangrecita y menestras en la dieta escolar».", "Soluciones", "Causas", "Consecuencias"), pt("Escribes una biografía de Chabuca Granda. ¿En qué sección va este dato?", "«Nació en Cotabambas, Apurímac, en 1920».", "Infancia", "Obra", "Legado"),
  pt("Escribes una biografía de Chabuca Granda. ¿En qué sección va este dato?", "«Compuso “La flor de la canela” en 1950».", "Obra", "Infancia", "Legado"), pt("Escribes una biografía de Chabuca Granda. ¿En qué sección va este dato?", "«Sus valses se siguen cantando en concursos escolares».", "Legado", "Infancia", "Obra"),
  pt("Escribes sobre Arequipa. ¿En qué sección va este dato?", "«El Misti, el Chachani y el Pichu Pichu rodean la ciudad».", "Geografía", "Gastronomía", "Historia"), pt("Escribes sobre Arequipa. ¿En qué sección va este dato?", "«El rocoto relleno y el adobo son platos típicos».", "Gastronomía", "Geografía", "Historia"),
];
const NOT = "¿Qué oración no pertenece al párrafo?";
const NOT_BELONG: ChoiceItem[] = [
  pt(NOT, "(1) La marinera es el baile nacional del Perú. (2) Se baila en pareja con un pañuelo. (3) Trujillo organiza cada año un concurso famoso. (4) El cajón es un instrumento afroperuano.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) El lúcuma es un fruto andino. (2) Su pulpa es amarilla y harinosa. (3) Las manzanas pueden ser rojas o verdes. (4) Se usa para hacer helados y postres.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) Las abejas se comunican bailando. (2) Con su danza indican dónde hay flores. (3) La miel tiene muchas calorías. (4) La dirección del baile señala la posición del sol.", "La oración 3", "La oración 1", "La oración 4"),
  pt(NOT, "(1) Leer en voz alta mejora la fluidez. (2) También ayuda a detectar errores al escribir. (3) Las bibliotecas públicas abren a las nueve. (4) Por eso conviene releer en voz alta los borradores.", "La oración 3", "La oración 1", "La oración 4"),
  pt(NOT, "(1) Los volcanes del sur peruano son activos. (2) El Ubinas ha tenido erupciones recientes. (3) Arequipa es famosa por su queso helado. (4) El Instituto Geofísico los vigila de forma permanente.", "La oración 3", "La oración 2", "La oración 4"),
  pt(NOT, "(1) El reciclaje reduce la basura. (2) Las botellas de plástico pueden volverse ropa. (3) El papel reciclado ahorra árboles. (4) Las botellas de vidrio son transparentes.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) El ajedrez desarrolla la concentración. (2) Obliga a anticipar las jugadas del rival. (3) El ajedrecista peruano Julio Granda es gran maestro. (4) El tablero tiene sesenta y cuatro casillas blancas y negras.", "La oración 4", "La oración 2", "La oración 3"),
  pt(NOT, "(1) El agua potable es un derecho. (2) Sin embargo, millones de peruanos no la tienen en casa. (3) El mar cubre el 70 % del planeta. (4) Muchos dependen de camiones cisterna.", "La oración 3", "La oración 2", "La oración 4"),
];
const TOPIC = "¿Qué oración temática resume mejor la idea principal del párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Los retablos ayacuchanos cuentan fiestas y oficios; los mates burilados de Huancayo narran la vida en el campo; los toritos de Pucará protegen los techos.", "La artesanía peruana es una forma de contar la vida de los pueblos.", "Los mates burilados se hacen con calabazas secas y una punta de acero.", "Hay artesanía."),
  pt(TOPIC, "___ Recibe estudiantes de todo el país, organiza ferias de libros y presta computadoras con internet a quien lo necesite.", "La biblioteca municipal cumple una función social amplia.", "La biblioteca municipal abre de lunes a sábado en horario de oficina.", "Hay libros."),
  pt(TOPIC, "___ Primero investigó durante meses. Luego entrevistó a veinte pescadores. Al final, escribió un reportaje que cambió la ley de pesca.", "La periodista realizó un trabajo largo y riguroso que tuvo consecuencias.", "La periodista entrevistó a veinte pescadores de la costa del norte.", "Hay pescadores."),
  pt(TOPIC, "___ Los niños aprenden a esperar su turno, a perder sin enojarse y a ponerse de acuerdo en las reglas.", "Los juegos de mesa enseñan habilidades sociales.", "Los juegos de mesa se venden en cajas de cartón en las librerías.", "Jugar es bonito."),
  pt(TOPIC, "___ Cada año se pierden miles de hectáreas por la tala ilegal, la minería informal y los incendios provocados para sembrar.", "La Amazonía peruana enfrenta varias amenazas a la vez.", "La Amazonía es la región con más árboles de todo el planeta Tierra.", "Hay incendios."),
  pt(TOPIC, "___ En la costa se bebe chicha morada; en la sierra, el emoliente caliente; en la selva, el refrescante aguaje.", "Cada región del Perú tiene sus bebidas tradicionales.", "La chicha morada se prepara con maíz morado, piña y canela.", "Hay bebidas."),
];

// --- P. Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (juicio personal)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["Mario Vargas Llosa recibió el Premio Nobel de Literatura en 2010.", "El Huascarán es la montaña más alta del Perú.", "La batalla de Ayacucho se libró en 1824.", "El Perú limita con cinco países.", "La papa se domesticó en los Andes.", "Lima fue fundada en 1535."].map((x) => FO(x, 0)),
  ...["La comida arequipeña es la más sabrosa del país.", "Nadie debería pasar las vacaciones sin viajar.", "Las novelas de misterio son más interesantes que las de amor.", "El invierno limeño es deprimente.", "Machu Picchu es la maravilla más impresionante del mundo.", "Los videojuegos son una pérdida de tiempo."].map((x) => FO(x, 1)),
];
const THESIS = "¿Qué oración es la mejor tesis para un ensayo argumentativo?";
const THESES: ChoiceItem[] = [
  w(THESIS, "Los colegios deberían incluir una hora diaria de lectura libre, porque fortalece la comprensión y el gusto por leer.", "En este ensayo voy a hablar sobre la lectura, sobre los libros que leemos en casa y en el colegio y sobre las bibliotecas.", "Me gusta leer."),
  w(THESIS, "Las municipalidades deben priorizar las ciclovías, ya que reducen el tráfico y la contaminación.", "Las bicicletas tienen dos ruedas, un manubrio, pedales, una cadena y frenos, y se usan en muchas ciudades del mundo.", "Las bicicletas existen."),
  w(THESIS, "El uso del quechua en las escuelas andinas mejora el aprendizaje y protege la identidad cultural.", "El quechua es una lengua que se habla en varios países de Sudamérica, como el Perú, Bolivia, Ecuador y parte de Argentina.", "¿Qué es el quechua?"),
  w(THESIS, "Reducir el plástico de un solo uso es urgente, porque contamina el mar y daña la pesca.", "Hay muchos tipos de plástico que se fabrican en el mundo entero: botellas, bolsas, juguetes, envases y muchos más.", "El plástico es blando."),
  w(THESIS, "Las tareas escolares deberían limitarse a una hora diaria para proteger el descanso de los estudiantes.", "Mi tema son las tareas escolares que nos dejan en el colegio.", "Las tareas son tareas."),
  w(THESIS, "El turismo en Machu Picchu debe limitarse para evitar el deterioro irreversible del santuario.", "Machu Picchu está en Cusco, fue construido por los incas en el siglo XV y recibe a miles de turistas de todo el mundo.", "Machu Picchu es lindo."),
];
const EVIDENCE: ChoiceItem[] = [
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Las áreas verdes mejoran la salud de los vecinos.", "Un estudio halló menos casos de estrés en barrios con parques.", "Mi vecina dice que le gustan mucho los árboles de su calle y que todas las mañanas los riega con una manguera.", "Los parques son verdes."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El casco salva vidas en los accidentes de moto.", "Según la OMS, el casco reduce casi a la mitad el riesgo de muerte.", "Los cascos se venden en muchos colores y tamaños distintos, y algunos incluso traen luces y parlantes.", "Las motos son rápidas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Desayunar mejora el rendimiento escolar.", "Alumnos que desayunan obtienen mejores puntajes en atención.", "El pan con palta y el café con leche son un desayuno muy popular en Lima y en otras ciudades.", "Desayunar es rico."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Las lenguas originarias están en riesgo.", "Varias lenguas amazónicas tienen hoy menos de cien hablantes.", "El quechua se escribe con el alfabeto latino desde la Colonia, cuando los frailes hicieron diccionarios.", "Hay lenguas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: La minería ilegal contamina los ríos amazónicos.", "Análisis del agua de Madre de Dios hallaron mercurio sobre el límite.", "El oro se usa para fabricar joyas y monedas desde la Antigüedad.", "El río es largo."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El deporte reduce la violencia juvenil.", "Un estudio registró menos peleas entre jóvenes inscritos en ligas deportivas.", "El fútbol es el deporte más popular del Perú y del mundo.", "Correr cansa."),
];
const COUNTER = "¿Cuál es un contraargumento a la afirmación?";
const COUNTERCLAIMS: ChoiceItem[] = [
  pt(COUNTER, "«Los colegios deberían usar solo libros digitales».", "Muchos estudiantes no tienen dispositivos ni internet en casa.", "Los libros digitales se pueden leer en cualquier tableta y pesan mucho menos que una mochila llena de libros.", "Los libros pesan."),
  pt(COUNTER, "«Debería prohibirse la comida chatarra en los quioscos escolares».", "Prohibir no enseña a elegir; mejor educar en nutrición.", "La comida chatarra tiene mucha azúcar, grasa y sal, y causa obesidad y otros problemas de salud en los niños.", "Las papas fritas son ricas."),
  pt(COUNTER, "«El uniforme escolar debería eliminarse».", "El uniforme evita la presión por vestir ropa de marca.", "Sin uniforme, cada alumno puede expresar su propio estilo y su personalidad a través de la ropa que elige.", "Los uniformes son azules."),
  pt(COUNTER, "«Se deberían construir más carreteras en la Amazonía».", "Las carreteras facilitan la tala ilegal y la deforestación.", "Las carreteras acercan los productos de las comunidades a los mercados de las ciudades y abaratan los fletes.", "La selva es grande."),
  pt(COUNTER, "«Los zoológicos deberían cerrarse».", "Algunos zoológicos crían especies en peligro de extinción.", "Los animales sufren cuando viven encerrados en jaulas pequeñas, lejos de su hábitat y de su manada.", "Hay zoológicos."),
  pt(COUNTER, "«Los videojuegos solo producen aislamiento».", "Muchos videojuegos se juegan en equipo y fomentan la cooperación.", "Algunos jóvenes juegan videojuegos durante muchas horas seguidas, solos en su cuarto y sin hablar con nadie.", "Los videojuegos tienen gráficos."),
];
const APPEAL = sorter(["Ethos (credibilidad)", "Pathos (emoción)", "Logos (lógica y datos)"], "¿A qué apela el anuncio?");
const APPEALS: ChoiceItem[] = [
  ...["«Recomendado por el Colegio de Odontólogos del Perú».", "«Nuestro campeón olímpico confía en estas zapatillas».", "«Treinta años de experiencia nos respaldan».", "«La chef más premiada del país cocina con este aceite»."].map((x) => APPEAL(x, 0)),
  ...["«Abraza a tu familia con el calor de nuestro hogar».", "«No dejes que tus hijos pasen frío este invierno».", "«Vuelve a sentir el sabor de la cocina de tu abuela».", "«Cada sol que donas devuelve una sonrisa»."].map((x) => APPEAL(x, 1)),
  ...["«Ahorra hasta 40 % en tu recibo de luz con focos led».", "«Nueve de cada diez usuarios notaron resultados en un mes».", "«El doble de batería por el mismo precio».", "«Llega a tu destino en la mitad del tiempo»."].map((x) => APPEAL(x, 2)),
];
const FALLACY = sorter(["Ataque personal", "Generalización apresurada", "Falso dilema", "Efecto arrastre (todos lo hacen)"], "¿Qué falacia contiene el argumento?");
const FALLACIES: ChoiceItem[] = [
  ...["No le hagan caso a su propuesta de reciclaje: ni siquiera sabe vestirse.", "¿Cómo va a opinar de política si apenas tiene dieciséis años?"].map((x) => FALLACY(x, 0)),
  ...["Conocí a dos arequipeños serios; todos los arequipeños son serios.", "Mi celular de esa marca se malogró; todos los de esa marca son malos."].map((x) => FALLACY(x, 1)),
  ...["O apoyas la nueva carretera o estás contra el progreso.", "O estudias Medicina o serás un fracasado."].map((x) => FALLACY(x, 2)),
  ...["Todos mis amigos tienen esa aplicación; debe ser buena.", "Millones de personas compran este jarabe: seguro que funciona."].map((x) => FALLACY(x, 3)),
];

// --- Q. Estilo -----------------------------------------------------------------

const PERSON = "¿Qué oración usa la personificación?";
const PERSONIFICATION: ChoiceItem[] = [
  w(PERSON, "El volcán dormía con un ojo abierto.", "El volcán está a 5800 metros de altura.", "El volcán es alto."), w(PERSON, "La garúa acariciaba los techos de Lima.", "La garúa es una lluvia muy fina típica de la costa.", "Garúa."),
  w(PERSON, "El viejo bus tosía en cada subida.", "El viejo bus tenía el motor malogrado desde hacía años.", "El bus es viejo."), w(PERSON, "Las olas aplaudían contra el muelle.", "Las olas golpeaban el muelle con mucha fuerza.", "Hay olas."),
  w(PERSON, "El hambre tocó la puerta de la casa.", "En la casa no había comida desde el lunes pasado.", "Tenían hambre."), w(PERSON, "La ciudad se despertó con prisa.", "En la ciudad la gente se levanta temprano para trabajar.", "Amanece."),
  w(PERSON, "El reloj de la plaza vigilaba a los paseantes.", "El reloj de la plaza marca la hora exacta desde 1900.", "Hay un reloj."), w(PERSON, "Los cerros se abrigaban con nubes.", "Los cerros estaban cubiertos por nubes bajas.", "Hay nubes."),
];
const VARIED: ChoiceItem[] = [
  pt("¿Qué oración sigue el modelo?", "Modelo: «Cansado y sucio, el minero volvió a casa».", "Feliz y nervioso, el atleta subió al podio.", "El atleta subió al podio porque estaba feliz.", "El atleta ganó."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Cuando cayó la tarde, los pescadores regresaron».", "Cuando sonó el timbre, los alumnos salieron.", "Los alumnos salieron rápido del salón al patio.", "Salieron."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Corría, saltaba, gritaba: era libre».", "Leía, anotaba, subrayaba: estaba aprendiendo.", "Leía mucho porque quería aprender más cosas.", "Leía."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Con las manos temblorosas, abrió la carta».", "Con la voz entrecortada, leyó el discurso.", "Leyó el discurso delante de todo el colegio.", "Leyó."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «Aunque llovía, salimos a jugar».", "Aunque estaba cansada, terminó la tarea.", "Terminó la tarea a las ocho de la noche.", "Terminó."),
  pt("¿Qué oración sigue el modelo?", "Modelo: «No solo cantaba bien, sino que también componía».", "No solo dibujaba bien, sino que también pintaba murales.", "Dibujaba bien y le gustaba mucho pintar.", "Dibujaba."),
];
const STRONG = "¿Qué verbo hace más precisa la oración?";
const STRONG_VERB: ChoiceItem[] = [
  pt(STRONG, "El niño comió el pan muy rápido.", "devoró", "tomó", "agarró"), pt(STRONG, "El ladrón se fue corriendo del lugar.", "huyó", "caminó", "pasó"),
  pt(STRONG, "Ella dijo en voz muy baja el secreto.", "susurró", "contó", "pronunció"), pt(STRONG, "El agua salió con fuerza de la tubería rota.", "brotó", "estuvo", "quedó"),
  pt(STRONG, "Miró con mucha atención el mapa.", "examinó", "estuvo viendo", "tuvo"), pt(STRONG, "El perro hizo ruido mostrando los dientes.", "gruñó", "sonó", "hizo"),
  pt(STRONG, "El edificio se cayó de golpe.", "se derrumbó", "se movió", "se fue cayendo"), pt(STRONG, "Puso las ropas sin orden en la maleta.", "amontonó", "dejó", "tuvo"),
];

// --- R. Evidencias -------------------------------------------------------------

const SUPPORT_INFO: ChoiceItem[] = [
  pt("¿Qué detalle apoya la idea principal?", "Idea: La quinua es un alimento muy nutritivo.", "Contiene todos los aminoácidos esenciales.", "Se cultiva en Puno y en Bolivia desde hace milenios.", "Es pequeña."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: Las redes sociales pueden afectar la autoestima.", "Muchos jóvenes se comparan con fotos editadas.", "Las redes sociales nacieron a inicios de este siglo.", "Hay redes."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: El Perú es uno de los países más biodiversos.", "Tiene más de 1800 especies de aves.", "Su capital es Lima, fundada por Francisco Pizarro.", "Hay animales."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: Los sismos son frecuentes en la costa peruana.", "La costa está sobre el borde de dos placas tectónicas.", "Lima tiene más de diez millones de habitantes.", "Tiembla."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: El agua del Rímac es vital para Lima.", "De él proviene la mayor parte del agua potable de la ciudad.", "El río nace en la cordillera y cruza varios distritos.", "Es un río."),
  pt("¿Qué detalle apoya la idea principal?", "Idea: Leer ficción desarrolla la empatía.", "Al leer, nos ponemos en el lugar de los personajes.", "Las novelas suelen tener más de cien páginas.", "Leer es bueno."),
];
const SUPPORT_LIT: ChoiceItem[] = [
  pt("¿Qué detalle muestra que Lucho tiene miedo?", "Lucho entró a la casona. Le sudaban las manos y no dejaba de mirar hacia la puerta.", "Le sudaban las manos y miraba la puerta.", "Entró a la casona.", "La casona era antigua y estaba al final de la calle."),
  pt("¿Qué detalle muestra que Rosa es generosa?", "Rosa llegó con su lonchera. Al ver a su compañera sin nada, partió su sándwich en dos.", "Partió su sándwich para compartirlo.", "Llegó con su lonchera.", "Su compañera estaba sentada en la última carpeta del salón."),
  pt("¿Qué detalle muestra que el abuelo está orgulloso?", "El abuelo no dijo nada. Solo se acomodó el sombrero y aplaudió más fuerte que nadie.", "Aplaudió más fuerte que nadie.", "No dijo nada.", "Llevaba puesto el sombrero que usaba para ir a la feria."),
  pt("¿Qué detalle muestra que Andrés está impaciente?", "Andrés tamborileaba en la mesa y miraba el reloj cada diez segundos.", "Miraba el reloj cada diez segundos.", "Estaba en la mesa.", "La mesa era de madera y estaba junto a la ventana."),
  pt("¿Qué detalle muestra que la ciudad estaba abandonada?", "Las calles estaban cubiertas de hierba; las puertas, arrancadas; el reloj, detenido.", "La hierba en las calles y el reloj detenido", "Había calles.", "La ciudad estaba a orillas de un río de agua turbia."),
  pt("¿Qué detalle muestra que Elena está decidida?", "Elena apretó los puños, respiró hondo y subió al escenario sin mirar atrás.", "Subió sin mirar atrás.", "Respiró.", "El escenario estaba iluminado por tres reflectores grandes."),
];

// --- S. Claridad y concisión -----------------------------------------------------

const CONJ_ADV: ChoiceItem[] = [
  f("Estudió toda la semana; ___, no aprobó el examen.", "sin embargo", "por lo tanto", "es decir"), f("Llovió toda la noche; ___, el partido se suspendió.", "por lo tanto", "sin embargo", "en cambio"),
  f("El cóndor vuela sin aletear; el colibrí, ___, aletea sin parar.", "en cambio", "además", "por lo tanto"), f("Es un ave rapaz, ___, caza otros animales para alimentarse.", "es decir", "sin embargo", "en cambio"),
  f("El proyecto es barato; ___, beneficia a todo el barrio.", "además", "sin embargo", "en cambio"), f("No trajo su permiso; ___, no pudo ir a la excursión.", "en consecuencia", "además", "es decir"),
  f("Quería ir a la fiesta; ___, se quedó estudiando.", "no obstante", "por consiguiente", "es decir"), f("La anemia afecta el aprendizaje; ___, debe prevenirse desde la infancia.", "por ello", "en cambio", "no obstante"),
];
const PARA = "¿Qué oración tiene una estructura paralela?";
const PARALLEL: ChoiceItem[] = [
  w(PARA, "Le gusta leer, escribir y dibujar.", "Le gusta leer y el dibujo.", "Le gusta leer, que escriba y dibujando."), w(PARA, "El plan es reducir, reutilizar y reciclar.", "El plan es reducir, la reutilización y reciclando.", "El plan es que reduzcamos, reutilizar y reciclaje."),
  w(PARA, "Viajamos en bus, en tren y en bote.", "Viajamos en bus, tren y en bote.", "Viajamos en bus, tomando el tren y bote."), w(PARA, "Es una alumna puntual, ordenada y creativa.", "Es una alumna puntual, con orden y que crea.", "Es una alumna puntual, ordenada y tiene creatividad."),
  w(PARA, "Prefiero caminar a correr.", "Prefiero caminar a carrera.", "Prefiero caminar a la carrera de correr."), w(PARA, "No solo canta bien, sino que también baila bien.", "No solo canta bien, sino también el baile.", "No solo canta bien, sino bailando también."),
  w(PARA, "Hay que lavar, pelar y cortar las papas.", "Hay que lavar, pelando y cortar papas.", "Hay que lavar, que se pelen y cortar las papas."), w(PARA, "Ganó por su esfuerzo, su talento y su disciplina.", "Ganó por su esfuerzo, ser talentoso y porque era disciplinado.", "Ganó por su esfuerzo, talentoso y disciplina."),
];
const REDUNDANT = "¿Qué versión elimina la redundancia?";
const REDUNDANCY: ChoiceItem[] = [
  pt(REDUNDANT, "Subió arriba al techo para arreglar la antena.", "Subió al techo para arreglar la antena.", "Subió arriba para arreglar la antena del techo.", "Subió arriba."),
  pt(REDUNDANT, "En mi opinión personal, creo que el plan es bueno.", "Creo que el plan es bueno.", "En mi opinión personal, el plan es bueno y lo creo.", "Opino."),
  pt(REDUNDANT, "Fue una sorpresa inesperada para todos.", "Fue una sorpresa para todos.", "Fue una sorpresa inesperada y no esperada para todos.", "Sorpresa."),
  pt(REDUNDANT, "Volvió a repetir la misma pregunta otra vez.", "Repitió la pregunta.", "Volvió a repetir la pregunta otra vez más.", "Preguntó."),
  pt(REDUNDANT, "Salió afuera a ver la lluvia.", "Salió a ver la lluvia.", "Salió afuera de la casa a ver la lluvia que caía.", "Salió."),
  pt(REDUNDANT, "Es un hecho real que el clima está cambiando.", "Es un hecho que el clima está cambiando.", "Es un hecho real y verdadero que el clima está cambiando.", "Cambia."),
  pt(REDUNDANT, "Entramos adentro del museo a las diez.", "Entramos al museo a las diez.", "Entramos adentro al interior del museo a las diez.", "Entramos."),
  pt(REDUNDANT, "Los dos gemelos se parecen mucho.", "Los gemelos se parecen mucho.", "Los dos gemelos son dos y se parecen mucho entre ellos.", "Gemelos."),
];

// --- T. Corregir y revisar -------------------------------------------------------

const CONFUSED_USE: ChoiceItem[] = [
  f("No sé ___ llegó tarde.", "por qué", "porque", "porqué"), f("Llegó tarde ___ perdió el bus.", "porque", "por qué", "porqué"),
  f("Nadie entiende el ___ de su decisión.", "porqué", "por qué", "porque"), f("No es rojo, ___ granate.", "sino", "si no", "sino que"),
  f("___ estudias, no aprobarás.", "Si no", "Sino", "Si nó"), f("Canta bien y ___ baila.", "también", "tan bien", "tam bien"),
  f("Nunca la había oído cantar ___.", "tan bien", "también", "tanbien"), f("El director habló; ___, la profesora dio un aviso.", "asimismo", "a sí mismo", "a si mismo"),
  f("Se miró ___ en el espejo.", "a sí mismo", "asimismo", "así mismo"), f("No sé ___ vas a ir.", "adónde", "adonde", "a dónde va"),
  f("Llegaste tarde, ___ no reclames.", "conque", "con que", "con qué"), f("¿___ pagarás la entrada?", "Con qué", "Conque", "Con que"),
];
const CONFUSED_FIX: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "No vino porque estaba enfermo.", "No vino por qué estaba enfermo.", "No vino porqué estaba enfermo."), w("¿Qué oración está bien escrita?", "¿Por qué no me avisaste?", "¿Porque no me avisaste?", "¿Porqué no me avisaste?"),
  w("¿Qué oración está bien escrita?", "No quiero té, sino café.", "No quiero té, si no café.", "No quiero té, sí no café."), w("¿Qué oración está bien escrita?", "Si no llueve, iremos al parque.", "Sino llueve, iremos al parque.", "Si nó llueve, iremos al parque."),
  w("¿Qué oración está bien escrita?", "Ella también vendrá a la fiesta.", "Ella tan bien vendrá a la fiesta.", "Ella tambien vendrá a la fiesta."), w("¿Qué oración está bien escrita?", "Se habla a sí mismo cuando estudia.", "Se habla asimismo cuando estudia.", "Se habla a si mismo cuando estudia."),
  w("¿Qué oración está bien escrita?", "Sobre todo, cuida tu salud.", "Sobretodo, cuida tu salud.", "Sobre-todo, cuida tu salud."), w("¿Qué oración está bien escrita?", "Los demás llegaron tarde.", "Los de más llegaron tarde.", "Los demas llegaron tarde."),
];
const SIGNS: ChoiceItem[] = [
  pt("¿Cómo se corrige el cartel?", "«SE VENDE HELADOS»", "«SE VENDEN HELADOS»", "«SE BENDEN HELADOS»", "«VENDE HELADOS SE»"),
  pt("¿Cómo se corrige el cartel?", "«PROIBIDO ESTACIONAR»", "«PROHIBIDO ESTACIONAR»", "«PROVIDO ESTACIONAR»", "«PROHIVIDO ESTACIONAR»"),
  pt("¿Cómo se corrige el cartel?", "«NO HAI ATENCIÓN LOS DOMINGOS»", "«NO HAY ATENCIÓN LOS DOMINGOS»", "«NO AY ATENCIÓN LOS DOMINGOS»", "«NO AHÍ ATENCIÓN LOS DOMINGOS»"),
  pt("¿Cómo se corrige el cartel?", "«SE ARREGLA ZAPATOS»", "«SE ARREGLAN ZAPATOS»", "«SE AREGLAN ZAPATOS»", "«SE ARREGLAN SAPATOS»"),
  pt("¿Cómo se corrige el cartel?", "«CUIDADO: PISO MOJADO, CAMINE DESPASIO»", "«CUIDADO: PISO MOJADO, CAMINE DESPACIO»", "«CUIDADO: PISO MOGADO, CAMINE DESPACIO»", "«CUIDADO: PISO MOJADO, CAMINE DEZPACIO»"),
  pt("¿Cómo se corrige el cartel?", "«ALQUILO CUARTO PARA SEÑORITA CON BAÑO»", "«ALQUILO CUARTO CON BAÑO PARA SEÑORITA»", "«ALQUILO CON BAÑO SEÑORITA PARA CUARTO»", "«ALQUILO SEÑORITA CON BAÑO PARA CUARTO»"),
  pt("¿Cómo se corrige el cartel?", "«ABIERTO DE LUNES A VIERNES DE 9 HA 5»", "«ABIERTO DE LUNES A VIERNES DE 9 A 5»", "«ABIERTO DE LUNES HA VIERNES DE 9 A 5»", "«AVIERTO DE LUNES A VIERNES DE 9 A 5»"),
  pt("¿Cómo se corrige el cartel?", "«SE RECIVEN PEDIDOS POR TELÉFONO»", "«SE RECIBEN PEDIDOS POR TELÉFONO»", "«SE RESIBEN PEDIDOS POR TELÉFONO»", "«SE RECIBE PEDIDOS POR TELÉFONO»"),
];
const FIX = "¿Cómo se corrige la oración?";
const EVERYDAY: ChoiceItem[] = [
  pt(FIX, "Hubieron muchos accidentes este feriado.", "Hubo muchos accidentes este feriado.", "Hubieran muchos accidentes este feriado.", "Habieron muchos accidentes este feriado."),
  pt(FIX, "Ojalá que no haiga examen mañana.", "Ojalá que no haya examen mañana.", "Ojalá que no halla examen mañana.", "Ojalá que no aiga examen mañana."),
  pt(FIX, "¿Tú dijistes eso en la reunión?", "¿Tú dijiste eso en la reunión?", "¿Tú dijites eso en la reunión?", "¿Tú decistes eso en la reunión?"),
  pt(FIX, "Este celular es más mejor que el otro.", "Este celular es mejor que el otro.", "Este celular es más bueno mejor que el otro.", "Este celular es muy mejor que el otro."),
  pt(FIX, "Pienso de que deberíamos salir temprano.", "Pienso que deberíamos salir temprano.", "Pienso en de que deberíamos salir temprano.", "Pienso de qué deberíamos salir temprano."),
  pt(FIX, "Me olvidé que tenía tarea.", "Me olvidé de que tenía tarea.", "Me olvidé de qué tenía tarea.", "Me olvidé que de tenía tarea."),
  pt(FIX, "Ayer andé por el centro de Lima.", "Ayer anduve por el centro de Lima.", "Ayer andí por el centro de Lima.", "Ayer andó por el centro de Lima."),
  pt(FIX, "Me se cayó el lapicero en el bus.", "Se me cayó el lapicero en el bus.", "Me cayó se el lapicero en el bus.", "Se me cayí el lapicero en el bus."),
  pt(FIX, "La gente salieron corriendo del estadio.", "La gente salió corriendo del estadio.", "La gente salían corriendo del estadio.", "La gentes salió corriendo del estadio."),
];
const REVISE = "¿Qué revisión mejora el texto?";
const REVISIONS: ChoiceItem[] = [
  pt(REVISE, "«El Perú tiene mucha biodiversidad. El Perú tiene muchas aves. El Perú tiene muchas plantas».", "Unir las oraciones: «El Perú tiene una gran biodiversidad: muchas aves y plantas».", "Agregar otra oración que empiece con «El Perú tiene», por ejemplo: «El Perú tiene muchos mamíferos y peces».", "Borrar todo."),
  pt(REVISE, "«Después de comer, el perro de mi tía que vive en Ica salió a jugar».", "Aclarar: «Después de comer, el perro salió a jugar; es de mi tía, que vive en Ica».", "Agregar más datos sobre la ciudad de Ica, sus viñedos, su clima soleado y el oasis de Huacachina.", "Quitar «el perro»."),
  pt(REVISE, "«La conferencia estuvo bacán y el expositor era un capo».", "Usar un registro formal: «La conferencia fue excelente y el expositor, muy competente».", "Agregar más jergas y expresiones juveniles para que el texto suene más natural, cercano y divertido para el lector.", "Dejarla igual."),
  pt(REVISE, "«Primero cocinamos. Luego compramos los ingredientes. Al final comimos».", "Ordenar: comprar los ingredientes, luego cocinar y al final comer.", "Agregar más pasos al final de la lista, como lavar los platos, secarlos y guardarlos en el armario.", "Quitar «al final»."),
  pt(REVISE, "«Hay que cuidar el agua. Por ejemplo, los osos polares viven en el Ártico».", "Cambiar el ejemplo por uno pertinente: «cerrar el caño al cepillarse».", "Agregar más información sobre los osos polares, su dieta y el hielo del Ártico donde viven y cazan focas.", "Quitar «Hay que»."),
  pt(REVISE, "«Ella le dijo a su hermana que su examen había salido mal».", "Aclarar de quién es el examen: «Ella le dijo a su hermana: “Mi examen salió mal”».", "Agregar la nota exacta que sacó en el examen de matemáticas y el nombre del profesor que lo calificó.", "Quitar «su»."),
];

// --- U. Investigación ------------------------------------------------------------

const RELEVANT: ChoiceItem[] = [
  pt("¿Qué fuente es más pertinente?", "Tema: La contaminación del lago Titicaca.", "Un informe de la Autoridad Nacional del Agua sobre la calidad del lago", "Un blog de viajes con muchas fotos de los uros y de sus islas flotantes de totora", "Una receta de trucha"),
  pt("¿Qué fuente es más pertinente?", "Tema: La vida de Micaela Bastidas.", "Una biografía publicada por un historiador", "Una película de acción ambientada en el Cusco actual, con persecuciones y explosiones", "Un mapa del Cusco"),
  pt("¿Qué fuente es más pertinente?", "Tema: Los efectos del sueño en el aprendizaje.", "Un artículo científico de una revista de neurología", "Un anuncio de colchones que promete dormir mejor", "Un poema sobre la noche"),
  pt("¿Qué fuente es más pertinente?", "Tema: El crecimiento de Lima en el siglo XX.", "Los censos nacionales del INEI de 1940 a 1993", "Una guía de restaurantes y cafés de moda en Miraflores y Barranco", "Un mapa del metro"),
  pt("¿Qué fuente es más pertinente?", "Tema: La pesca de la anchoveta.", "Un informe del Instituto del Mar del Perú (Imarpe)", "Una publicación de una persona en redes sobre su almuerzo", "Un cuento de pescadores"),
  pt("¿Qué fuente es más pertinente?", "Tema: El cambio climático en los Andes.", "Un estudio del Inaigem sobre los glaciares peruanos", "Un video viral de una nevada en Europa", "Una postal del Huascarán"),
];
const BIAS = sorter(["Neutral", "Sesgado"], "¿El titular es neutral o sesgado?");
const HEADLINES: ChoiceItem[] = [
  ...["Congreso aprueba ley de transporte con 70 votos a favor", "Se registra sismo de magnitud 5,2 en Ica", "Municipalidad inaugura nueva biblioteca en Comas", "Precio del limón sube 20 % en mercados de Lima"].map((x) => BIAS(x, 0)),
  ...["Congreso impone otra ley absurda que nadie pidió", "Vecinos heroicos salvan el barrio que el alcalde abandonó", "La vergonzosa derrota del equipo nacional", "Por fin una medida inteligente del ministerio"].map((x) => BIAS(x, 1)),
];
const REF = "Referencia: Arguedas, J. M. (1958). Los ríos profundos. Losada.";
const WORKS_CITED: ChoiceItem[] = [
  pt("¿Qué parte de la referencia es el año?", REF, "1958", "Losada", "J. M."), pt("¿Qué parte de la referencia es la editorial?", REF, "Losada", "1958", "Los ríos profundos"),
  pt("¿Qué parte de la referencia es el autor?", REF, "Arguedas, J. M.", "Losada", "Los ríos profundos"), pt("¿Qué parte de la referencia es el título?", REF, "Los ríos profundos", "Arguedas, J. M.", "Losada"),
  pt("En formato APA, ¿cómo se escribe el título de un libro?", "Referencia: Vargas Llosa, M. (1963). La ciudad y los perros. Seix Barral.", "En cursiva", "Entre comillas", "En mayúsculas"), pt("¿Qué va primero en una referencia APA?", "Referencia: Matto de Turner, C. (1889). Aves sin nido. Imprenta del Universo.", "El apellido del autor", "El título de la obra", "La editorial"),
  w("¿Qué referencia está bien escrita en formato APA?", "Quispe, A. (2021). Leyendas del lago. Editorial Andina.", "Leyendas del lago, Ana Quispe, 2021, Editorial Andina.", "Ana Quispe. 2021. «Leyendas del lago»."), w("En APA, ¿dónde va el año de publicación?", "Entre paréntesis, después del autor", "Al final, después de la editorial", "Antes del nombre del autor"),
];
const IN_TEXT: ChoiceItem[] = [
  w("¿Qué cita textual está bien hecha en formato APA?", "Según Ramos (2019), «leer es conversar con quienes no conocemos» (p. 12).", "Según Ramos, leer es conversar con quienes no conocemos.", "«Leer es conversar con quienes no conocemos» (Ana, 2019)."),
  w("¿Qué cita parafraseada está bien hecha en formato APA?", "Los glaciares peruanos han perdido más de la mitad de su superficie (Inaigem, 2023).", "Los glaciares peruanos han perdido más de la mitad de su superficie (2023, p.).", "Los glaciares han perdido superficie, dice internet."),
  w("En APA, ¿qué datos lleva una cita dentro del texto?", "El apellido del autor y el año", "El título del libro y la editorial", "Solo el nombre del autor"),
  w("En una cita textual, ¿qué dato adicional se agrega?", "El número de página", "La ciudad de la editorial", "El correo del autor"),
  w("¿Cómo se cita una obra de dos autores en APA?", "(Cueto y Sánchez, 2019)", "(Cueto, Sánchez, Pérez y otros, 2019)", "(2019, Cueto)"),
  w("¿Cómo se cita una obra de tres o más autores en APA?", "(Quispe et al., 2021)", "(Quispe, 2021, y todos los demás autores)", "(et al., 2021)"),
  w("¿Cuándo se usan comillas en una cita APA?", "Cuando se copian las palabras exactas del autor", "Cuando se resumen las ideas del autor con otras palabras", "Siempre"),
];
const PLAG = sorter(["Es plagio", "No es plagio"], "¿Es plagio?");
const PLAGIARISM: ChoiceItem[] = [
  ...["Copiar un párrafo de una página web y presentarlo como propio.", "Cambiar algunas palabras de un texto ajeno sin citar la fuente.", "Entregar como tuyo un trabajo que hizo un compañero.", "Usar una foto de internet en un afiche sin indicar el autor."].map((x) => PLAG(x, 0)),
  ...["Copiar una frase entre comillas e indicar el autor y el año.", "Resumir una idea con tus palabras y citar la fuente.", "Escribir tus propias opiniones sobre un tema.", "Usar datos de un informe y poner la referencia al final."].map((x) => PLAG(x, 1)),
];

export const ROWS: Row[] = [
  ["O.1", "Ordenar temas del más amplio al más específico", (r) => order(r, "Ordena los temas del más amplio al más específico.", BROAD_NARROW)],
  ["O.2", "Organizar la información por tema", (r) => choose(r, "", BY_TOPIC)],
  ["O.3", "Quitar la oración que no pertenece", (r) => choose(r, "", NOT_BELONG)],
  ["O.4", "Elegir la oración temática que mejor recoge la idea principal", (r) => choose(r, "", TOPIC_SENTENCE)],

  ["P.1", "Distinguir hechos de opiniones", (r) => choose(r, "", FACT_OPINION)],
  ["P.2", "Identificar la tesis", (r) => choose(r, "", THESES)],
  ["P.3", "Elegir evidencias que apoyen una afirmación", (r) => choose(r, "", EVIDENCE)],
  ["P.4", "Identificar contraargumentos", (r) => choose(r, "", COUNTERCLAIMS)],
  ["P.5", "Identificar apelaciones al ethos, al pathos y al logos en los anuncios", (r) => choose(r, "", APPEALS)],
  ["P.6", "Clasificar falacias lógicas", (r) => choose(r, "", FALLACIES)],

  ["Q.1", "Usar la personificación", (r) => choose(r, "", PERSONIFICATION)],
  ["Q.2", "Crear oraciones variadas a partir de modelos", (r) => choose(r, "", VARIED)],
  ["Q.3", "Mejorar la oración con un verbo más preciso", (r) => choose(r, "", STRONG_VERB)],

  ["R.1", "Identificar detalles de apoyo en textos informativos", (r) => choose(r, "", SUPPORT_INFO)],
  ["R.2", "Identificar detalles de apoyo en textos literarios", (r) => choose(r, "", SUPPORT_LIT)],

  ["S.1", "Conectar ideas con conectores: sin embargo, por lo tanto, en cambio, es decir", (r) => choose(r, "Completa con el mejor conector.", CONJ_ADV)],
  ["S.2", "Usar estructuras paralelas", (r) => choose(r, "", PARALLEL)],
  ["S.3", "Eliminar palabras o frases redundantes", (r) => choose(r, "", REDUNDANCY)],

  ["T.1", "Usar la palabra correcta entre las que se confunden", (r) => choose(r, "Completa la oración.", CONFUSED_USE)],
  ["T.2", "Corregir errores con palabras que se confunden", (r) => choose(r, "", CONFUSED_FIX)],
  ["T.3", "Corregir errores en carteles", (r) => choose(r, "", SIGNS)],
  ["T.4", "Corregir errores del habla cotidiana", (r) => choose(r, "", EVERYDAY)],
  ["T.5", "Proponer revisiones adecuadas", (r) => choose(r, "", REVISIONS)],

  ["U.1", "Identificar fuentes pertinentes", (r) => choose(r, "", RELEVANT)],
  ["U.2", "Evaluar si un titular periodístico es sesgado", (r) => choose(r, "", HEADLINES)],
  ["U.3", "Reconocer las partes de una referencia bibliográfica (formato APA)", (r) => choose(r, "", WORKS_CITED)],
  ["U.4", "Usar citas dentro del texto (formato APA)", (r) => choose(r, "", IN_TEXT)],
  ["U.5", "Identificar el plagio", (r) => choose(r, "", PLAGIARISM)],
];
