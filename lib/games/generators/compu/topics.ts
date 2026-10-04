import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";

// Generadores de los apartados «Programación y software», «Scratch» e «IA».
// Los bloques de Scratch se muestran como texto con su nombre en castellano.

// ---------------------------------------------------------------------------
// Scratch: los programas se escriben en la sintaxis de scratchblocks (inglés)
// y se dibujan como bloques reales traducidos al castellano de Scratch.
// ---------------------------------------------------------------------------

const scratch = (lines: string[], title?: string) => ({ kind: "scratch" as const, code: lines.join("\n"), title });
const FLAG = "when flag clicked";

// Movimiento: bloques sueltos (nivel 1) o dentro de «repetir» (nivel 2).
export function scratchSteps(r: Rng, level: 1 | 2): Question {
  if (level === 1) {
    const moves = Array.from({ length: r.int(2, 4) }, () => r.pick([5, 10, 10, 20]));
    const total = moves.reduce((s, x) => s + x, 0);
    return {
      kind: "number",
      prompt: "¿Cuántos pasos se mueve el gato en total?",
      visual: scratch([FLAG, ...moves.map((m) => `move (${m}) steps`)]),
      answer: total,
      explanation: `${moves.join(" + ")} = ${total} pasos.`,
    };
  }
  const n = r.int(2, 6);
  const k = r.pick([5, 10, 15, 20]);
  const extra = r.chance(0.5) ? r.pick([5, 10]) : 0;
  const lines = [FLAG, `repeat (${n})`, `move (${k}) steps`, "end"];
  if (extra) lines.push(`move (${extra}) steps`);
  return {
    kind: "number",
    prompt: "¿Cuántos pasos se mueve el gato en total?",
    visual: scratch(lines),
    answer: n * k + extra,
    explanation: `${n} × ${k}${extra ? ` + ${extra}` : ""} = ${n * k + extra} pasos.`,
  };
}

// Disfraces: el objeto tiene c disfraces y empieza en el 1.
export function scratchCostume(r: Rng): Question {
  const c = r.int(2, 4);
  const n = r.int(1, 7);
  const end = (n % c) + 1;
  return {
    kind: "number",
    prompt: `El objeto tiene ${c} disfraces y empieza con el disfraz 1. Después del último vuelve al primero. ¿Con qué disfraz termina?`,
    visual: scratch([FLAG, `repeat (${n})`, "next costume", "end"]),
    answer: end,
    explanation: `Avanza ${n} veces dando la vuelta cada ${c}: termina en el disfraz ${end}.`,
  };
}

// Coordenadas: nivel 1 solo x; nivel 2 x e y.
export function scratchXY(r: Rng, level: 1 | 2): Question {
  let x = r.pick([0, 0, -50, 50, 100]);
  let y = level === 1 ? 0 : r.pick([0, 0, -50, 50]);
  const lines = [FLAG, `go to x: (${x}) y: (${y})`];
  for (let i = 0; i < r.int(2, 3); i++) {
    const k = r.pick([10, 20, 30, 50]) * (r.chance(0.6) ? 1 : -1);
    if (level === 1 || r.chance(0.5)) {
      x += k;
      lines.push(`change x by (${k})`);
    } else {
      y += k;
      lines.push(`change y by (${k})`);
    }
  }
  if (level === 1) {
    return {
      kind: "choice",
      prompt: "«sumar a x» mueve el objeto a la derecha (+) o a la izquierda (−). ¿Cuánto vale x al final?",
      visual: scratch(lines),
      options: uniqueOptions(r, String(x), [x + 10, x - 10, x + 20, -x].filter((v) => v !== x).map(String)),
      answer: String(x),
      explanation: `x termina en ${x}.`,
    };
  }
  const answer = `x: ${x}, y: ${y}`;
  return {
    kind: "choice",
    prompt: "«sumar a x» mueve a los lados y «sumar a y» arriba (+) o abajo (−). ¿En qué posición termina el objeto?",
    visual: scratch(lines),
    options: uniqueOptions(r, answer, [`x: ${y}, y: ${x}`, `x: ${x + 10}, y: ${y}`, `x: ${x}, y: ${y - 10}`, `x: ${-x}, y: ${y}`].filter((o) => o !== answer)),
    answer,
    explanation: `Al final: x = ${x}, y = ${y}.`,
  };
}

const SCRATCH_VARS = ["puntos", "vidas", "monedas", "nivel"];

// Variables: nivel 1 dar valor/sumar; 2 dentro de repetir; 3 con «si ... entonces».
export function scratchVariable(r: Rng, level: 1 | 2 | 3): Question {
  const v = r.pick(SCRATCH_VARS);
  let value = r.int(0, 10);
  const lines = [FLAG, `set [${v} v] to (${value})`];
  if (level === 1) {
    for (let i = 0; i < r.int(2, 3); i++) {
      let k = r.int(-5, 10) || 3;
      if (value + k < 0) k = -k;
      value += k;
      lines.push(`change [${v} v] by (${k})`);
    }
  } else if (level === 2) {
    const n = r.int(2, 5);
    const k = r.int(2, 10);
    lines.push(`repeat (${n})`, `change [${v} v] by (${k})`, "end");
    value += n * k;
  } else {
    const n = r.int(2, 5);
    const k = r.int(2, 6);
    value += n * k;
    const lim = r.int(5, 30);
    const bonus = r.pick([5, 10, -5]);
    lines.push(`repeat (${n})`, `change [${v} v] by (${k})`, "end", `if <(${v}) > (${lim})> then`, `change [${v} v] by (${bonus})`, "end");
    if (value > lim) value += bonus;
  }
  return {
    kind: "number",
    prompt: `«dar a ... el valor» pone un número y «sumar a ...» lo aumenta. ¿Cuánto vale «${v}» al final?`,
    visual: scratch(lines),
    answer: value,
    explanation: `Siguiendo los bloques, ${v} termina valiendo ${value}.`,
    tag: `nivel-${level}`,
  };
}

export function scratchOperators(r: Rng): Question {
  const words = ["hola", "gato", "sol", "luna", "mar", "casa"];
  const form = r.int(0, 3);
  if (form === 0) {
    const [a, b] = r.shuffle(words).slice(0, 2);
    return {
      kind: "choice",
      prompt: "«unir» pega dos textos. ¿Qué dice el gato?",
      visual: scratch([FLAG, `say (join [${a}] [${b}])`]),
      options: uniqueOptions(r, a + b, [b + a, `${a} ${b}`, a]),
      answer: a + b,
      explanation: `«unir» pega los dos textos: ${a + b}.`,
    };
  }
  if (form === 1) {
    const w = r.pick(words);
    return {
      kind: "number",
      prompt: "«longitud de» cuenta las letras. ¿Qué número dice el gato?",
      visual: scratch([FLAG, `say (length of [${w}])`]),
      answer: w.length,
      explanation: `«${w}» tiene ${w.length} letras.`,
    };
  }
  if (form === 2) {
    const a = r.int(5, 30);
    const b = r.pick([2, 3, 5]);
    return {
      kind: "number",
      prompt: "«módulo» da lo que sobra al dividir. ¿Qué número dice el gato?",
      visual: scratch([FLAG, `say ((${a}) mod (${b}))`]),
      answer: a % b,
      explanation: `${a} ÷ ${b} sobra ${a % b}.`,
    };
  }
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  return {
    kind: "number",
    prompt: "Primero se calcula el bloque de adentro. ¿Qué número dice el gato?",
    visual: scratch([FLAG, `say (((${a}) + (${b})) * (2))`]),
    answer: (a + b) * 2,
    explanation: `(${a} + ${b}) × 2 = ${(a + b) * 2}.`,
  };
}

export function scratchRandom(r: Rng): Question {
  const a = r.int(1, 5);
  const b = a + r.int(3, 9);
  const outside = r.chance(0.5) ? a - r.int(1, a) : b + r.int(1, 5);
  const inside = r.shuffle(Array.from({ length: b - a + 1 }, (_, i) => a + i)).slice(0, 3);
  return {
    kind: "choice",
    prompt: "¿Qué número NO puede decir el gato?",
    visual: scratch([FLAG, `say (pick random (${a}) to (${b}))`]),
    options: r.shuffle([String(outside), ...inside.map(String)]),
    answer: String(outside),
    explanation: `Solo salen números del ${a} al ${b}; el ${outside} no.`,
  };
}

const LIST_ITEMS = ["manzana", "pera", "uva", "pelota", "lápiz", "libro", "globo"];

export function scratchList(r: Rng): Question {
  const list: string[] = [];
  const lines = [FLAG, "delete all of [mochila v]"];
  for (let i = 0; i < r.int(3, 5); i++) {
    if (list.length >= 2 && r.chance(0.25)) {
      list.splice(0, 1);
      lines.push("delete (1) of [mochila v]");
    } else {
      const it = r.pick(LIST_ITEMS);
      list.push(it);
      lines.push(`add [${it}] to [mochila v]`);
    }
  }
  if (r.chance(0.5) || list.length === 0) {
    return {
      kind: "number",
      prompt: "¿Cuántos elementos tiene la lista «mochila» al final?",
      visual: scratch(lines),
      answer: list.length,
      explanation: `La lista queda: ${list.join(", ") || "vacía"}.`,
    };
  }
  const i = r.int(1, list.length);
  return {
    kind: "choice",
    prompt: `¿Qué hay en el elemento ${i} de «mochila» al final?`,
    visual: scratch(lines),
    options: uniqueOptions(r, list[i - 1], LIST_ITEMS.filter((x) => x !== list[i - 1])),
    answer: list[i - 1],
    explanation: `La lista queda: ${list.join(", ")}.`,
  };
}

export function scratchMyBlock(r: Rng): Question {
  const k = r.pick([2, 3, 5, 10]);
  const calls = Array.from({ length: r.int(2, 3) }, () => r.int(1, 10));
  const total = calls.reduce((s, c) => s + c * k, 0);
  return {
    kind: "number",
    prompt: "«avanzar» es un bloque propio (rosado). ¿Cuántos pasos se mueve el objeto en total?",
    visual: scratch([`define avanzar (n)`, `move ((n) * (${k})) steps`, "", FLAG, ...calls.map((c) => `avanzar (${c})`)]),
    answer: total,
    explanation: `${calls.map((c) => `${c} × ${k}`).join(" + ")} = ${total}.`,
  };
}

// ---------------------------------------------------------------------------
// Programación
// ---------------------------------------------------------------------------

// Expresiones: nivel 1 con paréntesis; nivel 2 con prioridad de × sobre +.
export function expression(r: Rng, level: 1 | 2): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 5);
  if (level === 1) {
    // La resta solo si no da negativo.
    const form = a * c > b + 1 ? r.int(0, 1) : 0;
    const text = form === 0 ? `(${a} + ${b}) × ${c}` : `${a * c} - (${b} + 1)`;
    const value = form === 0 ? (a + b) * c : a * c - (b + 1);
    return {
      kind: "number",
      prompt: "La computadora calcula primero lo que está entre paréntesis. ¿Cuál es el resultado?",
      visual: { kind: "code", text },
      answer: value,
      explanation: `${text} = ${value}.`,
    };
  }
  const form = a * c > b ? r.int(0, 1) : 0;
  const text = form === 0 ? `${a} + ${b} × ${c}` : `${a} × ${c} - ${b}`;
  const value = form === 0 ? a + b * c : a * c - b;
  return {
    kind: "number",
    prompt: "Como en matemática, la computadora multiplica antes de sumar o restar. ¿Cuál es el resultado?",
    visual: { kind: "code", text },
    answer: value,
    explanation: `${text} = ${value}.`,
  };
}

export function comparisonExpr(r: Rng): Question {
  const a = r.int(1, 20);
  const b = r.int(1, 20);
  const op = r.pick([">", "<", "==", "!=", ">=", "<="]);
  const val = { ">": a > b, "<": a < b, "==": a === b, "!=": a !== b, ">=": a >= b, "<=": a <= b }[op]!;
  return {
    kind: "choice",
    prompt: "¿La comparación es verdadera o falsa? (== igual · != distinto · >= mayor o igual · <= menor o igual)",
    visual: { kind: "code", text: `${a} ${op} ${b}` },
    options: ["Verdadero", "Falso"],
    answer: val ? "Verdadero" : "Falso",
    explanation: `${a} ${op} ${b} es ${val ? "verdadero" : "falso"}.`,
  };
}

// Funciones: nivel 1 un parámetro; 2 dos parámetros; 3 llamadas anidadas.
export function functionCall(r: Rng, level: 1 | 2 | 3): Question {
  const k = r.int(2, 5);
  const x = r.int(2, 10);
  const y = r.int(2, 10);
  let lines: string[];
  let value: number;
  if (level === 1) {
    lines = [`función multiplicar_por_${k}(n):`, `    devolver n * ${k}`, "", `mostrar multiplicar_por_${k}(${x})`];
    value = x * k;
  } else if (level === 2) {
    const add = r.chance(0.5);
    lines = [add ? "función sumar(a, b):" : "función mayor(a, b):", add ? "    devolver a + b" : "    si a > b: devolver a\n    si no: devolver b", "", `mostrar ${add ? "sumar" : "mayor"}(${x}, ${y})`];
    value = add ? x + y : Math.max(x, y);
  } else {
    lines = ["función doble(n):", "    devolver n * 2", "", "función sumar(a, b):", "    devolver a + b", "", `mostrar sumar(doble(${x}), ${y})`];
    value = x * 2 + y;
  }
  return {
    kind: "number",
    prompt: "¿Qué número muestra el programa?",
    visual: { kind: "code", text: lines.join("\n") },
    answer: value,
    explanation: `El resultado es ${value}.`,
    tag: `nivel-${level}`,
  };
}

// Bucle con contador: suma de 1..n, o de k en k.
export function countLoop(r: Rng, level: 1 | 2): Question {
  const n = r.int(2, level === 1 ? 16 : 10);
  if (level === 1) {
    return {
      kind: "number",
      prompt: "¿Qué número muestra el programa?",
      visual: { kind: "code", text: `total = 0\npara i desde 1 hasta ${n}:\n    total = total + i\nmostrar total` },
      answer: (n * (n + 1)) / 2,
      explanation: `${Array.from({ length: n }, (_, i) => i + 1).join(" + ")} = ${(n * (n + 1)) / 2}.`,
    };
  }
  const k = r.int(2, 4);
  let total = 0;
  const seen: number[] = [];
  for (let i = k; i <= n * k; i += k) {
    if (i % 2 === 0) {
      total += i;
      seen.push(i);
    }
  }
  return {
    kind: "number",
    prompt: "¿Qué número muestra el programa?",
    visual: { kind: "code", text: `total = 0\npara i desde ${k} hasta ${n * k} de ${k} en ${k}:\n    si i es par:\n        total = total + i\nmostrar total` },
    answer: total,
    explanation: `Se suman los pares: ${seen.join(" + ") || "ninguno"} = ${total}.`,
  };
}

// ---------------------------------------------------------------------------
// Inteligencia artificial
// ---------------------------------------------------------------------------

export const LABELS: Record<string, string[]> = {
  Fruta: ["🍎", "🍌", "🍇", "🍐", "🍓", "🍍", "🍉", "🥝"],
  Animal: ["🐶", "🐱", "🐮", "🐸", "🦁", "🐰", "🐔", "🐟"],
  Vehículo: ["🚗", "🚌", "🚲", "✈️", "⛵", "🚂", "🚚", "🛵"],
  Ropa: ["👕", "👗", "👞", "🧢", "🧤", "👢", "🧦", "🧣"],
};

// Etiquetar datos (aprendizaje supervisado): ¿qué etiqueta lleva?
export function labelData(r: Rng): Question {
  const label = r.pick(Object.keys(LABELS));
  const e = r.pick(LABELS[label]);
  return {
    kind: "choice",
    prompt: "Estamos preparando datos para entrenar una IA. ¿Qué etiqueta le ponemos a esta imagen?",
    visual: { kind: "picture", emoji: e },
    options: Object.keys(LABELS),
    answer: label,
    explanation: `${e} es ${label.toLowerCase()}: esa es su etiqueta.`,
    tag: label,
  };
}

// Ejemplos para enseñar una categoría.
export function trainingExamples(r: Rng): Question {
  const label = r.pick(Object.keys(LABELS));
  const hits = r.shuffle(LABELS[label]).slice(0, r.int(2, 3));
  const others = r.shuffle(Object.entries(LABELS).filter(([k]) => k !== label).flatMap(([, v]) => v)).slice(0, 6 - hits.length);
  return {
    kind: "multi",
    prompt: `Queremos enseñarle a una IA qué es «${label.toLowerCase()}». Selecciona los ejemplos que sirven.`,
    options: r.shuffle([...hits, ...others]),
    answers: hits,
    explanation: `Sirven los ejemplos de ${label.toLowerCase()}: ${hits.join(" ")}.`,
    tag: label,
  };
}

// [tema, femenino] para concordar «parecidos/parecidas», «todos/todas».
const SUBJECTS: [string, boolean][] = [
  ["gatos", false], ["perros", false], ["flores", true], ["autos", false], ["manzanas", true], ["pájaros", false],
  ["árboles", false], ["zapatos", false], ["peces", false], ["casas", true], ["bicicletas", true], ["caballos", false],
  ["mariposas", true], ["montañas", true], ["pelotas", true], ["llamas", true],
];

// ¿Qué conjunto de datos entrena mejor a la IA? (variedad y cantidad)
export function betterDataset(r: Rng): Question {
  const [s, fem] = r.pick(SUBJECTS);
  const answer = `Mil fotos de ${s} de muchos tipos`;
  return {
    kind: "choice",
    prompt: `Queremos que una IA reconozca ${s}. ¿Qué datos de entrenamiento son mejores?`,
    options: uniqueOptions(r, answer, [
      `Tres fotos de ${s} muy ${fem ? "parecidas" : "parecidos"}`,
      `Mil fotos de ${s} ${fem ? "todas iguales" : "todos iguales"}`,
      `Mil fotos de cosas que no son ${s}`,
    ]),
    answer,
    explanation: "Muchos ejemplos y variados ayudan a la IA a reconocer bien en situaciones nuevas.",
    tag: s,
  };
}

const PROMPT_TASKS: [task: string, good: string][] = [
  ["una adivinanza", "Escribe una adivinanza fácil sobre un animal de la selva peruana"],
  ["una lista", "Haz una lista de 5 frutas del Perú con un dato curioso de cada una"],
  ["una receta", "Dame una receta sencilla de ensalada de frutas para hacer con un adulto"],
  ["un dibujo", "Dibuja un gato astronauta en la Luna, estilo caricatura y con colores alegres"],
  ["un horario", "Organiza un horario de estudio de 1 hora para repasar matemática y lectura"],
  ["preguntas", "Hazme 5 preguntas de práctica sobre los planetas para quinto grado"],
  ["una carta", "Ayúdame a escribir una carta corta para agradecer a mi profesora"],
  ["un título", "Propón 3 títulos para un cuento sobre un robot que cuida plantas"],
  ["un ejemplo", "Dame un ejemplo de algoritmo para preparar un sándwich, en 5 pasos"],
  ["un chiste", "Cuéntame un chiste corto y amable sobre matemáticas para niños"],
  ["un cuento", "Escribe un cuento corto sobre un perro que aprende a nadar, para niños de 8 años"],
  ["un resumen", "Resume en 5 líneas qué es la fotosíntesis, con palabras sencillas"],
  ["ideas", "Dame 3 ideas de experimentos de ciencia seguros para hacer en casa"],
  ["una explicación", "Explica qué es una fracción con un ejemplo de pizza, para cuarto grado"],
  ["un poema", "Escribe un poema de 4 versos sobre el mar que rime"],
];

// Instrucciones claras para una IA (prompts).
export function promptQuality(r: Rng): Question {
  const [task, good] = r.pick(PROMPT_TASKS);
  return {
    kind: "choice",
    prompt: `Quieres pedirle a una IA ${task}. ¿Qué instrucción es mejor?`,
    options: uniqueOptions(r, good, [
      `Haz ${task}`,
      `Quiero algo, no sé qué, puede ser ${task} o cualquier otra cosa`,
      `${task.charAt(0).toUpperCase()}${task.slice(1)}, rápido, ya, ahora mismo, sin preguntar nada más`,
    ]),
    answer: good,
    explanation: "Una buena instrucción dice qué quieres, sobre qué tema, para quién y de qué tamaño.",
  };
}
