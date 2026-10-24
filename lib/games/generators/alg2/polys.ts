import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, intQ, numQ, sg, yesNo } from "../kit";
import { nz } from "../sec1/util";
import { binom, curve, poly, polyMul, xMinus } from "../alg1/util";

// Álgebra 2: números complejos y polinomios (división sintética, teorema del
// binomio, suma y diferencia de cubos, teoremas sobre raíces y gráficos).

// ---------------------------------------------------------------------------
// Números complejos

type C = [number, number];
const cx = ([a, b]: C) => {
  if (b === 0) return sg(a);
  const im = `${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
  if (a === 0) return `${b < 0 ? "−" : ""}${im}`;
  return `${sg(a)} ${b < 0 ? "−" : "+"} ${im}`;
};
const cadd = (p: C, q: C): C => [p[0] + q[0], p[1] + q[1]];
const csub = (p: C, q: C): C => [p[0] - q[0], p[1] - q[1]];
const cmul = (p: C, q: C): C => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
const rc = (r: Rng): C => [r.int(-8, 8), nz(r, 8)];
function complexQ(r: Rng, prompt: string, ans: C, why: string, visual?: string, tag?: string): Question {
  const good = cx(ans);
  const wrong = [cx([ans[0], -ans[1]]), cx([-ans[0], ans[1]]), cx([ans[1], ans[0]]), cx([ans[0] + 1, ans[1]]), cx([ans[0], ans[1] - 2])];
  return choiceQ(r, prompt, good, [...new Set(wrong)].filter((w) => w !== good), why, visual, tag);
}

// Introducción a los números complejos.
export function complexIntro(r: Rng): Question {
  const z = rc(r);
  const form = r.int(0, 2);
  if (form === 0) {
    if (r.chance(0.5)) return intQ(r, `¿Cuál es la parte real de ${cx(z)}?`, z[0], `En a + bi, la parte real es a = ${sg(z[0])}.`, undefined, "real", [z[1]]);
    return intQ(r, `¿Cuál es la parte imaginaria de ${cx(z)}?`, z[1], `En a + bi, la parte imaginaria es b = ${sg(z[1])}.`, undefined, "imaginaria", [z[0]]);
  }
  if (form === 1) {
    const n = r.pick([4, 9, 16, 25, 36, 49, 64]);
    return choiceQ(r, `¿Cuánto es √(−${n})?`, `${Math.sqrt(n)}i`, [`−${Math.sqrt(n)}`, `${Math.sqrt(n)}`, `−${Math.sqrt(n)}i`], `√(−${n}) = √${n} · √(−1) = ${Math.sqrt(n)}i.`, undefined, "raiz-negativa");
  }
  return fixedQ("¿Cuánto vale i²?", ["−1", "1", "i", "−i"], "−1", "Por definición, i = √(−1), así que i² = −1.", undefined, "i2");
}

// Operaciones con números complejos.
export function complexOp(r: Rng, ops: ("+" | "−" | "×" | "÷")[]): Question {
  const op = r.pick(ops);
  const p = rc(r), q = rc(r);
  if (op === "+") return complexQ(r, "Calcula.", cadd(p, q), "Se suman las partes reales y las imaginarias por separado.", `(${cx(p)}) + (${cx(q)})`, "suma");
  if (op === "−") return complexQ(r, "Calcula.", csub(p, q), "Se restan las partes reales y las imaginarias por separado.", `(${cx(p)}) − (${cx(q)})`, "resta");
  if (op === "×") return complexQ(r, "Calcula.", cmul(p, q), "Se multiplica término a término y se reemplaza i² por −1.", `(${cx(p)})(${cx(q)})`, "producto");
  // División exacta: (ans · q) ÷ q.
  const ans: C = [r.int(-5, 5), nz(r, 5)], d: C = [nz(r, 4), nz(r, 4)];
  const n = cmul(ans, d);
  return complexQ(r, "Calcula. Escribe el resultado en la forma a + bi.", ans, `Se multiplican numerador y denominador por el conjugado ${cx([d[0], -d[1]])}: el denominador queda ${d[0] ** 2 + d[1] ** 2}.`, `(${cx(n)}) ÷ (${cx(d)})`, "cociente");
}

// Conjugados.
export function complexConjugate(r: Rng): Question {
  const z = rc(r);
  if (r.chance(0.5)) return complexQ(r, `¿Cuál es el conjugado de ${cx(z)}?`, [z[0], -z[1]], "El conjugado de a + bi es a − bi.", undefined, "conjugado");
  return numQ(z[0] ** 2 + z[1] ** 2, `¿Cuánto es (${cx(z)})(${cx([z[0], -z[1]])})?`, undefined, `(a + bi)(a − bi) = a² + b² = ${z[0] ** 2} + ${z[1] ** 2} = ${z[0] ** 2 + z[1] ** 2}.`, "producto-conjugado");
}

// Valor absoluto (módulo) de un número complejo.
export function complexAbs(r: Rng): Question {
  const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [0, 7, 7]]);
  const z: C = [a * r.pick([1, -1]), b * r.pick([1, -1])];
  return numQ(c, `¿Cuál es el valor absoluto de ${cx(z)}?`, undefined, `|a + bi| = √(a² + b²) = √(${a * a} + ${b * b}) = ${c}.`, "modulo");
}

// Potencias de i.
export function powersOfI(r: Rng): Question {
  const n = r.int(5, 99);
  const vals = ["1", "i", "−1", "−i"];
  return fixedQ(`¿Cuánto vale i^${n}?`, vals, vals[n % 4], `Las potencias de i se repiten cada 4: ${n} ÷ 4 deja resto ${n % 4}, así que i^${n} = i^${n % 4} = ${vals[n % 4]}.`, undefined, `resto-${n % 4}`);
}

// ---------------------------------------------------------------------------
// División sintética y teorema del binomio

const evalP = (p: number[], x: number) => p.reduce((s, c) => s * x + c, 0);

// División sintética (cociente o valor del polinomio por el teorema del resto).
export function synthetic(r: Rng, evaluate: boolean): Question {
  const a = nz(r, 4);
  const q = [r.int(1, 3), r.int(-5, 5), r.int(-5, 5)];
  const rem = r.int(-6, 6);
  const p = polyMul([1, -a], q).map((c, i, all) => (i === all.length - 1 ? c + rem : c));
  if (evaluate) return intQ(r, `Usa la división sintética (teorema del resto) para hallar P(${sg(a)}) si P(x) = ${poly(p)}.`, evalP(p, a), `Al dividir entre x ${a < 0 ? "+" : "−"} ${Math.abs(a)}, el residuo es P(${sg(a)}) = ${sg(evalP(p, a))}.`, undefined, "resto", [evalP(p, -a), rem + 1]);
  const good = rem ? `${poly(q)}, residuo ${sg(rem)}` : poly(q);
  return choiceQ(r, `Divide con división sintética: (${poly(p)}) ÷ (${xMinus(a)}).`, good, [rem ? `${poly(q)}, residuo ${sg(-rem)}` : `${poly(q)}, residuo ${sg(a)}`, `${poly([q[0], q[1] + 1, q[2]])}${rem ? `, residuo ${sg(rem)}` : ""}`, `${poly([q[0], -q[1], q[2]])}${rem ? `, residuo ${sg(rem)}` : ""}`].filter((w) => w !== good), `En la división sintética se usa ${sg(a)}: se baja el primer coeficiente, se multiplica por ${sg(a)} y se suma, columna por columna.`, undefined, rem ? "con-residuo" : "exacta");
}

const pascalRow = (n: number) => Array.from({ length: n + 1 }, (_, k) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
});
// Triángulo de Pascal y teorema del binomio.
export function binomialTheorem(r: Rng, mode: "pascal" | "pascalBinomial" | "coef" | "term"): Question {
  const n = r.int(3, 7);
  const row = pascalRow(n);
  if (mode === "pascal") {
    const k = r.int(1, n - 1);
    return numQ(row[k], `En la fila ${n} del triángulo de Pascal (empezando por la fila 0: 1), ¿cuál es el número en la posición ${k} (empezando en 0)?`, undefined, `La fila ${n} es ${row.join(", ")}.`, "pascal");
  }
  if (mode === "pascalBinomial") return choiceQ(r, `¿Qué fila del triángulo de Pascal da los coeficientes de (a + b)^${n}?`, row.join(", "), [pascalRow(n - 1).join(", "), pascalRow(n + 1).join(", "), row.map((c, i) => (i === 1 ? c + 1 : c)).join(", ")], `Los coeficientes de (a + b)^${n} son la fila ${n}: ${row.join(", ")}.`, undefined, "fila");
  const a = r.pick([1, 2, 3]), b = nz(r, 3), k = r.int(1, n - 1);
  const coefK = row[k] * a ** (n - k) * b ** k;
  if (mode === "coef") return intQ(r, `¿Cuál es el coeficiente de ${n - k === 1 ? "x" : `x${"⁰¹²³⁴⁵⁶⁷⁸⁹"[n - k]}`} en el desarrollo de (${a === 1 ? "" : a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})^${n}?`, coefK, `Término: C(${n}, ${k}) × (${poly([a, 0])})^${n - k} × (${sg(b)})^${k} = ${row[k]} × ${a ** (n - k)} × ${sg(b ** k)} = ${sg(coefK)}.`, undefined, "coeficiente", [row[k], row[k] * a ** (n - k) * Math.abs(b) ** k * -Math.sign(b ** k) || 1]);
  return choiceQ(r, `¿Cuál es el término ${k + 1} del desarrollo de (${a === 1 ? "" : a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})^${n}?`, poly([coefK, ...Array(n - k).fill(0)]), [poly([row[k], ...Array(n - k).fill(0)]), poly([coefK, ...Array(n - k + 1).fill(0)]), poly([-coefK, ...Array(n - k).fill(0)])], `El término k + 1 es C(${n}, ${k}) (${poly([a, 0])})^${n - k} (${sg(b)})^${k}.`, undefined, "termino");
}

// ---------------------------------------------------------------------------
// Factorización

// Suma y diferencia de cubos.
export function cubes(r: Rng): Question {
  const a = r.pick([1, 1, 2, 3]), b = r.int(1, 5), sum = r.chance(0.5);
  const p = [a ** 3, 0, 0, (sum ? 1 : -1) * b ** 3];
  const s = sum ? 1 : -1;
  const good = `${binom(a, s * b)}(${poly([a * a, -s * a * b, b * b])})`;
  const wrong = [`${binom(a, -s * b)}(${poly([a * a, s * a * b, b * b])})`, `${binom(a, s * b)}(${poly([a * a, s * a * b, b * b])})`, `${binom(a, s * b)}³`];
  return choiceQ(r, "Factoriza.", good, wrong, sum ? "a³ + b³ = (a + b)(a² − ab + b²)." : "a³ − b³ = (a − b)(a² + ab + b²).", poly(p), sum ? "suma" : "diferencia");
}

// ---------------------------------------------------------------------------
// Funciones cuadráticas por tres puntos

// Escribir una función cuadrática a partir de tres puntos.
export function quadThreePoints(r: Rng): Question {
  const a = nz(r, 2), b = r.int(-4, 4), c = r.int(-5, 5);
  const f = (x: number) => a * x * x + b * x + c;
  const xs = [-1, 0, 1, 2].slice(r.int(0, 1)).slice(0, 3);
  const pts = xs.map((x) => `(${sg(x)}, ${sg(f(x))})`).join(", ");
  const good = `f(x) = ${poly([a, b, c])}`;
  return choiceQ(r, `¿Qué función cuadrática pasa por los puntos ${pts}?`, good, [`f(x) = ${poly([a, -b, c])}`, `f(x) = ${poly([-a, b, c])}`, `f(x) = ${poly([a, b, c + 1])}`, `f(x) = ${poly([a + 1, b - 1, c])}`].filter((w) => w !== good), `Se reemplaza cada punto en f(x) = ax² + bx + c y se resuelve el sistema: a = ${sg(a)}, b = ${sg(b)}, c = ${sg(c)}.`, undefined, "tres-puntos");
}

// ---------------------------------------------------------------------------
// Ecuaciones y funciones polinómicas

const fromRoots = (roots: number[], lead = 1) => roots.reduce((p, x) => polyMul(p, [1, -x]), [lead]);

// Teorema del factor.
export function factorTheorem(r: Rng): Question {
  const roots = [nz(r, 4), nz(r, 4), r.int(-4, 4)];
  const p = fromRoots(roots);
  const yes = r.chance(0.5);
  const a = yes ? r.pick(roots) : r.pick([5, -5, 6, -6].filter((v) => !roots.includes(v)));
  return yesNo(`¿(${xMinus(a)}) es un factor de P(x) = ${poly(p)}?`, yes, `P(${sg(a)}) = ${sg(evalP(p, a))}: ${yes ? "como es 0, sí es factor." : "como no es 0, no es factor."}`, undefined, yes ? "si" : "no");
}

// Ceros de polinomios factorizados (y multiplicidad).
export function zerosFactored(r: Rng): Question {
  const a = nz(r, 5), b = nz(r, 5), mult = r.pick([1, 2, 3]);
  if (a === b) return zerosFactored(r);
  const f = `P(x) = ${binom(1, -a)}${mult > 1 ? ["", "", "²", "³"][mult] : ""}${binom(1, -b)}`;
  if (r.chance(0.5)) return numQ(mult, `¿Cuál es la multiplicidad del cero x = ${sg(a)} en ${f}?`, undefined, `El factor (${xMinus(a)}) aparece ${mult} ${mult === 1 ? "vez" : "veces"}.`, "multiplicidad");
  const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
  return choiceQ(r, `¿Cuáles son los ceros de ${f}?`, `x = ${sg(lo)} y x = ${sg(hi)}`, [`x = ${sg(-hi)} y x = ${sg(-lo)}`, `x = ${sg(lo)} y x = ${sg(-hi)}`, `x = ${sg(mult)} y x = ${sg(hi)}`].filter((w) => w !== `x = ${sg(lo)} y x = ${sg(hi)}`), "Cada factor (x − r) se anula en x = r.", undefined, "ceros");
}

// Escribir un polinomio a partir de sus ceros.
export function polyFromZeros(r: Rng): Question {
  const roots = [nz(r, 3), nz(r, 3), r.int(-3, 3)];
  const good = `P(x) = ${poly(fromRoots(roots))}`;
  return choiceQ(r, `¿Qué polinomio de grado 3 (coeficiente principal 1) tiene ceros ${roots.map(sg).join(", ")}?`, good, [`P(x) = ${poly(fromRoots(roots.map((x) => -x)))}`, `P(x) = ${poly(fromRoots([roots[0], -roots[1], roots[2]]))}`, `P(x) = ${poly(fromRoots(roots).map((c, i) => (i === 3 ? -c : c)))}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), `P(x) = ${roots.map((x) => `(${xMinus(x)})`).join("")}; se multiplica.`, undefined, "ceros");
}

// Factorizar dado un cero y resolver ecuaciones cúbicas y cuárticas.
export function solvePolynomial(r: Rng, quartic: boolean): Question {
  if (quartic) {
    const p = r.int(1, 4), q = r.int(1, 5);
    if (p === q) return solvePolynomial(r, quartic);
    // x⁴ − (p² + q²)x² + p²q² = (x² − p²)(x² − q²)
    const P = [1, 0, -(p * p + q * q), 0, p * p * q * q];
    const good = `x = ±${p} y x = ±${q}`;
    return choiceQ(r, "Resuelve la ecuación.", good, [`x = ±${p * p} y x = ±${q * q}`, `x = ${p} y x = ${q}`, `x = ±${p} y x = ±${q}i`], `Con u = x²: (u − ${p * p})(u − ${q * q}) = 0 → x² = ${p * p} o x² = ${q * q}.`, `${poly(P)} = 0`, "cuartica");
  }
  const roots = [nz(r, 4), nz(r, 4), nz(r, 4)];
  if (new Set(roots).size < 3) return solvePolynomial(r, quartic);
  const s = [...roots].sort((a, b) => a - b);
  const good = `x = ${s.map(sg).join(", ")}`;
  return choiceQ(r, `Resuelve la ecuación. (Una solución es x = ${sg(roots[0])}.)`, good, [`x = ${s.map((x) => sg(-x)).reverse().join(", ")}`, `x = ${sg(s[0])}, ${sg(s[1])}`, `x = ${[s[0], s[1], -s[2]].map(sg).join(", ")}`], `Se divide entre (${xMinus(roots[0])}) y se factoriza el cociente cuadrático.`, `${poly(fromRoots(roots))} = 0`, "cubica");
}

// Teorema de la raíz racional.
export function rationalRoot(r: Rng): Question {
  const lead = r.pick([1, 2, 3]), c = r.pick([2, 3, 4, 6]);
  const divs = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
  const cands = new Set<string>();
  for (const p of divs(c)) for (const q of divs(lead)) {
    const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
    const k = g(p, q);
    cands.add(q / k === 1 ? `±${p / k}` : `±${p / k}/${q / k}`);
  }
  const good = [...cands].join(", ");
  const wrong = [divs(c).map((d) => `±${d}`).join(", "), divs(lead).map((d) => `±${d}`).join(", "), [...cands, `±${c * lead}`].join(", ")].filter((w) => w !== good);
  return choiceQ(r, `Según el teorema de la raíz racional, ¿cuáles son las posibles raíces racionales de P(x) = ${poly([lead, nz(r, 4), nz(r, 5), c])}?`, good, wrong, `Son ±(divisores de ${c}) ÷ (divisores de ${lead}).`, undefined, "raiz-racional");
}

// Teoremas de las raíces conjugadas (complejas e irracionales).
export function conjugateRoots(r: Rng, irrational: boolean): Question {
  const a = r.int(-5, 5), b = r.int(1, 6);
  if (irrational) {
    const m = r.pick([2, 3, 5, 7]);
    const B = `${b === 1 ? "" : b}√${m}`;
    const root = a === 0 ? B : `${sg(a)} + ${B}`;
    const conj = a === 0 ? `−${B}` : `${sg(a)} − ${B}`;
    return choiceQ(r, `Un polinomio con coeficientes racionales tiene la raíz ${root}. ¿Qué otro número también debe ser raíz?`, conj, [a === 0 ? `${B}i` : `${sg(-a)} + ${B}`, a === 0 ? `${b + 1}√${m}` : `${sg(-a)} − ${B}`, a === 0 ? `−${b === 1 ? "" : b}i` : `${sg(a)} + ${b === 1 ? "" : b}i`].filter((w) => w !== conj), "Las raíces irracionales de la forma a + b√m vienen en pares conjugados: a − b√m también es raíz.", undefined, "irracional");
  }
  const z: C = [a, b];
  return choiceQ(r, `Un polinomio con coeficientes reales tiene la raíz ${cx(z)}. ¿Qué otro número también debe ser raíz?`, cx([a, -b]), [cx([-a, b]), cx([-a, -b]), cx([b, a])].filter((w, i, all) => w !== cx([a, -b]) && all.indexOf(w) === i), "Las raíces complejas de un polinomio con coeficientes reales vienen en pares conjugados.", undefined, "compleja");
}

// Regla de los signos de Descartes.
export function descartes(r: Rng): Question {
  const p = [1, ...Array.from({ length: 4 }, () => nz(r, 6))];
  const changes = (q: number[]) => q.filter((c) => c !== 0).reduce((n, c, i, all) => (i && Math.sign(c) !== Math.sign(all[i - 1]) ? n + 1 : n), 0);
  const pos = changes(p);
  const neg = changes(p.map((c, i) => (((p.length - 1 - i) % 2) ? -c : c)));
  const ask = r.chance(0.5);
  const k = ask ? pos : neg;
  const opts = [k, k - 2, k - 4].filter((v) => v >= 0);
  const good = opts.join(" o ");
  return choiceQ(r, `Según la regla de los signos de Descartes, ¿cuántas raíces reales ${ask ? "positivas" : "negativas"} puede tener P(x) = ${poly(p)}?`, good, [`${k + 1}`, `${k}`, `${k + 2} o ${k}`, opts.length > 1 ? `${opts[1]}` : `${k + 1} o ${k - 1 < 0 ? 0 : k - 1}`].filter((w, i, all) => w !== good && all.indexOf(w) === i), ask ? `P(x) tiene ${pos} cambios de signo: ${good} raíces positivas (se resta de 2 en 2).` : `P(−x) tiene ${neg} cambios de signo: ${good} raíces negativas.`, undefined, ask ? "positivas" : "negativas");
}

// Teorema fundamental del álgebra y raíces de polinomios.
export function fundamentalTheorem(r: Rng, find: boolean): Question {
  if (!find) {
    const n = r.int(2, 8);
    return numQ(n, `Según el teorema fundamental del álgebra, ¿cuántas raíces (contando multiplicidades y raíces complejas) tiene un polinomio de grado ${n}?`, undefined, `Un polinomio de grado ${n} tiene exactamente ${n} raíces complejas, contando multiplicidades.`, "cantidad");
  }
  const a = nz(r, 4), b = r.int(1, 4);
  // (x − a)(x² + b²)
  const p = polyMul([1, -a], [1, 0, b * b]);
  const good = `x = ${sg(a)}, x = ${b === 1 ? "" : b}i y x = −${b === 1 ? "" : b}i`;
  return choiceQ(r, `¿Cuáles son las raíces de P(x) = ${poly(p)}?`, good, [`x = ${sg(a)}, x = ${b} y x = −${b}`, `x = ${sg(-a)}, x = ${b === 1 ? "" : b}i y x = −${b === 1 ? "" : b}i`, `x = ${sg(a)} solamente`], `Por agrupación: P(x) = (${xMinus(a)})(x² + ${b * b}); x² = −${b * b} da x = ±${b === 1 ? "" : b}i.`, undefined, "raices");
}

// Gráficos de polinomios (cúbicas, comportamiento en los extremos, ceros, dominio y rango).
export function polyGraph(r: Rng, mode: "cubic" | "end" | "zeros" | "match" | "domain"): Question {
  const lead = r.pick([1, -1]) * r.pick([0.5, 0.25]);
  const roots = r.shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3).sort((a, b) => a - b);
  const f = (x: number) => roots.reduce((p, z) => p * (x - z), lead);
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: roots.map((x) => ({ x, y: 0, emoji: "•" })), curves: [{ points: curve(f, -6, 6, 0.05) }] };
  const fText = (l: number, rs: number[]) => `f(x) = ${l < 0 ? "−" : ""}${Math.abs(l) === 0.5 ? "(1/2)" : "(1/4)"}${rs.map((z) => (z === 0 ? "x" : `(${xMinus(z)})`)).join("")}`;
  if (mode === "domain") {
    const even = r.chance(0.5);
    return fixedQ(even ? "¿Cuál es el rango de una función polinómica de grado par con coeficiente principal positivo y valor mínimo −3?" : "¿Cuál es el rango de una función polinómica de grado impar?", ["Todos los números reales", "y ≥ −3", "y ≤ −3", "y > 0"], even ? "y ≥ −3" : "Todos los números reales", even ? "Abre hacia arriba en los dos extremos: solo alcanza valores desde su mínimo." : "Un extremo va a −∞ y el otro a +∞: toma todos los valores.", undefined, even ? "par" : "impar");
  }
  if (mode === "end") {
    const deg = r.int(2, 5), pos = r.chance(0.5);
    const O = ["Sube por la izquierda y por la derecha", "Baja por la izquierda y por la derecha", "Baja por la izquierda y sube por la derecha", "Sube por la izquierda y baja por la derecha"];
    const k = deg % 2 === 0 ? (pos ? 0 : 1) : pos ? 2 : 3;
    return fixedQ(`¿Cómo se comporta en los extremos el gráfico de f(x) = ${pos ? "" : "−"}${deg === 2 ? "" : "2"}x${"²³⁴⁵"[deg - 2]} + 3x − 1?`, O, O[k], `Grado ${deg} (${deg % 2 ? "impar" : "par"}) y coeficiente principal ${pos ? "positivo" : "negativo"}.`, undefined, deg % 2 ? "impar" : "par");
  }
  if (mode === "cubic") {
    const yes = r.chance(0.5);
    const shown = yes ? roots : roots.map((z) => -z).reverse();
    const g = (x: number) => shown.reduce((p, z) => p * (x - z), lead);
    if (yes) return yesNo(`¿El gráfico muestra ${fText(lead, roots)}?`, true, `Corta el eje x en ${roots.map(sg).join(", ")}.`, visual, "cubica");
    if (shown.join() === roots.join()) return polyGraph(r, mode);
    return yesNo(`¿El gráfico muestra ${fText(lead, roots)}?`, yes, `Debe cortar el eje x en ${roots.map(sg).join(", ")}.`, { ...visual, points: shown.map((x) => ({ x, y: 0, emoji: "•" })), curves: [{ points: curve(g, -6, 6, 0.05) }] }, "cubica");
  }
  const good = fText(lead, roots);
  const wrong = [fText(-lead, roots), fText(lead, roots.map((z) => -z).sort((a, b) => a - b)), fText(lead, [roots[0], roots[1], roots[2] + 1])].filter((w) => w !== good);
  return choiceQ(r, "¿Qué función corresponde al gráfico?", good, [...new Set(wrong)], `Los ceros son ${roots.map(sg).join(", ")} y por la derecha ${lead > 0 ? "sube" : "baja"} (coeficiente principal ${lead > 0 ? "positivo" : "negativo"}).`, visual, mode);
}

// Funciones pares e impares.
export function evenOdd(r: Rng): Question {
  const cases: [string, number][] = [["f(x) = x⁴ − 3x²", 0], ["f(x) = x³ + 2x", 1], ["f(x) = x² + x", 2], ["f(x) = |x|", 0], ["f(x) = 5x", 1], ["f(x) = x³ + 1", 2], ["f(x) = 2x⁶ + 7", 0], ["f(x) = x⁵ − x³", 1]];
  const [f, k] = r.pick(cases);
  const O = ["Par", "Impar", "Ni par ni impar"];
  return fixedQ(`¿La función ${f} es par, impar o ninguna de las dos?`, O, O[k], ["f(−x) = f(x): es simétrica respecto del eje y.", "f(−x) = −f(x): es simétrica respecto del origen.", "f(−x) no es igual a f(x) ni a −f(x)."][k], undefined, O[k]);
}

