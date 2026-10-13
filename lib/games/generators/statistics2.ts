import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { d3, distinct, numQ, sum, table } from "./kit";

// Estadística de 5.° en adelante: media, datos que faltan y diagramas de
// puntos con decimales.

// `n` datos enteros entre min y max cuya media es un número natural.
function meanData(r: Rng, n: number, min: number, max: number): number[] {
  for (;;) {
    const xs = Array.from({ length: n }, () => r.int(min, max));
    if (sum(xs) % n === 0 && new Set(xs).size > 1) return xs;
  }
}

export type MeanDisplay = "list" | "table" | "bar" | "linePlot";
const NAMES5 = ["Ana", "Luis", "Rosa", "Hugo", "Elena", "Omar"];

function show(r: Rng, xs: number[], display: MeanDisplay): Visual {
  if (display === "table") return table(["Alumno", "Puntos"], xs.map((x, i) => [NAMES5[i], String(x)]), "Puntos en el juego");
  if (display === "bar") {
    const top = Math.max(...xs);
    const step = top <= 12 ? 2 : 5;
    return { kind: "barChart", title: "Libros leídos", bars: xs.map((x, i) => ({ label: NAMES5[i], value: x })), max: Math.ceil(top / step) * step, step };
  }
  if (display === "linePlot") {
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    const labels = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    return { kind: "linePlot", title: "Horas de lectura por alumno", labels: labels.map(String), counts: labels.map((l) => xs.filter((x) => x === l).length) };
  }
  return { kind: "text", text: r.shuffle(xs).join("   ") };
}

// 5.° OO.2 / OO.9: hallar la media.
export function findMean(r: Rng, display: MeanDisplay = "list"): Question {
  const n = display === "linePlot" ? r.pick([4, 5, 6]) : r.pick([3, 4, 5, 6]);
  const xs = display === "linePlot" ? meanData(r, n, 1, 7) : display === "bar" ? meanData(r, Math.min(n, 5), 2, 20) : meanData(r, n, 2, 40);
  return numQ(sum(xs) / xs.length, "¿Cuál es la media (promedio) de los datos?", show(r, xs, display), `Sumamos y dividimos entre la cantidad de datos: ${xs.join(" + ")} = ${sum(xs)}; ${sum(xs)} ÷ ${xs.length} = ${sum(xs) / xs.length}.`, "media");
}

// 5.° OO.5: media, hallar el dato que falta.
export function meanMissing(r: Rng): Question {
  const xs = meanData(r, r.pick([3, 4, 5]), 2, 30);
  const mean = sum(xs) / xs.length;
  const hidden = r.int(0, xs.length - 1);
  return numQ(xs[hidden], `La media de estos datos es ${mean}. ¿Qué dato falta?`, xs.map((x, i) => (i === hidden ? "?" : String(x))).join("   "), `La suma debe ser ${mean} × ${xs.length} = ${mean * xs.length}; los datos conocidos suman ${sum(xs) - xs[hidden]}; falta ${mean * xs.length} − ${sum(xs) - xs[hidden]} = ${xs[hidden]}.`);
}

// 5.° OO.6: mediana, hallar el dato que falta.
export function medianMissing(r: Rng): Question {
  const sorted = distinct(r, 5, 2, 40).sort((a, b) => a - b);
  const median = sorted[2];
  return numQ(median, `Estos cinco datos están ordenados de menor a mayor y su mediana es ${median}. ¿Qué dato falta?`, sorted.map((x, i) => (i === 2 ? "?" : String(x))).join("   "), `Con cinco datos ordenados, la mediana es el tercero (el del centro): ${median}.`);
}

// 5.° OO.7: rango, hallar el dato que falta.
export function rangeMissing(r: Rng): Question {
  const sorted = distinct(r, 5, 5, 50).sort((a, b) => a - b);
  const range = sorted[4] - sorted[0];
  const hideMax = r.chance(0.5);
  const at = hideMax ? 4 : 0;
  return numQ(sorted[at], `Estos datos están ordenados de menor a mayor y su rango es ${range}. ¿Qué dato falta?`, sorted.map((x, i) => (i === at ? "?" : String(x))).join("   "), hideMax ? `El mayor es el menor más el rango: ${sorted[0]} + ${range} = ${sorted[4]}.` : `El menor es el mayor menos el rango: ${sorted[4]} − ${range} = ${sorted[0]}.`, hideMax ? "mayor" : "menor");
}

// 5.° NN.2: crear diagramas de puntos con decimales (¿cuántas X van?).
export function createDecimalPlot(r: Rng): Question {
  const [title, unit] = r.pick([["Largo de las hojas (cm)", "cm"], ["Peso de los paquetes (kg)", "kg"], ["Tiempo de la carrera (s)", "s"], ["Lluvia de cada día (cm)", "cm"]]);
  const start = r.int(1, 9) * 1000 + r.int(0, 5) * 100;
  const step = r.pick([100, 500, 250]);
  const values = [0, 1, 2, 3, 4].map((i) => start + i * step);
  const counts = values.map(() => r.int(0, 4));
  counts[r.int(0, 4)] += 2;
  const data = r.shuffle(values.flatMap((v, i) => Array.from({ length: counts[i] }, () => d3(v))));
  const i = r.pick([0, 1, 2, 3, 4].filter((k) => counts[k] > 0));
  return numQ(counts[i], `Vas a hacer un diagrama de puntos con estos datos. ¿Cuántas X van sobre ${d3(values[i])}?`, `${title}\n${data.join("   ")}`, `El dato ${d3(values[i])} ${unit} aparece ${counts[i]} ${counts[i] === 1 ? "vez" : "veces"}.`);
}
