import { choose, order, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import { f, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Secundaria · banco de escritura: organizar las ideas, oraciones
// temáticas y tesis, evidencias y su análisis, contraargumentos, conectores
// argumentativos, falacias, apelaciones al ethos, al pathos y al logos,
// personificación, conectores (en consecuencia, no obstante, de hecho),
// comparaciones bien hechas, paralelismo, redundancias, voz activa y pasiva,
// revisión (palabras que se confunden, tilde diacrítica, errores frecuentes)
// y referencias y citas en formato APA.

// --- Organizar ---------------------------------------------------------------

const BROAD: OrderItem[] = [
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Literatura", "Literatura peruana", "Novela indigenista", "«El mundo es ancho y ajeno»"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Ciencias naturales", "Biología", "Ecología", "Los manglares de Tumbes"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Historia", "Historia del Perú", "La independencia", "La batalla de Ayacucho"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Deportes", "Deportes de equipo", "Vóley", "La selección peruana de vóley femenino"] },
  { p: "Ordena los temas del más amplio al más específico.", seq: ["Economía", "Agricultura", "Agroexportación", "La exportación de arándanos"] },
];
const BY_TOPIC = sorter(["Causas", "Consecuencias", "Soluciones"], "En un ensayo sobre la contaminación del río Rímac, ¿en qué apartado va esta idea?");
const TOPIC_ITEMS: ChoiceItem[] = [
  BY_TOPIC("Las fábricas vierten residuos sin tratar.", 0),
  BY_TOPIC("Muchas familias arrojan basura en las riberas.", 0),
  BY_TOPIC("El agua para Lima requiere un tratamiento más costoso.", 1),
  BY_TOPIC("Los peces y las aves han desaparecido de varios tramos.", 1),
  BY_TOPIC("Multar a las industrias que contaminen.", 2),
  BY_TOPIC("Organizar campañas de limpieza con los vecinos.", 2),
];

// --- Oración temática y tesis -------------------------------------------------

const TOPIC_SENTENCE: ChoiceItem[] = [
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. En el Perú se hablan más de cuarenta lenguas originarias. El quechua y el aimara tienen millones de hablantes, y en la Amazonía conviven decenas de lenguas de distintas familias.»", "El Perú es un país de gran diversidad lingüística.", "El quechua se habla en la sierra.", "Muchas lenguas amazónicas están en peligro de desaparecer por la migración a las ciudades."),
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. Los alumnos que desayunan rinden más en clase. Además, se concentran mejor y faltan menos por enfermedad.»", "Desayunar bien mejora el desempeño escolar.", "Hay alumnos que faltan.", "El desayuno debe tener frutas, pan, leche, huevo y avena, preparados en casa."),
  pt("¿Qué oración temática recoge mejor la idea principal del párrafo?", "«___. Machu Picchu recibe miles de visitantes al día, que generan basura y desgastan los caminos. Por eso se limitaron los ingresos y se crearon circuitos fijos.»", "El turismo masivo obliga a proteger Machu Picchu.", "Machu Picchu es muy bonito.", "Los turistas extranjeros prefieren viajar en tren desde Cusco."),
];
const THESIS = sorter(["Es una tesis", "No es una tesis"], "¿La oración es una tesis (una afirmación que se puede defender)?");
const THESIS_ITEMS: ChoiceItem[] = [
  THESIS("Los colegios deberían enseñar educación financiera desde primero de secundaria.", 0),
  THESIS("El Perú tiene 25 regiones.", 1),
  THESIS("El voto obligatorio debería eliminarse.", 0),
  THESIS("La marinera se baila con pañuelo.", 1),
  THESIS("Las redes sociales hacen más daño que bien a los adolescentes.", 0),
  THESIS("¿Qué es la anemia?", 1),
  THESIS("El Estado debería priorizar los trenes sobre las carreteras.", 0),
  THESIS("Lima fue fundada en 1535.", 1),
];

// --- Evidencias y análisis ---------------------------------------------------

const FACT = sorter(["Hecho", "Opinión"], "¿Es un hecho o una opinión?");
const FACT_ITEMS: ChoiceItem[] = [
  FACT("El río Amazonas nace en los Andes del Perú.", 0),
  FACT("La selva es el lugar más bonito para vivir.", 1),
  FACT("La Constitución vigente se aprobó en 1993.", 0),
  FACT("Las leyes actuales son pésimas.", 1),
  FACT("El ceviche fue declarado Patrimonio Cultural de la Nación.", 0),
  FACT("El ceviche de Lima es mejor que el del norte.", 1),
];
const STRONG: ChoiceItem[] = [
  w("Afirmación: «El reciclaje en el colegio ha funcionado». ¿Qué evidencia es más sólida?", "En seis meses se reunieron 800 kilos de plástico, según el registro del comité.", "Mi amiga dice que ahora todos reciclan.", "Mi amiga dice que ahora todos reciclan y que el patio se ve mucho más limpio que antes."),
  w("Afirmación: «El taller de lectura mejoró la comprensión». ¿Qué evidencia es más sólida?", "El puntaje promedio en la prueba de comprensión subió de 11 a 15.", "A los alumnos les gustó mucho el taller.", "Varios alumnos dijeron en el recreo que ahora entienden mejor lo que leen en clase."),
  w("Afirmación: «El tránsito en la avenida ha empeorado». ¿Qué evidencia es más sólida?", "Un conteo municipal muestra que el tiempo de viaje aumentó un 30 %.", "En las redes sociales todos dicen que el tráfico está peor que nunca este año.", "Ayer me demoré mucho, aunque salí tarde de casa."),
  w("Afirmación: «La anemia ha bajado en la región». ¿Qué evidencia es más sólida?", "La encuesta oficial de salud registra cinco puntos menos que hace dos años.", "Los niños se ven más sanos.", "Un vecino que trabaja en la posta dice que ya no ve tantos niños con anemia como antes."),
];
const WEAK = sorter(["Sólida", "Débil"], "¿Es una evidencia sólida o débil para apoyar una afirmación?");
const WEAK_ITEMS: ChoiceItem[] = [
  WEAK("Un estudio de la universidad con 2000 participantes", 0),
  WEAK("Un comentario en una red social sin autor", 1),
  WEAK("Datos del INEI de este año", 0),
  WEAK("Lo que me contó mi primo", 1),
  WEAK("Un informe de la Defensoría del Pueblo", 0),
  WEAK("Una frase célebre sin fuente", 1),
];
const ANALYSIS: ChoiceItem[] = [
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: los huertos escolares mejoran la alimentación. Evidencia: en los colegios con huerto, el consumo de verduras subió un 40 %.", "Cultivar sus propias verduras hace que los alumnos las coman más, lo que mejora su dieta.", "Los huertos escolares necesitan agua todos los días y alguien que los cuide en vacaciones.", "Las verduras se venden en el mercado."),
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: las ciclovías reducen accidentes. Evidencia: en las avenidas con ciclovía, los atropellos a ciclistas bajaron a la mitad.", "Separar a ciclistas de autos disminuye el riesgo de choques.", "Muchas personas no saben montar bicicleta en Lima y por eso prefieren el bus.", "Muchas personas no saben montar bicicleta en Lima."),
  pt("¿Qué análisis conecta mejor la evidencia con la afirmación?", "Afirmación: leer en voz alta ayuda a los niños pequeños. Evidencia: los niños a quienes les leen a diario conocen más palabras al entrar a primaria.", "Escuchar textos a diario amplía el vocabulario antes de aprender a leer.", "Los libros infantiles son caros y no todas las familias pueden comprarlos.", "A los niños les gustan los cuentos."),
];
const COUNTER: ChoiceItem[] = [
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: el colegio debería tener jornada de 8 a 3. Contraargumento: los alumnos estarían muy cansados.", "Con recreos y almuerzo bien organizados, el cansancio se reduce, como muestran los colegios de jornada completa.", "Los que se cansan deberían dormir más temprano y no quejarse, porque estudiar más horas siempre es mejor para todos.", "Los que se cansan deberían dormir más y no quejarse."),
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: se debería prohibir el plástico de un solo uso. Contraargumento: los comerciantes perderían dinero.", "Existen alternativas de bajo costo y, con un plazo de transición, los comerciantes pueden adaptarse.", "Los comerciantes siempre se quejan de todo y no hay que tomar en cuenta lo que dicen, porque solo piensan en ganar.", "Los comerciantes siempre se quejan de todo."),
  pt("¿Qué respuesta al contraargumento es más sólida?", "Tesis: los celulares deben guardarse en clase. Contraargumento: sirven para investigar.", "Pueden usarse cuando el docente lo indique, sin estar disponibles todo el tiempo.", "Los celulares son malos.", "Los celulares son malos para la vista y por eso nunca deberían entrar al colegio, ni siquiera en el recreo."),
];
const TRANSITIONS: ChoiceItem[] = [
  f("Elige el conector: «Los resultados mejoraron; ___, todavía hay alumnos con notas bajas.»", "no obstante", "por lo tanto", "es decir"),
  f("Elige el conector: «La evidencia es clara. ___, la medida debe ampliarse a todos los colegios.»", "En consecuencia", "Sin embargo", "Por otra parte"),
  f("Elige el conector: «Algunos dirán que es costoso. ___, el ahorro a largo plazo es mayor que la inversión.»", "De hecho", "Además", "Por ejemplo"),
  f("Elige el conector: «Las lluvias destruyeron puentes; ___, muchas comunidades quedaron aisladas.»", "por consiguiente", "a pesar de ello", "en cambio"),
  f("Elige el conector: «El agua escasea en la costa. ___, en Ica se extrae más agua subterránea de la que se recarga.»", "Por ejemplo", "No obstante", "En conclusión"),
];
const FALLACIES = ["Ataque a la persona", "Falsa disyuntiva", "Generalización apresurada", "Apelación a la mayoría", "Pendiente resbaladiza"];
const fal = sorter(FALLACIES, "¿Qué falacia hay en el argumento?");
const FALLACY_ITEMS: ChoiceItem[] = [
  fal("No le hagas caso a su propuesta: ni siquiera terminó la universidad.", 0),
  fal("¿Cómo va a hablar de ecología si viaja en auto?", 0),
  fal("O apruebas el proyecto o estás contra el progreso.", 1),
  fal("Si no estás con nosotros, estás con ellos.", 1),
  fal("Dos taxistas me robaron; todos los taxistas son ladrones.", 2),
  fal("Probé un libro de ciencia ficción y no me gustó: el género es aburrido.", 2),
  fal("Todos mis amigos lo usan, así que debe ser bueno.", 3),
  fal("Es el programa más visto del país; por eso es el mejor.", 3),
  fal("Si dejamos que usen el celular en el recreo, luego lo usarán en clase y al final nadie estudiará.", 4),
  fal("Si suben el pasaje un sol, pronto costará veinte y nadie podrá viajar.", 4),
];

// --- Persuasión ------------------------------------------------------------------

const APPEAL = sorter(["Ethos", "Pathos", "Logos"], "¿A qué apela este anuncio?");
const APPEAL_ITEMS: ChoiceItem[] = [
  APPEAL("«Recomendado por el Colegio Médico del Perú.»", 0),
  APPEAL("«Con más de 40 años de experiencia en el mercado.»", 0),
  APPEAL("«Imagina la sonrisa de tus hijos al abrir su regalo.»", 1),
  APPEAL("«No dejes que tu familia pase frío este invierno.»", 1),
  APPEAL("«Ahorra hasta 30 % de luz con estos focos LED.»", 2),
  APPEAL("«Dura el doble que la marca líder, según pruebas de laboratorio.»", 2),
];
const USE_APPEAL: ChoiceItem[] = [
  w("Quieres convencer a la directora de crear una biblioteca de aula usando el logos. ¿Qué oración usarías?", "Según el registro del colegio, los alumnos con acceso a libros en el aula leen el doble.", "Imagine la alegría de los niños cuando abran sus libros nuevos y descubran historias que nunca habían leído.", "Como delegado elegido por todos, sé lo que necesita el salón."),
  w("Quieres convencer a tus vecinos de reciclar usando el pathos. ¿Qué oración usarías?", "Piensa en el río limpio que podríamos dejarles a nuestros nietos.", "Según la municipalidad, cada tonelada de papel reciclado ahorra diecisiete árboles adultos.", "La municipalidad respalda esta campaña desde 2020."),
  w("Quieres convencer al comité de un paseo al Colca usando el ethos. ¿Qué oración usarías?", "Como guía oficial de turismo con diez años de experiencia, garantizo una ruta segura.", "El paseo cuesta 20 soles menos que el del año pasado.", "¡Imaginen ver volar al cóndor sobre el cañón mientras el sol aparece entre los nevados!"),
];

// --- Estilo y claridad -------------------------------------------------------------

const PERSONIFICATION: ChoiceItem[] = [
  f("¿Qué oración usa personificación?", "El viento susurraba secretos entre los eucaliptos.", "El viento soplaba fuerte entre los eucaliptos.", "Había muchos eucaliptos en el cerro."),
  f("¿Qué oración usa personificación?", "La ciudad despertó bostezando bajo la garúa.", "La ciudad amaneció con garúa.", "En la ciudad había neblina y una garúa muy fina desde temprano."),
  f("¿Qué oración usa personificación?", "El río se quejaba al chocar contra las piedras.", "El río bajaba con mucha agua, piedras y troncos.", "El río bajaba con piedras y troncos."),
  f("¿Qué oración usa personificación?", "Las estrellas nos miraban desde el cielo de Puno.", "Había muchas estrellas en el cielo de Puno.", "El cielo de Puno es despejado."),
];
const COMPARISON: ChoiceItem[] = [
  f("¿Qué oración tiene una comparación correcta?", "Este año la cosecha fue mejor que la del año pasado.", "Este año la cosecha fue más mejor que la del año pasado.", "Este año la cosecha fue más mejor que el año pasado."),
  f("¿Qué oración tiene una comparación correcta?", "El clima de Arequipa es más seco que el de Tarapoto.", "El clima de Arequipa es más seco que Tarapoto.", "Arequipa es más seco que el clima de Tarapoto."),
  f("¿Qué oración tiene una comparación correcta?", "Mi hermano es mayor que yo.", "Mi hermano es más mayor que yo.", "Mi hermano es más grande de edad que mí."),
  f("¿Qué oración tiene una comparación correcta?", "Su propuesta es superior a la nuestra.", "Su propuesta es más superior que la nuestra.", "Su propuesta es superior que la nuestra."),
];
const PARALLEL: ChoiceItem[] = [
  f("¿Qué oración tiene estructura paralela?", "Me gusta leer, nadar y bailar.", "Me gusta leer, la natación y bailar.", "Me gusta leer, nadando y el baile."),
  f("¿Qué oración tiene estructura paralela?", "El proyecto busca reducir la basura, ahorrar agua y plantar árboles.", "El proyecto busca reducir la basura, el ahorro de agua y que se planten árboles.", "El proyecto busca la reducción de basura, ahorrar agua y plantando árboles."),
  f("¿Qué oración tiene estructura paralela?", "Llegó, vio y venció.", "Llegó, viendo y la victoria.", "Llegó, ver y venció."),
  f("¿Qué oración tiene estructura paralela?", "Prefiero estudiar de día a trasnocharme.", "Prefiero estudiar de día a la trasnochada.", "Prefiero el estudio de día a trasnocharme."),
];
const REDUNDANT: ChoiceItem[] = [
  f("¿Qué versión elimina la redundancia?", "Salió a mirar.", "Salió afuera a mirar.", "Salió fuera, hacia afuera, a mirar."),
  f("¿Qué versión elimina la redundancia?", "Es un hecho que todos conocen.", "Es un hecho real y verídico que todos conocen.", "Es un hecho real, verdadero y verídico que todos conocen."),
  f("¿Qué versión elimina la redundancia?", "Repitió la explicación.", "Volvió a repetir la explicación.", "Repitió de nuevo otra vez la explicación."),
  f("¿Qué versión elimina la redundancia?", "Los hermanos son gemelos.", "Los dos hermanos son gemelos.", "Los dos hermanos son gemelos idénticos e iguales."),
  f("¿Qué versión elimina la redundancia?", "El alcalde dio un resumen.", "El alcalde dio un breve resumen corto.", "El alcalde dio un resumen breve y resumido."),
];

const VOICE = sorter(["Voz activa", "Voz pasiva", "Pasiva refleja"], "¿En qué voz está la oración?");
const VOICE_ITEMS: ChoiceItem[] = [
  VOICE("Los vecinos limpiaron la playa.", 0),
  VOICE("La playa fue limpiada por los vecinos.", 1),
  VOICE("Se limpió la playa el domingo.", 2),
  VOICE("El Congreso aprobó la ley.", 0),
  VOICE("La ley fue aprobada por el Congreso.", 1),
  VOICE("Se aprobaron dos leyes nuevas.", 2),
];
const ACTIVE: ChoiceItem[] = [
  pt("Reescribe en voz activa.", "«El puente fue inaugurado por el alcalde.»", "El alcalde inauguró el puente.", "El puente inauguró al alcalde.", "Se inauguró el puente."),
  pt("Reescribe en voz activa.", "«Los resultados fueron publicados por el ministerio.»", "El ministerio publicó los resultados.", "Los resultados publicaron al ministerio.", "Fueron publicados."),
  pt("Reescribe en voz activa.", "«La novela fue escrita por Ciro Alegría.»", "Ciro Alegría escribió la novela.", "La novela escribió Ciro Alegría.", "Se escribió la novela."),
];

// --- Revisión --------------------------------------------------------------------------

const CONFUSED: ChoiceItem[] = [
  f("Completa: «No sé ___ llegó tarde.»", "por qué", "porque", "porqué"),
  f("Completa: «Llegó tarde ___ perdió el bus.»", "porque", "por qué", "porqué"),
  f("Completa: «No quiero agua, ___ jugo.»", "sino", "si no", "sino que"),
  f("Completa: «___ estudias, no aprobarás.»", "Si no", "Sino", "Si nó"),
  f("Completa: «Vamos ___ qué pasó en la plaza.»", "a ver", "haber", "aver"),
  f("Completa: «Debe ___ un error en la cuenta.»", "haber", "a ver", "aver"),
  f("Completa: «___ muchos alumnos en el patio.»", "Hay", "Ahí", "Ay"),
  f("Completa: «El libro está ___, sobre la mesa.»", "ahí", "hay", "ay"),
];
const DIACRITIC: ChoiceItem[] = [
  f("¿Qué oración tiene bien la tilde?", "Él trajo el libro.", "El trajo él libro.", "Él trajo él libro."),
  f("¿Qué oración tiene bien la tilde?", "Tú sabes que tu casa está lejos.", "Tu sabes que tú casa está lejos.", "Tú sabes que tú casa está lejos."),
  f("¿Qué oración tiene bien la tilde?", "A mí me gusta mi barrio.", "A mi me gusta mí barrio.", "A mí me gusta mí barrio."),
  f("¿Qué oración tiene bien la tilde?", "No sé si se fue.", "No se si sé fue.", "No sé si sé fue."),
  f("¿Qué oración tiene bien la tilde?", "¿Qué dijo? Dijo que vendría.", "¿Que dijo? Dijo qué vendría.", "¿Qué dijo? Dijo qué vendría."),
  f("¿Qué oración tiene bien la tilde?", "Quiero más té, mas no tanto azúcar.", "Quiero mas te, más no tanto azúcar.", "Quiero más te, mas no tanto azúcar."),
];
const MISSPELLED: ChoiceItem[] = [
  f("¿Qué palabra está bien escrita?", "exhausto", "exausto", "eshausto"),
  f("¿Qué palabra está bien escrita?", "excepción", "exepción", "excepsión"),
  f("¿Qué palabra está bien escrita?", "dirección", "direción", "direcsión"),
  f("¿Qué palabra está bien escrita?", "absorber", "absorver", "aborver"),
  f("¿Qué palabra está bien escrita?", "transcurrir", "transcurir", "tanscurrir"),
  f("¿Qué palabra está bien escrita?", "adolescente", "adolecente", "adolesente"),
  f("¿Qué palabra está bien escrita?", "convalecencia", "convalescencia", "convalesencia"),
  f("¿Qué palabra está bien escrita?", "espontáneo", "expontáneo", "espontanio"),
];
const SIGNS: ChoiceItem[] = [
  pt("¿Cómo debe corregirse el cartel?", "«SE BENDE TERRENO»", "SE VENDE TERRENO", "SE VENDE TERRENO.", "SE BENDE TERRENO."),
  pt("¿Cómo debe corregirse el cartel?", "«PROIVIDO ESTACIONAR»", "PROHIBIDO ESTACIONAR", "PROIBIDO ESTACIONAR", "PROHIVIDO ESTACIONAR"),
  pt("¿Cómo debe corregirse el cartel?", "«ACEPTAMOS TARGETAS»", "ACEPTAMOS TARJETAS", "ASEPTAMOS TARJETAS", "ACEPTAMOS TARJETAS DE CREDITO"),
  pt("¿Cómo debe corregirse el cartel?", "«HAY CEVICHE Y CHICHARRON»", "HAY CEVICHE Y CHICHARRÓN", "AY CEVICHE Y CHICHARRÓN", "HAY CEVICHE Y CHICHARON"),
];
const EVERYDAY: ChoiceItem[] = [
  f("¿Qué oración es correcta?", "Hubo muchos problemas.", "Hubieron muchos problemas.", "Habían muchos problemas."),
  f("¿Qué oración es correcta?", "Ojalá que haya clases.", "Ojalá que haiga clases.", "Ojalá que hayga clases."),
  f("¿Qué oración es correcta?", "Me dijo que vendría.", "Me dijo de que vendría.", "Me dijo de qué vendría."),
  f("¿Qué oración es correcta?", "¿Viniste ayer?", "¿Vinistes ayer?", "¿Vinistes ayer temprano?"),
  f("¿Qué oración es correcta?", "Estoy seguro de que aprobaré.", "Estoy seguro que aprobaré.", "Estoy seguro de qué aprobaré."),
  f("¿Qué oración es correcta?", "Somos varios los que pensamos así.", "Habemos varios que pensamos así.", "Habemos varios los que pensamos así."),
];
const REVISE: ChoiceItem[] = [
  pt("¿Qué revisión mejora el texto?", "«El informe es bueno. El informe tiene datos. El informe tiene gráficos.»", "El informe es bueno: tiene datos y gráficos.", "El informe es bueno, el informe tiene datos, el informe tiene gráficos.", "Informe bueno datos gráficos."),
  pt("¿Qué revisión mejora el texto?", "«Fuimos al Colca y estaba bonito y vimos cóndores y había mucho frío y volvimos.»", "Fuimos al Colca: el paisaje era hermoso, vimos cóndores y, aunque hacía frío, la pasamos muy bien.", "Fuimos al Colca. Estaba bonito. Vimos. Frío. Volvimos.", "Fuimos al Colca y estaba bonito y vimos cóndores y había mucho frío y volvimos y la pasamos bien y nos gustó mucho."),
  pt("¿Qué revisión mejora el texto?", "«En mi opinión personal, yo creo que deberíamos reciclar.»", "Creo que deberíamos reciclar.", "En mi opinión personal propia, yo creo que deberíamos reciclar.", "Yo, en mi opinión, yo creo que deberíamos reciclar."),
];

// --- Investigación: APA y plagio -----------------------------------------------------

const APA_READ: ChoiceItem[] = [
  pt("¿Qué indica el dato «(2019)» en la referencia?", "Rostworowski, M. (2019). Historia del Tahuantinsuyu. Instituto de Estudios Peruanos.", "El año de publicación", "El número de páginas", "La edición del libro"),
  pt("¿Quién es la autora de la obra?", "Rostworowski, M. (2019). Historia del Tahuantinsuyu. Instituto de Estudios Peruanos.", "María Rostworowski", "El Instituto de Estudios Peruanos", "Tahuantinsuyu"),
  pt("¿Qué parte de la referencia es la editorial?", "Basadre, J. (2014). Historia de la República del Perú. Editorial Universitaria.", "Editorial Universitaria", "Historia de la República del Perú", "(2014)"),
  pt("¿Qué tipo de fuente es?", "Quispe, R. (2023, 5 de marzo). El agua en la sierra. La República. https://larepublica.pe/agua", "Un artículo de periódico en línea", "Un libro impreso de una editorial peruana", "Una entrevista grabada"),
];
const APA_PARTS: ChoiceItem[] = [
  w("En formato APA, ¿qué va primero en la referencia de un libro?", "El apellido del autor y la inicial del nombre", "El título del libro", "El título completo del libro en cursiva"),
  w("En formato APA, ¿cómo se escribe el título de un libro?", "En cursiva y con mayúscula solo al inicio y en nombres propios", "Entre comillas y en mayúsculas", "Entre comillas angulares y con mayúscula en cada palabra importante"),
  w("En formato APA, ¿dónde va el año?", "Entre paréntesis, después del autor", "Al final, después de la editorial", "Antes del autor"),
  w("En formato APA, ¿qué se agrega al final de una fuente de internet?", "La dirección web (URL)", "El número de teléfono", "El precio"),
];
const APA_CITE: ChoiceItem[] = [
  f("¿Qué cita en el texto sigue el formato APA?", "Según Rostworowski (2019), los incas organizaban el trabajo por turnos.", "Según Rostworowski, en su libro de 2019, en la página 45...", "Según el libro «Historia del Tahuantinsuyu», publicado en Lima, los incas organizaban el trabajo..."),
  f("¿Qué cita en el texto sigue el formato APA?", "La anemia afecta al 43 % de los niños (INEI, 2023).", "La anemia afecta al 43 % de los niños [INEI 2023].", "La anemia afecta al 43 % de los niños, según internet."),
  f("¿Qué cita textual breve sigue el formato APA?", "Basadre (2014) afirma que «el Perú es también una posibilidad» (p. 12).", "Basadre afirma: el Perú es también una posibilidad, 2014, página 12.", "«El Perú es también una posibilidad» (Basadre)."),
];
const PLAGIARISM: ChoiceItem[] = [
  pt("¿Es plagio?", "Copias un párrafo de una web y lo pegas en tu trabajo sin comillas ni fuente.", "Sí, porque presentas ideas ajenas como propias.", "No, porque lo que está publicado en internet es de todos y se puede usar libremente.", "No, si cambias el tipo de letra."),
  pt("¿Es plagio?", "Resumes con tus palabras la idea de un libro y anotas el autor y el año.", "No, porque reconoces la fuente.", "Sí, porque usaste una idea ajena.", "Sí, porque no copiaste textual."),
  pt("¿Es plagio?", "Cambias algunas palabras de un artículo, pero mantienes su estructura y no lo citas.", "Sí, porque sigue siendo el trabajo de otro sin reconocerlo.", "No, porque cambiaste palabras.", "No, porque al cambiar las palabras el texto pasa a ser una creación tuya y original."),
  pt("¿Es plagio?", "Copias una frase entre comillas y escribes el autor, el año y la página.", "No, porque es una cita correcta.", "Sí, porque copiaste.", "Sí, si la frase es muy larga."),
];

export const ROWS: Row[] = [
  ["organizar-1", (r) => order(r, "", BROAD)],
  ["organizar-2", (r) => choose(r, "", TOPIC_ITEMS)],
  ["tematica-tesis-1", (r) => choose(r, "", TOPIC_SENTENCE)],
  ["tematica-tesis-2", (r) => choose(r, "", THESIS_ITEMS)],
  ["evidencias-1", (r) => choose(r, "", FACT_ITEMS)],
  ["evidencias-2", (r) => choose(r, "", STRONG)],
  ["evidencias-3", (r) => choose(r, "", WEAK_ITEMS)],
  ["analisis-1", (r) => choose(r, "", ANALYSIS)],
  ["analisis-2", (r) => choose(r, "", COUNTER)],
  ["analisis-3", (r) => choose(r, "", TRANSITIONS)],
  ["falacias", (r) => choose(r, "", FALLACY_ITEMS)],
  ["persuasion-1", (r) => choose(r, "", APPEAL_ITEMS)],
  ["persuasion-2", (r) => choose(r, "", USE_APPEAL)],
  ["estilo-1", (r) => choose(r, "", PERSONIFICATION)],
  ["estilo-2", (r) => choose(r, "", COMPARISON)],
  ["claridad-1", (r) => choose(r, "", PARALLEL)],
  ["claridad-2", (r) => choose(r, "", REDUNDANT)],
  ["voz-1", (r) => choose(r, "", VOICE_ITEMS)],
  ["voz-2", (r) => choose(r, "", ACTIVE)],
  ["revision-1", (r) => choose(r, "", CONFUSED)],
  ["revision-2", (r) => choose(r, "", DIACRITIC)],
  ["revision-3", (r) => choose(r, "", MISSPELLED)],
  ["revision-4", (r) => choose(r, "", SIGNS)],
  ["revision-5", (r) => choose(r, "", EVERYDAY)],
  ["revision-6", (r) => choose(r, "", REVISE)],
  ["apa-1", (r) => choose(r, "", APA_READ)],
  ["apa-2", (r) => choose(r, "", APA_PARTS)],
  ["apa-3", (r) => choose(r, "", APA_CITE)],
  ["apa-4", (r) => choose(r, "", PLAGIARISM)],
];
