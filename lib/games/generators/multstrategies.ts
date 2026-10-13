import type { Rng } from "../rng";
import type { Question, Visual } from "../types";
import { choiceQ, fixedQ, fmt, nDigits, numQ, symbolQ, table } from "./kit";

// Estrategias para multiplicar y dividir números de varias cifras (4.° en
// adelante): patrones con ceros, estimación, modelos de área, productos y
// cocientes parciales. La cantidad de cifras de cada factor es un parámetro.

// 345 → [300, 40, 5] (sin los ceros).
const parts = (n: number) => [...String(n)].map((d, i, all) => Number(d) * 10 ** (all.length - 1 - i)).filter(Boolean);
const lead = (n: number) => {
  const unit = 10 ** (String(n).length - 1);
  return Math.round(n / unit) * unit;
};
// Número de `digits` cifras sin ceros y que no queda a la mitad al redondear.
function factor(r: Rng, digits: number) {
  if (digits === 1) return r.int(2, 9);
  const ds = Array.from({ length: digits }, () => r.int(1, 9));
  if (ds[1] === 5) ds[1] = 4;
  return Number(ds.join(""));
}

// 4.° J.1 / M.1: patrones al aumentar el valor posicional.
export function zeroPatterns(r: Rng, op: "×" | "÷"): Question {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const rows = [0, 1, 2, 3].map((k) => (op === "×" ? `${a} × ${fmt(b * 10 ** k)} = ${fmt(a * b * 10 ** k)}` : `${fmt(a * b * 10 ** k)} ÷ ${a} = ${fmt(b * 10 ** k)}`));
  const hidden = r.int(1, 3);
  const answer = op === "×" ? a * b * 10 ** hidden : b * 10 ** hidden;
  const shown = rows.map((row, i) => (i === hidden ? row.replace(/= .*/, "= ?") : row));
  return numQ(answer, "Sigue el patrón. ¿Qué número falta?", shown.join("\n"), `${op === "×" ? `${a} × ${b} = ${a * b}` : `${a * b} ÷ ${a} = ${b}`}; luego agregamos ${hidden} ${hidden === 1 ? "cero" : "ceros"}: ${fmt(answer)}.`, `${hidden}-ceros`);
}

// 4.° J.2 / K.1 / K.2: multiplicar por múltiplos de 10, 100 y 1.000.
// `left`: cifras significativas del primer factor; `maxZeros`: ceros del segundo.
export function multByMultiples(r: Rng, left: 1 | 2, maxZeros: number, pure = false): Question {
  const a = left === 1 ? r.int(2, 9) : r.int(11, 99);
  const zeros = r.int(1, maxZeros);
  const b = (pure ? 1 : r.int(2, 9)) * 10 ** zeros;
  const [x, y] = r.chance(0.5) ? [a, b] : [b, a];
  const core = (a * b) / 10 ** zeros;
  return numQ(a * b, "Resuelve la multiplicación.", `${fmt(x)} × ${fmt(y)} = ?`, `${a} × ${b / 10 ** zeros} = ${fmt(core)}; agregamos ${zeros} ${zeros === 1 ? "cero" : "ceros"}: ${fmt(a * b)}.`, `${zeros}-ceros`);
}

// 4.° K.3: problemas con dos múltiplos de diez.
export function tensProblem(r: Rng): Question {
  const a = r.int(2, 9) * 10;
  const b = r.int(2, 9) * 10;
  const text = r.pick([
    `Un almacén tiene ${a} cajas con ${b} cuadernos cada una. ¿Cuántos cuadernos hay?`,
    `Un cine tiene ${a} filas de ${b} asientos. ¿Cuántos asientos tiene?`,
    `Una máquina llena ${b} botellas por minuto. ¿Cuántas botellas llena en ${a} minutos?`,
    `Cada bolsa trae ${b} clips. ¿Cuántos clips hay en ${a} bolsas?`,
  ]);
  return numQ(a * b, text, undefined, `${a / 10} × ${b / 10} = ${(a * b) / 100}; agregamos dos ceros: ${fmt(a * b)}.`);
}

// 4.° J.3 / K.4: estimar productos redondeando a la cifra principal.
export function estimateProductBy(r: Rng, aDigits: 1 | 2, bMin: number, bMax: number): Question {
  const a = factor(r, aDigits);
  const b = factor(r, r.int(bMin, bMax));
  const ra = aDigits === 1 ? a : lead(a);
  const rb = lead(b);
  return numQ(ra * rb, aDigits === 1 ? "Redondea el número mayor a su cifra principal y luego multiplica." : "Redondea cada número a la decena más cercana y luego multiplica.", `${fmt(b)} × ${a} ≈ ?`, `${aDigits === 1 ? "" : `${a} ≈ ${ra}; `}${fmt(b)} ≈ ${fmt(rb)}; ${fmt(rb)} × ${ra} = ${fmt(ra * rb)}.`, `${String(b).length}-cifras`);
}

// Modelo de área de a × b: columnas = partes de b, filas = partes de a.
function model(a: number, b: number, hide?: [number, number]): Visual {
  const top = parts(b);
  const side = parts(a);
  return { kind: "areaModel", top: top.map(fmt), side: side.map(fmt), cells: side.map((s, i) => top.map((t, j) => (hide && hide[0] === i && hide[1] === j ? "?" : fmt(s * t)))) };
}

export type AreaMode = "identify" | "cell" | "total" | "partials" | "expanded" | "plain";

// 4.° J.5 – J.16 / K.6 – K.10: multiplicar con modelos de área, forma
// desarrollada y productos parciales. `aDigits` × `bDigits` cifras.
export function areaMult(r: Rng, aDigits: 1 | 2 | 3, bMin: number, bMax: number, mode: AreaMode, teen = false): Question {
  const a = factor(r, aDigits);
  const b = teen ? r.int(11, 19) : factor(r, r.int(bMin, bMax));
  const top = parts(b);
  const side = parts(a);
  const partials = side.flatMap((s) => top.map((t) => s * t));
  const product = a * b;
  const sumText = partials.map(fmt).join(" + ");
  const tag = `${aDigits}x${String(b).length}`;
  if (mode === "plain") return numQ(product, "Resuelve la multiplicación.", `${fmt(b)} × ${a} = ?`, `Por partes: ${sumText} = ${fmt(product)}.`, tag);
  if (mode === "identify") {
    const reversed = Number([...String(b)].reverse().join(""));
    const wrong = [`${a} × ${fmt(reversed)}`, `${a} × ${fmt(b + 10)}`, `${a + 1} × ${fmt(b)}`, `${a} × ${fmt(Number(top.map((t) => String(t)[0]).join("") + "0"))}`, `${a * 10} × ${fmt(b)}`].filter((w) => w !== `${a} × ${fmt(b)}`);
    return choiceQ(r, "¿Qué multiplicación representa el modelo de área?", `${a} × ${fmt(b)}`, wrong, `Arriba: ${top.map(fmt).join(" + ")} = ${fmt(b)}. Al lado: ${side.length > 1 ? `${side.map(fmt).join(" + ")} = ` : ""}${a}.`, model(a, b), tag);
  }
  if (mode === "cell") {
    const i = r.int(0, side.length - 1);
    const j = r.int(0, top.length - 1);
    return numQ(side[i] * top[j], `El modelo muestra ${a} × ${fmt(b)}. ¿Qué número va en la casilla con «?»?`, model(a, b, [i, j]), `${fmt(side[i])} × ${fmt(top[j])} = ${fmt(side[i] * top[j])}.`, tag);
  }
  if (mode === "total") return numQ(product, `Usa el modelo de área para hallar ${a} × ${fmt(b)}.`, model(a, b), `Sumamos las partes: ${sumText} = ${fmt(product)}.`, tag);
  if (mode === "expanded") {
    const hidden = r.int(0, partials.length);
    const steps = side.flatMap((s) => top.map((t) => `(${fmt(s)} × ${fmt(t)})`)).join(" + ");
    const line = partials.map((p, i) => (i === hidden ? "?" : fmt(p))).join(" + ");
    if (hidden === partials.length) return numQ(product, "Multiplica usando la forma desarrollada. ¿Cuál es el producto?", `${a} × ${fmt(b)}\n= ${steps}\n= ${sumText}\n= ?`, `${sumText} = ${fmt(product)}.`, tag);
    return numQ(partials[hidden], "Multiplica usando la forma desarrollada. ¿Qué número falta?", `${a} × ${fmt(b)}\n= ${steps}\n= ${line}\n= ${fmt(product)}`, `El producto que falta es ${fmt(partials[hidden])}.`, tag);
  }
  // Productos parciales en columna.
  const hidden = r.int(0, partials.length);
  const width = fmt(product).length + 2;
  const pad = (s: string) => s.padStart(width, " ");
  const lines = [pad(fmt(b)), pad(`× ${a}`), "─".repeat(width), ...partials.map((p, i) => pad(i === hidden ? "?" : fmt(p))), "─".repeat(width), pad(hidden === partials.length ? "?" : fmt(product))];
  const visual: Visual = { kind: "code", text: lines.join("\n") };
  if (hidden === partials.length) return numQ(product, "Suma los productos parciales. ¿Cuál es el producto?", visual, `${sumText} = ${fmt(product)}.`, tag);
  return numQ(partials[hidden], "¿Qué producto parcial falta?", visual, `Los productos parciales son ${sumText}; falta ${fmt(partials[hidden])}.`, tag);
}

// 4.° J.8: multiplicar con la propiedad distributiva.
export function multDistributive(r: Rng, bMin = 2, bMax = 2): Question {
  const a = factor(r, 1);
  const b = factor(r, r.int(bMin, bMax));
  const steps = parts(b).map((t) => `(${a} × ${fmt(t)})`).join(" + ");
  return numQ(a * b, "Multiplica usando la propiedad distributiva.", `${a} × ${fmt(b)} = ${steps} = ?`, `${parts(b).map((t) => fmt(a * t)).join(" + ")} = ${fmt(a * b)}.`);
}

// 4.° J.19: multiplicar tres números.
export function multThree(r: Rng): Question {
  const [a, b, c] = r.shuffle([r.int(2, 9), r.int(2, 6), r.pick([2, 3, 4, 5, 10])]);
  return numQ(a * b * c, "Resuelve la multiplicación.", `${a} × ${b} × ${c} = ?`, `${a} × ${b} = ${a * b}; ${a * b} × ${c} = ${a * b * c}. Puedes agrupar los factores como te resulte más fácil.`);
}

// 4.° L.3: comparar un producto con un número o con otro producto.
export function multInequality(r: Rng, aDigits: 1 | 2 = 2): Question {
  const a = factor(r, aDigits);
  const b = factor(r, 2);
  const p = a * b;
  if (r.chance(0.5)) {
    const other = r.chance(0.2) ? p : Math.max(10, p + r.pick([-1, 1]) * r.int(1, Math.max(3, Math.floor(p / 6))));
    return symbolQ(p, other, `${a} × ${b}`, fmt(other), `${a} × ${b} = ${fmt(p)}.`);
  }
  const c = factor(r, aDigits);
  const d = factor(r, 2);
  return symbolQ(p, c * d, `${a} × ${b}`, `${c} × ${d}`, `${a} × ${b} = ${fmt(p)} y ${c} × ${d} = ${fmt(c * d)}.`);
}

// 4.° L.4: usar una multiplicación conocida para completar otra.
export function relatedProduct(r: Rng): Question {
  const a = r.int(11, 40);
  const b = r.int(11, 30);
  const p = a * b;
  const forms: [string, number, string][] = [
    [`${a} × ${b + 1}`, p + a, `Es un grupo más de ${a}: ${fmt(p)} + ${a}`],
    [`${a} × ${b - 1}`, p - a, `Es un grupo menos de ${a}: ${fmt(p)} − ${a}`],
    [`${a * 2} × ${b}`, p * 2, `Un factor es el doble: ${fmt(p)} × 2`],
    [`${a} × ${b * 10}`, p * 10, `Un factor es 10 veces mayor: ${fmt(p)} × 10`],
    [`${a + 1} × ${b}`, p + b, `Es un grupo más de ${b}: ${fmt(p)} + ${b}`],
  ];
  const [text, answer, how] = r.pick(forms);
  return numQ(answer, "Usa la primera multiplicación para completar la segunda.", `${a} × ${b} = ${fmt(p)}\n${text} = ?`, `${how} = ${fmt(answer)}.`);
}

// ---------------------------------------------------------------------------
// División entre números de una cifra

// 4.° M.2: dividir números que terminan en ceros.
export function divZeros(r: Rng, maxZeros = 3): Question {
  const d = r.int(2, 9);
  const q = r.int(2, 9);
  const zeros = r.int(1, maxZeros);
  return numQ(q * 10 ** zeros, "Resuelve la división.", `${fmt(d * q * 10 ** zeros)} ÷ ${d} = ?`, `${d * q} ÷ ${d} = ${q}; agregamos ${zeros} ${zeros === 1 ? "cero" : "ceros"}: ${fmt(q * 10 ** zeros)}.`, `${zeros}-ceros`);
}
export function divZerosProblem(r: Rng): Question {
  const d = r.int(2, 9);
  const q = r.int(2, 9) * r.pick([10, 100]);
  const text = r.pick([
    `Una fábrica reparte ${fmt(d * q)} botellas por igual en ${d} camiones. ¿Cuántas botellas lleva cada camión?`,
    `Un agricultor siembra ${fmt(d * q)} plantas en ${d} filas iguales. ¿Cuántas plantas hay en cada fila?`,
    `Se guardan ${fmt(d * q)} hojas en ${d} paquetes iguales. ¿Cuántas hojas tiene cada paquete?`,
    `Un premio de ${fmt(d * q)} soles se reparte por igual entre ${d} personas. ¿Cuántos soles recibe cada una?`,
  ]);
  return numQ(q, text, undefined, `${fmt(d * q)} ÷ ${d} = ${fmt(q)}.`);
}

// Dividendo cercano a un múltiplo fácil de d.
function compatible(r: Rng) {
  const d = r.int(3, 9);
  const q = r.int(2, 9) * r.pick([10, 100]);
  const dividend = d * q + r.pick([-1, 1]) * r.int(1, d - 1) * (q >= 100 ? r.int(1, 4) : 1);
  return { d, q, dividend };
}

// 4.° M.3: estimar cocientes con números compatibles.
export function estimateQuotientBig(r: Rng): Question {
  const { d, q, dividend } = compatible(r);
  return choiceQ(r, `Usa números compatibles para estimar ${fmt(dividend)} ÷ ${d}.`, fmt(q), [q + (q >= 100 ? 100 : 10), Math.abs(q - (q >= 100 ? 100 : 10)) || q * 3, q * 10, q / 10].map(fmt), `${fmt(dividend)} está cerca de ${fmt(d * q)}, y ${fmt(d * q)} ÷ ${d} = ${fmt(q)}.`, `${fmt(dividend)} ÷ ${d} ≈ ?`);
}

// 4.° M.4: elegir la mejor estimación.
export function betterEstimate(r: Rng): Question {
  const { d, q, dividend } = compatible(r);
  const other = r.chance(0.5) ? q * 10 : q / 10;
  const options = [q, other].sort((a, b) => a - b).map(fmt);
  return fixedQ(`¿Cuál es la mejor estimación de ${fmt(dividend)} ÷ ${d}?`, options, fmt(q), `${d} × ${fmt(q)} = ${fmt(d * q)}, muy cerca de ${fmt(dividend)}. En cambio ${d} × ${fmt(other)} = ${fmt(d * other)}.`);
}

// 4.° M.5: dividir con matrices.
export function divArray(r: Rng): Question {
  const d = r.int(2, 6);
  const q = r.int(Math.ceil(10 / d), 10);
  return numQ(q, `La matriz tiene ${d * q} fichas en ${d} filas iguales. ¿Cuánto es ${d * q} ÷ ${d}?`, { kind: "array", emoji: "🔵", rows: d, cols: q }, `Cada fila tiene ${q} fichas: ${d * q} ÷ ${d} = ${q}.`);
}

// Cociente partido en trozos fáciles: 96 ÷ 4 → [20, 4]; 525 ÷ 5 → [100, 5].
const chunks = (q: number) => parts(q);

// 4.° M.6 / M.11: dividir con modelos de área.
export function divAreaModel(r: Rng, digits: 2 | 3): Question {
  const d = r.int(2, 9);
  const q = digits === 2 ? r.int(11, Math.floor(99 / d)) : r.int(Math.ceil(100 / d), Math.floor(999 / d));
  if (q < 11 || chunks(q).length < 2) return divAreaModel(r, digits);
  const cs = chunks(q);
  const hidden = r.int(0, cs.length);
  const visual: Visual = { kind: "areaModel", side: [String(d)], top: cs.map((c, i) => (i === hidden ? "?" : fmt(c))), cells: [cs.map((c) => fmt(c * d))] };
  const why = `${cs.map((c) => `${fmt(c * d)} ÷ ${d} = ${fmt(c)}`).join("; ")}. Cociente: ${cs.map(fmt).join(" + ")} = ${fmt(q)}.`;
  if (hidden === cs.length) return numQ(q, `Usa el modelo de área para hallar ${fmt(d * q)} ÷ ${d}.`, visual, why, "cociente");
  return numQ(cs[hidden], `El modelo muestra ${fmt(d * q)} ÷ ${d}. ¿Qué número va en lugar de «?»?`, visual, why, "parte");
}

// 4.° M.7: dividir con la propiedad distributiva.
export function divDistributive(r: Rng): Question {
  const d = r.int(2, 9);
  const q = r.int(11, Math.max(12, Math.floor(99 / d)));
  const cs = chunks(q).length < 2 ? [q - 1, 1] : chunks(q);
  return numQ(q, "Divide por partes.", `${d * q} ÷ ${d} = (${cs.map((c) => `${c * d} ÷ ${d}`).join(") + (")}) = ?`, `${cs.join(" + ")} = ${q}.`);
}

// 4.° M.8 / M.9 / M.14: dividir entre una cifra. `exact`: sin residuo;
// si no, se pregunta el cociente o el residuo.
export function divideBy1(r: Rng, minDigits: number, maxDigits: number, exact: boolean, maxQ?: number): Question {
  for (;;) {
    const d = r.int(2, 9);
    const dividend = maxQ ? d * r.int(2, maxQ) + (exact ? 0 : r.int(0, d - 1)) : nDigits(r, r.int(minDigits, maxDigits));
    const q = Math.floor(dividend / d);
    const rem = dividend % d;
    if (String(dividend).length < minDigits || String(dividend).length > maxDigits) continue;
    if (exact && rem !== 0) {
      const fixed = dividend - rem;
      if (String(fixed).length < minDigits) continue;
      return numQ(q, "Resuelve la división.", `${fmt(fixed)} ÷ ${d} = ?`, `${fmt(fixed)} ÷ ${d} = ${fmt(q)}, porque ${d} × ${fmt(q)} = ${fmt(fixed)}.`, "exacta");
    }
    if (exact) return numQ(q, "Resuelve la división.", `${fmt(dividend)} ÷ ${d} = ?`, `${fmt(dividend)} ÷ ${d} = ${fmt(q)}, porque ${d} × ${fmt(q)} = ${fmt(dividend)}.`, "exacta");
    const why = `${d} × ${fmt(q)} = ${fmt(d * q)}; ${fmt(dividend)} − ${fmt(d * q)} = ${rem}. Cociente ${fmt(q)}, residuo ${rem}.`;
    return r.chance(0.5) ? numQ(q, `Divide ${fmt(dividend)} ÷ ${d}. ¿Cuál es el cociente?`, `${fmt(dividend)} ÷ ${d}`, why, "cociente") : numQ(rem, `Divide ${fmt(dividend)} ÷ ${d}. ¿Cuál es el residuo?`, `${fmt(dividend)} ÷ ${d}`, why, "residuo");
  }
}

// 4.° M.10: completar la tabla de divisiones.
export function divisionTable(r: Rng): Question {
  const rows = Array.from({ length: 3 }, () => {
    const d = r.int(2, 9);
    const q = r.int(4, Math.floor(99 / d));
    const rem = r.int(0, d - 1);
    return { dividend: d * q + rem, d, q, rem };
  }).filter((row) => row.dividend < 100);
  if (rows.length < 2) return divisionTable(r);
  const at = r.int(0, rows.length - 1);
  const col = r.pick(["q", "rem"] as const);
  const row = rows[at];
  return numQ(
    row[col],
    `Completa la tabla. ¿Qué ${col === "q" ? "cociente" : "residuo"} falta?`,
    table(["Dividendo", "Divisor", "Cociente", "Residuo"], rows.map((x, i) => [String(x.dividend), String(x.d), i === at && col === "q" ? "?" : String(x.q), i === at && col === "rem" ? "?" : String(x.rem)])),
    `${row.dividend} ÷ ${row.d} = ${row.q} y sobran ${row.rem}, porque ${row.d} × ${row.q} = ${row.d * row.q}.`,
    col === "q" ? "cociente" : "residuo"
  );
}

// 4.° M.12 / M.13: cocientes parciales.
export function partialQuotients(r: Rng, withRemainder: boolean): Question {
  const d = r.int(2, 9);
  const q = r.int(12, r.pick([40, 150]));
  const cs = chunks(q);
  if (cs.length < 2) return partialQuotients(r, withRemainder);
  const rem = withRemainder ? r.int(1, d - 1) : 0;
  const dividend = d * q + rem;
  let left = dividend;
  const steps = cs.map((c) => {
    const line = `${d} × ${fmt(c)} = ${fmt(c * d)}   →   quedan ${fmt(left - c * d)}`;
    left -= c * d;
    return line;
  });
  const text = `${fmt(dividend)} ÷ ${d}\n${steps.join("\n")}`;
  const why = `Sumamos los cocientes parciales: ${cs.map(fmt).join(" + ")} = ${fmt(q)}${rem ? `; sobran ${rem}` : ""}.`;
  if (withRemainder && r.chance(0.4)) return numQ(rem, "Mira los cocientes parciales. ¿Cuál es el residuo?", text, why, "residuo");
  return numQ(q, "Suma los cocientes parciales. ¿Cuál es el cociente?", text, why, "cociente");
}

// 4.° M.15: comparar un cociente con un número o con otro cociente.
export function divInequality(r: Rng, maxQ = 60): Question {
  const make = (): [string, number] => {
    const d = r.int(2, 9);
    const q = r.int(5, maxQ);
    return [`${fmt(d * q)} ÷ ${d}`, q];
  };
  const [left, lv] = make();
  if (r.chance(0.5)) {
    const other = r.chance(0.25) ? lv : Math.max(1, lv + r.pick([-1, 1]) * r.int(1, 6));
    return symbolQ(lv, other, left, String(other), `${left} = ${lv}.`);
  }
  const [right, rv] = make();
  return symbolQ(lv, rv, left, right, `${left} = ${lv} y ${right} = ${rv}.`);
}

// 4.° M.16: estimar para comparar cocientes.
export function compareQuotients(r: Rng): Question {
  for (;;) {
    const a = compatible(r);
    const b = compatible(r);
    if (a.q === b.q || Math.max(a.q, b.q) < Math.min(a.q, b.q) * 1.5) continue;
    const ta = `${fmt(a.dividend)} ÷ ${a.d}`;
    const tb = `${fmt(b.dividend)} ÷ ${b.d}`;
    if (ta === tb) continue;
    const greater = r.chance(0.5);
    const answer = (a.q > b.q) === greater ? ta : tb;
    return fixedQ(`Estima. ¿Qué cociente es ${greater ? "mayor" : "menor"}?`, [ta, tb], answer, `${ta} ≈ ${fmt(a.q)} y ${tb} ≈ ${fmt(b.q)}.`, undefined, greater ? "mayor" : "menor");
  }
}
