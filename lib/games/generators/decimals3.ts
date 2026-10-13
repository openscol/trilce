import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, SYMBOLS, choiceQ, d3, decQ, distinct, fixedQ, fmt, fshow, numQ, orderQ, pow10, simp, sym, table, trueFalse, words } from "./kit";

// Decimales de 5.° en adelante, hasta los milésimos. Todo se calcula en
// milésimos (enteros) y se escribe con coma; las respuestas decimales van como
// opción múltiple, con los errores típicos (coma corrida) entre las opciones.

const T = 100; // un décimo, en milésimos
const H = 10; // un centésimo
const ONE = 1000;
const PLACES = ["milésimos", "centésimos", "décimos", "unidades", "decenas"];
const PLACE_ONE = ["milésimo", "centésimo", "décimo", "unidad", "decena"];

// Decimal con `places` cifras decimales (la última no es cero) y parte entera hasta `maxWhole`.
function decimal(r: Rng, places: 1 | 2 | 3, maxWhole = 9): number {
  const unit = 10 ** (3 - places);
  const whole = r.int(0, maxWhole) * ONE;
  for (;;) {
    const frac = r.int(1, 10 ** places - 1);
    if (frac % 10 !== 0) return whole + frac * unit;
  }
}
const anyDecimal = (r: Rng, maxWhole = 9) => decimal(r, r.pick([1, 2, 3]), maxWhole);

// 5.° W.2: modelos de valor posicional para decimales (hasta milésimos).
export function decimalPlaceModel3(r: Rng): Question {
  const [u, d, c, mm] = [r.int(0, 9), r.int(0, 9), r.int(0, 9), r.int(1, 9)];
  const t = u * ONE + d * T + c * H + mm;
  return decQ(r, "¿Qué número decimal muestra la tabla de valor posicional?", t, `${u} unidades, ${d} décimos, ${c} centésimos y ${mm} milésimos: ${d3(t)}.`, table(["Unidades", "Décimos", "Centésimos", "Milésimos"], [[String(u), String(d), String(c), String(mm)]]), undefined, [mm * ONE + c * T + d * H + u, u * ONE + mm * T + c * H + d, u * ONE + d * T + mm * H + c]);
}

function decimalWords(t: number) {
  const w = Math.floor(t / ONE);
  const rest = t % ONE;
  const [n, unit] = rest % T === 0 ? [rest / T, "décimo"] : rest % H === 0 ? [rest / H, "centésimo"] : [rest, "milésimo"];
  const part = `${words(n).replace(/uno$/, "un")} ${unit}${n === 1 ? "" : "s"}`;
  return w ? `${words(w).replace(/uno$/, "un")} ${w === 1 ? "entero" : "enteros"} y ${part}` : part;
}

// 5.° W.3: decimales escritos con palabras (hasta milésimos).
export function decimalInWords3(r: Rng): Question {
  const t = anyDecimal(r, r.chance(0.5) ? 9 : 0);
  const w = Math.floor(t / ONE) * ONE;
  const rest = t % ONE;
  // Misma cantidad leída en otra posición: 0,45 ↔ 0,045 ↔ 0,405.
  const shifted = [w + Math.floor(rest / 10), rest * 10 < ONE ? w + rest * 10 : 0, w + (rest % T) * 10 + Math.floor(rest / T), w + ONE + rest].filter((x) => x > 0 && x !== t && x % ONE !== 0);
  if (r.chance(0.5)) return decQ(r, `¿Qué número decimal es «${decimalWords(t)}»?`, t, `«${decimalWords(t)}» se escribe ${d3(t)}.`, undefined, "a-cifras", shifted);
  const wrong = [...new Set(shifted)].map(decimalWords).filter((x) => x !== decimalWords(t));
  if (wrong.length < 2) return decimalInWords3(r);
  return choiceQ(r, `¿Cómo se lee ${d3(t)}?`, decimalWords(t), wrong, `${d3(t)} se lee «${decimalWords(t)}».`, undefined, "a-palabras");
}

// 5.° W.4: valor de una cifra en un número decimal.
export function decimalDigitValue(r: Rng): Question {
  const ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5); // decenas, unidades, décimos, centésimos, milésimos
  const text = `${ds[0]}${ds[1]},${ds[2]}${ds[3]}${ds[4]}`;
  const at = r.int(0, 4);
  const place = 4 - at;
  if (r.chance(0.5)) return numQ(ds[at], `En ${text}, ¿qué cifra está en el lugar de ${place >= 3 ? "las" : "los"} ${PLACES[place]}?`, text, `En ${text}, ${place >= 3 ? "las" : "los"} ${PLACES[place]} son ${ds[at]}.`, PLACES[place]);
  const label = (p: number) => `${ds[at]} ${ds[at] === 1 ? PLACE_ONE[p] : PLACES[p]}`;
  return choiceQ(r, `En ${text}, ¿qué valor tiene la cifra ${ds[at]}?`, label(place), [0, 1, 2, 3, 4].filter((p) => p !== place).map(label), `El ${ds[at]} está en el lugar de ${place >= 3 ? "las" : "los"} ${PLACES[place]}.`, text, PLACES[place]);
}

// 5.° W.5: relación entre los valores posicionales de los decimales.
export function decimalPlaceRelation(r: Rng): Question {
  const d = r.int(1, 9);
  const low = r.int(0, 2);
  const jump = r.int(1, 2);
  const small = d * 10 ** low;
  const big = small * 10 ** jump;
  const k = 10 ** jump;
  if (r.chance(0.5)) return fixedQ(`¿Cuántas veces el valor del ${d} en ${d3(small)} es el valor del ${d} en ${d3(big)}?`, ["10", "100", "1000"], String(k), `${d3(small)} × ${k} = ${d3(big)}: cada posición a la izquierda vale 10 veces más.`, `${d3(big)}     ${d3(small)}`, `x${k}`);
  return fixedQ(`El valor del ${d} en ${d3(small)} es ¿qué parte del valor del ${d} en ${d3(big)}?`, ["1/10", "1/100", "1/1000"], `1/${k}`, `${d3(big)} ÷ ${k} = ${d3(small)}: cada posición a la derecha vale la décima parte.`, `${d3(big)}     ${d3(small)}`, `entre-${k}`);
}

// Términos de la forma desarrollada: 3,472 → [3000, 400, 70, 2].
const terms = (t: number) => [Math.floor(t / ONE) * ONE, Math.floor((t % ONE) / T) * T, Math.floor((t % T) / H) * H, t % H].filter(Boolean);
const asFraction = (x: number) => (x >= ONE ? String(x / ONE) : x >= T ? `${x / T}/10` : x >= H ? `${x / H}/100` : `${x}/1000`);

// 5.° W.6 / W.7: forma estándar ↔ forma desarrollada (`fractions`: con fracciones).
export function decimalExpanded3(r: Rng, fractions: boolean): Question {
  const t = decimal(r, r.pick([2, 3, 3]), 9);
  const parts = terms(t);
  if (parts.length < 2) return decimalExpanded3(r, fractions);
  const show = (xs: number[]) => xs.map(fractions ? asFraction : d3).join(" + ");
  const expanded = show(parts);
  if (r.chance(0.5)) return decQ(r, "Escribe el número en forma estándar.", t, `${expanded} = ${d3(t)}.`, expanded, "a-estandar", [parts.reduce((s, x) => s + (x < ONE ? x * 10 : x), 0), parts.reduce((s, x, i) => s + (i === parts.length - 1 && x < T ? x * 10 : x), 0)].filter((x) => x % 1 === 0));
  const wrong = [parts.map((x, i) => (i === parts.length - 1 ? (x * 10 < ONE ? x * 10 : x / 10) : x)), parts.map((x, i) => (i === 1 && x < ONE ? (x >= T ? x / 10 : x * 10) : x)), parts.map((x) => (x < ONE && x >= H ? x / 10 : x))].filter((w) => w.every((x) => Number.isInteger(x) && x > 0));
  return choiceQ(r, `¿Cuál es la forma desarrollada de ${d3(t)}?`, expanded, wrong.map(show).filter((x) => x !== expanded), `Cada cifra se escribe con su valor: ${expanded}.`, undefined, "a-desarrollada");
}

// 5.° W.8: componer y descomponer decimales de varias formas.
export function composeDecimal(r: Rng): Question {
  const form = r.int(0, 3);
  if (form === 0) {
    const t = decimal(r, 2, 3);
    return numQ(t / H, "Completa.", `${d3(t)} = ? centésimos`, `1 unidad = 100 centésimos y 1 décimo = 10 centésimos: ${d3(t)} = ${t / H} centésimos.`, "centesimos");
  }
  if (form === 1) {
    const t = decimal(r, 1, 9);
    return numQ(t / T, "Completa.", `${d3(t)} = ? décimos`, `1 unidad = 10 décimos: ${d3(t)} = ${t / T} décimos.`, "decimos");
  }
  if (form === 2) {
    const t = decimal(r, 3, 0);
    return numQ(t, "Completa.", `${d3(t)} = ? milésimos`, `1 décimo = 100 milésimos y 1 centésimo = 10 milésimos: ${d3(t)} = ${t} milésimos.`, "milesimos");
  }
  const d = r.int(2, 9);
  const c = r.int(1, 9);
  const t = d * T + c * H;
  return numQ(c + 10, "Completa.", `${d3(t)} = ${d - 1} décimos + ? centésimos`, `Un décimo se cambia por 10 centésimos: ${d - 1} décimos + ${c + 10} centésimos = ${d3(t)}.`, "reagrupar");
}

// 5.° W.9: redondear decimales.
export function roundDecimal3(r: Rng): Question {
  const place = r.pick([ONE, T, H]);
  for (;;) {
    const t = decimal(r, place === H ? 3 : r.pick([2, 3]), 20);
    if (t % place === place / 2 || t % place === 0) continue;
    const answer = Math.round(t / place) * place;
    const name = place === ONE ? "la unidad" : place === T ? "el décimo" : "el centésimo";
    const next = Math.floor((t % place) / (place / 10));
    const why = `Miramos la cifra de la derecha (${next}): ${next >= 5 ? "es 5 o más, se redondea hacia arriba" : "es menor que 5, se redondea hacia abajo"}. ${d3(t)} ≈ ${d3(answer)}.`;
    if (place === ONE) return numQ(answer / ONE, `Redondea ${d3(t)} a ${name} más cercana.`, d3(t), why, "unidad");
    return decQ(r, `Redondea ${d3(t)} a${name === "el décimo" ? "l décimo" : "l centésimo"} más cercano.`, answer, why, d3(t), place === T ? "decimo" : "centesimo", [answer + place, answer - place, Math.floor(t / place) * place === answer ? answer + place : Math.floor(t / place) * place]);
  }
}

// 5.° W.10: rectas numéricas con decimales (centésimos o milésimos).
export function decimalLine3(r: Rng): Question {
  const step = r.pick([H, 1]);
  const base = r.int(0, 9) * ONE + r.int(0, 9) * T + (step === 1 ? r.int(0, 9) * H : 0);
  const k = r.int(1, 9);
  const pad = (t: number) => {
    const places = step === H ? 1 : 2;
    const [w, f = ""] = d3(t).split(",");
    return `${w},${f.padEnd(places, "0")}`;
  };
  return decQ(r, "¿Qué número decimal marca el punto?", base + k * step, `Entre ${pad(base)} y ${pad(base + 10 * step)} hay 10 partes iguales de 1 ${step === H ? "centésimo" : "milésimo"}: el punto está en ${d3(base + k * step)}.`, { kind: "fractionLine", parts: 10, marked: k, labels: [pad(base), pad(base + 10 * step)] }, step === H ? "centesimos" : "milesimos", [base + (10 - k) * step, base + k * step * 10]);
}

// Dos decimales parecidos, a veces con distinta cantidad de cifras.
function closePair(r: Rng): [number, number] {
  const a = anyDecimal(r);
  if (r.chance(0.12)) return [a, a];
  const b = r.pick([a + r.pick([-1, 1]) * r.int(1, 9), a + r.pick([-1, 1]) * H * r.int(1, 9), a + r.pick([-1, 1]) * T * r.int(1, 9), Math.floor(a / T) * T + r.int(1, 9) * H, Math.floor(a / ONE) * ONE + r.int(1, 9) * T]);
  return [a, b > 0 ? b : a + 7];
}

// 5.° X.4: comparar números decimales (hasta milésimos).
export function compareDecimals3(r: Rng): Question {
  const [a, b] = closePair(r);
  const s = sym(a, b);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, s === "=" ? "Los dos números son iguales." : `Comparamos unidades, décimos, centésimos y milésimos, en ese orden: ${d3(a)} ${s} ${d3(b)}.`, `${d3(a)}  ?  ${d3(b)}`, s);
}

// 5.° X.6: ordenar números decimales (hasta milésimos).
export function orderDecimals3(r: Rng): Question {
  const whole = r.int(0, 9) * ONE;
  const d = r.int(1, 8);
  const values = [...new Set([whole + d * T, whole + d * T + r.int(1, 9) * H, whole + d * T + r.int(1, 9), whole + (d + 1) * T, whole + d * T + r.int(1, 9) * H + r.int(1, 9)])];
  const picked = r.shuffle(values).slice(0, 4);
  const ascending = r.chance(0.6);
  const sorted = [...picked].sort((x, y) => (ascending ? x - y : y - x));
  return orderQ(r, `Ordena los decimales de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`, sorted.map(d3), `El orden correcto es ${sorted.map(d3).join(" ; ")}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
}

// 5.° X.7: comparar, ordenar y redondear decimales en problemas.
export function decimalWordCompare(r: Rng): Question {
  const names = r.shuffle(NAMES).slice(0, 3);
  const base = r.int(8, 15) * ONE;
  const values = distinct(r, 3, 1, 99).map((x) => base + x * H);
  const [topic, unit, bestIsLow] = r.pick<[string, string, boolean]>([["corrieron 100 metros. Sus tiempos fueron", "s", true], ["lanzaron la pelota. Sus distancias fueron", "m", false], ["midieron sus plantas. Las alturas fueron", "cm", false]]);
  const list = names.map((n, i) => `${n}: ${d3(values[i])} ${unit}`).join("; ");
  const form = r.int(0, 2);
  if (form === 0) {
    const target = bestIsLow ? Math.min(...values) : Math.max(...values);
    return { kind: "choice", prompt: `Tres amigos ${topic}: ${list}. ¿Quién ${bestIsLow ? "fue el más rápido" : "obtuvo la medida mayor"}?`, options: names, answer: names[values.indexOf(target)], explanation: `${bestIsLow ? "El menor tiempo" : "La mayor medida"} es ${d3(target)} ${unit}.`, tag: "comparar" };
  }
  if (form === 1) {
    const target = bestIsLow ? Math.max(...values) : Math.min(...values);
    return { kind: "choice", prompt: `Tres amigos ${topic}: ${list}. ¿Quién ${bestIsLow ? "fue el más lento" : "obtuvo la medida menor"}?`, options: names, answer: names[values.indexOf(target)], explanation: `${bestIsLow ? "El mayor tiempo" : "La menor medida"} es ${d3(target)} ${unit}.`, tag: "comparar" };
  }
  const v = values.find((x) => x % T !== T / 2 && x % T !== 0) ?? values[0] + 1 * H;
  const rounded = Math.round(v / T) * T;
  return decQ(r, `Una medida fue ${d3(v)} ${unit}. Redondeada al décimo más cercano, ¿cuánto es?`, rounded, `${d3(v)} ≈ ${d3(rounded)}.`, undefined, "redondear", [rounded + T, rounded - T]);
}

// Denominadores con decimal exacto hasta los milésimos.
const DEN_MIL: Record<number, number> = { 2: 500, 4: 250, 5: 200, 8: 125, 10: 100, 20: 50, 25: 40, 40: 25, 50: 20, 100: 10, 125: 8, 200: 5, 250: 4, 500: 2, 1000: 1 };

// 5.° Y.2 / Y.3: convertir fracciones (o números mixtos) en decimales.
export function fractionToDecimal3(r: Rng, withWhole: boolean, dens = [2, 4, 5, 8, 10, 20, 25, 50, 100, 1000]): Question {
  const d = r.pick(dens);
  const n = r.int(1, d - 1);
  const w = withWhole ? r.int(1, 9) : 0;
  const t = w * ONE + n * DEN_MIL[d];
  const text = w ? `${w} ${n}/${d}` : `${n}/${d}`;
  return decQ(r, `Escribe ${text} como número decimal.`, t, `${n}/${d} = ${n * DEN_MIL[d]}/1000 = ${d3(n * DEN_MIL[d])}${w ? `; con los ${w} enteros: ${d3(t)}` : ""}.`, undefined, `sobre-${d}`, [w * ONE + n * T, w * ONE + n * H, w * ONE + n, n * ONE + w * T].filter((x) => x !== t));
}

// 5.° Y.4 / Y.5: convertir decimales en fracciones (o números mixtos), simplificadas.
export function decimalToFraction3(r: Rng, withWhole: boolean): Question {
  const t = decimal(r, r.pick([1, 2, 2, 3]), 0) + (withWhole ? r.int(1, 9) * ONE : 0);
  const rest = t % ONE;
  const den = rest % T === 0 ? 10 : rest % H === 0 ? 100 : 1000;
  const f: Frac = [(t * den) / ONE, den];
  const [sn, sd] = simp(f);
  const wrong: Frac[] = [[sn, sd * 10], [sn + sd, sd], [sn + 1, sd], [sn, sd + 1], [(rest * den) / ONE, den * 10]];
  const options = wrong.filter((x) => x[0] * sd !== sn * x[1]).map(fshow);
  return choiceQ(r, `Escribe ${d3(t)} como ${withWhole ? "número mixto" : "fracción"} en su mínima expresión.`, fshow(f), options.filter((x) => x !== fshow(f)), `${d3(t)} = ${withWhole ? `${Math.floor(t / ONE)} ` : ""}${(rest * den) / ONE}/${den}${fshow(f) !== (withWhole ? `${Math.floor(t / ONE)} ${(rest * den) / ONE}/${den}` : `${f[0]}/${den}`) ? ` = ${fshow(f)}` : ""}.`, undefined, `sobre-${den}`);
}

// Fracción o mixto con su valor en milésimos.
function fractionValue(r: Rng, withWhole: boolean): { text: string; t: number } {
  const d = r.pick([2, 4, 5, 8, 10, 20, 25]);
  const n = r.int(1, d - 1);
  const w = withWhole && r.chance(0.5) ? r.int(1, 3) : 0;
  return { text: w ? `${w} ${n}/${d}` : `${n}/${d}`, t: w * ONE + n * DEN_MIL[d] };
}

// 5.° Z.2: comparar decimales y fracciones.
export function compareDecimalFraction3(r: Rng): Question {
  const f = fractionValue(r, false);
  const other = r.chance(0.2) ? f.t : Math.max(H, f.t + r.pick([-1, 1]) * r.pick([H, 5 * H, T, 2 * T]));
  const left = r.chance(0.5);
  const s = left ? sym(f.t, other) : sym(other, f.t);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${f.text} = ${d3(f.t)}.`, left ? `${f.text}  ?  ${d3(other)}` : `${d3(other)}  ?  ${f.text}`, s);
}

// 5.° Z.3 / Z.4: ordenar una mezcla de decimales y fracciones (y números mixtos).
export function orderMixedForms(r: Rng, withWhole: boolean): Question {
  for (;;) {
    const items = [fractionValue(r, withWhole), fractionValue(r, withWhole), { t: decimal(r, r.pick([1, 2]), withWhole ? 2 : 0), text: "" }, { t: decimal(r, 2, withWhole ? 2 : 0), text: "" }].map((x) => ({ t: x.t, text: x.text || d3(x.t) }));
    if (new Set(items.map((x) => x.t)).size < 4) continue;
    const ascending = r.chance(0.6);
    const sorted = [...items].sort((x, y) => (ascending ? x.t - y.t : y.t - x.t));
    return orderQ(r, `Ordena los números de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`, sorted.map((x) => x.text), `Como decimales: ${sorted.map((x) => (x.text.includes("/") ? `${x.text} = ${d3(x.t)}` : x.text)).join(" ; ")}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
  }
}

// ---------------------------------------------------------------------------
// Sumar y restar

// 5.° AA.2 / AA.5 / AA.6: sumar y restar decimales hasta milésimos.
export function addSubDecimals3(r: Rng, op: "+" | "−" | "mixed"): Question {
  const o = op === "mixed" ? r.pick(["+", "−"] as const) : op;
  let a = anyDecimal(r, 20);
  let b = anyDecimal(r, 20);
  if (o === "−" && a < b) [a, b] = [b, a];
  if (a === b) a += 1250;
  const answer = o === "+" ? a + b : a - b;
  return decQ(r, "Resuelve. Alinea las comas antes de operar.", answer, `${d3(a)} ${o} ${d3(b)} = ${d3(answer)}.`, `${d3(a)} ${o} ${d3(b)} = ?`, o === "+" ? "suma" : "resta");
}

// 5.° AA.3: usar las propiedades para sumar tres decimales.
export function addThreeDecimalsProperties(r: Rng): Question {
  const a = r.int(1, 99) * T + r.pick([0, 0, 5 * H]);
  const round = (Math.floor(a / ONE) + r.int(1, 4)) * ONE;
  const b = round - a;
  const c = anyDecimal(r, 9);
  const order = r.shuffle([a, c, b]);
  return decQ(r, "Suma. Agrupa primero los dos números que forman un número natural.", a + b + c, `${d3(a)} + ${d3(b)} = ${d3(round)}; ${d3(round)} + ${d3(c)} = ${d3(a + b + c)}.`, `${order.map(d3).join(" + ")} = ?`);
}

// 5.° AA.7: usar la compensación para sumar y restar decimales.
export function compensation(r: Rng): Question {
  const k = r.pick([1, 2, 3, 5]) * H;
  const whole = r.int(2, 12) * ONE;
  const a = whole - k;
  const b = decimal(r, 2, 8);
  const add = r.chance(0.5) || b >= a;
  const answer = add ? a + b : a - b;
  if (!add && b + k >= whole) return compensation(r);
  const hint = add ? `${d3(a)} + ${d3(b)} = ${d3(whole)} + ${d3(b - k > 0 ? b - k : b)}` : `${d3(a)} − ${d3(b)} = ${d3(whole)} − ${d3(b + k)}`;
  if (add && b - k <= 0) return compensation(r);
  return decQ(r, "Usa la compensación: lleva un número al natural más cercano y ajusta el otro.", answer, `${hint} = ${d3(answer)}.`, `${d3(a)} ${add ? "+" : "−"} ${d3(b)} = ?`, add ? "suma" : "resta", [add ? whole + b : whole - b, add ? answer + 2 * k : answer - 2 * k]);
}

// 5.° AA.13: estimar sumas y restas de decimales redondeando.
export function estimateDecimalRounding(r: Rng): Question {
  for (;;) {
    const a = decimal(r, 2, 40);
    const b = decimal(r, 2, 40);
    if (a % ONE === 500 || b % ONE === 500) continue;
    const [ra, rb] = [Math.round(a / ONE), Math.round(b / ONE)];
    const add = r.chance(0.5);
    if (!add && ra <= rb) continue;
    return numQ(add ? ra + rb : ra - rb, "Redondea cada número a la unidad más cercana y estima.", `${d3(a)} ${add ? "+" : "−"} ${d3(b)} ≈ ?`, `${d3(a)} ≈ ${ra} y ${d3(b)} ≈ ${rb}; ${ra} ${add ? "+" : "−"} ${rb} = ${add ? ra + rb : ra - rb}.`, add ? "suma" : "resta");
  }
}

const HALF_STEPS = ["0", "0,5", "1", "1,5", "2"];
// Decimal menor que 1 claramente cerca de 0, de 0,5 o de 1.
function nearHalf(r: Rng): { t: number; half: number } {
  const half = r.int(0, 2);
  const off = r.int(1, 12) * H + r.int(0, 9);
  const t = half === 0 ? off : half === 1 ? 500 + r.pick([-1, 1]) * off : ONE - off;
  return { t, half };
}

// 5.° AA.14: estimar sumas y restas de decimales usando referencias (0; 0,5; 1).
export function estimateDecimalBenchmarks(r: Rng): Question {
  for (;;) {
    const a = nearHalf(r);
    const b = nearHalf(r);
    const add = r.chance(0.5);
    const result = add ? a.half + b.half : a.half - b.half;
    if (result < 0 || (!add && a.t <= b.t)) continue;
    return fixedQ(`Redondea cada decimal a 0; 0,5 o 1 y estima: ${d3(a.t)} ${add ? "+" : "−"} ${d3(b.t)}`, HALF_STEPS, HALF_STEPS[result], `${d3(a.t)} ≈ ${HALF_STEPS[a.half]} y ${d3(b.t)} ≈ ${HALF_STEPS[b.half]}; el resultado es cerca de ${HALF_STEPS[result]}.`, undefined, add ? "suma" : "resta");
  }
}

// ---------------------------------------------------------------------------
// Multiplicar y dividir por potencias de diez

const powText = (e: number, exponents: boolean) => (exponents ? pow10(e) : fmt(10 ** e));

// 5.° BB.1 / BB.2 / EE.1 / EE.3 / EE.4: multiplicar o dividir un decimal por una potencia de diez.
export function decimalPower(r: Rng, op: "×" | "÷" | "both", exponents: boolean): Question {
  const o = op === "both" ? r.pick(["×", "÷"] as const) : op;
  const e = r.int(1, 3);
  const k = 10 ** e;
  for (;;) {
    const small = o === "×" ? anyDecimal(r, 9) : r.int(2, 9999);
    const big = small * k;
    // En la división, el dividendo es `big` y el cociente `small` (ambos en milésimos).
    if (big > 99_999_000) continue;
    const [shown, answer] = o === "×" ? [small, big] : [big, small];
    const moved = `La coma se mueve ${e} ${e === 1 ? "lugar" : "lugares"} hacia la ${o === "×" ? "derecha" : "izquierda"}`;
    return decQ(r, "Resuelve.", answer, `${moved}: ${d3(shown)} ${o} ${powText(e, exponents)} = ${d3(answer)}.`, `${d3(shown)} ${o} ${powText(e, exponents)} = ?`, `${o}${k}`, [o === "×" ? shown * k * 10 : answer * 10, o === "×" ? (shown * k) / 10 : answer / 10, shown].filter((x) => Number.isInteger(x)));
  }
}

// 5.° BB.3 / EE.6: multiplicar o dividir por 0,1 o por 0,01.
export function byTenthHundredth(r: Rng, op: "×" | "÷"): Question {
  const k = r.pick([10, 100]);
  const f = k === 10 ? "0,1" : "0,01";
  for (;;) {
    const small = r.int(2, 999) * (op === "×" ? 1 : H);
    const big = small * k;
    const [shown, answer] = op === "×" ? [big, small] : [small, big];
    if (shown % 1 !== 0 || big > 9_999_000) continue;
    const why = op === "×" ? `Multiplicar por ${f} es lo mismo que dividir entre ${k}: la coma se mueve ${k === 10 ? "1 lugar" : "2 lugares"} a la izquierda.` : `Dividir entre ${f} es lo mismo que multiplicar por ${k}: la coma se mueve ${k === 10 ? "1 lugar" : "2 lugares"} a la derecha.`;
    return decQ(r, "Resuelve.", answer, `${why} ${d3(shown)} ${op} ${f} = ${d3(answer)}.`, `${d3(shown)} ${op} ${f} = ?`, f, [shown * k * (op === "×" ? 1 : k), shown, op === "×" ? answer * 100 : answer / 100].filter((x) => Number.isInteger(x)));
  }
}

// 5.° BB.4 / EE.5: hallar el número que falta (potencia de diez).
export function missingPower(r: Rng, op: "×" | "÷"): Question {
  const e = r.int(1, 3);
  const k = 10 ** e;
  const small = anyDecimal(r, 9);
  const big = small * k;
  const text = op === "×" ? `${d3(small)} × ? = ${d3(big)}` : `${d3(big)} ÷ ? = ${d3(small)}`;
  return fixedQ("¿Qué número falta?", ["10", "100", "1000"], String(k), `La coma se movió ${e} ${e === 1 ? "lugar" : "lugares"}: es ${fmt(k)}.`, text, `${op}${k}`);
}

// 5.° EE.2: patrones de división con decimales al aumentar el valor posicional.
export function decimalDivisionPattern(r: Rng): Question {
  const n = r.int(2, 99) * ONE + r.pick([0, 0, 500]);
  const rows = [1, 10, 100, 1000].map((k) => ({ text: `${d3(n)} ÷ ${fmt(k)}`, value: n / k }));
  if (!rows.every((row) => Number.isInteger(row.value))) return decimalDivisionPattern(r);
  const hidden = r.int(1, 3);
  return decQ(r, "Sigue el patrón. ¿Qué número falta?", rows[hidden].value, `Cada vez se divide entre 10 más: la coma se mueve un lugar a la izquierda. ${rows[hidden].text} = ${d3(rows[hidden].value)}.`, rows.map((row, i) => `${row.text} = ${i === hidden ? "?" : d3(row.value)}`).join("\n"), undefined, [rows[hidden].value * 10, rows[hidden].value / 10].filter((x) => Number.isInteger(x)));
}

// ---------------------------------------------------------------------------
// Multiplicar decimales

// Producto de dos cantidades en milésimos (debe salir exacto en milésimos).
const times = (a: number, b: number) => (a * b) / ONE;
const shiftErrors = (t: number) => [t * 10, t / 10, t * 100, t / 100].filter((x) => Number.isInteger(x) && x > 0);

// 5.° CC.1 / DD.1: estimar productos (se redondea cada decimal a la unidad).
export function estimateDecimalProduct(r: Rng, both: boolean): Question {
  for (;;) {
    const a = decimal(r, r.pick([1, 2]), 12) + ONE;
    const b = both ? decimal(r, 1, 8) + ONE : r.int(2, 12) * ONE;
    if (a % ONE === 500 || b % ONE === 500) continue;
    const [ra, rb] = [Math.round(a / ONE), Math.round(b / ONE)];
    return numQ(ra * rb, both ? "Redondea cada decimal a la unidad más cercana y estima el producto." : "Redondea el decimal a la unidad más cercana y estima el producto.", `${d3(a)} × ${d3(b)} ≈ ?`, `${d3(a)} ≈ ${ra}${both ? ` y ${d3(b)} ≈ ${rb}` : ""}; ${ra} × ${rb} = ${ra * rb}.`);
  }
}

export type DecMult = "plain" | "blocks" | "distributive" | "area" | "word" | "three";

// 5.° CC.2 – CC.9: multiplicar un decimal por un número natural.
export function decimalTimesWhole(r: Rng, mode: DecMult, places: 1 | 2 | "any" = "any", wholeDigits = 1): Question {
  const p = places === "any" ? r.pick([1, 2] as const) : places;
  if (mode === "blocks") {
    const k = r.int(2, 5);
    const a = r.int(3, Math.floor(98 / k)) * H;
    return decQ(r, `El cuadrado grande es 1 entero. El modelo muestra ${k} grupos de ${d3(a)}. ¿Cuánto es ${k} × ${d3(a)}?`, a * k, `${k} × ${a / H} centésimos = ${(a * k) / H} centésimos = ${d3(a * k)}.`, { kind: "decimalGrid", hundredths: (a * k) / H }, undefined, shiftErrors(a * k));
  }
  const k = wholeDigits === 1 ? r.int(2, 9) : r.int(11, wholeDigits === 2 ? 99 : 499);
  const a = decimal(r, p, mode === "area" ? 6 : 12);
  const product = a * k;
  const whole = Math.floor(a / ONE) * ONE;
  const frac = a - whole;
  // Para partir el decimal en entero + parte decimal hace falta que tenga parte entera.
  if ((mode === "distributive" || mode === "area") && whole === 0) return decimalTimesWhole(r, mode, places, wholeDigits);
  const tag = p === 1 ? "decimos" : "centesimos";
  if (mode === "distributive") return decQ(r, "Multiplica usando la propiedad distributiva.", product, `${k} × ${d3(whole)} = ${d3(k * whole)} y ${k} × ${d3(frac)} = ${d3(k * frac)}; ${d3(k * whole)} + ${d3(k * frac)} = ${d3(product)}.`, `${k} × ${d3(a)} = (${k} × ${d3(whole)}) + (${k} × ${d3(frac)}) = ?`, tag, shiftErrors(product));
  if (mode === "area") {
    const side = k >= 10 ? [Math.floor(k / 10) * 10, k % 10].filter(Boolean) : [k];
    const top = [whole, frac];
    return decQ(r, `Usa el modelo de área para hallar ${k} × ${d3(a)}.`, product, `Sumamos las partes: ${side.flatMap((s) => top.map((t) => d3(s * t))).join(" + ")} = ${d3(product)}.`, { kind: "areaModel", top: top.map(d3), side: side.map(String), cells: side.map((s) => top.map((t) => d3(s * t))) }, tag, shiftErrors(product));
  }
  if (mode === "word") {
    const name = r.pick(NAMES);
    return decQ(r, r.pick([`Cada botella tiene ${d3(a)} litros de agua. ¿Cuántos litros hay en ${k} botellas?`, `${name} camina ${d3(a)} km cada día. ¿Cuántos kilómetros camina en ${k} días?`, `Cada paquete pesa ${d3(a)} kg. ¿Cuánto pesan ${k} paquetes?`, `Una cinta mide ${d3(a)} m. ¿Cuántos metros miden ${k} cintas iguales?`]), product, `${k} × ${d3(a)} = ${d3(product)}.`, undefined, tag, shiftErrors(product));
  }
  if (mode === "three") {
    const j = r.pick([2, 5, 10]);
    return decQ(r, "Resuelve la multiplicación.", product * j, `${k} × ${j} = ${k * j}; ${k * j} × ${d3(a)} = ${d3(product * j)}.`, `${k} × ${d3(a)} × ${j} = ?`, tag, shiftErrors(product * j));
  }
  return decQ(r, "Resuelve la multiplicación.", product, `Multiplicamos como números naturales (${fmt(a / 10 ** (3 - p))} × ${k} = ${fmt((a / 10 ** (3 - p)) * k)}) y dejamos ${p} ${p === 1 ? "cifra decimal" : "cifras decimales"}: ${d3(product)}.`, `${k} × ${d3(a)} = ?`, tag, shiftErrors(product));
}

// Dos factores decimales. `places`: cifras decimales del producto (2 = décimos × décimos; 3 = centésimos × décimos).
function decimalFactors(r: Rng, places: 2 | 3, maxWhole = 6): [number, number] {
  const a = places === 2 ? decimal(r, 1, maxWhole) : decimal(r, 2, maxWhole);
  const b = decimal(r, 1, maxWhole);
  return r.chance(0.5) ? [a, b] : [b, a];
}

// 5.° DD.2 / DD.3: multiplicar decimales menores que 1 usando cuadrículas.
export function decimalGridProduct(r: Rng): Question {
  const a = r.int(1, 9);
  const b = r.int(1, 9);
  return decQ(r, `La cuadrícula es 1 entero. Un color cubre ${d3(a * T)} y el otro ${d3(b * T)}. ¿Cuánto es ${d3(a * T)} × ${d3(b * T)}? (Mira la zona donde se cruzan.)`, a * b * H, `Se cruzan ${a} × ${b} = ${a * b} casillas de 100: ${a * b} centésimos = ${d3(a * b * H)}.`, { kind: "fracGrid", rows: 10, cols: 10, a, b }, undefined, [a * b * T, (a + b) * T, a * b]);
}

// 5.° DD.4: ¿dónde va la coma?
export function decimalPointPlacement(r: Rng): Question {
  const [a, b] = decimalFactors(r, r.pick([2, 3]));
  const product = times(a, b);
  const strip = (t: number) => Number(d3(t).replace(/[ ,]/g, ""));
  const places = (t: number) => (d3(t).split(",")[1] ?? "").length;
  return decQ(r, "Usa la multiplicación de números naturales para ubicar la coma.", product, `${d3(a)} tiene ${places(a)} ${places(a) === 1 ? "cifra decimal" : "cifras decimales"} y ${d3(b)} tiene ${places(b)}: el producto tiene ${places(a) + places(b)}. ${d3(a)} × ${d3(b)} = ${d3(product)}.`, `${fmt(strip(a))} × ${fmt(strip(b))} = ${fmt(strip(a) * strip(b))}\n${d3(a)} × ${d3(b)} = ?`, undefined, shiftErrors(product));
}

// 5.° DD.5: multiplicar decimales usando modelos de área.
export function decimalAreaModel(r: Rng): Question {
  const split = (t: number) => [Math.floor(t / ONE) * ONE, t % ONE].filter(Boolean);
  const a = decimal(r, 1, 4) + ONE;
  const b = decimal(r, 1, 4) + ONE;
  const [top, side] = [split(a), split(b)];
  const product = times(a, b);
  return decQ(r, `Usa el modelo de área para hallar ${d3(b)} × ${d3(a)}.`, product, `Sumamos las partes: ${side.flatMap((s) => top.map((t) => d3(times(s, t)))).join(" + ")} = ${d3(product)}.`, { kind: "areaModel", top: top.map(d3), side: side.map(d3), cells: side.map((s) => top.map((t) => d3(times(s, t)))) }, undefined, shiftErrors(product));
}

// 5.° DD.6 / DD.7: multiplicar dos decimales.
export function multiplyDecimals(r: Rng, places: 2 | 3): Question {
  const [a, b] = decimalFactors(r, places);
  const product = times(a, b);
  return decQ(r, "Resuelve la multiplicación.", product, `Multiplicamos sin comas y luego contamos las cifras decimales de los dos factores: ${d3(a)} × ${d3(b)} = ${d3(product)}.`, `${d3(a)} × ${d3(b)} = ?`, places === 2 ? "centesimos" : "milesimos", shiftErrors(product));
}

// 5.° DD.8 / DD.9: comparar productos de decimales.
export function compareDecimalProducts(r: Rng, places: 2 | 3): Question {
  const [a, b] = decimalFactors(r, places, 4);
  const product = times(a, b);
  const step = places === 2 ? H : 1;
  const other = r.chance(0.2) ? product : Math.max(step, product + r.pick([-1, 1]) * step * r.pick([1, 5, 10, 20]));
  const s = sym(product, other);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${d3(a)} × ${d3(b)} = ${d3(product)}, y ${d3(product)} ${s} ${d3(other)}.`, `${d3(a)} × ${d3(b)}  ?  ${d3(other)}`, s);
}

// ---------------------------------------------------------------------------
// Dividir decimales

// 5.° FF.1: estimar cocientes de decimales (números compatibles).
export function estimateDecimalQuotient(r: Rng): Question {
  const d = r.int(2, 9);
  const q = r.int(2, 12);
  const dividend = d * q * ONE + r.pick([-1, 1]) * r.int(1, 4) * T + r.int(0, 9) * H;
  return numQ(q, `Estima con números compatibles: ¿cerca de qué número natural está ${d3(dividend)} ÷ ${d}?`, `${d3(dividend)} ÷ ${d} ≈ ?`, `${d3(dividend)} está cerca de ${d * q}, y ${d * q} ÷ ${d} = ${q}.`);
}

export type DecDiv = "plain" | "blocks" | "area" | "placeValue" | "word";

// 5.° FF.2 – FF.5: dividir un decimal entre un número natural (sin agregar ceros).
export function decimalByWhole(r: Rng, mode: DecDiv): Question {
  const k = r.int(2, 9);
  if (mode === "blocks") {
    const q = r.int(2, Math.floor(98 / k)) * H;
    return decQ(r, `El cuadrado grande es 1 entero. Se reparten ${d3(q * k)} en ${k} grupos iguales. ¿Cuánto es ${d3(q * k)} ÷ ${k}?`, q, `${(q * k) / H} centésimos ÷ ${k} = ${q / H} centésimos = ${d3(q)}.`, { kind: "decimalGrid", hundredths: (q * k) / H }, undefined, shiftErrors(q));
  }
  if (mode === "placeValue") {
    const unit = r.pick([T, H]);
    const q = r.int(2, 9);
    const name = unit === T ? "décimos" : "centésimos";
    return numQ(q, "Divide usando el valor posicional. ¿Qué número falta?", `${d3(q * k * unit)} ÷ ${k}\n= ${q * k} ${name} ÷ ${k}\n= ? ${name}`, `${q * k} ${name} ÷ ${k} = ${q} ${name} = ${d3(q * unit)}.`, name);
  }
  const q = decimal(r, r.pick([1, 2]), mode === "area" ? 6 : 12);
  const dividend = q * k;
  if (mode === "area") {
    const whole = Math.floor(q / ONE) * ONE;
    if (whole === 0) return decimalByWhole(r, mode);
    const parts = [whole, q - whole];
    const hidden = r.int(0, 2);
    const visual: Visual = { kind: "areaModel", side: [String(k)], top: parts.map((x, i) => (i === hidden ? "?" : d3(x))), cells: [parts.map((x) => d3(x * k))] };
    const why = `${parts.map((x) => `${d3(x * k)} ÷ ${k} = ${d3(x)}`).join("; ")}. Cociente: ${d3(q)}.`;
    return hidden === 2 ? decQ(r, `Usa el modelo de área para hallar ${d3(dividend)} ÷ ${k}.`, q, why, visual, "cociente", shiftErrors(q)) : decQ(r, `El modelo muestra ${d3(dividend)} ÷ ${k}. ¿Qué número va en lugar de «?»?`, parts[hidden], why, visual, "parte", shiftErrors(parts[hidden]));
  }
  if (mode === "word") {
    const name = r.pick(NAMES);
    return decQ(r, r.pick([`Una cuerda de ${d3(dividend)} m se corta en ${k} trozos iguales. ¿Cuánto mide cada trozo?`, `${name} reparte ${d3(dividend)} litros de jugo por igual en ${k} jarras. ¿Cuántos litros van en cada jarra?`, `${k} cajas iguales pesan ${d3(dividend)} kg en total. ¿Cuánto pesa cada caja?`, `${name} recorrió ${d3(dividend)} km en ${k} días, lo mismo cada día. ¿Cuántos kilómetros recorrió por día?`]), q, `${d3(dividend)} ÷ ${k} = ${d3(q)}.`, undefined, undefined, shiftErrors(q));
  }
  return decQ(r, "Resuelve la división.", q, `${d3(dividend)} ÷ ${k} = ${d3(q)}, porque ${k} × ${d3(q)} = ${d3(dividend)}.`, `${d3(dividend)} ÷ ${k} = ?`, undefined, shiftErrors(q));
}

// 5.° FF.6 / FF.7: divisiones entre naturales con cociente decimal (`rounding`: no exacta, se redondea al décimo).
export function decimalQuotient(r: Rng, rounding: boolean): Question {
  for (;;) {
    const d = rounding ? r.pick([3, 6, 7, 9]) : r.pick([2, 4, 5, 8]);
    const n = r.int(1, 60);
    if (n % d === 0) continue;
    if (!rounding) {
      const q = (n * ONE) / d;
      return decQ(r, "Divide hasta que no quede residuo (agrega ceros después de la coma).", q, `${n} ÷ ${d} = ${d3(q)}, porque ${d} × ${d3(q)} = ${n}.`, `${n} ÷ ${d} = ?`, `entre-${d}`, shiftErrors(q));
    }
    // Si la división termina en los décimos, no hay nada que redondear.
    if ((n * 10) % d === 0) continue;
    const hundredths = Math.floor((n * 100) / d);
    if (hundredths % 10 === 5 && (n * 100) % d === 0) continue;
    const rounded = Math.round((n * 10) / d) * T;
    return decQ(r, "Divide y redondea el cociente al décimo más cercano.", rounded, `${n} ÷ ${d} = ${d3(hundredths * H)}...; redondeado al décimo: ${d3(rounded)}.`, `${n} ÷ ${d} ≈ ?`, `entre-${d}`, [Math.floor((n * 10) / d) * T === rounded ? rounded + T : Math.floor((n * 10) / d) * T, rounded * 10]);
  }
}

// 5.° FF.8: problemas de división con cociente decimal.
export function decimalQuotientProblem(r: Rng): Question {
  const d = r.pick([2, 4, 5, 8]);
  for (;;) {
    const n = r.int(3, 60);
    if (n % d === 0) continue;
    const q = (n * ONE) / d;
    return decQ(r, r.pick([`${d} amigos pagan por igual una cuenta de ${n} soles. ¿Cuántos soles paga cada uno?`, `Una cinta de ${n} m se corta en ${d} trozos iguales. ¿Cuántos metros mide cada trozo?`, `Se reparten ${n} litros de leche por igual en ${d} baldes. ¿Cuántos litros van en cada balde?`, `${r.pick(NAMES)} recorre ${n} km en ${d} horas, siempre al mismo ritmo. ¿Cuántos kilómetros recorre por hora?`]), q, `${n} ÷ ${d} = ${d3(q)}.`, undefined, undefined, shiftErrors(q));
  }
}

// 5.° FF.9 – FF.11: dividir entre un decimal.
export function divideByDecimal(r: Rng, mode: "placeValue" | "noZeros" | "any"): Question {
  const unit = mode === "any" ? r.pick([T, H]) : T;
  const d = r.int(2, 9) * unit + (mode === "any" && r.chance(0.3) ? ONE : 0);
  const name = unit === T ? "décimos" : "centésimos";
  if (mode === "placeValue") {
    const q = r.int(2, 12);
    const dividend = d * q;
    return numQ(q, "Divide usando el valor posicional. ¿Qué número falta?", `${d3(dividend)} ÷ ${d3(d)}\n= ${dividend / unit} ${name} ÷ ${d / unit} ${name}\n= ?`, `${dividend / unit} ÷ ${d / unit} = ${q}.`, name);
  }
  // Cociente natural o con un decimal.
  const q = mode === "noZeros" || r.chance(0.5) ? r.int(2, 30) * ONE : r.int(2, 99) * T;
  const dividend = times(d, q);
  if (!Number.isInteger(dividend)) return divideByDecimal(r, mode);
  const k = unit === T ? 10 : 100;
  return decQ(r, "Resuelve la división.", q, `Multiplicamos los dos números por ${k} para quitar la coma del divisor: ${d3(dividend * k)} ÷ ${d3(d * k)} = ${d3(q)}.`, `${d3(dividend)} ÷ ${d3(d)} = ?`, name, shiftErrors(q));
}

// ---------------------------------------------------------------------------
// Operaciones mixtas

// 5.° GG.1: sumar, restar, multiplicar y dividir decimales.
export function mixedDecimalOps(r: Rng): Question {
  return r.pick([() => addSubDecimals3(r, "+"), () => addSubDecimals3(r, "−"), () => decimalTimesWhole(r, "plain"), () => multiplyDecimals(r, 2), () => decimalByWhole(r, "plain"), () => divideByDecimal(r, "any")])();
}

// 5.° GG.2: problemas con las cuatro operaciones y decimales.
export function decimalProblem4(r: Rng): Question {
  const name = r.pick(NAMES);
  return r.pick([
    () => decimalTimesWhole(r, "word"),
    () => decimalByWhole(r, "word"),
    () => {
      const a = decimal(r, 2, 15);
      const b = decimal(r, 2, 9);
      return decQ(r, `${name} compró ${d3(a)} kg de papa y ${d3(b)} kg de camote. ¿Cuántos kilos compró en total?`, a + b, `${d3(a)} + ${d3(b)} = ${d3(a + b)}.`, undefined, "suma");
    },
    () => {
      const b = decimal(r, 2, 9);
      const a = b + decimal(r, 2, 9);
      return decQ(r, `Una tabla mide ${d3(a)} m y se le corta un trozo de ${d3(b)} m. ¿Cuántos metros quedan?`, a - b, `${d3(a)} − ${d3(b)} = ${d3(a - b)}.`, undefined, "resta");
    },
  ])();
}

// 5.° GG.3: problemas de varios pasos con decimales.
export function decimalMultiStep(r: Rng): Question {
  const name = r.pick(NAMES);
  const k = r.int(2, 6);
  const a = decimal(r, 1, 6) + ONE;
  const b = decimal(r, 1, 9);
  const form = r.int(0, 2);
  if (form === 0) return decQ(r, `${name} compra ${k} bolsas de ${d3(a)} kg de arroz y una bolsa de ${d3(b)} kg de azúcar. ¿Cuántos kilos lleva en total?`, k * a + b, `${k} × ${d3(a)} = ${d3(k * a)}; ${d3(k * a)} + ${d3(b)} = ${d3(k * a + b)}.`, undefined, "por-y-mas", [k * (a + b), a + b]);
  if (form === 1) {
    const total = k * a + b;
    return decQ(r, `Una cuerda mide ${d3(total)} m. Se cortan ${k} trozos de ${d3(a)} m. ¿Cuántos metros sobran?`, b, `${k} × ${d3(a)} = ${d3(k * a)}; ${d3(total)} − ${d3(k * a)} = ${d3(b)}.`, undefined, "por-y-resta", [total - a, k * a]);
  }
  const q = decimal(r, 1, 5);
  const total = q * k;
  const extra = decimal(r, 1, 3);
  return decQ(r, `${name} reparte ${d3(total)} litros de jugo por igual en ${k} jarras y luego agrega ${d3(extra)} litros de agua a una de ellas. ¿Cuántos litros tiene esa jarra?`, q + extra, `${d3(total)} ÷ ${k} = ${d3(q)}; ${d3(q)} + ${d3(extra)} = ${d3(q + extra)}.`, undefined, "entre-y-mas", [q, total + extra]);
}

// 5.° GG.4: ecuaciones con operaciones mixtas, ¿verdadero o falso?
export function decimalTrueFalse(r: Rng): Question {
  const a = decimal(r, 1, 9);
  const b = decimal(r, 1, 9);
  const k = r.int(2, 9);
  const forms: [string, number][] = [[`${d3(a)} + ${d3(b)}`, a + b], [`${k} × ${d3(a)}`, k * a], [`${d3(a * k)} ÷ ${k}`, a], [`${d3(a + b)} − ${d3(b)}`, a]];
  const [text, value] = r.pick(forms);
  const good = r.chance(0.5);
  const said = good ? value : r.pick([value + T, Math.abs(value - T) || value + 2 * T, value * 10, value + ONE]);
  return trueFalse("¿La igualdad es verdadera o falsa?", good, `${text} = ${d3(value)}.`, `${text} = ${d3(said)}`);
}



// 6.° I.10: inecuaciones con división de decimales.
export function decimalDivisionInequality(r: Rng): Question {
  const d = r.int(2, 9) * T;
  const q = r.int(2, 30) * ONE;
  const dividend = times(d, q);
  const other = r.chance(0.2) ? q : Math.max(ONE, q + r.pick([-1, 1]) * r.pick([ONE, 2 * ONE, 500]));
  const s = sym(q, other);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${d3(dividend)} ÷ ${d3(d)} = ${d3(q)}, y ${d3(q)} ${s} ${d3(other)}.`, `${d3(dividend)} ÷ ${d3(d)}  ?  ${d3(other)}`, s);
}

// 6.° J.4: evaluar expresiones numéricas con decimales.
export function decimalExpression(r: Rng): Question {
  const a = decimal(r, 1, 9);
  const b = decimal(r, 1, 6);
  const k = r.int(2, 6);
  const forms: [string, number, string][] = [
    [`${d3(a)} + ${k} × ${d3(b)}`, a + k * b, `${k} × ${d3(b)} = ${d3(k * b)}; ${d3(a)} + ${d3(k * b)}`],
    [`(${d3(a)} + ${d3(b)}) × ${k}`, (a + b) * k, `${d3(a)} + ${d3(b)} = ${d3(a + b)}; ${d3(a + b)} × ${k}`],
    [`${d3(a * k)} ÷ ${k} + ${d3(b)}`, a + b, `${d3(a * k)} ÷ ${k} = ${d3(a)}; ${d3(a)} + ${d3(b)}`],
    [`${k} × ${d3(a + b)} − ${k} × ${d3(b)}`, k * a, `${k} × ${d3(a + b)} = ${d3(k * (a + b))}; ${k} × ${d3(b)} = ${d3(k * b)}; la diferencia`],
  ];
  const [text, value, steps] = r.pick(forms);
  return decQ(r, "Calcula. Respeta el orden de las operaciones.", value, `${steps} = ${d3(value)}.`, `${text} = ?`, undefined, [(a + k) * b / ONE, a + b].filter(Number.isInteger));
}
