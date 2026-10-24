import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 6.° de Primaria · banco de lecturas largas: textos informativos propios y el
// estudio de tres obras en castellano de dominio público, muy leídas en la
// escuela: «El caballero Carmelo» (Abraham Valdelomar), «Paco Yunque» (César
// Vallejo) y «Cuentos de la selva» (Horacio Quiroga). Los pasajes son
// adaptaciones resumidas, no citas textuales. Los textos de no ficción (Harriet
// Tubman, Malala Yousafzai y el gran incendio de Chicago) son propios.


const INFO = {
  animals: [
    read("El ajolote", "🦎", "El ajolote es una salamandra que vive en los canales de Xochimilco, en México. A diferencia de otros anfibios, casi nunca completa su metamorfosis: conserva toda la vida las branquias externas y la aleta de su etapa de larva. Su rasgo más asombroso es que puede regenerar patas, cola e incluso partes del corazón y del cerebro, sin dejar cicatriz. Por eso lo estudian laboratorios de todo el mundo. En libertad, sin embargo, está al borde de la extinción a causa de la contaminación y de los peces introducidos.",
      ["¿Qué característica hace único al ajolote entre los anfibios?", "Conserva rasgos de larva durante toda su vida.", "Vive únicamente en ríos de agua helada y muy profunda.", "No tiene branquias."],
      ["¿Por qué interesa tanto a la ciencia?", "Por su capacidad de regenerar órganos", "Por el color llamativo de su piel y de sus ojos", "Por su gran tamaño"],
      ["¿Qué paradoja plantea el texto?", "Abunda en laboratorios, pero casi desaparece en libertad.", "Regenera sus patas, pero no puede nadar.", "Vive en México, pero nadie lo conoce."]),
    read("Las hormigas cortadoras", "🐜", "En la Amazonía, largas filas de hormigas cargan trozos de hojas más grandes que ellas. No se los comen: los llevan al hormiguero para alimentar un hongo, y es ese hongo lo que consume la colonia. Dicho de otro modo, las hormigas cortadoras practican la agricultura desde hace millones de años. Incluso «fumigan» su cultivo: llevan en el cuerpo bacterias que producen sustancias contra las plagas del hongo.",
      ["¿Para qué recogen hojas las hormigas?", "Para cultivar el hongo del que se alimentan", "Para construir las paredes y los techos del hormiguero", "Para comérselas"],
      ["¿Por qué el autor dice que «practican la agricultura»?", "Porque siembran, cuidan y cosechan su alimento", "Porque trabajan en las chacras de los agricultores", "Porque comen plantas"],
      ["¿Qué función cumplen las bacterias de su cuerpo?", "Proteger el hongo de las plagas", "Ayudarlas a cargar hojas", "Alimentar a las larvas con las hojas más tiernas"]),
  ],
  places: [
    read("La Antártida", "🧊", "La Antártida es el continente más frío, seco y ventoso del planeta. Aunque está cubierta por una capa de hielo de casi dos kilómetros de espesor en promedio, técnicamente es un desierto: allí casi no nieva. No tiene habitantes permanentes ni pertenece a ningún país. Un tratado firmado en 1959 la reserva para la paz y la ciencia. El Perú mantiene allí, desde 1989, la estación científica Machu Picchu.",
      ["¿Por qué se considera a la Antártida un desierto?", "Porque recibe muy pocas precipitaciones", "Porque está cubierta de dunas de arena muy fina", "Porque hace calor"],
      ["¿Qué establece el tratado de 1959?", "Que se dedique a la paz y a la ciencia", "Que cada país pueda explotar libremente sus recursos", "Que nadie pueda visitarla"],
      ["¿Qué presencia tiene el Perú allí?", "Una estación científica", "Una ciudad", "Una mina de hierro que funciona todo el año"]),
    read("Petra", "🏜️", "En el desierto de Jordania, oculta tras un desfiladero de más de un kilómetro, se encuentra Petra. Sus edificios no fueron construidos: fueron tallados directamente en la roca rosada hace unos dos mil años por los nabateos, un pueblo de comerciantes. Lo más admirable no se ve a simple vista: una red de canales y cisternas que recogía cada gota de lluvia y permitía que treinta mil personas vivieran en pleno desierto.",
      ["¿Cómo se hicieron los edificios de Petra?", "Tallándolos en la roca", "Levantándolos con ladrillos de adobe traídos de lejos", "Con madera"],
      ["Según el autor, ¿cuál fue el mayor logro de los nabateos?", "Su sistema para aprovechar el agua", "El color rosado de la piedra", "El tamaño del desfiladero por el que se entra"],
      ["¿Qué permitió ese sistema?", "Sostener una ciudad populosa en el desierto", "Navegar por los canales", "Cultivar arroz"]),
  ],
  business: [
    read("¿Qué es la inflación?", "💸", "Si con diez soles antes comprabas cinco panes y hoy solo cuatro, el dinero ha perdido valor: eso es la inflación. Ocurre cuando los precios suben de manera general y sostenida. Una inflación baja se considera normal; una muy alta, en cambio, perjudica sobre todo a quienes viven de un sueldo fijo, porque su dinero alcanza cada vez para menos. Por eso los bancos centrales intentan mantenerla bajo control.",
      ["¿Qué es la inflación?", "El aumento general y sostenido de los precios", "La subida del precio de un solo producto durante una semana", "El ahorro de dinero"],
      ["¿A quiénes afecta más una inflación alta?", "A quienes tienen ingresos fijos", "A los bancos centrales", "A nadie, porque todos los precios suben al mismo tiempo"],
      ["¿Para qué sirve el ejemplo de los panes?", "Para mostrar que el dinero compra menos", "Para explicar cómo se hace el pan", "Para decir que el pan es caro"]),
    read("Los algoritmos que eligen por ti", "📲", "Cuando una plataforma te sugiere un video, no lo hace al azar. Un algoritmo analiza qué viste antes, cuánto tiempo y en qué te detuviste, y te muestra lo que probablemente te retendrá más. El sistema es eficaz, pero tiene un efecto secundario: como tiende a ofrecerte más de lo mismo, puedes terminar en una «burbuja» donde solo ves opiniones parecidas a las tuyas. Salir de ella exige buscar a propósito otras fuentes.",
      ["¿Con qué criterio recomienda videos el algoritmo?", "Con lo que más probablemente retendrá tu atención", "Con lo que los profesores consideran más educativo", "Al azar"],
      ["¿Qué es la «burbuja» de la que habla el texto?", "Ver solo contenidos e ideas similares a las propias", "Un programa para proteger los datos personales", "Un tipo de video"],
      ["¿Qué recomienda el autor?", "Buscar fuentes distintas de manera intencional", "Dejar de usar internet", "Ver más videos de los que sugiere la plataforma"]),
  ],
  science: [
    read("Los agujeros negros", "🕳️", "Cuando una estrella muy grande agota su combustible, colapsa sobre sí misma. Si su masa es suficiente, se comprime en un punto de densidad extrema: un agujero negro. Su gravedad es tan intensa que nada puede escapar de él, ni siquiera la luz; por eso no se lo puede ver directamente. Los astrónomos lo detectan por sus efectos: estrellas que giran alrededor de «nada» o gas que se calienta y brilla antes de caer.",
      ["¿Cómo se forma un agujero negro?", "Por el colapso de una estrella muy masiva", "Por el choque de dos planetas pequeños y fríos", "Por una explosión solar"],
      ["¿Por qué no puede verse directamente?", "Porque ni la luz escapa de su gravedad", "Porque está demasiado lejos de cualquier telescopio", "Porque es transparente"],
      ["¿Cómo saben los astrónomos que existe?", "Por los efectos que produce a su alrededor", "Porque lo han visitado", "Porque emite una luz muy intensa y de color negro"]),
    read("El microbioma", "🦠", "En tu intestino viven billones de bacterias. Lejos de ser enemigas, la mayoría te ayuda: descomponen fibras que tú no puedes digerir, fabrican vitaminas y entrenan a tus defensas. A ese conjunto se le llama microbioma. Cuando tomamos antibióticos sin necesidad, eliminamos también a muchas de estas bacterias beneficiosas. Una dieta variada, rica en frutas, verduras y menestras, ayuda a mantenerlas.",
      ["¿Qué es el microbioma?", "El conjunto de microorganismos que viven en nuestro cuerpo", "Una enfermedad causada por bacterias intestinales", "Un tipo de vitamina"],
      ["¿Qué riesgo tiene el uso innecesario de antibióticos?", "Destruye bacterias beneficiosas.", "Hace crecer demasiado el intestino.", "Aumenta las vitaminas."],
      ["¿Qué idea corrige el texto?", "Que todas las bacterias son dañinas", "Que las frutas son saludables", "Que el intestino sirve para digerir los alimentos"]),
  ],
  history: [
    read("La ruta de la seda", "🐫", "Durante más de mil quinientos años, una red de caminos unió China con el Mediterráneo. Se la conoce como la ruta de la seda, aunque por ella viajaban también especias, papel, pólvora y vidrio. Casi ningún comerciante la recorría entera: las mercancías pasaban de mano en mano, de caravana en caravana. Con los productos viajaron también ideas, religiones, inventos… y enfermedades. Fue, en cierto modo, la primera globalización.",
      ["¿Qué fue la ruta de la seda?", "Una red de caminos comerciales entre Oriente y Occidente", "Un único camino por el que solo se transportaba seda", "Un río de China"],
      ["¿Cómo viajaban las mercancías?", "Pasando de una caravana a otra", "En un solo viaje directo", "En barcos de vapor que cruzaban el desierto"],
      ["¿Por qué el autor la llama «la primera globalización»?", "Porque conectó pueblos lejanos e intercambió bienes e ideas", "Porque todos hablaban el mismo idioma", "Porque duró poco"]),
    read("El guano y la riqueza fugaz", "🪶", "A mediados del siglo XIX, el Perú encontró una fortuna en un lugar inesperado: el excremento de aves acumulado durante siglos en sus islas. El guano era el mejor fertilizante conocido y Europa lo compraba a precio de oro. Con ese dinero se construyeron ferrocarriles y se abolió la esclavitud. Pero el país no diversificó su economía: cuando el guano se agotó y aparecieron fertilizantes artificiales, llegó la bancarrota.",
      ["¿Por qué era tan valioso el guano?", "Era un fertilizante excelente.", "Servía para fabricar pólvora y armas de guerra.", "Era un alimento."],
      ["¿Qué error señala el texto?", "Depender de un solo recurso", "Construir ferrocarriles", "Vender el guano demasiado barato a los países de Europa"],
      ["¿Qué significa «fugaz» en el título?", "Que duró poco", "Que fue enorme", "Que fue injusta"]),
  ],
};

const CARMELO = [
  [
    read("El caballero Carmelo: el regalo (adaptación)", "🐓", "El narrador recuerda su infancia en Pisco. Un día regresó su hermano Roberto, después de un largo viaje, montado en un caballo y cargado de regalos para todos. A su padre le entregó un gallo de pelea, joven, esbelto y de mirada altiva: el Carmelo. Los niños lo contemplaron admirados. Desde ese día, el Carmelo fue el orgullo de la casa y creció entre la familia como uno más.",
      ["¿Desde qué punto de vista se cuenta la historia?", "Un adulto recuerda en primera persona su niñez.", "Un narrador externo que no conoce a la familia.", "El gallo cuenta su vida."],
      ["¿Qué muestra la reacción de los niños?", "Que el gallo los cautivó desde el inicio", "Que temían al gallo y no querían tenerlo en casa", "Que preferían al caballo"],
      ["¿Qué anuncia la frase «creció entre la familia como uno más»?", "El afecto que hará dolorosa su suerte", "Que el gallo será vendido pronto a un vecino", "Que la familia se mudará"]),
    read("El caballero Carmelo: el desafío (adaptación)", "🐓", "Pasaron los años. El Carmelo, ya viejo, vivía retirado. Un día el padre aceptó una apuesta: el Carmelo pelearía el 28 de julio contra el Ajiseco, un gallo joven y famoso. Los niños recibieron la noticia en silencio; la madre lloró. Todos sabían que no era justo enfrentar a un gallo viejo con uno en plena fuerza. Durante días lo prepararon con esmero, como quien despide a un amigo.",
      ["¿Cuál es el conflicto de este pasaje?", "El cariño de la familia frente a la palabra empeñada del padre", "La pelea entre los niños por quedarse con el gallo", "La falta de dinero"],
      ["¿Por qué la pelea se considera injusta?", "Porque el Carmelo es viejo y su rival, joven", "Porque el Ajiseco está enfermo y no puede pelear", "Porque es de noche"],
      ["¿Qué sugiere la comparación «como quien despide a un amigo»?", "Que presienten un final triste", "Que están felices por la fiesta", "Que el gallo ya había ganado la apuesta"]),
  ],
  [
    read("El caballero Carmelo: la pelea (adaptación)", "🐓", "El día de la fiesta, la gente rodeó la cancha. El Ajiseco atacó con furia y pronto hirió al Carmelo, que cayó. El público dio por terminada la pelea. Entonces el viejo gallo se incorporó, reunió sus últimas fuerzas y lanzó un golpe certero. El Ajiseco enterró el pico: había perdido. El Carmelo venció, pero quedó malherido, y los niños lo llevaron a casa en brazos.",
      ["¿Cuál es el clímax del relato?", "El Carmelo se levanta y da el golpe final.", "La gente rodea la cancha.", "Los niños se llevan al gallo a casa en brazos."],
      ["¿Qué rasgo del Carmelo destaca el pasaje?", "Su coraje hasta el final", "Su juventud y rapidez", "Su miedo ante un rival más fuerte y más joven"],
      ["¿Por qué la victoria tiene un sabor amargo?", "Porque el Carmelo queda gravemente herido", "Porque el padre pierde la apuesta", "Porque nadie lo vio"]),
    read("El caballero Carmelo: la despedida (adaptación)", "🐓", "Durante dos días la familia cuidó al Carmelo. Al atardecer del segundo, el gallo se puso de pie, sacudió las alas, intentó cantar por última vez y cayó. Los niños lloraron. El narrador, ya adulto, lo recuerda como a un héroe: el último de una estirpe de gallos nobles que fueron el orgullo de todo el valle.",
      ["¿Qué tono predomina en el desenlace?", "Nostálgico y de homenaje", "Burlón", "Indiferente, como el de una noticia breve de periódico"],
      ["¿Qué simboliza el último intento de cantar?", "La dignidad del gallo hasta su muerte", "Que el gallo se estaba recuperando poco a poco", "Que tenía hambre"],
      ["¿Qué tema recorre todo el cuento?", "El valor y la lealtad, vistos desde el cariño de la infancia", "La riqueza que dan las apuestas", "La vida en la ciudad"]),
  ],
];

const YUNQUE = [
  [
    read("Paco Yunque: la llegada (adaptación)", "🏫", "Paco Yunque llega por primera vez al colegio de la mano de su madre, que trabaja como empleada en casa de los Grieve. Viene del campo y todo lo asusta: el ruido, los niños, el patio. Otro niño, Paco Fariña, se le acerca, lo anima y lo sienta a su lado. Paco Yunque casi no habla, pero no se separa de él.",
      ["¿Cómo se siente Paco Yunque al llegar?", "Asustado y fuera de lugar", "Seguro y con ganas de mandar", "Aburrido"],
      ["¿Qué papel cumple Paco Fariña?", "Lo acoge y lo protege.", "Se burla de él delante de todos los demás niños.", "Lo ignora."],
      ["¿Qué dato sobre la madre será importante en el relato?", "Que trabaja para la familia Grieve", "Que es profesora del colegio", "Que vive muy lejos"]),
    read("Paco Yunque: Humberto Grieve (adaptación)", "🏫", "Humberto Grieve, hijo del patrón, llega tarde y el profesor no lo castiga, aunque sí castiga a otro niño por lo mismo. Humberto quiere que Paco Yunque se siente con él: «Es mi muchacho», dice. Paco Fariña protesta. El profesor, incómodo, pide silencio, pero no corrige a Humberto.",
      ["¿Qué revela la frase «Es mi muchacho»?", "Que Humberto trata a Paco como una propiedad", "Que Humberto y Paco son grandes amigos desde pequeños", "Que son hermanos"],
      ["¿Qué muestra el trato distinto ante la tardanza?", "Que el profesor favorece al hijo del patrón", "Que el profesor es justo con todos", "Que la puntualidad no importa en ese colegio"],
      ["¿Qué tema empieza a perfilarse?", "La injusticia por diferencias sociales", "La amistad entre vecinos", "El amor a la lectura"]),
  ],
  [
    read("Paco Yunque: el recreo (adaptación)", "🏫", "En el recreo, Humberto obliga a Paco Yunque a agacharse para saltar sobre él y luego lo golpea. Paco Yunque llora y no se defiende: tiene miedo de que su madre pierda el trabajo. Paco Fariña se enfrenta a Humberto, y otros niños lo apoyan. Cuando vuelven al salón, Humberto le dice al profesor que él no hizo nada.",
      ["¿Por qué Paco Yunque no se defiende?", "Teme por el empleo de su madre.", "Cree que Humberto tiene razón en todo lo que dice.", "No le duele."],
      ["¿Qué contraste muestran Fariña y Yunque?", "Uno puede protestar; el otro siente que no puede.", "Los dos son igual de agresivos con Humberto.", "Ninguno habla."],
      ["¿Qué crítica hace el autor con esta escena?", "El abuso se sostiene en el poder económico.", "Los recreos son demasiado largos.", "Los niños no deberían jugar a saltar en el patio."]),
    read("Paco Yunque: el cuadro de honor (adaptación)", "🏫", "El profesor pide un ejercicio escrito sobre los peces. Paco Yunque lo hace con cuidado. Humberto no escribe nada, pero le quita la hoja a Paco, borra su nombre y pone el suyo. El director premia a Humberto e inscribe su nombre en el cuadro de honor. Paco Yunque agacha la cabeza y llora. Paco Fariña le dice bajito que no llore.",
      ["¿Qué injusticia cierra el cuento?", "Se premia a quien robó el trabajo ajeno.", "Paco Yunque no hizo la tarea de los peces.", "El director castiga a todos."],
      ["¿Por qué el autor termina sin castigar a Humberto?", "Para denunciar que la injusticia queda impune", "Porque se olvidó de escribir un final", "Para mostrar que Humberto merecía el premio"],
      ["¿Qué queda como única respuesta a la injusticia?", "La solidaridad de Paco Fariña", "El premio del director", "La risa de los niños"]),
  ],
];

const SELVA = [
  [
    read("La tortuga gigante: el encuentro (adaptación)", "🐢", "Un hombre de Buenos Aires, enfermo, se va a vivir al monte para curarse. Allí recupera la salud cazando. Un día encuentra a un tigre a punto de devorar a una tortuga enorme, ya herida. Mata al tigre. Tiene hambre y piensa en comerse la tortuga, pero le da lástima: la lleva a su ramada, le venda la cabeza y la cuida durante días hasta que sana.",
      ["¿Qué decisión del hombre pone en marcha la historia?", "Cuidar a la tortuga en vez de comérsela", "Mudarse a Buenos Aires para trabajar", "Cazar al tigre por su piel"],
      ["¿Qué rasgo del personaje revela esa decisión?", "Compasión", "Avaricia", "Miedo a quedarse solo en medio del monte"],
      ["¿Qué tipo de narrador cuenta el relato?", "Uno externo, en tercera persona", "La tortuga, en primera persona", "El tigre"]),
    read("La tortuga gigante: el viaje (adaptación)", "🐢", "Más tarde es el hombre quien enferma: una fiebre lo deja sin fuerzas. La tortuga le lleva agua y raíces. Como no mejora, lo carga sobre su caparazón, atado con enredaderas, y camina día y noche hacia Buenos Aires. Cruza ríos y pantanos, cada vez más débil. Cuando ya no puede más, un ratón de la ciudad le avisa que ha llegado. El hombre se cura, y la tortuga se queda a vivir en el zoológico, donde él la visita.",
      ["¿Qué estructura une las dos partes del cuento?", "Un favor recibido que luego se devuelve", "Dos historias que no tienen relación entre sí", "Un viaje de ida y vuelta al monte"],
      ["¿Qué enseñanza transmite?", "La gratitud se demuestra con hechos.", "Los animales no deben salir del monte.", "Las ciudades son peligrosas para quien viene de lejos."],
      ["¿Qué recurso usa el autor al hacer hablar a los animales?", "Personificación", "Hipérbole", "Onomatopeya"]),
  ],
  [
    read("Las medias de los flamencos: el baile (adaptación)", "🦩", "Las víboras dan un gran baile e invitan a todos los animales. Cada uno se adorna a su manera. Los flamencos, que entonces tenían las patas blancas, sienten envidia de las víboras de coral, con sus trajes de colores. Deciden conseguir medias coloradas, blancas y negras. Van de almacén en almacén y todos los echan por locos.",
      ["¿Qué sentimiento mueve a los flamencos?", "La envidia", "La gratitud", "El miedo"],
      ["¿Qué muestra la reacción de los almaceneros?", "Que el deseo de los flamencos es absurdo", "Que los flamencos tienen muchísimo dinero", "Que las medias estaban muy baratas ese día"],
      ["¿Qué tipo de relato es, según su inicio?", "Un cuento que explica un rasgo de un animal", "Una noticia sobre un baile ocurrido en la ciudad", "Una biografía"]),
    read("Las medias de los flamencos: el castigo (adaptación)", "🦩", "Una lechuza les entrega, como si fueran medias, cueros de víboras de coral, y les advierte que no dejen de bailar. Los flamencos triunfan en el baile, hasta que se cansan y las víboras descubren el engaño. Furiosas, les muerden las patas. El veneno no los mata, pero les quema: desde entonces tienen las patas rojas y pasan el día con ellas metidas en el agua.",
      ["¿Qué explica el cuento con este final?", "Por qué los flamencos tienen las patas rojas", "Por qué las lechuzas duermen de día", "Por qué las víboras de coral no saben bailar ni cantar"],
      ["¿Qué causa el castigo de los flamencos?", "Su vanidad y el engaño", "Su generosidad", "La mala suerte de haber llegado tarde al baile"],
      ["¿En qué se parece este cuento a una fábula?", "Los animales actúan como personas y hay una enseñanza.", "Está escrito en verso, con rima y con estrofas de cuatro líneas.", "Narra hechos históricos."]),
  ],
];

const TUBMAN = [
  [
    read("Harriet Tubman: nacer esclavizada", "⛓️", "Harriet Tubman nació hacia 1822 en Maryland, Estados Unidos, en una familia esclavizada. Desde los cinco años fue alquilada a otras casas para trabajar. Siendo adolescente, un capataz lanzó una pesa contra otro esclavo y la golpeó a ella en la cabeza. Sobrevivió, pero durante toda su vida sufrió desmayos repentinos. Aun así, creció fuerte, conocía los bosques y los ríos, y nunca aceptó que su destino fuera pertenecer a otro.",
      ["¿Qué consecuencia tuvo la herida en la cabeza?", "Desmayos repentinos toda la vida", "La pérdida total de la memoria", "Su liberación"],
      ["¿Qué rasgo de Harriet anuncia el final del texto?", "Su determinación de ser libre", "Su resignación ante la esclavitud", "Su deseo de convertirse en capataz"],
      ["¿Qué conocimientos le serían útiles más adelante?", "Los de bosques y ríos", "Los de cocina", "Los de lectura y escritura"]),
    read("Harriet Tubman: la huida", "🌌", "En 1849, al saber que iban a venderla, Harriet escapó. Caminó de noche unos 150 kilómetros, guiándose por la estrella polar y ayudada por personas que escondían a los fugitivos. Esa red secreta de casas y caminos se llamaba «Ferrocarril Subterráneo», aunque no tenía rieles ni trenes. Al cruzar a Pensilvania, un estado libre, dijo que se miró las manos para ver si seguía siendo la misma persona.",
      ["¿Qué era el «Ferrocarril Subterráneo»?", "Una red secreta de ayuda a los fugitivos", "Un tren que viajaba por túneles", "Una empresa de transporte de carga"],
      ["¿Por qué el nombre es una metáfora?", "Porque no era un tren real, sino rutas y refugios", "Porque los trenes eran muy lentos", "Porque estaba bajo el mar"],
      ["¿Qué expresa el gesto de mirarse las manos?", "El asombro de sentirse libre", "El dolor de una herida", "La preocupación por haber perdido sus guantes"]),
  ],
  [
    read("Harriet Tubman: «Moisés»", "🕯️", "Harriet pudo quedarse a salvo en el norte. En cambio, volvió al sur unas trece veces y guio hacia la libertad a cerca de setenta personas, entre ellas sus padres. Viajaba en invierno, cuando las noches son largas, y partía los sábados, porque los avisos de fuga no se publicaban hasta el lunes. La llamaban «Moisés». Solía decir que nunca descarriló su tren ni perdió a un pasajero.",
      ["¿Qué decisión muestra su valentía?", "Regresar al sur pudiendo quedarse a salvo", "Viajar solo durante el verano", "Publicar avisos de fuga en los periódicos"],
      ["¿Por qué partía los sábados?", "Para ganar tiempo antes de que se difundiera la fuga", "Porque era el día de mercado y había mucha gente en los caminos", "Porque no trabajaba"],
      ["¿Por qué la llamaban «Moisés»?", "Porque guiaba a su pueblo hacia la libertad", "Porque era muy anciana y todos la respetaban", "Porque cruzaba el mar"]),
    read("Harriet Tubman: guerra y legado", "🎖️", "Durante la guerra civil estadounidense, Harriet trabajó como enfermera, exploradora y espía del ejército del norte. En 1863 guio una incursión por el río Combahee que liberó a más de setecientas personas esclavizadas. Tras la guerra defendió el derecho de las mujeres a votar y abrió un hogar para ancianos pobres. Murió en 1913. Hoy se la recuerda como una de las grandes defensoras de la libertad.",
      ["¿Qué papel tuvo en la guerra civil?", "Enfermera, exploradora y espía", "Generala del ejército del sur", "Periodista"],
      ["¿Qué muestra la incursión de Combahee?", "Su capacidad para liderar una operación militar", "Su deseo de alejarse del conflicto", "Su trabajo como cocinera del ejército del norte"],
      ["¿Qué causas defendió después de la guerra?", "El voto femenino y el cuidado de los ancianos pobres", "La construcción de ferrocarriles en los estados del sur", "La venta de tierras"]),
  ],
];

const MALALA = [
  [
    read("Malala: una escuela en el valle", "🏔️", "Malala Yousafzai nació en 1997 en el valle de Swat, en Pakistán. Su padre dirigía una escuela y creía que las niñas tenían el mismo derecho a estudiar que los niños, algo poco común en la región. Malala creció entre libros y pizarras. Cuando tenía diez años, un grupo armado, los talibanes, tomó el control del valle y prohibió que las niñas fueran a la escuela.",
      ["¿Qué influencia tuvo su padre?", "Le transmitió el valor de la educación.", "Le prohibió ir a la escuela.", "La llevó a vivir a otro país cuando era muy pequeña."],
      ["¿Qué hecho cambia la vida de Malala?", "La prohibición de que las niñas estudien", "El cierre de la escuela por falta de alumnos", "Un terremoto"],
      ["¿Qué tiene de particular la postura del padre?", "Era poco común en su región.", "Era la opinión de todos.", "Era obligatoria por ley."]),
    read("Malala: la bloguera secreta", "✍️", "A los once años, Malala empezó a escribir un diario para la radio y televisión británica BBC. Contaba cómo era la vida bajo los talibanes: el miedo, las escuelas destruidas, las ganas de seguir aprendiendo. Firmaba con un seudónimo, Gul Makai, para protegerse. Con el tiempo empezó a dar entrevistas con su propio nombre. Sabía que era peligroso, pero pensaba que el silencio lo era más.",
      ["¿Por qué usaba un seudónimo?", "Para proteger su identidad", "Porque no le gustaba su nombre", "Porque la BBC lo exigía a todos sus periodistas"],
      ["¿Qué quería lograr con su diario?", "Dar a conocer lo que ocurría en su valle", "Ganar dinero", "Aprender inglés"],
      ["¿Qué significa «el silencio lo era más»?", "Que callar le parecía más grave que el riesgo", "Que prefería no hablar", "Que el valle era muy silencioso por las noches"]),
  ],
  [
    read("Malala: el ataque", "🚌", "El 9 de octubre de 2012, cuando Malala volvía de la escuela en un bus, un hombre armado subió, preguntó por ella y le disparó. Tenía quince años. Gravemente herida, fue trasladada a un hospital del Reino Unido, donde la operaron varias veces. Quienes quisieron callarla consiguieron lo contrario: su historia dio la vuelta al mundo y millones de personas reclamaron el derecho de las niñas a estudiar.",
      ["¿Qué buscaban quienes la atacaron?", "Silenciarla", "Robarle", "Llevarla a un hospital del Reino Unido"],
      ["¿Qué ironía señala el texto?", "El ataque hizo que su voz llegara más lejos.", "El bus no iba a la escuela, sino a un hospital del Reino Unido.", "Nadie se enteró del ataque."],
      ["¿Qué consecuencia mundial tuvo el hecho?", "Un reclamo masivo por la educación de las niñas", "El cierre de todas las escuelas de niñas del mundo", "Una guerra"]),
    read("Malala: una voz ante el mundo", "🕊️", "El día que cumplió dieciséis años, Malala habló ante las Naciones Unidas. Dijo que un niño, un maestro, un libro y un lápiz pueden cambiar el mundo. En 2014 recibió el Premio Nobel de la Paz: a los diecisiete años, fue la persona más joven en obtenerlo. Con su fundación apoya la educación de niñas en varios países. Suele repetir que no quiere ser recordada como la joven a la que dispararon, sino como la que luchó.",
      ["¿Qué idea central expresó ante las Naciones Unidas?", "La educación tiene el poder de transformar el mundo.", "Los lápices y los libros deben ser gratuitos en todos los países.", "Los maestros necesitan más vacaciones."],
      ["¿Qué récord estableció en 2014?", "Ser la persona más joven con un Nobel de la Paz", "Ser la primera mujer en la ONU", "Escribir el libro más largo sobre Pakistán"],
      ["¿Cómo quiere ser recordada?", "Por su lucha, no por haber sido víctima", "Por su fama", "Por el ataque que sufrió cuando tenía quince años"]),
  ],
];

const CHICAGO = [
  [
    read("El gran incendio de Chicago: una ciudad de madera", "🔥", "En 1871, Chicago era una ciudad en rápido crecimiento, construida casi por completo de madera: las casas, las veredas e incluso algunas calles. Ese verano apenas había llovido. La noche del 8 de octubre se inició un fuego en un establo de la calle DeKoven. Los bomberos, agotados por otro incendio del día anterior, fueron enviados por error a una dirección equivocada.",
      ["¿Qué condiciones favorecían un gran incendio?", "Construcciones de madera y sequía", "Edificios de piedra y lluvias constantes", "Calles muy anchas"],
      ["¿Qué error agravó la situación al comienzo?", "Enviar a los bomberos al lugar equivocado", "No tener bomberos", "Apagar el fuego con demasiada agua del lago"],
      ["¿Por qué el autor menciona el incendio del día anterior?", "Para explicar el cansancio de los bomberos", "Para comparar los daños de los dos incendios", "Para cambiar de tema"]),
    read("El gran incendio de Chicago: la vaca que no fue", "🐄", "Durante más de un siglo se contó que el fuego empezó porque la vaca de la señora O'Leary pateó una lámpara. La historia apareció en un periódico y todos la repitieron. Años después, el periodista admitió que la había inventado para hacer más llamativa su nota. La señora O'Leary, inmigrante y pobre, cargó con la culpa el resto de su vida. Hasta hoy no se sabe con certeza cómo se inició el incendio.",
      ["¿Qué se sabe hoy sobre la historia de la vaca?", "Que fue un invento de un periodista", "Que está comprobada por testigos", "Que la contó la propia señora O'Leary a sus vecinos"],
      ["¿Qué muestra este caso sobre la información?", "Un dato falso puede repetirse hasta parecer cierto.", "Los periódicos de aquella época siempre decían la verdad.", "Las vacas son peligrosas."],
      ["¿Por qué fue fácil culpar a la señora O'Leary?", "Era inmigrante y pobre, con poca voz para defenderse.", "Había confesado ante un juez y ante todos los periodistas.", "Era bombera."]),
  ],
  [
    read("El gran incendio de Chicago: treinta horas", "🌬️", "Un viento fuerte empujó las llamas hacia el centro. El fuego saltó el río, que estaba cubierto de grasa y barcos de madera. Las chispas volaban de techo en techo. La gente huyó hacia el lago Míchigan y pasó la noche con el agua hasta la cintura. El incendio duró cerca de treinta horas y solo se apagó cuando empezó a llover. Murieron unas trescientas personas y cien mil quedaron sin hogar.",
      ["¿Qué factor natural extendió el fuego?", "El viento", "La lluvia", "El frío"],
      ["¿Por qué el río no detuvo las llamas?", "Estaba lleno de grasa y de barcos de madera.", "Estaba congelado.", "Era demasiado ancho para que el fuego lo cruzara."],
      ["¿Qué puso fin al incendio?", "La lluvia", "Los bomberos de otra ciudad", "El viento"]),
    read("El gran incendio de Chicago: renacer", "🏙️", "Del desastre surgió una ciudad distinta. Se prohibió construir con madera en el centro y se exigieron ladrillo, piedra y hierro. Arquitectos de todo el país llegaron a reconstruirla, y allí se levantó, años después, el primer rascacielos del mundo. También se reorganizó el cuerpo de bomberos. Para muchos historiadores, la Chicago moderna nació de sus cenizas.",
      ["¿Qué cambio en las normas produjo el incendio?", "Se exigieron materiales resistentes al fuego.", "Se prohibieron los edificios altos.", "Se cerró el cuerpo de bomberos."],
      ["¿Qué innovación surgió en la reconstrucción?", "El rascacielos", "El tranvía", "El ferrocarril subterráneo"],
      ["¿Qué significa «nació de sus cenizas»?", "Que la tragedia dio origen a algo nuevo", "Que la ciudad quedó abandonada", "Que el fuego continuó ardiendo durante varios años"]),
  ],
];

export const ROWS: Row[] = [
  ["informativos-1", (r) => readPassage(r, INFO.animals, false)],
  ["informativos-2", (r) => readPassage(r, INFO.places, false)],
  ["informativos-3", (r) => readPassage(r, INFO.business, false)],
  ["informativos-4", (r) => readPassage(r, INFO.science, false)],
  ["informativos-5", (r) => readPassage(r, INFO.history, false)],

  ["caballero-carmelo-1", (r) => readPassage(r, CARMELO[0], false)],
  ["caballero-carmelo-2", (r) => readPassage(r, CARMELO[1], false)],
  ["paco-yunque-1", (r) => readPassage(r, YUNQUE[0], false)],
  ["paco-yunque-2", (r) => readPassage(r, YUNQUE[1], false)],
  ["cuentos-selva-1", (r) => readPassage(r, SELVA[0], false)],
  ["cuentos-selva-2", (r) => readPassage(r, SELVA[1], false)],

  ["tubman-1", (r) => readPassage(r, TUBMAN[0], false)],
  ["tubman-2", (r) => readPassage(r, TUBMAN[1], false)],
  ["malala-1", (r) => readPassage(r, MALALA[0], false)],
  ["malala-2", (r) => readPassage(r, MALALA[1], false)],
  ["chicago-1", (r) => readPassage(r, CHICAGO[0], false)],
  ["chicago-2", (r) => readPassage(r, CHICAGO[1], false)],
];
