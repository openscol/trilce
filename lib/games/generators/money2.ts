import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, distinct, fixedQ, fmt, nearCents, numQ, soles, table } from "./kit";

// Dinero de 5.° en adelante (multiplicar y dividir montos, precios por unidad)
// y educación financiera: impuestos, sueldo bruto y neto, medios de pago,
// registros y presupuestos. Los montos van en céntimos.

const money = (r: Rng, answer: number, prompt: string, explanation: string, visual?: Question["visual"], tag?: string, extra: number[] = []) => choiceQ(r, prompt, soles(answer), nearCents(r, answer, soles, extra, 10), explanation, visual, tag);
const price = (r: Rng, maxSoles: number) => r.int(1, maxSoles - 1) * 100 + r.pick([0, 10, 20, 50, 50, 80, 90]);
const THINGS = ["cuadernos", "entradas al cine", "pasajes", "helados", "revistas", "llaveros", "jugos"];

// Multiplicar cantidades de dinero.
export function multiplyMoney(r: Rng, word: boolean): Question {
  const k = r.int(2, 12);
  const unit = price(r, word ? 15 : 40);
  const why = `${k} × ${soles(unit)} = ${soles(unit * k)}.`;
  if (word) return money(r, unit * k, `${r.pick(NAMES)} compra ${k} ${r.pick(THINGS)} a ${soles(unit)} la unidad. ¿Cuánto paga en total?`, why, undefined, undefined, [unit + k * 100]);
  return money(r, unit * k, "Resuelve.", why, { kind: "text", text: `${k} × ${soles(unit)} = ?` });
}

// Problemas de varios pasos con multiplicación de dinero.
export function multiplyMoneyMultiStep(r: Rng): Question {
  const n = r.pick(NAMES);
  const k = r.int(2, 8);
  const a = price(r, 15);
  const b = price(r, 30);
  const form = r.int(0, 2);
  if (form === 0) return money(r, k * a + b, `${n} compra ${k} cuadernos a ${soles(a)} cada uno y una mochila de ${soles(b)}. ¿Cuánto paga en total?`, `${k} × ${soles(a)} = ${soles(k * a)}; ${soles(k * a)} + ${soles(b)} = ${soles(k * a + b)}.`, undefined, "por-y-mas");
  if (form === 1) {
    const paid = [2000, 5000, 10000, 20000].find((x) => x > k * a)!;
    return money(r, paid - k * a, `${n} compra ${k} pasajes de ${soles(a)} cada uno y paga con ${soles(paid)}. ¿Cuánto recibe de vuelto?`, `${k} × ${soles(a)} = ${soles(k * a)}; ${soles(paid)} − ${soles(k * a)} = ${soles(paid - k * a)}.`, undefined, "por-y-vuelto");
  }
  const j = r.int(2, 5);
  return money(r, k * a + j * b, `${n} compra ${k} cuadernos a ${soles(a)} cada uno y ${j} libros a ${soles(b)} cada uno. ¿Cuánto paga en total?`, `${k} × ${soles(a)} = ${soles(k * a)}; ${j} × ${soles(b)} = ${soles(j * b)}; total ${soles(k * a + j * b)}.`, undefined, "dos-productos");
}

// Dividir cantidades de dinero.
export function divideMoney(r: Rng, word: boolean): Question {
  const k = r.int(2, 9);
  const unit = price(r, word ? 9 : 30);
  const total = unit * k;
  const why = `${soles(total)} ÷ ${k} = ${soles(unit)}, porque ${k} × ${soles(unit)} = ${soles(total)}.`;
  if (word) return money(r, unit, r.pick([`${k} amigos pagan por igual una cuenta de ${soles(total)}. ¿Cuánto paga cada uno?`, `Un paquete de ${k} jugos cuesta ${soles(total)}. ¿Cuánto cuesta cada jugo?`, `${r.pick(NAMES)} ahorró ${soles(total)} en ${k} semanas, la misma cantidad cada semana. ¿Cuánto ahorró por semana?`]), why);
  return money(r, unit, "Resuelve.", why, { kind: "text", text: `${soles(total)} ÷ ${k} = ?` });
}

// Precios por unidad.
export function unitPrices(r: Rng): Question {
  const item = r.pick(["jugos", "lápices", "yogures", "panes", "plumones", "galletas"]);
  if (r.chance(0.5)) {
    const k = r.int(2, 12);
    const unit = r.int(2, 40) * 10;
    return money(r, unit, `Un paquete de ${k} ${item} cuesta ${soles(unit * k)}. ¿Cuál es el precio de cada unidad?`, `${soles(unit * k)} ÷ ${k} = ${soles(unit)}.`, undefined, "precio-unitario");
  }
  for (;;) {
    const [ka, kb] = distinct(r, 2, 2, 12);
    const ua = r.int(3, 30) * 10;
    const ub = ua + r.pick([-1, 1]) * r.pick([10, 20, 30]);
    if (kb === undefined || ub <= 0) continue;
    const answer = ua < ub ? "La oferta A" : "La oferta B";
    return fixedQ(`¿Qué oferta sale más barata por unidad?`, ["La oferta A", "La oferta B"], answer, `A: ${soles(ua * ka)} ÷ ${ka} = ${soles(ua)} cada uno. B: ${soles(ub * kb)} ÷ ${kb} = ${soles(ub)} cada uno.`, `Oferta A: ${ka} ${item} por ${soles(ua * ka)}\nOferta B: ${kb} ${item} por ${soles(ub * kb)}`, "mejor-oferta");
  }
}

// Hallar cuántas monedas hay de cada tipo.
export function coinsOfEachType(r: Rng): Question {
  const [low, high] = r.pick([[1, 2], [1, 5], [2, 5]]);
  const a = r.int(1, 8);
  const b = r.int(1, 8);
  const askHigh = r.chance(0.5);
  return numQ(askHigh ? b : a, `${r.pick(NAMES)} tiene ${a + b} monedas: unas de ${low} ${low === 1 ? "sol" : "soles"} y otras de ${high} soles. En total tiene ${a * low + b * high} soles. ¿Cuántas monedas de ${askHigh ? high : low} ${!askHigh && low === 1 ? "sol" : "soles"} tiene?`, undefined, `Con ${a} de ${low} y ${b} de ${high}: ${a} × ${low} + ${b} × ${high} = ${a * low + b * high} soles, y son ${a + b} monedas.`);
}

// ---------------------------------------------------------------------------
// Educación financiera

type Stub = { gross: number; pension: number; tax: number; net: number };
function payStub(r: Rng): Stub {
  const gross = r.int(12, 60) * 100;
  const pension = Math.round((gross * r.pick([10, 12, 13])) / 100 / 10) * 10;
  const tax = r.pick([0, 50, 80, 120, 150]);
  return { gross, pension, tax, net: gross - pension - tax };
}
const stubTable = (s: Stub, hide?: keyof Stub) =>
  table(["Concepto", "Monto (S/)"], [["Sueldo bruto", hide === "gross" ? "?" : fmt(s.gross)], ["Aporte a la pensión", hide === "pension" ? "?" : fmt(s.pension)], ["Impuesto a la renta", hide === "tax" ? "?" : fmt(s.tax)], ["Sueldo neto", hide === "net" ? "?" : fmt(s.net)]], "Boleta de pago");

// Comprender una boleta de pago (impuestos y aportes).
export function payStubReading(r: Rng): Question {
  const s = payStub(r);
  const form = r.int(0, 3);
  if (form === 0) return numQ(s.pension + s.tax, "Mira la boleta. ¿Cuántos soles le descontaron en total?", stubTable(s), `Descuentos: ${fmt(s.pension)} + ${fmt(s.tax)} = ${fmt(s.pension + s.tax)} soles.`, "descuentos");
  if (form === 1) return numQ(s.net, "Mira la boleta. ¿Cuál es el sueldo neto (lo que recibe en la mano)?", stubTable(s, "net"), `${fmt(s.gross)} − ${fmt(s.pension)} − ${fmt(s.tax)} = ${fmt(s.net)} soles.`, "neto");
  if (form === 2) return numQ(s.gross, "Mira la boleta. ¿Cuál es el sueldo bruto (antes de los descuentos)?", stubTable(s, "gross"), `${fmt(s.net)} + ${fmt(s.pension)} + ${fmt(s.tax)} = ${fmt(s.gross)} soles.`, "bruto");
  return numQ(s.pension, "Mira la boleta. ¿Cuánto fue el aporte a la pensión?", stubTable(s, "pension"), `${fmt(s.gross)} − ${fmt(s.tax)} − ${fmt(s.net)} = ${fmt(s.pension)} soles.`, "pension");
}

// Problemas con impuesto a la renta y aportes.
export function payrollProblem(r: Rng): Question {
  const s = payStub(r);
  const n = r.pick(NAMES);
  const form = r.int(0, 2);
  if (form === 0) return numQ(s.net, `${n} gana ${fmt(s.gross)} soles al mes. Le descuentan ${fmt(s.pension)} soles para su pensión y ${fmt(s.tax)} soles de impuesto a la renta. ¿Cuántos soles recibe?`, undefined, `${fmt(s.gross)} − ${fmt(s.pension)} − ${fmt(s.tax)} = ${fmt(s.net)} soles.`, "neto");
  if (form === 1) {
    const per = r.pick([10, 20]);
    const gross = r.int(10, 50) * 100;
    return numQ((gross / 100) * per, `Por cada 100 soles de sueldo, ${n} aporta ${per} soles a su fondo de pensión. Si gana ${fmt(gross)} soles, ¿cuántos soles aporta?`, undefined, `${fmt(gross)} ÷ 100 = ${gross / 100}; ${gross / 100} × ${per} = ${fmt((gross / 100) * per)} soles.`, "por-cada-100");
  }
  return numQ((s.pension + s.tax) * 12, `A ${n} le descuentan cada mes ${fmt(s.pension)} soles de pensión y ${fmt(s.tax)} soles de impuesto. ¿Cuántos soles le descuentan en un año?`, undefined, `${fmt(s.pension)} + ${fmt(s.tax)} = ${fmt(s.pension + s.tax)}; × 12 = ${fmt((s.pension + s.tax) * 12)} soles.`, "anual");
}

// Problemas con impuesto a las ventas (IGV) e impuesto predial.
export function salesPropertyTax(r: Rng): Question {
  const n = r.pick(NAMES);
  const form = r.int(0, 3);
  if (form === 0) {
    const base = r.int(2, 40) * 50;
    const tax = (base * 18) / 100;
    return numQ(base + tax, `Un producto cuesta ${fmt(base)} soles sin impuestos y se le suma ${fmt(tax)} soles de IGV (impuesto a las ventas). ¿Cuánto paga el cliente?`, undefined, `${fmt(base)} + ${fmt(tax)} = ${fmt(base + tax)} soles.`, "igv-sumar");
  }
  if (form === 1) {
    const base = r.int(1, 30) * 100;
    return numQ((base / 100) * 18, `El IGV es de 18 soles por cada 100 soles de compra. ¿Cuánto IGV se paga por una compra de ${fmt(base)} soles?`, undefined, `${fmt(base)} ÷ 100 = ${base / 100}; ${base / 100} × 18 = ${fmt((base / 100) * 18)} soles.`, "igv-calcular");
  }
  if (form === 2) {
    const quarter = r.int(4, 40) * 10;
    return numQ(quarter * 4, `La familia de ${n} paga el impuesto predial de su casa en 4 cuotas de ${fmt(quarter)} soles. ¿Cuánto paga en el año?`, undefined, `4 × ${fmt(quarter)} = ${fmt(quarter * 4)} soles.`, "predial");
  }
  const yearly = r.int(3, 30) * 40;
  return numQ(yearly / 4, `El impuesto predial de una casa es de ${fmt(yearly)} soles al año y se paga en 4 cuotas iguales. ¿De cuántos soles es cada cuota?`, undefined, `${fmt(yearly)} ÷ 4 = ${fmt(yearly / 4)} soles.`, "predial-cuota");
}

const TAXES: [string, string][] = [
  ["Se paga según lo que una persona gana por su trabajo.", "Impuesto a la renta"],
  ["Se descuenta del sueldo de un trabajador cada mes.", "Impuesto a la renta"],
  ["Lo paga quien gana dinero con su empresa o su trabajo.", "Impuesto a la renta"],
  ["Ya viene incluido en el precio de lo que compras en la tienda.", "Impuesto a las ventas (IGV)"],
  ["Aparece en la boleta cuando compras un televisor.", "Impuesto a las ventas (IGV)"],
  ["Se paga cada vez que se compra un producto o un servicio.", "Impuesto a las ventas (IGV)"],
  ["Lo paga cada año el dueño de una casa o de un terreno.", "Impuesto predial"],
  ["Se paga a la municipalidad por tener una vivienda.", "Impuesto predial"],
  ["Depende del valor de la casa o del terreno.", "Impuesto predial"],
  ["Se guarda mes a mes para cuando la persona se jubile.", "Aporte a la pensión"],
  ["Va a un fondo (AFP u ONP) para la jubilación del trabajador.", "Aporte a la pensión"],
  ["Se descuenta del sueldo, pero es un ahorro para la vejez.", "Aporte a la pensión"],
];
const TAX_NAMES = ["Impuesto a la renta", "Impuesto a las ventas (IGV)", "Impuesto predial", "Aporte a la pensión"];

// Identificar tipos de impuestos.
export function taxTypes(r: Rng): Question {
  const [text, answer] = r.pick(TAXES);
  return fixedQ("¿De qué impuesto o aporte se trata?", TAX_NAMES, answer, `Es el ${answer[0].toLowerCase()}${answer.slice(1)}.`, text, answer.toLowerCase());
}

const GROSS_NET: [string, string][] = [
  ["Es todo lo que gana un trabajador antes de los descuentos.", "Ingreso bruto"],
  ["Es la cantidad que figura en el contrato, sin restar nada.", "Ingreso bruto"],
  ["Es siempre la cantidad mayor de las dos.", "Ingreso bruto"],
  ["De esta cantidad se restan los impuestos y los aportes.", "Ingreso bruto"],
  ["Se calcula sumando el sueldo neto y los descuentos.", "Ingreso bruto"],
  ["Es lo que el trabajador recibe realmente en su cuenta.", "Ingreso neto"],
  ["Es lo que queda después de restar impuestos y aportes.", "Ingreso neto"],
  ["Es el dinero con el que la familia puede hacer su presupuesto.", "Ingreso neto"],
  ["Es siempre la cantidad menor de las dos.", "Ingreso neto"],
  ["Se calcula restando los descuentos del sueldo total.", "Ingreso neto"],
  ["Es el sueldo «en bruto», con los impuestos todavía adentro.", "Ingreso bruto"],
  ["Incluye la parte que después se va al fondo de pensiones.", "Ingreso bruto"],
  ["Es el primer monto que aparece en la boleta de pago, arriba de los descuentos.", "Ingreso bruto"],
  ["Es lo que aparece al final de la boleta de pago, después de los descuentos.", "Ingreso neto"],
  ["Es el monto que el banco deposita en la cuenta del trabajador.", "Ingreso neto"],
  ["Es lo que realmente se puede gastar o ahorrar en el mes.", "Ingreso neto"],
];

// Comprender el ingreso bruto y el ingreso neto.
export function grossNetConcept(r: Rng): Question {
  const [text, answer] = r.pick(GROSS_NET);
  return fixedQ("¿Se describe el ingreso bruto o el ingreso neto?", ["Ingreso bruto", "Ingreso neto"], answer, "Ingreso neto = ingreso bruto − descuentos (impuestos y aportes).", text, answer.toLowerCase());
}

// Calcular el ingreso bruto y el ingreso neto.
export function grossNetCalc(r: Rng): Question {
  const s = payStub(r);
  const n = r.pick(NAMES);
  const d = s.pension + s.tax;
  const form = r.int(0, 2);
  if (form === 0) return numQ(s.net, `El ingreso bruto de ${n} es de ${fmt(s.gross)} soles y sus descuentos suman ${fmt(d)} soles. ¿Cuál es su ingreso neto?`, undefined, `${fmt(s.gross)} − ${fmt(d)} = ${fmt(s.net)} soles.`, "neto");
  if (form === 1) return numQ(s.gross, `El ingreso neto de ${n} es de ${fmt(s.net)} soles y sus descuentos suman ${fmt(d)} soles. ¿Cuál es su ingreso bruto?`, undefined, `${fmt(s.net)} + ${fmt(d)} = ${fmt(s.gross)} soles.`, "bruto");
  return numQ(d, `${n} tiene un ingreso bruto de ${fmt(s.gross)} soles y un ingreso neto de ${fmt(s.net)} soles. ¿Cuánto le descuentan?`, undefined, `${fmt(s.gross)} − ${fmt(s.net)} = ${fmt(d)} soles.`, "descuentos");
}

const METHODS = ["Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Billetera digital"];
const METHOD_FACTS: [string, string][] = [
  ["No necesita internet ni aparatos, pero si se pierde no se recupera.", "Efectivo"],
  ["Sirve en casi cualquier puesto del mercado, pero es incómodo llevar mucho.", "Efectivo"],
  ["Ayuda a no gastar de más, porque solo usas lo que llevas encima.", "Efectivo"],
  ["Usa el dinero que ya tienes en tu cuenta del banco.", "Tarjeta de débito"],
  ["Si no hay saldo en la cuenta, la compra no pasa.", "Tarjeta de débito"],
  ["Permite sacar tu propio dinero de un cajero automático.", "Tarjeta de débito"],
  ["Compras hoy con dinero prestado y lo pagas después al banco.", "Tarjeta de crédito"],
  ["Si te demoras en pagar, el banco te cobra intereses.", "Tarjeta de crédito"],
  ["Permite pagar en cuotas, pero puedes terminar endeudado.", "Tarjeta de crédito"],
  ["Pagas desde el celular escaneando un código QR.", "Billetera digital"],
  ["Envías dinero al instante con el número de celular de la otra persona.", "Billetera digital"],
  ["Si te quedas sin batería o sin señal, no puedes pagar.", "Billetera digital"],
];

// Ventajas y desventajas de los medios de pago.
export function paymentMethodFacts(r: Rng): Question {
  const [text, answer] = r.pick(METHOD_FACTS);
  return fixedQ("¿A qué medio de pago corresponde esta ventaja o desventaja?", METHODS, answer, `Corresponde a: ${answer.toLowerCase()}.`, text, answer.toLowerCase());
}

const METHOD_CASES: [string, string, string][] = [
  ["Compra un pan en una bodega que no acepta tarjetas ni celular.", "Efectivo", "La bodega solo recibe monedas y billetes."],
  ["Paga el pasaje en una combi.", "Efectivo", "En la combi se paga con monedas."],
  ["Le da propina a su sobrino pequeño, que no tiene cuenta.", "Efectivo", "Quien no tiene cuenta ni celular solo puede recibir efectivo."],
  ["Quiere pagar el mercado con el dinero de su cuenta, sin llevar billetes.", "Tarjeta de débito", "El débito usa el dinero que ya está en la cuenta."],
  ["Necesita retirar parte de su sueldo en un cajero.", "Tarjeta de débito", "Con el débito se retira el dinero propio."],
  ["Quiere pagar en la tienda sin endeudarse y sin cargar efectivo.", "Tarjeta de débito", "El débito no es un préstamo."],
  ["Se malogró la refrigeradora y aún no le pagan el sueldo.", "Tarjeta de crédito", "El crédito permite comprar ahora y pagar después."],
  ["Quiere comprar una laptop y pagarla en doce cuotas.", "Tarjeta de crédito", "Solo el crédito permite pagar en cuotas."],
  ["Tiene una emergencia y no le alcanza el dinero de su cuenta.", "Tarjeta de crédito", "El crédito es dinero prestado por el banco."],
  ["Le devuelve 8 soles a una amiga que está en otra ciudad.", "Billetera digital", "Con el celular el dinero llega al instante."],
  ["Paga un jugo escaneando el código QR del puesto.", "Billetera digital", "El QR se paga desde el celular."],
  ["Divide la cuenta del almuerzo y cada uno envía su parte por el celular.", "Billetera digital", "Enviar dinero entre celulares es rápido y sin vuelto."],
];

// Evaluar medios de pago.
export function chooseMethod(r: Rng): Question {
  const [text, answer, why] = r.pick(METHOD_CASES);
  return fixedQ(`${r.pick(NAMES)}: «${text}» ¿Qué medio de pago le conviene?`, METHODS, answer, why, undefined, answer.toLowerCase());
}

type Entry = { detail: string; amount: number };
const INCOME = ["Propina", "Venta de pulseras", "Regalo de la abuela", "Trabajo en la chacra", "Venta de limonada"];
const EXPENSE = ["Pasajes", "Cuaderno", "Helado", "Regalo", "Recarga", "Almuerzo"];
function ledger(r: Rng) {
  const start = r.int(2, 20) * 5;
  const entries: Entry[] = [];
  let balance = start;
  const rows: string[][] = [["Saldo inicial", "", "", String(start)]];
  const incomes = r.shuffle(INCOME);
  const expenses = r.shuffle(EXPENSE);
  for (let i = 0; i < 4; i++) {
    const income = i === 0 || r.chance(0.4);
    const amount = income ? r.int(2, 12) * 5 : r.int(1, Math.max(1, Math.floor(balance / 5) - 1)) * 5;
    const signed = income ? amount : -Math.min(amount, balance);
    balance += signed;
    const detail = income ? incomes[i] : expenses[i];
    entries.push({ detail, amount: signed });
    rows.push([detail, signed > 0 ? String(signed) : "", signed < 0 ? String(-signed) : "", String(balance)]);
  }
  return { start, entries, rows, balance };
}
const LEDGER_HEAD = ["Detalle", "Ingreso", "Gasto", "Saldo"];

// Leer registros financieros.
export function readLedger(r: Rng): Question {
  const l = ledger(r);
  const visual = table(LEDGER_HEAD, l.rows, "Registro de ingresos y gastos (S/)");
  const income = l.entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const spent = l.entries.filter((e) => e.amount < 0).reduce((s, e) => s - e.amount, 0);
  const form = r.int(0, 3);
  if (form === 0) return numQ(income, "¿Cuántos soles ingresaron en total (sin contar el saldo inicial)?", visual, `Sumamos la columna de ingresos: ${income} soles.`, "ingresos");
  if (form === 1 && spent > 0) return numQ(spent, "¿Cuántos soles se gastaron en total?", visual, `Sumamos la columna de gastos: ${spent} soles.`, "gastos");
  if (form === 2) return numQ(l.balance, "¿Cuál es el saldo final?", visual, `El último saldo de la tabla es ${l.balance} soles.`, "saldo");
  const e = r.pick(l.entries);
  return numQ(Math.abs(e.amount), `¿De cuántos soles fue el movimiento «${e.detail}»?`, visual, `«${e.detail}»: ${Math.abs(e.amount)} soles de ${e.amount > 0 ? "ingreso" : "gasto"}.`, "leer");
}

// Llevar registros financieros (completar el saldo).
export function keepLedger(r: Rng): Question {
  const l = ledger(r);
  const at = r.int(1, 4);
  const rows = l.rows.map((row, i) => (i === at ? [row[0], row[1], row[2], "?"] : row));
  const prev = Number(l.rows[at - 1][3]);
  const e = l.entries[at - 1];
  return numQ(Number(l.rows[at][3]), "Completa el registro. ¿Qué saldo falta?", table(LEDGER_HEAD, rows, "Registro de ingresos y gastos (S/)"), `Saldo anterior ${prev} ${e.amount > 0 ? "+" : "−"} ${Math.abs(e.amount)} = ${l.rows[at][3]} soles.`, e.amount > 0 ? "ingreso" : "gasto");
}

function budget(r: Rng) {
  const items = r.shuffle(["Comida", "Pasajes", "Luz y agua", "Útiles", "Diversión", "Ropa"]).slice(0, 4);
  const amounts = items.map(() => r.int(4, 40) * 10);
  const spent = amounts.reduce((a, b) => a + b, 0);
  return { items, amounts, spent, visual: (income: number) => table(["Concepto", "Monto (S/)"], [["Ingresos", fmt(income)], ...items.map((it, i) => [`Gasto: ${it}`, fmt(amounts[i])])], "Presupuesto del mes") };
}

// Equilibrar un presupuesto.
export function balanceBudget(r: Rng): Question {
  const b = budget(r);
  const diff = r.int(1, 15) * 10;
  const surplus = r.chance(0.5);
  const income = surplus ? b.spent + diff : b.spent - diff;
  const form = r.int(0, 2);
  if (form === 0) return numQ(b.spent, "¿Cuánto suman los gastos del mes?", b.visual(income), `${b.amounts.join(" + ")} = ${fmt(b.spent)} soles.`, "total-gastos");
  if (form === 1) return fixedQ("¿Cómo está este presupuesto?", ["Sobra dinero", "Está equilibrado", "Falta dinero"], surplus ? "Sobra dinero" : "Falta dinero", `Gastos: ${fmt(b.spent)} soles; ingresos: ${fmt(income)} soles.`, b.visual(income), surplus ? "sobra" : "falta");
  return numQ(diff, surplus ? "¿Cuántos soles sobran (y se pueden ahorrar)?" : "¿Cuántos soles faltan para cubrir los gastos?", b.visual(income), `Gastos: ${fmt(b.spent)}; ingresos: ${fmt(income)}; diferencia: ${fmt(diff)} soles.`, surplus ? "sobra" : "falta");
}

// Ajustar un presupuesto.
export function adjustBudget(r: Rng): Question {
  const b = budget(r);
  const i = r.int(0, 3);
  const cut = r.int(1, Math.max(1, b.amounts[i] / 10 - 1)) * 10;
  const income = b.spent - cut;
  const form = r.int(0, 2);
  if (form === 0) return numQ(b.amounts[i] - cut, `Los gastos superan a los ingresos. Si solo se reduce «${b.items[i]}», ¿cuánto se puede gastar en ese concepto para equilibrar el presupuesto?`, b.visual(income), `Sobran ${fmt(cut)} soles de gasto: ${fmt(b.amounts[i])} − ${fmt(cut)} = ${fmt(b.amounts[i] - cut)} soles.`, "reducir-un-gasto");
  if (form === 1) return numQ(cut, "Los gastos superan a los ingresos. ¿En cuántos soles hay que reducir los gastos para equilibrar el presupuesto?", b.visual(income), `Gastos ${fmt(b.spent)} − ingresos ${fmt(income)} = ${fmt(cut)} soles.`, "cuanto-reducir");
  const goal = r.int(2, 10) * 10;
  return numQ(cut + goal, `Además de equilibrar el presupuesto, la familia quiere ahorrar ${fmt(goal)} soles. ¿En cuántos soles debe reducir sus gastos?`, b.visual(income), `Hay que bajar ${fmt(cut)} para equilibrar y ${fmt(goal)} más para ahorrar: ${fmt(cut + goal)} soles.`, "ahorrar");
}
