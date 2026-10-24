import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 1.° de Secundaria · banco de comprensión con lecturas propias, con temas e
// historias del Perú.


// --- Idea principal -------------------------------------------------------

const MAIN_PASSAGES = [
  read("Los andenes", "⛰️", "Quien recorre el valle del Colca ve laderas convertidas en escaleras gigantes. Son los andenes, terrazas de cultivo construidas hace más de mil años. No son solo un adorno del paisaje: cada muro de piedra guarda el calor del día y lo devuelve de noche, lo que protege las plantas de las heladas. Además, los canales que los recorren reparten el agua sin que la lluvia arrastre la tierra. Hoy, ingenieros de varios países los estudian como un modelo de agricultura adaptada a la montaña.",
    ["¿Cuál es la idea principal del texto?", "Los andenes son una técnica agrícola ingeniosa y todavía valiosa.", "El valle del Colca es uno de los lugares más visitados por turistas extranjeros.", "Los andenes son de piedra."],
    ["¿Qué detalle apoya mejor esa idea?", "Los muros devuelven de noche el calor del día.", "Los andenes parecen escaleras gigantes.", "Quien recorre el valle del Colca encuentra muchas laderas empinadas."],
    ["¿Para qué menciona el autor a los ingenieros de hoy?", "Para mostrar que la técnica sigue vigente", "Para criticar que se olviden las técnicas antiguas en las escuelas", "Para hablar de su país"]),
  read("El silencio de las abejas", "🐝", "En muchas chacras de Piura, los agricultores de mango notaron que sus árboles daban menos fruto. La causa no estaba en el suelo ni en el agua: faltaban abejas. Sin ellas, las flores no se polinizan. El uso intensivo de insecticidas había reducido las colmenas cercanas. Algunos productores empezaron a fumigar solo de noche, cuando las abejas no vuelan, y a sembrar flores silvestres en los bordes del campo. En dos temporadas, la cosecha volvió a crecer.",
    ["¿Cuál es la idea principal del texto?", "Proteger a las abejas ayudó a recuperar las cosechas de mango.", "Piura es la región que más mango exporta en todo el Perú y Sudamérica.", "Las abejas vuelan de día."],
    ["¿Qué causó la baja producción?", "La disminución de las abejas por los insecticidas", "La falta de agua en los meses de verano y la mala calidad de la tierra", "Las heladas"],
    ["¿Qué demuestra el final del texto?", "Que las medidas tomadas funcionaron", "Que los agricultores dejaron de sembrar mango para cultivar flores", "Que no hubo cambios"]),
  read("La lengua de los abuelos", "🗣️", "Durante décadas, muchas familias andinas dejaron de enseñar quechua a sus hijos. Creían que hablarlo traería discriminación. El resultado fue una generación que entiende a sus abuelos, pero no puede responderles. Hoy la tendencia empieza a cambiar: hay noticieros, canciones y hasta videojuegos en quechua, y jóvenes que lo aprenden con orgullo. Recuperar una lengua, sin embargo, exige algo más que entusiasmo: requiere que se hable en casa todos los días.",
    ["¿Cuál es la idea principal del texto?", "El quechua se está revalorando, aunque su futuro depende del uso diario.", "Los abuelos andinos prefieren que sus nietos aprendan inglés antes que quechua.", "El quechua es antiguo."],
    ["¿Por qué muchas familias dejaron de enseñarlo?", "Por temor a la discriminación", "Porque les parecía una lengua difícil de escribir y de pronunciar", "Porque no lo sabían"],
    ["¿Qué función cumple la última oración?", "Matiza el optimismo con una condición.", "Repite la información sobre los videojuegos con otras palabras.", "Cambia de tema."]),
];

const MULTI_MAIN = [
  read("El guano de las islas", "🐦", "Las islas frente a la costa peruana están cubiertas de guano, el excremento acumulado de aves marinas como el guanay y el piquero. En el siglo XIX, este abono fue tan codiciado en Europa que su venta llegó a sostener casi toda la economía del Estado peruano. Aquella bonanza, sin embargo, se malgastó en deudas y gastos sin planificación. Hoy el guano vuelve a valorarse por otra razón: es un fertilizante natural para la agricultura orgánica, y su extracción se controla para no perturbar a las aves.",
    ["¿Qué dos ideas principales desarrolla el texto?", "El guano enriqueció al Perú y se desperdició; hoy se valora como abono ecológico.", "Las aves marinas viven en las islas y el piquero es más grande que el guanay.", "El guano huele mal y nadie lo usa."],
    ["¿Qué detalle apoya la idea de que la riqueza se desperdició?", "Se malgastó en deudas y gastos sin planificación.", "Fue muy codiciado en Europa.", "Es el excremento acumulado de aves marinas como el guanay y el piquero."],
    ["¿Qué une a las dos ideas principales?", "El valor del guano en dos épocas distintas", "La vida de las aves en el mar", "La historia de los barcos que llevaban el guano hasta los puertos europeos"]),
  read("Dormir en la adolescencia", "😴", "Durante la adolescencia, el reloj interno del cuerpo se desplaza: el cerebro libera melatonina, la hormona del sueño, más tarde que en la infancia. Por eso a muchos jóvenes les cuesta dormirse antes de la medianoche. El problema es que el horario escolar no cambia, y miles de estudiantes llegan a clase con dos o tres horas de sueño de menos. Esa falta se nota en la memoria, el humor y la concentración. Algunos colegios que retrasaron media hora la entrada vieron mejoras en las notas y en la puntualidad.",
    ["¿Qué dos ideas principales presenta el texto?", "El sueño adolescente se retrasa por causas biológicas, y la falta de sueño afecta el rendimiento.", "La melatonina se vende en farmacias y ayuda a dormir a los niños pequeños.", "Los adolescentes son perezosos."],
    ["¿Qué ejemplo muestra una posible solución?", "Colegios que retrasaron la hora de entrada", "Jóvenes que se duermen después de la medianoche", "La hormona que el cerebro libera en la noche"],
    ["¿Qué palabra conecta la primera idea con la segunda?", "«El problema es que»", "«Por eso»", "«Durante la adolescencia, el reloj interno»"]),
];

const TWO = "¿Qué idea se obtiene al combinar los dos textos?";
const TWO_MAIN: ChoiceItem[] = [
  pt(TWO, "Texto 1: El Niño costero de 2017 provocó huaicos que destruyeron puentes y viviendas en el norte.\nTexto 2: Muchas de esas casas se habían levantado en el cauce seco de quebradas.", "Construir en zonas de riesgo agravó los daños de los desastres naturales.", "Los puentes del norte del Perú son los más modernos de toda la región y resisten cualquier huaico.", "Los huaicos son inevitables."),
  pt(TWO, "Texto 1: La anemia afecta a cerca de cuatro de cada diez niños pequeños en el Perú.\nTexto 2: La sangrecita y las menestras son alimentos baratos y ricos en hierro.", "Una alimentación accesible puede ayudar a combatir la anemia infantil.", "Las menestras son difíciles de conseguir y muy caras en los mercados de todas las ciudades del país.", "La anemia no tiene cura."),
  pt(TWO, "Texto 1: Machu Picchu recibe más visitantes de los que puede soportar sin dañarse.\nTexto 2: Desde que se fijaron horarios y circuitos, la erosión de los senderos disminuyó.", "Regular las visitas ayuda a proteger el patrimonio.", "Machu Picchu debería cerrarse por completo al público para siempre.", "Los senderos son de tierra."),
  pt(TWO, "Texto 1: Los teléfonos celulares contienen metales como el oro y el cobre.\nTexto 2: En el Perú se desechan miles de toneladas de aparatos electrónicos cada año.", "Reciclar aparatos electrónicos permitiría recuperar materiales valiosos.", "Los teléfonos celulares están hechos solo de plástico y de vidrio, sin ningún tipo de metal en su interior.", "El oro brilla."),
  pt(TWO, "Texto 1: La papa nativa resiste heladas que matan a las variedades comerciales.\nTexto 2: El cambio climático hará más frecuentes los cambios bruscos de temperatura.", "Las papas nativas pueden ser clave frente al cambio climático.", "Las variedades comerciales de papa resisten mucho mejor el frío y las heladas que todas las papas nativas.", "La papa es un tubérculo."),
  pt(TWO, "Texto 1: Chabuca Granda compuso valses que retratan la Lima antigua.\nTexto 2: Sus canciones se cantan hoy en escuelas, peñas y concursos de todo el país.", "La obra de Chabuca Granda sigue viva como parte de la identidad peruana.", "Chabuca Granda solo compuso música para películas extranjeras.", "El vals se baila."),
];

// --- Tema -----------------------------------------------------------------

const QUOTE_THEMES = pool([
  ["«Aprendió a leer a los sesenta años y lloró con la primera carta de su nieto».", "Nunca es tarde para aprender"], ["«Todos callaron, pero ella levantó la mano y contó lo que había visto».", "El valor de decir la verdad"],
  ["«Tenía la casa más grande del pueblo y nadie que se sentara a su mesa».", "La soledad del egoísta"], ["«Perdió la carrera, pero volvió por el compañero que se había caído».", "La solidaridad"],
  ["«El río no se detiene ante la piedra: la rodea y sigue».", "La perseverancia"], ["«Se burlaban de su acento hasta que la oyeron cantar».", "El respeto por la diferencia"],
  ["«Le dieron la razón por miedo, no porque la tuviera».", "El abuso de poder"], ["«Volvió a la chacra de su padre con un título bajo el brazo y las manos dispuestas».", "El vínculo con las raíces"],
  ["«Mientras discutían quién había empezado, el fuego alcanzó el techo».", "El costo del orgullo"], ["«Plantó un árbol cuya sombra nunca iba a disfrutar».", "Pensar en las generaciones futuras"],
]);

const THEMES = [
  read("El concurso", "🏆", "Para el concurso de oratoria, Mateo copió de internet un discurso brillante. Lo ensayó tanto que lo dijo sin un error. Ganó. Esa tarde, la profesora lo felicitó y le pidió que, para la final regional, preparara uno sobre su propio barrio. Mateo pasó la noche frente a la hoja en blanco. Se dio cuenta de que no sabía qué pensaba de nada. En la final quedó último, con un discurso torpe y sincero. Fue la primera vez que el aplauso le pareció suyo.",
    ["¿Cuál es el tema del cuento?", "El valor de expresar ideas propias, aunque sean imperfectas", "La importancia de ganar todos los concursos escolares a cualquier precio", "Los barrios son bonitos."],
    ["¿Qué revela la noche frente a la hoja en blanco?", "Que Mateo no había desarrollado su propia voz", "Que Mateo estaba cansado después del concurso y quería dormir", "Que la hoja era pequeña"],
    ["¿Por qué el aplauso final «le pareció suyo»?", "Porque esta vez lo había ganado con palabras propias", "Porque el público era más numeroso que en la primera ronda del concurso", "Porque ganó"]),
  read("La quena del abuelo", "🎵", "Cuando murió el abuelo, nadie quiso quedarse con su quena: estaba rajada y sonaba ronca. Lucía la guardó en una caja. Años después, ya en Lima, una noche de nostalgia la sacó y sopló. El sonido salió roto, desafinado, y sin embargo le trajo de golpe el olor de la cocina de leña, los cerros de Andahuaylas, la voz del abuelo diciendo «despacio, hija». Lucía no la mandó a arreglar. Entendió que lo que valía de esa quena era precisamente su voz quebrada.",
    ["¿Cuál es el tema del cuento?", "Los objetos guardan la memoria de quienes amamos.", "Los instrumentos musicales deben repararse para sonar bien en los conciertos.", "Lima es grande."],
    ["¿Por qué Lucía decide no arreglar la quena?", "Porque su sonido imperfecto es el que la une a su abuelo", "Porque no tenía dinero para pagar a un buen artesano de instrumentos", "Porque no sabía tocarla"],
    ["¿Qué recurso usa el autor para mostrar la nostalgia?", "Recuerdos sensoriales que vuelven de golpe", "Una lista de fechas", "Un diálogo extenso entre Lucía y sus vecinos de Lima"]),
];

const MULTI_THEMES = [
  read("El puente de Q'eswachaka", "🌉", "Cada junio, las comunidades de Quehue se reúnen a orillas del Apurímac para renovar el último puente inca de ichu trenzado. Ese año, Rubén, de catorce, quería ir al concurso de robótica en Cusco, que caía la misma semana. Su padre no le dijo que no: le dio una soga para que trenzara antes de irse. Rubén trenzó toda la tarde junto a ancianos que no conocía y que lo trataron como a un nieto. Partió al concurso con las manos ardiendo. Cuando presentó su robot, explicó que la idea de unir piezas pequeñas para hacer algo resistente la había aprendido trenzando.",
    ["¿Qué dos temas desarrolla el cuento?", "La tradición y la innovación pueden convivir; la comunidad nos forma.", "Los padres siempre prohíben a sus hijos participar en concursos fuera de casa.", "La robótica es difícil."],
    ["¿Qué hace el padre para conciliar los dos mundos de Rubén?", "Le pide participar en la tradición sin impedirle viajar.", "Le prohíbe ir al concurso de robótica de Cusco.", "Va con él al concurso y deja de lado la renovación del puente"],
    ["¿Qué simboliza el puente en el cuento?", "La unión entre el pasado y el futuro", "Una construcción peligrosa", "El camino más corto para llegar a la ciudad de Cusco"]),
  read("La vendedora de chicha", "🥤", "Doña Nieves vendía chicha morada en la puerta del colegio. Un día, la municipalidad prohibió los puestos ambulantes. Los alumnos de quinto juntaron firmas, pero nadie las recibió. Entonces hicieron algo distinto: averiguaron qué permisos existían y ayudaron a doña Nieves a tramitar uno para vender dentro del quiosco escolar. Tardaron tres meses. El día que volvió, la fila daba la vuelta al patio. Ella no habló de la municipalidad. Solo dijo: «Ahora sé leer un formulario».",
    ["¿Qué dos temas desarrolla el cuento?", "La perseverancia ante las reglas injustas y el poder del conocimiento", "Las municipalidades siempre tienen razón y los vecinos deben obedecer sin preguntar.", "La chicha es rica."],
    ["¿Qué cambio de estrategia hacen los alumnos?", "Pasan de protestar a buscar una salida legal.", "Pasan de ayudar a doña Nieves a criticarla en redes sociales.", "No cambian."],
    ["¿Qué sugiere la frase final de doña Nieves?", "Que ganó algo más valioso que el puesto", "Que no le gustan los trámites ni los formularios municipales", "Que no sabe leer"]),
];

// --- Propósito y punto de vista -------------------------------------------

const PURPOSE = sorter(["Informar", "Persuadir", "Entretener", "Explicar cómo se hace algo"], "¿Cuál es el propósito principal del autor?");
const AUTHOR_PURPOSE: ChoiceItem[] = [
  ...["Una nota del diario sobre el hallazgo de una tumba moche en Lambayeque.", "Una infografía con las cifras del último censo nacional.", "Una entrada de enciclopedia sobre la cordillera Blanca."].map((x) => PURPOSE(x, 0)),
  ...["Una columna que pide a los vecinos votar por más áreas verdes.", "Un afiche que convoca a donar sangre «porque una bolsa salva tres vidas».", "Una carta al director que exige reabrir la biblioteca municipal."].map((x) => PURPOSE(x, 1)),
  ...["Un cuento sobre un pishtaco que tiene miedo de la oscuridad.", "Una historieta sobre un cuy que quiere ser chef.", "Una crónica humorística sobre el primer día en una combi limeña."].map((x) => PURPOSE(x, 2)),
  ...["Una receta para preparar ají de gallina.", "Un manual para armar un huerto en macetas.", "Las instrucciones para inscribirse en un concurso nacional de ciencia."].map((x) => PURPOSE(x, 3)),
];

const POV = "¿Cuál es el punto de vista del autor?";
const AUTHOR_POV: ChoiceItem[] = [
  pt(POV, "«Llamar “comida rápida” a una hamburguesa es un elogio inmerecido: lo rápido es solo el daño que le hace al cuerpo».", "Critica la comida rápida.", "Recomienda comer hamburguesas por su sabor y comodidad.", "No opina."),
  pt(POV, "«Se dice que los jóvenes no leen. Leen todo el día: mensajes, foros, subtítulos. Lo que falta es enseñarles a leer con calma».", "Cree que los jóvenes leen, pero sin profundidad.", "Afirma que los jóvenes de hoy ya no leen absolutamente nada.", "Elogia los foros."),
  pt(POV, "«El fútbol femenino no necesita favores: necesita estadios, horarios en televisión y el mismo respeto».", "Pide igualdad de condiciones para el fútbol femenino.", "Considera que el fútbol femenino no tiene público ni futuro.", "Prefiere el vóley."),
  pt(POV, "«Las islas Ballestas no son un zoológico flotante. Cada lancha que se acerca demasiado espanta a aves que ya están en peligro».", "Pide más respeto por la fauna en el turismo.", "Promueve que las lanchas se acerquen más a las aves para tomar fotos.", "Describe las islas."),
  pt(POV, "«Aprender inglés es útil, nadie lo duda. Pero un país que no enseña sus lenguas originarias está renunciando a una parte de sí mismo».", "Defiende la enseñanza de las lenguas originarias.", "Sostiene que solo debería enseñarse inglés en las escuelas del país.", "Rechaza los idiomas."),
  pt(POV, "«Las cámaras en las calles nos hacen sentir seguros. Conviene preguntarse, también, quién mira las imágenes y para qué».", "Pide reflexionar sobre la vigilancia.", "Exige instalar más cámaras en todas las calles sin hacer preguntas.", "Le gustan las cámaras."),
];

// --- Tono -----------------------------------------------------------------

const FORMAL = "¿Qué oración es más formal?";
const FORMALITY: ChoiceItem[] = [
  w(FORMAL, "Me dirijo a usted para solicitar una constancia de estudios.", "Le escribo porque necesito que me den una constancia, ¿ya?", "Mándame la constancia."), w(FORMAL, "Lamentamos los inconvenientes ocasionados.", "Perdón por el roche, fue sin querer, de verdad.", "Sorry."),
  w(FORMAL, "La propuesta carece de fundamento suficiente.", "Esa idea está floja, no tiene por dónde agarrarla.", "No va."), w(FORMAL, "Se ruega guardar silencio durante la ceremonia.", "Por favor, no hablen mientras dure la actuación, chicos.", "¡Silencio!"),
  w(FORMAL, "Quedo atento a su respuesta.", "Ahí me avisas qué te parece cuando puedas, ¿sí?", "Avísame."), w(FORMAL, "El jurado deliberará antes de emitir su fallo.", "Los jueces van a conversar un rato y luego dicen quién ganó.", "Ya verán."),
  w(FORMAL, "Se recomienda a los usuarios mantener la distancia.", "Oye, no te pegues tanto a la gente en la cola.", "Aléjate."), w(FORMAL, "Los fondos recaudados se destinarán a la biblioteca.", "La plata que juntamos va a ir para la biblio, ojo.", "Es para libros."),
];
const TONE = "¿Qué tono tiene cada texto?";
const TONE_COMPARE: ChoiceItem[] = [
  pt(TONE, "Texto A: «¡Ganamos la final! Todavía me tiemblan las piernas».\nTexto B: «El equipo ganó por dos goles. El partido se jugó a las cuatro».", "A es eufórico; B es neutro.", "A es neutro; B es eufórico y emocionado.", "Los dos son tristes."),
  pt(TONE, "Texto A: «Gracias por el “regalo”: siempre soñé con un despertador que suene a las cuatro».\nTexto B: «Gracias por el regalo; lo usaré todos los días».", "A es irónico; B es sincero.", "A es sincero; B es irónico y burlón.", "Los dos son irónicos."),
  pt(TONE, "Texto A: «La casa de mi infancia ya no existe. En su lugar hay un estacionamiento».\nTexto B: «¡Por fin demolieron esa casa vieja! Ya era hora».", "A es melancólico; B es de alivio.", "A es de alivio; B es melancólico y triste.", "Los dos son neutros."),
  pt(TONE, "Texto A: «Exigimos respuestas. Tres meses sin agua es inaceptable».\nTexto B: «Desde marzo, el barrio recibe agua tres horas por semana».", "A es indignado; B es informativo.", "A es informativo; B es indignado y exigente.", "Los dos son alegres."),
  pt(TONE, "Texto A: «No te preocupes: equivocarse es parte de aprender».\nTexto B: «Otra vez lo mismo. ¿Cuándo vas a aprender?».", "A es comprensivo; B es reprobatorio.", "A es reprobatorio; B es comprensivo y paciente.", "Los dos son comprensivos."),
  pt(TONE, "Texto A: «Nadie sabe qué hay en el fondo de la laguna. Los pescadores no se acercan de noche».\nTexto B: «La laguna tiene 40 metros de profundidad y aguas frías».", "A es misterioso; B es objetivo.", "A es objetivo; B es misterioso y sombrío.", "Los dos son humorísticos."),
];

// --- Estructura del texto -------------------------------------------------

const COMPARE = [
  read("Costa y selva", "🌴", "La costa y la selva peruanas ocupan regiones muy distintas, pero ambas dependen de los Andes: de sus cumbres bajan los ríos que riegan los valles costeños y forman el Amazonas. Ahí terminan las semejanzas. La costa es un desierto donde casi nunca llueve y la vida se concentra junto a los ríos. La selva, en cambio, recibe lluvias casi todo el año y alberga la mayor diversidad de especies del país. Mientras en la costa vive más de la mitad de la población, la selva, que ocupa más territorio, es la región menos poblada.",
    ["¿Qué tienen en común la costa y la selva?", "Sus ríos nacen en los Andes.", "Ambas reciben abundantes lluvias durante todo el año.", "Son pequeñas."],
    ["¿En qué contrastan respecto de la población?", "La costa tiene más habitantes, aunque la selva es más extensa.", "La selva tiene más habitantes, aunque la costa es más extensa.", "Tienen la misma población."],
    ["¿Qué expresión anuncia el paso de las semejanzas a las diferencias?", "«Ahí terminan las semejanzas»", "«Pero ambas dependen»", "«La costa es un desierto donde casi nunca llueve»"]),
  read("Huaca y museo", "🏛️", "Visitar una huaca y visitar un museo son experiencias que se complementan. En los dos casos uno se acerca al pasado a través de objetos reales. En la huaca, sin embargo, el visitante camina por el lugar mismo donde se celebraron ceremonias hace siglos, y entiende el tamaño, la luz y el paisaje. En el museo, por su parte, las piezas están fuera de su contexto, pero se pueden ver de cerca, con explicaciones y en buen estado de conservación.",
    ["¿Qué semejanza señala el texto?", "Ambos permiten conocer el pasado mediante objetos reales.", "Ambos muestran las piezas en su lugar original y sin explicaciones.", "Ambos son modernos."],
    ["¿Qué ventaja propia tiene el museo?", "Permite ver las piezas de cerca y bien explicadas.", "Permite entender el paisaje y la luz del lugar original.", "Es gratis."],
    ["¿Qué conclusión plantea el autor?", "Las dos visitas se complementan.", "Es mejor visitar solo museos porque las huacas no tienen explicaciones.", "Las huacas son aburridas."]),
];
const CAUSE_INFO: ChoiceItem[] = [
  pt("¿Cuál es el efecto?", "Como el lago Titicaca recibe menos agua de los glaciares, su nivel ha bajado en varias temporadas secas.", "El nivel del lago ha bajado.", "Los glaciares aportan menos agua.", "Hay temporadas."),
  pt("¿Cuál es la causa?", "La anchoveta se alejó de la costa durante el fenómeno El Niño, ya que el mar se calentó.", "El calentamiento del mar", "El alejamiento de la anchoveta", "La extensión de la costa"),
  pt("¿Cuál es el efecto?", "La construcción de la carretera Interoceánica acercó los mercados; por consiguiente, aumentó el comercio en Madre de Dios.", "Aumentó el comercio en Madre de Dios.", "Se construyó la carretera Interoceánica.", "Hay mercados."),
  pt("¿Cuál es la causa?", "Se suspendieron las clases presenciales en 2020 debido a la pandemia.", "La pandemia", "La suspensión de las clases", "El año 2020"),
  pt("¿Cuál es el efecto?", "El terremoto de 2007 dañó gran parte de las viviendas de adobe de Pisco, por lo que muchas familias quedaron sin techo.", "Muchas familias quedaron sin techo.", "Hubo un terremoto en 2007.", "Las casas eran de adobe."),
  pt("¿Cuál es la causa?", "Gracias a las vacunas, la poliomielitis dejó de registrarse en el Perú desde 1991.", "Las vacunas", "La desaparición de la poliomielitis", "El año 1991"),
  pt("¿Qué expresión señala el efecto?", "Las lluvias fueron escasas; de ahí que el precio del arroz subiera.", "«de ahí que»", "«las lluvias»", "«fueron escasas»"),
  pt("¿Qué expresión señala la causa?", "Puesto que el puente estaba en reparación, los buses tomaron otra ruta.", "«Puesto que»", "«tomaron otra ruta»", "«los buses»"),
];
const PROBLEM_SOLUTION = pool([
  ["Los pescadores artesanales capturan peces demasiado pequeños.", "Usar redes con mallas más grandes."], ["Los estudiantes de zonas rurales no tienen internet.", "Distribuir clases por radio."], ["El mercado bota toneladas de fruta madura.", "Donarla a comedores populares."],
  ["Los niños de la comunidad no saben nadar y viven junto al río.", "Organizar clases de natación gratuitas."], ["Los turistas dejan basura en el camino inca.", "Exigir que bajen con sus residuos."], ["Las calles del barrio están oscuras de noche.", "Instalar postes con luz led."],
  ["Las alpacas mueren por el frío extremo.", "Construir cobertizos y almacenar forraje."], ["Los jóvenes no conocen la historia de su distrito.", "Crear un museo comunitario."],
]);
const STRUCT = sorter(["Secuencia cronológica", "Comparación y contraste", "Causa y efecto", "Problema y solución", "Descripción"], "¿Qué estructura tiene el texto?");
const STRUCTURES: ChoiceItem[] = [
  ...["En 1821 se proclamó la independencia. Tres años después, la batalla de Ayacucho la consolidó. En 1854 se abolió la esclavitud.", "Primero se lava la lana de alpaca; luego se hila; finalmente se tiñe con plantas."].map((x) => STRUCT(x, 0)),
  ...["El cóndor planea sin batir las alas; el colibrí, en cambio, las agita ochenta veces por segundo.", "La marinera norteña y la limeña comparten el pañuelo, aunque difieren en el ritmo y el vestuario."].map((x) => STRUCT(x, 1)),
  ...["El sobrepastoreo dejó el suelo sin vegetación; en consecuencia, el viento se llevó la tierra fértil.", "Al subir el precio del pasaje, menos estudiantes pudieron viajar a la ciudad."].map((x) => STRUCT(x, 2)),
  ...["El agua de la quebrada llegaba turbia. Los vecinos construyeron un filtro de arena y grava.", "Faltaban libros en el aula. Los padres organizaron un trueque de libros usados."].map((x) => STRUCT(x, 3)),
  ...["La vicuña es esbelta, de cuello largo y pelaje color canela, muy fino y suave.", "El retablo ayacuchano es una caja de madera con puertas pintadas y figuras de pasta en su interior."].map((x) => STRUCT(x, 4)),
];

// --- Recursos literarios --------------------------------------------------

const SENSORY: ChoiceItem[] = [
  pt("¿Qué palabras del texto son detalles sensoriales?", "El mercado olía a culantro y a pescado fresco; los vendedores gritaban precios.", "«olía a culantro» y «gritaban»", "«el mercado» y «los vendedores»", "«precios» y «fresco»"),
  pt("¿Qué palabras del texto son detalles sensoriales?", "La picarona, crujiente y bañada en miel, me quemó la punta de los dedos.", "«crujiente», «bañada en miel» y «me quemó»", "«la picarona» y «la punta»", "«los dedos»"),
  pt("¿A qué sentidos apela el texto?", "El viento de la puna silbaba entre las piedras y nos cortaba las mejillas.", "Oído y tacto", "Vista y olfato solamente", "Gusto"),
  pt("¿A qué sentidos apela el texto?", "Los fuegos artificiales pintaron el cielo de verde y el humo olía a pólvora.", "Vista y olfato", "Oído y gusto solamente", "Tacto"),
  pt("¿Qué detalle sensorial crea tensión?", "La sala quedó a oscuras. Solo se oía el goteo del caño y una respiración que no era la mía.", "Una respiración ajena en la oscuridad", "La sala de la casa en la que estaba", "El caño"),
  pt("¿Qué detalle sensorial transmite alegría?", "La banda entró a la plaza tocando un huaino, y el olor a chicharrón llenó la calle.", "La música del huaino y el olor a chicharrón", "La palabra «entró» al inicio del texto", "La plaza"),
  pt("¿Qué oración añade un detalle sensorial?", "Llegamos a la playa.", "La arena ardía y el mar olía a sal y a algas.", "La playa queda a una hora de la ciudad en auto.", "Era verano."),
  pt("¿Qué oración añade un detalle sensorial?", "La abuela preparó el desayuno.", "El pan recién salido del horno crujía al partirlo.", "La abuela se levanta todos los días a las cinco.", "Desayunamos."),
];
const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa la alusión a Ícaro?", "Fuente: Ícaro voló con alas de cera; se acercó tanto al sol que la cera se derritió y cayó al mar.\nOración: «Quiso abarcar diez proyectos a la vez, como Ícaro».", "Fue demasiado ambicioso y fracasó.", "Fue prudente y avanzó paso a paso hasta lograrlo.", "Sabía volar."),
  pt("¿Qué significa «talón de Aquiles»?", "Fuente: Aquiles era invulnerable en todo el cuerpo menos en el talón, por donde lo hirió una flecha.\nOración: «La ortografía es su talón de Aquiles».", "Su punto débil", "Su mayor fortaleza, de la que todos hablan", "Una herida"),
  pt("¿Qué significa la alusión a Manco Cápac?", "Fuente: Según la leyenda, Manco Cápac salió del lago Titicaca y fundó el Cusco, donde se hundió su vara de oro.\nOración: «Mi tío es el Manco Cápac de la familia: fue el primero en llegar a Lima».", "Es el fundador de algo, el que abrió el camino.", "Es el más joven de todos y el último en llegar.", "Es rico."),
  pt("¿Qué significa «trabajo de Hércules»?", "Fuente: Hércules debió cumplir doce tareas casi imposibles, como limpiar en un día los establos del rey Augías.\nOración: «Limpiar el aula después de la kermés fue un trabajo de Hércules».", "Una tarea enorme y agotadora", "Una tarea sencilla que se hace en pocos minutos", "Un juego"),
  pt("¿Qué significa la alusión a Pachacútec?", "Fuente: Pachacútec, cuyo nombre significa «el que transforma el mundo», reorganizó por completo el imperio inca.\nOración: «La nueva directora fue un Pachacútec: cambió todo el colegio».", "Transformó profundamente la institución.", "Mantuvo todo igual, sin tocar nada de lo anterior.", "Era inca."),
  pt("¿Qué significa «el canto de las sirenas»?", "Fuente: Las sirenas atraían a los marineros con su canto hasta hacerlos naufragar; Ulises se ató al mástil para resistir.\nOración: «Las ofertas del Cyber Day son el canto de las sirenas».", "Una tentación peligrosa", "Una advertencia útil que conviene escuchar siempre", "Música bonita"),
  pt("¿Qué significa la alusión a David y Goliat?", "Fuente: El pequeño David venció al gigante Goliat con una honda y una piedra.\nOración: «El partido del colegio rural contra el campeón nacional fue un David contra Goliat».", "Un enfrentamiento entre alguien débil y alguien muy poderoso", "Un partido entre dos equipos exactamente iguales en fuerza", "Una pelea"),
  pt("¿Qué significa «tejer como Penélope»?", "Fuente: Penélope tejía de día un manto y lo destejía de noche, para retrasar la boda que le imponían.\nOración: «El Congreso aprueba y deroga la ley; teje como Penélope».", "Hacer y deshacer sin avanzar", "Trabajar con rapidez para terminar antes de tiempo", "Tejer bien"),
];
const RECALL = "¿De dónde viene la alusión?";
const ALLUSION_SOURCE: ChoiceItem[] = [
  pt(RECALL, "«Para él, cada examen es una odisea».", "Del viaje de Ulises en la «Odisea» de Homero", "De la leyenda de Manco Cápac y Mama Ocllo", "De la Biblia"),
  pt(RECALL, "«Fue un caballo de Troya: parecía un regalo, pero era una trampa».", "De la guerra de Troya, en la mitología griega", "Del cuento «El caballero Carmelo»", "De una fábula de Esopo"),
  pt(RECALL, "«Es un quijote: lucha por causas que todos dan por perdidas».", "De la novela «Don Quijote de la Mancha»", "Del mito de Prometeo, que robó el fuego", "De una leyenda andina"),
  pt(RECALL, "«Se volvió un ollantay: desafió al poder por amor».", "Del drama quechua «Ollantay»", "De la novela «Don Quijote de la Mancha»", "De la Biblia"),
  pt(RECALL, "«Esa tienda vende manzanas de la discordia: todos pelean por la última oferta».", "Del mito griego del juicio de Paris", "De la leyenda de Naylamp en Lambayeque", "De una tradición de Palma"),
  pt(RECALL, "«Es un ave fénix: siempre se levanta después de perderlo todo».", "Del ave mitológica que renace de sus cenizas", "Del cóndor de los mitos andinos, que es mensajero", "De un cuento de Quiroga"),
  pt(RECALL, "«Tiene la paciencia de Job».", "Del personaje bíblico que soportó todas las desgracias", "De una fábula sobre una tortuga y una liebre", "De la mitología inca"),
  pt(RECALL, "«Abrió los ojos como Lázaro y volvió al trabajo».", "Del relato bíblico de la resurrección de Lázaro", "Del mito de Orfeo, que bajó al mundo de los muertos", "De un cuento peruano"),
];
const MEAN = "¿Qué significa la figura?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "«Su mirada era un cuchillo».", "Miraba con dureza y hostilidad.", "Tenía los ojos brillantes y llenos de alegría.", "Usaba lentes."),
  pt(MEAN, "«Lima es una ciudad que nunca duerme».", "Siempre hay actividad en ella.", "Sus habitantes sufren de insomnio todas las noches.", "Es grande."),
  pt(MEAN, "«Las palabras se le atragantaron».", "No pudo hablar por la emoción.", "Se comió una carta sin darse cuenta.", "Habló mucho."),
  pt(MEAN, "«El estadio fue un volcán».", "La multitud estaba muy exaltada.", "El estadio se construyó sobre un cerro de lava.", "Hacía calor."),
  pt(MEAN, "«Tiene un corazón de piedra».", "Es insensible.", "Tiene buena salud y un corazón muy fuerte.", "Es pesado."),
  pt(MEAN, "«Me lo dijo mil veces».", "Me lo repitió muchísimas veces.", "Me lo dijo exactamente mil veces, ni una más.", "Me lo dijo una vez."),
  pt(MEAN, "«La ciudad se vistió de luces».", "Se iluminó con muchas luces.", "Los vecinos compraron ropa nueva para la fiesta.", "Se apagó."),
  pt(MEAN, "«Es un mar de dudas».", "Tiene muchísimas dudas.", "Le gusta mucho nadar en el mar cuando hace calor.", "Lo sabe todo."),
];
const FIG = sorter(["Símil", "Metáfora", "Personificación", "Hipérbole", "Onomatopeya"], "¿Qué figura literaria se usa?");
const FIGURE_CLASSIFY: ChoiceItem[] = [
  ...["Sus ojos eran como dos luceros.", "Corría como alma que lleva el diablo.", "Era terco como una mula."].map((x) => FIG(x, 0)),
  ...["Tus manos son palomas inquietas.", "La vida es un río que va al mar.", "Ese chico es un roble."].map((x) => FIG(x, 1)),
  ...["El viento susurraba secretos al maizal.", "La luna espiaba por la ventana.", "El reloj nos miraba impaciente."].map((x) => FIG(x, 2)),
  ...["Te llamé un millón de veces.", "Tengo tanta hambre que me comería una vaca.", "Esperé una eternidad en la cola."].map((x) => FIG(x, 3)),
  ...["El tic tac del reloj no me dejaba dormir.", "¡Pum! La puerta se cerró de golpe.", "Se oía el glu glu del agua en la botella."].map((x) => FIG(x, 4)),
];
const EFFECT = "¿Qué efecto tiene la figura en el texto?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«La ciudad, bestia de cemento, se tragaba a los recién llegados».", "Presenta la ciudad como un lugar hostil y amenazante.", "Muestra la ciudad como un lugar acogedor y lleno de oportunidades.", "Describe el cemento."),
  pt(EFFECT, "«El viejo árbol abría sus brazos para dar sombra a los niños».", "Transmite ternura y protección.", "Crea una sensación de peligro y de miedo ante el árbol.", "Explica la fotosíntesis."),
  pt(EFFECT, "«Esperé siglos a que contestara el mensaje».", "Exagera para mostrar la impaciencia del narrador.", "Indica que el narrador esperó literalmente varios siglos.", "Informa la hora."),
  pt(EFFECT, "«Su risa era una cascada que contagiaba a todos».", "Sugiere una alegría abundante y expansiva.", "Indica que su risa era molesta y ruidosa para todos.", "Habla del agua."),
  pt(EFFECT, "«El silencio pesaba como una losa sobre la mesa».", "Crea un ambiente tenso e incómodo.", "Hace que la escena parezca divertida y relajada.", "Describe la mesa."),
  pt(EFFECT, "«El mar, celoso, devolvía cada barco a la orilla».", "Da al mar una voluntad propia, casi caprichosa.", "Explica con datos científicos cómo funcionan las mareas.", "Habla de barcos."),
];

// --- Analizar literatura --------------------------------------------------

const NARR = sorter(["Primera persona", "Tercera persona omnisciente", "Tercera persona limitada"], "¿Qué punto de vista tiene el narrador?");
const NARRATOR: ChoiceItem[] = [
  ...["Subí al bus temblando. No sabía si mi tío vendría a buscarme a la estación.", "Nunca le conté a nadie lo que vi esa noche en la huaca.", "Mi abuela decía que el cerro tenía dueño. Yo no le creía."].map((x) => NARR(x, 0)),
  ...["Ana sonreía, pero por dentro temía perder la beca. Su padre, en la cocina, pensaba lo mismo y callaba.", "Los vecinos creían que el viejo era rico. El viejo, en cambio, contaba cada noche sus últimas monedas.", "Rosa estaba segura de haber ganado; el jurado, sin embargo, ya había elegido a otro."].map((x) => NARR(x, 1)),
  ...["Pedro miró el reloj. No entendía por qué su hermana tardaba tanto.", "Sofía escuchó un ruido en el patio. Se preguntó si sería el gato o algo peor.", "Luis leyó la carta dos veces. No podía imaginar quién la habría escrito."].map((x) => NARR(x, 2)),
];
const INFER_LIT = [
  read("La foto", "📷", "Martina encontró una foto vieja dentro del libro de su madre: dos niñas abrazadas frente a una escuela de adobe. Una era su madre. La otra tenía la cara tachada con lapicero. Esa noche, en la cena, Martina dejó la foto sobre la mesa. Su madre la miró, dejó de comer y se fue a la cocina. Volvió con los ojos rojos y dijo, como si nada: «¿Quién quiere más arroz?».",
    ["¿Qué se puede inferir sobre la niña tachada?", "Tuvo un conflicto doloroso con la madre de Martina.", "Era una prima lejana que vivía en otro país y nunca la visitó.", "Era la profesora."],
    ["¿Qué revela la reacción de la madre?", "Que el recuerdo todavía le duele", "Que estaba molesta porque Martina había revisado su libro", "Que no reconoció la foto"],
    ["¿Por qué la madre pregunta «¿Quién quiere más arroz?»?", "Para evitar hablar del tema", "Porque todavía tenía mucha hambre", "Porque se acabó el arroz"]),
  read("El examen", "📝", "Joaquín entregó el examen antes que todos. El profesor lo miró por encima de los lentes y hojeó las páginas. Luego le dijo, en voz baja: «La próxima vez, escribe tú las respuestas». Joaquín enrojeció hasta las orejas. En el recreo, buscó a Ernesto, su compañero de carpeta, pero Ernesto ya se había ido al otro extremo del patio.",
    ["¿Qué se puede inferir de lo que dice el profesor?", "Sospecha que Joaquín copió.", "Cree que Joaquín escribe con mala letra y debe practicar.", "Lo felicita por terminar primero."],
    ["¿Por qué Ernesto se aleja en el recreo?", "Probablemente se siente involucrado o molesto por lo ocurrido.", "Porque tenía que comprar algo en el quiosco antes de que cerraran.", "Porque no conoce a Joaquín."],
    ["¿Qué muestra que Joaquín se sintió descubierto?", "Que enrojeció hasta las orejas", "Que entregó el examen antes que todos sus compañeros", "Que hojeó las páginas"]),
];
const SHORT_STORIES = [
  read("El último vagón", "🚂", "El tren de Huancayo partía a las siete. Inés llegó a las siete y un minuto, con la maleta abierta y la ropa saliéndose. Vio el último vagón alejarse y se sentó en el andén. Un anciano que vendía caramelos se sentó a su lado. «Yo perdí ese tren en 1975», le dijo. «Me quedé. Me casé aquí. Tuve cinco hijos». Inés lo miró. «¿Y se arrepiente?». El anciano sonrió y le ofreció un caramelo. Inés cerró la maleta despacio, como quien empieza a pensar.",
    ["¿Cuál es el conflicto principal?", "Inés pierde el tren y debe decidir qué hacer.", "Inés discute con el anciano por el precio de los caramelos que vende.", "Inés no tiene maleta."],
    ["¿Qué sugiere la sonrisa del anciano?", "Que no se arrepiente de haberse quedado", "Que se burla de Inés por haber llegado tarde a la estación", "Que no escuchó la pregunta"],
    ["¿Qué indica el gesto final de Inés?", "Que empieza a considerar otras posibilidades", "Que decide volver a su casa sin pensar más en el asunto", "Que se enoja"]),
  read("La cometa", "🪁", "Todos los años, en agosto, Diego y su padre hacían una cometa con carrizo y papel de colores. Ese agosto el padre estaba en el hospital. Diego la hizo solo; le quedó torcida y pesada. La llevó al cerro de todos modos. No subía. Corrió, tropezó, volvió a correr. Cuando por fin se elevó, Diego la apuntó hacia la ventana del hospital, allá abajo, aunque sabía que desde ahí nadie podía verla.",
    ["¿Qué motiva a Diego a hacer la cometa solo?", "El deseo de mantener la tradición con su padre", "Las ganas de ganar un concurso de cometas en el cerro", "Que el papel estaba barato"],
    ["¿Qué muestra su insistencia al correr y tropezar?", "Su determinación", "Su torpeza y su falta de interés por las cometas", "Que estaba cansado"],
    ["¿Qué significado tiene apuntar la cometa al hospital?", "Es un gesto simbólico de cercanía con su padre.", "Quiere que los médicos vean lo bien que vuela su cometa.", "Se equivocó de dirección."]),
];

// --- Analizar poesía ------------------------------------------------------

const RHYME = "¿Cuál es el esquema de rima de la estrofa?";
const RHYME_SCHEMES: ChoiceItem[] = [
  pt(RHYME, "Bajo el cielo de la sierra\nla quena canta su pena,\ny el eco cubre la tierra\ncon su música serena.", "ABAB", "AABB", "ABBA"),
  pt(RHYME, "La garúa cae despacio,\nmoja el mar y su palacio;\nlas gaviotas en la orilla\nbuscan la última semilla.", "AABB", "ABAB", "ABBA"),
  pt(RHYME, "Mi pueblo tiene un camino\nque se pierde entre los cerros;\nlo cuidan los viejos perros\ny el viento del altiplano.", "ABBC", "ABAB", "AABB"),
  pt(RHYME, "Canta el río en la quebrada,\nbaja el agua del nevado,\nse despierta el sembrado,\nsonríe la madrugada.", "ABBA", "ABAB", "AABB"),
  pt(RHYME, "Volaba la mariposa\nsobre el campo de maíz;\nera de color de rosa,\ncomo el cielo de París.", "ABAB", "ABBA", "AABB"),
  pt(RHYME, "Llegó la noche al puerto,\nse durmieron los botes,\ny un pescador despierto\ncontaba sus anzuelos.", "ABAC", "ABAB", "AABB"),
  pt(RHYME, "Sale el sol en el mercado,\nhuele a pan y a mandarina;\nla vecina en la esquina\nvende choclo recién asado.", "ABBA", "AABB", "ABAB"),
  pt(RHYME, "Tengo un perro que se llama Coco,\nque come mucho y duerme otro poco;\nladra a la luna cuando está llena,\nluego se duerme sin ninguna pena.", "AABB", "ABAB", "ABBA"),
];

// --- Analizar argumentos --------------------------------------------------

const ARGUMENTS = [
  read("Más parques, menos rejas", "🌳", "Muchos distritos de Lima han enrejado sus parques para «protegerlos». Sostengo que esa medida produce el efecto contrario. Primero, un parque cerrado es un parque vacío, y un espacio vacío es más inseguro, no menos. Segundo, las rejas excluyen a quienes viven en otros barrios y convierten un bien público en un club privado. Hay quien dirá que sin rejas los parques se deterioran. Pero el cuidado no depende de los candados, sino de que los vecinos sientan el parque como suyo. Abramos las puertas y organicemos la vigilancia comunitaria.",
    ["¿Cuál es la tesis del autor?", "Enrejar los parques es contraproducente.", "Los parques deben cerrarse por la noche para que nadie los ensucie.", "Lima tiene pocos parques."],
    ["¿Qué contraargumento menciona?", "Que sin rejas los parques se deterioran", "Que los vecinos no quieren los parques de su distrito", "Que las rejas son caras"],
    ["¿Cómo responde a ese contraargumento?", "Dice que el cuidado depende del compromiso vecinal.", "Acepta que tiene razón y propone poner más candados.", "No responde."]),
  read("El celular en el aula", "📱", "Prohibir los celulares en el colegio parece la solución más fácil contra las distracciones. No obstante, creo que es un error. Los celulares son herramientas para investigar, traducir o grabar experimentos; sacarlos del aula es negar a los alumnos la oportunidad de aprender a usarlos bien. Es cierto que pueden distraer, pero también distrae un cuaderno lleno de dibujos, y a nadie se le ocurre prohibir los cuadernos. Lo que hace falta son reglas claras: celular guardado, salvo cuando el docente lo indique.",
    ["¿Cuál es la postura del autor?", "Los celulares deben regularse, no prohibirse.", "Los celulares deben prohibirse en todos los colegios del país.", "Los cuadernos distraen."],
    ["¿Para qué menciona el ejemplo del cuaderno?", "Para mostrar que distraerse no depende solo del objeto", "Para proponer que también se prohíban los cuadernos en clase", "Para hablar de dibujo"],
    ["¿Qué solución propone?", "Reglas claras sobre cuándo usar el celular", "Que cada alumno decida libremente cuándo usar el celular", "Comprar más cuadernos"]),
];

// --- Comparar textos ------------------------------------------------------

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿En qué coinciden los dos textos?", "Texto 1: El cebiche peruano fue declarado Patrimonio Cultural Inmaterial por la Unesco en 2023.\nTexto 2: En cualquier mercado del Perú, el cebiche une a pescadores, cocineros y comensales en una misma tradición.", "Ambos destacan el cebiche como parte de la cultura peruana.", "Ambos explican paso a paso cómo se prepara un buen cebiche con pescado fresco, limón y ají.", "Ninguno habla de cebiche."),
  pt("¿En qué se diferencian los dos textos?", "Texto 1: La Vía Expresa redujo el tiempo de viaje entre distritos.\nTexto 2: Los vecinos de la zona denuncian ruido y contaminación desde que se construyó la Vía Expresa.", "El primero resalta un beneficio; el segundo, un perjuicio.", "Los dos critican la Vía Expresa por el ruido que produce.", "Hablan de vías distintas."),
  pt("¿Qué información agrega el texto 2?", "Texto 1: El oso de anteojos vive en los bosques andinos.\nTexto 2: El oso de anteojos está en peligro por la pérdida de su hábitat y la caza.", "Las amenazas que enfrenta la especie", "El lugar donde vive el oso de anteojos", "El color del oso"),
  pt("¿En qué coinciden los dos textos?", "Texto 1: Según un estudio, leer en papel favorece la comprensión de textos largos.\nTexto 2: Muchos docentes observan que sus alumnos recuerdan mejor lo que leen en libros impresos.", "Ambos asocian el papel con una mejor comprensión.", "Ambos afirman que las pantallas de los celulares y tabletas son mejores para leer textos largos.", "Ambos hablan de cine."),
  pt("¿En qué se diferencian los dos textos?", "Texto 1: Un diario informa que el río Mantaro tiene niveles altos de plomo.\nTexto 2: Una empresa minera afirma que sus operaciones cumplen todas las normas ambientales.", "Presentan perspectivas opuestas sobre la contaminación.", "Los dos son publicidad de la misma empresa minera.", "No tratan el mismo tema."),
  pt("¿Qué información agrega el texto 2?", "Texto 1: Las Líneas de Nasca son figuras trazadas en el desierto.\nTexto 2: Se conservan porque en esa zona casi no llueve ni hay viento fuerte.", "La razón por la que se han conservado", "La ubicación de las Líneas de Nasca", "Su tamaño"),
];
const GENRE = "¿En qué se diferencian los dos textos?";
const GENRES: ChoiceItem[] = [
  pt(GENRE, "Texto 1 (poema): «Huascarán, gigante blanco, / te vas quedando sin nieve».\nTexto 2 (artículo): «El glaciar del Huascarán ha perdido cerca del 40 % de su superficie desde 1970».", "El poema expresa sentimientos; el artículo da datos medibles.", "El artículo usa rima y metáforas; el poema presenta estadísticas precisas y fechas exactas.", "Hablan de montañas distintas."),
  pt(GENRE, "Texto 1 (leyenda): «La laguna de Paca se formó cuando un pueblo egoísta fue castigado por negarle agua a un mendigo».\nTexto 2 (enciclopedia): «La laguna de Paca, en Junín, tiene origen tectónico y glaciar».", "La leyenda da una explicación fantástica; la enciclopedia, una científica.", "La enciclopedia narra un castigo sobrenatural; la leyenda da datos geológicos comprobados por científicos.", "Ambas son científicas."),
  pt(GENRE, "Texto 1 (diario personal): «Hoy vi por primera vez el mar. Me dio miedo y ganas de llorar».\nTexto 2 (folleto turístico): «Disfrute de 3000 km de costa con playas para todos los gustos».", "El diario es íntimo; el folleto busca atraer visitantes.", "El folleto expresa miedo y ganas de llorar; el diario personal busca vender viajes y paquetes turísticos.", "Ambos son íntimos."),
  pt(GENRE, "Texto 1 (noticia): «Ayer se inauguró el puente en Iquitos, con una inversión de 50 millones».\nTexto 2 (crónica): «Doña Rosa cruzó el puente nuevo despacio, tocando la baranda como si fuera un milagro».", "La noticia informa los hechos; la crónica narra con detalles y emoción.", "La crónica da cifras exactas; la noticia cuenta emociones.", "Hablan de lugares distintos."),
  pt(GENRE, "Texto 1 (fábula): «La hormiga trabajó todo el verano; el grillo cantó y en invierno pasó hambre».\nTexto 2 (artículo): «Ahorrar el 10 % del ingreso mensual ayuda a enfrentar emergencias».", "La fábula enseña con personajes; el artículo aconseja con datos.", "El artículo usa animales; la fábula da cifras económicas.", "Ninguno enseña nada."),
  pt(GENRE, "Texto 1 (carta): «Querida abuela: te extraño. Aquí en Lima todo es ruido».\nTexto 2 (informe): «El 80 % de los migrantes internos se concentra en Lima Metropolitana».", "La carta es personal y afectiva; el informe es impersonal y estadístico.", "El informe es afectivo y personal; la carta presenta estadísticas sobre la migración en el país.", "Los dos son informes."),
];

// --- Elementos visuales ---------------------------------------------------

const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿Qué muestran ambas ilustraciones de la batalla de Ayacucho?", "Ilustración 1: un cuadro de 1890 con soldados heroicos, bandera en alto y cielo luminoso.\nIlustración 2: un grabado de la época con soldados cansados, heridos y barro.", "La 1 idealiza la batalla; la 2 muestra su dureza.", "La 2 idealiza la batalla; la 1 muestra su dureza.", "Son idénticas."),
  pt("¿Qué diferencia hay entre las dos ilustraciones de «El caballero Carmelo»?", "Ilustración 1: Carmelo enorme, dorado, como un guerrero de leyenda.\nIlustración 2: Carmelo pequeño y viejo, en brazos del narrador niño.", "La 1 lo muestra épico; la 2, frágil y querido.", "La 2 lo muestra épico; la 1, frágil y querido.", "No hay diferencia."),
  pt("¿Qué tienen en común las dos ilustraciones de Túpac Amaru II?", "Ilustración 1: un retrato solemne con capa y sombrero.\nIlustración 2: un mural moderno con su rostro rodeado de campesinos.", "Ambas lo presentan como figura digna e importante.", "Ambas lo presentan como un personaje cómico y ridículo.", "Ninguna lo muestra."),
  pt("¿Qué transmite cada ilustración de Lima?", "Ilustración 1: una acuarela del siglo XIX con balcones, calesas y gente paseando.\nIlustración 2: una fotografía actual del mismo lugar con tráfico y edificios.", "La 1, una ciudad tranquila; la 2, una ciudad agitada.", "La 1, una ciudad agitada; la 2, una ciudad tranquila.", "Las dos muestran el campo."),
  pt("¿Qué diferencia hay entre las dos ilustraciones del mito de Naylamp?", "Ilustración 1: Naylamp llega en balsa entre olas tranquilas, con una corte ordenada.\nIlustración 2: Naylamp aparece con alas, elevándose entre nubes oscuras.", "La 1 muestra su llegada; la 2, su partida misteriosa.", "La 1 muestra su partida; la 2, su llegada en balsa.", "Las dos muestran lo mismo."),
];
const ORGANIZERS: ChoiceItem[] = [
  pt("¿Qué tipo de organizador gráfico es?", "Dos círculos superpuestos: a la izquierda «Costa», a la derecha «Sierra» y en el centro «Producen alimentos».", "Diagrama de Venn", "Línea de tiempo", "Mapa de causa y efecto"),
  pt("¿Qué tipo de organizador gráfico es?", "Una flecha horizontal con fechas: 1532, 1780, 1821, 1879.", "Línea de tiempo", "Diagrama de Venn", "Cuadro comparativo"),
  pt("Según el organizador, ¿qué efecto tiene la tala?", "Causa: tala del bosque → Efectos: erosión del suelo, pérdida de especies, menos lluvias.", "La erosión del suelo", "La siembra de árboles nuevos en la zona", "Más lluvias"),
  pt("Según el mapa conceptual, ¿qué es la oda?", "Género lírico → subgéneros: oda (exalta algo), elegía (lamenta una pérdida), sátira (critica con humor).", "Un poema que exalta algo", "Un poema que lamenta una pérdida", "Un poema que critica"),
  pt("Según el cuadro, ¿qué región tiene el clima más húmedo?", "Región | Clima\nCosta | Árido\nSierra | Frío y seco\nSelva | Cálido y lluvioso", "Selva", "Costa", "Sierra"),
  pt("Según el diagrama, ¿qué va después de la planificación?", "Planificación → Textualización → Revisión → Publicación", "Textualización", "Revisión", "Publicación"),
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
