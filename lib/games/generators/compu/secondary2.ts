import type { Rng } from "../../rng";
import type { Question, Visual } from "../../types";
import { uniqueOptions } from "../common";

// Más generadores de Computación de secundaria (segunda tanda): sistemas de
// numeración, almacenamiento, archivos, hoja de cálculo, color y multimedia,
// redes, criptografía, arquitectura, procesos, algoritmos, SQL avanzado,
// ciencia de datos, IA, autómatas, micro:bit, web y Scratch.

const form = (r: Rng, max: number, forms?: number[]) => (forms ? r.pick(forms) : r.int(0, max));

function num(prompt: string, answer: number, explanation: string, visual?: Visual, tag?: string): Question {
  return { kind: "number", prompt, visual, answer, explanation, tag };
}

function choice(r: Rng, prompt: string, answer: string, distractors: string[], explanation: string, visual?: Visual, mono?: boolean, tag?: string): Question {
  return { kind: "choice", prompt, visual, options: uniqueOptions(r, answer, distractors.filter((d) => d !== answer)), answer, explanation, mono, tag };
}

const code = (text: string, title?: string): Visual => ({ kind: "code", text, title });
const pad = (n: number, bits: number) => n.toString(2).padStart(bits, "0");
const listStr = (xs: (number | string)[]) => `[${xs.join(", ")}]`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const distinct = (r: Rng, n: number, min: number, max: number) => r.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, n);

// ---------------------------------------------------------------------------
// Sistemas de numeración y aritmética para la computación
// ---------------------------------------------------------------------------

export function baseConvert(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  if (t === 0) {
    const n = r.int(8, 255);
    const o = n.toString(8);
    return num(`¿Qué número decimal es el octal (base 8) ${o}?`, n, `${[...o].map((d, i) => `${d}×8^${o.length - 1 - i}`).join(" + ")} = ${n}.`, undefined, "oct-a-dec");
  }
  if (t === 1) {
    const n = r.int(8, 255);
    return num(`Escribe ${n} en octal (base 8).`, Number(n.toString(8)), `${n} = ${n.toString(8)} en base 8 (divide entre 8 y toma los restos).`, undefined, "dec-a-oct");
  }
  if (t === 2) {
    const n = r.int(5, 124);
    const f = n.toString(5);
    return num(`¿Qué número decimal es ${f} en base 5?`, n, `${[...f].map((d, i) => `${d}×5^${f.length - 1 - i}`).join(" + ")} = ${n}.`, undefined, "b5-a-dec");
  }
  const n = r.int(4, 80);
  return num(`Escribe ${n} en base 3.`, Number(n.toString(3)), `${n} en base 3 es ${n.toString(3)}.`, undefined, "dec-a-b3");
}

export function powersOfTwo(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const n = r.int(1, 16);
    return num(`¿Cuántos valores distintos se pueden representar con ${n} bits?`, 2 ** n, `Cada bit duplica las posibilidades: 2^${n} = ${2 ** n}.`);
  }
  if (t === 1) {
    const n = r.int(3, 1000);
    const bits = Math.ceil(Math.log2(n));
    return num(`¿Cuántos bits se necesitan como mínimo para dar un código distinto a ${n} alumnos?`, bits, `2^${bits - 1} = ${2 ** (bits - 1)} no alcanza; 2^${bits} = ${2 ** bits} sí.`);
  }
  const n = r.int(2, 12);
  return num(`¿Cuál es el mayor número sin signo que cabe en ${n} bits?`, 2 ** n - 1, `Todos los bits en 1: 2^${n} − 1 = ${2 ** n - 1}.`);
}

export function modArith(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const h = r.int(1, 12);
    const add = r.int(5, 40);
    const res = ((h - 1 + add) % 12) + 1;
    return num(`Un reloj marca las ${h}. ¿Qué hora marcará dentro de ${add} horas? (reloj de 12 horas)`, res, `Aritmética modular: (${h} + ${add}) mod 12 → ${res}.`);
  }
  if (t === 1) {
    const a = r.int(20, 200);
    const b = r.int(3, 12);
    return num(`¿Cuánto es ${a} mod ${b}?`, a % b, `${a} = ${b} × ${Math.floor(a / b)} + ${a % b}.`);
  }
  const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const d = r.int(0, 6);
  const n = r.int(8, 100);
  return choice(r, `Hoy es ${days[d]}. ¿Qué día será dentro de ${n} días?`, days[(d + n) % 7], days, `${n} mod 7 = ${n % 7}: avanzas ${n % 7} días.`);
}

export function twosComplement(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const n = r.int(1, 127);
  const bits = pad((256 - n) % 256, 8);
  if (t === 0) {
    return choice(r, `¿Cómo se escribe −${n} en complemento a 2 con 8 bits?`, bits, [pad(n, 8), pad(255 - n, 8), "1" + pad(n, 7)], `Invierte los bits de ${pad(n, 8)} y suma 1: ${bits}.`, undefined, true);
  }
  return choice(r, `En complemento a 2 (8 bits), ¿qué número es ${bits}?`, `−${n}`, [`${256 - n}`, `−${256 - n}`, `−${n - 1 || n + 1}`], `Empieza con 1: es negativo. Invierte y suma 1 → ${n}; el valor es −${n}.`, undefined, true);
}

export function utf8Bytes(r: Rng): Question {
  const pool: [string, number][] = [["a", 1], ["Z", 1], ["7", 1], ["?", 1], ["ñ", 2], ["á", 2], ["é", 2], ["ü", 2], ["€", 3], ["漢", 3], ["😀", 4], ["🐍", 4]];
  const chars = Array.from({ length: r.int(3, 6) }, () => r.pick(pool));
  const text = chars.map(([c]) => c).join("");
  const total = sum(chars.map(([, b]) => b));
  return num(
    `En UTF-8, ¿cuántos bytes ocupa el texto «${text}»?`,
    total,
    `Letras y números del inglés: 1 byte; ñ y tildes: 2; € y chino: 3; emojis: 4. Total ${total}.`,
    code("1 byte: a-z, A-Z, 0-9, signos\n2 bytes: ñ, á, é, ü...\n3 bytes: €, 漢...\n4 bytes: emojis 😀")
  );
}

// ---------------------------------------------------------------------------
// Almacenamiento y archivos
// ---------------------------------------------------------------------------

export function storageCalc(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const gb = r.pick([1, 2, 4, 8, 16]);
    const mb = r.pick([2, 4, 8, 16, 32]);
    return num(`Una memoria de ${gb} GB. ¿Cuántas fotos de ${mb} MB caben? (1 GB = 1024 MB)`, (gb * 1024) / mb, `${gb} × 1024 = ${gb * 1024} MB; ÷ ${mb} = ${(gb * 1024) / mb}.`);
  }
  if (t === 1) {
    const min = r.int(2, 9);
    const mbm = r.pick([1, 2, 3]);
    const songs = r.int(5, 30);
    return num(`Una canción de ${min} minutos ocupa ${mbm} MB por minuto. ¿Cuántos MB ocupan ${songs} canciones así?`, min * mbm * songs, `${min} × ${mbm} × ${songs} = ${min * mbm * songs} MB.`);
  }
  const kb = r.int(2, 40);
  return num(`Un texto tiene ${kb * 1024} caracteres de 1 byte. ¿Cuántos KB ocupa? (1 KB = 1024 bytes)`, kb, `${kb * 1024} ÷ 1024 = ${kb} KB.`);
}

const FOLDERS = ["Matematica", "Comunicacion", "Ciencias", "Historia", "Arte", "Ingles"];
const FILES = ["tarea1.docx", "notas.xlsx", "resumen.pdf", "foto.png", "juego.py", "audio.mp3", "mapa.jpg", "informe.docx"];

export function fileTree(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const root = r.pick(["Colegio", "Documentos", "Proyectos"]);
  const [f1, f2, f3] = r.shuffle(FOLDERS).slice(0, 3);
  const files = r.shuffle(FILES);
  const n1 = r.int(1, 3);
  const n2 = r.int(1, 3);
  const tree = {
    [f1]: { files: files.slice(0, n1), sub: { [f3]: files.slice(n1, n1 + n2) } },
    [f2]: { files: files.slice(n1 + n2, n1 + n2 + r.int(1, 2)), sub: {} as Record<string, string[]> },
  };
  const lines = [`📁 ${root}`];
  const paths: string[] = [];
  for (const [folder, v] of Object.entries(tree)) {
    lines.push(`  📁 ${folder}`);
    for (const [sub, fs] of Object.entries(v.sub)) {
      lines.push(`    📁 ${sub}`);
      for (const f of fs) {
        lines.push(`      📄 ${f}`);
        paths.push(`${root}/${folder}/${sub}/${f}`);
      }
    }
    for (const f of v.files) {
      lines.push(`    📄 ${f}`);
      paths.push(`${root}/${folder}/${f}`);
    }
  }
  const visual = code(lines.join("\n"));
  if (t === 0) {
    const p = r.pick(paths.filter((x) => x.split("/").length === 4));
    const [a, b, c, d] = p.split("/");
    return choice(r, `¿Cuál es la ruta del archivo «${d}»?`, p, [`${a}/${c}/${b}/${d}`, `${a}/${c}/${d}`, `${b}/${c}/${a}/${d}`, `${a}/${b}/${d}`], "La ruta va desde la carpeta principal, bajando carpeta por carpeta.", visual, true);
  }
  if (t === 1) {
    const n = paths.filter((p) => p.split("/")[1] === f1).length;
    return num(`¿Cuántos archivos hay dentro de «${f1}», contando sus subcarpetas?`, n, `${f1} tiene ${tree[f1].files.length} archivos y ${f3} tiene ${tree[f1].sub[f3].length}.`, visual);
  }
  const p = r.pick(paths);
  const parts = p.split("/");
  return choice(r, `¿En qué carpeta está guardado directamente «${parts[parts.length - 1]}»?`, parts[parts.length - 2], [root, f1, f2, f3], "Es la carpeta inmediatamente encima del archivo.", visual);
}

// ---------------------------------------------------------------------------
// Hoja de cálculo
// ---------------------------------------------------------------------------

export function sheetRefs(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const k = r.int(1, 5);
  const row = r.int(1, 4);
  if (t === 0) {
    const f = `=A${row}+B${row}`;
    return choice(r, `La celda C${row} tiene ${f}. Si la copias ${k} ${k === 1 ? "fila" : "filas"} hacia abajo, ¿qué fórmula queda?`, `=A${row + k}+B${row + k}`, [f, `=A${row + k}+B${row}`, `=C${row + k}+D${row + k}`], "Las referencias relativas se mueven igual que la celda copiada.", undefined, true);
  }
  if (t === 1) {
    const f = `=A${row}*$B$1`;
    return choice(r, `La celda C${row} tiene ${f}. Si la copias ${k} ${k === 1 ? "fila" : "filas"} hacia abajo, ¿qué fórmula queda?`, `=A${row + k}*$B$1`, [`=A${row + k}*$B$${1 + k}`, f, `=A${row}*$B$${1 + k}`], "El $ fija la referencia: $B$1 no cambia; A se mueve.", undefined, true);
  }
  const cols = "ABCDEFG";
  const c = r.int(0, 2);
  const f = `=${cols[c]}1*2`;
  return choice(r, `La celda ${cols[c]}2 tiene ${f}. Si la copias ${k} ${k === 1 ? "columna" : "columnas"} a la derecha, ¿qué fórmula queda?`, `=${cols[c + k]}1*2`, [f, `=${cols[c]}${1 + k}*2`, `=${cols[c + k]}${1 + k}*2`], "Al copiar a la derecha cambia la letra de la columna.", undefined, true);
}

export function countIf(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 2) {
    const cities = ["Lima", "Cusco", "Piura", "Puno"];
    const col = Array.from({ length: 6 }, () => r.pick(cities));
    const c = r.pick(col);
    return num(`¿Qué resultado da =CONTAR.SI(A1:A6;"${c}")?`, col.filter((x) => x === c).length, `Cuenta las celdas iguales a «${c}».`, { kind: "sheet", cells: col.map((x) => [x]) });
  }
  const col = Array.from({ length: 6 }, () => r.int(1, 30));
  const k = r.int(5, 20);
  const op = r.pick([">", "<", ">="]);
  const test = (x: number) => (op === ">" ? x > k : op === "<" ? x < k : x >= k);
  if (t === 0) return num(`¿Qué resultado da =CONTAR.SI(A1:A6;"${op}${k}")?`, col.filter(test).length, `Cuenta los valores ${op} ${k}.`, { kind: "sheet", cells: col.map((x) => [String(x)]) });
  return num(`¿Qué resultado da =SUMAR.SI(A1:A6;"${op}${k}")?`, sum(col.filter(test)), `Suma solo los valores ${op} ${k}.`, { kind: "sheet", cells: col.map((x) => [String(x)]) });
}

export function vlookup(r: Rng): Question {
  const items = r.shuffle(["Lápiz", "Cuaderno", "Regla", "Borrador", "Mochila", "Colores", "Tijera"]).slice(0, 5);
  const codes = distinct(r, 5, 100, 199);
  const prices = items.map(() => r.int(2, 60));
  const cells = items.map((it, i) => [String(codes[i]), it, String(prices[i])]);
  const i = r.int(0, 4);
  const col = r.chance(0.5) ? 3 : 2;
  if (col === 3) return num(`¿Qué devuelve =BUSCARV(${codes[i]};A1:C5;3;FALSO)?`, prices[i], `Busca ${codes[i]} en la columna A y devuelve la 3.ª columna de esa fila.`, { kind: "sheet", cells });
  return choice(r, `¿Qué devuelve =BUSCARV(${codes[i]};A1:C5;2;FALSO)?`, items[i], items, `Busca ${codes[i]} en la columna A y devuelve la 2.ª columna: ${items[i]}.`, { kind: "sheet", cells });
}

// ---------------------------------------------------------------------------
// Color, imágenes y multimedia
// ---------------------------------------------------------------------------

const COLORS: [string, [number, number, number]][] = [
  ["Rojo", [255, 0, 0]], ["Verde", [0, 255, 0]], ["Azul", [0, 0, 255]], ["Amarillo", [255, 255, 0]],
  ["Cian", [0, 255, 255]], ["Magenta", [255, 0, 255]], ["Blanco", [255, 255, 255]], ["Negro", [0, 0, 0]],
];
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

export function rgbColor(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const [name, [R, G, B]] = r.pick(COLORS);
    return choice(r, `¿Qué color es RGB(${R}, ${G}, ${B})?`, name, COLORS.map(([n]) => n), "En RGB la luz se suma: rojo + verde = amarillo; todo al máximo = blanco.");
  }
  const rgb = [r.int(0, 255), r.int(0, 255), r.int(0, 255)];
  const ch = r.int(0, 2);
  const name = ["rojo", "verde", "azul"][ch];
  const hx = `#${rgb.map(hex2).join("")}`;
  if (t === 1) return num(`En el color ${hx}, ¿cuánto vale el ${name} en decimal (0 a 255)?`, rgb[ch], `El ${name} es «${hex2(rgb[ch])}» en hexadecimal = ${rgb[ch]}.`);
  const v = rgb[ch];
  return choice(r, `Quieres ${name} = ${v}. ¿Qué pareja hexadecimal escribes?`, hex2(v), [hex2(255 - v), hex2(((v & 15) << 4) | (v >> 4)), hex2((v + 16) % 256)], `${v} = ${Math.floor(v / 16)} × 16 + ${v % 16} → ${hex2(v)}.`, undefined, true);
}

export function resolution(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const w = r.pick([20, 32, 40, 64, 80, 100, 128]);
    const h = r.pick([10, 16, 20, 30, 48, 50]);
    return num(`¿Cuántos píxeles tiene una imagen de ${w} × ${h}?`, w * h, `${w} × ${h} = ${w * h}.`);
  }
  if (t === 1) {
    const [w, h] = r.pick([[4000, 3000], [3000, 2000], [2000, 1500], [6000, 4000], [4000, 2000], [5000, 3000], [2000, 1000]]);
    return num(`Una cámara toma fotos de ${w} × ${h} píxeles. ¿Cuántos megapíxeles son?`, (w * h) / 1e6, `${w} × ${h} = ${w * h} píxeles = ${(w * h) / 1e6} millones.`);
  }
  const bits = r.int(1, 8);
  return num(`Una imagen usa una paleta de ${2 ** bits} colores. ¿Cuántos bits necesita cada píxel?`, bits, `2^${bits} = ${2 ** bits}: ${bits} bits por píxel.`);
}

export function soundSize(r: Rng): Question {
  const rate = r.pick([8000, 10000, 16000, 20000]);
  const bits = r.pick([8, 16]);
  const secs = r.int(2, 10);
  const ch = r.pick([1, 2]);
  const bytes = (rate * bits * secs * ch) / 8;
  return num(
    `Sonido de ${secs} s, ${rate} muestras por segundo, ${bits} bits por muestra, ${ch === 1 ? "mono (1 canal)" : "estéreo (2 canales)"}. ¿Cuántos bytes ocupa?`,
    bytes,
    `${rate} × ${bits} × ${secs} × ${ch} = ${bytes * 8} bits; ÷ 8 = ${bytes} bytes.`
  );
}

export function compressionRatio(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const after = r.int(2, 20) * 5;
  const ratio = r.int(2, 8);
  const before = after * ratio;
  if (t === 0) return num(`Un archivo de ${before} KB se comprime a ${after} KB. ¿Cuál es la razón de compresión (x : 1)?`, ratio, `${before} ÷ ${after} = ${ratio}.`);
  const red = Math.round(((before - after) * 100) / before);
  if (((before - after) * 100) % before !== 0) return compressionRatio(r, forms);
  return num(`Un archivo de ${before} KB se comprime a ${after} KB. ¿En qué porcentaje se redujo?`, red, `(${before} − ${after}) ÷ ${before} × 100 = ${red}%.`);
}

// ---------------------------------------------------------------------------
// Redes
// ---------------------------------------------------------------------------

export function packets(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const size = r.int(10, 200);
    const p = r.pick([4, 8, 10, 16]);
    return num(`Un archivo de ${size} KB se envía en paquetes de ${p} KB. ¿Cuántos paquetes se necesitan?`, Math.ceil(size / p), `${size} ÷ ${p} = ${(size / p).toFixed(2)} → se redondea hacia arriba: ${Math.ceil(size / p)}.`);
  }
  if (t === 1) {
    const n = r.int(10, 60);
    const lost = r.int(1, 9);
    return num(`Se enviaron ${n} paquetes con TCP y se perdieron ${lost}. ¿Cuántos paquetes deben reenviarse?`, lost, "TCP confirma cada paquete y reenvía solo los que no llegaron.");
  }
  const oct = r.int(1, 255);
  return num(`Un octeto de una dirección IP en binario es ${pad(oct, 8)}. ¿Qué número decimal es?`, oct, `${pad(oct, 8)} = ${oct}.`);
}

export function subnetHosts(r: Rng): Question {
  const n = r.int(24, 30);
  const t = r.int(0, 2);
  if (t === 1) {
    const need = r.int(3, 250);
    let p = 30;
    while (2 ** (32 - p) - 2 < need) p--;
    return num(`Necesitas una red para ${need} equipos. ¿Cuál es el prefijo más grande que alcanza? (escribe solo el número, p. ej. 26 para /26)`, p, `/${p} da 2^${32 - p} − 2 = ${2 ** (32 - p) - 2} hosts; /${p + 1} solo da ${2 ** (31 - p) - 2}.`);
  }
  if (t === 2) {
    const last = 256 - 2 ** (32 - n);
    return num(`¿Qué prefijo corresponde a la máscara 255.255.255.${last}? (escribe solo el número)`, n, `${last} en binario es ${last.toString(2).padStart(8, "0")}: 24 + ${n - 24} unos = /${n}.`);
  }
  return num(`¿Cuántos equipos (hosts) caben en una red /${n}?`, 2 ** (32 - n) - 2, `Quedan ${32 - n} bits para hosts: 2^${32 - n} − 2 (red y difusión) = ${2 ** (32 - n) - 2}.`);
}

export function urlParts(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const proto = r.pick(["https", "http"]);
  const host = r.pick(["www.trilce.edu.pe", "www.gob.pe", "es.wikipedia.org", "www.minedu.gob.pe", "docs.python.org"]);
  const path = r.pick(["/notas/2025", "/tramites", "/wiki/Algoritmo", "/3/tutorial", "/aula/virtual"]);
  const url = `${proto}://${host}${path}`;
  const visual = code(url);
  if (t === 0) return choice(r, "¿Cuál es el protocolo de esta dirección?", proto, ["https", "http", "www", host.split(".").pop()!], "El protocolo va antes de «://».", visual, true);
  if (t === 1) return choice(r, "¿Cuál es el dominio (nombre del servidor)?", host, [path, `${proto}://${host}`, host.split(".").slice(-2).join(".") + path], "El dominio va después de «://» y antes de la primera «/».", visual, true);
  return choice(r, "¿Cuál es la ruta del recurso dentro del sitio?", path, [host, `${host}${path}`, path.split("/").slice(0, 2).join("/")], "La ruta empieza en la primera «/» después del dominio.", visual, true);
}

export function routing(r: Rng): Question {
  const routes = [
    { net: "192.168.1.0/24", hop: "Router A", test: (ip: number[]) => ip[0] === 192 && ip[1] === 168 && ip[2] === 1 },
    { net: "192.168.0.0/16", hop: "Router B", test: (ip: number[]) => ip[0] === 192 && ip[1] === 168 },
    { net: "10.0.0.0/8", hop: "Router C", test: (ip: number[]) => ip[0] === 10 },
    { net: "0.0.0.0/0 (por defecto)", hop: "Internet", test: () => true },
  ];
  const kind = r.int(0, 3);
  const ip = kind === 0 ? [192, 168, 1, r.int(2, 254)] : kind === 1 ? [192, 168, r.pick([0, 2, 5, 20]), r.int(2, 254)] : kind === 2 ? [10, r.int(0, 255), r.int(0, 255), r.int(1, 254)] : [r.pick([8, 172, 200, 45]), r.int(0, 255), r.int(0, 255), r.int(1, 254)];
  const hop = routes.find((x) => x.test(ip))!.hop;
  return choice(
    r,
    `Un paquete va a ${ip.join(".")}. Según la tabla de rutas, ¿por dónde sale? (gana la coincidencia más específica)`,
    hop,
    routes.map((x) => x.hop),
    `La ruta más específica que coincide con ${ip.join(".")} es la de ${hop}.`,
    code(routes.map((x) => `${x.net.padEnd(26)} → ${x.hop}`).join("\n")),
    true
  );
}

// ---------------------------------------------------------------------------
// Criptografía y seguridad
// ---------------------------------------------------------------------------

const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shift = (c: string, k: number) => AZ[(AZ.indexOf(c) + k + 26) % 26];

export function vigenere(r: Rng): Question {
  const word = r.pick(["HOLA", "CLAVE", "PERU", "DATOS", "LIMA", "NUBE", "BYTE", "CODIGO", "RED", "SOL"]);
  const key = r.pick(["AB", "CD", "SOL", "LUZ", "KEY", "PAZ", "BC"]);
  const enc = [...word].map((c, i) => shift(c, AZ.indexOf(key[i % key.length]))).join("");
  const caesarOnly = [...word].map((c) => shift(c, AZ.indexOf(key[0]))).join("");
  const rev = [...word].map((c, i) => shift(c, -AZ.indexOf(key[i % key.length]))).join("");
  const off = [...word].map((c, i) => shift(c, AZ.indexOf(key[(i + 1) % key.length]))).join("");
  return choice(
    r,
    `Cifra «${word}» con Vigenère y la clave «${key}» (A = 0, B = 1, ..., alfabeto de 26 letras).`,
    enc,
    [caesarOnly, rev, off],
    `Cada letra se corre según la letra de la clave que le toca: ${[...word].map((c, i) => `${c}+${AZ.indexOf(key[i % key.length])}`).join(", ")}.`,
    code(`Texto: ${[...word].join(" ")}\nClave: ${[...word].map((_, i) => key[i % key.length]).join(" ")}`),
    true
  );
}

export function xorBits(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const a = r.int(1, 255);
  const k = r.int(1, 255);
  if (t === 0) return choice(r, "Cifrado XOR: ¿qué resulta?", pad(a ^ k, 8), [pad(a & k, 8), pad(a | k, 8), pad((a ^ k) ^ 1, 8)], "XOR da 1 solo donde los bits son distintos.", code(`  ${pad(a, 8)}  (mensaje)\n⊕ ${pad(k, 8)}  (clave)`), true);
  return choice(r, "Descifra: aplica XOR con la misma clave.", pad(a, 8), [pad(a ^ 255, 8), pad(k, 8), pad(a & k, 8)], "Aplicar XOR dos veces con la misma clave recupera el mensaje.", code(`  ${pad(a ^ k, 8)}  (cifrado)\n⊕ ${pad(k, 8)}  (clave)`), true);
}

export function passwordCombos(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const sets: [string, number][] = [["dígitos (0-9)", 10], ["letras minúsculas (26)", 26], ["vocales (5)", 5], ["dígitos del 1 al 6", 6], ["dígitos del 0 al 7", 8], ["letras A, B y C", 3], ["los dígitos 0 y 1", 2]];
  const [name, size] = r.pick(sets);
  const len = size >= 26 ? r.int(2, 3) : r.int(2, 5);
  const combos = size ** len;
  if (t === 0) return num(`¿Cuántas contraseñas distintas hay de ${len} caracteres usando solo ${name}?`, combos, `${size}^${len} = ${combos}.`);
  const rate = r.pick([5, 10, 20, 50, 100, 1000]);
  const secs = combos / rate;
  if (!Number.isInteger(secs)) return passwordCombos(r, forms);
  return num(`Un atacante prueba ${rate} contraseñas por segundo. ¿Cuántos segundos tarda como máximo en probar todas las de ${len} ${name}?`, secs, `${size}^${len} = ${combos}; ÷ ${rate} = ${secs} s. Por eso conviene usar claves largas y variadas.`);
}

export function rsaToy(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const [n, e, d] = r.pick([[33, 3, 7], [55, 3, 27], [35, 5, 29]]);
  const m = r.int(2, Math.min(n - 2, 20));
  const c = Number(BigInt(m) ** BigInt(e) % BigInt(n));
  if (t === 0) return num(`RSA de juguete: clave pública (e = ${e}, n = ${n}). Cifra m = ${m}: c = m^e mod n.`, c, `${m}^${e} = ${m ** e}; ${m ** e} mod ${n} = ${c}.`);
  return num(`RSA de juguete: clave privada (d = ${d}, n = ${n}). Descifra c = ${c}: m = c^d mod n.`, m, `${c}^${d} mod ${n} = ${m}: la clave privada recupera el mensaje.`);
}

// ---------------------------------------------------------------------------
// Arquitectura y sistemas operativos
// ---------------------------------------------------------------------------

// Máquina de un acumulador (estilo Little Man Computer).
export function assembly(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  if (t === 0) {
    let acc = r.int(2, 20);
    const prog = [`LOAD ${acc}`];
    for (let i = 0; i < r.int(2, 4); i++) {
      if (r.chance(0.6) || acc < 5) {
        const k = r.int(1, 15);
        acc += k;
        prog.push(`ADD ${k}`);
      } else {
        const k = r.int(1, acc);
        acc -= k;
        prog.push(`SUB ${k}`);
      }
    }
    prog.push("OUT");
    return num("¿Qué número muestra OUT? (LOAD carga el acumulador, ADD suma, SUB resta)", acc, "El acumulador guarda el resultado de cada instrucción.", code(prog.join("\n")));
  }
  const a = r.int(2, 15);
  const b = r.int(2, 15);
  const prog = [`LOAD ${a}`, "STORE x", `LOAD ${b}`, "ADD x", "STORE y", "LOAD y", "ADD y", "OUT"];
  return num("¿Qué número muestra OUT? (STORE guarda el acumulador en una variable)", 2 * (a + b), `x = ${a}; y = ${b} + ${a} = ${a + b}; luego y + y = ${2 * (a + b)}.`, code(prog.join("\n")));
}

export function scheduling(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const n = 3;
  const names = ["P1", "P2", "P3"];
  const burst = Array.from({ length: n }, () => r.int(1, 9));
  const visual = code(names.map((p, i) => `${p}: llega en 0, dura ${burst[i]}`).join("\n"));
  if (t === 0) {
    const waits = burst.map((_, i) => sum(burst.slice(0, i)));
    const total = sum(waits);
    return num("Planificación FCFS (en orden de llegada: P1, P2, P3). ¿Cuánto suman los tiempos de espera?", total, `Esperas: ${waits.join(" + ")} = ${total}.`, visual);
  }
  if (t === 1) {
    if (new Set(burst).size < n) return scheduling(r, forms);
    const order = names.map((p, i) => [p, burst[i]] as const).sort((a, b) => a[1] - b[1]).map(([p]) => p).join(" → ");
    return choice(r, "Con SJF (primero el trabajo más corto), ¿en qué orden se ejecutan?", order, ["P1 → P2 → P3", "P3 → P2 → P1", "P2 → P1 → P3", "P1 → P3 → P2", "P2 → P3 → P1", "P3 → P1 → P2"], "SJF ordena por duración, de menor a mayor.", visual, true);
  }
  const q = r.int(2, 3);
  const left = [...burst];
  let time = 0;
  const finish = [0, 0, 0];
  while (left.some((x) => x > 0)) {
    for (let i = 0; i < n; i++) {
      if (left[i] <= 0) continue;
      const run = Math.min(q, left[i]);
      time += run;
      left[i] -= run;
      if (left[i] === 0) finish[i] = time;
    }
  }
  const p = r.int(0, 2);
  return num(`Round Robin con quantum ${q} (turnos P1, P2, P3, P1...). ¿En qué instante termina ${names[p]}?`, finish[p], `Cada proceso usa hasta ${q} unidades por turno; ${names[p]} termina en ${finish[p]}.`, visual);
}

// ---------------------------------------------------------------------------
// Algoritmos
// ---------------------------------------------------------------------------

export function selectionPass(r: Rng): Question {
  const xs = distinct(r, 6, 1, 40);
  const k = r.int(1, 3);
  const a = [...xs];
  for (let i = 0; i < k; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
  const full = [...xs].sort((p, q) => p - q);
  const wrong = [...a];
  [wrong[k], wrong[k + 1]] = [wrong[k + 1], wrong[k]];
  return choice(r, `Ordenamiento por selección: ¿cómo queda la lista después de ${k} ${k === 1 ? "pasada" : "pasadas"}?`, listStr(a), [listStr(full), listStr(wrong), listStr([...full.slice(0, k), ...xs.filter((x) => !full.slice(0, k).includes(x))])], "Cada pasada busca el menor de lo que falta y lo intercambia con el primero de esa parte.", code(listStr(xs)), true);
}

export function inversions(r: Rng): Question {
  const xs = distinct(r, r.int(4, 6), 1, 20);
  let c = 0;
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) if (xs[i] > xs[j]) c++;
  return num("¿Cuántos intercambios hace el ordenamiento burbuja para ordenar esta lista?", c, `Es el número de pares desordenados (inversiones): ${c}.`, code(listStr(xs)));
}

export function euclid(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const g = r.int(2, 12);
  let a = g * r.int(3, 15);
  let b = g * r.int(2, 14);
  if (a === b) return euclid(r, forms);
  if (a < b) [a, b] = [b, a];
  const steps: string[] = [];
  let x = a;
  let y = b;
  while (y) {
    steps.push(`${x} mod ${y} = ${x % y}`);
    [x, y] = [y, x % y];
  }
  if (t === 0) return num(`Algoritmo de Euclides: ¿cuál es el MCD de ${a} y ${b}?`, x, `${steps.join("; ")}. El último divisor es ${x}.`);
  return num(`¿Cuántas divisiones (mod) hace el algoritmo de Euclides con ${a} y ${b}?`, steps.length, steps.join("; ") + ".");
}

export function coinChange(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  if (t === 0) {
    const coins = [50, 20, 10, 5, 2, 1];
    const amt = r.int(8, 99);
    let left = amt;
    const used: number[] = [];
    for (const c of coins) while (left >= c) {
      used.push(c);
      left -= c;
    }
    return num(`Algoritmo voraz: das ${amt} céntimos de vuelto con monedas de 50, 20, 10, 5, 2 y 1, eligiendo siempre la mayor posible. ¿Cuántas monedas usas?`, used.length, `${used.join(" + ")} = ${amt}: ${used.length} monedas.`);
  }
  const coins = r.pick([[1, 3, 4], [1, 5, 6], [1, 4, 5], [1, 7, 10]]);
  const amt = r.int(6, 20);
  const dp = Array(amt + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amt; i++) for (const c of coins) if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
  return num(`Programación dinámica: ¿cuál es el MENOR número de monedas de ${coins.join(", ")} que suman ${amt}?`, dp[amt], `Probando todas las combinaciones (tabla de soluciones parciales): ${dp[amt]} monedas.`);
}

export function fibCalls(r: Rng): Question {
  const n = r.int(2, 18);
  const calls: number[] = [1, 1];
  for (let i = 2; i <= n; i++) calls.push(calls[i - 1] + calls[i - 2] + 1);
  return num(`fib(n) recursiva sin memoria llama a fib(n−1) y fib(n−2). ¿Cuántas llamadas en total hace fib(${n})? (fib(0) y fib(1) cuentan 1 llamada)`, calls[n], `llamadas(n) = llamadas(n−1) + llamadas(n−2) + 1 → ${calls[n]}. Con memoria (programación dinámica) bastarían ${n + 1}.`);
}

export function stackQueueOps(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const queue = t === 1;
  const data: number[] = [];
  const ops: string[] = [];
  for (let i = 0; i < r.int(5, 7); i++) {
    if (data.length > 0 && r.chance(0.4)) {
      ops.push(queue ? "DESENCOLAR" : "POP");
      if (queue) data.shift();
      else data.pop();
    } else {
      const v = r.int(1, 30);
      ops.push(queue ? `ENCOLAR ${v}` : `PUSH ${v}`);
      data.push(v);
    }
  }
  if (!data.length) return stackQueueOps(r, forms);
  return num(
    queue ? "Cola (FIFO): después de estas operaciones, ¿qué valor está al frente?" : "Pila (LIFO): después de estas operaciones, ¿qué valor está en la cima?",
    queue ? data[0] : data[data.length - 1],
    queue ? `Quedan ${listStr(data)}; el frente es el más antiguo.` : `Quedan ${listStr(data)}; la cima es el último que entró.`,
    code(ops.join("\n"))
  );
}

export function hashIndex(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const size = r.pick([7, 10, 11, 13]);
  if (t === 0) {
    const k = r.int(20, 999);
    return num(`Tabla hash de ${size} posiciones (0 a ${size - 1}) con h(k) = k mod ${size}. ¿En qué posición va la clave ${k}?`, k % size, `${k} mod ${size} = ${k % size}.`);
  }
  const keys = distinct(r, 4, 10, 99);
  const table: (number | null)[] = Array(size).fill(null);
  let last = 0;
  for (const k of keys) {
    let i = k % size;
    while (table[i] !== null) i = (i + 1) % size;
    table[i] = k;
    last = i;
  }
  return num(`Sondeo lineal (si está ocupada, prueba la siguiente). h(k) = k mod ${size}. Se insertan ${keys.join(", ")}. ¿En qué posición queda ${keys[3]}?`, last, `${keys[3]} mod ${size} = ${keys[3] % size}; ${last === keys[3] % size ? "estaba libre" : `estaba ocupada y avanza hasta ${last}`}.`);
}

type Node = { v: number; l?: Node; rt?: Node };
function insert(n: Node | undefined, v: number): Node {
  if (!n) return { v };
  if (v < n.v) n.l = insert(n.l, v);
  else n.rt = insert(n.rt, v);
  return n;
}
const pre = (n?: Node): number[] => (n ? [n.v, ...pre(n.l), ...pre(n.rt)] : []);
const post = (n?: Node): number[] => (n ? [...post(n.l), ...post(n.rt), n.v] : []);
const height = (n?: Node): number => (n ? 1 + Math.max(height(n.l), height(n.rt)) : 0);

export function bstTree(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const vals = distinct(r, r.int(5, 7), 1, 50);
  let root: Node | undefined;
  for (const v of vals) root = insert(root, v);
  const visual = code(`Se insertan en este orden:\n${vals.join(", ")}`);
  if (t === 0) return choice(r, "Árbol binario de búsqueda: ¿cuál es su recorrido en preorden (raíz, izquierda, derecha)?", listStr(pre(root)), [listStr([...vals].sort((a, b) => a - b)), listStr(post(root)), listStr(vals)], "Preorden visita la raíz antes que sus hijos.", visual, true);
  if (t === 1) return num("Árbol binario de búsqueda: ¿cuántos niveles tiene (altura)?", height(root), `El camino más largo desde la raíz tiene ${height(root)} nodos.`, visual);
  const target = r.pick(vals);
  let n = root;
  let c = 0;
  while (n) {
    c++;
    if (n.v === target) break;
    n = target < n.v ? n.l : n.rt;
  }
  return num(`Árbol binario de búsqueda: ¿cuántas comparaciones hacen falta para encontrar ${target}?`, c, `Se baja desde la raíz eligiendo izquierda (menor) o derecha (mayor): ${c} comparaciones.`, visual);
}

export function bfsOrder(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const nodes = ["A", "B", "C", "D", "E", "F"];
  const adj: Record<string, Set<string>> = Object.fromEntries(nodes.map((n) => [n, new Set<string>()]));
  const link = (a: string, b: string) => {
    adj[a].add(b);
    adj[b].add(a);
  };
  for (let i = 1; i < nodes.length; i++) link(nodes[i], nodes[r.int(0, i - 1)]);
  for (let i = 0; i < 2; i++) {
    const [a, b] = r.shuffle(nodes).slice(0, 2);
    link(a, b);
  }
  const sorted = (n: string) => [...adj[n]].sort();
  const bfs = () => {
    const seen = ["A"];
    const q = ["A"];
    while (q.length) {
      for (const m of sorted(q.shift()!)) {
        if (!seen.includes(m)) {
          seen.push(m);
          q.push(m);
        }
      }
    }
    return seen;
  };
  const dfs = () => {
    const seen: string[] = [];
    const go = (n: string) => {
      seen.push(n);
      for (const m of sorted(n)) if (!seen.includes(m)) go(m);
    };
    go("A");
    return seen;
  };
  const visual = code(nodes.map((n) => `${n}: ${sorted(n).join(", ")}`).join("\n"), "Lista de vecinos (se visitan en orden alfabético):");
  const b = bfs().join(" ");
  const d = dfs().join(" ");
  if (t === 0) {
    if (b === d) return bfsOrder(r, forms);
    return choice(r, "Recorrido en anchura (BFS) desde A: ¿en qué orden se visitan?", b, [d, [...nodes].join(" "), ["A", ...bfs().slice(1).reverse()].join(" ")], "BFS visita todos los vecinos de un nodo antes de bajar un nivel (usa una cola).", visual, true);
  }
  if (b === d) return bfsOrder(r, forms);
  return choice(r, "Recorrido en profundidad (DFS) desde A: ¿en qué orden se visitan?", d, [b, [...nodes].join(" "), ["A", ...dfs().slice(1).reverse()].join(" ")], "DFS avanza lo más hondo posible antes de retroceder (usa una pila).", visual, true);
}

// ---------------------------------------------------------------------------
// SQL avanzado
// ---------------------------------------------------------------------------

const STUDENTS = ["Ana", "Luis", "Rosa", "Hugo", "Sofía"];
const COURSES: [number, string, number][] = [[1, "Python", 4], [2, "Robótica", 3], [3, "Diseño", 2], [4, "Redes", 3]];

export function sqlJoin(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const rows = Array.from({ length: r.int(5, 7) }, () => [r.pick(STUDENTS), r.int(1, 4)] as const);
  const uniq = [...new Map(rows.map((x) => [`${x[0]}-${x[1]}`, x])).values()];
  const visual = code(
    "cursos\nid | curso    | horas\n" + COURSES.map(([id, c, h]) => `${id}  | ${c.padEnd(8)} | ${h}`).join("\n") + "\n\nmatriculas\nalumno | curso_id\n" + uniq.map(([a, c]) => `${a.padEnd(6)} | ${c}`).join("\n")
  );
  if (t === 0) {
    const [id, name] = r.pick(COURSES);
    const n = uniq.filter(([, c]) => c === id).length;
    return num(`¿Qué devuelve?\nSELECT COUNT(*) FROM matriculas JOIN cursos ON matriculas.curso_id = cursos.id WHERE curso = '${name}';`, n, `El JOIN une cada matrícula con su curso; ${n} matrículas son de ${name}.`, visual);
  }
  const who = r.pick(uniq)[0];
  const h = sum(uniq.filter(([a]) => a === who).map(([, c]) => COURSES[c - 1][2]));
  return num(`¿Qué devuelve?\nSELECT SUM(horas) FROM matriculas JOIN cursos ON matriculas.curso_id = cursos.id WHERE alumno = '${who}';`, h, `Suma las horas de los cursos de ${who}: ${h}.`, visual);
}

export function sqlGroupBy(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  const products = r.shuffle(["pan", "leche", "fruta", "queso"]).slice(0, 3);
  const rows = Array.from({ length: 7 }, () => [r.pick(products), r.int(1, 9)] as const);
  const totals: Record<string, number> = {};
  for (const [p, c] of rows) totals[p] = (totals[p] ?? 0) + c;
  const cells = [["producto", "cantidad"], ...rows.map(([p, c]) => [p, String(c)])];
  const visual: Visual = { kind: "sheet", cells };
  if (t === 0) {
    const p = r.pick(Object.keys(totals));
    return num(`SELECT producto, SUM(cantidad) FROM ventas GROUP BY producto;\n¿Qué suma sale para «${p}»?`, totals[p], `GROUP BY junta las filas de cada producto y SUM las suma: ${totals[p]}.`, visual);
  }
  if (t === 1) return num("SELECT producto, COUNT(*) FROM ventas GROUP BY producto;\n¿Cuántas filas tiene el resultado?", Object.keys(totals).length, "Una fila por cada producto distinto.", visual);
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) return sqlGroupBy(r, forms);
  return choice(r, "SELECT producto FROM ventas GROUP BY producto ORDER BY SUM(cantidad) DESC LIMIT 1;\n¿Qué producto devuelve?", sorted[0][0], products, `Tiene la mayor suma (${sorted[0][1]}).`, visual);
}

export function sqlUpdate(r: Rng): Question {
  const names = r.shuffle(STUDENTS).slice(0, 5);
  const notas = names.map(() => r.int(6, 18));
  const k = r.int(1, 3);
  const lim = r.int(10, 13);
  const after = notas.map((n) => (n < lim ? n + k : n));
  return num(
    `UPDATE alumnos SET nota = nota + ${k} WHERE nota < ${lim};\nSELECT SUM(nota) FROM alumnos;\n¿Qué suma devuelve?`,
    sum(after),
    `Solo suben las notas menores que ${lim}: ${after.join(" + ")} = ${sum(after)}.`,
    { kind: "sheet", cells: [["nombre", "nota"], ...names.map((n, i) => [n, String(notas[i])])] }
  );
}

// ---------------------------------------------------------------------------
// Ciencia de datos e IA
// ---------------------------------------------------------------------------

export function kmeansStep(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  if (t === 0) {
    for (;;) {
      const c1 = { x: r.int(0, 2), y: r.int(0, 6) };
      const c2 = { x: r.int(4, 6), y: r.int(0, 6) };
      const p = { x: r.int(1, 5), y: r.int(0, 6) };
      const d1 = (p.x - c1.x) ** 2 + (p.y - c1.y) ** 2;
      const d2 = (p.x - c2.x) ** 2 + (p.y - c2.y) ** 2;
      if (d1 === d2 || (p.x === c1.x && p.y === c1.y) || (p.x === c2.x && p.y === c2.y)) continue;
      const labels = ["Grupo 🟥", "Grupo 🟦"];
      return choice(r, "k-medias: ¿a qué grupo se asigna ❓? (al centro más cercano)", labels[d1 < d2 ? 0 : 1], labels, "Cada punto va al grupo cuyo centro está más cerca.", { kind: "coordPlane", max: 6, points: [{ ...c1, emoji: "🟥" }, { ...c2, emoji: "🟦" }, { ...p, emoji: "❓" }] });
    }
  }
  const xs = Array.from({ length: r.int(3, 4) }, () => r.int(0, 12));
  const s = sum(xs);
  xs[0] += (xs.length - (s % xs.length)) % xs.length;
  const mean = sum(xs) / xs.length;
  return num("k-medias: el nuevo centro es el promedio de sus puntos. ¿Cuál es la coordenada x del nuevo centro?", mean, `(${xs.join(" + ")}) ÷ ${xs.length} = ${mean}.`, code(`x de los puntos del grupo: ${xs.join(", ")}`));
}

export function minMaxNorm(r: Rng): Question {
  const min = r.int(0, 20);
  const range = r.pick([10, 20, 25, 50, 100]);
  const max = min + range;
  const step = range / r.pick([2, 4, 5, 10].filter((d) => range % d === 0));
  const x = min + step * r.int(0, range / step);
  const v = ((x - min) * 100) / range;
  return num(`Normalización min-max (de 0 a 100): datos entre ${min} y ${max}. ¿Cuánto vale ${x} normalizado?`, v, `(${x} − ${min}) ÷ (${max} − ${min}) × 100 = ${v}.`);
}

export function decisionTree(r: Rng): Question {
  const temp = r.int(10, 35);
  const hum = r.int(20, 95);
  const wind = r.chance(0.5);
  const out = temp > 25 ? (hum > 70 ? "🌧️ Lluvia" : "☀️ Sol") : wind ? "💨 Viento" : "☁️ Nublado";
  const tree = ["si temperatura > 25:", "    si humedad > 70: «🌧️ Lluvia»", "    si no: «☀️ Sol»", "si no:", "    si hay viento: «💨 Viento»", "    si no: «☁️ Nublado»"].join("\n");
  return choice(
    r,
    `Árbol de decisión. Hoy: temperatura ${temp} °C, humedad ${hum}%, ${wind ? "con" : "sin"} viento. ¿Qué predice?`,
    out,
    ["🌧️ Lluvia", "☀️ Sol", "💨 Viento", "☁️ Nublado"],
    "Se baja por el árbol respondiendo cada pregunta.",
    code(tree)
  );
}

export function sentiment(r: Rng): Question {
  const pos = ["bueno", "genial", "feliz", "excelente", "rico", "divertido"];
  const neg = ["malo", "aburrido", "triste", "feo", "lento", "caro"];
  const neutral = ["el", "la", "juego", "comida", "es", "fue", "muy", "y", "pero"];
  const words = [...r.shuffle(pos).slice(0, r.int(0, 3)), ...r.shuffle(neg).slice(0, r.int(0, 3)), ...r.shuffle(neutral).slice(0, 3)];
  const sentence = r.shuffle(words).join(" ");
  const score = words.filter((w) => pos.includes(w)).length - words.filter((w) => neg.includes(w)).length;
  const label = score > 0 ? "Positivo 🙂" : score < 0 ? "Negativo 🙁" : "Neutro 😐";
  return choice(r, "Un analizador de sentimiento suma +1 por cada palabra positiva y −1 por cada negativa. ¿Qué resultado da?", label, ["Positivo 🙂", "Negativo 🙁", "Neutro 😐"], `Positivas − negativas = ${score}.`, code(`«${sentence}»\n\nPositivas: ${pos.join(", ")}\nNegativas: ${neg.join(", ")}`));
}

export function confusion(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  for (;;) {
    const tp = r.int(5, 40);
    const fp = r.int(0, 15);
    const fn = r.int(0, 15);
    const tn = r.int(5, 40);
    const visual = code(`                 Predice SÍ   Predice NO\nEs SÍ realmente     ${String(tp).padEnd(10)}   ${fn}\nEs NO realmente     ${String(fp).padEnd(10)}   ${tn}`);
    const pct = (a: number, b: number) => (a * 100) / b;
    if (t === 0 && Number.isInteger(pct(tp + tn, tp + fp + fn + tn))) return num("Matriz de confusión: ¿cuál es la exactitud (%)?", pct(tp + tn, tp + fp + fn + tn), `(VP + VN) ÷ total = (${tp} + ${tn}) ÷ ${tp + fp + fn + tn}.`, visual);
    if (t === 1 && Number.isInteger(pct(tp, tp + fp))) return num("Matriz de confusión: ¿cuál es la precisión (%)? (de lo que predijo SÍ, cuánto acertó)", pct(tp, tp + fp), `VP ÷ (VP + FP) = ${tp} ÷ ${tp + fp}.`, visual);
    if (t === 2 && Number.isInteger(pct(tp, tp + fn))) return num("Matriz de confusión: ¿cuál es la sensibilidad o recall (%)? (de los SÍ reales, cuántos encontró)", pct(tp, tp + fn), `VP ÷ (VP + FN) = ${tp} ÷ ${tp + fn}.`, visual);
  }
}

export function gradientStep(r: Rng): Question {
  const w = r.int(10, 50);
  const lr = r.pick([0.1, 0.5]);
  const g = r.int(1, 8) * (lr === 0.1 ? 10 : 2);
  const nw = w - lr * g;
  return num(`Descenso del gradiente: peso w = ${w}, tasa de aprendizaje ${lr}, gradiente ${g}. ¿Cuál es el nuevo peso? (w − tasa × gradiente)`, nw, `${w} − ${lr} × ${g} = ${nw}. El modelo da un pasito para reducir el error.`);
}

export function markovNext(r: Rng): Question {
  const word = r.pick(["el", "mi", "un", "la"]);
  const nexts = r.shuffle(["gato", "perro", "libro", "auto", "sol", "día"]).slice(0, 4);
  const counts = distinct(r, 4, 1, 12);
  const best = nexts[counts.indexOf(Math.max(...counts))];
  return choice(r, `Un modelo de lenguaje sencillo contó qué palabra viene después de «${word}». ¿Cuál predice como más probable?`, best, nexts, "Elige la palabra que más veces apareció después: así predicen (de forma muy simplificada) los modelos de lenguaje.", code(nexts.map((n, i) => `«${word} ${n}»: ${counts[i]} veces`).join("\n")));
}

export function tokenCount(r: Rng): Question {
  const sentences = [
    "La IA aprende de los datos.", "¿Qué hora es en Lima?", "Hola, me llamo Ana.", "Python es fácil, ¿verdad?", "El robot avanza, gira y para.", "Mañana hay examen de redes.",
    "¡Ganamos el torneo!", "Los gatos duermen, comen y juegan.", "¿Puedes ayudarme, por favor?", "El modelo predijo: lluvia.", "Hoy, en Cusco, hace frío.",
    "Mi clave es secreta.", "¿Cuántos bytes tiene un kilobyte?", "La red neuronal tiene tres capas.", "Primero, piensa; luego, programa.", "¡Hola! ¿Cómo estás?",
  ];
  const s = r.pick(sentences);
  const tokens = s.match(/[\wáéíóúñÁÉÍÓÚÑ]+|[^\s\w]/g)!;
  return num(`Un tokenizador simple separa cada palabra y cada signo de puntuación. ¿Cuántos tokens tiene la oración?`, tokens.length, `Tokens: ${tokens.map((x) => `«${x}»`).join(" ")}.`, code(s));
}

// ---------------------------------------------------------------------------
// Autómatas y teoría de la computación
// ---------------------------------------------------------------------------

export function automaton(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  const states = ["q0", "q1", "q2"];
  const delta: Record<string, Record<string, string>> = {};
  for (const s of states) delta[s] = { a: r.pick(states), b: r.pick(states) };
  const accept = r.pick(states.slice(1));
  const input = Array.from({ length: r.int(3, 6) }, () => r.pick(["a", "b"])).join("");
  let s = "q0";
  for (const c of input) s = delta[s][c];
  const visual = code(["Estado | con a | con b", ...states.map((x) => `${x.padEnd(6)} | ${delta[x].a.padEnd(5)} | ${delta[x].b}`), `Inicio: q0   Acepta en: ${accept}`].join("\n"));
  if (t === 0) return choice(r, `Autómata finito: lee «${input}» desde q0. ¿En qué estado termina?`, s, states, "Se sigue la tabla letra por letra.", visual, true);
  return choice(r, `Autómata finito: ¿acepta la cadena «${input}»?`, s === accept ? "Sí, la acepta" : "No, la rechaza", ["Sí, la acepta", "No, la rechaza"], `Termina en ${s}; acepta solo si termina en ${accept}.`, visual);
}

// ---------------------------------------------------------------------------
// Web
// ---------------------------------------------------------------------------

export function jsOutput(r: Rng, forms?: number[]): Question {
  const t = form(r, 3, forms);
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  if (t === 0) return num("¿Qué muestra la consola?", a * 2 + b, `x vale ${a}; luego ${a * 2}; luego ${a * 2 + b}.`, code(`let x = ${a};\nx = x * 2;\nx += ${b};\nconsole.log(x);`), "js-out");
  if (t === 1) return choice(r, "¿Qué muestra la consola?", `${a}${b}`, [`${a + b}`, `"${a}" + ${b}`, "NaN"], "En JavaScript, texto + número une como texto.", code(`console.log("${a}" + ${b});`), true, "js-out");
  if (t === 2) {
    const n = r.int(3, 7);
    return num("¿Qué muestra la consola?", (n * (n - 1)) / 2, `Suma de 0 a ${n - 1}.`, code(`let s = 0;\nfor (let i = 0; i < ${n}; i++) {\n  s += i;\n}\nconsole.log(s);`), "js-out");
  }
  const xs = Array.from({ length: 4 }, () => r.int(1, 9));
  return num("¿Qué muestra la consola?", xs.filter((x) => x > 4).length, "filter deja los mayores que 4 y length los cuenta.", code(`const nums = [${xs.join(", ")}];\nconsole.log(nums.filter(n => n > 4).length);`), "js-out");
}

export function cssSelector(r: Rng): Question {
  const tags = Array.from({ length: 6 }, () => ({ tag: r.pick(["p", "h2", "li"]), cls: r.pick(["", "rojo", "azul"]), id: "" }));
  tags[r.int(0, 5)].id = "titulo";
  const html = tags.map((x) => `<${x.tag}${x.id ? ` id="${x.id}"` : ""}${x.cls ? ` class="${x.cls}"` : ""}>…</${x.tag}>`).join("\n");
  const sel = r.pick([".rojo", ".azul", "p", "li", "h2", "#titulo", "p.rojo", "li.azul"]);
  const match = (x: (typeof tags)[number]) => {
    if (sel.startsWith("#")) return x.id === sel.slice(1);
    if (sel.startsWith(".")) return x.cls === sel.slice(1);
    const [tag, cls] = sel.split(".");
    return x.tag === tag && (!cls || x.cls === cls);
  };
  const n = tags.filter(match).length;
  return num(`¿A cuántos elementos aplica el selector CSS «${sel} { color: red; }»?`, n, `«.» elige por clase, «#» por id y el nombre por etiqueta: ${n}.`, code(html));
}

// ---------------------------------------------------------------------------
// Robótica: micro:bit
// ---------------------------------------------------------------------------

export function microbit(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const k = r.int(1, 3);
    const presses = Array.from({ length: r.int(4, 7) }, () => r.pick(["A", "A", "B"]));
    let c = 0;
    for (const p of presses) c = p === "A" ? c + k : 0;
    if (presses[presses.length - 1] === "B" || c === 0) return microbit(r, forms);
    const prog = ["al iniciar: contador = 0", `al presionar botón A: contador = contador + ${k}`, "al presionar botón B: contador = 0", "para siempre: mostrar número contador"].join("\n");
    return num(`Se presionan los botones: ${presses.join(", ")}. ¿Qué número muestra la micro:bit?`, c, "B reinicia el contador a 0; cada A suma.", code(prog));
  }
  if (t === 1) {
    const lo = r.int(40, 90);
    const hi = lo + r.int(60, 120);
    const light = r.int(0, 255);
    const out = light < lo ? "🌙" : light > hi ? "☀️" : "🙂";
    const prog = [`si nivel de luz < ${lo}: mostrar 🌙`, `si no, si nivel de luz > ${hi}: mostrar ☀️`, "si no: mostrar 🙂"].join("\n");
    return choice(r, `El sensor de luz mide ${light} (de 0 a 255). ¿Qué muestra?`, out, ["🌙", "☀️", "🙂"], `${light} ${light < lo ? `< ${lo}` : light > hi ? `> ${hi}` : `está entre ${lo} y ${hi}`}.`, code(prog));
  }
  const n = r.int(3, 6);
  const step = r.int(2, 5);
  const prog = ["al iniciar: total = 0", `repetir ${n} veces:`, `    total = total + ${step}`, "    mostrar número total", "    pausa 500 ms"].join("\n");
  return num("¿Qué número muestra la micro:bit al final?", n * step, `${n} vueltas sumando ${step}.`, code(prog));
}

// ---------------------------------------------------------------------------
// Lógica: tablas de verdad de 3 variables
// ---------------------------------------------------------------------------

export function truthTable3(r: Rng): Question {
  const exprs: [string, (a: number, b: number, c: number) => number][] = [
    ["(A AND B) OR C", (a, b, c) => (a & b) | c],
    ["A AND (B OR C)", (a, b, c) => a & (b | c)],
    ["(A OR B) AND NOT C", (a, b, c) => (a | b) & (1 - c)],
    ["A XOR B XOR C", (a, b, c) => a ^ b ^ c],
    ["NOT A AND (B OR C)", (a, b, c) => (1 - a) & (b | c)],
    ["(A AND B) OR (B AND C)", (a, b, c) => (a & b) | (b & c)],
    ["A OR (B AND NOT C)", (a, b, c) => a | (b & (1 - c))],
    ["NOT (A OR B) OR C", (a, b, c) => (1 - (a | b)) | c],
  ];
  const [e, f] = r.pick(exprs);
  let ones = 0;
  for (let i = 0; i < 8; i++) ones += f(i >> 2, (i >> 1) & 1, i & 1);
  const t = r.int(0, 1);
  if (t === 0) return num(`En la tabla de verdad de «${e}» (8 filas), ¿en cuántas filas la salida es 1?`, ones, `Revisando las 8 combinaciones de A, B y C: ${ones} dan 1.`);
  const a = r.int(0, 1);
  const b = r.int(0, 1);
  const c = r.int(0, 1);
  return { kind: "choice", prompt: `¿Cuánto vale «${e}» con A = ${a}, B = ${b}, C = ${c}?`, options: ["0", "1"], answer: String(f(a, b, c)), explanation: `Se resuelve primero el paréntesis: resultado ${f(a, b, c)}.` };
}

// ---------------------------------------------------------------------------
// Scratch (sintaxis scratchblocks en inglés)
// ---------------------------------------------------------------------------

const FLAG = "when flag clicked";
const scratch = (lines: string[], title?: string): Visual => ({ kind: "scratch", code: lines.join("\n"), title });

export function scratchClones(r: Rng): Question {
  const a = r.int(2, 8);
  const k = r.int(1, 5);
  const code = [FLAG, "set [total v] to (0)", "hide", `repeat (${a})`, "create clone of (mí mismo v)", "end", "", "when I start as a clone", `change [total v] by (${k})`, "show"];
  return num("¿Cuánto vale «total» cuando todos los clones empezaron?", a * k, `Se crean ${a} clones y cada uno suma ${k}.`, scratch(code));
}

export function scratchAskJoin(r: Rng): Question {
  const name = r.pick(["Ana", "Luis", "Rosa", "Hugo", "Mateo", "Lucía"]);
  const t = r.int(0, 1);
  if (t === 0) {
    const greet = r.pick(["Hola ", "Bienvenido ", "Hola, "]);
    const code = [FLAG, "ask [¿Cómo te llamas?] and wait", `say (join [${greet}] (answer))`];
    return choice(r, `El usuario escribe «${name}». ¿Qué dice el objeto?`, `${greet}${name}`, [`${greet}answer`, `${greet}respuesta`, `${name}${greet}`.trim(), `${greet}¿Cómo te llamas?`], "«respuesta» guarda lo que escribió el usuario.", scratch(code));
  }
  const n = r.int(2, 30);
  const k = r.int(2, 9);
  const code = [FLAG, "ask [Escribe un número] and wait", `say ((answer) * (${k}))`];
  return num(`El usuario escribe ${n}. ¿Qué número dice el objeto?`, n * k, `${n} × ${k} = ${n * k}.`, scratch(code));
}

export function scratchBroadcast(r: Rng): Question {
  const a = r.int(1, 9);
  const b = r.int(2, 5);
  const c = r.int(1, 9);
  const code = [FLAG, `set [puntos v] to (${a})`, "broadcast (doblar v) and wait", `change [puntos v] by (${c})`, "say (puntos)", "", "when I receive [doblar v]", `set [puntos v] to ((puntos) * (${b}))`];
  return num("Con «enviar y esperar», el programa espera a que terminen los que reciben. ¿Qué número dice?", a * b + c, `${a} × ${b} = ${a * b}; luego + ${c} = ${a * b + c}.`, scratch(code));
}

export function scratchMotion(r: Rng): Question {
  const x0 = r.int(-10, 10) * 10;
  const moves = Array.from({ length: r.int(2, 3) }, () => r.int(-6, 6) * 10).filter(Boolean);
  if (!moves.length) return scratchMotion(r);
  const reps = r.int(2, 4);
  const per = sum(moves);
  const final = x0 + per * reps;
  if (final < 0 || final > 240) return scratchMotion(r);
  const code = [FLAG, `set x to (${x0})`, `repeat (${reps})`, ...moves.map((m) => `change x by (${m})`), "end", "say (x position)"];
  return num("¿Qué posición x dice el objeto?", final, `Cada vuelta cambia x en ${per}; ${reps} vueltas desde ${x0}: ${final}.`, scratch(code));
}

export function scratchMathBlocks(r: Rng, forms?: number[]): Question {
  const t = form(r, 2, forms);
  if (t === 0) {
    const x = r.int(1, 30) + r.pick([0.2, 0.4, 0.6, 0.8]);
    return num("¿Qué número dice el objeto?", Math.round(x), "«redondear» lleva al entero más cercano.", scratch([FLAG, `say (round (${x}))`]));
  }
  if (t === 1) {
    const a = r.int(1, 40);
    const b = r.int(a + 1, a + 40);
    return num("¿Qué número dice el objeto?", b - a, `${a} − ${b} es negativo; «abs» (valor absoluto) lo vuelve positivo: ${b - a}.`, scratch([FLAG, `say ([abs v] of ((${a}) - (${b})))`]));
  }
  const n = r.int(2, 12);
  return num("¿Qué número dice el objeto?", n, `La raíz cuadrada de ${n * n} es ${n}.`, scratch([FLAG, `say ([sqrt v] of (${n * n}))`]));
}

// ---------------------------------------------------------------------------
// Detección de errores: suma de verificación y dígito de Luhn
// ---------------------------------------------------------------------------

export function checksum(r: Rng, forms?: number[]): Question {
  const t = form(r, 1, forms);
  if (t === 0) {
    const bytes = Array.from({ length: r.int(4, 6) }, () => r.int(20, 250));
    const total = sum(bytes);
    return num(
      "Suma de verificación: suma todos los bytes y quédate con el resto al dividir entre 256. ¿Qué checksum se envía?",
      total % 256,
      `Suma = ${total}; ${total} mod 256 = ${total % 256}. El receptor repite la cuenta y compara.`,
      code(bytes.join("  "))
    );
  }
  const digits = Array.from({ length: r.int(5, 8) }, () => r.int(0, 9));
  // Luhn: desde la derecha, se duplica uno sí y uno no (empezando por el último dígito dado).
  const total = sum(
    [...digits].reverse().map((d, i) => {
      if (i % 2 === 1) return d;
      const x = d * 2;
      return x > 9 ? x - 9 : x;
    })
  );
  const check = (10 - (total % 10)) % 10;
  return num(
    `Algoritmo de Luhn (tarjetas): ¿qué dígito de control va al final de ${digits.join("")}?`,
    check,
    `Desde la derecha se duplica un dígito sí y otro no (si pasa de 9, se resta 9). Suma = ${total}; (10 − ${total % 10}) mod 10 = ${check}.`,
    code(`Dígitos: ${digits.join(" ")} _\nDuplicar desde la derecha: el último, el antepenúltimo, ...`)
  );
}
