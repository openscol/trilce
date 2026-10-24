import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, numQ, sg } from "../kit";
import { nz } from "../sec1/util";
import { dec, valQ } from "../alg1/util";

// Precálculo: plano complejo, forma polar, vectores en dos y tres dimensiones.

type C = [number, number];
const cx = ([a, b]: C) => {
  if (b === 0) return sg(a);
  const im = `${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
  return a === 0 ? `${b < 0 ? "−" : ""}${im}` : `${sg(a)} ${b < 0 ? "−" : "+"} ${im}`;
};
const r1 = (n: number) => Math.round(n * 10) / 10;
const deg = (x: number) => (x * 180) / Math.PI;
// Plano complejo: eje real horizontal, imaginario vertical.
const cplane = (pts: { z: C; label: string }[]): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: pts.map((p) => ({ x: p.z[0], y: p.z[1], emoji: p.label })) });
const rz = (r: Rng): C => [r.int(-6, 6), nz(r, 6)];

// Introducción al plano complejo y graficar números complejos.
export function complexPlane(r: Rng, graph: boolean): Question {
  const zs = [rz(r), rz(r), rz(r), rz(r)];
  if (new Set(zs.map((z) => z.join())).size < 4) return complexPlane(r, graph);
  const i = r.int(0, 3);
  const labels = ["A", "B", "C", "D"];
  if (graph) return fixedQ(`¿Qué punto representa el número complejo ${cx(zs[i])}?`, labels, labels[i], `a + bi se ubica en (a, b): ${sg(zs[i][0])} en el eje real y ${sg(zs[i][1])} en el imaginario.`, cplane(zs.map((z, k) => ({ z, label: labels[k] }))), "graficar");
  return choiceQ(r, `¿Qué número complejo representa el punto ${labels[i]}? (Eje horizontal: parte real; eje vertical: parte imaginaria.)`, cx(zs[i]), [cx([zs[i][1], zs[i][0]]), cx([zs[i][0], -zs[i][1]]), cx([-zs[i][0], zs[i][1]])].filter((w, k, all) => w !== cx(zs[i]) && all.indexOf(w) === k), `El punto está en (${sg(zs[i][0])}, ${sg(zs[i][1])}): ${cx(zs[i])}.`, cplane(zs.map((z, k) => ({ z, label: labels[k] }))), "leer");
}

// Suma, resta, conjugado, valor absoluto, punto medio y distancia en el plano complejo.
export function complexPlaneOp(r: Rng, mode: "add" | "sub" | "conj" | "abs" | "mid" | "dist"): Question {
  const p: C = [r.int(-4, 4), nz(r, 4)], q: C = [r.int(-4, 4), nz(r, 4)];
  if (mode === "add" || mode === "sub") {
    const res: C = mode === "add" ? [p[0] + q[0], p[1] + q[1]] : [p[0] - q[0], p[1] - q[1]];
    return choiceQ(r, `En el plano, P = ${cx(p)} y Q = ${cx(q)}. ¿Qué número representa ${mode === "add" ? "P + Q" : "P − Q"}?`, cx(res), [cx([res[0], -res[1]]), cx(mode === "add" ? [p[0] - q[0], p[1] - q[1]] : [p[0] + q[0], p[1] + q[1]]), cx([res[1], res[0]])].filter((w, k, all) => w !== cx(res) && all.indexOf(w) === k), `${mode === "add" ? "Se suman" : "Se restan"} las coordenadas: ${cx(res)} (como sumar o restar vectores).`, cplane([{ z: p, label: "P" }, { z: q, label: "Q" }]), mode);
  }
  if (mode === "conj") return choiceQ(r, `¿Qué número representa el conjugado del punto P?`, cx([p[0], -p[1]]), [cx([-p[0], p[1]]), cx([-p[0], -p[1]]), cx([p[1], p[0]])].filter((w, k, all) => w !== cx([p[0], -p[1]]) && all.indexOf(w) === k), "El conjugado es el reflejo respecto del eje real: a − bi.", cplane([{ z: p, label: "P" }]), "conjugado");
  if (mode === "abs") {
    const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [0, 6, 6]]);
    const z: C = [a * r.pick([1, -1]), b * r.pick([1, -1])];
    return numQ(c, `¿Cuál es el valor absoluto (distancia al origen) de ${cx(z)}?`, cplane([{ z, label: "P" }]), `|a + bi| = √(a² + b²) = √(${a * a} + ${b * b}) = ${c}.`, "modulo");
  }
  if (mode === "mid") {
    const q2: C = [p[0] + 2 * r.int(-2, 2), p[1] + 2 * r.int(-2, 2)];
    const m: C = [(p[0] + q2[0]) / 2, (p[1] + q2[1]) / 2];
    return choiceQ(r, `¿Cuál es el punto medio entre ${cx(p)} y ${cx(q2)} en el plano complejo?`, cx(m), [cx([p[0] + q2[0], p[1] + q2[1]]), cx([m[0], -m[1]]), cx([(q2[0] - p[0]) / 2, (q2[1] - p[1]) / 2])].filter((w, k, all) => w !== cx(m) && all.indexOf(w) === k), "Se promedian las partes reales y las imaginarias.", undefined, "punto-medio");
  }
  const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
  const q3: C = [p[0] + a, p[1] + b * r.pick([1, -1])];
  return numQ(c, `¿Cuál es la distancia entre ${cx(p)} y ${cx(q3)} en el plano complejo?`, undefined, `|(${cx(q3)}) − (${cx(p)})| = √(${a}² + ${b}²) = ${c}.`, "distancia");
}

// Módulo y argumento; forma polar y rectangular.
// [rectangular, conjugado, opuesto, intercambiado, módulo, argumento en grados]
const NICE: [string, string, string, string, string, number][] = [
  ["1 + i", "1 − i", "−1 − i", "−1 + i", "√2", 45],
  ["2i", "−2i", "−2", "2", "2", 90],
  ["−3", "3", "3i", "−3i", "3", 180],
  ["1 + √3 i", "1 − √3 i", "−1 − √3 i", "√3 + i", "2", 60],
  ["−1 + i", "−1 − i", "1 − i", "1 + i", "√2", 135],
  ["−4i", "4i", "4", "−4", "4", 270],
  ["2 − 2i", "2 + 2i", "−2 + 2i", "−2 − 2i", "2√2", 315],
  ["√3 + i", "√3 − i", "−√3 − i", "1 + √3 i", "2", 30],
];
export function polarForm(r: Rng, mode: "modArg" | "toPolar" | "toRect" | "both"): Question {
  if (mode === "modArg") {
    const [a, b] = [r.int(-6, 6) || 2, nz(r, 6)];
    const mod = r1(Math.hypot(a, b));
    let arg = deg(Math.atan2(b, a));
    if (arg < 0) arg += 360;
    if (r.chance(0.5)) return valQ(r, `¿Cuál es el módulo de ${cx([a, b])}? Redondea a la décima.`, mod, [Math.abs(a) + Math.abs(b), r1(Math.hypot(a, b) ** 2), mod + 1], `r = √(${a * a} + ${b * b}) ≈ ${dec(mod)}.`, undefined, "modulo");
    return valQ(r, `¿Cuál es el argumento (entre 0° y 360°) de ${cx([a, b])}? Redondea a la décima.`, r1(arg), [r1(360 - arg), r1((arg + 180) % 360), r1(deg(Math.atan(Math.abs(b / a))))].filter((v) => v !== r1(arg)), `tan θ = ${sg(b)}/${sg(a)}; teniendo en cuenta el cuadrante, θ ≈ ${dec(r1(arg))}°.`, undefined, "argumento");
  }
  const toPolar = mode === "toPolar" || (mode === "both" && r.chance(0.5));
  const [z, conj, neg, swap, modT, ang] = r.pick(NICE);
  const pol = (m: string, a: number) => `${m}(cos ${a}° + i sen ${a}°)`;
  const polar = pol(modT, ang);
  if (toPolar) return choiceQ(r, `¿Cómo se escribe ${z} en forma polar?`, polar, [pol(modT, (ang + 90) % 360), pol(modT, (360 - ang) % 360), pol(modT === "2" ? "4" : "2", ang)].filter((w) => w !== polar), `r = |${z}| = ${modT} y el argumento es ${ang}°.`, undefined, "a-polar");
  return choiceQ(r, `¿Cómo se escribe ${polar} en forma rectangular?`, z, [conj, neg, swap].filter((w) => w !== z), `a = r cos θ y b = r sen θ: ${z}.`, undefined, "a-rectangular");
}

// Relacionar ecuaciones polares con sus gráficos.
const POLAR: [string, (t: number) => number, string][] = [["r = 4", () => 4, "Circunferencia de radio 4 centrada en el origen."], ["r = 4 cos θ", (t) => 4 * Math.cos(t), "Circunferencia de diámetro 4 a la derecha del origen."], ["r = 4 sen θ", (t) => 4 * Math.sin(t), "Circunferencia de diámetro 4 encima del origen."], ["r = 4 sen(2θ)", (t) => 4 * Math.sin(2 * t), "Rosa de 4 pétalos."], ["r = 4 cos(3θ)", (t) => 4 * Math.cos(3 * t), "Rosa de 3 pétalos."], ["r = 2 + 2 cos θ", (t) => 2 + 2 * Math.cos(t), "Cardioide que se abre hacia la derecha."]];
export function polarGraph(r: Rng): Question {
  const i = r.int(0, POLAR.length - 1);
  const [eq, f, why] = POLAR[i];
  const pts = Array.from({ length: 361 }, (_, k) => { const t = (k * Math.PI) / 180; const rr = f(t); return { x: rr * Math.cos(t), y: rr * Math.sin(t) }; });
  return choiceQ(r, "¿Qué ecuación polar corresponde al gráfico?", eq, r.shuffle(POLAR.filter((_, k) => k !== i).map((p) => p[0])).slice(0, 3), why, { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: pts }] }, "polar");
}

// ---------------------------------------------------------------------------
// Vectores

const vec = (...cs: number[]) => `⟨${cs.map(sg).join(", ")}⟩`;
const PY: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];

// Ángulo de dirección de un vector.
export function directionAngle(r: Rng): Question {
  const x = nz(r, 8), y = nz(r, 8);
  let a = deg(Math.atan2(y, x));
  if (a < 0) a += 360;
  return valQ(r, `¿Cuál es el ángulo de dirección (entre 0° y 360°) del vector ${vec(x, y)}? Redondea a la décima.`, r1(a), [r1(360 - a), r1((a + 180) % 360), r1(deg(Math.atan(Math.abs(y / x))))].filter((v) => v !== r1(a)), `tan θ = ${sg(y)}/${sg(x)} y el vector está en el cuadrante ${x > 0 ? (y > 0 ? "I" : "IV") : y > 0 ? "II" : "III"}: θ ≈ ${dec(r1(a))}°.`, undefined, "direccion");
}

// Módulo y dirección de una suma de vectores.
export function sumMagnitude(r: Rng): Question {
  const [a, b, c] = r.pick(PY);
  const u = [r.int(-3, 3), r.int(-3, 3)];
  const v = [a * r.pick([1, -1]) - u[0], b * r.pick([1, -1]) - u[1]];
  const s = [u[0] + v[0], u[1] + v[1]];
  return numQ(c, `¿Cuál es el módulo de u + v si u = ${vec(u[0], u[1])} y v = ${vec(v[0], v[1])}?`, undefined, `u + v = ${vec(s[0], s[1])}; |u + v| = √(${s[0] * s[0]} + ${s[1] * s[1]}) = ${c}.`, "suma");
}

// Múltiplos escalares, unidades y combinaciones lineales.
export function scalarVector(r: Rng, mode: "multiply" | "magnitude" | "direction" | "unit" | "combo"): Question {
  const [a, b, c] = r.pick(PY);
  const u = [a * r.pick([1, -1]), b * r.pick([1, -1])];
  const k = r.pick([2, 3, -2, -1, 4]);
  if (mode === "multiply") return choiceQ(r, `Si u = ${vec(u[0], u[1])}, ¿cuánto es ${k === -1 ? "−" : sg(k)}u?`, vec(k * u[0], k * u[1]), [vec(k * u[0], u[1]), vec(u[0] + k, u[1] + k), vec(-k * u[0], -k * u[1])], "Se multiplica cada componente por el escalar.", undefined, "multiplicar");
  if (mode === "magnitude") return numQ(Math.abs(k) * c, `Si |u| = ${c}, ¿cuánto mide |${k === -1 ? "−" : sg(k)}u|?`, undefined, `|ku| = |k| · |u| = ${Math.abs(k)} × ${c} = ${Math.abs(k) * c}.`, "modulo");
  if (mode === "direction") return fixedQ(`¿Qué dirección tiene ${k === -1 ? "−" : sg(k)}u respecto de u?`, ["La misma dirección", "La dirección opuesta", "Perpendicular a u"], k > 0 ? "La misma dirección" : "La dirección opuesta", k > 0 ? "Un escalar positivo conserva la dirección." : "Un escalar negativo invierte la dirección.", undefined, k > 0 ? "misma" : "opuesta");
  if (mode === "unit") return choiceQ(r, `¿Cuál es el vector unitario en la dirección de u = ${vec(u[0], u[1])}?`, `⟨${u[0] < 0 ? "−" : ""}${a}/${c}, ${u[1] < 0 ? "−" : ""}${b}/${c}⟩`, [`⟨${u[0] < 0 ? "−" : ""}${b}/${c}, ${u[1] < 0 ? "−" : ""}${a}/${c}⟩`, `⟨${u[0] < 0 ? "" : "−"}${a}/${c}, ${u[1] < 0 ? "" : "−"}${b}/${c}⟩`, vec(u[0] / Math.abs(u[0]), u[1] / Math.abs(u[1]))], `u ÷ |u| con |u| = ${c}.`, undefined, "unitario");
  const v = [nz(r, 5), nz(r, 5)], m = r.pick([2, 3, -1]);
  const res = [k * u[0] + m * v[0], k * u[1] + m * v[1]];
  return choiceQ(r, `Si u = ${vec(u[0], u[1])} y v = ${vec(v[0], v[1])}, ¿cuánto es ${k === -1 ? "−" : sg(k)}u ${m < 0 ? "−" : "+"} ${Math.abs(m) === 1 ? "" : Math.abs(m)}v?`, vec(res[0], res[1]), [vec(k * u[0] - m * v[0], k * u[1] - m * v[1]), vec(k * u[0] + v[0], k * u[1] + v[1]), vec(res[1], res[0])].filter((w, i, all) => w !== vec(res[0], res[1]) && all.indexOf(w) === i), "Se multiplica cada vector por su escalar y se suman las componentes.", undefined, "combinacion");
}

// Vectores en tres dimensiones.
const PY3: [number, number, number, number][] = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9]];
export function vector3D(r: Rng, mode: "magnitude" | "components" | "addsub" | "scalar" | "unit" | "combo"): Question {
  const [a, b, c, m] = r.pick(PY3);
  const u = r.shuffle([a, b, c]).map((x) => x * r.pick([1, -1]));
  const v = [nz(r, 5), nz(r, 5), nz(r, 5)];
  const k = r.pick([2, 3, -2]);
  if (mode === "magnitude") return numQ(m, `¿Cuál es el módulo del vector ${vec(...u)}?`, undefined, `√(${u.map((x) => `${x * x}`).join(" + ")}) = √${m * m} = ${m}.`, "modulo");
  if (mode === "components") {
    const P = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
    const Q = P.map((x, i) => x + v[i]);
    return choiceQ(r, `Un vector va de P(${P.map(sg).join(", ")}) a Q(${Q.map(sg).join(", ")}). ¿Cuál es su forma de componentes?`, vec(...v), [vec(...v.map((x) => -x)), vec(...P.map((x, i) => x + Q[i])), vec(v[1], v[0], v[2])].filter((w, i, all) => w !== vec(...v) && all.indexOf(w) === i), "Se resta el punto inicial al final, componente a componente.", undefined, "componentes");
  }
  if (mode === "addsub") {
    const sub = r.chance(0.5);
    const res = u.map((x, i) => (sub ? x - v[i] : x + v[i]));
    return choiceQ(r, `Si u = ${vec(...u)} y v = ${vec(...v)}, ¿cuánto es u ${sub ? "−" : "+"} v?`, vec(...res), [vec(...u.map((x, i) => (sub ? x + v[i] : x - v[i]))), vec(...res.map((x, i) => (i === 2 ? -x : x))), vec(...v.map((x, i) => x - u[i]))].filter((w, i, all) => w !== vec(...res) && all.indexOf(w) === i), `Se ${sub ? "restan" : "suman"} las componentes.`, undefined, sub ? "restar" : "sumar");
  }
  if (mode === "scalar") return choiceQ(r, `Si u = ${vec(...u)}, ¿cuánto es ${sg(k)}u?`, vec(...u.map((x) => k * x)), [vec(...u.map((x) => x + k)), vec(k * u[0], u[1], u[2]), vec(...u.map((x) => -k * x))], "Se multiplica cada componente por el escalar.", undefined, "escalar");
  if (mode === "unit") {
    const good = `⟨${u.map((x) => `${x < 0 ? "−" : ""}${Math.abs(x)}/${m}`).join(", ")}⟩`;
    return choiceQ(r, `¿Cuál es el vector unitario en la dirección de ${vec(...u)}?`, good, [`⟨${u.map((x) => `${x < 0 ? "−" : ""}${Math.abs(x)}/${m * m}`).join(", ")}⟩`, `⟨${u.map((x) => `${x < 0 ? "" : "−"}${Math.abs(x)}/${m}`).join(", ")}⟩`, vec(...u.map((x) => Math.sign(x)))], `u ÷ |u| con |u| = ${m}.`, undefined, "unitario");
  }
  const res = u.map((x, i) => k * x + v[i]);
  return choiceQ(r, `Si u = ${vec(...u)} y v = ${vec(...v)}, ¿cuánto es ${sg(k)}u + v?`, vec(...res), [vec(...u.map((x, i) => x + k * v[i])), vec(...u.map((x, i) => k * (x + v[i]))), vec(...u.map((x, i) => k * x - v[i]))].filter((w, i, all) => w !== vec(...res) && all.indexOf(w) === i), "Se multiplica u por el escalar y se suma v componente a componente.", undefined, "combinacion");
}
