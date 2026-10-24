import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de lectura (IXL 9th grade ELA: A-I). Lecturas propias, con temas
// e historias del Perú. Los ítems «New!» de IXL (A.2 y C.2) se numeran en su
// lugar; «Analyze poetry» figura como «Coming soon» y se omite.

export const SECTIONS: Section[] = [
  { id: "A", name: "Idea principal", icon: "💡" },
  { id: "B", name: "Tema", icon: "🧭" },
  { id: "C", name: "Propósito y perspectiva del autor", icon: "✍️" },
  { id: "D", name: "Tono", icon: "🎚️" },
  { id: "E", name: "Recursos literarios", icon: "✨" },
  { id: "F", name: "Lectura atenta: textos literarios", icon: "📖" },
  { id: "G", name: "Lectura atenta: textos informativos", icon: "🔬" },
  { id: "H", name: "Analizar literatura", icon: "📚" },
  { id: "I", name: "Analizar poesía", icon: "🎶" },
];

// --- A. Idea principal -------------------------------------------------------

const MAIN_PASSAGES = [
  read("La economía informal", "🛒", "Siete de cada diez trabajadores peruanos laboran en la informalidad: venden en la calle, manejan mototaxis o trabajan en talleres sin contrato. La informalidad ofrece una salida rápida a quienes no encuentran empleo formal, y muchas veces es la única. Pero tiene un costo alto: estos trabajadores no tienen seguro de salud ni aportan para una pensión, y el Estado recauda menos impuestos para servicios públicos. Reducirla no pasa solo por fiscalizar, sino por hacer que formalizarse sea más simple y barato que no hacerlo.",
    ["¿Cuál es la idea principal del texto?", "La informalidad es una salida para muchos, pero tiene costos que solo se reducirán facilitando la formalización.", "En el Perú hay muchos mototaxis y talleres que funcionan sin contrato en las calles de las ciudades.", "La informalidad es mala."],
    ["¿Qué detalle apoya la idea de que la informalidad tiene un costo alto?", "Los trabajadores no tienen seguro de salud ni pensión.", "Siete de cada diez trabajadores son informales.", "Muchos venden en la calle o manejan mototaxis en distintas ciudades del país."],
    ["¿Qué propone el autor en la última oración?", "Simplificar y abaratar la formalización", "Prohibir el comercio ambulatorio en todas las ciudades del país", "Nada"]),
  read("La memoria del agua", "🌊", "En 2017, el Niño costero inundó barrios enteros de Piura y Trujillo. Muchos de ellos se habían construido sobre quebradas secas que, durante décadas, no habían llevado agua. Los geólogos lo advirtieron: el río tiene memoria, y tarde o temprano vuelve por su cauce. La tragedia no fue solo natural, sino también el resultado de una planificación urbana que olvidó la historia del territorio. Reconstruir en el mismo lugar, como ocurrió en varios casos, es apostar a que el agua no regresará.",
    ["¿Cuál es la idea principal del texto?", "Los daños del Niño costero se debieron también a construir sin respetar la historia del territorio.", "En 2017 llovió mucho en Piura y en Trujillo y se inundaron muchos barrios.", "El agua tiene memoria."],
    ["¿Qué significa «el río tiene memoria»?", "Que el agua vuelve a correr por sus antiguos cauces", "Que los ríos recuerdan a las personas que viven cerca de ellos", "Que el río es antiguo"],
    ["¿Qué crítica plantea la última oración?", "Que reconstruir en el mismo lugar repite el riesgo", "Que la reconstrucción fue demasiado lenta y costosa para el Estado", "Ninguna"]),
];
const MULTI_MAIN = [
  read("Mariátegui y su tiempo", "📕", "José Carlos Mariátegui murió en 1930, a los 35 años, después de una vida marcada por la enfermedad: perdió una pierna y pasó largas temporadas en cama. Aun así, fundó la revista «Amauta», que reunió a escritores, pintores y pensadores de vanguardia, y escribió «7 ensayos de interpretación de la realidad peruana», donde sostuvo que el llamado «problema del indio» era, en el fondo, un problema de propiedad de la tierra. Su obra sigue discutiéndose hoy, tanto por quienes la admiran como por quienes la critican.",
    ["¿Qué ideas principales desarrolla el texto?", "Mariátegui superó grandes limitaciones físicas y produjo una obra influyente que todavía se debate.", "Mariátegui fue un pintor de vanguardia que fundó una revista de arte en Lima en el siglo XX.", "Mariátegui murió joven."],
    ["¿Qué tesis de los «7 ensayos» menciona el texto?", "Que el problema del indio es un problema de la tierra", "Que la revista «Amauta» debía publicarse solo en quechua", "Que la enfermedad lo venció"],
    ["¿Qué expresión introduce el contraste entre su enfermedad y su obra?", "«Aun así»", "«después de una vida»", "«tanto por quienes la admiran como por quienes la critican»"]),
  read("La gastronomía peruana", "🍽️", "En las últimas décadas, la cocina peruana pasó de ser un orgullo doméstico a una industria reconocida en el mundo. Restaurantes limeños aparecen en las listas internacionales más prestigiosas, y miles de jóvenes estudian cocina. Ese éxito ha generado empleo y turismo. Pero también ha abierto preguntas: ¿llegan los beneficios a los agricultores que cultivan los ingredientes nativos? ¿Se conserva la cocina tradicional de las regiones o se reemplaza por versiones de lujo? El auge gastronómico, en suma, es una oportunidad y un desafío.",
    ["¿Qué ideas principales presenta el texto?", "La cocina peruana se volvió una industria exitosa, pero su auge plantea problemas de equidad y conservación.", "Los restaurantes de Lima son los más caros de Sudamérica y solo los turistas pueden pagarlos.", "La comida peruana es rica."],
    ["¿Qué pregunta plantea el texto sobre los agricultores?", "Si reciben parte de los beneficios del auge", "Si saben cocinar los platos que se venden en los restaurantes de lujo", "Si viven en Lima"],
    ["¿Qué función cumple «en suma»?", "Introduce una síntesis final.", "Presenta un nuevo ejemplo de restaurante famoso.", "Cambia de tema."]),
];

// --- B. Tema -----------------------------------------------------------------

const QUOTE_THEMES = pool([
  ["«Callar ante la injusticia también es elegir un bando».", "La complicidad del silencio"], ["«La ciudad le dio un título y le quitó el nombre de su pueblo».", "El precio del desarraigo"],
  ["«Quien no sabe de dónde viene no sabe adónde va».", "La importancia de la memoria"], ["«Le ofrecieron dinero por mentir; eligió la pobreza».", "La integridad moral"],
  ["«Los muros de la escuela separaban a quienes la ley decía iguales».", "La desigualdad social"], ["«Perdonó, pero no olvidó».", "La reconciliación con memoria"],
  ["«Ganó el poder y perdió a todos los que lo ayudaron a ganarlo».", "La soledad del poder"], ["«Cada generación cree inventar el amor».", "La universalidad de las emociones"],
  ["«El progreso llegó al valle con la carretera y se fue con los jóvenes».", "Las contradicciones del progreso"], ["«La violencia que se enseña en casa se aprende en la calle».", "El ciclo de la violencia"],
]);
const THEME_DEV = [
  read("El heredero", "🏚️", "Cuando murió su padre, Andrés heredó la tienda de abarrotes del barrio y una libreta llena de deudas que los vecinos nunca pagaron. Al principio, furioso, decidió cobrar a todos. Fue casa por casa. En cada puerta encontró una historia: una viuda, un hombre sin trabajo, una madre con un hijo enfermo. Muchos le contaron que su padre los había ayudado sin pedir nada. Esa noche, Andrés no tachó ninguna deuda. Tampoco cobró. Solo escribió, al final de la libreta, una nueva columna: «Lo que mi padre dio».",
    ["¿Cómo se desarrolla el tema a lo largo del cuento?", "Andrés pasa del rencor a comprender el valor de la generosidad de su padre.", "Andrés descubre que su padre era un mal comerciante que perdió todo su dinero.", "Andrés se vuelve rico."],
    ["¿Qué recurso usa el autor para mostrar el cambio de Andrés?", "Las historias que escucha en cada puerta", "Un diálogo extenso con un abogado sobre la herencia", "Una carta del padre"],
    ["¿Qué sugiere la nueva columna de la libreta?", "Que Andrés reinterpreta las deudas como un legado de bondad", "Que Andrés planea cobrar intereses a todos los vecinos del barrio", "Que se acabó la tienda"]),
  read("La lengua escondida", "🗣️", "De niña, Teodora escondía que su madre le hablaba en quechua: en el colegio de Lima se burlaban de quien «hablaba como serrano». Respondía en castellano y fingía no entender. Ya adulta, se hizo profesora. Un día, una alumna nueva lloró en clase porque nadie le entendía; venía de Ayacucho. Teodora se acercó y, por primera vez en treinta años, habló en quechua en voz alta. La alumna dejó de llorar. Esa tarde, Teodora llamó a su madre y le pidió que le contara de nuevo los cuentos del zorro.",
    ["¿Cómo se desarrolla el tema de la identidad?", "Teodora pasa de ocultar su lengua por vergüenza a recuperarla con orgullo.", "Teodora aprende quechua en la universidad para enseñar en Ayacucho.", "Teodora olvida el quechua."],
    ["¿Qué hecho provoca el cambio de Teodora?", "Ver en su alumna el mismo sufrimiento que ella vivió", "Recibir una orden del director del colegio", "Mudarse a Ayacucho"],
    ["¿Qué simboliza la llamada a su madre?", "La reconciliación con sus raíces", "Que su madre estaba enferma y necesitaba ayuda", "Que quería dinero"]),
];

// --- C. Propósito y perspectiva -----------------------------------------------

const AUDIENCE = "¿A quién se dirige el texto y con qué propósito?";
const AUDIENCE_PURPOSE: ChoiceItem[] = [
  pt(AUDIENCE, "«Estimados padres de familia: les recordamos que el plazo para la matrícula vence el 15 de febrero».", "A los padres, para informar un plazo", "A los alumnos, para entretenerlos con una historia", "A los profesores"),
  pt(AUDIENCE, "«Joven: ¿quieres cambiar tu barrio? Únete a nuestro voluntariado este sábado».", "A los jóvenes, para persuadirlos de participar", "A los ancianos, para informarles de un trámite", "A los niños"),
  pt(AUDIENCE, "«Señores congresistas: les pedimos que voten a favor de la ley de protección de glaciares».", "A los congresistas, para persuadirlos de votar", "A los turistas, para invitarlos a visitar los glaciares de la cordillera", "A los glaciares"),
  pt(AUDIENCE, "«Para armar la carpa, primero extiende la base y luego inserta las varillas en las esquinas».", "A quien va a acampar, para explicar cómo hacerlo", "A los vendedores de carpas, para que bajen sus precios", "A nadie"),
  pt(AUDIENCE, "«Querido diario: hoy conocí el mar y no supe qué decir».", "A sí mismo, para expresar una vivencia", "A un público amplio, para informar sobre las playas del Perú", "A los peces"),
  pt(AUDIENCE, "«Se comunica a los usuarios que el servicio de agua se suspenderá el jueves de 8 a 16 horas».", "A los usuarios, para informar un corte", "A los obreros, para darles instrucciones de reparación", "A los niños"),
];
const PERSPECTIVE = "¿Cuál es la perspectiva del autor?";
const AUTHOR_PERSPECTIVE: ChoiceItem[] = [
  pt(PERSPECTIVE, "«Llamamos “desarrollo” a una carretera que atraviesa el bosque. Los pueblos que viven en él la llaman de otra manera: el principio del fin».", "Cuestiona que toda obra sea desarrollo para todos.", "Celebra las carreteras como el mayor logro del desarrollo amazónico.", "No opina."),
  pt(PERSPECTIVE, "«La tecnología no hace mejores ni peores a los estudiantes; hace más visibles las diferencias que ya existían».", "Cree que la tecnología amplifica desigualdades previas.", "Afirma que la tecnología resuelve todos los problemas de la educación.", "Odia la tecnología."),
  pt(PERSPECTIVE, "«No hay “lenguas pobres”. Hay lenguas a las que se les negó escuela, libros y prestigio».", "Atribuye la desvalorización de algunas lenguas a la exclusión.", "Sostiene que algunas lenguas son inferiores por naturaleza.", "Habla de libros."),
  pt(PERSPECTIVE, "«El turismo masivo convierte a los pueblos en escenografías: se vende lo típico y se esconde lo real».", "Critica el turismo que vuelve espectáculo la cultura local.", "Defiende el turismo masivo porque muestra la cultura auténtica de los pueblos.", "Le gusta viajar."),
  pt(PERSPECTIVE, "«Llorar a los héroes es fácil. Lo difícil es honrarlos cumpliendo con nuestro deber cotidiano».", "Valora el compromiso diario por encima de los homenajes.", "Propone más ceremonias y desfiles en honor a los héroes nacionales.", "Habla de lágrimas."),
  pt(PERSPECTIVE, "«Los exámenes estandarizados nos dicen mucho de lo que se mide y casi nada de lo que importa».", "Duda de que esos exámenes capten lo esencial del aprendizaje.", "Considera que los exámenes estandarizados miden todo lo importante.", "Prefiere los exámenes."),
];

// --- D. Tono -----------------------------------------------------------------

const FORMAL = "¿Qué texto es más formal?";
const FORMALITY: ChoiceItem[] = [
  w(FORMAL, "Por medio de la presente, solicito una prórroga para la entrega del informe.", "Profe, ¿me da unos días más para el informe? Porfa, es que se me complicó todo esta semana, de verdad.", "Necesito más tiempo, ¿ya?"), w(FORMAL, "Lamentamos informarle que su postulación no ha sido seleccionada.", "Uy, no pasaste esta vez, pero sigue intentando, causa, que ya habrá otra oportunidad más adelante.", "No quedaste."),
  w(FORMAL, "Se exhorta a los vecinos a no arrojar residuos en la vía pública.", "Oigan, no boten basura en la calle, pues, qué feo se ve todo cochino cuando uno pasa.", "¡No sean cochinos!"), w(FORMAL, "El expositor fundamentó su postura con evidencia empírica.", "El que habló sustentó bien con datos y todo, la verdad, me dejó loco cómo explicó.", "Habló bacán."),
  w(FORMAL, "Agradeceremos su puntual asistencia a la sesión del jueves.", "Oigan, vengan temprano el jueves, que no queremos estar esperando a nadie otra vez, ¿ya?", "Jueves, puntuales."), w(FORMAL, "La comisión acordó postergar la decisión hasta contar con más información.", "Al final no decidieron nada de nada porque les faltaba un montón de info, así que lo dejaron para otro día.", "Lo dejaron ahí."),
];
const SO = sorter(["Objetivo", "Subjetivo"], "¿El tono del texto es objetivo o subjetivo?");
const SUBJ_OBJ: ChoiceItem[] = [
  ...["La represa tiene una capacidad de 400 millones de metros cúbicos.", "El censo de 2017 registró más de 31 millones de habitantes.", "La exposición estará abierta de martes a domingo.", "El volcán Ubinas registró una explosión a las 6:40."].map((x) => SO(x, 0)),
  ...["Esa represa monstruosa arruinó el valle más bello del sur.", "Somos un país maravilloso, aunque a veces lo olvidemos.", "La exposición es una joya que nadie debería perderse.", "El rugido aterrador del Ubinas despertó a todos."].map((x) => SO(x, 1)),
];
const TONE = "¿Qué tono tiene cada texto?";
const TONE_COMPARE: ChoiceItem[] = [
  pt(TONE, "Texto A: «Volví al barrio de mi infancia; la casa ya no estaba, pero el olor a pan seguía».\nTexto B: «¡Por fin demolieron esa casa vieja! Ahora tendremos un parque».", "A es nostálgico; B es entusiasta.", "A es entusiasta; B es nostálgico y melancólico.", "Ambos son neutros."),
  pt(TONE, "Texto A: «Qué gran idea cerrar la única biblioteca del distrito».\nTexto B: «La municipalidad cerró la biblioteca por falta de presupuesto».", "A es sarcástico; B es neutro.", "A es neutro; B es sarcástico y burlón.", "Ambos son sarcásticos."),
  pt(TONE, "Texto A: «Juntos, reconstruiremos cada casa y cada calle».\nTexto B: «Ya no queda nada que reconstruir».", "A es esperanzador; B es derrotista.", "A es derrotista; B es esperanzador y animoso.", "Ambos son esperanzadores."),
  pt(TONE, "Texto A: «Exigimos justicia para las víctimas, sin más demora».\nTexto B: «Se presentaron los informes ante la fiscalía».", "A es exigente e indignado; B es impersonal.", "A es impersonal; B es exigente e indignado.", "Ambos son alegres."),
  pt(TONE, "Texto A: «Mi abuela, la mujer más terca y querida del mundo, cumplió noventa».\nTexto B: «La señora Quispe cumplió noventa años el lunes».", "A es afectuoso y humorístico; B es formal.", "A es formal; B es afectuoso y humorístico.", "Ambos son tristes."),
  pt(TONE, "Texto A: «Si no actuamos hoy, mañana no habrá agua que defender».\nTexto B: «El caudal del río disminuyó un 15 %».", "A es alarmista y urgente; B es informativo.", "A es informativo; B es alarmista y urgente.", "Ambos son informativos."),
];

// --- E. Recursos literarios --------------------------------------------------

const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa la alusión a Caín y Abel?", "Fuente: Caín, por envidia, mató a su hermano Abel.\nOración: «La guerra entre los dos hermanos por la herencia fue una historia de Caín y Abel».", "Una rivalidad entre hermanos que termina en violencia", "Una relación fraternal llena de cariño y ayuda mutua", "Una herencia grande"),
  pt("¿Qué significa «abrir la caja de Pandora»?", "Fuente: Pandora abrió una caja de la que escaparon todos los males del mundo.\nOración: «Investigar las cuentas del club fue abrir la caja de Pandora».", "Desencadenar una serie de problemas", "Encontrar una solución sencilla a un problema", "Abrir un regalo"),
  pt("¿Qué significa la alusión a Inkarri?", "Fuente: Según el mito andino, el cuerpo del Inca fue desmembrado y enterrado; cuando se reconstituya, el mundo andino renacerá.\nOración: «El retorno de la fiesta al pueblo fue como un Inkarri».", "Un renacimiento de lo que parecía perdido", "Una destrucción definitiva sin esperanza", "Un entierro"),
  pt("¿Qué significa «ser un Hamlet»?", "Fuente: Hamlet, el príncipe de Shakespeare, duda sin cesar entre actuar o no actuar.\nOración: «Ante cada decisión, mi primo es un Hamlet».", "Ser alguien que duda demasiado", "Ser alguien que decide rápido y sin pensar", "Ser un príncipe"),
  pt("¿Qué significa la alusión a Sísifo?", "Fuente: Sísifo fue condenado a subir una roca a la cima, que siempre volvía a caer.\nOración: «Limpiar la playa cada domingo es un trabajo de Sísifo».", "Un esfuerzo que nunca termina", "Un trabajo breve que se hace una sola vez", "Un deporte"),
  pt("¿Qué significa «una victoria pírrica»?", "Fuente: El rey Pirro ganó una batalla con tantas bajas que dijo: «Otra victoria así y estoy perdido».\nOración: «Ganó el juicio, pero gastó todo; fue una victoria pírrica».", "Un triunfo que cuesta demasiado", "Un triunfo fácil y sin costo alguno", "Una derrota"),
];
const RECALL = "¿De dónde viene la alusión?";
const ALLUSION_SOURCE: ChoiceItem[] = [
  pt(RECALL, "«Es un verdadero Quijote».", "De la novela de Cervantes", "De un drama de Shakespeare escrito en inglés", "De la Biblia"),
  pt(RECALL, "«Ser o no ser, esa es la cuestión».", "De «Hamlet», de Shakespeare", "De los «Comentarios reales» del Inca Garcilaso", "De un poema de Vallejo"),
  pt(RECALL, "«Fue su talón de Aquiles».", "De la mitología griega", "De la tradición oral andina recogida en Huarochirí", "De un refrán"),
  pt(RECALL, "«Volvió como el hijo pródigo».", "De una parábola bíblica", "De la novela «Los ríos profundos», de Arguedas", "De un cuento"),
  pt(RECALL, "«Es la manzana de la discordia».", "Del mito griego del juicio de Paris", "De la leyenda de la Achiqueé, en Áncash", "De la historia"),
  pt(RECALL, "«Una lucha de David contra Goliat».", "Del relato bíblico", "De la mitología inca y de los relatos sobre Pachacútec", "De un drama"),
  pt(RECALL, "«Hay golpes en la vida, tan fuertes… ¡Yo no sé!».", "Del poema «Los heraldos negros», de Vallejo", "De la obra «Hamlet», de Shakespeare", "De la Biblia"),
  pt(RECALL, "«Volverá como Inkarri».", "Del mito andino del Inca que renacerá", "De la mitología griega y de los viajes de Ulises", "De una novela"),
];
const MEAN = "¿Qué significa la figura?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "«Es un silencio que grita».", "Un silencio que comunica mucho.", "Un silencio en el que alguien empieza a gritar muy fuerte.", "Ruido."),
  pt(MEAN, "«Pasó a mejor vida».", "Murió.", "Se mudó a una casa más cómoda en otra ciudad.", "Mejoró."),
  pt(MEAN, "«Te lo he dicho un millón de veces».", "Te lo he dicho muchísimas veces.", "Te lo he dicho exactamente un millón de veces, sin exagerar.", "Una vez."),
  pt(MEAN, "«Vivo sin vivir en mí».", "Siento una contradicción interior profunda.", "Vivo en otra casa que no es la mía desde hace años.", "Estoy feliz."),
  pt(MEAN, "«Es un dulce tormento».", "Es algo que hace sufrir y a la vez agrada.", "Es un postre muy dulce que hace daño a los dientes.", "Es fácil."),
  pt(MEAN, "«Fue un daño colateral».", "Fue un daño a inocentes, dicho de forma suavizada.", "Fue un daño provocado a propósito y sin ningún disimulo.", "Fue un éxito."),
];
const FIG4 = sorter(["Eufemismo", "Hipérbole", "Oxímoron", "Paradoja"], "¿Qué figura literaria se usa?");
const FIGURE_FOUR: ChoiceItem[] = [
  ...["Nos dejó para siempre.", "Es una persona de la tercera edad.", "Lo despidieron por reestructuración."].map((x) => FIG4(x, 0)),
  ...["Lloré un océano.", "Te esperé mil años.", "Tengo un hambre de lobo que no me cabe en el cuerpo."].map((x) => FIG4(x, 1)),
  ...["Un silencio ensordecedor.", "Una luz oscura.", "Una dulce amargura."].map((x) => FIG4(x, 2)),
  ...["Solo sé que no sé nada.", "Muero porque no muero.", "Cuanto más tengo, menos tengo."].map((x) => FIG4(x, 3)),
];
const FIGALL = sorter(["Metáfora", "Símil", "Personificación", "Hipérbole", "Oxímoron", "Anáfora"], "¿Qué figura literaria se usa?");
const FIGURE_REVIEW: ChoiceItem[] = [
  ...["Tus ojos son dos luceros.", "La vida es un río."].map((x) => FIGALL(x, 0)),
  ...["Era fuerte como un roble.", "Lloraba como una niña perdida."].map((x) => FIGALL(x, 1)),
  ...["El mar susurraba secretos.", "La ciudad dormía bajo la niebla."].map((x) => FIGALL(x, 2)),
  ...["Caminamos un siglo hasta la cima.", "Tiene más libros que estrellas el cielo."].map((x) => FIGALL(x, 3)),
  ...["Un fuego helado.", "Una soledad sonora."].map((x) => FIGALL(x, 4)),
  ...["Por ti canto, por ti lloro, por ti vivo.", "Ya no hay pan, ya no hay agua, ya no hay nada."].map((x) => FIGALL(x, 5)),
];
const EFFECT = "¿Qué efecto tiene la figura en el texto?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«En la guerra, los soldados “neutralizaron” la aldea».", "El eufemismo oculta la violencia de lo ocurrido.", "La palabra muestra con crudeza y detalle la violencia de los hechos.", "Describe la aldea."),
  pt(EFFECT, "«Su ausencia era una presencia que llenaba la casa».", "La paradoja intensifica lo mucho que se le extraña.", "La frase indica que la persona estaba presente en la casa todo el tiempo.", "Habla de una casa."),
  pt(EFFECT, "«Ese examen fue un infierno de mil horas».", "La hipérbole transmite agotamiento y angustia.", "La frase indica que el examen duró realmente mil horas seguidas.", "Da la hora."),
  pt(EFFECT, "«La ciudad, fiera hambrienta, devoraba a los recién llegados».", "La personificación presenta la ciudad como hostil.", "La metáfora muestra la ciudad como un lugar acogedor y amable.", "Habla de animales."),
  pt(EFFECT, "«Nadie, nadie, nadie vino a verlo».", "La repetición enfatiza su soledad.", "La repetición indica que muchas personas fueron a visitarlo.", "Cuenta personas."),
  pt(EFFECT, "«Era una calma tensa, a punto de estallar».", "El oxímoron crea suspenso.", "El oxímoron transmite tranquilidad completa y segura.", "Describe el clima."),
];

// --- F. Lectura atenta: literatura ---------------------------------------------

const NARR = sorter(["Primera persona", "Segunda persona", "Tercera persona omnisciente", "Tercera persona limitada"], "¿Qué punto de vista tiene el narrador?");
const NARRATOR: ChoiceItem[] = [
  ...["Aquella noche entendí que mi padre también tenía miedo.", "Nunca les conté a mis hermanos lo que vi en la mina."].map((x) => NARR(x, 0)),
  ...["Subes al bus y sientes que todos te miran. Sabes que no perteneces aquí.", "Abres la carta con manos temblorosas; ya sabes lo que dice."].map((x) => NARR(x, 1)),
  ...["El juez sonreía sin ganas; la acusada, que lo sabía, no sentía nada; y el público, impaciente, solo quería irse.", "Mientras Rosa creía haber engañado a todos, su madre ya conocía la verdad y planeaba hablarle."].map((x) => NARR(x, 2)),
  ...["Julio miró la puerta. No entendía por qué su padre tardaba tanto.", "Elena escuchó un grito. No sabía de dónde venía."].map((x) => NARR(x, 3)),
];
const CHARACTER = [
  read("El capataz", "⛏️", "Durante veinte años, Fermín fue el capataz más temido de la mina: gritaba, multaba y nunca aceptaba excusas. Un día, una galería se derrumbó. Fermín fue el primero en entrar a buscar a los atrapados, sin casco, con las manos. Sacó a tres. Al cuarto, un muchacho de diecisiete, lo cargó en hombros durante una hora. Desde entonces, siguió siendo exigente, pero los mineros notaron algo nuevo: les preguntaba por sus familias y, al final de cada turno, los contaba uno por uno.",
    ["¿Cómo cambia Fermín a lo largo del relato?", "Sigue siendo exigente, pero se vuelve protector y cercano.", "Deja de ser exigente y renuncia a su puesto de capataz en la mina.", "No cambia."],
    ["¿Qué acción revela una faceta oculta de Fermín?", "Entrar sin casco a rescatar a los atrapados", "Gritar y multar a los mineros", "Trabajar veinte años en la mina sin vacaciones"],
    ["¿Qué significa que «los contaba uno por uno»?", "Que se preocupaba de que todos salieran con vida", "Que quería saber cuántos habían faltado para multarlos", "Que sabía matemáticas"]),
  read("La hermana mayor", "👧", "Desde que su madre migró a Italia, Luz, de quince años, cuidaba a sus tres hermanos. Cocinaba, revisaba tareas, iba a las reuniones del colegio. Sus amigas dejaron de invitarla. Al principio lo hacía con rabia; contaba los días para que volviera su madre. Pero un día, su hermano menor dibujó a la familia y la puso a ella en el centro, más grande que todos. Luz guardó el dibujo. Cuando su madre anunció que tardaría otro año en volver, Luz no lloró. Solo dijo: «Aquí estamos bien. Ven cuando puedas».",
    ["¿Cómo evoluciona Luz?", "Pasa de la rabia a aceptar su rol con madurez.", "Pasa de la responsabilidad al abandono de sus hermanos.", "No evoluciona."],
    ["¿Qué papel cumple el dibujo del hermano?", "Le muestra cuánto la valoran sus hermanos.", "Le recuerda que debe viajar a Italia con su madre.", "Es un regalo."],
    ["¿Qué revela la respuesta final de Luz?", "Fortaleza y una nueva serenidad", "Enojo profundo contra su madre por haberse ido", "Indiferencia"]),
];
const CRAFT_LIT = [
  read("El reloj", "⏰", "Tic. El reloj de la sala marcaba las once. Tac. El padre no llegaba. Tic. La madre fingía coser. Tac. Los niños fingían dormir. Tic. Afuera, un auto frenó. Tac. Nadie se movió. Tic. La puerta no se abrió. Tac. El auto siguió de largo. Tic.",
    ["¿Qué efecto tiene la repetición de «Tic» y «Tac»?", "Crea tensión y transmite la lenta espera.", "Hace que el relato parezca alegre y divertido.", "Indica que el reloj está malogrado."],
    ["¿Por qué las oraciones son tan cortas?", "Para imitar el ritmo del reloj y aumentar el suspenso", "Porque el autor no sabía escribir oraciones largas ni usar conectores entre las ideas", "Para ahorrar espacio"],
    ["¿Qué sugiere el final abierto?", "Que la espera continúa y la angustia no se resuelve", "Que el padre llegó a casa y todos se alegraron mucho y se fueron a dormir tranquilos", "Que el reloj se detuvo"]),
  read("Dos cartas", "✉️", "El cuento está formado por dos cartas. En la primera, de 1980, un joven le escribe a su novia desde Lima: le promete volver al pueblo en un año, con dinero para casarse. En la segunda, de 2020, la misma mujer le escribe a su nieta: «Nunca volvió. Me casé con tu abuelo, que se quedó. Fui feliz. Pero todavía guardo la primera carta».",
    ["¿Por qué el autor elige contar la historia con dos cartas?", "Para mostrar el paso del tiempo y el contraste entre la promesa y la realidad", "Porque las cartas eran el único medio de comunicación que existía en 2020 en los pueblos pequeños del país", "Para confundir al lector"],
    ["¿Qué efecto produce el salto de cuarenta años?", "Revela de golpe el desenlace de una promesa incumplida.", "Hace que el cuento parezca una noticia de actualidad.", "Ninguno."],
    ["¿Qué sugiere la última oración?", "Que el recuerdo de aquel amor sigue vivo", "Que la abuela odia al joven que se fue a Lima", "Que perdió la carta"]),
];

// --- G. Lectura atenta: textos informativos ---------------------------------------

const WORD_CHOICE: ChoiceItem[] = [
  pt("¿Qué efecto tiene la palabra «invasores» en lugar de «pobladores»?", "«Los invasores ocuparon el cerro».", "Presenta a las personas de forma negativa, como ilegítimas.", "Las presenta como vecinos respetados que fundaron un barrio con esfuerzo.", "Es neutra."),
  pt("¿Qué efecto tiene el verbo «arrebató» en lugar de «ganó»?", "«El equipo arrebató el título en el último minuto».", "Sugiere un triunfo dramático y casi robado.", "Indica que el triunfo fue tranquilo, esperado y sin emoción alguna.", "Es neutro."),
  pt("¿Qué efecto tiene «se fueron» en lugar de «huyeron»?", "«Miles de familias se fueron del campo durante la violencia».", "Suaviza el carácter forzado de la migración.", "Hace más dramático y violento el hecho narrado en la oración.", "Ninguno."),
  pt("¿Qué efecto tiene la palabra «héroes» para referirse a los médicos?", "«Los héroes del hospital trabajaron sin descanso».", "Los engrandece y despierta admiración.", "Los critica por haber trabajado demasiadas horas sin descanso.", "Es neutra."),
  pt("¿Qué efecto tiene «ajuste de precios» en lugar de «alza»?", "«El Gobierno anunció un ajuste de precios del combustible».", "Suaviza una noticia negativa.", "Hace que la noticia parezca más grave y alarmante para todos.", "Es igual."),
  pt("¿Qué efecto tiene la palabra «paraíso» para describir el Manu?", "«El Manu es un paraíso de biodiversidad».", "Transmite admiración y valoración positiva.", "Indica que el Manu es un lugar religioso donde viven santos.", "Es neutra."),
];
const CRAFT_INFO = [
  read("¿Por qué se seca el Titicaca?", "💧", "En 2023, el nivel del lago Titicaca bajó a uno de sus puntos más bajos en décadas. ¿Por qué? La respuesta tiene tres partes. Primero, llovió menos de lo normal en la cuenca. Segundo, el calor aumentó la evaporación. Tercero, los glaciares que alimentan sus ríos son cada vez más pequeños. Las consecuencias se sienten en la pesca, en el transporte entre islas y en la agricultura de las orillas. Entender estas causas es el primer paso para proteger el lago más alto del mundo navegable.",
    ["¿Por qué el autor empieza con una pregunta?", "Para despertar interés y organizar la explicación", "Porque no conoce la respuesta y quiere que el lector la investigue", "Para confundir"],
    ["¿Cómo está organizada la explicación?", "Enumera tres causas y luego sus consecuencias.", "Narra una historia de un pescador del lago.", "Compara el Titicaca con otros lagos del mundo."],
    ["¿Qué función cumple la última oración?", "Justifica la importancia de lo explicado.", "Presenta una nueva causa del problema.", "Cuenta un chiste."]),
  read("El precio de un celular", "📱", "Imagina tu celular. Ahora imagina su viaje: el cobre salió quizá de una mina de Apurímac; el litio, de un salar de Chile o Bolivia; el ensamblaje ocurrió en Asia; y, cuando lo deseches, puede terminar en un basural de África. Cada etapa tiene costos que no aparecen en el precio: agua usada, trabajo mal pagado, residuos tóxicos. El texto no busca que dejes de usar el celular, sino que lo mires de otra manera.",
    ["¿Qué recurso usa el autor al inicio?", "Invita al lector a imaginar, para involucrarlo", "Presenta una estadística sobre ventas de celulares", "Cita a un experto"],
    ["¿Qué estructura organiza el texto?", "La secuencia del recorrido de un objeto", "Problema y solución", "Comparación entre dos marcas de celulares"],
    ["¿Qué aclara el autor en la última oración?", "Su propósito real", "Su opinión sobre las marcas de celulares", "El precio del celular"]),
];

// --- H. Cuentos ------------------------------------------------------------------

const STORIES_1 = [
  read("El guardián del faro", "🗼", "Durante cuarenta años, don Celestino encendió cada noche el faro de la isla. Cuando llegó la luz automática, le dijeron que ya no era necesario. Se mudó al puerto. Las primeras noches no pudo dormir: se levantaba a las seis de la tarde, por costumbre, y miraba hacia la isla. Una noche de tormenta se fue la electricidad en toda la costa. El faro quedó apagado. Don Celestino tomó un bote, cruzó el mar embravecido y lo encendió a mano. A la mañana siguiente, nadie supo quién había sido.",
    ["¿Cuál es el conflicto principal?", "Don Celestino pierde el oficio que daba sentido a su vida.", "Don Celestino discute con los pescadores por el precio del pescado.", "Don Celestino no sabe nadar."],
    ["¿Qué revela su viaje en la tormenta?", "Su sentido del deber y su vínculo con el faro", "Su deseo de que todos lo reconozcan y lo aplaudan", "Su miedo al mar"],
    ["¿Qué sugiere que «nadie supo quién había sido»?", "Que actuó sin buscar reconocimiento", "Que nadie se dio cuenta de que el faro estaba encendido", "Que fue un fantasma"]),
  read("La apuesta", "🎲", "Tres amigos apostaron quién aguantaría más tiempo sin usar el celular. Bruno se rindió en una hora. Camila, al día siguiente. Sebastián resistió una semana. En ese tiempo, volvió a hablar con su abuelo, leyó una novela entera y descubrió que su vecina tocaba el violín. Ganó la apuesta, pero cuando sus amigos fueron a pagarle, les dijo que se guardaran el dinero. «Ya cobré», les dijo.",
    ["¿Qué tema desarrolla el cuento?", "Lo que se gana al desconectarse de la tecnología", "Lo peligroso que es apostar dinero entre amigos del colegio", "Los violines"],
    ["¿Qué significa «Ya cobré»?", "Que la experiencia fue su verdadera ganancia", "Que ya le habían pagado antes de la apuesta", "Que no le gusta el dinero"],
    ["¿Qué recurso usa el autor para mostrar el cambio de Sebastián?", "La lista de cosas que descubrió esa semana", "Un monólogo interior largo sobre la tecnología", "Una carta"]),
];
const STORIES_2 = [
  read("El concurso de marinera", "💃", "Para el concurso de marinera en Trujillo, Rosa ensayó un año con su pareja, Diego. Una semana antes, Diego se lesionó. La única pareja disponible era Marco, el chico que todos llamaban «el patas de palo». Rosa casi se retira. Ensayaron cada noche. Marco nunca bailó como Diego, pero aprendió a mirarla, a seguirla, a no dejarla sola en el escenario. No ganaron. Al salir, la jurado principal se acercó a Rosa: «Ustedes no bailaron mejor que nadie; bailaron juntos».",
    ["¿Cuál es el punto de giro del cuento?", "La lesión de Diego obliga a Rosa a bailar con Marco.", "Rosa gana el concurso de marinera en Trujillo con Diego.", "Rosa deja de bailar."],
    ["¿Qué valora la jurado?", "La complicidad entre los bailarines por encima de la técnica", "La técnica perfecta de Marco, que superó a Diego en todos los pasos de la marinera", "Los trajes"],
    ["¿Cómo cambia la percepción de Marco?", "De ser objeto de burla pasa a mostrar compromiso y sensibilidad.", "Pasa de ser un gran bailarín a abandonar el baile para siempre.", "No cambia."]),
  read("La maestra rural", "🏫", "Cuando la profesora Elvira llegó a Pampamarca, la escuela tenía un solo salón y doce alumnos de distintas edades. No había luz. Ella llevó un panel solar pequeño, una radio y treinta libros. Al principio, los padres desconfiaban: preferían que los niños ayudaran en la chacra. Elvira empezó a enseñar a leer usando los nombres de las semillas, los cerros y los animales del lugar. Al año, los padres pedían que les enseñara también a ellos. Al segundo, la escuela tenía un aula para adultos.",
    ["¿Qué estrategia usa Elvira para enseñar?", "Partir del entorno y los saberes de la comunidad", "Usar libros traídos de Lima sobre ciudades lejanas", "Castigar a los niños que no leen"],
    ["¿Por qué cambia la actitud de los padres?", "Porque ven que la educación conecta con su vida y les sirve", "Porque el gobierno los obliga a mandar a sus hijos a la escuela bajo amenaza de multa", "Porque llovió"],
    ["¿Qué muestra el final?", "Que la escuela se volvió un espacio de toda la comunidad", "Que Elvira se fue del pueblo cansada y cerró la escuela para siempre", "Nada"]),
];

// --- I. Poesía ---------------------------------------------------------------------

const POETRY: ChoiceItem[] = [
  w("¿Qué es un verso?", "Cada una de las líneas de un poema", "Un grupo de líneas separado por un espacio", "La idea principal del poema"), w("¿Qué es una estrofa?", "Un grupo de versos separado por un espacio", "Cada una de las líneas que forman un poema, desde la primera hasta la última", "El título del poema"),
  pt("¿Qué tipo de rima hay entre los versos?", "«Bajo la luna / suena la laguna».", "Consonante (coinciden vocales y consonantes)", "Asonante (coinciden solo las vocales)", "No riman"), pt("¿Qué tipo de rima hay entre los versos?", "«Llora la tarde / junto a la madre».", "Asonante (coinciden solo las vocales)", "Consonante (coinciden vocales y consonantes)", "No riman"),
  w("¿Qué es el verso libre?", "El que no sigue una medida ni una rima fijas", "El que tiene siempre catorce versos rimados en dos cuartetos y dos tercetos", "El que se canta"), w("¿Cuántos versos tiene un soneto?", "Catorce", "Dieciséis", "Diez"),
  pt("¿Qué recurso se usa?", "«Los heraldos negros que nos manda la Muerte» (Vallejo).", "Personificación", "Onomatopeya", "Rima asonante en los versos pares"), w("¿Qué es el encabalgamiento?", "Cuando la idea de un verso continúa en el siguiente", "Cuando dos versos seguidos riman entre sí de forma consonante", "Cuando el poema no tiene título"),
  pt("¿Cuántas sílabas métricas tiene el verso?", "«Ver-de-que-te-quie-ro-ver-de» (Lorca)", "Ocho", "Seis", "Diez"), w("¿Qué es el yo poético?", "La voz que habla en el poema", "El autor real del poema, con su nombre y apellido", "El lector"),
];

export const ROWS: Row[] = [
  ["A.1", "Determinar la idea principal de un texto", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["A.2", "Determinar varias ideas principales de un texto", (r) => readPassage(r, MULTI_MAIN, false)],

  ["B.1", "Relacionar las citas con sus temas", (r) => choose(r, "¿Qué tema expresa la cita?", QUOTE_THEMES)],
  ["B.2", "Analizar el desarrollo de los temas", (r) => readPassage(r, THEME_DEV, false)],

  ["C.1", "Identificar el destinatario y el propósito", (r) => choose(r, "", AUDIENCE_PURPOSE)],
  ["C.2", "Determinar la perspectiva del autor", (r) => choose(r, "", AUTHOR_PERSPECTIVE)],

  ["D.1", "¿Qué texto es más formal?", (r) => choose(r, "", FORMALITY)],
  ["D.2", "Comparar textos según su tono objetivo o subjetivo", (r) => choose(r, "", SUBJ_OBJ)],
  ["D.3", "Comparar el tono de dos textos", (r) => choose(r, "", TONE_COMPARE)],

  ["E.1", "Interpretar el significado de una alusión a partir de su fuente", (r) => choose(r, "", ALLUSIONS)],
  ["E.2", "Recordar la fuente de una alusión", (r) => choose(r, "", ALLUSION_SOURCE)],
  ["E.3", "Interpretar figuras literarias", (r) => choose(r, "", FIGURE_MEANING)],
  ["E.4", "Clasificar figuras literarias: eufemismo, hipérbole, oxímoron, paradoja", (r) => choose(r, "", FIGURE_FOUR)],
  ["E.5", "Clasificar figuras literarias: repaso", (r) => choose(r, "", FIGURE_REVIEW)],
  ["E.6", "Analizar el efecto de las figuras literarias en el significado y el tono", (r) => choose(r, "", FIGURE_EFFECT)],

  ["F.1", "Identificar el punto de vista del narrador", (r) => choose(r, "", NARRATOR)],
  ["F.2", "Analizar la evolución de los personajes", (r) => readPassage(r, CHARACTER, false)],
  ["F.3", "Analizar la forma y la estructura de textos literarios", (r) => readPassage(r, CRAFT_LIT, false)],

  ["G.1", "Analizar el efecto de la elección de palabras en el significado y el tono", (r) => choose(r, "", WORD_CHOICE)],
  ["G.2", "Analizar la forma y la estructura de textos informativos", (r) => readPassage(r, CRAFT_INFO, false)],

  ["H.1", "Analizar cuentos cortos: grupo 1", (r) => readPassage(r, STORIES_1, false)],
  ["H.2", "Analizar cuentos cortos: grupo 2", (r) => readPassage(r, STORIES_2, false)],

  ["I.1", "Identificar los elementos de la poesía", (r) => choose(r, "", POETRY)],
];
