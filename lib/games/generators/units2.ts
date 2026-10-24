import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, SYMBOLS, choiceQ, d3, decQ, fixedQ, fmt, intQ, mixed, numQ, sg, sym, table } from "./kit";

// Unidades de medida de 4.° en adelante: sistema métrico y unidades
// anglosajonas (pulgadas, libras, galones...). En las anglosajonas la
// equivalencia siempre se muestra, porque no se usan a diario en el Perú.

export type Magnitude = "longitud" | "masa" | "capacidad";
export type System = "metrico" | "anglosajon";
type Pair = { big: string; small: string; factor: number; kind: Magnitude };

const PAIRS: Record<System, Pair[]> = {
  metrico: [
    { big: "cm", small: "mm", factor: 10, kind: "longitud" },
    { big: "m", small: "cm", factor: 100, kind: "longitud" },
    { big: "km", small: "m", factor: 1000, kind: "longitud" },
    { big: "kg", small: "g", factor: 1000, kind: "masa" },
    { big: "t", small: "kg", factor: 1000, kind: "masa" },
    { big: "l", small: "ml", factor: 1000, kind: "capacidad" },
  ],
  anglosajon: [
    { big: "pies", small: "pulgadas", factor: 12, kind: "longitud" },
    { big: "yardas", small: "pies", factor: 3, kind: "longitud" },
    { big: "libras", small: "onzas", factor: 16, kind: "masa" },
    { big: "galones", small: "cuartos", factor: 4, kind: "capacidad" },
    { big: "cuartos", small: "pintas", factor: 2, kind: "capacidad" },
    { big: "pintas", small: "tazas", factor: 2, kind: "capacidad" },
  ],
};
const ONE: Record<string, string> = { pies: "pie", yardas: "yarda", libras: "libra", galones: "galón", cuartos: "cuarto", pintas: "pinta", pulgadas: "pulgada", onzas: "onza", tazas: "taza" };
const q = (n: number, unit: string) => `${fmt(n)} ${n === 1 ? ONE[unit] ?? unit : unit}`;
const rule = (p: Pair) => `1 ${ONE[p.big] ?? p.big} = ${fmt(p.factor)} ${p.small}`;
const pick = (r: Rng, system: System, kind: Magnitude | "any") => r.pick(PAIRS[system].filter((p) => kind === "any" || p.kind === kind));
const count = (r: Rng, p: Pair) => r.int(2, p.factor >= 1000 ? 9 : 12);

export type UnitMode = "convert" | "compare" | "table" | "mixed" | "addsub";

// Convertir, comparar, tablas de conversión,
// unidades mixtas y sumas o restas con unidades mixtas.
export function unitWork(r: Rng, system: System, kind: Magnitude | "any", mode: UnitMode): Question {
  const p = pick(r, system, kind);
  const hint = system === "anglosajon" ? ` (${rule(p)})` : "";
  const n = count(r, p);
  if (mode === "convert") {
    return r.chance(0.6)
      ? numQ(n * p.factor, `Convierte.${hint}`, `${q(n, p.big)} = ? ${p.small}`, `${rule(p)}; ${n} × ${fmt(p.factor)} = ${fmt(n * p.factor)}.`, `${p.big}-a-${p.small}`)
      : numQ(n, `Convierte.${hint}`, `${q(n * p.factor, p.small)} = ? ${p.big}`, `${rule(p)}; ${fmt(n * p.factor)} ÷ ${fmt(p.factor)} = ${n}.`, `${p.small}-a-${p.big}`);
  }
  if (mode === "compare") {
    const step = p.factor >= 100 ? p.factor / 10 : p.factor >= 10 ? 2 : 1;
    const other = r.chance(0.25) ? n * p.factor : Math.max(1, n * p.factor + r.pick([-1, 1]) * step * r.int(1, 4));
    const left = r.chance(0.5);
    const [a, b] = left ? [n * p.factor, other] : [other, n * p.factor];
    const s = sym(a, b);
    return fixedQ(`Elige el símbolo correcto.${hint}`, SYMBOLS, s, `${q(n, p.big)} = ${q(n * p.factor, p.small)}.`, left ? `${q(n, p.big)}  ?  ${q(other, p.small)}` : `${q(other, p.small)}  ?  ${q(n, p.big)}`, s);
  }
  if (mode === "table") {
    const start = r.int(1, 4);
    const xs = [start, start + 1, start + 2, start + 3];
    const hidden = r.int(1, 3);
    const backwards = r.chance(0.3);
    // Los símbolos (kg, ml...) no llevan mayúscula; los nombres (pies, libras...) sí.
    const head = (u: string) => (system === "metrico" ? u : u[0].toUpperCase() + u.slice(1));
    return numQ(backwards ? xs[hidden] : xs[hidden] * p.factor, `Completa la tabla de conversión.${hint}`, table([head(p.big), head(p.small)], xs.map((x, i) => [i === hidden && backwards ? "?" : fmt(x), i === hidden && !backwards ? "?" : fmt(x * p.factor)])), `${rule(p)}; ${xs[hidden]} × ${fmt(p.factor)} = ${fmt(xs[hidden] * p.factor)}.`, `${p.big}-${p.small}`);
  }
  const small = () => (p.factor >= 100 ? r.int(1, p.factor / 10 - 1) * 10 : r.int(1, p.factor - 1));
  if (mode === "mixed") {
    const rest = p.factor === 2 ? 1 : small();
    const total = n * p.factor + rest;
    return r.chance(0.5)
      ? numQ(total, `Convierte.${hint}`, `${q(n, p.big)} ${q(rest, p.small)} = ? ${p.small}`, `${n} × ${fmt(p.factor)} = ${fmt(n * p.factor)}; ${fmt(n * p.factor)} + ${rest} = ${fmt(total)}.`, `a-${p.small}`)
      : numQ(rest, `Convierte. ¿Qué número falta?${hint}`, `${q(total, p.small)} = ${q(n, p.big)} ? ${p.small}`, `${q(n, p.big)} son ${fmt(n * p.factor)} ${p.small}; ${fmt(total)} − ${fmt(n * p.factor)} = ${rest}.`, `desde-${p.small}`);
  }
  // Sumas y restas con unidades mixtas (solo pares con factor > 2).
  if (p.factor <= 3) return unitWork(r, system, kind, mode);
  const a = n * p.factor + small();
  const b = r.int(1, n) * p.factor + small();
  const add = r.chance(0.5) || a <= b;
  const answer = add ? a + b : a - b;
  const show = (x: number) => (x % p.factor === 0 ? q(x / p.factor, p.big) : x < p.factor ? q(x, p.small) : `${q(Math.floor(x / p.factor), p.big)} ${q(x % p.factor, p.small)}`);
  const stepUnit = p.factor >= 100 ? 10 : 1;
  const wrong = [answer + p.factor, answer - p.factor, answer + stepUnit, answer - stepUnit, answer + 2 * stepUnit].filter((x) => x > 0 && x !== answer).map(show);
  return choiceQ(r, `Resuelve.${hint}`, show(answer), wrong, `${show(a)} ${add ? "+" : "−"} ${show(b)} = ${show(answer)}.`, `${show(a)} ${add ? "+" : "−"} ${show(b)} = ?`, add ? "suma" : "resta");
}

// Medir con una regla en pulgadas (cuartos de pulgada).
export function inchRuler(r: Rng): Question {
  const quarters = r.int(3, 38);
  const show = (x: number) => mixed(x / (x % 4 === 0 ? 4 : x % 2 === 0 ? 2 : 1), 4 / (x % 4 === 0 ? 4 : x % 2 === 0 ? 2 : 1));
  return choiceQ(r, "¿Cuánto mide la barra verde, en pulgadas?", show(quarters), [quarters + 1, quarters - 1, quarters + 2, quarters + 4, quarters - 4].filter((x) => x > 0).map(show), `Cada pulgada está dividida en 4 partes iguales (cuartos). La barra llega hasta ${show(quarters)}.`, { kind: "ruler", length: quarters / 4, unit: "pulgadas", sub: 4 });
}

type Bank = [thing: string, answer: string][];
const CUSTOMARY: Bank = [
  ["el largo de un lápiz", "Pulgadas"], ["el ancho de un celular", "Pulgadas"], ["el largo de una llave", "Pulgadas"],
  ["la altura de una puerta", "Pies"], ["el largo de una cama", "Pies"], ["la altura de una persona", "Pies"],
  ["el largo de una cancha de fútbol", "Yardas"], ["el largo de una piscina", "Yardas"],
  ["la distancia entre dos ciudades", "Millas"], ["el recorrido de un avión", "Millas"],
  ["el peso de una carta", "Onzas"], ["el peso de una galleta", "Onzas"],
  ["el peso de un perro", "Libras"], ["el peso de una sandía", "Libras"],
  ["el peso de un camión", "Toneladas"], ["el peso de un elefante", "Toneladas"],
  ["el jugo de un vaso", "Tazas"], ["la leche para un queque", "Tazas"],
  ["el agua de una piscina", "Galones"], ["la gasolina de un auto", "Galones"],
];
const CUSTOMARY_GROUPS = [["Pulgadas", "Pies", "Yardas", "Millas"], ["Onzas", "Libras", "Toneladas"], ["Tazas", "Pintas", "Galones"]];
const METRIC: Bank = [
  ["el grosor de una moneda", "Milímetros"], ["el largo de una hormiga", "Milímetros"],
  ["el largo de un lápiz", "Centímetros"], ["el ancho de un cuaderno", "Centímetros"],
  ["el largo de un salón", "Metros"], ["la altura de un edificio", "Metros"],
  ["la distancia entre dos ciudades", "Kilómetros"], ["el largo de un río", "Kilómetros"],
  ["la masa de un clip", "Gramos"], ["la masa de una galleta", "Gramos"],
  ["la masa de una persona", "Kilogramos"], ["la masa de un saco de arroz", "Kilogramos"],
  ["la masa de un camión", "Toneladas"], ["la masa de una ballena", "Toneladas"],
  ["el jarabe de una cuchara", "Mililitros"], ["el perfume de un frasco", "Mililitros"],
  ["el agua de un balde", "Litros"], ["la gasolina de un tanque", "Litros"],
];
const METRIC_GROUPS = [["Milímetros", "Centímetros", "Metros", "Kilómetros"], ["Gramos", "Kilogramos", "Toneladas"], ["Mililitros", "Litros"]];

// ¿qué unidad conviene?
export function appropriateUnit(r: Rng, system: System): Question {
  const [thing, answer] = r.pick(system === "metrico" ? METRIC : CUSTOMARY);
  const group = (system === "metrico" ? METRIC_GROUPS : CUSTOMARY_GROUPS).find((g) => g.includes(answer))!;
  return fixedQ(`¿Qué unidad conviene para medir ${thing}?`, group, answer, `Para ${thing} conviene usar ${answer.toLowerCase()}.`, undefined, answer.toLowerCase());
}

const TOOLS: [string, string, string[]][] = [
  ["el largo de un cuaderno", "Regla", ["Balanza", "Reloj", "Termómetro"]],
  ["el peso de una bolsa de papas", "Balanza", ["Regla", "Reloj", "Jarra medidora"]],
  ["la temperatura de un niño con fiebre", "Termómetro", ["Balanza", "Regla", "Cronómetro"]],
  ["cuánto dura una carrera", "Cronómetro", ["Cinta métrica", "Balanza", "Termómetro"]],
  ["la cantidad de leche para una receta", "Jarra medidora", ["Regla", "Termómetro", "Cronómetro"]],
  ["el largo de un salón", "Cinta métrica", ["Balanza", "Jarra medidora", "Termómetro"]],
  ["la hora de salida del colegio", "Reloj", ["Regla", "Balanza", "Termómetro"]],
  ["la abertura de un ángulo", "Transportador", ["Balanza", "Reloj", "Jarra medidora"]],
  ["el peso de un anillo", "Balanza", ["Cinta métrica", "Termómetro", "Transportador"]],
  ["la temperatura del agua de una olla", "Termómetro", ["Cronómetro", "Regla", "Jarra medidora"]],
  ["el contorno de la cintura", "Cinta métrica", ["Termómetro", "Cronómetro", "Jarra medidora"]],
  ["los días que faltan para las vacaciones", "Calendario", ["Cronómetro", "Regla", "Balanza"]],
  ["el agua que cabe en una botella", "Jarra medidora", ["Balanza", "Cinta métrica", "Reloj"]],
  ["el tiempo que tarda en hervir un huevo", "Cronómetro", ["Calendario", "Balanza", "Regla"]],
  ["el ancho de una hoja de papel", "Regla", ["Jarra medidora", "Cronómetro", "Calendario"]],
];

// Elegir el instrumento de medición.
export function measuringTool(r: Rng): Question {
  const [thing, answer, wrong] = r.pick(TOOLS);
  return choiceQ(r, `¿Qué instrumento conviene para medir ${thing}?`, answer, wrong, `Para medir ${thing} se usa: ${answer.toLowerCase()}.`, undefined, answer.toLowerCase());
}

// Problemas de medición.
export function measurementProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  const a = r.int(12, 95);
  const b = r.int(3, 11);
  const forms: [string, number, string][] = [
    [`Una cinta mide ${a} cm y otra mide ${a + b * 3} cm. ¿Cuántos centímetros miden juntas?`, 2 * a + b * 3, `${a} + ${a + b * 3} = ${2 * a + b * 3} cm`],
    [`Cada botella tiene ${a * 10} ml de jugo. ¿Cuántos mililitros hay en ${b} botellas?`, a * 10 * b, `${b} × ${a * 10} = ${fmt(a * 10 * b)} ml`],
    [`${name} corta una tabla de ${a * b} cm en ${b} trozos iguales. ¿Cuántos centímetros mide cada trozo?`, a, `${a * b} ÷ ${b} = ${a} cm`],
    [`Un saco tenía ${a + b} kg de arroz y se vendieron ${b} kg. ¿Cuántos kilogramos quedan?`, a, `${a + b} − ${b} = ${a} kg`],
    [`${name} camina ${a * 10} m cada día para ir al colegio. ¿Cuántos metros camina en ${b} días?`, a * 10 * b, `${b} × ${a * 10} = ${fmt(a * 10 * b)} m`],
    [`Una caja pesa ${a * 5} g. ¿Cuántos gramos pesan ${b} cajas iguales?`, a * 5 * b, `${b} × ${a * 5} = ${fmt(a * 5 * b)} g`],
  ];
  const [text, answer, why] = r.pick(forms);
  return numQ(answer, text, undefined, `${why}.`);
}

// Problemas de medición con fracciones.
export function measurementFractionProblem(r: Rng): Question {
  const d = r.pick([2, 3, 4, 5]);
  const n = r.int(1, d - 1);
  const k = r.int(2, 6);
  const name = r.pick(NAMES);
  if (r.chance(0.5)) {
    const total = k * n;
    return choiceQ(r, `Cada vaso tiene ${n}/${d} de litro de chicha. ¿Cuántos litros hay en ${k} vasos?`, mixed(total, d), [mixed(total + 1, d), mixed(k + n, d), mixed(total, d + 1), mixed(n, d * k), mixed(total + d, d)].filter((x) => x !== mixed(total, d)), `${k} × ${n}/${d} = ${total}/${d}${total >= d ? ` = ${mixed(total, d)}` : ""} litros.`, undefined, "multiplicar");
  }
  const each = r.int(2, 12) * 10;
  return numQ(each * n, `Una cuerda mide ${each * d} cm. ${name} usa ${n}/${d} de la cuerda. ¿Cuántos centímetros usa?`, undefined, `${each * d} ÷ ${d} = ${each}; ${each} × ${n} = ${each * n} cm.`, "fraccion-de-cantidad");
}

// Problemas de varios pasos con conversiones.
export function conversionProblem(r: Rng): Question {
  const name = r.pick(NAMES);
  const m = r.int(2, 9);
  const k = r.int(2, 5);
  const piece = r.int(2, Math.floor((m * 100) / k / 10) - 1) * 10;
  const forms: [string, number, string][] = [
    [`${name} tiene ${m} m de cinta y corta ${k} trozos de ${piece} cm. ¿Cuántos centímetros de cinta le quedan?`, m * 100 - k * piece, `${m} m = ${m * 100} cm; ${k} × ${piece} = ${k * piece}; ${m * 100} − ${k * piece} = ${m * 100 - k * piece} cm`],
    [`Una jarra tiene ${m} l de limonada. Se sirven ${k} vasos de ${piece * 2} ml. ¿Cuántos mililitros quedan en la jarra?`, m * 1000 - k * piece * 2, `${m} l = ${fmt(m * 1000)} ml; ${k} × ${piece * 2} = ${fmt(k * piece * 2)}; quedan ${fmt(m * 1000 - k * piece * 2)} ml`],
    [`${name} compra ${m} kg de arroz y ${piece * 5} g de lentejas. ¿Cuántos gramos compra en total?`, m * 1000 + piece * 5, `${m} kg = ${fmt(m * 1000)} g; ${fmt(m * 1000)} + ${piece * 5} = ${fmt(m * 1000 + piece * 5)} g`],
    [`Un camino mide ${m} km. ${name} ya recorrió ${fmt(piece * 10)} m. ¿Cuántos metros le faltan?`, m * 1000 - piece * 10, `${m} km = ${fmt(m * 1000)} m; ${fmt(m * 1000)} − ${fmt(piece * 10)} = ${fmt(m * 1000 - piece * 10)} m`],
    [`Una película dura ${m > 3 ? 2 : m} h ${piece > 50 ? 30 : 15} min. ¿Cuántos minutos dura?`, (m > 3 ? 2 : m) * 60 + (piece > 50 ? 30 : 15), `${m > 3 ? 2 : m} × 60 = ${(m > 3 ? 2 : m) * 60}; más ${piece > 50 ? 30 : 15} min`],
  ];
  const [text, answer, why] = r.pick(forms);
  return numQ(answer, text, undefined, `${why}.`);
}

// Convertir unidades anglosajonas con fracciones.
export function customaryFractions(r: Rng): Question {
  const [big, small, factor, dens] = r.pick<[string, string, number, number[]]>([["pie", "pulgadas", 12, [2, 3, 4, 6]], ["libra", "onzas", 16, [2, 4, 8]], ["yarda", "pies", 3, [3]], ["galón", "cuartos", 4, [2, 4]], ["hora", "minutos", 60, [2, 3, 4, 6]]]);
  const d = r.pick(dens);
  const n = r.int(1, d - 1);
  const w = r.chance(0.4) ? r.int(1, 3) : 0;
  const answer = w * factor + (factor / d) * n;
  const plural = big === "galón" ? "galones" : `${big}s`;
  const amount = w ? `${w} ${n}/${d} ${plural}` : `${n}/${d} de ${big}`;
  return numQ(answer, `Convierte. (1 ${big} = ${factor} ${small})`, `${amount} = ? ${small}`, `${n}/${d} de ${factor} = ${(factor / d) * n}${w ? `; ${w} × ${factor} = ${w * factor}; en total ${answer}` : ""} ${small}.`, big);
}

// Problemas de varios pasos con unidades anglosajonas.
export function customaryMultiStep(r: Rng): Question {
  const name = r.pick(NAMES);
  const a = r.int(2, 6);
  const b = r.int(1, 11);
  const k = r.int(2, 5);
  const forms: [string, number, string][] = [
    [`${name} mide ${a} pies ${b} pulgadas. Su hermano mide ${k} pulgadas menos. ¿Cuántas pulgadas mide su hermano? (1 pie = 12 pulgadas)`, a * 12 + b - k, `${a} × 12 + ${b} = ${a * 12 + b}; ${a * 12 + b} − ${k} = ${a * 12 + b - k} pulgadas`],
    [`Una receta lleva ${a} libras de harina y ${b} onzas de azúcar. ¿Cuántas onzas pesan los dos ingredientes juntos? (1 libra = 16 onzas)`, a * 16 + b, `${a} × 16 = ${a * 16}; ${a * 16} + ${b} = ${a * 16 + b} onzas`],
    [`${name} compra ${k} cintas de ${a} yardas cada una. ¿Cuántos pies de cinta tiene? (1 yarda = 3 pies)`, k * a * 3, `${k} × ${a} = ${k * a} yardas; ${k * a} × 3 = ${k * a * 3} pies`],
    [`Un bidón tiene ${a} galones de jugo. Se sirven ${k} cuartos. ¿Cuántos cuartos quedan? (1 galón = 4 cuartos)`, a * 4 - k, `${a} × 4 = ${a * 4}; ${a * 4} − ${k} = ${a * 4 - k} cuartos`],
  ];
  const [text, answer, why] = r.pick(forms);
  return numQ(answer, text, undefined, `${why}.`);
}

const ESTIMATES: Record<System, [string, string, string[]][]> = {
  anglosajon: [
    ["la altura de una puerta", "7 pies", ["7 pulgadas", "7 yardas", "7 millas"]],
    ["el largo de un lápiz", "7 pulgadas", ["7 pies", "7 yardas", "70 pies"]],
    ["el largo de una cancha de fútbol", "100 yardas", ["100 pulgadas", "100 millas", "10 pies"]],
    ["el peso de una manzana", "6 onzas", ["6 libras", "6 toneladas", "60 libras"]],
    ["el peso de un perro mediano", "40 libras", ["40 onzas", "40 toneladas", "4 onzas"]],
    ["la gasolina del tanque de un auto", "12 galones", ["12 tazas", "12 pintas", "120 galones"]],
    ["la leche de un vaso", "1 taza", ["1 galón", "10 galones", "10 cuartos"]],
    ["la distancia entre dos ciudades vecinas", "30 millas", ["30 pies", "30 yardas", "30 pulgadas"]],
    ["el peso de un auto", "1 tonelada", ["1 libra", "100 onzas", "10 libras"]],
    ["el ancho de una mano", "4 pulgadas", ["4 pies", "4 yardas", "40 pulgadas"]],
    ["el largo de una cama", "6 pies", ["6 pulgadas", "60 pies", "6 millas"]],
    ["el agua de un balde", "3 galones", ["3 tazas", "30 galones", "3 pintas"]],
  ],
  metrico: [
    ["la altura de una puerta", "2 m", ["2 cm", "2 km", "20 m"]],
    ["el largo de un lápiz", "18 cm", ["18 mm", "18 m", "180 cm"]],
    ["la distancia entre dos ciudades vecinas", "50 km", ["50 m", "50 cm", "500 m"]],
    ["la masa de una manzana", "150 g", ["150 kg", "15 kg", "1,5 g"]],
    ["la masa de un perro mediano", "18 kg", ["18 g", "180 g", "18 t"]],
    ["el agua de una botella personal", "600 ml", ["600 l", "6 l", "6 ml"]],
    ["el agua de un balde", "10 l", ["10 ml", "100 ml", "1000 l"]],
    ["el grosor de una moneda", "2 mm", ["2 cm", "2 m", "20 cm"]],
    ["la masa de un auto", "1 t", ["1 kg", "100 g", "10 kg"]],
    ["el largo de un salón de clases", "8 m", ["8 cm", "8 km", "80 cm"]],
    ["la masa de un clip", "1 g", ["1 kg", "100 g", "10 kg"]],
    ["el jarabe de una cucharadita", "5 ml", ["5 l", "50 l", "500 ml"]],
  ],
};

// Estimar medidas.
export function estimateMeasure(r: Rng, system: System): Question {
  const [thing, answer, wrong] = r.pick(ESTIMATES[system]);
  return choiceQ(r, `¿Cuál es la mejor estimación de ${thing}?`.replace(" de el ", " del "), answer, wrong, `Lo razonable para ${thing} es ${answer}.`, undefined, system);
}

// Multiplicar y dividir unidades anglosajonas mixtas.
export function multiplyMixedCustomary(r: Rng): Question {
  const [big, small, factor] = r.pick<[string, string, number]>([["pies", "pulgadas", 12], ["libras", "onzas", 16], ["yardas", "pies", 3], ["galones", "cuartos", 4]]);
  const k = r.int(2, 5);
  const a = r.int(1, 4) * factor + r.int(1, factor - 1);
  const show = (x: number) => (x % factor === 0 ? q(x / factor, big) : x < factor ? q(x, small) : `${q(Math.floor(x / factor), big)} ${q(x % factor, small)}`);
  const one = ONE[big] ?? big;
  const hint = `(1 ${one} = ${factor} ${small})`;
  const wrong = (answer: number) => [answer + factor, answer - factor, answer + 1, answer - 1, answer + 2].filter((x) => x > 0 && x !== answer).map(show);
  if (r.chance(0.5)) return choiceQ(r, `Resuelve. ${hint}`, show(a * k), wrong(a * k), `${show(a)} = ${a} ${small}; ${a} × ${k} = ${a * k} ${small} = ${show(a * k)}.`, `${k} × (${show(a)}) = ?`, "multiplicar");
  return choiceQ(r, `Resuelve. ${hint}`, show(a), wrong(a), `${show(a * k)} = ${a * k} ${small}; ${a * k} ÷ ${k} = ${a} ${small} = ${show(a)}.`, `(${show(a * k)}) ÷ ${k} = ?`, "dividir");
}

// Equivalencias aproximadas entre sistemas (en milésimos de la unidad métrica).
const CROSS: [string, string, number, string][] = [["pulgadas", "cm", 2500, "1 pulgada ≈ 2,5 cm"], ["millas", "km", 1600, "1 milla ≈ 1,6 km"], ["libras", "kg", 450, "1 libra ≈ 0,45 kg"], ["galones", "l", 3800, "1 galón ≈ 3,8 l"], ["pies", "cm", 30000, "1 pie ≈ 30 cm"], ["yardas", "m", 900, "1 yarda ≈ 0,9 m"]];

// Convertir entre el sistema anglosajón y el métrico.
export function convertBetweenSystems(r: Rng, bothWays: boolean): Question {
  const [customary, metric, rate, rule] = r.pick(CROSS);
  const n = r.int(2, 20);
  const total = n * rate;
  if (bothWays && r.chance(0.5)) return numQ(n, `Convierte usando la equivalencia: ${rule}.`, `${d3(total)} ${metric} ≈ ? ${customary}`, `${d3(total)} ÷ ${d3(rate)} = ${n} ${customary}.`, "a-anglosajon");
  return decQ(r, `Convierte usando la equivalencia: ${rule}.`, total, `${n} × ${d3(rate)} = ${d3(total)} ${metric}.`, `${n} ${customary} ≈ ? ${metric}`, "a-metrico", [total * 10, total / 10, n * 1000].filter(Number.isInteger));
}

// Convertir entre grados Celsius y Fahrenheit.
export function celsiusFahrenheit(r: Rng): Question {
  const c = r.int(-4, 20) * 5;
  const f = (c * 9) / 5 + 32;
  if (r.chance(0.5)) return intQ(r, "Convierte a grados Fahrenheit. °F = °C × 9 ÷ 5 + 32", f, `${sg(c)} × 9 ÷ 5 = ${sg((c * 9) / 5)}; ${sg((c * 9) / 5)} + 32 = ${sg(f)} °F.`, `${sg(c)} °C = ? °F`, "a-fahrenheit", [c + 32, (c * 9) / 5, f + 32]);
  return intQ(r, "Convierte a grados Celsius. °C = (°F − 32) × 5 ÷ 9", c, `${sg(f)} − 32 = ${sg(f - 32)}; ${sg(f - 32)} × 5 ÷ 9 = ${sg(c)} °C.`, `${sg(f)} °F = ? °C`, "a-celsius", [f - 32, ((f - 32) * 5) / 9 + 5]);
}
