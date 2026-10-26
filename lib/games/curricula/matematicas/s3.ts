import * as G from "../../generators";
import * as A from "../../generators/alg1";
import * as Ge from "../../generators/geo";
import * as S from "../../generators/sec1";
import * as T from "../../generators/sec2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 3.° de Secundaria, organizado según el CNEB (primer año del
// ciclo VII). El modo CNEB trae: racionales e irracionales, notación
// científica, intervalos, expresiones y productos notables, ecuaciones e
// inecuaciones lineales, variación directa e inversa, la función lineal,
// sistemas de ecuaciones lineales, progresiones aritméticas y geométricas,
// ángulos y paralelas, congruencia y semejanza de triángulos, Pitágoras,
// isometrías y homotecias, cuadriláteros, áreas, distancia y punto medio,
// gráficos, medidas de localización y de dispersión, muestreo y probabilidad
// de sucesos compuestos. Lo marcado `extendido` va más allá (lógica
// proposicional, valor absoluto, inecuaciones de dos variables, funciones por
// partes, fórmulas recursivas, demostraciones y construcciones...). Toma el
// contenido de los antiguos cursos de Álgebra 1 (A) y Geometría (Ge).
// Dinero en soles, π ≈ 3,14 y decimales con coma.

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const CONVERT: G.UnitMode[] = ["convert", "compare"];
const SHOWN: G.StatDisplay[] = ["table", "linePlot", "stem", "freq"];
const build = (...keys: string[]): Gen => (r) => Ge.construction(r, keys);
const proof = (...domains: string[]): Gen => (r) => Ge.proofReason(r, domains);

const SECTIONS: Section[] = [
  { id: "numeros", name: "Números reales", icon: "🔢", topic: "enteros" },
  { id: "conjuntos", name: "Conjuntos e intervalos", icon: "🧺", topic: "enteros" },
  { id: "potencias", name: "Potencias y notación científica", icon: "🔭", topic: "potencias" },
  { id: "medidas", name: "Medidas, unidades y errores", icon: "⚖️", topic: "tiempo-masa" },
  { id: "expresiones", name: "Expresiones algebraicas", icon: "🔤", topic: "expresiones" },
  { id: "polinomios", name: "Polinomios y productos notables", icon: "🧮", topic: "expresiones" },
  { id: "ecuaciones", name: "Ecuaciones lineales", icon: "🟰", topic: "igualdades" },
  { id: "inecuaciones", name: "Inecuaciones lineales", icon: "↔️", topic: "igualdades" },
  { id: "valor-absoluto", name: "Ecuaciones con valor absoluto", icon: "📐", topic: "igualdades", extended: true },
  { id: "variacion", name: "Variación directa e inversa", icon: "🔁", topic: "proporcionalidad" },
  { id: "funciones", name: "Funciones", icon: "🔁", topic: "funciones" },
  { id: "funcion-lineal", name: "Función lineal y ecuación de la recta", icon: "📈", topic: "funciones" },
  { id: "sistemas", name: "Sistemas de ecuaciones lineales", icon: "✖️", topic: "igualdades" },
  { id: "inecuaciones-dos", name: "Inecuaciones de dos variables", icon: "🌓", topic: "igualdades", extended: true },
  { id: "progresiones", name: "Progresiones", icon: "🔢", topic: "patrones" },
  { id: "logica", name: "Razonamiento y lógica", icon: "🧠", topic: "figuras" },
  { id: "segmentos", name: "Puntos, rectas y segmentos", icon: "📍", topic: "ubicacion" },
  { id: "angulos", name: "Ángulos y paralelas", icon: "📐", topic: "angulos" },
  { id: "triangulos", name: "Triángulos y polígonos", icon: "🔺", topic: "figuras" },
  { id: "congruencia", name: "Triángulos congruentes", icon: "👯", topic: "figuras" },
  { id: "cuadrilateros", name: "Cuadriláteros", icon: "🔷", topic: "figuras" },
  { id: "isometrias", name: "Isometrías y simetría", icon: "🔄", topic: "transformaciones" },
  { id: "semejanza", name: "Homotecias y semejanza", icon: "🔍", topic: "transformaciones" },
  { id: "pitagoras", name: "Teorema de Pitágoras", icon: "📐", topic: "figuras" },
  { id: "area", name: "Perímetro y área", icon: "📏", topic: "longitud-area" },
  { id: "graficos", name: "Tablas y gráficos", icon: "📊", topic: "graficos" },
  { id: "estadistica", name: "Medidas estadísticas", icon: "📊", topic: "estadistica" },
  { id: "probabilidad", name: "Probabilidad", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["operaciones", "numeros", "Operaciones con enteros y racionales", mix((r) => G.integerOperation(r, ["+", "−", "×", "÷"]), G.integerExpression, (r) => S.rationalOperation(r, ["+", "−"]), (r) => S.rationalOperation(r, ["×", "÷"]), S.rationalExpression)],
  ["fracciones-decimales", "numeros", "Decimales, fracciones y fracciones complejas", mix((r) => G.fractionToDecimal3(r, r.chance(0.5)), (r) => G.decimalToFraction3(r, r.chance(0.5)), T.repeatingDecimal, A.complexFraction)],
  ["raices", "numeros", "Raíces cuadradas y cúbicas", mix(S.perfectSquareRoot, S.estimateSquareRoot, (r) => T.squareRoots(r, "pm"), (r) => T.cubeRoots(r, r.pick(["positive", "signed", "estimate"] as const)))],
  ["irracionales", "numeros", "Racionales e irracionales", mix(A.sortIrrational, S.identifyRational, T.rationalRoot, S.classifyReal, G.classifyNumbers)],
  ["propiedades-reales", "numeros", "Operar con racionales e irracionales", A.rationalClosure, X],

  ["intervalos", "conjuntos", "Notación de intervalos", A.intervalNotation],
  ["conjuntos", "conjuntos", "Conjuntos, unión e intersección", mix(A.subsetsComplement, A.unionIntersection)],
  ["comprension", "conjuntos", "Notación por comprensión", A.setBuilder, X],

  ["potencias", "potencias", "Potencias de base entera, decimal y fraccionaria", mix(G.evaluatePower, S.negativeBasePower, G.powerOfDecimal, G.fractionPower, (r) => T.negativeExponent(r, r.pick(["understand", "evaluate", "zero"] as const)))],
  ["leyes-exponentes", "potencias", "Leyes de los exponentes", mix((r) => T.intPowerRule(r, "product"), (r) => T.intPowerRule(r, "quotient"), (r) => T.intPowerRule(r, "power"), (r) => T.varPowerRule(r, "product"), (r) => T.varPowerRule(r, "quotient"), (r) => T.varPowerRule(r, "both"), (r) => T.varPowerRule(r, "power"), (r) => T.varPowerRule(r, r.pick(["product", "quotient", "both", "power"] as const)))],
  ["potencias-equivalentes", "potencias", "Expresiones exponenciales equivalentes", mix(S.exponentProperties, (r) => T.equivalentPowers(r, 1), (r) => T.equivalentPowers(r, 2))],
  ["notacion-cientifica", "potencias", "Notación científica", mix(S.scientificNotation, S.compareScientific)],
  ["operar-cientifica", "potencias", "Opera en notación científica", mix((r) => T.sciOperation(r, ["+", "−"]), (r) => T.sciOperation(r, ["×"]), (r) => T.sciOperation(r, ["÷"]), (r) => T.sciOperation(r, ["+", "−", "×", "÷"]), (r) => T.sciOperation(r, ["+", "−", "×", "÷"], true))],

  ["unidades", "medidas", "Convierte unidades y tasas", mix(G.scaleDrawing, (r) => G.unitWork(r, "metrico", "any", r.pick(CONVERT)), G.unitPriceConversion, A.multiStepConversion)],
  ["velocidad-promedios", "medidas", "Velocidad y promedios ponderados", mix(A.travelRate, A.weightedAverage)],
  ["unidades-anglosajonas", "medidas", "Unidades anglosajonas", (r) => G.unitWork(r, "anglosajon", "any", r.pick(CONVERT)), X],
  ["unidades-cuadradas", "medidas", "Unidades cuadradas, cúbicas y densidad", mix(Ge.squareCubicUnits, Ge.density)],
  ["error", "medidas", "Precisión y error porcentual", mix(A.precision, A.greatestError, A.minMaxArea, S.percentError, A.percentErrorArea), X],

  ["escribir-evaluar", "expresiones", "Escribe y evalúa expresiones", mix(G.writeVariableExpression, G.writeVariableExpression2, G.variableExpressionProblem, S.evaluateLinear, S.evaluateNonlinear, G.evaluateMultiVariable, A.evaluateRationalVar, T.evaluateRationalExpr)],
  ["propiedades", "expresiones", "Propiedades y factores de una expresión", mix((r) => G.namedProperty(r, r.pick(["suma", "multiplicacion"] as const)), G.factorsOfVariableExpression)],
  ["simplificar", "expresiones", "Reduce términos y aplica la distributiva", mix((r) => G.distribute(r, false), G.equivalentByProperty, (r) => S.combineLikeTerms(r, false), A.simplifyDistribute, (r) => G.equivalentExpressions(r, r.chance(0.5)))],

  ["vocabulario-polinomios", "polinomios", "Grado, términos y coeficientes", mix(A.polyVocabulary, (r) => A.polyTiles(r, false))],
  ["sumar-polinomios", "polinomios", "Suma y resta polinomios", mix((r) => A.polyTiles(r, true), (r) => A.addSubPoly(r), (r) => A.addSubPoly(r, true))],
  ["multiplicar-polinomios", "polinomios", "Multiplica polinomios", mix(A.monomialTimesPoly, (r) => A.multiplyBinomials(r, "tiles"), (r) => A.multiplyBinomials(r, "none"), (r) => A.multiplyBinomials(r, "area"), (r) => A.multiplyPolys(r), (r) => A.multiplyPolys(r, true))],
  ["productos-notables", "polinomios", "Productos notables", A.specialProducts],
  ["operaciones-polinomios", "polinomios", "Operaciones combinadas con polinomios", mix(A.polyMixed, A.dividePolyMonomial)],
  ["division-larga", "polinomios", "División larga de polinomios", A.polyLongDivision, X],

  ["plantear", "ecuaciones", "Plantea y comprueba ecuaciones", mix(G.equationFromWords, (r) => G.satisfiesEquation(r, false), (r) => G.satisfiesEquation(r, true), T.equalityProperty, T.equivalentEquations, G.algebraTiles)],
  ["resolver", "ecuaciones", "Resuelve ecuaciones lineales", mix((r) => G.solveOneStep(r, ["+", "−", "×", "÷"]), G.solveOneStepIntegers, (r) => S.twoStepEquation(r, r.pick(["plain", "integers", "fractions"] as const)), (r) => S.twoStepEquation(r, "likeTerms"), T.distributiveEquation, (r) => T.bothSides(r, r.pick(["integers", "fractional"] as const)), (r) => T.multiStepEquation(r, r.chance(0.3)), T.completeMultiStep, (r) => S.twoStepEquation(r, "complete"))],
  ["ecuaciones-problemas", "ecuaciones", "Ecuaciones lineales: problemas", mix((r) => S.twoStepEquation(r, "word"), A.consecutiveIntegers, (r) => T.bothSides(r, "word"))],
  ["soluciones", "ecuaciones", "¿Cuántas soluciones tiene?", mix(T.numberOfSolutions, T.createSolutions)],
  ["despejar", "ecuaciones", "Despeja una variable en una fórmula", A.rearrange],

  ["inecuaciones-recta", "inecuaciones", "Inecuaciones en la recta numérica", mix((r) => G.inequalityLine(r, false), (r) => G.inequalityLine(r, true), G.inequalitySolutions)],
  ["resolver-inecuaciones", "inecuaciones", "Resuelve inecuaciones lineales", mix((r) => G.solveInequality(r), (r) => G.solveInequality(r, true), (r) => S.twoStepInequality(r), (r) => S.twoStepInequality(r, true), (r) => T.multiStepInequality(r), (r) => T.multiStepInequality(r, true))],
  ["inecuaciones-problemas", "inecuaciones", "Inecuaciones lineales: problemas", T.inequalityWord],
  ["compuestas", "inecuaciones", "Inecuaciones compuestas e intervalos", mix((r) => A.compoundGraph(r, false), (r) => A.compoundGraph(r, true), (r) => A.solveCompound(r, false), (r) => A.solveCompound(r, true))],

  ["ecuacion-absoluto", "valor-absoluto", "Ecuaciones con valor absoluto", mix((r) => A.absEquation(r, "solve"), (r) => A.absEquation(r, "graph"), (r) => A.absEquation(r, "write"))],
  ["inecuacion-absoluto", "valor-absoluto", "Inecuaciones con valor absoluto", mix((r) => A.absInequality(r, false), (r) => A.absInequality(r, true))],

  ["variacion-directa", "variacion", "Variación directa", mix((r) => T.directVariation(r, "constant"), (r) => T.directVariation(r, "write"), (r) => T.directVariation(r, "solve"))],
  ["variacion-inversa", "variacion", "Variación inversa", mix((r) => A.inverseVariation(r, "identify"), (r) => A.inverseVariation(r, "write"), (r) => A.inverseVariation(r, "solve"))],

  ["relaciones", "funciones", "Relaciones, funciones, dominio y rango", mix(A.convertRelation, T.domainRange, (r) => G.independentDependent(r, r.chance(0.5)), T.identifyFunction, T.functionGraph)],
  ["evaluar-funciones", "funciones", "Evalúa funciones", mix((r) => T.functionValues(r), T.evaluateLinearFunction, S.evaluateNonlinear, A.plugExpression, (r) => T.functionValues(r, true), (r) => T.linearTable(r))],
  ["tablas-soluciones", "funciones", "Soluciones con tablas", mix((r) => A.tableSolutions(r, false), (r) => A.tableSolutions(r, true))],
  ["interpretar", "funciones", "Interpreta funciones y gráficos", mix(A.interpretFunction, T.identifyGraphWord)],
  ["tasa-promedio", "funciones", "Tasa de cambio y tasa promedio", mix((r) => S.rateOfChange(r, "table"), (r) => S.rateOfChange(r, "graph"), A.averageRate)],

  ["pendiente", "funcion-lineal", "Pendiente", mix((r) => S.slope(r, true), (r) => S.slope(r, false), T.slopeFromTable, S.missingCoordinate)],
  ["lineal-o-no", "funcion-lineal", "¿Es lineal? Soluciones de una ecuación lineal", mix((r) => T.linearOrNot(r, "graphEq"), (r) => T.linearOrNot(r, "table"), T.isLinearSolution, T.graphSolutions)],
  ["pendiente-interseccion", "funcion-lineal", "La forma y = mx + b", mix(T.readSlopeIntercept, T.graphSlopeIntercept, T.writeFromGraph, T.writeFromSlopeIntercept, T.writeFromSlopePoint, T.writeFromTwoPoints, T.linearFromTable, T.toSlopeIntercept)],
  ["forma-general", "funcion-lineal", "Forma general, interceptos y rectas horizontales y verticales", mix(A.writeStandard, A.standardIntercepts, T.graphStandard, A.slopeAndIntercepts, A.graphLineMixed, (r) => T.horizontalVertical(r, false), (r) => T.horizontalVertical(r, true))],
  ["punto-pendiente", "funcion-lineal", "Forma punto-pendiente", mix(T.graphPointSlope, (r) => A.writePointSlope(r, false), (r) => A.writePointSlope(r, true))],
  ["paralelas-perpendiculares", "funcion-lineal", "Rectas paralelas y perpendiculares", mix(T.parallelPerpendicular, A.parallelPerpLine)],
  ["modelos-lineales", "funcion-lineal", "Modela con funciones lineales", mix((r) => T.linearTable(r, true), T.interpretPoint, (r) => S.rateOfChange(r, "constTable"), (r) => S.rateOfChange(r, "constGraph"), T.interpretSlopeIntercept, (r) => T.linearWord(r, false))],
  ["dominio-lineal", "funcion-lineal", "Dominio, rango y comparación de funciones lineales", mix((r) => A.linearDomainRange(r, false), (r) => A.linearDomainRange(r, true), (r) => T.compareLinear(r, false), (r) => T.compareLinear(r, true))],
  ["transformar-lineal", "funcion-lineal", "Transformaciones de funciones lineales", A.transformLinear, X],

  ["sistemas-graficos", "sistemas", "Sistemas por gráficos", mix(T.isSystemSolution, T.systemByGraph, T.systemGraphWord)],
  ["numero-soluciones-sistema", "sistemas", "Clasifica sistemas", mix((r) => T.systemSolutions(r, true, false), (r) => T.systemSolutions(r, false, false), (r) => T.systemSolutions(r, true, true), (r) => T.systemSolutions(r, false, true))],
  ["sustitucion-eliminacion", "sistemas", "Sustitución, igualación y reducción", mix((r) => T.solveSystem(r, "substitution"), (r) => T.solveSystem(r, "elimination"), (r) => T.solveSystem(r, "any"))],
  ["sistemas-problemas", "sistemas", "Sistemas: problemas", mix(T.systemWord, T.systemGraphWord)],
  ["matriz-aumentada", "sistemas", "Sistemas con matrices aumentadas", mix((r) => A.augmentedMatrix(r, false), (r) => A.augmentedMatrix(r, true)), X],

  ["cumple-inecuacion", "inecuaciones-dos", "¿El punto cumple la inecuación?", mix((r) => A.satisfiesIneq2(r, false), A.ineqSolveY, (r) => A.satisfiesIneq2(r, true))],
  ["graficar-inecuacion", "inecuaciones-dos", "Grafica inecuaciones y sistemas", mix((r) => A.graphIneq2(r, false), (r) => A.graphIneq2(r, true), A.ineqSystemGraph)],
  ["modelar-inecuaciones", "inecuaciones-dos", "Modela con inecuaciones de dos variables", A.ineq2Word],
  ["por-partes", "inecuaciones-dos", "Funciones definidas por partes", mix(A.evaluatePiecewise, A.graphPiecewise)],

  ["aritmeticas", "progresiones", "Progresiones aritméticas", mix((r) => S.nextTerm(r, "arithmetic"), S.sequenceExpression, S.writeSequenceExpression)],
  ["geometricas", "progresiones", "Progresiones geométricas", mix(S.identifySequence, (r) => S.nextTerm(r, "geometric"), A.geometricFormula, (r) => S.nextTerm(r, "mixed"))],
  ["progresiones-problemas", "progresiones", "Progresiones: problemas", S.sequenceProblem],
  ["recursivas", "progresiones", "Fórmulas recursivas", mix(A.evaluateRecursive, A.explicitOrRecursive, A.writeRecursive, (r) => A.convertFormula(r, true), (r) => A.convertFormula(r, false)), X],

  ["contraejemplos", "logica", "Hipótesis, conclusiones y contraejemplos", mix(Ge.hypothesisConclusion, Ge.counterexample)],
  ["condicionales", "logica", "Condicionales y sus variantes", mix(Ge.conditionalTruth, Ge.negation, Ge.converseInverse, Ge.biconditional), X],
  ["tablas-verdad", "logica", "Tablas de verdad", mix((r) => Ge.truthTable(r, true), (r) => Ge.truthTable(r, false)), X],

  ["planos", "segmentos", "Puntos, rectas y planos", mix(G.pointsLinesRays, Ge.planeFacts, Ge.intersections, Ge.skewLines)],
  ["longitudes", "segmentos", "Longitudes y puntos medios de segmentos", mix(Ge.segmentOnLine, Ge.segmentAddition, Ge.midpointSegment, Ge.congruentSegments, Ge.perpBisectorTheorem)],
  ["dividir-segmento", "segmentos", "Divide un segmento en una razón", mix(Ge.weightedPoint, Ge.fractionalDistance, Ge.partitionSegment)],
  ["punto-medio-distancia", "segmentos", "Punto medio y distancia en el plano", mix(G.graphPoints4, G.describePlane, G.quadrants, (r) => A.midpointDistance(r, "midpoint"), (r) => A.midpointDistance(r, "endpoint"), (r) => A.midpointDistance(r, "distance"), (r) => A.midpointDistance(r, "mixed"))],
  ["distancia-3d", "segmentos", "Distancia en tres dimensiones", Ge.distance3D, X],
  ["construcciones", "segmentos", "Construcciones con regla y compás", mix(build("segment"), build("bisector"), build("angleBisector"), build("angle"), build("perpendicular"), build("parallel"), build("equilateral", "hexagon"), build("square")), X],

  ["angulos", "angulos", "Vocabulario y medida de ángulos", mix(Ge.angleVocabulary, (r) => G.protractor(r, false), G.classifyAngle)],
  ["pares-angulos", "angulos", "Pares de ángulos y bisectrices", mix(G.identifyAnglePairs, G.anglePairMeasures, G.complementSupplement, S.angleEquation, S.bisected)],
  ["paralelas", "angulos", "Paralelas cortadas por una secante", mix(S.nameAnglePairs, S.transversalMeasures, T.transversalSolveX)],
  ["demostraciones-angulos", "angulos", "Demostraciones con ángulos y paralelas", mix(proof("angles"), proof("parallel"), proof("parallel", "angles")), X],

  ["triangulos", "triangulos", "Clasifica triángulos y halla sus ángulos", mix(G.classifyTriangle, T.triangleSumX, T.exteriorAngle)],
  ["desigualdades-triangulo", "triangulos", "Desigualdades en el triángulo", mix(Ge.exteriorInequality, G.triangleInequality, Ge.angleSide)],
  ["poligonos", "triangulos", "Ángulos interiores y exteriores de polígonos", mix(Ge.polygonVocabulary, G.regularIrregular, (r) => Ge.polygonAngles(r, "interior"), (r) => Ge.polygonAngles(r, "exterior"), (r) => Ge.polygonAngles(r, "mixed"))],

  ["partes-correspondientes", "congruencia", "Figuras congruentes y partes correspondientes", mix(S.congruenceStatement, Ge.correspondingX, (r) => T.congruentOrSimilar(r, "identify"), (r) => T.congruentOrSimilar(r, "justifyCongruent"))],
  ["criterios", "congruencia", "Criterios LLL, LAL, ALA y AAL", mix((r) => Ge.congruenceCriterion(r, [0, 1]), (r) => Ge.congruenceCriterion(r, [2, 3]), (r) => Ge.congruenceCriterion(r, [0, 1, 2, 3]), Ge.sssCoordinates, (r) => Ge.congruenceCriterion(r, [0, 1, 4]), (r) => Ge.congruenceCriterion(r, [0, 1, 2, 3, 4]))],
  ["isosceles", "congruencia", "Triángulos isósceles y equiláteros", Ge.isoscelesAngles],
  ["demostrar-congruencia", "congruencia", "Demuestra la congruencia", mix(proof("congruent"), proof("isosceles")), X],

  ["clasificar-cuadrilateros", "cuadrilateros", "Clasifica cuadriláteros", mix((r) => G.identifyQuad(r, "Trapecio"), G.classifyQuad, G.allQuadNames, G.quadOtherNames, G.quadRelations, G.graphShapes)],
  ["angulos-cuadrilateros", "cuadrilateros", "Ángulos de cuadriláteros", mix((r) => G.missingAngle(r, "quad"), S.quadAngles2)],
  ["propiedades-cuadrilateros", "cuadrilateros", "Propiedades de paralelogramos, rombos y trapecios", mix((r) => Ge.quadProperty(r, "parallelogram"), Ge.provingParallelogram, (r) => Ge.quadProperty(r, "rhombus"), (r) => Ge.quadProperty(r, "rectangle"), (r) => Ge.quadProperty(r, "trapezoid"), (r) => Ge.quadProperty(r, "kite"), (r) => Ge.quadProperty(r, "mixed"))],
  ["figuras-plano", "cuadrilateros", "Clasifica figuras en el plano cartesiano", Ge.classifyOnPlane],
  ["demostrar-cuadrilateros", "cuadrilateros", "Demostraciones con cuadriláteros", mix(proof("triangles", "quadrilaterals"), proof("quadrilaterals")), X],

  ["identificar-isometrias", "isometrias", "Traslaciones, reflexiones y rotaciones", mix(S.identifyTransformation, T.nameTransformation)],
  ["traslaciones-reflexiones", "isometrias", "Traslaciones y reflexiones en el plano", mix((r) => T.graphImage(r, ["translate"]), (r) => T.imageCoordinates(r, ["translate"]), (r) => T.writeRule(r, ["translate"]), (r) => T.graphImage(r, ["reflect"]), (r) => T.imageCoordinates(r, ["reflect"]), (r) => S.transformPoint(r, "reflectLine", true), (r) => S.transformPoint(r, "reflectLine", false))],
  ["rotaciones", "isometrias", "Rotaciones", mix(Ge.rotateAboutPoint, (r) => T.graphImage(r, ["rotate"]), (r) => T.imageCoordinates(r, ["rotate"]), (r) => T.writeRule(r, ["reflect", "rotate"]))],
  ["composicion", "isometrias", "Composición de isometrías", mix((r) => T.graphImage(r, ["translate", "reflect", "rotate"]), (r) => T.writeRule(r, ["translate", "reflect", "rotate"]), (r) => T.graphImage(r, ["translate", "reflect"], 2), (r) => T.graphImage(r, ["translate", "reflect", "rotate"], 2), (r) => T.chooseSequence(r, true), Ge.sequenceRules, (r) => T.imageCoordinates(r, ["translate", "reflect", "rotate"]))],
  ["simetria", "isometrias", "Simetría axial y rotacional", mix((r) => Ge.symmetry(r, "line"), (r) => Ge.symmetry(r, "rotational"), (r) => Ge.symmetry(r, "draw"), (r) => Ge.symmetry(r, "count"), Ge.ontoItself)],

  ["homotecias", "semejanza", "Homotecias", mix((r) => T.graphImage(r, ["dilate"]), (r) => T.imageCoordinates(r, ["dilate"]), Ge.dilationMeasures, T.dilationFactor, (r) => T.writeRule(r, ["dilate"]))],
  ["centro-homotecia", "semejanza", "Centro de homotecia y rectas paralelas", mix(Ge.dilationCenter, Ge.dilationParallel), X],
  ["figuras-semejantes", "semejanza", "Figuras semejantes", mix((r) => S.correspondingMeasures(r, true), Ge.similarityStatement, S.similarOrCongruent, T.similarTriangles, (r) => S.scaleFactor(r, true))],
  ["criterios-semejanza", "semejanza", "Criterios de semejanza de triángulos", mix(T.angleAngle, Ge.similarityRule, (r) => T.congruentOrSimilar(r, "justifySimilar"))],
  ["medicion-indirecta", "semejanza", "Medición indirecta y teorema de Tales", mix(S.indirectMeasurement, T.proportionalTriangles)],
  ["perimetros-areas-semejantes", "semejanza", "Perímetros y áreas de figuras semejantes", mix((r) => Ge.similarPerimeterArea(r, false), (r) => Ge.similarPerimeterArea(r, true), S.scaleChange)],
  ["relaciones-metricas", "semejanza", "Relaciones métricas en el triángulo rectángulo", Ge.rightAltitude],
  ["circunferencias-semejantes", "semejanza", "Semejanza de circunferencias", Ge.similarCircles, X],
  ["demostrar-semejanza", "semejanza", "Demuestra la semejanza", mix(proof("similar"), proof("rightSimilar")), X],

  ["pitagoras", "pitagoras", "Teorema de Pitágoras", (r) => T.pythagorean(r, r.pick(["either", "word"] as const))],
  ["reciproco", "pitagoras", "Recíproco y desigualdades de Pitágoras", mix(T.pythagoreanConverse, Ge.pythagoreanInequality)],
  ["demostrar-pitagoras", "pitagoras", "Demuestra el teorema de Pitágoras", proof("pythagoras", "rightSimilar"), X],

  ["perimetro-area", "area", "Perímetro y área de polígonos", mix(G.perimeter, G.perimeterMissingSide, (r) => G.rectFormula(r, "area"), (r) => G.shapeArea(r, ["parallelogram", "triangle"]), Ge.trapezoidArea, Ge.rhombusArea, G.areaWordProblem, G.perimeterAreaProblem)],
  ["poligonos-regulares", "area", "Área de polígonos regulares", Ge.regularPolygonArea],
  ["area-plano", "area", "Área y perímetro en el plano cartesiano", mix((r) => Ge.coordinateArea(r, 1), (r) => Ge.coordinateArea(r, 2))],
  ["area-circulos", "area", "Círculos y figuras compuestas", mix((r) => S.circles(r, r.pick(["circumference", "area"] as const)), (r) => G.complexFigure(r, "area"), G.compoundWithTriangle, (r) => S.circles(r, "compound"), G.areaBetween, G.areaBetweenTriangles, (r) => S.circles(r, "between"))],
  ["heron", "area", "Fórmula de Herón", Ge.heron, X],
  ["volumen-superficie", "area", "Repaso: volumen y área de superficie", mix((r) => G.prismVolume(r, "formula"), (r) => S.solidMeasure(r, "cylinderVolume"), (r) => T.roundSolid(r, r.pick(["coneVolume", "sphereVolume"] as const)), G.surfaceAreaPrism, (r) => S.solidMeasure(r, "cylinderSurface"), (r) => T.roundSolid(r, "sphereSurface"))],

  ["histogramas", "graficos", "Histogramas y diagramas de puntos", mix(G.createDotPlot, G.interpretLinePlot, (r) => G.histogram(r, true), (r) => G.histogram(r, false))],
  ["graficos", "graficos", "Crea e interpreta gráficos", mix((r) => G.createGraph(r, r.chance(0.5)), (r) => G.interpretBarGraph(r, r.pick([2, 3] as const)), G.interpretLineGraph, G.circleGraph, (r) => G.interpretBarGraph(r, 3))],
  ["tallo-caja", "graficos", "Tallo y hojas, caja y bigotes", mix(G.interpretStemLeaf, G.boxPlots)],

  ["muestras", "estadistica", "Muestras sesgadas y representativas", G.sampleTypes],
  ["centro", "estadistica", "Media, mediana, moda y rango", (r) => (r.chance(0.3) ? G.statistic(r, "any", r.pick(SHOWN)) : G.statistic(r, "any"))],
  ["cuartiles", "estadistica", "Cuartiles y valores atípicos", mix(G.quartiles, (r) => G.outliers(r, false), (r) => G.outliers(r, true))],
  ["desviacion", "estadistica", "Desviación estándar", mix((r) => A.standardDeviation(r, false), (r) => A.standardDeviation(r, true))],
  ["elegir-medidas", "estadistica", "Elige y compara medidas", mix(A.chooseMeasures, S.comparePopulations, G.meanAbsoluteDeviation)],

  ["probabilidad", "probabilidad", "Probabilidad teórica y experimental", mix((r) => G.probability(r, r.chance(0.4)), (r) => S.experimentalProbability(r, r.pick(["probability", "predict"] as const)))],
  ["compuestos", "probabilidad", "Sucesos compuestos y principio de multiplicación", mix(S.compoundSampleSpace, G.countingPrinciple, S.outcomesProblem)],
  ["dependientes", "probabilidad", "Sucesos dependientes e independientes", mix(S.independentDependent, S.drawTwice)],
  ["permutaciones", "probabilidad", "Permutaciones y combinaciones", mix(A.permutations, A.permCombNotation), X],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_S3: Curriculum = { sections: SECTIONS, skills: SKILLS };
