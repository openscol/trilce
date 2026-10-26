import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { solved } from "../common";
import { choiceQ, fixedQ, numQ, trueFalse, yesNo } from "../kit";

// Juegos propios de 2.° de primaria pensados desde los desempeños del CNEB
// (Programa curricular de Educación Primaria, MINEDU). Contextos peruanos:
// mercado, bodega, chacra, recreo, combi.

const KIDS = ["Ana", "Luis", "Rosa", "Mateo", "Lucía", "Diego", "Carla", "Hugo", "Sofía", "Pablo", "Valeria", "Renzo", "Killa", "Inti", "Yaku", "Nayra"];
const twoKids = (r: Rng) => r.shuffle(KIDS).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Problemas aditivos de enunciado verbal (PAEV): agregar, quitar, juntar,
// separar, comparar e igualar, con números de hasta dos cifras.
// ---------------------------------------------------------------------------

export type Paev = "agregar" | "quitar" | "juntar" | "separar" | "comparar" | "igualar";

// [cosa en plural, femenino]
const THINGS: [string, boolean][] = [
  ["choclos", false],
  ["mangos", false],
  ["canicas", true],
  ["figuritas", true],
  ["chapitas", true],
  ["panes", false],
  ["cuyes", false],
  ["lápices", false],
];

export function paev(r: Rng, kinds: Paev[], max = 99): Question {
  const kind = r.pick(kinds);
  const [n1, n2] = twoKids(r);
  const [thing, fem] = r.pick(THINGS);
  const how = fem ? "Cuántas" : "Cuántos";
  const some = fem ? "algunas" : "algunos";
  const many = fem ? "tantas" : "tantos";
  const same = fem ? "las mismas" : "los mismos";
  const big = r.int(Math.min(12, max - 2), max);
  const part = r.int(2, big - 2);
  const rest = big - part;
  const tag = kind;
  switch (kind) {
    case "agregar": {
      if (r.chance(0.5))
        return solved(numQ(big, `${n1} tenía ${rest} ${thing}. En el recreo le regalaron ${part} más. ¿${how} ${thing} tiene ahora?`, undefined, `Tenía ${rest} y le dieron ${part}: ${rest} + ${part} = ${big}.`, tag), [
          `Al inicio, ${n1} tenía ${rest} ${thing}.`,
          `Le regalaron ${part} más: la cantidad aumenta, así que sumamos.`,
          `${rest} + ${part} = ${big}.`,
        ]);
      return solved(numQ(part, `${n1} tenía ${rest} ${thing}. Después de que le regalaron ${some}, tiene ${big}. ¿${how} le regalaron?`, undefined, `De ${rest} a ${big} hay ${big - rest}: ${big} − ${rest} = ${part}.`, tag + "-cambio"), [
          `Sabemos cuántos tenía al inicio (${rest}) y cuántos tiene al final (${big}). Lo que no sabemos es cuántos le regalaron.`,
          `Hay que buscar cuánto falta para ir de ${rest} a ${big}: ${rest} + ? = ${big}.`,
          `Eso se calcula restando: ${big} − ${rest} = ${part}.`,
        ]);
    }
    case "quitar": {
      if (r.chance(0.5))
        return solved(numQ(rest, `En la bodega había ${big} ${thing}. Se vendieron ${part}. ¿${how} ${thing} quedan?`, undefined, `Había ${big} y se fueron ${part}: ${big} − ${part} = ${rest}.`, tag), [
          `Al inicio había ${big} ${thing}.`,
          `Se vendieron ${part}: la cantidad disminuye, así que restamos.`,
          `${big} − ${part} = ${rest}.`,
        ]);
      return solved(numQ(part, `${n1} tenía ${big} ${thing} y perdió ${some}. Ahora tiene ${rest}. ¿${how} perdió?`, undefined, `${big} − ${rest} = ${part}.`, tag + "-cambio"), [
          `Tenía ${big} y ahora tiene ${rest}: lo que perdió es la diferencia.`,
          `Restamos lo que tiene ahora a lo que tenía: ${big} − ${rest} = ${part}.`,
          `Comprobamos: ${rest} + ${part} = ${big}.`,
        ]);
    }
    case "juntar": {
      if (r.chance(0.5))
        return solved(numQ(big, `${n1} cosechó ${part} ${thing} y ${n2} cosechó ${rest}. ¿${how} ${thing} juntaron entre los dos?`, undefined, `${part} + ${rest} = ${big}.`, tag), [
          `Hay dos partes: ${part} de ${n1} y ${rest} de ${n2}.`,
          `Para saber el total, juntamos las dos partes sumando.`,
          `${part} + ${rest} = ${big}.`,
        ]);
      return solved(numQ(rest, `Entre ${n1} y ${n2} tienen ${big} ${thing}. ${n1} tiene ${part}. ¿${how} tiene ${n2}?`, undefined, `El total es ${big}: ${big} − ${part} = ${rest}.`, tag + "-parte"), [
          `El total es ${big} y una de las partes es ${part}.`,
          `La otra parte es lo que queda al quitar la parte conocida del total.`,
          `${big} − ${part} = ${rest}.`,
        ]);
    }
    case "separar": {
      return solved(numQ(rest, `Hay ${big} ${thing} en una canasta. ${n1} pone ${part} en una bolsa y el resto en otra. ¿${how} van en la otra bolsa?`, undefined, `${big} − ${part} = ${rest}.`, tag), [
          `Los ${big} ${thing} se separan en dos bolsas.`,
          `En una van ${part}; en la otra va lo que sobra.`,
          `${big} − ${part} = ${rest}.`,
        ]);
    }
    case "comparar": {
      const form = r.int(0, 2);
      const diff = Math.abs(rest - part) || 1;
      const a = Math.max(rest, part) + (rest === part ? 1 : 0);
      const b = a - diff;
      if (form === 0)
        return solved(numQ(diff, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} más tiene ${n1} que ${n2}?`, undefined, `${a} − ${b} = ${diff}.`, "comparar-diferencia"), [
          `Comparamos las dos cantidades: ${a} y ${b}.`,
          `«¿Cuántos más?» pregunta por la diferencia entre ellas.`,
          `${a} − ${b} = ${diff}.`,
        ]);
      if (form === 1)
        return solved(numQ(a, `${n2} tiene ${b} ${thing}. ${n1} tiene ${diff} más que ${n2}. ¿${how} tiene ${n1}?`, undefined, `${b} + ${diff} = ${a}.`, "comparar-mas"), [
          `${n1} tiene lo mismo que ${n2} y ${diff} más.`,
          `Entonces sumamos: lo de ${n2} más la diferencia.`,
          `${b} + ${diff} = ${a}.`,
        ]);
      return solved(numQ(b, `${n1} tiene ${a} ${thing}. ${n2} tiene ${diff} menos que ${n1}. ¿${how} tiene ${n2}?`, undefined, `${a} − ${diff} = ${b}.`, "comparar-menos"), [
          `${n2} tiene ${diff} menos que ${n1}.`,
          `Entonces a lo de ${n1} le quitamos la diferencia.`,
          `${a} − ${diff} = ${b}.`,
        ]);
    }
    case "igualar": {
      const a = Math.max(rest, part) + (rest === part ? 1 : 0);
      const b = Math.min(rest, part);
      if (r.chance(0.5))
        return solved(numQ(a - b, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} le faltan a ${n2} para tener ${many} como ${n1}?`, undefined, `Para igualar: ${a} − ${b} = ${a - b}.`, "igualar-faltan"), [
          `${n2} tiene menos: ${b}. Tiene que llegar a ${a}, como ${n1}.`,
          `Lo que le falta es la diferencia entre las dos cantidades: ${b} + ? = ${a}.`,
          `${a} − ${b} = ${a - b}.`,
        ]);
      return solved(numQ(a - b, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} tendría que regalar ${n1} para tener ${same} que ${n2}?`, undefined, `${a} − ${b} = ${a - b}.`, "igualar-sobran"), [
          `${n1} tiene más: ${a}. Para quedar igual que ${n2}, debe bajar a ${b}.`,
          `Lo que tiene que regalar es lo que le sobra: la diferencia.`,
          `${a} − ${b} = ${a - b}.`,
        ]);
    }
  }
}

// ---------------------------------------------------------------------------
// Completar 10: el número que le falta a otro para llegar a 10, en el marco de
// diez, en sumas, en la resta desde 10 y en un problema.
// ---------------------------------------------------------------------------

export function completeTen(r: Rng): Question {
  const form = r.int(0, 4);
  // En el marco y en el problema se cuentan objetos: desde 2, para no escribir «1 fichas».
  const a = r.int(form >= 3 ? 2 : 1, 9);
  const b = 10 - a;
  const pair = `${a} y ${b} forman 10: ${a} + ${b} = 10.`;
  if (form === 0)
    return solved(numQ(b, "¿Cuánto falta para llegar a 10?", `${a} + ? = 10`, `${a} + ${b} = 10.`, "falta-sumando"), [
      `Hay que buscar el número que, sumado a ${a}, da 10.`,
      `Cuenta desde ${a} hasta 10: ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}. Son ${b} saltos.`,
      pair,
    ]);
  if (form === 1)
    return solved(numQ(a, "¿Qué número falta para llegar a 10?", `? + ${b} = 10`, `${a} + ${b} = 10.`, "falta-primero"), [
      `Hay que buscar el número que, junto con ${b}, forma 10.`,
      `El orden no importa: es lo mismo que ${b} + ? = 10. Contando desde ${b} hasta 10 hay ${a}.`,
      pair,
    ]);
  if (form === 2)
    return solved(numQ(b, "Resuelve la resta.", `10 − ${a} = ?`, `10 − ${a} = ${b}, porque ${a} + ${b} = 10.`, "resta-de-10"), [
      `Restar desde 10 es buscar la pareja que forma 10.`,
      `¿Qué número, sumado a ${a}, da 10? Es ${b}, porque ${a} + ${b} = 10.`,
      `Entonces 10 − ${a} = ${b}.`,
    ]);
  if (form === 3)
    return solved(numQ(b, "¿Cuántas fichas faltan para llenar el marco de 10?", { kind: "frame", size: 10, counts: [a] }, `Hay ${a} fichas y caben 10: faltan ${b}.`, "marco"), [
      `El marco tiene 10 casillas. Cuenta las fichas: hay ${a}.`,
      `Cuenta las casillas vacías: son ${b}.`,
      pair,
    ]);
  const [kid] = twoKids(r);
  const [thing] = r.pick(THINGS);
  return solved(numQ(b, `${kid} tiene ${a} ${thing}. ¿Cuántos le faltan para tener 10?`.replace("¿Cuántos", THINGS.find((t) => t[0] === thing)![1] ? "¿Cuántas" : "¿Cuántos"), undefined, `${a} + ${b} = 10.`, "falta-problema"), [
    `${kid} tiene ${a} y quiere llegar a 10.`,
    `Lo que le falta es el número que, sumado a ${a}, da 10.`,
    pair,
  ]);
}

// ---------------------------------------------------------------------------
// Doble y mitad
// ---------------------------------------------------------------------------

export function doubleHalf(r: Rng, max = 50): Question {
  const n = r.int(2, max);
  const form = r.int(0, 3);
  const thing = r.pick(["panes", "huevos", "mangos", "lápices"]);
  const doble = [`El doble de un número es ese número dos veces.`, `Sumamos ${n} + ${n}.`, `${n} + ${n} = ${n * 2}.`];
  const mitad = [`La mitad es repartir en dos partes iguales.`, `Buscamos un número que, sumado consigo mismo, dé ${n * 2}.`, `${n} + ${n} = ${n * 2}, así que la mitad de ${n * 2} es ${n}.`];
  if (form === 0) return solved(numQ(n * 2, `¿Cuál es el doble de ${n}?`, undefined, `El doble es dos veces el número: ${n} + ${n} = ${n * 2}.`, "doble"), doble);
  if (form === 1) return solved(numQ(n, `¿Cuál es la mitad de ${n * 2}?`, undefined, `La mitad es repartir en dos partes iguales: ${n} + ${n} = ${n * 2}.`, "mitad"), mitad);
  if (form === 2) return solved(numQ(n * 2, `${r.pick(KIDS)} compró ${n} ${thing} y su tía compró el doble. ¿Cuántos compró su tía?`, undefined, `${n} + ${n} = ${n * 2}.`, "doble"), doble);
  return solved(numQ(n, `Hay ${n * 2} ${thing} y se reparten en partes iguales entre dos hermanos. ¿Cuántos recibe cada uno?`, undefined, `La mitad de ${n * 2} es ${n}.`, "mitad"), mitad);
}

// ---------------------------------------------------------------------------
// Números ordinales hasta el vigésimo
// ---------------------------------------------------------------------------

const ORDINALS = ["primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno", "décimo", "undécimo", "duodécimo", "decimotercero", "decimocuarto", "decimoquinto", "decimosexto", "decimoséptimo", "decimoctavo", "decimonoveno", "vigésimo"];

export function ordinal20(r: Rng): Question {
  const n = r.int(1, 20);
  const word = ORDINALS[n - 1];
  const near = [n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= 20);
  const form = r.int(0, 2);
  if (form === 0) {
    return solved(choiceQ(r, `En la fila para la combi, ${r.pick(KIDS)} es la persona número ${n}. ¿Qué lugar ocupa?`, word, near.map((x) => ORDINALS[x - 1]), `El lugar ${n} es el ${word} (${n}.°).`, undefined, "ordinal-nombre"), [
      "Los números ordinales dicen el lugar que ocupa alguien en una fila o en una carrera.",
      `Contamos los lugares: primero, segundo, tercero… hasta llegar al ${n}.`,
      `El lugar ${n} se llama ${word} y se escribe ${n}.°.`,
    ]);
  }
  if (form === 1) {
    return solved(choiceQ(r, `¿Cómo se escribe «${word}» con números?`, `${n}.°`, near.map((x) => `${x}.°`), `${word[0].toUpperCase() + word.slice(1)} = ${n}.°`, undefined, "ordinal-numero"), [
      "Un ordinal se escribe con su número, un punto y una o pequeña: 1.°, 2.°, 3.°…",
      `«${word[0].toUpperCase() + word.slice(1)}» es el lugar número ${n}.`,
      `Se escribe ${n}.°.`,
    ]);
  }
  const runners = r.int(Math.max(n, 5), 20);
  return solved(numQ(runners - n, `En una carrera llegaron ${runners} niños. ${r.pick(KIDS)} llegó en ${word} lugar. ¿Cuántos niños llegaron después?`, undefined, `Llegó ${n}.°, así que después llegaron ${runners} − ${n} = ${runners - n}.`, "ordinal-problema"), [
    `«${word[0].toUpperCase() + word.slice(1)}» es el lugar ${n}: antes de ese niño y con él, llegaron ${n} niños.`,
    `En total llegaron ${runners}. Los que llegaron después son los que quedan.`,
    `${runners} − ${n} = ${runners - n}.`,
  ]);
}

// ---------------------------------------------------------------------------
// Dinero: soles enteros (monedas de S/ 1, 2 y 5; billetes de S/ 10 y 20)
// ---------------------------------------------------------------------------

export function countSoles(r: Rng): Question {
  const kinds = r.shuffle([100, 200, 500, 1000, 2000]).slice(0, r.int(2, 3)).sort((a, b) => b - a);
  const coins = kinds.flatMap((k) => Array(r.int(1, 3)).fill(k) as number[]);
  const total = coins.reduce((a, b) => a + b, 0) / 100;
  const values = coins.map((c) => c / 100);
  const partial = values.map((_, i) => values.slice(0, i + 1).reduce((a, b) => a + b, 0));
  return solved(numQ(total, "¿Cuántos soles hay en total? Escribe solo el número.", { kind: "coins", coins }, `${values.join(" + ")} = ${total} soles.`, "contar-soles"), [
    "Empieza por los billetes y las monedas de mayor valor.",
    `Ve sumando uno por uno: ${partial.join(", ")}.`,
    `${values.join(" + ")} = ${total} soles.`,
  ]);
}

const SHOP: [string, number, number][] = [
  ["un pan", 1, 1],
  ["un yogur", 3, 4],
  ["un cuaderno", 4, 7],
  ["una gaseosa", 3, 6],
  ["un kilo de arroz", 4, 5],
  ["un paquete de galletas", 1, 3],
  ["una caja de colores", 8, 15],
  ["un balón", 18, 35],
];

export function shopProblem(r: Rng): Question {
  const [a, b] = r.shuffle(SHOP).slice(0, 2);
  const pa = r.int(a[1], a[2]);
  const pb = r.int(b[1], b[2]);
  const kid = r.pick(KIDS);
  const form = r.int(0, 2);
  if (form === 0)
    return solved(numQ(pa + pb, `En la bodega, ${a[0]} cuesta S/ ${pa} y ${b[0]} cuesta S/ ${pb}. ${kid} compra los dos. ¿Cuántos soles paga?`, undefined, `${pa} + ${pb} = ${pa + pb} soles.`, "total"), [
      `${kid} compra dos cosas: una de S/ ${pa} y otra de S/ ${pb}.`,
      "Para saber cuánto paga, sumamos los precios.",
      `${pa} + ${pb} = ${pa + pb} soles.`,
    ]);
  const paid = [10, 20, 50].find((x) => x > pa + pb)!;
  if (form === 1)
    return solved(numQ(paid - pa - pb, `${kid} compra ${a[0]} (S/ ${pa}) y ${b[0]} (S/ ${pb}). Paga con S/ ${paid}. ¿Cuántos soles le dan de vuelto?`, undefined, `Gasta ${pa + pb}; ${paid} − ${pa + pb} = ${paid - pa - pb} soles de vuelto.`, "vuelto"), [
      `Primero, cuánto gasta: ${pa} + ${pb} = ${pa + pb} soles.`,
      `Paga con S/ ${paid}, que es más de lo que gasta. El vuelto es lo que sobra.`,
      `${paid} − ${pa + pb} = ${paid - pa - pb} soles.`,
    ]);
  const has = Math.max(1, pa + r.int(-3, 3));
  const enough = has >= pa;
  return solved(yesNo(`${kid} tiene S/ ${has} y quiere comprar ${a[0]}, que cuesta S/ ${pa}. ¿Le alcanza?`, enough, enough ? `${has} es igual o más que ${pa}: sí le alcanza.` : `Le faltan ${pa - has} soles.`), [
    `Compara lo que tiene (S/ ${has}) con lo que cuesta (S/ ${pa}).`,
    "Le alcanza si tiene lo mismo o más que el precio.",
    enough ? `${has} ${has === pa ? "es igual a" : "es mayor que"} ${pa}: sí le alcanza.` : `${has} es menor que ${pa}: no le alcanza; le faltan ${pa - has} soles.`,
  ]);
}

// ---------------------------------------------------------------------------
// Tiempo: días de la semana y meses
// ---------------------------------------------------------------------------

const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

export function calendar(r: Rng): Question {
  const form = r.int(0, 3);
  if (form === 0) {
    const d = r.int(0, 6);
    const shift = r.pick([1, 2, -1, -2]);
    const words = { 1: "mañana", 2: "pasado mañana", [-1]: "ayer", [-2]: "anteayer" } as Record<number, string>;
    const answer = DAYS[(d + shift + 7) % 7];
    const verb = shift > 0 ? "será" : "fue";
    return solved(choiceQ(r, `Si hoy es ${DAYS[d]}, ¿qué día ${verb} ${words[shift]}?`, answer, DAYS.filter((x) => x !== answer), `Contamos ${Math.abs(shift)} día${Math.abs(shift) > 1 ? "s" : ""} ${shift > 0 ? "hacia adelante" : "hacia atrás"}: ${answer}.`, undefined, "dias"), [
      `«${words[shift][0].toUpperCase() + words[shift].slice(1)}» quiere decir ${Math.abs(shift)} día${Math.abs(shift) > 1 ? "s" : ""} ${shift > 0 ? "después" : "antes"} de hoy.`,
      `Los días van en este orden: ${DAYS.join(", ")}, y luego otra vez lunes.`,
      `Desde el ${DAYS[d]}, contamos ${Math.abs(shift)} ${shift > 0 ? "hacia adelante" : "hacia atrás"}: ${answer}.`,
    ]);
  }
  if (form === 1) {
    const m = r.int(0, 11);
    const answer = MONTHS[(m + 1) % 12];
    return solved(choiceQ(r, `¿Qué mes viene después de ${MONTHS[m]}?`, answer, MONTHS.filter((x) => x !== answer), `Después de ${MONTHS[m]} viene ${answer}.`, undefined, "meses"), [
      "El año tiene 12 meses que siempre van en el mismo orden.",
      m === 11 ? "Diciembre es el último mes: después empieza otra vez el año." : `Buscamos ${MONTHS[m]} en la lista y miramos el mes que sigue.`,
      `Después de ${MONTHS[m]} viene ${answer}.`,
    ]);
  }
  if (form === 2) {
    const weeks = r.int(1, 4);
    return solved(numQ(weeks * 7, `Las vacaciones de medio año duran ${weeks} semana${weeks > 1 ? "s" : ""}. ¿Cuántos días son?`, undefined, `Cada semana tiene 7 días: ${Array(weeks).fill(7).join(" + ")} = ${weeks * 7}.`, "semanas"), [
      "Una semana tiene 7 días.",
      `Sumamos 7 por cada semana: ${Array(weeks).fill(7).join(" + ")}.`,
      `${Array(weeks).fill(7).join(" + ")} = ${weeks * 7} días.`,
    ]);
  }
  const fiestas: [string, string][] = [
    ["Fiestas Patrias", "julio"],
    ["Navidad", "diciembre"],
    ["el Día de la Madre", "mayo"],
    ["el inicio de las clases", "marzo"],
    ["Santa Rosa de Lima", "agosto"],
    ["el Inti Raymi", "junio"],
  ];
  const [fiesta, month] = r.pick(fiestas);
  return solved(choiceQ(r, `¿En qué mes se celebra ${fiesta}?`, month, MONTHS.filter((x) => x !== month), `${fiesta[0].toUpperCase() + fiesta.slice(1)} es en ${month}.`, undefined, "fiestas"), [
    "Algunas fechas se celebran todos los años en el mismo mes.",
    `Recordamos cuándo es ${fiesta}.`,
    `${fiesta[0].toUpperCase() + fiesta.slice(1)} es en ${month}.`,
  ]);
}

// ---------------------------------------------------------------------------
// Regularidad: la regla de un patrón aditivo y las igualdades
// ---------------------------------------------------------------------------

export function patternRule(r: Rng): Question {
  const step = r.pick([2, 3, 4, 5, 10]);
  const up = r.chance(0.6);
  const start = up ? r.int(1, 40) : r.int(step * 5 + 1, 99);
  const seq = Array.from({ length: 5 }, (_, i) => start + (up ? i : -i) * step);
  const answer = `${up ? "+" : "−"} ${step}`;
  const wrong = [2, 3, 4, 5, 10].filter((s) => s !== step).map((s) => `${up ? "+" : "−"} ${s}`).concat(`${up ? "−" : "+"} ${step}`);
  const look = [`Mira los números: ${up ? "van creciendo" : "van bajando"}.`, `Del ${seq[0]} al ${seq[1]} ${up ? "aumenta" : "disminuye"} ${step}; del ${seq[1]} al ${seq[2]}, también ${step}.`];
  if (r.chance(0.5))
    return solved(choiceQ(r, "¿Cuál es la regla del patrón?", answer, wrong, `Cada número ${up ? "aumenta" : "disminuye"} ${step}.`, seq.join(",  "), "regla"), [...look, `La regla es ${answer}.`]);
  const next = seq[4] + (up ? step : -step);
  return solved(numQ(next, "Sigue el patrón. ¿Qué número va después?", seq.join(",  ") + ",  ?", `La regla es ${answer}: ${seq[4]} ${up ? "+" : "−"} ${step} = ${next}.`, "siguiente"), [
    ...look,
    `La regla es ${answer}. La aplicamos al último número: ${seq[4]} ${up ? "+" : "−"} ${step} = ${next}.`,
  ]);
}

// Balanza en equilibrio: a + b = c + ?
export function balance(r: Rng, max = 20): Question {
  const total = r.int(6, max);
  const a = r.int(1, total - 1);
  const c = r.int(1, total - 1);
  const missing = total - c;
  const visual: Visual = { kind: "text", text: `⚖️  ${a} + ${total - a}   =   ${c} + ?` };
  return solved(numQ(missing, "La balanza está en equilibrio: los dos lados valen lo mismo. ¿Qué número falta?", visual, `El lado izquierdo vale ${total}; ${c} + ${missing} = ${total}.`, "balanza"), [
    `Calcula el lado que está completo: ${a} + ${total - a} = ${total}.`,
    `El otro lado también debe valer ${total}: ${c} + ? = ${total}.`,
    `Lo que falta es ${total} − ${c} = ${missing}.`,
  ]);
}

export function equalOrNot(r: Rng, max = 20): Question {
  const total = r.int(6, max);
  const a = r.int(1, total - 1);
  const c = r.int(1, total - 1);
  const ok = r.chance(0.5);
  const d = ok ? total - c : total - c + r.pick([-2, -1, 1, 2]);
  const right = Math.max(0, d);
  const isTrue = c + right === total;
  return solved(trueFalse(`¿Es verdadera esta igualdad?`, isTrue, `${a} + ${total - a} = ${total} y ${c} + ${right} = ${c + right}.`, `${a} + ${total - a} = ${c} + ${right}`), [
    `Calcula el lado izquierdo: ${a} + ${total - a} = ${total}.`,
    `Calcula el lado derecho: ${c} + ${right} = ${c + right}.`,
    isTrue ? `Los dos lados valen ${total}: la igualdad es verdadera.` : `${total} y ${c + right} no son iguales: la igualdad es falsa.`,
  ]);
}

// ---------------------------------------------------------------------------
// Forma: cuerpos que ruedan y que no ruedan
// ---------------------------------------------------------------------------

const ROLLS: [string, string, boolean][] = [
  ["⚽", "una pelota", true],
  ["🥫", "una lata", true],
  ["🍊", "una naranja", true],
  ["🥁", "un tambor", true],
  ["🎲", "un dado", false],
  ["📦", "una caja", false],
  ["📕", "un libro", false],
  ["🧊", "un cubo de hielo", false],
  ["🧱", "un ladrillo", false],
  ["🪀", "un yoyo", true],
];

export function rollsOrNot(r: Rng): Question {
  if (r.chance(0.5)) {
    const [emoji, name, rolls] = r.pick(ROLLS);
    return solved(yesNo(`¿Rueda ${name}?`, rolls, rolls ? "Tiene una superficie curva, por eso rueda." : "Sus caras son planas, por eso no rueda.", { kind: "picture", emoji }), [
      "Ruedan los objetos que tienen una parte curva, como la pelota o la lata.",
      rolls ? `${name[0].toUpperCase() + name.slice(1)} tiene una superficie curva.` : `${name[0].toUpperCase() + name.slice(1)} solo tiene caras planas.`,
      rolls ? "Por eso sí rueda." : "Por eso no rueda: se desliza o se queda quieto.",
    ]);
  }
  const want = r.chance(0.5);
  const answer = r.pick(ROLLS.filter((x) => x[2] === want));
  const others = r.shuffle(ROLLS.filter((x) => x[2] !== want)).slice(0, 3);
  return solved(fixedQ(want ? "¿Cuál de estos objetos rueda?" : "¿Cuál de estos objetos no rueda?", r.shuffle([answer, ...others]).map((x) => x[0]), answer[0], `${answer[1][0].toUpperCase() + answer[1].slice(1)} ${want ? "tiene una parte curva" : "solo tiene caras planas"}.`, undefined, want ? "rueda" : "no-rueda"), [
    "Ruedan los objetos con una parte curva; los que solo tienen caras planas no ruedan.",
    `Mira cada objeto: ${want ? "los demás tienen solo caras planas" : "los demás tienen una parte curva"}.`,
    `${answer[1][0].toUpperCase() + answer[1].slice(1)} ${want ? "tiene una parte curva: rueda" : "solo tiene caras planas: no rueda"}.`,
  ]);
}

// ---------------------------------------------------------------------------
// Datos: tablas de conteo y nociones de posible / imposible
// ---------------------------------------------------------------------------

const tally = (n: number) => "卌 ".repeat(Math.floor(n / 5)) + "|".repeat(n % 5);

const SURVEYS: { title: string; items: string[] }[] = [
  { title: "Fruta favorita del salón", items: ["🥭 Mango", "🍌 Plátano", "🍎 Manzana", "🍇 Uva"] },
  { title: "¿Cómo venimos al colegio?", items: ["🚶 Caminando", "🚌 Combi", "🚗 Auto", "🚲 Bicicleta"] },
  { title: "Animal favorito", items: ["🦙 Llama", "🐶 Perro", "🐱 Gato", "🐹 Cuy"] },
  { title: "Deporte favorito", items: ["⚽ Fútbol", "🏐 Vóley", "🏀 Básquet", "🏊 Natación"] },
];

export function tallyTable(r: Rng): Question {
  const s = r.pick(SURVEYS);
  const items = s.items.slice(0, r.int(3, 4));
  let counts = items.map(() => r.int(2, 12));
  while (new Set(counts).size < counts.length) counts = items.map(() => r.int(2, 12));
  const visual: Visual = { kind: "table", title: s.title, headers: ["Opción", "Conteo"], rows: items.map((it, i) => [it, tally(counts[i])]) };
  const form = r.int(0, 2);
  if (form === 0) {
    const i = r.int(0, items.length - 1);
    const fives = Math.floor(counts[i] / 5);
    return solved(numQ(counts[i], `¿Cuántos eligieron ${items[i].split(" ").slice(1).join(" ")}? (卌 = 5)`, visual, `Cada 卌 vale 5 y cada | vale 1: ${counts[i]}.`, "leer-conteo"), [
      `Busca la fila de ${items[i]}.`,
      `Cada 卌 vale 5 y cada | vale 1. Hay ${fives} grupo${fives === 1 ? "" : "s"} de 5 y ${counts[i] % 5} palito${counts[i] % 5 === 1 ? "" : "s"}.`,
      fives ? `${Array(fives).fill(5).join(" + ")}${counts[i] % 5 ? ` + ${counts[i] % 5}` : ""} = ${counts[i]}.` : `Son ${counts[i]}.`,
    ]);
  }
  if (form === 1) {
    const more = r.chance(0.5);
    const target = more ? Math.max(...counts) : Math.min(...counts);
    return solved(fixedQ(more ? "¿Qué opción tiene más votos?" : "¿Qué opción tiene menos votos?", items, items[counts.indexOf(target)], `Contando: ${items.map((it, i) => `${it} ${counts[i]}`).join(", ")}.`, visual, more ? "mayor" : "menor"), [
      "Cuenta los votos de cada fila: cada 卌 vale 5 y cada | vale 1.",
      `${items.map((it, i) => `${it}: ${counts[i]}`).join("; ")}.`,
      `El número ${more ? "mayor" : "menor"} es ${target}: ${items[counts.indexOf(target)]}.`,
    ]);
  }
  const total = counts.reduce((a, b) => a + b, 0);
  return solved(numQ(total, "¿Cuántas personas respondieron en total? (卌 = 5)", visual, `${counts.join(" + ")} = ${total}.`, "total"), [
    "Cuenta los votos de cada fila: cada 卌 vale 5 y cada | vale 1.",
    `Las filas tienen ${counts.join(", ")}.`,
    `Suma todas: ${counts.join(" + ")} = ${total}.`,
  ]);
}

const EVENTS: [string, boolean][] = [
  ["Mañana saldrá el sol.", true],
  ["Al lanzar un dado saldrá un número del 1 al 6.", true],
  ["Este año habrá un mes de julio.", true],
  ["Hoy lloverá en algún lugar del Perú.", true],
  ["Una llama aprenderá a volar.", false],
  ["Al lanzar un dado saldrá el 9.", false],
  ["Una semana tendrá 10 días.", false],
  ["Un pez caminará por el parque.", false],
  ["Sacaré una bola roja de una bolsa con solo bolas azules.", false],
  ["Sacaré una bola azul de una bolsa con bolas azules y rojas.", true],
  ["Mi profesora llegará hoy al colegio en combi.", true],
  ["En el recreo alguien comerá una fruta.", true],
  ["Al lanzar una moneda saldrá cara.", true],
  ["Este domingo iré al mercado con mi familia.", true],
  ["Mañana encontraré una chapita en el patio.", true],
  ["Nevará en la cumbre del Huascarán este año.", true],
  ["Un perro hablará en castellano.", false],
  ["Febrero tendrá 40 días.", false],
  ["Al lanzar una moneda saldrán cara y sello a la vez.", false],
  ["Mi lápiz se convertirá en un dragón.", false],
  ["Sacaré un 7 de una bolsa con fichas del 1 al 5.", false],
  ["Mañana será ayer.", false],
];

export function possibleImpossible(r: Rng): Question {
  const [event, possible] = r.pick(EVENTS);
  return solved(fixedQ("¿Es posible o imposible?", ["Posible", "Imposible"], possible ? "Posible" : "Imposible", possible ? "Puede pasar, por eso es posible." : "Nunca puede pasar, por eso es imposible.", event, possible ? "posible" : "imposible"), [
    "Un suceso es posible si puede pasar, aunque no estemos seguros de que pase.",
    "Es imposible si nunca puede pasar.",
    possible ? "Esto sí puede pasar: es posible." : "Esto no puede pasar nunca: es imposible.",
  ]);
}
