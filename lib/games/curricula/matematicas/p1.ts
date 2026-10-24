import * as G from "../../generators";
import * as K from "../../generators/kinder";
import * as Ci from "../../generators/cneb/i5";
import * as C from "../../generators/cneb/p2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 1.° de Primaria, organizado según el CNEB (ciclo III). El
// modo CNEB trae lo de 1.° grado: números hasta 20, decenas y unidades,
// problemas de agregar, quitar y juntar, ordinales hasta el décimo, patrones
// de repetición, formas del entorno, medir con unidades no convencionales,
// pictogramas y posible/imposible. Lo marcado `extendido` adelanta 2.° y 3.°
// (números hasta 100 y 1 000, sumas de dos cifras, fracciones, soles...).

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const addK = (ks: number[]): Gen => mix(...ks.map((k): Gen => (r) => G.addK(r, k)));
const subK = (ks: number[]): Gen => mix(...ks.map((k): Gen => (r) => G.subK(r, k)));

const SECTIONS: Section[] = [
  // Resuelve problemas de cantidad
  { id: "numeros", name: "Números hasta 20", icon: "🔢", topic: "numeros" },
  { id: "numeros-100", name: "Números hasta 100 y más", icon: "💯", topic: "numeros", extended: true },
  { id: "suma-resta", name: "Sumar y restar hasta 20", icon: "➕", topic: "suma-resta" },
  { id: "problemas", name: "Problemas de suma y resta", icon: "🧠", topic: "suma-resta" },
  { id: "dos-cifras", name: "Sumas y restas con dos cifras", icon: "🧮", topic: "suma-resta", extended: true },
  { id: "fracciones", name: "Mitades, tercios y cuartos", icon: "🍕", topic: "fracciones", extended: true },
  { id: "tiempo-masa", name: "El tiempo y el peso", icon: "⏱️", topic: "tiempo-masa" },
  { id: "dinero", name: "Soles", icon: "💰", topic: "dinero", extended: true },
  // Resuelve problemas de regularidad, equivalencia y cambio
  { id: "patrones", name: "Patrones", icon: "🎨", topic: "patrones" },
  { id: "igualdades", name: "Igualdades", icon: "⚖️", topic: "igualdades" },
  // Resuelve problemas de forma, movimiento y localización
  { id: "figuras", name: "Figuras planas", icon: "🔷", topic: "figuras" },
  { id: "cuerpos", name: "Cuerpos geométricos", icon: "🧊", topic: "cuerpos" },
  { id: "ubicacion", name: "¿Dónde está?", icon: "🧭", topic: "ubicacion" },
  { id: "longitud", name: "Medir longitudes", icon: "📏", topic: "longitud-area" },
  // Resuelve problemas de gestión de datos e incertidumbre
  { id: "datos", name: "Pictogramas y tablas", icon: "📊", topic: "graficos" },
  { id: "azar", name: "¿Puede pasar?", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["contar-20", "numeros", "Cuenta hasta 20", mix((r) => G.countObjects(r, 10, true), (r) => G.countObjects(r, 10, false), (r) => K.count(r, 11, 20, "array"), (r) => K.count(r, 11, 20, "frame"))],
  ["recta", "numeros", "¿Qué número marca la recta?", G.readNumberLine],
  ["ordinales", "numeros", "Del primero al décimo", (r) => K.ordinal(r, 10)],
  ["decenas-20", "numeros", "Una decena y algunas unidades", mix((r) => G.modelToTensOnes(r, 20), (r) => G.modelToNumber(r, 20), (r) => G.numberToTensOnes(r, 20))],
  ["comparar-20", "numeros", "¿Mayor, menor o igual? Hasta 20", mix((r) => G.compareSymbol(r, 10), (r) => K.compareTwo(r, 20), (r) => K.orderK(r, 0, 20, 5))],
  ["par-impar", "numeros", "¿Par o impar?", (r) => G.evenOdd(r), X],

  ["saltos", "numeros-100", "Cuenta dando saltos de 2, de 5 y de 10", mix((r) => G.skipCount(r, [2]), (r) => G.skipCount(r, [5]), (r) => G.skipCount(r, [10]), (r) => G.skipCount(r, [2, 5, 10]), G.countingPattern)],
  ["tablero-100", "numeros-100", "El tablero del 100", G.hundredsChartMissing],
  ["contar-100", "numeros-100", "Cuenta hacia adelante y hacia atrás hasta 100", (r) => G.countUpDown(r, 100)],
  ["decenas-100", "numeros-100", "Decenas y unidades hasta 100", mix((r) => G.modelToTensOnes(r, 100), (r) => G.modelToNumber(r, 100), (r) => G.numberToTensOnes(r, 100))],
  ["comparar-100", "numeros-100", "Compara y ordena hasta 100", mix((r) => G.compareSymbol(r, 100), (r) => G.orderNumbers(r, 100, 4))],
  ["redondear", "numeros-100", "¿A qué decena está más cerca?", G.estimateToTen],
  ["numeros-1000", "numeros-100", "Cuenta, compara y ordena hasta 1 000", mix((r) => G.countUpDown(r, 1000), (r) => G.compareSymbol(r, 1000), (r) => G.orderNumbers(r, 1000, 5))],

  ["dibujo-operacion", "suma-resta", "¿Qué operación muestra el dibujo?", mix(G.addPictureEquation, G.takeawayPictureEquation, G.pictureEquationMixed)],
  ["sumas-10", "suma-resta", "Sumas hasta 10", mix((r) => G.addFacts(r, 10), (r) => G.addMissing(r, 10))],
  ["restas-10", "suma-resta", "Restas hasta 10", mix((r) => G.subFacts(r, 10), (r) => G.subMissing(r, 10))],
  ["sumar-0-3", "suma-resta", "Suma 0, 1, 2 y 3", addK([0, 1, 2, 3])],
  ["sumar-4-6", "suma-resta", "Suma 4, 5 y 6", addK([4, 5, 6])],
  ["sumar-7-9", "suma-resta", "Suma 7, 8 y 9", addK([7, 8, 9])],
  ["restar-0-3", "suma-resta", "Resta 0, 1, 2 y 3", subK([0, 1, 2, 3])],
  ["restar-4-6", "suma-resta", "Resta 4, 5 y 6", subK([4, 5, 6])],
  ["restar-7-9", "suma-resta", "Resta 7, 8 y 9", subK([7, 8, 9])],
  ["completar-10", "suma-resta", "Completa la decena", G.makeTen],
  ["dobles", "suma-resta", "Dobles y casi dobles", mix(G.doubles, (r) => G.doublesNear(r, 1), (r) => G.doublesNear(r, -1), G.subDoubles, G.doublesMixed)],
  ["sumas-20", "suma-resta", "Sumas hasta 20", (r) => G.addFacts(r, 20)],
  ["restas-20", "suma-resta", "Restas hasta 20", (r) => G.subFacts(r, 18)],
  ["mezcla-20", "suma-resta", "Sumas y restas mezcladas hasta 20", mix(G.mixedFacts, G.completeEquation)],
  ["familias", "suma-resta", "Familias de operaciones", mix(G.factFamily, G.relatedMixed, (r) => G.relatedAdd(r, 20), (r) => G.relatedSub(r, 18))],
  ["consigue", "suma-resta", "Consigue el número sumando o restando", mix((r) => G.makeTargetNumber(r, 10, "+"), (r) => G.makeTargetNumber(r, 20, "+"), (r) => G.makeTargetNumber(r, 10, "−"), (r) => G.makeTargetNumber(r, 18, "−"), (r) => G.mixedTargets(r)), X],

  ["agregar-quitar", "problemas", "Problemas de agregar y quitar", (r) => C.paev(r, ["agregar", "quitar"], 20)],
  ["juntar-separar", "problemas", "Problemas de juntar y separar", (r) => C.paev(r, ["juntar", "separar"], 20)],
  ["comparar-igualar", "problemas", "Problemas de comparar e igualar", (r) => C.paev(r, ["comparar", "igualar"], 20), X],

  ["diez-mas-menos", "dos-cifras", "Diez más, diez menos", mix(G.tenMoreOrLess, G.addSubMultipleOfTen, G.addSubTens, G.addTens, G.addMultipleOfTen, G.subTens, G.subMultipleOfTen)],
  ["sumas-sin-canje", "dos-cifras", "Sumas de dos cifras sin canjear", mix((r) => G.addTwoDigitOne(r, false), (r) => G.addTwoTwo(r, false))],
  ["sumas-con-canje", "dos-cifras", "Sumas de dos cifras canjeando", mix((r) => G.addTwoDigitOne(r, true), (r) => G.addTwoTwo(r, true))],
  ["restas-sin-canje", "dos-cifras", "Restas de dos cifras sin canjear", mix((r) => G.subTwoDigitOne(r, false), (r) => G.subTwoTwo(r, false))],
  ["restas-con-canje", "dos-cifras", "Restas de dos cifras canjeando", mix((r) => G.subTwoDigitOne(r, true), (r) => G.subTwoTwo(r, true))],
  ["aproximar", "dos-cifras", "Calcula más o menos cuánto da", mix((r) => G.estimateTwoDigit(r, "+"), (r) => G.estimateTwoDigit(r, "−"))],

  ["partes-iguales", "fracciones", "Mitades, tercios y cuartos", mix(G.halvesThirdsFourths, (r) => G.fractionOfShape(r, "circle", 4), G.fractionOfGroup)],
  ["fraccion-dibujo", "fracciones", "¿Qué fracción está pintada?", mix((r) => G.fractionOfShape(r, "bar", 8), (r) => G.fractionOfShape(r, "area", 8))],
  ["pintar-partes", "fracciones", "Pinta la parte que se pide", mix((r) => G.shadeFraction(r, "bar"), (r) => G.shadeFraction(r, "area"))],
  ["fracciones-recta", "fracciones", "Fracciones en la recta numérica", mix((r) => G.fractionOnLine(r, true), (r) => G.fractionOnLine(r, false))],

  ["antes-despues", "tiempo-masa", "Antes y después; ayer, hoy y mañana", Ci.timeNotions],
  ["calendario", "tiempo-masa", "Días, semanas y meses", mix(C.calendar, G.timeUnits)],
  ["pesa-mas", "tiempo-masa", "¿Qué pesa más?", (r) => K.measure(r, "heavy")],
  ["termometro", "tiempo-masa", "Lee el termómetro", G.readThermometer, X],

  ["contar-soles", "dinero", "¿Cuántos soles hay?", C.countSoles],
  ["monedas", "dinero", "Monedas de 1, 2 y 5 soles", mix((r) => K.money(r, "count125"), (r) => K.money(r, "compare"))],

  ["patrones-repeticion", "patrones", "Patrones que se repiten", mix(G.completePattern, G.createPattern)],
  ["patrones-numeros", "patrones", "Números que crecen y que decrecen", mix((r) => G.numberSequence(r, true), (r) => G.numberSequence(r, false))],

  ["balanza", "igualdades", "La balanza en equilibrio", (r) => C.balance(r, 10)],

  ["reconocer-figuras", "figuras", "Reconoce las figuras", mix(G.identifyShape2d, G.selectShapes2d)],
  ["lados-vertices", "figuras", "Lados y esquinas", G.compareSidesVertices],

  ["ruedan", "cuerpos", "¿Rueda o no rueda?", C.rollsOrNot],
  ["reconocer-cuerpos", "cuerpos", "Reconoce los cuerpos geométricos", mix(G.identifySolid, G.selectSolids)],
  ["caras-vertices", "cuerpos", "Caras, aristas y vértices", mix(G.compareSolidParts, G.solidFaces)],
  ["cuerpos-entorno", "cuerpos", "Formas que hay a mi alrededor", mix(G.everydayObjects, G.tracedShapes)],

  ["encima-debajo", "ubicacion", "Encima, debajo, izquierda y derecha", mix(G.aboveBelow, (r) => K.position(r, "lmr"))],
  ["cuadricula", "ubicacion", "¿En qué casilla está?", G.gridPosition],
  ["plano", "ubicacion", "Ubica objetos en el plano de coordenadas", G.coordinatePlane, X],

  ["medir-objetos", "longitud", "Mide con clips, lápices y pasos", G.measureWithObjects],
  ["mas-largo", "longitud", "¿Cuál es más largo?", G.compareLengths],
  ["regla", "longitud", "Mide con la regla", G.measureWithRuler, X],

  ["pictogramas", "datos", "Pictogramas", mix((r) => K.graph(r, "interpret"), (r) => K.graph(r, "correct"))],
  ["tabla-conteo", "datos", "Tablas de conteo", C.tallyTable],

  ["posible-imposible", "azar", "¿Posible o imposible?", C.possibleImpossible],
  ["mas-probable", "azar", "¿Qué es más probable?", mix(G.moreLikely, G.certainOrImpossible), X],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_P1: Curriculum = { sections: SECTIONS, skills: SKILLS };
