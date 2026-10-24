import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { choiceQ, fixedQ, intQ, sg } from "../kit";
import { nz } from "../sec1/util";
import { dec, frac } from "../alg1/util";

// Álgebra 2: clasificar fórmulas de sucesiones y series (aritméticas y
// geométricas, notación sigma, sumas parciales, series infinitas).

const KINDS = ["Aritmética", "Geométrica", "Ninguna de las dos"];
// Clasificar fórmulas y sucesiones.
export function classifySequence(r: Rng): Question {
  const cases: [string, number][] = [["aₙ = 3n + 2", 0], ["aₙ = 5 · 2ⁿ⁻¹", 1], ["aₙ = n² + 1", 2], ["aₙ = aₙ₋₁ − 4, a₁ = 10", 0], ["aₙ = 3aₙ₋₁, a₁ = 2", 1], ["aₙ = aₙ₋₁ + n, a₁ = 1", 2], ["2, 6, 18, 54, …", 1], ["7, 4, 1, −2, …", 0], ["1, 4, 9, 16, …", 2], ["1, 1/2, 1/4, 1/8, …", 1]];
  const [f, k] = r.pick(cases);
  return fixedQ(`¿Cómo es la sucesión ${f}?`, KINDS, KINDS[k], ["Se suma siempre la misma cantidad.", "Se multiplica siempre por la misma razón.", "No tiene diferencia ni razón constante."][k], undefined, KINDS[k]);
}

// Identificar series aritméticas y geométricas.
export function classifySeries(r: Rng): Question {
  const a = r.int(1, 9), d = nz(r, 5), q = r.pick([2, 3, -2]);
  const k = r.int(0, 2);
  const terms = k === 0 ? [0, 1, 2, 3].map((i) => a + i * d) : k === 1 ? [0, 1, 2, 3].map((i) => a * q ** i) : [1, 4, 9, 16].map((x) => x + a);
  return fixedQ(`¿Cómo es la serie ${terms.map(sg).join(" + ").replace(/\+ −/g, "− ")} + …?`, KINDS, KINDS[k], ["Diferencia constante entre términos.", "Razón constante entre términos.", "No hay diferencia ni razón constante."][k], undefined, KINDS[k]);
}

// Escribir una serie con notación sigma.
export function sigmaNotation(r: Rng): Question {
  const a = r.int(1, 6), d = r.int(2, 5), n = r.int(4, 8);
  const terms = Array.from({ length: n }, (_, i) => a + i * d);
  const c = a - d;
  const good = `Σ (k = 1 a ${n}) de (${d}k ${c < 0 ? "−" : "+"} ${Math.abs(c)})`.replace(" + 0)", ")");
  return choiceQ(r, `¿Cómo se escribe ${terms.join(" + ")} con notación sigma?`, good, [`Σ (k = 1 a ${n}) de (${a}k ${d < 0 ? "−" : "+"} ${Math.abs(d)})`, `Σ (k = 1 a ${n + 1}) de (${d}k ${c < 0 ? "−" : "+"} ${Math.abs(c)})`.replace(" + 0)", ")"), `Σ (k = 1 a ${n}) de (${d}k ${a < 0 ? "−" : "+"} ${Math.abs(a)})`].filter((w) => w !== good), `El término general es ${d}k ${c < 0 ? "−" : "+"} ${Math.abs(c)} (para k = 1 da ${a}) y hay ${n} términos.`, undefined, "sigma");
}

// Suma de una serie aritmética (y sumas parciales).
export function arithmeticSum(r: Rng, partial: boolean): Question {
  const a = r.int(-10, 15), d = nz(r, 6), n = r.int(5, partial ? 30 : 15);
  const last = a + (n - 1) * d;
  const S = (n * (a + last)) / 2;
  if (partial) return intQ(r, `En la serie aritmética con primer término ${sg(a)} y diferencia ${sg(d)}, ¿cuánto vale la suma parcial S_${n} (suma de los ${n} primeros términos)?`, S, `Sₙ = n(a₁ + aₙ) ÷ 2; a_${n} = ${sg(last)}; S_${n} = ${n} × (${sg(a)} + ${last < 0 ? `(${sg(last)})` : last}) ÷ 2 = ${sg(S)}.`, undefined, "parcial", [n * (a + last), S + d]);
  const terms = [a, a + d, a + 2 * d].map(sg).join(" + ").replace(/\+ −/g, "− ");
  return intQ(r, `¿Cuál es la suma de la serie ${terms} ${last < 0 ? "− …" : "+ …"} ${last < 0 ? "−" : "+"} ${Math.abs(last)}? (Tiene ${n} términos.)`, S, `S = n(a₁ + aₙ) ÷ 2 = ${n} × (${sg(a)} + ${last < 0 ? `(${sg(last)})` : last}) ÷ 2 = ${sg(S)}.`, undefined, "aritmetica", [n * (a + last), S - last]);
}

// Suma de una serie geométrica finita (y sumas parciales).
export function geometricSum(r: Rng, partial: boolean): Question {
  const a = r.int(1, 5), q = r.pick([2, 3, -2, 4]), n = r.int(3, partial ? 8 : 6);
  const S = (a * (q ** n - 1)) / (q - 1);
  const terms = [a, a * q, a * q * q].map(sg).join(" + ").replace(/\+ −/g, "− ");
  return intQ(r, partial ? `En la serie geométrica con primer término ${a} y razón ${sg(q)}, ¿cuánto vale la suma de los primeros ${n} términos?` : `¿Cuál es la suma de los ${n} primeros términos de la serie ${terms} + …?`, S, `Sₙ = a₁(rⁿ − 1) ÷ (r − 1) = ${a}((${sg(q)})^${n} − 1) ÷ ${sg(q - 1)} = ${sg(S)}.`, undefined, partial ? "parcial" : "geometrica", [a * q ** n, S + a * q ** n]);
}

// Introducción a las sumas parciales.
export function partialIntro(r: Rng): Question {
  const terms = Array.from({ length: 6 }, () => r.int(-5, 9));
  const n = r.int(2, 5);
  const S = terms.slice(0, n).reduce((s, x) => s + x, 0);
  return intQ(r, `Una sucesión empieza ${terms.map(sg).join(", ")}, … ¿Cuánto vale la suma parcial S_${n} (suma de los ${n} primeros términos)?`, S, `${terms.slice(0, n).map(sg).join(" + ")} = ${sg(S)}.`.replace(/\+ −/g, "− "), undefined, "intro", [S + terms[n], terms[n - 1]]);
}

// Series geométricas infinitas (convergencia y valor).
export function infiniteGeometric(r: Rng, value: boolean): Question {
  const [n, d] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [3, 2], [5, 4], [-2, 1]]);
  const ratio = n / d;
  const conv = Math.abs(ratio) < 1;
  if (!value) return fixedQ(`¿La serie geométrica de razón ${frac(n, d)} es convergente o divergente?`, ["Convergente", "Divergente"], conv ? "Convergente" : "Divergente", conv ? "|r| < 1: los términos se hacen cada vez más pequeños y la suma tiende a un número." : "|r| ≥ 1: la suma no tiende a un número.", undefined, conv ? "convergente" : "divergente");
  if (!conv) return infiniteGeometric(r, value);
  const a = r.int(1, 9);
  const S = a / (1 - ratio);
  return choiceQ(r, `¿Cuál es la suma de la serie geométrica infinita con primer término ${a} y razón ${frac(n, d)}?`, frac(a * d, d - n), [frac(a * d, d + n), frac(a, 1), frac(a * n, d - n)].filter((w, i, all) => w !== frac(a * d, d - n) && all.indexOf(w) === i), `S = a₁ ÷ (1 − r) = ${a} ÷ (1 − ${n < 0 ? `(${frac(n, d)})` : frac(n, d)}) = ${frac(a * d, d - n)}${Number.isInteger(S) ? "" : ` ≈ ${dec(Math.round(S * 100) / 100)}`}.`, undefined, "suma-infinita");
}

// Escribir un decimal periódico como fracción (con series).
export function repeatingAsSeries(r: Rng): Question {
  const digits = r.pick([1, 2]);
  const p = digits === 1 ? r.int(1, 8) : r.int(10, 98);
  const den = digits === 1 ? 9 : 99;
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const k = g(p, den);
  const good = `${p / k}/${den / k}`;
  const shown = digits === 1 ? `0,${p}${p}${p}…` : `0,${String(p).padStart(2, "0")}${String(p).padStart(2, "0")}…`;
  return choiceQ(r, `Escribe ${shown} como fracción (piénsalo como la serie ${p}/${den === 9 ? 10 : 100} + ${p}/${den === 9 ? 100 : 10000} + …).`, good, [`${p}/${den === 9 ? 10 : 100}`, `${p}/${den + 1}`, `${p / k}/${den / k + 1}`].filter((w) => w !== good), `Serie geométrica con a₁ = ${p}/${den === 9 ? 10 : 100} y r = 1/${den === 9 ? 10 : 100}: S = a₁ ÷ (1 − r) = ${p}/${den} = ${good}.`, undefined, "periodico");
}

