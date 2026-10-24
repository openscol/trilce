import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, intQ, sg, table, yesNo } from "../kit";
import { lin, nz } from "../sec1/util";
import { pt } from "../sec2/util";
import { binom, curve, poly, polyAdd, polyMul, xMinus } from "./util";

// Álgebra 1: funciones valor absoluto, operaciones y transformaciones de
// funciones, radicales, funciones raíz y expresiones racionales.

// ---------------------------------------------------------------------------
// Funciones valor absoluto

type Abs = { a: number; h: number; k: number };
const absF = (q: Abs) => (x: number) => q.a * Math.abs(x - q.h) + q.k;
const absText = (q: Abs) => `f(x) = ${q.a === 1 ? "" : q.a === -1 ? "−" : q.a === 0.5 ? "(1/2)" : sg(q.a)}|x${q.h ? ` ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)}` : ""}|${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""}`;
const randomAbs = (r: Rng, dil = true): Abs => ({ a: r.pick(dil ? [1, -1, 2, -2, 0.5] : [1, -1]), h: r.int(-3, 3), k: r.int(-3, 3) });
const absPlane = (qs: Abs[], points: { x: number; y: number }[] = []): Visual => ({ kind: "coordPlane", min: -6, max: 6, points: points.map((p) => ({ ...p, emoji: "•" })), curves: qs.map((q, i) => ({ points: curve(absF(q), -6, 6, 0.05), dashed: i > 0 })) });

// BB.1: completar la tabla de una función valor absoluto.
export function absTable(r: Rng): Question {
  const q = randomAbs(r, false);
  const xs = [q.h - 2, q.h - 1, q.h, q.h + 1, q.h + 2];
  const i = r.int(0, 4);
  return intQ(r, `Completa la tabla de ${absText(q)}. ¿Qué número va en lugar de «?»?`, absF(q)(xs[i]), `f(${sg(xs[i])}) = ${sg(absF(q)(xs[i]))}.`, table(["x", "f(x)"], xs.map((x, j) => [sg(x), j === i ? "?" : sg(absF(q)(x))])), "tabla", [-absF(q)(xs[i]), absF(q)(xs[i]) + 1]);
}

// BB.2: graficar una función valor absoluto.
export function absGraph(r: Rng): Question {
  const q = randomAbs(r);
  const yes = r.chance(0.5);
  const shown = yes ? q : r.pick([{ ...q, h: -q.h || 2 }, { ...q, a: -q.a }, { ...q, k: q.k + r.pick([-2, 2]) }]);
  return yesNo(`¿El gráfico muestra ${absText(q)}?`, yes, `Vértice en ${pt({ x: q.h, y: q.k })}, abre hacia ${q.a > 0 ? "arriba" : "abajo"} y la pendiente de cada lado es ±${Math.abs(q.a) === 0.5 ? "1/2" : Math.abs(q.a)}.`, absPlane([shown], [{ x: shown.h, y: shown.k }]), "graficar");
}

// BB.3 / BB.4: dominio y rango de funciones valor absoluto.
export function absDomainRange(r: Rng, graph: boolean): Question {
  const q = randomAbs(r);
  const domain = r.chance(0.3);
  const range = q.a > 0 ? `y ≥ ${sg(q.k)}` : `y ≤ ${sg(q.k)}`;
  const good = domain ? "Todos los números reales" : range;
  const wrong = domain ? [`x ≥ ${sg(q.h)}`, "Todos los números positivos", `x ≥ ${sg(q.k)}`] : [q.a > 0 ? `y ≤ ${sg(q.k)}` : `y ≥ ${sg(q.k)}`, "Todos los números reales", `y ≥ ${sg(q.h)}`, q.a > 0 ? `y > ${sg(q.k)}` : `y < ${sg(q.k)}`];
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de ${graph ? "la función del gráfico" : absText(q)}?`, good, wrong.filter((w) => w !== good), domain ? "Se puede calcular el valor absoluto de cualquier número." : `El vértice ${pt({ x: q.h, y: q.k })} es el punto más ${q.a > 0 ? "bajo" : "alto"}: ${range}.`, graph ? absPlane([q], [{ x: q.h, y: q.k }]) : undefined, domain ? "dominio" : "rango");
}

// BB.5 / BB.6: transformaciones de funciones valor absoluto.
export function absTransform(r: Rng, dilations: boolean): Question {
  const q = randomAbs(r, dilations);
  if (q.h === 0 && q.k === 0 && Math.abs(q.a) === 1) return absTransform(r, dilations);
  const good = absText(q).replace("f(x)", "g(x)");
  const wrong = [{ ...q, h: -q.h }, { ...q, k: -q.k }, { ...q, a: -q.a }, dilations ? { ...q, a: q.a === 2 ? 0.5 : 2 } : { ...q, h: q.k, k: q.h }].map((w) => absText(w).replace("f(x)", "g(x)"));
  return choiceQ(r, "El gráfico punteado g es una transformación de f(x) = |x| (en verde). ¿Cuál es la ecuación de g?", good, [...new Set(wrong)].filter((w) => w !== good), `El vértice pasó de (0, 0) a ${pt({ x: q.h, y: q.k })}${q.a < 0 ? ", se reflejó (abre hacia abajo)" : ""}${Math.abs(q.a) !== 1 ? ` y la pendiente de los lados es ±${Math.abs(q.a) === 0.5 ? "1/2" : Math.abs(q.a)}` : ""}.`, absPlane([{ a: 1, h: 0, k: 0 }, q], [{ x: q.h, y: q.k }]), dilations ? "dilatacion" : "traslacion");
}

// ---------------------------------------------------------------------------
// Operaciones con funciones

// CC.1 / CC.2: sumar, restar y multiplicar funciones.
export function functionOps(r: Rng, multiply: boolean): Question {
  const f = [nz(r, 5), r.int(-6, 6)], g = multiply ? [1, nz(r, 6)] : [r.int(-3, 3) || 1, nz(r, 5), r.int(-6, 6)];
  const minus = !multiply && r.chance(0.5);
  const res = multiply ? polyMul(f, g) : polyAdd(f, minus ? g.map((c) => -c) : g);
  const good = poly(res);
  const alt = multiply ? [poly(polyAdd(f, g)), poly([f[0] * g[0], 0, f[1] * g[1]]), poly(polyMul(f, [g[0], -g[1]]))] : [poly(polyAdd(f, minus ? g : g.map((c) => -c))), poly(polyAdd(f, minus ? [-g[0], -g[1], g[2]] : [g[0], g[1], -g[2]])), poly(polyAdd(f, minus ? [-g[0], g[1], -g[2]] : [-g[0], g[1], g[2]]))];
  const op = multiply ? "·" : minus ? "−" : "+";
  return choiceQ(r, `Si f(x) = ${poly(f)} y g(x) = ${poly(g)}, ¿cuánto es (f ${op} g)(x)?`, good, [...new Set(alt)].filter((w) => w !== good), multiply ? "Se multiplica cada término de f por cada término de g." : minus ? "Se resta g término a término (se cambia el signo de cada término de g)." : "Se suman los términos semejantes.", undefined, multiply ? "multiplicar" : minus ? "restar" : "sumar");
}

// CC.3: inversa de una función lineal.
export function inverseLinear(r: Rng): Question {
  const a = r.pick([2, 3, 4, 5, -2, -3]), b = nz(r, 9);
  const good = `f⁻¹(x) = (x ${b < 0 ? "+" : "−"} ${Math.abs(b)}) / ${a < 0 ? `(${sg(a)})` : a}`;
  const wrong = [`f⁻¹(x) = (x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) / ${a < 0 ? `(${sg(a)})` : a}`, `f⁻¹(x) = ${a < 0 ? `(${sg(a)})` : a}x ${b < 0 ? "+" : "−"} ${Math.abs(b)}`, `f⁻¹(x) = x/${a < 0 ? `(${sg(a)})` : a} ${b < 0 ? "+" : "−"} ${Math.abs(b)}`, `f⁻¹(x) = 1/(${lin(a, b)})`];
  return choiceQ(r, `¿Cuál es la inversa de f(x) = ${lin(a, b)}?`, good, wrong, `Se escribe x = ${lin(a, b).replace("x", "y")} y se despeja y: y = (x ${b < 0 ? "+" : "−"} ${Math.abs(b)}) ÷ ${sg(a)}.`, undefined, "inversa");
}

// ---------------------------------------------------------------------------
// Transformaciones de funciones

type T = { h: number; k: number; a: number; reflectY: boolean };
const BASE: { x: number; y: number }[] = [{ x: -3, y: 1 }, { x: -1, y: 3 }, { x: 0, y: 0 }, { x: 2, y: 2 }];
const tText = (t: T) => {
  const inner = `${t.reflectY ? "−x" : "x"}${t.h ? ` ${t.h > 0 ? "−" : "+"} ${Math.abs(t.h)}` : ""}`;
  const head = t.a === 1 ? "" : t.a === -1 ? "−" : t.a === 0.5 ? "(1/2)" : sg(t.a);
  return `g(x) = ${head}f(${inner})${t.k ? ` ${t.k < 0 ? "−" : "+"} ${Math.abs(t.k)}` : ""}`;
};
const applyT = (t: T, p: { x: number; y: number }) => ({ x: (t.reflectY ? -p.x : p.x) + t.h, y: t.a * p.y + t.k });

// DD.1: reglas de las transformaciones.
const RULES: [string, string, string[]][] = [
  ["f(x) + k (con k > 0)", "Se traslada k unidades hacia arriba", ["Se traslada k unidades hacia abajo", "Se traslada k unidades a la derecha", "Se traslada k unidades a la izquierda"]],
  ["f(x − h) (con h > 0)", "Se traslada h unidades a la derecha", ["Se traslada h unidades a la izquierda", "Se traslada h unidades hacia abajo", "Se traslada h unidades hacia arriba"]],
  ["f(x + h) (con h > 0)", "Se traslada h unidades a la izquierda", ["Se traslada h unidades a la derecha", "Se traslada h unidades hacia arriba", "Se traslada h unidades hacia abajo"]],
  ["−f(x)", "Se refleja respecto del eje x", ["Se refleja respecto del eje y", "Se traslada 1 unidad hacia abajo", "Se estira verticalmente"]],
  ["f(−x)", "Se refleja respecto del eje y", ["Se refleja respecto del eje x", "Se traslada 1 unidad a la izquierda", "Se encoge horizontalmente"]],
  ["a·f(x) (con a > 1)", "Se estira verticalmente", ["Se comprime verticalmente", "Se traslada a unidades hacia arriba", "Se refleja respecto del eje x"]],
];
export function transformRules(r: Rng): Question {
  const [g, good, wrong] = r.pick(RULES);
  return choiceQ(r, `¿Qué le pasa al gráfico de f cuando se cambia por ${g}?`, good, wrong, `${g}: ${good.toLowerCase()}.`, undefined, "regla");
}

// DD.2-DD.6: traslaciones, reflexiones, dilataciones y combinaciones (con el gráfico de f).
export function transformFunction(r: Rng, kind: "translate" | "reflect" | "dilate" | "mixed" | "describe"): Question {
  const t: T = { h: 0, k: 0, a: 1, reflectY: false };
  if (kind === "translate" || kind === "mixed" || kind === "describe") {
    t.h = r.int(-3, 3);
    t.k = r.int(-3, 3);
    if (!t.h && !t.k) t.k = 2;
  }
  if (kind === "reflect" || (kind === "mixed" && r.chance(0.5))) {
    if (r.chance(0.5)) t.a = -1;
    else t.reflectY = true;
  }
  if (kind === "dilate") t.a = r.pick([2, 0.5, -2]);
  const img = BASE.map((p) => applyT(t, p));
  if (img.some((p) => Math.abs(p.x) > 6 || Math.abs(p.y) > 6)) return transformFunction(r, kind);
  const visual: Visual = { kind: "coordPlane", min: -6, max: 6, points: [], curves: [{ points: BASE, label: "f" }, { points: [...img].sort((p, q) => p.x - q.x), dashed: true, label: "g" }] };
  if (kind === "describe") {
    const parts = [t.h ? `${Math.abs(t.h)} a la ${t.h > 0 ? "derecha" : "izquierda"}` : "", t.k ? `${Math.abs(t.k)} hacia ${t.k > 0 ? "arriba" : "abajo"}` : ""].filter(Boolean);
    const good = `Se traslada ${parts.join(" y ")}`;
    const flips = [{ ...t, h: -t.h }, { ...t, k: -t.k }, { ...t, h: t.k, k: t.h }].map((u) => `Se traslada ${[u.h ? `${Math.abs(u.h)} a la ${u.h > 0 ? "derecha" : "izquierda"}` : "", u.k ? `${Math.abs(u.k)} hacia ${u.k > 0 ? "arriba" : "abajo"}` : ""].filter(Boolean).join(" y ")}`);
    return choiceQ(r, `¿Cómo se transforma el gráfico de f para obtener ${tText(t)}?`, good, [...new Set(flips)].filter((w) => w !== good && w !== "Se traslada "), `En f(x − h) + k, h mueve en horizontal y k en vertical.`, undefined, "describir");
  }
  const good = tText(t);
  const wrong = [{ ...t, h: -t.h }, { ...t, k: -t.k }, { ...t, a: -t.a }, { ...t, reflectY: !t.reflectY }, { ...t, a: t.a === 2 ? 0.5 : t.a === 0.5 ? 2 : t.a }].map(tText);
  return choiceQ(r, "El gráfico punteado g es una transformación de f. ¿Cuál es la ecuación de g?", good, [...new Set(wrong)].filter((w) => w !== good), `Compara puntos: ${pt(BASE[2])} de f pasa a ${pt(img[2])} en g.`, visual, kind);
}

// ---------------------------------------------------------------------------
// Radicales

// Raíz simplificada: √n = k√m.
const simpRoot = (n: number): [number, number] => {
  let k = 1;
  for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; }
  return [k, n];
};
const rad = (k: number, m: number) => (m === 1 ? sg(k) : `${k === 1 ? "" : k === -1 ? "−" : sg(k)}√${m}`);
const FREE = [2, 3, 5, 6, 7, 10];

// EE.1: simplificar raíces cuadradas.
export function simplifyRoot(r: Rng): Question {
  const k = r.int(2, 7), m = r.pick(FREE);
  const n = k * k * m;
  const good = rad(k, m);
  return choiceQ(r, `Simplifica √${n}.`, good, [rad(m, k * k), rad(k * k, m), rad(k, m * 2), rad(Math.floor(Math.sqrt(n)), n - Math.floor(Math.sqrt(n)) ** 2)].filter((w, i, a) => w !== good && a.indexOf(w) === i && !w.endsWith("√1")), `${n} = ${k * k} × ${m} y √${k * k} = ${k}: √${n} = ${good}.`, undefined, "simplificar");
}

// EE.2: simplificar raíces con variables (x ≥ 0).
export function simplifyRootVar(r: Rng): Question {
  const k = r.int(2, 5), m = r.pick([2, 3, 5, 1]), e = r.int(2, 7);
  const out = Math.floor(e / 2), rest = e % 2;
  const inside = `${m === 1 ? "" : m}${rest ? "x" : ""}`;
  const good = `${k}${out ? `x${out > 1 ? "^" + out : ""}` : ""}${inside ? `√${inside}` : ""}`.replace(/\^(\d)/, (_, d) => "²³⁴⁵⁶⁷"[Number(d) - 2]);
  const sup = (n: number) => (n > 1 ? "⁰¹²³⁴⁵⁶⁷⁸⁹"[n] : "");
  const shown = `√(${k * k * m}x${sup(e)})`;
  const wrong = [`${k}x${sup(e)}${m === 1 ? "" : `√${m}`}`, `${k * k}x${sup(out)}√${m === 1 ? "x" : `${m}x`}`, `${k}x${sup(out + rest)}${m === 1 ? "" : `√${m}`}`, `${m === 1 ? k * 2 : m}x${sup(out)}√${k}`].filter((w) => w !== good);
  return choiceQ(r, `Simplifica ${shown}. (Supón x ≥ 0.)`, good, [...new Set(wrong)], `√${k * k} = ${k} y √(x${sup(e)}) = x${sup(out)}${rest ? "√x" : ""}.`, undefined, "variables");
}

// EE.3: sumar y restar radicales.
export function addRadicals(r: Rng): Question {
  const m = r.pick([2, 3, 5]), a = r.int(1, 6), k = r.int(2, 3), b = nz(r, 5);
  const total = a + b * k;
  const good = rad(total, m);
  return choiceQ(r, "Simplifica.", good, [rad(a + b, m), rad(a + b, m * k * k + m), rad(total, m * k * k), rad(a + b * k * k, m)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `√${m * k * k} = ${k}√${m}, así que ${a}√${m} ${b < 0 ? "−" : "+"} ${Math.abs(b)}(${k}√${m}) = ${good}.`, `${a === 1 ? "" : a}√${m} ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}√${m * k * k}`, "sumar");
}

// EE.4: multiplicar radicales.
export function multiplyRadicals(r: Rng): Question {
  const [p, q] = r.pick([[6, 15], [2, 8], [3, 12], [10, 15], [6, 10], [5, 20], [2, 18], [3, 6]]);
  const a = r.int(1, 4), b = r.int(1, 4);
  const [k, m] = simpRoot(p * q);
  const good = rad(a * b * k, m);
  return choiceQ(r, "Multiplica y simplifica.", good, [rad(a * b, p * q), rad(a + b, p * q), rad(a * b * k * 2, m), rad(a * b, m)].filter((w, i, all) => w !== good && all.indexOf(w) === i), `${a * b} × √${p * q} = ${a * b} × ${k}${m === 1 ? "" : `√${m}`} = ${good}.`, `${a === 1 ? "" : a}√${p} · ${b === 1 ? "" : b}√${q}`, "multiplicar");
}

// EE.5: radicales con fracciones (racionalizar).
export function radicalFractions(r: Rng): Question {
  if (r.chance(0.5)) {
    const m = r.pick([2, 3, 5, 6, 7]), k = r.int(1, 5);
    const n = m * k;
    const good = `${k}√${m}`.replace(/^1√/, "√");
    return choiceQ(r, `Racionaliza ${n}/√${m}.`, good, [`${n}√${m}`, `√${m}/${k}`, `${k * m}√${m}`, `${n}/${m}`].filter((w) => w !== good), `Se multiplica arriba y abajo por √${m}: ${n}√${m}/${m} = ${good}.`, undefined, "racionalizar");
  }
  const a = r.pick([2, 3, 5, 7]), b = r.pick([4, 9, 16, 25, 36]);
  const good = `√${a}/${Math.sqrt(b)}`;
  return choiceQ(r, `Simplifica √(${a}/${b}).`, good, [`${a}/${Math.sqrt(b)}`, `√${a}/${b}`, `${Math.sqrt(b)}/√${a}`], `√(${a}/${b}) = √${a}/√${b} = ${good}.`, undefined, "fraccion");
}

// EE.6: propiedad distributiva con radicales.
export function distributeRadical(r: Rng): Question {
  const a = r.pick([2, 3, 5]), b = r.pick([6, 10, 15, 3, 2].filter((x) => x !== a)), c = r.int(1, 6);
  const [k, m] = simpRoot(a * b);
  const t1 = rad(k, m), t2 = `${c}√${a}`;
  const good = `${t1} + ${t2}`;
  return choiceQ(r, "Multiplica y simplifica.", good, [`√${a * b} + ${c}`, `${t1} + ${c}`, `${rad(k, m)} + √${c * a}`, `√${a + b} + ${t2}`].filter((w) => w !== good), `√${a} · √${b} = √${a * b} = ${t1} y √${a} · ${c} = ${t2}.`, `√${a}(√${b} + ${c})`, "distributiva");
}

// EE.7: racionalizar con el conjugado.
export function conjugate(r: Rng): Question {
  const m = r.pick([2, 3, 5, 6, 7]), a = r.int(m === 2 ? 2 : 3, 5);
  const den = a * a - m;
  const k = r.int(1, 3) * den;
  const c = k / den;
  const good = `${c === 1 ? "" : c}(${a} + √${m})`.replace(/^\((\d+) \+ √(\d+)\)$/, "$1 + √$2");
  return choiceQ(r, `Racionaliza ${k}/(${a} − √${m}).`, good, [`${c === 1 ? "" : c}(${a} − √${m})`.replace(/^\((\d+) − √(\d+)\)$/, "$1 − √$2"), `${k}(${a} + √${m})`, `${k}/(${a} + √${m})`, `${c === 1 ? "" : c}√${m}`].filter((w) => w !== good), `Se multiplica por el conjugado ${a} + √${m}: el denominador queda ${a}² − ${m} = ${den}, y ${k} ÷ ${den} = ${c}.`, undefined, "conjugado");
}

// EE.8: repaso mixto de radicales.
export function radicalMixed(r: Rng): Question {
  return r.pick([simplifyRoot, addRadicals, multiplyRadicals, radicalFractions, distributeRadical])(r);
}

// EE.9: convertir entre exponentes racionales y radicales.
export function exponentToRadical(r: Rng): Question {
  const v = r.pick(["x", "m", "n"]), n = r.pick([2, 3, 4]), m = r.pick([1, 2, 3].filter((k) => k !== n));
  const SUP = ["", "", "²", "³", "⁴"];
  const root = (index: number, power: number) => `${index === 2 ? "√" : index === 3 ? "∛" : "∜"}${power === 1 ? v : `(${v}${SUP[power]})`}`;
  const radical = root(n, m);
  const expo = `${v}^(${m}/${n})`;
  if (r.chance(0.5)) {
    const wrong = [m <= 4 && n <= 4 && m >= 2 ? root(m, n) : `${v}${SUP[m] || ""}/${n}`, root(n, n === 4 ? 3 : n + 1 > 4 ? 2 : n + 1), `${v}${SUP[m] || ""}/${n}`, root(n === 2 ? 3 : 2, m)];
    return choiceQ(r, `¿Cómo se escribe ${expo} como radical?`, radical, [...new Set(wrong)].filter((w) => w !== radical), `El denominador ${n} es el índice de la raíz y el numerador ${m}, el exponente de dentro: ${radical}.`, undefined, "a-radical");
  }
  return choiceQ(r, `¿Cómo se escribe ${radical} con un exponente racional?`, expo, [`${v}^(${n}/${m})`, `${v}^(${m * n})`, `${v}^(1/${n + m})`].filter((w) => w !== expo), `La raíz de índice ${n} es el exponente 1/${n}; con la potencia ${m} queda ${expo}.`, undefined, "a-exponente");
}

// ---------------------------------------------------------------------------
// Funciones raíz

type Root = { a: number; h: number; k: number };
const rootText = (q: Root, cube = false) => `f(x) = ${q.a === 1 ? "" : q.a === -1 ? "−" : sg(q.a)}${cube ? "∛" : "√"}(x${q.h ? ` ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)}` : ""})${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""}`.replace("√(x)", "√x").replace("∛(x)", "∛x");
const rootF = (q: Root, cube = false) => (x: number) => (cube ? q.a * Math.cbrt(x - q.h) + q.k : x < q.h ? NaN : q.a * Math.sqrt(x - q.h) + q.k);
const randomRoot = (r: Rng): Root => ({ a: r.pick([1, 1, -1, 2]), h: r.int(-4, 2), k: r.int(-3, 3) });

// FF.1: evaluar funciones raíz cuadrada.
export function evaluateRoot(r: Rng): Question {
  const q = randomRoot(r), s = r.int(0, 4);
  const x = q.h + s * s;
  return intQ(r, `Si ${rootText(q)}, ¿cuánto vale f(${sg(x)})?`, q.a * s + q.k, `${xMinus(q.h)} = ${s * s} y √${s * s} = ${s}: ${q.a === 1 ? "" : `${sg(q.a)} × `}${s}${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""} = ${sg(q.a * s + q.k)}.`, undefined, "evaluar", [s * s + q.k, -(q.a * s + q.k), s]);
}

// FF.2 / FF.3: dominio y rango de funciones raíz cuadrada.
export function rootDomainRange(r: Rng, graph: boolean): Question {
  const q = randomRoot(r);
  const domain = r.chance(0.5);
  const good = domain ? `x ≥ ${sg(q.h)}` : q.a > 0 ? `y ≥ ${sg(q.k)}` : `y ≤ ${sg(q.k)}`;
  const wrong = domain ? [`x ≥ ${sg(-q.h || 3)}`, `x ≥ ${sg(q.k)}`, "Todos los números reales", `x > ${sg(q.h)}`] : [q.a > 0 ? `y ≤ ${sg(q.k)}` : `y ≥ ${sg(q.k)}`, `y ≥ ${sg(q.h)}`, "Todos los números reales"];
  const visual: Visual | undefined = graph ? { kind: "coordPlane", min: -6, max: 6, points: [{ x: q.h, y: q.k, emoji: "•" }], curves: [{ points: curve(rootF(q), q.h, 6, 0.02) }] } : undefined;
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de ${graph ? "la función del gráfico" : rootText(q)}?`, good, [...new Set(wrong)].filter((w) => w !== good), domain ? `Lo de dentro de la raíz no puede ser negativo: ${xMinus(q.h)} ≥ 0.` : `Empieza en ${pt({ x: q.h, y: q.k })} y va hacia ${q.a > 0 ? "arriba" : "abajo"}.`, visual, domain ? "dominio" : "rango");
}

// FF.4 / FF.5: graficar funciones raíz cuadrada y raíz cúbica.
export function rootGraph(r: Rng, cube: boolean): Question {
  const q = randomRoot(r);
  const yes = r.chance(0.5);
  const shown = yes ? q : r.pick([{ ...q, h: -q.h || 2 }, { ...q, a: -q.a }, { ...q, k: q.k + r.pick([-2, 2]) }]);
  const pts = curve(rootF(shown, cube), cube ? -6 : shown.h, 6, 0.02);
  return yesNo(`¿El gráfico muestra ${rootText(q, cube)}?`, yes, `${cube ? "El punto central" : "El punto inicial"} es ${pt({ x: q.h, y: q.k })} y la curva va hacia ${q.a > 0 ? "arriba" : "abajo"} a la derecha.`, { kind: "coordPlane", min: -6, max: 6, points: [{ x: shown.h, y: shown.k, emoji: "•" }], curves: [{ points: pts }] }, cube ? "cubica" : "cuadrada");
}

// FF.6 / FF.7: ecuaciones con radicales (con soluciones extrañas).
export function radicalEquation(r: Rng, level: 1 | 2): Question {
  if (level === 1) {
    const b = r.int(1, 9), a = r.int(-9, 9) || 4, k = r.pick([1, 1, 2]);
    const x = (b * b - a) / k;
    if (!Number.isInteger(x)) return radicalEquation(r, level);
    return intQ(r, "Resuelve la ecuación.", x, `Se elevan ambos lados al cuadrado: ${k === 1 ? "" : k}x ${a < 0 ? "−" : "+"} ${Math.abs(a)} = ${b * b} → x = ${sg(x)}.`, `√(${k === 1 ? "" : k}x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) = ${b}`, "simple", [b - a, b * b + a]);
  }
  // √(x + a) = x + c con una solución válida s y otra t que puede ser extraña.
  const c = r.int(-3, 3), s = r.int(Math.max(-c, 0), 6);
  const a = (s + c) ** 2 - s;
  const t = 1 - 2 * c - s;
  const valid = [s, ...(t !== s && t + c >= 0 && t + a >= 0 ? [t] : [])].sort((p, q) => p - q);
  const good = valid.map((v) => `x = ${sg(v)}`).join(" o ");
  const wrong = [[s, t].sort((p, q) => p - q).map((v) => `x = ${sg(v)}`).join(" o "), `x = ${sg(t)}`, `x = ${sg(-s)}`, "No tiene solución"].filter((w, i, all) => w !== good && all.indexOf(w) === i);
  return choiceQ(r, "Resuelve la ecuación. (Comprueba las soluciones.)", good, wrong, `Al elevar al cuadrado: ${poly([1, 2 * c - 1, c * c - a])} = 0, con raíces ${sg(s)} y ${sg(t)}.${valid.length === 1 && t !== s ? ` x = ${sg(t)} no cumple la ecuación original (es una solución extraña).` : ""}`, `√(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) = x ${c < 0 ? "−" : "+"} ${Math.abs(c)}`.replace(" + 0)", ")").replace("x + 0", "x").replace("x − 0", "x"), valid.length === 1 ? "extrana" : "dos");
}

// ---------------------------------------------------------------------------
// Expresiones racionales

const wrap = (t: string) => (/[ x]/.test(t) ? `(${t})` : t);
const ratio = (num: string, den: string) => `${wrap(num)} / ${wrap(den)}`;
// GG.1: simplificar expresiones racionales.
export function simplifyRational(r: Rng): Question {
  const a = nz(r, 6), b = nz(r, 6), c = nz(r, 6);
  if (a === b || a === c || b === c) return simplifyRational(r);
  const num = polyMul([1, a], [1, b]), den = polyMul([1, a], [1, c]);
  const good = ratio(poly([1, b]), poly([1, c]));
  return choiceQ(r, "Simplifica. (Supón que el denominador no es 0.)", good, [ratio(poly([1, a]), poly([1, c])), ratio(poly([1, -b]), poly([1, -c])), ratio(poly([1, b]), poly([1, a])), ratio(poly([num[1]]), poly([den[1]]))].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Se factoriza: ${binom(1, a)}${binom(1, b)} / ${binom(1, a)}${binom(1, c)}; se cancela ${binom(1, a)}.`, ratio(poly(num), poly(den)), "simplificar");
}

// GG.2: multiplicar y dividir expresiones racionales.
export function multiplyRational(r: Rng): Question {
  const a = nz(r, 5), b = nz(r, 5), k = r.int(2, 6);
  if (a === b) return multiplyRational(r);
  const divide = r.chance(0.5);
  const good = divide ? ratio(poly([k, 0]), poly([1, b])) : ratio(String(k), poly([1, b]));
  const shown = divide ? `${k}x/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) ÷ (x ${b < 0 ? "−" : "+"} ${Math.abs(b)})/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})` : `${k}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) · (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})/(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`;
  return choiceQ(r, "Simplifica. (Supón que ningún denominador es 0.)", good, [divide ? ratio(poly([k, 0]), poly([1, a])) : ratio(String(k), poly([1, a])), divide ? ratio(poly([k, 0, 0]), poly([1, b])) : ratio(poly([k, k * a]), poly([1, b])), divide ? ratio(poly([1, b]), poly([k, 0])) : ratio(poly([1, b]), String(k))].filter((w) => w !== good), divide ? "Dividir es multiplicar por el inverso; luego se cancela el factor común." : `Se cancela el factor común x ${a < 0 ? "−" : "+"} ${Math.abs(a)}.`, shown, divide ? "dividir" : "multiplicar");
}

// GG.3 / GG.4: sumar y restar (y operar) expresiones racionales.
export function addRational(r: Rng, mixed: boolean): Question {
  if (mixed && r.chance(0.5)) return multiplyRational(r);
  const p = r.int(1, 6), q = nz(r, 6), a = nz(r, 5);
  const same = r.chance(0.4);
  if (same) {
    const good = `${sg(p + q)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`;
    return choiceQ(r, "Simplifica.", good, [`${sg(p + q)}/(2x ${a < 0 ? "−" : "+"} ${Math.abs(2 * a)})`, `${sg(p * q)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`, `${sg(p - q)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`].filter((w) => w !== good), "Con el mismo denominador se suman los numeradores.", `${p}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) ${q < 0 ? "−" : "+"} ${Math.abs(q)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`, "mismo-denominador");
  }
  // p/x + q/(x + a) = (p(x + a) + qx) / (x(x + a))
  const num = [p + q, p * a];
  const den = polyMul([1, 0], [1, a]);
  const good = ratio(poly(num), poly(den));
  return choiceQ(r, "Simplifica.", good, [ratio(sg(p + q), poly([2, a])), ratio(poly([p + q, q * a]), poly(den)), ratio(poly([p + q, p * a]), poly([1, a])), ratio(sg(p + q), poly(den))].filter((w, i, all) => w !== good && all.indexOf(w) === i), `Denominador común x(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}): ${p === 1 ? "" : p}(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) ${q < 0 ? "−" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}x = ${poly(num)}.`, `${p}/x ${q < 0 ? "−" : "+"} ${Math.abs(q)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`, "distinto-denominador");
}

// GG.5: resolver ecuaciones racionales.
export function rationalEquation(r: Rng): Question {
  const x = r.int(-6, 9), a = nz(r, 5), b = nz(r, 5);
  // p/(x + a) = q/(x + b) con p(x + b) = q(x + a).
  if (x + a === 0 || x + b === 0 || a === b) return rationalEquation(r);
  const p = x + a, q = x + b;
  // Se escalan los numeradores para que la igualdad no sea evidente a simple vista.
  const k = r.int(2, 4);
  const P = k * p, Q = k * q;
  return intQ(r, "Resuelve la ecuación.", x, `Se multiplica en cruz: ${sg(P)}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${sg(Q)}(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) → x = ${sg(x)}.`, `${sg(P)}/(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) = ${sg(Q)}/(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`, "proporcion", [-x, x + 1]);
}

