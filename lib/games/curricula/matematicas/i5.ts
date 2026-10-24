import * as G from "../../generators";
import * as K from "../../generators/kinder";
import * as C from "../../generators/cneb/i5";
import type { Curriculum, Section, Skill } from "../../types";

// Matemáticas · Inicial 5 años, organizado según el CNEB (ciclo II). En
// Inicial hay dos competencias de matemática: cantidad y forma, movimiento y
// localización. El modo CNEB trae lo que pide el nivel esperado al terminar
// 5 años (contar hasta 10, agregar y quitar hasta 5, ordinales hasta el
// quinto, muchos/pocos/ninguno, pesa más/menos, ayer/hoy/mañana, cerca/lejos,
// formas del entorno); lo marcado `extendido` adelanta temas de 1.° grado.
// Como a esta edad todavía no se lee con soltura, toda pregunta lleva el
// botón 🔊 (se lee el enunciado si el juego no define otro audio).

type Gen = Skill["generate"];
const mix = (...gens: Gen[]): Gen => (r) => r.pick(gens)(r);
const X = "extendido" as const;

const SECTIONS: Section[] = [
  // Resuelve problemas de cantidad
  { id: "contar", name: "Contar hasta 10", icon: "🧮", topic: "numeros" },
  { id: "comparar", name: "Más, menos e igual", icon: "⚖️", topic: "numeros" },
  { id: "agregar-quitar", name: "Agregar y quitar", icon: "➕", topic: "suma-resta" },
  { id: "sumar-restar", name: "Sumas y restas", icon: "🧠", topic: "suma-resta", extended: true },
  { id: "numeros-20", name: "Números hasta 20", icon: "🔢", topic: "numeros", extended: true },
  { id: "numeros-100", name: "Números hasta 100", icon: "💯", topic: "numeros", extended: true },
  { id: "clasificar", name: "Agrupar y clasificar", icon: "🗂️", topic: "clasificar" },
  { id: "tiempo-peso", name: "El tiempo y el peso", icon: "⏱️", topic: "tiempo-masa" },
  { id: "dinero", name: "Monedas y billetes", icon: "🪙", topic: "dinero", extended: true },
  // Resuelve problemas de regularidad, equivalencia y cambio
  { id: "patrones", name: "Patrones", icon: "🎨", topic: "patrones", extended: true },
  // Resuelve problemas de forma, movimiento y localización
  { id: "ubicacion", name: "¿Dónde está?", icon: "📍", topic: "ubicacion" },
  { id: "figuras", name: "Figuras", icon: "🔷", topic: "figuras" },
  { id: "cuerpos", name: "Cuerpos", icon: "🧊", topic: "cuerpos" },
  { id: "medir", name: "Largo, corto, alto y bajo", icon: "📏", topic: "longitud-area" },
  { id: "partes", name: "Partes iguales", icon: "🍕", topic: "fracciones", extended: true },
  // Resuelve problemas de gestión de datos e incertidumbre
  { id: "datos", name: "Pictogramas", icon: "📊", topic: "graficos", extended: true },
];

type Row = [id: string, section: string, title: string, generate: Gen, extended?: typeof X];

const ROWS: Row[] = [
  ["reconocer-numeros", "contar", "¿Qué número es?", mix((r) => K.idNumber(r, 1, 3, false), (r) => K.idNumber(r, 1, 5, false), (r) => K.idNumber(r, 0, 5, false), (r) => K.idNumber(r, 0, 9, false), (r) => K.idNumber(r, 0, 10, false))],
  ["numero-escuchado", "contar", "Toca el número que escuchas", mix((r) => K.idNumber(r, 1, 3, true), (r) => K.idNumber(r, 1, 5, true), (r) => K.idNumber(r, 0, 5, true), (r) => K.idNumber(r, 1, 7, true), (r) => K.idNumber(r, 1, 9, true), (r) => K.idNumber(r, 0, 10, true))],
  ["contar-3", "contar", "Cuenta hasta 3", mix((r) => K.count(r, 1, 3, "learn"), (r) => K.count(r, 1, 3, "pictures"), (r) => K.count(r, 1, 3, "shapes"), (r) => K.count(r, 1, 3, "cubes"), (r) => K.count(r, 1, 3, "frame"))],
  ["contar-5", "contar", "Cuenta hasta 5", mix((r) => K.count(r, 1, 5, "learn"), (r) => K.count(r, 1, 5, "pictures"), (r) => K.count(r, 1, 5, "shapes"), (r) => K.count(r, 1, 5, "cubes"), (r) => K.count(r, 0, 5, "dots"), (r) => K.count(r, 1, 5, "frame"))],
  ["contar-5-dispersos", "contar", "Cuenta cosas desordenadas hasta 5", mix((r) => K.count(r, 1, 5, "scatter"), (r) => K.count(r, 1, 5, "scatterShapes"))],
  ["contar-7-9", "contar", "Cuenta hasta 7 y hasta 9", mix((r) => K.count(r, 1, 7, "learn"), (r) => K.count(r, 1, 7, "pictures"), (r) => K.count(r, 1, 7, "cubes"), (r) => K.count(r, 1, 7, "frame"), (r) => K.count(r, 1, 9, "learn"), (r) => K.count(r, 1, 9, "pictures"), (r) => K.count(r, 1, 9, "cubes"), (r) => K.count(r, 1, 9, "frame"))],
  ["contar-10", "contar", "Cuenta hasta 10", mix((r) => K.count(r, 1, 10, "learn"), (r) => K.count(r, 1, 10, "pictures"), (r) => K.count(r, 1, 10, "cubes"), (r) => K.count(r, 0, 10, "dots"), (r) => K.count(r, 1, 10, "array"), (r) => K.count(r, 1, 10, "frame"), (r) => K.count(r, 1, 10, "blocks"))],
  ["contar-10-dispersos", "contar", "Cuenta cosas desordenadas o en ronda hasta 10", mix((r) => K.count(r, 1, 10, "scatter"), (r) => K.count(r, 1, 10, "scatterShapes"), (r) => K.count(r, 3, 10, "ring"))],
  ["mostrar-5", "contar", "Muestra la cantidad: hasta 5", mix((r) => K.show(r, 1, 3, "stickers"), (r) => K.show(r, 1, 3, "cubes"), (r) => K.show(r, 1, 3, "frame"), (r) => K.show(r, 1, 5, "stickers"), (r) => K.show(r, 1, 5, "cubes"), (r) => K.show(r, 1, 5, "frame"))],
  ["dibujar-5", "contar", "¿Qué dibujo tiene esa cantidad? Hasta 5", mix((r) => K.represent(r, 1, 3, "pictures"), (r) => K.represent(r, 1, 3, "shapes"), (r) => K.represent(r, 1, 5, "pictures"), (r) => K.represent(r, 0, 5, "pictures"), (r) => K.represent(r, 1, 5, "shapes"))],
  ["mostrar-10", "contar", "Muestra la cantidad: hasta 10", mix((r) => K.show(r, 1, 7, "stickers"), (r) => K.show(r, 1, 7, "cubes"), (r) => K.show(r, 1, 7, "frame"), (r) => K.show(r, 1, 9, "stickers"), (r) => K.show(r, 1, 9, "cubes"), (r) => K.show(r, 1, 9, "frame"), (r) => K.show(r, 1, 10, "stickers"), (r) => K.show(r, 1, 10, "cubes"), (r) => K.show(r, 1, 10, "frame"))],
  ["dibujar-10", "contar", "¿Qué dibujo tiene esa cantidad? Hasta 10", mix((r) => K.represent(r, 1, 7, "pictures"), (r) => K.represent(r, 1, 9, "pictures"), (r) => K.represent(r, 1, 10, "pictures"))],
  ["que-sigue", "contar", "¿Qué número sigue al contar?", mix((r) => K.nextNumber(r, 5, "countUp"), (r) => K.nextNumber(r, 5, "next"), (r) => K.nextNumber(r, 10, "next"), (r) => K.nextNumber(r, 10, "countUp"), (r) => K.nextNumber(r, 10, "forward"), K.fillFrame)],
  ["contar-atras", "contar", "Cuenta hacia adelante y hacia atrás", mix((r) => K.nextNumber(r, 10, "upDown"), (r) => K.nextNumber(r, 10, "both"))],
  ["ordinales-5", "contar", "Primero, segundo, tercero, cuarto y quinto", (r) => K.ordinal(r, 5)],
  ["muchos-pocos", "contar", "Muchos, pocos y ninguno", C.manyFew],
  ["seriar", "contar", "Del más pequeño al más grande", C.seriate],
  ["nombres-numeros", "contar", "Lee el nombre de los números", (r) => K.numberName(r, 10), X],
  ["ordinales-10", "contar", "Los lugares hasta el décimo", (r) => K.ordinal(r, 10), X],
  ["recta-10", "contar", "Los números en la recta: antes, después y entre", mix((r) => K.numberLineK(r, 10), (r) => K.beforeAfterBetween(r, 10), (r) => K.sequenceK(r, 10, 1, false)), X],
  ["ordenar-numeros", "contar", "Ordena los números", mix((r) => K.orderK(r, 0, 5, 4), (r) => K.orderK(r, 0, 10, 4), (r) => K.orderK(r, 0, 10, 5)), X],

  ["misma-cantidad", "comparar", "¿Hay la misma cantidad?", mix((r) => K.sameNumber(r, 5), (r) => K.showEqual(r, 5), (r) => K.showEqual(r, 10))],
  ["mas-menos-5", "comparar", "¿Dónde hay más? ¿Dónde hay menos? Hasta 5", mix((r) => K.matchCompare(r, 5, "more"), (r) => K.matchCompare(r, 5, "fewer"), (r) => K.matchCompare(r, 5, "both"), (r) => K.matchCompare(r, 5, "same"), (r) => K.matchCompare(r, 5, "both", "count"), (r) => K.matchCompare(r, 5, "both", "mixed"))],
  ["alcanza-5", "comparar", "¿Alcanza para todos?", mix((r) => K.enough(r, 5), (r) => K.enough(r, 10))],
  ["mas-menos-10", "comparar", "¿Dónde hay más? ¿Dónde hay menos? Hasta 10", mix((r) => K.matchCompare(r, 10, "both"), (r) => K.matchCompare(r, 10, "same"), (r) => K.matchCompare(r, 10, "both", "count"), (r) => K.matchCompare(r, 10, "both", "mixed"))],
  ["mayor-menor-5", "comparar", "Más que, menos que: hasta 5", mix((r) => K.matchNumbers(r, 5, "greater"), (r) => K.matchNumbers(r, 5, "less"), (r) => K.gleCount(r, 5), (r) => K.showGLE(r, 5, true))],
  ["comparar-numeros-5", "comparar", "Compara dos números: hasta 5", mix((r) => K.showGLE(r, 5, false), (r) => K.compareTwo(r, 5), (r) => K.compareNumbers(r, 5, 2, "both")), X],
  ["comparar-numeros-10", "comparar", "Compara números: hasta 10", mix((r) => K.matchNumbers(r, 10, "both"), (r) => K.gleCount(r, 10), (r) => K.showGLE(r, 10, true), (r) => K.showGLE(r, 10, false), (r) => K.compareTwo(r, 10), (r) => K.compareNumbers(r, 10, 2, "both"), (r) => K.compareNumbers(r, 10, 3, "both")), X],

  ["uno-mas-menos-5", "agregar-quitar", "Uno más y uno menos: hasta 5", mix((r) => K.oneMoreLess(r, 5, 1, "pictures"), (r) => K.oneMoreLess(r, 5, 1, "frame"), (r) => K.oneMoreLess(r, 5, 1, "numbers"), (r) => K.oneMoreLess(r, 5, -1, "pictures"), (r) => K.oneMoreLess(r, 5, -1, "frame"))],
  ["juntar-5", "agregar-quitar", "Junta y cuenta: hasta 5", mix((r) => K.fact(r, 5, "+", "words"), (r) => K.buildTrain(r, 5, "+"), (r) => K.whichModel(r, 5, "+"), (r) => K.fact(r, 5, "+", "cubes"), (r) => K.fact(r, 5, "+", "pictures"))],
  ["agregar-5", "agregar-quitar", "Problemas de agregar: hasta 5", mix((r) => K.wordProblem(r, 5, "+", "cubes"), (r) => K.wordProblem(r, 5, "+", "pictures"), (r) => K.wordProblem(r, 5, "+", "plain"))],
  ["quitar-cubos-5", "agregar-quitar", "Quita y cuenta: hasta 5", mix((r) => K.fact(r, 5, "−", "cubes"), (r) => K.whichModel(r, 5, "−"), (r) => K.fact(r, 5, "−", "pictures"))],
  ["quitar-5", "agregar-quitar", "Problemas de quitar: hasta 5", mix((r) => K.wordProblem(r, 5, "−", "pictures"), (r) => K.wordProblem(r, 5, "−", "cubes"), (r) => K.wordProblem(r, 5, "−", "plain"))],
  ["uno-mas-menos-10", "agregar-quitar", "Uno más y uno menos: hasta 10", mix((r) => K.oneMoreLess(r, 10, 1, "pictures"), (r) => K.oneMoreLess(r, 10, 1, "frame"), (r) => K.oneMoreLess(r, 10, 1, "numbers"), (r) => K.oneMoreLess(r, 10, -1, "pictures"), (r) => K.oneMoreLess(r, 10, -1, "frame"), (r) => K.oneMoreLess(r, 10, -1, "numbers"), (r) => K.oneMoreLess(r, 10, 0, "pictures"), (r) => K.oneMoreLess(r, 10, 0, "frame"), (r) => K.oneMoreLess(r, 10, 0, "numbers")), X],

  ["escribir-sumas-5", "sumar-restar", "Escribe la suma: hasta 5", mix((r) => K.modelToSentence(r, 5, "+", "cubes"), (r) => K.modelToSentence(r, 5, "+", "pictures"), (r) => K.fact(r, 5, "+", "cubeSentence"), (r) => K.fact(r, 5, "+", "numbers"), (r) => K.wordProblem(r, 5, "+", "writePictures"), (r) => K.wordProblem(r, 5, "+", "write"))],
  ["completar-suma-5", "sumar-restar", "Completa la suma: hasta 5", mix((r) => K.fact(r, 5, "+", "missing"), (r) => K.fact(r, 5, "+", "makeUsing"))],
  ["descomponer-5", "sumar-restar", "Separa un número en dos partes: hasta 5", mix((r) => K.takeApart(r, 5, "cubes"), (r) => K.takeApart(r, 5, "ways"), (r) => K.takeApart(r, 5, "sentence"), (r) => K.takeApart(r, 5, "waysSentence"))],
  ["escribir-restas-5", "sumar-restar", "Escribe la resta: hasta 5", mix((r) => K.modelToSentence(r, 5, "−", "tower"), (r) => K.modelToSentence(r, 5, "−", "cubes"), (r) => K.modelToSentence(r, 5, "−", "pictures"), (r) => K.fact(r, 5, "−", "cubeSentence"), (r) => K.fact(r, 5, "−", "numbers"), (r) => K.wordProblem(r, 5, "−", "writePictures"), (r) => K.wordProblem(r, 5, "−", "write"))],
  ["completar-resta-5", "sumar-restar", "Completa la resta: hasta 5", mix((r) => K.fact(r, 5, "−", "missing"), (r) => K.fact(r, 5, "−", "makeUsing"))],
  ["sumar-10", "sumar-restar", "Sumas hasta 10", mix((r) => K.fact(r, 10, "+", "words"), (r) => K.buildTrain(r, 10, "+"), (r) => K.whichModel(r, 10, "+"), (r) => K.modelToSentence(r, 10, "+", "cubes"), (r) => K.modelToSentence(r, 10, "+", "pictures"), (r) => K.wordsToSentence(r, 10, "+"), (r) => K.fact(r, 10, "+", "cubes"), (r) => K.fact(r, 10, "+", "cubeSentence"), (r) => K.fact(r, 10, "+", "pictures"), (r) => K.fact(r, 10, "+", "numbers"))],
  ["sumar-1-2", "sumar-restar", "Suma 1 o 2 y cambia el orden", mix((r) => K.fact(r, 10, "+", "oneTwo"), (r) => K.fact(r, 10, "+", "anyOrder"))],
  ["completar-10", "sumar-restar", "Completa hasta 10", mix((r) => K.fact(r, 10, "+", "makeTenModel"), (r) => K.fact(r, 10, "+", "makeTen"), (r) => K.fact(r, 10, "+", "missing"), (r) => K.fact(r, 10, "+", "makeUsing"))],
  ["descomponer-10", "sumar-restar", "Separa un número en dos partes: hasta 10", mix((r) => K.takeApart(r, 10, "cubes"), (r) => K.takeApart(r, 10, "ways"), (r) => K.takeApart(r, 10, "cubes", 10), (r) => K.takeApart(r, 10, "decompose"), (r) => K.takeApart(r, 10, "sentence"), (r) => K.takeApart(r, 10, "sentence", 10), (r) => K.takeApart(r, 10, "waysSentence"))],
  ["problemas-suma-10", "sumar-restar", "Problemas de suma: hasta 10", mix((r) => K.wordProblem(r, 10, "+", "cubes"), (r) => K.wordProblem(r, 10, "+", "pictures"), (r) => K.wordProblem(r, 10, "+", "writePictures"), (r) => K.wordProblem(r, 10, "+", "plain"), (r) => K.wordProblem(r, 10, "+", "write"))],
  ["restar-10", "sumar-restar", "Restas hasta 10", mix((r) => K.fact(r, 10, "−", "cubes"), (r) => K.whichModel(r, 10, "−"), (r) => K.modelToSentence(r, 10, "−", "tower"), (r) => K.modelToSentence(r, 10, "−", "cubes"), (r) => K.modelToSentence(r, 10, "−", "pictures"), (r) => K.wordsToSentence(r, 10, "−"), (r) => K.fact(r, 10, "−", "cubeSentence"), (r) => K.fact(r, 10, "−", "pictures"), (r) => K.fact(r, 10, "−", "numbers"))],
  ["restar-1-2", "sumar-restar", "Resta 1 o 2", (r) => K.fact(r, 10, "−", "oneTwo")],
  ["completar-resta-10", "sumar-restar", "Completa la resta: hasta 10", mix((r) => K.fact(r, 10, "−", "makeUsing"), (r) => K.fact(r, 10, "−", "missing"))],
  ["problemas-resta-10", "sumar-restar", "Problemas de resta: hasta 10", mix((r) => K.wordProblem(r, 10, "−", "pictures"), (r) => K.wordProblem(r, 10, "−", "writePictures"), (r) => K.wordProblem(r, 10, "−", "cubes"), (r) => K.wordProblem(r, 10, "−", "plain"), (r) => K.wordProblem(r, 10, "−", "write"))],
  ["sumar-o-restar", "sumar-restar", "¿Sumo o resto?", mix((r) => K.mixedFact(r, 5), (r) => K.mixedFact(r, 10), (r) => K.fact(r, 10, "+", "zero"))],
  ["formas-de-obtener", "sumar-restar", "Muchas formas de llegar a un número", mix(K.waysToMake, (r) => K.relatedFacts(r, 5), (r) => K.relatedFacts(r, 10))],
  ["problemas-mezcla", "sumar-restar", "Problemas de sumar y restar", mix((r) => K.wordProblem(r, 10, "mixed", "pictures"), (r) => K.wordProblem(r, 10, "mixed", "cubes"), (r) => K.wordProblem(r, 10, "mixed", "plain"), (r) => K.wordProblem(r, 10, "mixed", "write"))],

  ["numeros-20", "numeros-20", "Reconoce y escribe los números hasta 20", mix((r) => K.idNumber(r, 11, 20, false), (r) => K.writeHeard(r, 20), (r) => K.numberName(r, 20))],
  ["contar-20", "numeros-20", "Cuenta hasta 20", mix((r) => K.count(r, 6, 15, "array"), (r) => K.count(r, 6, 15, r.chance(0.5) ? "array" : "ring"), (r) => K.count(r, 11, 20, "array"), (r) => K.count(r, 0, 20, "dots"), (r) => K.count(r, 11, 20, "frame"), (r) => K.count(r, 11, 20, "blocks"), (r) => K.count(r, 11, 20, r.chance(0.5) ? "array" : "ring"))],
  ["mostrar-20", "numeros-20", "Muestra la cantidad: hasta 20", mix((r) => K.show(r, 6, 15, "stickers"), (r) => K.show(r, 11, 20, "frame"), (r) => K.represent(r, 11, 20, "pictures"))],
  ["uno-mas-menos-20", "numeros-20", "Uno más y uno menos: hasta 20", mix((r) => K.oneMoreLess(r, 20, 1, "numbers"), (r) => K.oneMoreLess(r, 20, -1, "numbers"), (r) => K.oneMoreLess(r, 20, 0, "numbers"))],
  ["secuencias-20", "numeros-20", "Cuenta hacia adelante y hacia atrás: hasta 20", mix((r) => K.chartCount(r, 20, false), (r) => K.nextNumber(r, 20, "countUp"), (r) => K.nextNumber(r, 20, "upDown"), (r) => K.nextNumber(r, 20, "forward"), (r) => K.nextNumber(r, 20, "backward"), (r) => K.nextNumber(r, 20, "both"), (r) => K.sequenceK(r, 20, 1, true), (r) => K.sequenceK(r, 20, 1, false))],
  ["recta-20", "numeros-20", "La recta hasta 20: antes, después y entre", mix((r) => K.numberLineK(r, 20), (r) => K.beforeAfterBetween(r, 20))],
  ["comparar-20", "numeros-20", "Compara y ordena hasta 20", mix((r) => K.matchCompare(r, 20, "both"), (r) => K.gleCount(r, 20), (r) => K.showGLE(r, 20, false), (r) => K.compareNumbers(r, 20, 2, "both", true), (r) => K.compareTwo(r, 20), (r) => K.orderK(r, 0, 20, 5))],
  ["once-diecinueve", "numeros-20", "Del 11 al 19: una decena y algo más", mix((r) => K.teen(r, "makeWords", true), (r) => K.teen(r, "makeWords", false), (r) => K.teen(r, "apartWords", true), (r) => K.teen(r, "apartWords", false), (r) => K.teen(r, "tensOnes", false), (r) => K.tensOnes(r, 20))],
  ["once-diecinueve-sumas", "numeros-20", "Del 11 al 19 con sumas", mix((r) => K.teen(r, "makeSentence", true), (r) => K.teen(r, "makeSentence", false), (r) => K.teen(r, "apartSentence", true), (r) => K.teen(r, "apartSentence", false), (r) => K.teen(r, "bothSentence", true), (r) => K.teen(r, "bothSentence", false))],

  ["contar-30", "numeros-100", "Cuenta hasta 30", mix((r) => K.count(r, 21, 30, "frame"), (r) => K.chartCount(r, 30, false), (r) => K.numberLineK(r, 30), (r) => K.nextNumber(r, 30, "forward"), (r) => K.count(r, 21, 30, "blocks"), (r) => K.tensOnes(r, 30))],
  ["de-diez-en-diez", "numeros-100", "De diez en diez", mix((r) => K.tens(r, "learn"), (r) => K.tens(r, "skip"), (r) => K.tens(r, "groups"), (r) => K.tens(r, "forward"))],
  ["contar-100", "numeros-100", "Cuenta hasta 100", mix((r) => K.chartCount(r, 50, false), (r) => K.writeHeard(r, 100), (r) => K.count(r, 20, 100, "tens"), (r) => K.count(r, 31, 99, "blocks"), (r) => K.chartCount(r, 100, false), (r) => K.chartCount(r, 100, true), (r) => K.nextNumber(r, 100, "countUp"), (r) => K.nextNumber(r, 100, "forward"), (r) => K.sequenceK(r, 100, r.chance(0.5) ? 1 : 10, true))],

  ["igual-diferente", "clasificar", "¿Igual o diferente?", mix((r) => K.sameDifferent(r, "different"), (r) => K.sameDifferent(r, "same"), (r) => K.sameDifferent(r, "both"))],
  ["agrupar-color-forma", "clasificar", "Agrupa por color y por forma", mix((r) => K.classify(r, "color"), (r) => K.classify(r, "sortColor"), (r) => K.classify(r, "sortShape"), (r) => K.classify(r, "sort"))],
  ["agrupar-contar", "clasificar", "Agrupa, cuenta y compara", mix((r) => K.classify(r, "sortCount"), (r) => K.classify(r, "sortCompare"))],
  ["venn", "clasificar", "Agrupa en dos círculos", mix((r) => K.classify(r, "vennCount"), (r) => K.classify(r, "vennSort")), X],

  ["ayer-hoy-manana", "tiempo-peso", "Antes y después; ayer, hoy y mañana", C.timeNotions],
  ["pesado-liviano", "tiempo-peso", "¿Pesa más o pesa menos?", (r) => K.measure(r, "heavy")],
  ["reloj", "tiempo-peso", "La hora en punto", mix((r) => K.clockK(r, "words"), (r) => K.clockK(r, "digital"), (r) => K.clockK(r, "read")), X],

  ["monedas", "dinero", "Monedas y billetes del Perú", mix((r) => K.money(r, "names"), (r) => K.money(r, "values"))],
  ["contar-monedas", "dinero", "Cuenta monedas", mix((r) => K.money(r, "count1"), (r) => K.money(r, "count12"), (r) => K.money(r, "count125"), (r) => K.money(r, "compare"))],
  ["ganar-dinero", "dinero", "El dinero y el trabajo", mix((r) => K.financial(r, "earn"), (r) => K.financial(r, "gift"), (r) => K.financial(r, "jobs"))],
  ["deseos-necesidades", "dinero", "¿Lo necesito o lo deseo?", (r) => K.financial(r, "needs")],

  ["patrones", "patrones", "Patrones de colores, tamaños y figuras", mix((r) => K.patternK(r, "color", "next"), (r) => K.patternK(r, "size", "next"), (r) => K.patternK(r, "shape", "next"), (r) => K.patternK(r, "any", "next"))],
  ["completar-patron", "patrones", "Completa el patrón", (r) => K.patternK(r, "any", "complete")],
  ["patrones-crecen", "patrones", "Patrones que crecen", mix((r) => K.growing(r, "pattern"), (r) => K.growing(r, "nextShape"), (r) => K.growing(r, "nextRow"))],

  ["delante-detras", "ubicacion", "Delante, detrás, dentro y fuera", mix((r) => K.position(r, "front"), (r) => K.position(r, "inside"))],
  ["encima-debajo", "ubicacion", "Encima, debajo y al lado", mix((r) => K.position(r, "above"), (r) => K.position(r, "beside"), (r) => K.solidPosition(r, "above"), (r) => K.solidPosition(r, "beside"))],
  ["cerca-lejos", "ubicacion", "¿Cerca o lejos?", C.nearFar],
  ["izquierda-derecha", "ubicacion", "Izquierda, derecha, arriba y abajo", mix((r) => K.position(r, "lmr"), (r) => K.position(r, "tmb")), X],
  ["cuadricula", "ubicacion", "Ubica en la cuadrícula", G.gridPosition, X],

  ["circulos-triangulos", "figuras", "Círculos, triángulos, cuadrados y rectángulos", mix((r) => K.shapePick(r, "círculo"), (r) => K.shapePick(r, "triángulo"), (r) => K.shapePick(r, "rectángulo"), (r) => K.shapePick(r, "cuadrado"))],
  ["nombrar-figuras", "figuras", "¿Cómo se llama la figura?", mix(G.selectShapes2d, G.identifyShape2d, (r) => K.shapeSort(r, "círculo"), (r) => K.shapeSort(r, null))],
  ["partes-curvas", "figuras", "¿Tiene partes curvas?", (r) => K.shapeAttr(r, "curved")],
  ["formas-entorno", "figuras", "Figuras en las cosas de mi alrededor", (r) => K.realWorld(r, "2d")],
  ["hexagonos-componer", "figuras", "Hexágonos y figuras armadas", mix((r) => K.shapePick(r, "hexágono"), K.composeShapes), X],
  ["lados-esquinas", "figuras", "Cuenta lados y esquinas", mix((r) => K.shapeAttr(r, "corners"), (r) => K.shapeAttr(r, "squareCorners"), (r) => K.shapeAttr(r, "sides"), (r) => K.shapeAttr(r, "sidesCorners")), X],
  ["comparar-figuras", "figuras", "Compara figuras", mix((r) => K.shapeAttr(r, "equalSides"), (r) => K.shapeAttr(r, "compare"), (r) => K.shapeAttr(r, "attributes")), X],

  ["plano-o-solido", "cuerpos", "¿Es plano o es un cuerpo?", mix(K.flatOrSolid, K.describeSolid)],
  ["esferas-cubos", "cuerpos", "Esferas, cubos, conos y cilindros", mix((r) => K.shapePick(r, "esfera", "solids"), (r) => K.shapePick(r, "cubo", "solids"), (r) => K.shapePick(r, "cono", "solids"), (r) => K.shapePick(r, "cilindro", "solids"))],
  ["nombrar-cuerpos", "cuerpos", "¿Cómo se llama el cuerpo?", mix(G.selectSolids, G.identifySolid, (r) => K.shapeSort(r, null, "solids"))],
  ["cuerpos-entorno", "cuerpos", "Cuerpos en las cosas de mi alrededor", mix((r) => K.realWorld(r, "3dA"), (r) => K.realWorld(r, "3dB"))],
  ["huellas-armar", "cuerpos", "Huellas de los cuerpos y cuerpos armados", mix(G.tracedShapes, K.buildSolids), X],

  ["largo-corto", "medir", "Largo y corto, alto y bajo, ancho y angosto", mix((r) => K.measure(r, "long"), (r) => K.measure(r, "tall"), (r) => K.measure(r, "wide"))],
  ["capacidad", "medir", "¿Dónde cabe más? ¿Qué cubre más?", mix((r) => K.measure(r, "holds"), (r) => K.measure(r, "covers"), (r) => K.measure(r, "mixed"), (r) => K.measure(r, "which")), X],
  ["medir-cubos", "medir", "Mide con objetos y cubos", mix((r) => K.measure(r, "objects"), (r) => K.measure(r, "cubes"), (r) => K.measure(r, "buildCubes"), (r) => K.measure(r, "heightCubes"), (r) => K.measure(r, "buildHeight")), X],

  ["partes-iguales", "partes", "Partes iguales y mitades", mix((r) => K.equalParts(r, false), (r) => K.equalParts(r, true))],

  ["pictogramas", "datos", "Pictogramas", mix((r) => K.graph(r, "correct"), (r) => K.graph(r, "make"), (r) => K.graph(r, "interpret"))],
];

const SKILLS: Skill[] = ROWS.map(([id, section, title, generate, extended]) => ({
  id,
  section,
  title,
  icon: SECTIONS.find((s) => s.id === section)!.icon,
  extended: !!extended,
  generate: (r) => {
    const q = generate(r);
    return q.speak ? q : { ...q, speak: q.prompt };
  },
}));

export const MATEMATICAS_I5: Curriculum = { sections: SECTIONS, skills: SKILLS };
