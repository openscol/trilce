import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { uniqueOptions } from "../common";
import { graphemes } from "./phonics";
import { baseVowel, word } from "./words";

// Fundamentos de lectura desde 2.°: quitar sonidos, adivinanzas para
// deletrear, sílabas abiertas y cerradas, separar en sílabas cualquier
// palabra, escuchar y elegir, y deletrear al dictado.

const pickSome = <T,>(r: Rng, pool: T[], n: number) => r.shuffle(pool).slice(0, n);

// «plato» sin /l/ → «pato».
export const DELETE_SOUND: [from: string, removed: string, to: string][] = [
  ["casa", "c", "asa"], ["pala", "p", "ala"], ["rosa", "r", "osa"], ["boca", "b", "oca"], ["sola", "s", "ola"],
  ["luna", "l", "una"], ["globo", "g", "lobo"], ["prisa", "p", "risa"], ["plato", "l", "pato"], ["pluma", "l", "puma"],
  ["plata", "l", "pata"], ["trota", "t", "rota"], ["cabra", "b", "cara"], ["brisa", "b", "risa"], ["flecha", "l", "fecha"],
  ["blanco", "l", "banco"], ["claro", "l", "caro"], ["tren", "r", "ten"],
];

export function deleteSound(r: Rng): Question {
  const [from, removed, to] = r.pick(DELETE_SOUND);
  const others = DELETE_SOUND.map((x) => x[2]).filter((w) => w !== to && Math.abs(w.length - to.length) <= 1);
  return {
    kind: "choice",
    prompt: `Quita el sonido /${removed}/ de «${from}». ¿Qué palabra queda?`,
    options: uniqueOptions(r, to, [from, ...pickSome(r, others, 3)]),
    answer: to,
    explanation: `«${from}» sin /${removed}/ es «${to}».`,
    speak: from,
  };
}

// Deletrear con fichas la respuesta de una pista (adivinanza con rima).
export function spellFromClue(r: Rng, items: { clue: string; w: string }[], prompt = "Lee la adivinanza y escribe la respuesta. Toca las letras en orden."): Question {
  const item = r.pick(items);
  const g = graphemes(item.w);
  const pool = "a e i o u m l p s t r n d c".split(" ").filter((c) => !g.includes(c));
  return {
    kind: "sequence",
    prompt,
    visual: { kind: "text", text: item.clue },
    tiles: r.shuffle([...new Set(g), ...pickSome(r, pool, 2)]),
    reuse: true,
    length: g.length,
    answer: g,
    explanation: `La respuesta es «${item.w}».`,
  };
}

// Sílaba abierta (termina en vocal) o cerrada (termina en consonante).
export const OPEN = "Abierta (termina en vocal)";
export const CLOSED = "Cerrada (termina en consonante)";

export function openClosed(r: Rng, list: string): Question {
  const x = word(r.pick(list.split(" ")));
  const i = r.int(0, x.syl.length - 1);
  const syl = x.syl[i];
  const open = baseVowel(syl[syl.length - 1]) !== null;
  return {
    kind: "choice",
    prompt: `${x.syl.join(" - ")}. ¿Cómo es la sílaba «${syl}»?`,
    visual: { kind: "picture", emoji: x.e, caption: x.w },
    options: [OPEN, CLOSED],
    answer: open ? OPEN : CLOSED,
    explanation: open ? `«${syl}» termina en vocal: es una sílaba abierta.` : `«${syl}» termina en consonante: es una sílaba cerrada.`,
    speak: x.w,
    tag: open ? "abierta" : "cerrada",
  };
}

// Separar en sílabas una palabra escrita con guiones: "ta-bla".
export function segmentList(r: Rng, list: string): Question {
  const syl = r.pick(list.split(" ")).split("-");
  const w = syl.join("");
  const answer = syl.join("-");
  const cuts = syl.slice(0, -1).reduce<number[]>((acc, s) => [...acc, (acc[acc.length - 1] ?? 0) + s.length], []);
  const render = (cs: number[]) => {
    const out: string[] = [];
    let prev = 0;
    for (const c of cs) {
      out.push(w.slice(prev, c));
      prev = c;
    }
    out.push(w.slice(prev));
    return out.join("-");
  };
  const wrong = new Set<string>();
  for (let k = 0; k < cuts.length; k++) {
    for (const d of [-1, 1, -2]) {
      const cs = [...cuts];
      cs[k] += d;
      const ok = cs.every((c, i) => c > 0 && c < w.length && (i === 0 || c > cs[i - 1]));
      if (ok) wrong.add(render(cs));
    }
  }
  if (cuts.length > 1) wrong.add(render(cuts.slice(1)));
  wrong.delete(answer);
  return {
    kind: "choice",
    prompt: `¿Cómo se separa «${w}» en sílabas?`,
    options: uniqueOptions(r, answer, [...wrong]),
    answer,
    explanation: `${answer}: ${syl.length} sílabas.`,
    speak: w,
  };
}

// Escuchar una palabra y elegirla entre otras parecidas.
export function listenChoose(r: Rng, list: string): Question {
  const pool = list.split(" ");
  const w = r.pick(pool);
  return {
    kind: "choice",
    prompt: "Toca 🔊, escucha y elige la palabra.",
    options: uniqueOptions(r, w, pool.filter((x) => x !== w)),
    answer: w,
    explanation: `La palabra era «${w}».`,
    speak: w,
    tag: w,
  };
}

// Dictado con fichas: escuchar y escribir la palabra.
export function spellHeard(r: Rng, list: string, extras = "a e i o u m l p s t r n"): Question {
  const w = r.pick(list.split(" "));
  const g = graphemes(w);
  const pool = extras.split(" ").filter((c) => !g.includes(c));
  return {
    kind: "sequence",
    prompt: "Toca 🔊, escucha y escribe la palabra.",
    tiles: r.shuffle([...new Set(g), ...pickSome(r, pool, 2)]),
    reuse: true,
    length: g.length,
    answer: g,
    explanation: `Se escribe «${w}».`,
    speak: w,
  };
}
