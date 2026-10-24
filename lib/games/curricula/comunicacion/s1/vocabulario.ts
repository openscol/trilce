import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import { abcOrder, f, pool, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 1.° de Secundaria · banco de vocabulario: prefijos (mal-, des-, in-, im-, i-,
// no, a-, an-, sin-) y sufijos (-oso, -able, -ible), raíces griegas y latinas,
// sinónimos y antónimos, homófonos, matices, analogías y contexto.


const means = (word: string, a: string, ...d: string[]) => w(`¿Qué significa «${word}»?`, a, ...d);

// --- Prefijos y sufijos ---------------------------------------------------

const PRE: ChoiceItem[] = [
  means("premeditado", "Pensado con anticipación", "Hecho sin pensar, de forma improvisada", "Muy rápido"), means("prehistoria", "Período anterior a la escritura", "Historia que se cuenta después de un hecho", "Historia falsa"),
  means("precalentar", "Calentar antes de usar", "Calentar dos veces seguidas lo mismo", "Enfriar"), means("preconcebido", "Formado antes de conocer los hechos", "Pensado después de estudiar todo con calma", "Nuevo"),
  f("Revisa el ___ de la película antes de ir al cine.", "preestreno", "reestreno", "estreno"), f("Los científicos lograron ___ la erupción con días de anticipación.", "predecir", "maldecir", "desdecir"),
  f("Hay que ___ los gastos del viaje antes de salir.", "prever", "rever", "ver"), f("Firmó un acuerdo ___ antes del contrato final.", "preliminar", "eliminar", "liminar"),
];
const RE: ChoiceItem[] = [
  means("reformular", "Volver a plantear algo de otra manera", "Formular algo por primera vez", "Olvidar"), means("recaer", "Volver a enfermar de lo mismo", "Caer por primera vez", "Sanarse"),
  means("reencuentro", "Encuentro de quienes estaban separados", "Primer encuentro entre dos desconocidos", "Despedida"), means("replantear", "Volver a plantear un asunto", "Plantar árboles en un bosque nuevo", "Aceptar"),
  f("Después del terremoto tuvieron que ___ la iglesia.", "reconstruir", "destruir", "construir"), f("El alcalde quiere que lo ___ para otro período.", "reelijan", "elijan", "desaprueben"),
  f("La biblioteca se va a ___ después de las reparaciones.", "reabrir", "abrir", "cerrar"), f("Mi ensayo tiene errores; lo voy a ___ desde el principio.", "rehacer", "deshacer", "hacer"),
];
const SUB: ChoiceItem[] = [
  means("subestimar", "Dar menos valor del que tiene", "Valorar algo más de lo que merece", "Querer"), means("subsuelo", "Capa que está debajo de la superficie del suelo", "Piso más alto de un edificio", "Alfombra"),
  means("subcampeón", "Quien queda segundo en una competencia", "Quien gana el primer puesto", "Árbitro"), means("subdesarrollo", "Desarrollo por debajo de lo necesario", "Desarrollo superior al de otros países", "Progreso"),
  f("El metro de Lima tendrá una línea ___.", "subterránea", "terrestre", "aérea"), f("Las películas extranjeras suelen tener ___ en castellano.", "subtítulos", "títulos", "sobretítulos"),
  f("Debes ___ las ideas principales del texto.", "subrayar", "rayar", "sobrerrayar"), f("El ___ exploró el fondo del mar de Grau.", "submarino", "marino", "ultramarino"),
];
const MAL: ChoiceItem[] = [
  means("malversar", "Usar mal el dinero que otro confía", "Escribir versos de mala calidad", "Ahorrar"), means("malentendido", "Mala interpretación de lo que se dijo", "Algo que todos entendieron muy bien", "Secreto"),
  means("malherido", "Gravemente herido", "Herido de forma leve y sin importancia", "Sano"), means("malhumorado", "Que está de mal humor", "Que siempre está alegre y contento", "Gracioso"),
  f("No debes ___ el agua: es un recurso escaso.", "malgastar", "gastar", "desaprovecharse"), f("Las lluvias pueden ___ la cosecha de papa.", "malograr", "lograr", "relograr"),
  f("Está prohibido ___ a los animales.", "maltratar", "tratar", "contratratar"), f("Es un niño ___: nunca le dicen que no.", "malcriado", "criado", "recriado"),
];
const NEG: ChoiceItem[] = [
  means("deshonesto", "Que no es honrado", "Que es muy honrado y sincero", "Callado"), means("ilegal", "Contrario a la ley", "Que cumple todas las leyes", "Moderno"),
  means("impune", "Que queda sin castigo", "Que recibió un castigo muy severo", "Inocente"), means("inédito", "Que no ha sido publicado", "Que ha sido publicado muchas veces", "Viejo"),
  f("Los manifestantes defendían la ___ violencia.", "no", "des", "in"), f("Cruzar con la luz roja es ___.", "imprudente", "prudente", "desprudente"),
  f("Entre los dos grupos hubo un ___ sobre las reglas.", "desacuerdo", "acuerdo", "inacuerdo"), f("El camino era ___: lleno de baches y curvas.", "irregular", "regular", "desregular"),
];
const OSO: ChoiceItem[] = [
  means("minucioso", "Que se fija en los detalles", "Que trabaja rápido y sin cuidado", "Pequeño"), means("caudaloso", "Que lleva mucha agua", "Que está casi seco en verano", "Frío"),
  means("pretencioso", "Que presume de lo que no es", "Que es humilde y sencillo", "Valiente"), means("riguroso", "Muy exacto y estricto", "Descuidado y poco exigente", "Rápido"),
  f("El Amazonas es el río más ___ del mundo.", "caudaloso", "caudal", "caudalista"), f("Es un alumno ___: siempre repasa sus apuntes.", "estudioso", "estudiante", "estudiado"),
  f("Su plan era muy ___: quería conquistar el mundo.", "ambicioso", "ambición", "ambicionado"), f("El escándalo fue tan ___ que salió en las noticias.", "escandaloso", "escándalo", "escandalizado"),
];
const SIN: ChoiceItem[] = [
  means("anónimo", "Sin nombre conocido", "Con el nombre escrito en grande", "Famoso"), means("analfabeto", "Que no sabe leer ni escribir", "Que sabe leer en varias lenguas", "Profesor"),
  means("asimétrico", "Sin simetría", "Con las dos mitades exactamente iguales", "Redondo"), means("sinsabor", "Disgusto o pena", "Comida muy sabrosa y condimentada", "Alegría"),
  f("Una persona ___ no se interesa por la política.", "apolítica", "política", "politizada"), f("Recibió una carta ___: no tenía firma.", "anónima", "firmada", "nominal"),
  f("Pasó un ___ de problemas antes de lograrlo.", "sinfín", "fin", "final"), f("Castigarlo sin pruebas fue una ___.", "sinrazón", "razón", "razonable"),
];
const ABLE: ChoiceItem[] = [
  means("perecible", "Que se echa a perder pronto", "Que dura muchos años sin dañarse", "Caro"), means("irreversible", "Que no se puede volver atrás", "Que se puede deshacer fácilmente", "Lento"),
  means("imprescindible", "Que no se puede dejar de lado", "Que no es necesario para nada", "Barato"), means("incorruptible", "Que no se deja sobornar", "Que acepta sobornos con facilidad", "Sucio"),
  f("La energía solar es una fuente ___.", "inagotable", "agotada", "agotadora"), f("El desarrollo ___ cuida el ambiente para el futuro.", "sostenible", "sostenido", "sosteniente"),
  f("El choque era ___: el chofer iba muy rápido.", "inevitable", "evitado", "evitante"), f("Necesitamos una fuente ___ para el informe.", "confiable", "confiada", "confiante"),
];

// --- Raíces griegas y latinas -----------------------------------------------

const ROOT_CLUES: ChoiceItem[] = [
  pt("Usa la raíz como pista: ¿qué significa «cronómetro»?", "La raíz griega «crono» significa «tiempo».", "Instrumento que mide el tiempo", "Instrumento que mide la temperatura", "Calendario"),
  pt("Usa la raíz como pista: ¿qué significa «hidrografía»?", "La raíz griega «hidro» significa «agua».", "Descripción de las aguas de una región", "Descripción de las montañas de una región", "Mapa"),
  pt("Usa la raíz como pista: ¿qué significa «benefactor»?", "La raíz latina «bene» significa «bien».", "Persona que hace el bien a otros", "Persona que causa daño a los demás", "Juez"),
  pt("Usa la raíz como pista: ¿qué significa «omnívoro»?", "La raíz latina «omni» significa «todo».", "Que come de todo", "Que solo come plantas", "Que no come"),
  pt("Usa la raíz como pista: ¿qué significa «fotosensible»?", "La raíz griega «foto» significa «luz».", "Sensible a la luz", "Sensible al ruido", "Que toma fotos"),
  pt("Usa la raíz como pista: ¿qué significa «pedestre»?", "La raíz latina «ped» significa «pie».", "Que anda a pie", "Que viaja en avión", "Que se cae"),
  pt("Usa la raíz como pista: ¿qué significa «antropología»?", "La raíz griega «antropo» significa «ser humano».", "Estudio del ser humano", "Estudio de las plantas", "Estudio del cielo"),
  pt("Usa la raíz como pista: ¿qué significa «manuscrito»?", "La raíz latina «manu» significa «mano».", "Escrito a mano", "Escrito a máquina", "Leído en voz alta"),
];
const WORDS_TO_ROOT: ChoiceItem[] = [
  w("Piensa en «audición», «auditorio» y «audible». ¿Qué significa la raíz «aud»?", "oír", "ver", "hablar"), w("Piensa en «biología», «biografía» y «antibiótico». ¿Qué significa la raíz «bio»?", "vida", "libro", "muerte"),
  w("Piensa en «teléfono», «telescopio» y «televisión». ¿Qué significa la raíz «tele»?", "lejos", "cerca", "imagen"), w("Piensa en «visible», «visión» y «revisar». ¿Qué significa la raíz «vis»?", "ver", "oír", "tocar"),
  w("Piensa en «geografía», «geología» y «geometría». ¿Qué significa la raíz «geo»?", "tierra", "agua", "fuego"), w("Piensa en «portátil», «exportar» y «transporte». ¿Qué significa la raíz «port»?", "llevar", "abrir", "cerrar"),
  w("Piensa en «dictado», «predecir» y «diccionario». ¿Qué significa la raíz «dic»?", "decir", "escribir", "contar"), w("Piensa en «psicología», «psiquiatra» y «psíquico». ¿Qué significa la raíz «psico»?", "mente", "cuerpo", "sangre"),
];
const ROOT_MEANING = pool(([
  ["fono", "sonido"], ["grafo", "escritura"], ["logo", "estudio o palabra"], ["filo", "amor o afición"], ["micro", "pequeño"], ["macro", "grande"],
  ["poli", "muchos"], ["mono", "uno"], ["termo", "calor"], ["metro", "medida"], ["scopio", "instrumento para ver"], ["cardio", "corazón"],
] as [string, string][]).map(([root, a]) => [`¿Qué significa la raíz «${root}»?`, a] as [string, string]), "p");
const ROOT_WORDS: ChoiceItem[] = [
  means("filántropo", "Persona que ama y ayuda a la humanidad", "Persona que odia a la humanidad", "Filósofo"), means("cardiólogo", "Médico especialista en el corazón", "Médico especialista en los huesos", "Enfermero"),
  means("polígloto", "Que habla muchas lenguas", "Que habla una sola lengua", "Callado"), means("microscópico", "Tan pequeño que solo se ve con microscopio", "Enorme y fácil de ver a simple vista", "Ruidoso"),
  means("monólogo", "Discurso de una sola persona", "Conversación entre muchas personas", "Silencio"), means("termómetro", "Instrumento que mide la temperatura", "Instrumento que mide la distancia", "Reloj"),
  means("caligrafía", "Arte de escribir con letra bella", "Arte de dibujar mapas del mundo", "Lectura"), means("fonología", "Estudio de los sonidos de una lengua", "Estudio de los colores de la pintura", "Música"),
];

// --- Sinónimos y antónimos ----------------------------------------------------

const SYN = (sentence: string, word: string, a: string, ...d: string[]) => pt(`¿Qué palabra es sinónimo de «${word}»?`, sentence, a, ...d);
const SYNONYMS: ChoiceItem[] = [
  SYN("La historia era verosímil: podía haber ocurrido.", "verosímil", "creíble", "increíble", "verde"), SYN("Su respuesta fue tajante.", "tajante", "categórica", "dudosa", "cortada"),
  SYN("Era un hombre parco al hablar.", "parco", "moderado", "exagerado", "pardo"), SYN("La niña era muy perspicaz.", "perspicaz", "aguda", "torpe", "perezosa"),
  SYN("El viaje fue efímero.", "efímero", "breve", "eterno", "famoso"), SYN("Hubo un júbilo general tras el gol.", "júbilo", "alegría", "tristeza", "juicio"),
  SYN("El orador fue elocuente.", "elocuente", "expresivo", "torpe", "lento"), SYN("Encontró un tesoro recóndito.", "recóndito", "oculto", "visible", "redondo"),
];
const ANT = (sentence: string, word: string, a: string, ...d: string[]) => pt(`¿Qué palabra es antónimo de «${word}»?`, sentence, a, ...d);
const ANTONYMS: ChoiceItem[] = [
  ANT("Es un estudiante diligente.", "diligente", "negligente", "cuidadoso", "inteligente"), ANT("La tela es opaca.", "opaca", "transparente", "oscura", "gruesa"),
  ANT("Su opinión era objetiva.", "objetiva", "subjetiva", "imparcial", "corta"), ANT("El suelo era fértil.", "fértil", "estéril", "productivo", "húmedo"),
  ANT("Fue una victoria efímera.", "efímera", "duradera", "breve", "fácil"), ANT("Es una persona humilde.", "humilde", "soberbia", "sencilla", "húmeda"),
  ANT("La ley fue abolida.", "abolida", "instaurada", "suprimida", "leída"), ANT("Hizo un comentario superfluo.", "superfluo", "esencial", "innecesario", "superior"),
];

// --- Homófonos ----------------------------------------------------------------

const HOMOPHONE_USE: ChoiceItem[] = [
  f("Se rompió el ___ del agua.", "tubo", "tuvo", "tuvó"), f("Ella ___ que viajar a Puno.", "tuvo", "tubo", "tuvó"),
  f("El niño se ___ de la bicicleta.", "cayó", "calló", "callo"), f("Cuando entró el director, todo el salón se ___.", "calló", "cayó", "cayo"),
  f("Mañana vamos a ___ por el nuevo delegado.", "votar", "botar", "bótar"), f("No debes ___ la basura en la calle.", "botar", "votar", "vótar"),
  f("Mi abuela me enseñó a ___ botones.", "coser", "cocer", "cosser"), f("Hay que ___ las papas veinte minutos.", "cocer", "coser", "cosser"),
  f("La ___ sube por el tronco del árbol.", "savia", "sabia", "sávia"), f("Mi abuela es una mujer muy ___.", "sabia", "savia", "sábia"),
  f("No pises la ___ del parque.", "hierba", "hierva", "yerva"), f("Espera a que el agua ___ para echar los fideos.", "hierva", "hierba", "yerba"),
];
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt("¿Qué significa «vello» en la oración?", "«Tenía vello en los brazos».", "Pelo fino del cuerpo", "Hermoso", "Pluma"), pt("¿Qué significa «bello» en la oración?", "«Es un bello paisaje».", "Hermoso", "Pelo fino del cuerpo", "Viejo"),
  pt("¿Qué significa «rallar» en la oración?", "«Hay que rallar el queso».", "Desmenuzar con un rallador", "Hacer rayas con un lápiz", "Cortar"), pt("¿Qué significa «rayar» en la oración?", "«No rayes la carpeta».", "Hacer rayas", "Desmenuzar con un rallador", "Limpiar"),
  pt("¿Qué significa «abrasar» en la oración?", "«El sol del desierto abrasa».", "Quemar", "Rodear con los brazos", "Enfriar"), pt("¿Qué significa «abrazar» en la oración?", "«Corrió a abrazar a su madre».", "Rodear con los brazos", "Quemar", "Saludar con la mano"),
  pt("¿Qué significa «grabar» en la oración?", "«Vamos a grabar un video».", "Registrar imágenes o sonidos", "Poner un impuesto", "Borrar"), pt("¿Qué significa «gravar» en la oración?", "«El Estado decidió gravar las bebidas azucaradas».", "Poner un impuesto", "Registrar imágenes o sonidos", "Prohibir"),
];
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  w("¿En qué oración «ciervo» significa «animal rumiante con cuernos»?", "Un ciervo cruzó el bosque.", "El siervo obedecía a su señor.", "El ciervo de la gleba trabajaba la tierra."),
  w("¿En qué oración «siervo» significa «persona sometida a un señor»?", "El siervo trabajaba la tierra de su señor.", "El siervo comía hierba en el bosque.", "Vimos un siervo con grandes cuernos."),
  w("¿En qué oración «ola» significa «onda del mar»?", "Una ola enorme mojó a los bañistas.", "¡Hola! ¿Cómo estás, vecina? ¿Ya llegaste de la playa?", "Le dijo ola a su vecina."),
  w("¿En qué oración «haya» significa «forma del verbo haber»?", "Espero que haya pan.", "Ojalá que lo halla encontrado.", "Allá está tu mochila."),
  w("¿En qué oración «halla» significa «encuentra»?", "Si halla las llaves, avísame.", "Ojalá que no halla tráfico en la carretera central.", "Puede que halla llovido."),
  w("¿En qué oración «baya» significa «fruto pequeño y carnoso»?", "El aguaymanto es una baya dorada.", "Vaya con cuidado.", "Saltó la valla del parque."),
  w("¿En qué oración «valla» significa «cerco»?", "Pusieron una valla alrededor de la obra.", "Vaya usted primero.", "La baya del arbusto es roja."),
  w("¿En qué oración «hecho» significa «suceso»?", "Fue un hecho histórico.", "Lo echó de la casa.", "Echo de menos a mi abuela."),
];

// --- Elección de las palabras --------------------------------------------------

const DIFFERENCE: ChoiceItem[] = [
  w("¿Cuál es la diferencia entre «mirar» y «observar»?", "Observar es mirar con atención y detenimiento.", "Mirar es más atento y detallado que observar.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «oír» y «escuchar»?", "Escuchar es oír prestando atención.", "Oír es prestar atención; escuchar es percibir sin querer.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «caminar» y «deambular»?", "Deambular es caminar sin rumbo fijo.", "Deambular es caminar muy rápido y con un destino claro.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «pedir» y «exigir»?", "Exigir es pedir con fuerza, como un derecho.", "Pedir es más fuerte y autoritario que exigir.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «comer» y «degustar»?", "Degustar es probar con atención al sabor.", "Degustar es comer muy rápido y en grandes cantidades.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «hablar» y «murmurar»?", "Murmurar es hablar en voz muy baja.", "Murmurar es hablar gritando para que todos oigan.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «enojado» y «furioso»?", "Furioso indica un enojo mucho más intenso.", "Enojado indica un enojo más intenso que furioso.", "No hay diferencia."),
  w("¿Cuál es la diferencia entre «antiguo» y «viejo»?", "Antiguo suele tener un matiz de valor; viejo, de desgaste.", "Viejo siempre tiene un matiz de valor histórico.", "No hay diferencia."),
];
const CONN = sorter(["Connotación positiva", "Connotación negativa"], "¿Qué connotación tiene la palabra en MAYÚSCULAS?");
const CONNOTATION: ChoiceItem[] = [
  ...["Es una persona AHORRATIVA.", "Mi vecino es muy PERSEVERANTE.", "Tiene una mirada CURIOSA.", "Es un líder FIRME.", "Su casa es ACOGEDORA.", "Es un niño INQUIETO por aprender."].map((x) => CONN(x, 0)),
  ...["Es una persona TACAÑA.", "Mi vecino es muy TERCO.", "Tiene una mirada ENTROMETIDA.", "Es un líder AUTORITARIO.", "Su casa es ESTRECHA.", "Es un niño REVOLTOSO."].map((x) => CONN(x, 1)),
];

// --- Analogías ------------------------------------------------------------------

const ANALOGY: ChoiceItem[] = [
  f("Pluma es a ave como escama es a ___.", "pez", "piel", "árbol"), f("Quena es a soplar como cajón es a ___.", "golpear", "cantar", "frotar"),
  f("Juez es a sentencia como médico es a ___.", "diagnóstico", "hospital", "enfermo"), f("Costa es a desierto como selva es a ___.", "bosque", "nieve", "playa"),
  f("Libro es a capítulo como poema es a ___.", "estrofa", "novela", "poemario completo"), f("Alpaca es a lana como gusano de seda es a ___.", "seda", "hoja", "capullo de algodón"),
  f("Termómetro es a temperatura como balanza es a ___.", "peso", "altura", "kilómetro"), f("Arquitecto es a planos como compositor es a ___.", "partituras", "pinceles", "instrumentos de cuerda"),
];
const ANALOGY_HARD: ChoiceItem[] = [
  f("Efímero es a duradero como escaso es a ___.", "abundante", "poco", "breve"), f("Semilla es a árbol como oruga es a ___.", "mariposa", "hoja", "nido"),
  f("Inca es a Tahuantinsuyo como faraón es a ___.", "Egipto", "pirámide", "Roma"), f("Prólogo es a libro como obertura es a ___.", "ópera", "teatro", "final"),
  f("Sequía es a agua como hambruna es a ___.", "alimento", "calor", "lluvia"), f("Huaico es a lodo como avalancha es a ___.", "nieve", "agua", "viento"),
  f("Cobarde es a valentía como ignorante es a ___.", "conocimiento", "miedo", "escuela"), f("Cincel es a escultor como bisturí es a ___.", "cirujano", "carpintero", "pintor"),
];

// --- Claves de contexto ----------------------------------------------------------

const FIND_WORD: ChoiceItem[] = [
  f("El testigo dio una versión tan ___ que nadie le creyó.", "incoherente", "precisa", "verídica"), f("Tras tres días sin comer, el perro estaba ___.", "famélico", "satisfecho", "obeso"),
  f("La biblioteca ___ más de diez mil libros.", "alberga", "expulsa", "ignora"), f("El clima de la puna es ___: frío de noche y caluroso al mediodía.", "extremo", "templado", "estable"),
  f("Su discurso fue tan ___ que muchos lloraron.", "conmovedor", "aburrido", "breve"), f("El acusado se mostró ___: no dijo una sola palabra.", "hermético", "conversador", "alegre"),
  f("El volcán permanece ___, pero podría despertar.", "inactivo", "furioso", "extinto"), f("La ciudad sufre una ___ de agua por la sequía.", "escasez", "abundancia", "inundación"),
];
const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «sosegado»? (Busca un sinónimo en la oración).", "El lago estaba sosegado, tranquilo como un espejo.", "Tranquilo", "Agitado", "Profundo"),
  pt("¿Qué significa «exiguo»? (Busca un sinónimo en la oración).", "El sueldo era exiguo, tan escaso que no alcanzaba para nada.", "Escaso", "Abundante", "Alto"),
  pt("¿Qué significa «osado»? (Busca un sinónimo en la oración).", "Fue un plan osado, es decir, atrevido.", "Atrevido", "Prudente", "Antiguo"),
  pt("¿Qué significa «lóbrego»? (Busca un sinónimo en la oración).", "El pasillo era lóbrego y sombrío.", "Sombrío", "Luminoso", "Largo"),
  pt("¿Qué significa «perenne»? (Busca un sinónimo en la oración).", "Su recuerdo será perenne, eterno.", "Eterno", "Pasajero", "Triste"),
  pt("¿Qué significa «nimio»? (Busca un sinónimo en la oración).", "Discutieron por un detalle nimio, insignificante.", "Insignificante", "Importante", "Nuevo"),
];
const ANT_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «locuaz»? (Busca un antónimo en la oración).", "A diferencia de su hermano callado, Juan es locuaz.", "Que habla mucho", "Que nunca habla", "Que es alto"),
  pt("¿Qué significa «austero»? (Busca un antónimo en la oración).", "No era derrochador, sino austero.", "Que gasta poco", "Que gasta mucho", "Que es rico"),
  pt("¿Qué significa «pusilánime»? (Busca un antónimo en la oración).", "El héroe era valiente; su rival, pusilánime.", "Cobarde", "Valiente", "Fuerte"),
  pt("¿Qué significa «diáfano»? (Busca un antónimo en la oración).", "El agua del río era turbia, pero la del manantial era diáfana.", "Transparente", "Turbia", "Fría"),
  pt("¿Qué significa «fugaz»? (Busca un antónimo en la oración).", "Su fama no fue duradera, sino fugaz.", "Breve", "Duradera", "Famosa"),
  pt("¿Qué significa «afable»? (Busca un antónimo en la oración).", "El director era áspero; la subdirectora, en cambio, afable.", "Amable", "Áspera", "Seria"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «ostentar»?", "Le gustaba ostentar su celular nuevo frente a todos.", "Mostrar con orgullo", "Esconder con vergüenza", "Vender"),
  pt("¿Qué significa «paliar»?", "El gobierno envió frazadas para paliar el frío en las zonas altas.", "Aliviar", "Aumentar", "Medir"),
  pt("¿Qué significa «inminente»?", "Las nubes negras anunciaban una tormenta inminente.", "Que está a punto de ocurrir", "Que ocurrió hace mucho", "Que nunca ocurrirá"),
  pt("¿Qué significa «sucinto»?", "El informe fue sucinto: apenas una página.", "Breve", "Extenso", "Confuso"),
  pt("¿Qué significa «menoscabar»?", "Los rumores intentaron menoscabar su reputación.", "Dañar o disminuir", "Mejorar", "Celebrar"),
  pt("¿Qué significa «exhaustivo»?", "Hicieron un análisis exhaustivo: revisaron cada dato.", "Completo y detallado", "Rápido y superficial", "Cansado"),
  pt("¿Qué significa «reticente»?", "Se mostró reticente a contar lo ocurrido; apenas respondía.", "Que se resiste a hacer algo", "Que habla con mucho entusiasmo", "Que olvida"),
  pt("¿Qué significa «vetusto»?", "La vetusta casona del centro tenía más de doscientos años.", "Muy antiguo", "Nuevo", "Grande"),
];
const ACADEMIC_LIT: ChoiceItem[] = [
  f("El ___ del cuento ocurre cuando el protagonista descubre la verdad.", "clímax", "título", "índice"), f("El ___ cuenta la historia desde fuera, sin participar.", "narrador omnisciente", "protagonista", "antagonista"),
  f("El ___ se opone al protagonista.", "antagonista", "narrador", "lector"), f("El ___ es el lugar y tiempo donde ocurre la historia.", "escenario", "desenlace", "argumento"),
  f("En el ___ se resuelve el conflicto.", "desenlace", "inicio", "título"), f("La ___ es una historia breve con una enseñanza, protagonizada por animales.", "fábula", "novela", "oda"),
  f("La ___ adelanta lo que sucederá más tarde en la historia.", "anticipación", "conclusión", "dedicatoria"), f("El ___ es la idea central que el autor quiere transmitir.", "tema", "escenario", "narrador"),
];
const ACADEMIC_INFO: ChoiceItem[] = [
  f("El autor presenta una ___ y luego la defiende con argumentos.", "tesis", "fábula", "rima"), f("Los datos del gráfico ___ la hipótesis.", "respaldan", "rimaron", "narran"),
  f("El texto ___ las ventajas y desventajas de cada opción.", "contrasta", "rima", "desordena al azar"), f("La ___ de la investigación fue un grupo de 200 alumnos.", "muestra", "moraleja", "estrofa"),
  f("Al final del informe, la autora ___ que el proyecto es viable.", "concluye", "rima", "inventa"), f("Primero, el artículo ___ el problema; después, propone soluciones.", "plantea", "esconde", "canta"),
  f("Las ___ se colocan al final del trabajo en formato APA.", "referencias", "moralejas", "dedicatorias finales"), f("El científico ___ sus resultados en una revista.", "publicó", "rimó", "narró"),
];

// --- Vocabulario de las áreas -----------------------------------------------------

const DOMAIN = pool([
  ["🌋 Abertura por donde sale la lava de un volcán", "cráter"], ["🧫 Unidad más pequeña de los seres vivos", "célula"], ["🌡️ Capa de gases que rodea la Tierra", "atmósfera"], ["🗳️ Votación en la que el pueblo aprueba o rechaza una ley", "referéndum"],
  ["📈 Aumento general y sostenido de los precios", "inflación"], ["🔺 Triángulo con los tres lados iguales", "equilátero"], ["🌱 Proceso con que las plantas fabrican su alimento con luz", "fotosíntesis"], ["🧲 Fuerza de atracción entre ciertos metales", "magnetismo"],
  ["🏺 Ciencia que estudia el pasado a partir de restos materiales", "arqueología"], ["🌍 Línea imaginaria que divide la Tierra en dos hemisferios", "ecuador"],
]);

// --- Uso del diccionario -------------------------------------------------------

const ABC = [["proceso", "procurar", "prodigio", "producir", "profundo"], ["descubrir", "desdén", "desear", "desfile", "deshacer"], ["insistir", "inspirar", "instalar", "instinto", "instruir"], ["paralelo", "parámetro", "parcial", "parecer", "pariente"], ["contraste", "contribuir", "control", "convenio", "convertir"], ["sobrar", "sobre", "sobrino", "sociedad", "socorro"]];
const GUIDE = (a: string, b: string, ans: string, ...d: string[]) => w(`Las palabras guía de la página son «${a}» y «${b}». ¿Qué palabra está en esa página?`, ans, ...d);
const GUIDE_WORDS: ChoiceItem[] = [
  GUIDE("lámpara", "lazo", "latitud", "lealtad", "ladrillo", "lago"), GUIDE("mensaje", "metal", "mérito", "mezcla", "menor", "mendigo"),
  GUIDE("patio", "pecado", "pausa", "pedal", "pasto", "pata"), GUIDE("carta", "castillo", "casa", "catedral", "carro", "cargo"),
  GUIDE("régimen", "relato", "reino", "rémora", "refugio", "recibo"), GUIDE("tierra", "tobillo", "tinta", "todo", "tiempo", "tiburón"),
  GUIDE("fábula", "fallo", "faena", "fama", "fábrica", "fabada"), GUIDE("nube", "nutria", "número", "ñandú", "novela", "nobleza"),
];
const ENTRY = "cauce s. m. 1. Lecho de un río. 2. Camino o procedimiento para lograr algo: Buscaron un cauce legal para su reclamo. Der. encauzar.";
const ENTRY2 = "sagaz adj. Que es astuto y prevé las cosas: Un detective sagaz. Pl. sagaces. Sin. perspicaz, astuto. Ant. ingenuo.";
const ENTRY3 = "estación s. f. 1. Cada una de las cuatro partes del año. 2. Lugar donde paran los trenes o buses. 3. Instalación con aparatos para observar algo: estación meteorológica. 4. Emisora de radio.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «cauce»?", ENTRY, "Sustantivo masculino", "Verbo transitivo", "Adjetivo"), pt("Según la entrada, ¿cuántas acepciones tiene «cauce»?", ENTRY, "Dos", "Tres", "Una"),
  pt("Según la entrada, ¿qué palabra deriva de «cauce»?", ENTRY, "encauzar", "cauce legal", "lecho"), pt("Según la entrada, ¿cuál es el plural de «sagaz»?", ENTRY2, "sagaces", "sagazes", "sagaz"),
  pt("Según la entrada, ¿cuál es un antónimo de «sagaz»?", ENTRY2, "ingenuo", "astuto", "perspicaz"), pt("Según la entrada, ¿qué clase de palabra es «sagaz»?", ENTRY2, "Adjetivo", "Sustantivo", "Verbo"),
  pt("Según la entrada, ¿para qué sirve «Un detective sagaz»?", ENTRY2, "Es un ejemplo de uso", "Es la definición de la palabra", "Es un antónimo de la palabra"), pt("Según la entrada, ¿qué indica «s. f.»?", ENTRY3, "Sustantivo femenino", "Sinónimo frecuente", "Sílaba final"),
];
const WHICH = "¿Qué acepción corresponde a la oración?";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY}\n\n«En verano, el cauce del Rímac crece».`, "La acepción 1", "La acepción 2", "Ninguna"), pt(WHICH, `${ENTRY}\n\n«El reclamo siguió su cauce en la municipalidad».`, "La acepción 2", "La acepción 1", "Ninguna"),
  pt(WHICH, `${ENTRY3}\n\n«La primavera es mi estación favorita».`, "La acepción 1", "La acepción 2", "La acepción 4"), pt(WHICH, `${ENTRY3}\n\n«Bajamos en la estación Central del Metropolitano».`, "La acepción 2", "La acepción 1", "La acepción 3"),
  pt(WHICH, `${ENTRY3}\n\n«La estación meteorológica registró 2 °C».`, "La acepción 3", "La acepción 2", "La acepción 4"), pt(WHICH, `${ENTRY3}\n\n«Sintonizo una estación de música criolla».`, "La acepción 4", "La acepción 1", "La acepción 3"),
];
const THES = "DICCIONARIO DE SINÓNIMOS\nvaliente adj. Sin. audaz, intrépido, osado, temerario, aguerrido. Ant. cobarde, temeroso.";
const THES2 = "DICCIONARIO DE SINÓNIMOS\ndecir v. Sin. afirmar, declarar, susurrar, proclamar, confesar. Ant. callar, omitir.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué sinónimo de «valiente» conviene para alguien que se arriesga sin medir el peligro?", THES, "temerario", "aguerrido", "cobarde"), pt("Según la entrada, ¿qué sinónimo conviene para un soldado con experiencia en la guerra?", THES, "aguerrido", "temerario", "temeroso"),
  pt("Según la entrada, ¿cuál es un antónimo de «valiente»?", THES, "temeroso", "intrépido", "osado"), pt("Según la entrada, ¿qué sinónimo de «decir» conviene para hablar en voz muy baja?", THES2, "susurrar", "proclamar", "callar"),
  pt("Según la entrada, ¿qué sinónimo conviene para anunciar algo públicamente y con solemnidad?", THES2, "proclamar", "susurrar", "omitir"), pt("Según la entrada, ¿qué sinónimo conviene en «El acusado ___ su culpa»?", THES2, "confesó", "susurró", "calló"),
  pt("Según la entrada, ¿cuál es un antónimo de «decir»?", THES2, "callar", "afirmar", "declarar"), pt("¿Por qué conviene leer todos los sinónimos antes de elegir uno?", THES, "Porque cada uno tiene un matiz propio", "Porque el primero siempre es incorrecto", "Porque son antónimos"),
];

export const ROWS: Row[] = [
  ["prefijos-1", (r) => choose(r, "Completa la oración.", PRE)],
  ["prefijos-2", (r) => choose(r, "Completa la oración.", RE)],
  ["prefijos-3", (r) => choose(r, "Completa la oración.", SUB)],
  ["prefijos-4", (r) => choose(r, "Completa la oración.", MAL)],
  ["prefijos-5", (r) => choose(r, "Completa la oración.", NEG)],
  ["sufijos-1", (r) => choose(r, "Completa la oración.", OSO)],
  ["prefijos-6", (r) => choose(r, "Completa la oración.", SIN)],
  ["sufijos-2", (r) => choose(r, "Completa la oración.", ABLE)],

  ["griegas-latinas-1", (r) => choose(r, "", ROOT_CLUES)],
  ["griegas-latinas-2", (r) => choose(r, "", WORDS_TO_ROOT)],
  ["griegas-latinas-3", (r) => choose(r, "", ROOT_MEANING)],
  ["griegas-latinas-4", (r) => choose(r, "", ROOT_WORDS)],

  ["sinonimos-antonimos-1", (r) => choose(r, "", SYNONYMS)],
  ["sinonimos-antonimos-2", (r) => choose(r, "", ANTONYMS)],

  ["homofonos-1", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["homofonos-2", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["homofonos-3", (r) => choose(r, "", SENTENCE_FOR_DEF)],

  ["matices-1", (r) => choose(r, "", DIFFERENCE)],
  ["matices-2", (r) => choose(r, "", CONNOTATION)],

  ["analogias-1", (r) => choose(r, "Completa la analogía.", ANALOGY)],
  ["analogias-2", (r) => choose(r, "Completa la analogía.", ANALOGY_HARD)],

  ["contexto-1", (r) => choose(r, "¿Qué palabra completa mejor la oración?", FIND_WORD)],
  ["contexto-2", (r) => choose(r, "", SYN_CLUE)],
  ["contexto-3", (r) => choose(r, "", ANT_CLUE)],
  ["contexto-4", (r) => choose(r, "", CONTEXT)],
  ["academico-1", (r) => choose(r, "Completa la oración.", ACADEMIC_LIT)],
  ["academico-2", (r) => choose(r, "Completa la oración.", ACADEMIC_INFO)],

  ["academico-3", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la definición?", DOMAIN)],

  ["diccionario-1", (r) => abcOrder(r, ABC, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["diccionario-2", (r) => choose(r, "", GUIDE_WORDS)],
  ["diccionario-3", (r) => choose(r, "", DICTIONARY)],
  ["diccionario-4", (r) => choose(r, "", DEFINITIONS)],
  ["diccionario-5", (r) => choose(r, "", THESAURUS)],
];
