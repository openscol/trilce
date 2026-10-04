import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { numberOptions, uniqueOptions } from "../common";

// Computación 3.° a 6.°: generadores parametrizados por nivel (hoja de
// cálculo, binario, unidades, cifrado, compresión, pseudocódigo, lógica,
// ordenamiento, búsqueda, listas, píxeles y bases de datos).

const col = (c: number) => String.fromCharCode(65 + c);
const ref = (r: number, c: number) => `${col(c)}${r + 1}`;

// ---------------------------------------------------------------------------
// Hoja de cálculo
// ---------------------------------------------------------------------------

const FRUITS = ["🍎", "🍌", "🍇", "🍐", "🍓", "🍍", "🍉", "🥝", "🍒"];

export function sheetCell(r: Rng): Question {
  const rows = 3;
  const cols = 3;
  if (r.chance(0.5)) {
    const cells = Array.from({ length: rows }, () => Array.from({ length: cols }, () => String(r.int(1, 50))));
    const rr = r.int(0, rows - 1);
    const cc = r.int(0, cols - 1);
    return {
      kind: "number",
      prompt: `¿Qué número hay en la celda ${ref(rr, cc)}?`,
      visual: { kind: "sheet", cells },
      answer: Number(cells[rr][cc]),
      explanation: `La celda ${ref(rr, cc)} está en la columna ${col(cc)} y la fila ${rr + 1}: tiene ${cells[rr][cc]}.`,
    };
  }
  const emojis = r.shuffle(FRUITS).slice(0, rows * cols);
  const cells = Array.from({ length: rows }, (_, i) => emojis.slice(i * cols, i * cols + cols));
  const rr = r.int(0, rows - 1);
  const cc = r.int(0, cols - 1);
  const answer = ref(rr, cc);
  return {
    kind: "choice",
    prompt: `¿En qué celda está ${cells[rr][cc]}?`,
    visual: { kind: "sheet", cells },
    options: uniqueOptions(r, answer, [ref(cc, rr), ref(rr, (cc + 1) % cols), ref((rr + 1) % rows, cc), `${rr + 1}${col(cc)}`]),
    answer,
    explanation: `Columna ${col(cc)}, fila ${rr + 1}: ${answer}.`,
  };
}

export type FormulaOp = "suma" | "resta" | "mult" | "SUMA" | "PROMEDIO" | "MAX" | "MIN" | "SI";

export function sheetFormula(r: Rng, ops: FormulaOp[]): Question {
  const op = r.pick(ops);
  const rows = 4;
  const small = op === "mult";
  const cells = Array.from({ length: rows }, () => [r.int(small ? 2 : 1, small ? 9 : 20), r.int(small ? 2 : 1, small ? 9 : 20)]);
  if (op === "PROMEDIO") {
    // Promedio entero: se ajusta el último valor de la columna A.
    const sum = cells.slice(0, 2).reduce((s, row) => s + row[0], 0);
    cells[2][0] = 3 - (sum % 3) + 3 * r.int(1, 4);
  }
  const A = cells.map((row) => row[0]);
  const v = (rr: number, cc: number) => cells[rr][cc];
  let formula = "";
  let answer: number | string = 0;
  let how = "";
  const a1 = r.int(0, rows - 1);
  const b1 = r.int(0, rows - 1);
  switch (op) {
    case "suma":
      formula = `=A${a1 + 1}+B${b1 + 1}`;
      answer = v(a1, 0) + v(b1, 1);
      how = `${v(a1, 0)} + ${v(b1, 1)} = ${answer}`;
      break;
    case "resta": {
      const [big, sm] = v(a1, 0) >= v(b1, 1) ? [`A${a1 + 1}`, `B${b1 + 1}`] : [`B${b1 + 1}`, `A${a1 + 1}`];
      const [x, y] = v(a1, 0) >= v(b1, 1) ? [v(a1, 0), v(b1, 1)] : [v(b1, 1), v(a1, 0)];
      formula = `=${big}-${sm}`;
      answer = x - y;
      how = `${x} − ${y} = ${answer}`;
      break;
    }
    case "mult":
      formula = `=A${a1 + 1}*B${b1 + 1}`;
      answer = v(a1, 0) * v(b1, 1);
      how = `${v(a1, 0)} × ${v(b1, 1)} = ${answer}`;
      break;
    case "SUMA": {
      const n = r.int(2, 4);
      formula = `=SUMA(A1:A${n})`;
      answer = A.slice(0, n).reduce((s, x) => s + x, 0);
      how = `${A.slice(0, n).join(" + ")} = ${answer}`;
      break;
    }
    case "PROMEDIO": {
      const total = A.slice(0, 3).reduce((s, x) => s + x, 0);
      formula = "=PROMEDIO(A1:A3)";
      answer = total / 3;
      how = `(${A.slice(0, 3).join(" + ")}) ÷ 3 = ${total} ÷ 3 = ${answer}`;
      break;
    }
    case "MAX":
    case "MIN": {
      formula = `=${op}(A1:A4)`;
      answer = op === "MAX" ? Math.max(...A) : Math.min(...A);
      how = `El ${op === "MAX" ? "mayor" : "menor"} de ${A.join(", ")} es ${answer}`;
      break;
    }
    case "SI": {
      const k = r.int(5, 15);
      formula = `=SI(A${a1 + 1}>${k};"Aprobado";"Repasar")`;
      answer = v(a1, 0) > k ? "Aprobado" : "Repasar";
      how = `A${a1 + 1} vale ${v(a1, 0)}, que ${v(a1, 0) > k ? "sí" : "no"} es mayor que ${k}`;
      break;
    }
  }
  const visual = { kind: "sheet" as const, cells: cells.map((row) => row.map(String)) };
  if (typeof answer === "string") {
    return {
      kind: "choice",
      prompt: `¿Qué muestra la fórmula ${formula}?`,
      visual,
      options: ["Aprobado", "Repasar"],
      answer,
      explanation: `${how}: muestra «${answer}».`,
      tag: op,
    };
  }
  return {
    kind: "number",
    prompt: `¿Qué resultado da la fórmula ${formula}?`,
    visual,
    answer,
    explanation: `${how}.`,
    tag: op,
  };
}

// ---------------------------------------------------------------------------
// Binario y unidades
// ---------------------------------------------------------------------------

const pad = (n: number, bits: number) => n.toString(2).padStart(bits, "0");
const placeValues = (bits: number) => Array.from({ length: bits }, (_, i) => 2 ** (bits - 1 - i)).join("  ");

export function binaryToDecimal(r: Rng, bits: number): Question {
  const n = r.int(1, 2 ** bits - 1);
  const b = pad(n, bits);
  const parts = [...b].map((d, i) => (d === "1" ? 2 ** (bits - 1 - i) : 0)).filter(Boolean);
  return {
    kind: "number",
    prompt: `¿Qué número decimal es el binario ${b}?`,
    visual: { kind: "code", text: `Valor:   ${placeValues(bits)}\nBinario: ${[...b].join("  ")}` },
    answer: n,
    explanation: `Sumamos los valores donde hay 1: ${parts.join(" + ")} = ${n}.`,
    tag: `${bits}-bits`,
  };
}

export function decimalToBinary(r: Rng, bits: number): Question {
  const n = r.int(1, 2 ** bits - 1);
  const answer = pad(n, bits);
  const near = [n + 1, n - 1, n + 2, n ^ 1, n ^ 2].filter((x) => x >= 0 && x < 2 ** bits && x !== n).map((x) => pad(x, bits));
  return {
    kind: "choice",
    prompt: `¿Cómo se escribe ${n} en binario (${bits} bits)?`,
    visual: { kind: "code", text: `Valores: ${placeValues(bits)}` },
    options: uniqueOptions(r, answer, [...near, [...answer].reverse().join("")]),
    answer,
    explanation: `${n} = ${[...answer].map((d, i) => (d === "1" ? 2 ** (bits - 1 - i) : 0)).filter(Boolean).join(" + ")} → ${answer}.`,
    tag: `${bits}-bits`,
  };
}

export const UNITS = ["bit", "byte", "kilobyte (KB)", "megabyte (MB)", "gigabyte (GB)", "terabyte (TB)"];

export function unitsOrder(r: Rng): Question {
  if (r.chance(0.5)) {
    const [i, j] = r.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 2);
    const big = UNITS[Math.max(i, j)];
    return {
      kind: "choice",
      prompt: `¿Qué es más grande: un ${UNITS[i]} o un ${UNITS[j]}?`,
      options: [UNITS[i], UNITS[j]],
      answer: big,
      explanation: `De menor a mayor: ${UNITS.join(" → ")}.`,
    };
  }
  const start = r.int(0, UNITS.length - 4);
  const seq = UNITS.slice(start, start + r.int(3, 4));
  let tiles = r.shuffle(seq);
  if (tiles.every((t, i) => t === seq[i])) tiles = [...tiles.slice(1), tiles[0]];
  return {
    kind: "sequence",
    prompt: "Ordena las unidades de la más pequeña a la más grande.",
    tiles,
    reuse: false,
    length: seq.length,
    answer: seq,
    explanation: `De menor a mayor: ${seq.join(" → ")}.`,
  };
}

export function bitsInBytes(r: Rng): Question {
  const n = r.int(2, 25);
  return {
    kind: "number",
    prompt: `Un byte tiene 8 bits. ¿Cuántos bits hay en ${n} bytes?`,
    answer: n * 8,
    explanation: `${n} × 8 = ${n * 8} bits.`,
  };
}

// ---------------------------------------------------------------------------
// Cifrado César y compresión
// ---------------------------------------------------------------------------

const ABC = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const shiftChar = (c: string, k: number) => ABC[(ABC.indexOf(c) + k + ABC.length) % ABC.length];
const caesarText = (w: string, k: number) => [...w].map((c) => shiftChar(c, k)).join("");
const CAESAR_WORDS = ["SOL", "MAR", "GATO", "LUNA", "CASA", "PERRO", "LIBRO", "ROBOT", "CLAVE", "DATOS", "NUBE", "RED"];

export function caesar(r: Rng, maxShift: number): Question {
  const w = r.pick(CAESAR_WORDS);
  const k = r.int(1, maxShift);
  const enc = caesarText(w, k);
  const decode = r.chance(0.5);
  const answer = decode ? w : enc;
  const wrong = decode
    ? [caesarText(enc, k), caesarText(w, 1 === k ? 2 : 1), ...CAESAR_WORDS.filter((x) => x.length === w.length && x !== w)]
    : [caesarText(w, -k), caesarText(w, k + 1), caesarText(w, Math.max(1, k - 1))];
  return {
    kind: "choice",
    prompt: decode
      ? `Este mensaje está cifrado con César corriendo cada letra ${k} lugar${k > 1 ? "es" : ""} hacia adelante: ${enc}. ¿Qué dice?`
      : `Cifra «${w}» con César: corre cada letra ${k} lugar${k > 1 ? "es" : ""} hacia adelante en el abecedario.`,
    visual: { kind: "code", text: ABC.split("").join(" ") },
    options: uniqueOptions(r, answer, wrong.filter((x) => x !== answer)),
    answer,
    explanation: `${w} con ${k} lugar${k > 1 ? "es" : ""} hacia adelante es ${enc}.`,
    tag: decode ? "descifrar" : "cifrar",
  };
}

function rleOf(s: string) {
  return s.replace(/(.)\1*/g, (m) => `${m.length}${m[0]}`);
}

export function rle(r: Rng): Question {
  const letters = r.shuffle(["A", "B", "C", "D"]).slice(0, r.int(2, 3));
  let s = "";
  letters.forEach((l, i) => {
    s += l.repeat(r.int(i === 0 ? 2 : 1, 5));
  });
  const code = rleOf(s);
  if (r.chance(0.5)) {
    return {
      kind: "choice",
      prompt: `Comprime «${s}» contando las letras repetidas (por ejemplo, AAAB → 3A1B).`,
      options: uniqueOptions(r, code, [rleOf(s + letters[0]), code.replace(/\d/, (d) => String(Number(d) + 1)), s.length + letters.join("")]),
      answer: code,
      explanation: `${s} → ${code}.`,
      tag: "comprimir",
    };
  }
  return {
    kind: "choice",
    prompt: `Descomprime «${code}» (por ejemplo, 3A1B → AAAB).`,
    options: uniqueOptions(r, s, [s + letters[0], s.slice(1), code.replace(/\d/g, "")]),
    answer: s,
    explanation: `${code} → ${s}.`,
    tag: "descomprimir",
  };
}

// ---------------------------------------------------------------------------
// Pseudocódigo
// ---------------------------------------------------------------------------

const VARS = ["puntos", "monedas", "vidas", "x", "total", "estrellas"];

export function pseudocode(r: Rng, level: 1 | 2 | 3 | 4): Question {
  const name = r.pick(VARS);
  let code = "";
  let result = 0;
  if (level === 1) {
    let x = r.int(0, 10);
    code = `${name} = ${x}`;
    for (let i = 0; i < r.int(2, 3); i++) {
      if (r.chance(0.6) || x < 3) {
        const k = r.int(1, 9);
        x += k;
        code += `\n${name} = ${name} + ${k}`;
      } else {
        const k = r.int(1, Math.min(9, x));
        x -= k;
        code += `\n${name} = ${name} - ${k}`;
      }
    }
    result = x;
  } else if (level === 2) {
    const start = r.int(0, 10);
    const n = r.int(2, 5);
    const k = r.int(2, 6);
    code = `${name} = ${start}\nrepetir ${n} veces:\n    ${name} = ${name} + ${k}`;
    result = start + n * k;
  } else if (level === 3) {
    const x = r.int(1, 20);
    const lim = r.int(5, 15);
    const mul = r.int(2, 3);
    const add = r.int(5, 10);
    code = `${name} = ${x}\nsi ${name} > ${lim} entonces:\n    ${name} = ${name} * ${mul}\nsi no:\n    ${name} = ${name} + ${add}`;
    result = x > lim ? x * mul : x + add;
  } else {
    const list = Array.from({ length: r.int(4, 6) }, () => r.int(1, 12));
    const kind = r.int(0, 2);
    const k = r.int(4, 8);
    if (kind === 0) {
      code = `lista = [${list.join(", ")}]\n${name} = 0\npara cada n en lista:\n    si n es par entonces:\n        ${name} = ${name} + n`;
      result = list.filter((n) => n % 2 === 0).reduce((s, n) => s + n, 0);
    } else if (kind === 1) {
      code = `lista = [${list.join(", ")}]\n${name} = 0\npara cada n en lista:\n    si n > ${k} entonces:\n        ${name} = ${name} + 1`;
      result = list.filter((n) => n > k).length;
    } else {
      code = `lista = [${list.join(", ")}]\n${name} = lista[1]\npara cada n en lista:\n    si n > ${name} entonces:\n        ${name} = n`;
      result = Math.max(...list);
    }
  }
  code += `\nmostrar ${name}`;
  return {
    kind: "number",
    prompt: "¿Qué número muestra el programa al final?",
    visual: { kind: "code", text: code },
    answer: result,
    explanation: `Siguiendo el programa paso a paso, ${name} termina valiendo ${result}.`,
    tag: `nivel-${level}`,
  };
}

// ---------------------------------------------------------------------------
// Lógica booleana
// ---------------------------------------------------------------------------

const TF = (b: boolean) => (b ? "VERDADERO" : "FALSO");

function comparison(r: Rng): [string, boolean] {
  const a = r.int(1, 20);
  const b = r.int(1, 20);
  const op = r.pick([">", "<", "="]);
  const val = op === ">" ? a > b : op === "<" ? a < b : a === b;
  return [`${a} ${op} ${b}`, val];
}

export function booleanEval(r: Rng, level: 1 | 2 | 3): Question {
  let expr = "";
  let val = false;
  if (level === 1) {
    const form = r.int(0, 2);
    const a = r.chance(0.5);
    const b = r.chance(0.5);
    const c = r.chance(0.5);
    const op = r.pick(["Y", "O"]);
    if (form === 0) {
      expr = `${TF(a)} ${op} ${TF(b)}`;
      val = op === "Y" ? a && b : a || b;
    } else if (form === 1) {
      expr = `NO ${TF(a)}`;
      val = !a;
    } else {
      expr = `${TF(a)} ${op} ${TF(b)} ${op} ${TF(c)}`;
      val = op === "Y" ? a && b && c : a || b || c;
    }
  } else if (level === 2) {
    const [e1, v1] = comparison(r);
    const [e2, v2] = comparison(r);
    const op = r.pick(["Y", "O"]);
    expr = `(${e1}) ${op} (${e2})`;
    val = op === "Y" ? v1 && v2 : v1 || v2;
  } else {
    const [e1, v1] = comparison(r);
    const [e2, v2] = comparison(r);
    const op = r.pick(["Y", "O"]);
    const negFirst = r.chance(0.5);
    expr = `${negFirst ? "NO " : ""}(${e1}) ${op} ${negFirst ? "" : "NO "}(${e2})`;
    const a = negFirst ? !v1 : v1;
    const b = negFirst ? v2 : !v2;
    val = op === "Y" ? a && b : a || b;
  }
  return {
    kind: "choice",
    prompt: "¿Cuál es el resultado? (Y: las dos deben ser verdaderas · O: basta una · NO: invierte)",
    visual: { kind: "code", text: expr },
    options: ["VERDADERO", "FALSO"],
    answer: TF(val),
    explanation: `${expr} → ${TF(val)}.`,
    tag: `nivel-${level}`,
  };
}

// ---------------------------------------------------------------------------
// Algoritmos: ordenamiento y búsqueda
// ---------------------------------------------------------------------------

function distinctList(r: Rng, n: number, max = 50) {
  const set = new Set<number>();
  while (set.size < n) set.add(r.int(1, max));
  return [...set];
}

const fmt = (l: number[]) => `[${l.join(", ")}]`;

export function bubblePass(r: Rng): Question {
  for (;;) {
    const list = distinctList(r, 5, 30);
    const after = [...list];
    for (let i = 0; i < after.length - 1; i++) if (after[i] > after[i + 1]) [after[i], after[i + 1]] = [after[i + 1], after[i]];
    const sorted = [...list].sort((a, b) => a - b);
    const firstSwap = [...list];
    if (firstSwap[0] > firstSwap[1]) [firstSwap[0], firstSwap[1]] = [firstSwap[1], firstSwap[0]];
    const wrong = [fmt(sorted), fmt(list), fmt(firstSwap), fmt([...after].reverse())].filter((x) => x !== fmt(after));
    if (wrong.length < 2) continue;
    return {
      kind: "choice",
      prompt: "Ordenamiento burbuja: recorre la lista de izquierda a derecha y, si un número es mayor que el siguiente, los intercambia. ¿Cómo queda la lista después de UNA pasada?",
      visual: { kind: "code", text: fmt(list) },
      options: uniqueOptions(r, fmt(after), wrong),
      answer: fmt(after),
      explanation: `Después de una pasada: ${fmt(after)} (el mayor, ${Math.max(...list)}, llega al final).`,
    };
  }
}

export function linearSearch(r: Rng): Question {
  const list = distinctList(r, r.int(6, 8));
  const i = r.int(0, list.length - 1);
  return {
    kind: "number",
    prompt: `Búsqueda lineal: se revisa la lista de izquierda a derecha, uno por uno. ¿Cuántos números hay que revisar para encontrar el ${list[i]}?`,
    visual: { kind: "code", text: fmt(list) },
    answer: i + 1,
    explanation: `El ${list[i]} está en la posición ${i + 1}: se revisan ${i + 1} números.`,
  };
}

function binarySteps(list: number[], target: number) {
  let lo = 0;
  let hi = list.length - 1;
  const seen: number[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    seen.push(list[mid]);
    if (list[mid] === target) break;
    if (list[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return seen;
}

export function binarySearch(r: Rng, size: 7 | 15): Question {
  const list = distinctList(r, size, 99).sort((a, b) => a - b);
  const target = r.pick(list);
  const seen = binarySteps(list, target);
  if (r.chance(0.5)) {
    const first = String(seen[0]);
    return {
      kind: "choice",
      prompt: `Búsqueda binaria del ${target} en esta lista ordenada: ¿con qué número se compara primero?`,
      visual: { kind: "code", text: fmt(list) },
      options: uniqueOptions(r, first, [String(list[0]), String(list[list.length - 1]), String(target), String(list[1])].filter((x) => x !== first)),
      answer: first,
      explanation: "La búsqueda binaria empieza siempre por el número del medio.",
      tag: "primero",
    };
  }
  return {
    kind: "number",
    prompt: `Búsqueda binaria: se mira el número del medio y se descarta la mitad donde no puede estar. ¿Cuántas comparaciones hacen falta para encontrar el ${target}?`,
    visual: { kind: "code", text: fmt(list) },
    answer: seen.length,
    explanation: `Se compara con ${seen.join(" → ")}: ${seen.length} comparaciones.`,
    tag: "pasos",
  };
}

const ITEMS = ["🍎", "🍌", "🍇", "⚽", "🎈", "🚗", "📘", "🐶", "⭐"];

export function listIndex(r: Rng): Question {
  const list = r.shuffle(ITEMS).slice(0, r.int(4, 6));
  if (r.chance(0.3)) {
    return {
      kind: "number",
      prompt: "¿Cuántos elementos tiene la lista? (su longitud)",
      visual: { kind: "code", text: `lista = [${list.join(", ")}]` },
      answer: list.length,
      explanation: `La lista tiene ${list.length} elementos.`,
    };
  }
  const i = r.int(1, list.length);
  return {
    kind: "choice",
    prompt: `Las posiciones empiezan en 1. ¿Qué hay en lista[${i}]?`,
    visual: { kind: "code", text: `lista = [${list.join(", ")}]` },
    options: uniqueOptions(r, list[i - 1], list.filter((x) => x !== list[i - 1])),
    answer: list[i - 1],
    explanation: `La posición ${i} tiene ${list[i - 1]}.`,
  };
}

// ---------------------------------------------------------------------------
// Píxeles y bases de datos
// ---------------------------------------------------------------------------

const toPixels = (bits: string) => [...bits].map((b) => (b === "1" ? "⬛" : "⬜")).join("");

export function pixelRow(r: Rng): Question {
  const n = r.int(4, 6);
  const bits = Array.from({ length: n }, () => (r.chance(0.5) ? "1" : "0")).join("");
  const flip = (s: string, i: number) => s.slice(0, i) + (s[i] === "1" ? "0" : "1") + s.slice(i + 1);
  const wrongBits = [flip(bits, 0), flip(bits, n - 1), [...bits].reverse().join(""), [...bits].map((b) => (b === "1" ? "0" : "1")).join("")].filter((b) => b !== bits);
  if (r.chance(0.5)) {
    return {
      kind: "choice",
      prompt: `Código de la imagen: 1 = ⬛ y 0 = ⬜. ¿Qué fila de píxeles corresponde a ${bits}?`,
      options: uniqueOptions(r, toPixels(bits), wrongBits.map(toPixels)),
      answer: toPixels(bits),
      explanation: `${bits} → ${toPixels(bits)}.`,
    };
  }
  return {
    kind: "choice",
    prompt: "Código de la imagen: 1 = ⬛ y 0 = ⬜. ¿Qué código tiene esta fila de píxeles?",
    visual: { kind: "text", text: toPixels(bits) },
    options: uniqueOptions(r, bits, wrongBits),
    answer: bits,
    explanation: `${toPixels(bits)} → ${bits}.`,
  };
}

const NAMES = ["Ana", "Luis", "Rosa", "Pedro", "Sofía", "Mateo", "Lucía", "Diego"];
const COLORS = ["azul", "rojo", "verde"];

export function dbFilter(r: Rng, level: 1 | 2): Question {
  const rows = r.shuffle(NAMES).slice(0, 5).map((n) => ({ name: n, age: r.int(7, 12), color: r.pick(COLORS) }));
  const cells = [["Nombre", "Edad", "Color"], ...rows.map((x) => [x.name, String(x.age), x.color])];
  const k = r.int(8, 10);
  if (level === 1) {
    const n = rows.filter((x) => x.age > k).length;
    return {
      kind: "number",
      prompt: `Cada fila es un registro. ¿Cuántos registros tienen Edad mayor que ${k}?`,
      visual: { kind: "sheet", cells },
      answer: n,
      explanation: `Tienen más de ${k} años: ${rows.filter((x) => x.age > k).map((x) => x.name).join(", ") || "nadie"}.`,
    };
  }
  const c = r.pick(COLORS);
  const hits = rows.filter((x) => x.age > k && x.color === c);
  return {
    kind: "number",
    prompt: `Filtro: Edad > ${k} Y Color = ${c}. ¿Cuántos registros cumplen las dos condiciones?`,
    visual: { kind: "sheet", cells },
    answer: hits.length,
    explanation: `Cumplen las dos: ${hits.map((x) => x.name).join(", ") || "nadie"}.`,
  };
}

export { numberOptions };
