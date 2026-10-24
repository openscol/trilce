import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { NAMES, choiceQ, fixedQ, fmt, fracQ, numQ, sum, table, yesNo, type Frac } from "../kit";

// Datos, estadística y probabilidad de 1.° de secundaria.

const TOPICS: [string, string[]][] = [
  ["Deporte favorito", ["Fútbol", "Vóley", "Básquet", "Natación"]],
  ["Fruta favorita", ["Mango", "Plátano", "Uva", "Fresa"]],
  ["Medio de transporte", ["Bus", "Bicicleta", "A pie", "Mototaxi"]],
  ["Curso favorito", ["Matemática", "Arte", "Ciencias", "Comunicación"]],
];

// Fracciones en problemas con gráficos y tablas.
export function fractionFromData(r: Rng): Question {
  const [title, labels] = r.pick(TOPICS);
  const total = r.pick([20, 24, 30, 36, 40]);
  // Tres cortes distintos reparten el total en cuatro grupos.
  const cuts = r.shuffle(Array.from({ length: total - 1 }, (_, i) => i + 1)).slice(0, 3).sort((a, b) => a - b);
  const counts = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], total - cuts[2]];
  const i = r.int(0, 3);
  const visual: Visual = r.chance(0.5) ? table([title, "Alumnos"], labels.map((l, k) => [l, String(counts[k])])) : { kind: "barChart", title, bars: labels.map((l, k) => ({ label: l, value: counts[k] })), max: Math.ceil(Math.max(...counts) / 5) * 5, step: 5 };
  if (r.chance(0.5)) return fracQ(r, `Se encuestó a ${total} alumnos. ¿Qué fracción eligió «${labels[i]}»? Da la fracción simplificada.`, [counts[i], total], `${counts[i]} de ${total}: ${counts[i]}/${total}, simplificada.`, visual, "una");
  const j = (i + 1) % 4;
  return fracQ(r, `Se encuestó a ${total} alumnos. ¿Qué fracción eligió «${labels[i]}» o «${labels[j]}»? Da la fracción simplificada.`, [counts[i] + counts[j], total], `${counts[i]} + ${counts[j]} = ${counts[i] + counts[j]} de ${total}.`, visual, "dos");
}

// Gráficos circulares y ángulos centrales.
export function circleGraphAngles(r: Rng): Question {
  const [title, labels] = r.pick(TOPICS);
  const sets = [[50, 25, 15, 10], [40, 30, 20, 10], [35, 25, 25, 15], [45, 25, 20, 10], [30, 30, 25, 15], [50, 20, 20, 10], [40, 25, 20, 15]];
  const percents = r.shuffle(r.pick(sets));
  const visual: Visual = { kind: "pie", title, slices: labels.map((label, i) => ({ label, value: percents[i] })) };
  const i = r.int(0, 3);
  if (r.chance(0.6)) return numQ((percents[i] * 360) / 100, `¿Cuántos grados mide el ángulo central del sector «${labels[i]}»?`, visual, `${percents[i]} % de 360° = ${(percents[i] * 360) / 100}°.`, "angulo");
  const angle = (percents[i] * 360) / 100;
  return numQ(percents[i], `En un gráfico circular, un sector tiene un ángulo central de ${angle}°. ¿Qué porcentaje del total representa?`, undefined, `${angle} ÷ 360 = ${percents[i]} %.`, "porcentaje");
}

// Poblaciones y muestras.
const SAMPLING: [string, string, string, string[]][] = [
  ["Para saber qué almuerzo prefieren los 600 alumnos de un colegio, se pregunta a 50 de ellos.", "Los 600 alumnos del colegio", "Los 50 alumnos consultados", ["Los cocineros del colegio", "Los almuerzos del menú"]],
  ["Una fábrica produce 5 000 focos al día y revisa 100 para ver si funcionan.", "Los 5 000 focos producidos", "Los 100 focos revisados", ["Los trabajadores de la fábrica", "Los focos que fallan"]],
  ["Para estimar cuántos árboles de un bosque están enfermos, se examinan 80 árboles.", "Todos los árboles del bosque", "Los 80 árboles examinados", ["Los árboles enfermos", "Los guardabosques"]],
  ["Un distrito quiere saber cuántas familias reciclan. Se visita a 200 familias.", "Todas las familias del distrito", "Las 200 familias visitadas", ["Las familias que reciclan", "Los camiones de basura"]],
  ["Para conocer el peso de las truchas de una piscigranja, se pesan 40 truchas.", "Todas las truchas de la piscigranja", "Las 40 truchas pesadas", ["Las truchas más grandes", "Los dueños de la piscigranja"]],
];
export function populationSample(r: Rng): Question {
  const [story, population, sample, others] = r.pick(SAMPLING);
  const askPopulation = r.chance(0.5);
  return choiceQ(r, `${story} ¿Cuál es la ${askPopulation ? "población" : "muestra"}?`, askPopulation ? population : sample, [askPopulation ? sample : population, ...others], askPopulation ? "La población es todo el grupo sobre el que se quiere saber algo." : "La muestra es la parte de la población que realmente se estudia.", undefined, askPopulation ? "poblacion" : "muestra");
}

// Hacer una estimación a partir de una muestra.
export function estimateFromSample(r: Rng): Question {
  const n = r.pick([20, 25, 40, 50]), k = r.int(2, n - 5), scale = r.pick([4, 6, 8, 10, 20]);
  const cases = [
    `En una muestra aleatoria de ${n} alumnos de un colegio, ${k} van en bicicleta. El colegio tiene ${fmt(n * scale)} alumnos. ¿Cuántos se estima que van en bicicleta?`,
    `De ${n} mangos revisados al azar en un camión, ${k} estaban maduros. El camión lleva ${fmt(n * scale)} mangos. ¿Cuántos se estima que están maduros?`,
    `En una muestra aleatoria de ${n} vecinos, ${k} tienen mascota. En el barrio viven ${fmt(n * scale)} personas. ¿Cuántas se estima que tienen mascota?`,
  ];
  return numQ(k * scale, r.pick(cases), undefined, `La proporción de la muestra se aplica al total: ${k}/${n} × ${fmt(n * scale)} = ${fmt(k * scale)}.`);
}

// Hacer inferencias a partir de varias muestras.
export function multipleSamples(r: Rng): Question {
  const n = 20;
  const base = r.int(5, 14);
  const counts = [base + r.int(-2, 2), base + r.int(-2, 2), base];
  counts[2] = 3 * base - counts[0] - counts[1]; // el promedio de las tres es `base`
  const population = n * r.pick([10, 20, 30, 50]);
  const visual = table(["Muestra", `A favor (de ${n})`], counts.map((c, i) => [String(i + 1), String(c)]));
  if (r.chance(0.6)) return numQ((base * population) / n, `Se tomaron tres muestras aleatorias de ${n} alumnos cada una y se les preguntó si están a favor de tener un huerto. El colegio tiene ${fmt(population)} alumnos. Usando las tres muestras juntas, ¿cuántos alumnos se estima que están a favor?`, visual, `En total, ${sum(counts)} de ${3 * n} están a favor: ${sum(counts)}/${3 * n} = ${base}/${n}. Para ${fmt(population)}: ${fmt((base * population) / n)}.`, "estimar");
  return choiceQ(r, "Las tres muestras son aleatorias y del mismo tamaño. ¿Por qué no dan exactamente el mismo resultado?", "Porque cada muestra incluye a personas distintas", ["Porque una de las tres muestras está mal contada", "Porque la población cambió entre las muestras", "Porque las muestras aleatorias no sirven"], "Es normal que las muestras varíen un poco entre sí; por eso conviene usar varias.", visual, "variacion");
}

// Comparar poblaciones usando medidas de centro y de dispersión.
export function comparePopulations(r: Rng): Question {
  const names = r.pick([["1.° A", "1.° B"], ["Equipo Rojo", "Equipo Azul"], ["Chacra Norte", "Chacra Sur"]]);
  const mad = r.int(2, 5), k = r.int(1, 4);
  const low = r.int(20, 60), high = low + k * mad;
  // Al azar, cuál de los dos grupos tiene la media mayor y cuál varía más.
  const hi = r.int(0, 1), wide = r.int(0, 1);
  const means = hi === 0 ? [high, low] : [low, high];
  const other = mad + r.pick([2, 3]);
  const form = r.int(0, 2);
  const mads = form === 1 ? (wide === 0 ? [other, mad] : [mad, other]) : [mad, mad];
  const visual = table(["Grupo", "Media", "Desviación media"], names.map((g, i) => [g, String(means[i]), String(mads[i])]));
  if (form === 0) return fixedQ("¿Qué grupo tiene, en promedio, valores más altos?", names, names[hi], `Su media es mayor: ${high} > ${low}.`, visual, "centro");
  if (form === 1) return fixedQ("¿En qué grupo los datos están más dispersos (varían más)?", names, names[wide], `Su desviación media es mayor: ${other} > ${mad}.`, visual, "dispersion");
  return numQ(k, "Los dos grupos tienen la misma desviación media. ¿Cuántas veces cabe esa desviación media en la diferencia entre las dos medias?", visual, `Diferencia de medias: ${high} − ${low} = ${high - low}. Entre ${mad}: ${k}.`, "comparar");
}

// ---------------------------------------------------------------------------
// Probabilidad

const simp = ([n, d]: Frac): Frac => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  return [n / g(n, d), d / g(n, d)];
};

// Probabilidad de sucesos mutuamente excluyentes y de sucesos que se solapan.
export function exclusiveOverlapping(r: Rng): Question {
  const n = r.pick([6, 8, 10, 12]);
  const nums = Array.from({ length: n }, (_, i) => i + 1);
  const events: [string, (x: number) => boolean][] = [
    ["un número par", (x) => x % 2 === 0], ["un número impar", (x) => x % 2 === 1], ["un múltiplo de 3", (x) => x % 3 === 0],
    ["un número mayor que 4", (x) => x > 4], ["un número menor que 3", (x) => x < 3], ["un número primo", (x) => [2, 3, 5, 7, 11].includes(x)],
  ];
  // Al clasificar, la mitad de las veces se busca un par que sí sea excluyente.
  const classify = r.chance(0.35), wantExclusive = r.chance(0.5);
  const order = r.shuffle(events);
  let [a, b] = order;
  if (classify) {
    const pairs = order.flatMap((p, i) => order.slice(i + 1).map((q) => [p, q] as const));
    [a, b] = pairs.find(([p, q]) => nums.some((x) => p[1](x) && q[1](x)) !== wantExclusive) ?? pairs[0];
  }
  const both = nums.filter((x) => a[1](x) && b[1](x)).length;
  const either = nums.filter((x) => a[1](x) || b[1](x)).length;
  const device = `Una ruleta tiene ${n} partes iguales numeradas del 1 al ${n}.`;
  if (classify) return yesNo(`${device} ¿Los sucesos «sale ${a[0]}» y «sale ${b[0]}» son mutuamente excluyentes (no pueden ocurrir a la vez)?`, both === 0, both === 0 ? "Sí: ningún número cumple las dos condiciones a la vez." : `No: ${nums.filter((x) => a[1](x) && b[1](x)).join(", ")} ${both === 1 ? "cumple" : "cumplen"} las dos condiciones.`, undefined, "clasificar");
  return fracQ(r, `${device} ¿Cuál es la probabilidad de que salga ${a[0]} o ${b[0]}?`, [either, n], `Cumplen al menos una condición: ${nums.filter((x) => a[1](x) || b[1](x)).join(", ")} (${either} de ${n})${both ? "; los que cumplen las dos se cuentan una sola vez" : ""}.`, undefined, both ? "solapados" : "excluyentes");
}

const COLORS = ["Rojo", "Azul", "Verde", "Amarillo"];
function experiment(r: Rng) {
  const total = r.pick([20, 40, 50, 60, 80, 100]);
  const cuts = r.shuffle(Array.from({ length: total / 5 - 1 }, (_, i) => (i + 1) * 5)).slice(0, 3).sort((a, b) => a - b);
  const counts = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], total - cuts[2]];
  return { total, counts, visual: table(["Color", "Veces"], COLORS.map((c, i) => [c, String(counts[i])]), `Resultados de ${total} giros de una ruleta`) };
}

// Probabilidad experimental y predicciones con datos recogidos.
export function experimentalProbability(r: Rng, mode: "probability" | "predict" | "both"): Question {
  const e = experiment(r);
  const i = r.int(0, 3);
  const what = mode === "both" ? r.pick(["probability", "predict"] as const) : mode;
  if (what === "probability") return fracQ(r, `Según los resultados, ¿cuál es la probabilidad experimental de que la ruleta caiga en ${COLORS[i].toLowerCase()}?`, [e.counts[i], e.total], `Veces que salió ÷ total de giros: ${e.counts[i]}/${e.total}, simplificada.`, e.visual, "probabilidad");
  const times = e.total * r.pick([2, 3, 5, 10]);
  return numQ((e.counts[i] * times) / e.total, `Según los resultados, si la ruleta se gira ${fmt(times)} veces, ¿cuántas veces se espera que caiga en ${COLORS[i].toLowerCase()}?`, e.visual, `${e.counts[i]}/${e.total} × ${fmt(times)} = ${fmt((e.counts[i] * times) / e.total)}.`, "prediccion");
}

// Espacios muestrales de sucesos compuestos.
export function compoundSampleSpace(r: Rng): Question {
  const letters = "ABCD".slice(0, r.int(2, 4)).split("");
  const coin = ["C", "S"]; // cara, sello
  if (r.chance(0.5)) {
    const good = `${r.pick(coin)}${r.pick(letters)}`;
    const bad = r.pick([`${r.pick(letters)}${r.pick(letters)}`, "CS", `C${"EFG"[r.int(0, 2)]}`]);
    const show = r.chance(0.5) ? good : bad;
    return yesNo(`Se lanza una moneda (C = cara, S = sello) y luego se gira una ruleta con las letras ${letters.join(", ")}. Cada resultado se escribe con dos letras: primero la moneda y luego la ruleta. ¿«${show}» es un resultado posible?`, show === good, show === good ? `Sí: ${show[0] === "C" ? "cara" : "sello"} en la moneda y ${show[1]} en la ruleta.` : "No: la primera letra debe ser C o S y la segunda, una letra de la ruleta.", undefined, "posible");
  }
  const dice = r.chance(0.5);
  const b = dice ? 6 : letters.length;
  return numQ(2 * b, dice ? "Se lanza una moneda y un dado. ¿Cuántos resultados tiene el espacio muestral?" : `Se lanza una moneda y se gira una ruleta con las letras ${letters.join(", ")}. ¿Cuántos resultados tiene el espacio muestral?`, undefined, `Cada resultado de la moneda (2) se combina con cada resultado ${dice ? "del dado (6)" : `de la ruleta (${b})`}: 2 × ${b} = ${2 * b}.`, "contar");
}

// Sucesos compuestos: hallar el número de sumas.
export function numberOfSums(r: Rng): Question {
  const a = r.int(2, 6), b = r.int(2, 6);
  const sums = new Set<number>();
  for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) sums.add(i + j);
  const form = r.int(0, 1);
  if (form === 0) return numQ(sums.size, `Se giran dos ruletas: una numerada del 1 al ${a} y otra del 1 al ${b}, y se suman los dos números. ¿Cuántas sumas distintas pueden salir?`, undefined, `Las sumas van de 2 a ${a + b}: son ${sums.size} sumas distintas.`, "sumas");
  const target = r.int(3, a + b - 1);
  let ways = 0;
  for (let i = 1; i <= a; i++) if (target - i >= 1 && target - i <= b) ways++;
  return numQ(ways, `Se giran dos ruletas: una numerada del 1 al ${a} y otra del 1 al ${b}. ¿De cuántas maneras se puede obtener una suma de ${target}?`, undefined, `Se cuentan los pares que suman ${target}: ${Array.from({ length: a }, (_, k) => k + 1).filter((i) => target - i >= 1 && target - i <= b).map((i) => `${i} + ${target - i}`).join(", ")}.`, "maneras");
}

// Hallar el número de resultados: problemas.
export function outcomesProblem(r: Rng): Question {
  const [a, b, c] = [r.int(2, 6), r.int(2, 5), r.int(2, 4)];
  const name = r.pick(NAMES);
  const cases: [string, number, string][] = [
    [`${name} debe elegir un polo entre ${a}, un pantalón entre ${b} y una gorra entre ${c}. ¿De cuántas maneras distintas puede vestirse?`, a * b * c, `${a} × ${b} × ${c}`],
    [`Una pizzería ofrece ${a} tipos de masa, ${b} salsas y ${c} quesos. ¿Cuántas pizzas distintas (una masa, una salsa y un queso) se pueden pedir?`, a * b * c, `${a} × ${b} × ${c}`],
    [`Un candado tiene ${c} ruedas y cada rueda tiene las cifras del 0 al 9. ¿Cuántas claves distintas se pueden formar?`, 10 ** c, Array(c).fill("10").join(" × ")],
    [`Se lanza una moneda ${c + 1} veces seguidas. ¿Cuántos resultados distintos puede tener la serie de lanzamientos?`, 2 ** (c + 1), Array(c + 1).fill("2").join(" × ")],
    [`Para viajar de la ciudad A a la B hay ${a} rutas, y de la B a la C hay ${b} rutas. ¿De cuántas maneras se puede ir de A a C pasando por B?`, a * b, `${a} × ${b}`],
  ];
  const [text, answer, why] = r.pick(cases);
  return numQ(answer, text, undefined, `Se multiplican las opciones de cada elección: ${why} = ${fmt(answer)}.`);
}

// Probabilidad de sucesos compuestos.
export function compoundProbability(r: Rng): Question {
  const n = r.pick([3, 4, 5, 6, 8]);
  const k = r.int(1, n - 1);
  const form = r.int(0, 2);
  if (form === 0) return fracQ(r, `Se lanza una moneda y se gira una ruleta con ${n} partes iguales, de las cuales ${k === 1 ? "1 es roja" : `${k} son rojas`}. ¿Cuál es la probabilidad de que salga cara y la ruleta caiga en rojo?`, [k, 2 * n], `Se multiplican: 1/2 × ${k}/${n} = ${k}/${2 * n}.`, undefined, "moneda-ruleta");
  if (form === 1) {
    const evens = 3;
    return fracQ(r, `Se lanza un dado y se gira una ruleta con ${n} partes iguales, de las cuales ${k === 1 ? "1 es azul" : `${k} son azules`}. ¿Cuál es la probabilidad de que salga un número par en el dado y azul en la ruleta?`, [evens * k, 6 * n], `Se multiplican: 3/6 × ${k}/${n} = ${3 * k}/${6 * n}.`, undefined, "dado-ruleta");
  }
  const [a, b] = [r.int(1, 5), r.int(1, 5)];
  return fracQ(r, `Se lanzan dos dados. ¿Cuál es la probabilidad de que el primero muestre ${a + 1} o menos y el segundo muestre más de ${b}?`, [(a + 1) * (6 - b), 36], `Se multiplican: ${a + 1}/6 × ${6 - b}/6 = ${(a + 1) * (6 - b)}/36.`, undefined, "dos-dados");
}

// ¿qué simulación representa la situación?
const SIMULATIONS: [string, string, string[]][] = [
  ["Hay 50 % de probabilidad de que llueva mañana.", "Lanzar una moneda: cara = llueve", ["Lanzar un dado: 1 = llueve", "Sacar una carta de 10: el 1 = llueve"]],
  ["Un jugador encesta 1 de cada 6 tiros.", "Lanzar un dado: 1 = encesta", ["Lanzar una moneda: cara = encesta", "Girar una ruleta de 4 partes: 1 = encesta"]],
  ["El 25 % de los alumnos usa lentes.", "Girar una ruleta de 4 partes iguales: 1 = usa lentes", ["Lanzar una moneda: cara = usa lentes", "Lanzar un dado: 1 = usa lentes"]],
  ["El 70 % de las semillas germina.", "Sacar una ficha de una bolsa con 7 verdes y 3 rojas: verde = germina", ["Lanzar una moneda: cara = germina", "Sacar una ficha de una bolsa con 3 verdes y 7 rojas: verde = germina"]],
  ["Un arquero ataja 2 de cada 3 penales.", "Lanzar un dado: del 1 al 4 = ataja", ["Lanzar un dado: 1 o 2 = ataja", "Lanzar una moneda: cara = ataja"]],
  ["Hay 1 probabilidad en 10 de ganar un premio.", "Sacar una carta numerada del 1 al 10: el 1 = premio", ["Lanzar un dado: 1 = premio", "Lanzar una moneda: cara = premio"]],
  ["El 40 % de los clientes pide postre.", "Sacar una ficha de una bolsa con 2 azules y 3 blancas: azul = pide postre", ["Sacar una ficha de una bolsa con 4 azules y 1 blanca: azul = pide postre", "Lanzar una moneda: cara = pide postre"]],
];
export function chooseSimulation(r: Rng): Question {
  const [situation, good, wrong] = r.pick(SIMULATIONS);
  return choiceQ(r, `${situation} ¿Qué simulación representa bien la situación?`, good, wrong, "La simulación debe tener la misma probabilidad que la situación real.");
}

// Identificar sucesos independientes y dependientes.
const DEPENDENCE: [string, boolean][] = [
  ["Lanzar una moneda y luego lanzar un dado.", true], ["Sacar una carta de un mazo, devolverla, barajar y sacar otra.", true], ["Girar una ruleta dos veces.", true],
  ["Lanzar un dado dos veces.", true], ["Elegir un polo del ropero y elegir una fruta de la frutera.", true],
  ["Sacar una bolita de una bolsa y, sin devolverla, sacar otra.", false], ["Elegir al delegado de un salón y luego elegir al subdelegado entre los que quedan.", false],
  ["Sacar dos medias de un cajón, una después de la otra, sin devolver la primera.", false], ["Repartir dos cartas de un mazo, una a cada jugador.", false],
  ["Comer un caramelo de una bolsa y luego sacar otro.", false],
];
export function independentDependent(r: Rng): Question {
  const [text, independent] = r.pick(DEPENDENCE);
  return fixedQ(`${text} ¿Los dos sucesos son independientes o dependientes?`, ["Independientes", "Dependientes"], independent ? "Independientes" : "Dependientes", independent ? "El primer resultado no cambia las probabilidades del segundo." : "Después del primero quedan menos opciones: las probabilidades del segundo cambian.", undefined, independent ? "independientes" : "dependientes");
}

// Probabilidad de sucesos independientes y dependientes.
export function drawTwice(r: Rng): Question {
  const red = r.int(2, 6), blue = r.int(2, 6), total = red + blue;
  const replace = r.chance(0.5);
  const sameColor = r.chance(0.6);
  const p: Frac = sameColor ? (replace ? [red * red, total * total] : [red * (red - 1), total * (total - 1)]) : replace ? [red * blue, total * total] : [red * blue, total * (total - 1)];
  const [n, d] = simp(p);
  const second = sameColor ? "roja" : "azul";
  return fracQ(r, `Una bolsa tiene ${red} bolitas rojas y ${blue} azules. Se saca una bolita, ${replace ? "se devuelve a la bolsa" : "no se devuelve"} y se saca otra. ¿Cuál es la probabilidad de que la primera sea roja y la segunda sea ${second}?`, [n, d], replace ? `Son independientes: ${red}/${total} × ${sameColor ? red : blue}/${total} = ${p[0]}/${p[1]}.` : `Son dependientes: ${red}/${total} × ${sameColor ? red - 1 : blue}/${total - 1} = ${p[0]}/${p[1]}.`, { kind: "bag", items: [{ emoji: "🔴", count: red }, { emoji: "🔵", count: blue }] }, replace ? "con-devolucion" : "sin-devolucion");
}
