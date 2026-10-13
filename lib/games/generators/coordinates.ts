import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { choiceQ, distinct, fixedQ, numQ, table } from "./kit";
import { type Rule2, rule2, ruleEq, ruleY } from "./expressions";

// Plano de coordenadas (primer cuadrante), relaciones de dos variables y
// diagramas de dispersión (5.° en adelante).

type P = { x: number; y: number };
const pt = (p: P) => `(${p.x}, ${p.y})`;
const plane = (points: (P & { emoji: string })[], max = 8, connect?: "open" | "closed"): Visual => ({ kind: "coordPlane", max, points, connect });
const dots = (ps: P[]) => ps.map((p) => ({ ...p, emoji: "•" }));

// Opciones de pares ordenados parecidos al correcto (incluye el par invertido).
function pointChoice(r: Rng, prompt: string, answer: P, explanation: string, visual?: Visual, tag?: string, max = 8): Question {
  const wrong: P[] = [{ x: answer.y, y: answer.x }, { x: answer.x + 1, y: answer.y }, { x: answer.x, y: answer.y + 1 }, { x: answer.x - 1, y: answer.y }, { x: answer.x, y: answer.y - 1 }, { x: answer.x + 1, y: answer.y + 1 }];
  return choiceQ(r, prompt, pt(answer), wrong.filter((p) => p.x >= 0 && p.y >= 0 && p.x <= max + 2 && p.y <= max + 2 && pt(p) !== pt(answer)).map(pt), explanation, visual, tag);
}

const VOCAB: [string, string, string[]][] = [
  ["¿Cómo se llama la recta numérica horizontal del plano?", "Eje x", ["Eje y", "Origen", "Par ordenado"]],
  ["¿Cómo se llama la recta numérica vertical del plano?", "Eje y", ["Eje x", "Origen", "Cuadrante"]],
  ["¿Cómo se llama el punto (0, 0), donde se cruzan los ejes?", "Origen", ["Eje x", "Vértice", "Coordenada"]],
  ["¿Cómo se llaman los dos números que ubican un punto, como (3, 5)?", "Par ordenado", ["Origen", "Eje y", "Cuadrícula"]],
];

// 5.° LL.1: describir el plano de coordenadas.
export function describePlane(r: Rng): Question {
  const p = { x: r.int(1, 8), y: r.int(0, 8) };
  if (p.x === p.y) p.y = (p.y + 3) % 9;
  const form = r.int(0, 4);
  if (form === 0) {
    const [prompt, answer, wrong] = r.pick(VOCAB);
    return choiceQ(r, prompt, answer, wrong, `Se llama ${answer.toLowerCase()}.`, undefined, "vocabulario");
  }
  if (form === 1) return numQ(p.x, `En el par ordenado ${pt(p)}, ¿cuál es la coordenada x?`, undefined, `El primer número es la coordenada x: ${p.x}.`, "coordenada-x");
  if (form === 2) return numQ(p.y, `En el par ordenado ${pt(p)}, ¿cuál es la coordenada y?`, undefined, `El segundo número es la coordenada y: ${p.y}.`, "coordenada-y");
  if (form === 3) return fixedQ(`Para ubicar el punto ${pt(p)} desde el origen, ¿qué se hace primero?`, [`Avanzar ${p.x} hacia la derecha`, `Subir ${p.x} hacia arriba`, `Avanzar ${p.y} hacia la derecha`], `Avanzar ${p.x} hacia la derecha`, `Primero la coordenada x (${p.x} a la derecha) y luego la coordenada y (${p.y} hacia arriba).`, undefined, "orden");
  const onAxis = r.chance(0.5) ? { x: r.int(1, 8), y: 0 } : { x: 0, y: r.int(1, 8) };
  return fixedQ(`¿Dónde está el punto ${pt(onAxis)}?`, ["Sobre el eje x", "Sobre el eje y", "En el origen"], onAxis.y === 0 ? "Sobre el eje x" : "Sobre el eje y", onAxis.y === 0 ? "Su coordenada y es 0: no sube, queda sobre el eje x." : "Su coordenada x es 0: no avanza, queda sobre el eje y.", undefined, "ejes");
}

// Puntos con letras, sin posiciones invertidas entre sí.
function lettered(r: Rng, count: number, max = 8) {
  const used = new Set<string>();
  const out: (P & { emoji: string })[] = [];
  const letters = r.shuffle(["A", "B", "C", "D", "E", "F"]).slice(0, count).sort();
  for (const emoji of letters) {
    for (;;) {
      const x = r.int(0, max);
      const y = r.int(0, max);
      if (x === y || used.has(`${x},${y}`) || used.has(`${y},${x}`)) continue;
      used.add(`${x},${y}`);
      out.push({ x, y, emoji });
      break;
    }
  }
  return out;
}

// 5.° LL.3: ubicar puntos en el plano de coordenadas.
export function graphPoints(r: Rng): Question {
  const points = lettered(r, 4);
  const t = r.pick(points);
  if (r.chance(0.5)) return pointChoice(r, `¿Cuáles son las coordenadas del punto ${t.emoji}?`, t, `Desde el origen: ${t.x} a la derecha y ${t.y} hacia arriba: ${pt(t)}.`, plane(points), "leer");
  return { kind: "choice", prompt: `¿Qué punto está en ${pt(t)}?`, visual: plane(points), options: points.map((p) => p.emoji), answer: t.emoji, explanation: `${t.x} a la derecha y ${t.y} hacia arriba: es el punto ${t.emoji}.`, tag: "ubicar" };
}

// 5.° LL.4: graficar triángulos y cuadriláteros.
export function graphShapes(r: Rng): Question {
  const x = r.int(1, 3);
  const y = r.int(1, 3);
  const w = r.int(2, 4);
  const h = r.int(2, 4);
  const rect: P[] = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  if (r.chance(0.5)) {
    const missing = r.int(0, 3);
    const shown = rect.filter((_, i) => i !== missing).map((p, i) => ({ ...p, emoji: "ABC"[i] }));
    return pointChoice(r, `A, B y C son tres vértices de un ${w === h ? "cuadrado" : "rectángulo"}. ¿Dónde va el cuarto vértice?`, rect[missing], `El cuarto vértice completa los lados paralelos a los ejes: ${pt(rect[missing])}.`, plane(shown), "cuarto-vertice");
  }
  const shapes: [string, P[]][] = [
    [w === h ? "Cuadrado" : "Rectángulo", rect],
    ["Triángulo", [rect[0], rect[1], { x: x + 1, y: y + h }]],
    ["Trapecio", [{ x, y }, { x: x + w + 1, y }, { x: x + w, y: y + h }, { x: x + 1, y: y + h }]],
  ];
  const [name, ps] = r.pick(shapes);
  return fixedQ(`Se unen en orden los puntos ${ps.map(pt).join(", ")} y se cierra la figura. ¿Qué figura se forma?`, ["Triángulo", "Cuadrado", "Rectángulo", "Trapecio"], name, `La figura tiene ${ps.length} lados: es un ${name.toLowerCase()}.`, plane(dots(ps), 8, "closed"), name.toLowerCase());
}

// Puntos de una regla que caben en el plano.
function rulePoints(r: Rng, max: number): { rule: Rule2; ps: P[] } {
  for (;;) {
    const rule = rule2(r, 3, 4);
    const ps = [0, 1, 2, 3, 4].map((x) => ({ x, y: ruleY(rule, x) })).filter((p) => p.y <= max);
    if (ps.length >= 3) return { rule, ps: ps.slice(0, 4) };
  }
}
const xyTable = (ps: P[], hide?: number, title?: string) => table(["x", "y"], ps.map((p, i) => [String(p.x), i === hide ? "?" : String(p.y)]), title);

// 5.° LL.5 / MM.9: graficar los puntos de una tabla.
export function pointsFromTable(r: Rng): Question {
  const { ps } = rulePoints(r, 10);
  const i = r.int(0, ps.length - 1);
  return pointChoice(r, `Vas a graficar los puntos de la tabla. ¿Qué par ordenado corresponde a la fila de x = ${ps[i].x}?`, ps[i], `En esa fila x = ${ps[i].x} e y = ${ps[i].y}: el punto es ${pt(ps[i])}.`, xyTable(ps), undefined, 10);
}

// 5.° LL.6 / MM.8: usar una regla para completar una tabla y un gráfico.
export function ruleTableGraph(r: Rng): Question {
  const { rule, ps } = rulePoints(r, 10);
  const i = r.int(1, ps.length - 1);
  if (r.chance(0.5)) return numQ(ps[i].y, "Usa la regla para completar la tabla.", xyTable(ps, i, ruleEq(rule)), `${ruleEq(rule).replace("x", String(ps[i].x))} = ${ps[i].y}.`, "tabla");
  return pointChoice(r, `Regla: ${ruleEq(rule)}. ¿Qué punto se grafica cuando x = ${ps[i].x}?`, ps[i], `${ruleEq(rule).replace("x", String(ps[i].x))} = ${ps[i].y}: el punto es ${pt(ps[i])}.`, plane(dots(ps.filter((_, k) => k !== i)), 10), "grafico", 10);
}

// 5.° LL.7 / MM.7: analizar relaciones graficadas (leer el gráfico).
export function analyzeGraph(r: Rng, asTable = false): Question {
  const { rule, ps } = rulePoints(r, 10);
  const visual = plane(dots(ps), 10, "open");
  const i = r.int(0, ps.length - 1);
  if (asTable) return numQ(ps[i].y, `Con los puntos del gráfico se arma una tabla. ¿Qué valor de y va con x = ${ps[i].x}?`, visual, `El punto que está sobre x = ${ps[i].x} tiene y = ${ps[i].y}.`, "tabla-desde-grafico");
  const form = r.int(0, 2);
  if (form === 0) return numQ(ps[i].y, `Según el gráfico, ¿cuánto vale y cuando x = ${ps[i].x}?`, visual, `El punto es ${pt(ps[i])}: y = ${ps[i].y}.`, "leer");
  if (form === 1) return numQ(rule.m, "Según el gráfico, cada vez que x aumenta 1, ¿cuánto aumenta y?", visual, `De ${pt(ps[0])} a ${pt(ps[1])}, y aumenta ${rule.m}.`, "cambio");
  const next = ps[ps.length - 1].x + 1;
  return numQ(ruleY(rule, next), `Si el patrón del gráfico continúa, ¿cuánto valdrá y cuando x = ${next}?`, visual, `y aumenta ${rule.m} cada vez: ${ps[ps.length - 1].y} + ${rule.m} = ${ruleY(rule, next)}.`, "predecir");
}

const PLACES: [string, string][] = [["🏫", "el colegio"], ["🏥", "el hospital"], ["🏪", "la tienda"], ["⛪", "la iglesia"], ["🏠", "la casa"], ["🌳", "el parque"], ["📚", "la biblioteca"], ["⚽", "la cancha"]];

// 5.° LL.8: planos de coordenadas como mapas.
export function coordinateMap(r: Rng): Question {
  const chosen = r.shuffle(PLACES).slice(0, 4);
  const row = r.int(1, 7);
  const xs = distinct(r, 2, 0, 8);
  const others = lettered(r, 2).map((p) => ({ x: p.x, y: p.y === row ? (row + 2) % 9 : p.y }));
  const points = [{ x: xs[0], y: row, emoji: chosen[0][0] }, { x: xs[1], y: row, emoji: chosen[1][0] }, { ...others[0], emoji: chosen[2][0] }, { ...others[1], emoji: chosen[3][0] }];
  if (new Set(points.map((p) => `${p.x},${p.y}`)).size < 4) return coordinateMap(r);
  const visual = plane(points);
  const form = r.int(0, 2);
  const t = r.int(0, 3);
  if (form === 0) return pointChoice(r, `En el mapa, ¿en qué coordenadas está ${chosen[t][1]} (${chosen[t][0]})?`, points[t], `${points[t].x} a la derecha y ${points[t].y} hacia arriba: ${pt(points[t])}.`, visual, "ubicar");
  if (form === 1) return { kind: "choice", prompt: `En el mapa, ¿qué lugar está en ${pt(points[t])}?`, visual, options: chosen.map(([e, n]) => `${e} ${n}`), answer: `${chosen[t][0]} ${chosen[t][1]}`, explanation: `En ${pt(points[t])} está ${chosen[t][1]}.`, tag: "leer" };
  return numQ(Math.abs(xs[0] - xs[1]), `Cada cuadra del mapa mide 1 unidad. ¿Cuántas cuadras hay de ${chosen[0][1]} (${chosen[0][0]}) a ${chosen[1][1]} (${chosen[1][0]})?`, visual, `Están en la misma fila (y = ${row}): |${xs[0]} − ${xs[1]}| = ${Math.abs(xs[0] - xs[1])} cuadras.`, "distancia");
}

// 5.° LL.9: seguir indicaciones en el plano de coordenadas.
export function followDirections(r: Rng): Question {
  const start = { x: r.int(1, 5), y: r.int(1, 5) };
  const dx = r.int(1, 3) * (r.chance(0.7) || start.x < 2 ? 1 : -1);
  const dy = r.int(1, 3) * (r.chance(0.7) || start.y < 2 ? 1 : -1);
  const end = { x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) };
  const [mx, my] = [end.x - start.x, end.y - start.y];
  const move = (n: number, pos: string, neg: string) => `${Math.abs(n)} ${Math.abs(n) === 1 ? "unidad" : "unidades"} hacia ${n > 0 ? pos : neg}`;
  return pointChoice(r, `Empieza en ${pt(start)}. Muévete ${move(mx, "la derecha", "la izquierda")} y luego ${move(my, "arriba", "abajo")}. ¿A qué punto llegas?`, end, `x: ${start.x} ${mx > 0 ? "+" : "−"} ${Math.abs(mx)} = ${end.x}; y: ${start.y} ${my > 0 ? "+" : "−"} ${Math.abs(my)} = ${end.y}. Llegas a ${pt(end)}.`, plane([{ ...start, emoji: "A" }]), mx > 0 && my > 0 ? "sumar" : "restar");
}

// ---------------------------------------------------------------------------
// Diagramas de dispersión

type Trend = "aumenta" | "disminuye" | "ninguna";
const SCATTER: [string, string, string, Trend][] = [
  ["horas de estudio", "puntos en el examen", "Estudio y puntos", "aumenta"],
  ["edad de la planta (semanas)", "altura (dm)", "Edad y altura", "aumenta"],
  ["horas de juego", "batería que queda (decenas de %)", "Juego y batería", "disminuye"],
  ["días transcurridos", "comida que queda en la bolsa (kg)", "Días y comida", "disminuye"],
  ["número de zapato", "libros leídos", "Zapato y libros", "ninguna"],
  ["día del mes", "goles del partido", "Día y goles", "ninguna"],
];
function scatter(r: Rng, trend: Trend): P[] {
  for (;;) {
    const xs = distinct(r, 6, 1, 8).sort((a, b) => a - b);
    const ps = xs.map((x, i) => ({ x, y: trend === "aumenta" ? Math.min(9, Math.max(1, x + r.int(-1, 1))) : trend === "disminuye" ? Math.min(9, Math.max(1, 9 - x + r.int(-1, 1))) : [5, 2, 8, 3, 7, 4][(i + xs[0]) % 6] }));
    if (new Set(ps.map((p) => `${p.x},${p.y}`)).size === ps.length) return ps;
  }
}

// 5.° NN.16: crear diagramas de dispersión (¿qué punto corresponde a cada fila?).
export function createScatter(r: Rng): Question {
  const [xName, yName, title, trend] = r.pick(SCATTER);
  const ps = scatter(r, trend).slice(0, 4);
  const i = r.int(0, 3);
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  return pointChoice(r, `Vas a hacer un diagrama de dispersión con la tabla. ¿Qué punto corresponde a la fila ${i + 1}?`, ps[i], `Primero va «${xName}» (${ps[i].x}) y luego «${yName}» (${ps[i].y}): ${pt(ps[i])}.`, table([cap(xName), cap(yName)], ps.map((p) => [String(p.x), String(p.y)]), title), undefined, 10);
}

// 5.° NN.17: interpretar diagramas de dispersión.
export function interpretScatter(r: Rng): Question {
  const [xName, yName, , trend] = r.pick(SCATTER);
  const ps = scatter(r, trend);
  const visual = plane(dots(ps), 9);
  const head = `Eje x: ${xName}. Eje y: ${yName}.`;
  const form = r.int(0, 3);
  const t = r.pick(ps);
  if (form === 0) return numQ(t.y, `${head} ¿Cuánto vale y en el punto que tiene x = ${t.x}?`, visual, `El punto es ${pt(t)}.`, "leer");
  if (form === 1) return numQ(ps.length, `${head} ¿Cuántos datos (puntos) tiene el diagrama?`, visual, `Hay ${ps.length} puntos.`, "contar");
  const cut = r.int(3, 6);
  if (form === 2) return numQ(ps.filter((p) => p.y > cut).length, `${head} ¿Cuántos puntos tienen y mayor que ${cut}?`, visual, `Los puntos por encima de ${cut}: ${ps.filter((p) => p.y > cut).map(pt).join(", ") || "ninguno"}.`, "mayor-que");
  const top = Math.max(...ps.map((p) => p.y));
  return numQ(top, `${head} ¿Cuál es el mayor valor de y que aparece?`, visual, `El punto más alto tiene y = ${top}.`, "maximo");
}

const TREND_OPTIONS = ["Cuando x aumenta, y también aumenta", "Cuando x aumenta, y disminuye", "No se ve ninguna relación"];

// 5.° NN.18: predicciones y tendencias en diagramas de dispersión.
export function scatterTrends(r: Rng): Question {
  const [xName, yName, , trend] = r.pick(SCATTER);
  const ps = scatter(r, trend);
  const visual = plane(dots(ps), 9);
  const head = `Eje x: ${xName}. Eje y: ${yName}.`;
  if (trend === "ninguna" || r.chance(0.5)) return fixedQ(`${head} ¿Qué tendencia muestra el diagrama?`, TREND_OPTIONS, TREND_OPTIONS[trend === "aumenta" ? 0 : trend === "disminuye" ? 1 : 2], trend === "ninguna" ? "Los puntos suben y bajan sin orden." : `Los puntos van hacia ${trend === "aumenta" ? "arriba" : "abajo"} cuando se avanza hacia la derecha.`, visual, trend);
  const options = trend === "aumenta" ? ["Cerca de 1", "Cerca de 5", "Cerca de 9"] : ["Cerca de 9", "Cerca de 5", "Cerca de 1"];
  return fixedQ(`${head} Si la tendencia continúa, ¿cuánto valdría y cuando x = 9?`, ["Cerca de 1", "Cerca de 5", "Cerca de 9"], options[2], `La tendencia es que y ${trend} cuando x aumenta.`, visual, `predecir-${trend}`);
}

// ---------------------------------------------------------------------------
// Plano con los cuatro cuadrantes (6.° en adelante)

const sgn = (n: number) => (n < 0 ? `−${-n}` : String(n));
const pt4 = (p: P) => `(${sgn(p.x)}, ${sgn(p.y)})`;
const plane4 = (points: (P & { emoji: string })[], connect?: "open" | "closed"): Visual => ({ kind: "coordPlane", min: -6, max: 6, points, connect });
const nz = (r: Rng, max = 6) => r.int(1, max) * r.pick([-1, 1]);

function pointChoice4(r: Rng, prompt: string, answer: P, explanation: string, visual?: Visual, tag?: string): Question {
  const wrong: P[] = [{ x: answer.y, y: answer.x }, { x: -answer.x, y: answer.y }, { x: answer.x, y: -answer.y }, { x: -answer.x, y: -answer.y }, { x: answer.x + 1, y: answer.y }, { x: answer.x, y: answer.y - 1 }];
  return choiceQ(r, prompt, pt4(answer), wrong.filter((p) => pt4(p) !== pt4(answer)).map(pt4), explanation, visual, tag);
}

// 6.° R.3: ubicar puntos en el plano de coordenadas (cuatro cuadrantes).
export function graphPoints4(r: Rng): Question {
  const used = new Set<string>();
  const points = ["A", "B", "C", "D"].map((emoji) => {
    for (;;) {
      const p = { x: nz(r), y: nz(r) };
      if (Math.abs(p.x) === Math.abs(p.y) || used.has(`${Math.abs(p.x)},${Math.abs(p.y)}`) || used.has(`${Math.abs(p.y)},${Math.abs(p.x)}`)) continue;
      used.add(`${Math.abs(p.x)},${Math.abs(p.y)}`);
      return { ...p, emoji };
    }
  });
  const t = r.pick(points);
  if (r.chance(0.5)) return pointChoice4(r, `¿Cuáles son las coordenadas del punto ${t.emoji}?`, t, `Desde el origen: ${Math.abs(t.x)} hacia la ${t.x > 0 ? "derecha" : "izquierda"} y ${Math.abs(t.y)} hacia ${t.y > 0 ? "arriba" : "abajo"}: ${pt4(t)}.`, plane4(points), "leer");
  return { kind: "choice", prompt: `¿Qué punto está en ${pt4(t)}?`, visual: plane4(points), options: points.map((p) => p.emoji), answer: t.emoji, explanation: `${Math.abs(t.x)} hacia la ${t.x > 0 ? "derecha" : "izquierda"} y ${Math.abs(t.y)} hacia ${t.y > 0 ? "arriba" : "abajo"}: es ${t.emoji}.`, tag: "ubicar" };
}

const QUADRANTS = ["Cuadrante I", "Cuadrante II", "Cuadrante III", "Cuadrante IV"];
const quadrantOf = (p: P) => (p.x > 0 && p.y > 0 ? 0 : p.x < 0 && p.y > 0 ? 1 : p.x < 0 && p.y < 0 ? 2 : 3);

// 6.° R.4: cuadrantes.
export function quadrants(r: Rng): Question {
  if (r.chance(0.25)) {
    const onX = r.chance(0.5);
    const p = onX ? { x: nz(r), y: 0 } : { x: 0, y: nz(r) };
    return fixedQ(`¿Dónde está el punto ${pt4(p)}?`, ["Sobre el eje x", "Sobre el eje y", "En el cuadrante I", "En el cuadrante III"], onX ? "Sobre el eje x" : "Sobre el eje y", onX ? "Su coordenada y es 0: está sobre el eje x, no en un cuadrante." : "Su coordenada x es 0: está sobre el eje y, no en un cuadrante.", undefined, "ejes");
  }
  const p = { x: nz(r), y: nz(r) };
  const q = quadrantOf(p);
  return fixedQ(`¿En qué cuadrante está el punto ${pt4(p)}?`, QUADRANTS, QUADRANTS[q], `x es ${p.x > 0 ? "positivo" : "negativo"} e y es ${p.y > 0 ? "positivo" : "negativo"}: ${QUADRANTS[q].replace("Cuadrante", "cuadrante")}. (I: +,+ · II: −,+ · III: −,− · IV: +,−)`, r.chance(0.5) ? plane4([{ ...p, emoji: "•" }]) : undefined, QUADRANTS[q]);
}

// 6.° R.5: reflejar un punto respecto de un eje.
export function reflectPoint(r: Rng): Question {
  const p = { x: nz(r), y: nz(r) };
  const overX = r.chance(0.5);
  const image = overX ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y };
  return pointChoice4(r, `El punto A está en ${pt4(p)}. ¿Dónde queda su reflejo respecto del eje ${overX ? "x" : "y"}?`, image, `Al reflejar sobre el eje ${overX ? "x cambia el signo de y" : "y cambia el signo de x"}: ${pt4(image)}.`, plane4([{ ...p, emoji: "A" }]), overX ? "eje-x" : "eje-y");
}

// 6.° R.7: distancia entre dos puntos (en la misma horizontal o vertical).
export function distancePoints(r: Rng): Question {
  const horizontal = r.chance(0.5);
  const fixed = r.int(-6, 6);
  const [a, b] = distinct(r, 2, -6, 6);
  const A = horizontal ? { x: a, y: fixed } : { x: fixed, y: a };
  const B = horizontal ? { x: b, y: fixed } : { x: fixed, y: b };
  return numQ(Math.abs(a - b), `¿Cuántas unidades hay entre los puntos ${pt4(A)} y ${pt4(B)}?`, plane4([{ ...A, emoji: "A" }, { ...B, emoji: "B" }]), `Tienen la misma coordenada ${horizontal ? "y" : "x"}; se restan las otras: |${sgn(a)} − ${b < 0 ? `(${sgn(b)})` : sgn(b)}| = ${Math.abs(a - b)}.`, horizontal ? "horizontal" : "vertical");
}

// 6.° R.9: área y perímetro de cuadrados y rectángulos en el plano.
export function rectangleOnPlane(r: Rng): Question {
  const x = r.int(-6, 2);
  const y = r.int(-6, 2);
  const w = r.int(2, 6 - x);
  const h = r.int(2, 6 - y);
  const corners: P[] = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  const visual = plane4(corners.map((p, i) => ({ ...p, emoji: "ABCD"[i] })), "closed");
  const area = r.chance(0.5);
  return numQ(area ? w * h : 2 * (w + h), `Los puntos A, B, C y D forman un rectángulo. ¿Cuál es su ${area ? "área, en unidades cuadradas" : "perímetro, en unidades"}?`, visual, `El largo es ${w} y el ancho ${h}: ${area ? `${w} × ${h} = ${w * h}` : `2 × (${w} + ${h}) = ${2 * (w + h)}`}.`, area ? "area" : "perimetro");
}
