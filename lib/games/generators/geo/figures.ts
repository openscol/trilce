import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { choiceQ, fixedQ, numQ, par, sg, yesNo } from "../kit";
import { pointQ } from "../sec1/util";
import { pt } from "../sec2/util";
import { dec, valQ } from "../alg1/util";

// Geometría: transformaciones (giros con otro centro, polígonos que se
// transforman en sí mismos, dilataciones con otro centro), criterios de
// congruencia y semejanza, propiedades de triángulos y de cuadriláteros.

type P = { x: number; y: number };
const tri = (r: Rng): P[] => {
  for (;;) {
    const ps = [0, 1, 2].map(() => ({ x: r.int(-3, 3), y: r.int(-3, 3) }));
    const area = (ps[1].x - ps[0].x) * (ps[2].y - ps[0].y) - (ps[2].x - ps[0].x) * (ps[1].y - ps[0].y);
    if (Math.abs(area) >= 4) return ps;
  }
};
const plane = (A: P[], B?: P[], extra: P[] = []): Visual => ({ kind: "coordPlane", min: -8, max: 8, points: extra.map((p) => ({ ...p, emoji: "•" })), shapes: [{ points: A, label: "A" }, ...(B ? [{ points: B, dashed: true, label: "B" }] : [])] });

// ---------------------------------------------------------------------------
// Transformaciones

// H.7: rotar polígonos alrededor de un punto (que no es el origen).
export function rotateAboutPoint(r: Rng): Question {
  const C = { x: r.int(-2, 2), y: r.int(-2, 2) };
  const turn = r.pick([90, 180, 270]);
  const P0 = { x: C.x + r.int(-3, 3) || C.x + 2, y: C.y + r.int(-3, 3) };
  const dx = P0.x - C.x, dy = P0.y - C.y;
  const img = turn === 90 ? { x: C.x - dy, y: C.y + dx } : turn === 180 ? { x: C.x - dx, y: C.y - dy } : { x: C.x + dy, y: C.y - dx };
  const name = turn === 270 ? "90° en sentido horario" : turn === 90 ? "90° en sentido antihorario" : "180°";
  return pointQ(r, `El punto P${pt(P0)} gira ${name} alrededor del punto C${pt(C)}. ¿Cuáles son las coordenadas de P′?`, img, `Desde C, P está ${sg(dx)} en x y ${sg(dy)} en y. Al girar ${name}, ese desplazamiento pasa a (${sg(img.x - C.x)}, ${sg(img.y - C.y)}): P′ = ${pt(img)}.`, { kind: "coordPlane", min: -6, max: 6, points: [{ ...C, emoji: "C" }, { ...P0, emoji: "P" }] }, `giro-${turn}`, [{ x: -P0.y, y: P0.x }, { x: -P0.x, y: -P0.y }]);
}

// H.16: hallar las reglas de una sucesión de transformaciones.
export function sequenceRules(r: Rng): Question {
  const dx = r.int(-4, 4) || 2, dy = r.int(-4, 4) || -1;
  const axis = r.pick(["x", "y"] as const);
  const translateFirst = r.chance(0.5);
  const t = `(x, y) → (x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})`;
  const f = axis === "x" ? "(x, y) → (x, −y)" : "(x, y) → (−x, y)";
  // Regla compuesta.
  const comp = translateFirst
    ? axis === "x" ? `(x, y) → (x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, −y ${dy < 0 ? "+" : "−"} ${Math.abs(dy)})` : `(x, y) → (−x ${dx < 0 ? "+" : "−"} ${Math.abs(dx)}, y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})`
    : axis === "x" ? `(x, y) → (x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, −y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})` : `(x, y) → (−x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})`;
  const other = translateFirst
    ? axis === "x" ? `(x, y) → (x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, −y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})` : `(x, y) → (−x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})`
    : axis === "x" ? `(x, y) → (x ${dx < 0 ? "−" : "+"} ${Math.abs(dx)}, −y ${dy < 0 ? "+" : "−"} ${Math.abs(dy)})` : `(x, y) → (−x ${dx < 0 ? "+" : "−"} ${Math.abs(dx)}, y ${dy < 0 ? "−" : "+"} ${Math.abs(dy)})`;
  const order = translateFirst ? `primero ${t} y luego ${f}` : `primero ${f} y luego ${t}`;
  return choiceQ(r, `Una figura se transforma ${order}. ¿Qué regla única hace lo mismo?`, comp, [other, t, f].filter((w) => w !== comp), "Se aplica la segunda regla al resultado de la primera; el orden importa.", undefined, "componer");
}

const REGULAR: [string, number][] = [["un triángulo equilátero", 3], ["un cuadrado", 4], ["un pentágono regular", 5], ["un hexágono regular", 6], ["un octágono regular", 8]];
// H.17: transformaciones que llevan un polígono sobre sí mismo.
export function ontoItself(r: Rng): Question {
  const [name, n] = r.pick(REGULAR);
  const step = 360 / n;
  const good = step * r.int(1, n - 1);
  const wrong = [step / 2 + step * r.int(0, n - 2), good + 15, good - 20, 100].filter((w) => w > 0 && w % step !== 0 && w < 360);
  if (r.chance(0.5)) return choiceQ(r, `¿Qué giro alrededor de su centro lleva ${name} sobre sí mismo?`, `${good}°`, [...new Set(wrong)].map((w) => `${w}°`), `Los giros que funcionan son múltiplos de 360° ÷ ${n} = ${step}°.`, undefined, "giro");
  return numQ(n, `¿Cuántas reflexiones distintas (ejes de simetría) llevan ${name} sobre sí mismo?`, undefined, `Un polígono regular de ${n} lados tiene ${n} ejes de simetría.`, "reflexiones");
}

// I.3: dilataciones: longitud, perímetro y área.
export function dilationMeasures(r: Rng): Question {
  const k = r.pick([2, 3, 0.5, 1.5]), base = r.int(2, 12) * 2;
  const form = r.int(0, 2);
  if (form === 0) return valQ(r, `Un segmento de ${base} cm se dilata con factor de escala ${dec(k)}. ¿Cuánto mide su imagen, en cm?`, base * k, [base + k, base / k, base * k * k], `La longitud se multiplica por el factor: ${base} × ${dec(k)} = ${dec(base * k)}.`, undefined, "longitud");
  if (form === 1) return valQ(r, `Un polígono de ${base} cm de perímetro se dilata con factor ${dec(k)}. ¿Cuál es el perímetro de la imagen, en cm?`, base * k, [base * k * k, base + k, base / k], `El perímetro se multiplica por el factor: ${base} × ${dec(k)} = ${dec(base * k)}.`, undefined, "perimetro");
  return valQ(r, `Una figura de ${base} cm² de área se dilata con factor ${dec(k)}. ¿Cuál es el área de la imagen, en cm²?`, base * k * k, [base * k, base + k * k, base * 2 * k], `El área se multiplica por el factor al cuadrado: ${base} × ${dec(k * k)} = ${dec(base * k * k)}.`, undefined, "area");
}

// I.6: hallar el factor de escala y el centro de una dilatación.
export function dilationCenter(r: Rng): Question {
  const C = { x: r.int(-3, 1), y: r.int(-3, 1) }, k = r.pick([2, 3]);
  const A = tri(r).map((p) => ({ x: C.x + Math.round((p.x + 3) / 2), y: C.y + Math.round((p.y + 3) / 2) }));
  const B = A.map((p) => ({ x: C.x + k * (p.x - C.x), y: C.y + k * (p.y - C.y) }));
  if (B.some((p) => Math.abs(p.x) > 8 || Math.abs(p.y) > 8) || A.some((p, i) => A.findIndex((q) => q.x === p.x && q.y === p.y) !== i)) return dilationCenter(r);
  if (r.chance(0.5)) return pointQ(r, "B es una dilatación de A. ¿Cuál es el centro de la dilatación? (Prolonga las rectas que unen vértices correspondientes.)", C, `Las rectas que unen cada vértice con su imagen se cortan en ${pt(C)}.`, plane(A, B), "centro", [{ x: 0, y: 0 }]);
  return numQ(k, `B es una dilatación de A con centro en ${pt(C)}. ¿Cuál es el factor de escala?`, plane(A, B, [C]), `Cada vértice de B está ${k} veces más lejos del centro que el de A.`, "factor");
}

const DIL_FACTS: [string, boolean, string][] = [
  ["Una dilatación lleva una recta que no pasa por el centro a una recta paralela.", true, "La imagen de una recta que no pasa por el centro es paralela a ella."],
  ["Una dilatación lleva una recta que pasa por el centro a la misma recta.", true, "Los puntos se alejan o acercan sobre la misma recta."],
  ["Una dilatación conserva las medidas de los ángulos.", true, "Las figuras dilatadas son semejantes: los ángulos no cambian."],
  ["Una dilatación de factor 2 conserva las longitudes de los segmentos.", false, "Las longitudes se multiplican por 2."],
  ["Una dilatación lleva una recta a una recta perpendicular.", false, "La imagen es paralela (o la misma recta), no perpendicular."],
];
// I.7: dilataciones y rectas paralelas.
export function dilationParallel(r: Rng): Question {
  const [t, ok, why] = r.pick(DIL_FACTS);
  return fixedQ(`¿Es verdadera o falsa? ${t}`, ["Verdadera", "Falsa"], ok ? "Verdadera" : "Falsa", why, undefined, ok ? "verdadera" : "falsa");
}

// ---------------------------------------------------------------------------
// Congruencia

// K.2: resolver problemas con partes correspondientes.
export function correspondingX(r: Rng): Question {
  const x = r.int(3, 12), a = r.int(2, 5), b = r.int(1, 10) * r.pick([1, -1]), angle = r.chance(0.5);
  const val = a * x + b;
  if (val <= 0 || (angle && val >= 170)) return correspondingX(r);
  return numQ(x, `△ABC ≅ △DEF. ${angle ? `m∠B = ${val}° y m∠E = (${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})°` : `AB = ${val} cm y DE = (${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) cm`}. ¿Cuánto vale x?`.replace(" + 0)", ")"), undefined, `${angle ? "∠B y ∠E" : "AB y DE"} son partes correspondientes: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${val} → x = ${x}.`, angle ? "angulo" : "lado");
}

const CRITERIA = ["LLL", "LAL", "ALA", "AAL", "HL", "No se puede asegurar"];
const CRIT_CASES: [string, number, string][] = [
  ["AB ≅ DE, BC ≅ EF y AC ≅ DF", 0, "Tres pares de lados congruentes."],
  ["AB ≅ DE, ∠B ≅ ∠E y BC ≅ EF", 1, "Dos lados y el ángulo comprendido entre ellos."],
  ["∠A ≅ ∠D, AB ≅ DE y ∠B ≅ ∠E", 2, "Dos ángulos y el lado comprendido entre ellos."],
  ["∠A ≅ ∠D, ∠B ≅ ∠E y BC ≅ EF", 3, "Dos ángulos y un lado no comprendido."],
  ["∠C y ∠F son rectos, AB ≅ DE (hipotenusas) y BC ≅ EF (catetos)", 4, "Triángulos rectángulos con hipotenusa y un cateto congruentes."],
  ["∠A ≅ ∠D, ∠B ≅ ∠E y ∠C ≅ ∠F", 5, "Tres ángulos iguales no garantizan el mismo tamaño (AAA solo da semejanza)."],
  ["AB ≅ DE, BC ≅ EF y ∠A ≅ ∠D", 5, "Dos lados y un ángulo no comprendido (LLA) no garantizan congruencia."],
];
// L.2-L.8: criterios de congruencia de triángulos.
export function congruenceCriterion(r: Rng, allowed: number[]): Question {
  // «No se puede asegurar» sale una de cada cuatro veces.
  const none = r.chance(0.25);
  const cases = CRIT_CASES.filter((c) => (none ? c[1] === 5 : allowed.includes(c[1])));
  const [given, k, why] = r.pick(cases);
  const opts = [...new Set([...allowed.map((i) => CRITERIA[i]), CRITERIA[5]])];
  return fixedQ(`En △ABC y △DEF se sabe que ${given}. ¿Qué criterio prueba que △ABC ≅ △DEF?`, opts, CRITERIA[k], why, undefined, CRITERIA[k]);
}

// L.7: criterio LLL en el plano de coordenadas.
export function sssCoordinates(r: Rng): Question {
  const A = tri(r);
  const yes = r.chance(0.5);
  const dx = r.int(-4, 4), dy = r.pick([-4, 4]);
  // B es la reflexión de A respecto de un eje vertical, trasladada (congruente si no se altera).
  let B = A.map((p) => ({ x: -p.x + dx, y: p.y + dy }));
  if (!yes) B = B.map((p, i) => (i === 0 ? { x: p.x + 1, y: p.y } : p));
  const len = (p: P, q: P) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
  const sides = (T: P[]) => [len(T[0], T[1]), len(T[1], T[2]), len(T[2], T[0])];
  const sa = sides(A), sb = sides(B);
  const same = sa.every((v, i) => v === sb[i]);
  return yesNo("¿Los triángulos A y B son congruentes por LLL? (Compara las longitudes de los lados.)", same, `Lados de A: ${sa.map((v) => `√${v}`).join(", ")}; lados de B: ${sb.map((v) => `√${v}`).join(", ")}.`, plane(A, B), same ? "si" : "no");
}

// L.10: congruencia en triángulos isósceles y equiláteros.
export function isoscelesAngles(r: Rng): Question {
  const form = r.int(0, 2);
  if (form === 0) {
    const vertex = r.int(20, 140);
    if (vertex % 2) return isoscelesAngles(r);
    return numQ((180 - vertex) / 2, `En un triángulo isósceles, el ángulo entre los lados iguales mide ${vertex}°. ¿Cuánto mide cada ángulo de la base?`, undefined, `Los ángulos de la base son iguales: (180° − ${vertex}°) ÷ 2 = ${(180 - vertex) / 2}°.`, "base");
  }
  if (form === 1) {
    const base = r.int(20, 85);
    return numQ(180 - 2 * base, `En un triángulo isósceles, cada ángulo de la base mide ${base}°. ¿Cuánto mide el ángulo del vértice?`, undefined, `180° − 2 × ${base}° = ${180 - 2 * base}°.`, "vertice");
  }
  const x = r.int(5, 20), a = r.int(2, 4);
  if (60 - a * x === 0) return isoscelesAngles(r);
  return numQ(x, `El triángulo ABC es equilátero y m∠A = (${a}x ${60 - a * x < 0 ? "−" : "+"} ${Math.abs(60 - a * x)})°. ¿Cuánto vale x?`.replace(" + 0)", ")"), undefined, `En un triángulo equilátero cada ángulo mide 60°: ${a}x ${60 - a * x < 0 ? "−" : "+"} ${Math.abs(60 - a * x)} = 60 → x = ${x}.`, "equilatero");
}

// ---------------------------------------------------------------------------
// Semejanza

// M.2: enunciados de semejanza.
export function similarityStatement(r: Rng): Question {
  const [t1, t2] = r.shuffle(["ABC", "DEF", "PQR", "XYZ", "JKL", "MNO"]).slice(0, 2);
  const perm = r.shuffle([0, 1, 2]);
  const corr = perm.map((i) => t2[i]).join("");
  const good = `△${t1} ∼ △${corr}`;
  const wrong = [`△${t1} ∼ △${[...corr].reverse().join("")}`, `△${t1} ∼ △${corr[1]}${corr[0]}${corr[2]}`, `△${t1} ∼ △${corr[0]}${corr[2]}${corr[1]}`].filter((w) => w !== good);
  return choiceQ(r, `En dos triángulos semejantes, ∠${t1[0]} ≅ ∠${corr[0]}, ∠${t1[1]} ≅ ∠${corr[1]} y ∠${t1[2]} ≅ ∠${corr[2]}. ¿Qué enunciado de semejanza es correcto?`, good, [...new Set(wrong)], "Los vértices correspondientes deben ir en el mismo orden.", undefined, "enunciado");
}

// M.6 / M.14: perímetros y áreas de figuras semejantes.
export function similarPerimeterArea(r: Rng, area: boolean): Question {
  const a = r.int(2, 6), b = a * r.pick([2, 3]);
  const k = b / a;
  const p = r.int(4, 30);
  if (area) {
    if (r.chance(0.5)) return numQ(p * k * k, `Dos figuras semejantes tienen lados correspondientes de ${a} cm y ${b} cm. El área de la pequeña es ${p} cm². ¿Cuál es el área de la grande, en cm²?`, undefined, `Razón de semejanza ${k}; las áreas se multiplican por ${k}² = ${k * k}: ${p} × ${k * k} = ${p * k * k}.`, "area");
    return choiceQ(r, `Dos figuras semejantes tienen lados correspondientes en razón ${a} : ${b}. ¿En qué razón están sus áreas?`, `${a * a} : ${b * b}`, [`${a} : ${b}`, `${a * 2} : ${b * 2}`, `${a ** 3} : ${b ** 3}`], "Las áreas están en la razón de los cuadrados de los lados.", undefined, "razon-areas");
  }
  return numQ(p * k, `Dos figuras semejantes tienen lados correspondientes de ${a} cm y ${b} cm. El perímetro de la pequeña es ${p} cm. ¿Cuál es el perímetro de la grande, en cm?`, undefined, `Los perímetros están en la misma razón que los lados: ${p} × ${k} = ${p * k}.`, "perimetro");
}

const SIM_RULES = ["AA", "LLL de semejanza", "LAL de semejanza", "No son semejantes"];
// M.8: criterios de semejanza de triángulos.
export function similarityRule(r: Rng): Question {
  const k = r.pick([2, 3, 1.5]);
  const [a, b, c] = r.pick([[3, 4, 5], [4, 6, 8], [2, 5, 6], [5, 7, 9]]);
  const form = r.int(0, 3);
  const L = (n: number) => dec(n);
  const cases: [string, number, string][] = [
    [`∠A = 50°, ∠B = 70° en △ABC y ∠D = 50°, ∠E = 70° en △DEF`, 0, "Dos ángulos congruentes bastan."],
    [`△ABC tiene lados ${a}, ${b}, ${c} y △DEF tiene lados ${L(a * k)}, ${L(b * k)}, ${L(c * k)}`, 1, `Los tres lados son proporcionales (razón ${L(k)}).`],
    [`AB = ${a}, AC = ${b}, ∠A = 40°; DE = ${L(a * k)}, DF = ${L(b * k)}, ∠D = 40°`, 2, "Dos lados proporcionales y el ángulo comprendido congruente."],
    [`△ABC tiene lados ${a}, ${b}, ${c} y △DEF tiene lados ${L(a * k)}, ${L(b * k)}, ${L(c * k + 1)}`, 3, "Los lados no son proporcionales."],
  ];
  const [given, kk, why] = cases[form];
  return fixedQ(`${given}. ¿Por qué criterio son semejantes?`, SIM_RULES, SIM_RULES[kk], why, undefined, SIM_RULES[kk]);
}

// M.11: semejanza de circunferencias.
export function similarCircles(r: Rng): Question {
  const r1 = r.int(2, 9), r2 = r1 * r.int(2, 4);
  if (r.chance(0.4)) return fixedQ("¿Todas las circunferencias son semejantes?", ["Sí, siempre", "Solo si tienen el mismo centro", "No, nunca"], "Sí, siempre", "Una traslación lleva un centro al otro y una dilatación de factor r₂ ÷ r₁ ajusta el tamaño.", undefined, "siempre");
  return numQ(r2 / r1, `Una circunferencia de radio ${r1} cm se transforma en otra de radio ${r2} cm con una traslación y una dilatación. ¿Cuál es el factor de escala?`, undefined, `${r2} ÷ ${r1} = ${r2 / r1}.`, "factor");
}

// M.13: semejanza y alturas en triángulos rectángulos (media geométrica).
export function rightAltitude(r: Rng): Question {
  const [p, q] = r.pick([[4, 9], [1, 4], [4, 16], [9, 16], [2, 8], [3, 12], [1, 9], [4, 25]]);
  const h = Math.sqrt(p * q);
  const form = r.int(0, 1);
  if (form === 0) return numQ(h, `En un triángulo rectángulo, la altura sobre la hipotenusa la divide en segmentos de ${p} y ${q}. ¿Cuánto mide la altura?`, undefined, `La altura es media geométrica de los segmentos: h = √(${p} × ${q}) = √${p * q} = ${h}.`, "altura");
  const c = p + q, leg = Math.sqrt(p * c);
  if (!Number.isInteger(leg)) return numQ(h, `En un triángulo rectángulo, la altura sobre la hipotenusa la divide en segmentos de ${p} y ${q}. ¿Cuánto mide la altura?`, undefined, `h = √(${p} × ${q}) = ${h}.`, "altura");
  return numQ(leg, `En un triángulo rectángulo, la altura sobre la hipotenusa la divide en segmentos de ${p} y ${q}. ¿Cuánto mide el cateto que está junto al segmento de ${p}?`, undefined, `Cada cateto es media geométrica de la hipotenusa (${c}) y su proyección (${p}): √(${p} × ${c}) = ${leg}.`, "cateto");
}

// ---------------------------------------------------------------------------
// Propiedades de triángulos

// N.1: segmentos medios de triángulos.
export function midsegment(r: Rng): Question {
  const base = r.int(4, 20) * 2;
  if (r.chance(0.5)) return numQ(base / 2, `D y E son los puntos medios de AB y AC en △ABC. Si BC = ${base}, ¿cuánto mide DE?`, undefined, `El segmento medio es paralelo al tercer lado y mide la mitad: ${base} ÷ 2 = ${base / 2}.`, "mitad");
  const x = r.int(2, 9), a = r.int(2, 4), b = r.int(1, 6);
  return numQ(x, `D y E son los puntos medios de AB y AC. DE = ${a}x + ${b} y BC = ${2 * (a * x + b)}. ¿Cuánto vale x?`, undefined, `DE = BC ÷ 2 = ${a * x + b} → ${a}x + ${b} = ${a * x + b} → x = ${x}.`, "ecuacion");
}

// N.2: triángulos y bisectrices (mediatrices y bisectrices de ángulos).
export function bisectorTheorems(r: Rng): Question {
  const x = r.int(2, 9), a = r.int(2, 5), c = r.int(1, a - 1), b = r.int(1, 8);
  const d = (a - c) * x + b;
  const angle = r.chance(0.5);
  return numQ(x, angle ? `P está en la bisectriz de ∠ABC. La distancia de P a BA es ${a}x + ${b} y la distancia de P a BC es ${c === 1 ? "" : c}x + ${d}. ¿Cuánto vale x?` : `P está en la mediatriz de AB. PA = ${a}x + ${b} y PB = ${c === 1 ? "" : c}x + ${d}. ¿Cuánto vale x?`, undefined, angle ? "Un punto de la bisectriz equidista de los lados del ángulo: se igualan las distancias." : "Un punto de la mediatriz equidista de los extremos: PA = PB.", angle ? "bisectriz" : "mediatriz");
}

const SEGMENTS: [string, string][] = [
  ["Mediana", "Une un vértice con el punto medio del lado opuesto."],
  ["Altura", "Va de un vértice al lado opuesto (o su prolongación) y es perpendicular a él."],
  ["Bisectriz", "Divide un ángulo del triángulo en dos ángulos congruentes."],
  ["Mediatriz", "Es perpendicular a un lado y pasa por su punto medio."],
];
const CENTERS: [string, string][] = [["Baricentro", "las medianas"], ["Ortocentro", "las alturas"], ["Incentro", "las bisectrices"], ["Circuncentro", "las mediatrices"]];
// N.3 / N.6 / N.7: medianas, alturas, bisectrices, mediatrices y sus puntos notables.
export function triangleSegments(r: Rng, centers = false): Question {
  if (centers) {
    const [c, lines] = r.pick(CENTERS);
    if (r.chance(0.5)) return fixedQ(`¿Cómo se llama el punto donde se cortan ${lines} de un triángulo?`, CENTERS.map((x) => x[0]), c, `${lines[0].toUpperCase()}${lines.slice(1)} se cortan en el ${c.toLowerCase()}.`, undefined, c);
    const props: Record<string, string> = { Baricentro: "Es el centro de gravedad: divide cada mediana en razón 2 : 1", Ortocentro: "Puede quedar fuera del triángulo si este es obtusángulo", Incentro: "Equidista de los tres lados: es el centro de la circunferencia inscrita", Circuncentro: "Equidista de los tres vértices: es el centro de la circunferencia circunscrita" };
    return choiceQ(r, `¿Qué propiedad tiene el ${c.toLowerCase()} de un triángulo?`, props[c], Object.entries(props).filter(([k]) => k !== c).map(([, v]) => v), `${c}: ${props[c].toLowerCase()}.`, undefined, c);
  }
  const [name, def] = r.pick(SEGMENTS);
  return fixedQ(`¿Cómo se llama el segmento que cumple esto? ${def}`, SEGMENTS.map((s) => s[0]), name, def, undefined, name);
}

// N.4: relaciones entre ángulos y lados de un triángulo.
export function angleSide(r: Rng): Question {
  const angles = r.shuffle([r.int(30, 50), r.int(55, 75), 0]);
  const zero = angles.indexOf(0);
  angles[zero] = 180 - angles.reduce((s, x) => s + x, 0);
  if (new Set(angles).size < 3) return angleSide(r);
  const names = ["A", "B", "C"], opp = ["BC", "AC", "AB"];
  const big = r.chance(0.5);
  const idx = angles.indexOf(big ? Math.max(...angles) : Math.min(...angles));
  return fixedQ(`En △ABC, m∠A = ${angles[0]}°, m∠B = ${angles[1]}° y m∠C = ${angles[2]}°. ¿Cuál es el lado ${big ? "más largo" : "más corto"}?`, opp, opp[idx], `El lado ${big ? "más largo" : "más corto"} está opuesto al ángulo ${big ? "mayor" : "menor"} (∠${names[idx]}).`, undefined, big ? "mayor" : "menor");
}

// N.8: hallar el baricentro de un triángulo.
export function centroid(r: Rng): Question {
  const G = { x: r.int(-4, 4), y: r.int(-4, 4) };
  const A = { x: G.x + r.int(-3, 3), y: G.y + r.int(-3, 3) }, B = { x: G.x + r.int(-3, 3), y: G.y + r.int(-3, 3) };
  const C = { x: 3 * G.x - A.x - B.x, y: 3 * G.y - A.y - B.y };
  if ((B.x - A.x) * (C.y - A.y) === (C.x - A.x) * (B.y - A.y)) return centroid(r);
  return pointQ(r, `¿Cuáles son las coordenadas del baricentro del triángulo de vértices ${pt(A)}, ${pt(B)} y ${pt(C)}?`, G, `Se promedian las coordenadas: ((${sg(A.x)} + ${par(B.x)} + ${par(C.x)}) ÷ 3, (${sg(A.y)} + ${par(B.y)} + ${par(C.y)}) ÷ 3) = ${pt(G)}.`, undefined, "baricentro");
}

// ---------------------------------------------------------------------------
// Cuadriláteros

// O.6-O.12: propiedades de paralelogramos, rombos, rectángulos, trapecios y cometas.
export function quadProperty(r: Rng, kind: "parallelogram" | "rhombus" | "rectangle" | "trapezoid" | "kite" | "mixed"): Question {
  const k = kind === "mixed" ? r.pick(["parallelogram", "rhombus", "rectangle", "trapezoid", "kite"] as const) : kind;
  const x = r.int(3, 12);
  if (k === "parallelogram") {
    if (r.chance(0.5)) {
      const a = r.int(2, 6), b = r.int(5, 40);
      const angle = a * x + b;
      if (angle >= 170) return quadProperty(r, kind);
      return numQ(180 - angle, `En el paralelogramo ABCD, m∠A = (${a}x + ${b})° y x = ${x}. ¿Cuánto mide ∠B?`, undefined, `m∠A = ${angle}°; los ángulos consecutivos suman 180°: m∠B = ${180 - angle}°.`, "angulos");
    }
    const a = r.int(2, 5), c = r.int(1, a - 1), b = r.int(1, 9);
    return numQ(x, `En el paralelogramo ABCD, las diagonales se cortan en E. AE = ${a}x + ${b} y EC = ${c === 1 ? "" : c}x + ${(a - c) * x + b}. ¿Cuánto vale x?`, undefined, "Las diagonales de un paralelogramo se bisecan: AE = EC.", "diagonales");
  }
  if (k === "rhombus") {
    if (r.chance(0.5)) {
      const ang = r.int(20, 70);
      return numQ(90 - ang, `En el rombo ABCD, las diagonales se cortan en E y m∠EAB = ${ang}°. ¿Cuánto mide ∠ABE?`, undefined, `Las diagonales de un rombo son perpendiculares: m∠AEB = 90°, así que m∠ABE = 90° − ${ang}° = ${90 - ang}°.`, "perpendiculares");
    }
    const a = r.int(2, 5), b = r.int(1, 9);
    return numQ(4 * (a * x + b), `Un lado de un rombo mide ${a}x + ${b} y x = ${x}. ¿Cuál es su perímetro?`, undefined, `Los cuatro lados del rombo son iguales: 4 × ${a * x + b} = ${4 * (a * x + b)}.`, "lados");
  }
  if (k === "rectangle") {
    const a = r.int(2, 5), c = r.int(1, a - 1), b = r.int(1, 9);
    return numQ(x, `En el rectángulo ABCD, AC = ${a}x + ${b} y BD = ${c === 1 ? "" : c}x + ${(a - c) * x + b}. ¿Cuánto vale x?`, undefined, "Las diagonales de un rectángulo son congruentes: AC = BD.", "diagonales");
  }
  if (k === "trapezoid") {
    if (r.chance(0.5)) {
      const b1 = r.int(4, 20), b2 = b1 + 2 * r.int(1, 8);
      return numQ((b1 + b2) / 2, `Un trapecio tiene bases de ${b1} cm y ${b2} cm. ¿Cuánto mide su paralela media (segmento que une los puntos medios de los lados no paralelos)?`, undefined, `Es el promedio de las bases: (${b1} + ${b2}) ÷ 2 = ${(b1 + b2) / 2}.`, "paralela-media");
    }
    const ang = r.int(40, 80);
    return numQ(180 - ang, `En un trapecio isósceles, un ángulo de la base mayor mide ${ang}°. ¿Cuánto mide cada ángulo de la base menor?`, undefined, `Los ángulos de un mismo lado no paralelo suman 180°: 180° − ${ang}° = ${180 - ang}°.`, "isosceles");
  }
  const a = r.int(60, 130), b = r.int(40, 100);
  if (a + b >= 330 || (360 - a - b) % 2) return quadProperty(r, kind);
  return numQ((360 - a - b) / 2, `En la cometa ABCD (AB = AD y CB = CD), m∠A = ${a}° y m∠C = ${b}°. ¿Cuánto mide ∠B?`, undefined, `En una cometa, los ángulos entre los lados distintos (∠B y ∠D) son iguales: (360° − ${a}° − ${b}°) ÷ 2 = ${(360 - a - b) / 2}°.`, "cometa");
}

const PARALLELOGRAM_TESTS: [string, boolean][] = [
  ["Los dos pares de lados opuestos son paralelos.", true],
  ["Los dos pares de lados opuestos son congruentes.", true],
  ["Los dos pares de ángulos opuestos son congruentes.", true],
  ["Las diagonales se bisecan.", true],
  ["Un par de lados opuestos es paralelo y congruente.", true],
  ["Un par de lados opuestos es paralelo y el otro par es congruente.", false],
  ["Las diagonales son perpendiculares.", false],
  ["Dos lados consecutivos son congruentes.", false],
];
// O.7: probar que un cuadrilátero es un paralelogramo.
export function provingParallelogram(r: Rng): Question {
  const [t, ok] = r.pick(PARALLELOGRAM_TESTS);
  return yesNo(`¿Basta esta condición para asegurar que un cuadrilátero es un paralelogramo? ${t}`, ok, ok ? "Sí: es uno de los criterios de paralelogramo." : "No: hay cuadriláteros que lo cumplen sin ser paralelogramos (por ejemplo, un trapecio isósceles o una cometa).", undefined, ok ? "si" : "no");
}

// O.13: clasificar figuras en el plano de coordenadas (justificando con pendientes y longitudes).
export function classifyOnPlane(r: Rng): Question {
  const kind = r.int(0, 3);
  const a = r.int(2, 4), b = r.int(1, 3);
  const O = { x: r.int(-5, -1), y: r.int(-5, -1) };
  const shapes: [P[], string, string][] = [
    [[O, { x: O.x + a, y: O.y }, { x: O.x + a, y: O.y + a }, { x: O.x, y: O.y + a }], "Cuadrado", "Lados iguales y ángulos rectos."],
    [[O, { x: O.x + a + b, y: O.y }, { x: O.x + a + b, y: O.y + a }, { x: O.x, y: O.y + a }], "Rectángulo", "Ángulos rectos (pendientes perpendiculares) y lados opuestos iguales, pero no todos iguales."],
    [[O, { x: O.x + a, y: O.y + b }, { x: O.x + 2 * a, y: O.y }, { x: O.x + a, y: O.y - b }], "Rombo", "Cuatro lados iguales y diagonales perpendiculares, pero sin ángulos rectos."],
    [[O, { x: O.x + a + b, y: O.y }, { x: O.x + a + 2 * b, y: O.y + a }, { x: O.x + b, y: O.y + a }], "Paralelogramo", "Lados opuestos paralelos (misma pendiente), sin ángulos rectos ni lados iguales."],
  ];
  const [pts, name, why] = shapes[kind];
  if (kind === 2 && a === b) return classifyOnPlane(r);
  return fixedQ(`El cuadrilátero tiene vértices ${pts.map(pt).join(", ")}. ¿Cuál es el nombre más específico?`, ["Cuadrado", "Rectángulo", "Rombo", "Paralelogramo"], name, why, { kind: "coordPlane", min: -8, max: 8, points: [], shapes: [{ points: pts }] }, name);
}

