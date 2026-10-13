import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, d2, fixedQ, fmt, intQ, numQ, par, sg, soles, table, yesNo } from "../kit";
import { type P, type SF, absGcd, lin, nz, plane, plane1, pt, sfQ, sfshow } from "./util";

// Álgebra de 1.° de secundaria: proporcionalidad, porcentajes, expresiones,
// ecuaciones e inecuaciones de dos pasos, sucesiones, pendiente y rectas.

// ---------------------------------------------------------------------------
// Proporciones

// L.11: ¿las razones forman una proporción? (en una situación)
export function proportionWord(r: Rng): Question {
  const a = r.int(2, 6), b = r.int(2, 7), k = r.int(2, 6);
  const yes = r.chance(0.5);
  const c = a * k, d = yes ? b * k : b * k + r.pick([-2, -1, 1, 2]);
  const name = r.pick(NAMES);
  const cases = [
    `Una receta lleva ${a} tazas de arroz por cada ${b} tazas de agua. ${name} usa ${c} tazas de arroz y ${d} de agua. ¿Mantiene la proporción de la receta?`,
    `Una pintura se prepara con ${a} partes de azul por cada ${b} de blanco. ${name} mezcla ${c} litros de azul con ${d} de blanco. ¿Mantiene la proporción?`,
    `En un mapa, ${a} cm representan ${b} km. ${name} dice que ${c} cm representan ${d} km. ¿Es correcto?`,
  ];
  return yesNo(r.pick(cases), yes, `${a}/${b} y ${c}/${d}: los productos cruzados son ${a * d} y ${b * c}; ${yes ? "son iguales, forman una proporción" : "no son iguales"}.`);
}

// L.13: resolver proporciones en problemas.
export function proportionProblem(r: Rng): Question {
  const a = r.int(2, 9), b = r.int(2, 12), k = r.int(2, 9);
  const cases: [string, string][] = [
    [`En un mapa, ${a} cm representan ${b} km. ¿Cuántos kilómetros representan ${a * k} cm?`, "km"],
    [`Una máquina llena ${b} botellas en ${a} minutos. Al mismo ritmo, ¿cuántas botellas llena en ${a * k} minutos?`, "botellas"],
    [`Por ${a} kilos de papa se pagan ${b} soles. ¿Cuántos soles se pagan por ${a * k} kilos?`, "soles"],
    [`${a} obreros iguales pintan ${b} metros de pared en una hora. ¿Cuántos metros pintan ${a * k} obreros en una hora?`, "metros"],
  ];
  const [text, unit] = r.pick(cases);
  return numQ(b * k, text, undefined, `${a}/${b} = ${a * k}/x. Como ${a} × ${k} = ${a * k}, también ${b} × ${k} = ${b * k} ${unit}.`);
}

// L.14: estimar el tamaño de una población con proporciones (captura y recaptura).
export function populationEstimate(r: Rng): Question {
  const m = r.int(2, 8), a = r.int(3, 12), n = r.int(4, 12) * 5;
  const marked = m * a; // marcados al inicio
  const [animal, place] = r.pick([["peces", "una laguna"], ["tortugas", "una playa"], ["vicuñas", "una reserva"], ["aves", "un humedal"]]);
  return numQ(a * n, `Unos biólogos pusieron una marca a ${marked} ${animal} de ${place} y luego les dieron libertad. Días después capturaron ${n} ${animal} y ${m} tenían la marca. Según esta muestra, ¿cuál es la población estimada de ${animal}?`, undefined, `marcados/total = ${m}/${n}: ${marked}/x = ${m}/${n}, así que x = ${marked} × ${n} ÷ ${m} = ${fmt(a * n)}.`);
}

type PropMode = "kTable" | "eqTable" | "kGraph" | "eqGraph" | "identifyEq" | "solve";
// N: relaciones proporcionales (constante, ecuación, identificar, resolver).
export function proportional(r: Rng, mode: PropMode): Question {
  if (mode === "identifyEq") {
    const k = r.int(2, 9), b = r.int(1, 9);
    const options: [string, boolean][] = [[`y = ${k}x`, true], [`y = x ÷ ${k}`, true], [`y = ${k}x + ${b}`, false], [`y = x + ${b}`, false], [`y = ${k}x − ${b}`, false], [`y = ${k}x²`, false]];
    const [eq, yes] = r.pick(options);
    return yesNo(`¿La ecuación ${eq} representa una relación proporcional?`, yes, yes ? "Sí: tiene la forma y = kx (una constante por x), y pasa por el origen." : "No: una relación proporcional tiene la forma y = kx, sin sumar ni restar nada y sin potencias.");
  }
  if (mode === "solve") {
    const k = r.int(2, 12), x1 = r.int(2, 9), x2 = r.int(10, 25);
    if (r.chance(0.5)) return numQ(k * x2, `y es proporcional a x. Cuando x = ${x1}, y = ${k * x1}. ¿Cuánto vale y cuando x = ${x2}?`, undefined, `La constante es ${k * x1} ÷ ${x1} = ${k}: y = ${k}x. Entonces y = ${k} × ${x2} = ${k * x2}.`, "valor");
    const [thing, unit] = r.pick([["cuadernos", "soles"], ["horas de trabajo", "soles"], ["litros de gasolina", "kilómetros"], ["cajas", "kilos"]]);
    return choiceQ(r, `${x1} ${thing} equivalen a ${k * x1} ${unit}, y la relación es proporcional. ¿Qué ecuación da los ${unit} (y) para x ${thing}?`, `y = ${k}x`, [`y = ${x1}x`, `y = x + ${k}`, `y = ${k * x1}x`, `x = ${k}y`], `Constante: ${k * x1} ÷ ${x1} = ${k}. La ecuación es y = ${k}x.`, undefined, "ecuacion");
  }
  const graph = mode === "kGraph" || mode === "eqGraph";
  const k = graph ? r.int(1, 4) : r.int(2, 12);
  const xs = graph ? [0, 1, 2, 3].filter((x) => k * x <= 12) : [1, 2, 3, 4, 5].map((x) => x * r.pick([1, 1, 2])).filter((x, i, all) => all.indexOf(x) === i).slice(0, 4).sort((p, q) => p - q);
  const pts = xs.map((x) => ({ x, y: k * x }));
  const visual: Visual = graph ? plane1(pts) : table(["x", "y"], pts.map((p) => [String(p.x), String(p.y)]));
  const sample = pts[pts.length - 1];
  if (mode === "kTable" || mode === "kGraph") {
    return numQ(k, graph ? "El gráfico muestra una relación proporcional. ¿Cuál es la constante de proporcionalidad?" : "La tabla muestra una relación proporcional. ¿Cuál es la constante de proporcionalidad?", visual, `En cada par, y ÷ x da lo mismo: ${sample.y} ÷ ${sample.x} = ${k}.`, "constante");
  }
  return choiceQ(r, graph ? "¿Qué ecuación corresponde al gráfico?" : "¿Qué ecuación corresponde a la tabla?", k === 1 ? "y = x" : `y = ${k}x`, [`y = x + ${k}`, `y = ${k + 1}x`, `x = ${k + 1}y`, `y = ${k + 2}x`], `y ÷ x siempre da ${k}: y = ${k === 1 ? "" : k}x.`, visual, "ecuacion");
}

// ---------------------------------------------------------------------------
// Porcentajes

const CHANGES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];

// O.10 – O.12: porcentaje de cambio (`original`: hallar la cantidad inicial).
export function percentChange(r: Rng, mode: "plain" | "word" | "original"): Question {
  const pct = r.pick(CHANGES);
  const up = r.chance(0.5);
  const old = r.pick([20, 40, 60, 80, 100, 120, 200, 240, 400, 500]);
  const now = old + ((up ? 1 : -1) * old * pct) / 100;
  const name = r.pick(NAMES);
  if (mode === "original") {
    const story = r.pick([`Después de ${up ? "un aumento" : "una rebaja"} del ${pct} %, un producto cuesta ${now} soles. ¿Cuánto costaba antes?`, `El número de socios de un club ${up ? "aumentó" : "disminuyó"} un ${pct} % y ahora son ${now}. ¿Cuántos eran antes?`]);
    return numQ(old, story, undefined, `Ahora es el ${up ? 100 + pct : 100 - pct} % de lo que era: ${now} ÷ ${d2(up ? 100 + pct : 100 - pct)} = ${old}.`, up ? "aumento" : "disminucion");
  }
  const text = mode === "plain"
    ? `Una cantidad pasó de ${old} a ${now}. ¿En qué porcentaje ${up ? "aumentó" : "disminuyó"}?`
    : r.pick([`${name} tenía ${old} kg de fruta para vender y ahora tiene ${now} kg. ¿En qué porcentaje ${up ? "aumentó" : "disminuyó"} la cantidad?`, `El precio de una casaca ${up ? "subió" : "bajó"} de ${old} a ${now} soles. ¿En qué porcentaje ${up ? "aumentó" : "disminuyó"}?`, `Un pueblo tenía ${fmt(old * 10)} habitantes y ahora tiene ${fmt(now * 10)}. ¿En qué porcentaje ${up ? "aumentó" : "disminuyó"} su población?`]);
  return numQ(pct, text, undefined, `Cambio ÷ cantidad inicial: ${Math.abs(now - old)} ÷ ${old} = ${d2(pct)} → ${pct} %.`, up ? "aumento" : "disminucion");
}

// O.13: error porcentual.
export function percentError(r: Rng): Question {
  const actual = r.pick([20, 25, 40, 50, 80, 100, 200, 250]);
  const pct = r.pick([4, 5, 8, 10, 12, 20, 25].filter((p) => (actual * p) % 100 === 0));
  const estimate = actual + r.pick([-1, 1]) * (actual * pct) / 100;
  const name = r.pick(NAMES);
  const [what, unit] = r.pick([["la longitud de una mesa", "cm"], ["el peso de un costal de papas", "kg"], ["el número de personas en un evento", "personas"], ["la distancia a la escuela", "metros"]]);
  return numQ(pct, `${name} estimó ${what} en ${estimate} ${unit}, pero el valor real era ${actual} ${unit}. ¿Cuál fue el error porcentual?`, undefined, `Error ÷ valor real: ${Math.abs(estimate - actual)} ÷ ${actual} = ${d2(pct)} → ${pct} %.`);
}

// P.5: precios por unidad: hallar el precio total.
export function unitPriceTotal(r: Rng): Question {
  const unit = r.int(2, 12), a = r.int(2, 6), b = r.int(7, 15);
  const [thing, one] = r.pick([["kilos de arroz", "kilo"], ["cuadernos", "cuaderno"], ["litros de leche", "litro"], ["metros de tela", "metro"]]);
  return numQ(unit * b, `Por ${a} ${thing} se pagan ${unit * a} soles. ¿Cuántos soles se pagan por ${b} ${thing}?`, undefined, `Cada ${one} cuesta ${unit * a} ÷ ${a} = ${unit} soles. Por ${b}: ${unit} × ${b} = ${unit * b} soles.`);
}

// P.8: hallar el porcentaje: impuesto, descuento y más.
export function findPercentOfPrice(r: Rng): Question {
  const price = r.pick([20, 40, 50, 80, 100, 200, 250, 400]);
  const pct = r.pick([5, 10, 15, 20, 25, 30, 40].filter((p) => (price * p) % 100 === 0));
  const part = (price * pct) / 100;
  const cases = [
    `Una mochila cuesta ${price} soles y tiene un descuento de ${part} soles. ¿Qué porcentaje del precio es el descuento?`,
    `Una cuenta de ${price} soles tuvo un recargo de ${part} soles por delivery. ¿Qué porcentaje de la cuenta es el recargo?`,
    `Una vendedora recibe ${part} soles de comisión por una venta de ${price} soles. ¿Qué porcentaje de la venta es su comisión?`,
    `En un restaurante, por un consumo de ${price} soles se dejó una propina de ${part} soles. ¿Qué porcentaje del consumo es la propina?`,
  ];
  return numQ(pct, r.pick(cases), undefined, `${part} ÷ ${price} = ${d2(pct)} → ${pct} %.`);
}

// P.10: problemas de varios pasos con porcentajes.
export function multiStepPercent(r: Rng): Question {
  const price = r.pick([200, 400, 600, 800, 1000]);
  const off = r.pick([10, 20, 25, 50]), extra = r.pick([10, 20]);
  const sale = (price * (100 - off)) / 100;
  const total = (sale * (100 + extra)) / 100;
  return numQ(total, `Un televisor cuesta ${fmt(price)} soles. Tiene ${off} % de descuento y, sobre el precio rebajado, se cobra ${extra} % por envío e instalación. ¿Cuánto se paga en total, en soles?`, undefined, `Con descuento: ${fmt(price)} − ${fmt(price - sale)} = ${fmt(sale)}. Recargo: ${extra} % de ${fmt(sale)} = ${fmt(total - sale)}. Total: ${fmt(total)} soles.`);
}

// P.11: estimar propinas.
export function estimateTip(r: Rng): Question {
  const tens = r.int(3, 18), pct = r.pick([10, 15, 20]);
  const bill = tens * 1000 + r.int(-380, 380);
  const tip = (tens * 10 * pct) / 100; // soles
  const show = (v: number) => soles(Math.round(v * 100));
  return choiceQ(r, `La cuenta de un restaurante es ${soles(bill)}. ¿Cuál es la mejor estimación de una propina del ${pct} %?`, show(tip), [show(tip / 2), show(tip * 2), show(tip + tens), show(tip * 3)].filter((x) => x !== show(tip)), `${soles(bill)} es casi S/ ${tens * 10}; el ${pct} % de ${tens * 10} es ${d2(tip * 100)} soles.`);
}

// P.13: interés compuesto.
export function compoundInterest(r: Rng): Question {
  const rate = r.pick([10, 20]);
  const years = r.pick([2, 2, 3]);
  const principal = r.pick(years === 3 ? [1000, 2000, 5000] : [100, 200, 500, 1000, 2000]);
  const total = Math.round(principal * (1 + rate / 100) ** years);
  const steps = Array.from({ length: years }, (_, i) => fmt(Math.round(principal * (1 + rate / 100) ** (i + 1)))).join(" → ");
  return numQ(total, `Se depositan ${fmt(principal)} soles en una cuenta que paga ${rate} % de interés compuesto al año (cada año el interés se suma al dinero y también gana interés). ¿Cuántos soles habrá después de ${years} años?`, undefined, `Cada año se multiplica por ${d2(100 + rate)}: ${fmt(principal)} → ${steps}.`, `${years}-anos`);
}

// ---------------------------------------------------------------------------
// Expresiones

// R.4: evaluar expresiones lineales (con enteros).
export function evaluateLinear(r: Rng): Question {
  const a = nz(r, 9), b = nz(r, 15), x = nz(r, 9);
  return intQ(r, `Calcula el valor de la expresión cuando x = ${sg(x)}.`, a * x + b, `${sg(a)} × ${par(x)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${sg(a * x)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${sg(a * x + b)}.`, lin(a, b));
}

// R.6: evaluar expresiones con valor absoluto.
export function evaluateAbsolute(r: Rng): Question {
  const x = nz(r, 12), a = r.int(1, 12), b = r.int(1, 9);
  const forms: [string, number, string][] = [
    [`|x − ${a}| + ${b}`, Math.abs(x - a) + b, `|${sg(x)} − ${a}| = ${Math.abs(x - a)}; más ${b} da ${Math.abs(x - a) + b}.`],
    [`|x + ${a}| − ${b}`, Math.abs(x + a) - b, `|${sg(x)} + ${a}| = ${Math.abs(x + a)}; menos ${b} da ${sg(Math.abs(x + a) - b)}.`],
    [`${b}|x|`, b * Math.abs(x), `|${sg(x)}| = ${Math.abs(x)}; por ${b} da ${b * Math.abs(x)}.`],
    [`−|x| + ${a}`, -Math.abs(x) + a, `|${sg(x)}| = ${Math.abs(x)}; su opuesto más ${a} da ${sg(-Math.abs(x) + a)}.`],
  ];
  const [text, value, why] = r.pick(forms);
  return intQ(r, `Calcula el valor de la expresión cuando x = ${sg(x)}.`, value, why, text);
}

// R.7: evaluar expresiones no lineales.
export function evaluateNonlinear(r: Rng): Question {
  const x = nz(r, 6), a = r.int(2, 5), b = r.int(1, 9);
  const forms: [string, number, string][] = [
    [`x² + ${b}`, x * x + b, `${par(x)}² = ${x * x}; más ${b} da ${x * x + b}.`],
    [`${a}x²`, a * x * x, `${par(x)}² = ${x * x}; por ${a} da ${a * x * x}.`],
    [`x² − ${a}x`, x * x - a * x, `${par(x)}² = ${x * x} y ${a} × ${par(x)} = ${sg(a * x)}: ${x * x} − ${par(a * x)} = ${sg(x * x - a * x)}.`],
    [`x³`, x ** 3, `${par(x)} × ${par(x)} × ${par(x)} = ${sg(x ** 3)}.`],
    [`(x + ${b})²`, (x + b) ** 2, `${sg(x)} + ${b} = ${sg(x + b)}; al cuadrado da ${(x + b) ** 2}.`],
  ];
  const [text, value, why] = r.pick(forms);
  return intQ(r, `Calcula el valor de la expresión cuando x = ${sg(x)}.`, value, why, text);
}

// S.2 / S.3: reducir términos semejantes (`tiles`: con fichas de álgebra).
export function combineLikeTerms(r: Rng, tiles: boolean): Question {
  if (tiles) {
    const [a, b, c, d] = [r.int(1, 4), r.int(1, 5), r.int(1, 3), r.int(1, 4)];
    const group = (x: number, n: number) => `${"🟦".repeat(x)} ${"🟨".repeat(n)}`;
    const good = lin(a + c, b + d);
    return choiceQ(r, "Cada 🟦 vale x y cada 🟨 vale 1. ¿Qué expresión representan todas las fichas juntas?", good, [lin(a + c + b + d, 0), lin(a + c, b), lin(a, b + d), lin(a + c + 1, b + d)].filter((x) => x !== good), `Hay ${a + c} fichas x y ${b + d} fichas de 1: ${good}.`, `${group(a, b)}   +   ${group(c, d)}`, "fichas");
  }
  const [a, c] = [nz(r, 9), nz(r, 9)], [b, d] = [nz(r, 12), nz(r, 12)];
  const good = lin(a + c, b + d);
  const term = (k: number, first: boolean, v: string) => (first ? `${k === 1 && v ? "" : k === -1 && v ? "−" : sg(k)}${v}` : `${k < 0 ? "−" : "+"} ${Math.abs(k) === 1 && v ? "" : Math.abs(k)}${v}`);
  const text = `${term(a, true, "x")} ${term(b, false, "")} ${term(c, false, "x")} ${term(d, false, "")}`;
  return choiceQ(r, "Reduce los términos semejantes.", good, [lin(a - c, b + d), lin(a + c, b - d), lin(a + c + b + d, 0), lin(a + b, c + d)].filter((x) => x !== good), `Se juntan las x: ${lin(a + c, 0)}; y los números: ${sg(b + d)}.`, text, "simbolos");
}

// S.7: sumar y restar expresiones lineales.
export function addSubLinear(r: Rng): Question {
  const [a, c] = [r.int(1, 9), r.int(1, 9)], [b, d] = [nz(r, 12), nz(r, 12)];
  const minus = r.chance(0.5);
  const good = minus ? lin(a - c, b - d) : lin(a + c, b + d);
  const wrong = minus ? [lin(a - c, b + d), lin(a + c, b - d), lin(a + c, b + d), lin(c - a, d - b)] : [lin(a + c, b - d), lin(a - c, b + d), lin(a * c, b + d), lin(a + c + 1, b + d)];
  return choiceQ(r, minus ? "Resta las expresiones." : "Suma las expresiones.", good, wrong.filter((x) => x !== good), minus ? `Al restar se cambia el signo de cada término del segundo paréntesis: ${good}.` : `Se suman las x y se suman los números: ${good}.`, `(${lin(a, b)}) ${minus ? "−" : "+"} (${lin(c, d)})`, minus ? "resta" : "suma");
}

// S.8: sumar y restar términos semejantes con exponentes.
export function likeTermsExponents(r: Rng): Question {
  const [a, c] = [r.int(2, 9), nz(r, 7)], [b, d] = [r.int(2, 9), nz(r, 7)];
  const sq = (k: number) => (k === 1 ? "x²" : k === -1 ? "−x²" : `${sg(k)}x²`);
  const join = (p: number, q: number) => (p === 0 ? lin(q, 0) : q === 0 ? sq(p) : `${sq(p)} ${q < 0 ? "−" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}x`);
  if (a + c === 0 || b + d === 0) return likeTermsExponents(r);
  const good = join(a + c, b + d);
  const text = `${sq(a)} + ${b}x ${c < 0 ? "−" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x² ${d < 0 ? "−" : "+"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}x`;
  return choiceQ(r, "Reduce los términos semejantes.", good, [join(a + b, c + d), join(a - c, b + d), join(a + c, b - d), `${sg(a + b + c + d)}x³`].filter((x) => x !== good), `Solo se juntan términos con la misma potencia: los de x² dan ${sq(a + c)} y los de x dan ${lin(b + d, 0)}.`, text);
}

// S.14: expresiones lineales equivalentes en problemas.
export function equivalentWord(r: Rng): Question {
  const k = r.int(2, 6), n = r.int(1, 9);
  const name = r.pick(NAMES);
  const cases: [string, number, number][] = [
    [`${name} compra ${k} cuadernos de x soles cada uno, y en cada cuaderno le descuentan ${n} soles. Paga ${k}(x − ${n}).`, k, -k * n],
    [`Un rectángulo mide x metros de largo y ${n} de ancho. Su perímetro es 2(x + ${n}).`, 2, 2 * n],
    [`${k} amigos pagan cada uno x soles de entrada más ${n} soles de pasaje. En total gastan ${k}(x + ${n}).`, k, k * n],
    [`${name} tenía x figuritas y cada día, durante ${k} días, regaló ${n}. Le quedan x − ${k} × ${n} figuritas.`, 1, -k * n],
  ];
  const [text, a, b] = r.pick(cases);
  const good = lin(a, b);
  return choiceQ(r, `${text} ¿Qué expresión es equivalente?`, good, [lin(a, b > 0 ? n : -n), lin(a, -b), lin(1, b), lin(a + 1, b)].filter((x) => x !== good), `Se aplica la propiedad distributiva: ${good}.`);
}

// ---------------------------------------------------------------------------
// Ecuaciones de dos pasos

type TwoStep = "plain" | "parens" | "integers" | "decimals" | "fractions" | "choose" | "word" | "likeTerms" | "complete";

const STORIES: ((a: number, b: number, c: number, name: string) => [string, string])[] = [
  (a, b, c, name) => [`${name} pagó ${b} soles de entrada a la feria y ${a} soles por cada juego. Gastó ${c} soles en total.`, "el número de juegos"],
  (a, b, c, name) => [`Un taxi cobra ${b} soles al subir y ${a} soles por cada kilómetro. ${name} pagó ${c} soles.`, "los kilómetros recorridos"],
  (a, b, c, name) => [`${name} ya tenía ${b} soles ahorrados y cada semana guarda ${a} soles. Ahora tiene ${c} soles.`, "el número de semanas"],
  (a, b, c) => [`Un plan de celular cuesta ${b} soles al mes más ${a} soles por cada gigabyte extra. Este mes la cuenta fue de ${c} soles.`, "los gigabytes extra"],
];

export function twoStepEquation(r: Rng, kind: TwoStep): Question {
  const a = r.int(2, 9), x = r.int(1, 12), b = r.int(1, 20);
  if (kind === "plain") {
    const minus = r.chance(0.5);
    const c = a * x + (minus ? -b : b);
    return numQ(x, "Resuelve la ecuación. ¿Cuánto vale x?", `${a}x ${minus ? "−" : "+"} ${b} = ${sg(c)}`, `${minus ? `Se suma ${b}` : `Se resta ${b}`}: ${a}x = ${a * x}. Se divide entre ${a}: x = ${x}.`);
  }
  if (kind === "parens") {
    const minus = r.chance(0.5) && x > b ? true : false;
    const inner = minus ? x - b : x + b;
    return numQ(x, "Resuelve la ecuación. ¿Cuánto vale x?", `${a}(x ${minus ? "−" : "+"} ${b}) = ${a * inner}`, `Se divide entre ${a}: x ${minus ? "−" : "+"} ${b} = ${inner}. ${minus ? `Se suma ${b}` : `Se resta ${b}`}: x = ${x}.`);
  }
  if (kind === "integers") {
    const k = nz(r, 9), v = nz(r, 12), t = nz(r, 20);
    return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", v, `Se ${t < 0 ? `suma ${-t}` : `resta ${t}`}: ${sg(k)}x = ${sg(k * v)}. Se divide entre ${sg(k)}: x = ${sg(v)}.`, `${lin(k, t)} = ${sg(k * v + t)}`);
  }
  if (kind === "decimals") {
    const k = r.int(2, 25), t = r.int(1, 60); // décimos
    const c = k * x + t;
    return numQ(x, "Resuelve la ecuación. ¿Cuánto vale x?", `${d2(k * 10)}x + ${d2(t * 10)} = ${d2(c * 10)}`, `Se resta ${d2(t * 10)}: ${d2(k * 10)}x = ${d2(k * x * 10)}. Se divide entre ${d2(k * 10)}: x = ${x}.`);
  }
  if (kind === "fractions") {
    const d = r.pick([2, 3, 4, 5, 6]), q = r.int(1, 9), n = r.pick([1, 1, 2, 3].filter((m) => m < d && absGcd(m, d) === 1));
    const v = d * q; // x múltiplo del denominador
    const minus = r.chance(0.5);
    const c = n * q + (minus ? -b : b);
    return numQ(v, "Resuelve la ecuación. ¿Cuánto vale x?", `${n === 1 ? `x/${d}` : `(${n}/${d})x`} ${minus ? "−" : "+"} ${b} = ${sg(c)}`, `${minus ? `Se suma ${b}` : `Se resta ${b}`}: ${n === 1 ? `x/${d}` : `(${n}/${d})x`} = ${n * q}. Se multiplica por ${n === 1 ? d : `${d}/${n}`}: x = ${v}.`);
  }
  if (kind === "choose" || kind === "word") {
    const c = a * x + b;
    const [story, what] = r.pick(STORIES)(a, b, c, r.pick(NAMES));
    if (kind === "word") return numQ(x, `${story} ¿Cuál es ${what}?`, undefined, `${a}x + ${b} = ${c} → ${a}x = ${a * x} → x = ${x}.`);
    const good = `${a}x + ${b} = ${c}`;
    return choiceQ(r, `${story} Si x es ${what}, ¿qué ecuación lo representa?`, good, [`${b}x + ${a} = ${c}`, `${a}x − ${b} = ${c}`, `${a}(x + ${b}) = ${c}`, `${a + b}x = ${c}`].filter((e) => e !== good), `Lo que cambia con x se multiplica (${a}x) y lo fijo se suma (${b}).`);
  }
  if (kind === "likeTerms") {
    const c = r.int(2, 7);
    if (r.chance(0.5)) return numQ(x, "Resuelve la ecuación. ¿Cuánto vale x?", `${a}x + ${c}x = ${(a + c) * x}`, `Se juntan las x: ${a + c}x = ${(a + c) * x}; x = ${x}.`);
    return numQ(x, "Resuelve la ecuación. ¿Cuánto vale x?", `${a}x + ${b} + ${c}x = ${(a + c) * x + b}`, `Se juntan las x: ${a + c}x + ${b} = ${(a + c) * x + b}. Se resta ${b}: ${a + c}x = ${(a + c) * x}; x = ${x}.`);
  }
  // complete: completar la solución paso a paso.
  const minus = r.chance(0.5);
  const c = minus ? a * x - b : a * x + b;
  const first = `${a}x ${minus ? "−" : "+"} ${b} = ${sg(c)}`;
  const undo = minus ? "suma" : "resta";
  if (r.chance(0.4)) return numQ(a * x, "Completa el paso que falta en la solución.", `${first}\n${a}x = ?\nx = ${x}`, `Se ${undo} ${b} en los dos lados: ${par(c)} ${minus ? "+" : "−"} ${b} = ${a * x}.`, "numero");
  const steps = [`Restar ${b} en los dos lados`, `Sumar ${b} en los dos lados`, `Dividir entre ${a} en los dos lados`, `Multiplicar por ${a} en los dos lados`];
  if (r.chance(0.67)) return fixedQ("¿Qué se hizo para pasar de la primera línea a la segunda?", steps, steps[minus ? 1 : 0], `Para dejar sola a ${a}x se quita el ${minus ? "−" : "+"} ${b}: se ${undo} ${b} en ambos lados.`, `${first}\n${a}x = ${a * x}`, "paso1");
  return fixedQ("¿Qué se hizo para pasar de la segunda línea a la tercera?", steps, steps[2], `${a}x significa ${a} por x: se deshace dividiendo entre ${a} en ambos lados.`, `${first}\n${a}x = ${a * x}\nx = ${x}`, "paso2");
}

// ---------------------------------------------------------------------------
// Inecuaciones de dos pasos

type IneqOp = "<" | ">" | "≤" | "≥";
const FLIP: Record<IneqOp, IneqOp> = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
const OPS: IneqOp[] = ["<", ">", "≤", "≥"];
const ineq = (op: IneqOp, n: number) => `x ${op} ${sg(n)}`;
const ray = (op: IneqOp, n: number): Visual => ({ kind: "numberLine", min: -10, max: 10, step: 1, labelEvery: 5, marked: n, ray: { closed: op === "≥" || op === "≤", dir: op === ">" || op === "≥" ? "right" : "left" } });

// U.7 / U.8: resolver inecuaciones de dos pasos (`graph`: comprobar el gráfico).
export function twoStepInequality(r: Rng, graph = false): Question {
  const a = nz(r, 6);
  const k = Math.abs(a) === 1 ? a * 2 : a;
  const n = r.int(graph ? -6 : -9, graph ? 6 : 9), b = nz(r, 12);
  const shown = r.pick(OPS);
  const solution: IneqOp = k < 0 ? FLIP[shown] : shown;
  const text = `${lin(k, b)} ${shown} ${sg(k * n + b)}`;
  const why = `Se ${b < 0 ? `suma ${-b}` : `resta ${b}`}: ${sg(k)}x ${shown} ${sg(k * n)}. Se divide entre ${sg(k)}${k < 0 ? " y, por ser negativo, se invierte el signo" : ""}: ${ineq(solution, n)}.`;
  if (graph) {
    const yes = r.chance(0.5);
    const drawn = yes ? solution : r.pick(OPS.filter((o) => o !== solution));
    return yesNo(`¿La recta numérica muestra la solución de ${text}?`, yes, why, ray(drawn, n), k < 0 ? "invierte" : "no-invierte");
  }
  return choiceQ(r, "Resuelve la inecuación.", ineq(solution, n), OPS.filter((o) => o !== solution).map((o) => ineq(o, n)), why, text, k < 0 ? "invierte" : "no-invierte");
}

// ---------------------------------------------------------------------------
// Sucesiones

function arithmetic(r: Rng) {
  const d = nz(r, 9), first = r.int(-10, 30);
  return { d, first, terms: Array.from({ length: 5 }, (_, i) => first + i * d) };
}
function geometric(r: Rng) {
  const ratio = r.pick([2, 3, 4, 5, 10, -2, -3]), first = r.int(1, 5);
  return { ratio, first, terms: Array.from({ length: 4 }, (_, i) => first * ratio ** i) };
}
const list = (xs: number[]) => xs.map(sg).join(", ");

// V.1: identificar sucesiones aritméticas y geométricas.
export function identifySequence(r: Rng): Question {
  const kind = r.int(0, 2);
  const options = ["Aritmética", "Geométrica", "Ninguna de las dos"];
  if (kind === 0) {
    const s = arithmetic(r);
    return fixedQ("¿Qué tipo de sucesión es?", options, options[0], `Cada término se obtiene sumando ${sg(s.d)} al anterior: es aritmética.`, `${list(s.terms)}, …`, "aritmetica");
  }
  if (kind === 1) {
    const s = geometric(r);
    return fixedQ("¿Qué tipo de sucesión es?", options, options[1], `Cada término se obtiene multiplicando el anterior por ${sg(s.ratio)}: es geométrica.`, `${list(s.terms)}, …`, "geometrica");
  }
  const start = r.int(1, 4);
  const terms = r.chance(0.5) ? [0, 1, 2, 3, 4].map((i) => (start + i) ** 2) : [1, 2, 4, 7, 11].map((x) => x + start);
  return fixedQ("¿Qué tipo de sucesión es?", options, options[2], "No se suma siempre lo mismo ni se multiplica siempre por lo mismo.", `${list(terms)}, …`, "ninguna");
}

// V.2 – V.4: hallar el término que sigue.
export function nextTerm(r: Rng, kind: "arithmetic" | "geometric" | "mixed"): Question {
  const k = kind === "mixed" ? r.pick(["arithmetic", "geometric"] as const) : kind;
  if (k === "arithmetic") {
    const s = arithmetic(r);
    return intQ(r, "¿Qué número sigue en la sucesión?", s.first + 5 * s.d, `Se suma ${sg(s.d)} cada vez: ${sg(s.terms[4])} + ${par(s.d)} = ${sg(s.first + 5 * s.d)}.`, `${list(s.terms)}, ?`, "aritmetica", [s.terms[4] - s.d]);
  }
  const s = geometric(r);
  const next = s.first * s.ratio ** 4;
  return intQ(r, "¿Qué número sigue en la sucesión?", next, `Se multiplica por ${sg(s.ratio)} cada vez: ${sg(s.terms[3])} × ${par(s.ratio)} = ${sg(next)}.`, `${list(s.terms)}, ?`, "geometrica", [s.terms[3] + (s.terms[3] - s.terms[2])]);
}

// V.5: sucesiones en problemas.
export function sequenceProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  if (r.chance(0.6)) {
    const first = r.int(2, 20), d = r.int(2, 9), n = r.int(6, 12);
    const story = r.pick([`${name} ahorra ${first} soles la primera semana y cada semana ahorra ${d} soles más que la anterior. ¿Cuánto ahorra en la semana ${n}?`, `Un teatro tiene ${first} asientos en la primera fila y cada fila tiene ${d} asientos más que la anterior. ¿Cuántos asientos tiene la fila ${n}?`, `${name} corre ${first} minutos el primer día y cada día corre ${d} minutos más. ¿Cuántos minutos corre el día ${n}?`]);
    return numQ(first + (n - 1) * d, story, undefined, `Se suma ${d} un total de ${n - 1} veces: ${first} + ${n - 1} × ${d} = ${first + (n - 1) * d}.`, "aritmetica");
  }
  const first = r.int(1, 5), ratio = r.pick([2, 3]), n = r.int(4, ratio === 2 ? 8 : 5);
  const story = r.pick([`Un cultivo empieza con ${first * 100} bacterias y cada hora se multiplica por ${ratio}. ¿Cuántas bacterias hay después de ${n - 1} horas?`, `Un mensaje lo reenvían ${first * 100} personas el primer día, y cada día lo reenvían ${ratio} veces más personas que el día anterior. ¿Cuántas lo reenvían el día ${n}?`]);
  return numQ(first * 100 * ratio ** (n - 1), story, undefined, `Se multiplica por ${ratio} un total de ${n - 1} veces: ${first * 100} × ${ratio ** (n - 1)} = ${fmt(first * 100 * ratio ** (n - 1))}.`, "geometrica");
}

// V.6: evaluar expresiones con variables para sucesiones.
export function sequenceExpression(r: Rng): Question {
  const a = nz(r, 9), b = nz(r, 15), n = r.int(5, 30);
  return intQ(r, `El término de posición n de una sucesión es ${lin(a, b, "n")}. ¿Cuál es el término de posición ${n}?`, a * n + b, `Se reemplaza n por ${n}: ${sg(a)} × ${n} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${sg(a * n + b)}.`);
}

// V.7: escribir expresiones con variables para sucesiones aritméticas.
export function writeSequenceExpression(r: Rng): Question {
  const d = r.int(2, 9) * r.pick([1, 1, -1]), first = r.int(-5, 20);
  const terms = Array.from({ length: 4 }, (_, i) => first + i * d);
  const good = lin(d, first - d, "n");
  return choiceQ(r, "¿Qué expresión da el término de posición n (n = 1, 2, 3, …)?", good, [lin(d, first, "n"), lin(first, d, "n"), lin(1, d, "n"), lin(d, first + d, "n")].filter((x) => x !== good), `Cada término suma ${sg(d)}: la expresión empieza con ${lin(d, 0, "n")}. Para n = 1 debe dar ${sg(first)}: ${good}.`, `${list(terms)}, …`);
}

// ---------------------------------------------------------------------------
// Pendiente y rectas

function twoPoints(r: Rng): [P, P, SF] {
  const A = { x: r.int(-5, 3), y: r.int(-5, 5) };
  const run = r.int(1, 5 - A.x > 0 ? Math.min(6, 5 - A.x) : 1);
  const B = { x: A.x + run, y: r.int(-5, 5) };
  if (B.y === A.y && r.chance(0.8)) return twoPoints(r);
  return [A, B, [B.y - A.y, run]];
}

// W.1 / W.2: hallar la pendiente (en un gráfico o con dos puntos).
export function slope(r: Rng, graph: boolean): Question {
  const [A, B, m] = twoPoints(r);
  const why = `Pendiente = cambio en y ÷ cambio en x = (${sg(B.y)} − ${par(A.y)}) ÷ (${sg(B.x)} − ${par(A.x)}) = ${sg(m[0])}/${m[1]} = ${sfshow(m)}.`;
  return sfQ(r, graph ? "¿Cuál es la pendiente de la recta que pasa por A y B?" : `¿Cuál es la pendiente de la recta que pasa por ${pt(A)} y ${pt(B)}?`, m, why, graph ? plane([{ ...A, emoji: "A" }, { ...B, emoji: "B" }], "open") : undefined, m[0] > 0 ? "positiva" : m[0] < 0 ? "negativa" : "cero", [[m[1], m[0] || 1]]);
}

// W.3: hallar una coordenada que falta usando la pendiente.
export function missingCoordinate(r: Rng): Question {
  const m = nz(r, 4), run = r.int(1, 4);
  const A = { x: r.int(-5, 2), y: r.int(-6, 6) };
  const B = { x: A.x + run, y: A.y + m * run };
  return intQ(r, `Una recta tiene pendiente ${sg(m)} y pasa por ${pt(A)} y por (${sg(B.x)}, y). ¿Cuánto vale y?`, B.y, `x aumenta ${run}; y cambia ${sg(m)} × ${run} = ${sg(m * run)}: ${sg(A.y)} + ${par(m * run)} = ${sg(B.y)}.`, undefined, undefined, [A.y - m * run, A.y + m]);
}

// W.4: graficar una recta usando la pendiente (¿qué otro punto está en la recta?).
export function lineFromSlope(r: Rng): Question {
  const rise = nz(r, 3), run = r.int(1, 3);
  const g = absGcd(rise, run);
  const [a, b] = [rise / g, run / g];
  const A = { x: r.int(-3, 2), y: r.int(-3, 3) };
  const B = { x: A.x + b, y: A.y + a };
  const wrong: P[] = [{ x: A.x + Math.abs(a), y: A.y + b }, { x: A.x + b, y: A.y - a }, { x: A.x - b, y: A.y + a }, { x: A.x + a, y: A.y - b }].filter((p) => (p.y - A.y) * b !== a * (p.x - A.x));
  return choiceQ(r, `Una recta pasa por el punto A ${pt(A)} y tiene pendiente ${sfshow([a, b])}. ¿Qué otro punto está en la recta?`, pt(B), wrong.map(pt), `Desde A: ${b} hacia la derecha y ${Math.abs(a)} hacia ${a > 0 ? "arriba" : "abajo"}: ${pt(B)}.`, plane([{ ...A, emoji: "A" }]), a > 0 ? "positiva" : "negativa");
}

type RateMode = "constTable" | "constGraph" | "table" | "graph";
// W.5 – W.8: tasa de cambio en tablas y gráficos.
export function rateOfChange(r: Rng, mode: RateMode): Question {
  const [xName, yName, per] = r.pick([["Hora", "Kilómetros", "kilómetros por hora"], ["Día", "Soles ahorrados", "soles por día"], ["Minuto", "Litros en el tanque", "litros por minuto"], ["Semana", "Altura (cm)", "centímetros por semana"]]);
  if (mode === "constTable" || mode === "constGraph") {
    const graph = mode === "constGraph";
    const k = graph ? r.pick([1, 2, 3, -1, -2]) : nz(r, 9);
    const start = k < 0 ? r.int(graph ? 8 : 40, graph ? 12 : 90) : r.int(0, graph ? 3 : 20);
    const step = graph ? 1 : r.pick([1, 2, 5]);
    const xs = [0, 1, 2, 3].map((i) => i * step).filter((x) => !graph || (start + k * x >= 0 && start + k * x <= 12));
    const pts = xs.map((x) => ({ x, y: start + k * x }));
    const visual = graph ? plane1(pts) : table([xName, yName], pts.map((p) => [String(p.x), String(p.y)]));
    return intQ(r, graph ? "¿Cuál es la tasa de cambio constante de la recta (cuánto cambia y por cada unidad de x)?" : `¿Cuál es la tasa de cambio constante, en ${per}?`, k, `Entre dos puntos: (${pts[1].y} − ${pts[0].y}) ÷ (${pts[1].x} − ${pts[0].x}) = ${sg(k)}.`, visual, k > 0 ? "aumenta" : "disminuye", [k * step, start]);
  }
  const values = [r.int(5, 30)];
  for (let i = 1; i < 5; i++) values.push(Math.max(0, values[i - 1] + r.int(-8, 12)));
  const i = r.int(0, 3), j = r.int(i + 1, 4);
  const scale = j - i;
  // Se ajusta el valor final para que la tasa sea entera.
  const diff = Math.round((values[j] - values[i]) / scale) * scale;
  values[j] = Math.max(0, values[i] + diff);
  const rate = (values[j] - values[i]) / scale;
  if (!Number.isInteger(rate)) return rateOfChange(r, mode);
  const labels = values.map((_, t) => String(t + 1));
  const visual: Visual = mode === "graph" ? { kind: "barChart", title: yName, bars: values.map((v, t) => ({ label: labels[t], value: v })), max: Math.ceil((Math.max(...values) + 1) / 10) * 10, step: 5, line: true } : table([xName, yName], values.map((v, t) => [labels[t], String(v)]));
  const article = xName === "Hora" || xName === "Semana" ? "la" : "el";
  return intQ(r, `¿Cuál fue la tasa de cambio promedio entre ${article} ${xName.toLowerCase()} ${i + 1} y ${article} ${xName.toLowerCase()} ${j + 1}?`, rate, `Cambio en y ÷ cambio en x: (${values[j]} − ${values[i]}) ÷ (${j + 1} − ${i + 1}) = ${sg(rate)}.`, visual, rate > 0 ? "aumenta" : rate < 0 ? "disminuye" : "igual");
}

// X.10: escribir la ecuación de una recta a partir de su gráfico.
export function linearFromGraph(r: Rng): Question {
  const m = r.int(1, 3), b = r.int(1, 5);
  const pts = [0, 1, 2, 3].map((x) => ({ x, y: m * x + b })).filter((p) => p.y <= 12);
  const eq = (k: number, c: number) => `y = ${lin(k, c)}`;
  return choiceQ(r, "¿Qué ecuación corresponde a la recta?", eq(m, b), [eq(b, m), eq(m, -b), eq(m + 1, b), eq(m, b + 1), eq(1, b)].filter((e) => e !== eq(m, b)), `La recta corta el eje y en ${b} y sube ${m} por cada unidad de x: ${eq(m, b)}.`, plane1(pts));
}
