import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, SYMBOLS, choiceQ, fixedQ, fmt, mixed, numQ, sym, table } from "./kit";

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

// 4.° GG.4 – GG.11 / HH.2 – HH.8: convertir, comparar, tablas de conversión,
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

// 4.° GG.1: medir con una regla en pulgadas (cuartos de pulgada).
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

// 4.° GG.2 / HH.1: ¿qué unidad conviene?
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

// 4.° GG.3: elegir el instrumento de medición.
export function measuringTool(r: Rng): Question {
  const [thing, answer, wrong] = r.pick(TOOLS);
  return choiceQ(r, `¿Qué instrumento conviene para medir ${thing}?`, answer, wrong, `Para medir ${thing} se usa: ${answer.toLowerCase()}.`, undefined, answer.toLowerCase());
}

// 4.° II.1: problemas de medición.
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

// 4.° II.2: problemas de medición con fracciones.
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

// 4.° II.3: problemas de varios pasos con conversiones.
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
