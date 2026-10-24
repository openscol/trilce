import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
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
        return numQ(big, `${n1} tenía ${rest} ${thing}. En el recreo le regalaron ${part} más. ¿${how} ${thing} tiene ahora?`, undefined, `Tenía ${rest} y le dieron ${part}: ${rest} + ${part} = ${big}.`, tag);
      return numQ(part, `${n1} tenía ${rest} ${thing}. Después de que le regalaron ${some}, tiene ${big}. ¿${how} le regalaron?`, undefined, `De ${rest} a ${big} hay ${big - rest}: ${big} − ${rest} = ${part}.`, tag + "-cambio");
    }
    case "quitar": {
      if (r.chance(0.5))
        return numQ(rest, `En la bodega había ${big} ${thing}. Se vendieron ${part}. ¿${how} ${thing} quedan?`, undefined, `Había ${big} y se fueron ${part}: ${big} − ${part} = ${rest}.`, tag);
      return numQ(part, `${n1} tenía ${big} ${thing} y perdió ${some}. Ahora tiene ${rest}. ¿${how} perdió?`, undefined, `${big} − ${rest} = ${part}.`, tag + "-cambio");
    }
    case "juntar": {
      if (r.chance(0.5))
        return numQ(big, `${n1} cosechó ${part} ${thing} y ${n2} cosechó ${rest}. ¿${how} ${thing} juntaron entre los dos?`, undefined, `${part} + ${rest} = ${big}.`, tag);
      return numQ(rest, `Entre ${n1} y ${n2} tienen ${big} ${thing}. ${n1} tiene ${part}. ¿${how} tiene ${n2}?`, undefined, `El total es ${big}: ${big} − ${part} = ${rest}.`, tag + "-parte");
    }
    case "separar": {
      return numQ(rest, `Hay ${big} ${thing} en una canasta. ${n1} pone ${part} en una bolsa y el resto en otra. ¿${how} van en la otra bolsa?`, undefined, `${big} − ${part} = ${rest}.`, tag);
    }
    case "comparar": {
      const form = r.int(0, 2);
      const diff = Math.abs(rest - part) || 1;
      const a = Math.max(rest, part) + (rest === part ? 1 : 0);
      const b = a - diff;
      if (form === 0)
        return numQ(diff, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} más tiene ${n1} que ${n2}?`, undefined, `${a} − ${b} = ${diff}.`, "comparar-diferencia");
      if (form === 1)
        return numQ(a, `${n2} tiene ${b} ${thing}. ${n1} tiene ${diff} más que ${n2}. ¿${how} tiene ${n1}?`, undefined, `${b} + ${diff} = ${a}.`, "comparar-mas");
      return numQ(b, `${n1} tiene ${a} ${thing}. ${n2} tiene ${diff} menos que ${n1}. ¿${how} tiene ${n2}?`, undefined, `${a} − ${diff} = ${b}.`, "comparar-menos");
    }
    case "igualar": {
      const a = Math.max(rest, part) + (rest === part ? 1 : 0);
      const b = Math.min(rest, part);
      if (r.chance(0.5))
        return numQ(a - b, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} le faltan a ${n2} para tener ${many} como ${n1}?`, undefined, `Para igualar: ${a} − ${b} = ${a - b}.`, "igualar-faltan");
      return numQ(a - b, `${n1} tiene ${a} ${thing} y ${n2} tiene ${b}. ¿${how} ${thing} tendría que regalar ${n1} para tener ${same} que ${n2}?`, undefined, `${a} − ${b} = ${a - b}.`, "igualar-sobran");
    }
  }
}

// ---------------------------------------------------------------------------
// Doble y mitad
// ---------------------------------------------------------------------------

export function doubleHalf(r: Rng, max = 50): Question {
  const n = r.int(2, max);
  const form = r.int(0, 3);
  const thing = r.pick(["panes", "huevos", "mangos", "lápices"]);
  if (form === 0) return numQ(n * 2, `¿Cuál es el doble de ${n}?`, undefined, `El doble es dos veces el número: ${n} + ${n} = ${n * 2}.`, "doble");
  if (form === 1) return numQ(n, `¿Cuál es la mitad de ${n * 2}?`, undefined, `La mitad es repartir en dos partes iguales: ${n} + ${n} = ${n * 2}.`, "mitad");
  if (form === 2) return numQ(n * 2, `${r.pick(KIDS)} compró ${n} ${thing} y su tía compró el doble. ¿Cuántos compró su tía?`, undefined, `${n} + ${n} = ${n * 2}.`, "doble");
  return numQ(n, `Hay ${n * 2} ${thing} y se reparten en partes iguales entre dos hermanos. ¿Cuántos recibe cada uno?`, undefined, `La mitad de ${n * 2} es ${n}.`, "mitad");
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
    return choiceQ(r, `En la fila para la combi, ${r.pick(KIDS)} es la persona número ${n}. ¿Qué lugar ocupa?`, word, near.map((x) => ORDINALS[x - 1]), `El lugar ${n} es el ${word} (${n}.°).`, undefined, "ordinal-nombre");
  }
  if (form === 1) {
    return choiceQ(r, `¿Cómo se escribe «${word}» con números?`, `${n}.°`, near.map((x) => `${x}.°`), `${word[0].toUpperCase() + word.slice(1)} = ${n}.°`, undefined, "ordinal-numero");
  }
  const runners = r.int(Math.max(n, 5), 20);
  return numQ(runners - n, `En una carrera llegaron ${runners} niños. ${r.pick(KIDS)} llegó en ${word} lugar. ¿Cuántos niños llegaron después?`, undefined, `Llegó ${n}.°, así que después llegaron ${runners} − ${n} = ${runners - n}.`, "ordinal-problema");
}

// ---------------------------------------------------------------------------
// Dinero: soles enteros (monedas de S/ 1, 2 y 5; billetes de S/ 10 y 20)
// ---------------------------------------------------------------------------

export function countSoles(r: Rng): Question {
  const kinds = r.shuffle([100, 200, 500, 1000, 2000]).slice(0, r.int(2, 3)).sort((a, b) => b - a);
  const coins = kinds.flatMap((k) => Array(r.int(1, 3)).fill(k) as number[]);
  const total = coins.reduce((a, b) => a + b, 0) / 100;
  return numQ(total, "¿Cuántos soles hay en total? Escribe solo el número.", { kind: "coins", coins }, `${coins.map((c) => c / 100).join(" + ")} = ${total} soles.`, "contar-soles");
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
  if (form === 0) return numQ(pa + pb, `En la bodega, ${a[0]} cuesta S/ ${pa} y ${b[0]} cuesta S/ ${pb}. ${kid} compra los dos. ¿Cuántos soles paga?`, undefined, `${pa} + ${pb} = ${pa + pb} soles.`, "total");
  const paid = [10, 20, 50].find((x) => x > pa + pb)!;
  if (form === 1) return numQ(paid - pa - pb, `${kid} compra ${a[0]} (S/ ${pa}) y ${b[0]} (S/ ${pb}). Paga con S/ ${paid}. ¿Cuántos soles le dan de vuelto?`, undefined, `Gasta ${pa + pb}; ${paid} − ${pa + pb} = ${paid - pa - pb} soles de vuelto.`, "vuelto");
  const has = Math.max(1, pa + r.int(-3, 3));
  const enough = has >= pa;
  return yesNo(`${kid} tiene S/ ${has} y quiere comprar ${a[0]}, que cuesta S/ ${pa}. ¿Le alcanza?`, enough, enough ? `${has} es igual o más que ${pa}: sí le alcanza.` : `Le faltan ${pa - has} soles.`);
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
    return choiceQ(r, `Si hoy es ${DAYS[d]}, ¿qué día ${verb} ${words[shift]}?`, answer, DAYS.filter((x) => x !== answer), `Contamos ${Math.abs(shift)} día${Math.abs(shift) > 1 ? "s" : ""} ${shift > 0 ? "hacia adelante" : "hacia atrás"}: ${answer}.`, undefined, "dias");
  }
  if (form === 1) {
    const m = r.int(0, 11);
    const answer = MONTHS[(m + 1) % 12];
    return choiceQ(r, `¿Qué mes viene después de ${MONTHS[m]}?`, answer, MONTHS.filter((x) => x !== answer), `Después de ${MONTHS[m]} viene ${answer}.`, undefined, "meses");
  }
  if (form === 2) {
    const weeks = r.int(1, 4);
    return numQ(weeks * 7, `Las vacaciones de medio año duran ${weeks} semana${weeks > 1 ? "s" : ""}. ¿Cuántos días son?`, undefined, `Cada semana tiene 7 días: ${Array(weeks).fill(7).join(" + ")} = ${weeks * 7}.`, "semanas");
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
  return choiceQ(r, `¿En qué mes se celebra ${fiesta}?`, month, MONTHS.filter((x) => x !== month), `${fiesta[0].toUpperCase() + fiesta.slice(1)} es en ${month}.`, undefined, "fiestas");
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
  if (r.chance(0.5)) return choiceQ(r, "¿Cuál es la regla del patrón?", answer, wrong, `Cada número ${up ? "aumenta" : "disminuye"} ${step}.`, seq.join(",  "), "regla");
  const next = seq[4] + (up ? step : -step);
  return numQ(next, "Sigue el patrón. ¿Qué número va después?", seq.join(",  ") + ",  ?", `La regla es ${answer}: ${seq[4]} ${up ? "+" : "−"} ${step} = ${next}.`, "siguiente");
}

// Balanza en equilibrio: a + b = c + ?
export function balance(r: Rng, max = 20): Question {
  const total = r.int(6, max);
  const a = r.int(1, total - 1);
  const c = r.int(1, total - 1);
  const missing = total - c;
  const visual: Visual = { kind: "text", text: `⚖️  ${a} + ${total - a}   =   ${c} + ?` };
  return numQ(missing, "La balanza está en equilibrio: los dos lados valen lo mismo. ¿Qué número falta?", visual, `El lado izquierdo vale ${total}; ${c} + ${missing} = ${total}.`, "balanza");
}

export function equalOrNot(r: Rng, max = 20): Question {
  const total = r.int(6, max);
  const a = r.int(1, total - 1);
  const c = r.int(1, total - 1);
  const ok = r.chance(0.5);
  const d = ok ? total - c : total - c + r.pick([-2, -1, 1, 2]);
  const right = Math.max(0, d);
  const isTrue = c + right === total;
  return trueFalse(`¿Es verdadera esta igualdad?`, isTrue, `${a} + ${total - a} = ${total} y ${c} + ${right} = ${c + right}.`, `${a} + ${total - a} = ${c} + ${right}`);
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
    return yesNo(`¿Rueda ${name}?`, rolls, rolls ? "Tiene una superficie curva, por eso rueda." : "Sus caras son planas, por eso no rueda.", { kind: "picture", emoji });
  }
  const want = r.chance(0.5);
  const answer = r.pick(ROLLS.filter((x) => x[2] === want));
  const others = r.shuffle(ROLLS.filter((x) => x[2] !== want)).slice(0, 3);
  return fixedQ(want ? "¿Cuál de estos objetos rueda?" : "¿Cuál de estos objetos no rueda?", r.shuffle([answer, ...others]).map((x) => x[0]), answer[0], `${answer[1][0].toUpperCase() + answer[1].slice(1)} ${want ? "tiene una parte curva" : "solo tiene caras planas"}.`, undefined, want ? "rueda" : "no-rueda");
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
    return numQ(counts[i], `¿Cuántos eligieron ${items[i].split(" ").slice(1).join(" ")}? (卌 = 5)`, visual, `Cada 卌 vale 5 y cada | vale 1: ${counts[i]}.`, "leer-conteo");
  }
  if (form === 1) {
    const more = r.chance(0.5);
    const target = more ? Math.max(...counts) : Math.min(...counts);
    return fixedQ(more ? "¿Qué opción tiene más votos?" : "¿Qué opción tiene menos votos?", items, items[counts.indexOf(target)], `Contando: ${items.map((it, i) => `${it} ${counts[i]}`).join(", ")}.`, visual, more ? "mayor" : "menor");
  }
  const total = counts.reduce((a, b) => a + b, 0);
  return numQ(total, "¿Cuántas personas respondieron en total? (卌 = 5)", visual, `${counts.join(" + ")} = ${total}.`, "total");
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
  return fixedQ("¿Es posible o imposible?", ["Posible", "Imposible"], possible ? "Posible" : "Imposible", possible ? "Puede pasar, por eso es posible." : "Nunca puede pasar, por eso es imposible.", event, possible ? "posible" : "imposible");
}
