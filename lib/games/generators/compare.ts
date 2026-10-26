import type { Rng } from "../rng";
import type { Question } from "../types";

export function compareSymbol(r: Rng, max: number): Question {
  const a = r.int(0, max);
  let b = r.chance(0.15) ? a : r.int(0, max);
  if (max === 1000 && r.chance(0.4)) b = Math.max(0, Math.min(1000, a + r.int(-9, 9)));
  const answer = a < b ? "<" : a > b ? ">" : "=";
  return {
    kind: "choice",
    prompt: "Elige el símbolo correcto.",
    visual: { kind: "text", text: `${a}  ?  ${b}` },
    options: ["<", "=", ">"],
    answer,
    explanation:
      answer === "="
        ? `${a} y ${b} son iguales.`
        : `${a} es ${answer === "<" ? "menor" : "mayor"} que ${b}: ${a} ${answer} ${b}.`,
    tag: answer === "=" ? "igual" : answer === "<" ? "menor-que" : "mayor-que",
    solution: compareSteps(a, b, answer),
  };
}

// Comparar cifra por cifra, empezando por la de mayor valor.
function compareSteps(a: number, b: number, answer: string): string[] {
  const da = String(a).length;
  const db = String(b).length;
  const symbol = answer === "<" ? "< (menor que)" : answer === ">" ? "> (mayor que)" : "= (igual a)";
  if (da !== db)
    return [`${a} tiene ${da} cifra${da > 1 ? "s" : ""} y ${b} tiene ${db} cifra${db > 1 ? "s" : ""}.`, "El número con más cifras es el mayor.", `Por eso el símbolo es ${symbol}: ${a} ${answer} ${b}.`];
  const names = da === 3 ? ["centenas", "decenas", "unidades"] : da === 2 ? ["decenas", "unidades"] : ["unidades"];
  const sa = String(a);
  const sb = String(b);
  const i = [...sa].findIndex((c, k) => c !== sb[k]);
  if (i === -1) return ["Los dos números tienen las mismas cifras en el mismo lugar.", `Son iguales: ${a} = ${b}.`];
  return [
    `Los dos tienen ${da} cifra${da > 1 ? "s" : ""}: compara desde la cifra de mayor valor.`,
    ...(i > 0 ? [`Las ${names.slice(0, i).join(" y las ")} son iguales.`] : []),
    `En las ${names[i]}, ${sa[i]} es ${Number(sa[i]) < Number(sb[i]) ? "menor" : "mayor"} que ${sb[i]}.`,
    `Por eso el símbolo es ${symbol}: ${a} ${answer} ${b}.`,
  ];
}

export function orderNumbers(r: Rng, max: number, count: number): Question {
  const set = new Set<number>();
  while (set.size < count) set.add(r.int(0, max));
  const nums = [...set];
  const ascending = r.chance(0.6);
  const sorted = [...nums].sort((x, y) => (ascending ? x - y : y - x));
  return {
    kind: "sequence",
    prompt: `Ordena los números de ${ascending ? "menor a mayor" : "mayor a menor"}. Tócalos en orden.`,
    tiles: r.shuffle(nums.map(String)),
    reuse: false,
    length: count,
    answer: sorted.map(String),
    explanation: `El orden correcto es ${sorted.join(", ")}.`,
    tag: ascending ? "menor-a-mayor" : "mayor-a-menor",
  };
}
