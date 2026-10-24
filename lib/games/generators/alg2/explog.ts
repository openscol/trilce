import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, intQ, numQ, sg, soles, yesNo } from "../kit";
import { dec, frac, poly, valQ } from "../alg1/util";

// Álgebra 2: raíces enésimas, ecuaciones con exponentes racionales,
// logaritmos (propiedades, cambio de base, funciones) y ecuaciones
// exponenciales y logarítmicas.

const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => [...String(n)].map((c) => SUPS[Number(c)]).join("");
const root = (n: number) => (n === 2 ? "√" : n === 3 ? "∛" : n === 4 ? "∜" : `${sup(n)}√`);

// Raíces de enteros, de racionales y raíces enésimas.
export function nthRoot(r: Rng, kind: "integer" | "rational" | "nth"): Question {
  const n = kind === "nth" ? r.pick([3, 4, 5]) : r.pick([2, 3, 4]);
  const k = r.int(2, n === 5 ? 3 : n === 4 ? 4 : 6);
  const neg = n % 2 === 1 && r.chance(0.4);
  if (kind === "rational") {
    const d = r.int(2, n === 2 ? 9 : 4);
    if (d === k) return nthRoot(r, kind);
    const good = `${neg ? "−" : ""}${frac(k, d)}`;
    return choiceQ(r, `¿Cuánto es ${root(n)}(${neg ? "−" : ""}${k ** n}/${d ** n})?`, good, [`${neg ? "" : "−"}${frac(k, d)}`, frac(k * n, d * n) === frac(k, d) ? frac(d, k) : frac(k ** n, d), frac(d, k)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Raíz del numerador y del denominador: ${root(n)}${k ** n} = ${k} y ${root(n)}${d ** n} = ${d}.`, undefined, "racional");
  }
  if (r.chance(0.2) && n % 2 === 0) return choiceQ(r, `¿Cuánto es ${root(n)}(−${k ** n}) en los números reales?`, "No es un número real", [`−${k}`, `${k}`, `${k}i`], `Ninguna potencia par de un número real es negativa: ${root(n)}(−${k ** n}) no es real.`, undefined, "no-real");
  return intQ(r, `¿Cuánto es ${root(n)}${neg ? `(−${k ** n})` : k ** n}?`, neg ? -k : k, `${neg ? `(−${k})` : k}${sup(n)} = ${neg ? "−" : ""}${k ** n}.`, undefined, kind, [k * n, neg ? k : -k]);
}

// Raíces con calculadora.
export function rootCalculator(r: Rng): Question {
  const n = r.pick([2, 3, 4, 5]), x = r.int(2, 500);
  const v = Math.round(x ** (1 / n) * 100) / 100;
  if (Number.isInteger(x ** (1 / n))) return rootCalculator(r);
  return valQ(r, `Usa una calculadora. ¿Cuánto es ${root(n)}${x}? Redondea a la centésima.`, v, [Math.round((x / n) * 100) / 100, Math.round(Math.sqrt(x) * 100) / 100 === v ? v + 0.1 : Math.round(Math.sqrt(x) * 100) / 100, Math.round((v + 0.01) * 100) / 100], `${root(n)}${x} = ${x}^(1/${n}) ≈ ${dec(v)}.`, undefined, "calculadora");
}

// Simplificar radicales con variables (raíces cuadradas y cúbicas).
export function radicalVars(r: Rng, cube: boolean): Question {
  const n = cube ? 3 : 2;
  const k = r.int(2, cube ? 3 : 5), m = r.pick(cube ? [2, 3, 1] : [2, 3, 5, 1]), e = r.int(n + 1, 3 * n + 2);
  const out = Math.floor(e / n), rest = e % n;
  const inside = `${m === 1 ? "" : m}${rest ? `x${rest > 1 ? sup(rest) : ""}` : ""}`;
  const xp = (e2: number) => (e2 === 0 ? "" : e2 === 1 ? "x" : `x${sup(e2)}`);
  const rad2 = (t: string) => (t ? `${root(n)}${t.length > 1 ? `(${t})` : t}` : "");
  const good = `${k}${xp(out)}${rad2(inside)}`;
  const wrong = [`${k}${xp(e)}${m === 1 ? "" : rad2(String(m))}`, `${k ** n}${xp(out)}${rad2(inside)}`, `${k}${xp(out + 1)}${rad2(inside)}`, `${k}${xp(rest)}${rad2(xp(out))}`].filter((w) => w !== good);
  return choiceQ(r, `Simplifica ${root(n)}(${k ** n * m}x${sup(e)}). (Supón x ≥ 0.)`, good, [...new Set(wrong)], `${root(n)}${k ** n} = ${k} y x${sup(e)} = (x${sup(out)})${sup(n)}${rest ? ` · x${rest > 1 ? sup(rest) : ""}` : ""}.`, undefined, cube ? "cubica" : "cuadrada");
}

// Ecuaciones con exponentes racionales.
export function rationalExpEquation(r: Rng): Question {
  const [p, q] = r.pick([[3, 2], [2, 3], [3, 4], [4, 3], [5, 2], [2, 5]]);
  const base = r.int(2, q === 2 ? 5 : 3);
  const x = base ** q, rhs = base ** p;
  return numQ(x, `Resuelve: x^(${p}/${q}) = ${rhs}. (x > 0)`, undefined, `Se eleva a ${q}/${p}: x = ${rhs}^(${q}/${p}) = (${root(p)}${rhs})${sup(q)} = ${base}${sup(q)} = ${x}.`, "exponente");
}

// ---------------------------------------------------------------------------
// Logaritmos

const LOGB = [2, 3, 4, 5, 10];
const subN = (b: number | string) => [...String(b)].map((c) => "₀₁₂₃₄₅₆₇₈₉"[Number(c)] ?? c).join("");
const log = (b: number | string) => (b === 10 ? "log" : b === "e" ? "ln" : `log${subN(b)}`);

// Convertir entre forma exponencial y logarítmica.
export function convertLog(r: Rng, kind: "rational" | "natural" | "all"): Question {
  const toLog = r.chance(0.5);
  if (kind === "natural") {
    const v = r.int(2, 9), x = r.int(1, 5);
    return toLog
      ? choiceQ(r, `¿Cómo se escribe e^${x} = y en forma logarítmica?`, `ln y = ${x}`, [`ln ${x} = y`, `log y = ${x}`, `y = ln ${x}`], "e^a = b equivale a ln b = a.", undefined, "a-log")
      : choiceQ(r, `¿Cómo se escribe ln ${v} = x en forma exponencial?`, `e^x = ${v}`, [`${v}^x = e`, `e^${v} = x`, `x^e = ${v}`], "ln b = a equivale a e^a = b.", undefined, "a-exp");
  }
  // Base entera (o 1/d en «racional») y exponente entero.
  const d = r.pick([2, 3, 5]);
  const inv = kind === "rational" && r.chance(0.5);
  const b = inv ? d : r.pick(kind === "rational" ? [2, 3, 5] : [2, 3, 4, 5, 10]);
  const e = r.int(-3, 4);
  const powVal = (base: number, ex: number) => (ex >= 0 ? String(base ** ex) : `1/${base ** -ex}`);
  // Con base 1/d: (1/d)^e = d^(−e).
  const val = inv ? powVal(d, -e) : powVal(b, e);
  const bShow = inv ? `(1/${d})` : String(b);
  const bLog = inv ? `log₁/${subN(d)}` : log(b);
  const eShow = e < 0 ? `(${sg(e)})` : String(e);
  const goodLog = `${bLog} ${val} = ${sg(e)}`;
  if (toLog) return choiceQ(r, `¿Cómo se escribe ${bShow}^${eShow} = ${val} en forma logarítmica?`, goodLog, [`${bLog} ${sg(e)} = ${val}`, `${bLog} ${val} = ${sg(-e || 2)}`, `${log(10)} ${val} = ${sg(e)}`].filter((w) => w !== goodLog), "bᵃ = c equivale a log_b c = a.", undefined, "a-log");
  const vP = val.includes("/") ? `(${val})` : val;
  return choiceQ(r, `¿Cómo se escribe ${goodLog} en forma exponencial?`, `${bShow}^${eShow} = ${val}`, [`${eShow}^${bShow} = ${val}`, `${bShow}^${vP} = ${sg(e)}`, `${vP}^${eShow} = ${bShow}`], "log_b c = a equivale a bᵃ = c.", undefined, "a-exp");
}

// Evaluar logaritmos (y logaritmos naturales).
export function evaluateLog(r: Rng, natural: boolean): Question {
  if (natural) {
    const e = r.int(-3, 6);
    if (r.chance(0.5)) return intQ(r, `¿Cuánto vale ln(e^${e < 0 ? `(${sg(e)})` : e})?`, e, `ln y e^x son inversas: ln(e^${e < 0 ? `(${sg(e)})` : e}) = ${sg(e)}.`, undefined, "ln-e", [-e, e + 1]);
    return choiceQ(r, "¿Cuánto vale ln 1?", "0", ["1", "e", "No existe"], "e⁰ = 1, así que ln 1 = 0.", undefined, "ln-1");
  }
  const b = r.pick(LOGB), e = r.int(-2, 4);
  const val = e >= 0 ? String(b ** e) : `1/${b ** -e}`;
  return intQ(r, `¿Cuánto vale ${log(b)} ${val}?`, e, `${b}${e < 0 ? `⁻${sup(-e)}` : sup(e)} = ${val}, así que ${log(b)} ${val} = ${sg(e)}.`, undefined, "evaluar", [-e, b * e || 1]);
}

// Cambio de base y logaritmos con calculadora.
export function changeOfBase(r: Rng, calculator: boolean): Question {
  const b = r.pick([2, 3, 5, 6, 7]), x = r.int(3, 90);
  const v = Math.round((Math.log(x) / Math.log(b)) * 100) / 100;
  if (calculator) return valQ(r, `Usa una calculadora. ¿Cuánto vale ${log(b)} ${x}? Redondea a la centésima.`, v, [Math.round((Math.log(b) / Math.log(x)) * 100) / 100, Math.round(Math.log10(x) * 100) / 100, Math.round((v + 0.1) * 100) / 100], `${log(b)} ${x} = log ${x} ÷ log ${b} ≈ ${dec(v)}.`, undefined, "calculadora");
  return choiceQ(r, `¿Qué expresión es igual a ${log(b)} ${x}?`, `log ${x} / log ${b}`, [`log ${b} / log ${x}`, `log(${x}/${b})`, `log ${x} − log ${b}`], `Cambio de base: log_b a = log a ÷ log b.`, undefined, "formula");
}

const PROPS: [string, string, string[]][] = [
  ["log_b(MN) = log_b M + log_b N", "Propiedad del producto", ["Propiedad del cociente", "Propiedad de la potencia", "Cambio de base"]],
  ["log_b(M/N) = log_b M − log_b N", "Propiedad del cociente", ["Propiedad del producto", "Propiedad de la potencia", "Cambio de base"]],
  ["log_b(Mᵏ) = k · log_b M", "Propiedad de la potencia", ["Propiedad del producto", "Propiedad del cociente", "Cambio de base"]],
  ["log_b M = log M / log b", "Cambio de base", ["Propiedad del producto", "Propiedad del cociente", "Propiedad de la potencia"]],
];
// Identificar propiedades de los logaritmos.
export function logProperties(r: Rng): Question {
  const [eq, good, wrong] = r.pick(PROPS);
  return choiceQ(r, `¿Qué propiedad se usa en ${eq}?`, good, wrong, `${eq}: ${good.toLowerCase()}.`, undefined, "propiedad");
}

// Propiedades del producto, cociente y potencia (expandir o condensar).
export function logRule(r: Rng, rule: "product" | "quotient" | "power" | "mixed"): Question {
  const ru = rule === "mixed" ? r.pick(["product", "quotient", "power"] as const) : rule;
  const b = r.pick(LOGB), m = r.int(2, 9), n = r.int(2, 9), k = r.int(2, 5);
  const L = (x: string | number) => `${log(b)} ${x}`;
  if (ru === "product") return choiceQ(r, `Escribe como un solo logaritmo: ${L(m)} + ${L(n)}`, L(m * n), [L(m + n), `${L(m)} · ${L(n)}`, L(`${m}${sup(n)}`)], `Producto: ${L(m)} + ${L(n)} = ${L(`(${m} · ${n})`)} = ${L(m * n)}.`, undefined, "producto");
  if (ru === "quotient") return choiceQ(r, `Escribe como diferencia de logaritmos: ${L(`(x/${m})`)}`, `${L("x")} − ${L(m)}`, [`${L("x")} + ${L(m)}`, `${L("x")} / ${L(m)}`, `${L(m)} − ${L("x")}`], "Cociente: log(M/N) = log M − log N.", undefined, "cociente");
  return choiceQ(r, `Escribe sin exponentes dentro del logaritmo: ${L(`x${sup(k)}`)}`, `${k} · ${L("x")}`, [`${L(`${k}x`)}`, `(${L("x")})${sup(k)}`, `${L("x")} + ${k}`], `Potencia: log(Mᵏ) = k · log M.`, undefined, "potencia");
}

// Evaluar logaritmos usando propiedades.
export function logEvaluate(r: Rng): Question {
  const b = r.pick([2, 3, 5]), a = r.int(1, 3), c = r.int(1, 3);
  const form = r.int(0, 2);
  if (form === 0) return numQ(a + c, `¿Cuánto vale ${log(b)} ${b ** (a + 1)} − ${log(b)} ${b} + ${log(b)} ${b ** c}?`, undefined, `${log(b)} ${b ** (a + 1)} − ${log(b)} ${b} = ${a + 1} − 1 = ${a}; más ${log(b)} ${b ** c} = ${c}: ${a + c}.`, "mixto");
  if (form === 1) return numQ(a * c, `¿Cuánto vale ${c} · ${log(b)} ${b ** a}?`, undefined, `${log(b)} ${b ** a} = ${a}; por ${c}: ${a * c}.`, "potencia");
  const [p, q] = r.pick([[4, 25], [2, 50], [5, 20], [8, 125]]);
  const k = Math.round(Math.log10(p * q));
  return numQ(k, `¿Cuánto vale log ${p} + log ${q}?`, undefined, `log ${p} + log ${q} = log ${p * q} = ${k}.`, "producto");
}

// Funciones logarítmicas (dominio, rango y gráfico).
export function logFunction(r: Rng, graph: boolean): Question {
  const h = r.int(-3, 3), k = r.int(-3, 3), b = r.pick([2, 3]);
  const f = `f(x) = ${log(b)}${h ? `(x ${h < 0 ? "+" : "−"} ${Math.abs(h)})` : " x"}${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}`;
  if (!graph) {
    const dom = r.chance(0.6);
    const good = dom ? `x > ${sg(h)}` : "Todos los números reales";
    return choiceQ(r, `¿Cuál es el ${dom ? "dominio" : "rango"} de ${f}?`, good, dom ? [`x ≥ ${sg(h)}`, `x > ${sg(-h || 1)}`, "Todos los números reales positivos"] : [`y > ${sg(k)}`, "Todos los números reales positivos", `y ≥ ${sg(k)}`], dom ? `El argumento del logaritmo debe ser positivo: ${h ? `x ${h < 0 ? "+" : "−"} ${Math.abs(h)}` : "x"} > 0.` : "Un logaritmo toma todos los valores reales.", undefined, dom ? "dominio" : "rango");
  }
  const yes = r.chance(0.5);
  const hh = yes ? h : h + r.pick([-2, 2]);
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [{ x: hh + 1, y: k, emoji: "•" }], curves: [{ points: Array.from({ length: 200 }, (_, i) => { const x = hh + 0.02 + i * 0.06; return { x, y: Math.log(x - hh) / Math.log(b) + k }; }) }] };
  return yesNo(`¿El gráfico muestra ${f}?`, yes, `Asíntota vertical x = ${sg(h)} y pasa por (${sg(h + 1)}, ${sg(k)}).`, visual, "grafico");
}

// ---------------------------------------------------------------------------
// Ecuaciones exponenciales y logarítmicas

// Ecuaciones exponenciales (misma base, logaritmos comunes o naturales).
export function expEquation(r: Rng, mode: "base" | "common" | "natural"): Question {
  if (mode === "base") {
    const b = r.pick([2, 3, 5]), a = r.int(2, 3), x = r.int(-2, 4);
    // (b^a)^x = b^(a·x)
    const rhs = a * x;
    return intQ(r, `Resuelve: ${b ** a}^x = ${b}^${rhs < 0 ? `(${sg(rhs)})` : rhs}`, x, `${b ** a} = ${b}${sup(a)}, así que ${b}^(${a}x) = ${b}^${rhs < 0 ? `(${sg(rhs)})` : rhs}: ${a}x = ${sg(rhs)} → x = ${sg(x)}.`, undefined, "misma-base", [rhs, -x]);
  }
  const b = r.int(2, 9), v = r.int(10, 500);
  if (mode === "natural") {
    const k = r.pick([0.5, 2, 3]);
    const xs = Math.round((Math.log(v) / k) * 1000) / 1000;
    return valQ(r, `Resuelve e^(${dec(k)}x) = ${v}. Redondea a la milésima.`, xs, [Math.round(Math.log(v) * 1000) / 1000, Math.round(Math.log(v) * k * 1000) / 1000, Math.round((v / k) * 1000) / 1000], `Se aplica ln: ${dec(k)}x = ln ${v} → x = ln ${v} ÷ ${dec(k)} ≈ ${dec(xs)}.`, undefined, "natural");
  }
  const x = Math.round((Math.log(v) / Math.log(b)) * 1000) / 1000;
  return valQ(r, `Resuelve ${b}^x = ${v}. Redondea a la milésima.`, x, [Math.round((Math.log(b) / Math.log(v)) * 1000) / 1000, Math.round((v / b) * 1000) / 1000, Math.round(Math.log10(v) * 1000) / 1000], `Se aplica log: x = log ${v} ÷ log ${b} ≈ ${dec(x)}.`, undefined, "comun");
}

// Interés compuesto (periódico o continuo).
export function interestExp(r: Rng, continuous: boolean): Question {
  const P = r.pick([1000, 2000, 5000, 8000]), rate = r.pick([2, 3, 4, 5, 6]), t = r.int(2, 10);
  const name = r.pick(NAMES);
  if (continuous) {
    const A = Math.round(P * Math.exp((rate / 100) * t) * 100);
    return choiceQ(r, `${name} deposita ${soles(P * 100)} al ${rate} % anual con capitalización continua. ¿Cuánto tendrá después de ${t} años? (A = Pe^(rt); redondea al céntimo.)`, soles(A), [soles(Math.round(P * (1 + rate / 100) ** t * 100)), soles(Math.round(P * (1 + (rate * t) / 100) * 100)), soles(A + 500)], `A = ${P} × e^(${dec(rate / 100)} × ${t}) ≈ ${soles(A)}.`, undefined, "continuo");
  }
  const target = P * 2;
  const years = Math.round((Math.log(2) / Math.log(1 + rate / 100)) * 10) / 10;
  return valQ(r, `${name} deposita ${soles(P * 100)} al ${rate} % anual compuesto anualmente. ¿En cuántos años se duplicará su dinero (${soles(target * 100)})? Redondea a la décima.`, years, [Math.round((100 / rate) * 10) / 10, Math.round((72 / rate) * 10) / 10 === years ? years + 1 : Math.round((72 / rate) * 10) / 10, Math.round(years * 2 * 10) / 10], `${P}(1,0${rate})^t = ${target} → t = log 2 ÷ log 1,0${rate} ≈ ${dec(years)}.`, undefined, "duplicar");
}

// Ecuaciones logarítmicas.
export function logEquation(r: Rng, level: 1 | 2): Question {
  const b = r.pick([2, 3, 5, 10]);
  if (level === 1) {
    const e = r.int(1, 3), c = r.int(1, 5) * r.pick([1, -1]);
    const x = b ** e - c;
    return intQ(r, `Resuelve: ${log(b)}(x ${c < 0 ? "−" : "+"} ${Math.abs(c)}) = ${e}`, x, `Forma exponencial: x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${b}${sup(e)} = ${b ** e} → x = ${sg(x)}.`, undefined, "simple", [b ** e, b * e - c]);
  }
  // log x + log(x − k) = log(x(x − k)): la raíz negativa se descarta.
  const x = r.int(3, 10), k = r.int(1, x - 1);
  const target = x * (x - k);
  return numQ(x, `Resuelve: log x + log(x − ${k}) = log ${target}`, undefined, `Producto: log(x(x − ${k})) = log ${target} → ${poly([1, -k, -target])} = 0 → (x − ${x})(x + ${x - k}) = 0. x = −${x - k} no sirve (no existe el logaritmo de un negativo), así que x = ${x}.`, "producto");
}

