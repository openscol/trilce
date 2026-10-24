import type { Rng } from "../rng";
import type { Question } from "../types";
import { choiceQ, distinct, fmt, multiQ, nDigits, numQ, symbolQ, sym, trueFalse } from "./kit";
import { calc, type Op } from "./wordproblems";

// Operaciones con números naturales (4.° en adelante): estimar, varias
// cifras, cifras que faltan, elegir números con un resultado dado, tablas de
// 12, ecuaciones e inecuaciones. Los tamaños son parámetros.

const OP_NAME: Record<Op, string> = { "+": "suma", "−": "resta", "×": "multiplicacion", "÷": "division" };

// Número de `digits` cifras que no cae justo en la mitad al redondear a `unit`.
function roundable(r: Rng, digits: number, unit: number) {
  let n = nDigits(r, digits);
  if (n % unit === unit / 2) n += 1;
  return n;
}
const roundTo = (n: number, unit: number) => Math.round(n / unit) * unit;
const UNIT_NAME: Record<number, string> = { 10: "decena", 100: "centena", 1000: "unidad de millar", 10000: "decena de millar", 100000: "centena de millar" };

// Estimar sumas y restas redondeando a la cifra principal.
export function estimateSumDiff(r: Rng, op: "+" | "−", minDigits = 3, maxDigits = 5): Question {
  const digits = r.int(minDigits, maxDigits);
  const unit = 10 ** (digits - 1);
  let a = roundable(r, digits, unit);
  let b = roundable(r, digits, unit);
  if (op === "−") {
    if (a < b) [a, b] = [b, a];
    if (roundTo(a, unit) === roundTo(b, unit)) return estimateSumDiff(r, op, minDigits, maxDigits);
  }
  const answer = calc(op, roundTo(a, unit), roundTo(b, unit));
  return numQ(answer, `Redondea cada número a la ${UNIT_NAME[unit]} más cercana y luego ${op === "+" ? "suma" : "resta"}.`, `${fmt(a)} ${op} ${fmt(b)} ≈ ?`, `${fmt(a)} ≈ ${fmt(roundTo(a, unit))} y ${fmt(b)} ≈ ${fmt(roundTo(b, unit))}; ${fmt(roundTo(a, unit))} ${op} ${fmt(roundTo(b, unit))} = ${fmt(answer)}.`, UNIT_NAME[unit]);
}

// Restar números de varias cifras.
export function subMulti(r: Rng, minDigits = 4, maxDigits = 6): Question {
  const a = nDigits(r, r.int(minDigits, maxDigits));
  const b = r.int(10 ** (minDigits - 1), a - 1);
  return numQ(a - b, "Resuelve la resta.", `${fmt(a)} − ${fmt(b)} = ?`, `Restamos columna por columna, de derecha a izquierda: ${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}.`, `${String(a).length}-cifras`);
}

// Sumar tres o más números.
export function addSeveral(r: Rng, minDigits = 3, maxDigits = 6): Question {
  const xs = Array.from({ length: r.int(3, 4) }, () => nDigits(r, r.int(minDigits, maxDigits)));
  const total = xs.reduce((a, b) => a + b, 0);
  return numQ(total, "Resuelve la suma.", `${xs.map(fmt).join(" + ")} = ?`, `Sumamos de dos en dos o por columnas: el total es ${fmt(total)}.`, `${xs.length}-sumandos`);
}

// Hallar la cifra que falta en una suma o resta.
export function missingDigit(r: Rng, op: "+" | "−", minDigits = 3, maxDigits = 5): Question {
  let a = nDigits(r, r.int(minDigits, maxDigits));
  let b = nDigits(r, r.int(minDigits, String(a).length));
  if (op === "−" && a < b) [a, b] = [b, a];
  if (a === b) a += 7;
  const c = calc(op, a, b);
  const which = r.int(0, 1);
  const target = String(which === 0 ? a : b);
  const at = r.int(0, target.length - 1);
  const masked = [...target].map((ch, i) => (i === at ? "▢" : ch)).join("");
  const show = (s: string) => (s.length > 4 ? [...s].map((ch, i) => (i > 0 && (s.length - i) % 3 === 0 ? " " : "") + ch).join("") : s);
  const left = which === 0 ? show(masked) : fmt(a);
  const right = which === 0 ? fmt(b) : show(masked);
  return numQ(Number(target[at]), "¿Qué cifra falta?", `${left} ${op} ${right} = ${fmt(c)}`, `La operación completa es ${fmt(a)} ${op} ${fmt(b)} = ${fmt(c)}: falta el ${target[at]}.`, OP_NAME[op]);
}

const RESULT_NAME: Record<Op, string> = { "+": "suma", "−": "diferencia", "×": "producto", "÷": "cociente" };

// Elegir dos números con un resultado dado.
// Entre las opciones hay exactamente un par que cumple.
export function choosePair(r: Rng, op: Op, lo: number, hi: number): Question {
  for (;;) {
    let a: number;
    let b: number;
    if (op === "÷") {
      b = r.int(2, 12);
      a = b * r.int(2, 12);
    } else {
      [a, b] = distinct(r, 2, lo, hi);
      if (b === undefined) continue;
      if (a < b) [a, b] = [b, a];
    }
    const target = calc(op, a, b);
    if (a === b) continue;
    const others = op === "÷" ? distinct(r, 3, 2, 150, (n) => n !== a && n !== b) : distinct(r, 3, lo, hi, (n) => n !== a && n !== b);
    const all = [a, b, ...others];
    let pairs = 0;
    for (let i = 0; i < all.length; i++)
      for (let j = 0; j < all.length; j++) {
        if (i === j || all[i] < all[j]) continue;
        if (calc(op, all[i], all[j]) === target) pairs++;
      }
    if (pairs !== 1 || others.length < 3) continue;
    const options = r.shuffle(all).map(fmt);
    return multiQ(`Selecciona los dos números cuya ${RESULT_NAME[op]} es ${fmt(target)}.`.replace("cuya producto", "cuyo producto").replace("cuya cociente", "cuyo cociente"), options, [fmt(a), fmt(b)], `${fmt(a)} ${op} ${fmt(b)} = ${fmt(target)}.`, undefined, OP_NAME[op]);
  }
}

// Propiedad distributiva, hallar el factor que falta.
export function distributiveMissing(r: Rng, maxTens = 9): Question {
  const a = r.int(2, 9);
  const tens = r.int(1, maxTens) * 10;
  const ones = r.int(1, 9);
  const n = tens + ones;
  const form = r.int(0, 2);
  const full = `${a} × ${n} = (${a} × ${tens}) + (${a} × ${ones})`;
  if (form === 0) return numQ(ones, "¿Qué número falta?", `${a} × ${n} = (${a} × ${tens}) + (${a} × ?)`, `${n} = ${tens} + ${ones}, así que ${full}.`, "sumando");
  if (form === 1) return numQ(tens, "¿Qué número falta?", `${a} × ${n} = (${a} × ?) + (${a} × ${ones})`, `${n} = ${tens} + ${ones}, así que ${full}.`, "sumando");
  return numQ(a, "¿Qué número falta?", `${a} × ${n} = (? × ${tens}) + (? × ${ones})`, `El mismo factor multiplica a cada parte: ${full}.`, "factor");
}

// Comparar números con la multiplicación («es n veces»).
export function timesAsMany(r: Rng, max = 10): Question {
  const a = r.int(2, max);
  const b = r.int(2, max);
  const form = r.int(0, 2);
  if (form === 0) return numQ(a * b, "Completa.", `? es ${a} veces ${b}`, `${a} × ${b} = ${a * b}.`, "producto");
  if (form === 1) return numQ(b, "Completa.", `${a * b} es ${a} veces ?`, `${a * b} ÷ ${a} = ${b}.`, "cantidad");
  return numQ(a, "Completa.", `${a * b} es ? veces ${b}`, `${a * b} ÷ ${b} = ${a}.`, "veces");
}

// Tablas hasta `max`.
export function multFactsTo(r: Rng, max: number): Question {
  const a = r.int(0, max);
  const b = r.int(Math.max(0, max - 4), max);
  const [x, y] = r.chance(0.5) ? [a, b] : [b, a];
  return numQ(a * b, "Resuelve la multiplicación.", `${x} × ${y} = ?`, `${x} × ${y} = ${a * b}.`, `tabla-${b}`);
}
export function multMissingTo(r: Rng, max: number): Question {
  const a = r.int(1, max);
  const b = r.int(Math.max(1, max - 4), max);
  const [known, hidden] = r.chance(0.5) ? [a, b] : [b, a];
  return numQ(hidden, "¿Qué número falta?", r.chance(0.5) ? `${known} × ? = ${a * b}` : `? × ${known} = ${a * b}`, `${known} × ${hidden} = ${a * b}.`, `tabla-${known}`);
}
export function divFactsTo(r: Rng, max: number): Question {
  const d = r.int(1, max);
  const q = r.int(Math.max(1, max - 4), max);
  const [x, y] = r.chance(0.5) ? [d, q] : [q, d];
  return numQ(y, "Resuelve la división.", `${d * q} ÷ ${x} = ?`, `${d * q} ÷ ${x} = ${y}, porque ${x} × ${y} = ${d * q}.`, `entre-${x}`);
}
export function divMissingTo(r: Rng, max: number): Question {
  const d = r.int(2, max);
  const q = r.int(Math.max(1, max - 4), max);
  return r.chance(0.5) ? numQ(d, "¿Qué número falta?", `${d * q} ÷ ? = ${q}`, `${d * q} ÷ ${d} = ${q}.`, "divisor") : numQ(d * q, "¿Qué número falta?", `? ÷ ${d} = ${q}`, `${q} × ${d} = ${d * q}.`, "dividendo");
}

// Problemas con divisiones básicas.
export function divFactProblem(r: Rng, max: number): Question {
  const d = r.int(2, max);
  const q = r.int(2, max);
  const items = r.pick(["caramelos", "lápices", "globos", "stickers", "galletas"]);
  return r.chance(0.5)
    ? numQ(q, `Hay ${d * q} ${items} repartidos por igual en ${d} bolsas. ¿Cuántos hay en cada bolsa?`, undefined, `${d * q} ÷ ${d} = ${q}.`, "repartir")
    : numQ(q, `Hay ${d * q} ${items}. Se arman grupos de ${d}. ¿Cuántos grupos se forman?`, undefined, `${d * q} ÷ ${d} = ${q}.`, "agrupar");
}

// Propiedades de la división.
export function divProperties(r: Rng): Question {
  const a = r.int(2, 99);
  const form = r.int(0, 4);
  if (form === 0) return numQ(a, "¿Qué número falta?", `${a} ÷ 1 = ?`, "Cualquier número dividido entre 1 da el mismo número.", "entre-1");
  if (form === 1) return numQ(1, "¿Qué número falta?", `${a} ÷ ${a} = ?`, "Un número (distinto de 0) dividido entre sí mismo da 1.", "entre-si-mismo");
  if (form === 2) return numQ(0, "¿Qué número falta?", `0 ÷ ${a} = ?`, "Cero dividido entre cualquier número (distinto de 0) da 0.", "cero");
  if (form === 3) return numQ(a, "¿Qué número falta?", `? ÷ 1 = ${a}`, "Solo ese mismo número dividido entre 1 da ese resultado.", "entre-1");
  const d = r.int(2, 9);
  const q = r.int(2, 9);
  const good = r.chance(0.5);
  return trueFalse("¿Verdadero o falso?", good, good ? `${d * q} ÷ ${d} = ${q} y ${d * q} ÷ ${q} = ${d}: son de la misma familia.` : `La división no es conmutativa: ${d * q} ÷ ${d} = ${q}, pero ${d} ÷ ${d * q} no da ${q}.`, good ? `Si ${d * q} ÷ ${d} = ${q}, entonces ${d * q} ÷ ${q} = ${d}` : `${d * q} ÷ ${d} = ${d} ÷ ${d * q}`, "relaciones");
}

// Sumar y restar números que terminan en ceros.
export function addSubZeros(r: Rng): Question {
  const unit = r.pick([10, 100, 1000, 10000]);
  const a = r.int(2, 90) * unit;
  const b = r.int(1, 9) * r.pick([unit, unit / 10 || unit]);
  const op: Op = r.chance(0.5) || b >= a ? "+" : "−";
  return numQ(calc(op, a, b), "Resuelve.", `${fmt(a)} ${op} ${fmt(b)} = ?`, `${fmt(a)} ${op} ${fmt(b)} = ${fmt(calc(op, a, b))}.`, OP_NAME[op]);
}

// Una expresión con una sola operación y su valor.
function expr(r: Rng, op: Op, max: number): [string, number] {
  if (op === "+" || op === "−") {
    const a = r.int(Math.floor(max / 4), max);
    const b = r.int(2, Math.floor(max / 4));
    return [`${fmt(a)} ${op} ${fmt(b)}`, calc(op, a, b)];
  }
  const a = r.int(2, 12);
  const b = r.int(2, 12);
  return op === "×" ? [`${a} × ${b}`, a * b] : [`${a * b} ÷ ${a}`, b];
}
const OPS: Op[] = ["+", "−", "×", "÷"];

// Ecuaciones con operaciones mixtas, ¿verdadero o falso?
export function equationTrueFalse(r: Rng): Question {
  const [left, value] = expr(r, r.pick(OPS), 100);
  if (r.chance(0.5)) {
    // Lado derecho con el mismo valor.
    const k = r.int(1, Math.max(1, Math.min(20, value - 1)));
    const same = value > 1 ? `${fmt(value - k)} + ${k}` : `${value + 3} − 3`;
    return trueFalse("¿La igualdad es verdadera o falsa?", true, `Los dos lados valen ${fmt(value)}.`, `${left} = ${same}`);
  }
  for (;;) {
    const [right, rv] = expr(r, r.pick(OPS), 100);
    if (rv === value) continue;
    return trueFalse("¿La igualdad es verdadera o falsa?", false, `${left} = ${fmt(value)}, pero ${right} = ${fmt(rv)}.`, `${left} = ${right}`);
  }
}

// Comparar dos expresiones con <, = o >.
export function inequality(r: Rng, ops: Op[] = OPS, max = 100): Question {
  const [left, lv] = expr(r, r.pick(ops), max);
  if (r.chance(0.5)) {
    const other = r.chance(0.3) ? lv : Math.max(0, lv + r.pick([-1, 1]) * r.int(1, Math.max(2, Math.floor(lv / 5))));
    return symbolQ(lv, other, left, fmt(other), `${left} = ${fmt(lv)}, y ${fmt(lv)} ${sym(lv, other)} ${fmt(other)}.`);
  }
  const [right, rv] = expr(r, r.pick(ops), max);
  return symbolQ(lv, rv, left, right, `${left} = ${fmt(lv)} y ${right} = ${fmt(rv)}.`);
}

// Hallar dos números a partir de dos pistas.
export function twoNumbers(r: Rng, clues: ("suma" | "diferencia" | "producto" | "cociente")[]): Question {
  for (;;) {
    const withQuotient = clues.includes("cociente");
    const b = r.int(1, 12);
    const a = withQuotient ? b * r.int(2, 9) : r.int(b + 1, 20);
    if (a === b) continue;
    const info = { suma: a + b, diferencia: a - b, producto: a * b, cociente: a / b };
    const [c1, c2] = clues.length === 2 ? clues : (r.shuffle(clues).slice(0, 2) as typeof clues);
    const answer = `${a} y ${b}`;
    const wrong: string[] = [];
    // Pares que cumplen solo una de las dos pistas.
    for (let x = 1; x <= 150; x++)
      for (let y = 1; y < x; y++) {
        const i = { suma: x + y, diferencia: x - y, producto: x * y, cociente: x / y };
        if ((i[c1] === info[c1]) !== (i[c2] === info[c2])) wrong.push(`${x} y ${y}`);
        if (i[c1] === info[c1] && i[c2] === info[c2] && (x !== a || y !== b)) wrong.push("ambiguo");
      }
    if (wrong.includes("ambiguo") || wrong.length < 2) continue;
    // Se prefieren los pares más parecidos a la respuesta.
    const near = (t: string) => {
      const [x, y] = t.split(" y ").map(Number);
      return Math.abs(x - a) + Math.abs(y - b);
    };
    wrong.sort((p, q) => near(p) - near(q));
    wrong.length = Math.min(wrong.length, 6);
    const art = (c: string) => `su ${c} es`;
    return choiceQ(r, `Dos números cumplen esto: ${art(c1)} ${info[c1]} y ${art(c2)} ${info[c2]}. ¿Cuáles son?`, answer, wrong, `${a} y ${b}: ${c1} ${info[c1]}, ${c2} ${info[c2]}.`, undefined, `${c1}-${c2}`);
  }
}

// Operaciones con paréntesis.
export function parentheses(r: Rng): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 12);
  const c = r.int(2, 9);
  const forms: [string, number, string][] = [
    [`(${a} + ${b}) × ${c}`, (a + b) * c, `${a} + ${b} = ${a + b}; ${a + b} × ${c}`],
    [`${a} × (${b} + ${c})`, a * (b + c), `${b} + ${c} = ${b + c}; ${a} × ${b + c}`],
    [`${a * b + c + 20} − (${a * b} + ${c})`, 20, `${a * b} + ${c} = ${a * b + c}; ${a * b + c + 20} − ${a * b + c}`],
    [`${a} × (${b + c} − ${c})`, a * b, `${b + c} − ${c} = ${b}; ${a} × ${b}`],
    [`(${a * c} + ${b * c}) ÷ ${c}`, a + b, `${a * c} + ${b * c} = ${(a + b) * c}; ${(a + b) * c} ÷ ${c}`],
    [`${a * b} ÷ (${a + c} − ${c})`, b, `${a + c} − ${c} = ${a}; ${a * b} ÷ ${a}`],
  ];
  const [text, value, steps] = r.pick(forms);
  if (r.chance(0.25)) {
    // ¿Dónde van los paréntesis? Se compara con el valor sin paréntesis.
    const plain = a + b * c;
    return choiceQ(r, `¿Cuál expresión vale ${(a + b) * c}?`, `(${a} + ${b}) × ${c}`, [`${a} + (${b} × ${c})`, `${a} + ${b} + ${c}`, `(${a} × ${b}) + ${c}`].filter((t, i) => [plain, a + b + c, a * b + c][i] !== (a + b) * c), `Primero el paréntesis: ${a} + ${b} = ${a + b}; ${a + b} × ${c} = ${(a + b) * c}.`, undefined, "ubicar");
  }
  return numQ(value, "Resuelve. Primero lo que está entre paréntesis.", `${text} = ?`, `${steps} = ${value}.`, "calcular");
}

// Tabla de entrada y salida con la regla `op k`.
export type IoRule = { op: Op; k: number };
export function ioRule(r: Rng, ops: Op[], maxK = 12): IoRule {
  const op = r.pick(ops);
  return { op, k: op === "+" || op === "−" ? r.int(2, 60) : r.int(2, maxK) };
}
export const ruleText = ({ op, k }: IoRule) => (op === "+" ? `sumar ${k}` : op === "−" ? `restar ${k}` : op === "×" ? `multiplicar por ${k}` : `dividir entre ${k}`);
export function ioInputs(r: Rng, rule: IoRule, count = 4): number[] {
  if (rule.op === "÷") return distinct(r, count, 1, 12).map((q) => q * rule.k);
  if (rule.op === "−") return distinct(r, count, rule.k, rule.k + 80);
  return distinct(r, count, rule.op === "×" ? 1 : 2, rule.op === "×" ? 12 : 90);
}
