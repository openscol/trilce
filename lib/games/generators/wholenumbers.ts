import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, choiceQ, distinct, fixedQ, fmt, lcm, nDigits, numQ, pow10 } from "./kit";
import { addLarge } from "./bignumbers";
import { areaMult } from "./multstrategies";
import { subMulti } from "./operations";

// Números naturales de 5.° en adelante: números romanos, potencias de diez,
// cálculo con propiedades, divisores de dos cifras, factorización y m. c. m.

const ROMAN: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
export function roman(n: number) {
  let out = "";
  for (const [v, s] of ROMAN) while (n >= v) {
    out += s;
    n -= v;
  }
  return out;
}

// 5.° A.6: números romanos (I, V, X, L, C, D, M).
export function romanNumerals(r: Rng, max = 2000): Question {
  const n = r.chance(0.4) ? r.int(1, 99) : r.chance(0.5) ? r.int(100, 999) : r.int(1000, max);
  if (r.chance(0.5)) return numQ(n, "Escribe el número romano con cifras.", roman(n), `${roman(n)} = ${n}. Si una letra menor va antes de una mayor, se resta (IV = 4, XC = 90).`, "a-cifras");
  const wrong = distinct(r, 6, Math.max(1, n - 60), n + 60, (x) => x !== n).concat([n + 10, n + 100, Math.abs(n - 10) || n + 5]).filter((x) => x !== n && x > 0);
  return choiceQ(r, `¿Cómo se escribe ${n} en números romanos?`, roman(n), wrong.map(roman), `${n} = ${roman(n)}.`, undefined, "a-romanos");
}

// 5.° B.7: sumar usando las propiedades (buscar sumandos que completen decenas o centenas).
export function addUsingProperties(r: Rng): Question {
  const round = r.pick([100, 100, 1000, 50]);
  const a = r.int(1, round - 1);
  const b = round - a;
  const c = r.int(11, 899);
  const order = r.shuffle([a, c, b]);
  const total = a + b + c;
  return numQ(total, "Suma. Agrupa primero los números que forman un número redondo.", `${order.map(fmt).join(" + ")} = ?`, `${fmt(a)} + ${fmt(b)} = ${fmt(round)}; ${fmt(round)} + ${fmt(c)} = ${fmt(total)}. Las propiedades conmutativa y asociativa permiten cambiar el orden y agrupar.`);
}

// 5.° D.16: multiplicar usando las propiedades.
export function multUsingProperties(r: Rng): Question {
  const [a, b] = r.pick([[2, 5], [4, 25], [5, 20], [2, 50], [4, 5], [8, 125], [5, 4], [25, 8]]);
  const c = r.int(3, 49);
  if (r.chance(0.3)) {
    // Distributiva: 6 × 98 = 6 × 100 − 6 × 2.
    const k = r.int(3, 9);
    const near = r.pick([99, 98, 101, 102, 49, 51, 199, 201]);
    const base = Math.round(near / 50) * 50;
    return numQ(k * near, "Multiplica. Usa la propiedad distributiva con un número redondo.", `${k} × ${near} = ?`, `${k} × ${near} = ${k} × ${base} ${near > base ? "+" : "−"} ${k} × ${Math.abs(near - base)} = ${k * base} ${near > base ? "+" : "−"} ${k * Math.abs(near - base)} = ${k * near}.`, "distributiva");
  }
  const order = r.shuffle([a, c, b]);
  return numQ(a * b * c, "Multiplica. Agrupa primero los factores que dan un número redondo.", `${order.join(" × ")} = ?`, `${a} × ${b} = ${a * b}; ${a * b} × ${c} = ${fmt(a * b * c)}.`, "asociativa");
}

// 5.° C.1: comprender las potencias de diez.
export function understandPowers(r: Rng): Question {
  const e = r.int(2, 6);
  const expanded = Array.from({ length: e }, () => "10").join(" × ");
  const form = r.int(0, 2);
  if (form === 0) return choiceQ(r, `¿Qué significa ${pow10(e)}?`, expanded, [`10 × ${e}`, `10 + ${e}`, Array.from({ length: e + 1 }, () => "10").join(" × "), Array.from({ length: e - 1 }, () => "10").join(" × "), Array.from({ length: e }, () => "10").join(" + ")].filter((x) => x !== expanded && x !== "10"), `El exponente ${e} indica cuántas veces se multiplica el 10: ${expanded}.`, undefined, "significado");
  if (form === 1) return numQ(e, `¿Cuántos ceros tiene ${pow10(e)} cuando se escribe como número?`, pow10(e), `${pow10(e)} = ${fmt(10 ** e)}: tiene ${e} ceros, igual que el exponente.`, "ceros");
  return numQ(e, "¿Qué exponente falta?", `${expanded} = 10 elevado a ?`, `El 10 se multiplica ${e} veces: ${pow10(e)}.`, "exponente");
}

// 5.° C.2: calcular potencias de diez.
export function evaluatePowers(r: Rng): Question {
  const e = r.int(1, 7);
  const form = r.int(0, 2);
  if (form === 1) {
    // Error típico: multiplicar la base por el exponente.
    const good = r.chance(0.5);
    const said = good ? 10 ** e : r.pick([10 * e, 10 ** (e + 1), 10 + e].filter((x) => x !== 10 ** e));
    return fixedQ("¿Verdadero o falso?", ["Verdadero", "Falso"], good ? "Verdadero" : "Falso", `${pow10(e)} es un 1 seguido de ${e} ${e === 1 ? "cero" : "ceros"}: ${fmt(10 ** e)} (no es 10 × ${e}).`, `${pow10(e)} = ${fmt(said)}`, "verdadero-falso");
  }
  if (form === 2) return choiceQ(r, `¿Cuánto es ${pow10(e)}?`, fmt(10 ** e), [10 * e, 10 ** (e + 1), e > 1 ? 10 ** (e - 1) : 1, 10 + e].filter((x) => x !== 10 ** e).map(fmt), `${pow10(e)} es un 1 seguido de ${e} ${e === 1 ? "cero" : "ceros"}: ${fmt(10 ** e)}.`, undefined, `exp-${e}`);
  return numQ(10 ** e, "Calcula la potencia de diez.", `${pow10(e)} = ?`, `${pow10(e)} es un 1 seguido de ${e} ${e === 1 ? "cero" : "ceros"}: ${fmt(10 ** e)}.`, `exp-${e}`);
}

// 5.° C.3: escribir potencias de diez con exponentes.
export function writePowers(r: Rng): Question {
  const e = r.int(1, 8);
  if (r.chance(0.4)) return numQ(e, "¿Qué exponente falta?", `${fmt(10 ** e)} = 10 elevado a ?`, `${fmt(10 ** e)} tiene ${e} ${e === 1 ? "cero" : "ceros"}: el exponente es ${e}.`, `exp-${e}`);
  return choiceQ(r, `Escribe ${fmt(10 ** e)} como potencia de diez.`, pow10(e), [pow10(e + 1), pow10(Math.max(1, e - 1) === e ? e + 2 : Math.max(1, e - 1)), pow10(e + 2), `${e}¹⁰`].filter((x) => x !== pow10(e)), `${fmt(10 ** e)} tiene ${e} ${e === 1 ? "cero" : "ceros"}: es ${pow10(e)}.`, undefined, `exp-${e}`);
}

// 5.° D.4: multiplicar un número natural por una potencia de diez.
export function multByPower(r: Rng): Question {
  const e = r.int(1, 5);
  const n = r.int(2, r.pick([9, 99, 999]));
  if (r.chance(0.25)) return numQ(e, "¿Qué exponente falta?", `${fmt(n)} × 10 elevado a ? = ${fmt(n * 10 ** e)}`, `Se agregaron ${e} ${e === 1 ? "cero" : "ceros"}: el exponente es ${e}.`, "exponente");
  return numQ(n * 10 ** e, "Resuelve la multiplicación.", `${fmt(n)} × ${pow10(e)} = ?`, `${pow10(e)} = ${fmt(10 ** e)}; agregamos ${e} ${e === 1 ? "cero" : "ceros"}: ${fmt(n * 10 ** e)}.`, `exp-${e}`);
}

// 5.° E.2: dividir números que terminan en ceros (también con divisores que terminan en ceros).
export function divZeros2(r: Rng): Question {
  const d = r.int(2, 9);
  const q = r.int(2, 9);
  const zd = r.int(0, 2);
  const zq = r.int(zd === 0 ? 1 : 0, 3);
  const divisor = d * 10 ** zd;
  const quotient = q * 10 ** zq;
  return numQ(quotient, "Resuelve la división.", `${fmt(divisor * quotient)} ÷ ${fmt(divisor)} = ?`, `${d * q} ÷ ${d} = ${q}. ${zd ? "Quitamos los mismos ceros del dividendo y del divisor. " : ""}${zq ? `Al cociente le quedan ${zq} ${zq === 1 ? "cero" : "ceros"}: ` : "El cociente es "}${fmt(quotient)}.`, `${zd}-${zq}`);
}

// Divisor de dos cifras y cociente, con dividendo de `digits` cifras (si se puede).
function twoDigitDivision(r: Rng, minDigits: number, maxDigits: number) {
  for (;;) {
    const d = r.int(11, 89);
    const dividendDigits = r.int(minDigits, maxDigits);
    const lo = Math.ceil(10 ** (dividendDigits - 1) / d);
    const hi = Math.floor((10 ** dividendDigits - 1) / d);
    if (hi < lo || hi < 2) continue;
    const q = r.int(Math.max(2, lo), hi);
    return { d, q };
  }
}

// 5.° E.4: estimar cocientes con divisores de dos cifras (números compatibles).
export function estimateQuotient2(r: Rng): Question {
  const dTens = r.int(2, 9);
  const qLead = r.int(2, 9);
  const q = qLead * r.pick([1, 10, 10]);
  const d = dTens * 10 + r.pick([-2, -1, 1, 2]);
  const dividend = dTens * 10 * q + r.int(-dTens, dTens) * (q >= 10 ? 3 : 1);
  return choiceQ(r, `Estima ${fmt(dividend)} ÷ ${d} con números compatibles.`, fmt(q), [q + (q >= 10 ? 10 : 1), q - (q >= 10 ? 10 : 1) || q + 2, q * 10, q >= 10 ? q / 10 : q + 3].map(fmt), `${d} ≈ ${dTens * 10} y ${fmt(dividend)} ≈ ${fmt(dTens * 10 * q)}; ${fmt(dTens * 10 * q)} ÷ ${dTens * 10} = ${fmt(q)}.`, `${fmt(dividend)} ÷ ${d} ≈ ?`);
}

// 5.° E.9 / E.16: probar un cociente y ajustarlo.
export function adjustQuotient(r: Rng, askQuotient: boolean): Question {
  const d = r.int(12, 89);
  const q = r.int(2, 9);
  const rem = r.int(0, d - 1);
  const dividend = d * q + rem;
  const trial = r.chance(0.34) ? q : r.chance(0.5) ? q + 1 : q - 1;
  const product = d * trial;
  const text = `${dividend} ÷ ${d}\nPrueba con ${trial}: ${d} × ${trial} = ${product}`;
  const verdict = trial > q ? `${product} es mayor que ${dividend}: el ${trial} es demasiado grande` : trial < q ? `sobran ${dividend - product}, que es ${d} o más: el ${trial} es demasiado pequeño` : `sobran ${dividend - product}, menos que ${d}: el ${trial} es correcto`;
  if (askQuotient) return numQ(q, "Mira la prueba y ajusta. ¿Cuál es la cifra correcta del cociente?", text, `${verdict[0].toUpperCase()}${verdict.slice(1)}. El cociente es ${q} (${d} × ${q} = ${d * q}; residuo ${rem}).`, trial === q ? "correcto" : trial > q ? "bajar" : "subir");
  const options = ["Es demasiado grande", "Es correcto", "Es demasiado pequeño"];
  return fixedQ(`Se probó ${trial} como cociente. ¿Cómo es esa cifra?`, options, options[trial > q ? 0 : trial === q ? 1 : 2], `${verdict[0].toUpperCase()}${verdict.slice(1)}.`, text, trial === q ? "correcto" : trial > q ? "grande" : "pequeno");
}

const parts = (n: number) => [...String(n)].map((d, i, all) => Number(d) * 10 ** (all.length - 1 - i)).filter(Boolean);

// 5.° E.10: dividir entre números de dos cifras usando modelos de área.
export function divAreaModel2(r: Rng): Question {
  for (;;) {
    const { d, q } = twoDigitDivision(r, 3, 4);
    const cs = parts(q);
    if (cs.length < 2) continue;
    const hidden = r.int(0, cs.length);
    const visual: Visual = { kind: "areaModel", side: [String(d)], top: cs.map((c, i) => (i === hidden ? "?" : fmt(c))), cells: [cs.map((c) => fmt(c * d))] };
    const why = `${cs.map((c) => `${fmt(c * d)} ÷ ${d} = ${fmt(c)}`).join("; ")}. Cociente: ${cs.map(fmt).join(" + ")} = ${fmt(q)}.`;
    if (hidden === cs.length) return numQ(q, `Usa el modelo de área para hallar ${fmt(d * q)} ÷ ${d}.`, visual, why, "cociente");
    return numQ(cs[hidden], `El modelo muestra ${fmt(d * q)} ÷ ${d}. ¿Qué número va en lugar de «?»?`, visual, why, "parte");
  }
}

// 5.° E.11: dividir entre números de dos cifras usando cocientes parciales.
export function partialQuotients2(r: Rng): Question {
  for (;;) {
    const { d, q } = twoDigitDivision(r, 3, 4);
    const cs = parts(q);
    if (cs.length < 2) continue;
    const rem = r.chance(0.4) ? r.int(1, d - 1) : 0;
    const dividend = d * q + rem;
    let left = dividend;
    const steps = cs.map((c) => {
      const line = `${d} × ${fmt(c)} = ${fmt(c * d)}   →   quedan ${fmt(left - c * d)}`;
      left -= c * d;
      return line;
    });
    const why = `Sumamos los cocientes parciales: ${cs.map(fmt).join(" + ")} = ${fmt(q)}${rem ? `; sobran ${rem}` : ""}.`;
    if (rem && r.chance(0.35)) return numQ(rem, "Mira los cocientes parciales. ¿Cuál es el residuo?", `${fmt(dividend)} ÷ ${d}\n${steps.join("\n")}`, why, "residuo");
    return numQ(q, "Suma los cocientes parciales. ¿Cuál es el cociente?", `${fmt(dividend)} ÷ ${d}\n${steps.join("\n")}`, why, "cociente");
  }
}

// 5.° E.12 / E.14: dividir entre números de dos cifras (exacta, o con cociente y residuo).
export function divideBy2(r: Rng, minDigits: number, maxDigits: number, exact = false): Question {
  const { d, q } = twoDigitDivision(r, minDigits, maxDigits);
  const rem = exact || r.chance(0.5) ? 0 : r.int(1, d - 1);
  const dividend = d * q + rem;
  if (rem === 0) return numQ(q, "Resuelve la división.", `${fmt(dividend)} ÷ ${d} = ?`, `${fmt(dividend)} ÷ ${d} = ${fmt(q)}, porque ${d} × ${fmt(q)} = ${fmt(dividend)}.`, "exacta");
  const why = `${d} × ${fmt(q)} = ${fmt(d * q)}; ${fmt(dividend)} − ${fmt(d * q)} = ${rem}. Cociente ${fmt(q)}, residuo ${rem}.`;
  return r.chance(0.5) ? numQ(q, `Divide ${fmt(dividend)} ÷ ${d}. ¿Cuál es el cociente?`, `${fmt(dividend)} ÷ ${d}`, why, "cociente") : numQ(rem, `Divide ${fmt(dividend)} ÷ ${d}. ¿Cuál es el residuo?`, `${fmt(dividend)} ÷ ${d}`, why, "residuo");
}

// 5.° E.13 / E.15: problemas de división entre números de dos cifras.
export function divideBy2Problem(r: Rng, minDigits: number, maxDigits: number): Question {
  const { d, q } = twoDigitDivision(r, minDigits, maxDigits);
  const total = fmt(d * q);
  const text = r.pick([
    `Un colegio compra ${total} cuadernos y los reparte por igual entre ${d} salones. ¿Cuántos cuadernos recibe cada salón?`,
    `Una fábrica empaca ${total} botellas en cajas de ${d}. ¿Cuántas cajas llena?`,
    `Un tren recorre ${total} km en ${d} horas, siempre a la misma velocidad. ¿Cuántos kilómetros recorre en una hora?`,
    `Una empresa paga ${total} soles en partes iguales a ${d} trabajadores. ¿Cuántos soles recibe cada uno?`,
    `En un estadio hay ${total} asientos repartidos por igual en ${d} tribunas. ¿Cuántos asientos tiene cada tribuna?`,
    `${r.pick(NAMES)} ahorró ${total} soles en ${d} meses, la misma cantidad cada mes. ¿Cuántos soles ahorró por mes?`,
  ]);
  return numQ(q, text, undefined, `${total} ÷ ${d} = ${fmt(q)}.`);
}

// 5.° E.17: relacionar la multiplicación y la división.
export function relateMultDivBig(r: Rng): Question {
  const a = r.int(12, 60);
  const b = r.int(12, 60);
  const p = a * b;
  const forms: [string, number][] = [[`${fmt(p)} ÷ ${a} = ?`, b], [`${fmt(p)} ÷ ${b} = ?`, a], [`? × ${b} = ${fmt(p)}`, a], [`${fmt(p)} ÷ ? = ${a}`, b]];
  const [text, answer] = r.pick(forms);
  return numQ(answer, "Usa la multiplicación para completar.", `${a} × ${b} = ${fmt(p)}\n${text}`, `La división es la operación inversa: ${fmt(p)} ÷ ${a} = ${b} y ${fmt(p)} ÷ ${b} = ${a}.`);
}

// 5.° E.18: completar la división (divisores de dos cifras).
export function completeDivision2(r: Rng): Question {
  const { d, q } = twoDigitDivision(r, 3, 4);
  const form = r.int(0, 2);
  if (form === 0) return numQ(d * q, "¿Qué número falta?", `? ÷ ${d} = ${fmt(q)}`, `${fmt(q)} × ${d} = ${fmt(d * q)}.`, "dividendo");
  if (form === 1) return numQ(d, "¿Qué número falta?", `${fmt(d * q)} ÷ ? = ${fmt(q)}`, `${fmt(d * q)} ÷ ${fmt(q)} = ${d}.`, "divisor");
  return numQ(q, "¿Qué número falta?", `${fmt(d * q)} ÷ ${d} = ?`, `${d} × ${fmt(q)} = ${fmt(d * q)}.`, "cociente");
}

function primeFactors(n: number) {
  const out: number[] = [];
  for (let p = 2; n > 1; p++) while (n % p === 0) {
    out.push(p);
    n /= p;
  }
  return out;
}

// 5.° F.4: descomposición en factores primos.
export function primeFactorization(r: Rng, max = 120): Question {
  for (;;) {
    const n = r.int(12, max);
    const fs = primeFactors(n);
    if (fs.length < 2 || fs.length > 5) continue;
    const answer = fs.join(" × ");
    if (r.chance(0.3)) {
      const candidates = [2, 3, 5, 7, 11, 13].filter((p) => !fs.includes(p));
      const yes = r.chance(0.5);
      const p = yes ? r.pick(fs) : r.pick(candidates);
      return fixedQ(`¿${p} es un factor primo de ${n}?`, ["Sí", "No"], yes ? "Sí" : "No", `${n} = ${answer}.`, undefined, "es-factor-primo");
    }
    // Opciones con el mismo producto pero con algún factor compuesto, o con otro producto.
    const wrong = new Set<string>();
    if (fs.length >= 2) wrong.add([fs[0] * fs[1], ...fs.slice(2)].sort((a, b) => a - b).join(" × "));
    if (fs.length >= 3) wrong.add([...fs.slice(0, -2), fs[fs.length - 2] * fs[fs.length - 1]].join(" × "));
    wrong.add([...fs.slice(0, -1), fs[fs.length - 1] + (fs[fs.length - 1] === 2 ? 1 : 2)].join(" × "));
    wrong.add([2, ...fs].join(" × "));
    wrong.add(`1 × ${n}`);
    return choiceQ(r, `¿Cuál es la descomposición en factores primos de ${n}?`, answer, [...wrong].filter((w) => w !== answer && w.includes("×")), `${n} = ${answer}, y todos esos factores son primos.`, undefined, `${fs.length}-factores`);
  }
}

// 5.° F.8: mínimo común múltiplo.
export function leastCommonMultiple(r: Rng, max = 12): Question {
  for (;;) {
    const [a, b] = distinct(r, 2, 2, max);
    if (b === undefined || lcm(a, b) > 120) continue;
    const m = lcm(a, b);
    const list = (x: number) => Array.from({ length: Math.min(8, m / x + 1) }, (_, i) => x * (i + 1)).join(", ");
    return numQ(m, `¿Cuál es el mínimo común múltiplo (m. c. m.) de ${a} y ${b}?`, undefined, `Múltiplos de ${a}: ${list(a)}... Múltiplos de ${b}: ${list(b)}... El primero que se repite es ${m}.`, m === a * b ? "producto" : "menor-que-producto");
  }
}

// 5.° G.1: sumar, restar, multiplicar y dividir números naturales.
export function mixedFourBig(r: Rng): Question {
  return r.pick([() => addLarge(r, 5, 6), () => subMulti(r, 5, 6), () => areaMult(r, 2, 2, 3, "plain"), () => divideBy2(r, 3, 4, true)])();
}

// 5.° D.18: comparar productos de números naturales (sin calcular todo).
export function compareProducts(r: Rng): Question {
  const a = nDigits(r, 2);
  const b = nDigits(r, 2);
  const form = r.int(0, 2);
  const [l, lv, rt, rv, why]: [string, number, string, number, string] =
    form === 0
      ? [`${a} × ${b}`, a * b, `${a} × ${b + 1}`, a * (b + 1), `El primer factor es igual; como ${b} < ${b + 1}, el primer producto es menor.`]
      : form === 1
        ? [`${a} × ${b}`, a * b, `${b} × ${a}`, a * b, "Cambiar el orden de los factores no cambia el producto."]
        : [`${a + 1} × ${b}`, (a + 1) * b, `${a} × ${b}`, a * b, `El segundo factor es igual; como ${a + 1} > ${a}, el primer producto es mayor.`];
  const flip = r.chance(0.5);
  const [x, xv, y, yv] = flip ? [rt, rv, l, lv] : [l, lv, rt, rv];
  return fixedQ("Compara sin calcular todo. Elige el símbolo correcto.", ["<", "=", ">"], xv < yv ? "<" : xv > yv ? ">" : "=", flip && form !== 1 ? `${x} = ${fmt(xv)} y ${y} = ${fmt(yv)}.` : why, `${x}  ?  ${y}`);
}
