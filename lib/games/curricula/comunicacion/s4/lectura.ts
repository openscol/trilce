import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pt, read, sorter } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Secundaria · banco de comprensión y lectura atenta con lecturas
// propias sobre el Perú: ideas principales, desarrollo de temas, destinatario,
// propósito y perspectiva, tono, alusiones, figuras literarias, narrador,
// personajes y estructura, cuentos breves y elementos de la poesía.

// --- Ideas principales -----------------------------------------------------

const MAIN = [
  read("Los andenes", "⛰️", "En las laderas de los Andes, donde casi no hay suelo plano, los pueblos prehispánicos construyeron andenes: terrazas sostenidas por muros de piedra. Cada escalón retenía tierra fértil y agua, y los muros de piedra guardaban el calor del día para soltarlo de noche, lo que protegía los cultivos de las heladas. Muchos andenes siguen en uso después de más de mil años, y hoy los agrónomos los estudian como una respuesta al cambio climático.",
    ["¿Cuál es la idea principal?", "Los andenes son una técnica agrícola eficaz que sigue vigente.", "Los muros de piedra se calientan con el sol.", "Los pueblos prehispánicos vivían solo en la costa y en los valles, lejos de las laderas andinas."],
    ["¿Qué detalle apoya la idea de que los andenes protegen los cultivos?", "Los muros guardan el calor y lo sueltan de noche.", "Tienen más de mil años.", "Los agrónomos los estudian en universidades extranjeras."],
    ["¿Por qué el texto menciona el cambio climático?", "Para mostrar que la técnica antigua sirve también hoy", "Para decir que los andenes provocan heladas", "Para explicar que el clima de los Andes era más frío hace mil años"]),
  read("El banco de papas", "🥔", "En las afueras de Lima, el Centro Internacional de la Papa guarda miles de variedades de papa, camote y otras raíces andinas. Las semillas y los tubérculos se conservan en frío o en tubos de ensayo, como en una biblioteca viva. Si una plaga destruye los cultivos de una región, los científicos pueden recuperar variedades resistentes. Así, una colección que parece un archivo del pasado es, en realidad, un seguro para el futuro de la alimentación.",
    ["¿Cuál es la idea principal?", "El banco de papas protege la alimentación del futuro.", "El camote es una raíz andina que se come frita.", "Las plagas destruyen siempre todos los cultivos de una región."],
    ["¿Qué comparación usa el autor?", "Compara la colección con una biblioteca viva.", "Compara la papa con el oro.", "Compara a los científicos con agricultores que trabajan en el campo de noche."],
    ["¿Qué idea contrasta la última oración?", "Lo que parece del pasado sirve para el futuro.", "Que la papa y el camote se conservan mejor en frío que al aire libre", "El frío y el calor de los laboratorios"]),
  read("El friaje", "🥶", "Cada invierno, masas de aire frío del sur del continente llegan a la selva peruana y bajan la temperatura en pocas horas. Es el friaje. Para pueblos acostumbrados al calor, el cambio es brusco: los niños y los ancianos enferman de los bronquios, los peces de los ríos mueren y los cultivos se dañan. En las alturas del sur, las heladas causan efectos parecidos. Por eso, las campañas de abrigo y de vacunación se concentran entre mayo y agosto.",
    ["¿Cuál es la idea principal?", "El friaje es un enfriamiento brusco que afecta la salud y la economía.", "En la selva siempre hace calor.", "Las vacunas se aplican solo en agosto, cuando termina el invierno en todo el Perú."],
    ["¿Por qué las campañas se concentran entre mayo y agosto?", "Porque en esos meses llega el friaje.", "Porque hay vacaciones escolares en esos meses.", "Por el calor"],
    ["¿Qué ejemplo muestra el daño a la economía?", "Mueren peces y se dañan cultivos.", "Los niños se enferman.", "Llega aire frío del sur del continente cada invierno."]),
];

const MULTI = [
  read("La Amazonía peruana", "🌳", "La Amazonía cubre más de la mitad del territorio peruano, pero alberga a menos de la décima parte de la población. Es, ante todo, una reserva de biodiversidad: en una sola hectárea pueden convivir cientos de especies de árboles. Es también un regulador del clima, pues sus bosques absorben carbono y producen lluvias que llegan hasta los Andes. Y es el hogar de más de cincuenta pueblos indígenas, con lenguas y conocimientos propios sobre las plantas y los ríos.",
    ["¿Cuáles son las ideas principales del texto?", "La Amazonía es reserva de biodiversidad, reguladora del clima y hogar de pueblos indígenas.", "La Amazonía está muy poblada y tiene grandes ciudades.", "La Amazonía tiene ríos navegables, ciudades en crecimiento y carreteras nuevas que la unen con la costa y con Brasil."],
    ["¿Qué tienen en común las tres ideas?", "Todas muestran la importancia de la Amazonía.", "Todas hablan de los ríos.", "Todas mencionan cifras de población de las ciudades amazónicas, como Iquitos."],
    ["¿Qué dato abre el texto?", "La Amazonía es grande pero poco poblada.", "Hay cincuenta pueblos indígenas.", "Los bosques absorben carbono y producen las lluvias que llegan hasta los Andes."]),
  read("El cajón peruano", "🪘", "El cajón nació en la costa peruana, probablemente entre esclavos africanos a quienes se prohibía tocar tambores: una caja de madera para guardar fruta se convirtió en instrumento. Con el tiempo, acompañó el festejo, el landó y la marinera, y en 2001 fue declarado Patrimonio Cultural de la Nación. Hoy suena en el flamenco español y en el jazz, lo que muestra cómo una creación nacida de la resistencia llegó a escenarios de todo el mundo.",
    ["¿Qué ideas principales desarrolla el texto?", "El origen del cajón, su lugar en la música peruana y su difusión mundial.", "Cómo se fabrica un cajón de madera paso a paso.", "La historia del flamenco español y de los músicos de jazz que lo popularizaron en el mundo."],
    ["¿Por qué el autor dice que el cajón nació «de la resistencia»?", "Porque surgió cuando se prohibían los tambores.", "Porque la madera es muy resistente.", "Porque lo tocaban los soldados en las guerras de la independencia"],
    ["¿Qué hecho prueba su valor en el Perú?", "Fue declarado Patrimonio Cultural de la Nación.", "Suena en el jazz.", "Se usaba para guardar fruta en los mercados y las casas de la costa."]),
];

// --- Temas ------------------------------------------------------------------

const THEMES = [
  read("La beca", "🎓", "Yolanda ganó una beca para estudiar en Lima y dejó su comunidad en Puno. En la ciudad nadie entendía su quechua y en la universidad le corregían el acento. Durante meses habló poco. Una tarde, en una clase sobre lenguas originarias, el profesor pidió un ejemplo de canción en quechua y nadie levantó la mano. Yolanda cantó. Al terminar, sus compañeros aplaudieron, y ella sintió que lo que antes escondía era justamente lo que podía ofrecer.",
    ["¿Cómo se desarrolla el tema de la identidad?", "Pasa de vivirse como vergüenza a ser motivo de orgullo.", "Yolanda olvida su lengua y se adapta a la ciudad.", "Se mantiene igual en todo el cuento."],
    ["¿Qué momento marca el cambio?", "Cuando canta en quechua en la clase", "Cuando gana la beca", "Cuando deja Puno y viaja en bus a Lima por primera vez con su familia"],
    ["¿Qué tema central propone el cuento?", "El valor de la propia cultura", "Lo difícil que es ganar una beca", "La música"]),
  read("El año del Niño", "🌊", "Don Faustino pescaba en Paita desde niño. El año del Niño, el mar se calentó y la anchoveta desapareció. Al principio maldijo al mar; después, a los empresarios, y luego, al gobierno. Pasaron los meses y sus hijos empezaron a criar conchas de abanico en una cooperativa. Don Faustino los miraba con desconfianza, hasta que un día fue a ayudar. «El mar no se va», dijo al final del año, «somos nosotros los que tenemos que aprender a cambiar con él».",
    ["¿Cómo evoluciona el tema de la adaptación?", "Del enojo y la culpa a la aceptación del cambio", "De la alegría a la tristeza", "De la confianza en el mar a la decisión de abandonar la pesca para siempre"],
    ["¿Qué revela la frase final?", "Que el protagonista entendió que debe adaptarse.", "Que el mar se fue para siempre.", "Que los empresarios tenían la culpa de todo lo que le había pasado a la pesca."],
    ["¿Qué papel cumplen los hijos en el tema?", "Muestran otra forma de enfrentar el problema.", "Son la causa del Niño.", "Convencen a su padre de vender el bote y mudarse a Lima."]),
];

// --- Destinatario, propósito y perspectiva ----------------------------------

const AUDIENCE: ChoiceItem[] = [
  pt("¿A quién se dirige el texto y con qué propósito?", "«Vecino: el recojo de basura será martes, jueves y sábado desde las 7 p. m. No saques tus bolsas antes. ¡Cuidemos nuestro distrito!»", "A los vecinos, para informarles y pedirles que cumplan el horario", "A los recolectores, para quejarse del sueldo", "A los turistas que visitan el distrito para conocer sus parques"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«Se ha observado que el 38 % de las muestras de agua supera el límite de arsénico. Se recomienda instalar plantas de tratamiento en los centros poblados evaluados.»", "A autoridades y técnicos, para informar y recomendar", "A los niños, para entretenerlos", "A los vecinos, para venderles agua embotellada a buen precio"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«Señor director: los alumnos de quinto solicitamos que la biblioteca abra en el recreo. Muchos no tenemos internet en casa y necesitamos consultar libros.»", "Al director del colegio, para hacer una solicitud", "A los padres de familia, para vender libros", "A otros alumnos, para invitarlos"),
  pt("¿A quién se dirige el texto y con qué propósito?", "«¿Cansado de la misma rutina? Únete al taller de teatro. Sábados de 3 a 5 p. m. en la casa de la cultura. ¡Ingreso libre!»", "A jóvenes y vecinos, para invitarlos a participar", "A los actores profesionales, para contratarlos", "Al alcalde"),
];
const PERSPECTIVE: ChoiceItem[] = [
  pt("¿Cuál es la perspectiva del autor?", "«Se dice que los jóvenes no leen. Pero basta ver las colas en la Feria del Libro o los clubes de lectura en redes sociales para entender que leen distinto, no menos.»", "Los jóvenes leen, aunque de otras formas.", "Los jóvenes ya no leen nada.", "Las ferias del libro son muy caras y por eso los jóvenes no van."),
  pt("¿Cuál es la perspectiva del autor?", "«La minería ha traído divisas al país, sin duda. Sin embargo, de poco sirve el crecimiento si las comunidades vecinas a las minas siguen sin agua potable.»", "El crecimiento minero debe beneficiar también a las comunidades.", "La minería debería prohibirse en todo el país porque solo deja contaminación y pobreza.", "Las comunidades tienen agua de sobra."),
  pt("¿Cuál es la perspectiva del autor?", "«El transporte informal no es solo un problema de tránsito: es la consecuencia de décadas sin un sistema público que responda a las necesidades de la gente.»", "El transporte informal surge por la falta de un buen sistema público.", "Los choferes informales son los únicos culpables.", "El tránsito de Lima mejoraría si se prohibieran los buses y se usaran solo autos particulares."),
  pt("¿Cuál es la perspectiva del autor?", "«Celebrar a los héroes está bien, pero la historia también la hicieron mujeres, campesinos y arrieros que no tienen estatuas.»", "La historia debe reconocer también a quienes no tienen estatuas.", "Hay que retirar las estatuas de los héroes de todas las plazas del país.", "Solo los héroes hicieron la historia."),
];

// --- Tono -------------------------------------------------------------------

const FORMAL: ChoiceItem[] = [
  f("¿Qué texto es más formal?", "Por medio de la presente, solicito se me otorgue una constancia de estudios.", "Oye, ¿me pasas la constancia de estudios porfa?", "Oye, porfa, necesito la constancia de estudios para mañana mismo, que si no me friego, ¿ok?"),
  f("¿Qué texto es más formal?", "Lamentamos informarle que la reunión ha sido postergada.", "Uy, chicos, la reunión ya fue, la movieron para otro día que todavía no saben.", "Chicos, no hay reunión hoy, se cayó."),
  f("¿Qué texto es más formal?", "Agradeceremos su puntual asistencia.", "¡No falten, causas!", "Vengan temprano, ¿ya?, que si no la profe se molesta un montón."),
  f("¿Qué texto es más formal?", "Se ruega mantener el orden en la sala.", "¡Silencio, pues!", "Ya, cállense un rato todos los de atrás."),
];
const OBJECTIVE = sorter(["Objetivo", "Subjetivo"], "¿El tono de este texto es objetivo o subjetivo?");
const OBJECTIVE_ITEMS: ChoiceItem[] = [
  OBJECTIVE("El lago Titicaca está a 3812 metros sobre el nivel del mar.", 0),
  OBJECTIVE("El Titicaca es, sin duda, el lago más hermoso que existe.", 1),
  OBJECTIVE("La encuesta se aplicó a 1200 personas de 24 regiones.", 0),
  OBJECTIVE("Es indignante que la encuesta haya ignorado a los jóvenes.", 1),
  OBJECTIVE("El puente mide 220 metros y se inauguró en 2019.", 0),
  OBJECTIVE("Ese puente horrible arruinó el paisaje del valle.", 1),
  OBJECTIVE("Según el INEI, la población urbana supera el 79 %.", 0),
  OBJECTIVE("Por fin alguien se atreve a decir la verdad sobre la ciudad.", 1),
];
const TONE: ChoiceItem[] = [
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «La plaza amaneció cubierta de basura tras la fiesta.»\nB: «¡Qué vergüenza! Otra vez la plaza convertida en un basural.»", "A es neutral; B es indignado.", "A es humorístico; B es neutral.", "Los dos tienen el mismo tono, aunque B es un poco más largo que A."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «Mi abuela me enseñó a hacer chicha morada, y cada vez que la preparo la siento cerca.»\nB: «La chicha morada se prepara hirviendo maíz morado con cáscara de piña y canela.»", "A es nostálgico; B es informativo.", "A es irónico; B es enojado.", "A es neutral; B es muy emotivo."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «Claro, otra obra que se inaugura sin terminar. Qué sorpresa.»\nB: «La obra se inauguró con un avance del 85 %.»", "A es irónico; B es neutral.", "Ambos son entusiastas.", "A es formal y técnico; B es irónico y burlón."),
  pt("Lee los dos textos. ¿En qué se diferencia su tono?", "A: «¡Lo logramos! ¡El equipo del colegio es campeón regional!»\nB: «El equipo del colegio obtuvo el primer puesto regional.»", "A es entusiasta; B es neutral.", "A es triste; B es alegre.", "Ninguno expresa nada."),
];

// --- Alusiones -----------------------------------------------------------------

const ALLUSION: ChoiceItem[] = [
  pt("¿Qué quiere decir la alusión?", "«Esa ley es una caja de Pandora: al aprobarla, salieron problemas que nadie esperaba.»", "Que causó muchos males inesperados", "Que guardaba un tesoro escondido", "Que era una ley muy antigua"),
  pt("¿Qué quiere decir la alusión?", "«El pequeño equipo de Huancavelica fue un David frente al Goliat del campeonato.»", "Que un equipo débil enfrentó a uno mucho más fuerte", "Que los dos equipos eran iguales", "Que el equipo de Huancavelica era el favorito y ganó todos sus partidos"),
  pt("¿Qué quiere decir la alusión?", "«El ministro luchaba contra molinos de viento.»", "Que peleaba contra enemigos imaginarios", "Que construía molinos en el campo", "Que estaba de acuerdo con todos"),
  pt("¿Qué quiere decir la alusión?", "«La impuntualidad es el talón de Aquiles de nuestro equipo.»", "Que es su punto débil", "Que es su mayor fortaleza", "Que los jugadores tienen lesiones en el pie"),
  pt("¿Qué quiere decir la alusión?", "«Quiso volar tan alto que, como Ícaro, terminó cayendo.»", "Que su ambición excesiva lo llevó al fracaso", "Que era piloto de avión y tuvo un accidente", "Que nunca intentó nada"),
];
const ALLUSION_SOURCE: ChoiceItem[] = [
  f("¿De dónde proviene la expresión «caja de Pandora»?", "De la mitología griega", "De la Biblia", "De una leyenda andina"),
  f("¿De dónde proviene la alusión a David y Goliat?", "De la Biblia", "De la mitología griega", "Del Quijote"),
  f("¿De dónde proviene la expresión «luchar contra molinos de viento»?", "Del Quijote, de Miguel de Cervantes", "De la mitología griega", "De un cuento de Ricardo Palma"),
  f("¿De dónde proviene el mito de Ícaro?", "De la mitología griega", "De la Biblia", "De la tradición inca"),
  f("¿De dónde proviene la figura de Manco Cápac saliendo del lago Titicaca?", "De la tradición andina sobre el origen de los incas", "De la mitología griega", "De una novela de Mario Vargas Llosa sobre la selva amazónica"),
];

// --- Figuras literarias ---------------------------------------------------------

const FIGURES = ["Eufemismo", "Hipérbole", "Oxímoron", "Paradoja"];
const fig = sorter(FIGURES, "¿Qué figura literaria hay en la oración?");
const FIGURE_ITEMS: ChoiceItem[] = [
  fig("Mi abuelo pasó a mejor vida el invierno pasado.", 0),
  fig("La empresa ha decidido prescindir de sus servicios.", 0),
  fig("Las personas de la tercera edad tienen pasaje libre.", 0),
  fig("Te lo he dicho un millón de veces.", 1),
  fig("Tengo tanta hambre que me comería una vaca entera.", 1),
  fig("Esa mochila pesa una tonelada.", 1),
  fig("En la fiesta reinaba un silencio atronador.", 2),
  fig("Sentía una dulce amargura al despedirse.", 2),
  fig("Era una luz oscura la que entraba por la ventana.", 2),
  fig("Solo sé que no sé nada.", 3),
  fig("Vivo sin vivir en mí.", 3),
  fig("Cuanto más aprendo, más descubro lo que ignoro.", 3),
];
const FIGURE_MEANING: ChoiceItem[] = [
  pt("¿Qué significa la figura?", "«Llevamos siglos esperando el bus.»", "Que esperaron mucho tiempo", "Que esperaron cien años", "Que el bus llegó temprano"),
  pt("¿Qué significa la figura?", "«Su silencio lo dijo todo.»", "Que sin hablar dejó clara su opinión", "Que habló sin parar durante horas", "Que estaba enfermo"),
  pt("¿Qué significa la figura?", "«Esa noticia fue un baldazo de agua fría.»", "Que la noticia desanimó de golpe", "Que llovió mucho ese día", "Que la noticia fue alegre y esperada por todos"),
  pt("¿Qué significa la figura?", "«La ciudad dormía bajo la garúa.»", "Que la ciudad estaba tranquila y en silencio", "Que todos tenían sueño", "Que los habitantes se habían ido a dormir más temprano de lo normal"),
];
const FIGURE_EFFECT: ChoiceItem[] = [
  pt("¿Qué efecto tiene la figura en el texto?", "«Los cerros, gigantes dormidos, vigilaban el pueblo.»", "Da a los cerros una presencia protectora y casi humana.", "Informa la altura exacta de los cerros y la distancia que los separa del pueblo.", "Hace que el texto sea gracioso y burlón."),
  pt("¿Qué efecto tiene la figura en el texto?", "«Era un cementerio de autos: chatarra, óxido y silencio.»", "Crea una imagen de abandono y muerte.", "Indica que allí entierran a personas.", "Vuelve el texto más alegre."),
  pt("¿Qué efecto tiene la figura en el texto?", "«El discurso del alcalde fue tan corto como un año sin lluvias.»", "Usa la ironía para decir que fue muy largo.", "Explica el clima del distrito.", "Elogia la brevedad del alcalde y su capacidad para resumir."),
  pt("¿Qué efecto tiene la figura en el texto?", "«Volvió al pueblo después de la guerra: era un niño viejo.»", "El oxímoron muestra que la guerra le robó la infancia.", "Indica su edad exacta.", "Indica que el protagonista era un anciano que volvió después de muchos años."),
];

// --- Lectura atenta: textos literarios -------------------------------------------

const NARRATOR = sorter(["Primera persona", "Tercera persona omnisciente", "Tercera persona limitada", "Segunda persona"], "¿Qué tipo de narrador tiene el fragmento?");
const NARRATOR_ITEMS: ChoiceItem[] = [
  NARRATOR("Aquella mañana desperté antes que el gallo. Sabía que no volvería a ver mi casa.", 0),
  NARRATOR("Rosa temía que la descubrieran; Julián, en cambio, pensaba en su madre enferma, y el capataz solo deseaba que terminara el día.", 1),
  NARRATOR("Pedro miró el río. No entendía por qué su padre se había ido sin despedirse.", 2),
  NARRATOR("Abres la puerta y el olor a tierra mojada te devuelve a la infancia.", 3),
  NARRATOR("No me pregunten por qué lo hice; solo sé que no podía quedarme callado.", 0),
  NARRATOR("Todos en el pueblo sabían lo que pasaba, aunque cada uno lo callaba por un motivo distinto: el cura por miedo, el alcalde por interés y la vieja Asunta por pena.", 1),
];
const CHARACTERS = [
  read("El heredero", "🏚️", "Al morir su padre, Ernesto heredó la tienda del barrio. Al principio subió los precios y cobraba intereses a los vecinos que pedían fiado. Un día, la señora Remigia, que lo había cuidado de niño, le pidió azúcar para el cumpleaños de su nieta y no tenía cómo pagar. Ernesto dudó, recordó las tardes en que ella le daba pan con mantequilla, y le entregó el azúcar y una torta. Desde entonces, la tienda volvió a ser lo que había sido con su padre.",
    ["¿Cómo evoluciona Ernesto?", "De ambicioso y frío a generoso", "De generoso a ambicioso", "No cambia en todo el relato."],
    ["¿Qué provoca el cambio?", "El recuerdo del cariño de la señora Remigia", "Una multa de la municipalidad", "El cumpleaños de su propio hijo menor, que vivía lejos"],
    ["¿Qué sugiere la última oración?", "Que Ernesto recuperó los valores de su padre.", "Que cerró la tienda.", "Que la señora Remigia compró la tienda."]),
  read("La delegada", "🗳️", "Milagros no quería ser delegada del salón; la eligieron porque nadie más se ofreció. Al principio se limitaba a anotar los nombres de quienes hacían bulla. Pero cuando el colegio quiso cancelar el viaje de promoción por falta de fondos, fue ella quien organizó una pollada, habló con la directora y consiguió la mitad del dinero. Al terminar el año, sus compañeros la reeligieron sin dudar.",
    ["¿Cómo cambia Milagros?", "De delegada sin interés a líder comprometida", "De líder a persona tímida", "De líder respetada a alumna que abandona el cargo por cansancio"],
    ["¿Qué hecho revela su cambio?", "Organiza una pollada y habla con la directora.", "Anota los nombres de los que hacen bulla.", "Es elegida al principio del año sin haberse ofrecido para el cargo."],
    ["¿Qué muestra la reelección?", "Que sus compañeros reconocieron su cambio", "Que nadie más quería el cargo", "Que nadie más quería ser delegado y no había otra opción"]),
];
const CRAFT: ChoiceItem[] = [
  pt("¿Qué recurso de estructura usa el autor?", "El cuento empieza con el protagonista ya preso y, luego, narra lo que lo llevó a la cárcel.", "Comienza in medias res y retrocede a los hechos anteriores.", "Narra los hechos en estricto orden cronológico.", "Usa un final abierto y no explica nada de lo que ocurre antes."),
  pt("¿Qué recurso de estructura usa el autor?", "En medio de la boda, la narradora recuerda el día en que conoció al novio, diez años antes.", "Una retrospección (flashback)", "Una anticipación del futuro", "Un diálogo teatral entre los novios"),
  pt("¿Qué recurso de estructura usa el autor?", "El relato termina cuando el padre abre la carta, sin decir qué contenía.", "Un final abierto", "Un final feliz", "Una moraleja explícita al final del relato"),
  pt("¿Qué recurso de estructura usa el autor?", "En el primer capítulo, el narrador dice: «Nadie imaginaba que esa sería la última fiesta del pueblo».", "Una anticipación (prolepsis)", "Una retrospección", "Una descripción del paisaje del pueblo en la sierra"),
];

// --- Lectura atenta: textos informativos ---------------------------------------

const WORD_CHOICE: ChoiceItem[] = [
  pt("¿Qué efecto tiene la palabra «arrasó» en la oración?", "«La empresa arrasó con el bosque para construir la carretera.»", "Sugiere destrucción violenta y una crítica a la empresa.", "Indica que la empresa cuidó el bosque.", "Indica que la empresa cuidó el bosque y sembró nuevos árboles junto a la carretera."),
  pt("¿Qué efecto tiene la palabra «reclamaron» en la oración?", "«Los vecinos reclamaron agua potable durante años.»", "Muestra una demanda insistente y legítima.", "Indica que los vecinos estaban contentos con el servicio.", "Que vendían agua"),
  pt("¿Qué efecto tiene la palabra «regaló» en la oración?", "«El gobierno regaló computadoras a los colegios.»", "Presenta como favor lo que podría verse como obligación.", "Informa con exactitud cuántas computadoras recibió cada colegio y a qué precio.", "Critica a los colegios por pedir computadoras."),
  pt("¿Qué efecto tiene la palabra «huyen» en la oración?", "«Miles de jóvenes huyen cada año del campo.»", "Sugiere que el campo es un lugar del que hay que escapar.", "Indica que los jóvenes viajan de vacaciones al campo.", "No tiene ningún efecto."),
];
const INFO_CRAFT = [
  read("¿Por qué se cae el cerro?", "⛰️", "¿Por qué cada verano los huaicos destruyen casas en Chosica? La respuesta tiene tres partes. Primero, las lluvias intensas en las alturas arrastran lodo y piedras por las quebradas. Segundo, muchas viviendas se construyeron justo en el cauce de esas quebradas secas. Tercero, la falta de muros de contención deja a esas casas sin protección. Mientras no se atiendan las tres causas, el problema se repetirá.",
    ["¿Cómo está organizado el texto?", "Empieza con una pregunta y responde con tres causas.", "Narra un huaico en orden cronológico.", "Compara Chosica con otras ciudades de la sierra que también sufren huaicos cada año."],
    ["¿Qué función cumple la pregunta inicial?", "Plantea el problema que el texto va a explicar.", "Pide la opinión del lector.", "Es una pregunta sin respuesta que nunca se contesta en el texto."],
    ["¿Qué función cumple la última oración?", "Concluye con una advertencia basada en las causas.", "Presenta una cuarta causa: el crecimiento desordenado de la población en los cerros.", "Cuenta la historia de Chosica."]),
  read("Dos maneras de regar", "💧", "En la costa peruana se riega de dos formas. El riego por inundación, el más antiguo, cubre el terreno con agua: es barato, pero desperdicia hasta la mitad del líquido. El riego por goteo, en cambio, deja caer gotas junto a cada planta: cuesta más instalarlo, pero ahorra agua y aumenta las cosechas. En una región desértica, la elección no es solo técnica, sino también ambiental.",
    ["¿Qué estructura usa el texto?", "Comparación y contraste", "Problema y solución sin comparar", "Secuencia de pasos para instalar un sistema de riego"],
    ["¿Qué palabra marca el contraste?", "«en cambio»", "«también»", "«el más antiguo»"],
    ["¿Qué agrega la última oración?", "Una reflexión que va más allá de lo técnico", "Un dato del precio del goteo", "Una instrucción para instalar el riego por goteo en casa"]),
];

// --- Cuentos ------------------------------------------------------------------------

const STORIES_1 = [
  read("La última función", "🎪", "El circo llegó a Ayacucho con una sola carpa remendada y tres artistas. La noche del estreno solo hubo doce espectadores. El payaso, que era también el dueño, hizo su número como si el público llenara las graderías. Al día siguiente vinieron cuarenta, y al otro, cien. «La gente no viene por el circo», le dijo a su hija, «viene por las ganas con que se hace».",
    ["¿Qué rasgo define al payaso?", "Su entrega y perseverancia", "Su deseo de hacerse famoso en Lima", "Su miedo al público"],
    ["¿Qué tema desarrolla el cuento?", "La pasión por el trabajo bien hecho", "Lo difícil que es viajar con un circo por las carreteras de la sierra", "El dinero"],
    ["¿Qué recurso usa la frase final?", "Resume el mensaje del cuento en palabras de un personaje.", "Describe el paisaje.", "Anticipa un final trágico para el circo y sus tres artistas."]),
  read("El reloj del abuelo", "⏰", "Desde que el abuelo murió, nadie se atrevía a darle cuerda a su reloj de pared. La casa parecía detenida. Un domingo, la nieta menor, que no sabía de duelos, subió a una silla y movió la llave. El tictac volvió a llenar la sala. La abuela, que lloraba en la cocina, se secó las lágrimas y puso la mesa para todos, como antes.",
    ["¿Qué simboliza el reloj detenido?", "El duelo que paraliza a la familia", "Que el reloj estaba malogrado", "La pobreza de la familia"],
    ["¿Por qué es importante que sea la nieta quien da cuerda?", "Porque su inocencia permite que la vida continúe.", "Porque era la más alta de la casa.", "Porque el abuelo se lo había pedido en una carta antes de morir."],
    ["¿Qué indica el final?", "Que la familia empieza a superar la pérdida.", "Que la abuela se enoja.", "Que la abuela decide vender el reloj para pagar las deudas del abuelo."]),
];
const STORIES_2 = [
  read("El concurso", "🎻", "Andrés practicó el violín durante seis meses para el concurso regional. El día de la prueba, una cuerda se rompió en el segundo minuto. Hubo risas en la sala. Andrés respiró, terminó la pieza con tres cuerdas y se retiró sin mirar al jurado. No ganó. Pero a la salida, una niña se le acercó con su estuche y le preguntó cómo se hacía para no rendirse.",
    ["¿Qué conflicto enfrenta Andrés?", "Un accidente que pone a prueba su temple", "Una pelea con el jurado", "La falta de dinero para viajar al concurso regional"],
    ["¿Qué sugiere la pregunta de la niña?", "Que Andrés ganó algo más valioso que el premio.", "Que la niña quería su violín.", "Que el jurado se equivocó y debía darle el premio a Andrés."],
    ["¿Cuál es el tema?", "La perseverancia ante la adversidad", "La música clásica", "La competencia entre los músicos de la región"]),
  read("Agua para Ccochaccasa", "🚰", "En Ccochaccasa el agua llegaba por horas. Doña Felícita llevaba veinte años cargando baldes desde el puquial. Cuando el municipio anunció la obra de agua potable, nadie le creyó: ya lo habían prometido tres alcaldes. Esta vez, sin embargo, fueron las mujeres del pueblo quienes vigilaron cada metro de tubería. El día en que abrieron el primer caño, doña Felícita no dijo nada: solo dejó correr el agua entre sus manos durante un largo rato.",
    ["¿Por qué nadie creía en la obra?", "Porque otros alcaldes ya la habían prometido sin cumplir.", "Porque los ingenieros dijeron que no había agua suficiente en el puquial para todo el pueblo.", "Porque doña Felícita se oponía."],
    ["¿Qué papel cumplen las mujeres del pueblo?", "Vigilan la obra para que se cumpla.", "Construyen la tubería solas, sin ayuda.", "Venden agua a los vecinos."],
    ["¿Qué comunica el silencio final de doña Felícita?", "Una emoción tan grande que no necesita palabras", "Que estaba enojada con el municipio y con los alcaldes anteriores", "Que no le importaba"]),
];

// --- Poesía ---------------------------------------------------------------------

const POETRY: ChoiceItem[] = [
  w4("¿Cómo se llama cada línea de un poema?", "Verso", "Estrofa", "Párrafo"),
  w4("¿Cómo se llama un grupo de versos separado por un espacio?", "Estrofa", "Verso", "Rima"),
  w4("«Canción / corazón»: ¿qué rima tienen estas palabras?", "Consonante", "Asonante", "No riman"),
  w4("«Montaña / ventana»: ¿qué rima tienen estas palabras?", "Asonante", "Consonante", "No riman"),
  w4("¿Cómo se llama el verso o grupo de versos que se repite a lo largo de un poema?", "Estribillo", "Encabalgamiento", "Estrofa libre"),
  w4("¿Cómo se llama el recurso por el que una idea continúa en el verso siguiente sin pausa?", "Encabalgamiento", "Estribillo", "Rima asonante"),
  w4("¿Cuántas sílabas métricas tiene un verso octosílabo?", "Ocho", "Once", "Seis"),
  w4("¿Cómo se llama el poema sin rima ni medida fija?", "Verso libre", "Soneto", "Romance heroico"),
  w4("¿Cuántos versos tiene un soneto?", "Catorce", "Diez", "Dieciséis"),
  w4("¿Cuántos versos tiene una décima, muy usada en el canto criollo?", "Diez", "Catorce", "Cuatro"),
];
function w4(p: string, a: string, ...d: string[]): ChoiceItem {
  return { p, a, d };
}

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
  ["figuras-1", (r) => choose(r, "", FIGURE_ITEMS)],
  ["figuras-2", (r) => choose(r, "", FIGURE_MEANING)],
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
