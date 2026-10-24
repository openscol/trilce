import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, intQ, numQ, sg, table, yesNo } from "../kit";
import { lin, nz } from "../sec1/util";
import { pt } from "../sec2/util";
import { curve, dec, poly, valQ, xMinus } from "../alg1/util";

// Precálculo: límites (gráficos y leyes), continuidad e introducción a las
// derivadas (tasas de cambio, rectas tangentes).

// Función por partes con un posible salto, hueco o valor aislado en x = a.
type Piece = { a: number; L: number; R: number; fa: number | null; m1: number; m2: number };
function randomPiece(r: Rng, kind: "continuous" | "hole" | "jump" | "isolated" | "any" = "any"): Piece {
  const k = kind === "any" ? r.pick(["continuous", "hole", "jump", "isolated"] as const) : kind;
  const a = r.int(-2, 2), L = r.int(-3, 3), m1 = r.pick([1, -1, 0.5, 2]), m2 = r.pick([1, -1, -0.5, 0]);
  const R = k === "jump" ? L + r.pick([-3, -2, 2, 3]) : L;
  const fa = k === "hole" ? null : k === "isolated" ? L + r.pick([-2, 2, 3]) : k === "jump" ? r.pick([L, R]) : L;
  return { a, L, R, fa, m1, m2 };
}
const pieceVisual = (p: Piece): Visual => {
  const left = { from: { x: -7, y: p.L + p.m1 * (-7 - p.a) }, to: { x: p.a, y: p.L }, color: "green" as const };
  const right = { from: { x: p.a, y: p.R }, to: { x: 7, y: p.R + p.m2 * (7 - p.a) }, color: "green" as const };
  const open = [{ x: p.a, y: p.L }, { x: p.a, y: p.R }].filter((q, i, all) => q.y !== p.fa && all.findIndex((z) => z.y === q.y) === i);
  return { kind: "coordPlane", min: -6, max: 6, points: p.fa === null ? [] : [{ x: p.a, y: p.fa, emoji: "•" }], openPoints: open, lines: [left, right] };
};
const DNE = "No existe";

// HH.1-HH.3: límites (y límites laterales) a partir de gráficos.
export function limitGraph(r: Rng, mode: "two" | "one" | "exists"): Question {
  const p = randomPiece(r, mode === "two" ? r.pick(["continuous", "hole", "isolated"] as const) : "any");
  const v = pieceVisual(p);
  if (mode === "one") {
    const left = r.chance(0.5);
    const val = left ? p.L : p.R;
    return intQ(r, `Según el gráfico, ¿cuánto vale el límite de f(x) cuando x tiende a ${sg(p.a)} por la ${left ? "izquierda" : "derecha"}?`, val, `Al acercarse a x = ${sg(p.a)} por la ${left ? "izquierda" : "derecha"}, la gráfica se acerca a y = ${sg(val)} (no importa el valor de f(${sg(p.a)})).`, v, left ? "izquierda" : "derecha", [left ? p.R : p.L, p.fa ?? val + 1]);
  }
  if (mode === "exists") {
    const ok = p.L === p.R;
    return yesNo(`Según el gráfico, ¿existe el límite de f(x) cuando x tiende a ${sg(p.a)}?`, ok, ok ? `Los límites laterales coinciden (${sg(p.L)}).` : `Por la izquierda tiende a ${sg(p.L)} y por la derecha a ${sg(p.R)}: no coinciden.`, v, ok ? "existe" : "no-existe");
  }
  return choiceQ(r, `Según el gráfico, ¿cuánto vale el límite de f(x) cuando x tiende a ${sg(p.a)}?`, sg(p.L), [p.fa !== null && p.fa !== p.L ? sg(p.fa) : sg(p.L + 1), DNE, sg(p.a), sg(p.L - 1)].filter((w, i, all) => w !== sg(p.L) && all.indexOf(w) === i).slice(0, 3), `Los dos lados se acercan a ${sg(p.L)}; el límite no depende del valor en el punto${p.fa === null ? " (aunque allí haya un hueco)" : ""}.`, v, "limite");
}

// HH.4 / HH.5: límites en asíntotas verticales y comportamiento en los extremos.
export function limitInfinite(r: Rng, end: boolean): Question {
  const a = r.int(-3, 3), k = r.pick([1, 2, 3]), c = r.int(-2, 2), sq = r.chance(0.4);
  const f = (x: number) => (sq ? k / (x - a) ** 2 : k / (x - a)) + c;
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: curve(f, -6, a - 0.08, 0.02), color: "green" }, { points: curve(f, a + 0.08, 6, 0.02), color: "green" }], lines: [{ from: { x: a, y: -6 }, to: { x: a, y: 6 }, dashed: true, color: "sky" }] };
  if (end) {
    const plus = r.chance(0.5);
    return choiceQ(r, `Según el gráfico, ¿a qué valor tiende f(x) cuando x tiende a ${plus ? "+∞" : "−∞"}?`, sg(c), [sg(a), "+∞", "−∞", sg(c + 1)].filter((w) => w !== sg(c)).slice(0, 3), `La gráfica se acerca a la asíntota horizontal y = ${sg(c)}.`, visual, "extremos");
  }
  const left = r.chance(0.5);
  const val = sq ? "+∞" : left ? "−∞" : "+∞";
  return choiceQ(r, `Según el gráfico, ¿cuál es el límite de f(x) cuando x tiende a ${sg(a)} por la ${left ? "izquierda" : "derecha"}?`, val, ["+∞", "−∞", sg(c), DNE].filter((w) => w !== val), `Cerca de la asíntota vertical x = ${sg(a)}, la gráfica ${val === "+∞" ? "sube sin límite" : "baja sin límite"}.`, visual, "asintota");
}

// HH.6-HH.9: leyes de los límites.
export function limitLaws(r: Rng, mode: "addMul" | "div" | "powRoot" | "all"): Question {
  const F = nz(r, 6), G = nz(r, 5), a = r.int(-3, 3);
  const m = mode === "all" ? r.pick(["addMul", "div", "powRoot"] as const) : mode;
  const head = `Si lím(x→${sg(a)}) f(x) = ${sg(F)} y lím(x→${sg(a)}) g(x) = ${sg(G)}`;
  if (m === "addMul") {
    const p = r.int(2, 4), q = r.int(1, 3);
    if (r.chance(0.5)) return intQ(r, `${head}, ¿cuánto vale lím(x→${sg(a)}) [${p}f(x) − ${q === 1 ? "" : q}g(x)]?`, p * F - q * G, `Se aplican las leyes: ${p} × ${sg(F)} − ${q} × ${G < 0 ? `(${sg(G)})` : G} = ${sg(p * F - q * G)}.`, undefined, "suma", [p * F + q * G, F - G]);
    return intQ(r, `${head}, ¿cuánto vale lím(x→${sg(a)}) [f(x) · g(x)]?`, F * G, `El límite del producto es el producto de los límites: ${sg(F)} × ${G < 0 ? `(${sg(G)})` : G} = ${sg(F * G)}.`, undefined, "producto", [F + G, -F * G]);
  }
  if (m === "div") {
    const k = nz(r, 4);
    const Fd = G * k;
    return intQ(r, `Si lím(x→${sg(a)}) f(x) = ${sg(Fd)} y lím(x→${sg(a)}) g(x) = ${sg(G)}, ¿cuánto vale lím(x→${sg(a)}) [f(x) / g(x)]?`, k, `El límite del cociente es el cociente de los límites (el de abajo no es 0): ${sg(Fd)} ÷ ${G < 0 ? `(${sg(G)})` : G} = ${sg(k)}.`, undefined, "cociente", [Fd * G, -k]);
  }
  const s = r.int(1, 5);
  if (r.chance(0.5)) return intQ(r, `Si lím(x→${sg(a)}) f(x) = ${sg(F)}, ¿cuánto vale lím(x→${sg(a)}) [f(x)]³?`, F ** 3, `Ley de la potencia: (${sg(F)})³ = ${sg(F ** 3)}.`, undefined, "potencia", [3 * F, F * F]);
  return numQ(s, `Si lím(x→${sg(a)}) f(x) = ${s * s}, ¿cuánto vale lím(x→${sg(a)}) √f(x)?`, undefined, `Ley de la raíz: √${s * s} = ${s}.`, "raiz");
}

// HH.10: límites de polinomios y funciones racionales (sustitución directa).
export function limitSubstitution(r: Rng): Question {
  const a = r.int(-3, 3), p = [r.int(1, 3), nz(r, 5), r.int(-6, 6)];
  const ev = (q: number[], x: number) => q.reduce((s, c) => s * x + c, 0);
  if (r.chance(0.5)) return intQ(r, `¿Cuánto vale lím(x→${sg(a)}) (${poly(p)})?`, ev(p, a), `Un polinomio es continuo: se reemplaza x = ${sg(a)} y da ${sg(ev(p, a))}.`, undefined, "polinomio", [ev(p, -a), p[2]]);
  const d = r.int(1, 4) * r.pick([1, -1]);
  if (a + d === 0) return limitSubstitution(r);
  const num = ev(p, a), den = a + d;
  const g = (x: number, y: number): number => (y ? g(y, x % y) : Math.abs(x));
  const k = g(num, den) || 1;
  const fr = den / k < 0 ? `${-num / k}/${-den / k}` : `${num / k}/${den / k}`;
  const good = fr.endsWith("/1") ? sg(Number(fr.split("/")[0])) : fr.replace(/^-/, "−");
  return choiceQ(r, `¿Cuánto vale lím(x→${sg(a)}) (${poly(p)}) / (x ${d < 0 ? "−" : "+"} ${Math.abs(d)})?`, good, [DNE, "0", sg(num)].filter((w) => w !== good), `El denominador no se anula en x = ${sg(a)}: se reemplaza y da ${sg(num)} ÷ ${den < 0 ? `(${sg(den)})` : den} = ${good}.`, undefined, "racional");
}

// HH.11: límites con factorización y racionalización.
export function limitIndeterminate(r: Rng): Question {
  if (r.chance(0.6)) {
    const a = nz(r, 5), b = r.int(-5, 5);
    // (x − a)(x − b) / (x − a) → a − b
    const num = poly([1, -(a + b), a * b]);
    return intQ(r, `¿Cuánto vale lím(x→${sg(a)}) (${num}) / (${xMinus(a)})?`, a - b, `Al reemplazar queda 0/0. Se factoriza: (${xMinus(a)})(${xMinus(b)}) / (${xMinus(a)}) = ${xMinus(b)} → ${sg(a)} − ${b < 0 ? `(${sg(b)})` : b} = ${sg(a - b)}.`, undefined, "factorizar", [0, a + b]);
  }
  const k = r.int(1, 5);
  // (√(x + k²) − k) / x → 1/(2k)
  return choiceQ(r, `¿Cuánto vale lím(x→0) (√(x + ${k * k}) − ${k}) / x?`, `1/${2 * k}`, ["0", DNE, `${2 * k}`, `1/${k}`].filter((w) => w !== `1/${2 * k}`).slice(0, 3), `Se multiplica por el conjugado √(x + ${k * k}) + ${k}: queda 1 / (√(x + ${k * k}) + ${k}) → 1/${2 * k}.`, undefined, "racionalizar");
}

// ---------------------------------------------------------------------------
// Continuidad

const DISC = ["Removible (un hueco)", "De salto", "Infinita (asíntota vertical)", "Es continua"];
// II.1-II.5: continuidad a partir de gráficos.
export function continuity(r: Rng, mode: "identify" | "atPoint" | "oneSided" | "type" | "interval"): Question {
  const p = randomPiece(r);
  const v = pieceVisual(p);
  const cont = p.L === p.R && p.fa === p.L;
  if (mode === "identify") return yesNo("¿La función del gráfico es continua en todos los números reales?", cont, cont ? "Se puede dibujar sin levantar el lápiz." : `En x = ${sg(p.a)} hay ${p.fa === null ? "un hueco" : p.L !== p.R ? "un salto" : "un punto separado del resto"}.`, v, cont ? "continua" : "discontinua");
  if (mode === "atPoint") return yesNo(`¿f es continua en x = ${sg(p.a)}?`, cont, cont ? `El límite existe, f(${sg(p.a)}) existe y son iguales.` : p.fa === null ? `f(${sg(p.a)}) no está definida.` : p.L !== p.R ? "El límite no existe (los laterales no coinciden)." : `El límite es ${sg(p.L)} pero f(${sg(p.a)}) = ${sg(p.fa)}.`, v, cont ? "si" : "no");
  if (mode === "oneSided") {
    const left = r.chance(0.5);
    const ok = p.fa !== null && p.fa === (left ? p.L : p.R);
    return yesNo(`¿f es continua por la ${left ? "izquierda" : "derecha"} en x = ${sg(p.a)}?`, ok, ok ? `El límite por la ${left ? "izquierda" : "derecha"} es igual a f(${sg(p.a)}).` : `El límite por la ${left ? "izquierda" : "derecha"} (${sg(left ? p.L : p.R)}) no coincide con f(${sg(p.a)})${p.fa === null ? ", que no existe" : ` = ${sg(p.fa)}`}.`, v, ok ? "si" : "no");
  }
  if (mode === "type") {
    if (r.chance(0.25)) {
      const a = r.int(-3, 3);
      const f = (x: number) => 1 / (x - a);
      return fixedQ(`¿Qué tipo de discontinuidad tiene la función en x = ${sg(a)}?`, DISC, DISC[2], "La gráfica sube o baja sin límite cerca de x = " + sg(a) + ".", { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: curve(f, -6, a - 0.1, 0.02), color: "green" }, { points: curve(f, a + 0.1, 6, 0.02), color: "green" }] }, "infinita");
    }
    const k = cont ? 3 : p.L !== p.R ? 1 : 0;
    return fixedQ(`¿Qué tipo de discontinuidad tiene la función en x = ${sg(p.a)}?`, DISC, DISC[k], ["El límite existe pero no coincide con el valor (o no hay valor): se «arregla» rellenando el hueco.", "Los límites laterales son distintos.", "", "No hay discontinuidad."][k], v, ["removible", "salto", "infinita", "continua"][k]);
  }
  const inside = r.chance(0.5);
  const lo = inside ? p.a - r.int(1, 3) : p.a + 1, hi = inside ? p.a + r.int(1, 3) : p.a + r.int(3, 5);
  const ok = cont || !inside;
  return yesNo(`¿f es continua en el intervalo (${sg(lo)}, ${sg(hi)})?`, ok, ok ? (cont ? "Es continua en todas partes." : `El único problema está en x = ${sg(p.a)}, fuera del intervalo.`) : `x = ${sg(p.a)} está dentro del intervalo y allí no es continua.`, v, ok ? "si" : "no");
}

// ---------------------------------------------------------------------------
// Introducción a las derivadas

const ev = (q: number[], x: number) => q.reduce((s, c) => s * x + c, 0);
const deriv = (q: number[]) => q.slice(0, -1).map((c, i) => c * (q.length - 1 - i));

// JJ.1 / JJ.2: tasa de cambio promedio (fórmula o tabla).
export function averageRateJJ(r: Rng, fromTable: boolean): Question {
  const q = [r.int(-2, 3) || 1, r.int(-5, 5), r.int(-6, 6)];
  const a = r.int(-3, 2), b = a + r.int(1, 4);
  const rate = (ev(q, b) - ev(q, a)) / (b - a);
  if (fromTable) {
    const xs = [a, a + 1, a + 2, a + 3, a + 4];
    return valQ(r, `Según la tabla, ¿cuál es la tasa de cambio promedio de f entre x = ${sg(a)} y x = ${sg(b)}?`, rate, [-rate, ev(q, b) - ev(q, a), rate + 1], `(f(${sg(b)}) − f(${sg(a)})) ÷ (${sg(b)} − ${a < 0 ? `(${sg(a)})` : a}) = (${sg(ev(q, b))} − ${ev(q, a) < 0 ? `(${sg(ev(q, a))})` : ev(q, a)}) ÷ ${b - a} = ${dec(rate)}.`, table(["x", "f(x)"], xs.map((x) => [sg(x), sg(ev(q, x))])), "tabla");
  }
  return valQ(r, `¿Cuál es la tasa de cambio promedio de f(x) = ${poly(q)} entre x = ${sg(a)} y x = ${sg(b)}?`, rate, [-rate, ev(q, b) - ev(q, a), rate + 2], `(f(${sg(b)}) − f(${sg(a)})) ÷ (${sg(b)} − ${a < 0 ? `(${sg(a)})` : a}) = ${dec(rate)}.`, undefined, "formula");
}

// JJ.3 / JJ.5 / JJ.6: tasas instantáneas, derivadas y pendientes de rectas tangentes (con límites).
export function derivativeValue(r: Rng, mode: "rate" | "value" | "slope"): Question {
  const q = [r.int(-2, 3) || 1, r.int(-5, 5), r.int(-6, 6)];
  const a = r.int(-3, 3);
  const d = ev(deriv(q), a);
  const prompt = mode === "rate" ? `¿Cuál es la tasa de cambio instantánea de f(x) = ${poly(q)} en x = ${sg(a)}?` : mode === "value" ? `Si f(x) = ${poly(q)}, ¿cuánto vale f′(${sg(a)}) = lím(h→0) [f(${sg(a)} + h) − f(${sg(a)})] / h?` : `¿Cuál es la pendiente de la recta tangente a f(x) = ${poly(q)} en x = ${sg(a)}?`;
  return intQ(r, prompt, d, `[f(${sg(a)} + h) − f(${sg(a)})] / h = ${sg(2 * q[0] * a + q[1])} ${q[0] < 0 ? "−" : "+"} ${Math.abs(q[0]) === 1 ? "" : Math.abs(q[0])}h; cuando h → 0 queda ${sg(d)}.`, undefined, mode, [ev(q, a), q[0] * a + q[1], d + q[0]]);
}

// JJ.4: velocidad como tasa de cambio.
export function velocity(r: Rng): Question {
  const v0 = r.int(10, 40), t = r.int(1, 4), h0 = r.int(0, 30);
  const v = v0 - 10 * t;
  return intQ(r, `La altura de una pelota (en m) a los t segundos es h(t) = −5t² + ${v0}t${h0 ? ` + ${h0}` : ""}. ¿Cuál es su velocidad (en m/s) a los ${t} segundos?`, v, `v(t) = lím(Δt→0) [h(t + Δt) − h(t)] / Δt = −10t + ${v0}; v(${t}) = ${sg(v)}. ${v < 0 ? "Es negativa: la pelota ya está bajando." : ""}`, undefined, "velocidad", [-5 * t * t + v0 * t + h0, v0, -v]);
}

// JJ.7: ecuación de la recta tangente.
export function tangentLine(r: Rng): Question {
  const q = [r.int(-2, 3) || 1, r.int(-4, 4), r.int(-5, 5)];
  const a = r.int(-2, 2);
  const m = ev(deriv(q), a), y0 = ev(q, a);
  const b = y0 - m * a;
  const good = `y = ${lin(m, b)}`;
  return choiceQ(r, `¿Cuál es la ecuación de la recta tangente a f(x) = ${poly(q)} en el punto ${pt({ x: a, y: y0 })}?`, good, [`y = ${lin(y0, m)}`, `y = ${lin(m, y0)}`, `y = ${lin(-m, y0 + m * a)}`, `y = ${lin(m, b + 1)}`, `y = ${lin(m + 1, b)}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Pendiente f′(${sg(a)}) = ${sg(m)}; recta por ${pt({ x: a, y: y0 })}: y − ${y0 < 0 ? `(${sg(y0)})` : y0} = ${sg(m)}(x − ${a < 0 ? `(${sg(a)})` : a}) → ${good}.`, undefined, "tangente");
}
