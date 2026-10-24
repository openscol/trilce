import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, intQ, multiQ, numQ, par, sg, yesNo } from "../kit";
import { type SF, lin, nz, plane, pointQ, sfQ, sfdiv, sfshow, snorm } from "../sec1/util";
import { dec, sqrtText } from "../sec2/util";
import { coef, line10, valQ, xMinus } from "./util";

// Álgebra 1: números, expresiones, ecuaciones lineales, medición, unidades,
// inecuaciones compuestas, conjuntos, valor absoluto, plano y variación.

// ---------------------------------------------------------------------------
// Números

// Simplificar fracciones complejas.
export function complexFraction(r: Rng): Question {
  const a: SF = [nz(r, 7), r.int(2, 9)], b: SF = [r.int(1, 7), r.int(2, 9)];
  if (r.chance(0.3)) {
    const w = nz(r, 6);
    return sfQ(r, "Simplifica la fracción compleja.", sfdiv([w, 1], b), `Dividir entre ${sfshow(b)} es multiplicar por su inverso: ${sg(w)} × ${b[1]}/${b[0]} = ${sfshow(sfdiv([w, 1], b))}.`, `${sg(w)} / (${sfshow(b)})`, "entero");
  }
  return sfQ(r, "Simplifica la fracción compleja.", sfdiv(a, b), `Se multiplica el numerador por el inverso del denominador: ${sfshow(a)} × ${b[1]}/${b[0]} = ${sfshow(sfdiv(a, b))}.`, `(${sfshow(a)}) / (${sfshow(b)})`, "fracciones", [snorm([a[0] * b[0], a[1] * b[1]])]);
}

const IRR = ["√2", "√3", "√5", "√7", "√10", "π", "0,1010010001…", "√15", "2π", "√20"];
const RAT = ["√16", "√49", "0,75", "−3", "5/8", "0,333…", "√(1/4)", "1,2", "0", "√100", "−7/2"];
// Clasificar números en racionales e irracionales.
export function sortIrrational(r: Rng): Question {
  const irr = r.shuffle(IRR).slice(0, r.int(1, 3));
  const rat = r.shuffle(RAT).slice(0, 5 - irr.length);
  const asked = r.chance(0.5);
  const options = r.shuffle([...irr, ...rat]);
  return multiQ(`Selecciona todos los números ${asked ? "irracionales" : "racionales"}.`, options, asked ? irr : rat, "Un número es racional si se puede escribir como fracción de enteros (decimales finitos o periódicos y raíces exactas). Las raíces no exactas, π y los decimales infinitos no periódicos son irracionales.", undefined, asked ? "irracionales" : "racionales");
}

const OPS3 = ["Siempre racional", "Siempre irracional", "Puede ser racional o irracional"];
const CLOSURE: [string, number, string][] = [
  ["la suma de dos números racionales", 0, "Racional + racional siempre da una fracción de enteros."],
  ["el producto de dos números racionales", 0, "Racional × racional siempre da una fracción de enteros."],
  ["la suma de un número racional y uno irracional", 1, "Si la suma fuera racional, al restar el racional el irracional sería racional: imposible."],
  ["el producto de un número racional distinto de cero y uno irracional", 1, "Si fuera racional, al dividir entre el racional el irracional sería racional: imposible."],
  ["la suma de dos números irracionales", 2, "√2 + √2 = 2√2 es irracional, pero √2 + (−√2) = 0 es racional."],
  ["el producto de dos números irracionales", 2, "√2 × √3 = √6 es irracional, pero √2 × √2 = 2 es racional."],
];
// Propiedades de las operaciones con racionales e irracionales.
export function rationalClosure(r: Rng): Question {
  if (r.chance(0.4)) {
    const cases: [string, boolean, string][] = [["√2 + 3", false, "racional + irracional = irracional"], ["√9 + 1/2", true, "√9 = 3; 3 + 1/2 = 7/2"], ["√5 × √5", true, "√5 × √5 = 5"], ["2π", false, "racional (≠ 0) × irracional = irracional"], ["√8 ÷ √2", true, "√8 ÷ √2 = √4 = 2"], ["√3 + √3", false, "√3 + √3 = 2√3"], ["0,25 × 4", true, "0,25 × 4 = 1"], ["π − π", true, "π − π = 0"]];
    const [e, rat, why] = r.pick(cases);
    return fixedQ(`¿El resultado de ${e} es racional o irracional?`, ["Racional", "Irracional"], rat ? "Racional" : "Irracional", `${why}.`, undefined, rat ? "racional" : "irracional");
  }
  const [text, k, why] = r.pick(CLOSURE);
  return fixedQ(`¿Cómo es ${text}?`, OPS3, OPS3[k], why, undefined, ["racional", "irracional", "depende"][k]);
}

// ---------------------------------------------------------------------------
// Expresiones

// Evaluar expresiones con valores racionales.
export function evaluateRationalVar(r: Rng): Question {
  const x: SF = r.pick([[1, 2], [-1, 2], [1, 3], [-2, 3], [3, 4], [-3, 4], [5, 2]] as SF[]);
  const a = nz(r, 6), b = nz(r, 9);
  const val = snorm([a * x[0] + b * x[1], x[1]]);
  if (r.chance(0.5)) return sfQ(r, `Calcula el valor de la expresión cuando x = ${sfshow(x)}.`, val, `${sg(a)} × ${par(x[0])}/${x[1]} = ${sfshow(snorm([a * x[0], x[1]]))}; ${b < 0 ? "menos" : "más"} ${Math.abs(b)} da ${sfshow(val)}.`, lin(a, b), "fraccion");
  const xd = r.pick([0.5, -1.5, 2.5, -0.2, 1.2]);
  const v = Math.round((a * xd + b) * 100) / 100;
  return valQ(r, `Calcula el valor de la expresión cuando x = ${dec(xd)}.`, v, [-v, v + 1, a * xd - b, v - 0.5], `${sg(a)} × ${xd < 0 ? `(${dec(xd)})` : dec(xd)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${dec(v)}.`, lin(a, b), "decimal");
}

// Simplificar con términos semejantes y la propiedad distributiva.
export function simplifyDistribute(r: Rng): Question {
  const k1 = nz(r, 5), b1 = nz(r, 6), k2 = nz(r, 5), b2 = nz(r, 6);
  const A = k1 + k2, B = k1 * b1 + k2 * b2;
  const part = (k: number, b: number, first: boolean) => `${first ? (k < 0 ? "−" : "") : k < 0 ? " − " : " + "}${Math.abs(k) === 1 ? "" : Math.abs(k)}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`;
  const shown = part(k1, b1, true) + part(k2, b2, false);
  const good = lin(A, B);
  const wrong = [lin(A, k1 * b1 + b2), lin(A, -B), lin(k1 * k2, B), lin(A, k1 * b1 - k2 * b2), lin(A + 1, B)].filter((w) => w !== good);
  return choiceQ(r, "Simplifica la expresión.", good, wrong, `Se distribuye: ${lin(k1, k1 * b1)} y ${lin(k2, k2 * b2)}; luego se juntan los términos semejantes: ${good}.`, shown, "distributiva");
}

// ---------------------------------------------------------------------------
// Ecuaciones lineales

// Problemas de enteros consecutivos.
export function consecutiveIntegers(r: Rng): Question {
  const n = r.int(-20, 60), count = r.pick([2, 3, 3, 4]);
  const kind = r.pick(["", "pares", "impares"] as const);
  const step = kind ? 2 : 1;
  const first = kind === "pares" ? n * 2 : kind === "impares" ? n * 2 + 1 : n;
  const terms = Array.from({ length: count }, (_, i) => first + i * step);
  const total = terms.reduce((a, b) => a + b, 0);
  const which = r.pick(["menor", "mayor"] as const);
  const ans = which === "menor" ? terms[0] : terms[count - 1];
  return intQ(r, `La suma de ${count} números enteros ${kind ? `${kind} ` : ""}consecutivos es ${sg(total)}. ¿Cuál es el ${which} de ellos?`, ans, `Si el menor es n: ${terms.map((_, i) => (i ? `(n + ${i * step})` : "n")).join(" + ")} = ${sg(total)} → ${count}n + ${(step * count * (count - 1)) / 2} = ${sg(total)} → n = ${sg(terms[0])}. Los números son ${terms.map(sg).join(", ")}.`, undefined, kind || "consecutivos", [ans + step, ans - step, terms[Math.floor(count / 2)]]);
}

const REARRANGE: [string, string, string, string[], string][] = [
  ["A = bh", "h", "h = A/b", ["h = Ab", "h = b/A", "h = A − b"], "Se dividen los dos lados entre b."],
  ["P = 2l + 2w", "w", "w = (P − 2l)/2", ["w = P − 2l", "w = (P + 2l)/2", "w = P/2 − 2l"], "Se resta 2l y se divide entre 2."],
  ["d = vt", "t", "t = d/v", ["t = dv", "t = v/d", "t = d − v"], "Se dividen los dos lados entre v."],
  ["y = mx + b", "x", "x = (y − b)/m", ["x = (y + b)/m", "x = y/m − b", "x = m(y − b)"], "Se resta b y se divide entre m."],
  ["I = Crt", "r", "r = I/(Ct)", ["r = ICt", "r = Ct/I", "r = I − Ct"], "Se divide entre C·t."],
  ["V = lwh", "h", "h = V/(lw)", ["h = Vlw", "h = lw/V", "h = V − lw"], "Se divide entre l·w."],
  ["3x + 2y = 12", "y", "y = (12 − 3x)/2", ["y = (12 + 3x)/2", "y = 12 − 3x/2", "y = 6 − 3x"], "Se resta 3x y se divide entre 2."],
  ["F = (9/5)C + 32", "C", "C = (5/9)(F − 32)", ["C = (9/5)(F − 32)", "C = (5/9)F − 32", "C = (5/9)(F + 32)"], "Se resta 32 y se multiplica por 5/9."],
  ["A = (1/2)bh", "b", "b = 2A/h", ["b = A/(2h)", "b = 2Ah", "b = Ah/2"], "Se multiplica por 2 y se divide entre h."],
];
// Despejar una variable en ecuaciones con varias variables.
export function rearrange(r: Rng): Question {
  const [eq, v, good, wrong, why] = r.pick(REARRANGE);
  return choiceQ(r, `Despeja ${v} en la fórmula ${eq}.`, good, wrong, why, undefined, "despejar");
}

// ---------------------------------------------------------------------------
// Medición

const PREC: [string, string, string][] = [["4,3", "0,1", "décimo"], ["12", "1", "unidad"], ["7,25", "0,01", "centésimo"], ["30,0", "0,1", "décimo"], ["2,50", "0,01", "centésimo"], ["8,125", "0,001", "milésimo"]];
// Precisión.
export function precision(r: Rng): Question {
  if (r.chance(0.5)) {
    const [m, unit, name] = r.pick(PREC);
    return choiceQ(r, `Una longitud se midió como ${m} cm. ¿A qué unidad es precisa la medida?`, `Al ${name} de cm (${unit} cm)`, PREC.filter((p) => p[2] !== name).map((p) => `Al ${p[2]} de cm (${p[1]} cm)`).filter((x, i, a) => a.indexOf(x) === i), `La última cifra de ${m} está en el lugar de los ${name}s.`, undefined, "unidad");
  }
  const base = r.int(2, 9);
  const opts = [`${base} m`, `${base},4 m`, `${base},38 m`, `${base},375 m`];
  const most = r.chance(0.5);
  return choiceQ(r, `¿Qué medida es ${most ? "más" : "menos"} precisa?`, most ? opts[3] : opts[0], most ? opts.slice(0, 3) : opts.slice(1), `La medida más precisa es la que tiene la unidad más pequeña (más cifras decimales).`, undefined, most ? "mas" : "menos");
}

// Mayor error posible.
export function greatestError(r: Rng): Question {
  const [m, unit] = r.pick(PREC);
  const err = Number(unit.replace(",", ".")) / 2;
  const wrong = [Number(unit.replace(",", ".")), err / 10, err * 10].map((w) => Math.round(w * 10000) / 10000);
  return valQ(r, `Una longitud se midió como ${m} m. ¿Cuál es el mayor error posible, en metros?`, err, wrong, `La medida es precisa a ${unit} m; el mayor error posible es la mitad: ${dec(err)} m.`, undefined, "error");
}

// Área y volumen mínimos y máximos.
export function minMaxArea(r: Rng): Question {
  const l = r.int(4, 15), w = r.int(3, 12), max = r.chance(0.5);
  const L = max ? l + 0.5 : l - 0.5, W = max ? w + 0.5 : w - 0.5;
  const area = Math.round(L * W * 100) / 100;
  return valQ(r, `Un rectángulo mide ${l} cm por ${w} cm, medidos al centímetro más cercano. ¿Cuál es su área ${max ? "máxima" : "mínima"} posible, en cm²?`, area, [l * w, (l + (max ? -0.5 : 0.5)) * (w + (max ? -0.5 : 0.5)), area + 1, area - 0.5], `Cada lado puede variar 0,5 cm: ${dec(L)} × ${dec(W)} = ${dec(area)}.`, undefined, max ? "maxima" : "minima");
}

// Error porcentual de áreas y volúmenes.
export function percentErrorArea(r: Rng): Question {
  const real = r.pick([10, 20, 25, 40, 50]), off = r.pick([1, 2, 5].filter((o) => o < real / 2));
  const measured = real + off;
  const cube = r.chance(0.5);
  const A = cube ? real ** 3 : real ** 2, M = cube ? measured ** 3 : measured ** 2;
  const p = Math.round(((M - A) / A) * 1000) / 10;
  return valQ(r, `El lado real de un ${cube ? "cubo" : "cuadrado"} es ${real} cm, pero se midió ${measured} cm. ¿Cuál es el error porcentual ${cube ? "del volumen" : "del área"}? (Redondea a la décima.)`, p, [Math.round((off / real) * 1000) / 10, p + 1, Math.round(((M - A) / M) * 1000) / 10], `${cube ? "Volumen" : "Área"} real: ${fmt(A)}; medido: ${fmt(M)}. Error: ${fmt(M - A)} ÷ ${fmt(A)} ≈ ${dec(p)} %.`, undefined, cube ? "volumen" : "area");
}

// ---------------------------------------------------------------------------
// Problemas con unidades

// Conversiones de varios pasos.
export function multiStepConversion(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const v = r.pick([18, 36, 54, 72, 90, 108]);
    return numQ(v / 3.6, `Un auto va a ${v} km/h. ¿A cuántos metros por segundo va?`, undefined, `${v} km/h = ${v} × 1000 m ÷ 3600 s = ${fmt(v / 3.6)} m/s.`, "kmh-ms");
  }
  if (form === 1) {
    const l = r.pick([2, 3, 5, 6]);
    return numQ(l * 60 * 24, `Un caño gotea ${l} litros por minuto. ¿Cuántos litros gotea en un día?`, undefined, `${l} × 60 minutos × 24 horas = ${fmt(l * 1440)} litros.`, "dia");
  }
  const m = r.pick([2, 3, 4, 5]);
  return numQ(m * 10000, `Un terreno rectangular tiene ${m} hectáreas. Una hectárea es un cuadrado de 100 m de lado. ¿Cuántos m² tiene?`, undefined, `1 ha = 100 m × 100 m = 10 000 m²; ${m} × 10 000 = ${fmt(m * 10000)} m².`, "area");
}

// Velocidad, distancia y tiempo.
export function travelRate(r: Rng): Question {
  const name = r.pick(NAMES), v = r.pick([40, 45, 50, 60, 75, 80, 90]), t = r.pick([2, 3, 4, 1.5, 2.5]);
  const d = v * t;
  const form = r.int(0, 2);
  if (form === 0) return valQ(r, `${name} viaja a ${v} km/h durante ${dec(t)} horas. ¿Cuántos kilómetros recorre?`, d, [d + v / 2, d - v / 2, v + t, d * 2], `d = v × t = ${v} × ${dec(t)} = ${dec(d)} km.`, undefined, "distancia");
  if (form === 1) return valQ(r, `Un bus recorre ${fmt(d)} km a ${v} km/h. ¿Cuántas horas tarda?`, t, [t + 0.5, t - 0.5, d / 10, v / 10], `t = d ÷ v = ${fmt(d)} ÷ ${v} = ${dec(t)} h.`, undefined, "tiempo");
  const v2 = v + r.pick([10, 20]);
  const t2 = r.int(2, 5);
  return numQ(t2 * (v + v2), `Dos autos salen del mismo lugar a la misma hora en sentidos opuestos, a ${v} km/h y ${v2} km/h. ¿A qué distancia están después de ${t2} horas, en km?`, undefined, `Se alejan ${v} + ${v2} = ${v + v2} km cada hora: ${v + v2} × ${t2} = ${t2 * (v + v2)} km.`, "opuestos");
}

// Promedios ponderados.
export function weightedAverage(r: Rng): Question {
  if (r.chance(0.5)) {
    const w = r.pick([[30, 30, 40], [20, 30, 50], [25, 25, 50], [40, 40, 20]]);
    const notes = w.map(() => r.int(10, 20));
    const avg = Math.round(w.reduce((s, wi, i) => s + wi * notes[i], 0)) / 100;
    return valQ(r, `En un curso, las prácticas valen ${w[0]} %, el examen parcial ${w[1]} % y el final ${w[2]} %. ${r.pick(NAMES)} sacó ${notes.join(", ")} (en ese orden). ¿Cuál es su promedio ponderado?`, avg, [Math.round((notes.reduce((a, b) => a + b, 0) / 3) * 100) / 100, avg + 1, avg - 0.5], `${notes.map((n, i) => `${n} × ${dec(w[i] / 100)}`).join(" + ")} = ${dec(avg)}.`, undefined, "notas");
  }
  const k1 = r.int(2, 8), p1 = r.int(5, 12), k2 = r.int(2, 8), p2 = p1 + r.int(2, 10);
  const avg = Math.round(((k1 * p1 + k2 * p2) / (k1 + k2)) * 100) / 100;
  return valQ(r, `Se mezclan ${k1} kg de café de ${p1} soles el kilo con ${k2} kg de café de ${p2} soles el kilo. ¿Cuánto cuesta el kilo de la mezcla, en soles? (Redondea al céntimo.)`, avg, [(p1 + p2) / 2, avg + 1, Math.round(((k1 * p2 + k2 * p1) / (k1 + k2)) * 100) / 100], `(${k1} × ${p1} + ${k2} × ${p2}) ÷ ${k1 + k2} = ${k1 * p1 + k2 * p2} ÷ ${k1 + k2} ≈ ${dec(avg)}.`, undefined, "mezcla");
}

// ---------------------------------------------------------------------------
// Inecuaciones compuestas

type Comp = { kind: "and"; a: number; b: number; ca: boolean; cb: boolean } | { kind: "or"; a: number; b: number; ca: boolean; cb: boolean };
const compText = (c: Comp) => (c.kind === "and" ? `${sg(c.a)} ${c.ca ? "≤" : "<"} x ${c.cb ? "≤" : "<"} ${sg(c.b)}` : `x ${c.ca ? "≤" : "<"} ${sg(c.a)} o x ${c.cb ? "≥" : ">"} ${sg(c.b)}`);
const compLine = (c: Comp) => line10({ segments: c.kind === "and" ? [{ from: c.a, to: c.b, closedFrom: c.ca, closedTo: c.cb }] : [{ to: c.a, closedTo: c.ca }, { from: c.b, closedFrom: c.cb }] });
function randomComp(r: Rng): Comp {
  const a = r.int(-8, 4), b = r.int(a + 2, 8);
  return { kind: r.pick(["and", "or"] as const), a, b, ca: r.chance(0.5), cb: r.chance(0.5) };
}
const variants = (c: Comp): Comp[] => [{ ...c, ca: !c.ca }, { ...c, cb: !c.cb }, { ...c, kind: c.kind === "and" ? "or" : "and" }, { ...c, ca: !c.ca, cb: !c.cb }];

// Graficar inecuaciones compuestas / escribirlas a partir del gráfico.
export function compoundGraph(r: Rng, write: boolean): Question {
  const c = randomComp(r);
  const why = c.kind === "and" ? `Los números entre ${sg(c.a)} y ${sg(c.b)}; círculo lleno si el extremo se incluye (≤), vacío si no (<).` : `Dos partes: hacia la izquierda de ${sg(c.a)} y hacia la derecha de ${sg(c.b)}.`;
  if (write) return choiceQ(r, "¿Qué inecuación compuesta muestra la recta numérica?", compText(c), variants(c).map(compText), why, compLine(c), c.kind === "and" ? "y" : "o");
  const yes = r.chance(0.5);
  return yesNo(`¿La recta numérica muestra ${compText(c)}?`, yes, why, compLine(yes ? c : r.pick(variants(c))), c.kind === "and" ? "y" : "o");
}

// Resolver inecuaciones compuestas (y graficar sus soluciones).
export function solveCompound(r: Rng, graph: boolean): Question {
  const c = randomComp(r);
  const k = r.pick([2, 3, 4]), b = nz(r, 6);
  const t = (n: number) => k * n + b;
  const text = c.kind === "and"
    ? `${sg(t(c.a))} ${c.ca ? "≤" : "<"} ${lin(k, b)} ${c.cb ? "≤" : "<"} ${sg(t(c.b))}`
    : `${lin(k, b)} ${c.ca ? "≤" : "<"} ${sg(t(c.a))} o ${lin(k, b)} ${c.cb ? "≥" : ">"} ${sg(t(c.b))}`;
  const why = `Se ${b < 0 ? `suma ${-b}` : `resta ${b}`} y se divide entre ${k} en cada parte: ${compText(c)}.`;
  if (graph) {
    const yes = r.chance(0.5);
    return yesNo(`¿La recta numérica muestra las soluciones de ${text}?`, yes, why, compLine(yes ? c : r.pick(variants(c))), c.kind === "and" ? "y" : "o");
  }
  return choiceQ(r, "Resuelve la inecuación compuesta.", compText(c), variants(c).map(compText), why, text, c.kind === "and" ? "y" : "o");
}

// ---------------------------------------------------------------------------
// Conjuntos

const setText = (xs: number[]) => (xs.length ? `{${[...xs].sort((a, b) => a - b).map(sg).join(", ")}}` : "∅");
// Conjuntos, subconjuntos y complementos.
export function subsetsComplement(r: Rng): Question {
  const U = Array.from({ length: 8 }, (_, i) => i + 1);
  const A = r.shuffle(U).slice(0, r.int(3, 5)).sort((a, b) => a - b);
  if (r.chance(0.5)) {
    const comp = U.filter((x) => !A.includes(x));
    return choiceQ(r, `Si U = ${setText(U)} y A = ${setText(A)}, ¿cuál es el complemento de A?`, setText(comp), [setText(A), setText(comp.slice(1)), setText([...comp, A[0]])], "El complemento de A tiene los elementos de U que no están en A.", undefined, "complemento");
  }
  const yes = r.chance(0.5);
  const B = yes ? r.shuffle(A).slice(0, 2) : [A[0], U.find((x) => !A.includes(x))!];
  return yesNo(`Si A = ${setText(A)}, ¿B = ${setText(B)} es subconjunto de A?`, yes, yes ? "Todos los elementos de B están en A." : `${U.find((x) => !A.includes(x))} está en B pero no en A.`, undefined, "subconjunto");
}

// Notación por comprensión (set-builder).
export function setBuilder(r: Rng): Question {
  const a = r.int(-5, 3), b = r.int(a + 2, a + 5);
  const forms: [string, number[]][] = [
    [`{x | x es entero y ${sg(a)} ≤ x < ${sg(b)}}`, Array.from({ length: b - a }, (_, i) => a + i)],
    [`{x | x es entero y ${sg(a)} < x ≤ ${sg(b)}}`, Array.from({ length: b - a }, (_, i) => a + 1 + i)],
    [`{x | x es natural par y x < ${2 * Math.max(b, 2) + 4}}`, Array.from({ length: Math.max(b, 2) + 1 }, (_, i) => 2 * (i + 1))],
  ];
  const [text, xs] = r.pick(forms);
  const wrong = [setText([...xs, xs[xs.length - 1] + (xs[1] - xs[0] || 1)]), setText(xs.slice(1)), setText([xs[0] - (xs[1] - xs[0] || 1), ...xs])];
  return choiceQ(r, `¿Qué conjunto describe ${text}?`, setText(xs), wrong, "Se listan los elementos que cumplen la condición, revisando si los extremos se incluyen (≤) o no (<).", undefined, "comprension");
}

// Notación de intervalos.
export function intervalNotation(r: Rng): Question {
  const a = r.int(-8, 3), b = r.int(a + 1, 9);
  const ca = r.chance(0.5), cb = r.chance(0.5);
  const forms: [string, string, string[]][] = [
    [`${sg(a)} ${ca ? "≤" : "<"} x ${cb ? "≤" : "<"} ${sg(b)}`, `${ca ? "[" : "("}${sg(a)}, ${sg(b)}${cb ? "]" : ")"}`, [`${ca ? "(" : "["}${sg(a)}, ${sg(b)}${cb ? "]" : ")"}`, `${ca ? "[" : "("}${sg(a)}, ${sg(b)}${cb ? ")" : "]"}`, `${ca ? "(" : "["}${sg(a)}, ${sg(b)}${cb ? ")" : "]"}`]],
    [`x ${ca ? "≥" : ">"} ${sg(a)}`, `${ca ? "[" : "("}${sg(a)}, ∞)`, [`${ca ? "(" : "["}${sg(a)}, ∞)`, `(−∞, ${sg(a)}${ca ? "]" : ")"}`, `(−∞, ${sg(a)}${ca ? ")" : "]"}`]],
    [`x ${cb ? "≤" : "<"} ${sg(b)}`, `(−∞, ${sg(b)}${cb ? "]" : ")"}`, [`(−∞, ${sg(b)}${cb ? ")" : "]"}`, `${cb ? "[" : "("}${sg(b)}, ∞)`, `${cb ? "(" : "["}${sg(b)}, ∞)`]],
  ];
  const [ineqText, good, wrong] = r.pick(forms);
  return choiceQ(r, `¿Cómo se escribe ${ineqText} en notación de intervalos?`, good, wrong, "Corchete [ ] si el extremo se incluye; paréntesis ( ) si no se incluye o si es ∞.", undefined, "intervalo");
}

// Unión e intersección de conjuntos.
export function unionIntersection(r: Rng): Question {
  const U = Array.from({ length: 10 }, (_, i) => i + 1);
  const A = r.shuffle(U).slice(0, r.int(3, 5)), B = r.shuffle(U).slice(0, r.int(3, 5));
  const union = r.chance(0.5);
  const res = union ? [...new Set([...A, ...B])] : A.filter((x) => B.includes(x));
  const other = union ? A.filter((x) => B.includes(x)) : [...new Set([...A, ...B])];
  return choiceQ(r, `Si A = ${setText(A)} y B = ${setText(B)}, ¿cuánto es A ${union ? "∪" : "∩"} B?`, setText(res), [setText(other), setText(A), setText(B), setText(A.filter((x) => !B.includes(x))), setText([...new Set([...A, ...B, U.find((x) => !A.includes(x) && !B.includes(x)) ?? 10])])].filter((w) => w !== setText(res)), union ? "La unión junta los elementos de los dos conjuntos (sin repetir)." : "La intersección tiene solo los elementos que están en los dos conjuntos.", undefined, union ? "union" : "interseccion");
}

// ---------------------------------------------------------------------------
// Valor absoluto

// Ecuaciones con valor absoluto (resolver, graficar, escribir).
export function absEquation(r: Rng, mode: "solve" | "graph" | "write"): Question {
  const c = r.int(-5, 5), d = r.int(1, 5);
  const [x1, x2] = [c - d, c + d];
  const eq = `|${xMinus(c)}| = ${d}`;
  const sol = `x = ${sg(x1)} o x = ${sg(x2)}`;
  const why = `${xMinus(c)} = ${d} o ${xMinus(c)} = −${d}: ${sol}. Son los puntos a ${d} unidades de ${sg(c)}.`;
  if (mode === "write") {
    const wrong = [`|x ${c < 0 ? "−" : "+"} ${Math.abs(c)}| = ${d}`, `|x ${c < 0 ? "+" : "−"} ${Math.abs(c)}| = ${2 * d}`, `|x ${c < 0 ? "+" : "−"} ${d}| = ${Math.abs(c) || 1}`].map((w) => w.replace("|x − 0|", "|x|").replace("|x + 0|", "|x|"));
    return choiceQ(r, "¿Qué ecuación con valor absoluto tiene como soluciones los puntos marcados?", eq, wrong, `El punto medio es ${sg(c)} y la distancia a cada punto es ${d}: ${eq}.`, line10({ dots: [x1, x2] }), "escribir");
  }
  if (mode === "graph") {
    const yes = r.chance(0.5);
    const shown = yes ? [x1, x2] : r.pick([[x1 - 1, x2 + 1], [-x2, -x1], [c, x2]]);
    return yesNo(`¿La recta numérica muestra las soluciones de ${eq}?`, yes, why, line10({ dots: shown }), "graficar");
  }
  const k = r.pick([1, 1, 2, 3]);
  if (k > 1) {
    const e = `${k}|${xMinus(c)}| = ${k * d}`;
    return choiceQ(r, "Resuelve la ecuación.", sol, [`x = ${sg(x2)}`, `x = ${sg(-x1)} o x = ${sg(-x2)}`, `x = ${sg(c - k * d)} o x = ${sg(c + k * d)}`], `Se divide entre ${k}: ${eq}. ${why}`, e, "coeficiente");
  }
  return choiceQ(r, "Resuelve la ecuación.", sol, [`x = ${sg(x2)}`, `x = ${sg(-x1)} o x = ${sg(-x2)}`, `x = ${sg(c - d - 1)} o x = ${sg(c + d + 1)}`], why, eq, "resolver");
}

// Inecuaciones con valor absoluto.
export function absInequality(r: Rng, graph: boolean): Question {
  const c = r.int(-4, 4), d = r.int(1, 5);
  const less = r.chance(0.5), closed = r.chance(0.5);
  const op = less ? (closed ? "≤" : "<") : closed ? "≥" : ">";
  const text = `|x ${c < 0 ? "+" : "−"} ${Math.abs(c)}| ${op} ${d}`.replace("|x − 0|", "|x|").replace("|x + 0|", "|x|");
  const comp: Comp = { kind: less ? "and" : "or", a: c - d, b: c + d, ca: closed, cb: closed };
  const why = less ? `La distancia de x a ${sg(c)} es ${op} ${d}: ${compText(comp)}.` : `La distancia de x a ${sg(c)} es ${op} ${d}: ${compText(comp)}.`;
  if (graph) {
    const yes = r.chance(0.5);
    return yesNo(`¿La recta numérica muestra las soluciones de ${text}?`, yes, why, compLine(yes ? comp : r.pick(variants(comp))), less ? "menor" : "mayor");
  }
  return choiceQ(r, "Resuelve la inecuación.", compText(comp), variants(comp).map(compText), why, text, less ? "menor" : "mayor");
}

// ---------------------------------------------------------------------------
// Plano: punto medio y distancia

// Punto medio y distancia entre dos puntos.
export function midpointDistance(r: Rng, mode: "midpoint" | "endpoint" | "distance" | "mixed"): Question {
  const m = mode === "mixed" ? r.pick(["midpoint", "endpoint", "distance"] as const) : mode;
  if (m === "distance") {
    const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5]]);
    const A = { x: r.int(-6, 2), y: r.int(-6, 2) };
    const B = { x: A.x + a * r.pick([1, -1]), y: A.y + b * r.pick([1, -1]) };
    if (Math.abs(B.x) > 8 || Math.abs(B.y) > 8) return midpointDistance(r, mode);
    if (r.chance(0.3)) {
      const B2 = { x: A.x + r.int(1, 4), y: A.y + r.int(1, 4) };
      const d2 = (B2.x - A.x) ** 2 + (B2.y - A.y) ** 2;
      const t = Math.round(Math.sqrt(d2) * 10) / 10;
      return valQ(r, `¿Cuál es la distancia entre ${"("}${sg(A.x)}, ${sg(A.y)}) y (${sg(B2.x)}, ${sg(B2.y)})? Redondea a la décima.`, t, [t + 0.1, t - 0.2, B2.x - A.x + B2.y - A.y, d2], `d = √((${B2.x - A.x})² + (${B2.y - A.y})²) = √${d2} ≈ ${dec(t)}.`, undefined, "redondear");
    }
    return numQ(c, `¿Cuál es la distancia entre (${sg(A.x)}, ${sg(A.y)}) y (${sg(B.x)}, ${sg(B.y)})?`, plane([{ ...A, emoji: "A" }, { ...B, emoji: "B" }], undefined, 8), `d = √((${sg(B.x)} − ${par(A.x)})² + (${sg(B.y)} − ${par(A.y)})²) = √(${a * a} + ${b * b}) = ${sqrtText(c * c)} = ${c}.`, "distancia");
  }
  const A = { x: r.int(-8, 8), y: r.int(-8, 8) }, M = { x: r.int(-6, 6), y: r.int(-6, 6) };
  if (2 * M.x - A.x === A.x && 2 * M.y - A.y === A.y) return midpointDistance(r, mode);
  const B = { x: 2 * M.x - A.x, y: 2 * M.y - A.y };
  const ptx = (p: { x: number; y: number }) => `(${sg(p.x)}, ${sg(p.y)})`;
  if (m === "midpoint") return pointQ(r, `¿Cuál es el punto medio del segmento que une ${ptx(A)} y ${ptx(B)}?`, M, `M = ((${sg(A.x)} + ${par(B.x)}) ÷ 2, (${sg(A.y)} + ${par(B.y)}) ÷ 2) = ${ptx(M)}.`, undefined, "punto-medio", [{ x: (B.x - A.x) / 2 || 1, y: (B.y - A.y) / 2 || 1 }].filter((p) => Number.isInteger(p.x) && Number.isInteger(p.y)));
  return pointQ(r, `El punto medio de un segmento es ${ptx(M)} y uno de sus extremos es ${ptx(A)}. ¿Cuál es el otro extremo?`, B, `B = (2 × ${par(M.x)} − ${par(A.x)}, 2 × ${par(M.y)} − ${par(A.y)}) = ${ptx(B)}.`, undefined, "extremo");
}

// ---------------------------------------------------------------------------
// Variación inversa

// Variación directa e inversa.
export function inverseVariation(r: Rng, mode: "identify" | "write" | "solve"): Question {
  const k = r.pick([6, 12, 18, 24, 30, 36, 48, 60]);
  const xs = [1, 2, 3, 4, 6].filter((x) => k % x === 0);
  if (mode === "identify") {
    const kind = r.int(0, 2);
    const OPTS = ["Variación directa", "Variación inversa", "Ninguna de las dos"];
    if (r.chance(0.5)) {
      const c = k / 6;
      const eqs: [string, number][] = [[`y = ${coef(c + 1)}x`, 0], [`y = ${k}/x`, 1], [`xy = ${k}`, 1], [`y = x + ${c}`, 2], [`y = x/${c + 1}`, 0], [`y = ${coef(c)}x²`, 2]];
      const [eq, kk] = r.pick(eqs);
      return fixedQ(`¿Qué tipo de variación representa ${eq}?`, OPTS, OPTS[kk], kk === 0 ? "Es de la forma y = kx." : kk === 1 ? "Es de la forma y = k/x (el producto xy es constante)." : "No es de la forma y = kx ni y = k/x.", undefined, ["directa", "inversa", "ninguna"][kk]);
    }
    const pts = xs.slice(0, 4).map((x) => [x, kind === 0 ? (k / 6 + 1) * x : kind === 1 ? k / x : x + 3]);
    return fixedQ("¿Qué tipo de variación muestra la tabla?", OPTS, OPTS[kind], kind === 0 ? "y ÷ x es constante." : kind === 1 ? `x · y siempre da ${k}.` : "Ni y ÷ x ni x · y son constantes.", { kind: "table", headers: ["x", "y"], rows: pts.map((p) => p.map((n) => fmt(n))) }, ["directa", "inversa", "ninguna"][kind]);
  }
  const x = r.pick(xs.slice(1));
  const y = k / x;
  if (mode === "write") return choiceQ(r, `Si y varía inversamente con x y y = ${y} cuando x = ${x}, ¿qué ecuación relaciona a x con y?`, `y = ${k}/x`, [`y = ${coef(y / x === Math.round(y / x) ? y / x : k)}x`, `y = ${x}/x`.replace(`${x}/x`, `${y}/x`), `y = ${k}x`, `y = x/${k}`].filter((w) => w !== `y = ${k}/x`), `k = x · y = ${x} × ${y} = ${k}: y = ${k}/x.`, undefined, "escribir");
  const x2 = r.pick(xs.filter((v) => v !== x));
  return numQ(k / x2, `Si y varía inversamente con x y y = ${y} cuando x = ${x}, ¿cuánto vale y cuando x = ${x2}?`, undefined, `k = ${x} × ${y} = ${k}; y = ${k} ÷ ${x2} = ${fmt(k / x2)}.`, "resolver");
}

