import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ } from "../kit";
import { dec, valQ } from "../alg1/util";

// Geometría: desigualdades de Pitágoras, razones trigonométricas, triángulos
// rectángulos especiales, ley de senos y de cosenos.

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (x: number) => (x * 180) / Math.PI;
const r1 = (n: number) => Math.round(n * 10) / 10;
const r4 = (n: number) => Math.round(n * 10000) / 10000;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
// Triángulo rectángulo en C: cateto BC (opuesto a A), cateto AC (adyacente a A), hipotenusa AB.
const RIGHT: [number, number][] = [[12, 88], [88, 88], [12, 22]];
const rightVisual = (ac: string, bc: string, ab: string): Visual => ({ kind: "polygon", points: RIGHT, rightAngles: [0], sideLabels: [ac, ab, bc] });
const DESC = "En el triángulo ABC, el ángulo C es recto; A está en el extremo del lado de abajo y B arriba.";

// P.4: desigualdades de Pitágoras (acutángulo, rectángulo u obtusángulo).
const KIND3 = ["Acutángulo", "Rectángulo", "Obtusángulo"];
export function pythagoreanInequality(r: Rng): Question {
  const [a, b, c0] = r.pick(TRIPLES);
  const k = r.int(0, 2);
  const c = k === 1 ? c0 : k === 0 ? c0 - 1 : c0 + 1;
  if (a + b <= c) return pythagoreanInequality(r);
  const s = a * a + b * b, cc = c * c;
  return fixedQ(`Un triángulo tiene lados de ${a}, ${b} y ${c}. ¿Cómo es según sus ángulos?`, KIND3, KIND3[k], `${a}² + ${b}² = ${s} y ${c}² = ${cc}: ${s > cc ? "la suma es mayor, es acutángulo" : s === cc ? "son iguales, es rectángulo" : "la suma es menor, es obtusángulo"}.`, undefined, KIND3[k]);
}

type Ratio = "sen" | "cos" | "tan" | "csc" | "sec" | "cot";
const ratioOf = (f: Ratio, opp: string, adj: string, hyp: string) => ({ sen: `${opp}/${hyp}`, cos: `${adj}/${hyp}`, tan: `${opp}/${adj}`, csc: `${hyp}/${opp}`, sec: `${hyp}/${adj}`, cot: `${adj}/${opp}` })[f];
const RATIO_DEF: Record<Ratio, string> = { sen: "opuesto ÷ hipotenusa", cos: "adyacente ÷ hipotenusa", tan: "opuesto ÷ adyacente", csc: "hipotenusa ÷ opuesto", sec: "hipotenusa ÷ adyacente", cot: "adyacente ÷ opuesto" };

// Q.1 / Q.3 / Q.4: razones trigonométricas (sen, cos, tan; csc, sec, cot; triángulos semejantes).
export function trigRatio(r: Rng, set: "basic" | "reciprocal" | "similar"): Question {
  const [a, b, c] = r.pick(TRIPLES);
  const f = r.pick<Ratio>(set === "reciprocal" ? ["csc", "sec", "cot"] : ["sen", "cos", "tan"]);
  const atA = r.chance(0.5);
  const [opp, adj] = atA ? [a, b] : [b, a];
  const g = (n: number, d: number): number => (d ? g(d, n % d) : n);
  const simp = (s: string) => { const [n, d] = s.split("/").map(Number); const k = g(n, d); return d / k === 1 ? String(n / k) : `${n / k}/${d / k}`; };
  const good = simp(ratioOf(f, String(opp), String(adj), String(c)));
  const all: Ratio[] = ["sen", "cos", "tan", "csc", "sec", "cot"];
  const wrong = [...new Set(all.filter((x) => x !== f).map((x) => simp(ratioOf(x, String(opp), String(adj), String(c)))))].filter((w) => w !== good);
  if (set === "similar") {
    const k = r.int(2, 4);
    return choiceQ(r, `${DESC} △ABC ∼ △DEF con ∠A ↔ ∠D, y los lados de △DEF miden ${a * k}, ${b * k} y ${c * k}. Si BC = ${atA ? a : b}, AC = ${atA ? b : a} y AB = ${c}, ¿cuánto vale ${f} D?`, simp(ratioOf(f, String(atA ? a : b), String(atA ? b : a), String(c))), wrong, `Los ángulos correspondientes son iguales, así que ${f} D = ${f} A = ${RATIO_DEF[f]}.`, rightVisual(String(atA ? b : a), String(atA ? a : b), String(c)), "semejantes");
  }
  const angle = atA ? "A" : "B";
  return choiceQ(r, `${DESC} ¿Cuánto vale ${f} ${angle}?`, good, wrong, `${f} ${angle} = ${RATIO_DEF[f]} = ${ratioOf(f, String(opp), String(adj), String(c))}${good !== ratioOf(f, String(opp), String(adj), String(c)) ? ` = ${good}` : ""}.`, rightVisual(String(b), String(a), String(c)), f);
}

// Q.2: razones trigonométricas con radicales.
export function trigRadical(r: Rng): Question {
  const [a, b] = r.pick([[1, 2], [1, 3], [2, 3], [1, 1], [2, 5], [3, 5]]);
  const h2 = a * a + b * b;
  const f = r.pick<Ratio>(["sen", "cos", "tan"]);
  // Opuesto a A = a, adyacente = b, hipotenusa = √h2. Se racionaliza: x/√h = x√h/h.
  const g = (p: number, q: number): number => (q ? g(q, p % q) : p);
  // x/√h = x√h/h, simplificado.
  const rationalize = (n: number) => {
    const k = g(n, h2);
    return `${n / k === 1 ? "" : n / k}√${h2}/${h2 / k}`.replace(/\/1$/, "");
  };
  const k = g(a, b);
  const good = f === "sen" ? rationalize(a) : f === "cos" ? rationalize(b) : b / k === 1 ? String(a / k) : `${a / k}/${b / k}`;
  const wrong = [rationalize(a), rationalize(b), `${a}/${b}`, `${b}/${a}`, `√${h2}/${a}`].filter((w, i, all) => w !== good && all.indexOf(w) === i);
  return choiceQ(r, `${DESC} BC = ${a} y AC = ${b}. ¿Cuánto vale ${f} A? (Racionaliza el denominador.)`, good, wrong, `La hipotenusa es √(${a}² + ${b}²) = √${h2}. ${f} A = ${RATIO_DEF[f]}${f === "tan" ? "" : `; se multiplica arriba y abajo por √${h2}`}: ${good}.`, rightVisual(String(b), String(a), `√${h2}`), f);
}

// Q.5 / Q.7: triángulos rectángulos especiales (45°-45°-90° y 30°-60°-90°).
export function specialRight(r: Rng, solve: boolean): Question {
  const k = r.int(2, 9);
  const t45 = r.chance(0.5);
  if (t45) {
    const fromLeg = r.chance(0.5);
    if (fromLeg) return choiceQ(r, `En un triángulo 45°-45°-90°, cada cateto mide ${k}. ¿Cuánto mide la hipotenusa?`, `${k}√2`, [`${k}√3`, `${2 * k}`, `${k}`, `${k * 2}√2`], `En un 45°-45°-90°, la hipotenusa es cateto × √2: ${k}√2.`, undefined, "45-hipotenusa");
    return choiceQ(r, `En un triángulo 45°-45°-90°, la hipotenusa mide ${k}√2. ¿Cuánto mide cada cateto?`, `${k}`, [`${k}√2`, `${2 * k}`, `${k}√3`], `Cateto = hipotenusa ÷ √2 = ${k}.`, undefined, "45-cateto");
  }
  const form = solve ? r.int(0, 2) : r.int(0, 1);
  if (form === 0) return choiceQ(r, `En un triángulo 30°-60°-90°, el cateto menor (opuesto a 30°) mide ${k}. ¿Cuánto mide la hipotenusa?`, `${2 * k}`, [`${k}√3`, `${k}√2`, `${2 * k}√3`], "La hipotenusa mide el doble del cateto menor.", undefined, "30-hipotenusa");
  if (form === 1) return choiceQ(r, `En un triángulo 30°-60°-90°, el cateto menor mide ${k}. ¿Cuánto mide el cateto mayor (opuesto a 60°)?`, `${k}√3`, [`${2 * k}`, `${k}√2`, `${3 * k}`], "El cateto mayor es el cateto menor × √3.", undefined, "30-cateto");
  return choiceQ(r, `En un triángulo 30°-60°-90°, la hipotenusa mide ${2 * k}. ¿Cuánto mide el cateto mayor?`, `${k}√3`, [`${k}`, `${2 * k}√3`, `${k}√2`], `Cateto menor = ${2 * k} ÷ 2 = ${k}; cateto mayor = ${k}√3.`, undefined, "30-resolver");
}

const SPECIAL: [Ratio, number, string][] = [
  ["sen", 30, "1/2"], ["sen", 45, "√2/2"], ["sen", 60, "√3/2"], ["cos", 30, "√3/2"], ["cos", 45, "√2/2"], ["cos", 60, "1/2"], ["tan", 30, "√3/3"], ["tan", 45, "1"], ["tan", 60, "√3"],
];
const VALUES = ["1/2", "√2/2", "√3/2", "√3/3", "1", "√3"];
// Q.6 / Q.10: funciones trigonométricas de ángulos especiales (y sus inversas).
export function specialAngles(r: Rng, inverse: boolean): Question {
  const [f, a, v] = r.pick(SPECIAL);
  if (inverse) {
    if (f === "tan" && a === 45) return specialAngles(r, inverse);
    const others = [30, 45, 60, 90].filter((x) => x !== a);
    return choiceQ(r, `¿Cuánto vale ${f}⁻¹(${v}), en grados? (El ángulo está entre 0° y 90°.)`, `${a}°`, others.map((x) => `${x}°`), `${f} ${a}° = ${v}, así que ${f}⁻¹(${v}) = ${a}°.`, undefined, f);
  }
  return choiceQ(r, `¿Cuál es el valor exacto de ${f} ${a}°?`, v, VALUES.filter((x) => x !== v).slice(0, 4), `${f} ${a}° = ${v}.`, undefined, f);
}

const fn = (f: Ratio, d: number) => (f === "sen" ? Math.sin(rad(d)) : f === "cos" ? Math.cos(rad(d)) : Math.tan(rad(d)));
// Q.8 / Q.11: funciones trigonométricas (e inversas) con calculadora.
export function trigCalculator(r: Rng, inverse: boolean): Question {
  const f = r.pick<Ratio>(["sen", "cos", "tan"]);
  const d = r.int(5, 85);
  if (inverse) {
    const v = r4(fn(f, d + r.int(1, 9) / 10));
    const ans = r1(deg(f === "sen" ? Math.asin(v) : f === "cos" ? Math.acos(v) : Math.atan(v)));
    return valQ(r, `Usa una calculadora. ¿Cuánto vale ${f}⁻¹(${dec(v)}), en grados? Redondea a la décima.`, ans, [r1(90 - ans), r1(ans + 1), r1(deg(v))], `Con la calculadora en grados: ${f}⁻¹(${dec(v)}) ≈ ${dec(ans)}°.`, undefined, f);
  }
  const v = r4(fn(f, d));
  const other = f === "sen" ? r4(Math.cos(rad(d))) : f === "cos" ? r4(Math.sin(rad(d))) : r4(1 / Math.tan(rad(d)));
  return valQ(r, `Usa una calculadora (en grados). ¿Cuánto vale ${f} ${d}°? Redondea a la diezmilésima.`, v, [other, r4(v + 0.01), r4(fn(f, d + 1))], `${f} ${d}° ≈ ${dec(v)}.`, undefined, f);
}

// Q.9: seno y coseno de ángulos complementarios.
export function complementaryTrig(r: Rng): Question {
  const d = r.int(10, 80);
  const v = r4(Math.sin(rad(d)));
  if (r.chance(0.5)) return valQ(r, `Si sen ${d}° ≈ ${dec(v)}, ¿cuánto vale cos ${90 - d}°?`, v, [r4(Math.cos(rad(d))), r4(1 - v), r4(v / 2)], `${d}° y ${90 - d}° son complementarios: cos ${90 - d}° = sen ${d}°.`, undefined, "complementarios");
  return choiceQ(r, `¿Qué expresión es igual a sen ${d}°?`, `cos ${90 - d}°`, [`cos ${d}°`, `sen ${90 - d}°`, `cos ${180 - d}°`, `tan ${90 - d}°`], `El seno de un ángulo es igual al coseno de su complemento: sen ${d}° = cos ${90 - d}°.`, undefined, "complementarios");
}

// Q.12-Q.15: hallar lados y ángulos en triángulos rectángulos (y problemas).
export function solveRight(r: Rng, mode: "side" | "angle" | "solve" | "word"): Question {
  const m = mode === "solve" ? r.pick(["side", "angle"] as const) : mode;
  const A = r.int(20, 70), hyp = r.int(5, 30);
  if (m === "side") {
    const which = r.int(0, 2);
    if (which === 0) return valQ(r, `${DESC} m∠A = ${A}° y AB = ${hyp}. ¿Cuánto mide BC? Redondea a la décima.`, r1(hyp * Math.sin(rad(A))), [r1(hyp * Math.cos(rad(A))), r1(hyp * Math.tan(rad(A))), r1(hyp / Math.sin(rad(A)))], `BC es opuesto a A: BC = AB × sen A = ${hyp} × sen ${A}° ≈ ${dec(r1(hyp * Math.sin(rad(A))))}.`, rightVisual("", "?", String(hyp)), "seno");
    if (which === 1) return valQ(r, `${DESC} m∠A = ${A}° y AB = ${hyp}. ¿Cuánto mide AC? Redondea a la décima.`, r1(hyp * Math.cos(rad(A))), [r1(hyp * Math.sin(rad(A))), r1(hyp / Math.cos(rad(A))), r1(hyp * Math.tan(rad(A)))], `AC es adyacente a A: AC = AB × cos A ≈ ${dec(r1(hyp * Math.cos(rad(A))))}.`, rightVisual("?", "", String(hyp)), "coseno");
    const ac = r.int(4, 20);
    return valQ(r, `${DESC} m∠A = ${A}° y AC = ${ac}. ¿Cuánto mide BC? Redondea a la décima.`, r1(ac * Math.tan(rad(A))), [r1(ac / Math.tan(rad(A))), r1(ac * Math.sin(rad(A))), r1(ac * Math.cos(rad(A)))], `BC = AC × tan A = ${ac} × tan ${A}° ≈ ${dec(r1(ac * Math.tan(rad(A))))}.`, rightVisual(String(ac), "?", ""), "tangente");
  }
  if (m === "angle") {
    const bc = r.int(3, 15), ac = r.int(3, 15);
    const ang = r1(deg(Math.atan(bc / ac)));
    return valQ(r, `${DESC} BC = ${bc} y AC = ${ac}. ¿Cuánto mide ∠A, en grados? Redondea a la décima.`, ang, [r1(90 - ang), r1(deg(Math.atan(ac / bc)) + 1), r1(ang + 2)], `tan A = ${bc}/${ac}, así que A = tan⁻¹(${bc}/${ac}) ≈ ${dec(ang)}°.`, rightVisual(String(ac), String(bc), ""), "angulo");
  }
  const form = r.int(0, 2);
  if (form === 0) {
    const L = r.int(4, 12), ang = r.int(55, 80);
    return valQ(r, `Una escalera de ${L} m se apoya en una pared formando un ángulo de ${ang}° con el suelo. ¿A qué altura llega? Redondea a la décima.`, r1(L * Math.sin(rad(ang))), [r1(L * Math.cos(rad(ang))), r1(L * Math.tan(rad(ang))), r1(L / Math.sin(rad(ang)))], `altura = ${L} × sen ${ang}° ≈ ${dec(r1(L * Math.sin(rad(ang))))} m.`, undefined, "escalera");
  }
  if (form === 1) {
    const d = r.int(10, 60), ang = r.int(20, 60);
    return valQ(r, `Desde ${d} m de la base de un edificio, el ángulo de elevación hasta su parte más alta es ${ang}°. ¿Cuánto mide el edificio? Redondea a la décima.`, r1(d * Math.tan(rad(ang))), [r1(d * Math.sin(rad(ang))), r1(d / Math.tan(rad(ang))), r1(d * Math.cos(rad(ang)))], `altura = ${d} × tan ${ang}° ≈ ${dec(r1(d * Math.tan(rad(ang))))} m.`, undefined, "elevacion");
  }
  const h = r.int(1, 3), l = r.int(8, 20);
  const ang = r1(deg(Math.asin(h / l)));
  return valQ(r, `Una rampa de ${l} m de largo sube ${h} m. ¿Qué ángulo forma con el suelo, en grados? Redondea a la décima.`, ang, [r1(deg(Math.atan(h / l))) === ang ? r1(ang + 0.5) : r1(deg(Math.atan(h / l))), r1(90 - ang), r1(ang * 2)], `sen θ = ${h}/${l}, así que θ = sen⁻¹(${h}/${l}) ≈ ${dec(ang)}°.`, undefined, "rampa");
}

// ---------------------------------------------------------------------------
// Ley de senos y de cosenos

// R.1-R.5: ley de senos, ley de cosenos, resolver un triángulo y áreas.
export function lawsTriangle(r: Rng, mode: "sines" | "cosines" | "solve" | "area" | "areaSines"): Question {
  const A = r.int(30, 80), B = r.int(30, 80), C = 180 - A - B;
  const a = r.int(5, 20);
  if (mode === "sines") {
    const b = r1((a * Math.sin(rad(B))) / Math.sin(rad(A)));
    return valQ(r, `En △ABC, m∠A = ${A}°, m∠B = ${B}° y a = ${a} (lado opuesto a A). ¿Cuánto mide b? Redondea a la décima.`, b, [r1((a * Math.sin(rad(A))) / Math.sin(rad(B))), r1(b + 1), r1((a * Math.sin(rad(C))) / Math.sin(rad(A)))], `Ley de senos: b = a × sen B ÷ sen A = ${a} × sen ${B}° ÷ sen ${A}° ≈ ${dec(b)}.`, undefined, "senos");
  }
  const b = r.int(5, 20), Cc = r.int(30, 120);
  if (mode === "cosines") {
    const c = r1(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(Cc))));
    return valQ(r, `En △ABC, a = ${a}, b = ${b} y m∠C = ${Cc}°. ¿Cuánto mide c? Redondea a la décima.`, c, [r1(Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad(Cc)))), r1(Math.sqrt(a * a + b * b)), r1(c + 1)], `Ley de cosenos: c² = a² + b² − 2ab cos C = ${a * a} + ${b * b} − 2(${a})(${b}) cos ${Cc}° → c ≈ ${dec(c)}.`, undefined, "cosenos");
  }
  if (mode === "solve") {
    const c = r.int(Math.abs(a - b) + 2, a + b - 2);
    const ang = r1(deg(Math.acos((a * a + b * b - c * c) / (2 * a * b))));
    return valQ(r, `Un triángulo tiene lados a = ${a}, b = ${b} y c = ${c}. ¿Cuánto mide el ángulo C (opuesto a c), en grados? Redondea a la décima.`, ang, [r1(180 - ang), r1(ang + 3), r1(deg(Math.acos((a * a + c * c - b * b) / (2 * a * c))))], `cos C = (a² + b² − c²) ÷ 2ab = (${a * a} + ${b * b} − ${c * c}) ÷ ${2 * a * b}, así que C ≈ ${dec(ang)}°.`, undefined, "resolver");
  }
  if (mode === "area") {
    const area = r1(0.5 * a * b * Math.sin(rad(Cc)));
    return valQ(r, `En △ABC, a = ${a}, b = ${b} y m∠C = ${Cc}°. ¿Cuál es su área? Redondea a la décima.`, area, [r1(a * b * Math.sin(rad(Cc))), r1(0.5 * a * b * Math.cos(rad(Cc))), r1(0.5 * a * b)], `Área = ½ab sen C = ½ × ${a} × ${b} × sen ${Cc}° ≈ ${dec(area)}.`, undefined, "area");
  }
  const bb = (a * Math.sin(rad(B))) / Math.sin(rad(A));
  const area = r1(0.5 * a * bb * Math.sin(rad(C)));
  return valQ(r, `En △ABC, m∠A = ${A}°, m∠B = ${B}° y a = ${a}. ¿Cuál es su área? Redondea a la décima. (Primero halla b con la ley de senos.)`, area, [r1(0.5 * a * a * Math.sin(rad(C))), r1(a * bb * Math.sin(rad(C))), r1(area + 2)], `b = ${a} × sen ${B}° ÷ sen ${A}° ≈ ${dec(r1(bb))}; m∠C = ${C}°; área = ½ × a × b × sen C ≈ ${dec(area)}.`, undefined, "area-senos");
}

