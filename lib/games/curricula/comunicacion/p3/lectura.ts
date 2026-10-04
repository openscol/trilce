import { choose, order, readPassage, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { pool, pt, read, sorter, w } from "./helpers";
import type { Row } from "./row";

// Estrategias de lectura (IXL 3rd grade ELA, H-V). Lecturas propias, con
// temas cercanos a los alumnos (Perú y Latinoamérica). Las ilustraciones de
// IXL se reemplazan por descripciones y emojis.

export const SECTIONS: Section[] = [
  { id: "H", name: "Idea principal", icon: "💡" },
  { id: "I", name: "Inferencias y enseñanza", icon: "🕵️" },
  { id: "J", name: "Propósito y punto de vista del autor", icon: "✍️" },
  { id: "K", name: "Personajes", icon: "🎭" },
  { id: "L", name: "Elementos del cuento", icon: "📖" },
  { id: "M", name: "Estructura del texto", icon: "🧱" },
  { id: "N", name: "Detalles sensoriales", icon: "👃" },
  { id: "O", name: "Recursos literarios", icon: "✨" },
  { id: "P", name: "Elementos visuales", icon: "🖼️" },
  { id: "Q", name: "Partes del texto", icon: "🔖" },
  { id: "R", name: "Elementos de la poesía", icon: "🎶" },
  { id: "S", name: "Textos literarios: nivel 1", icon: "📗" },
  { id: "T", name: "Textos literarios: nivel 2", icon: "📘" },
  { id: "U", name: "Textos informativos: nivel 1", icon: "📰" },
  { id: "V", name: "Textos informativos: nivel 2", icon: "🗞️" },
];

const MAIN = "¿Cuál es la idea principal que unen estos detalles?";
const KEY_DETAILS: ChoiceItem[] = [
  pt(MAIN, "• Las hormigas cargan hojas muy pesadas.\n• Construyen túneles bajo la tierra.\n• Trabajan juntas para cuidar a su reina.", "Las hormigas son muy trabajadoras.", "Las hormigas pican fuerte.", "Las hojas son el alimento de muchos animales."),
  pt(MAIN, "• Leer nos enseña palabras nuevas.\n• Con los libros conocemos otros lugares.\n• Leer nos ayuda a imaginar.", "Leer tiene muchos beneficios.", "Los libros son caros.", "Hay bibliotecas en todas las ciudades del mundo."),
  pt(MAIN, "• El cóndor tiene alas enormes.\n• Puede volar horas sin aletear.\n• Sube más alto que las montañas.", "El cóndor es un gran volador.", "El cóndor come poco.", "Las montañas de los Andes son muy frías y altas."),
  pt(MAIN, "• La quinua tiene muchas proteínas.\n• Crece en tierras frías y altas.\n• Se come en sopas, guisos y postres.", "La quinua es un alimento valioso.", "La quinua es un postre.", "En las tierras altas casi nunca llueve en invierno."),
  pt(MAIN, "• Lavarse las manos elimina microbios.\n• Cepillarse los dientes evita las caries.\n• Bañarse mantiene la piel sana.", "La higiene cuida nuestra salud.", "El jabón huele rico.", "Los dentistas trabajan en consultorios muy limpios."),
  pt(MAIN, "• Los árboles dan sombra.\n• Limpian el aire que respiramos.\n• Son el hogar de muchos animales.", "Los árboles son muy útiles.", "Los árboles son altos.", "Los animales del bosque buscan comida de noche."),
  pt(MAIN, "• El agua sirve para beber.\n• Con agua regamos las plantas.\n• La usamos para cocinar y asearnos.", "El agua es necesaria para vivir.", "El agua del mar es salada.", "Las plantas crecen mejor con sol que con sombra."),
];

const MAIN_PASSAGES = [
  read("Los manglares", "🌿", "Los manglares son bosques que crecen donde el río se junta con el mar. Sus raíces, que parecen zancos, protegen la costa de las olas. Entre ellas viven cangrejos, conchas y peces pequeños. Muchas aves hacen sus nidos en las ramas. Por eso, los manglares son un refugio para muchos seres vivos.",
    ["¿Cuál es la idea principal del texto?", "Los manglares son un refugio para muchos seres vivos.", "Los cangrejos viven entre raíces.", "Las aves hacen sus nidos en las ramas más altas de los árboles."],
    ["¿Dónde crecen los manglares?", "Donde el río se junta con el mar", "En la cima de los cerros más altos y fríos", "En medio del desierto"]),
  read("El reciclaje", "♻️", "Cada día botamos papel, botellas y latas. Si los separamos, esos materiales pueden volver a usarse. Con papel viejo se hace papel nuevo y con botellas se fabrican hasta casacas. Reciclar ahorra agua, energía y árboles. Es una forma sencilla de cuidar el planeta.",
    ["¿Cuál es la idea principal del texto?", "Reciclar es una forma sencilla de cuidar el planeta.", "Con botellas se hacen casacas.", "Cada día las personas botan demasiado papel a la basura."],
    ["¿Qué se ahorra al reciclar?", "Agua, energía y árboles", "Tiempo y dinero", "Botellas, latas y papeles viejos"]),
  read("Los quipus", "🪢", "Los incas no usaban letras como las nuestras. Para guardar información usaban quipus: cuerdas de colores con nudos. Según el color y el tipo de nudo, anotaban cuántas llamas, cuánta comida o cuántas personas había. Los quipus eran la memoria del imperio.",
    ["¿Cuál es la idea principal del texto?", "Los incas guardaban información con quipus.", "Los incas criaban llamas.", "Las cuerdas de colores se usaban para adornar la ropa."],
    ["¿De qué estaban hechos los quipus?", "De cuerdas con nudos", "De hojas de papel", "De tablas de madera"]),
];

const MAIN_ANALYZE = [
  read("El colibrí", "🐦", "El colibrí es un ave diminuta, pero sorprendente. Bate sus alas tan rápido que casi no se ven. Puede quedarse quieto en el aire y hasta volar hacia atrás. Para tener tanta energía, toma el néctar de cientos de flores cada día.",
    ["¿Cuál es la idea principal?", "El colibrí es pequeño pero sorprendente.", "Las flores tienen néctar.", "Todas las aves pueden volar hacia atrás si lo desean."],
    ["¿Qué detalle apoya la idea principal?", "Puede quedarse quieto en el aire.", "Es un ave.", "Las flores crecen en los jardines y en los campos."],
    ["¿Por qué toma tanto néctar?", "Para tener energía", "Para dormir más", "Para pesar menos"]),
  read("Las ferias de barrio", "🛍️", "Los sábados, mi barrio se llena de color con la feria. Los vecinos venden frutas, panes y tejidos. Hay música y los niños juegan entre los puestos. La feria no solo sirve para comprar: es el lugar donde los vecinos se encuentran y conversan.",
    ["¿Cuál es la idea principal?", "La feria reúne a los vecinos del barrio.", "En la feria venden pan.", "Los sábados los niños no tienen que ir a la escuela."],
    ["¿Qué detalle apoya la idea principal?", "Los vecinos se encuentran y conversan.", "Hay frutas.", "Los tejidos se hacen con lana de oveja o de alpaca."],
    ["¿Cuándo es la feria?", "Los sábados", "Los lunes", "Cada noche"]),
];

const BOOK_TITLES = pool([
  ["🐉🏰", "El dragón del castillo"], ["🚀🌕", "Viaje a la Luna"], ["🐢🏁", "La tortuga que ganó la carrera"], ["🧑‍🍳🍰", "Recetas para pequeños cocineros"],
  ["🦖🦴", "El misterio del dinosaurio"], ["⚽🏆", "El equipo campeón"], ["🐋🌊", "Los gigantes del mar"], ["🧙‍♂️✨", "El aprendiz de mago"],
  ["🌋🔥", "Volcanes del mundo"], ["🕵️‍♀️🔍", "La detective de la escuela"],
], "pic");

const INFER: ChoiceItem[] = [
  pt("¿Qué puedes inferir?", "Carla revisó su mochila tres veces, miró el reloj y respiró hondo antes de entrar al salón.", "Carla está nerviosa.", "Carla está aburrida.", "Carla tiene mucha hambre y sueño."),
  pt("¿Qué puedes inferir?", "Al llegar, don Luis encontró las macetas tiradas y huellas de patas por toda la sala.", "Su mascota hizo travesuras.", "Entró un ladrón.", "Don Luis regó demasiado sus plantas ayer."),
  pt("¿Qué puedes inferir?", "Los hinchas saltaban, se abrazaban y cantaban al salir del estadio.", "Su equipo ganó el partido.", "El partido se canceló.", "Los hinchas no pudieron entrar al estadio."),
  pt("¿Qué puedes inferir?", "Nico guardó el bloqueador, la toalla y su balde en la maleta.", "Nico irá a la playa.", "Nico irá a la nieve.", "Nico va a dormir en casa de su abuelo."),
  pt("¿Qué puedes inferir?", "La maestra sonrió y pegó una estrella dorada en el cuaderno de Dani.", "Dani hizo un buen trabajo.", "Dani olvidó su tarea.", "La maestra perdió todas sus estrellas doradas."),
  pt("¿Qué puedes inferir?", "Las hojas de los árboles se pusieron amarillas y empezaron a caer.", "Llegó el otoño.", "Llegó el verano.", "Alguien podó todos los árboles del parque."),
  pt("¿Qué puedes inferir?", "Sofi apretó la mano de su mamá y cerró los ojos cuando la enfermera se acercó.", "Sofi tiene miedo de la vacuna.", "Sofi quiere dormir.", "Sofi está feliz de ver a la enfermera de nuevo."),
];

const INFER_SUPPORT = [
  read("La sorpresa", "🎁", "Tito llegó a casa y todo estaba en silencio. Las luces estaban apagadas, pero olía a torta recién horneada. Detrás del sillón asomaban unos globos. De pronto, escuchó una risita.",
    ["¿Qué está por pasar?", "Le harán una fiesta sorpresa.", "Se fue la luz en el barrio.", "Su familia salió de viaje sin avisarle."],
    ["¿Qué detalle apoya esa idea?", "Asomaban unos globos detrás del sillón.", "Tito llegó a casa.", "El sillón estaba en la sala desde hace mucho tiempo."],
    ["¿Cómo sabes que hay alguien escondido?", "Se escuchó una risita.", "Las luces estaban apagadas.", "Olía a torta."]),
  read("El huerto de Paula", "🥬", "Paula miró su huerto y suspiró. Las lechugas tenían agujeros y las hojas de los tomates estaban mordidas. En la tierra había un caminito brillante que llegaba hasta una piedra.",
    ["¿Quién se comió las plantas?", "Unos caracoles o babosas", "Un perro grande", "Los vecinos de la casa de al lado"],
    ["¿Qué detalle apoya esa idea?", "Había un caminito brillante en la tierra.", "Paula suspiró.", "Las lechugas y los tomates crecían en el mismo huerto."],
    ["¿Cómo se siente Paula?", "Desanimada", "Orgullosa", "Divertida"]),
];

const PREDICT: ChoiceItem[] = [
  pt("¿Qué pasará después?", "Andrea estudió toda la semana para el examen de matemática. Repasó cada ejercicio con su papá.", "Le irá bien en el examen.", "Olvidará ir a la escuela.", "Su papá dará el examen por ella."),
  pt("¿Qué pasará después?", "El cielo se oscureció, sopló un viento fuerte y sonó un trueno. Los niños seguían jugando en el patio.", "La maestra los hará entrar.", "Saldrá un sol radiante.", "Los niños se pondrán a nadar en el patio."),
  pt("¿Qué pasará después?", "Leo dejó la reja abierta. Su perro Trueno vio pasar un gato por la vereda.", "Trueno saldrá tras el gato.", "Trueno se dormirá.", "El gato entrará a jugar con Leo al jardín."),
  pt("¿Qué pasará después?", "La olla de leche empezó a hervir y a subir, pero mamá hablaba por teléfono en la sala.", "La leche se derramará.", "La leche se enfriará.", "La olla se llenará de agua con hielo."),
  pt("¿Qué pasará después?", "Samuel regó y cuidó su planta de frijol todos los días, junto a la ventana soleada.", "La planta crecerá sana.", "La planta se secará.", "La planta dará manzanas rojas en una semana."),
  pt("¿Qué pasará después?", "Faltaban dos minutos y el partido estaba empatado. Rosa pateó fuerte hacia el arco vacío.", "Su equipo meterá un gol.", "El árbitro se irá.", "La pelota se convertirá en un globo de colores."),
];

const FABLES = [
  read("El zorro y las uvas", "🦊", "Un zorro hambriento vio un racimo de uvas en lo alto de una parra. Saltó una y otra vez, pero no pudo alcanzarlo. Cansado, se alejó diciendo: «Seguro que están verdes; ni las quería».",
    ["¿Qué enseña esta fábula?", "A veces despreciamos lo que no podemos lograr.", "Las uvas verdes hacen daño.", "Los zorros son los mejores saltadores de todo el bosque."],
    ["¿Por qué el zorro dijo que las uvas estaban verdes?", "Porque no pudo alcanzarlas", "Porque las probó", "Porque se lo dijo un pájaro"]),
  read("La leyenda del ayaymama", "🌙", "Cuenta una leyenda de la selva que dos hermanitos se perdieron en el bosque. Para que no sufrieran, un espíritu los convirtió en aves. Desde entonces, en las noches de luna, su canto parece decir: «ay, ay, mamá».",
    ["¿Qué explica esta leyenda?", "El origen del canto de un ave", "Por qué llueve en la selva", "Cómo se construyen las casas en los árboles altos"],
    ["¿Cuándo se oye el canto?", "En las noches de luna", "Al mediodía", "Cuando llueve"]),
  read("La liebre y la tortuga", "🐢", "La liebre se burlaba de la tortuga por lenta. Corrieron una carrera y la liebre, muy confiada, se echó a dormir. La tortuga avanzó sin parar y cruzó la meta primero.",
    ["¿Qué enseña esta fábula?", "La constancia vale más que la confianza excesiva.", "Dormir es malo para la salud.", "Las liebres siempre pierden todas las carreras que corren."],
    ["¿Por qué perdió la liebre?", "Porque se confió y se durmió", "Porque se lastimó", "Porque se perdió"]),
];

const PURPOSE = sorter(["Informar", "Entretener", "Convencer"], "¿Cuál es el propósito del autor?");
const MEDIA: ChoiceItem[] = [
  PURPOSE("📰 Noticia: «Ayer se inauguró la nueva biblioteca del distrito. Abrirá de lunes a sábado.»", 0),
  PURPOSE("📺 Anuncio: «¡Prueba el nuevo jugo Frutín! ¡El más rico y saludable! ¡Pídelo ya!»", 2),
  PURPOSE("📖 Cuento: «Había una vez un ratón que soñaba con ser astronauta...»", 1),
  PURPOSE("🗺️ Folleto del museo: «El museo tiene tres salas. En la primera verás cerámicas antiguas.»", 0),
  PURPOSE("📌 Afiche: «¡Vota por Camila para delegada! ¡Ella sí escucha a todos!»", 2),
  PURPOSE("😂 Historieta: «El perro se puso los lentes del abuelo y empezó a leer el periódico al revés.»", 1),
  PURPOSE("🌦️ Pronóstico: «Mañana habrá lluvias por la tarde y una temperatura de 18 grados.»", 0),
  PURPOSE("📻 Aviso de radio: «¡No te quedes sin tu entrada! El mejor circo llegó a la ciudad. ¡Ven hoy!»", 2),
  PURPOSE("🎭 Chiste: «—Mamá, ¿qué hay de comer? —Comida. —¡Qué rico, mi favorita!»", 1),
];
const PASSAGE_PURPOSE: ChoiceItem[] = [
  PURPOSE("Las tortugas marinas ponen sus huevos en la arena. Cuando nacen, las crías corren hacia el mar. Solo unas pocas llegan a ser adultas.", 0),
  PURPOSE("Todos deberíamos usar bolsas de tela. Las bolsas de plástico ensucian los ríos y dañan a los animales. ¡Cambia tu bolsa hoy!", 2),
  PURPOSE("El gigante estornudó tan fuerte que las nubes salieron volando. «¡Salud!», le gritó la montaña, y los dos se echaron a reír.", 1),
  PURPOSE("El corazón es un músculo del tamaño de un puño. Bombea sangre a todo el cuerpo, de día y de noche, sin descansar.", 0),
  PURPOSE("Leer veinte minutos al día es la mejor costumbre. Te hace más creativo y aprendes más. Anímate: empieza esta noche.", 2),
  PURPOSE("La princesa no quería un príncipe: quería un telescopio. Cada noche subía a la torre a contar estrellas con su gato.", 1),
  PURPOSE("El lago Titicaca está entre el Perú y Bolivia. Es el lago navegable más alto del mundo y en él hay islas flotantes.", 0),
  PURPOSE("Nuestro parque necesita más árboles. Dan sombra, limpian el aire y alegran el barrio. Firma la carta para pedirlos.", 2),
];

const POINT_OF_VIEW: ChoiceItem[] = [
  pt("¿Qué opina Mariana?", "Para Mariana, el invierno es la mejor estación: le encanta tomar chocolate caliente. Su hermano Raúl prefiere el verano.", "Que el invierno es la mejor estación", "Que el verano es mejor", "Que todas las estaciones son iguales de aburridas"),
  pt("¿En qué NO están de acuerdo?", "Tomás cree que los gatos son las mejores mascotas porque son limpios. Elsa piensa que los perros son mejores porque son más cariñosos.", "En cuál es la mejor mascota", "En si hay que bañar al gato", "En el nombre que le pondrán a su mascota"),
  pt("¿Quién cuenta la historia?", "Ese día me levanté temprano. Mi abuela ya tenía listo el desayuno y me esperaba con una sonrisa.", "El nieto o la nieta (en primera persona)", "La abuela", "Un narrador que no participa en la historia"),
  pt("¿Quién cuenta la historia?", "Julián se levantó temprano. Su abuela ya tenía listo el desayuno y lo esperaba con una sonrisa.", "Un narrador externo (en tercera persona)", "Julián", "La abuela, que habla de su propio desayuno"),
  pt("¿Qué opina el autor?", "Las tareas en grupo son valiosas. Aunque a veces cuesta ponerse de acuerdo, se aprende a escuchar y a compartir ideas.", "Que trabajar en grupo vale la pena", "Que las tareas en grupo son inútiles", "Que solo se debe trabajar con los amigos"),
  pt("¿En qué se diferencia tu opinión si piensas que «las tareas en grupo quitan tiempo»?", "El autor dice: «Las tareas en grupo son valiosas porque enseñan a compartir ideas».", "El autor las defiende y tú las criticas.", "Los dos piensan igual.", "El autor las critica y tú las defiendes con más razones."),
  pt("¿Qué opina Rafa?", "—El recreo debería durar más —dijo Rafa—. Así jugaríamos y volveríamos al salón con más ganas.", "Que el recreo debería ser más largo", "Que el recreo es muy largo", "Que no debería haber recreo en la escuela"),
];

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿En qué coinciden los dos textos?", "Texto 1: Las llamas viven en los Andes y cargan bultos.\nTexto 2: Las alpacas viven en los Andes y dan una lana muy fina.", "Los dos animales viven en los Andes.", "Los dos animales cargan bultos.", "Los dos textos hablan de la lana más fina del mundo."),
  pt("¿Qué información aparece solo en el Texto 2?", "Texto 1: El delfín es un mamífero que vive en el mar.\nTexto 2: El delfín es un mamífero marino que se comunica con silbidos.", "Se comunica con silbidos.", "Es un mamífero.", "Vive en el mar junto con otros peces grandes."),
  pt("¿En qué se diferencian los dos textos?", "Texto 1: El autor explica cómo se hace el pan paso a paso.\nTexto 2: El autor cuenta la historia del pan desde el antiguo Egipto.", "Uno da instrucciones y el otro cuenta la historia.", "Uno habla del pan y el otro del arroz.", "Los dos dan exactamente la misma receta."),
  pt("¿En qué coinciden los dos textos?", "Texto 1: Dormir bien ayuda a concentrarse en clase.\nTexto 2: Los niños que duermen poco se cansan y aprenden menos.", "Dormir bien ayuda a aprender.", "Dormir mucho es malo.", "Los niños deberían estudiar de noche y dormir de día."),
  pt("¿Qué información aparece solo en el Texto 1?", "Texto 1: Machu Picchu fue construida por los incas en lo alto de una montaña.\nTexto 2: Machu Picchu recibe miles de visitantes cada año.", "Fue construida por los incas.", "Recibe miles de visitantes.", "Está en lo más profundo de la selva baja."),
  pt("¿Qué texto usarías para saber qué comen los pingüinos?", "Texto 1: «La vida de los pingüinos: dónde viven y de qué se alimentan».\nTexto 2: «Cómo dibujar un pingüino en cinco pasos».", "El Texto 1", "El Texto 2", "Ninguno de los dos"),
];

const PERSUASIVE = [
  read("¡Más bicicletas!", "🚲", "Nuestra ciudad necesita más ciclovías. Ir en bicicleta no contamina y nos mantiene sanos. Además, con menos carros habría menos ruido y menos tráfico. Pidamos juntos al alcalde que construya ciclovías seguras.",
    ["¿De qué quiere convencernos el autor?", "De que se necesitan más ciclovías", "De que los carros son baratos", "De que nadie debería salir de su casa en bicicleta"],
    ["¿Qué razón da el autor?", "Ir en bicicleta no contamina.", "Las bicicletas son rojas.", "El alcalde vive muy lejos del centro de la ciudad."],
    ["¿Qué pide el autor al final?", "Pedirle ciclovías al alcalde", "Comprar un carro", "Caminar menos"]),
  read("Adopta, no compres", "🐶", "En los albergues hay cientos de perros y gatos que esperan una familia. Son cariñosos, están vacunados y adoptarlos no cuesta nada. Si adoptas, salvas una vida y ganas un amigo fiel. Antes de comprar una mascota, visita un albergue.",
    ["¿De qué quiere convencernos el autor?", "De adoptar mascotas de un albergue", "De comprar mascotas caras", "De que es mejor no tener ninguna mascota en casa"],
    ["¿Qué razón da el autor?", "Los animales están vacunados y son cariñosos.", "Los albergues son grandes.", "Las mascotas compradas siempre se enferman más."],
    ["¿Qué palabras muestran que el texto busca convencer?", "«Visita un albergue»", "«Hay cientos de perros»", "«Están vacunados»"]),
];

const TRAITS: ChoiceItem[] = [
  pt("¿Cómo es Valeria?", "Valeria vio que a un niño nuevo se le cayó la lonchera. Se acercó, lo ayudó a recoger todo y lo invitó a jugar.", "Amable", "Tímida", "Impaciente"),
  pt("¿Cómo es Bruno?", "—¡Yo primero! ¡Yo primero! —gritó Bruno, y empujó a los demás para subir al columpio.", "Egoísta", "Generoso", "Miedoso"),
  pt("¿Cómo es Irene?", "Irene se cayó tres veces de la bicicleta. Se sacudió el polvo y dijo: «Una vez más».", "Perseverante", "Perezosa", "Distraída"),
  pt("¿Cómo es el abuelo?", "El abuelo escuchó la pregunta por cuarta vez. Sonrió y volvió a explicarla, despacio.", "Paciente", "Gruñón", "Olvidadizo"),
  pt("¿Cómo es Dario?", "—Fui yo quien rompió la ventana —dijo Darío, mirando a la directora—. Lo siento mucho.", "Honesto", "Mentiroso", "Orgulloso"),
  pt("¿Cómo es Mila?", "Mila abrió la caja, sacó cada pieza y preguntó: «¿Y esto para qué sirve? ¿Y cómo funciona?».", "Curiosa", "Callada", "Asustadiza"),
  pt("¿Cómo es Simón?", "Simón subió al escenario sin temblar y cantó frente a toda la escuela.", "Valiente", "Envidioso", "Desordenado"),
];

const STORY_ELEMENTS = [
  read("El puente roto", "🌉", "En el pueblo de Chacas, una lluvia fuerte rompió el puente del río. Los niños no podían cruzar para ir a la escuela. Doña Juana propuso que todos trajeran troncos y sogas. En dos días, los vecinos armaron un puente nuevo.",
    ["¿Dónde ocurre el cuento?", "En el pueblo de Chacas", "En una gran ciudad", "En una isla desierta del océano"],
    ["¿Cuál es el problema?", "La lluvia rompió el puente.", "La escuela estaba cerrada por vacaciones.", "Doña Juana se enfermó."],
    ["¿Cómo se resuelve el problema?", "Los vecinos arman un puente nuevo.", "Los niños nadan cada día.", "Deja de llover para siempre en el pueblo."],
    ["¿Quién propone la solución?", "Doña Juana", "El alcalde", "Los niños"]),
  read("El concurso de cometas", "🪁", "El domingo era el concurso de cometas en la playa. La cometa de Inés se rompió una hora antes. Su primo Gael le prestó papel y cañas, y juntos armaron otra. La nueva cometa voló tan alto que ganó el segundo lugar.",
    ["¿Quiénes son los personajes?", "Inés y Gael", "Inés y su maestra", "Un juez"],
    ["¿Cuál es el problema?", "La cometa de Inés se rompió.", "No había viento.", "El concurso se canceló por la lluvia."],
    ["¿Cuándo ocurre el cuento?", "El domingo", "El lunes", "En la noche"],
    ["¿Cómo termina el cuento?", "Ganan el segundo lugar.", "Pierden la cometa.", "Se van a casa tristes y sin cometa."]),
];

const INFO_ORDER: OrderItem[] = [
  { t: "Cómo nace una mariposa", seq: ["La mariposa pone un huevo.", "Del huevo sale una oruga.", "La oruga forma una crisálida.", "De la crisálida sale la mariposa."] },
  { t: "Cómo llega el agua a tu casa", seq: ["La lluvia llena ríos y lagunas.", "El agua se lleva a una planta.", "En la planta se limpia el agua.", "El agua viaja por tuberías hasta tu casa."] },
  { t: "Cómo se hace el chocolate", seq: ["Se cosechan los frutos del cacao.", "Se secan y se tuestan las semillas.", "Las semillas se muelen.", "La pasta se mezcla con azúcar."] },
  { t: "Cómo se hace un libro", seq: ["El autor escribe el texto.", "El ilustrador hace los dibujos.", "La imprenta imprime las páginas.", "El libro llega a la librería."] },
  { t: "El ciclo del agua", seq: ["El sol calienta el agua del mar.", "El agua sube como vapor.", "El vapor forma nubes.", "Las nubes dejan caer la lluvia."] },
  { t: "Cómo crece una planta de frijol", seq: ["Se siembra la semilla.", "Sale una raíz pequeña.", "Brota el tallo con hojas.", "La planta da flores y vainas."] },
];

const COMPARE = [
  read("Ranas y sapos", "🐸", "Las ranas y los sapos son anfibios: nacen en el agua y de adultos respiran aire. Las ranas tienen la piel lisa y húmeda, y dan grandes saltos. Los sapos tienen la piel seca y rugosa, y prefieren caminar.",
    ["¿En qué se parecen las ranas y los sapos?", "Los dos son anfibios.", "Los dos son peces.", "Los dos prefieren caminar."],
    ["¿En qué se diferencian?", "En la piel y en cómo se mueven", "En que solo las ranas nacen en el agua", "En que los sapos no respiran"],
    ["¿Cómo es la piel del sapo?", "Seca y rugosa", "Lisa y húmeda", "Con plumas"]),
  read("La costa y la sierra", "🏔️", "En la costa del Perú casi no llueve y el clima es templado. Allí se pesca y se cultiva algodón. En la sierra hace más frío y llueve en verano. Allí se cultivan papas y se crían alpacas. En las dos regiones la gente celebra fiestas con música y baile.",
    ["¿En qué se parecen las dos regiones?", "En las dos hay fiestas con música.", "En las dos llueve mucho.", "En las dos se crían alpacas y se pesca."],
    ["¿Qué se cultiva en la sierra?", "Papas", "Algodón", "Arroz"],
    ["¿En qué se diferencia el clima?", "En la sierra hace más frío.", "En la costa nieva.", "En las dos es exactamente igual todo el año."]),
];

const CAUSE_EFFECT = pool([
  ["Causa: Olvidé regar la planta durante dos semanas.", "Efecto: La planta se marchitó."],
  ["Causa: Llovió toda la noche.", "Efecto: Las calles se mojaron."],
  ["Causa: Marta practicó piano todos los días.", "Efecto: Tocó bien en el recital."],
  ["Causa: Dejé el helado fuera de la refrigeradora.", "Efecto: El helado se derritió."],
  ["Causa: El despertador no sonó.", "Efecto: Llegué tarde a clases."],
  ["Causa: Comí demasiados dulces.", "Efecto: Me dolió la barriga."],
  ["Causa: Sopló un viento muy fuerte.", "Efecto: Se voló mi sombrero."],
  ["Causa: Pisé la cáscara de plátano.", "Efecto: Me resbalé y me caí."],
]);

const CAUSE_INFO: ChoiceItem[] = [
  pt("Según el texto, ¿por qué los osos duermen en invierno?", "En invierno hay poca comida en el bosque. Por eso, los osos duermen durante meses y así gastan menos energía.", "Porque hay poca comida", "Porque hace calor", "Porque les gusta soñar con peces"),
  pt("Según el texto, ¿qué efecto tiene el humo de los carros?", "Los carros echan humo al aire. Como resultado, el aire de las ciudades se ensucia y es más difícil respirar.", "El aire se ensucia.", "Llueve más.", "Las ciudades se vuelven más silenciosas."),
  pt("Según el texto, ¿qué causa las mareas?", "La Luna atrae el agua del mar. Debido a eso, el mar sube y baja dos veces al día.", "La atracción de la Luna", "El viento del norte", "Los barcos que pasan por el puerto"),
  pt("Según el texto, ¿qué pasa cuando talan los árboles?", "Cuando se talan los árboles, los animales pierden su hogar y el suelo se queda sin protección.", "Los animales pierden su hogar.", "Llueve más.", "El suelo se vuelve más fuerte y fértil."),
  pt("Según el texto, ¿por qué los flamencos son rosados?", "Los flamencos comen pequeños camarones de color rojizo. Por eso sus plumas se vuelven rosadas.", "Por lo que comen", "Por el sol", "Porque se pintan con barro rojo"),
  pt("Según el texto, ¿qué efecto tiene el ejercicio?", "Hacer ejercicio fortalece el corazón. En consecuencia, nos cansamos menos al correr o subir escaleras.", "Nos cansamos menos.", "Dormimos peor.", "El corazón se vuelve más pequeño y débil."),
];

const PROBLEM_SOLUTION = pool([
  ["Problema: La biblioteca tiene pocos libros.", "Solución: Hacer una campaña para donar libros."],
  ["Problema: El patio se llena de basura en el recreo.", "Solución: Poner más tachos y brigadas de limpieza."],
  ["Problema: Julia olvida sus tareas.", "Solución: Anotarlas cada día en una agenda escolar."],
  ["Problema: El perro escapa por un hueco de la reja.", "Solución: Reparar el hueco de la reja con alambre."],
  ["Problema: Hace mucho frío en el salón.", "Solución: Cerrar las ventanas y abrigarse más."],
  ["Problema: Dos amigos quieren el mismo columpio.", "Solución: Turnarse el columpio cada cinco minutos."],
  ["Problema: Las plantas del huerto se secan.", "Solución: Hacer un horario de riego para todos."],
]);

const STRUCTURE = sorter(["Secuencia", "Comparación", "Causa y efecto", "Problema y solución", "Descripción"], "¿Cómo está organizado el texto?");
const STRUCTURES: ChoiceItem[] = [
  STRUCTURE("Primero se mezcla la harina con agua. Luego se amasa. Después se deja reposar y, por último, se hornea.", 0),
  STRUCTURE("El lobo y el perro se parecen, pero el lobo vive en libertad y el perro, en cambio, vive con las personas.", 1),
  STRUCTURE("No llovió en meses. Por eso, los ríos se secaron y las cosechas se perdieron.", 2),
  STRUCTURE("Las calles se inundaban cada verano. Para resolverlo, los vecinos construyeron canales.", 3),
  STRUCTURE("El tucán tiene un pico enorme y colorido, plumas negras y ojos rodeados de azul.", 4),
  STRUCTURE("Al amanecer, el pescador prepara su red. Más tarde sale al mar. Al atardecer vuelve con la pesca.", 0),
  STRUCTURE("Tanto la guitarra como el charango tienen cuerdas; sin embargo, el charango es mucho más pequeño.", 1),
  STRUCTURE("Como el volcán lanzó ceniza, cerraron el aeropuerto y cancelaron los vuelos.", 2),
  STRUCTURE("Muchos niños llegaban sin desayunar. La escuela decidió servir desayuno cada mañana.", 3),
  STRUCTURE("La selva es húmeda y muy verde. Está llena de árboles altísimos, lianas y ríos anchos.", 4),
];

const SENSE = sorter(["Vista", "Oído", "Olfato", "Gusto", "Tacto"], "¿A qué sentido corresponde el detalle?");
const SENSES: ChoiceItem[] = [
  SENSE("El cielo se tiñó de naranja y rosado.", 0), SENSE("Las hojas secas crujían bajo mis pies.", 1), SENSE("El aroma del pan recién horneado llenó la casa.", 2),
  SENSE("La limonada estaba ácida y helada.", 3), SENSE("La manta era suave y tibia.", 4), SENSE("Las luces de colores parpadeaban.", 0),
  SENSE("El trueno retumbó a lo lejos.", 1), SENSE("El basurero apestaba a pescado.", 2), SENSE("El chocolate amargo se derritió en mi boca.", 3),
  SENSE("La arena caliente me quemaba los pies.", 4), SENSE("Un silbido agudo cortó el silencio.", 1), SENSE("El jardín olía a jazmín.", 2),
];
const SENSORY_ID: ChoiceItem[] = [
  w("¿Qué oración tiene un detalle sensorial?", "El caldo humeante olía a hierbabuena.", "Almorzamos a la una.", "Mi tía cocina los domingos en su casa."),
  w("¿Qué oración tiene un detalle sensorial?", "La lana áspera me picaba en el cuello.", "Tengo una chompa.", "Mi abuela teje chompas para toda la familia."),
  w("¿Qué oración tiene un detalle sensorial?", "Las campanas repicaron con un tañido grave.", "Hay una iglesia.", "La iglesia queda a dos cuadras de la plaza."),
  w("¿Qué oración tiene un detalle sensorial?", "El mango maduro goteaba un jugo dulcísimo.", "Compré fruta.", "En el mercado venden frutas de la selva."),
  w("¿Qué oración tiene un detalle sensorial?", "Una neblina gris cubría los techos rojos.", "Era temprano.", "La ciudad tiene muchas casas y edificios."),
  pt("¿Qué palabras son el detalle sensorial?", "Entramos a la cocina y un olor a canela nos recibió.", "un olor a canela", "Entramos a la cocina", "nos recibió"),
  pt("¿Qué palabras son el detalle sensorial?", "El gatito, de pelaje sedoso, dormía en la silla.", "de pelaje sedoso", "El gatito", "dormía en la silla"),
  pt("¿Qué palabras son el detalle sensorial?", "A medianoche, el búho ululó con un sonido hueco.", "ululó con un sonido hueco", "A medianoche", "el búho"),
];

const SIMILE_PICS = pool([
  ["🐆", "Rápido como un guepardo"], ["🐢", "Lento como una tortuga"], ["🪶", "Ligero como una pluma"], ["🦁", "Valiente como un león"],
  ["🧊", "Frío como el hielo"], ["☀️", "Brillante como el sol"], ["🐝", "Trabajador como una abeja"], ["🪨", "Duro como una roca"],
  ["🦊", "Astuto como un zorro"], ["🐑", "Manso como un cordero"],
], "pic");

const SIMILE_MEANING: ChoiceItem[] = [
  pt("¿Qué significa el símil?", "Después del paseo, Leo durmió como un tronco.", "Durmió profundamente.", "Durmió en el bosque.", "Durmió muy poco y con frío."),
  pt("¿Qué significa el símil?", "La noticia corrió como la pólvora.", "Se difundió muy rápido.", "Explotó.", "Nadie se enteró de lo que pasó."),
  pt("¿Qué significa el símil?", "Mi mochila pesa como una piedra.", "Es muy pesada.", "Es de piedra.", "Está vacía y es muy liviana."),
  pt("¿Qué significa el símil?", "Ana canta como un ruiseñor.", "Canta muy bonito.", "Canta en un árbol.", "Canta tan bajito que nadie la oye."),
  pt("¿Qué significa el símil?", "El salón quedó como una patena.", "Quedó muy limpio.", "Quedó vacío.", "Quedó lleno de platos sucios."),
  pt("¿Qué significa el símil?", "Sus ojos brillaban como dos luceros.", "Brillaban mucho.", "Estaban cerrados.", "Eran de color negro y pequeños."),
  pt("¿Qué significa el símil?", "Los hermanos son como el agua y el aceite.", "Son muy distintos.", "Son líquidos.", "Se parecen tanto que los confunden."),
  pt("¿Qué significa el símil?", "El bebé es dulce como la miel.", "Es muy tierno.", "Come miel.", "Llora todo el día sin parar."),
];

const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿En qué se parecen las dos ilustraciones?", "Ilustración 1 🌞: El dios Sol aparece en lo alto, con rayos dorados, sobre unos campos de maíz.\nIlustración 2 🌙: La diosa Luna aparece en lo alto, con luz plateada, sobre el mar.", "Las dos muestran a un dios en lo alto del cielo.", "Las dos muestran el mar.", "Las dos tienen rayos dorados sobre campos de maíz."),
  pt("¿En qué se diferencian las dos ilustraciones?", "Ilustración 1 🌞: El dios Sol aparece en lo alto, con rayos dorados, sobre unos campos de maíz.\nIlustración 2 🌙: La diosa Luna aparece en lo alto, con luz plateada, sobre el mar.", "En los colores y en el lugar que iluminan", "En que solo una de las dos muestra un dios en el cielo", "En nada: son idénticas"),
  pt("¿Cómo se ve al héroe en la Ilustración 1?", "Ilustración 1 ⚔️: El héroe, pequeño, mira hacia arriba a una serpiente gigante.\nIlustración 2 🏆: El héroe, de pie sobre una roca, levanta su lanza y la serpiente huye.", "Pequeño y en peligro", "Fuerte y victorioso", "Dormido junto a la serpiente"),
  pt("¿Qué cambia de la Ilustración 1 a la 2?", "Ilustración 1 ⚔️: El héroe, pequeño, mira hacia arriba a una serpiente gigante.\nIlustración 2 🏆: El héroe, de pie sobre una roca, levanta su lanza y la serpiente huye.", "El héroe pasa de estar en peligro a vencer.", "La serpiente crece.", "El héroe pierde su lanza y se esconde tras la roca."),
  pt("¿Qué ilustración muestra mejor que el río es peligroso?", "Ilustración 1 🌊: Un río oscuro y revuelto, con olas que golpean las rocas.\nIlustración 2 🏞️: Un río celeste y tranquilo, con patos y flores en la orilla.", "La Ilustración 1", "La Ilustración 2", "Ninguna de las dos"),
  pt("¿Qué sentimiento transmite la Ilustración 2?", "Ilustración 1 🌊: Un río oscuro y revuelto, con olas que golpean las rocas.\nIlustración 2 🏞️: Un río celeste y tranquilo, con patos y flores en la orilla.", "Calma", "Miedo", "Enojo"),
];

const FEATURES: ChoiceItem[] = [
  w("Quieres saber en qué página empieza el capítulo 3. ¿Qué parte del libro usas?", "El índice", "El glosario", "La portada"),
  w("No entiendes la palabra «hábitat» en tu libro de ciencias. ¿Dónde buscas su significado?", "En el glosario", "En el índice", "En el título"),
  w("¿Para qué sirve el pie de foto?", "Para explicar lo que muestra la imagen", "Para decorar", "Para decir cuántas páginas tiene el libro"),
  w("¿Para qué sirven los subtítulos de un texto?", "Para indicar de qué trata cada parte", "Para numerar", "Para mostrar quién dibujó las imágenes del libro"),
  w("En un texto, algunas palabras están en negrita. ¿Qué indica eso?", "Que son palabras importantes", "Que sobran", "Que se deben leer en voz muy baja"),
  w("¿Qué muestra un diagrama con flechas y nombres?", "Las partes de algo", "Un cuento", "La lista de los autores y sus cumpleaños"),
  w("¿Para qué sirve una línea de tiempo?", "Para mostrar hechos en orden", "Para medir", "Para comparar los precios de dos productos"),
  w("¿Qué te ayuda a ubicar un país o una ciudad?", "Un mapa", "Un glosario", "Un pie de foto"),
  w("Quieres comparar cuánto llovió en cada mes. ¿Qué elemento del texto te ayuda más?", "Un gráfico de barras", "Un título", "Una palabra en negrita"),
];

const RHYME = sorter(["AABB", "ABAB", "ABBA", "ABCB"], "¿Cuál es el esquema de rima del poema?");
const RHYME_SCHEMES: ChoiceItem[] = [
  RHYME("La luna salió temprano, (A)\nme saludó con la mano. (?)\nEl sol se fue a descansar (?)\nallá, detrás del mar. (?)", 0),
  RHYME("En el jardín hay una flor, (A)\nla riega siempre mi hermana. (?)\nTiene perfume y color (?)\ny se abre cada mañana. (?)", 1),
  RHYME("Mi gato duerme en el sillón, (A)\nsueña que caza una estrella, (?)\nbrilla en sus ojos la huella (?)\nde su valiente corazón. (?)", 2),
  RHYME("Canta el río en la montaña, (A)\nbaja saltando entre piedras, (?)\nlleva en sus aguas un sueño (?)\nque cruza montes y selvas. (?)", 3),
  RHYME("Corre, corre, caracol, (A)\nque ya está saliendo el sol. (?)\nNo te vayas a mojar, (?)\nque el rocío va a llegar. (?)", 0),
  RHYME("Vuela alto la cometa, (A)\nsobre el cerro y sobre el mar. (?)\nEs del viento la poeta (?)\nque no deja de bailar. (?)", 1),
  RHYME("Tengo un barco de papel, (A)\nlo empuja la brisa buena, (?)\nnavega sobre la arena (?)\ncomo un velero fiel. (?)", 2),
];

const POEM = sorter(["Poema con rima", "Verso libre (sin rima)", "Adivinanza", "Haiku (tres versos muy cortos)"], "¿Qué tipo de poema es?");
const POEM_TYPES: ChoiceItem[] = [
  POEM("Oro parece,\nplata no es.\nEl que no lo adivine\nbien tonto es.", 2),
  POEM("La tarde cae.\nUn pájaro en la rama\nmira el silencio.", 3),
  POEM("El mar no pide permiso.\nLlega,\ndeja sus cosas en la arena\ny se va sin despedirse.", 1),
  POEM("Pajarito que cantas\nen la laguna,\nno despiertes al niño\nque está en la cuna.", 0),
  POEM("Tengo agujas y no sé coser,\ntengo números y no sé leer.\n¿Qué soy?", 2),
  POEM("Sobre la hoja,\nuna gota de lluvia\nguarda la luna.", 3),
  POEM("Mi abuela guarda botones\nen una lata de galletas.\nCada botón\nes una historia.", 1),
  POEM("A la rueda, rueda,\nde pan y canela,\ndame un besito\ny vete a la escuela.", 0),
];

const LIT1 = {
  fantasy: [
    read("El árbol de los deseos", "🌳", "🌳✨ En lo alto del cerro crecía un árbol que cumplía deseos. Nina pidió una montaña de caramelos y se cumplió, pero le dolió la muela. Luego pidió que su abuelo, que estaba enfermo, sanara. El árbol movió sus hojas y, esa tarde, el abuelo se levantó a jugar con ella.",
      ["¿Qué tiene de especial el árbol?", "Cumple deseos.", "Da caramelos.", "Habla con las personas del pueblo."],
      ["¿Qué pasó con el primer deseo?", "Le dolió la muela.", "No se cumplió.", "Se lo regaló a su abuelo."],
      ["¿Cuál fue el segundo deseo?", "Que su abuelo sanara", "Tener más caramelos", "Ser la dueña del árbol"]),
    read("La llave del mar", "🗝️", "🗝️🌊 Bruno halló en la playa una llave de coral. Al meterla en la arena, se abrió una puerta al fondo del mar. Allí, los peces le pidieron ayuda: una red los tenía atrapados. Bruno cortó la red con una concha y los peces lo llevaron de vuelta a la orilla.",
      ["¿De qué estaba hecha la llave?", "De coral", "De oro", "De madera"],
      ["¿Qué problema tenían los peces?", "Estaban atrapados en una red.", "No tenían comida.", "Habían perdido su llave de coral."],
      ["¿Con qué cortó Bruno la red?", "Con una concha", "Con la llave", "Con sus dientes"]),
  ],
  historical: [
    read("El chasqui Illari", "🏃", "🏃⛰️ En tiempos de los incas, Illari era un joven chasqui. Su tarea era correr por los caminos de piedra llevando mensajes. Un día debía entregar un quipu al siguiente puesto antes de que anocheciera. Corrió entre la neblina, cruzó un puente colgante y llegó justo cuando salía la primera estrella.",
      ["¿En qué época ocurre el cuento?", "En tiempos de los incas", "En la actualidad, en una ciudad", "En el futuro"],
      ["¿Cuál era el trabajo de Illari?", "Llevar mensajes corriendo", "Tejer quipus", "Construir puentes colgantes de piedra"],
      ["¿Cuándo llegó a su destino?", "Cuando salía la primera estrella", "Al mediodía", "Al día siguiente, después del desayuno"]),
    read("La escuela de la abuela", "🏫", "🏫🕰️ Hace muchos años, cuando la abuela Rosa era niña, en su pueblo no había luz eléctrica. Caminaba una hora para llegar a la escuela y escribía con pluma y tintero. De noche hacía la tarea junto a una lámpara de kerosene. «Así aprendí a leer», cuenta orgullosa.",
      ["¿Cómo llegaba la abuela a la escuela?", "Caminando una hora", "En bus", "A caballo con su papá"],
      ["¿Con qué escribía?", "Con pluma y tintero", "Con lapicero", "Con tiza en una pizarra pequeña"],
      ["¿Con qué se alumbraba de noche?", "Con una lámpara de kerosene", "Con un foco", "Con una linterna de pilas muy grande"]),
  ],
  scifi: [
    read("El robot jardinero", "🤖", "🤖🌱 En el año 2150, Zeta era un robot que cuidaba el último jardín de la ciudad. Un día, su batería empezó a fallar. Los niños del barrio construyeron un panel solar con piezas viejas y lo conectaron a su espalda. Desde entonces, Zeta funciona con la luz del sol.",
      ["¿Cuándo ocurre el cuento?", "En el futuro", "En el pasado", "Ayer"],
      ["¿Qué problema tenía Zeta?", "Su batería fallaba.", "Se oxidó.", "No sabía regar las plantas."],
      ["¿Cómo lo ayudaron los niños?", "Con un panel solar", "Con una batería nueva", "Con agua"]),
    read("Vacaciones en Marte", "🚀", "🚀🔴 La familia Quispe viajó a Marte en una nave escolar. Allí, Kori notó que al saltar subía muy alto, porque en Marte todo pesa menos. Jugó vóley con una pelota que tardaba en caer. Al volver a la Tierra, extrañó sus grandes saltos.",
      ["¿A dónde viajó la familia?", "A Marte", "A la Luna", "A Júpiter"],
      ["¿Por qué Kori saltaba tan alto?", "Porque en Marte todo pesa menos", "Porque usaba resortes", "Porque había muchísimo viento ese día"],
      ["¿Qué extrañó Kori?", "Sus grandes saltos", "Su nave", "La comida de la nave"]),
  ],
  realistic: [
    read("La nueva del salón", "🎒", "🎒🙂 Keiko llegó a la escuela a mitad de año. No conocía a nadie y almorzó sola. Al día siguiente, Fabián le ofreció la mitad de su pan con palta y le enseñó a jugar a los siete pecados. Desde ese día, Keiko ya no almuerza sola.",
      ["¿Por qué Keiko almorzó sola?", "Porque no conocía a nadie", "Porque estaba castigada", "Porque no tenía hambre"],
      ["¿Qué hizo Fabián?", "Compartió su pan y la invitó a jugar", "Se burló de ella", "Le pidió su lonchera y se fue sin decir nada"],
      ["¿Cómo cambió Keiko al final?", "Ya tiene compañía.", "Se cambió de escuela.", "Sigue sola."]),
    read("El diente flojo", "🦷", "🦷😬 A Mauro se le movía un diente y tenía miedo de que se cayera. No quiso morder la manzana ni el choclo. En el recreo, se rió tanto con un chiste que el diente saltó solo. No le dolió nada, y esa noche lo puso bajo su almohada.",
      ["¿De qué tenía miedo Mauro?", "De que se le cayera el diente", "Del dentista", "De la oscuridad de su cuarto de noche"],
      ["¿Cómo se le cayó el diente?", "Al reírse de un chiste", "Al morder una manzana muy dura", "Al cepillarse"],
      ["¿Qué hizo con el diente?", "Lo puso bajo su almohada", "Lo botó", "Lo perdió en el patio de la escuela"]),
  ],
};

const LIT2 = {
  realistic1: [
    read("El examen de natación", "🏊", "Camila llevaba tres meses de clases y todavía no se animaba a soltarse del borde. El día del examen, su profesora le dijo: «No pienses en el fondo; piensa en la otra orilla». Camila respiró, pataleó con fuerza y cruzó la piscina sin detenerse. Al salir, temblaba, pero de alegría.",
      ["¿Qué le costaba a Camila?", "Soltarse del borde", "Ponerse el gorro", "Llegar temprano"],
      ["¿Qué consejo le dio la profesora?", "Pensar en la otra orilla", "Nadar con flotador toda la clase", "Cerrar los ojos"],
      ["¿Por qué temblaba al salir?", "De alegría", "De frío", "De miedo"]),
    read("La alcancía", "🐷", "Durante meses, Joaquín guardó sus propinas para comprarse unos patines. Cuando por fin tuvo el dinero, se enteró de que su hermana necesitaba lentes nuevos. Rompió la alcancía y le dio la mitad a su mamá. «Los patines pueden esperar», dijo.",
      ["¿Para qué ahorraba Joaquín?", "Para unos patines", "Para unos lentes", "Para una bicicleta"],
      ["¿Qué hizo con su dinero?", "Dio la mitad para los lentes", "Compró los patines y unas rodilleras", "Lo guardó todo"],
      ["¿Cómo es Joaquín?", "Generoso", "Egoísta", "Flojo"]),
  ],
  realistic2: [
    read("El trabajo en grupo", "📋", "A Luana le tocó trabajar con Piero, que nunca hablaba en clase. Ella quería hacerlo todo sola, pero Piero le mostró un cuaderno lleno de dibujos de volcanes. Decidieron que él ilustraría y ella escribiría. Su lámina fue la más aplaudida del salón.",
      ["¿Qué pensaba Luana al inicio?", "Que haría todo sola", "Que Piero mandaría", "Que no harían nada"],
      ["¿Qué talento tenía Piero?", "Dibujaba muy bien", "Cantaba", "Hablaba mucho en clase"],
      ["¿Qué aprendió Luana?", "Que cada uno puede aportar algo", "Que es mejor trabajar sola", "Que los volcanes son peligrosos"]),
    read("La mudanza", "📦", "Esteban no quería mudarse: dejaría su cuarto, su parque y a su mejor amigo. La primera noche en la casa nueva no pudo dormir. A la mañana siguiente, descubrió que desde su ventana se veía el mar y que al lado vivía un niño con un perro enorme. «Quizás no sea tan malo», pensó.",
      ["¿Por qué Esteban no quería mudarse?", "Porque dejaría a su amigo y su parque", "Porque la casa era pequeña", "Porque le daba miedo vivir cerca del mar"],
      ["¿Qué descubrió por la mañana?", "Que se veía el mar", "Que no había vecinos", "Que llovía"],
      ["¿Cómo cambia Esteban al final?", "Empieza a aceptar la mudanza.", "Se enoja más.", "Vuelve a su casa antigua con su amigo."]),
  ],
  historical: [
    read("El día de la independencia", "🇵🇪", "El 28 de julio de 1821, Micaela, de nueve años, se abrió paso entre la multitud de la plaza de Lima. Desde los hombros de su padre vio a un general levantar una bandera roja y blanca. La gente gritaba y lloraba de emoción. Micaela no entendía todo, pero supo que ese día era distinto.",
      ["¿En qué año ocurre el relato?", "En 1821", "En 1921", "En 2021"],
      ["¿Qué vio Micaela?", "A un general levantar una bandera", "Un desfile de carros y camiones nuevos", "Fuegos artificiales"],
      ["¿Cómo estaba la gente?", "Emocionada", "Aburrida", "Asustada"]),
    read("El barco de vapor", "🚢", "En 1900, Tomás viajó por primera vez en un barco de vapor por el río Amazonas. La chimenea echaba humo negro y la rueda de paletas salpicaba agua. El viaje hasta Iquitos duró muchos días. De noche, Tomás dormía en una hamaca escuchando a las ranas.",
      ["¿En qué viajó Tomás?", "En un barco de vapor", "En un avión", "En una canoa de madera"],
      ["¿A dónde iba?", "A Iquitos", "A Lima", "A Cusco"],
      ["¿Dónde dormía?", "En una hamaca", "En una cama", "En la orilla"]),
  ],
  poetry: [
    read("Canción del río", "🏞️", "Baja cantando el río\ndesde el nevado,\ntrae en sus aguas frías\nun sol mojado.\n\nSalta sobre las piedras,\nríe en la orilla,\ny en la chacra se queda\nhecho semilla.",
      ["¿De dónde baja el río?", "Del nevado", "Del mar", "De la ciudad"],
      ["¿Qué quiere decir «en la chacra se queda hecho semilla»?", "Que el agua hace crecer las plantas", "Que el río se seca", "Que el río lleva semillas en botes pequeños"],
      ["¿Cómo se presenta al río en el poema?", "Como alguien alegre que canta y ríe", "Como alguien triste", "Como alguien enojado que grita y golpea"]),
    read("Mi sombra", "👤", "Tengo una amiga callada\nque camina junto a mí;\nsi yo salto, ella salta,\nsi me río, no la oí.\n\nDe mañana es larga, larga;\nal mediodía, enanita;\ny cuando apago la luz\nse esconde bajo mi camita.",
      ["¿Quién es la «amiga callada»?", "La sombra", "Una vecina", "Una muñeca"],
      ["¿Cómo es la sombra al mediodía?", "Pequeña", "Larga", "Invisible"],
      ["¿Qué pasa cuando se apaga la luz?", "La sombra desaparece.", "La sombra crece hasta el techo.", "La sombra habla."]),
  ],
};

const INFO1 = {
  animals: [
    read("El oso de anteojos", "🐻", "El oso de anteojos es el único oso de Sudamérica. Tiene manchas claras alrededor de los ojos, como si usara lentes. Vive en los bosques de los Andes y es un gran trepador. Come sobre todo frutas y plantas. Está en peligro porque se talan los bosques donde vive.",
      ["¿Por qué se llama «de anteojos»?", "Por las manchas alrededor de sus ojos", "Porque ve mal", "Porque usa lentes para ver de lejos y de cerca"],
      ["¿Qué come sobre todo?", "Frutas y plantas", "Peces", "Otros osos más pequeños"],
      ["¿Por qué está en peligro?", "Porque talan los bosques", "Porque hace frío", "Porque no sabe trepar a los árboles"]),
    read("El paiche", "🐟", "El paiche es uno de los peces de agua dulce más grandes del mundo. Vive en los ríos de la Amazonía y puede medir hasta tres metros. Aunque es un pez, sube a la superficie a respirar aire cada pocos minutos. Sus escamas son tan duras que se usan como limas.",
      ["¿Dónde vive el paiche?", "En ríos de la Amazonía", "En el mar", "En lagunas de la sierra"],
      ["¿Qué tiene de especial su respiración?", "Sube a respirar aire.", "No respira.", "Respira por la cola y las aletas."],
      ["¿Para qué se usan sus escamas?", "Como limas", "Como monedas", "Como comida"]),
  ],
  food: [
    read("El ceviche", "🍋", "El ceviche es un plato típico del Perú. Se prepara con pescado fresco cortado en trozos, jugo de limón, cebolla, ají y sal. El limón «cocina» el pescado sin usar fuego. Suele servirse con camote y choclo. Cada 28 de junio se celebra el Día del Ceviche.",
      ["¿Qué ingrediente «cocina» el pescado?", "El limón", "El ají", "La sal"],
      ["¿Con qué se sirve?", "Con camote y choclo", "Con arroz y papas fritas", "Con pan"],
      ["¿Cuándo es el Día del Ceviche?", "El 28 de junio", "El 28 de julio", "El 1 de enero"]),
    read("El cacao", "🍫", "El chocolate viene de un árbol llamado cacao. Sus frutos crecen pegados al tronco y guardan semillas blancas. Las semillas se fermentan, se secan y se tuestan hasta volverse marrones. Luego se muelen para hacer chocolate. El cacao crece en lugares cálidos y lluviosos.",
      ["¿De dónde viene el chocolate?", "Del cacao", "Del café", "De la caña"],
      ["¿De qué color son las semillas frescas?", "Blancas", "Marrones", "Negras"],
      ["¿Dónde crece el cacao?", "En lugares cálidos y lluviosos", "En el desierto, donde nunca llueve", "En la nieve"]),
  ],
  art: [
    read("La marinera", "💃", "La marinera es un baile tradicional del Perú. Lo bailan parejas con pañuelos blancos al ritmo de la banda. La mujer suele bailar descalza y luce una falda amplia. En Trujillo se realiza cada año un gran concurso al que llegan bailarines de todo el país.",
      ["¿Qué llevan en la mano los bailarines?", "Pañuelos blancos", "Sombreros de paja", "Flores"],
      ["¿Dónde se hace el gran concurso?", "En Trujillo", "En Lima y Callao", "En Puno"],
      ["¿Cómo suele bailar la mujer?", "Descalza", "Con botas", "Sentada"]),
    read("Los retablos de Ayacucho", "🎨", "Un retablo es una caja de madera pintada con flores que guarda figuritas en su interior. Los artesanos de Ayacucho modelan las figuras con una pasta de papa y yeso. Dentro se ven fiestas, cosechas y escenas del pueblo. Abrir un retablo es como abrir una ventana a la vida de los Andes.",
      ["¿Qué es un retablo?", "Una caja con figuritas", "Un instrumento de cuerdas", "Un tejido"],
      ["¿Con qué se hacen las figuras?", "Con pasta de papa y yeso", "Con oro", "Con lana de oveja y de alpaca"],
      ["¿Qué escenas muestra?", "Fiestas y cosechas", "Batallas espaciales", "Animales marinos"]),
  ],
  sports: [
    read("El surf", "🏄", "El surf consiste en deslizarse sobre las olas de pie en una tabla. Hace miles de años, los antiguos pescadores del norte del Perú ya montaban olas en sus caballitos de totora. Hoy el surf es un deporte olímpico. Para practicarlo hay que saber nadar muy bien y respetar el mar.",
      ["¿Sobre qué se desliza el surfista?", "Sobre una tabla", "Sobre un bote", "Sobre esquís"],
      ["¿En qué montaban olas los antiguos pescadores?", "En caballitos de totora", "En tablas de plástico", "En balsas de metal muy pesadas"],
      ["¿Qué se necesita para practicarlo?", "Saber nadar muy bien", "Tener un caballo", "Vivir en la sierra muchos años"]),
    read("Coleccionar estampillas", "📮", "Coleccionar estampillas se llama filatelia. Los coleccionistas las guardan en álbumes y las ordenan por país o por tema, como animales o deportes. Algunas estampillas antiguas valen mucho dinero. Con este pasatiempo se aprende geografía e historia.",
      ["¿Cómo se llama este pasatiempo?", "Filatelia", "Cerámica fina", "Pesca"],
      ["¿Cómo ordenan las estampillas?", "Por país o por tema", "Por tamaño, de menor a mayor", "Por peso"],
      ["¿Qué se aprende con este pasatiempo?", "Geografía e historia", "Natación y otros deportes", "Cocina"]),
  ],
};

const INFO2 = {
  people: [
    read("José María Arguedas", "📚", "José María Arguedas fue un escritor peruano nacido en Andahuaylas en 1911. De niño vivió entre campesinos y aprendió quechua antes que castellano. En sus libros contó la vida, la música y los sueños de los pueblos andinos. Gracias a él, muchas personas valoran más la cultura de los Andes.",
      ["¿Dónde nació Arguedas?", "En Andahuaylas", "En Lima", "En la ciudad de Arequipa"],
      ["¿Qué idioma aprendió primero?", "Quechua", "Castellano", "Inglés"],
      ["¿De qué tratan sus libros?", "De la vida de los pueblos andinos", "De viajes al espacio y de naves marcianas", "De piratas"]),
    read("Frida Kahlo", "🎨", "Frida Kahlo fue una pintora mexicana. De joven sufrió un grave accidente y pasó mucho tiempo en cama. Allí empezó a pintar, usando un espejo para retratarse. Sus cuadros, llenos de color, muestran su vida, sus dolores y su amor por México.",
      ["¿De qué país era Frida Kahlo?", "De México", "Del Perú", "De España"],
      ["¿Por qué empezó a pintar?", "Porque pasó mucho tiempo en cama", "Porque se lo pidió un rey muy poderoso", "Porque quería ser famosa"],
      ["¿Qué usaba para retratarse?", "Un espejo", "Una foto", "Una ventana"]),
  ],
  places: [
    read("Las líneas de Nazca", "🏜️", "En el desierto de Nazca hay enormes dibujos trazados en el suelo hace unos dos mil años. Hay un colibrí, un mono, una araña y muchas líneas rectas. Son tan grandes que se ven mejor desde un avión. Todavía no se sabe con certeza para qué se hicieron.",
      ["¿Dónde están las líneas?", "En el desierto de Nazca", "En la selva, cerca del río Amazonas", "En el Cusco"],
      ["¿Desde dónde se ven mejor?", "Desde un avión", "Desde un barco", "Desde una cueva"],
      ["¿Se sabe para qué se hicieron?", "No con certeza", "Sí, para jugar", "Sí, para regar"]),
    read("Las islas Galápagos", "🐢", "Las islas Galápagos pertenecen al Ecuador y están en el océano Pacífico. Allí viven animales que no existen en ningún otro lugar, como las tortugas gigantes y las iguanas marinas. Como casi no hay depredadores, los animales no temen a las personas. Por eso, los visitantes deben seguir reglas estrictas para no dañarlas.",
      ["¿A qué país pertenecen?", "Al Ecuador", "Al Perú", "A Chile"],
      ["¿Qué animales viven allí?", "Tortugas gigantes e iguanas marinas", "Osos y lobos", "Leones, cebras, jirafas y elefantes grises"],
      ["¿Por qué hay reglas estrictas?", "Para no dañar a los animales", "Para cobrar más dinero a los turistas", "Porque hace frío"]),
  ],
  business: [
    read("Cómo funciona un mercado", "🛒", "En un mercado, los vendedores ofrecen productos y los compradores pagan por ellos. Cuando hay mucha fruta, su precio baja; cuando hay poca, sube. Los vendedores compran al por mayor a los agricultores y venden al por menor. Así, los alimentos del campo llegan a nuestra mesa.",
      ["¿Qué pasa con el precio cuando hay mucha fruta?", "Baja", "Sube", "No cambia"],
      ["¿A quién compran los vendedores?", "A los agricultores", "A los compradores del barrio", "A los bancos"],
      ["¿Qué significa «al por menor»?", "Vender en pequeñas cantidades", "Vender muy caro", "Vender solo de noche y en feriados"]),
    read("El código de barras", "📊", "Casi todos los productos tienen un código de barras: unas líneas negras con números. En la caja, un lector de luz lee las líneas y la computadora reconoce el producto y su precio. Así se cobra más rápido y la tienda sabe cuántos productos le quedan.",
      ["¿Qué es un código de barras?", "Líneas negras con números", "Un dibujo de colores con el precio", "Una firma"],
      ["¿Qué lee el código en la caja?", "Un lector de luz", "Un imán", "Una balanza muy precisa"],
      ["¿Para qué sirve además de cobrar?", "Para saber cuántos productos quedan", "Para adornar los productos con líneas bonitas", "Para pesar"]),
  ],
  science: [
    read("Los volcanes", "🌋", "Un volcán es una abertura en la corteza de la Tierra. Debajo hay roca derretida muy caliente llamada magma. Cuando el magma sale, se llama lava. Las erupciones pueden lanzar ceniza a muchos kilómetros. Con el tiempo, la ceniza vuelve muy fértil la tierra de los alrededores.",
      ["¿Cómo se llama la roca derretida bajo el volcán?", "Magma", "Ceniza", "Granito"],
      ["¿Cuándo se le llama lava?", "Cuando sale del volcán", "Cuando se enfría y se endurece", "Cuando llueve"],
      ["¿Qué efecto bueno tiene la ceniza?", "Vuelve fértil la tierra", "Apaga el volcán para siempre", "Limpia el aire"]),
    read("El sistema solar", "🪐", "El Sol es una estrella y a su alrededor giran ocho planetas. La Tierra es el tercero y el único donde sabemos que hay vida. Júpiter es el más grande y Mercurio, el más pequeño. La Tierra tarda un año en dar una vuelta completa al Sol.",
      ["¿Cuántos planetas giran alrededor del Sol?", "Ocho", "Siete", "Diez"],
      ["¿Cuál es el planeta más grande?", "Júpiter", "Mercurio", "La Tierra"],
      ["¿Cuánto tarda la Tierra en dar una vuelta al Sol?", "Un año", "Un día", "Un mes"]),
  ],
};

export const ROWS: Row[] = [
  ["H.1", "Usar detalles clave para determinar la idea principal", (r) => choose(r, "", KEY_DETAILS)],
  ["H.2", "Determinar la idea principal de un texto", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["H.3", "Identificar y analizar la idea principal de un texto", (r) => readPassage(r, MAIN_ANALYZE, false)],

  ["I.1", "¿Qué título de libro corresponde al dibujo?", (r) => choose(r, "¿Qué título de libro corresponde al dibujo?", BOOK_TITLES)],
  ["I.2", "Hacer inferencias a partir de un texto", (r) => choose(r, "", INFER)],
  ["I.3", "Hacer inferencias e identificar los detalles que las apoyan", (r) => readPassage(r, INFER_SUPPORT, false)],
  ["I.4", "Hacer predicciones sobre un cuento", (r) => choose(r, "", PREDICT)],
  ["I.5", "Determinar la enseñanza de mitos, fábulas y leyendas", (r) => readPassage(r, FABLES, false)],

  ["J.1", "Identificar el propósito del autor: distintos medios", (r) => choose(r, "", MEDIA)],
  ["J.2", "Identificar el propósito del autor: textos", (r) => choose(r, "", PASSAGE_PURPOSE)],
  ["J.3", "Distinguir puntos de vista", (r) => choose(r, "", POINT_OF_VIEW)],
  ["J.4", "Comparar la información de dos textos informativos", (r) => choose(r, "", TWO_TEXTS)],
  ["J.5", "Analizar textos que buscan convencer", (r) => readPassage(r, PERSUASIVE, false)],

  ["K.1", "Usar acciones y diálogos para entender a los personajes", (r) => choose(r, "", TRAITS)],

  ["L.1", "Identificar los elementos del cuento", (r) => readPassage(r, STORY_ELEMENTS, false)],

  ["M.1", "Determinar el orden de los hechos en textos informativos", (r) => order(r, "Ordena los pasos.", INFO_ORDER)],
  ["M.2", "Comparar y contrastar en textos informativos", (r) => readPassage(r, COMPARE, false)],
  ["M.3", "Relacionar causas con efectos", (r) => choose(r, "¿Qué efecto corresponde a la causa?", CAUSE_EFFECT)],
  ["M.4", "Relacionar causas y efectos en textos informativos", (r) => choose(r, "", CAUSE_INFO)],
  ["M.5", "Relacionar problemas con sus soluciones", (r) => choose(r, "¿Qué solución corresponde al problema?", PROBLEM_SOLUTION)],
  ["M.6", "Identificar y analizar estructuras de texto", (r) => choose(r, "", STRUCTURES)],

  ["N.1", "Clasificar detalles sensoriales", (r) => choose(r, "", SENSES)],
  ["N.2", "Identificar detalles sensoriales", (r) => choose(r, "", SENSORY_ID)],

  ["O.1", "Símiles con dibujos", (r) => choose(r, "¿Qué símil corresponde al dibujo?", SIMILE_PICS)],
  ["O.2", "Determinar el significado de los símiles", (r) => choose(r, "", SIMILE_MEANING)],

  ["P.1", "Comparar ilustraciones de mitos", (r) => choose(r, "", ILLUSTRATIONS)],

  ["Q.1", "Usar las partes de un texto", (r) => choose(r, "", FEATURES)],

  ["R.1", "Señalar el esquema de rima", (r) => choose(r, "", RHYME_SCHEMES)],
  ["R.2", "Identificar tipos de poemas", (r) => choose(r, "", POEM_TYPES)],

  ["S.1", "Leer fantasía con ilustraciones", (r) => readPassage(r, LIT1.fantasy, false)],
  ["S.2", "Leer ficción histórica con ilustraciones", (r) => readPassage(r, LIT1.historical, false)],
  ["S.3", "Leer ciencia ficción con ilustraciones", (r) => readPassage(r, LIT1.scifi, false)],
  ["S.4", "Leer cuentos realistas con ilustraciones", (r) => readPassage(r, LIT1.realistic, false)],

  ["T.1", "Leer cuentos realistas: grupo 1", (r) => readPassage(r, LIT2.realistic1, false)],
  ["T.2", "Leer cuentos realistas: grupo 2", (r) => readPassage(r, LIT2.realistic2, false)],
  ["T.3", "Leer ficción histórica", (r) => readPassage(r, LIT2.historical, false)],
  ["T.4", "Leer poesía", (r) => readPassage(r, LIT2.poetry, false)],

  ["U.1", "Leer sobre animales", (r) => readPassage(r, INFO1.animals, false)],
  ["U.2", "Leer sobre alimentos", (r) => readPassage(r, INFO1.food, false)],
  ["U.3", "Leer sobre arte, música y tradiciones", (r) => readPassage(r, INFO1.art, false)],
  ["U.4", "Leer sobre deportes y pasatiempos", (r) => readPassage(r, INFO1.sports, false)],

  ["V.1", "Leer sobre personajes famosos", (r) => readPassage(r, INFO2.people, false)],
  ["V.2", "Leer sobre lugares famosos", (r) => readPassage(r, INFO2.places, false)],
  ["V.3", "Leer sobre negocios y tecnología", (r) => readPassage(r, INFO2.business, false)],
  ["V.4", "Leer sobre ciencia y naturaleza", (r) => readPassage(r, INFO2.science, false)],
];
