import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import { pt, read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 3.° de Secundaria · banco de lecturas largas. Los textos históricos son
// discursos y escritos peruanos (San Martín, Bolognesi, González Prada,
// Mariátegui), resumidos y con las frases más célebres citadas tal como se
// conocen. Estudio de la novela «La ciudad y los perros» (Mario Vargas Llosa)
// con resúmenes propios, no citas textuales; el informe de la Comisión de la
// Verdad y Reconciliación y la memoria del conflicto armado interno, con
// textos propios; y documentos de trabajo (correos, memorandos, cartas y
// avisos) de instituciones peruanas ficticias.


// --- Textos históricos e informativos ------------------------------------------

const HISTORIC_1 = [
  read("La proclamación de la independencia (1821)", "🇵🇪", "El 28 de julio de 1821, en la plaza de Armas de Lima, José de San Martín proclamó: «El Perú es desde este momento libre e independiente por la voluntad general de los pueblos y por la justicia de su causa que Dios defiende». Luego, agitando la bandera, gritó tres veces: «¡Viva la patria! ¡Viva la libertad! ¡Viva la independencia!». La proclamación era breve, pero cada palabra estaba elegida para dar legitimidad al nuevo país.",
    ["¿En qué basa San Martín la legitimidad de la independencia?", "En la voluntad de los pueblos y la justicia de la causa", "En la fuerza de su ejército y en las armas traídas de Chile y Argentina", "En el dinero"],
    ["¿Qué recurso retórico usa al final?", "La repetición de «¡Viva…!» para emocionar y unir", "Una estadística sobre la población de Lima en 1821", "Una pregunta"],
    ["¿Por qué menciona a Dios?", "Para presentar la causa como justa y respaldada por una autoridad superior", "Para anunciar la construcción de una nueva iglesia en la plaza de Armas", "Por costumbre"]),
  read("La respuesta de Bolognesi (1880)", "🎖️", "En junio de 1880, durante la guerra del Pacífico, el ejército chileno rodeaba el morro de Arica. Un emisario pidió al coronel Francisco Bolognesi que se rindiera, pues la defensa era imposible. Bolognesi reunió a sus oficiales y respondió: «Tengo deberes sagrados que cumplir y los cumpliré hasta quemar el último cartucho». Al día siguiente, la plaza cayó y Bolognesi murió en combate. Su frase se convirtió en un símbolo del deber patriótico.",
    ["¿A qué valor apela la frase de Bolognesi?", "Al deber y al honor", "A la riqueza que obtendrían si ganaban la batalla", "Al miedo"],
    ["¿Qué efecto tiene la expresión «hasta quemar el último cartucho»?", "Transmite una determinación absoluta de no rendirse.", "Indica que tenía muchas armas y que la victoria era segura.", "Habla de fuegos artificiales."],
    ["¿Por qué la frase se volvió un símbolo?", "Porque representa la fidelidad al deber aun ante la derrota segura", "Porque gracias a ella el Perú ganó la guerra del Pacífico", "Porque rima"]),
];
const HISTORIC_2 = [
  read("El discurso del Politeama (1888)", "🎭", "Cinco años después de la derrota en la guerra del Pacífico, Manuel González Prada pronunció en el teatro Politeama de Lima un discurso que escandalizó a muchos. Culpó de la derrota a una clase dirigente corrupta e indiferente, y recordó que el verdadero Perú estaba formado por los indígenas, excluidos de la nación. Terminó con una frase que se haría célebre: «¡Los viejos a la tumba, los jóvenes a la obra!».",
    ["¿A quién culpa González Prada de la derrota?", "A una clase dirigente corrupta e indiferente", "A los indígenas que no quisieron pelear en la guerra", "A los jóvenes"],
    ["¿Qué recurso usa en su frase final?", "Una antítesis entre viejos y jóvenes, en forma de llamado", "Una metáfora extensa sobre el mar, los barcos y la guerra naval del Pacífico", "Una pregunta retórica"],
    ["¿Por qué el discurso escandalizó?", "Porque criticó duramente a los grupos de poder", "Porque elogió a los vencedores chilenos y pidió que se quedaran a gobernar el Perú", "Porque fue muy largo"]),
  read("Mariátegui y el problema de la tierra (1928)", "🌾", "En «7 ensayos de interpretación de la realidad peruana», José Carlos Mariátegui rechazó las explicaciones de su época sobre la pobreza indígena. No se trataba, dijo, de un problema de raza, ni de educación, ni de moral. La raíz estaba en la economía: en el gamonalismo, un sistema en que grandes propietarios controlaban la tierra y el trabajo de las comunidades. Para Mariátegui, sin cambiar la propiedad de la tierra, ninguna escuela ni ninguna ley resolvería el problema.",
    ["¿Qué estrategia argumentativa usa Mariátegui?", "Descarta explicaciones rivales antes de presentar la suya.", "Cuenta una anécdota de su infancia en una hacienda andina.", "Usa humor."],
    ["¿Cuál es, para él, la raíz del problema?", "La concentración de la tierra en manos de gamonales", "La falta de escuelas, maestros y libros en las comunidades campesinas", "El clima"],
    ["¿Qué implica su conclusión?", "Que las soluciones educativas o legales son insuficientes sin cambio económico", "Que las escuelas y las leyes son la única solución posible y suficiente para el problema del indio", "Nada"]),
];
const DEVELOPMENT_1 = [
  read("El Qhapaq Ñan", "🛤️", "El Qhapaq Ñan, la red vial de los incas, se extendía por más de 30 000 kilómetros a través de seis países actuales. Primero, fue una herramienta militar: permitía mover ejércitos con rapidez. Con el tiempo, se volvió también una vía de comercio, de comunicación con los chasquis y de control administrativo. Hoy cumple una tercera función: es Patrimonio de la Humanidad y une a comunidades que lo usan y lo cuidan.",
    ["¿Cómo desarrolla el autor la idea central?", "Muestra cómo cambió la función del camino a lo largo del tiempo.", "Compara el Qhapaq Ñan con las autopistas modernas de Europa y de los Estados Unidos.", "Narra un viaje."],
    ["¿Qué palabras marcan la progresión de las ideas?", "«Primero», «Con el tiempo» y «Hoy»", "«se extendía por más de 30 000 kilómetros a través de seis países»", "«seis países actuales»"],
    ["¿Qué idea une todo el texto?", "El Qhapaq Ñan siempre ha conectado pueblos, aunque con funciones distintas.", "El Qhapaq Ñan fue destruido por completo por los españoles durante la Conquista y hoy ya no existe.", "Los chasquis corrían rápido."]),
  read("La migración interna", "🚌", "A mediados del siglo XX, Lima tenía menos de un millón de habitantes. En las décadas siguientes, cientos de miles de personas llegaron desde los Andes, buscando trabajo y educación. Al no encontrar vivienda, ocuparon arenales y cerros, donde levantaron con sus propias manos barrios enteros. Esos barrios, al principio precarios, se convirtieron con los años en distritos con mercados, colegios y universidades. La migración no solo cambió el tamaño de Lima: cambió su música, su comida y su identidad.",
    ["¿Cómo se organiza el desarrollo del texto?", "Avanza cronológicamente desde la llegada de los migrantes hasta sus efectos.", "Compara Lima con otras capitales de Sudamérica, como Bogotá, Santiago y Buenos Aires, en población.", "Da instrucciones."],
    ["¿Qué ampliación de la idea plantea la última oración?", "La migración cambió también la cultura de Lima.", "La migración fue un fenómeno pequeño y sin consecuencias.", "Lima es grande."],
    ["¿Qué muestra el paso de «barrios precarios» a «distritos»?", "El esfuerzo colectivo que transformó la ciudad", "Que el gobierno construyó todos los barrios con casas prefabricadas y entregadas gratis", "Que nadie vive allí"]),
];
const DEVELOPMENT_2 = [
  read("El cambio climático en los Andes", "🏔️", "El retroceso de los glaciares empezó como un dato científico: mediciones que mostraban pérdidas de hielo año tras año. Luego se volvió un problema económico: menos agua para el riego y las hidroeléctricas. Hoy es también un problema social: comunidades que deben migrar o cambiar sus cultivos, y conflictos por el acceso al agua. El texto muestra cómo un fenómeno físico se convierte, paso a paso, en un asunto humano.",
    ["¿Cómo desarrolla el autor su tema?", "Amplía el problema de lo científico a lo económico y lo social.", "Narra la historia de un glaciar desde su formación hace miles de años hasta su desaparición.", "Da solo datos."],
    ["¿Qué palabra señala la última etapa?", "«Hoy»", "«Hoy es también»", "«empezó»"],
    ["¿Qué función cumple la última oración?", "Explicita la estructura del propio texto.", "Presenta una solución concreta al problema del retroceso de los glaciares.", "Cambia de tema."]),
  read("La anemia, más que salud", "🩸", "A primera vista, la anemia infantil es un problema de salud: falta de hierro en la sangre. Pero sus efectos van más allá. Un niño con anemia aprende con más dificultad, lo que afecta su rendimiento escolar. Con los años, eso reduce sus oportunidades de empleo. Y un país con millones de niños anémicos pierde capacidad de desarrollo. Así, lo que empieza en el plato termina en la economía nacional.",
    ["¿Qué estructura sigue el desarrollo?", "Una cadena de consecuencias cada vez más amplias", "Una comparación entre dos enfermedades distintas", "Una lista de recetas"],
    ["¿Qué recurso usa la última oración?", "Una síntesis con contraste entre el plato y la economía", "Una pregunta retórica sin respuesta dirigida a las autoridades de salud", "Una cita médica"],
    ["¿Qué quiere demostrar el autor?", "Que la anemia es también un problema social y económico", "Que la anemia solo afecta a los adultos mayores que viven en las ciudades", "Nada"]),
];

// --- Argumentos -----------------------------------------------------------------

const ARGS_1 = [
  read("¿Voto a los 16?", "🗳️", "Los jóvenes de 16 años deberían poder votar. A esa edad ya trabajan muchos, pagan impuestos y pueden ser juzgados por la ley; es justo que también elijan a quienes deciden sobre sus vidas. Además, países como Argentina y Brasil ya lo permiten, y la participación juvenil ha sido alta. Se dirá que no están preparados. Pero la preparación no se mide por la edad: muchos adultos votan sin informarse. Lo que hace falta es educación cívica en el colegio, no excluir a una generación entera.",
    ["¿Cuál es la tesis?", "Los jóvenes de 16 años deberían poder votar.", "Los jóvenes no están preparados y no deben votar.", "Argentina es grande."],
    ["¿Qué tipo de evidencia usa en el segundo argumento?", "Ejemplos de otros países", "Una encuesta realizada en su colegio", "Una anécdota"],
    ["¿Cómo refuta el contraargumento?", "Afirma que la preparación no depende de la edad y propone educación cívica.", "Acepta que los jóvenes no están preparados y cambia de opinión.", "No lo refuta."]),
  read("Bibliotecas abiertas de noche", "📚", "Las bibliotecas municipales deberían abrir hasta las diez de la noche. Muchos estudiantes trabajan de día y no tienen en casa un lugar tranquilo para estudiar. Una biblioteca abierta de noche es, para ellos, la diferencia entre aprobar o abandonar. El costo sería pequeño: bastaría un turno adicional de personal. Algunos dirán que la ciudad es insegura de noche; precisamente por eso, un espacio público iluminado y concurrido hace más segura la zona.",
    ["¿Qué razón principal da el autor?", "Muchos estudiantes trabajan de día y necesitan un lugar para estudiar.", "Las bibliotecas tienen demasiados libros que nadie lee.", "Le gusta la noche."],
    ["¿Cómo responde a la objeción de la inseguridad?", "Convierte la objeción en un argumento a favor.", "Admite que tiene razón y retira su propuesta.", "No responde."],
    ["¿Qué argumento usa sobre el costo?", "Que sería pequeño", "Que sería muy alto, pero valdría la pena", "No habla del costo"]),
];
const ARGS_2 = [
  read("Menos tareas, más lectura", "📖", "Las tareas escolares excesivas no mejoran el aprendizaje. Diversos estudios muestran que, en secundaria, los beneficios de las tareas se estancan después de una o dos horas diarias. Más allá de eso, aumentan el cansancio y el estrés. Propongo reemplazar parte de las tareas por media hora diaria de lectura libre. Quienes defienden las tareas dirán que crean hábitos de estudio. Es cierto, pero la lectura libre también crea hábitos, y además desarrolla vocabulario y pensamiento crítico.",
    ["¿Qué evidencia ofrece el autor?", "Estudios sobre el estancamiento de los beneficios de las tareas", "Su experiencia personal como alumno de secundaria", "Ninguna"],
    ["¿Qué hace el autor con el contraargumento?", "Lo concede en parte y muestra que su propuesta también cumple ese objetivo.", "Lo ignora por completo.", "Lo acepta y cambia su tesis."],
    ["¿Cuál es la propuesta?", "Reemplazar parte de las tareas por lectura libre", "Eliminar todas las tareas y la lectura", "Más tareas"]),
  read("El plástico de un solo uso", "🛍️", "El Perú debería prohibir por completo el plástico de un solo uso. La ley que cobra por las bolsas redujo su consumo, pero no lo eliminó, y seguimos encontrando sorbetes y tecnopor en nuestras playas. Las alternativas existen: envases de papel, bolsas de tela, recipientes reutilizables. Algunos comerciantes temen el aumento de costos; sin embargo, ese costo es menor que el de limpiar el mar y perder la pesca.",
    ["¿Qué argumento usa para mostrar que la medida actual no basta?", "Que la ley redujo, pero no eliminó, el consumo", "Que las bolsas de plástico son más baratas que las de tela", "Que el mar es grande"],
    ["¿Cómo responde a la preocupación de los comerciantes?", "Compara ese costo con uno mayor: el daño ambiental.", "Les promete un subsidio del Estado para comprar bolsas.", "No responde."],
    ["¿Qué tipo de razonamiento predomina?", "Comparación de costos y beneficios", "Narración de una historia personal", "Ataque personal"]),
];

// --- «La ciudad y los perros» ------------------------------------------------------

const PERROS = [
  [
    read("«La ciudad y los perros»: el colegio militar (resumen)", "🎖️", "La novela de Mario Vargas Llosa, publicada en 1963, transcurre en el Colegio Militar Leoncio Prado, en Lima. Allí conviven cadetes de todas las clases sociales y regiones del país. A los de primer año los llaman «perros», y los mayores los someten a humillaciones. Para sobrevivir, algunos forman el «Círculo», un grupo que impone su propia ley y que lidera el Jaguar, el cadete más temido. La violencia no es la excepción, sino la regla del colegio.",
    ["¿Por qué a los cadetes de primer año los llaman «perros»?", "Porque los mayores los humillan y los tratan como inferiores", "Porque cuidan a los perros del colegio militar", "Por cariño"],
    ["¿Qué es el «Círculo»?", "Un grupo que impone su propia ley entre los cadetes", "Un club de lectura que fundaron los profesores del colegio", "Un deporte"],
    ["¿Qué idea plantea la última oración?", "Que la violencia forma parte del sistema del colegio", "Que el colegio es un lugar tranquilo y seguro", "Que hay pocos cadetes"]),
    read("«La ciudad y los perros»: el robo del examen (resumen)", "📄", "Un miembro del Círculo, Cava, roba las preguntas de un examen de química y rompe un vidrio al hacerlo. Los oficiales castigan a toda la sección sin salida hasta encontrar al culpable. Ricardo Arana, apodado el Esclavo por su timidez, desespera por salir a ver a Teresa, la chica que le gusta. Finalmente, delata a Cava, que es expulsado. Su decisión, que busca escapar del encierro, desencadenará la tragedia.",
    ["¿Por qué el Esclavo delata a Cava?", "Porque desea salir del encierro para ver a Teresa", "Porque Cava le pidió que lo delatara para salir del colegio", "Por dinero"],
    ["¿Qué castigo colectivo imponen los oficiales?", "Dejar sin salida a toda la sección", "Expulsar a todos los cadetes de la sección", "Ninguno"],
    ["¿Qué anticipa la última oración?", "Que la delación tendrá consecuencias graves", "Que todo terminará bien para el Esclavo", "Nada"]),
  ],
  [
    read("«La ciudad y los perros»: la muerte del Esclavo (resumen)", "⚠️", "Durante unas maniobras militares en el campo, el Esclavo recibe un disparo en la cabeza y muere días después. Los oficiales lo declaran un accidente. Alberto, llamado el Poeta porque escribe cartas y novelitas por encargo, está convencido de que fue un asesinato y de que el Jaguar se vengó por la delación. Decide denunciarlo ante el teniente Gamboa, un oficial estricto pero honesto.",
    ["¿Qué versión oficial dan los oficiales sobre la muerte?", "Que fue un accidente", "Que fue un asesinato cometido por el Jaguar", "Que el Esclavo huyó"],
    ["¿Por qué Alberto sospecha del Jaguar?", "Cree que se vengó de la delación de Cava.", "Vio al Jaguar disparar con sus propios ojos durante las maniobras.", "Por envidia."],
    ["¿Por qué elige denunciarlo ante Gamboa?", "Porque es un oficial estricto pero honesto", "Porque Gamboa es su tío y lo va a proteger", "Por casualidad"]),
    read("«La ciudad y los perros»: el encubrimiento (resumen)", "🔒", "El coronel director no quiere un escándalo que dañe el prestigio del colegio. Amenaza a Alberto con expulsarlo por las novelitas que escribe y lo obliga a retirar la acusación. Gamboa, que quiso investigar, es castigado con un traslado a una guarnición lejana. Al final, el Jaguar confiesa el crimen a Gamboa, pero ya es tarde: el caso está cerrado. La novela muestra cómo una institución sacrifica la verdad para proteger su imagen.",
    ["¿Cómo logra el coronel que Alberto retire la denuncia?", "Amenazándolo con expulsarlo por sus novelitas", "Ofreciéndole un premio y una beca en el extranjero", "Convenciéndolo con pruebas"],
    ["¿Qué le ocurre a Gamboa?", "Es trasladado como castigo por querer investigar.", "Es ascendido a coronel por resolver el caso.", "Se jubila."],
    ["¿Qué crítica central hace la novela?", "La institución prioriza su imagen sobre la verdad y la justicia.", "Los cadetes deberían estudiar más química.", "Ninguna"]),
  ],
];

// --- Memoria del conflicto armado interno ----------------------------------------

const CVR = [
  [
    read("La Comisión de la Verdad y Reconciliación", "📘", "Entre 1980 y 2000, el Perú vivió un conflicto armado interno iniciado por el grupo terrorista Sendero Luminoso, al que se sumó luego el MRTA. En 2001, el Estado creó la Comisión de la Verdad y Reconciliación (CVR), presidida por Salomón Lerner Febres, para investigar lo ocurrido. Durante dos años, la CVR recogió cerca de 17 000 testimonios en todo el país. Su Informe Final, entregado en agosto de 2003, estimó que murieron o desaparecieron alrededor de 69 000 personas.",
    ["¿Para qué se creó la CVR?", "Para investigar los hechos del conflicto armado interno", "Para organizar las elecciones presidenciales de 2001 y contar los votos en todo el país", "Para construir escuelas"],
    ["¿Qué fuente principal usó la CVR?", "Miles de testimonios recogidos en todo el país", "Las noticias de los periódicos de Lima de la época", "Novelas"],
    ["¿Qué dato muestra la magnitud de la tragedia?", "Alrededor de 69 000 personas muertas o desaparecidas", "El informe se entregó en agosto de 2003.", "La CVR trabajó durante dos años en su sede de Lima, con un equipo de cientos de personas."]),
    read("¿Quiénes fueron las víctimas?", "🕯️", "Uno de los hallazgos más dolorosos de la CVR fue el perfil de las víctimas: la mayoría eran campesinos pobres de zonas rurales, y tres de cada cuatro tenían como lengua materna el quechua u otra lengua originaria. Ayacucho fue el departamento más golpeado. Según el informe, Sendero Luminoso fue el principal responsable de las muertes, pero también hubo graves violaciones de derechos humanos cometidas por agentes del Estado. Para la CVR, la violencia se ensañó con los más excluidos, a quienes el resto del país muchas veces no vio.",
    ["¿Qué rasgo común tenían la mayoría de las víctimas?", "Eran campesinos pobres, mayoritariamente quechuahablantes.", "Eran habitantes de Lima con estudios universitarios y trabajos en oficinas del centro.", "Eran extranjeros."],
    ["¿Qué responsabilidades señala el informe?", "Sendero Luminoso como principal responsable, y también violaciones cometidas por agentes del Estado", "Solo las de las rondas campesinas, que según el informe fueron las únicas responsables de todas las muertes", "Ninguna"],
    ["¿Qué crítica implica la última oración?", "Que la exclusión social permitió que la tragedia pasara desapercibida para muchos", "Que las víctimas fueron culpables de lo que les ocurrió por vivir lejos de las ciudades y no pedir ayuda a tiempo", "Ninguna"]),
  ],
  [
    read("«Yuyanapaq: para recordar»", "📷", "En 2003, la CVR presentó la muestra fotográfica «Yuyanapaq», palabra quechua que significa «para recordar». Reunía cientos de imágenes tomadas durante el conflicto: madres buscando a sus hijos, pueblos abandonados, funerales, rostros de víctimas y de sobrevivientes. La muestra buscaba que los peruanos que no vivieron la violencia de cerca pudieran verla y comprenderla. Para muchos visitantes, fue la primera vez que miraron de frente esa parte de su historia.",
    ["¿Qué significa «Yuyanapaq»?", "«Para recordar»", "«Para olvidar el pasado»", "«Paz»"],
    ["¿Cuál era el propósito de la muestra?", "Que quienes no vivieron la violencia la conocieran y comprendieran", "Vender fotografías a coleccionistas para financiar los gastos de la Comisión y de su personal", "Entretener"],
    ["¿Por qué el título está en quechua?", "Porque la mayoría de las víctimas hablaba quechua", "Porque la muestra se presentó solo en Ayacucho y en ninguna otra ciudad del país", "Por moda"]),
    read("El Lugar de la Memoria", "🏛️", "En 2015 se inauguró en Lima el Lugar de la Memoria, la Tolerancia y la Inclusión Social (LUM). Es un espacio que guarda testimonios, objetos y documentos del periodo de violencia, y organiza muestras y conversatorios. Su objetivo no es reabrir heridas, sino evitar que la historia se repita: conocer lo que ocurrió, reconocer a las víctimas y aprender a resolver los conflictos sin violencia. La memoria, sostienen sus promotores, es una forma de responsabilidad con el futuro.",
    ["¿Qué guarda el LUM?", "Testimonios, objetos y documentos del periodo de violencia", "Obras de arte colonial, pinturas de la escuela cusqueña y esculturas religiosas de los siglos XVII y XVIII", "Libros de cocina"],
    ["¿Cuál es su objetivo, según el texto?", "Evitar que la historia se repita mediante el conocimiento y el reconocimiento", "Reabrir heridas y buscar venganza contra los responsables, sin importar lo que digan los tribunales de justicia", "Atraer turistas"],
    ["¿Qué idea expresa la última oración?", "Que recordar el pasado es un compromiso con el porvenir", "Que el pasado no tiene importancia y conviene olvidarlo para poder avanzar como país", "Que el museo es grande"]),
  ],
];

// --- Documentos de trabajo -------------------------------------------------------

const EMAILS = [
  read("Correo: reunión de coordinación", "📧", "De: Patricia Ramos (Coordinación Académica)\nPara: Docentes de secundaria\nAsunto: Reunión de coordinación – jueves 14\n\nEstimados colegas:\nLes recuerdo que el jueves 14, a las 3:30 p. m., nos reuniremos en la sala de profesores para planificar la feria de ciencias. Por favor, traigan la lista de proyectos de sus secciones. Quienes no puedan asistir, envíenme la lista por este medio antes del miércoles.\n\nSaludos cordiales,\nPatricia",
    ["¿Cuál es el propósito del correo?", "Convocar a una reunión y pedir la lista de proyectos", "Felicitar a los docentes por la feria de ciencias del año pasado", "Cancelar la feria"],
    ["¿Qué deben hacer quienes no puedan asistir?", "Enviar la lista por correo antes del miércoles", "Ir a la reunión el viernes a la misma hora", "Nada"],
    ["¿Qué tono tiene el correo?", "Formal y cordial", "Informal y bromista", "Agresivo y exigente"]),
  read("Memorando: uso de laboratorios", "📋", "MEMORANDO N.º 012-2027-DIR\nDe: Dirección\nA: Personal docente y auxiliar\nAsunto: Uso de laboratorios\nFecha: 3 de abril de 2027\n\nA partir del lunes 7, el uso de los laboratorios deberá reservarse con 48 horas de anticipación en la ficha ubicada en secretaría. Los equipos se entregarán solo al docente responsable. Se agradece su cumplimiento.",
    ["¿Qué establece el memorando?", "Que los laboratorios deben reservarse con 48 horas de anticipación", "Que los laboratorios estarán cerrados todo el mes de abril", "Que se compraron equipos"],
    ["¿A quién se entregarán los equipos?", "Solo al docente responsable", "A cualquier alumno que los pida en la secretaría", "Al director"],
    ["¿Qué tipo de documento es?", "Una comunicación interna breve y oficial", "Una carta personal entre amigos", "Un aviso publicitario"]),
];
const LETTERS = [
  read("Carta de reclamo", "✉️", "Arequipa, 10 de mayo de 2027\n\nSeñores\nServicio de Agua Potable de Arequipa\nPresente.\n\nAsunto: Reclamo por facturación\n\nMe dirijo a ustedes para presentar un reclamo por el recibo de abril (suministro 45210), que registra un consumo de 80 m³, cuatro veces mayor que mi promedio mensual. Solicito la revisión del medidor y la corrección del monto. Adjunto copia de mis tres últimos recibos.\n\nAtentamente,\nJulio Mamani Quispe\nDNI 41234567",
    ["¿Cuál es el propósito de la carta?", "Reclamar por un cobro excesivo y pedir su corrección", "Felicitar a la empresa por su buen servicio durante abril", "Pedir trabajo"],
    ["¿Qué evidencia adjunta el autor?", "Copia de sus tres últimos recibos", "Una foto de su casa y del barrio", "Nada"],
    ["¿Qué fórmula de despedida usa?", "«Atentamente»", "«Un abrazo fuerte»", "«Chau»"]),
  read("Aviso municipal", "📢", "MUNICIPALIDAD DISTRITAL DE SANTA ROSA\nAVISO\n\nSe comunica a los vecinos que, por trabajos de mantenimiento, el parque central permanecerá cerrado del 2 al 15 de junio. Durante ese periodo, la feria dominical se trasladará a la losa deportiva de la calle Los Álamos. Agradecemos su comprensión.\n\nLa Gerencia de Servicios a la Ciudad",
    ["¿Qué informa el aviso?", "El cierre temporal del parque y el traslado de la feria", "La construcción de un nuevo parque en la calle Los Álamos", "Una fiesta"],
    ["¿Dónde se realizará la feria durante esas fechas?", "En la losa deportiva de la calle Los Álamos", "En el parque central, como siempre", "En la municipalidad"],
    ["¿Por qué se usa «Agradecemos su comprensión»?", "Para mantener una relación cordial ante una molestia", "Para pedir dinero a los vecinos", "Para despedirse de un amigo"]),
];

// --- Organizadores gráficos --------------------------------------------------------

const ORGANIZERS: ChoiceItem[] = [
  pt("¿Qué tipo de organizador gráfico es?", "En el centro, «Conflicto armado interno»; alrededor, «causas», «actores», «víctimas» y «consecuencias», cada uno con ejemplos.", "Mapa conceptual", "Línea de tiempo", "Diagrama de Venn"),
  pt("Según la línea de tiempo, ¿qué ocurrió en 2003?", "1980: inicio del conflicto · 1992: captura de Abimael Guzmán · 2001: creación de la CVR · 2003: Informe Final", "Se entregó el Informe Final de la CVR.", "Se creó la CVR y empezó a recoger testimonios en todo el país.", "Empezó el conflicto."),
  pt("Según el cuadro comparativo, ¿qué tienen en común?", "Arguedas: indigenismo, Andes, quechua · Alegría: indigenismo, Andes, comunidad · Vargas Llosa: urbano, Lima, colegio militar", "Arguedas y Alegría comparten el indigenismo y los Andes.", "Los tres escriben sobre colegios militares de Lima y sobre la vida de los cadetes.", "Ninguno escribe sobre los Andes."),
  pt("Según el diagrama de causa y efecto, ¿cuál es el efecto final?", "Deforestación → erosión → menos agua en los ríos → pérdida de cosechas", "Pérdida de cosechas", "Deforestación de la cuenca alta", "Erosión"),
  pt("Según la tabla, ¿qué texto busca persuadir?", "Texto | Propósito\nNoticia | Informar\nEditorial | Persuadir\nCuento | Entretener", "El editorial", "La noticia del día", "El cuento"),
  pt("Según el diagrama de flujo, ¿qué va después de «Buscar fuentes»?", "Elegir tema → Buscar fuentes → Tomar notas → Redactar borrador → Revisar", "Tomar notas", "Redactar borrador", "Elegir tema"),
];

export const ROWS: Row[] = [
  ["retorica-historica-1", (r) => readPassage(r, HISTORIC_1, false)],
  ["retorica-historica-2", (r) => readPassage(r, HISTORIC_2, false)],
  ["desarrollo-1", (r) => readPassage(r, DEVELOPMENT_1, false)],
  ["desarrollo-2", (r) => readPassage(r, DEVELOPMENT_2, false)],

  ["argumentos-1", (r) => readPassage(r, ARGS_1, false)],
  ["argumentos-2", (r) => readPassage(r, ARGS_2, false)],

  ["ciudad-perros-1", (r) => readPassage(r, PERROS[0], false)],
  ["ciudad-perros-2", (r) => readPassage(r, PERROS[1], false)],

  ["cvr-1", (r) => readPassage(r, CVR[0], false)],
  ["cvr-2", (r) => readPassage(r, CVR[1], false)],

  ["trabajo-1", (r) => readPassage(r, EMAILS, false)],
  ["trabajo-2", (r) => readPassage(r, LETTERS, false)],

  ["organizadores", (r) => choose(r, "", ORGANIZERS)],
];
