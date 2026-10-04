import type { Rng } from "../rng";
import type { Question } from "../types";
import { uniqueOptions } from "./common";

// Fracciones de 3.° en adelante: comparar, ordenar, equivalentes y sumar o
// restar con el mismo denominador. Las comparaciones se hacen con productos
// cruzados (enteros), sin decimales.

type Frac = [n: number, d: number];
const f = ([n, d]: Frac) => `${n}/${d}`;
const cmp = (a: Frac, b: Frac) => Math.sign(a[0] * b[1] - b[0] * a[1]);
const symbol = (c: number) => (c < 0 ? "<" : c > 0 ? ">" : "=");
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const DENOMS = [2, 3, 4, 5, 6, 8, 10];
const SYMBOLS = ["<", "=", ">"];

export type FractionMode = "sameDen" | "sameNum" | "any";

// Dos fracciones propias según el modo.
function pair(r: Rng, mode: FractionMode): [Frac, Frac] {
  if (mode === "sameDen") {
    const d = r.pick(DENOMS.filter((x) => x > 2));
    return [[r.int(1, d - 1), d], [r.int(1, d - 1), d]];
  }
  if (mode === "sameNum") {
    const [d1, d2] = r.shuffle(DENOMS).slice(0, 2);
    const n = r.int(1, Math.min(d1, d2) - 1);
    return [[n, d1], [n, d2]];
  }
  const d1 = r.pick(DENOMS);
  const d2 = r.pick(DENOMS);
  return [[r.int(1, d1 - 1), d1], [r.int(1, d2 - 1), d2]];
}

function compareExplanation(a: Frac, b: Frac, mode: FractionMode) {
  const s = symbol(cmp(a, b));
  if (s === "=") return `${f(a)} y ${f(b)} representan la misma cantidad.`;
  if (mode === "sameDen") return `Con el mismo denominador, es mayor la que tiene más partes: ${f(a)} ${s} ${f(b)}.`;
  if (mode === "sameNum") return `Con el mismo numerador, es mayor la de partes más grandes (denominador menor): ${f(a)} ${s} ${f(b)}.`;
  return `${f(a)} ${s} ${f(b)}.`;
}

// 3.° O.1: comparar con barras del mismo tamaño.
export function compareFractionModels(r: Rng): Question {
  const [a, b] = pair(r, r.pick<FractionMode>(["sameDen", "sameNum", "any"]));
  const answer = symbol(cmp(a, b));
  return {
    kind: "choice",
    prompt: `Mira las barras y elige el símbolo: ${f(a)} ? ${f(b)}`,
    visual: { kind: "fractionPair", items: [{ parts: a[1], shaded: a[0] }, { parts: b[1], shaded: b[0] }], showAll: true },
    options: SYMBOLS,
    answer,
    explanation: `La barra con más parte sombreada es la mayor: ${f(a)} ${answer} ${f(b)}.`,
    tag: answer,
  };
}

// 3.° O.2: comparar con las referencias 1/2 y 1.
export function compareBenchmark(r: Rng): Question {
  const d = r.pick([3, 4, 5, 6, 8, 10, 12]);
  const n = r.int(1, d);
  const half = r.chance(0.75) || n === d;
  const ref: Frac = half ? [1, 2] : [1, 1];
  const answer = symbol(cmp([n, d], ref));
  return {
    kind: "choice",
    prompt: "Elige el símbolo correcto.",
    visual: { kind: "text", text: `${n}/${d}  ?  ${half ? "1/2" : "1"}` },
    options: SYMBOLS,
    answer,
    explanation: half
      ? `El doble de ${n} es ${n * 2}, que es ${n * 2 < d ? "menor que" : n * 2 > d ? "mayor que" : "igual a"} ${d}: por eso ${n}/${d} ${answer} 1/2.`
      : `${d}/${d} es igual a 1; ${n}/${d} ${answer} 1.`,
    tag: half ? "un-medio" : "uno",
  };
}

// 3.° O.3: comparar fracciones.
export function compareFractions(r: Rng, mode: FractionMode): Question {
  const [a, b] = pair(r, mode);
  const answer = symbol(cmp(a, b));
  return {
    kind: "choice",
    prompt: "Elige el símbolo correcto.",
    visual: { kind: "text", text: `${f(a)}  ?  ${f(b)}` },
    options: SYMBOLS,
    answer,
    explanation: compareExplanation(a, b, mode),
    tag: mode,
  };
}

// 3.° O.4 - O.6: comparar dos fracciones dibujadas en rectas numéricas.
export function compareOnLines(r: Rng, mode: FractionMode): Question {
  const [a, b] = pair(r, mode);
  const answer = symbol(cmp(a, b));
  return {
    kind: "choice",
    prompt: `Compara las fracciones en las rectas: ${f(a)} ? ${f(b)}`,
    visual: { kind: "fractionLines", lines: [{ parts: a[1], marked: a[0], title: f(a) }, { parts: b[1], marked: b[0], title: f(b) }] },
    options: SYMBOLS,
    answer,
    explanation: `El punto que está más a la derecha es el mayor: ${f(a)} ${answer} ${f(b)}.`,
    tag: mode,
  };
}

// Tres fracciones de distinto valor.
function trio(r: Rng, mode: FractionMode): Frac[] {
  for (;;) {
    let fr: Frac[];
    if (mode === "sameDen") {
      const d = r.pick([5, 6, 8, 10, 12]);
      fr = r.shuffle(Array.from({ length: d - 1 }, (_, i) => i + 1)).slice(0, 3).map((n) => [n, d] as Frac);
    } else if (mode === "sameNum") {
      const ds = r.shuffle(DENOMS.filter((x) => x > 2)).slice(0, 3);
      const n = r.int(1, Math.min(...ds) - 1);
      fr = ds.map((d) => [n, d] as Frac);
    } else {
      fr = [0, 1, 2].map(() => {
        const d = r.pick(DENOMS);
        return [r.int(1, d - 1), d] as Frac;
      });
    }
    if (cmp(fr[0], fr[1]) && cmp(fr[0], fr[2]) && cmp(fr[1], fr[2]) && new Set(fr.map(f)).size === 3) return fr;
  }
}

// 3.° O.7 - O.10: ordenar fracciones (con o sin rectas numéricas).
export function orderFractions(r: Rng, mode: FractionMode, withLines = false): Question {
  const fr = trio(r, mode);
  const ascending = r.chance(0.6);
  const sorted = [...fr].sort((a, b) => (ascending ? cmp(a, b) : cmp(b, a)));
  return {
    kind: "sequence",
    prompt: `Ordena las fracciones de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalas en orden.`,
    visual: withLines ? { kind: "fractionLines", lines: fr.map((x) => ({ parts: x[1], marked: x[0], title: f(x) })) } : undefined,
    tiles: fr.map(f),
    reuse: false,
    length: 3,
    answer: sorted.map(f),
    explanation: `El orden correcto es ${sorted.map(f).join(", ")}.`,
    tag: mode,
  };
}

// 3.° P.2: ¿las dos rectas muestran fracciones equivalentes?
export function equivalentLinesYesNo(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const n = r.int(1, d - 1);
  const m = r.pick(d >= 4 ? [2] : [2, 3]);
  const same = r.chance(0.5);
  const n2 = same ? n * m : Math.max(1, Math.min(d * m - 1, n * m + r.pick([-1, 1])));
  const a: Frac = [n, d];
  const b: Frac = [n2, d * m];
  return {
    kind: "choice",
    prompt: `¿${f(a)} y ${f(b)} son fracciones equivalentes?`,
    visual: { kind: "fractionLines", lines: [{ parts: a[1], marked: a[0], title: f(a) }, { parts: b[1], marked: b[0], title: f(b) }] },
    options: ["Sí", "No"],
    answer: same ? "Sí" : "No",
    explanation: same ? `Los dos puntos están en el mismo lugar: ${f(a)} = ${f(b)}.` : `Los puntos no están en el mismo lugar: ${f(a)} equivale a ${n * m}/${d * m}.`,
  };
}

// 3.° P.5: fracciones equivalentes a números naturales.
export function wholeNumberFractions(r: Rng): Question {
  const d = r.int(1, 6);
  const k = r.int(1, 6);
  const num = (answer: number, text: string, explanation: string): Question => ({ kind: "number", prompt: "¿Qué número falta?", visual: { kind: "text", text }, answer, explanation });
  const form = r.int(0, 2);
  if (form === 0) return num(k, `${k * d}/${d} = ?`, `${k * d} ÷ ${d} = ${k}.`);
  if (form === 1) return num(k * d, `${k} = ?/${d}`, `${k} enteros son ${k} × ${d} = ${k * d} partes de ${d}.`);
  return num(d, `${k} = ${k * d}/?`, `${k * d} ÷ ${d} = ${k}.`);
}

// 3.° P.6: reducir a la mínima expresión.
export function simplifyFraction(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5, 6]);
  let n = r.int(1, d - 1);
  while (gcd(n, d) !== 1) n = r.int(1, d - 1);
  const m = r.int(2, 5);
  const answer = `${n}/${d}`;
  return {
    kind: "choice",
    prompt: `Reduce ${n * m}/${d * m} a su mínima expresión.`,
    options: uniqueOptions(r, answer, [`${n + 1}/${d + 1}`, `${n}/${d + 1}`, `${n * m}/${d}`, `${d}/${n}`, `${n}/${d * m}`].filter((x) => x !== answer)),
    answer,
    explanation: `Dividimos el numerador y el denominador entre ${m}: ${n * m}/${d * m} = ${answer}.`,
  };
}

// 3.° P.7: patrones de fracciones equivalentes.
export function equivalentPattern(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const n = r.int(1, d - 1);
  const top = r.chance(0.5);
  const k = r.int(3, 5);
  const shown = Array.from({ length: k - 1 }, (_, i) => `${n * (i + 1)}/${d * (i + 1)}`);
  return {
    kind: "number",
    prompt: "Sigue el patrón de fracciones equivalentes. ¿Qué número falta?",
    visual: { kind: "text", text: `${shown.join(" = ")} = ${top ? `?/${d * k}` : `${n * k}/?`}` },
    answer: top ? n * k : d * k,
    explanation: `Se multiplica arriba y abajo por el mismo número: ${n}/${d} = ${n * k}/${d * k}.`,
  };
}

function fractionChoices(r: Rng, n: number, d: number, extra: string[]) {
  const answer = `${n}/${d}`;
  const cands = [...extra, `${n + 1}/${d}`, `${Math.max(1, n - 1)}/${d}`, `${n}/${d + 1}`].filter((x) => x !== answer);
  return { answer, options: uniqueOptions(r, answer, cands) };
}

// 3.° Q.1 / Q.3: sumar o restar avanzando o retrocediendo en la recta.
export function addSubFractionsLine(r: Rng, op: "+" | "−"): Question {
  const d = r.pick([4, 5, 6, 8, 10]);
  const a = op === "+" ? r.int(1, d - 2) : r.int(2, d);
  const b = op === "+" ? r.int(1, d - a) : r.int(1, a - 1);
  const res = op === "+" ? a + b : a - b;
  const { answer, options } = fractionChoices(r, res, d, [op === "+" ? `${res}/${d * 2}` : `${a + b}/${d}`]);
  return {
    kind: "choice",
    prompt: `El punto está en ${a}/${d}. ${op === "+" ? "Avanza" : "Retrocede"} ${b}/${d}. ¿Cuánto es ${a}/${d} ${op} ${b}/${d}?`,
    visual: { kind: "fractionLine", parts: d, marked: a },
    options,
    answer,
    explanation: `${op === "+" ? "Avanzamos" : "Retrocedemos"} ${b} ${b === 1 ? "parte" : "partes"}: ${a}/${d} ${op} ${b}/${d} = ${answer}.`,
  };
}

// 3.° Q.2 / Q.4 / Q.5: sumar o restar con el mismo denominador.
export function addSubFractions(r: Rng, op: "+" | "−" | "mixed"): Question {
  const o = op === "mixed" ? r.pick<"+" | "−">(["+", "−"]) : op;
  const d = r.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
  const a = o === "+" ? r.int(1, d - 2) : r.int(2, d - 1);
  const b = o === "+" ? r.int(1, d - a) : r.int(1, a - 1);
  const res = o === "+" ? a + b : a - b;
  const { answer, options } = fractionChoices(r, res, d, [o === "+" ? `${res}/${d * 2}` : `${a + b}/${d}`, `${res}/${d - 1}`]);
  return {
    kind: "choice",
    prompt: o === "+" ? "Suma las fracciones." : "Resta las fracciones.",
    visual: { kind: "text", text: `${a}/${d} ${o} ${b}/${d} = ?` },
    options,
    answer,
    explanation: `El denominador se mantiene y ${o === "+" ? "se suman" : "se restan"} los numeradores: ${a} ${o} ${b} = ${res}, es decir, ${answer}.`,
    tag: o === "+" ? "suma" : "resta",
  };
}
