import * as G from "../../generators";
import * as S from "../../generators/sec1";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 1.° de Secundaria, organizado según el CNEB (ciclo VI, que
// termina en 2.°). El modo CNEB trae: operaciones con enteros y racionales,
// potencias de base diez y sus propiedades, porcentajes y descuentos
// sucesivos, proporcionalidad directa e inversa, conversiones de masa, tiempo
// y temperatura, progresiones aritméticas, expresiones, ecuaciones e
// inecuaciones lineales, la función lineal, ángulos, polígonos, prismas y
// pirámides, el plano cartesiano, transformaciones, escalas, tablas y
// gráficos, media, mediana y moda, y la probabilidad de un suceso. Lo marcado
// `extendido` adelanta 2.° y 3.° (notación científica, raíces, pendiente,
// círculos y cilindros, sucesiones geométricas, cuartiles, probabilidad
// compuesta...). Generadores propios de este grado en generators/sec1 (S).
// Dinero en soles, π ≈ 3,14 y decimales con coma.

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const CONVERT: G.UnitMode[] = ["convert", "compare"];
const SHOWN: G.StatDisplay[] = ["table", "linePlot", "stem", "freq"];

const SECTIONS: Section[] = [
  { id: "enteros", name: "Números enteros", icon: "🌡️", topic: "enteros" },
  { id: "operaciones-enteros", name: "Operaciones con números enteros", icon: "🌡️", topic: "enteros" },
  { id: "decimales", name: "Decimales", icon: "🔟", topic: "decimales" },
  { id: "divisibilidad", name: "Divisores y múltiplos", icon: "🧩", topic: "multiplicacion-division" },
  { id: "fracciones", name: "Fracciones", icon: "🍕", topic: "fracciones" },
  { id: "racionales", name: "Números racionales", icon: "↔️", topic: "enteros" },
  { id: "potencias", name: "Potencias", icon: "⚡", topic: "potencias" },
  { id: "raices", name: "Raíces cuadradas", icon: "√", topic: "potencias", extended: true },
  { id: "porcentajes", name: "Porcentajes", icon: "💯", topic: "decimales" },
  { id: "consumidor", name: "Compras, descuentos e intereses", icon: "🛒", topic: "dinero" },
  { id: "medidas", name: "Unidades de medida", icon: "📏", topic: "tiempo-masa" },
  { id: "razones", name: "Razones y proporciones", icon: "⚖️", topic: "proporcionalidad" },
  { id: "proporcionalidad", name: "Proporcionalidad directa", icon: "📈", topic: "proporcionalidad" },
  { id: "expresiones", name: "Expresiones algebraicas", icon: "🔤", topic: "expresiones" },
  { id: "ecuaciones", name: "Ecuaciones lineales", icon: "🟰", topic: "igualdades" },
  { id: "inecuaciones", name: "Inecuaciones lineales", icon: "↔️", topic: "igualdades" },
  { id: "progresiones", name: "Progresiones", icon: "🔢", topic: "patrones" },
  { id: "funcion-lineal", name: "Función lineal", icon: "📈", topic: "funciones" },
  { id: "pendiente", name: "Pendiente y tasa de cambio", icon: "📈", topic: "funciones", extended: true },
  { id: "plano", name: "Plano cartesiano", icon: "🗺️", topic: "ubicacion" },
  { id: "angulos", name: "Rectas y ángulos", icon: "📐", topic: "angulos" },
  { id: "poligonos", name: "Polígonos", icon: "🔷", topic: "figuras" },
  { id: "area", name: "Perímetro y área", icon: "📐", topic: "longitud-area" },
  { id: "circulos", name: "Círculos", icon: "⭕", topic: "longitud-area", extended: true },
  { id: "cuerpos", name: "Prismas y pirámides", icon: "🧊", topic: "cuerpos" },
  { id: "escalas", name: "Escalas y semejanza", icon: "🗺️", topic: "transformaciones" },
  { id: "transformaciones", name: "Transformaciones", icon: "🔄", topic: "transformaciones" },
  { id: "graficos", name: "Tablas y gráficos", icon: "📊", topic: "graficos" },
  { id: "estadistica", name: "Medidas estadísticas", icon: "📊", topic: "estadistica" },
  { id: "muestras", name: "Poblaciones y muestras", icon: "👥", topic: "estadistica" },
  { id: "probabilidad", name: "Probabilidad", icon: "🎲", topic: "probabilidad" },
  { id: "sucesos-compuestos", name: "Sucesos compuestos", icon: "🎲", topic: "probabilidad", extended: true },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["comprender-enteros", "enteros", "Los números enteros en la recta", mix(G.understandIntegers, (r) => G.integersOnLine(r), (r) => G.integersOnLine(r, r.chance(0.6)))],
  ["valor-absoluto", "enteros", "Valor absoluto y opuestos", mix((r) => G.absoluteValue(r, true), (r) => G.absoluteValue(r, false), G.oppositeIntegers, S.combineToZero)],
  ["comparar-enteros", "enteros", "Compara y ordena enteros", mix((r) => G.compareIntegers(r), G.orderIntegers, (r) => G.compareIntegers(r, true))],

  ["sumar-restar-enteros", "operaciones-enteros", "Suma y resta enteros con fichas y en la recta", mix((r) => G.integerCounters(r, r.pick(["+", "−"] as const)), (r) => G.integerOnLineOperation(r, r.pick(["+", "−"] as const)), (r) => G.integerSign(r, ["+", "−"]))],
  ["sumar-restar", "operaciones-enteros", "Suma y resta enteros", mix((r) => G.integerOperation(r, ["+"], 30), (r) => G.integerOperation(r, ["−"], 30), (r) => G.integerOperation(r, ["+", "−"], 30), G.addSeveralIntegers, (r) => S.completeIntegerEquation(r, ["+", "−"]))],
  ["enteros-problemas", "operaciones-enteros", "Problemas con enteros: temperaturas y altitudes", G.integerAddSubProblem],
  ["multiplicar-dividir-enteros", "operaciones-enteros", "Multiplica y divide enteros", mix(G.multiplyOnLine, (r) => G.integerSign(r, r.pick([["×"], ["÷"], ["×", "÷"]] as const)), (r) => G.integerOperation(r, ["×"]), (r) => G.integerOperation(r, ["÷"]), (r) => G.integerOperation(r, ["×", "÷"]), (r) => S.completeIntegerEquation(r, ["×", "÷"]), (r) => S.equalQuotients(r))],
  ["cuatro-operaciones-enteros", "operaciones-enteros", "Las cuatro operaciones con enteros", mix((r) => G.integerOperation(r, ["+", "−", "×", "÷"]), G.integerExpression)],

  ["repaso-decimales", "decimales", "Lee, compara y redondea decimales", mix(G.decimalDigitValue, G.decimalInWords3, (r) => G.decimalExpanded3(r, false), G.decimalLine3, G.compareDecimals3, G.orderDecimals3, G.roundDecimal3)],
  ["sumar-restar-decimales", "decimales", "Suma y resta decimales", mix((r) => G.addSubDecimals3(r, "mixed"), (r) => G.decimalProblem(r, r.chance(0.3)))],
  ["multiplicar-dividir-decimales", "decimales", "Multiplica y divide decimales", mix((r) => G.multiplyDecimals(r, r.pick([2, 3] as const)), (r) => G.decimalTimesWhole(r, "word"), (r) => G.divideByDecimal(r, "any"), (r) => G.decimalByWhole(r, "word"))],
  ["estimar-decimales", "decimales", "Estima y compara resultados con decimales", mix(G.estimateDecimalRounding, (r) => G.estimateDecimalProduct(r, true), (r) => G.compareDecimalProducts(r, r.pick([2, 3] as const)), G.decimalDivisionInequality)],
  ["operaciones-decimales", "decimales", "Las cuatro operaciones con decimales", mix(G.mixedDecimalOps, G.decimalProblem4, G.decimalExpression, (r) => G.mapDistances(r, "decimal"))],

  ["factores-primos", "divisibilidad", "Descomposición en factores primos", mix((r) => G.primeFactorization(r, 300), G.primeFactorizationExponents)],
  ["mcd-mcm", "divisibilidad", "M. c. d. y m. c. m.", mix((r) => G.greatestCommonFactor(r, r.pick([2, 2, 3] as const)), (r) => G.leastCommonMultiple(r, 20), (r) => G.leastCommonMultipleN(r, 3), G.gcfLcmProblem)],

  ["comprender-fracciones", "fracciones", "Fracciones equivalentes y simplificación", mix(G.fractionWholeProblem, G.fractionGroupProblem, G.equivalentMissing, G.identifyEquivalent, G.simplifyFraction, G.leastCommonDenominator, S.fractionFromData)],
  ["comparar-fracciones", "fracciones", "Compara fracciones y números mixtos", mix((r) => G.compareFractions(r, "any"), (r) => G.orderFractions(r, "any"), G.compareRecipes, (r) => G.convertMixed(r, "both"), G.compareFracMixed, G.roundMixed)],
  ["sumar-restar-fracciones", "fracciones", "Suma y resta fracciones y mixtos", mix((r) => G.unlikeFractions(r, "mixed"), (r) => G.unlikeFractions(r, "mixed", "word"), (r) => G.mixedUnlike(r, "mixed", true), (r) => G.mixedUnlike(r, "mixed", true, "word"), G.compareFractionSums, G.compareMixedSums, G.estimateMixedSums)],
  ["multiplicar-fracciones", "fracciones", "Multiplica fracciones y mixtos", mix((r) => G.multiplyModel(r, false), (r) => G.multiplyFractions(r), (r) => G.multiplyMixed(r, [["mixed", "mixed"], ["mixed", "fraction"], ["mixed", "whole"]]), (r) => G.multiplyFractions(r, true), (r) => G.multiplyMixed(r, [["mixed", "whole"], ["mixed", "fraction"], ["mixed", "mixed"]], "word"))],
  ["dividir-fracciones", "fracciones", "Divide fracciones y mixtos", mix(G.reciprocal, (r) => G.divideFractions(r, [["fraction", "fraction"], ["whole", "fraction"], ["fraction", "whole"]]), (r) => G.divideFractions(r, [["mixed", "fraction"], ["fraction", "mixed"], ["mixed", "mixed"], ["mixed", "whole"]]), (r) => G.divideFractions(r, [["mixed", "fraction"], ["whole", "fraction"], ["mixed", "mixed"], ["fraction", "fraction"]], "word"))],
  ["operaciones-fracciones", "fracciones", "Problemas con las cuatro operaciones", mix(G.estimateMixedProduct, G.estimateMixedQuotient, G.estimateFractionProduct, (r) => G.mixedOperations(r, true), G.fractionMultiStep, (r) => G.mapDistances(r, "fraction"), G.fractionExpression6)],

  ["fraccion-decimal", "racionales", "Fracciones y decimales: convierte", mix((r) => G.fractionToDecimal3(r, r.chance(0.5)), (r) => G.decimalToFraction3(r, r.chance(0.5)))],
  ["clasificar-racionales", "racionales", "Clasifica números racionales", mix(S.identifyRational, G.classifyRational, G.classifyNumbers)],
  ["comparar-racionales", "racionales", "Valor absoluto, signo y orden de racionales", mix((r) => G.rationalOppositeAbs(r, "absoluto"), G.rationalSign, (r) => G.compareRationals(r), G.orderRationals)],
  ["reales", "racionales", "Clasifica números reales", S.classifyReal, X],
  ["sumar-restar-racionales", "racionales", "Suma y resta racionales con signo", mix((r) => S.signedDecimals(r, ["+", "−"]), (r) => S.signedFractions(r, ["+", "−"]), (r) => S.rationalOperation(r, ["+", "−"]), S.addSubRules, S.rationalDistance)],
  ["multiplicar-dividir-racionales", "racionales", "Multiplica y divide racionales con signo", mix((r) => S.equalQuotients(r, true), (r) => S.signedDecimals(r, ["×", "÷"]), (r) => S.signedFractions(r, ["×", "÷"]), (r) => S.rationalOperation(r, ["×", "÷"]), S.multDivRules)],
  ["operaciones-racionales", "racionales", "Las cuatro operaciones con racionales", mix((r) => S.rationalOperation(r, ["+", "−", "×", "÷"]), S.rationalExpression, G.decimalMultiStep, G.fractionMultiStep, (r) => G.mixedOperations(r, true))],

  ["potencias", "potencias", "Escribe y calcula potencias", mix(G.writeWithExponents, G.evaluatePower, S.variableExponent, S.negativeBasePower, G.powerOfDecimal, G.fractionPower)],
  ["potencias-diez", "potencias", "Potencias de diez y valor posicional", mix(G.writePowers, G.multByPower)],
  ["expresiones-potencias", "potencias", "Expresiones con potencias", G.exponentExpression],
  ["propiedades-potencias", "potencias", "Propiedades de las potencias", mix((r) => S.exponentRule(r, "product"), (r) => S.exponentRule(r, "quotient"), (r) => S.exponentRule(r, "power"), S.exponentProperties)],
  ["notacion-cientifica", "potencias", "Notación científica", mix(S.scientificNotation, S.compareScientific), X],

  ["raices", "raices", "Raíces cuadradas exactas y aproximadas", mix(S.perfectSquareRoot, S.estimateSquareRoot)],

  ["porcentajes", "porcentajes", "Porcentajes, fracciones y decimales", mix(G.percentIllustrated, (r) => G.convertPercent(r, ["fraction", "decimal"]), (r) => G.comparePercents(r), G.estimatePercent)],
  ["porcentaje-cantidad", "porcentajes", "Porcentaje de una cantidad", mix((r) => G.percentModel(r, "strip"), (r) => G.percentOf(r), (r) => G.percentOf(r, true), (r) => G.percentProblems(r), (r) => G.percentProblems(r, true))],
  ["variacion-porcentual", "porcentajes", "Aumentos y descuentos porcentuales", mix((r) => S.percentChange(r, "plain"), (r) => S.percentChange(r, "word"), (r) => S.percentChange(r, "original"))],
  ["error-porcentual", "porcentajes", "Error porcentual", S.percentError, X],

  ["compras", "consumidor", "Compras, listas de precios y precio unitario", mix(G.moneyProblem, G.fourOpsMoney, (r) => G.multiplyMoney(r, true), (r) => G.divideMoney(r, true), G.priceListProblem, G.unitPrices, G.unitPriceConversion, S.unitPriceTotal)],
  ["descuentos", "consumidor", "Descuentos, IGV y ofertas", mix(G.taxTipMarkup, G.betterCoupon, S.findPercentOfPrice, (r) => G.salePrice(r, true), S.estimateTip)],
  ["descuentos-sucesivos", "consumidor", "Problemas de varios pasos con porcentajes", S.multiStepPercent],
  ["interes-simple", "consumidor", "Interés simple", G.simpleInterest],
  ["interes-compuesto", "consumidor", "Interés compuesto", S.compoundInterest, X],
  ["repaso-razones-porcentajes", "consumidor", "Repaso: razones, tasas y porcentajes", mix((r) => G.unitRates(r, true), G.equivalentRatioProblem, (r) => G.percentOf(r, true), (r) => S.percentChange(r, "word"), G.unitPrices)],

  ["unidades-metricas", "medidas", "Convierte unidades métricas", (r) => G.unitWork(r, "metrico", "any", r.pick(CONVERT))],
  ["temperatura", "medidas", "Grados Celsius y Fahrenheit", G.celsiusFahrenheit],
  ["unidades-anglosajonas", "medidas", "Unidades anglosajonas y conversión entre sistemas", mix((r) => G.unitWork(r, "anglosajon", "any", r.pick(CONVERT)), (r) => G.unitWork(r, "anglosajon", "any", r.pick<G.UnitMode>(["mixed", "addsub"])), (r) => G.convertBetweenSystems(r, true)), X],

  ["razones", "razones", "Razones y razones equivalentes", mix((r) => G.writeRatio(r, ["a", "colon", "fraction"], r.chance(0.5)), (r) => G.equivalentRatios(r), (r) => G.solveProportion(r), G.equivalentRatioProblem)],
  ["tasas", "razones", "Tasas unitarias y comparación", mix((r) => G.unitRates(r, false), S.unitRateFractions, (r) => G.unitRates(r, true), (r) => G.compareRates(r, false), (r) => G.compareRates(r, true))],
  ["proporciones", "razones", "Resuelve proporciones", mix((r) => G.equivalentRatios(r, true), S.proportionWord, (r) => G.solveProportion(r, true), S.proportionProblem)],
  ["poblacion", "razones", "Estima una población con proporciones", S.populationEstimate, X],

  ["constante", "proporcionalidad", "La constante de proporcionalidad", mix((r) => S.proportional(r, "kTable"), (r) => S.proportional(r, "kGraph"), (r) => G.isProportional(r, "table"), (r) => G.isProportional(r, "both"))],
  ["ecuacion-proporcional", "proporcionalidad", "La ecuación y = kx", mix((r) => S.proportional(r, "eqTable"), (r) => S.proportional(r, "eqGraph"), (r) => G.isProportional(r, "graph"), (r) => S.proportional(r, "identifyEq"), (r) => S.proportional(r, "solve"))],
  ["graficos-proporcionales", "proporcionalidad", "Tablas y gráficos de proporcionalidad", mix(G.ratioTable, G.interpretProportional)],

  ["escribir-expresiones", "expresiones", "Escribe expresiones con variables", mix(G.writeVariableExpression, G.writeVariableExpression2, G.variableExpressionProblem)],
  ["evaluar-expresiones", "expresiones", "Evalúa expresiones", mix(S.evaluateLinear, G.evaluateMultiVariable, S.evaluateAbsolute, S.evaluateNonlinear)],
  ["terminos", "expresiones", "Términos, coeficientes y factores", mix(G.termsCoefficients, G.factorsOfVariableExpression, (r) => G.namedProperty(r, r.pick(["suma", "multiplicacion"] as const)))],
  ["terminos-semejantes", "expresiones", "Reduce términos semejantes", mix((r) => S.combineLikeTerms(r, true), (r) => S.combineLikeTerms(r, false), S.addSubLinear, S.likeTermsExponents)],
  ["distributiva", "expresiones", "Propiedad distributiva y factor común", mix((r) => G.distribute(r, true), (r) => G.distribute(r, false), (r) => G.factorVariable(r, true), (r) => G.factorVariable(r, false))],
  ["expresiones-equivalentes", "expresiones", "Expresiones equivalentes", mix(G.equivalentByProperty, (r) => G.equivalentExpressions(r, false), (r) => G.equivalentExpressions(r, true), S.equivalentWord)],

  ["plantear-ecuaciones", "ecuaciones", "Plantea ecuaciones", mix((r) => G.satisfiesEquation(r, true), G.equationFromWords, (r) => G.stripExpression(r, true), G.algebraTiles)],
  ["un-paso", "ecuaciones", "Ecuaciones de un paso", mix(G.solveWithProperties, (r) => G.solveOneStep(r, ["+", "−", "×", "÷"]), G.solveOneStepIntegers, (r) => G.solveOneStepRational(r, ["+", "−", "×", "÷"]))],
  ["dos-pasos", "ecuaciones", "Ecuaciones de dos pasos", mix((r) => S.twoStepEquation(r, "plain"), (r) => S.twoStepEquation(r, "parens"), (r) => S.twoStepEquation(r, "integers"), (r) => S.twoStepEquation(r, "decimals"), (r) => S.twoStepEquation(r, "fractions"), (r) => S.twoStepEquation(r, "likeTerms"), (r) => S.twoStepEquation(r, "complete"))],
  ["ecuaciones-problemas", "ecuaciones", "Problemas con ecuaciones", mix((r) => S.twoStepEquation(r, "choose"), (r) => S.twoStepEquation(r, "word"))],

  ["soluciones-inecuaciones", "inecuaciones", "Inecuaciones en la recta numérica", mix(G.inequalitySolutions, (r) => G.inequalityLine(r, false), (r) => G.inequalityLine(r, true))],
  ["un-paso-inecuaciones", "inecuaciones", "Resuelve inecuaciones de un paso", mix((r) => G.solveInequality(r), (r) => G.solveInequality(r, true), (r) => G.inequalityProblem(r, true), (r) => G.inequalityReview(r, true))],
  ["dos-pasos-inecuaciones", "inecuaciones", "Resuelve inecuaciones de dos pasos", mix((r) => S.twoStepInequality(r), (r) => S.twoStepInequality(r, true))],

  ["progresiones-aritmeticas", "progresiones", "Progresiones aritméticas", mix((r) => S.nextTerm(r, "arithmetic"), S.sequenceExpression, S.writeSequenceExpression)],
  ["identificar-sucesiones", "progresiones", "¿Aritmética o geométrica?", mix(S.identifySequence, (r) => S.nextTerm(r, "geometric"), (r) => S.nextTerm(r, "mixed")), X],
  ["sucesiones-problemas", "progresiones", "Problemas con progresiones", S.sequenceProblem],

  ["variables", "funcion-lineal", "Variables independientes y dependientes", mix((r) => G.independentDependent(r, r.chance(0.5)), G.twoVariableValue, (r) => G.twoVariableProblem(r, "value"))],
  ["tabla-ecuacion", "funcion-lineal", "Tablas y ecuaciones de dos variables", mix(G.twoVariableTable, (r) => G.twoVariableProblem(r, "write"), G.ioExpression, G.equationFromGraph)],
  ["graficar-funcion", "funcion-lineal", "Grafica e interpreta funciones lineales", mix(G.graphOfEquation, G.ruleTableGraph, G.interpretGraphProblem)],
  ["ecuacion-recta", "funcion-lineal", "La ecuación de una recta desde su gráfico", S.linearFromGraph, X],

  ["pendiente", "pendiente", "Pendiente de una recta", mix((r) => S.slope(r, true), (r) => S.slope(r, false), S.missingCoordinate, S.lineFromSlope)],
  ["tasa-cambio", "pendiente", "Tasa de cambio en tablas y gráficos", mix((r) => S.rateOfChange(r, "constTable"), (r) => S.rateOfChange(r, "constGraph"), (r) => S.rateOfChange(r, "table"), (r) => S.rateOfChange(r, "graph"))],

  ["coordenadas", "plano", "Cuadrantes, ejes y recorridos", mix(G.graphPoints4, G.describePlane, G.quadrants, G.followDirections)],
  ["distancia", "plano", "Distancia entre dos puntos", G.distancePoints],

  ["angulos", "angulos", "Nombra, mide y clasifica ángulos", mix(G.nameAngles, (r) => G.protractor(r, false), G.classifyAngle, G.pointsLinesRays, G.lineRelation)],
  ["pares-angulos", "angulos", "Ángulos complementarios, suplementarios y opuestos", mix(G.identifyAnglePairs, G.anglePairMeasures, G.complementSupplement, S.angleEquation)],
  ["bisectriz", "angulos", "Segmentos y ángulos bisecados", S.bisected],
  ["paralelas", "angulos", "Paralelas cortadas por una secante", mix(S.alternateAngles, S.nameAnglePairs, S.transversalMeasures), X],

  ["clasificar-poligonos", "poligonos", "Clasifica polígonos y triángulos", mix(G.polygonSides, G.regularIrregular, G.classifyTriangle, G.triangleInequality)],
  ["cuadrilateros", "poligonos", "Clasifica cuadriláteros", mix((r) => G.identifyQuad(r, "Trapecio"), G.classifyQuad, G.allQuadNames, G.quadOtherNames, G.quadRelations, G.graphShapes)],
  ["angulos-triangulos", "poligonos", "Ángulos de triángulos y cuadriláteros", mix((r) => G.missingAngle(r, r.pick(["triangle", "special"] as const)), S.triangleRatioAngles, (r) => G.missingAngle(r, "quad"), S.quadAngles2)],
  ["angulos-poligonos", "poligonos", "Ángulos interiores de los polígonos", (r) => G.missingAngle(r, "polygon")],

  ["perimetro", "area", "Perímetro", mix(G.perimeter, G.perimeterMissingSide)],
  ["areas", "area", "Área de rectángulos, triángulos y trapecios", mix((r) => G.rectFormula(r, "area"), (r) => G.shapeArea(r, ["parallelogram"]), (r) => G.shapeArea(r, ["triangle", "trapezoid"]))],
  ["area-problemas", "area", "Área y perímetro: problemas", mix(G.areaWordProblem, G.perimeterAreaProblem)],
  ["area-compuesta", "area", "Área de figuras compuestas", mix((r) => G.complexFigure(r, "area"), G.compoundWithTriangle, G.areaBetween, G.areaBetweenTriangles)],

  ["partes-circulo", "circulos", "Partes y ángulos centrales del círculo", mix(S.circleParts, S.centralAngles)],
  ["circunferencia", "circulos", "Longitud de la circunferencia y área del círculo", mix((r) => S.circles(r, "circumference"), (r) => S.circles(r, "area"), (r) => S.circles(r, "word"))],
  ["semicirculos", "circulos", "Semicírculos y cuartos de círculo", mix((r) => S.circles(r, "semiQuarterArea"), (r) => S.circles(r, "semicircle"), (r) => S.circles(r, "quarter"))],
  ["circulos-compuestos", "circulos", "Figuras compuestas con círculos", mix((r) => S.circles(r, "compound"), (r) => S.circles(r, "between"))],

  ["prismas-piramides", "cuerpos", "Bases, desarrollos y vistas", mix(S.solidBases, G.netOfSolid, G.solidViews)],
  ["secciones", "cuerpos", "Secciones transversales", S.crossSections, X],
  ["superficie", "cuerpos", "Área de superficie de prismas y pirámides", mix(G.surfaceAreaPrism, (r) => G.triangularPrism(r, "superficie"), G.surfaceAreaPyramid, S.lateralArea)],
  ["volumen", "cuerpos", "Volumen de prismas", mix((r) => G.prismVolume(r, "formula"), (r) => G.prismVolume(r, "word"), (r) => G.triangularPrism(r, "volumen"), G.fractionVolume, G.decimalVolume)],
  ["volumen-piramides", "cuerpos", "Volumen de pirámides", (r) => S.solidMeasure(r, "pyramidVolume")],
  ["cilindros", "cuerpos", "Cilindros: superficie y volumen", mix((r) => S.solidMeasure(r, "cylinderSurface"), (r) => S.solidMeasure(r, "cylinderVolume")), X],
  ["repaso-medidas", "cuerpos", "Repaso: áreas y volúmenes", mix((r) => S.circles(r, "circumference"), (r) => S.circles(r, "area"), G.surfaceAreaPrism, (r) => S.solidMeasure(r, "cylinderVolume"), (r) => G.prismVolume(r, "formula")), X],

  ["escala", "escalas", "Dibujos y mapas a escala", mix((r) => S.scaleFactor(r, false), (r) => S.scaleFactor(r, true), G.scaleDrawing, S.scaleFactorProblem)],
  ["cambios-escala", "escalas", "Perímetro y área al cambiar la escala", S.scaleChange],
  ["semejantes-congruentes", "escalas", "Figuras semejantes y congruentes", mix(S.similarOrCongruent, S.congruenceStatement, (r) => S.correspondingMeasures(r, false), (r) => S.correspondingMeasures(r, true))],
  ["medicion-indirecta", "escalas", "Semejanza y medición indirecta", S.indirectMeasurement, X],

  ["identificar-transformaciones", "transformaciones", "Reflexiones, rotaciones y traslaciones", S.identifyTransformation],
  ["traslaciones", "transformaciones", "Traslaciones", mix((r) => S.transformPoint(r, "translate", true), (r) => S.transformPoint(r, "translate", false))],
  ["reflexiones", "transformaciones", "Reflexiones", mix((r) => S.transformPoint(r, "reflectAxes", true), (r) => S.transformPoint(r, "reflectAxes", false), (r) => S.transformPoint(r, r.pick(["reflectAxes", "reflectLine", "reflectLine"] as const), true), (r) => S.transformPoint(r, r.pick(["reflectAxes", "reflectLine", "reflectLine"] as const), false))],
  ["rotaciones", "transformaciones", "Rotaciones", mix((r) => S.transformPoint(r, "rotate", true), (r) => S.transformPoint(r, "rotate", false))],

  ["frecuencias", "graficos", "Tablas de frecuencias", (r) => G.frequencyTable(r, r.chance(0.5), true)],
  ["barras", "graficos", "Gráficos de barras", mix((r) => G.createGraph(r, false), (r) => G.interpretBarGraph(r, r.pick([2, 3] as const)))],
  ["histogramas", "graficos", "Histogramas", mix((r) => G.histogram(r, true), (r) => G.histogram(r, false))],
  ["circulares", "graficos", "Gráficos circulares", mix(G.circleGraph, S.circleGraphAngles)],
  ["puntos-tallo", "graficos", "Diagramas de puntos y de tallo y hojas", mix(G.createDotPlot, G.interpretLinePlot, (r) => G.interpretFractionPlot(r, r.chance(0.4)), G.createStemLeaf, G.interpretStemLeaf), X],

  ["media-mediana-moda", "estadistica", "Media, mediana y moda", mix((r) => (r.chance(0.25) ? G.findMean(r) : G.statistic(r, "any")), (r) => (r.chance(0.25) ? G.findMean(r, r.pick<G.MeanDisplay>(["table", "bar", "linePlot"])) : G.statistic(r, "any", r.pick(SHOWN))))],
  ["dato-que-falta", "estadistica", "Halla el dato que falta y cambios en las medidas", mix(G.meanMissing, G.medianMissing, G.rangeMissing, G.statChanges)],
  ["dispersion", "estadistica", "Desviación media, cuartiles y valores atípicos", mix(G.meanAbsoluteDeviation, G.quartiles, (r) => G.outliers(r, r.chance(0.3)), G.boxPlots), X],
  ["comparar-poblaciones", "estadistica", "Compara poblaciones con medidas de centro y dispersión", S.comparePopulations, X],

  ["poblacion-muestra", "muestras", "Población, muestra y variables", mix(S.populationSample, G.sampleTypes)],
  ["inferencias", "muestras", "Estimaciones a partir de muestras", mix(S.estimateFromSample, S.multipleSamples), X],

  ["probabilidad", "probabilidad", "Espacio muestral y probabilidad", mix(G.sampleSpace, (r) => G.probability(r, false), (r) => G.probability(r, r.chance(0.6)))],
  ["experimental", "probabilidad", "Probabilidad experimental y predicciones", mix((r) => S.experimentalProbability(r, "probability"), (r) => S.experimentalProbability(r, "predict"), (r) => S.experimentalProbability(r, "both"), G.predictions)],
  ["excluyentes", "probabilidad", "Sucesos excluyentes y que se solapan", S.exclusiveOverlapping, X],

  ["espacio-compuesto", "sucesos-compuestos", "Espacios muestrales compuestos", mix(S.compoundSampleSpace, G.countingPrinciple, S.numberOfSums, S.outcomesProblem)],
  ["probabilidad-compuesta", "sucesos-compuestos", "Probabilidad de sucesos compuestos", mix(S.compoundProbability, S.chooseSimulation)],
  ["independientes", "sucesos-compuestos", "Sucesos independientes y dependientes", mix(S.independentDependent, S.drawTwice)],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_S1: Curriculum = { sections: SECTIONS, skills: SKILLS };
