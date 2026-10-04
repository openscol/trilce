import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";

// Formas de pregunta: sin `forms` se elige cualquiera; con `forms`, solo esas
// (así un juego practica un único tipo de pregunta del generador).
const form = (r: Rng, max: number, forms?: number[]) => (forms ? r.pick(forms) : r.int(0, max));

// Python para secundaria (1.° a 5.°), de lo básico a lo avanzado, al estilo
// de Singapur (O-Level Computing), China (信息技术) y Japón (情報I): leer
// código y predecir su salida, encontrar errores y completar líneas.
// Cada programa es Python 3 real: la respuesta se calcula aquí y la prueba
// automática la compara con lo que imprime python3.

const OUT = "¿Qué imprime este programa?";
const SHORT = ["sol", "mar", "luz", "red", "pan", "voz", "flor", "gato", "dato", "bit"];
const WORDS = ["python", "codigo", "datos", "robot", "teclado", "pantalla", "internet", "variable", "funcion", "memoria", "archivo", "sensor"];
const NAMES = ["Ana", "Luis", "Sofia", "Diego", "Rosa", "Mateo", "Lucia", "Hugo"];

const list = (xs: (number | string)[]) => `[${xs.map((x) => (typeof x === "string" ? `'${x}'` : x)).join(", ")}]`;
const lines = (...ls: string[]) => ls.join("\n");
const ints = (r: Rng, n: number, min: number, max: number) => Array.from({ length: n }, () => r.int(min, max));
const distinctInts = (r: Rng, n: number, min: number, max: number) => r.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, n);
const floorDiv = (a: number, b: number) => Math.floor(a / b);

function num(code: string, answer: number, explanation: string, prompt = OUT): Question {
  return { kind: "number", prompt, visual: { kind: "code", text: code }, answer, explanation, tag: "py-out" };
}

function pick(r: Rng, code: string, answer: string, distractors: string[], explanation: string, prompt = OUT): Question {
  return {
    kind: "choice",
    prompt,
    visual: { kind: "code", text: code },
    options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)),
    answer,
    explanation,
    tag: "py-out",
    mono: true,
  };
}

// ---------------------------------------------------------------------------
// 1.° de Secundaria: print, variables, operadores, tipos y errores
// ---------------------------------------------------------------------------

export function pyPrint(r: Rng, forms?: number[]): Question {
  const t = form(r, 5, forms);
  const [a, b] = r.shuffle(SHORT).slice(0, 2);
  if (t === 0) return pick(r, `print("${a}" + "${b}")`, a + b, [`${a} ${b}`, `${a} + ${b}`, b + a], "El + une los textos sin espacio.");
  if (t === 1) return pick(r, `print("${a}", "${b}")`, `${a} ${b}`, [a + b, `${a}, ${b}`, `${b} ${a}`], "La coma separa los valores con un espacio.");
  if (t === 2) {
    const n = r.int(2, 4);
    return pick(r, `print("${a}" * ${n})`, a.repeat(n), [a.repeat(n - 1), a.repeat(n + 1), `${a}${n}`], `Texto * ${n} repite el texto ${n} veces.`);
  }
  const x = r.int(1, 9);
  const y = r.int(1, 9);
  if (t === 3) return pick(r, `print("${x}" + "${y}")`, `${x}${y}`, [`${x + y}`, `${x} ${y}`, `${x}+${y}`], "Entre comillas son textos: el + los une, no los suma.");
  if (t === 4) return pick(r, `print(${x}, "+", ${y}, "=", ${x + y})`, `${x} + ${y} = ${x + y}`, [`${x}+${y}=${x + y}`, `${x} + ${y} = ${x}${y}`, `x + y = ${x + y}`], "Cada coma agrega un espacio entre los valores.");
  return pick(r, lines(`print("${a}", end="")`, `print("${b}")`), a + b, [`${a} ${b}`, b + a, `${a}\n${b}`], 'Con end="" el siguiente print sigue en la misma línea.');
}

export function pyVariables(r: Rng, forms?: number[]): Question {
  const t = form(r, 5, forms);
  const p = r.int(2, 15);
  const q = r.int(2, 15);
  if (t === 0) return num(lines(`x = ${p}`, `y = ${q}`, "x = x + y", "print(x)"), p + q, `x pasa a valer ${p} + ${q} = ${p + q}.`);
  if (t === 1) {
    const k = r.int(2, 4);
    const m = r.int(1, p * k);
    return num(lines(`x = ${p}`, `x = x * ${k}`, `x = x - ${m}`, "print(x)"), p * k - m, `${p} × ${k} = ${p * k}; menos ${m} da ${p * k - m}.`);
  }
  if (t === 2) return num(lines(`a = ${p}`, `b = ${q}`, "a = b", "b = a", "print(a + b)"), 2 * q, `Tras a = b, las dos valen ${q}: ${q} + ${q} = ${2 * q}.`);
  if (t === 3) {
    const [lo, hi] = [Math.min(p, q), Math.max(p, q) + 1];
    return num(lines(`a, b = ${lo}, ${hi}`, "a, b = b, a", "print(a - b)"), hi - lo, `Se intercambian: a = ${hi}, b = ${lo}.`);
  }
  if (t === 4) {
    const k = r.int(2, 9);
    return num(lines(`puntos = ${p}`, `puntos += ${k}`, "puntos *= 2", "print(puntos)"), (p + k) * 2, `(${p} + ${k}) × 2 = ${(p + k) * 2}.`);
  }
  const z = p === q ? q + 1 : q;
  return num(lines(`x = ${p}`, "y = x", `x = ${z}`, "print(y)"), p, `y guardó el valor ${p}; cambiar x después no cambia y.`);
}

export function pyArithmetic(r: Rng, forms?: number[]): Question {
  const t = form(r, 6, forms);
  if (t === 0) {
    const a = r.int(10, 60);
    const b = r.int(3, 9);
    return num(`print(${a} // ${b})`, floorDiv(a, b), `// es la división entera: ${a} ÷ ${b} = ${floorDiv(a, b)} y sobra ${a % b}.`);
  }
  if (t === 1) {
    const a = r.int(10, 60);
    const b = r.int(3, 9);
    return num(`print(${a} % ${b})`, a % b, `% da el resto: ${a} = ${b} × ${floorDiv(a, b)} + ${a % b}.`);
  }
  if (t === 2) {
    const a = r.int(2, 5);
    const b = r.int(2, 3);
    return num(`print(${a} ** ${b})`, a ** b, `** es potencia: ${a} elevado a ${b} = ${a ** b}.`);
  }
  const a = r.int(2, 12);
  const b = r.int(2, 9);
  const c = r.int(2, 6);
  if (t === 3) return num(`print(${a} + ${b} * ${c})`, a + b * c, `Primero la multiplicación: ${b} × ${c} = ${b * c}; luego + ${a}.`);
  if (t === 4) return num(`print((${a} + ${b}) * ${c})`, (a + b) * c, `Primero el paréntesis: ${a + b}; luego × ${c}.`);
  if (t === 5) {
    const big = a * c + r.int(0, c - 1);
    return num(`print(${big} - ${big} // ${c} * ${c})`, big % c, `${big} // ${c} * ${c} = ${floorDiv(big, c) * c}; la resta da el resto.`);
  }
  const q = r.int(2, 9);
  return pick(r, `print(${q * c} / ${c})`, `${q}.0`, [`${q}`, `${q},0`, "0.0"], "/ siempre da un número decimal (float).");
}

const TYPES: [string, string][] = [
  ["7", "int"], ["42", "int"], ["10 // 2", "int"], ["7.0", "float"], ["3.14", "float"], ["10 / 2", "float"],
  ['"7"', "str"], ['"Hola"', "str"], ['"3.5"', "str"], ['"True"', "str"], ["True", "bool"], ["5 > 3", "bool"], ["False", "bool"],
  ["7 // 2", "int"], ['len("hola")', "int"], ["3 + 4.0", "float"], ["2 ** 0.5", "float"], ['"a" + "b"', "str"], ["1 < 2", "bool"],
];

export function pyTypes(r: Rng, forms?: number[]): Question {
  const t = form(r, 4, forms);
  if (t === 0) {
    const [v, type] = r.pick(TYPES);
    const cls = (x: string) => `<class '${x}'>`;
    return pick(r, `print(type(${v}))`, cls(type), ["int", "float", "str", "bool"].map(cls), `${v} es de tipo ${type}.`);
  }
  const n = r.int(2, 40);
  const m = r.int(2, 9);
  if (t === 1) return num(`print(int("${n}") + ${m})`, n + m, `int("${n}") convierte el texto en el número ${n}.`);
  if (t === 2) return pick(r, `print(str(${n}) + "${m}")`, `${n}${m}`, [`${n + m}`, `${n} ${m}`, `${n}+${m}`], "str() lo vuelve texto y el + une textos.");
  if (t === 3) {
    const d = r.int(1, 9);
    return num(`print(int(${n}.${d}))`, n, `int() corta la parte decimal: ${n}.${d} → ${n}.`);
  }
  return pick(
    r,
    lines(`edad = input()  # el usuario escribe ${n}`, "print(edad * 2)"),
    `${n}${n}`,
    [`${n * 2}`, `${n} ${n}`, `${n}*2`],
    "input() devuelve texto: «texto * 2» lo repite. Para calcular hay que usar int(input())."
  );
}

// ---------------------------------------------------------------------------
// 2.° de Secundaria: condicionales, lógica, for, while
// ---------------------------------------------------------------------------

export function pyIf(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  if (t === 0) {
    const band = r.int(0, 3);
    const nota = [r.int(18, 20), r.int(14, 17), r.int(11, 13), r.int(0, 10)][band];
    const ans = ["AD", "A", "B", "C"][band];
    const code = lines(
      `nota = ${nota}`,
      "if nota >= 18:",
      '    print("AD")',
      "elif nota >= 14:",
      '    print("A")',
      "elif nota >= 11:",
      '    print("B")',
      "else:",
      '    print("C")'
    );
    return pick(r, code, ans, ["AD", "A", "B", "C"], `Con ${nota}, la primera condición verdadera da «${ans}».`);
  }
  if (t === 1) {
    const band = r.int(0, 2);
    const temp = [r.int(26, 35), r.int(16, 25), r.int(5, 15)][band];
    const ans = ["calor", "templado", "frio"][band];
    const code = lines(`t = ${temp}`, "if t > 25:", '    print("calor")', "elif t > 15:", '    print("templado")', "else:", '    print("frio")');
    return pick(r, code, ans, ["calor", "templado", "frio", "calor\ntemplado"], `Con t = ${temp} se cumple la rama «${ans}». Solo se ejecuta una rama.`);
  }
  if (t === 2) {
    const band = r.int(0, 2);
    const x = band === 0 ? r.int(6, 9) : band === 1 ? r.pick([r.int(6, 9), r.int(1, 5)]) : r.int(1, 5);
    const y = band === 0 ? r.int(6, 9) : band === 1 ? (x > 5 ? r.int(1, 5) : r.int(6, 9)) : r.int(1, 5);
    const ans = ["ambos", "uno", "ninguno"][band];
    const code = lines(`x = ${x}`, `y = ${y}`, "if x > 5 and y > 5:", '    print("ambos")', "elif x > 5 or y > 5:", '    print("uno")', "else:", '    print("ninguno")');
    return pick(r, code, ans, ["ambos", "uno", "ninguno", "uno\nambos"], `x > 5 es ${x > 5 ? "True" : "False"} y y > 5 es ${y > 5 ? "True" : "False"}.`);
  }
  const n = r.int(6, 20);
  const k = r.int(10, 14);
  const ans = n > k ? "A\nB" : "B";
  return pick(
    r,
    lines(`n = ${n}`, `if n > ${k}:`, '    print("A")', "if n > 5:", '    print("B")'),
    ans,
    ["A\nB", "A", "B", "B\nA"],
    "Son dos if separados (no elif): se revisan los dos."
  );
}

type Cmp = [string, (a: number, b: number) => boolean];
const CMPS: Cmp[] = [[">", (a, b) => a > b], ["<", (a, b) => a < b], [">=", (a, b) => a >= b], ["<=", (a, b) => a <= b], ["==", (a, b) => a === b], ["!=", (a, b) => a !== b]];

export function pyBool(r: Rng): Question {
  const a = r.int(1, 9);
  const b = r.int(1, 9);
  const c = r.int(1, 9);
  const [o1, f1] = r.pick(CMPS);
  const [o2, f2] = r.pick(CMPS);
  const v1 = f1(a, b);
  const v2 = f2(b, c);
  const form = r.int(0, 2);
  const expr = form === 0 ? `a ${o1} b and b ${o2} c` : form === 1 ? `a ${o1} b or b ${o2} c` : `not (a ${o1} b) or b ${o2} c`;
  const value = form === 0 ? v1 && v2 : form === 1 ? v1 || v2 : !v1 || v2;
  const ans = value ? "True" : "False";
  return {
    kind: "choice",
    prompt: OUT,
    visual: { kind: "code", text: lines(`a = ${a}`, `b = ${b}`, `c = ${c}`, `print(${expr})`) },
    options: ["True", "False"],
    answer: ans,
    explanation: `a ${o1} b es ${v1 ? "True" : "False"}; b ${o2} c es ${v2 ? "True" : "False"}. Resultado: ${ans}.`,
    tag: "py-out",
    mono: true,
  };
}

const rangeOf = (a: number, b: number, s: number) => {
  const out: number[] = [];
  for (let i = a; s > 0 ? i < b : i > b; i += s) out.push(i);
  return out;
};

export function pyFor(r: Rng, forms?: number[]): Question {
  const t = form(r, 5, forms);
  if (t === 0) {
    const a = r.int(0, 5);
    const b = a + r.int(3, 7);
    const sum = rangeOf(a, b, 1).reduce((s, x) => s + x, 0);
    return num(lines("total = 0", `for i in range(${a}, ${b}):`, "    total += i", "print(total)"), sum, `range(${a}, ${b}) va de ${a} a ${b - 1} (no incluye ${b}).`);
  }
  if (t === 1) {
    const a = r.int(0, 10);
    const s = r.int(2, 5);
    const b = a + r.int(6, 25);
    const n = rangeOf(a, b, s).length;
    return num(lines("c = 0", `for i in range(${a}, ${b}, ${s}):`, "    c += 1", "print(c)"), n, `Valores: ${rangeOf(a, b, s).join(", ")} → ${n} vueltas.`);
  }
  if (t === 2) {
    const a = r.int(0, 6);
    const s = r.int(2, 4);
    const b = a + s * r.int(2, 4) + r.int(0, s - 1);
    const xs = rangeOf(a, b, s);
    const withEnd = [...xs, xs[xs.length - 1] + s];
    return pick(r, `print(list(range(${a}, ${b}, ${s})))`, list(xs), [list(withEnd), list(xs.map((x) => x + 1)), list(xs.slice(1))], `Empieza en ${a}, salta de ${s} en ${s} y se detiene antes de ${b}.`);
  }
  if (t === 3) {
    const n = r.int(2, 8);
    const f = rangeOf(1, n + 1, 1).reduce((p, x) => p * x, 1);
    return num(lines("p = 1", `for i in range(1, ${n + 1}):`, "    p *= i", "print(p)"), f, `1 × 2 × ... × ${n} = ${f}.`);
  }
  if (t === 4) {
    const w = r.pick(SHORT.filter((x) => x.length >= 3));
    const rev = [...w].reverse().join("");
    return pick(r, lines('s = ""', `for ch in "${w}":`, "    s = ch + s", "print(s)"), rev, [w, w.slice(1) + w[0], rev.slice(1) + rev[0]], "Cada letra se pone delante: la palabra queda al revés.");
  }
  const n = r.int(3, 7);
  const k = r.int(2, 5);
  return num(lines("x = 0", `for i in range(${n}):`, `    x = x + ${k}`, "print(x)"), n * k, `El bucle da ${n} vueltas y suma ${k} cada vez.`);
}

export function pyWhile(r: Rng, forms?: number[]): Question {
  const t = form(r, 4, forms);
  if (t === 0) {
    const n = r.int(10, 200);
    let x = n;
    let c = 0;
    while (x > 1) {
      x = floorDiv(x, 2);
      c++;
    }
    return num(lines(`n = ${n}`, "c = 0", "while n > 1:", "    n = n // 2", "    c += 1", "print(c)"), c, `Se divide entre 2 hasta llegar a 1: ${c} veces.`);
  }
  if (t === 1) {
    const a = r.int(1, 5);
    const lim = r.int(20, 100);
    let x = a;
    while (x < lim) x *= 2;
    return num(lines(`x = ${a}`, `while x < ${lim}:`, "    x = x * 2", "print(x)"), x, `Se duplica mientras sea menor que ${lim}: termina en ${x}.`);
  }
  if (t === 2) {
    const a = r.int(10, 40);
    const s = r.int(3, 7);
    const c = Math.ceil(a / s);
    return num(lines(`n = ${a}`, "c = 0", "while n > 0:", `    n -= ${s}`, "    c += 1", "print(c)"), c, `Restar ${s} a ${a} hasta llegar a 0 o menos toma ${c} vueltas.`);
  }
  if (t === 3) {
    const n = r.int(100, 9999);
    const s = [...String(n)].reduce((acc, d) => acc + Number(d), 0);
    return num(lines(`n = ${n}`, "s = 0", "while n > 0:", "    s += n % 10", "    n //= 10", "print(s)"), s, `n % 10 toma la última cifra y n //= 10 la quita: suma de cifras = ${s}.`);
  }
  const k = r.int(3, 8);
  const lim = r.int(15, 40);
  const i = (floorDiv(lim, k) + 1) * k;
  return num(lines("i = 0", "while True:", `    i += ${k}`, `    if i > ${lim}:`, "        break", "print(i)"), i, `break sale del bucle cuando i pasa de ${lim}.`);
}

// Elegir la línea que falta.
export function pyMissingLine(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const n = r.int(8, 30);
  if (t === 0) {
    const k = r.int(2, 7);
    const code = lines(`# Imprime los múltiplos de ${k} entre 1 y ${n}`, `for n in range(1, ${n + 1}):`, "    ________", "        print(n)");
    return pick(r, code, `if n % ${k} == 0:`, [`if n / ${k} == 0:`, `if n % ${k} == 1:`, `if ${k} % n == 0:`], `n % ${k} == 0 significa que la división no deja resto.`, "¿Qué línea falta?");
  }
  if (t === 1) {
    const code = lines(`# Suma los números del 1 al ${n}`, "total = 0", "for i in ________:", "    total += i", "print(total)");
    return pick(r, code, `range(1, ${n + 1})`, [`range(1, ${n})`, `range(${n})`, `range(0, ${n - 1})`], `range no incluye el final: para llegar a ${n} se escribe ${n + 1}.`, "¿Qué falta en el for?");
  }
  if (t === 2) {
    const code = lines(`# Cuenta regresiva: ${n}, ${n - 1}, ..., 1`, "for i in ________:", "    print(i)");
    return pick(r, code, `range(${n}, 0, -1)`, [`range(${n}, 1, -1)`, `range(0, ${n})`, `range(${n}, 0)`], "Con paso -1 se cuenta hacia atrás; se detiene antes del 0.", "¿Qué falta en el for?");
  }
  const pw = r.pick(["sol123", "gato7", "lima2025", "trilce", "abc999", "clave42"]);
  const code = lines("clave = input()", "________", '    print("Incorrecta, intenta otra vez")', "    clave = input()", 'print("Bienvenido")');
  return pick(r, code, `while clave != "${pw}":`, [`while clave == "${pw}":`, `if clave != "${pw}":`, `while clave = "${pw}":`], "Se repite mientras la clave sea distinta (!=). = asigna; == compara.", `¿Qué línea falta para pedir la clave «${pw}» hasta acertar?`);
}

// ---------------------------------------------------------------------------
// 3.° de Secundaria: textos, listas, funciones, bucles anidados
// ---------------------------------------------------------------------------

export function pyStrings(r: Rng, forms?: number[]): Question {
  const w = r.pick(WORDS);
  const t = form(r, 6, forms);
  const code = (expr: string) => lines(`s = "${w}"`, `print(${expr})`);
  if (t === 0) return pick(r, code("s[0]"), w[0], [w[1], w[w.length - 1], "s"], "Los índices empiezan en 0.");
  if (t === 1) return pick(r, code("s[-1]"), w[w.length - 1], [w[0], w[w.length - 2], "-1"], "s[-1] es la última letra.");
  if (t === 2) {
    const a = r.int(0, 3);
    const b = a + r.int(2, 3);
    return pick(r, code(`s[${a}:${b}]`), w.slice(a, b), [w.slice(a, b + 1), w.slice(a + 1, b + 1), w.slice(a + 1, b)].filter(Boolean), `De la posición ${a} hasta antes de la ${b}.`);
  }
  if (t === 3) return num(code("len(s)"), w.length, `«${w}» tiene ${w.length} letras.`);
  if (t === 4) return pick(r, code("s.upper()"), w.toUpperCase(), [w, w[0].toUpperCase() + w.slice(1), w.toUpperCase().slice(0, -1)], "upper() pasa todo a mayúsculas.");
  if (t === 5) {
    const rev = [...w].reverse().join("");
    return pick(r, code("s[::-1]"), rev, [w, rev.slice(1) + rev[0], w.slice(1) + w[0]], "[::-1] recorre el texto al revés.");
  }
  const ch = r.pick([...new Set(w)]);
  const n = [...w].filter((c) => c === ch).length;
  return num(code(`s.count("${ch}")`), n, `«${ch}» aparece ${n} ${n === 1 ? "vez" : "veces"}.`);
}

export function pyLists(r: Rng, forms?: number[]): Question {
  const xs = distinctInts(r, r.int(4, 6), 1, 30);
  const L = `nums = ${list(xs)}`;
  const t = form(r, 7, forms);
  if (t === 0) {
    const v = r.int(1, 9);
    return num(lines(L, `nums.append(${v})`, "print(len(nums))"), xs.length + 1, `Tenía ${xs.length}; append agrega uno.`);
  }
  if (t === 1) {
    const i = r.int(0, xs.length - 1);
    return num(lines(L, `print(nums[${i}])`), xs[i], `El índice ${i} es el elemento número ${i + 1}.`);
  }
  if (t === 2) return num(lines(L, "print(nums[-2])"), xs[xs.length - 2], "-2 es el penúltimo.");
  if (t === 3) {
    const a = r.int(0, 2);
    const b = a + 2;
    return pick(r, lines(L, `print(nums[${a}:${b}])`), list(xs.slice(a, b)), [list(xs.slice(a, b + 1)), list(xs.slice(a + 1, b + 1)), list(xs.slice(a, a + 1))], `Desde el índice ${a} hasta antes del ${b}.`);
  }
  if (t === 4) {
    const s = xs.reduce((p, x) => p + x, 0) - Math.max(...xs);
    return num(lines(L, "print(sum(nums) - max(nums))"), s, `Suma ${xs.reduce((p, x) => p + x, 0)} menos el mayor (${Math.max(...xs)}).`);
  }
  if (t === 5) {
    const sorted = [...xs].sort((a, b) => a - b);
    return num(lines(L, "nums.sort()", "print(nums[1])"), sorted[1], `Ordenada: ${list(sorted)}.`);
  }
  if (t === 6) {
    const v = r.int(1, 9);
    return num(lines(L, `nums.insert(0, ${v})`, "print(nums[1])"), xs[0], "insert(0, ...) pone el valor al inicio y corre los demás.");
  }
  const n = r.int(2, 4);
  const base = Array.from({ length: n }, (_, i) => i + 1);
  return num(lines(`a = ${list(base)}`, "b = a", `b.append(${n + 1})`, "print(len(a))"), n + 1, "b = a no copia: las dos variables apuntan a la misma lista.");
}

export function pyFunctions(r: Rng, forms?: number[]): Question {
  const t = form(r, 4, forms);
  const a = r.int(1, 9);
  const b = r.int(1, 9);
  if (t === 0) {
    const k = r.int(2, 5);
    return num(lines("def f(x, y):", `    return x * ${k} + y`, "", `print(f(${a}, ${b}))`), a * k + b, `x = ${a}, y = ${b}: ${a} × ${k} + ${b}.`);
  }
  if (t === 1) return num(lines("def doble(n):", "    return n * 2", "", `print(doble(doble(${a})))`), a * 4, `Primero doble(${a}) = ${a * 2}; luego doble(${a * 2}) = ${a * 4}.`);
  if (t === 2) {
    const name = r.pick(NAMES);
    return pick(
      r,
      lines("def saluda(n):", '    print("Hola", n)', "", `x = saluda("${name}")`, "print(x)"),
      `Hola ${name}\nNone`,
      [`Hola ${name}`, `Hola ${name}\nHola ${name}`, `None\nHola ${name}`],
      "saluda imprime pero no tiene return: devuelve None."
    );
  }
  if (t === 3) {
    const base = r.int(2, 12);
    const h = r.int(2, 10);
    return num(lines("def area(b, h):", "    return b * h // 2", "", `print(area(${base}, ${h}))`), floorDiv(base * h, 2), `${base} × ${h} // 2 = ${floorDiv(base * h, 2)}.`);
  }
  return num(lines("def resta(x, y):", "    return x - y", "", `print(resta(y=${a}, x=${a + b}))`), b, `Con nombres: x = ${a + b}, y = ${a}.`);
}

export function pyListLoop(r: Rng, forms?: number[]): Question {
  const xs = ints(r, r.int(5, 7), 1, 20);
  const L = `nums = ${list(xs)}`;
  const t = form(r, 3, forms);
  if (t === 0) {
    const c = xs.filter((x) => x % 2 === 0).length;
    return num(lines(L, "c = 0", "for x in nums:", "    if x % 2 == 0:", "        c += 1", "print(c)"), c, `Pares: ${xs.filter((x) => x % 2 === 0).join(", ") || "ninguno"}.`);
  }
  if (t === 1) return num(lines(L, "mayor = nums[0]", "for x in nums:", "    if x > mayor:", "        mayor = x", "print(mayor)"), Math.max(...xs), "Guarda el mayor visto hasta ahora.");
  if (t === 2) {
    const k = r.int(5, 12);
    const s = xs.filter((x) => x > k).reduce((p, x) => p + x, 0);
    return num(lines(L, "s = 0", "for x in nums:", `    if x > ${k}:`, "        s += x", "print(s)"), s, `Suma solo los mayores que ${k}.`);
  }
  const out = xs.filter((_, i) => i % 2 === 0);
  return pick(
    r,
    lines(L, "nuevo = []", "for i in range(len(nums)):", "    if i % 2 == 0:", "        nuevo.append(nums[i])", "print(nuevo)"),
    list(out),
    [list(xs.filter((_, i) => i % 2 === 1)), list(xs.filter((x) => x % 2 === 0)), list(out.slice(1))],
    "Toma las posiciones pares (0, 2, 4...), no los valores pares."
  );
}

export function pyNested(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const a = r.int(2, 5);
  const b = r.int(2, 5);
  if (t === 0) return num(lines("c = 0", `for i in range(${a}):`, `    for j in range(${b}):`, "        c += 1", "print(c)"), a * b, `${a} vueltas × ${b} vueltas = ${a * b}.`);
  if (t === 1) {
    let c = 0;
    for (let i = 0; i < a + 2; i++) for (let j = 0; j < i; j++) c++;
    return num(lines("c = 0", `for i in range(${a + 2}):`, "    for j in range(i):", "        c += 1", "print(c)"), c, `0 + 1 + ... + ${a + 1} = ${c}.`);
  }
  const code = lines(`for i in range(1, ${a + 1}):`, '    print("*" * i)');
  const tri = Array.from({ length: a }, (_, i) => "*".repeat(i + 1)).join("\n");
  return pick(
    r,
    code,
    tri,
    [
      Array.from({ length: a }, (_, i) => "*".repeat(a - i)).join("\n"),
      Array.from({ length: a }, () => "*".repeat(a)).join("\n"),
      Array.from({ length: a + 1 }, (_, i) => "*".repeat(i + 1)).join("\n"),
    ],
    "En cada vuelta i crece: 1, 2, 3... estrellas."
  );
}

// ---------------------------------------------------------------------------
// 4.° de Secundaria: diccionarios, comprensiones, métodos, excepciones, alcance
// ---------------------------------------------------------------------------

export function pyDicts(r: Rng, forms?: number[]): Question {
  const [n1, n2, n3] = r.shuffle(NAMES).slice(0, 3);
  const [v1, v2, v3] = ints(r, 3, 8, 18);
  const D = `notas = {"${n1}": ${v1}, "${n2}": ${v2}, "${n3}": ${v3}}`;
  const t = form(r, 5, forms);
  if (t === 0) {
    const k = r.int(1, 2);
    return num(lines(D, `notas["${n1}"] += ${k}`, `print(notas["${n1}"])`), v1 + k, `notas["${n1}"] valía ${v1}.`);
  }
  if (t === 1) {
    const n4 = NAMES.find((x) => ![n1, n2, n3].includes(x))!;
    return num(lines(D, `notas["${n4}"] = 20`, "print(len(notas))"), 4, "Asignar una clave nueva agrega un par: ahora hay 4.");
  }
  if (t === 2) {
    const n4 = NAMES.find((x) => ![n1, n2, n3].includes(x))!;
    return num(lines(D, `print(notas.get("${n4}", 0))`), 0, `«${n4}» no está: get devuelve el valor por defecto, 0.`);
  }
  if (t === 3) return num(lines(D, "s = 0", "for nombre in notas:", "    s += notas[nombre]", "print(s)"), v1 + v2 + v3, "Recorrer un diccionario da sus claves.");
  if (t === 4) {
    const probe = r.pick([n2, String(v2)]);
    const quoted = probe === n2 ? `"${n2}"` : String(v2);
    const ans = probe === n2 ? "True" : "False";
    return pick(r, lines(D, `print(${quoted} in notas)`), ans, ["True", "False"], "in busca entre las claves, no entre los valores.");
  }
  const word = r.pick(["banana", "manzana", "papaya", "anana", "cocodrilo", "arroz"]);
  const counts: Record<string, number> = {};
  for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
  const ch = r.pick(Object.keys(counts));
  return num(lines("c = {}", `for letra in "${word}":`, "    c[letra] = c.get(letra, 0) + 1", `print(c["${ch}"])`), counts[ch], `Cuenta cuántas veces aparece cada letra: «${ch}» = ${counts[ch]}.`);
}

export function pyComprehension(r: Rng, forms?: number[]): Question {
  const n = r.int(5, 9);
  const k = r.int(2, 3);
  const t = form(r, 3, forms);
  const base = rangeOf(0, n, 1);
  if (t === 0) {
    const xs = base.map((x) => x * k);
    return pick(r, `print([x * ${k} for x in range(${n})][-3:])`, list(xs.slice(-3)), [list(xs.slice(0, 3)), list(base.slice(-3)), list(xs.slice(-4, -1))], `Lista: ${list(xs)}; [-3:] toma los 3 últimos.`);
  }
  if (t === 1) {
    const xs = base.filter((x) => x % k === 0);
    return pick(r, `print([x for x in range(${n}) if x % ${k} == 0])`, list(xs), [list(xs.slice(1)), list(base.filter((x) => x % k === 1)), list([...xs, n])], `Solo los x de 0 a ${n - 1} divisibles entre ${k}.`);
  }
  if (t === 2) {
    const s = base.map((x) => x * x).reduce((p, x) => p + x, 0);
    return num(`print(sum([x ** 2 for x in range(${n})]))`, s, `0² + 1² + ... + ${n - 1}² = ${s}.`);
  }
  const ws = r.shuffle(WORDS).slice(0, 4);
  const lens = ws.map((w) => w.length);
  return pick(r, `palabras = ${list(ws)}\nprint([len(p) for p in palabras])`, list(lens), [list(lens.map((x) => x + 1)), list([...lens].reverse()), list(lens.slice(1))], "len(p) para cada palabra, en el mismo orden.");
}

export function pyStrMethods(r: Rng, forms?: number[]): Question {
  const t = form(r, 4, forms);
  const ws = r.shuffle(SHORT).slice(0, r.int(3, 4));
  if (t === 0) return num(lines(`linea = "${ws.join(",")}"`, 'partes = linea.split(",")', "print(len(partes))"), ws.length, "split corta el texto en cada coma.");
  if (t === 1) return pick(r, `print("-".join(${list(ws)}))`, ws.join("-"), [ws.join(" - "), ws.join(""), `-${ws.join("-")}-`], "join pone el separador solo entre los elementos.");
  if (t === 2) {
    const w = r.pick(WORDS);
    return num(`print(len("  ${w}  ".strip()))`, w.length, "strip quita los espacios de los extremos.");
  }
  if (t === 3) {
    const w = r.pick(WORDS.filter((x) => x.includes("a")));
    return pick(r, `print("${w}".replace("a", "4"))`, w.replaceAll("a", "4"), [w.replace("a", "4"), w, w.replaceAll("a", "")], "replace cambia todas las apariciones.");
  }
  const name = r.pick(NAMES);
  const edad = r.int(11, 17);
  return pick(r, lines(`nombre = "${name}"`, `edad = ${edad}`, 'print(f"{nombre} tiene {edad + 1}")'), `${name} tiene ${edad + 1}`, [`${name} tiene ${edad}`, `{nombre} tiene {edad + 1}`, `${name} tiene ${edad} + 1`], "En un f-string, lo que va entre llaves se calcula.");
}

export function pyExceptions(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const ok = r.chance(0.5);
    const val = ok ? String(r.int(1, 99)) : r.pick(["diez", "12a", "3.5", "", "uno"]);
    const code = lines(`texto = "${val}"`, "try:", "    n = int(texto)", '    print("número")', "except ValueError:", '    print("no es número")');
    return pick(r, code, ok ? "número" : "no es número", ["número", "no es número", "número\nno es número", "ValueError"], ok ? `«${val}» sí se convierte a int.` : `int("${val}") lanza ValueError y se ejecuta except.`);
  }
  if (t === 1) {
    const b = r.pick([0, r.int(1, 5)]);
    const a = r.int(6, 30);
    const ans = b === 0 ? "-1" : String(floorDiv(a, b));
    const code = lines("def dividir(a, b):", "    try:", "        return a // b", "    except ZeroDivisionError:", "        return -1", "", `print(dividir(${a}, ${b}))`);
    return pick(r, code, ans, b === 0 ? ["-1", "0", `${a}`, "ZeroDivisionError"] : [ans, "-1", "0", String(a % b)], b === 0 ? "Dividir entre 0 lanza ZeroDivisionError: devuelve -1." : `${a} // ${b} = ${ans}.`);
  }
  const ok = r.chance(0.5);
  const i = ok ? r.int(0, 2) : r.int(3, 5);
  const code = lines("datos = [10, 20, 30]", "try:", `    print(datos[${i}])`, "except IndexError:", '    print("fuera de rango")', "finally:", '    print("fin")');
  const ans = ok ? `${(i + 1) * 10}\nfin` : "fuera de rango\nfin";
  return pick(r, code, ans, [`${(i + 1) * 10}\nfin`, "fuera de rango\nfin", "fuera de rango", `${(i % 3 + 1) * 10}`], "finally se ejecuta siempre, haya error o no.");
}

export function pyScope(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const a = r.int(2, 9);
  const b = r.int(10, 20);
  if (t === 0) return num(lines(`x = ${a}`, "def f():", `    x = ${b}`, "    return x", "", "f()", "print(x)"), a, `La x de dentro de f es local: la x de fuera sigue en ${a}.`);
  if (t === 1) return num(lines("def potencia(base, exp=2):", "    return base ** exp", "", `print(potencia(${a}))`), a * a, `exp toma su valor por defecto, 2: ${a}² = ${a * a}.`);
  if (t === 2) {
    const e = r.int(2, 3);
    return num(lines("def potencia(base, exp=2):", "    return base ** exp", "", `print(potencia(${a}, ${e}))`), a ** e, `Se pasa exp = ${e}: ${a}^${e} = ${a ** e}.`);
  }
  return num(lines("contador = 0", "def sumar():", "    global contador", "    contador += 1", "", ...Array(a % 4 + 2).fill("sumar()"), "print(contador)"), (a % 4) + 2, "global permite cambiar la variable de fuera; se llama una vez por línea.");
}

export function pyModules(r: Rng, forms?: number[]): Question {
  const t = form(r, 4, forms);
  if (t === 0) {
    const n = r.int(2, 12);
    return pick(r, lines("import math", `print(math.sqrt(${n * n}))`), `${n}.0`, [`${n}`, `${n * n}.0`, `${n * 2}.0`], "math.sqrt devuelve la raíz cuadrada como float.");
  }
  if (t === 1) {
    const x = r.int(2, 30);
    const d = r.int(1, 9);
    return num(lines("import math", `print(math.floor(${x}.${d}) + math.ceil(${x}.${d}))`), 2 * x + 1, `floor redondea abajo (${x}) y ceil arriba (${x + 1}).`);
  }
  if (t === 2) {
    const a = r.int(1, 5);
    const b = a + r.int(3, 9);
    return pick(r, lines("import random", `x = random.randint(${a}, ${b})`, `print(${a} <= x <= ${b})`), "True", ["True", "False"], `randint(${a}, ${b}) incluye los dos extremos.`);
  }
  if (t === 3) {
    const a = r.int(2, 20);
    const b = a + r.int(1, 20);
    return num(`print(abs(${a} - ${b}))`, b - a, `${a} - ${b} es negativo; abs lo vuelve positivo: ${b - a}.`);
  }
  const xs = distinctInts(r, 5, 1, 50);
  return num(lines(`nums = ${list(xs)}`, "print(max(nums) - min(nums))"), Math.max(...xs) - Math.min(...xs), "El rango: el mayor menos el menor.");
}

// ---------------------------------------------------------------------------
// 5.° de Secundaria: recursión, clases, ordenar con key, pilas y colas, eficiencia
// ---------------------------------------------------------------------------

export function pyRecursion(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  if (t === 0) {
    const n = r.int(3, 15);
    return num(lines("def suma(n):", "    if n == 0:", "        return 0", "    return n + suma(n - 1)", "", `print(suma(${n}))`), (n * (n + 1)) / 2, `${n} + ${n - 1} + ... + 1 + 0.`);
  }
  if (t === 1) {
    const n = r.int(3, 8);
    let f = 1;
    for (let i = 2; i <= n; i++) f *= i;
    return num(lines("def fact(n):", "    if n <= 1:", "        return 1", "    return n * fact(n - 1)", "", `print(fact(${n}))`), f, `${n}! = ${f}.`);
  }
  if (t === 2) {
    const n = r.int(4, 10);
    const fib = [0, 1];
    for (let i = 2; i <= n; i++) fib.push(fib[i - 1] + fib[i - 2]);
    return num(lines("def fib(n):", "    if n < 2:", "        return n", "    return fib(n - 1) + fib(n - 2)", "", `print(fib(${n}))`), fib[n], `Fibonacci: ${fib.slice(0, n + 1).join(", ")}.`);
  }
  const b = r.int(2, 3);
  const e = r.int(2, 5);
  return num(lines("def pot(b, e):", "    if e == 0:", "        return 1", "    return b * pot(b, e - 1)", "", `print(pot(${b}, ${e}))`), b ** e, `${b} multiplicado ${e} veces.`);
}

export function pyClasses(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const s = r.int(5, 20) * 10;
    const d = r.int(1, 10) * 10;
    const w = r.int(1, 15) * 10;
    const final = s + d - (w <= s + d ? w : 0);
    const code = lines(
      "class Cuenta:",
      "    def __init__(self, saldo):",
      "        self.saldo = saldo",
      "",
      "    def depositar(self, monto):",
      "        self.saldo += monto",
      "",
      "    def retirar(self, monto):",
      "        if monto <= self.saldo:",
      "            self.saldo -= monto",
      "",
      `c = Cuenta(${s})`,
      `c.depositar(${d})`,
      `c.retirar(${w})`,
      "print(c.saldo)"
    );
    return num(code, final, `${s} + ${d} − ${w} = ${final}.`);
  }
  if (t === 1) {
    const n = r.int(2, 5);
    const code = lines(
      "class Contador:",
      "    def __init__(self):",
      "        self.valor = 0",
      "",
      "    def subir(self):",
      "        self.valor += 1",
      "",
      "a = Contador()",
      "b = Contador()",
      ...Array(n).fill("a.subir()"),
      "b.subir()",
      "print(a.valor + b.valor * 10)"
    );
    return num(code, n + 10, `Cada objeto tiene su propio valor: a = ${n}, b = 1.`);
  }
  const lado = r.int(2, 9);
  const base = r.int(2, 9);
  const alto = r.int(2, 9);
  const code = lines(
    "class Figura:",
    "    def area(self):",
    "        return 0",
    "",
    "class Cuadrado(Figura):",
    "    def __init__(self, lado):",
    "        self.lado = lado",
    "    def area(self):",
    "        return self.lado ** 2",
    "",
    "class Rectangulo(Figura):",
    "    def __init__(self, b, h):",
    "        self.b, self.h = b, h",
    "    def area(self):",
    "        return self.b * self.h",
    "",
    `figuras = [Cuadrado(${lado}), Rectangulo(${base}, ${alto})]`,
    "print(sum(f.area() for f in figuras))"
  );
  return num(code, lado * lado + base * alto, `Polimorfismo: cada clase calcula su área: ${lado * lado} + ${base * alto}.`);
}

export function pySorting(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  if (t === 0) {
    const ws = r.shuffle(WORDS.filter((w, i, a) => a.findIndex((x) => x.length === w.length) === i)).slice(0, 4);
    const s = [...ws].sort((a, b) => a.length - b.length);
    return pick(r, `print(sorted(${list(ws)}, key=len))`, list(s), [list([...s].reverse()), list([...ws].sort()), list(ws)], "key=len ordena por la cantidad de letras.");
  }
  if (t === 1) {
    const xs = distinctInts(r, 5, 1, 40);
    const s = [...xs].sort((a, b) => b - a);
    return num(`print(sorted(${list(xs)}, reverse=True)[1])`, s[1], `De mayor a menor: ${list(s)}.`);
  }
  if (t === 2) {
    const names = r.shuffle(NAMES).slice(0, 3);
    const ages = distinctInts(r, 3, 11, 17);
    const pairs = names.map((n, i) => `("${n}", ${ages[i]})`).join(", ");
    const youngest = names[ages.indexOf(Math.min(...ages))];
    return pick(r, lines(`alumnos = [${pairs}]`, "alumnos.sort(key=lambda a: a[1])", "print(alumnos[0][0])"), youngest, names, "lambda a: a[1] ordena por la edad (segundo elemento).");
  }
  const xs = distinctInts(r, 6, 1, 30);
  const evens = xs.filter((x) => x % 2 === 0);
  return num(lines(`nums = ${list(xs)}`, "pares = list(filter(lambda x: x % 2 == 0, nums))", "print(len(pares))"), evens.length, `Pares: ${evens.join(", ") || "ninguno"}.`);
}

export function pyStackQueue(r: Rng): Question {
  const queue = r.chance(0.5);
  const ops: string[] = [];
  const data: number[] = [];
  const steps = r.int(4, 6);
  for (let i = 0; i < steps; i++) {
    if (data.length > 0 && r.chance(0.35)) {
      ops.push(queue ? "x = q.pop(0)" : "x = p.pop()");
      if (queue) data.shift();
      else data.pop();
    } else {
      const v = r.int(1, 9);
      ops.push(`${queue ? "q" : "p"}.append(${v})`);
      data.push(v);
    }
  }
  if (data.length === 0) {
    const v = r.int(1, 9);
    ops.push(`${queue ? "q" : "p"}.append(${v})`);
    data.push(v);
  }
  const name = queue ? "q" : "p";
  const show = queue ? `print(${name}[0])` : `print(${name}[-1])`;
  const ans = queue ? data[0] : data[data.length - 1];
  return num(
    lines(`${name} = []  # ${queue ? "cola (FIFO)" : "pila (LIFO)"}`, ...ops, show),
    ans,
    queue ? "En una cola sale primero el que llegó primero; q[0] es el siguiente en salir." : "En una pila sale primero el último que entró; p[-1] es la cima."
  );
}

export function pyComplexity(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const n = r.pick([6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 32, 40, 50, 64]);
  if (t === 0) return num(lines(`n = ${n}`, "pasos = 0", "for i in range(n):", "    for j in range(n):", "        pasos += 1", "print(pasos)"), n * n, `n × n = ${n * n}: crece como O(n²).`);
  if (t === 1) {
    let i = 1;
    let c = 0;
    while (i < n) {
      i *= 2;
      c++;
    }
    return num(lines(`n = ${n}`, "pasos = 0", "i = 1", "while i < n:", "    i *= 2", "    pasos += 1", "print(pasos)"), c, `i se duplica: ${c} pasos, crece como O(log n).`);
  }
  if (t === 2) return num(lines(`n = ${n}`, "pasos = 0", "for i in range(n):", "    pasos += 1", "for j in range(n):", "    pasos += 1", "print(pasos)"), 2 * n, `Dos bucles seguidos (no anidados): 2n = ${2 * n}, O(n).`);
  let c = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++;
  return num(lines(`n = ${n}`, "pasos = 0", "for i in range(n):", "    for j in range(i + 1, n):", "        pasos += 1", "print(pasos)"), c, `Cada par se cuenta una vez: n(n−1)/2 = ${c}.`);
}

export function pyBinarySearch(r: Rng): Question {
  const n = r.pick([7, 10, 15, 16, 20]);
  const xs = Array.from({ length: n }, (_, i) => (i + 1) * 3);
  const target = r.chance(0.8) ? r.pick(xs) : r.int(1, n * 3);
  let lo = 0;
  let hi = n - 1;
  let steps = 0;
  while (lo <= hi) {
    const mid = floorDiv(lo + hi, 2);
    steps++;
    if (xs[mid] === target) break;
    if (xs[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  const code = lines(
    `datos = list(range(3, ${n * 3 + 1}, 3))  # [3, 6, 9, ..., ${n * 3}]`,
    `buscado = ${target}`,
    "ini, fin, pasos = 0, len(datos) - 1, 0",
    "while ini <= fin:",
    "    medio = (ini + fin) // 2",
    "    pasos += 1",
    "    if datos[medio] == buscado:",
    "        break",
    "    elif datos[medio] < buscado:",
    "        ini = medio + 1",
    "    else:",
    "        fin = medio - 1",
    "print(pasos)"
  );
  return num(code, steps, `La búsqueda binaria descarta la mitad en cada paso: ${steps} pasos.`);
}
