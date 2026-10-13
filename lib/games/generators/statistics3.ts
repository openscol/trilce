import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { type Frac, choiceQ, d3, decQ, distinct, fixedQ, fmt, fracQ, numQ, sum, table, yesNo } from "./kit";

// Datos, estadística y probabilidad de 6.° en adelante: frecuencias
// relativas, gráficos dobles, histogramas, gráficos circulares, caja y
// bigotes, desviación media, cuartiles, valores atípicos y probabilidad.

const THEMES: [string, string[]][] = [
  ["Deporte favorito", ["Fútbol", "Vóley", "Básquet", "Natación", "Tenis"]],
  ["Fruta favorita", ["Mango", "Fresa", "Uva", "Plátano", "Piña"]],
  ["Medio de transporte", ["Bus", "Auto", "Bicicleta", "A pie", "Moto"]],
  ["Curso preferido", ["Arte", "Ciencia", "Música", "Lectura", "Deporte"]],
];

// Cuatro categorías cuyos conteos suman un total «redondo» (20, 25, 40 o 50).
function categorical(r: Rng) {
  const [title, all] = r.pick(THEMES);
  const total = r.pick([20, 25, 40, 50]);
  const unit = total / 20 >= 2 ? 2 : 1;
  for (;;) {
    const cuts = distinct(r, 3, 1, total / unit - 1).sort((a, b) => a - b);
    const counts = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], total / unit - cuts[2]].map((x) => x * unit);
    if (counts.some((c) => c <= 0) || new Set(counts).size < 4) continue;
    return { title, labels: r.shuffle(all).slice(0, 4), counts, total };
  }
}

// 6.° II.1: crear diagramas de puntos (¿cuántas X van?).
export function createDotPlot(r: Rng): Question {
  const [title, what] = r.pick([["Goles por partido", "goles"], ["Hermanos por alumno", "hermanos"], ["Libros leídos en el mes", "libros"], ["Horas de sueño", "horas"]]);
  const start = r.int(0, 5);
  const values = [0, 1, 2, 3, 4].map((i) => start + i);
  const counts = values.map(() => r.int(0, 4));
  counts[r.int(0, 4)] += 2;
  const data = r.shuffle(values.flatMap((v, i) => Array.from({ length: counts[i] }, () => String(v))));
  const i = r.pick([0, 1, 2, 3, 4].filter((k) => counts[k] > 0));
  return numQ(counts[i], `Vas a hacer un diagrama de puntos con estos datos. ¿Cuántos puntos van sobre el ${values[i]}?`, `${title}\n${data.join("   ")}`, `El dato ${values[i]} (${what}) aparece ${counts[i]} ${counts[i] === 1 ? "vez" : "veces"}.`);
}

// 6.° II.6 / II.8: frecuencias relativas y gráficos de barras de porcentajes.
export function relativeFrequency(r: Rng, asGraph: boolean): Question {
  const d = categorical(r);
  const i = r.int(0, 3);
  const p = (d.counts[i] * 100) / d.total;
  const visual = table(["Respuesta", "Frecuencia"], [...d.labels.map((l, k) => [l, String(d.counts[k])]), ["Total", String(d.total)]], d.title);
  return numQ(p, asGraph ? `Vas a hacer un gráfico de barras de porcentajes. ¿Hasta qué porcentaje llega la barra de «${d.labels[i]}»?` : `¿Cuál es la frecuencia relativa de «${d.labels[i]}», como porcentaje?`, visual, `${d.counts[i]} de ${d.total}: ${d.counts[i]}/${d.total} = ${p} %.`);
}

// Dos series (dos salones, dos años...) sobre las mismas categorías.
function twoSeries(r: Rng, trend: boolean) {
  const [title, legend] = r.pick<[string, [string, string]]>([["Libros leídos", ["5.° grado", "6.° grado"]], ["Entradas vendidas", ["Cine Sol", "Cine Luna"]], ["Puntos por partido", ["Equipo A", "Equipo B"]], ["Botellas recicladas", ["Salón A", "Salón B"]]]);
  const labels = trend ? ["Mar", "Abr", "May", "Jun"] : ((skip: number) => ["Lunes", "Martes", "Miérc.", "Jueves", "Viernes"].filter((_, k) => k !== skip))(r.int(0, 4));
  const step = r.pick([2, 5, 10]);
  const a = labels.map(() => r.int(1, 8) * step);
  const b = labels.map(() => r.int(1, 8) * step);
  const top = Math.max(...a, ...b);
  const chart: Visual = { kind: "barChart", title, bars: labels.map((label, i) => ({ label, value: a[i], value2: b[i] })), max: Math.ceil(top / step) * step, step, line: trend, legend };
  return { title, legend, labels, a, b, chart, asTable: table(["", ...legend], labels.map((l, i) => [l, String(a[i]), String(b[i])]), title) };
}

// 6.° II.10 / II.11 / II.17 / II.18: gráficos dobles de barras y de líneas.
export function doubleGraph(r: Rng, line: boolean, create: boolean): Question {
  const s = twoSeries(r, line);
  const i = r.int(0, 3);
  if (create) {
    const second = r.chance(0.5);
    return numQ(second ? s.b[i] : s.a[i], `Vas a hacer un gráfico doble de ${line ? "líneas" : "barras"} con la tabla. ¿Hasta qué número llega ${line ? "el punto" : "la barra"} de «${s.legend[second ? 1 : 0]}» en «${s.labels[i]}»?`, s.asTable, `En la fila «${s.labels[i]}», la columna «${s.legend[second ? 1 : 0]}» dice ${second ? s.b[i] : s.a[i]}.`);
  }
  const form = r.int(0, 3);
  if (form === 0) return numQ(Math.abs(s.a[i] - s.b[i]), `¿Cuál es la diferencia entre «${s.legend[0]}» y «${s.legend[1]}» en «${s.labels[i]}»?`, s.chart, `${Math.max(s.a[i], s.b[i])} − ${Math.min(s.a[i], s.b[i])} = ${Math.abs(s.a[i] - s.b[i])}.`, "diferencia");
  if (form === 1) return numQ(s.a[i] + s.b[i], `¿Cuánto suman «${s.legend[0]}» y «${s.legend[1]}» en «${s.labels[i]}»?`, s.chart, `${s.a[i]} + ${s.b[i]} = ${s.a[i] + s.b[i]}.`, "suma");
  if (form === 2) return numQ(sum(s.a), `¿Cuál es el total de «${s.legend[0]}» en los cuatro ${line ? "meses" : "días"}?`, s.chart, `${s.a.join(" + ")} = ${sum(s.a)}.`, "total-serie");
  if (sum(s.a) === sum(s.b)) return doubleGraph(r, line, create);
  return fixedQ("¿Qué serie tiene el total mayor?", [...s.legend], sum(s.a) > sum(s.b) ? s.legend[0] : s.legend[1], `«${s.legend[0]}»: ${sum(s.a)}; «${s.legend[1]}»: ${sum(s.b)}.`, s.chart, "comparar-totales");
}

// Datos agrupados en intervalos iguales.
function grouped(r: Rng) {
  const width = r.pick([5, 10]);
  const start = r.int(0, 4) * width;
  const bins = [0, 1, 2, 3].map((i) => ({ lo: start + i * width, hi: start + (i + 1) * width - 1 }));
  const counts = bins.map(() => r.int(1, 9));
  const data = r.shuffle(bins.flatMap((b, i) => Array.from({ length: counts[i] }, () => r.int(b.lo, b.hi))));
  const title = r.pick(["Edades de los asistentes", "Puntos en la prueba", "Minutos de lectura", "Kilómetros recorridos"]);
  const top = Math.max(...counts);
  const chart: Visual = { kind: "barChart", title, bars: bins.map((b, i) => ({ label: `${b.lo}–${b.hi}`, value: counts[i] })), max: Math.ceil(top / 2) * 2, step: top > 6 ? 2 : 1 };
  return { bins, counts, data, title, chart };
}

// 6.° II.12 / II.13: histogramas.
export function histogram(r: Rng, create: boolean): Question {
  const g = grouped(r);
  const i = r.int(0, 3);
  const label = `${g.bins[i].lo}–${g.bins[i].hi}`;
  if (create) return numQ(g.counts[i], `Vas a hacer un histograma con estos datos. ¿Qué altura tiene la barra del intervalo ${label}?`, `${g.title}\n${g.data.join("   ")}`, `Entre ${g.bins[i].lo} y ${g.bins[i].hi} hay ${g.counts[i]} ${g.counts[i] === 1 ? "dato" : "datos"}.`);
  const form = r.int(0, 2);
  if (form === 0) return numQ(g.counts[i], `¿Cuántos datos hay en el intervalo ${label}?`, g.chart, `La barra de ${label} llega a ${g.counts[i]}.`, "leer");
  if (form === 1) return numQ(sum(g.counts), "¿Cuántos datos hay en total?", g.chart, `${g.counts.join(" + ")} = ${sum(g.counts)}.`, "total");
  const cut = r.int(1, 3);
  return numQ(sum(g.counts.slice(cut)), `¿Cuántos datos son de ${g.bins[cut].lo} o más?`, g.chart, `${g.counts.slice(cut).join(" + ")} = ${sum(g.counts.slice(cut))}.`, "o-mas");
}

// 6.° II.14: interpretar gráficos circulares.
export function circleGraph(r: Rng): Question {
  const d = categorical(r);
  const percents = d.counts.map((c) => (c * 100) / d.total);
  const visual: Visual = { kind: "pie", title: d.title, slices: d.labels.map((label, i) => ({ label, value: percents[i] })) };
  const i = r.int(0, 3);
  const people = d.total * r.pick([2, 4, 8, 10]);
  const form = r.int(0, 2);
  if (form === 0) return numQ((percents[i] * people) / 100, `Se encuestó a ${people} personas. ¿Cuántas eligieron «${d.labels[i]}»?`, visual, `${percents[i]} % de ${people} = ${(percents[i] * people) / 100}.`, "cantidad");
  if (form === 1) {
    const j = (i + 1) % 4;
    return numQ(percents[i] + percents[j], `¿Qué porcentaje suman «${d.labels[i]}» y «${d.labels[j]}»?`, visual, `${percents[i]} + ${percents[j]} = ${percents[i] + percents[j]} %.`, "sumar");
  }
  const top = Math.max(...percents);
  return { kind: "choice", prompt: "¿Qué opción fue la más elegida?", visual, options: d.labels, answer: d.labels[percents.indexOf(top)], explanation: `El sector más grande es el de ${top} %.`, tag: "mayor" };
}

// Siete u ocho datos ordenados con cuartiles enteros.
function fiveNumbers(r: Rng) {
  for (;;) {
    const data = distinct(r, 7, 2, 40).sort((a, b) => a - b);
    if (data.length < 7) continue;
    // Con 7 datos: mediana = 4.°, Q1 = 2.°, Q3 = 6.°.
    return { data, min: data[0], q1: data[1], median: data[3], q3: data[5], max: data[6] };
  }
}

// 6.° II.21: diagramas de caja y bigotes.
export function boxPlots(r: Rng): Question {
  const f = fiveNumbers(r);
  const axisMin = Math.floor(f.min / 5) * 5;
  const axisMax = Math.ceil(f.max / 5) * 5;
  const visual: Visual = { kind: "boxPlot", min: f.min, q1: f.q1, median: f.median, q3: f.q3, max: f.max, axisMin, axisMax, step: 5 };
  const text = `Mínimo ${f.min} · Q1 ${f.q1} · Mediana ${f.median} · Q3 ${f.q3} · Máximo ${f.max}`;
  const form = r.int(0, 3);
  if (form === 0) return numQ(f.max - f.min, `Datos del diagrama: ${text}. ¿Cuál es el rango?`, visual, `Máximo − mínimo = ${f.max} − ${f.min} = ${f.max - f.min}.`, "rango");
  if (form === 1) return numQ(f.q3 - f.q1, `Datos del diagrama: ${text}. ¿Cuál es el rango intercuartílico (el ancho de la caja)?`, visual, `Q3 − Q1 = ${f.q3} − ${f.q1} = ${f.q3 - f.q1}.`, "rango-intercuartilico");
  if (form === 2) return fixedQ(`Datos del diagrama: ${text}. ¿Qué indica la línea de adentro de la caja?`, ["El mínimo", "La mediana", "El máximo", "La media"], "La mediana", `La línea que parte la caja es la mediana: ${f.median}.`, visual, "mediana");
  return fixedQ(`Datos del diagrama: ${text}. ¿Qué parte de los datos está dentro de la caja?`, ["Un cuarto de los datos", "La mitad de los datos", "Todos los datos"], "La mitad de los datos", "La caja va de Q1 a Q3: ahí está la mitad central de los datos.", visual, "mitad-central");
}

// ---------------------------------------------------------------------------
// Estadística

const STAT_QUESTIONS: [string, boolean][] = [
  ["¿Cuántas horas duermen los alumnos de sexto grado?", true],
  ["¿Cuánto miden los alumnos de mi salón?", true],
  ["¿Qué deporte prefieren los alumnos del colegio?", true],
  ["¿Cuántos minutos tardan los alumnos en llegar al colegio?", true],
  ["¿Cuántos libros leyeron este mes los niños del barrio?", true],
  ["¿Cuánto pesan las mochilas de mis compañeros?", true],
  ["¿Cuántos hermanos tienen los alumnos de primaria?", true],
  ["¿Qué edad tienen los jugadores del equipo?", true],
  ["¿Cuánto mide el director del colegio?", false],
  ["¿Cuántos días tiene el mes de julio?", false],
  ["¿A qué hora empezó hoy la clase de matemática?", false],
  ["¿Cuántos lados tiene un hexágono?", false],
  ["¿Cuál es la capital del Perú?", false],
  ["¿Cuántos alumnos hay hoy en mi salón?", false],
  ["¿Qué nota sacó Lucía en el último examen?", false],
  ["¿Cuántas páginas tiene este libro?", false],
];

// 6.° JJ.1: identificar preguntas estadísticas.
export function statisticalQuestion(r: Rng): Question {
  const [text, yes] = r.pick(STAT_QUESTIONS);
  return yesNo("¿Es una pregunta estadística?", yes, yes ? "Sí: para responderla hay que recoger datos de varias personas, y las respuestas varían." : "No: tiene una sola respuesta; no hay datos que varíen.", text);
}

const mean = (xs: number[]) => sum(xs) / xs.length;
// 6.° JJ.5: cambios en la media, la mediana, la moda y el rango.
export function statChanges(r: Rng): Question {
  for (;;) {
    const data = Array.from({ length: 5 }, () => r.int(4, 30));
    if (!Number.isInteger(mean(data))) continue;
    const m = mean(data);
    const added = r.chance(0.2) ? m : m + r.pick([-1, 1]) * r.int(2, 15);
    if (added < 0) continue;
    const stat = r.pick(["media", "rango"] as const);
    const options = ["Aumenta", "Disminuye", "Queda igual"];
    const sorted = [...data].sort((a, b) => a - b);
    if (stat === "media") return fixedQ(`La media de estos datos es ${m}. Si se agrega el dato ${added}, ¿qué pasa con la media?`, options, added > m ? options[0] : added < m ? options[1] : options[2], added === m ? "Agregar un dato igual a la media no la cambia." : `Un dato ${added > m ? "mayor" : "menor"} que la media la hace ${added > m ? "subir" : "bajar"}.`, data.join("   "), "media");
    const inside = added >= sorted[0] && added <= sorted[4];
    return fixedQ(`El rango de estos datos es ${sorted[4] - sorted[0]}. Si se agrega el dato ${added}, ¿qué pasa con el rango?`, options, inside ? options[2] : options[0], inside ? "El nuevo dato está entre el menor y el mayor: el rango no cambia." : "El nuevo dato queda fuera de los extremos: el rango crece.", data.join("   "), "rango");
  }
}

// 6.° JJ.6: calcular la desviación media absoluta.
export function meanAbsoluteDeviation(r: Rng): Question {
  for (;;) {
    const n = r.pick([4, 5]);
    const data = Array.from({ length: n }, () => r.int(2, 30));
    const m = mean(data);
    if (!Number.isInteger(m)) continue;
    const devs = data.map((x) => Math.abs(x - m));
    const mad10 = (sum(devs) * 10) / n;
    if (!Number.isInteger(mad10) || sum(devs) === 0) continue;
    return decQ(r, "Calcula la desviación media absoluta (DMA) de los datos.", mad10 * 100, `Media: ${m}. Distancias a la media: ${devs.join(", ")}; su promedio: ${sum(devs)} ÷ ${n} = ${d3(mad10 * 100)}.`, data.join("   "), undefined, [m * 1000, sum(devs) * 1000]);
  }
}

// 6.° JJ.7: calcular cuartiles y rango intercuartílico.
export function quartiles(r: Rng): Question {
  const f = fiveNumbers(r);
  const what = r.pick(["Q1", "Q3", "mediana", "RIC"] as const);
  const answer = what === "Q1" ? f.q1 : what === "Q3" ? f.q3 : what === "mediana" ? f.median : f.q3 - f.q1;
  const names = { Q1: "el primer cuartil (Q1)", Q3: "el tercer cuartil (Q3)", mediana: "la mediana", RIC: "el rango intercuartílico (Q3 − Q1)" };
  return numQ(answer, `Los datos están ordenados. ¿Cuál es ${names[what]}?`, f.data.join("   "), `Mediana: ${f.median} (el del centro). Q1 es la mediana de la mitad de abajo (${f.q1}) y Q3 la de la mitad de arriba (${f.q3}).${what === "RIC" ? ` ${f.q3} − ${f.q1} = ${f.q3 - f.q1}.` : ""}`, what);
}

// Datos parejos con un valor atípico claro.
function withOutlier(r: Rng) {
  const base = r.int(10, 40);
  const normal = Array.from({ length: 5 }, () => base + r.int(-3, 3));
  const high = r.chance(0.5);
  const outlier = high ? base + r.int(25, 45) : Math.max(0, base - r.int(25, 38));
  return { normal, outlier, high: outlier > base, data: r.shuffle([...normal, outlier]) };
}

// 6.° JJ.8 / JJ.9: identificar un valor atípico (y el efecto de quitarlo).
export function outliers(r: Rng, effect: boolean): Question {
  const o = withOutlier(r);
  if (!effect) return choiceQ(r, "¿Cuál es el valor atípico de estos datos?", String(o.outlier), [...new Set(o.normal)].map(String), `${o.outlier} está muy lejos de los demás datos.`, o.data.join("   "), o.high ? "alto" : "bajo");
  const options = ["Aumenta", "Disminuye", "Queda igual"];
  return fixedQ(`El valor atípico es ${o.outlier}. Si se quita, ¿qué pasa con la media de los datos?`, options, o.high ? options[1] : options[0], `Al quitar un dato muy ${o.high ? "alto" : "bajo"}, la media ${o.high ? "baja" : "sube"}.`, o.data.join("   "), o.high ? "alto" : "bajo");
}

// 6.° JJ.10: interpretar medidas de centro y de variación.
export function interpretMeasures(r: Rng): Question {
  const m1 = r.int(10, 30);
  const m2 = m1 + r.pick([-4, -3, -2, 2, 3, 4]);
  const [r1, r2] = distinct(r, 2, 2, 20);
  const visual = table(["", "Media", "Rango"], [["Equipo A", String(m1), String(r1)], ["Equipo B", String(m2), String(r2)]], "Puntos por partido");
  if (r.chance(0.5)) return fixedQ("¿Qué equipo anota más puntos en promedio?", ["Equipo A", "Equipo B"], m1 > m2 ? "Equipo A" : "Equipo B", "La media indica el valor típico: gana el de media mayor.", visual, "centro");
  return fixedQ("¿Qué equipo tiene puntajes más parecidos entre sí (más regulares)?", ["Equipo A", "Equipo B"], r1 < r2 ? "Equipo A" : "Equipo B", "El rango mide la variación: a menor rango, datos más parecidos.", visual, "variacion");
}

// 6.° JJ.11: describir distribuciones en diagramas de puntos.
export function describeDistribution(r: Rng): Question {
  const shape = r.pick(["simetrica", "derecha", "izquierda"] as const);
  const counts = shape === "simetrica" ? [1, 2, 4, 5, 4, 2, 1] : shape === "derecha" ? [5, 4, 3, 2, 1, 1, 0] : [0, 1, 1, 2, 3, 4, 5];
  const start = r.int(1, 10);
  const visual: Visual = { kind: "linePlot", title: "Respuestas correctas", labels: counts.map((_, i) => String(start + i)), counts };
  const form = r.int(0, 1);
  if (form === 0) {
    const options = ["Simétrica: se agrupan en el centro", "La mayoría está en los valores bajos", "La mayoría está en los valores altos"];
    return fixedQ("¿Cómo se distribuyen los datos?", options, options[shape === "simetrica" ? 0 : shape === "derecha" ? 1 : 2], "Se mira dónde están las columnas más altas.", visual, shape);
  }
  const peak = start + counts.indexOf(Math.max(...counts));
  return numQ(peak, "¿Cuál es el valor más frecuente (el pico del diagrama)?", visual, `La columna más alta está sobre el ${peak}.`, "pico");
}

const MEASURE_CASES: [string, string, string][] = [
  ["Sueldos de una empresa donde el dueño gana muchísimo más que los demás.", "La mediana", "Hay un valor atípico: la mediana no se deja arrastrar por él."],
  ["Notas de un salón, todas parecidas entre sí.", "La media", "Sin valores atípicos, la media representa bien a todos los datos."],
  ["Color de mochila preferido por los alumnos.", "La moda", "Con datos que no son números solo se puede hallar la moda."],
  ["Precios de casas de un barrio, con una mansión carísima.", "La mediana", "La mansión es un valor atípico: conviene la mediana."],
  ["Estaturas de los alumnos de un salón, sin casos extremos.", "La media", "Datos parejos: la media funciona bien."],
  ["Talla de zapato que más se vende en una tienda.", "La moda", "Interesa el valor que más se repite: la moda."],
  ["Edades en una fiesta infantil a la que también fue un abuelo.", "La mediana", "El abuelo es un valor atípico: conviene la mediana."],
  ["Minutos que tardan los alumnos en llegar, todos entre 10 y 20.", "La media", "Datos parecidos, sin extremos: la media."],
  ["Sabor de helado más pedido en el quiosco.", "La moda", "Son categorías: se usa la moda."],
  ["Puntajes de un juego donde un jugador sacó diez veces más que el resto.", "La mediana", "Un puntaje extremo arrastra la media: mejor la mediana."],
];

// 6.° JJ.12: elegir la medida de centro adecuada.
export function chooseMeasure(r: Rng): Question {
  const [text, answer, why] = r.pick(MEASURE_CASES);
  return fixedQ("¿Qué medida representa mejor estos datos?", ["La media", "La mediana", "La moda"], answer, why, text, answer.toLowerCase());
}

const SAMPLES: [string, string][] = [
  ["Para saber qué deporte prefiere el colegio, se pregunta solo a los del equipo de fútbol.", "Sesgada"],
  ["Para saber qué música gusta en la ciudad, se pregunta a la salida de un concierto de rock.", "Sesgada"],
  ["Para saber cuánto leen los alumnos, se pregunta solo a quienes están en la biblioteca.", "Sesgada"],
  ["Para conocer la opinión del barrio, se pregunta solo a los amigos del encuestador.", "Sesgada"],
  ["Se sortean 50 nombres de la lista completa de alumnos y se les pregunta.", "Aleatoria"],
  ["Se elige al azar a una de cada diez personas que entran al mercado.", "Aleatoria"],
  ["Se escriben todos los números de casa en papelitos y se sacan 30 sin mirar.", "Aleatoria"],
  ["Una computadora elige 100 teléfonos al azar de toda la ciudad.", "Aleatoria"],
  ["Se pregunta a 5 alumnos de cada grado, de inicial a sexto.", "Representativa"],
  ["Se encuesta a la misma cantidad de niñas y niños de cada salón.", "Representativa"],
  ["Se pregunta a vecinos de todas las cuadras del barrio, no solo de una.", "Representativa"],
  ["Se entrevista a personas de todas las edades, en la misma proporción que en la ciudad.", "Representativa"],
];

// 6.° JJ.13: muestras representativas, aleatorias y sesgadas.
export function sampleTypes(r: Rng): Question {
  const [text, answer] = r.pick(SAMPLES);
  return fixedQ("¿Cómo es esta muestra?", ["Representativa", "Aleatoria", "Sesgada"], answer, answer === "Sesgada" ? "Sesgada: deja fuera a parte de la población o favorece una respuesta." : answer === "Aleatoria" ? "Aleatoria: todos tienen la misma posibilidad de ser elegidos." : "Representativa: se parece a toda la población, en pequeño.", text, answer.toLowerCase());
}

// ---------------------------------------------------------------------------
// Probabilidad

const BAG: [string, string][] = [["🔴", "roja"], ["🔵", "azul"], ["🟢", "verde"], ["🟡", "amarilla"]];

// 6.° KK.1: espacios muestrales de sucesos simples.
export function sampleSpace(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) return numQ(6, "Se lanza un dado común. ¿Cuántos resultados posibles hay?", undefined, "Puede salir 1, 2, 3, 4, 5 o 6: hay 6 resultados.", "dado");
  if (form === 1) {
    const n = r.int(3, 12);
    return numQ(n, `Una ruleta está dividida en ${n} partes iguales numeradas del 1 al ${n}. ¿Cuántos resultados posibles hay al girarla?`, undefined, `Cada parte es un resultado: ${n}.`, "ruleta");
  }
  const colors = r.shuffle(BAG).slice(0, r.int(2, 4));
  const counts = colors.map(() => r.int(1, 4));
  return numQ(colors.length, "Se saca una bolita sin mirar. ¿Cuántos colores distintos pueden salir?", { kind: "bag", items: colors.map(([emoji], i) => ({ emoji, count: counts[i] })) }, `Pueden salir ${colors.length} colores: ${colors.map(([, n]) => n).join(", ")}.`, "bolsa");
}

// 6.° KK.2: principio de conteo.
export function countingPrinciple(r: Rng): Question {
  const [a, b, c] = [r.int(2, 6), r.int(2, 6), r.int(2, 4)];
  const cases: [string, number, string][] = [
    [`Un menú tiene ${a} entradas y ${b} platos de fondo. ¿Cuántos almuerzos distintos (una entrada y un fondo) se pueden armar?`, a * b, `${a} × ${b}`],
    [`Tienes ${a} polos, ${b} pantalones y ${c} pares de zapatillas. ¿Cuántas combinaciones distintas puedes vestir?`, a * b * c, `${a} × ${b} × ${c}`],
    [`Se lanza un dado y una moneda. ¿Cuántos resultados posibles hay en total?`, 12, "6 × 2"],
    [`Una heladería ofrece ${a} sabores y ${b} tipos de cono. ¿Cuántos helados distintos de un sabor se pueden pedir?`, a * b, `${a} × ${b}`],
    [`Una clave tiene una letra (A, B o C) seguida de una cifra del 0 al 9. ¿Cuántas claves distintas hay?`, 30, "3 × 10"],
  ];
  const [text, answer, why] = r.pick(cases);
  return numQ(answer, text, undefined, `Se multiplican las opciones de cada elección: ${why} = ${answer}.`);
}

function bag(r: Rng) {
  const colors = r.shuffle(BAG).slice(0, 3);
  const counts = colors.map(() => r.int(1, 5));
  return { colors, counts, total: sum(counts), visual: { kind: "bag", items: colors.map(([emoji], i) => ({ emoji, count: counts[i] })) } as Visual };
}

// 6.° KK.3 / KK.5: probabilidad de un suceso (y del suceso contrario).
export function probability(r: Rng, opposite: boolean): Question {
  const b = bag(r);
  const i = r.int(0, 2);
  const p: Frac = opposite ? [b.total - b.counts[i], b.total] : [b.counts[i], b.total];
  return fracQ(r, opposite ? `Se saca una bolita sin mirar. ¿Cuál es la probabilidad de que NO sea ${b.colors[i][1]}?` : `Se saca una bolita sin mirar. ¿Cuál es la probabilidad de que sea ${b.colors[i][1]}?`, p, opposite ? `Hay ${b.counts[i]} ${b.colors[i][1]}${b.colors[i][1].endsWith("l") ? "es" : "s"} de ${b.total}; las que no lo son: ${b.total - b.counts[i]} de ${b.total}.` : `Casos favorables entre casos posibles: ${b.counts[i]} de ${b.total}.`, b.visual, opposite ? "contrario" : "simple", [[b.counts[i], b.total - b.counts[i] || 1], [opposite ? b.counts[i] : b.total - b.counts[i], b.total]]);
}

// 6.° KK.4: hacer predicciones.
export function predictions(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5, 6, 10]);
  const n = r.int(1, d - 1);
  const trials = d * r.int(5, 40);
  return numQ((trials / d) * n, r.pick([`La probabilidad de que una ruleta caiga en rojo es ${n}/${d}. Si se gira ${trials} veces, ¿cuántas veces se espera que caiga en rojo?`, `En una fábrica, ${n} de cada ${d} juguetes son azules. De ${fmt(trials)} juguetes, ¿cuántos se espera que sean azules?`, `Un jugador encesta ${n} de cada ${d} tiros. Si lanza ${trials} veces, ¿cuántos tiros se espera que enceste?`]), undefined, `${n}/${d} de ${fmt(trials)} = ${fmt(trials)} ÷ ${d} × ${n} = ${fmt((trials / d) * n)}.`);
}


