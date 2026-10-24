import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, fixedQ, fmt, numQ, table } from "./kit";
import { ioInputs, ioRule, ruleText, type IoRule } from "./operations";
import { calc, type Op } from "./wordproblems";

// Patrones numéricos, tablas de entrada y salida y patrones de figuras
// (4.° en adelante).

type Pattern = { terms: number[]; rule: string; kind: string };

// Patrón de `len` términos. `kinds`: suma, resta, multiplicación o diferencias que crecen.
function pattern(r: Rng, kinds: ("+" | "−" | "×" | "creciente")[], len = 5): Pattern {
  const kind = r.pick(kinds);
  if (kind === "×") {
    const k = r.pick([2, 2, 3, 4, 5, 10]);
    const start = r.int(1, k === 10 ? 9 : 5);
    return { terms: Array.from({ length: len }, (_, i) => start * k ** i), rule: `multiplicar por ${k}`, kind };
  }
  if (kind === "creciente") {
    const start = r.int(1, 20);
    const first = r.int(1, 4);
    const terms = [start];
    for (let i = 1; i < len; i++) terms.push(terms[i - 1] + first + i - 1);
    return { terms, rule: `sumar cada vez 1 más (${Array.from({ length: len - 1 }, (_, i) => `+${first + i}`).join(", ")})`, kind };
  }
  const k = r.int(2, 25);
  const start = kind === "+" ? r.int(1, 60) : k * (len - 1) + r.int(0, 60);
  return { terms: Array.from({ length: len }, (_, i) => start + (kind === "+" ? i : -i) * k), rule: `${kind === "+" ? "sumar" : "restar"} ${k}`, kind };
}

// Usar una regla para completar un patrón.
export function ruleToPattern(r: Rng): Question {
  const p = pattern(r, ["+", "−", "×"]);
  const hidden = r.int(2, 4);
  return numQ(p.terms[hidden], `Regla: ${p.rule}. ¿Qué número falta?`, p.terms.map((t, i) => (i === hidden ? "?" : fmt(t))).join("   "), `Con la regla «${p.rule}», el número que falta es ${fmt(p.terms[hidden])}.`, p.kind);
}

const PARITY = ["Todos los números son pares", "Todos los números son impares", "Se alternan pares e impares"];

// ¿qué es verdadero sobre el patrón? (`showTerms`: se ve el patrón; si no, solo la regla).
export function patternTruth(r: Rng, showTerms: boolean): Question {
  const k = r.int(2, 12);
  const start = r.int(1, 20);
  const terms = Array.from({ length: 5 }, (_, i) => start + i * k);
  const answer = k % 2 === 1 ? PARITY[2] : start % 2 === 0 ? PARITY[0] : PARITY[1];
  const why = k % 2 === 1 ? `Al sumar un número impar (${k}), el resultado cambia de par a impar cada vez.` : `Al sumar un número par (${k}), todos siguen siendo ${start % 2 === 0 ? "pares" : "impares"} como el primero.`;
  return fixedQ("¿Qué es verdadero sobre este patrón?", PARITY, answer, `${why} El patrón es ${terms.join(", ")}...`, showTerms ? `${terms.join(", ")}, ...` : `Regla: sumar ${k}. Empieza en ${start}.`, k % 2 === 1 ? "alternan" : "misma-paridad");
}

// Hallar el error en un patrón.
export function patternMistake(r: Rng): Question {
  const p = pattern(r, ["+", "−"], 6);
  const at = r.int(1, 5);
  const wrong = p.terms[at] + r.pick([-2, -1, 1, 2]);
  const shown = p.terms.map((t, i) => (i === at ? wrong : t));
  if (new Set(shown).size < shown.length || wrong < 0) return patternMistake(r);
  return { kind: "choice", prompt: `Regla: ${p.rule}. Un número del patrón está equivocado. ¿Cuál es?`, visual: { kind: "text", text: shown.join("   ") }, options: shown.map(String), answer: String(wrong), explanation: `En lugar de ${wrong} debería ir ${p.terms[at]}.`, tag: p.kind };
}

// Completar un patrón creciente o de multiplicación.
export function completePattern2(r: Rng, kinds: ("+" | "−" | "×" | "creciente")[]): Question {
  const p = pattern(r, kinds, kinds.includes("×") ? 5 : 6);
  const last = p.terms.length - 1;
  return numQ(p.terms[last], "¿Qué número sigue en el patrón?", `${p.terms.slice(0, last).map(fmt).join("   ")}   ?`, `La regla es ${p.rule}: sigue el ${fmt(p.terms[last])}.`, p.kind);
}

// Problemas con patrones numéricos.
export function patternProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const start = r.int(2, 20);
  const k = r.int(2, 9);
  const at = r.int(4, 7);
  const form = r.int(0, 2);
  if (form === 0) return numQ(start + (at - 1) * k, `${n} ahorra ${start} soles la primera semana. Cada semana ahorra ${k} soles más que la anterior. ¿Cuántos soles ahorra en la semana ${at}?`, undefined, `Sumamos ${k} cada semana: ${Array.from({ length: at }, (_, i) => start + i * k).join(", ")}.`, "suma");
  if (form === 1) return numQ(start * 2 ** (at - 3), `Una planta tiene ${start} hojas el primer mes y cada mes duplica sus hojas. ¿Cuántas hojas tiene en el mes ${at - 2}?`, undefined, `Se duplica cada mes: ${Array.from({ length: at - 2 }, (_, i) => start * 2 ** i).join(", ")}.`, "doble");
  const total = start + at * k + 20;
  return numQ(total - (at - 1) * k, `Un tanque tiene ${total} litros el primer día. Cada día se usan ${k} litros. ¿Cuántos litros hay el día ${at}?`, undefined, `Restamos ${k} cada día: ${Array.from({ length: at }, (_, i) => total - i * k).join(", ")}.`, "resta");
}

// Repaso de patrones.
export function patternReview(r: Rng): Question {
  return r.pick([() => ruleToPattern(r), () => patternMistake(r), () => completePattern2(r, ["+", "−", "×", "creciente"]), () => patternTruth(r, true), () => patternProblem(r)])();
}

const ioVisual = (rule: IoRule, inputs: number[], hidden?: number, heads: [string, string] = ["Entrada", "Salida"]) => table(heads, inputs.map((x, i) => [fmt(x), i === hidden ? "?" : fmt(calc(rule.op, x, rule.k))]));

// Tablas de entrada y salida. `showRule`: la regla
// se da; si no, hay que descubrirla en las otras filas.
export function ioTable(r: Rng, ops: Op[], showRule: boolean): Question {
  const rule = ioRule(r, ops);
  const inputs = ioInputs(r, rule).sort((a, b) => a - b);
  const hidden = r.int(showRule ? 0 : 1, inputs.length - 1);
  const answer = calc(rule.op, inputs[hidden], rule.k);
  return numQ(answer, showRule ? `Regla: ${ruleText(rule)}. ¿Qué número falta en la tabla?` : "Descubre la regla. ¿Qué número falta en la tabla?", ioVisual(rule, inputs, hidden), `La regla es ${ruleText(rule)}: ${fmt(inputs[hidden])} ${rule.op} ${rule.k} = ${fmt(answer)}.`, rule.op);
}

// Hallar la regla de una tabla.
export function ioFindRule(r: Rng, ops: Op[]): Question {
  for (;;) {
    const rule = ioRule(r, ops);
    const inputs = ioInputs(r, rule).sort((a, b) => a - b);
    // Reglas alternativas que no coinciden con toda la tabla.
    const fits = (other: IoRule) => inputs.every((x) => calc(other.op, x, other.k) === calc(rule.op, x, rule.k));
    const others: IoRule[] = [{ op: rule.op, k: rule.k + 1 }, { op: rule.op, k: Math.max(2, rule.k - 1) }, { op: rule.op === "×" ? "+" : "×", k: rule.k }, { op: rule.op === "÷" ? "−" : "÷", k: rule.k }, { op: "+", k: Math.abs(calc(rule.op, inputs[0], rule.k) - inputs[0]) || 2 }];
    const wrong = others.filter((o) => !fits(o) && ruleText(o) !== ruleText(rule)).map(ruleText);
    if (wrong.length < 3) continue;
    const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
    return choiceQ(r, "¿Cuál es la regla de la tabla?", cap(ruleText(rule)), wrong.map(cap), `Cada salida se obtiene al ${ruleText(rule)}: por ejemplo, ${fmt(inputs[0])} ${rule.op} ${rule.k} = ${fmt(calc(rule.op, inputs[0], rule.k))}.`, ioVisual(rule, inputs), rule.op);
  }
}

// Escribir expresiones para los patrones de una tabla.
export function ioExpression(r: Rng): Question {
  for (;;) {
    const rule = ioRule(r, ["+", "−", "×", "÷"], 9);
    const inputs = ioInputs(r, rule).sort((a, b) => a - b);
    const text = (o: IoRule) => `y = x ${o.op} ${o.k}`;
    const fits = (o: IoRule) => inputs.every((x) => calc(o.op, x, o.k) === calc(rule.op, x, rule.k));
    const others: IoRule[] = (["+", "−", "×", "÷"] as Op[]).filter((op) => op !== rule.op).map((op) => ({ op, k: rule.k }));
    others.push({ op: rule.op, k: rule.k + 1 });
    const wrong = others.filter((o) => !fits(o)).map(text);
    if (wrong.length < 3) continue;
    return choiceQ(r, "¿Qué expresión relaciona x con y en la tabla?", text(rule), wrong, `En cada fila, y se obtiene al ${ruleText(rule)}: ${fmt(inputs[0])} ${rule.op} ${rule.k} = ${fmt(calc(rule.op, inputs[0], rule.k))}.`, ioVisual(rule, inputs, undefined, ["x", "y"]), rule.op);
  }
}

const TABLE_STORIES: [string, string, string][] = [
  ["Cada caja trae %k jugos.", "Cajas", "Jugos"],
  ["Cada entrada al cine cuesta %k soles.", "Entradas", "Soles"],
  ["Cada mesa tiene %k sillas.", "Mesas", "Sillas"],
  ["Cada bicicleta recorre %k kilómetros por hora.", "Horas", "Kilómetros"],
  ["Cada paquete trae %k figuritas.", "Paquetes", "Figuritas"],
  ["Cada pulsera lleva %k cuentas.", "Pulseras", "Cuentas"],
];

// Problemas con patrones numéricos en tablas.
export function ioWordTable(r: Rng): Question {
  const [text, a, b] = r.pick(TABLE_STORIES);
  const k = r.int(2, 12);
  const inputs = [1, 2, 3, r.int(4, 6), r.int(7, 12)];
  const hidden = r.int(2, 4);
  const backwards = r.chance(0.3);
  const rows = inputs.map((x, i) => [i === hidden && backwards ? "?" : String(x), i === hidden && !backwards ? "?" : String(x * k)]);
  return numQ(backwards ? inputs[hidden] : inputs[hidden] * k, `${text.replace("%k", String(k))} ¿Qué número falta en la tabla?`, table([a, b], rows), backwards ? `${inputs[hidden] * k} ÷ ${k} = ${inputs[hidden]}.` : `${inputs[hidden]} × ${k} = ${inputs[hidden] * k}.`, backwards ? "entrada" : "salida");
}

// ---------------------------------------------------------------------------
// Patrones de figuras

const TILES = ["🟦", "🟩", "🟧", "🟪", "🔴", "⭐"];

// Continuar patrones de figuras que crecen.
export function growingShapes(r: Rng): Question {
  const tile = r.pick(TILES);
  const rules: [(n: number) => number, string][] = [
    [(n) => n * 2, "cada figura tiene 2 más que la anterior"],
    [(n) => n * 3, "cada figura tiene 3 más que la anterior"],
    [(n) => 2 * n + 1, "cada figura tiene 2 más que la anterior"],
    [(n) => n * n, "la figura n tiene n × n fichas"],
    [(n) => (n * (n + 1)) / 2, "cada vez se agrega 1 ficha más que la vez anterior"],
    [(n) => 4 * n, "cada figura tiene 4 más que la anterior"],
    [(n) => 3 * n - 1, "cada figura tiene 3 más que la anterior"],
  ];
  const [f, why] = r.pick(rules);
  const ask = r.int(4, 6);
  const rows = [1, 2, 3].map((n) => `Figura ${n}:  ${tile.repeat(f(n))}`);
  return numQ(f(ask), `El patrón crece. ¿Cuántas fichas tendrá la figura ${ask}?`, rows.join("\n"), `Las figuras tienen ${[1, 2, 3, 4, 5, 6].slice(0, ask).map(f).join(", ")} fichas: ${why}.`);
}

// Continuar patrones de figuras que se repiten.
export function repeatingShapes(r: Rng): Question {
  const unit = r.shuffle(TILES).slice(0, r.int(2, 3));
  const core = r.pick([unit, [...unit, unit[0]], [unit[0], ...unit]]);
  const shown = Array.from({ length: core.length * 2 + r.int(0, core.length - 1) }, (_, i) => core[i % core.length]);
  const position = shown.length + r.int(1, 12);
  const answer = core[(position - 1) % core.length];
  return { kind: "choice", prompt: `El patrón se repite. ¿Qué figura va en la posición ${position}?`, visual: { kind: "pattern", items: shown }, options: r.shuffle(unit), answer, explanation: `El grupo que se repite tiene ${core.length} figuras (${core.join(" ")}). La posición ${position} cae en el lugar ${((position - 1) % core.length) + 1} del grupo.`, tag: `nucleo-${core.length}` };
}
