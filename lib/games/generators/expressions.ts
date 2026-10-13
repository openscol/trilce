import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, SYMBOLS, choiceQ, fixedQ, fmt, numQ, sym, table, twoNames, yesNo } from "./kit";

// Expresiones numéricas y con variables (5.° en adelante): escribirlas,
// evaluarlas respetando el orden de las operaciones, paréntesis y corchetes.

type Bin = "+" | "−" | "×" | "÷";
const apply = (op: Bin, a: number, b: number) => (op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b);
const OPS: Bin[] = ["+", "−", "×", "÷"];

const ONE_OP: Record<Bin, ((a: number, b: number) => string)[]> = {
  "+": [(a, b) => `la suma de ${a} y ${b}`, (a, b) => `${b} más que ${a}`, (a, b) => `${a} aumentado en ${b}`],
  "−": [(a, b) => `la diferencia entre ${a} y ${b}`, (a, b) => `${b} menos que ${a}`, (a, b) => `${a} disminuido en ${b}`],
  "×": [(a, b) => `el producto de ${a} y ${b}`, (a, b) => `${a} veces ${b}`, (a, b) => `el doble de ${b}`.replace("el doble", a === 2 ? "el doble" : a === 3 ? "el triple" : `${a} veces el valor`)],
  "÷": [(a, b) => `el cociente de ${a} entre ${b}`, (a, b) => `${a} dividido entre ${b}`, (a, b) => `${a} repartido en ${b} partes iguales`],
};

// Operandos sencillos para una operación (la resta y la división salen exactas y positivas).
function pair(r: Rng, op: Bin): [number, number] {
  if (op === "÷") {
    const b = r.int(2, 9);
    return [b * r.int(2, 12), b];
  }
  if (op === "−") {
    const b = r.int(2, 30);
    return [b + r.int(2, 40), b];
  }
  return [r.int(2, op === "×" ? 12 : 60), r.int(2, op === "×" ? 12 : 40)];
}

// 5.° H.1: escribir expresiones numéricas de una operación.
export function writeExpression1(r: Rng): Question {
  const op = r.pick(OPS);
  const [a, b] = pair(r, op);
  const answer = `${a} ${op} ${b}`;
  const wrong = [...OPS.filter((o) => o !== op).map((o) => `${a} ${o} ${b}`), ...(op === "−" || op === "÷" ? [`${b} ${op} ${a}`] : [])];
  return choiceQ(r, `¿Qué expresión representa «${r.pick(ONE_OP[op])(a, b)}»?`, answer, wrong, `Se escribe ${answer} = ${apply(op, a, b)}.`, undefined, op);
}

// 5.° H.2: escribir expresiones numéricas de dos operaciones.
export function writeExpression2(r: Rng): Question {
  const a = r.int(2, 12);
  const b = r.int(2, 12);
  const c = r.int(2, 9);
  const forms: [string, string, string[]][] = [
    [`suma ${a} y ${b}, y luego multiplica el resultado por ${c}`, `(${a} + ${b}) × ${c}`, [`${a} + ${b} × ${c}`, `${a} × ${b} + ${c}`, `(${a} × ${b}) + ${c}`]],
    [`multiplica ${a} por ${b}, y luego suma ${c}`, `${a} × ${b} + ${c}`, [`${a} × (${b} + ${c})`, `(${a} + ${b}) × ${c}`, `${a} + ${b} × ${c}`]],
    [`resta ${b} de ${a + b + c}, y luego multiplica el resultado por ${c}`, `(${a + b + c} − ${b}) × ${c}`, [`${a + b + c} − ${b} × ${c}`, `(${b} − ${a + b + c}) × ${c}`, `${a + b + c} × ${c} − ${b}`]],
    [`divide ${a * c} entre ${c}, y luego suma ${b}`, `${a * c} ÷ ${c} + ${b}`, [`${a * c} ÷ (${c} + ${b})`, `${c} ÷ ${a * c} + ${b}`, `(${a * c} + ${b}) ÷ ${c}`]],
    [`el doble de la suma de ${a} y ${b}`, `2 × (${a} + ${b})`, [`2 × ${a} + ${b}`, `2 + ${a} × ${b}`, `(2 + ${a}) × ${b}`]],
    [`suma ${a} y ${b}, y luego divide el resultado entre ${c}`, `(${a} + ${b}) ÷ ${c}`, [`${a} + ${b} ÷ ${c}`, `${c} ÷ (${a} + ${b})`, `${a} ÷ ${c} + ${b}`]],
  ];
  const [text, answer, wrong] = r.pick(forms);
  return choiceQ(r, `¿Qué expresión representa «${text}»?`, answer, wrong, `Lo que se hace primero va entre paréntesis (o es una multiplicación o división): ${answer}.`);
}

type Expr = { text: string; value: number; steps: string; naive?: number };

// Expresión sin paréntesis donde importa el orden (× y ÷ antes que + y −).
function noParens(r: Rng): Expr {
  const a = r.int(2, 20);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const forms: Expr[] = [
    { text: `${a} + ${b} × ${c}`, value: a + b * c, steps: `${b} × ${c} = ${b * c}; ${a} + ${b * c}`, naive: (a + b) * c },
    { text: `${a + b * c} − ${b} × ${c}`, value: a, steps: `${b} × ${c} = ${b * c}; ${a + b * c} − ${b * c}`, naive: (a + b * c - b) * c },
    { text: `${a} + ${b * c} ÷ ${c}`, value: a + b, steps: `${b * c} ÷ ${c} = ${b}; ${a} + ${b}` },
    { text: `${b} × ${c} + ${a} × 2`, value: b * c + a * 2, steps: `${b} × ${c} = ${b * c}; ${a} × 2 = ${a * 2}; ${b * c} + ${a * 2}`, naive: (b * c + a) * 2 },
    { text: `${a + b} − ${b} + ${c}`, value: a + c, steps: `de izquierda a derecha: ${a + b} − ${b} = ${a}; ${a} + ${c}`, naive: a + b - (b + c) },
    { text: `${a * b} ÷ ${b} × ${c}`, value: a * c, steps: `de izquierda a derecha: ${a * b} ÷ ${b} = ${a}; ${a} × ${c}` },
  ];
  return r.pick(forms);
}

function withParens(r: Rng, brackets: boolean): Expr {
  const a = r.int(2, 12);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const d = r.int(2, 6);
  if (brackets) {
    const forms: Expr[] = [
      { text: `[(${a} + ${b}) × ${c}] − ${d}`, value: (a + b) * c - d, steps: `${a} + ${b} = ${a + b}; ${a + b} × ${c} = ${(a + b) * c}; ${(a + b) * c} − ${d}` },
      { text: `${d} × [${a + b + c} − (${a} + ${b})]`, value: d * c, steps: `${a} + ${b} = ${a + b}; ${a + b + c} − ${a + b} = ${c}; ${d} × ${c}` },
      { text: `[${a} + (${b} × ${c})] × ${d}`, value: (a + b * c) * d, steps: `${b} × ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}; ${a + b * c} × ${d}` },
      { text: `[(${a * d} ÷ ${d}) + ${b}] × ${c}`, value: (a + b) * c, steps: `${a * d} ÷ ${d} = ${a}; ${a} + ${b} = ${a + b}; ${a + b} × ${c}` },
      { text: `${a * c} ÷ [(${b} + ${c}) − ${b}]`, value: a, steps: `${b} + ${c} = ${b + c}; ${b + c} − ${b} = ${c}; ${a * c} ÷ ${c}` },
    ];
    return r.pick(forms);
  }
  const forms: Expr[] = [
    { text: `(${a} + ${b}) × ${c}`, value: (a + b) * c, steps: `${a} + ${b} = ${a + b}; ${a + b} × ${c}`, naive: a + b * c },
    { text: `${a} × (${b} + ${c})`, value: a * (b + c), steps: `${b} + ${c} = ${b + c}; ${a} × ${b + c}`, naive: a * b + c },
    { text: `${a + b + c} − (${a} + ${b})`, value: c, steps: `${a} + ${b} = ${a + b}; ${a + b + c} − ${a + b}`, naive: c + 2 * b },
    { text: `(${a * c} + ${b * c}) ÷ ${c}`, value: a + b, steps: `${a * c} + ${b * c} = ${(a + b) * c}; ${(a + b) * c} ÷ ${c}` },
    { text: `${a} × (${b + c} − ${c}) + ${d}`, value: a * b + d, steps: `${b + c} − ${c} = ${b}; ${a} × ${b} = ${a * b}; ${a * b} + ${d}` },
    { text: `${a * b} ÷ (${a + c} − ${c})`, value: b, steps: `${a + c} − ${c} = ${a}; ${a * b} ÷ ${a}` },
  ];
  return r.pick(forms);
}

// 5.° H.3 / H.4 / H.5: evaluar expresiones numéricas.
export function evaluateExpression(r: Rng, kind: "plain" | "parens" | "brackets"): Question {
  const e = kind === "plain" ? noParens(r) : withParens(r, kind === "brackets");
  const rule = kind === "plain" ? "Primero las multiplicaciones y divisiones; luego las sumas y restas." : kind === "parens" ? "Primero lo que está entre paréntesis." : "Primero los paréntesis, luego los corchetes.";
  return numQ(e.value, "Calcula el valor de la expresión.", `${e.text} = ?`, `${rule} ${e.steps} = ${fmt(e.value)}.`, kind);
}

// 5.° H.6: identificar errores en el orden de las operaciones.
export function orderMistake(r: Rng): Question {
  for (;;) {
    const e = r.chance(0.5) ? noParens(r) : withParens(r, false);
    if (e.naive === undefined || e.naive === e.value || e.naive < 0) continue;
    const name = r.pick(NAMES);
    const good = r.chance(0.4);
    const said = good ? e.value : e.naive;
    return yesNo(`${name} calculó ${e.text} y obtuvo ${fmt(said)}. ¿Respetó el orden de las operaciones?`, good, good ? `Sí: ${e.steps} = ${fmt(e.value)}.` : `No: operó de izquierda a derecha sin respetar el orden. Lo correcto es ${e.steps} = ${fmt(e.value)}.`, e.text);
  }
}

// 5.° H.7: los mismos números con los paréntesis en lugares distintos.
export function parensPlaces(r: Rng): Question {
  for (;;) {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    const c = r.int(2, 6);
    const d = r.int(1, 9);
    const options: [string, number][] = [
      [`(${a} + ${b}) × ${c} + ${d}`, (a + b) * c + d],
      [`${a} + (${b} × ${c}) + ${d}`, a + b * c + d],
      [`${a} + ${b} × (${c} + ${d})`, a + b * (c + d)],
      [`(${a} + ${b}) × (${c} + ${d})`, (a + b) * (c + d)],
    ];
    if (new Set(options.map(([, v]) => v)).size < 4) continue;
    const [text, value] = r.pick(options);
    return fixedQ(`¿Qué expresión vale ${value}?`, options.map(([t]) => t), text, options.map(([t, v]) => `${t} = ${v}`).join("; ") + ".");
  }
}

// 5.° H.8: evaluar expresiones numéricas con fracciones (el resultado es un número natural).
export function fractionExpression(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const n = r.int(1, d - 1);
  const k = r.int(2, 6);
  const a = r.int(1, d * k - 1);
  const b = d * k - a;
  const forms: Expr[] = [
    { text: `${n}/${d} × (${a} + ${b})`, value: n * k, steps: `${a} + ${b} = ${d * k}; ${n}/${d} de ${d * k}` },
    { text: `(${d - n}/${d} + ${n}/${d}) × ${k + a}`, value: k + a, steps: `${d - n}/${d} + ${n}/${d} = 1; 1 × ${k + a}` },
    { text: `${k} × ${d} × 1/${d} + ${a}`, value: k + a, steps: `${k} × ${d} = ${k * d}; ${k * d} × 1/${d} = ${k}; ${k} + ${a}` },
    { text: `${d * k} × ${n}/${d} − ${n}`, value: n * k - n, steps: `${d * k} × ${n}/${d} = ${n * k}; ${n * k} − ${n}` },
  ];
  const e = r.pick(forms);
  return numQ(e.value, "Calcula el valor de la expresión.", `${e.text} = ?`, `${e.steps} = ${e.value}.`);
}

// 5.° H.9: hallar el signo que falta.
export function missingSign(r: Rng): Question {
  for (;;) {
    const op = r.pick(OPS);
    const [a, b] = pair(r, op);
    const value = apply(op, a, b);
    // Solo un signo puede dar ese resultado.
    if (OPS.filter((o) => apply(o, a, b) === value).length !== 1) continue;
    if (r.chance(0.4)) {
      const c = r.int(2, 9);
      const total = op === "×" || op === "÷" ? value + c : value * c;
      const text = op === "×" || op === "÷" ? `${a} ? ${b} + ${c} = ${total}` : `(${a} ? ${b}) × ${c} = ${total}`;
      const fits = OPS.filter((o) => (op === "×" || op === "÷" ? apply(o, a, b) + c : apply(o, a, b) * c) === total);
      if (fits.length !== 1) continue;
      return fixedQ("¿Qué signo falta?", OPS, op, `${text.replace("?", op)}.`, text, op);
    }
    return fixedQ("¿Qué signo falta?", OPS, op, `${a} ${op} ${b} = ${value}.`, `${a} ? ${b} = ${value}`, op);
  }
}

// 5.° H.10: comparar expresiones sin calcularlas.
export function compareExpressions(r: Rng): Question {
  const a = r.int(12, 90);
  const b = r.int(12, 90);
  const k = r.int(2, 9);
  const base = `${a} + ${b}`;
  const form = r.int(0, 3);
  if (form === 0) return numQ(k, "Completa sin calcular las sumas.", `${k} × (${base}) es ? veces ${base}`, `Multiplicar una expresión por ${k} da un resultado ${k} veces mayor.`, "veces");
  if (form === 1) {
    const s = sym((a + b) * k, a + b);
    return fixedQ("Compara sin calcular. Elige el símbolo correcto.", SYMBOLS, s, `Al multiplicar ${base} por ${k} el resultado es mayor.`, `${k} × (${base})  ?  ${base}`, s);
  }
  if (form === 2) {
    const s = sym(a + b, a + b + k);
    return fixedQ("Compara sin calcular. Elige el símbolo correcto.", SYMBOLS, s, `A la derecha se suma ${k} más: es mayor.`, `${base}  ?  ${base} + ${k}`, s);
  }
  const total = (a + b) * k;
  return fixedQ("Compara sin calcular. Elige el símbolo correcto.", SYMBOLS, ">", `Dividir ${fmt(total)} entre 1 lo deja igual; al dividirlo entre ${k} queda más pequeño.`, `${fmt(total)} ÷ 1  ?  ${fmt(total)} ÷ ${k}`, ">");
}

// 5.° H.11: formar el mayor cociente posible.
export function largestQuotient(r: Rng): Question {
  for (;;) {
    const ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b);
    const all: [string, number][] = [];
    for (const d of ds) {
      const rest = ds.filter((x) => x !== d);
      for (const n of [rest[0] * 10 + rest[1], rest[1] * 10 + rest[0]]) all.push([`${n} ÷ ${d}`, n / d]);
    }
    const largest = r.chance(0.7);
    const sorted = [...all].sort((x, y) => (largest ? y[1] - x[1] : x[1] - y[1]));
    if (sorted[0][1] === sorted[1][1]) continue;
    return choiceQ(r, `Con las cifras ${ds.join(", ")} se arma una división ▢▢ ÷ ▢. ¿Cuál tiene el ${largest ? "mayor" : "menor"} cociente?`, sorted[0][0], sorted.slice(1).map(([t]) => t), largest ? "Para el mayor cociente: el dividendo más grande y el divisor más pequeño." : "Para el menor cociente: el dividendo más pequeño y el divisor más grande.", undefined, largest ? "mayor" : "menor");
  }
}

// 5.° I.8: problemas de varios pasos con comparación multiplicativa.
export function compareMultiStep(r: Rng): Question {
  const [n1, n2] = twoNames(r);
  const base = r.int(6, 60);
  const k = r.int(2, 6);
  const thing = r.pick(["stickers", "puntos", "soles", "libros"]);
  const form = r.int(0, 3);
  if (form === 0) return numQ(base + base * k, `${n1} tiene ${base} ${thing}. ${n2} tiene ${k} veces esa cantidad. ¿Cuántos ${thing} tienen entre los dos?`, undefined, `${k} × ${base} = ${base * k}; ${base} + ${base * k} = ${base + base * k}.`, "juntos");
  if (form === 1) return numQ(base * k - base, `${n1} tiene ${base} ${thing}. ${n2} tiene ${k} veces esa cantidad. ¿Cuántos ${thing} más tiene ${n2}?`, undefined, `${k} × ${base} = ${base * k}; ${base * k} − ${base} = ${base * k - base}.`, "diferencia");
  if (form === 2) return numQ(base, `${n1} y ${n2} tienen ${base * (k + 1)} ${thing} entre los dos. ${n2} tiene ${k} veces lo que tiene ${n1}. ¿Cuántos ${thing} tiene ${n1}?`, undefined, `Son ${k + 1} partes iguales: ${base * (k + 1)} ÷ ${k + 1} = ${base}.`, "partes");
  const extra = r.int(3, 30);
  return numQ(base * k + extra, `${n1} tiene ${base} ${thing}. ${n2} tiene ${extra} más que ${k} veces lo de ${n1}. ¿Cuántos ${thing} tiene ${n2}?`, undefined, `${k} × ${base} = ${base * k}; ${base * k} + ${extra} = ${base * k + extra}.`, "veces-y-mas");
}

// 5.° KK.2: comparar dos patrones.
export function comparePatterns(r: Rng): Question {
  const a = r.int(1, 6);
  const k = r.int(2, 5);
  const b = a * k;
  const rows = [0, 1, 2, 3, 4];
  const visual = table(["Patrón A", "Patrón B"], rows.map((i) => [String(i * a), String(i * b)]), `A: sumar ${a} · B: sumar ${b} (los dos empiezan en 0)`);
  const form = r.int(0, 2);
  if (form === 0) return numQ(k, "Cada término del patrón B es ¿cuántas veces el término del patrón A?", visual, `${b} ÷ ${a} = ${k}: cada término de B es ${k} veces el de A.`, "veces");
  const at = r.int(5, 9);
  if (form === 1) return numQ(at * b, `Cuando el patrón A llegue a ${at * a}, ¿qué número tendrá el patrón B en ese mismo lugar?`, visual, `B es ${k} veces A: ${k} × ${at * a} = ${at * b}.`, "siguiente");
  return numQ(at * a, `Cuando el patrón B llegue a ${at * b}, ¿qué número tendrá el patrón A en ese mismo lugar?`, visual, `A es B dividido entre ${k}: ${at * b} ÷ ${k} = ${at * a}.`, "anterior");
}

// ---------------------------------------------------------------------------
// Expresiones con variables

const VAR_TEXT: Record<Bin, ((v: string, k: number) => [string, string])[]> = {
  "+": [(v, k) => [`${k} más que ${v}`, `${v} + ${k}`], (v, k) => [`la suma de ${v} y ${k}`, `${v} + ${k}`]],
  "−": [(v, k) => [`${k} menos que ${v}`, `${v} − ${k}`], (v, k) => [`${v} disminuido en ${k}`, `${v} − ${k}`]],
  "×": [(v, k) => [`${k} veces ${v}`, `${k} × ${v}`], (v, k) => [`el producto de ${k} y ${v}`, `${k} × ${v}`]],
  "÷": [(v, k) => [`${v} dividido entre ${k}`, `${v} ÷ ${k}`], (v, k) => [`el cociente de ${v} entre ${k}`, `${v} ÷ ${k}`]],
};
const allForms = (v: string, k: number) => [`${v} + ${k}`, `${v} − ${k}`, `${k} × ${v}`, `${v} ÷ ${k}`, `${k} − ${v}`, `${k} ÷ ${v}`];

// 5.° MM.1: escribir expresiones con variables.
export function writeVariableExpression(r: Rng): Question {
  const op = r.pick(OPS);
  const v = r.pick(["n", "x", "a", "m", "p"]);
  const k = r.int(2, 15);
  const [text, answer] = r.pick(VAR_TEXT[op])(v, k);
  return choiceQ(r, `¿Qué expresión representa «${text}»?`, answer, allForms(v, k).filter((f) => f !== answer), `«${text}» se escribe ${answer}.`, undefined, op);
}

const VAR_STORIES: [(n: string, k: number) => string, string, Bin][] = [
  [(n, k) => `${n} tiene p stickers y le regalan ${k} más. ¿Qué expresión indica cuántos tiene ahora?`, "p", "+"],
  [(n, k) => `Un libro tiene p páginas y ${n} ya leyó ${k}. ¿Qué expresión indica cuántas le faltan?`, "p", "−"],
  [(n, k) => `Cada entrada cuesta ${k} soles y ${n} compra e entradas. ¿Qué expresión indica cuánto paga?`, "e", "×"],
  [(n, k) => `${n} reparte c caramelos por igual entre ${k} amigos. ¿Qué expresión indica cuántos recibe cada uno?`, "c", "÷"],
  [(_n, k) => `Un taxi cobra ${k} soles por cada kilómetro. ¿Qué expresión indica cuánto cobra por k kilómetros?`, "k", "×"],
  [(n, k) => `${n} tiene m años y su hermano tiene ${k} años menos. ¿Qué expresión indica la edad del hermano?`, "m", "−"],
];

// 5.° MM.2: escribir expresiones con variables en problemas.
export function variableExpressionProblem(r: Rng): Question {
  const [make, v, op] = r.pick(VAR_STORIES);
  const k = r.int(2, 12);
  const answer = op === "×" ? `${k} × ${v}` : `${v} ${op} ${k}`;
  return choiceQ(r, make(r.pick(NAMES), k), answer, allForms(v, k).filter((f) => f !== answer), `La cantidad desconocida es ${v}: la expresión es ${answer}.`, undefined, op);
}

// 5.° MM.3: evaluar expresiones con variables.
export function evaluateVariable(r: Rng): Question {
  const v = r.pick(["n", "x", "a", "m"]);
  const x = r.int(2, 12);
  const k = r.int(2, 9);
  const c = r.int(1, 20);
  const forms: [string, number, string][] = [
    [`${k} × ${v} + ${c}`, k * x + c, `${k} × ${x} + ${c}`],
    [`${v} + ${c}`, x + c, `${x} + ${c}`],
    [`${k * x + c} − ${k} × ${v}`, c, `${k * x + c} − ${k} × ${x}`],
    [`${k} × (${v} + ${c})`, k * (x + c), `${k} × (${x} + ${c})`],
    [`${v} × ${v}`, x * x, `${x} × ${x}`],
    [`${x * k} ÷ ${v} + ${c}`, k + c, `${x * k} ÷ ${x} + ${c}`],
  ];
  const [text, value, sub] = r.pick(forms);
  return numQ(value, `Calcula el valor de la expresión cuando ${v} = ${x}.`, text, `Reemplazamos ${v} por ${x}: ${sub} = ${value}.`);
}

// 5.° MM.4: escribir ecuaciones con variables para problemas.
export function variableEquationProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const k = r.int(2, 12);
  const t = r.int(20, 96);
  const forms: [string, string, string[]][] = [
    [`${n} compra ${k} cuadernos iguales y paga ${k * 4} soles. Si c es el precio de cada cuaderno, ¿qué ecuación lo representa?`, `${k} × c = ${k * 4}`, [`c + ${k} = ${k * 4}`, `c ÷ ${k} = ${k * 4}`, `c − ${k} = ${k * 4}`]],
    [`${n} tenía a soles, gastó ${k} y le quedan ${t}. ¿Qué ecuación lo representa?`, `a − ${k} = ${t}`, [`a + ${k} = ${t}`, `${k} − a = ${t}`, `a × ${k} = ${t}`]],
    [`${n} tenía ${t} figuritas, consiguió f más y ahora tiene ${t + k}. ¿Qué ecuación lo representa?`, `${t} + f = ${t + k}`, [`${t} − f = ${t + k}`, `${t} × f = ${t + k}`, `f − ${t} = ${t + k}`]],
    [`Se reparten g galletas por igual entre ${k} niños y a cada uno le tocan 6. ¿Qué ecuación lo representa?`, `g ÷ ${k} = 6`, [`g × ${k} = 6`, `g − ${k} = 6`, `${k} ÷ g = 6`]],
  ];
  const [text, answer, wrong] = r.pick(forms);
  return choiceQ(r, text, answer, wrong, `La ecuación es ${answer}.`);
}

export type Rule2 = { m: number; b: number };
// Regla y = m·x + b con números pequeños (para tablas y gráficos).
export function rule2(r: Rng, maxM = 4, maxB = 5): Rule2 {
  const m = r.int(1, maxM);
  return { m, b: m === 1 ? r.int(1, maxB) : r.int(0, maxB) };
}
export const ruleEq = ({ m, b }: Rule2) => `y = ${m === 1 ? "x" : `${m} × x`}${b ? ` + ${b}` : ""}`;
export const ruleY = ({ m, b }: Rule2, x: number) => m * x + b;

// 5.° MM.5: hallar un valor con una ecuación de dos variables.
export function twoVariableValue(r: Rng): Question {
  const rule = rule2(r, 9, 20);
  const x = r.int(1, 12);
  if (r.chance(0.7)) return numQ(ruleY(rule, x), `Usa la ecuación. ¿Cuánto vale y cuando x = ${x}?`, ruleEq(rule), `${ruleEq(rule).replace("x", String(x))} = ${ruleY(rule, x)}.`, "hallar-y");
  return numQ(x, `Usa la ecuación. ¿Cuánto vale x cuando y = ${ruleY(rule, x)}?`, ruleEq(rule), `Con x = ${x}: ${ruleEq(rule).replace("x", String(x))} = ${ruleY(rule, x)}.`, "hallar-x");
}

// 5.° MM.6: completar la tabla de una relación de dos variables.
export function twoVariableTable(r: Rng): Question {
  const rule = rule2(r, 6, 12);
  const start = r.int(0, 4);
  const xs = [start, start + 1, start + 2, start + 3];
  const hidden = r.int(1, 3);
  return numQ(ruleY(rule, xs[hidden]), "Completa la tabla usando la ecuación.", table(["x", "y"], xs.map((x, i) => [String(x), i === hidden ? "?" : String(ruleY(rule, x))]), ruleEq(rule)), `${ruleEq(rule).replace("x", String(xs[hidden]))} = ${ruleY(rule, xs[hidden])}.`);
}
