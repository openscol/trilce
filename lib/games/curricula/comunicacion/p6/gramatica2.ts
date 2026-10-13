import { choose, pickInSentence, type ChoiceItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, segunda parte (IXL 6th grade ELA, NN-UU), con las
// reglas del castellano:
//   orden de los adjetivos → posición del adjetivo y formas cortas (buen, gran, primer)
//   comparativos y superlativos → más... que, el más..., -ísimo
//   good/better/best, bad/worse/worst → bueno, mejor, óptimo; malo, peor, pésimo
//   well/better/best, badly/worse/worst → bien, mejor; mal, peor
//   conjunciones correlativas → ni... ni, o... o, tanto... como, no solo... sino también
//   contracciones (I'm, don't) → al, del; conmigo, contigo, consigo
//   comas con adjetivos coordinados, incisos y explicativas; uso de la raya
//   mayúsculas: días, meses, gentilicios e idiomas van con minúscula
//   citas y diálogos: comillas angulares («») y raya (—)

export const SECTIONS: Section[] = [
  { id: "NN", name: "Adjetivos y adverbios", icon: "🎨" },
  { id: "OO", name: "Preposiciones", icon: "📦" },
  { id: "PP", name: "Objeto directo e indirecto", icon: "🎯" },
  { id: "QQ", name: "Conjunciones", icon: "🔗" },
  { id: "RR", name: "Contracciones", icon: "✂️" },
  { id: "SS", name: "Puntuación", icon: "❗" },
  { id: "TT", name: "Mayúsculas", icon: "🔠" },
  { id: "UU", name: "Formato", icon: "📝" },
];

// --- NN. Adjetivos y adverbios -----------------------------------------------

const ADJECTIVES_IN = [
  s("El informe detallado reveló datos sorprendentes.", "detallado", "sorprendentes"), s("Una multitud silenciosa llenó la plaza antigua.", "silenciosa", "antigua"), s("El viejo faro iluminaba la costa rocosa.", "viejo", "rocosa"),
  s("Aquella tarde gris trajo noticias alegres.", "gris", "alegres"), s("Los jóvenes científicos hicieron un hallazgo notable.", "jóvenes", "notable"), s("Su voz serena calmó al público inquieto.", "serena", "inquieto"),
  s("Cruzamos un valle profundo y fértil.", "profundo", "fértil"), s("La escritora peruana recibió un premio internacional.", "peruana", "internacional"),
];
const ADJ_ORDER: ChoiceItem[] = [
  w("¿Qué oración está bien escrita?", "Es su tercer intento.", "Es su tercero intento.", "Es su intento tercer."), w("¿Qué oración está bien escrita?", "Cualquier persona puede participar.", "Cualquiera persona puede participar.", "Persona cualquier puede participar."),
  w("¿Qué oración está bien escrita?", "Fue un gran acierto.", "Fue un grande acierto.", "Fue un acierto gran."), w("¿Qué oración está bien escrita?", "No hay ningún problema.", "No hay ninguno problema.", "No hay problema ningún."),
  w("¿Qué oración está bien escrita?", "Leí tres novelas históricas muy largas.", "Leí históricas tres novelas muy largas.", "Leí novelas tres muy largas históricas."), w("¿Qué oración está bien escrita?", "Santo Domingo y San Pedro son santos.", "San Domingo y Santo Pedro son santos.", "Santo Domingo y Santo Pedro son san."),
  w("¿Qué significa «un pobre hombre»?", "Un hombre que inspira compasión", "Un hombre sin dinero", "Un hombre delgado"), w("¿Qué significa «un hombre pobre»?", "Un hombre sin dinero", "Un hombre que inspira compasión", "Un hombre triste"),
  w("¿Qué significa «mi antigua casa»?", "La casa donde vivía antes", "Una casa muy vieja", "Una casa de piedra"), w("¿Qué significa «una única oportunidad»?", "Solo una oportunidad", "Una oportunidad extraordinaria", "Una oportunidad repetida"),
  w("¿Qué significa «una oportunidad única»?", "Una oportunidad extraordinaria", "Solo una oportunidad", "Una oportunidad común"), w("¿Qué significa «un nuevo auto»?", "Otro auto, distinto del anterior", "Un auto recién fabricado", "Un auto pequeño"),
];
const ADVERBS_IN = [
  s("Ayer respondió bastante bien.", "Ayer", "bastante", "bien"), s("Nunca llegamos tan lejos.", "Nunca", "tan", "lejos"), s("Probablemente llueva mañana.", "Probablemente", "mañana"),
  s("Aquí también hablan despacio.", "Aquí", "también", "despacio"), s("Casi siempre estudia arriba.", "Casi", "siempre", "arriba"), s("Habló muy claramente.", "muy", "claramente"),
  s("Todavía no han llegado.", "Todavía", "no"), s("Luego caminó lentamente.", "Luego", "lentamente"),
];
const RELATIVE_ADVERBS: ChoiceItem[] = [
  f("Este es el barrio ___ crecí.", "donde", "cuando", "como"), f("Recuerdo la tarde ___ nos conocimos.", "cuando", "donde", "como"), f("Lo hizo ___ le enseñaron.", "como", "donde", "cuando"),
  f("Vuelve al lugar de ___ viniste.", "donde", "cuando", "como"), f("Fue entonces ___ comprendí todo.", "cuando", "donde", "como"), f("Admiro el modo ___ argumenta.", "como", "donde", "cuando"),
  f("Llegamos hasta ___ termina el camino.", "donde", "cuando", "como"), f("Te avisaré ___ sepa algo.", "cuando", "donde", "como"), f("Iremos ___ tú digas.", "adonde", "cuando", "como"),
  f("Actuó tal ___ lo había prometido.", "como", "donde", "cuando"),
];
const ADJ_OR_ADV_USE: ChoiceItem[] = [
  f("El orador habló ___.", "claramente", "clara", "claridad"), f("Fue una explicación ___.", "clara", "claramente", "aclarar"), f("Resolvió el problema ___.", "fácilmente", "facilitar", "facilidad"),
  f("Es una decisión ___.", "difícil", "difícilmente", "dificultad"), f("Los datos fueron ___ analizados.", "cuidadosamente", "cuidadosos", "cuidado"), f("Hizo un análisis ___.", "cuidadoso", "cuidadosamente", "cuidar"),
  f("Juega muy ___.", "bien", "bueno", "buena"), f("Es un ___ jugador.", "buen", "bien", "buenamente"), f("Lo expresó ___.", "mal", "malo", "mala"),
  f("Tuvo una ___ idea.", "mala", "mal", "malamente"),
];
const AA = sorter(["Adjetivo", "Adverbio"], "La palabra en MAYÚSCULAS, ¿es un adjetivo o un adverbio?");
const ADJ_OR_ADV: ChoiceItem[] = [
  ...["Tiene DEMASIADO trabajo.", "Es un golpe FUERTE.", "Hay POCOS datos.", "Dio una respuesta CLARA.", "Hizo un trabajo LIMPIO.", "Queda MEDIO pan."].map((x) => AA(x, 0)),
  ...["Trabaja DEMASIADO.", "Golpeó FUERTE la puerta.", "Duerme POCO.", "Habla CLARO, por favor.", "Jugaron LIMPIO.", "Está MEDIO dormida."].map((x) => AA(x, 1)),
];
const COMP_SUP_ADJ: ChoiceItem[] = [
  f("El Amazonas es ___ caudaloso que el Nilo.", "más", "muy", "el más"), f("Es la montaña ___ alta del país.", "más", "muy", "tan"), f("Su discurso fue ___ breve como el mío.", "tan", "más", "el más"),
  f("Este método es ___ eficaz que el anterior.", "menos", "tan", "poco"), f("El examen fue ___: lo resolvimos en diez minutos.", "facilísimo", "fácilísimo", "más fácil que"), f("De los tres, Luis es ___ alto.", "el más", "más", "tan"),
  f("Fue un viaje ___: catorce horas de bus.", "larguísimo", "largísimo", "más largo que"), f("Es ___ puntual de todas las alumnas.", "la más", "más", "tan"), f("Tu letra es ___ legible que la mía.", "más", "la más", "muy"),
  f("El agua estaba ___: no pudimos bañarnos.", "friísima", "friosísima", "más fría que"),
];
const GOOD_BAD: ChoiceItem[] = [
  f("Este resumen es ___ que el anterior.", "mejor", "más bueno", "bien"), f("Fue el ___ día de mi vida: perdí el bus y el examen.", "peor", "más malo", "más peor"), f("De todos los dibujos, el tuyo es el ___.", "mejor", "más mejor", "bueno"),
  f("Su conducta fue ___: no pudo ser peor.", "pésima", "peorísima", "la más peor"), f("El resultado fue ___: superó todas las expectativas.", "óptimo", "mejorísimo", "más"), f("Hoy el clima está ___ que ayer.", "peor", "más peor", "mal"),
  f("Es un ___ ejemplo para sus hermanos.", "buen", "bueno", "bien"), f("Tuvimos una ___ experiencia en ese viaje.", "mala", "mal", "malamente"), f("Es el hermano ___: nació primero.", "mayor", "más mayor", "mayorísimo"),
  f("Mi hermana ___ tiene tres años.", "menor", "más menor", "menos"),
];
const COMP_SUP_ADV: ChoiceItem[] = [
  f("Llegó ___ temprano que nadie.", "más", "muy", "tan"), f("Habla tan claramente ___ su maestra.", "como", "que", "de"), f("De todos, ella es quien corre ___ rápido.", "más", "muy", "tan"),
  f("Vive ___ lejos de aquí.", "lejísimos", "lejosísimo", "más lejos que"), f("Trabaja ___ cuidadosamente que antes.", "más", "muy", "tanto"), f("Respondió lo ___ pronto posible.", "más", "muy", "tan"),
  f("Hoy salió ___ tarde que ayer.", "menos", "tan", "poco"), f("Llegamos ___: el acto ya había terminado.", "tardísimo", "tardeísimo", "más tarde que"), f("Se levantó ___: a las cuatro de la mañana.", "tempranísimo", "tempranoísimo", "más temprano que"),
  f("Corre tanto ___ su hermano.", "como", "que", "más"),
];
const WELL_BADLY: ChoiceItem[] = [
  f("Hoy cantaste ___ que ayer.", "mejor", "más bien", "bueno"), f("Dormí ___ que nunca: tuve pesadillas.", "peor", "más mal", "malo"), f("Es quien ___ dibuja de todo el salón.", "mejor", "más bien", "buen"),
  f("Lo hiciste muy ___: te felicito.", "bien", "bueno", "buen"), f("El equipo jugó ___ y perdió.", "mal", "malo", "mala"), f("De todos, él fue quien ___ respondió: no acertó ninguna.", "peor", "más mal", "pésimo"),
  f("Resolvió el examen ___: sacó la nota más alta.", "óptimamente", "mejormente", "buenamente"), f("Se portó ___: lo suspendieron.", "pésimamente", "peormente", "malmente"), f("Canta tan ___ como su madre.", "bien", "buena", "mejor"),
  f("Cuanto más practica, ___ toca.", "mejor", "más bueno", "bien"),
];

// --- OO. Preposiciones -------------------------------------------------------

const PREPS_IN = [
  s("Tras el debate, votamos por la segunda propuesta.", "Tras", "por"), s("Según el informe, el río nace en la cordillera.", "Según", "en"), s("Caminó hacia el puerto sin mirar atrás.", "hacia", "sin"),
  s("Habló ante el jurado con serenidad.", "ante", "con"), s("Lo logró mediante esfuerzo y durante años.", "mediante", "durante"), s("El avión voló sobre el mar hasta Lima.", "sobre", "hasta"),
  s("Luchó contra la corriente desde el amanecer.", "contra", "desde"), s("Entre los dos resolvieron el enigma.", "Entre"),
];
const PO = "¿Cuál es la preposición y su término (lo que va después)?";
const PREP_OBJECT: ChoiceItem[] = [
  pt(PO, "El alcalde habló ante los vecinos.", "ante los vecinos", "El alcalde habló ante", "habló ante"), pt(PO, "Lo lograron mediante el diálogo.", "mediante el diálogo", "Lo lograron mediante", "lograron mediante"),
  pt(PO, "La expedición avanzó hacia la cumbre.", "hacia la cumbre", "La expedición avanzó hacia", "avanzó hacia"), pt(PO, "El informe trata sobre los glaciares.", "sobre los glaciares", "El informe trata sobre", "trata sobre"),
  pt(PO, "Votaron según su conciencia.", "según su conciencia", "Votaron según su", "Votaron"), pt(PO, "Navegaron durante tres meses.", "durante tres meses", "Navegaron durante tres", "Navegaron"),
  pt(PO, "El puente se sostiene sobre dos pilares.", "sobre dos pilares", "se sostiene sobre dos", "El puente"), pt(PO, "Caminaron bajo una lluvia intensa.", "bajo una lluvia intensa", "Caminaron bajo una lluvia", "Caminaron"),
];
const PREP_PHRASE: ChoiceItem[] = [
  w("¿Cuál es una frase con preposición?", "ante la duda", "la duda razonable", "duda mucho"), w("¿Cuál es una frase con preposición?", "mediante un acuerdo", "un acuerdo justo", "acuerdan pronto"),
  w("¿Cuál es una frase con preposición?", "tras la tormenta", "la tormenta eléctrica", "truena fuerte"), w("¿Cuál es una frase con preposición?", "según la ley", "la ley vigente", "legisla bien"),
  w("¿Cuál es una frase con preposición?", "contra la pared", "la pared blanca", "pinta rápido"), w("¿Cuál es una frase con preposición?", "desde entonces", "entonces llegó", "llega siempre"),
  w("¿Cuál es una frase con preposición?", "hacia el norte", "el norte frío", "viaja lejos"), w("¿Cuál es una frase con preposición?", "durante el recreo", "el recreo largo", "juegan mucho"),
];
const PREP_REVIEW: ChoiceItem[] = [
  f("La decisión depende ___ jurado.", "del", "al", "en el"), f("Confío ___ tu criterio.", "en", "de", "a"), f("Se acordó ___ mi cumpleaños.", "de", "en", "a"),
  f("Insistió ___ repetir el experimento.", "en", "de", "a"), f("Soñé ___ un viaje al espacio.", "con", "en", "de"), f("El texto consta ___ tres partes.", "de", "en", "con"),
  f("Me enteré ___ la noticia por la radio.", "de", "con", "a"), f("Aspira ___ ser médica.", "a", "en", "de"), f("Se opone ___ la propuesta.", "a", "de", "con"),
  f("Estoy de acuerdo ___ ustedes.", "con", "a", "de"),
];

// --- PP. Objeto directo e indirecto ------------------------------------------

const OBJ = sorter(["Objeto directo (lo que recibe la acción)", "Objeto indirecto (a quién o para quién)"], "La parte en MAYÚSCULAS, ¿es objeto directo o indirecto?");
const OBJECTS: ChoiceItem[] = [
  ...["La profesora entregó LOS EXÁMENES a los alumnos.", "Mi abuelo contó UNA LEYENDA a sus nietos.", "El alcalde inauguró EL PUENTE.", "Envié UN MENSAJE a mi hermana.", "El jurado otorgó EL PREMIO a la autora.", "LO vi ayer en la plaza.", "Escribí UNA CARTA al director."].map((x) => OBJ(x, 0)),
  ...["La profesora entregó los exámenes A LOS ALUMNOS.", "Mi abuelo contó una leyenda A SUS NIETOS.", "LE regalé un cuaderno.", "Envié un mensaje A MI HERMANA.", "El jurado otorgó el premio A LA AUTORA.", "LES expliqué el problema.", "Escribí una carta AL DIRECTOR."].map((x) => OBJ(x, 1)),
];

// --- QQ. Conjunciones --------------------------------------------------------

const COORD_USE: ChoiceItem[] = [
  f("Presentó pruebas, ___ el jurado no le creyó.", "pero", "o", "ni"), f("No aprobó el proyecto ___ lo rechazó: pidió más datos.", "ni", "pero", "sino"), f("No es una novela, ___ un ensayo.", "sino", "pero", "y"),
  f("Estudia historia ___ idiomas.", "e", "y", "u"), f("¿Prefieres el texto de ayer ___ el de hoy?", "o", "ni", "e"), f("Había siete ___ ocho fuentes.", "u", "o", "e"),
  f("Investigó a fondo, ___ su informe es sólido.", "así que", "pero", "ni"), f("Era joven, ___ tenía experiencia.", "mas", "o", "e"), f("Leyó el texto ___ subrayó las ideas.", "y", "ni", "sino"),
  f("Llovía, ___ nadie se movió de la plaza.", "pero", "o", "u"),
];
const COORD_IN = [
  s("Leyó el informe, pero no lo firmó.", "pero"), s("Ni aceptó ni rechazó la oferta.", "Ni", "ni"), s("Aprendió geometría e historia.", "e"),
  s("¿Citas la fuente o la parafraseas?", "o"), s("No es un cuento, sino una crónica.", "sino"), s("Investigó y redactó el ensayo.", "y"),
  s("Quiso hablar, mas calló.", "mas"), s("Eran diez u once testigos.", "u"),
];
const SUBORD_IN = [
  s("Aprobó porque estudió con constancia.", "porque"), s("Aunque llueva, saldremos.", "Aunque"), s("Si citas la fuente, no hay plagio.", "Si"),
  s("Avísame cuando termines.", "cuando"), s("Como no había pruebas, lo absolvieron.", "Como"), s("Escribe claro para que te entiendan.", "para", "que"),
  s("Afirmó que volvería.", "que"), s("Lo haré siempre que pueda.", "siempre", "que"),
];
const CORRELATIVE_PAIR: ChoiceItem[] = [
  f("___ el autor ___ el editor asistieron.", "Ni / ni", "O / ni", "Tanto / ni"), f("___ presentas pruebas ___ retiras la acusación.", "O / o", "Ni / ni", "Tanto / como"),
  f("___ la forma ___ el contenido importan.", "Tanto / como", "Ni / como", "O / ni"), f("___ investiga, ___ enseña.", "No solo / sino que también", "Ni / como", "Tanto / o"),
  f("___ por cansancio, ___ por desgano, dejó de asistir.", "Bien / bien", "Ni / como", "Tanto / sino"), f("Es ___ rigurosa ___ creativa.", "tan / como", "tanto / ni", "o / sino"),
  f("___ aceptas las reglas ___ no juegas.", "O / o", "Ni / sino", "Tanto / como"), f("No trajo ___ el libro ___ el cuaderno.", "ni / ni", "o / como", "tanto / sino"),
  f("___ en Lima ___ en provincias hubo protestas.", "Tanto / como", "Ni / o", "Ya / ni"), f("___ resolvió el problema, ___ explicó cómo.", "No solo / sino que", "Ni / como", "O / ni"),
];
const CORRELATIVE_FILL: ChoiceItem[] = [
  f("Ni el frío ___ el cansancio lo detuvieron.", "ni", "o", "como"), f("Tanto el cuento ___ la novela narran hechos.", "como", "ni", "o"), f("No solo leyó el texto, ___ que lo resumió.", "sino", "pero", "ni"),
  f("O estudias ___ no apruebas.", "o", "ni", "como"), f("Es tan amable ___ generoso.", "como", "que", "ni"), f("No vino el lunes ___ el martes.", "ni", "o", "y"),
  f("No lo dijo ella, ___ su hermana.", "sino", "pero", "ni"), f("Ya de día, ___ de noche, sigue trabajando.", "ya", "ni", "como"), f("No solo es puntual, sino ___ responsable.", "también", "tampoco", "como"),
  f("Tanto tú ___ yo lo sabíamos.", "como", "o", "ni"),
];

// --- RR. Contracciones -------------------------------------------------------

const AL_DEL: ChoiceItem[] = [
  f("Enviamos la carta ___ director.", "al", "a el", "del"), f("La decisión ___ jurado fue unánime.", "del", "de el", "al"), f("Volvimos ___ lugar del hallazgo.", "al", "a el", "del"),
  f("Es el autor ___ ensayo ganador.", "del", "de el", "al"), f("Viajó a ___ Cairo.", "El", "el", "al"), f("Me refiero a ___, no a su hermano.", "él", "el", "al"),
  f("La noticia salió en la portada de ___ Comercio.", "El", "el", "del"), f("Pasamos ___ segundo capítulo.", "al", "a el", "del"), f("El origen ___ conflicto es antiguo.", "del", "de el", "al"),
  f("Se acercó ___ estrado.", "al", "a el", "del"),
];
const CONMIGO: ChoiceItem[] = [
  f("¿Quieres preparar la exposición ___?", "conmigo", "con mí", "con yo"), f("Estoy de acuerdo ___ en ese punto.", "contigo", "con ti", "con tú"), f("El expedicionario llevaba ___ un mapa.", "consigo", "con sí", "con se"),
  f("Nadie quiso debatir ___ y expuse solo.", "conmigo", "con mí", "con yo"), f("Cuento ___ para la revisión, Laura.", "contigo", "con ti", "con tú"), f("Es muy exigente ___ misma.", "consigo", "con sí", "con se"),
  f("Trae ___ el cuaderno de apuntes.", "contigo", "con ti", "con tú"), f("Vino ___ hasta la biblioteca.", "conmigo", "con mí", "con yo"), f("El autor se contradice ___ mismo.", "consigo", "con sí", "con se"),
  f("Me gustaría trabajar ___ otra vez.", "contigo", "con ti", "con tú"),
];

// --- SS. Puntuación ----------------------------------------------------------

const COMMA = "¿Qué oración tiene las comas bien puestas?";
const COMMA_SERIES: ChoiceItem[] = [
  w(COMMA, "El ensayo tiene introducción, desarrollo y conclusión.", "El ensayo tiene introducción desarrollo y conclusión.", "El ensayo tiene, introducción, desarrollo, y conclusión."), w(COMMA, "Visitamos Tacna, Moquegua y Arequipa.", "Visitamos Tacna Moquegua y Arequipa.", "Visitamos, Tacna, Moquegua, y Arequipa."),
  w("¿Qué fecha de carta está bien escrita?", "Trujillo, 14 de marzo de 2027", "Trujillo 14 de marzo, de 2027", "Trujillo, 14, de marzo de 2027"), w(COMMA, "Nació en Santiago de Chuco, La Libertad.", "Nació en Santiago de Chuco La Libertad.", "Nació, en Santiago de Chuco La Libertad."),
  w(COMMA, "Leyó, subrayó, resumió y expuso.", "Leyó subrayó resumió y expuso.", "Leyó, subrayó, resumió, y, expuso."), w("¿Qué fecha está bien escrita?", "Lunes, 6 de setiembre de 2027", "Lunes 6, de setiembre de 2027", "Lunes, 6 de setiembre, de 2027"),
  w(COMMA, "El congreso será en Lima, Perú, en agosto.", "El congreso será en Lima Perú, en agosto.", "El congreso será en, Lima Perú en agosto."), w(COMMA, "Trajo mapas, brújulas, cuerdas y linternas.", "Trajo mapas brújulas cuerdas y linternas.", "Trajo, mapas, brújulas, cuerdas y linternas."),
];
const COMMA_COMPOUND: ChoiceItem[] = [
  w(COMMA, "Investigó durante meses, pero no halló pruebas.", "Investigó durante meses pero, no halló pruebas.", "Investigó, durante meses pero no halló pruebas."), w(COMMA, "Si revisas las fuentes, evitarás errores.", "Si revisas las fuentes evitarás, errores.", "Si, revisas las fuentes evitarás errores."),
  w(COMMA, "Aunque el texto es breve, resulta complejo.", "Aunque el texto es breve resulta, complejo.", "Aunque, el texto es breve resulta complejo."), w(COMMA, "No es un mito, sino una leyenda.", "No es un mito sino, una leyenda.", "No es, un mito sino una leyenda."),
  w(COMMA, "Cuando terminó el debate, todos aplaudieron.", "Cuando terminó el debate todos, aplaudieron.", "Cuando, terminó el debate todos aplaudieron."), w(COMMA, "Llovió toda la noche, así que el río creció.", "Llovió toda la noche así que, el río creció.", "Llovió, toda la noche así que el río creció."),
  w(COMMA, "Como faltaban datos, pospusieron el informe.", "Como faltaban datos pospusieron, el informe.", "Como, faltaban datos pospusieron el informe."), w(COMMA, "Leyó el contrato, aunque no lo firmó.", "Leyó el contrato aunque, no lo firmó.", "Leyó, el contrato aunque no lo firmó."),
];
const COMMA_ADDRESS: ChoiceItem[] = [
  w(COMMA, "Estimados alumnos, pasen al auditorio.", "Estimados alumnos pasen al auditorio.", "Estimados alumnos pasen, al auditorio."), w(COMMA, "Bueno, empecemos la sesión.", "Bueno empecemos, la sesión.", "Bueno empecemos la, sesión."),
  w(COMMA, "¡Ay, qué susto me diste!", "¡Ay qué susto, me diste!", "¡Ay qué, susto me diste!"), w(COMMA, "El resultado, sin embargo, fue positivo.", "El resultado sin embargo, fue positivo.", "El resultado, sin embargo fue positivo."),
  w(COMMA, "Sí, acepto la propuesta.", "Sí acepto, la propuesta.", "Sí acepto la, propuesta."), w(COMMA, "Te lo dije, Marcos, hace una semana.", "Te lo dije Marcos, hace una semana.", "Te lo dije, Marcos hace una semana."),
  w(COMMA, "La autora, según creo, vive en Cusco.", "La autora según creo, vive en Cusco.", "La autora, según creo vive en Cusco."), w(COMMA, "¡Uf, por fin terminamos!", "¡Uf por fin, terminamos!", "¡Uf por, fin terminamos!"),
  w(COMMA, "En resumen, el plan funcionó.", "En resumen el plan, funcionó.", "En, resumen el plan funcionó."), w(COMMA, "Doctora, ¿puede atenderme?", "Doctora ¿puede atenderme?", "Doctora ¿puede, atenderme?"),
];
const COMMA_ADJ: ChoiceItem[] = [
  w(COMMA, "Era una tarde fría, gris y silenciosa.", "Era una tarde fría gris y silenciosa.", "Era una tarde, fría, gris y silenciosa."), w(COMMA, "Escribió un informe claro, breve y ordenado.", "Escribió un informe claro breve y ordenado.", "Escribió un informe, claro, breve y ordenado."),
  w(COMMA, "Compró tres camisas blancas.", "Compró tres, camisas, blancas.", "Compró, tres camisas blancas."), w(COMMA, "Es un testigo serio, confiable y prudente.", "Es un testigo serio confiable y prudente.", "Es un testigo, serio, confiable, y prudente."),
  w(COMMA, "Cruzamos un río ancho, profundo y turbio.", "Cruzamos un río ancho profundo y turbio.", "Cruzamos un río, ancho, profundo y turbio."), w(COMMA, "Vive en una antigua casa colonial.", "Vive en una antigua, casa, colonial.", "Vive en una, antigua casa colonial."),
  w(COMMA, "Tenía una voz suave, cálida y pausada.", "Tenía una voz suave cálida y pausada.", "Tenía una voz, suave, cálida y pausada."), w(COMMA, "Leímos dos novelas policiales.", "Leímos dos, novelas, policiales.", "Leímos, dos novelas policiales."),
];
const MEANING = "¿Qué sugiere la puntuación?";
const PUNCT_MEANING: ChoiceItem[] = [
  pt(MEANING, "«No, espere».", "Se pide que la persona espere.", "Se pide que la persona no espere.", "Se hace una pregunta."), pt(MEANING, "«No espere».", "Se pide que la persona no espere.", "Se pide que la persona espere.", "Se expresa una duda."),
  pt(MEANING, "«Vamos a comer, niños».", "Se invita a los niños a comer.", "Los niños serán la comida.", "Los niños ya comieron."), pt(MEANING, "«Los alumnos, que estudiaron, aprobaron».", "Todos los alumnos estudiaron y aprobaron.", "Solo aprobaron algunos alumnos.", "Ningún alumno aprobó."),
  pt(MEANING, "«Los alumnos que estudiaron aprobaron».", "Solo aprobaron quienes estudiaron.", "Todos los alumnos estudiaron y aprobaron.", "Nadie estudió."), pt(MEANING, "«¿Llegó tu hermano?».", "Se pregunta si llegó.", "Se afirma que llegó.", "Se ordena que llegue."),
  pt(MEANING, "«¡Llegó tu hermano!».", "Se anuncia con emoción.", "Se pregunta si llegó.", "Se duda de que llegue."), pt(MEANING, "«Dijo que vendría... pero nunca apareció».", "Los puntos suspensivos crean una pausa de suspenso.", "Los puntos indican el final del relato.", "Señalan una pregunta."),
  pt(MEANING, "«Tenía una sola regla: no mentir».", "Los dos puntos anuncian cuál es la regla.", "Los dos puntos separan dos temas distintos.", "Indican una pregunta."), pt(MEANING, "«Perdón imposible, que cumpla su condena».", "No se le perdona.", "Se le perdona.", "Se le pregunta algo."),
];
const NONRESTRICTIVE: ChoiceItem[] = [
  w(COMMA, "Arequipa, la Ciudad Blanca, está al pie del Misti.", "Arequipa la Ciudad Blanca, está al pie del Misti.", "Arequipa, la Ciudad Blanca está al pie del Misti."), w(COMMA, "Mi tío, que es geólogo, estudia los volcanes.", "Mi tío que es geólogo, estudia los volcanes.", "Mi tío, que es geólogo estudia los volcanes."),
  w(COMMA, "César Vallejo, autor de «Trilce», nació en 1892.", "César Vallejo autor de «Trilce», nació en 1892.", "César Vallejo, autor de «Trilce» nació en 1892."), w(COMMA, "El Titicaca, que comparten dos países, es navegable.", "El Titicaca que comparten dos países, es navegable.", "El Titicaca, que comparten dos países es navegable."),
  w(COMMA, "La quinua, un grano andino, es muy nutritiva.", "La quinua un grano andino, es muy nutritiva.", "La quinua, un grano andino es muy nutritiva."), w(COMMA, "Mi hermana, la mayor, estudia medicina.", "Mi hermana la mayor, estudia medicina.", "Mi hermana, la mayor estudia medicina."),
  w(COMMA, "El informe, publicado ayer, causó polémica.", "El informe publicado ayer, causó polémica.", "El informe, publicado ayer causó polémica."), w(COMMA, "Caral, la ciudad más antigua de América, está en Supe.", "Caral la ciudad más antigua de América, está en Supe.", "Caral, la ciudad más antigua de América está en Supe."),
];
const DASH = "¿Qué oración usa bien la raya?";
const DASHES: ChoiceItem[] = [
  w(DASH, "El jurado —integrado por tres docentes— eligió al ganador.", "El jurado —integrado por tres docentes eligió al ganador.", "El jurado— integrado por tres docentes —eligió al ganador."), w(DASH, "—No lo sé —respondió el testigo.", "—No lo sé— respondió el testigo.", "No lo sé —respondió— el testigo."),
  w(DASH, "La quinua —un grano andino— resiste las heladas.", "La quinua —un grano andino resiste las heladas.", "La quinua— un grano andino —resiste las heladas."), w(DASH, "—Vengan —dijo la guía—. El museo ya abrió.", "—Vengan —dijo la guía. El museo ya abrió.", "—Vengan— dijo la guía —el museo ya abrió."),
  w(DASH, "Su hermano —el menor— ganó el concurso.", "Su hermano —el menor ganó el concurso.", "Su hermano— el menor —ganó el concurso."), w(DASH, "—¿Quién llamó? —preguntó Ana.", "—¿Quién llamó?— preguntó Ana.", "¿Quién llamó? —preguntó— Ana."),
  w("¿Para qué sirven las rayas en «El río —crecido por las lluvias— arrasó el puente»?", "Para encerrar una aclaración", "Para indicar un diálogo", "Para separar dos oraciones"), w("¿Para qué sirve la raya en «—Buenos días —saludó»?", "Para marcar lo que dice un personaje", "Para encerrar una aclaración", "Para unir dos palabras"),
];

// --- TT. Mayúsculas ----------------------------------------------------------

const CAPS_FIX = "¿Cómo se corrigen las mayúsculas de la oración?";
const CAPS_ERRORS: ChoiceItem[] = [
  pt(CAPS_FIX, "el Presidente visitó arequipa en Agosto.", "El presidente visitó Arequipa en agosto.", "El Presidente visitó Arequipa en Agosto.", "El presidente visitó arequipa en agosto."), pt(CAPS_FIX, "La Edad media terminó en el Siglo XV.", "La Edad Media terminó en el siglo XV.", "La edad media terminó en el siglo XV.", "La Edad Media terminó en el Siglo XV."),
  pt(CAPS_FIX, "Mi Profesora es Chilena y habla Francés.", "Mi profesora es chilena y habla francés.", "Mi profesora es Chilena y habla francés.", "Mi Profesora es chilena y habla Francés."), pt(CAPS_FIX, "El Océano pacífico baña la Costa peruana.", "El océano Pacífico baña la costa peruana.", "El Océano Pacífico baña la Costa peruana.", "El océano pacífico baña la costa peruana."),
  pt(CAPS_FIX, "El Ministerio de educación publicó el Informe.", "El Ministerio de Educación publicó el informe.", "El ministerio de educación publicó el informe.", "El Ministerio De Educación publicó el Informe."), pt(CAPS_FIX, "Los Mochicas vivieron en la Costa norte.", "Los mochicas vivieron en la costa norte.", "Los Mochicas vivieron en la costa norte.", "Los mochicas vivieron en la Costa Norte."),
  pt(CAPS_FIX, "El Martes celebramos el día del maestro.", "El martes celebramos el Día del Maestro.", "El Martes celebramos el Día del Maestro.", "El martes celebramos el día del maestro."), pt(CAPS_FIX, "La Tierra gira alrededor del sol.", "La Tierra gira alrededor del Sol.", "La tierra gira alrededor del sol.", "La Tierra Gira alrededor del Sol."),
  pt(CAPS_FIX, "Estudió en la universidad nacional mayor de san marcos.", "Estudió en la Universidad Nacional Mayor de San Marcos.", "Estudió en la Universidad nacional mayor de San Marcos.", "Estudió en la universidad Nacional Mayor De San Marcos."), pt(CAPS_FIX, "El Río Rímac nace en la Cordillera.", "El río Rímac nace en la cordillera.", "El Río Rímac nace en la cordillera.", "El río rímac nace en la cordillera."),
];
const CAPS_TITLES: ChoiceItem[] = [
  w("¿Qué título de novela está bien escrito?", "La ciudad y los perros", "La Ciudad Y Los Perros", "la ciudad y los perros"), w("¿Qué título de libro está bien escrito?", "Comentarios reales de los incas", "Comentarios Reales De Los Incas", "comentarios reales de los Incas"),
  w("¿Qué título de cuento está bien escrito?", "El sueño del pongo", "El Sueño Del Pongo", "el sueño del Pongo"), w("¿Qué título de novela está bien escrito?", "Cien años de soledad", "Cien Años De Soledad", "cien años de soledad"),
  w("¿Qué título de poemario está bien escrito?", "Los heraldos negros", "Los Heraldos Negros", "los heraldos negros"), w("¿Qué título de diario está bien escrito?", "El Peruano", "el peruano", "El peruano"),
  w("¿Qué título de libro está bien escrito?", "Historia de la República del Perú", "Historia De La República Del Perú", "historia de la república del perú"), w("¿Qué título de cuento está bien escrito?", "Los gallinazos sin plumas", "Los Gallinazos Sin Plumas", "los gallinazos sin Plumas"),
  w("¿Qué título de revista está bien escrito?", "Somos", "somos", "SOmos"), w("¿Qué título de novela está bien escrito?", "El viejo y el mar", "El Viejo Y El Mar", "el viejo y el Mar"),
];

// --- UU. Formato -------------------------------------------------------------

const FORMAT_TITLES: ChoiceItem[] = [
  w("En un texto digitado, ¿cómo se escribe el título de una novela?", "En cursiva", "En negrita", "Entre corchetes"), w("¿Cómo se escribe el título de un artículo periodístico?", "Entre comillas", "En cursiva", "Subrayado"),
  w("Al escribir a mano, ¿cómo se destaca el título de un libro?", "Se subraya.", "Se tacha.", "Se encierra en un círculo."), w("¿Cómo se escribe el nombre de un periódico?", "En cursiva", "Tachado", "Entre paréntesis"),
  w("¿Cómo se escribe el título de un cuento incluido en un libro?", "Entre comillas", "En negrita", "Entre guiones"), w("¿Cómo se escribe el título de una película?", "En cursiva", "En negrita", "Entre paréntesis"),
  w("¿Cómo se escribe el título de un poema suelto?", "Entre comillas", "Subrayado", "Entre barras"), w("¿Cómo se escribe el título de un capítulo?", "Entre comillas", "En cursiva", "En mayúsculas"),
];
const TITLES_BOTH: ChoiceItem[] = [
  w("¿Cuál está bien escrito?", "Leímos el cuento «Los gallinazos sin plumas».", "Leímos el cuento Los Gallinazos Sin Plumas.", "Leímos el cuento «los Gallinazos sin plumas»."), w("¿Cuál está bien escrito?", "El artículo «Ríos en peligro» abre la revista.", "El artículo Ríos En Peligro abre la revista.", "El artículo «ríos en Peligro» abre la revista."),
  w("¿Cuál está bien escrito?", "Analizamos el poema «Los dados eternos».", "Analizamos el poema los dados eternos.", "Analizamos el poema «los Dados Eternos»."), w("¿Cuál está bien escrito?", "El capítulo «La partida» es el más breve.", "El capítulo la partida es el más breve.", "El Capítulo «la Partida» es el más breve."),
  w("¿Cuál está bien escrito?", "Cantamos «Y se llama Perú» en el acto.", "Cantamos y se llama perú en el acto.", "Cantamos «y se llama perú» en el acto."), w("¿Cuál está bien escrito?", "El cuento «Warma kuyay» es de Arguedas.", "El cuento warma kuyay es de arguedas.", "El Cuento «warma Kuyay» es de Arguedas."),
  w("¿Cuál está bien escrito?", "Me conmovió el relato «El niño de junto al cielo».", "Me conmovió el relato El Niño De Junto Al Cielo.", "Me conmovió el relato «el Niño de Junto al Cielo»."), w("¿Cuál está bien escrito?", "La crónica «Una tarde en el mercado» ganó el concurso.", "La crónica una tarde en el mercado ganó el concurso.", "La crónica «una Tarde en el Mercado» ganó el concurso."),
];
const ADDRESSES: ChoiceItem[] = [
  w("¿Qué dirección está bien escrita?", "Av. Arequipa n.º 1250, dpto. 402, Lince", "av. arequipa n.º 1250 dpto. 402 lince", "Av. Arequipa, n.º, 1250 dpto. 402 Lince"), w("¿Qué dirección está bien escrita?", "Jr. Junín 345, Huancayo", "jr. junín 345 huancayo", "Jr. junín, 345, huancayo"),
  w("¿Qué dirección está bien escrita?", "Ca. Los Pinos s/n, Oxapampa", "ca. los pinos s/n oxapampa", "Ca. los Pinos, s/n Oxapampa"), w("¿Qué dirección está bien escrita?", "Psje. Santa Ana 18, int. 3, Cusco", "psje. santa ana 18 int. 3 cusco", "Psje. santa Ana, 18, int. 3 cusco"),
  w("¿Qué dirección está bien escrita?", "Urb. Los Jardines, Mz. B, Lt. 5, Tacna", "urb. los jardines mz. b lt. 5 tacna", "Urb. los Jardines, mz. B, lt. 5 Tacna"), w("¿En qué orden van los datos de una dirección?", "Vía, número, interior y ciudad", "Ciudad, interior, número y vía", "Número, ciudad, vía e interior"),
  w("¿Qué dirección está bien escrita?", "Av. Bolognesi 900, Tacna", "av. Bolognesi 900 tacna", "Av. bolognesi, 900, tacna"), w("¿Qué significa «dpto.» en una dirección?", "Departamento", "Depósito", "Deporte"),
];
const QUOTES: ChoiceItem[] = [
  w("¿Qué cita textual está bien escrita?", "Vallejo escribió: «Hay golpes en la vida, tan fuertes…».", "Vallejo escribió «Hay golpes en la vida, tan fuertes…»", "Vallejo escribió: hay golpes en la vida, tan fuertes…."), w("¿Qué diálogo está bien escrito?", "—¿Has citado la fuente? —preguntó la profesora.", "¿Has citado la fuente? —preguntó la profesora.", "—¿Has citado la fuente?— preguntó la profesora."),
  w("¿Qué cita textual está bien escrita?", "El informe afirma: «El caudal disminuyó un 30 %».", "El informe afirma, El caudal disminuyó un 30 %.", "El informe afirma: el caudal «disminuyó» un 30 %"), w("¿Qué diálogo está bien escrito?", "—No estoy seguro —admitió—. Déjame revisarlo.", "—No estoy seguro —admitió. Déjame revisarlo.", "No estoy seguro —admitió—, déjame revisarlo."),
  w("¿Qué signos se usan en castellano para una cita textual?", "Comillas («»)", "Rayas (—)", "Paréntesis"), w("¿Qué signo introduce lo que dice un personaje en una narración?", "La raya (—)", "Las comillas simples", "El guion bajo"),
  w("¿Qué oración cita bien un título dentro de otra cita?", "Dijo: «Leí “Paco Yunque” ayer».", "Dijo: «Leí «Paco Yunque» ayer».", "Dijo: Leí Paco Yunque ayer."), w("¿Qué cita indirecta está bien escrita?", "El autor señala que el agua escasea.", "El autor señala que «el agua escasea.", "El autor señala: que el agua escasea."),
];

export const ROWS: Row[] = [
  ["NN.1", "Identificar adjetivos", (r) => pickInSentence(r, "Selecciona los adjetivos de la oración.", ADJECTIVES_IN)],
  ["NN.2", "Ordenar los adjetivos: su lugar y sus formas cortas", (r) => choose(r, "", ADJ_ORDER)],
  ["NN.3", "Identificar adverbios", (r) => pickInSentence(r, "Selecciona los adverbios de la oración.", ADVERBS_IN)],
  ["NN.4", "Usar adverbios relativos: donde, cuando y como", (r) => choose(r, "Completa la oración.", RELATIVE_ADVERBS)],
  ["NN.5", "Elegir entre adjetivos y adverbios", (r) => choose(r, "Completa la oración.", ADJ_OR_ADV_USE)],
  ["NN.6", "¿La palabra es un adjetivo o un adverbio?", (r) => choose(r, "", ADJ_OR_ADV)],
  ["NN.7", "Formar y usar adjetivos comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADJ)],
  ["NN.8", "Bueno, mejor, óptimo; malo, peor, pésimo", (r) => choose(r, "Completa la oración.", GOOD_BAD)],
  ["NN.9", "Formar y usar adverbios comparativos y superlativos", (r) => choose(r, "Completa la oración.", COMP_SUP_ADV)],
  ["NN.10", "Bien, mejor; mal, peor", (r) => choose(r, "Completa la oración.", WELL_BADLY)],

  ["OO.1", "Identificar preposiciones", (r) => pickInSentence(r, "Selecciona las preposiciones.", PREPS_IN)],
  ["OO.2", "Identificar las preposiciones y sus términos", (r) => choose(r, "", PREP_OBJECT)],
  ["OO.3", "Identificar frases con preposición", (r) => choose(r, "", PREP_PHRASE)],
  ["OO.4", "Preposiciones: repaso", (r) => choose(r, "Completa la oración.", PREP_REVIEW)],

  ["PP.1", "¿Es un objeto directo o un objeto indirecto?", (r) => choose(r, "", OBJECTS)],

  ["QQ.1", "Usar conjunciones coordinantes", (r) => choose(r, "Completa la oración.", COORD_USE)],
  ["QQ.2", "Identificar conjunciones coordinantes", (r) => pickInSentence(r, "Selecciona las conjunciones coordinantes.", COORD_IN)],
  ["QQ.3", "Identificar conjunciones subordinantes", (r) => pickInSentence(r, "Selecciona la conjunción que introduce la idea subordinada.", SUBORD_IN)],
  ["QQ.4", "Usar el par correcto de conjunciones correlativas", (r) => choose(r, "Completa la oración.", CORRELATIVE_PAIR)],
  ["QQ.5", "Completar con la conjunción correlativa que falta", (r) => choose(r, "Completa la oración.", CORRELATIVE_FILL)],

  ["RR.1", "Contracciones: al y del", (r) => choose(r, "Completa la oración.", AL_DEL)],
  ["RR.2", "Contracciones: conmigo, contigo y consigo", (r) => choose(r, "Completa la oración.", CONMIGO)],

  ["SS.1", "Comas en enumeraciones, fechas y lugares", (r) => choose(r, "", COMMA_SERIES)],
  ["SS.2", "Comas en oraciones compuestas y subordinadas", (r) => choose(r, "", COMMA_COMPOUND)],
  ["SS.3", "Comas con vocativos, palabras introductorias, interjecciones e incisos", (r) => choose(r, "", COMMA_ADDRESS)],
  ["SS.4", "Comas entre adjetivos coordinados", (r) => choose(r, "", COMMA_ADJ)],
  ["SS.5", "Comas: repaso", (r) => choose(r, "", [...COMMA_SERIES, ...COMMA_COMPOUND, ...COMMA_ADDRESS, ...COMMA_ADJ])],
  ["SS.6", "¿Qué sugiere la puntuación?", (r) => choose(r, "", PUNCT_MEANING)],
  ["SS.7", "Comas en las aclaraciones (elementos explicativos)", (r) => choose(r, "", NONRESTRICTIVE)],
  ["SS.8", "Usar la raya", (r) => choose(r, "", DASHES)],

  ["TT.1", "Corregir errores de mayúsculas", (r) => choose(r, "", CAPS_ERRORS)],
  ["TT.2", "Mayúsculas en los títulos", (r) => choose(r, "", CAPS_TITLES)],

  ["UU.1", "Dar formato a los títulos", (r) => choose(r, "", FORMAT_TITLES)],
  ["UU.2", "Dar formato y poner mayúsculas a los títulos: repaso", (r) => choose(r, "", TITLES_BOTH)],
  ["UU.3", "Dar formato a las direcciones", (r) => choose(r, "", ADDRESSES)],
  ["UU.4", "Dar formato a las citas y a los diálogos", (r) => choose(r, "", QUOTES)],
];
