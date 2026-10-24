import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, intQ, numQ, orderQ, par, pct, sg, symbolQ, yesNo } from "../kit";
import { sdec, sdecQ } from "../sec1/util";
import { cbrtText, dec, pw, sciText, sqrtText } from "./util";

// Números de 2.° de secundaria: decimales periódicos, potencias con exponente
// negativo, notación científica, raíces cuadradas y cúbicas, e irracionales.

// ---------------------------------------------------------------------------
// Racionales

// Fracciones con decimal periódico: [numerador, denominador, decimal, periodo, parte no periódica].
const REPEATING: [number, number, string][] = [
  [1, 3, "0,333…"], [2, 3, "0,666…"], [1, 9, "0,111…"], [4, 9, "0,444…"], [7, 9, "0,777…"], [8, 9, "0,888…"],
  [1, 11, "0,0909…"], [2, 11, "0,1818…"], [5, 11, "0,4545…"], [13, 99, "0,1313…"], [25, 99, "0,2525…"], [4, 3, "1,333…"],
  [5, 3, "1,666…"], [1, 6, "0,1666…"], [5, 6, "0,8333…"], [1, 15, "0,0666…"], [7, 12, "0,58333…"], [2, 33, "0,0606…"],
];

// Convertir entre decimales periódicos y fracciones.
export function repeatingDecimal(r: Rng): Question {
  const [n, d, text] = r.pick(REPEATING);
  const others = REPEATING.filter(([a, b]) => a * d !== n * b);
  const pick3 = <T,>(list: T[]) => r.shuffle(list).slice(0, 3);
  if (r.chance(0.5)) {
    return choiceQ(r, `¿Qué decimal es igual a ${n}/${d}?`, text, pick3(others.map((o) => o[2])), `Se divide ${n} entre ${d}: la división no termina y las cifras se repiten, ${text}`, undefined, "a-decimal");
  }
  const why = `Se comprueba dividiendo: ${n} ÷ ${d} = ${text} (las cifras se repiten sin fin).`;
  return choiceQ(r, `¿Qué fracción es igual a ${text}?`, `${n}/${d}`, pick3(others.map((o) => `${o[0]}/${o[1]}`)), why, undefined, "a-fraccion");
}

// Problemas con números racionales (decimales con signo).
export function rationalWord(r: Rng, kind: "addsub" | "multdiv"): Question {
  const name = r.pick(NAMES);
  if (kind === "addsub") {
    const a = r.int(-80, 40) * 10 + r.int(0, 9), b = r.int(15, 95);
    const form = r.int(0, 2);
    if (form === 0) return sdecQ(r, `En Puno, a las 6 a. m. la temperatura era ${sdec(a)} °C. Hasta el mediodía subió ${sdec(b * 10)} °C. ¿Qué temperatura hacía al mediodía, en °C?`, a + b * 10, `${sdec(a)} + ${sdec(b * 10)} = ${sdec(a + b * 10)}.`, undefined, "temperatura");
    if (form === 1) return sdecQ(r, `${name} tenía ${sdec(Math.abs(a) * 10)} soles en su cuenta y pagó una deuda de ${sdec(b * 100)} soles. ¿Cuál es su saldo ahora, en soles?`, Math.abs(a) * 10 - b * 100, `${sdec(Math.abs(a) * 10)} − ${sdec(b * 100)} = ${sdec(Math.abs(a) * 10 - b * 100)}.`, undefined, "saldo");
    return sdecQ(r, `Un buzo estaba a ${sdec(a < 0 ? a : -a - 100)} m de profundidad y descendió ${sdec(b)} m más. ¿A qué altura está ahora, en metros?`, (a < 0 ? a : -a - 100) - b, `${sdec(a < 0 ? a : -a - 100)} − ${sdec(b)} = ${sdec((a < 0 ? a : -a - 100) - b)}.`, undefined, "profundidad");
  }
  const rate = r.int(12, 85), t = r.int(2, 8);
  if (r.chance(0.5)) return sdecQ(r, `Un globo aerostático desciende ${sdec(rate)} m por segundo. ¿Cuánto cambia su altura en ${t} segundos, en metros?`, -rate * t, `El cambio es negativo: ${t} × (−${sdec(rate)}) = ${sdec(-rate * t)}.`, undefined, "producto");
  return sdecQ(r, `Una acción perdió ${sdec(rate * t)} soles en ${t} días, la misma cantidad cada día. ¿Cuánto cambió su valor por día, en soles?`, -rate, `(−${sdec(rate * t)}) ÷ ${t} = ${sdec(-rate)}.`, undefined, "cociente");
}

// ---------------------------------------------------------------------------
// Potencias

const powFrac = (b: number, e: number) => (e >= 0 ? String(b ** e) : `1/${b ** -e}`);

// Exponentes negativos y cero.
export function negativeExponent(r: Rng, mode: "understand" | "evaluate" | "zero"): Question {
  const b = r.int(2, 9), e = r.int(2, 4);
  if (mode === "understand") {
    if (r.chance(0.5)) return choiceQ(r, `¿Qué expresión es igual a ${pw(String(b), -e)}?`, `1/${pw(String(b), e)}`, [`−${pw(String(b), e)}`, `${pw(String(b), e)}`, `−${b * e}`], `Un exponente negativo indica el inverso: ${pw(String(b), -e)} = 1/${pw(String(b), e)}.`, undefined, "inverso");
    return choiceQ(r, `¿Cómo se escribe 1/${pw(String(b), e)} con un exponente negativo?`, pw(String(b), -e), [pw(`−${b}`, e), pw(String(b), e), pw(`1/${b}`, -e)], `1/${pw(String(b), e)} = ${pw(String(b), -e)}.`, undefined, "escribir");
  }
  const small = r.int(2, 5), se = r.int(1, small <= 3 ? 4 : 2);
  if (mode === "evaluate") {
    const form = r.int(0, 2);
    if (form === 0) return choiceQ(r, `¿Cuánto vale ${pw(String(small), -se)}?`, powFrac(small, -se), [`−${small ** se}`, `−1/${small ** se}`, `1/${small * se}`, String(small ** se)].filter((x) => x !== powFrac(small, -se)), se === 1 ? `${pw(String(small), -1)} = 1/${small}.` : `${pw(String(small), -se)} = 1/${pw(String(small), se)} = 1/${small ** se}.`, undefined, "base-entera");
    if (form === 1) return choiceQ(r, `¿Cuánto vale ${pw(`(1/${small})`, -se)}?`, String(small ** se), [`1/${small ** se}`, `−${small ** se}`, String(small * se)].filter((x) => x !== String(small ** se)), `El inverso de 1/${small} es ${small}: ${pw(`(1/${small})`, -se)} = ${pw(String(small), se)} = ${small ** se}.`, undefined, "base-fraccion");
    const ee = r.pick([2, 3]);
    const val = ee % 2 === 0 ? `1/${small ** ee}` : `−1/${small ** ee}`;
    return choiceQ(r, `¿Cuánto vale ${pw(`−${small}`, -ee)}?`, val, [ee % 2 === 0 ? `−1/${small ** ee}` : `1/${small ** ee}`, `${ee % 2 === 0 ? "" : "−"}${small ** ee}`, `1/${small * ee}`], `${pw(`−${small}`, -ee)} = 1/${pw(`−${small}`, ee)} = ${val}.`, undefined, "base-negativa");
  }
  const form = r.int(0, 3);
  if (form === 0) return numQ(1, `¿Cuánto vale ${pw(String(r.int(2, 99)), 0)}?`, undefined, "Toda base distinta de cero elevada a 0 vale 1.", "cero");
  if (form === 1) return intQ(r, `¿Cuánto vale −${pw(String(b), 0)}?`, -1, `Sin paréntesis, el exponente solo afecta al ${b}: −(${pw(String(b), 0)}) = −1.`, undefined, "cero-signo", [1, 0, -b]);
  if (form === 2) return intQ(r, `¿Cuánto vale ${pw(`−${b}`, 0)}?`, 1, `Con paréntesis, la base es −${b}: ${pw(`−${b}`, 0)} = 1.`, undefined, "cero-parentesis", [-1, 0, -b]);
  return choiceQ(r, `¿Cuánto vale ${pw(String(small), -se)} × ${pw(String(small), 0)}?`, powFrac(small, -se), [String(small ** se), "0", `−${small ** se}`].filter((x) => x !== powFrac(small, -se)), `${pw(String(small), 0)} = 1, así que queda ${pw(String(small), -se)} = ${powFrac(small, -se)}.`, undefined, "mixto");
}

// Propiedades de las potencias con bases enteras (también exponentes negativos).
export function intPowerRule(r: Rng, rule: "product" | "quotient" | "both" | "power"): Question {
  const b = String(r.int(2, 9));
  const ex = () => r.int(-6, 8) || 3;
  const opts = (good: number, bad: number[]) => choiceQ(r, "Escribe como una sola potencia.", pw(b, good), [...new Set(bad.filter((x) => x !== good))].slice(0, 3).map((x) => pw(b, x)), "", undefined);
  const m = ex(), n = ex();
  if (rule === "product") {
    const q = opts(m + n, [m * n, m - n, n - m, m + n + 1]);
    return { ...q, visual: { kind: "text", text: `${pw(b, m)} × ${pw(b, n)}` }, explanation: `Misma base: se suman los exponentes, ${sg(m)} + ${par(n)} = ${sg(m + n)}.`, tag: "producto" };
  }
  if (rule === "quotient") {
    const q = opts(m - n, [m + n, n - m, m * n, m - n - 1]);
    return { ...q, visual: { kind: "text", text: `${pw(b, m)} ÷ ${pw(b, n)}` }, explanation: `Misma base: se restan los exponentes, ${sg(m)} − ${par(n)} = ${sg(m - n)}.`, tag: "cociente" };
  }
  if (rule === "both") {
    const k = ex();
    const q = opts(m + n - k, [m + n + k, m - n - k, m * n - k, m + n - k + 2]);
    return { ...q, visual: { kind: "text", text: `${pw(b, m)} × ${pw(b, n)} ÷ ${pw(b, k)}` }, explanation: `${sg(m)} + ${par(n)} − ${par(k)} = ${sg(m + n - k)}.`, tag: "producto-cociente" };
  }
  const p = r.pick([2, 3, -2]), base = r.int(-4, 5) || 2;
  const q = opts(base * p, [base + p, base - p, -base * p, base * p + 1]);
  return { ...q, visual: { kind: "text", text: `(${pw(b, base)})${pw("", p)}` }, explanation: `Potencia de una potencia: se multiplican los exponentes, ${sg(base)} × ${par(p)} = ${sg(base * p)}.`, tag: "potencia" };
}

// Expresiones equivalentes con potencias.
export function equivalentPowers(r: Rng, level: 1 | 2): Question {
  const b = r.int(2, 5);
  if (level === 1) {
    const m = r.int(2, 6), n = r.int(1, m - 1);
    const good = `${pw(String(b), m)} ÷ ${pw(String(b), n)}`;
    return choiceQ(r, `¿Qué expresión es equivalente a ${pw(String(b), m - n)}?`, good, [`${pw(String(b), m)} × ${pw(String(b), n)}`, `${pw(String(b), m - n + 1)} ÷ ${pw(String(b), 2)}`.replace(`${pw(String(b), 2)}`, pw(String(b), 3)), `(${pw(String(b), m)})${pw("", n)}`], `${pw(String(b), m)} ÷ ${pw(String(b), n)} = ${pw(String(b), m - n)}: se restan los exponentes.`, undefined, "equivalente");
  }
  const m = r.int(2, 4), n = r.int(2, 3);
  const exp = -m * n;
  const good = `1/${pw(String(b), m * n)}`;
  return choiceQ(r, `¿Qué expresión es equivalente a (${pw(String(b), -m)})${pw("", n)}?`, good, [`−${pw(String(b), m * n)}`, pw(String(b), m * n), `1/${pw(String(b), m + n)}`], `Se multiplican los exponentes: (${pw(String(b), -m)})${pw("", n)} = ${pw(String(b), exp)} = 1/${pw(String(b), m * n)}.`, undefined, "equivalente-negativo");
}

// Propiedades de las potencias con bases variables.
export function varPowerRule(r: Rng, rule: "product" | "quotient" | "both" | "power"): Question {
  const v = r.pick(["x", "m", "n", "p", "b"]);
  const m = r.int(2, 9), n = r.int(2, 7);
  const coef = r.chance(0.4);
  if (rule === "product") {
    const c1 = coef ? r.int(2, 6) : 1, c2 = coef ? r.int(2, 5) : 1;
    const head = (c: number) => (c === 1 ? "" : String(c));
    const good = `${head(c1 * c2)}${pw(v, m + n)}`;
    return choiceQ(r, "Simplifica.", good, [...new Set([`${head(c1 * c2)}${pw(v, m * n)}`, `${head(c1 + c2 === 2 ? 2 : c1 + c2)}${pw(v, m + n)}`, `${head(c1 * c2)}${pw(v, Math.abs(m - n) || 1)}`, `${head(c1 * c2)}${pw(v, m + n + 1)}`, `${head(c1 + c2 + 1)}${pw(v, m * n)}`])].filter((x) => x !== `${head(c1 * c2)}${pw(v, m + n)}`), `Se multiplican los coeficientes y se suman los exponentes: ${pw(v, m)} · ${pw(v, n)} = ${pw(v, m + n)}.`, `${head(c1)}${pw(v, m)} · ${head(c2)}${pw(v, n)}`, "producto");
  }
  if (rule === "quotient") {
    const big = m + n, c2 = coef ? r.int(2, 5) : 1, c1 = c2 * (coef ? r.int(2, 6) : 1);
    const head = (c: number) => (c === 1 ? "" : String(c));
    const good = `${head(c1 / c2)}${pw(v, big - n)}`;
    return choiceQ(r, "Simplifica.", good, [...new Set([`${head(c1 / c2)}${pw(v, big + n)}`, `${head(c1 - c2 || 1)}${pw(v, big - n)}`, `${head(c1 / c2)}${pw(v, big * n)}`, `${head(c1 / c2)}${pw(v, big - n - 1)}`, `${head(c1 * c2)}${pw(v, big - n)}`])].filter((x) => x !== `${head(c1 / c2)}${pw(v, big - n)}`), `Se dividen los coeficientes y se restan los exponentes: ${big} − ${n} = ${big - n}.`, `${head(c1)}${pw(v, big)} ÷ ${head(c2)}${pw(v, n)}`, "cociente");
  }
  if (rule === "both") {
    const k = r.int(2, m + n - 1);
    const good = pw(v, m + n - k);
    return choiceQ(r, "Simplifica.", good, [pw(v, m + n + k), pw(v, m * n - k), pw(v, m - n + k > 0 ? m - n + k : m + 1)], `${m} + ${n} − ${k} = ${m + n - k}.`, `${pw(v, m)} · ${pw(v, n)} ÷ ${pw(v, k)}`, "producto-cociente");
  }
  const p = r.int(2, 4), mm = r.int(2, 5);
  const c = coef ? r.int(2, 3) : 1;
  const good = `${c === 1 ? "" : c ** p}${pw(v, mm * p)}`;
  const head = (n: number) => (c === 1 ? "" : String(n));
  const wrong = [`${head(c * p)}${pw(v, mm * p)}`, `${head(c ** p)}${pw(v, mm + p)}`, `${head(c)}${pw(v, mm * p)}`, `${head(c ** p)}${pw(v, mm * p + 1)}`, `${head(c ** p)}${pw(v, mm ** p)}`];
  return choiceQ(r, "Simplifica.", good, [...new Set(wrong)].filter((x) => x !== good), `Potencia de una potencia: se multiplican los exponentes (${mm} × ${p} = ${mm * p})${c === 1 ? "" : ` y el coeficiente se eleva: ${c}${pw("", p)} = ${c ** p}`}.`, `(${c === 1 ? "" : c}${pw(v, mm)})${pw("", p)}`, "potencia");
}

// ---------------------------------------------------------------------------
// Notación científica

// Valor c × 10^k → mantisa (1 ≤ m < 10) y exponente.
function normalize(c: number, k: number): { m: number; e: number } {
  let m = Math.abs(c), e = k;
  while (m >= 10) { m /= 10; e++; }
  while (m < 1) { m *= 10; e--; }
  return { m: Number(m.toFixed(6)) * Math.sign(c), e };
}

// Notación científica en la calculadora (4.7E8).
export function sciCalculator(r: Rng): Question {
  const m = r.int(11, 99) / 10, e = r.pick([3, 5, 6, 8, 9, 11, -3, -4, -6, -7]);
  const calc = `${String(m)}E${e}`;
  if (r.chance(0.55)) return choiceQ(r, `La calculadora muestra ${calc}. ¿Qué número es?`, sciText(m, e), [sciText(m, -e), sciText(m, e + 1), `${dec(m)} × ${sg(e)}`], `«E${e}» significa «× 10${e < 0 ? " elevado a " + sg(e) : " elevado a " + e}»: ${sciText(m, e)}.`, undefined, "leer");
  return choiceQ(r, `¿Cómo se ve ${sciText(m, e)} en la pantalla de una calculadora?`, calc, [`${String(m)}E${-e}`, `${String(m)}E${e + 1}`, `${String(m * 10)}E${e}`], `La calculadora escribe la mantisa, la letra E y el exponente: ${calc}.`, undefined, "escribir");
}

type SciOp = "+" | "−" | "×" | "÷";
// Operaciones en notación científica.
export function sciOperation(r: Rng, ops: SciOp[], word = false): Question {
  const op = r.pick(ops);
  let a: { m: number; e: number }, b: { m: number; e: number }, res: { m: number; e: number };
  const ex = (lo: number, hi: number) => r.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((e) => e !== 0 && e !== 1));
  if (op === "×") {
    a = { m: r.int(11, 49) / 10, e: ex(-4, 8) };
    b = { m: r.int(2, 9), e: word ? r.int(2, 4) : ex(-3, 6) };
    res = normalize(Math.round(a.m * b.m * 10), a.e + b.e - 1);
  } else if (op === "÷") {
    b = { m: r.int(2, 4), e: word ? r.int(2, 4) : ex(-3, 5) };
    const q = r.int(11, 24) / 10;
    a = normalize(Math.round(b.m * q * 10), b.e + r.int(2, 6) - 1);
    res = normalize(Math.round(q * 10), a.e - b.e - 1);
  } else {
    const e = r.int(2, 8);
    a = { m: r.int(51, 89) / 10, e };
    b = { m: r.int(11, 49) / 10, e: e - r.int(0, 1) };
    const ca = Math.round(a.m * 100) * 10 ** (a.e - b.e), cb = Math.round(b.m * 100);
    res = normalize(op === "+" ? ca + cb : ca - cb, b.e - 2);
  }
  const good = sciText(res.m, res.e);
  const wrong = [sciText(res.m, res.e + 1), sciText(res.m, res.e - 1), sciText(Number((res.m * 10).toFixed(4)), res.e - 1).replace(/^(\d+),?/, (x) => x), sciText(res.m, -res.e || 2)]
    .filter((w, i, all) => w !== good && all.indexOf(w) === i && !/^\d{2}/.test(w));
  const expr = `(${sciText(a.m, a.e)}) ${op} (${sciText(b.m, b.e)})`;
  const why = op === "×" ? "Se multiplican las mantisas y se suman los exponentes; luego se ajusta la mantisa entre 1 y 10." : op === "÷" ? "Se dividen las mantisas y se restan los exponentes; luego se ajusta la mantisa entre 1 y 10." : "Primero se igualan los exponentes; luego se suman o restan las mantisas y se ajusta el resultado.";
  if (word) {
    const ctx = op === "×"
      ? `Un país produce ${sciText(a.m, a.e)} kg de un producto por día. ¿Cuántos kg produce en ${sciText(b.m, b.e)} días?`
      : op === "÷"
        ? `Un premio de ${sciText(a.m, a.e)} soles se reparte en partes iguales entre ${sciText(b.m, b.e)} personas. ¿Cuántos soles recibe cada una?`
        : op === "+"
          ? `Una ciudad tiene ${sciText(a.m, a.e)} habitantes y llegan ${sciText(b.m, b.e)} más. ¿Cuántos habitantes tiene ahora?`
          : `Un depósito tenía ${sciText(a.m, a.e)} litros de agua y se usaron ${sciText(b.m, b.e)} litros. ¿Cuántos litros quedan?`;
    return choiceQ(r, `${ctx} Responde en notación científica.`, good, wrong, why, undefined, `problema-${op}`);
  }
  return choiceQ(r, "Calcula y escribe el resultado en notación científica.", good, wrong, why, expr, op);
}

// ---------------------------------------------------------------------------
// Raíces

// Raíces cuadradas positivas y negativas, estimarlas, relación con los cuadrados y ecuaciones.
export function squareRoots(r: Rng, mode: "pm" | "estimate" | "relation" | "solve"): Question {
  const n = r.int(2, 15), sq = n * n;
  if (mode === "pm") {
    const form = r.int(0, 2);
    if (form === 0) return intQ(r, `¿Cuánto vale −${sqrtText(sq)}?`, -n, `${sqrtText(sq)} = ${n}, así que −${sqrtText(sq)} = −${n}.`, undefined, "negativa", [n, -sq]);
    if (form === 1) return choiceQ(r, `¿Cuáles son las raíces cuadradas de ${sq}?`, `${n} y −${n}`, [`Solo ${n}`, `Solo −${n}`, `${sq / 2 === Math.floor(sq / 2) ? sq / 2 : n + 1} y −${sq / 2 === Math.floor(sq / 2) ? sq / 2 : n + 1}`], `${n}² = ${sq} y (−${n})² = ${sq}: las dos son raíces cuadradas de ${sq}.`, undefined, "ambas");
    return intQ(r, `¿Cuál es la raíz cuadrada negativa de ${sq}?`, -n, `(−${n})² = ${sq}: la raíz cuadrada negativa de ${sq} es −${n}.`, undefined, "negativa", [n, -sq]);
  }
  if (mode === "estimate") {
    const m = r.int(3, 12), k = r.int(m * m + 1, (m + 1) * (m + 1) - 1);
    if (r.chance(0.5)) return choiceQ(r, `¿Entre qué dos enteros consecutivos está −${sqrtText(k)}?`, `−${m + 1} y −${m}`, [`${m} y ${m + 1}`, `−${m} y −${m - 1}`, `−${m + 2} y −${m + 1}`], `${m}² = ${m * m} y ${m + 1}² = ${(m + 1) ** 2}: ${sqrtText(k)} está entre ${m} y ${m + 1}, así que −${sqrtText(k)} está entre −${m + 1} y −${m}.`, undefined, "negativa");
    return choiceQ(r, `¿Entre qué dos enteros consecutivos está ${sqrtText(k)}?`, `${m} y ${m + 1}`, [`${m - 1} y ${m}`, `${m + 1} y ${m + 2}`, `−${m + 1} y −${m}`], `${m}² = ${m * m} < ${k} < ${(m + 1) ** 2} = ${m + 1}².`, undefined, "positiva");
  }
  if (mode === "relation") {
    if (r.chance(0.5)) return numQ(n, `Un cuadrado tiene un área de ${sq} cm². ¿Cuántos cm mide su lado?`, undefined, `El lado es ${sqrtText(sq)} = ${n}, porque ${n}² = ${sq}.`, "lado");
    return numQ(sq, `Si ${sqrtText(sq)} = ${n}, ¿cuánto es ${n}²?`, undefined, `Elevar al cuadrado deshace la raíz: ${n}² = ${sq}.`, "cuadrado");
  }
  const k = r.pick([1, 1, 2, 3]);
  const shown = k === 1 ? `x² = ${sq}` : `${k}x² = ${k * sq}`;
  return choiceQ(r, "Resuelve la ecuación.", `x = ${n} o x = −${n}`, [`x = ${n}`, `x = ${sq / 2 === Math.floor(sq / 2) ? sq / 2 : sq} o x = −${sq / 2 === Math.floor(sq / 2) ? sq / 2 : sq}`, `x = −${n}`], `${k === 1 ? "" : `Se divide entre ${k}: x² = ${sq}. `}Las dos soluciones son ±${sqrtText(sq)} = ±${n}.`, shown, "ecuacion");
}

// Raíces cúbicas.
export function cubeRoots(r: Rng, mode: "positive" | "signed" | "solve" | "estimate"): Question {
  const n = r.int(1, 10), cube = n ** 3;
  if (mode === "positive") return numQ(n, `¿Cuánto vale ${cbrtText(cube)}?`, undefined, `${n} × ${n} × ${n} = ${cube}.`, "positiva");
  if (mode === "signed") {
    const s = r.pick([-1, 1]);
    return intQ(r, `¿Cuánto vale ${cbrtText(s * cube)}?`, s * n, s < 0 ? `(−${n})³ = −${cube}: la raíz cúbica de un número negativo es negativa.` : `${n}³ = ${cube}.`, undefined, s < 0 ? "negativa" : "positiva", [-s * n, s * n * 3]);
  }
  if (mode === "solve") {
    const s = r.pick([-1, 1]);
    return intQ(r, `Resuelve la ecuación x³ = ${sg(s * cube)}. ¿Cuánto vale x?`, s * n, `x = ${cbrtText(s * cube)} = ${sg(s * n)}, porque ${s < 0 ? `(−${n})` : n}³ = ${sg(s * cube)}.`, undefined, "ecuacion", [-s * n, s * n * 3]);
  }
  const m = r.int(2, 9), k = r.int(m ** 3 + 1, (m + 1) ** 3 - 1);
  return choiceQ(r, `¿Entre qué dos enteros consecutivos está ${cbrtText(k)}?`, `${m} y ${m + 1}`, [`${m - 1} y ${m}`, `${m + 1} y ${m + 2}`, `${Math.floor(Math.sqrt(k))} y ${Math.floor(Math.sqrt(k)) + 1}`].filter((x) => x !== `${m} y ${m + 1}`), `${m}³ = ${m ** 3} < ${k} < ${(m + 1) ** 3} = ${m + 1}³.`, undefined, "estimar");
}

// ---------------------------------------------------------------------------
// Irracionales

// Raíces cuadradas racionales e irracionales.
export function rationalRoot(r: Rng): Question {
  const form = r.int(0, 3);
  if (form === 0) {
    const n = r.int(2, 15);
    return yesNo(`¿${sqrtText(n * n)} es un número racional?`, true, `Sí: ${sqrtText(n * n)} = ${n}.`, undefined, "cuadrado-perfecto");
  }
  if (form === 1) {
    const k = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 20, 24, 30, 50]);
    return yesNo(`¿${sqrtText(k)} es un número racional?`, false, `No: ${k} no es un cuadrado perfecto, así que ${sqrtText(k)} es irracional.`, undefined, "no-perfecto");
  }
  if (form === 2) {
    const a = r.int(1, 6), b = r.int(a + 1, 9);
    return yesNo(`¿√(${a * a}/${b * b}) es un número racional?`, true, `Sí: √(${a * a}/${b * b}) = ${a}/${b}.`, undefined, "fraccion");
  }
  const d = r.pick([["0,25", "0,5"], ["0,49", "0,7"], ["0,09", "0,3"], ["1,44", "1,2"]]);
  return yesNo(`¿√${d[0]} es un número racional?`, true, `Sí: √${d[0]} = ${d[1]}.`, undefined, "decimal");
}

// Números irracionales en la recta numérica.
export function irrationalLine(r: Rng): Question {
  const cands = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 44, 45, 47, 48, 50];
  const k = r.pick(cands);
  const v = Math.sqrt(k);
  const visual: Visual = { kind: "numberLine", min: 0, max: 8, step: 0.5, labelEvery: 1, marked: v };
  const far = cands.filter((c) => Math.abs(Math.sqrt(c) - v) > 0.6);
  const wrong = r.shuffle(far).slice(0, 3).map(sqrtText);
  return choiceQ(r, "¿Qué número está marcado en la recta numérica?", sqrtText(k), wrong, `${sqrtText(k)} ≈ ${dec(Math.round(v * 10) / 10)}: está entre ${Math.floor(v)} y ${Math.floor(v) + 1}.`, visual, "recta");
}

// Comparar y ordenar racionales e irracionales.
export function compareIrrational(r: Rng): Question {
  const pool: [string, number][] = [
    ["π", Math.PI], [sqrtText(2), Math.SQRT2], [sqrtText(10), Math.sqrt(10)], [sqrtText(20), Math.sqrt(20)], [sqrtText(30), Math.sqrt(30)], [sqrtText(50), Math.sqrt(50)],
    ["3,1", 3.1], ["1,5", 1.5], ["4,4", 4.4], ["7,1", 7.1], ["5,5", 5.5], ["22/7", 22 / 7], ["9/2", 4.5], ["3,2", 3.2], [sqrtText(8), Math.sqrt(8)], ["2,9", 2.9],
  ];
  if (r.chance(0.5)) {
    let a = r.pick(pool), b = r.pick(pool);
    while (b[0] === a[0] || Math.abs(a[1] - b[1]) < 0.02) b = r.pick(pool);
    if (r.chance(0.5)) [a, b] = [b, a];
    return symbolQ(a[1], b[1], a[0], b[0], `${a[0]} ≈ ${dec(Math.round(a[1] * 100) / 100)} y ${b[0]} ≈ ${dec(Math.round(b[1] * 100) / 100)}.`);
  }
  const picked: [string, number][] = [];
  for (const item of r.shuffle(pool)) {
    if (picked.every((p) => Math.abs(p[1] - item[1]) > 0.05)) picked.push(item);
    if (picked.length === 4) break;
  }
  const sorted = [...picked].sort((p, q) => p[1] - q[1]);
  return orderQ(r, "Ordena de menor a mayor.", sorted.map((p) => p[0]), `Aproximados: ${sorted.map((p) => `${p[0]} ≈ ${dec(Math.round(p[1] * 100) / 100)}`).join("; ")}.`, undefined, "ordenar");
}

// ---------------------------------------------------------------------------
// Porcentajes

// ¿qué porcentaje es un número de otro?
export function percentOfAnother(r: Rng, word = false): Question {
  const p = r.pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80, ...(word ? [] : [125, 150])]);
  const whole = r.pick([20, 40, 60, 80, 120, 200, 240, 400, 500].filter((w) => (w * p) % 100 === 0));
  const part = (whole * p) / 100;
  if (word) {
    const [what, ofWhat] = r.pick([["alumnos aprobaron", "alumnos"], ["semillas germinaron", "semillas sembradas"], ["entradas se vendieron", "entradas"], ["kilómetros ya recorrió", "kilómetros del viaje"]]);
    return numQ(p, `De ${whole} ${ofWhat}, ${part} ${what}. ¿Qué porcentaje es?`, undefined, `${part} ÷ ${whole} = ${dec(part / whole)} → ${pct(p)}.`, "problema");
  }
  return numQ(p, `¿Qué porcentaje de ${whole} es ${part}?`, undefined, `${part} ÷ ${whole} = ${dec(part / whole)} → ${pct(p)}.`, "porcentaje");
}

// Comparar porcentajes de números.
export function comparePercentOf(r: Rng): Question {
  const mk = () => {
    const p = r.pick([10, 20, 25, 30, 40, 50, 60, 75]);
    const n = r.pick([20, 40, 60, 80, 120, 160, 200].filter((w) => (w * p) % 100 === 0));
    return { p, n, v: (p * n) / 100 };
  };
  const a = mk();
  let b = mk();
  // A veces dos porcentajes distintos dan lo mismo: 50 % de 80 = 25 % de 160.
  if (r.chance(0.25) && a.p % 2 === 0 && a.n <= 100) b = { p: a.p / 2, n: a.n * 2, v: a.v };
  while (b.p === a.p && b.n === a.n) b = mk();
  return symbolQ(a.v, b.v, `${pct(a.p)} de ${a.n}`, `${pct(b.p)} de ${b.n}`, `${pct(a.p)} de ${a.n} = ${fmt(a.v)} y ${pct(b.p)} de ${b.n} = ${fmt(b.v)}.`);
}

export { fixedQ };
