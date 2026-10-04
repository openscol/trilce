import type { ChoiceItem, InSentenceItem, Passage } from "../../../generators/lengua/bank";
import type { Rng } from "../../../rng";
import type { Question } from "../../../types";

// Formas cortas de escribir los bancos de preguntas de 3.°.

// Texto + respuesta + distractores.
export const f = (t: string, a: string, ...d: string[]): ChoiceItem => ({ t, a, d });
// Enunciado propio + respuesta + distractores.
export const w = (p: string, a: string, ...d: string[]): ChoiceItem => ({ p, a, d });
// Enunciado propio + texto + respuesta + distractores.
export const pt = (p: string, t: string, a: string, ...d: string[]): ChoiceItem => ({ p, t, a, d });
// Oración + palabras que hay que marcar.
export const s = (sentence: string, ...ans: string[]): InSentenceItem => ({ s: sentence, ans });

// Pares [lo que se muestra, respuesta]: los distractores son las respuestas de los demás pares.
export const pool = (list: [string, string][], show: "t" | "p" | "pic" = "t"): ChoiceItem[] =>
  list.map(([x, a]) => ({ [show]: x, a, d: [...new Set(list.map((y) => y[1]))].filter((y) => y !== a) }) as ChoiceItem);

// Clasificar en categorías fijas: las opciones son siempre las mismas.
export const sorter = (options: string[], p?: string) => (t: string, i: number): ChoiceItem => ({ t, p, a: options[i], d: options.filter((_, k) => k !== i), tag: options[i] });

// Lectura con sus preguntas: [pregunta, respuesta, ...distractores].
export const read = (title: string, emoji: string, text: string, ...qs: [string, string, ...string[]][]): Passage => ({
  title,
  emoji,
  text,
  qs: qs.map(([q, a, ...d]) => ({ q, a, d })),
});

// Ordenar alfabéticamente 4 palabras de un grupo.
export function abcOrder(r: Rng, groups: string[][], hint: string): Question {
  const words = r.shuffle(r.pick(groups)).slice(0, 4);
  const sorted = [...words].sort((a, b) => a.localeCompare(b, "es"));
  const tiles = words.every((x, i) => x === sorted[i]) ? [...words.slice(1), words[0]] : words;
  return { kind: "sequence", prompt: `Ordena las palabras alfabéticamente. ${hint}`, tiles, reuse: false, length: 4, answer: sorted, explanation: `El orden alfabético es: ${sorted.join(", ")}.` };
}
