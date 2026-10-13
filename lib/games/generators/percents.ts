import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, SYMBOLS, choiceQ, d3, decQ, fixedQ, fmt, fracQ, fshow, nearCents, numQ, pct, soles, sym } from "./kit";

// Porcentajes y matemática del consumidor (6.° en adelante).

const grid = (percent: number): Visual => ({ kind: "decimalGrid", hundredths: percent });
// Fracciones «amables» con su porcentaje exacto.
const FRIENDLY: [Frac, number][] = [[[1, 2], 50], [[1, 4], 25], [[3, 4], 75], [[1, 5], 20], [[2, 5], 40], [[3, 5], 60], [[4, 5], 80], [[1, 10], 10], [[3, 10], 30], [[7, 10], 70], [[9, 10], 90], [[1, 20], 5], [[3, 20], 15], [[7, 20], 35], [[1, 25], 4], [[3, 25], 12], [[9, 20], 45], [[11, 20], 55], [[1, 50], 2], [[13, 20], 65]];

// 6.° U.1: ¿qué porcentaje se muestra?
export function percentIllustrated(r: Rng): Question {
  const p = r.int(1, 99);
  return numQ(p, "El cuadrado tiene 100 casillas. ¿Qué porcentaje está sombreado?", grid(p), `Hay ${p} casillas sombreadas de 100: ${p} por ciento (${pct(p)}).`);
}

// 6.° U.2 / U.3: porcentajes de referencia con modelos de tira.
export function benchmarkStrip(r: Rng, withThirds: boolean): Question {
  const parts = r.pick(withThirds ? [2, 3, 4, 5, 10, 3] : [2, 4, 5, 10]);
  const shaded = r.int(1, parts - (parts === 2 ? 0 : 1));
  const visual: Visual = { kind: "fraction", shape: "bar", parts, shaded };
  if (parts === 3) {
    const options = ["Cerca de 33 %", "Cerca de 50 %", "Cerca de 67 %", "100 %"];
    return fixedQ("La tira completa es el 100 %. ¿Qué porcentaje está sombreado?", options, shaded === 1 ? options[0] : shaded === 2 ? options[2] : options[3], `Cada tercio es 100 ÷ 3 ≈ 33 %; ${shaded} ${shaded === 1 ? "tercio" : "tercios"} ≈ ${shaded === 1 ? 33 : 67} %.`, visual, "tercios");
  }
  return numQ((100 / parts) * shaded, "La tira completa es el 100 %. ¿Qué porcentaje está sombreado?", visual, `Cada parte es 100 ÷ ${parts} = ${100 / parts} %; ${shaded} ${shaded === 1 ? "parte" : "partes"}: ${(100 / parts) * shaded} %.`, `${parts}-partes`);
}

// 6.° U.4 / U.5 / U.6 / U.7: convertir entre porcentajes, fracciones y decimales.
export function convertPercent(r: Rng, kinds: ("fraction" | "decimal" | "grid")[]): Question {
  const kind = r.pick(kinds);
  if (kind === "grid") {
    const [f, p] = r.pick(FRIENDLY);
    return numQ(p, `Está sombreada la fracción ${f[0]}/${f[1]} del cuadrado de 100 casillas. ¿Qué porcentaje es?`, grid(p), `${f[0]}/${f[1]} = ${p}/100 = ${p} %.`, "cuadricula");
  }
  if (kind === "fraction") {
    const [f, p] = r.pick(FRIENDLY);
    if (r.chance(0.5)) return numQ(p, "Escribe la fracción como porcentaje.", `${f[0]}/${f[1]} = ? %`, `${f[0]}/${f[1]} = ${p}/100 = ${p} %.`, "fraccion-a-porcentaje");
    return fracQ(r, `Escribe ${pct(p)} como fracción en su mínima expresión.`, f, `${p} % = ${p}/100 = ${fshow(f)}.`, undefined, "porcentaje-a-fraccion", [[p, 10], [f[1], f[0] + f[1]], [p, 1000]]);
  }
  const p = r.chance(0.2) ? r.int(101, 250) : r.int(1, 99);
  if (r.chance(0.5)) return decQ(r, `Escribe ${pct(p)} como número decimal.`, p * 10, `${p} % = ${p}/100 = ${d3(p * 10)}: la coma se mueve dos lugares a la izquierda.`, undefined, "porcentaje-a-decimal", [p * 100, p, p * 1000]);
  return numQ(p, "Escribe el decimal como porcentaje.", `${d3(p * 10)} = ? %`, `${d3(p * 10)} × 100 = ${p} %: la coma se mueve dos lugares a la derecha.`, "decimal-a-porcentaje");
}

// 6.° U.8: convertir entre porcentajes, fracciones y decimales en problemas.
export function convertPercentProblem(r: Rng): Question {
  const [f, p] = r.pick(FRIENDLY);
  const name = r.pick(NAMES);
  const form = r.int(0, 2);
  if (form === 0) return numQ(p, `${name} respondió bien ${f[0]} de cada ${f[1]} preguntas. ¿Qué porcentaje respondió bien?`, undefined, `${f[0]}/${f[1]} = ${p}/100 = ${p} %.`, "a-porcentaje");
  if (form === 1) return fracQ(r, `El ${pct(p)} de los alumnos va al colegio caminando. ¿Qué fracción de los alumnos es?`, f, `${p} % = ${p}/100 = ${fshow(f)}.`, undefined, "a-fraccion", [[p, 10], [f[1], 100]]);
  return decQ(r, `Una tienda rebaja el ${pct(p)} del precio. ¿Qué decimal representa esa rebaja?`, p * 10, `${p} % = ${p}/100 = ${d3(p * 10)}.`, undefined, "a-decimal", [p * 100, p]);
}

// 6.° U.9 / U.10: comparar porcentajes entre sí y con fracciones.
export function comparePercents(r: Rng, word = false): Question {
  const [f, p] = r.pick(FRIENDLY);
  const other = r.chance(0.2) ? p : Math.min(99, Math.max(1, p + r.pick([-15, -10, -5, 5, 10, 15])));
  if (word) {
    if (other === p) return comparePercents(r, word);
    const [n1, n2] = r.shuffle(NAMES).slice(0, 2);
    const more = r.chance(0.5);
    return fixedQ(`${n1} encestó ${f[0]} de cada ${f[1]} tiros. ${n2} encestó el ${pct(other)} de sus tiros. ¿Quién tuvo ${more ? "mejor" : "peor"} puntería?`, [n1, n2], (p > other) === more ? n1 : n2, `${f[0]}/${f[1]} = ${p} %, y ${p} % ${sym(p, other)} ${other} %.`, undefined, more ? "mejor" : "peor");
  }
  const left = r.chance(0.5);
  const s = left ? sym(p, other) : sym(other, p);
  const frac = `${f[0]}/${f[1]}`;
  return fixedQ("Elige el símbolo correcto.", SYMBOLS, s, `${frac} = ${p} %.`, left ? `${frac}  ?  ${pct(other)}` : `${pct(other)}  ?  ${frac}`, s);
}

// ---------------------------------------------------------------------------
// Porcentajes de cantidades

// Porcentaje y cantidad con resultado entero.
function percentCase(r: Rng): { p: number; total: number; part: number } {
  const p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 12, 35, 45]);
  const base = 100 / [1, 2, 4, 5, 10, 20, 25, 50, 100].filter((d) => (p * (100 / d)) % 100 === 0).pop()!;
  const total = base * r.int(1, 30);
  return { p, total, part: (p * total) / 100 };
}

// 6.° V.1: estimar porcentajes de cantidades.
export function estimatePercent(r: Rng): Question {
  const p = r.pick([10, 20, 25, 50, 75]);
  const total = r.int(2, 40) * 20;
  const shownP = p + r.pick([-1, 1]);
  const shownTotal = total + r.pick([-2, -1, 1, 2]);
  const answer = (p * total) / 100;
  return choiceQ(r, `¿Cuál es la mejor estimación del ${pct(shownP)} de ${fmt(shownTotal)}?`, fmt(answer), [answer * 2, answer / 2, answer * 10, answer + total / 10, total - answer].filter((x) => Number.isInteger(x) && x > 0 && x !== answer).map(fmt), `${shownP} % ≈ ${p} % y ${fmt(shownTotal)} ≈ ${fmt(total)}; ${p} % de ${fmt(total)} = ${fmt(answer)}.`);
}

// 6.° V.2 / V.3: resolver problemas de porcentaje con modelos (cuadrícula o tira).
export function percentModel(r: Rng, model: "grid" | "strip"): Question {
  if (model === "grid") {
    const each = r.pick([2, 3, 4, 5, 8]);
    const p = r.int(1, 19) * 5;
    return numQ(p * each, `El cuadrado completo representa ${100 * each}: cada casilla vale ${each}. ¿Cuánto es el ${pct(p)} de ${100 * each}?`, grid(p), `${p} casillas × ${each} = ${p * each}.`);
  }
  const parts = r.pick([4, 5, 10]);
  const each = r.int(2, 30);
  const k = r.int(1, parts - 1);
  const visual: Visual = { kind: "strip", total: `${parts * each} (100 %)`, bars: [{ parts: Array.from({ length: parts }, (_, i) => ({ text: i < k ? `${100 / parts} %` : " ", w: 1 })) }] };
  return numQ(k * each, `La tira completa es ${parts * each} y cada parte es el ${100 / parts} %. ¿Cuánto es el ${pct((100 / parts) * k)} de ${parts * each}?`, visual, `Cada parte vale ${parts * each} ÷ ${parts} = ${each}; ${k} ${k === 1 ? "parte" : "partes"}: ${k * each}.`);
}

// 6.° V.4 / V.5: porcentaje de una cantidad.
export function percentOf(r: Rng, word = false): Question {
  const { p, total, part } = percentCase(r);
  const why = `${p} % de ${fmt(total)} = ${p}/100 × ${fmt(total)} = ${fmt(part)}.`;
  if (!word) return numQ(part, "Calcula.", `${pct(p)} de ${fmt(total)} = ?`, why);
  return numQ(part, r.pick([`En un colegio hay ${fmt(total)} alumnos y el ${pct(p)} participa en el coro. ¿Cuántos alumnos están en el coro?`, `${r.pick(NAMES)} tenía ${fmt(total)} soles y gastó el ${pct(p)}. ¿Cuántos soles gastó?`, `Un libro tiene ${fmt(total)} páginas y ya se leyó el ${pct(p)}. ¿Cuántas páginas se leyeron?`, `De ${fmt(total)} entradas, se vendió el ${pct(p)}. ¿Cuántas entradas se vendieron?`]), undefined, why);
}

// 6.° V.6: porcentajes fraccionarios y decimales de una cantidad.
export function fractionalPercent(r: Rng): Question {
  const [text, num, den] = r.pick<[string, number, number]>([["12,5 %", 1, 8], ["2,5 %", 1, 40], ["0,5 %", 1, 200], ["37,5 %", 3, 8], ["7,5 %", 3, 40], ["1/2 %", 1, 200], ["62,5 %", 5, 8], ["1,5 %", 3, 200]]);
  const total = den * r.int(1, den >= 200 ? 6 : 20);
  return numQ((total / den) * num, "Calcula.", `${text} de ${fmt(total)} = ?`, `${text} = ${num}/${den}; ${fmt(total)} ÷ ${den} × ${num} = ${fmt((total / den) * num)}.`, text);
}

// 6.° V.7 / V.8: ¿qué porcentaje es un número de otro?
export function whatPercent(r: Rng, word = false): Question {
  const { p, total, part } = percentCase(r);
  const why = `${fmt(part)} ÷ ${fmt(total)} = ${d3(p * 10)} = ${p} %.`;
  if (!word) return numQ(p, "Completa.", `${fmt(part)} es el ? % de ${fmt(total)}`, why);
  return numQ(p, r.pick([`De ${fmt(total)} alumnos, ${fmt(part)} llegaron temprano. ¿Qué porcentaje llegó temprano?`, `Un equipo jugó ${fmt(total)} partidos y ganó ${fmt(part)}. ¿Qué porcentaje de los partidos ganó?`, `${r.pick(NAMES)} tenía ${fmt(total)} soles y ahorró ${fmt(part)}. ¿Qué porcentaje ahorró?`]), undefined, why);
}

// 6.° V.9: hallar el total dados una parte y un porcentaje.
export function findTotal(r: Rng): Question {
  const { p, total, part } = percentCase(r);
  return numQ(total, "Completa.", `${fmt(part)} es el ${pct(p)} de ?`, `${fmt(part)} ÷ ${p} × 100 = ${fmt(total)}.`);
}

// 6.° V.10 / V.11: resolver problemas de porcentaje (parte, porcentaje o total).
export function percentProblems(r: Rng, word = false): Question {
  if (!word) return r.pick([() => percentOf(r), () => whatPercent(r), () => findTotal(r)])();
  const { p, total, part } = percentCase(r);
  return r.pick([
    () => percentOf(r, true),
    () => whatPercent(r, true),
    () => numQ(total, `El ${pct(p)} de los alumnos de un colegio son ${fmt(part)}. ¿Cuántos alumnos tiene el colegio?`, undefined, `${fmt(part)} ÷ ${p} × 100 = ${fmt(total)}.`, "total"),
    () => numQ(total - part, `Una tienda tenía ${fmt(total)} polos y vendió el ${pct(p)}. ¿Cuántos polos le quedan?`, undefined, `Vendió ${fmt(part)}; ${fmt(total)} − ${fmt(part)} = ${fmt(total - part)}.`, "lo-que-queda"),
  ])();
}

// ---------------------------------------------------------------------------
// Matemática del consumidor (montos en céntimos)

const money = (r: Rng, answer: number, prompt: string, explanation: string, visual?: Question["visual"], tag?: string, extra: number[] = []) => choiceQ(r, prompt, soles(answer), nearCents(r, answer, soles, extra, 10), explanation, visual, tag);
// 6.° X.1: ¿qué cupón conviene más?
export function betterCoupon(r: Rng): Question {
  for (;;) {
    const price = r.int(4, 40) * 500;
    const p = r.pick([10, 20, 25, 30, 50]);
    const byPercent = (price * p) / 100;
    // El cupón de monto fijo queda cerca del otro: gana más o menos la mitad de las veces.
    const fixed = Math.round(byPercent / 100) * 100 + r.pick([-1, 1]) * r.int(1, 5) * 100;
    if (byPercent === fixed || fixed <= 0 || fixed >= price) continue;
    const answer = byPercent > fixed ? `El cupón de ${pct(p)}` : `El cupón de ${soles(fixed)}`;
    return fixedQ(`Vas a comprar algo de ${soles(price)} y solo puedes usar un cupón. ¿Cuál te hace ahorrar más?`, [`El cupón de ${pct(p)}`, `El cupón de ${soles(fixed)}`], answer, `El ${p} % de ${soles(price)} es ${soles(byPercent)}; el otro cupón descuenta ${soles(fixed)}.`, undefined, byPercent > fixed ? "porcentaje" : "monto-fijo");
  }
}

// 6.° X.4: precios por unidad con conversión de unidades.
export function unitPriceConversion(r: Rng): Question {
  const [big, small, factor] = r.pick<[string, string, number]>([["kg", "100 g", 10], ["l", "100 ml", 10], ["docena", "unidad", 12], ["m", "10 cm", 10], ["libra", "onza", 16]]);
  const perSmall = r.int(1, 12) * 10;
  const k = r.int(1, 4);
  return money(r, perSmall, `${k} ${big}${k > 1 ? (big === "docena" ? "s" : big === "libra" ? "s" : "") : ""} cuesta${k > 1 ? "n" : ""} ${soles(perSmall * factor * k)}. ¿Cuánto cuesta cada ${small}? (1 ${big} = ${factor} ${small === "unidad" ? "unidades" : small === "onza" ? "onzas" : `veces ${small}`})`, `Por ${big}: ${soles(perSmall * factor * k)} ÷ ${k} = ${soles(perSmall * factor)}; por ${small}: ÷ ${factor} = ${soles(perSmall)}.`);
}

// 6.° X.5 / X.6: precios de oferta (y hallar el precio original).
export function salePrice(r: Rng, findOriginal = false): Question {
  const p = r.pick([10, 20, 25, 30, 40, 50]);
  const price = r.int(2, 40) * 400;
  const discount = (price * p) / 100;
  const sale = price - discount;
  const item = r.pick(["una mochila", "un par de zapatillas", "una casaca", "un juego", "una pelota"]);
  if (findOriginal) return money(r, price, `Con un descuento del ${pct(p)}, ${item} cuesta ${soles(sale)}. ¿Cuál era el precio original?`, `El precio de oferta es el ${100 - p} % del original: ${soles(sale)} ÷ ${100 - p} × 100 = ${soles(price)}.`, undefined, undefined, [sale + discount / 2, sale * 2]);
  return money(r, sale, `${item[0].toUpperCase()}${item.slice(1)} cuesta ${soles(price)} y tiene un descuento del ${pct(p)}. ¿Cuál es el precio de oferta?`, `Descuento: ${p} % de ${soles(price)} = ${soles(discount)}; ${soles(price)} − ${soles(discount)} = ${soles(sale)}.`, undefined, undefined, [discount, price + discount]);
}

// 6.° X.7: porcentajes: impuesto, propina, recargo y más.
export function taxTipMarkup(r: Rng): Question {
  const price = r.int(2, 60) * 500;
  const form = r.int(0, 3);
  if (form === 0) {
    const tax = (price * 18) / 100;
    return money(r, price + tax, `Un producto cuesta ${soles(price)} sin impuestos. Con el IGV (18 %), ¿cuánto se paga?`, `IGV: 18 % de ${soles(price)} = ${soles(tax)}; total ${soles(price + tax)}.`, undefined, "igv", [tax, price]);
  }
  if (form === 1) {
    const tip = (price * 10) / 100;
    return money(r, tip, `La cuenta del restaurante es de ${soles(price)} y se deja una propina del 10 %. ¿De cuánto es la propina?`, `10 % de ${soles(price)} = ${soles(tip)}.`, undefined, "propina", [price + tip]);
  }
  if (form === 2) {
    const p = r.pick([20, 25, 30, 50]);
    const up = (price * p) / 100;
    return money(r, price + up, `Una tienda compra un artículo a ${soles(price)} y le sube el ${pct(p)} para venderlo. ¿A cuánto lo vende?`, `Recargo: ${p} % de ${soles(price)} = ${soles(up)}; precio de venta ${soles(price + up)}.`, undefined, "recargo", [up, price - up]);
  }
  const p = r.pick([5, 10, 15]);
  const fee = (price * p) / 100;
  return money(r, fee, `Un vendedor gana una comisión del ${pct(p)} por cada venta. Si vende algo de ${soles(price)}, ¿cuánto gana de comisión?`, `${p} % de ${soles(price)} = ${soles(fee)}.`, undefined, "comision", [price - fee]);
}

// 6.° X.8: interés simple.
export function simpleInterest(r: Rng): Question {
  const capital = r.int(1, 40) * 100;
  const rate = r.pick([2, 3, 4, 5, 6, 8, 10]);
  const years = r.int(1, 6);
  const interest = (capital * rate * years) / 100;
  if (r.chance(0.7)) return numQ(interest, `Se depositan ${fmt(capital)} soles a un interés simple del ${pct(rate)} anual. ¿Cuántos soles de interés se ganan en ${years} ${years === 1 ? "año" : "años"}?`, "I = capital × tasa × tiempo", `${fmt(capital)} × ${rate}/100 × ${years} = ${fmt(interest)} soles.`, "interes");
  return numQ(capital + interest, `Se depositan ${fmt(capital)} soles a un interés simple del ${pct(rate)} anual. ¿Cuánto dinero habrá en total después de ${years} ${years === 1 ? "año" : "años"}?`, "I = capital × tasa × tiempo", `Interés: ${fmt(capital)} × ${rate}/100 × ${years} = ${fmt(interest)}; total ${fmt(capital + interest)} soles.`, "monto-final");
}

