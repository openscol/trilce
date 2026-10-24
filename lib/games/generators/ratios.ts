import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, choiceQ, d3, decQ, distinct, fixedQ, fmt, gcd, numQ, table, yesNo } from "./kit";

// Razones, tasas y relaciones proporcionales (6.° en adelante).

const FRUIT: [string, string][] = [["🍎", "manzanas"], ["🍊", "naranjas"], ["🍌", "plátanos"], ["🍓", "fresas"], ["🍇", "uvas"], ["🍐", "peras"]];
type Form = "colon" | "fraction" | "a";
const write = (a: number, b: number, form: Form) => (form === "colon" ? `${a}:${b}` : form === "fraction" ? `${a}/${b}` : `${a} a ${b}`);

// Escribir una razón a partir de un dibujo.
export function writeRatio(r: Rng, forms: Form[], partToWhole = false): Question {
  const [x, y] = r.shuffle(FRUIT).slice(0, 2);
  const [a, b] = distinct(r, 2, 2, 9);
  const form = r.pick(forms);
  const whole = partToWhole && r.chance(0.5);
  const answer = whole ? write(a, a + b, form) : write(a, b, form);
  const wrong = [write(b, a, form), whole ? write(a, b, form) : write(a, a + b, form), write(b, a + b, form), write(a + b, a, form)].filter((w) => w !== answer);
  const how = form === "colon" ? "con dos puntos" : form === "fraction" ? "como fracción" : "con la palabra «a»";
  return choiceQ(r, whole ? `Escribe ${how} la razón de ${x[1]} al total de frutas.` : `Escribe ${how} la razón de ${x[1]} a ${y[1]}.`, answer, wrong, whole ? `Hay ${a} ${x[1]} y ${a + b} frutas en total: ${answer}. El orden importa.` : `Hay ${a} ${x[1]} y ${b} ${y[1]}: ${answer}. El orden importa.`, { kind: "bag", items: [{ emoji: x[0], count: a }, { emoji: y[0], count: b }] }, whole ? "parte-todo" : "parte-parte");
}

// ¿qué modelo representa la razón? (todas las opciones tienen la misma cantidad de frutas).
export function ratioModel(r: Rng): Question {
  const [x, y] = r.shuffle(FRUIT).slice(0, 2);
  const [a, b] = distinct(r, 2, 1, 7);
  const draw = (m: number, n: number) => `${x[0].repeat(m)} ${y[0].repeat(n)}`;
  const total = a + b;
  const options = [draw(a, b), draw(b, a)];
  for (const m of r.shuffle(Array.from({ length: total - 1 }, (_, i) => i + 1))) {
    if (options.length < 4 && m !== a && m !== b) options.push(draw(m, total - m));
  }
  return { kind: "choice", prompt: `¿Qué modelo muestra una razón de ${a} a ${b} entre ${x[1]} y ${y[1]}?`, options: r.shuffle(options), answer: draw(a, b), explanation: `Debe haber ${a} ${x[0]} y ${b} ${y[0]}, en ese orden: ${a}:${b}.` };
}

// Escribir una razón en problemas.
export function ratioProblem(r: Rng): Question {
  const [a, b] = distinct(r, 2, 2, 20);
  const form = r.pick<Form>(["colon", "fraction", "a"]);
  const cases: [string, number, number][] = [
    [`En un salón hay ${a} niñas y ${b} niños. ¿Cuál es la razón de niñas a niños?`, a, b],
    [`En un salón hay ${a} niñas y ${b} niños. ¿Cuál es la razón de niños al total de alumnos?`, b, a + b],
    [`Una receta lleva ${a} tazas de harina y ${b} de azúcar. ¿Cuál es la razón de azúcar a harina?`, b, a],
    [`Un equipo ganó ${a} partidos y perdió ${b}. ¿Cuál es la razón de partidos ganados a partidos jugados?`, a, a + b],
    [`En el corral hay ${a} gallinas y ${b} patos. ¿Cuál es la razón de patos a gallinas?`, b, a],
  ];
  const [text, x, y] = r.pick(cases);
  const answer = write(x, y, form);
  return choiceQ(r, text, answer, [write(y, x, form), write(a, b, form), write(b, a, form), write(a, a + b, form), write(b, a + b, form), write(a + b, a, form)].filter((w) => w !== answer), `Se escribe en el orden en que se nombra: ${answer}.`);
}

// Razón irreducible y un factor.
function ratioPair(r: Rng, maxK = 9): [number, number, number] {
  for (;;) {
    const a = r.int(1, 9);
    const b = r.int(1, 9);
    if (a === b || gcd(a, b) !== 1) continue;
    return [a, b, r.int(2, maxK)];
  }
}

// Razones equivalentes y proporciones (sí o no).
export function equivalentRatios(r: Rng, proportion = false): Question {
  const [a, b, k] = ratioPair(r);
  const yes = r.chance(0.5);
  const c = a * k;
  const d = yes ? b * k : b * k + r.pick([-2, -1, 1, 2]);
  if (d <= 0) return equivalentRatios(r, proportion);
  const [l, rt] = proportion ? [`${a}/${b}`, `${c}/${d}`] : [`${a}:${b}`, `${c}:${d}`];
  return yesNo(proportion ? `¿Las razones ${l} y ${rt} forman una proporción?` : `¿Las razones ${l} y ${rt} son equivalentes?`, yes, `Productos cruzados: ${a} × ${d} = ${a * d} y ${b} × ${c} = ${b * c}: ${yes ? "son iguales" : "no son iguales"}.`);
}

// Escribir una razón equivalente / resolver la proporción.
export function solveProportion(r: Rng, asFraction = false): Question {
  const [a, b, k] = ratioPair(r, 12);
  const sep = asFraction ? "/" : ":";
  const at = r.int(0, 3);
  const cells = [a, b, a * k, b * k];
  const shown = cells.map((x, i) => (i === at ? (asFraction ? "x" : "?") : String(x)));
  return numQ(cells[at], asFraction ? "Resuelve la proporción. ¿Cuánto vale x?" : "¿Qué número falta para que las razones sean equivalentes?", `${shown[0]}${sep}${shown[1]} = ${shown[2]}${sep}${shown[3]}`, `Los dos términos se multiplican (o dividen) por ${k}: ${a}${sep}${b} = ${a * k}${sep}${b * k}.`);
}

const TABLE_THEMES: [string, string, string][] = [["Tazas de arroz", "Tazas de agua", "Para cocinar arroz"], ["Kilos", "Soles", "Precio de la papa"], ["Horas", "Kilómetros", "Recorrido en bicicleta"], ["Cajas", "Lápices", "Lápices por caja"], ["Jarras", "Limones", "Limonada"]];

// Tablas de razones.
export function ratioTable(r: Rng): Question {
  const [a, b] = ratioPair(r);
  const [h1, h2, title] = r.pick(TABLE_THEMES);
  const ks = distinct(r, 4, 1, 9).sort((x, y) => x - y);
  const hidden = r.int(1, 3);
  const top = r.chance(0.5);
  return numQ(top ? ks[hidden] * a : ks[hidden] * b, "Completa la tabla de razones equivalentes.", table([h1, h2], ks.map((k, i) => [i === hidden && top ? "?" : String(k * a), i === hidden && !top ? "?" : String(k * b)]), title), `La razón es ${a}:${b}; en esa fila se multiplica por ${ks[hidden]}: ${ks[hidden] * a} y ${ks[hidden] * b}.`);
}

// Problemas de razones equivalentes.
export function equivalentRatioProblem(r: Rng): Question {
  const [a, b, k] = ratioPair(r, 12);
  const name = r.pick(NAMES);
  const cases: [string, number, string][] = [
    [`Para una limonada se usan ${a} limones por cada ${b} vasos de agua. ¿Cuántos limones hacen falta para ${b * k} vasos de agua?`, a * k, `${b} × ${k} = ${b * k}, entonces ${a} × ${k} = ${a * k}`],
    [`En un colegio hay ${a} profesores por cada ${b * 5} alumnos. Si hay ${b * 5 * k} alumnos, ¿cuántos profesores hay?`, a * k, `${b * 5} × ${k} = ${b * 5 * k}, entonces ${a} × ${k} = ${a * k}`],
    [`${name} mezcla ${a} partes de pintura azul con ${b} de blanca. Si usa ${a * k} litros de azul, ¿cuántos litros de blanca necesita?`, b * k, `${a} × ${k} = ${a * k}, entonces ${b} × ${k} = ${b * k}`],
    [`Un mapa indica ${a} cm por cada ${b} km. ¿Cuántos kilómetros son ${a * k} cm?`, b * k, `${a} × ${k} = ${a * k}, entonces ${b} × ${k} = ${b * k}`],
  ];
  const [text, answer, why] = r.pick(cases);
  return numQ(answer, text, undefined, `${why}.`);
}

// Tasas unitarias.
export function unitRates(r: Rng, word = true): Question {
  const k = r.int(2, 12);
  const unit = r.int(2, 60);
  const cases: [string, string][] = [
    [`Un auto recorre ${fmt(unit * k)} km en ${k} horas, siempre a la misma velocidad. ¿Cuántos kilómetros recorre por hora?`, "km por hora"],
    [`${r.pick(NAMES)} escribe ${fmt(unit * k)} palabras en ${k} minutos. ¿Cuántas palabras escribe por minuto?`, "palabras por minuto"],
    [`Una máquina llena ${fmt(unit * k)} botellas en ${k} minutos. ¿Cuántas botellas llena por minuto?`, "botellas por minuto"],
    [`${k} cuadernos iguales cuestan ${fmt(unit * k)} soles. ¿Cuántos soles cuesta cada cuaderno?`, "soles por cuaderno"],
    [`Una llave da ${fmt(unit * k)} litros de agua en ${k} minutos. ¿Cuántos litros da por minuto?`, "litros por minuto"],
  ];
  const [text, label] = r.pick(cases);
  if (!word) return numQ(unit, "Halla la tasa unitaria (la cantidad por cada 1).", `${fmt(unit * k)} ${label.split(" por ")[0]} en ${k} ${label.split(" por ")[1]}s`.replace("cuadernos", "cuadernos").replace("horas", "horas"), `${fmt(unit * k)} ÷ ${k} = ${unit} ${label}.`);
  return numQ(unit, text, undefined, `${fmt(unit * k)} ÷ ${k} = ${unit} ${label}.`);
}

// Calcular velocidad, distancia o tiempo.
export function speedDistanceTime(r: Rng): Question {
  const v = r.int(3, 90);
  const t = r.int(2, 9);
  const d = v * t;
  const who = r.pick(["Un bus", "Un tren", "Una ciclista", "Un camión", "Una lancha"]);
  const form = r.int(0, 2);
  if (form === 0) return numQ(d, `${who} avanza a ${v} km por hora. ¿Cuántos kilómetros recorre en ${t} horas?`, undefined, `Distancia = velocidad × tiempo = ${v} × ${t} = ${fmt(d)} km.`, "distancia");
  if (form === 1) return numQ(v, `${who} recorre ${fmt(d)} km en ${t} horas. ¿Cuál es su velocidad, en km por hora?`, undefined, `Velocidad = distancia ÷ tiempo = ${fmt(d)} ÷ ${t} = ${v} km por hora.`, "velocidad");
  return numQ(t, `${who} avanza a ${v} km por hora. ¿Cuántas horas tarda en recorrer ${fmt(d)} km?`, undefined, `Tiempo = distancia ÷ velocidad = ${fmt(d)} ÷ ${v} = ${t} horas.`, "tiempo");
}

// Usar diagramas de cintas para resolver problemas de razones.
export function tapeDiagram(r: Rng): Question {
  const [a, b] = ratioPair(r);
  const each = r.int(2, 12);
  const [x, y] = r.pick([["Niñas", "Niños"], ["Rojas", "Azules"], ["Perros", "Gatos"], ["Lápices", "Plumones"]]);
  const visual: Visual = { kind: "strip", bars: [{ label: x, parts: [...Array.from({ length: a }, () => ({ text: "?", w: 1 })), ...Array.from({ length: Math.max(0, b - a) }, () => ({ text: "", w: 1 }))] }, { label: y, parts: [...Array.from({ length: b }, () => ({ text: "?", w: 1 })), ...Array.from({ length: Math.max(0, a - b) }, () => ({ text: "", w: 1 }))] }] };
  const form = r.int(0, 2);
  if (form === 0) return numQ(a * each, `La razón de ${x.toLowerCase()} a ${y.toLowerCase()} es ${a}:${b} y en total hay ${(a + b) * each}. Todas las casillas valen lo mismo. ¿Cuántos son «${x.toLowerCase()}»?`, visual, `Hay ${a + b} casillas: ${(a + b) * each} ÷ ${a + b} = ${each} cada una; ${a} × ${each} = ${a * each}.`, "total-dado");
  if (form === 1) return numQ(b * each, `La razón de ${x.toLowerCase()} a ${y.toLowerCase()} es ${a}:${b}. Si «${x.toLowerCase()}» son ${a * each}, ¿cuántos son «${y.toLowerCase()}»?`, visual, `${a * each} ÷ ${a} = ${each} por casilla; ${b} × ${each} = ${b * each}.`, "parte-dada");
  return numQ((a + b) * each, `La razón de ${x.toLowerCase()} a ${y.toLowerCase()} es ${a}:${b}. Si «${y.toLowerCase()}» son ${b * each}, ¿cuántos hay en total?`, visual, `${b * each} ÷ ${b} = ${each} por casilla; ${a + b} × ${each} = ${(a + b) * each}.`, "hallar-total");
}

// Comparar razones y tasas en problemas.
export function compareRates(r: Rng, rates: boolean): Question {
  for (;;) {
    const [ka, kb] = distinct(r, 2, 2, 9);
    const ua = rates ? r.int(2, 30) : r.int(2, 7);
    const ub = ua + r.pick([-3, -2, -1, 1, 2, 3]);
    if (kb === undefined || ub <= 0) continue;
    const [title, unit, question, higherWins] = rates
      ? r.pick<[string, string, string, boolean]>([["corre", "metros", "¿Quién corre más rápido?", true], ["cobra", "soles", "¿Dónde cuesta menos cada hora?", false], ["lee", "páginas", "¿Quién lee más páginas por hora?", true]])
      : r.pick<[string, string, string, boolean]>([["usa", "cucharadas de cacao", "¿Qué mezcla tiene más sabor a chocolate?", true], ["usa", "gotas de colorante", "¿Qué mezcla queda de color más fuerte?", true]]);
    const per = rates ? (title === "corre" ? "segundos" : "horas") : unit.includes("cacao") ? "vasos de leche" : "vasos de agua";
    const a = `A ${title} ${ua * ka} ${unit} en ${ka} ${per}`.replace(/en (\d+) vasos/, "por cada $1 vasos");
    const b = `B ${title} ${ub * kb} ${unit} en ${kb} ${per}`.replace(/en (\d+) vasos/, "por cada $1 vasos");
    const answer = (ua > ub) === higherWins ? "A" : "B";
    return fixedQ(question, ["A", "B"], answer, `Por cada 1: A = ${ua * ka} ÷ ${ka} = ${ua}; B = ${ub * kb} ÷ ${kb} = ${ub}.`, `${a}\n${b}`, rates ? "tasas" : "razones");
  }
}

// Dibujos a escala.
export function scaleDrawing(r: Rng): Question {
  const scale = r.pick([2, 5, 10, 20, 50, 100]);
  const cm = r.int(2, 15);
  const [unit, thing] = r.pick([["m", "un plano de una casa"], ["km", "un mapa"], ["m", "el plano de un parque"]]);
  if (r.chance(0.5)) return numQ(cm * scale, `En ${thing}, 1 cm representa ${scale} ${unit}. Si una distancia mide ${cm} cm en el dibujo, ¿cuántos ${unit === "m" ? "metros" : "kilómetros"} son en la realidad?`, undefined, `${cm} × ${scale} = ${fmt(cm * scale)} ${unit}.`, "a-realidad");
  return numQ(cm, `En ${thing}, 1 cm representa ${scale} ${unit}. Una distancia real de ${fmt(cm * scale)} ${unit}, ¿cuántos centímetros mide en el dibujo?`, undefined, `${fmt(cm * scale)} ÷ ${scale} = ${cm} cm.`, "a-dibujo");
}

// Repasos de razones y de tasas unitarias.
export function ratioReview(r: Rng): Question {
  return r.pick([() => writeRatio(r, ["colon", "fraction", "a"], true), () => ratioProblem(r), () => equivalentRatios(r), () => solveProportion(r), () => ratioTable(r), () => equivalentRatioProblem(r), () => tapeDiagram(r)])();
}
export function unitRateReview(r: Rng): Question {
  return r.pick([() => unitRates(r), () => speedDistanceTime(r), () => compareRates(r, true), () => unitPriceDecimal(r)])();
}

// Precios por unidad con decimales (precio por kilo, por litro...).
export function unitPriceDecimal(r: Rng): Question {
  const qty = r.pick([500, 1500, 2500, 250, 750, 2000, 4000]);
  const perUnit = r.int(2, 24) * 1000;
  const total = (perUnit * qty) / 1000;
  const [unit, item] = r.pick([["kg", "arroz"], ["kg", "queso"], ["l", "aceite"], ["m", "tela"], ["kg", "pollo"]]);
  return decQ(r, `${d3(qty)} ${unit} de ${item} cuestan ${d3(total)} soles. ¿Cuántos soles cuesta 1 ${unit}?`, perUnit, `${d3(total)} ÷ ${d3(qty)} = ${d3(perUnit)} soles por ${unit}.`, undefined, undefined, [total, (total * qty) / 1000].filter(Number.isInteger));
}

// ---------------------------------------------------------------------------
// Relaciones proporcionales

type Pt = { x: number; y: number };
function relation(r: Rng, proportional: boolean): { pts: Pt[]; k: number; b: number } {
  const k = r.int(1, 3);
  const b = proportional ? 0 : r.int(1, 3);
  const xs = [1, 2, 3, 4].filter((x) => k * x + b <= 12);
  if (!proportional && r.chance(0.4)) {
    // Sin intercepto, pero que no crece siempre igual.
    const ys = [k, 2 * k + 1, 3 * k + 1, 4 * k + 3];
    return { pts: [1, 2, 3, 4].map((x, i) => ({ x, y: ys[i] })).filter((p) => p.y <= 12), k, b: 0 };
  }
  return { pts: xs.map((x) => ({ x, y: k * x + b })), k, b };
}
const graph = (pts: Pt[]): Visual => ({ kind: "coordPlane", max: 12, points: pts.map((p) => ({ ...p, emoji: "•" })), connect: "open" });
const xy = (pts: Pt[]) => table(["x", "y"], pts.map((p) => [String(p.x), String(p.y)]));

// Identificar relaciones proporcionales en gráficos y tablas.
export function isProportional(r: Rng, show: "graph" | "table" | "both"): Question {
  const yes = r.chance(0.5);
  const rel = relation(r, yes);
  const constant = rel.pts.every((p) => p.y * rel.pts[0].x === rel.pts[0].y * p.x);
  const why = constant ? `Sí: y ÷ x siempre da ${rel.k} (y la recta pasa por el origen).` : `No: y ÷ x no da siempre lo mismo (${rel.pts.slice(0, 3).map((p) => `${p.y} ÷ ${p.x}`).join(", ")}...).`;
  const mode = show === "both" ? r.pick(["graph", "table"] as const) : show;
  return yesNo(mode === "graph" ? "¿El gráfico muestra una relación proporcional?" : show === "both" ? "Si graficas estos puntos, ¿se ve una relación proporcional (una recta que pasa por el origen)?" : "¿La tabla muestra una relación proporcional?", constant, why, mode === "graph" ? graph(rel.pts) : xy(rel.pts), mode);
}

// Interpretar gráficos de relaciones proporcionales.
export function interpretProportional(r: Rng): Question {
  const rel = relation(r, true);
  const visual = graph(rel.pts);
  const [xName, yName, one] = r.pick([["horas", "kilómetros", "hora"], ["kilos", "soles", "kilo"], ["cajas", "lápices", "caja"], ["minutos", "litros", "minuto"]]);
  const head = `Eje x: ${xName}. Eje y: ${yName}.`;
  const form = r.int(0, 2);
  const beyondOne = rel.pts.filter((q) => q.x > 1);
  const p = r.pick(beyondOne.length ? beyondOne : rel.pts);
  if (form === 0) return numQ(rel.k, `${head} ¿Cuál es la constante de proporcionalidad (${yName} por cada ${one})?`, visual, `En cada punto, y ÷ x = ${rel.k}.`, "constante");
  if (form === 1) return numQ(p.y, `${head} ¿Cuántos ${yName} corresponden a ${p.x} ${xName}?`, visual, `El punto es (${p.x}, ${p.y}).`, "leer");
  const x = r.int(6, 20);
  return numQ(rel.k * x, `${head} Si la relación continúa, ¿cuántos ${yName} corresponden a ${x} ${xName}?`, visual, `Constante ${rel.k}: ${rel.k} × ${x} = ${rel.k * x}.`, "predecir");
}
