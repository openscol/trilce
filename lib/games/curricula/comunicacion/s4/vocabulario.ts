import { choose, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, pool, pt, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Secundaria · banco de vocabulario: prefijos (pre-, re-, sub-, mal-,
// des-, in-, im-, no) y sufijos (-oso, -ble) del castellano, analogías, raíces
// griegas y latinas, homófonos, extranjerismos y préstamos (latinismos,
// anglicismos, quechuismos), denotación y connotación, precisión léxica,
// sinónimos, usos nuevos o discutidos, pistas del contexto y diccionario.

// --- Prefijos y sufijos -----------------------------------------------------

const PREFIX: ChoiceItem[] = [
  f("¿Qué significa «prefabricado»?", "Fabricado antes", "Fabricado de nuevo", "Mal fabricado"),
  f("¿Qué significa «reelegir»?", "Volver a elegir", "Elegir antes", "No elegir"),
  f("¿Qué significa «subterráneo»?", "Que está debajo de la tierra", "Que está sobre la tierra", "Que no tiene tierra"),
  f("¿Qué significa «malgastar»?", "Gastar mal", "Gastar de nuevo", "Gastar antes"),
  f("¿Qué significa «desconfiar»?", "No confiar", "Confiar mucho", "Confiar de nuevo"),
  f("¿Qué significa «inmortal»?", "Que no muere", "Que muere pronto", "Que muere de nuevo"),
  f("¿Qué significa «imprevisto»?", "Que no se previó", "Que se previó dos veces", "Que se vio bien"),
  f("¿Qué significa «no violencia»?", "Ausencia de violencia", "Violencia extrema", "Violencia repetida"),
];
const SUFFIX: ChoiceItem[] = [
  f("¿Qué significa «montañoso»?", "Lleno de montañas", "Sin montañas", "Que se puede escalar"),
  f("¿Qué significa «lluvioso»?", "Con mucha lluvia", "Sin lluvia", "Que provoca sequía"),
  f("¿Qué significa «sinsabor»?", "Disgusto, pena", "Algo muy sabroso", "Una comida con sal"),
  f("¿Qué significa «apolítico»?", "Ajeno a la política", "Muy político", "Que hace política dos veces"),
  f("¿Qué significa «reciclable»?", "Que se puede reciclar", "Que ya fue reciclado", "Que no se puede reciclar"),
  f("¿Qué significa «legible»?", "Que se puede leer", "Que se lee mal", "Que ya se leyó"),
  f("¿Qué significa «incansable»?", "Que no se cansa", "Que se cansa rápido", "Que cansa a otros"),
];
const PATTERN: ChoiceItem[] = [
  f("Completa la analogía: leer es a legible como comer es a ___.", "comestible", "comida", "comedor"),
  f("Completa la analogía: hacer es a deshacer como cubrir es a ___.", "descubrir", "recubrir", "cubierto"),
  f("Completa la analogía: arena es a arenoso como piedra es a ___.", "pedregoso", "piedrita", "empedrar"),
  f("Completa la analogía: posible es a imposible como legal es a ___.", "ilegal", "inlegal", "deslegal"),
  f("Completa la oración: «El sendero era tan ___ que tuvimos que ir con cuidado entre las rocas.»", "pedregoso", "piedrero", "empedrable"),
  f("Completa la oración: «La carta era ___: la letra parecía un garabato.»", "ilegible", "legible", "deslegible"),
];

// --- Raíces griegas y latinas -----------------------------------------------

const ROOTS_SORT: ChoiceItem[] = [
  f("¿Qué palabra comparte raíz con «geografía»?", "geología", "gemelo", "gerente"),
  f("¿Qué palabra comparte raíz con «teléfono»?", "televisión", "telar", "tela"),
  f("¿Qué palabra comparte raíz con «biología»?", "biografía", "bicicleta", "bisonte"),
  f("¿Qué palabra comparte raíz con «acuático»?", "acueducto", "acuerdo", "acusar"),
  f("¿Qué palabra comparte raíz con «hidráulico»?", "hidratar", "hiena", "hilo"),
  f("¿Qué palabra comparte raíz con «crónica»?", "cronómetro", "cromo", "corona"),
];
const ROOTS_MEANING = pool([
  ["geo", "tierra"],
  ["tele", "lejos"],
  ["bio", "vida"],
  ["hidro", "agua"],
  ["crono", "tiempo"],
  ["fono", "sonido"],
  ["grafía", "escritura"],
  ["logía", "estudio"],
  ["micro", "pequeño"],
  ["demo", "pueblo"],
]).map((it) => ({ ...it, p: "¿Qué significa esta raíz?" }));
const ROOTS_WORDS: ChoiceItem[] = [
  f("Si «micro» es pequeño y «scopio» es ver, ¿qué es un microscopio?", "Un instrumento para ver cosas muy pequeñas", "Un aparato para escuchar a lo lejos", "Un estudio de los seres vivos"),
  f("Si «demo» es pueblo y «cracia» es gobierno, ¿qué es la democracia?", "El gobierno del pueblo", "El gobierno de uno solo", "El estudio del pueblo"),
  f("Si «hidro» es agua y «fobia» es miedo, ¿qué es la hidrofobia?", "El miedo al agua", "El amor al agua", "El estudio del agua"),
  f("Si «a» es sin y «fono» es sonido, ¿qué significa «afónico»?", "Sin voz", "Con mucho sonido", "Que escucha lejos"),
  f("Si «poli» es muchos y «gono» es ángulo, ¿qué es un polígono?", "Una figura de muchos ángulos", "Un gobierno formado por muchas personas", "Un gobierno de muchos"),
];

// --- Homófonos -----------------------------------------------------------------

const HOMOPHONE: ChoiceItem[] = [
  f("Completa: «El ___ del agua está roto.»", "tubo", "tuvo", "tuvó"),
  f("Completa: «Ayer ___ una reunión importante.»", "tuvo", "tubo", "tuvó"),
  f("Completa: «La ___ del árbol se seca.»", "savia", "sabia", "sabía"),
  f("Completa: «Mi abuela es muy ___.»", "sabia", "savia", "sabía"),
  f("Completa: «Hay que ___ la carne antes de comerla.»", "cocer", "coser", "cozer"),
  f("Completa: «Voy a ___ el botón de la camisa.»", "coser", "cocer", "cozer"),
  f("Completa: «Espera a que el agua ___ para echar los fideos.»", "hierva", "hierba", "yerva"),
  f("Completa: «La ___ del jardín creció mucho.»", "hierba", "hierva", "ierba"),
  f("Completa: «Para la causa, hay que ___ la papa amarilla.»", "rallar", "rayar", "rrayar"),
  f("Completa: «No debes ___ las carpetas del salón.»", "rayar", "rallar", "rayár"),
];
const HOMOPHONE_FIX: ChoiceItem[] = [
  pt("¿Qué palabra está mal usada?", "«El cazo de la reunión fue que nadie llegó a tiempo.»", "cazo (debe ser «caso»)", "reunión", "reunión (debe ser «junta»)"),
  pt("¿Qué palabra está mal usada?", "«Hay que votar la basura en el contenedor.»", "votar (debe ser «botar»)", "contenedor (debe ser «recipiente»)", "contenedor"),
  pt("¿Qué palabra está mal usada?", "«El ciervo sirvió la comida a los invitados.»", "ciervo (debe ser «siervo»)", "invitados (debe ser «convidados»)", "invitados"),
  pt("¿Qué palabra está mal usada?", "«La valla de fútbol tenía la red rota.»", "Ninguna: «valla» es correcta", "valla (debe ser «baya»)", "red"),
];

// --- Extranjerismos y préstamos ------------------------------------------------

const ETYMOLOGY: ChoiceItem[] = [
  f("La palabra «pampa» viene del quechua. ¿Qué significa?", "Llanura extensa", "Montaña alta", "Río caudaloso"),
  f("La palabra «chacra» viene del quechua. ¿Qué significa?", "Terreno de cultivo", "Casa grande", "Camino de piedra"),
  f("La palabra «cancha» viene del quechua «kancha». ¿Qué significaba?", "Recinto cercado", "Juego con pelota", "Fiesta"),
  f("La palabra «álgebra» viene del árabe. ¿Qué indica eso de su historia?", "Que llegó al castellano por la influencia árabe en España", "Que la inventaron los matemáticos incas para contar con quipus", "Que es una palabra inglesa"),
  f("«Cóndor» viene del quechua «kuntur». ¿Qué tipo de palabra es?", "Un préstamo del quechua", "Un préstamo del latín", "Un anglicismo"),
];
const FOREIGN: ChoiceItem[] = [
  pt("¿Qué significa la expresión?", "«Se lo explicó grosso modo, sin entrar en detalles.»", "De manera general, a grandes rasgos", "Con mucho detalle", "Con todos los detalles y ejemplos posibles"),
  pt("¿Qué significa la expresión?", "«Llegó a la reunión con un currículum vitae impecable.»", "Relación de estudios y experiencia de una persona", "Una carta de recomendación de un profesor", "Un uniforme"),
  pt("¿Qué significa la expresión?", "«Fue elegido delegado ipso facto, sin votación.»", "En el acto, inmediatamente", "Después de mucho tiempo", "Por equivocación"),
  pt("¿Qué significa la expresión?", "«Tiene un déjà vu: siente que ya vivió ese momento.»", "Sensación de haber vivido algo antes", "Un sueño profundo", "Un olvido repentino de lo que se iba a decir"),
  pt("¿Qué significa la expresión?", "«El concierto fue sold out: no quedaban entradas.»", "Agotado, sin entradas", "Con entrada libre", "Cancelado"),
];
const FOREIGN_USE: ChoiceItem[] = [
  f("Completa con la expresión correcta: «La reunión fue ___: no estaba programada.»", "ad hoc", "status quo", "alter ego"),
  f("Completa con la expresión correcta: «Los opositores querían cambiar el ___.»", "statu quo", "ad hoc", "a priori"),
  f("Completa con la expresión correcta: «Juzgó la película ___, sin haberla visto.»", "a priori", "a posteriori", "in situ"),
  f("Completa con la expresión correcta: «Los peritos analizaron el lugar ___.»", "in situ", "a priori", "ex profeso"),
  f("¿Qué palabra en castellano puede reemplazar «delivery»?", "reparto a domicilio", "despedida", "descuento por pago en línea"),
  f("¿Qué palabra en castellano puede reemplazar «feedback»?", "retroalimentación", "alimentación", "regreso al punto de partida"),
];

// --- Elección y uso de las palabras -------------------------------------------

const CONNOTATION: ChoiceItem[] = [
  f("¿Qué palabra tiene una connotación más positiva para describir a alguien que gasta poco?", "ahorrativo", "tacaño", "miserable"),
  f("¿Qué palabra tiene una connotación más negativa para describir a alguien que insiste?", "terco", "perseverante", "constante"),
  f("¿Qué palabra tiene una connotación más positiva para describir a alguien que habla mucho?", "comunicativo", "charlatán", "hablador"),
  f("¿Qué palabra tiene una connotación más negativa para describir una casa pequeña?", "cuchitril", "acogedora", "compacta"),
  f("¿Qué palabra tiene una connotación más positiva para describir a alguien que arriesga?", "audaz", "temerario", "imprudente"),
];
const PRECISE: ChoiceItem[] = [
  f("¿Qué verbo es más preciso? «El médico ___ la enfermedad.»", "diagnosticó", "hizo", "observó viendo"),
  f("¿Qué verbo es más preciso? «La comisión ___ un informe.»", "elaboró", "hizo", "hizo hacer"),
  f("¿Qué verbo es más preciso? «El alumno ___ una duda.»", "planteó", "dijo", "manifestó haciendo"),
  f("¿Qué verbo es más preciso? «El gobierno ___ el decreto.»", "promulgó", "sacó afuera", "hizo"),
  f("¿Qué verbo es más preciso? «La empresa ___ cien empleos.»", "generó", "hizo", "dio"),
];
const THESAURUS: ChoiceItem[] = [
  f("¿Qué sinónimo puede reemplazar «empezar» en «Vamos a empezar la sesión»?", "iniciar", "acabar", "aplazar"),
  f("¿Qué sinónimo puede reemplazar «importante» en «una decisión importante»?", "trascendental", "trivial", "intrascendente"),
  f("¿Qué sinónimo puede reemplazar «difícil» en «un camino difícil»?", "arduo", "sencillo", "llano"),
  f("¿Qué sinónimo puede reemplazar «mostrar» en «mostrar los resultados»?", "exponer", "ocultar", "guardar"),
];
const CONTESTED: ChoiceItem[] = [
  w("Según la RAE, ¿se puede usar «influenciar»?", "Sí, es correcto, aunque «influir» es más común.", "No, nunca es correcto.", "No, es un anglicismo y debe evitarse siempre."),
  w("Según la RAE, ¿qué forma se recomienda?", "«Los niños y las niñas» o el masculino genérico «los niños»", "«Lxs niñxs»", "«Los niñ@s» con arroba, que es la forma recomendada en documentos oficiales"),
  w("¿Cuál es la forma recomendada en castellano del anglicismo «e-mail»?", "correo electrónico", "imeil", "carta de internet"),
  w("Según la RAE, ¿es correcto decir «la presidenta»?", "Sí, es el femenino correcto de «presidente».", "No, solo se dice «la presidente».", "No, porque «presidente» es invariable y no tiene femenino."),
];

// --- Analogías y contexto ---------------------------------------------------------

const ANALOGIES: ChoiceItem[] = [
  f("Completa: pluma es a escritor como pincel es a ___.", "pintor", "cuadro", "color"),
  f("Completa: lana es a oveja como fibra es a ___.", "alpaca", "telar", "chompa"),
  f("Completa: semilla es a árbol como huevo es a ___.", "gallina", "nido", "cáscara"),
  f("Completa: hambre es a comida como sed es a ___.", "agua", "boca", "sal"),
  f("Completa: puerto es a barco como aeropuerto es a ___.", "avión", "piloto", "pasaje"),
  f("Completa: tímido es a audaz como apático es a ___.", "entusiasta", "indiferente", "cansado"),
];
const CONTEXT: ChoiceItem[] = [
  pt("¿Qué significa la palabra según el contexto? (pista: hay un sinónimo cerca)", "«El clima era hostil, es decir, agresivo y peligroso para los viajeros.» → hostil", "agresivo, adverso", "agradable", "frío y lluvioso, típico de la sierra"),
  pt("¿Qué significa la palabra según el contexto? (pista: hay un antónimo cerca)", "«A diferencia de su hermano, que era locuaz, Mario apenas hablaba.» → locuaz", "que habla mucho", "callado y reservado", "inteligente"),
  pt("¿Qué significa la palabra según el contexto?", "«La sequía fue tan prolongada que los pozos se secaron por completo.» → prolongada", "larga en el tiempo", "muy breve, de pocos días", "intensa"),
  pt("¿Qué significa la palabra según el contexto?", "«Su explicación fue tan diáfana que todos la entendieron a la primera.» → diáfana", "clara", "confusa", "extensa"),
  pt("¿Qué significa la palabra según el contexto? (pista: hay un antónimo cerca)", "«No era un error fortuito, sino algo totalmente planeado.» → fortuito", "casual, por azar", "intencional", "planeado con mucho cuidado"),
];

// --- Diccionario -----------------------------------------------------------------

const DICTIONARY: ChoiceItem[] = [
  pt("Según la entrada del diccionario, ¿qué categoría tiene la palabra?", "acopio. m. Acción de juntar y reunir en cantidad algo.", "Sustantivo masculino", "Verbo transitivo", "Adjetivo"),
  pt("¿Qué acepción corresponde a la oración «Hizo un acopio de víveres para el viaje»?", "acopio. m. Acción de juntar y reunir en cantidad algo.", "Reunir en cantidad", "Regalar", "Vender a precio bajo"),
  pt("Según la entrada, ¿cómo se usa correctamente el verbo?", "aprehender. tr. Coger, asir, prender a alguien. 2. tr. aprender (adquirir conocimiento).", "«La policía aprehendió al sospechoso.»", "«Aprehendí en la casa de mi tía.»", "«Aprehendo que mañana llueve.»"),
  pt("Según la entrada del diccionario de sinónimos, ¿qué palabra puede reemplazar «efímero»?", "efímero: pasajero, breve, fugaz. Antónimos: duradero, perenne.", "fugaz", "perenne", "duradero"),
  pt("¿Qué indica «tr.» en una entrada?", "acopiar. tr. Juntar, reunir en cantidad algo.", "Que el verbo es transitivo (lleva complemento directo)", "Que la palabra es de uso antiguo y ya casi no se emplea", "Que es de uso en el Perú"),
];

export const ROWS: Row[] = [
  ["prefijos-1", (r) => choose(r, "", PREFIX)],
  ["prefijos-2", (r) => choose(r, "", SUFFIX)],
  ["prefijos-3", (r) => choose(r, "", PATTERN)],
  ["raices-1", (r) => choose(r, "", ROOTS_SORT)],
  ["raices-2", (r) => choose(r, "", ROOTS_MEANING)],
  ["raices-3", (r) => choose(r, "", ROOTS_WORDS)],
  ["homofonos-1", (r) => choose(r, "", HOMOPHONE)],
  ["homofonos-2", (r) => choose(r, "", HOMOPHONE_FIX)],
  ["prestamos-1", (r) => choose(r, "", ETYMOLOGY)],
  ["prestamos-2", (r) => choose(r, "", FOREIGN)],
  ["prestamos-3", (r) => choose(r, "", FOREIGN_USE)],
  ["precision-1", (r) => choose(r, "", CONNOTATION)],
  ["precision-2", (r) => choose(r, "", PRECISE)],
  ["precision-3", (r) => choose(r, "", THESAURUS)],
  ["precision-4", (r) => choose(r, "", CONTESTED)],
  ["analogias", (r) => choose(r, "", ANALOGIES)],
  ["contexto", (r) => choose(r, "", CONTEXT)],
  ["diccionario", (r) => choose(r, "", DICTIONARY)],
];
