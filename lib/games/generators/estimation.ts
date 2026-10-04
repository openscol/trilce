import type { Rng } from "../rng";
import type { Question } from "../types";
import { uniqueOptions } from "./common";

// Estimaciones (3.° en adelante): redondear y luego calcular.

function num(answer: number, prompt: string, text: string, explanation: string, tag?: string): Question {
  return { kind: "number", prompt, visual: { kind: "text", text }, answer, explanation, tag };
}

// Número de tres cifras que no queda justo en medio de dos centenas.
function threeDigit(r: Rng, min = 110, max = 889): number {
  const n = r.int(min, max);
  return n % 100 === 50 ? n + 1 : n;
}
const toHundred = (n: number) => Math.round(n / 100) * 100;
const toTen = (n: number) => Math.round(n / 10) * 10;

// 3.° U.2 / U.3: estimar sumas y restas redondeando a la centena.
export function estimateHundreds(r: Rng, op: "+" | "−"): Question {
  let a = threeDigit(r, 110, op === "+" ? 640 : 889);
  let b = threeDigit(r, 110, op === "+" ? 949 - toHundred(a) : 889);
  if (op === "−" && a < b) [a, b] = [b, a];
  const answer = op === "+" ? toHundred(a) + toHundred(b) : toHundred(a) - toHundred(b);
  return num(
    answer,
    `Redondea cada número a la centena más cercana y luego ${op === "+" ? "suma" : "resta"}.`,
    `${a} ${op} ${b} ≈ ?`,
    `${a} ≈ ${toHundred(a)} y ${b} ≈ ${toHundred(b)}; ${toHundred(a)} ${op} ${toHundred(b)} = ${answer}.`,
    op === "+" ? "suma" : "resta"
  );
}

// 3.° U.4: estimar productos redondeando a la decena.
export function estimateProduct(r: Rng): Question {
  let b = r.int(11, 98);
  if (b % 10 === 5) b += 1;
  const a = r.int(2, 9);
  const answer = a * toTen(b);
  return num(answer, "Redondea el número de dos cifras a la decena más cercana y luego multiplica.", `${b} × ${a} ≈ ?`, `${b} ≈ ${toTen(b)}; ${toTen(b)} × ${a} = ${answer}.`);
}

// 3.° U.5: estimar cocientes con números compatibles.
export function estimateQuotient(r: Rng): Question {
  const d = r.int(2, 9);
  const q = r.int(2, 9) * 10;
  const offset = r.pick([-1, 1]) * r.int(1, Math.max(1, d - 1));
  const dividend = d * q + offset;
  const answer = String(q);
  return {
    kind: "choice",
    prompt: `¿Cuál es la mejor estimación de ${dividend} ÷ ${d}?`,
    visual: { kind: "text", text: `${dividend} ÷ ${d} ≈ ?` },
    options: uniqueOptions(r, answer, [String(q + 10), String(Math.max(10, q - 10)), String(q + 20), String(q * 10), String(q / 10)].filter((x) => x !== answer)),
    answer,
    explanation: `${dividend} está cerca de ${d * q}, que se divide fácil: ${d * q} ÷ ${d} = ${q}.`,
  };
}
