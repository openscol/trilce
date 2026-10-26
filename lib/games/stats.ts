import { getSkill } from "./catalog";
import { resolveSkillUid } from "./legacy-ids";

export type AttemptRow = { skill_id: string; tag: string | null; is_correct: boolean; answered_at: string };

export type SkillStat = {
  skillId: string;
  total: number;
  correct: number;
  accuracy: number;
  lastAt: string;
  weakTags: { tag: string; total: number; accuracy: number }[];
};

export const WEAK_ACCURACY = 0.7;
export const MIN_ATTEMPTS = 3;

export function aggregate(rows: AttemptRow[]): Map<string, SkillStat> {
  const bySkill = new Map<string, AttemptRow[]>();
  // Los ids antiguos se suman al juego actual que los reemplaza.
  for (const r of rows) {
    const uid = resolveSkillUid(r.skill_id);
    const list = bySkill.get(uid) ?? [];
    list.push(r);
    bySkill.set(uid, list);
  }
  const out = new Map<string, SkillStat>();
  for (const [skillId, list] of bySkill) {
    const correct = list.filter((r) => r.is_correct).length;
    const tags = new Map<string, { total: number; correct: number }>();
    for (const r of list) {
      if (!r.tag) continue;
      const t = tags.get(r.tag) ?? { total: 0, correct: 0 };
      t.total += 1;
      if (r.is_correct) t.correct += 1;
      tags.set(r.tag, t);
    }
    out.set(skillId, {
      skillId,
      total: list.length,
      correct,
      accuracy: correct / list.length,
      lastAt: list.reduce((m, r) => (r.answered_at > m ? r.answered_at : m), list[0].answered_at),
      weakTags: [...tags.entries()]
        .map(([tag, t]) => ({ tag, total: t.total, accuracy: t.correct / t.total }))
        .filter((t) => t.total >= 2 && t.accuracy < WEAK_ACCURACY)
        .sort((a, b) => a.accuracy - b.accuracy),
    });
  }
  return out;
}

export function skillTitle(uid: string) {
  return getSkill(uid)?.title ?? uid;
}

// Tiempo aproximado de juego: dentro de cada partida se suman los intervalos
// entre una respuesta y la siguiente, con un tope de 120 s (si tardó más, se
// distrajo), más 20 s por la primera pregunta. Es la misma regla que la función
// game_player_stats (migración A05).
export const GAP_CAP_SECONDS = 120;
export const FIRST_ANSWER_SECONDS = 20;

export function estimatedSeconds(rows: { session_id: string; answered_at: string }[]) {
  const bySession = new Map<string, number[]>();
  for (const r of rows) {
    const list = bySession.get(r.session_id) ?? [];
    list.push(new Date(r.answered_at).getTime());
    bySession.set(r.session_id, list);
  }
  let total = 0;
  for (const times of bySession.values()) {
    times.sort((a, b) => a - b);
    total += FIRST_ANSWER_SECONDS;
    for (let i = 1; i < times.length; i++) total += Math.min((times[i] - times[i - 1]) / 1000, GAP_CAP_SECONDS);
  }
  return Math.round(total);
}

// «1 h 25 min», «12 min», «menos de 1 min».
export function formatDuration(seconds: number) {
  const min = Math.round(seconds / 60);
  if (min < 1) return "menos de 1 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return min % 60 ? `${h} h ${min % 60} min` : `${h} h`;
}

// Inicio del periodo del ranking: «7» o «30» días atrás, o null (desde siempre).
export function periodSince(period: string): string | null {
  const days = Number(period);
  return Number.isFinite(days) && days > 0 ? new Date(Date.now() - days * 86_400_000).toISOString() : null;
}
