import * as G from "../../generators";
import * as C from "../../generators/cneb/p2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 3.° de Primaria, organizado según el CNEB (ciclo IV). El
// modo CNEB trae lo de 3.° grado: números hasta 1 000, problemas de sumar y
// restar, las tablas de multiplicar y la noción de división, fracciones
// usuales como parte de un todo, patrones y tablas de valores, ángulos
// rectos y rectas paralelas, perímetro, unidades de longitud, masa y
// capacidad, plano cartesiano, tablas de frecuencia, gráficos de barras y
// sucesos más o menos probables. Lo marcado `extendido` adelanta 4.° y 5.°
// (números de cuatro o más cifras, divisiones largas, operar fracciones,
// decimales, moda y media...).

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const mult = (ks: number[]): Gen => mix(...ks.map((k): Gen => (r) => G.multFacts(r, [k])));
const div = (ks: number[]): Gen => mix(...ks.map((k): Gen => (r) => G.divFacts(r, [k])));
const TABLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SECTIONS: Section[] = [
  // Resuelve problemas de cantidad
  { id: "numeros", name: "Números hasta 1 000", icon: "🔢", topic: "numeros" },
  { id: "numeros-grandes", name: "Números de cuatro cifras y más", icon: "🔢", topic: "numeros", extended: true },
  { id: "suma-resta", name: "Sumar y restar", icon: "➕", topic: "suma-resta" },
  { id: "problemas", name: "Problemas", icon: "🧠", topic: "suma-resta" },
  { id: "multiplicar", name: "Multiplicar", icon: "✖️", topic: "multiplicacion-division" },
  { id: "dividir", name: "Dividir", icon: "➗", topic: "multiplicacion-division" },
  { id: "multiplicar-dividir-mas", name: "Multiplicar y dividir con varias cifras", icon: "🧮", topic: "multiplicacion-division", extended: true },
  { id: "fracciones", name: "Fracciones", icon: "🍕", topic: "fracciones" },
  { id: "fracciones-mas", name: "Ordenar y operar fracciones", icon: "🍕", topic: "fracciones", extended: true },
  { id: "decimales", name: "Decimales", icon: "🔟", topic: "decimales", extended: true },
  { id: "medidas", name: "Tiempo, masa y capacidad", icon: "⚖️", topic: "tiempo-masa" },
  // Resuelve problemas de regularidad, equivalencia y cambio
  { id: "patrones", name: "Patrones y tablas de valores", icon: "🎨", topic: "patrones" },
  { id: "igualdades", name: "Igualdades", icon: "⚖️", topic: "igualdades" },
  // Resuelve problemas de forma, movimiento y localización
  { id: "figuras", name: "Figuras, rectas y ángulos", icon: "🔷", topic: "figuras" },
  { id: "cuerpos", name: "Cuerpos geométricos", icon: "🧊", topic: "cuerpos" },
  { id: "ubicacion", name: "El plano cartesiano", icon: "📍", topic: "ubicacion" },
  { id: "longitud", name: "Longitud y perímetro", icon: "📏", topic: "longitud-area" },
  // Resuelve problemas de gestión de datos e incertidumbre
  { id: "datos", name: "Tablas y gráficos", icon: "📊", topic: "graficos" },
  { id: "estadistica", name: "Moda y media", icon: "🧮", topic: "estadistica", extended: true },
  { id: "azar", name: "¿Qué tan probable es?", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["contar-100", "numeros", "Cuenta y ubica en la recta hasta 100", mix((r) => G.countUpDown(r, 100), (r) => G.numberLineTo(r, 100))],
  ["saltos-100", "numeros", "Cuenta dando saltos hasta 100", (r) => G.skipCount(r, [2, 3, 4, 5, 10])],
  ["contar-1000", "numeros", "Cuenta y ubica en la recta hasta 1 000", mix((r) => G.countUpDown(r, 1000), (r) => G.numberLineTo(r, 1000))],
  ["saltos-1000", "numeros", "Cuenta dando saltos hasta 1 000", (r) => G.skipCountTo(r, 1000)],
  ["par-impar", "numeros", "¿Par o impar?", (r) => G.evenOdd(r, 1000)],
  ["comparar-100", "numeros", "Compara y ordena hasta 100", mix((r) => G.compareSymbol(r, 100), (r) => G.orderNumbers(r, 100, 4))],
  ["comparar-1000", "numeros", "Compara y ordena hasta 1 000", mix((r) => G.compareSymbol(r, 1000), (r) => G.orderNumbers(r, 1000, 5))],
  ["centenas", "numeros", "Centenas, decenas y unidades", (r) => G.placeModelNumber(r, "hundreds")],
  ["redondear-10", "numeros", "¿A qué decena está más cerca?", G.estimateToTen],

  ["millares", "numeros-grandes", "Unidades de millar", mix((r) => G.placeModelNumber(r, "thousands"), (r) => G.placeValueDigit(r, "thousands"), (r) => G.convertPlaceValue(r, "thousands"))],
  ["ordenar-grandes", "numeros-grandes", "Ordena números mayores que 1 000", (r) => G.orderBig(r, 1001, 99999, 4)],
  ["primos", "numeros-grandes", "Números primos y compuestos", (r) => G.primeComposite(r, 50)],

  ["calculo-20", "suma-resta", "Sumas y restas rápidas hasta 20", mix((r) => G.addFacts(r, 10), (r) => G.addMissing(r, 10), G.makeTen, (r) => G.addFacts(r, 20), (r) => G.addMissing(r, 20), (r) => G.subFacts(r, 10), (r) => G.subMissing(r, 10), (r) => G.subFacts(r, 18), (r) => G.subMissing(r, 18))],
  ["dobles", "suma-resta", "Dobles y casi dobles", mix(G.doubles, (r) => G.doublesNear(r, 1), (r) => G.doublesNear(r, -1), G.subDoubles)],
  ["familias", "suma-resta", "Familias de operaciones", mix(G.factFamily, (r) => G.relatedAdd(r, 20), (r) => G.relatedSub(r, 20))],
  ["decenas-centenas", "suma-resta", "Suma y resta decenas y centenas exactas", mix(G.addMultipleOfTen, G.addTens, G.addHundreds, G.subTens, G.subHundreds)],
  ["sumas-dos-cifras", "suma-resta", "Sumas de dos cifras", mix((r) => G.addTwoTwo(r, false), (r) => G.addTwoTwo(r, true), G.addMissingTwoDigit)],
  ["restas-dos-cifras", "suma-resta", "Restas de dos cifras", mix((r) => G.subTwoDigitOne(r, false), (r) => G.subTwoDigitOne(r, true), (r) => G.subTwoTwo(r, false), (r) => G.subTwoTwo(r, true), G.subMissingTwoDigit)],
  ["tres-cifras", "suma-resta", "Sumas y restas de tres cifras", mix(G.addSubThreeDigit, G.subThreeDigit)],
  ["propiedades-suma", "suma-resta", "Propiedades de la suma", G.additionProperties],
  ["estimar-suma-resta", "suma-resta", "Calcula más o menos cuánto da", mix((r) => G.estimateHundreds(r, "+"), (r) => G.estimateHundreds(r, "−"))],
  ["cuatro-cifras", "suma-resta", "Sumas y restas de cuatro o más cifras", mix((r) => G.addLarge(r, 4, 5), (r) => G.subLarge(r, 4)), X],

  ["problemas-suma-resta", "problemas", "Problemas de agregar, quitar, juntar y comparar", mix((r) => C.paev(r, ["agregar", "quitar", "juntar", "separar", "comparar", "igualar"], 99), (r) => G.wordProblem(r, ["+", "−"], { add: [20, 500] }))],
  ["problemas-multiplicar", "problemas", "Problemas de repetir y repartir", (r) => G.wordProblem(r, ["×", "÷"], { mult: [2, 9, 2, 10], div: [2, 9, 2, 10] })],
  ["problemas-cuatro", "problemas", "Problemas con las cuatro operaciones", mix(G.mixedFourFacts, G.mixedFour)],

  ["grupos-iguales", "multiplicar", "Grupos iguales y matrices", mix(G.multEqualGroups, G.multArrays, (r) => G.arrayRepeatedAddition(r, 25))],
  ["tablas-0-1-10", "multiplicar", "Las tablas del 0, del 1 y del 10", mult([0, 1, 10])],
  ["tablas-2-5", "multiplicar", "Las tablas del 2 y del 5", mult([2, 5])],
  ["tablas-3-4", "multiplicar", "Las tablas del 3 y del 4", mult([3, 4])],
  ["tablas-6-7", "multiplicar", "Las tablas del 6 y del 7", mult([6, 7])],
  ["tablas-8-9", "multiplicar", "Las tablas del 8 y del 9", mult([8, 9])],
  ["tablas-hasta-5", "multiplicar", "Tablas hasta el 5 y el factor que falta", mix((r) => G.multFacts(r, [0, 1, 2, 3, 4, 5], 5), (r) => G.multMissing(r, [1, 2, 3, 4, 5], 5))],
  ["tablas-6-9", "multiplicar", "Tablas del 6 al 9 y el factor que falta", mix((r) => G.multFacts(r, [6, 7, 8, 9]), (r) => G.multMissing(r, [6, 7, 8, 9]))],
  ["tablas-todas", "multiplicar", "Todas las tablas y el factor que falta", mix((r) => G.multFacts(r, TABLES), (r) => G.multMissing(r, TABLES))],
  ["multiplicar-decenas", "multiplicar", "Multiplica por 10, 20, 30…", mix(G.multByTens, G.multZeros)],
  ["multiplicar-dos-cifras", "multiplicar", "Multiplica un número de dos cifras", (r) => G.multDigits(r, 2)],
  ["propiedades-multiplicacion", "multiplicar", "Propiedades de la multiplicación", G.multProperties],

  ["repartir", "dividir", "Reparte y agrupa", mix(G.divGroups, G.divArrays)],
  ["multiplicar-dividir", "dividir", "La multiplicación y la división van juntas", mix((r) => G.relateMultDivPicture(r, "groups"), (r) => G.relateMultDivPicture(r, "array"), G.relateMultDiv)],
  ["dividir-1-10", "dividir", "Divide entre 1, 2 y 10", div([1, 2, 10])],
  ["dividir-3-4-5", "dividir", "Divide entre 3, 4 y 5", div([3, 4, 5])],
  ["dividir-6-7", "dividir", "Divide entre 6 y 7", div([6, 7])],
  ["dividir-8-9", "dividir", "Divide entre 8 y 9", div([8, 9])],
  ["dividir-hasta-5", "dividir", "Divisiones hasta el 5 y el número que falta", mix((r) => G.divFacts(r, [1, 2, 3, 4, 5]), (r) => G.divMissing(r, [1, 2, 3, 4, 5]))],
  ["dividir-todas", "dividir", "Todas las divisiones y el número que falta", mix((r) => G.divFacts(r, [6, 7, 8, 9]), (r) => G.divFacts(r, TABLES.slice(1)), (r) => G.divMissing(r, TABLES.slice(1)))],

  ["multiplicar-tres-cifras", "multiplicar-dividir-mas", "Multiplica un número de tres cifras", (r) => G.multDigits(r, 3)],
  ["dividir-grandes", "multiplicar-dividir-mas", "Divide números grandes entre una cifra", (r) => G.divLong(r, "largeByOneDigit")],
  ["dividir-dos-cifras", "multiplicar-dividir-mas", "Divide entre números de dos cifras", mix((r) => G.divLong(r, "twoDigitDivisor"), (r) => G.divLong(r, "largeByTwoDigit"))],
  ["dividir-tres-cifras", "multiplicar-dividir-mas", "Divide entre números de tres cifras", (r) => G.divLong(r, "threeDigitDivisor")],
  ["estimar-producto", "multiplicar-dividir-mas", "Estima productos y cocientes", mix(G.estimateProduct, G.estimateQuotient)],

  ["parte-todo", "fracciones", "Partes de un todo y de un grupo", mix((r) => G.fractionOfShape(r, "circle", 4), G.fractionOfGroup)],
  ["fraccion-dibujo", "fracciones", "¿Qué fracción está pintada?", mix((r) => G.fractionOfShape(r, "bar", 10), (r) => G.fractionOfShape(r, "area", 8))],
  ["pintar-fraccion", "fracciones", "Pinta la fracción", mix((r) => G.shadeFraction(r, "bar"), (r) => G.shadeFraction(r, "area"))],
  ["fracciones-recta", "fracciones", "Fracciones en la recta numérica", mix((r) => G.fractionOnLine(r, true), (r) => G.fractionOnLine(r, false), (r) => G.graphFraction(r, true), (r) => G.graphFraction(r, false))],
  ["comparar-modelos", "fracciones", "Compara fracciones con dibujos", mix(G.compareFractionModels, G.compareBenchmark)],

  ["comparar-fracciones", "fracciones-mas", "Compara fracciones", mix((r) => G.compareFractions(r, r.pick<G.FractionMode>(["sameDen", "sameNum", "any"])), (r) => G.compareOnLines(r, "sameDen"), (r) => G.compareOnLines(r, "sameNum"), (r) => G.compareOnLines(r, "any"))],
  ["ordenar-fracciones", "fracciones-mas", "Ordena fracciones", mix((r) => G.orderFractions(r, "any", true), (r) => G.orderFractions(r, "sameDen"), (r) => G.orderFractions(r, "sameNum"), (r) => G.orderFractions(r, "any"))],
  ["equivalentes", "fracciones-mas", "Fracciones que valen lo mismo", mix(G.equivalentAreaModels, G.equivalentLinesYesNo, G.equivalentOnLines, G.fractionEqualToOne, G.wholeNumberFractions)],
  ["simplificar", "fracciones-mas", "Simplifica fracciones", mix(G.simplifyFraction, G.equivalentPattern)],
  ["sumar-fracciones", "fracciones-mas", "Suma y resta fracciones del mismo denominador", mix((r) => G.addSubFractionsLine(r, "+"), (r) => G.addSubFractions(r, "+"), (r) => G.addSubFractionsLine(r, "−"), (r) => G.addSubFractions(r, "−"), (r) => G.addSubFractions(r, "mixed"))],

  ["decimales-recta", "decimales", "Decimales en la recta numérica", mix(G.decimalOnLine, G.fractionAsDecimalLine)],
  ["decimales-valor", "decimales", "Décimos y centésimos", mix(G.decimalModel, G.decimalPlaceValue, G.decimalExpanded, G.equivalentDecimals)],
  ["redondear-decimales", "decimales", "Redondea decimales", G.roundDecimal],
  ["comparar-decimales", "decimales", "Compara y ordena decimales", mix(G.compareDecimalsLine, G.compareDecimalFraction, G.orderDecimals)],
  ["sumar-decimales", "decimales", "Suma y resta decimales", mix((r) => G.addSubDecimals(r, "+"), (r) => G.addSubDecimals(r, "−"), (r) => G.addSubDecimals(r, "mixed"), G.estimateDecimals)],

  ["unidades-tiempo", "medidas", "Horas, días, semanas y meses", G.timeUnits],
  ["comparar-masa", "medidas", "Kilos y gramos: ¿cuál pesa más?", (r) => G.compareUnits(r, "masa")],
  ["comparar-capacidad", "medidas", "Litros y mililitros: ¿dónde cabe más?", (r) => G.compareUnits(r, "capacidad")],
  ["convertir-masa-capacidad", "medidas", "Convierte unidades de masa y capacidad", mix((r) => G.convertUnits(r, "masa"), (r) => G.convertUnits(r, "capacidad")), X],
  ["termometro", "medidas", "Lee el termómetro", G.readThermometer, X],

  ["patrones-repeticion", "patrones", "Patrones que se repiten", mix(G.completePattern, G.createPattern, G.repeatingShapes)],
  ["patrones-numeros", "patrones", "Patrones que crecen y que decrecen", mix((r) => G.numberSequenceTo(r, true, 1000), (r) => G.numberSequenceTo(r, false, 1000), (r) => G.completePattern2(r, ["+", "−"]))],
  ["patrones-figuras", "patrones", "Figuras que crecen", G.growingShapes],
  ["tablas-valores", "patrones", "Tablas de valores", mix((r) => G.ioTable(r, ["+", "−"], true), (r) => G.ioTable(r, ["×"], true))],

  ["igualdades", "igualdades", "¿Es verdadera la igualdad?", mix(G.equationTrueFalse, (r) => C.equalOrNot(r, 50))],
  ["balanza", "igualdades", "La balanza en equilibrio", (r) => C.balance(r, 50)],

  ["figuras-planas", "figuras", "Figuras planas", mix(G.selectShapes2d, G.compareSidesVertices)],
  ["rectas", "figuras", "Rectas paralelas, perpendiculares y secantes", G.lineRelation],
  ["angulo-recto", "figuras", "¿Mayor, igual o menor que un ángulo recto?", G.angleVsRight],
  ["clasificar-angulos", "figuras", "Ángulos agudos, rectos, obtusos y llanos", G.classifyAngle, X],
  ["clasificar-triangulos", "figuras", "Clasifica triángulos", G.classifyTriangle, X],

  ["cuerpos", "cuerpos", "Cuerpos geométricos y sus caras", mix(G.selectSolids, G.solidFaces, G.tracedShapes)],
  ["cuerpos-entorno", "cuerpos", "Formas de las cosas que nos rodean", G.everydayObjects],
  ["desarrollos", "cuerpos", "Arma el cuerpo con su molde", G.netOfSolid],

  ["ubicar", "ubicacion", "Ubica objetos en el plano cartesiano", mix(G.locateObject, G.coordinatePlane)],

  ["perimetro", "longitud", "Perímetro", G.perimeter],
  ["regla", "longitud", "Mide con la regla", G.measureWithRuler],
  ["unidades-longitud", "longitud", "Metros y centímetros", (r) => G.compareUnits(r, "longitud")],
  ["convertir-longitud", "longitud", "Convierte unidades de longitud", (r) => G.convertUnits(r, "longitud"), X],

  ["tabla-conteo", "datos", "Tablas de conteo", C.tallyTable],
  ["tabla-frecuencias", "datos", "Tablas de frecuencias", mix((r) => G.frequencyTable(r, false, false), G.readTable)],
  ["barras", "datos", "Gráficos de barras", (r) => G.interpretBarGraph(r, 1)],

  ["moda-media", "estadistica", "Moda y media", G.meanMode],

  ["mas-probable", "azar", "¿Más probable o menos probable?", G.moreLikely],
  ["seguro-imposible", "azar", "Seguro, probable, improbable e imposible", G.certainOrImpossible],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_P3: Curriculum = { sections: SECTIONS, skills: SKILLS };
