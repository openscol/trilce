import * as G from "../../generators";
import * as S from "../../generators/sec1";
import * as T from "../../generators/sec2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 2.° de Secundaria, organizado según el CNEB (ciclo VI, nivel
// esperado al terminar 2.°). El modo CNEB trae: enteros y racionales, potencias
// (también de exponente negativo y cero), porcentajes y descuentos sucesivos,
// proporcionalidad directa e inversa, expresiones, ecuaciones e inecuaciones
// lineales, la función lineal y afín, progresiones aritméticas, ángulos entre
// paralelas, polígonos, Pitágoras, congruencia, semejanza y transformaciones,
// prismas, pirámides y cilindros, histogramas y gráficos, media y mediana, y
// la probabilidad. Lo marcado `extendido` adelanta el ciclo VII (notación
// científica, irracionales y raíces cúbicas, sistemas de ecuaciones,
// funciones no lineales, conos y esferas, cuartiles, diagramas de dispersión
// y sucesos dependientes). Generadores de 1.° en S y los de este grado en
// generators/sec2 (T). Dinero en soles, π ≈ 3,14 y decimales con coma.

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const CONVERT: G.UnitMode[] = ["convert", "compare"];
const SHOWN: G.StatDisplay[] = ["table", "linePlot", "stem", "freq"];

const TRANSLATE = ["translate"] as const;
const AXES = ["reflect"] as const;
const ROTATE = ["rotate"] as const;
const RIGID = ["translate", "reflect", "rotate"] as const;
const DILATE = ["dilate"] as const;
const k = <K extends string>(xs: readonly K[]) => [...xs];

const SECTIONS: Section[] = [
  { id: "enteros", name: "Números enteros", icon: "🌡️", topic: "enteros" },
  { id: "racionales", name: "Números racionales", icon: "↔️", topic: "enteros" },
  { id: "potencias", name: "Potencias", icon: "⚡", topic: "potencias" },
  { id: "notacion-cientifica", name: "Notación científica", icon: "🔭", topic: "potencias", extended: true },
  { id: "raices", name: "Raíces cuadradas", icon: "√", topic: "potencias" },
  { id: "irracionales", name: "Números irracionales y raíces cúbicas", icon: "π", topic: "potencias", extended: true },
  { id: "porcentajes", name: "Porcentajes", icon: "💯", topic: "decimales" },
  { id: "consumidor", name: "Compras, descuentos e intereses", icon: "🛒", topic: "dinero" },
  { id: "medidas", name: "Unidades de medida", icon: "📏", topic: "tiempo-masa" },
  { id: "proporcionalidad", name: "Proporcionalidad", icon: "⚖️", topic: "proporcionalidad" },
  { id: "expresiones", name: "Expresiones algebraicas", icon: "🔤", topic: "expresiones" },
  { id: "ecuaciones", name: "Ecuaciones lineales", icon: "🟰", topic: "igualdades" },
  { id: "inecuaciones", name: "Inecuaciones lineales", icon: "↔️", topic: "igualdades" },
  { id: "progresiones", name: "Progresiones", icon: "🔢", topic: "patrones" },
  { id: "funciones", name: "Funciones", icon: "🔁", topic: "funciones" },
  { id: "funcion-lineal", name: "Función lineal y afín", icon: "📈", topic: "funciones" },
  { id: "rectas", name: "Ecuación de la recta", icon: "📈", topic: "funciones" },
  { id: "no-lineales", name: "Funciones no lineales", icon: "〰️", topic: "funciones", extended: true },
  { id: "sistemas", name: "Sistemas de ecuaciones", icon: "✖️", topic: "igualdades", extended: true },
  { id: "plano", name: "Plano cartesiano", icon: "🗺️", topic: "ubicacion" },
  { id: "angulos", name: "Rectas y ángulos", icon: "📐", topic: "angulos" },
  { id: "poligonos", name: "Triángulos y polígonos", icon: "🔷", topic: "figuras" },
  { id: "pitagoras", name: "Teorema de Pitágoras", icon: "📐", topic: "figuras" },
  { id: "congruencia", name: "Transformaciones y congruencia", icon: "🔄", topic: "transformaciones" },
  { id: "semejanza", name: "Semejanza y escalas", icon: "👯", topic: "transformaciones" },
  { id: "area", name: "Perímetro y área", icon: "📐", topic: "longitud-area" },
  { id: "cuerpos", name: "Cuerpos geométricos", icon: "🧊", topic: "cuerpos" },
  { id: "graficos", name: "Tablas y gráficos", icon: "📊", topic: "graficos" },
  { id: "estadistica", name: "Medidas estadísticas", icon: "📊", topic: "estadistica" },
  { id: "dos-variables", name: "Estadística de dos variables", icon: "📊", topic: "graficos", extended: true },
  { id: "probabilidad", name: "Probabilidad", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["sumar-restar-enteros", "enteros", "Compara, suma y resta enteros", mix((r) => G.compareIntegers(r), G.orderIntegers, (r) => G.integerSign(r, ["+", "−"]), (r) => G.integerCounters(r, r.pick(["+", "−"] as const)), (r) => G.integerOperation(r, ["+", "−"], 50), G.addSeveralIntegers)],
  ["enteros-problemas", "enteros", "Problemas con enteros", G.integerAddSubProblem],
  ["multiplicar-dividir-enteros", "enteros", "Multiplica, divide y evalúa con enteros", mix((r) => G.integerSign(r, ["×", "÷"]), (r) => G.integerOperation(r, ["×", "÷"]), G.integerExpression)],

  ["periodicos", "racionales", "Decimales periódicos y fracciones", mix(T.repeatingDecimal, (r) => (r.chance(0.5) ? G.fractionToDecimal3(r, r.chance(0.5)) : G.decimalToFraction3(r, r.chance(0.5))))],
  ["ordenar-racionales", "racionales", "Compara y ordena racionales", mix((r) => G.compareRationals(r), G.orderRationals, G.reciprocal)],
  ["sumar-restar-racionales", "racionales", "Suma y resta racionales", mix((r) => S.rationalOperation(r, ["+", "−"]), (r) => T.rationalWord(r, "addsub"), S.addSubRules)],
  ["multiplicar-dividir-racionales", "racionales", "Multiplica y divide racionales", mix((r) => S.rationalOperation(r, ["×", "÷"]), (r) => T.rationalWord(r, "multdiv"), S.multDivRules)],
  ["racionales-problemas", "racionales", "Problemas de varios pasos con racionales", mix(S.rationalExpression, G.decimalMultiStep, G.fractionMultiStep, (r) => T.rationalWord(r, r.pick(["addsub", "multdiv"] as const)))],

  ["potencias", "potencias", "Calcula potencias", mix(G.writeWithExponents, G.evaluatePower, S.variableExponent, S.negativeBasePower, G.powerOfDecimal, G.fractionPower)],
  ["exponentes-negativos", "potencias", "Exponente cero y exponentes negativos", mix((r) => T.negativeExponent(r, "understand"), (r) => T.negativeExponent(r, "evaluate"), (r) => T.negativeExponent(r, r.pick(["evaluate", "zero"] as const)))],
  ["propiedades-numericas", "potencias", "Propiedades de las potencias: bases numéricas", mix((r) => T.intPowerRule(r, "product"), (r) => T.intPowerRule(r, "quotient"), (r) => T.intPowerRule(r, "both"), (r) => T.intPowerRule(r, "power"), S.exponentProperties)],
  ["propiedades-variables", "potencias", "Propiedades de las potencias: bases con variables", mix((r) => T.varPowerRule(r, "product"), (r) => T.varPowerRule(r, "quotient"), (r) => T.varPowerRule(r, "both"), (r) => T.varPowerRule(r, "power"))],
  ["potencias-equivalentes", "potencias", "Expresiones equivalentes con potencias", mix((r) => T.equivalentPowers(r, 1), (r) => T.equivalentPowers(r, 2), (r) => T.negativeExponent(r, "zero"))],

  ["notacion-cientifica", "notacion-cientifica", "Escribe y compara en notación científica", mix(S.scientificNotation, T.sciCalculator, S.compareScientific)],
  ["operar-cientifica", "notacion-cientifica", "Opera en notación científica", mix((r) => T.sciOperation(r, ["+", "−"]), (r) => T.sciOperation(r, ["×"]), (r) => T.sciOperation(r, ["÷"]), (r) => T.sciOperation(r, ["+", "−", "×", "÷"]))],
  ["cientifica-problemas", "notacion-cientifica", "Notación científica: problemas", (r) => T.sciOperation(r, ["+", "−", "×", "÷"], true)],

  ["raices-cuadradas", "raices", "Raíces cuadradas", mix(S.perfectSquareRoot, S.estimateSquareRoot, (r) => T.squareRoots(r, "pm"), (r) => T.squareRoots(r, "estimate"), (r) => T.squareRoots(r, "relation"))],
  ["ecuaciones-raices", "raices", "Ecuaciones x² = a", (r) => T.squareRoots(r, "solve")],

  ["raices-cubicas", "irracionales", "Raíces cúbicas", mix((r) => T.cubeRoots(r, "positive"), (r) => T.cubeRoots(r, "signed"), (r) => T.cubeRoots(r, "solve"), (r) => T.cubeRoots(r, "estimate"))],
  ["racional-irracional", "irracionales", "¿Racional o irracional?", mix(T.rationalRoot, S.identifyRational, S.classifyReal, G.classifyNumbers)],
  ["aproximar-irracionales", "irracionales", "Irracionales en la recta numérica", mix(T.irrationalLine, T.compareIrrational)],

  ["porcentajes", "porcentajes", "Porcentajes, fracciones y decimales", mix((r) => G.convertPercent(r, ["fraction", "decimal"]), (r) => G.comparePercents(r), G.estimatePercent)],
  ["que-porcentaje", "porcentajes", "¿Qué porcentaje es?", mix((r) => T.percentOfAnother(r), (r) => T.percentOfAnother(r, true))],
  ["porcentaje-cantidad", "porcentajes", "Porcentaje de una cantidad", mix((r) => G.percentOf(r), (r) => G.percentOf(r, true), T.comparePercentOf, (r) => G.percentProblems(r))],
  ["variacion-porcentual", "porcentajes", "Aumentos y descuentos porcentuales", mix((r) => S.percentChange(r, "plain"), (r) => S.percentChange(r, "word"), (r) => S.percentChange(r, "original"))],

  ["precios", "consumidor", "Listas de precios y precio unitario", mix(G.priceListProblem, G.unitPrices, G.unitPriceConversion, S.unitPriceTotal)],
  ["descuentos", "consumidor", "Descuentos, IGV y precios de oferta", mix(G.taxTipMarkup, S.findPercentOfPrice, (r) => G.salePrice(r, true), S.estimateTip)],
  ["descuentos-sucesivos", "consumidor", "Descuentos sucesivos y varios pasos", S.multiStepPercent],
  ["intereses", "consumidor", "Interés simple", G.simpleInterest],
  ["interes-compuesto", "consumidor", "Interés compuesto", S.compoundInterest, X],

  ["unidades", "medidas", "Convierte medidas y tasas", mix((r) => G.unitWork(r, "metrico", "any", r.pick(CONVERT)), G.celsiusFahrenheit)],
  ["unidades-anglosajonas", "medidas", "Unidades anglosajonas", mix((r) => G.unitWork(r, "anglosajon", "any", r.pick(CONVERT)), (r) => G.unitWork(r, "anglosajon", "any", r.pick<G.UnitMode>(["mixed", "addsub"])), (r) => G.convertBetweenSystems(r, true)), X],

  ["proporciones", "proporcionalidad", "Resuelve proporciones", mix((r) => G.solveProportion(r, true), S.proportionProblem)],
  ["poblacion", "proporcionalidad", "Estima una población", S.populationEstimate],
  ["relaciones-proporcionales", "proporcionalidad", "Relaciones proporcionales en tablas y gráficos", mix((r) => S.proportional(r, "kTable"), (r) => S.proportional(r, "eqTable"), (r) => G.isProportional(r, "both"), (r) => S.proportional(r, "kGraph"), (r) => S.proportional(r, "eqGraph"), (r) => G.isProportional(r, "graph"), (r) => S.proportional(r, "identifyEq"), (r) => G.isProportional(r, "table"))],
  ["proporcionales-problemas", "proporcionalidad", "Relaciones proporcionales: problemas", mix(T.proportionalWord, T.proportionalSlope, G.interpretProportional, (r) => S.proportional(r, "solve"), T.compareProportional)],
  ["variacion-directa", "proporcionalidad", "Variación directa", mix((r) => T.directVariation(r, "constant"), (r) => T.directVariation(r, "identify"), (r) => T.directVariation(r, "write"), (r) => T.directVariation(r, "solve"))],

  ["escribir-expresiones", "expresiones", "Escribe expresiones con variables", mix(G.writeVariableExpression, G.writeVariableExpression2, (r) => G.stripExpression(r, false), G.variableExpressionProblem)],
  ["evaluar-expresiones", "expresiones", "Evalúa expresiones", mix(S.evaluateLinear, S.evaluateNonlinear, G.evaluateMultiVariable, S.evaluateAbsolute)],
  ["evaluar-raices", "expresiones", "Evalúa expresiones con raíces y fracciones", mix(T.evaluateRadical, T.evaluateRationalExpr), X],
  ["terminos", "expresiones", "Términos, coeficientes y propiedades", mix(G.termsCoefficients, G.factorsOfVariableExpression, (r) => G.namedProperty(r, r.pick(["suma", "multiplicacion"] as const)))],
  ["simplificar", "expresiones", "Simplifica expresiones lineales", mix((r) => G.distribute(r, false), G.equivalentByProperty, (r) => S.combineLikeTerms(r, false), S.addSubLinear, (r) => G.factorVariable(r, false))],
  ["expresiones-equivalentes", "expresiones", "Expresiones lineales equivalentes", mix((r) => G.equivalentExpressions(r, false), (r) => G.equivalentExpressions(r, true), S.equivalentWord)],

  ["plantear-ecuaciones", "ecuaciones", "Plantea ecuaciones", mix((r) => G.satisfiesEquation(r, true), G.equationFromWords, G.algebraTiles, (r) => G.stripExpression(r, true))],
  ["propiedades-igualdad", "ecuaciones", "Propiedades de la igualdad", mix(T.equalityProperty, T.equivalentEquations)],
  ["uno-dos-pasos", "ecuaciones", "Ecuaciones de uno y dos pasos", mix((r) => G.solveOneStep(r, ["+", "−", "×", "÷"]), G.solveOneStepIntegers, (r) => S.twoStepEquation(r, r.pick(["plain", "parens", "integers"] as const)), (r) => S.twoStepEquation(r, "complete"), (r) => S.twoStepEquation(r, "word"), (r) => S.twoStepEquation(r, "likeTerms"))],
  ["ambos-lados", "ecuaciones", "La incógnita en ambos lados", mix((r) => T.bothSides(r, "integers"), (r) => T.bothSides(r, "fractional"), (r) => T.bothSides(r, "word"))],
  ["varios-pasos", "ecuaciones", "Ecuaciones de varios pasos", mix(T.distributiveEquation, (r) => T.multiStepEquation(r), (r) => T.multiStepEquation(r, true), T.completeMultiStep)],
  ["numero-soluciones", "ecuaciones", "¿Una, ninguna o infinitas soluciones?", mix(T.numberOfSolutions, T.createSolutions)],

  ["inecuaciones-recta", "inecuaciones", "Inecuaciones en la recta numérica", mix(G.inequalitySolutions, (r) => G.inequalityLine(r, false), (r) => G.inequalityLine(r, true))],
  ["resolver-inecuaciones", "inecuaciones", "Resuelve inecuaciones de uno y dos pasos", mix((r) => G.solveInequality(r), (r) => G.solveInequality(r, true), (r) => S.twoStepInequality(r), (r) => S.twoStepInequality(r, true))],
  ["inecuaciones-varios-pasos", "inecuaciones", "Inecuaciones de varios pasos", mix((r) => T.multiStepInequality(r), (r) => T.multiStepInequality(r, true), (r) => T.bothSidesInequality(r), (r) => T.bothSidesInequality(r, true))],
  ["inecuaciones-problemas", "inecuaciones", "Inecuaciones: problemas", T.inequalityWord],

  ["progresiones-aritmeticas", "progresiones", "Progresiones aritméticas", mix((r) => S.nextTerm(r, "arithmetic"), S.sequenceExpression, S.writeSequenceExpression, S.sequenceProblem)],
  ["geometricas", "progresiones", "Sucesiones geométricas", mix(S.identifySequence, (r) => S.nextTerm(r, "geometric"), (r) => S.nextTerm(r, "mixed")), X],

  ["identificar-funciones", "funciones", "¿Es una función?", mix(T.identifyFunction, T.functionGraph, (r) => G.independentDependent(r, r.chance(0.5)))],
  ["valores-funcion", "funciones", "Valores, dominio y rango", mix((r) => T.functionValues(r), (r) => T.functionValues(r, true), T.domainRange)],
  ["describir-graficos", "funciones", "Describe e interpreta gráficos", mix((r) => S.rateOfChange(r, "table"), (r) => S.rateOfChange(r, "graph"), T.identifyGraphWord)],

  ["evaluar-lineal", "funcion-lineal", "Evalúa y tabula una función lineal", mix(T.evaluateLinearFunction, (r) => T.linearTable(r), (r) => T.linearTable(r, true), T.interpretPoint)],
  ["pendiente", "funcion-lineal", "Pendiente y tasa de cambio", mix((r) => S.slope(r, true), (r) => S.slope(r, false), T.slopeFromTable, S.missingCoordinate, S.lineFromSlope, (r) => S.rateOfChange(r, "constTable"), (r) => S.rateOfChange(r, "constGraph"))],
  ["interpretar-lineal", "funcion-lineal", "Interpreta la pendiente y el valor inicial", mix(T.interpretSlopeIntercept, T.linearFromTable)],
  ["comparar-lineales", "funcion-lineal", "Compara funciones lineales", mix((r) => T.compareLinear(r, false), (r) => T.compareLinear(r, true))],
  ["lineal-problemas", "funcion-lineal", "Funciones lineales: problemas", mix((r) => T.linearWord(r, false), (r) => T.linearWord(r, true))],

  ["soluciones-recta", "rectas", "Soluciones de una ecuación lineal", mix(T.isLinearSolution, T.graphSolutions)],
  ["pendiente-interseccion", "rectas", "La forma y = mx + b", mix(T.readSlopeIntercept, T.graphSlopeIntercept, T.writeFromSlopeIntercept, T.writeFromGraph, T.toSlopeIntercept)],
  ["punto-pendiente", "rectas", "Recta por un punto o por dos puntos", mix(T.graphPointSlope, T.writeFromSlopePoint, T.writeFromTwoPoints, T.graphStandard), X],
  ["horizontales", "rectas", "Rectas horizontales y verticales", mix((r) => T.horizontalVertical(r, true), (r) => T.horizontalVertical(r, false))],
  ["paralelas-perpendiculares", "rectas", "Rectas paralelas y perpendiculares", T.parallelPerpendicular, X],

  ["lineal-o-no", "no-lineales", "¿Lineal o no lineal?", mix((r) => T.linearOrNot(r, "graphEq"), (r) => T.linearOrNot(r, "table"))],
  ["evaluar-no-lineal", "no-lineales", "Funciones no lineales", mix(T.nonlinearSolution, S.evaluateNonlinear)],

  ["solucion-sistema", "sistemas", "Sistemas por gráficos", mix(T.isSystemSolution, T.systemByGraph, T.systemGraphWord)],
  ["clasificar-sistemas", "sistemas", "Número de soluciones de un sistema", mix((r) => T.systemSolutions(r, true, false), (r) => T.systemSolutions(r, false, false), (r) => T.systemSolutions(r, true, true), (r) => T.systemSolutions(r, false, true))],
  ["resolver-sistemas", "sistemas", "Sustitución y eliminación", mix((r) => T.solveSystem(r, "substitution"), (r) => T.solveSystem(r, "elimination"), (r) => T.solveSystem(r, "any"))],
  ["sistemas-problemas", "sistemas", "Sistemas: problemas", T.systemWord],

  ["coordenadas", "plano", "Cuadrantes, recorridos y distancias", mix(G.graphPoints4, G.describePlane, G.quadrants, G.followDirections, G.distancePoints)],

  ["pares-angulos", "angulos", "Pares de ángulos", mix(G.identifyAnglePairs, G.anglePairMeasures, G.complementSupplement, S.angleEquation, S.bisected)],
  ["paralelas-secante", "angulos", "Paralelas cortadas por una secante", mix(S.alternateAngles, S.nameAnglePairs, S.transversalMeasures, T.transversalSolveX)],

  ["clasificar", "poligonos", "Clasifica triángulos y cuadriláteros", mix(G.polygonSides, G.regularIrregular, G.classifyTriangle, (r) => G.identifyQuad(r, "Trapecio"), G.classifyQuad, G.allQuadNames, G.quadOtherNames, G.quadRelations, G.graphShapes)],
  ["angulos-triangulo", "poligonos", "Ángulos internos y externos del triángulo", mix((r) => G.missingAngle(r, r.pick(["triangle", "special"] as const)), S.triangleRatioAngles, T.triangleSumX, T.exteriorAngle)],
  ["angulos-poligonos", "poligonos", "Ángulos de cuadriláteros y polígonos", mix((r) => G.missingAngle(r, "quad"), S.quadAngles2, (r) => G.missingAngle(r, "polygon"), S.circleParts)],

  ["hipotenusa-cateto", "pitagoras", "Halla la hipotenusa o un cateto", mix((r) => T.pythagorean(r, "hypotenuse"), (r) => T.pythagorean(r, "leg"), (r) => T.pythagorean(r, "either"))],
  ["pitagoras-problemas", "pitagoras", "Pitágoras: perímetros y problemas", mix((r) => T.pythagorean(r, "perimeter"), (r) => T.pythagorean(r, "word"))],
  ["reciproco", "pitagoras", "¿Es un triángulo rectángulo?", T.pythagoreanConverse],

  ["identificar-movimientos", "congruencia", "Identifica y describe transformaciones", mix(S.identifyTransformation, T.nameTransformation, (r) => T.chooseSequence(r, false))],
  ["traslaciones", "congruencia", "Traslaciones", mix((r) => T.graphImage(r, k(TRANSLATE)), (r) => T.imageCoordinates(r, k(TRANSLATE)), (r) => T.writeRule(r, k(TRANSLATE)))],
  ["reflexiones", "congruencia", "Reflexiones", mix((r) => T.graphImage(r, k(AXES)), (r) => T.imageCoordinates(r, k(AXES)), (r) => S.transformPoint(r, "reflectLine", true), (r) => S.transformPoint(r, "reflectLine", false))],
  ["rotaciones", "congruencia", "Rotaciones", mix((r) => T.graphImage(r, k(ROTATE)), (r) => T.imageCoordinates(r, k(ROTATE)), (r) => T.writeRule(r, ["reflect", "rotate"]))],
  ["sucesion-movimientos", "congruencia", "Composición de movimientos", mix((r) => T.graphImage(r, k(RIGID), 2), (r) => T.chooseSequence(r, true), (r) => T.imageCoordinates(r, k(RIGID)), (r) => T.writeRule(r, k(RIGID)))],
  ["figuras-congruentes", "congruencia", "Figuras congruentes", mix((r) => T.congruentOrSimilar(r, "identify"), S.congruenceStatement, (r) => T.congruentOrSimilar(r, "justifyCongruent"), (r) => S.correspondingMeasures(r, false))],

  ["homotecias", "semejanza", "Homotecias (dilataciones)", mix((r) => T.graphImage(r, k(DILATE)), (r) => T.imageCoordinates(r, k(DILATE)), T.dilationFactor, (r) => T.writeRule(r, k(DILATE)))],
  ["triangulos-semejantes", "semejanza", "Triángulos semejantes", mix(S.similarOrCongruent, T.similarTriangles, T.angleAngle, (r) => S.correspondingMeasures(r, true), (r) => S.scaleFactor(r, true), (r) => T.congruentOrSimilar(r, "justifySimilar"))],
  ["medicion-indirecta", "semejanza", "Medición indirecta y lados proporcionales", mix(S.indirectMeasurement, T.proportionalTriangles)],
  ["escala", "semejanza", "Planos y mapas a escala", mix(G.scaleDrawing, S.scaleFactorProblem, S.scaleChange)],
  ["repaso-transformaciones", "semejanza", "Repaso: transformaciones en el plano", mix((r) => T.imageCoordinates(r, ["translate", "reflect", "rotate", "dilate"]), (r) => T.writeRule(r, ["translate", "reflect", "rotate", "dilate"]))],

  ["perimetro-area", "area", "Perímetro y área de polígonos", mix(G.perimeter, G.perimeterMissingSide, (r) => G.shapeArea(r, ["parallelogram", "triangle", "trapezoid"]), G.areaWordProblem, G.perimeterAreaProblem)],
  ["circulos", "area", "Círculos y semicírculos", mix((r) => S.circles(r, r.pick(["circumference", "area"] as const)), (r) => S.circles(r, "word"), (r) => S.circles(r, r.pick(["semicircle", "quarter"] as const)))],
  ["area-entre", "area", "Área entre dos figuras", mix(G.areaBetween, G.areaBetweenTriangles, (r) => S.circles(r, "between"))],

  ["elementos-cuerpos", "cuerpos", "Elementos, desarrollos y vistas", mix(T.solidParts, G.netOfSolid, G.solidViews)],
  ["prismas-piramides", "cuerpos", "Volumen y superficie de prismas y pirámides", mix((r) => G.prismVolume(r, "formula"), (r) => G.triangularPrism(r, "volumen"), (r) => S.solidMeasure(r, "pyramidVolume"), G.surfaceAreaPrism, (r) => G.triangularPrism(r, "superficie"), G.surfaceAreaPyramid)],
  ["cilindros", "cuerpos", "Volumen y superficie del cilindro", mix((r) => S.solidMeasure(r, "cylinderVolume"), (r) => S.solidMeasure(r, "cylinderSurface"))],
  ["conos-esferas", "cuerpos", "Conos y esferas", mix((r) => T.roundSolid(r, "coneVolume"), (r) => T.roundSolid(r, "coneSurface"), (r) => T.roundSolid(r, "sphereVolume"), (r) => T.roundSolid(r, "sphereSurface")), X],
  ["solidos-semejantes", "cuerpos", "Sólidos semejantes", mix(T.similarSolids, T.similarSolidMeasures), X],

  ["graficos-lineas", "graficos", "Gráficos de líneas", mix(G.interpretLineGraph, (r) => G.createGraph(r, true))],
  ["doble-entrada", "graficos", "Tablas de doble entrada", T.twoWayTable],

  ["medidas-centro", "estadistica", "Media, mediana, moda y rango", mix((r) => (r.chance(0.25) ? G.findMean(r) : G.statistic(r, "any")), (r) => (r.chance(0.25) ? G.findMean(r, r.pick<G.MeanDisplay>(["table", "bar", "linePlot"])) : G.statistic(r, "any", r.pick(SHOWN))), G.meanMissing, G.medianMissing, G.rangeMissing, G.statChanges)],
  ["muestras", "estadistica", "Muestras representativas y sesgadas", G.sampleTypes],
  ["dispersion", "estadistica", "Desviación media, cuartiles y valores atípicos", mix(G.meanAbsoluteDeviation, G.quartiles, G.boxPlots, (r) => G.outliers(r, false), (r) => G.outliers(r, true)), X],

  ["dispersion-puntos", "dos-variables", "Diagramas de dispersión", mix(T.interpretScatter, T.createScatter, T.scatterOutlier, T.describeScatter, T.association)],
  ["rectas-ajuste", "dos-variables", "Rectas de ajuste y predicciones", mix((r) => T.scatterPrediction(r), T.bestFitLine, T.bestFitEquation, T.interpretBestFit, (r) => T.scatterPrediction(r, true))],

  ["probabilidad", "probabilidad", "Probabilidad de un suceso", mix((r) => G.probability(r, false), (r) => G.probability(r, true), S.exclusiveOverlapping)],
  ["experimental", "probabilidad", "Probabilidad experimental y predicciones", mix((r) => S.experimentalProbability(r, "probability"), G.predictions, (r) => S.experimentalProbability(r, "predict"))],
  ["conteo", "probabilidad", "Principio de multiplicación", mix(G.countingPrinciple, S.numberOfSums, S.outcomesProblem)],
  ["dependientes", "probabilidad", "Sucesos independientes y dependientes", mix(S.independentDependent, S.drawTwice), X],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_S2: Curriculum = { sections: SECTIONS, skills: SKILLS };
