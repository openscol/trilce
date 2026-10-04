import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { uniqueOptions } from "../common";

// Programación con flechas (estilo Code.org): un robot en una cuadrícula,
// una meta y paredes. Los puzzles se generan al azar y se validan con BFS,
// así cada respuesta es verificable (y única cuando el juego lo exige).

export type Cell = { r: number; c: number };
export type Dir = "⬆️" | "⬇️" | "⬅️" | "➡️";

export const DIRS: Dir[] = ["⬆️", "⬇️", "⬅️", "➡️"];
const DELTA: Record<Dir, Cell> = { "⬆️": { r: -1, c: 0 }, "⬇️": { r: 1, c: 0 }, "⬅️": { r: 0, c: -1 }, "➡️": { r: 0, c: 1 } };
const SIZE = 5;

const same = (a: Cell, b: Cell) => a.r === b.r && a.c === b.c;
const inside = (p: Cell) => p.r >= 0 && p.c >= 0 && p.r < SIZE && p.c < SIZE;
const step = (p: Cell, d: Dir): Cell => ({ r: p.r + DELTA[d].r, c: p.c + DELTA[d].c });

// Recorre el programa; null si se sale de la cuadrícula o choca con una pared.
export function run(start: Cell, program: Dir[], walls: Cell[]): Cell[] | null {
  const trail = [start];
  let p = start;
  for (const d of program) {
    p = step(p, d);
    if (!inside(p) || walls.some((w) => same(w, p))) return null;
    trail.push(p);
  }
  return trail;
}

// BFS: distancia mínima, cantidad de caminos mínimos y uno de ellos.
function shortest(start: Cell, goal: Cell, walls: Cell[]) {
  const key = (p: Cell) => p.r * SIZE + p.c;
  const dist = new Map<number, number>([[key(start), 0]]);
  const ways = new Map<number, number>([[key(start), 1]]);
  const prev = new Map<number, { from: Cell; d: Dir }>();
  const queue = [start];
  while (queue.length) {
    const p = queue.shift()!;
    for (const d of DIRS) {
      const q = step(p, d);
      if (!inside(q) || walls.some((w) => same(w, q))) continue;
      const k = key(q);
      const nd = dist.get(key(p))! + 1;
      if (!dist.has(k)) {
        dist.set(k, nd);
        ways.set(k, ways.get(key(p))!);
        prev.set(k, { from: p, d });
        queue.push(q);
      } else if (dist.get(k) === nd) {
        ways.set(k, ways.get(k)! + ways.get(key(p))!);
      }
    }
  }
  if (!dist.has(key(goal))) return null;
  const path: Dir[] = [];
  let cur = goal;
  while (!same(cur, start)) {
    const pr = prev.get(key(cur))!;
    path.unshift(pr.d);
    cur = pr.from;
  }
  return { length: dist.get(key(goal))!, ways: ways.get(key(goal))!, path };
}

function randomCell(r: Rng): Cell {
  return { r: r.int(0, SIZE - 1), c: r.int(0, SIZE - 1) };
}

export function puzzle(r: Rng, opts: { min: number; max: number; unique: boolean }) {
  for (let guard = 0; ; guard++) {
    const robot = randomCell(r);
    const goal = randomCell(r);
    const walls: Cell[] = [];
    const nWalls = r.int(1, 4);
    while (walls.length < nWalls) {
      const w = randomCell(r);
      if (!same(w, robot) && !same(w, goal) && !walls.some((x) => same(x, w))) walls.push(w);
    }
    const s = shortest(robot, goal, walls);
    if (!s || s.length < opts.min || s.length > opts.max) continue;
    if (opts.unique && s.ways !== 1) continue;
    return { robot, goal, walls, path: s.path };
  }
}

function grid(p: { robot: Cell; goal?: Cell; walls: Cell[]; path?: Cell[]; marks?: (Cell & { label: string })[] }): Visual {
  return { kind: "codeGrid", size: SIZE, robot: p.robot, goal: p.goal, walls: p.walls, path: p.path, marks: p.marks };
}

const show = (program: Dir[]) => program.join(" ");

// G.3: ¿a dónde llega el robot con estas instrucciones?
export function robotDestination(r: Rng): Question {
  for (;;) {
    const robot = randomCell(r);
    const walls: Cell[] = [];
    const len = r.int(2, 5);
    const program = Array.from({ length: len }, () => r.pick(DIRS));
    const trail = run(robot, program, walls);
    if (!trail) continue;
    const end = trail[trail.length - 1];
    if (same(end, robot)) continue;
    const decoys: Cell[] = [];
    for (let g = 0; decoys.length < 2 && g < 50; g++) {
      const d = randomCell(r);
      if (!same(d, end) && !same(d, robot) && !decoys.some((x) => same(x, d))) decoys.push(d);
    }
    const labels = r.shuffle(["A", "B", "C"]);
    const marks = [end, ...decoys].map((p, i) => ({ ...p, label: labels[i] }));
    return {
      kind: "choice",
      prompt: `El robot sigue estas instrucciones: ${show(program)}. ¿A qué letra llega?`,
      visual: grid({ robot, walls, marks }),
      options: ["A", "B", "C"],
      answer: labels[0],
      explanation: `Siguiendo ${show(program)}, el robot llega a la ${labels[0]}.`,
    };
  }
}

// Programas parecidos que NO llegan a la meta (para distractores).
function wrongPrograms(r: Rng, robot: Cell, goal: Cell, walls: Cell[], good: Dir[]): Dir[][] {
  const out: Dir[][] = [];
  const fails = (p: Dir[]) => {
    const t = run(robot, p, walls);
    return !t || !same(t[t.length - 1], goal);
  };
  for (let g = 0; out.length < 5 && g < 80; g++) {
    const p = [...good];
    const kind = r.int(0, 2);
    if (kind === 0) p[r.int(0, p.length - 1)] = r.pick(DIRS);
    else if (kind === 1 && p.length > 1) p.splice(r.int(0, p.length - 1), 1);
    else p.push(r.pick(DIRS));
    if (fails(p) && !out.some((o) => show(o) === show(p))) out.push(p);
  }
  return out;
}

// G.4: elegir el programa que lleva al robot a la estrella.
export function chooseProgram(r: Rng): Question {
  const { robot, goal, walls, path } = puzzle(r, { min: 2, max: 5, unique: false });
  const answer = show(path);
  return {
    kind: "choice",
    prompt: "¿Qué programa lleva al robot hasta la estrella sin chocar con las paredes?",
    visual: grid({ robot, goal, walls }),
    options: uniqueOptions(r, answer, wrongPrograms(r, robot, goal, walls, path).map(show)),
    answer,
    explanation: `${answer} lleva al robot hasta la estrella.`,
  };
}

// G.5: escribir el programa (camino más corto único).
export function writeProgram(r: Rng, min = 2, max = 5): Question {
  const { robot, goal, walls, path } = puzzle(r, { min, max, unique: true });
  return {
    kind: "sequence",
    prompt: `Programa al robot para que llegue a la estrella en ${path.length} pasos.`,
    visual: grid({ robot, goal, walls }),
    tiles: DIRS,
    reuse: true,
    length: path.length,
    answer: path,
    explanation: `El camino más corto es ${show(path)}.`,
  };
}

const LOOP_WORD = (n: number, d: Dir) => `Repetir ${n} veces ${d}`;

// H.4: un bucle que lleva al robot en línea recta.
export function loopProgram(r: Rng): Question {
  for (;;) {
    const robot = randomCell(r);
    const d = r.pick(DIRS);
    const n = r.int(2, 4);
    const trail = run(robot, Array(n).fill(d), []);
    if (!trail) continue;
    const goal = trail[trail.length - 1];
    const answer = LOOP_WORD(n, d);
    const others = [LOOP_WORD(n + 1, d), LOOP_WORD(Math.max(1, n - 1), d), ...DIRS.filter((x) => x !== d).map((x) => LOOP_WORD(n, x))];
    return {
      kind: "choice",
      prompt: "¿Qué bucle lleva al robot hasta la estrella?",
      visual: grid({ robot, goal, walls: [] }),
      options: uniqueOptions(r, answer, others),
      answer,
      explanation: `La estrella está a ${n} pasos ${d}: «${answer}».`,
    };
  }
}

// J.2: el robot tenía que seguir el camino marcado; ¿en qué paso se equivocó?
export function debugRobot(r: Rng, min = 3, max = 5): Question {
  for (;;) {
    const { robot, goal, walls, path } = puzzle(r, { min, max, unique: false });
    const i = r.int(0, path.length - 1);
    const wrong = r.pick(DIRS.filter((d) => d !== path[i]));
    const program = [...path];
    program[i] = wrong;
    const planned = run(robot, path, walls)!.slice(1, -1);
    const answer = `Paso ${i + 1}`;
    return {
      kind: "choice",
      prompt: `El robot debía seguir el camino marcado hasta la estrella, pero su programa tiene un error: ${program.map((d, k) => `${k + 1}) ${d}`).join("  ")}. ¿Qué paso está mal?`,
      visual: grid({ robot, goal, walls, path: planned }),
      options: program.map((_, k) => `Paso ${k + 1}`),
      answer,
      explanation: `En el paso ${i + 1} debía ir ${path[i]}, no ${wrong}.`,
    };
  }
}

// ---------------------------------------------------------------------------
// 2.° grado: bucles combinados y programas más cortos.
// ---------------------------------------------------------------------------

// ➡️ ➡️ ➡️ ⬇️ ⬇️ → "Repetir 3 veces ➡️, Repetir 2 veces ⬇️" (un solo paso queda igual).
export function compress(program: Dir[]): string {
  const blocks: string[] = [];
  for (let i = 0; i < program.length; ) {
    let j = i;
    while (j < program.length && program[j] === program[i]) j++;
    const n = j - i;
    blocks.push(n === 1 ? program[i] : `Repetir ${n} veces ${program[i]}`);
    i = j;
  }
  return blocks.join(", ");
}

// Puzzle cuyo camino tiene al menos un tramo recto de 2+ pasos (para bucles).
function loopPuzzle(r: Rng) {
  for (;;) {
    const p = puzzle(r, { min: 4, max: 7, unique: false });
    if (compress(p.path).includes("Repetir")) return p;
  }
}

export function chooseLoopProgram(r: Rng): Question {
  const { robot, goal, walls, path } = loopPuzzle(r);
  const answer = compress(path);
  return {
    kind: "choice",
    prompt: "¿Qué programa con bucles lleva al robot hasta la estrella sin chocar?",
    visual: grid({ robot, goal, walls }),
    options: uniqueOptions(r, answer, wrongPrograms(r, robot, goal, walls, path).map(compress)),
    answer,
    explanation: `${answer} lleva al robot hasta la estrella.`,
  };
}

// ¿A dónde llega el robot? El programa se muestra con bucles.
export function loopDestination(r: Rng): Question {
  for (;;) {
    const robot = randomCell(r);
    const runs = r.int(2, 3);
    const program: Dir[] = [];
    for (let k = 0; k < runs; k++) program.push(...Array(r.int(1, 3)).fill(r.pick(DIRS)));
    const trail = run(robot, program, []);
    if (!trail || !compress(program).includes("Repetir")) continue;
    const end = trail[trail.length - 1];
    if (same(end, robot)) continue;
    const decoys: Cell[] = [];
    for (let g = 0; decoys.length < 2 && g < 50; g++) {
      const d = randomCell(r);
      if (!same(d, end) && !same(d, robot) && !decoys.some((x) => same(x, d))) decoys.push(d);
    }
    const labels = r.shuffle(["A", "B", "C"]);
    return {
      kind: "choice",
      prompt: `El robot sigue este programa: ${compress(program)}. ¿A qué letra llega?`,
      visual: grid({ robot, walls: [], marks: [end, ...decoys].map((p, i) => ({ ...p, label: labels[i] })) }),
      options: ["A", "B", "C"],
      answer: labels[0],
      explanation: `${compress(program)} = ${show(program)}: llega a la ${labels[0]}.`,
    };
  }
}

const OPPOSITE: Record<Dir, Dir> = { "⬆️": "⬇️", "⬇️": "⬆️", "⬅️": "➡️", "➡️": "⬅️" };

// El más corto entre varios programas que sí llegan (con desvíos de ida y vuelta).
export function shortestProgram(r: Rng): Question {
  for (;;) {
    const { robot, goal, walls, path } = puzzle(r, { min: 3, max: 5, unique: false });
    const longer: Dir[][] = [];
    for (let g = 0; longer.length < 3 && g < 60; g++) {
      const p = [...path];
      const at = r.int(0, p.length);
      const d = r.pick(DIRS);
      p.splice(at, 0, d, OPPOSITE[d]);
      const t = run(robot, p, walls);
      if (t && same(t[t.length - 1], goal) && !longer.some((o) => show(o) === show(p))) longer.push(p);
    }
    if (longer.length < 2) continue;
    const answer = show(path);
    return {
      kind: "choice",
      prompt: "Todos estos programas llevan al robot a la estrella. ¿Cuál es el más corto?",
      visual: grid({ robot, goal, walls }),
      options: uniqueOptions(r, answer, longer.map(show)),
      answer,
      explanation: `${answer} tiene ${path.length} pasos; los demás dan vueltas de más.`,
    };
  }
}

// ---------------------------------------------------------------------------
// 3.° en adelante: funciones (un bloque de pasos con nombre).
// ---------------------------------------------------------------------------

export function functionDestination(r: Rng): Question {
  for (;;) {
    const robot = randomCell(r);
    const f = Array.from({ length: r.int(2, 3) }, () => r.pick(DIRS));
    const calls = r.int(2, 3);
    const extra = r.chance(0.5) ? [r.pick(DIRS)] : [];
    const program = [...Array(calls).fill(f).flat(), ...extra] as Dir[];
    const trail = run(robot, program, []);
    if (!trail) continue;
    const end = trail[trail.length - 1];
    if (same(end, robot)) continue;
    const decoys: Cell[] = [];
    for (let g = 0; decoys.length < 2 && g < 50; g++) {
      const d = randomCell(r);
      if (!same(d, end) && !same(d, robot) && !decoys.some((x) => same(x, d))) decoys.push(d);
    }
    const labels = r.shuffle(["A", "B", "C"]);
    const text = [...Array(calls).fill("F"), ...extra].join(", ");
    return {
      kind: "choice",
      prompt: `La función F = ${show(f)}. El programa es: ${text}. ¿A qué letra llega el robot?`,
      visual: grid({ robot, walls: [], marks: [end, ...decoys].map((p, i) => ({ ...p, label: labels[i] })) }),
      options: ["A", "B", "C"],
      answer: labels[0],
      explanation: `${text} = ${show(program)}: llega a la ${labels[0]}.`,
    };
  }
}
