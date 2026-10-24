import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, SYMBOLS, choiceQ, fcmp, fixedQ, fr, gcd, mixed, multiQ, numQ, simp, sym, yesNo } from "./kit";

// Fracciones de 4.° en adelante: equivalentes, números mixtos, comparar,
// descomponer, sumar y restar (igual y distinto denominador) y multiplicar
// por un número natural. Las respuestas en fracción van como opción múltiple.

const DENS = [2, 3, 4, 5, 6, 8, 10, 12];
const m = ([n, d]: Frac) => mixed(n, d);
const same = (a: Frac, b: Frac) => a[0] * b[1] === b[0] * a[1];

// Opción múltiple con fracciones: los distractores nunca valen lo mismo que la respuesta.
function fracChoice(r: Rng, prompt: string, answer: Frac, explanation: string, visual?: Visual | string, tag?: string, extra: Frac[] = [], show: (f: Frac) => string = fr): Question {
  const [n, d] = answer;
  // Con fracciones mayores que 1 (o números mixtos) solo se mueve el numerador:
  // invertir o cambiar el denominador daría opciones que se descartan a simple vista.
  const pool: Frac[] = n > d ? [...extra, [n + 1, d], [n - 1, d], [n + 2, d], [n + d, d], [n - d, d], [n - 2, d]] : [...extra, [n + 1, d], [n - 1, d], [n + 2, d], [n, d + 1], [n, d - 1], [n + 1, d + 1], [d, n], [n * 2, d], [n + d, d]];
  const wrong = pool.filter(([a, b]) => a > 0 && b > 1 && !same([a, b], answer)).map(show);
  return choiceQ(r, prompt, show(answer), wrong.filter((w) => w !== show(answer)), explanation, visual, tag);
}

const proper = (r: Rng, dens = DENS): Frac => {
  const d = r.pick(dens.filter((x) => x > 2));
  return [r.int(1, d - 1), d];
};

// Fracciones de un todo, con problemas.
export function fractionWholeProblem(r: Rng): Question {
  const d = r.pick([3, 4, 5, 6, 8, 10]);
  const n = r.int(1, d - 1);
  const name = r.pick(NAMES);
  const rest = r.chance(0.4);
  const [text, shape] = r.pick<[string, "circle" | "bar"]>([
    [`Una pizza se cortó en ${d} partes iguales y ${name} comió ${n}.`, "circle"],
    [`Un chocolate tiene ${d} partes iguales y ${name} comió ${n}.`, "bar"],
    [`Un huerto se dividió en ${d} partes iguales y ya se sembraron ${n}.`, "bar"],
    [`Una torta se cortó en ${d} partes iguales y se repartieron ${n}.`, "circle"],
  ]);
  const answer: Frac = rest ? [d - n, d] : [n, d];
  return fracChoice(r, `${text} ¿Qué fracción ${rest ? "queda" : "es esa"}?`, answer, `De ${d} partes iguales, ${rest ? `quedan ${d - n}` : `son ${n}`}: ${fr(answer)}.`, { kind: "fraction", shape, parts: d, shaded: n }, rest ? "lo-que-queda" : "parte", [[rest ? n : d - n, d]]);
}

// Fracciones de un grupo, con problemas.
export function fractionGroupProblem(r: Rng): Question {
  const d = r.int(4, 12);
  const n = r.int(1, d - 1);
  const name = r.pick(NAMES);
  const [text, emoji] = r.pick([
    [`${name} tiene ${d} globos; ${n} son rojos. ¿Qué fracción de los globos es roja?`, "🎈"],
    [`En una caja hay ${d} manzanas; ${n} están maduras. ¿Qué fracción de las manzanas está madura?`, "🍎"],
    [`De ${d} carros del estacionamiento, ${n} son taxis. ¿Qué fracción de los carros son taxis?`, "🚗"],
    [`En el estanque hay ${d} peces; ${n} son dorados. ¿Qué fracción de los peces es dorada?`, "🐟"],
  ]);
  return fracChoice(r, text, [n, d], `${n} de ${d}: la fracción es ${n}/${d}.`, { kind: "fractionGroup", emoji, total: d, highlighted: n }, undefined, [[d - n, d], [n, d - n]]);
}

// Fracción irreducible y un factor para ampliarla.
function equivalentPair(r: Rng, maxDen = 12, maxK = 6): [Frac, Frac, number] {
  for (;;) {
    const d = r.int(2, maxDen);
    const n = r.int(1, d - 1);
    if (gcd(n, d) !== 1) continue;
    const k = r.int(2, maxK);
    return [[n, d], [n * k, d * k], k];
  }
}

// Hallar fracciones equivalentes multiplicando o dividiendo.
export function equivalentByMultDiv(r: Rng): Question {
  const [small, big, k] = equivalentPair(r, 10, 5);
  if (r.chance(0.5)) return fracChoice(r, `Multiplica el numerador y el denominador de ${fr(small)} por ${k}. ¿Qué fracción equivalente obtienes?`, big, `${small[0]} × ${k} = ${big[0]} y ${small[1]} × ${k} = ${big[1]}: ${fr(small)} = ${fr(big)}.`, undefined, "multiplicar", [[small[0] + k, small[1] + k], [big[0], small[1]], [small[0], big[1]]]);
  return fracChoice(r, `Divide el numerador y el denominador de ${fr(big)} entre ${k}. ¿Qué fracción equivalente obtienes?`, small, `${big[0]} ÷ ${k} = ${small[0]} y ${big[1]} ÷ ${k} = ${small[1]}: ${fr(big)} = ${fr(small)}.`, undefined, "dividir", [[Math.max(1, big[0] - k), Math.max(2, big[1] - k)], [big[0], small[1]], [small[0], big[1]]]);
}

// Identificar fracciones equivalentes.
export function identifyEquivalent(r: Rng): Question {
  const [small, big] = equivalentPair(r, 8, 5);
  if (r.chance(0.5)) {
    const yes = r.chance(0.5);
    const other: Frac = yes ? big : [big[0] + r.pick([-1, 1]), big[1]];
    const [a, b] = r.chance(0.5) ? [small, other] : [other, small];
    return yesNo(`¿${fr(a)} y ${fr(b)} son equivalentes?`, same(a, b), same(a, b) ? `Sí: se multiplica (o divide) el numerador y el denominador por el mismo número.` : `No: ${fr(small)} equivale a ${fr(big)}, no a ${fr(other)}.`);
  }
  const good: Frac[] = r.shuffle([2, 3, 4, 5, 6]).slice(0, r.int(1, 3)).map((k): Frac => [small[0] * k, small[1] * k]);
  const bad: Frac[] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 5 - good.length).map((k): Frac => [small[0] * k + r.pick([-1, 1]), small[1] * k]);
  const options = r.shuffle([...good, ...bad.filter((b) => b[0] > 0 && !same(b, small))]).map(fr);
  return multiQ(`Selecciona todas las fracciones equivalentes a ${fr(small)}.`, [...new Set(options)], [...new Set(good.map(fr))], `Son equivalentes las que salen de multiplicar el numerador y el denominador de ${fr(small)} por un mismo número.`, undefined, "seleccionar");
}

// Fracciones equivalentes, hallar el numerador o el denominador que falta.
export function equivalentMissing(r: Rng): Question {
  const [small, big, k] = equivalentPair(r, 12, 9);
  const form = r.int(0, 3);
  const why = `Se ${form < 2 ? "multiplica" : "divide"} por ${k} arriba y abajo: ${fr(small)} = ${fr(big)}.`;
  if (form === 0) return numQ(big[0], "¿Qué número falta?", `${fr(small)} = ?/${big[1]}`, why, "numerador");
  if (form === 1) return numQ(big[1], "¿Qué número falta?", `${fr(small)} = ${big[0]}/?`, why, "denominador");
  if (form === 2) return numQ(small[0], "¿Qué número falta?", `${fr(big)} = ?/${small[1]}`, why, "numerador");
  return numQ(small[1], "¿Qué número falta?", `${fr(big)} = ${small[0]}/?`, why, "denominador");
}

// Fracciones con denominadores 10 y 100.
export function tenthsHundredths(r: Rng): Question {
  const t = r.int(1, 9);
  const form = r.int(0, 2);
  if (form === 0) return numQ(t * 10, "¿Qué número falta?", `${t}/10 = ?/100`, `Se multiplica por 10 arriba y abajo: ${t}/10 = ${t * 10}/100.`, "a-centesimos");
  if (form === 1) return numQ(t, "¿Qué número falta?", `${t * 10}/100 = ?/10`, `Se divide entre 10 arriba y abajo: ${t * 10}/100 = ${t}/10.`, "a-decimos");
  const h = r.int(1, 9);
  return numQ(t * 10 + h, "¿Qué número falta?", `${t}/10 + ${h}/100 = ?/100`, `${t}/10 = ${t * 10}/100; ${t * 10}/100 + ${h}/100 = ${t * 10 + h}/100.`, "sumar");
}

// ---------------------------------------------------------------------------
// Números mixtos

function mixedNumber(r: Rng, dens = [2, 3, 4, 5, 6, 8], maxWhole = 4): Frac {
  const d = r.pick(dens);
  return [r.int(1, maxWhole) * d + r.int(1, d - 1), d];
}
const bars = ([n, d]: Frac): Visual => ({ kind: "fractionPair", hideLabels: true, items: Array.from({ length: Math.ceil(n / d) }, (_, i) => ({ parts: d, shaded: Math.min(d, n - i * d) })) });

// Identificar números mixtos.
export function identifyMixed(r: Rng): Question {
  const f = mixedNumber(r, [2, 3, 4, 5, 6, 8], 3);
  const [n, d] = f;
  const w = Math.floor(n / d);
  const rest = n % d;
  return choiceQ(r, "Cada barra es un entero. ¿Qué número mixto está sombreado?", m(f), [`${w + 1} ${rest}/${d}`, `${w} ${d - rest}/${d}`, `${rest} ${w}/${d}`, `${w} ${rest}/${d + 1}`, `${w - 1 || w + 2} ${rest}/${d}`].filter((x) => x !== m(f)), `Hay ${w} ${w === 1 ? "barra completa" : "barras completas"} y ${rest}/${d} de otra: ${m(f)}.`, bars(f));
}

// Fracciones y números mixtos con denominadores 10 y 100.
export function mixedTenHundred(r: Rng): Question {
  const d = r.pick([10, 100]);
  const w = r.int(1, 9);
  const rest = r.int(1, d - 1);
  const n = w * d + rest;
  if (r.chance(0.5)) return numQ(n, "Escribe el número mixto como fracción. ¿Qué numerador falta?", `${w} ${rest}/${d} = ?/${d}`, `${w} enteros son ${w * d}/${d}; ${w * d} + ${rest} = ${n}.`, "a-fraccion");
  return choiceQ(r, `¿Qué número mixto es igual a ${n}/${d}?`, `${w} ${rest}/${d}`, [`${rest} ${w}/${d}`, `${w + 1} ${rest}/${d}`, `${w} ${rest}/${d === 10 ? 100 : 10}`, `${w * 10} ${rest}/${d}`], `${n} ÷ ${d} = ${w} y sobran ${rest}: ${w} ${rest}/${d}.`, undefined, "a-mixto");
}

// Convertir entre números mixtos y fracciones impropias.
export function convertMixed(r: Rng, direction: "toImproper" | "toMixed" | "both"): Question {
  const dir = direction === "both" ? r.pick(["toImproper", "toMixed"] as const) : direction;
  const f = mixedNumber(r, [2, 3, 4, 5, 6, 8, 10], 6);
  const [n, d] = f;
  const w = Math.floor(n / d);
  const rest = n % d;
  if (dir === "toImproper") return fracChoice(r, `Convierte ${m(f)} en fracción impropia.`, f, `${w} × ${d} + ${rest} = ${n}: ${m(f)} = ${n}/${d}.`, undefined, "a-impropia", [[w * rest + d, d], [w + rest, d], [w * d, d], [n, rest]]);
  return choiceQ(r, `Convierte ${n}/${d} en número mixto.`, m(f), [`${w + 1} ${rest}/${d}`, `${rest} ${w}/${d}`, `${w} ${d - rest}/${d}`, `${w - 1 || w + 2} ${rest}/${d}`, `${w} ${rest}/${n}`].filter((x) => x !== m(f)), `${n} ÷ ${d} = ${w} y sobran ${rest}: ${m(f)}.`, undefined, "a-mixto");
}

// ---------------------------------------------------------------------------
// Comparar y ordenar

function likePair(r: Rng): [Frac, Frac, string] {
  if (r.chance(0.5)) {
    const d = r.pick(DENS.filter((x) => x > 2));
    return [[r.int(1, d - 1), d], [r.int(1, d - 1), d], "Con el mismo denominador, es mayor la que tiene más partes"];
  }
  const [d1, d2] = r.shuffle(DENS).slice(0, 2);
  const n = r.int(1, Math.min(d1, d2) - 1);
  return [[n, d1], [n, d2], "Con el mismo numerador, es mayor la de partes más grandes (denominador menor)"];
}

// Comparar fracciones con numeradores o denominadores iguales, usando modelos.
export function compareLikeModels(r: Rng): Question {
  const [a, b, why] = likePair(r);
  const s = sym(fcmp(a, b), 0);
  return fixedQ(`Mira las barras y elige el símbolo: ${fr(a)} ? ${fr(b)}`, SYMBOLS, s, `${why}: ${fr(a)} ${s} ${fr(b)}.`, { kind: "fractionPair", items: [{ parts: a[1], shaded: a[0] }, { parts: b[1], shaded: b[0] }], showAll: true }, s);
}

// Fracciones de referencia (0, 1/2 y 1).
export function benchmarkFraction(r: Rng): Question {
  for (;;) {
    const d = r.pick([6, 8, 10, 12, 16, 20]);
    const n = r.int(1, d - 1);
    // Distancias a 0, 1/2 y 1 (en partes de 2d).
    const dist = [2 * n, Math.abs(2 * n - d), 2 * (d - n)];
    const best = Math.min(...dist);
    if (dist.filter((x) => x === best).length > 1) continue;
    const options = ["0", "1/2", "1"];
    return fixedQ(`¿De qué número está más cerca ${n}/${d}?`, options, options[dist.indexOf(best)], `La mitad de ${d} es ${d / 2}. ${n}/${d} está más cerca de ${options[dist.indexOf(best)]}.`, { kind: "fractionLine", parts: d, marked: n }, options[dist.indexOf(best)]);
  }
}

// Hallar el numerador o el denominador que hace verdadera la comparación.
export function compareMissing(r: Rng, benchmark: boolean): Question {
  for (;;) {
    const d = r.pick([4, 6, 8, 10, 12]);
    const ref: Frac = benchmark ? r.pick<Frac>([[1, 2], [1, 2], [1, 1]]) : proper(r);
    const greater = r.chance(0.5);
    const missingDen = !benchmark && r.chance(0.4);
    const candidates: Frac[] = missingDen ? [2, 3, 4, 5, 6, 8, 10, 12].map((x): Frac => [ref[0], x]) : Array.from({ length: benchmark ? d + 3 : d - 1 }, (_, i): Frac => [i + 1, benchmark ? d : ref[1]]);
    const ok = (c: Frac) => (greater ? fcmp(c, ref) > 0 : fcmp(c, ref) < 0);
    const good = candidates.filter(ok);
    const bad = candidates.filter((c) => !ok(c));
    if (good.length === 0 || bad.length < 3) continue;
    const answer = r.pick(good);
    const wrong = r.shuffle(bad).slice(0, 3);
    const value = (c: Frac) => String(missingDen ? c[1] : c[0]);
    const shownDen = benchmark ? d : ref[1];
    const text = missingDen ? `${ref[0]}/?  ${greater ? ">" : "<"}  ${fr(ref)}` : `?/${shownDen}  ${greater ? ">" : "<"}  ${benchmark && ref[1] === 1 ? "1" : fr(ref)}`;
    return choiceQ(r, `¿Qué número puede ir en lugar de «?» para que la comparación sea verdadera?`, value(answer), wrong.map(value), `${fr(answer)} ${greater ? ">" : "<"} ${ref[1] === 1 ? "1" : fr(ref)}.`, text, missingDen ? "denominador" : "numerador");
  }
}

const RECIPE_ITEMS = ["azúcar", "harina", "leche", "avena", "aceite", "arroz"];
// Unidad con la que se mide cada ingrediente (además de la taza).
const RECIPE_UNIT: Record<string, string> = { azúcar: "kilo", harina: "kilo", leche: "litro", avena: "taza", aceite: "litro", arroz: "kilo" };

// Comparar fracciones en recetas.
export function compareRecipes(r: Rng): Question {
  for (;;) {
    const a = proper(r, [2, 3, 4, 8]);
    const b = proper(r, [2, 3, 4, 8]);
    if (fcmp(a, b) === 0) continue;
    const item = r.pick(RECIPE_ITEMS);
    const more = r.chance(0.5);
    const answer = (fcmp(a, b) > 0) === more ? "La receta A" : "La receta B";
    return fixedQ(`La receta A lleva ${fr(a)} de taza de ${item} y la receta B lleva ${fr(b)} de taza. ¿Cuál lleva ${more ? "más" : "menos"} ${item}?`, ["La receta A", "La receta B"], answer, `${fr(a)} ${sym(fcmp(a, b), 0)} ${fr(b)}.`, undefined, more ? "mas" : "menos");
  }
}

// Hallar fracciones menores o mayores.
export function findSmallerLarger(r: Rng): Question {
  for (;;) {
    const ref = proper(r);
    const greater = r.chance(0.5);
    const pool = Array.from({ length: 12 }, () => proper(r)).filter((c) => fcmp(c, ref) !== 0);
    const good = pool.filter((c) => (fcmp(c, ref) > 0) === greater);
    const bad = [...new Map(pool.filter((c) => (fcmp(c, ref) > 0) !== greater).map((c) => [fr(c), c])).values()];
    if (good.length === 0 || bad.length < 3) continue;
    return choiceQ(r, `¿Qué fracción es ${greater ? "mayor" : "menor"} que ${fr(ref)}?`, fr(good[0]), bad.slice(0, 3).map(fr), `${fr(good[0])} ${greater ? ">" : "<"} ${fr(ref)}.`, undefined, greater ? "mayor" : "menor");
  }
}

// Comparar números mixtos.
export function compareMixed(r: Rng): Question {
  const a = mixedNumber(r);
  const b: Frac = r.chance(0.5) ? [Math.floor(a[0] / a[1]) * a[1] + r.int(1, a[1] - 1), a[1]] : mixedNumber(r);
  const s = sym(fcmp(a, b), 0);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, s === "=" ? "Los dos números son iguales." : `Primero comparamos los enteros; si son iguales, las fracciones: ${m(a)} ${s} ${m(b)}.`, `${m(a)}  ?  ${m(b)}`, s);
}

// ---------------------------------------------------------------------------
// Descomponer

// Descomponer en fracciones unitarias.
export function decomposeUnit(r: Rng, withModel: boolean): Question {
  const d = r.pick([3, 4, 5, 6, 8]);
  const n = r.int(2, d - 1);
  const visual: Visual | undefined = withModel ? { kind: "fraction", shape: "bar", parts: d, shaded: n } : undefined;
  if (withModel || r.chance(0.5)) return numQ(n, `¿Cuántas veces hay que sumar 1/${d} para formar ${n}/${d}?`, visual ?? `${n}/${d} = 1/${d} + 1/${d} + ...`, `${n}/${d} = ${Array.from({ length: n }, () => `1/${d}`).join(" + ")}: son ${n} veces.`, "contar");
  const unit = (k: number, den: number) => Array.from({ length: k }, () => `1/${den}`).join(" + ");
  return choiceQ(r, `¿Cómo se descompone ${n}/${d} en fracciones unitarias?`, unit(n, d), [unit(n + 1, d), unit(n - 1, d), unit(d, n), unit(n, d + 1)].filter((x) => x !== "" && x !== unit(n, d)), `Se suma ${n} veces la fracción 1/${d}.`, undefined, "elegir");
}

// Descomponer fracciones.
export function decompose(r: Rng): Question {
  const d = r.pick([4, 5, 6, 8, 10, 12]);
  const n = r.int(3, d - 1);
  const a = r.int(1, n - 2);
  const b = r.int(1, n - a - 1);
  const c = n - a - b;
  if (r.chance(0.5)) return numQ(n - a, "¿Qué numerador falta?", `${n}/${d} = ${a}/${d} + ?/${d}`, `${a} + ${n - a} = ${n}.`, "dos-partes");
  return numQ(c, "¿Qué numerador falta?", `${n}/${d} = ${a}/${d} + ${b}/${d} + ?/${d}`, `${a} + ${b} + ${c} = ${n}.`, "tres-partes");
}

// Descomponer fracciones de varias formas.
export function decomposeWays(r: Rng): Question {
  const d = r.pick([5, 6, 8, 10]);
  const n = r.int(4, d - 1);
  const term = (xs: number[]) => xs.map((x) => `${x}/${d}`).join(" + ");
  const split = (total: number): number[] => {
    const a = r.int(1, total - 1);
    return r.chance(0.4) && total - a > 1 ? [a, 1, total - a - 1] : [a, total - a];
  };
  const good = new Set<string>();
  const bad = new Set<string>();
  for (let i = 0; i < 20 && good.size < r.int(2, 3); i++) good.add(term(split(n)));
  for (let i = 0; i < 20 && bad.size < 5 - good.size; i++) bad.add(term(split(n + r.pick([-1, 1]))));
  return multiQ(`Selecciona todas las sumas iguales a ${n}/${d}.`, r.shuffle([...good, ...bad]), [...good], `Los numeradores deben sumar ${n}.`);
}

// ---------------------------------------------------------------------------
// Sumar y restar con el mismo denominador

function likeOperands(r: Rng, op: "+" | "−", dens = [3, 4, 5, 6, 8, 10, 12]): [Frac, Frac, Frac] {
  const d = r.pick(dens);
  if (op === "+") {
    const a = r.int(1, d - 2);
    const b = r.int(1, d - 1 - a);
    return [[a, d], [b, d], [a + b, d]];
  }
  const a = r.int(2, d - 1);
  const b = r.int(1, a - 1);
  return [[a, d], [b, d], [a - b, d]];
}
const pickOp = (r: Rng, op: "+" | "−" | "mixed") => (op === "mixed" ? r.pick(["+", "−"] as const) : op);

// Sumar y restar con modelos de área o de tiras.
export function addSubModel(r: Rng, op: "+" | "−", model: "area" | "strip"): Question {
  const [a, b, c] = likeOperands(r, op, model === "area" ? [4, 6, 8] : [3, 4, 5, 6, 8, 10]);
  const visual: Visual = model === "strip" ? { kind: "fractionPair", items: [{ parts: a[1], shaded: a[0] }, { parts: b[1], shaded: b[0] }], showAll: true } : { kind: "fraction", shape: "area", parts: a[1], shaded: a[0] };
  const prompt = model === "strip" ? `Usa las tiras para ${op === "+" ? "sumar" : "restar"}: ${fr(a)} ${op} ${fr(b)}` : op === "+" ? `El modelo muestra ${fr(a)}. Si ${b[0] === 1 ? "se sombrea 1 parte" : `se sombrean ${b[0]} partes`} más, ¿qué fracción queda sombreada? (${fr(a)} + ${fr(b)})` : `El modelo muestra ${fr(a)}. Si ${b[0] === 1 ? "se borra 1 parte sombreada" : `se borran ${b[0]} partes sombreadas`}, ¿qué fracción queda? (${fr(a)} − ${fr(b)})`;
  return fracChoice(r, prompt, c, `${a[0]} ${op} ${b[0]} = ${c[0]}; el denominador no cambia: ${fr(c)}.`, visual, op === "+" ? "suma" : "resta", [[op === "+" ? a[0] + b[0] : a[0] - b[0], a[1] * 2]]);
}

type Ctx = "plain" | "word" | "recipe";
// «3/4 de taza», pero «2 1/4 tazas».
const measure = (amount: string, unit: string) => (amount.includes(" ") || !amount.includes("/") ? `${amount} ${unit}s` : `${amount} de ${unit}`);

// Enunciado para sumar o restar dos cantidades (fracciones o mixtos).
function fracStory(r: Rng, op: "+" | "−", a: string, b: string, ctx: Ctx): string {
  const name = r.pick(NAMES);
  if (ctx === "recipe") {
    const item = r.pick(RECIPE_ITEMS);
    const unit = r.chance(0.5) ? "taza" : RECIPE_UNIT[item];
    return op === "+" ? `Una receta lleva ${measure(a, unit)} de ${item} para la masa y ${measure(b, unit)} para el relleno. ¿Qué cantidad de ${item} lleva en total?` : `${name} tenía ${measure(a, unit)} de ${item} y usó ${measure(b, unit)} en una receta. ¿Qué cantidad le queda?`;
  }
  return op === "+"
    ? r.pick([`${name} caminó ${a} km en la mañana y ${b} km en la tarde. ¿Cuántos kilómetros caminó en total?`, ...(a.includes(" ") || b.includes(" ") ? [] : [`${name} pintó ${a} de una pared el sábado y ${b} el domingo. ¿Qué parte de la pared pintó en total?`]), `Una jarra tenía ${a} litros de jugo y se le agregaron ${b} litros. ¿Cuántos litros tiene ahora?`])
    : r.pick([`${name} tenía ${a} m de cinta y usó ${b} m. ¿Cuántos metros le quedan?`, `Una botella tenía ${a} litros de agua y ${name} tomó ${b} litros. ¿Cuántos litros quedan?`, `${name} debe recorrer ${a} km y ya recorrió ${b} km. ¿Cuántos kilómetros le faltan?`]);
}

// Problemas de suma y resta con el mismo denominador.
export function likeFractionProblem(r: Rng, ctx: Ctx): Question {
  const op = r.pick(["+", "−"] as const);
  const [a, b, c] = likeOperands(r, op, ctx === "recipe" ? [3, 4, 8] : undefined);
  return fracChoice(r, fracStory(r, op, fr(a), fr(b), ctx), c, `${fr(a)} ${op} ${fr(b)} = ${fr(c)}.`, undefined, op === "+" ? "suma" : "resta", [[op === "+" ? a[0] + b[0] : a[0] - b[0], a[1] * 2], op === "+" ? [Math.abs(a[0] - b[0]) || 1, a[1]] : [a[0] + b[0], a[1]]]);
}

// Sumar tres o más fracciones con el mismo denominador.
export function addSeveralFractions(r: Rng): Question {
  const d = r.pick([6, 8, 10, 12]);
  const count = r.int(3, 4);
  const xs = Array.from({ length: count }, () => r.int(1, Math.floor((d + 4) / count)));
  const total = xs.reduce((a, b) => a + b, 0);
  return fracChoice(r, "Resuelve la suma.", [total, d], `${xs.join(" + ")} = ${total}; el denominador no cambia: ${total}/${d}${total > d ? ` = ${mixed(total, d)}` : ""}.`, `${xs.map((x) => `${x}/${d}`).join(" + ")} = ?`, `${count}-sumandos`, [[total, d * count]]);
}

// Problemas de varios pasos con el mismo denominador.
export function likeMultiStep(r: Rng): Question {
  const d = r.pick([6, 8, 10, 12]);
  const name = r.pick(NAMES);
  const a = r.int(1, d - 3);
  const b = r.int(1, d - a - 2);
  if (r.chance(0.5)) {
    const rest = d - a - b;
    return fracChoice(r, `${name} leyó ${a}/${d} de un libro el lunes y ${b}/${d} el martes. ¿Qué fracción del libro le falta leer?`, [rest, d], `${a}/${d} + ${b}/${d} = ${a + b}/${d}; ${d}/${d} − ${a + b}/${d} = ${rest}/${d}.`, undefined, "falta", [[a + b, d]]);
  }
  const start = a + b + r.int(1, d - a - b);
  const left = start - a - b;
  return fracChoice(r, `Un tanque tenía ${start}/${d} de su capacidad. Se usaron ${a}/${d} para regar y ${b}/${d} para lavar. ¿Qué fracción queda?`, [left, d], `${start}/${d} − ${a}/${d} − ${b}/${d} = ${left}/${d}.`, undefined, "queda", [[start - a, d], [a + b, d]]);
}

// Comparar sumas y restas de fracciones con el mismo denominador.
export function compareSumsDiffs(r: Rng): Question {
  const d = r.pick([5, 6, 8, 10, 12]);
  const side = (): [string, number] => {
    const op = r.pick(["+", "−"] as const);
    const [a, b, c] = likeOperands(r, op, [d]);
    return [`${fr(a)} ${op} ${fr(b)}`, c[0]];
  };
  const [left, lv] = side();
  const [right, rv] = r.chance(0.4) ? [`${r.int(1, d - 1)}/${d}`, 0] : side();
  const rvFinal = right.includes(" ") ? rv : Number(right.split("/")[0]);
  const s = sym(lv, rvFinal);
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${left} = ${lv}/${d}${right.includes(" ") ? ` y ${right} = ${rvFinal}/${d}` : ""}.`, `${left}  ?  ${right}`, s);
}

// Sumar y restar números mixtos con el mismo denominador.
// `regroup`: false = sin reagrupar; true = puede necesitar reagrupar.
export function mixedAddSub(r: Rng, op: "+" | "−" | "mixed", regroup: boolean, ctx: Ctx = "plain"): Question {
  for (;;) {
    const o = pickOp(r, op);
    const d = r.pick(ctx === "recipe" ? [2, 3, 4, 8] : [3, 4, 5, 6, 8, 10]);
    const wa = r.int(1, 6);
    const wb = r.int(1, o === "−" ? wa : 5);
    const fa = r.int(1, d - 1);
    const fb = r.int(regroup && r.chance(0.3) ? 0 : 1, d - 1);
    const a: Frac = [wa * d + fa, d];
    const b: Frac = [wb * d + fb, d];
    const carries = o === "+" ? fa + fb >= d : fa < fb;
    if (!regroup && carries) continue;
    if (o === "−" && a[0] <= b[0]) continue;
    const c: Frac = [o === "+" ? a[0] + b[0] : a[0] - b[0], d];
    const wholes = o === "+" ? wa + wb : wa - wb;
    const naive = o === "+" ? fa + fb : Math.abs(fa - fb);
    const extra: Frac[] = [[(wholes + 1) * d + (naive % d), d], [Math.max(1, wholes - 1) * d + (naive % d) + 1, d], [wholes * d + ((naive + 1) % d || 1), d]];
    const why = `Enteros: ${wa} ${o} ${wb}; fracciones: ${fa}/${d} ${o} ${fb}/${d}. Resultado: ${m(c)}.`;
    const text = `${m(a)} ${o} ${m(b)}`;
    if (ctx === "plain") return fracChoice(r, "Resuelve.", c, why, `${text} = ?`, carries ? "reagrupando" : "sin-reagrupar", extra, m);
    return fracChoice(r, fracStory(r, o, m(a), m(b), ctx), c, `${text} = ${m(c)}. ${why}`, undefined, o === "+" ? "suma" : "resta", extra, m);
  }
}

// Varios pasos con fracciones y números mixtos.
export function mixedMultiStep(r: Rng): Question {
  const d = r.pick([4, 5, 6, 8]);
  const name = r.pick(NAMES);
  const a: Frac = [r.int(1, 3) * d + r.int(1, d - 1), d];
  const b: Frac = [r.int(1, 2) * d + r.int(1, d - 1), d];
  const c: Frac = [r.int(1, Math.min(a[0] + b[0] - 1, 2 * d)), d];
  const total: Frac = [a[0] + b[0] - c[0], d];
  return fracChoice(r, `${name} compró ${m(a)} kg de manzanas y ${m(b)} kg de peras. Usó ${m(c)} kg de fruta en una ensalada. ¿Cuántos kilos de fruta le quedan?`, total, `${m(a)} + ${m(b)} = ${mixed(a[0] + b[0], d)}; ${mixed(a[0] + b[0], d)} − ${m(c)} = ${m(total)}.`, undefined, undefined, [[a[0] + b[0], d], [a[0] + b[0] + c[0], d]], m);
}

// ---------------------------------------------------------------------------
// Sumar y restar con distinto denominador

// Sumar fracciones con denominadores 10 y 100.
export function addTenHundred(r: Rng): Question {
  const t = r.int(1, 8);
  const h = r.int(1, 99 - t * 10);
  const [x, y] = r.chance(0.5) ? [`${t}/10`, `${h}/100`] : [`${h}/100`, `${t}/10`];
  return fracChoice(r, "Resuelve la suma.", [t * 10 + h, 100], `${t}/10 = ${t * 10}/100; ${t * 10}/100 + ${h}/100 = ${t * 10 + h}/100.`, `${x} + ${y} = ?`, undefined, [[t + h, 100], [t + h, 110], [t * 10 + h, 10], [t + h * 10 > 0 ? t + h : 1, 10]]);
}

// Identificar la expresión con una suma dada (denominadores 10 y 100).
export function sumTenHundredExpression(r: Rng): Question {
  const t = r.int(1, 8);
  const h = r.int(1, 9);
  const target = t * 10 + h;
  const answer = `${t}/10 + ${h}/100`;
  const wrong = [`${h}/10 + ${t}/100`, `${t}/100 + ${h}/100`, `${t}/10 + ${h}/10`, `${t + 1}/10 + ${h}/100`, `${t}/10 + ${h + 1}/100`];
  return choiceQ(r, `¿Qué suma es igual a ${target}/100?`, answer, t === h ? wrong.slice(1) : wrong, `${t}/10 = ${t * 10}/100; ${t * 10}/100 + ${h}/100 = ${target}/100.`);
}

// Dos fracciones propias cuyos denominadores son uno múltiplo del otro (o primos entre sí pequeños).
function unlikeOperands(r: Rng, op: "+" | "−", nested: boolean): [Frac, Frac, Frac] {
  for (;;) {
    const [d1, d2] = nested ? r.pick<[number, number]>([[2, 4], [2, 6], [2, 8], [3, 6], [4, 8], [5, 10], [2, 10], [3, 12], [4, 12], [6, 12]]) : r.pick<[number, number]>([[2, 3], [2, 5], [3, 4], [2, 4], [3, 6], [4, 8], [5, 10], [3, 5], [4, 6]]);
    let a: Frac = [r.int(1, d1 - 1), d1];
    let b: Frac = [r.int(1, d2 - 1), d2];
    if (r.chance(0.5)) [a, b] = [b, a];
    const common = (a[1] * b[1]) / gcd(a[1], b[1]);
    const x = a[0] * (common / a[1]);
    const y = b[0] * (common / b[1]);
    if (op === "−" && x <= y) continue;
    const c: Frac = [op === "+" ? x + y : x - y, common];
    if (c[0] >= common) continue;
    return [a, b, c];
  }
}

// Sumar y restar fracciones con distinto denominador.
export function unlikeAddSub(r: Rng, op: "+" | "−" | "mixed", mode: "model" | "plain" | "word"): Question {
  const o = pickOp(r, op);
  const [a, b, c] = unlikeOperands(r, o, mode === "model");
  const common = c[1];
  const answer = simp(c);
  const why = `Con denominador ${common}: ${a[0] * (common / a[1])}/${common} ${o} ${b[0] * (common / b[1])}/${common} = ${fr(c)}${fr(answer) !== fr(c) ? ` = ${fr(answer)}` : ""}.`;
  const extra: Frac[] = [[o === "+" ? a[0] + b[0] : Math.abs(a[0] - b[0]) || 1, o === "+" ? a[1] + b[1] : Math.abs(a[1] - b[1]) || common], [o === "+" ? a[0] + b[0] : Math.abs(a[0] - b[0]) || 1, common], [c[0] + 1, common]];
  const tag = o === "+" ? "suma" : "resta";
  if (mode === "word") return fracChoice(r, fracStory(r, o, fr(a), fr(b), "plain"), answer, why, undefined, tag, extra);
  if (mode === "model") return fracChoice(r, `Usa las tiras para ${o === "+" ? "sumar" : "restar"}: ${fr(a)} ${o} ${fr(b)}`, answer, why, { kind: "fractionPair", items: [{ parts: a[1], shaded: a[0] }, { parts: b[1], shaded: b[0] }], showAll: true }, tag, extra);
  return fracChoice(r, "Resuelve. Escribe el resultado en su mínima expresión.", answer, why, `${fr(a)} ${o} ${fr(b)} = ?`, tag, extra);
}

// ---------------------------------------------------------------------------
// Multiplicar fracciones por números naturales

export type MultMode = "model" | "line" | "equation" | "missing" | "sort" | "plain" | "word" | "recipe";

const SORT = ["Menor que 1", "Igual a 1", "Mayor que 1"];

// k × n/d. `unit`: solo fracciones unitarias (n = 1).
export function multFraction(r: Rng, unit: boolean, mode: MultMode): Question {
  const dens = mode === "model" ? [2, 3, 4, 5, 6] : mode === "line" ? [2, 3, 4, 5] : mode === "recipe" ? [2, 3, 4, 8] : [2, 3, 4, 5, 6, 8, 10];
  const d = r.pick(unit ? dens : dens.filter((x) => x > 2));
  const n = unit ? 1 : r.int(2, Math.max(2, d - 1));
  const k = r.int(2, mode === "model" ? 4 : mode === "line" ? Math.min(6, Math.floor((4 * d) / n)) : 9);
  const f = `${n}/${d}`;
  const p: Frac = [k * n, d];
  const why = `${k} × ${n} = ${k * n}; el denominador no cambia: ${k} × ${f} = ${fr(p)}${k * n >= d ? ` = ${m(p)}` : ""}.`;
  const tag = unit ? "unitaria" : "fraccion";
  const extra: Frac[] = [[n, d * k], [k * n, d * k], [k + n, d], [n, k + d]];
  if (mode === "sort") {
    // Se elige primero el resultado para que las tres opciones salgan parejas,
    // con fracciones pequeñas para que «menor que 1» no obligue a multiplicar por 1.
    const sd = r.pick(unit ? [4, 5, 6, 8, 10] : [6, 8, 10, 12]);
    const sn = unit ? 1 : sd === 6 ? 2 : r.pick([2, 3]);
    const want = r.int(0, 2);
    if (want === 1 && sd % sn !== 0) return multFraction(r, unit, mode);
    const kk = want === 1 ? sd / sn : want === 0 ? r.int(2, Math.ceil(sd / sn) - 1) : Math.floor(sd / sn) + r.int(1, 4);
    const answer = SORT[kk * sn < sd ? 0 : kk * sn === sd ? 1 : 2];
    return fixedQ(`¿El producto ${kk} × ${sn}/${sd} es menor que 1, igual a 1 o mayor que 1?`, SORT, answer, `${kk} × ${sn}/${sd} = ${kk * sn}/${sd}, que es ${answer.toLowerCase()}.`, undefined, answer);
  }
  if (mode === "equation") return numQ(k * n, "¿Qué numerador falta?", `${k} × ${f} = ?/${d}`, why, tag);
  if (mode === "missing") {
    const form = r.int(0, 1);
    return form === 0 ? numQ(k, "¿Qué número falta?", `${fr(p)} = ? × ${f}`, `${k} × ${n} = ${k * n}: ${fr(p)} = ${k} × ${f}.`, tag) : numQ(k * n, "¿Qué numerador falta?", `${k} × ${f} = ?/${d}`, why, tag);
  }
  if (mode === "model") return fracChoice(r, `Cada barra muestra ${f}. ¿Cuánto es ${k} × ${f}?`, p, why, { kind: "fractionPair", hideLabels: true, items: Array.from({ length: k }, () => ({ parts: d, shaded: n })) }, tag, extra);
  if (mode === "line") {
    const wholes = Math.max(1, Math.ceil((k * n) / d));
    return fracChoice(r, `En la recta se dieron ${k} saltos de ${f} desde 0. ¿Cuánto es ${k} × ${f}?`, p, why, { kind: "fractionLine", parts: d, wholes, marked: k * n }, tag, extra);
  }
  if (mode === "word" || mode === "recipe") {
    const name = r.pick(NAMES);
    const text =
      mode === "recipe"
        ? `Una receta lleva ${f} de taza de ${r.pick(RECIPE_ITEMS)}. ¿Cuántas tazas se necesitan para preparar ${k} veces la receta?`
        : r.pick([`${name} corre ${f} de kilómetro cada día. ¿Cuántos kilómetros corre en ${k} días?`, `Cada vaso tiene ${f} de litro de jugo. ¿Cuántos litros hay en ${k} vasos?`, `Cada cinta mide ${f} de metro. ¿Cuántos metros miden ${k} cintas?`, `${name} practica piano ${f} de hora cada día. ¿Cuántas horas practica en ${k} días?`]);
    return fracChoice(r, text, p, why, undefined, tag, extra, m);
  }
  return fracChoice(r, "Resuelve la multiplicación.", p, why, `${k} × ${f} = ?`, tag, extra);
}

// Multiplicar números mixtos por naturales.
export function multMixed(r: Rng, mode: "plain" | "word" | "recipe" | "multiStep"): Question {
  const d = r.pick(mode === "recipe" ? [2, 3, 4] : [2, 3, 4, 5, 6]);
  const w = r.int(1, 4);
  const n = r.int(1, d - 1);
  const k = r.int(2, 6);
  const a: Frac = [w * d + n, d];
  const p: Frac = [a[0] * k, d];
  const why = `${k} × ${w} = ${k * w} y ${k} × ${n}/${d} = ${mixed(k * n, d)}; en total ${m(p)}.`;
  const extra: Frac[] = [[k * w * d + n, d], [(k * w + 1) * d + n, d], [w * d + k * n, d]];
  const name = r.pick(NAMES);
  if (mode === "plain") return fracChoice(r, "Resuelve la multiplicación.", p, why, `${k} × ${m(a)} = ?`, undefined, extra, m);
  if (mode === "recipe") return fracChoice(r, `Una receta lleva ${m(a)} tazas de ${r.pick(RECIPE_ITEMS)}. ¿Cuántas tazas se necesitan para preparar ${k} veces la receta?`, p, why, undefined, undefined, extra, m);
  if (mode === "word") return fracChoice(r, r.pick([`${name} camina ${m(a)} km cada día. ¿Cuántos kilómetros camina en ${k} días?`, `Cada bolsa pesa ${m(a)} kg. ¿Cuánto pesan ${k} bolsas?`, `Cada tabla mide ${m(a)} m. ¿Cuántos metros miden ${k} tablas?`]), p, why, undefined, undefined, extra, m);
  const used = r.int(1, p[0] - 1);
  const left: Frac = [p[0] - used, d];
  return fracChoice(r, `${name} compró ${k} bolsas de ${m(a)} kg de arroz y ya usó ${mixed(used, d)} kg. ¿Cuántos kilos le quedan?`, left, `${k} × ${m(a)} = ${m(p)}; ${m(p)} − ${mixed(used, d)} = ${m(left)}.`, undefined, undefined, [p, [p[0] + used, d]], m);
}

// Fracción de un número.
export function fractionOfNumber(r: Rng, mode: "model" | "plain" | "word"): Question {
  const d = r.pick(mode === "model" ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 8, 10]);
  const n = r.int(1, d - 1);
  const each = r.int(2, mode === "model" ? 9 : 12);
  const total = d * each;
  const why = `${total} ÷ ${d} = ${each}; ${each} × ${n} = ${each * n}.`;
  if (mode === "model") return numQ(each * n, `La tira muestra ${total} repartido en ${d} partes iguales. ¿Cuánto es ${n}/${d} de ${total}?`, { kind: "strip", total: String(total), bars: [{ parts: Array.from({ length: d }, (_, i) => ({ text: i < n ? String(each) : " ", w: 1 })) }] }, why);
  if (mode === "plain") return numQ(each * n, "Calcula.", `${n}/${d} de ${total} = ?`, why);
  const name = r.pick(NAMES);
  return numQ(each * n, r.pick([`${name} tiene ${total} figuritas y regala ${n}/${d} de ellas. ¿Cuántas figuritas regala?`, `En un salón hay ${total} alumnos y ${n}/${d} de ellos usan lentes. ¿Cuántos alumnos usan lentes?`, `Un libro tiene ${total} páginas y ${name} ya leyó ${n}/${d}. ¿Cuántas páginas leyó?`, `Una granja tiene ${total} animales y ${n}/${d} son gallinas. ¿Cuántas gallinas hay?`]), undefined, why);
}
