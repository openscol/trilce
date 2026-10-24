import type { Curriculum, Section, Skill } from "../../types";
import type { Row as BankRow } from "./p3/row";

// Arma un grado de Comunicación organizado según el CNEB. Los bloques de cada
// grado (lectura, escritura, gramática...) son bancos de juegos: cada uno
// exporta `ROWS` con una clave interna y su generador. El índice del grado
// decide las secciones (con su tema del CNEB) y qué juegos ve el alumno, cada
// uno con su propio id y título; un juego puede juntar varios generadores del
// banco y elige uno al azar en cada pregunta.

type Gen = Skill["generate"];
export const X = "extendido" as const;
export type Game = [id: string, section: string, title: string, keys: string[], extended?: typeof X];

export function cnebCurriculum(
  blocks: { ROWS: BankRow[] }[],
  sections: Section[],
  games: Game[],
  wrap: (key: string, gen: Gen) => Gen = (_, gen) => gen
): Curriculum {
  const bank = new Map<string, Gen>();
  for (const b of blocks) for (const [key, , generate] of b.ROWS) bank.set(key, wrap(key, generate));
  const skills: Skill[] = games.map(([id, section, title, keys, extended]) => {
    const gens = keys.map((k) => {
      const gen = bank.get(k);
      if (!gen) throw new Error(`Comunicación: el juego ${id} usa la clave inexistente ${k}`);
      return gen;
    });
    const sec = sections.find((s) => s.id === section);
    if (!sec) throw new Error(`Comunicación: el juego ${id} usa la sección inexistente ${section}`);
    return { id, section, title, icon: sec.icon, extended: !!extended, generate: (r) => r.pick(gens)(r) };
  });
  return { sections, skills };
}

// Claves del banco que ningún juego usa (lo comprueba el script de cobertura).
export function unusedKeys(blocks: { ROWS: BankRow[] }[], games: Game[]) {
  const used = new Set(games.flatMap((g) => g[3]));
  return blocks.flatMap((b) => b.ROWS.map((row) => row[0])).filter((k) => !used.has(k));
}
