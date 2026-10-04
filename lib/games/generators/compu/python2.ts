import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";

// Python para secundaria, segunda tanda: verdad y falsedad, funciones
// integradas, matrices, enumerate/zip, conjuntos y tuplas, algoritmos con
// textos, map/lambda, comprensiones de diccionario, recursión con listas,
// más clases y funciones avanzadas (*args, generadores, clausuras).
// Igual que python.ts: cada programa es Python 3 real y la prueba automática
// compara la respuesta con lo que imprime python3.

const OUT = "¿Qué imprime este programa?";
const form = (r: Rng, max: number, forms?: number[]) => (forms ? r.pick(forms) : r.int(0, max));
const lines = (...ls: string[]) => ls.join("\n");
const list = (xs: (number | string)[]) => `[${xs.map((x) => (typeof x === "string" ? `'${x}'` : x)).join(", ")}]`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const distinct = (r: Rng, n: number, min: number, max: number) => r.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, n);
const WORDS = ["python", "datos", "robot", "teclado", "pantalla", "internet", "memoria", "archivo", "sensor", "clave"];
const PALS = ["radar", "oso", "reconocer", "ana", "salas", "somos", "seres", "rotor"];

function num(code: string, answer: number, explanation: string, prompt = OUT): Question {
  return { kind: "number", prompt, visual: { kind: "code", text: code }, answer, explanation, tag: "py-out" };
}

function pick(r: Rng, code: string, answer: string, distractors: string[], explanation: string, prompt = OUT): Question {
  return { kind: "choice", prompt, visual: { kind: "code", text: code }, options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)), answer, explanation, tag: "py-out", mono: true };
}

// Redondeo de Python: a la mitad, al par más cercano.
function pyRound(x: number) {
  const f = Math.floor(x);
  const d = x - f;
  if (Math.abs(d - 0.5) < 1e-9) return f % 2 === 0 ? f : f + 1;
  return Math.round(x);
}

// ---------------------------------------------------------------------------
// 1.°–2.°: funciones integradas y valores de verdad
// ---------------------------------------------------------------------------

export function pyBuiltins(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  if (t === 0) {
    const xs = distinct(r, 3, 1, 50);
    const f = r.pick(["max", "min"]);
    return num(`print(${f}(${xs.join(", ")}))`, f === "max" ? Math.max(...xs) : Math.min(...xs), `${f} devuelve el ${f === "max" ? "mayor" : "menor"} de los valores.`);
  }
  if (t === 1) {
    const base = r.int(1, 20);
    const x = base + r.pick([0.5, 0.5, 0.3, 0.7]);
    const res = pyRound(x);
    return num(`print(round(${x}))`, res, Math.abs(x - base - 0.5) < 1e-9 ? `Ojo: en Python, ${x} se redondea al número PAR más cercano: ${res}.` : `${x} se redondea a ${res}.`);
  }
  if (t === 2) {
    const a = r.int(10, 60);
    const b = r.int(3, 9);
    return pick(r, `print(divmod(${a}, ${b}))`, `(${Math.floor(a / b)}, ${a % b})`, [`(${a % b}, ${Math.floor(a / b)})`, `${Math.floor(a / b)}`, `(${Math.floor(a / b)}, ${(a % b) + 1})`], "divmod devuelve (cociente, resto).");
  }
  const a = r.int(2, 5);
  const b = r.int(2, 4);
  const m = r.int(3, 9);
  return num(`print(pow(${a}, ${b}) % ${m})`, a ** b % m, `${a}^${b} = ${a ** b}; mod ${m} = ${a ** b % m}.`);
}

export function pyTruthy(r: Rng): Question {
  const vals: [string, boolean][] = [["0", false], ['""', false], ["[]", false], ["None", false], ["0.0", false], ["5", true], ['"0"', true], ['" "', true], ["[0]", true], ["-1", true], ['"False"', true], ["{}", false], ["()", false], ['"no"', true], ["100", true], ["[[]]", true], ["0 * 5", false]];
  const [v, truth] = r.pick(vals);
  return pick(r, lines(`if ${v}:`, '    print("sí")', "else:", '    print("no")'), truth ? "sí" : "no", ["sí", "no"], truth ? `${v} cuenta como verdadero.` : `${v} cuenta como falso: 0, "", [], None y 0.0 son «falsos».`);
}

// ---------------------------------------------------------------------------
// 3.°: matrices, enumerate, zip, algoritmos con textos
// ---------------------------------------------------------------------------

export function pyMatrix(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const rows = r.int(2, 3);
  const cols = r.int(2, 4);
  const m = Array.from({ length: rows }, () => Array.from({ length: cols }, () => r.int(1, 9)));
  const M = `m = [${m.map((row) => list(row)).join(", ")}]`;
  if (t === 0) {
    const i = r.int(0, rows - 1);
    const j = r.int(0, cols - 1);
    return num(lines(M, `print(m[${i}][${j}])`), m[i][j], `Fila ${i}, columna ${j} (desde 0).`);
  }
  if (t === 1) {
    const i = r.int(0, rows - 1);
    return num(lines(M, `print(sum(m[${i}]))`), sum(m[i]), `m[${i}] es la fila ${list(m[i])}.`);
  }
  if (t === 2) {
    const j = r.int(0, cols - 1);
    return num(lines(M, "s = 0", "for fila in m:", `    s += fila[${j}]`, "print(s)"), sum(m.map((row) => row[j])), `Suma la columna ${j} de cada fila.`);
  }
  return num(lines(M, "print(len(m) * len(m[0]))"), rows * cols, `${rows} filas × ${cols} columnas.`);
}

export function pyEnumerateZip(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const xs = Array.from({ length: r.int(3, 5) }, () => r.int(1, 9));
  if (t === 0) return num(lines(`nums = ${list(xs)}`, "s = 0", "for i, x in enumerate(nums):", "    s += i * x", "print(s)"), sum(xs.map((x, i) => i * x)), "enumerate da la posición (desde 0) y el valor.");
  const ys = xs.map(() => r.int(1, 9));
  if (t === 1) return num(lines(`a = ${list(xs)}`, `b = ${list(ys)}`, "s = 0", "for x, y in zip(a, b):", "    s += x * y", "print(s)"), sum(xs.map((x, i) => x * ys[i])), "zip recorre las dos listas a la par.");
  const names = r.shuffle(["Ana", "Luis", "Rosa", "Hugo", "Lucia"]).slice(0, xs.length);
  const k = r.int(0, xs.length - 1);
  return num(lines(`nombres = ${list(names)}`, `edades = ${list(xs.map((x) => x + 10))}`, "d = dict(zip(nombres, edades))", `print(d["${names[k]}"])`), xs[k] + 10, "dict(zip(...)) une cada nombre con su edad.");
}

export function pyStringAlgo(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const w = r.chance(0.5) ? r.pick(PALS) : r.pick(WORDS);
    const isPal = w === [...w].reverse().join("");
    return pick(r, lines(`p = "${w}"`, "print(p == p[::-1])"), isPal ? "True" : "False", ["True", "False"], isPal ? `«${w}» se lee igual al revés: es palíndromo.` : `«${w}» al revés es «${[...w].reverse().join("")}».`);
  }
  if (t === 1) {
    const w = r.pick(WORDS);
    const v = [...w].filter((c) => "aeiou".includes(c)).length;
    return num(lines(`s = "${w}"`, 'print(sum(1 for c in s if c in "aeiou"))'), v, `Vocales en «${w}»: ${v}.`);
  }
  const w = r.pick(["HOLA", "SOL", "PAZ", "DATO", "RED", "CASA"]);
  const k = r.int(1, 5);
  const enc = [...w].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65)).join("");
  return pick(
    r,
    lines(`texto = "${w}"`, 'cifrado = ""', "for c in texto:", `    cifrado += chr((ord(c) - 65 + ${k}) % 26 + 65)`, "print(cifrado)"),
    enc,
    [[...w].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 1) % 26) + 65)).join(""), w, [...w].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 - k + 26) % 26) + 65)).join("")],
    `Cifrado César en Python: cada letra avanza ${k} posiciones (ord y chr convierten letra ↔ número).`
  );
}

// ---------------------------------------------------------------------------
// 4.°: conjuntos, tuplas, map, comprensión de diccionarios
// ---------------------------------------------------------------------------

export function pySets(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const a = Array.from({ length: r.int(5, 8) }, () => r.int(1, 9));
  const sa = [...new Set(a)];
  if (t === 0) return num(lines(`nums = ${list(a)}`, "print(len(set(nums)))"), sa.length, "Un conjunto (set) no guarda repetidos.");
  const b = Array.from({ length: r.int(4, 6) }, () => r.int(1, 9));
  const sb = [...new Set(b)];
  const A = `a = set(${list(a)})`;
  const B = `b = set(${list(b)})`;
  if (t === 1) return num(lines(A, B, "print(len(a & b))"), sa.filter((x) => sb.includes(x)).length, "& es la intersección: elementos que están en los dos.");
  if (t === 2) return num(lines(A, B, "print(len(a | b))"), new Set([...sa, ...sb]).size, "| es la unión: todos los elementos, sin repetir.");
  return num(lines(A, B, "print(len(a - b))"), sa.filter((x) => !sb.includes(x)).length, "a − b: los de a que no están en b.");
}

export function pyTuples(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const p = [r.int(1, 20), r.int(1, 20), r.int(1, 20)];
  if (t === 0) return num(lines(`punto = (${p.join(", ")})`, "x, y, z = punto", "print(x + z)"), p[0] + p[2], "Desempaquetar: cada variable toma un valor de la tupla.");
  if (t === 1) return pick(r, lines(`t = (${p.join(", ")})`, "try:", "    t[0] = 99", '    print("cambió")', "except TypeError:", '    print("inmutable")'), "inmutable", ["cambió", "inmutable", "TypeError", `(99, ${p[1]}, ${p[2]})`], "Las tuplas no se pueden modificar (son inmutables).");
  return num(lines(`def min_max(nums):`, "    return min(nums), max(nums)", "", `menor, mayor = min_max(${list(p)})`, "print(mayor - menor)"), Math.max(...p) - Math.min(...p), "Una función puede devolver varios valores en una tupla.");
}

export function pyMapLambda(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const xs = Array.from({ length: 4 }, () => r.int(1, 9));
  const k = r.int(2, 5);
  if (t === 0) {
    const ys = xs.map((x) => x * k);
    return pick(r, `print(list(map(lambda x: x * ${k}, ${list(xs)})))`, list(ys), [list(xs.map((x) => x + k)), list(xs), list(ys.slice(1))], `map aplica la función a cada elemento: × ${k}.`);
  }
  if (t === 1) return num(`print(sum(map(lambda x: x ** 2, ${list(xs)})))`, sum(xs.map((x) => x * x)), "Suma de los cuadrados.");
  const f = `doble = lambda x: x * 2\nsuma = lambda a, b: a + b\nprint(suma(doble(${xs[0]}), ${xs[1]}))`;
  return num(f, xs[0] * 2 + xs[1], "Una lambda es una función corta de una sola expresión.");
}

export function pyDictComp(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const n = r.int(4, 8);
  if (t === 0) {
    const k = r.int(1, n - 1);
    return num(lines(`cuad = {x: x * x for x in range(${n})}`, `print(cuad[${k}])`), k * k, `La clave ${k} guarda ${k}².`);
  }
  if (t === 1) {
    const ws = r.shuffle(WORDS).slice(0, 4);
    const w = r.pick(ws);
    return num(lines(`palabras = ${list(ws)}`, "largos = {p: len(p) for p in palabras}", `print(largos["${w}"])`), w.length, `«${w}» tiene ${w.length} letras.`);
  }
  const d = Object.fromEntries(r.shuffle(["a", "b", "c", "d", "e"]).slice(0, 4).map((key) => [key, r.int(1, 30)]));
  const lim = r.int(5, 20);
  const n2 = Object.values(d).filter((v) => v > lim).length;
  return num(lines(`d = {${Object.entries(d).map(([key, v]) => `"${key}": ${v}`).join(", ")}}`, `altos = {k: v for k, v in d.items() if v > ${lim}}`, "print(len(altos))"), n2, `Solo quedan los valores mayores que ${lim}.`);
}

export function pyFiles(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const ls = Array.from({ length: r.int(3, 5) }, () => r.pick(["Ana,15", "Luis,12", "Rosa,18", "Hugo,9", "Lucia,14", "Mateo,11"]));
  const content = ls.join("\\n");
  const write = lines(`with open("notas.txt", "w") as f:`, `    f.write("${content}")`, "");
  if (t === 0) return num(lines(write, 'with open("notas.txt") as f:', "    filas = f.readlines()", "print(len(filas))"), ls.length, "readlines devuelve una lista con cada línea del archivo.");
  const total = sum(ls.map((l) => Number(l.split(",")[1])));
  return num(lines(write, "total = 0", 'with open("notas.txt") as f:', "    for linea in f:", '        nombre, nota = linea.strip().split(",")', "        total += int(nota)", "print(total)"), total, "Se lee línea por línea, se separa por la coma y se convierte la nota a int.");
}

// ---------------------------------------------------------------------------
// 5.°: recursión con listas, más clases, funciones avanzadas
// ---------------------------------------------------------------------------

export function pyRecursionList(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const xs = Array.from({ length: r.int(3, 6) }, () => r.int(1, 20));
  if (t === 0) return num(lines("def suma(lista):", "    if not lista:", "        return 0", "    return lista[0] + suma(lista[1:])", "", `print(suma(${list(xs)}))`), sum(xs), "Caso base: lista vacía. Si no, el primero + la suma del resto.");
  if (t === 1) return num(lines("def mayor(lista):", "    if len(lista) == 1:", "        return lista[0]", "    resto = mayor(lista[1:])", "    return lista[0] if lista[0] > resto else resto", "", `print(mayor(${list(xs)}))`), Math.max(...xs), "Compara el primero con el mayor del resto.");
  const n = r.int(2, 6);
  return num(lines("def digitos(n):", "    if n < 10:", "        return 1", "    return 1 + digitos(n // 10)", "", `print(digitos(${"7".repeat(n).replace(/7/g, () => String(r.int(1, 9)))}))`), n, "Cada llamada quita una cifra hasta que queda una sola.");
}

export function pyClasses2(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const name = r.pick(["Firulais", "Michi", "Toby", "Luna"]);
    const age = r.int(1, 12);
    return pick(
      r,
      lines("class Mascota:", "    def __init__(self, nombre, edad):", "        self.nombre = nombre", "        self.edad = edad", "", "    def __str__(self):", '        return f"{self.nombre} ({self.edad} años)"', "", `print(Mascota("${name}", ${age}))`),
      `${name} (${age} años)`,
      [`<Mascota object>`, `Mascota(${name}, ${age})`, `${name} ${age}`],
      "print usa el método __str__ para mostrar el objeto."
    );
  }
  if (t === 1) {
    const n = r.int(2, 6);
    return num(lines("class Alumno:", "    total = 0", "", "    def __init__(self, nombre):", "        self.nombre = nombre", "        Alumno.total += 1", "", ...Array.from({ length: n }, (_, i) => `a${i} = Alumno("A${i}")`), "print(Alumno.total)"), n, "total es un atributo de clase: lo comparten todos los objetos.");
  }
  const base = r.int(2, 9);
  const extra = r.int(2, 9);
  return num(
    lines("class Empleado:", "    def __init__(self, sueldo):", "        self.sueldo = sueldo", "", "    def pago(self):", "        return self.sueldo", "", "class Gerente(Empleado):", "    def __init__(self, sueldo, bono):", "        super().__init__(sueldo)", "        self.bono = bono", "", "    def pago(self):", "        return super().pago() + self.bono", "", `print(Gerente(${base * 100}, ${extra * 10}).pago())`),
    base * 100 + extra * 10,
    "super() llama al método de la clase padre y luego se suma el bono."
  );
}

export function pyAdvancedFns(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const xs = Array.from({ length: r.int(2, 5) }, () => r.int(1, 9));
  if (t === 0) return num(lines("def total(*nums):", "    return sum(nums)", "", `print(total(${xs.join(", ")}))`), sum(xs), "*nums junta todos los argumentos en una tupla.");
  if (t === 1) {
    const keys = r.shuffle(["color", "talla", "precio", "marca", "stock"]).slice(0, r.int(1, 4));
    return num(lines("def ficha(**datos):", "    return len(datos)", "", `print(ficha(${keys.map((key, i) => `${key}=${i + 1}`).join(", ")}))`), keys.length, "**datos junta los argumentos con nombre en un diccionario.");
  }
  if (t === 2) {
    const n = r.int(3, 7);
    return num(lines("def cuadrados(n):", "    for i in range(n):", "        yield i * i", "", `print(sum(cuadrados(${n})))`), sum(Array.from({ length: n }, (_, i) => i * i)), "yield genera los valores uno por uno (generador).");
  }
  const k = r.int(2, 5);
  const calls = r.int(2, 4);
  return num(lines("def contador():", "    c = 0", "    def sumar():", "        nonlocal c", `        c += ${k}`, "        return c", "    return sumar", "", "f = contador()", ...Array(calls - 1).fill("f()"), "print(f())"), k * calls, "La función interna recuerda c entre llamadas (clausura).");
}
