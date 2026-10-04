import { choose, order, pickInSentence, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "./helpers";
import type { Row } from "./row";

// Estrategias de escritura (IXL 3rd grade ELA, W-DD).

export const SECTIONS: Section[] = [
  { id: "W", name: "Organizar la escritura", icon: "🗂️" },
  { id: "X", name: "Oraciones temáticas", icon: "🎯" },
  { id: "Y", name: "Propósito del escritor", icon: "✍️" },
  { id: "Z", name: "Conectores", icon: "🔗" },
  { id: "AA", name: "Escribir opiniones", icon: "💬" },
  { id: "BB", name: "Detalles descriptivos", icon: "🎨" },
  { id: "CC", name: "Variedad de oraciones", icon: "🔀" },
  { id: "DD", name: "Corregir y revisar", icon: "🔍" },
];

const SENTENCE_ORDER: OrderItem[] = [
  { seq: ["Ayer fuimos de paseo al río.", "Primero armamos la carpa.", "Luego nadamos y almorzamos.", "Al atardecer volvimos a casa."] },
  { seq: ["Para preparar limonada, exprime los limones.", "Después agrega agua y azúcar.", "Luego mezcla bien.", "Por último, sirve con hielo."] },
  { seq: ["Sonó el despertador.", "Me levanté y me vestí.", "Tomé el desayuno.", "Salí corriendo a la escuela."] },
  { seq: ["Sembré una semilla de girasol.", "A los pocos días salió un brote.", "El tallo creció cada semana.", "Por fin se abrió una flor amarilla."] },
  { seq: ["Mi perro se escapó por la reja.", "Lo buscamos por todo el barrio.", "Una vecina lo encontró en el parque.", "Volvió a casa moviendo la cola."] },
  { seq: ["Elegimos un cuento en la biblioteca.", "Lo leímos en grupo.", "Dibujamos nuestra parte favorita.", "Al final, presentamos los dibujos."] },
];

const GENERAL_SPECIFIC: OrderItem[] = [
  { seq: ["ser vivo", "animal", "ave", "colibrí"] }, { seq: ["alimento", "fruta", "cítrico", "limón"] }, { seq: ["lugar", "país", "ciudad", "barrio"] },
  { seq: ["objeto", "instrumento", "instrumento de cuerda", "guitarra"] }, { seq: ["ser vivo", "planta", "árbol", "eucalipto"] }, { seq: ["actividad", "deporte", "deporte con pelota", "vóley"] },
  { seq: ["ropa", "calzado", "zapatilla"] }, { seq: ["vehículo", "vehículo de dos ruedas", "bicicleta"] },
];

const TOPIC = sorter(["Animales", "Alimentos", "Lugares", "Clima"], "¿En qué parte del informe va esta oración?");
const BY_TOPIC: ChoiceItem[] = [
  TOPIC("El tucán tiene un pico enorme.", 0), TOPIC("La quinua se cultiva en la sierra.", 1), TOPIC("Arequipa está rodeada de volcanes.", 2), TOPIC("En la selva llueve casi todo el año.", 3),
  TOPIC("Las vicuñas viven en las alturas.", 0), TOPIC("El ceviche se prepara con limón.", 1), TOPIC("El lago Titicaca está en Puno.", 2), TOPIC("En invierno hay neblina en la costa.", 3),
  TOPIC("Los delfines rosados nadan en el Amazonas.", 0), TOPIC("La papa tiene miles de variedades.", 1), TOPIC("Cusco fue la capital de los incas.", 2), TOPIC("En la sierra cae granizo.", 3),
];

const NOT_SUPPORT: ChoiceItem[] = [
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: Los perros son buenos compañeros.", "Los gatos duermen muchas horas.", "Los perros protegen la casa.", "Los perros juegan con los niños.", "Los perros acompañan a sus dueños."),
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: El recreo es importante para los alumnos.", "La pizarra del salón es verde.", "En el recreo los niños descansan.", "Jugar ayuda a hacer amigos.", "Después del recreo se presta más atención."),
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: La lluvia es necesaria para el campo.", "Mi paraguas es de color azul.", "La lluvia riega los cultivos.", "Con la lluvia se llenan los ríos.", "Sin lluvia, las plantas se secan."),
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: Las frutas son saludables.", "Las galletas vienen en paquetes.", "Las frutas tienen vitaminas.", "La fruta da energía.", "Comer fruta ayuda a no enfermarse."),
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: Mi abuela es una gran cocinera.", "Mi abuela vive en el segundo piso.", "Su ají de gallina es delicioso.", "Todos piden repetir su arroz con leche.", "Prepara pan casero cada domingo."),
  pt("¿Qué detalle NO apoya la oración temática?", "Oración temática: Las bibliotecas son lugares útiles.", "El parque tiene una pileta nueva.", "Allí se prestan libros gratis.", "Hay un lugar tranquilo para estudiar.", "Se puede usar internet para investigar."),
];

const TOPIC_NARRATIVE: ChoiceItem[] = [
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Primero se me perdió un zapato. Luego perdí el bus. Para colmo, olvidé mi lonchera.", "Ayer tuve una mañana terrible.", "Mi lonchera es roja.", "Los buses pasan cada diez minutos por mi casa."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Subimos a los juegos, comimos algodón dulce y vimos a los payasos. Nadie quería irse.", "La feria fue muy divertida.", "El algodón es rosado.", "Los payasos usan zapatos muy grandes y pelucas."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ La luz se apagó de golpe. Se oyó un crujido en la escalera. Mi hermano y yo nos tapamos con la frazada.", "Esa noche pasamos mucho miedo.", "La frazada es gruesa.", "Mi hermano tiene dos años menos que yo."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Metimos un gol en el último minuto. Todos corrimos a abrazarnos. El entrenador lloró de alegría.", "Ganamos la final de una forma increíble.", "El pasto estaba mojado.", "El entrenador usa siempre una gorra azul marino."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Le di agua, le armé una cama con trapos y le puse nombre. Ahora duerme a mis pies.", "Ayer encontré un gatito en la calle.", "Los trapos eran viejos.", "El agua de mi casa sale fría por las mañanas."),
];

const TOPIC_EXPOSITORY: ChoiceItem[] = [
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Algunas viven en el agua y otras en la tierra. Todas llevan un caparazón duro. Pueden vivir más de cien años.", "Las tortugas son animales fascinantes.", "El caparazón es duro.", "En el zoológico hay muchos animales distintos."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Hay que dormir ocho horas, comer frutas y hacer ejercicio. También es importante lavarse las manos.", "Hay varias formas de cuidar la salud.", "Las frutas son dulces.", "El jabón se vende en todas las tiendas del barrio."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ El Sol nos da luz y calor. Gracias a él crecen las plantas. Sin el Sol no habría vida en la Tierra.", "El Sol es muy importante para la Tierra.", "El Sol sale temprano.", "La Luna se ve mejor en las noches despejadas."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Con ella se hacen chompas, gorros y mantas. Es muy suave y abriga mucho. Se vende en todo el mundo.", "La lana de alpaca es muy valiosa.", "Los gorros abrigan.", "Las mantas se guardan dobladas en el ropero."),
  pt("¿Qué oración temática va al inicio del párrafo?", "___ Los buses llevan a muchas personas. Las bicicletas no contaminan. Los trenes son rápidos.", "Existen distintos medios de transporte.", "Los trenes son largos.", "Las pistas de la ciudad tienen muchos huecos."),
];

const MATCH_PURPOSE: ChoiceItem[] = [
  w("Quieres CONVENCER a tus compañeros de cuidar las plantas. ¿Qué texto escribes?", "«Cuidemos las plantas del patio: nos dan sombra y aire limpio. ¡Riégalas!»", "«Las plantas tienen raíz, tallo y hojas.»", "«Había una vez una planta que quería caminar por el patio de la escuela y saludar a todos.»"),
  w("Quieres INFORMAR sobre los pingüinos. ¿Qué texto escribes?", "«Los pingüinos son aves que no vuelan y nadan muy bien.»", "«¡Adopta un pingüino de peluche hoy!»", "«El pingüino Pipo soñaba con volar hasta la luna y tomar helado.»"),
  w("Quieres ENTRETENER con un cuento. ¿Qué texto escribes?", "«El ratón abrió la puerta y encontró un queso que hablaba.»", "«Los ratones son roedores.»", "«Compra la trampa Atrapatodo: ¡la mejor y más barata de todo el mercado!»"),
  w("Quieres EXPLICAR CÓMO hacer un avión de papel. ¿Qué texto escribes?", "«Primero dobla la hoja por la mitad. Luego dobla las puntas.»", "«Los aviones vuelan alto.»", "«El avión de papel más grande del mundo fue hecho en un país lejano.»"),
  w("Quieres CONVENCER a tu familia de adoptar un perro. ¿Qué texto escribes?", "«Un perro nos cuidaría y nos alegraría. ¡Yo lo pasearé cada día!»", "«Los perros tienen cuatro patas.»", "«Un perro llamado Rayo ganó una carrera muy larga en medio del desierto.»"),
  w("Quieres INFORMAR sobre el horario de la feria. ¿Qué texto escribes?", "«La feria abrirá el sábado de 9 a. m. a 5 p. m. en el patio.»", "«¡La feria es lo máximo!»", "«En la feria del año pasado, un mago perdió su conejo y nadie lo encontró.»"),
];

const TIME_IN = [
  s("Primero lavé los platos y después barrí la cocina.", "Primero", "después"), s("Luego de almorzar, finalmente salimos al parque.", "Luego", "finalmente"),
  s("Antes de dormir, siempre leo un cuento.", "Antes", "siempre"), s("Ayer llovió y hoy salió el sol.", "Ayer", "hoy"),
  s("Mientras cocinaba, sonó el teléfono; entonces apagué la hornilla.", "Mientras", "entonces"), s("Al principio tenía miedo, pero más tarde me divertí.", "principio", "tarde"),
  s("Mañana iremos al museo y pronto te contaré todo.", "Mañana", "pronto"), s("Por último, guardamos los materiales.", "último"),
];
const TIME_USE: ChoiceItem[] = [
  f("___ de cruzar la pista, mira a ambos lados.", "Antes", "Después", "Mientras"),
  f("Primero me cepillo los dientes y ___ me acuesto.", "luego", "antes", "ayer"),
  f("___ llueve, juego dentro de casa.", "Mientras", "Finalmente", "Primero"),
  f("Estudié mucho y, ___, aprobé el examen.", "finalmente", "antes", "mientras tanto"),
  f("___ fuimos a la playa; hoy descansamos en casa.", "Ayer", "Mañana", "Luego"),
  f("Batimos los huevos; ___, agregamos la harina.", "después", "anoche", "antes"),
  f("___ que termines la tarea, podrás jugar.", "Después de", "Antes de", "Mientras"),
  f("___ visitaremos a los abuelos: ya tenemos los pasajes.", "Mañana", "Ayer", "Anoche"),
];
const COORD: ChoiceItem[] = [
  f("Quiero ir al cine, ___ no tengo dinero.", "pero", "o", "ni"), f("¿Prefieres jugo ___ limonada?", "o", "pero", "ni"),
  f("Ana canta ___ baila muy bien.", "y", "ni", "pero"), f("No tengo frío ___ hambre.", "ni", "o", "pero"),
  f("No es un perro, ___ un lobo.", "sino", "sin embargo", "y"), f("Estudié mucho, ___ aprobé.", "así que", "sin embargo", "ni"),
  f("Llovía fuerte, ___ salimos igual.", "pero", "o", "ni"), f("Padre ___ hijo fueron a pescar.", "e", "o", "ni"),
  f("¿Vienes hoy ___ mañana?", "o", "y", "ni"), f("Compré siete ___ ocho manzanas.", "u", "e", "ni"),
];
const SUBORD: ChoiceItem[] = [
  f("No salí al recreo ___ estaba resfriado.", "porque", "aunque", "si"), f("___ llueve, llevaré paraguas.", "Si", "Ni", "Aunque"),
  f("Fui a entrenar ___ estaba cansado.", "aunque", "porque", "si"), f("Te llamaré ___ llegue a casa.", "cuando", "aunque", "porque"),
  f("Leo un libro ___ espero el bus.", "mientras", "para que", "si"), f("Estudia ___ apruebes el examen.", "para que", "aunque", "mientras"),
  f("Me quedé en casa ___ tenía fiebre.", "porque", "si", "para que"), f("___ termines, avísame.", "Cuando", "Aunque", "Porque"),
  f("___ hace frío, no me pongo casaca.", "Aunque", "Porque", "Para que"),
];
const TRANSITION: ChoiceItem[] = [
  f("Me gustan las frutas. ___, como plátano todos los días.", "Por ejemplo", "Sin embargo", "En cambio"),
  f("Quería ir a la playa. ___, empezó a llover.", "Sin embargo", "Por ejemplo", "Además"),
  f("El gato es limpio. ___, es muy silencioso.", "Además", "En cambio", "Por eso"),
  f("No dormí bien. ___, hoy tengo sueño.", "Por eso", "Sin embargo", "Pero"),
  f("A mi hermano le gusta el fútbol. ___, yo prefiero el vóley.", "En cambio", "Por eso", "Además"),
  f("Primero estudiamos el tema. ___, hicimos un resumen.", "Luego", "Sin embargo", "Pero"),
  f("Reciclar ahorra agua y energía. ___, ayuda a cuidar el planeta.", "En resumen", "En cambio", "Sin embargo"),
  f("Hay animales que vuelan. ___, el cóndor y el colibrí.", "Por ejemplo", "Por eso", "Sin embargo"),
];
const LINK_PASSAGE: ChoiceItem[] = [
  f("El sábado quisimos hacer un picnic. ___, amaneció lloviendo. Por eso lo hicimos en la sala.", "Sin embargo", "Además", "Por ejemplo"),
  f("Las abejas son muy útiles. Hacen miel y, ___, ayudan a las flores a dar frutos.", "además", "pero", "sin embargo"),
  f("Mi hermana estudió toda la semana. ___, sacó la mejor nota.", "Por eso", "En cambio", "Aunque"),
  f("Para hacer la maqueta, primero corta el cartón. ___ pega las piezas y, por último, píntala.", "Luego", "Antes", "Sin embargo"),
  f("Hay muchos animales en peligro. ___, el oso de anteojos y el cóndor.", "Por ejemplo", "Sin embargo", "Por eso"),
  f("A Luis le encanta el ajedrez. Su primo, ___, prefiere correr y trepar.", "en cambio", "por ejemplo", "además"),
  f("Llegué tarde ___ perdí el bus. Mañana saldré más temprano.", "porque", "aunque", "sino"),
];

const FACT = sorter(["Hecho", "Opinión"], "¿Es un hecho o una opinión?");
const FACT_OPINION: ChoiceItem[] = [
  FACT("El Perú tiene costa, sierra y selva.", 0), FACT("La selva es la región más bonita.", 1), FACT("Una semana tiene siete días.", 0), FACT("El lunes es el peor día de la semana.", 1),
  FACT("Las arañas tienen ocho patas.", 0), FACT("Las arañas son horribles.", 1), FACT("El agua hierve a 100 grados al nivel del mar.", 0), FACT("El chocolate es el mejor sabor de helado.", 1),
  FACT("Lima es la capital del Perú.", 0), FACT("Todos deberían aprender a tocar guitarra.", 1), FACT("La Tierra gira alrededor del Sol.", 0), FACT("Leer es más divertido que ver televisión.", 1),
];

const AUTHOR_OPINION: ChoiceItem[] = [
  pt("¿Cuál es la opinión del autor?", "El recreo dura veinte minutos. Creo que debería durar más. Los niños necesitan moverse.", "El recreo debería durar más.", "El recreo dura veinte minutos.", "Los niños van al patio."),
  pt("¿Cuál es la opinión del autor?", "Los gatos duermen unas quince horas al día. Para mí, son las mascotas ideales. No hay que pasearlos.", "Los gatos son las mascotas ideales.", "Los gatos duermen unas quince horas al día.", "No hay que pasearlos."),
  pt("¿Cuál es la opinión del autor?", "En mi escuela hay un huerto. Pienso que todas las escuelas deberían tener uno. Allí sembramos lechugas.", "Todas las escuelas deberían tener un huerto.", "En mi escuela hay un huerto donde sembramos lechugas.", "Allí sembramos lechugas."),
  pt("¿Cuál es la opinión del autor?", "El ajedrez tiene 32 piezas. En mi opinión, es el mejor juego de mesa. Se juega entre dos.", "El ajedrez es el mejor juego de mesa.", "El ajedrez tiene 32 piezas y se juega entre dos.", "Se juega entre dos."),
  pt("¿Cuál es la opinión del autor?", "La playa queda a una hora. Me parece que el verano es la mejor estación. En verano no hay clases.", "El verano es la mejor estación.", "La playa queda a una hora de mi casa.", "En verano no hay clases."),
  pt("¿Cuál es la opinión del autor?", "Los libros de la biblioteca se prestan por una semana. Considero que ese tiempo es muy corto. Hay libros muy largos.", "Una semana de préstamo es muy poco.", "Los libros se prestan por una semana.", "Hay libros muy largos."),
];

const REASONS: ChoiceItem[] = [
  pt("¿Qué razón apoya la opinión?", "Opinión: Deberíamos tener más clases de arte.", "El arte desarrolla la creatividad.", "El salón de arte es grande.", "Los lunes hay clase de matemática."),
  pt("¿Qué razón apoya la opinión?", "Opinión: Es mejor ir a la escuela caminando.", "Caminar es un buen ejercicio.", "Los buses son de colores.", "Mi escuela tiene dos pisos y un patio."),
  pt("¿Qué razón apoya la opinión?", "Opinión: Todos deberían tener una mascota.", "Las mascotas enseñan a ser responsables.", "Los peces viven en el agua de ríos, lagos y mares.", "Mi vecino tiene un carro."),
  pt("¿Qué razón apoya la opinión?", "Opinión: Hay que apagar las luces al salir.", "Así se ahorra energía.", "Hay focos.", "La sala tiene dos ventanas."),
  pt("¿Qué razón apoya la opinión?", "Opinión: El desayuno es la comida más importante.", "Da energía para toda la mañana.", "La leche es blanca.", "El almuerzo se sirve a la una de la tarde."),
  pt("¿Qué razón apoya la opinión?", "Opinión: Los niños deberían leer todas las noches.", "Leer amplía el vocabulario.", "Las camas tienen almohadas.", "Los libros tienen páginas."),
];

const OPINION_EXAMPLE: ChoiceItem[] = [
  pt("¿Qué ejemplo completa el texto?", "Jugar al aire libre es saludable porque nos hace movernos. Por ejemplo, ___", "al jugar a las chapadas corremos mucho.", "mi casa tiene un patio.", "los videojuegos tienen muchos niveles y premios."),
  pt("¿Qué ejemplo completa el texto?", "Los perros son muy útiles para las personas. Por ejemplo, ___", "hay perros guía que ayudan a personas ciegas.", "mi perro es marrón.", "los gatos también maúllan de noche en los techos."),
  pt("¿Qué ejemplo completa el texto?", "Reciclar permite dar nueva vida a los objetos. Por ejemplo, ___", "con botellas se pueden hacer macetas.", "las botellas son de plástico.", "la basura se recoge los martes y los viernes."),
  pt("¿Qué ejemplo completa el texto?", "Los libros nos llevan a lugares lejanos. Por ejemplo, ___", "con un cuento conocí el Polo Norte.", "mi libro tiene tapa dura.", "la biblioteca cierra a las cinco de la tarde."),
  pt("¿Qué ejemplo completa el texto?", "Ayudar en casa nos enseña cosas útiles. Por ejemplo, ___", "al cocinar aprendemos a medir.", "mi casa es de ladrillo.", "mi mamá trabaja en una oficina."),
];
const OPINION_REASON: ChoiceItem[] = [
  pt("¿Qué razón completa el texto?", "Creo que deberíamos sembrar árboles en la escuela porque ___ Así el patio sería más fresco.", "dan sombra y limpian el aire.", "son de color verde.", "el patio tiene un arco de fútbol."),
  pt("¿Qué razón completa el texto?", "Pienso que es bueno aprender otro idioma porque ___ Además, se pueden leer más libros.", "permite hablar con más personas.", "los idiomas tienen palabras.", "mi prima vive en otra ciudad muy lejana."),
  pt("¿Qué razón completa el texto?", "En mi opinión, hay que comer menos golosinas porque ___ Es mejor comer fruta.", "tienen demasiada azúcar.", "vienen en bolsas.", "la tienda abre temprano."),
  pt("¿Qué razón completa el texto?", "Me parece que todos deberían aprender a nadar porque ___ Además, es un buen ejercicio.", "puede salvarte la vida.", "hay agua.", "las piscinas tienen escaleras."),
  pt("¿Qué razón completa el texto?", "Opino que el uniforme es útil porque ___ Tampoco hay que pensar qué ponerse.", "todos se ven iguales y nadie se burla.", "tiene botones.", "la escuela tiene un escudo bordado en la camisa."),
];

const PART = sorter(["Opinión", "Razón", "Ejemplo"], "En este texto, ¿qué es la parte que va entre «»?");
const OPINION_TABLE: ChoiceItem[] = [
  PART("«Los niños deberían dormir temprano.» Así descansan mejor. Por ejemplo, yo rindo más cuando duermo nueve horas.", 0),
  PART("Los niños deberían dormir temprano. «Así descansan mejor.» Por ejemplo, yo rindo más cuando duermo nueve horas.", 1),
  PART("Los niños deberían dormir temprano. Así descansan mejor. «Por ejemplo, yo rindo más cuando duermo nueve horas.»", 2),
  PART("«El parque es el mejor lugar para jugar.» Hay mucho espacio. Por ejemplo, allí podemos volar cometas.", 0),
  PART("El parque es el mejor lugar para jugar. «Hay mucho espacio.» Por ejemplo, allí podemos volar cometas.", 1),
  PART("El parque es el mejor lugar para jugar. Hay mucho espacio. «Por ejemplo, allí podemos volar cometas.»", 2),
  PART("«Es importante tomar agua.» El cuerpo la necesita para funcionar. Por ejemplo, sin agua nos duele la cabeza.", 0),
  PART("Es importante tomar agua. «El cuerpo la necesita para funcionar.» Por ejemplo, sin agua nos duele la cabeza.", 1),
  PART("Es importante tomar agua. El cuerpo la necesita para funcionar. «Por ejemplo, sin agua nos duele la cabeza.»", 2),
];

const BETTER = "¿Qué oración da más detalles?";
const DESCRIPTIVE: ChoiceItem[] = [
  pt(BETTER, "El perro ladró.", "El perro lanudo ladró furioso.", "El perro hizo ruido, mucho ruido, ayer.", "Un perro ladró ayer."),
  pt(BETTER, "Comí una fruta.", "Comí un mango jugoso y dulce.", "Comí algo de fruta, una fruta que me gustó.", "Yo comí una fruta."),
  pt(BETTER, "La casa era vieja.", "La casa tenía muros rajados.", "La casa no era nueva, sino más bien vieja.", "Era una casa vieja."),
  pt(BETTER, "Hacía frío.", "El viento helado me cortaba la cara.", "Hacía bastante frío, muchísimo frío, ese día.", "Ese día hacía frío."),
  pt(BETTER, "El niño corrió.", "El niño corrió descalzo por la arena.", "El niño fue rápido, muy rápido, rapidísimo.", "Corrió el niño allí."),
  pt(BETTER, "Había flores.", "Había geranios rojos en la ventana.", "Había unas flores.", "Vi que había flores, unas cuantas flores, allí."),
  pt(BETTER, "La sopa estaba rica.", "La sopa humeante olía a culantro.", "La sopa estaba buena, de verdad muy buena.", "Me gustó esa sopa."),
];

const EMOTIONS: ChoiceItem[] = [
  pt("¿Qué oración MUESTRA la emoción en lugar de solo decirla?", "Marta estaba nerviosa.", "A Marta le sudaban las manos y no dejaba de mover el pie.", "Marta se sentía muy pero muy nerviosa ese día antes del examen.", "Marta tenía nervios."),
  pt("¿Qué oración MUESTRA la emoción en lugar de solo decirla?", "Luis estaba feliz.", "Luis saltó, gritó «¡sí!» y abrazó a todos.", "Luis estaba realmente muy feliz esa tarde.", "Luis sentía felicidad."),
  pt("¿Qué oración MUESTRA la emoción en lugar de solo decirla?", "El niño tenía miedo.", "El niño se tapó hasta la nariz y contuvo la respiración.", "El niño sentía un miedo bastante grande, enorme, en su cuarto.", "El niño estaba con miedo."),
  pt("¿Qué oración MUESTRA la emoción en lugar de solo decirla?", "Papá estaba enojado.", "Papá frunció el ceño y cerró la puerta de un golpe.", "Papá estaba muy enojado con todos nosotros esa tarde.", "Papá sentía enojo."),
  pt("¿Qué oración MUESTRA que el personaje es generoso?", "Rosa es generosa.", "Rosa partió su pan y le dio la mitad a Tomás.", "Rosa es una niña sumamente generosa con todos.", "Rosa tiene generosidad."),
  pt("¿Qué oración MUESTRA que el personaje es ordenado?", "Iván es ordenado.", "Iván guardó cada lápiz en su lugar y dobló su ropa.", "Iván es, sin duda, el niño más ordenado de todo el salón.", "Iván tiene mucho orden."),
];

const STRONG_VERB: ChoiceItem[] = [
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "El gato FUE hacia el ratón.", "se abalanzó", "anduvo despacio", "estuvo"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "—¡Cuidado! —DIJO el bombero.", "gritó", "habló", "contó"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "La niña COMIÓ la torta en un minuto.", "devoró", "probó", "tomó"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "El anciano CAMINABA despacio, apoyado en su bastón.", "cojeaba", "corría", "andaba"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "Las hojas CAÍAN con el viento.", "revoloteaban", "bajaban", "permanecían quietas"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "—Tengo un secreto —DIJO Ana en voz baja.", "susurró", "exclamó", "habló"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "El ladrón SALIÓ por la ventana.", "escapó", "pasó", "estuvo"),
  pt("¿Qué verbo es más preciso que el que está en MAYÚSCULAS?", "El niño MIRÓ el juguete con atención.", "examinó", "encontró", "vio"),
];

const JOIN = "¿Cómo se unen las dos oraciones en una sola?";
const COMBINE_SP: ChoiceItem[] = [
  pt(JOIN, "Lucas juega fútbol. Mateo juega fútbol.", "Lucas y Mateo juegan fútbol.", "Lucas juega y Mateo fútbol.", "Lucas y Mateo juega fútbol."),
  pt(JOIN, "El perro ladra. El perro corre.", "El perro ladra y corre.", "El perro ladra el perro corre.", "El perro y ladra corre."),
  pt(JOIN, "Mi tía canta. Mi tío canta.", "Mi tía y mi tío cantan.", "Mi tía canta mi tío.", "Mi tía y mi tío canta."),
  pt(JOIN, "Sara dibuja. Sara pinta.", "Sara dibuja y pinta.", "Sara dibuja y Sara.", "Sara y pinta dibuja."),
  pt(JOIN, "Las vacas pastan. Las ovejas pastan.", "Las vacas y las ovejas pastan.", "Las vacas pastan las ovejas.", "Las vacas y las ovejas pasta."),
  pt(JOIN, "El bebé llora. El bebé patalea.", "El bebé llora y patalea.", "El bebé llora, el bebé.", "El bebé y patalea llora."),
];
const COMBINE_DETAILS: ChoiceItem[] = [
  pt(JOIN, "Tengo un gato. El gato es negro.", "Tengo un gato negro.", "Tengo un gato y es.", "Tengo negro un gato el."),
  pt(JOIN, "Vimos una película. La película era de terror.", "Vimos una película de terror.", "Vimos una película y la película era.", "Vimos de terror y película."),
  pt(JOIN, "Mi mamá preparó sopa. La sopa era de pollo.", "Mi mamá preparó sopa de pollo.", "Mi mamá preparó sopa y la sopa era.", "Mi mamá de pollo preparó."),
  pt(JOIN, "El niño encontró una moneda. La moneda estaba en el parque.", "El niño encontró una moneda en el parque.", "El niño encontró una moneda y la moneda estaba.", "El niño en el parque una moneda."),
  pt(JOIN, "Compré un cuaderno. El cuaderno tiene cien hojas.", "Compré un cuaderno de cien hojas.", "Compré un cuaderno y el cuaderno tiene.", "Compré cien hojas cuaderno un."),
  pt(JOIN, "Llegó una carta. La carta era de mi abuela.", "Llegó una carta de mi abuela.", "Llegó una carta y la carta era.", "Llegó de mi abuela una."),
];
const VARIED: ChoiceItem[] = [
  pt("Sigue el modelo: «Cuando llueve, me quedo en casa.» ¿Qué oración tiene la misma forma?", "Cuando llueve, me quedo en casa.", "Cuando amanece, canta el gallo.", "El gallo canta cuando amanece.", "El gallo canta fuerte y luego amanece."),
  pt("Sigue el modelo: «Cansado, el niño se durmió.» ¿Qué oración tiene la misma forma?", "Cansado, el niño se durmió.", "Asustada, la gata se escondió.", "La gata se escondió asustada.", "La gata estaba muy asustada."),
  pt("Sigue el modelo: «¿Has visto alguna vez un cóndor?» ¿Qué oración tiene la misma forma?", "¿Has visto alguna vez un cóndor?", "¿Has probado alguna vez la quinua?", "La quinua es muy nutritiva y también rica.", "¡Prueba la quinua ahora!"),
  pt("Sigue el modelo: «Ana corrió, saltó y ganó.» ¿Qué oración tiene la misma forma?", "Ana corrió, saltó y ganó.", "Luis llegó, comió y durmió.", "Luis llegó porque tenía sueño.", "Luis, que llegó tarde, durmió."),
  pt("Sigue el modelo: «En el jardín, las flores se abren.» ¿Qué oración tiene la misma forma?", "En el jardín, las flores se abren.", "En el río, los peces saltan.", "Los peces saltan mucho en el río.", "¡Cómo saltan los peces!"),
  pt("Sigue el modelo: «¡Qué alto vuela esa cometa!» ¿Qué oración tiene la misma forma?", "¡Qué alto vuela esa cometa!", "¡Qué rápido corre ese perro!", "Ese perro corre rápido en el parque.", "¿Corre rápido ese perro?"),
];

const SIGNS: ChoiceItem[] = [
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «prohibido pisar el pasto»", "«Prohibido pisar el pasto»", "«prohibido Pisar el pasto»", "«prohibido pisar el Pasto»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Se vende elados»", "«Se venden helados»", "«Se bende elados»", "«Se vende eladoz»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Cuidado con el Perro»", "«Cuidado con el perro»", "«cuidado con el Perro»", "«Cuidado Con el Perro»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Bienvenidos a lima»", "«Bienvenidos a Lima»", "«bienvenidos a lima»", "«Bienvenidos A lima»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Dónde está la salida»", "«¿Dónde está la salida?»", "«Dónde está la salida?»", "«¡Dónde está la salida»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Lave sus mano»", "«Lave sus manos»", "«Lave su manos»", "«Laven sus mano»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «No votar basura»", "«No botar basura»", "«No votar vasura»", "«No botar vasura»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Abierto de lunes a Viernes»", "«Abierto de lunes a viernes»", "«Abierto de Lunes a Viernes»", "«abierto de lunes a Viernes»"),
  pt("Este cartel tiene un error. ¿Cómo se corrige?", "🪧 «Silensio, por favor»", "«Silencio, por favor»", "«Silenzio, por favor»", "«Cilencio, por favor»"),
];

export const ROWS: Row[] = [
  ["W.1", "Poner las oraciones en orden", (r) => order(r, "Ordena las oraciones.", SENTENCE_ORDER)],
  ["W.2", "Ordenar de lo más general a lo más específico", (r) => order(r, "Ordena de lo más general a lo más específico.", GENERAL_SPECIFIC)],
  ["W.3", "Organizar la información por tema", (r) => choose(r, "", BY_TOPIC)],

  ["X.1", "Seleccionar el detalle que no apoya la oración temática", (r) => choose(r, "", NOT_SUPPORT)],
  ["X.2", "Elegir oraciones temáticas para párrafos narrativos", (r) => choose(r, "", TOPIC_NARRATIVE)],
  ["X.3", "Elegir oraciones temáticas para párrafos expositivos", (r) => choose(r, "", TOPIC_EXPOSITORY)],

  ["Y.1", "Elegir el texto que corresponde al propósito del escritor", (r) => choose(r, "", MATCH_PURPOSE)],

  ["Z.1", "Identificar palabras de orden en el tiempo", (r) => pickInSentence(r, "Selecciona las palabras que indican orden o momento en el tiempo.", TIME_IN)],
  ["Z.2", "Usar palabras de orden en el tiempo", (r) => choose(r, "Completa la oración.", TIME_USE)],
  ["Z.3", "Usar conjunciones coordinantes: y, e, o, u, ni, pero, sino", (r) => choose(r, "Completa la oración.", COORD)],
  ["Z.4", "Usar conjunciones subordinantes: porque, si, cuando, aunque, mientras", (r) => choose(r, "Completa la oración.", SUBORD)],
  ["Z.5", "Elegir el mejor conector", (r) => choose(r, "Completa con el mejor conector.", TRANSITION)],
  ["Z.6", "Usar conectores para completar un texto", (r) => choose(r, "Completa el texto.", LINK_PASSAGE)],

  ["AA.1", "Distinguir hechos de opiniones", (r) => choose(r, "", FACT_OPINION)],
  ["AA.2", "Identificar la opinión que expresa el autor", (r) => choose(r, "", AUTHOR_OPINION)],
  ["AA.3", "Elegir razones que apoyen una opinión", (r) => choose(r, "", REASONS)],
  ["AA.4", "Completar el texto de opinión con un ejemplo", (r) => choose(r, "", OPINION_EXAMPLE)],
  ["AA.5", "Completar el texto de opinión con una razón", (r) => choose(r, "", OPINION_REASON)],
  ["AA.6", "Completar el cuadro de opinión, razón y ejemplo", (r) => choose(r, "", OPINION_TABLE)],

  ["BB.1", "Agregar detalles descriptivos a las oraciones", (r) => choose(r, "", DESCRIPTIVE)],
  ["BB.2", "Mostrar las emociones y los rasgos de los personajes", (r) => choose(r, "", EMOTIONS)],
  ["BB.3", "Mejorar la oración con un verbo más preciso", (r) => choose(r, "", STRONG_VERB)],

  ["CC.1", "Unir oraciones: sujetos y predicados", (r) => choose(r, "", COMBINE_SP)],
  ["CC.2", "Unir oraciones agregando detalles clave", (r) => choose(r, "", COMBINE_DETAILS)],
  ["CC.3", "Crear oraciones variadas a partir de modelos", (r) => choose(r, "", VARIED)],

  ["DD.1", "Corregir errores en carteles", (r) => choose(r, "", SIGNS)],
];
