import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, fixedQ, fmt, numQ, table } from "./kit";

// Educación financiera de 6.° en adelante: cuentas bancarias, tarjetas,
// historial crediticio, cómo pagar los estudios y relación entre ocupación,
// estudios e ingresos.

// Comparar cuentas bancarias.
export function compareAccounts(r: Rng): Question {
  for (;;) {
    const [feeA, feeB] = [r.int(0, 6) * 2, r.int(0, 6) * 2];
    const [perA, perB] = [r.int(0, 4), r.int(0, 4)];
    const uses = r.int(2, 12);
    const costA = feeA + perA * uses;
    const costB = feeB + perB * uses;
    if (costA === costB || (feeA === feeB && perA === perB)) continue;
    const visual = table(["", "Mantenimiento al mes", "Costo por retiro"], [["Cuenta A", `S/ ${feeA}`, `S/ ${perA}`], ["Cuenta B", `S/ ${feeB}`, `S/ ${perB}`]]);
    if (r.chance(0.4)) return numQ(costA, `${r.pick(NAMES)} hace ${uses} retiros al mes. ¿Cuántos soles paga al mes con la cuenta A?`, visual, `${feeA} + ${uses} × ${perA} = ${costA} soles.`, "costo");
    return fixedQ(`${r.pick(NAMES)} hace ${uses} retiros al mes. ¿Qué cuenta le sale más barata?`, ["Cuenta A", "Cuenta B"], costA < costB ? "Cuenta A" : "Cuenta B", `A: ${feeA} + ${uses} × ${perA} = ${costA} soles. B: ${feeB} + ${uses} × ${perB} = ${costB} soles.`, visual, "comparar");
  }
}

const CARDS: [string, string][] = [
  ["Usa el dinero que ya está en tu cuenta.", "Tarjeta de débito"],
  ["Si la cuenta está vacía, la compra no pasa.", "Tarjeta de débito"],
  ["No genera deuda: pagas con tu propio dinero.", "Tarjeta de débito"],
  ["Sirve para retirar tu dinero del cajero.", "Tarjeta de débito"],
  ["El monto se descuenta de tu cuenta en el momento.", "Tarjeta de débito"],
  ["No cobra intereses, porque no es un préstamo.", "Tarjeta de débito"],
  ["Usas dinero prestado por el banco.", "Tarjeta de crédito"],
  ["A fin de mes llega un estado de cuenta con lo que debes.", "Tarjeta de crédito"],
  ["Si no pagas a tiempo, te cobran intereses.", "Tarjeta de crédito"],
  ["Tiene un límite: el máximo que el banco te presta.", "Tarjeta de crédito"],
  ["Permite comprar hoy y pagar en cuotas.", "Tarjeta de crédito"],
  ["Usarla bien ayuda a tener buen historial crediticio.", "Tarjeta de crédito"],
];

// Tarjetas de débito y tarjetas de crédito.
export function debitOrCredit(r: Rng): Question {
  const [text, answer] = r.pick(CARDS);
  return fixedQ("¿De qué tarjeta se habla?", ["Tarjeta de débito", "Tarjeta de crédito"], answer, answer === "Tarjeta de débito" ? "La de débito usa tu propio dinero." : "La de crédito usa dinero prestado, que luego se devuelve.", text, answer.toLowerCase());
}

const CREDIT: [string, string, string[]][] = [
  ["¿Qué muestra un reporte de crédito?", "Cómo ha pagado sus deudas una persona", ["Cuánto gana una persona al mes", "Qué compra en el mercado", "Cuántos años estudió"]],
  ["¿Qué mejora el historial crediticio?", "Pagar las cuotas a tiempo", ["Pedir muchos préstamos a la vez", "Pagar siempre con retraso", "No revisar los estados de cuenta"]],
  ["¿Qué empeora el historial crediticio?", "Atrasarse en los pagos", ["Ahorrar todos los meses", "Pagar la deuda completa", "Comprar solo lo necesario"]],
  ["¿Para qué usa un banco el reporte de crédito?", "Para decidir si presta dinero", ["Para fijar el sueldo del cliente", "Para cobrar los impuestos", "Para elegir el color de la tarjeta"]],
  ["¿Quién suele conseguir préstamos con menos interés?", "Quien tiene buen historial", ["Quien nunca paga a tiempo", "Quien debe a muchos bancos", "Quien no tiene ingresos"]],
  ["¿Cómo se llama el registro de cómo una persona paga lo que debe?", "Historial crediticio", ["Presupuesto mensual", "Boleta de pago", "Estado del tiempo"]],
  ["Una persona paga todas sus cuotas puntualmente. ¿Cómo será su calificación?", "Buena", ["Mala", "No se puede saber nunca", "Peor cada mes"]],
  ["¿Qué pasa si una persona deja de pagar un préstamo?", "Su historial empeora", ["Su historial mejora", "El banco le regala la deuda", "Le suben el sueldo"]],
  ["¿Por qué conviene revisar tu propio reporte de crédito?", "Para detectar errores a tiempo", ["Para gastar más cada mes", "Para dejar de ahorrar", "Para no pagar las cuotas"]],
  ["¿Qué es una central de riesgo?", "Una entidad que reúne los historiales", ["Una tienda de electrodomésticos", "Un tipo de cuenta de ahorros", "Una oficina de impuestos"]],
];

// Reportes de crédito.
export function creditReports(r: Rng): Question {
  const [prompt, answer, wrong] = r.pick(CREDIT);
  return choiceQ(r, prompt, answer, wrong, `${answer}.`);
}

const COLLEGE: [string, string][] = [
  ["Dinero que se recibe por buen rendimiento y que no hay que devolver.", "Beca"],
  ["Una universidad cubre la pensión de un alumno destacado.", "Beca"],
  ["Un programa del Estado paga los estudios de jóvenes con buenas notas.", "Beca"],
  ["Dinero que presta un banco para estudiar y se devuelve con intereses.", "Préstamo educativo"],
  ["Se estudia ahora y se paga en cuotas al terminar la carrera.", "Préstamo educativo"],
  ["La familia firma un contrato con el banco para cubrir la pensión.", "Préstamo educativo"],
  ["Dinero que la familia guardó durante años para los estudios.", "Ahorros"],
  ["Los padres separan una parte del sueldo cada mes desde que nació su hijo.", "Ahorros"],
  ["Se usa el dinero de una cuenta abierta hace tiempo para ese fin.", "Ahorros"],
  ["El estudiante da clases por las tardes para pagar su pensión.", "Trabajo"],
  ["Se estudia de noche y se atiende una tienda de día.", "Trabajo"],
  ["En vacaciones, el estudiante gana dinero para sus cuotas.", "Trabajo"],
];

// Cómo pagar los estudios superiores.
export function payingForCollege(r: Rng): Question {
  const [text, answer] = r.pick(COLLEGE);
  return fixedQ("¿Qué forma de pagar los estudios se describe?", ["Beca", "Préstamo educativo", "Ahorros", "Trabajo"], answer, answer === "Beca" ? "La beca no se devuelve." : answer === "Préstamo educativo" ? "El préstamo se devuelve, casi siempre con intereses." : answer === "Ahorros" ? "Es dinero propio guardado con anticipación." : "Es dinero que se gana trabajando mientras se estudia.", text, answer.toLowerCase());
}

const JOBS: [string, number][] = [["Auxiliar de almacén", 0], ["Técnico electricista", 3], ["Enfermera", 5], ["Contador", 5], ["Ingeniera civil", 5], ["Médico", 7], ["Chef", 3], ["Programadora", 4], ["Profesor", 5], ["Mecánico", 2]];

// Ocupaciones, estudios e ingresos.
export function occupationsIncome(r: Rng): Question {
  const picked = r.shuffle(JOBS).slice(0, 4).sort((a, b) => a[1] - b[1]);
  const incomes = picked.map(([, years]) => (12 + years * r.int(3, 5) + r.int(0, 3)) * 100);
  const visual = table(["Ocupación", "Años de estudio", "Ingreso mensual (S/)"], picked.map(([name, years], i) => [name, years === 0 ? "—" : String(years), fmt(incomes[i])]));
  const [i, j] = r.shuffle([0, 1, 2, 3]);
  const form = r.int(0, 2);
  if (form === 0) return numQ(Math.abs(incomes[i] - incomes[j]), `¿Cuál es la diferencia de ingreso mensual entre «${picked[i][0]}» y «${picked[j][0]}»?`, visual, `${fmt(Math.max(incomes[i], incomes[j]))} − ${fmt(Math.min(incomes[i], incomes[j]))} = ${fmt(Math.abs(incomes[i] - incomes[j]))} soles.`, "diferencia");
  if (form === 1) return numQ(incomes[i] * 12, `¿Cuánto gana en un año «${picked[i][0]}»?`, visual, `${fmt(incomes[i])} × 12 = ${fmt(incomes[i] * 12)} soles.`, "anual");
  const top = Math.max(...incomes);
  return { kind: "choice", prompt: "Según la tabla, ¿qué ocupación tiene el mayor ingreso mensual?", visual, options: picked.map(([n]) => n), answer: picked[incomes.indexOf(top)][0], explanation: `El mayor ingreso es ${fmt(top)} soles. En general, más años de estudio permiten acceder a ingresos mayores.`, tag: "mayor" };
}
