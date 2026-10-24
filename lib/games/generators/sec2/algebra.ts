import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, intQ, lcm, numQ, par, sg, table, yesNo } from "../kit";
import { lin, nz, plane, pointQ, snorm } from "../sec1/util";
import { type P, dec, lineEnds, lineEqQ, linesPlane, pt, slopeIntercept, slopeQ, slopeText, sqrtText, verticalLine } from "./util";

// Álgebra de 2.° de secundaria: expresiones con raíces y fracciones, ecuaciones
// con la incógnita en ambos lados, inecuaciones de varios pasos, variación
// directa, ecuaciones de la recta, funciones y sistemas de ecuaciones.

// ---------------------------------------------------------------------------
// Expresiones

// K.8: evaluar expresiones con raíces.
export function evaluateRadical(r: Rng): Question {
  const root = r.int(2, 9);
  const form = r.int(0, 2);
  if (form === 0) {
    const c = nz(r, 9), x = root * root - c;
    return intQ(r, `Calcula el valor de la expresión cuando x = ${sg(x)}.`, root, `x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${root * root} y ${sqrtText(root * root)} = ${root}.`, `√(x ${c < 0 ? "−" : "+"} ${Math.abs(c)})`, "suma", [-root, root * root]);
  }
  if (form === 1) {
    const k = r.int(2, 5), b = r.int(1, 12), x = root * root;
    return intQ(r, `Calcula el valor de la expresión cuando x = ${x}.`, k * root - b, `${sqrtText(x)} = ${root}; ${k} × ${root} − ${b} = ${sg(k * root - b)}.`, `${k}√x − ${b}`, "coeficiente", [k * x - b, k * root + b]);
  }
  const k = r.pick([2, 3, 5]), x = k * root * root;
  return numQ(k * root, `Calcula el valor de la expresión cuando x = ${x}.`, `√(${k}x)`, `${k} × ${x} = ${k * x} y ${sqrtText(k * x)} = ${k * root}.`, "producto");
}

// K.9: evaluar expresiones racionales (con fracción algebraica).
export function evaluateRationalExpr(r: Rng): Question {
  const x = r.int(-6, 9), c = r.int(-5, 5);
  const den = x + c;
  if (den === 0 || c === 0) return evaluateRationalExpr(r);
  const q = nz(r, 6), a = r.int(1, 4);
  const b = q * den - a * x;
  const num = lin(a, b);
  return intQ(r, `Calcula el valor de la expresión cuando x = ${sg(x)}.`, q, `Numerador: ${a === 1 ? "" : `${a} × `}${par(x)}${b === 0 ? "" : ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}`} = ${sg(q * den)}. Denominador: ${sg(x)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${sg(den)}. ${sg(q * den)} ÷ ${par(den)} = ${sg(q)}.`, `(${num}) / (x ${c < 0 ? "−" : "+"} ${Math.abs(c)})`, "cociente", [q * den, -q]);
}

// ---------------------------------------------------------------------------
// Ecuaciones de una variable

const PROPS = ["Propiedad de la suma", "Propiedad de la resta", "Propiedad de la multiplicación", "Propiedad de la división"];
// M.5: propiedades de la igualdad.
export function equalityProperty(r: Rng): Question {
  const x = r.int(2, 15), k = r.int(2, 9);
  const cases: [string, string, number, string][] = [
    [`x − ${k} = ${sg(x - k)}`, `x = ${x}`, 0, `Se sumó ${k} en los dos lados.`],
    [`x + ${k} = ${x + k}`, `x = ${x}`, 1, `Se restó ${k} en los dos lados.`],
    [`x/${k} = ${x}`, `x = ${x * k}`, 2, `Se multiplicaron los dos lados por ${k}.`],
    [`${k}x = ${k * x}`, `x = ${x}`, 3, `Se dividieron los dos lados entre ${k}.`],
  ];
  const [from, to, i, why] = r.pick(cases);
  return fixedQ("¿Qué propiedad de la igualdad se usó para pasar de la primera ecuación a la segunda?", PROPS, PROPS[i], `${why} Una igualdad se mantiene si se hace lo mismo en ambos lados.`, `${from}\n${to}`, ["suma", "resta", "multiplicacion", "division"][i]);
}

// M.6: identificar ecuaciones equivalentes (con la misma solución).
export function equivalentEquations(r: Rng): Question {
  const a = r.int(2, 6), x = r.int(1, 9), b = r.int(1, 12);
  const c = a * x + b;
  const shown = `${a}x + ${b} = ${c}`;
  const good = r.pick([`${a}x = ${c - b}`, `${2 * a}x + ${2 * b} = ${2 * c}`, `${a}x + ${b + 3} = ${c + 3}`]);
  const wrong = [`${a}x = ${c + b}`, `x + ${b} = ${c - a}`, `${2 * a}x + ${b} = ${2 * c}`, `${a}x + ${b + 3} = ${c}`, `x = ${c - b - a}`].filter((w) => w !== good);
  return choiceQ(r, `¿Qué ecuación es equivalente a ${shown}?`, good, wrong, `Es equivalente si se obtiene haciendo lo mismo en los dos lados; las dos ecuaciones tienen la solución x = ${x}.`, undefined, "equivalente");
}

const side = (a: number, b: number) => lin(a, b);
// Término con x: 1 → "x", −1 → "−x", 2,5 → "2,5x".
const cx = (k: number) => `${k === 1 ? "" : k === -1 ? "−" : dec(k)}x`;
// «Se resta 3x y se suma 5 en los dos lados».
const moveBoth = (c: number, b: number) => `Se ${c < 0 ? `suma ${cx(-c)}` : `resta ${cx(c)}`} y se ${b < 0 ? `suma ${dec(-b)}` : `resta ${dec(b)}`} en los dos lados`;
const distText = (k: number, b: number) => `${k === -1 ? "−" : sg(k)}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`;

// M.12-M.14: ecuaciones con la incógnita en ambos lados.
export function bothSides(r: Rng, kind: "integers" | "fractional" | "word"): Question {
  if (kind === "fractional") {
    const [d1, d2] = r.pick([[2, 4], [3, 6], [2, 3], [4, 2], [5, 10], [3, 2]]);
    const n1 = r.pick([1, 3].filter((n) => n % d1 !== 0)), n2 = 1;
    const L = lcm(d1, d2), x = L * r.int(-3, 4) || L;
    const b = r.int(-9, 9), d = (n1 * x) / d1 + b - (n2 * x) / d2;
    if (n1 * d2 === n2 * d1) return bothSides(r, kind);
    const f = (n: number, dd: number) => (n === 1 ? `x/${dd}` : `(${n}/${dd})x`);
    const eq = `${f(n1, d1)}${b === 0 ? "" : ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}`} = ${f(n2, d2)}${d === 0 ? "" : ` ${d < 0 ? "−" : "+"} ${Math.abs(d)}`}`;
    return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", x, `Se multiplican ambos lados por ${L} para quitar los denominadores y se agrupan las x en un lado: x = ${sg(x)}.`, eq, "fracciones", [-x, x + L]);
  }
  if (kind === "word") {
    const n = r.int(3, 12), c1 = r.int(5, 12), c2 = c1 + r.int(2, 8), f1 = r.int(20, 60);
    // f1 + c2·n = f2 + c1·n  →  f2 = f1 + (c2 − c1)·n
    const f2 = f1 + (c2 - c1) * n;
    return numQ(n, `El gimnasio A cobra ${f1} soles de inscripción y ${c2} soles por mes. El gimnasio B cobra ${f2} soles de inscripción y ${c1} soles por mes. ¿Después de cuántos meses el costo total es el mismo en los dos?`, undefined, `${f1} + ${c2}x = ${f2} + ${c1}x → ${c2 - c1}x = ${f2 - f1} → x = ${n}.`, "problema");
  }
  const x = r.int(-9, 9), a = nz(r, 9);
  let c = nz(r, 9);
  while (c === a) c = nz(r, 9);
  const b = r.int(-15, 15), d = a * x + b - c * x;
  return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", x, `${moveBoth(c, b)}: ${cx(a - c)} = ${sg(d - b)} → x = ${sg(x)}.`, `${side(a, b)} = ${side(c, d)}`, "enteros", [-x, x + 1]);
}

// M.15: ecuaciones con la propiedad distributiva.
export function distributiveEquation(r: Rng): Question {
  const k = r.pick([2, 3, 4, 5, -2, -3]), b = nz(r, 8), x = r.int(-8, 10);
  if (r.chance(0.5)) {
    const c = k * (x + b);
    return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", x, `Se distribuye: ${lin(k, k * b)} = ${sg(c)}. ${k * b < 0 ? `Se suma ${-k * b}` : `Se resta ${k * b}`}: ${sg(k)}x = ${sg(k * x)}; x = ${sg(x)}.`, `${distText(k, b)} = ${sg(c)}`, "un-lado", [-x, x + b]);
  }
  const e = r.int(-10, 10), c = k * (x + b) + e;
  return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", x, `Se distribuye: ${lin(k, k * b + e)} = ${sg(c)}. Luego se despeja x: x = ${sg(x)}.`, `${distText(k, b)}${e === 0 ? "" : ` ${e < 0 ? "−" : "+"} ${Math.abs(e)}`} = ${sg(c)}`, "con-termino", [-x, x - b]);
}

// M.16-M.17: ecuaciones de varios pasos (también con coeficientes fraccionarios).
export function multiStepEquation(r: Rng, fractional = false): Question {
  const x = r.int(-8, 10);
  if (fractional) {
    const d = r.pick([2, 3, 4]), b = nz(r, 6) * d;
    const xx = d * r.int(-3, 4) || d;
    const left = (xx + b) / d;
    const c = r.int(-6, 6), e = left - c * xx;
    if (c === 0) return multiStepEquation(r, fractional);
    return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", xx, `Se multiplican ambos lados por ${d}: x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${d}(${lin(c, e)}). Se distribuye y se despeja: x = ${sg(xx)}.`, `(1/${d})(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${lin(c, e)}`, "fracciones", [-xx, xx + d]);
  }
  const k = r.int(2, 5), b = nz(r, 6), a = r.int(1, 6);
  let c = r.int(-4, 6);
  if (c === k + a) c++;
  const d = k * (x + b) + a * x - c * x;
  return intQ(r, "Resuelve la ecuación. ¿Cuánto vale x?", x, `Se distribuye y se reducen términos: ${lin(k + a, k * b)} = ${lin(c, d)}. Se agrupan las x: ${cx(k + a - c)} = ${sg(d - k * b)}; x = ${sg(x)}.`, `${distText(k, b)} + ${a === 1 ? "" : a}x = ${lin(c, d)}`, "varios-pasos", [-x, x + 1]);
}

const STEPS = ["Aplicar la propiedad distributiva", "Restar el término con x en los dos lados", "Sumar o restar el número en los dos lados", "Dividir los dos lados entre el coeficiente"];
// M.19: completar la solución de una ecuación de varios pasos.
export function completeMultiStep(r: Rng): Question {
  const k = r.int(3, 6), b = r.int(1, 6), c = r.int(2, k - 1), x = r.int(1, 9);
  const d = k * (x + b) - c * x;
  const lines = [`${k}(x + ${b}) = ${lin(c, d)}`, `${lin(k, k * b)} = ${lin(c, d)}`, `${lin(k - c, k * b)} = ${sg(d)}`, `${lin(k - c, 0)} = ${sg(d - k * b)}`, `x = ${x}`];
  const step = r.int(0, 3);
  if (r.chance(0.35)) {
    const missing = [k * b, k - c, d - k * b][Math.min(step, 2)];
    const shownLines = [...lines];
    const target = Math.min(step, 2) + 1;
    shownLines[target] = shownLines[target].replace(missing === k - c ? lin(k - c, 0) : sg(missing), missing === k - c ? "?x" : "?");
    return intQ(r, "Completa el número que falta (?) en la solución.", missing, `${["Se distribuye", "Se resta " + c + "x en los dos lados", "Se resta " + k * b + " en los dos lados"][Math.min(step, 2)]}: ${lines[target]}.`, shownLines.join("\n"), "numero", [-missing, missing + 1]);
  }
  return fixedQ(`¿Qué se hizo para pasar de la línea ${step + 1} a la línea ${step + 2}?`, STEPS, STEPS[step], ["Se multiplicó el " + k + " por cada término del paréntesis.", `Se restó ${c}x en los dos lados para juntar las x.`, `Se restó ${k * b} en los dos lados para dejar solo el término con x.`, `Se dividió entre ${k - c} para dejar sola a x.`][step], lines.slice(0, step + 2).join("\n"), `paso${step + 1}`);
}

const NSOL = ["Una solución", "Ninguna solución", "Infinitas soluciones"];
// M.20: hallar el número de soluciones.
export function numberOfSolutions(r: Rng): Question {
  const k = r.int(2, 5), b = nz(r, 6), kind = r.int(0, 2);
  const left = distText(k, b);
  const right = kind === 0 ? lin(k + r.pick([-1, 1, 2]), k * b) : kind === 1 ? lin(k, k * b + nz(r, 5)) : lin(k, k * b);
  const why = kind === 0 ? `Al distribuir, las x tienen coeficientes distintos: hay una sola solución.` : kind === 1 ? `Al distribuir queda ${lin(k, k * b)} = ${right}: las x se cancelan y queda una igualdad falsa, no hay solución.` : `Al distribuir queda ${lin(k, k * b)} = ${right}: los dos lados son iguales, cualquier número es solución.`;
  return fixedQ("¿Cuántas soluciones tiene la ecuación?", NSOL, NSOL[kind], why, `${left} = ${right}`, ["una", "ninguna", "infinitas"][kind]);
}

// M.21: crear ecuaciones sin solución o con infinitas soluciones.
export function createSolutions(r: Rng): Question {
  const k = r.int(2, 6), b = nz(r, 7);
  const infinite = r.chance(0.5);
  if (r.chance(0.5)) {
    if (infinite) return intQ(r, `¿Qué número debe ir en el recuadro para que la ecuación tenga infinitas soluciones?`, k * b, `${distText(k, b)} = ${lin(k, k * b)}: los dos lados deben ser iguales.`, `${distText(k, b)} = ${k}x + □`, "infinitas", [b, -k * b]);
    return numQ(k, `¿Qué coeficiente debe ir en el recuadro para que la ecuación no tenga solución?`, `${distText(k, b)} = □x ${k * b + 3 < 0 ? "−" : "+"} ${Math.abs(k * b + 3)}`, `Si el coeficiente de x es ${k} en los dos lados, las x se cancelan y queda ${sg(k * b)} = ${sg(k * b + 3)}, que es falso.`, "ninguna");
  }
  const good = infinite ? lin(k, k * b) : lin(k, k * b + r.pick([-2, 1, 3]));
  const wrong = infinite ? [lin(k, b), lin(k + 1, k * b), lin(k, k * b + 1), lin(1, k * b)] : [lin(k, k * b), lin(k + 1, k * b), lin(k - 1, b), lin(1, k * b)];
  return choiceQ(r, `¿Qué expresión completa la ecuación ${distText(k, b)} = ___ para que ${infinite ? "tenga infinitas soluciones" : "no tenga solución"}?`, good, wrong.filter((w) => w !== good), infinite ? `Debe ser igual a ${lin(k, k * b)}.` : `Debe tener ${k}x (para que las x se cancelen) y otro número distinto de ${sg(k * b)}.`, undefined, infinite ? "infinitas" : "ninguna");
}

// ---------------------------------------------------------------------------
// Inecuaciones

type IneqOp = "<" | ">" | "≤" | "≥";
const FLIP: Record<IneqOp, IneqOp> = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
const OPS: IneqOp[] = ["<", ">", "≤", "≥"];
const ineq = (op: IneqOp, n: number) => `x ${op} ${sg(n)}`;
const ineqDec = (op: IneqOp, n: number) => `x ${op} ${dec(n)}`;
const ray = (op: IneqOp, n: number): Visual => ({ kind: "numberLine", min: -10, max: 10, step: 1, labelEvery: 5, marked: n, ray: { closed: op === "≥" || op === "≤", dir: op === ">" || op === "≥" ? "right" : "left" } });

function solveOrGraph(r: Rng, text: string, solution: IneqOp, n: number, why: string, graph: boolean, tag: string): Question {
  if (graph) {
    const yes = r.chance(0.5);
    const drawn = yes ? solution : r.pick(OPS.filter((o) => o !== solution));
    return yesNo(`¿La recta numérica muestra la solución de ${text}?`, yes, why, ray(drawn, n), tag);
  }
  return choiceQ(r, "Resuelve la inecuación.", ineq(solution, n), OPS.filter((o) => o !== solution).map((o) => ineq(o, n)), why, text, tag);
}

// N.8-N.9: inecuaciones de varios pasos (`graph`: comprobar el gráfico).
export function multiStepInequality(r: Rng, graph = false): Question {
  const k = r.pick([2, 3, 4, -2, -3]), b = nz(r, 5), n = r.int(-6, 6), e = r.int(-8, 8);
  const shown = r.pick(OPS);
  const solution: IneqOp = k < 0 ? FLIP[shown] : shown;
  const c = k * (n + b) + e;
  const text = `${distText(k, b)}${e === 0 ? "" : ` ${e < 0 ? "−" : "+"} ${Math.abs(e)}`} ${shown} ${sg(c)}`;
  const why = `Se distribuye: ${lin(k, k * b + e)} ${shown} ${sg(c)}. Se ${k * b + e < 0 ? `suma ${-(k * b + e)}` : `resta ${k * b + e}`}: ${sg(k)}x ${shown} ${sg(k * n)}. Se divide entre ${sg(k)}${k < 0 ? " y se invierte el signo" : ""}: ${ineq(solution, n)}.`;
  return solveOrGraph(r, text, solution, n, why, graph, k < 0 ? "invierte" : "no-invierte");
}

// N.10: inecuaciones de varios pasos: problemas.
export function inequalityWord(r: Rng): Question {
  const name = r.pick(NAMES);
  const form = r.int(0, 2);
  if (form === 0) {
    const have = r.int(60, 150), price = r.int(6, 15), keep = r.int(5, 20);
    const max = Math.floor((have - keep) / price);
    return numQ(max, `${name} tiene ${have} soles y quiere comprar entradas de ${price} soles cada una, pero debe quedarle al menos ${keep} soles para el pasaje. ¿Cuántas entradas puede comprar como máximo?`, undefined, `${have} − ${price}x ≥ ${keep} → ${price}x ≤ ${have - keep} → x ≤ ${dec((have - keep) / price)}. Como x es entero, a lo más ${max}.`, "maximo");
  }
  if (form === 1) {
    const fee = r.int(20, 50), per = r.int(8, 20), goal = r.int(150, 400);
    const min = Math.floor((goal - fee) / per) + 1;
    return numQ(min, `Un auspiciador ya donó ${fee} soles para el viaje de promoción y ${name} gana ${per} soles por cada rifa que vende. ¿Cuántas rifas debe vender como mínimo para reunir más de ${goal} soles en total?`, undefined, `${fee} + ${per}x > ${goal} → ${per}x > ${goal - fee} → x > ${dec((goal - fee) / per)}. El menor entero que cumple es ${min}.`, "minimo");
  }
  const w = r.int(3, 8), limit = r.int(20, 45) * 2;
  return choiceQ(r, `El largo de un rectángulo mide ${w} cm más que su ancho x. Su perímetro no puede pasar de ${limit} cm. ¿Qué inecuación lo representa?`, `2x + 2(x + ${w}) ≤ ${limit}`, [`2x + ${w} ≤ ${limit}`, `2x + 2(x + ${w}) ≥ ${limit}`, `x + (x + ${w}) ≤ ${limit}`, `x(x + ${w}) ≤ ${limit}`], `Perímetro = 2 × ancho + 2 × largo = 2x + 2(x + ${w}). «No puede pasar de» se escribe con ≤.`, undefined, "plantear");
}

// N.11-N.12: inecuaciones con la incógnita en ambos lados (enteros o decimales).
export function bothSidesInequality(r: Rng, decimals = false): Question {
  const n = r.int(-6, 6), a = nz(r, 8);
  let c = nz(r, 8);
  while (c === a) c = nz(r, 8);
  const shown = r.pick(OPS);
  const solution: IneqOp = a - c < 0 ? FLIP[shown] : shown;
  if (decimals) {
    const A = a * 0.5, C = c * 0.5, b = r.int(-20, 20) / 2;
    const d = A * n + b - C * n;
    const t = (k: number, m: number) => `${k === 1 ? "" : k === -1 ? "−" : dec(k)}x${m === 0 ? "" : ` ${m < 0 ? "−" : "+"} ${dec(Math.abs(m))}`}`;
    const text = `${t(A, b)} ${shown} ${t(C, d)}`;
    const why = `${moveBoth(C, b)}: ${cx(A - C)} ${shown} ${dec(d - b)}. ${A - C === 1 ? "" : `Se divide entre ${dec(A - C)}${A - C < 0 ? " y se invierte el signo" : ""}: `}${ineq(solution, n)}.`;
    return choiceQ(r, "Resuelve la inecuación.", ineqDec(solution, n), OPS.filter((o) => o !== solution).map((o) => ineqDec(o, n)), why, text, a - c < 0 ? "invierte" : "no-invierte");
  }
  const b = r.int(-12, 12), d = a * n + b - c * n;
  const text = `${lin(a, b)} ${shown} ${lin(c, d)}`;
  const why = `${moveBoth(c, b)}: ${cx(a - c)} ${shown} ${sg(d - b)}. ${a - c === 1 ? "" : `Se divide entre ${sg(a - c)}${a - c < 0 ? " y se invierte el signo" : ""}: `}${ineq(solution, n)}.`;
  return choiceQ(r, "Resuelve la inecuación.", ineq(solution, n), OPS.filter((o) => o !== solution).map((o) => ineq(o, n)), why, text, a - c < 0 ? "invierte" : "no-invierte");
}

// ---------------------------------------------------------------------------
// Variación directa

const VARIES = "y varía directamente con x";
// Y.1-Y.4: variación directa.
export function directVariation(r: Rng, mode: "constant" | "identify" | "write" | "solve"): Question {
  const k = r.pick([2, 3, 4, 5, 6, 8, -2, -3, -4]), x = r.int(2, 9) * r.pick([1, 1, -1]);
  if (mode === "constant") {
    if (r.chance(0.5)) return intQ(r, `Si ${VARIES} y y = ${sg(k * x)} cuando x = ${sg(x)}, ¿cuál es la constante de variación?`, k, `k = y ÷ x = ${sg(k * x)} ÷ ${par(x)} = ${sg(k)}.`, undefined, "dato", [-k, k * x]);
    const xs = [1, 2, 3, 5].map((i) => i * r.pick([1, 2]));
    return intQ(r, "La tabla muestra una variación directa. ¿Cuál es la constante de variación?", k, `En cada fila y ÷ x da ${sg(k)}.`, table(["x", "y"], xs.map((v) => [sg(v), sg(k * v)])), "tabla", [-k, k + 1]);
  }
  if (mode === "identify") {
    const b = nz(r, 6);
    const cases: [string, boolean, string][] = [
      [`y = ${sg(k)}x`, true, `Es de la forma y = kx, con k = ${sg(k)}.`],
      [`y = ${lin(k, b)}`, false, `Tiene un término independiente (${sg(b)}): la recta no pasa por el origen.`],
      [`y = x/${Math.abs(k)}`, true, `Es y = (1/${Math.abs(k)})x: de la forma y = kx.`],
      [`y = ${Math.abs(k)}/x`, false, `x está en el denominador: es una variación inversa, no directa.`],
      [`y = x²`, false, "x está al cuadrado: no es de la forma y = kx."],
      [`y − ${Math.abs(k)}x = 0`, true, `Equivale a y = ${Math.abs(k)}x.`],
    ];
    if (r.chance(0.35)) {
      const prop = r.chance(0.5);
      const xs = [1, 2, 4, 5];
      const ys = xs.map((v) => k * v + (prop ? 0 : b));
      return yesNo("¿La tabla muestra una variación directa?", prop, prop ? `y ÷ x siempre da ${sg(k)}.` : `y ÷ x no es constante: ${sg(ys[0])} ÷ 1 = ${sg(ys[0])}, pero ${sg(ys[1])} ÷ 2 = ${dec(ys[1] / 2)}.`, table(["x", "y"], xs.map((v, i) => [String(v), sg(ys[i])])), "tabla");
    }
    const [eq, ok, why] = r.pick(cases);
    return yesNo(`¿La ecuación ${eq} representa una variación directa?`, ok, why, undefined, "ecuacion");
  }
  if (mode === "write") {
    const good = `y = ${sg(k)}x`;
    return choiceQ(r, `Si ${VARIES} y y = ${sg(k * x)} cuando x = ${sg(x)}, ¿qué ecuación relaciona a x con y?`, good, [`y = ${sg(-k)}x`, `y = ${lin(1, k * x - x)}`, `y = ${sg(k * x)}x`, `y = ${lin(k, x)}`].filter((w) => w !== good), `k = ${sg(k * x)} ÷ ${par(x)} = ${sg(k)}: ${good}.`, undefined, "escribir");
  }
  const x2 = r.int(2, 12) * r.pick([1, -1]);
  return intQ(r, `Si ${VARIES} y y = ${sg(k * x)} cuando x = ${sg(x)}, ¿cuánto vale y cuando x = ${sg(x2)}?`, k * x2, `k = ${sg(k * x)} ÷ ${par(x)} = ${sg(k)}, así que y = ${sg(k)} × ${par(x2)} = ${sg(k * x2)}.`, undefined, "resolver", [k * x2 + k, -k * x2, x2 * x]);
}

// ---------------------------------------------------------------------------
// Pendiente y rectas

export const SLOPES: [number, number][] = [[1, 1], [2, 1], [3, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 2], [-3, 2]];
// Puntos con coordenadas enteras de la recta, dentro del plano.
export const intPoints = (mn: number, md: number, b: number, size = 6): P[] => {
  const out: P[] = [];
  for (let x = -size; x <= size; x++) {
    const y = b + (mn * x) / md;
    if (Number.isInteger(y) && Math.abs(y) <= size) out.push({ x, y });
  }
  return out;
};
export function randomLine(r: Rng, flat = false): [number, number, number] {
  const [mn, md] = flat && r.chance(0.15) ? [0, 1] : r.pick(SLOPES);
  const b = r.int(-4, 4);
  if (intPoints(mn, md, b).length < 3) return randomLine(r, flat);
  return [mn, md, b];
}

// Z.3: hallar la pendiente a partir de una tabla.
export function slopeFromTable(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-5, 5), step = md * r.pick([1, 2]);
  const x0 = r.int(-3, 2) * md;
  const xs = [0, 1, 2, 3].map((i) => x0 + i * step);
  const ys = xs.map((x) => b + (mn * x) / md);
  return slopeQ(r, "La tabla muestra puntos de una recta. ¿Cuál es su pendiente?", mn, md, `Pendiente = cambio en y ÷ cambio en x = (${sg(ys[1])} − ${par(ys[0])}) ÷ (${sg(xs[1])} − ${par(xs[0])}) = ${slopeText(ys[1] - ys[0], step) === `${sg(ys[1] - ys[0])}/${step}` ? slopeText(mn, md) : `${sg(ys[1] - ys[0])}/${step} = ${slopeText(mn, md)}`}.`, table(["x", "y"], xs.map((x, i) => [sg(x), sg(ys[i])])), mn > 0 ? "positiva" : "negativa");
}

// AA.1: ¿el par (x, y) es solución de la ecuación lineal?
export function isLinearSolution(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const pts = intPoints(mn, md, b);
  const on = r.chance(0.5);
  const p = r.pick(pts);
  const q = on ? p : { x: p.x, y: p.y + nz(r, 2) };
  const standard = r.chance(0.4) && md === 1;
  const eq = standard ? `${lin(-mn, 0)} + y = ${sg(b)}`.replace(/^0 \+ /, "") : slopeIntercept(mn, md, b);
  const val = b + (mn * q.x) / md;
  return yesNo(`¿El par ${pt(q)} es solución de ${eq}?`, on, `Con x = ${sg(q.x)}, la ecuación da y = ${sg(val)}${on ? ", que coincide." : `, no ${sg(q.y)}.`}`, undefined, on ? "si" : "no");
}

// AA.2: relacionar el gráfico de una ecuación con sus soluciones.
export function graphSolutions(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const pts = intPoints(mn, md, b);
  const good = r.pick(pts);
  const off: P[] = [];
  for (const p of r.shuffle(pts)) {
    const q = { x: p.x + r.pick([-1, 1]), y: p.y + r.pick([-1, 0, 1]) };
    if (b + (mn * q.x) / md !== q.y && Math.abs(q.x) <= 6 && Math.abs(q.y) <= 6 && !off.some((o) => o.x === q.x && o.y === q.y)) off.push(q);
    if (off.length === 3) break;
  }
  return choiceQ(r, "El gráfico muestra todas las soluciones de una ecuación. ¿Qué par es una solución?", pt(good), off.map(pt), `Las soluciones son los puntos de la recta; ${pt(good)} está sobre ella.`, linesPlane([{ mn, md, b }]), "grafico");
}

// AA.3: forma pendiente-intersección: hallar la pendiente y la intersección con el eje y.
export function readSlopeIntercept(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-9, 9);
  const eq = slopeIntercept(mn, md, b);
  if (r.chance(0.5)) return slopeQ(r, `¿Cuál es la pendiente de la recta ${eq}?`, mn, md, `En y = mx + b, la pendiente es m: ${slopeText(mn, md)}.`, undefined, "pendiente", b ? [[b, 1]] : []);
  return intQ(r, `¿En qué valor corta el eje y la recta ${eq}?`, b, `En y = mx + b, la intersección con el eje y es b: ${sg(b)}.`, undefined, "interseccion", [-b, mn]);
}

// Muestra una recta (la correcta o una parecida) y pregunta si es la de la ecuación.
export function drawnLine(r: Rng, eq: string, mn: number, md: number, b: number, why: string, tag: string): Question {
  const yes = r.chance(0.5);
  let line = { mn, md, b };
  if (!yes) {
    const variants = [{ mn: -mn, md, b }, { mn, md, b: -b || b + 2 }, { mn: md, md: Math.abs(mn) || 1, b }, { mn, md, b: b + r.pick([-2, 2]) }]
      .filter((v) => v.mn * md !== mn * v.md || v.b !== b)
      .filter((v) => lineEnds(v.mn, v.md, v.b));
    line = r.pick(variants);
  }
  const pts = intPoints(line.mn, line.md, line.b).filter((_, i, all) => i === 0 || i === all.length - 1 || i === Math.floor(all.length / 2));
  return yesNo(`¿El gráfico muestra la recta ${eq}?`, yes, why, linesPlane([line], pts), tag);
}

// AA.4: graficar una recta en forma pendiente-intersección.
export function graphSlopeIntercept(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  return drawnLine(r, slopeIntercept(mn, md, b), mn, md, b, `Corta el eje y en ${sg(b)} y, desde ahí, por cada ${md} hacia la derecha ${mn > 0 ? "sube" : "baja"} ${Math.abs(mn)}.`, "pendiente-interseccion");
}

export const pointSlopeText = (mn: number, md: number, p: P) => {
  const [n, d] = snorm([mn, md]);
  const m = d === 1 ? (n === 1 ? "" : n === -1 ? "−" : sg(n)) : `${n < 0 ? "−" : ""}(${Math.abs(n)}/${d})`;
  const yPart = p.y === 0 ? "y" : `y ${p.y < 0 ? "+" : "−"} ${Math.abs(p.y)}`;
  const xPart = p.x === 0 ? "x" : `(x ${p.x < 0 ? "+" : "−"} ${Math.abs(p.x)})`;
  return `${yPart} = ${m}${xPart}`;
};

// AA.5: graficar una recta en forma punto-pendiente.
export function graphPointSlope(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const p = r.pick(intPoints(mn, md, b).filter((q) => q.x !== 0));
  if (!p) return graphPointSlope(r);
  return drawnLine(r, pointSlopeText(mn, md, p), mn, md, b, `Pasa por ${pt(p)} y tiene pendiente ${slopeText(mn, md)}.`, "punto-pendiente");
}

// AA.6: escribir la ecuación a partir de la pendiente y la intersección.
export function writeFromSlopeIntercept(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-9, 9);
  return lineEqQ(r, `Una recta tiene pendiente ${slopeText(mn, md)} y corta el eje y en ${sg(b)}. ¿Cuál es su ecuación?`, mn, md, b, `y = mx + b con m = ${slopeText(mn, md)} y b = ${sg(b)}.`, undefined, "pendiente-interseccion");
}

// AA.7: escribir la ecuación a partir del gráfico.
export function writeFromGraph(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const p = intPoints(mn, md, b).find((q) => q.x === 0)!;
  const q = intPoints(mn, md, b).find((s) => s.x === md) ?? intPoints(mn, md, b).find((s) => s.x === -md)!;
  return lineEqQ(r, "¿Cuál es la ecuación de la recta?", mn, md, b, `Corta el eje y en ${sg(b)}; de ${pt(p)} a ${pt(q)} la pendiente es ${slopeText(mn, md)}.`, linesPlane([{ mn, md, b }], [p, q]), "grafico");
}

// AA.8: escribir la ecuación a partir de la pendiente y un punto.
export function writeFromSlopePoint(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const p = r.pick(intPoints(mn, md, b));
  const why = md === 1 ? `b = y − mx = ${sg(p.y)} − (${sg(mn)} × ${par(p.x)}) = ${sg(b)}.` : `Se reemplaza ${pt(p)} en y = (${slopeText(mn, md)})x + b y se despeja: b = ${sg(b)}.`;
  return lineEqQ(r, `Una recta tiene pendiente ${slopeText(mn, md)} y pasa por ${pt(p)}. ¿Cuál es su ecuación?`, mn, md, b, `${why} La ecuación es ${slopeIntercept(mn, md, b)}.`, undefined, "pendiente-punto");
}

// AA.9: escribir la ecuación a partir de dos puntos.
export function writeFromTwoPoints(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const pts = r.shuffle(intPoints(mn, md, b)).slice(0, 2).sort((p, q) => p.x - q.x);
  const [A, B] = pts;
  return lineEqQ(r, `Una recta pasa por ${pt(A)} y ${pt(B)}. ¿Cuál es su ecuación?`, mn, md, b, `m = (${sg(B.y)} − ${par(A.y)}) ÷ (${sg(B.x)} − ${par(A.x)}) = ${slopeText(mn, md)}; con un punto se halla b = ${sg(b)}.`, undefined, "dos-puntos");
}

// Forma general: Ax + By = C.
export const stdText = (A: number, B: number, C: number) => {
  const xPart = A === 0 ? "" : `${A === 1 ? "" : A === -1 ? "−" : sg(A)}x`;
  const yPart = B === 0 ? "" : `${xPart ? (B < 0 ? " − " : " + ") : B < 0 ? "−" : ""}${Math.abs(B) === 1 ? "" : Math.abs(B)}y`;
  return `${xPart}${yPart} = ${sg(C)}`;
};

// AA.10: convertir a la forma pendiente-intersección.
export function toSlopeIntercept(r: Rng): Question {
  const B = r.pick([1, 2, 3, 4, -2]), A = nz(r, 6), b = r.int(-5, 5);
  // Ax + By = C con C = B·b → y = (−A/B)x + b
  return lineEqQ(r, `Escribe la ecuación ${stdText(A, B, B * b)} en la forma y = mx + b.`, -A, B, b, `Se despeja y: ${B === 1 ? "" : `${sg(B)}`}y = ${lin(-A, B * b)}${B === 1 ? "" : `; se divide entre ${sg(B)}`} → ${slopeIntercept(-A, B, b)}.`, undefined, "despejar");
}

// AA.11: graficar una recta en forma general (por sus intersecciones con los ejes).
export function graphStandard(r: Rng): Question {
  const [px, py] = r.pick([[2, 3], [3, 2], [4, 2], [2, 4], [3, 6], [6, 3], [4, -2], [-3, 3], [2, -5], [5, 5], [-4, 2], [6, -2]]);
  // x/px + y/py = 1 → (py)x + (px)y = px·py, simplificado
  const g = Math.abs(gcd3(py, px, px * py));
  const [A, B, C] = [py / g, px / g, (px * py) / g];
  const eq = stdText(A, B, C);
  if (r.chance(0.5)) {
    const xAxis = r.chance(0.5);
    const ans: P = xAxis ? { x: px, y: 0 } : { x: 0, y: py };
    return pointQ(r, `¿En qué punto corta la recta ${eq} al eje ${xAxis ? "x" : "y"}?`, ans, xAxis ? `En el eje x, y = 0: ${cx(A)} = ${sg(C)} → x = ${sg(px)}.` : `En el eje y, x = 0: ${cx(B).replace("x", "y")} = ${sg(C)} → y = ${sg(py)}.`, undefined, xAxis ? "corte-x" : "corte-y");
  }
  return drawnLine(r, eq, -py, px, py, `Corta el eje x en ${sg(px)} y el eje y en ${sg(py)}.`, "forma-general");
}
const gcd3 = (a: number, b: number, c: number) => {
  const g = (m: number, n: number): number => (n ? g(n, m % n) : Math.abs(m));
  return g(g(a, b), c) * (a < 0 && b < 0 ? -1 : 1);
};

// AA.12-AA.13: rectas horizontales y verticales.
export function horizontalVertical(r: Rng, graph: boolean): Question {
  const vertical = r.chance(0.5), c = r.int(-5, 5) || 3;
  const eq = vertical ? `x = ${sg(c)}` : `y = ${sg(c)}`;
  const line = vertical ? verticalLine(c) : { from: { x: -6, y: c }, to: { x: 6, y: c } };
  if (graph) {
    const yes = r.chance(0.5);
    const drawn = yes ? line : r.pick([vertical ? { from: { x: -6, y: c }, to: { x: 6, y: c } } : verticalLine(c), vertical ? verticalLine(-c) : { from: { x: -6, y: -c }, to: { x: 6, y: -c } }]);
    return yesNo(`¿El gráfico muestra la recta ${eq}?`, yes, vertical ? `x = ${sg(c)} es una recta vertical: todos sus puntos tienen x = ${sg(c)}.` : `y = ${sg(c)} es una recta horizontal: todos sus puntos tienen y = ${sg(c)}.`, { kind: "coordPlane", min: -6, max: 6, points: [], lines: [drawn] }, vertical ? "vertical" : "horizontal");
  }
  const other = vertical ? `y = ${sg(c)}` : `x = ${sg(c)}`;
  return choiceQ(r, "¿Cuál es la ecuación de la recta?", eq, [other, vertical ? `x = ${sg(-c)}` : `y = ${sg(-c)}`, vertical ? `y = ${cx(c)}` : lin(1, c).replace(/^/, "y = ")], vertical ? `Es vertical y pasa por x = ${sg(c)}.` : `Es horizontal: la pendiente es 0 y corta el eje y en ${sg(c)}.`, { kind: "coordPlane", min: -6, max: 6, points: [], lines: [line] }, vertical ? "vertical" : "horizontal");
}

// AA.14: pendientes de rectas paralelas y perpendiculares.
export function parallelPerpendicular(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-6, 6);
  const eq = slopeIntercept(mn, md, b);
  const form = r.int(0, 2);
  if (form === 0) return slopeQ(r, `¿Cuál es la pendiente de una recta paralela a ${eq}?`, mn, md, `Las rectas paralelas tienen la misma pendiente: ${slopeText(mn, md)}.`, undefined, "paralela", [[-md, mn], [md, mn]]);
  if (form === 1) return slopeQ(r, `¿Cuál es la pendiente de una recta perpendicular a ${eq}?`, -md, mn, `La pendiente perpendicular es el inverso opuesto: −1 ÷ (${slopeText(mn, md)}) = ${slopeText(-md, mn)}.`, undefined, "perpendicular", [[md, mn], [mn, md]]);
  const kind = r.int(0, 2);
  const other = kind === 0 ? slopeIntercept(mn, md, b + r.pick([-3, 2, 4])) : kind === 1 ? slopeIntercept(-md, mn, r.int(-5, 5)) : slopeIntercept(md, mn === 0 ? 1 : Math.abs(mn), r.int(-5, 5));
  const opts = ["Paralelas", "Perpendiculares", "Ni paralelas ni perpendiculares"];
  const real = kind === 2 && md * md === -(mn * Math.abs(mn)) ? 1 : kind;
  return fixedQ(`¿Cómo son las rectas ${eq} y ${other}?`, opts, opts[real], real === 0 ? "Tienen la misma pendiente y distinta intersección." : real === 1 ? "El producto de sus pendientes es −1." : "Las pendientes no son iguales ni su producto es −1.", undefined, ["paralelas", "perpendiculares", "ninguna"][real]);
}

// ---------------------------------------------------------------------------
// Funciones

const pairs = (ps: P[]) => `{${ps.map(pt).join(", ")}}`;

// BB.1: identificar funciones (pares ordenados y tablas).
export function identifyFunction(r: Rng): Question {
  const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4);
  const ps = xs.map((x) => ({ x, y: r.int(-5, 6) }));
  const isF = r.chance(0.5);
  if (!isF) ps[3] = { x: ps[r.int(0, 2)].x, y: ps[3].y === ps[0].y ? ps[3].y + 1 : ps[3].y };
  const repeated = !isF ? ps[3].x : 0;
  const why = isF ? "Cada valor de x aparece una sola vez: a cada entrada le corresponde una única salida." : `x = ${sg(repeated)} tiene dos valores distintos de y: no es función.`;
  if (r.chance(0.5)) return yesNo("¿La tabla representa una función?", isF, why, table(["x", "y"], ps.map((p) => [sg(p.x), sg(p.y)])), "tabla");
  return yesNo(`¿La relación ${pairs(ps)} es una función?`, isF, why, undefined, "pares");
}

// BB.2: identificar funciones en gráficos (prueba de la recta vertical).
export function functionGraph(r: Rng): Question {
  const xs = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 5);
  const ps = xs.map((x) => ({ x, y: r.int(-5, 5) }));
  const isF = r.chance(0.5);
  if (!isF) {
    const p = ps[r.int(0, 4)];
    ps.push({ x: p.x, y: p.y > 0 ? p.y - r.int(2, 5) : p.y + r.int(2, 5) });
  }
  return yesNo("¿El gráfico representa una función?", isF, isF ? "Ninguna recta vertical toca dos puntos: es función." : `La recta vertical x = ${sg(ps[ps.length - 1].x)} toca dos puntos: no es función.`, plane(ps.map((p) => ({ ...p, emoji: "•" }))), "grafico");
}

// Gráfico de una función: una línea quebrada por puntos enteros.
function polyFunction(r: Rng): P[] {
  const xs = [-5, -3, -1, 0, 2, 4, 5].filter(() => r.chance(0.8));
  if (xs.length < 4) return polyFunction(r);
  let y = r.int(-4, 4);
  return xs.map((x) => {
    const p = { x, y };
    y = Math.max(-5, Math.min(5, y + r.int(-3, 3)));
    return p;
  });
}

// BB.4-BB.5: valores a partir del gráfico de una función.
export function functionValues(r: Rng, table5 = false): Question {
  const ps = polyFunction(r);
  const visual = plane(ps.map((p) => ({ ...p, emoji: "•" })), "open");
  const p = r.pick(ps);
  if (table5) {
    const shown = r.shuffle(ps).slice(0, 3).sort((a, b) => a.x - b.x);
    const k = r.int(0, 2);
    return intQ(r, `Completa la tabla con los valores de la función del gráfico. ¿Qué número va en lugar de «?»?`, shown[k].y, `En x = ${sg(shown[k].x)} la gráfica pasa por ${pt(shown[k])}.`, visual, "tabla", [shown[k].x, -shown[k].y]);
  }
  if (r.chance(0.5)) return intQ(r, `Según el gráfico, ¿cuánto vale f(${sg(p.x)})?`, p.y, `El punto de la gráfica con x = ${sg(p.x)} es ${pt(p)}: f(${sg(p.x)}) = ${sg(p.y)}.`, visual, "f-de-x", [p.x, -p.y]);
  const same = ps.filter((q) => q.y === p.y);
  if (same.length > 1) return intQ(r, `Según el gráfico, ¿cuánto vale f(${sg(p.x)})?`, p.y, `f(${sg(p.x)}) = ${sg(p.y)}.`, visual, "f-de-x", [p.x, -p.y]);
  return intQ(r, `Según el gráfico, ¿para qué valor de x se cumple f(x) = ${sg(p.y)}? (Considera solo los puntos marcados.)`, p.x, `El punto marcado con y = ${sg(p.y)} es ${pt(p)}.`, visual, "x-de-f", [p.y, -p.x]);
}

// BB.6: dominio y rango.
export function domainRange(r: Rng): Question {
  const xs = r.shuffle([-4, -2, -1, 0, 1, 3, 5]).slice(0, 4).sort((a, b) => a - b);
  const ys = xs.map(() => r.int(-3, 6));
  const ps = r.shuffle(xs.map((x, i) => ({ x, y: ys[i] })));
  const set = (ns: number[]) => `{${[...new Set(ns)].sort((a, b) => a - b).map(sg).join(", ")}}`;
  const domain = r.chance(0.5);
  const good = domain ? set(xs) : set(ys);
  const wrong = [domain ? set(ys) : set(xs), set([...xs, ...ys]), domain ? set(xs.map((x) => -x)) : set(ys.map((y) => y + 1))].filter((w) => w !== good);
  return choiceQ(r, `¿Cuál es el ${domain ? "dominio" : "rango"} de la función ${pairs(ps)}?`, good, wrong, domain ? "El dominio es el conjunto de los valores de x (las primeras coordenadas)." : "El rango es el conjunto de los valores de y (las segundas coordenadas).", undefined, domain ? "dominio" : "rango");
}

// ---------------------------------------------------------------------------
// Funciones lineales

const fx = (mn: number, md: number, b: number) => slopeIntercept(mn, md, b).replace(/^y/, "f(x)");

// CC.1: evaluar una función lineal.
export function evaluateLinearFunction(r: Rng): Question {
  const [mn, md] = r.pick(SLOPES), b = r.int(-9, 9), x = md * r.int(-4, 5);
  const v = (mn * x) / md + b;
  return intQ(r, `Si ${fx(mn, md, b)}, ¿cuánto vale f(${sg(x)})?`, v, `f(${sg(x)}) = ${slopeText(mn, md)} × ${par(x)}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""} = ${sg(v)}.`, undefined, undefined, [-v, (mn * x) / md - b]);
}

// CC.2-CC.3: completar la tabla de una función lineal (y su gráfico).
export function linearTable(r: Rng, graph = false): Question {
  const [mn, md, b] = randomLine(r);
  const shown = r.shuffle(intPoints(mn, md, b)).slice(0, 4).sort((p, q) => p.x - q.x);
  const k = r.int(0, shown.length - 1);
  const eq = slopeIntercept(mn, md, b);
  const visual: Visual = graph ? linesPlane([{ mn, md, b }], shown.filter((_, i) => i !== k)) : table(["x", "y"], shown.map((p, i) => [sg(p.x), i === k ? "?" : sg(p.y)]));
  return intQ(r, graph ? `Para graficar ${eq} se hizo una tabla. ¿Qué valor de y corresponde a x = ${sg(shown[k].x)}?` : `Completa la tabla de ${eq}. ¿Qué número va en lugar de «?»?`, shown[k].y, `y = ${slopeText(mn, md)} × ${par(shown[k].x)}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""} = ${sg(shown[k].y)}.`, visual, graph ? "grafico" : "tabla", [-shown[k].y, shown[k].y + 1]);
}

type Ctx = { story: (m: number, b: number) => string; x: string; y: (v: number) => string; slope: string; icpt: string; others: string[]; point: (x: number, y: number) => string; wrongPoint: (x: number, y: number) => string[] };
const CONTEXTS: Ctx[] = [
  {
    story: (m, b) => `Un taxi cobra según la ecuación C = ${lin(m, b)}, donde x es la distancia en kilómetros y C es el costo en soles.`,
    x: "kilómetros", y: (v) => `${v} soles`,
    slope: "El costo por cada kilómetro recorrido", icpt: "La tarifa fija que se paga al subir",
    others: ["La distancia recorrida en el viaje", "El costo total de cualquier viaje"],
    point: (x, y) => `Un viaje de ${x} km cuesta ${y} soles`, wrongPoint: (x, y) => [`Un viaje de ${y} km cuesta ${x} soles`, `Cada kilómetro cuesta ${y} soles`, `La tarifa fija es de ${x} soles`],
  },
  {
    story: (m, b) => `La altura del agua de un tanque es A = ${lin(m, b, "t")}, donde t es el tiempo en minutos y A la altura en centímetros.`,
    x: "minutos", y: (v) => `${v} cm`,
    slope: "Lo que sube el agua en cada minuto", icpt: "La altura del agua al empezar a llenar",
    others: ["El tiempo que tarda en llenarse", "La altura máxima que tiene el tanque"],
    point: (x, y) => `A los ${x} minutos, el agua tiene ${y} cm de altura`, wrongPoint: (x, y) => [`A los ${y} minutos, el agua tiene ${x} cm de altura`, `Cada minuto el agua sube ${y} cm`, `Al empezar, el agua tenía ${x} cm de altura`],
  },
  {
    story: (m, b) => `Los ahorros de Rosa son S = ${lin(m, b, "s")}, donde s es el número de semanas y S el dinero en soles.`,
    x: "semanas", y: (v) => `${v} soles`,
    slope: "Lo que Rosa ahorra cada semana", icpt: "El dinero que Rosa tenía al comenzar",
    others: ["El número de semanas que ahorra", "El dinero que tendrá al final del año"],
    point: (x, y) => `A las ${x} semanas, Rosa tiene ${y} soles`, wrongPoint: (x, y) => [`A las ${y} semanas, Rosa tiene ${x} soles`, `Rosa ahorra ${y} soles cada semana`, `Rosa empezó con ${x} soles ahorrados`],
  },
  {
    story: (m, b) => `La altura de una planta es H = ${lin(m, b, "d")}, donde d es el número de días y H la altura en centímetros.`,
    x: "días", y: (v) => `${v} cm`,
    slope: "Lo que crece la planta cada día", icpt: "La altura de la planta al comenzar",
    others: ["Los días que lleva creciendo la planta", "La altura que alcanzará la planta"],
    point: (x, y) => `A los ${x} días, la planta mide ${y} cm`, wrongPoint: (x, y) => [`A los ${y} días, la planta mide ${x} cm`, `La planta crece ${y} cm cada día`, `Al comenzar, la planta medía ${x} cm`],
  },
];

// Primer cuadrante con una recta: extremos dentro de [0, max].
function quad1Line(m: number, b: number, max: number) {
  const xEnd = Math.min(max, (max - b) / m);
  return { from: { x: 0, y: b }, to: { x: xEnd, y: b + m * xEnd } };
}

// CC.4: interpretar puntos del gráfico de una función lineal.
export function interpretPoint(r: Rng): Question {
  const ctx = r.pick(CONTEXTS), m = r.int(1, 3), b = r.int(1, 5);
  const x = r.int(2, Math.max(2, Math.floor((12 - b) / m))), y = m * x + b;
  if (x === y || y > 12) return interpretPoint(r);
  const visual: Visual = { kind: "coordPlane", max: 12, points: [{ x, y, emoji: "•" }], lines: [quad1Line(m, b, 12)] };
  return choiceQ(r, `${ctx.story(m, b)} ¿Qué significa el punto ${pt({ x, y })} del gráfico?`, ctx.point(x, y), ctx.wrongPoint(x, y), `La primera coordenada son los ${ctx.x} y la segunda, el valor: ${ctx.point(x, y).toLowerCase()}.`, visual, "punto");
}

// CC.7: interpretar la pendiente y la intersección con el eje y.
export function interpretSlopeIntercept(r: Rng): Question {
  const ctx = r.pick(CONTEXTS), m = r.int(2, 9), b = r.int(10, 40);
  const askSlope = r.chance(0.5);
  const good = askSlope ? ctx.slope : ctx.icpt;
  return choiceQ(r, `${ctx.story(m, b)} ¿Qué representa el número ${askSlope ? m : b}?`, good, [askSlope ? ctx.icpt : ctx.slope, ...ctx.others], askSlope ? `${m} es la pendiente: lo que cambia el valor por cada unidad (${ctx.x}).` : `${b} es la intersección con el eje y: el valor cuando han pasado 0 ${ctx.x}.`, undefined, askSlope ? "pendiente" : "interseccion");
}

// CC.8: escribir una función lineal a partir de una tabla.
export function linearFromTable(r: Rng): Question {
  const [mn, md, b] = randomLine(r);
  const shown = r.shuffle(intPoints(mn, md, b)).slice(0, 4).sort((p, q) => p.x - q.x);
  return lineEqQ(r, "¿Qué ecuación representa la función de la tabla?", mn, md, b, `Pendiente: (${sg(shown[1].y)} − ${par(shown[0].y)}) ÷ (${sg(shown[1].x)} − ${par(shown[0].x)}) = ${slopeText(mn, md)}; con un punto se halla b = ${sg(b)}.`, table(["x", "y"], shown.map((p) => [sg(p.x), sg(p.y)])), "tabla");
}

const COMPARE = ["La función A", "La función B", "Las dos son iguales"];
// CC.9-CC.10: comparar funciones lineales dadas de distintas formas.
export function compareLinear(r: Rng, withTable: boolean): Question {
  const [mA, dA, bA] = randomLine(r);
  let [mB, dB, bB] = randomLine(r);
  const askSlope = r.chance(0.5);
  if (r.chance(0.2)) [mB, dB, bB] = askSlope ? [mA * 2, dA * 2, bB] : [mB, dB, bA];
  const sA = mA / dA, sB = mB / dB;
  const [vA, vB] = askSlope ? [sA, sB] : [bA, bB];
  const k = Math.abs(vA - vB) < 1e-9 ? 2 : vA > vB ? 0 : 1;
  const useTable = withTable && r.chance(0.5);
  const ptsA = intPoints(mA, dA, bA);
  const visual: Visual = useTable ? table(["x", "y"], r.shuffle(ptsA).slice(0, 4).sort((p, q) => p.x - q.x).map((p) => [sg(p.x), sg(p.y)]), "Función A") : linesPlane([{ mn: mA, md: dA, b: bA, label: "A" }], ptsA.filter((p) => p.x === 0 || p.x === dA || p.x === -dA));
  return fixedQ(`${useTable ? "La tabla" : "El gráfico"} muestra la función A. La función B es ${slopeIntercept(mB, dB, bB)}. ¿Cuál tiene ${askSlope ? "mayor pendiente (mayor tasa de cambio)" : "mayor intersección con el eje y"}?`, COMPARE, COMPARE[k], askSlope ? `Pendiente de A: ${slopeText(mA, dA)}; de B: ${slopeText(mB, dB)}.` : `A corta el eje y en ${sg(bA)}; B, en ${sg(bB)}.`, visual, askSlope ? "pendiente" : "interseccion");
}

// CC.11-CC.12: funciones lineales: problemas (escribir y evaluar).
export function linearWord(r: Rng, evaluate: boolean): Question {
  const name = r.pick(NAMES);
  const form = r.int(0, 2);
  const m = r.int(2, 9) * (form === 0 ? 5 : 1), b = r.int(10, 60), x = r.int(2, 12);
  const [story, xs, ys] = form === 0
    ? [`Un gimnasio cobra ${b} soles de inscripción y ${m} soles por mes.`, "el número de meses", "el costo total en soles"]
    : form === 1
      ? [`Una vela mide ${b + m * 12} mm y cada hora se acorta ${m} mm.`, "el número de horas que lleva encendida", "su altura en milímetros"]
      : [`${name} tiene ${b} soles ahorrados y cada semana agrega ${m} soles.`, "el número de semanas", "el dinero ahorrado en soles"];
  const slope = form === 1 ? -m : m, icpt = form === 1 ? b + m * 12 : b;
  const when = form === 0 ? `han pasado ${x} meses` : form === 1 ? `lleva ${x} horas encendida` : `han pasado ${x} semanas`;
  if (evaluate) return numQ(slope * x + icpt, `${story} ¿Cuál es ${ys} cuando ${when}?`, undefined, `${slope < 0 ? `${icpt} − ${m} × ${x}` : `${m} × ${x} + ${icpt}`} = ${slope * x + icpt}.`, "evaluar");
  return lineEqQ(r, `${story} Si x es ${xs} y y es ${ys}, ¿qué ecuación lo representa?`, slope, 1, icpt, `Lo que cambia con x es ${slope < 0 ? `−${m}` : m} (la pendiente) y el valor inicial es ${icpt}.`, undefined, "escribir");
}

// ---------------------------------------------------------------------------
// Funciones no lineales

const LIN = ["Lineal", "No lineal"];
// DD.1-DD.2: identificar funciones lineales y no lineales.
export function linearOrNot(r: Rng, mode: "graphEq" | "table"): Question {
  const linear = r.chance(0.5);
  if (mode === "table") {
    const xs = [0, 1, 2, 3, 4];
    const a = nz(r, 4), b = r.int(-5, 5);
    const ys = xs.map((x) => (linear ? a * x + b : r.pick([1, 2]) * x * x + b));
    return fixedQ("¿La tabla muestra una función lineal o no lineal?", LIN, LIN[linear ? 0 : 1], linear ? `y cambia siempre ${sg(a)} cuando x aumenta 1.` : `Los cambios de y no son constantes: ${ys.slice(1).map((y, i) => sg(y - ys[i])).join(", ")}.`, table(["x", "y"], xs.map((x, i) => [String(x), sg(ys[i])])), "tabla");
  }
  if (r.chance(0.5)) {
    const k = r.int(2, 5), b = r.int(1, 9);
    const eqs: [string, boolean][] = [[`y = ${k}x + ${b}`, true], [`y = x/${k} − ${b}`, true], [`y = ${b} − ${k}x`, true], [`${k}x + y = ${b}`, true], [`y = x² + ${b}`, false], [`y = ${k}/x`, false], [`y = ${k}x³`, false], [`y = ${k}ˣ`, false]];
    const [eq, lin2] = r.pick(eqs.filter((e) => e[1] === linear));
    return fixedQ(`¿La ecuación ${eq} representa una función lineal o no lineal?`, LIN, LIN[lin2 ? 0 : 1], lin2 ? "Se puede escribir como y = mx + b: x no tiene exponente ni está en un denominador." : "x tiene exponente distinto de 1 o está en un denominador o exponente: no es de la forma y = mx + b.", undefined, "ecuacion");
  }
  const xs = [-3, -2, -1, 0, 1, 2, 3];
  const a = nz(r, 2), b = r.int(-2, 2);
  const ps = xs.map((x) => ({ x, y: linear ? a * x + b : x * x - 3 + b })).filter((p) => Math.abs(p.y) <= 6);
  return fixedQ("¿El gráfico muestra una función lineal o no lineal?", LIN, LIN[linear ? 0 : 1], linear ? "Los puntos forman una recta." : "Los puntos forman una curva, no una recta.", plane(ps.map((p) => ({ ...p, emoji: "•" })), "open"), "grafico");
}

// DD.3: ¿el par (x, y) es solución de la ecuación no lineal?
export function nonlinearSolution(r: Rng): Question {
  const x = nz(r, 4), a = r.int(1, 3), b = nz(r, 6);
  const forms: [string, (v: number) => number][] = [[`y = ${a === 1 ? "" : a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}`, (v) => a * v * v + b], [`y = x³ ${b < 0 ? "−" : "+"} ${Math.abs(b)}`, (v) => v ** 3 + b], [`y = |x| ${b < 0 ? "−" : "+"} ${Math.abs(b)}`, (v) => Math.abs(v) + b]];
  const [eq, f] = r.pick(forms);
  const on = r.chance(0.5);
  const y = on ? f(x) : f(x) + nz(r, 3);
  return yesNo(`¿El par ${pt({ x, y })} es solución de ${eq}?`, on, `Con x = ${sg(x)}: y = ${sg(f(x))}${on ? ", coincide." : `, no ${sg(y)}.`}`, undefined, on ? "si" : "no");
}

// EE.3: identificar gráficos: problemas.
const SHAPES: [string, number[], string][] = [
  ["Un auto acelera, viaja a velocidad constante y luego frena hasta detenerse.", [0, 4, 8, 8, 8, 4, 0], "Sube, se mantiene y luego baja hasta 0."],
  ["Una piscina se llena a ritmo constante, se queda llena un rato y luego se vacía rápido.", [0, 3, 6, 9, 9, 9, 0], "Sube de a poco, se mantiene y cae de golpe."],
  ["Una pelota se lanza hacia arriba y vuelve a caer al suelo.", [0, 5, 8, 9, 8, 5, 0], "Sube cada vez más lento y luego baja: una curva."],
  ["Un globo pierde aire poco a poco hasta quedar vacío.", [9, 8, 7, 5, 4, 2, 0], "Siempre baja."],
  ["Un niño ahorra la misma cantidad cada semana.", [1, 2, 3, 4, 5, 6, 7], "Sube siempre lo mismo: una recta."],
  ["La temperatura de una taza de café baja rápido al inicio y luego cada vez más lento.", [10, 6, 4, 3, 2, 2, 2], "Baja rápido y después casi no cambia."],
];
export function identifyGraphWord(r: Rng): Question {
  const i = r.int(0, SHAPES.length - 1);
  const [, ys, why] = SHAPES[i];
  const pts = ys.map((y, x) => ({ x: x * 2, y }));
  const others = SHAPES.filter((_, j) => j !== i).map((s) => s[0]);
  return choiceQ(r, "¿Qué situación representa mejor el gráfico?", SHAPES[i][0], r.shuffle(others).slice(0, 3), why, { kind: "coordPlane", max: 12, points: pts.map((p) => ({ ...p, emoji: "•" })), connect: "open" }, "grafico");
}

// ---------------------------------------------------------------------------
// Sistemas de ecuaciones

const intersection = (r: Rng, size = 5) => {
  const p = { x: r.int(-size, size), y: r.int(-size, size) };
  const [m1, d1] = r.pick(SLOPES);
  let [m2, d2] = r.pick(SLOPES);
  while (m1 * d2 === m2 * d1) [m2, d2] = r.pick(SLOPES);
  const b = (mn: number, md: number) => p.y - (mn * p.x) / md;
  const b1 = b(m1, d1), b2 = b(m2, d2);
  if (!Number.isInteger(b1) || !Number.isInteger(b2) || Math.abs(b1) > 8 || Math.abs(b2) > 8) return null;
  return { p, l1: { mn: m1, md: d1, b: b1 }, l2: { mn: m2, md: d2, b: b2 } };
};
function system(r: Rng) {
  for (;;) {
    const s = intersection(r);
    if (s && intPoints(s.l1.mn, s.l1.md, s.l1.b).length >= 2 && intPoints(s.l2.mn, s.l2.md, s.l2.b).length >= 2) return s;
  }
}
const sysText = (a: string, b: string) => `${a}\n${b}`;

// GG.1: ¿el par es solución del sistema?
export function isSystemSolution(r: Rng): Question {
  const { p, l1, l2 } = system(r);
  const kind = r.int(0, 2);
  const q = kind === 0 ? p : kind === 1 ? r.pick(intPoints(l1.mn, l1.md, l1.b).filter((s) => s.x !== p.x)) ?? { x: p.x + 1, y: p.y } : { x: p.x + 1, y: p.y - 1 };
  const e1 = slopeIntercept(l1.mn, l1.md, l1.b), e2 = slopeIntercept(l2.mn, l2.md, l2.b);
  const ok = (l: typeof l1) => l.b + (l.mn * q.x) / l.md === q.y;
  const yes = ok(l1) && ok(l2);
  return yesNo(`¿El par ${pt(q)} es solución del sistema?`, yes, yes ? "Cumple las dos ecuaciones." : ok(l1) || ok(l2) ? "Cumple solo una de las ecuaciones; debe cumplir las dos." : "No cumple ninguna de las dos ecuaciones.", sysText(e1, e2), yes ? "si" : "no");
}

// GG.2: resolver un sistema graficando.
export function systemByGraph(r: Rng): Question {
  const { p, l1, l2 } = system(r);
  return pointQ(r, "¿Cuál es la solución del sistema? Usa el gráfico.", p, `Las rectas se cortan en ${pt(p)}: ese par cumple las dos ecuaciones.`, linesPlane([l1, l2]), "grafico");
}

// GG.3: resolver un sistema graficando: problemas.
export function systemGraphWord(r: Rng): Question {
  const m1 = r.int(1, 2), b1 = r.int(4, 8);
  const m2 = m1 + r.int(1, 2);
  const x = r.int(2, 4);
  const b2 = b1 + m1 * x - m2 * x;
  if (b2 < 0 || m1 * x + b1 > 12) return systemGraphWord(r);
  const visual: Visual = { kind: "coordPlane", max: 12, points: [], lines: [{ ...quad1Line(m1, b1, 12), label: "A" }, { ...quad1Line(m2, b2, 12), label: "B" }] };
  return numQ(x, `El gráfico muestra la altura de dos plantas según las semanas: la planta A mide ${b1} cm y crece ${m1} cm por semana; la planta B mide ${b2} cm y crece ${m2} cm por semana. ¿Después de cuántas semanas tendrán la misma altura?`, visual, `Las rectas se cortan en (${x}, ${m1 * x + b1}): a las ${x} semanas las dos miden ${m1 * x + b1} cm.`, "problema");
}

// GG.4-GG.7: número de soluciones y clasificación de sistemas.
const KINDS3 = ["Una solución", "Ninguna solución", "Infinitas soluciones"];
const CLASSES = ["Compatible determinado", "Incompatible", "Compatible indeterminado"];
export function systemSolutions(r: Rng, graph: boolean, classify: boolean): Question {
  const kind = r.int(0, 2);
  const [mn, md, b] = randomLine(r);
  let l2 = { mn, md, b };
  if (kind === 0) {
    const [m2, d2] = r.pick(SLOPES.filter(([n, d]) => n * md !== mn * d));
    l2 = { mn: m2, md: d2, b: r.int(-4, 4) };
  }
  if (kind === 1) l2 = { mn, md, b: b + r.pick([-3, -2, 2, 3]) };
  const opts = classify ? CLASSES : KINDS3;
  const why = kind === 0 ? "Las pendientes son distintas: las rectas se cortan en un solo punto." : kind === 1 ? "Misma pendiente y distinta intersección: las rectas son paralelas y nunca se cortan." : "Las dos ecuaciones son la misma recta: todos sus puntos son solución.";
  const e1 = slopeIntercept(mn, md, b);
  let e2 = slopeIntercept(l2.mn, l2.md, l2.b);
  // La misma recta, escrita en forma general: −(mn)x + (md)y = md·b (multiplicada por 2 si md = 1).
  if (kind === 2) e2 = md === 1 ? stdText(-2 * mn, 2, 2 * b) : stdText(-mn, md, md * b);
  const visual: Visual | string = graph ? linesPlane([{ mn, md, b }, l2]) : sysText(e1, e2);
  return fixedQ(classify ? "¿Cómo se clasifica el sistema?" : "¿Cuántas soluciones tiene el sistema?", opts, opts[kind], why, visual, ["una", "ninguna", "infinitas"][kind]);
}

// Sistema con solución entera en forma general.
function standardSystem(r: Rng, elimination: boolean) {
  const x = r.int(-6, 8), y = r.int(-6, 8);
  const a1 = nz(r, 5), b1 = nz(r, 5);
  let a2 = nz(r, 5), b2 = nz(r, 5);
  if (elimination) {
    if (r.chance(0.5)) b2 = -b1;
    else a2 = r.chance(0.5) ? -a1 : a1 * r.pick([2, -2]);
  }
  if (a1 * b2 === a2 * b1) return standardSystem(r, elimination);
  return { x, y, e1: stdText(a1, b1, a1 * x + b1 * y), e2: stdText(a2, b2, a2 * x + b2 * y), a1, b1, a2, b2 };
}

// GG.8 / GG.10: resolver por sustitución o por eliminación.
export function solveSystem(r: Rng, method: "substitution" | "elimination" | "any"): Question {
  const m = method === "any" ? r.pick(["substitution", "elimination"] as const) : method;
  if (m === "substitution") {
    const x = r.int(-5, 6), k = nz(r, 4), c = r.int(-6, 6);
    const y = k * x + c;
    const a = nz(r, 4), b = nz(r, 3);
    if (a + b * k === 0) return solveSystem(r, method);
    const e1 = `y = ${lin(k, c)}`, e2 = stdText(a, b, a * x + b * y);
    return pointQ(r, "Resuelve el sistema por sustitución.", { x, y }, `Se reemplaza y en la segunda ecuación: ${a === 1 ? "" : a === -1 ? "−" : sg(a)}x ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}(${lin(k, c)}) = ${sg(a * x + b * y)} → x = ${sg(x)}; luego y = ${sg(y)}.`, sysText(e1, e2), "sustitucion");
  }
  const s = standardSystem(r, true);
  return pointQ(r, "Resuelve el sistema por eliminación.", { x: s.x, y: s.y }, `Se suman (o restan) las ecuaciones, multiplicando antes si hace falta, para eliminar una variable: x = ${sg(s.x)} e y = ${sg(s.y)}.`, sysText(s.e1, s.e2), "eliminacion");
}

// GG.9 / GG.11 / GG.13: sistemas de ecuaciones: problemas.
export function systemWord(r: Rng): Question {
  const form = r.int(0, 3);
  if (form === 0) {
    const adult = r.int(8, 15), child = r.int(3, adult - 2), a = r.int(10, 60), c = r.int(10, 60);
    return numQ(a, `En una función de teatro, la entrada de adulto cuesta ${adult} soles y la de niño, ${child} soles. Se vendieron ${a + c} entradas y se recaudaron ${adult * a + child * c} soles. ¿Cuántas entradas de adulto se vendieron?`, undefined, `x + y = ${a + c} y ${adult}x + ${child}y = ${adult * a + child * c}. Resolviendo: x = ${a} (adultos), y = ${c} (niños).`, "entradas");
  }
  if (form === 1) {
    const hens = r.int(5, 30), rabbits = r.int(3, 20);
    return numQ(rabbits, `En una granja hay gallinas y conejos. En total hay ${hens + rabbits} cabezas y ${2 * hens + 4 * rabbits} patas. ¿Cuántos conejos hay?`, undefined, `g + c = ${hens + rabbits} y 2g + 4c = ${2 * hens + 4 * rabbits}. Resolviendo: c = ${rabbits}, g = ${hens}.`, "granja");
  }
  if (form === 2) {
    const big = r.int(20, 80), small = r.int(5, big - 3);
    return numQ(big, `La suma de dos números es ${big + small} y su diferencia es ${big - small}. ¿Cuál es el número mayor?`, undefined, `x + y = ${big + small} y x − y = ${big - small}. Sumando: 2x = ${2 * big} → x = ${big}.`, "numeros");
  }
  const p1 = r.int(2, 6), p2 = r.int(p1 + 1, 9), n1 = r.int(2, 9), n2 = r.int(2, 9);
  const name = r.pick(NAMES);
  return numQ(p1, `${name} compró ${n1} cuadernos y ${n2} lapiceros por ${n1 * p1 + n2 * p2} soles. Su amiga compró ${n1} cuadernos y ${n2 + 2} lapiceros por ${n1 * p1 + (n2 + 2) * p2} soles. ¿Cuánto cuesta un cuaderno, en soles?`, undefined, `La amiga pagó ${2 * p2} soles más por 2 lapiceros: cada lapicero cuesta ${p2}. Luego ${n1}c + ${n2 * p2} = ${n1 * p1 + n2 * p2} → c = ${p1}.`, "compras");
}

