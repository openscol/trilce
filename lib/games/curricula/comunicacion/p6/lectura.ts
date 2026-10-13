import { choose, readPassage, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { pool, pt, read, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Estrategias de lectura (IXL 6th grade ELA: A-H, J, M y N). Lecturas propias,
// con temas del Perú y de Latinoamérica. Las ilustraciones de IXL se reemplazan
// por descripciones; las alusiones usan fuentes conocidas en castellano.
// En H, IXL solo tiene publicado «Label the rhyme scheme» («Analyze poetry»
// figura como «Coming soon» y se omite).

export const SECTIONS: Section[] = [
  { id: "A", name: "Idea principal", icon: "💡" },
  { id: "B", name: "Tema", icon: "🧭" },
  { id: "C", name: "Propósito y punto de vista del autor", icon: "✍️" },
  { id: "D", name: "Tono", icon: "🎚️" },
  { id: "E", name: "Estructura del texto", icon: "🧱" },
  { id: "F", name: "Recursos literarios", icon: "✨" },
  { id: "G", name: "Analizar literatura", icon: "📖" },
  { id: "H", name: "Analizar poesía", icon: "🎶" },
  { id: "J", name: "Analizar argumentos", icon: "⚖️" },
  { id: "M", name: "Comparar textos", icon: "🔀" },
  { id: "N", name: "Elementos visuales", icon: "🖼️" },
];

// --- A. Idea principal -------------------------------------------------------

const MAIN_PASSAGES = [
  read("El idioma de las ballenas", "🐋", "Las ballenas jorobadas emiten secuencias de sonidos que pueden durar veinte minutos y repetirse durante horas. Los científicos las llaman «canciones». Lo más sorprendente es que todas las ballenas de una región cantan la misma, y que esa canción cambia poco a poco cada temporada. Cuando llega una melodía nueva desde otro océano, en un par de años todo el grupo la ha adoptado. Para muchos biólogos, esto demuestra que las ballenas aprenden unas de otras, es decir, que tienen algo parecido a una cultura.",
    ["¿Cuál es la idea principal del texto?", "Las canciones de las ballenas revelan que aprenden unas de otras.", "Las ballenas jorobadas viven en todos los océanos del planeta y migran cada año.", "Las ballenas cantan fuerte."],
    ["¿Qué detalle apoya mejor esa idea?", "Todo el grupo adopta una melodía nueva en pocos años.", "Las canciones duran veinte minutos.", "Los científicos graban a las ballenas con micrófonos que sumergen en el mar."],
    ["¿Qué quiere decir el autor con «algo parecido a una cultura»?", "Conductas que se transmiten por aprendizaje", "Un idioma con letras y gramática igual que el de las personas", "Un instinto con el que nacen"]),
  read("El precio de la ropa barata", "👕", "Una camiseta puede costar menos que un almuerzo. Sin embargo, fabricarla requiere unos 2700 litros de agua, la que bebe una persona en dos años y medio. Además, buena parte de la ropa que compramos se usa menos de diez veces antes de terminar en un botadero, donde las fibras sintéticas tardan siglos en degradarse. Lo que no pagamos en la tienda lo paga el ambiente. Por eso, cada vez más personas eligen comprar menos, reparar y heredar prendas.",
    ["¿Cuál es la idea principal del texto?", "La ropa barata tiene un alto costo ambiental.", "Las camisetas de algodón son las prendas más cómodas para el verano.", "La ropa se rompe pronto."],
    ["¿Qué frase resume esa idea dentro del texto?", "«Lo que no pagamos en la tienda lo paga el ambiente».", "«Una camiseta puede costar menos que un almuerzo».", "«Cada vez más personas eligen comprar menos, reparar y heredar prendas»."],
    ["¿Qué función cumple la última oración?", "Presenta una respuesta al problema.", "Repite el dato del agua con otras palabras más sencillas.", "Cambia de tema."]),
];

const TWO = "¿Qué idea se obtiene al combinar los dos textos?";
const TWO_MAIN: ChoiceItem[] = [
  pt(TWO, "Texto 1: Las ciudades iluminadas impiden ver las estrellas: un tercio de la humanidad ya no distingue la Vía Láctea.\nTexto 2: Las tortugas recién nacidas se guían por el brillo del mar; las luces de los hoteles las desorientan.", "La contaminación lumínica afecta a personas y animales.", "Las tortugas marinas prefieren anidar cerca de los hoteles iluminados.", "Las estrellas se apagan."),
  pt(TWO, "Texto 1: En el siglo XV, la imprenta abarató los libros y multiplicó los lectores.\nTexto 2: Hoy, con internet, cualquiera publica y accede a información en segundos.", "Las tecnologías de la comunicación amplían el acceso al conocimiento.", "La imprenta fue inventada gracias a internet y a las computadoras.", "Los libros ya no existen."),
  pt(TWO, "Texto 1: Tres de cada cuatro cultivos alimentarios dependen, al menos en parte, de los polinizadores.\nTexto 2: Las poblaciones de abejas han disminuido por el uso de pesticidas.", "La caída de los polinizadores pone en riesgo nuestros alimentos.", "Los pesticidas aumentan la cantidad de abejas en los cultivos.", "Las abejas no comen."),
  pt(TWO, "Texto 1: Los adolescentes necesitan entre ocho y diez horas de sueño.\nTexto 2: Usar pantallas de noche retrasa la hora en que el cerebro siente sueño.", "El uso nocturno de pantallas puede quitar horas de sueño necesarias.", "Los adolescentes deben dormir con el celular encendido bajo la almohada.", "Dormir no importa."),
  pt(TWO, "Texto 1: El aimara, el quechua y otras 46 lenguas son parte del patrimonio del Perú.\nTexto 2: Cada dos semanas desaparece una lengua en el mundo, y con ella sus relatos y saberes.", "Preservar las lenguas originarias protege conocimientos irreemplazables.", "En el Perú solo se habla una lengua desde hace muchos siglos.", "Las lenguas no cambian."),
  pt(TWO, "Texto 1: En Curitiba, un sistema de buses rápidos redujo el uso del auto.\nTexto 2: En Medellín, las escaleras eléctricas y los cables conectaron los barrios altos con el centro.", "El transporte público bien diseñado mejora la vida urbana.", "Las ciudades deben prohibir por completo todos los buses y los cables.", "Los autos son rápidos."),
];

// --- B. Tema -----------------------------------------------------------------

const QUOTE_THEMES = pool([
  ["«Tropecé diez veces en ese puente; a la undécima, lo crucé».", "La perseverancia"], ["«Devolvió la billetera sin contar los billetes».", "La honradez"], ["«Partió su pan en cuatro, aunque eran tres».", "La generosidad"],
  ["«Le temblaba la voz, pero dijo la verdad delante de todos».", "La valentía"], ["«Mientras él subía, olvidó a quienes sostenían la escalera».", "La ingratitud"], ["«Cada uno cargó una piedra, y entre todos levantaron el muro».", "La cooperación"],
  ["«Quiso todo el río para su chacra y se quedó sin vecinos».", "La codicia"], ["«No ganó la carrera; ganó algo mejor: dejó de temerle».", "La superación personal"], ["«Volvió al pueblo y ya nadie hablaba su lengua».", "La pérdida de las raíces"], ["«Le pidió perdón antes de que el sol se pusiera».", "La reconciliación"],
]);

const THEMES = [
  read("La balanza", "⚖️", "Doña Fermina vendía papas en el mercado desde hacía treinta años. Un día, un inspector le mostró que su balanza marcaba cien gramos de más. «Así la compré», dijo ella, y era cierto. Esa noche no durmió. A la mañana siguiente colgó un cartel: «Si me compró papas este mes, venga: le debo un poco». Vinieron pocos. Pero desde entonces, su puesto fue el más concurrido del mercado.",
    ["¿Cuál es el tema del cuento?", "La honestidad genera confianza.", "Los inspectores vigilan a todos los vendedores de los mercados.", "Las papas son caras."],
    ["¿Qué detalle muestra el conflicto interior de doña Fermina?", "Esa noche no durmió.", "Vendía papas desde hacía treinta años.", "El inspector revisó su balanza delante de los clientes."],
    ["¿Qué sugiere el final?", "Que obrar bien también trajo un beneficio", "Que perdió a todos sus clientes por culpa del cartel", "Que cerró el puesto"]),
  read("El atajo", "🏔️", "Para llegar a la laguna había dos caminos: el largo, que rodeaba el cerro, y el atajo, que lo cruzaba por una cornisa. Bruno eligió el atajo y se burló de su hermana Sol, que tomó el largo. A mitad de la cornisa, una piedra cedió bajo su pie. Tardó dos horas en retroceder, paso a paso, con las manos sangrando. Cuando por fin llegó a la laguna, Sol ya había encendido el fuego. No dijo nada. Le pasó un mate caliente.",
    ["¿Cuál es el tema del cuento?", "La prisa y la soberbia pueden salir caras.", "Las lagunas de altura son difíciles de encontrar sin un mapa.", "Los hermanos pelean."],
    ["¿Qué muestra el silencio de Sol al final?", "Comprensión, sin necesidad de reproches", "Enojo, porque no quiere compartir el fuego con su hermano", "Indiferencia"],
    ["¿Qué acción de Bruno refleja su soberbia?", "Burlarse de quien eligió el camino largo", "Retroceder paso a paso", "Aceptar el mate caliente que le ofreció su hermana"]),
];

const MULTI_THEMES = [
  read("El taller", "🪚", "A los doce años, Ismael empezó a ayudar en la carpintería de su abuelo. Quería hacer una silla; el abuelo le dio una lija. Tres meses lijó tablas ajenas. Renegó, pensó en dejarlo. Un día el abuelo se cortó la mano y no pudo terminar una mesa encargada. Ismael la terminó: sus manos ya sabían cómo era una superficie bien hecha. El abuelo miró la mesa largo rato y, sin decir palabra, le entregó su formón.",
    ["¿Qué dos temas desarrolla el cuento?", "La paciencia para aprender y la confianza ganada", "La envidia entre parientes y la venganza del más joven", "El miedo y la huida"],
    ["¿Qué representa el formón que el abuelo entrega?", "El reconocimiento de que Ismael ya es carpintero", "Un castigo por haber terminado la mesa sin su permiso", "Una herramienta rota"],
    ["¿Qué detalle muestra que la paciencia dio fruto?", "Sus manos ya reconocían una superficie bien hecha.", "Renegó y pensó en dejarlo.", "El abuelo se cortó la mano mientras trabajaba en el taller."]),
  read("La radio del pueblo", "📻", "Cuando el huaico cortó la carretera, Chavinillo quedó aislado. No había señal de celular. Tania, que tenía trece años y una radio vieja armada con su tío, empezó a transmitir: quién necesitaba medicinas, dónde había agua limpia, qué puente seguía en pie. Al principio los adultos la mandaron a callar. Al tercer día hacían cola frente a su casa para dar avisos. Cuando por fin llegó la ayuda, los rescatistas ya tenían una lista de todo lo que hacía falta.",
    ["¿Qué dos temas desarrolla el cuento?", "El valor de la iniciativa juvenil y la importancia de comunicarse", "La pereza de los jóvenes y el castigo que reciben de los adultos", "El odio y el perdón"],
    ["¿Cómo cambia la actitud de los adultos?", "Pasan de desestimarla a depender de ella.", "Pasan de admirarla a prohibirle usar la radio.", "No cambia."],
    ["¿Qué prueba que su trabajo fue útil?", "Los rescatistas recibieron una lista de necesidades.", "La radio era vieja.", "El huaico cortó la carretera y dejó al pueblo sin señal."]),
];

// --- C. Propósito y punto de vista -------------------------------------------

const PURPOSE = sorter(["Informar", "Persuadir", "Entretener", "Explicar cómo se hace algo"], "¿Cuál es el propósito del autor?");
const AUTHOR_PURPOSE: ChoiceItem[] = [
  ...["Un artículo de enciclopedia sobre la formación de los Andes.", "Un informe con los resultados de una encuesta escolar.", "Una nota periodística sobre un hallazgo arqueológico."].map((x) => PURPOSE(x, 0)),
  ...["Un editorial que pide ampliar el horario de las bibliotecas.", "Una carta abierta contra la tala de un bosque.", "Un anuncio que asegura que un celular es «el mejor del mercado»."].map((x) => PURPOSE(x, 1)),
  ...["Una novela de misterio ambientada en Cusco.", "Un monólogo humorístico sobre las tareas escolares.", "Un cuento fantástico sobre un río que habla."].map((x) => PURPOSE(x, 2)),
  ...["Un tutorial para instalar un panel solar pequeño.", "Las reglas de un juego de mesa.", "Una guía paso a paso para editar un video."].map((x) => PURPOSE(x, 3)),
];

const POV = "¿Cuál es el punto de vista del autor?";
const AUTHOR_POV: ChoiceItem[] = [
  pt(POV, "«Los zoológicos modernos salvan especies que, de otro modo, ya se habrían extinguido. Criticarlos sin conocer su trabajo es injusto».", "Defiende a los zoológicos.", "Rechaza todos los zoológicos porque encierran animales.", "No toma partido."),
  pt(POV, "«Se nos dice que las tareas refuerzan lo aprendido. Yo veo niños agotados que ya no tienen tiempo para jugar ni leer por gusto».", "Critica el exceso de tareas.", "Cree que las tareas son la mejor manera de aprender.", "Elogia a los docentes."),
  pt(POV, "«La minería trae empleo, es cierto. Pero ningún sueldo compensa un río envenenado».", "Prioriza el ambiente sobre el beneficio económico.", "Considera que el empleo importa más que los ríos.", "Niega que haya empleo."),
  pt(POV, "«Algunos llaman “pérdida de tiempo” a los videojuegos. Olvidan que en ellos se planifica, se coopera y se persevera».", "Valora los videojuegos.", "Piensa que los videojuegos deberían prohibirse en casa.", "Los ignora."),
  pt(POV, "«El uniforme escolar, lejos de uniformar, esconde: debajo de la misma tela siguen las mismas desigualdades».", "Duda de que el uniforme logre igualdad.", "Cree que el uniforme elimina todas las diferencias.", "Quiere uniformes más caros."),
  pt(POV, "«Viajar en avión es cómodo y rápido. También es la forma de transporte que más contamina por pasajero. Conviene pensarlo dos veces».", "Invita a moderar los viajes en avión.", "Recomienda viajar siempre en avión por su comodidad.", "No opina sobre el tema."),
];

// --- D. Tono -----------------------------------------------------------------

const FORMAL = "¿Qué oración es más formal?";
const FORMALITY: ChoiceItem[] = [
  w(FORMAL, "Solicitamos la reparación del techo del aula.", "Queremos que arreglen el techo del salón, por fa.", "Oigan, el techo está fatal."), w(FORMAL, "Agradecemos de antemano su atención.", "Gracias desde ya por hacernos caso, ¿ya?", "Gracias por leer."),
  w(FORMAL, "Los resultados no respaldan la hipótesis inicial.", "Lo que pensábamos al principio no salió para nada.", "Nos equivocamos feo."), w(FORMAL, "El evento se pospuso por motivos de fuerza mayor.", "Ya no hay evento porque pasó algo bien grave.", "Se canceló todo."),
  w(FORMAL, "Le informo que no podré asistir a la reunión.", "Te cuento que no voy a poder ir a la reunión esa.", "No voy, pues."), w(FORMAL, "Es necesario revisar las fuentes consultadas.", "Hay que chequear bien de dónde sacamos las cosas.", "Revisa eso."),
  w(FORMAL, "¿Sería posible ampliar el plazo de entrega?", "¿Nos das unos diítas más para entregar el trabajo?", "¿Más plazo, profe?"), w(FORMAL, "La conducta descrita infringe el reglamento.", "Lo que hizo el pata va contra las reglas del cole.", "Eso está mal."),
  w(FORMAL, "Reciba un cordial saludo.", "Te mando un saludote bien grande, cuídate.", "¡Chau!"), w(FORMAL, "Adjuntamos las evidencias correspondientes.", "Ahí van las pruebas de todo lo que dijimos antes.", "Mira las fotos."),
];
const TONE = "¿Qué tono tiene cada texto?";
const TONE_COMPARE: ChoiceItem[] = [
  pt(TONE, "Texto A: «¡Por fin vacaciones! Guardé los cuadernos donde ni yo los encuentre».\nTexto B: «El último timbre sonó. Miré el patio vacío y sentí que algo se terminaba».", "A es alegre; B es nostálgico.", "A es nostálgico; B es burlón y alegre.", "Los dos son alegres."),
  pt(TONE, "Texto A: «El río amaneció crecido. Los vecinos deben evacuar la ribera de inmediato».\nTexto B: «¡Qué sorpresa! El río decidió visitarnos hasta la sala».", "A es serio y urgente; B es irónico.", "A es irónico; B es serio y muy urgente.", "Los dos son irónicos."),
  pt(TONE, "Texto A: «Claro, llegar tarde otra vez es una idea brillante».\nTexto B: «Te pido, por favor, que mañana llegues puntual».", "A es sarcástico; B es respetuoso.", "A es respetuoso; B es sarcástico y cortante.", "Los dos son amables."),
  pt(TONE, "Texto A: «La especie ha perdido el 80 % de su población en una década».\nTexto B: «¡No podemos quedarnos de brazos cruzados mientras desaparece!».", "A es objetivo; B es apasionado.", "A es apasionado; B es frío y objetivo.", "Los dos son objetivos."),
  pt(TONE, "Texto A: «El viejo faro seguía en pie, terco, saludando a barcos que ya no pasaban».\nTexto B: «El faro mide 18 metros y fue construido en 1920».", "A es melancólico; B es informativo.", "A es informativo; B es melancólico.", "Los dos son humorísticos."),
  pt(TONE, "Texto A: «Confío en que lo lograrás: has trabajado mucho».\nTexto B: «Dudo que alcances; siempre dejas todo para el final».", "A es alentador; B es desconfiado.", "A es desconfiado; B es muy alentador.", "Los dos son neutrales."),
];

// --- E. Estructura del texto -------------------------------------------------

const COMPARE = [
  read("Volcanes y géiseres", "🌋", "Tanto los volcanes como los géiseres deben su actividad al calor del interior de la Tierra. No obstante, lo que expulsan es distinto. Un volcán arroja roca fundida, cenizas y gases; sus erupciones son irregulares y pueden cambiar el paisaje para siempre. Un géiser, en cambio, lanza agua hirviente y vapor, y a menudo lo hace con una puntualidad sorprendente. Ambos fenómenos se aprovechan hoy para producir energía geotérmica.",
    ["¿Qué tienen en común volcanes y géiseres?", "Dependen del calor interno de la Tierra.", "Expulsan roca fundida y cenizas en cada erupción.", "Son regulares."],
    ["¿En qué se diferencian principalmente?", "En lo que expulsan y en su regularidad", "En que solo los géiseres producen energía aprovechable", "En su color"],
    ["¿Qué conector introduce el contraste principal?", "«No obstante»", "«Tanto… como»", "«Ambos fenómenos se aprovechan»"]),
  read("Mito y leyenda", "📜", "El mito y la leyenda son relatos tradicionales que pasan de boca en boca. Se parecen en que ninguno tiene un autor conocido. Pero no cumplen la misma función. El mito explica el origen del mundo, de los dioses o de un pueblo, y sus personajes son seres sobrenaturales. La leyenda, por su parte, parte de un lugar o un hecho real —una laguna, una batalla— y le añade elementos fantásticos.",
    ["¿En qué se parecen el mito y la leyenda?", "Son relatos tradicionales de autor anónimo.", "Explican cómo se originó el universo entero.", "Tienen autor conocido."],
    ["¿Qué distingue a la leyenda?", "Parte de un lugar o hecho real.", "Sus personajes son siempre dioses que crean el mundo.", "No tiene fantasía."],
    ["¿Qué expresión señala la semejanza?", "«Se parecen en que»", "«Pero no cumplen»", "«Por su parte»"]),
];
const CAUSE_INFO: ChoiceItem[] = [
  pt("¿Cuál es el efecto?", "Al derretirse el hielo de los polos, el mar refleja menos luz solar y absorbe más calor.", "El mar absorbe más calor.", "El hielo de los polos se derrite.", "El sol brilla más."),
  pt("¿Cuál es la causa?", "La población de lobos marinos cayó, pues la sobrepesca redujo los cardúmenes de anchoveta.", "La sobrepesca de anchoveta", "La caída de los lobos marinos", "El aumento de cardúmenes"),
  pt("¿Cuál es el efecto?", "Como las bacterias se vuelven resistentes cuando los antibióticos se usan mal, algunas infecciones ya no se curan con facilidad.", "Hay infecciones difíciles de curar.", "Los antibióticos se usan mal con frecuencia.", "Hay bacterias."),
  pt("¿Cuál es la causa?", "El pueblo se quedó sin jóvenes a raíz del cierre de la única escuela secundaria.", "El cierre de la secundaria", "La falta de jóvenes en el pueblo", "El tamaño del pueblo"),
  pt("¿Cuál es el efecto?", "La erupción del Huaynaputina en 1600 cubrió de ceniza el sur del Perú; por ello, se perdieron las cosechas de varios años.", "Se perdieron las cosechas.", "El volcán hizo erupción.", "Era el año 1600."),
  pt("¿Cuál es la causa?", "Muchos ríos amazónicos tienen mercurio debido a la minería ilegal de oro.", "La minería ilegal de oro", "El mercurio en los ríos", "El caudal de los ríos"),
  pt("¿Qué expresión señala el efecto?", "Subió el precio del combustible; en consecuencia, aumentaron los pasajes.", "«en consecuencia»", "«subió el precio»", "«los pasajes»"),
  pt("¿Qué expresión señala la causa?", "El vuelo se retrasó a causa de la neblina.", "«a causa de»", "«se retrasó»", "«el vuelo»"),
];
const PROBLEM_SOLUTION = pool([
  ["Los residuos orgánicos llenan el relleno sanitario.", "Convertirlos en compost."], ["Las noticias falsas se viralizan.", "Enseñar a contrastar fuentes."], ["El barrio se inunda cada verano.", "Construir drenajes pluviales."],
  ["Muchos alumnos abandonan la lectura.", "Dejarles elegir sus propios libros."], ["La comunidad no tiene electricidad.", "Instalar paneles solares."], ["El tráfico satura el centro.", "Crear corredores de buses y ciclovías."],
  ["Las heladas matan al ganado.", "Construir cobertizos abrigados."], ["El agua del pozo está contaminada.", "Usar filtros y hervirla."],
]);
const STRUCT = sorter(["Secuencia cronológica", "Comparación y contraste", "Causa y efecto", "Problema y solución", "Descripción"], "¿Qué estructura tiene el texto?");
const STRUCTURES: ChoiceItem[] = [
  ...["En 1438 Pachacútec asumió el poder. Luego expandió el territorio. Décadas después, sus sucesores llegaron hasta el actual Ecuador.", "Primero se recoge la muestra; después se observa al microscopio; por último se registran los datos."].map((x) => STRUCT(x, 0)),
  ...["Mientras la novela desarrolla varios conflictos, el cuento se concentra en uno solo.", "La energía solar y la eólica son limpias; sin embargo, la primera depende del día y la segunda, del viento."].map((x) => STRUCT(x, 1)),
  ...["Debido a la tala, el suelo perdió sus raíces; por eso, las lluvias provocaron deslizamientos.", "El uso de mascarillas redujo los contagios, lo cual permitió reabrir las escuelas."].map((x) => STRUCT(x, 2)),
  ...["Los alumnos llegaban sin desayunar. La escuela abrió un comedor y la asistencia mejoró.", "El lago se estaba secando. Las comunidades acordaron turnos de riego."].map((x) => STRUCT(x, 3)),
  ...["El ceibo tiene tronco grueso y espinoso, copa ancha y flores rojas que aparecen en primavera.", "La casona posee dos patios, balcones de madera tallada y un zaguán empedrado."].map((x) => STRUCT(x, 4)),
];

// --- F. Recursos literarios --------------------------------------------------

const SENSORY: ChoiceItem[] = [
  pt("¿Qué palabras del texto son detalles sensoriales?", "El desván olía a polvo y a manzanas guardadas. Cada tabla crujía bajo mis pies.", "«olía a polvo» y «crujía»", "«el desván» y «cada tabla»", "«mis pies» y «guardadas»"),
  pt("¿Qué palabras del texto son detalles sensoriales?", "La sopa llegó humeante; el primer sorbo, espeso y salado, me devolvió el alma.", "«humeante» y «espeso y salado»", "«la sopa», «el primer» y «el alma»", "«llegó» y «el primer»"),
  pt("¿A qué sentidos apela el texto?", "El mar rugía contra las rocas y la espuma helada nos salpicaba la cara.", "Oído y tacto", "Vista y gusto solamente", "Olfato"),
  pt("¿A qué sentidos apela el texto?", "El patio brillaba de buganvillas moradas y el aire sabía a sal.", "Vista y gusto", "Oído y tacto solamente", "Olfato"),
  pt("¿Qué detalle sensorial crea una atmósfera de miedo?", "La puerta se abrió sola. Del pasillo llegó un frío húmedo y un rasguño lento en la pared.", "El rasguño lento en la pared", "La puerta de la casa que se abrió", "El pasillo"),
  pt("¿Qué detalle sensorial transmite calma?", "Nos echamos en el pasto tibio. Lejos, una quena repetía la misma melodía.", "El pasto tibio y la quena lejana", "La palabra «echamos» al inicio del texto", "La repetición"),
  pt("¿Qué oración añade un detalle sensorial?", "Entramos a la panadería.", "El calor del horno nos envolvió con olor a anís.", "La panadería quedaba en la esquina de mi calle.", "Compramos pan."),
  pt("¿Qué oración añade un detalle sensorial?", "Empezó a llover.", "Las gotas repiqueteaban en la calamina.", "La lluvia es agua que cae de las nubes al suelo.", "Llovió mucho."),
];
const ALLUSIONS: ChoiceItem[] = [
  pt("¿Qué significa la alusión a Sísifo?", "Fuente: Sísifo fue condenado a empujar una roca cuesta arriba; cada vez que llegaba a la cima, la roca rodaba hasta abajo.\nOración: «Ordenar el cuarto de mi hermano es una tarea de Sísifo».", "Un esfuerzo que nunca termina", "Un trabajo que se hace una sola vez y con gusto", "Un castigo justo"),
  pt("¿Qué significa «abrir la caja de Pandora»?", "Fuente: Pandora abrió una caja prohibida y de ella escaparon todos los males; dentro solo quedó la esperanza.\nOración: «Preguntar por el dinero perdido fue abrir la caja de Pandora».", "Desatar muchos problemas", "Encontrar una solución rápida y definitiva", "Guardar un secreto"),
  pt("¿Qué significa la alusión a Narciso?", "Fuente: Narciso se enamoró de su propio reflejo en el agua y no pudo apartarse de él.\nOración: «Con tantas selfis, parece un Narciso».", "Está demasiado pendiente de sí mismo.", "Le gusta nadar en ríos y lagunas de agua clara.", "Es muy generoso."),
  pt("¿Qué significa «espada de Damocles»?", "Fuente: Damocles se sentó en el trono del rey y vio sobre su cabeza una espada colgada de un solo pelo.\nOración: «El examen final es una espada de Damocles».", "Una amenaza constante", "Un premio que llegará tarde o temprano", "Un arma antigua"),
  pt("¿Qué significa la alusión a Ulises?", "Fuente: Ulises tardó diez años en volver a Ítaca tras la guerra de Troya, enfrentando monstruos y tormentas.\nOración: «Su vuelta fue digna de Ulises: tres aeropuertos y dos tormentas».", "Un regreso largo y accidentado", "Un viaje corto, cómodo y sin ningún contratiempo", "Una guerra"),
  pt("¿Qué significa «victoria pírrica»?", "Fuente: El rey Pirro venció a los romanos, pero perdió tantos soldados que dijo: «Otra victoria así y estaré perdido».\nOración: «Ganó la discusión, pero fue una victoria pírrica: perdió a su amigo».", "Un triunfo que cuesta demasiado", "Un triunfo fácil que todos celebran con alegría", "Una derrota total"),
  pt("¿Qué significa la alusión a Sancho Panza?", "Fuente: Sancho, escudero de don Quijote, es práctico y realista frente a los sueños de su amo.\nOración: «Ella sueña con ser astronauta; su hermano, más Sancho, pregunta cuánto cuesta».", "Tiene los pies en la tierra.", "Es un soñador que vive pensando en aventuras.", "Es muy valiente."),
  pt("¿Qué significa «cruzar el Rubicón»?", "Fuente: Julio César cruzó con su ejército el río Rubicón sabiendo que, al hacerlo, ya no podía retroceder.\nOración: «Al enviar la renuncia, cruzó el Rubicón».", "Tomar una decisión sin vuelta atrás", "Posponer una decisión importante para más adelante", "Cruzar un puente"),
];
const MEAN = "¿Qué significa la figura?";
const FIGURE_MEANING: ChoiceItem[] = [
  pt(MEAN, "«Sus promesas eran castillos de arena».", "Eran frágiles y no durarían.", "Eran grandes y sólidas como una fortaleza.", "Eran antiguas."),
  pt(MEAN, "«La noticia le cayó como un piano».", "Lo golpeó de forma repentina y dura.", "Le pareció una melodía hermosa y suave.", "Le dio risa."),
  pt(MEAN, "«El aula era una olla a presión».", "Había mucha tensión acumulada.", "Hacía calor porque estaban cocinando algo.", "Estaba vacía."),
  pt(MEAN, "«Leyó el libro de un bocado».", "Lo leyó rapidísimo.", "Se comió una página sin querer.", "Lo leyó a medias."),
  pt(MEAN, "«Tiene una memoria de elefante».", "Recuerda todo.", "Olvida las cosas con mucha facilidad.", "Es muy grande."),
  pt(MEAN, "«El tiempo se me escurre entre los dedos».", "Pasa sin que pueda aprovecharlo.", "Me sobra para todo lo que quiero hacer.", "Tengo las manos mojadas."),
  pt(MEAN, "«Su silencio fue una puerta cerrada».", "No dejó espacio para conversar.", "Invitó a todos a pasar y sentirse cómodos.", "Hizo ruido."),
  pt(MEAN, "«La ciudad no duerme».", "Siempre hay actividad en ella.", "Sus habitantes sufren de insomnio todas las noches.", "Está abandonada."),
];
const FIG = sorter(["Símil", "Metáfora", "Personificación", "Hipérbole", "Onomatopeya"], "¿Qué figura literaria es?");
const FIGURE_CLASSIFY: ChoiceItem[] = [
  ...["Sus manos eran frías como el mármol.", "Corría cual gacela.", "El lago parecía un espejo."].map((x) => FIG(x, 0)),
  ...["El lago era un espejo.", "Sus ojos, dos carbones encendidos.", "La vida es un río."].map((x) => FIG(x, 1)),
  ...["El viento susurraba mi nombre.", "La luna nos espiaba entre las nubes.", "Las hojas bailaban en la vereda."].map((x) => FIG(x, 2)),
  ...["Te llamé mil veces.", "Tengo tanta hambre que me comería una vaca.", "Tardó siglos en vestirse."].map((x) => FIG(x, 3)),
  ...["El tictac del reloj no me dejaba dormir.", "¡Zas!, se cerró la puerta.", "Se oyó el quiquiriquí al amanecer."].map((x) => FIG(x, 4)),
];
const EFFECT = "¿Qué efecto logra la figura?";
const FIGURE_EFFECT: ChoiceItem[] = [
  pt(EFFECT, "«La noche se tragó el camino».", "Crea una sensación de amenaza.", "Hace que la escena resulte cómica y ligera.", "Da un dato exacto."),
  pt(EFFECT, "«Sus palabras, tibias como pan recién hecho, me calmaron».", "Transmite consuelo y cercanía.", "Transmite frialdad y distancia entre los personajes.", "Da hambre."),
  pt(EFFECT, "«Mil años esperé ese bus».", "Exagera para mostrar fastidio.", "Indica con precisión cuánto tiempo pasó.", "Expresa alegría."),
  pt(EFFECT, "«El reloj mordía cada segundo».", "Vuelve angustioso el paso del tiempo.", "Hace que el tiempo parezca dulce y lento.", "Explica cómo funciona."),
  pt(EFFECT, "«La ciudad bostezaba humo al amanecer».", "Sugiere cansancio y contaminación.", "Sugiere una ciudad limpia, fresca y llena de energía.", "Hace reír."),
  pt(EFFECT, "«Era una montaña de hombre, pero hablaba como un pajarito».", "Crea un contraste simpático.", "Crea miedo ante un personaje peligroso.", "Describe un paisaje."),
  pt(EFFECT, "«El silencio cayó como una manta pesada».", "Hace sentir un ambiente opresivo.", "Hace sentir un ambiente festivo y ruidoso.", "Indica frío."),
  pt(EFFECT, "«Las olas aplaudían contra el muelle».", "Da un tono alegre y vivo a la escena.", "Da un tono fúnebre y amenazante.", "Mide la marea."),
];

// --- G. Analizar literatura --------------------------------------------------

const NARR = sorter(["Primera persona", "Tercera persona limitada", "Tercera persona omnisciente"], "¿Qué punto de vista narrativo tiene el fragmento?");
const NARRATOR: ChoiceItem[] = [
  ...["Nunca le conté a nadie lo que vi esa noche en el muelle.", "Me pareció que el profesor dudaba, aunque no puedo asegurarlo.", "Subimos al bus sin saber adónde nos llevaba.", "Aún guardo la carta que nunca envié."].map((x) => NARR(x, 0)),
  ...["Lucía miró el muelle y sintió miedo; ignoraba qué pensaba su hermano.", "Darío creyó que el profesor dudaba, pero no podía saberlo.", "A Inés le pareció que todos la miraban.", "Tomás se preguntó si su madre lo habría perdonado."].map((x) => NARR(x, 1)),
  ...["Lucía sentía miedo; su hermano, en cambio, recordaba con alivio aquel muelle.", "El profesor dudaba y Darío lo sabía, aunque ninguno lo admitiría.", "Inés creía que la miraban; en realidad, cada uno pensaba en lo suyo.", "Madre e hijo deseaban lo mismo sin sospecharlo."].map((x) => NARR(x, 2)),
];
const INFER_LIT = [
  read("El uniforme", "🎽", "El entrenador repartió las camisetas nuevas. A Salvador le tocó la 14, dos tallas más grande. No dijo nada. En casa, su madre la miró a contraluz, sacó la caja de costura y trabajó hasta tarde. Al día siguiente, la camiseta le calzaba exacta. En el dobladillo, por dentro, había una costura de otro color: el hilo azul se había terminado.",
    ["¿Qué se puede inferir sobre la madre?", "Se esforzó aunque tenía pocos recursos.", "Era una costurera famosa con un taller muy bien equipado.", "No quería coser."],
    ["¿Qué detalle apoya esa inferencia?", "El hilo azul se había terminado.", "El entrenador repartió camisetas.", "La camiseta tenía el número 14 en la espalda."],
    ["¿Por qué Salvador «no dijo nada» al recibirla?", "Probablemente no quería quejarse ni llamar la atención.", "Seguramente le encantaba que la camiseta fuera enorme.", "No la había visto."]),
  read("La visita", "🚪", "La tía Renata anunció que llegaría el sábado. El viernes, mamá escondió el florero rajado, papá ensayó dos temas de conversación y el abuelo preguntó si era necesario que él estuviera. Cuando sonó el timbre, los tres se miraron. Nadie se movió durante un segundo largo. Luego mamá sonrió demasiado y abrió.",
    ["¿Qué se puede inferir sobre la tía Renata?", "Su visita incomoda a la familia.", "Es la persona más querida y esperada de la casa.", "Vive con ellos."],
    ["¿Qué sugiere que mamá «sonrió demasiado»?", "Que fingía entusiasmo", "Que estaba sinceramente feliz de volver a verla", "Que tenía sueño"],
    ["¿Qué detalle muestra la actitud del abuelo?", "Preguntó si era necesario estar presente.", "Escondió el florero rajado.", "Ensayó temas de conversación para la sobremesa."]),
];
const SHORT_STORIES = [
  read("El último pasajero", "🚌", "El bus de las once salía siempre vacío, y don Efraín, el chofer, lo sabía. Aun así esperaba cinco minutos de más en el paradero del hospital. Una noche subió una enfermera con los ojos rojos. «Pensé que ya se había ido», dijo. «Casi», mintió él. Hicieron el trayecto en silencio. Al bajar, ella dejó sobre el tablero un caramelo de limón. Don Efraín no lo comió. Lo guardó en la guantera, junto a otros doce.",
    ["¿Qué revela el final sobre don Efraín?", "No es la primera vez que espera a alguien.", "Colecciona caramelos de limón porque es goloso.", "Va a renunciar."],
    ["¿Por qué miente al decir «casi»?", "Para que ella no se sienta en deuda", "Para que ella crea que es un chofer impuntual", "Porque estaba apurado"],
    ["¿Qué rasgo define al personaje?", "Una bondad discreta", "Una gran ambición", "Un carácter gruñón que no soporta a los pasajeros"]),
  read("Las zapatillas", "👟", "Camila quería las zapatillas rojas de la vitrina. Ahorró cuatro meses. El día que fue a comprarlas vio, en la puerta de la tienda, a un niño de su colegio mirando las mismas zapatillas con las manos en los bolsillos. Camila entró, pagó y salió sin mirarlo. En su cuarto se las probó frente al espejo. Le quedaban perfectas. Se las quitó despacio y las dejó en la caja, con el papel de seda encima.",
    ["¿Cuál es el conflicto principal?", "Interno: el deseo cumplido frente a la culpa", "Externo: una pelea con el niño por las zapatillas", "Externo: la falta de dinero"],
    ["¿Qué sugiere el gesto final?", "Que ya no puede disfrutarlas igual", "Que las zapatillas le quedaron demasiado chicas", "Que las va a vender"],
    ["¿Qué técnica usa el narrador?", "Muestra las emociones con acciones, sin nombrarlas.", "Explica directamente todo lo que piensa Camila.", "Usa un diálogo largo."]),
];

// --- H. Poesía ---------------------------------------------------------------

const SCHEMES = ["AABB", "ABAB", "ABBA", "ABCB"];
const RHYME = (t: string, i: number): ChoiceItem => ({ p: "¿Cuál es el esquema de rima de la estrofa?", t, a: SCHEMES[i], d: SCHEMES.filter((_, k) => k !== i), e: `Las rimas siguen el esquema ${SCHEMES[i]}.` });
const RHYME_SCHEMES: ChoiceItem[] = [
  RHYME("Cruza el cóndor la quebrada,\nsobre la roca nevada;\nno lo detiene el abismo\nporque confía en sí mismo.", 0),
  RHYME("Guardo en un cajón sin llave\nlas cartas que no envié;\ncada sobre es una nave\nque en el puerto abandoné.", 1),
  RHYME("Hay un silencio en la casa\ndesde que te fuiste al mar;\nno sé cómo despertar\nesta tarde que no pasa.", 2),
  RHYME("La lluvia toca el tejado\ncon dedos de agua fría;\nyo la escucho desde adentro\ncomo una vieja melodía.", 3),
  RHYME("El tren se pierde en la bruma,\nsu silbido es una pluma;\nqueda el andén sin rumor\ny en mi mano, tu calor.", 0),
  RHYME("Dicen que el tiempo lo cura,\nyo digo que solo enseña\na mirar con más ternura\nla herida que nos empeña.", 1),
  RHYME("Subí al cerro de mi infancia\ny lo encontré más pequeño;\nquizá era mío el empeño\nde medirlo en la distancia.", 2),
  RHYME("Mi abuela guarda en un frasco\nbotones de mil colores;\ncada uno fue de un abrigo\nque vio inviernos mejores.", 3),
];

// --- J. Argumentos -----------------------------------------------------------

const ARGUMENTS = [
  read("¿Deben los colegios empezar más tarde?", "⏰", "Propongo que las clases de secundaria empiecen a las nueve y no a las siete y media. Primero, los estudios sobre el sueño muestran que el reloj biológico de los adolescentes se retrasa: su cerebro no está listo para aprender tan temprano. Segundo, en los colegios que cambiaron el horario bajaron las tardanzas y subieron las notas. Es verdad que el cambio complicaría los horarios de algunos padres; por eso sugiero ofrecer un espacio de estudio vigilado desde las siete y media para quien lo necesite.",
    ["¿Cuál es la tesis del autor?", "Las clases de secundaria deberían empezar a las nueve.", "Los adolescentes deberían acostarse mucho más temprano.", "Hay que eliminar las tardanzas."],
    ["¿Qué evidencia apoya el segundo argumento?", "Los colegios que cambiaron el horario mejoraron.", "El reloj biológico se retrasa.", "Algunos padres tienen horarios complicados de trabajo."],
    ["¿Cómo trata el autor el contraargumento?", "Lo reconoce y propone una solución.", "Lo ignora por completo y sigue con sus razones.", "Lo acepta y cambia de tesis."]),
  read("Bolsas de plástico: ¿prohibir o cobrar?", "🛍️", "Algunos proponen prohibir las bolsas de plástico; yo sostengo que es mejor cobrarlas. Cuando un país europeo empezó a cobrar unos centavos por bolsa, su uso cayó un 90 % en un año. Una prohibición total, en cambio, suele generar mercados informales y rechazo. Además, el dinero recaudado puede financiar campañas de limpieza. Quienes defienden la prohibición dicen que cobrar perjudica a los más pobres; sin embargo, una bolsa de tela dura años y cuesta lo que treinta de plástico.",
    ["¿Qué postura defiende el autor?", "Cobrar las bolsas en lugar de prohibirlas", "Prohibir de inmediato todas las bolsas de plástico", "Regalar más bolsas"],
    ["¿Qué dato usa como prueba principal?", "El uso cayó un 90 % donde se cobraron.", "Las bolsas de tela son bonitas.", "Hay mercados informales en muchos países europeos."],
    ["¿Qué objeción responde al final?", "Que cobrar afecta a los más pobres", "Que las bolsas de tela se rompen con facilidad", "Que nadie usa bolsas"]),
];

// --- M. Comparar textos ------------------------------------------------------

const TWO_TEXTS: ChoiceItem[] = [
  pt("¿En qué coinciden los dos textos?", "Texto 1: El lago Poopó, en Bolivia, se secó casi por completo en 2015.\nTexto 2: El mar de Aral perdió el 90 % de su agua por el desvío de sus ríos.", "Grandes cuerpos de agua pueden desaparecer.", "Los lagos de Bolivia son más grandes que los mares.", "El agua siempre regresa."),
  pt("¿Qué añade el Texto 2 al Texto 1?", "Texto 1: La quinua resiste heladas y sequías.\nTexto 2: Por esa resistencia, la FAO la considera clave para la alimentación del futuro.", "La importancia mundial de esa resistencia", "Que la quinua no resiste las heladas", "El sabor de la quinua"),
  pt("¿En qué se contradicen los textos?", "Texto 1: El café mejora la concentración si se toma con moderación.\nTexto 2: El café no aporta ningún beneficio y debería evitarse.", "En si el café tiene algún beneficio", "En el color del café", "En el país donde se cultiva más café"),
  pt("¿Qué texto es más confiable para un informe?", "Texto 1: Un artículo de una revista científica con datos y fuentes.\nTexto 2: Un comentario anónimo en una red social.", "El Texto 1, porque cita datos y fuentes", "El Texto 2, porque es más reciente y breve", "Los dos por igual"),
  pt("¿Qué perspectiva distingue al Texto 2?", "Texto 1: «El puente se inauguró en 2019 y mide 120 metros».\nTexto 2: «Desde que hay puente, mi hija ya no cruza el río en bote para ir al colegio».", "Muestra el impacto humano.", "Da las medidas técnicas del puente.", "Critica al alcalde."),
  pt("¿Qué se concluye al unir los textos?", "Texto 1: El plástico de un solo uso tarda siglos en degradarse.\nTexto 2: Solo el 9 % del plástico producido se ha reciclado.", "La mayor parte del plástico sigue en el ambiente.", "Casi todo el plástico se recicla sin problema.", "El plástico se degrada rápido."),
];
const GENRES: ChoiceItem[] = [
  pt("¿En qué se diferencian los textos?", "Texto 1 (poema): «Río, viejo caminante, / ¿a quién le cuentas tu pena?».\nTexto 2 (artículo): «El río Rímac recibe a diario descargas de aguas residuales».", "El poema expresa sentimientos; el artículo presenta hechos.", "Los dos presentan datos medidos por científicos en el mismo río.", "Los dos son poemas."),
  pt("¿Qué tienen en común los textos?", "Texto 1 (cuento): Un niño pierde a su perro en un terremoto y lo busca durante días.\nTexto 2 (noticia): «Rescatistas hallan con vida a una mascota tras el sismo».", "Tratan de mascotas en un sismo.", "Los dos son relatos inventados por un autor.", "Los dos traen cifras."),
  pt("¿Qué permite el diario que no permite la biografía?", "Texto 1 (diario): «Hoy sentí que nadie me entendía».\nTexto 2 (biografía): «En esa época, la autora atravesó dificultades».", "Conocer los sentimientos en primera persona", "Saber las fechas exactas de cada hecho", "Leer la opinión de un experto"),
  pt("¿Cómo trata cada texto el mismo tema?", "Texto 1 (fábula): La cigarra canta todo el verano y pasa hambre en invierno.\nTexto 2 (ensayo): «Ahorrar una parte de lo que se gana protege ante imprevistos».", "La fábula lo muestra con una historia; el ensayo lo explica.", "Los dos lo explican con razones, datos y ejemplos tomados de la realidad.", "Ninguno trata de la previsión."),
  pt("¿Qué género elegirías para conocer los argumentos a favor de una ley?", "Texto 1 (editorial): opinión del diario sobre la ley.\nTexto 2 (leyenda): relato sobre el origen de un pueblo.", "El editorial", "La leyenda", "Ninguno de los dos sirve"),
  pt("¿Qué recurso es propio del texto dramático?", "Texto 1 (teatro): «ANA: (En voz baja.) No mires atrás».\nTexto 2 (novela): «Ana le pidió en voz baja que no mirara atrás».", "Las acotaciones y los nombres antes de cada parlamento", "El narrador que cuenta en pasado todo lo que ocurre en la escena", "La rima"),
];

// --- N. Elementos visuales ---------------------------------------------------

const ILLU_1 = "Ilustración 1 (grabado antiguo): Don Quijote, flaco y erguido, carga contra un molino enorme; Sancho, al fondo, se tapa la cara.\nIlustración 2 (caricatura moderna): Don Quijote, con casco de ciclista, embiste un aerogenerador; Sancho graba con el celular.";
const ILLU_2 = "Ilustración 1 (pintura oficial): San Martín, de pie y con uniforme impecable, alza la bandera ante una multitud ordenada.\nIlustración 2 (dibujo de un testigo): La plaza abarrotada, gente trepada a los balcones, vendedores entre el público; San Martín apenas se distingue a lo lejos.";
const ILLUSTRATIONS: ChoiceItem[] = [
  pt("¿Qué conservan las dos ilustraciones?", ILLU_1, "La escena del ataque a un «gigante» que no lo es", "La época en que ocurre la novela", "La ropa de los personajes"),
  pt("¿Qué efecto busca la Ilustración 2?", ILLU_1, "Actualizar la escena con humor", "Mostrar fielmente la España del siglo XVII", "Asustar al lector"),
  pt("¿Cómo aparece Sancho en cada ilustración?", ILLU_1, "En las dos toma distancia de la locura de su amo.", "En las dos ataca el molino junto a don Quijote.", "No aparece en ninguna."),
  pt("¿Qué destaca la pintura oficial?", ILLU_2, "La figura heroica de San Martín", "El desorden de la multitud en la plaza", "A los vendedores"),
  pt("¿Qué aporta el dibujo del testigo?", ILLU_2, "Cómo vivió el pueblo ese momento", "Un retrato detallado del rostro de San Martín", "El texto del discurso"),
  pt("¿Por qué conviene comparar ambas imágenes?", ILLU_2, "Porque cada una muestra una perspectiva del mismo hecho", "Porque una de las dos tiene que ser falsa", "Porque son idénticas"),
];
const VENN = "DIAGRAMA DE VENN\nSolo el cuento: breve · un conflicto\nAmbos: narrador · personajes · trama\nSolo la novela: extensa · varios conflictos";
const CAUSE_MAP = "ESPINA DE PESCADO: «Bajo rendimiento en lectura»\nCausas → pocas horas de lectura · bibliotecas cerradas · textos poco atractivos · exceso de pantallas";
const FLOW = "DIAGRAMA DE FLUJO\n¿La fuente tiene autor? → No → Descartar\n→ Sí → ¿Cita sus datos? → No → Buscar otra\n→ Sí → Usar y citar";
const ORGANIZERS: ChoiceItem[] = [
  pt("Según el diagrama, ¿qué comparten el cuento y la novela?", VENN, "Narrador, personajes y trama", "La brevedad", "Tener varios conflictos a la vez"), pt("Según el diagrama, ¿qué es propio solo de la novela?", VENN, "Su extensión y sus varios conflictos", "Tener personajes", "Tener narrador, personajes y una trama"),
  pt("Según el esquema, ¿cuál es el problema analizado?", CAUSE_MAP, "El bajo rendimiento en lectura", "El exceso de pantallas", "Las bibliotecas cerradas por las tardes"), pt("Según el esquema, ¿cuántas causas se proponen?", CAUSE_MAP, "Cuatro", "Una", "Dos"),
  pt("Según el diagrama de flujo, ¿qué haces si la fuente no tiene autor?", FLOW, "La descartas.", "La usas y la citas.", "Buscas sus datos."), pt("Según el diagrama de flujo, ¿cuándo puedes usar una fuente?", FLOW, "Cuando tiene autor y cita sus datos", "Cuando no tiene autor ni cita sus datos", "Siempre"),
];

export const ROWS: Row[] = [
  ["A.1", "Determinar la idea principal de un texto", (r) => readPassage(r, MAIN_PASSAGES, false)],
  ["A.2", "Combinar las ideas principales de dos textos", (r) => choose(r, "", TWO_MAIN)],

  ["B.1", "Relacionar las citas con sus temas", (r) => choose(r, "¿Qué tema expresa la cita?", QUOTE_THEMES)],
  ["B.2", "Determinar el tema de cuentos cortos", (r) => readPassage(r, THEMES, false)],
  ["B.3", "Determinar varios temas en cuentos cortos", (r) => readPassage(r, MULTI_THEMES, false)],

  ["C.1", "Identificar el propósito del autor", (r) => choose(r, "", AUTHOR_PURPOSE)],
  ["C.2", "Determinar el punto de vista del autor", (r) => choose(r, "", AUTHOR_POV)],

  ["D.1", "¿Qué oración es más formal?", (r) => choose(r, "", FORMALITY)],
  ["D.2", "Comparar el tono de dos textos", (r) => choose(r, "", TONE_COMPARE)],

  ["E.1", "Comparar y contrastar en textos informativos", (r) => readPassage(r, COMPARE, false)],
  ["E.2", "Relacionar causas y efectos en textos informativos", (r) => choose(r, "", CAUSE_INFO)],
  ["E.3", "Relacionar problemas con sus soluciones", (r) => choose(r, "¿Qué solución corresponde al problema?", PROBLEM_SOLUTION)],
  ["E.4", "Identificar estructuras de texto", (r) => choose(r, "", STRUCTURES)],

  ["F.1", "Identificar detalles sensoriales", (r) => choose(r, "", SENSORY)],
  ["F.2", "Interpretar el significado de una alusión a partir de su fuente", (r) => choose(r, "", ALLUSIONS)],
  ["F.3", "Interpretar figuras literarias", (r) => choose(r, "", FIGURE_MEANING)],
  ["F.4", "Clasificar figuras literarias", (r) => choose(r, "", FIGURE_CLASSIFY)],
  ["F.5", "Analizar el efecto de las figuras literarias en el significado y el tono", (r) => choose(r, "", FIGURE_EFFECT)],

  ["G.1", "Identificar el punto de vista del narrador", (r) => choose(r, "", NARRATOR)],
  ["G.2", "Hacer inferencias a partir de textos literarios", (r) => readPassage(r, INFER_LIT, false)],
  ["G.3", "Analizar cuentos cortos", (r) => readPassage(r, SHORT_STORIES, false)],

  ["H.1", "Señalar el esquema de rima", (r) => choose(r, "", RHYME_SCHEMES)],

  ["J.1", "Seguir el desarrollo de un argumento", (r) => readPassage(r, ARGUMENTS, false)],

  ["M.1", "Comparar la información de dos textos", (r) => choose(r, "", TWO_TEXTS)],
  ["M.2", "Comparar dos textos de géneros distintos", (r) => choose(r, "", GENRES)],

  ["N.1", "Comparar ilustraciones de temas literarios e históricos", (r) => choose(r, "", ILLUSTRATIONS)],
  ["N.2", "Leer organizadores gráficos", (r) => choose(r, "", ORGANIZERS)],
];
