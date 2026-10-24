import * as G from "../../generators";
import * as K from "../../generators/kinder";
import * as C from "../../generators/cneb/p2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 2.° de Primaria, organizado según el CNEB: las cuatro
// competencias de matemática y, dentro de cada una, los temas que piden los
// desempeños de 2.° grado (números hasta 100, problemas de agregar, quitar,
// juntar, separar, comparar e igualar, doble y mitad, patrones, cuerpos que
// ruedan, tablas de conteo, posible e imposible...). Las secciones marcadas
// «para ir más allá» amplían lo que pide el CNEB para este grado.
//
// Cada juego mezcla varias formas de preguntar la misma idea (`mix`): son
// menos juegos que antes, pero cada uno más completo.

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);

const SECTIONS: Section[] = [
  // Resuelve problemas de cantidad
  { id: "numeros", name: "Números hasta 100", icon: "🔢", topic: "numeros" },
  { id: "numeros-1000", name: "Números hasta 1 000 (para ir más allá)", icon: "🔢", topic: "numeros" },
  { id: "suma-resta", name: "Sumar y restar", icon: "➕", topic: "suma-resta" },
  { id: "problemas", name: "Problemas de suma y resta", icon: "🧠", topic: "suma-resta" },
  { id: "multiplicar", name: "Primeros pasos para multiplicar (para ir más allá)", icon: "✖️", topic: "multiplicacion-division" },
  { id: "mitades", name: "Fracciones (para ir más allá)", icon: "🍕", topic: "fracciones" },
  { id: "dinero", name: "Soles y compras", icon: "💰", topic: "dinero" },
  { id: "tiempo-masa", name: "El tiempo y el peso", icon: "⏱️", topic: "tiempo-masa" },
  // Resuelve problemas de regularidad, equivalencia y cambio
  { id: "patrones", name: "Patrones", icon: "🎨", topic: "patrones" },
  { id: "igualdades", name: "Igualdades", icon: "⚖️", topic: "igualdades" },
  // Resuelve problemas de forma, movimiento y localización
  { id: "figuras", name: "Figuras planas", icon: "🔷", topic: "figuras" },
  { id: "cuerpos", name: "Cuerpos geométricos", icon: "🧊", topic: "cuerpos" },
  { id: "ubicacion", name: "¿Dónde está?", icon: "🧭", topic: "ubicacion" },
  { id: "longitud", name: "Medir longitudes", icon: "📏", topic: "longitud-area" },
  // Resuelve problemas de gestión de datos e incertidumbre
  { id: "datos", name: "Tablas y gráficos", icon: "📊", topic: "graficos" },
  { id: "azar", name: "¿Puede pasar?", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen];

const ROWS: Row[] = [
  ["contar-100", "numeros", "Cuenta hacia adelante y hacia atrás", (r) => G.countUpDown(r, 100)],
  ["recta-100", "numeros", "¿Qué número marca la recta?", mix((r) => G.numberLineTo(r, 100), G.readNumberLine)],
  ["saltos", "numeros", "Cuenta dando saltos de 2, de 5 y de 10", mix((r) => G.skipCount(r, [2, 5, 10]), G.countingPattern)],
  ["tablero-100", "numeros", "Los números escondidos del tablero del 100", G.hundredsChartMissing],
  ["par-impar", "numeros", "¿Par o impar?", (r) => G.evenOdd(r, 100)],
  ["decenas-unidades", "numeros", "Decenas y unidades", mix((r) => G.modelToTensOnes(r, 99), (r) => G.modelToNumber(r, 99), (r) => G.numberToTensOnes(r, 99), (r) => G.placeValueDigit(r, "tens"))],
  ["canjes", "numeros", "Canjea 10 unidades por una decena", mix((r) => G.convertPlaceValue(r, "tens"), (r) => G.placeModelNumber(r, "tens"))],
  ["comparar-100", "numeros", "¿Mayor, menor o igual? Ordena los números", mix((r) => G.compareSymbol(r, 100), (r) => G.orderNumbers(r, 100, 4))],
  ["redondear", "numeros", "¿A qué decena está más cerca?", G.estimateToTen],
  ["ordinales", "numeros", "Del primero al vigésimo", C.ordinal20],
  ["doble-mitad", "numeros", "El doble y la mitad", (r) => C.doubleHalf(r, 50)],

  ["centenas", "numeros-1000", "Centenas, decenas y unidades", mix((r) => G.placeModelNumber(r, "hundreds"), (r) => G.placeValueDigit(r, "hundreds"), (r) => G.convertPlaceValue(r, "hundreds"))],
  ["contar-1000", "numeros-1000", "Cuenta, ubica y compara hasta 1 000", mix((r) => G.countUpDown(r, 1000), (r) => G.numberLineTo(r, 1000), (r) => G.compareSymbol(r, 1000), (r) => G.orderNumbers(r, 1000, 5), (r) => G.countingPatternTo(r, 1000))],

  ["calculo-20", "suma-resta", "Cálculo rápido hasta 20", mix(G.mixedFacts, (r) => G.addFacts(r, 18), (r) => G.subFacts(r, 18))],
  ["dobles", "suma-resta", "Dobles y casi dobles", mix(G.doubles, (r) => G.doublesNear(r, 1), (r) => G.doublesNear(r, -1), G.subDoubles)],
  ["completar-10", "suma-resta", "Completa la decena", mix(G.makeTen, (r) => G.addMissing(r, 10))],
  ["numero-escondido", "suma-resta", "El número escondido", mix((r) => G.addMissing(r, 18), (r) => G.subMissing(r, 18), G.completeEquation)],
  ["familias", "suma-resta", "Familias de operaciones", mix(G.factFamily, G.relatedMixed)],
  ["diez-mas-menos", "suma-resta", "Diez más, diez menos", mix(G.tenMoreOrLess, G.addSubMultipleOfTen, G.addTens, G.subTens)],
  ["sumas-dos-cifras", "suma-resta", "Sumas con números de dos cifras", mix((r) => G.addTwoDigitOne(r, false), (r) => G.addTwoDigitOne(r, true), (r) => G.addTwoTwo(r, false), (r) => G.addTwoTwo(r, true))],
  ["restas-dos-cifras", "suma-resta", "Restas con números de dos cifras", mix((r) => G.subTwoDigitOne(r, false), (r) => G.subTwoDigitOne(r, true), (r) => G.subTwoTwo(r, false), (r) => G.subTwoTwo(r, true))],
  ["sumar-o-restar", "suma-resta", "¿Sumo o resto?", G.addSubTwoDigit],
  ["aproximar", "suma-resta", "Calcula más o menos cuánto da", mix((r) => G.estimateTwoDigit(r, "+"), (r) => G.estimateTwoDigit(r, "−"))],
  ["centenas-suma-resta", "suma-resta", "Sumas y restas con centenas (para ir más allá)", mix(G.addHundreds, G.subHundreds, G.addThreeDigit, G.subThreeDigit, G.addSubThreeDigit)],

  ["agregar-quitar", "problemas", "Problemas de agregar y quitar", (r) => C.paev(r, ["agregar", "quitar"])],
  ["juntar-separar", "problemas", "Problemas de juntar y separar", (r) => C.paev(r, ["juntar", "separar"])],
  ["comparar", "problemas", "Problemas de comparar: ¿cuántos más? ¿cuántos menos?", (r) => C.paev(r, ["comparar"])],
  ["igualar", "problemas", "Problemas de igualar", (r) => C.paev(r, ["igualar"])],
  ["problemas-mezcla", "problemas", "Resuelve problemas de todo tipo", (r) => C.paev(r, ["agregar", "quitar", "juntar", "separar", "comparar", "igualar"])],

  ["grupos-iguales", "multiplicar", "Grupos iguales y sumas repetidas", mix(G.multEqualGroups, (r) => G.arrayRepeatedAddition(r, 25), G.multArrays)],
  ["tablas-2-5-10", "multiplicar", "Las tablas del 2, del 5 y del 10", (r) => G.multFacts(r, [2, 5, 10])],
  ["repartir", "multiplicar", "Reparte en partes iguales", mix(G.divArrays, (r) => G.divFacts(r, [2, 5, 10]))],

  ["partes-iguales", "mitades", "Mitades, tercios y cuartos", mix(G.halvesThirdsFourths, (r) => G.fractionOfShape(r, "circle", 4), G.fractionOfGroup)],
  ["pintar-partes", "mitades", "Pinta la parte que se pide", mix((r) => G.shadeFraction(r, "bar"), (r) => G.shadeFraction(r, "area"))],
  ["fracciones-recta", "mitades", "Fracciones en la recta numérica", mix((r) => G.fractionOnLine(r, true), (r) => G.fractionOnLine(r, false), (r) => G.graphFraction(r, true), (r) => G.graphFraction(r, false))],
  ["fracciones-equivalentes", "mitades", "Fracciones que valen lo mismo", mix(G.equivalentAreaModels, G.equivalentOnLines, G.fractionEqualToOne)],

  ["contar-soles", "dinero", "¿Cuántos soles hay?", C.countSoles],
  ["bodega", "dinero", "De compras en la bodega", C.shopProblem],

  ["calendario", "tiempo-masa", "Días, semanas y meses", mix(C.calendar, G.timeUnits)],
  ["reloj", "tiempo-masa", "¿Qué hora es?", (r) => K.clockK(r, "read")],
  ["pesa-mas", "tiempo-masa", "¿Qué pesa más?", (r) => K.measure(r, "heavy")],

  ["patrones-repeticion", "patrones", "Patrones que se repiten", mix(G.completePattern, G.createPattern)],
  ["patrones-numeros", "patrones", "Patrones que crecen y que decrecen", mix((r) => G.numberSequence(r, true), (r) => G.numberSequence(r, false))],
  ["regla-patron", "patrones", "Descubre la regla del patrón", C.patternRule],

  ["balanza", "igualdades", "La balanza en equilibrio", (r) => C.balance(r, 20)],
  ["igual-o-no", "igualdades", "¿Es verdadera la igualdad?", (r) => C.equalOrNot(r, 20)],
  ["propiedades", "igualdades", "Cambia el orden y suma igual", G.additionProperties],

  ["reconocer-figuras", "figuras", "Reconoce las figuras", mix(G.selectShapes2d, G.identifyShape2d)],
  ["lados-vertices", "figuras", "Lados y vértices", G.compareSidesVertices],

  ["ruedan", "cuerpos", "¿Rueda o no rueda?", C.rollsOrNot],
  ["reconocer-cuerpos", "cuerpos", "Reconoce los cuerpos geométricos", mix(G.selectSolids, G.identifySolid)],
  ["caras-vertices", "cuerpos", "Caras, aristas y vértices", mix(G.compareSolidParts, G.solidFaces)],
  ["cuerpos-entorno", "cuerpos", "Formas que hay a mi alrededor", mix(G.everydayObjects, G.tracedShapes)],
  ["desarrollos", "cuerpos", "Arma el cuerpo con su molde", G.netOfSolid],

  ["arriba-abajo", "ubicacion", "Arriba, abajo y al lado", mix(G.aboveBelow, G.gridPosition)],
  ["cuadricula", "ubicacion", "Ubica objetos en la cuadrícula", G.coordinatePlane],

  ["medir-objetos", "longitud", "Mide con clips, lápices y pasos", G.measureWithObjects],
  ["mas-largo", "longitud", "¿Cuál es más largo? Mide con la regla", mix(G.compareLengths, G.measureWithRuler)],

  ["tabla-conteo", "datos", "Tablas de conteo", C.tallyTable],
  ["pictogramas", "datos", "Pictogramas", (r) => K.graph(r, "interpret")],
  ["barras", "datos", "Gráficos de barras", (r) => G.interpretBarGraph(r, 1)],

  ["posible-imposible", "azar", "¿Posible o imposible?", C.possibleImpossible],
  ["mas-probable", "azar", "¿Qué es más probable? (para ir más allá)", mix(G.moreLikely, G.certainOrImpossible)],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  generate,
}));

export const MATEMATICAS_P2: Curriculum = { sections: SECTIONS, skills: SKILLS };
