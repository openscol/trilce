import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { choiceQ, distinct, mixed, numQ, sum, table } from "./kit";

// Datos y gráficos, y moda/mediana/rango (4.° en adelante).

type Theme = { title: string; labels: string[]; unit: string };
const THEMES: Theme[] = [
  { title: "Fruta favorita", labels: ["Mango", "Fresa", "Uva", "Plátano", "Piña", "Pera"], unit: "votos" },
  { title: "Libros leídos", labels: ["Ana", "Luis", "Rosa", "Hugo", "Elena", "Omar"], unit: "libros" },
  { title: "Deporte favorito", labels: ["Fútbol", "Vóley", "Básquet", "Natación", "Tenis"], unit: "votos" },
  { title: "Mascotas del salón", labels: ["Perro", "Gato", "Pez", "Loro", "Conejo"], unit: "alumnos" },
  { title: "Helados vendidos", labels: ["Fresa", "Vainilla", "Lúcuma", "Coco", "Menta"], unit: "helados" },
];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const TRENDS: { title: string; unit: string }[] = [
  { title: "Temperatura al mediodía (°C)", unit: "grados" },
  { title: "Visitantes del museo", unit: "visitantes" },
  { title: "Panes vendidos", unit: "panes" },
  { title: "Páginas leídas", unit: "páginas" },
];

type Data = { title: string; labels: string[]; values: number[]; unit: string };
function categories(r: Rng, count: number, step: number, maxSteps: number): Data {
  const t = r.pick(THEMES);
  return { title: t.title, unit: t.unit, labels: r.shuffle(t.labels).slice(0, count), values: distinct(r, count, 1, maxSteps).map((v) => v * step) };
}
function trend(r: Rng, step: number, maxSteps: number): Data {
  const t = r.pick(TRENDS);
  const count = r.int(4, 6);
  return { ...t, labels: DAYS.slice(0, count), values: distinct(r, count, 1, maxSteps).map((v) => v * step) };
}
const chart = (d: Data, step: number, line = false): Visual => {
  const top = Math.max(...d.values);
  return { kind: "barChart", title: d.title, bars: d.labels.map((label, i) => ({ label, value: d.values[i] })), max: Math.ceil(top / step) * step, step, line };
};
const asTable = (d: Data, head = ""): Visual => table([head, d.unit[0].toUpperCase() + d.unit.slice(1)], d.labels.map((l, i) => [l, String(d.values[i])]), d.title);

// Pregunta de lectura sobre unos datos. `level` 1: leer; 2: comparar y sumar; 3: varios pasos.
function ask(r: Rng, d: Data, visual: Visual, level: 1 | 2 | 3): Question {
  const [i, j, k] = r.shuffle(d.labels.map((_, idx) => idx));
  const v = d.values;
  const forms: (() => Question)[] = [];
  if (level === 1) {
    forms.push(() => numQ(v[i], `¿Cuál es el valor de «${d.labels[i]}»?`, visual, `«${d.labels[i]}» marca ${v[i]}.`, "leer"));
    forms.push(() => {
      const most = r.chance(0.5);
      const target = most ? Math.max(...v) : Math.min(...v);
      return { kind: "choice", prompt: `¿Cuál tiene el valor ${most ? "mayor" : "menor"}?`, visual, options: d.labels, answer: d.labels[v.indexOf(target)], explanation: `El valor ${most ? "mayor" : "menor"} es ${target}.`, tag: most ? "mayor" : "menor" };
    });
  }
  if (level <= 2) {
    forms.push(() => numQ(Math.abs(v[i] - v[j]), `¿Cuál es la diferencia entre «${d.labels[i]}» y «${d.labels[j]}»?`, visual, `${Math.max(v[i], v[j])} − ${Math.min(v[i], v[j])} = ${Math.abs(v[i] - v[j])}.`, "diferencia"));
    forms.push(() => numQ(v[i] + v[j], `¿Cuánto suman «${d.labels[i]}» y «${d.labels[j]}»?`, visual, `${v[i]} + ${v[j]} = ${v[i] + v[j]}.`, "suma"));
  }
  if (level >= 2) forms.push(() => numQ(sum(v), `¿Cuál es el total de ${d.unit}?`, visual, `${v.join(" + ")} = ${sum(v)}.`, "total"));
  if (level === 3) {
    forms.push(() => numQ(Math.abs(v[i] + v[j] - v[k]), `¿Cuál es la diferencia entre lo que suman «${d.labels[i]}» y «${d.labels[j]}», y el valor de «${d.labels[k]}»?`, visual, `${v[i]} + ${v[j]} = ${v[i] + v[j]}; la diferencia con ${v[k]} es ${Math.abs(v[i] + v[j] - v[k])}.`, "suma-y-diferencia"));
    forms.push(() => numQ(sum(v) - v[i], `¿Cuántos ${d.unit} hay sin contar «${d.labels[i]}»?`, visual, `${sum(v)} − ${v[i]} = ${sum(v) - v[i]}.`, "total-menos-uno"));
    forms.push(() => numQ(Math.max(...v) - Math.min(...v), "¿Cuál es la diferencia entre el valor mayor y el menor?", visual, `${Math.max(...v)} − ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}.`, "mayor-menos-menor"));
  }
  return r.pick(forms)();
}

// 4.° O.1: leer una tabla.
export function readTable(r: Rng): Question {
  const d = categories(r, 4, 1, 60);
  return ask(r, d, asTable(d), r.pick([1, 2]));
}

// 4.° O.9 / O.10: interpretar gráficos de barras (`level` 3 = varios pasos).
export function interpretBarGraph(r: Rng, level: 1 | 2 | 3): Question {
  const step = r.pick([2, 5, 10]);
  const d = categories(r, r.int(4, 5), step, 8);
  return ask(r, d, chart(d, step), level === 1 ? r.pick([1, 2]) : level);
}

// 4.° O.7: interpretar gráficos de líneas.
export function interpretLineGraph(r: Rng): Question {
  const step = r.pick([2, 5, 10]);
  const d = trend(r, step, 8);
  const visual = chart(d, step, true);
  if (r.chance(0.4)) {
    const i = r.int(0, d.values.length - 2);
    const up = d.values[i + 1] > d.values[i];
    return numQ(Math.abs(d.values[i + 1] - d.values[i]), `¿Cuánto ${up ? "subió" : "bajó"} el valor de ${d.labels[i]} a ${d.labels[i + 1]}?`, visual, `De ${d.values[i]} a ${d.values[i + 1]}: ${up ? "subió" : "bajó"} ${Math.abs(d.values[i + 1] - d.values[i])}.`, "cambio");
  }
  return ask(r, d, visual, r.pick([1, 2]));
}

// 4.° O.6 / O.8: crear gráficos de líneas o de barras (¿hasta dónde llega cada dato?).
export function createGraph(r: Rng, line: boolean): Question {
  const step = r.pick([2, 5, 10]);
  const d = line ? trend(r, step, 8) : categories(r, 4, step, 8);
  const i = r.int(0, d.values.length - 1);
  // El gráfico se muestra con ese dato en 0 para que se vea qué falta.
  const partial: Data = { ...d, values: d.values.map((v, idx) => (idx === i ? 0 : v)) };
  const top = Math.max(...d.values);
  const visual: Visual = { kind: "barChart", title: `${d.title}: ${d.labels.map((l, idx) => `${l} ${d.values[idx]}`).join(", ")}`, bars: partial.labels.map((label, idx) => ({ label, value: partial.values[idx] })).filter((_, idx) => !line || idx !== i), max: Math.ceil(top / step) * step, step, line };
  return numQ(d.values[i], `Falta ${line ? "el punto" : "la barra"} de «${d.labels[i]}». ¿Hasta qué número del eje debe llegar?`, visual, `El dato de «${d.labels[i]}» es ${d.values[i]}.`);
}

// Diagrama de puntos con valores enteros.
function plot(r: Rng) {
  const t = r.pick([
    { title: "Libros leídos por alumno", thing: "alumnos", what: "libros" },
    { title: "Hermanos por alumno", thing: "alumnos", what: "hermanos" },
    { title: "Goles por partido", thing: "partidos", what: "goles" },
    { title: "Horas de lectura por semana", thing: "alumnos", what: "horas" },
  ]);
  const start = r.int(0, 3);
  const labels = Array.from({ length: r.int(5, 6) }, (_, i) => start + i);
  const counts = labels.map(() => r.int(0, 5));
  if (sum(counts) < 6) counts[0] += 4;
  return { ...t, labels, counts };
}

// 4.° O.2: interpretar diagramas de puntos.
export function interpretLinePlot(r: Rng): Question {
  const p = plot(r);
  const visual: Visual = { kind: "linePlot", title: p.title, labels: p.labels.map(String), counts: p.counts };
  const i = r.int(0, p.labels.length - 1);
  const form = r.int(0, 3);
  if (form === 0) return numQ(p.counts[i], `¿Cuántos ${p.thing} tienen ${p.labels[i]} ${p.what}?`, visual, `Sobre el ${p.labels[i]} hay ${p.counts[i]} X.`, "leer");
  if (form === 1) return numQ(sum(p.counts), `¿Cuántos ${p.thing} hay en total?`, visual, `Contamos todas las X: ${sum(p.counts)}.`, "total");
  const cut = p.labels[r.int(1, p.labels.length - 2)];
  if (form === 2) {
    const n = sum(p.counts.filter((_, idx) => p.labels[idx] > cut));
    return numQ(n, `¿Cuántos ${p.thing} tienen más de ${cut} ${p.what}?`, visual, `Sumamos las X a la derecha del ${cut}: ${n}.`, "mas-de");
  }
  const n = sum(p.counts.filter((_, idx) => p.labels[idx] <= cut));
  return numQ(n, `¿Cuántos ${p.thing} tienen ${cut} ${p.what} o menos?`, visual, `Sumamos las X desde el inicio hasta el ${cut}: ${n}.`, "hasta");
}

// Diagrama de puntos con fracciones (cuartos): 1 = 1/4, 2 = 1/2, 4 = 1...
function fractionPlot(r: Rng) {
  const t = r.pick([
    { title: "Largo de las cintas (m)", thing: "cintas", unit: "m" },
    { title: "Agua en cada vaso (litros)", thing: "vasos", unit: "litros" },
    { title: "Peso de las bolsas (kg)", thing: "bolsas", unit: "kg" },
    { title: "Distancia caminada (km)", thing: "alumnos", unit: "km" },
  ]);
  const start = r.int(1, 3);
  const quarters = Array.from({ length: 5 }, (_, i) => start + i);
  const counts = quarters.map(() => r.int(0, 4));
  if (sum(counts) < 5) counts[1] += 3;
  if (counts[0] === 0) counts[0] = 1;
  if (counts[4] === 0) counts[4] = 1;
  return { ...t, quarters, counts, labels: quarters.map((q) => mixed(q / gcd4(q), 4 / gcd4(q))) };
}
const gcd4 = (q: number) => (q % 4 === 0 ? 4 : q % 2 === 0 ? 2 : 1);
const q4 = (q: number) => mixed(q / gcd4(q), 4 / gcd4(q));
const fracOptions = (r: Rng, answer: number) => distinct(r, 5, Math.max(1, answer - 4), answer + 4, (x) => x !== answer).map(q4);

// 4.° O.3: crear diagramas de puntos con fracciones (¿cuántas X van?).
export function createFractionPlot(r: Rng): Question {
  const p = fractionPlot(r);
  const data = r.shuffle(p.quarters.flatMap((q, i) => Array.from({ length: p.counts[i] }, () => q4(q))));
  const i = r.pick([0, 1, 2, 3, 4].filter((k) => p.counts[k] > 0));
  return numQ(p.counts[i], `Vas a hacer un diagrama de puntos con estos datos. ¿Cuántas X van sobre ${p.labels[i]}?`, `${p.title}\n${data.join("   ")}`, `El dato ${p.labels[i]} aparece ${p.counts[i]} ${p.counts[i] === 1 ? "vez" : "veces"}.`);
}

// 4.° O.4 / O.5: interpretar diagramas de puntos con fracciones.
export function interpretFractionPlot(r: Rng, multiStep: boolean): Question {
  const p = fractionPlot(r);
  const visual: Visual = { kind: "linePlot", title: p.title, labels: p.labels, counts: p.counts };
  const i = r.int(0, 4);
  if (!multiStep) {
    const form = r.int(0, 2);
    if (form === 0) return numQ(p.counts[i], `¿Cuántos datos son de ${p.labels[i]} ${p.unit}?`, visual, `Sobre ${p.labels[i]} hay ${p.counts[i]} X.`, "leer");
    if (form === 1) return numQ(sum(p.counts), `¿Cuántos datos hay en total?`, visual, `Contamos todas las X: ${sum(p.counts)}.`, "total");
    const top = Math.max(...p.counts);
    if (p.counts.filter((c) => c === top).length > 1) return numQ(sum(p.counts), `¿Cuántos datos hay en total?`, visual, `Contamos todas las X: ${sum(p.counts)}.`, "total");
    return { kind: "choice", prompt: "¿Qué medida se repite más?", visual, options: p.labels, answer: p.labels[p.counts.indexOf(top)], explanation: `La columna más alta está sobre ${p.labels[p.counts.indexOf(top)]}.`, tag: "mas-frecuente" };
  }
  const form = r.int(0, 2);
  if (form === 0) {
    const diff = p.quarters[4] - p.quarters[0];
    return choiceQ(r, `¿Cuál es la diferencia entre la medida mayor y la menor (en ${p.unit})?`, q4(diff), fracOptions(r, diff), `${p.labels[4]} − ${p.labels[0]} = ${q4(diff)}.`, visual, "diferencia");
  }
  const at = p.counts[i] >= 2 ? i : p.counts.findIndex((c) => c >= 2);
  if (form === 1 && at >= 0) {
    const total = p.quarters[at] * p.counts[at];
    return choiceQ(r, `¿Cuánto suman todas las medidas de ${p.labels[at]} ${p.unit}?`, q4(total), fracOptions(r, total), `Hay ${p.counts[at]} datos de ${p.labels[at]}: ${p.counts[at]} × ${p.labels[at]} = ${q4(total)}.`, visual, "suma");
  }
  const cut = r.int(1, 3);
  const n = sum(p.counts.slice(cut));
  return numQ(n, `¿Cuántos datos son de ${p.labels[cut]} ${p.unit} o más?`, visual, `Sumamos las X desde ${p.labels[cut]} hacia la derecha: ${n}.`, "o-mas");
}

// 4.° O.11 – O.14: tablas de frecuencias (con categorías o con números).
export function frequencyTable(r: Rng, numeric: boolean, create: boolean): Question {
  const start = r.pick([8, 10, 12, 14]);
  const labels = numeric ? Array.from({ length: 5 }, (_, i) => String(start + i)) : r.shuffle(r.pick(THEMES).labels).slice(0, 4);
  const counts = labels.map(() => r.int(1, create ? 5 : 9));
  const title = numeric ? "Notas del examen" : "Encuesta del salón";
  const i = r.int(0, labels.length - 1);
  if (create) {
    const data = r.shuffle(labels.flatMap((l, idx) => Array.from({ length: counts[idx] }, () => l)));
    return numQ(counts[i], `Con estos datos se arma una tabla de frecuencias. ¿Qué frecuencia le toca a «${labels[i]}»?`, `${data.join(numeric ? "   " : " · ")}`, `«${labels[i]}» aparece ${counts[i]} ${counts[i] === 1 ? "vez" : "veces"}.`, numeric ? "numeros" : "categorias");
  }
  const visual = table([numeric ? "Nota" : "Respuesta", "Frecuencia"], labels.map((l, idx) => [l, String(counts[idx])]), title);
  const form = r.int(0, 3);
  if (form === 0) return numQ(counts[i], `¿Cuántas veces aparece «${labels[i]}»?`, visual, `La frecuencia de «${labels[i]}» es ${counts[i]}.`, "leer");
  if (form === 1) return numQ(sum(counts), "¿Cuántos datos hay en total?", visual, `${counts.join(" + ")} = ${sum(counts)}.`, "total");
  if (form === 2 && numeric) {
    const cut = r.int(1, labels.length - 2);
    const n = sum(counts.slice(cut + 1));
    return numQ(n, `¿Cuántos alumnos sacaron más de ${labels[cut]}?`, visual, `Sumamos las frecuencias de las notas mayores que ${labels[cut]}: ${n}.`, "mas-de");
  }
  const j = (i + 1) % labels.length;
  return numQ(Math.abs(counts[i] - counts[j]), `¿Cuál es la diferencia entre las frecuencias de «${labels[i]}» y «${labels[j]}»?`, visual, `${Math.max(counts[i], counts[j])} − ${Math.min(counts[i], counts[j])} = ${Math.abs(counts[i] - counts[j])}.`, "diferencia");
}

// Datos de dos cifras agrupados por decenas.
function stemData(r: Rng, count = 9) {
  const first = r.int(1, 5);
  const stems = [first, first + 1, first + 2];
  const data = distinct(r, count, first * 10, first * 10 + 29).sort((a, b) => a - b);
  const leaves = (s: number) => data.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(" ");
  return { stems, data, leaves, visual: table(["Tallo", "Hojas"], stems.map((s) => [String(s), leaves(s) || "—"]), "Clave: 3 | 2 = 32") };
}

// 4.° O.15: crear diagramas de tallo y hojas.
export function createStemLeaf(r: Rng): Question {
  for (;;) {
    const s = stemData(r);
    const stem = r.pick(s.stems);
    const answer = s.leaves(stem);
    if (!answer) continue;
    const wrong = [s.data.filter((x) => Math.floor(x / 10) === stem).join(" "), answer.split(" ").reverse().join(" "), ...s.stems.filter((x) => x !== stem).map((x) => s.leaves(x)), `${answer} ${stem}`].filter((w) => w && w !== answer);
    return choiceQ(r, `En un diagrama de tallo y hojas, ¿qué hojas van en el tallo ${stem}? (El tallo es la decena y la hoja es la unidad.)`, answer, wrong, `Los datos que empiezan con ${stem} son ${s.data.filter((x) => Math.floor(x / 10) === stem).join(", ")}: sus hojas son ${answer}.`, r.shuffle(s.data).join("   "));
  }
}

// 4.° O.16: interpretar diagramas de tallo y hojas.
export function interpretStemLeaf(r: Rng): Question {
  const s = stemData(r);
  const form = r.int(0, 3);
  if (form === 0) return numQ(s.data[0], "¿Cuál es el dato menor?", s.visual, `El menor es ${s.data[0]}.`, "menor");
  if (form === 1) return numQ(s.data[s.data.length - 1], "¿Cuál es el dato mayor?", s.visual, `El mayor es ${s.data[s.data.length - 1]}.`, "mayor");
  if (form === 2) return numQ(s.data.length, "¿Cuántos datos hay en total?", s.visual, `Cada hoja es un dato: hay ${s.data.length}.`, "total");
  const cut = s.stems[1] * 10 + r.int(0, 9);
  const n = s.data.filter((x) => x > cut).length;
  return numQ(n, `¿Cuántos datos son mayores que ${cut}?`, s.visual, `Mayores que ${cut}: ${s.data.filter((x) => x > cut).join(", ") || "ninguno"}.`, "mayores-que");
}

// ---------------------------------------------------------------------------
// Moda, mediana y rango

export type Stat = "moda" | "mediana" | "rango";
export type StatDisplay = "list" | "stem" | "table" | "linePlot" | "freq";

// Cantidad impar de datos con una sola moda.
function dataset(r: Rng, min: number, max: number): number[] {
  const n = r.pick([5, 7]);
  const mode = r.int(min, max);
  const others = distinct(r, n - 2, min, max, (x) => x !== mode);
  return [mode, mode, ...others];
}

const STAT_HELP: Record<Stat, string> = {
  moda: "La moda es el dato que más se repite",
  mediana: "La mediana es el dato del centro cuando se ordenan",
  rango: "El rango es la diferencia entre el dato mayor y el menor",
};

// 4.° EE: moda, mediana o rango de datos mostrados de distintas formas.
export function statistic(r: Rng, which: Stat | "any", display: StatDisplay = "list"): Question {
  const stat = which === "any" ? r.pick<Stat>(["moda", "mediana", "rango"]) : which;
  const small = display === "linePlot" || display === "freq";
  const data = display === "stem" ? dataset(r, 20, 49) : small ? dataset(r, 2, 8) : dataset(r, 3, 30);
  const sorted = [...data].sort((a, b) => a - b);
  const answer = stat === "moda" ? data[0] : stat === "mediana" ? sorted[(sorted.length - 1) / 2] : sorted[sorted.length - 1] - sorted[0];
  let visual: Visual;
  if (display === "stem") {
    const stems = [2, 3, 4];
    visual = table(["Tallo", "Hojas"], stems.map((s) => [String(s), sorted.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(" ") || "—"]), "Clave: 3 | 2 = 32");
  } else if (display === "table") {
    const names = r.shuffle(["Ana", "Luis", "Rosa", "Hugo", "Elena", "Omar", "Carla"]).slice(0, data.length);
    const shuffled = r.shuffle(data);
    visual = table(["Alumno", "Puntos"], names.map((n, i) => [n, String(shuffled[i])]), "Puntos en el juego");
  } else if (small) {
    const labels = Array.from({ length: sorted[sorted.length - 1] - sorted[0] + 1 }, (_, i) => sorted[0] + i);
    const counts = labels.map((l) => data.filter((x) => x === l).length);
    visual = display === "linePlot" ? { kind: "linePlot", title: "Libros leídos por alumno", labels: labels.map(String), counts } : table(["Libros leídos", "Frecuencia"], labels.filter((_, i) => counts[i] > 0).map((l) => [String(l), String(counts[labels.indexOf(l)])]));
  } else {
    visual = { kind: "text", text: r.shuffle(data).join("   ") };
  }
  const detail = stat === "moda" ? `${answer} aparece ${data.filter((x) => x === answer).length} veces` : stat === "mediana" ? `ordenados: ${sorted.join(", ")}; el del centro es ${answer}` : `${sorted[sorted.length - 1]} − ${sorted[0]} = ${answer}`;
  return numQ(answer, `¿Cuál es ${stat === "rango" ? "el rango" : `la ${stat}`} de los datos?`, visual, `${STAT_HELP[stat]}: ${detail}.`, stat);
}
