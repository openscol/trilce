import { readPassage } from "../../../generators/lengua/bank";
import { read } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Secundaria · banco de lecturas largas, todas resúmenes y textos
// propios (no citas textuales): estrategias retóricas en documentos de la
// historia del Perú (el bando de Túpac Amaru II, la carta de Grau a la viuda
// de Prat, María Parado de Bellido, el ensayo de Basadre sobre la promesa de
// la vida peruana), el desarrollo de textos informativos, argumentos, la
// novela «Los perros hambrientos» (Ciro Alegría), la comedia «Ña Catita»
// (Manuel Ascensio Segura), la ascensión de Annie Peck al Huascarán (1908) y
// documentos formales usados en el Perú (oficio, solicitud, acta, comunicado).

// --- Estrategias retóricas en textos históricos --------------------------------

const RHETORIC_1 = [
  read("El bando de Túpac Amaru II (1780)", "📜", "En noviembre de 1780, José Gabriel Condorcanqui, Túpac Amaru II, mandó leer un bando en los pueblos del sur andino. En él se presentaba como descendiente de los incas y denunciaba los abusos de los corregidores: el reparto forzoso de mercancías, los tributos excesivos y la mita que llevaba a los indios a morir en las minas. Pedía a criollos, mestizos e indígenas que se unieran contra esos «tiranos», y aseguraba que no actuaba contra la Corona, sino contra el mal gobierno.",
    ["¿Qué estrategia usa al presentarse como descendiente de los incas?", "Busca legitimidad apelando a la historia y la identidad andina.", "Busca asustar a los españoles con un ejército numeroso y armado.", "Da un dato sin importancia."],
    ["¿Por qué dice que no actúa contra la Corona?", "Para sumar apoyos y evitar parecer un rebelde contra el rey", "Porque admiraba al rey más que a los incas y quería servirle en España", "Porque era español"],
    ["¿A quiénes dirige su llamado?", "A criollos, mestizos e indígenas", "Solo a los corregidores y a los dueños de las minas de Potosí", "Solo a los incas antiguos"]),
  read("La carta de Grau a la viuda de Prat (1879)", "⚓", "Tras el combate de Iquique, en mayo de 1879, el capitán chileno Arturo Prat murió al abordar el Huáscar. Días después, Miguel Grau escribió a la viuda de Prat. Con respeto, le contaba que su esposo había caído defendiendo con valor la bandera de su patria, lamentaba su dolor y le devolvía la espada y otros objetos personales del marino. La carta, escrita en plena guerra, se convirtió en un símbolo de nobleza hacia el adversario.",
    ["¿Qué tono predomina en la carta?", "Respetuoso y compasivo", "Triunfalista y burlón", "Frío y amenazante con el enemigo"],
    ["¿Qué efecto tiene que Grau elogie el valor de Prat?", "Muestra que se puede reconocer la dignidad del enemigo.", "Hace que el Perú pierda la guerra.", "Ridiculiza a la Marina de Chile y a sus capitanes."],
    ["¿Por qué la carta se volvió un símbolo?", "Por su gesto de humanidad en medio de la guerra", "Porque anunciaba el fin de la guerra", "Porque anunciaba el fin de la guerra y la firma de un tratado de paz"]),
];
const RHETORIC_2 = [
  read("María Parado de Bellido (1822)", "🕊️", "Durante la lucha por la independencia, María Parado de Bellido, una mujer de Huamanga que no sabía escribir, dictaba cartas para informar a los patriotas de los movimientos del ejército realista. Fue descubierta y llevada ante las autoridades, que le ofrecieron el perdón si delataba a sus compañeros. Se negó. La tradición conserva su respuesta: había actuado por la libertad de su patria y no iba a traicionar a nadie. Fue fusilada en 1822.",
    ["¿Qué valor destaca el relato de su respuesta?", "La lealtad hasta las últimas consecuencias", "La astucia para escapar", "El deseo de recibir una recompensa de las autoridades realistas"],
    ["¿Qué efecto tiene mencionar que no sabía escribir?", "Resalta que su compromiso fue mayor que sus limitaciones.", "Indica que sus cartas tenían errores de ortografía y no se entendían.", "Ninguno"],
    ["¿Por qué se presenta la oferta de perdón?", "Para mostrar que pudo salvarse y eligió no hacerlo", "Para mostrar que las autoridades eran justas", "Para cambiar de tema"]),
  read("La promesa de la vida peruana", "🇵🇪", "En un ensayo escrito en 1943, el historiador Jorge Basadre sostuvo que el Perú no debía verse solo como un problema, sino también como una posibilidad. Recordaba que la independencia se hizo con la esperanza de un país más justo, y que esa promesa seguía sin cumplirse para muchos peruanos. Para Basadre, la tarea de cada generación era trabajar para que esa promesa se hiciera realidad, sin caer en el pesimismo ni en el conformismo.",
    ["¿Qué estrategia argumentativa usa Basadre?", "Opone dos miradas: el país como problema y como posibilidad.", "Enumera datos económicos de cada región del país en 1943.", "Cuenta un chiste."],
    ["¿Qué llamado hace a los lectores?", "A trabajar por un país más justo sin pesimismo", "A abandonar el país", "A olvidar la historia de la independencia"],
    ["¿Qué entiende Basadre por «promesa»?", "La esperanza de justicia que nació con la independencia", "Un contrato firmado entre presidentes", "Un contrato firmado entre los presidentes del Perú y de los países vecinos"]),
];

// --- Desarrollo de textos informativos -------------------------------------------

const DEVELOPMENT_1 = [
  read("El Niño costero de 2017", "🌧️", "En marzo de 2017, el mar frente a Piura y Tumbes se calentó varios grados en pocas semanas. El agua caliente aumentó la evaporación y provocó lluvias intensas en zonas que casi nunca reciben lluvia. Los ríos se desbordaron, los huaicos arrasaron puentes y más de un millón de personas resultaron afectadas. La experiencia mostró que el país necesita no solo reconstruir, sino también planificar dónde y cómo se construye.",
    ["¿Cómo desarrolla el autor la información?", "Sigue una cadena de causas y consecuencias.", "Compara 2017 con todos los años anteriores.", "Describe un solo lugar."],
    ["¿Qué paso conecta el mar caliente con las lluvias?", "El aumento de la evaporación", "El desborde de los ríos", "La caída de los puentes"],
    ["¿Qué agrega la última oración?", "Una lección para el futuro", "Otra causa del fenómeno", "Un dato de población"]),
  read("La quinua viaja", "🌾", "Durante siglos, la quinua fue un alimento de las comunidades andinas, poco valorado en las ciudades. En la década de 2010, su fama de «superalimento» la llevó a los supermercados de Europa y Estados Unidos, y su precio se triplicó. Para muchos productores fue una oportunidad; para algunos consumidores andinos, en cambio, la quinua se volvió demasiado cara. Hoy el reto es que el comercio beneficie a quienes la cultivan sin dejarlos sin su propio alimento.",
    ["¿Cómo se desarrolla el texto?", "Narra un cambio en el tiempo y sus efectos contrapuestos.", "Da instrucciones para cocinar quinua.", "Compara la quinua con el arroz y el trigo en precio y sabor."],
    ["¿Qué contraste presenta?", "Oportunidad para unos y encarecimiento para otros", "Sabor dulce y amargo", "Productores de la costa frente a productores de la selva amazónica"],
    ["¿Qué plantea la conclusión?", "Un reto de equidad", "Que hay que dejar de exportar", "Nada nuevo"]),
];
const DEVELOPMENT_2 = [
  read("Internet en la sierra", "📡", "En muchas comunidades rurales, la conexión a internet llegó primero al celular que a la escuela. Al comienzo se usó para comunicarse con familiares migrantes. Luego, durante la pandemia, se volvió la única vía para estudiar, aunque la señal fallaba y los datos eran caros. Hoy, docentes y municipios buscan antenas comunitarias y puntos de acceso gratuitos. La historia muestra que la tecnología no basta: hacen falta políticas que la acerquen a todos.",
    ["¿Qué hilo organiza el texto?", "La evolución del uso de internet en el tiempo", "Una lista de marcas de celulares", "Una comparación entre dos países vecinos de Sudamérica"],
    ["¿Qué palabras marcan la progresión?", "«Al comienzo», «Luego» y «Hoy»", "«la señal fallaba y los datos eran caros»", "«antenas comunitarias»"],
    ["¿Cuál es la idea final?", "La tecnología necesita políticas para llegar a todos.", "La tecnología resuelve todo por sí sola.", "La tecnología resuelve todo por sí sola, sin necesidad de que intervenga el Estado."]),
  read("¿Por qué florece el desierto?", "🌸", "Las lomas de Lima son ecosistemas que reverdecen cada invierno en medio del desierto. No llueve, pero la neblina que llega del mar se condensa en las plantas y en las rocas, y esa humedad basta para que broten flores y hierbas. Por eso las lomas son tan frágiles: dependen de la neblina y de que nadie las ocupe. En los últimos años, la expansión urbana ha reducido su extensión, y varias organizaciones piden protegerlas.",
    ["¿Qué estructura sigue el texto?", "Explica un fenómeno, su fragilidad y una amenaza.", "Narra un paseo por las lomas con amigos.", "Narra un paseo por las lomas con amigos un domingo de invierno."],
    ["¿Qué explica el término «condensa»?", "Cómo la neblina se convierte en agua sobre las plantas", "Cómo se forma la lluvia en la sierra", "Cómo se construyen las casas en los cerros cercanos a las lomas"],
    ["¿Qué conecta las ideas de la fragilidad y la amenaza?", "Las lomas dependen de condiciones que la ciudad altera.", "Las lomas están lejos del mar.", "Las flores de las lomas solo crecen en verano, cuando el sol calienta el desierto."]),
];

// --- Argumentos ----------------------------------------------------------------

const ARGS_1 = [
  read("Menos autos en el centro", "🚗", "El centro de Lima debería cerrarse a los autos particulares. La medida reduciría la contaminación, que supera los límites recomendados, y devolvería las calles a los peatones. Ciudades como Bogotá han probado ciclovías y zonas peatonales con buenos resultados para el comercio. Algunos comerciantes temen perder clientes, pero los estudios muestran que los peatones compran más que quienes pasan en auto. Para que funcione, la medida debe ir acompañada de transporte público de calidad.",
    ["¿Cuál es la tesis?", "El centro de Lima debería cerrarse a los autos particulares.", "Bogotá tiene ciclovías.", "Los comerciantes perderían todos sus clientes y deberían cerrar sus tiendas."],
    ["¿Qué contraargumento reconoce?", "El temor de los comerciantes a perder clientes", "Que la contaminación del centro es baja y no afecta la salud", "Que Bogotá es otro país"],
    ["¿Qué condición plantea al final?", "Que haya transporte público de calidad", "Que se prohíban las bicicletas", "Que se suban los impuestos a quienes tengan más de un auto"]),
  read("Uniforme único", "👕", "Los colegios públicos deberían permitir que los alumnos asistan con buzo todos los días. El uniforme completo cuesta más de doscientos soles, un gasto difícil para muchas familias. Además, el buzo es más cómodo para las actividades del día. Se dirá que el uniforme formal enseña disciplina; sin embargo, la disciplina se forma con normas y ejemplo, no con una corbata.",
    ["¿Qué tipo de razón es «cuesta más de doscientos soles»?", "Una razón económica", "Una razón estética", "Una anécdota personal"],
    ["¿Cómo responde a la objeción de la disciplina?", "Dice que la disciplina depende de normas y ejemplo.", "Acepta la objeción y cambia su tesis.", "Acepta que el uniforme enseña disciplina y propone usarlo solo los lunes."],
    ["¿Qué propone el autor?", "Que se permita el buzo todos los días", "Que se use el uniforme formal también en educación física", "Que el uniforme sea más caro"]),
];
const ARGS_2 = [
  read("Leer a los clásicos", "📖", "Algunos dicen que los clásicos de la literatura ya no sirven a los jóvenes. Es cierto que su lenguaje puede parecer lejano. Pero «Los ríos profundos» habla del desarraigo, y «Paco Yunque», del abuso del poderoso: temas que cualquier estudiante reconoce hoy. El problema no son los libros, sino cómo se enseñan. Con lecturas guiadas y debates, los clásicos dejan de ser una obligación y se vuelven una conversación.",
    ["¿Qué hace el autor en la primera oración?", "Presenta la postura contraria.", "Presenta su tesis.", "Narra un recuerdo de su infancia como lector."],
    ["¿Qué evidencia usa?", "Ejemplos de obras con temas actuales", "Estadísticas de lectura", "La opinión de un especialista en educación de una universidad"],
    ["¿Cuál es su conclusión?", "Los clásicos sirven si se enseñan bien.", "Hay que dejar de leer clásicos.", "Los clásicos deberían reemplazarse por libros escritos este siglo."]),
  read("Reciclar no basta", "♻️", "Reciclar es útil, pero no resolverá la crisis del plástico. Solo una pequeña parte del plástico que se usa en el Perú llega a reciclarse; el resto termina en botaderos, ríos y el mar. Por eso, la prioridad debe ser reducir: menos envases descartables, más productos a granel y leyes que hagan responsables a las empresas. Reciclar es el último paso, no el primero.",
    ["¿Cuál es la tesis?", "Reducir el plástico es más importante que reciclarlo.", "Reciclar es inútil y hay que dejar de hacerlo en todos los distritos.", "El mar está limpio."],
    ["¿Qué dato apoya la tesis?", "Solo una pequeña parte del plástico se recicla.", "Algunas empresas ya venden productos a granel en los mercados de Lima.", "Existen productos a granel."],
    ["¿Qué recurso usa la frase final?", "Una antítesis que resume la idea", "Una pregunta retórica", "Una cita de un experto en medio ambiente"]),
];

// --- Novela: «Los perros hambrientos» -------------------------------------------

const NOVEL_1 = [
  read("Los perros hambrientos (resumen I)", "🐕", "En las alturas del norte andino, la familia del pastor Simón Robles cría ovejas con ayuda de sus perros, a los que quiere como a parte de la casa. La pastora Antuca pasa los días en la puna con el rebaño y los perros, que cuidan a las ovejas de zorros y ladrones. Alegría describe con detalle la vida campesina: las fiestas, los cantos, las historias que se cuentan junto al fogón y la dependencia de la tierra y la lluvia.",
    ["¿Qué lugar ocupan los perros en la familia?", "Son casi parte de la familia y ayudan en el trabajo.", "Son animales salvajes que atacan al rebaño.", "Son animales salvajes que la familia mantiene lejos de la casa y del rebaño."],
    ["¿Qué muestra la descripción de fiestas e historias?", "La riqueza cultural de la vida campesina", "Que los campesinos no trabajan", "Que los campesinos prefieren las fiestas al trabajo en la puna"],
    ["¿De qué depende la vida de la familia?", "De la tierra y la lluvia", "Del comercio con Lima", "De la minería del oro en la puna"]),
  read("Los perros hambrientos (resumen II)", "🌵", "Llega una sequía terrible: no llueve durante meses y se pierden las cosechas. El hambre se extiende entre los campesinos y también entre los perros, que empiezan a robar y a vagar en jaurías. Los comuneros piden ayuda al hacendado, pero reciben indiferencia y violencia. La novela muestra cómo la naturaleza y la injusticia social se unen contra los pobres. Al final, vuelve la lluvia, y con ella una esperanza frágil.",
    ["¿Qué paralelo establece la novela entre perros y campesinos?", "Ambos sufren el hambre y la desprotección.", "Ambos son ricos.", "Los perros son malos y los campesinos son buenos y nunca sufren."],
    ["¿Qué critica la actitud del hacendado?", "La injusticia y el abuso de los poderosos", "La pereza de los campesinos", "La pereza de los campesinos que no supieron guardar comida"],
    ["¿Qué sugiere el final con la lluvia?", "Una esperanza que no borra el sufrimiento vivido", "Que la familia se muda a la costa para empezar de nuevo", "Que la familia se muda a la costa"]),
];

// --- Teatro: «Ña Catita» -----------------------------------------------------------

const DRAMA_1 = [
  read("Ña Catita (resumen I)", "🎭", "En la Lima del siglo XIX, ña Catita es una anciana devota, chismosa y entrometida que entra y sale de las casas dando consejos. En la casa de doña Rufina, convence a la madre de casar a su hija Juliana con don Alejo, un caballero de buenos modales que dice ser rico. Juliana, en cambio, está enamorada de Manuel, un joven sin fortuna, y su padre, don Jesús, desconfía de don Alejo.",
    ["¿Qué rasgo define a ña Catita?", "Es entrometida y manipuladora.", "Es tímida y callada.", "Es una joven enamorada de Manuel."],
    ["¿Qué conflicto plantea la obra?", "Un matrimonio arreglado frente al amor de Juliana", "Una guerra entre dos países", "La herencia de una mina de plata en el sur"],
    ["¿Qué tipo de obra es «Ña Catita»?", "Una comedia de costumbres", "Una tragedia griega", "Una novela de ciencia ficción"]),
  read("Ña Catita (resumen II)", "🎭", "A medida que avanza la comedia, ña Catita miente, intriga y siembra desconfianza entre los esposos. Finalmente se descubre que don Alejo no es quien dice ser: está casado y ha engañado a todos. Don Jesús expulsa a ña Catita de la casa y Juliana puede casarse con Manuel. Con humor, Segura critica la hipocresía y las apariencias de la sociedad limeña de su tiempo.",
    ["¿Qué revelación resuelve el conflicto?", "Que don Alejo está casado y es un impostor", "Que Manuel es millonario", "Que ña Catita es la madre de Juliana"],
    ["¿Qué critica Segura con humor?", "La hipocresía y las apariencias sociales", "La pobreza del campo", "La pobreza de los campesinos de la sierra"],
    ["¿Cómo termina ña Catita?", "Expulsada de la casa", "Casada con don Alejo", "Como heroína de la obra, aplaudida por todos"]),
];

// --- No ficción: Annie Peck en el Huascarán ------------------------------------------

const NONFICTION_1 = [
  read("La cumbre de Annie Peck (I)", "🏔️", "En 1908, la estadounidense Annie Smith Peck, profesora y alpinista de 58 años, llegó al Callejón de Huaylas decidida a subir el Huascarán. Ya lo había intentado varias veces sin éxito. En una época en que se creía que las mujeres no podían hacer escaladas difíciles, contrató a dos guías suizos y organizó el ascenso con cargadores de la zona. El frío, las grietas del glaciar y los vientos obligaron al grupo a avanzar con lentitud.",
    ["¿Qué prejuicio de la época desafió Annie Peck?", "Que las mujeres no podían hacer escaladas difíciles", "Que los suizos no sabían escalar", "Que el Huascarán era una montaña pequeña y fácil"],
    ["¿Qué muestra que lo hubiera intentado antes?", "Su perseverancia", "Su miedo", "Que conocía a los cargadores desde niña"],
    ["¿Qué dificultades enfrentó el grupo?", "El frío, las grietas y el viento", "El calor del valle, la lluvia y los derrumbes del camino", "La falta de comida en Lima"]),
  read("La cumbre de Annie Peck (II)", "🏔️", "En septiembre de 1908, Peck y sus guías alcanzaron la cumbre norte del Huascarán. El descenso fue durísimo: uno de los guías sufrió graves congelamientos. Peck calculó que la montaña superaba los 7000 metros y la anunció como la más alta de América, pero mediciones posteriores demostraron que era más baja. Aun así, su hazaña fue reconocida, y hoy la cumbre norte lleva su nombre.",
    ["¿Qué error cometió Peck?", "Sobreestimó la altura de la montaña.", "Subió una montaña equivocada.", "Eligió una ruta equivocada y tuvo que regresar a mitad de camino."],
    ["¿Por qué su hazaña siguió siendo reconocida?", "Porque el ascenso fue un logro aunque la cifra fuera errada", "Porque nadie midió después la montaña", "Porque ganó un premio en dinero de un periódico de Lima"],
    ["¿Qué recuerda hoy su ascenso?", "La cumbre norte lleva su nombre.", "Una calle de Huaraz.", "Un monumento en la plaza de Huaraz con su retrato."]),
];

// --- Documentos formales -------------------------------------------------------------

const DOCUMENTS = [
  read("Oficio", "📄", "OFICIO N.° 045-2025-IE-JCM\nSeñor: Jefe de la Unidad de Gestión Educativa Local\nAsunto: Solicito capacitación en primeros auxilios\nTengo el agrado de dirigirme a usted para solicitarle la programación de un taller de primeros auxilios para los docentes de nuestra institución, en el marco del plan de gestión del riesgo. Sin otro particular, me despido.\nAtentamente,\nLa directora",
    ["¿Qué indica la línea «Asunto»?", "El tema central del documento", "El nombre de quien firma", "La fecha de la reunión"],
    ["¿Quién envía el oficio y a quién?", "La directora del colegio al jefe de la UGEL", "Un alumno a sus padres", "La UGEL a los alumnos de quinto de secundaria"],
    ["¿Qué tono usa el documento?", "Formal y cortés", "Familiar y bromista", "Agresivo"]),
  read("Solicitud", "✍️", "SOLICITO: Constancia de estudios\nSeñor director de la I. E. San Martín:\nYo, Lucía Quispe Mamani, identificada con DNI N.° 71234567, alumna del 4.° grado de secundaria, ante usted me presento y expongo: que, para postular a una beca, necesito una constancia de estudios. Por lo expuesto, solicito a usted acceder a mi pedido.\nHuancayo, 3 de abril de 2025\nLucía Quispe Mamani",
    ["¿Qué parte del texto resume el pedido?", "La sumilla «SOLICITO: Constancia de estudios»", "La fecha", "El número de DNI de la alumna que solicita"],
    ["¿Qué sección explica las razones?", "La que empieza con «expongo»", "La firma", "La línea con la fecha y el lugar"],
    ["¿Para qué necesita la constancia?", "Para postular a una beca", "Para viajar", "Para cambiarse de colegio"]),
  read("Acta de reunión", "🗒️", "ACTA N.° 3 – Comité de aula de 4.° B\nEn Arequipa, siendo las 6:00 p. m. del 10 de mayo, se reunieron los padres de familia del aula. Agenda: 1) paseo de fin de año; 2) aporte para el periódico mural. Acuerdos: 1) el paseo será al valle del Colca; 2) cada familia aportará 5 soles. Siendo las 7:15 p. m., se levantó la sesión y firmaron los asistentes.",
    ["¿Para qué sirve un acta?", "Para dejar constancia de lo tratado y acordado", "Para invitar a una fiesta", "Para invitar a los padres a una actividad del colegio"],
    ["¿Qué se acordó sobre el periódico mural?", "Un aporte de 5 soles por familia", "Hacerlo en el Colca", "Hacerlo en el valle del Colca durante el paseo"],
    ["¿Qué indica «se levantó la sesión»?", "Que la reunión terminó", "Que todos se pusieron de pie para cantar", "Que empezó la reunión"]),
  read("Comunicado", "📢", "COMUNICADO\nLa Municipalidad Distrital de Miraflores informa a los vecinos que, por trabajos de mantenimiento de redes, el servicio de agua se suspenderá el jueves 12 de junio de 8:00 a. m. a 4:00 p. m. en las zonas A y B. Se recomienda almacenar agua con anticipación. Agradecemos su comprensión.",
    ["¿Cuál es el propósito del comunicado?", "Informar de un corte de agua y recomendar precauciones", "Vender tanques de agua", "Vender tanques de agua a los vecinos de las zonas A y B"],
    ["¿Qué recomienda a los vecinos?", "Almacenar agua con anticipación", "No usar agua nunca más", "Ir a la municipalidad a recoger agua en baldes"],
    ["¿Qué datos precisos da?", "Día, horario y zonas afectadas", "El costo de la obra", "El nombre del alcalde y de sus regidores"]),
];

export const ROWS: Row[] = [
  ["retorica-1", (r) => readPassage(r, RHETORIC_1, false)],
  ["retorica-2", (r) => readPassage(r, RHETORIC_2, false)],
  ["desarrollo-1", (r) => readPassage(r, DEVELOPMENT_1, false)],
  ["desarrollo-2", (r) => readPassage(r, DEVELOPMENT_2, false)],
  ["argumentos-1", (r) => readPassage(r, ARGS_1, false)],
  ["argumentos-2", (r) => readPassage(r, ARGS_2, false)],
  ["perros-hambrientos", (r) => readPassage(r, NOVEL_1, false)],
  ["na-catita", (r) => readPassage(r, DRAMA_1, false)],
  ["annie-peck", (r) => readPassage(r, NONFICTION_1, false)],
  ["documentos", (r) => readPassage(r, DOCUMENTS, false)],
];
