import type { Rng } from "../rng";
import type { Question } from "../types";
import { COUNTABLES, columnAddSteps, numberOptions, solved, uniqueOptions } from "./common";

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

export function addPictureEquation(r: Rng): Question {
  const a = r.int(1, 9);
  const b = r.int(1, Math.min(10 - a, 9));
  const answer = `${a} + ${b}`;
  const reversed = `${b} + ${a}`;
  const distractors = [`${a} + ${b + 1}`, `${a + 1} + ${b}`, `${a} + ${Math.max(1, b - 1)}`, `${a + 2} + ${b}`].filter(
    (d) => d !== answer && d !== reversed
  );
  return {
    kind: "choice",
    prompt: "¿Qué suma coincide con el dibujo?",
    visual: { kind: "groups", emoji: r.pick(COUNTABLES), a, b },
    options: uniqueOptions(r, answer, distractors),
    answer,
    explanation: `Hay ${a} en un grupo y ${b} en el otro: ${a} + ${b}.`,
  };
}

export function addFacts(r: Rng, max: number): Question {
  const big = max > 10 && r.chance(0.75);
  const sum = big ? r.int(11, max) : r.int(2, Math.min(max, 10));
  const a = r.int(Math.max(0, sum - 10), Math.min(sum, 10));
  const b = sum - a;
  return num(sum, "Resuelve la suma.", `${a} + ${b} = ?`, `${a} + ${b} = ${sum}.`, big ? "pasa-de-10" : "hasta-10");
}

// (op = "+" o "−")
export function makeTargetNumber(r: Rng, max: number, op: "+" | "−"): Question {
  // Hasta 20 (1.° y 2.°) se mantiene el rango original; con 99 se usan
  // números de dos cifras.
  const big = max > 20;
  const target = op === "+" ? r.int(big ? 20 : 4, max) : big ? r.int(10, 70) : r.int(1, Math.min(max, 12));
  const build = (t: number): string => {
    if (op === "+") {
      const a = r.int(big ? 1 : 0, big ? t - 1 : t);
      return `${a} + ${t - a}`;
    }
    const b = big ? r.int(1, max - t) : r.int(0, Math.min(6, max - t));
    return `${t + b} − ${b}`;
  };
  const correct = new Set<string>();
  const want = r.int(2, 3);
  let guard = 0;
  while (correct.size < want && guard++ < 60) correct.add(build(target));
  const wrong = new Set<string>();
  guard = 0;
  while (wrong.size < 6 - correct.size && guard++ < 100) {
    const t = target + r.pick([-3, -2, -1, 1, 2, 3]);
    if (t < 0 || t > max) continue;
    const e = build(t);
    if (!correct.has(e)) wrong.add(e);
  }
  const options = r.shuffle([...correct, ...wrong]);
  return {
    kind: "multi",
    prompt: `Selecciona todas las ${op === "+" ? "sumas" : "restas"} que dan ${target}.`,
    options,
    answers: [...correct],
    explanation: `Las operaciones correctas dan ${target}.`,
  };
}

export function addMissing(r: Rng, max: number): Question {
  const c = r.int(3, max);
  const a = r.int(1, c - 1);
  const b = c - a;
  const [known, missing, eq] = r.chance(0.5) ? [a, b, `${a} + ? = ${c}`] : [b, a, `? + ${b} = ${c}`];
  return solved(num(missing, "¿Qué número falta?", eq, `${a} + ${b} = ${c}.`), [
    `Falta un sumando: con ${known} hay que llegar a ${c}.`,
    `La resta deshace la suma: ${c} − ${known} = ${missing}.`,
    `Comprobamos: ${a} + ${b} = ${c}.`,
  ]);
}

export function relatedAdd(r: Rng, max: number): Question {
  const c = r.int(4, max);
  const a = r.int(1, c - 1);
  const b = c - a;
  return num(
    c,
    "Usa la primera suma para resolver la segunda.",
    `${a} + ${b} = ${c}\n${b} + ${a} = ?`,
    `Sumar en otro orden da lo mismo: ${b} + ${a} = ${c}.`
  );
}

export function addTwoDigitOne(r: Rng, regroup: boolean): Question {
  for (;;) {
    const tens = r.int(1, 9);
    const ones = regroup ? r.int(1, 9) : r.int(0, 8);
    const b = r.int(1, 9);
    const a = tens * 10 + ones;
    if (regroup ? ones + b >= 10 && a + b < 100 : ones + b <= 9) {
      return solved(
        num(a + b, "Resuelve la suma.", `${a} + ${b} = ?`, `${a} + ${b} = ${a + b}.`, regroup ? "con-reagrupacion" : "sin-reagrupacion"),
        columnAddSteps(a, b)
      );
    }
  }
}

export function addTwoTwo(r: Rng, regroup: boolean): Question {
  for (;;) {
    const a = r.int(10, 89);
    const b = r.int(10, 89);
    const onesSum = (a % 10) + (b % 10);
    const ok = regroup ? onesSum >= 10 && a + b < 100 : onesSum <= 9 && a + b < 100;
    if (ok) {
      return solved(
        num(a + b, "Resuelve la suma.", `${a} + ${b} = ?`, `${a} + ${b} = ${a + b}.`, regroup ? "con-reagrupacion" : "sin-reagrupacion"),
        columnAddSteps(a, b)
      );
    }
  }
}

export function estimateTwoDigit(r: Rng, op: "+" | "−"): Question {
  const fix = (n: number) => (n % 10 === 5 ? n + 1 : n);
  const roundTen = (n: number) => Math.round(n / 10) * 10;
  for (;;) {
    let a = fix(r.int(12, 89));
    let b = fix(r.int(12, 89));
    if (op === "−" && a < b) [a, b] = [b, a];
    const est = op === "+" ? roundTen(a) + roundTen(b) : roundTen(a) - roundTen(b);
    if (est < 0 || est > 200 || (op === "−" && a === b)) continue;
    return {
      kind: "choice",
      prompt: `Estima ${op === "+" ? "la suma" : "la resta"} redondeando a la decena más cercana.`,
      visual: { kind: "text", text: `${a} ${op} ${b} ≈ ?` },
      options: uniqueOptions(r, String(est), [est + 10, est - 10, est + 20, est - 20].filter((n) => n >= 0).map(String)),
      answer: String(est),
      explanation: `${a} ≈ ${roundTen(a)} y ${b} ≈ ${roundTen(b)}; ${roundTen(a)} ${op} ${roundTen(b)} = ${est}.`,
      solution: [
        `Redondea ${a} a la decena más cercana: mira las unidades (${a % 10}); ${a % 10 >= 5 ? "como son 5 o más, sube" : "como son menos de 5, baja"} a ${roundTen(a)}.`,
        `Redondea ${b} de la misma forma: ${b % 10 >= 5 ? "sube" : "baja"} a ${roundTen(b)}.`,
        `Opera con los números redondeados: ${roundTen(a)} ${op} ${roundTen(b)} = ${est}.`,
      ],
    };
  }
}

export function doubles(r: Rng): Question {
  const a = r.int(1, 10);
  return num(a + a, "Suma los dobles.", `${a} + ${a} = ?`, `${a} + ${a} = ${a * 2}.`);
}

export function doublesNear(r: Rng, delta: 1 | -1): Question {
  const a = r.int(2, 9);
  const b = a + delta;
  const [x, y] = r.chance(0.5) ? [a, b] : [b, a];
  const hint = delta === 1 ? `${a} + ${a} = ${a * 2}, y uno más es ${a * 2 + 1}` : `${a} + ${a} = ${a * 2}, y uno menos es ${a * 2 - 1}`;
  return num(a + b, delta === 1 ? "Usa dobles más uno." : "Usa dobles menos uno.", `${x} + ${y} = ?`, `${hint}.`);
}

export function makeTen(r: Rng): Question {
  const a = r.int(1, 9);
  return solved(num(10 - a, "¿Cuánto falta para llegar a 10?", `${a} + ? = 10`, `${a} + ${10 - a} = 10.`), [
    `Hay que buscar el número que, sumado a ${a}, da 10.`,
    `Cuenta desde ${a} hasta 10: ${Array.from({ length: 10 - a }, (_, i) => a + i + 1).join(", ")}. Son ${10 - a} saltos.`,
    `${a} y ${10 - a} forman 10: ${a} + ${10 - a} = 10.`,
  ]);
}

export function addTens(r: Rng): Question {
  const a = r.int(1, 8) * 10;
  const b = r.int(1, (100 - a) / 10) * 10;
  return num(a + b, "Suma los múltiplos de 10.", `${a} + ${b} = ?`, `${a / 10} decenas + ${b / 10} decenas = ${(a + b) / 10} decenas: ${a + b}.`);
}

export function addMultipleOfTen(r: Rng): Question {
  for (;;) {
    const n = r.int(11, 89);
    if (n % 10 === 0) continue;
    const m = r.int(1, Math.floor((99 - n) / 10)) * 10;
    if (m < 10) continue;
    const [x, y] = r.chance(0.5) ? [n, m] : [m, n];
    return num(n + m, "Suma un múltiplo de 10.", `${x} + ${y} = ?`, `Solo cambian las decenas: ${n} + ${m} = ${n + m}.`);
  }
}

export function addK(r: Rng, k: number): Question {
  const n = r.int(0, k === 0 ? 20 : 10);
  const [x, y] = r.chance(0.5) ? [n, k] : [k, n];
  return num(n + k, `Suma ${k}.`, `${x} + ${y} = ?`, `${n} + ${k} = ${n + k}.`);
}

// Conmutativa, elemento neutro y asociativa.
export function additionProperties(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const a = r.int(1, 9);
    const b = r.int(1, 9);
    return num(b, "¿Qué número falta?", `${a} + ${b} = ${b} + ?`, `Cambiar el orden de los sumandos no cambia el resultado: ${a} + ${b} = ${b} + ${a}.`, "conmutativa");
  }
  if (form === 1) {
    const a = r.int(1, 20);
    return r.chance(0.5)
      ? num(a, "¿Qué número falta?", `${a} + 0 = ?`, `Sumar 0 no cambia el número: ${a} + 0 = ${a}.`, "neutro")
      : num(0, "¿Qué número falta?", `${a} + ? = ${a}`, `Solo sumando 0 el número queda igual.`, "neutro");
  }
  const a = r.int(1, 9);
  const b = r.int(1, 9);
  const c = r.int(1, 9);
  return num(b, "¿Qué número falta?", `(${a} + ${b}) + ${c} = ${a} + (? + ${c})`, `Agrupar los sumandos de otra forma no cambia la suma: falta el ${b}.`, "asociativa");
}

// Suma repetida por filas de una matriz.
export function arrayRepeatedAddition(r: Rng, maxTotal: number): Question {
  let rows: number;
  let cols: number;
  do {
    rows = r.int(2, 5);
    cols = r.int(2, 5);
  } while (rows * cols > maxTotal);
  const sum = (times: number, n: number) => `${Array.from({ length: times }, () => n).join(" + ")} = ${times * n}`;
  const answer = sum(rows, cols);
  const byCols = sum(cols, rows);
  const distractors = [sum(rows, cols + 1), sum(rows + 1, cols), sum(rows, Math.max(1, cols - 1)), sum(Math.max(2, rows - 1), cols)].filter(
    (d) => d !== answer && d !== byCols
  );
  return {
    kind: "choice",
    prompt: `Hay ${rows} filas. ¿Qué suma repetida muestra la matriz?`,
    visual: { kind: "array", emoji: r.pick(COUNTABLES), rows, cols },
    options: uniqueOptions(r, answer, distractors),
    answer,
    explanation: `Cada fila tiene ${cols}; sumamos ${cols} ${rows} veces: ${answer}.`,
  };
}

// Completar una suma de dos cifras.
export function addMissingTwoDigit(r: Rng): Question {
  const c = r.int(30, 99);
  const a = r.int(10, c - 10);
  const b = c - a;
  return r.chance(0.5)
    ? num(b, "¿Qué número falta?", `${a} + ? = ${c}`, `${c} − ${a} = ${b}, así que ${a} + ${b} = ${c}.`)
    : num(a, "¿Qué número falta?", `? + ${b} = ${c}`, `${c} − ${b} = ${a}, así que ${a} + ${b} = ${c}.`);
}

export function addHundreds(r: Rng): Question {
  const a = r.int(1, 8) * 100;
  const b = r.int(1, (1000 - a) / 100) * 100;
  return num(a + b, "Suma los múltiplos de 100.", `${a} + ${b} = ?`, `${a / 100} centenas + ${b / 100} centenas = ${(a + b) / 100} centenas: ${a + b}.`);
}

export function addThreeDigit(r: Rng): Question {
  const a = r.int(100, 899);
  const b = r.chance(0.5) ? r.int(10, 99) : r.int(100, 999 - a);
  if (b < 10 || a + b > 999) return addThreeDigit(r);
  const regroup = (a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10;
  return num(a + b, "Resuelve la suma.", `${a} + ${b} = ?`, `Sumamos unidades, decenas y centenas: ${a} + ${b} = ${a + b}.`, regroup ? "con-reagrupacion" : "sin-reagrupacion");
}

export { numberOptions };
