import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, type Frac, choiceQ, d3, decQ, distinct, fixedQ, fmt, fracQ, fshow, gcd, lcm, multiQ, numQ } from "./kit";

// Números de 6.° en adelante: potencias con cualquier base, divisores de tres
// cifras, residuos como fracción, m. c. d. y m. c. m. de varios números,
// decimales periódicos y expresiones con exponentes.

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const sup = (e: number) => [...String(e)].map((c) => SUP[Number(c)]).join("");
// 5³, (2/3)², 0,4²
export const pw = (base: string, e: number) => `${base.includes("/") ? `(${base})` : base}${sup(e)}`;

// Dividir entre números de tres cifras.
export function divideBy3Digits(r: Rng): Question {
  const d = r.int(101, 499);
  const q = r.int(2, 98);
  return numQ(q, "Resuelve la división.", `${fmt(d * q)} ÷ ${d} = ?`, `${fmt(d * q)} ÷ ${d} = ${q}, porque ${d} × ${q} = ${fmt(d * q)}.`);
}

// Dividir y escribir el residuo como fracción.
export function divideRemainderFraction(r: Rng): Question {
  const d = r.int(3, 25);
  const q = r.int(2, 40);
  const rem = r.int(1, d - 1);
  const n = d * q + rem;
  const answer: Frac = [n, d];
  return fracQ(r, "Divide. Escribe el residuo como fracción (número mixto en su mínima expresión).", answer, `${n} ÷ ${d} = ${q} y sobran ${rem}; el residuo se escribe sobre el divisor: ${q} ${rem}/${d}${gcd(rem, d) > 1 ? ` = ${fshow(answer)}` : ""}.`, `${n} ÷ ${d} = ?`, undefined, [[q * rem + d, rem], [n + d, d], [q * d + rem, d + 1]]);
}

// Escribir multiplicaciones usando exponentes.
export function writeWithExponents(r: Rng): Question {
  const base = r.int(2, 12);
  const e = r.int(2, 6);
  const expanded = Array.from({ length: e }, () => base).join(" × ");
  if (r.chance(0.3)) return numQ(e, "¿Qué exponente falta?", `${expanded} = ${base} elevado a ?`, `El ${base} se multiplica ${e} veces: ${pw(String(base), e)}.`, "exponente");
  return choiceQ(r, `Escribe ${expanded} usando un exponente.`, pw(String(base), e), [pw(String(e), base), pw(String(base), e + 1), pw(String(base), e - 1), `${base} × ${e}`, pw(String(base * e), 1)].filter((x) => x !== pw(String(base), e)), `La base es ${base} y se repite ${e} veces: ${pw(String(base), e)}.`, undefined, "escribir");
}

const smallPower = (r: Rng): [number, number] => {
  const base = r.int(2, 12);
  const maxE = base <= 3 ? 6 : base <= 5 ? 4 : base <= 10 ? 3 : 2;
  return [base, r.int(2, maxE)];
};

// Calcular potencias de base natural.
export function evaluatePower(r: Rng): Question {
  const [base, e] = smallPower(r);
  if (r.chance(0.15)) {
    const special = r.pick<[string, number, string]>([[pw(String(base), 1), base, "Cualquier número elevado a 1 es el mismo número."], [pw(String(base), 0), 1, "Cualquier número (distinto de 0) elevado a 0 es 1."], [pw("1", e + 3), 1, "1 multiplicado por sí mismo siempre da 1."]]);
    return numQ(special[1], "Calcula la potencia.", `${special[0]} = ?`, special[2], "casos-especiales");
  }
  return numQ(base ** e, "Calcula la potencia.", `${pw(String(base), e)} = ?`, `${Array.from({ length: e }, () => base).join(" × ")} = ${fmt(base ** e)} (no es ${base} × ${e}).`, `exp-${e}`);
}

// Hallar el exponente o la base que falta.
export function missingExponentOrBase(r: Rng): Question {
  const [base, e] = smallPower(r);
  return r.chance(0.5)
    ? numQ(e, "¿Qué exponente falta?", `${base} elevado a ? = ${fmt(base ** e)}`, `${Array.from({ length: e }, () => base).join(" × ")} = ${fmt(base ** e)}: el exponente es ${e}.`, "exponente")
    : numQ(base, "¿Qué base falta?", `? elevado a ${e} = ${fmt(base ** e)}`, `${pw(String(base), e)} = ${fmt(base ** e)}: la base es ${base}.`, "base");
}

// Potencias de base decimal.
export function powerOfDecimal(r: Rng): Question {
  const tenths = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]);
  const e = tenths <= 5 ? r.int(2, 3) : 2;
  const value = (tenths ** e * 1000) / 10 ** e;
  const base = d3(tenths * 100);
  return decQ(r, "Calcula la potencia.", value, `${Array.from({ length: e }, () => base).join(" × ")} = ${d3(value)}: el resultado tiene ${e} cifras decimales.`, `${pw(base, e)} = ?`, `exp-${e}`, [tenths * e * 100, value * 10, value * 100, tenths ** e * 100].filter(Number.isInteger));
}

// Potencias de base fraccionaria.
export function fractionPower(r: Rng): Question {
  for (;;) {
    const d = r.int(2, 6);
    const n = r.int(1, d - 1);
    if (gcd(n, d) !== 1) continue;
    const e = d <= 3 ? r.int(2, 4) : r.int(2, 3);
    const answer: Frac = [n ** e, d ** e];
    return fracQ(r, "Calcula la potencia.", answer, `Se eleva el numerador y el denominador: ${n}${sup(e)} = ${n ** e} y ${d}${sup(e)} = ${d ** e}.`, `${pw(`${n}/${d}`, e)} = ?`, `exp-${e}`, [[n * e, d * e], [n ** e, d], [n, d ** e], [n * e, d ** e]]);
  }
}

// Potencias con bases naturales, decimales y fraccionarias.
export function mixedPowers(r: Rng): Question {
  return r.pick([evaluatePower, powerOfDecimal, fractionPower])(r);
}

// Expresiones numéricas con exponentes.
export function exponentExpression(r: Rng): Question {
  const b = r.int(2, 5);
  const e = r.int(2, 3);
  const p = b ** e;
  const a = r.int(2, 9);
  const c = r.int(2, 9);
  const forms: [string, number, string][] = [
    [`${a} + ${pw(String(b), e)} × ${c}`, a + p * c, `${pw(String(b), e)} = ${p}; ${p} × ${c} = ${p * c}; ${a} + ${p * c}`],
    [`(${a} + ${c})${sup(2)} − ${a}`, (a + c) ** 2 - a, `${a} + ${c} = ${a + c}; ${a + c}${sup(2)} = ${(a + c) ** 2}; ${(a + c) ** 2} − ${a}`],
    [`${c} × ${pw(String(b), e)} − ${p}`, c * p - p, `${pw(String(b), e)} = ${p}; ${c} × ${p} = ${c * p}; ${c * p} − ${p}`],
    [`${pw(String(b), e)} + ${pw(String(a), 2)}`, p + a * a, `${pw(String(b), e)} = ${p}; ${pw(String(a), 2)} = ${a * a}; ${p} + ${a * a}`],
    [`${p * c} ÷ ${pw(String(b), e)} + ${a}`, c + a, `${pw(String(b), e)} = ${p}; ${p * c} ÷ ${p} = ${c}; ${c} + ${a}`],
  ];
  const [text, value, steps] = r.pick(forms);
  return numQ(value, "Calcula. Orden: paréntesis, potencias, multiplicaciones y divisiones, sumas y restas.", `${text} = ?`, `${steps} = ${fmt(value)}.`);
}

function primeFactors(n: number) {
  const out: number[] = [];
  for (let p = 2; n > 1; p++) while (n % p === 0) {
    out.push(p);
    n /= p;
  }
  return out;
}
const withExponents = (fs: number[]) => [...new Set(fs)].map((p) => (fs.filter((x) => x === p).length > 1 ? pw(String(p), fs.filter((x) => x === p).length) : String(p))).join(" × ");

// Descomposición en factores primos con exponentes.
export function primeFactorizationExponents(r: Rng): Question {
  for (;;) {
    const n = r.int(12, 360);
    const fs = primeFactors(n);
    if (fs.length < 3 || fs.length > 6 || new Set(fs).size === fs.length || fs[fs.length - 1] > 13) continue;
    const answer = withExponents(fs);
    const bump = [...fs];
    bump.push(fs[0]);
    const drop = fs.slice(1);
    const swapped = fs.map((p, i) => (i === fs.length - 1 ? (p === 2 ? 3 : 2) : p)).sort((a, b) => a - b);
    const wrong = [withExponents(bump), withExponents(drop), withExponents(swapped), [...new Set(fs)].join(" × ")].filter((w) => w !== answer);
    return choiceQ(r, `¿Cuál es la descomposición en factores primos de ${n}, escrita con exponentes?`, answer, wrong, `${n} = ${fs.join(" × ")} = ${answer}.`);
  }
}

// Máximo común divisor de dos, tres o cuatro números.
export function greatestCommonFactor(r: Rng, count: 2 | 3 | 4 = 2): Question {
  for (;;) {
    const g = r.int(2, count === 2 ? 15 : 9);
    const ks = distinct(r, count, 1, count === 2 ? 9 : 7);
    if (ks.length < count || ks.reduce((a, b) => gcd(a, b)) !== 1) continue;
    const nums = ks.map((k) => k * g);
    const list = nums.slice(0, -1).join(", ") + ` y ${nums[nums.length - 1]}`;
    return numQ(g, `¿Cuál es el máximo común divisor (m. c. d.) de ${list}?`, undefined, `${nums.map((n) => `${n} = ${g} × ${n / g}`).join("; ")}. El mayor divisor que comparten es ${g}.`, `${count}-numeros`);
  }
}

// Mínimo común múltiplo de tres o cuatro números.
export function leastCommonMultipleN(r: Rng, count: 3 | 4 = 3): Question {
  for (;;) {
    const nums = distinct(r, count, 2, 12);
    const m = nums.reduce((a, b) => lcm(a, b), 1);
    if (nums.length < count || m > 180) continue;
    const list = nums.slice(0, -1).join(", ") + ` y ${nums[nums.length - 1]}`;
    return numQ(m, `¿Cuál es el mínimo común múltiplo (m. c. m.) de ${list}?`, undefined, `${m} es el menor número que es múltiplo de todos: ${nums.map((n) => `${n} × ${m / n}`).join(", ")}.`, `${count}-numeros`);
  }
}

// Problemas de m. c. d. y m. c. m.
export function gcfLcmProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  if (r.chance(0.5)) {
    for (;;) {
      const [a, b] = distinct(r, 2, 3, 12);
      if (b === undefined || lcm(a, b) > 90) continue;
      const m = lcm(a, b);
      return numQ(m, r.pick([`Un bus pasa cada ${a} minutos y otro cada ${b} minutos. Acaban de pasar juntos. ¿Dentro de cuántos minutos volverán a coincidir?`, `${name} riega una planta cada ${a} días y otra cada ${b} días. Hoy regó las dos. ¿Dentro de cuántos días volverá a regarlas el mismo día?`, `Una luz parpadea cada ${a} segundos y otra cada ${b} segundos. Acaban de encenderse juntas. ¿En cuántos segundos volverán a coincidir?`]), undefined, `Se busca el m. c. m. de ${a} y ${b}: ${m}.`, "mcm");
    }
  }
  for (;;) {
    const g = r.int(2, 12);
    const [x, y] = distinct(r, 2, 2, 9);
    if (y === undefined || gcd(x, y) !== 1) continue;
    return numQ(g, r.pick([`${name} tiene ${g * x} rosas y ${g * y} claveles. Quiere armar la mayor cantidad posible de ramos iguales, usando todas las flores. ¿Cuántos ramos arma?`, `Hay ${g * x} lápices y ${g * y} borradores para repartir en bolsas iguales, sin que sobre nada. ¿Cuál es la mayor cantidad de bolsas que se pueden armar?`, `Dos cintas de ${g * x} cm y ${g * y} cm se cortan en trozos iguales del mayor largo posible, sin que sobre. ¿Cuántos centímetros mide cada trozo?`]), undefined, `Se busca el m. c. d. de ${g * x} y ${g * y}: ${g}.`, "mcd");
  }
}

// Identificar los factores de una expresión numérica.
export function factorsOfExpression(r: Rng): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const expr = `${a} × (${b} + ${c})`;
  const good = [String(a), `(${b} + ${c})`];
  const options = r.shuffle([...good, String(b), String(c), `${a} × ${b}`]);
  return multiQ(`En la expresión ${expr}, ¿cuáles son los factores? Selecciona todos.`, [...new Set(options)], good, `Los factores son lo que se multiplica: ${a} y (${b} + ${c}). ${b} y ${c} son sumandos.`, undefined);
}

const REPEATING: [string, string][] = [["1/3", "0,333…"], ["2/3", "0,666…"], ["1/6", "0,1666…"], ["5/6", "0,8333…"], ["1/9", "0,111…"], ["2/9", "0,222…"], ["4/9", "0,444…"], ["5/9", "0,555…"], ["7/9", "0,777…"], ["8/9", "0,888…"], ["1/11", "0,0909…"], ["2/11", "0,1818…"], ["3/11", "0,2727…"], ["5/11", "0,4545…"], ["1/12", "0,08333…"], ["7/12", "0,58333…"]];

// Convertir entre fracciones y decimales periódicos.
export function repeatingDecimals(r: Rng): Question {
  const [fraction, decimal] = r.pick(REPEATING);
  const others = REPEATING.filter(([f]) => f !== fraction);
  if (r.chance(0.5)) return choiceQ(r, `Escribe ${fraction} como decimal periódico.`, decimal, r.shuffle(others).slice(0, 5).map(([, d]) => d), `Al dividir ${fraction.replace("/", " ÷ ")} las cifras se repiten sin fin: ${decimal}`, undefined, "a-decimal");
  return choiceQ(r, `¿Qué fracción es igual a ${decimal}?`, fraction, r.shuffle(others).slice(0, 5).map(([f]) => f), `${fraction.replace("/", " ÷ ")} = ${decimal}`, undefined, "a-fraccion");
}

// Evaluar expresiones un paso a la vez (¿qué se calcula primero?).
export function firstStep(r: Rng): Question {
  const a = r.int(10, 20);
  const [b, c, d] = distinct(r, 3, 2, 9);
  const forms: [string, string, string[], string][] = [
    [`${a} + ${b} × ${c}`, `${b} × ${c}`, [`${a} + ${b}`, `${a} × ${c}`], "La multiplicación va antes que la suma."],
    [`(${a} + ${b}) × ${c}`, `${a} + ${b}`, [`${b} × ${c}`, `${a} × ${c}`], "Primero lo que está entre paréntesis."],
    [`${a * b} − ${b * c} ÷ ${c}`, `${b * c} ÷ ${c}`, [`${a * b} − ${b * c}`, `${a * b} ÷ ${c}`], "La división va antes que la resta."],
    [`${a} + ${b} − ${c} + ${d}`, `${a} + ${b}`, [`${b} − ${c}`, `${c} + ${d}`], "Sumas y restas se resuelven de izquierda a derecha."],
    [`${d} × [${a} + (${b} − 1)]`, `${b} − 1`, [`${a} + ${b}`, `${d} × ${a}`], "Primero los paréntesis de más adentro."],
    [`${a} × ${b} + ${c} × ${d}`, `${a} × ${b}`, [`${b} + ${c}`, `${a} + ${c}`], "Primero las multiplicaciones, de izquierda a derecha."],
  ];
  const [expr, answer, wrong, why] = r.pick(forms);
  return fixedQ(`Para calcular ${expr}, ¿qué operación se hace primero?`, r.shuffle([answer, ...wrong]), answer, why, expr);
}
