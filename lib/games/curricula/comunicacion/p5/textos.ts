import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Primaria · banco de lecturas largas: textos propios, literarios e
// informativos, con temas del Perú y de Latinoamérica.


const LIT1 = {
  fantasy: [
    read("La biblioteca que cambiaba de sitio", "📚", "En Santa Rosa nadie sabía dónde amanecería la biblioteca. Un lunes apareció en la cima del cerro; un jueves, flotando en la laguna. La bibliotecaria, doña Elvira, decía que el edificio perseguía a los lectores perezosos. Ismael, que llevaba tres meses sin devolver un libro, despertó un día con la biblioteca estacionada frente a su ventana. Devolvió el libro en pijama. Esa misma tarde, sin que nadie lo obligara, se llevó otro.",
      ["¿Qué tenía de extraordinario la biblioteca?", "Cambiaba de lugar por sí sola.", "Tenía libros que hablaban con los lectores del pueblo.", "No tenía puertas."],
      ["¿Por qué apareció frente a la ventana de Ismael?", "Porque él no había devuelto un libro", "Porque Ismael era el hijo de la bibliotecaria", "Porque llovía"],
      ["¿Qué muestra el final sobre Ismael?", "Que recuperó el gusto por leer", "Que le tomó miedo a la biblioteca y no volvió", "Que perdió el libro"]),
    read("El zorro que vendía sombras", "🦊", "En la feria de los animales, el zorro abrió un puesto: «Sombras frescas, a un choclo cada una». La vizcacha compró la sombra de un molle y la llevó enrollada bajo el brazo. Al mediodía, cuando el sol apretó, la desenrolló: no había nada. Fue a reclamar, pero el zorro ya no estaba. Solo quedaba, colgando del puesto, la sombra de un zorro riéndose.",
      ["¿Qué vendía el zorro?", "Sombras", "Choclos", "Ramas de molle"],
      ["¿Qué descubrió la vizcacha al mediodía?", "Que la habían engañado", "Que la sombra era demasiado grande para ella sola", "Que el sol no calentaba"],
      ["¿Qué rasgo del zorro muestra el cuento?", "Su astucia para engañar", "Su generosidad con los vecinos de la feria", "Su timidez"]),
  ],
  realistic: [
    read("El turno de la olla", "🍲", "En el comedor popular del barrio, cada familia cocina un día a la semana. El martes le tocó a la mamá de Jimena, pero amaneció con fiebre. Jimena, de once años, fue con su hermano y un cuaderno donde su madre había anotado la receta. Las vecinas la miraron con duda. Al mediodía, ciento veinte personas comieron lentejas. Una señora pidió la receta; Jimena le prestó el cuaderno.",
      ["¿Por qué cocinó Jimena?", "Porque su mamá estaba enferma", "Porque había perdido una apuesta con su hermano menor", "Porque era su cumpleaños"],
      ["¿Qué sintieron las vecinas al verla llegar?", "Desconfianza", "Alegría", "Mucha envidia por su cuaderno de recetas"],
      ["¿Qué prueba que la comida salió bien?", "Una señora pidió la receta.", "Jimena llevó un cuaderno.", "Era martes."]),
    read("La voz de Gael", "🎤", "A Gael se le quebraba la voz cada vez que leía en público. Para el día del logro, la maestra le propuso ser narrador de la obra, detrás del telón: nadie lo vería. Ensayó frente al espejo, luego frente a su perro, después frente a su abuela. El día de la función, el micrófono falló y tuvo que salir al escenario. Leyó hasta el final. La voz le tembló solo en la primera línea.",
      ["¿Cuál era la dificultad de Gael?", "Le costaba leer ante los demás.", "No sabía leer.", "No le gustaba el teatro ni las actuaciones del colegio."],
      ["¿Qué estrategia usó para prepararse?", "Ensayar ante públicos cada vez más exigentes", "Aprender la obra de memoria en una sola noche", "No ensayar"],
      ["¿Qué muestra la última oración?", "Que logró dominar sus nervios", "Que leyó muy mal", "Que el micrófono volvió a funcionar a tiempo"]),
  ],
  historical: [
    read("El niño del telar", "🧵", "Paracas, hace dos mil años. Amaru ayudaba a su abuela a teñir hilos con cochinilla y con hojas de molle. Los mantos que tejían no eran para abrigarse: envolverían a los grandes señores en su último viaje. «Cada figura es una palabra», decía la abuela. Amaru bordó a escondidas un pequeño colibrí en una esquina. La abuela lo vio, sonrió y no lo deshizo.",
      ["¿En qué época y lugar ocurre?", "En Paracas, hace unos dos mil años", "En Lima, durante la Colonia", "En el Cusco, en tiempos de los incas y los chasquis"],
      ["¿Para qué servían los mantos?", "Para envolver a los muertos importantes", "Para vender en la feria", "Para abrigar a los niños en las noches de frío"],
      ["¿Qué muestra la reacción de la abuela?", "Que aprueba la iniciativa de su nieto", "Que está molesta con él por desobedecerla", "Que no vio el bordado"]),
    read("Carta desde el vapor", "🚢", "Callao, 1899. Kenji bajó del barco «Sakura Maru» con otros setecientos noventa japoneses. Venía a trabajar cuatro años en una hacienda de caña. Esa noche escribió a su madre: «El mar aquí es frío y el pan sabe distinto, pero un niño me regaló una fruta amarilla llamada lúcuma. Creo que podré acostumbrarme». Kenji no volvió al Japón: sus nietos todavía viven en Cañete.",
      ["¿Qué hecho histórico enmarca el relato?", "La llegada de los primeros japoneses al Perú", "La fundación del puerto del Callao en la Colonia", "La guerra con Chile"],
      ["¿Qué sentimiento expresa la carta?", "Esperanza, a pesar de la extrañeza", "Rabia contra el capitán", "Deseo de volver enseguida al Japón con su familia"],
      ["¿Qué indica la última oración?", "Que Kenji se quedó a vivir en el Perú", "Que Kenji regresó a su país cuatro años después", "Que no tuvo familia"]),
  ],
};

const LIT2 = {
  realistic: [
    read("Seis cuadras", "🚶", "Desde que su hermano mayor se fue a estudiar a otra ciudad, a Noelia le tocaba llevar a Tadeo al nido. Eran seis cuadras. Las primeras semanas las recorrió en silencio, molesta por tener que madrugar. Una mañana Tadeo se detuvo ante un charco: «Mira, el cielo se cayó aquí». Desde entonces, Noelia sale diez minutos antes. Dice que es para no llegar tarde, pero en realidad es para tener tiempo de mirar.",
      ["¿Cómo se sentía Noelia al principio?", "Fastidiada por la obligación", "Orgullosa de su tarea", "Triste porque su hermano menor no quería ir al nido"],
      ["¿Qué hecho cambia su actitud?", "La frase de Tadeo frente al charco", "La partida de su hermano mayor", "Una llamada de la maestra"],
      ["¿Qué significa «para tener tiempo de mirar»?", "Que ahora disfruta el camino con Tadeo", "Que busca algo que perdió", "Que vigila el tráfico de las seis cuadras con mucho cuidado"]),
    read("El inventario", "📦", "El papá de Rodrigo perdió su trabajo en marzo. En casa nadie lo dijo en voz alta, pero Rodrigo lo notó: ya no había postre y la tele se apagaba temprano. Un sábado encontró a su padre contando herramientas en el garaje. «¿Y si arreglamos bicicletas?», propuso. Colgaron un cartel escrito con plumón. El primer cliente fue el vecino; el segundo, el dueño de la bodega. En junio volvió el postre.",
      ["¿Cómo supo Rodrigo lo que pasaba?", "Por los cambios en la rutina de la casa", "Porque su padre se lo contó", "Porque lo leyó en un cartel escrito con plumón"],
      ["¿Qué solución propuso?", "Abrir un taller de bicicletas", "Vender las herramientas", "Pedir prestado al vecino"],
      ["¿Qué simboliza que «volvió el postre»?", "Que la situación económica mejoró", "Que Rodrigo aprendió a cocinar", "Que ya era invierno"]),
  ],
  historical: [
    read("La mensajera de Tinta", "📜", "Tinta, 1780. Micaela Bastidas dictaba cartas hasta la madrugada: pedía víveres, ordenaba vigilar los caminos, animaba a los pueblos. Su hijo menor, Fernando, de doce años, sellaba los pliegos con cera. «¿Por qué escribes tanto, madre?». «Porque una rebelión no se gana solo con lanzas», respondió ella. Fernando no entendió del todo, pero apretó el sello con más fuerza.",
      ["¿Qué tarea cumplía Micaela Bastidas en el relato?", "Organizar la rebelión con cartas", "Fabricar lanzas", "Enseñar a leer a los niños de Tinta"],
      ["¿Qué quiso decir con «no se gana solo con lanzas»?", "Que también hace falta organización", "Que las lanzas no sirven para nada en una guerra", "Que hay que rendirse"],
      ["¿Qué personaje es histórico?", "Micaela Bastidas", "Ninguno", "Solo el narrador del relato"]),
    read("El primer silbato", "🚂", "La Oroya, 1893. Todo el pueblo subió a la loma para ver llegar el tren. Decían que había cruzado la cordillera por el paso más alto del mundo. Benita, la hija del arriero, miró a las mulas de su padre y luego a la locomotora. Entendió, antes que los adultos, que el oficio de su familia iba a cambiar. Esa noche le pidió a su padre que le enseñara los números.",
      ["¿Qué hecho celebra el pueblo?", "La llegada del ferrocarril", "Una fiesta patronal", "La apertura de una mina de plata en la cordillera"],
      ["¿Qué comprendió Benita?", "Que el tren reemplazaría a los arrieros", "Que las mulas eran más veloces que la locomotora", "Que el tren no volvería"],
      ["¿Por qué pidió aprender los números?", "Para prepararse ante el cambio", "Para contar las mulas de su padre cada mañana", "Porque estaba aburrida"]),
  ],
  poetry: [
    read("Oficio de río", "🌊", "No sé leer, dice el río,\npero conozco el camino.\nNo tengo casa ni abrigo\ny a todos doy mi destino.\n\nMe llevo la sed del valle,\nla sombra de la montaña.\nSi alguien pregunta mi nombre,\nrespondo: agua que pasa.",
      ["¿Quién habla en el poema?", "El río", "Un niño", "La montaña que mira al valle"],
      ["¿Qué recurso usa el poeta al hacer hablar al río?", "Personificación", "Onomatopeya", "Rima asonante en todos los versos"],
      ["¿Qué significa «a todos doy mi destino»?", "Que su agua sirve a quienes encuentra", "Que se queda quieto", "Que no sabe a dónde va"]),
    read("Instrucciones para una tarde de lluvia", "🌧️", "Busque una ventana que dé al cielo.\nApoye la frente: está fría, no importa.\nCuente las gotas hasta perder la cuenta.\n\nCuando escampe, no salga enseguida:\nespere a que el barrio\nestrene su olor a tierra.",
      ["¿Qué forma imita el poema?", "Un texto de instrucciones", "Una carta", "Una noticia sobre el clima de la semana"],
      ["¿Tiene rima fija este poema?", "No: es verso libre.", "Sí: riman todos los versos.", "Sí: riman los pares."],
      ["¿Qué imagen sensorial cierra el poema?", "El olor a tierra mojada", "El frío del vidrio", "El sonido de las gotas sobre el techo de calamina"]),
  ],
  drama: [
    read("La entrevista", "🎭", "(Oficina. DOÑA PILAR, tras un escritorio. Entra SIMÓN, 11 años, con corbata prestada.)\nDOÑA PILAR: ¿Y usted a qué viene?\nSIMÓN: (Carraspea.) Al puesto de ayudante de la librería.\nDOÑA PILAR: Es para mayores de edad.\nSIMÓN: (Saca un cuaderno.) Tengo leídos ciento doce libros. Los anoté.\nDOÑA PILAR: (Hojea, en silencio. Luego, sin mirarlo.) Los sábados. Sin sueldo. Se lleva un libro por semana.\nSIMÓN: (Extiende la mano.) Trato.",
      ["¿Qué obstáculo enfrenta Simón?", "No tiene la edad requerida.", "No sabe leer.", "Llegó tarde a la entrevista por culpa del tráfico."],
      ["¿Qué hace cambiar de opinión a doña Pilar?", "El cuaderno con los libros leídos", "La corbata", "Los ruegos de Simón"],
      ["¿Qué revela la acotación «sin mirarlo»?", "Que oculta que quedó impresionada", "Que está furiosa", "Que no escuchó nada de lo que dijo el niño"]),
    read("El eco", "⛰️", "(Mirador. ALMA y TEO frente a un abismo.)\nALMA: (Grita.) ¡Hola!\nECO: (Desde lejos.) ...ola.\nTEO: Dile algo difícil.\nALMA: (Piensa.) ¡Perdóname!\nECO: ...óname.\nTEO: (Baja la vista.) ¿Era para mí?\nALMA: (Encoge los hombros.) El eco no sabe guardar secretos.\n(TEO sonríe. Los dos miran el abismo.)",
      ["¿Qué usa Alma para decir lo que no se atreve?", "El eco", "Una carta", "Un mensaje de texto"],
      ["¿Qué se infiere de «¿Era para mí?»?", "Que Alma y Teo habían discutido", "Que Teo no oyó el eco", "Que Teo quiere irse del mirador cuanto antes"],
      ["¿Qué indica la acotación final?", "Que se reconciliaron", "Que siguen peleados", "Que el eco dejó de responder"]),
  ],
};

const INFO1 = {
  animals: [
    read("El delfín rosado", "🐬", "En los ríos de la Amazonía vive un delfín de color rosado, llamado bufeo. A diferencia de los delfines de mar, tiene el cuello flexible: puede girar la cabeza para esquivar los troncos del bosque inundado. Como el agua es turbia, casi no usa la vista; se orienta emitiendo sonidos y escuchando su eco. Muchas leyendas amazónicas cuentan que, de noche, se convierte en un hombre elegante.",
      ["¿Qué ventaja le da su cuello flexible?", "Moverse entre los troncos", "Nadar más rápido en el mar", "Respirar bajo el agua"],
      ["¿Cómo se orienta en el agua turbia?", "Con sonidos y su eco", "Con su vista muy aguda", "Siguiendo a los pescadores y a sus canoas"],
      ["¿Qué parte del texto no es científica?", "La leyenda del hombre elegante", "El color rosado", "El uso del eco"]),
    read("La taruca", "🦌", "La taruca es un venado que habita las zonas más altas de los Andes, por encima de los 3500 metros. Su pelaje grueso la protege del frío y sus pezuñas le permiten trepar laderas rocosas. Vive en grupos pequeños guiados por una hembra. Está amenazada por la caza y porque el ganado ocupa sus pastos. Aparece en el escudo de varias ciudades peruanas.",
      ["¿Dónde vive la taruca?", "En las alturas de los Andes", "En los bosques de la selva baja", "En la costa"],
      ["¿Qué la amenaza?", "La caza y la competencia con el ganado", "El exceso de lluvia", "Los pumas que bajan de los nevados cada invierno"],
      ["¿Quién guía al grupo?", "Una hembra", "El macho más viejo", "Nadie"]),
  ],
  art: [
    read("Las tablas de Sarhua", "🎨", "En Sarhua, un pueblo de Ayacucho, cuando una pareja construye su casa recibe un regalo especial: una tabla pintada. Es un tronco largo y delgado donde se dibuja, de abajo hacia arriba, a cada familiar con su oficio. En lo más alto va el sol. La tabla se coloca en el techo, a la vista de todos. Así, la casa nueva guarda la memoria de quienes ayudaron a levantarla.",
      ["¿Cuándo se regala una tabla de Sarhua?", "Cuando una pareja construye su casa", "Cuando nace un niño", "Cuando termina la cosecha de papa en el pueblo"],
      ["¿Qué se pinta en la tabla?", "A los familiares con sus oficios", "Paisajes de la costa", "Animales de la selva"],
      ["¿Qué función cumple la tabla?", "Guardar la memoria de la familia", "Sostener el techo", "Indicar la dirección de la casa a los visitantes"]),
    read("El Inti Raymi", "🌞", "Cada 24 de junio, el Cusco celebra el Inti Raymi, la Fiesta del Sol. En tiempos de los incas marcaba el solsticio de invierno: el día más corto del año, a partir del cual el sol «regresa». La ceremonia fue prohibida durante la Colonia y volvió a representarse en 1944. Hoy cientos de actores recorren la ciudad hasta la explanada de Sacsayhuamán.",
      ["¿Qué celebraba la fiesta entre los incas?", "El solsticio de invierno", "La cosecha del maíz", "El cumpleaños del Inca"],
      ["¿Qué ocurrió con ella en la Colonia?", "Fue prohibida.", "Se hizo más grande.", "Se trasladó a Lima y se celebró en la plaza."],
      ["¿Desde cuándo se representa de nuevo?", "Desde 1944", "Desde 1821", "Desde 1532"]),
  ],
  places: [
    read("Kuélap", "🏰", "En lo alto de una montaña de Amazonas, a tres mil metros, se levanta Kuélap. La construyeron los chachapoyas, mucho antes que los incas. Sus murallas alcanzan casi veinte metros de alto y dentro hay más de cuatrocientas casas circulares. La entrada es un pasaje tan estrecho que solo permite pasar a una persona a la vez. Durante siglos estuvo cubierta por el bosque.",
      ["¿Quiénes construyeron Kuélap?", "Los chachapoyas", "Los incas", "Los mochicas"],
      ["¿Qué forma tienen sus casas?", "Circular", "Cuadrada", "Triangular, con techos muy altos de piedra"],
      ["¿Qué ventaja ofrecía la entrada estrecha?", "Facilitaba la defensa.", "Dejaba pasar carretas.", "Permitía ver el paisaje."]),
    read("El lago Titicaca", "🏞️", "El Titicaca es el lago navegable más alto del mundo: está a más de 3800 metros sobre el nivel del mar, entre el Perú y Bolivia. Sus aguas guardan el calor del día y lo liberan de noche; gracias a ello, en sus orillas se puede cultivar a una altura donde normalmente las heladas lo impedirían. Más de veinticinco ríos desembocan en él, pero solo uno, el Desaguadero, sale.",
      ["¿Qué países comparten el lago?", "Perú y Bolivia", "Perú y Chile", "Bolivia y Argentina"],
      ["¿Cómo ayuda el lago a la agricultura?", "Suaviza las heladas nocturnas.", "Riega los campos con sus olas.", "Atrae lluvias todos los días del año."],
      ["¿Cuántos ríos salen del lago?", "Uno", "Veinticinco", "Ninguno"]),
  ],
  sports: [
    read("La paleta frontón", "🏓", "La paleta frontón nació en Lima, en 1945. Se juega con una paleta de madera y una pelota de jebe que debe rebotar contra una pared llamada frontis. Gana el punto quien logra que el rival no pueda devolverla. No necesita red ni mucho espacio; por eso se difundió en clubes y parques. En 2019 formó parte de los Juegos Panamericanos realizados en su ciudad de origen.",
      ["¿Dónde se inventó este deporte?", "En Lima", "En Madrid", "En Buenos Aires"],
      ["¿Por qué se difundió fácilmente?", "Porque requiere poco espacio y equipo", "Porque es obligatorio en los colegios", "Porque se juega con red"],
      ["¿Qué pasó en 2019?", "Estuvo en los Juegos Panamericanos.", "Se inventó la pelota de jebe que hoy se usa.", "Dejó de practicarse."]),
    read("Coleccionar estampillas", "✉️", "La filatelia es la afición de coleccionar estampillas. Cada una es una ventana pequeña: muestra aves, héroes, monumentos o inventos del país que la emitió. Los coleccionistas las ordenan por tema o por época, y las cuidan con pinzas para no dañarlas. Aunque hoy se envían menos cartas, la afición continúa: algunas estampillas antiguas valen más que un automóvil.",
      ["¿Qué es la filatelia?", "La afición de coleccionar estampillas", "El arte de escribir cartas con letra elegante", "El estudio de las aves"],
      ["¿Por qué se usan pinzas?", "Para no dañar las estampillas", "Para pegarlas mejor", "Para contarlas más rápido cada tarde"],
      ["¿Qué muestra el último dato?", "Que algunas piezas son muy valiosas", "Que ya nadie colecciona estampillas antiguas", "Que los autos son baratos"]),
  ],
};

const INFO2 = {
  people: [
    read("Santiago Antúnez de Mayolo", "💡", "Santiago Antúnez de Mayolo nació en Áncash en 1887. De joven recorrió el Cañón del Pato y pensó que la fuerza de ese río podía convertirse en electricidad. Estudió ingeniería en Europa y, de regreso, diseñó la central que décadas después iluminaría buena parte del norte del Perú. También investigó la física de las partículas. Solía decir que un país sin energía es un país sin futuro.",
      ["¿Qué idea tuvo al recorrer el Cañón del Pato?", "Usar el río para generar electricidad", "Construir un puente colgante sobre el cañón", "Abrir una mina"],
      ["¿Qué muestra que fue perseverante?", "Su proyecto se concretó décadas después.", "Nació en Áncash.", "Viajó a Europa en barco con toda su familia."],
      ["¿Qué significa su frase final?", "Que la energía es clave para el desarrollo", "Que el futuro del país es oscuro y sin esperanza", "Que el país no tiene ríos"]),
    read("Sofía Mulanovich", "🏄", "Sofía Mulanovich aprendió a correr olas en Punta Hermosa, al sur de Lima. A los nueve años ya competía contra niños mayores. En 2004 se convirtió en la primera sudamericana en ganar el título mundial de surf. No siempre venció: perdió finales y sufrió lesiones. Años después creó una academia para que niñas y niños sin recursos pudieran entrenar.",
      ["¿Qué logró en 2004?", "El título mundial de surf", "Una medalla olímpica de oro", "Abrir su academia"],
      ["¿Qué detalle muestra que su camino no fue fácil?", "Perdió finales y sufrió lesiones.", "Aprendió en Punta Hermosa, al sur de Lima.", "Competía a los nueve años."],
      ["¿Qué hizo por otros deportistas?", "Creó una academia para niños sin recursos.", "Les regaló sus trofeos.", "Escribió un libro sobre las olas del sur de Lima."]),
  ],
  business: [
    read("¿Por qué suben los precios?", "📈", "Cuando muchas personas quieren comprar algo y hay poco, el precio sube. Eso ocurre con el limón cuando las lluvias dañan las cosechas: hay menos limones y los mismos compradores. Lo contrario pasa en plena temporada de mango: hay tanto que los vendedores bajan el precio para no quedarse con fruta. A esta relación los economistas la llaman oferta y demanda.",
      ["¿Qué ocurre cuando hay poco de un producto muy pedido?", "Su precio sube.", "Su precio baja.", "Nadie lo compra."],
      ["¿Por qué baja el precio del mango en temporada?", "Porque hay mucha fruta disponible", "Porque nadie quiere mango", "Porque las lluvias dañan las cosechas del norte"],
      ["¿Qué es la «oferta»?", "La cantidad de producto disponible", "Las ganas que tiene la gente de comprar algo", "El precio final"]),
    read("Contraseñas seguras", "🔐", "Una contraseña es la llave de tus cuentas. Las más débiles son las fáciles de adivinar: tu nombre, tu cumpleaños o «123456». Una contraseña segura es larga y mezcla letras, números y símbolos. Un buen truco es usar una frase: «MiPerroCome3Panes!». Además, conviene no repetir la misma en todos lados: si alguien descubre una, las tendría todas.",
      ["¿Qué hace débil a una contraseña?", "Que sea fácil de adivinar", "Que sea muy larga", "Que tenga símbolos y números mezclados"],
      ["¿Qué truco propone el texto?", "Usar una frase con letras, números y símbolos", "Anotarla en la carpeta para no olvidarla nunca más", "Usar tu cumpleaños"],
      ["¿Por qué no conviene repetir contraseñas?", "Porque una filtración abriría todas las cuentas", "Porque las contraseñas repetidas se olvidan más rápido", "Porque está prohibido"]),
  ],
  science: [
    read("El fenómeno de El Niño", "🌡️", "Cada cierto número de años, las aguas del Pacífico frente al Perú se calientan más de lo normal. A eso se le llama fenómeno de El Niño. El mar tibio evapora más agua, y por eso llueve con fuerza en la costa norte, donde casi nunca llueve. Al mismo tiempo, los peces de agua fría, como la anchoveta, se alejan. Los pescadores de Paita le dieron ese nombre porque solía notarse cerca de la Navidad.",
      ["¿Qué es el fenómeno de El Niño?", "Un calentamiento anormal del mar", "Una corriente de agua helada", "Una tormenta de arena"],
      ["¿Por qué llueve más en la costa norte?", "Porque el mar tibio evapora más agua", "Porque sopla menos viento", "Porque los peces se alejan hacia aguas más frías"],
      ["¿De dónde viene su nombre?", "De que se notaba cerca de la Navidad", "De un científico llamado Niño", "De un pueblo de Piura"]),
    read("¿Por qué el cielo es azul?", "🌤️", "La luz del sol parece blanca, pero está hecha de todos los colores. Cuando entra en la atmósfera, choca con las moléculas del aire. La luz azul se dispersa mucho más que la roja; por eso, miremos donde miremos, nos llega azul desde todas partes. Al atardecer, la luz recorre un camino más largo y pierde casi todo el azul: lo que queda son los tonos rojizos.",
      ["¿De qué está hecha la luz del sol?", "De todos los colores", "Solo de luz blanca", "Solo de luz azul"],
      ["¿Por qué vemos el cielo azul?", "Porque la luz azul se dispersa más en el aire", "Porque refleja el color del mar", "Porque el aire es azul"],
      ["¿Por qué el atardecer es rojizo?", "La luz atraviesa más aire y pierde el azul.", "El sol cambia de color.", "Las nubes se calientan y se tiñen de rojo."]),
  ],
  history: [
    read("Chavín de Huántar", "🗿", "Hace unos tres mil años, en un valle de Áncash, se construyó un gran templo de piedra: Chavín de Huántar. Bajo sus plazas corre una red de galerías y canales. Cuando el agua pasaba por ellos, el templo entero rugía como un felino. En el centro, a oscuras, se alza el Lanzón, una escultura de más de cuatro metros. Peregrinos de la costa y de la selva llegaban hasta allí.",
      ["¿Qué efecto producían los canales?", "Un rugido que impresionaba a los visitantes", "Luz dentro de las galerías más profundas del templo", "Riego para los campos"],
      ["¿Qué es el Lanzón?", "Una escultura en el centro del templo", "Un canal de agua que cruza toda la plaza", "Un arma de guerra"],
      ["¿Qué muestra que Chavín fue un centro importante?", "Llegaban peregrinos de regiones lejanas.", "Estaba en un valle.", "Sus piedras eran de color gris y muy pesadas."]),
    read("La rebelión de Túpac Amaru II", "⚔️", "En 1780, José Gabriel Condorcanqui, cacique de Tungasuca, tomó el nombre de Túpac Amaru II y se levantó contra los abusos del gobierno colonial. Reclamaba el fin de los trabajos forzados en minas y obrajes. Miles de indígenas, mestizos y afrodescendientes lo siguieron. La rebelión fue derrotada en 1781, pero sus ideas alimentaron, cuarenta años después, la lucha por la Independencia.",
      ["¿Contra qué se levantó Túpac Amaru II?", "Contra los abusos del gobierno colonial", "Contra los incas", "Contra otro cacique de un pueblo vecino al suyo"],
      ["¿Qué reclamaba?", "El fin de los trabajos forzados", "Más minas", "Un nuevo virrey que viniera desde España"],
      ["¿Qué legado dejó la rebelión?", "Inspiró la lucha por la Independencia.", "Ninguno, porque todos la olvidaron pronto.", "Fundó una ciudad."]),
  ],
};

export const ROWS: Row[] = [
  ["ilustrados-1", (r) => readPassage(r, LIT1.fantasy, false)],
  ["ilustrados-2", (r) => readPassage(r, LIT1.realistic, false)],
  ["ilustrados-3", (r) => readPassage(r, LIT1.historical, false)],

  ["realistas-1", (r) => readPassage(r, LIT2.realistic, false)],
  ["realistas-2", (r) => readPassage(r, LIT2.historical, false)],
  ["realistas-3", (r) => readPassage(r, LIT2.poetry, false)],
  ["realistas-4", (r) => readPassage(r, LIT2.drama, false)],

  ["informativos-1-1", (r) => readPassage(r, INFO1.animals, false)],
  ["informativos-1-2", (r) => readPassage(r, INFO1.art, false)],
  ["informativos-1-3", (r) => readPassage(r, INFO1.places, false)],
  ["informativos-1-4", (r) => readPassage(r, INFO1.sports, false)],

  ["informativos-2-1", (r) => readPassage(r, INFO2.people, false)],
  ["informativos-2-2", (r) => readPassage(r, INFO2.business, false)],
  ["informativos-2-3", (r) => readPassage(r, INFO2.science, false)],
  ["informativos-2-4", (r) => readPassage(r, INFO2.history, false)],
];
