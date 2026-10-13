import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, choiceQ, d3, decQ, distinct, fixedQ, fmt, fracQ, fshow, gcd, intQ, multiQ, numQ, sg, table, yesNo } from "./kit";
import { type Rule2, ruleY } from "./expressions";

// Álgebra de 6.° en adelante: expresiones con variables, expresiones
// equivalentes, ecuaciones e inecuaciones de un paso y ecuaciones de dos
// variables. Se escribe 3x (sin signo ×) como en los textos de secundaria.

// Sin «y» ni «a»: en una frase se confunden con la conjunción y la preposición.
const VARS = ["x", "n", "m", "p", "t", "k"];
// 3x, x, 0 → "3x", "x", ""
const term = (k: number, v: string) => (k === 1 ? v : `${k}${v}`);
// kx + c con c ≥ 0
const lin = (k: number, v: string, c: number) => (c === 0 ? term(k, v) : `${term(k, v)} + ${c}`);

// 6.° Y.2: escribir expresiones con variables de dos operaciones.
export function writeVariableExpression2(r: Rng): Question {
  const v = r.pick(VARS);
  const k = r.int(2, 9);
  const c = r.int(1, 12);
  const forms: [string, string, string[]][] = [
    [`${c} más que ${k} veces ${v}`, `${k}${v} + ${c}`, [`${k}(${v} + ${c})`, `${c}${v} + ${k}`, `${k}${v} − ${c}`]],
    [`${c} menos que ${k} veces ${v}`, `${k}${v} − ${c}`, [`${c} − ${k}${v}`, `${k}(${v} − ${c})`, `${k}${v} + ${c}`]],
    [`${k} veces la suma de ${v} y ${c}`, `${k}(${v} + ${c})`, [`${k}${v} + ${c}`, `${v} + ${k * c}`, `${k} + ${v} + ${c}`]],
    [`la mitad de ${v}, aumentada en ${c}`, `${v} ÷ 2 + ${c}`, [`(${v} + ${c}) ÷ 2`, `2${v} + ${c}`, `${v} ÷ ${c} + 2`]],
    [`el doble de ${v}, disminuido en ${c}`, `2${v} − ${c}`, [`2(${v} − ${c})`, `${c} − 2${v}`, `${v} ÷ 2 − ${c}`]],
    [`${k} veces la diferencia entre ${v} y ${c}`, `${k}(${v} − ${c})`, [`${k}${v} − ${c}`, `${k}(${c} − ${v})`, `${v} − ${k * c}`]],
  ];
  const [text, answer, wrong] = r.pick(forms);
  return choiceQ(r, `¿Qué expresión representa «${text}»?`, answer, wrong, `«${text}» se escribe ${answer}.`);
}

// 6.° Y.5: evaluar expresiones con varias variables.
export function evaluateMultiVariable(r: Rng): Question {
  const [a, b] = [r.int(2, 9), r.int(2, 9)];
  const [x, y] = [r.int(1, 10), r.int(1, 10)];
  const forms: [string, number, string][] = [
    [`${a}x + ${b}y`, a * x + b * y, `${a} × ${x} + ${b} × ${y}`],
    [`xy + ${a}`, x * y + a, `${x} × ${y} + ${a}`],
    [`${a}(x + y)`, a * (x + y), `${a} × (${x} + ${y})`],
    [`${a}x + y − ${Math.min(a, y)}`, a * x + y - Math.min(a, y), `${a} × ${x} + ${y} − ${Math.min(a, y)}`],
    [`x² + ${b}y`, x * x + b * y, `${x} × ${x} + ${b} × ${y}`],
  ];
  const [text, value, sub] = r.pick(forms);
  return numQ(value, `Calcula el valor de la expresión cuando x = ${x} e y = ${y}.`, text, `${sub} = ${fmt(value)}.`);
}

// 6.° Y.6: evaluar expresiones con decimales, fracciones y números mixtos.
export function evaluateWithDecimals(r: Rng): Question {
  const v = r.pick(VARS);
  if (r.chance(0.5)) {
    const x = r.int(11, 99) * 100; // décimos, en milésimos
    const k = r.int(2, 9);
    const c = r.int(1, 99) * 100;
    return decQ(r, `Calcula el valor de la expresión cuando ${v} = ${d3(x)}.`, k * x + c, `${k} × ${d3(x)} + ${d3(c)} = ${d3(k * x)} + ${d3(c)} = ${d3(k * x + c)}.`, `${k}${v} + ${d3(c)}`, "decimales");
  }
  const d = r.pick([2, 3, 4, 5]);
  const x: Frac = [r.int(1, 2 * d - 1), d];
  const k = r.int(2, 6);
  const c: Frac = [r.int(1, d - 1), d];
  const value: Frac = [k * x[0] + c[0], d];
  return fracQ(r, `Calcula el valor de la expresión cuando ${v} = ${fshow(x)}.`, value, `${k} × ${fshow(x)} + ${c[0]}/${d} = ${fshow([k * x[0], d])} + ${c[0]}/${d} = ${fshow(value)}.`, `${k}${v} + ${c[0]}/${d}`, "fracciones");
}

// 6.° Y.7: evaluar expresiones con variables en problemas.
export function evaluateVariableProblem(r: Rng): Question {
  const k = r.int(2, 15);
  const c = r.int(5, 60);
  const x = r.int(2, 12);
  const cases: [string, string, string][] = [
    [`Un taxi cobra ${c} soles fijos más ${k} soles por kilómetro: el costo es ${k}k + ${c}. ¿Cuánto cuesta un viaje de ${x} km?`, "k", "soles"],
    [`Un gimnasio cobra ${c} soles de inscripción y ${k} soles por mes: el total es ${k}m + ${c}. ¿Cuánto se paga por ${x} meses?`, "m", "soles"],
    [`${r.pick(NAMES)} tiene ${c} figuritas y compra ${k} cada semana: tendrá ${k}s + ${c}. ¿Cuántas tendrá en ${x} semanas?`, "s", "figuritas"],
    [`El perímetro de un rectángulo de largo l y ancho ${c} es 2l + ${2 * c}. ¿Cuál es el perímetro si l = ${x * k}?`, "l", "unidades"],
  ];
  const [text, v] = r.pick(cases);
  const isRect = v === "l";
  const value = isRect ? 2 * x * k + 2 * c : k * x + c;
  return numQ(value, text, undefined, isRect ? `2 × ${x * k} + ${2 * c} = ${value}.` : `${k} × ${x} + ${c} = ${value}.`);
}

// 6.° Y.8: identificar términos y coeficientes.
export function termsCoefficients(r: Rng): Question {
  const [v, w] = r.shuffle(VARS).slice(0, 2);
  const [a, b, c] = [r.int(2, 12), r.int(2, 12), r.int(1, 20)];
  const expr = `${a}${v} + ${b}${w} + ${c}`;
  const form = r.int(0, 3);
  if (form === 0) return numQ(3, `¿Cuántos términos tiene la expresión ${expr}?`, expr, `Los términos se separan con + o −: ${a}${v}, ${b}${w} y ${c}.`, "contar-terminos");
  if (form === 1) return numQ(a, `En la expresión ${expr}, ¿cuál es el coeficiente de ${v}?`, expr, `El coeficiente es el número que multiplica a la variable: en ${a}${v} es ${a}.`, "coeficiente");
  if (form === 2) return numQ(c, `En la expresión ${expr}, ¿cuál es el término constante (el que no tiene variable)?`, expr, `El término sin variable es ${c}.`, "constante");
  return choiceQ(r, `En la expresión ${expr}, ¿cuál de estos es un término?`, `${b}${w}`, [`${a}`, `${w}`, `${v} + ${b}`, `${a}${v} + ${b}`], `Los términos son ${a}${v}, ${b}${w} y ${c}.`, expr, "identificar-termino");
}

// 6.° Y.9: identificar los factores de una expresión con variables.
export function factorsOfVariableExpression(r: Rng): Question {
  const v = r.pick(VARS);
  const [a, c] = distinct(r, 2, 2, 9);
  const expr = `${a}(${v} + ${c})`;
  const good = [String(a), `(${v} + ${c})`];
  return multiQ(`En la expresión ${expr}, ¿cuáles son los factores? Selecciona todos.`, r.shuffle([...good, v, String(c), `${a}${v}`]), good, `Los factores son lo que se multiplica: ${a} y (${v} + ${c}). ${v} y ${c} son sumandos.`);
}

// ---------------------------------------------------------------------------
// Expresiones equivalentes

// 6.° Z.1 / AA.7: una tira con partes x y un número → la expresión (o ecuación) que representa.
export function stripExpression(r: Rng, asEquation = false, solveOnly = false): Question {
  const v = "x";
  const k = r.int(1, 4);
  const c = r.int(1, 12);
  const x = r.int(2, 12);
  const total = k * x + c;
  const visual: Visual = { kind: "strip", total: asEquation ? String(total) : undefined, bars: [{ parts: [...Array.from({ length: k }, () => ({ text: v, w: 2 })), { text: String(c), w: 2 }] }] };
  if (asEquation) {
    if (solveOnly || r.chance(0.5)) return numQ(x, "La tira de arriba y la de abajo miden lo mismo. ¿Cuánto vale x?", visual, `${lin(k, v, c)} = ${total}; ${term(k, v)} = ${total - c}; x = ${x}.`, "resolver");
    return choiceQ(r, "¿Qué ecuación representa el diagrama?", `${lin(k, v, c)} = ${total}`, [`${lin(k, v, total)} = ${c}`, `${term(k + 1, v)} = ${total + c}`, `${term(c, v)} + ${k} = ${total}`, `${term(k, v)} = ${total + c}`], `Hay ${k} ${k === 1 ? "parte" : "partes"} x y una parte de ${c}; todo junto mide ${total}.`, visual, "escribir");
  }
  return choiceQ(r, "¿Qué expresión representa la tira completa?", lin(k, v, c), [`${term(k + c, v)}`, `${term(c, v)} + ${k}`, `${term(k, v)} × ${c}`, `${v} + ${k + c}`].filter((w) => w !== lin(k, v, c)), `Hay ${k} ${k === 1 ? "parte" : "partes"} x y una parte de ${c}: ${lin(k, v, c)}.`, visual);
}

const PROPERTIES: [(a: string, b: string, c: string) => string, string][] = [
  [(a, b) => `${a} + ${b} = ${b} + ${a}`, "Conmutativa de la suma"],
  [(a, b, c) => `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, "Asociativa de la suma"],
  [(a) => `${a} + 0 = ${a}`, "Elemento neutro de la suma"],
  [(a, b) => `${a} × ${b} = ${b} × ${a}`, "Conmutativa de la multiplicación"],
  [(a, b, c) => `(${a} × ${b}) × ${c} = ${a} × (${b} × ${c})`, "Asociativa de la multiplicación"],
  [(a) => `${a} × 1 = ${a}`, "Elemento neutro de la multiplicación"],
  [(a, b, c) => `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`, "Distributiva"],
  [(a) => `${a} × 0 = 0`, "Propiedad del cero"],
];

// 6.° Z.2 / Z.3: propiedades de la suma y de la multiplicación (con variables).
export function namedProperty(r: Rng, of: "suma" | "multiplicacion"): Question {
  const pool = of === "suma" ? PROPERTIES.slice(0, 3) : PROPERTIES.slice(3);
  const [make, name] = r.pick(pool);
  const [a, b, c] = r.chance(0.5) ? r.shuffle(["a", "b", "c", "x", "y"]).slice(0, 3) : [String(r.int(2, 20)), r.pick(VARS), String(r.int(2, 20))];
  return fixedQ("¿Qué propiedad muestra esta igualdad?", pool.map(([, n]) => n), name, `Es la propiedad: ${name.toLowerCase()}.`, make(a, b, c), name.toLowerCase());
}

// Coeficiente común y binomio: k(ax + b) con a y b sin factor común.
function factored(r: Rng): { k: number; a: number; b: number; v: string } {
  for (;;) {
    const a = r.int(1, 6);
    const b = r.int(1, 9);
    if (gcd(a, b) !== 1) continue;
    return { k: r.int(2, 9), a, b, v: r.pick(VARS) };
  }
}

// 6.° Z.4 / Z.5: multiplicar usando la propiedad distributiva (`model`: con modelo de área).
export function distribute(r: Rng, model: boolean): Question {
  const { k, a, b, v } = factored(r);
  const inner = lin(a, v, b);
  const answer = `${term(k * a, v)} + ${k * b}`;
  const wrong = [`${term(k * a, v)} + ${b}`, `${term(a, v)} + ${k * b}`, `${term(k + a, v)} + ${k + b}`, `${term(k * a * b, v)}`];
  const visual: Visual | undefined = model ? { kind: "areaModel", side: [String(k)], top: [term(a, v), String(b)], cells: [["?", "?"]] } : undefined;
  return choiceQ(r, model ? `El modelo de área muestra ${k}(${inner}). ¿Qué expresión es igual?` : `Aplica la propiedad distributiva: ${k}(${inner})`, answer, wrong.filter((w) => w !== answer), `${k} × ${term(a, v)} = ${term(k * a, v)} y ${k} × ${b} = ${k * b}: ${answer}.`, visual, model ? "modelo" : "expresion");
}

// 6.° Z.6: factorizar expresiones numéricas con la propiedad distributiva.
export function factorNumeric(r: Rng): Question {
  for (;;) {
    const k = r.int(2, 12);
    const [a, b] = [r.int(1, 9), r.int(1, 9)];
    if (gcd(a, b) !== 1 || a === b) continue;
    if (r.chance(0.5)) return numQ(a, "Completa usando el mayor factor común.", `${k * a} + ${k * b} = ${k}(? + ${b})`, `${k * a} = ${k} × ${a} y ${k * b} = ${k} × ${b}: ${k}(${a} + ${b}).`, "completar");
    return choiceQ(r, `Factoriza ${k * a} + ${k * b} usando el mayor factor común.`, `${k}(${a} + ${b})`, [`${k}(${a} + ${k * b})`, `${a}(${k} + ${b})`, `${k + 1}(${a} + ${b})`, `${k}(${a * b})`], `El mayor factor común de ${k * a} y ${k * b} es ${k}: ${k}(${a} + ${b}).`, undefined, "elegir");
  }
}

// 6.° Z.7 / Z.8: factorizar expresiones con variables (`model`: con modelo de área).
export function factorVariable(r: Rng, model: boolean): Question {
  const { k, a, b, v } = factored(r);
  const expanded = `${term(k * a, v)} + ${k * b}`;
  const answer = `${k}(${lin(a, v, b)})`;
  const visual: Visual | undefined = model ? { kind: "areaModel", side: ["?"], top: ["?", "?"], cells: [[term(k * a, v), String(k * b)]] } : undefined;
  const wrong = [`${k}(${lin(a, v, k * b)})`, `${term(k, v)}(${a} + ${b})`, `${k * a}(${v} + ${b})`, `${k}(${lin(k * a, v, b)})`];
  return choiceQ(r, model ? `El modelo de área tiene un área total de ${expanded}. ¿Qué producto representa (lado × lado)?` : `Factoriza ${expanded} usando el mayor factor común.`, answer, wrong.filter((w) => w !== answer), `El mayor factor común de ${k * a} y ${k * b} es ${k}: ${answer}.`, visual, model ? "modelo" : "expresion");
}

// 6.° Z.9: hallar el valor de una variable usando las propiedades de la multiplicación.
export function solveWithProperties(r: Rng): Question {
  const [a, b, c] = [r.int(2, 12), r.int(2, 12), r.int(2, 12)];
  const v = r.pick(VARS);
  const forms: [string, number, string][] = [
    [`${a} × ${v} = ${b} × ${a}`, b, "Propiedad conmutativa: los factores son los mismos en otro orden."],
    [`(${a} × ${b}) × ${v} = ${a} × (${b} × ${c})`, c, "Propiedad asociativa: solo cambia cómo se agrupan los factores."],
    [`${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${v}`, c, "Propiedad distributiva: el factor multiplica a cada sumando."],
    [`${a * b} × ${v} = ${a * b}`, 1, "Elemento neutro: multiplicar por 1 no cambia el número."],
    [`${a} × ${v} = 0`, 0, "Si un producto es 0, uno de sus factores es 0."],
  ];
  const [text, answer, why] = r.pick(forms);
  return numQ(answer, `¿Cuánto vale ${v}?`, text, `${why} ${v} = ${answer}.`);
}

// 6.° Z.10: escribir expresiones equivalentes usando las propiedades.
export function equivalentByProperty(r: Rng): Question {
  const { k, a, b, v } = factored(r);
  const c = r.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== a + 1 && n !== b && n !== k));
  const forms: [string, string, string[], string][] = [
    [`Usa la propiedad conmutativa para reescribir ${term(a + 1, v)} + ${c}.`, `${c} + ${term(a + 1, v)}`, [`${term(c, v)} + ${a + 1}`, `${term(a + 1 + c, v)}`, `${a + 1}(${v} + ${c})`], "Conmutar es cambiar el orden de los sumandos."],
    [`Usa la propiedad distributiva para reescribir ${k}(${lin(a, v, b)}).`, `${term(k * a, v)} + ${k * b}`, [`${term(k * a, v)} + ${b}`, `${term(k + a, v)} + ${k + b}`, `${term(a, v)} + ${k * b}`], "Distribuir es multiplicar el factor por cada sumando."],
    [`Usa la propiedad asociativa para reescribir (${v} + ${b}) + ${c}.`, `${v} + (${b} + ${c})`, [`(${v} + ${c}) × ${b}`, `${v}(${b} + ${c})`, `${term(b, v)} + ${c}`], "Asociar es cambiar cómo se agrupan los sumandos."],
    [`Usa la propiedad conmutativa para reescribir ${k} × ${v} × ${c}.`, `${k} × ${c} × ${v}`, [`${k} + ${c} + ${v}`, `${term(k, v)} + ${c}`, `${k}(${v} + ${c})`], "Conmutar es cambiar el orden de los factores."],
  ];
  const [prompt, answer, wrong, why] = r.pick(forms);
  return choiceQ(r, prompt, answer, wrong, `${why} Resultado: ${answer}.`);
}

// 6.° Z.11: sumar y restar términos semejantes.
export function likeTerms(r: Rng): Question {
  const v = r.pick(VARS);
  const [a, b, c] = [r.int(2, 12), r.int(1, 9), r.int(1, 12)];
  const forms: [string, string, string[], string][] = [
    [`${a}${v} + ${term(b, v)}`, term(a + b, v), [`${a + b}${v}²`, term(a * b, v), `${a + b}`], `${a} + ${b} = ${a + b}`],
    [`${a + b}${v} − ${term(b, v)}`, term(a, v), [`${a}`, term(a + 2 * b, v), `${a}${v}²`], `${a + b} − ${b} = ${a}`],
    [`${a}${v} + ${c} + ${term(b, v)}`, `${a + b}${v} + ${c}`, [`${a + b + c}${v}`, `${a + b}${v}² + ${c}`, `${a}${v} + ${b + c}`], `${a} + ${b} = ${a + b}; el ${c} no tiene ${v}, queda aparte`],
    [`${a}${v} + ${term(b, v)} + ${term(c, v)}`, term(a + b + c, v), [term(a * b * c, v), `${a + b + c}${v}³`, `${a + b}${v} + ${c}`], `${a} + ${b} + ${c} = ${a + b + c}`],
  ];
  const [expr, answer, wrong, why] = r.pick(forms);
  return choiceQ(r, `Simplifica juntando los términos semejantes: ${expr}`, answer, wrong.filter((w) => w !== answer), `${why}: ${answer}.`);
}

// 6.° Z.12 / Z.13: identificar expresiones equivalentes.
export function equivalentExpressions(r: Rng, chooseAll: boolean): Question {
  const { k, a, b, v } = factored(r);
  const base = `${k}(${lin(a, v, b)})`;
  const good = [`${term(k * a, v)} + ${k * b}`, `${k * b} + ${term(k * a, v)}`, `(${lin(a, v, b)}) × ${k}`];
  const bad = [`${term(k * a, v)} + ${b}`, `${term(a, v)} + ${k * b}`, `${term(k + a, v)} + ${k + b}`, `${term(k * a + k * b, v)}`];
  if (chooseAll) {
    const picked = r.shuffle(good).slice(0, r.int(1, 2));
    return multiQ(`Selecciona todas las expresiones equivalentes a ${base}.`, r.shuffle([...picked, ...r.shuffle(bad).slice(0, 4 - picked.length)]), picked, `${base} = ${good[0]}; cambiar el orden no cambia el valor.`, undefined, "seleccionar");
  }
  const yes = r.chance(0.5);
  const other = yes ? r.pick(good) : r.pick(bad);
  return yesNo(`¿${base} y ${other} son expresiones equivalentes?`, yes, `${base} = ${good[0]}.`, undefined, yes ? "si" : "no");
}

// ---------------------------------------------------------------------------
// Ecuaciones de una variable

type Eq = { text: string; x: number; v: string; steps: string; op: string };
function oneStep(r: Rng, ops: string[] = ["+", "−", "×", "÷"], max = 60): Eq {
  const op = r.pick(ops);
  const v = r.pick(VARS);
  if (op === "+") {
    const [x, b] = [r.int(1, max), r.int(1, max)];
    return { text: `${v} + ${b} = ${x + b}`, x, v, steps: `${v} = ${x + b} − ${b} = ${x}`, op };
  }
  if (op === "−") {
    const [x, b] = [r.int(2, max), r.int(1, max)];
    return { text: `${v} − ${b} = ${x}`, x: x + b, v, steps: `${v} = ${x} + ${b} = ${x + b}`, op };
  }
  const [x, k] = [r.int(2, 12), r.int(2, 12)];
  if (op === "×") return { text: `${k}${v} = ${k * x}`, x, v, steps: `${v} = ${k * x} ÷ ${k} = ${x}`, op };
  return { text: `${v} ÷ ${k} = ${x}`, x: x * k, v, steps: `${v} = ${x} × ${k} = ${x * k}`, op };
}

// 6.° AA.1 / AA.2: ¿x cumple la ecuación? / ¿qué x la cumple?
export function satisfiesEquation(r: Rng, choose: boolean): Question {
  const e = oneStep(r);
  if (choose) return choiceQ(r, `¿Qué valor de ${e.v} cumple la ecuación ${e.text}?`, String(e.x), [e.x + 1, e.x - 1, e.x + 2, e.x * 2, Math.max(1, e.x - 3)].filter((n) => n !== e.x && n > 0).map(String), `${e.steps}.`, e.text, e.op);
  const yes = r.chance(0.5);
  const value = yes ? e.x : ((n: number) => (n < 0 || n === e.x ? e.x + 3 : n))(e.x + r.pick([-2, -1, 1, 2, 3]));
  return yesNo(`¿${e.v} = ${value} cumple la ecuación ${e.text}?`, yes, yes ? `Sí: al reemplazar ${e.v} por ${value}, los dos lados son iguales.` : `No: la solución es ${e.v} = ${e.x}.`, e.text, e.op);
}

// 6.° AA.3: escribir una ecuación a partir de una frase.
export function equationFromWords(r: Rng): Question {
  const v = r.pick(VARS);
  const [k, t] = [r.int(2, 12), r.int(13, 60)];
  const forms: [string, string, string[]][] = [
    [`${k} más que ${v} es ${t}`, `${v} + ${k} = ${t}`, [`${v} − ${k} = ${t}`, `${k}${v} = ${t}`, `${v} + ${t} = ${k}`]],
    [`${k} menos que ${v} es ${t}`, `${v} − ${k} = ${t}`, [`${k} − ${v} = ${t}`, `${v} + ${k} = ${t}`, `${v} ÷ ${k} = ${t}`]],
    [`el producto de ${k} y ${v} es ${t}`, `${k}${v} = ${t}`, [`${v} + ${k} = ${t}`, `${v} ÷ ${k} = ${t}`, `${t}${v} = ${k}`]],
    [`${v} dividido entre ${k} es ${t}`, `${v} ÷ ${k} = ${t}`, [`${k} ÷ ${v} = ${t}`, `${k}${v} = ${t}`, `${v} − ${k} = ${t}`]],
    [`la suma de ${v} y ${k} es igual a ${t}`, `${v} + ${k} = ${t}`, [`${k}${v} = ${t}`, `${v} − ${k} = ${t}`, `${v} = ${t} + ${k}`]],
  ];
  const [text, answer, wrong] = r.pick(forms);
  return choiceQ(r, `¿Qué ecuación representa «${text}»?`, answer, wrong, `«${text}» se escribe ${answer}.`);
}

// 6.° AA.4: identificar expresiones y ecuaciones.
export function expressionOrEquation(r: Rng): Question {
  const v = r.pick(VARS);
  const [a, b] = [r.int(2, 12), r.int(2, 30)];
  const isEquation = r.chance(0.5);
  const text = isEquation ? r.pick([`${a}${v} + ${b} = ${a * 3 + b}`, `${v} − ${b} = ${a}`, `${a * b} = ${a}${v}`, `${v} ÷ ${a} = ${b}`]) : r.pick([`${a}${v} + ${b}`, `${a}(${v} − ${b})`, `${v} ÷ ${a} + ${b}`, `${a * b} − ${v}`]);
  return fixedQ("¿Es una expresión o una ecuación?", ["Expresión", "Ecuación"], isEquation ? "Ecuación" : "Expresión", "Una ecuación tiene el signo = y afirma que dos cantidades son iguales; una expresión no lo tiene.", text, isEquation ? "ecuacion" : "expresion");
}

// 6.° AA.5: representar y resolver ecuaciones con fichas (🟩 = x, 🟨 = 1).
export function algebraTiles(r: Rng): Question {
  const k = r.int(1, 3);
  const c = r.int(0, 5);
  const x = r.int(1, 5);
  const total = k * x + c;
  if (total > 16) return algebraTiles(r);
  return numQ(x, "Cada 🟩 vale x y cada 🟨 vale 1. Los dos lados valen lo mismo. ¿Cuánto vale x?", `${"🟩".repeat(k)} ${"🟨".repeat(c)}   =   ${"🟨".repeat(total)}`, `${lin(k, "x", c)} = ${total}${c ? `; se quitan ${c} de cada lado: ${term(k, "x")} = ${k * x}` : ""}${k > 1 ? `; se reparte en ${k}: x = ${x}` : ""}.`, `${k}x`);
}

// 6.° AA.8 – AA.10: resolver ecuaciones de un paso con números naturales.
export function solveOneStep(r: Rng, ops: string[]): Question {
  const e = oneStep(r, ops, 200);
  return numQ(e.x, `Resuelve. ¿Cuánto vale ${e.v}?`, e.text, `${e.steps}.`, e.op);
}

// 6.° AA.11 – AA.13: resolver ecuaciones de un paso con decimales y fracciones.
export function solveOneStepRational(r: Rng, ops: ("+" | "−" | "×" | "÷")[]): Question {
  const op = r.pick(ops);
  const v = r.pick(VARS);
  if (r.chance(0.5)) {
    // Decimales (en milésimos).
    const x = r.int(11, 99) * 100;
    if (op === "+" || op === "−") {
      const b = r.int(11, 99) * 100;
      return op === "+" ? decQ(r, `Resuelve. ¿Cuánto vale ${v}?`, x, `${v} = ${d3(x + b)} − ${d3(b)} = ${d3(x)}.`, `${v} + ${d3(b)} = ${d3(x + b)}`, "decimal-suma", [x + 2 * b]) : decQ(r, `Resuelve. ¿Cuánto vale ${v}?`, x + b, `${v} = ${d3(x)} + ${d3(b)} = ${d3(x + b)}.`, `${v} − ${d3(b)} = ${d3(x)}`, "decimal-resta", [Math.abs(x - b) || 100]);
    }
    const k = r.int(2, 9);
    return op === "×" ? decQ(r, `Resuelve. ¿Cuánto vale ${v}?`, x, `${v} = ${d3(k * x)} ÷ ${k} = ${d3(x)}.`, `${k}${v} = ${d3(k * x)}`, "decimal-multiplicacion", [k * x * k, x * 10]) : decQ(r, `Resuelve. ¿Cuánto vale ${v}?`, k * x, `${v} = ${d3(x)} × ${k} = ${d3(k * x)}.`, `${v} ÷ ${k} = ${d3(x)}`, "decimal-division", [x, (x * 10) / k].filter(Number.isInteger));
  }
  const d = r.pick([2, 3, 4, 5, 6, 8]);
  const x: Frac = [r.int(1, 2 * d - 1), d];
  if (op === "+" || op === "−") {
    const b: Frac = [r.int(1, d - 1), d];
    const sum: Frac = [x[0] + b[0], d];
    return op === "+" ? fracQ(r, `Resuelve. ¿Cuánto vale ${v}?`, x, `${v} = ${fshow(sum)} − ${b[0]}/${d} = ${fshow(x)}.`, `${v} + ${b[0]}/${d} = ${fshow(sum)}`, "fraccion-suma", [[sum[0] + b[0], d]]) : fracQ(r, `Resuelve. ¿Cuánto vale ${v}?`, sum, `${v} = ${fshow(x)} + ${b[0]}/${d} = ${fshow(sum)}.`, `${v} − ${b[0]}/${d} = ${fshow(x)}`, "fraccion-resta", [[Math.abs(x[0] - b[0]) || 1, d]]);
  }
  const k = r.int(2, 6);
  return op === "×" ? fracQ(r, `Resuelve. ¿Cuánto vale ${v}?`, x, `${v} = ${fshow([k * x[0], d])} ÷ ${k} = ${fshow(x)}.`, `${k}${v} = ${fshow([k * x[0], d])}`, "fraccion-multiplicacion", [[k * k * x[0], d]]) : fracQ(r, `Resuelve. ¿Cuánto vale ${v}?`, [k * x[0], d], `${v} = ${fshow(x)} × ${k} = ${fshow([k * x[0], d])}.`, `${v} ÷ ${k} = ${fshow(x)}`, "fraccion-division", [[x[0], d * k]]);
}

type Story = { text: string; equation: string; x: number; wrong: string[] };
function equationStory(r: Rng, ops: string[]): Story {
  const op = r.pick(ops);
  const name = r.pick(NAMES);
  if (op === "+") {
    const [x, b] = [r.int(5, 60), r.int(5, 60)];
    return { text: `${name} tenía algunas figuritas. Le regalaron ${b} y ahora tiene ${x + b}. ¿Cuántas tenía?`, equation: `x + ${b} = ${x + b}`, x, wrong: [`x − ${b} = ${x + b}`, `${b}x = ${x + b}`, `x + ${x + b} = ${b}`] };
  }
  if (op === "−") {
    const [left, b] = [r.int(5, 60), r.int(5, 60)];
    return { text: `${name} tenía algo de dinero. Gastó ${b} soles y le quedan ${left}. ¿Cuánto tenía?`, equation: `x − ${b} = ${left}`, x: left + b, wrong: [`x + ${b} = ${left}`, `${b} − x = ${left}`, `x ÷ ${b} = ${left}`] };
  }
  const [x, k] = [r.int(2, 15), r.int(2, 12)];
  if (op === "×") return { text: `${name} compró ${k} entradas iguales y pagó ${k * x} soles. ¿Cuánto costó cada entrada?`, equation: `${k}x = ${k * x}`, x, wrong: [`x + ${k} = ${k * x}`, `x ÷ ${k} = ${k * x}`, `${k * x}x = ${k}`] };
  return { text: `${name} repartió sus canicas por igual entre ${k} amigos y a cada uno le tocaron ${x}. ¿Cuántas canicas tenía?`, equation: `x ÷ ${k} = ${x}`, x: x * k, wrong: [`${k}x = ${x}`, `x − ${k} = ${x}`, `${k} ÷ x = ${x}`] };
}

// 6.° AA.14 – AA.17: problemas con ecuaciones de un paso (`write`: elegir la ecuación).
export function equationWordProblem(r: Rng, ops: string[], write = false): Question {
  const s = equationStory(r, ops);
  if (write) return choiceQ(r, `${s.text} Si x es la cantidad que se busca, ¿qué ecuación lo representa?`, s.equation, s.wrong, `La ecuación es ${s.equation}; su solución es x = ${s.x}.`);
  return numQ(s.x, s.text, s.equation, `${s.equation}, entonces x = ${s.x}.`);
}

// 6.° AA.18: ¿qué problema corresponde a la ecuación?
export function matchWordProblem(r: Rng): Question {
  const [k, t] = [r.int(2, 9), r.int(12, 60)];
  const name = r.pick(NAMES);
  const stories: Record<string, string> = {
    "+": `${name} tenía x soles, recibió ${k} más y ahora tiene ${t}.`,
    "−": `${name} tenía x soles, gastó ${k} y le quedan ${t}.`,
    "×": `${name} compró ${k} cuadernos a x soles cada uno y pagó ${t}.`,
    "÷": `${name} repartió x soles entre ${k} personas y cada una recibió ${t}.`,
  };
  const equations: Record<string, string> = { "+": `x + ${k} = ${t}`, "−": `x − ${k} = ${t}`, "×": `${k}x = ${t}`, "÷": `x ÷ ${k} = ${t}` };
  const op = r.pick(["+", "−", "×", "÷"]);
  return choiceQ(r, `¿Qué situación corresponde a la ecuación ${equations[op]}?`, stories[op], Object.keys(stories).filter((o) => o !== op).map((o) => stories[o]), `«${stories[op]}» se escribe ${equations[op]}.`, equations[op], op);
}

// 6.° AA.19: resolver ecuaciones de un paso con enteros.
export function solveOneStepIntegers(r: Rng): Question {
  const v = r.pick(VARS);
  const x = r.int(-15, 15);
  const b = r.int(1, 20);
  const k = r.int(2, 9) * r.pick([-1, 1]);
  const forms: [string, number, string][] = [
    [`${v} + ${b} = ${sg(x + b)}`, x, `${v} = ${sg(x + b)} − ${b} = ${sg(x)}`],
    [`${v} − ${b} = ${sg(x - b)}`, x, `${v} = ${sg(x - b)} + ${b} = ${sg(x)}`],
    [`${sg(k)}${v} = ${sg(k * x)}`, x, `${v} = ${sg(k * x)} ÷ (${sg(k)}) = ${sg(x)}`],
    [`${v} ÷ ${Math.abs(k)} = ${sg(x)}`, x * Math.abs(k), `${v} = ${sg(x)} × ${Math.abs(k)} = ${sg(x * Math.abs(k))}`],
  ];
  const [text, answer, steps] = r.pick(forms);
  return intQ(r, `Resuelve. ¿Cuánto vale ${v}?`, answer, `${steps}.`, text);
}

// 6.° AA (checkpoint): comprender y resolver ecuaciones.
export function equationReview(r: Rng): Question {
  return r.pick([() => satisfiesEquation(r, r.chance(0.5)), () => equationFromWords(r), () => solveOneStep(r, ["+", "−", "×", "÷"]), () => equationWordProblem(r, ["+", "−", "×", "÷"]), () => equationWordProblem(r, ["+", "−", "×", "÷"], true), () => stripExpression(r, true)])();
}

// ---------------------------------------------------------------------------
// Inecuaciones de una variable

type Ineq = { op: ">" | "<" | "≥" | "≤"; n: number };
const INEQ_OPS = [">", "<", "≥", "≤"] as const;
const holds = (i: Ineq, x: number) => (i.op === ">" ? x > i.n : i.op === "<" ? x < i.n : i.op === "≥" ? x >= i.n : x <= i.n);
const itext = (i: Ineq, v = "x") => `${v} ${i.op} ${sg(i.n)}`;
const iline = (i: Ineq): Visual => ({ kind: "numberLine", min: -10, max: 10, step: 1, labelEvery: 5, marked: i.n, ray: { closed: i.op === "≥" || i.op === "≤", dir: i.op === ">" || i.op === "≥" ? "right" : "left" } });
const describe = (i: Ineq) => `Punto ${i.op === "≥" || i.op === "≤" ? "relleno" : "vacío"} en ${sg(i.n)} y flecha hacia la ${i.op === ">" || i.op === "≥" ? "derecha" : "izquierda"}`;
const randIneq = (r: Rng, min = -8, max = 8): Ineq => ({ op: r.pick(INEQ_OPS), n: r.int(min, max) });
const others = (i: Ineq): Ineq[] => INEQ_OPS.filter((o) => o !== i.op).map((op) => ({ op, n: i.n }));

// 6.° BB.1: soluciones de inecuaciones.
export function inequalitySolutions(r: Rng): Question {
  const i = randIneq(r);
  if (r.chance(0.5)) {
    const x = r.chance(0.3) ? i.n : i.n + r.int(-4, 4);
    return yesNo(`¿x = ${sg(x)} es una solución de ${itext(i)}?`, holds(i, x), `${sg(x)} ${holds(i, x) ? "sí" : "no"} cumple ${itext(i)}${x === i.n ? ` (con ${i.op} el propio ${sg(i.n)} ${holds(i, x) ? "sí" : "no"} cuenta)` : ""}.`, undefined, i.op);
  }
  const options = [i.n - 3, i.n - 1, i.n, i.n + 1, i.n + 3];
  const good = options.filter((x) => holds(i, x));
  return multiQ(`Selecciona todas las soluciones de ${itext(i)}.`, options.map(sg), good.map(sg), `Cumplen ${itext(i)}: ${good.map(sg).join(", ")}.`, undefined, i.op);
}

// 6.° BB.2 / BB.3: inecuaciones y rectas numéricas (`fromLine`: leer el gráfico).
export function inequalityLine(r: Rng, fromLine: boolean): Question {
  const i = randIneq(r);
  if (fromLine) return choiceQ(r, "¿Qué inecuación muestra la recta numérica?", itext(i), others(i).map((o) => itext(o)), `${describe(i)}: ${itext(i)}.`, iline(i), i.op);
  return choiceQ(r, `¿Cómo se grafica ${itext(i)} en la recta numérica?`, describe(i), others(i).map(describe), `${i.op === "≥" || i.op === "≤" ? "Con ≥ o ≤ el punto va relleno" : "Con > o < el punto va vacío"}; la flecha va hacia los números que cumplen.`, undefined, i.op);
}

const INEQ_STORIES: [(n: number) => string, Ineq["op"], [number, number]][] = [
  [(n) => `Para subir al juego hay que medir más de ${n} cm.`, ">", [90, 150]],
  [(n) => `En el ascensor pueden entrar como máximo ${n} personas.`, "≤", [4, 20]],
  [(n) => `Para aprobar hay que sacar al menos ${n} puntos.`, "≥", [11, 90]],
  [(n) => `El paquete debe pesar menos de ${n} kg.`, "<", [5, 50]],
  [(n) => `La velocidad no puede pasar de ${n} km por hora.`, "≤", [30, 120]],
  [(n) => `Para participar hay que tener ${n} años o más.`, "≥", [6, 18]],
  [(n) => `Hoy la temperatura estará por debajo de ${n} grados.`, "<", [5, 30]],
  [(n) => `Se necesitan más de ${n} firmas.`, ">", [50, 500]],
];

// 6.° BB.4 / BB.7: escribir (y resolver) inecuaciones en problemas.
export function inequalityProblem(r: Rng, solve = false): Question {
  if (solve) {
    const k = r.int(2, 9);
    const q = r.int(3, 15);
    const name = r.pick(NAMES);
    const cases: [string, Ineq][] = [
      [`${name} tiene ${k * q} soles y cada entrada cuesta ${k} soles. Si compra x entradas, ¿qué inecuación indica cuántas puede comprar?`, { op: "≤", n: q }],
      [`${name} ya tiene ${k} puntos y necesita al menos ${k + q} para ganar. Si le faltan x puntos, ¿qué inecuación lo indica?`, { op: "≥", n: q }],
      [`Un bus lleva ${k} personas y caben menos de ${k + q}. Si suben x personas más, ¿qué inecuación lo indica?`, { op: "<", n: q }],
    ];
    const [text, i] = r.pick(cases);
    return choiceQ(r, text, itext(i), others(i).map((o) => itext(o)), `Al resolver queda ${itext(i)}.`, undefined, i.op);
  }
  const [make, op, [lo, hi]] = r.pick(INEQ_STORIES);
  const i: Ineq = { op, n: r.int(lo, hi) };
  return choiceQ(r, `${make(i.n)} ¿Qué inecuación lo representa?`, itext(i), others(i).map((o) => itext(o)), `«${op === ">" ? "más de" : op === "<" ? "menos de" : op === "≥" ? "al menos / o más" : "como máximo / no más de"}» se escribe con ${op}: ${itext(i)}.`, undefined, op);
}

// 6.° BB.5 / BB.6: resolver inecuaciones de un paso (`graph`: comprobar el gráfico).
export function solveInequality(r: Rng, graph = false): Question {
  const sol = randIneq(r, graph ? -6 : -10, graph ? 6 : 20);
  const form = r.int(0, 2);
  const b = r.int(1, 12);
  const k = r.int(2, 6);
  const text = form === 0 ? `x + ${b} ${sol.op} ${sg(sol.n + b)}` : form === 1 ? `x − ${b} ${sol.op} ${sg(sol.n - b)}` : `${k}x ${sol.op} ${sg(k * sol.n)}`;
  const steps = form === 0 ? `Se resta ${b} en los dos lados` : form === 1 ? `Se suma ${b} en los dos lados` : `Se divide entre ${k} en los dos lados`;
  if (graph) {
    const yes = r.chance(0.5);
    const shown = yes ? sol : r.pick(others(sol));
    return yesNo(`¿La recta numérica muestra la solución de ${text}?`, yes, `${steps}: ${itext(sol)}. ${describe(sol)}.`, iline(shown), sol.op);
  }
  const wrong = [...others(sol).map((o) => itext(o)), itext({ op: sol.op, n: form === 0 ? sol.n + 2 * b : form === 1 ? sol.n - 2 * b : sol.n * k })];
  return choiceQ(r, `Resuelve la inecuación ${text}.`, itext(sol), wrong.filter((w) => w !== itext(sol)), `${steps}: ${itext(sol)}.`, text, sol.op);
}

// 6.° BB (checkpoints).
export function inequalityReview(r: Rng, solving: boolean): Question {
  return solving ? r.pick([() => solveInequality(r), () => solveInequality(r, true), () => inequalityProblem(r, true)])() : r.pick([() => inequalitySolutions(r), () => inequalityLine(r, true), () => inequalityLine(r, false), () => inequalityProblem(r)])();
}

// ---------------------------------------------------------------------------
// Ecuaciones de dos variables

const rule6 = (r: Rng): Rule2 => ({ m: r.int(1, 6), b: r.int(0, 10) });
const eq = ({ m, b }: Rule2) => `y = ${term(m, "x")}${b ? ` + ${b}` : ""}`;

// 6.° CC.1: ¿(x, y) cumple la ecuación?
export function pairSatisfies(r: Rng): Question {
  const rule = rule6(r);
  const x = r.int(0, 9);
  const yes = r.chance(0.5);
  const y = ruleY(rule, x) + (yes ? 0 : r.pick([-2, -1, 1, 2]));
  if (y < 0) return pairSatisfies(r);
  return yesNo(`¿El par ordenado (${x}, ${y}) cumple la ecuación ${eq(rule)}?`, yes, `Con x = ${x}: y = ${rule.m} × ${x}${rule.b ? ` + ${rule.b}` : ""} = ${ruleY(rule, x)}.`, eq(rule));
}

const DEPENDENCIES: [string, string, string][] = [
  ["las horas que trabaja una persona", "el dinero que gana", "El pago depende de las horas trabajadas."],
  ["los kilómetros recorridos en taxi", "el precio del viaje", "El precio depende de la distancia."],
  ["la cantidad de entradas que se compran", "el total que se paga", "El total depende de cuántas entradas se compran."],
  ["los minutos que está abierto el caño", "los litros de agua en el balde", "El agua depende del tiempo que el caño está abierto."],
  ["los días que pasan", "la altura de la planta", "La altura depende del tiempo transcurrido."],
  ["la cantidad de kilos de papa", "el costo de la compra", "El costo depende de los kilos."],
  ["las horas de estudio", "la nota del examen", "La nota depende de cuánto se estudia."],
];

// 6.° CC.2 / CC.4: identificar la variable independiente y la dependiente.
export function independentDependent(r: Rng, withTable: boolean): Question {
  const [indep, dep, why] = r.pick(DEPENDENCIES);
  const askDependent = r.chance(0.5);
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const rule = rule6(r);
  const visual = withTable ? table(["x", "y"], [1, 2, 3, 4].map((x) => [String(x), String(ruleY(rule, x))]), `x: ${indep} · y: ${dep}`) : undefined;
  return fixedQ(`Se relacionan ${indep} y ${dep}. ¿Cuál es la variable ${askDependent ? "dependiente" : "independiente"}?`, [cap(indep), cap(dep)], cap(askDependent ? dep : indep), `${why} La que depende de la otra es la dependiente.`, visual, askDependent ? "dependiente" : "independiente");
}

const pts = (rule: Rule2, max: number) => [0, 1, 2, 3, 4].map((x) => ({ x, y: ruleY(rule, x) })).filter((p) => p.y <= max);
const plane = (rule: Rule2): Visual => ({ kind: "coordPlane", max: 12, points: pts(rule, 12).map((p) => ({ ...p, emoji: "•" })), connect: "open" });
function graphable(r: Rng): Rule2 {
  for (;;) {
    const rule = { m: r.int(1, 4), b: r.int(0, 5) };
    if (pts(rule, 12).length >= 3) return rule;
  }
}
const wrongRules = (rule: Rule2): Rule2[] => [{ m: rule.m + 1, b: rule.b }, { m: rule.m, b: rule.b + 1 }, { m: Math.max(1, rule.b || rule.m + 2), b: rule.m }, { m: rule.m, b: Math.max(0, rule.b - 1) }];

// 6.° CC.3 / CC.11: escribir (o identificar) la ecuación de un gráfico.
export function equationFromGraph(r: Rng): Question {
  const rule = graphable(r);
  const wrong = wrongRules(rule).map(eq).filter((w) => w !== eq(rule));
  return choiceQ(r, "¿Qué ecuación corresponde al gráfico? (Arma una tabla con los puntos.)", eq(rule), wrong, `Los puntos son ${pts(rule, 12).map((p) => `(${p.x}, ${p.y})`).join(", ")}: cada vez que x aumenta 1, y aumenta ${rule.m}${rule.b ? `, y empieza en ${rule.b}` : ""}.`, plane(rule));
}

// 6.° CC.11: identificar el gráfico de una ecuación (¿este gráfico es el de la ecuación?).
export function graphOfEquation(r: Rng): Question {
  const rule = graphable(r);
  const yes = r.chance(0.5);
  const shown = yes ? rule : r.pick(wrongRules(rule).filter((w) => eq(w) !== eq(rule) && pts(w, 12).length >= 3));
  const p = pts(shown, 12).find((q) => yes || ruleY(rule, q.x) !== q.y) ?? pts(shown, 12)[1];
  return yesNo(`¿Este es el gráfico de ${eq(rule)}?`, yes, `Prueba un punto del gráfico, (${p.x}, ${p.y}): con x = ${p.x}, la ecuación da y = ${ruleY(rule, p.x)}. ${yes ? "Coincide en todos los puntos." : "No coincide."}`, plane(shown));
}

const TWO_VAR_STORIES: [(m: number, b: number) => string, boolean][] = [
  [(m, b) => `Un taxi cobra ${b} soles fijos más ${m} soles por cada kilómetro. Si x son los kilómetros e y el precio`, true],
  [(m, b) => `Una planta mide ${b} cm y crece ${m} cm cada semana. Si x son las semanas e y la altura`, true],
  [(m) => `Cada entrada cuesta ${m} soles. Si x son las entradas e y el total`, false],
  [(m) => `Un caño llena ${m} litros por minuto. Si x son los minutos e y los litros`, false],
  [(m, b) => `Un club cobra ${b} soles de inscripción y ${m} soles por mes. Si x son los meses e y el total pagado`, true],
];

// 6.° CC.6 / CC.7 / CC.10: relaciones entre dos variables en problemas.
export function twoVariableProblem(r: Rng, mode: "value" | "write"): Question {
  const [make, hasB] = r.pick(TWO_VAR_STORIES);
  const rule: Rule2 = { m: r.int(2, 12), b: hasB ? r.int(2, 30) : 0 };
  const text = make(rule.m, rule.b);
  if (mode === "write") return choiceQ(r, `${text}, ¿qué ecuación relaciona x con y?`, eq(rule), [eq({ m: rule.b || rule.m + 1, b: rule.m }), `y = x + ${rule.m + rule.b}`, eq({ m: rule.m, b: rule.b + rule.m }), `x = ${term(rule.m, "y")}${rule.b ? ` + ${rule.b}` : ""}`].filter((w) => w !== eq(rule)), `Por cada unidad de x se suman ${rule.m}${rule.b ? `, y se parte de ${rule.b}` : ""}: ${eq(rule)}.`);
  const x = r.int(2, 12);
  return numQ(ruleY(rule, x), `${text}, la ecuación es ${eq(rule)}. ¿Cuánto vale y cuando x = ${x}?`, eq(rule), `y = ${rule.m} × ${x}${rule.b ? ` + ${rule.b}` : ""} = ${ruleY(rule, x)}.`);
}

// 6.° CC.14: interpretar un gráfico en un problema.
export function interpretGraphProblem(r: Rng): Question {
  const rule = graphable(r);
  const [xName, yName, start, rate] = r.pick([["semanas", "centímetros de altura de una planta", "medía al inicio", "crece por semana"], ["horas", "litros de agua en un tanque", "tenía al inicio", "entran por hora"], ["meses", "soles ahorrados", "tenía al inicio", "ahorra por mes"]]);
  const head = `Eje x: ${xName}. Eje y: ${yName}.`;
  const form = r.int(0, 2);
  if (form === 0) return numQ(rule.b, `${head} ¿Cuánto ${start}? (cuando x = 0)`, plane(rule), `El gráfico empieza en (0, ${rule.b}).`, "inicio");
  if (form === 1) return numQ(rule.m, `${head} ¿Cuánto ${rate}?`, plane(rule), `Cada vez que x aumenta 1, y aumenta ${rule.m}.`, "tasa");
  const x = r.int(5, 10);
  return numQ(ruleY(rule, x), `${head} Si sigue igual, ¿cuánto valdrá y cuando x = ${x}?`, plane(rule), `${eq(rule)}: ${rule.m} × ${x}${rule.b ? ` + ${rule.b}` : ""} = ${ruleY(rule, x)}.`, "predecir");
}
