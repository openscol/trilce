import * as G from "../../generators";
import * as A from "../../generators/alg1";
import * as B from "../../generators/alg2";
import * as Ge from "../../generators/geo";
import * as S from "../../generators/sec1";
import * as T from "../../generators/sec2";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · 4.° de Secundaria, organizado según el CNEB (ciclo VII). El
// modo CNEB trae: factorización e identidades algebraicas, ecuaciones y
// funciones cuadráticas, sistemas con una ecuación cuadrática, radicales y
// exponentes racionales, la función exponencial y el interés compuesto, la
// diferencia entre modelos lineales, cuadráticos y exponenciales, la ecuación
// de la recta y distancias en el plano, líneas y puntos notables del
// triángulo, razones trigonométricas, la circunferencia, cuerpos de
// revolución, áreas y volúmenes de formas compuestas, la desviación estándar y
// la probabilidad condicional. Lo marcado `extendido` va más allá (polinomios
// de grado mayor, expresiones y funciones racionales, funciones valor
// absoluto y raíz, transformaciones de funciones, regresión, construcciones).
// Toma el contenido de los antiguos cursos de Álgebra 1 (A), Álgebra 2 (B) y
// Geometría (Ge). π ≈ 3,14 (o en términos de π), decimales con coma, «sen».

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;
const build = (...keys: string[]): Gen => (r) => Ge.construction(r, keys);
const proof = (...domains: string[]): Gen => (r) => Ge.proofReason(r, domains);

const SECTIONS: Section[] = [
  { id: "radicales", name: "Radicales y exponentes racionales", icon: "√", topic: "potencias" },
  { id: "factorizacion", name: "Factorización", icon: "🧮", topic: "expresiones" },
  { id: "polinomios", name: "Polinomios de grado mayor", icon: "〰️", topic: "expresiones", extended: true },
  { id: "racionales", name: "Expresiones racionales", icon: "➗", topic: "expresiones", extended: true },
  { id: "ecuaciones-cuadraticas", name: "Ecuaciones cuadráticas", icon: "🌈", topic: "igualdades" },
  { id: "funcion-cuadratica", name: "Función cuadrática", icon: "🌈", topic: "funciones" },
  { id: "exponencial", name: "Función exponencial", icon: "🚀", topic: "funciones" },
  { id: "modelos", name: "Modelos lineales, cuadráticos y exponenciales", icon: "📊", topic: "funciones" },
  { id: "otras-funciones", name: "Valor absoluto, raíces y transformaciones", icon: "🔄", topic: "funciones", extended: true },
  { id: "variacion", name: "Variación conjunta y combinada", icon: "🔁", topic: "proporcionalidad", extended: true },
  { id: "recta", name: "Rectas en el plano cartesiano", icon: "📈", topic: "ubicacion" },
  { id: "notables", name: "Líneas y puntos notables", icon: "🔺", topic: "figuras" },
  { id: "trigonometria", name: "Razones trigonométricas", icon: "📐", topic: "trigonometria" },
  { id: "circunferencia", name: "La circunferencia", icon: "⭕", topic: "figuras" },
  { id: "construcciones", name: "Construcciones con circunferencias", icon: "🧭", topic: "figuras", extended: true },
  { id: "cuerpos", name: "Cuerpos geométricos y de revolución", icon: "🧊", topic: "cuerpos" },
  { id: "volumen", name: "Área de superficie y volumen", icon: "🧊", topic: "longitud-area" },
  { id: "estadistica", name: "Estadística", icon: "📊", topic: "estadistica" },
  { id: "bivariada", name: "Correlación y regresión", icon: "📉", topic: "graficos", extended: true },
  { id: "probabilidad", name: "Probabilidad", icon: "🎲", topic: "probabilidad" },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["simplificar-raices", "radicales", "Simplifica raíces cuadradas", mix(A.simplifyRoot, A.simplifyRootVar, (r) => B.radicalVars(r, false))],
  ["operar-radicales", "radicales", "Suma, resta y multiplica radicales", mix(A.addRadicals, A.multiplyRadicals, A.distributeRadical, A.radicalMixed)],
  ["racionalizar", "radicales", "Racionaliza con fracciones y conjugados", mix(A.radicalFractions, A.conjugate)],
  ["raices-enesimas", "radicales", "Raíces enésimas", mix((r) => B.nthRoot(r, "integer"), (r) => B.nthRoot(r, "rational"), B.rootCalculator, (r) => B.nthRoot(r, "nth"), (r) => B.radicalVars(r, true))],
  ["exponentes-racionales", "radicales", "Exponentes racionales", mix((r) => A.rationalPower(r, false), (r) => A.rationalPower(r, true), A.exponentToRadical)],
  ["leyes-racionales", "radicales", "Leyes de los exponentes racionales", mix((r) => A.rationalExponentRule(r, "product"), (r) => A.rationalExponentRule(r, "quotient"), (r) => A.rationalExponentRule(r, "power"), (r) => A.rationalExponentRule(r, "mixed"))],
  ["ecuaciones-exponentes", "radicales", "Ecuaciones con exponentes racionales", B.rationalExpEquation, X],

  ["factor-comun", "factorizacion", "M. c. d. de monomios y factor común", mix((r) => A.monomialGcfLcm(r, false), (r) => A.monomialGcfLcm(r, true), A.factorMonomial, G.factorsOfVariableExpression)],
  ["trinomios", "factorizacion", "Factoriza trinomios", mix((r) => A.factorQuadratic(r, "tiles"), (r) => A.factorQuadratic(r, "one"), (r) => A.factorQuadratic(r, "other"))],
  ["casos-especiales", "factorizacion", "Diferencia de cuadrados y trinomio cuadrado perfecto", mix(A.factorSpecial, A.factorPattern)],
  ["agrupacion", "factorizacion", "Factoriza por agrupación", A.factorGrouping],
  ["cubos", "factorizacion", "Suma y diferencia de cubos", B.cubes],
  ["factorizar-completo", "factorizacion", "Factoriza por completo", A.factorCompletely],

  ["division-sintetica", "polinomios", "División sintética y teorema del resto", mix((r) => B.synthetic(r, false), (r) => B.synthetic(r, true), B.factorTheorem)],
  ["binomio", "polinomios", "Triángulo de Pascal y binomio de Newton", mix((r) => B.binomialTheorem(r, "pascal"), (r) => B.binomialTheorem(r, "pascalBinomial"), (r) => B.binomialTheorem(r, "coef"), (r) => B.binomialTheorem(r, "term"))],
  ["ceros", "polinomios", "Ceros de un polinomio", mix(B.zerosFactored, B.polyFromZeros, (r) => B.solvePolynomial(r, false), (r) => B.solvePolynomial(r, r.chance(0.5)), (r) => B.solvePolynomial(r, true))],
  ["teoremas-raices", "polinomios", "Teoremas de las raíces", mix(B.rationalRoot, (r) => B.conjugateRoots(r, false), (r) => B.conjugateRoots(r, r.chance(0.5)), B.descartes, (r) => B.fundamentalTheorem(r, false), (r) => B.fundamentalTheorem(r, true))],
  ["graficos-polinomios", "polinomios", "Gráficos de funciones polinómicas", mix((r) => B.polyGraph(r, "cubic"), (r) => B.polyGraph(r, "end"), (r) => B.polyGraph(r, "zeros"), (r) => B.polyGraph(r, "match"), (r) => B.polyGraph(r, "domain"), B.evenOdd)],

  ["simplificar-racionales", "racionales", "Simplifica expresiones racionales", mix(A.simplifyRational, B.evaluateRational2, T.evaluateRationalExpr)],
  ["operar-racionales", "racionales", "Opera con expresiones racionales", mix(A.multiplyRational, (r) => A.addRational(r, false), (r) => A.addRational(r, true), B.complexFractionAlg, A.complexFraction)],
  ["ecuaciones-racionales", "racionales", "Ecuaciones racionales", A.rationalEquation],
  ["funciones-racionales", "racionales", "Funciones racionales y asíntotas", mix((r) => B.rationalFunction(r, "asymptotes"), (r) => B.rationalFunction(r, "reciprocal"), (r) => B.rationalFunction(r, "domain"))],

  ["raiz-cuadrada", "ecuaciones-cuadraticas", "Resuelve con raíces cuadradas", A.quadSqrt],
  ["por-factorizacion", "ecuaciones-cuadraticas", "Resuelve factorizando", mix((r) => A.quadFactorSolve(r, true), (r) => A.quadFactorSolve(r, false))],
  ["completar-cuadrado", "ecuaciones-cuadraticas", "Completa el cuadrado", mix(A.completeSquare, (r) => A.quadFormula(r, "square"))],
  ["formula-general", "ecuaciones-cuadraticas", "Fórmula general y discriminante", mix((r) => A.quadFormula(r, "formula"), A.discriminant)],
  ["cuadraticas-problemas", "ecuaciones-cuadraticas", "Ecuaciones cuadráticas: problemas", A.quadWord],
  ["inecuaciones-cuadraticas", "ecuaciones-cuadraticas", "Inecuaciones cuadráticas", mix((r) => B.quadInequality(r, true), (r) => B.quadInequality(r, false)), X],

  ["caracteristicas", "funcion-cuadratica", "Vértice, eje y ceros de una parábola", mix((r) => A.quadCharacteristics(r, true), (r) => A.quadCharacteristics(r, false), A.quadTable, (r) => A.quadZeros(r, false))],
  ["graficar-cuadratica", "funcion-cuadratica", "Grafica funciones cuadráticas", mix((r) => A.quadGraph(r, "vertex"), (r) => A.quadGraph(r, "standard"), (r) => A.quadGraph(r, "match"), A.quadTransform)],
  ["forma-vertice", "funcion-cuadratica", "Forma de vértice", A.toVertexForm],
  ["dominio-cuadratica", "funcion-cuadratica", "Dominio, rango y valor máximo o mínimo", mix((r) => A.quadDomainRange(r, true), (r) => A.quadDomainRange(r, false))],
  ["escribir-cuadratica", "funcion-cuadratica", "Escribe una función cuadrática", mix((r) => A.quadZeros(r, true), (r) => A.quadFromPoints(r, "vertex", "vertex"), (r) => A.quadFromPoints(r, "vertex", "standard"), (r) => A.quadFromPoints(r, "zeros", "factored"), (r) => A.quadFromPoints(r, "zeros", "standard"), B.quadThreePoints)],
  ["interpretar-cuadratica", "funcion-cuadratica", "Interpreta modelos cuadráticos", A.interpretQuadratic],
  ["sistemas-cuadraticos", "funcion-cuadratica", "Sistemas de una recta y una parábola", mix((r) => A.linearQuadSystem(r, true), (r) => A.linearQuadSystem(r, false))],
  ["sistemas-no-lineales", "funcion-cuadratica", "Rectas y circunferencias, dos parábolas", mix((r) => B.nonlinearSystem(r, "lineCircle"), (r) => B.nonlinearSystem(r, "parabolas")), X],

  ["evaluar-exponencial", "exponencial", "Evalúa y grafica funciones exponenciales", mix(A.evaluateExponential, (r) => A.matchExponential(r, "graph"), (r) => A.matchExponential(r, "match"), (r) => A.matchExponential(r, "matchShift"))],
  ["dominio-exponencial", "exponencial", "Dominio y rango de funciones exponenciales", mix((r) => A.exponentialDomainRange(r, true), (r) => A.exponentialDomainRange(r, false))],
  ["escribir-exponencial", "exponencial", "Escribe funciones exponenciales", mix(A.writeExponential, (r) => A.exponentialGrowth(r, "write"))],
  ["crecimiento", "exponencial", "Crecimiento y decrecimiento exponencial", mix((r) => A.exponentialGrowth(r, "identify"), (r) => A.exponentialGrowth(r, "word"))],
  ["interes-compuesto", "exponencial", "Interés compuesto", mix(A.compoundInterestWord, (r) => B.interestExp(r, false))],

  ["identificar-modelo", "modelos", "¿Lineal, cuadrática o exponencial?", mix((r) => A.identifyModel(r, ["lineal", "exponencial"], "graph"), (r) => A.identifyModel(r, ["lineal", "cuadrática", "exponencial"], "graph"), (r) => A.identifyModel(r, ["lineal", "exponencial"], "table"), (r) => A.identifyModel(r, ["lineal", "cuadrática", "exponencial"], "table"))],
  ["escribir-modelo", "modelos", "Escribe el modelo", mix((r) => A.writeModel(r, "word"), (r) => A.writeModel(r, "table"), (r) => A.writeModel(r, "table3"))],
  ["intervalos-unidad", "modelos", "Cambios en intervalos de una unidad", mix((r) => A.unitIntervals(r, false), (r) => A.unitIntervals(r, true), A.describeGrowth)],
  ["comparar-crecimiento", "modelos", "Compara el crecimiento", mix((r) => A.compareGrowth(r, false), (r) => A.compareGrowth(r, true))],

  ["funcion-absoluto", "otras-funciones", "Funciones valor absoluto", mix(A.absTable, A.absGraph, (r) => A.absDomainRange(r, true), (r) => A.absDomainRange(r, false), (r) => A.absTransform(r, false), (r) => A.absTransform(r, true))],
  ["inecuaciones-absoluto", "otras-funciones", "Inecuaciones de dos variables con valor absoluto", mix((r) => B.absInequality2(r, false), (r) => B.absInequality2(r, true))],
  ["funcion-raiz", "otras-funciones", "Funciones raíz cuadrada y cúbica", mix(A.evaluateRoot, (r) => A.rootDomainRange(r, true), (r) => A.rootDomainRange(r, false), (r) => A.rootGraph(r, false), (r) => A.rootGraph(r, true))],
  ["ecuaciones-radicales", "otras-funciones", "Ecuaciones con radicales", mix((r) => A.radicalEquation(r, 1), (r) => A.radicalEquation(r, 2))],
  ["transformaciones", "otras-funciones", "Transformaciones de funciones", mix(A.transformRules, (r) => A.transformFunction(r, "translate"), (r) => A.transformFunction(r, "reflect"), (r) => A.transformFunction(r, "dilate"), (r) => A.transformFunction(r, "mixed"), (r) => A.transformFunction(r, "describe"))],

  ["variacion", "variacion", "Variación directa, inversa, conjunta y combinada", mix((r) => T.directVariation(r, r.pick(["write", "solve"] as const)), (r) => A.inverseVariation(r, r.pick(["write", "solve"] as const)), (r) => B.variation(r, "classify"), (r) => B.variation(r, "write"), (r) => B.variation(r, "constant"), (r) => B.variation(r, "solve"))],

  ["ecuaciones-recta", "recta", "Ecuaciones de la recta", mix((r) => S.slope(r, r.chance(0.5)), A.graphLineMixed, T.writeFromSlopeIntercept, T.writeFromTwoPoints, T.writeFromSlopePoint, T.writeFromGraph)],
  ["paralelas-perpendiculares", "recta", "Rectas paralelas y perpendiculares", mix(T.parallelPerpendicular, A.parallelPerpLine)],
  ["distancia-recta", "recta", "Distancia de un punto a una recta", mix(Ge.pointLineDistance, Ge.parallelDistance)],
  ["demostraciones-coordenadas", "recta", "Clasifica figuras con coordenadas", mix(Ge.classifyOnPlane, (r) => A.midpointDistance(r, "mixed"), Ge.congruentSegments)],

  ["base-media", "notables", "Base media y bisectrices", mix(Ge.midsegment, Ge.bisectorTheorems)],
  ["lineas-notables", "notables", "Medianas, alturas, bisectrices y mediatrices", mix((r) => Ge.triangleSegments(r), (r) => Ge.triangleSegments(r, true))],
  ["baricentro", "notables", "Baricentro, circuncentro, incentro y ortocentro", mix(Ge.centroid, build("circumcenter", "incenter"), build("centroid", "orthocenter"))],
  ["demostraciones-triangulos", "notables", "Demostraciones con triángulos", mix(proof("triangles"), proof("triangles", "isosceles")), X],

  ["razones", "trigonometria", "Seno, coseno y tangente", mix((r) => Ge.trigRatio(r, "basic"), Ge.trigRadical, (r) => Ge.trigRatio(r, "similar"))],
  ["reciprocas", "trigonometria", "Cosecante, secante y cotangente", (r) => Ge.trigRatio(r, "reciprocal")],
  ["triangulos-notables", "trigonometria", "Triángulos rectángulos notables", mix((r) => Ge.specialRight(r, false), (r) => Ge.specialRight(r, true), (r) => Ge.specialAngles(r, false))],
  ["calculadora", "trigonometria", "Razones con calculadora y ángulos complementarios", mix((r) => Ge.trigCalculator(r, false), Ge.complementaryTrig, (r) => Ge.specialAngles(r, true), (r) => Ge.trigCalculator(r, true))],
  ["resolver-triangulo", "trigonometria", "Halla lados y ángulos", mix((r) => Ge.solveRight(r, "side"), (r) => Ge.solveRight(r, "angle"), (r) => Ge.solveRight(r, "solve"))],
  ["trigonometria-problemas", "trigonometria", "Ángulos de elevación y depresión", (r) => Ge.solveRight(r, "word")],
  ["pitagoras-repaso", "trigonometria", "Repaso: Pitágoras y su recíproco", mix((r) => T.pythagorean(r, "either"), T.pythagoreanConverse)],

  ["partes", "circunferencia", "Arcos, ángulos centrales y cuerdas", mix(S.circleParts, Ge.arcMeasures, S.centralAngles, Ge.arcsChords)],
  ["arco-sector", "circunferencia", "Longitud de arco y área de un sector", mix(Ge.arcFraction, (r) => Ge.arcSector(r, false), (r) => Ge.arcSector(r, true))],
  ["tangentes", "circunferencia", "Rectas tangentes y polígonos circunscritos", mix(Ge.tangentLines, Ge.inscribedCirclePerimeter)],
  ["inscritos", "circunferencia", "Ángulos inscritos", mix((r) => Ge.inscribedAngles(r, "angle"), (r) => Ge.inscribedAngles(r, "rightTriangle"), (r) => Ge.inscribedAngles(r, "quad1"), (r) => Ge.inscribedAngles(r, "quad2"))],
  ["secantes", "circunferencia", "Cuerdas, secantes y tangentes", mix(Ge.chordAngles, Ge.chordSegments), X],

  ["construir", "construcciones", "Tangentes y polígonos inscritos", mix(build("tangent"), build("inscribedTriangle"), build("inscribedSquare"), build("inscribedHexagon"), build("inscribedCircle", "circumscribedCircle"))],
  ["repaso-construcciones", "construcciones", "Repaso: construcciones geométricas", build("segment", "bisector", "angleBisector", "perpendicular", "parallel", "tangent", "inscribedHexagon", "circumscribedCircle")],

  ["vocabulario-cuerpos", "cuerpos", "Elementos de los cuerpos geométricos", mix(T.solidParts, Ge.solidVocabulary, G.netOfSolid, G.solidViews)],
  ["revolucion", "cuerpos", "Secciones y sólidos de revolución", mix(S.crossSections, Ge.revolution)],

  ["area-lateral", "volumen", "Área lateral y total", mix((r) => Ge.lateral(r, "prismCylinder"), (r) => Ge.lateral(r, "pyramidCone"), G.surfaceAreaPrism, (r) => G.triangularPrism(r, "superficie"), (r) => S.solidMeasure(r, "cylinderSurface"), G.surfaceAreaPyramid, (r) => T.roundSolid(r, "coneSurface"), (r) => T.roundSolid(r, "sphereSurface"))],
  ["volumenes", "volumen", "Volumen de prismas, pirámides, cilindros, conos y esferas", mix((r) => G.prismVolume(r, "formula"), (r) => G.triangularPrism(r, "volumen"), (r) => S.solidMeasure(r, "cylinderVolume"), (r) => S.solidMeasure(r, "pyramidVolume"), (r) => T.roundSolid(r, "coneVolume"), (r) => T.roundSolid(r, "sphereVolume"))],
  ["volumen-compuesto", "volumen", "Volumen de cuerpos compuestos", Ge.compoundVolume],
  ["solidos-semejantes", "volumen", "Sólidos semejantes y cambios de escala", mix(T.similarSolids, T.similarSolidMeasures, (r) => Ge.scaleChanges(r, false), (r) => Ge.scaleChanges(r, true))],

  ["desviacion", "estadistica", "Desviación estándar y valores atípicos", mix((r) => A.standardDeviation(r, false), (r) => A.standardDeviation(r, true), (r) => G.outliers(r, false), (r) => G.outliers(r, true))],
  ["muestreo", "estadistica", "Muestras y diseño de experimentos", mix(G.sampleTypes, B.experimentDesign)],
  ["doble-entrada", "estadistica", "Tablas de doble entrada", T.twoWayTable],

  ["dispersion", "bivariada", "Diagramas de dispersión y correlación", mix(T.interpretScatter, T.scatterOutlier, A.matchCorrelation, A.calculateCorrelation, A.correlationCausation)],
  ["regresion", "bivariada", "Rectas de regresión", mix(T.bestFitEquation, T.interpretBestFit, A.interpretRegression, A.regressionLine, A.analyzeRegression, A.exponentialRegression)],

  ["compuestos", "probabilidad", "Sucesos compuestos y conteo", mix((r) => G.probability(r, r.chance(0.4)), (r) => S.experimentalProbability(r, "probability"), S.compoundSampleSpace, G.countingPrinciple, S.outcomesProblem)],
  ["dependientes", "probabilidad", "Sucesos independientes y dependientes", mix(S.independentDependent, S.drawTwice, (r) => Ge.independence(r, false))],
  ["condicional", "probabilidad", "Probabilidad condicional", mix(Ge.conditionalProbability, (r) => Ge.twoWayProbability(r, false), (r) => Ge.twoWayProbability(r, true), (r) => Ge.independence(r, true))],
  ["regla-suma", "probabilidad", "Regla de la suma", Ge.additionRule],
  ["permutaciones", "probabilidad", "Permutaciones y combinaciones", mix(A.permutations, A.permCombNotation, Ge.comboProbability)],
  ["geometrica", "probabilidad", "Probabilidad geométrica", Ge.geometricProbability, X],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate,
}));

export const MATEMATICAS_S4: Curriculum = { sections: SECTIONS, skills: SKILLS };
