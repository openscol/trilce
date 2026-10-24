import type { Rng } from "../rng";
import type { Question } from "../types";
import { choiceQ, distinct, fmt, multiQ, numQ, symbolQ, table, words } from "./kit";

// Valor posicional, comparación y redondeo con números grandes (4.° en
// adelante). `maxDigits` fija hasta dónde llegan los números: 6 = centenas de
// millar, 7 = millones, 9 = centenas de millón.

const PLACE = ["unidades", "decenas", "centenas", "unidades de millar", "decenas de millar", "centenas de millar", "unidades de millón", "decenas de millón", "centenas de millón"];
const PLACE_ONE = ["unidad", "decena", "centena", "unidad de millar", "decena de millar", "centena de millar", "unidad de millón", "decena de millón", "centena de millón"];

// Número de `len` cifras, todas distintas (así "la cifra 7" no es ambigua).
function uniqueDigits(r: Rng, len: number): number[] {
  for (;;) {
    const ds = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
    if (ds[0] !== 0) return ds;
  }
}
const toNumber = (ds: number[]) => Number(ds.join(""));

// Nombre de la posición de una cifra.
export function placeName(r: Rng, maxDigits: number): Question {
  const ds = uniqueDigits(r, r.int(4, maxDigits));
  const n = toNumber(ds);
  const at = r.int(0, ds.length - 1);
  const place = PLACE[ds.length - 1 - at];
  return choiceQ(r, `¿En qué posición está la cifra ${ds[at]} en el número ${fmt(n)}?`, place, PLACE.slice(0, Math.max(5, ds.length)), `En ${fmt(n)}, la cifra ${ds[at]} está en las ${place}.`, fmt(n), place);
}

// Valor de una cifra.
export function digitValue(r: Rng, maxDigits: number): Question {
  const ds = uniqueDigits(r, r.int(4, maxDigits));
  const n = toNumber(ds);
  let at = r.int(0, ds.length - 1);
  if (ds[at] === 0) at = 0;
  const p = ds.length - 1 - at;
  return numQ(ds[at] * 10 ** p, `¿Cuál es el valor de la cifra ${ds[at]} en el número ${fmt(n)}?`, fmt(n), `La cifra ${ds[at]} está en las ${PLACE[p]}: vale ${fmt(ds[at] * 10 ** p)}.`, PLACE[p]);
}

// Cada posición vale 10 veces la que está a su derecha.
export function placeRelation(r: Rng): Question {
  const d = r.int(1, 9);
  const low = r.int(0, 3);
  const jump = r.int(1, 3);
  const a = d * 10 ** (low + jump);
  const b = d * 10 ** low;
  const answer = 10 ** jump;
  if (r.chance(0.5)) {
    return choiceQ(r, `¿Cuántas veces el valor del ${d} en ${fmt(b)} es el valor del ${d} en ${fmt(a)}?`, fmt(answer), [10, 100, 1000, 10000].map(fmt), `${fmt(b)} × ${fmt(answer)} = ${fmt(a)}: cada posición a la izquierda vale 10 veces más.`, `${fmt(a)}     ${fmt(b)}`, `x${answer}`);
  }
  return numQ(a, `¿Qué número es ${fmt(answer)} veces ${fmt(b)}?`, `${fmt(answer)} × ${fmt(b)} = ?`, `Al multiplicar por ${fmt(answer)}, la cifra ${d} se mueve ${jump} ${jump === 1 ? "posición" : "posiciones"} a la izquierda: ${fmt(a)}.`, `x${answer}`);
}

// 10 o 100 veces un número.
export function timesTenHundred(r: Rng): Question {
  const k = r.pick([10, 100]);
  const n = r.int(2, r.pick([99, 999, 4000]));
  const form = r.int(0, 2);
  if (form === 0) return numQ(n * k, `¿Cuánto es ${k} veces ${fmt(n)}?`, `${k} × ${fmt(n)} = ?`, `Multiplicar por ${k} agrega ${k === 10 ? "un cero" : "dos ceros"}: ${fmt(n * k)}.`, `x${k}`);
  if (form === 1) return numQ(n, `¿Qué número multiplicado por ${k} da ${fmt(n * k)}?`, `? × ${k} = ${fmt(n * k)}`, `${fmt(n)} × ${k} = ${fmt(n * k)}.`, `x${k}`);
  return choiceQ(r, `${fmt(n * k)} es ¿cuántas veces ${fmt(n)}?`, String(k), ["10", "100", "1000"], `${fmt(n)} × ${k} = ${fmt(n * k)}.`, undefined, `x${k}`);
}

// Número con algunas cifras en cero y su forma desarrollada.
function sparse(r: Rng, maxDigits: number, minDigits = 4) {
  const len = r.int(minDigits, maxDigits);
  const ds = Array.from({ length: len }, (_, i) => (i === 0 ? r.int(1, 9) : r.chance(0.3) ? 0 : r.int(1, 9)));
  if (ds.filter(Boolean).length < 2) ds[len - 1] = r.int(1, 9);
  const n = toNumber(ds);
  const terms = ds.map((d, i) => d * 10 ** (len - 1 - i)).filter(Boolean);
  return { n, terms };
}

// Forma estándar ↔ forma desarrollada.
export function expandedForm(r: Rng, maxDigits: number): Question {
  const { n, terms } = sparse(r, maxDigits);
  const expanded = terms.map(fmt).join(" + ");
  const form = r.int(0, 2);
  if (form === 0) return numQ(n, "Escribe el número en forma estándar.", expanded, `${expanded} = ${fmt(n)}.`, "a-estandar");
  if (form === 1) {
    const hidden = r.int(0, terms.length - 1);
    return numQ(terms[hidden], "¿Qué número falta en la forma desarrollada?", `${fmt(n)} = ${terms.map((t, i) => (i === hidden ? "?" : fmt(t))).join(" + ")}`, `${fmt(n)} = ${expanded}.`, "termino-que-falta");
  }
  const wrong = [terms.map((t, i) => (i === 0 ? t / 10 : t)), terms.map((t, i) => (i === terms.length - 1 ? t * 10 : t)), terms.map((t, i) => (i === 1 ? t * 10 : t)), terms.map((t) => Number(String(t)[0]))];
  return choiceQ(r, `¿Cuál es la forma desarrollada de ${fmt(n)}?`, expanded, wrong.map((w) => w.map(fmt).join(" + ")), `Cada cifra se escribe con su valor: ${expanded}.`, undefined, "a-desarrollada");
}

// Convertir entre palabras y cifras.
export function wordsDigits(r: Rng, minDigits: number, maxDigits: number): Question {
  const { n } = sparse(r, maxDigits, minDigits);
  const max = 10 ** maxDigits - 1;
  if (r.chance(0.5)) return numQ(n, "Escribe el número con cifras.", words(n), `«${words(n)}» se escribe ${fmt(n)}.`, "a-cifras");
  const len = String(n).length;
  const wrong = distinct(r, 6, 0, len - 1)
    .map((p) => n + r.pick([-1, 1]) * 10 ** p * r.int(1, 2))
    .concat([n * 10 > max ? Math.floor(n / 10) : n * 10])
    .filter((x) => x > 0 && x !== n);
  return choiceQ(r, `¿Cómo se escribe ${fmt(n)} con palabras?`, words(n), wrong.map(words), `${fmt(n)} se lee «${words(n)}».`, fmt(n), "a-palabras");
}

const SPARE_WORDS = ["cien", "diez", "cuarenta", "sesenta", "quinientos", "dos", "siete", "veinte", "ochenta", "novecientos", "tres", "millón"];

// Escribir el nombre del número tocando sus palabras en orden.
export function spellNumber(r: Rng, max: number): Question {
  const len = r.int(3, String(max).length);
  const ds = Array.from({ length: len }, () => 0);
  ds[0] = r.int(1, 9);
  for (const p of distinct(r, r.int(1, 2), 1, len - 1)) ds[p] = r.int(1, 9);
  const n = Math.min(max, toNumber(ds));
  const answer = words(n).split(" ");
  const own = [...new Set(answer)];
  const spare = r.shuffle(SPARE_WORDS.filter((w) => !own.includes(w))).slice(0, 2);
  return {
    kind: "sequence",
    prompt: `Escribe con palabras el número ${fmt(n)}. Toca las palabras en orden.`,
    visual: { kind: "text", text: fmt(n) },
    tiles: r.shuffle([...own, ...spare]),
    reuse: true,
    length: answer.length,
    answer,
    explanation: `${fmt(n)} se escribe «${words(n)}».`,
    tag: `${len}-cifras`,
  };
}

// Problemas de valor posicional.
export function placeWordProblem(r: Rng, maxDigits: number): Question {
  const ds = uniqueDigits(r, r.int(4, maxDigits));
  const n = toNumber(ds);
  const len = ds.length;
  const form = r.int(0, 2);
  if (form === 0) {
    const clues = r.shuffle(ds.map((d, i) => `${d} ${d === 1 ? PLACE_ONE[len - 1 - i] : PLACE[len - 1 - i]}`));
    return numQ(n, "Lee las pistas. ¿Qué número es?", `Tiene ${clues.slice(0, -1).join(", ")} y ${clues[len - 1]}.`, `Ordenamos las cifras de mayor a menor posición: ${fmt(n)}.`, "pistas");
  }
  const at = r.int(0, len - 1);
  const p = len - 1 - at;
  const place = r.pick(["Un estadio", "Una feria", "Un museo", "Una ciudad", "Un parque"]);
  if (form === 1) return numQ(ds[at], `${place} recibió ${fmt(n)} visitantes. ¿Qué cifra está en las ${PLACE[p]}?`, fmt(n), `En ${fmt(n)}, las ${PLACE[p]} son ${ds[at]}.`, "cifra");
  const up = r.int(1, 9 - ds[at] || 1);
  const safe = ds[at] + up <= 9 ? up : 0;
  if (safe === 0) return numQ(ds[at], `${place} recibió ${fmt(n)} visitantes. ¿Qué cifra está en las ${PLACE[p]}?`, fmt(n), `En ${fmt(n)}, las ${PLACE[p]} son ${ds[at]}.`, "cifra");
  return numQ(n + safe * 10 ** p, `¿Qué número se obtiene si a ${fmt(n)} le aumentas ${safe} ${safe === 1 ? PLACE_ONE[p] : PLACE[p]}?`, fmt(n), `Sumamos ${fmt(safe * 10 ** p)}: ${fmt(n)} + ${fmt(safe * 10 ** p)} = ${fmt(n + safe * 10 ** p)}.`, "aumentar");
}

const SIMPLE = [["unidad", "unidades"], ["decena", "decenas"], ["centena", "centenas"], ["millar", "millares"]];
const qty = (q: number, p: number) => `${fmt(q)} ${SIMPLE[p][q === 1 ? 0 : 1]}`;

// Convertir entre posiciones (30 centenas = 300 decenas).
export function convertPlaces(r: Rng): Question {
  const hi = r.int(1, 3);
  const lo = r.int(0, hi - 1);
  const big = r.int(1, 9) * r.pick([1, 10]);
  const small = big * 10 ** (hi - lo);
  const [a, pa, b, pb] = r.chance(0.5) ? [big, hi, small, lo] : [small, lo, big, hi];
  return numQ(b, "Completa la igualdad.", `${qty(a, pa)} = ? ${SIMPLE[pb][1]}`, `${qty(a, pa)} = ${fmt(big * 10 ** hi)} = ${qty(b, pb)}.`, `${SIMPLE[pa][1]}-a-${SIMPLE[pb][1]}`);
}

// Repaso.
export function placeReview(r: Rng, maxDigits: number): Question {
  return r.pick([() => placeName(r, maxDigits), () => digitValue(r, maxDigits), () => expandedForm(r, maxDigits), () => convertPlaces(r), () => placeRelation(r)])();
}

// Dos números de la misma cantidad de cifras que suelen compartir el inicio.
function closePair(r: Rng, maxDigits: number): [number, number] {
  const len = r.int(4, maxDigits);
  const a = r.int(10 ** (len - 1), 10 ** len - 1);
  if (r.chance(0.1)) return [a, a];
  if (r.chance(0.25)) return [a, r.int(10 ** (len - 2), 10 ** len - 1)];
  const p = r.int(0, len - 2);
  const b = a + r.pick([-1, 1]) * r.int(1, 9) * 10 ** p;
  return [a, b > 0 && b !== a ? b : a + 1];
}

// Comparar números grandes.
export function compareBig(r: Rng, maxDigits: number): Question {
  const [a, b] = closePair(r, maxDigits);
  return symbolQ(a, b, fmt(a), fmt(b), a === b ? "Los dos números son iguales." : `Comparamos cifra por cifra desde la izquierda: ${fmt(Math.max(a, b))} es mayor que ${fmt(Math.min(a, b))}.`);
}

const TABLE_THEMES: [title: string, column: string, rows: string[]][] = [
  ["Habitantes por distrito", "Habitantes", ["Los Olivos", "San Borja", "Miraflores", "Surco", "Ate", "Comas"]],
  ["Visitantes por museo", "Visitantes", ["Museo de Arte", "Museo del Mar", "Museo de Historia", "Museo de Ciencias", "Museo del Oro"]],
  ["Puntos en el videojuego", "Puntos", ["Ana", "Luis", "Rosa", "Mateo", "Lucía", "Diego"]],
  ["Altura de montañas (m)", "Metros", ["Huascarán", "Yerupajá", "Coropuna", "Ausangate", "Salkantay", "Alpamayo"]],
  ["Libros por biblioteca", "Libros", ["Central", "Municipal", "Escolar", "Del parque", "Universitaria"]],
];

// Comparar números en tablas.
export function compareTable(r: Rng, maxDigits: number): Question {
  const [title, column, names] = r.pick(TABLE_THEMES);
  const len = r.int(4, maxDigits);
  const rows = r.shuffle(names).slice(0, 4);
  const base = r.int(10 ** (len - 1), 10 ** len - 10 ** (len - 1));
  const values = distinct(r, 4, base, base + 10 ** (len - 1));
  const most = r.chance(0.5);
  const target = most ? Math.max(...values) : Math.min(...values);
  const answer = rows[values.indexOf(target)];
  return {
    kind: "choice",
    prompt: `Según la tabla, ¿cuál tiene ${most ? "el número mayor" : "el número menor"}?`,
    visual: table(["", column], rows.map((row, i) => [row, fmt(values[i])]), title),
    options: rows,
    answer,
    explanation: `${most ? "El mayor" : "El menor"} es ${fmt(target)}: ${answer}.`,
    tag: most ? "mayor" : "menor",
  };
}

// Hallar la lista ordenada.
export function findOrder(r: Rng, maxDigits: number): Question {
  const len = r.int(4, maxDigits);
  const base = r.int(10 ** (len - 1), 10 ** len - 10 ** (len - 1));
  const nums = distinct(r, 4, base, base + 10 ** (len - 1) - 1);
  const ascending = r.chance(0.5);
  const sorted = [...nums].sort((a, b) => (ascending ? a - b : b - a));
  const show = (xs: number[]) => xs.map(fmt).join(" · ");
  const wrong = [
    [sorted[1], sorted[0], sorted[2], sorted[3]],
    [sorted[0], sorted[2], sorted[1], sorted[3]],
    [sorted[0], sorted[1], sorted[3], sorted[2]],
    [...sorted].reverse(),
  ];
  return choiceQ(r, `¿Qué lista está ordenada de ${ascending ? "menor a mayor" : "mayor a menor"}?`, show(sorted), wrong.map(show), `El orden correcto es ${show(sorted)}.`, undefined, ascending ? "menor-a-mayor" : "mayor-a-menor");
}

const roundTo = (n: number, unit: number) => Math.round(n / unit) * unit;

// Número y posición a la que se redondea (sin casos justo en la mitad).
function roundCase(r: Rng, maxPlace: number, maxDigits: number) {
  const p = r.int(1, maxPlace);
  const len = r.int(Math.max(3, p + 1), maxDigits);
  let n = r.int(10 ** (len - 1), 10 ** len - 1);
  const unit = 10 ** p;
  if (n % unit === unit / 2) n += 1;
  if (n % unit === 0) n += r.int(1, unit / 2 - 1);
  return { n, p, unit, answer: roundTo(n, unit) };
}

const roundWhy = (n: number, p: number, unit: number) => {
  const next = Math.floor((n % unit) / (unit / 10));
  return `Miramos la cifra de la derecha (${next}): como es ${next >= 5 ? "5 o más, redondeamos hacia arriba" : "menor que 5, redondeamos hacia abajo"}. ${fmt(n)} ≈ ${fmt(roundTo(n, unit))}.`;
};

// Redondear a una posición dada (hasta 10^maxPlace).
export function roundBig(r: Rng, maxPlace: number, maxDigits: number): Question {
  const { n, p, unit, answer } = roundCase(r, maxPlace, maxDigits);
  return numQ(answer, `Redondea ${fmt(n)} a la ${PLACE_ONE[p]} más cercana.`, fmt(n), roundWhy(n, p, unit), PLACE_ONE[p]);
}

// Redondear al lugar de una cifra del número.
export function roundToDigit(r: Rng, maxDigits: number): Question {
  for (;;) {
    const ds = uniqueDigits(r, r.int(4, maxDigits));
    const n = toNumber(ds);
    const at = r.int(0, ds.length - 2);
    const p = ds.length - 1 - at;
    const unit = 10 ** p;
    if (n % unit === unit / 2) continue;
    return numQ(roundTo(n, unit), `Redondea ${fmt(n)} al lugar donde está la cifra ${ds[at]}.`, fmt(n), `La cifra ${ds[at]} está en las ${PLACE[p]}. ${roundWhy(n, p, unit)}`, PLACE_ONE[p]);
  }
}

// Tablas de entrada y salida con una regla de redondeo.
export function roundingTable(r: Rng, maxPlace: number): Question {
  const p = r.int(1, maxPlace);
  const unit = 10 ** p;
  const len = Math.max(3, p + 1) + r.int(0, 1);
  const inputs = distinct(r, 4, 10 ** (len - 1), 10 ** len - 1, (n) => n % unit !== unit / 2 && n % unit !== 0);
  const hidden = r.int(0, inputs.length - 1);
  const n = inputs[hidden];
  return numQ(
    roundTo(n, unit),
    `Regla: redondear a la ${PLACE_ONE[p]} más cercana. ¿Qué número falta?`,
    table(["Entrada", "Salida"], inputs.map((x, i) => [fmt(x), i === hidden ? "?" : fmt(roundTo(x, unit))])),
    roundWhy(n, p, unit),
    PLACE_ONE[p]
  );
}

// Acertijos de redondeo.
export function roundingPuzzle(r: Rng, maxPlace: number): Question {
  const p = r.int(1, maxPlace);
  const unit = 10 ** p;
  const target = r.int(2, 98) * unit;
  if (r.chance(0.4)) {
    const least = r.chance(0.5);
    const answer = least ? target - unit / 2 : target + unit / 2 - 1;
    return numQ(answer, `¿Cuál es el ${least ? "menor" : "mayor"} número entero que, redondeado a la ${PLACE_ONE[p]} más cercana, da ${fmt(target)}?`, undefined, `Redondean a ${fmt(target)} los números desde ${fmt(target - unit / 2)} hasta ${fmt(target + unit / 2 - 1)}.`, least ? "menor" : "mayor");
  }
  const good = distinct(r, r.int(1, 3), target - unit / 2, target + unit / 2 - 1);
  const bad = distinct(r, 5 - good.length, target - unit * 2, target + unit * 2, (n) => n > 0 && roundTo(n, unit) !== target && n % unit !== unit / 2);
  const options = r.shuffle([...good, ...bad]).map(fmt);
  return multiQ(`Selecciona todos los números que, redondeados a la ${PLACE_ONE[p]} más cercana, dan ${fmt(target)}.`, options, good.map(fmt), `Redondean a ${fmt(target)} los números desde ${fmt(target - unit / 2)} hasta ${fmt(target + unit / 2 - 1)}.`, undefined, PLACE_ONE[p]);
}
