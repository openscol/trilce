import type { Rng } from "../rng";
import type { Question } from "../types";
import { uniqueOptions } from "./common";

// Decimales (3.° en adelante). Se trabaja en centésimos (enteros) para no
// tener errores de redondeo, y se escribe con coma decimal: 3,47.

// Centésimos → texto con `places` decimales: dec(347, 2) = "3,47".
export function dec(hundredths: number, places: 1 | 2 = 2) {
  const whole = Math.floor(hundredths / 100);
  const rest = hundredths % 100;
  return places === 1 ? `${whole},${Math.floor(rest / 10)}` : `${whole},${String(rest).padStart(2, "0")}`;
}

const SYMBOLS = ["<", "=", ">"];
const symbol = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

function choice(r: Rng, prompt: string, answer: string, distractors: string[], explanation: string, visual?: Question["visual"], tag?: string): Question {
  return { kind: "choice", prompt, visual, options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)), answer, explanation, tag };
}

// 3.° R.1: leer un decimal (décimos) en una recta entre dos enteros.
export function decimalOnLine(r: Rng): Question {
  const base = r.int(0, 9);
  const k = r.int(1, 9);
  const answer = `${base},${k}`;
  return choice(
    r,
    "¿Qué número decimal marca el punto?",
    answer,
    [`${base},${k === 9 ? 8 : k + 1}`, `${base},${k === 1 ? 2 : k - 1}`, `${base + 1},${k}`, `${k},${base}`],
    `Entre ${base} y ${base + 1} hay 10 partes iguales (décimos); el punto está en la ${k}.ª: ${answer}.`,
    { kind: "fractionLine", parts: 10, marked: k, labels: [String(base), String(base + 1)] }
  );
}

// 3.° R.2: la misma marca como fracción y como decimal.
export function fractionAsDecimalLine(r: Rng): Question {
  const k = r.int(1, 9);
  const visual = { kind: "fractionLine" as const, parts: 10, marked: k };
  return r.chance(0.5)
    ? choice(r, `El punto marca ${k}/10. ¿Qué número decimal es?`, `0,${k}`, [`${k},0`, `0,0${k}`, `${k},10`, `1,${k}`], `${k}/10 son ${k} décimos: 0,${k}.`, visual, "fraccion-a-decimal")
    : choice(r, `El punto marca 0,${k}. ¿Qué fracción es?`, `${k}/10`, [`${k}/100`, `10/${k}`, `1/${k}`, `${k}/1`], `0,${k} son ${k} décimos: ${k}/10.`, visual, "decimal-a-fraccion");
}

// 3.° R.3: modelos de décimos (barra) y centésimos (cuadrícula).
export function decimalModel(r: Rng): Question {
  if (r.chance(0.5)) {
    const k = r.int(1, 9);
    const visual = { kind: "fraction" as const, shape: "bar" as const, parts: 10, shaded: k };
    return r.chance(0.5)
      ? choice(r, "¿Qué número decimal muestra la parte sombreada?", `0,${k}`, [`${k},0`, `0,0${k}`, `0,${10 - k}`, `1,${k}`], `Hay ${k} de 10 partes sombreadas: ${k} décimos = 0,${k}.`, visual, "decimos")
      : choice(r, "¿Qué fracción muestra la parte sombreada?", `${k}/10`, [`${k}/100`, `${10 - k}/10`, `10/${k}`, `1/${k}`], `Hay ${k} de 10 partes sombreadas: ${k}/10.`, visual, "decimos");
  }
  const n = r.int(11, 99);
  const visual = { kind: "decimalGrid" as const, hundredths: n };
  const t = Math.floor(n / 10);
  const u = n % 10;
  return r.chance(0.5)
    ? choice(r, "La cuadrícula tiene 100 casillas. ¿Qué número decimal está sombreado?", dec(n), [`${t},${u}`, dec(u * 10 + t), `${n},0`, `0,${String(100 - n).padStart(2, "0")}`], `Hay ${n} de 100 casillas sombreadas: ${n} centésimos = ${dec(n)}.`, visual, "centesimos")
    : choice(r, "La cuadrícula tiene 100 casillas. ¿Qué fracción está sombreada?", `${n}/100`, [`${n}/10`, `${100 - n}/100`, `${t}/10`, `100/${n}`], `Hay ${n} de 100 casillas sombreadas: ${n}/100.`, visual, "centesimos");
}

// 3.° R.4: valor posicional en decimales.
export function decimalPlaceValue(r: Rng): Question {
  const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const [d, u, t, c] = digits;
  const text = `${d}${u},${t}${c}`;
  const places = [
    { name: "decenas", digit: d },
    { name: "unidades", digit: u },
    { name: "décimos", digit: t },
    { name: "centésimos", digit: c },
  ];
  const p = r.pick(places);
  if (r.chance(0.5)) {
    return { kind: "number", prompt: `En ${text}, ¿qué cifra está en el lugar de los ${p.name}?`, visual: { kind: "text", text }, answer: p.digit, explanation: `Después de la coma van los décimos y luego los centésimos. En los ${p.name} está el ${p.digit}.`, tag: p.name };
  }
  return choice(r, `En ${text}, ¿qué valor tiene la cifra ${p.digit}?`, `${p.digit} ${p.name}`, places.map((x) => `${p.digit} ${x.name}`), `El ${p.digit} está en el lugar de los ${p.name}.`, { kind: "text", text }, p.name);
}

// 3.° R.5: redondear decimales a la unidad o al décimo.
export function roundDecimal(r: Rng): Question {
  if (r.chance(0.5)) {
    const whole = r.int(0, 30);
    const tenth = r.int(1, 9);
    const answer = tenth >= 5 ? whole + 1 : whole;
    return { kind: "number", prompt: `Redondea ${whole},${tenth} a la unidad más cercana.`, visual: { kind: "text", text: `${whole},${tenth}` }, answer, explanation: `El décimo es ${tenth}: ${tenth >= 5 ? "es 5 o más, se sube" : "es menos que 5, se queda"}. Resultado: ${answer}.`, tag: "a-la-unidad" };
  }
  const n = r.int(11, 989);
  if (n % 10 === 0) return roundDecimal(r);
  const rounded = Math.round(n / 10) * 10;
  const down = Math.floor(n / 10) * 10;
  return choice(r, `Redondea ${dec(n)} al décimo más cercano.`, dec(rounded, 1), [dec(down === rounded ? down + 10 : down, 1), dec(rounded + 10, 1), dec(Math.max(0, rounded - 10), 1), `${Math.round(n / 100)},0`], `El centésimo es ${n % 10}: ${n % 10 >= 5 ? "se sube el décimo" : "el décimo se queda"}. Resultado: ${dec(rounded, 1)}.`, { kind: "text", text: dec(n) }, "al-decimo");
}

// 3.° R.6: decimales equivalentes (0,5 = 0,50).
export function equivalentDecimals(r: Rng): Question {
  const whole = r.int(0, 9);
  const t = r.int(1, 9);
  const short = `${whole},${t}`;
  const long = `${whole},${t}0`;
  if (r.chance(0.5)) {
    const wrong = [`${whole},0${t}`, `${t},${whole}`, `${whole},${t}${t}`, `${whole}${t},0`, `${whole + 1},${t}0`].filter((x) => x !== short);
    return choice(r, `¿Qué número decimal es igual a ${short}?`, long, wrong, `Agregar un cero al final no cambia el valor: ${short} = ${long}.`);
  }
  const same = r.chance(0.5);
  const other = same ? long : `${whole},0${t}`;
  return { kind: "choice", prompt: `¿${short} y ${other} son iguales?`, options: ["Sí", "No"], answer: same ? "Sí" : "No", explanation: same ? `${t} décimos son ${t}0 centésimos: ${short} = ${long}.` : `${short} son ${t} décimos; ${other} son ${t} centésimos. No son iguales.` };
}

// 3.° R.7: forma estándar ↔ forma expandida con fracciones.
export function decimalExpanded(r: Rng): Question {
  const w = r.int(1, 9);
  const t = r.int(1, 9);
  // Décimos y centésimos distintos: si no, cambiarlos de lugar daría lo mismo.
  const c = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== t));
  const std = `${w},${t}${c}`;
  const exp = (a: number, b: number, d: number) => `${a} + ${b}/10 + ${d}/100`;
  if (r.chance(0.5)) {
    return choice(r, `Escribe ${std} en forma expandida.`, exp(w, t, c), [exp(w, c, t), `${w} + ${t}/100 + ${c}/10`, exp(t, w, c), `${w} + ${t}${c}/10`].filter((x) => x !== exp(w, t, c)), `${w} unidades, ${t} décimos y ${c} centésimos.`, undefined, "a-expandida");
  }
  return choice(r, `¿Qué número decimal es ${exp(w, t, c)}?`, std, [`${w},${c}${t}`, `${t},${w}${c}`, `${w}${t},${c}`, `${w},0${t}`].filter((x) => x !== std), `${w} unidades, ${t} décimos y ${c} centésimos: ${std}.`, undefined, "a-estandar");
}

// 3.° S.1: comparar décimos que se ven en la misma recta.
export function compareDecimalsLine(r: Rng): Question {
  const base = r.int(0, 9);
  const a = r.int(1, 9);
  const b = r.chance(0.15) ? a : r.int(1, 9);
  const A = `${base},${a}`;
  const B = `${base},${b}`;
  const points = a === b ? [{ at: a, label: A }] : [{ at: a, label: A }, { at: b, label: B }];
  const answer = symbol(a, b);
  return {
    kind: "choice",
    prompt: `Elige el símbolo correcto: ${A} ? ${B}`,
    visual: { kind: "fractionLine", parts: 10, points, labels: [String(base), String(base + 1)] },
    options: SYMBOLS,
    answer,
    explanation: answer === "=" ? `${A} y ${B} son el mismo número.` : `En la recta, el número de la derecha es el mayor: ${A} ${answer} ${B}.`,
    tag: answer,
  };
}

// 3.° S.2: comparar un decimal con una fracción en la recta de 0 a 1.
export function compareDecimalFraction(r: Rng): Question {
  const fracs: [string, number][] = [["1/2", 5], ["1/5", 2], ["2/5", 4], ["3/5", 6], ["4/5", 8], ["3/10", 3], ["7/10", 7], ["9/10", 9], ["1/10", 1]];
  const [fr, at] = r.pick(fracs);
  const k = r.chance(0.2) ? at : r.int(1, 9);
  const D = `0,${k}`;
  const decimalFirst = r.chance(0.5);
  const [left, right, lv, rv] = decimalFirst ? [D, fr, k, at] : [fr, D, at, k];
  const points = k === at ? [{ at, label: `${D} = ${fr}` }] : [{ at: k, label: D }, { at, label: fr }];
  const answer = symbol(lv, rv);
  return {
    kind: "choice",
    prompt: `Elige el símbolo correcto: ${left} ? ${right}`,
    visual: { kind: "fractionLine", parts: 10, points },
    options: SYMBOLS,
    answer,
    explanation: `${fr} es igual a 0,${at}. Entonces ${left} ${answer} ${right}.`,
    tag: answer,
  };
}

// 3.° S.3: ordenar decimales (con uno y dos decimales).
export function orderDecimals(r: Rng): Question {
  const whole = r.int(0, 9);
  const set = new Map<number, string>();
  while (set.size < 4) {
    if (r.chance(0.5)) {
      const t = r.int(1, 9);
      set.set(whole * 100 + t * 10, `${whole},${t}`);
    } else {
      const n = r.int(1, 99);
      if (n % 10 === 0) continue;
      set.set(whole * 100 + n, dec(whole * 100 + n));
    }
  }
  const items = [...set.entries()];
  const ascending = r.chance(0.6);
  const sorted = [...items].sort((x, y) => (ascending ? x[0] - y[0] : y[0] - x[0]));
  return {
    kind: "sequence",
    prompt: `Ordena los decimales de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`,
    tiles: r.shuffle(items.map(([, s]) => s)),
    reuse: false,
    length: 4,
    answer: sorted.map(([, s]) => s),
    explanation: `Comparamos primero los décimos y luego los centésimos: ${sorted.map(([, s]) => s).join(", ")}.`,
    tag: ascending ? "menor-a-mayor" : "mayor-a-menor",
  };
}

// 3.° T.1 - T.3: sumar y restar decimales.
export function addSubDecimals(r: Rng, op: "+" | "−" | "mixed"): Question {
  const o = op === "mixed" ? r.pick<"+" | "−">(["+", "−"]) : op;
  const places: 1 | 2 = r.chance(0.5) ? 1 : 2;
  const unit = places === 1 ? 10 : 1;
  const a = r.int(11, 990 / unit) * unit;
  const b = o === "+" ? r.int(11, 990 / unit) * unit : r.int(1, a / unit - 1) * unit;
  const res = o === "+" ? a + b : a - b;
  const show = (n: number) => dec(n, places);
  const answer = show(res);
  const wrong = [show(res + unit), show(Math.max(0, res - unit)), show(res + 10 * unit), show(Math.max(0, res - 10 * unit)), show(o === "+" ? Math.abs(a - b) : a + b)];
  return choice(
    r,
    o === "+" ? "Suma los decimales." : "Resta los decimales.",
    answer,
    wrong,
    `Alineamos las comas y ${o === "+" ? "sumamos" : "restamos"} como con los números naturales: ${show(a)} ${o} ${show(b)} = ${answer}.`,
    { kind: "text", text: `${show(a)} ${o} ${show(b)} = ?` },
    o === "+" ? "suma" : "resta"
  );
}

// 3.° T.4: estimar redondeando a la unidad.
export function estimateDecimals(r: Rng): Question {
  const pick = () => {
    const whole = r.int(1, 20);
    const tenth = r.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    return { text: `${whole},${tenth}`, rounded: tenth >= 5 ? whole + 1 : whole };
  };
  let a = pick();
  let b = pick();
  const plus = r.chance(0.5);
  if (!plus && a.rounded < b.rounded) [a, b] = [b, a];
  const answer = plus ? a.rounded + b.rounded : a.rounded - b.rounded;
  return {
    kind: "number",
    prompt: `Redondea cada número a la unidad y luego ${plus ? "suma" : "resta"}.`,
    visual: { kind: "text", text: `${a.text} ${plus ? "+" : "−"} ${b.text} ≈ ?` },
    answer,
    explanation: `${a.text} ≈ ${a.rounded} y ${b.text} ≈ ${b.rounded}; ${a.rounded} ${plus ? "+" : "−"} ${b.rounded} = ${answer}.`,
    tag: plus ? "suma" : "resta",
  };
}
