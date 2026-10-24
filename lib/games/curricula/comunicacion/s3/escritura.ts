import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 3.° de Secundaria · banco de escritura: organizar las ideas, tesis,
// evidencias, análisis y contraargumentos, falacias, apelaciones, conectores
// (no obstante, por ende, asimismo, en otras palabras), comparaciones mal
// hechas («más mejor», «más superior», comparar «el clima de Lima con
// Arequipa»), paralelismo, voz activa y pasiva, tilde diacrítica (él/el,
// tú/tu, mí/mi, sé/se, qué/que), palabras que suelen escribirse mal y
// referencias y citas en formato APA.


// --- Organizar la escritura -----------------------------------------------

const BROAD_NARROW: OrderItem[] = [
  { seq: ["derechos humanos", "derechos civiles", "libertad de expresión", "libertad de prensa", "el periodismo de investigación en el Perú"] }, { seq: ["literatura", "literatura latinoamericana", "novela peruana", "novela urbana", "«La ciudad y los perros»"] },
  { seq: ["medio ambiente", "contaminación", "contaminación del agua", "contaminación por mercurio", "el mercurio en Madre de Dios"] }, { seq: ["economía", "trabajo", "empleo informal", "comercio ambulatorio", "los ambulantes del centro de Lima"] },
  { seq: ["historia", "siglo XX peruano", "conflicto armado interno", "Comisión de la Verdad", "la muestra «Yuyanapaq»"] }, { seq: ["salud", "salud pública", "nutrición", "anemia", "la anemia infantil en Puno"] },
  { seq: ["tecnología", "comunicaciones", "redes sociales", "desinformación", "noticias falsas en las elecciones"] }, { seq: ["cultura", "música", "música andina", "huaino", "el huaino ayacuchano"] },
];
const BY_TOPIC: ChoiceItem[] = [
  pt("Escribes un ensayo sobre la informalidad laboral. ¿En qué sección va este dato?", "«Siete de cada diez trabajadores no tienen contrato».", "Diagnóstico", "Propuestas", "Conclusión"), pt("Escribes un ensayo sobre la informalidad laboral. ¿En qué sección va este dato?", "«Simplificar los trámites para formalizar pequeños negocios».", "Propuestas", "Diagnóstico", "Antecedentes"),
  pt("Escribes un ensayo sobre la informalidad laboral. ¿En qué sección va este dato?", "«En los años ochenta, la crisis económica disparó el comercio ambulatorio».", "Antecedentes", "Propuestas", "Conclusión"), pt("Escribes una reseña de «La ciudad y los perros». ¿En qué sección va este dato?", "«Vargas Llosa la publicó en 1963».", "Datos de la obra", "Análisis", "Valoración personal"),
  pt("Escribes una reseña de «La ciudad y los perros». ¿En qué sección va este dato?", "«La novela critica la violencia institucional».", "Análisis", "Datos de la obra", "Resumen del argumento"), pt("Escribes una reseña de «La ciudad y los perros». ¿En qué sección va este dato?", "«Recomiendo la novela por su estructura compleja y atrapante».", "Valoración personal", "Datos de la obra", "Análisis"),
  pt("Preparas un informe sobre el Niño costero. ¿En qué sección va este dato?", "«Las lluvias destruyeron más de 200 puentes».", "Consecuencias", "Causas", "Prevención"), pt("Preparas un informe sobre el Niño costero. ¿En qué sección va este dato?", "«Elaborar mapas de riesgo y prohibir construir en quebradas».", "Prevención", "Causas", "Consecuencias"),
];

// --- Oraciones temáticas y tesis -------------------------------------------------

const TOPIC = "¿Qué oración temática resume mejor la idea principal del párrafo?";
const TOPIC_SENTENCE: ChoiceItem[] = [
  pt(TOPIC, "___ Los incas construyeron andenes, canales y reservorios que aún funcionan. Domesticaron cientos de variedades de papa. Y organizaron depósitos para enfrentar años de mala cosecha.", "Los incas desarrollaron un sistema agrícola sofisticado y previsor.", "Los incas construyeron andenes en muchas partes de la sierra, como en el Valle Sagrado.", "Los incas comían papa."),
  pt(TOPIC, "___ Algunos jóvenes encuentran en las redes un espacio para expresarse y aprender. Otros sufren acoso, comparaciones constantes y adicción.", "Las redes sociales tienen efectos ambivalentes en los jóvenes.", "Las redes sociales son usadas por millones de jóvenes en el Perú y en todo el mundo.", "Hay redes."),
  pt(TOPIC, "___ Vallejo transformó el lenguaje poético con «Trilce»; Arguedas dio voz al mundo andino; Vargas Llosa llevó la novela peruana al mundo.", "La literatura peruana del siglo XX tuvo autores que renovaron la tradición.", "Vallejo escribió «Trilce» en 1922 y allí rompió con las formas tradicionales del verso.", "Hay escritores."),
  pt(TOPIC, "___ Al principio se discutió en voz baja. Luego aparecieron los primeros informes. Finalmente, la comunidad entera exigió explicaciones.", "La preocupación por el caso creció hasta volverse un reclamo colectivo.", "Al principio la gente discutía en voz baja en las esquinas y en el mercado.", "Hubo un caso."),
  pt(TOPIC, "___ Las lenguas originarias guardan conocimientos sobre plantas medicinales, ciclos agrícolas y formas de entender el mundo que no existen en otros idiomas.", "Cada lengua originaria es un archivo de saberes únicos.", "En el Perú se hablan más de cuarenta lenguas originarias en distintas regiones.", "Hay lenguas."),
  pt(TOPIC, "___ Reduce los accidentes, mejora la salud y libera el espacio público. Sin embargo, exige ciclovías seguras que muchas ciudades no tienen.", "La bicicleta trae beneficios urbanos, pero requiere infraestructura.", "La bicicleta es un vehículo de dos ruedas que se impulsa con los pedales.", "Hay bicicletas."),
];
const THESIS = "¿Qué oración es la mejor tesis para un ensayo argumentativo?";
const THESES: ChoiceItem[] = [
  w(THESIS, "La enseñanza de la memoria del conflicto armado en los colegios es indispensable para evitar que la violencia se repita.", "El conflicto armado interno ocurrió entre 1980 y 2000 y dejó miles de víctimas en distintas regiones del país, sobre todo en Ayacucho.", "¿Qué pasó en los ochenta?"),
  w(THESIS, "El Estado debe priorizar el agua potable en las zonas rurales, porque es la base de la salud y el desarrollo.", "Muchas comunidades rurales del Perú no tienen acceso a agua potable y deben acarrearla desde ríos o pozos lejanos.", "El agua es vida."),
  w(THESIS, "Las universidades deberían reservar vacantes para estudiantes de zonas rurales, ya que el talento no depende del lugar de nacimiento.", "Cada año, miles de jóvenes postulan a las universidades públicas del país y solo una parte logra ingresar.", "Hay universidades."),
  w(THESIS, "La comida chatarra debería tener impuestos más altos para financiar programas de nutrición infantil.", "La comida chatarra se vende en quioscos, supermercados y bodegas de todo el país, y tiene mucha azúcar y grasa.", "La comida chatarra existe."),
  w(THESIS, "Los videojuegos educativos deberían integrarse al currículo, porque motivan y desarrollan habilidades de resolución de problemas.", "En este ensayo hablaré de los videojuegos, de su historia y de los más populares entre los jóvenes peruanos.", "Me gustan los videojuegos."),
  w(THESIS, "Proteger las lomas costeras es urgente, porque son ecosistemas únicos que la expansión urbana está destruyendo.", "Las lomas costeras son ecosistemas que florecen en invierno gracias a la neblina que llega desde el mar.", "Las lomas son verdes."),
];

// --- Argumentos -----------------------------------------------------------

const FO = sorter(["Hecho (se puede comprobar)", "Opinión (juicio personal)"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  ...["La CVR entregó su Informe Final en 2003.", "Mario Vargas Llosa nació en Arequipa.", "Lima fue fundada en 1535.", "El quechua es lengua oficial en las zonas donde predomina.", "Machu Picchu fue declarado Patrimonio de la Humanidad en 1983.", "La papa es originaria de los Andes."].map((x) => FO(x, 0)),
  ...["«La ciudad y los perros» es la mejor novela latinoamericana.", "La política peruana es la más decepcionante del continente.", "Ningún paisaje supera al cañón del Colca.", "El reguetón empobrece la música.", "Los jóvenes de hoy son más egoístas que los de antes.", "Lima es una ciudad gris y deprimente."].map((x) => FO(x, 1)),
];
const SW = sorter(["Evidencia sólida", "Evidencia débil"], "¿La evidencia es sólida o débil para apoyar la afirmación?");
const STRONG_WEAK: ChoiceItem[] = [
  ...["Afirmación: La lectura mejora el rendimiento.\nEvidencia: Un estudio con 5000 alumnos halló mejores notas en quienes leen a diario.", "Afirmación: Los glaciares retroceden.\nEvidencia: El Inaigem midió una pérdida de más de la mitad de su superficie desde 1962.", "Afirmación: El casco salva vidas.\nEvidencia: Datos hospitalarios muestran menos muertes en motociclistas con casco.", "Afirmación: La anemia afecta el aprendizaje.\nEvidencia: Investigaciones médicas vinculan la falta de hierro con menor atención."].map((x) => SW(x, 0)),
  ...["Afirmación: La lectura mejora el rendimiento.\nEvidencia: Mi primo lee mucho y es inteligente.", "Afirmación: Los glaciares retroceden.\nEvidencia: Mi tío dice que antes hacía más frío.", "Afirmación: El casco salva vidas.\nEvidencia: Todos lo saben.", "Afirmación: La anemia afecta el aprendizaje.\nEvidencia: Un video viral dice que los niños con anemia se distraen."].map((x) => SW(x, 1)),
];
const EVIDENCE: ChoiceItem[] = [
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: La educación bilingüe mejora la comprensión lectora.", "Una evaluación del Minedu mostró mejores resultados en escuelas bilingües bien implementadas.", "Muchos niños de la sierra hablan quechua en su casa y castellano en el colegio, y algunos se confunden al principio.", "El quechua es bonito."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El ruido urbano daña la salud.", "La OMS asocia la exposición crónica al ruido con hipertensión y trastornos del sueño.", "Las bocinas de los autos y las combis suenan muy fuerte en las avenidas principales de Lima en hora punta.", "El ruido molesta."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Las áreas protegidas reducen la deforestación.", "Imágenes satelitales muestran menos tala dentro de las áreas protegidas que fuera de ellas.", "Las áreas protegidas son lugares muy bonitos, con muchos árboles, ríos y animales que los turistas visitan.", "Hay áreas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El ejercicio mejora la memoria.", "Un experimento mostró que quienes caminaban 30 minutos diarios recordaban más palabras.", "Mi abuelo camina todas las mañanas por el parque y dice que se siente muy bien desde que empezó a hacerlo.", "Caminar es sano."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: El turismo genera empleo en la sierra sur.", "Cifras del Mincetur muestran miles de puestos de trabajo ligados al turismo en Cusco y Puno.", "Cusco y Puno son destinos muy visitados por turistas extranjeros que llegan en avión, tren y bus.", "Hay turistas."),
  pt("¿Qué evidencia apoya mejor la afirmación?", "Afirmación: Dormir poco afecta el rendimiento escolar.", "Un estudio halló que los alumnos que duermen menos de seis horas tienen notas más bajas.", "Muchos adolescentes se acuestan tarde porque se quedan viendo series o chateando con sus amigos.", "Dormir es rico."),
];
const IN_TEXT_EVIDENCE = [
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) Las lomas costeras deben protegerse. (2) Albergan más de 800 especies de plantas, muchas únicas en el mundo. (3) Los fines de semana, muchas familias las visitan. (4) Son lugares agradables.", "La oración 2", "La oración 3", "La oración 4"),
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) Los colegios deben enseñar educación financiera. (2) Es un tema interesante. (3) Según una encuesta, el 60 % de los jóvenes no sabe qué es un interés. (4) El dinero es importante.", "La oración 3", "La oración 2", "La oración 4"),
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) El transporte público debe mejorar. (2) Muchos viajan en combi. (3) Un limeño pasa en promedio dos horas diarias en el tráfico. (4) Las combis son de colores.", "La oración 3", "La oración 2", "La oración 4"),
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) La música mejora la convivencia escolar. (2) En los colegios con orquesta, las peleas se redujeron en un tercio. (3) La música suena bien. (4) Hay muchos instrumentos.", "La oración 2", "La oración 3", "La oración 4"),
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) El reciclaje debe ser obligatorio. (2) La basura huele mal. (3) Solo se recicla el 2 % de los residuos sólidos del país. (4) Hay tachos verdes.", "La oración 3", "La oración 2", "La oración 4"),
  pt("¿Qué oración del texto es la evidencia que apoya la afirmación?", "(1) La lectura en voz alta ayuda a los niños pequeños. (2) Leer es bonito. (3) Los niños a quienes les leen a diario conocen el doble de palabras al entrar al colegio. (4) Hay cuentos.", "La oración 3", "La oración 2", "La oración 4"),
];
const COUNTER_EVAL = "¿Cuál es la respuesta más sólida al contraargumento?";
const COUNTERCLAIMS: ChoiceItem[] = [
  pt(COUNTER_EVAL, "Tesis: Debe ampliarse la jornada escolar.\nContraargumento: Los alumnos se cansarán más.", "Si las horas extra se dedican a arte y deporte, pueden reducir el cansancio y mejorar la motivación.", "Los alumnos siempre se quejan de todo, así que no hay que hacerles caso cuando dicen que están cansados.", "No es cierto."),
  pt(COUNTER_EVAL, "Tesis: Debe prohibirse la minería en cabeceras de cuenca.\nContraargumento: La minería genera empleo.", "El empleo minero es temporal, mientras que el daño al agua afecta a generaciones enteras de agricultores.", "Los mineros ganan mucho dinero y por eso no les importa nada de lo que pase con el agua de los ríos.", "La minería es mala."),
  pt(COUNTER_EVAL, "Tesis: El voto debería ser voluntario.\nContraargumento: Bajaría la participación.", "Una participación menor pero informada puede producir decisiones de mejor calidad.", "A la gente no le gusta votar y por eso siempre se queja de los políticos que ganan las elecciones.", "No importa."),
  pt(COUNTER_EVAL, "Tesis: Los celulares deben permitirse en clase.\nContraargumento: Distraen a los alumnos.", "Con reglas claras de uso, el celular puede ser una herramienta de investigación, como lo demuestran algunas escuelas.", "Los profesores también usan celular y nadie les dice nada, así que los alumnos también tienen derecho.", "No distraen."),
  pt(COUNTER_EVAL, "Tesis: Debe crearse un impuesto al plástico.\nContraargumento: Subirían los precios.", "El aumento sería mínimo frente al costo ambiental y de salud que hoy pagamos todos.", "Los precios siempre suben de todas maneras, así que un poco más no le va a importar a nadie.", "Que suban."),
];
const ANALYSIS = "¿Qué análisis conecta mejor la evidencia con la afirmación?";
const ANALYSES: ChoiceItem[] = [
  pt(ANALYSIS, "Afirmación: La lectura diaria mejora la escritura.\nEvidencia: Los alumnos que leen a diario cometen 40 % menos errores ortográficos.", "Al leer, los alumnos ven repetidamente palabras bien escritas, lo que fija su ortografía.", "La ortografía es muy importante para conseguir un buen trabajo y para que nos respeten en la sociedad.", "Leer es bueno."),
  pt(ANALYSIS, "Afirmación: Los parques reducen la delincuencia.\nEvidencia: En barrios con parques iluminados, los robos bajaron un 25 %.", "Los espacios iluminados y concurridos aumentan la vigilancia natural de los vecinos.", "Los parques tienen árboles, flores y juegos para niños que hacen más bonito el barrio.", "Hay parques."),
  pt(ANALYSIS, "Afirmación: La educación bilingüe mejora el aprendizaje.\nEvidencia: Los alumnos bilingües obtienen mejores resultados en comprensión lectora.", "Aprender primero en la lengua materna permite comprender antes de traducir.", "El quechua y el castellano son dos lenguas muy distintas que se hablan en el Perú desde hace siglos.", "Es así."),
  pt(ANALYSIS, "Afirmación: La comida casera es más saludable.\nEvidencia: Los platos caseros tienen, en promedio, la mitad de sal que la comida rápida.", "Menos sal reduce el riesgo de hipertensión, lo que mejora la salud a largo plazo.", "La comida casera es más rica porque la prepara la mamá con mucho cariño y dedicación.", "Es mejor."),
  pt(ANALYSIS, "Afirmación: El trabajo en equipo mejora los proyectos.\nEvidencia: Los proyectos grupales de la feria obtuvieron mejores puntajes que los individuales.", "Al combinar habilidades distintas, los equipos resuelven mejor los problemas complejos.", "Trabajar en equipo es divertido porque uno conversa con sus amigos y se ríe mientras trabaja.", "Así es."),
];
const TRANS = "¿Qué transición conecta mejor las ideas?";
const TRANSITIONS: ChoiceItem[] = [
  pt(TRANS, "Afirmación: La anemia afecta el aprendizaje. ___ un estudio del Minsa muestra que los niños anémicos tienen menor atención.", "Por ejemplo,", "Sin embargo,", "En conclusión,"),
  pt(TRANS, "Evidencia: Los robos bajaron 25 % en barrios con parques. ___ los espacios concurridos aumentan la vigilancia.", "Esto se debe a que", "A pesar de que", "Por el contrario,"),
  pt(TRANS, "Algunos sostienen que la minería genera empleo. ___ ese empleo suele ser temporal.", "No obstante,", "Además,", "Por ejemplo,"),
  pt(TRANS, "La lectura amplía el vocabulario. ___ mejora la comprensión de textos complejos.", "Asimismo,", "Sin embargo,", "En cambio,"),
  pt(TRANS, "Hemos visto las causas, la evidencia y las objeciones. ___ la propuesta es viable y necesaria.", "En conclusión,", "Por ejemplo,", "No obstante,"),
  pt(TRANS, "Es cierto que el plan cuesta dinero. ___ el costo de no hacer nada sería mayor.", "Aun así,", "Por ejemplo,", "Asimismo,"),
];
const FALLACY = sorter(["Ataque personal", "Generalización apresurada", "Falso dilema", "Pendiente resbaladiza", "Hombre de paja", "Apelación a la popularidad"], "¿Qué falacia contiene el argumento?");
const FALLACIES: ChoiceItem[] = [
  ...["No escuchen su propuesta sobre el agua; él ni siquiera paga sus deudas."].map((x) => FALLACY(x, 0)),
  ...["Dos políticos de ese partido fueron corruptos; todos lo son."].map((x) => FALLACY(x, 1)),
  ...["O apoyas la carretera o estás contra el progreso.", "O es blanco o es negro: no hay término medio."].map((x) => FALLACY(x, 2)),
  ...["Si dejamos que usen gorra en clase, luego vendrán en pijama y después nadie respetará las reglas."].map((x) => FALLACY(x, 3)),
  ...["Mi rival quiere menos tareas; o sea, quiere que nadie estudie.", "Los ecologistas dicen que hay que cuidar el agua; quieren que nadie se bañe."].map((x) => FALLACY(x, 4)),
  ...["Millones de personas usan esa aplicación; tiene que ser segura.", "Todo el mundo lo hace; no puede estar mal."].map((x) => FALLACY(x, 5)),
];

// --- Estrategias persuasivas ------------------------------------------------

const APPEAL = sorter(["Ethos (credibilidad)", "Pathos (emoción)", "Logos (lógica y datos)"], "¿A qué apela el anuncio?");
const APPEALS: ChoiceItem[] = [
  ...["«Recomendado por la Sociedad Peruana de Pediatría».", "«Más de 40 años cuidando a las familias peruanas».", "«La campeona olímpica entrena con estas zapatillas»."].map((x) => APPEAL(x, 0)),
  ...["«No esperes a que sea tarde para decirle cuánto la quieres».", "«Imagina la sonrisa de tu hijo al abrir su regalo».", "«Un niño con frío te necesita hoy»."].map((x) => APPEAL(x, 1)),
  ...["«Ahorra 200 soles al año con este foco».", "«Probado en 3000 hogares: 95 % de satisfacción».", "«El doble de duración por el mismo precio»."].map((x) => APPEAL(x, 2)),
];
const USE_APPEAL: ChoiceItem[] = [
  w("Escribes para pedir que se donen libros a una escuela rural. ¿Qué oración usa el pathos?", "Imagina a una niña que nunca ha tenido un libro propio y que hoy podría tener el primero.", "Según el Minedu, el 40 % de las escuelas rurales del país no tiene biblioteca ni libros suficientes para sus alumnos.", "Soy bibliotecario desde hace veinte años."),
  w("Escribes para pedir que se donen libros a una escuela rural. ¿Qué oración usa el logos?", "Según el Minedu, el 40 % de las escuelas rurales no tiene biblioteca.", "Imagina a una niña que nunca ha tenido un libro propio y que hoy podría tener el primero.", "Soy bibliotecario desde hace veinte años."),
  w("Escribes para pedir que se donen libros a una escuela rural. ¿Qué oración usa el ethos?", "Como bibliotecario desde hace veinte años, he visto cómo un libro cambia una vida.", "Imagina a una niña que nunca ha tenido un libro propio y que sueña cada noche con tener uno.", "Hay pocas bibliotecas."),
  w("Quieres convencer a tu municipio de construir una ciclovía. ¿Qué oración usa el logos?", "Las ciclovías reducen hasta un 30 % los accidentes de ciclistas, según estudios urbanos.", "Piensa en los niños que podrían ir seguros en bicicleta al colegio cada mañana, felices y sin miedo a los autos.", "Soy ciclista."),
  w("Quieres convencer a tu municipio de construir una ciclovía. ¿Qué oración usa el pathos?", "Piensa en los niños que podrían ir seguros en bicicleta al colegio cada mañana.", "Las ciclovías reducen hasta un 30 % los accidentes de ciclistas, según estudios.", "Soy ingeniero."),
  w("Quieres convencer a tu municipio de construir una ciclovía. ¿Qué oración usa el ethos?", "Como ingeniera de tránsito con quince años de experiencia, puedo afirmar que la ciclovía es viable.", "Piensa en los niños que podrían ir seguros en bicicleta al colegio cada mañana, sin miedo a los autos ni a las combis.", "Las ciclovías son buenas."),
];

// --- Estilo -----------------------------------------------------------------

const PERSON = "¿Qué oración usa la personificación?";
const PERSONIFICATION: ChoiceItem[] = [
  w(PERSON, "La sequía mordía los campos sin piedad.", "La sequía afectó gravemente los campos de cultivo de la región durante meses.", "No llovió."), w(PERSON, "El viejo tren se quejaba en cada curva.", "El viejo tren hacía mucho ruido en cada curva del camino a Huancayo.", "El tren."),
  w(PERSON, "La noticia corrió de boca en boca y tocó todas las puertas.", "La noticia se difundió rápidamente entre todos los vecinos del barrio.", "Se supo."), w(PERSON, "El mar abrazaba la isla con sus brazos de espuma.", "El mar rodeaba la isla y las olas formaban espuma en la orilla.", "Hay mar."),
  w(PERSON, "La pobreza se sentó a la mesa de muchas familias.", "Muchas familias no tenían suficiente dinero para comprar comida.", "Eran pobres."), w(PERSON, "El reloj se burlaba de mi impaciencia.", "El reloj avanzaba muy despacio mientras yo esperaba impaciente.", "Esperé."),
  w(PERSON, "La ciudad se despertó bostezando entre la neblina.", "La ciudad amaneció cubierta por una neblina espesa y gris.", "Amaneció."), w(PERSON, "El volcán guardaba su furia en silencio.", "El volcán estaba inactivo, aunque podía hacer erupción en cualquier momento.", "Hay volcán."),
];

// --- Claridad y concisión -----------------------------------------------------

const CONJ_ADV: ChoiceItem[] = [
  f("La propuesta era ambiciosa; ___, fue aprobada por unanimidad.", "no obstante", "por ende", "en otras palabras"), f("Faltó presupuesto; ___, se suspendió la obra.", "por ende", "no obstante", "asimismo"),
  f("El informe es extenso; ___, es claro y bien organizado.", "con todo", "por consiguiente", "en otras palabras"), f("Es un texto ambiguo; ___, admite varias interpretaciones.", "en otras palabras", "no obstante", "por el contrario"),
  f("La medida reduce la contaminación; ___, genera empleo verde.", "asimismo", "no obstante", "por el contrario"), f("No hubo quórum; ___, la sesión se postergó.", "en consecuencia", "asimismo", "en otras palabras"),
  f("Se esperaba una gran asistencia; ___, llegaron pocos.", "por el contrario", "por ende", "asimismo"), f("La lectura desarrolla el pensamiento crítico; ___, fortalece la escritura.", "además", "no obstante", "por el contrario"),
];
const COMPARE = "¿Qué oración hace una comparación correcta y clara?";
const COMPARISONS: ChoiceItem[] = [
  w(COMPARE, "Este celular es mejor que el anterior.", "Este celular es más mejor que el anterior.", "Este celular es más superior que el anterior y mejor."), w(COMPARE, "El clima de Lima es más húmedo que el de Arequipa.", "El clima de Lima es más húmedo que Arequipa en invierno y en verano.", "Lima es más húmedo que el clima."),
  w(COMPARE, "Su propuesta es superior a la mía.", "Su propuesta es más superior que la mía.", "Su propuesta es superior que la mía en todo."), w(COMPARE, "El Amazonas es más largo que cualquier otro río de América.", "El Amazonas es más largo que cualquier río de América y del mundo entero.", "El Amazonas es el más largo que los ríos."),
  w(COMPARE, "Ana quiere a su perro más de lo que lo quiere su hermano.", "Ana quiere a su perro más que su hermano.", "Ana quiere a su perro más que su hermano, y por eso lo cuida."), w(COMPARE, "Los alumnos de esta sección leen más que los de la otra.", "Los alumnos de esta sección leen más que la otra.", "Esta sección lee más que los de la otra sección del mismo grado del colegio."),
  w(COMPARE, "Es la peor sequía de la década.", "Es la más peor sequía de la década.", "Es la sequía más peor que hubo en toda la década."), w(COMPARE, "La población de Lima es mayor que la de Arequipa.", "La población de Lima es más mayor que Arequipa y que todas las demás ciudades.", "Lima es mayor que la población."),
];
const PARA_ID = sorter(["Tiene estructura paralela", "No tiene estructura paralela"], "¿La oración tiene estructura paralela?");
const PARALLEL_ID: ChoiceItem[] = [
  ...["Le gusta investigar, escribir y debatir.", "Fue elegida por su honestidad, su experiencia y su liderazgo.", "No solo trabaja, sino que también estudia.", "Queremos calles limpias, parques seguros y vecinos solidarios."].map((x) => PARA_ID(x, 0)),
  ...["Le gusta investigar, escribir y el debate.", "Fue elegida por honesta, su experiencia y porque lidera.", "No solo trabaja, sino estudiando también.", "Queremos calles limpias, parques que sean seguros y que los vecinos se ayuden."].map((x) => PARA_ID(x, 1)),
];
const PARA = "¿Qué versión tiene una estructura paralela?";
const PARALLEL: ChoiceItem[] = [
  w(PARA, "El objetivo es informar, educar y movilizar.", "El objetivo es informar, la educación y movilizando a la gente.", "Informar."), w(PARA, "Prefiero leer novelas a ver series.", "Prefiero leer novelas a que vea series en la plataforma de videos.", "Prefiero leer."),
  w(PARA, "Tanto los padres como los docentes firmaron.", "Tanto los padres como que firmaron también los docentes del colegio.", "Firmaron."), w(PARA, "Es un líder honesto, firme y cercano.", "Es un líder honesto, con firmeza y que es cercano a la gente del barrio.", "Es un líder."),
  w(PARA, "Hay que reducir, reutilizar y reciclar.", "Hay que reducir, la reutilización y que se recicle todo lo posible en casa.", "Hay que reciclar."), w(PARA, "Viajó por mar, por tierra y por aire.", "Viajó por mar, en tierra y volando en avión hasta llegar a su destino final.", "Viajó."),
];
const REDUNDANT = "¿Qué versión elimina la redundancia?";
const REDUNDANCY: ChoiceItem[] = [
  pt(REDUNDANT, "Volvió a reiterar su postura.", "Reiteró su postura.", "Volvió a reiterar otra vez de nuevo su postura de siempre.", "Volvió."),
  pt(REDUNDANT, "Es un problema grave y serio que preocupa a todos.", "Es un problema grave que preocupa a todos.", "Es un problema grave, serio e importante que preocupa mucho a todos.", "Problema."),
  pt(REDUNDANT, "Los dos ambos firmaron el acuerdo.", "Ambos firmaron el acuerdo.", "Los dos ambos juntos firmaron el acuerdo final entre los dos.", "Firmaron."),
  pt(REDUNDANT, "Hubo una gran multitud de personas en la plaza.", "Hubo una multitud en la plaza.", "Hubo una gran multitud de muchas personas en la plaza principal.", "Hubo gente."),
  pt(REDUNDANT, "El testigo dio su testimonio personal.", "El testigo dio su testimonio.", "El testigo dio su testimonio personal propio y verdadero ante el juez.", "Testificó."),
  pt(REDUNDANT, "Es una novedad nueva en el mercado.", "Es una novedad en el mercado.", "Es una novedad nueva y reciente que llegó hace poco al mercado.", "Es nuevo."),
];

// --- Voz activa y pasiva ------------------------------------------------------

const VOICE = sorter(["Voz activa", "Voz pasiva"], "¿La oración está en voz activa o en voz pasiva?");
const IDENTIFY_VOICE: ChoiceItem[] = [
  ...["La CVR entregó su informe en 2003.", "Vargas Llosa publicó la novela en 1963.", "Los vecinos construyeron el muro.", "La fiscalía investigó el caso.", "El jurado eligió a la ganadora."].map((x) => VOICE(x, 0)),
  ...["El informe fue entregado por la CVR en 2003.", "La novela fue publicada en 1963.", "El muro fue construido por los vecinos.", "Se investigó el caso durante meses.", "La ganadora fue elegida por el jurado."].map((x) => VOICE(x, 1)),
];
const ACTIVE = "¿Cómo queda la oración en voz activa?";
const TO_ACTIVE: ChoiceItem[] = [
  pt(ACTIVE, "El puente fue reconstruido por la comunidad.", "La comunidad reconstruyó el puente.", "El puente reconstruyó a la comunidad entera del valle.", "La comunidad fue reconstruida."),
  pt(ACTIVE, "La ley fue aprobada por el Congreso.", "El Congreso aprobó la ley.", "La ley aprobó al Congreso de la República.", "El Congreso fue aprobado."),
  pt(ACTIVE, "Los testimonios fueron recogidos por la Comisión.", "La Comisión recogió los testimonios.", "Los testimonios recogieron a la Comisión en todo el país.", "La Comisión fue recogida."),
  pt(ACTIVE, "El cuadro fue pintado por José Sabogal.", "José Sabogal pintó el cuadro.", "El cuadro pintó a José Sabogal en su taller de Lima.", "Sabogal fue pintado."),
  pt(ACTIVE, "La carretera será inaugurada por el alcalde.", "El alcalde inaugurará la carretera.", "La carretera inaugurará al alcalde del distrito.", "El alcalde será inaugurado."),
  pt(ACTIVE, "Los resultados fueron analizados por los científicos.", "Los científicos analizaron los resultados.", "Los resultados analizaron a los científicos del instituto.", "Los científicos fueron analizados."),
];

// --- Corregir y revisar -------------------------------------------------------

const CONFUSED_USE: ChoiceItem[] = [
  f("No sé ___ decir.", "qué", "que", "qe"), f("Dijo ___ vendría mañana.", "que", "qué", "qé"),
  f("___ entrenador es muy exigente.", "El", "Él", "Ell"), f("___ ganó la medalla.", "Él", "El", "Ell"),
  f("¿Es ___ cuaderno?", "tu", "tú", "tuu"), f("___ eres el delegado.", "Tú", "Tu", "Tuu"),
  f("Este libro es para ___.", "mí", "mi", "mii"), f("___ hermana estudia Derecho.", "Mi", "Mí", "Mii"),
  f("Yo no ___ nada del tema.", "sé", "se", "cé"), f("___ fue temprano.", "Se", "Sé", "Ce"),
  f("¿Quieres un ___ de manzanilla?", "té", "te", "thé"), f("___ llamo mañana.", "Te", "Té", "The"),
];
const CONFUSED_FIX: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "No sé si vendrá, pero sí sé que lo prometió.", "No se si vendrá, pero si se que lo prometió.", "No sé si vendrá, pero si se que lo prometió."), w("¿Qué oración está bien escrita?", "Él dijo que el profesor llegaría tarde.", "El dijo que él profesor llegaría tarde.", "Él dijo que él profesor llegaría tarde."),
  w("¿Qué oración está bien escrita?", "Aún no llega el bus, aun así esperaré.", "Aun no llega el bus, aún así esperaré.", "Aún no llega el bus, aún así esperaré."), w("¿Qué oración está bien escrita?", "Quiero más tiempo, mas no me lo dieron.", "Quiero mas tiempo, más no me lo dieron.", "Quiero mas tiempo, mas no me lo dieron."),
  w("¿Qué oración está bien escrita?", "¿Cuándo vienes? Avísame cuando llegues.", "¿Cuando vienes? Avísame cuándo llegues.", "¿Cuando vienes? Avísame cuando llegues."), w("¿Qué oración está bien escrita?", "Tú sabes que tu opinión importa.", "Tu sabes que tú opinión importa.", "Tú sabes que tú opinión importa."),
  w("¿Qué oración está bien escrita?", "A mí me gusta mi ciudad.", "A mi me gusta mí ciudad.", "A mí me gusta mí ciudad."), w("¿Qué oración está bien escrita?", "¿Dónde está el lugar donde nació?", "¿Donde está el lugar dónde nació?", "¿Donde está el lugar donde nació?"),
];
const PRON_CONTR: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Vamos al cine con él.", "Vamos a el cine con el.", "Vamos al cine con el."), w("¿Qué oración está bien escrita?", "Vengo del mercado.", "Vengo de el mercado.", "Vengo dél mercado."),
  w("¿Qué oración está bien escrita?", "Fuimos al Callao el domingo.", "Fuimos a El Callao el domingo.", "Fuimos a el Callao el domingo."), w("¿Qué oración está bien escrita?", "Leí un artículo de El Comercio.", "Leí un artículo del Comercio.", "Leí un artículo dél Comercio."),
  w("¿Qué oración está bien escrita?", "Habló con él sobre el examen.", "Habló con el sobre él examen.", "Habló con él sobre él examen."), w("¿Qué oración está bien escrita?", "Se lo di a ella; él no estaba.", "Se lo di a ella; el no estaba.", "Sé lo di a ella; él no estaba."),
];
const MISSPELLED: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Hubo un accidente en la carretera.", "Hubo un acsidente en la carretera.", "Uvo un accidente en la carretera."), w("¿Qué oración está bien escrita?", "Es imprescindible que vengas.", "Es imprecindible que vengas.", "Es imprescindile que vengas."),
  w("¿Qué oración está bien escrita?", "Tengo que exhibir mi trabajo.", "Tengo que exibir mi trabajo.", "Tengo que exhivir mi trabajo."), w("¿Qué oración está bien escrita?", "Fue una decisión espontánea.", "Fue una decisión expontánea.", "Fue una decición espontánea."),
  w("¿Qué oración está bien escrita?", "Necesito ayuda con la tarea.", "Nesecito ayuda con la tarea.", "Necesito alluda con la tarea."), w("¿Qué oración está bien escrita?", "Es un excelente ejemplo.", "Es un exelente ejemplo.", "Es un ecselente ejemplo."),
  w("¿Qué oración está bien escrita?", "Deberían prohibir el plástico.", "Deberían proivir el plástico.", "Deberían prohivir el plástico."), w("¿Qué oración está bien escrita?", "Se produjo una explosión.", "Se produjo una explocion.", "Se produjo una esplosión."),
];
const SIGNS: ChoiceItem[] = [
  pt("¿Cómo se corrige el cartel?", "«SE ALQUILA HABITACIONES»", "«SE ALQUILAN HABITACIONES»", "«SE ALQUILAN AVITACIONES»", "«SE ALQUILA HAVITACIONES»"),
  pt("¿Cómo se corrige el cartel?", "«PROIBIDO EL INGRESO A PERSONAS AJENAS»", "«PROHIBIDO EL INGRESO A PERSONAS AJENAS»", "«PROHIVIDO EL INGRESO A PERSONAS AJENAS»", "«PROHIBIDO EL INGRESO A PERSONAS AGENAS»"),
  pt("¿Cómo se corrige el cartel?", "«ATENCION AL PUBLICO DE LUNES A SABADO»", "«ATENCIÓN AL PÚBLICO DE LUNES A SÁBADO»", "«ATENCIÓN AL PUBLICO DE LUNES A SABADO»", "«ATENSIÓN AL PÚBLICO DE LUNES A SÁBADO»"),
  pt("¿Cómo se corrige el cartel?", "«NO HAY VACANTES ASTA NUEVO AVISO»", "«NO HAY VACANTES HASTA NUEVO AVISO»", "«NO AY VACANTES HASTA NUEVO AVISO»", "«NO HAY BACANTES HASTA NUEVO AVISO»"),
  pt("¿Cómo se corrige el cartel?", "«ZONA DE SEGURIDAD EN CASO DE CISMO»", "«ZONA DE SEGURIDAD EN CASO DE SISMO»", "«SONA DE SEGURIDAD EN CASO DE SISMO»", "«ZONA DE SEGURIDÁ EN CASO DE SISMO»"),
  pt("¿Cómo se corrige el cartel?", "«SE REPARAN CELULARES Y COMPUTADORAS AL INSTANTE GARANTISADO»", "«SE REPARAN CELULARES Y COMPUTADORAS AL INSTANTE. GARANTIZADO»", "«SE REPARA CELULARES Y COMPUTADORAS AL INSTANTE GARANTIZADO»", "«SE REPARAN SELULARES Y COMPUTADORAS AL INSTANTE»"),
];
const FIX = "¿Cómo se corrige la oración?";
const EVERYDAY: ChoiceItem[] = [
  pt(FIX, "En base a los resultados, decidimos continuar.", "A partir de los resultados, decidimos continuar.", "En base de los resultados, decidimos continuar con el proyecto que teníamos.", "Basado, decidimos."),
  pt(FIX, "Hicieron una reunión a nivel de padres de familia.", "Hicieron una reunión de padres de familia.", "Hicieron una reunión a nivel de los padres de familia y de los docentes del colegio.", "Hubo reunión."),
  pt(FIX, "Me recuerdo de mi infancia en Jauja.", "Recuerdo mi infancia en Jauja.", "Me recuerdo mi infancia en Jauja, cuando vivía con mis abuelos en el campo.", "Recuerdo."),
  pt(FIX, "Hubieron muchas protestas.", "Hubo muchas protestas.", "Hubieran muchas protestas en la plaza durante todo el día.", "Habieron."),
  pt(FIX, "Pienso de que tienes razón.", "Pienso que tienes razón.", "Pienso de qué tienes razón, aunque no estoy del todo seguro.", "Pienso."),
  pt(FIX, "Contra más estudio, más aprendo.", "Cuanto más estudio, más aprendo.", "Contra más estudio, más aprendo, y por eso estudio todos los días.", "Más aprendo."),
  pt(FIX, "Se los dije a ustedes ayer.", "Se lo dije a ustedes ayer.", "Se los dije a ustedes ayer en la tarde, después de clases.", "Lo dije."),
  pt(FIX, "Detrás mío venía el bus.", "Detrás de mí venía el bus.", "Detrás mío de mí venía el bus lleno de pasajeros.", "Venía."),
];
const REVISE = "¿Qué revisión mejora el texto?";
const REVISIONS: ChoiceItem[] = [
  pt(REVISE, "«La contaminación es mala. Los ríos están sucios. La gente se enferma».", "Conectar causa y efecto: «La contaminación de los ríos enferma a la población».", "Agregar más oraciones cortas, como «El aire también está sucio» y «Los peces mueren».", "Borrar todo."),
  pt(REVISE, "«En mi humilde opinión, que es solo mía, creo personalmente que el plan es bueno».", "Ir al grano: «Considero que el plan es bueno».", "Agregar «y no la de otros» al final, para que quede claro de quién es la opinión.", "Quitar «plan»."),
  pt(REVISE, "«El informe está mostro y los datos están de la pitri mitri».", "Usar un registro formal: «El informe es sólido y los datos, precisos».", "Agregar más jergas juveniles para que el informe sea más cercano y entretenido.", "Dejarlo igual."),
  pt(REVISE, "«El alcalde habló con el ministro y le dijo que su plan fracasaría».", "Aclarar de quién es el plan: «…le dijo: “Su plan fracasará”».", "Agregar la fecha, la hora y el lugar exacto de la reunión entre ambos.", "Quitar «el alcalde»."),
  pt(REVISE, "«Las bicicletas son buenas. Por consiguiente, Lima tiene mucho tráfico».", "Corregir la relación lógica: «Lima tiene mucho tráfico; por eso, conviene usar bicicleta».", "Agregar más datos sobre las marcas de bicicletas más vendidas en Lima.", "Quitar «Lima»."),
];

// --- Investigación ------------------------------------------------------------

const REF = "Referencia: Vargas Llosa, M. (1963). La ciudad y los perros. Seix Barral.";
const UNDERSTAND_REF: ChoiceItem[] = [
  pt("¿Qué tipo de fuente describe la referencia?", REF, "Un libro", "Un artículo de una revista científica", "Una página web"),
  pt("¿Qué tipo de fuente describe la referencia?", "Referencia: Flores, A. (2021). Glaciares y agua en los Andes. Revista Andina de Ciencias, 12(3), 45-60.", "Un artículo de revista", "Un libro completo", "Un video"),
  pt("¿Qué tipo de fuente describe la referencia?", "Referencia: Instituto Nacional de Estadística e Informática. (2018). Resultados definitivos de los Censos Nacionales 2017. INEI.", "Un informe institucional", "Una novela", "Un poema"),
  pt("En la referencia «Revista Andina de Ciencias, 12(3), 45-60», ¿qué indica «45-60»?", "Referencia: Flores, A. (2021). Glaciares y agua en los Andes. Revista Andina de Ciencias, 12(3), 45-60.", "Las páginas del artículo", "El año y el mes de publicación", "El número de autores"),
  pt("¿Quién es el autor de la fuente?", "Referencia: Instituto Nacional de Estadística e Informática. (2018). Resultados definitivos de los Censos Nacionales 2017. INEI.", "Una institución: el INEI", "Una persona llamada Censos Nacionales", "No tiene autor"),
  pt("¿Qué indica «12(3)» en la referencia?", "Referencia: Flores, A. (2021). Glaciares y agua en los Andes. Revista Andina de Ciencias, 12(3), 45-60.", "El volumen 12, número 3 de la revista", "Que el artículo tiene 12 páginas y 3 autores", "La edad"),
];
const WORKS_CITED: ChoiceItem[] = [
  pt("¿Qué parte de la referencia es el año?", REF, "1963", "Seix Barral", "M."), pt("¿Qué parte de la referencia es la editorial?", REF, "Seix Barral", "1963", "La ciudad y los perros"),
  pt("¿Qué parte de la referencia es el apellido del autor?", REF, "Vargas Llosa", "Seix Barral, la editorial", "M."), pt("¿Qué parte de la referencia es el título?", REF, "La ciudad y los perros", "Vargas Llosa, M. (1963)", "Seix Barral"),
  w("¿Qué referencia web está bien escrita en formato APA?", "Ramírez, L. (2023, 2 de marzo). La sequía en el sur. Diario del Sur. https://diariodelsur.pe/sequia", "La sequía en el sur. Escrito por Luisa Ramírez. Publicado en el Diario del Sur el 2 de marzo de 2023. Disponible en internet.", "https://diariodelsur.pe/sequia"), w("En APA, ¿qué va en cursiva en la referencia de un artículo de revista?", "El nombre de la revista y el volumen", "El título del artículo y el nombre completo del autor", "El nombre del autor"),
];
const IN_TEXT: ChoiceItem[] = [
  w("¿Qué cita textual está bien hecha en formato APA?", "Según Ríos (2019), «la memoria es una forma de justicia» (p. 23).", "Según Ríos, la memoria es una forma de justicia.", "«La memoria es una forma de justicia» (Carlos, 2019)."),
  w("¿Qué cita parafraseada está bien hecha en formato APA?", "La anemia reduce la capacidad de atención de los niños (Torres y Díaz, 2020).", "La anemia reduce la capacidad de atención de los niños (2020, Torres y Díaz, p.).", "La anemia reduce la atención, dicen."),
  w("¿Cómo se cita en APA una obra de tres o más autores?", "(Huamán et al., 2022)", "(Huamán, Pérez, Ruiz y todos los demás autores, 2022)", "(et al., 2022)"),
  w("¿Cómo se cita a una institución con sigla la primera vez?", "(Comisión de la Verdad y Reconciliación [CVR], 2003)", "(La comisión, 2003)", "(CVR)"),
  w("¿Qué se hace con una cita textual de más de 40 palabras en APA?", "Se escribe en un bloque aparte, con sangría y sin comillas", "Se escribe entre comillas dobles y en negrita", "Se omite"),
  w("¿Qué indica «s. f.» en una cita APA?", "Que la fuente no tiene fecha", "Que la fuente es de un sitio falso", "Que no tiene autor"),
];
const PLAG = sorter(["Es plagio", "No es plagio"], "¿Es plagio?");
const PLAGIARISM: ChoiceItem[] = [
  ...["Copiar un ensayo de internet y cambiarle el título.", "Pedirle a una inteligencia artificial que escriba el trabajo y presentarlo como propio.", "Parafrasear las ideas de un autor sin citarlo.", "Usar una foto ajena en tu presentación sin indicar la fuente."].map((x) => PLAG(x, 0)),
  ...["Citar entre comillas las palabras de un autor con su apellido, año y página.", "Parafrasear una idea e incluir la referencia.", "Presentar tus propias conclusiones a partir de varias fuentes citadas.", "Usar datos del INEI indicando la fuente y el año."].map((x) => PLAG(x, 1)),
];

export const ROWS: Row[] = [
  ["organizar-1", (r) => order(r, "Ordena los temas del más amplio al más específico.", BROAD_NARROW)],
  ["organizar-2", (r) => choose(r, "", BY_TOPIC)],

  ["organizar-3", (r) => choose(r, "", TOPIC_SENTENCE)],
  ["organizar-4", (r) => choose(r, "", THESES)],

  ["evidencias-1", (r) => choose(r, "", FACT_OPINION)],
  ["evidencias-2", (r) => choose(r, "", STRONG_WEAK)],
  ["evidencias-3", (r) => choose(r, "", EVIDENCE)],
  ["evidencias-4", (r) => choose(r, "", IN_TEXT_EVIDENCE)],
  ["analisis-1", (r) => choose(r, "", COUNTERCLAIMS)],
  ["analisis-2", (r) => choose(r, "", ANALYSES)],
  ["analisis-3", (r) => choose(r, "", TRANSITIONS)],
  ["falacias", (r) => choose(r, "", FALLACIES)],

  ["persuasion-1", (r) => choose(r, "", APPEALS)],
  ["persuasion-2", (r) => choose(r, "", USE_APPEAL)],

  ["personificacion", (r) => choose(r, "", PERSONIFICATION)],

  ["claridad-1", (r) => choose(r, "Completa con el mejor conector.", CONJ_ADV)],
  ["claridad-2", (r) => choose(r, "", COMPARISONS)],
  ["claridad-3", (r) => choose(r, "", PARALLEL_ID)],
  ["claridad-4", (r) => choose(r, "", PARALLEL)],
  ["claridad-5", (r) => choose(r, "", REDUNDANCY)],

  ["voz-pasiva-1", (r) => choose(r, "", IDENTIFY_VOICE)],
  ["voz-pasiva-2", (r) => choose(r, "", TO_ACTIVE)],

  ["diacritica-1", (r) => choose(r, "Completa la oración.", CONFUSED_USE)],
  ["diacritica-2", (r) => choose(r, "", CONFUSED_FIX)],
  ["mal-escritas-1", (r) => choose(r, "", PRON_CONTR)],
  ["mal-escritas-2", (r) => choose(r, "", MISSPELLED)],
  ["corregir-1", (r) => choose(r, "", SIGNS)],
  ["corregir-2", (r) => choose(r, "", EVERYDAY)],
  ["corregir-3", (r) => choose(r, "", REVISIONS)],

  ["apa-1", (r) => choose(r, "", UNDERSTAND_REF)],
  ["apa-2", (r) => choose(r, "", WORKS_CITED)],
  ["apa-3", (r) => choose(r, "", IN_TEXT)],
  ["apa-4", (r) => choose(r, "", PLAGIARISM)],
];
