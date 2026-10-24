import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, type Frac, d3, decQ, fadd, fcmp, fmul, fr, fracQ, fshow, fsub, gcd, mixed, numQ, table } from "./kit";

// Fracciones de 6.° en adelante: dividir fracciones y números mixtos,
// estimaciones, expresiones con fracciones y mapas con distancias.

const proper = (r: Rng, dens = [2, 3, 4, 5, 6, 8, 10]): Frac => {
  const d = r.pick(dens);
  return d === 2 ? [1, 2] : [r.int(1, d - 1), d];
};
const mixedNum = (r: Rng, dens = [2, 3, 4, 5, 6], maxWhole = 5): Frac => {
  const d = r.pick(dens);
  return [r.int(1, maxWhole) * d + r.int(1, d - 1), d];
};
const m = ([n, d]: Frac) => mixed(n, d);
const fdiv = (a: Frac, b: Frac): Frac => fmul(a, [b[1], b[0]]);
const text = (f: Frac) => (f[1] === 1 ? String(f[0]) : f[0] > f[1] ? m(f) : fr(f));

// Estimar productos de fracciones y números naturales.
export function estimateFractionProduct(r: Rng): Question {
  for (;;) {
    const d = r.pick([7, 8, 9, 10, 11, 12, 15, 20]);
    const n = r.int(1, d - 1);
    const dist = [2 * n, Math.abs(2 * n - d), 2 * (d - n)];
    const best = Math.min(...dist);
    if (dist.filter((x) => x === best).length > 1 || best * 5 > d * 2) continue;
    const half = dist.indexOf(best);
    const k = r.int(3, 30) * 2;
    return numQ((k * half) / 2, `Redondea la fracción a 0, 1/2 o 1 y estima el producto.`, `${n}/${d} × ${k} ≈ ?`, `${n}/${d} ≈ ${["0", "1/2", "1"][half]}; ${["0", "1/2", "1"][half]} × ${k} = ${(k * half) / 2}.`, ["cero", "mitad", "uno"][half]);
  }
}

export type DivOperand = "whole" | "fraction" | "mixed" | "unit";
function operand(r: Rng, kind: DivOperand): Frac {
  return kind === "whole" ? [r.int(2, 9), 1] : kind === "mixed" ? mixedNum(r) : kind === "unit" ? [1, r.int(2, 9)] : proper(r);
}

// Dividir fracciones, números naturales y números mixtos.
export function divideFractions(r: Rng, kinds: [DivOperand, DivOperand][], ctx: "plain" | "word" | "recipe" = "plain"): Question {
  for (;;) {
    const [ka, kb] = r.pick(kinds);
    const a = operand(r, ka);
    const b = operand(r, kb);
    const q = fdiv(a, b);
    if (q[1] > 60 || q[0] > 400 || (a[0] === b[0] && a[1] === b[1])) continue;
    // En un problema de «¿cuántos caben?» la respuesta debe ser 1 o más.
    if (ctx === "word" && q[0] < q[1]) continue;
    const imp = (f: Frac) => (f[1] === 1 ? `${f[0]}` : fr(f));
    const why = `Dividir es multiplicar por el recíproco: ${imp(a)} × ${b[1]}/${b[0]} = ${fshow(q)}.`;
    const extra: Frac[] = [fmul(a, b), fdiv(b, a), fadd(q, [1, 1])];
    const name = r.pick(NAMES);
    if (ctx === "recipe") return fracQ(r, `Una receta lleva ${text(a)} ${a[0] > a[1] || a[1] === 1 ? "tazas" : "de taza"} de harina. Si se reparte por igual en ${text(b)} porciones, ¿cuántas tazas lleva cada porción?`, q, why, undefined, undefined, extra);
    if (ctx === "word" && q[1] !== 1) {
      // Si no salen grupos enteros, el problema es de «cuánto por cada uno».
      const hours = b[0] > b[1] ? "horas" : "hora";
      const story = r.pick([`${name} camina ${text(a)} km en ${text(b)} ${hours}. A ese ritmo, ¿cuántos kilómetros camina por hora?`, `Una máquina pinta ${text(a)} m² de pared en ${text(b)} ${hours}. ¿Cuántos metros cuadrados pinta por hora?`, `Un caño llena ${text(a)} litros en ${text(b)} ${b[0] > b[1] ? "minutos" : "minuto"}. ¿Cuántos litros llena por minuto?`]);
      return fracQ(r, story, q, why, undefined, undefined, extra);
    }
    if (ctx === "word") {
      const story = r.pick([`${name} tiene ${text(a)} m de cinta y la corta en trozos de ${text(b)} m. ¿Cuántos trozos obtiene?`, `Hay ${text(a)} litros de jugo y cada vaso lleva ${text(b)} de litro. ¿Cuántos vasos se llenan?`.replace(/lleva (\d+) de litro/, "lleva $1 litros").replace(/lleva (\d+ \d+\/\d+) de litro/, "lleva $1 litros"), `Un terreno de ${text(a)} hectáreas se divide en parcelas de ${text(b)} de hectárea. ¿Cuántas parcelas salen?`.replace(/de (\d+) de hectárea/, "de $1 hectáreas").replace(/de (\d+ \d+\/\d+) de hectárea/, "de $1 hectáreas")]);
      return fracQ(r, story, q, why, undefined, undefined, extra);
    }
    return fracQ(r, "Divide. Escribe el resultado en su mínima expresión.", q, why, `${text(a)} ÷ ${text(b)} = ?`, `${ka}-entre-${kb}`, extra);
  }
}

// Dividir usando modelos (¿cuántas veces cabe?).
export function divideModel(r: Rng, total_: "whole" | "fraction" | "mixed", word = false): Question {
  let d = 2;
  let piece = 1;
  let count = 2;
  for (;;) {
    d = r.pick([2, 3, 4, 5, 6, 8]);
    piece = r.int(1, Math.min(3, d - 1));
    count = r.int(2, 8);
    const parts = piece * count;
    if (gcd(piece, d) !== 1 || parts > 4 * d) continue;
    if (total_ === "whole" ? parts % d === 0 : total_ === "fraction" ? parts < d : parts > d && parts % d !== 0) break;
  }
  const totalParts = piece * count;
  const total: Frac = [totalParts, d];
  const bars = Math.ceil(totalParts / d);
  const visual: Visual = { kind: "fractionPair", hideLabels: true, items: Array.from({ length: bars }, (_, i) => ({ parts: d, shaded: Math.min(d, totalParts - i * d) })) };
  const why = `${fshow(total)} son ${totalParts} partes de 1/${d}; en grupos de ${piece}: ${totalParts} ÷ ${piece} = ${count}.`;
  const prompt = word ? `${r.pick(NAMES)} tiene ${fshow(total)} ${totalParts >= d ? "pizzas" : "de pizza"} (lo sombreado) y sirve porciones de ${piece}/${d}. ¿Cuántas porciones salen?` : `Lo sombreado es ${fshow(total)}. ¿Cuántas veces cabe ${piece}/${d}? (${fshow(total)} ÷ ${piece}/${d})`;
  return numQ(count, prompt, visual, why);
}

// Estimar cocientes al dividir números mixtos.
export function estimateMixedQuotient(r: Rng): Question {
  for (;;) {
    const b = mixedNum(r, [3, 4, 5, 6, 8], 5);
    const rb = Math.round(b[0] / b[1]);
    const q = r.int(2, 9);
    const d = r.pick([3, 4, 5, 6, 8]);
    const a: Frac = [rb * q * d + r.pick([-1, 1]) * r.int(1, Math.floor((d - 1) / 2)), d];
    if ((b[0] % b[1]) * 2 === b[1] || Math.round(a[0] / a[1]) !== rb * q) continue;
    return numQ(q, "Redondea cada número mixto al natural más cercano y estima el cociente.", `${m(a)} ÷ ${m(b)} ≈ ?`, `${m(a)} ≈ ${rb * q} y ${m(b)} ≈ ${rb}; ${rb * q} ÷ ${rb} = ${q}.`);
  }
}

// Evaluar expresiones numéricas con fracciones.
export function fractionExpression6(r: Rng): Question {
  for (;;) {
    const a = proper(r, [2, 3, 4, 6]);
    const b = proper(r, [2, 3, 4, 6]);
    const c = proper(r, [2, 3, 4, 5]);
    const forms: [string, Frac, string][] = [
      [`(${fr(a)} + ${fr(b)}) × ${fr(c)}`, fmul(fadd(a, b), c), `${fr(a)} + ${fr(b)} = ${fshow(fadd(a, b))}; ${fshow(fadd(a, b))} × ${fr(c)}`],
      [`${fr(a)} + ${fr(b)} × ${fr(c)}`, fadd(a, fmul(b, c)), `${fr(b)} × ${fr(c)} = ${fshow(fmul(b, c))}; ${fr(a)} + ${fshow(fmul(b, c))}`],
      [`${fr(a)} ÷ ${fr(c)} + ${fr(b)}`, fadd(fdiv(a, c), b), `${fr(a)} ÷ ${fr(c)} = ${fshow(fdiv(a, c))}; ${fshow(fdiv(a, c))} + ${fr(b)}`],
    ];
    if (fcmp(a, b) > 0) forms.push([`(${fr(a)} − ${fr(b)}) ÷ ${fr(c)}`, fdiv(fsub(a, b), c), `${fr(a)} − ${fr(b)} = ${fshow(fsub(a, b))}; ${fshow(fsub(a, b))} ÷ ${fr(c)}`]);
    const [expr, value, steps] = r.pick(forms);
    if (value[1] > 72) continue;
    return fracQ(r, "Calcula. Respeta el orden de las operaciones y simplifica el resultado.", value, `${steps} = ${fshow(value)}.`, `${expr} = ?`, undefined, [fadd(value, [1, 2]), fmul(value, [1, 2])]);
  }
}

// «de el» y «a el» se contraen: «del colegio», «al estadio».
const route = (from: string, to: string) => `De ${from} a ${to}`.replace("De el ", "Del ").replace(" a el ", " al ");
const PLACES = ["la plaza", "el colegio", "el mercado", "el parque", "la biblioteca", "el estadio", "la posta"];

// Mapas con distancias decimales o fraccionarias.
export function mapDistances(r: Rng, kind: "decimal" | "fraction"): Question {
  const stops = r.shuffle(PLACES).slice(0, 4);
  const legs = [0, 1, 2].map(() => (kind === "decimal" ? r.int(3, 48) * 100 + r.pick([0, 50, 25, 75]) : 0));
  const d = r.pick([2, 4, 8]);
  const fracLegs: Frac[] = [0, 1, 2].map(() => [r.int(0, 2) * d + r.int(1, d - 1), d]);
  const label = (i: number) => (kind === "decimal" ? `${d3(legs[i])} km` : `${m(fracLegs[i])} km`);
  const visual = table(["Tramo", "Distancia"], [0, 1, 2].map((i) => [route(stops[i], stops[i + 1]), label(i)]), "Camino en el mapa");
  const from = r.int(0, 1);
  const to = r.int(from + 2, 3);
  const used = Array.from({ length: to - from }, (_, k) => from + k);
  const compare = r.chance(0.3);
  if (kind === "decimal") {
    if (compare) {
      const diff = Math.abs(legs[0] - legs[2]) || 250;
      if (legs[0] === legs[2]) return mapDistances(r, kind);
      return decQ(r, `Compara el primer tramo con el último. ¿Cuántos kilómetros más mide el más largo?`, diff, `${d3(Math.max(legs[0], legs[2]))} − ${d3(Math.min(legs[0], legs[2]))} = ${d3(diff)} km.`, visual, "diferencia");
    }
    const total = used.reduce((s, i) => s + legs[i], 0);
    return decQ(r, `Siguiendo el camino, ¿cuántos kilómetros hay ${route(stops[from], stops[to]).toLowerCase()}?`, total, `${used.map((i) => d3(legs[i])).join(" + ")} = ${d3(total)} km.`, visual, "suma");
  }
  const total = used.reduce((s, i) => fadd(s, fracLegs[i]), [0, 1] as Frac);
  return fracQ(r, `Siguiendo el camino, ¿cuántos kilómetros hay ${route(stops[from], stops[to]).toLowerCase()}?`, total, `${used.map((i) => m(fracLegs[i])).join(" + ")} = ${fshow(total)} km.`, visual, "suma", [fadd(total, [1, d]), fadd(total, [1, 1])]);
}
