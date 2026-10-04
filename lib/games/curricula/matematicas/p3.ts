import * as G from "../../generators";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 3.° de Primaria (IXL: la.ixl.com/matematicas/3-grado). Mismas
// secciones, códigos y títulos que IXL. Se reutilizan los generadores de 1.° y
// 2.° con rangos mayores; lo nuevo de este grado (decimales, comparar y operar
// fracciones, divisiones largas, ángulos, unidades...) está en generadores
// parametrizados para que 4.° en adelante los reutilice.
const SECTIONS: Section[] = [
  { id: "A", name: "Números", icon: "🔢" },
  { id: "B", name: "Comparar y ordenar números", icon: "⚖️" },
  { id: "C", name: "Patrones y secuencias de números", icon: "🎨" },
  { id: "D", name: "Valor posicional", icon: "🧱" },
  { id: "E", name: "Sumar", icon: "➕" },
  { id: "F", name: "Restar", icon: "➖" },
  { id: "G", name: "Comprender la multiplicación", icon: "✖️" },
  { id: "H", name: "Entrenamiento de competencias de multiplicación", icon: "✖️" },
  { id: "I", name: "Multiplicar", icon: "✖️" },
  { id: "J", name: "Comprender la división", icon: "➗" },
  { id: "K", name: "Entrenamiento de competencias de división", icon: "➗" },
  { id: "L", name: "Dividir", icon: "➗" },
  { id: "M", name: "Operaciones mixtas", icon: "🔀" },
  { id: "N", name: "Comprender las fracciones", icon: "🍕" },
  { id: "O", name: "Comparar y ordenar fracciones", icon: "🍕" },
  { id: "P", name: "Fracciones equivalentes", icon: "🍕" },
  { id: "Q", name: "Sumar y restar fracciones", icon: "🍕" },
  { id: "R", name: "Comprender los decimales", icon: "🔟" },
  { id: "S", name: "Comparar y ordenar decimales", icon: "🔟" },
  { id: "T", name: "Sumar y restar decimales", icon: "🔟" },
  { id: "U", name: "Hacer estimaciones", icon: "🎯" },
  { id: "V", name: "Geometría", icon: "🔷" },
  { id: "W", name: "Medición", icon: "📏" },
  { id: "X", name: "Posición", icon: "📍" },
  { id: "Y", name: "Estadísticas y probabilidad", icon: "🎲" },
];

type Row = [id: string, title: string, generate: Skill["generate"]];

const TABLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ROWS: Row[] = [
  ["A.1", "Contar hacia delante y hacia atrás: hasta 100", (r) => G.countUpDown(r, 100)],
  ["A.2", "Rectas numéricas: hasta 100", (r) => G.numberLineTo(r, 100)],
  ["A.3", "Contar de tanto en tanto: hasta 100", (r) => G.skipCount(r, [2, 3, 4, 5, 10])],
  ["A.4", "Contar hacia delante y hacia atrás: hasta 1.000", (r) => G.countUpDown(r, 1000)],
  ["A.5", "Rectas numéricas: hasta 1.000", (r) => G.numberLineTo(r, 1000)],
  ["A.6", "Contar de tanto en tanto: hasta 1.000", (r) => G.skipCountTo(r, 1000)],
  ["A.7", "Seleccionar los números pares o impares", (r) => G.evenOdd(r, 1000)],
  ["A.8", "Números primos y compuestos", (r) => G.primeComposite(r, 50)],

  ["B.1", "Comparar números: hasta 100", (r) => G.compareSymbol(r, 100)],
  ["B.2", "Ordenar números hasta 100", (r) => G.orderNumbers(r, 100, 4)],
  ["B.3", "Comparar números: hasta 1.000", (r) => G.compareSymbol(r, 1000)],
  ["B.4", "Ordenar números hasta 1.000", (r) => G.orderNumbers(r, 1000, 5)],
  ["B.5", "Ordenar números mayores que 1.000", (r) => G.orderBig(r, 1001, 99999, 4)],

  ["C.1", "Completar un patrón que se repite", G.completePattern],
  ["C.2", "Crear un patrón que se repite", G.createPattern],
  ["C.3", "Secuencias numéricas crecientes", (r) => G.numberSequenceTo(r, true, 1000)],
  ["C.4", "Secuencias numéricas decrecientes", (r) => G.numberSequenceTo(r, false, 1000)],

  ["D.1", "Modelos de valor posicional: hasta las centenas", (r) => G.placeModelNumber(r, "hundreds")],
  ["D.2", "Modelos de valor posicional: hasta los millares", (r) => G.placeModelNumber(r, "thousands")],
  ["D.3", "Hallar el valor de la cifra subrayada: hasta los millares", (r) => G.placeValueDigit(r, "thousands")],
  ["D.4", "Convertir a un número o desde un número: hasta los millares", (r) => G.convertPlaceValue(r, "thousands")],

  ["E.1", "Operaciones de suma: sumar hasta 10", (r) => G.addFacts(r, 10)],
  ["E.2", "Completar sumas: sumar hasta 10", (r) => G.addMissing(r, 10)],
  ["E.3", "Completar sumas hasta llegar a 10", G.makeTen],
  ["E.4", "Identificar sumas repetidas en matrices", (r) => G.arrayRepeatedAddition(r, 25)],
  ["E.5", "Operaciones de suma: sumar hasta 20", (r) => G.addFacts(r, 20)],
  ["E.6", "Completar sumas: sumar hasta 20", (r) => G.addMissing(r, 20)],
  ["E.7", "Operaciones relacionadas de suma: sumar hasta 20", (r) => G.relatedAdd(r, 20)],
  ["E.8", "Sumar los dobles", G.doubles],
  ["E.9", "Sumar usando dobles más uno", (r) => G.doublesNear(r, 1)],
  ["E.10", "Sumar usando dobles menos uno", (r) => G.doublesNear(r, -1)],
  ["E.11", "Sumar un múltiplo de 10", G.addMultipleOfTen],
  ["E.12", "Sumar dos múltiplos de diez", G.addTens],
  ["E.13", "Sumar múltiplos de 100", G.addHundreds],
  ["E.14", "Sumar números de dos cifras sin reagrupar", (r) => G.addTwoTwo(r, false)],
  ["E.15", "Sumar números de dos cifras reagrupando", (r) => G.addTwoTwo(r, true)],
  ["E.16", "Completar sumas: números de hasta dos cifras", G.addMissingTwoDigit],
  ["E.17", "Sumar o restar números de hasta tres cifras", G.addSubThreeDigit],
  ["E.18", "Sumar dos números de cuatro o más cifras", (r) => G.addLarge(r, 4, 5)],
  ["E.19", "Propiedades de la suma", G.additionProperties],

  ["F.1", "Operaciones de resta: hasta 10", (r) => G.subFacts(r, 10)],
  ["F.2", "Completar la resta: números hasta 10", (r) => G.subMissing(r, 10)],
  ["F.3", "Operaciones de resta: hasta 18", (r) => G.subFacts(r, 18)],
  ["F.4", "Completar la resta: números hasta 18", (r) => G.subMissing(r, 18)],
  ["F.5", "Operaciones relacionadas de resta: hasta 20", (r) => G.relatedSub(r, 20)],
  ["F.6", "Restar dobles", G.subDoubles],
  ["F.7", "Restar múltiplos de 10", G.subTens],
  ["F.8", "Restar múltiplos de 100", G.subHundreds],
  ["F.9", "Restar un número de una cifra a uno de dos, sin llevadas", (r) => G.subTwoDigitOne(r, false)],
  ["F.10", "Restar un número de una cifra a uno de dos, con llevada", (r) => G.subTwoDigitOne(r, true)],
  ["F.11", "Restar números de dos cifras, sin llevadas", (r) => G.subTwoTwo(r, false)],
  ["F.12", "Restar números de dos cifras, con llevadas", (r) => G.subTwoTwo(r, true)],
  ["F.13", "Completar la resta: números de hasta dos cifras", G.subMissingTwoDigit],
  ["F.14", "Restar números de hasta tres cifras", G.subThreeDigit],
  ["F.15", "Restar números de hasta cuatro cifras", (r) => G.subLarge(r, 4)],

  ["G.1", "Multiplicaciones sobre grupos iguales", G.multEqualGroups],
  ["G.2", "Multiplicaciones sobre matrices", G.multArrays],

  ...TABLES.map((k, i): Row => [`H.${i + 1}`, `Multiplicar por ${k}`, (r) => G.multFacts(r, [k])]),

  ["I.1", "Operaciones de multiplicación: hasta 5", (r) => G.multFacts(r, [0, 1, 2, 3, 4, 5], 5)],
  ["I.2", "Operaciones de multiplicación hasta 5: hallar el factor que falta", (r) => G.multMissing(r, [1, 2, 3, 4, 5], 5)],
  ["I.3", "Operaciones de multiplicación por 6, 7, 8 y 9", (r) => G.multFacts(r, [6, 7, 8, 9])],
  ["I.4", "Operaciones de multiplicación por 6, 7, 8 y 9: hallar el factor que falta", (r) => G.multMissing(r, [6, 7, 8, 9])],
  ["I.5", "Operaciones de multiplicación: hasta 10", (r) => G.multFacts(r, TABLES)],
  ["I.6", "Operaciones de multiplicación hasta 10: hallar el factor que falta", (r) => G.multMissing(r, TABLES)],
  ["I.7", "Multiplicar por un múltiplo de diez", G.multByTens],
  ["I.8", "Multiplicar números que terminan con ceros", G.multZeros],
  ["I.9", "Multiplicar números de una cifra por números de dos cifras", (r) => G.multDigits(r, 2)],
  ["I.10", "Multiplicar números de una cifra por números de tres cifras", (r) => G.multDigits(r, 3)],
  ["I.11", "Propiedades de la multiplicación", G.multProperties],

  ["J.1", "Divisiones sobre grupos", G.divGroups],
  ["J.2", "Relacionar multiplicaciones y divisiones con grupos", (r) => G.relateMultDivPicture(r, "groups")],
  ["J.3", "Divisiones sobre matrices", G.divArrays],
  ["J.4", "Relacionar multiplicaciones y divisiones con matrices", (r) => G.relateMultDivPicture(r, "array")],
  ["J.5", "Relacionar la multiplicación y la división", G.relateMultDiv],

  ...TABLES.slice(1).map((k, i): Row => [`K.${i + 1}`, `Dividir por ${k}`, (r) => G.divFacts(r, [k])]),

  ["L.1", "Dividir por números hasta 5", (r) => G.divFacts(r, [1, 2, 3, 4, 5])],
  ["L.2", "Dividir por números hasta 5: hallar el factor que falta", (r) => G.divMissing(r, [1, 2, 3, 4, 5])],
  ["L.3", "Operaciones de división entre 6, 7, 8 y 9", (r) => G.divFacts(r, [6, 7, 8, 9])],
  ["L.4", "Dividir por números hasta 10", (r) => G.divFacts(r, TABLES.slice(1))],
  ["L.5", "Dividir por números hasta 10: hallar el factor que falta", (r) => G.divMissing(r, TABLES.slice(1))],
  ["L.6", "Dividir por números de 2 cifras", (r) => G.divLong(r, "twoDigitDivisor")],
  ["L.7", "Dividir números grandes por números de dos cifras", (r) => G.divLong(r, "largeByTwoDigit")],
  ["L.8", "Dividir por números de 3 cifras", (r) => G.divLong(r, "threeDigitDivisor")],
  ["L.9", "Dividir números grandes", (r) => G.divLong(r, "largeByOneDigit")],

  ["M.1", "Familias de operaciones de suma y resta", G.factFamily],
  ["M.2", "Operaciones de suma, resta, multiplicación y división", G.mixedFourFacts],
  ["M.3", "Sumar, restar, multiplicar y dividir", G.mixedFour],

  ["N.1", "Fracciones simples: partes de un todo", (r) => G.fractionOfShape(r, "circle", 4)],
  ["N.2", "Fracciones simples: partes de un grupo", G.fractionOfGroup],
  ["N.3", "Comprender las fracciones: barras de fracciones", (r) => G.fractionOfShape(r, "bar", 10)],
  ["N.4", "Comprender las fracciones: modelos con áreas", (r) => G.fractionOfShape(r, "area", 8)],
  ["N.5", "Mostrar fracciones: barras de fracciones", (r) => G.shadeFraction(r, "bar")],
  ["N.6", "Mostrar fracciones: modelos con áreas", (r) => G.shadeFraction(r, "area")],
  ["N.7", "Fracciones de rectas numéricas: fracciones unitarias", (r) => G.fractionOnLine(r, true)],
  ["N.8", "Fracciones de rectas numéricas", (r) => G.fractionOnLine(r, false)],
  ["N.9", "Representar fracciones unitarias en rectas numéricas", (r) => G.graphFraction(r, true)],
  ["N.10", "Representar fracciones en rectas numéricas", (r) => G.graphFraction(r, false)],

  ["O.1", "Comparar fracciones usando modelos", G.compareFractionModels],
  ["O.2", "Comparar fracciones usando referencias", G.compareBenchmark],
  ["O.3", "Comparar fracciones", (r) => G.compareFractions(r, r.pick<G.FractionMode>(["sameDen", "sameNum", "any"]))],
  ["O.4", "Representar y comparar fracciones con denominadores comunes en rectas numéricas", (r) => G.compareOnLines(r, "sameDen")],
  ["O.5", "Representar y comparar fracciones con numeradores comunes en rectas numéricas", (r) => G.compareOnLines(r, "sameNum")],
  ["O.6", "Representar y comparar fracciones en rectas numéricas", (r) => G.compareOnLines(r, "any")],
  ["O.7", "Representar y ordenar fracciones en rectas numéricas", (r) => G.orderFractions(r, "any", true)],
  ["O.8", "Ordenar fracciones con denominadores iguales", (r) => G.orderFractions(r, "sameDen")],
  ["O.9", "Ordenar fracciones con numeradores iguales", (r) => G.orderFractions(r, "sameNum")],
  ["O.10", "Ordenar fracciones", (r) => G.orderFractions(r, "any")],

  ["P.1", "Hallar fracciones equivalentes usando modelos de área", G.equivalentAreaModels],
  ["P.2", "Identificar fracciones equivalentes en rectas numéricas", G.equivalentLinesYesNo],
  ["P.3", "Representar fracciones equivalentes en rectas numéricas", G.equivalentOnLines],
  ["P.4", "Representar fracciones equivalentes a 1 en rectas numéricas", G.fractionEqualToOne],
  ["P.5", "Hallar fracciones equivalentes a números naturales", G.wholeNumberFractions],
  ["P.6", "Reducir fracciones a su mínima expresión", G.simplifyFraction],
  ["P.7", "Patrones de fracciones equivalentes", G.equivalentPattern],

  ["Q.1", "Sumar fracciones con denominadores comunes usando rectas numéricas", (r) => G.addSubFractionsLine(r, "+")],
  ["Q.2", "Sumar fracciones con denominadores iguales", (r) => G.addSubFractions(r, "+")],
  ["Q.3", "Restar fracciones con denominadores comunes usando rectas numéricas", (r) => G.addSubFractionsLine(r, "−")],
  ["Q.4", "Restar fracciones con denominadores iguales", (r) => G.addSubFractions(r, "−")],
  ["Q.5", "Sumar y restar fracciones con denominadores comunes", (r) => G.addSubFractions(r, "mixed")],

  ["R.1", "Representar decimales en rectas numéricas", G.decimalOnLine],
  ["R.2", "Representar fracciones como decimales en rectas numéricas", G.fractionAsDecimalLine],
  ["R.3", "Hacer modelos de decimales y fracciones", G.decimalModel],
  ["R.4", "Valor posicional en los números decimales", G.decimalPlaceValue],
  ["R.5", "Redondear decimales", G.roundDecimal],
  ["R.6", "Decimales equivalentes", G.equivalentDecimals],
  ["R.7", "Convertir decimales entre su forma estándar y expandida usando fracciones", G.decimalExpanded],

  ["S.1", "Comparar decimales en rectas numéricas", G.compareDecimalsLine],
  ["S.2", "Comparar decimales y fracciones en rectas numéricas", G.compareDecimalFraction],
  ["S.3", "Ordenar decimales", G.orderDecimals],

  ["T.1", "Sumar decimales", (r) => G.addSubDecimals(r, "+")],
  ["T.2", "Restar decimales", (r) => G.addSubDecimals(r, "−")],
  ["T.3", "Sumar y restar decimales", (r) => G.addSubDecimals(r, "mixed")],
  ["T.4", "Estimar sumas y restas de decimales", G.estimateDecimals],

  ["U.1", "Estimar hasta la decena más cercana", G.estimateToTen],
  ["U.2", "Estimar sumas hasta 1.000", (r) => G.estimateHundreds(r, "+")],
  ["U.3", "Estimar restas", (r) => G.estimateHundreds(r, "−")],
  ["U.4", "Estimar productos", G.estimateProduct],
  ["U.5", "Estimar cocientes", G.estimateQuotient],

  ["V.1", "Seleccionar figuras de dos dimensiones", G.selectShapes2d],
  ["V.2", "Seleccionar figuras tridimensionales", G.selectSolids],
  ["V.3", "Contar y comparar lados y vértices", G.compareSidesVertices],
  ["V.4", "Figuras de objetos de la vida cotidiana", G.everydayObjects],
  ["V.5", "Identificar figuras trazadas a partir de cuerpos sólidos", G.tracedShapes],
  ["V.6", "Identificar las caras de figuras tridimensionales", G.solidFaces],
  ["V.7", "Desarrollos de figuras tridimensionales", G.netOfSolid],
  ["V.8", "Identificar líneas paralelas, perpendiculares y secantes", G.lineRelation],
  ["V.9", "Ángulos mayores que, iguales a o menores que un ángulo recto", G.angleVsRight],
  ["V.10", "Ángulos agudos, rectos, obtusos y llanos", G.classifyAngle],
  ["V.11", "Clasificar triángulos", G.classifyTriangle],
  ["V.12", "Perímetro", G.perimeter],

  ["W.1", "Medir con una regla", G.measureWithRuler],
  ["W.2", "Comparar unidades de longitud", (r) => G.compareUnits(r, "longitud")],
  ["W.3", "Convertir unidades de longitud", (r) => G.convertUnits(r, "longitud")],
  ["W.4", "Comparar unidades de capacidad", (r) => G.compareUnits(r, "capacidad")],
  ["W.5", "Convertir unidades de capacidad", (r) => G.convertUnits(r, "capacidad")],
  ["W.6", "Comparar unidades de masa", (r) => G.compareUnits(r, "masa")],
  ["W.7", "Convertir unidades de masa", (r) => G.convertUnits(r, "masa")],
  ["W.8", "Leer un termómetro", G.readThermometer],
  ["W.9", "Relacionar unidades de tiempo", G.timeUnits],

  ["X.1", "Ubicar objetos en un plano de coordenadas", G.locateObject],
  ["X.2", "Identificar coordenadas de objetos", G.coordinatePlane],

  ["Y.1", "Media y moda", G.meanMode],
  ["Y.2", "Más probable, menos probable e igual de probable", G.moreLikely],
  ["Y.3", "Seguro, probable, improbable e imposible", G.certainOrImpossible],
];

const SKILLS: Skill[] = ROWS.map(([id, title, generate]) => {
  const section = id.split(".")[0];
  return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
});

export const MATEMATICAS_P3: Curriculum = { sections: SECTIONS, skills: SKILLS };
