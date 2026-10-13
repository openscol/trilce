import { readPassage } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// Lecturas (IXL 4th grade ELA, O-R): textos propios, literarios e
// informativos, con temas del Perú y de Latinoamérica.

export const SECTIONS: Section[] = [
  { id: "O", name: "Textos literarios: nivel 1", icon: "📗" },
  { id: "P", name: "Textos literarios: nivel 2", icon: "📘" },
  { id: "Q", name: "Textos informativos: nivel 1", icon: "📰" },
  { id: "R", name: "Textos informativos: nivel 2", icon: "🗞️" },
];

const LIT1 = {
  fantasy: [
    read("El mapa que hablaba", "🗺️", "En el desván de su abuela, Killa encontró un mapa enrollado. Al abrirlo, una vocecita dijo: «¡Por fin! Llevo cien años sin estirarme». El mapa le pidió que lo llevara al cerro Colorado, donde había dejado dormida a una nube. Subieron juntos, el mapa silbó, y la nube despertó llorando de alegría. Esa tarde llovió sobre el pueblo después de tres años de sequía.",
      ["¿Qué tenía de especial el mapa?", "Podía hablar.", "Estaba hecho de oro.", "Mostraba un tesoro escondido bajo el desván."],
      ["¿Para qué quería el mapa ir al cerro?", "Para despertar a una nube dormida", "Para esconderse de Killa", "Para estirarse al sol"],
      ["¿Qué consecuencia tuvo el viaje?", "Volvió a llover en el pueblo.", "El mapa se quedó dormido cien años más.", "Killa se perdió."]),
    read("La zapatería de medianoche", "👞", "Don Evaristo, el zapatero, dejaba cada noche un par de zapatos sin terminar. Por la mañana, los hallaba cosidos con puntadas diminutas. Una madrugada se escondió tras la cortina y vio a siete cuyes con dedales en la cabeza, cosiendo y cantando bajito. Don Evaristo no dijo nada. Desde entonces, deja en el mostrador un plato de alfalfa fresca.",
      ["¿Quiénes cosían los zapatos?", "Siete cuyes", "Los hijos del zapatero", "Unos duendes con gorros rojos y barbas largas"],
      ["¿Por qué don Evaristo deja alfalfa?", "Para agradecer la ayuda de los cuyes", "Para atrapar a los cuyes", "Porque le sobra"],
      ["¿Qué muestra que don Evaristo es discreto?", "Vio a los cuyes y no dijo nada.", "Dejaba zapatos sin terminar.", "Se despertó de madrugada."]),
  ],
  realistic: [
    read("El primer día de Nahuel", "🏫", "Nahuel llegó a la escuela nueva con la mochila apretada contra el pecho. En su pueblo todos se conocían; aquí no sabía ni dónde quedaba el baño. En el recreo se sentó solo, hasta que una pelota rodó hasta sus pies. «¿Juegas? Nos falta un arquero», dijo una niña. Nahuel atajó tres penales. A la salida, ya tenía un apodo: Manos de Araña.",
      ["¿Cómo se sentía Nahuel al llegar?", "Nervioso y fuera de lugar", "Aburrido", "Feliz de reencontrarse con sus viejos amigos del pueblo"],
      ["¿Qué hecho cambió su día?", "Lo invitaron a jugar de arquero.", "Encontró el baño al final del pasillo.", "Sonó el timbre."],
      ["¿Qué indica el apodo «Manos de Araña»?", "Que sus compañeros lo aceptaron y admiraron", "Que se burlaban de él", "Que todos le tenían miedo a sus manos largas y flacas"]),
    read("La receta secreta", "🥧", "La abuela Chela hacía el mejor pastel de choclo del barrio, pero nunca escribió la receta. Cuando se enfermó, Fabiana se sentó junto a su cama con un cuaderno. «Un puñado de esto, una pizca de aquello», dictaba la abuela. Fabiana midió cada puñado en tazas y cada pizca en cucharitas. El domingo, toda la familia probó el pastel. La abuela sonrió: «Le falta sal... pero está igualito».",
      ["¿Cuál era el problema?", "La receta no estaba escrita.", "No había choclo.", "A nadie de la familia le gustaba el pastel de la abuela."],
      ["¿Cómo lo resolvió Fabiana?", "Anotó y midió lo que dictaba su abuela.", "Compró un pastel.", "Buscó la receta en internet y en libros de cocina."],
      ["¿Qué revela la frase final de la abuela?", "Que está orgullosa, con un toque de humor", "Que el pastel le pareció horrible y no lo terminó", "Que quiere cocinar ella"]),
  ],
  scifi: [
    read("El robot que quería aburrirse", "🤖", "En el año 2190, el robot Tiko hacía las tareas de toda la casa en ocho segundos. Los humanos decían que aburrirse era terrible, y Tiko quiso probarlo. Se sentó en el jardín sin hacer nada. A los diez minutos notó una fila de hormigas, luego una nube con forma de llama. Esa noche escribió en su memoria: «Aburrirse sirve para mirar».",
      ["¿Qué quería probar Tiko?", "Qué se siente aburrirse", "Cuánto tardaba en limpiar", "Cómo vuelan las nubes"],
      ["¿Qué descubrió al no hacer nada?", "Detalles que antes no veía", "Que los humanos mienten siempre sobre lo que sienten", "Que se le acababa la batería"],
      ["¿Qué detalle indica que es ciencia ficción?", "Ocurre en 2190 y el protagonista es un robot.", "Hay hormigas que caminan en fila por el jardín.", "Hay una nube."]),
    read("Clase en Marte", "🚀", "La profesora Qori proyectó la Tierra en el techo del domo. «Allá el cielo es azul y el agua cae sola desde arriba», explicó. Los niños marcianos rieron: ¿agua gratis del cielo? Inti, que había nacido en Marte, levantó la mano: «¿Y podremos ir algún día?». La profesora señaló la nave escolar. «El viaje de promoción es en seis años. Vayan ahorrando oxígeno».",
      ["¿Dónde ocurre la historia?", "En una escuela dentro de un domo en Marte", "En una escuela de la Tierra, cerca de una playa azul", "En una nave perdida"],
      ["¿Por qué se ríen los niños?", "Porque nunca han visto llover", "Porque la profesora contó un chiste sobre los domos", "Porque no les gusta el agua"],
      ["¿Qué se infiere de «vayan ahorrando oxígeno»?", "En Marte el oxígeno es un recurso valioso.", "En Marte sobra el aire y nadie lo cuida.", "El viaje es mañana."]),
  ],
};

const LIT2 = {
  realistic: [
    read("La feria de ciencias", "🔬", "El volcán de Matías no erupcionó. Frente al jurado, el vinagre solo hizo unas burbujas tristes. Sus compañeros esperaban que se echara a llorar. En cambio, Matías respiró y dijo: «Mi experimento falló, y creo saber por qué: usé bicarbonato vencido. La próxima vez revisaré mis materiales». El jurado anotó algo. Una semana después recibió una mención: «Al mejor análisis de un error».",
      ["¿Qué salió mal?", "El volcán no erupcionó.", "Matías llegó tarde.", "El jurado se fue antes de ver los demás experimentos."],
      ["¿Cómo reaccionó Matías?", "Explicó con calma la causa del error.", "Culpó a sus compañeros de haberlo distraído.", "Se puso a llorar."],
      ["¿Qué enseña el cuento?", "De los errores también se aprende.", "Los experimentos nunca funcionan.", "Hay que evitar las ferias."]),
    read("El turno de Micaela", "🏐", "Micaela llevaba todo el campeonato en la banca. Entrenaba igual que las demás, pero nunca la llamaban. En la final, la capitana se torció el tobillo. «Micaela, entras», dijo la entrenadora. Le sudaban las manos. El primer saque se fue contra la red. Miró a la banca: la capitana le levantó el pulgar. El segundo saque cayó justo en la línea.",
      ["¿Por qué entró Micaela a jugar?", "Porque la capitana se lesionó", "Porque lo pidió a gritos", "Porque el otro equipo se retiró de la final"],
      ["¿Qué gesto le dio confianza?", "El pulgar arriba de la capitana", "El pitazo del árbitro al empezar el set", "El grito del público"],
      ["¿Qué muestra que Micaela es constante?", "Entrenaba igual aunque no jugaba.", "Falló el primer saque contra la red.", "Le sudaban las manos."]),
  ],
  historical: [
    read("El chasqui más joven", "🏃", "Corría el tiempo de los incas. Sayri, de doce años, esperaba en el tambo con el corazón golpeándole el pecho. Era su primer relevo. A lo lejos sonó el pututo: llegaba el otro chasqui. Sayri recibió el quipu, repitió el mensaje en voz baja y echó a correr por el camino de piedra. No debía detenerse hasta el siguiente tambo: el Inca esperaba noticias del sur.",
      ["¿En qué época ocurre el relato?", "En tiempos de los incas", "En la actualidad", "Durante la Independencia"],
      ["¿Qué trabajo hacía Sayri?", "Llevar mensajes corriendo por relevos", "Construir caminos de piedra", "Tocar el pututo en las fiestas del Inca"],
      ["¿Qué objeto llevaba el mensaje?", "Un quipu", "Una carta", "Un pututo"]),
    read("La noche del 28", "🎺", "Lima, julio de 1821. Josefa, hija de un panadero, no pudo dormir. Toda la ciudad murmuraba que al día siguiente el general San Martín hablaría en la plaza. De madrugada ayudó a su padre a hornear el doble de pan: «Mañana habrá gente de todos los barrios». Al mediodía, apretada entre la multitud, oyó por primera vez la palabra que repetiría toda su vida: independencia.",
      ["¿Qué hecho histórico enmarca el cuento?", "La proclamación de la Independencia del Perú", "La fundación de Lima", "La construcción de un ferrocarril hacia la sierra"],
      ["¿Por qué hornearon el doble de pan?", "Porque esperaban mucha gente en la ciudad", "Porque el pan se había quemado", "Porque era feriado"],
      ["¿Qué parte del texto es inventada?", "Josefa y su padre panadero", "La plaza de Lima", "El general San Martín"]),
  ],
  poetry: [
    read("El río", "🏞️", "Nace chiquito entre el hielo,\ncomo un hilo de cristal.\nBaja cantando al desvelo\npor la quebrada y el pajonal.\n\nSaluda al puente, a la vaca,\na la niña que va a lavar.\nSe hace ancho, se hace viejo,\ny se queda a dormir en el mar.",
      ["¿De qué habla el poema?", "Del recorrido de un río", "De una niña que lava ropa", "De la vida de las vacas en el pajonal"],
      ["¿Qué recurso hay en «como un hilo de cristal»?", "Un símil", "Una rima", "Una pregunta"],
      ["¿Qué significa que el río «se queda a dormir en el mar»?", "Que termina su viaje al desembocar", "Que se congela", "Que deja de tener agua"]),
    read("Canción del adobe", "🧱", "Barro y paja, sol y manos:\nasí nació mi pared.\nNo tiene prisa ni adornos,\ntiene sombra para la sed.\n\nMi casa es tierra parada\nque aprendió a decir «entrad».\nCuando llueve huele a campo;\ncuando hay frío, da amistad.",
      ["¿Con qué está hecha la pared?", "Con barro y paja", "Con ladrillo y cemento", "Con piedra y madera"],
      ["¿Qué significa «mi casa es tierra parada»?", "Que la casa es de tierra convertida en muros", "Que la casa se mueve", "Que la casa está en medio de un terreno vacío"],
      ["¿Qué sentimiento transmite el poema?", "Cariño por una casa sencilla", "Vergüenza", "Miedo a la lluvia"]),
  ],
  drama: [
    read("El trueque", "🎭", "(Plaza de un pueblo. TOMASA carga papas; BENITO, pescado seco.)\nTOMASA: Te doy diez papas por dos pescados.\nBENITO: (Se cruza de brazos.) Doce.\nTOMASA: (Bajito, al público.) Si supiera que ya no tengo más... (A Benito.) Once, y te regalo una sonrisa.\nBENITO: (Ríe.) Trato hecho. Pero la sonrisa primero.",
      ["¿Qué indican las palabras entre paréntesis?", "Lo que hacen los personajes y cómo hablan", "Lo que los personajes dicen en voz alta al público", "El título de la obra"],
      ["¿A quién le habla Tomasa cuando dice «Si supiera que ya no tengo más...»?", "Al público", "A Benito", "A sí misma, mientras duerme en la plaza"],
      ["¿Cómo se resuelve el conflicto?", "Acuerdan once papas y una sonrisa.", "Benito se va molesto con su pescado seco.", "Tomasa regala todo."]),
    read("La maleta", "🧳", "(Sala. Noche. LUISA entra arrastrando una maleta enorme.)\nABUELO: ¿A dónde vas con eso, hijita?\nLUISA: (Seria.) A la Luna. Aquí nadie me deja ver tele.\nABUELO: (Asiente.) Lejos está. ¿Llevas abrigo?\nLUISA: (Abre la maleta: solo hay galletas.) Mmm... no.\nABUELO: Entonces cenamos y partes mañana.\nLUISA: (Suspira.) Bueno. Pero mañana sí me voy.",
      ["¿Por qué Luisa quiere irse?", "Porque no la dejan ver tele", "Porque quiere ser astronauta", "Porque el abuelo la retó"],
      ["¿Qué muestra que el abuelo es comprensivo?", "Le sigue el juego en vez de regañarla.", "Le quita la maleta y la guarda bajo llave en su cuarto.", "No le contesta."],
      ["¿Qué acotación revela lo que había en la maleta?", "«Abre la maleta: solo hay galletas».", "«Sala. Noche. Luisa entra arrastrando una maleta».", "«Suspira»."]),
  ],
};

const INFO1 = {
  animals: [
    read("El gallito de las rocas", "🐦", "El gallito de las rocas es el ave nacional del Perú. Vive en los bosques nublados, entre los Andes y la selva. El macho es de un naranja intenso y tiene una cresta redonda que casi le tapa el pico. Cada mañana, los machos se reúnen a bailar y chillar para atraer a las hembras, que son de color marrón y mucho más discretas.",
      ["¿Dónde vive el gallito de las rocas?", "En los bosques nublados", "En los desiertos de la costa", "En las lagunas"],
      ["¿En qué se diferencian machos y hembras?", "En el color del plumaje", "En el lugar donde viven", "En que solo las hembras bailan cada mañana"],
      ["¿Para qué bailan los machos?", "Para atraer a las hembras", "Para asustar a otros animales", "Para buscar comida"]),
    read("El paiche", "🐟", "El paiche es uno de los peces de agua dulce más grandes del mundo: puede medir tres metros. Vive en los ríos y lagunas de la Amazonía. Aunque es un pez, necesita salir a la superficie cada quince minutos para tomar aire. Por eso es fácil de pescar, y estuvo a punto de desaparecer. Hoy se cría en estanques para protegerlo.",
      ["¿Qué tiene de particular la respiración del paiche?", "Debe salir a tomar aire.", "Respira solo de noche.", "Nunca sube a la superficie de los ríos amazónicos."],
      ["¿Por qué estuvo en peligro?", "Porque era fácil de pescar", "Porque los ríos se secaron", "Porque no tenía alimento"],
      ["¿Qué se hace hoy para protegerlo?", "Se cría en estanques.", "Se lo lleva al mar.", "Se prohíbe mirarlo."]),
  ],
  art: [
    read("El retablo ayacuchano", "🎨", "El retablo es una caja de madera con puertas pintadas de flores. Dentro hay pequeñas figuras hechas con una pasta de papa y yeso. Antiguamente mostraban santos; hoy también cuentan fiestas, cosechas y escenas de mercado. Los artesanos de Ayacucho aprenden el oficio en familia, y un solo retablo puede llevar semanas de trabajo.",
      ["¿Con qué se hacen las figuras?", "Con pasta de papa y yeso", "Con piedra tallada", "Con lana de alpaca teñida de muchos colores"],
      ["¿Qué muestran los retablos actuales?", "Escenas de la vida diaria, además de santos", "Solo santos", "Solo animales"],
      ["¿Cómo se aprende el oficio?", "En familia", "En la universidad", "Por internet"]),
    read("La marinera", "💃", "La marinera es un baile de pareja muy querido en el Perú. Los bailarines no se tocan: se acercan y se alejan agitando un pañuelo blanco. En la marinera norteña, la mujer baila descalza y el hombre usa sombrero de paja. Cada enero, la ciudad de Trujillo organiza un concurso al que llegan parejas de todo el país.",
      ["¿Qué objeto usan los dos bailarines?", "Un pañuelo blanco", "Un abanico", "Una cinta roja"],
      ["¿Qué es propio de la marinera norteña?", "La mujer baila descalza.", "Se baila sin música ni pareja en las plazas.", "Nadie usa sombrero."],
      ["¿Dónde se realiza el concurso de enero?", "En Trujillo", "En Arequipa", "En Iquitos"]),
  ],
  places: [
    read("El cañón del Colca", "🏔️", "El cañón del Colca, en Arequipa, es uno de los más profundos del planeta: en algunos puntos supera los tres mil metros. En sus laderas hay andenes construidos antes de los incas, donde todavía se siembra. Muy temprano, desde el mirador de la Cruz del Cóndor, los visitantes ven a los cóndores planear aprovechando el aire caliente que sube.",
      ["¿Qué hace especial al cañón?", "Su enorme profundidad", "Sus playas", "Sus edificios modernos"],
      ["¿Qué muestran los andenes?", "Que allí se cultiva desde hace muchísimo tiempo", "Que nadie vivió en la zona", "Que los incas construyeron un cañón para sembrar papas"],
      ["¿Por qué los cóndores planean por la mañana?", "Aprovechan el aire caliente que sube.", "Huyen de los turistas que llegan al mirador.", "Buscan agua."]),
    read("Las islas flotantes", "🛶", "En el lago Titicaca, el pueblo uro vive sobre islas que él mismo construye con totora, una planta que crece en el agua. Cada cierto tiempo se agregan capas nuevas, porque las de abajo se pudren. Con totora también hacen sus casas y sus balsas. Si una familia quiere mudarse, puede cortar su pedazo de isla y llevárselo.",
      ["¿Con qué se construyen las islas?", "Con totora", "Con piedras y barro", "Con troncos traídos de la selva amazónica"],
      ["¿Por qué se agregan capas nuevas?", "Porque las capas de abajo se pudren", "Porque llegan más turistas", "Para hacerlas más altas que las islas vecinas"],
      ["¿Qué dato muestra que las islas son móviles?", "Una familia puede cortar y llevarse su parte.", "Las casas y las balsas también son de totora.", "El lago es grande."]),
  ],
  sports: [
    read("El surf nació aquí", "🏄", "Mucho antes de las tablas modernas, los pescadores del norte del Perú ya corrían olas. Lo hacían sobre caballitos de totora, unas balsas angostas con la punta levantada. Salían a pescar y regresaban a la orilla montados en la ola. Hoy, en Huanchaco, los pescadores siguen usándolos, y muchos surfistas los consideran los abuelos de la tabla.",
      ["¿Qué es un caballito de totora?", "Una balsa angosta de totora", "Un caballo pequeño", "Una tabla de plástico"],
      ["¿Para qué corrían olas los pescadores?", "Para volver a la orilla después de pescar", "Para ganar concursos internacionales de surf", "Para asustar a los peces"],
      ["¿Qué significa llamarlos «abuelos de la tabla»?", "Que son un antecedente de la tabla de surf", "Que son muy viejos y ya no sirven", "Que los usan los abuelos"]),
    read("Jugar ajedrez", "♟️", "El ajedrez se juega entre dos personas sobre un tablero de 64 casillas. Cada jugador mueve dieciséis piezas y gana quien atrapa al rey rival. No hace falta ser veloz ni fuerte: se necesita pensar varias jugadas por adelantado. Por eso muchos colegios lo enseñan; ayuda a concentrarse y a aceptar las derrotas con calma.",
      ["¿Cuándo se gana una partida?", "Cuando se atrapa al rey rival", "Cuando se comen todas las piezas", "Cuando pasa una hora"],
      ["¿Qué habilidad pide el ajedrez?", "Planear con anticipación", "Correr rápido", "Tener mucha fuerza en los brazos"],
      ["¿Por qué lo enseñan en colegios?", "Porque ayuda a concentrarse", "Porque es obligatorio", "Porque no requiere tablero"]),
  ],
};

const INFO2 = {
  people: [
    read("María Reiche", "📐", "María Reiche fue una matemática alemana que llegó al Perú en 1932. Al conocer las líneas de Nasca, decidió dedicarles su vida. Durante décadas las midió con una cinta y las limpió con una escoba, bajo el sol del desierto. Dormía en un cuarto sencillo cerca de las figuras. Gracias a su insistencia, las líneas fueron protegidas y hoy son Patrimonio de la Humanidad.",
      ["¿A qué dedicó su vida María Reiche?", "A estudiar y cuidar las líneas de Nasca", "A enseñar matemáticas en una escuela de Alemania", "A construir un museo en Lima"],
      ["¿Qué detalle muestra su entrega?", "Trabajó décadas bajo el sol del desierto.", "Llegó al Perú en 1932, cuando era muy joven.", "Era alemana."],
      ["¿Qué logró con su insistencia?", "Que las líneas fueran protegidas", "Que se dibujaran nuevas figuras con escobas", "Que se cerrara el desierto"]),
    read("Pedro Paulet", "🚀", "Pedro Paulet nació en Arequipa en 1874. De niño lanzaba cohetes de carrizo en el campo. Ya ingeniero, diseñó un motor que funcionaba con combustible líquido, una idea adelantada a su tiempo. También dibujó una nave a la que llamó «avión torpedo». Décadas después, varios científicos que llevaron al ser humano al espacio reconocieron su trabajo como pionero.",
      ["¿Qué hacía Paulet de niño?", "Lanzaba cohetes de carrizo.", "Construía aviones de papel para venderlos.", "Reparaba motores."],
      ["¿Por qué su motor fue importante?", "Usaba combustible líquido, algo novedoso.", "Era muy barato y fácil de construir en casa.", "Funcionaba con carrizo."],
      ["¿Qué significa que fue «pionero»?", "Que fue de los primeros en proponer esas ideas", "Que viajó al espacio en una nave diseñada por él", "Que copió a otros"]),
  ],
  business: [
    read("El trueque y la moneda", "🪙", "Antes de que existiera el dinero, la gente intercambiaba productos: a esto se le llama trueque. El trueque tenía un problema: si yo tenía papas y quería sal, debía hallar a alguien con sal que quisiera papas. La moneda resolvió esa dificultad, porque todos la aceptaban. Hoy pagamos también con tarjetas y celulares, pero la idea es la misma: un medio que todos reconocen.",
      ["¿Qué es el trueque?", "Intercambiar productos sin usar dinero", "Pagar con tarjeta", "Guardar monedas en una alcancía durante todo el año"],
      ["¿Qué problema tenía el trueque?", "Había que hallar a alguien que quisiera lo ofrecido.", "Las papas pesaban demasiado para llevarlas al mercado.", "No existía la sal."],
      ["¿Qué tienen en común la moneda y el pago con celular?", "Son medios que todos aceptan.", "Son de metal.", "Se inventaron el mismo año."]),
    read("Cómo viaja un mensaje", "📱", "Cuando envías un mensaje desde un celular, el texto se convierte en señales. Esas señales viajan por el aire hasta una antena y, desde allí, por cables de fibra óptica, algunos tendidos en el fondo del mar. En menos de un segundo llegan a otra antena y, por fin, al celular de tu amigo. Lo que parece magia es, en realidad, una larga carrera de relevos.",
      ["¿En qué se convierte el texto al enviarlo?", "En señales", "En papel", "En sonido"],
      ["¿Por dónde viajan las señales entre antenas?", "Por cables de fibra óptica", "Por tuberías de agua", "Por las pistas, en camiones muy rápidos"],
      ["¿Por qué el autor lo compara con una carrera de relevos?", "Porque el mensaje pasa por varias etapas hasta llegar", "Porque los celulares corren más rápido que las antenas", "Porque gana el más veloz"]),
  ],
  science: [
    read("¿Por qué tiembla la Tierra?", "🌍", "La superficie de la Tierra está partida en grandes piezas llamadas placas. Las placas se mueven muy despacio, unos centímetros al año. A veces dos placas se traban, y la fuerza se acumula. Cuando por fin se sueltan, la energía sale en forma de ondas: eso es un sismo. El Perú está sobre el borde de dos placas; por eso aquí tiembla con frecuencia.",
      ["¿Qué son las placas?", "Grandes piezas de la superficie terrestre", "Montañas muy altas que están cubiertas de nieve", "Ondas de energía"],
      ["¿Qué causa un sismo?", "Las placas trabadas se sueltan de golpe.", "Las placas dejan de moverse.", "El mar se enfría durante varios años seguidos."],
      ["¿Por qué tiembla tanto en el Perú?", "Porque está en el borde de dos placas", "Porque es un país pequeño", "Porque tiene desiertos muy secos en toda la costa"]),
    read("Las plantas hacen su comida", "🌿", "Las plantas no salen a buscar alimento: lo fabrican. Para eso necesitan tres cosas: agua, que absorben por las raíces; un gas del aire llamado dióxido de carbono, que entra por las hojas; y la luz del sol. Con ellas producen azúcares que las hacen crecer. De paso, liberan oxígeno, el gas que respiramos. Este proceso se llama fotosíntesis.",
      ["¿Qué tres cosas necesita la planta?", "Agua, dióxido de carbono y luz", "Agua, tierra y oxígeno", "Luz, azúcar, viento y abono natural"],
      ["¿Qué producto de la fotosíntesis usamos al respirar?", "El oxígeno", "El azúcar", "El dióxido de carbono"],
      ["¿Por dónde entra el agua?", "Por las raíces", "Por las hojas", "Por las flores"]),
  ],
  history: [
    read("Caral, la ciudad más antigua", "🏛️", "En el valle de Supe, al norte de Lima, están los restos de Caral. Tiene unos cinco mil años: es tan antigua como las pirámides de Egipto. Sus habitantes levantaron pirámides de piedra y plazas circulares. No se han hallado armas ni murallas, pero sí flautas hechas con huesos de pelícano. Los arqueólogos creen que fue una sociedad pacífica, dedicada al comercio.",
      ["¿Qué antigüedad tiene Caral?", "Unos cinco mil años", "Unos quinientos años", "Unos cien años"],
      ["¿Por qué se cree que fue una sociedad pacífica?", "Porque no se hallaron armas ni murallas", "Porque tenía pirámides", "Porque quedaba en un valle muy alejado de otras ciudades"],
      ["¿Qué objeto muestra que hacían música?", "Las flautas de hueso", "Las plazas circulares", "Las piedras"]),
    read("El Qhapaq Ñan", "🛤️", "El Qhapaq Ñan fue la red de caminos de los incas. Sumaba más de treinta mil kilómetros y unía territorios que hoy son seis países. Cruzaba desiertos, punas y selvas con escalinatas de piedra y puentes de fibra vegetal. Por él circulaban ejércitos, llamas cargadas y chasquis. Partes del camino siguen en uso: algunas comunidades todavía renuevan sus puentes cada año.",
      ["¿Qué fue el Qhapaq Ñan?", "La red de caminos de los incas", "Un puente de piedra", "La capital del imperio"],
      ["¿Qué muestra su gran extensión?", "Unía territorios de seis países actuales.", "Tenía escalinatas.", "Pasaban llamas."],
      ["¿Qué prueba que aún es útil?", "Hay comunidades que renuevan sus puentes cada año.", "Los ejércitos incas lo siguen recorriendo hoy.", "Ya nadie lo conoce."]),
  ],
};

export const ROWS: Row[] = [
  ["O.1", "Leer fantasía con ilustraciones", (r) => readPassage(r, LIT1.fantasy, false)],
  ["O.2", "Leer cuentos realistas con ilustraciones", (r) => readPassage(r, LIT1.realistic, false)],
  ["O.3", "Leer ciencia ficción con ilustraciones", (r) => readPassage(r, LIT1.scifi, false)],

  ["P.1", "Leer cuentos realistas", (r) => readPassage(r, LIT2.realistic, false)],
  ["P.2", "Leer ficción histórica", (r) => readPassage(r, LIT2.historical, false)],
  ["P.3", "Leer poesía", (r) => readPassage(r, LIT2.poetry, false)],
  ["P.4", "Leer teatro", (r) => readPassage(r, LIT2.drama, false)],

  ["Q.1", "Leer sobre animales", (r) => readPassage(r, INFO1.animals, false)],
  ["Q.2", "Leer sobre arte, música y tradiciones", (r) => readPassage(r, INFO1.art, false)],
  ["Q.3", "Leer sobre lugares famosos", (r) => readPassage(r, INFO1.places, false)],
  ["Q.4", "Leer sobre deportes y pasatiempos", (r) => readPassage(r, INFO1.sports, false)],

  ["R.1", "Leer sobre personajes famosos", (r) => readPassage(r, INFO2.people, false)],
  ["R.2", "Leer sobre negocios y tecnología", (r) => readPassage(r, INFO2.business, false)],
  ["R.3", "Leer sobre ciencia y naturaleza", (r) => readPassage(r, INFO2.science, false)],
  ["R.4", "Leer sobre historia", (r) => readPassage(r, INFO2.history, false)],
];
