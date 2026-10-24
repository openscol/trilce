import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, numQ, sg, yesNo } from "../kit";
import { pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { dec, frac, poly, valQ } from "../alg1/util";

// Geometría: circunferencias (arcos, sectores, radianes, cuerdas, tangentes,
// ángulos inscritos), ecuaciones de la circunferencia y parábolas con foco y
// directriz.

// Múltiplo de π como texto: kπ con k fracción («(2/3)π», «4π», «π»).
const piText = (n: number, d: number) => {
  const t = frac(n, d);
  return t === "1" ? "π" : t === "−1" ? "−π" : t.includes("/") ? `(${t})π` : `${t}π`;
};
const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
const ANGLES = [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300];

// W.2: ángulos centrales y medidas de arcos.
export function arcMeasures(r: Rng): Question {
  const a = r.int(30, 160);
  const form = r.int(0, 2);
  if (form === 0) return numQ(a, `Un ángulo central de una circunferencia mide ${a}°. ¿Cuánto mide el arco menor que abarca?`, undefined, "Un arco menor mide lo mismo que su ángulo central.", "menor");
  if (form === 1) return numQ(360 - a, `El arco menor AB mide ${a}°. ¿Cuánto mide el arco mayor AB?`, undefined, `360° − ${a}° = ${360 - a}°.`, "mayor");
  const b = r.int(20, 150);
  return numQ(a + b, `Los arcos AB y BC son adyacentes; el arco AB mide ${a}° y el arco BC, ${b}°. ¿Cuánto mide el arco ABC?`, undefined, `Postulado de la suma de arcos: ${a}° + ${b}° = ${a + b}°.`, "suma");
}

// W.3: entender la longitud de arco y el área de un sector (fracción de la circunferencia).
export function arcFraction(r: Rng): Question {
  const a = r.pick(ANGLES);
  const k = g(a, 360);
  return choiceQ(r, `Un sector circular tiene un ángulo central de ${a}°. ¿Qué fracción de la circunferencia (y del círculo) representa?`, frac(a, 360), [frac(a, 180), frac(360 - a, 360), frac(a, 100) === frac(a, 360) ? "1/2" : frac(a, 100)].filter((w, i, all) => all.indexOf(w) === i && w !== frac(a, 360)), `${a}° ÷ 360° = ${a / k}/${360 / k}: la longitud del arco y el área del sector son esa fracción del total.`, undefined, "fraccion");
}

// W.4 / W.7: longitud de arco y área de sectores (en términos de π).
export function arcSector(r: Rng, area: boolean): Question {
  const a = r.pick(ANGLES), rr = r.int(2, 12);
  const good = area ? piText(a * rr * rr, 360) : piText(a * 2 * rr, 360);
  const wrong = area ? [piText(a * 2 * rr, 360), piText(a * rr * rr, 180), piText(rr * rr, 1)] : [piText(a * rr * rr, 360), piText(a * rr, 360), piText(2 * rr, 1)];
  return choiceQ(r, `Una circunferencia tiene radio ${rr} cm. ¿Cuál es ${area ? "el área del sector" : "la longitud del arco"} de ${a}°? Deja la respuesta en términos de π (en ${area ? "cm²" : "cm"}).`, good, [...new Set(wrong)].filter((w) => w !== good), area ? `Área = (${a}/360) × π × ${rr}² = ${good}.` : `Longitud = (${a}/360) × 2π × ${rr} = ${good}.`, undefined, area ? "sector" : "arco");
}

// W.5: convertir entre radianes y grados.
export function radiansDegrees(r: Rng): Question {
  const a = r.pick([...ANGLES, 360, 225, 315]);
  if (r.chance(0.5)) return choiceQ(r, `¿Cuántos radianes son ${a}°?`, piText(a, 180), [piText(a, 360), piText(180, a), piText(a, 90)].filter((w, i, all) => w !== piText(a, 180) && all.indexOf(w) === i), `Se multiplica por π/180: ${a} × π/180 = ${piText(a, 180)}.`, undefined, "a-radianes");
  return numQ(a, `¿Cuántos grados son ${piText(a, 180)} radianes?`, undefined, `Se multiplica por 180/π: ${piText(a, 180)} × 180/π = ${a}°.`, "a-grados");
}

// W.6: radianes y longitud de arco (s = rθ).
export function radianArc(r: Rng): Question {
  const rr = r.int(2, 12);
  if (r.chance(0.5)) {
    const [n, d] = r.pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1], [3, 2]]);
    return choiceQ(r, `En una circunferencia de radio ${rr} cm, un ángulo central de ${piText(n, d)} radianes abarca un arco. ¿Cuánto mide el arco, en cm?`, piText(rr * n, d), [piText(n, d * rr), piText(rr * rr * n, d), piText(2 * rr * n, d)].filter((w, i, all) => w !== piText(rr * n, d) && all.indexOf(w) === i), `s = r × θ = ${rr} × ${piText(n, d)} = ${piText(rr * n, d)}.`, undefined, "pi");
  }
  const th = r.pick([0.5, 1.5, 2, 2.5, 3]);
  return valQ(r, `En una circunferencia de radio ${rr} cm, un ángulo central de ${dec(th)} radianes abarca un arco. ¿Cuánto mide el arco, en cm?`, rr * th, [rr / th, rr + th, rr * th * 2], `s = r × θ = ${rr} × ${dec(th)} = ${dec(rr * th)}.`, undefined, "decimal");
}

// W.9: arcos y cuerdas.
export function arcsChords(r: Rng): Question {
  if (r.chance(0.5)) {
    const x = r.int(3, 12), a = r.int(2, 5), c = r.int(1, a - 1), b = r.int(1, 9);
    return numQ(x, `En una circunferencia, las cuerdas AB y CD son congruentes. El arco AB mide (${a}x + ${b})° y el arco CD mide (${c === 1 ? "" : c}x + ${(a - c) * x + b})°. ¿Cuánto vale x?`, undefined, "Cuerdas congruentes abarcan arcos congruentes: se igualan las medidas.", "cuerdas");
  }
  const [d, half, rr] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]);
  return numQ(2 * half, `Una circunferencia tiene radio ${rr}. Una cuerda está a ${d} unidades del centro. ¿Cuánto mide la cuerda?`, undefined, `La perpendicular desde el centro biseca la cuerda: la mitad mide √(${rr}² − ${d}²) = ${half}; la cuerda mide ${2 * half}.`, "distancia");
}

// W.10: rectas tangentes.
export function tangentLines(r: Rng): Question {
  const [rr, t, d] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]]);
  if (r.chance(0.5)) return numQ(t, `Desde un punto P exterior a una circunferencia de radio ${rr} se traza una tangente que toca la circunferencia en T. P está a ${d} del centro. ¿Cuánto mide PT?`, undefined, `La tangente es perpendicular al radio: PT = √(${d}² − ${rr}²) = ${t}.`, "pitagoras");
  const x = r.int(2, 9), a = r.int(2, 4), b = r.int(1, 8);
  return numQ(x, `Desde un punto P se trazan dos tangentes a una circunferencia, que la tocan en A y en B. PA = ${a}x + ${b} y PB = ${a * x + b}. ¿Cuánto vale x?`, undefined, "Las dos tangentes trazadas desde un mismo punto exterior miden lo mismo: PA = PB.", "dos-tangentes");
}

// W.11: perímetro de polígonos con una circunferencia inscrita.
export function inscribedCirclePerimeter(r: Rng): Question {
  const [a, b, c] = [r.int(2, 9), r.int(2, 9), r.int(2, 9)];
  return numQ(2 * (a + b + c), `Una circunferencia está inscrita en un triángulo. Desde los vértices A, B y C, las tangentes hasta los puntos de contacto miden ${a}, ${b} y ${c}. ¿Cuál es el perímetro del triángulo?`, undefined, `Cada vértice aporta dos tangentes iguales: 2 × (${a} + ${b} + ${c}) = ${2 * (a + b + c)}.`, "tangentes");
}

// W.12-W.15: ángulos inscritos, triángulos rectángulos inscritos y cuadriláteros inscritos.
export function inscribedAngles(r: Rng, kind: "angle" | "rightTriangle" | "quad1" | "quad2"): Question {
  if (kind === "angle") {
    const arc = r.int(20, 170) * 2 > 340 ? 160 : r.int(10, 85) * 2;
    if (r.chance(0.5)) return numQ(arc / 2, `Un ángulo inscrito abarca un arco de ${arc}°. ¿Cuánto mide el ángulo?`, undefined, `Un ángulo inscrito mide la mitad de su arco: ${arc}° ÷ 2 = ${arc / 2}°.`, "mitad");
    return numQ(arc, `Un ángulo inscrito mide ${arc / 2}°. ¿Cuánto mide el arco que abarca?`, undefined, `El arco mide el doble: ${arc / 2}° × 2 = ${arc}°.`, "doble");
  }
  if (kind === "rightTriangle") {
    const a = r.int(15, 75);
    return numQ(90 - a, `El triángulo ABC está inscrito en una circunferencia y AB es un diámetro. Si m∠A = ${a}°, ¿cuánto mide ∠B?`, undefined, `Un ángulo inscrito en una semicircunferencia es recto: m∠C = 90°, así que m∠B = 90° − ${a}° = ${90 - a}°.`, "semicircunferencia");
  }
  if (kind === "quad1") {
    const a = r.int(50, 130);
    return numQ(180 - a, `El cuadrilátero ABCD está inscrito en una circunferencia y m∠A = ${a}°. ¿Cuánto mide ∠C?`, undefined, `En un cuadrilátero inscrito, los ángulos opuestos son suplementarios: 180° − ${a}° = ${180 - a}°.`, "opuestos");
  }
  const x = r.int(10, 30), a = r.int(2, 4), b = r.int(1, 20);
  const A = a * x + b, C = 180 - A;
  if (C <= 10) return inscribedAngles(r, kind);
  return numQ(x, `El cuadrilátero ABCD está inscrito en una circunferencia. m∠A = (${a}x + ${b})° y m∠C = ${C}°. ¿Cuánto vale x?`, undefined, `∠A y ∠C son opuestos: ${a}x + ${b} + ${C} = 180 → x = ${x}.`, "ecuacion");
}

// W.16: ángulos formados por cuerdas, secantes y tangentes.
export function chordAngles(r: Rng): Question {
  const inside = r.chance(0.5);
  const a = r.int(20, 120), b = r.int(20, 120);
  if (inside) {
    if ((a + b) % 2) return chordAngles(r);
    return numQ((a + b) / 2, `Dos cuerdas se cortan dentro de una circunferencia. Los arcos que abarcan el ángulo y su opuesto por el vértice miden ${a}° y ${b}°. ¿Cuánto mide el ángulo?`, undefined, `Ángulo interior = semisuma de los arcos: (${a}° + ${b}°) ÷ 2 = ${(a + b) / 2}°.`, "interior");
  }
  const far = Math.max(a, b) + r.int(20, 100), near = Math.min(a, b);
  if ((far - near) % 2 || far + near > 360) return chordAngles(r);
  return numQ((far - near) / 2, `Dos secantes se cortan fuera de una circunferencia. Abarcan un arco lejano de ${far}° y un arco cercano de ${near}°. ¿Cuánto mide el ángulo?`, undefined, `Ángulo exterior = semidiferencia de los arcos: (${far}° − ${near}°) ÷ 2 = ${(far - near) / 2}°.`, "exterior");
}

// W.17: segmentos formados por cuerdas, secantes y tangentes.
export function chordSegments(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const [a, b, c] = r.pick([[2, 6, 3], [4, 6, 3], [3, 8, 4], [5, 6, 3], [6, 6, 4], [2, 9, 3], [4, 10, 5]]);
    return numQ((a * b) / c, `Dos cuerdas se cortan dentro de una circunferencia. Una queda dividida en segmentos de ${a} y ${b}; la otra, en segmentos de ${c} y x. ¿Cuánto vale x?`, undefined, `Producto de segmentos: ${a} × ${b} = ${c} × x → x = ${(a * b) / c}.`, "cuerdas");
  }
  if (form === 1) {
    const [out1, whole1, out2] = r.pick([[4, 9, 3], [2, 12, 4], [3, 8, 4], [5, 12, 6], [4, 15, 6]]);
    const whole2 = (out1 * whole1) / out2;
    return numQ(whole2 - out2, `Dos secantes salen de un punto P exterior. En la primera, la parte exterior mide ${out1} y la secante completa ${whole1}. En la segunda, la parte exterior mide ${out2}. ¿Cuánto mide la parte interior (la cuerda) de la segunda?`, undefined, `${out1} × ${whole1} = ${out2} × (${out2} + x) → ${out1 * whole1} = ${out2} × ${whole2} → x = ${whole2 - out2}.`, "secantes");
  }
  const [t, out, whole] = r.pick([[6, 4, 9], [4, 2, 8], [6, 3, 12], [10, 5, 20], [12, 8, 18]]);
  return numQ(t, `Desde un punto P se trazan una tangente y una secante a una circunferencia. La parte exterior de la secante mide ${out} y la secante completa mide ${whole}. ¿Cuánto mide la tangente?`, undefined, `tangente² = exterior × completa = ${out} × ${whole} = ${out * whole} → tangente = ${t}.`, "tangente");
}

// ---------------------------------------------------------------------------
// Circunferencias en el plano

type Circ = { h: number; k: number; r: number };
const circleEq = (c: Circ) => `${c.h ? `(x ${c.h < 0 ? "+" : "−"} ${Math.abs(c.h)})²` : "x²"} + ${c.k ? `(y ${c.k < 0 ? "+" : "−"} ${Math.abs(c.k)})²` : "y²"} = ${c.r * c.r}`;
const circlePts = (c: Circ) => Array.from({ length: 73 }, (_, i) => ({ x: c.h + c.r * Math.cos((i * Math.PI) / 36), y: c.k + c.r * Math.sin((i * Math.PI) / 36) }));
const circleVisual = (c: Circ, extra: { x: number; y: number }[] = []): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: [{ x: c.h, y: c.k, emoji: "•" }, ...extra.map((p) => ({ ...p, emoji: "•" }))], curves: [{ points: circlePts(c) }] });
const randomCirc = (r: Rng): Circ => ({ h: r.int(-4, 4), k: r.int(-4, 4), r: r.int(1, 4) });
const generalForm = (c: Circ) => `x² + y²${c.h ? ` ${-2 * c.h < 0 ? "−" : "+"} ${Math.abs(2 * c.h)}x` : ""}${c.k ? ` ${-2 * c.k < 0 ? "−" : "+"} ${Math.abs(2 * c.k)}y` : ""}${c.h * c.h + c.k * c.k - c.r * c.r ? ` ${c.h * c.h + c.k * c.k - c.r * c.r < 0 ? "−" : "+"} ${Math.abs(c.h * c.h + c.k * c.k - c.r * c.r)}` : ""} = 0`;

// Y.1-Y.3, Y.8: centro, radio, ¿el punto está en la circunferencia?, propiedades desde la forma general.
export function circleProps(r: Rng, mode: "center" | "radius" | "onCircle" | "general"): Question {
  const c = randomCirc(r);
  const eq = mode === "general" ? generalForm(c) : circleEq(c);
  const m = mode === "general" ? r.pick(["center", "radius"] as const) : mode;
  if (m === "center") return pointQ(r, `¿Cuál es el centro de la circunferencia ${eq}?`, { x: c.h, y: c.k }, mode === "general" ? `Completando cuadrados: ${circleEq(c)}; el centro es ${pt({ x: c.h, y: c.k })}.` : `En (x − h)² + (y − k)² = r², el centro es (h, k) = ${pt({ x: c.h, y: c.k })}.`, undefined, "centro", [{ x: -c.h, y: -c.k }]);
  if (m === "radius") {
    const diam = mode !== "general" && r.chance(0.4);
    return numQ(diam ? 2 * c.r : c.r, `¿Cuál es ${diam ? "el diámetro" : "el radio"} de la circunferencia ${eq}?`, undefined, `${mode === "general" ? `Completando cuadrados: ${circleEq(c)}. ` : ""}r² = ${c.r * c.r}, así que r = ${c.r}${diam ? ` y el diámetro mide ${2 * c.r}` : ""}.`, diam ? "diametro" : "radio");
  }
  const [dx, dy] = r.pick([[c.r, 0], [0, c.r], [-c.r, 0], [0, -c.r]]);
  const yes = r.chance(0.5);
  const P = yes ? { x: c.h + dx, y: c.k + dy } : { x: c.h + dx + 1, y: c.k + dy };
  const lhs = (P.x - c.h) ** 2 + (P.y - c.k) ** 2;
  return yesNo(`¿El punto ${pt(P)} está sobre la circunferencia ${eq}?`, yes, `Al reemplazar: ${lhs} ${yes ? "=" : "≠"} ${c.r * c.r}.`, undefined, yes ? "si" : "no");
}

// Y.4-Y.7: escribir ecuaciones de circunferencias.
export function circleEquation(r: Rng, mode: "pythagoras" | "graph" | "properties" | "convert"): Question {
  const c = randomCirc(r);
  const good = circleEq(c);
  const wrong = [circleEq({ ...c, h: -c.h, k: -c.k }), `${circleEq(c).replace(/= \d+$/, `= ${c.r}`)}`, circleEq({ ...c, r: c.r + 1 }), circleEq({ ...c, h: c.k, k: c.h })];
  const opts = [...new Set(wrong)].filter((w) => w !== good);
  if (mode === "graph") return choiceQ(r, "¿Cuál es la ecuación de la circunferencia del gráfico?", good, opts, `Centro ${pt({ x: c.h, y: c.k })} y radio ${c.r}: ${good}.`, circleVisual(c), "grafico");
  if (mode === "convert") return choiceQ(r, `Escribe ${generalForm(c)} en forma estándar.`, good, opts, `Se completan cuadrados en x y en y: ${good}.`, undefined, "convertir");
  if (mode === "pythagoras") {
    const [a, b, rr] = r.pick([[3, 4, 5], [0, 3, 3], [4, 3, 5], [6, 8, 10], [0, 2, 2]]);
    const C = { h: r.int(-3, 3), k: r.int(-3, 3), r: rr };
    const P = { x: C.h + a, y: C.k + b };
    const g2 = circleEq(C);
    return choiceQ(r, `Una circunferencia tiene centro ${pt({ x: C.h, y: C.k })} y pasa por ${pt(P)}. ¿Cuál es su ecuación?`, g2, [circleEq({ ...C, r: a + b }), circleEq({ ...C, h: -C.h, k: -C.k }), circleEq({ ...C, r: rr + 1 })].filter((w, i, all) => w !== g2 && all.indexOf(w) === i), `Por Pitágoras, r² = ${a}² + ${b}² = ${rr * rr}: ${g2}.`, undefined, "pitagoras");
  }
  // Propiedades: extremos de un diámetro.
  const A = { x: c.h - c.r, y: c.k }, B = { x: c.h + c.r, y: c.k };
  return choiceQ(r, `Los extremos de un diámetro de una circunferencia son ${pt(A)} y ${pt(B)}. ¿Cuál es su ecuación?`, good, opts, `El centro es el punto medio ${pt({ x: c.h, y: c.k })} y el radio es la mitad del diámetro (${c.r}): ${good}.`, undefined, "diametro");
}

// Y.9 / Y.10: graficar circunferencias (forma estándar o general).
export function graphCircle(r: Rng, general: boolean): Question {
  const c = randomCirc(r);
  const yes = r.chance(0.5);
  const shown = yes ? c : r.pick([{ ...c, h: -c.h || 2 }, { ...c, r: c.r + 1 }, { ...c, k: -c.k || -2 }]);
  return yesNo(`¿El gráfico muestra la circunferencia ${general ? generalForm(c) : circleEq(c)}?`, yes, `Centro ${pt({ x: c.h, y: c.k })} y radio ${c.r}.`, circleVisual(shown), general ? "general" : "estandar");
}

// ---------------------------------------------------------------------------
// Parábolas (foco y directriz)

type Para = { h: number; k: number; p: number };
// y = (1/(4p))(x − h)² + k: foco (h, k + p), directriz y = k − p.
const paraA = (q: Para) => frac(1, 4 * q.p);
const paraEq = (q: Para) => {
  const a = paraA(q);
  const coef = a === "1" ? "" : a === "−1" ? "−" : a.startsWith("−") ? `−(${a.slice(1)})` : `(${a})`;
  return `y = ${coef}${q.h ? `(x ${q.h < 0 ? "+" : "−"} ${Math.abs(q.h)})²` : "x²"}${q.k ? ` ${q.k < 0 ? "−" : "+"} ${Math.abs(q.k)}` : ""}`;
};
const PS = [1, 2, -1, -2, 0.25, -0.25, 0.5, -0.5];
const randomPara = (r: Rng): Para => ({ h: r.int(-3, 3), k: r.int(-3, 3), p: r.pick(PS) });
const paraVisual = (q: Para): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: [{ x: q.h, y: q.k, emoji: "•" }], curves: [{ points: Array.from({ length: 161 }, (_, i) => { const x = -8 + i * 0.1; return { x, y: (x - q.h) ** 2 / (4 * q.p) + q.k }; }) }] });

// Z.1-Z.3, Z.8: vértice, foco, directriz y eje de una parábola (también desde la forma general).
export function parabolaProps(r: Rng, mode: "vertex" | "focus" | "axis" | "general"): Question {
  const q = randomPara(r);
  const m = mode === "general" ? r.pick(["vertex", "focus", "axis"] as const) : mode;
  const a = 1 / (4 * q.p);
  const eq = mode === "general" ? `y = ${poly([a, -2 * a * q.h, a * q.h * q.h + q.k]).replace(/(\d+\.\d+)/g, (n) => dec(Number(n)))}` : paraEq(q);
  if (m === "vertex") return pointQ(r, `¿Cuál es el vértice de la parábola ${eq}?`, { x: q.h, y: q.k }, `En forma de vértice: ${paraEq(q)}; el vértice es ${pt({ x: q.h, y: q.k })}.`, undefined, "vertice", [{ x: -q.h, y: q.k }]);
  if (m === "axis") return choiceQ(r, `¿Cuál es el eje de simetría de la parábola ${eq}?`, `x = ${sg(q.h)}`, [`x = ${sg(-q.h || 2)}`, `y = ${sg(q.k)}`, `y = ${sg(q.h)}`].filter((w) => w !== `x = ${sg(q.h)}`), `El eje es la recta vertical que pasa por el vértice: x = ${sg(q.h)}.`, undefined, "eje");
  if (r.chance(0.5)) return choiceQ(r, `¿Cuál es el foco de la parábola ${eq}?`, pt({ x: q.h, y: q.k + q.p }).replace(/(\d+\.\d+)/g, (n) => dec(Number(n))), [pt({ x: q.h, y: q.k - q.p }), pt({ x: q.h + q.p, y: q.k }), pt({ x: q.h, y: q.k + 2 * q.p })].map((s) => s.replace(/(\d+\.\d+)/g, (n) => dec(Number(n)))), `a = ${paraA(q)} = 1/(4p), así que p = ${dec(q.p)}; el foco está en (h, k + p) = (${sg(q.h)}, ${dec(q.k + q.p)}).`, undefined, "foco");
  return choiceQ(r, `¿Cuál es la directriz de la parábola ${eq}?`, `y = ${dec(q.k - q.p)}`, [`y = ${dec(q.k + q.p)}`, `x = ${dec(q.h - q.p)}`, `y = ${dec(q.k - 2 * q.p)}`], `p = ${dec(q.p)}; la directriz es y = k − p = ${dec(q.k - q.p)}.`, undefined, "directriz");
}

// Z.4-Z.7: escribir ecuaciones de parábolas en forma de vértice.
export function parabolaEquation(r: Rng, mode: "graph" | "focus" | "properties" | "convert"): Question {
  const q = mode === "graph" ? { ...randomPara(r), p: r.pick([0.25, -0.25, 0.5, -0.5]) } : randomPara(r);
  const good = paraEq(q);
  const wrong = [paraEq({ ...q, p: -q.p }), paraEq({ ...q, h: -q.h || 2 }), paraEq({ ...q, k: -q.k || 2 }), paraEq({ ...q, p: q.p * 2 })];
  const opts = [...new Set(wrong)].filter((w) => w !== good);
  if (mode === "graph") return choiceQ(r, "¿Cuál es la ecuación de la parábola del gráfico?", good, opts, `Vértice ${pt({ x: q.h, y: q.k })}; un paso a la derecha del vértice, y cambia ${dec(1 / (4 * q.p))}: ${good}.`, paraVisual(q), "grafico");
  if (mode === "focus") return choiceQ(r, `Una parábola tiene foco (${sg(q.h)}, ${dec(q.k + q.p)}) y directriz y = ${dec(q.k - q.p)}. ¿Cuál es su ecuación en forma de vértice?`, good, opts, `El vértice está a mitad de camino: ${pt({ x: q.h, y: q.k })}; p = ${dec(q.p)} y a = 1/(4p) = ${paraA(q)}.`, undefined, "foco-directriz");
  if (mode === "properties") return choiceQ(r, `Una parábola tiene vértice ${pt({ x: q.h, y: q.k })} y foco (${sg(q.h)}, ${dec(q.k + q.p)}). ¿Cuál es su ecuación?`, good, opts, `p = distancia (con signo) del vértice al foco = ${dec(q.p)}; a = 1/(4p) = ${paraA(q)}.`, undefined, "propiedades");
  const a = 1 / (4 * q.p);
  return choiceQ(r, `Escribe y = ${poly([a, -2 * a * q.h, a * q.h * q.h + q.k]).replace(/(\d+\.\d+)/g, (n) => dec(Number(n)))} en forma de vértice.`, good, opts, `Se saca factor común ${paraA(q)} y se completa el cuadrado: ${good}.`, undefined, "convertir");
}

// Z.9: graficar parábolas.
export function graphParabola(r: Rng): Question {
  const q = { ...randomPara(r), p: r.pick([0.25, -0.25, 0.5, -0.5]) };
  const yes = r.chance(0.5);
  const shown = yes ? q : r.pick([{ ...q, p: -q.p }, { ...q, h: -q.h || 2 }, { ...q, k: q.k + 2 }]);
  return yesNo(`¿El gráfico muestra la parábola ${paraEq(q)}?`, yes, `Vértice ${pt({ x: q.h, y: q.k })} y se abre hacia ${q.p > 0 ? "arriba" : "abajo"}.`, paraVisual(shown), "graficar");
}


