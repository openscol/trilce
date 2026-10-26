import * as G from "../../generators";
import * as A from "../../generators/alg1";
import * as B from "../../generators/alg2";
import * as Ge from "../../generators/geo";
import * as Pc from "../../generators/pre";
import * as S from "../../generators/sec1";
import * as T from "../../generators/sec2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 5.° de Secundaria, organizado según el CNEB (nivel esperado al
// terminar el ciclo VII). El modo CNEB trae: funciones y su lectura en
// gráficos y tablas, sistemas de ecuaciones, progresiones geométricas,
// modelos exponenciales e interés compuesto, la ecuación de la parábola,
// ángulos en posición normal, radianes y el círculo trigonométrico, la ley de senos y de cosenos para
// distancias inaccesibles, muestreo y medidas de dispersión, y la
// probabilidad de sucesos dependientes, independientes y condicionales. Lo
// marcado `extendido` corresponde al nivel destacado del CNEB y más allá
// (logaritmos, funciones seno y coseno, identidades, series y sumatorias,
// funciones por tramos, circunferencia, elipse e hipérbola, distribuciones de
// probabilidad, números complejos, matrices, vectores, límites y derivadas).
// Toma el contenido de los antiguos cursos de Álgebra 2 (B) y Precálculo
// (Pc), con generadores de Álgebra 1 (A) y Geometría (Ge).
// «sen» por «sin», «lím» para los límites, decimales con coma.

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;

const SECTIONS: Section[] = [
  { id: "funciones", name: "Funciones", icon: "🔁", topic: "funciones" },
  { id: "operaciones-funciones", name: "Operaciones e inversas de funciones", icon: "🔃", topic: "funciones", extended: true },
  { id: "repaso-algebra", name: "Ecuaciones e inecuaciones", icon: "🟰", topic: "igualdades" },
  { id: "sistemas", name: "Sistemas de ecuaciones", icon: "✖️", topic: "igualdades" },
  { id: "inecuaciones", name: "Sistemas de inecuaciones y programación lineal", icon: "🌓", topic: "igualdades", extended: true },
  { id: "polinomios", name: "Ecuaciones polinómicas", icon: "🧮", topic: "expresiones", extended: true },
  { id: "progresiones", name: "Progresiones", icon: "🔢", topic: "patrones" },
  { id: "series", name: "Series y sumatorias", icon: "➕", topic: "patrones", extended: true },
  { id: "exponencial", name: "Modelos exponenciales", icon: "🚀", topic: "funciones" },
  { id: "logaritmos", name: "Logaritmos", icon: "📒", topic: "funciones", extended: true },
  { id: "parabola", name: "La parábola", icon: "🌈", topic: "ubicacion" },
  { id: "conicas", name: "Circunferencia, elipse e hipérbola", icon: "🥚", topic: "ubicacion", extended: true },
  { id: "angulos", name: "Ángulos en posición normal", icon: "📐", topic: "trigonometria" },
  { id: "leyes", name: "Ley de senos y ley de cosenos", icon: "📐", topic: "trigonometria" },
  { id: "circulo-unitario", name: "Círculo trigonométrico", icon: "⭕", topic: "trigonometria" },
  { id: "funciones-trigonometricas", name: "Funciones e identidades trigonométricas", icon: "🌊", topic: "trigonometria", extended: true },
  { id: "estadistica", name: "Estadística", icon: "📊", topic: "estadistica" },
  { id: "distribuciones", name: "Distribuciones de probabilidad", icon: "🔔", topic: "estadistica", extended: true },
  { id: "probabilidad", name: "Probabilidad", icon: "🎲", topic: "probabilidad" },
  { id: "complejos", name: "Números complejos", icon: "🌀", topic: "enteros", extended: true },
  { id: "matrices", name: "Matrices", icon: "🔲", topic: "expresiones", extended: true },
  { id: "vectores", name: "Vectores", icon: "➡️", topic: "ubicacion", extended: true },
  { id: "limites", name: "Límites y derivadas", icon: "🎯", topic: "funciones", extended: true },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["dominio-rango", "funciones", "Dominio, rango y gráficos de funciones", mix(T.domainRange, T.identifyFunction, T.functionGraph, (r) => T.functionValues(r), (r) => T.functionValues(r, true))],
  ["evaluar", "funciones", "Evalúa funciones", mix(T.evaluateLinearFunction, S.evaluateNonlinear, A.plugExpression)],
  ["leer-graficos", "funciones", "Interpreta gráficos y tablas", mix(T.identifyGraphWord, (r) => A.tableSolutions(r, false), (r) => A.tableSolutions(r, true))],
  ["tasa-promedio", "funciones", "Tasa de cambio promedio", mix(A.averageRate, (r) => Pc.averageRateJJ(r, false), (r) => Pc.averageRateJJ(r, true))],
  ["cuadratica", "funciones", "Repaso: función y ecuación cuadrática", mix((r) => A.quadCharacteristics(r, r.chance(0.5)), (r) => A.quadGraph(r, r.pick(["vertex", "standard"] as const)), (r) => A.quadGraph(r, "match"), A.quadSqrt, (r) => A.quadFactorSolve(r, false), (r) => A.quadFormula(r, "formula"), A.quadWord, A.discriminant)],
  ["maximo-minimo", "funciones", "Máximo o mínimo de una función cuadrática", Pc.quadExtreme],
  ["por-tramos", "funciones", "Funciones definidas por tramos", mix(A.evaluatePiecewise, A.graphPiecewise), X],

  ["operar-funciones", "operaciones-funciones", "Suma, resta, multiplica y divide funciones", mix((r) => A.functionOps(r, false), (r) => A.functionOps(r, true), B.divideFunctions)],
  ["composicion", "operaciones-funciones", "Composición de funciones", mix((r) => B.composition(r, false, false), (r) => B.composition(r, false, true), (r) => B.composition(r, true, false), (r) => B.composition(r, true, true))],
  ["inversas", "operaciones-funciones", "Funciones inversas", mix(A.inverseLinear, B.identifyInverse, (r) => B.inverseValues(r, false), (r) => B.inverseValues(r, true), B.inverseGraph, B.findInverse, Pc.rationalInverse)],

  ["ecuaciones", "repaso-algebra", "Ecuaciones lineales y despejes", mix((r) => T.bothSides(r, r.pick(["integers", "fractional"] as const)), (r) => T.multiStepEquation(r, r.chance(0.3)), T.distributiveEquation, T.completeMultiStep, (r) => T.bothSides(r, "word"), (r) => S.twoStepEquation(r, "word"), A.consecutiveIntegers, A.rearrange)],
  ["inecuaciones", "repaso-algebra", "Inecuaciones e intervalos", mix((r) => G.inequalityLine(r, false), (r) => A.compoundGraph(r, false), (r) => G.inequalityLine(r, true), (r) => A.compoundGraph(r, true), (r) => T.multiStepInequality(r), (r) => T.bothSidesInequality(r), (r) => A.solveCompound(r, false), (r) => T.multiStepInequality(r, true), (r) => A.solveCompound(r, true))],
  ["valor-absoluto", "repaso-algebra", "Ecuaciones e inecuaciones con valor absoluto", mix((r) => A.absEquation(r, "solve"), (r) => A.absEquation(r, "graph"), (r) => A.absEquation(r, "write"), (r) => A.absInequality(r, false), (r) => A.absInequality(r, true)), X],
  ["grado-mayor", "repaso-algebra", "Inecuaciones de grado mayor", mix((r) => Pc.higherInequality(r, true), (r) => Pc.higherInequality(r, false)), X],
  ["reales", "repaso-algebra", "Racionales e irracionales", mix(A.sortIrrational, S.identifyRational, T.rationalRoot, A.rationalClosure)],
  ["recta", "repaso-algebra", "Repaso: pendiente y ecuación de la recta", mix((r) => S.slope(r, r.chance(0.5)), T.slopeFromTable, T.readSlopeIntercept, A.graphLineMixed, T.writeFromSlopeIntercept, T.writeFromTwoPoints, T.writeFromGraph, T.linearFromTable, (r) => A.unitIntervals(r, false))],

  ["sistemas-graficos", "sistemas", "Sistemas por gráficos", mix(T.isSystemSolution, T.systemByGraph, T.systemGraphWord, (r) => T.systemSolutions(r, r.chance(0.5), false), (r) => T.systemSolutions(r, r.chance(0.5), true))],
  ["resolver-sistemas", "sistemas", "Resuelve sistemas", mix((r) => T.solveSystem(r, "substitution"), (r) => T.solveSystem(r, "elimination"), (r) => T.solveSystem(r, "any"), T.systemWord)],
  ["tres-variables", "sistemas", "Sistemas de tres ecuaciones", mix((r) => B.system3(r, "substitution"), (r) => B.system3(r, "elimination"), (r) => B.system3(r, "count")), X],
  ["matriz-aumentada", "sistemas", "Sistemas con matrices aumentadas", mix((r) => A.augmentedMatrix(r, false), (r) => A.augmentedMatrix(r, true)), X],

  ["inecuaciones-dos", "inecuaciones", "Inecuaciones de dos variables", mix(A.ineq2Word, (r) => A.graphIneq2(r, false), (r) => A.satisfiesIneq2(r, true), A.ineqSystemGraph, (r) => B.absInequality2(r, true))],
  ["programacion-lineal", "inecuaciones", "Programación lineal", mix((r) => B.linearProgramming(r, false), (r) => B.linearProgramming(r, true))],

  ["operar-polinomios", "polinomios", "Operaciones y división de polinomios", mix(A.polyVocabulary, (r) => A.addSubPoly(r), (r) => A.multiplyPolys(r), A.polyLongDivision, A.polyMixed, A.dividePolyMonomial, (r) => B.synthetic(r, false), (r) => B.synthetic(r, true))],
  ["ecuaciones-cubicas", "polinomios", "Ecuaciones con cubos y patrones cuadráticos", mix(B.cubes, Pc.cubeEquation, A.factorPattern, (r) => B.solvePolynomial(r, true))],

  ["aritmeticas-geometricas", "progresiones", "Términos de progresiones", mix((r) => S.nextTerm(r, "arithmetic"), (r) => S.nextTerm(r, "geometric"), Pc.sequenceTerm, B.classifySequence)],
  ["formulas", "progresiones", "Término general de una progresión", mix(S.writeSequenceExpression, A.geometricFormula)],
  ["recursivas", "progresiones", "Fórmulas recursivas y explícitas", mix(A.evaluateRecursive, A.explicitOrRecursive, A.writeRecursive, (r) => A.convertFormula(r, true), (r) => A.convertFormula(r, false), (r) => A.convertFormula(r, r.chance(0.5)), (r) => S.nextTerm(r, "mixed")), X],

  ["notacion-sigma", "series", "Series y notación sigma", mix(B.classifySeries, B.sigmaNotation)],
  ["sumas", "series", "Suma de progresiones aritméticas y geométricas", mix((r) => B.arithmeticSum(r, false), (r) => B.geometricSum(r, false), B.partialIntro, (r) => B.arithmeticSum(r, true), (r) => B.geometricSum(r, true))],
  ["series-infinitas", "series", "Series geométricas infinitas", mix((r) => B.infiniteGeometric(r, false), (r) => B.infiniteGeometric(r, true), B.repeatingAsSeries)],

  ["modelos", "exponencial", "Modelos exponenciales", mix((r) => A.exponentialDomainRange(r, r.chance(0.5)), A.evaluateExponential, (r) => A.exponentialGrowth(r, "write"), (r) => A.matchExponential(r, "graph"), (r) => A.matchExponential(r, r.pick(["match", "matchShift"] as const)), (r) => A.unitIntervals(r, true), (r) => A.identifyModel(r, ["lineal", "exponencial"], r.pick(["graph", "table"] as const)), A.describeGrowth)],
  ["crecimiento", "exponencial", "Crecimiento y decrecimiento: problemas", mix((r) => A.exponentialGrowth(r, "identify"), (r) => A.exponentialGrowth(r, "word"))],
  ["interes-compuesto", "exponencial", "Interés compuesto", mix(A.compoundInterestWord, (r) => B.interestExp(r, false))],
  ["interes-continuo", "exponencial", "Interés compuesto continuo", (r) => B.interestExp(r, true), X],

  ["forma-logaritmica", "logaritmos", "Forma exponencial y logarítmica", mix((r) => B.convertLog(r, "rational"), (r) => B.convertLog(r, "natural"), (r) => B.convertLog(r, "all"))],
  ["evaluar-logaritmos", "logaritmos", "Evalúa logaritmos", mix((r) => B.evaluateLog(r, false), (r) => B.evaluateLog(r, true), (r) => B.changeOfBase(r, false), (r) => B.changeOfBase(r, true))],
  ["propiedades-logaritmos", "logaritmos", "Propiedades de los logaritmos", mix(B.logProperties, (r) => B.logRule(r, "product"), (r) => B.logRule(r, "quotient"), (r) => B.logRule(r, "power"), (r) => B.logRule(r, "mixed"), B.logEvaluate)],
  ["funcion-logaritmica", "logaritmos", "Funciones logarítmicas", mix((r) => B.logFunction(r, false), (r) => B.logFunction(r, true))],
  ["ecuaciones-exponenciales", "logaritmos", "Ecuaciones exponenciales y logarítmicas", mix((r) => B.expEquation(r, "base"), (r) => B.expEquation(r, "common"), (r) => B.expEquation(r, "natural"), (r) => B.logEquation(r, 1), (r) => B.logEquation(r, 2))],

  ["elementos-parabola", "parabola", "Vértice, foco, directriz y eje", mix(B.parabolaDirection, (r) => Ge.parabolaProps(r, "vertex"), (r) => Ge.parabolaProps(r, "focus"), (r) => Ge.parabolaProps(r, "axis"), (r) => Ge.parabolaProps(r, "general"))],
  ["ecuacion-parabola", "parabola", "Ecuación de la parábola", mix((r) => Ge.parabolaEquation(r, "graph"), (r) => Ge.parabolaEquation(r, "focus"), (r) => Ge.parabolaEquation(r, "properties"), (r) => Ge.parabolaEquation(r, "convert"))],
  ["graficar-parabola", "parabola", "Grafica parábolas", Ge.graphParabola],

  ["circunferencia", "conicas", "Ecuación de la circunferencia", mix((r) => Ge.circleProps(r, "center"), (r) => Ge.circleProps(r, "radius"), (r) => Ge.circleProps(r, "onCircle"), (r) => Ge.circleEquation(r, "pythagoras"), (r) => Ge.circleEquation(r, "graph"), (r) => Ge.circleEquation(r, "properties"), (r) => Ge.circleEquation(r, "convert"), (r) => Ge.circleProps(r, "general"), (r) => Ge.graphCircle(r, false), (r) => Ge.graphCircle(r, true))],
  ["elipse", "conicas", "La elipse", mix((r) => B.conicProps(r, false, r.pick(["center", "vertices", "covertices"] as const)), (r) => B.conicProps(r, false, "axes"), (r) => B.conicProps(r, false, "foci"), (r) => B.conicEquation(r, false, "graph"), (r) => B.conicEquation(r, false, "properties"), (r) => B.conicEquation(r, false, "convert"), (r) => B.conicProps(r, false, r.pick(["center", "vertices", "axes", "foci"] as const), true), (r) => Pc.eccentricity(r, false))],
  ["hiperbola", "conicas", "La hipérbola", mix((r) => B.conicProps(r, true, "center"), (r) => B.conicProps(r, true, "vertices"), (r) => B.conicProps(r, true, "axes"), (r) => B.conicProps(r, true, "asymptotes"), (r) => B.conicProps(r, true, "foci"), (r) => B.conicEquation(r, true, "graph"), (r) => B.conicEquation(r, true, "properties"), (r) => B.conicEquation(r, true, "convert"), (r) => B.conicProps(r, true, r.pick(["center", "vertices", "axes", "foci"] as const), true), (r) => Pc.eccentricity(r, true))],

  ["radianes", "angulos", "Radianes y longitud de arco", mix(Ge.radiansDegrees, Ge.radianArc)],
  ["posicion-normal", "angulos", "Cuadrantes, coterminales y ángulo de referencia", mix((r) => B.angleQuadrant(r, true), (r) => B.angleQuadrant(r, false), (r) => B.coterminalReference(r, false), (r) => B.coterminalReference(r, true))],
  ["razones-repaso", "angulos", "Repaso: razones trigonométricas", mix((r) => Ge.trigRatio(r, r.pick(["basic", "reciprocal"] as const)), (r) => Ge.specialAngles(r, false), (r) => Ge.solveRight(r, "word"), (r) => Ge.trigCalculator(r, true))],

  ["ley-senos", "leyes", "Ley de senos", (r) => Ge.lawsTriangle(r, "sines")],
  ["ley-cosenos", "leyes", "Ley de cosenos", (r) => Ge.lawsTriangle(r, "cosines")],
  ["resolver-triangulo", "leyes", "Resuelve un triángulo cualquiera", (r) => Ge.lawsTriangle(r, "solve")],
  ["area-seno", "leyes", "Área de un triángulo con el seno y con Herón", mix((r) => Ge.lawsTriangle(r, "area"), (r) => Ge.lawsTriangle(r, "areaSines"), Ge.heron)],

  ["razones-circulo", "circulo-unitario", "Razones en el círculo trigonométrico", mix(B.unitCirclePoint, (r) => B.exactTrig(r, "basic"), (r) => B.exactTrig(r, "reciprocal"), (r) => B.exactTrig(r, "all"), B.trigApprox)],
  ["inversas-trig", "circulo-unitario", "Funciones trigonométricas inversas", mix((r) => B.inverseTrig(r, "degrees"), (r) => B.inverseTrig(r, "radians"), (r) => B.inverseTrig(r, "reciprocal")), X],
  ["ecuaciones-trig", "circulo-unitario", "Ecuaciones trigonométricas", mix((r) => B.trigEquation(r, false), (r) => B.trigEquation(r, true)), X],

  ["seno-coseno", "funciones-trigonometricas", "Propiedades de las funciones seno y coseno", mix((r) => B.sinProps(r, false), (r) => B.sinProps(r, true), (r) => B.sinProps(r, null))],
  ["ecuacion-sinusoide", "funciones-trigonometricas", "Ecuaciones de funciones seno y coseno", mix((r) => B.sinEquation(r, false, true), (r) => B.sinEquation(r, false, false), (r) => B.sinEquation(r, true, true), (r) => B.sinEquation(r, true, false), (r) => B.sinEquation(r, null, true), (r) => B.sinEquation(r, null, false))],
  ["graficar-sinusoide", "funciones-trigonometricas", "Grafica funciones seno y coseno", mix((r) => B.sinGraph(r, false, false), (r) => B.sinGraph(r, false, true), (r) => B.sinGraph(r, true, false), (r) => B.sinGraph(r, true, true), (r) => B.sinGraph(r, null, false), (r) => B.sinGraph(r, null, true))],
  ["identidades", "funciones-trigonometricas", "Identidades trigonométricas", mix(Ge.complementaryTrig, B.symmetryPeriod, (r) => B.pythagoreanIdentity(r, false), (r) => B.pythagoreanIdentity(r, true))],
  ["suma-diferencia", "funciones-trigonometricas", "Seno y coseno de la suma y la diferencia", mix((r) => B.sumDifference(r, false), (r) => B.sumDifference(r, true))],

  ["dispersion", "estadistica", "Desviación estándar y valores atípicos", mix((r) => A.standardDeviation(r, false), (r) => A.standardDeviation(r, true), (r) => G.outliers(r, false), (r) => G.outliers(r, true))],
  ["muestras", "estadistica", "Muestras, experimentos y simulaciones", mix(G.sampleTypes, B.experimentDesign, B.simulationAnalysis)],
  ["intervalos-confianza", "estadistica", "Intervalos de confianza", mix((r) => B.confidenceInterval(r, "mean"), (r) => B.confidenceInterval(r, "proportion"), (r) => B.confidenceInterval(r, "interpret")), X],
  ["regresion", "estadistica", "Correlación y regresión", mix(T.scatterOutlier, A.matchCorrelation, A.calculateCorrelation, A.regressionLine, A.interpretRegression, A.analyzeRegression, Pc.regressionStats, A.exponentialRegression), X],

  ["variables-aleatorias", "distribuciones", "Variables aleatorias y distribuciones", mix(B.identifyDistribution, B.discreteContinuous, (r) => B.writeDistribution(r, false), (r) => B.writeDistribution(r, true))],
  ["valor-esperado", "distribuciones", "Valor esperado, varianza y juegos de azar", mix((r) => B.expectedValue(r, "mean"), (r) => B.expectedValue(r, "variance"), (r) => B.expectedValue(r, "sd"), (r) => B.gameOfChance(r, "distribution"), (r) => B.gameOfChance(r, "expected"), (r) => B.gameOfChance(r, "better"))],
  ["binomial", "distribuciones", "Distribución binomial", mix(B.binomial, (r) => Pc.binomialStats(r, "moments"))],
  ["normal", "distribuciones", "Distribución normal", mix((r) => B.normal(r, "empirical"), (r) => B.normal(r, "probability"), (r) => B.normal(r, "z"), (r) => B.normal(r, "value"), B.sampleMeans, (r) => Pc.binomialStats(r, "clt"), (r) => Pc.binomialStats(r, "approx"))],

  ["conteo", "probabilidad", "Conteo, permutaciones y combinaciones", mix((r) => G.probability(r, r.chance(0.4)), G.countingPrinciple, S.outcomesProblem, A.permutations, A.permCombNotation, Ge.comboProbability)],
  ["condicional", "probabilidad", "Probabilidad condicional e independencia", mix((r) => Ge.twoWayProbability(r, false), (r) => Ge.independence(r, false), S.drawTwice, Ge.conditionalProbability, (r) => Ge.independence(r, true), (r) => Ge.twoWayProbability(r, true))],
  ["regla-suma", "probabilidad", "Regla de la suma", Ge.additionRule],

  ["operar-complejos", "complejos", "Operaciones con números complejos", mix(B.complexIntro, (r) => B.complexOp(r, ["+", "−"]), B.complexConjugate, (r) => B.complexOp(r, ["×"]), (r) => B.complexOp(r, ["÷"]), (r) => B.complexOp(r, ["×", "÷"]), (r) => B.complexOp(r, ["+", "−", "×", "÷"]), B.complexAbs, B.powersOfI)],
  ["plano-complejo", "complejos", "El plano complejo", mix((r) => Pc.complexPlane(r, false), (r) => Pc.complexPlane(r, true), (r) => Pc.complexPlaneOp(r, "add"), (r) => Pc.complexPlaneOp(r, "sub"), (r) => Pc.complexPlaneOp(r, "conj"), (r) => Pc.complexPlaneOp(r, "abs"), (r) => Pc.complexPlaneOp(r, "mid"), (r) => Pc.complexPlaneOp(r, "dist"))],
  ["forma-polar", "complejos", "Forma polar", mix((r) => Pc.polarForm(r, "modArg"), (r) => Pc.polarForm(r, "toPolar"), (r) => Pc.polarForm(r, "toRect"), (r) => Pc.polarForm(r, "both"), Pc.polarGraph)],

  ["operar-matrices", "matrices", "Operaciones con matrices", mix(A.matrixVocabulary, A.matrixRules, (r) => A.matrixLinear(r, "addsub"), (r) => A.matrixLinear(r, "scalar"), (r) => A.matrixLinear(r, "combo"), A.matrixMultiply, (r) => B.matrixEquation(r, true), A.matrixProperties, (r) => B.matrixEquation(r, false))],
  ["determinante", "matrices", "Determinante e inversa", mix((r) => B.determinant(r, false), (r) => B.determinant(r, true), (r) => B.matrixInverse(r, "inverse"), Pc.inverse3, (r) => B.matrixInverse(r, "identify"), (r) => B.matrixInverse(r, "solve"))],
  ["transformaciones", "matrices", "Matrices de transformación", mix((r) => B.transformMatrix(r, "identify"), (r) => B.transformMatrix(r, "vertex"), (r) => B.transformMatrix(r, "image"))],

  ["vectores", "vectores", "Módulo, dirección y componentes", mix(Ge.compassVector, Ge.vectorMagnitude, Ge.vectorComponents, Pc.directionAngle, Ge.vectorFromAngle)],
  ["sumar-vectores", "vectores", "Suma y resta de vectores", mix((r) => Ge.vectorAdd(r, "triangle"), (r) => Ge.vectorAdd(r, "parallelogram"), (r) => Ge.vectorAdd(r, "add"), (r) => Ge.vectorAdd(r, "subtract"), Pc.sumMagnitude)],
  ["escalares", "vectores", "Múltiplos escalares y vectores unitarios", mix((r) => Pc.scalarVector(r, "multiply"), (r) => Pc.scalarVector(r, "magnitude"), (r) => Pc.scalarVector(r, "direction"), (r) => Pc.scalarVector(r, "unit"), (r) => Pc.scalarVector(r, "combo"))],
  ["vectores-3d", "vectores", "Vectores en tres dimensiones", mix((r) => Pc.vector3D(r, "magnitude"), (r) => Pc.vector3D(r, "components"), (r) => Pc.vector3D(r, "addsub"), (r) => Pc.vector3D(r, "scalar"), (r) => Pc.vector3D(r, "unit"), (r) => Pc.vector3D(r, "combo"))],

  ["limites-graficos", "limites", "Límites a partir de gráficos", mix((r) => Pc.limitGraph(r, "two"), (r) => Pc.limitGraph(r, "one"), (r) => Pc.limitGraph(r, "exists"), (r) => Pc.limitInfinite(r, false), (r) => Pc.limitInfinite(r, true))],
  ["leyes-limites", "limites", "Leyes de los límites", mix((r) => Pc.limitLaws(r, "addMul"), (r) => Pc.limitLaws(r, "div"), (r) => Pc.limitLaws(r, "powRoot"), (r) => Pc.limitLaws(r, "all"), Pc.limitSubstitution, Pc.limitIndeterminate)],
  ["continuidad", "limites", "Continuidad", mix((r) => Pc.continuity(r, "identify"), (r) => Pc.continuity(r, "atPoint"), (r) => Pc.continuity(r, "oneSided"), (r) => Pc.continuity(r, "type"), (r) => Pc.continuity(r, "interval"))],
  ["derivadas", "limites", "Introducción a las derivadas", mix((r) => Pc.derivativeValue(r, "rate"), Pc.velocity, (r) => Pc.derivativeValue(r, "value"), (r) => Pc.derivativeValue(r, "slope"), Pc.tangentLine)],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_S5: Curriculum = { sections: SECTIONS, skills: SKILLS };
