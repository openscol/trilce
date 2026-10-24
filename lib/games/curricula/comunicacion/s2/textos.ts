import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 2.° de Secundaria · banco de lecturas largas: textos informativos propios y
// dos novelas peruanas del plan lector: «Los ríos profundos» (José María
// Arguedas) y «El mundo es ancho y ajeno» (Ciro Alegría). Los pasajes son
// resúmenes propios, no citas textuales. En no ficción, tres temas peruanos
// con textos propios: la abolición de la esclavitud y el pueblo afroperuano,
// el inventor Pedro Ruiz Gallo y los viajes de Antonio Raimondi.


const INFO = {
  animals: [
    read("La vicuña", "🦙", "La vicuña es el camélido más pequeño de los Andes y el que produce la fibra más fina del mundo. A mediados del siglo XX, la caza ilegal la dejó al borde de la extinción: quedaban apenas unos miles en todo el Perú. Entonces se prohibió su caza y se encargó su cuidado a las comunidades campesinas, que cada cierto tiempo las reúnen en el chaccu, una captura tradicional, para esquilarlas y soltarlas de nuevo. Hoy hay cientos de miles, y la venta de su fibra beneficia a esas mismas comunidades.",
      ["¿Qué puso a la vicuña en peligro de extinción?", "La caza ilegal", "El frío extremo de la puna y la falta de pastos naturales", "Las enfermedades"],
      ["¿Qué es el chaccu?", "Una captura tradicional para esquilar y soltar a las vicuñas", "Una fiesta en la que se caza a las vicuñas para comer su carne", "Un tipo de lana"],
      ["¿Por qué el modelo de conservación funcionó, según el texto?", "Porque las comunidades que las cuidan también se benefician", "Porque se llevaron todas las vicuñas a zoológicos del extranjero", "Porque llovió más"]),
    read("El gallito de las rocas", "🐦", "El gallito de las rocas, ave nacional del Perú, vive en los bosques nublados de la selva alta. El macho luce un plumaje anaranjado intenso y una cresta que le cubre el pico; la hembra, en cambio, es de color pardo, lo que la ayuda a pasar desapercibida mientras cuida el nido. Al amanecer, los machos se reúnen en lugares llamados «leks», donde bailan, saltan y emiten sonidos para atraer a las hembras. Ellas observan y eligen al que mejor se exhibe.",
      ["¿Por qué la hembra es de color pardo?", "Para pasar desapercibida mientras cuida el nido", "Porque es más joven y todavía no ha cambiado de plumas", "Porque está enferma"],
      ["¿Qué ocurre en los «leks»?", "Los machos se exhiben para atraer a las hembras.", "Las hembras construyen los nidos y ponen los huevos.", "Duermen."],
      ["¿Qué estructura usa el texto al hablar del macho y la hembra?", "Comparación y contraste", "Secuencia cronológica", "Problema y solución de la deforestación en la selva"]),
  ],
  places: [
    read("Caral", "🏛️", "A unos 180 kilómetros al norte de Lima, en el valle de Supe, se levanta Caral, considerada la ciudad más antigua de América: tiene unos 5000 años, casi la misma edad que las pirámides de Egipto. Sus habitantes construyeron pirámides, plazas circulares hundidas y viviendas, y desarrollaron la agricultura y el intercambio con pueblos pescadores de la costa. Llama la atención que no se hayan encontrado armas ni murallas defensivas. La arqueóloga Ruth Shady, que dirige su estudio desde 1994, la ha dado a conocer al mundo.",
      ["¿Por qué Caral es tan importante?", "Es considerada la ciudad más antigua de América.", "Es la ciudad más grande que construyeron los incas en la costa.", "Es moderna."],
      ["¿Qué sugiere la ausencia de armas y murallas?", "Que pudo ser una sociedad pacífica", "Que sus habitantes eran muy pobres y no tenían metales", "Que nadie vivió allí"],
      ["¿Qué comparación hace el texto para mostrar su antigüedad?", "Con las pirámides de Egipto", "Con la ciudad de Lima colonial", "Con Machu Picchu y los caminos incas del Cusco"]),
    read("El Cañón del Colca", "🦅", "El Cañón del Colca, en Arequipa, es uno de los más profundos del mundo: en algunos puntos supera los 3000 metros desde la cumbre hasta el río. Sus laderas están cubiertas de andenes preincas que todavía se cultivan. Cada mañana, en el mirador de la Cruz del Cóndor, los turistas esperan a que estas aves aprovechen las corrientes de aire caliente para elevarse. Los pueblos del valle conservan danzas como el wititi, declarada Patrimonio Cultural Inmaterial de la Humanidad por la Unesco.",
      ["¿Qué atrae a los turistas a la Cruz del Cóndor?", "Ver a los cóndores elevarse con las corrientes de aire", "Bañarse en el río que corre al fondo del cañón", "Comprar artesanías"],
      ["¿Qué muestran los andenes del Colca?", "Una agricultura antigua que sigue viva", "Que el cañón es completamente desértico y nadie lo habita", "Que hay minas"],
      ["¿Qué reconocimiento recibió el wititi?", "Patrimonio Cultural Inmaterial de la Humanidad", "Premio al mejor baile de toda Sudamérica", "Ninguno"]),
  ],
  business: [
    read("El boom del arándano", "🫐", "Hace veinte años casi nadie cultivaba arándanos en el Perú. Hoy el país es uno de los mayores exportadores del mundo. El secreto está en el clima de la costa: como no hay heladas y las temperaturas son estables, la fruta puede cosecharse en meses en que los países del norte no tienen producción. Esto ha creado miles de empleos en La Libertad y Lambayeque. Sin embargo, el cultivo consume mucha agua en zonas desérticas, y algunos expertos advierten que podría agotar los acuíferos.",
      ["¿Qué ventaja natural tiene el Perú para cultivar arándanos?", "Un clima estable que permite cosechar cuando otros países no producen", "Lluvias abundantes durante todo el año en la costa", "Suelos volcánicos"],
      ["¿Qué beneficio económico menciona el texto?", "La creación de miles de empleos", "La reducción del precio del agua en las ciudades del norte", "Ninguno"],
      ["¿Qué riesgo plantea el final?", "El agotamiento de las aguas subterráneas", "Que los arándanos pierdan su sabor dulce con el tiempo", "Que no haya compradores"]),
    read("La inteligencia artificial en el aula", "🤖", "Los programas de inteligencia artificial pueden resumir un libro, traducir un texto o resolver un problema en segundos. Para algunos docentes, esto es una amenaza: los alumnos podrían dejar de pensar por sí mismos. Para otros, es una oportunidad: la herramienta puede explicar un tema de varias formas hasta que el estudiante lo entienda. Lo que casi todos aceptan es que hay que enseñar a usarla críticamente: estos programas también se equivocan e inventan datos con total seguridad.",
      ["¿Qué dos posturas presenta el texto?", "La IA como amenaza y como oportunidad", "La IA como juguete y como herramienta de trabajo para los padres", "A favor y a favor"],
      ["¿Qué riesgo de la IA destaca el final?", "Que se equivoca e inventa datos con seguridad", "Que es demasiado cara para los colegios públicos del país", "Que es lenta"],
      ["¿En qué coinciden casi todos, según el texto?", "En que hay que enseñar a usarla críticamente", "En que debe prohibirse en todas las escuelas", "En nada"]),
  ],
  science: [
    read("El Misti", "🌋", "El Misti, con sus 5822 metros, domina el paisaje de Arequipa. Es un volcán activo: su última erupción importante ocurrió hace unos 500 años, y todavía emite fumarolas. Como más de un millón de personas vive a menos de veinte kilómetros de su cráter, el Instituto Geofísico del Perú lo vigila de forma permanente con sismógrafos y cámaras. Los científicos no pueden predecir el día exacto de una erupción, pero sí detectar señales previas, como sismos pequeños y deformaciones del suelo.",
      ["¿Por qué se vigila el Misti de forma permanente?", "Porque es activo y hay mucha población cerca", "Porque es el volcán más alto del mundo y atrae turistas", "Porque nieva mucho"],
      ["¿Qué pueden detectar los científicos?", "Señales previas como sismos pequeños y deformaciones", "El día y la hora exactos en que hará erupción", "Nada"],
      ["¿Qué indica que el Misti sigue activo?", "Que todavía emite fumarolas", "Que está cubierto de nieve en invierno", "Que mide 5822 metros de altura"]),
    read("El Manu, un récord de vida", "🦋", "El Parque Nacional del Manu, entre Cusco y Madre de Dios, es uno de los lugares con mayor biodiversidad del planeta. En sus bosques se han registrado más de mil especies de aves, cerca del 10 % de todas las del mundo, además de jaguares, nutrias gigantes y miles de especies de plantas e insectos. Su secreto es la variedad de alturas: el parque va desde los Andes, a más de 3000 metros, hasta la llanura amazónica, de modo que en poco espacio hay muchos ecosistemas distintos.",
      ["¿Qué explica la enorme biodiversidad del Manu?", "La variedad de alturas y ecosistemas", "Que no llueve nunca y los animales se adaptan a la sequía", "Que es pequeño"],
      ["¿Qué dato muestra su riqueza en aves?", "Tiene cerca del 10 % de las especies de aves del mundo.", "Tiene jaguares y nutrias gigantes.", "Está entre Cusco y Madre de Dios, en el sureste del Perú"],
      ["¿Qué tipo de texto es?", "Informativo", "Narrativo", "Poético, con rima y versos sobre los animales del bosque"]),
  ],
  history: [
    read("Miguel Grau", "⚓", "Durante la guerra del Pacífico (1879-1883), el almirante Miguel Grau comandó el monitor Huáscar, un barco más pequeño que los acorazados chilenos. Durante meses mantuvo en jaque a la escuadra enemiga con ataques rápidos. Además de su valentía, se le recuerda por su caballerosidad: tras el combate de Iquique, recogió a náufragos enemigos y escribió una carta de condolencia a la viuda del capitán chileno Arturo Prat. Murió en el combate de Angamos, el 8 de octubre de 1879.",
      ["¿Por qué se destaca el desempeño de Grau?", "Porque resistió meses con un barco más pequeño", "Porque ganó la guerra del Pacífico para el Perú", "Porque era rico"],
      ["¿Qué hecho muestra su caballerosidad?", "Rescatar náufragos y escribir a la viuda de Prat", "Atacar por sorpresa a los barcos enemigos de noche", "Su uniforme"],
      ["¿Cuándo murió Grau?", "En el combate de Angamos, en 1879", "En el combate de Iquique, al inicio de la guerra", "En 1883"]),
    read("La Lima de los virreyes", "🏰", "Fundada por Francisco Pizarro en 1535, Lima se convirtió en la capital del virreinato del Perú, que durante dos siglos abarcó casi toda Sudamérica española. Por su puerto, el Callao, salía la plata de Potosí hacia España. En la ciudad se fundó en 1551 la Universidad de San Marcos, la más antigua de América. Pero su riqueza convivía con grandes desigualdades: indígenas, esclavizados de origen africano y castas tenían pocos derechos. En 1746, un terremoto y un tsunami destruyeron gran parte de Lima y casi todo el Callao.",
      ["¿Por qué Lima fue tan importante en la Colonia?", "Era la capital del virreinato y por su puerto salía la plata.", "Era la ciudad más fría y lluviosa de toda Sudamérica.", "Era pequeña."],
      ["¿Qué contraste presenta el texto?", "Entre la riqueza de la ciudad y la desigualdad social", "Entre la costa y la selva amazónica del virreinato", "Entre dos virreyes"],
      ["¿Qué ocurrió en 1746?", "Un terremoto y un tsunami destruyeron gran parte de Lima y el Callao.", "Se fundó la Universidad de San Marcos.", "Pizarro fundó la ciudad"]),
  ],
};

// --- Obras narrativas -----------------------------------------------------

const RIOS = [
  [
    read("«Los ríos profundos»: el muro inca (resumen)", "🧱", "Ernesto, un adolescente que ha crecido entre comuneros indígenas, viaja con su padre, un abogado itinerante, al Cusco. Allí visitan al Viejo, un pariente rico y avaro al que su padre desprecia. Por la noche, Ernesto se acerca a un muro inca en una calle estrecha y siente que las piedras están vivas: le parece que se mueven, que «hierven», que guardan la fuerza de los antiguos constructores. Para él, ese muro es más verdadero que los palacios coloniales levantados encima.",
      ["¿Qué siente Ernesto frente al muro inca?", "Que las piedras están vivas y tienen fuerza propia", "Miedo de que el muro se caiga sobre él durante la noche", "Aburrimiento"],
      ["¿Qué representa el Viejo para Ernesto y su padre?", "La riqueza avara y el abuso de poder", "Un modelo de generosidad que quieren imitar", "Un amigo"],
      ["¿Qué contraste establece Ernesto entre el muro y los palacios coloniales?", "El muro le parece más auténtico que lo construido encima.", "Los palacios le parecen más bellos y antiguos que el muro.", "No hay contraste."]),
    read("«Los ríos profundos»: el colegio de Abancay (resumen)", "🏫", "El padre de Ernesto lo deja como interno en un colegio religioso de Abancay, dirigido por el padre Linares. Ernesto se siente solo entre compañeros violentos y burlones. Una tarde, su compañero Antero trae un zumbayllu, un trompo que zumba al girar. Para Ernesto, ese sonido tiene algo mágico: le recuerda los cantos y los ríos de su infancia, y le da fuerza para soportar el encierro. Por un momento, el zumbayllu une a muchos alumnos en un mismo juego.",
      ["¿Cómo se siente Ernesto al llegar al colegio?", "Solo, en un ambiente hostil", "Feliz de reencontrarse con sus amigos de la infancia", "Indiferente"],
      ["¿Qué significa el zumbayllu para Ernesto?", "Un vínculo mágico con el mundo de su infancia", "Un juguete caro que quiere vender a sus compañeros", "Un castigo"],
      ["¿Qué efecto tiene el zumbayllu entre los alumnos?", "Por un momento los une en un mismo juego.", "Provoca peleas y castigos del padre Linares.", "Ninguno."]),
  ],
  [
    read("«Los ríos profundos»: el motín de las chicheras (resumen)", "🧂", "Un día, las chicheras de Abancay, encabezadas por doña Felipa, se rebelan porque la sal ha sido acaparada y no llega a la gente pobre. Asaltan el almacén y reparten la sal entre las mujeres y los colonos de la hacienda Patibamba, que viven en la miseria. Ernesto las sigue, fascinado por su valor. Llegan soldados a restablecer el orden y doña Felipa huye. El padre Linares reprende a Ernesto por haberse mezclado con las rebeldes.",
      ["¿Por qué se rebelan las chicheras?", "Porque la sal acaparada no llega a los pobres", "Porque quieren cerrar el colegio de Abancay", "Por una fiesta"],
      ["¿Qué hacen con la sal?", "La reparten entre las mujeres y los colonos de Patibamba.", "La venden a los hacendados a un precio muy alto.", "La guardan."],
      ["¿Qué muestra la reacción del padre Linares?", "Que defiende el orden establecido frente a la protesta", "Que apoya la rebelión de doña Felipa y de las chicheras", "Que no sabe nada"]),
    read("«Los ríos profundos»: la peste (resumen)", "🌧️", "Al final de la novela, una epidemia de tifus llega a la región. El colegio se vacía y Ernesto queda casi solo. Los colonos de las haciendas, aterrados, bajan en masa a Abancay para exigir que el padre Linares celebre una misa que «mate» a la peste. Ernesto ve en esa multitud una fuerza enorme, la misma que intuyó en las chicheras. Finalmente, deja Abancay rumbo a la hacienda del Viejo, mientras piensa en los ríos que atraviesan los Andes.",
      ["¿Qué exigen los colonos al bajar a Abancay?", "Que se celebre una misa contra la peste", "Que les devuelvan sus tierras y les paguen salarios atrasados", "Que cierren el colegio"],
      ["¿Qué relación establece Ernesto entre los colonos y las chicheras?", "Ve en ambos una fuerza colectiva poderosa.", "Piensa que son enemigos y que se odian entre sí.", "No los relaciona."],
      ["¿Qué simbolizan los ríos en la novela?", "La fuerza y la continuidad del mundo andino", "Los peligros que debe evitar en su viaje a la hacienda del Viejo", "La lluvia"]),
  ],
];

const ALEGRIA = [
  [
    read("«El mundo es ancho y ajeno»: la comunidad de Rumi (resumen)", "🏔️", "La novela comienza con un mal presagio: Rosendo Maqui, el anciano alcalde de la comunidad de Rumi, ve una culebra cruzar su camino. Rumi es una comunidad indígena que trabaja la tierra en común, con sus propias autoridades, fiestas y costumbres. Rosendo es sabio y respetado: resuelve los conflictos con paciencia y conoce la historia de cada familia. Pero la tranquilidad está a punto de romperse, porque el hacendado Álvaro Amenábar quiere las tierras de la comunidad.",
      ["¿Qué anuncia la culebra al inicio?", "Que vendrán desgracias para la comunidad", "Que habrá una buena cosecha ese año", "Que lloverá"],
      ["¿Cómo se organiza la comunidad de Rumi?", "Trabaja la tierra en común y tiene sus propias autoridades.", "Cada familia trabaja sola para un patrón que vive en la ciudad.", "No tiene organización."],
      ["¿Quién representa la amenaza para Rumi?", "El hacendado Álvaro Amenábar", "Rosendo Maqui, el alcalde de la comunidad", "Los niños"]),
    read("«El mundo es ancho y ajeno»: el juicio (resumen)", "⚖️", "Amenábar inicia un juicio para apoderarse de las tierras de Rumi, con documentos falsos y testigos comprados. La comunidad contrata a un abogado, Bismarck Ruiz, que cobra mucho y termina traicionándolos. Los comuneros, que no conocen las leyes ni los tribunales de la ciudad, pierden el juicio. Deben abandonar sus tierras fértiles y subir a Yanañahui, una zona alta, fría y pedregosa. Rosendo, al ver cómo su pueblo se aleja de sus casas, siente que el mundo, como dice el título, es ancho, pero ajeno.",
      ["¿Cómo logra Amenábar ganar el juicio?", "Con documentos falsos, testigos comprados y la traición del abogado", "Comprando las tierras a un precio justo a la comunidad", "Por casualidad"],
      ["¿Qué desventaja tienen los comuneros?", "No conocen las leyes ni los tribunales de la ciudad.", "Son muy pocos y no tienen autoridades propias que los representen.", "Son ricos."],
      ["¿Qué significa el título de la novela?", "El mundo es grande, pero no les pertenece a los indígenas.", "El mundo es pequeño y todos se conocen en él.", "Habla de geografía."]),
  ],
  [
    read("«El mundo es ancho y ajeno»: la prisión de Rosendo (resumen)", "⛓️", "En Yanañahui la vida es dura, pero la comunidad resiste. Rosendo es acusado injustamente de robo y encarcelado. En la prisión conoce a otros presos, entre ellos al bandolero Fiero Vásquez, que respeta al viejo alcalde. Los maltratos de los guardias terminan con la vida de Rosendo. Su muerte conmueve a toda la comunidad: con él se va la memoria de un tiempo en que la tierra y la justicia parecían posibles.",
      ["¿Por qué encarcelan a Rosendo?", "Por una acusación injusta de robo", "Porque mató a Álvaro Amenábar durante una pelea en la hacienda", "Porque huyó"],
      ["¿Cómo muere Rosendo?", "Por los maltratos que sufre en la prisión", "De viejo, tranquilo, en su casa de Yanañahui, rodeado de su familia", "En una batalla"],
      ["¿Qué representa la muerte de Rosendo para la comunidad?", "La pérdida de su memoria y de su esperanza", "El fin de todos sus problemas con el hacendado y el regreso a sus tierras", "Nada"]),
    read("«El mundo es ancho y ajeno»: Benito Castro (resumen)", "✊", "Benito Castro, un comunero que había dejado Rumi de joven, regresa después de trabajar en la costa y en otras regiones. Trae ideas nuevas: quiere modernizar la agricultura y organizar a la comunidad para defender sus derechos. Es elegido alcalde. Cuando Amenábar intenta quitarles también Yanañahui, Benito encabeza la resistencia. La novela termina con el ataque del ejército y una pregunta angustiosa de los comuneros: ¿adónde irán ahora?",
      ["¿Qué trae Benito Castro al volver?", "Ideas nuevas para modernizar y organizar a la comunidad", "Mucho dinero ganado en la costa para comprar las tierras de la hacienda de Amenábar", "Soldados"],
      ["¿Qué diferencia hay entre Benito y Rosendo?", "Benito propone resistir y cambiar; Rosendo confiaba en la paciencia.", "Benito es más viejo y más sabio que Rosendo, y nunca salió de la comunidad de Rumi.", "Ninguna."],
      ["¿Por qué el final es desolador?", "Porque la comunidad vuelve a ser atacada y no tiene adónde ir", "Porque Benito traiciona a la comunidad y se une al hacendado", "Porque termina feliz"]),
  ],
];

// --- Obras de no ficción --------------------------------------------------

const AFRO = [
  [
    read("La esclavitud en el Perú", "⛓️", "Desde el siglo XVI, miles de africanos fueron traídos al Perú por la fuerza para trabajar en haciendas de la costa, en casas y en oficios urbanos. Separados de sus familias y de su tierra, eran comprados y vendidos como mercancía. Muchos resistieron: huían a refugios llamados palenques, compraban su libertad con años de trabajo o defendían sus derechos ante los tribunales. En 1821, San Martín declaró libres a los hijos de esclavizados que nacieran desde entonces, pero la esclavitud siguió existiendo para los demás.",
      ["¿Qué eran los palenques?", "Refugios de personas que huían de la esclavitud", "Haciendas donde trabajaban los esclavizados", "Iglesias"],
      ["¿Qué formas de resistencia menciona el texto?", "Huir, comprar su libertad y acudir a los tribunales", "Ninguna, porque todos aceptaban su situación sin protestar", "Solo la huida"],
      ["¿Por qué la medida de San Martín fue limitada?", "Porque solo liberaba a los hijos nacidos desde 1821", "Porque se aplicó únicamente en la ciudad de Lima y en el Callao", "Porque no existía la esclavitud"]),
    read("La abolición de 1854", "🕊️", "El 3 de diciembre de 1854, el presidente Ramón Castilla firmó en Huancayo el decreto que abolió la esclavitud en el Perú. Unas 25 000 personas quedaron libres. El Estado pagó una indemnización a los antiguos dueños, pero no a las personas liberadas, que salieron sin tierras ni recursos. Por eso, la libertad legal no significó igualdad: durante generaciones, los afroperuanos siguieron enfrentando pobreza y discriminación.",
      ["¿Qué ocurrió el 3 de diciembre de 1854?", "Se firmó el decreto de abolición de la esclavitud.", "Se proclamó la independencia del Perú en Huancayo.", "Murió Castilla."],
      ["¿Qué injusticia señala el texto?", "Se indemnizó a los dueños, pero no a los liberados.", "Se obligó a los liberados a pagar por su propia libertad al Estado.", "Ninguna."],
      ["¿Qué distinción hace el autor al final?", "Entre libertad legal e igualdad real", "Entre la costa y la sierra del país", "Entre dos presidentes del Perú"]),
  ],
  [
    read("La cultura afroperuana", "🪘", "A pesar de la opresión, la población afroperuana creó una cultura que hoy es parte esencial de la identidad nacional. Del cajón nacieron ritmos como el festejo y el landó; en la cocina, platos como los anticuchos o el tacu tacu. Pueblos como El Carmen, en Chincha, mantienen vivas danzas como el zapateo y las fiestas navideñas con «hatajos de negritos». Cada 4 de junio se celebra el Día de la Cultura Afroperuana.",
      ["¿Qué aportes culturales menciona el texto?", "Ritmos, danzas y platos de comida", "Solo la lengua y la religión", "Ninguno"],
      ["¿Qué pueblo es un centro de esta cultura?", "El Carmen, en Chincha", "Ollantaytambo, en Cusco", "Iquitos"],
      ["¿Qué idea expresa «A pesar de la opresión»?", "Que la cultura nació en condiciones adversas", "Que la opresión ayudó a crear la cultura afroperuana", "Que no hubo opresión"]),
    read("Nicomedes y Victoria Santa Cruz", "🎤", "Los hermanos Nicomedes y Victoria Santa Cruz dedicaron su vida a rescatar y difundir la cultura afroperuana en el siglo XX. Nicomedes fue un maestro de la décima, una estrofa de diez versos que improvisaba con ingenio y que usó para denunciar el racismo. Victoria, coreógrafa y compositora, recuperó danzas casi olvidadas y escribió el célebre poema «Me gritaron negra», en el que transforma un insulto en orgullo. El Día de la Cultura Afroperuana se celebra en la fecha del nacimiento de Nicomedes.",
      ["¿Qué es una décima?", "Una estrofa de diez versos", "Un instrumento de percusión hecho con una caja de madera", "Un baile"],
      ["¿Qué logra Victoria Santa Cruz en «Me gritaron negra»?", "Convierte un insulto en motivo de orgullo.", "Acepta el insulto y decide no hablar más del tema.", "Escribe una receta."],
      ["¿Por qué se eligió el 4 de junio para el Día de la Cultura Afroperuana?", "Porque es la fecha del nacimiento de Nicomedes", "Porque ese día se abolió la esclavitud en el Perú", "Por una fiesta religiosa"]),
  ],
];

const RUIZ_GALLO = [
  [
    read("Un inventor de Eten", "⚙️", "Pedro Ruiz Gallo nació en 1838 en Eten, Lambayeque. No tuvo estudios formales de ingeniería: aprendió por su cuenta, leyendo y desarmando mecanismos. Siendo joven, se interesó por los relojes y la música mecánica. Su curiosidad lo llevó a construir instrumentos y máquinas que asombraban a sus contemporáneos. Hoy, una universidad de Lambayeque lleva su nombre como homenaje al ingenio autodidacta.",
      ["¿Cómo aprendió Pedro Ruiz Gallo?", "Por su cuenta, leyendo y desarmando mecanismos", "En una universidad de ingeniería de Europa", "Con su padre"],
      ["¿Qué rasgo de su personalidad destaca el texto?", "La curiosidad", "La pereza", "La timidez extrema, que lo alejó de la gente de su pueblo"],
      ["¿Por qué una universidad lleva su nombre?", "Como homenaje a su ingenio autodidacta", "Porque él la fundó con su propio dinero", "Por casualidad"]),
    read("El reloj monumental", "🕰️", "Su obra más famosa fue un gran reloj monumental que presentó en Lima en la década de 1870. No solo marcaba la hora: tenía calendarios, indicaba las fases de la luna y, a ciertas horas, movía figuras que representaban escenas de la historia del Perú, acompañadas de música. La gente acudía a verlo como a un espectáculo. Para muchos, demostraba que en el Perú también se podía crear tecnología propia.",
      ["¿Qué hacía especial al reloj?", "Además de la hora, tenía calendarios, fases lunares y figuras con música.", "Era el reloj más pequeño del mundo y cabía en un bolsillo.", "Era de oro."],
      ["¿Por qué la gente acudía a verlo?", "Porque funcionaba como un espectáculo", "Porque se vendía a un precio muy bajo en la plaza de Armas de Lima", "Porque era gratis"],
      ["¿Qué demostraba el reloj, según muchos?", "Que en el Perú se podía crear tecnología propia", "Que los relojes europeos eran mejores que los peruanos", "Nada"]),
  ],
  [
    read("Soñar con volar", "✈️", "Décadas antes de que los hermanos Wright volaran en 1903, Ruiz Gallo ya estudiaba cómo construir una máquina voladora. Observaba el vuelo de las aves y calculaba la forma y el tamaño que debían tener las alas. Publicó sus ideas sobre la navegación aérea, aunque no consiguió el apoyo económico para construir un aparato completo. Por eso se le considera uno de los precursores de la aviación en el Perú.",
      ["¿Qué observaba Ruiz Gallo para estudiar el vuelo?", "El vuelo de las aves", "Los globos aerostáticos de Europa", "Las nubes"],
      ["¿Por qué no construyó su máquina voladora?", "Porque no consiguió apoyo económico", "Porque nadie en Lima creyó que las máquinas pudieran volar como las aves", "Porque se mudó"],
      ["¿Por qué se le considera un precursor?", "Porque estudió la aviación antes de que se lograra volar", "Porque fue el primer piloto que voló sobre los Andes", "Porque inventó el avión"]),
    read("Al servicio de la patria", "🇵🇪", "Cuando estalló la guerra del Pacífico en 1879, Ruiz Gallo puso su talento al servicio de la defensa. En Lima trabajó en la fabricación de explosivos y torpedos para proteger el puerto del Callao. En 1880 murió en un accidente mientras manipulaba uno de esos artefactos. Su muerte cortó la vida de un inventor que, con más medios y en otra época, quizás habría llegado mucho más lejos.",
      ["¿A qué se dedicó durante la guerra?", "A fabricar explosivos y torpedos para la defensa", "A construir relojes monumentales para los cuarteles de los soldados peruanos", "A viajar"],
      ["¿Cómo murió?", "En un accidente mientras manipulaba un artefacto", "En una batalla naval frente a Iquique, a bordo del monitor Huáscar", "De viejo"],
      ["¿Qué reflexión plantea la última oración?", "Que su talento no pudo desarrollarse por completo", "Que su muerte no tuvo importancia para el país", "Que fue un mal inventor"]),
  ],
];

const RAIMONDI = [
  [
    read("Un viajero italiano", "🧭", "Antonio Raimondi nació en Milán en 1824 y llegó al Perú en 1850, atraído por su naturaleza. Durante casi veinte años recorrió el país a pie y a lomo de mula, desde la costa hasta la selva, en más de una docena de grandes viajes. En cada lugar anotaba datos de plantas, animales, minerales, pueblos y caminos, y recogía muestras que enviaba a Lima. Nunca volvió a vivir en Italia: el Perú se convirtió en su patria.",
      ["¿Cómo viajaba Raimondi por el Perú?", "A pie y a lomo de mula", "En tren y en barco de vapor por todos los ríos", "En avión"],
      ["¿Qué registraba en sus viajes?", "Plantas, animales, minerales, pueblos y caminos", "Solo los nombres de las ciudades que visitaba", "Recetas de cocina"],
      ["¿Qué significa que «el Perú se convirtió en su patria»?", "Que lo adoptó como su país", "Que nació en el Perú y no en Italia", "Que se fue a Italia"]),
    read("Una puya y una estela", "🌵", "Dos tesoros peruanos llevan el nombre de Raimondi. La Puya raimondii es una planta gigante de la puna que puede superar los diez metros de altura y que florece una sola vez, después de décadas, antes de morir. La Estela Raimondi es una piedra tallada de la cultura Chavín, con la imagen de una divinidad; recibió su nombre porque él la hizo trasladar a Lima para protegerla y estudiarla. Ambos homenajes muestran su doble interés por la naturaleza y la historia.",
      ["¿Qué tiene de particular la Puya raimondii?", "Florece una sola vez, después de décadas, y luego muere.", "Florece todos los años en la costa durante el verano.", "Es pequeña."],
      ["¿Por qué la estela lleva su nombre?", "Porque él la hizo trasladar a Lima para protegerla y estudiarla", "Porque él la talló con sus propias manos en Chavín", "Por error"],
      ["¿Qué muestran ambos homenajes?", "Su interés por la naturaleza y por la historia", "Que solo le interesaba la botánica", "Que era arqueólogo y no le gustaban las plantas"]),
  ],
  [
    read("«El Perú», la obra de una vida", "📚", "Con todo lo que reunió en sus viajes, Raimondi empezó a escribir «El Perú», una obra monumental en varios tomos sobre la geografía, la naturaleza y los recursos del país. También elaboró un gran mapa del Perú, el más completo de su tiempo, que se publicó por partes. No llegó a terminar todo lo que había planeado: murió en 1890 en San Pedro de Lloc, en La Libertad. Su trabajo sirvió durante décadas a científicos, ingenieros y gobiernos.",
      ["¿Qué es «El Perú»?", "Una obra en varios tomos sobre la geografía y los recursos del país", "Una novela de aventuras sobre sus viajes por la selva, con personajes inventados y diálogos", "Un mapa"],
      ["¿Qué otra obra elaboró?", "Un gran mapa del Perú, el más completo de su época", "Un diccionario de quechua, aimara y castellano con miles de palabras y ejemplos", "Un museo"],
      ["¿Qué legado dejó, según el texto?", "Un conocimiento útil durante décadas para científicos y gobiernos", "Una fortuna en oro y plata que donó antes de morir a la ciudad de Milán, donde nació", "Ninguno"]),
    read("El mendigo en el banco de oro", "🪙", "A Raimondi se le atribuye una frase muy repetida: «El Perú es un mendigo sentado en un banco de oro». No hay certeza de que la haya dicho, pero resume una idea que aparece en su obra: el país tenía enormes riquezas naturales que no sabía aprovechar en beneficio de su población. Hoy la frase sigue usándose en debates sobre la minería, la pobreza y la desigualdad, aunque cada quien la interpreta a su manera.",
      ["¿Qué significa la frase del mendigo en el banco de oro?", "Que el país es rico en recursos, pero su gente vive en pobreza", "Que los mendigos del Perú guardan oro en los bancos", "Que el oro es barato"],
      ["¿Qué precisión hace el autor sobre la frase?", "Que no hay certeza de que Raimondi la dijera", "Que Raimondi la escribió con su puño y letra en la primera página de «El Perú»", "Ninguna"],
      ["¿Por qué la frase sigue vigente?", "Porque se usa en debates sobre minería y desigualdad", "Porque es un refrán antiguo de los incas que se enseña en las escuelas desde la Colonia", "Porque rima"]),
  ],
];

export const ROWS: Row[] = [
  ["informativos-1", (r) => readPassage(r, INFO.animals, false)],
  ["informativos-2", (r) => readPassage(r, INFO.places, false)],
  ["informativos-3", (r) => readPassage(r, INFO.business, false)],
  ["informativos-4", (r) => readPassage(r, INFO.science, false)],
  ["informativos-5", (r) => readPassage(r, INFO.history, false)],

  ["rios-profundos-1", (r) => readPassage(r, RIOS[0], false)],
  ["rios-profundos-2", (r) => readPassage(r, RIOS[1], false)],
  ["mundo-ancho-1", (r) => readPassage(r, ALEGRIA[0], false)],
  ["mundo-ancho-2", (r) => readPassage(r, ALEGRIA[1], false)],

  ["afroperuanos-1", (r) => readPassage(r, AFRO[0], false)],
  ["afroperuanos-2", (r) => readPassage(r, AFRO[1], false)],
  ["ruiz-gallo-1", (r) => readPassage(r, RUIZ_GALLO[0], false)],
  ["ruiz-gallo-2", (r) => readPassage(r, RUIZ_GALLO[1], false)],
  ["raimondi-1", (r) => readPassage(r, RAIMONDI[0], false)],
  ["raimondi-2", (r) => readPassage(r, RAIMONDI[1], false)],
];
