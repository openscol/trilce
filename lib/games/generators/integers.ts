import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, SYMBOLS, choiceQ, d2, distinct, fixedQ, fshow, intQ, multiQ, numQ, orderQ, par, sg, sym, table, yesNo } from "./kit";

// Números enteros y racionales (6.° en adelante). Las respuestas que pueden
// ser negativas van como opción múltiple (ver intQ en kit.ts).

const nonZero = (r: Rng, max: number) => r.int(1, max) * r.pick([-1, 1]);
const line = (marked?: number, min = -10, max = 10): Visual => ({ kind: "numberLine", min, max, step: 1, labelEvery: 5, marked });

const SITUATIONS: [(n: number) => string, 1 | -1][] = [
  [(n) => `una temperatura de ${n} grados bajo cero`, -1],
  [(n) => `una temperatura de ${n} grados sobre cero`, 1],
  [(n) => `un buzo a ${n} metros bajo el nivel del mar`, -1],
  [(n) => `una montaña a ${n} metros sobre el nivel del mar`, 1],
  [(n) => `una deuda de ${n} soles`, -1],
  [(n) => `un ahorro de ${n} soles`, 1],
  [(n) => `una pérdida de ${n} puntos en el juego`, -1],
  [(n) => `una ganancia de ${n} puntos en el juego`, 1],
  [(n) => `bajar ${n} pisos desde la planta baja`, -1],
  [(n) => `subir ${n} pisos desde la planta baja`, 1],
  [(n) => `un retiro de ${n} soles de la cuenta`, -1],
  [(n) => `un depósito de ${n} soles en la cuenta`, 1],
];

// 6.° O.1: comprender los números enteros.
export function understandIntegers(r: Rng): Question {
  const [text, sign] = r.pick(SITUATIONS);
  const n = r.int(2, 90);
  return intQ(r, `¿Qué número entero representa ${text(n)}?`, sign * n, sign < 0 ? "Lo que está por debajo de cero (o se pierde) se representa con un número negativo." : "Lo que está por encima de cero (o se gana) se representa con un número positivo.", undefined, sign < 0 ? "negativo" : "positivo");
}

// 6.° O.2 / O.3: enteros en rectas numéricas (horizontal, o vertical como termómetro).
export function integersOnLine(r: Rng, vertical = false): Question {
  const n = r.int(-9, 9);
  if (vertical && r.chance(0.5)) return intQ(r, "¿Qué temperatura marca el termómetro, en grados?", n * 2, `La columna llega hasta ${sg(n * 2)}: por debajo de 0 los números son negativos.`, { kind: "thermometer", value: n * 2, min: -20, max: 20 }, "vertical");
  return intQ(r, "¿Qué número entero marca el punto?", n, `Las marcas van de 1 en 1; a la izquierda de 0 están los negativos: el punto está en ${sg(n)}.`, line(n), "horizontal");
}

// 6.° O.4: enteros opuestos.
export function oppositeIntegers(r: Rng): Question {
  const n = nonZero(r, 60);
  const form = r.int(0, 2);
  if (form === 0) return intQ(r, `¿Cuál es el opuesto de ${sg(n)}?`, -n, `El opuesto está a la misma distancia de 0, pero al otro lado: ${sg(-n)}.`, undefined, "opuesto");
  if (form === 1) return intQ(r, `¿Cuál es el opuesto del opuesto de ${sg(n)}?`, n, `El opuesto de ${sg(n)} es ${sg(-n)}, y el opuesto de ${sg(-n)} es ${sg(n)}.`, undefined, "doble-opuesto");
  return numQ(Math.abs(n) * 2, `En la recta numérica, ¿cuántas unidades hay entre ${sg(n)} y su opuesto?`, undefined, `Cada uno está a ${Math.abs(n)} unidades de 0: ${Math.abs(n)} + ${Math.abs(n)} = ${Math.abs(n) * 2}.`, "distancia");
}

// 6.° O.5 / O.6: valor absoluto.
export function absoluteValue(r: Rng, concept: boolean): Question {
  const n = nonZero(r, concept ? 12 : 90);
  if (concept) return numQ(Math.abs(n), `¿A cuántas unidades de 0 está el ${sg(n)} en la recta numérica?`, line(n, -12, 12), `El valor absoluto es la distancia a 0, siempre positiva: |${sg(n)}| = ${Math.abs(n)}.`);
  const form = r.int(0, 2);
  if (form === 0) return numQ(Math.abs(n), "Calcula el valor absoluto.", `|${sg(n)}| = ?`, `|${sg(n)}| = ${Math.abs(n)}: es la distancia a 0.`, "calcular");
  if (form === 1) return intQ(r, "Calcula.", -Math.abs(n), `|${sg(n)}| = ${Math.abs(n)}; el signo menos de afuera lo vuelve negativo: ${sg(-Math.abs(n))}.`, `−|${sg(n)}| = ?`, "con-signo-afuera");
  const m = nonZero(r, 30);
  return numQ(Math.abs(n) + Math.abs(m), "Calcula.", `|${sg(n)}| + |${sg(m)}| = ?`, `${Math.abs(n)} + ${Math.abs(m)} = ${Math.abs(n) + Math.abs(m)}.`, "suma");
}

// 6.° O.7 / O.9: comparar enteros (`absolute`: con valores absolutos).
export function compareIntegers(r: Rng, absolute = false): Question {
  const a = nonZero(r, 30);
  const b = r.chance(0.15) ? (absolute ? -a : a) : r.chance(0.3) ? -a + r.pick([-1, 1]) : nonZero(r, 30);
  if (!absolute) return fixedQ("Elige el símbolo correcto.", SYMBOLS, sym(a, b), `En la recta, el que está más a la derecha es el mayor: ${sg(a)} ${sym(a, b)} ${sg(b)}.`, `${sg(a)}  ?  ${sg(b)}`, sym(a, b));
  const leftAbs = r.chance(0.7);
  const rightAbs = !leftAbs || r.chance(0.5);
  const lv = leftAbs ? Math.abs(a) : a;
  const rv = rightAbs ? Math.abs(b) : b;
  const show = (n: number, abs: boolean) => (abs ? `|${sg(n)}|` : sg(n));
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, sym(lv, rv), `${show(a, leftAbs)} = ${sg(lv)} y ${show(b, rightAbs)} = ${sg(rv)}.`, `${show(a, leftAbs)}  ?  ${show(b, rightAbs)}`, sym(lv, rv));
}

// 6.° O.8: ordenar enteros.
export function orderIntegers(r: Rng): Question {
  const nums = distinct(r, 5, -30, 30);
  const ascending = r.chance(0.6);
  const sorted = [...nums].sort((a, b) => (ascending ? a - b : b - a));
  return orderQ(r, `Ordena los números de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`, sorted.map(sg), `El orden correcto es ${sorted.map(sg).join(" ; ")}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
}

// 6.° O.10: problemas con enteros y valor absoluto.
export function integerProblem(r: Rng): Question {
  const [n1, n2] = r.shuffle(NAMES).slice(0, 2);
  const a = r.int(2, 40);
  const b = r.int(2, 40);
  const form = r.int(0, 3);
  if (form === 0) return numQ(a + b, `Un ave vuela a ${a} m sobre el nivel del mar y un pez nada a ${b} m bajo el nivel del mar (${sg(-b)} m). ¿Cuántos metros los separan?`, undefined, `|${a}| + |${sg(-b)}| = ${a} + ${b} = ${a + b} m.`, "distancia");
  if (form === 1) {
    if (a === b) return integerProblem(r);
    return fixedQ(`${n1} debe ${a} soles (${sg(-a)}) y ${n2} debe ${b} soles (${sg(-b)}). ¿Quién debe más?`, [n1, n2], a > b ? n1 : n2, `Se comparan los valores absolutos: |${sg(-a)}| = ${a} y |${sg(-b)}| = ${b}.`, undefined, "comparar-deudas");
  }
  if (form === 2) return numQ(a, `La temperatura en la sierra es de ${sg(-a)} °C. ¿Cuántos grados debe subir para llegar a 0 °C?`, undefined, `La distancia de ${sg(-a)} a 0 es |${sg(-a)}| = ${a}.`, "hasta-cero");
  if (a === b) return integerProblem(r);
  return fixedQ(`Una ciudad está a ${sg(-a)} °C y otra a ${sg(-b)} °C. ¿Cuál hace más frío?`, [`La de ${sg(-a)} °C`, `La de ${sg(-b)} °C`], a > b ? `La de ${sg(-a)} °C` : `La de ${sg(-b)} °C`, `${sg(-Math.max(a, b))} está más a la izquierda en la recta: es la temperatura menor.`, undefined, "mas-frio");
}

// ---------------------------------------------------------------------------
// Operaciones con enteros

type IntOp = "+" | "−" | "×" | "÷";
function intOperands(r: Rng, op: IntOp, max = 12): [number, number, number] {
  if (op === "×") {
    const a = nonZero(r, max);
    const b = nonZero(r, max);
    return [a, b, a * b];
  }
  if (op === "÷") {
    const b = nonZero(r, max);
    const q = nonZero(r, max);
    return [b * q, b, q];
  }
  const a = r.int(-max * 2, max * 2);
  const b = nonZero(r, max * 2);
  return [a, b, op === "+" ? a + b : a - b];
}
const WHY: Record<IntOp, (a: number, b: number, c: number) => string> = {
  "+": (a, b, c) => `${sg(a)} + ${par(b)} = ${sg(c)}.`,
  "−": (a, b, c) => `Restar es sumar el opuesto: ${sg(a)} + ${par(-b)} = ${sg(c)}.`,
  "×": (a, b, c) => `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(c)}; signos ${a < 0 === b < 0 ? "iguales dan positivo" : "distintos dan negativo"}: ${sg(c)}.`,
  "÷": (a, b, c) => `${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(c)}; signos ${a < 0 === b < 0 ? "iguales dan positivo" : "distintos dan negativo"}: ${sg(c)}.`,
};

// 6.° P.3 / P.6 / P.13 / P.15 / P.16: operar con dos enteros.
export function integerOperation(r: Rng, ops: IntOp[], max = 12): Question {
  const op = r.pick(ops);
  const [a, b, c] = intOperands(r, op, max);
  return intQ(r, "Resuelve.", c, WHY[op](a, b, c), `${sg(a)} ${op} ${par(b)} = ?`, op, op === "−" ? [a + b] : op === "+" ? [a - b] : []);
}

const chips = (n: number) => (n > 0 ? "🟡" : "🔴").repeat(Math.abs(n));

// 6.° P.1 / P.4: sumar y restar enteros con fichas (🟡 = +1, 🔴 = −1).
export function integerCounters(r: Rng, op: "+" | "−"): Question {
  const a = nonZero(r, 7);
  const b = nonZero(r, 7);
  if (op === "+") return intQ(r, `Cada 🟡 vale +1 y cada 🔴 vale −1; una 🟡 con una 🔴 se anulan. ¿Cuánto es ${sg(a)} + ${par(b)}?`, a + b, `Se anulan los pares 🟡🔴 y queda ${sg(a + b)}.`, `${chips(a)}   +   ${chips(b)}`, "suma");
  return intQ(r, `Cada 🟡 vale +1 y cada 🔴 vale −1. Restar ${par(b)} es agregar su opuesto. ¿Cuánto es ${sg(a)} − ${par(b)}?`, a - b, `${sg(a)} − ${par(b)} = ${sg(a)} + ${par(-b)} = ${sg(a - b)}.`, `${chips(a)}   y se agregan   ${chips(-b)}`, "resta");
}

// 6.° P.2 / P.5: sumar y restar enteros en la recta numérica.
export function integerOnLineOperation(r: Rng, op: "+" | "−"): Question {
  for (;;) {
    const a = r.int(-8, 8);
    const b = nonZero(r, 8);
    const c = op === "+" ? a + b : a - b;
    if (Math.abs(c) > 10) continue;
    const move = op === "+" ? b : -b;
    return intQ(r, `El punto está en ${sg(a)}. Para calcular ${sg(a)} ${op} ${par(b)} se avanza ${Math.abs(b)} hacia la ${move > 0 ? "derecha" : "izquierda"}. ¿A qué número se llega?`, c, `Desde ${sg(a)}, ${Math.abs(b)} ${Math.abs(b) === 1 ? "paso" : "pasos"} a la ${move > 0 ? "derecha" : "izquierda"}: ${sg(c)}.`, line(a), op === "+" ? "suma" : "resta");
  }
}

const SIGN = ["Negativo", "Cero", "Positivo"];
const signOf = (n: number) => SIGN[Math.sign(n) + 1];

// 6.° P.7 / P.12 / P.14: hallar el signo del resultado.
export function integerSign(r: Rng, ops: IntOp[]): Question {
  const op = r.pick(ops);
  const big = op === "+" || op === "−";
  const [a0, b0, c0] = intOperands(r, op, big ? 40 : 12);
  // De vez en cuando, una suma de opuestos (resultado cero).
  const [a, b, c] = op === "+" && r.chance(0.12) ? [a0 || 7, -(a0 || 7), 0] : [a0, b0, c0];
  return fixedQ(`Sin calcular todo: ¿qué signo tiene el resultado de ${sg(a)} ${op} ${par(b)}?`, big ? SIGN : [SIGN[0], SIGN[2]], signOf(c), big ? `${sg(a)} ${op} ${par(b)} = ${sg(c)}.` : `Signos ${a < 0 === b < 0 ? "iguales: el resultado es positivo" : "distintos: el resultado es negativo"}.`, undefined, signOf(c).toLowerCase());
}

// 6.° P.8: problemas de suma y resta de enteros.
export function integerAddSubProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  const a = r.int(2, 25);
  const b = r.int(2, 25);
  const forms: [string, number, string][] = [
    [`La temperatura era de ${sg(-a)} °C y subió ${b} grados. ¿Cuál es la temperatura ahora?`, -a + b, `${sg(-a)} + ${b} = ${sg(-a + b)}`],
    [`La temperatura era de ${a} °C y bajó ${a + b} grados. ¿Cuál es la temperatura ahora?`, -b, `${a} − ${a + b} = ${sg(-b)}`],
    [`${name} tenía una deuda de ${a} soles (${sg(-a)}) y pidió prestados ${b} soles más. ¿Qué número representa su saldo?`, -a - b, `${sg(-a)} − ${b} = ${sg(-a - b)}`],
    [`Un submarino está a ${sg(-a - b)} m y sube ${b} m. ¿A qué profundidad queda?`, -a, `${sg(-a - b)} + ${b} = ${sg(-a)}`],
    [`En un juego, ${name} tenía ${a} puntos y perdió ${a + b}. ¿Cuántos puntos tiene ahora?`, -b, `${a} − ${a + b} = ${sg(-b)}`],
  ];
  const [text, answer, why] = r.pick(forms);
  return intQ(r, text, answer, `${why}.`);
}

// 6.° P.9: tablas de entrada y salida con enteros.
export function integerTable(r: Rng): Question {
  const k = nonZero(r, 12);
  const add = r.chance(0.5);
  const inputs = distinct(r, 4, -12, 12).sort((a, b) => a - b);
  const out = (x: number) => (add ? x + k : x - k);
  const hidden = r.int(0, 3);
  return intQ(r, `Regla: ${add ? "sumar" : "restar"} ${sg(k)}. ¿Qué número falta en la tabla?`, out(inputs[hidden]), `${sg(inputs[hidden])} ${add ? "+" : "−"} ${par(k)} = ${sg(out(inputs[hidden]))}.`, table(["Entrada", "Salida"], inputs.map((x, i) => [sg(x), i === hidden ? "?" : sg(out(x))])), add ? "suma" : "resta");
}

// 6.° P.10: sumar tres o más enteros.
export function addSeveralIntegers(r: Rng): Question {
  const xs = Array.from({ length: r.int(3, 4) }, () => nonZero(r, 20));
  const total = xs.reduce((a, b) => a + b, 0);
  const pos = xs.filter((x) => x > 0).reduce((a, b) => a + b, 0);
  const neg = xs.filter((x) => x < 0).reduce((a, b) => a + b, 0);
  return intQ(r, "Resuelve.", total, `Positivos: ${pos}; negativos: ${sg(neg)}; ${pos} + ${par(neg)} = ${sg(total)}.`, `${xs.map((x, i) => (i === 0 ? sg(x) : par(x))).join(" + ")} = ?`, `${xs.length}-sumandos`);
}

// 6.° P.11: multiplicar por un entero negativo en la recta numérica.
export function multiplyOnLine(r: Rng): Question {
  const k = r.int(2, 4);
  const jump = -r.int(1, Math.floor(10 / k));
  return intQ(r, `En la recta se dan ${k} saltos de ${sg(jump)} desde 0. ¿Cuánto es ${k} × ${par(jump)}?`, k * jump, `${Array.from({ length: k }, () => par(jump)).join(" + ")} = ${sg(k * jump)}.`, line(k * jump), undefined, [k - jump]);
}

// 6.° P.17: expresiones numéricas con enteros.
export function integerExpression(r: Rng): Question {
  const a = nonZero(r, 9);
  const b = nonZero(r, 9);
  const c = nonZero(r, 6);
  const forms: [string, number, string][] = [
    [`${sg(a)} + ${par(b)} × ${par(c)}`, a + b * c, `${par(b)} × ${par(c)} = ${sg(b * c)}; ${sg(a)} + ${par(b * c)}`],
    [`(${sg(a)} + ${par(b)}) × ${par(c)}`, (a + b) * c, `${sg(a)} + ${par(b)} = ${sg(a + b)}; ${par(a + b)} × ${par(c)}`],
    [`${sg(a)} − ${par(b)} + ${par(c)}`, a - b + c, `${sg(a)} − ${par(b)} = ${sg(a - b)}; ${sg(a - b)} + ${par(c)}`],
    [`${sg(a * c)} ÷ ${par(c)} − ${par(b)}`, a - b, `${sg(a * c)} ÷ ${par(c)} = ${sg(a)}; ${sg(a)} − ${par(b)}`],
    [`${sg(a)} × ${par(b)} − ${par(c)}`, a * b - c, `${sg(a)} × ${par(b)} = ${sg(a * b)}; ${sg(a * b)} − ${par(c)}`],
  ];
  const [text, value, steps] = r.pick(forms);
  return intQ(r, "Calcula. Respeta el orden de las operaciones.", value, `${steps} = ${sg(value)}.`, `${text} = ?`);
}

// ---------------------------------------------------------------------------
// Números racionales (en centésimos, con signo)

type Rational = { h: number; asFraction: boolean };
const HALVES = [25, 50, 75, 20, 40, 60, 80, 10, 30, 70, 90];
function rational(r: Rng, maxWhole = 4, negative?: boolean): Rational {
  const whole = r.int(0, maxWhole) * 100;
  const sign = negative ?? r.chance(0.6) ? -1 : 1;
  return { h: sign * (whole + r.pick(HALVES)), asFraction: r.chance(0.5) };
}
// −1,5 o −1 1/2
const rt = (q: Rational) => `${q.h < 0 ? "−" : ""}${q.asFraction ? fshow([Math.abs(q.h), 100]) : d2(Math.abs(q.h))}`;
const other = (q: Rational): Rational => ({ h: q.h, asFraction: !q.asFraction });

// 6.° Q.1: números racionales en rectas numéricas.
export function rationalOnLine(r: Rng): Question {
  const step = r.pick([50, 25]);
  const k = r.int(-3 * (100 / step), 3 * (100 / step));
  if (k % (100 / step) === 0) return rationalOnLine(r);
  const q: Rational = { h: k * step, asFraction: r.chance(0.5) };
  const wrong = [k + 1, k - 1, -k, k + 100 / step, k - 100 / step].filter((x) => x !== k).map((x) => rt({ h: x * step, asFraction: q.asFraction }));
  return choiceQ(r, "¿Qué número racional marca el punto?", rt(q), wrong.filter((w) => w !== rt(q) && w !== "0" && w !== "−0"), `Entre un entero y el siguiente hay ${100 / step} partes iguales; a la izquierda de 0 son negativos: ${rt(q)}.`, { kind: "numberLine", min: -3, max: 3, step: step / 100, labelEvery: 1, marked: q.h / 100 });
}

// 6.° Q.2: números racionales, ¿iguales o distintos?
export function rationalEqual(r: Rng): Question {
  const a = rational(r);
  const equal = r.chance(0.5);
  const b: Rational = equal ? other(a) : r.chance(0.5) ? { h: -a.h, asFraction: !a.asFraction } : { h: a.h + r.pick([-25, 25, 50, -10, 10]), asFraction: !a.asFraction };
  if (!equal && b.h === a.h) return rationalEqual(r);
  return yesNo(`¿${rt(a)} y ${rt(b)} son iguales?`, equal, equal ? `Sí: ${rt(a)} = ${rt(other(a))}.` : `No: ${rt(a)} = ${rt(other(a))}, que no es ${rt(b)}.`);
}

// 6.° Q.3 / Q.4: comparar números racionales (`withLine`: con recta numérica).
export function compareRationals(r: Rng, withLine = false): Question {
  const a = rational(r, withLine ? 2 : 4);
  const b = r.chance(0.15) ? other(a) : rational(r, withLine ? 2 : 4);
  const s = sym(a.h, b.h);
  return fixedQ(withLine ? `Ubica los dos números en la recta y elige el símbolo: ${rt(a)} ? ${rt(b)}` : "Elige el símbolo correcto.", SYMBOLS, s, `Como decimales: ${rt({ h: a.h, asFraction: false })} ${s} ${rt({ h: b.h, asFraction: false })}. En la recta, el de la derecha es el mayor.`, withLine ? { kind: "numberLine", min: -3, max: 3, step: 0.5, labelEvery: 1 } : `${rt(a)}  ?  ${rt(b)}`, s);
}

// 6.° Q.5: ordenar números racionales.
export function orderRationals(r: Rng): Question {
  for (;;) {
    const items = [rational(r, 3, true), rational(r, 3, true), rational(r, 3, false), rational(r, 3)];
    if (new Set(items.map((x) => x.h)).size < 4) continue;
    const ascending = r.chance(0.6);
    const sorted = [...items].sort((x, y) => (ascending ? x.h - y.h : y.h - x.h));
    return orderQ(r, `Ordena los números de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`, sorted.map(rt), `Como decimales: ${sorted.map((x) => rt({ h: x.h, asFraction: false })).join(" ; ")}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
  }
}

// 6.° Q.6: comparar y ordenar racionales en problemas.
export function rationalProblem(r: Rng): Question {
  const names = r.shuffle(["Puno", "Cusco", "Juliaca", "Huaraz", "Cerro de Pasco", "Huancavelica"]).slice(0, 3);
  // Temperaturas en décimos de grado, entre −12,0 y 8,0.
  const temps = distinct(r, 3, -24, 16).map((x) => x * 5);
  const coldest = r.chance(0.5);
  const target = coldest ? Math.min(...temps) : Math.max(...temps);
  const show = (t: number) => `${t < 0 ? "−" : ""}${d2(Math.abs(t) * 10)}`;
  return { kind: "choice", prompt: `Temperaturas de la madrugada: ${names.map((n, i) => `${n}: ${show(temps[i])} °C`).join("; ")}. ¿Dónde hizo ${coldest ? "más frío" : "menos frío"}?`, options: names, answer: names[temps.indexOf(target)], explanation: `La temperatura ${coldest ? "menor" : "mayor"} es ${show(target)} °C.`, tag: coldest ? "menor" : "mayor" };
}

// 6.° Q.7 / Q.8: opuesto y valor absoluto de números racionales.
export function rationalOppositeAbs(r: Rng, what: "opuesto" | "absoluto"): Question {
  const q = rational(r);
  const flip: Rational = { h: -q.h, asFraction: q.asFraction };
  const abs: Rational = { h: Math.abs(q.h), asFraction: q.asFraction };
  const answer = what === "opuesto" ? flip : abs;
  const wrongPool: Rational[] = [what === "opuesto" ? q : { h: -Math.abs(q.h), asFraction: q.asFraction }, { h: answer.h + 100, asFraction: q.asFraction }, { h: answer.h > 100 ? answer.h - 100 : answer.h + 50, asFraction: q.asFraction }, other({ h: -answer.h, asFraction: q.asFraction })];
  return choiceQ(r, what === "opuesto" ? `¿Cuál es el opuesto de ${rt(q)}?` : `¿Cuál es el valor absoluto de ${rt(q)}?`, rt(answer), wrongPool.filter((w) => w.h !== answer.h).map(rt), what === "opuesto" ? `El opuesto cambia el signo: ${rt(flip)}.` : `Es la distancia a 0, siempre positiva: |${rt(q)}| = ${rt(abs)}.`, what === "absoluto" ? `|${rt(q)}| = ?` : undefined, what);
}

// 6.° Q.9: números racionales, hallar el signo del resultado.
export function rationalSign(r: Rng): Question {
  const a = rational(r, 3);
  const b = rational(r, 3);
  const op = r.pick(["+", "−", "×", "÷"] as const);
  const value = op === "+" ? a.h + b.h : op === "−" ? a.h - b.h : a.h * b.h;
  if (value === 0) return rationalSign(r);
  const mult = op === "×" || op === "÷";
  return fixedQ(`¿Qué signo tiene el resultado de ${rt(a)} ${op} ${b.h < 0 ? `(${rt(b)})` : rt(b)}?`, [SIGN[0], SIGN[2]], signOf(value), mult ? `Signos ${a.h < 0 === b.h < 0 ? "iguales: positivo" : "distintos: negativo"}.` : `Se comparan los valores: el resultado es ${value < 0 ? "negativo" : "positivo"}.`, undefined, op);
}

const SETS = ["Números naturales", "Números enteros", "Números racionales"];
type Sample = { text: string; set: 0 | 1 | 2 };
function sample(r: Rng): Sample {
  const kind = r.int(0, 2) as 0 | 1 | 2;
  if (kind === 0) return { text: String(r.int(1, 200)), set: 0 };
  if (kind === 1) return { text: sg(-r.int(1, 200)), set: 1 };
  return { text: rt(rational(r)), set: 2 };
}

// 6.° Q.10: clasificar números racionales con un diagrama (el conjunto más pequeño).
export function classifyRational(r: Rng): Question {
  const s = sample(r);
  return fixedQ(`Los naturales están dentro de los enteros, y los enteros dentro de los racionales. ¿Cuál es el conjunto más pequeño al que pertenece ${s.text}?`, SETS, SETS[s.set], s.set === 0 ? "Sirve para contar: es natural (y también entero y racional)." : s.set === 1 ? "No tiene parte decimal, pero no sirve para contar: es entero (y también racional)." : "Tiene parte fraccionaria o decimal: es racional, pero no entero.", undefined, SETS[s.set]);
}

// 6.° Q.11: clasificar números (todos los conjuntos a los que pertenece).
export function classifyNumbers(r: Rng): Question {
  const s = sample(r);
  const negative = s.text.startsWith("−");
  return multiQ(`¿A qué conjuntos pertenece ${s.text}? Selecciona todos.`, [...SETS, "Números negativos"], [...SETS.slice(s.set), ...(negative ? ["Números negativos"] : [])], `Cada conjunto contiene al anterior: naturales ⊂ enteros ⊂ racionales.${negative ? " Además, es menor que 0." : ""}`, undefined, SETS[s.set]);
}

// 6.° W.10: comparar temperaturas sobre y bajo cero.
export function compareTemperatures(r: Rng): Question {
  const a = r.int(-25, 25);
  const b = r.chance(0.15) ? a : r.int(-25, 25);
  const s = sym(a, b);
  if (r.chance(0.5)) return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${sg(a)} °C ${s} ${sg(b)} °C: la temperatura mayor es la más caliente.`, `${sg(a)} °C  ?  ${sg(b)} °C`, s);
  if (a === b) return compareTemperatures(r);
  const warmer = r.chance(0.5);
  return fixedQ(`¿Qué temperatura es más ${warmer ? "cálida" : "fría"}?`, [`${sg(a)} °C`, `${sg(b)} °C`], `${sg(warmer ? Math.max(a, b) : Math.min(a, b))} °C`, `${sg(Math.max(a, b))} °C es mayor que ${sg(Math.min(a, b))} °C.`, { kind: "thermometer", value: a, min: -30, max: 30 }, warmer ? "calida" : "fria");
}
