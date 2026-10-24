import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 1.° de Secundaria · banco de lecturas largas: textos informativos propios y
// el estudio de tres obras peruanas de dominio público: «Tradiciones
// peruanas» (Ricardo Palma), «Aves sin nido» (Clorinda Matto de Turner) y el
// drama quechua «Ollantay». Los pasajes son resúmenes adaptados, no citas
// textuales. En no ficción, los «Comentarios reales» del Inca Garcilaso de la
// Vega y el terremoto de 1970 que sepultó Yungay, con textos propios.


const INFO = {
  animals: [
    read("El cóndor andino", "🦅", "Con más de tres metros de envergadura, el cóndor andino es una de las aves voladoras más grandes del mundo. Pese a su tamaño, casi no aletea: aprovecha las corrientes de aire caliente que suben por las laderas y planea durante horas sin gastar energía. Se alimenta de animales muertos, por lo que cumple una función sanitaria en el ecosistema. Su reproducción es lenta: una pareja pone un solo huevo cada dos o tres años. Por eso, cada cóndor envenenado o cazado es una pérdida difícil de reponer.",
      ["¿Cómo logra el cóndor volar tanto tiempo sin cansarse?", "Aprovechando las corrientes de aire caliente", "Aleteando sin parar durante todo el recorrido", "Comiendo mucho"],
      ["¿Por qué se dice que cumple una función sanitaria?", "Porque elimina animales muertos del ambiente", "Porque cura a otros animales enfermos de la puna", "Porque vive limpio"],
      ["¿Qué relación establece el autor entre la reproducción y la conservación?", "Al reproducirse lentamente, cada pérdida pesa mucho.", "Como pone muchos huevos, no corre ningún peligro de extinción.", "No hay relación."]),
    read("El delfín rosado", "🐬", "En los ríos de la Amazonía peruana vive el bufeo colorado o delfín rosado. A diferencia de los delfines marinos, sus vértebras del cuello no están fusionadas, de modo que puede girar la cabeza para moverse entre las raíces de los bosques inundados. Su color rosado se intensifica con la edad y con la actividad. Muchas comunidades lo respetan por leyendas que lo describen como un ser que se transforma en hombre. Sin embargo, la contaminación con mercurio y las redes de pesca amenazan su supervivencia.",
      ["¿Qué rasgo físico le permite moverse en el bosque inundado?", "Su cuello flexible", "Su color rosado intenso", "Sus aletas pequeñas y su cola larga y delgada"],
      ["¿Qué papel cumplen las leyendas, según el texto?", "Hacen que muchas comunidades lo respeten.", "Explican científicamente por qué es de color rosado.", "Lo vuelven peligroso."],
      ["¿Qué amenazas se mencionan?", "El mercurio y las redes de pesca", "Las raíces de los árboles", "La edad avanzada y la actividad física de los delfines"]),
  ],
  places: [
    read("Kuélap", "🏰", "En lo alto de una montaña de Amazonas, a 3000 metros de altitud, se alza Kuélap, la gran fortaleza de los chachapoyas. Sus murallas de piedra alcanzan casi veinte metros de altura y encierran más de cuatrocientas construcciones circulares, decoradas con frisos en forma de rombos y zigzags. Durante siglos, el difícil acceso la mantuvo casi desconocida. Desde 2017, un teleférico redujo a minutos un viaje que antes tomaba horas, lo que trajo turistas, pero también la preocupación por conservar sus muros.",
      ["¿Qué caracteriza las construcciones de Kuélap?", "Son circulares y tienen frisos geométricos.", "Son cuadradas y están hechas de adobe pintado.", "Son de madera."],
      ["¿Por qué Kuélap fue poco conocida durante mucho tiempo?", "Por lo difícil que era llegar", "Porque estaba enterrada bajo la arena del desierto", "Porque era pequeña"],
      ["¿Qué doble efecto tuvo el teleférico?", "Atrajo visitantes y generó preocupación por la conservación.", "Alejó a los turistas y protegió por completo las murallas.", "Ninguno."]),
    read("Los uros del Titicaca", "🛶", "En el lago Titicaca, cerca de Puno, viven los uros, sobre islas que ellos mismos fabrican. Las construyen con capas de totora, una planta acuática que crece en el lago. Como la totora de abajo se pudre con el agua, deben añadir capas nuevas cada pocas semanas. Con la misma planta hacen casas, balsas y artesanías, e incluso comen su tallo tierno. Hoy, el turismo es su principal ingreso, aunque algunos se preguntan si así se conserva su cultura o se convierte en espectáculo.",
      ["¿Por qué deben renovar constantemente sus islas?", "Porque la totora inferior se pudre en el agua", "Porque el viento del lago se lleva la totora seca", "Porque se mudan"],
      ["¿Qué muestra la variedad de usos de la totora?", "Que es fundamental en su forma de vida", "Que es una planta que solo sirve para hacer balsas", "Que es cara"],
      ["¿Qué duda plantea el final del texto?", "Si el turismo preserva o transforma su cultura", "Si las islas son reales o artificiales", "Si la totora se puede comer cruda o cocida"]),
  ],
  business: [
    read("El café que viene de lejos", "☕", "Durante años, los caficultores de la selva central vendían sus granos a intermediarios a precios muy bajos. Muchos se organizaron en cooperativas: juntos podían comprar maquinaria, mejorar la calidad y vender directamente a compradores extranjeros. Algunas de esas cooperativas ganaron premios internacionales. Hoy, una taza de café peruano puede venderse en Europa a un precio diez veces mayor que hace dos décadas, y una parte de esa ganancia llega a las familias productoras.",
      ["¿Qué problema tenían los caficultores al principio?", "Vendían a intermediarios a precios bajos.", "No sabían cultivar café de buena calidad en la selva.", "No tenían tierra."],
      ["¿Qué ventaja les dio organizarse en cooperativas?", "Mejorar la calidad y vender directamente", "Dejar de cultivar café y dedicarse a otra actividad más rentable", "Pagar menos impuestos"],
      ["¿Qué estructura tiene principalmente el texto?", "Problema y solución", "Descripción de un lugar", "Comparación entre el café y el té"]),
    read("Pagar con el celular", "📲", "Hace unos años, para pagar un menú o un pasaje se necesitaba efectivo. Hoy, en muchos mercados del Perú, basta con escanear un código con el celular. Las billeteras digitales permiten enviar dinero al instante y sin comisión entre personas de distintos bancos. Para los pequeños negocios, esto significa vender más y manejar menos billetes. Pero también trae riesgos: estafas por mensajes falsos y personas mayores que se quedan fuera porque no usan teléfonos inteligentes.",
      ["¿Qué cambio describe el texto?", "El paso del efectivo a los pagos digitales", "La desaparición total de los bancos en el Perú", "La subida de los precios"],
      ["¿Qué beneficio tienen los pequeños negocios?", "Vender más y manejar menos efectivo", "No pagar nunca impuestos por sus ventas", "Cerrar más temprano"],
      ["¿Qué problema de inclusión menciona el autor?", "Que algunas personas mayores quedan excluidas", "Que los jóvenes prefieren el efectivo", "Que los códigos son difíciles de imprimir en papel"]),
  ],
  science: [
    read("El fenómeno El Niño", "🌊", "Normalmente, frente a la costa peruana corre una corriente de agua fría que trae nutrientes y alimenta a millones de peces. Cada cierto número de años, sin embargo, los vientos que empujan el agua cálida hacia Asia se debilitan, y esa agua regresa hacia Sudamérica. Es el fenómeno El Niño. El mar se calienta, la anchoveta se aleja y, en el norte, caen lluvias torrenciales sobre zonas desérticas. Los pescadores lo bautizaron así porque solía notarse cerca de la Navidad.",
      ["¿Qué ocurre durante El Niño?", "El agua cálida regresa y el mar frente a la costa se calienta.", "La corriente fría se intensifica y el mar se enfría mucho más.", "Nieva en la costa."],
      ["¿Por qué se aleja la anchoveta?", "Porque el mar se calienta y faltan nutrientes", "Porque las lluvias del norte la arrastran hacia el sur", "Porque la pescan"],
      ["¿De dónde viene el nombre «El Niño»?", "De que se notaba cerca de la Navidad", "De que afecta sobre todo a los niños pequeños de la costa", "De un científico"]),
    read("Los glaciares tropicales", "🏔️", "El Perú alberga cerca del 70 % de los glaciares tropicales del mundo. Estas masas de hielo funcionan como depósitos de agua: en temporada seca, cuando no llueve, su deshielo alimenta los ríos que abastecen a ciudades y cultivos. Desde 1970, sin embargo, han perdido más de la mitad de su superficie por el aumento de la temperatura. Al principio, el deshielo acelerado aumenta el caudal de los ríos; a largo plazo, cuando el glaciar desaparece, el agua de la temporada seca se acaba.",
      ["¿Por qué los glaciares son importantes en la temporada seca?", "Porque su deshielo alimenta los ríos", "Porque atraen lluvias abundantes hacia la costa", "Porque son bonitos"],
      ["¿Qué paradoja explica el texto?", "El deshielo primero aumenta el agua y luego la reduce.", "El calor hace crecer los glaciares cada año un poco más.", "No hay paradoja."],
      ["¿Qué dato muestra la gravedad del problema?", "Han perdido más de la mitad de su superficie desde 1970.", "El Perú tiene muchos glaciares.", "Los glaciares están en las partes más altas de la cordillera"]),
  ],
  history: [
    read("Chan Chan", "🧱", "Cerca de Trujillo se extienden las ruinas de Chan Chan, la mayor ciudad de barro de América precolombina. Fue la capital del reino chimú, que dominó la costa norte entre los siglos IX y XV. Sus muros de adobe están decorados con relieves de peces, aves y olas, señal de la importancia del mar para este pueblo. Hacia 1470, los incas conquistaron el reino y llevaron al Cusco a muchos de sus orfebres. Hoy, las lluvias de El Niño son la mayor amenaza para sus frágiles muros.",
      ["¿Qué revelan los relieves de peces y olas?", "La importancia del mar para los chimú", "Que los chimú vivían en las alturas de los Andes", "Que eran pescadores pobres"],
      ["¿Qué ocurrió hacia 1470?", "Los incas conquistaron el reino chimú.", "Los chimú conquistaron el Cusco y a los incas.", "Se fundó Trujillo."],
      ["¿Por qué las lluvias son una amenaza?", "Porque los muros son de barro", "Porque inundan los caminos que llevan a Trujillo", "Porque espantan a los turistas"]),
    read("La rebelión de Túpac Amaru II", "⚔️", "En 1780, José Gabriel Condorcanqui, un curaca de Tinta que tomó el nombre de Túpac Amaru II, encabezó la mayor rebelión contra el dominio español en el siglo XVIII. Protestaba contra los abusos de los corregidores y contra la mita, el trabajo forzado en las minas. Junto a él luchó su esposa, Micaela Bastidas, que organizó el abastecimiento y la estrategia. La rebelión fue derrotada y ambos fueron ejecutados en 1781 en la plaza del Cusco. Aun así, su lucha se convirtió en un símbolo de la independencia.",
      ["¿Contra qué protestaba Túpac Amaru II?", "Contra los abusos de los corregidores y la mita", "Contra los incas que gobernaban el Cusco en esa época", "Contra los curacas"],
      ["¿Qué papel cumplió Micaela Bastidas?", "Organizó el abastecimiento y la estrategia.", "Se opuso a la rebelión y avisó a las autoridades españolas.", "Fue una espectadora."],
      ["¿Por qué el autor dice «aun así»?", "Porque, pese a la derrota, la rebelión dejó un legado.", "Porque la rebelión triunfó y expulsó a los españoles en 1781.", "Para cambiar de tema."]),
  ],
};

// --- Obras narrativas -----------------------------------------------------

const PALMA = [
  [
    read("«El alacrán de fray Gómez» (adaptación)", "🦂", "En la Lima colonial vivía fray Gómez, un fraile humilde famoso por sus milagros. Un día llegó a su celda Jeromo, un buhonero pobre que necesitaba quinientos duros para salvar su negocio. El fraile no tenía dinero. Miró a su alrededor, vio un alacrán que caminaba por la pared, lo envolvió en un papel y se lo entregó. Al abrirlo, Jeromo encontró una joya de esmeraldas y oro con forma de alacrán. La empeñó, prosperó y, seis meses después, devolvió la joya. Fray Gómez la puso en la pared y le dijo: «Animalito de Dios, sigue tu camino». Y el alacrán echó a andar.",
      ["¿Qué rasgo de fray Gómez destaca la historia?", "Su generosidad y su humildad", "Su riqueza, que escondía en la celda", "Su mal carácter"],
      ["¿Qué hace Jeromo para demostrar su honradez?", "Devuelve la joya en el plazo prometido.", "Vende la joya y se queda con todo el dinero ganado.", "Se va de Lima."],
      ["¿Qué elemento hace de este relato una tradición y no una crónica histórica?", "Mezcla hechos de la Lima colonial con lo maravilloso.", "Solo presenta datos comprobados con documentos de archivo.", "Es muy corto."]),
    read("«La camisa de Margarita» (adaptación)", "👔", "Margarita Pareja era la hija mimada de don Raimundo, un rico comerciante de Lima. Se enamoró de Luis Alcázar, un joven pobre cuyo tío, don Honorato, era rico y orgulloso. Cuando Luis pidió su mano, don Raimundo se negó por la pobreza del pretendiente. Margarita enfermó de tristeza. Entonces el padre aceptó, pero don Honorato puso una condición: el suegro no debía darle a la novia ni un centavo, ni siquiera una camisa más que la de la boda. Don Raimundo juró cumplir. Y cumplió: le regaló solo la camisa de novia… bordada con encajes y diamantes que valían una fortuna.",
      ["¿Por qué don Raimundo rechaza al principio a Luis?", "Porque era pobre", "Porque no quería que su hija se casara nunca", "Porque era su sobrino"],
      ["¿Cómo cumple don Raimundo su juramento sin renunciar a ayudar a su hija?", "Le regala una sola camisa, pero valiosísima.", "Rompe su juramento y le da a su hija todo su dinero.", "No va a la boda."],
      ["¿Qué tono predomina en la tradición?", "Humorístico e ingenioso", "Trágico y lleno de tristeza de principio a fin", "Neutro"]),
  ],
  [
    read("«Los ratones de fray Martín» (adaptación)", "🐭", "Fray Martín de Porres, hijo de un caballero español y de una mujer liberta, trabajaba en el convento de Santo Domingo cuidando enfermos y repartiendo comida. Cuenta la tradición que los ratones invadían la ropería del convento y roían los hábitos. Los frailes querían envenenarlos. Fray Martín atrapó a uno y le habló: que reuniera a los suyos y se mudaran a la huerta, donde él les llevaría comida todos los días. Los ratones obedecieron. Desde entonces, dicen, en su celda comían del mismo plato un perro, un gato y un ratón, sin pelearse.",
      ["¿Qué problema enfrentaba el convento?", "Los ratones roían los hábitos de la ropería.", "Los frailes no tenían comida para los enfermos del hospital.", "Faltaban frailes."],
      ["¿Qué solución propone fray Martín?", "Llevar a los ratones a la huerta y alimentarlos", "Envenenar a todos los ratones con la ayuda del gato", "Vender los hábitos"],
      ["¿Qué simboliza el perro, el gato y el ratón comiendo juntos?", "La paz y la convivencia entre enemigos naturales", "El hambre que pasaban los animales del convento", "La riqueza del convento"]),
    read("Ricardo Palma y sus tradiciones", "🖋️", "Ricardo Palma (1833-1919) creó un género propio: la tradición. En ella combinó un hecho o un personaje del pasado peruano —casi siempre de la Colonia— con anécdotas, rumores y su propia imaginación. Escribía con humor y picardía, usaba refranes populares y se dirigía al lector como si conversara con él. Además de escritor, fue director de la Biblioteca Nacional después de la guerra con Chile, cuando la institución había sido saqueada; pidió libros a amigos e instituciones con tanta insistencia que lo llamaron «el bibliotecario mendigo».",
      ["¿Qué es una tradición, según el texto?", "Un relato que mezcla historia, anécdota e imaginación", "Una biografía rigurosa basada solo en documentos oficiales", "Una poesía"],
      ["¿Qué rasgos tiene el estilo de Palma?", "Humor, refranes y un trato cercano con el lector", "Seriedad, palabras técnicas y frases muy largas y difíciles", "Tristeza"],
      ["¿Por qué lo llamaron «el bibliotecario mendigo»?", "Porque pidió libros con insistencia para reconstruir la Biblioteca", "Porque era muy pobre y vivía en la Biblioteca Nacional", "Porque vendía libros"]),
  ],
];

const AVES = [
  [
    read("«Aves sin nido»: llegada a Kíllac (adaptación)", "🏘️", "Lucía Marín y su esposo, Fernando, llegan desde la ciudad al pueblo andino de Kíllac. Allí, Lucía conoce a Marcela, esposa del campesino Juan Yupanqui, que le pide ayuda desesperada: el cobrador le ha dejado lana por adelantado y exige que su familia la devuelva convertida en tejidos a un precio injusto, y el cura reclama pagos que no pueden cubrir. Lucía, conmovida, decide pagar la deuda. Ese gesto, que para ella es solo justicia, despierta la furia de los notables del pueblo.",
      ["¿Qué problema le cuenta Marcela a Lucía?", "Su familia sufre cobros abusivos que no puede pagar.", "Su esposo quiere mudarse a la ciudad y dejarla sola.", "Su casa se incendió."],
      ["¿Por qué reaccionan con furia los notables del pueblo?", "Porque la ayuda de Lucía amenaza el sistema de abusos que los beneficia", "Porque Lucía se niega a pagar sus propias deudas con los comerciantes y las autoridades del pueblo", "Porque Lucía es pobre"],
      ["¿Qué denuncia la novela desde estas primeras escenas?", "La explotación de los campesinos indígenas", "La falta de lana en los Andes", "Lo aburrida que es la vida en el campo"]),
    read("«Aves sin nido»: los notables (adaptación)", "⛪", "En Kíllac, el poder lo comparten el cura, el gobernador y otros vecinos acomodados. Se reúnen en secreto y ven a los Marín como intrusos que «alborotan a los indios». Para la autora, Clorinda Matto de Turner, el problema no está en los individuos, sino en un sistema donde la autoridad religiosa y la civil se protegen mutuamente. Por denunciar esto en 1889, la novela causó escándalo: la autora fue excomulgada y, años después, su casa y su imprenta en Lima fueron saqueadas.",
      ["¿Cómo ven los notables a los Marín?", "Como intrusos que alteran el orden", "Como amigos que traen progreso, escuelas y caminos nuevos al pueblo", "Como autoridades"],
      ["¿Qué critica la autora, según el texto?", "Un sistema donde las autoridades se protegen entre sí", "La forma de vestir de los habitantes del pueblo", "El clima"],
      ["¿Qué muestra la reacción ante la novela?", "Que su denuncia fue considerada muy peligrosa", "Que fue recibida con indiferencia por todos los lectores de su época", "Que era una novela de humor"]),
  ],
  [
    read("«Aves sin nido»: el ataque (adaptación)", "🔥", "Una noche, los notables organizan un ataque contra la casa de los Marín. En la confusión, Juan Yupanqui y Marcela, que acudieron a defenderlos, resultan heridos de muerte. Antes de morir, Marcela le confía a Lucía un secreto y le entrega a sus dos hijas, Margarita y Rosalía. Los Marín las adoptan como propias. La muerte de los Yupanqui muestra que, en Kíllac, quien se pone del lado de los débiles paga un precio muy alto.",
      ["¿Qué les sucede a Juan y a Marcela?", "Mueren al defender a los Marín.", "Huyen del pueblo y se van a vivir a Lima con sus hijas.", "Se vuelven notables."],
      ["¿Qué compromiso asume Lucía?", "Criar a las hijas de los Yupanqui", "Vengar la muerte de los Yupanqui atacando al gobernador", "Irse sola"],
      ["¿Qué idea transmite este episodio?", "Defender a los oprimidos tiene un alto costo en ese sistema.", "Los ataques nocturnos son frecuentes en todas las ciudades del mundo.", "La noche es peligrosa."]),
    read("«Aves sin nido»: el desenlace (adaptación)", "🕊️", "Ya en Lima, Margarita y Manuel, un joven estudioso hijo de la esposa del gobernador, se enamoran y planean casarse. Pero el secreto que Marcela confió a Lucía sale a la luz: Margarita y Manuel son hijos del mismo padre, un antiguo cura de Kíllac que abusó de su poder. No pueden casarse. El título de la novela cobra entonces su sentido: Margarita y Manuel son «aves sin nido», hijos de un sistema que les negó un hogar y un origen limpio.",
      ["¿Por qué no pueden casarse Margarita y Manuel?", "Porque descubren que tienen el mismo padre", "Porque los Marín se oponen a que Manuel sea pobre", "Porque viven lejos"],
      ["¿Qué significado tiene el título?", "Alude a personajes sin hogar ni origen seguro.", "Describe las aves que vivían en los techos de Kíllac.", "Habla de una mudanza."],
      ["¿A quién responsabiliza la novela de esa tragedia?", "Al abuso de poder de una autoridad religiosa", "A los propios jóvenes por enamorarse sin permiso de sus familias", "A nadie"]),
  ],
];

const OLLANTAY = [
  [
    read("«Ollantay»: el amor prohibido (adaptación)", "💛", "Ollantay es el general más valiente del inca Pachacútec. Está enamorado de Cusi Coyllur, hija del Inca, y ella le corresponde. El sacerdote Huillca Uma le advierte que ese amor es imposible: Ollantay no es de sangre real. Aun así, Ollantay se presenta ante Pachacútec, le recuerda sus victorias y le pide la mano de su hija. El Inca, ofendido, lo expulsa de su presencia. Cusi Coyllur es encerrada en el Acllahuasi, la casa de las escogidas.",
      ["¿Por qué el amor de Ollantay es «imposible»?", "Porque no pertenece a la nobleza real", "Porque Cusi Coyllur no lo quiere y ama a otro", "Porque es muy joven"],
      ["¿Qué argumento usa Ollantay ante el Inca?", "Sus servicios y victorias como general", "Su enorme riqueza en oro y en tierras", "Su belleza"],
      ["¿Qué consecuencia tiene la negativa del Inca para Cusi Coyllur?", "Es encerrada en el Acllahuasi.", "Se casa con otro general del ejército de Pachacútec.", "Se va con Ollantay."]),
    read("«Ollantay»: la rebelión (adaptación)", "🏯", "Humillado, Ollantay se refugia en la fortaleza de Ollantaytambo y se rebela contra el Inca. Durante diez años resiste a los ejércitos imperiales. Lo acompaña Piqui Chaqui, su criado, que con sus bromas y su miedo aporta los momentos cómicos de la obra. Mientras tanto, en el Acllahuasi, Cusi Coyllur da a luz a una niña, Ima Súmac, que crece sin saber quién es su madre.",
      ["¿Dónde se refugia Ollantay?", "En la fortaleza de Ollantaytambo", "En el Acllahuasi, junto a Cusi Coyllur", "En el lago"],
      ["¿Qué función cumple Piqui Chaqui en la obra?", "Aporta humor a una historia seria.", "Es el villano principal que traiciona a Ollantay.", "Es el Inca."],
      ["¿Qué hecho prepara un futuro reencuentro?", "El nacimiento de Ima Súmac", "La muerte de Piqui Chaqui en la fortaleza", "La lluvia"]),
  ],
  [
    read("«Ollantay»: la trampa de Rumiñahui (adaptación)", "🪤", "Muere Pachacútec y lo sucede su hijo Túpac Yupanqui. El general Rumiñahui idea una trampa: se presenta herido ante Ollantay, dice que el nuevo Inca lo ha maltratado y pide unirse a los rebeldes. Ollantay le cree. Durante una fiesta, cuando los rebeldes están desprevenidos, Rumiñahui abre las puertas de la fortaleza al ejército imperial. Ollantay es capturado y llevado al Cusco.",
      ["¿Qué estrategia usa Rumiñahui?", "Finge ser un traidor para engañar a Ollantay.", "Ataca la fortaleza de frente con todo su ejército.", "Le pide perdón al Inca."],
      ["¿Por qué funciona la trampa?", "Porque Ollantay confía en él y los rebeldes están desprevenidos", "Porque la fortaleza estaba vacía desde hacía años", "Porque llovía"],
      ["¿Qué cambio en el poder ocurre al inicio del pasaje?", "Túpac Yupanqui sucede a Pachacútec.", "Ollantay se convierte en el nuevo Inca del Tahuantinsuyo.", "Rumiñahui muere."]),
    read("«Ollantay»: el perdón (adaptación)", "🤝", "Ollantay espera la muerte ante Túpac Yupanqui. Pero el nuevo Inca, en lugar de castigarlo, lo perdona y lo nombra su lugarteniente. En ese momento llega Ima Súmac, que ha descubierto a su madre encadenada en una cueva del Acllahuasi, y suplica justicia. El Inca libera a Cusi Coyllur y le permite casarse con Ollantay. La obra termina con la familia reunida, y con la clemencia del soberano presentada como una virtud mayor que la venganza.",
      ["¿Qué decisión sorprendente toma Túpac Yupanqui?", "Perdona a Ollantay y le da un alto cargo.", "Condena a muerte a Ollantay y a Cusi Coyllur.", "Abandona el trono."],
      ["¿Qué papel cumple Ima Súmac en el desenlace?", "Revela el encierro de su madre y pide justicia.", "Convence al Inca de que castigue a Ollantay por traidor.", "Se casa."],
      ["¿Qué valor exalta el final de la obra?", "La clemencia por encima de la venganza", "La obediencia ciega a las reglas", "La riqueza de la familia real y su poder sobre el pueblo"]),
  ],
];

// --- Obras de no ficción --------------------------------------------------

const GARCILASO = [
  [
    read("El Inca Garcilaso", "📜", "Gómez Suárez de Figueroa nació en el Cusco en 1539. Era hijo de un capitán español, Sebastián Garcilaso de la Vega, y de una princesa inca, Isabel Chimpu Ocllo. Creció escuchando a sus parientes maternos relatar la historia de los incas. A los veintiún años viajó a España, donde adoptó el nombre de Inca Garcilaso de la Vega y nunca regresó. Allí, ya mayor, escribió los «Comentarios reales» (1609), para contar la historia de los incas «como la contaban los propios indios», corrigiendo a los cronistas españoles que, según él, no entendían el quechua.",
      ["¿Por qué el autor se llamó a sí mismo «Inca»?", "Para afirmar su herencia materna inca", "Porque fue nombrado emperador de los incas en España", "Porque era un apodo de sus compañeros"],
      ["¿Qué ventaja creía tener sobre los cronistas españoles?", "Conocía el quechua y las versiones de su familia.", "Había leído más libros que todos ellos en las bibliotecas de España.", "Era más viejo."],
      ["¿Qué tipo de texto son los «Comentarios reales»?", "Una obra histórica de no ficción", "Una novela de aventuras inventada por completo", "Un poema"]),
    read("El origen de los incas según los «Comentarios»", "☀️", "Garcilaso cuenta que, siendo niño, preguntó a su tío inca por el origen de su pueblo. El anciano le relató que el Sol, compadecido de los hombres que vivían como fieras, envió a sus hijos Manco Cápac y Mama Ocllo al lago Titicaca. Les dio una vara de oro y les ordenó fundar su ciudad donde esta se hundiera en la tierra. Así ocurrió en el valle del Cusco. Manco Cápac enseñó a los hombres a cultivar, y Mama Ocllo enseñó a las mujeres a hilar y tejer.",
      ["¿Quién le contó a Garcilaso esta historia?", "Su tío materno, un anciano inca", "Un cronista español que había estudiado el quechua", "Su padre"],
      ["¿Qué señal indicaba dónde fundar la ciudad?", "El lugar donde se hundiera la vara de oro", "El lugar donde apareciera el Sol al amanecer", "Un río"],
      ["¿Qué imagen de los incas transmite el relato?", "Una civilización que trae orden y conocimiento", "Un pueblo guerrero que solo buscaba conquistar a otros", "Un pueblo pobre"]),
  ],
  [
    read("El nombre del Perú", "🗺️", "En los «Comentarios reales», Garcilaso explica de dónde viene el nombre «Perú». Según él, unos navegantes españoles encontraron a un indio pescando en la desembocadura de un río y le preguntaron, por señas, cómo se llamaba esa tierra. El hombre, que no entendía su lengua, respondió con su propio nombre, Berú, y con la palabra «pelú», que significaba «río». Los españoles juntaron ambas palabras y llamaron Perú a toda la región. Garcilaso usa la anécdota para mostrar cuántos malentendidos nacieron de no conocer la lengua de los otros.",
      ["¿Cómo surgió el nombre «Perú», según Garcilaso?", "De un malentendido entre españoles y un pescador", "De una palabra quechua que significa «tierra de oro»", "De un rey inca"],
      ["¿Qué quiere demostrar Garcilaso con esta anécdota?", "Los errores que causó no conocer la lengua ajena", "Que los pescadores indígenas no querían hablar con nadie", "Que el río era grande"],
      ["¿Qué tipo de evidencia usa aquí el autor?", "Una anécdota explicativa", "Un cuadro estadístico", "Una encuesta a los pescadores de toda la costa norte"]),
    read("Quipus y chasquis", "🪢", "Garcilaso describe con admiración cómo se gobernaba un imperio sin escritura alfabética. Los quipus eran cordones de lana con nudos de distintos colores y posiciones; con ellos los quipucamayoc registraban tributos, población y cosechas. Los chasquis, por su parte, eran corredores que se relevaban en postas a lo largo del Cápac Ñan y llevaban mensajes de un extremo a otro del imperio en pocos días. Para Garcilaso, estos sistemas prueban que los incas tenían una organización tan eficaz como la de los reinos europeos.",
      ["¿Para qué servían los quipus?", "Para registrar datos como tributos y población", "Para tejer la ropa de los incas y de sus familias", "Para pescar"],
      ["¿Cómo lograban los chasquis llevar mensajes tan rápido?", "Relevándose en postas a lo largo del camino", "Viajando a caballo por caminos pavimentados", "Usando barcos"],
      ["¿Qué intención tiene Garcilaso al describir estos sistemas?", "Mostrar que la organización inca era admirable", "Criticar a los incas por no tener escritura alfabética", "Enseñar a hacer nudos"]),
  ],
];

const YUNGAY = [
  [
    read("31 de mayo de 1970", "🌎", "El domingo 31 de mayo de 1970, a las 3:23 de la tarde, un terremoto de magnitud 7,9 sacudió el departamento de Áncash. Muchas familias estaban en casa viendo la inauguración del Mundial de México. En pocos segundos, miles de viviendas de adobe se desplomaron. Pero lo peor estaba por venir: el sismo desprendió una enorme masa de hielo y roca del pico norte del Huascarán, que bajó por la quebrada a más de 200 kilómetros por hora.",
      ["¿Qué detalle muestra que el sismo tomó a todos por sorpresa?", "Muchas familias estaban viendo la inauguración del Mundial.", "El sismo ocurrió a las tres de la tarde de un domingo.", "Era mayo."],
      ["¿Por qué tantas casas se desplomaron?", "Porque eran de adobe y no resistieron el sismo", "Porque el alud del Huascarán las alcanzó primero", "Porque eran nuevas"],
      ["¿Qué anuncia la frase «Pero lo peor estaba por venir»?", "Que vendría una tragedia aún mayor", "Que el terremoto se repetiría al día siguiente", "Que llovería"]),
    read("La ciudad sepultada", "🪦", "El alud del Huascarán tardó unos tres minutos en llegar a Yungay. Cubrió la ciudad casi por completo con lodo, hielo y rocas. De sus miles de habitantes, sobrevivieron apenas unos cientos: muchos de ellos, porque corrieron hacia el cerro del cementerio, el único punto alto cercano, y otros, porque un grupo de niños estaba en un circo instalado en el estadio, que quedó fuera del alcance del alud. En todo el país, el terremoto dejó cerca de 70 000 muertos: es el desastre natural más mortífero de la historia del Perú.",
      ["¿Cómo se salvaron muchos sobrevivientes?", "Subiendo al cerro del cementerio", "Escondiéndose en sus casas de adobe hasta que pasó el alud", "Nadando"],
      ["¿Qué dato muestra la magnitud de la tragedia nacional?", "Cerca de 70 000 personas murieron en el país.", "El alud tardó tres minutos en llegar.", "Había un circo en el estadio de la ciudad aquel día"],
      ["¿Qué estructura predomina en el texto?", "Causa y efecto", "Comparación y contraste", "Instrucciones paso a paso para construir un refugio"]),
  ],
  [
    read("La reconstrucción", "🏗️", "Tras la tragedia llegaron rescatistas y ayuda de muchos países. Los sobrevivientes de Yungay decidieron no reconstruir la ciudad sobre los escombros: la levantaron unos kilómetros al norte, en una zona más segura. El terreno de la antigua ciudad se convirtió en el Campo Santo, un camposanto y lugar de memoria donde hoy asoman las palmeras de la antigua plaza de Armas. Visitarlo es caminar sobre una ciudad entera.",
      ["¿Por qué la nueva Yungay se construyó en otro lugar?", "Para estar en una zona más segura", "Porque el gobierno quería un lugar más turístico", "Porque no había espacio"],
      ["¿Qué es hoy el Campo Santo?", "Un lugar de memoria sobre la antigua ciudad", "Un parque de diversiones construido para los turistas", "Un mercado"],
      ["¿Qué efecto busca la última oración?", "Hacer sentir al lector la magnitud de lo perdido", "Invitar a hacer deporte en el Campo Santo", "Dar un dato numérico"]),
    read("Lecciones de un desastre", "📋", "El terremoto de 1970 cambió la manera en que el Perú enfrenta los desastres. En 1972 se creó el Sistema de Defensa Civil, encargado de prevenir, preparar a la población y coordinar la respuesta ante emergencias. Desde entonces se realizan simulacros en colegios y oficinas, se señalan zonas seguras y rutas de evacuación, y se desaconseja construir en cauces y al pie de los glaciares. Cada 31 de mayo, el país recuerda la tragedia como una jornada de reflexión sobre la prevención.",
      ["¿Qué institución se creó a raíz del terremoto?", "El Sistema de Defensa Civil", "Un museo dedicado al Mundial de México de 1970", "Un hospital"],
      ["¿Qué acciones de prevención menciona el texto?", "Simulacros, zonas seguras y rutas de evacuación", "Construir más casas al pie de los glaciares", "Prohibir los mundiales"],
      ["¿Cuál es la idea principal del texto?", "La tragedia impulsó una cultura de prevención.", "El 31 de mayo es feriado en todo el Perú y no se trabaja.", "Los sismos son frecuentes."]),
  ],
];

export const ROWS: Row[] = [
  ["informativos-1", (r) => readPassage(r, INFO.animals, false)],
  ["informativos-2", (r) => readPassage(r, INFO.places, false)],
  ["informativos-3", (r) => readPassage(r, INFO.business, false)],
  ["informativos-4", (r) => readPassage(r, INFO.science, false)],
  ["informativos-5", (r) => readPassage(r, INFO.history, false)],

  ["tradiciones-1", (r) => readPassage(r, PALMA[0], false)],
  ["tradiciones-2", (r) => readPassage(r, PALMA[1], false)],
  ["aves-sin-nido-1", (r) => readPassage(r, AVES[0], false)],
  ["aves-sin-nido-2", (r) => readPassage(r, AVES[1], false)],
  ["ollantay-1", (r) => readPassage(r, OLLANTAY[0], false)],
  ["ollantay-2", (r) => readPassage(r, OLLANTAY[1], false)],

  ["garcilaso-1", (r) => readPassage(r, GARCILASO[0], false)],
  ["garcilaso-2", (r) => readPassage(r, GARCILASO[1], false)],
  ["yungay-1", (r) => readPassage(r, YUNGAY[0], false)],
  ["yungay-2", (r) => readPassage(r, YUNGAY[1], false)],
];
