import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { NAMES, choiceQ, fmt, nearNums, numQ, twoNames } from "./kit";

// Problemas con texto (4.° en adelante). `story()` arma un problema de una
// sola operación con los números que le pasen; los generadores de varios
// pasos combinan esas piezas. Los rangos siempre son parámetros.

export type Op = "+" | "−" | "×" | "÷";
export const calc = (op: Op, a: number, b: number) => (op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b);

export type Story = { text: string; answer: number; equation: string };

type Tpl = (a: string, b: string, name: string) => string;
// `small`: el contexto solo tiene sentido con números pequeños.
const STORIES: Record<Op, { t: Tpl; small?: boolean }[]> = {
  "+": [
    { t: (a, b, n) => `${n} leyó ${a} páginas en marzo y ${b} en abril. ¿Cuántas páginas leyó en total?` },
    { t: (a, b) => `Una granja tiene ${a} gallinas y ${b} patos. ¿Cuántas aves tiene en total?` },
    { t: (a, b) => `En un estadio hay ${a} personas en la tribuna norte y ${b} en la tribuna sur. ¿Cuántas personas hay en total?` },
    { t: (a, b) => `Una biblioteca tenía ${a} libros y recibió ${b} más. ¿Cuántos libros tiene ahora?` },
    { t: (a, b) => `Una fábrica produjo ${a} botellas el lunes y ${b} el martes. ¿Cuántas botellas produjo en los dos días?` },
    { t: (a, b, n) => `${n} tenía ${a} puntos en un videojuego y ganó ${b} más. ¿Cuántos puntos tiene ahora?` },
  ],
  "−": [
    { t: (a, b) => `Una tienda tenía ${a} cuadernos y vendió ${b}. ¿Cuántos cuadernos le quedan?` },
    { t: (a, b) => `Un camión llevaba ${a} kilos de papa y descargó ${b}. ¿Cuántos kilos quedan en el camión?` },
    { t: (a, b, n) => `${n} quiere juntar ${a} tapitas y ya tiene ${b}. ¿Cuántas tapitas le faltan?` },
    { t: (a, b) => `A un concierto fueron ${a} personas; ${b} eran niños. ¿Cuántas personas no eran niños?` },
    { t: (a, b, n) => `Un libro tiene ${a} páginas y ${n} ya leyó ${b}. ¿Cuántas páginas le faltan leer?` },
    { t: (a, b) => `Un tanque tenía ${a} litros de agua y se usaron ${b}. ¿Cuántos litros quedan?` },
  ],
  "×": [
    { t: (a, b) => `Hay ${a} cajas con ${b} lápices cada una. ¿Cuántos lápices hay en total?` },
    { t: (a, b) => `Un bus hace ${a} viajes y en cada uno lleva ${b} pasajeros. ¿Cuántos pasajeros lleva en total?`, small: true },
    { t: (a, b, n) => `${n} ahorra ${b} soles cada mes. ¿Cuántos soles ahorra en ${a} meses?` },
    { t: (a, b) => `Un teatro tiene ${a} filas con ${b} butacas cada una. ¿Cuántas butacas tiene?`, small: true },
    { t: (a, b) => `Cada paquete trae ${b} galletas. ¿Cuántas galletas hay en ${a} paquetes?`, small: true },
    { t: (a, b) => `Una fábrica produce ${b} tornillos cada día. ¿Cuántos tornillos produce en ${a} días?` },
    { t: (a, b) => `Una imprenta hace ${b} afiches por hora. ¿Cuántos afiches hace en ${a} horas?` },
  ],
  "÷": [
    { t: (a, b) => `Se reparten ${a} caramelos en partes iguales entre ${b} niños. ¿Cuántos caramelos recibe cada uno?`, small: true },
    { t: (a, b, n) => `${n} guarda ${a} huevos en cajas de ${b}. ¿Cuántas cajas llena?` },
    { t: (a, b) => `Un rollo de ${a} metros de cinta se corta en ${b} trozos iguales. ¿Cuántos metros mide cada trozo?` },
    { t: (a, b) => `${a} alumnos forman ${b} equipos iguales. ¿Cuántos alumnos hay en cada equipo?`, small: true },
    { t: (a, b) => `Un álbum tiene ${a} fotos repartidas por igual en ${b} páginas. ¿Cuántas fotos hay en cada página?`, small: true },
    { t: (a, b) => `Una granja reparte ${a} kilos de alimento por igual entre ${b} corrales. ¿Cuántos kilos recibe cada corral?` },
    { t: (a, b) => `Una fábrica empaca ${a} botellas en cajas de ${b}. ¿Cuántas cajas llena?` },
  ],
};

// Problema de un paso. En «÷», `a` es el dividendo y `b` el divisor (división exacta).
export function story(r: Rng, op: Op, a: number, b: number): Story {
  const big = Math.max(a, b) > 200;
  const tpl = r.pick(STORIES[op].filter((s) => !(big && s.small)));
  return { text: tpl.t(fmt(a), fmt(b), r.pick(NAMES)), answer: calc(op, a, b), equation: `${fmt(a)} ${op} ${fmt(b)}` };
}

// Operandos de un problema de un paso según el tamaño pedido.
export type Size = { add?: [number, number]; mult?: [number, number, number, number]; div?: [number, number, number, number] };
export function operands(r: Rng, op: Op, size: Size = {}): [number, number] {
  const [lo, hi] = size.add ?? [100, 9999];
  if (op === "+") return [r.int(lo, hi), r.int(lo, hi)];
  if (op === "−") {
    const a = r.int(lo * 2, hi);
    return [a, r.int(lo, a - 1)];
  }
  if (op === "×") {
    const [a0, a1, b0, b1] = size.mult ?? [2, 9, 11, 99];
    return [r.int(a0, a1), r.int(b0, b1)];
  }
  const [d0, d1, q0, q1] = size.div ?? [2, 9, 11, 99];
  const d = r.int(d0, d1);
  return [d * r.int(q0, q1), d];
}

// Problema de un paso con respuesta escrita.
export function wordProblem(r: Rng, ops: Op[], size: Size = {}): Question {
  const op = r.pick(ops);
  const [a, b] = operands(r, op, size);
  const s = story(r, op, a, b);
  return numQ(s.answer, s.text, undefined, `${s.equation} = ${fmt(s.answer)}.`, op);
}

const roundLead = (n: number) => {
  const unit = 10 ** (String(n).length - 1);
  return Math.round(n / unit) * unit;
};

// Problema de un paso donde se pide una estimación (se redondea cada dato a su cifra principal).
export function estimateWordProblem(r: Rng, ops: Op[], size: Size = {}): Question {
  const op = r.pick(ops);
  let [a, b] = operands(r, op, size);
  if (op === "÷") {
    // Números compatibles: el dividendo queda cerca de un múltiplo fácil.
    const d = b;
    const q = r.int(2, 9) * r.pick([10, 100]);
    a = d * q;
    const s = story(r, op, a + r.int(1, d - 1), d);
    return choiceQ(r, s.text.replace("¿Cuánt", "Aproximadamente, ¿cuánt"), fmt(q), [q * 10, q / 10, q + (q >= 100 ? 100 : 10), Math.abs(q - (q >= 100 ? 100 : 10)) || q * 2].map(fmt), `${fmt(a)} ÷ ${d} = ${fmt(q)}, y el dividendo está muy cerca de ${fmt(a)}.`, undefined, op);
  }
  if (op === "−" && roundLead(a) === roundLead(b)) [a, b] = [a * 3, b];
  const ra = op === "×" && a < 10 ? a : roundLead(a);
  const rb = op === "×" && b < 10 ? b : roundLead(b);
  const est = calc(op, ra, rb);
  const s = story(r, op, a, b);
  const unit = 10 ** Math.max(0, String(est).length - 1);
  return choiceQ(r, s.text.replace("¿Cuánt", "Aproximadamente, ¿cuánt"), fmt(est), [est + unit, est - unit, est * 10, est + 2 * unit, Math.round(est / 10)].filter((x) => x > 0 && x !== est).map(fmt), `Redondeamos: ${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(est)}.`, undefined, op);
}

// ---------------------------------------------------------------------------
// Comparaciones

// Cosas que se cuentan, con su «¿cuántos?» o «¿cuántas?».
const THINGS: [string, string][] = [["figuritas", "Cuántas"], ["puntos", "Cuántos"], ["canicas", "Cuántas"], ["stickers", "Cuántos"], ["soles", "Cuántos"], ["monedas", "Cuántas"]];

// «¿Cuántos más?» / «tiene n más que»: suma o resta.
export function compareAddSub(r: Rng, lo: number, hi: number): Question {
  const [n1, n2] = twoNames(r);
  const [thing, how] = r.pick(THINGS);
  const small = r.int(lo, hi);
  const diff = r.int(Math.max(2, Math.floor(lo / 4)), Math.max(5, Math.floor(hi / 2)));
  const big = small + diff;
  const form = r.int(0, 2);
  if (form === 0) return numQ(diff, `${n1} tiene ${fmt(big)} ${thing} y ${n2} tiene ${fmt(small)}. ¿${how} ${thing} más tiene ${n1}?`, undefined, `${fmt(big)} − ${fmt(small)} = ${fmt(diff)}.`, "diferencia");
  if (form === 1) return numQ(big, `${n2} tiene ${fmt(small)} ${thing}. ${n1} tiene ${fmt(diff)} más que ${n2}. ¿${how} tiene ${n1}?`, undefined, `${fmt(small)} + ${fmt(diff)} = ${fmt(big)}.`, "mas-que");
  return numQ(small, `${n1} tiene ${fmt(big)} ${thing}. ${n2} tiene ${fmt(diff)} menos que ${n1}. ¿${how} tiene ${n2}?`, undefined, `${fmt(big)} − ${fmt(diff)} = ${fmt(small)}.`, "menos-que");
}

// «n veces»: multiplicación o división. `maxBase` controla el tamaño.
export function compareTimes(r: Rng, maxBase: number, maxTimes = 9, forms: number[] = [0, 1, 2]): Question {
  const [n1, n2] = twoNames(r);
  const [thing, how] = r.pick(THINGS);
  const base = r.int(2, maxBase);
  const k = r.int(2, maxTimes);
  const form = r.pick(forms);
  if (form === 0) return numQ(base * k, `${n1} tiene ${fmt(base)} ${thing}. ${n2} tiene ${k} veces esa cantidad. ¿${how} tiene ${n2}?`, undefined, `${k} × ${fmt(base)} = ${fmt(base * k)}.`, "veces");
  if (form === 1) return numQ(base, `${n2} tiene ${fmt(base * k)} ${thing}, que es ${k} veces lo que tiene ${n1}. ¿${how} tiene ${n1}?`, undefined, `${fmt(base * k)} ÷ ${k} = ${fmt(base)}.`, "cantidad-base");
  return numQ(k, `${n1} tiene ${fmt(base)} ${thing} y ${n2} tiene ${fmt(base * k)}. ¿Cuántas veces lo de ${n1} tiene ${n2}?`, undefined, `${fmt(base * k)} ÷ ${fmt(base)} = ${k}.`, "cuantas-veces");
}

// ¿«n más» o «n veces»?
export function addOrTimes(r: Rng): Question {
  const [n1, n2] = twoNames(r);
  const thing = r.pick(["figuritas", "canicas", "stickers", "monedas"]);
  const base = r.int(3, 12);
  const k = r.int(2, 9);
  const times = r.chance(0.5);
  const answer = times ? base * k : base + k;
  const wrong = times ? base + k : base * k;
  return choiceQ(
    r,
    `${n1} tiene ${base} ${thing}. ${n2} tiene ${times ? `${k} veces esa cantidad` : `${k} más que ${n1}`}. ¿Cuántas tiene ${n2}?`,
    String(answer),
    [wrong, Math.abs(base - k) || base + k + 1, answer + 1, base * k + k].filter((x) => x !== answer).map(String),
    times ? `«${k} veces» es multiplicar: ${k} × ${base} = ${answer}.` : `«${k} más» es sumar: ${base} + ${k} = ${answer}.`,
    undefined,
    times ? "veces" : "mas"
  );
}

// ---------------------------------------------------------------------------
// Ecuaciones

// Elegir la ecuación que representa el problema.
export function writeEquation(r: Rng, ops: Op[] = ["+", "−", "×", "÷"], size: Size = { add: [20, 500] }): Question {
  const op = r.pick(ops);
  const [a, b] = operands(r, op, size);
  const s = story(r, op, a, b);
  const eq = (o: Op, x: number, y: number) => `${fmt(x)} ${o} ${fmt(y)} = n`;
  const answer = eq(op, a, b);
  const wrong = (["+", "−", "×", "÷"] as Op[]).filter((o) => o !== op).map((o) => eq(o, a, b));
  return choiceQ(r, `${s.text} ¿Qué ecuación representa el problema?`, answer, wrong, `La operación es ${answer.replace(" = n", "")}; n = ${fmt(s.answer)}.`, undefined, op);
}

// Resolver ecuaciones de un paso.
export function solveEquation(r: Rng, ops: Op[] = ["+", "−", "×", "÷"], max = 200): Question {
  const op = r.pick(ops);
  const letter = r.pick(["n", "x", "a", "m"]);
  const ask = `¿Cuánto vale ${letter}?`;
  if (op === "+") {
    const x = r.int(5, max);
    const b = r.int(5, max);
    const text = r.chance(0.5) ? `${letter} + ${fmt(b)} = ${fmt(x + b)}` : `${fmt(b)} + ${letter} = ${fmt(x + b)}`;
    return numQ(x, ask, text, `${letter} = ${fmt(x + b)} − ${fmt(b)} = ${fmt(x)}.`, "suma");
  }
  if (op === "−") {
    const x = r.int(10, max);
    const b = r.int(1, x - 1);
    return r.chance(0.5) ? numQ(x, ask, `${letter} − ${fmt(b)} = ${fmt(x - b)}`, `${letter} = ${fmt(x - b)} + ${fmt(b)} = ${fmt(x)}.`, "resta") : numQ(b, ask, `${fmt(x)} − ${letter} = ${fmt(x - b)}`, `${letter} = ${fmt(x)} − ${fmt(x - b)} = ${fmt(b)}.`, "resta");
  }
  const x = r.int(2, 12);
  const b = r.int(2, 12);
  if (op === "×") return numQ(x, ask, r.chance(0.5) ? `${letter} × ${b} = ${x * b}` : `${b} × ${letter} = ${x * b}`, `${letter} = ${x * b} ÷ ${b} = ${x}.`, "multiplicacion");
  return r.chance(0.5) ? numQ(x * b, ask, `${letter} ÷ ${b} = ${x}`, `${letter} = ${x} × ${b} = ${x * b}.`, "division") : numQ(b, ask, `${x * b} ÷ ${letter} = ${x}`, `${letter} = ${x * b} ÷ ${x} = ${b}.`, "division");
}

// Resolver un problema de suma o resta con su ecuación.
export function equationProblem(r: Rng, lo = 50, hi = 900): Question {
  const n = r.pick(NAMES);
  const total = r.int(lo * 2, hi);
  const part = r.int(Math.floor(lo / 2), total - 10);
  const rest = total - part;
  const forms: [string, string][] = [
    [`${n} tenía algunas figuritas. Le regalaron ${fmt(part)} y ahora tiene ${fmt(total)}. ¿Cuántas tenía al inicio?`, `n + ${fmt(part)} = ${fmt(total)}`],
    [`${n} tenía ${fmt(total)} soles. Gastó una parte y le quedan ${fmt(part)}. ¿Cuánto gastó?`, `${fmt(total)} − n = ${fmt(part)}`],
    [`Un bus llevaba ${fmt(part)} pasajeros. Subieron algunos más y ahora hay ${fmt(total)}. ¿Cuántos subieron?`, `${fmt(part)} + n = ${fmt(total)}`],
    [`En una caja hay ${fmt(total)} canicas entre rojas y azules; ${fmt(part)} son rojas. ¿Cuántas son azules?`, `${fmt(part)} + n = ${fmt(total)}`],
  ];
  const [text, eq] = r.pick(forms);
  return numQ(rest, text, `${eq}\nn = ?`, `${eq}, entonces n = ${fmt(total)} − ${fmt(part)} = ${fmt(rest)}.`);
}

// ---------------------------------------------------------------------------
// Varios pasos

const strip = (total: string | undefined, parts: [string, number][]): Visual => ({ kind: "strip", total, bars: [{ parts: parts.map(([text, w]) => ({ text, w })) }] });
const w = (n: number, total: number) => Math.max(2, Math.round((n / total) * 12));

type Multi = { text: string; answer: number; equation: string; visual?: Visual };

// Dos pasos de suma y resta.
function addSubSteps(r: Rng, lo: number, hi: number): Multi {
  const n = r.pick(NAMES);
  const a = r.int(lo, hi);
  const b = r.int(lo, hi);
  const form = r.int(0, 3);
  if (form === 0) {
    const c = r.int(lo, a + b - 1);
    return { text: `${n} tenía ${fmt(a)} soles. Ganó ${fmt(b)} más y luego gastó ${fmt(c)}. ¿Cuántos soles tiene ahora?`, answer: a + b - c, equation: `${fmt(a)} + ${fmt(b)} − ${fmt(c)}`, visual: strip(`${fmt(a)} + ${fmt(b)}`, [[fmt(c), w(c, a + b)], ["?", w(a + b - c, a + b)]]) };
  }
  if (form === 1) {
    const c = r.int(lo, hi);
    return { text: `Una tienda vendió ${fmt(a)} panes el lunes, ${fmt(b)} el martes y ${fmt(c)} el miércoles. ¿Cuántos panes vendió en los tres días?`, answer: a + b + c, equation: `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`, visual: strip("?", [[fmt(a), w(a, a + b + c)], [fmt(b), w(b, a + b + c)], [fmt(c), w(c, a + b + c)]]) };
  }
  if (form === 2) {
    const total = a + b + r.int(lo, hi);
    return { text: `Un colegio tiene ${fmt(total)} alumnos. ${fmt(a)} están en primaria, ${fmt(b)} en secundaria y el resto en inicial. ¿Cuántos alumnos están en inicial?`, answer: total - a - b, equation: `${fmt(total)} − ${fmt(a)} − ${fmt(b)}`, visual: strip(fmt(total), [[fmt(a), w(a, total)], [fmt(b), w(b, total)], ["?", w(total - a - b, total)]]) };
  }
  const total = a + b + r.int(lo, hi);
  return { text: `Un camión debe repartir ${fmt(total)} cajas. En la mañana repartió ${fmt(a)} y en la tarde ${fmt(b)}. ¿Cuántas cajas le faltan repartir?`, answer: total - a - b, equation: `${fmt(total)} − ${fmt(a)} − ${fmt(b)}`, visual: strip(fmt(total), [[fmt(a), w(a, total)], [fmt(b), w(b, total)], ["?", w(total - a - b, total)]]) };
}

// Dos pasos con multiplicación.
function multSteps(r: Rng, maxB: number, maxA = 9): Multi {
  const n = r.pick(NAMES);
  const a = r.int(maxA > 9 ? 11 : 2, maxA);
  const b = r.int(6, maxB);
  const form = r.int(0, 3);
  if (form === 0) {
    const c = r.int(5, 60);
    return { text: `${n} compró ${a} cajas con ${b} galletas cada una y además tenía ${c} galletas sueltas. ¿Cuántas galletas tiene en total?`, answer: a * b + c, equation: `${a} × ${b} + ${c}`, visual: strip("?", [...Array.from({ length: a }, (): [string, number] => [String(b), 2]), [String(c), 2]]) };
  }
  if (form === 1) {
    const c = r.int(2, Math.min(40, a * b - 1));
    return { text: `En un salón hay ${a} filas de ${b} sillas. Se retiran ${c} sillas. ¿Cuántas sillas quedan?`, answer: a * b - c, equation: `${a} × ${b} − ${c}`, visual: strip(`${a} × ${b}`, [[String(c), 3], ["?", 9]]) };
  }
  if (form === 2) {
    const a2 = r.int(2, 9);
    const b2 = r.int(6, maxB);
    return { text: `Una tienda vendió ${a} polos a ${b} soles cada uno y ${a2} gorras a ${b2} soles cada una. ¿Cuántos soles recibió en total?`, answer: a * b + a2 * b2, equation: `${a} × ${b} + ${a2} × ${b2}`, visual: strip("?", [[`${a} × ${b}`, 6], [`${a2} × ${b2}`, 6]]) };
  }
  const k = r.int(2, 5);
  return { text: `${n} tiene ${b} canicas. Su hermano tiene ${k} veces esa cantidad. ¿Cuántas canicas tienen entre los dos?`, answer: b + k * b, equation: `${b} + ${k} × ${b}`, visual: { kind: "strip", bars: [{ label: n, parts: [{ text: String(b), w: 1 }, ...Array.from({ length: k - 1 }, () => ({ text: "", w: 1 }))] }, { label: "Hermano", parts: Array.from({ length: k }, () => ({ text: String(b), w: 1 })) }] } };
}

// Dos pasos con división exacta.
function divSteps(r: Rng, maxQ: number): Multi {
  const n = r.pick(NAMES);
  const d = r.int(2, 9);
  const q = r.int(4, maxQ);
  const form = r.int(0, 2);
  if (form === 0) {
    const a = r.int(1, d * q - 1);
    const b = d * q - a;
    return { text: `${n} tiene ${a} canicas rojas y ${b} azules. Las reparte todas por igual en ${d} bolsas. ¿Cuántas canicas pone en cada bolsa?`, answer: q, equation: `(${a} + ${b}) ÷ ${d}`, visual: strip(`${a} + ${b}`, Array.from({ length: d }, (): [string, number] => ["?", 1])) };
  }
  if (form === 1) {
    const c = r.int(1, 30);
    return { text: `Una profesora tenía ${d * q + c} hojas. Usó ${c} y repartió el resto por igual entre ${d} grupos. ¿Cuántas hojas recibió cada grupo?`, answer: q, equation: `(${d * q + c} − ${c}) ÷ ${d}`, visual: strip(String(d * q + c), [[String(c), 2], ...Array.from({ length: d }, (): [string, number] => ["?", 2])]) };
  }
  const price = r.int(2, 9);
  return { text: `${n} repartió ${d * q} stickers por igual en ${d} sobres y vende cada sticker a ${price} soles. ¿Cuántos soles recibe por un sobre?`, answer: q * price, equation: `${d * q} ÷ ${d} × ${price}` };
}

export type MultiKind = "addsub" | "mult" | "div" | "any";
function multi(r: Rng, kind: MultiKind, level: number): Multi {
  const k = kind === "any" ? r.pick<MultiKind>(["addsub", "mult", "div"]) : kind;
  if (k === "addsub") return addSubSteps(r, level === 1 ? 20 : 150, level === 1 ? 400 : 4000);
  // Nivel 3: los dos factores son de dos cifras.
  if (k === "mult") return level === 3 ? multSteps(r, 99, 40) : multSteps(r, level === 1 ? 30 : 99);
  return divSteps(r, level === 1 ? 20 : 60);
}

// Problemas de varios pasos. `mode`: respuesta escrita, con diagrama
// de tiras, con la ecuación a la vista o eligiendo la ecuación.
export function multiStep(r: Rng, kind: MultiKind, mode: "plain" | "strip" | "equation" | "chooseEquation" = "plain", level = 2): Question {
  let m = multi(r, kind, level);
  if (mode === "strip") for (let i = 0; i < 20 && !m.visual; i++) m = multi(r, kind, level);
  const why = `${m.equation} = ${fmt(m.answer)}.`;
  if (mode === "chooseEquation") {
    // Se cambia un operador a la vez por otro.
    const tokens = m.equation.split(" ");
    const wrong: string[] = [];
    tokens.forEach((t, i) => {
      if (!"+−×÷".includes(t) || t.length !== 1) return;
      for (const other of ["+", "−", "×", "÷"]) if (other !== t) wrong.push(tokens.map((x, k) => (k === i ? other : x)).join(" "));
    });
    return choiceQ(r, `${m.text} ¿Qué expresión resuelve el problema?`, m.equation, wrong, why, undefined, kind);
  }
  return numQ(m.answer, m.text, mode === "strip" ? m.visual : mode === "equation" ? `${m.equation} = n` : undefined, why, kind);
}

// Interpretar el residuo.
export function remainderProblem(r: Rng, maxQ: number): Question {
  const d = r.int(3, 9);
  const q = r.int(3, maxQ);
  const rem = r.int(1, d - 1);
  const total = d * q + rem;
  const form = r.int(0, 3);
  const why = `${fmt(total)} ÷ ${d} = ${q} y sobran ${rem}.`;
  if (form === 0) return numQ(q + 1, `${fmt(total)} personas viajan en botes de ${d} asientos. ¿Cuántos botes se necesitan para que viajen todas?`, undefined, `${why} Hace falta un bote más para las que sobran: ${q + 1}.`, "uno-mas");
  if (form === 1) return numQ(q, `Hay ${fmt(total)} huevos y se guardan en cajas de ${d}. ¿Cuántas cajas se llenan por completo?`, undefined, `${why} Solo se llenan ${q} cajas.`, "cociente");
  if (form === 2) return numQ(rem, `Se reparten ${fmt(total)} stickers por igual entre ${d} amigos, dando la mayor cantidad posible. ¿Cuántos stickers sobran?`, undefined, why, "residuo");
  return numQ(d - rem, `Una panadera hornea ${fmt(total)} panes y los pone en bandejas de ${d}. ¿Cuántos panes más necesita para completar la última bandeja?`, undefined, `${why} Para completar otra bandeja faltan ${d} − ${rem} = ${d - rem}.`, "faltan");
}

// ¿qué respuesta es razonable?
export function reasonableAnswer(r: Rng, kind: MultiKind = "any"): Question {
  const m = multi(r, kind, 2);
  const unit = 10 ** Math.max(1, String(m.answer).length - 1);
  const est = Math.max(unit, Math.round(m.answer / unit) * unit);
  return choiceQ(r, `${m.text} ¿Qué respuesta es razonable?`, `Cerca de ${fmt(est)}`, [est * 10, Math.round(est / 10), est * 3, est + 5 * unit].filter((x) => x > 0 && x !== est).map((x) => `Cerca de ${fmt(x)}`), `${m.equation} = ${fmt(m.answer)}, que está cerca de ${fmt(est)}.`);
}

// Problemas con datos de más o con un dato que falta.
export function extraOrMissing(r: Rng): Question {
  const n = r.pick(NAMES);
  const a = r.int(3, 9);
  const b = r.int(4, 20);
  const extra = r.int(7, 15);
  if (r.chance(0.5)) {
    return numQ(a * b, `${n} tiene ${extra} años. Compró ${a} bolsas con ${b} caramelos cada una. ¿Cuántos caramelos compró?`, undefined, `La edad no se necesita: ${a} × ${b} = ${a * b}.`, "dato-de-mas");
  }
  const cases: [string, string, string[]][] = [
    [`${n} compró ${a} cuadernos. ¿Cuánto pagó en total?`, "El precio de cada cuaderno", ["La edad que tiene el vendedor", "El color de las tapas", "La hora exacta de la compra"]],
    [`Un bus lleva ${b} pasajeros en cada viaje. ¿Cuántos pasajeros llevó hoy?`, "Cuántos viajes hizo hoy", ["El nombre completo del chofer", "El precio del pasaje", "De qué color es el bus"]],
    [`${n} repartió sus canicas por igual entre ${a} amigos. ¿Cuántas recibió cada uno?`, "Cuántas canicas tenía", ["El tamaño que tiene cada canica", "La edad de sus amigos", "Qué día las repartió"]],
    [`${n} leyó ${b} páginas hoy. ¿Cuántas páginas le faltan para terminar el libro?`, "Cuántas páginas tiene el libro", ["El nombre del autor", "Cuánto le costó el libro en la librería", "A qué hora leyó"]],
    [`Una caja trae ${b} lápices. ¿Cuántos lápices hay en el almacén?`, "Cuántas cajas hay", ["El color de los lápices", "Cuánto pesa cada caja llena", "La marca"]],
    [`${n} ahorra la misma cantidad cada semana. ¿Cuánto junta en ${a} semanas?`, "Cuánto ahorra por semana", ["En qué gasta su dinero normalmente", "Dónde guarda la plata", "Su edad"]],
  ];
  const [text, answer, wrong] = r.pick(cases);
  return choiceQ(r, `${text} ¿Qué dato falta para resolverlo?`, answer, wrong, `Sin ese dato no se puede calcular: falta saber ${answer[0].toLowerCase()}${answer.slice(1)}.`, undefined, "dato-que-falta");
}

// Tantear y comprobar.
export function guessAndCheck(r: Rng): Question {
  if (r.chance(0.5)) {
    const hens = r.int(2, 9);
    const rabbits = r.int(2, 9);
    const askHens = r.chance(0.5);
    return numQ(askHens ? hens : rabbits, `En un corral hay gallinas y conejos. En total hay ${hens + rabbits} animales y ${hens * 2 + rabbits * 4} patas. ¿Cuántos ${askHens ? "gallinas" : "conejos"} hay?`.replace("Cuántos gallinas", "Cuántas gallinas"), undefined, `Con ${hens} gallinas y ${rabbits} conejos: ${hens} × 2 + ${rabbits} × 4 = ${hens * 2 + rabbits * 4} patas.`, "patas");
  }
  const [n1, n2] = twoNames(r);
  const small = r.int(3, 30);
  const diff = r.int(2, 15);
  return numQ(small + diff, `${n1} y ${n2} tienen ${small * 2 + diff} stickers entre los dos. ${n1} tiene ${diff} más que ${n2}. ¿Cuántos stickers tiene ${n1}?`, undefined, `${n1} tiene ${small + diff} y ${n2} tiene ${small}: suman ${small * 2 + diff} y la diferencia es ${diff}.`, "suma-y-diferencia");
}

// Distractores útiles para otros archivos.
export const wrongNums = (r: Rng, answer: number, extra: number[] = []) => nearNums(r, answer, extra).map(fmt);
