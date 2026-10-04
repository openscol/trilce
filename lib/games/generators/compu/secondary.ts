import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";

// Formas de pregunta: sin `forms` se elige cualquiera; con `forms`, solo esas
// (así un juego practica un único tipo de pregunta del generador).
const form = (r: Rng, max: number, forms?: number[]) => (forms ? r.pick(forms) : r.int(0, max));

// Computación de secundaria (fuera de Python): representación de datos,
// lógica digital, redes, detección de errores, SQL, estadística,
// simulación, IA (k vecinos, perceptrón, métricas) y Scratch avanzado.
// Temas tomados de los programas de Singapur (O-Level Computing), China
// (信息科技 / 信息技术) y Japón (情報I).

const pad = (n: number, bits: number) => n.toString(2).padStart(bits, "0");
const hex = (n: number) => n.toString(16).toUpperCase();

function num(prompt: string, answer: number, explanation: string, visual?: Question["visual"], tag?: string): Question {
  return { kind: "number", prompt, visual, answer, explanation, tag };
}

function choice(r: Rng, prompt: string, answer: string, distractors: string[], explanation: string, visual?: Question["visual"], tag?: string, mono?: boolean): Question {
  return { kind: "choice", prompt, visual, options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)), answer, explanation, tag, mono };
}

// ---------------------------------------------------------------------------
// Representación de datos
// ---------------------------------------------------------------------------

export function hexadecimal(r: Rng, forms?: number[]): Question {
  const n = r.int(16, 255);
  const h = hex(n);
  const t = form(r, 2, forms);
  if (t === 0) return num(`¿Qué número decimal es el hexadecimal ${h}?`, n, `${h[0]} × 16 + ${h[1]} = ${parseInt(h[0], 16) * 16} + ${parseInt(h[1], 16)} = ${n}.`, undefined, "hex-a-dec");
  if (t === 1) {
    const near = [hex(n + 1), hex(n - 1), h[1] + h[0], hex((n + 16) % 256 || 17)].filter((x) => x !== h && x.length === 2);
    return choice(r, `¿Cómo se escribe ${n} en hexadecimal?`, h, near, `${n} = ${Math.floor(n / 16)} × 16 + ${n % 16} → ${h}.`, undefined, "dec-a-hex", true);
  }
  const b = pad(n, 8);
  return choice(
    r,
    `¿Qué hexadecimal corresponde al binario ${b.slice(0, 4)} ${b.slice(4)}?`,
    h,
    [hex(parseInt(b.slice(4) + b.slice(0, 4), 2)).padStart(2, "0"), hex((n ^ 1) || 1).padStart(2, "0"), hex((n ^ 16) || 16).padStart(2, "0")],
    `Cada grupo de 4 bits es una cifra hexadecimal: ${b.slice(0, 4)} = ${h[0]}, ${b.slice(4)} = ${h[1]}.`,
    undefined,
    "bin-a-hex",
    true
  );
}

export function asciiCode(r: Rng): Question {
  const upper = r.chance(0.5);
  const base = upper ? 65 : 97;
  const ref = upper ? "A" : "a";
  const i = r.int(1, 25);
  const ch = String.fromCharCode(base + i);
  if (r.chance(0.6)) return num(`En ASCII, «${ref}» = ${base}. ¿Qué código tiene «${ch}»?`, base + i, `Las letras van seguidas: «${ch}» está ${i} lugares después de «${ref}».`);
  const opts = [-1, 1, 2, -2].map((d) => String.fromCharCode(base + ((i + d + 26) % 26)));
  return choice(r, `En ASCII, «${ref}» = ${base}. ¿Qué letra tiene el código ${base + i}?`, ch, opts, `${base + i} − ${base} = ${i}: es la letra ${i + 1} del alfabeto inglés.`, undefined, undefined, true);
}

export function imageSize(r: Rng): Question {
  const w = r.pick([8, 10, 16, 20, 32, 40, 50, 64, 100]);
  const h = r.pick([8, 10, 16, 20, 25, 32, 50]);
  const bpp = r.pick([1, 8, 24]);
  const bits = w * h * bpp;
  if (bits % 8 !== 0) return imageSize(r);
  const what = bpp === 1 ? "blanco y negro (1 bit por píxel)" : bpp === 8 ? "256 colores (8 bits por píxel)" : "color real (24 bits por píxel)";
  return num(
    `Una imagen de ${w} × ${h} píxeles en ${what}. ¿Cuántos bytes ocupa (sin comprimir)?`,
    bits / 8,
    `${w} × ${h} × ${bpp} = ${bits} bits; ÷ 8 = ${bits / 8} bytes.`
  );
}

export function binaryAddition(r: Rng): Question {
  const a = r.int(3, 40);
  const b = r.int(3, 40);
  const s = a + b;
  const bits = Math.max(6, s.toString(2).length);
  const ans = pad(s, bits);
  return choice(
    r,
    "Suma en binario:",
    ans,
    [pad(s + 1, bits), pad(s ^ 2, bits), pad(a | b, bits), pad(s - 1, bits)].filter((x) => x.length === bits),
    `${a} + ${b} = ${s} → ${ans}. En binario 1 + 1 = 10 (se lleva 1).`,
    { kind: "code", text: `  ${pad(a, bits)}\n+ ${pad(b, bits)}\n  ${"-".repeat(bits)}` },
    undefined,
    true
  );
}

// ---------------------------------------------------------------------------
// Lógica digital
// ---------------------------------------------------------------------------

type Gate = "AND" | "OR" | "XOR" | "NAND" | "NOR";
const GATE: Record<Gate, (a: number, b: number) => number> = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
};

export function logicGates(r: Rng, level: 1 | 2): Question {
  const A = r.int(0, 1);
  const B = r.int(0, 1);
  const C = r.int(0, 1);
  if (level === 1) {
    if (r.chance(0.2)) {
      return { kind: "choice", prompt: "¿Cuál es la salida de la compuerta?", visual: { kind: "code", text: `A = ${A}\nSalida = NOT A` }, options: ["0", "1"], answer: String(1 - A), explanation: "NOT invierte: 0 → 1 y 1 → 0." };
    }
    const g = r.pick<Gate>(["AND", "OR", "XOR", "NAND", "NOR"]);
    const out = GATE[g](A, B);
    return { kind: "choice", prompt: "¿Cuál es la salida de la compuerta?", visual: { kind: "code", text: `A = ${A}   B = ${B}\nSalida = A ${g} B` }, options: ["0", "1"], answer: String(out), explanation: `${A} ${g} ${B} = ${out}.`, tag: g };
  }
  const g1 = r.pick<Gate>(["AND", "OR", "XOR", "NAND"]);
  const g2 = r.pick<Gate>(["AND", "OR", "XOR"]);
  const x = GATE[g1](A, B);
  const neg = r.chance(0.3);
  const out = neg ? 1 - GATE[g2](x, C) : GATE[g2](x, C);
  const expr = neg ? `NOT ((A ${g1} B) ${g2} C)` : `(A ${g1} B) ${g2} C`;
  return {
    kind: "choice",
    prompt: "¿Cuál es la salida del circuito?",
    visual: { kind: "code", text: `A = ${A}   B = ${B}   C = ${C}\nSalida = ${expr}` },
    options: ["0", "1"],
    answer: String(out),
    explanation: `A ${g1} B = ${x}; luego ${neg ? "se aplica " : ""}${x} ${g2} ${C}${neg ? " y NOT" : ""} = ${out}.`,
  };
}

// ---------------------------------------------------------------------------
// Detección de errores
// ---------------------------------------------------------------------------

export function parityBit(r: Rng): Question {
  const n = r.int(1, 127);
  const data = pad(n, 7);
  const ones = [...data].filter((d) => d === "1").length;
  if (r.chance(0.5)) {
    const bit = ones % 2;
    return { kind: "choice", prompt: `Paridad par: ¿qué bit de paridad se agrega a ${data}?`, options: ["0", "1"], answer: String(bit), explanation: `Hay ${ones} unos; con el bit ${bit} el total de unos queda par.`, tag: "agregar" };
  }
  const sent = data + String(ones % 2);
  const flip = r.chance(0.5);
  const i = r.int(0, 7);
  const got = flip ? sent.slice(0, i) + (sent[i] === "1" ? "0" : "1") + sent.slice(i + 1) : sent;
  const total = [...got].filter((d) => d === "1").length;
  const err = total % 2 === 1;
  return {
    kind: "choice",
    prompt: `Con paridad par llegó ${got}. ¿Se detecta un error?`,
    options: ["Sí, hay error", "No hay error"],
    answer: err ? "Sí, hay error" : "No hay error",
    explanation: `Tiene ${total} unos: ${err ? "impar → se detecta un error" : "par → no se detecta error"}.`,
    tag: "detectar",
  };
}

export function isbnCheck(r: Rng): Question {
  const digits = [9, 7, r.pick([8, 9])].concat(Array.from({ length: 9 }, () => r.int(0, 9)));
  const sum = digits.reduce((s, d, i) => s + d * (i % 2 === 0 ? 1 : 3), 0);
  const check = (10 - (sum % 10)) % 10;
  return num(
    `Calcula el dígito de control del ISBN-13: ${digits.join("")}_`,
    check,
    `Suma con pesos 1, 3, 1, 3...: ${sum}. ${sum} mod 10 = ${sum % 10}; 10 − ${sum % 10} = ${check}${sum % 10 === 0 ? " (o 0 si el resto es 0)" : ""}.`,
    { kind: "code", text: `Dígitos: ${digits.join(" ")}\nPesos:   ${digits.map((_, i) => (i % 2 === 0 ? 1 : 3)).join(" ")}\nControl = (10 − suma mod 10) mod 10` }
  );
}

// ---------------------------------------------------------------------------
// Redes
// ---------------------------------------------------------------------------

export function ipValid(r: Rng, forms?: number[]): Question {
  const parts = Array.from({ length: 4 }, () => r.int(0, 255));
  const t = form(r, 4, forms);
  let ip = parts.join(".");
  let why = "Son 4 números entre 0 y 255 separados por puntos.";
  let ok = true;
  if (t === 1) {
    const i = r.int(0, 3);
    parts[i] = r.int(256, 400);
    ip = parts.join(".");
    ok = false;
    why = `${parts[i]} es mayor que 255.`;
  } else if (t === 2) {
    ip = parts.slice(0, 3).join(".");
    ok = false;
    why = "Solo tiene 3 números: una IPv4 tiene 4.";
  } else if (t === 3) {
    ip = [...parts, r.int(0, 255)].join(".");
    ok = false;
    why = "Tiene 5 números: una IPv4 tiene 4.";
  }
  return {
    kind: "choice",
    prompt: `¿Es una dirección IPv4 válida?`,
    visual: { kind: "code", text: ip },
    options: ["Válida", "No válida"],
    answer: ok ? "Válida" : "No válida",
    explanation: why,
  };
}

export function transferTime(r: Rng): Question {
  const speed = r.pick([8, 10, 16, 20, 40, 50, 80, 100]);
  const secs = r.int(2, 30);
  const mb = (speed * secs) / 8;
  if (!Number.isInteger(mb)) return transferTime(r);
  return num(
    `Descargas un archivo de ${mb} MB con una conexión de ${speed} Mbps (megabits por segundo). ¿Cuántos segundos tarda?`,
    secs,
    `${mb} MB × 8 = ${mb * 8} megabits; ÷ ${speed} = ${secs} s.`
  );
}

// ---------------------------------------------------------------------------
// Bases de datos: consultas SQL sobre una tabla
// ---------------------------------------------------------------------------

const PEOPLE = ["Ana", "Luis", "Rosa", "Hugo", "Lucía", "Mateo", "Sofía", "Diego"];

export function sqlQuery(r: Rng, forms?: number[]): Question {
  const n = r.int(5, 7);
  const names = r.shuffle(PEOPLE).slice(0, n);
  const rows = names.map((name) => ({ name, grado: r.int(1, 3), nota: r.int(8, 20) }));
  const cells = [["nombre", "grado", "nota"], ...rows.map((x) => [x.name, String(x.grado), String(x.nota)])];
  const visual = { kind: "sheet" as const, cells };
  const t = form(r, 3, forms);
  const lim = r.int(11, 16);
  if (t === 0) {
    const c = rows.filter((x) => x.nota >= lim).length;
    return num(`Tabla «alumnos». ¿Qué número devuelve: SELECT COUNT(*) FROM alumnos WHERE nota >= ${lim};`, c, `Filas con nota ≥ ${lim}: ${c}.`, visual, "count");
  }
  if (t === 1) {
    const g = r.int(1, 3);
    const c = rows.filter((x) => x.grado === g && x.nota >= lim).length;
    return num(`¿Qué número devuelve: SELECT COUNT(*) FROM alumnos WHERE grado = ${g} AND nota >= ${lim};`, c, `Con AND deben cumplirse las dos condiciones: ${c} filas.`, visual, "and");
  }
  if (t === 2) {
    const g = r.int(1, 3);
    const inG = rows.filter((x) => x.grado === g);
    if (inG.length === 0) return sqlQuery(r);
    const m = Math.max(...inG.map((x) => x.nota));
    return num(`¿Qué número devuelve: SELECT MAX(nota) FROM alumnos WHERE grado = ${g};`, m, `La nota más alta del grado ${g} es ${m}.`, visual, "max");
  }
  const sorted = [...rows].sort((a, b) => b.nota - a.nota);
  if (sorted.length > 1 && sorted[0].nota === sorted[1].nota) return sqlQuery(r);
  return choice(
    r,
    "¿Qué nombre devuelve: SELECT nombre FROM alumnos ORDER BY nota DESC LIMIT 1;",
    sorted[0].name,
    [sorted[sorted.length - 1].name, sorted[1].name, rows[0].name, rows[rows.length - 1].name],
    "DESC ordena de mayor a menor y LIMIT 1 toma la primera fila.",
    visual,
    "order"
  );
}

// ---------------------------------------------------------------------------
// Estadística y datos
// ---------------------------------------------------------------------------

export function statistics(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const n = r.pick([5, 7]);
  const xs = Array.from({ length: n }, () => r.int(5, 20));
  if (t === 0) {
    const sorted = [...xs].sort((a, b) => a - b);
    return num(`¿Cuál es la mediana de estos datos?`, sorted[(n - 1) / 2], `Ordenados: ${sorted.join(", ")}. La mediana es el del centro.`, { kind: "code", text: xs.join(", ") }, "mediana");
  }
  if (t === 1) {
    const sum = xs.reduce((s, x) => s + x, 0);
    xs[n - 1] += (n - (sum % n)) % n;
    const mean = xs.reduce((s, x) => s + x, 0) / n;
    return num(`¿Cuál es la media (promedio) de estos datos?`, mean, `Suma ${mean * n} ÷ ${n} = ${mean}.`, { kind: "code", text: xs.join(", ") }, "media");
  }
  const mode = r.int(5, 20);
  const others = r.shuffle(Array.from({ length: 16 }, (_, i) => i + 5).filter((x) => x !== mode)).slice(0, n - 3);
  const data = r.shuffle([mode, mode, mode, ...others]);
  return num(`¿Cuál es la moda de estos datos?`, mode, `${mode} es el que más se repite.`, { kind: "code", text: data.join(", ") }, "moda");
}

// Modelo de crecimiento (simulación paso a paso, como en 情報I).
export function simulation(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const p = r.int(2, 10) * 10;
    const pct = r.pick([10, 20, 50]);
    const years = r.int(2, 3);
    let x = p;
    const steps = [x];
    for (let i = 0; i < years; i++) {
      x = x + (x * pct) / 100;
      steps.push(x);
    }
    if (!Number.isInteger(x)) return simulation(r);
    return num(`Simulación: una población de ${p} bacterias crece ${pct}% cada hora. ¿Cuántas hay después de ${years} horas?`, x, `Hora a hora: ${steps.join(" → ")}.`, { kind: "code", text: `población = ${p}\nrepetir ${years} veces:\n    población = población + población × ${pct} / 100` });
  }
  if (t === 1) {
    const s = r.int(1, 5) * 10;
    const d = r.int(1, 5) * 5;
    const w = r.int(3, 8);
    return num(`Simulación de ahorro: empiezas con S/ ${s} y cada semana ahorras S/ ${d}. ¿Cuánto tienes tras ${w} semanas?`, s + d * w, `${s} + ${d} × ${w} = ${s + d * w}. Crece de forma lineal.`, { kind: "code", text: `dinero = ${s}\nrepetir ${w} veces:\n    dinero = dinero + ${d}` });
  }
  const h = r.int(3, 24) * 8;
  let x = h;
  let c = 0;
  while (x > 10) {
    x = x / 2;
    c++;
  }
  return num(`Una pelota cae desde ${h} cm y cada rebote alcanza la mitad de la altura anterior. ¿Tras cuántos rebotes la altura es 10 cm o menos?`, c, `Alturas: ${Array.from({ length: c + 1 }, (_, i) => h / 2 ** i).join(" → ")}.`, { kind: "code", text: `altura = ${h}\nrebotes = 0\nmientras altura > 10:\n    altura = altura / 2\n    rebotes = rebotes + 1` });
}

// ---------------------------------------------------------------------------
// Algoritmos
// ---------------------------------------------------------------------------

const list = (xs: number[]) => `[${xs.join(", ")}]`;

export function insertionPass(r: Rng): Question {
  const xs = r.shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, 5);
  const k = r.int(1, 3);
  const a = [...xs];
  for (let i = 1; i <= k; i++) {
    const v = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > v) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = v;
  }
  const sortedPrefix = [...xs.slice(0, k + 2).sort((p, q) => p - q), ...xs.slice(k + 2)];
  const full = [...xs].sort((p, q) => p - q);
  return choice(
    r,
    `Ordenamiento por inserción: ¿cómo queda la lista después de ${k} ${k === 1 ? "paso" : "pasos"}?`,
    list(a),
    [list(full), list(sortedPrefix), list(xs), list([...a].reverse())],
    `En cada paso se inserta el siguiente elemento en su lugar dentro de la parte ya ordenada (los primeros ${k + 1}).`,
    { kind: "code", text: list(xs) },
    undefined,
    true
  );
}

// Camino más corto en un grafo pequeño (Dijkstra).
export function shortestPath(r: Rng): Question {
  const nodes = ["A", "B", "C", "D", "E"];
  const edges: [number, number, number][] = [];
  for (let i = 0; i < 4; i++) edges.push([i, i + 1, r.int(2, 9)]);
  const extra = r.shuffle([[0, 2], [1, 3], [2, 4], [0, 3], [1, 4]] as [number, number][]).slice(0, 3);
  for (const [a, b] of extra) edges.push([a, b, r.int(3, 14)]);
  const dist = [0, Infinity, Infinity, Infinity, Infinity];
  const done = new Set<number>();
  while (done.size < 5) {
    let u = -1;
    for (let i = 0; i < 5; i++) if (!done.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
    done.add(u);
    for (const [a, b, w] of edges) {
      if (a === u && dist[u] + w < dist[b]) dist[b] = dist[u] + w;
      if (b === u && dist[u] + w < dist[a]) dist[a] = dist[u] + w;
    }
  }
  const target = r.int(2, 4);
  return num(
    `Las rutas tienen la distancia indicada (en km). ¿Cuál es la distancia más corta de A a ${nodes[target]}?`,
    dist[target],
    `Probando los caminos posibles (algoritmo de Dijkstra), lo mínimo es ${dist[target]} km.`,
    { kind: "code", text: edges.map(([a, b, w]) => `${nodes[a]} — ${nodes[b]}: ${w} km`).join("\n") }
  );
}

// ---------------------------------------------------------------------------
// Inteligencia artificial
// ---------------------------------------------------------------------------

// k vecinos más cercanos sobre el plano.
export function knn(r: Rng, k: 1 | 3): Question {
  for (;;) {
    const pts: { x: number; y: number; c: 0 | 1 }[] = [];
    const used = new Set<string>();
    const q = { x: r.int(2, 4), y: r.int(2, 4) };
    used.add(`${q.x},${q.y}`);
    while (pts.length < 6) {
      const p = { x: r.int(0, 6), y: r.int(0, 6), c: (pts.length % 2) as 0 | 1 };
      if (used.has(`${p.x},${p.y}`)) continue;
      used.add(`${p.x},${p.y}`);
      pts.push(p);
    }
    const d = pts.map((p) => ({ ...p, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 })).sort((a, b) => a.d - b.d);
    if (d[k - 1].d === d[k].d) continue; // sin empates en el borde
    const votes = d.slice(0, k).reduce((s, p) => s + p.c, 0);
    const cls = votes * 2 > k ? 1 : 0;
    const labels = ["🔴 Rojo", "🔵 Azul"];
    return {
      kind: "choice",
      prompt: `Clasificación con k = ${k} vecino${k === 1 ? "" : "s"} más cercano${k === 1 ? "" : "s"}: ¿de qué clase será ❓?`,
      visual: { kind: "coordPlane", max: 6, points: [...pts.map((p) => ({ x: p.x, y: p.y, emoji: p.c ? "🔵" : "🔴" })), { x: q.x, y: q.y, emoji: "❓" }] },
      options: labels,
      answer: labels[cls],
      explanation: k === 1 ? "Toma la clase del punto más cercano." : "Mira los 3 puntos más cercanos y gana la clase con más votos.",
      tag: `k${k}`,
    };
  }
}

export function perceptron(r: Rng): Question {
  const x1 = r.int(0, 5);
  const x2 = r.int(0, 5);
  const w1 = r.int(1, 4);
  const w2 = r.pick([-3, -2, -1, 1, 2, 3]);
  const b = r.pick([-8, -6, -5, -4, -3, -2]);
  const s = w1 * x1 + w2 * x2 + b;
  if (s === 0) return perceptron(r);
  const visual = { kind: "code" as const, text: `x1 = ${x1}   x2 = ${x2}\npesos: w1 = ${w1}   w2 = ${w2}\nsesgo: b = ${b}\nsuma = w1·x1 + w2·x2 + b\nsalida = 1 si suma > 0; si no, 0` };
  if (r.chance(0.5) && s > 0) return num("¿Cuánto vale la suma de la neurona?", s, `${w1}·${x1} + ${w2}·${x2} + (${b}) = ${s}.`, visual);
  return {
    kind: "choice",
    prompt: "¿Qué salida da la neurona (perceptrón)?",
    visual,
    options: ["0", "1"],
    answer: s > 0 ? "1" : "0",
    explanation: `suma = ${w1}·${x1} + ${w2}·${x2} + (${b}) = ${s} → ${s > 0 ? "mayor que 0: salida 1" : "no es mayor que 0: salida 0"}.`,
  };
}

export function modelMetrics(r: Rng): Question {
  const total = r.pick([20, 25, 50, 100]);
  const ok = r.int(Math.floor(total * 0.5), total - 1);
  const pct = (ok * 100) / total;
  if (!Number.isInteger(pct)) return modelMetrics(r);
  if (r.chance(0.5)) return num(`Un modelo clasificó ${total} fotos y acertó ${ok}. ¿Cuál es su exactitud (en %)?`, pct, `${ok} ÷ ${total} × 100 = ${pct}%.`);
  const tp = r.int(5, 20);
  const fp = r.int(1, 10);
  const prec = (tp * 100) / (tp + fp);
  if (!Number.isInteger(prec)) return modelMetrics(r);
  return num(`Un filtro marcó ${tp + fp} correos como spam: ${tp} sí eran spam y ${fp} no. ¿Cuál es su precisión (en %)?`, prec, `Precisión = verdaderos positivos ÷ todo lo marcado = ${tp} ÷ ${tp + fp} = ${prec}%.`);
}

export function linearModel(r: Rng): Question {
  const m = r.int(2, 9);
  const b = r.int(0, 20);
  const x = r.int(1, 12);
  const things = r.pick([
    ["horas de estudio", "puntos en el examen"],
    ["metros cuadrados", "precio (en miles)"],
    ["días de lluvia", "litros recogidos"],
    ["minutos de llamada", "costo en céntimos"],
  ]);
  if (r.chance(0.5)) return num(`Un modelo de regresión aprendió: ${things[1]} = ${m} × ${things[0]} + ${b}. ¿Qué predice para ${x} ${things[0]}?`, m * x + b, `${m} × ${x} + ${b} = ${m * x + b}.`);
  const x1 = r.int(1, 5);
  const x2 = x1 + r.int(1, 5);
  return num(
    `Los datos siguen una recta: con ${x1} → ${m * x1 + b} y con ${x2} → ${m * x2 + b}. ¿Cuánto aumenta la salida por cada unidad (la pendiente)?`,
    m,
    `(${m * x2 + b} − ${m * x1 + b}) ÷ (${x2} − ${x1}) = ${m}.`
  );
}

// ---------------------------------------------------------------------------
// Scratch avanzado (sintaxis scratchblocks en inglés; se dibuja en castellano)
// ---------------------------------------------------------------------------

const FLAG = "when flag clicked";
const scratch = (codeLines: string[], title?: string) => ({ kind: "scratch" as const, code: codeLines.join("\n"), title });
const POLY: Record<number, string> = { 3: "Triángulo", 4: "Cuadrado", 5: "Pentágono", 6: "Hexágono", 8: "Octágono" };

export function scratchPolygon(r: Rng, forms?: number[]): Question {
  const n = r.pick([3, 4, 5, 6, 8]);
  const k = r.pick([30, 40, 50, 60, 80, 100]);
  const t = form(r, 2, forms);
  const code = [FLAG, "pen down", `repeat (${n})`, `move (${k}) steps`, `turn cw (${360 / n}) degrees`, "end"];
  if (t === 0) return choice(r, "¿Qué figura dibuja el lápiz?", POLY[n], Object.values(POLY), `${n} lados iguales, girando ${360 / n}° cada vez.`, scratch(code));
  if (t === 1) return num("¿Cuántos pasos recorre el lápiz en total (el perímetro)?", n * k, `${n} lados × ${k} pasos = ${n * k}.`, scratch(code));
  const hidden = [FLAG, "pen down", `repeat (${n})`, `move (${k}) steps`, "turn cw (?) degrees", "end"];
  return num(`Para dibujar un ${POLY[n].toLowerCase()}, ¿cuántos grados debe girar en cada vuelta?`, 360 / n, `Una vuelta completa son 360°: 360 ÷ ${n} = ${360 / n}.`, scratch(hidden));
}

export function scratchRepeatUntil(r: Rng): Question {
  const a = r.int(0, 10);
  const s = r.int(2, 7);
  const lim = a + r.int(10, 40);
  let x = a;
  let c = 0;
  while (!(x > lim)) {
    x += s;
    c++;
  }
  const code = [FLAG, `set [x v] to (${a})`, "set [vueltas v] to (0)", `repeat until <(x) > (${lim})>`, `change [x v] by (${s})`, "change [vueltas v] by (1)", "end"];
  if (r.chance(0.5)) return num("Al terminar, ¿cuánto vale x?", x, `Suma ${s} hasta pasar de ${lim}: termina en ${x}.`, scratch(code));
  return num("¿Cuántas vueltas da el bucle?", c, `x pasa por ${Array.from({ length: c + 1 }, (_, i) => a + i * s).join(", ")}: ${c} vueltas.`, scratch(code));
}

export function scratchNested(r: Rng): Question {
  const a = r.int(2, 6);
  const b = r.int(2, 6);
  const k = r.int(1, 3);
  const code = [FLAG, "set [c v] to (0)", `repeat (${a})`, `repeat (${b})`, `change [c v] by (${k})`, "end", "end", "say (c)"];
  return num("¿Qué número dice el objeto al final?", a * b * k, `${a} × ${b} vueltas, sumando ${k} cada vez: ${a * b * k}.`, scratch(code));
}

export function scratchListSum(r: Rng): Question {
  const xs = Array.from({ length: r.int(4, 5) }, () => r.int(1, 20));
  const lim = r.int(5, 14);
  const filtered = r.chance(0.5);
  const body = filtered
    ? [`if <(item (i) of [nums v]) > (${lim})> then`, "change [s v] by (item (i) of [nums v])", "end"]
    : ["change [s v] by (item (i) of [nums v])"];
  const code = [FLAG, "delete all of [nums v]", ...xs.map((x) => `add (${x}) to [nums v]`), "set [s v] to (0)", "set [i v] to (1)", "repeat (length of [nums v])", ...body, "change [i v] by (1)", "end", "say (s)"];
  const ans = xs.filter((x) => !filtered || x > lim).reduce((s, x) => s + x, 0);
  return num("¿Qué número dice el objeto?", ans, filtered ? `Suma solo los mayores que ${lim}: ${ans}.` : `Recorre la lista sumando todo: ${ans}.`, scratch(code));
}

export function scratchDirection(r: Rng): Question {
  const a = r.int(1, 6) * 15;
  const b = r.int(1, 6) * 15;
  const start = r.pick([0, 90]);
  const end = start + a - b;
  if (end < 0 || end > 180) return scratchDirection(r);
  const code = [FLAG, `point in direction (${start})`, `turn cw (${a}) degrees`, `turn ccw (${b}) degrees`, "say (direction)"];
  return num("¿Qué dirección dice el objeto?", end, `${start} + ${a} (derecha) − ${b} (izquierda) = ${end}.`, scratch(code));
}

export function scratchGravity(r: Rng): Question {
  const v = r.int(4, 10);
  const n = r.int(2, Math.min(5, v));
  let y = 0;
  let vy = v;
  for (let i = 0; i < n; i++) {
    y += vy;
    vy -= 1;
  }
  const code = [FLAG, "set y to (0)", `set [velocidad v] to (${v})`, `repeat (${n})`, "change y by (velocidad)", "change [velocidad v] by (-1)", "end", "say (y position)"];
  return num("Simulación de un salto con gravedad. ¿Qué posición y dice el objeto?", y, `Suma ${Array.from({ length: n }, (_, i) => v - i).join(" + ")} = ${y}: la gravedad frena la subida.`, scratch(code));
}

export function scratchRecursion(r: Rng, level: 1 | 2): Question {
  if (level === 1) {
    const k = r.int(3, 10);
    const step = r.pick([1, 1, 2]);
    const add = r.pick(["n", "n", "1"]);
    const terms: number[] = [];
    for (let n = k; n > 0; n -= step) terms.push(add === "n" ? n : 1);
    const total = terms.reduce((a, b) => a + b, 0);
    const code = ["define contar (n)", "if <(n) > (0)> then", `change [total v] by ${add === "n" ? "(n)" : "(1)"}`, `contar ((n) - (${step}))`, "end", "", FLAG, "set [total v] to (0)", `contar (${k})`, "say (total)"];
    return num("Un bloque que se llama a sí mismo (recursión). ¿Qué número dice el objeto?", total, `Se suma ${terms.join(" + ")} = ${total}.`, scratch(code));
  }
  const calls = r.pick([2, 2, 3]);
  const k = r.int(2, calls === 2 ? 6 : 4);
  const c = r.int(1, 3);
  const nodes = (calls ** k - 1) / (calls - 1);
  const code = ["define rama (n)", "if <(n) > (0)> then", `change [ramas v] by (${c})`, ...Array(calls).fill("rama ((n) - (1))"), "end", "", FLAG, "set [ramas v] to (0)", `rama (${k})`, "say (ramas)"];
  return num(
    `Un árbol fractal: cada rama crea ${calls} ramas más pequeñas. ¿Qué número dice el objeto?`,
    nodes * c,
    `Ramas por nivel: ${Array.from({ length: k }, (_, i) => calls ** i).join(" + ")} = ${nodes}; cada una suma ${c}: ${nodes * c}.`,
    scratch(code)
  );
}
