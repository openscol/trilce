import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { NAMES, choiceQ, decQ, fixedQ, fmt, fracQ, intQ, multiQ, numQ, par, sg, symbolQ, yesNo, type Frac } from "../kit";
import { pw } from "../numbers6";
import { type SF, nz, pdec, psf, sdec, sdecQ, sfQ, sfadd, sfdiv, sfmul, sfshow, sfsub } from "./util";

// Números de 1.° de secundaria: enteros, racionales con signo, potencias,
// notación científica y raíces cuadradas.

type Op = "+" | "−" | "×" | "÷";

// Cantidades que se anulan (suman cero).
export function combineToZero(r: Rng): Question {
  const n = r.int(2, 60);
  const name = r.pick(NAMES);
  const cases: [string, string][] = [
    [`Un buzo está a ${n} metros bajo el nivel del mar (−${n}). ¿Cuántos metros debe subir para llegar a la superficie (0)?`, `−${n} + ${n} = 0.`],
    [`${name} debe ${n} soles (−${n}). ¿Cuántos soles debe depositar para que su saldo sea 0?`, `−${n} + ${n} = 0.`],
    [`La temperatura es de ${n} grados bajo cero (−${n}). ¿Cuántos grados debe subir para llegar a 0?`, `−${n} + ${n} = 0.`],
    [`Un átomo tiene ${n} protones (carga +${n}). ¿Cuántos electrones, de carga −1 cada uno, necesita para que su carga total sea 0?`, `${n} + (−${n}) = 0.`],
    [`Un equipo perdió ${n} puntos en la primera ronda. ¿Cuántos puntos debe ganar para volver a 0?`, `−${n} + ${n} = 0.`],
  ];
  if (r.chance(0.35)) {
    const a = nz(r, 40);
    return intQ(r, `¿Qué número sumado con ${sg(a)} da 0?`, -a, `Un número y su opuesto suman cero: ${sg(a)} + ${par(-a)} = 0.`, undefined, "opuesto");
  }
  const [text, why] = r.pick(cases);
  return numQ(n, text, undefined, `Las cantidades opuestas se anulan: ${why}`, "situacion");
}

function operands(r: Rng, op: Op): [number, number, number] {
  if (op === "×") {
    const a = nz(r, 12), b = nz(r, 12);
    return [a, b, a * b];
  }
  if (op === "÷") {
    const b = nz(r, 12), q = nz(r, 12);
    return [b * q, b, q];
  }
  const a = r.int(-30, 30), b = nz(r, 30);
  return [a, b, op === "+" ? a + b : a - b];
}

// Completar operaciones con enteros (falta un número).
export function completeIntegerEquation(r: Rng, ops: Op[]): Question {
  const op = r.pick(ops);
  const [a, b, c] = operands(r, op);
  const hideFirst = r.chance(0.5);
  const text = hideFirst ? `? ${op} ${par(b)} = ${sg(c)}` : `${sg(a)} ${op} ? = ${sg(c)}`;
  return intQ(r, "¿Qué número falta?", hideFirst ? a : b, `${sg(a)} ${op} ${par(b)} = ${sg(c)}.`, text, op);
}

// Cocientes iguales de enteros; con `word`, lo mismo en una situación.
export function equalQuotients(r: Rng, word = false): Question {
  const b = r.int(2, 9), q = r.int(2, 9), a = b * q;
  if (word) {
    const cases: [string, string][] = [
      [`La temperatura bajó ${a} grados en ${b} horas, siempre al mismo ritmo. ¿Qué operación da el cambio de temperatura por hora?`, "grados por hora"],
      [`Un submarino descendió ${a} metros en ${b} minutos, al mismo ritmo. ¿Qué operación da su cambio de altura por minuto?`, "metros por minuto"],
      [`Una tienda perdió ${a} soles en ${b} días, la misma cantidad cada día. ¿Qué operación da el cambio de su dinero por día?`, "soles por día"],
    ];
    const [text, unit] = r.pick(cases);
    return choiceQ(r, text, `(−${a}) ÷ ${b} = −${q}`, [`${a} ÷ ${b} = ${q}`, `(−${a}) ÷ (−${b}) = ${q}`, `(−${a}) × ${b} = −${a * b}`, `${b} ÷ (−${a}) = −${q}`], `El cambio es negativo (−${a}) y se reparte en ${b} partes iguales: −${q} ${unit}.`);
  }
  const negative = r.chance(0.5);
  const neg = [`(−${a}) ÷ ${b}`, `${a} ÷ (−${b})`, `−(${a} ÷ ${b})`];
  const pos = [`${a} ÷ ${b}`, `(−${a}) ÷ (−${b})`, `−((−${a}) ÷ ${b})`];
  const [same, other] = negative ? [neg, pos] : [pos, neg];
  const shown = r.pick(same);
  const options = r.shuffle([...same.filter((x) => x !== shown), ...other.slice(0, 2)]);
  return multiQ(`Selecciona todas las expresiones que valen lo mismo que ${shown}.`, options, same.filter((x) => x !== shown), `${shown} = ${negative ? `−${q}` : q}. Un solo signo menos da negativo; dos signos menos dan positivo.`, undefined, negative ? "negativo" : "positivo");
}

// Identificar números racionales.
const RATIONAL: [string, boolean, string][] = [
  ["0,75", true, "es un decimal exacto: 3/4"], ["−8", true, "es un entero: −8/1"], ["3/5", true, "es una fracción de enteros"], ["0,333… (el 3 se repite)", true, "es un decimal periódico: 1/3"],
  ["√16", true, "vale 4"], ["2 1/3", true, "es 7/3"], ["−4,2", true, "es −42/10"], ["√25", true, "vale 5"], ["0,121212… (el 12 se repite)", true, "es un decimal periódico: 4/33"],
  ["√2", false, "sus decimales no terminan ni se repiten"], ["π", false, "sus decimales no terminan ni se repiten"], ["√10", false, "10 no es un cuadrado perfecto"],
  ["0,1010010001… (sin un bloque que se repita)", false, "sus decimales no terminan ni se repiten"], ["√7", false, "7 no es un cuadrado perfecto"], ["√3", false, "3 no es un cuadrado perfecto"],
];
export function identifyRational(r: Rng): Question {
  const [n, yes, why] = r.pick(RATIONAL);
  return yesNo(`¿El número ${n} es racional (se puede escribir como fracción de dos enteros)?`, yes, `${yes ? "Sí" : "No"}: ${why}.`);
}

// Clasificar números reales.
const SETS = ["Natural", "Entero", "Racional", "Irracional"];
const REALS: [string, number][] = [
  ["7", 0], ["12", 0], ["√9", 0], ["100", 0], ["−3", 1], ["−20", 1], ["−√4", 1], ["2/3", 2], ["−1,5", 2], ["0,25", 2], ["3 1/2", 2], ["−7/8", 2], ["√5", 3], ["π", 3], ["√11", 3], ["−√2", 3],
];
export function classifyReal(r: Rng): Question {
  const [n, i] = r.pick(REALS);
  return fixedQ(`¿Cuál es el conjunto más pequeño al que pertenece ${n}?`, SETS, SETS[i], `${n} es un número ${SETS[i].toLowerCase()}. (Naturales ⊂ enteros ⊂ racionales; los irracionales no se pueden escribir como fracción.)`, undefined, SETS[i]);
}

// Operar con decimales positivos y negativos (resultado en centésimos).
export function signedDecimals(r: Rng, ops: Op[]): Question {
  const op = r.pick(ops);
  if (op === "×") {
    const a = nz(r, 60), b = nz(r, 9); // décimos × décimos
    return sdecQ(r, "Resuelve.", a * b, `Se multiplican los valores absolutos y luego se pone el signo: signos ${a < 0 === b < 0 ? "iguales, positivo" : "distintos, negativo"}.`, `${sdec(a * 10)} × ${pdec(b * 10)} = ?`, op);
  }
  if (op === "÷") {
    const b = nz(r, 9), q = nz(r, 60); // divisor y cociente en décimos
    return sdecQ(r, "Resuelve.", q * 10, `Se dividen los valores absolutos y luego se pone el signo: signos ${q > 0 ? "iguales, positivo" : "distintos, negativo"}.`, `${sdec(b * q)} ÷ ${pdec(b * 10)} = ?`, op);
  }
  const a = nz(r, 90) * 10, b = nz(r, 90) * 10;
  const c = op === "+" ? a + b : a - b;
  return sdecQ(r, "Resuelve.", c, op === "+" ? `${sdec(a)} + ${pdec(b)} = ${sdec(c)}.` : `Restar es sumar el opuesto: ${sdec(a)} + ${pdec(-b)} = ${sdec(c)}.`, `${sdec(a)} ${op} ${pdec(b)} = ?`, op, [op === "+" ? a - b : a + b]);
}

const DENS = [2, 3, 4, 5, 6, 8];
const randSF = (r: Rng): SF => {
  const d = r.pick(DENS);
  return [nz(r, d + 3), d];
};
const apply = (op: Op, a: SF, b: SF): SF => (op === "+" ? sfadd(a, b) : op === "−" ? sfsub(a, b) : op === "×" ? sfmul(a, b) : sfdiv(a, b));

// Operar con fracciones positivas y negativas.
export function signedFractions(r: Rng, ops: Op[]): Question {
  const op = r.pick(ops);
  const a = randSF(r), b = randSF(r);
  const c = apply(op, a, b);
  const why = op === "×" || op === "÷" ? `Signos ${a[0] < 0 === b[0] < 0 ? "iguales: resultado positivo" : "distintos: resultado negativo"}. ${sfshow(a)} ${op} ${psf(b)} = ${sfshow(c)}.` : `${sfshow(a)} ${op} ${psf(b)} = ${sfshow(c)}.`;
  return sfQ(r, "Resuelve. Da el resultado simplificado.", c, why, `${sfshow(a)} ${op} ${psf(b)} = ?`, op, [apply(op === "+" ? "−" : op === "−" ? "+" : op, a, b)]);
}

// Racionales (decimales o fracciones).
export function rationalOperation(r: Rng, ops: Op[]): Question {
  return r.chance(0.5) ? signedDecimals(r, ops) : signedFractions(r, ops);
}

// Aplicar las reglas de la suma y la resta.
export function addSubRules(r: Rng): Question {
  const a = r.int(2, 30), b = r.int(2, 30);
  const y = b === a ? b + 1 : b;
  const forms: [string, string, string][] = [
    [`${a} − (−${y})`, `${a} + ${y}`, "Restar un negativo es sumar su opuesto."],
    [`${a} + (−${y})`, `${a} − ${y}`, "Sumar un negativo es restar su valor absoluto."],
    [`−${a} − ${y}`, `−(${a} + ${y})`, "Los dos números son negativos: se suman los valores absolutos y el resultado es negativo."],
    [`−${a} + ${y}`, `${y} − ${a}`, "La suma se puede escribir en otro orden."],
  ];
  const [shown, answer, why] = r.pick(forms);
  return choiceQ(r, `¿Qué expresión vale lo mismo que ${shown}?`, answer, forms.map((f) => f[1]).filter((x) => x !== answer), why, undefined, "reglas");
}

// Distancia entre dos números racionales en la recta numérica.
export function rationalDistance(r: Rng): Question {
  const a = nz(r, 80), b = nz(r, 80); // décimos
  if (a === b) return rationalDistance(r);
  const d = Math.abs(a - b);
  return decQ(r, `¿Qué distancia hay entre ${sdec(a * 10)} y ${sdec(b * 10)} en la recta numérica?`, d * 100, `La distancia es el valor absoluto de la resta: |${sdec(a * 10)} − ${pdec(b * 10)}| = ${sdec(d * 10)}.`, undefined, a < 0 !== b < 0 ? "lados-opuestos" : "mismo-lado", [Math.abs(a + b) * 100]);
}

// Aplicar las reglas de la multiplicación y la división (signo del resultado).
export function multDivRules(r: Rng): Question {
  const count = r.int(2, 4);
  const factors = Array.from({ length: count }, () => (r.chance(0.5) ? sdec(nz(r, 90) * 10) : sfshow(randSF(r))));
  const negatives = factors.filter((f) => f.startsWith("−")).length;
  const ops = factors.slice(1).map(() => r.pick(["×", "÷"]));
  const text = factors.map((f, i) => (i === 0 ? f : `${ops[i - 1]} ${f.startsWith("−") ? `(${f})` : f}`)).join(" ");
  return fixedQ("Sin calcular: ¿el resultado es positivo o negativo?", ["Positivo", "Negativo"], negatives % 2 === 0 ? "Positivo" : "Negativo", `Hay ${negatives} ${negatives === 1 ? "número negativo" : "números negativos"}: una cantidad ${negatives % 2 === 0 ? "par da resultado positivo" : "impar da resultado negativo"}.`, text, negatives % 2 === 0 ? "positivo" : "negativo");
}

// Expresiones numéricas con números racionales.
export function rationalExpression(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const a = nz(r, 50), b = nz(r, 9), c = nz(r, 6); // a y b en décimos, c entero
    const value = a * 10 + b * c * 10;
    return sdecQ(r, "Calcula el valor de la expresión.", value, `Primero la multiplicación: ${sdec(b * 10)} × ${pdec(c * 100)} = ${sdec(b * c * 10)}. Luego la suma: ${sdec(value)}.`, `${sdec(a * 10)} + ${pdec(b * 10)} × ${pdec(c * 100)}`, "decimal", [(a + b) * c * 10]);
  }
  if (form === 1) {
    const c = r.pick([2, 4, 5, -2, -4, -5]), q = nz(r, 12); // (a − b) ÷ c, en décimos
    const diff = c * q, b = nz(r, 30), a = diff + b;
    return sdecQ(r, "Calcula el valor de la expresión.", q * 10, `Primero el paréntesis: ${sdec(diff * 10)}. Luego la división: ${sdec(q * 10)}.`, `(${sdec(a * 10)} − ${pdec(b * 10)}) ÷ ${pdec(c * 100)}`, "decimal");
  }
  const a = randSF(r), b = randSF(r), k = r.pick([2, 3, 4, 6, -2, -3, -4]);
  const value = sfmul(sfadd(a, b), [k, 1]);
  return sfQ(r, "Calcula el valor de la expresión. Da el resultado simplificado.", value, `Primero el paréntesis: ${sfshow(sfadd(a, b))}. Luego se multiplica por ${sg(k)}: ${sfshow(value)}.`, `(${sfshow(a)} + ${psf(b)}) × ${par(k)}`, "fraccion");
}

// Ecuaciones con el exponente como incógnita.
export function variableExponent(r: Rng): Question {
  const base = r.pick([2, 2, 3, 4, 5, 10]);
  const e = r.int(2, base === 2 ? 9 : base === 3 ? 5 : base === 10 ? 6 : 4);
  return numQ(e, "¿Cuánto vale x?", `${base}ˣ = ${fmt(base ** e)}`, `${base} multiplicado ${e} veces por sí mismo da ${fmt(base ** e)}: ${pw(String(base), e)}.`, `base-${base}`);
}

// Potencias con bases negativas.
export function negativeBasePower(r: Rng): Question {
  const a = r.int(2, 6), e = r.int(2, a <= 3 ? 5 : 3);
  const inside = r.chance(0.6);
  const value = inside ? (-a) ** e : -(a ** e);
  return intQ(r, "Calcula.", value, inside ? `La base es −${a}: se multiplica ${e} veces. Con exponente ${e % 2 === 0 ? "par el resultado es positivo" : "impar el resultado es negativo"}: ${sg(value)}.` : `Sin paréntesis, el exponente solo afecta al ${a}: −(${a ** e}) = ${sg(value)}.`, inside ? `(−${a})${pw("", e)} = ?` : `−${pw(String(a), e)} = ?`, inside ? "con-parentesis" : "sin-parentesis");
}

type ExpRule = "product" | "quotient" | "power";
// Propiedades de las potencias.
export function exponentRule(r: Rng, rule: ExpRule): Question {
  const a = r.int(2, 9);
  const m = r.int(2, 9), n = r.int(2, 6);
  if (rule === "product") {
    const good = pw(String(a), m + n);
    return choiceQ(r, "Escribe como una sola potencia.", good, [pw(String(a), m * n), pw(String(a * a), m + n), pw(String(a * 2), m + n), pw(String(a), Math.abs(m - n) || 1)].filter((x) => x !== good), `Al multiplicar potencias de la misma base se suman los exponentes: ${m} + ${n} = ${m + n}.`, `${pw(String(a), m)} × ${pw(String(a), n)}`, "producto");
  }
  if (rule === "quotient") {
    const big = m + n + 1;
    const good = pw(String(a), big - n);
    return choiceQ(r, "Escribe como una sola potencia.", good, [pw(String(a), big + n), pw("1", big - n), pw(String(a), big * n), pw(String(a), n)].filter((x) => x !== good), `Al dividir potencias de la misma base se restan los exponentes: ${big} − ${n} = ${big - n}.`, `${pw(String(a), big)} ÷ ${pw(String(a), n)}`, "cociente");
  }
  const good = pw(String(a), m * n);
  return choiceQ(r, "Escribe como una sola potencia.", good, [pw(String(a), m + n), pw(String(a * n), m), pw(String(a), m ** 2), pw(String(a), m * n + 1)].filter((x) => x !== good), `Potencia de una potencia: se multiplican los exponentes: ${m} × ${n} = ${m * n}.`, `(${pw(String(a), m)})${pw("", n)}`, "potencia");
}

// Evaluar expresiones usando las propiedades de las potencias.
export function exponentProperties(r: Rng): Question {
  const a = r.pick([2, 3, 5, 10]);
  const final = r.int(1, a === 2 ? 5 : a === 10 ? 4 : 3);
  if (r.chance(0.5)) {
    const m = r.int(2, 6), n = r.int(2, 6), k = m + n - final;
    return numQ(a ** final, "Usa las propiedades de las potencias y calcula.", `${pw(String(a), m)} × ${pw(String(a), n)} ÷ ${pw(String(a), k)}`, `${m} + ${n} − ${par(k)} = ${final}: ${pw(String(a), final)} = ${fmt(a ** final)}.`, "producto-cociente");
  }
  const m = r.int(2, 4), n = r.int(2, 3), k = m * n - final;
  return numQ(a ** final, "Usa las propiedades de las potencias y calcula.", `(${pw(String(a), m)})${pw("", n)} ÷ ${pw(String(a), k)}`, `${m} × ${n} − ${par(k)} = ${final}: ${pw(String(a), final)} = ${fmt(a ** final)}.`, "potencia-cociente");
}

const SUPM = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const supS = (e: number) => (e < 0 ? "⁻" : "") + [...String(Math.abs(e))].map((c) => SUPM[Number(c)]).join("");
// Mantisa en décimos (10 a 99) y exponente → textos.
const sciText = (m: number, e: number) => `${m % 10 === 0 ? m / 10 : `${Math.floor(m / 10)},${m % 10}`} × 10${supS(e)}`;
function standardText(m: number, e: number) {
  const digits = String(m).replace(/0+$/, ""); // "32" o "3"
  if (e >= 0) {
    const zeros = e - (digits.length - 1);
    return zeros >= 0 ? fmt(Number(digits + "0".repeat(zeros))) : `${digits[0]},${digits.slice(1)}`;
  }
  return `0,${"0".repeat(-e - 1)}${digits}`;
}

// Notación científica.
export function scientificNotation(r: Rng): Question {
  const m = r.int(10, 99), e = r.pick([2, 3, 4, 5, 6, 7, -2, -3, -4, -5]);
  const sci = sciText(m, e), std = standardText(m, e);
  if (r.chance(0.5)) return choiceQ(r, "Escribe el número en forma estándar.", std, [standardText(m, e + 1), standardText(m, e - 1), standardText(m, e > 0 ? e + 2 : e - 2)].filter((x) => x !== std), `El exponente ${sg(e)} indica que la coma se mueve ${Math.abs(e)} lugares hacia la ${e > 0 ? "derecha" : "izquierda"}.`, sci, e > 0 ? "grande" : "pequeno");
  return choiceQ(r, "Escribe el número en notación científica.", sci, [sciText(m, e + 1), sciText(m, e - 1), sciText(m, -e)].filter((x) => x !== sci), `La coma debe quedar después de la primera cifra distinta de cero; se movió ${Math.abs(e)} lugares: exponente ${sg(e)}.`, std, e > 0 ? "grande" : "pequeno");
}

// Comparar números en notación científica.
export function compareScientific(r: Rng): Question {
  const e1 = r.int(-5, 8);
  const e2 = r.chance(0.4) ? e1 : e1 + r.pick([-2, -1, 1, 2]);
  const m1 = r.int(10, 99);
  const m2 = e1 === e2 && r.chance(0.2) ? m1 : r.int(10, 99);
  const v = (m: number, e: number) => m * 10 ** (e + 6);
  return symbolQ(v(m1, e1), v(m2, e2), sciText(m1, e1), sciText(m2, e2), e1 !== e2 ? `Primero se comparan los exponentes: ${sg(e1)} ${e1 < e2 ? "<" : ">"} ${sg(e2)}.` : `Los exponentes son iguales: se comparan ${sciText(m1, 0).split(" ")[0]} y ${sciText(m2, 0).split(" ")[0]}.`);
}

// Raíces cuadradas de cuadrados perfectos.
export function perfectSquareRoot(r: Rng): Question {
  const k = r.int(1, 20);
  return r.chance(0.7) ? numQ(k, "Calcula la raíz cuadrada.", `√${k * k} = ?`, `${k} × ${k} = ${k * k}, así que √${k * k} = ${k}.`) : numQ(k, `¿Qué número positivo elevado al cuadrado da ${k * k}?`, undefined, `${k}² = ${k * k}.`);
}

// Estimar raíces cuadradas.
export function estimateSquareRoot(r: Rng): Question {
  const k = r.int(2, 14);
  const n = r.int(k * k + 1, (k + 1) * (k + 1) - 1);
  if (r.chance(0.5)) {
    const good = `${k} y ${k + 1}`;
    return choiceQ(r, `¿Entre qué dos enteros consecutivos está √${n}?`, good, [`${k - 1} y ${k}`, `${k + 1} y ${k + 2}`, `${k + 2} y ${k + 3}`], `${k}² = ${k * k} y ${k + 1}² = ${(k + 1) ** 2}; ${n} está entre los dos.`, undefined, "entre");
  }
  const nearest = n - k * k < (k + 1) ** 2 - n ? k : k + 1;
  return numQ(nearest, `¿Cuál es el entero más cercano a √${n}?`, undefined, `${k}² = ${k * k} y ${k + 1}² = ${(k + 1) ** 2}; ${n} está más cerca de ${nearest * nearest}.`, "cercano");
}

// Tasas unitarias con fracciones.
export function unitRateFractions(r: Rng): Question {
  const den = r.pick([2, 3, 4]);
  const qty: Frac = [r.pick([1, 3, 5, 7].filter((n) => n % den !== 0)), den];
  const time: Frac = [1, r.pick([2, 3, 4, 5, 6])];
  const rate: Frac = [qty[0] * time[1], qty[1]];
  const [what, one, per, verb] = r.pick([["kilómetros", "kilómetro", "hora", "camina"], ["litros", "litro", "minuto", "llena"], ["páginas", "página", "hora", "lee"], ["kilos", "kilo", "día", "come"]]);
  const subject = verb === "llena" ? "Un caño" : verb === "come" ? "Un elefante bebé" : r.pick(NAMES);
  return fracQ(r, `${subject} ${verb} ${qty[0]}/${qty[1]} de ${one} en ${time[0]}/${time[1]} de ${per}. ¿${what === "páginas" ? "Cuántas" : "Cuántos"} ${what} por ${per}?`, rate, `Se divide la cantidad entre el tiempo: ${qty[0]}/${qty[1]} ÷ ${time[0]}/${time[1]} = ${qty[0]}/${qty[1]} × ${time[1]}.`, undefined, "tasa");
}
