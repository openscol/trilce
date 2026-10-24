import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 2.° de Secundaria · banco de comprensión con lecturas propias, con temas e
// historias del Perú.


// --- Idea principal -------------------------------------------------------

const MAIN_PASSAGES = [
  read("Las lomas de Lima", "🌿", "Durante el verano, los cerros que rodean Lima parecen muertos: tierra parda, piedras y polvo. Pero entre junio y octubre, la neblina invernal se condensa sobre ellos y, sin una gota de lluvia, brotan flores, helechos y pastos. Son las lomas costeras, ecosistemas que dependen solo de la humedad del aire. En ellas viven zorros, lagartijas y aves que no existen en ningún otro lugar. Sin embargo, el crecimiento urbano avanza sobre sus laderas, y muchas ya desaparecieron bajo casas y carreteras.",
    ["¿Cuál es la idea principal del texto?", "Las lomas son ecosistemas únicos, alimentados por la neblina y amenazados por la ciudad.", "Lima es una ciudad muy grande que tiene cerros de color pardo durante todo el año.", "En invierno hay neblina."],
    ["¿Qué detalle muestra lo singular de las lomas?", "Florecen sin lluvia, solo con la humedad de la neblina.", "Están formadas por tierra parda y piedras.", "Los zorros que viven allí bajan a la ciudad para buscar comida en las noches."],
    ["¿Qué introduce la palabra «Sin embargo»?", "La amenaza que enfrentan las lomas", "Un nuevo ejemplo de animales que viven en las lomas durante el invierno", "La conclusión"]),
  read("El cajón", "🪘", "Hoy el cajón peruano se escucha en escenarios de todo el mundo, pero nació en condiciones de pobreza y prohibición. Durante la Colonia, a los esclavizados de origen africano se les impedía usar tambores. Ellos respondieron convirtiendo cajas de madera para transportar mercancías en instrumentos de percusión. Así, un objeto humilde se volvió la base de ritmos como el festejo y el landó. En 2001, el Estado peruano lo declaró Patrimonio Cultural de la Nación.",
    ["¿Cuál es la idea principal del texto?", "El cajón nació como una respuesta creativa a la opresión y hoy es un símbolo cultural.", "El cajón se fabrica con cajas de madera usadas para transportar mercancías.", "El cajón suena fuerte."],
    ["¿Por qué los esclavizados crearon el cajón?", "Porque se les prohibía usar tambores", "Porque las cajas de madera sonaban mejor que cualquier tambor de cuero africano", "Porque eran baratas"],
    ["¿Qué contraste organiza el texto?", "Entre su origen humilde y su reconocimiento actual", "Entre el festejo y el landó como ritmos musicales distintos de la costa", "Entre la madera y el cuero"]),
  read("La hora del almuerzo", "🍲", "En los comedores populares del Perú, miles de mujeres cocinan cada día para sus vecinos. Organizadas por turnos, compran al por mayor, reciben donaciones y preparan raciones que se venden a precios muy bajos. Durante la crisis de los años ochenta y, otra vez, en la pandemia de 2020, estos comedores evitaron que muchas familias pasaran hambre. Más que lugares para comer, son redes de solidaridad que los gobiernos no siempre reconocen ni apoyan.",
    ["¿Cuál es la idea principal del texto?", "Los comedores populares son redes solidarias clave en tiempos de crisis.", "La pandemia de 2020 obligó a cerrar todos los restaurantes del país durante varios meses.", "Las mujeres cocinan."],
    ["¿Qué detalle muestra su importancia en las crisis?", "Evitaron el hambre en los ochenta y en la pandemia.", "Compran al por mayor.", "Las raciones se preparan por turnos entre las mujeres organizadas del barrio."],
    ["¿Qué crítica plantea la última oración?", "Que el Estado no les da el apoyo que merecen", "Que la comida de los comedores no es nutritiva ni variada para los niños", "Ninguna"]),
];

const MULTI_MAIN = [
  read("Los incas y la sal de Maras", "🧂", "En las laderas de Maras, en el Cusco, hay más de tres mil pozas escalonadas donde se produce sal desde antes de los incas. Un manantial salado se reparte por canales diminutos; el sol evapora el agua y deja cristales blancos que las familias raspan a mano. Las pozas no pertenecen a una empresa: cada familia de la comunidad tiene las suyas y las hereda. Este sistema, a la vez, atrae a miles de turistas, lo que ha obligado a la comunidad a organizar las visitas para que no dañen las pozas.",
    ["¿Qué dos ideas principales desarrolla el texto?", "Las salineras usan una técnica antigua y son administradas por la comunidad, que ahora también gestiona el turismo.", "El Cusco tiene muchas salineras y las mejores están en las alturas de la cordillera.", "La sal es blanca."],
    ["¿Qué detalle explica cómo se produce la sal?", "El sol evapora el agua salada repartida en las pozas.", "Las familias heredan sus pozas.", "Miles de turistas visitan las pozas cada año y toman fotografías desde los miradores."],
    ["¿Qué relación hay entre las dos últimas ideas?", "La organización comunal permite manejar el turismo.", "El turismo destruyó por completo la producción tradicional de la sal.", "No hay relación."]),
  read("Las radios comunitarias", "📻", "En muchos distritos andinos y amazónicos, la radio sigue siendo el medio más escuchado. Las radios comunitarias transmiten en quechua, aimara o asháninka, informan sobre precios de cosechas y alertan sobre heladas o crecidas de ríos. Pero su función va más allá de informar: en ellas se cuentan leyendas, se dedican canciones y se debaten los problemas del pueblo. Muchas de estas emisoras, sin embargo, funcionan con equipos antiguos y sin licencias, porque los trámites son caros y lentos.",
    ["¿Qué dos ideas principales presenta el texto?", "Las radios comunitarias informan y fortalecen la vida cultural, pero enfrentan dificultades técnicas y legales.", "El quechua y el aimara son las lenguas más habladas en todas las regiones amazónicas del país.", "La radio es antigua."],
    ["¿Qué ejemplo muestra que la radio va más allá de informar?", "Se cuentan leyendas y se debaten problemas del pueblo.", "Alertan sobre heladas.", "Transmiten las noticias en varias lenguas y a diferentes horas del día."],
    ["¿Qué palabra marca el paso a la segunda idea principal?", "«sin embargo»", "«Pero su función»", "«En muchos distritos andinos y amazónicos»"]),
];

const TWO = "¿Qué idea se obtiene al combinar los dos textos?";
const TWO_MAIN: ChoiceItem[] = [
  pt(TWO, "Texto 1: La quinua resiste la sequía, las heladas y los suelos salinos.\nTexto 2: La FAO declaró 2013 Año Internacional de la Quinua por su valor para la seguridad alimentaria.", "La resistencia de la quinua la vuelve valiosa para alimentar al mundo.", "La quinua solo puede cultivarse en suelos fértiles y con mucha agua durante todo el año.", "La FAO es grande."),
  pt(TWO, "Texto 1: Muchos jóvenes de provincias migran a Lima para estudiar.\nTexto 2: Las universidades regionales han aumentado su oferta de carreras en los últimos años.", "Ampliar la oferta educativa regional podría reducir la migración estudiantil.", "Las universidades de Lima han cerrado sus carreras para que los jóvenes estudien en provincias.", "Lima tiene universidades."),
  pt(TWO, "Texto 1: El ruido constante del tráfico eleva el estrés y altera el sueño.\nTexto 2: En Lima, varias avenidas superan los niveles de ruido recomendados por la OMS.", "El tráfico limeño representa un riesgo para la salud de sus habitantes.", "La OMS recomienda que las avenidas tengan más bocinas para evitar los accidentes de tránsito.", "Hay mucho ruido."),
  pt(TWO, "Texto 1: Los manglares de Tumbes protegen la costa y son criaderos de peces y conchas.\nTexto 2: La expansión de langostineras ha reducido parte de esos manglares.", "Una actividad económica amenaza un ecosistema que sostiene la pesca.", "Las langostineras de Tumbes ayudan a que los manglares crezcan más rápido cada año.", "Tumbes queda al norte."),
  pt(TWO, "Texto 1: Los quipus registraban datos con nudos y colores.\nTexto 2: Investigadores intentan hoy descifrar si algunos quipus también guardaban relatos.", "Los quipus fueron un sistema de registro cuyo alcance aún se investiga.", "Los quipus se usaban únicamente para decorar los vestidos de los nobles del Cusco.", "Los nudos son de lana."),
  pt(TWO, "Texto 1: Los deportistas peruanos de surf han ganado medallas mundiales.\nTexto 2: La costa peruana tiene olas largas y constantes durante casi todo el año.", "Las condiciones naturales favorecen el éxito del surf peruano.", "La costa peruana no tiene olas aptas para el surf y los deportistas entrenan en el extranjero.", "El surf es un deporte."),
];

// --- Tema -----------------------------------------------------------------

const QUOTE_THEMES = pool([
  ["«Construyeron muros para no ver la pobreza, y la pobreza siguió allí, al otro lado».", "La indiferencia social"], ["«Cuando todos huían, ella se quedó a cuidar a los heridos».", "La valentía solidaria"],
  ["«Ganó el poder prometiendo justicia y lo usó para vengarse».", "La corrupción del poder"], ["«Aprendió a pescar con su abuelo y, sin saberlo, aprendió a esperar».", "La paciencia que se hereda"],
  ["«Nadie recordaba su nombre, pero todos usaban el puente que construyó».", "El trabajo anónimo"], ["«Volvió del extranjero y ya no se sentía de ninguna parte».", "El desarraigo"],
  ["«Le dijeron que las niñas no estudiaban ingeniería. Ella diseñó el puente del pueblo».", "La lucha contra los prejuicios"], ["«Mintió para salvarse y perdió a su único amigo».", "Las consecuencias de la mentira"],
  ["«Ni el huaico ni el hambre pudieron con la comunidad: reconstruyeron todo juntos».", "La resiliencia colectiva"], ["«Tenía todo lo que quería y no sabía qué hacer con su vida».", "El vacío de lo material"],
]);

const THEMES = [
  read("El pozo", "💧", "En la comunidad de Huancarama, el pozo se secó en agosto. El alcalde prometió un camión cisterna que nunca llegó. Fue Tomasa, la más vieja del pueblo, quien recordó un manantial escondido al otro lado del cerro, del que bebían sus abuelos. Los jóvenes no le creyeron; los mayores, sí. Durante tres semanas, unos y otros cavaron juntos una acequia de piedra. Cuando el agua llegó al pueblo, los jóvenes le pidieron a Tomasa que les contara qué otras cosas recordaba.",
    ["¿Cuál es el tema del cuento?", "La sabiduría de los mayores es un recurso valioso para la comunidad.", "Las autoridades siempre cumplen las promesas que hacen a las comunidades andinas.", "El agua es necesaria."],
    ["¿Qué cambio se produce en los jóvenes?", "Pasan de dudar de Tomasa a valorar sus recuerdos.", "Pasan de trabajar con entusiasmo a abandonar la acequia por el cansancio.", "Ninguno."],
    ["¿Qué sugiere la promesa incumplida del alcalde?", "Que la comunidad no puede esperar soluciones de afuera", "Que el camión cisterna se perdió en la carretera por culpa de un huaico", "Que no había agua"]),
  read("El uniforme prestado", "👕", "Javier llegó al colegio de Lima con un uniforme que había sido de su primo: le quedaba grande y tenía el nombre de otro bordado en el pecho. Durante semanas lo llamaron «el Prestado». Un día, el profesor de Historia preguntó quién sabía qué era el «ayni». Solo Javier levantó la mano y explicó cómo, en su pueblo de Puno, los vecinos se turnan para ayudarse en la siembra. Esa tarde, nadie lo llamó «el Prestado». Alguien, incluso, le pidió que le enseñara a decir algo en aimara.",
    ["¿Cuál es el tema del cuento?", "El valor de la propia cultura frente a la discriminación", "La importancia de tener un uniforme nuevo y a la medida para ir al colegio", "Los profesores enseñan Historia."],
    ["¿Qué simboliza el uniforme prestado?", "La sensación de no pertenecer al nuevo lugar", "La pobreza de toda su familia y de todos los habitantes de su pueblo en Puno", "El frío"],
    ["¿Qué provoca el cambio de actitud de sus compañeros?", "Que Javier comparte un saber de su cultura", "Que el profesor castiga a quienes se burlaban de él", "Que se compra otro uniforme"]),
];

const MULTI_THEMES = [
  read("La última carta", "✉️", "Cuando el abuelo Ezequiel murió, la familia encontró en su baúl decenas de cartas sin enviar, todas dirigidas a un hermano que había partido a Argentina en 1960. Hablaban de la chacra, de las fiestas, de los hijos que nacían. Nunca las mandó: ese hermano se había ido tras una pelea por la herencia, y el orgullo pudo más. Su nieta Valeria buscó en internet y encontró a una sobrina nieta en Rosario. Le escaneó las cartas. A la semana recibió una respuesta: «Mi abuelo también escribía cartas que nunca enviaba».",
    ["¿Qué dos temas desarrolla el cuento?", "El orgullo separa a las familias; las nuevas generaciones pueden reconciliarlas.", "La tecnología siempre destruye las tradiciones familiares de escribir cartas a mano.", "Argentina queda lejos."],
    ["¿Qué revela la respuesta desde Rosario?", "Que los dos hermanos sentían lo mismo y callaron", "Que el hermano de Ezequiel nunca recordó a su familia del Perú", "Que en Argentina no hay correo"],
    ["¿Qué papel cumple Valeria?", "Rompe el silencio que sus abuelos mantuvieron.", "Continúa la pelea por la herencia de la chacra del abuelo.", "Ninguno."]),
  read("La barra", "⚽", "Diego se unió a la barra del equipo de su barrio porque ahí se sentía parte de algo. Cantaban, pintaban banderas, viajaban juntos. Pero una noche, después de una derrota, el grupo decidió apedrear el bus de los rivales. Diego se quedó quieto, con una piedra en la mano. Sus amigos lo llamaron cobarde. Él soltó la piedra y se fue caminando solo hasta su casa. Al día siguiente, en el colegio, otros dos chicos de la barra se le acercaron. «Nosotros tampoco tiramos», le dijeron en voz baja.",
    ["¿Qué dos temas desarrolla el cuento?", "La necesidad de pertenecer y el valor de no seguir a la mayoría", "El fútbol es un deporte violento que debería prohibirse en todos los barrios", "Los buses son caros."],
    ["¿Qué muestra la piedra que Diego tiene en la mano?", "El momento de decidir entre el grupo y su conciencia", "Que Diego planeaba atacar el bus antes que todos sus amigos", "Que era de noche"],
    ["¿Qué sugiere el final?", "Que el valor de uno puede animar a otros", "Que Diego quedó completamente solo y sin amigos para siempre", "Que el equipo ganó"]),
];

// --- Propósito y punto de vista -------------------------------------------

const PURPOSE = sorter(["Informar", "Persuadir", "Entretener", "Explicar cómo se hace algo"], "¿Cuál es el propósito principal del autor?");
const AUTHOR_PURPOSE: ChoiceItem[] = [
  ...["Un reportaje sobre el descubrimiento de nuevas líneas en Nasca con drones.", "Un boletín con las cifras de vacunación del último mes.", "Un artículo que describe la vida del oso de anteojos."].map((x) => PURPOSE(x, 0)),
  ...["Un discurso de campaña para elegir al municipio escolar.", "Un afiche que pide adoptar perros en lugar de comprarlos.", "Un editorial que exige más presupuesto para la educación rural."].map((x) => PURPOSE(x, 1)),
  ...["Una novela juvenil sobre un detective que resuelve misterios en Barranco.", "Un cuento de terror sobre el tunche de la selva.", "Una comedia teatral sobre una familia que gana la lotería."].map((x) => PURPOSE(x, 2)),
  ...["Una guía para preparar una mochila de emergencia ante sismos.", "Un tutorial para crear una presentación con diapositivas.", "Los pasos para inscribirse en el Registro Nacional de Identificación."].map((x) => PURPOSE(x, 3)),
];

const POV = "¿Cuál es el punto de vista del autor?";
const AUTHOR_POV: ChoiceItem[] = [
  pt(POV, "«Se celebra cada récord de exportación agrícola, pero se olvida a los trabajadores que cosechan bajo el sol por un sueldo mínimo».", "Pide atención a las condiciones de los trabajadores agrícolas.", "Celebra sin reservas el crecimiento de las exportaciones agrícolas del país.", "No opina."),
  pt(POV, "«Las redes sociales no inventaron la mentira; solo le dieron alas. La solución no es apagar el celular, sino aprender a dudar».", "Defiende la educación crítica frente a la desinformación.", "Propone prohibir las redes sociales a todos los menores de edad.", "Le gustan las redes."),
  pt(POV, "«Restaurar una huaca cuesta menos que un puente, y nos devuelve algo que ningún puente puede: memoria».", "Considera valiosa la inversión en patrimonio.", "Cree que es mejor gastar el dinero en puentes que en restaurar huacas antiguas.", "Habla de puentes."),
  pt(POV, "«Los exámenes de admisión miden lo que un alumno memorizó en un año de academia, no lo que puede llegar a ser».", "Duda de que los exámenes de admisión midan el potencial.", "Considera que los exámenes de admisión son el mejor método para elegir estudiantes.", "Describe un examen."),
  pt(POV, "«El reciclaje está bien. Pero si seguimos comprando lo mismo, solo estamos ordenando la basura».", "Cree que reducir el consumo es más importante que reciclar.", "Afirma que el reciclaje resuelve por completo el problema de la basura.", "Ordena la basura."),
  pt(POV, "«Llamar “invasores” a quienes viven en los cerros es olvidar que la mitad de Lima nació así».", "Rechaza la estigmatización de los asentamientos populares.", "Pide desalojar a todas las familias que viven en los cerros de la ciudad.", "Describe los cerros."),
];

// --- Tono -----------------------------------------------------------------

const FORMAL = "¿Qué oración es más formal?";
const FORMALITY: ChoiceItem[] = [
  w(FORMAL, "Solicito que se revise mi calificación.", "Profe, ¿me puede revisar la nota porfa?", "Revíseme eso."), w(FORMAL, "Los asistentes manifestaron su disconformidad.", "La gente que vino se quejó un montón de todo.", "Se picaron."),
  w(FORMAL, "Agradecería que me respondiera a la brevedad.", "Contéstame rápido cuando puedas, ¿ya?", "Responde."), w(FORMAL, "El proyecto fue desestimado por falta de presupuesto.", "El proyecto se fue al tacho porque no había plata.", "No va."),
  w(FORMAL, "Se le comunica que su solicitud ha sido aprobada.", "Te cuento que ya te aprobaron lo que pediste, causa.", "¡Aprobado!"), w(FORMAL, "Es imprescindible respetar los plazos establecidos.", "Hay que entregar a tiempo sí o sí, no hay de otra.", "Entrega ya."),
  w(FORMAL, "Lamento comunicarle que no podré asistir.", "Uy, qué roche, pero no voy a poder ir a lo tuyo.", "No voy."), w(FORMAL, "La investigación concluye que el método es eficaz.", "Al final salió que el método sí funciona bien bacán.", "Funciona."),
];
const TONE = "¿Qué tono tiene cada texto?";
const TONE_COMPARE: ChoiceItem[] = [
  pt(TONE, "Texto A: «El río devolvió los cuerpos al tercer día. Nadie dijo nada».\nTexto B: «¡Por fin bajó el río y pudimos cruzar a la feria!».", "A es sombrío; B es entusiasta.", "A es entusiasta; B es sombrío y silencioso.", "Los dos son alegres."),
  pt(TONE, "Texto A: «Claro, el alcalde inauguró la obra… por tercera vez».\nTexto B: «El alcalde inauguró la obra el lunes a las diez».", "A es irónico; B es neutro.", "A es neutro; B es irónico y burlón.", "Los dos son irónicos."),
  pt(TONE, "Texto A: «Te prometo que volveremos a ver el mar juntos».\nTexto B: «Ya no habrá mar, ni regreso, ni nosotros».", "A es esperanzado; B es desesperanzado.", "A es desesperanzado; B es esperanzado y tierno.", "Los dos son neutros."),
  pt(TONE, "Texto A: «¿Quién decidió que la cultura es un lujo? ¡Basta de recortes!».\nTexto B: «El presupuesto de cultura se redujo en un 12 %».", "A es indignado; B es objetivo.", "A es objetivo; B es indignado y combativo.", "Los dos son humorísticos."),
  pt(TONE, "Texto A: «La anciana sonrió al ver la foto, como quien abraza un recuerdo».\nTexto B: «La foto, tomada en 1950, mide diez por quince centímetros».", "A es nostálgico; B es descriptivo e impersonal.", "A es descriptivo e impersonal; B es nostálgico.", "Los dos son nostálgicos."),
  pt(TONE, "Texto A: «Ten cuidado: el camino está lleno de abismos».\nTexto B: «¡Qué aventura! El camino tiene abismos increíbles».", "A es de advertencia; B es de entusiasmo.", "A es de entusiasmo; B es de advertencia y temor.", "Los dos son de calma."),
];

// --- Estructura del texto -------------------------------------------------

const COMPARE = [
  read("Chasqui y correo electrónico", "📨", "El chasqui inca y el correo electrónico tienen un mismo fin: llevar mensajes lejos y rápido. El chasqui corría unos kilómetros y entregaba el mensaje, de memoria o en un quipu, al siguiente corredor; así, una noticia podía cruzar el imperio en pocos días. El correo electrónico, en cambio, recorre miles de kilómetros en segundos y no depende del cuerpo humano. Sin embargo, el sistema inca tenía una ventaja que hoy parece rara: el mensaje no podía ser falsificado sin que lo notara una cadena de personas.",
    ["¿Qué tienen en común ambos sistemas?", "Buscan llevar mensajes lejos y rápido.", "Ambos dependen de corredores que se relevan en postas.", "Son modernos."],
    ["¿Qué diferencia principal señala el texto?", "La velocidad y el uso o no del cuerpo humano", "El color de los mensajes y el idioma en que se escribían los textos", "El precio"],
    ["¿Qué ventaja del chasqui destaca el autor?", "Era difícil falsificar los mensajes.", "Era más rápido que el correo electrónico actual en cualquier distancia.", "Era gratis."]),
  read("La papa y el maíz", "🌽", "La papa y el maíz son los dos grandes regalos de los Andes y de Mesoamérica al mundo. Ambos fueron domesticados hace miles de años y hoy alimentan a miles de millones de personas. No obstante, crecen en condiciones distintas: la papa resiste el frío de las alturas, mientras que el maíz necesita valles templados y más agua. En el Perú, ambos conviven en los pisos ecológicos: los agricultores siembran maíz en las partes bajas y papa en las altas, aprovechando cada nivel del terreno.",
    ["¿Qué semejanza tienen la papa y el maíz?", "Fueron domesticados hace milenios y alimentan al mundo.", "Ambos necesitan el frío de las alturas para crecer bien.", "Son verdes."],
    ["¿En qué se diferencian?", "En las condiciones de clima y altitud que necesitan", "En que solo el maíz se domesticó en el Perú y la papa vino de Europa", "En el sabor"],
    ["¿Qué estrategia agrícola describe el final?", "Aprovechar los distintos pisos ecológicos", "Sembrar papa y maíz mezclados en la misma parcela de la costa", "Importar semillas"]),
];
const CAUSE_INFO: ChoiceItem[] = [
  pt("¿Cuál es el efecto?", "Debido a la tala en la cuenca alta, el río arrastra más sedimentos y se colmatan las represas.", "Las represas se colmatan.", "Hay tala en la cuenca alta.", "El río es largo."),
  pt("¿Cuál es la causa?", "El caucho amazónico se volvió muy valioso porque la industria automotriz necesitaba neumáticos.", "La demanda de neumáticos de la industria automotriz", "El valor del caucho amazónico", "La extensión de la selva"),
  pt("¿Cuál es el efecto?", "La llegada del ferrocarril central acortó el viaje a Huancayo; por eso, creció el comercio entre la sierra y Lima.", "Creció el comercio entre la sierra y Lima.", "Llegó el ferrocarril central.", "Huancayo es una ciudad."),
  pt("¿Cuál es la causa?", "Muchos estudiantes no pudieron seguir clases virtuales, ya que no tenían internet en casa.", "La falta de internet en casa", "Las clases virtuales", "Los estudiantes"),
  pt("¿Cuál es el efecto?", "El aumento del nivel del mar podría inundar las zonas bajas de la costa, de modo que algunos balnearios desaparecerían.", "Algunos balnearios desaparecerían.", "Sube el nivel del mar.", "La costa es baja."),
  pt("¿Cuál es la causa?", "Gracias a la conservación del Manu, se recuperaron poblaciones de nutria gigante.", "La conservación del Manu", "La recuperación de la nutria gigante", "Las poblaciones"),
  pt("¿Qué expresión señala el efecto?", "Hubo una helada muy fuerte, así que se perdieron los cultivos de papa.", "«así que»", "«hubo una helada»", "«de papa»"),
  pt("¿Qué expresión señala la causa?", "Dado que el museo estaba cerrado, visitamos la huaca.", "«Dado que»", "«visitamos la huaca»", "«el museo»"),
];
const PROBLEM_SOLUTION = pool([
  ["Los agricultores pierden cosechas por la falta de agua en época seca.", "Construir reservorios y qochas."], ["Los adolescentes pasan muchas horas frente a pantallas.", "Promover talleres deportivos y artísticos."], ["Los mercados generan toneladas de residuos orgánicos.", "Transformarlos en abono."],
  ["Las mujeres artesanas no consiguen compradores fuera de su región.", "Crear una tienda virtual cooperativa."], ["Los perros abandonados se multiplican en las calles.", "Organizar campañas de esterilización y adopción."], ["Los niños de la comunidad no tienen libros en su lengua.", "Publicar cuentos bilingües."],
  ["Las playas se llenan de plástico en verano.", "Organizar limpiezas y prohibir los descartables."], ["Las combis compiten y provocan accidentes.", "Crear rutas ordenadas con horarios fijos."],
]);
const STRUCT = sorter(["Secuencia cronológica", "Comparación y contraste", "Causa y efecto", "Problema y solución", "Descripción"], "¿Qué estructura tiene el texto?");
const STRUCTURES: ChoiceItem[] = [
  ...["En 1879 empezó la guerra del Pacífico. En octubre, Grau murió en Angamos. En 1883 se firmó el Tratado de Ancón.", "Primero se cosecha el cacao; luego se fermenta y se seca; al final se tuesta y se muele."].map((x) => STRUCT(x, 0)),
  ...["El cuento tiene un solo conflicto; la novela, en cambio, entrelaza varios.", "Tanto el quechua como el aimara son lenguas andinas, aunque sus gramáticas difieren."].map((x) => STRUCT(x, 1)),
  ...["Como el mar se calentó, la anchoveta se alejó y la pesca cayó.", "La sequía secó los pastos; por consiguiente, murieron muchas alpacas."].map((x) => STRUCT(x, 2)),
  ...["El colegio no tenía biblioteca. Los alumnos organizaron una colecta de libros y armaron una en un aula vacía.", "Los vecinos sufrían cortes de agua. Instalaron tanques y pidieron un horario fijo."].map((x) => STRUCT(x, 3)),
  ...["El gallito de las rocas tiene plumaje anaranjado intenso, una cresta en forma de abanico y alas negras.", "La plaza de Arequipa está rodeada de portales de sillar blanco y una catedral con dos torres."].map((x) => STRUCT(x, 4)),
];

// --- Recursos literarios --------------------------------------------------

const SENSORY: ChoiceItem[] = [
  pt("¿Qué palabras del texto son detalles sensoriales?", "La chicharronería olía a manteca y a camote frito; el aceite chisporroteaba en la paila.", "«olía a manteca» y «chisporroteaba»", "«la chicharronería», «el camote» y «la paila»", "«el aceite»"),
  pt("¿Qué palabras del texto son detalles sensoriales?", "La arena de Paracas, áspera y caliente, me raspaba los talones.", "«áspera», «caliente» y «me raspaba»", "«la arena», «Paracas» y «los talones»", "«la arena»"),
  pt("¿A qué sentidos apela el texto?", "Las campanas retumbaban en la plaza y el incienso picaba en la nariz.", "Oído y olfato", "Vista y gusto solamente", "Tacto"),
  pt("¿A qué sentidos apela el texto?", "El mango estaba dulce y su jugo pegajoso me corría por los dedos.", "Gusto y tacto", "Oído y vista solamente", "Olfato"),
  pt("¿Qué detalle sensorial crea inquietud?", "En la casa vacía, el piso de madera crujía aunque nadie lo pisara.", "El piso que cruje sin que nadie lo pise", "La casa de madera que estaba vacía", "La madera"),
  pt("¿Qué detalle sensorial transmite paz?", "El lago reflejaba el cielo sin una arruga, y solo se oía el viento entre la totora.", "El lago sin una arruga y el viento en la totora", "La palabra «reflejaba» al inicio de la oración", "El cielo"),
  pt("¿Qué oración añade un detalle sensorial?", "Entramos al mercado de Belén.", "El aire húmedo olía a pescado, a frutas maduras y a lluvia.", "El mercado de Belén queda en la ciudad de Iquitos.", "Era temprano."),
  pt("¿Qué oración añade un detalle sensorial?", "Llegó el tren a Huancayo.", "El silbato rasgó el aire frío de la mañana.", "El tren salió de Lima el día anterior a las siete.", "Llegamos."),
];
const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa la alusión a Prometeo?", "Fuente: Prometeo robó el fuego a los dioses para dárselo a los humanos, y fue castigado por ello.\nOración: «La maestra fue un Prometeo: llevó internet a una escuela olvidada».", "Llevó un bien valioso a otros asumiendo un riesgo.", "Se quedó con algo que pertenecía a otros para su propio beneficio.", "Encendió una fogata."),
  pt("¿Qué significa «ser un Judas»?", "Fuente: Judas traicionó a Jesús entregándolo a cambio de treinta monedas de plata.\nOración: «Contó todos mis secretos; resultó ser un Judas».", "Ser un traidor", "Ser un amigo leal que guarda secretos", "Ser rico"),
  pt("¿Qué significa la alusión al Dorado?", "Fuente: Los conquistadores buscaron El Dorado, una ciudad de oro que nunca existió.\nOración: «Para muchos migrantes, la gran ciudad fue un Dorado».", "Un lugar de riqueza soñada que no cumplió lo esperado", "Un lugar real donde todos se hicieron millonarios en poco tiempo", "Una ciudad dorada"),
  pt("¿Qué significa «ser un Quijote»?", "Fuente: Don Quijote, por idealista, luchó contra molinos de viento creyendo que eran gigantes.\nOración: «Es un Quijote: quiere limpiar solo el río Rímac».", "Ser un idealista que enfrenta causas imposibles", "Ser una persona práctica que solo hace lo que es posible", "Ser un caballero"),
  pt("¿Qué significa la alusión a Midas?", "Fuente: El rey Midas pidió que todo lo que tocara se convirtiera en oro, y no pudo ni comer.\nOración: «Ese empresario tiene el toque de Midas».", "Todo lo que emprende le da ganancias.", "Todo lo que toca lo destruye sin querer.", "Tiene hambre."),
  pt("¿Qué significa «una odisea»?", "Fuente: La «Odisea» narra el largo y peligroso viaje de regreso de Ulises a su hogar.\nOración: «Llegar a la comunidad en temporada de lluvias es una odisea».", "Un viaje largo y lleno de dificultades", "Un paseo corto y tranquilo por el campo", "Una fiesta"),
  pt("¿Qué significa la alusión a Huatyacuri?", "Fuente: En los relatos de Huarochirí, el humilde Huatyacuri, despreciado por todos, vence en duelos de ingenio al poderoso cuñado que lo humillaba.\nOración: «En el concurso, la alumna del colegio rural fue una Huatyacuri».", "Alguien humilde que vence a un rival poderoso", "Alguien poderoso que humilla a los demás participantes", "Alguien que pierde"),
  pt("¿Qué significa «pasar las de Caín»?", "Fuente: Caín, tras matar a su hermano Abel, fue condenado a vagar errante y sufriendo.\nOración: «Pasó las de Caín para terminar la carrera».", "Sufrir muchas penalidades", "Divertirse mucho durante un tiempo", "Ser hermano mayor"),
];
const RECALL = "¿De dónde viene la alusión?";
const ALLUSION_SOURCE: ChoiceItem[] = [
  pt(RECALL, "«Su casa es la torre de Babel: allí cada uno habla un idioma».", "Del relato bíblico de la torre de Babel", "De la leyenda inca de Manco Cápac y Mama Ocllo en el lago Titicaca", "De una novela peruana"),
  pt(RECALL, "«Es un verdadero Sansón: carga dos sacos de papa a la vez».", "Del personaje bíblico de fuerza extraordinaria", "Del mito griego de Narciso, que se enamoró de su reflejo", "De una tradición de Palma"),
  pt(RECALL, "«Fue una tarea titánica».", "De los titanes, gigantes de la mitología griega", "De un barco moderno llamado Titanic, que se hundió en 1912", "De la Biblia"),
  pt(RECALL, "«Nos dejó en el limbo de Ollantaytambo, esperando el perdón del Inca».", "Del drama quechua «Ollantay»", "De la novela «Don Quijote de la Mancha», de Miguel de Cervantes", "De un cuento de Quiroga"),
  pt(RECALL, "«Es un Lazarillo: conoce todos los atajos y engaños de la ciudad».", "De la novela española «Lazarillo de Tormes»", "Del relato bíblico de Lázaro, que resucitó al cuarto día", "De la mitología inca"),
  pt(RECALL, "«Es una Casandra: siempre advierte, y nadie le cree».", "De la profetisa griega a la que nadie creía", "De una heroína de la independencia del Perú", "De un cuento de terror"),
  pt(RECALL, "«Su conversión fue un camino de Damasco».", "Del relato bíblico de la conversión de Pablo", "De la historia de los viajes de Marco Polo", "De una leyenda árabe"),
  pt(RECALL, "«Abrió un Cuarto del Rescate de juguetes: el cuarto lleno hasta el techo».", "Del rescate que ofreció Atahualpa a Pizarro", "De un cuento de «Las mil y una noches»", "De la Biblia"),
];
const MEAN = "¿Qué significa la figura?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "«Esa noticia fue un balde de agua fría».", "Fue una decepción repentina.", "Fue una noticia refrescante en un día de mucho calor.", "Mojó a todos."),
  pt(MEAN, "«Sus palabras eran miel».", "Hablaba de forma dulce y agradable.", "Tenía la boca llena de miel cuando hablaba.", "Hablaba poco."),
  pt(MEAN, "«El examen fue un paseo».", "Fue muy fácil.", "Se dio en un parque, al aire libre y caminando.", "Fue largo."),
  pt(MEAN, "«Se quedó de piedra».", "Quedó paralizado por la sorpresa.", "Se convirtió en una estatua de piedra en la plaza.", "Se sentó."),
  pt(MEAN, "«Tiene la cabeza en las nubes».", "Está distraído.", "Vive en lo alto de una montaña con mucha neblina.", "Es alto."),
  pt(MEAN, "«La ciudad era un hormiguero».", "Había muchísima gente en movimiento.", "La ciudad estaba llena de hormigas por la humedad.", "Era pequeña."),
  pt(MEAN, "«Le cayó como anillo al dedo».", "Le resultó muy oportuno.", "Le regalaron un anillo que le quedaba exactamente a la medida.", "Se cayó."),
  pt(MEAN, "«Estoy muerto de cansancio».", "Estoy agotadísimo.", "Me desmayé de verdad por el cansancio y tuvieron que llevarme.", "Estoy bien."),
];
const FIG = sorter(["Símil", "Metáfora", "Personificación", "Hipérbole", "Anáfora"], "¿Qué figura literaria se usa?");
const FIGURE_CLASSIFY: ChoiceItem[] = [
  ...["Su voz era suave como la seda.", "Cayó la lluvia como un llanto antiguo.", "Brillaban sus ojos como brasas."].map((x) => FIG(x, 0)),
  ...["El Perú es un mendigo sentado en un banco de oro.", "Sus dientes, perlas del mar.", "La juventud es una primavera breve."].map((x) => FIG(x, 1)),
  ...["El volcán despertó de mal humor.", "Las calles dormían bajo la garúa.", "La puerta gimió al abrirse."].map((x) => FIG(x, 2)),
  ...["Lloró un río de lágrimas.", "Hace un siglo que no te veo.", "Este libro pesa una tonelada."].map((x) => FIG(x, 3)),
  ...["Hay golpes en la vida… Hay golpes que…", "Te quiero en la mañana, te quiero en la tarde, te quiero en la noche.", "Ni el frío, ni el hambre, ni el miedo lo detuvieron."].map((x) => FIG(x, 4)),
];
const EFFECT = "¿Qué efecto tiene la figura en el texto?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«Los cerros, viejos guardianes, vigilaban el pueblo dormido».", "Transmite protección y antigüedad.", "Hace que los cerros parezcan peligrosos y amenazantes para el pueblo.", "Describe el clima."),
  pt(EFFECT, "«El silencio de la sala era un vidrio a punto de romperse».", "Crea una tensión frágil y contenida.", "Muestra que la sala estaba alegre y llena de conversaciones.", "Habla de vidrios."),
  pt(EFFECT, "«Te esperé, te esperé, te esperé… y no viniste».", "Intensifica la sensación de espera y abandono.", "Muestra que el narrador no estaba interesado en la persona que esperaba.", "Da una hora."),
  pt(EFFECT, "«Tenía tanta sed que se habría bebido el Titicaca».", "Exagera para mostrar una sed extrema.", "Indica que el personaje bebió realmente toda el agua del lago.", "Describe el lago."),
  pt(EFFECT, "«Su risa era un pájaro que escapaba de la jaula».", "Sugiere alegría libre y espontánea.", "Indica que su risa era triste y daba miedo a quienes la oían.", "Habla de aves."),
  pt(EFFECT, "«La ciudad lo masticó y lo escupió».", "Muestra que la ciudad lo trató con dureza.", "Indica que la ciudad lo recibió con cariño y le dio trabajo.", "Habla de comida."),
];

// --- Analizar literatura --------------------------------------------------

const NARR = sorter(["Primera persona", "Segunda persona", "Tercera persona omnisciente", "Tercera persona limitada"], "¿Qué punto de vista tiene el narrador?");
const NARRATOR: ChoiceItem[] = [
  ...["Me escondí detrás de la puerta. Sabía que, si mi padre me encontraba, no me dejaría ir.", "Nunca olvidaré el día en que llegué a Lima con una maleta de cartón."].map((x) => NARR(x, 0)),
  ...["Abres la ventana y sientes el frío. Sabes que hoy tendrás que decidir.", "Caminas por la plaza vacía; nadie te reconoce."].map((x) => NARR(x, 1)),
  ...["Martín creía que su madre no sabía nada; ella, sin embargo, lo había descubierto todo hacía meses.", "El juez parecía tranquilo, aunque por dentro temblaba; el acusado, en cambio, había perdido toda esperanza."].map((x) => NARR(x, 2)),
  ...["Elena oyó pasos en el pasillo. No sabía quién podía estar despierto a esa hora.", "Raúl miró el sobre sin abrirlo. Se preguntaba qué diría."].map((x) => NARR(x, 3)),
];
const INFER_LIT = [
  read("La maleta", "🧳", "Cuando Ramiro volvió de Italia después de doce años, su madre lo esperaba en el terminal de Ayacucho con un plato de puca picante envuelto en un mantel. Él traía una maleta enorme llena de regalos. En la casa, la madre los fue abriendo uno por uno, agradeciendo en voz baja. Después se levantó, fue a la cocina y volvió con la vieja chompa que él había dejado al irse. «La lavé cada año», le dijo.",
    ["¿Qué se puede inferir de que la madre lavara la chompa cada año?", "Que lo extrañó y esperó su regreso todo ese tiempo", "Que la chompa estaba muy sucia y tenía muchas manchas", "Que no tenía otra ropa"],
    ["¿Qué contraste sugiere la escena?", "Entre los regalos materiales y el afecto guardado por la madre", "Entre la comida italiana y la comida ayacuchana", "Entre el frío y el calor"],
    ["¿Por qué la madre lleva puca picante al terminal?", "Para recibirlo con un sabor de su tierra", "Porque Ramiro le pidió por teléfono que se la llevara caliente", "Porque tenía hambre"]),
  read("El silencio de don Aurelio", "🔨", "Don Aurelio, el zapatero, siempre saludaba a todos. Desde que abrieron la gran tienda de zapatillas en la avenida, dejó de saludar. Su taller abría cada vez más tarde. Una mañana, un niño entró con una zapatilla de marca rota. «En la tienda me dijeron que mejor compre otra», dijo. Don Aurelio la miró, sonrió por primera vez en semanas y sacó su hilo encerado.",
    ["¿Por qué don Aurelio dejó de saludar?", "Probablemente se sentía desplazado por la gran tienda.", "Porque estaba enfermo de la garganta y no podía hablar.", "Porque no conocía a sus vecinos."],
    ["¿Qué significa su sonrisa al final?", "Que vuelve a sentirse útil", "Que se burla del niño por haber comprado zapatillas caras", "Que tiene hambre"],
    ["¿Qué critica implícitamente el texto?", "La cultura de desechar en lugar de reparar", "Que los niños usen zapatillas de marca para jugar", "Nada"]),
];
const SHORT_STORIES = [
  read("La decisión", "🎓", "Lucía ganó una beca para estudiar en una universidad de Lima. El mismo día, su padre se lastimó la espalda y ya no podía trabajar en la chacra. Su hermano menor tenía diez años. Lucía pasó la noche en vela. Por la mañana, su madre le preparó el fiambre para el viaje sin preguntarle nada. «Tu padre ya habló con los vecinos», le dijo. «Van a hacer ayni con nosotros». Lucía lloró. Esa tarde subió al bus, con el fiambre todavía caliente sobre las rodillas.",
    ["¿Cuál es el conflicto de Lucía?", "Elegir entre su beca y ayudar a su familia", "Elegir entre dos universidades de Lima con becas distintas", "No tiene conflicto"],
    ["¿Cómo se resuelve el conflicto?", "La comunidad se organiza para ayudar a la familia.", "Lucía decide quedarse en la chacra y renuncia a la beca.", "El padre se cura."],
    ["¿Qué representa el fiambre caliente al final?", "El apoyo y el amor de su familia que la acompaña", "Que Lucía no quería comer en el bus", "El clima"]),
  read("El retrato", "🖼️", "El pintor Melchor pasó toda su vida pintando retratos de hacendados. Le pagaban bien y lo invitaban a sus fiestas. Al final de su vida, pintó un solo cuadro que no vendió: el rostro de la mujer que le lavaba la ropa, con las manos agrietadas. Lo colgó en su taller. Cuando murió, los hacendados no fueron a su entierro. La lavandera fue con sus nietos y pidió quedarse con el cuadro. Hoy está en un museo, y es el único de Melchor que la gente recuerda.",
    ["¿Qué cambio muestra el último cuadro de Melchor?", "Que por fin pintó a alguien por quien sentía verdadero aprecio", "Que había perdido su talento con la edad", "Que quería ganar más dinero"],
    ["¿Qué revela la ausencia de los hacendados en el entierro?", "Que su relación con Melchor era solo de interés", "Que estaban de viaje en el extranjero", "Que no sabían que murió"],
    ["¿Qué ironía plantea el final?", "Su obra más recordada es la que no pintó por dinero.", "Sus cuadros de hacendados son los más famosos del museo.", "Ninguna."]),
];

// --- Analizar poesía ------------------------------------------------------

const RHYME = "¿Cuál es el esquema de rima de la estrofa?";
const RHYME_SCHEMES: ChoiceItem[] = [
  pt(RHYME, "En la orilla del Rímac\nun niño juega con piedras;\ndibuja casas y hiedras\ny sueña con el mar.", "ABBC", "ABAB", "AABB"),
  pt(RHYME, "Se apaga el sol en la puna,\ntiembla el ichu en la ladera,\nsale tímida la luna,\ncanta el viento en la pradera.", "ABAB", "AABB", "ABBA"),
  pt(RHYME, "Mi madre teje en silencio\nmantas de lana y de olvido;\nen cada hilo un latido,\nen cada nudo un silencio.", "ABBA", "ABAB", "AABB"),
  pt(RHYME, "Corre el agua por la acequia,\nbaja alegre del nevado;\nla chacra espera a su lado,\nla tierra seca la espera.", "ABBC", "ABAB", "AABB"),
  pt(RHYME, "El mar de Grau está quieto,\nguarda un nombre y un secreto;\nlas olas cuentan la historia\nde una tarde de memoria.", "AABB", "ABAB", "ABBA"),
  pt(RHYME, "Vuela el cóndor sobre el cañón,\nlleva al cielo mi canción;\nlo miro desde la roca\ny el viento me cierra la boca.", "AABB", "ABBA", "ABAB"),
  pt(RHYME, "Llueve en la selva de noche,\nel río crece y murmura;\nla luna, como un broche,\nse prende a la noche oscura.", "ABAB", "AABB", "ABBA"),
  pt(RHYME, "La plaza duerme tranquila,\nlas palomas en la fuente,\nun anciano mira atento\nla tarde que se despide.", "ABCD", "ABAB", "AABB"),
];

// --- Analizar argumentos --------------------------------------------------

const ARGUMENTS = [
  read("¿Clases en quechua?", "🗣️", "En las comunidades donde los niños hablan quechua en casa, la escuela debería enseñar primero en esa lengua. La razón es simple: nadie aprende a leer en un idioma que no entiende. Los estudios sobre educación intercultural bilingüe muestran que los alumnos que aprenden primero en su lengua materna leen mejor después también en castellano. Algunos temen que esto los aísle del resto del país. Pero el objetivo no es reemplazar el castellano, sino llegar a él sin perder el propio idioma.",
    ["¿Cuál es la tesis del autor?", "En comunidades quechuahablantes, la escuela debe enseñar primero en quechua.", "Todos los niños del Perú deberían aprender solo en quechua y nunca en castellano.", "El quechua es antiguo."],
    ["¿Qué evidencia ofrece?", "Estudios que muestran mejor lectura posterior también en castellano", "Una anécdota de su infancia en una comunidad de Apurímac", "Ninguna"],
    ["¿Cómo responde al temor del aislamiento?", "Aclara que la meta es llegar al castellano sin perder la lengua propia.", "Acepta que el aislamiento es inevitable y necesario.", "No responde."]),
  read("Menos autos en el centro", "🚗", "El centro histórico de Lima debería cerrarse a los autos particulares. Primero, sus calles estrechas no fueron diseñadas para el tráfico actual: un auto que avanza a paso de hombre contamina más que uno que circula. Segundo, ciudades como Bogotá o Madrid han peatonalizado zonas enteras y el comercio aumentó, porque la gente camina, mira y compra. Se dirá que los vecinos necesitan su auto. Para ellos puede haber permisos especiales; lo que no tiene sentido es que el centro sea un estacionamiento.",
    ["¿Cuál es la postura del autor?", "El centro debería cerrarse a los autos particulares.", "El centro debería ampliar sus calles para que circulen más autos.", "Los autos contaminan."],
    ["¿Qué tipo de evidencia usa en el segundo argumento?", "Ejemplos de otras ciudades", "Una estadística sobre accidentes en el centro de Lima", "Una opinión de un vecino"],
    ["¿Qué contraargumento anticipa?", "Que los vecinos necesitan su auto", "Que el comercio del centro disminuiría sin autos", "Que no hay buses"]),
];

// --- Comparar textos ------------------------------------------------------

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿En qué coinciden los dos textos?", "Texto 1: El Qhapaq Ñan unía pueblos de seis países actuales.\nTexto 2: En 2014, la Unesco declaró el Qhapaq Ñan Patrimonio de la Humanidad.", "Ambos destacan la importancia del Qhapaq Ñan.", "Ambos explican cómo se construyeron los puentes colgantes del camino inca con ichu.", "Ninguno habla de caminos."),
  pt("¿En qué se diferencian los dos textos?", "Texto 1: El nuevo aeropuerto atraerá más turistas a Cusco.\nTexto 2: Arqueólogos advierten que el aeropuerto podría dañar el paisaje de Chinchero.", "El primero resalta un beneficio; el segundo, un riesgo.", "Los dos critican el aeropuerto por el daño al paisaje y a los restos arqueológicos.", "Hablan de lugares distintos."),
  pt("¿Qué información agrega el texto 2?", "Texto 1: Las Líneas de Nasca representan animales y figuras geométricas.\nTexto 2: Con drones se han identificado cientos de figuras nuevas que no se veían a simple vista.", "El hallazgo de nuevas figuras gracias a la tecnología", "Que las líneas representan animales", "Su color"),
  pt("¿En qué coinciden los dos textos?", "Texto 1: Dormir menos de siete horas afecta la memoria.\nTexto 2: Los alumnos que duermen bien rinden mejor en matemáticas.", "Ambos vinculan el buen sueño con el rendimiento mental.", "Ambos aseguran que dormir poco mejora la concentración durante los exámenes finales.", "Ambos hablan de deporte."),
  pt("¿En qué se diferencian los dos textos?", "Texto 1: Una empresa asegura que su proyecto de represa traerá energía barata.\nTexto 2: Comunidades nativas denuncian que la represa inundará sus tierras.", "Muestran intereses y perspectivas opuestas.", "Los dos son anuncios publicitarios de la misma empresa constructora.", "No tratan el mismo tema."),
  pt("¿Qué información agrega el texto 2?", "Texto 1: Caral es la ciudad más antigua de América, con unos 5000 años.\nTexto 2: En Caral no se han hallado armas, lo que sugiere una sociedad pacífica.", "Una interpretación sobre la forma de vida en Caral", "La antigüedad de Caral", "Su ubicación"),
];
const GENRE = "¿En qué se diferencian los dos textos?";
const GENRES: ChoiceItem[] = [
  pt(GENRE, "Texto 1 (poema): «Arequipa de sillar, / blanca como la mañana».\nTexto 2 (guía turística): «El sillar es una roca volcánica usada en las construcciones del centro histórico».", "El poema evoca y embellece; la guía explica con datos.", "La guía usa rima y metáforas; el poema define qué es el sillar con datos técnicos.", "Hablan de ciudades distintas."),
  pt(GENRE, "Texto 1 (mito): «Pachacamac castigó a los hombres convirtiéndolos en piedras».\nTexto 2 (artículo): «El santuario de Pachacamac fue un importante centro religioso durante siglos».", "El mito narra un hecho sobrenatural; el artículo informa sobre la historia.", "El artículo narra castigos divinos; el mito da datos sobre el santuario y sus siglos.", "Ambos son mitos."),
  pt(GENRE, "Texto 1 (carta de opinión): «Exijo que reparen la pista de mi calle».\nTexto 2 (noticia): «La municipalidad anunció la reparación de 30 calles».", "La carta busca convencer; la noticia informa un hecho.", "La noticia exige una reparación; la carta informa sobre 30 calles reparadas.", "Ambas son noticias."),
  pt(GENRE, "Texto 1 (diario de viaje): «Hoy caminé seis horas hasta Choquequirao; me temblaban las piernas».\nTexto 2 (folleto): «Choquequirao: un tesoro inca a solo dos días de caminata».", "El diario narra una vivencia personal; el folleto promociona el destino.", "El folleto narra cansancio personal; el diario promociona el destino turístico.", "Ambos son íntimos."),
  pt(GENRE, "Texto 1 (décima): «Mi abuela, negra y serena, / cantaba en el cañaveral».\nTexto 2 (informe): «Las haciendas de caña empleaban mano de obra esclavizada hasta 1854».", "La décima expresa memoria y emoción; el informe da datos históricos.", "El informe usa versos rimados; la décima presenta fechas y datos históricos exactos.", "Ambas son informes."),
  pt(GENRE, "Texto 1 (cuento): «El zorro quiso subir al cielo colgado de un cóndor».\nTexto 2 (enciclopedia): «El zorro andino es un cánido que habita en la sierra».", "El cuento es fantástico; la enciclopedia es científica.", "La enciclopedia es fantástica; el cuento describe científicamente al animal.", "Ambos son cuentos."),
];

// --- Elementos visuales ---------------------------------------------------

const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿Qué diferencia hay entre las dos ilustraciones de Miguel Grau?", "Ilustración 1: retrato oficial con uniforme de gala, mirada firme.\nIlustración 2: dibujo de Grau escribiendo una carta a la viuda de un enemigo, con gesto compasivo.", "La 1 destaca su autoridad; la 2, su humanidad.", "La 2 destaca su autoridad; la 1, su humanidad.", "Son iguales."),
  pt("¿Qué tienen en común las dos ilustraciones de Túpac Amaru II?", "Ilustración 1: grabado antiguo montado a caballo.\nIlustración 2: mural moderno con su rostro sobre una multitud.", "Ambas lo presentan como líder.", "Ambas lo presentan como un personaje burlesco y sin importancia.", "Ninguna lo muestra."),
  pt("¿Qué transmite cada ilustración de «El mundo es ancho y ajeno»?", "Ilustración 1: la comunidad de Rumi trabajando unida en una cosecha soleada.\nIlustración 2: comuneros caminando cabizbajos hacia tierras altas y frías.", "La 1, armonía; la 2, despojo.", "La 1, despojo; la 2, armonía.", "Las dos, alegría."),
  pt("¿Qué diferencia hay entre las dos ilustraciones de Chan Chan?", "Ilustración 1: reconstrucción de la ciudad llena de gente y colores.\nIlustración 2: fotografía actual de muros de barro erosionados.", "La 1 imagina su esplendor; la 2 muestra su estado actual.", "La 1 muestra su estado actual; la 2 imagina su esplendor.", "Son idénticas."),
  pt("¿Qué tienen en común las dos ilustraciones de la leyenda de la Achiqueé?", "Ilustración 1: una anciana que persigue a dos niños por el cerro.\nIlustración 2: dos niños escapando hacia el cielo por una soga.", "Ambas representan la persecución y la huida.", "Ambas muestran una fiesta en la plaza del pueblo.", "No hay relación."),
];
const ORGANIZERS: ChoiceItem[] = [
  pt("¿Qué tipo de organizador gráfico es?", "Un tema central, «Contaminación», con ramas hacia «agua», «aire» y «suelo», y de cada una salen ejemplos.", "Mapa mental", "Línea de tiempo", "Diagrama de Venn"),
  pt("¿Qué tipo de organizador gráfico es?", "Una tabla con columnas «Ventajas» y «Desventajas» de la energía solar.", "Cuadro comparativo", "Mapa de causa y efecto", "Línea de tiempo"),
  pt("Según la línea de tiempo, ¿qué ocurrió en 1824?", "1780: rebelión de Túpac Amaru II · 1821: proclamación de la independencia · 1824: batalla de Ayacucho", "La batalla de Ayacucho", "La proclamación de la independencia", "La rebelión de Túpac Amaru II"),
  pt("Según el diagrama de Venn, ¿qué comparten el cuento y la novela?", "Cuento: breve, un conflicto · Ambos: narrador, personajes · Novela: extensa, varios conflictos", "Narrador y personajes", "Un solo conflicto", "La extensión"),
  pt("Según el diagrama de causa y efecto, ¿cuál es la causa?", "Uso excesivo de pesticidas → muerte de abejas → menos polinización → menor cosecha", "El uso excesivo de pesticidas", "La menor cosecha", "La menos polinización"),
  pt("Según el cuadro, ¿qué piso ecológico tiene más altitud?", "Piso | Altitud\nChala | 0-500 m\nQuechua | 2300-3500 m\nPuna | 4000-4800 m", "Puna", "Chala", "Quechua"),
];

export const ROWS: Row[] = [
  ["ideas-principales-1", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["ideas-principales-2", (r) => readPassage(r, MULTI_MAIN, false)],
  ["ideas-principales-3", (r) => choose(r, "", TWO_MAIN)],

  ["temas-1", (r) => choose(r, "¿Qué tema expresa la cita?", QUOTE_THEMES)],
  ["temas-2", (r) => readPassage(r, THEMES, false)],
  ["temas-3", (r) => readPassage(r, MULTI_THEMES, false)],

  ["proposito-1", (r) => choose(r, "", AUTHOR_PURPOSE)],
  ["proposito-2", (r) => choose(r, "", AUTHOR_POV)],

  ["tono-1", (r) => choose(r, "", FORMALITY)],
  ["tono-2", (r) => choose(r, "", TONE_COMPARE)],

  ["estructuras-1", (r) => readPassage(r, COMPARE, false)],
  ["estructuras-2", (r) => choose(r, "", CAUSE_INFO)],
  ["estructuras-3", (r) => choose(r, "¿Qué solución corresponde al problema?", PROBLEM_SOLUTION)],
  ["estructuras-4", (r) => choose(r, "", STRUCTURES)],

  ["sentidos-alusion-1", (r) => choose(r, "", SENSORY)],
  ["sentidos-alusion-2", (r) => choose(r, "", ALLUSIONS)],
  ["sentidos-alusion-3", (r) => choose(r, "", ALLUSION_SOURCE)],
  ["figuras-1", (r) => choose(r, "", FIGURE_MEANING)],
  ["figuras-2", (r) => choose(r, "", FIGURE_CLASSIFY)],
  ["figuras-3", (r) => choose(r, "", FIGURE_EFFECT)],

  ["literatura-1", (r) => choose(r, "", NARRATOR)],
  ["literatura-2", (r) => readPassage(r, INFER_LIT, false)],
  ["literatura-3", (r) => readPassage(r, SHORT_STORIES, false)],

  ["rima", (r) => choose(r, "", RHYME_SCHEMES)],

  ["argumento", (r) => readPassage(r, ARGUMENTS, false)],

  ["comparar-textos-1", (r) => choose(r, "", TWO_TEXTS)],
  ["comparar-textos-2", (r) => choose(r, "", GENRES)],

  ["visuales-1", (r) => choose(r, "", ILLUSTRATIONS)],
  ["visuales-2", (r) => choose(r, "", ORGANIZERS)],
];
