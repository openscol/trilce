import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, distinct, fixedQ, nearCents, numQ, soles, sum, symbolQ, table } from "./kit";

// Dinero (4.° en adelante), en soles y céntimos. Los montos se guardan en
// céntimos (enteros) y las respuestas con decimales van como opción múltiple.

const COINS = [10, 20, 50, 100, 200, 500];
const NAME: Record<number, [string, string]> = { 10: ["moneda de 10 céntimos", "monedas de 10 céntimos"], 20: ["moneda de 20 céntimos", "monedas de 20 céntimos"], 50: ["moneda de 50 céntimos", "monedas de 50 céntimos"], 100: ["moneda de S/ 1", "monedas de S/ 1"], 200: ["moneda de S/ 2", "monedas de S/ 2"], 500: ["moneda de S/ 5", "monedas de S/ 5"], 1000: ["billete de S/ 10", "billetes de S/ 10"], 2000: ["billete de S/ 20", "billetes de S/ 20"], 5000: ["billete de S/ 50", "billetes de S/ 50"], 10000: ["billete de S/ 100", "billetes de S/ 100"] };

const money = (r: Rng, answer: number, prompt: string, explanation: string, visual?: Question["visual"], tag?: string, extra: number[] = []) => choiceQ(r, prompt, soles(answer), nearCents(r, answer, soles, extra, 10), explanation, visual, tag);

// Un puñado de billetes y monedas (de mayor a menor).
function purse(r: Rng, maxBill: number) {
  const bills = [1000, 2000, 5000, 10000].filter((b) => b <= maxBill);
  const kinds = [...r.shuffle(bills).slice(0, r.int(1, 2)), ...r.shuffle(COINS).slice(0, r.int(2, 3))].sort((a, b) => b - a);
  const counts = kinds.map((k) => (k >= 1000 ? r.int(1, 2) : r.int(1, 3)));
  return { kinds, counts, items: kinds.flatMap((k, i) => Array.from({ length: counts[i] }, () => k)), total: sum(kinds.map((k, i) => k * counts[i])) };
}
const describe = (p: { kinds: number[]; counts: number[] }) => p.kinds.map((k, i) => `${p.counts[i]} ${NAME[k][p.counts[i] === 1 ? 0 : 1]}`).join(", ").replace(/, ([^,]*)$/, " y $1");

// 4.° Q.1 / Q.2: contar billetes y monedas (`words`: como problema, sin dibujo).
export function countMoney(r: Rng, maxBill: number, words: boolean): Question {
  const p = purse(r, maxBill);
  const why = `${p.kinds.map((k, i) => `${p.counts[i]} × ${soles(k)}`).join(" + ")} = ${soles(p.total)}.`;
  if (words) return money(r, p.total, `${r.pick(NAMES)} tiene ${describe(p)}. ¿Cuánto dinero tiene en total?`, why);
  return money(r, p.total, "¿Cuánto dinero hay en total?", why, { kind: "coins", coins: p.items });
}

// 4.° Q.3: comparar cantidades de dinero.
export function compareMoney(r: Rng): Question {
  const a = r.int(2, 99) * 100 + r.pick([0, 5, 10, 20, 50, 90]);
  const b = r.chance(0.15) ? a : r.chance(0.5) ? Math.floor(a / 100) * 100 + r.pick([5, 50, 80, 95]) : a + r.pick([-1, 1]) * r.pick([100, 1000]);
  const other = b > 0 ? b : a + 100;
  return symbolQ(a, other, soles(a), soles(other), a === other ? "Las dos cantidades son iguales." : `Comparamos primero los soles y luego los céntimos: ${soles(Math.max(a, other))} es más que ${soles(Math.min(a, other))}.`);
}

const price = (r: Rng, maxSoles: number) => r.int(1, maxSoles - 1) * 100 + r.pick([0, 10, 20, 50, 50, 80, 90]);

// 4.° Q.4: sumar y restar cantidades de dinero.
export function addSubMoney(r: Rng, maxSoles = 50): Question {
  let a = price(r, maxSoles);
  let b = price(r, maxSoles);
  const add = r.chance(0.5);
  if (!add && a < b) [a, b] = [b, a];
  if (!add && a === b) a += 150;
  const answer = add ? a + b : a - b;
  return money(r, answer, "Resuelve.", `${soles(a)} ${add ? "+" : "−"} ${soles(b)} = ${soles(answer)}.`, { kind: "text", text: `${soles(a)} ${add ? "+" : "−"} ${soles(b)} = ?` }, add ? "suma" : "resta");
}

const ITEMS = ["un cuaderno", "una pelota", "un libro", "una mochila", "un juego de mesa", "una lonchera", "un polo", "una gorra"];
const BILLS = [1000, 2000, 5000, 10000];

// 4.° Q.5: hallar el vuelto, el precio o lo que se pagó.
export function changeProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const item = r.pick(ITEMS);
  const cost = price(r, 90);
  const paid = BILLS.find((b) => b > cost)!;
  const change = paid - cost;
  const form = r.int(0, 2);
  if (form === 0) return money(r, change, `${n} compra ${item} que cuesta ${soles(cost)} y paga con ${soles(paid)}. ¿Cuánto recibe de vuelto?`, `${soles(paid)} − ${soles(cost)} = ${soles(change)}.`, undefined, "vuelto");
  if (form === 1) return money(r, cost, `${n} paga ${item} con ${soles(paid)} y recibe ${soles(change)} de vuelto. ¿Cuánto costó?`, `${soles(paid)} − ${soles(change)} = ${soles(cost)}.`, undefined, "precio");
  return money(r, paid, `${n} compra ${item} que cuesta ${soles(cost)} y recibe ${soles(change)} de vuelto. ¿Con cuánto pagó?`, `${soles(cost)} + ${soles(change)} = ${soles(paid)}.`, undefined, "pago", BILLS);
}

// Tienda, precio máximo (en soles) y productos.
const MENU: [string, number, string[]][] = [
  ["Librería", 15, ["Lápiz", "Cuaderno", "Regla", "Plumones", "Borrador", "Tijera"]],
  ["Quiosco", 8, ["Jugo", "Sándwich", "Fruta", "Galletas", "Yogur", "Agua"]],
  ["Juguetería", 30, ["Pelota", "Trompo", "Yoyo", "Cometa", "Rompecabezas", "Canicas"]],
];
function priceList(r: Rng) {
  const [shop, max, items] = r.pick(MENU);
  const names = r.shuffle(items).slice(0, 4);
  const prices = distinct(r, 4, 2, max * 2).map((x) => x * 50);
  return { names, prices, visual: table(["Producto", "Precio"], names.map((n, i) => [n, soles(prices[i])]), shop) };
}

// 4.° Q.6: listas de precios con sumas y restas.
export function priceListProblem(r: Rng): Question {
  const { names, prices, visual } = priceList(r);
  const [i, j] = r.shuffle([0, 1, 2, 3]);
  const form = r.int(0, 2);
  if (form === 0) return money(r, prices[i] + prices[j], `¿Cuánto cuestan en total «${names[i]}» y «${names[j]}»?`, `${soles(prices[i])} + ${soles(prices[j])} = ${soles(prices[i] + prices[j])}.`, visual, "suma");
  if (form === 1) return money(r, Math.abs(prices[i] - prices[j]), `¿Cuál es la diferencia de precio entre «${names[i]}» y «${names[j]}»?`, `${soles(Math.max(prices[i], prices[j]))} − ${soles(Math.min(prices[i], prices[j]))} = ${soles(Math.abs(prices[i] - prices[j]))}.`, visual, "diferencia");
  const total = prices[i] + prices[j];
  const paid = BILLS.find((b) => b > total)!;
  return money(r, paid - total, `Compras «${names[i]}» y «${names[j]}» y pagas con ${soles(paid)}. ¿Cuánto es tu vuelto?`, `${soles(prices[i])} + ${soles(prices[j])} = ${soles(total)}; ${soles(paid)} − ${soles(total)} = ${soles(paid - total)}.`, visual, "vuelto");
}

// 4.° Q.7: problemas de suma y resta con dinero.
export function moneyProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const a = price(r, 60);
  const b = price(r, 40);
  const form = r.int(0, 2);
  if (form === 0) return money(r, a + b, `${n} tenía ${soles(a)} y su abuela le dio ${soles(b)}. ¿Cuánto tiene ahora?`, `${soles(a)} + ${soles(b)} = ${soles(a + b)}.`, undefined, "suma");
  if (form === 1) return money(r, a, `${n} tenía ${soles(a + b)} y gastó ${soles(b)} en el mercado. ¿Cuánto le queda?`, `${soles(a + b)} − ${soles(b)} = ${soles(a)}.`, undefined, "resta");
  return money(r, b, `${n} quiere comprar un juego de ${soles(a + b)} y ya ahorró ${soles(a)}. ¿Cuánto le falta?`, `${soles(a + b)} − ${soles(a)} = ${soles(b)}.`, undefined, "falta");
}

// 4.° Q.8: sumar, restar, multiplicar y dividir cantidades de dinero.
export function fourOpsMoney(r: Rng): Question {
  const form = r.int(0, 3);
  if (form <= 1) return addSubMoney(r, 30);
  const k = r.int(2, 9);
  const unit = r.int(1, 12) * 100 + r.pick([0, 20, 50, 50, 80]);
  if (form === 2) return money(r, unit * k, "Resuelve.", `${k} × ${soles(unit)} = ${soles(unit * k)}.`, { kind: "text", text: `${k} × ${soles(unit)} = ?` }, "multiplicacion");
  return money(r, unit, "Resuelve.", `${soles(unit * k)} ÷ ${k} = ${soles(unit)}, porque ${k} × ${soles(unit)} = ${soles(unit * k)}.`, { kind: "text", text: `${soles(unit * k)} ÷ ${k} = ?` }, "division");
}

// 4.° Q.9 / Q.10: problemas de varios pasos con dinero (`allOps`: también × y ÷).
export function moneyMultiStep(r: Rng, allOps: boolean): Question {
  const n = r.pick(NAMES);
  const { prices } = priceList(r);
  const [i, j] = r.shuffle([0, 1, 2, 3]);
  if (!allOps || r.chance(0.25)) {
    const total = prices[i] + prices[j];
    const paid = BILLS.find((b) => b > total)!;
    if (r.chance(0.5)) return money(r, paid - total, `${n} compra un producto de ${soles(prices[i])} y otro de ${soles(prices[j])}. Paga con ${soles(paid)}. ¿Cuánto recibe de vuelto?`, `${soles(prices[i])} + ${soles(prices[j])} = ${soles(total)}; ${soles(paid)} − ${soles(total)} = ${soles(paid - total)}.`, undefined, "vuelto");
    const had = total + r.int(1, 30) * 50;
    return money(r, had - total, `${n} tenía ${soles(had)}. Gastó ${soles(prices[i])} en el desayuno y ${soles(prices[j])} en el almuerzo. ¿Cuánto le queda?`, `${soles(had)} − ${soles(prices[i])} − ${soles(prices[j])} = ${soles(had - total)}.`, undefined, "queda");
  }
  const k = r.int(2, 6);
  const a = r.int(2, 16) * 50;
  const form = r.int(0, 2);
  if (form === 0) {
    const total = k * a + prices[j];
    return money(r, total, `${n} compra ${k} cuadernos a ${soles(a)} cada uno y una mochila de ${soles(prices[j])}. ¿Cuánto paga en total?`, `${k} × ${soles(a)} = ${soles(k * a)}; ${soles(k * a)} + ${soles(prices[j])} = ${soles(total)}.`, undefined, "por-y-mas");
  }
  if (form === 1) {
    const paid = BILLS.find((b) => b > k * a)!;
    return money(r, paid - k * a, `${n} compra ${k} pasajes de ${soles(a)} cada uno y paga con ${soles(paid)}. ¿Cuánto recibe de vuelto?`, `${k} × ${soles(a)} = ${soles(k * a)}; ${soles(paid)} − ${soles(k * a)} = ${soles(paid - k * a)}.`, undefined, "por-y-vuelto");
  }
  return money(r, a, `${k} amigos pagan por igual una cuenta de ${soles(k * a)}. ¿Cuánto paga cada uno?`, `${soles(k * a)} ÷ ${k} = ${soles(a)}.`, undefined, "repartir");
}

// ---------------------------------------------------------------------------
// Educación financiera

const EXPENSES: [string, "Gasto fijo" | "Gasto variable"][] = [
  ["El alquiler de la casa, que cuesta lo mismo cada mes", "Gasto fijo"],
  ["La pensión del colegio, igual todos los meses", "Gasto fijo"],
  ["El plan de internet de S/ 60 al mes", "Gasto fijo"],
  ["La cuota mensual del club deportivo", "Gasto fijo"],
  ["El pago mensual del seguro de salud", "Gasto fijo"],
  ["La cuota fija del préstamo del auto", "Gasto fijo"],
  ["La suscripción mensual a una revista", "Gasto fijo"],
  ["La mensualidad de la academia de música", "Gasto fijo"],
  ["Las compras del mercado de esta semana", "Gasto variable"],
  ["La cuenta de luz, que cambia según el consumo", "Gasto variable"],
  ["Los regalos de cumpleaños del año", "Gasto variable"],
  ["La ropa nueva para el invierno", "Gasto variable"],
  ["Las entradas al cine del fin de semana", "Gasto variable"],
  ["La gasolina que se usa en cada viaje", "Gasto variable"],
  ["Los helados que se compran en verano", "Gasto variable"],
  ["La reparación de una llanta pinchada", "Gasto variable"],
];

// 4.° RR.1: gastos fijos y variables.
export function fixedVariable(r: Rng): Question {
  const [text, answer] = r.pick(EXPENSES);
  return fixedQ(`¿Es un gasto fijo o un gasto variable?`, ["Gasto fijo", "Gasto variable"], answer, answer === "Gasto fijo" ? "Un gasto fijo se paga cada cierto tiempo y casi siempre por el mismo monto." : "Un gasto variable cambia de monto o no se paga siempre.", text, answer === "Gasto fijo" ? "fijo" : "variable");
}

// 4.° RR.2: calcular la ganancia.
export function profitProblem(r: Rng): Question {
  const n = r.pick(NAMES);
  const cost = r.int(8, 120);
  const profit = r.int(5, 90);
  const thing = r.pick(["pulseras", "galletas", "limonada", "llaveros", "tarjetas", "queques"]);
  const form = r.int(0, 2);
  if (form === 0) return numQ(profit, `${n} gastó ${cost} soles en materiales para hacer ${thing} y vendió todo por ${cost + profit} soles. ¿Cuántos soles ganó?`, undefined, `Ganancia = ingresos − gastos: ${cost + profit} − ${cost} = ${profit} soles.`, "ganancia");
  if (form === 1) return numQ(cost + profit, `${n} gastó ${cost} soles para preparar ${thing} y quiere ganar ${profit} soles. ¿Por cuántos soles debe vender todo?`, undefined, `Ingresos = gastos + ganancia: ${cost} + ${profit} = ${cost + profit} soles.`, "ingresos");
  const k = r.int(5, 20);
  const each = r.int(2, 6);
  const spent = r.int(5, k * each - 5);
  return numQ(k * each - spent, `${n} vendió ${k} ${thing === "limonada" ? "vasos de limonada" : thing} a ${each} soles la unidad. Había gastado ${spent} soles. ¿Cuántos soles ganó?`, undefined, `${k} × ${each} = ${k * each} soles de ingresos; ${k * each} − ${spent} = ${k * each - spent} soles de ganancia.`, "dos-pasos");
}

// 4.° RR.3: comparar opciones de ahorro.
export function compareSavings(r: Rng): Question {
  const weeks = r.int(4, 12);
  const a = r.int(3, 12);
  let b = r.int(3, 12);
  const weeksB = weeks + r.pick([-2, -1, 1, 2]);
  if (a * weeks === b * weeksB) b += 1;
  const totalA = a * weeks;
  const totalB = b * weeksB;
  const more = r.chance(0.5);
  const answer = (totalA > totalB) === more ? "Plan A" : "Plan B";
  return fixedQ(`¿Con qué plan se junta ${more ? "más" : "menos"} dinero?`, ["Plan A", "Plan B"], answer, `Plan A: ${a} × ${weeks} = ${totalA} soles. Plan B: ${b} × ${weeksB} = ${totalB} soles.`, `Plan A: ahorrar ${a} soles cada semana durante ${weeks} semanas.\nPlan B: ahorrar ${b} soles cada semana durante ${weeksB} semanas.`, more ? "mas" : "menos");
}

// 4.° RR.4: presupuesto de la propina semanal.
export function allowanceBudget(r: Rng): Question {
  const n = r.pick(NAMES);
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const save = r.int(2, 12);
  const total = a + b + save;
  const form = r.int(0, 2);
  if (form === 0) return numQ(save, `${n} recibe ${total} soles de propina cada semana. Gasta ${a} soles en pasajes y ${b} soles en el quiosco, y ahorra el resto. ¿Cuántos soles ahorra por semana?`, undefined, `${total} − ${a} − ${b} = ${save} soles.`, "ahorro");
  if (form === 1) {
    const weeks = r.int(3, 8);
    return numQ(save * weeks, `${n} recibe ${total} soles de propina cada semana y gasta ${a + b}. Si ahorra el resto, ¿cuántos soles junta en ${weeks} semanas?`, undefined, `Ahorra ${total} − ${a + b} = ${save} soles por semana; ${save} × ${weeks} = ${save * weeks} soles.`, "varias-semanas");
  }
  const goal = save * r.int(3, 9);
  return numQ(goal / save, `${n} ahorra ${save} soles de su propina cada semana. ¿En cuántas semanas junta ${goal} soles?`, undefined, `${goal} ÷ ${save} = ${goal / save} semanas.`, "meta");
}

const VOCAB: [string, string, string[]][] = [
  ["¿Cómo se llama poner dinero en una cuenta del banco?", "Depósito", ["Retiro", "Préstamo", "Interés"]],
  ["¿Cómo se llama sacar dinero de una cuenta del banco?", "Retiro", ["Depósito", "Ahorro", "Interés"]],
  ["¿Cómo se llama el dinero extra que el banco paga por guardar tus ahorros?", "Interés", ["Préstamo", "Retiro", "Vuelto"]],
  ["¿Cómo se llama el dinero que el banco presta y que luego se debe devolver?", "Préstamo", ["Depósito", "Ahorro", "Ganancia"]],
  ["¿Cómo se llama el dinero que se guarda para usarlo más adelante?", "Ahorro", ["Gasto", "Préstamo", "Retiro"]],
  ["¿Qué máquina permite sacar dinero de una cuenta usando una tarjeta?", "Cajero automático", ["Caja registradora", "Calculadora", "Alcancía"]],
  ["¿Cómo se llama el registro que el banco lleva de tu dinero?", "Cuenta bancaria", ["Lista de precios", "Boleta de venta", "Presupuesto"]],
  ["¿Cómo se llama el plan que ordena los ingresos y los gastos?", "Presupuesto", ["Préstamo", "Interés", "Cuenta bancaria"]],
  ["¿Cómo se llama el dinero que una persona recibe por su trabajo?", "Ingreso", ["Gasto", "Deuda", "Retiro"]],
  ["¿Cómo se llama el dinero que se debe a otra persona o al banco?", "Deuda", ["Ahorro", "Ingreso", "Ganancia"]],
  ["¿Cómo se llama la empresa que guarda dinero y da préstamos?", "Banco", ["Mercado", "Imprenta", "Aduana"]],
  ["¿Cómo se llama la tarjeta que usa el dinero que ya tienes en tu cuenta?", "Tarjeta de débito", ["Tarjeta de crédito", "Tarjeta de regalo", "Tarjeta de embarque"]],
  ["¿Cómo se llama la tarjeta con la que compras ahora y pagas después al banco?", "Tarjeta de crédito", ["Tarjeta de débito", "Tarjeta de regalo", "Tarjeta de control"]],
  ["¿Cómo se llama el dinero que queda al restar los gastos de los ingresos?", "Ganancia", ["Deuda", "Préstamo", "Depósito"]],
  ["¿Cómo se llama el papel que la tienda entrega como prueba de una compra?", "Boleta de venta", ["Cuenta bancaria", "Presupuesto", "Tarjeta de débito"]],
];

// 4.° RR.5: vocabulario de las instituciones financieras.
export function financeVocabulary(r: Rng): Question {
  const [prompt, answer, wrong] = r.pick(VOCAB);
  return choiceQ(r, prompt, answer, wrong, `Se llama ${answer.toLowerCase()}.`);
}
