import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, intQ, numQ, sg, yesNo } from "../kit";
import { curve, dec, valQ } from "../alg1/util";

// Álgebra 2: ángulos en posición estándar, círculo unitario, funciones
// trigonométricas inversas, ecuaciones trigonométricas, funciones seno y
// coseno, e identidades.

const rad = (d: number) => (d * Math.PI) / 180;
const norm = (d: number) => ((d % 360) + 360) % 360;
const quadrant = (d: number) => { const n = norm(d); return n % 90 === 0 ? 0 : Math.floor(n / 90) + 1; };
const refAngle = (d: number) => { const n = norm(d); return n <= 90 ? n : n <= 180 ? 180 - n : n <= 270 ? n - 180 : 360 - n; };
const QN = ["", "I", "II", "III", "IV"];

// Valores exactos de los ángulos notables (0°, 30°, 45°, 60°, 90°).
const EXACT: Record<number, [string, string, string]> = { 0: ["0", "1", "0"], 30: ["1/2", "√3/2", "√3/3"], 45: ["√2/2", "√2/2", "1"], 60: ["√3/2", "1/2", "√3"], 90: ["1", "0", "no definida"] };
type F = "sen" | "cos" | "tan" | "csc" | "sec" | "cot";
const RECIP: Record<string, string> = { "1/2": "2", "√3/2": "2√3/3", "√3/3": "√3", "√2/2": "√2", "1": "1", "√3": "√3/3", "0": "no definida", "no definida": "0" };
function exact(f: F, d: number): string {
  const ref = refAngle(d), n = norm(d);
  const base = f === "sen" || f === "csc" ? EXACT[ref][0] : f === "cos" || f === "sec" ? EXACT[ref][1] : EXACT[ref][2];
  const val = f === "csc" || f === "sec" || f === "cot" ? RECIP[base] : base;
  if (val === "0" || val === "no definida") return val;
  // Signo según el cuadrante (o el eje).
  const s = Math.sign(f === "sen" || f === "csc" ? Math.round(Math.sin(rad(n)) * 1e9) : f === "cos" || f === "sec" ? Math.round(Math.cos(rad(n)) * 1e9) : Math.round(Math.tan(rad(n)) * 1e9));
  return s < 0 ? `−${val}` : val;
}
const NOTABLE = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330, 90, 180, 270];
const ALL_VALS = ["0", "1/2", "−1/2", "√2/2", "−√2/2", "√3/2", "−√3/2", "1", "−1", "√3", "−√3", "√3/3", "−√3/3", "2", "−2", "2√3/3", "−2√3/3", "√2", "−√2"];
const piFrac = (d: number) => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
  const k = g(d, 180);
  const n = d / k, den = 180 / k;
  const num = n === 1 ? "π" : n === -1 ? "−π" : `${sg(n)}π`;
  return den === 1 ? num : `${num}/${den}`;
};

// Gráficos de ángulos y cuadrantes.
export function angleQuadrant(r: Rng, graph: boolean): Question {
  const d = r.int(1, 35) * 10 * r.pick([1, 1, -1]);
  if (quadrant(d) === 0) return angleQuadrant(r, graph);
  if (graph) {
    const t = rad(d);
    const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [], lines: [{ from: { x: 0, y: 0 }, to: { x: 5 * Math.cos(t), y: 5 * Math.sin(t) }, arrow: true }, { from: { x: 0, y: 0 }, to: { x: 5, y: 0 } }].reverse() };
    const opts = [d, d + 90, d - 90, d + 180].map((x) => `${sg(x)}°`);
    return choiceQ(r, "El gráfico muestra un ángulo en posición estándar (lado inicial sobre el eje x positivo). ¿Cuál puede ser su medida?", `${sg(d)}°`, opts.slice(1), `El lado terminal queda en el cuadrante ${QN[quadrant(d)]}.`, visual, "grafico");
  }
  const useRad = r.chance(0.3);
  const shown = useRad ? `${piFrac(d)} radianes` : `${sg(d)}°`;
  if (useRad && !Number.isInteger(d / 15)) return angleQuadrant(r, graph);
  return fixedQ(`¿En qué cuadrante está el lado terminal de un ángulo de ${shown} en posición estándar?`, ["I", "II", "III", "IV"], QN[quadrant(d)], `${sg(d)}° es coterminal con ${norm(d)}°, que está en el cuadrante ${QN[quadrant(d)]}.`, undefined, QN[quadrant(d)]);
}

// Ángulos coterminales y ángulos de referencia.
export function coterminalReference(r: Rng, reference: boolean): Question {
  const d = r.int(-36, 72) * 10;
  if (reference) {
    if (quadrant(d) === 0) return coterminalReference(r, reference);
    return numQ(refAngle(d), `¿Cuál es el ángulo de referencia de ${sg(d)}°?`, undefined, `${sg(d)}° es coterminal con ${norm(d)}° (cuadrante ${QN[quadrant(d)]}); el ángulo agudo con el eje x es ${refAngle(d)}°.`, "referencia");
  }
  return numQ(norm(d), `¿Qué ángulo entre 0° y 360° es coterminal con ${sg(d)}°?`, undefined, `Se suma o resta 360° las veces necesarias: ${sg(d)}° → ${norm(d)}°.`, "coterminal");
}

// Razones trigonométricas a partir de un punto del círculo unitario.
export function unitCirclePoint(r: Rng): Question {
  const [a, b] = r.pick([[3, 4], [4, 3], [5, 12], [12, 5], [8, 15]]);
  const c = Math.round(Math.hypot(a, b));
  const sx = r.pick([1, -1]), sy = r.pick([1, -1]);
  const f = r.pick<F>(["sen", "cos", "tan"]);
  const x = `${sx < 0 ? "−" : ""}${a}/${c}`, y = `${sy < 0 ? "−" : ""}${b}/${c}`;
  const val = f === "sen" ? y : f === "cos" ? x : `${sx * sy < 0 ? "−" : ""}${b}/${a}`;
  return choiceQ(r, `El lado terminal de θ corta el círculo unitario en (${x}, ${y}). ¿Cuánto vale ${f} θ?`, val, [x, y, `${sx * sy < 0 ? "−" : ""}${a}/${b}`, `${sx * sy < 0 ? "" : "−"}${b}/${a}`].filter((w, i, all) => w !== val && all.indexOf(w) === i), "En el círculo unitario, cos θ = x, sen θ = y y tan θ = y/x.", undefined, f);
}

// Razones trigonométricas exactas usando ángulos de referencia.
export function exactTrig(r: Rng, set: "basic" | "reciprocal" | "all"): Question {
  const f = r.pick<F>(set === "basic" ? ["sen", "cos", "tan"] : set === "reciprocal" ? ["csc", "sec", "cot"] : ["sen", "cos", "tan", "csc", "sec", "cot"]);
  const d = r.pick(NOTABLE);
  const good = exact(f, d);
  if (good === "no definida" && r.chance(0.6)) return exactTrig(r, set);
  const wrong = r.shuffle(ALL_VALS.filter((v) => v !== good && v.replace("−", "") === good.replace("−", ""))).concat(r.shuffle(ALL_VALS.filter((v) => v.replace("−", "") !== good.replace("−", "")))).slice(0, 3);
  return choiceQ(r, `¿Cuál es el valor exacto de ${f} ${d}°?`, good, wrong, `Ángulo de referencia ${refAngle(d)}°${quadrant(d) ? `, cuadrante ${QN[quadrant(d)]}` : ""}: ${f} ${d}° = ${good}.`, undefined, f);
}

// Aproximar razones trigonométricas con calculadora.
export function trigApprox(r: Rng): Question {
  const f = r.pick<F>(["sen", "cos", "tan"]), d = r.int(91, 359);
  if (d % 90 === 0) return trigApprox(r);
  const v = Math.round((f === "sen" ? Math.sin(rad(d)) : f === "cos" ? Math.cos(rad(d)) : Math.tan(rad(d))) * 10000) / 10000;
  return valQ(r, `Usa una calculadora (en grados). ¿Cuánto vale ${f} ${d}°? Redondea a la diezmilésima.`, v, [-v, Math.round((f === "sen" ? Math.cos(rad(d)) : Math.sin(rad(d))) * 10000) / 10000, Math.round((v + 0.01) * 10000) / 10000], `${f} ${d}° ≈ ${dec(v)} (fíjate en el signo según el cuadrante).`, undefined, f);
}

// Funciones trigonométricas inversas (grados, radianes; csc, sec, cot).
export function inverseTrig(r: Rng, mode: "degrees" | "radians" | "reciprocal"): Question {
  const cases: [string, number][] = [["sen⁻¹(1/2)", 30], ["sen⁻¹(−1/2)", -30], ["sen⁻¹(√2/2)", 45], ["sen⁻¹(√3/2)", 60], ["sen⁻¹(−1)", -90], ["cos⁻¹(1/2)", 60], ["cos⁻¹(−1/2)", 120], ["cos⁻¹(√3/2)", 30], ["cos⁻¹(−√2/2)", 135], ["cos⁻¹(0)", 90], ["tan⁻¹(1)", 45], ["tan⁻¹(−√3)", -60], ["tan⁻¹(√3/3)", 30]];
  const rec: [string, number][] = [["csc⁻¹(2)", 30], ["sec⁻¹(2)", 60], ["cot⁻¹(1)", 45], ["csc⁻¹(√2)", 45], ["sec⁻¹(−2)", 120], ["cot⁻¹(√3)", 30]];
  const [e, d] = r.pick(mode === "reciprocal" ? rec : cases);
  const show = (x: number) => (mode === "radians" ? (x === 0 ? "0" : piFrac(x)) : `${sg(x)}°`);
  const wrong = [d + 30, -d, 180 - d, d === 90 ? 0 : d + 60].filter((x) => x !== d).map(show);
  return choiceQ(r, `¿Cuánto vale ${e}${mode === "radians" ? ", en radianes" : ", en grados"}?`, show(d), [...new Set(wrong)].filter((w) => w !== show(d)), "El rango de sen⁻¹ y tan⁻¹ es de −90° a 90°; el de cos⁻¹, de 0° a 180°.", undefined, mode);
}

// Resolver ecuaciones trigonométricas (0° ≤ x < 360°).
export function trigEquation(r: Rng, advanced: boolean): Question {
  const cases: [string, number[]][] = [["2 sen x − 1 = 0", [30, 150]], ["2 cos x + 1 = 0", [120, 240]], ["tan x − 1 = 0", [45, 225]], ["2 sen x + √3 = 0", [240, 300]], ["√2 cos x − 1 = 0", [45, 315]], ["sen x = 0", [0, 180]], ["cos x = −1", [180]]];
  const adv: [string, number[]][] = [["2 sen² x − 1 = 0", [45, 135, 225, 315]], ["4 cos² x − 3 = 0", [30, 150, 210, 330]], ["tan² x = 3", [60, 120, 240, 300]], ["sen x cos x = 0", [0, 90, 180, 270]]];
  const [eq, sols] = r.pick(advanced ? [...cases, ...adv] : cases);
  const show = (xs: number[]) => xs.map((x) => `${x}°`).join(", ");
  const wrong = [show(sols.slice(0, 1)), show(sols.map((x) => norm(x + 90))), show(sols.map((x) => norm(360 - x)).sort((a, b) => a - b))].filter((w) => w !== show(sols));
  return choiceQ(r, `Resuelve ${eq} para 0° ≤ x < 360°.`, show(sols), [...new Set(wrong)], "Se despeja la función y se buscan todos los ángulos del intervalo con ese valor (usando el ángulo de referencia y los signos por cuadrante).", undefined, advanced ? "avanzada" : "basica");
}

// ---------------------------------------------------------------------------
// Funciones seno y coseno: y = A f(B(x − h)) + k con B = π/p (período 2p).

type Sin = { A: number; p: number; h: number; k: number; cos: boolean };
const sinText = (s: Sin) => {
  const A = s.A === 1 ? "" : s.A === -1 ? "−" : `${sg(s.A)} `;
  const B = s.p === 1 ? "π" : `(π/${s.p})`;
  const arg = s.h ? `${B}(x ${s.h < 0 ? "+" : "−"} ${Math.abs(s.h)})` : `${B}x`;
  return `y = ${A}${s.cos ? "cos" : "sen"}(${arg})${s.k ? ` ${s.k < 0 ? "−" : "+"} ${Math.abs(s.k)}` : ""}`;
};
const sinF = (s: Sin) => (x: number) => s.A * (s.cos ? Math.cos : Math.sin)((Math.PI / s.p) * (x - s.h)) + s.k;
const sinVisual = (s: Sin): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: [], curves: [{ points: curve(sinF(s), -8, 8, 0.05) }] });
const randomSin = (r: Rng, cos: boolean, shift: boolean): Sin => ({ A: r.pick([1, 2, 3, -2]), p: r.pick([1, 2, 3, 4]), h: shift ? r.int(-2, 2) : 0, k: shift ? r.int(-3, 3) : r.int(-2, 2), cos });

// Propiedades (amplitud, período, línea media, máximo y mínimo).
export function sinProps(r: Rng, cos: boolean | null): Question {
  const s = randomSin(r, cos ?? r.chance(0.5), true);
  const k = r.int(0, 3);
  const eq = sinText(s);
  if (k === 0) return numQ(Math.abs(s.A), `¿Cuál es la amplitud de ${eq}?`, undefined, `La amplitud es |A| = ${Math.abs(s.A)}.`, "amplitud");
  if (k === 1) return numQ(2 * s.p, `¿Cuál es el período de ${eq}?`, undefined, `Período = 2π ÷ B = 2π ÷ (π/${s.p}) = ${2 * s.p}.`, "periodo");
  if (k === 2) return choiceQ(r, `¿Cuál es la línea media de ${eq}?`, `y = ${sg(s.k)}`, [`y = ${sg(-s.k || 1)}`, `y = ${sg(s.A)}`, `x = ${sg(s.k)}`].filter((w) => w !== `y = ${sg(s.k)}`), `La línea media es y = k = ${sg(s.k)}.`, undefined, "linea-media");
  const max = r.chance(0.5);
  return intQ(r, `¿Cuál es el valor ${max ? "máximo" : "mínimo"} de ${eq}?`, max ? s.k + Math.abs(s.A) : s.k - Math.abs(s.A), `Línea media ${sg(s.k)} ${max ? "más" : "menos"} la amplitud ${Math.abs(s.A)}.`, undefined, max ? "maximo" : "minimo", [s.k, Math.abs(s.A)]);
}

// Escribir ecuaciones desde gráficos o propiedades.
export function sinEquation(r: Rng, cos: boolean | null, graph: boolean): Question {
  const s = { ...randomSin(r, cos ?? r.chance(0.5), false), A: r.pick([1, 2, 3]) };
  const good = sinText(s);
  const wrong = [sinText({ ...s, p: s.p === 1 ? 2 : s.p / 2 === Math.round(s.p / 2) ? s.p / 2 : s.p * 2 }), sinText({ ...s, A: s.A + 1 }), sinText({ ...s, cos: !s.cos }), sinText({ ...s, k: s.k + 1 })].filter((w, i, all) => w !== good && all.indexOf(w) === i);
  if (graph) return choiceQ(r, "¿Qué ecuación corresponde al gráfico?", good, wrong, `Línea media y = ${sg(s.k)}, amplitud ${s.A}, período ${2 * s.p}; en x = 0 ${s.cos ? "está en un máximo (coseno)" : "cruza la línea media subiendo (seno)"}.`, sinVisual(s), "grafico");
  return choiceQ(r, `Una función ${s.cos ? "coseno" : "seno"} tiene amplitud ${s.A}, período ${2 * s.p}, línea media y = ${sg(s.k)} y no está desplazada horizontalmente. ¿Cuál es su ecuación?`, good, wrong, `A = ${s.A}, B = 2π ÷ ${2 * s.p} = π/${s.p}, k = ${sg(s.k)}.`, undefined, "propiedades");
}

// Graficar (también con traslaciones).
export function sinGraph(r: Rng, cos: boolean | null, shift: boolean): Question {
  const s = randomSin(r, cos ?? r.chance(0.5), shift);
  const yes = r.chance(0.5);
  const shown = yes ? s : r.pick([{ ...s, A: -s.A }, { ...s, k: s.k + 2 }, { ...s, p: s.p === 1 ? 2 : 1 }, ...(shift ? [{ ...s, h: s.h + 1 }] : [])]);
  return yesNo(`¿El gráfico muestra ${sinText(s)}?`, yes, `Amplitud ${Math.abs(s.A)}, período ${2 * s.p}, línea media y = ${sg(s.k)}${s.h ? `, desplazada ${Math.abs(s.h)} hacia la ${s.h > 0 ? "derecha" : "izquierda"}` : ""}.`, sinVisual(shown), shift ? "traslacion" : "basico");
}

// ---------------------------------------------------------------------------
// Identidades

// Simetría y periodicidad.
export function symmetryPeriod(r: Rng): Question {
  const d = r.int(10, 80), f = r.pick<F>(["sen", "cos", "tan"]);
  const v = Math.round((f === "sen" ? Math.sin(rad(d)) : f === "cos" ? Math.cos(rad(d)) : Math.tan(rad(d))) * 10000) / 10000;
  const form = r.int(0, 1);
  if (form === 0) {
    const ans = f === "cos" ? v : -v;
    return valQ(r, `Si ${f} ${d}° ≈ ${dec(v)}, ¿cuánto vale ${f}(−${d}°)?`, ans, [-ans, Math.round((1 - v) * 10000) / 10000], f === "cos" ? "El coseno es par: cos(−θ) = cos θ." : `El ${f === "sen" ? "seno" : "la tangente"} es impar: ${f}(−θ) = −${f} θ.`, undefined, "simetria");
  }
  const period = f === "tan" ? 180 : 360;
  return valQ(r, `Si ${f} ${d}° ≈ ${dec(v)}, ¿cuánto vale ${f} ${d + period}°?`, v, [-v, Math.round((1 - v) * 10000) / 10000], `El período de ${f} es ${period}°: ${f}(θ + ${period}°) = ${f} θ.`, undefined, "periodo");
}

// Razones con identidades pitagóricas y recíprocas.
export function pythagoreanIdentity(r: Rng, multiple: boolean): Question {
  const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
  const q = r.int(1, 4);
  const sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1;
  const sin = `${sy < 0 ? "−" : ""}${b}/${c}`, cos = `${sx < 0 ? "−" : ""}${a}/${c}`, tan = `${sx * sy < 0 ? "−" : ""}${b}/${a}`;
  if (!multiple) return choiceQ(r, `Si sen θ = ${sin} y θ está en el cuadrante ${QN[q]}, ¿cuánto vale cos θ?`, cos, [`${sx < 0 ? "" : "−"}${a}/${c}`, `${sy < 0 ? "−" : ""}${a}/${b}`, `${sx < 0 ? "−" : ""}${c}/${a}`].filter((w) => w !== cos), `cos² θ = 1 − sen² θ = 1 − ${b * b}/${c * c} = ${a * a}/${c * c}; en el cuadrante ${QN[q]} el coseno es ${sx > 0 ? "positivo" : "negativo"}.`, undefined, "pitagorica");
  const sec = `${sx < 0 ? "−" : ""}${c}/${a}`;
  return choiceQ(r, `Si tan θ = ${tan} y θ está en el cuadrante ${QN[q]}, ¿cuánto vale sec θ?`, sec, [`${sx < 0 ? "" : "−"}${c}/${a}`, `${sy < 0 ? "−" : ""}${c}/${b}`, cos].filter((w) => w !== sec), `1 + tan² θ = sec² θ = ${c * c}/${a * a}; en el cuadrante ${QN[q]} el coseno (y la secante) es ${sx > 0 ? "positivo" : "negativo"}.`, undefined, "varias");
}

const SUMDIFF: [string, string, string][] = [
  ["sen 75°", "(√6 + √2)/4", "sen(45° + 30°) = sen 45° cos 30° + cos 45° sen 30°"],
  ["cos 75°", "(√6 − √2)/4", "cos(45° + 30°) = cos 45° cos 30° − sen 45° sen 30°"],
  ["sen 15°", "(√6 − √2)/4", "sen(45° − 30°) = sen 45° cos 30° − cos 45° sen 30°"],
  ["cos 15°", "(√6 + √2)/4", "cos(45° − 30°) = cos 45° cos 30° + sen 45° sen 30°"],
  ["sen 105°", "(√6 + √2)/4", "sen(60° + 45°) = sen 60° cos 45° + cos 60° sen 45°"],
  ["cos 105°", "(√2 − √6)/4", "cos(60° + 45°) = cos 60° cos 45° − sen 60° sen 45°"],
];
// Identidades de suma y diferencia (y ecuaciones con ellas).
export function sumDifference(r: Rng, solve: boolean): Question {
  if (solve) {
    const [eq, ans, why] = r.pick([["sen x cos 30° + cos x sen 30° = 1", "60°", "sen(x + 30°) = 1 → x + 30° = 90°"], ["cos x cos 45° − sen x sen 45° = 0", "45°", "cos(x + 45°) = 0 → x + 45° = 90°"], ["sen x cos 20° − cos x sen 20° = 1/2", "50°", "sen(x − 20°) = 1/2 → x − 20° = 30°"], ["cos x cos 15° + sen x sen 15° = √3/2", "45°", "cos(x − 15°) = √3/2 → x − 15° = 30°"]] as [string, string, string][]);
    return choiceQ(r, `Resuelve para 0° ≤ x ≤ 90°: ${eq}`, ans, ["30°", "60°", "45°", "50°", "75°"].filter((w) => w !== ans).slice(0, 3), `${why}, así que x = ${ans}.`, undefined, "ecuacion");
  }
  const [e, v, why] = r.pick(SUMDIFF);
  return choiceQ(r, `¿Cuál es el valor exacto de ${e}?`, v, ["(√6 + √2)/4", "(√6 − √2)/4", "(√2 − √6)/4", "√3/2"].filter((w) => w !== v), `${why} = ${v}.`, undefined, "suma-diferencia");
}

