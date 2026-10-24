import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, numQ, pct, table, yesNo } from "../kit";
import { dec, pt, slopeIntercept } from "./util";

// Datos de 2.° de secundaria: relaciones proporcionales en problemas,
// diagramas de dispersión con rectas de ajuste y tablas de doble entrada.

// ---------------------------------------------------------------------------
// Relaciones proporcionales

const PROPORTIONAL: [string, boolean, string][] = [
  ["Cada cuaderno cuesta 4 soles. Se relaciona el número de cuadernos con el precio total.", true, "Si no compras ninguno, pagas 0, y el precio crece siempre 4 por cuaderno: es proporcional."],
  ["Un taxi cobra 5 soles al subir y 2 soles por kilómetro. Se relaciona la distancia con el costo.", false, "Con 0 km ya se pagan 5 soles: la recta no pasa por el origen."],
  ["Un auto recorre 60 km en cada hora, a velocidad constante. Se relaciona el tiempo con la distancia.", true, "La distancia ÷ el tiempo siempre da 60."],
  ["Una vela de 30 cm se acorta 2 cm cada hora. Se relaciona el tiempo con la altura de la vela.", false, "La altura disminuye y empieza en 30: no es y = kx."],
  ["Por cada 3 vasos de agua se usan 2 sobres de refresco. Se relacionan los sobres con los vasos.", true, "La razón vasos ÷ sobres siempre es 3/2."],
  ["Un gimnasio cobra 50 soles de inscripción y 30 soles por mes. Se relacionan los meses con el costo total.", false, "Con 0 meses ya se pagan 50 soles: no pasa por el origen."],
  ["Una impresora imprime 20 páginas por minuto. Se relacionan los minutos con las páginas impresas.", true, "Páginas ÷ minutos siempre da 20."],
  ["La edad de Ana y la de su hermano, que es 3 años mayor. Se relaciona la edad de Ana con la de su hermano.", false, "Se suma 3, no se multiplica: la razón cambia con los años."],
];
// Identificar relaciones proporcionales: problemas.
export function proportionalWord(r: Rng): Question {
  const [text, yes, why] = r.pick(PROPORTIONAL);
  return yesNo(`${text} ¿Es una relación proporcional?`, yes, why, undefined, yes ? "si" : "no");
}

const quad1 = (k: number, max: number): Visual => {
  const pts = [1, 2, 3, 4, 5, 6].map((x) => ({ x, y: k * x })).filter((p) => p.y <= max);
  return { kind: "coordPlane", max, points: pts.map((p) => ({ ...p, emoji: "•" })), lines: [{ from: { x: 0, y: 0 }, to: { x: Math.min(max, max / k), y: Math.min(max, max / k) * k } }] };
};

// Graficar relaciones proporcionales y hallar la pendiente.
export function proportionalSlope(r: Rng): Question {
  const k = r.int(1, 4);
  const [what, unit] = r.pick([["kilómetros recorridos por hora", "km"], ["soles que se pagan por kilo", "soles"], ["litros que caen por minuto", "litros"]]);
  return numQ(k, `El gráfico muestra una relación proporcional (${what}). ¿Cuál es la pendiente de la recta?`, quad1(k, 12), `La recta pasa por (0, 0) y (1, ${k}): por cada unidad de x, y aumenta ${k} ${unit}. La pendiente es ${k}.`, "pendiente");
}

const COMPARE = ["A", "B", "Las dos son iguales"];
// Comparar relaciones proporcionales representadas de formas distintas.
export function compareProportional(r: Rng): Question {
  const kA = r.int(2, 9);
  let kB = r.int(2, 9);
  if (r.chance(0.2)) kB = kA;
  const name = r.pick(NAMES);
  const asTable = r.chance(0.5);
  const xs = [2, 3, 5];
  const visual: Visual = asTable ? table(["Horas", "Soles"], xs.map((x) => [String(x), String(kA * x)]), `Trabajo A`) : quad1(Math.min(kA, 4), 12);
  const realA = asTable ? kA : Math.min(kA, 4);
  const k = realA === kB ? 2 : realA > kB ? 0 : 1;
  return fixedQ(`${name} puede elegir entre dos trabajos. ${asTable ? "La tabla" : "El gráfico"} muestra lo que paga el trabajo A según las horas. El trabajo B paga según la ecuación y = ${kB}x (x horas, y soles). ¿Cuál paga más por hora?`, COMPARE, COMPARE[k], `A paga ${realA} soles por hora y B paga ${kB} soles por hora.`, visual, "comparar");
}

// ---------------------------------------------------------------------------
// Diagramas de dispersión

type Scatter = { xLabel: string; yLabel: string; xMax: number; yMax: number; xStep: number; yStep: number; points: { x: number; y: number }[]; m: number; b: number };
const SETTINGS: [string, string, number, number, number, number, number, number][] = [
  // x, y, xMax, yMax, xStep, yStep, pendiente base, intersección base
  ["Horas de estudio", "Nota del examen", 10, 20, 1, 2, 1.5, 5],
  ["Temperatura (°C)", "Helados vendidos", 30, 60, 5, 10, 2, 0],
  ["Edad del auto (años)", "Precio (miles de soles)", 10, 50, 1, 5, -4, 45],
  ["Horas de juego al día", "Horas de sueño", 6, 10, 1, 1, -0.5, 9],
  ["Estatura (cm)", "Talla de calzado", 180, 45, 20, 5, 0.25, 0],
];
function scatter(r: Rng, kind: "positive" | "negative" | "none" | "nonlinear" = r.pick(["positive", "negative"])): Scatter {
  const options = SETTINGS.filter((s) => (kind === "negative" ? s[6] < 0 : kind === "positive" ? s[6] > 0 : true));
  const [xLabel, yLabel, xMax, yMax, xStep, yStep, m0, b0] = r.pick(options);
  const n = r.int(8, 11);
  const xs = Array.from({ length: n }, () => Math.round((r.int(1, 9) / 10) * xMax / xStep) * xStep).map((x) => Math.max(xStep, x));
  const noise = yMax / 10;
  const m = kind === "none" ? 0 : m0, b = kind === "none" ? yMax / 2 : b0;
  const points = xs.map((x) => {
    let y = kind === "nonlinear" ? yMax * 0.9 - (4 * yMax * 0.8 * (x / xMax - 0.5) ** 2) : m * x + b;
    y += (r.int(-10, 10) / 10) * noise * (kind === "none" ? 3 : 1);
    return { x, y: Math.max(0, Math.min(yMax, Math.round(y))) };
  });
  return { xLabel, yLabel, xMax, yMax, xStep, yStep, points, m, b };
}
const plot = (s: Scatter, line?: { from: { x: number; y: number }; to: { x: number; y: number } }): Visual => ({ kind: "scatterPlot", xLabel: s.xLabel, yLabel: s.yLabel, xMax: s.xMax, yMax: s.yMax, xStep: s.xStep, yStep: s.yStep, points: s.points, line });

// Interpretar diagramas de dispersión.
export function interpretScatter(r: Rng): Question {
  const s = scatter(r);
  const cut = s.xStep * Math.round(r.int(3, 7) / 10 * s.xMax / s.xStep);
  const above = r.chance(0.5);
  const count = s.points.filter((p) => (above ? p.x > cut : p.x < cut)).length;
  return numQ(count, `Cada punto del diagrama es un dato. ¿Cuántos puntos tienen un valor de «${s.xLabel}» ${above ? "mayor" : "menor"} que ${cut}?`, plot(s), `Se cuentan los puntos ${above ? "a la derecha" : "a la izquierda"} de ${cut} en el eje horizontal: ${count}.`, "contar");
}

// Crear diagramas de dispersión (¿qué punto falta?).
export function createScatter(r: Rng): Question {
  const s = scatter(r);
  const data = s.points.slice(0, 6);
  const i = r.int(0, data.length - 1);
  const missing = data[i];
  const shown = { ...s, points: data.filter((_, j) => j !== i) };
  const good = pt(missing);
  const wrong = [pt({ x: missing.y, y: missing.x }), pt({ x: missing.x + s.xStep, y: missing.y }), pt({ x: missing.x, y: Math.max(0, missing.y - s.yStep) })].filter((w) => w !== good);
  return choiceQ(r, `Se graficaron estos datos: ${data.map(pt).join("; ")}. Falta un punto en el diagrama. ¿Cuál?`, good, wrong, `El par ${good} de la lista no aparece en el diagrama.`, plot(shown), "crear");
}

// Predicciones con la tendencia (o con la recta de ajuste).
export function scatterPrediction(r: Rng, withLine = false): Question {
  const s = scatter(r);
  const x = s.xStep * Math.round((r.int(2, 8) / 10) * s.xMax / s.xStep);
  const y = Math.round(s.m * x + s.b);
  const line = { from: { x: 0, y: s.b }, to: { x: s.xMax, y: s.m * s.xMax + s.b } };
  const step = s.yStep * 2;
  const opts = [y, y + step, y - step, y + 2 * step].filter((v) => v >= 0 && v <= s.yMax * 1.2);
  if (opts.length < 3) return scatterPrediction(r, withLine);
  return choiceQ(r, `${withLine ? "La recta es la recta de ajuste de los datos." : "Observa la tendencia de los datos."} ¿Qué valor de «${s.yLabel}» se espera aproximadamente cuando «${s.xLabel}» es ${x}?`, `Unos ${y}`, opts.slice(1).map((v) => `Unos ${v}`), `Siguiendo la tendencia${withLine ? " (la recta)" : ""}, en x = ${x} el valor está cerca de ${y}.`, plot(s, withLine ? line : undefined), withLine ? "recta" : "tendencia");
}

// Valores atípicos en diagramas de dispersión.
export function scatterOutlier(r: Rng): Question {
  const s = scatter(r);
  const i = r.int(0, s.points.length - 1);
  const p = s.points[i];
  const expected = s.m * p.x + s.b;
  const outlier = { x: p.x, y: expected > s.yMax / 2 ? Math.round(expected - s.yMax * 0.6) : Math.round(expected + s.yMax * 0.6) };
  if (outlier.y < 0 || outlier.y > s.yMax) return scatterOutlier(r);
  s.points[i] = outlier;
  const others = s.points.filter((_, j) => j !== i);
  return choiceQ(r, "¿Qué punto es un valor atípico?", pt(outlier), r.shuffle(others).slice(0, 3).map(pt), `${pt(outlier)} está muy lejos de la tendencia del resto de los puntos.`, plot(s), "atipico");
}

const DESCRIBE = ["Asociación lineal positiva", "Asociación lineal negativa", "Asociación no lineal", "Sin asociación"];
// Describir diagramas de dispersión.
export function describeScatter(r: Rng): Question {
  const k = r.int(0, 3);
  const s = scatter(r, (["positive", "negative", "nonlinear", "none"] as const)[k]);
  const why = ["Los puntos suben de izquierda a derecha, cerca de una recta.", "Los puntos bajan de izquierda a derecha, cerca de una recta.", "Los puntos siguen una curva, no una recta.", "Los puntos están dispersos, sin ninguna tendencia."][k];
  return fixedQ("¿Cómo describirías la relación que muestra el diagrama?", DESCRIBE, DESCRIBE[k], why, plot(s), ["positiva", "negativa", "no-lineal", "ninguna"][k]);
}

const ASSOC: [string, number][] = [
  ["las horas de estudio y la nota del examen", 0], ["la temperatura y la venta de helados", 0], ["la estatura y la talla de calzado", 0], ["los kilómetros recorridos y el combustible usado", 0],
  ["la edad de un auto y su precio de venta", 1], ["las horas frente a la pantalla y las horas de sueño", 1], ["la altura sobre el nivel del mar y la temperatura", 1], ["las faltas a clase y la nota final", 1],
  ["el número de calzado y la nota de matemática", 2], ["el mes de nacimiento y la estatura", 2], ["el color del cuaderno y las horas de estudio", 2],
];
const ASSOC_OPTS = ["Positiva", "Negativa", "No hay asociación"];
// Describir asociaciones entre dos variables.
export function association(r: Rng): Question {
  if (r.chance(0.4)) {
    const k = r.int(0, 2);
    const s = scatter(r, (["positive", "negative", "none"] as const)[k]);
    return fixedQ("¿Qué tipo de asociación muestra el diagrama?", ASSOC_OPTS, ASSOC_OPTS[k], ["Cuando una variable aumenta, la otra también tiende a aumentar.", "Cuando una variable aumenta, la otra tiende a disminuir.", "No se ve ninguna tendencia."][k], plot(s), "grafico");
  }
  const [text, k] = r.pick(ASSOC);
  return fixedQ(`Si se hace un diagrama de dispersión con ${text}, ¿qué asociación se espera?`, ASSOC_OPTS, ASSOC_OPTS[k], ["Cuando una aumenta, la otra también tiende a aumentar.", "Cuando una aumenta, la otra tiende a disminuir.", "Una variable no tiene que ver con la otra."][k], undefined, "situacion");
}

// Identificar rectas de ajuste.
export function bestFitLine(r: Rng): Question {
  const s = scatter(r);
  const good = r.chance(0.5);
  const b = good ? s.b : s.b + (s.m > 0 ? 1 : -1) * s.yMax * 0.35;
  const m = good ? s.m : r.chance(0.5) ? -s.m : s.m;
  const from = { x: 0, y: b }, to = { x: s.xMax, y: m * s.xMax + b };
  return yesNo("¿La recta dibujada es una buena recta de ajuste para los datos?", good, good ? "Sigue la tendencia y deja más o menos la misma cantidad de puntos arriba y abajo." : "No sigue la tendencia: casi todos los puntos quedan del mismo lado o la inclinación es la contraria.", plot(s, { from, to }), good ? "si" : "no");
}

// Escribir la ecuación de la recta de ajuste.
export function bestFitEquation(r: Rng): Question {
  const s = scatter(r);
  const [mn, md] = s.m === 1.5 ? [3, 2] : s.m === -0.5 ? [-1, 2] : s.m === 0.25 ? [1, 4] : [s.m, 1];
  const good = slopeIntercept(mn, md, s.b);
  const wrong = [slopeIntercept(-mn, md, s.b), slopeIntercept(mn, md, s.b + s.yStep * 2), slopeIntercept(md, Math.abs(mn), s.b), slopeIntercept(mn * 2, md, s.b)].filter((w) => w !== good);
  const line = { from: { x: 0, y: s.b }, to: { x: s.xMax, y: s.m * s.xMax + s.b } };
  return choiceQ(r, "¿Qué ecuación corresponde a la recta de ajuste dibujada?", good, [...new Set(wrong)], `La recta corta el eje vertical en ${dec(s.b)} y cambia ${dec(s.m)} por cada unidad de x: ${good}.`, plot(s, line), "ecuacion");
}

// Interpretar rectas de ajuste: problemas.
export function interpretBestFit(r: Rng): Question {
  const m = r.int(2, 6), b = r.int(20, 50), x = r.int(2, 9);
  if (r.chance(0.5)) return numQ(m * x + b, `La recta de ajuste y = ${m}x + ${b} relaciona las horas de práctica semanales (x) con el puntaje en un torneo (y). Según la recta, ¿qué puntaje se espera con ${x} horas de práctica?`, undefined, `y = ${m} × ${x} + ${b} = ${m * x + b}.`, "predecir");
  return choiceQ(r, `La recta de ajuste y = ${m}x + ${b} relaciona las horas de práctica semanales (x) con el puntaje en un torneo (y). ¿Qué significa el ${m}?`, `Por cada hora más de práctica, el puntaje sube unos ${m} puntos`, [`El puntaje esperado sin practicar es de ${m} puntos`, `Se necesitan ${m} horas de práctica para ganar el torneo`, `El puntaje máximo que se puede alcanzar es de ${m * 10} puntos`], `${m} es la pendiente: el cambio de y por cada unidad de x.`, undefined, "pendiente");
}

// ---------------------------------------------------------------------------
// Tablas de doble entrada

const TWO_WAY: [string, [string, string], [string, string]][] = [
  ["deporte favorito según el grado", ["Fútbol", "Vóley"], ["1.° de secundaria", "2.° de secundaria"]],
  ["si tienen mascota, según su zona", ["Con mascota", "Sin mascota"], ["Zona urbana", "Zona rural"]],
  ["cómo llegan al colegio, según el turno", ["A pie", "En movilidad"], ["Mañana", "Tarde"]],
];
// Crear e interpretar tablas de doble entrada.
export function twoWayTable(r: Rng): Question {
  const [topic, cols, rows] = r.pick(TWO_WAY);
  const cells = [[r.int(5, 30), r.int(5, 30)], [r.int(5, 30), r.int(5, 30)]];
  const rowSum = cells.map((c) => c[0] + c[1]);
  const colSum = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]];
  const total = rowSum[0] + rowSum[1];
  const visual = table(["", cols[0], cols[1], "Total"], [[rows[0], String(cells[0][0]), String(cells[0][1]), String(rowSum[0])], [rows[1], String(cells[1][0]), String(cells[1][1]), String(rowSum[1])], ["Total", String(colSum[0]), String(colSum[1]), String(total)]], `Encuesta: ${topic}`);
  const i = r.int(0, 1), j = r.int(0, 1);
  const form = r.int(0, 3);
  if (form === 0) {
    const hidden = table(["", cols[0], cols[1], "Total"], [[rows[0], String(cells[0][0]), i === 0 && j === 1 ? "?" : String(cells[0][1]), String(rowSum[0])], [rows[1], String(cells[1][0]), i === 1 && j === 1 ? "?" : String(cells[1][1]), String(rowSum[1])], ["Total", String(colSum[0]), String(colSum[1]), String(total)]], `Encuesta: ${topic}`);
    return numQ(cells[i][1], "Completa la tabla de doble entrada. ¿Qué número va en lugar de «?»?", hidden, `${rowSum[i]} − ${cells[i][0]} = ${cells[i][1]}.`, "completar");
  }
  if (form === 1) return numQ(colSum[j], `¿Cuántos estudiantes en total eligieron «${cols[j]}»?`, visual, `${cells[0][j]} + ${cells[1][j]} = ${colSum[j]}.`, "total");
  if (form === 2) {
    const p = Math.round((cells[i][j] / rowSum[i]) * 100);
    return choiceQ(r, `Entre los estudiantes de «${rows[i]}», ¿qué porcentaje eligió «${cols[j]}»? (Redondeado al entero.)`, pct(p), [pct(Math.round((cells[i][j] / total) * 100)), pct(Math.round((cells[i][j] / colSum[j]) * 100)), pct(100 - p)].filter((w, k, all) => w !== pct(p) && all.indexOf(w) === k).concat(pct(p + 7)).slice(0, 3), `${cells[i][j]} ÷ ${rowSum[i]} ≈ ${pct(p)}.`, visual, "porcentaje");
  }
  return numQ(cells[i][j], `¿Cuántos estudiantes de «${rows[i]}» eligieron «${cols[j]}»?`, visual, `Se busca la fila «${rows[i]}» y la columna «${cols[j]}»: ${cells[i][j]}.`, "leer");
}
