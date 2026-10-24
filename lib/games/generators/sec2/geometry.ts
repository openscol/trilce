import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, d3, decQ, fixedQ, fmt, numQ, yesNo } from "../kit";
import { PI_NOTE, mil, nz, pointQ } from "../sec1/util";
import { type P, dec, pt } from "./util";

// Geometría de 2.° de secundaria: transversales y ángulos de triángulos con
// ecuaciones, transformaciones de figuras (también dilataciones), semejanza,
// teorema de Pitágoras y volúmenes y áreas de conos y esferas.

// ---------------------------------------------------------------------------
// Ángulos con ecuaciones

const linX = (a: number, b: number) => `(${a === 1 ? "" : a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})°`;

// P.7: transversales de rectas paralelas: hallar x.
export function transversalSolveX(r: Rng): Question {
  const x = r.int(8, 30);
  const equal = r.chance(0.6);
  const [pair, rule] = equal ? r.pick([["alternos internos", "son iguales"], ["correspondientes", "son iguales"], ["alternos externos", "son iguales"]]) : ["conjugados internos (del mismo lado, entre las paralelas)", "suman 180°"];
  const a = r.int(2, 5), b = r.int(-20, 30) || 10;
  const angle = a * x + b;
  if (angle <= 10 || angle >= 170) return transversalSolveX(r);
  const c = r.int(1, 6);
  const d = equal ? angle - c * x : 180 - angle - c * x;
  if (c === a || d === 0) return transversalSolveX(r);
  const eq = equal ? `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c === 1 ? "" : c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}` : `(${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) + (${c === 1 ? "" : c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}) = 180`;
  return numQ(x, `Dos rectas paralelas son cortadas por una transversal. Dos ángulos ${pair} miden ${linX(a, b)} y ${linX(c, d)}. ¿Cuánto vale x?`, undefined, `Los ángulos ${pair.split(" (")[0]} ${rule}: ${eq} → x = ${x}.`, equal ? "iguales" : "suplementarios");
}

// Q.9: teorema de la suma de los ángulos de un triángulo.
export function triangleSumX(r: Rng): Question {
  const x = r.int(10, 30);
  const forms: [string[], number[]][] = [
    [["x", "2x", String(180 - 3 * x)], [x, 2 * x, 180 - 3 * x]],
    [["x", "x + 20", String(160 - 2 * x)], [x, x + 20, 160 - 2 * x]],
    [["2x − 10", "3x", String(190 - 5 * x)], [2 * x - 10, 3 * x, 190 - 5 * x]],
    [["x + 15", "x + 15", String(150 - 2 * x)], [x + 15, x + 15, 150 - 2 * x]],
  ];
  const ok = forms.filter(([, v]) => v.every((a) => a > 0));
  const [labels, vals] = r.pick(ok);
  const shown = labels.map((l) => (l.includes("x") && l.length > 2 ? `(${l})°` : `${l}°`));
  return numQ(x, `Los ángulos de un triángulo miden ${shown[0]}, ${shown[1]} y ${shown[2]}. ¿Cuánto vale x?`, undefined, `Los tres ángulos suman 180°: ${labels.map((l) => (l.length > 2 && l.includes("x") ? `(${l})` : l)).join(" + ")} = 180 → x = ${x}. Los ángulos miden ${vals.join("°, ")}°.`, "suma");
}

// Q.12: teorema del ángulo exterior.
export function exteriorAngle(r: Rng): Question {
  const a = r.int(25, 75), b = r.int(25, 75);
  if (a + b >= 170) return exteriorAngle(r);
  if (r.chance(0.5)) return numQ(a + b, `En un triángulo, dos ángulos interiores miden ${a}° y ${b}°. ¿Cuánto mide el ángulo exterior adyacente al tercer ángulo?`, undefined, `El ángulo exterior es igual a la suma de los dos interiores no adyacentes: ${a} + ${b} = ${a + b}°.`, "directo");
  const x = r.int(8, 25), k = r.int(2, 4), c = a + b - k * x;
  if (c <= -40 || c === 0) return exteriorAngle(r);
  return numQ(x, `En un triángulo, los ángulos interiores no adyacentes a un ángulo exterior miden ${a}° y ${b}°. El ángulo exterior mide ${linX(k, c)}. ¿Cuánto vale x?`, undefined, `${k}x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${a} + ${b} = ${a + b} → x = ${x}.`, "ecuacion");
}

// ---------------------------------------------------------------------------
// Transformaciones de figuras

type Move =
  | { kind: "translate"; dx: number; dy: number }
  | { kind: "reflect"; axis: "x" | "y" }
  | { kind: "rotate"; turn: 90 | 180 | 270 }
  | { kind: "dilate"; k: number };

const apply = (m: Move, p: P): P => {
  if (m.kind === "translate") return { x: p.x + m.dx, y: p.y + m.dy };
  if (m.kind === "reflect") return m.axis === "x" ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y };
  if (m.kind === "rotate") return m.turn === 90 ? { x: -p.y, y: p.x } : m.turn === 180 ? { x: -p.x, y: -p.y } : { x: p.y, y: -p.x };
  return { x: p.x * m.k, y: p.y * m.k };
};
const units = (n: number) => `${Math.abs(n)} ${Math.abs(n) === 1 ? "unidad" : "unidades"}`;
const describe = (m: Move) => {
  if (m.kind === "translate") {
    const parts = [m.dx ? `${units(m.dx)} a la ${m.dx > 0 ? "derecha" : "izquierda"}` : "", m.dy ? `${units(m.dy)} hacia ${m.dy > 0 ? "arriba" : "abajo"}` : ""].filter(Boolean);
    return `una traslación de ${parts.join(" y ")}`;
  }
  if (m.kind === "reflect") return `una reflexión respecto del eje ${m.axis}`;
  if (m.kind === "rotate") return m.turn === 180 ? "una rotación de 180° alrededor del origen" : `una rotación de 90° en sentido ${m.turn === 90 ? "antihorario" : "horario"} alrededor del origen`;
  return `una dilatación de factor ${dec(m.k)} con centro en el origen`;
};
const rule = (m: Move) => {
  if (m.kind === "translate") return `(x, y) → (x ${m.dx < 0 ? "−" : "+"} ${Math.abs(m.dx)}, y ${m.dy < 0 ? "−" : "+"} ${Math.abs(m.dy)})`;
  if (m.kind === "reflect") return m.axis === "x" ? "(x, y) → (x, −y)" : "(x, y) → (−x, y)";
  if (m.kind === "rotate") return m.turn === 90 ? "(x, y) → (−y, x)" : m.turn === 180 ? "(x, y) → (−x, −y)" : "(x, y) → (y, −x)";
  return `(x, y) → (${dec(m.k)}x, ${dec(m.k)}y)`;
};
const inside = (ps: P[], size = 6) => ps.every((p) => Math.abs(p.x) <= size && Math.abs(p.y) <= size);
const same = (a: P[], b: P[]) => a.every((p, i) => p.x === b[i].x && p.y === b[i].y);

function triangle(r: Rng, max = 4): P[] {
  for (;;) {
    const ps = [0, 1, 2].map(() => ({ x: r.int(-max, max), y: r.int(-max, max) }));
    const area = (ps[1].x - ps[0].x) * (ps[2].y - ps[0].y) - (ps[2].x - ps[0].x) * (ps[1].y - ps[0].y);
    if (Math.abs(area) >= 4) return ps;
  }
}
const rigid = (r: Rng): Move => {
  const k = r.int(0, 2);
  if (k === 0) return { kind: "translate", dx: nz(r, 4), dy: nz(r, 4) };
  if (k === 1) return { kind: "reflect", axis: r.pick(["x", "y"] as const) };
  return { kind: "rotate", turn: r.pick([90, 180, 270] as const) };
};
const figure = (A: P[], B: P[]): Visual => ({ kind: "coordPlane", min: -6, max: 6, points: [], shapes: [{ points: A, label: "A" }, { points: B, dashed: true, label: "B" }] });

// Figura y su imagen que caben en el plano.
function figureAndImage(r: Rng, moves: Move[], max = 4) {
  for (let i = 0; i < 50; i++) {
    const T = triangle(r, max);
    // Para reducir a la mitad, la figura original se toma con coordenadas pares.
    const A = moves.some((m) => m.kind === "dilate" && m.k < 1) ? T.map((p) => ({ x: 2 * p.x, y: 2 * p.y })) : T;
    const B = moves.reduce((ps, m) => ps.map((p) => apply(m, p)), A);
    if (inside(B) && !same(A, B) && B.every((p) => Number.isInteger(p.x) && Number.isInteger(p.y))) return { A, B };
  }
  return null;
}

// R.3 / R.6 / R.8 / R.10 / R.14 / S.2: ¿la figura punteada es la imagen?
export function graphImage(r: Rng, kinds: Move["kind"][], steps = 1): Question {
  const pickMove = (): Move => {
    const kind = r.pick(kinds);
    if (kind === "translate") return { kind, dx: nz(r, 4), dy: nz(r, 4) };
    if (kind === "reflect") return { kind, axis: r.pick(["x", "y"] as const) };
    if (kind === "rotate") return { kind, turn: r.pick([90, 180, 270] as const) };
    return { kind, k: r.pick([2, 0.5]) };
  };
  const moves = Array.from({ length: steps }, pickMove);
  const dilation = moves.some((m) => m.kind === "dilate");
  const made = figureAndImage(r, moves, dilation ? 3 : 4);
  if (!made) return graphImage(r, kinds, steps);
  const { A, B } = made;
  const yes = r.chance(0.5);
  let shown = B;
  if (!yes) {
    const fakes = [B.map((p) => ({ x: p.x + 1, y: p.y })), B.map((p) => ({ x: -p.x, y: p.y })), B.map((p) => ({ x: p.x, y: -p.y })), A.map((p) => ({ x: p.y, y: -p.x }))].filter((f) => inside(f) && !same(f, B) && !same(f, A));
    if (!fakes.length) return graphImage(r, kinds, steps);
    shown = r.pick(fakes);
  }
  const text = moves.map(describe).join(" y luego ");
  return yesNo(`La figura A se transforma con ${text}. ¿La figura punteada B es su imagen?`, yes, `Con ${text}, los vértices de A van a ${B.map(pt).join(", ")}.`, figure(A, shown), moves.map((m) => m.kind).join("-"));
}

// R.4 / R.7 / R.9 / R.11 / S.3: coordenadas de la imagen de un vértice de la figura.
export function imageCoordinates(r: Rng, kinds: Move["kind"][]): Question {
  const kind = r.pick(kinds);
  const m: Move = kind === "translate" ? { kind, dx: nz(r, 5), dy: nz(r, 5) } : kind === "reflect" ? { kind, axis: r.pick(["x", "y"] as const) } : kind === "rotate" ? { kind, turn: r.pick([90, 180, 270] as const) } : { kind, k: r.pick([2, 3, 0.5]) };
  const A = triangle(r, kind === "dilate" ? 3 : 5).map((p) => (m.kind === "dilate" && m.k === 0.5 ? { x: p.x * 2, y: p.y * 2 } : p));
  const names = ["P", "Q", "R"];
  const i = r.int(0, 2);
  const img = apply(m, A[i]);
  if (Math.abs(img.x) > 12 || Math.abs(img.y) > 12) return imageCoordinates(r, kinds);
  return pointQ(r, `El triángulo PQR tiene vértices P${pt(A[0])}, Q${pt(A[1])} y R${pt(A[2])}. Se aplica ${describe(m)}. ¿Cuáles son las coordenadas de ${names[i]}′?`, img, `La regla es ${rule(m)}: ${names[i]}${pt(A[i])} → ${names[i]}′${pt(img)}.`, undefined, m.kind);
}

// R.5 / R.12 / S.5: escribir la regla de la transformación.
export function writeRule(r: Rng, kinds: Move["kind"][]): Question {
  const kind = r.pick(kinds);
  const m: Move = kind === "translate" ? { kind, dx: nz(r, 4), dy: nz(r, 4) } : kind === "reflect" ? { kind, axis: r.pick(["x", "y"] as const) } : kind === "rotate" ? { kind, turn: r.pick([90, 180, 270] as const) } : { kind, k: r.pick([2, 0.5]) };
  const made = figureAndImage(r, [m], m.kind === "dilate" ? 3 : 4);
  if (!made) return writeRule(r, kinds);
  const good = rule(m);
  const wrong: string[] = m.kind === "translate"
    ? [rule({ ...m, dx: -m.dx }), rule({ ...m, dy: -m.dy }), rule({ kind: "translate", dx: m.dy, dy: m.dx }), rule({ kind: "translate", dx: -m.dx, dy: -m.dy })]
    : m.kind === "dilate"
      ? [rule({ kind: "dilate", k: m.k === 2 ? 0.5 : 2 }), `(x, y) → (x + ${m.k === 2 ? 2 : 1}, y + ${m.k === 2 ? 2 : 1})`, rule({ kind: "dilate", k: m.k === 2 ? 3 : 1.5 })]
      : ["(x, y) → (x, −y)", "(x, y) → (−x, y)", "(x, y) → (−y, x)", "(x, y) → (−x, −y)", "(x, y) → (y, −x)", "(x, y) → (y, x)"];
  return choiceQ(r, "La figura B es la imagen de la figura A. ¿Qué regla describe la transformación?", good, wrong.filter((w) => w !== good), `Por ejemplo, ${pt(made.A[0])} → ${pt(made.B[0])}: la regla es ${good}.`, figure(made.A, made.B), m.kind);
}

const NAMES4 = ["Traslación", "Reflexión", "Rotación", "Dilatación"];
// R.13: describir la transformación.
export function nameTransformation(r: Rng): Question {
  const k = r.int(0, 3);
  const m: Move = k === 0 ? { kind: "translate", dx: nz(r, 4), dy: nz(r, 3) } : k === 1 ? { kind: "reflect", axis: r.pick(["x", "y"] as const) } : k === 2 ? { kind: "rotate", turn: r.pick([90, 270] as const) } : { kind: "dilate", k: 2 };
  const made = figureAndImage(r, [m], k === 3 ? 3 : 4);
  if (!made) return nameTransformation(r);
  return fixedQ("¿Qué transformación lleva la figura A a la figura B?", NAMES4, NAMES4[k], `Es ${describe(m)}.`, figure(made.A, made.B), m.kind);
}

// R.2 / R.15: elegir la sucesión de transformaciones.
export function chooseSequence(r: Rng, withRotations: boolean): Question {
  const first: Move = withRotations && r.chance(0.5) ? { kind: "rotate", turn: r.pick([90, 180, 270] as const) } : { kind: "reflect", axis: r.pick(["x", "y"] as const) };
  const second: Move = { kind: "translate", dx: nz(r, 3), dy: nz(r, 3) };
  const moves = r.chance(0.5) ? [first, second] : [second, first];
  const made = figureAndImage(r, moves, 3);
  if (!made) return chooseSequence(r, withRotations);
  const text = (ms: Move[]) => ms.map(describe).join(" y luego ");
  const candidates: Move[][] = [
    [...moves].reverse(),
    moves.map((m) => (m.kind === "translate" ? { ...m, dx: -m.dx } : m)),
    moves.map((m) => (m.kind === "reflect" ? { ...m, axis: m.axis === "x" ? ("y" as const) : ("x" as const) } : m.kind === "rotate" ? { ...m, turn: m.turn === 90 ? (270 as const) : (90 as const) } : m)),
    moves.map((m) => (m.kind === "translate" ? { ...m, dy: -m.dy } : m)),
  ];
  const wrong = candidates.filter((ms) => !same(ms.reduce((ps, m) => ps.map((p) => apply(m, p)), made.A), made.B)).map(text);
  if (wrong.length < 2) return chooseSequence(r, withRotations);
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  return choiceQ(r, "¿Qué sucesión de transformaciones lleva la figura A a la figura B?", cap(text(moves)), wrong.map(cap), `Con ${text(moves)}, los vértices de A van a ${made.B.map(pt).join(", ")}.`, figure(made.A, made.B), "sucesion");
}

// R.16 / R.18 / S.10: ¿son congruentes o semejantes? (y justificar)
export function congruentOrSimilar(r: Rng, mode: "identify" | "justifyCongruent" | "justifySimilar"): Question {
  const similarMode = mode === "justifySimilar";
  const yes = r.chance(0.5);
  let moves: Move[] = [rigid(r)];
  if (similarMode && yes) {
    const dil: Move = { kind: "dilate", k: r.pick([2, 0.5]) };
    moves = r.chance(0.5) ? [dil] : [dil, r.chance(0.5) ? { kind: "reflect", axis: r.pick(["x", "y"] as const) } : { kind: "rotate", turn: r.pick([90, 180, 270] as const) }];
  }
  const made = figureAndImage(r, moves, 3);
  if (!made) return congruentOrSimilar(r, mode);
  let { B } = made;
  const { A } = made;
  if (!yes) {
    // Se deforma la imagen: un vértice se mueve (ya no es la misma forma).
    B = B.map((p, i) => (i === 0 ? { x: p.x + r.pick([-1, 1]), y: p.y + r.pick([1, 2]) } : p));
    if (!inside(B)) return congruentOrSimilar(r, mode);
  }
  const text = moves.map(describe).join(" y luego ");
  if (mode === "identify") return yesNo("¿Las figuras A y B son congruentes?", yes, yes ? `Sí: ${text} lleva A exactamente sobre B.` : "No: ningún movimiento rígido (traslación, reflexión o rotación) lleva A sobre B; la forma cambió.", figure(A, B), yes ? "si" : "no");
  const word = similarMode ? "semejantes" : "congruentes";
  const kinds = similarMode ? "transformaciones (movimientos rígidos y dilataciones)" : "movimientos rígidos";
  const none = `No, porque ninguna sucesión de ${kinds} lleva A sobre B`;
  const because = (t: string) => `Sí, porque ${t} lleva A sobre B`;
  const others: Move[] = [{ kind: "rotate", turn: 180 }, { kind: "reflect", axis: "x" }, { kind: "reflect", axis: "y" }, { kind: "rotate", turn: 90 }, { kind: "translate", dx: 2, dy: -3 }, { kind: "dilate", k: 3 }, { kind: "dilate", k: 2 }];
  const fakes = r.shuffle(others.map(describe).filter((o) => o !== text)).slice(0, 3).map(because);
  const good = yes ? because(text) : none;
  const wrong = yes ? [none, ...fakes.slice(0, 2)] : fakes;
  return choiceQ(r, `¿Las figuras A y B son ${word}?`, good, wrong.filter((w) => w !== good), yes ? `${text[0].toUpperCase()}${text.slice(1)} lleva A sobre B.` : "Un vértice no coincide con ninguna imagen de A: la forma cambió.", figure(A, B), yes ? "si" : "no");
}

// S.4: dilataciones: hallar el factor de escala.
export function dilationFactor(r: Rng): Question {
  const k = r.pick([2, 3, 0.5]);
  const made = figureAndImage(r, [{ kind: "dilate", k }], k === 3 ? 2 : 3);
  if (!made) return dilationFactor(r);
  const good = k === 0.5 ? "1/2" : String(k);
  return choiceQ(r, "La figura B es una dilatación de la figura A con centro en el origen. ¿Cuál es el factor de escala?", good, ["2", "3", "1/2", "1/3", "4"].filter((o) => o !== good), `${pt(made.A[0])} → ${pt(made.B[0])}: cada coordenada se multiplica por ${good}.`, figure(made.A, made.B), k < 1 ? "reduccion" : "ampliacion");
}

// ---------------------------------------------------------------------------
// Semejanza

// S.6: identificar triángulos semejantes (por sus lados).
export function similarTriangles(r: Rng): Question {
  const base = r.pick([[3, 4, 5], [2, 3, 4], [4, 5, 6], [5, 6, 8], [3, 5, 7], [2, 4, 5]]);
  const k = r.pick([2, 3, 1.5]);
  const yes = r.chance(0.5);
  const other = base.map((s, i) => s * k + (!yes && i === 2 ? 1 : 0));
  return yesNo(`Un triángulo tiene lados de ${base.join(", ")} cm y otro, de ${other.map((n) => dec(n)).join(", ")} cm. ¿Son semejantes?`, yes, yes ? `Todos los lados se multiplican por ${dec(k)}: son proporcionales.` : `${dec(other[0])} ÷ ${base[0]} = ${dec(k)}, pero ${dec(other[2])} ÷ ${base[2]} ≠ ${dec(k)}: no son proporcionales.`, undefined, yes ? "si" : "no");
}

// S.7: criterio ángulo-ángulo.
export function angleAngle(r: Rng): Question {
  const a = r.int(30, 80), b = r.int(30, 80);
  if (a + b >= 160 || a === b) return angleAngle(r);
  const c = 180 - a - b;
  const yes = r.chance(0.5);
  const [x, y] = yes ? r.pick([[a, c], [b, c], [c, a]]) : [a, b + r.pick([5, 10, -5])];
  return yesNo(`El triángulo ABC tiene ángulos de ${a}° y ${b}°. El triángulo DEF tiene ángulos de ${x}° y ${y}°. ¿Son semejantes por el criterio ángulo-ángulo?`, yes, yes ? `El tercer ángulo de ABC mide ${c}°: ABC tiene ${a}°, ${b}° y ${c}°, y DEF tiene dos de esos ángulos.` : `ABC tiene ${a}°, ${b}° y ${c}°; DEF tiene ${x}°, ${y}° y ${180 - x - y}°: no coinciden.`, undefined, yes ? "si" : "no");
}

// S.12: lados que faltan en triángulos proporcionales (recta paralela a un lado).
export function proportionalTriangles(r: Rng): Question {
  const ad = r.int(2, 9), db = r.int(2, 9), k = r.pick([1, 2, 3]);
  const ae = ad * k, ec = db * k;
  return numQ(ec, `En el triángulo ABC, el segmento DE es paralelo a BC, con D en AB y E en AC. Si AD = ${ad}, DB = ${db} y AE = ${ae}, ¿cuánto mide EC?`, undefined, `Una paralela a un lado divide los otros dos en partes proporcionales: AD/DB = AE/EC → ${ad}/${db} = ${ae}/EC → EC = ${ec}.`, "paralela");
}

// ---------------------------------------------------------------------------
// Teorema de Pitágoras

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [9, 40, 41], [12, 16, 20], [10, 24, 26], [15, 20, 25]];
const RIGHT: [number, number][] = [[12, 88], [88, 88], [12, 22]];
const rightVisual = (a: string, b: string, c: string): Visual => ({ kind: "polygon", points: RIGHT, rightAngles: [0], sideLabels: [a, c, b] });

// T.1-T.5: teorema de Pitágoras.
export function pythagorean(r: Rng, mode: "hypotenuse" | "leg" | "either" | "perimeter" | "word"): Question {
  const exact = r.chance(0.6);
  const [a, b, c] = exact ? r.pick(TRIPLES) : [r.int(2, 12), r.int(2, 12), 0];
  const hyp = c || Math.sqrt(a * a + b * b);
  const m = mode === "either" ? r.pick(["hypotenuse", "leg"] as const) : mode;
  if (m === "hypotenuse") {
    if (exact) return numQ(c, "¿Cuánto mide la hipotenusa, en cm?", rightVisual(`${a} cm`, `${b} cm`, "?"), `c² = ${a}² + ${b}² = ${a * a + b * b} → c = ${c}.`, "hipotenusa");
    const t = Math.round(hyp * 10);
    return decQ(r, "¿Cuánto mide la hipotenusa, en cm? Redondea a la décima.", t * 100, `c² = ${a}² + ${b}² = ${a * a + b * b} → c = √${a * a + b * b} ≈ ${d3(t * 100)}.`, rightVisual(`${a} cm`, `${b} cm`, "?"), "hipotenusa");
  }
  if (m === "leg") {
    if (exact) return numQ(b, "¿Cuánto mide el cateto que falta, en cm?", rightVisual(`${a} cm`, "?", `${c} cm`), `b² = ${c}² − ${a}² = ${c * c - a * a} → b = ${b}.`, "cateto");
    const h = Math.max(a, b) + r.int(1, 4), leg = Math.min(a, b);
    const t = Math.round(Math.sqrt(h * h - leg * leg) * 10);
    return decQ(r, "¿Cuánto mide el cateto que falta, en cm? Redondea a la décima.", t * 100, `b² = ${h}² − ${leg}² = ${h * h - leg * leg} → b = √${h * h - leg * leg} ≈ ${d3(t * 100)}.`, rightVisual(`${leg} cm`, "?", `${h} cm`), "cateto");
  }
  const [p, q, s] = r.pick(TRIPLES);
  if (m === "perimeter") {
    if (r.chance(0.5)) return numQ(p + q + s, `Un triángulo rectángulo tiene catetos de ${p} cm y ${q} cm. ¿Cuál es su perímetro, en cm?`, rightVisual(`${p} cm`, `${q} cm`, ""), `Hipotenusa: √(${p * p} + ${q * q}) = ${s}. Perímetro: ${p} + ${q} + ${s} = ${p + q + s}.`, "perimetro");
    return numQ(4 * s, `Un rombo tiene diagonales de ${2 * p} cm y ${2 * q} cm, que se cortan en ángulo recto en su punto medio. ¿Cuál es el perímetro del rombo, en cm?`, undefined, `Cada lado es la hipotenusa de un triángulo de catetos ${p} y ${q}: √(${p * p} + ${q * q}) = ${s}. Perímetro: 4 × ${s} = ${4 * s}.`, "rombo");
  }
  const form = r.int(0, 2);
  if (form === 0) return numQ(s, `Una escalera se apoya en una pared. Su base está a ${p} m de la pared y llega a ${q} m de altura. ¿Cuánto mide la escalera, en metros?`, undefined, `√(${p}² + ${q}²) = √${p * p + q * q} = ${s}.`, "escalera");
  if (form === 1) return numQ(q, `Un cable de ${s} m va desde lo alto de un poste hasta el suelo, a ${p} m de la base del poste. ¿Cuánto mide el poste, en metros?`, undefined, `√(${s}² − ${p}²) = √${s * s - p * p} = ${q}.`, "poste");
  return numQ(s, `Una cancha rectangular mide ${q} m de largo y ${p} m de ancho. ¿Cuánto mide su diagonal, en metros?`, undefined, `√(${q}² + ${p}²) = √${p * p + q * q} = ${s}.`, "diagonal");
}

// T.6: recíproco del teorema de Pitágoras.
export function pythagoreanConverse(r: Rng): Question {
  const yes = r.chance(0.5);
  const [a, b, c] = r.pick(TRIPLES);
  const sides = yes ? [a, b, c] : [a, b, c + r.pick([-1, 1, 2])];
  return yesNo(`¿Un triángulo con lados de ${sides.join(", ")} cm es un triángulo rectángulo?`, yes, `${sides[0]}² + ${sides[1]}² = ${sides[0] ** 2 + sides[1] ** 2} y ${sides[2]}² = ${sides[2] ** 2}: ${yes ? "son iguales, sí es rectángulo." : "no son iguales, no es rectángulo."}`, undefined, yes ? "si" : "no");
}

// ---------------------------------------------------------------------------
// Sólidos

const SOLIDS: [string, number, number, number][] = [
  ["un cubo", 6, 12, 8], ["un prisma triangular", 5, 9, 6], ["un prisma pentagonal", 7, 15, 10], ["un prisma hexagonal", 8, 18, 12],
  ["una pirámide cuadrangular", 5, 8, 5], ["una pirámide triangular", 4, 6, 4], ["una pirámide pentagonal", 6, 10, 6], ["una pirámide hexagonal", 7, 12, 7],
];
// U.1: partes de las figuras tridimensionales.
export function solidParts(r: Rng): Question {
  const [name, f, e, v] = r.pick(SOLIDS);
  const k = r.int(0, 2);
  const what = ["caras", "aristas", "vértices"][k];
  const how = k === 2 ? "Cuántos" : "Cuántas";
  const ans = [f, e, v][k];
  return numQ(ans, `¿${how} ${what} tiene ${name}?`, undefined, `${name[0].toUpperCase()}${name.slice(1)} tiene ${f} caras, ${e} aristas y ${v} vértices (caras + vértices − aristas = 2).`, what);
}

// U.4: sólidos semejantes.
export function similarSolids(r: Rng): Question {
  const dims = [r.int(2, 6), r.int(3, 8), r.int(4, 10)], k = r.int(2, 4);
  if (r.chance(0.5)) {
    const yes = r.chance(0.5);
    const other = dims.map((d, i) => d * k + (!yes && i === 1 ? 1 : 0));
    return yesNo(`Un prisma rectangular mide ${dims.join(" × ")} cm y otro mide ${other.join(" × ")} cm. ¿Son semejantes?`, yes, yes ? `Todas las medidas se multiplican por ${k}.` : `${other[0]} ÷ ${dims[0]} = ${k}, pero ${other[1]} ÷ ${dims[1]} no da ${k}.`, undefined, yes ? "si" : "no");
  }
  return numQ(dims[2] * k, `Dos cilindros son semejantes. El pequeño tiene ${dims[0]} cm de radio y ${dims[2]} cm de altura; el grande tiene ${dims[0] * k} cm de radio. ¿Cuál es la altura del grande, en cm?`, undefined, `El factor de escala es ${dims[0] * k} ÷ ${dims[0]} = ${k}: ${dims[2]} × ${k} = ${dims[2] * k}.`, "medida");
}

// W.4 / W.6 / W.7 / W.8: conos y esferas (π ≈ 3,14).
export function roundSolid(r: Rng, kind: "coneVolume" | "coneSurface" | "sphereVolume" | "sphereSurface"): Question {
  if (kind === "coneVolume") {
    const rad = r.int(1, 9), h = 3 * r.int(1, 6);
    const v = (3140 * rad * rad * h) / 3;
    return decQ(r, `${PI_NOTE} Un cono tiene ${rad} cm de radio y ${h} cm de altura. ¿Cuál es su volumen, en cm³?`, v, `V = π × r² × h ÷ 3 = 3,14 × ${rad * rad} × ${h} ÷ 3 = ${mil(v)}.`, undefined, "cono", [3140 * rad * rad * h, 3140 * rad * h]);
  }
  if (kind === "coneSurface") {
    const [rad, h, g] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [4, 3, 5], [12, 5, 13]]);
    void h;
    const s = 3140 * rad * (rad + g);
    return decQ(r, `${PI_NOTE} Un cono tiene ${rad} cm de radio y su generatriz (la distancia del vértice al borde de la base) mide ${g} cm. ¿Cuál es su área de superficie total, en cm²?`, s, `Base: 3,14 × ${rad}² = ${mil(3140 * rad * rad)}. Lateral: 3,14 × ${rad} × ${g} = ${mil(3140 * rad * g)}. Total: ${mil(s)}.`, undefined, "cono", [3140 * rad * g, 3140 * rad * rad * g]);
  }
  if (kind === "sphereVolume") {
    const rad = 3 * r.int(1, 4);
    const v = (4 * 3140 * rad ** 3) / 3;
    if (r.chance(0.4)) {
      const k = (4 * rad ** 3) / 3;
      return choiceQ(r, `Una esfera tiene ${rad} cm de radio. ¿Cuál es su volumen, en cm³? Deja el resultado en términos de π.`, `${fmt(k)}π`, [`${fmt(4 * rad * rad)}π`, `${fmt(rad ** 3)}π`, `${fmt(k * 2)}π`, `${fmt(k / 2)}π`], `V = (4/3)πr³ = (4/3) × ${rad ** 3} × π = ${fmt(k)}π.`, undefined, "pi");
    }
    return decQ(r, `${PI_NOTE} Una esfera tiene ${rad} cm de radio. ¿Cuál es su volumen, en cm³?`, v, `V = (4/3) × π × r³ = 4 × 3,14 × ${rad ** 3} ÷ 3 = ${mil(v)}.`, undefined, "esfera", [4 * 3140 * rad * rad, 3140 * rad ** 3]);
  }
  const rad = r.int(1, 12);
  return decQ(r, `${PI_NOTE} Una esfera tiene ${rad} cm de radio. ¿Cuál es su área de superficie, en cm²?`, 12560 * rad * rad, `A = 4 × π × r² = 4 × 3,14 × ${rad * rad} = ${mil(12560 * rad * rad)}.`, undefined, "esfera", [3140 * rad * rad, 12560 * rad]);
}

// W.9: volumen y área de sólidos semejantes.
export function similarSolidMeasures(r: Rng): Question {
  const k = r.int(2, 4), area = r.int(5, 40), vol = r.int(4, 30);
  const form = r.int(0, 2);
  if (form === 0) return numQ(area * k * k, `Dos prismas son semejantes con factor de escala ${k}. El área de superficie del pequeño es ${area} cm². ¿Cuál es el área del grande, en cm²?`, undefined, `Las áreas se multiplican por ${k}² = ${k * k}: ${area} × ${k * k} = ${fmt(area * k * k)}.`, "area");
  if (form === 1) return numQ(vol * k ** 3, `Dos cilindros son semejantes con factor de escala ${k}. El volumen del pequeño es ${vol} cm³. ¿Cuál es el volumen del grande, en cm³?`, undefined, `Los volúmenes se multiplican por ${k}³ = ${k ** 3}: ${vol} × ${k ** 3} = ${fmt(vol * k ** 3)}.`, "volumen");
  return choiceQ(r, `Las medidas de un sólido se multiplican por ${k}. ¿Qué pasa con su volumen?`, `Se multiplica por ${k ** 3}`, [`Se multiplica por ${k}`, `Se multiplica por ${k * k}`, `Se multiplica por ${3 * k}`], `El volumen depende de tres dimensiones: ${k} × ${k} × ${k} = ${k ** 3}.`, undefined, "regla");
}

