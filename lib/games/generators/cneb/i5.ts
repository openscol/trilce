import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { fixedQ } from "../kit";

// Juegos propios de Inicial 5 años pensados desde el CNEB (ciclo II):
// cuantificadores, seriación, nociones de tiempo y de ubicación.

const THINGS = ["🍎", "⭐", "🐟", "🚗", "🎈", "🐥", "🌸", "⚽", "🍪", "🦋", "🌽", "🦙"];

// «Muchos», «pocos» y «ninguno».
export function manyFew(r: Rng): Question {
  const [a, b] = r.shuffle(THINGS).slice(0, 2);
  const form = r.int(0, 2);
  if (form === 2) {
    const has = r.chance(0.5);
    const count = has ? r.int(1, 4) : 0;
    const visual: Visual = { kind: "box", inside: Array(count).fill(a), outside: [] };
    return fixedQ(`¿Cuántos ${a} hay en la caja?`, ["Ninguno", "Algunos"], has ? "Algunos" : "Ninguno", has ? "Hay algunos dentro de la caja." : "La caja está vacía: no hay ninguno.", visual, has ? "algunos" : "ninguno");
  }
  const many = r.int(7, 10);
  const few = r.int(1, 3);
  const visual: Visual = { kind: "rows", rows: r.shuffle([{ emoji: a, count: many }, { emoji: b, count: few }]) };
  const askMany = form === 0;
  return fixedQ(askMany ? "¿De cuál hay muchos?" : "¿De cuál hay pocos?", r.shuffle([a, b]), askMany ? a : b, askMany ? `Hay muchos ${a} y pocos ${b}.` : `Hay pocos ${b} y muchos ${a}.`, visual, askMany ? "muchos" : "pocos");
}

// Seriar hasta cinco objetos por su tamaño real.
const BY_SIZE = ["🐜", "🐭", "🐱", "🐶", "🐴", "🐘"];
const BY_SIZE_2 = ["🔑", "📱", "💻", "🚪", "🏠"];

export function seriate(r: Rng): Question {
  const pool = r.chance(0.5) ? BY_SIZE : BY_SIZE_2;
  const n = r.int(3, Math.min(5, pool.length));
  const start = r.int(0, pool.length - n);
  const sorted = pool.slice(start, start + n);
  const big = r.chance(0.5);
  const answer = big ? [...sorted].reverse() : sorted;
  return {
    kind: "sequence",
    prompt: big ? "Ordénalos del más grande al más pequeño." : "Ordénalos del más pequeño al más grande.",
    tiles: r.shuffle(sorted),
    reuse: false,
    length: n,
    answer,
    explanation: `El orden es: ${answer.join(" ")}.`,
    tag: big ? "grande-pequeno" : "pequeno-grande",
  };
}

// Antes y después; ayer, hoy y mañana.
const ROUTINES: [string, string][] = [
  ["🛁 Bañarse", "👕 Vestirse"],
  ["🪥 Lavarse los dientes", "😴 Dormir"],
  ["🌱 Sembrar", "🌽 Cosechar"],
  ["🥚 Huevo", "🐥 Pollito"],
  ["🧼 Lavarse las manos", "🍽️ Comer"],
  ["🎒 Ir al colegio", "🏠 Volver a casa"],
  ["🌅 Despertarse", "🥣 Tomar el desayuno"],
];

export function timeNotions(r: Rng): Question {
  if (r.chance(0.5)) {
    const [first, second] = r.pick(ROUTINES);
    const before = r.chance(0.5);
    const shown = before ? second : first;
    const answer = before ? first : second;
    return fixedQ(before ? `¿Qué pasa antes de «${shown}»?` : `¿Qué pasa después de «${shown}»?`, r.shuffle([first, second]), answer, `Primero: ${first}. Después: ${second}.`, undefined, before ? "antes" : "despues");
  }
  const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const d = r.int(1, 5);
  const form = r.int(0, 2);
  const options = ["Ayer", "Hoy", "Mañana"];
  if (form === 0) return fixedQ(`Hoy es ${days[d]}. El ${days[d - 1]} fue…`, options, "Ayer", `El día que ya pasó es ayer.`, undefined, "ayer");
  if (form === 1) return fixedQ(`Hoy es ${days[d]}. El ${days[d + 1]} será…`, options, "Mañana", `El día que viene es mañana.`, undefined, "manana");
  return fixedQ(`¿Cómo se llama el día en que estamos ahora?`, options, "Hoy", "El día de ahora es hoy.", undefined, "hoy");
}

// Cerca y lejos de un punto de referencia.
export function nearFar(r: Rng): Question {
  const [ref, a, b] = r.shuffle(["🏠", "🌳", "🐶", "⚽", "🚗", "🦙", "🌻", "🪁"]).slice(0, 3);
  const swap = r.chance(0.5);
  const near = { emoji: a, x: 30, y: 50 };
  const far = { emoji: b, x: 90, y: 50 };
  const items = [{ emoji: ref, x: 12, y: 50 }, swap ? { ...near, y: 35 } : near, swap ? { ...far, y: 65 } : far];
  const askNear = r.chance(0.5);
  return fixedQ(askNear ? `¿Qué está cerca de ${ref}?` : `¿Qué está lejos de ${ref}?`, r.shuffle([a, b]), askNear ? a : b, askNear ? `${a} está al lado de ${ref}: está cerca.` : `${b} está al otro extremo: está lejos.`, { kind: "scatter", items }, askNear ? "cerca" : "lejos");
}
