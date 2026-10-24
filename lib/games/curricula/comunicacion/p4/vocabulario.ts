import { choose, mix, pickAll, type ChoiceItem } from "../../../generators/lengua/bank";
import { abcOrder, f, pool, pt, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Primaria · banco de vocabulario: prefijos y sufijos del castellano,
// raíces griegas y latinas, compuestas, sinónimos y antónimos, homófonos,
// modismos y refranes de uso común en el Perú, matices, contexto y
// diccionario.


const ask = (q: (x: string) => string, list: [string, string][]) => pool(list.map(([x, a]) => [q(x), a] as [string, string]), "p");

// --- Prefijos y sufijos --------------------------------------------------

const PARTS: ChoiceItem[] = [
  w("¿Cuál es la palabra base de «desconfiado»?", "confiar", "des", "fiado"), w("¿Cuál es el prefijo de «prefabricado»?", "pre-", "-ado", "fabric"),
  w("¿Cuál es el sufijo de «amistoso»?", "-oso", "amis-", "-toso"), w("¿Cuál es la palabra base de «releído»?", "leer", "re", "ído"),
  w("¿Cuál es el prefijo de «incómodo»?", "in-", "-odo", "cómo-"), w("¿Cuál es el sufijo de «tristeza»?", "-eza", "tris-", "-teza"),
  w("¿Cuál es la palabra base de «inolvidable»?", "olvidar", "inol", "dable"), w("¿Cuál es el sufijo de «entrenamiento»?", "-miento", "entre-", "-to"),
  w("¿Qué partes tiene «desagradablemente»?", "des- + agradable + -mente", "desa- + gradable + -mente", "des- + agra + -dablemente"), w("¿Qué partes tiene «recalentamiento»?", "re- + calentar + -miento", "reca- + lentar + -miento", "re- + calenta + -to"),
  w("¿Cuál es el prefijo de «subterráneo»?", "sub-", "-áneo", "terr-"), w("¿Cuál es la palabra base de «florecimiento»?", "florecer", "flor", "miento"),
];

const PREFIX_MEANING: ChoiceItem[] = [
  w("¿Qué significa «precalentar»?", "Calentar antes", "Calentar otra vez", "Dejar de calentar"), w("¿Qué significa «reorganizar»?", "Organizar otra vez", "Organizar antes", "No organizar"),
  w("¿Qué significa «desabrochar»?", "Soltar lo abrochado", "Abrochar de nuevo", "Abrochar antes de salir"), w("¿Qué significa «prever»?", "Ver con anticipación", "Ver de nuevo lo mismo", "No ver"),
  w("¿Qué significa «reelegir»?", "Elegir de nuevo", "Elegir antes", "No elegir"), w("¿Qué significa «desconectar»?", "Quitar la conexión", "Conectar otra vez", "Conectar antes"),
  w("¿Qué significa «preinscripción»?", "Inscripción anticipada", "Segunda inscripción", "Inscripción anulada"), w("¿Qué significa «rellenar»?", "Volver a llenar", "Llenar antes de tiempo", "Vaciar"),
  w("¿Qué significa «desaparecer»?", "Dejar de estar a la vista", "Aparecer otra vez en el lugar", "Aparecer antes"), w("¿Qué significa «prehistórico»?", "Anterior a la historia escrita", "Que repite la historia otra vez", "Sin historia"),
];

const PREFIX_USE: ChoiceItem[] = [
  f("El pollo se quemó: no debimos ___ tanto el horno.", "precalentar", "descalentar", "recalentar"), f("La sopa está fría; la voy a ___.", "recalentar", "precalentar", "desalentar"),
  f("Antes de dormir, hay que ___ el televisor.", "desconectar", "reconectar", "preconectar"), f("Mi dibujo quedó feo; lo voy a ___.", "rehacer", "deshacer", "prehacer"),
  f("Nadie pudo ___ que llovería en pleno verano.", "prever", "rever", "desver"), f("Ayúdame a ___ los zapatos: los pasadores están con nudo.", "desatar", "reatar", "preatar"),
  f("Como fue buen alcalde, lo van a ___.", "reelegir", "deselegir", "preelegir"), f("Se acabó el agua de la jarra; hay que ___.", "rellenarla", "desllenarla", "prellenarla"),
  f("La maleta está muy llena: voy a ___ para sacar el abrigo.", "desempacar", "reempacar", "preempacar"), f("La ___ del concurso es este lunes; la final, en julio.", "preselección", "reselección", "deselección"),
];

const OSO_IN: ChoiceItem[] = [
  w("¿Qué significa «montañoso»?", "Que tiene muchas montañas", "Sin montañas", "Parecido a un monte pequeño"), w("¿Qué significa «injusto»?", "Que no es justo", "Muy justo", "Justo otra vez"),
  w("¿Qué significa «cariñoso»?", "Que da mucho cariño", "Sin cariño", "Que pide cariño a todos"), w("¿Qué significa «inmóvil»?", "Que no se mueve", "Que se mueve mucho", "Que se mueve antes"),
  w("¿Qué significa «lluvioso»?", "Con muchas lluvias", "Sin lluvias", "Que evita la lluvia"), w("¿Qué significa «impaciente»?", "Que no tiene paciencia", "Que tiene mucha paciencia", "Paciente otra vez"),
  w("¿Qué significa «orgulloso»?", "Que siente orgullo", "Que no siente orgullo", "Que perdió el orgullo"), w("¿Qué significa «invisible»?", "Que no se puede ver", "Que se ve muy bien", "Que se vio antes"),
  w("¿Qué significa «ruidoso»?", "Que hace mucho ruido", "Sin ruido", "Que odia el ruido"), w("¿Qué significa «irreal»?", "Que no es real", "Muy real", "Real de nuevo"),
];

const MENTE_EZA: ChoiceItem[] = [
  w("¿Qué significa «cuidadosamente»?", "De manera cuidadosa", "Sin cuidado", "Persona que cuida"), w("¿Qué significa «firmeza»?", "Cualidad de firme", "De manera firme", "Sin firmeza alguna"),
  w("¿Qué significa «puntualidad»?", "Cualidad de puntual", "De manera puntual", "Falta de puntualidad"), w("¿Qué significa «silenciosamente»?", "De manera silenciosa", "Cualidad de silencioso", "Con mucho ruido"),
  w("¿Qué significa «pureza»?", "Cualidad de puro", "De forma pura", "Que no es puro"), w("¿Qué significa «honestidad»?", "Cualidad de honesto", "De manera honesta", "Persona deshonesta"),
  w("¿Qué significa «amablemente»?", "De manera amable", "Cualidad de amable", "Sin amabilidad"), w("¿Qué significa «riqueza»?", "Abundancia de bienes", "De manera rica", "Persona rica"),
  w("¿Qué significa «oscuridad»?", "Falta de luz", "De manera oscura", "Que oscurece algo"), w("¿Qué significa «valientemente»?", "Con valentía", "Cualidad de valiente", "Con miedo"),
];

const ABLE_MIENTO: ChoiceItem[] = [
  w("¿Qué significa «reciclable»?", "Que se puede reciclar", "Que recicla solo", "Acción de reciclar"), w("¿Qué significa «crecimiento»?", "Acción de crecer", "Que puede crecer", "Que no crece"),
  w("¿Qué significa «increíble»?", "Que cuesta creer", "Que se cree fácil", "Acción de creer"), w("¿Qué significa «agradecimiento»?", "Acción de agradecer", "Que se puede agradecer", "Falta de gratitud"),
  w("¿Qué significa «comestible»?", "Que se puede comer", "Que come mucho", "Acción de comer"), w("¿Qué significa «descubrimiento»?", "Acción de descubrir", "Que se puede descubrir", "Persona que descubre"),
  w("¿Qué significa «flexible»?", "Que se puede doblar", "Que no se dobla", "Acción de doblar"), w("¿Qué significa «sufrimiento»?", "Acción de sufrir", "Que se puede sufrir", "Persona que sufre"),
  w("¿Qué significa «recargable»?", "Que se puede cargar otra vez", "Que carga a otros", "Acción de cargar"), w("¿Qué significa «nacimiento»?", "Acción de nacer", "Que puede nacer", "Lugar para dormir"),
];

const SAME_AFFIX = (affix: string, meaning: string, yes: string[], no: string[]) => (q: Parameters<typeof pickAll>[0]) => pickAll(q, `Selecciona las palabras en las que «${affix}» significa «${meaning}».`, yes, no, affix);
const AFFIX_GROUPS = [
  SAME_AFFIX("re-", "otra vez", ["releer", "reconstruir", "reelegir", "rehacer", "recalentar"], ["regalo", "reloj", "remo", "refrán", "recreo", "rebaño"]),
  SAME_AFFIX("des-", "lo contrario", ["desarmar", "desobedecer", "desconectar", "desinflar", "desordenar"], ["desayuno", "desierto", "destino", "desfile", "descanso", "deseo"]),
  SAME_AFFIX("in-/im-", "no", ["incómodo", "impaciente", "invisible", "injusto", "imposible"], ["invierno", "imán", "indio", "imagen", "insecto", "invitar"]),
  SAME_AFFIX("pre-", "antes", ["prehistoria", "precalentar", "prever", "preselección", "prefabricado"], ["pregunta", "premio", "prenda", "precio", "prensa", "presa"]),
  SAME_AFFIX("-ero", "persona que trabaja en algo", ["panadero", "zapatero", "jardinero", "carpintero", "bombero"], ["florero", "basurero", "salero", "llavero", "sombrero", "monedero"]),
  SAME_AFFIX("-oso", "que tiene mucho de algo", ["arenoso", "lluvioso", "ruidoso", "jugoso", "montañoso"], ["oso", "pozo", "reposo", "esposo", "acoso", "coloso"]),
];

const SPEECH = sorter(["Sustantivo", "Adjetivo", "Adverbio"], "¿Qué clase de palabra es?");
const SUFFIX_SPEECH: ChoiceItem[] = [
  ...["firmeza", "puntualidad", "entrenamiento", "honestidad", "pureza", "movimiento", "oscuridad", "jardinero"].map((x) => SPEECH(x, 0)),
  ...["montañoso", "reciclable", "flexible", "cariñoso", "comestible", "rojizo", "orgulloso", "recargable"].map((x) => SPEECH(x, 1)),
  ...["cuidadosamente", "amablemente", "valientemente", "silenciosamente", "fácilmente", "lentamente", "claramente", "dulcemente"].map((x) => SPEECH(x, 2)),
];

const ANALOGIES: ChoiceItem[] = [
  f("justo → injusto\nmóvil → ___", "inmóvil", "movible", "movilidad"), f("elegir → reelegir\norganizar → ___", "reorganizar", "desorganizar", "organizador"),
  f("puro → pureza\nfirme → ___", "firmeza", "firmemente", "afirmar"), f("amable → amablemente\nvaliente → ___", "valientemente", "valentía", "valentón"),
  f("jardín → jardinero\nzapato → ___", "zapatero", "zapatería", "zapatilla"), f("crecer → crecimiento\nnacer → ___", "nacimiento", "nacido", "renacer"),
  f("armar → desarmar\ninflar → ___", "desinflar", "inflable", "reinflar"), f("lluvia → lluvioso\narena → ___", "arenoso", "arenal", "arenero"),
  f("comer → comestible\ncreer → ___", "creíble", "creyente", "creencia"), f("puntual → puntualidad\nhonesto → ___", "honestidad", "honestamente", "deshonesto"),
  f("historia → prehistoria\nselección → ___", "preselección", "seleccionar", "selecto"), f("rojo → rojizo\nenfermo → ___", "enfermizo", "enfermero", "enfermedad"),
];

const PATTERN_SENTENCES: ChoiceItem[] = [
  f("Quien actúa con valentía actúa ___.", "valientemente", "valentía", "valiente"), f("Lo que se puede reciclar es ___.", "reciclable", "reciclaje", "reciclador"),
  f("Un terreno con mucha arena es ___.", "arenoso", "arenal", "arenero"), f("Quien no tiene paciencia es ___.", "impaciente", "paciente", "pacientemente"),
  f("La cualidad de ser honesto es la ___.", "honestidad", "honestamente", "deshonesto"), f("Volver a calentar la comida es ___.", "recalentarla", "precalentarla", "calentador"),
  f("La acción de descubrir es un ___.", "descubrimiento", "descubridor", "descubierto"), f("Lo contrario de conectar es ___.", "desconectar", "reconectar", "conexión"),
  f("Calentar el horno antes de usarlo es ___.", "precalentarlo", "recalentarlo", "calentura"), f("Quien cuida un jardín es ___.", "jardinero", "jardinería", "ajardinado"),
];

// --- Raíces griegas y latinas --------------------------------------------

const ROOT_SORT = (root: string, yes: string[], no: string[]) => (q: Parameters<typeof pickAll>[0]) => pickAll(q, `Selecciona las palabras que comparten la raíz «${root}».`, yes, no, root);
const ROOT_GROUPS = [
  ROOT_SORT("tele- (lejos)", ["teléfono", "telescopio", "televisión", "telegrama"], ["tela", "tejado", "temblor", "tenedor", "teatro"]),
  ROOT_SORT("bio- (vida)", ["biología", "biografía", "biodiversidad", "biosfera"], ["bicicleta", "billete", "bizcocho", "bisabuelo", "bigote"]),
  ROOT_SORT("geo- (tierra)", ["geografía", "geología", "geometría", "geólogo"], ["gemelo", "general", "gelatina", "gente", "genio"]),
  ROOT_SORT("-grafía (escritura o descripción)", ["ortografía", "caligrafía", "biografía", "geografía"], ["grifería", "graderío", "sangría", "alegría", "granja"]),
  ROOT_SORT("hidro- (agua)", ["hidratar", "hidroavión", "hidroeléctrica", "hidrante"], ["hierba", "higo", "himno", "hilo", "hielo"]),
  ROOT_SORT("-logía (estudio)", ["biología", "zoología", "geología", "tecnología"], ["logro", "lógica", "alojamiento", "reloj", "elogio"]),
];

const ROOT_CLUES: ChoiceItem[] = [
  w("«Poli-» significa «muchos». ¿Qué es un polígono?", "Una figura de muchos lados", "Una figura de un solo lado", "Un círculo perfecto"), w("«Mono-» significa «uno solo». ¿Qué es un monólogo?", "Un discurso de una sola persona", "Una charla entre muchos", "Un mono que habla"),
  w("«Crono-» significa «tiempo». ¿Qué hace un cronómetro?", "Mide el tiempo", "Mide el calor", "Mide la distancia entre dos puntos"), w("«Aero-» significa «aire». ¿Qué es un aeropuerto?", "Un lugar para naves que van por el aire", "Un puerto de barcos", "Una estación de trenes"),
  w("«Dent-» significa «diente». ¿Qué hace un dentista?", "Cuida los dientes", "Cuida los ojos", "Cuida los huesos"), w("«Port-» significa «llevar». ¿Qué es algo portátil?", "Algo fácil de llevar", "Algo muy pesado y fijo", "Algo que está en un puerto"),
  w("«Semi-» significa «mitad». ¿Qué es un semicírculo?", "Medio círculo", "Dos círculos", "Un círculo pequeño dentro de otro"), w("«Omni-» significa «todo». ¿Qué come un omnívoro?", "De todo: plantas y animales", "Solo carne", "Solo hojas"),
  w("«Audi-» significa «oír». ¿Para qué sirven los audífonos?", "Para oír", "Para ver de lejos", "Para hablar más fuerte"), w("«Vid-/vis-» significa «ver». ¿Qué es algo visible?", "Algo que se puede ver", "Algo que se puede oír", "Algo que se puede tocar"),
];

const MEANING_TO_ROOT: ChoiceItem[] = [
  w("«Cronómetro» mide el tiempo y «cronología» ordena hechos en el tiempo. ¿Qué significa «crono-»?", "tiempo", "medida", "orden"), w("«Termómetro» mide el calor y «termo» conserva el calor. ¿Qué significa «termo-»?", "calor", "medida", "frío"),
  w("«Acuario» es un depósito de agua y «acuático» es lo que vive en el agua. ¿Qué significa «acua-»?", "agua", "pez", "vida"), w("«Audífono» sirve para oír y «audible» es lo que se puede oír. ¿Qué significa «audi-»?", "oír", "hablar", "ver"),
  w("«Dentista» cura los dientes y «dental» es lo relativo a los dientes. ¿Qué significa «dent-»?", "diente", "doctor", "boca"), w("«Polígono» tiene muchos lados y «polideportivo» sirve para muchos deportes. ¿Qué significa «poli-»?", "muchos", "lados", "juego"),
  w("«Bicicleta» tiene dos ruedas y «bilingüe» habla dos idiomas. ¿Qué significa «bi-»?", "dos", "rueda", "idioma"), w("«Triángulo» tiene tres ángulos y «triciclo», tres ruedas. ¿Qué significa «tri-»?", "tres", "ángulo", "rueda"),
  w("«Portátil» se puede llevar y «transportar» es llevar de un lugar a otro. ¿Qué significa «port-»?", "llevar", "puerta", "lugar"), w("«Zoológico» muestra animales y «zoología» los estudia. ¿Qué significa «zoo-»?", "animal", "estudio", "jaula"),
];

const ROOT_MEANING = ask((t) => `¿Qué significa la raíz ${t}?`, [
  ["crono- (cronómetro, cronología)", "tiempo"], ["aero- (aeropuerto, aeronave)", "aire"], ["poli- (polígono, polideportivo)", "muchos"], ["mono- (monólogo, monosílabo)", "uno"],
  ["audi- (audífono, auditorio)", "oír"], ["dent- (dentista, dentadura)", "diente"], ["port- (portátil, transportar)", "llevar"], ["semi- (semicírculo, semifinal)", "mitad"],
  ["omni- (omnívoro)", "todo"], ["vis- (visible, visión)", "ver"], ["-metro (termómetro, cronómetro)", "medida"], ["-fobia (claustrofobia)", "miedo"],
]);

const ROOT_WORDS: ChoiceItem[] = [
  w("¿Qué significa «cronología»?", "Orden de los hechos en el tiempo", "Estudio de los colores", "Medida del calor"), w("¿Qué significa «aeronave»?", "Vehículo que va por el aire", "Vehículo que va por el agua", "Vehículo que va por rieles"),
  w("¿Qué significa «monosílabo»?", "Palabra de una sola sílaba", "Palabra de muchas sílabas", "Palabra sin vocales"), w("¿Qué significa «auditorio»?", "Lugar para escuchar un acto", "Lugar para guardar libros", "Lugar para nadar"),
  w("¿Qué significa «semifinal»?", "Etapa anterior a la final", "Etapa posterior a la final", "Primer partido del torneo"), w("¿Qué significa «polideportivo»?", "Lugar para practicar muchos deportes", "Lugar para un solo deporte", "Tienda de ropa deportiva"),
  w("¿Qué significa «dentadura»?", "Conjunto de dientes", "Dolor de dientes", "Doctor de dientes"), w("¿Qué significa «transportar»?", "Llevar de un lugar a otro", "Dejar algo en su sitio", "Abrir una puerta"),
  w("¿Qué significa «visión»?", "Capacidad de ver", "Capacidad de oír", "Capacidad de oler"), w("¿Qué significa «bilingüe»?", "Que habla dos idiomas", "Que habla un idioma", "Que no habla"),
];

const ROOT_MATCH = pool([
  ["telescopio", "aparato para ver lejos"], ["biografía", "relato de una vida"], ["geología", "estudio de la Tierra"], ["cronómetro", "aparato que mide el tiempo"],
  ["hidroavión", "avión que se posa en el agua"], ["monólogo", "discurso de una persona"], ["omnívoro", "animal que come de todo"], ["zoología", "estudio de los animales"],
  ["audible", "que se puede oír"], ["portátil", "fácil de llevar"],
]);

const ROOT_USE: ChoiceItem[] = [
  f("El atleta paró el ___ al cruzar la meta.", "cronómetro", "termómetro", "telescopio"), f("Leí la ___ de Miguel Grau: nació en Piura.", "biografía", "geografía", "caligrafía"),
  f("El oso es ___: come frutas, peces y miel.", "omnívoro", "herbívoro", "invisible"), f("Mi papá trabaja con una computadora ___ que lleva en la mochila.", "portátil", "audible", "prehistórica"),
  f("Mañana jugamos la ___; si ganamos, vamos a la final.", "semifinal", "preselección", "cronología"), f("Bebe agua para ___ después de correr.", "hidratarte", "transportarte", "reelegirte"),
  f("Habla más fuerte: tu voz casi no es ___.", "audible", "visible", "flexible"), f("El actor dijo un ___ de diez minutos, solo en el escenario.", "monólogo", "diálogo", "polígono"),
  f("Mi prima es ___: habla quechua y castellano.", "bilingüe", "omnívora", "portátil"), f("El hexágono es un ___ de seis lados.", "polígono", "monólogo", "semicírculo"),
];

// --- Palabras compuestas -------------------------------------------------

const COMPOUND_PIC = pool([
  ["🧴  quita + ___", "manchas"], ["🌻  gira + ___", "sol"], ["🏙️  rasca + ___", "cielos"], ["🏀  balon + ___", "cesto"], ["🦗  salta + ___", "montes"],
  ["💅  corta + ___", "uñas"], ["🌈  arco + ___", "iris"], ["🖼️  porta + ___", "retratos"], ["🌳  guarda + ___", "bosques"], ["🍾  saca + ___", "corchos"],
]);
const COMPOUND_FORM: ChoiceItem[] = [
  w("¿Qué palabra se forma con «rasca» y «cielos»?", "rascacielos", "cielosrasca", "rascacielo"), w("¿Qué palabra se forma con «gira» y «sol»?", "girasol", "solgira", "girasoles"),
  w("¿Qué palabra se forma con «guarda» y «bosques»?", "guardabosques", "bosquesguarda", "guardabosque"), w("¿Qué palabra se forma con «corta» y «uñas»?", "cortaúñas", "uñascorta", "cortauña"),
  w("¿Qué palabra se forma con «salta» y «montes»?", "saltamontes", "montessalta", "saltamonte"), w("¿Qué palabra se forma con «arco» e «iris»?", "arcoíris", "irisarco", "arcosiris"),
  w("¿Qué palabra se forma con «porta» y «retratos»?", "portarretratos", "portaretratos", "retratosporta"), w("¿Qué palabra se forma con «tapa» y «rabo»?", "taparrabo", "taparabo", "rabotapa"),
  w("¿Qué palabra se forma con «balón» y «pie»?", "balompié", "balónpie", "piebalón"), w("¿Qué palabra se forma con «sobre» y «mesa»?", "sobremesa", "mesasobre", "sobremesas"),
];
const COMPOUND_USE: ChoiceItem[] = [
  f("Después de la lluvia salió un ___ sobre el valle.", "arcoíris", "girasol", "rascacielos"), f("El ___ avisó a los bomberos del incendio en el cerro.", "guardabosques", "saltamontes", "cortaúñas"),
  f("Ese ___ tiene cincuenta pisos.", "rascacielos", "arcoíris", "portarretratos"), f("El ___ gira su flor siguiendo la luz.", "girasol", "parasol", "tornasol"),
  f("Un ___ verde brincó entre la hierba.", "saltamontes", "guardabosques", "rascacielos"), f("Puse la foto de mi abuela en un ___.", "portarretratos", "portaequipaje", "portalápices"),
  f("Nos quedamos conversando en la ___ después del almuerzo.", "sobremesa", "sobrecama", "sobrecarga"), f("Me corté las uñas con el ___.", "cortaúñas", "sacapuntas", "abrelatas"),
  f("La moto me salpicó porque no tenía ___.", "guardabarros", "guardabosques", "guardarropa"), f("Usa el ___ para sacar esa mancha de la camisa.", "quitamanchas", "quitasol", "quitanieves"),
];

// --- Categorías ----------------------------------------------------------

const GROUPS: Record<string, string[]> = {
  "medios de comunicación": ["radio", "periódico", "televisión", "revista", "carta", "teléfono"],
  "accidentes geográficos": ["cordillera", "valle", "península", "bahía", "meseta", "quebrada"],
  "fenómenos del clima": ["granizo", "neblina", "helada", "llovizna", "tormenta", "sequía"],
  "partes de una planta": ["raíz", "tallo", "hoja", "pétalo", "semilla", "fruto"],
  "oficios": ["albañil", "tejedora", "pescador", "costurera", "herrero", "alfarero"],
  "órganos del cuerpo": ["corazón", "pulmón", "hígado", "riñón", "estómago", "cerebro"],
};
const GROUP_NAMES = Object.keys(GROUPS);
const othersOf = (g: string) => GROUP_NAMES.filter((k) => k !== g).flatMap((k) => GROUPS[k]);

// --- Sinónimos y antónimos -----------------------------------------------

const SYNONYMS = ask((x) => `¿Cuál es un sinónimo de «${x}»?`, [
  ["obsequio", "regalo"], ["sendero", "camino"], ["veloz", "ligero"], ["construir", "edificar"], ["elegir", "escoger"], ["cima", "cumbre"],
  ["auxiliar", "ayudar"], ["valiente", "audaz"], ["habitar", "vivir"], ["aroma", "fragancia"], ["frágil", "delicado"], ["relato", "narración"],
]);
const SAME = "¿Qué oración tiene el mismo significado?";
const SAME_MEANING: ChoiceItem[] = [
  pt(SAME, "La caja es frágil.", "La caja es delicada.", "La caja es resistente.", "La caja es enorme."), pt(SAME, "El alcalde edificó un puente.", "El alcalde construyó un puente.", "El alcalde derribó un puente.", "El alcalde cruzó un puente."),
  pt(SAME, "Llegamos a la cima del cerro.", "Llegamos a la cumbre del cerro.", "Llegamos a la base del cerro.", "Llegamos a la orilla del cerro."), pt(SAME, "El anciano narró su viaje.", "El anciano contó su viaje.", "El anciano olvidó su viaje.", "El anciano canceló su viaje."),
  pt(SAME, "Los bomberos auxiliaron a los vecinos.", "Los bomberos ayudaron a los vecinos.", "Los bomberos asustaron a los vecinos.", "Los bomberos buscaron a los vecinos."), pt(SAME, "El niño estaba atemorizado.", "El niño estaba asustado.", "El niño estaba animado.", "El niño estaba aburrido."),
  pt(SAME, "Recibí un obsequio inesperado.", "Recibí un regalo sorpresivo.", "Recibí un castigo esperado.", "Recibí un aviso atrasado."), pt(SAME, "La laguna estaba serena.", "La laguna estaba tranquila.", "La laguna estaba agitada.", "La laguna estaba helada."),
];
const SYN = "¿Qué palabra del texto es sinónimo de la palabra destacada?";
const SYN_CONTEXT: ChoiceItem[] = [
  pt(SYN, "El camino era ANGOSTO. Por ese sendero estrecho solo pasaba una mula.", "estrecho", "sendero", "mula"), pt(SYN, "Fue un día AGOTADOR. Al llegar, todos estábamos rendidos por la cansadora caminata.", "cansadora", "rendidos", "caminata"),
  pt(SYN, "La noticia me ASOMBRÓ. A mi hermano también lo sorprendió y se quedó callado.", "sorprendió", "callado", "quedó"), pt(SYN, "El río tiene agua CRISTALINA. Es tan transparente que se ven las piedras.", "transparente", "piedras", "ven"),
  pt(SYN, "El perro estaba HAMBRIENTO. Famélico, se comió todo en un minuto.", "famélico", "minuto", "comió"), pt(SYN, "Mi tía es muy AHORRATIVA. Como es tan cuidadosa con el dinero, nunca le falta.", "cuidadosa", "dinero", "falta"),
  pt(SYN, "El examen fue SENCILLO. Era tan fácil que terminamos antes.", "fácil", "antes", "terminamos"), pt(SYN, "Escuchamos un ruido EXTRAÑO. Era un sonido raro, como de metal.", "raro", "sonido", "metal"),
];
const ANTONYMS = ask((x) => `¿Cuál es un antónimo de «${x}»?`, [
  ["frágil", "resistente"], ["ancho", "angosto"], ["victoria", "derrota"], ["aceptar", "rechazar"], ["humilde", "presumido"], ["escaso", "abundante"],
  ["antiguo", "moderno"], ["valiente", "cobarde"], ["ascender", "descender"], ["generoso", "tacaño"], ["áspero", "suave"], ["permitir", "prohibir"],
]);
const ANT = "¿Qué oración usa un antónimo de la palabra destacada?";
const ANT_SENTENCE: ChoiceItem[] = [
  pt(ANT, "El agua del río es ESCASA en invierno.", "En verano, el agua es abundante.", "En invierno hay muy poca agua en el río.", "El río es largo y frío."), pt(ANT, "El equipo celebró su VICTORIA.", "El rival lamentó su derrota.", "El equipo festejó su triunfo.", "El rival jugó de visita."),
  pt(ANT, "El sendero ASCIENDE hasta la laguna.", "Luego desciende hacia el valle.", "Después sube hasta el nevado.", "Es un sendero de piedra."), pt(ANT, "Mi tío es muy GENEROSO.", "Su vecino, en cambio, es tacaño.", "Siempre comparte su comida con todos.", "Mi tío vive en Ica."),
  pt(ANT, "La profesora PERMITIÓ usar calculadora.", "El director prohibió los celulares.", "La profesora dejó usar reglas y compás.", "Todos sacaron su calculadora."), pt(ANT, "Esa tela es ÁSPERA.", "Prefiero la otra, que es suave.", "Me raspa la piel de los brazos y el cuello.", "Es una tela de lana."),
  pt(ANT, "El museo guarda objetos ANTIGUOS.", "La tienda vende aparatos modernos.", "El museo tiene piezas muy viejas.", "El museo abre los martes."), pt(ANT, "El soldado fue VALIENTE.", "Nadie dirá que fue cobarde.", "Todos dicen que fue audaz.", "El soldado era joven."),
];
const ANTC = "¿Qué palabra del texto es antónimo de la palabra destacada?";
const ANT_CONTEXT: ChoiceItem[] = [
  pt(ANTC, "De día el desierto es CALUROSO, pero de noche se vuelve helado.", "helado", "noche", "desierto"), pt(ANTC, "Al principio estaba NERVIOSA; después del primer verso me sentí tranquila.", "tranquila", "verso", "después"),
  pt(ANTC, "El primer ejercicio fue SENCILLO; el último, en cambio, resultó complicado.", "complicado", "último", "ejercicio"), pt(ANTC, "La calle principal es RUIDOSA, mientras que mi pasaje es silencioso.", "silencioso", "pasaje", "principal"),
  pt(ANTC, "Mi hermano es DESORDENADO; yo, por el contrario, soy muy organizado.", "organizado", "contrario", "hermano"), pt(ANTC, "La entrada del túnel era OSCURA y la salida, luminosa.", "luminosa", "salida", "túnel"),
  pt(ANTC, "El pan de ayer está DURO; el de hoy, blando.", "blando", "ayer", "pan"), pt(ANTC, "Antes el pueblo era POBRE; con la carretera se volvió próspero.", "próspero", "carretera", "pueblo"),
];

// --- Homófonos y homónimos -----------------------------------------------

const HOMOPHONE_PIC = pool([
  ["🌿 Planta pequeña del campo", "hierba"], ["♨️ Del verbo hervir", "hierva"], ["🧱 Cerco que separa terrenos", "valla"], ["🚶 Del verbo ir", "vaya"],
  ["🐴 Poner herraduras a un caballo", "herrar"], ["❌ Equivocarse", "errar"], ["🏠 Lugar donde uno vive", "casa"], ["🏹 Búsqueda de animales para atraparlos", "caza"],
  ["🪚 Herramienta para cortar madera", "sierra"], ["🚪 Del verbo cerrar", "cierra"],
]);

const HOMOPHONE_ID: ChoiceItem[] = [
  w("¿Qué palabra suena igual que «hola» pero se escribe distinto?", "ola", "hora", "bola"), w("¿Qué palabra suena igual que «tubo» pero se escribe distinto?", "tuvo", "tuyo", "turbo"),
  w("¿Qué palabra suena igual que «asta» pero se escribe distinto?", "hasta", "hasto", "pasta"), w("¿Qué palabra suena igual que «bello» pero se escribe distinto?", "vello", "sello", "bollo"),
  w("¿Qué palabra suena igual que «hecho» pero se escribe distinto?", "echo", "lecho", "ocho"), w("¿Qué palabra suena igual que «cayó» pero se escribe distinto?", "calló", "cayo", "cuyo"),
  w("¿Qué palabra suena igual que «rayar» pero se escribe distinto?", "rallar", "rayo", "rodar"),
  w("¿Qué palabra suena igual que «bienes» pero se escribe distinto?", "vienes", "bien", "tienes"), w("¿Qué palabra suena igual que «haya» pero se escribe distinto?", "halla", "hoya", "playa"),
];

const HOMOPHONE_MATCH = pool([
  ["tuvo", "pasado de tener"], ["tubo", "cilindro hueco"], ["asta", "palo de la bandera"], ["hasta", "indica un límite"], ["vello", "pelo fino del cuerpo"],
  ["bello", "hermoso"], ["echo", "del verbo echar"], ["hecho", "del verbo hacer"], ["calló", "dejó de hablar"], ["cayó", "se fue al suelo"],
  ["rallar", "desmenuzar con el rallador"], ["rayar", "hacer líneas"],
].map(([x, a]) => [`¿Qué significa «${x}»?`, a] as [string, string]), "p");

const HOMOPHONE_USE: ChoiceItem[] = [
  f("Izaron la bandera en el ___.", "asta", "hasta", "hazta"), f("Caminamos ___ el río.", "hasta", "asta", "azta"),
  f("Ayer mi hermano ___ fiebre.", "tuvo", "tubo", "tubó"), f("El agua pasa por un ___ de plástico.", "tubo", "tuvo", "tuvó"),
  f("He ___ toda mi tarea.", "hecho", "echo", "hécho"), f("Siempre le ___ azúcar al café.", "echo", "hecho", "hécho"),
  f("El jarrón se ___ de la mesa.", "cayó", "calló", "callo"), f("Cuando entró la directora, todo el salón se ___.", "calló", "cayó", "cayo"),
  f("Voy a ___ el queso para los tallarines.", "rallar", "rayar", "raiar"), f("No debes ___ las carpetas con el lapicero.", "rayar", "rallar", "rallár"),
  f("¡Qué paisaje tan ___!", "bello", "vello", "beyo"), f("Ojalá ___ helados en la fiesta.", "haya", "halla", "aya"),
];

const MULTI_PIC = pool([
  ["🐱  🔧", "gato"], ["🌹  🎨", "rosa"], ["🍊  🟧", "naranja"], ["🦷  🧄", "diente"], ["👑  🦷", "corona"],
  ["🐎  ♟️", "caballo"], ["⭐  🎬", "estrella"], ["⛵  🕯️", "vela"], ["🐦  ⛏️", "pico"], ["🪆  ✋", "muñeca"],
]);

const DEF = "¿Qué significado tiene la palabra destacada en la oración?";
const DEF_FOR_SENTENCE: ChoiceItem[] = [
  pt(DEF, "El mecánico levantó el carro con un GATO.", "Máquina para levantar pesos", "Animal doméstico que maúlla", "Juego de niños"), pt(DEF, "Se me cayó un DIENTE de ajo en la sopa.", "Cada parte de una cabeza de ajo", "Pieza dura de la boca que sirve para morder", "Punta de un serrucho"),
  pt(DEF, "Toqué la CUERDA más gruesa de la guitarra.", "Hilo que vibra en un instrumento", "Soga que se usa para saltar en el recreo", "Pieza de un reloj"), pt(DEF, "El BANCO de peces rodeó la lancha.", "Grupo grande de peces", "Asiento largo", "Lugar donde se guarda dinero"),
  pt(DEF, "Movió el CABALLO y me dio jaque.", "Pieza del ajedrez", "Animal que relincha", "Aparato de gimnasia"), pt(DEF, "La actriz es una ESTRELLA del cine.", "Persona muy famosa", "Astro que brilla de noche", "Figura de cinco puntas"),
  pt(DEF, "Guarda la carta en el SOBRE.", "Envoltura de papel", "Encima de algo o de alguien", "Acerca de"), pt(DEF, "La PLANTA del pie me duele.", "Parte de abajo del pie", "Vegetal", "Piso de un edificio"),
  pt(DEF, "Hay una COLA larga en la panadería.", "Fila de personas", "Parte de atrás de un animal", "Pegamento"), pt(DEF, "La CORONA del diente estaba rota.", "Parte visible de una muela", "Adorno que llevan los reyes en la cabeza", "Moneda antigua"),
];
const SENT = "¿En qué oración la palabra tiene ese significado?";
const SENTENCE_FOR_DEF: ChoiceItem[] = [
  pt(SENT, "cabo: punta de tierra que entra en el mar", "El barco rodeó el cabo al amanecer.", "El cabo dio la orden a los soldados.", "Ató el cabo de la soga al poste."), pt(SENT, "pico: parte más alta de una montaña", "Los escaladores llegaron al pico nevado.", "El loro abrió el pico para pedir más semillas.", "Cavó la zanja con un pico."),
  pt(SENT, "copa: parte alta de un árbol", "El nido estaba en la copa del eucalipto.", "Brindaron con una copa de chicha morada helada.", "El equipo levantó la copa."), pt(SENT, "muñeca: parte del brazo que une la mano", "Se torció la muñeca jugando vóley.", "Le regalaron una muñeca de trapo.", "La muñeca tenía un vestido azul."),
  pt(SENT, "cura: remedio para una enfermedad", "Buscan una cura para esa enfermedad.", "El cura tocó la campana de la iglesia al alba.", "El cura del pueblo es amable."), pt(SENT, "bota: del verbo botar", "Mi hermano bota la basura cada noche.", "Se le rompió la bota izquierda en el camino.", "Limpió la bota con betún."),
  pt(SENT, "vela: tela que mueve un barco con el viento", "El viento hinchó la vela del bote.", "Prendimos una vela en el apagón.", "La vela se derritió en la mesa."), pt(SENT, "carta: lista de platos de un restaurante", "El mozo nos trajo la carta.", "Le escribí una carta a mi tía.", "Saqué la mejor carta del mazo."),
];

// --- Modismos y refranes -------------------------------------------------

const IDIOM = "¿Qué significa la expresión destacada?";
const IDIOM_CONTEXT_1: ChoiceItem[] = [
  pt(IDIOM, "Julia no paró de hablar en toda la tarde: HABLA HASTA POR LOS CODOS.", "Habla demasiado.", "Habla con los brazos.", "Habla muy bajito."), pt(IDIOM, "Le pedí ayuda a Raúl y SE HIZO EL DE LA VISTA GORDA.", "Fingió no darse cuenta.", "Se puso los lentes.", "Miró con mucha atención."),
  pt(IDIOM, "Mi papá perdió las llaves y casi PIERDE LOS ESTRIBOS.", "Casi se enfurece.", "Casi se cae del caballo.", "Casi se queda dormido."), pt(IDIOM, "No entendía el misterio hasta que por fin ATÉ CABOS.", "Relacioné las pistas.", "Amarré una soga.", "Perdí el juego."),
  pt(IDIOM, "Ese celular CUESTA UN OJO DE LA CARA.", "Es carísimo.", "Daña la vista.", "Tiene buena cámara."), pt(IDIOM, "Mateo METIÓ LA PATA al contar la sorpresa.", "Cometió un error.", "Pisó un charco.", "Se lastimó el pie."),
  pt(IDIOM, "Hoy estoy CON LAS PILAS PUESTAS para el campeonato.", "Tengo mucha energía.", "Llevo una linterna.", "Estoy muy cansado."), pt(IDIOM, "Mi hermana SE LEVANTÓ CON EL PIE IZQUIERDO: todo le sale mal.", "Tiene un mal día.", "Se torció un pie.", "Madrugó mucho."),
];
const SAYING_1: ChoiceItem[] = [
  w("¿Qué significa «A quien madruga, Dios lo ayuda»?", "A quien empieza temprano le va mejor.", "Hay que rezar siempre antes del amanecer.", "Dormir mucho es saludable."), w("¿Qué significa «Más vale tarde que nunca»?", "Es mejor hacerlo con retraso que no hacerlo.", "Siempre hay que llegar tarde a todas partes.", "Nunca hay que apurarse."),
  w("¿Qué significa «En boca cerrada no entran moscas»?", "A veces conviene callar.", "Hay que comer con la boca cerrada.", "Las moscas son molestas."), w("¿Qué significa «No todo lo que brilla es oro»?", "Las apariencias engañan.", "El oro siempre brilla.", "Hay que comprar joyas."),
  w("¿Qué significa «Estar entre la espada y la pared»?", "Tener dos opciones difíciles.", "Estar jugando a los caballeros con espadas.", "Estar apoyado en un muro."), w("¿Qué significa «Tirar la toalla»?", "Rendirse.", "Secarse rápido.", "Ordenar el baño."),
  w("¿Qué significa «Ser uña y mugre»?", "Ser amigos inseparables.", "Tener las manos sucias.", "Pelear todo el tiempo."), w("¿Qué significa «El que mucho abarca, poco aprieta»?", "Quien quiere hacer demasiado lo hace mal.", "Hay que abrazar a los amigos con mucha fuerza.", "Conviene tener manos grandes."),
];
const IDIOM_CONTEXT_2: ChoiceItem[] = [
  pt(IDIOM, "Le conté el chisme a Lola y FUE CON EL CUENTO a la profesora.", "Fue a acusar.", "Fue a leer un libro.", "Fue a la biblioteca."), pt(IDIOM, "Estudié toda la noche y en el examen ME QUEDÉ EN BLANCO.", "No pude recordar nada.", "Me puse pálido como un papel.", "Entregué primero."),
  pt(IDIOM, "Con su chiste, Toño ROMPIÓ EL HIELO en la reunión.", "Hizo que todos se relajaran.", "Quebró un vaso con hielo sin querer.", "Enfrió el ambiente."), pt(IDIOM, "No le creas: te está TOMANDO EL PELO.", "Te está haciendo una broma.", "Te está peinando.", "Te está cortando el cabello."),
  pt(IDIOM, "El problema de fracciones era PARA ROMPERSE LA CABEZA.", "Muy difícil de resolver.", "Peligroso.", "Muy divertido."), pt(IDIOM, "Mi abuelo conoce el barrio COMO LA PALMA DE SU MANO.", "Lo conoce muy bien.", "Lo dibujó en su mano.", "Casi no lo conoce."),
  pt(IDIOM, "Ana PUSO EL GRITO EN EL CIELO cuando vio su cuarto pintado.", "Se quejó con fuerza.", "Cantó muy alto.", "Rezó en voz alta."), pt(IDIOM, "El plan de Luis SE VINO ABAJO a última hora.", "Fracasó.", "Se cayó de la mesa.", "Bajó por la escalera."),
];
const SAYING_2: ChoiceItem[] = [
  w("¿Qué significa «Más vale pájaro en mano que ciento volando»?", "Es mejor lo seguro que lo incierto.", "Hay que atrapar muchos pájaros.", "Las aves no deben volar."), w("¿Qué significa «Al mal tiempo, buena cara»?", "Hay que enfrentar los problemas con ánimo.", "Cuando llueve mucho hay que sonreír a todos.", "El clima cambia el rostro."),
  w("¿Qué significa «Zapatero, a tus zapatos»?", "Cada quien debe ocuparse de lo que sabe.", "Los zapateros trabajan mucho todos los días.", "Hay que lustrar los zapatos."), w("¿Qué significa «Camarón que se duerme se lo lleva la corriente»?", "Quien se descuida pierde oportunidades.", "Los camarones duermen de día en los ríos.", "El río es peligroso."),
  w("¿Qué significa «Dime con quién andas y te diré quién eres»?", "Tus amistades muestran cómo eres.", "Hay que caminar siempre acompañado.", "Conviene saber los nombres."), w("¿Qué significa «Ojos que no ven, corazón que no siente»?", "Lo que no se sabe no hace sufrir.", "Los ojos y el corazón están unidos.", "Hay que cerrar los ojos."),
  w("¿Qué significa «Dar en el clavo»?", "Acertar.", "Martillar bien.", "Colgar un cuadro."), w("¿Qué significa «Hacer una tormenta en un vaso de agua»?", "Exagerar un problema pequeño.", "Servir demasiada agua en la mesa.", "Mojar la mesa."),
];

// --- Matices de significado ----------------------------------------------

const SHADES_PIC = pool([
  ["🌬️ Sopla un aire suave que apenas mueve las hojas.", "brisa"], ["🌪️ Un viento violento arranca los techos.", "huracán"], ["😊 Le agrada un poco.", "gustar"], ["😍 Le gusta muchísimo.", "encantar"],
  ["👀 Echa una mirada rápida.", "ojear"], ["🧐 Mira con mucha atención cada detalle.", "examinar"], ["🥶 Hace un frío que congela.", "gélido"], ["🧥 Hace un poco de frío.", "fresco"],
  ["🥱 Tiene algo de sueño.", "soñoliento"], ["😴 No puede más del cansancio.", "exhausto"],
]);
const DIFFERENCE: ChoiceItem[] = [
  w("¿En qué se diferencian «pedir» y «exigir»?", "«Exigir» es pedir con fuerza y autoridad.", "«Pedir» es mucho más fuerte que «exigir».", "Significan lo mismo."), w("¿En qué se diferencian «mojado» y «empapado»?", "«Empapado» es totalmente mojado.", "«Mojado» es bastante más que «empapado».", "«Empapado» es casi seco."),
  w("¿En qué se diferencian «caminar» y «deambular»?", "«Deambular» es caminar sin rumbo fijo.", "«Deambular» es caminar con mucha rapidez.", "«Caminar» es andar sin rumbo."), w("¿En qué se diferencian «sonreír» y «carcajearse»?", "«Carcajearse» es reír con mucha fuerza.", "«Sonreír» es reír con muchísima más fuerza.", "«Carcajearse» es reír sin sonido."),
  w("¿En qué se diferencian «temor» y «pánico»?", "El «pánico» es un miedo muy intenso.", "El «temor» es un miedo muchísimo más fuerte.", "El «pánico» es un miedo leve."), w("¿En qué se diferencian «decir» y «gritar»?", "«Gritar» es decir con voz muy alta.", "«Decir» es hablar con una voz más fuerte.", "«Gritar» es hablar en secreto."),
  w("¿En qué se diferencian «grande» y «colosal»?", "«Colosal» es enormemente grande.", "«Colosal» se dice de algo muy pequeño.", "«Grande» es mayor que «colosal»."), w("¿En qué se diferencian «tibio» y «hirviente»?", "«Hirviente» es mucho más caliente.", "«Tibio» es bastante más caliente que «hirviente».", "«Hirviente» es casi frío."),
];
const CON = sorter(["Positiva 👍", "Negativa 👎"], "¿La palabra destacada tiene una connotación positiva o negativa?");
const CONNOTATION: ChoiceItem[] = [
  ...["Mi tío es AHORRATIVO.", "Tu hermana es muy CURIOSA.", "El señor es DELGADO.", "Es un niño DECIDIDO.", "Tiene un estilo ORIGINAL.", "La casa es ACOGEDORA.", "Es una jugadora SEGURA de sí misma."].map((x) => CON(x, 0)),
  ...["Mi tío es TACAÑO.", "Tu hermana es muy ENTROMETIDA.", "El señor es ESQUELÉTICO.", "Es un niño TERCO.", "Tiene un estilo ESTRAFALARIO.", "La casa es ESTRECHA.", "Es una jugadora CREÍDA."].map((x) => CON(x, 1)),
];

// --- Claves de contexto --------------------------------------------------

const FIND_WORD: ChoiceItem[] = [
  f("El camino estaba tan ___ que resbalamos varias veces.", "fangoso", "luminoso", "amplio"), f("La anciana, ___ por los años, caminaba con bastón.", "encorvada", "apurada", "divertida"),
  f("Después de tres días sin comer, el náufrago estaba ___.", "famélico", "satisfecho", "furioso"), f("Con el terremoto, la vieja casona quedó ___.", "derruida", "decorada", "inaugurada"),
  f("El guía conocía cada ___ del bosque, por pequeño que fuera.", "sendero", "océano", "edificio"), f("El público, ___, aplaudió de pie durante cinco minutos.", "emocionado", "aburrido", "dormido"),
  f("No pudimos cruzar: el río estaba demasiado ___.", "caudaloso", "seco", "angosto"), f("La cueva era tan ___ que tuvimos que prender linternas.", "lóbrega", "soleada", "ruidosa"),
  f("El niño, ___, no se atrevía a saludar a nadie.", "tímido", "audaz", "hablador"), f("Tras la helada, la cosecha fue ___: apenas llenó un costal.", "escasa", "abundante", "sabrosa"),
];
const SYN_CLUE: ChoiceItem[] = [
  pt("¿Qué significa «exhausto»?", "Llegó exhausto, es decir, muy cansado, después de la caminata.", "Muy cansado", "Muy alegre", "Muy sucio"), pt("¿Qué significa «gélida»?", "El agua de la laguna estaba gélida, o sea, helada.", "Helada", "Tibia", "Turbia"),
  pt("¿Qué significa «diminuto»?", "Halló un insecto diminuto, tan pequeñito que casi no se veía.", "Muy pequeño", "Muy brillante", "Muy peligroso"), pt("¿Qué significa «veraz»?", "Es un testigo veraz: siempre dice la verdad.", "Que dice la verdad", "Que habla rápido", "Que ve muy bien"),
  pt("¿Qué significa «colmado»?", "El estadio estaba colmado, lleno hasta la última grada.", "Lleno", "Vacío", "Cerrado"), pt("¿Qué significa «hurtar»?", "Lo acusaron de hurtar, es decir, robar, unas gallinas.", "Robar", "Criar", "Vender"),
  pt("¿Qué significa «pernoctar»?", "Decidimos pernoctar en el pueblo: pasamos la noche en una posada.", "Pasar la noche", "Almorzar", "Perderse"), pt("¿Qué significa «bullicio»?", "Me despertó el bullicio, ese gran ruido de la feria.", "Mucho ruido", "Mucho calor", "Mucho polvo"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa «árido»?", "En ese terreno árido no crece nada: no llueve nunca y el suelo está rajado.", "Muy seco", "Muy frío", "Muy fértil"), pt("¿Qué significa «sigiloso»?", "El puma se acercó sigiloso; ni una hoja crujió bajo sus patas.", "Silencioso y cuidadoso", "Rápido y muy escandaloso", "Torpe"),
  pt("¿Qué significa «generosa»?", "Fue una cosecha generosa: llenamos todos los costales y aún sobró.", "Abundante", "Pobre", "Tardía"), pt("¿Qué significa «frondoso»?", "Bajo el árbol frondoso no pasaba ni un rayo de sol entre tantas hojas.", "Con muchas hojas", "Sin ramas", "Recién plantado"),
  pt("¿Qué significa «titubeó»?", "Titubeó antes de responder; miró al piso y dijo: «Eh... no sé».", "Dudó", "Gritó", "Se rio"), pt("¿Qué significa «averiado»?", "El bus estaba averiado, así que el chofer llamó al mecánico.", "Malogrado", "Lleno", "Nuevo"),
  pt("¿Qué significa «velozmente»?", "El venado huyó velozmente y en segundos se perdió de vista.", "Con rapidez", "Con miedo", "Con torpeza"), pt("¿Qué significa «inhóspito»?", "Era un lugar inhóspito: sin agua, sin sombra y con vientos helados.", "Difícil para vivir", "Lleno de casas y de gente", "Agradable"),
];
const DOMAIN = pool([
  ["🌋 Abertura por donde el volcán expulsa lava", "cráter"], ["🌙 Camino que recorre la Luna alrededor de la Tierra", "órbita"], ["🦋 Cambio de oruga a mariposa", "metamorfosis"], ["🗺️ Líneas imaginarias que rodean la Tierra de este a oeste", "paralelos"],
  ["🦴 Conjunto de huesos del cuerpo", "esqueleto"], ["🌱 Proceso por el que una semilla empieza a crecer", "germinación"], ["🏔️ Gran masa de hielo en lo alto de una montaña", "glaciar"], ["🔺 Figura de tres lados", "triángulo"],
  ["🧲 Fuerza con la que un imán atrae el hierro", "magnetismo"], ["🌊 Subida y bajada del nivel del mar", "marea"],
]);
const ACADEMIC: ChoiceItem[] = [
  f("Antes del experimento, escribe tu ___: lo que crees que pasará.", "hipótesis", "conclusión", "biografía"), f("Lee el texto y ___ las ideas principales en cinco líneas.", "resume", "copia", "adorna"),
  f("___ los dos animales: di en qué se parecen y en qué no.", "Compara", "Dibuja", "Ordena"), f("Después de medir, ___ los datos en una tabla.", "registra", "imagina", "borra"),
  f("El gráfico ___ que las lluvias aumentan en febrero.", "muestra", "opina", "inventa"), f("___ tu respuesta con un ejemplo del texto.", "Justifica", "Esconde", "Repite"),
  f("Para terminar, escribe una ___ con lo que aprendiste.", "conclusión", "hipótesis", "pregunta"), f("___ los pasos del proceso en el orden correcto.", "Enumera", "Opina", "Predice"),
  f("El título permite ___ de qué tratará el texto.", "predecir", "resumir", "medir"), f("___ las palabras clave con un resaltador.", "Identifica", "Calcula", "Compara"),
];

// --- Uso del diccionario -------------------------------------------------

const ABC1 = [["brújula", "delfín", "quena", "sombrero", "ventana", "zorro"], ["alpaca", "cóndor", "frazada", "huerto", "maíz", "totora"], ["eclipse", "granizo", "iglesia", "jardín", "laguna", "nevado"]];
const ABC2 = [["sal", "semilla", "sierra", "sol", "sur"], ["pampa", "pescado", "piedra", "poncho", "puna"], ["mate", "mercado", "minga", "molino", "muelle"], ["cabra", "cebada", "cima", "colina", "cumbre"]];
const ABC3 = [["trabajo", "trébol", "trigo", "trompo", "trueno"], ["planta", "pleno", "pliego", "plomo", "pluma"], ["cráter", "crema", "crin", "cromo", "cruz"], ["brazo", "brecha", "brisa", "broma", "bruma"]];
const ABC4 = [["contar", "contento", "contigo", "contorno", "contra"], ["transbordo", "transcurso", "transformar", "transmitir", "transporte"], ["marcha", "marco", "marea", "margen", "marino"], ["presa", "presente", "presión", "preso", "prestar"]];

const GUIDE_WORDS: ChoiceItem[] = [
  w("Las palabras guía de la página son «cabra» y «camino». ¿Qué palabra está en esa página?", "caldo", "canto", "cebra", "burro"), w("Las palabras guía de la página son «lana» y «leche». ¿Qué palabra está en esa página?", "lazo", "lima", "lente", "kilo"),
  w("Las palabras guía de la página son «rama» y «remo». ¿Qué palabra está en esa página?", "red", "río", "rueda", "quena"), w("Las palabras guía de la página son «tabla» y «tejado». ¿Qué palabra está en esa página?", "tambor", "tierra", "templo", "sapo"),
  w("Las palabras guía de la página son «gallo» y «globo». ¿Qué palabra está en esa página?", "gente", "gorro", "grillo", "foca"), w("Las palabras guía de la página son «molino» y «mundo». ¿Qué palabra está en esa página?", "mosca", "mina", "música", "nube"),
  w("Las palabras guía de la página son «pared» y «pelota». ¿Qué palabra está en esa página?", "pastor", "piedra", "papel", "puerta"), w("Las palabras guía de la página son «sierra» y «sopa». ¿Qué palabra está en esa página?", "sol", "sed", "suelo", "tambo"),
];

const ENTRY = "quebrada s. f. 1. Paso estrecho entre montañas. 2. Arroyo o riachuelo que corre por ese paso. Pl. quebradas.";
const ENTRY2 = "audaz adj. Que se atreve a hacer cosas difíciles o peligrosas. Sin. valiente, atrevido. Ant. cobarde. Pl. audaces.";
const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada, ¿qué clase de palabra es «quebrada»?", ENTRY, "Sustantivo femenino", "Adjetivo", "Verbo en pasado"), pt("Según la entrada, ¿cuántos significados tiene «quebrada»?", ENTRY, "Dos", "Uno", "Tres"),
  pt("Según la entrada, ¿qué indica «Pl.»?", ENTRY, "La forma en plural", "La pronunciación", "El lugar donde se usa"), pt("Según la entrada, ¿qué clase de palabra es «audaz»?", ENTRY2, "Adjetivo", "Sustantivo", "Adverbio"),
  pt("Según la entrada, ¿cuál es el plural de «audaz»?", ENTRY2, "audaces", "audazes", "audazs"), pt("Según la entrada, ¿cuál es un antónimo de «audaz»?", ENTRY2, "cobarde", "valiente", "atrevido"),
  pt("Según la entrada, ¿qué indica «Sin.»?", ENTRY2, "Palabras de significado parecido", "Palabras de significado contrario", "Que la palabra no existe"), pt("Según la entrada, ¿qué significa «s. f.»?", ENTRY, "Sustantivo femenino", "Sin forma", "Significado final"),
];

const ENTRY3 = "banco s. m. 1. Asiento largo para varias personas. 2. Empresa que guarda y presta dinero. 3. Grupo numeroso de peces.";
const ENTRY4 = "sierra s. f. 1. Herramienta con dientes para cortar madera. 2. Cadena de montañas. 3. Región montañosa de un país.";
const WHICH = "¿Qué definición se usa en la oración?";
const DEFINITIONS: ChoiceItem[] = [
  pt(WHICH, `${ENTRY3}\n\n«Los pescadores siguieron al banco hasta la bahía».`, "La definición 3", "La definición 1", "La definición 2"), pt(WHICH, `${ENTRY3}\n\n«Mi mamá abrió una cuenta de ahorros en el banco».`, "La definición 2", "La definición 1", "La definición 3"),
  pt(WHICH, `${ENTRY3}\n\n«Nos sentamos en el banco de la plaza».`, "La definición 1", "La definición 2", "La definición 3"), pt(WHICH, `${ENTRY4}\n\n«El carpintero afiló su sierra».`, "La definición 1", "La definición 2", "La definición 3"),
  pt(WHICH, `${ENTRY4}\n\n«En la sierra del Perú se cultiva la papa».`, "La definición 3", "La definición 1", "La definición 2"), pt(WHICH, `${ENTRY4}\n\n«Desde el avión vimos una sierra cubierta de nieve».`, "La definición 2", "La definición 1", "La definición 3"),
];

const THES = "DICCIONARIO DE SINÓNIMOS\ncontento adj. Sin. alegre, feliz, satisfecho, dichoso. Ant. triste, apenado.";
const THES2 = "DICCIONARIO DE SINÓNIMOS\ndecir v. Sin. expresar, afirmar, comentar, susurrar, gritar. Ant. callar.";
const THESAURUS: ChoiceItem[] = [
  pt("Según la entrada, ¿qué palabra puede reemplazar a «contento»?", THES, "dichoso", "apenado", "triste"), pt("Según la entrada, ¿cuál es un antónimo de «contento»?", THES, "apenado", "feliz", "satisfecho"),
  pt("¿Para qué sirve un diccionario de sinónimos?", THES, "Para hallar palabras de significado parecido", "Para saber cómo se pronuncia", "Para conocer el origen de una palabra"), pt("Según la entrada, ¿qué sinónimo de «decir» conviene para hablar muy bajito?", THES2, "susurrar", "gritar", "afirmar"),
  pt("Según la entrada, ¿qué sinónimo de «decir» conviene para hablar con voz muy fuerte?", THES2, "gritar", "susurrar", "comentar"), pt("Según la entrada, ¿cuál es un antónimo de «decir»?", THES2, "callar", "expresar", "afirmar"),
  pt("Quieres no repetir «contento» en tu cuento. ¿Qué palabra de la entrada eliges?", THES, "alegre", "triste", "apenado"), pt("Según la entrada, ¿qué clase de palabra es «decir»?", THES2, "Verbo", "Adjetivo", "Sustantivo"),
];

export const ROWS: Row[] = [
  ["prefijos-1", (r) => choose(r, "", PARTS)],
  ["prefijos-2", (r) => choose(r, "", PREFIX_MEANING)],
  ["prefijos-3", (r) => choose(r, "Completa la oración.", PREFIX_USE)],
  ["prefijos-4", (r) => choose(r, "", OSO_IN)],
  ["sufijos-1", (r) => choose(r, "", MENTE_EZA)],
  ["sufijos-2", (r) => choose(r, "", ABLE_MIENTO)],
  ["sufijos-3", (r) => choose(r, "", [...OSO_IN.filter((x) => x.p!.includes("oso»")), ...MENTE_EZA, ...ABLE_MIENTO])],
  ["sufijos-4", (r) => choose(r, "", [...PREFIX_MEANING, ...OSO_IN, ...MENTE_EZA, ...ABLE_MIENTO])],
  ["sufijos-5", (r) => mix(r, AFFIX_GROUPS)],
  ["sufijos-6", (r) => choose(r, "", SUFFIX_SPEECH)],
  ["analogias-1", (r) => choose(r, "Completa la analogía.", ANALOGIES)],
  ["analogias-2", (r) => choose(r, "Completa la oración.", PATTERN_SENTENCES)],

  ["raices-1", (r) => mix(r, ROOT_GROUPS)],
  ["raices-2", (r) => choose(r, "", ROOT_CLUES)],
  ["raices-3", (r) => choose(r, "", MEANING_TO_ROOT)],
  ["raices-4", (r) => choose(r, "", ROOT_MEANING)],
  ["raices-5", (r) => choose(r, "", ROOT_WORDS)],
  ["raices-6", (r) => choose(r, "¿Qué significa la palabra?", ROOT_MATCH)],
  ["raices-7", (r) => choose(r, "Completa la oración.", ROOT_USE)],

  ["compuestas-1", (r) => choose(r, "¿Qué palabra falta para formar la palabra compuesta del dibujo?", COMPOUND_PIC)],
  ["compuestas-2", (r) => choose(r, "", COMPOUND_FORM)],
  ["compuestas-3", (r) => choose(r, "Completa la oración.", COMPOUND_USE)],

  ["categorias-1", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que pertenecen al grupo: ${g}.`, GROUPS[g], othersOf(g), g);
  }],
  ["categorias-2", (r) => {
    const g = r.pick(GROUP_NAMES);
    return pickAll(r, `Selecciona las palabras que NO pertenecen al grupo: ${g}.`, othersOf(g), GROUPS[g], g);
  }],

  ["sinonimos-antonimos-1", (r) => choose(r, "", SYNONYMS)],
  ["sinonimos-antonimos-2", (r) => choose(r, "", SAME_MEANING)],
  ["sinonimos-antonimos-3", (r) => choose(r, "", SYN_CONTEXT)],
  ["sinonimos-antonimos-4", (r) => choose(r, "", ANTONYMS)],
  ["sinonimos-antonimos-5", (r) => choose(r, "", ANT_SENTENCE)],
  ["sinonimos-antonimos-6", (r) => choose(r, "", ANT_CONTEXT)],

  ["homofonos-1", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la pista?", HOMOPHONE_PIC)],
  ["homofonos-2", (r) => choose(r, "", HOMOPHONE_ID)],
  ["homofonos-3", (r) => choose(r, "", HOMOPHONE_MATCH)],
  ["homofonos-4", (r) => choose(r, "Completa la oración.", HOMOPHONE_USE)],
  ["homonimos-1", (r) => choose(r, "Una misma palabra nombra los dos dibujos. ¿Cuál es?", MULTI_PIC)],
  ["homonimos-2", (r) => choose(r, "", DEF_FOR_SENTENCE)],
  ["homonimos-3", (r) => choose(r, "", SENTENCE_FOR_DEF)],

  ["modismos-1", (r) => choose(r, "", IDIOM_CONTEXT_1)],
  ["modismos-2", (r) => choose(r, "", SAYING_1)],
  ["modismos-3", (r) => choose(r, "", IDIOM_CONTEXT_2)],
  ["modismos-4", (r) => choose(r, "", SAYING_2)],

  ["matices-1", (r) => choose(r, "¿Qué palabra describe mejor el dibujo?", SHADES_PIC)],
  ["matices-2", (r) => choose(r, "", DIFFERENCE)],
  ["matices-3", (r) => choose(r, "", CONNOTATION)],

  ["contexto-1", (r) => choose(r, "¿Qué palabra completa mejor la oración?", FIND_WORD)],
  ["contexto-2", (r) => choose(r, "", SYN_CLUE)],
  ["contexto-3", (r) => choose(r, "", CONTEXT)],
  ["contexto-4", (r) => choose(r, "¿Qué palabra corresponde al dibujo y a la definición?", DOMAIN)],
  ["contexto-5", (r) => choose(r, "Completa la oración.", ACADEMIC)],

  ["orden-alfabetico-1", (r) => abcOrder(r, ABC1, "Mira la primera letra.")],
  ["orden-alfabetico-2", (r) => abcOrder(r, ABC2, "Empiezan igual: mira la segunda letra.")],
  ["orden-alfabetico-3", (r) => abcOrder(r, ABC3, "Las dos primeras letras son iguales: mira la tercera.")],
  ["orden-alfabetico-4", (r) => abcOrder(r, ABC4, "Empiezan con las mismas letras: sigue comparando hasta encontrar la diferencia.")],
  ["entradas-1", (r) => choose(r, "", GUIDE_WORDS)],
  ["entradas-2", (r) => choose(r, "", DICTIONARY)],
  ["entradas-3", (r) => choose(r, "", DEFINITIONS)],
  ["entradas-4", (r) => choose(r, "", THESAURUS)],
];
